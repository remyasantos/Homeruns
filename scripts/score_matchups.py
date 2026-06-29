#!/usr/bin/env python3
"""
score_matchups.py — computes per-batter matchup scores for every game on today's slate.
Reads:  scripts/raw_slate.json
        scripts/savant_data.json  (optional; degrades gracefully if missing)
Writes: scripts/matchups.json
"""

import json
import sys
import os
import math

try:
    import statsapi
    HAS_STATSAPI = True
except ImportError:
    HAS_STATSAPI = False
    print("⚠ statsapi not available — batter handedness will default to 'R'")

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_SLATE_PATH   = os.path.join(SCRIPT_DIR, "raw_slate.json")
SAVANT_PATH      = os.path.join(SCRIPT_DIR, "savant_data.json")
OUTPUT_PATH      = os.path.join(SCRIPT_DIR, "matchups.json")

# ---------------------------------------------------------------------------
# Load inputs
# ---------------------------------------------------------------------------

try:
    with open(RAW_SLATE_PATH) as fh:
        slate = json.load(fh)
except FileNotFoundError:
    print(f"❌ {RAW_SLATE_PATH} not found — exiting")
    sys.exit(1)
except Exception as exc:
    print(f"❌ Could not parse raw_slate.json: {exc}")
    sys.exit(1)

if slate.get("status") == "no-games":
    print("⚠ No games today — writing empty matchups.json")
    out = {
        "date":          slate.get("date", ""),
        "label":         slate.get("label", ""),
        "games":         [],
        "pitchers_slate": [],
    }
    with open(OUTPUT_PATH, "w") as fh:
        json.dump(out, fh, indent=2)
    sys.exit(0)

try:
    with open(SAVANT_PATH) as fh:
        savant = json.load(fh)
    HAS_SAVANT = True
    print(f"✓ Loaded savant_data.json")
except FileNotFoundError:
    savant = {}
    HAS_SAVANT = False
    print("⚠ savant_data.json not found — using fallback scoring")
except Exception as exc:
    savant = {}
    HAS_SAVANT = False
    print(f"⚠ Could not parse savant_data.json ({exc}) — using fallback scoring")

# Savant sub-dicts (may be absent even if the file exists)
savant_pitchers = savant.get("pitchers", {})
savant_batters  = savant.get("batters", {})

# ---------------------------------------------------------------------------
# Slate structures
# ---------------------------------------------------------------------------

games_raw        = slate.get("games", [])
pitcher_stats_raw = slate.get("pitcher_stats", {})
players_by_team  = slate.get("players_by_team", {})
weather_map      = slate.get("weather", {})
park_hr_ranks    = slate.get("park_hr_ranks", {})

# ---------------------------------------------------------------------------
# Batter handedness cache — avoid repeated statsapi calls
# ---------------------------------------------------------------------------

_stands_cache: dict = {}

def get_batter_stands(pid: int) -> str:
    """Return 'L', 'R', or 'S' (switch) for a batter, using savant then statsapi."""
    pid_str = str(pid)
    if pid_str in _stands_cache:
        return _stands_cache[pid_str]

    # 1. Try savant first
    if pid_str in savant_batters:
        sv = savant_batters[pid_str]
        stands = sv.get("stands") or sv.get("bat_side") or sv.get("batSide")
        if stands:
            _stands_cache[pid_str] = stands[0].upper()
            return _stands_cache[pid_str]

    # 2. Try statsapi
    if HAS_STATSAPI:
        try:
            info = statsapi.player_stat_data(pid, group="hitting", type="season")
            stands = info.get("batSide", {}).get("code", "R")
            _stands_cache[pid_str] = stands
            return stands
        except Exception:
            pass

    _stands_cache[pid_str] = "R"
    return "R"

# ---------------------------------------------------------------------------
# Wind detection helper
# ---------------------------------------------------------------------------

_WIND_OUT_WORDS = {"out", "lf", "cf", "rf", "center", "left", "right"}

def is_wind_out(wind_dir: str) -> bool:
    if not wind_dir:
        return False
    low = wind_dir.lower()
    return any(w in low for w in _WIND_OUT_WORDS)

