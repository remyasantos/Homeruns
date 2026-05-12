#!/usr/bin/env python3
"""
generate_data_js.py — assembles public/data.js from scored players + parlays
Reads:  scripts/scored_players.json, scripts/parlays.json
Writes: public/data.js

Hybrid approach:
  - All structured data (tiers, stats, park factors, parlays) is deterministic
  - Player notes, pitcher notes, parlay strategy, and context cards are
    written by Claude API, grounded in real MLB Stats API numbers
"""

import json
import os
import sys
import re
import time
import requests

# ── Load data ─────────────────────────────────────────────────────────────────

with open("scripts/scored_players.json") as f:
    scored = json.load(f)

with open("scripts/parlays.json") as f:
    parlays_raw = json.load(f)

players  = scored["players"]
games    = scored["games"]
weather  = scored["weather"]
park_hr_ranks = scored["park_hr_ranks"]
roof_parks    = set(scored.get("retractable_roof_parks", []))

DATE_LABEL = scored["date"]
DAY_LABEL  = scored["label"]

# ── Build TEAM_TO_GAME ────────────────────────────────────────────────────────

team_to_game = {}
for g in games:
    label = f"{g['awayTeam']}@{g['homeTeam']}"
    team_to_game[g["awayTeam"]] = label
    team_to_game[g["homeTeam"]] = label

# ── Build PARK_FACTORS ────────────────────────────────────────────────────────

COLORS = {
    "elite":       "#ff6b35",
    "good":        "#ffb347",
    "wind_boost":  "#90e0ef",
    "neutral":     "#b0bec5",
    "dome":        "#b0bec5",
    "suppressive": "#78909c",
}

def park_label_and_color(venue, rank, w):
    """Generate a park label and color based on rank and weather."""
    is_dome = venue in roof_parks
    if is_dome:
        color = COLORS["dome"]
        return f"🏟️ Dome/Roof Closed", color

    wind = w.get("wind_mph", 0) or 0
    temp = w.get("temp_f", 72) or 72
    wdir = (w.get("wind_dir", "") or "").upper()
    out_dirs = {"S", "SW", "SSW", "SSE", "SE", "W", "WSW", "WNW"}

    if rank <= 2:
        color = COLORS["elite"]
        if wind >= 10 and wdir in out_dirs:
            label = f"🔥 #{rank} HR Park + {wind}mph Wind Out"
        elif temp >= 82:
            label = f"🔥 #{rank} HR Park — {temp}°F Warm"
        else:
            label = f"🔥 #{rank} HR Park"
    elif rank <= 5:
        color = COLORS["good"]
        if wind >= 10 and wdir in out_dirs:
            label = f"💨 Wind Out {wind}mph — #{rank} HR Context"
        else:
            label = f"⚾ #{rank} Hitter Friendly"
    elif wind >= 12 and wdir in out_dirs:
        color = COLORS["wind_boost"]
        label = f"💨 Wind Out {wind}mph"
    elif wind >= 10 and wdir not in out_dirs and wdir != "":
        color = COLORS["suppressive"]
        label = f"🌬️ Wind In — Avoid"
    else:
        color = COLORS["neutral"] if rank <= 20 else COLORS["suppressive"]
        label = f"☀️ {temp}°F Outdoor" if temp >= 78 else f"⚾ Outdoor Park"

    return label, color


# Collect all venues in today's slate
venues_in_slate = list({g["venueName"] for g in games if g["venueName"]})
venues_in_slate.sort(key=lambda v: park_hr_ranks.get(v, 99))

park_factors = {}
for venue in venues_in_slate:
    rank = park_hr_ranks.get(venue, 25)
    w    = weather.get(venue, {})
    label, color = park_label_and_color(venue, rank, w)
    park_factors[venue] = {"rank": rank, "label": label, "color": color}

# Re-rank sequentially (1..N) based on sorted order
for i, venue in enumerate(sorted(venues_in_slate, key=lambda v: park_hr_ranks.get(v, 99))):
    park_factors[venue]["rank"] = i + 1

# ── Claude API helpers ────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

