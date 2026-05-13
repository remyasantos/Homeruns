#!/usr/bin/env python3
"""
tier_engine.py — scores and tiers every player on today's slate
Reads:  scripts/raw_slate.json
Writes: scripts/scored_players.json

Scoring model (0–100 scale):
  Pitcher Disaster  40%  — ERA, WHIP, HR/9, FIP
  Park Factor       30%  — HR rank + weather boost
  Batter Power      30%  — HR pace, OPS, ISO

Tier thresholds:
  S  ≥ 72   (4–8 players)
  A  55–71  (12–16 players)
  B  40–54  (16–20 players)
  C  < 40   (6–10 players)
"""

import json
import sys
import math

# ── Load raw slate ────────────────────────────────────────────────────────────

with open("scripts/raw_slate.json") as f:
    slate = json.load(f)

if slate["status"] == "no-games":
    print("⚠ No games today — nothing to score")
    with open("scripts/scored_players.json", "w") as f:
        json.dump([], f)
    sys.exit(0)

games          = slate["games"]
pitcher_stats  = slate["pitcher_stats"]
players_by_team = slate["players_by_team"]
weather        = slate["weather"]
park_hr_ranks  = slate["park_hr_ranks"]
roof_parks     = set(slate.get("retractable_roof_parks", []))

# ── Build game lookup ─────────────────────────────────────────────────────────

# team_abbr → game info
team_game = {}
for g in games:
    game_label = f"{g['awayTeam']}@{g['homeTeam']}"
    for side in ["away", "home"]:
        team = g[f"{side}Team"]
        opp_pitcher_id   = g[f"{'home' if side == 'away' else 'away'}PitcherId"]
        opp_pitcher_name = g[f"{'home' if side == 'away' else 'away'}PitcherName"]
        team_game[team] = {
            "game_label":      game_label,
            "venue":           g["venueName"],
            "opp_pitcher_id":  str(opp_pitcher_id) if opp_pitcher_id else None,
            "opp_pitcher_name": opp_pitcher_name,
            "is_home":         side == "home",
        }

# ── Scoring functions ─────────────────────────────────────────────────────────

def score_pitcher_disaster(stats):
    """0–100. Higher = worse pitcher = better for batters."""
    if not stats:
        return 35  # unknown TBD arm — slight positive
    era  = stats.get("era", 4.5)
    whip = stats.get("whip", 1.30)
    hr9  = stats.get("hr9", 1.1)
    fip  = stats.get("fip", 4.5)
    ip   = stats.get("ip", 0)

    # ERA score: 9.0+ ERA = 100, 2.0 ERA = 0
    era_s  = min(100, max(0, (era - 2.0) / 7.0 * 100))
    # WHIP score: 1.8+ = 100, 0.9 = 0
    whip_s = min(100, max(0, (whip - 0.9) / 0.9 * 100))
    # HR/9 score: 2.5+ = 100, 0.5 = 0
    hr9_s  = min(100, max(0, (hr9 - 0.5) / 2.0 * 100))
    # FIP score: 6.0+ = 100, 3.0 = 0
    fip_s  = min(100, max(0, (fip - 3.0) / 3.0 * 100))

    # Low innings pitched = less reliable sample, slight penalty
    ip_confidence = min(1.0, ip / 30.0)

    raw = (era_s * 0.35 + whip_s * 0.25 + hr9_s * 0.25 + fip_s * 0.15)
    return round(raw * (0.7 + 0.3 * ip_confidence), 1)


def score_park_and_weather(venue):
    """0–100. Higher = better HR environment."""
    rank = park_hr_ranks.get(venue, 20)
    total_parks = 30
    # Invert rank: rank 1 → 100, rank 30 → 0
    park_s = max(0, (total_parks - rank) / total_parks * 100)

    w = weather.get(venue, {})
    if w.get("roof"):
        # Dome: neutral weather, no wind bonus or penalty
        weather_boost = 0
    else:
        temp   = w.get("temp_f", 72) or 72
        wind   = w.get("wind_mph", 0) or 0
        w_dir  = (w.get("wind_dir", "") or "").upper()

        # Temperature: 85°F+ = +15, 55°F- = -15
        temp_boost = max(-15, min(15, (temp - 70) * 0.6))

        # Wind: "out" directions (S, SW, SSW, SSE, SE, W, WSW, WNW)
        # "in" directions (N, NE, NNE, NNW, NW)
        out_dirs = {"S", "SW", "SSW", "SSE", "SE", "W", "WSW", "WNW"}
        in_dirs  = {"N", "NE", "NNE", "NNW", "NW"}
        if w_dir in out_dirs:
            wind_boost = min(20, wind * 1.2)
        elif w_dir in in_dirs:
            wind_boost = max(-15, -wind * 0.8)
        else:
            wind_boost = 0

        weather_boost = temp_boost + wind_boost

    return round(min(100, max(0, park_s + weather_boost)), 1)


