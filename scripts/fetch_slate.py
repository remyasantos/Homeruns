#!/usr/bin/env python3
"""
fetch_slate.py — pulls live schedule, pitcher stats, batter stats, and weather.
Reads:  MLB Stats API (statsapi.mlb.com) + wttr.in
Writes: scripts/raw_slate.json  (ONLY — never touches public/data.js)

IMPORTANT: This script must NEVER write to public/data.js.
           That file is owned by generate_data_js.py only.
"""

import statsapi
import requests
import json
import datetime
import sys

# ── Static team name → abbreviation map ─────────────────────────────────────────────────────────────────────────────────────
# Keys match the full team names returned by statsapi.schedule()
TEAM_NAME_TO_ABBR = {
    "Arizona Diamondbacks":      "ARI",
    "Atlanta Braves":            "ATL",
    "Baltimore Orioles":         "BAL",
    "Boston Red Sox":            "BOS",
    "Chicago Cubs":              "CHC",
    "Chicago White Sox":         "CWS",
    "Cincinnati Reds":           "CIN",
    "Cleveland Guardians":       "CLE",
    "Colorado Rockies":          "COL",
    "Detroit Tigers":            "DET",
    "Houston Astros":            "HOU",
    "Kansas City Royals":        "KC",
    "Los Angeles Angels":        "LAA",
    "Los Angeles Dodgers":       "LAD",
    "Miami Marlins":             "MIA",
    "Milwaukee Brewers":         "MIL",
    "Minnesota Twins":           "MIN",
    "New York Mets":             "NYM",
    "New York Yankees":          "NYY",
    "Oakland Athletics":         "OAK",
    "Athletics":                 "ATH",
    "Philadelphia Phillies":     "PHI",
    "Pittsburgh Pirates":        "PIT",
    "San Diego Padres":          "SD",
    "San Francisco Giants":      "SF",
    "Seattle Mariners":          "SEA",
    "St. Louis Cardinals":       "STL",
    "Tampa Bay Rays":            "TB",
    "Texas Rangers":             "TEX",
    "Toronto Blue Jays":         "TOR",
    "Washington Nationals":      "WSH",
}

def team_abbr(name: str) -> str:
    """Return the correct MLB abbreviation for a team name."""
    if not name:
        return "UNK"
    if name in TEAM_NAME_TO_ABBR:
        return TEAM_NAME_TO_ABBR[name]
    for full_name, abbr in TEAM_NAME_TO_ABBR.items():
        if full_name in name or name in full_name:
            return abbr
    safe = "".join(c for c in name.upper() if c.isalpha())[:3]
    print(f"  ⚠ Unknown team name '{name}' — using '{safe}'")
    return safe or "UNK"

# ── Static config ──────────────────────────────────────────────────────────────────────────────────────────
# These sets are only a structural fallback (used if the live venue lookup below
# fails) -- they say a park CAN close its roof, never whether it's closed today.
RETRACTABLE_ROOF_PARKS = {
    "Chase Field",
    "American Family Field",
    "Globe Life Field",
    "loanDepot park",
    "T-Mobile Park",
    "Daikin Park",
    "Rogers Centre",
}

HARD_DOME_PARKS = {
    "Tropicana Field",
}

PARK_HR_RANKS = {
    "Coors Field":                  1,
    "Great American Ball Park":     2,
    "Citizens Bank Park":           3,
    "Yankee Stadium":               4,
    "Daikin Park":                  5,
    "Globe Life Field":             6,
    "American Family Field":        7,
    "Chase Field":                  8,
    "Fenway Park":                  9,
    "Truist Park":                  10,
    "Wrigley Field":                11,
    "loanDepot park":               12,
    "Busch Stadium":                13,
    "PNC Park":                     14,
    "Camden Yards":                 15,
    "Oriole Park at Camden Yards":  15,
    "Progressive Field":            16,
    "Nationals Park":               17,
    "Angel Stadium":                18,
    "Rogers Centre":                19,
    "Kauffman Stadium":             20,
    "Target Field":                 21,
    "Minute Maid Park":             22,
    "Dodger Stadium":               23,
    "Oracle Park":                  24,
    "Comerica Park":                25,
    "T-Mobile Park":                26,
    "Guaranteed Rate Field":        27,
    "Petco Park":                   28,
    "Oakland Coliseum":             29,
    "Sacramento Sutter Health Park": 29,
    "Tropicana Field":              30,
}