def claude(prompt, max_tokens=2000, system=None):
    """Call Claude API and return text response."""
    if not ANTHROPIC_API_KEY:
        raise RuntimeError("ANTHROPIC_API_KEY not set")

    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    body = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": max_tokens,
        "messages": [{"role": "user", "content": prompt}],
    }
    if system:
        body["system"] = system

    for attempt in range(3):
        try:
            r = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=body,
                timeout=60,
            )
            r.raise_for_status()
            return r.json()["content"][0]["text"]
        except Exception as e:
            if attempt < 2:
                time.sleep(5)
            else:
                raise e


SYSTEM_PROMPT = """You are an expert MLB sabermetrics analyst and sports betting writer for the Homeruns HR Parlay Board.
You write aggressive, betting-centric analysis grounded in real stats.

TONE: Expert, punchy, betting-centric.
USE: "disaster start", "bomb machine", "cooked", "Statcast darling", "regression due",
     "free real estate", "on fumes", "pure lottery", "meme leg", "moon shot",
     "underpriced", "blowup game"
AVOID: Passive language, hedging, generic commentary without a stat.

Always respond with ONLY the requested JSON — no markdown fences, no preamble."""


def write_player_notes_batch(player_batch):
    """Ask Claude to write notes + pitcherNote for a batch of players."""
    batch_info = []
    for p in player_batch:
        ps = p.get("pitcherStats", {})
        w  = p.get("weather", {})
        wind_info = ""
        if not w.get("roof") and w.get("wind_mph"):
            wind_info = f", wind {w['wind_mph']}mph {w.get('wind_dir','')}"
        if w.get("roof"):
            wind_info = ", DOME/ROOF CLOSED"

        batch_info.append({
            "id": p["id"],
            "name": p["playerName"],
            "team": p["team"],
            "tier": p["tier"],
            "hr": p["hr"],
            "ops": p["ops"],
            "iso": p["iso"],
            "avg": p["avg"],
            "slg": p["slg"],
            "park": p["venue"],
            "parkRank": park_factors.get(p["venue"], {}).get("rank", "?"),
            "pitcher": p["oppPitcherName"],
            "pitcherERA": ps.get("era", "?"),
            "pitcherWHIP": ps.get("whip", "?"),
            "pitcherHR9": ps.get("hr9", "?"),
            "pitcherBB9": ps.get("bb9", "?"),
            "pitcherFIP": ps.get("fip", "?"),
            "pitcherIP": ps.get("ip", "?"),
            "weather": wind_info.strip(", ") or "outdoor",
            "matchupGrade": p["matchupGrade"],
            "estOdds": p["estOdds"],
        })

    prompt = f"""Write player notes for these {len(batch_info)} MLB HR prop picks.

For each player return a JSON object with:
  "id": (integer, copy from input)
  "note": "EXACTLY 2 sentences. Sentence 1 = hook stat (HR count, OPS, ISO, barrel%). Sentence 2 = why HR today (park + pitcher + context)."
  "pitcherNote": "ONE technical flaw only — ERA vs FIP gap, velo decline, HR/9 rate, WHIP, BB/9. No fluff."

Players:
{json.dumps(batch_info, indent=2)}

Return a JSON array of objects with exactly these fields: id, note, pitcherNote.
No markdown, no preamble. Pure JSON array only."""

    text = claude(prompt, max_tokens=3000, system=SYSTEM_PROMPT)
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"```[a-z]*\n?", "", text).strip().rstrip("`").strip()
    return json.loads(text)


