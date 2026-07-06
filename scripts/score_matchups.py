#!/usr/bin/env python3
"""
score_matchups.py — computes per-batter matchup scores for every game on today's slate.
Reads:  scripts/raw_slate.json
        scripts/savant_data.json    (optional; degrades gracefully if missing)
        scripts/park_factors.json  (optional; real BallparkPal per-game HR
                                     factors keyed by MLB gamePk -- degrades
                                     gracefully if missing)
Writes: scripts/matchups.json
"""

from __future__ import annotations

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
RAW_SLATE_PATH    = os.path.join(SCRIPT_DIR, "raw_slate.json")
SAVANT_PATH       = os.path.join(SCRIPT_DIR, "savant_data.json")
PARK_FACTORS_PATH = os.path.join(SCRIPT_DIR, "park_factors.json")
OUTPUT_PATH       = os.path.join(SCRIPT_DIR, "matchups.json")

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

savant_pitchers = savant.get("pitchers", {})
savant_batters  = savant.get("batters", {})

try:
    with open(PARK_FACTORS_PATH) as fh:
        park_factors_by_gamepk = json.load(fh)
    print(f"✓ Loaded park_factors.json ({len(park_factors_by_gamepk)} games)")
except FileNotFoundError:
    park_factors_by_gamepk = {}
    print("⚠ park_factors.json not found — park_bonus will be 0 for all games")
except Exception as exc:
    park_factors_by_gamepk = {}
    print(f"⚠ Could not parse park_factors.json ({exc}) — park_bonus will be 0 for all games")

# ---------------------------------------------------------------------------
# Slate structures
# ---------------------------------------------------------------------------

games_raw        = slate.get("games", [])
pitcher_stats_raw = slate.get("pitcher_stats", {})
players_by_team  = slate.get("players_by_team", {})
weather_map      = slate.get("weather", {})

# ---------------------------------------------------------------------------
# Batter handedness cache
# ---------------------------------------------------------------------------

_stands_cache: dict = {}

def get_batter_stands(pid: int) -> str:
    pid_str = str(pid)
    if pid_str in _stands_cache:
        return _stands_cache[pid_str]

    if pid_str in savant_batters:
        sv = savant_batters[pid_str]
        stands = sv.get("stands") or sv.get("bat_side") or sv.get("batSide")
        if stands:
            _stands_cache[pid_str] = stands[0].upper()
            return _stands_cache[pid_str]

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
# Pitcher data helpers
# ---------------------------------------------------------------------------

def _fb(v, default=0.0):
    try:
        return float(v) if v not in (None, "", "-", "---", ".---") else default
    except (TypeError, ValueError):
        return default


def _sv(d: dict, key: str):
    """Return Savant value only if it's a real non-None, non-zero float; else None."""
    v = d.get(key)
    if v is None:
        return None
    try:
        f = float(v)
        return f if f != 0.0 else None
    except (TypeError, ValueError):
        return None


def get_pitcher_throws(pid: int) -> str:
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
    pid_str = str(pid)
    return savant_pitchers.get(pid_str, {})


def pitcher_score_from_savant(sv: dict) -> float | None:
    """Real Statcast composite only -- None if any required input is missing,
    never backfilled with a league-average placeholder."""
    xwoba        = _sv(sv, "xwoba")
    swstr_pct    = _sv(sv, "swstr_pct")
    barrel_pct   = _sv(sv, "barrel_pct")
    hard_hit_pct = _sv(sv, "hard_hit_pct")
    if None in (xwoba, swstr_pct, barrel_pct, hard_hit_pct):
        return None

    score = (
        max(0.0, min(35.0, (0.390 - xwoba) / 0.190 * 35.0)) +
        max(0.0, min(30.0, swstr_pct / 18.0 * 30.0)) +
        max(0.0, min(20.0, (14.0 - barrel_pct) / 12.0 * 20.0)) +
        max(0.0, min(15.0, (52.0 - hard_hit_pct) / 27.0 * 15.0))
    )
    return round(score, 1)


def strikeout_score_from_savant(sv: dict) -> float | None:
    """Real Statcast composite only -- None if any required input is missing."""
    k_pct     = _sv(sv, "k_pct")
    swstr_pct = _sv(sv, "swstr_pct")
    csw_pct   = _sv(sv, "csw_pct")
    if None in (k_pct, swstr_pct, csw_pct):
        return None

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


