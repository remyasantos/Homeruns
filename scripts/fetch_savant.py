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

import pandas as pd
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
    "xwoba", "xba", "xslg", "exit_velocity_avg", "launch_angle_avg",
    "barrel_batted_rate", "hard_hit_percent", "sweet_spot_percent",
    "whiff_percent", "k_percent", "bb_percent", "csw_rate",
    "groundballs_percent", "flyballs_percent", "linedrives_percent",
    "pull_percent", "straightaway_percent", "opposite_percent",
    "f_strike_percent", "in_zone_percent", "out_zone_swing_percent",
    "pitch_count", "pa", "p_formatted_ip",
]


def fetch_pitcher_leaderboard():
    params = {
        "year": "2026", "pos": "1", "hof": "0", "p_hand": "",
        "min_pa": "1", "min_pitches": "0", "type": "pitcher",
        "player_type": "pitcher", "sort_col": "pa", "sort_order": "desc",
        "csv": "true", "selections": ",".join(PITCHER_SELECTIONS), "game_type": "R",
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
            "ball_pct":          0.0,
            "fb_pct":            _f("flyballs_percent") or _f("fb_pct"),
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
    params = {
        "type": "pitcher", "pitchType": "", "year": "2026",
        "team": "", "csv": "true",
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


def _build_bip_flags(df: "pd.DataFrame") -> "pd.DataFrame":
    df = df.copy()
    df["hard_hit"]    = df["launch_speed"] >= 95
    df["barrel"]      = df["launch_speed_angle"].astype(str).str.strip() == "6"
    df["sweet_spot"]  = df["launch_angle"].between(8, 32)
    bb = df["bb_type"].astype(str).str.lower().str.strip()
    df["gb"] = bb == "ground_ball"
    df["fb"] = bb == "fly_ball"
    df["ld"] = bb == "line_drive"
    rh = df["stand"].astype(str).str.strip() == "R"
    hx = df["hc_x"]
    valid_hx = hx > 0
    df["pull"] = valid_hx & ((rh & (hx < 100)) | (~rh & (hx > 155)))
    df["oppo"] = valid_hx & ((rh & (hx > 155)) | (~rh & (hx < 100)))
    return df


def _pct(count, total, none_on_empty=False):
    if total == 0:
        return None if none_on_empty else 0.0
    return round(int(count) / int(total) * 100, 1)


def _aggregate_batter_rows(rows, include_meta=False):
    if not rows:
        d = {
            "pa": 0, "xwoba": 0.0, "xba": 0.0, "xslg": 0.0, "xiso": 0.0,
            "exit_velo": 0.0, "la_avg": 0.0, "barrel_pct": 0.0, "hard_hit_pct": 0.0,
            "sweet_spot_pct": 0.0, "swstr_pct": 0.0, "o_swing_pct": 0.0,
            "gb_pct": 0.0, "fb_pct": 0.0, "ld_pct": 0.0,
            "pull_pct": 0.0, "oppo_pct": 0.0, "pull_brl_pct": 0.0,
        }
        if include_meta:
            d.update({"name": "", "stands": "R"})
        return d

    df = pd.DataFrame(rows)

    woba_denom = pd.to_numeric(df.get("woba_denom", 0), errors="coerce").fillna(0)
    pa_mask = woba_denom == 1

    xw   = pd.to_numeric(df.get("estimated_woba_using_speedangle"), errors="coerce")
    xba  = pd.to_numeric(df.get("estimated_ba_using_speedangle"),   errors="coerce")
    xslg = pd.to_numeric(df.get("estimated_slg_using_speedangle"),  errors="coerce")

    valid_xw = pa_mask & xw.notna() & (xw >= 0)
    pa       = int(valid_xw.sum())
    xwoba    = round(float(xw[valid_xw].mean()),  3) if pa > 0 else 0.0
    xba_val  = round(float(xba[pa_mask & xba.notna() & (xba >= 0)].mean()), 3) if pa > 0 else 0.0
    xslg_val = round(float(xslg[pa_mask & xslg.notna() & (xslg >= 0)].mean()), 3) if pa > 0 else 0.0

    ls = pd.to_numeric(df.get("launch_speed"), errors="coerce")
    la = pd.to_numeric(df.get("launch_angle"), errors="coerce").fillna(0.0)
    df["launch_speed"]       = ls
    df["launch_angle"]       = la
    df["launch_speed_angle"] = df.get("launch_speed_angle", "").fillna("")
    df["bb_type"]            = df.get("bb_type", "").fillna("")
    df["hc_x"]               = pd.to_numeric(df.get("hc_x"), errors="coerce").fillna(0.0)
    df["stand"]              = df.get("stand", "R").fillna("R")

    bip_df = _build_bip_flags(df[ls.notna() & (ls > 0)])
    bip_count = len(bip_df)

    exit_velo    = round(float(bip_df["launch_speed"].mean()), 3) if bip_count > 0 else 0.0
    la_avg       = round(float(bip_df["launch_angle"].mean()),  3) if bip_count > 0 else 0.0
    barrel_pct   = _pct(bip_df["barrel"].sum(),     bip_count)
    hard_hit_pct = _pct(bip_df["hard_hit"].sum(),   bip_count)
    sweet_pct    = _pct(bip_df["sweet_spot"].sum(),  bip_count)
    gb_pct       = _pct(bip_df["gb"].sum(),          bip_count)
    fb_pct       = _pct(bip_df["fb"].sum(),          bip_count)
    ld_pct       = _pct(bip_df["ld"].sum(),          bip_count)
    pull_pct     = _pct(bip_df["pull"].sum(),        bip_count)
    oppo_pct     = _pct(bip_df["oppo"].sum(),        bip_count)

    barrel_n = int(bip_df["barrel"].sum())
    pull_n   = int(bip_df["pull"].sum())
    pull_brl = round(barrel_n * pull_n / bip_count ** 2, 2) if bip_count > 0 else 0.0

    d = {
        "pa":            pa,
        "xwoba":         xwoba,
        "xba":           xba_val,
        "xslg":          xslg_val,
        "xiso":          round(max(0.0, xslg_val - xba_val), 3),
        "exit_velo":     exit_velo,
        "la_avg":        la_avg,
        "barrel_pct":    barrel_pct,
        "hard_hit_pct":  hard_hit_pct,
        "sweet_spot_pct": sweet_pct,
        "swstr_pct":     0.0,
        "o_swing_pct":   0.0,
        "gb_pct":        gb_pct,
        "fb_pct":        fb_pct,
        "ld_pct":        ld_pct,
        "pull_pct":      pull_pct,
        "oppo_pct":      oppo_pct,
        "pull_brl_pct":  pull_brl,
    }

    if include_meta:
        name_col  = df.get("player_name", df.get("name", pd.Series(dtype=str))).dropna()
        stand_col = df.get("stand", pd.Series(dtype=str)).dropna()
        d["name"]   = str(name_col.iloc[-1]).strip() if len(name_col) else ""
        d["stands"] = str(stand_col.iloc[-1]).strip() if len(stand_col) else "R"

    return d


# ---------------------------------------------------------------------------
# 2 & 3. Batter stats via statcast_search/csv
# ---------------------------------------------------------------------------

_ZONE_CSV_BASE = "https://baseballsavant.mlb.com/statcast_search/csv"
_BATTER_BATCH_SIZE = 40


def _fetch_batter_statcast_batched(bids, pitcher_throws=None, label_prefix="batter statcast"):
    result = {}
    for i in range(0, len(bids), _BATTER_BATCH_SIZE):
        batch = bids[i:i + _BATTER_BATCH_SIZE]
        batch_num = i // _BATTER_BATCH_SIZE + 1
        label = f"{label_prefix} batch {batch_num}"
        params = {
            "all": "true", "hfGT": "R|", "hfSea": "2026|",
            "player_type": "batter", "group_by": "name", "type": "details",
            "min_pitches": "0", "min_results": "0",
            "sort_col": "pitches", "sort_order": "desc",
            "batters_lookup[]": [str(b) for b in batch],
        }
        if pitcher_throws:
            params["pitcherHand"] = pitcher_throws
        rows = get_csv(_ZONE_CSV_BASE, params, label=label)

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
# Zone fetches
# ---------------------------------------------------------------------------

def fetch_pitcher_zones(pitcher_id):
    params = {
        "all": "true", "hfGT": "R|", "hfSea": "2026|",
        "player_type": "pitcher", "pitchers_lookup[]": str(pitcher_id),
        "group_by": "zone", "type": "details",
        "min_pitches": "0", "min_results": "0",
        "sort_col": "pitches", "sort_order": "desc",
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


def fetch_all_pitcher_zones(pitcher_ids):
    """Real per-zone xwOBA for every pitcher, one player at a time (Savant's
    statcast_search API aggregates zone stats across whatever players are in
    the request, so it can't be safely batched per-player)."""
    ids = sorted(pitcher_ids)
    result = {}
    print(f"  Fetching zone data for {len(ids)} pitchers ...", file=sys.stderr)
    for i, pid in enumerate(ids, 1):
        result[pid] = fetch_pitcher_zones(pid)
        if i % 10 == 0:
            print(f"    ...{i}/{len(ids)} pitcher zones fetched", file=sys.stderr)
        time.sleep(0.5)
    return result


def fetch_batter_zones(batter_id):
    params = {
        "all": "true", "hfGT": "R|", "hfSea": "2026|",
        "player_type": "batter", "batters_lookup[]": str(batter_id),
        "group_by": "zone", "type": "details",
        "min_pitches": "0", "min_results": "0",
        "sort_col": "pitches", "sort_order": "desc",
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


def fetch_all_batter_zones(batter_ids):
    """Real per-zone xwOBA for every batter, one player at a time (same
    batching limitation as fetch_all_pitcher_zones above)."""
    ids = sorted(batter_ids)
    result = {}
    print(f"  Fetching zone data for {len(ids)} batters ...", file=sys.stderr)
    for i, bid in enumerate(ids, 1):
        result[bid] = fetch_batter_zones(bid)
        if i % 20 == 0:
            print(f"    ...{i}/{len(ids)} batter zones fetched", file=sys.stderr)
        time.sleep(0.5)
    return result


# ---------------------------------------------------------------------------
# Pitcher fallback -- no real Savant data available for this pitcher.
# Every Statcast-derived field is left None; nothing here is estimated from
# ERA/K9/HR9 proxies. Only genuinely known facts (id, name, throws) are set.
# ---------------------------------------------------------------------------

def pitcher_fallback_from_raw(pitcher_id, pitcher_name, raw_pitcher_stats):
    return {
        "mlb_id": pitcher_id, "name": pitcher_name, "throws": "R",
        "pa": 0,
        "xwoba": None, "xba": None, "xslg": None,
        "exit_velo": None, "la_avg": None,
        "barrel_pct": None, "hard_hit_pct": None,
        "sweet_spot_pct": None, "swstr_pct": None, "csw_pct": None,
        "o_swing_pct": None, "in_zone_pct": None, "f_strike_pct": None,
        "ball_pct": None, "fb_pct": None, "gb_pct": None, "ld_pct": None,
        "pull_pct": None, "oppo_pct": None, "pulled_barrel_pct": None,
        "k_pct": None, "bb_pct": None,
        "zones": [0.0] * 9, "arsenal": [],
    }


# ---------------------------------------------------------------------------
# Pitcher statcast_search fallback
# ---------------------------------------------------------------------------

def _extract_pitcher_id(row):
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
    if not rows:
        return {
            "pa": 0, "name": "", "throws": "R",
            "xwoba": None, "exit_velo": None, "la_avg": None,
            "barrel_pct": None, "hard_hit_pct": None, "sweet_spot_pct": None,
            "gb_pct": None, "fb_pct": None, "ld_pct": None,
            "pull_pct": None, "oppo_pct": None,
            "xba": None, "xslg": None, "swstr_pct": None, "csw_pct": None,
            "o_swing_pct": None, "in_zone_pct": None, "f_strike_pct": None,
            "ball_pct": None, "pulled_barrel_pct": None, "k_pct": None,
            "bb_pct": None, "zones": [], "arsenal": [],
        }

    df = pd.DataFrame(rows)

    woba_denom = pd.to_numeric(df.get("woba_denom", 0), errors="coerce").fillna(0)
    pa_mask = woba_denom == 1
    xw = pd.to_numeric(df.get("estimated_woba_using_speedangle"), errors="coerce")
    valid_xw = pa_mask & xw.notna() & (xw >= 0)
    pa    = int(valid_xw.sum())
    xwoba = round(float(xw[valid_xw].mean()), 3) if pa > 0 else None

    ls = pd.to_numeric(df.get("launch_speed"), errors="coerce")
    la = pd.to_numeric(df.get("launch_angle"), errors="coerce").fillna(0.0)
    df["launch_speed"]       = ls
    df["launch_angle"]       = la
    df["launch_speed_angle"] = df.get("launch_speed_angle", "").fillna("")
    df["bb_type"]            = df.get("bb_type", "").fillna("")
    df["hc_x"]               = pd.to_numeric(df.get("hc_x"), errors="coerce").fillna(0.0)
    df["stand"]              = df.get("stand", "R").fillna("R")

    bip_df    = _build_bip_flags(df[ls.notna() & (ls > 0)])
    bip_count = len(bip_df)

    exit_velo    = round(float(bip_df["launch_speed"].mean()), 3) if bip_count > 0 else None
    la_avg       = round(float(bip_df["launch_angle"].mean()),  3) if bip_count > 0 else None
    barrel_pct   = _pct(bip_df["barrel"].sum(),     bip_count, none_on_empty=True)
    hard_hit_pct = _pct(bip_df["hard_hit"].sum(),   bip_count, none_on_empty=True)
    sweet_pct    = _pct(bip_df["sweet_spot"].sum(),  bip_count, none_on_empty=True)
    gb_pct       = _pct(bip_df["gb"].sum(),          bip_count, none_on_empty=True)
    fb_pct       = _pct(bip_df["fb"].sum(),          bip_count, none_on_empty=True)
    ld_pct       = _pct(bip_df["ld"].sum(),          bip_count, none_on_empty=True)
    pull_pct     = _pct(bip_df["pull"].sum(),        bip_count, none_on_empty=True)
    oppo_pct     = _pct(bip_df["oppo"].sum(),        bip_count, none_on_empty=True)

    name_col = (
        df.get("player_name", pd.Series(dtype=str))
        .fillna(df.get("pitcher_name", pd.Series(dtype=str)).fillna(""))
    ).astype(str).str.strip()
    name = str(name_col[name_col != ""].iloc[-1]) if (name_col != "").any() else ""

    throws_col = (
        df.get("p_throws", pd.Series(dtype=str))
        .fillna(df.get("throws", pd.Series(dtype=str)).fillna(""))
    ).astype(str).str.strip()
    valid_throws = throws_col[throws_col.isin(["R", "L"])]
    throws = str(valid_throws.iloc[-1]) if len(valid_throws) else "R"

    return {
        "pa": pa, "name": name, "throws": throws,
        "xwoba": xwoba, "exit_velo": exit_velo, "la_avg": la_avg,
        "barrel_pct": barrel_pct, "hard_hit_pct": hard_hit_pct, "sweet_spot_pct": sweet_pct,
        "gb_pct": gb_pct, "fb_pct": fb_pct, "ld_pct": ld_pct,
        "pull_pct": pull_pct, "oppo_pct": oppo_pct,
        "xba": None, "xslg": None, "swstr_pct": None, "csw_pct": None,
        "o_swing_pct": None, "in_zone_pct": None, "f_strike_pct": None,
        "ball_pct": None, "pulled_barrel_pct": None, "k_pct": None,
        "bb_pct": None, "zones": [], "arsenal": [],
    }


def fetch_pitcher_statcast_search(pitcher_ids):
    if not pitcher_ids:
        return {}

    result = {}
    pids = list(pitcher_ids)
    batch_size = 20
    for i in range(0, len(pids), batch_size):
        batch = pids[i:i + batch_size]
        params = {
            "all": "true", "hfGT": "R|", "hfSea": "2026|",
            "player_type": "pitcher", "group_by": "name", "type": "details",
            "min_pitches": "0", "min_results": "0",
            "sort_col": "pitches", "sort_order": "desc",
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
    print("Loading raw_slate.json ...", file=sys.stderr)
    try:
        with open(RAW_SLATE_PATH, "r") as f:
            raw_slate = json.load(f)
    except FileNotFoundError:
        print(f"ERROR: {RAW_SLATE_PATH} not found", file=sys.stderr)
        sys.exit(1)

    status = raw_slate.get("status", "")
    if status != "ok":
        print(f"raw_slate.json status='{status}' -- no games today.", file=sys.stderr)
        out = {"pitchers": {}, "batters": {}}
        with open(OUTPUT_PATH, "w") as f:
            json.dump(out, f, indent=2)
        print(f"Wrote {OUTPUT_PATH}", file=sys.stderr)
        return

    games = raw_slate.get("games", [])
    raw_pitcher_stats = raw_slate.get("pitcher_stats", {})
    players_by_team = raw_slate.get("players_by_team", {})

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

    print(f"Slate: {len(games)} games | {len(pitcher_ids)} pitchers | {len(batter_ids)} batters", file=sys.stderr)

    print("\n--- Fetching pitcher leaderboard ---", file=sys.stderr)
    pitcher_savant = fetch_pitcher_leaderboard()

    time.sleep(15)
    print("\n--- Fetching batter leaderboards ---", file=sys.stderr)
    batter_overall, batter_rhp, batter_lhp = fetch_batter_leaderboards(batter_ids)
    print(f"  batter_overall={len(batter_overall)} rhp={len(batter_rhp)} lhp={len(batter_lhp)}", file=sys.stderr)

    time.sleep(5)
    print("\n--- Fetching pitch arsenal ---", file=sys.stderr)
    arsenal_by_pitcher = fetch_pitch_arsenal()

    print("\n--- Fetching pitcher zone data ---", file=sys.stderr)
    pitcher_zones = fetch_all_pitcher_zones(pitcher_ids)

    print("\n--- Fetching batter zone data ---", file=sys.stderr)
    batter_zones = fetch_all_batter_zones(batter_ids)

    missing_pitchers = {pid for pid in pitcher_ids if pid not in pitcher_savant}
    pitcher_statcast_fallback = {}
    if missing_pitchers:
        print(f"\n--- Fetching statcast_search fallback for {len(missing_pitchers)} missing pitchers ---", file=sys.stderr)
        time.sleep(5)
        pitcher_statcast_fallback = fetch_pitcher_statcast_search(missing_pitchers)
        print(f"  statcast_search fallback found {len(pitcher_statcast_fallback)} pitchers", file=sys.stderr)

    print("\n--- Building output ---", file=sys.stderr)
    out_pitchers = {}
    for pid, pname in pitcher_id_to_name.items():
        if pid in pitcher_savant:
            entry = dict(pitcher_savant[pid])
            if not entry.get("name"):
                entry["name"] = pname
        elif pid in pitcher_statcast_fallback:
            print(f"  [statcast_search fallback] pitcher {pid} ({pname}) using statcast_search data", file=sys.stderr)
            entry = dict(pitcher_statcast_fallback[pid])
            entry["mlb_id"] = pid
            if not entry.get("name"):
                entry["name"] = pname
        else:
            print(f"  [raw fallback] pitcher {pid} ({pname}) not in Savant -- using MLB Stats estimates", file=sys.stderr)
            entry = pitcher_fallback_from_raw(pid, pname, raw_pitcher_stats)

        entry["zones"]   = pitcher_zones.get(pid, [0.0] * 9)
        entry["arsenal"] = arsenal_by_pitcher.get(pid, [])
        out_pitchers[str(pid)] = entry

    out_batters = {}
    for bid, bname in batter_id_to_name.items():
        if bid not in batter_overall:
            print(f"  [skip] batter {bid} ({bname}) not in Savant data -- MLB Stats fallback applies", file=sys.stderr)
            continue
        base = dict(batter_overall[bid])
        if not base.get("name"):
            base["name"] = bname
        base["mlb_id"] = bid

        r = batter_rhp.get(bid, {})
        base["pa_vs_rhp"]           = r.get("pa", 0)
        base["xwoba_vs_rhp"]        = r.get("xwoba", 0.0)
        base["barrel_pct_vs_rhp"]   = r.get("barrel_pct", 0.0)
        base["hard_hit_pct_vs_rhp"] = r.get("hard_hit_pct", 0.0)

        lh = batter_lhp.get(bid, {})
        base["pa_vs_lhp"]           = lh.get("pa", 0)
        base["xwoba_vs_lhp"]        = lh.get("xwoba", 0.0)
        base["barrel_pct_vs_lhp"]   = lh.get("barrel_pct", 0.0)
        base["hard_hit_pct_vs_lhp"] = lh.get("hard_hit_pct", 0.0)

        base["zones"] = batter_zones.get(bid, [])
        out_batters[str(bid)] = base

    out = {"pitchers": out_pitchers, "batters": out_batters}
    with open(OUTPUT_PATH, "w") as f:
        json.dump(out, f, indent=2)
    print(f"\nWrote {OUTPUT_PATH}", file=sys.stderr)
    print(f"  pitchers={len(out_pitchers)} batters={len(out_batters)}", file=sys.stderr)


if __name__ == "__main__":
    main()