def score_batter_power(batter):
    """0–100 batter power score."""
    hr   = batter.get("hr", 0)
    ops  = batter.get("ops", 0.700)
    iso  = batter.get("iso", 0.150)
    ab   = batter.get("ab", 0)
    games = batter.get("games", 1) or 1

    # HR pace per 162 games
    hr_pace = (hr / games * 162) if games > 0 else 0
    hr_s    = min(100, hr_pace / 60 * 100)   # 60 HR = 100

    # OPS: 1.100 = 100, 0.600 = 0
    ops_s   = min(100, max(0, (ops - 0.600) / 0.500 * 100))

    # ISO: 0.300+ = 100, 0.100 = 0
    iso_s   = min(100, max(0, (iso - 0.100) / 0.200 * 100))

    return round(hr_s * 0.45 + ops_s * 0.30 + iso_s * 0.25, 1)


def assign_tier(composite_score, rank_in_pool):
    """Assign S/A/B/C based on score thresholds."""
    if composite_score >= 72:
        return "S"
    elif composite_score >= 55:
        return "A"
    elif composite_score >= 40:
        return "B"
    else:
        return "C"


def estimate_odds(tier, composite_score):
    """Rough HR prop odds estimate based on tier and score."""
    if tier == "S":
        base = 220
        adj  = max(0, int((composite_score - 72) * 2))
        return f"+{max(180, base - adj)}"
    elif tier == "A":
        base = 350
        return f"+{max(260, int(base - (composite_score - 55) * 3))}"
    elif tier == "B":
        base = 500
        return f"+{max(360, int(base - (composite_score - 40) * 4))}"
    else:
        return f"+{min(900, max(550, int(750 - composite_score * 3)))}"


def wind_tag(venue, weather_data):
    w = weather_data.get(venue, {})
    if w.get("roof"):
        return None
    wind = w.get("wind_mph", 0) or 0
    w_dir = (w.get("wind_dir", "") or "").upper()
    out_dirs = {"S", "SW", "SSW", "SSE", "SE", "W", "WSW", "WNW"}
    if wind >= 10 and w_dir in out_dirs:
        return "💨 Wind Boost"
    return None


def matchup_grade(pitcher_score, park_score, batter_score):
    composite = pitcher_score * 0.4 + park_score * 0.3 + batter_score * 0.3
    if composite >= 80:
        return "A+"
    elif composite >= 72:
        return "A"
    elif composite >= 65:
        return "A-"
    elif composite >= 58:
        return "B+"
    elif composite >= 50:
        return "B"
    elif composite >= 42:
        return "B-"
    elif composite >= 35:
        return "C+"
    elif composite >= 28:
        return "C"
    else:
        return "C-"


# ── Score every batter on the slate ──────────────────────────────────────────

print("Scoring batters...")
scored = []

for team_abbr, batters in players_by_team.items():
    game_info = team_game.get(team_abbr)
    if not game_info:
        continue

    venue         = game_info["venue"]
    opp_pid       = game_info["opp_pitcher_id"]
    opp_name      = game_info["opp_pitcher_name"]
    p_stats       = pitcher_stats.get(opp_pid, {}) if opp_pid else {}
    game_label    = game_info["game_label"]

    p_score = score_pitcher_disaster(p_stats)
    pk_score = score_park_and_weather(venue)

    for batter in batters:
        b_score    = score_batter_power(batter)
        composite  = round(p_score * 0.40 + pk_score * 0.30 + b_score * 0.30, 1)

        tags = []
        # Tag logic
        if batter["hr"] >= 10:
            tags.append("👑 MVP/Elite")
        if p_stats.get("era", 0) >= 5.50:
            tags.append("💣 SP Disaster")
        wind_t = wind_tag(venue, weather)
        if wind_t:
            tags.append(wind_t)
        if venue == "Coors Field":
            tags.append("🏔️ Coors Boost")
        if batter["iso"] >= 0.220:
            tags.append("📈 Breakout")
        if composite < 40:
            tags.append("🎰 Longshot")
        # Guarantee at least 2 tags — "if" only fires once, so use explicit fills
        if not tags:
            tags.append("💰 Value")
        if len(tags) < 2:
            tags.append("🔜 Due")
        tags = tags[:4]

        scored.append({
            "playerName":     batter["playerName"],
            "playerId":       batter["playerId"],
            "team":           team_abbr,
            "venue":          venue,
            "gameLabel":      game_label,
            "oppPitcherName": opp_name,
            "oppPitcherId":   opp_pid,
            "pitcherStats":   p_stats,
            "pitcherScore":   p_score,
            "parkScore":      pk_score,
            "batterScore":    b_score,
            "compositeScore": composite,
            "hr":     batter["hr"],
            "ops":    batter["ops"],
            "iso":    batter["iso"],
            "avg":    batter["avg"],
            "slg":    batter["slg"],
            "ab":     batter["ab"],
            "games":  batter["games"],
            "tags":   tags,
            "weather": weather.get(venue, {}),
        })