CITY_WEATHER_MAP = {
    "Citizens Bank Park":           "Philadelphia PA",
    "Nationals Park":               "Washington DC",
    "Yankee Stadium":               "Bronx NY",
    "Wrigley Field":                "Chicago IL",
    "Target Field":                 "Minneapolis MN",
    "Tropicana Field":              "St. Petersburg FL",
    "Kauffman Stadium":             "Kansas City MO",
    "Comerica Park":                "Detroit MI",
    "Coors Field":                  "Denver CO",
    "loanDepot park":               "Miami FL",
    "Angel Stadium":                "Anaheim CA",
    "Petco Park":                   "San Diego CA",
    "Chase Field":                  "Phoenix AZ",
    "T-Mobile Park":                "Seattle WA",
    "Truist Park":                  "Atlanta GA",
    "Great American Ball Park":     "Cincinnati OH",
    "Dodger Stadium":               "Los Angeles CA",
    "American Family Field":        "Milwaukee WI",
    "Fenway Park":                  "Boston MA",
    "Daikin Park":                  "Houston TX",
    "Minute Maid Park":             "Houston TX",
    "Globe Life Field":             "Arlington TX",
    "Rogers Centre":                "Toronto ON",
    "Camden Yards":                 "Baltimore MD",
    "Oriole Park at Camden Yards":  "Baltimore MD",
    "Progressive Field":            "Cleveland OH",
    "PNC Park":                     "Pittsburgh PA",
    "Busch Stadium":                "St. Louis MO",
    "Oracle Park":                  "San Francisco CA",
    "Oakland Coliseum":             "Oakland CA",
    "Sacramento Sutter Health Park": "Sacramento CA",
    "Guaranteed Rate Field":        "Chicago IL",
}

def today_str():
    return datetime.date.today().strftime("%Y-%m-%d")

def format_date_label(date_str):
    d = datetime.datetime.strptime(date_str, "%Y-%m-%d")
    return d.strftime("%B %-d, %Y").upper()

def format_day_label(date_str):
    d = datetime.datetime.strptime(date_str, "%Y-%m-%d")
    return d.strftime("%A").upper() + " MLB SLATE"

_ROOF_TYPE_CACHE: dict = {}

def get_roof_type(venue_name, venue_id):
    """Structural fact: does this venue have a roof, and what kind?
    Tries the real MLB venue API first; the static sets above are only a
    fallback for when that lookup fails (network error, unknown venue id)."""
    if venue_id is not None:
        if venue_id in _ROOF_TYPE_CACHE:
            return _ROOF_TYPE_CACHE[venue_id]
        try:
            r = requests.get(
                f"https://statsapi.mlb.com/api/v1/venues/{venue_id}?hydrate=fieldInfo",
                timeout=10,
            )
            if r.status_code == 200:
                venues = r.json().get("venues", [])
                if venues:
                    roof_type = venues[0].get("fieldInfo", {}).get("roofType")
                    if roof_type:
                        _ROOF_TYPE_CACHE[venue_id] = roof_type
                        return roof_type
        except Exception as e:
            print(f"  ⚠ venue roofType lookup error for {venue_name}: {e}")

    if venue_name in HARD_DOME_PARKS:
        return "Dome"
    if venue_name in RETRACTABLE_ROOF_PARKS:
        return "Retractable"
    return "Open"


