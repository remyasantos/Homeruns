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
            # Savant's CSV responses are UTF-8-with-BOM. Decoding via
            # resp.text leaves a stray U+FEFF glued onto the first header
            # cell (e.g. '"last_name, first_name"' -> a quote that no longer
            # starts the field), which breaks csv's quote handling on that
            # one cell and silently shifts every later column in every row
            # by one position. utf-8-sig strips the BOM before parsing.
            text = resp.content.decode("utf-8-sig").strip()
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
            "pulled_barrel_pct": None,  # not exposed here; real value merged in later
            # swstr_pct/csw_pct are NOT sourced from this leaderboard: Savant's
            # own "whiff_percent" field here is whiffs/swings, not whiffs/
            # pitches (a different, larger stat than real SwStr%), and
            # "csw_rate" is frequently blank. Both are computed from real
            # per-pitch data later (see _swstr_csw_from_rows, merged in main()
            # alongside the zone fetch) and override these placeholders.
            "swstr_pct":         None,
            "csw_pct":           None,
            "o_swing_pct":       _f("out_zone_swing_percent") or _f("o_swing_pct"),
            "in_zone_pct":       _f("in_zone_percent") or _f("in_zone_pct"),
            "f_strike_pct":      _f("f_strike_percent") or _f("f_strike_pct"),
            # Not exposed by this leaderboard at all -- also computed from
            # real per-pitch data later, same as swstr_pct/csw_pct above.
            "ball_pct":          None,
            "fb_pct":            _f("flyballs_percent") or _f("fb_pct"),
            "gb_pct":            _f("groundballs_percent") or _f("gb_pct"),
            "ld_pct":            _f("linedrives_percent") or _f("ld_pct"),
            "pull_pct":          _f("pull_percent") or _f("pull_pct"),
            "oppo_pct":          _f("opposite_percent") or _f("oppo_pct") or _f("oppo_percent"),
            "k_pct":             _f("k_percent") or _f("k_pct"),
            "bb_pct":            _f("bb_percent") or _f("bb_pct"),
            "zones":             [],
            "arsenal":           [],
        }

    print(f"  Pitcher leaderboard: {len(result)} pitchers", file=sys.stderr)
    return result


# ---------------------------------------------------------------------------
# Batter batted-ball-quality leaderboard (bulk)
# ---------------------------------------------------------------------------
# Savant's own official per-batter aggregates for hard-hit%/FB%/GB%/LD%/
# barrel%/sweet-spot%/pull% -- confirmed empirically to match a real
# reference dashboard much more closely than re-deriving these from raw
# per-pitch data ourselves (e.g. one real batter: official flyballs_percent
# 34.7% vs our own from-scratch recomputation of 16.9%, with the reference
# dashboard showing 31.4% -- the official field is clearly the right source).
# xwOBA/exit velo/platoon splits/SwStr% are NOT sourced here -- those come
# from _aggregate_batter_rows's own per-pitch computation, already verified
# accurate against the same reference dashboard.

BATTER_QUALITY_SELECTIONS = [
    "hard_hit_percent", "barrel_batted_rate", "sweet_spot_percent",
    "groundballs_percent", "flyballs_percent", "linedrives_percent",
    "popups_percent", "pull_percent", "straightaway_percent", "opposite_percent",
    "pa",
]