def write_context_cards(top_players, all_games):
    """Ask Claude to write 4 context cards."""
    # Find top 4 storylines: top pitcher disasters + best park contexts
    disaster_games = []
    for g in all_games:
        for side in ["away", "home"]:
            pid_key = f"{'home' if side == 'away' else 'away'}PitcherId"
            pname   = g[f"{'home' if side == 'away' else 'away'}PitcherName"]
            ps      = scored.get("pitcher_stats", {}).get(str(g.get(pid_key)), {}) if "pitcher_stats" in scored else {}
            era     = ps.get("era", 0)
            if era >= 5.0:
                venue = g["venueName"]
                w = weather.get(venue, {})
                disaster_games.append({
                    "game":    f"{g['awayTeam']}@{g['homeTeam']}",
                    "pitcher": pname,
                    "era":     era,
                    "whip":    ps.get("whip", "?"),
                    "venue":   venue,
                    "parkRank": park_factors.get(venue, {}).get("rank", "?"),
                    "weather": f"{w.get('temp_f','?')}°F {w.get('wind_mph','?')}mph {w.get('wind_dir','')}"
                                if not w.get("roof") else "DOME/ROOF CLOSED",
                    "topBatters": [
                        {"name": p["playerName"], "hr": p["hr"], "ops": p["ops"], "tier": p["tier"]}
                        for p in top_players if p["venue"] == venue
                    ][:3],
                })

    disaster_games.sort(key=lambda x: -(x["era"] or 0))
    top_contexts = disaster_games[:6]

    # Best park factor
    best_parks = sorted(venues_in_slate, key=lambda v: park_hr_ranks.get(v, 99))[:4]
    park_context = [
        {
            "venue": v,
            "rank": park_hr_ranks.get(v, "?"),
            "weather": (lambda w: f"{w.get('temp_f','?')}°F {w.get('wind_mph','?')}mph {w.get('wind_dir','')}"
                        if not w.get("roof") else "DOME/ROOF CLOSED")(weather.get(v, {})),
            "topBatters": [
                {"name": p["playerName"], "hr": p["hr"], "ops": p["ops"], "tier": p["tier"]}
                for p in top_players if p["venue"] == v
            ][:3],
        }
        for v in best_parks
    ]

    prompt = f"""Write exactly 4 CONTEXT_CARDS for today's MLB HR Parlay Board.

Today: {DATE_LABEL}

Top pitcher disasters today:
{json.dumps(top_contexts, indent=2)}

Top park HR contexts:
{json.dumps(park_context, indent=2)}

Each card must have:
  "icon": single emoji
  "label": stadium name or story name
  "note": one-line headline (park rank, ERA, wind speed, etc.)
  "sub": 2-3 sentences of betting-centric context (matchup + why it matters for HR props)

Pick the 4 most compelling stories. Mix pitcher disasters and park/weather angles.
Do NOT claim wind boost for a dome/roof closed game.

Return a JSON array of exactly 4 card objects. No markdown, no preamble."""

    text = claude(prompt, max_tokens=1200, system=SYSTEM_PROMPT)
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"```[a-z]*\n?", "", text).strip().rstrip("`").strip()
    return json.loads(text)


def write_parlay_strategies(parlays_list, player_lookup):
    """Ask Claude to rewrite parlay strategy fields with real stats."""
    parlay_info = []
    for par in parlays_list:
        legs_info = []
        for pid in par["playerIds"]:
            p = player_lookup.get(pid)
            if p:
                legs_info.append({
                    "name": p["playerName"],
                    "tier": p["tier"],
                    "hr":   p["hr"],
                    "ops":  p["ops"],
                    "pitcher": p["oppPitcherName"],
                    "pitcherERA": p.get("pitcherStats", {}).get("era", "?"),
                    "park": p["venue"],
                    "estOdds": p["estOdds"],
                })
        parlay_info.append({
            "id":    par["id"],
            "label": par["label"],
            "legs":  par["legs"],
            "description": par["description"],
            "players": legs_info,
        })

    prompt = f"""Rewrite the strategy field for each of these {len(parlay_info)} MLB HR parlays.

Each strategy must be 3–6 punchy, betting-centric sentences that explain:
1. Why these specific legs work together
2. The key stats driving confidence (ERA, HR count, park rank)
3. The overall construction logic

Use actual stats from the player data provided. Be specific — name pitchers and ERA numbers.

Parlays:
{json.dumps(parlay_info, indent=2)}

Return a JSON array where each object has:
  "id": (string, copy from input)
  "strategy": (string, 3-6 sentences)
  "description": (string, 1 sentence overview — keep punchy, can improve on original)

No markdown, no preamble. Pure JSON array only."""

    text = claude(prompt, max_tokens=3000, system=SYSTEM_PROMPT)
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"```[a-z]*\n?", "", text).strip().rstrip("`").strip()
    return json.loads(text)


# ── Generate AI content ───────────────────────────────────────────────────────

print("Generating AI content...")