# ---------------------------------------------------------------------------
# Pitcher data helpers
# ---------------------------------------------------------------------------

def _fb(v, default=0.0):
    """Safe float conversion."""
    try:
        return float(v) if v not in (None, "", "-", "---", ".---") else default
    except (TypeError, ValueError):
        return default


def get_pitcher_throws(pid: int) -> str:
    """Return 'R' or 'L' for pitcher hand."""
    pid_str = str(pid)
    if pid_str in savant_pitchers:
        sv = savant_pitchers[pid_str]
        throws = sv.get("throws") or sv.get("pitch_hand") or sv.get("pitchHand")
        if throws:
            return throws[0].upper()

    if HAS_STATSAPI and pid:
        try:
            results = statsapi.lookup_player(pid)
            if results:
                return results[0].get("pitchHand", {}).get("code", "R")
        except Exception:
            pass
    return "R"


def build_pitcher_savant(pid: int) -> dict:
    """Return savant pitcher dict (or {}) for a given pitcher id."""
    pid_str = str(pid)
    return savant_pitchers.get(pid_str, {})


def pitcher_score_from_savant(sv: dict) -> float:
    """
    Compute pitcher_score (0-100, higher = harder to HR off) from savant data.
    Higher values = better / harder pitcher.
    """
    xwoba       = _fb(sv.get("xwoba"), 0.318)
    swstr_pct   = _fb(sv.get("swstr_pct"), 10.0)
    barrel_pct  = _fb(sv.get("barrel_pct"), 7.0)
    hard_hit_pct = _fb(sv.get("hard_hit_pct"), 38.0)

    score = (
        max(0.0, min(35.0, (0.390 - xwoba) / 0.190 * 35.0)) +
        max(0.0, min(30.0, swstr_pct / 18.0 * 30.0)) +
        max(0.0, min(20.0, (14.0 - barrel_pct) / 12.0 * 20.0)) +
        max(0.0, min(15.0, (52.0 - hard_hit_pct) / 27.0 * 15.0))
    )
    return round(score, 1)


def pitcher_score_from_raw(raw: dict) -> float:
    """Fallback pitcher_score using raw ERA/WHIP/K9."""
    era  = _fb(raw.get("era"), 4.50)
    k9   = _fb(raw.get("k9"), 7.0)

    # Approximate savant-like metrics
    xwoba       = max(0.220, min(0.420, era * 0.052 + 0.215))
    swstr_pct   = max(5.0, k9 / 9.0 * 100.0 * 0.45)
    barrel_pct  = max(4.0, (era - 3.0) * 1.5 + 7.0)
    hard_hit_pct = max(30.0, era * 4.0 + 22.0)

    score = (
        max(0.0, min(35.0, (0.390 - xwoba) / 0.190 * 35.0)) +
        max(0.0, min(30.0, swstr_pct / 18.0 * 30.0)) +
        max(0.0, min(20.0, (14.0 - barrel_pct) / 12.0 * 20.0)) +
        max(0.0, min(15.0, (52.0 - hard_hit_pct) / 27.0 * 15.0))
    )
    return round(score, 1)


def strikeout_score_from_savant(sv: dict) -> float:
    """Compute strikeout_score (0-100) from savant pitcher data."""
    k_pct    = _fb(sv.get("k_pct"), 22.0)
    swstr_pct = _fb(sv.get("swstr_pct"), 10.0)
    csw_pct  = _fb(sv.get("csw_pct"), 28.0)

    score = (
        max(0.0, min(45.0, k_pct / 38.0 * 45.0)) +
        max(0.0, min(35.0, swstr_pct / 18.0 * 35.0)) +
        max(0.0, min(20.0, csw_pct / 36.0 * 20.0))
    )
    return round(score, 1)