def compute_xwobac(batter_sv: dict, batter_raw: dict, pitcher_throws: str) -> float | None:
    """Real xwOBA vs. pitcher hand only -- None if not in Savant."""
    split_key = "xwoba_vs_lhp" if pitcher_throws == "L" else "xwoba_vs_rhp"
    xwoba = _sv(batter_sv, split_key) or _sv(batter_sv, "xwoba")
    if xwoba is None:
        return None
    return round(xwoba, 3)


def compute_ceiling(batter_sv: dict, batter_raw: dict) -> float | None:
    """Real power-ceiling composite -- None if no real inputs are available
    at all (never fabricated).

    Prefers fetch_savant.py's real `power_percentile_avg` (the unweighted
    average of Savant's own official MLB-computed percentile ranks for
    barrel%, hard-hit%, exit velocity, xISO, and xSLG -- see that field's
    docstring in fetch_savant.py for the regression evidence) rescaled with
    a real, validated linear fit: regressed 305 real matched batters across
    two separate real days against a reference dashboard's real
    ceiling_score, intercept=32.0, slope=0.4755 (day 1: 33.24/0.453, day 2:
    30.77/0.498 -- averaged). Out-of-sample checked: the day-1 fit applied
    unchanged to day 2 scored R^2=0.386, essentially matching day 2's own
    from-scratch fit (R^2=0.389) -- real signal, not overfitting.

    Falls back to the prior raw-rate composite (barrel%/hard-hit%/exit-velo/
    ISO against fixed real-world caps, no comparative evidence behind those
    specific cap constants) only when a batter doesn't have enough
    qualifying PAs for Savant's own percentile rankings -- some real
    estimate for those batters beats none, but the percentile-based version
    above is the one with actual out-of-sample validation behind it."""
    power_pct_avg = batter_sv.get("power_percentile_avg")
    if power_pct_avg is not None:
        return round(min(100.0, max(0.0, 32.0 + 0.4755 * power_pct_avg)), 1)

    barrel_pct   = _sv(batter_sv, "barrel_pct")
    hard_hit_pct = _sv(batter_sv, "hard_hit_pct")
    exit_velo    = _sv(batter_sv, "exit_velo") or _sv(batter_sv, "avg_exit_velo")
    if None in (barrel_pct, hard_hit_pct, exit_velo):
        return None

    iso = _sv(batter_sv, "xiso")
    if iso is None:
        iso = _fb(batter_raw.get("iso"), 0.0)

    ceiling = (
        min(40.0, barrel_pct / 16.0 * 40.0) +
        min(35.0, hard_hit_pct / 62.0 * 35.0) +
        min(15.0, exit_velo / 110.0 * 15.0) +
        min(10.0, iso / 0.32 * 10.0)
    )
    return round(min(100.0, ceiling), 1)


def compute_zone_fit(pitcher_sv: dict, batter_sv: dict, batter_raw: dict) -> float | None:
    """Real pitcher-zone x batter-zone dot product only -- None if either side
    lacks real Savant zone data. Never backfilled from a pull-rate proxy."""
    p_zones = pitcher_sv.get("zones") if pitcher_sv else None
    b_zones = batter_sv.get("zones")  if batter_sv  else None

    if (p_zones and b_zones and
            len(p_zones) == 9 and len(b_zones) == 9 and
            any(v != 0 for v in p_zones) and any(v != 0 for v in b_zones)):
        fit = sum(p * b for p, b in zip(p_zones, b_zones))
        return round(fit, 3)

    return None


