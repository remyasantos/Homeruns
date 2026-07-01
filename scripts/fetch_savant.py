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
    """
    GET a Savant CSV endpoint and return list-of-dicts.
    Retries on network errors with exponential backoff.
    """
    for attempt in range(1, retries + 1):
        try:
            resp = SESSION.get(url, params=params, timeout=45)
            resp.raise_for_status()
            text = resp.text.strip()
            if not text or text.startswith("<"):
                print(
                    f"  [{label}] attempt {attempt}: non-CSV response "
                    f"({len(text)} chars)",
                    file=sys.stderr,
                )
                if attempt < retries:
                    time.sleep(backoff * attempt)
                    continue
                return []
            reader = csv.DictReader(io.StringIO(text))
            rows = list(reader)
            print(
                f"  [{label}] {len(rows)} rows from {url.split('/')[-1]}",
                file=sys.stderr,
            )
            return rows
        except Exception as exc:
            print(
                f"  [{label}] attempt {attempt} error: {exc}",
                file=sys.stderr,
            )
            if attempt < retries:
                time.sleep(backoff * attempt)
    return []


# ---------------------------------------------------------------------------
# 1. Pitcher leaderboard (bulk fetch)
# ---------------------------------------------------------------------------

_PITCHER_LEADERBOARD_URL = "https://baseballsavant.mlb.com/leaderboard/custom"

PITCHER_SELECTIONS = [
    "xwoba",
    "xba",
    "xslg",
    "exit_velocity_avg",
    "launch_angle_avg",
    "barrel_batted_rate",
    "hard_hit_percent",
    "sweet_spot_percent",
    "whiff_percent",
    "k_percent",
    "bb_percent",
    "csw_rate",
    "groundballs_percent",
    "flyballs_percent",
    "linedrives_percent",
    "pull_percent",
    "straightaway_percent",
    "opposite_percent",
    "f_strike_percent",
    "in_zone_percent",
    "out_zone_swing_percent",
    "pitch_count",
    "pa",
    "p_formatted_ip",
]


def fetch_pitcher_leaderboard():
    """
    Fetch the Savant custom leaderboard for pitchers (2026, regular season).
    Returns dict keyed by int player_id → stat dict.
    """
    params = {
        "year": "2026",
        "pos": "1",  # pitchers
        "hof": "0",
        "p_hand": "",
        "min_pa": "1",
        "min_pitches": "0",
        "type": "pitcher",
        "player_type": "pitcher",
        "sort_col": "pa",
        "sort_order": "desc",
        "csv": "true",
        "selections": ",".join(PITCHER_SELECTIONS),
        "game_type": "R",
    }

    rows = get_csv(_PITCHER_LEADERBOARD_URL, params, label="pitcher leaderboard")

    result = {}
    for row in rows:
        pid = None
        for col in ("player_id", "mlb_id", "xMLBAMID", "key_mlbam", "id", "pitcher_id"):
            v = row.get(col)
            if v and str(v).strip() not in ("", "0", "None"):
                try:
                    pid = int(safe_float(v))
                    if pid > 0:
                        break
                except Exception:
                    pass
        if not pid:
            continue

        def _f(k, default=0.0):
            return safe_float(row.get(k, default), default)

        xwoba = _f("xwoba") or _f("est_woba") or _f("xwoba_mean")
        xba   = _f("xba") or _f("est_ba") or _f("xba_mean")
        xslg  = _f("xslg") or _f("est_slg") or _f("xslg_mean")

        result[pid] = {
            "mlb_id":            pid,
            "name":              (row.get("player_name") or row.get("name") or "").strip(),
            "throws":            (row.get("p_throws") or row.get("pitch_hand") or "R").strip(),
            "pa":                safe_int(row.get("pa") or row.get("total_pa"), 0),
            "xwoba":             round(xwoba, 3),
            "xba":               round(xba, 3),
            "xslg":              round(xslg, 3),
            "exit_velo":         _f("exit_velocity_avg") or _f("avg_exit_velo") or _f("exit_velo"),
            "la_avg":            _f("launch_angle_avg") or _f("la_avg"),
            "barrel_pct":        _f("barrel_batted_rate") or _f("barrel_pct"),
            "hard_hit_pct":      _f("hard_hit_percent") or _f("hard_hit_pct") or _f("hardHitPercent"),
            "sweet_spot_pct":    _f("sweet_spot_percent") or _f("sweet_spot_pct"),
            "swstr_pct":         _f("whiff_percent") or _f("swstr_pct") or _f("z_swing_miss_percent"),
            "csw_pct":           _f("csw_rate") or _f("csw_pct"),
            "o_swing_pct":       _f("out_zone_swing_percent") or _f("o_swing_pct"),
            "in_zone_pct":       _f("in_zone_percent") or _f("in_zone_pct"),
            "f_strike_pct":      _f("f_strike_percent") or _f("f_strike_pct"),
            "ball_pct":          0.0,  # not in leaderboard; populated from statcast_search
            "fb_pct":            _f("flyballs_percent") or _f("fb_pct") or _f("flyballs_percent"),
            "gb_pct":            _f("groundballs_percent") or _f("gb_pct"),
            "ld_pct":            _f("linedrives_percent") or _f("ld_pct"),
            "pull_pct":          _f("pull_percent") or _f("pull_pct"),
            "oppo_pct":          _f("opposite_percent") or _f("oppo_pct") or _f("oppo_percent"),
            "k_pct":             _f("k_percent") or _f("k_pct"),
            "bb_pct":            _f("bb_percent") or _f("bb_pct"),
            "pulled_barrel_pct": 0.0,
            "zones":             [],
            "arsenal":           [],
        }

    print(f"  Pitcher leaderboard: {len(result)} pitchers", file=sys.stderr)
    return result