def get_live_feed_weather(game_pk):
    """Real per-game weather/roof condition from the MLB live game feed.
    Returns None if the feed hasn't posted weather yet (checked too early
    pre-game) -- callers must treat that as unknown, not a default."""
    if not game_pk:
        return None
    try:
        r = requests.get(
            f"https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live", timeout=10
        )
        if r.status_code != 200:
            return None
        w = r.json().get("gameData", {}).get("weather", {}) or {}
        condition = (w.get("condition") or "").strip()
        if not condition:
            return None

        temp_f = None
        try:
            temp_f = int(float(w.get("temp")))
        except (TypeError, ValueError):
            pass

        wind_mph, wind_dir = None, None
        wind_raw = (w.get("wind") or "").strip()
        if wind_raw:
            head, _, tail = wind_raw.partition(",")
            try:
                wind_mph = int(float(head.strip().split(" ")[0]))
            except (ValueError, IndexError):
                pass
            tail = tail.strip()
            if tail and tail.lower() != "none":
                wind_dir = tail

        return {
            "temp_f":    temp_f,
            "wind_mph":  wind_mph,
            "wind_dir":  wind_dir,
            "condition": condition,
        }
    except Exception as e:
        print(f"  ⚠ live feed weather error for game {game_pk}: {e}")
        return None


def _int_or_none(v):
    try:
        return int(v) if v not in (None, "") else None
    except (TypeError, ValueError):
        return None


_HUMIDITY_CACHE: dict = {}

def get_wttr_humidity(venue_name):
    """Real current humidity from wttr.in. MLB's live game feed doesn't
    expose humidity at all (verified against the actual API response), so
    this is queried separately -- a real weather reading, not a fabricated
    number -- for any game where outdoor conditions apply."""
    if venue_name in _HUMIDITY_CACHE:
        return _HUMIDITY_CACHE[venue_name]
    city = CITY_WEATHER_MAP.get(venue_name, venue_name)
    humidity = None
    try:
        url = f"https://wttr.in/{requests.utils.quote(city)}?format=j1"
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            cur = r.json()["current_condition"][0]
            humidity = _int_or_none(cur.get("humidity"))
    except Exception as e:
        print(f"  ⚠ humidity error for {venue_name}: {e}")
    _HUMIDITY_CACHE[venue_name] = humidity
    return humidity


def get_weather(venue_name, venue_id=None, game_pk=None):
    """Real weather for a specific game. Never invents a temp/wind/roof
    value -- anything not actually known comes back None so the dashboard
    shows it as unavailable instead of a fabricated placeholder."""
    roof_type  = get_roof_type(venue_name, venue_id)
    has_roof   = roof_type in ("Retractable", "Dome", "Fixed Roof", "Convertible Roof")
    live       = get_live_feed_weather(game_pk)

    if has_roof:
        if live is None:
            # Can't verify today's roof state from the live feed -- mark
            # unknown rather than assuming open or closed.
            return {"temp_f": None, "wind_mph": None, "wind_dir": None,
                    "humidity": None, "condition": None, "roof": None}
        closed = "closed" in live["condition"].lower()
        if closed:
            # Indoor, climate-controlled -- outdoor city humidity doesn't
            # describe field conditions, so it isn't fetched here.
            return {"temp_f": live["temp_f"], "wind_mph": 0, "wind_dir": None,
                    "humidity": None, "condition": live["condition"], "roof": True}
        return {"temp_f": live["temp_f"], "wind_mph": live["wind_mph"],
                "wind_dir": live["wind_dir"], "humidity": get_wttr_humidity(venue_name),
                "condition": live["condition"], "roof": False}

    # Open-air park -- prefer real per-game feed weather when it's posted.
    if live is not None:
        return {"temp_f": live["temp_f"], "wind_mph": live["wind_mph"],
                "wind_dir": live["wind_dir"], "humidity": get_wttr_humidity(venue_name),
                "condition": live["condition"], "roof": False}

    # Feed hasn't posted yet -- fall back to real current city weather
    # (an actual live observation, never a fabricated estimate).
    city = CITY_WEATHER_MAP.get(venue_name, venue_name)
    try:
        url = f"https://wttr.in/{requests.utils.quote(city)}?format=j1"
        r = requests.get(url, timeout=10)
        if r.status_code != 200:
            return {"temp_f": None, "wind_mph": None, "wind_dir": None,
                    "humidity": None, "condition": None, "roof": False}
        data = r.json()
        cur = data["current_condition"][0]
        desc_list = cur.get("weatherDesc", [{}])
        condition = desc_list[0].get("value") if desc_list else None
        humidity = _int_or_none(cur.get("humidity"))
        _HUMIDITY_CACHE[venue_name] = humidity
        return {
            "temp_f":    _int_or_none(cur.get("temp_F")),
            "wind_mph":  _int_or_none(cur.get("windspeedMiles")),
            "wind_dir":  cur.get("winddir16Point") or None,
            "humidity":  humidity,
            "condition": condition,
            "roof":      False,
        }
    except Exception as e:
        print(f"  ⚠ weather error for {venue_name}: {e}")
        return {"temp_f": None, "wind_mph": None, "wind_dir": None,
                "humidity": None, "condition": None, "roof": False}

