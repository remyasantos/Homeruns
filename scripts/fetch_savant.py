#!/usr/bin/env python3
"""
fetch_savant.py — Fetches Baseball Savant Statcast data for all pitchers and
batters in today's MLB slate and writes scripts/savant_data.json.

INPUTS:  scripts/raw_slate.json  (written by fetch_slate.py)
OUTPUTS: scripts/savant_data.json
"""

import csv
import io
import json
import os
import sys
import time

import requests

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_SLATE_PATH = os.path.join(SCRIPT_DIR, "raw_slate.json")
OUTPUT_PATH = os.path.join(SCRIPT_DIR, "savant_data.json")

# ---------------------------------------------------------------------------
# HTTP session
# ---------------------------------------------------------------------------
SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
})

# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------

def safe_float(v, default=0.0):
    try:
        return float(str(v).replace("%", "").replace(",", "").strip())
    except Exception:
        return default


def safe_int(v, default=0):
    try:
        return int(float(str(v).replace("%", "").strip()))
    except Exception:
        return default


def parse_pct(v):
    s = str(v).replace("%", "").strip()
    try:
        f = float(s)
        return f / 100.0 if f > 1.0 else f
    except Exception:
        return 0.0


def get_csv(url, params, label="request", retries=3, backoff=3.0):
    """Fetch a URL and return a list of dicts via csv.DictReader, or [] on error.
    Retries on empty/error responses with exponential backoff — Savant
    rate-limits/blocks bursts of requests, so a transient empty response
    on attempt 1 is common and should not be treated as permanent failure.
    """
    for attempt in range(1, retries + 1):
        try:
            resp = SESSION.get(url, params=params, timeout=30)
            resp.raise_for_status()
            text = resp.text.strip()
            if not text:
                print(f"  [warn] Empty response for {label} (attempt {attempt}/{retries})", file=sys.stderr)
            else:
                reader = csv.DictReader(io.StringIO(text))
                rows = list(reader)
                if rows:
                    print(f"  [ok] {label}: {len(rows)} rows", file=sys.stderr)
                    return rows
                print(f"  [warn] No rows parsed for {label} (attempt {attempt}/{retries})", file=sys.stderr)
        except requests.exceptions.HTTPError as exc:
            print(f"  [warn] HTTP error for {label} (attempt {attempt}/{retries}): {exc}", file=sys.stderr)
        except Exception as exc:
            print(f"  [warn] Error fetching {label} (attempt {attempt}/{retries}): {exc}", file=sys.stderr)

        if attempt < retries:
            time.sleep(backoff * attempt)

    print(f"  [fail] Giving up on {label} after {retries} attempts", file=sys.stderr)
    return []


# ---------------------------------------------------------------------------
# 1. Pitcher leaderboard
# ---------------------------------------------------------------------------
PITCHER_SELECTIONS = ",".join([
    "p_game", "pa", "p_k_percent", "p_bb_percent",
    "xba", "xslg", "xwoba",
    "exit_velocity_avg", "launch_angle_avg",
    "sweet_spot_percent", "barrel_batted_rate", "hardHitPercent",
    "z_swing_miss_percent", "oz_swing_miss_percent", "oz_swing_percent",
    "in_zone_percent", "f_strike_percent",
    "groundballs_percent", "flyballs_percent", "linedrives_percent",
    "pulled_percent", "straightaway_percent", "oppo_percent",
])