def strikeout_score_from_raw(raw: dict) -> float:
    """Fallback strikeout_score using raw K9."""
    k9   = _fb(raw.get("k9"), 7.0)
    era  = _fb(raw.get("era"), 4.50)

    k_pct    = min(38.0, k9 / 9.0 * 100.0 * 0.275)
    swstr_pct = max(5.0, k9 / 9.0 * 100.0 * 0.45)
    csw_pct  = max(22.0, k9 / 9.0 * 100.0 * 0.35 + 20.0)

    score = (
        max(0.0, min(45.0, k_pct / 38.0 * 45.0)) +
        max(0.0, min(35.0, swstr_pct / 18.0 * 35.0)) +
        max(0.0, min(20.0, csw_pct / 36.0 * 20.0))
    )
    return round(score, 1)


# ---------------------------------------------------------------------------
# Batter scoring helpers
# ---------------------------------------------------------------------------

def get_batter_savant(pid: int) -> dict:
    pid_str = str(pid)
    return savant_batters.get(pid_str, {})


def compute_khr(batter_sv: dict, batter_raw: dict, pitcher_throws: str) -> float:
    """
    KHR = xwoba_vs_pitcher_hand * 170.
    Uses savant split data, falls back to overall xwoba or raw OPS proxy.
    """
    if batter_sv:
        if pitcher_throws == "L":
            xwoba_split = _fb(batter_sv.get("xwoba_vs_lhp"), None)
        else:
            xwoba_split = _fb(batter_sv.get("xwoba_vs_rhp"), None)

        if xwoba_split is None:
            xwoba_split = _fb(batter_sv.get("xwoba"), None)
        if xwoba_split is not None:
            return round(xwoba_split * 170.0, 2)

    # Fallback: estimate xwoba from OPS
    ops = _fb(batter_raw.get("ops"), 0.750)
    xwoba_est = ops * 0.38
    return round(xwoba_est * 170.0, 2)


def compute_xwobac(batter_sv: dict, batter_raw: dict, pitcher_throws: str) -> float:
    """xwOBA on contact vs pitcher hand. Proxy if missing."""
    if batter_sv:
        if pitcher_throws == "L":
            v = _fb(batter_sv.get("xwoba_vs_lhp"), None)
        else:
            v = _fb(batter_sv.get("xwoba_vs_rhp"), None)
        if v is not None:
            return round(v, 3)
        xwoba = _fb(batter_sv.get("xwoba"), None)
        if xwoba is not None:
            return round(xwoba * 1.08, 3)
    ops = _fb(batter_raw.get("ops"), 0.750)
    return round(ops * 0.38 * 1.08, 3)


def compute_ceiling(batter_sv: dict, batter_raw: dict) -> float:
    """Ceiling score (0-100) from savant or raw fallback."""
    if batter_sv:
        barrel_pct   = _fb(batter_sv.get("barrel_pct"), None)
        hard_hit_pct = _fb(batter_sv.get("hard_hit_pct"), None)
        exit_velo    = _fb(batter_sv.get("exit_velo") or batter_sv.get("avg_exit_velo"), None)
        iso          = _fb(batter_sv.get("iso") or batter_raw.get("iso"), 0.150)

        if barrel_pct is not None and hard_hit_pct is not None and exit_velo is not None:
            ceiling = (
                min(40.0, barrel_pct / 16.0 * 40.0) +
                min(35.0, hard_hit_pct / 62.0 * 35.0) +
                min(15.0, exit_velo / 110.0 * 15.0) +
                min(10.0, iso / 0.32 * 10.0)
            )
            return round(min(100.0, ceiling), 1)

    # Fallback: use raw ISO + OPS
    iso = _fb(batter_raw.get("iso"), 0.150)
    ops = _fb(batter_raw.get("ops"), 0.750)
    ceiling = iso / 0.30 * 40.0 + ops / 1.10 * 60.0
    return round(min(100.0, max(0.0, ceiling)), 1)