def get_pitcher_id(name):
    if not name or name == "TBD":
        return None
    try:
        results = statsapi.lookup_player(name)
        if results:
            return results[0]["id"]
    except Exception as e:
        print(f"  ⚠ pitcher lookup error for {name}: {e}")
    return None

def get_pitcher_stats(player_id, season=2026):
    if not player_id:
        return {}
    try:
        data = statsapi.player_stat_data(
            player_id, group="pitching", type="season", sportId=1
        )
        sp = {}
        for entry in data.get("stats", []):
            if entry.get("stats"):
                sp = entry["stats"]
                break
        if not sp:
            return {}

        # Real value or None -- never a league-average placeholder standing
        # in for a stat MLB Stats API didn't actually provide for this
        # pitcher (e.g. a true 0-IP call-up, where ERA/WHIP are genuinely
        # undefined, not "average").
        def f(key):
            v = sp.get(key)
            try:
                return float(v) if v not in (None, "", "-") else None
            except (TypeError, ValueError):
                return None

        ip   = f("inningsPitched") or 0.0
        era  = f("era")
        whip = f("whip")
        bb9  = f("walksPer9Inn")
        k9   = f("strikeoutsPer9Inn")
        hr   = f("homeRuns") or 0.0
        bb   = f("baseOnBalls") or 0.0
        k    = f("strikeOuts") or 0.0

        hr9_direct = sp.get("homeRunsPer9")
        if hr9_direct not in (None, "", "-"):
            hr9 = float(hr9_direct)
        elif ip > 0:
            # Real hr/ip math, not a guess -- both are real season counts.
            hr9 = round(hr / ip * 9, 2)
        else:
            hr9 = None

        # Real FIP formula (needs real ip > 0); never falls back to ERA,
        # which would silently substitute a different real stat -- or a
        # fabricated one, if ERA itself were ever missing -- as if it were FIP.
        fip = round((13 * hr + 3 * bb - 2 * k) / ip + 3.2, 2) if ip > 0 else None

        return {"era": era, "whip": whip, "hr9": hr9, "bb9": bb9,
                "k9": k9, "fip": fip, "ip": ip}
    except Exception as e:
        print(f"  ⚠ pitcher stats error for id={player_id}: {e}")
        return {}

def get_batter_splits(pid, season=2026):
    if not pid:
        return {}
    try:
        data = statsapi.player_stat_data(pid, group="hitting", type="statSplits", sportId=1)
        splits = {}
        for entry in data.get("stats", []):
            desc = entry.get("split", {}).get("description", "")
            sp = entry.get("stats", {})
            if not sp:
                continue
            def f(key, default=0.0):
                v = sp.get(key)
                try:
                    return float(v) if v not in (None, "", "-", ".---") else default
                except Exception:
                    return default
            s = {
                "avg": f("avg"),
                "obp": f("obp"),
                "slg": f("slg"),
                "ops": f("ops"),
                "hr":  int(f("homeRuns")),
                "ab":  int(f("atBats")),
                "pa":  int(f("plateAppearances")),
            }
            desc_l = desc.lower()
            if "left" in desc_l:
                splits["vs_lhp"] = s
            elif "right" in desc_l:
                splits["vs_rhp"] = s
        return splits
    except Exception as e:
        print(f"  ⚠ splits error for pid={pid}: {e}")
        return {}