def fetch_pitcher_leaderboard():
    """Returns dict keyed by int player_id → pitcher stat dict."""
    params = {
        "year": "2026",
        "type": "pitcher",
        "filter": "",
        "sort": "4",
        "sortDir": "desc",
        "min": "10",
        "selections": PITCHER_SELECTIONS,
        "excel": "false",
        "chart": "false",
        "csv": "true",
    }
    rows = get_csv(
        "https://baseballsavant.mlb.com/leaderboard/custom",
        params,
        label="pitcher leaderboard",
    )
    result = {}
    for row in rows:
        try:
            pid = int(safe_float(row.get("player_id", row.get("mlb_id", 0))))
        except Exception:
            continue
        if pid == 0:
            continue

        pa_val = safe_int(row.get("pa", 0))
        k_pct = safe_float(row.get("p_k_percent", 0)) / 100.0
        bb_pct = safe_float(row.get("p_bb_percent", 0)) / 100.0
        xwoba = safe_float(row.get("xwoba", 0))
        xba = safe_float(row.get("xba", 0))
        xslg = safe_float(row.get("xslg", 0))
        exit_velo = safe_float(row.get("exit_velocity_avg", 0))
        la_avg = safe_float(row.get("launch_angle_avg", 0))
        sweet_spot_pct = safe_float(row.get("sweet_spot_percent", 0))
        barrel_pct = safe_float(row.get("barrel_batted_rate", 0))
        hard_hit_pct = safe_float(row.get("hardHitPercent", 0))
        swstr_pct = safe_float(row.get("z_swing_miss_percent", 0))
        oz_swing_pct = safe_float(row.get("oz_swing_percent", 0))
        in_zone_pct = safe_float(row.get("in_zone_percent", 0))
        f_strike_pct = safe_float(row.get("f_strike_percent", 0))
        gb_pct = safe_float(row.get("groundballs_percent", 0))
        fb_pct = safe_float(row.get("flyballs_percent", 0))
        ld_pct = safe_float(row.get("linedrives_percent", 0))
        pull_pct = safe_float(row.get("pulled_percent", 0))
        oppo_pct = safe_float(row.get("oppo_percent", 0))

        # Derived metrics
        csw_pct = in_zone_pct * 0.30 + swstr_pct * 0.80
        ball_pct = max(0.0, 100.0 - in_zone_pct - (100.0 - in_zone_pct) * 0.67)
        pulled_barrel_pct = barrel_pct * pull_pct / 100.0

        # Determine name and handedness
        name = (
            row.get("player_name")
            or row.get("last_name, first_name")
            or row.get("name")
            or ""
        ).strip()
        throws = (row.get("p_throws") or row.get("throws") or "R").strip()

        result[pid] = {
            "mlb_id": pid,
            "name": name,
            "throws": throws,
            "pa": pa_val,
            "xwoba": xwoba,
            "xba": xba,
            "xslg": xslg,
            "exit_velo": exit_velo,
            "la_avg": la_avg,
            "barrel_pct": barrel_pct,
            "hard_hit_pct": hard_hit_pct,
            "sweet_spot_pct": sweet_spot_pct,
            "swstr_pct": swstr_pct,
            "csw_pct": csw_pct,
            "o_swing_pct": oz_swing_pct,
            "in_zone_pct": in_zone_pct,
            "f_strike_pct": f_strike_pct,
            "ball_pct": ball_pct,
            "fb_pct": fb_pct,
            "gb_pct": gb_pct,
            "ld_pct": ld_pct,
            "pull_pct": pull_pct,
            "oppo_pct": oppo_pct,
            "pulled_barrel_pct": pulled_barrel_pct,
            "k_pct": k_pct,
            "bb_pct": bb_pct,
            # zones and arsenal filled in later
            "zones": [],
            "arsenal": [],
        }
    return result


# ---------------------------------------------------------------------------
# 2 & 3. Batter stats via statcast_search/csv (batched by player ID)
# ---------------------------------------------------------------------------

_ZONE_CSV_BASE = "https://baseballsavant.mlb.com/statcast_search/csv"
_BATTER_BATCH_SIZE = 40


def _extract_player_id(row):
    """
    Extract MLBAM player ID from a Savant CSV row.
    Tries multiple column names used by different Savant endpoints/versions.
    Logs column names on the first call to aid debugging in Actions logs.
    """
    if not getattr(_extract_player_id, "_logged", False):
        _extract_player_id._logged = True
        print(f"  [debug] batter row columns: {list(row.keys())}", file=sys.stderr)
    for col in ("batter", "player_id", "mlb_id", "xMLBAMID", "key_mlbam", "batter_id", "id"):
        v = row.get(col)
        if v is not None and str(v).strip() not in ("", "0", "None"):
            try:
                pid = int(safe_float(v))
                if pid > 0:
                    return pid
            except Exception:
                pass
    return 0