def compute_zone_fit(pitcher_sv: dict, batter_sv: dict,
                     batter_raw: dict) -> float:
    """
    Zone fit from pitcher/batter zone vectors, or pull_pct proxy.
    """
    p_zones = pitcher_sv.get("pitcher_zones") if pitcher_sv else None
    b_zones = batter_sv.get("batter_zones")   if batter_sv  else None

    if (p_zones and b_zones and
            len(p_zones) == 9 and len(b_zones) == 9 and
            any(v != 0 for v in p_zones) and any(v != 0 for v in b_zones)):
        fit = sum(p * b for p, b in zip(p_zones, b_zones))
        return round(fit, 3)

    # Proxy via pull_pct
    pull_pct = 0.0
    if batter_sv:
        pull_pct = _fb(batter_sv.get("pull_pct"), 0.0)
    if pull_pct == 0.0:
        pull_pct = _fb(batter_raw.get("pull_pct"), 0.0)
    return round(pull_pct / 100.0 * 0.15 + 0.04, 3)


def compute_matchup_score(khr: float, zone_fit: float, park_rank: int,
                           weather: dict, ceiling: float) -> float:
    """Matchup score (0-100)."""
    khr_norm      = min(40.0, khr / 90.0 * 40.0)
    zone_fit_norm = min(20.0, zone_fit / 0.20 * 20.0)
    park_bonus    = max(0.0, min(10.0, (16.0 - park_rank) / 15.0 * 10.0))
    power_raw     = ceiling / 100.0 * 20.0

    wind_dir = weather.get("wind_dir", "")
    wind_mph = _fb(weather.get("wind_mph"), 0.0)
    roof     = weather.get("roof", False)
    weather_bonus = 3.0 if (is_wind_out(wind_dir) and wind_mph >= 10 and not roof) else 0.0

    score = khr_norm + zone_fit_norm + park_bonus + power_raw + weather_bonus
    return round(score, 3)


# ---------------------------------------------------------------------------
# Derived batter fields
# ---------------------------------------------------------------------------

def compute_hr_form(batter_raw: dict) -> tuple[str, str]:
    LEAGUE_AVG = 0.062
    hr    = _fb(batter_raw.get("hr"), 0)
    games = max(1, int(_fb(batter_raw.get("games"), 1)))
    hr_per_game = hr / games
    hr_form = f"{int(round(hr_per_game * 100))}%"
    if hr_per_game > LEAGUE_AVG * 1.25:
        trend = "up"
    elif hr_per_game < LEAGUE_AVG * 0.70:
        trend = "down"
    else:
        trend = "neutral"
    return hr_form, trend


def compute_likely(batter_raw: dict) -> int:
    hr    = _fb(batter_raw.get("hr"), 0)
    games = max(1, int(_fb(batter_raw.get("games"), 1)))
    return int(round(hr / games * 162))


def compute_pit(pitcher_sv: dict, pitcher_raw: dict) -> int:
    if pitcher_sv:
        pa = pitcher_sv.get("pa") or pitcher_sv.get("total_pa")
        if pa:
            try:
                return int(pa)
            except (TypeError, ValueError):
                pass
    ip = _fb(pitcher_raw.get("ip"), 0.0)
    if ip > 0:
        return int(ip * 4.2)
    return 300


def compute_bip(batter_sv: dict, batter_raw: dict) -> int:
    if batter_sv:
        pa = batter_sv.get("pa") or batter_sv.get("total_pa")
        if pa:
            try:
                return int(pa)
            except (TypeError, ValueError):
                pass
    ab = batter_raw.get("ab")
    if ab:
        try:
            return int(ab)
        except (TypeError, ValueError):
            pass
    return 200


def get_pull_brl_pct(batter_sv: dict, batter_raw: dict) -> float:
    if batter_sv:
        v = batter_sv.get("pull_brl_pct")
        if v is not None:
            return round(_fb(v), 2)
        barrel_pct = _fb(batter_sv.get("barrel_pct"), 0.0)
        pull_pct   = _fb(batter_sv.get("pull_pct"), 0.0)
        if barrel_pct and pull_pct:
            return round(barrel_pct * pull_pct / 100.0, 2)
    iso = _fb(batter_raw.get("iso"), 0.0)
    return round(iso * 20.0, 2)


