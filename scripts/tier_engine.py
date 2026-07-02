#!/usr/bin/env python3
"""
tier_engine.py — scores and tiers every player on today's slate
Reads:  scripts/raw_slate.json
        scripts/savant_data.json  (optional; degrades to season-stats-only
                                    scoring if missing, never fabricated)
Writes: scripts/scored_players.json

Scoring model (0–100 scale):
  Pitcher Disaster  40%  — real ERA/WHIP/HR9/FIP blended with real Savant
                           barrel%/hard-hit%/xwOBA/FB% allowed, when a
                           pitcher has real Savant data. Season-stats-only
                           when they don't -- never an estimated Savant value.
  Park Factor       30%  — HR rank + weather boost
  Batter Power      30%  — real HR pace/OPS/ISO blended with real Savant
                           barrel%/hard-hit%/exit velo/pull+FB%/xwOBA, same
                           real-or-season-only rule as pitchers.

Tier thresholds:
  S  ≥ 72   (4–8 players)
  A  55–71  (12–16 players)
  B  40–54  (16–20 players)
  C  < 40   (6–10 players)
"""

import json
import os
import re
import sys
import math

# ── Real wind-direction classification ───────────────────────────────────────
# weather["wind_dir"] can be a 16-point compass code (wttr.in fallback) OR a
# phrase from MLB's live feed ("Out To LF", "In From CF", "R To L" crosswind).
# The old out_dirs/in_dirs compass-only sets never matched the phrase form,
# so wind-based scoring silently did nothing for any game using live-feed
# weather (the primary source as of this pipeline's latest fix).

_COMPASS_OUT = {"S", "SW", "SSW", "SSE", "SE", "W", "WSW", "WNW"}
_COMPASS_IN  = {"N", "NE", "NNE", "NNW", "NW"}

def classify_wind(wind_dir):
    """Returns 'out', 'in', or None (crosswind / unrecognized / unknown)."""
    if not wind_dir:
        return None
    d = str(wind_dir).strip().upper()
    if d in _COMPASS_OUT:
        return "out"
    if d in _COMPASS_IN:
        return "in"
    if "OUT" in d:
        return "out"
    if re.search(r"\bIN\b", d):
        return "in"
    return None

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

# ── Load real Savant data (optional) ─────────────────────────────────────────
# Same source the Statcast Matchups dashboard uses. If it's missing, batter/
# pitcher scoring falls back to season-stats-only -- never an estimated
# Savant number standing in for a real one.
try:
    with open("scripts/savant_data.json") as f:
        savant = json.load(f)
    print(f"✓ Loaded savant_data.json")
except FileNotFoundError:
    savant = {}
    print("⚠ savant_data.json not found — scoring will use season stats only")
except Exception as exc:
    savant = {}
    print(f"⚠ Could not parse savant_data.json ({exc}) — scoring will use season stats only")

savant_batters  = savant.get("batters", {})
savant_pitchers = savant.get("pitchers", {})


def _real(d: dict, key: str):
    """Return a real, non-None, non-zero Savant value, or None. Savant's own
    export convention uses 0.0/None interchangeably for 'not available' --
    treating an exact 0.0 as real would risk showing a legitimate absence as
    a suspiciously perfect stat, so both are treated as unknown."""
    v = d.get(key)
    if v is None:
        return None
    try:
        f = float(v)
        return f if f != 0.0 else None
    except (TypeError, ValueError):
        return None

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