def get_pitcher_arsenal(pid, season=2026):
    if not pid:
        return []
    try:
        data = statsapi.get("stats", {
            "personId": str(pid),
            "stats": "pitchArsenal",
            "group": "pitching",
            "season": str(season),
        })
        result = []
        for stat_group in data.get("stats", []):
            for split in stat_group.get("splits", []):
                pt = split.get("pitchType", {})
                sp = split.get("stat", {})
                try:
                    pct = float(sp.get("percentage", 0) or 0)
                    if pct > 1:
                        pct = pct / 100.0
                except Exception:
                    pct = 0.0
                if pct <= 0:
                    continue
                result.append({
                    "abbrev":     (pt.get("code") or "").strip(),
                    "pitch_name": (pt.get("description") or "").strip(),
                    "pct":        round(pct, 3),
                    "velo":       float(sp.get("avgSpeed", 0) or 0),
                    "spin":       0,
                    "run_value":  0,
                    "whiff_pct":  0,
                    "xwoba":      0,
                })
        result.sort(key=lambda p: p["pct"], reverse=True)
        return result
    except Exception as e:
        print(f"  ⚠ arsenal error for pid={pid}: {e}")
        return []

def get_team_batters(team_id, season=2026, top_n=15):
    try:
        roster_data = statsapi.get(
            "team_roster",
            {"teamId": team_id, "rosterType": "active", "season": season}
        )
    except Exception as e:
        print(f"  ⚠ roster error for team {team_id}: {e}")
        return []

    batters = []
    for player in roster_data.get("roster", []):
        pos = player.get("position", {}).get("abbreviation", "")
        # "TWP" (Two-Way Player, e.g. Shohei Ohtani) was excluded alongside
        # pure-pitcher codes -- wrongly, since two-way players have real,
        # often elite, hitting stats and can appear as a batter on any game
        # (not just the ones they start on the mound). This silently
        # dropped every two-way player from the entire batter pool.
        if pos in ("P", "RP", "SP"):
            continue
        pid  = player["person"]["id"]
        name = player["person"]["fullName"]
        try:
            data = statsapi.player_stat_data(pid, group="hitting", type="season", sportId=1)
            sp = {}
            for entry in data.get("stats", []):
                if entry.get("stats"):
                    sp = entry["stats"]
                    break
            if not sp:
                continue

            def f(key, default=0.0):
                v = sp.get(key)
                try:
                    return float(v) if v not in (None, "", "-", ".---") else default
                except (TypeError, ValueError):
                    return default

            ab    = int(f("atBats"))
            if ab < 10:
                continue

            hr    = int(f("homeRuns"))
            avg   = f("avg")
            slg   = f("slg")
            obp   = f("obp")
            ops   = f("ops") or round(slg + obp, 3)
            iso   = max(0.0, round(slg - avg, 3))
            games = max(1, int(f("gamesPlayed", 1)))

            pa  = int(f("plateAppearances"))
            k   = int(f("strikeOuts"))
            bb  = int(f("baseOnBalls"))
            batters.append({
                "playerName": name,
                "playerId":   pid,
                "hr":     hr,
                "avg":    round(avg, 3),
                "ops":    round(ops, 3),
                "slg":    round(slg, 3),
                "iso":    iso,
                "ab":     ab,
                "pa":     pa,
                "k_pct":  round(k / pa, 3) if pa > 0 else 0.220,
                "bb_pct": round(bb / pa, 3) if pa > 0 else 0.080,
                "games":  games,
                "splits": get_batter_splits(pid),
            })
        except Exception as e:
            print(f"    ⚠ batter stats error for {name}: {e}")

    batters.sort(key=lambda x: (-x["hr"], -x["ops"]))
    return batters[:top_n]