def get_brl_bip_pct(batter_sv: dict, batter_raw: dict) -> float:
    if batter_sv:
        v = batter_sv.get("barrel_pct") or batter_sv.get("brl_bip_pct")
        if v is not None:
            return round(_fb(v), 2)
    iso = _fb(batter_raw.get("iso"), 0.0)
    return round(min(20.0, iso * 30.0), 2)


def get_la(batter_sv: dict) -> float:
    if batter_sv:
        v = batter_sv.get("la_avg") or batter_sv.get("la")
        if v is not None:
            return round(_fb(v), 1)
    return 12.0


def get_fb_pct(batter_sv: dict, batter_raw: dict) -> float:
    if batter_sv:
        v = batter_sv.get("fb_pct") or batter_sv.get("flyball_pct")
        if v is not None:
            return round(_fb(v), 1)
    return 32.0  # league average


def get_hh_pct(batter_sv: dict, batter_raw: dict) -> float:
    if batter_sv:
        v = batter_sv.get("hard_hit_pct") or batter_sv.get("hh_pct")
        if v is not None:
            return round(_fb(v), 1)
    ops = _fb(batter_raw.get("ops"), 0.750)
    return round(min(65.0, ops * 45.0), 1)


def get_swstr_pct_batter(batter_sv: dict) -> float:
    if batter_sv:
        v = batter_sv.get("swstr_pct")
        if v is not None:
            return round(_fb(v), 1)
    return 10.0


def get_exit_velo(batter_sv: dict) -> float:
    if batter_sv:
        v = batter_sv.get("exit_velo") or batter_sv.get("avg_exit_velo")
        if v is not None:
            return round(_fb(v), 1)
    return 88.0


# ---------------------------------------------------------------------------
# Build per-pitcher summary for pitchers_slate
# ---------------------------------------------------------------------------

def build_pitcher_entry(pid: int, name: str, team: str, opp_team: str,
                         game_key: str) -> dict:
    pid_str = str(pid) if pid else ""
    sv      = savant_pitchers.get(pid_str, {}) if pid_str else {}
    raw     = pitcher_stats_raw.get(pid_str, {}) if pid_str else {}

    if sv:
        p_score  = pitcher_score_from_savant(sv)
        so_score = strikeout_score_from_savant(sv)
        xwoba        = round(_fb(sv.get("xwoba"), 0.318), 3)
        csw_pct      = round(_fb(sv.get("csw_pct"), 28.0), 1)
        swstr_pct_p  = round(_fb(sv.get("swstr_pct"), 10.0), 1)
        ball_pct     = round(_fb(sv.get("ball_pct"), 34.0), 1)
        pulled_brl   = round(_fb(sv.get("pull_brl_pct") or sv.get("pulled_barrel_pct"), 3.0), 2)
        fb_pct_p     = round(_fb(sv.get("fb_pct") or sv.get("flyball_pct"), 38.0), 1)
        hard_hit_p   = round(_fb(sv.get("hard_hit_pct"), 38.0), 1)
        oppo_pct_p   = round(_fb(sv.get("oppo_pct") or sv.get("opposite_field_pct"), 20.0), 1)
    else:
        p_score  = pitcher_score_from_raw(raw) if raw else 50.0
        so_score = strikeout_score_from_raw(raw) if raw else 40.0
        era      = _fb(raw.get("era"), 4.50)
        k9       = _fb(raw.get("k9"), 7.0)
        xwoba        = round(max(0.220, min(0.420, era * 0.052 + 0.215)), 3)
        swstr_pct_p  = round(max(5.0, k9 / 9.0 * 100.0 * 0.45), 1)
        csw_pct      = round(max(22.0, k9 / 9.0 * 100.0 * 0.35 + 20.0), 1)
        ball_pct     = 34.0
        pulled_brl   = 3.0
        fb_pct_p     = 38.0
        hard_hit_p   = round(max(30.0, era * 4.0 + 22.0), 1)
        oppo_pct_p   = 20.0

    throws = get_pitcher_throws(pid) if pid else "R"

    return {
        "pitcherId":          pid or 0,
        "name":               name or "TBD",
        "team":               team,
        "opponentTeam":       opp_team,
        "throws":             throws,
        "gameKey":            game_key,
        "pitcher_score":      p_score,
        "strikeout_score":    so_score,
        "xwoba":              xwoba,
        "csw_pct":            csw_pct,
        "swstr_pct":          swstr_pct_p,
        "ball_pct":           ball_pct,
        "pulled_barrel_pct":  pulled_brl,
        "fb_pct":             fb_pct_p,
        "hard_hit_pct":       hard_hit_p,
        "oppo_pct":           oppo_pct_p,
        "arsenal":            sv.get("arsenal", []),
        "zones":              sv.get("zones", [0.0] * 9),
    }