def score_pitcher_disaster(stats, pitcher_id=None):
    """0–100. Higher = worse pitcher = better for batters. Blends real
    ERA/WHIP/HR9/FIP with real Savant contact-quality-allowed metrics
    (barrel%, hard-hit%, xwOBA, FB%) when the pitcher has real Savant data;
    falls back to season-stats-only when they don't."""
    if not stats:
        return 35  # unknown TBD arm — slight positive
    # Real value or None -- MLB Stats API leaves these blank when genuinely
    # undefined (e.g. a true 0-IP call-up), never backfilled with a
    # league-average placeholder (see fetch_slate.py's get_pitcher_stats).
    era  = stats.get("era")
    whip = stats.get("whip")
    hr9  = stats.get("hr9")
    fip  = stats.get("fip")
    ip   = stats.get("ip") or 0.0

    # Weighted average over only the real components present, re-normalized
    # -- a pitcher missing one real stat doesn't get a fabricated stand-in,
    # and doesn't get penalized by silently zeroing that component either.
    weighted = []
    if era is not None:
        # ERA score: 9.0+ ERA = 100, 2.0 ERA = 0
        weighted.append((min(100, max(0, (era - 2.0) / 7.0 * 100)), 0.35))
    if whip is not None:
        # WHIP score: 1.8+ = 100, 0.9 = 0
        weighted.append((min(100, max(0, (whip - 0.9) / 0.9 * 100)), 0.25))
    if hr9 is not None:
        # HR/9 score: 2.5+ = 100, 0.5 = 0
        weighted.append((min(100, max(0, (hr9 - 0.5) / 2.0 * 100)), 0.25))
    if fip is not None:
        # FIP score: 6.0+ = 100, 3.0 = 0
        weighted.append((min(100, max(0, (fip - 3.0) / 3.0 * 100)), 0.15))

    # Low innings pitched = less reliable sample, slight penalty
    ip_confidence = min(1.0, ip / 30.0)

    if weighted:
        total_weight = sum(w for _, w in weighted)
        season_composite = sum(s * w for s, w in weighted) / total_weight
    else:
        season_composite = 35.0  # no real season stats at all -- same neutral default as the TBD case above

    savant_composite = None
    sv = savant_pitchers.get(str(pitcher_id), {}) if pitcher_id else {}
    if sv and _real(sv, "pa"):
        barrel_pct   = _real(sv, "barrel_pct")
        hard_hit_pct = _real(sv, "hard_hit_pct")
        xwoba        = _real(sv, "xwoba")
        fb_pct       = _real(sv, "fb_pct")

        parts = []
        if barrel_pct is not None:
            parts.append(min(100, max(0, barrel_pct / 16.0 * 100)))
        if hard_hit_pct is not None:
            parts.append(min(100, max(0, (hard_hit_pct - 30.0) / 25.0 * 100)))
        if xwoba is not None:
            parts.append(min(100, max(0, (xwoba - 0.250) / 0.200 * 100)))
        if fb_pct is not None:
            parts.append(min(100, max(0, (fb_pct - 30.0) / 25.0 * 100)))
        if parts:
            savant_composite = sum(parts) / len(parts)

    if savant_composite is not None:
        raw = savant_composite * 0.55 + season_composite * 0.45
    else:
        raw = season_composite

    return round(raw * (0.7 + 0.3 * ip_confidence), 1)


def score_park_and_weather(venue):
    """0–100. Higher = better HR environment."""
    rank = park_hr_ranks.get(venue, 20)
    total_parks = 30
    # Invert rank: rank 1 → 100, rank 30 → 0
    park_s = max(0, (total_parks - rank) / total_parks * 100)

    w = weather.get(venue, {})
    roof = w.get("roof")
    temp = w.get("temp_f")
    wind = w.get("wind_mph")
    w_dir = w.get("wind_dir")

    if roof is True:
        # Confirmed closed dome: no weather variables apply.
        weather_boost = 0
    elif temp is None or wind is None:
        # Genuinely unknown (roof state unconfirmed, or the live feed hasn't
        # posted yet) -- apply no boost or penalty rather than assuming a
        # fabricated 72°F/calm-wind baseline.
        weather_boost = 0
    else:
        # Temperature: 85°F+ = +15, 55°F- = -15
        temp_boost = max(-15, min(15, (temp - 70) * 0.6))

        wind_class = classify_wind(w_dir)
        if wind_class == "out":
            wind_boost = min(20, wind * 1.2)
        elif wind_class == "in":
            wind_boost = max(-15, -wind * 0.8)
        else:
            wind_boost = 0

        weather_boost = temp_boost + wind_boost

    return round(min(100, max(0, park_s + weather_boost)), 1)