def compute_matchup_score(zone_fit, swstr_pct) -> float | None:
    """Strictly historical hitter-vs-pitcher matchup rating (0-100) -- None
    if any required real input is missing. Deliberately excludes park
    factor and weather, and (confirmed directly by the dashboard's own
    creator) excludes recent form/hot-streak bias entirely -- Matchup Score
    is described as "historical, data-driven... without incorporating
    recent form," used as a baseline/anchor alongside kHR (which is the one
    that adds recency).

    This function previously used Zone Fit + Ceiling as inputs, regressed
    against that dashboard's own real Zone Fit/Ceiling/Matchup Score
    exports (R^2=0.86 in that fit). That approach had a fatal flaw for
    production use: Ceiling and Zone Fit are themselves each proprietary
    and only weakly reconstructable from real per-player Statcast rates
    (every linear combination of barrel%/hard-hit%/exit-velo/ISO/xwOBA/
    launch-angle tried against 127-182 real per-player Ceiling/Zone-Fit
    exports across three separate real days capped out at R^2~0.2-0.5, a
    plateau that held regardless of which features or transforms were
    added -- the signature of a missing input, not a wrong weight). So a
    formula fit on the dashboard's OWN Ceiling/Zone-Fit values scored well
    in that fit, but in production -- where only OUR OWN weaker Ceiling/
    Zone-Fit proxies are available -- it degraded to real errors of
    20-25 points per batter.

    This version instead regresses directly against two REAL inputs we can
    compute exactly right (no proprietary intermediate to reconstruct):
    the batter's own season SwStr% and our own real zone_fit dot product
    (pitcher zone-xwOBA-allowed x batter zone-xwOBA, unweighted). Fit
    independently on two separate real days (127 and 178 batters, joined
    by real MLB batter ID against that dashboard's own real Matchup Score):
      July 5: intercept=45.25, swstr=-1.417, zone_fit=21.92, R^2=0.199
      July 6: intercept=42.53, swstr=-1.388, zone_fit=20.79, R^2=0.235
    Coefficients are stable across the two independent days (not a
    coincidence -- applying the July 5 fit unchanged to July 6 scores
    R^2=0.174, essentially matching July 6's own from-scratch fit). Two
    other real inputs (batter pulled-barrel% and average launch angle) were
    tested alongside these and discarded: pulled-barrel%'s correlation
    flipped sign between the two days (+0.29 -> -0.12) and launch angle's
    collapsed (0.32 -> 0.14) -- both are day-to-day noise, not real signal,
    unlike SwStr% (-0.33 both days) and zone_fit (0.27 both days).
    Deployed coefficients below are the average of the two days' fits.

    This R^2 (~0.2) is lower than the earlier Ceiling-based fit's R^2=0.86,
    but that comparison is apples-to-oranges: this one is validated on
    real out-of-sample data using inputs actually available in production,
    where the previous formula's real error was far larger. The dashboard's
    own creator confirms Zone Fit is "distinct from raw stats like barrel%
    or hard-hit%" and explicitly that "higher zone fit is a positive
    signal, especially paired with lower SwStr%" -- the same direction
    (zone_fit positive, swstr negative) this regression found independently."""
    if zone_fit is None or swstr_pct is None:
        return None

    return round(min(100.0, max(0.0, 43.89 - 1.40 * swstr_pct + 21.35 * zone_fit)), 3)


def compute_khr(matchup_score, hr_per_game) -> float | None:
    """Kasper-style HR score -- None if matchup_score is unavailable.
    Formula verified exactly (residual ~1e-13) via least-squares regression
    against 285 real per-player records exported from a reference
    dashboard's own live data: khr = 0.6 * matchup_score + 40 * hr_form_pct,
    where hr_form_pct there is confirmed to be exactly real HR-per-game rate
    (e.g. hr_form_pct=0.6196 <-> displayed "62%"), the same real stat this
    file already computes as hr_per_game in compute_hr_form(). Cross-checked
    against a second day's data too (a different real matchup, rounded to 3
    decimals in a screenshot): 0.6*56.206 + 40*0.62 = 58.524 vs. that
    dashboard's own displayed khr of 58.508 -- consistent within the
    screenshot's own rounding. This is a directly confirmed real formula,
    not a design choice like compute_matchup_score above."""
    if matchup_score is None:
        return None
    return round(0.6 * matchup_score + 40.0 * hr_per_game, 3)


# ---------------------------------------------------------------------------
# Derived batter fields
# ---------------------------------------------------------------------------

def compute_hr_form(batter_raw: dict) -> tuple[str, str, float]:
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
    return hr_form, trend, hr_per_game


def compute_likely(batter_raw: dict) -> int:
    hr    = _fb(batter_raw.get("hr"), 0)
    games = max(1, int(_fb(batter_raw.get("games"), 1)))
    return int(round(hr / games * 162))