# ---------------------------------------------------------------------------
# Build per-batter matchup entry
# ---------------------------------------------------------------------------

def build_batter_matchup(batter_raw: dict, team: str,
                          pitcher_pid: int, pitcher_throws: str,
                          game_weather: dict, park_rank: int) -> dict:
    pid = batter_raw.get("playerId") or batter_raw.get("pid") or 0
    pid_str = str(pid)
    bsv = get_batter_savant(pid)
    psv = savant_pitchers.get(str(pitcher_pid), {}) if pitcher_pid else {}

    stands    = get_batter_stands(pid)
    iso       = round(_fb(batter_raw.get("iso"), 0.150), 3)
    ops       = round(_fb(batter_raw.get("ops"), 0.700), 3)

    khr       = compute_khr(bsv, batter_raw, pitcher_throws)
    xwobac    = compute_xwobac(bsv, batter_raw, pitcher_throws)
    ceiling   = compute_ceiling(bsv, batter_raw)
    zone_fit  = compute_zone_fit(psv, bsv, batter_raw)
    ms        = compute_matchup_score(khr, zone_fit, park_rank, game_weather, ceiling)

    hr_form, hr_trend = compute_hr_form(batter_raw)
    likely    = compute_likely(batter_raw)
    pit_val   = compute_pit(psv, pitcher_stats_raw.get(str(pitcher_pid), {}))
    bip_val   = compute_bip(bsv, batter_raw)

    # xwoba for the batter (from savant, or estimate)
    if bsv:
        xwoba_b = round(_fb(bsv.get("xwoba"), ops * 0.38), 3)
    else:
        xwoba_b = round(ops * 0.38, 3)

    pull_brl  = get_pull_brl_pct(bsv, batter_raw)
    brl_bip   = get_brl_bip_pct(bsv, batter_raw)
    la        = get_la(bsv)
    fb_pct    = get_fb_pct(bsv, batter_raw)
    hh_pct    = get_hh_pct(bsv, batter_raw)
    swstr_b   = get_swstr_pct_batter(bsv)

    return {
        "batterId":      pid,
        "name":          batter_raw.get("playerName", "Unknown"),
        "team":          team,
        "stands":        stands,
        "matchup_score": ms,
        "ceiling":       ceiling,
        "zone_fit":      zone_fit,
        "khr":           khr,
        "hr_form":       hr_form,
        "hr_form_trend": hr_trend,
        "pit":           pit_val,
        "bip":           bip_val,
        "iso":           iso,
        "xwoba":         xwoba_b,
        "xwobac":        xwobac,
        "swstr_pct":     swstr_b,
        "pull_brl_pct":  pull_brl,
        "brl_bip_pct":   brl_bip,
        "fb_pct":        fb_pct,
        "hh_pct":        hh_pct,
        "la":            la,
        "likely":        likely,
        "zones":         bsv.get("zones", [0.0] * 9),
    }


# ---------------------------------------------------------------------------
# Main build loop
# ---------------------------------------------------------------------------

print(f"Scoring matchups for {slate.get('date', '?')}...")

output_games     = []
pitchers_slate   = []
seen_pitcher_ids = set()