# ── Sort and assign tiers ─────────────────────────────────────────────────────

scored.sort(key=lambda x: -x["compositeScore"])

# Assign tiers with count constraints
tier_counts = {"S": 0, "A": 0, "B": 0, "C": 0}
tier_limits = {"S": (4, 8), "A": (12, 16), "B": (16, 20), "C": (6, 10)}

# First pass: natural tier from score
for p in scored:
    p["tier"] = assign_tier(p["compositeScore"], 0)

# Second pass: enforce min/max counts
# If we have too few S-tier, promote top A-tier players
s_players = [p for p in scored if p["tier"] == "S"]
a_players = [p for p in scored if p["tier"] == "A"]
b_players = [p for p in scored if p["tier"] == "B"]
c_players = [p for p in scored if p["tier"] == "C"]

while len(s_players) < 4 and a_players:
    promoted = a_players.pop(0)
    promoted["tier"] = "S"
    s_players.append(promoted)

while len(s_players) > 8:
    demoted = s_players.pop()
    demoted["tier"] = "A"
    a_players.insert(0, demoted)

# Ensure we have enough A-tier
while len(a_players) < 12 and b_players:
    promoted = b_players.pop(0)
    promoted["tier"] = "A"
    a_players.append(promoted)

while len(a_players) > 16:
    demoted = a_players.pop()
    demoted["tier"] = "B"
    b_players.insert(0, demoted)

# Ensure enough B-tier
while len(b_players) < 16 and c_players:
    promoted = c_players.pop(0)
    promoted["tier"] = "B"
    b_players.append(promoted)

# Enforce C-tier minimum (demote from bottom of B if needed)
while len(c_players) < 6 and b_players:
    demoted = b_players.pop()
    demoted["tier"] = "C"
    c_players.insert(0, demoted)

# Build the 50-player final list from tier buckets
final_players = (
    s_players[:8] +
    a_players[:16] +
    b_players[:20] +
    c_players[:10]
)[:50]

# Guarantee exactly 50 — pull from the remaining scored pool if short
if len(final_players) < 50:
    used_pids = {p["playerId"] for p in final_players}
    for p in scored:  # scored is sorted desc by compositeScore
        if len(final_players) >= 50:
            break
        if p["playerId"] not in used_pids:
            if p["compositeScore"] >= 55:
                p["tier"] = "A"
            elif p["compositeScore"] >= 40:
                p["tier"] = "B"
            else:
                p["tier"] = "C"
            final_players.append(p)
            used_pids.add(p["playerId"])

# Assign IDs 1-50
for i, p in enumerate(final_players):
    p["id"] = i + 1
    p["matchupGrade"] = matchup_grade(p["pitcherScore"], p["parkScore"], p["batterScore"])
    p["estOdds"] = estimate_odds(p["tier"], p["compositeScore"])

print(f"\n✅ Scoring complete")
print(f"   S: {len([p for p in final_players if p['tier']=='S'])}")
print(f"   A: {len([p for p in final_players if p['tier']=='A'])}")
print(f"   B: {len([p for p in final_players if p['tier']=='B'])}")
print(f"   C: {len([p for p in final_players if p['tier']=='C'])}")
print(f"   Total: {len(final_players)}")

with open("scripts/scored_players.json", "w") as f:
    json.dump({
        "date":    slate["date"],
        "label":   slate["label"],
        "games":   games,
        "weather": weather,
        "players": final_players,
        "park_hr_ranks": park_hr_ranks,
        "retractable_roof_parks": list(roof_parks),
    }, f, indent=2)

print("   Written: scripts/scored_players.json")