# ---------------------------------------------------------------------------
# Pitch arsenal (bulk leaderboard)
# ---------------------------------------------------------------------------

_ARSENAL_URL = "https://baseballsavant.mlb.com/leaderboard/pitch-arsenal-stats"


def fetch_pitch_arsenal():
    """
    Fetch pitch arsenal stats for all pitchers from the Savant leaderboard.
    Returns dict keyed by int pitcher_id → list of pitch-type dicts.
    """
    params = {
        "type": "pitcher",
        "pitchType": "",
        "year": "2026",
        "team": "",
        "csv": "true",
    }
    rows = get_csv(_ARSENAL_URL, params, label="pitch arsenal")

    result = {}
    for row in rows:
        pid = None
        for col in ("player_id", "pitcher_id", "mlb_id", "id", "xMLBAMID"):
            v = row.get(col)
            if v and str(v).strip() not in ("", "0", "None"):
                try:
                    pid = int(safe_float(v))
                    if pid > 0:
                        break
                except Exception:
                    pass
        if not pid:
            continue

        pitch_type = (row.get("pitch_type") or row.get("pitch_name") or "").strip()
        pitch_name = (row.get("pitch_type_name") or row.get("pitch_type") or pitch_type).strip()
        if not pitch_type:
            continue

        def _pf(k, default=None):
            v = row.get(k)
            if v is None or str(v).strip() in ("", "null", "None", ".", "-"):
                return default
            try:
                return round(float(str(v).replace("%", "")), 2)
            except Exception:
                return default

        entry = {
            "pitch_type":  pitch_type,
            "pitch_name":  pitch_name,
            "usage_pct":   _pf("pitch_usage") or _pf("pitch_percent") or _pf("run_value_per_100") or 0.0,
            "avg_speed":   _pf("avg_speed") or _pf("velocity") or _pf("release_speed"),
            "avg_spin":    _pf("avg_spin") or _pf("spin_rate"),
            "run_value":   _pf("run_value") or _pf("rv100") or _pf("run_value_per_100"),
            "whiff_pct":   _pf("whiff_percent") or _pf("whiff_pct"),
            "xwoba":       _pf("xwoba") or _pf("est_woba"),
        }
        result.setdefault(pid, []).append(entry)

    print(f"  Pitch arsenal: {len(result)} pitchers", file=sys.stderr)
    return result


# ---------------------------------------------------------------------------
# Batter leaderboard helpers
# ---------------------------------------------------------------------------

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