def compute_pit(batter_sv: dict) -> int | None:
    """Real total pitches this batter has seen this season (Savant per-pitch
    row count) -- confirmed via a reference dashboard's own exported live
    data to be exactly what its "Pit" column represents for a hitter (not
    an opposing pitcher's stat, and not an estimate). None if the batter has
    no real Savant sample, never a hardcoded guess."""
    if not batter_sv:
        return None
    v = batter_sv.get("pitches_seen")
    return int(v) if v else None


def compute_bip(batter_sv: dict) -> int | None:
    """Real total batted-ball-in-play events for this batter this season --
    confirmed the same way to be this dashboard's real "BIP" definition.
    None if unavailable, never PA/AB standing in for it."""
    if not batter_sv:
        return None
    v = batter_sv.get("bip_count")
    return int(v) if v else None


def get_pull_brl_pct(batter_sv: dict, batter_raw: dict) -> float:
    v = _sv(batter_sv, "pull_brl_pct")
    if v:
        return round(v, 2)
    barrel_pct = _sv(batter_sv, "barrel_pct")
    pull_pct   = _sv(batter_sv, "pull_pct")
    if barrel_pct and pull_pct:
        return round(barrel_pct * pull_pct / 100.0, 2)
    return None


def get_brl_bip_pct(batter_sv: dict, batter_raw: dict) -> float:
    v = _sv(batter_sv, "barrel_pct") or _sv(batter_sv, "brl_bip_pct")
    if v:
        return round(v, 2)
    return None


def get_la(batter_sv: dict, batter_raw: dict = None) -> float:
    v = _sv(batter_sv, "la_avg") or _sv(batter_sv, "la")
    if v:
        return round(v, 1)
    return None


def get_sweet_spot_pct(batter_sv: dict, batter_raw: dict = None) -> float:
    v = _sv(batter_sv, "sweet_spot_pct")
    if v:
        return round(v, 1)
    return None


def get_fb_pct(batter_sv: dict, batter_raw: dict) -> float:
    v = _sv(batter_sv, "fb_pct") or _sv(batter_sv, "flyball_pct")
    if v:
        return round(v, 1)
    return None


def get_hh_pct(batter_sv: dict, batter_raw: dict) -> float:
    v = _sv(batter_sv, "hard_hit_pct") or _sv(batter_sv, "hh_pct")
    if v:
        return round(v, 1)
    return None


def get_swstr_pct_batter(batter_sv: dict, batter_raw: dict = None) -> float:
    v = _sv(batter_sv, "swstr_pct")
    if v:
        return round(v, 1)
    return None


def get_exit_velo(batter_sv: dict, batter_raw: dict = None) -> float:
    v = _sv(batter_sv, "exit_velo") or _sv(batter_sv, "avg_exit_velo")
    if v:
        return round(v, 1)
    return None


# ---------------------------------------------------------------------------
# Build per-pitcher summary for pitchers_slate
# ---------------------------------------------------------------------------