for game_idx, g in enumerate(games_raw):
    game_pk    = game_idx + 1
    away_team  = g.get("awayTeam", "")
    home_team  = g.get("homeTeam", "")
    venue      = g.get("venueName", g.get("venue", "Unknown Park"))
    game_key   = f"{away_team}@{home_team}"

    away_pid   = g.get("awayPitcherId")
    home_pid   = g.get("homePitcherId")
    away_pname = g.get("awayPitcherName", "TBD")
    home_pname = g.get("homePitcherName", "TBD")

    game_weather = weather_map.get(venue, {
        "temp_f": 72, "wind_mph": 5, "wind_dir": "E",
        "condition": "Unknown", "roof": False
    })
    # Normalize weather dict (add "condition" if missing)
    game_weather.setdefault("condition", "Unknown")

    park_rank = park_hr_ranks.get(venue, 20)

    away_throws = get_pitcher_throws(away_pid) if away_pid else "R"
    home_throws = get_pitcher_throws(home_pid) if home_pid else "R"

    # ── Build pitcher slate entries ───────────────────────────────────────────
    for pid, pname, team, opp in [
        (away_pid, away_pname, away_team, home_team),
        (home_pid, home_pname, home_team, away_team),
    ]:
        if pid and pid not in seen_pitcher_ids:
            pitchers_slate.append(
                build_pitcher_entry(pid, pname, team, opp, game_key)
            )
            seen_pitcher_ids.add(pid)

    # ── Away batters face HOME pitcher ────────────────────────────────────────
    away_batters_raw = players_by_team.get(away_team, [])
    away_matchups = []
    for braw in away_batters_raw:
        try:
            entry = build_batter_matchup(
                braw, away_team, home_pid, home_throws,
                game_weather, park_rank
            )
            away_matchups.append(entry)
        except Exception as exc:
            name = braw.get("playerName", "?")
            print(f"  ⚠ Error scoring {name} ({away_team}): {exc}")

    away_matchups.sort(key=lambda x: -x["matchup_score"])
    away_matchups = away_matchups[:8]

    # ── Home batters face AWAY pitcher ────────────────────────────────────────
    home_batters_raw = players_by_team.get(home_team, [])
    home_matchups = []
    for braw in home_batters_raw:
        try:
            entry = build_batter_matchup(
                braw, home_team, away_pid, away_throws,
                game_weather, park_rank
            )
            home_matchups.append(entry)
        except Exception as exc:
            name = braw.get("playerName", "?")
            print(f"  ⚠ Error scoring {name} ({home_team}): {exc}")

    home_matchups.sort(key=lambda x: -x["matchup_score"])
    home_matchups = home_matchups[:8]

    # ── Assemble game time (raw_slate may not carry it) ───────────────────────
    game_time = g.get("gameTime") or g.get("time") or "TBD"

    output_games.append({
        "gamePk":          game_pk,
        "gameTime":        game_time,
        "awayTeam":        away_team,
        "homeTeam":        home_team,
        "awayPitcherId":   away_pid or 0,
        "homePitcherId":   home_pid or 0,
        "awayPitcherName": away_pname,
        "homePitcherName": home_pname,
        "awayThrows":      away_throws,
        "homeThrows":      home_throws,
        "park":            venue,
        "weather":         game_weather,
        "parkHrRank":      park_rank,
        "awayMatchups":    away_matchups,
        "homeMatchups":    home_matchups,
    })

    print(f"  ✓ {game_key}: {len(away_matchups)} away, {len(home_matchups)} home matchups")

# ---------------------------------------------------------------------------
# Write output
# ---------------------------------------------------------------------------

output = {
    "date":            slate.get("date", ""),
    "label":           slate.get("label", ""),
    "games":           output_games,
    "pitchers_slate":  pitchers_slate,
}

with open(OUTPUT_PATH, "w") as fh:
    json.dump(output, fh, indent=2)

total_batters  = sum(len(g["awayMatchups"]) + len(g["homeMatchups"]) for g in output_games)
print(f"\n✅ scripts/matchups.json written")
print(f"   Date:     {output['date']}")
print(f"   Games:    {len(output_games)}")
print(f"   Batters:  {total_batters}")
print(f"   Pitchers: {len(pitchers_slate)}")