def _parse_batter_statcast_row(row):
    """
    Parse a statcast_search/csv group_by=name row.
    Tries multiple column name variants since Savant renames them across releases.
    """
    def _g(*keys, default=0.0):
        for k in keys:
            v = row.get(k)
            if v is not None and str(v).strip() not in ("", "null", "None", "."):
                return safe_float(v, default)
        return default

    pa = safe_int(row.get("pa", row.get("attempts", row.get("total_pitches", 0))))
    xwoba = _g("xwoba", "estimated_woba_using_speedangle", "xwoba_mean")
    xba = _g("xba", "estimated_ba_using_speedangle")
    xslg = _g("xslg", "estimated_slg_using_speedangle")
    exit_velo = _g("launch_speed", "avg_launch_speed", "exit_velocity_avg")
    la_avg = _g("launch_angle", "avg_launch_angle", "launch_angle_avg")
    barrel_pct = _g("brl_percent", "brl_bip_percent", "barrel_batted_rate", "brl_pa")
    hard_hit_pct = _g("hard_hit_percent", "hardHitPercent")
    sweet_spot_pct = _g("sweet_spot_percent")
    gb_pct = _g("groundballs_percent", "gb_percent")
    fb_pct = _g("flyballs_percent", "fb_percent")
    ld_pct = _g("linedrives_percent", "ld_percent")
    pull_pct = _g("pulled_percent", "pull_percent")
    oppo_pct = _g("oppo_percent", "opposite_percent")
    pull_brl_pct = barrel_pct * pull_pct / 100.0

    return {
        "pa": pa,
        "xwoba": xwoba,
        "xba": xba,
        "xslg": xslg,
        "xiso": max(0.0, xslg - xba),
        "exit_velo": exit_velo,
        "la_avg": la_avg,
        "barrel_pct": barrel_pct,
        "hard_hit_pct": hard_hit_pct,
        "sweet_spot_pct": sweet_spot_pct,
        "swstr_pct": 0.0,
        "o_swing_pct": 0.0,
        "gb_pct": gb_pct,
        "fb_pct": fb_pct,
        "ld_pct": ld_pct,
        "pull_pct": pull_pct,
        "oppo_pct": oppo_pct,
        "pull_brl_pct": pull_brl_pct,
    }


def _fetch_batter_statcast_batched(bids, pitcher_throws=None, label_prefix="batter statcast"):
    """
    Fetch statcast_search/csv for a list of batter IDs in batches.
    Returns dict keyed by int player_id → parsed stat dict.
    pitcher_throws: None (all), "R", or "L" — filters opponent hand if supported.
    """
    result = {}
    for i in range(0, len(bids), _BATTER_BATCH_SIZE):
        batch = bids[i:i + _BATTER_BATCH_SIZE]
        batch_num = i // _BATTER_BATCH_SIZE + 1
        label = f"{label_prefix} batch {batch_num}"
        params = {
            "all": "true",
            "hfGT": "R|",
            "hfSea": "2026|",
            "player_type": "batter",
            "group_by": "name",
            "type": "details",
            "min_pitches": "0",
            "min_results": "0",
            "sort_col": "pitches",
            "sort_order": "desc",
            "batters_lookup[]": [str(b) for b in batch],
        }
        if pitcher_throws:
            params["pitcherHand"] = pitcher_throws
        rows = get_csv(_ZONE_CSV_BASE, params, label=label)
        for row in rows:
            pid = _extract_player_id(row)
            if pid == 0:
                continue
            result[pid] = _parse_batter_statcast_row(row)
            if pitcher_throws is None:
                name = (
                    row.get("player_name")
                    or row.get("last_name, first_name")
                    or row.get("name")
                    or ""
                ).strip()
                result[pid]["name"] = name
                result[pid]["stands"] = (
                    row.get("stand") or row.get("bat_side") or "R"
                ).strip()
        if i + _BATTER_BATCH_SIZE < len(bids):
            time.sleep(3)
    return result