def build_pitcher_entry(pid: int, name: str, team: str, opp_team: str,
                         game_key: str) -> dict:
    pid_str = str(pid) if pid else ""
    sv      = savant_pitchers.get(pid_str, {}) if pid_str else {}
    raw     = pitcher_stats_raw.get(pid_str, {}) if pid_str else {}

    has_real_savant = bool(sv) and sv.get("pa", 0) > 0

    if has_real_savant:
        p_score  = pitcher_score_from_savant(sv)
        so_score = strikeout_score_from_savant(sv)
        xwoba       = _sv(sv, "xwoba")
        csw_pct     = _sv(sv, "csw_pct")
        swstr_pct_p = _sv(sv, "swstr_pct")
        ball_pct    = _sv(sv, "ball_pct")
        pulled_brl  = _sv(sv, "pull_brl_pct") or _sv(sv, "pulled_barrel_pct")
        fb_pct_p    = _sv(sv, "fb_pct") or _sv(sv, "flyball_pct")
        hard_hit_p  = _sv(sv, "hard_hit_pct")
        oppo_pct_p  = _sv(sv, "oppo_pct") or _sv(sv, "opposite_field_pct")
    else:
        # No real Savant sample for this pitcher -- leave the composite
        # scores and every Statcast-derived field None rather than
        # estimating them from ERA/K9.
        p_score  = None
        so_score = None
        xwoba       = _sv(sv, "xwoba") if sv else None
        csw_pct     = None
        swstr_pct_p = None
        ball_pct    = None
        pulled_brl  = None
        fb_pct_p    = _sv(sv, "fb_pct") if sv else None
        hard_hit_p  = _sv(sv, "hard_hit_pct") if sv else None
        oppo_pct_p  = _sv(sv, "oppo_pct") if sv else None

    throws = get_pitcher_throws(pid) if pid else "R"

    era  = raw.get("era")  if raw else None
    whip = raw.get("whip") if raw else None
    k9   = raw.get("k9")   if raw else None
    bb9  = raw.get("bb9")  if raw else None
    fip  = raw.get("fip")  if raw else None
    ip   = raw.get("ip")   if raw else None
    try: era  = round(float(era), 2)  if era  not in (None, "", "-") else None
    except Exception: era  = None
    try: whip = round(float(whip), 2) if whip not in (None, "", "-") else None
    except Exception: whip = None
    try: k9   = round(float(k9), 1)   if k9   not in (None, "", "-") else None
    except Exception: k9   = None
    try: bb9  = round(float(bb9), 1)  if bb9  not in (None, "", "-") else None
    except Exception: bb9  = None
    try: fip  = round(float(fip), 2)  if fip  not in (None, "", "-") else None
    except Exception: fip  = None
    try: ip   = round(float(ip), 1)   if ip   not in (None, "", "-") else None
    except Exception: ip   = None

    arsenal = (sv.get("arsenal") or [] if sv else []) or (raw.get("arsenal", []) if raw else [])

    return {
        "pitcherId":          pid or 0,
        "name":               name or "TBD",
        "team":               team,
        "opponentTeam":       opp_team,
        "throws":             throws,
        "gameKey":            game_key,
        "pitcher_score":      p_score,
        "strikeout_score":    so_score,
        "era":                era,
        "whip":               whip,
        "k9":                 k9,
        "bb9":                bb9,
        "fip":                fip,
        "ip":                 ip,
        "xwoba":              xwoba,
        "csw_pct":            csw_pct,
        "swstr_pct":          swstr_pct_p,
        "ball_pct":           ball_pct,
        "pulled_barrel_pct":  pulled_brl,
        "fb_pct":             fb_pct_p,
        "hard_hit_pct":       hard_hit_p,
        "oppo_pct":           oppo_pct_p,
        "arsenal":            arsenal,
        "zones":              sv.get("zones", [0.0] * 9) if sv else [0.0] * 9,
    }


# ---------------------------------------------------------------------------
# Build per-batter matchup entry
# ---------------------------------------------------------------------------