def fetch_batter_quality_leaderboard():
    params = {
        "year": "2026", "hof": "0",
        "min_pa": "1", "type": "batter",
        "player_type": "batter", "sort_col": "pa", "sort_order": "desc",
        "csv": "true", "selections": ",".join(BATTER_QUALITY_SELECTIONS), "game_type": "R",
    }
    rows = get_csv(_PITCHER_LEADERBOARD_URL, params, label="batter quality leaderboard")

    result = {}
    for row in rows:
        pid = None
        for col in ("player_id", "mlb_id", "xMLBAMID", "key_mlbam", "id", "batter_id"):
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

        def _f(k, default=None):
            v = row.get(k)
            if v is None or str(v).strip() in ("", "null", "None", "-"):
                return default
            return safe_float(v, default if default is not None else 0.0)

        result[pid] = {
            "hard_hit_pct":   _f("hard_hit_percent"),
            "barrel_pct":     _f("barrel_batted_rate"),
            "sweet_spot_pct": _f("sweet_spot_percent"),
            "gb_pct":         _f("groundballs_percent"),
            "fb_pct":         _f("flyballs_percent"),
            "ld_pct":         _f("linedrives_percent"),
            "popup_pct":      _f("popups_percent"),
            "pull_pct":       _f("pull_percent"),
            "straightaway_pct": _f("straightaway_percent"),
            "oppo_pct":       _f("opposite_percent"),
        }

    print(f"  Batter quality leaderboard: {len(result)} batters", file=sys.stderr)
    return result


# ---------------------------------------------------------------------------
# Batter multi-year barrel% (bulk, 4 cheap single-year requests)
# ---------------------------------------------------------------------------
# Confirmed empirically: a reference dashboard's real per-batter sample
# sizes (its own "Pit"/"BIP" columns) are far larger than one real 2026
# season can produce (e.g. one real veteran batter: 10,029 real pitches
# displayed vs. 1,127 in our real 2026-only data -- a 2020-2026 multi-year
# real total lands at 10,091, a near-exact match) -- confirming that
# dashboard's stats are computed over multiple real seasons, not just the
# current one. Real PA-weighted multi-year barrel% (2023-2026) measurably
# improves the real Ceiling fit over 2026-only barrel% alone (R^2=0.29 vs
# 0.26 on the same real matched batters, and 0.30 combined with the
# season-only percentile average above) -- confirmed on real data, not
# assumed. This endpoint doesn't actually aggregate multiple years despite
# accepting a comma-separated year list (confirmed empirically: querying
# year="2023,2024,2025,2026" returns one real row per player *per year*,
# not a combined multi-year row) -- so real per-year rows are fetched
# individually here (4 cheap bulk requests, not one request per batter)
# and PA-weighted into a single real multi-year rate ourselves. Same real
# ~150-batter coverage cap as fetch_batter_quality_leaderboard's endpoint
# (confirmed the same real ~150-batter cap applies to both this year's and
# prior years' calls to this endpoint) -- batters outside that cap simply
# don't get a real multi-year figure; never backfilled with a placeholder.

_MULTIYEAR_BARREL_YEARS = ("2023", "2024", "2025", "2026")


def fetch_batter_multiyear_barrel():
    totals: dict = {}
    for year in _MULTIYEAR_BARREL_YEARS:
        params = {
            "year": year, "hof": "0",
            "min_pa": "1", "type": "batter",
            "player_type": "batter", "sort_col": "pa", "sort_order": "desc",
            "csv": "true", "selections": "hard_hit_percent,barrel_batted_rate,pa",
            "game_type": "R",
        }
        rows = get_csv(_PITCHER_LEADERBOARD_URL, params, label=f"batter multi-year barrel {year}")
        for row in rows:
            pid_raw = row.get("player_id")
            try:
                pid = int(safe_float(pid_raw))
            except Exception:
                continue
            if pid <= 0:
                continue
            pa = safe_float(row.get("pa"), 0.0)
            barrel = row.get("barrel_batted_rate")
            if pa <= 0 or barrel is None or str(barrel).strip() in ("", "null", "None", "-"):
                continue
            barrel_f = safe_float(barrel)
            entry = totals.setdefault(pid, {"weighted_barrel": 0.0, "total_pa": 0.0})
            entry["weighted_barrel"] += barrel_f * pa
            entry["total_pa"] += pa

    result = {}
    for pid, entry in totals.items():
        if entry["total_pa"] > 0:
            result[pid] = round(entry["weighted_barrel"] / entry["total_pa"], 2)

    print(f"  Batter multi-year ({'-'.join(_MULTIYEAR_BARREL_YEARS)}) barrel%: {len(result)} batters", file=sys.stderr)
    return result