def fetch_batter_leaderboards(batter_ids):
    """
    Returns (overall_dict, rhp_dict, lhp_dict) each keyed by int player_id.
    Uses statcast_search/csv with batters_lookup[] — same endpoint as zone fetches.
    """
    bids = list(batter_ids)

    print(f"  Fetching overall batter Statcast stats ({len(bids)} batters) ...", file=sys.stderr)
    overall = _fetch_batter_statcast_batched(bids, pitcher_throws=None, label_prefix="batter statcast overall")

    time.sleep(8)
    print("  Fetching batter stats vs RHP ...", file=sys.stderr)
    rhp = _fetch_batter_statcast_batched(bids, pitcher_throws="R", label_prefix="batter statcast vs RHP")

    time.sleep(8)
    print("  Fetching batter stats vs LHP ...", file=sys.stderr)
    lhp = _fetch_batter_statcast_batched(bids, pitcher_throws="L", label_prefix="batter statcast vs LHP")

    return overall, rhp, lhp


# ---------------------------------------------------------------------------
# 4. Pitch arsenal
# ---------------------------------------------------------------------------

def fetch_pitch_arsenal():
    """Returns dict keyed by int player_id → list of pitch dicts, sorted by pct desc."""
    params = {
        "type": "pitcher",
        "pitchType": "",
        "year": "2026",
        "team": "",
        "min": "10",
        "sort": "run_value_per_100",
        "sortDir": "asc",
        "csv": "true",
    }
    rows = get_csv(
        "https://baseballsavant.mlb.com/leaderboard/pitch-arsenal-stats",
        params,
        label="pitch arsenal",
    )
    arsenal = {}
    for row in rows:
        try:
            pid = int(safe_float(row.get("player_id", row.get("mlb_id", 0))))
        except Exception:
            continue
        if pid == 0:
            continue
        pitch = {
            "abbrev": (row.get("pitch_type") or "").strip(),
            "pitch_name": (row.get("pitch_name") or "").strip(),
            "pct": parse_pct(row.get("pitch_percent_formatted", "0")),
            "velo": safe_float(row.get("mph", 0)),
            "spin": safe_int(row.get("spin_rate_avg", 0)),
            "run_value": safe_float(row.get("run_value_per_100", 0)),
            "whiff_pct": safe_float(row.get("whiff_percent", 0)),
            "xwoba": safe_float(row.get("xwoba", 0)),
        }
        arsenal.setdefault(pid, []).append(pitch)

    # Sort each pitcher's arsenal by pct descending
    for pid in arsenal:
        arsenal[pid].sort(key=lambda p: p["pct"], reverse=True)

    return arsenal


# ---------------------------------------------------------------------------
# 5 & 6. Per-player zone data
# ---------------------------------------------------------------------------

def fetch_pitcher_zones(pitcher_id):
    """
    Returns a 9-element list (zones 1–9) of pitch frequency fractions.
    Falls back to 9 equal weights on error.
    """
    params = {
        "all": "true",
        "hfGT": "R|",
        "hfSea": "2026|",
        "player_type": "pitcher",
        "pitchers_lookup[]": str(pitcher_id),
        "group_by": "zone",
        "type": "details",
        "min_pitches": "0",
        "min_results": "0",
        "sort_col": "pitches",
        "sort_order": "desc",
    }
    rows = get_csv(_ZONE_CSV_BASE, params, label=f"pitcher zones {pitcher_id}")
    zone_counts = {}
    for row in rows:
        try:
            z = int(safe_float(row.get("zone", 0)))
        except Exception:
            continue
        if z < 1 or z > 9:
            continue
        pitches = safe_int(row.get("pitches", 0))
        zone_counts[z] = zone_counts.get(z, 0) + pitches

    total = sum(zone_counts.values())
    if total > 0:
        return [zone_counts.get(i, 0) / total for i in range(1, 10)]
    return [0.0] * 9