# Player notes in batches of 10
player_notes = {}
batch_size = 10
for i in range(0, len(players), batch_size):
    batch = players[i:i + batch_size]
    print(f"  → player notes batch {i//batch_size + 1}/{(len(players)-1)//batch_size + 1}...")
    try:
        results = write_player_notes_batch(batch)
        for r in results:
            player_notes[r["id"]] = r
        time.sleep(1)  # rate limit courtesy
    except Exception as e:
        print(f"  ⚠ batch failed: {e} — using fallback notes")
        for p in batch:
            ps = p.get("pitcherStats", {})
            player_notes[p["id"]] = {
                "id": p["id"],
                "note": (
                    f"{p['playerName']} has {p['hr']} HR with a {p['ops']} OPS and {p['iso']:.3f} ISO this season. "
                    f"Facing {p['oppPitcherName']} (ERA {ps.get('era','?')}) at {p['venue']} — a strong HR context."
                ),
                "pitcherNote": (
                    f"ERA {ps.get('era','?')}, WHIP {ps.get('whip','?')}, HR/9 {ps.get('hr9','?')}"
                    if ps else "TBD arm — limited sample"
                ),
            }

print("  → context cards...")
try:
    context_cards = write_context_cards(players[:20], games)
except Exception as e:
    print(f"  ⚠ context cards failed: {e} — using fallback")
    context_cards = [
        {"icon": "⚾", "label": "Today's Slate", "note": f"{len(games)}-game MLB slate",
         "sub": f"{DATE_LABEL} slate loaded. Check pitcher ERA and park factors for top HR contexts."},
        {"icon": "🏟️", "label": venues_in_slate[0] if venues_in_slate else "TBD",
         "note": "#1 HR Park Today", "sub": "Top-ranked HR park on the slate — prioritize batters here."},
        {"icon": "💣", "label": "SP Disasters",
         "note": "Multiple high-ERA arms starting today",
         "sub": "Several pitchers with ERA above 5.50 are starting — target their opposing lineups."},
        {"icon": "📊", "label": "Live Data", "note": "MLB Stats API powered",
         "sub": "All stats sourced live from statsapi.mlb.com — ERA, WHIP, HR pace updated daily."},
    ]

print("  → parlay strategies...")
player_lookup = {p["id"]: p for p in players}
try:
    parlay_ai = write_parlay_strategies(parlays_raw, player_lookup)
    parlay_strategy_map = {r["id"]: r for r in parlay_ai}
except Exception as e:
    print(f"  ⚠ parlay strategies failed: {e} — using original")
    parlay_strategy_map = {}

# ── Assemble final players array ──────────────────────────────────────────────

final_players = []
for p in players:
    ai = player_notes.get(p["id"], {})
    ps = p.get("pitcherStats", {})

    note = ai.get("note") or (
        f"{p['playerName']} is slashing with {p['hr']} HR, {p['ops']} OPS, and {p['iso']:.3f} ISO this season. "
        f"Facing {p['oppPitcherName']} at {p['venue']} — a favorable HR context today."
    )
    pitcher_note = ai.get("pitcherNote") or (
        f"ERA {ps.get('era','?')}, WHIP {ps.get('whip','?')}, HR/9 {ps.get('hr9','?')}"
        if ps else "TBD — unannounced arm"
    )

    final_players.append({
        "id":           p["id"],
        "name":         p["playerName"],
        "team":         p["team"],
        "tier":         p["tier"],
        "park":         p["venue"],
        "pitcher":      p["oppPitcherName"],
        "pitcherNote":  pitcher_note,
        "matchupGrade": p["matchupGrade"],
        "estOdds":      p["estOdds"],
        "note":         note,
        "tags":         p["tags"],
    })

# ── Assemble final parlays ────────────────────────────────────────────────────

final_parlays = []
for par in parlays_raw:
    ai = parlay_strategy_map.get(par["id"], {})
    final_parlays.append({
        "id":          par["id"],
        "legs":        par["legs"],
        "label":       par["label"],
        "risk":        par["risk"],
        "riskColor":   par["riskColor"],
        "estPayout":   par["estPayout"],
        "description": ai.get("description") or par["description"],
        "playerIds":   par["playerIds"],
        "strategy":    ai.get("strategy") or par["strategy"],
    })