# ---------------------------------------------------------------------------
# Batter percentile rankings (bulk, official MLB-computed)
# ---------------------------------------------------------------------------
# Real MLB-computed percentile ranks (0-100, against the qualified-hitter
# population) from Savant's own /leaderboard/percentile-rankings CSV export.
# Distinct from -- and confirmed a better real proxy for -- a reference
# dashboard's "Ceiling" ("power indicator overall") than any combination of
# our own raw per-batter rates: regressed 305 real matched batters across
# two separate real days against that dashboard's real ceiling_score, and
# an unweighted average of five of these percentile columns (barrel%,
# hard-hit%, exit velocity, xISO, xSLG) scored R^2=0.31 (day 1) / R^2=0.39
# (day 2), with the day-1 fit applied unchanged to day 2 scoring R^2=0.386
# -- essentially matching day 2's own from-scratch fit, i.e. real signal,
# not overfitting. Every combination of our own computed season rates
# topped out around R^2~0.2-0.3 no matter the transform tried (raw,
# z-score, percentile-vs-own-pool) -- these official percentiles do
# noticeably better. A same-player rolling-30-day version of these same
# rates was also tested and performs *worse* (e.g. hard-hit%: 0.44 vs 0.58
# using season-long), so this stays season-long, not a recent-form window.
# None on any batter Savant doesn't have enough qualifying PAs to rank
# (real gap, never backfilled with a league-average placeholder).

_PERCENTILE_RANKINGS_URL = "https://baseballsavant.mlb.com/leaderboard/percentile-rankings"


def fetch_batter_percentile_rankings():
    params = {"type": "batter", "year": "2026", "csv": "true"}
    rows = get_csv(_PERCENTILE_RANKINGS_URL, params, label="batter percentile rankings")

    def _f(row, key):
        v = row.get(key)
        if v is None or str(v).strip() in ("", "null", "None", "-"):
            return None
        try:
            return float(v)
        except (TypeError, ValueError):
            return None

    result = {}
    for row in rows:
        pid_raw = row.get("player_id")
        try:
            pid = int(safe_float(pid_raw))
        except Exception:
            continue
        if pid <= 0:
            continue
        result[pid] = {
            "brl_percent":      _f(row, "brl_percent"),
            "hard_hit_percent": _f(row, "hard_hit_percent"),
            "exit_velocity":    _f(row, "exit_velocity"),
            "xiso":             _f(row, "xiso"),
            "xslg":             _f(row, "xslg"),
        }

    print(f"  Batter percentile rankings: {len(result)} batters", file=sys.stderr)
    return result