def fetch_batter_zones(batter_id):
    """
    Returns a 9-element list of xwoba_mean per zone (zones 1–9).
    Falls back to zeros on error.
    """
    params = {
        "all": "true",
        "hfGT": "R|",
        "hfSea": "2026|",
        "player_type": "batter",
        "batters_lookup[]": str(batter_id),
        "group_by": "zone",
        "type": "details",
        "min_pitches": "0",
        "min_results": "0",
        "sort_col": "pitches",
        "sort_order": "desc",
    }
    rows = get_csv(_ZONE_CSV_BASE, params, label=f"batter zones {batter_id}")
    zone_xwoba = {}
    for row in rows:
        try:
            z = int(safe_float(row.get("zone", 0)))
        except Exception:
            continue
        if z < 1 or z > 9:
            continue
        xw = safe_float(row.get("xwoba_mean", row.get("xwoba", 0)))
        zone_xwoba[z] = xw

    return [zone_xwoba.get(i, 0.0) for i in range(1, 10)]


# ---------------------------------------------------------------------------
# Fallback: estimate pitcher Savant stats from raw_slate pitcher_stats
# ---------------------------------------------------------------------------

def pitcher_fallback_from_raw(pitcher_id, pitcher_name, raw_pitcher_stats):
    """Build a minimal pitcher entry from ERA/FIP when Savant data is missing."""
    raw = raw_pitcher_stats.get(str(pitcher_id), raw_pitcher_stats.get(pitcher_id, {}))
    era = safe_float(raw.get("era", 4.50))
    fip = safe_float(raw.get("fip", era))
    k9 = safe_float(raw.get("k9", 8.0))
    bb9 = safe_float(raw.get("bb9", 3.0))
    hr9 = safe_float(raw.get("hr9", 1.2))

    # Rough estimates
    xwoba_est = round(era * 0.055 + 0.22, 3)
    xba_est = round(xwoba_est * 0.72, 3)
    xslg_est = round(xwoba_est * 1.35, 3)
    k_pct_est = round(min(k9 / 27.0, 0.40), 3)
    bb_pct_est = round(min(bb9 / 27.0, 0.20), 3)
    barrel_pct_est = round(hr9 * 1.8, 1)

    return {
        "mlb_id": pitcher_id,
        "name": pitcher_name,
        "throws": "R",
        "pa": 0,
        "xwoba": xwoba_est,
        "xba": xba_est,
        "xslg": xslg_est,
        "exit_velo": 88.0,
        "la_avg": 12.0,
        "barrel_pct": barrel_pct_est,
        "hard_hit_pct": 38.0,
        "sweet_spot_pct": 33.0,
        "swstr_pct": 10.0,
        "csw_pct": 28.0,
        "o_swing_pct": 30.0,
        "in_zone_pct": 46.0,
        "f_strike_pct": 58.0,
        "ball_pct": 18.0,
        "fb_pct": 38.0,
        "gb_pct": 42.0,
        "ld_pct": 20.0,
        "pull_pct": 36.0,
        "oppo_pct": 24.0,
        "pulled_barrel_pct": round(barrel_pct_est * 0.36, 2),
        "k_pct": k_pct_est,
        "bb_pct": bb_pct_est,
        "zones": [0.0] * 9,
        "arsenal": [],
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    # ---- Load raw_slate.json ------------------------------------------------
    print("Loading raw_slate.json ...", file=sys.stderr)
    try:
        with open(RAW_SLATE_PATH, "r") as f:
            raw_slate = json.load(f)
    except FileNotFoundError:
        print(f"ERROR: {RAW_SLATE_PATH} not found", file=sys.stderr)
        sys.exit(1)

    status = raw_slate.get("status", "")
    if status != "ok":
        print(
            f"raw_slate.json status='{status}' — no games today. "
            "Writing empty savant_data.json.",
            file=sys.stderr,
        )
        out = {"pitchers": {}, "batters": {}}
        with open(OUTPUT_PATH, "w") as f:
            json.dump(out, f, indent=2)
        print(f"Wrote {OUTPUT_PATH}", file=sys.stderr)
        return

    games = raw_slate.get("games", [])
    raw_pitcher_stats = raw_slate.get("pitcher_stats", {})
    players_by_team = raw_slate.get("players_by_team", {})

    # ---- Collect IDs --------------------------------------------------------
    pitcher_id_to_name = {}
    for game in games:
        for side in ("away", "home"):
            pid = game.get(f"{side}PitcherId")
            pname = game.get(f"{side}PitcherName", "")
            if pid:
                pitcher_id_to_name[int(pid)] = pname

    batter_id_to_name = {}
    for team, players in players_by_team.items():
        for p in players:
            bid = p.get("playerId")
            bname = p.get("playerName", "")
            if bid:
                batter_id_to_name[int(bid)] = bname

    pitcher_ids = set(pitcher_id_to_name.keys())
    batter_ids = set(batter_id_to_name.keys())

    print(
        f"Slate: {len(games)} games | "
        f"{len(pitcher_ids)} pitchers | {len(batter_ids)} batters",
        file=sys.stderr,
    )

    # ---- Fetch leaderboards (bulk) -----------------------------------------
    # Longer gaps between bulk calls: Savant rate-limits rapid sequential
    # requests. Pitcher leaderboard (first) succeeds; batter leaderboard
    # was consistently returning zero usable rows when fired < 3s after.
    # 15s gap gives Savant time to reset the rate-limit window.
    print("\n--- Fetching pitcher leaderboard ---", file=sys.stderr)
    pitcher_savant = fetch_pitcher_leaderboard()

    time.sleep(15)
    print("\n--- Fetching batter leaderboards ---", file=sys.stderr)
    batter_overall, batter_rhp, batter_lhp = fetch_batter_leaderboards(batter_ids)
    print(
        f"  batter_overall={len(batter_overall)} rhp={len(batter_rhp)} lhp={len(batter_lhp)}",
        file=sys.stderr,
    )

    time.sleep(5)
    print("\n--- Fetching pitch arsenal ---", file=sys.stderr)
    arsenal_by_pitcher = fetch_pitch_arsenal()

    # Per-player zone fetches disabled: ~200 sequential statcast_search/csv
    # requests that have never returned non-zero data in production, and
    # hammering that endpoint was likely triggering rate-limit blocks that
    # broke subsequent leaderboard calls.
    pitcher_zones: dict = {}
    batter_zones: dict = {}

    # ---- Build output pitchers dict ----------------------------------------
    print("\n--- Building output ---", file=sys.stderr)
    out_pitchers = {}
    for pid, pname in pitcher_id_to_name.items():
        if pid in pitcher_savant:
            entry = dict(pitcher_savant[pid])
            # Ensure name is filled if leaderboard had it blank
            if not entry.get("name"):
                entry["name"] = pname
        else:
            print(
                f"  [fallback] pitcher {pid} ({pname}) not in Savant leaderboard",
                file=sys.stderr,
            )
            entry = pitcher_fallback_from_raw(pid, pname, raw_pitcher_stats)

        # Attach zones
        entry["zones"] = pitcher_zones.get(pid, [0.0] * 9)

        # Attach arsenal
        entry["arsenal"] = arsenal_by_pitcher.get(pid, [])

        out_pitchers[str(pid)] = entry

    # ---- Build output batters dict -----------------------------------------
    out_batters = {}
    for bid, bname in batter_id_to_name.items():
        if bid not in batter_overall:
            # Skip — score_matchups.py will fall back to real MLB Stats API data
            # (batter_raw from raw_slate.json) instead of fake constants.
            print(
                f"  [skip] batter {bid} ({bname}) not in Savant leaderboard — MLB Stats fallback applies",
                file=sys.stderr,
            )
            continue
        base = dict(batter_overall[bid])

        # Fill name if missing
        if not base.get("name"):
            base["name"] = bname

        # Merge mlb_id
        base["mlb_id"] = bid

        # vs-RHP stats
        if bid in batter_rhp:
            r = batter_rhp[bid]
            base["pa_vs_rhp"] = r.get("pa", 0)
            base["xwoba_vs_rhp"] = r.get("xwoba", base.get("xwoba", 0.320))
            base["barrel_pct_vs_rhp"] = r.get("barrel_pct", base.get("barrel_pct", 7.0))
            base["hard_hit_pct_vs_rhp"] = r.get("hard_hit_pct", base.get("hard_hit_pct", 38.0))
        else:
            base["pa_vs_rhp"] = 0
            base["xwoba_vs_rhp"] = base.get("xwoba", 0.320)
            base["barrel_pct_vs_rhp"] = base.get("barrel_pct", 7.0)
            base["hard_hit_pct_vs_rhp"] = base.get("hard_hit_pct", 38.0)

        # vs-LHP stats
        if bid in batter_lhp:
            l = batter_lhp[bid]
            base["pa_vs_lhp"] = l.get("pa", 0)
            base["xwoba_vs_lhp"] = l.get("xwoba", base.get("xwoba", 0.320))
            base["barrel_pct_vs_lhp"] = l.get("barrel_pct", base.get("barrel_pct", 7.0))
            base["hard_hit_pct_vs_lhp"] = l.get("hard_hit_pct", base.get("hard_hit_pct", 38.0))
        else:
            base["pa_vs_lhp"] = 0
            base["xwoba_vs_lhp"] = base.get("xwoba", 0.320)
            base["barrel_pct_vs_lhp"] = base.get("barrel_pct", 7.0)
            base["hard_hit_pct_vs_lhp"] = base.get("hard_hit_pct", 38.0)

        # Attach zones
        base["zones"] = batter_zones.get(bid, [0.0] * 9)

        # Canonical field ordering for readability
        entry = {
            "mlb_id": base["mlb_id"],
            "name": base.get("name", bname),
            "stands": base.get("stands", "R"),
            "pa": base.get("pa", 0),
            "pa_vs_rhp": base.get("pa_vs_rhp", 0),
            "pa_vs_lhp": base.get("pa_vs_lhp", 0),
            "xwoba": base.get("xwoba", 0.320),
            "xba": base.get("xba", 0.250),
            "xslg": base.get("xslg", 0.420),
            "xiso": base.get("xiso", 0.170),
            "xwoba_vs_rhp": base.get("xwoba_vs_rhp", 0.320),
            "xwoba_vs_lhp": base.get("xwoba_vs_lhp", 0.320),
            "exit_velo": base.get("exit_velo", 88.0),
            "la_avg": base.get("la_avg", 12.0),
            "barrel_pct": base.get("barrel_pct", 7.0),
            "hard_hit_pct": base.get("hard_hit_pct", 38.0),
            "sweet_spot_pct": base.get("sweet_spot_pct", 33.0),
            "swstr_pct": base.get("swstr_pct", 10.0),
            "o_swing_pct": base.get("o_swing_pct", 28.0),
            "fb_pct": base.get("fb_pct", 35.0),
            "gb_pct": base.get("gb_pct", 42.0),
            "ld_pct": base.get("ld_pct", 23.0),
            "pull_pct": base.get("pull_pct", 38.0),
            "oppo_pct": base.get("oppo_pct", 24.0),
            "pull_brl_pct": base.get("pull_brl_pct", 2.7),
            "k_pct": base.get("k_pct", 0.220),
            "bb_pct": base.get("bb_pct", 0.080),
            "zones": base.get("zones", [0.0] * 9),
        }
        out_batters[str(bid)] = entry

    # ---- Write output -------------------------------------------------------
    output = {"pitchers": out_pitchers, "batters": out_batters}
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(
        f"\nWrote {OUTPUT_PATH}  "
        f"({len(out_pitchers)} pitchers, {len(out_batters)} batters)",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
