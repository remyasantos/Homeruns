#!/usr/bin/env python3
"""
fetch_slate.py — pulls today's MLB slate from statsapi.mlb.com
Outputs: scripts/raw_slate.json

Data collected:
  - Today's games + probable pitchers
  - Pitcher season stats (ERA, WHIP, HR/9, BB/9, FIP)
  - Batter season stats (HR, AVG, SLG, OPS, ISO) for top HR hitters per team
  - Park/venue info
  - Weather via wttr.in (temp, wind)
"""

import json
import sys
import datetime
import requests

# ── Config ────────────────────────────────────────────────────────────────────

TODAY = datetime.date.today().strftime("%m/%d/%Y")
DATE_LABEL = datetime.date.today().strftime("%B %-d, %Y").upper()
DAY_LABEL  = datetime.date.today().strftime("%A").upper() + " MLB SLATE"

MLB_API = "https://statsapi.mlb.com/api/v1"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; Homeruns/1.0)",
    "Accept": "application/json",
}

# Static park HR factor rankings (historical, updated annually)
# 1 = most HR-friendly
PARK_HR_RANKS = {
    "Coors Field":                    1,
    "Great American Ball Park":       2,
    "Citizens Bank Park":             3,
    "Yankee Stadium":                 4,
    "American Family Field":          5,
    "Truist Park":                    6,
    "Chase Field":                    7,
    "Globe Life Field":               8,
    "Fenway Park":                    9,
    "PNC Park":                      10,
    "loanDepot park":                11,
    "Oriole Park at Camden Yards":   12,
    "Dodger Stadium":                13,
    "Oracle Park":                   14,
    "Guaranteed Rate Field":         15,
    "Busch Stadium":                 16,
    "Kauffman Stadium":              17,
    "Wrigley Field":                 18,
    "Progressive Field":             19,
    "Citi Field":                    20,
    "T-Mobile Park":                 21,
    "Target Field":                  22,
    "Petco Park":                    23,
    "Angel Stadium":                 24,
    "Minute Maid Park":              25,   # Daikin Park
    "Daikin Park":                   25,
    "Rogers Centre":                 26,
    "Comerica Park":                 27,
    "Oakland Coliseum":              28,
    "Sutter Health Park":            28,   # OAK temp
    "Nationals Park":                29,
    "Tropicana Field":               30,
    "Sahlen Field":                  31,
    # Renamed/sponsored stadiums — keep in sync with MLB API responses
    "Rate Field":                    15,   # Guaranteed Rate Field renamed 2025
    "UNIQLO Field at Dodger Stadium": 13,  # Dodger Stadium renamed 2025
    "Daikin Park":                   25,   # Minute Maid Park renamed (already listed above)
}

RETRACTABLE_ROOF_PARKS = {
    "American Family Field",
    "Chase Field",
    "Globe Life Field",
    "loanDepot park",
    "T-Mobile Park",
    "Minute Maid Park",
    "Daikin Park",
    "Rogers Centre",
}

# City name for weather lookups keyed by venue name
PARK_CITY = {
    "Coors Field":                   "Denver,CO",
    "Great American Ball Park":      "Cincinnati,OH",
    "Citizens Bank Park":            "Philadelphia,PA",
    "Yankee Stadium":                "Bronx,NY",
    "American Family Field":         "Milwaukee,WI",
    "Truist Park":                   "Cumberland,GA",
    "Chase Field":                   "Phoenix,AZ",
    "Globe Life Field":              "Arlington,TX",
    "Fenway Park":                   "Boston,MA",
    "PNC Park":                      "Pittsburgh,PA",
    "loanDepot park":                "Miami,FL",
    "Oriole Park at Camden Yards":   "Baltimore,MD",
    "Dodger Stadium":                "Los Angeles,CA",
    "Oracle Park":                   "San Francisco,CA",
    "Guaranteed Rate Field":         "Chicago,IL",
    "Busch Stadium":                 "St. Louis,MO",
    "Kauffman Stadium":              "Kansas City,MO",
    "Wrigley Field":                 "Chicago,IL",
    "Progressive Field":             "Cleveland,OH",
    "Citi Field":                    "Queens,NY",
    "T-Mobile Park":                 "Seattle,WA",
    "Target Field":                  "Minneapolis,MN",
    "Petco Park":                    "San Diego,CA",
    "Angel Stadium":                 "Anaheim,CA",
    "Minute Maid Park":              "Houston,TX",
    "Daikin Park":                   "Houston,TX",
    "Rogers Centre":                 "Toronto,Canada",
    "Comerica Park":                 "Detroit,MI",
    "Oakland Coliseum":              "Oakland,CA",
    "Sutter Health Park":            "West Sacramento,CA",
    "Nationals Park":                "Washington,DC",
    "Tropicana Field":               "St. Petersburg,FL",
    "Rate Field":                    "Chicago,IL",
    "UNIQLO Field at Dodger Stadium": "Los Angeles,CA",
}


