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
# NOTE: statcast_search/csv with group_by=name returns per-pitch rows, NOT
# aggregated stats. We collect all rows per batter and aggregate ourselves.

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
    Returns a 9-element list (zones 1-9) of pitch frequency fractions.
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
    Returns a 9-element list of xwoba_mean per zone (zones 1-9).
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
            if not entry.get("name"):
                entry["name"] = pname
        else:
            print(
                f"  [fallback] pitcher {pid} ({pname}) not in Savant leaderboard",
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

        l = batter_lhp.get(bid, {})
        base["pa_vs_lhp"] = l.get("pa", 0)
        base["xwoba_vs_lhp"] = l.get("xwoba", 0.0)
        base["barrel_pct_vs_lhp"] = l.get("barrel_pct", 0.0)
        base["hard_hit_pct_vs_lhp"] = l.get("hard_hit_pct", 0.0)

        base["zones"] = batter_zones.get(bid, [0.0] * 9)

        entry = {
            "mlb_id": bid,
            "name": base.get("name", bname),
            "stands": base.get("stands", "R"),
            "pa": base.get("pa", 0),
            "pa_vs_rhp": base["pa_vs_rhp"],
            "pa_vs_lhp": base["pa_vs_lhp"],
            "xwoba": base.get("xwoba", 0.0),
            "xba": base.get("xba", 0.0),
            "xslg": base.get("xslg", 0.0),
            "xiso": base.get("xiso", 0.0),
            "xwoba_vs_rhp": base["xwoba_vs_rhp"],
            "xwoba_vs_lhp": base["xwoba_vs_lhp"],
            "exit_velo": base.get("exit_velo", 0.0),
            "la_avg": base.get("la_avg", 0.0),
            "barrel_pct": base.get("barrel_pct", 0.0),
            "hard_hit_pct": base.get("hard_hit_pct", 0.0),
            "sweet_spot_pct": base.get("sweet_spot_pct", 0.0),
            "barrel_pct_vs_rhp": base["barrel_pct_vs_rhp"],
            "hard_hit_pct_vs_rhp": base["hard_hit_pct_vs_rhp"],
            "barrel_pct_vs_lhp": base["barrel_pct_vs_lhp"],
            "hard_hit_pct_vs_lhp": base["hard_hit_pct_vs_lhp"],
            "swstr_pct": 0.0,
            "o_swing_pct": 0.0,
            "fb_pct": base.get("fb_pct", 0.0),
            "gb_pct": base.get("gb_pct", 0.0),
            "ld_pct": base.get("ld_pct", 0.0),
            "pull_pct": base.get("pull_pct", 0.0),
            "oppo_pct": base.get("oppo_pct", 0.0),
            "pull_brl_pct": base.get("pull_brl_pct", 0.0),
            "k_pct": 0.0,
            "bb_pct": 0.0,
            "zones": base["zones"],
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