def _aggregate_batter_rows(rows, include_meta=False):
    """
    Aggregate per-pitch statcast_search rows into a single batter stat dict.
    Computes proper averages from event-level and contact-level data.
    """
    xwoba_vals, xba_vals, xslg_vals = [], [], []
    ev_vals, la_vals = [], []
    bip_count = 0
    barrel_count = 0
    hard_hit_count = 0
    sweet_spot_count = 0
    gb_count = 0
    fb_count = 0
    ld_count = 0
    pull_count = 0
    oppo_count = 0
    name = ""
    stands = "R"

    for row in rows:
        # PA-level metrics: only on rows where woba_denom == 1 (valid plate appearances)
        denom = str(row.get("woba_denom", "")).strip()
        if denom == "1":
            v = safe_float(row.get("estimated_woba_using_speedangle", ""), -1)
            if v >= 0:
                xwoba_vals.append(v)
            v = safe_float(row.get("estimated_ba_using_speedangle", ""), -1)
            if v >= 0:
                xba_vals.append(v)
            v = safe_float(row.get("estimated_slg_using_speedangle", ""), -1)
            if v >= 0:
                xslg_vals.append(v)

        # Contact metrics: only on rows with a real batted ball (launch_speed > 0)
        ls_raw = str(row.get("launch_speed", "")).strip()
        la_raw = str(row.get("launch_angle", "")).strip()
        if ls_raw not in ("", ".", "null", "None"):
            ls = safe_float(ls_raw, 0.0)
            if ls > 0:
                ev_vals.append(ls)
                bip_count += 1
                la = safe_float(la_raw, 0.0)
                la_vals.append(la)
                if ls >= 95:
                    hard_hit_count += 1
                # launch_speed_angle codes: 6=barrel, 5=solid, 4=flare, 3=under, 2=topped, 1=weak
                lsa = str(row.get("launch_speed_angle", "")).strip()
                if lsa == "6":
                    barrel_count += 1
                # sweet spot: launch angle 8-32 degrees
                if 8 <= la <= 32:
                    sweet_spot_count += 1
                bb_type = str(row.get("bb_type", "")).strip().lower()
                if bb_type == "ground_ball":
                    gb_count += 1
                elif bb_type == "fly_ball":
                    fb_count += 1
                elif bb_type == "line_drive":
                    ld_count += 1
                # pull/oppo: hc_x < ~100 = left side, > ~155 = right side of field
                hc_x = safe_float(row.get("hc_x", ""), 0.0)
                bat_side = str(row.get("stand", stands)).strip()
                if hc_x > 0:
                    if bat_side == "R":
                        if hc_x < 100:
                            pull_count += 1
                        elif hc_x > 155:
                            oppo_count += 1
                    else:
                        if hc_x > 155:
                            pull_count += 1
                        elif hc_x < 100:
                            oppo_count += 1

        if include_meta:
            n = (row.get("player_name") or row.get("name") or "").strip()
            if n:
                name = n
            s = str(row.get("stand") or row.get("bat_side") or "").strip()
            if s:
                stands = s

    def _avg(vals):
        return round(sum(vals) / len(vals), 3) if vals else 0.0

    pa = len(xwoba_vals)
    xwoba = _avg(xwoba_vals)
    xba = _avg(xba_vals)
    xslg = _avg(xslg_vals)
    exit_velo = _avg(ev_vals)
    la_avg = _avg(la_vals)
    barrel_pct = round(barrel_count / bip_count * 100, 1) if bip_count > 0 else 0.0
    hard_hit_pct = round(hard_hit_count / bip_count * 100, 1) if bip_count > 0 else 0.0
    sweet_spot_pct = round(sweet_spot_count / bip_count * 100, 1) if bip_count > 0 else 0.0
    gb_pct = round(gb_count / bip_count * 100, 1) if bip_count > 0 else 0.0
    fb_pct = round(fb_count / bip_count * 100, 1) if bip_count > 0 else 0.0
    ld_pct = round(ld_count / bip_count * 100, 1) if bip_count > 0 else 0.0
    pull_pct = round(pull_count / bip_count * 100, 1) if bip_count > 0 else 0.0
    oppo_pct = round(oppo_count / bip_count * 100, 1) if bip_count > 0 else 0.0
    pull_brl_pct = round(barrel_count / bip_count * pull_pct / 100, 2) if bip_count > 0 else 0.0

    d = {
        "pa": pa,
        "xwoba": xwoba,
        "xba": xba,
        "xslg": xslg,
        "xiso": round(max(0.0, xslg - xba), 3),
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
    if include_meta:
        d["name"] = name
        d["stands"] = stands
    return d


# ---------------------------------------------------------------------------
# 2 & 3. Batter stats via statcast_search/csv (batched by player ID)
# ---------------------------------------------------------------------------
# NOTE: statcast_search/csv with group_by=name returns per-pitch rows, NOT
# aggregated stats. We collect all rows per batter and aggregate ourselves.

_ZONE_CSV_BASE = "https://baseballsavant.mlb.com/statcast_search/csv"
_BATTER_BATCH_SIZE = 40


def _fetch_batter_statcast_batched(bids, pitcher_throws=None, label_prefix="batter statcast"):
    """
    Fetch statcast_search/csv for a list of batter IDs in batches.
    Returns dict keyed by int player_id → aggregated stat dict.
    The endpoint returns raw pitch-level rows; we aggregate per batter here.
    pitcher_throws: None (all), "R", or "L" — filters opponent pitcher hand.
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

        # Group rows by batter ID, then aggregate each batter's pitches
        batter_rows: dict = {}
        for row in rows:
            pid = _extract_player_id(row)
            if pid == 0:
                continue
            batter_rows.setdefault(pid, []).append(row)

        include_meta = (pitcher_throws is None)
        for pid, prows in batter_rows.items():
            result[pid] = _aggregate_batter_rows(prows, include_meta=include_meta)

        print(
            f"  [{label}] {len(batter_rows)} batters aggregated from {len(rows)} rows",
            file=sys.stderr,
        )
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
# Zone fetches (per-pitcher, per-batter)
# ---------------------------------------------------------------------------

def fetch_pitcher_zones(pitcher_id):
    """
    Fetch xwOBA-by-zone for a specific pitcher from statcast_search/csv.
    Returns list of 9 floats (zones 1-9, 0.0 if no data).
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


def fetch_batter_zones(batter_id):
    """
    Fetch xwOBA-by-zone for a specific batter from statcast_search/csv.
    Returns list of 9 floats (zones 1-9, 0.0 if no data).
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

    # Rough estimates from MLB Stats
    xwoba_est = round(era * 0.055 + 0.22, 3)
    k_pct_est = round(min(k9 / 27.0, 0.40), 3)
    bb_pct_est = round(min(bb9 / 27.0, 0.20), 3)
    barrel_pct_est = round(hr9 * 1.8, 1)

    return {
        "mlb_id": pitcher_id,
        "name": pitcher_name,
        "throws": "R",
        "pa": 0,               # 0 signals "no real Savant data" to score_matchups.py
        "xwoba": xwoba_est,    # ERA-derived estimate — acceptable
        "xba": None,
        "xslg": None,
        "exit_velo": None,     # Savant-only, no MLB Stats equivalent
        "la_avg": None,
        "barrel_pct": barrel_pct_est,  # HR/9-derived estimate — acceptable
        "hard_hit_pct": None,  # Savant-only
        "sweet_spot_pct": None,
        "swstr_pct": None,     # Savant-only
        "csw_pct": None,       # Savant-only
        "o_swing_pct": None,
        "in_zone_pct": None,
        "f_strike_pct": None,
        "ball_pct": None,      # Savant-only
        "fb_pct": None,        # Savant-only
        "gb_pct": None,
        "ld_pct": None,
        "pull_pct": None,
        "oppo_pct": None,      # Savant-only
        "pulled_barrel_pct": None,
        "k_pct": k_pct_est,
        "bb_pct": bb_pct_est,
        "zones": [0.0] * 9,
        "arsenal": [],
    }


# ---------------------------------------------------------------------------
# Pitcher statcast_search fallback (for pitchers not in leaderboard)
# ---------------------------------------------------------------------------

def _extract_pitcher_id(row):
    """Extract pitcher MLBAM ID from a statcast_search/csv row (pitcher-type fetch)."""
    for col in ("pitcher", "player_id", "mlb_id", "xMLBAMID", "key_mlbam", "pitcher_id", "id"):
        v = row.get(col)
        if v is not None and str(v).strip() not in ("", "0", "None"):
            try:
                pid = int(safe_float(v))
                if pid > 0:
                    return pid
            except Exception:
                pass
    return 0


def _aggregate_pitcher_rows(rows):
    """Aggregate per-pitch statcast_search rows into pitcher stat dict."""
    xwoba_vals = []
    ev_vals, la_vals = [], []
    bip_count = 0
    barrel_count = 0
    hard_hit_count = 0
    sweet_spot_count = 0
    gb_count = 0
    fb_count = 0
    ld_count = 0
    pull_count = 0
    oppo_count = 0
    name = ""
    throws = "R"

    for row in rows:
        denom = str(row.get("woba_denom", "")).strip()
        if denom == "1":
            v = safe_float(row.get("estimated_woba_using_speedangle", ""), -1)
            if v >= 0:
                xwoba_vals.append(v)

        ls_raw = str(row.get("launch_speed", "")).strip()
        la_raw = str(row.get("launch_angle", "")).strip()
        if ls_raw not in ("", ".", "null", "None"):
            ls = safe_float(ls_raw, 0.0)
            if ls > 0:
                ev_vals.append(ls)
                bip_count += 1
                la = safe_float(la_raw, 0.0)
                la_vals.append(la)
                if ls >= 95:
                    hard_hit_count += 1
                lsa = str(row.get("launch_speed_angle", "")).strip()
                if lsa == "6":
                    barrel_count += 1
                if 8 <= la <= 32:
                    sweet_spot_count += 1
                bb_type = str(row.get("bb_type", "")).strip().lower()
                if bb_type == "ground_ball":
                    gb_count += 1
                elif bb_type == "fly_ball":
                    fb_count += 1
                elif bb_type == "line_drive":
                    ld_count += 1
                hc_x = safe_float(row.get("hc_x", ""), 0.0)
                bat_side = str(row.get("stand", "R")).strip()
                if hc_x > 0:
                    if bat_side == "R":
                        if hc_x < 100:
                            pull_count += 1
                        elif hc_x > 155:
                            oppo_count += 1
                    else:
                        if hc_x > 155:
                            pull_count += 1
                        elif hc_x < 100:
                            oppo_count += 1

        n = (row.get("player_name") or row.get("pitcher_name") or "").strip()
        if n:
            name = n
        t = str(row.get("p_throws") or row.get("throws") or "").strip()
        if t in ("R", "L"):
            throws = t

    def _avg(vals):
        return round(sum(vals) / len(vals), 3) if vals else None

    pa = len(xwoba_vals)
    return {
        "pa": pa,
        "name": name,
        "throws": throws,
        "xwoba": _avg(xwoba_vals),
        "exit_velo": _avg(ev_vals),
        "la_avg": _avg(la_vals),
        "barrel_pct": round(barrel_count / bip_count * 100, 1) if bip_count > 0 else None,
        "hard_hit_pct": round(hard_hit_count / bip_count * 100, 1) if bip_count > 0 else None,
        "sweet_spot_pct": round(sweet_spot_count / bip_count * 100, 1) if bip_count > 0 else None,
        "gb_pct": round(gb_count / bip_count * 100, 1) if bip_count > 0 else None,
        "fb_pct": round(fb_count / bip_count * 100, 1) if bip_count > 0 else None,
        "ld_pct": round(ld_count / bip_count * 100, 1) if bip_count > 0 else None,
        "pull_pct": round(pull_count / bip_count * 100, 1) if bip_count > 0 else None,
        "oppo_pct": round(oppo_count / bip_count * 100, 1) if bip_count > 0 else None,
        # Savant leaderboard-only fields — not in statcast_search rows
        "xba": None,
        "xslg": None,
        "swstr_pct": None,
        "csw_pct": None,
        "o_swing_pct": None,
        "in_zone_pct": None,
        "f_strike_pct": None,
        "ball_pct": None,
        "pulled_barrel_pct": None,
        "k_pct": None,
        "bb_pct": None,
        "zones": [],
        "arsenal": [],
    }


def fetch_pitcher_statcast_search(pitcher_ids):
    """
    Fetch statcast_search/csv for specific pitcher IDs.
    Used as fallback for pitchers not found in the leaderboard.
    Returns dict keyed by int pitcher_id → aggregated stat dict.
    """
    if not pitcher_ids:
        return {}

    result = {}
    pids = list(pitcher_ids)
    batch_size = 20
    for i in range(0, len(pids), batch_size):
        batch = pids[i:i + batch_size]
        params = {
            "all": "true",
            "hfGT": "R|",
            "hfSea": "2026|",
            "player_type": "pitcher",
            "group_by": "name",
            "type": "details",
            "min_pitches": "0",
            "min_results": "0",
            "sort_col": "pitches",
            "sort_order": "desc",
            "pitchers_lookup[]": [str(p) for p in batch],
        }
        rows = get_csv(_ZONE_CSV_BASE, params, label=f"pitcher statcast_search batch {i//batch_size+1}")

        pitcher_rows: dict = {}
        for row in rows:
            pid = _extract_pitcher_id(row)
            if pid == 0:
                continue
            pitcher_rows.setdefault(pid, []).append(row)

        for pid, prows in pitcher_rows.items():
            result[pid] = _aggregate_pitcher_rows(prows)
            print(f"  [statcast_search fallback] pitcher {pid}: {len(prows)} pitch rows", file=sys.stderr)

        if i + batch_size < len(pids):
            time.sleep(5)

    return result


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

    # ---- Pitcher statcast_search fallback for missing pitchers -------------
    missing_pitchers = {pid for pid in pitcher_ids if pid not in pitcher_savant}
    pitcher_statcast_fallback = {}
    if missing_pitchers:
        print(
            f"\n--- Fetching statcast_search fallback for {len(missing_pitchers)} missing pitchers ---",
            file=sys.stderr,
        )
        time.sleep(5)
        pitcher_statcast_fallback = fetch_pitcher_statcast_search(missing_pitchers)
        print(
            f"  statcast_search fallback found {len(pitcher_statcast_fallback)} pitchers",
            file=sys.stderr,
        )

    # ---- Build output pitchers dict ----------------------------------------
    print("\n--- Building output ---", file=sys.stderr)
    out_pitchers = {}
    for pid, pname in pitcher_id_to_name.items():
        if pid in pitcher_savant:
            entry = dict(pitcher_savant[pid])
            if not entry.get("name"):
                entry["name"] = pname
        elif pid in pitcher_statcast_fallback:
            print(
                f"  [statcast_search fallback] pitcher {pid} ({pname}) using statcast_search data",
                file=sys.stderr,
            )
            entry = dict(pitcher_statcast_fallback[pid])
            entry["mlb_id"] = pid
            if not entry.get("name"):
                entry["name"] = pname
        else:
            print(
                f"  [raw fallback] pitcher {pid} ({pname}) not in Savant — using MLB Stats estimates",
                file=sys.stderr,
            )
            entry = pitcher_fallback_from_raw(pid, pname, raw_pitcher_stats)

        entry["zones"] = pitcher_zones.get(pid, [0.0] * 9)
        entry["arsenal"] = arsenal_by_pitcher.get(pid, [])
        out_pitchers[str(pid)] = entry

    # ---- Build output batters dict -----------------------------------------
    out_batters = {}
    for bid, bname in batter_id_to_name.items():
        if bid not in batter_overall:
            print(
                f"  [skip] batter {bid} ({bname}) not in Savant data — MLB Stats fallback applies",
                file=sys.stderr,
            )
            continue
        base = dict(batter_overall[bid])

        if not base.get("name"):
            base["name"] = bname
        base["mlb_id"] = bid

        # vs-hand splits
        r = batter_rhp.get(bid, {})
        base["pa_vs_rhp"] = r.get("pa", 0)
        base["xwoba_vs_rhp"] = r.get("xwoba", 0.0)
        base["barrel_pct_vs_rhp"] = r.get("barrel_pct", 0.0)
        base["hard_hit_pct_vs_rhp"] = r.get("hard_hit_pct", 0.0)

        lh = batter_lhp.get(bid, {})
        base["pa_vs_lhp"] = lh.get("pa", 0)
        base["xwoba_vs_lhp"] = lh.get("xwoba", 0.0)
        base["barrel_pct_vs_lhp"] = lh.get("barrel_pct", 0.0)
        base["hard_hit_pct_vs_lhp"] = lh.get("hard_hit_pct", 0.0)

        base["zones"] = batter_zones.get(bid, [])
        out_batters[str(bid)] = base

    # ---- Write output -------------------------------------------------------
    out = {"pitchers": out_pitchers, "batters": out_batters}
    with open(OUTPUT_PATH, "w") as f:
        json.dump(out, f, indent=2)
    print(f"\nWrote {OUTPUT_PATH}", file=sys.stderr)
    print(
        f"  pitchers={len(out_pitchers)} batters={len(out_batters)}",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