def get(path, params=None):
    """GET from MLB Stats API."""
    url = f"{MLB_API}/{path}"
    r = requests.get(url, params=params, headers=HEADERS, timeout=15)
    r.raise_for_status()
    return r.json()


def fetch_schedule():
    """Return today's games with probable pitchers and venue info."""
    data = get("schedule", {
        "date": TODAY,
        "sportId": 1,
        "hydrate": "probablePitcher,venue,linescore,team",
    })
    games = []
    for date_block in data.get("dates", []):
        for g in date_block.get("games", []):
            if g.get("status", {}).get("abstractGameState") == "Final":
                continue  # skip completed (double-header day 1)
            away_team = g["teams"]["away"]["team"]
            home_team = g["teams"]["home"]["team"]
            away_prob = g["teams"]["away"].get("probablePitcher", {})
            home_prob = g["teams"]["home"].get("probablePitcher", {})
            venue = g.get("venue", {})

            games.append({
                "gamePk":       g["gamePk"],
                "gameDate":     g["gameDate"],
                "status":       g["status"]["abstractGameState"],
                "awayTeam":     away_team.get("abbreviation", ""),
                "awayTeamId":   away_team.get("id"),
                "awayTeamName": away_team.get("name", ""),
                "homeTeam":     home_team.get("abbreviation", ""),
                "homeTeamId":   home_team.get("id"),
                "homeTeamName": home_team.get("name", ""),
                "awayPitcherId":   away_prob.get("id"),
                "awayPitcherName": away_prob.get("fullName", "TBD"),
                "homePitcherId":   home_prob.get("id"),
                "homePitcherName": home_prob.get("fullName", "TBD"),
                "venueName":    venue.get("name", ""),
                "venueId":      venue.get("id"),
            })
    return games


def fetch_pitcher_stats(pitcher_id):
    """Return current-season pitching stats for a player."""
    if not pitcher_id:
        return {}
    try:
        season = datetime.date.today().year
        data = get(f"people/{pitcher_id}/stats", {
            "stats": "season",
            "group": "pitching",
            "season": season,
            "sportId": 1,
        })
        splits = data.get("stats", [{}])[0].get("splits", [])
        if not splits:
            return {}
        s = splits[0].get("stat", {})
        ip = float(s.get("inningsPitched", 0) or 0)
        hrs = int(s.get("homeRuns", 0) or 0)
        bb  = int(s.get("baseOnBalls", 0) or 0)
        so  = int(s.get("strikeOuts", 0) or 0)
        er  = int(s.get("earnedRuns", 0) or 0)
        hits= int(s.get("hits", 0) or 0)
        gs  = int(s.get("gamesStarted", 0) or 0)

        era  = round(float(s.get("era", 0) or 0), 2)
        whip = round(float(s.get("whip", 0) or 0), 2)
        hr9  = round((hrs / ip * 9) if ip > 0 else 0, 2)
        bb9  = round((bb  / ip * 9) if ip > 0 else 0, 2)
        k9   = round((so  / ip * 9) if ip > 0 else 0, 2)
        # FIP approximation
        fip  = round(((13*hrs + 3*bb - 2*so) / ip + 3.2) if ip > 0 else 0, 2)

        return {
            "era": era, "whip": whip, "hr9": hr9, "bb9": bb9,
            "k9": k9, "fip": fip, "ip": ip, "gs": gs,
            "gamesStarted": gs,
            "hits": hits, "homeRuns": hrs, "bb": bb,
        }
    except Exception as e:
        print(f"  ⚠ pitcher stats error (id={pitcher_id}): {e}", file=sys.stderr)
        return {}


def fetch_team_hr_leaders(team_id, limit=12):
    """Return top HR hitters on a team for the current season."""
    try:
        season = datetime.date.today().year
        data = get("stats", {
            "stats": "season",
            "group": "hitting",
            "season": season,
            "sportId": 1,
            "teamId": team_id,
            "limit": 40,
        })
        splits = data.get("stats", [{}])[0].get("splits", [])
        players = []
        for sp in splits:
            stat = sp.get("stat", {})
            person = sp.get("player", {})
            team   = sp.get("team", {})
            hr  = int(stat.get("homeRuns", 0) or 0)
            ab  = int(stat.get("atBats", 0) or 0)
            if ab < 20:
                continue  # skip bench/emergency guys
            avg  = float(stat.get("avg", 0) or 0)
            slg  = float(stat.get("slg", 0) or 0)
            obp  = float(stat.get("obp", 0) or 0)
            ops  = round(float(stat.get("ops", 0) or 0), 3)
            iso  = round(slg - avg, 3)
            players.append({
                "playerId":   person.get("id"),
                "playerName": person.get("fullName", ""),
                "teamId":     team.get("id"),
                "teamAbbr":   team.get("abbreviation", ""),
                "hr":  hr,
                "avg": round(avg, 3),
                "slg": round(slg, 3),
                "obp": round(obp, 3),
                "ops": ops,
                "iso": iso,
                "ab":  ab,
                "games": int(stat.get("gamesPlayed", 0) or 0),
                "rbi": int(stat.get("rbi", 0) or 0),
                "sb":  int(stat.get("stolenBases", 0) or 0),
            })
        # Sort by HR desc, then ISO
        players.sort(key=lambda x: (-x["hr"], -x["iso"]))
        return players[:limit]
    except Exception as e:
        print(f"  ⚠ team HR leaders error (team={team_id}): {e}", file=sys.stderr)
        return []