def build_batter_matchup(batter_raw: dict, team: str,
                          pitcher_pid: int, pitcher_throws: str) -> dict:
    pid = batter_raw.get("playerId") or batter_raw.get("pid") or 0
    pid_str = str(pid)
    bsv = get_batter_savant(pid)
    psv = savant_pitchers.get(str(pitcher_pid), {}) if pitcher_pid else {}

    stands    = get_batter_stands(pid)
    iso_raw   = batter_raw.get("iso")
    try:    iso = round(float(iso_raw), 3) if iso_raw not in (None, "", "-") else None
    except (TypeError, ValueError): iso = None

    xwobac    = compute_xwobac(bsv, batter_raw, pitcher_throws)
    ceiling   = compute_ceiling(bsv, batter_raw)
    zone_fit  = compute_zone_fit(psv, bsv, batter_raw)
    swstr_b   = get_swstr_pct_batter(bsv, batter_raw)
    ms        = compute_matchup_score(zone_fit, swstr_b)

    hr_form, hr_trend, hr_per_game = compute_hr_form(batter_raw)
    khr       = compute_khr(ms, hr_per_game)
    likely    = compute_likely(batter_raw)
    pit_val   = compute_pit(bsv)
    bip_val   = compute_bip(bsv)

    xwoba_sv = _sv(bsv, "xwoba")
    xwoba_b  = round(xwoba_sv, 3) if xwoba_sv is not None else None
    # Real xwOBA on contact only (excludes Ks/BBs, so it's a different, higher
    # number than plain xwoba) -- computed in fetch_savant.py's
    # _aggregate_batter_rows, not re-derived here.
    xwoba_contact_sv = _sv(bsv, "xwoba_contact")
    xwoba_contact = round(xwoba_contact_sv, 3) if xwoba_contact_sv is not None else None

    pull_brl   = get_pull_brl_pct(bsv, batter_raw)
    brl_bip    = get_brl_bip_pct(bsv, batter_raw)
    la         = get_la(bsv, batter_raw)
    fb_pct     = get_fb_pct(bsv, batter_raw)
    hh_pct     = get_hh_pct(bsv, batter_raw)
    sweet_spot = get_sweet_spot_pct(bsv, batter_raw)
    ev         = get_exit_velo(bsv, batter_raw)

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
        "xwoba_contact": xwoba_contact,
        "xwobac":        xwobac,
        "swstr_pct":     swstr_b,
        "pull_brl_pct":  pull_brl,
        "brl_bip_pct":   brl_bip,
        "fb_pct":        fb_pct,
        "hh_pct":        hh_pct,
        "sweet_spot_pct": sweet_spot,
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
    # Real MLB gamePk (from fetch_slate.py) -- also the join key BallparkPal's
    # own game links use. Fall back to a synthetic index only as a bookkeeping
    # id if a stale raw_slate.json predates that field.
    game_pk    = g.get("gamePk") or (game_idx + 1)
    away_team  = g.get("awayTeam", "")
    home_team  = g.get("homeTeam", "")
    venue      = g.get("venueName", g.get("venue", "Unknown Park"))
    game_key   = f"{away_team}@{home_team}"

    away_pid   = g.get("awayPitcherId")
    home_pid   = g.get("homePitcherId")
    away_pname = g.get("awayPitcherName", "TBD")
    home_pname = g.get("homePitcherName", "TBD")

    # No fabricated defaults -- if fetch_slate.py couldn't get real weather
    # for this venue, every field is explicitly unknown (None).
    game_weather = weather_map.get(venue, {
        "temp_f": None, "wind_mph": None, "wind_dir": None,
        "condition": None, "roof": None
    })

    # Real per-game HR park factor (stadium + today's weather combined),
    # keyed by the real MLB gamePk (primary source: BallparkPal) or by
    # "AWAY@HOME" team abbreviations (fallback source: VSiN, which doesn't
    # expose a gamePk). None if neither source had this game -- park_bonus
    # becomes 0, never a guessed rank-based number.
    park_factor = (
        park_factors_by_gamepk.get(str(game_pk))
        or park_factors_by_gamepk.get(game_key)
        or {}
    )
    park_hr_pct = park_factor.get("hr_pct")

    away_throws = get_pitcher_throws(away_pid) if away_pid else "R"
    home_throws = get_pitcher_throws(home_pid) if home_pid else "R"

    for pid, pname, team, opp in [
        (away_pid, away_pname, away_team, home_team),
        (home_pid, home_pname, home_team, away_team),
    ]:
        if pid and pid not in seen_pitcher_ids:
            pitchers_slate.append(
                build_pitcher_entry(pid, pname, team, opp, game_key)
            )
            seen_pitcher_ids.add(pid)

    away_batters_raw = players_by_team.get(away_team, [])
    away_matchups = []
    for braw in away_batters_raw:
        try:
            entry = build_batter_matchup(
                braw, away_team, home_pid, home_throws
            )
            away_matchups.append(entry)
        except Exception as exc:
            name = braw.get("playerName", "?")
            print(f"  ⚠ Error scoring {name} ({away_team}): {exc}")

    away_matchups.sort(key=lambda x: (x["matchup_score"] is None, -(x["matchup_score"] or 0)))
    # No truncation -- show every batter fetch_slate.py gathered for this team.

    home_batters_raw = players_by_team.get(home_team, [])
    home_matchups = []
    for braw in home_batters_raw:
        try:
            entry = build_batter_matchup(
                braw, home_team, away_pid, away_throws
            )
            home_matchups.append(entry)
        except Exception as exc:
            name = braw.get("playerName", "?")
            print(f"  ⚠ Error scoring {name} ({home_team}): {exc}")

    home_matchups.sort(key=lambda x: (x["matchup_score"] is None, -(x["matchup_score"] or 0)))
    # No truncation -- show every batter fetch_slate.py gathered for this team.

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
        "parkHrPct":       park_hr_pct,
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