def score_batter_power(batter):
    """0–100 batter power score. Blends real season HR-pace/OPS/ISO with real
    Savant quality-of-contact metrics (barrel%, hard-hit%, exit velocity,
    pull%+FB% profile, xwOBA) when the batter has real Savant data; falls
    back to season-stats-only when they don't. Savant metrics carry more
    weight in the blend since they strip out park/luck noise that raw HR
    totals don't -- a real predictor of repeatable power, not small-sample
    fly-ball-that-happened-to-clear-the-fence variance."""
    hr   = batter.get("hr", 0)
    ops  = batter.get("ops", 0.700)
    iso  = batter.get("iso", 0.150)
    games = batter.get("games", 1) or 1

    # HR pace per 162 games
    hr_pace = (hr / games * 162) if games > 0 else 0
    hr_s    = min(100, hr_pace / 60 * 100)   # 60 HR = 100

    # OPS: 1.100 = 100, 0.600 = 0
    ops_s   = min(100, max(0, (ops - 0.600) / 0.500 * 100))

    # ISO: 0.300+ = 100, 0.100 = 0
    iso_s   = min(100, max(0, (iso - 0.100) / 0.200 * 100))

    season_composite = hr_s * 0.45 + ops_s * 0.30 + iso_s * 0.25

    savant_composite = None
    pid = batter.get("playerId")
    sv = savant_batters.get(str(pid), {}) if pid else {}
    if sv and _real(sv, "pa"):
        barrel_pct   = _real(sv, "barrel_pct")
        hard_hit_pct = _real(sv, "hard_hit_pct")
        exit_velo    = _real(sv, "exit_velo")
        pull_pct     = _real(sv, "pull_pct")
        fb_pct       = _real(sv, "fb_pct")
        xwoba        = _real(sv, "xwoba")

        parts = []
        if barrel_pct is not None:
            parts.append(min(100, max(0, barrel_pct / 20.0 * 100)))
        if hard_hit_pct is not None:
            parts.append(min(100, max(0, hard_hit_pct / 55.0 * 100)))
        if exit_velo is not None:
            parts.append(min(100, max(0, (exit_velo - 85.0) / 10.0 * 100)))
        if pull_pct is not None and fb_pct is not None:
            # Pulled fly balls are the HR-optimized batted-ball profile --
            # needs both a high pull rate AND a high fly-ball rate.
            parts.append(min(100, (pull_pct / 100.0) * (fb_pct / 100.0) * 400.0))
        if xwoba is not None:
            parts.append(min(100, max(0, (xwoba - 0.250) / 0.200 * 100)))
        if parts:
            savant_composite = sum(parts) / len(parts)

    if savant_composite is not None:
        return round(savant_composite * 0.55 + season_composite * 0.45, 1)
    return round(season_composite, 1)


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
    if w.get("roof") is not False:
        # Closed dome, or roof state/wind genuinely unknown -- don't claim a
        # wind boost we can't confirm.
        return None
    wind = w.get("wind_mph")
    if wind is None:
        return None
    if wind >= 10 and classify_wind(w.get("wind_dir")) == "out":
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

    p_score = score_pitcher_disaster(p_stats, opp_pid)
    pk_score = score_park_and_weather(venue)

    for batter in batters:
        b_score    = score_batter_power(batter)
        composite  = round(p_score * 0.40 + pk_score * 0.30 + b_score * 0.30, 1)

        # Real Savant metrics actually used in scoring above (None if this
        # player has no real Savant sample) -- surfaced for transparency,
        # not re-derived here.
        bsv = savant_batters.get(str(batter.get("playerId")), {})
        psv = savant_pitchers.get(str(opp_pid), {}) if opp_pid else {}
        batter_savant = {
            "barrel_pct":   _real(bsv, "barrel_pct"),
            "hard_hit_pct": _real(bsv, "hard_hit_pct"),
            "exit_velo":    _real(bsv, "exit_velo"),
            "xwoba":        _real(bsv, "xwoba"),
        } if bsv else None
        pitcher_savant = {
            "barrel_pct":   _real(psv, "barrel_pct"),
            "hard_hit_pct": _real(psv, "hard_hit_pct"),
            "xwoba":        _real(psv, "xwoba"),
        } if psv else None

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
        if batter_savant and (batter_savant.get("barrel_pct") or 0) >= 12:
            tags.append("🎯 Elite Barrel%")
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
            "pitcherSavant":  pitcher_savant,
            "batterSavant":   batter_savant,
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
    # Track current tier counts so we don't exceed the validated maximums
    _b_count = sum(1 for fp in final_players if fp["tier"] == "B")
    _c_count = sum(1 for fp in final_players if fp["tier"] == "C")
    for p in scored:  # scored is sorted desc by compositeScore
        if len(final_players) >= 50:
            break
        if p["playerId"] not in used_pids:
            if p["compositeScore"] >= 55:
                p["tier"] = "A"
            elif p["compositeScore"] >= 40 and _b_count < 20:
                p["tier"] = "B"
                _b_count += 1
            else:
                p["tier"] = "C"
                _c_count += 1
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