def fetch_weather(venue_name):
    """Fetch weather from wttr.in for a given venue."""
    city = PARK_CITY.get(venue_name)
    if not city:
        return {"temp_f": None, "wind_mph": None, "wind_dir": None, "condition": None, "roof": False}

    # Is this a dome/retractable roof park?
    is_dome = venue_name in RETRACTABLE_ROOF_PARKS

    try:
        r = requests.get(
            f"https://wttr.in/{requests.utils.quote(city)}",
            params={"format": "j1"},
            headers=HEADERS,
            timeout=10,
        )
        r.raise_for_status()
        d = r.json()
        current = d["current_condition"][0]
        temp_f  = int(current.get("temp_F", 0))
        wind_mph = int(current.get("windspeedMiles", 0))
        wind_dir = current.get("winddir16Point", "")
        desc    = current["weatherDesc"][0]["value"]
        return {
            "temp_f":   temp_f,
            "wind_mph": wind_mph,
            "wind_dir": wind_dir,
            "condition": desc,
            "roof":     is_dome,
        }
    except Exception as e:
        print(f"  ⚠ weather error ({venue_name}): {e}", file=sys.stderr)
        return {"temp_f": None, "wind_mph": None, "wind_dir": None, "condition": None, "roof": is_dome}


def main():
    print(f"📅 Fetching MLB slate for {TODAY}...")

    # 1. Schedule
    print("  → schedule...")
    games = fetch_schedule()
    print(f"  ✓ {len(games)} games found")

    if len(games) < 4:
        result = {
            "status": "no-games",
            "date": DATE_LABEL,
            "label": DAY_LABEL,
            "games": [],
            "players_by_team": {},
            "pitcher_stats": {},
            "weather": {},
            "park_hr_ranks": PARK_HR_RANKS,
        }
        with open("scripts/raw_slate.json", "w") as f:
            json.dump(result, f, indent=2)
        print("  ⚠ Fewer than 4 games — writing no-games status")
        sys.exit(0)

    # 2. Pitcher stats
    print("  → pitcher stats...")
    pitcher_stats = {}
    for g in games:
        for pid, pname in [(g["awayPitcherId"], g["awayPitcherName"]),
                           (g["homePitcherId"], g["homePitcherName"])]:
            if pid and pid not in pitcher_stats:
                stats = fetch_pitcher_stats(pid)
                pitcher_stats[str(pid)] = {"name": pname, **stats}
                era_str = f"ERA {stats.get('era', '?')}" if stats else "no stats"
                print(f"     {pname}: {era_str}")

    # 3. Batter stats per team
    print("  → batter stats per team...")
    players_by_team = {}
    seen_team_ids = set()
    for g in games:
        for tid, tabbr in [(g["awayTeamId"], g["awayTeam"]),
                           (g["homeTeamId"], g["homeTeam"])]:
            if tid not in seen_team_ids:
                seen_team_ids.add(tid)
                batters = fetch_team_hr_leaders(tid, limit=15)
                players_by_team[tabbr] = batters
                top = batters[0]["playerName"] if batters else "none"
                top_hr = batters[0]["hr"] if batters else 0
                print(f"     {tabbr}: {len(batters)} batters (top: {top} {top_hr} HR)")

    # 4. Weather
    print("  → weather...")
    weather = {}
    seen_venues = set()
    for g in games:
        venue = g["venueName"]
        if venue and venue not in seen_venues:
            seen_venues.add(venue)
            w = fetch_weather(venue)
            weather[venue] = w
            if w["roof"]:
                print(f"     {venue}: DOME/ROOF")
            elif w["temp_f"]:
                print(f"     {venue}: {w['temp_f']}°F, {w['wind_mph']}mph {w['wind_dir']}")

    # 5. Assemble output
    result = {
        "status": "ok",
        "date":  DATE_LABEL,
        "label": DAY_LABEL,
        "games": games,
        "pitcher_stats": pitcher_stats,
        "players_by_team": players_by_team,
        "weather": weather,
        "park_hr_ranks": PARK_HR_RANKS,
        "retractable_roof_parks": list(RETRACTABLE_ROOF_PARKS),
    }

    with open("scripts/raw_slate.json", "w") as f:
        json.dump(result, f, indent=2)

    print(f"\n✅ raw_slate.json written")
    print(f"   Games:   {len(games)}")
    print(f"   Pitchers: {len(pitcher_stats)}")
    print(f"   Teams:   {len(players_by_team)}")


if __name__ == "__main__":
    main()