# ── Serialize to JS ───────────────────────────────────────────────────────────

def js_str(s):
    return json.dumps(s)

def js_obj(d, indent=2):
    return json.dumps(d, indent=indent, ensure_ascii=False)


lines = []

# TEAM_TO_GAME
lines.append("const TEAM_TO_GAME = {")
items = list(team_to_game.items())
for i, (k, v) in enumerate(items):
    comma = "," if i < len(items) - 1 else ""
    lines.append(f"  {k}: {js_str(v)}{comma}")
lines.append("};")
lines.append("")

# SLATE_DATE / SLATE_LABEL
lines.append(f'const SLATE_DATE  = {js_str(DATE_LABEL)};')
lines.append(f'const SLATE_LABEL = {js_str(DAY_LABEL)};')
lines.append("")

# CONTEXT_CARDS
lines.append("const CONTEXT_CARDS = [")
for i, card in enumerate(context_cards):
    comma = "," if i < len(context_cards) - 1 else ""
    lines.append("  {")
    lines.append(f'    icon:  {js_str(card.get("icon","⚾"))},')
    lines.append(f'    label: {js_str(card.get("label",""))},')
    lines.append(f'    note:  {js_str(card.get("note",""))},')
    lines.append(f'    sub:   {js_str(card.get("sub",""))},')
    lines.append(f"  }}{comma}")
lines.append("];")
lines.append("")

# PARK_FACTORS
lines.append("const PARK_FACTORS = {")
sorted_venues = sorted(park_factors.items(), key=lambda x: x[1]["rank"])
for i, (venue, pf) in enumerate(sorted_venues):
    comma = "," if i < len(sorted_venues) - 1 else ""
    lines.append(f'  {js_str(venue)}: '
                 f'{{ rank: {pf["rank"]},  label: {js_str(pf["label"])}, color: {js_str(pf["color"])} }}{comma}')
lines.append("};")
lines.append("")

# players
lines.append("const players = [")
for i, p in enumerate(final_players):
    comma = "," if i < len(final_players) - 1 else ""
    tags_js = json.dumps(p["tags"])
    lines.append("  {")
    lines.append(f'    id:            {p["id"]},')
    lines.append(f'    name:          {js_str(p["name"])},')
    lines.append(f'    team:          {js_str(p["team"])},')
    lines.append(f'    tier:          {js_str(p["tier"])},')
    lines.append(f'    park:          {js_str(p["park"])},')
    lines.append(f'    pitcher:       {js_str(p["pitcher"])},')
    lines.append(f'    pitcherNote:   {js_str(p["pitcherNote"])},')
    lines.append(f'    matchupGrade:  {js_str(p["matchupGrade"])},')
    lines.append(f'    estOdds:       {js_str(p["estOdds"])},')
    lines.append(f'    note:          {js_str(p["note"])},')
    lines.append(f'    tags:          {tags_js},')
    lines.append(f"  }}{comma}")
lines.append("];")
lines.append("")

# parlays
lines.append("const parlays = [")
for i, par in enumerate(final_parlays):
    comma = "," if i < len(final_parlays) - 1 else ""
    pids_js = json.dumps(par["playerIds"])
    lines.append("  {")
    lines.append(f'    id:          {js_str(par["id"])},')
    lines.append(f'    legs:        {par["legs"]},')
    lines.append(f'    label:       {js_str(par["label"])},')
    lines.append(f'    risk:        {js_str(par["risk"])},')
    lines.append(f'    riskColor:   {js_str(par["riskColor"])},')
    lines.append(f'    estPayout:   {js_str(par["estPayout"])},')
    lines.append(f'    description: {js_str(par["description"])},')
    lines.append(f'    playerIds:   {pids_js},')
    lines.append(f'    strategy:    {js_str(par["strategy"])},')
    lines.append(f"  }}{comma}")
lines.append("];")

output = "\n".join(lines)

with open("public/data.js", "w") as f:
    f.write(output)

print(f"\n✅ public/data.js written")
print(f"   Date:    {DATE_LABEL}")
print(f"   Players: {len(final_players)}")
print(f"   Parlays: {len(final_parlays)}")
print(f"   Games:   {len(games)}")