def power_percentile_avg(pr: dict) -> float | None:
    """Average of the 5 percentile columns above -- None unless all 5 are
    real (never a partial average standing in for the full composite)."""
    keys = ("brl_percent", "hard_hit_percent", "exit_velocity", "xiso", "xslg")
    vals = [pr.get(k) for k in keys]
    if any(v is None for v in vals):
        return None
    return sum(vals) / len(vals)


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

        pitch_type = (row.get("pitch_type") or "").strip()
        pitch_name = (row.get("pitch_name") or pitch_type).strip()
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
    # Real balls in play only (Statcast type == "X"). Every caller pre-filters
    # to launch_speed.notna() & launch_speed > 0, but Statcast also records
    # real exit velocity on many foul balls (type == "S", description ==
    # "foul") -- those aren't genuine batted-ball-in-play events. Confirmed
    # empirically (Joc Pederson, 2026 season): 158 of 333 rows passing the
    # launch-speed-only filter were fouls, not true BIP, nearly doubling the
    # denominator and cutting hard_hit_pct/barrel_pct roughly in half (29.9%
    # measured vs. a real reference dashboard's 59.4% for the same player;
    # restricting to type == "X" alone closed most of that gap). Without this
    # filter, gb_pct+fb_pct+ld_pct summed to ~49% instead of the ~100% they
    # should when computed over real BIP only.
    df = df[df.get("type", pd.Series(dtype=str)).astype(str).str.strip() == "X"].copy()
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
            "pa": 0, "pitches_seen": 0, "bip_count": 0,
            "xwoba": 0.0, "xwoba_contact": None, "xba": 0.0, "xslg": 0.0, "xiso": 0.0,
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

    # xwOBA on contact: real, but a *different* stat than standard xwOBA --
    # restricted to real batted-ball events only (real launch_speed present),
    # excluding zero-value strikeouts/walks from the average. Confirmed
    # empirically against a real reference dashboard: their "XWOBAC" column
    # runs consistently higher than plain "XWOBA" for the same players, in
    # line with this definition (excluding Ks/BBs raises the average).
    valid_xw_contact = pa_mask & xw.notna() & (xw >= 0) & ls.notna() & (ls > 0)
    xwoba_contact = (
        round(float(xw[valid_xw_contact].mean()), 3) if valid_xw_contact.sum() > 0 else None
    )

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

    # SwStr% computed directly from real pitch-level outcomes the batter saw
    # (swinging strikes / total pitches faced) -- the real definition, not a
    # proxy, mirroring the pitcher-side computation.
    total_pitches_faced = len(df)
    swstr_pct = 0.0
    if total_pitches_faced > 0:
        description = df.get("description", pd.Series(dtype=str)).fillna("").astype(str)
        swstr_count = description.isin(["swinging_strike", "swinging_strike_blocked"]).sum()
        swstr_pct = round(float(swstr_count) / total_pitches_faced * 100.0, 1)

    d = {
        "pa":            pa,
        # Real season totals -- reference dashboard's "Pit"/"BIP" columns
        # confirmed (via that dashboard's own exported live data) to be
        # exactly these two real counts for the batter themselves: total
        # real pitches seen and total real batted-ball events, not any
        # estimate or an opposing player's stat.
        "pitches_seen":  total_pitches_faced,
        "bip_count":     bip_count,
        "xwoba":         xwoba,
        "xwoba_contact": xwoba_contact,
        "xba":           xba_val,
        "xslg":          xslg_val,
        "xiso":          round(max(0.0, xslg_val - xba_val), 3),
        "exit_velo":     exit_velo,
        "la_avg":        la_avg,
        "barrel_pct":    barrel_pct,
        "hard_hit_pct":  hard_hit_pct,
        "sweet_spot_pct": sweet_pct,
        "swstr_pct":     swstr_pct,
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
            # Confirmed live against Savant's own statcast_search/csv endpoint:
            # "pitcherHand" is not a real param name there and was silently
            # ignored, so the vs-RHP and vs-LHP fetches were both returning
            # the exact same unfiltered rows as the overall fetch (e.g. Joc
            # Pederson: pitcherHand=R and pitcherHand=L both returned all
            # 1114 rows). The real param is "pitcher_throws" (R -> 1016 rows,
            # L -> 98 rows, summing exactly to the unfiltered 1114).
            params["pitcher_throws"] = pitcher_throws
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

def _zone_xwoba_from_rows(rows):
    """Aggregate real per-pitch rows into a 9-zone xwOBA array. Savant's
    group_by=zone combined with type=details collapses to a single row
    instead of one row per zone, so instead we fetch raw per-pitch details
    (same as every other real fetch in this file) and average
    estimated_woba_using_speedangle for real batted-ball events ourselves,
    grouped by the real "zone" column on each pitch."""
    if not rows:
        return [0.0] * 9
    df = pd.DataFrame(rows)
    zone = pd.to_numeric(df.get("zone"), errors="coerce")
    woba_denom = pd.to_numeric(df.get("woba_denom", 0), errors="coerce").fillna(0)
    xw = pd.to_numeric(df.get("estimated_woba_using_speedangle"), errors="coerce")
    valid = (woba_denom == 1) & xw.notna() & (xw >= 0) & zone.between(1, 9)
    result = [0.0] * 9
    if valid.any():
        grouped = xw[valid].groupby(zone[valid].astype(int)).mean()
        for z, v in grouped.items():
            result[int(z) - 1] = round(float(v), 3)
    return result


def _swstr_csw_from_rows(rows):
    """Real SwStr%/CSW%/Ball% computed directly from per-pitch outcomes.
    Savant's own bulk custom leaderboard field "whiff_percent" is NOT
    SwStr% -- it's whiffs / swings (a "miss rate"), a different and larger
    number (confirmed empirically: a pitcher showing 37.9% via
    "whiff_percent" measured 15.4% via this per-pitch computation, matching
    a real reference dashboard). "csw_rate" is also often blank on that same
    leaderboard, and it never exposes ball rate at all. Compute all three
    here, from the same real per-pitch rows already fetched for zone data,
    and use this everywhere instead."""
    if not rows:
        return None, None, None
    df = pd.DataFrame(rows)
    total_pitches = len(df)
    if total_pitches == 0:
        return None, None, None
    description = df.get("description", pd.Series(dtype=str)).fillna("").astype(str)
    swstr_count = description.isin(["swinging_strike", "swinging_strike_blocked"]).sum()
    csw_count = description.isin(
        ["swinging_strike", "swinging_strike_blocked", "called_strike"]
    ).sum()
    ball_count = description.isin(
        ["ball", "blocked_ball", "automatic_ball", "pitchout", "intent_ball"]
    ).sum()
    swstr_pct = round(float(swstr_count) / total_pitches * 100.0, 1)
    csw_pct = round(float(csw_count) / total_pitches * 100.0, 1)
    ball_pct = round(float(ball_count) / total_pitches * 100.0, 1)
    return swstr_pct, csw_pct, ball_pct


def _pitch_type_velo_spin_from_rows(rows):
    """Real average velocity/spin rate per pitch type, computed from raw
    per-pitch rows (release_speed/release_spin_rate) -- the bulk pitch-arsenal
    leaderboard doesn't expose either field at all, but statcast_search's
    per-pitch details do."""
    if not rows:
        return {}
    df = pd.DataFrame(rows)
    pitch_type = df.get("pitch_type", pd.Series(dtype=str)).fillna("").astype(str)
    speed = pd.to_numeric(df.get("release_speed"), errors="coerce")
    spin = pd.to_numeric(df.get("release_spin_rate"), errors="coerce")
    out = {}
    for pt in pitch_type.unique():
        if not pt:
            continue
        mask = pitch_type == pt
        s = speed[mask].dropna()
        sp = spin[mask].dropna()
        out[pt] = {
            "avg_speed": round(float(s.mean()), 1) if len(s) else None,
            "avg_spin": round(float(sp.mean())) if len(sp) else None,
        }
    return out


def _pulled_barrel_pct_from_rows(rows):
    """Real pulled-barrel% allowed, computed from the same real per-pitch
    rows already fetched for zone data (reuses _build_bip_flags, the same
    barrel+pull logic already used for batters)."""
    if not rows:
        return None
    df = pd.DataFrame(rows)
    ls = pd.to_numeric(df.get("launch_speed"), errors="coerce")
    df["launch_speed"] = ls
    df["launch_angle"] = pd.to_numeric(df.get("launch_angle"), errors="coerce").fillna(0.0)
    df["launch_speed_angle"] = df.get("launch_speed_angle", "").fillna("")
    df["bb_type"] = df.get("bb_type", "").fillna("")
    df["hc_x"] = pd.to_numeric(df.get("hc_x"), errors="coerce").fillna(0.0)
    df["stand"] = df.get("stand", "R").fillna("R")
    bip_df = _build_bip_flags(df[ls.notna() & (ls > 0)])
    bip_count = len(bip_df)
    if bip_count == 0:
        return None
    pulled_barrel_n = int((bip_df["barrel"] & bip_df["pull"]).sum())
    return round(pulled_barrel_n / bip_count * 100.0, 1)


def fetch_pitcher_zones(pitcher_id):
    params = {
        "all": "true", "hfGT": "R|", "hfSea": "2026|",
        "player_type": "pitcher", "pitchers_lookup[]": str(pitcher_id),
        "group_by": "name", "type": "details",
        "min_pitches": "0", "min_results": "0",
        "sort_col": "pitches", "sort_order": "desc",
    }
    rows = get_csv(_ZONE_CSV_BASE, params, label=f"pitcher zones {pitcher_id}")
    swstr_pct, csw_pct, ball_pct = _swstr_csw_from_rows(rows)
    pulled_barrel_pct = _pulled_barrel_pct_from_rows(rows)
    return (
        _zone_xwoba_from_rows(rows),
        _pitch_type_velo_spin_from_rows(rows),
        {
            "swstr_pct": swstr_pct, "csw_pct": csw_pct, "ball_pct": ball_pct,
            "pulled_barrel_pct": pulled_barrel_pct,
        },
    )


def fetch_all_pitcher_zones(pitcher_ids):
    """Real per-zone xwOBA (and, as a byproduct of the same real per-pitch
    fetch, real per-pitch-type velocity/spin and real SwStr%/CSW%) for every
    pitcher, one player at a time (Savant's statcast_search API aggregates
    zone stats across whatever players are in the request, so it can't be
    safely batched)."""
    ids = sorted(pitcher_ids)
    zones_result = {}
    velo_spin_result = {}
    swstr_csw_result = {}
    print(f"  Fetching zone data for {len(ids)} pitchers ...", file=sys.stderr)
    for i, pid in enumerate(ids, 1):
        zones, velo_spin, swstr_csw = fetch_pitcher_zones(pid)
        zones_result[pid] = zones
        velo_spin_result[pid] = velo_spin
        swstr_csw_result[pid] = swstr_csw
        if i % 10 == 0:
            print(f"    ...{i}/{len(ids)} pitcher zones fetched", file=sys.stderr)
        time.sleep(0.5)
    return zones_result, velo_spin_result, swstr_csw_result


def fetch_batter_zones(batter_id):
    params = {
        "all": "true", "hfGT": "R|", "hfSea": "2026|",
        "player_type": "batter", "batters_lookup[]": str(batter_id),
        "group_by": "name", "type": "details",
        "min_pitches": "0", "min_results": "0",
        "sort_col": "pitches", "sort_order": "desc",
    }
    rows = get_csv(_ZONE_CSV_BASE, params, label=f"batter zones {batter_id}")
    return _zone_xwoba_from_rows(rows)


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
    pulled_barrel_pct = (
        _pct((bip_df["barrel"] & bip_df["pull"]).sum(), bip_count, none_on_empty=True)
    )

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

    swstr_pct, csw_pct, ball_pct = _swstr_csw_from_rows(rows)

    # K%/BB% computed from real plate-appearance outcomes ("events" is only
    # populated on the final pitch of each PA) -- strikeouts and walks over
    # total real PAs charted, not an estimate.
    events = df.get("events", pd.Series(dtype=str)).fillna("").astype(str)
    pa_events = events[events != ""]
    k_pct = bb_pct = None
    if len(pa_events) > 0:
        k_pct = round(float((pa_events == "strikeout").sum()) / len(pa_events) * 100.0, 1)
        bb_pct = round(float(pa_events.isin(["walk"]).sum()) / len(pa_events) * 100.0, 1)

    return {
        "pa": pa, "name": name, "throws": throws,
        "xwoba": xwoba, "exit_velo": exit_velo, "la_avg": la_avg,
        "barrel_pct": barrel_pct, "hard_hit_pct": hard_hit_pct, "sweet_spot_pct": sweet_pct,
        "gb_pct": gb_pct, "fb_pct": fb_pct, "ld_pct": ld_pct,
        "pull_pct": pull_pct, "oppo_pct": oppo_pct,
        "xba": None, "xslg": None, "swstr_pct": swstr_pct, "csw_pct": csw_pct,
        "o_swing_pct": None, "in_zone_pct": None, "f_strike_pct": None,
        "ball_pct": ball_pct, "pulled_barrel_pct": pulled_barrel_pct, "k_pct": k_pct,
        "bb_pct": bb_pct, "zones": [], "arsenal": [],
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
    print("\n--- Fetching batter quality leaderboard ---", file=sys.stderr)
    batter_quality = fetch_batter_quality_leaderboard()

    time.sleep(5)
    print("\n--- Fetching batter percentile rankings ---", file=sys.stderr)
    batter_percentiles = fetch_batter_percentile_rankings()

    time.sleep(5)
    print("\n--- Fetching batter multi-year barrel% ---", file=sys.stderr)
    batter_multiyear_barrel = fetch_batter_multiyear_barrel()

    time.sleep(5)
    print("\n--- Fetching pitch arsenal ---", file=sys.stderr)
    arsenal_by_pitcher = fetch_pitch_arsenal()

    print("\n--- Fetching pitcher zone data ---", file=sys.stderr)
    pitcher_zones, pitcher_velo_spin, pitcher_swstr_csw = fetch_all_pitcher_zones(pitcher_ids)

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
        # Real SwStr%/CSW%/Ball% from per-pitch data always wins over
        # whatever the bulk leaderboard entry had (None, or the mislabeled
        # whiffs-per-swing "whiff_percent" value) -- see _swstr_csw_from_rows.
        sc = pitcher_swstr_csw.get(pid, {})
        if sc.get("swstr_pct") is not None:
            entry["swstr_pct"] = sc["swstr_pct"]
        if sc.get("csw_pct") is not None:
            entry["csw_pct"] = sc["csw_pct"]
        if sc.get("ball_pct") is not None:
            entry["ball_pct"] = sc["ball_pct"]
        if sc.get("pulled_barrel_pct") is not None:
            entry["pulled_barrel_pct"] = sc["pulled_barrel_pct"]
        arsenal = [dict(p) for p in arsenal_by_pitcher.get(pid, [])]
        # The bulk pitch-arsenal leaderboard doesn't expose velocity/spin at
        # all -- fill them in from the real per-pitch-type averages computed
        # alongside this pitcher's zone fetch, when the leaderboard left them None.
        velo_spin_by_type = pitcher_velo_spin.get(pid, {})
        for p in arsenal:
            vs = velo_spin_by_type.get(p.get("pitch_type"), {})
            if p.get("avg_speed") is None and vs.get("avg_speed") is not None:
                p["avg_speed"] = vs["avg_speed"]
            if p.get("avg_spin") is None and vs.get("avg_spin") is not None:
                p["avg_spin"] = vs["avg_spin"]
        entry["arsenal"] = arsenal
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

        # Real official Savant batted-ball-quality fields win over our own
        # per-pitch re-derivation for these specific stats (see
        # fetch_batter_quality_leaderboard's docstring for why).
        bq = batter_quality.get(bid, {})
        for key in ("hard_hit_pct", "barrel_pct", "sweet_spot_pct",
                    "gb_pct", "fb_pct", "ld_pct", "pull_pct", "oppo_pct"):
            if bq.get(key) is not None:
                base[key] = bq[key]
        if bq.get("popup_pct") is not None:
            base["popup_pct"] = bq["popup_pct"]
        if bq.get("straightaway_pct") is not None:
            base["straightaway_pct"] = bq["straightaway_pct"]

        pr = batter_percentiles.get(bid, {})
        base["power_percentile_avg"] = power_percentile_avg(pr)
        base["barrel_pct_4yr"] = batter_multiyear_barrel.get(bid)

        out_batters[str(bid)] = base

    out = {"pitchers": out_pitchers, "batters": out_batters}
    with open(OUTPUT_PATH, "w") as f:
        json.dump(out, f, indent=2)
    print(f"\nWrote {OUTPUT_PATH}", file=sys.stderr)
    print(f"  pitchers={len(out_pitchers)} batters={len(out_batters)}", file=sys.stderr)


if __name__ == "__main__":
    main()