def main():
    date_str   = today_str()
    date_label = format_date_label(date_str)
    day_label  = format_day_label(date_str)

    print(f"Fetching slate for {date_str} ({date_label})")

    try:
        sched = statsapi.schedule(date=date_str)
    except Exception as e:
        print(f"❌ Schedule fetch failed: {e}")
        json.dump({"status": "no-games", "date": date_label, "label": day_label},
                  open("scripts/raw_slate.json", "w"), indent=2)
        sys.exit(0)

    live_games = [
        g for g in sched
        if g.get("status") not in ("Postponed", "Cancelled", "Suspended")
    ]
    print(f"  {len(live_games)} games found")

    if len(live_games) < 4:
        print("⚠ Fewer than 4 games — writing no-games status")
        json.dump({"status": "no-games", "date": date_label, "label": day_label},
                  open("scripts/raw_slate.json", "w"), indent=2)
        sys.exit(0)

    games         = []
    pitcher_ids   = set()
    team_ids      = {}
    venue_context = {}  # venue_name -> (venue_id, game_pk), first game of the day at that venue

    for g in live_games:
        away_abbr = team_abbr(g.get("away_name", ""))
        home_abbr = team_abbr(g.get("home_name", ""))
        venue     = g.get("venue_name", "Unknown Park")

        if venue not in venue_context:
            venue_context[venue] = (g.get("venue_id"), g.get("game_id"))

        away_pname = g.get("away_probable_pitcher") or "TBD"
        home_pname = g.get("home_probable_pitcher") or "TBD"

        away_pid = get_pitcher_id(away_pname)
        home_pid = get_pitcher_id(home_pname)

        away_team_id = g.get("away_id")
        home_team_id = g.get("home_id")

        if away_pid:
            pitcher_ids.add(away_pid)
        if home_pid:
            pitcher_ids.add(home_pid)
        if away_team_id:
            team_ids[away_abbr] = away_team_id
        if home_team_id:
            team_ids[home_abbr] = home_team_id

        games.append({
            "gamePk":          g.get("game_id"),
            "awayTeam":        away_abbr,
            "homeTeam":        home_abbr,
            "venueName":       venue,
            "gameTime":        g.get("game_datetime", ""),
            "awayPitcherId":   away_pid,
            "awayPitcherName": away_pname,
            "homePitcherId":   home_pid,
            "homePitcherName": home_pname,
        })

    print(f"  {len(games)} games, {len(pitcher_ids)} pitchers, {len(team_ids)} teams")

    print("Fetching pitcher stats...")
    pitcher_stats = {}
    for pid in sorted(pitcher_ids):
        stats = get_pitcher_stats(pid)
        if stats:
            stats["arsenal"] = get_pitcher_arsenal(pid)
            pitcher_stats[str(pid)] = stats
            print(f"  ✓ pitcher {pid}: ERA {stats.get('era', '?')}, {len(stats['arsenal'])} pitches")
        else:
            print(f"  ⚠ pitcher {pid}: no stats")

    print("Fetching batter stats...")
    players_by_team = {}
    for abbr, tid in sorted(team_ids.items()):
        batters = get_team_batters(tid)
        players_by_team[abbr] = batters
        print(f"  ✓ {abbr}: {len(batters)} batters")

    print("Fetching weather...")
    venues_in_slate = list({g["venueName"] for g in games})
    weather = {}
    for venue in venues_in_slate:
        venue_id, game_pk = venue_context.get(venue, (None, None))
        weather[venue] = get_weather(venue, venue_id, game_pk)
        w = weather[venue]
        temp_disp = f"{w['temp_f']}°F" if w['temp_f'] is not None else "?"
        wind_disp = f"{w['wind_mph']}mph" if w['wind_mph'] is not None else "?"
        roof_disp = "  [roof closed]" if w.get("roof") is True \
            else "  [roof unknown]" if w.get("roof") is None else ""
        print(f"  ✓ {venue}: {temp_disp}  {wind_disp} {w['wind_dir'] or ''}{roof_disp}")

    park_hr_ranks = {v: PARK_HR_RANKS.get(v, 20) for v in venues_in_slate}

    output = {
        "status":                 "ok",
        "date":                   date_label,
        "label":                  day_label,
        "games":                  games,
        "pitcher_stats":          pitcher_stats,
        "players_by_team":        players_by_team,
        "weather":                weather,
        "park_hr_ranks":          park_hr_ranks,
        "retractable_roof_parks": list(RETRACTABLE_ROOF_PARKS | HARD_DOME_PARKS),
    }

    with open("scripts/raw_slate.json", "w") as f:
        json.dump(output, f, indent=2)

    print(f"\n✅ scripts/raw_slate.json written")
    print(f"   Date:   {date_label}")
    print(f"   Games:  {len(games)}")
    print(f"   Teams:  {len(players_by_team)}")

if __name__ == "__main__":
    main()
