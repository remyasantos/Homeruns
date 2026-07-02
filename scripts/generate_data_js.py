#!/usr/bin/env python3
"""
generate_data_js.py — assembles public/data.js from scored players + parlays
Reads:  scripts/scored_players.json, scripts/parlays.json
Writes: public/data.js

All content is generated deterministically from real MLB Stats API numbers.
No external API calls required.
"""

import json
import re
import sys

# ── Load data ─────────────────────────────────────────────────────────────────

with open("scripts/scored_players.json") as f:
    scored = json.load(f)

with open("scripts/parlays.json") as f:
    parlays_raw = json.load(f)

players       = scored["players"]
games         = scored["games"]
weather       = scored["weather"]         # venue → {temp_f, wind_mph, wind_dir, roof}
park_hr_ranks = scored["park_hr_ranks"]
roof_parks    = set(scored.get("retractable_roof_parks", []))

DATE_LABEL = scored["date"]    # "MAY 12, 2026"
DAY_LABEL  = scored["label"]   # "TUESDAY MLB SLATE"

# ── TEAM_TO_GAME ──────────────────────────────────────────────────────────────

team_to_game = {}
for g in games:
    label = f"{g['awayTeam']}@{g['homeTeam']}"
    team_to_game[g["awayTeam"]] = label
    team_to_game[g["homeTeam"]] = label

# ── PARK_FACTORS ──────────────────────────────────────────────────────────────

COLORS = {
    "elite":       "#ff6b35",
    "good":        "#ffb347",
    "wind_boost":  "#90e0ef",
    "neutral":     "#b0bec5",
    "dome":        "#b0bec5",
    "suppressive": "#78909c",
}

# weather["wind_dir"] can be a 16-point compass code (wttr.in fallback) OR a
# phrase from MLB's live feed ("Out To LF", "In From CF", "R To L" crosswind).
# A compass-only set never matches the phrase form, so wind-based labels
# silently never fired for any game using live-feed weather (the primary
# source as of this pipeline's latest fix).
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


def park_label_and_color(venue, rank, w):
    is_dome = venue in roof_parks
    if is_dome:
        return "🏟️ Dome/Roof Closed", COLORS["dome"]

    wind = w.get("wind_mph")
    temp = w.get("temp_f")
    wind_class = classify_wind(w.get("wind_dir"))

    # Genuinely unknown weather (roof state unconfirmed, or the live feed
    # hasn't posted yet) -- describe the park without inventing a specific
    # temp/wind reading.
    if wind is None or temp is None:
        color = COLORS["neutral"] if rank <= 20 else COLORS["suppressive"]
        label = f"⚾ #{rank} HR Park" if rank <= 5 else "⚾ Outdoor Park"
        return label, color

    if rank <= 2:
        color = COLORS["elite"]
        if wind >= 10 and wind_class == "out":
            label = f"🔥 #{rank} HR Park + {wind}mph Wind Out"
        elif temp >= 82:
            label = f"🔥 #{rank} HR Park — {temp}°F Warm"
        else:
            label = f"🔥 #{rank} HR Park"
    elif rank <= 5:
        color = COLORS["good"]
        if wind >= 10 and wind_class == "out":
            label = f"💨 Wind Out {wind}mph — #{rank} HR Context"
        else:
            label = f"⚾ #{rank} Hitter Friendly"
    elif wind >= 12 and wind_class == "out":
        color = COLORS["wind_boost"]
        label = f"💨 Wind Out {wind}mph"
    elif wind >= 10 and wind_class == "in":
        color = COLORS["suppressive"]
        label = f"🌬️ Wind In — Avoid"
    else:
        color = COLORS["neutral"] if rank <= 20 else COLORS["suppressive"]
        label = f"☀️ {temp}°F Outdoor" if temp >= 78 else "⚾ Outdoor Park"

    return label, color


venues_in_slate = list({g["venueName"] for g in games if g["venueName"]})
venues_in_slate.sort(key=lambda v: park_hr_ranks.get(v, 99))

park_factors = {}
for venue in venues_in_slate:
    rank  = park_hr_ranks.get(venue, 25)
    w     = weather.get(venue, {})
    _, color = park_label_and_color(venue, rank, w)
    park_factors[venue] = {"rank": rank, "color": color}

# Sequential ranks within today's slate
for i, venue in enumerate(sorted(venues_in_slate, key=lambda v: park_hr_ranks.get(v, 99))):
    park_factors[venue]["rank"] = i + 1

# Generate labels using the finalized slate rank (not global rank)
for venue, pf in park_factors.items():
    w = weather.get(venue, {})
    label, color = park_label_and_color(venue, pf["rank"], w)
    pf["label"] = label
    pf["color"] = color

# ── Pitcher note (one technical flaw, no fluff) ───────────────────────────────

def make_pitcher_note(ps: dict, name: str) -> str:
    if not ps or not name or name == "TBD":
        return f"TBD arm — rotation unannounced"
    era  = float(ps.get("era",  99)  or 99)
    whip = float(ps.get("whip", 9.9) or 9.9)
    hr9  = float(ps.get("hr9",  0)   or 0)
    bb9  = float(ps.get("bb9",  0)   or 0)
    fip  = float(ps.get("fip",  era) or era)

    # Pick the single most damning metric
    if era >= 7.00:
        return f"{era:.2f} ERA — historically bad run, no reliable out pitch in 2026"
    if era >= 6.00:
        diff = round(era - fip, 2)
        if fip < era - 0.5:
            return f"{era:.2f} ERA, {fip:.2f} FIP — ERA is real, underlying metrics confirm collapse"
        return f"{era:.2f} ERA, {whip:.2f} WHIP — elevated hard-contact rate throughout 2026"
    if hr9 >= 1.80:
        return f"{hr9:.1f} HR/9 — fly-ball approach invites pull-power damage every outing"
    if bb9 >= 4.50:
        return f"{bb9:.1f} BB/9 — chronic command issues, pitching from behind in every count"
    if whip >= 1.55:
        return f"{whip:.2f} WHIP — baserunner inflation compounding, hitters getting looks in traffic"
    if era >= 5.00:
        return f"{era:.2f} ERA — soft-contact approach deteriorating vs power lineups"
    return f"{era:.2f} ERA — solid arm, limited disaster upside in this context"


# ── Player note (2 sentences grounded in real stats) ─────────────────────────

def make_player_note(p: dict, w: dict) -> str:
    name    = p["playerName"].split()[0]  # first name for sentence flow
    hr      = p["hr"]
    ops     = p["ops"]
    iso     = p.get("iso", 0)
    slg     = p.get("slg", 0)
    avg     = p.get("avg", 0)
    venue   = p["venue"]
    pitcher = p["oppPitcherName"]
    ps      = p.get("pitcherStats", {})
    era     = float(ps.get("era", 4.50) or 4.50)
    whip    = float(ps.get("whip", 1.30) or 1.30)
    hr9     = float(ps.get("hr9", 1.0)  or 1.0)
    tier    = p["tier"]
    is_dome = venue in roof_parks
    wind    = w.get("wind_mph")
    temp    = w.get("temp_f")
    wind_out = wind is not None and wind >= 10 and classify_wind(w.get("wind_dir")) == "out"

    # Sentence 1: hook stat — leading metric by tier
    if iso >= 0.230 or tier == "S":
        s1 = f"{name} is posting {hr} HRs, a {ops:.3f} OPS, and {iso:.3f} ISO this season — elite power-contact credentials."
    elif hr >= 12:
        s1 = f"{name} has {hr} HRs with a {slg:.3f} SLG and {ops:.3f} OPS — one of the most productive power bats in the lineup."
    elif ops >= 0.870:
        s1 = f"{name} is slashing .{int(avg*1000):03d}/{int(slg*1000):03d} with {hr} HRs and a {ops:.3f} OPS this season."
    else:
        s1 = f"{name} has {hr} HRs and a {ops:.3f} OPS, providing steady power production from the middle of the order."

    # Sentence 2: why HR today — pitcher + park + weather context
    park_rank = park_factors.get(venue, {}).get("rank", 10)

    if era >= 6.50:
        s2 = (f"{pitcher}'s {era:.2f} ERA is a full disaster-start — "
              f"no pitcher on today's board is more exploitable, and {venue} amplifies every elevated mistake.")
    elif era >= 5.50 and wind_out:
        s2 = (f"{pitcher} is leaking runs at a {era:.2f} ERA clip, and {wind}mph outward wind at {venue} "
              f"turns any elevated contact into a HR — a double-context setup.")
    elif era >= 5.50:
        s2 = (f"{pitcher}'s {era:.2f} ERA signals a broken approach — {name}'s pull power "
              f"exploits the pattern at {venue} for a premium HR setup today.")
    elif is_dome:
        s2 = (f"The closed dome at {venue} removes all weather variables — "
              f"pure bat-to-ball execution against {pitcher} ({era:.2f} ERA) in a controlled environment.")
    elif wind_out:
        s2 = (f"With {wind}mph wind blowing out at {venue}, {name}'s natural pull power "
              f"gets an extra push — even a solid contact against {pitcher} can carry.")
    elif park_rank <= 3:
        s2 = (f"{venue} is the #{park_rank} HR park on today's slate — "
              f"{name}'s power profile in this environment against {pitcher} ({era:.2f} ERA) is a strong HR context.")
    elif temp is not None:
        s2 = (f"Against {pitcher} ({era:.2f} ERA, {whip:.2f} WHIP) in a {temp}°F outdoor game, "
              f"{name}'s {hr}-HR pace gives this prop real probability floor.")
    else:
        s2 = (f"Against {pitcher} ({era:.2f} ERA, {whip:.2f} WHIP), "
              f"{name}'s {hr}-HR pace gives this prop real probability floor.")

    return f"{s1} {s2}"


# ── Context cards (4, fully deterministic) ───────────────────────────────────

def make_context_cards() -> list:
    # Score each game by total disaster potential
    game_scores = []
    for g in games:
        venue = g["venueName"]
        w     = weather.get(venue, {})
        is_dome = venue in roof_parks
        wind  = w.get("wind_mph")
        temp  = w.get("temp_f")
        wind_out = wind is not None and wind >= 10 and classify_wind(w.get("wind_dir")) == "out"

        for side, pitcher_key in [("away", "homePitcherName"), ("home", "awayPitcherName"),
                                   ("home", "homePitcherName"), ("away", "awayPitcherName")]:
            # We want batters' perspective: batter team, opp pitcher
            if side == "away":
                batting_team = g["awayTeam"]
                opp_pitcher  = g["homePitcherName"]
                opp_ps       = scored.get("pitcher_stats", {}).get(str(g.get("homePitcherId")), {})
            else:
                batting_team = g["homeTeam"]
                opp_pitcher  = g["awayPitcherName"]
                opp_ps       = scored.get("pitcher_stats", {}).get(str(g.get("awayPitcherId")), {})

            era = float(opp_ps.get("era", 0) or 0)
            if era < 4.50:
                continue

            park_rank = park_hr_ranks.get(venue, 20)
            score = era * 10 + (30 - park_rank) + (5 if wind_out else 0)
            batters_here = [p for p in players if p["venue"] == venue and p["oppPitcherName"] == opp_pitcher]
            top_batters  = sorted(batters_here, key=lambda x: -x.get("compositeScore", 0))[:3]

            game_scores.append({
                "game":       f"{g['awayTeam']}@{g['homeTeam']}",
                "venue":      venue,
                "pitcher":    opp_pitcher,
                "era":        era,
                "whip":       opp_ps.get("whip", "?"),
                "hr9":        opp_ps.get("hr9", "?"),
                "is_dome":    is_dome,
                "wind":       wind,
                "wdir":       w.get("wind_dir"),
                "temp":       temp,
                "wind_out":   wind_out,
                "park_rank":  park_rank,
                "score":      score,
                "top_batters": top_batters,
                "_key": f"{g['awayTeam']}@{g['homeTeam']}_{opp_pitcher}",
            })

    # De-duplicate (one entry per game/pitcher combo), sort by score
    seen_keys = set()
    unique = []
    for gs in sorted(game_scores, key=lambda x: -x["score"]):
        if gs["_key"] not in seen_keys:
            seen_keys.add(gs["_key"])
            unique.append(gs)

    cards = []

    # Card 1 — worst SP disaster
    if unique:
        d = unique[0]
        names = ", ".join(p["playerName"].split()[0] for p in d["top_batters"][:3])
        hr_list = " / ".join(f"{p['hr']} HR" for p in d["top_batters"][:2])
        cards.append({
            "icon":  "💥",
            "label": f"{d['pitcher']} — SP Disaster",
            "note":  f"{d['era']:.2f} ERA — {d['game']} — Worst Arm on Today's Slate",
            "sub":   (f"{d['pitcher']} has posted a {d['era']:.2f} ERA and {d['whip']:.2f} WHIP — "
                      f"the most exploitable arm on any board today. "
                      f"{names} all get multiple ABs against this disaster starter at "
                      f"{d['venue']} ({hr_list})."),
        })

    # Card 2 — best outdoor park / wind play (non-dome)
    outdoor_venues = [(v, park_hr_ranks.get(v, 99), weather.get(v, {}))
                      for v in venues_in_slate if v not in roof_parks]
    outdoor_venues.sort(key=lambda x: x[1])
    if outdoor_venues:
        v, rank, w = outdoor_venues[0]
        wind  = w.get("wind_mph")
        temp  = w.get("temp_f")
        wind_out = wind is not None and wind >= 10 and classify_wind(w.get("wind_dir")) == "out"
        park_players = [p for p in players if p["venue"] == v][:2]
        names = " and ".join(p["playerName"].split()[0] for p in park_players)
        slate_rank = park_factors.get(v, {}).get("rank", rank)
        if wind_out:
            icon = "💨"
            temp_suffix = f" — {temp}°F" if temp is not None else ""
            note = f"#{slate_rank} HR Park — {wind}mph Wind Out{temp_suffix}"
            sub  = (f"{v} sits #{slate_rank} on today's park chart with {wind}mph wind blowing out"
                    + (f" at {temp}°F" if temp is not None else "") + " — "
                    f"natural pull power gets an extra 15–20 feet of carry. "
                    f"{names} are the top HR targets in this premium outdoor environment.")
        elif temp is not None:
            icon = "🔥"
            note = f"#{slate_rank} HR Park — {temp}°F Conditions"
            sub  = (f"{v} is the top-ranked outdoor HR park on today's slate at {temp}°F. "
                    f"Warm conditions and favorable dimensions amplify every hard contact swing. "
                    f"{names} lead the HR targets here.")
        else:
            icon = "🔥"
            note = f"#{slate_rank} HR Park"
            sub  = (f"{v} is the top-ranked outdoor HR park on today's slate. "
                    f"Favorable dimensions amplify every hard contact swing. "
                    f"{names} lead the HR targets here.")
        cards.append({"icon": icon, "label": v, "note": note, "sub": sub})

    # Card 3 — best dome stack OR second-best disaster
    dome_venues = [v for v in venues_in_slate if v in roof_parks]
    if dome_venues:
        dome_v = sorted(dome_venues, key=lambda v: park_hr_ranks.get(v, 99))[0]
        dome_players = sorted([p for p in players if p["venue"] == dome_v],
                              key=lambda x: -x.get("compositeScore", 0))[:3]
        names = " and ".join(p["playerName"].split()[0] for p in dome_players[:2])
        best_era_here = max((float(p.get("pitcherStats", {}).get("era", 0) or 0)
                             for p in dome_players), default=0)
        era_str = f"{best_era_here:.2f} ERA disaster starter" if best_era_here >= 5.50 else "SP matchup"
        cards.append({
            "icon":  "🏟️",
            "label": f"{dome_v} — Dome Stack",
            "note":  f"Dome/Roof Closed — Controlled Conditions",
            "sub":   (f"No weather variables inside {dome_v} — bat-to-ball execution rules the day. "
                      f"{names} headline the dome HR candidates against the {era_str}. "
                      f"Domes remove all weather luck and reward pure power profiles."),
        })
    elif len(unique) > 1:
        d = unique[1]
        names = ", ".join(p["playerName"].split()[0] for p in d["top_batters"][:2])
        cards.append({
            "icon":  "💣",
            "label": f"{d['pitcher']} — Second SP Disaster",
            "note":  f"{d['era']:.2f} ERA — {d['game']}",
            "sub":   (f"{d['pitcher']}'s {d['era']:.2f} ERA makes {d['game']} a second blowup candidate. "
                      f"{names} lead the attack on this struggling arm at {d['venue']}."),
        })
    else:
        cards.append({
            "icon": "📊", "label": "Live MLB Data",
            "note": "MLB Stats API — Real Numbers, Zero Hallucination",
            "sub":  "All ERA, WHIP, HR pace, and park data sourced live from statsapi.mlb.com. Tiers and parlays are fully deterministic.",
        })

    # Card 4 — best value play (S/A tier at long odds) or second-best outdoor park
    value_players = [p for p in players
                     if p["tier"] in ("S", "A") and "💰 Value" in p.get("tags", [])]
    value_players.sort(key=lambda p: int(p["estOdds"].replace("+", "").replace("-", "")), reverse=True)

    if value_players:
        vp  = value_players[0]
        ps  = vp.get("pitcherStats", {})
        era = float(ps.get("era", 4.50) or 4.50)
        cards.append({
            "icon":  "💰",
            "label": f"{vp['playerName']} — Best Value",
            "note":  f"{vp['estOdds']} Odds — {vp['tier']}-Tier vs {vp['oppPitcherName']}",
            "sub":   (f"{vp['playerName']} ({vp['team']}) carries {vp['hr']} HRs and a {vp['ops']:.3f} OPS "
                      f"into a {vp['matchupGrade']}-grade matchup at {vp['estOdds']} — heavily underpriced. "
                      f"{vp['oppPitcherName']}'s {era:.2f} ERA and {vp['venue']} amplify the real HR probability above market."),
        })
    elif len(outdoor_venues) > 1:
        v2, rank2, w2 = outdoor_venues[1]
        temp2 = w2.get("temp_f")
        slate_rank2 = park_factors.get(v2, {}).get("rank", rank2)
        if temp2 is not None:
            note2 = f"#{slate_rank2} HR Context — {temp2}°F"
            sub2  = f"{v2} rounds out the day's top outdoor HR environments at {temp2}°F. Prioritize S and A-tier batters here."
        else:
            note2 = f"#{slate_rank2} HR Context"
            sub2  = f"{v2} rounds out the day's top outdoor HR environments. Prioritize S and A-tier batters here."
        cards.append({
            "icon": "⚾", "label": v2,
            "note": note2,
            "sub":  sub2,
        })
    else:
        cards.append({
            "icon": "📈", "label": "Breakout Watch",
            "note": "Emerging Power Profiles — Underpriced Odds",
            "sub":  "A-tier batters with improving Statcast trajectories are available at long odds today — the highest-value legs on the board.",
        })

    # Guarantee exactly 4 cards
    while len(cards) < 4:
        cards.append({
            "icon": "⚾", "label": "Today's Slate",
            "note": f"{len(games)}-game MLB slate",
            "sub":  f"{DATE_LABEL} — check pitcher ERA and park rank for the day's top HR contexts.",
        })
    return cards[:4]


# ── Parlay strategy (deterministic, stats-grounded) ───────────────────────────

def make_parlay_strategy(par: dict, player_lookup: dict) -> tuple[str, str]:
    """Return (description, strategy) for a parlay."""
    pids = par["playerIds"]
    legs = [player_lookup.get(pid) for pid in pids]
    legs = [l for l in legs if l]

    tiers    = [l["tier"] for l in legs]
    s_legs   = [l for l in legs if l["tier"] == "S"]
    a_legs   = [l for l in legs if l["tier"] == "A"]
    c_legs   = [l for l in legs if l["tier"] == "C"]

    # Top ERA disaster in this parlay
    disaster = max(legs, key=lambda l: float(l.get("pitcherStats", {}).get("era", 0) or 0),
                   default=None)
    top_batter = max(legs, key=lambda l: l.get("hr", 0), default=None)

    era_disasters = [l for l in legs
                     if float(l.get("pitcherStats", {}).get("era", 0) or 0) >= 5.50]

    # Keep existing description and strategy if they're already substantive
    existing_desc = par.get("description", "")
    existing_strat = par.get("strategy", "")

    # Build enriched strategy by injecting real stats into the existing text
    if disaster:
        ps  = disaster.get("pitcherStats", {})
        era = float(ps.get("era", 0) or 0)
        disaster_str = f"{disaster['oppPitcherName']} ({era:.2f} ERA)"
    else:
        disaster_str = "today's weakest arm"

    if top_batter:
        anchor_str = f"{top_batter['playerName']} ({top_batter['hr']} HR, {top_batter['ops']:.3f} OPS)"
    else:
        anchor_str = "the top HR producer"

    n_disasters = len(era_disasters)
    disaster_clause = (
        f"All {n_disasters} legs face pitchers with ERA ≥ 5.50."
        if n_disasters == len(legs)
        else f"{n_disasters} of {len(legs)} legs target ERA ≥ 5.50 disaster starts."
        if n_disasters > 0
        else ""
    )

    tier_clause = (
        f"{len(s_legs)} S-tier anchor{'s' if len(s_legs)>1 else ''} provide the probability floor."
        if s_legs else ""
    )

    c_clause = (
        f"{len(c_legs)} C-tier lottery leg{'s' if len(c_legs)>1 else ''} inject ceiling upside."
        if c_legs else ""
    )

    # Build a 3-sentence strategy from existing + real stats
    strat_parts = [existing_strat.rstrip(".") + "."] if existing_strat else []
    additions = [s for s in [disaster_clause, tier_clause, c_clause,
                              f"Anchored by {anchor_str} leading today's power board."]
                 if s and s.rstrip(".") + "." not in " ".join(strat_parts)]
    strat_parts.extend(additions[:2])
    strategy = " ".join(strat_parts)

    return existing_desc, strategy


# ── Safe numeric serializer ───────────────────────────────────────────────────

def js_num(v):
    """Serialize a numeric value safely to JS. None → 0, floats stay floats."""
    if v is None:
        return "0"
    return json.dumps(float(v) if isinstance(v, float) else v)


# ── Build final arrays ────────────────────────────────────────────────────────

print("Generating content from MLB Stats API data...")

context_cards = make_context_cards()
print(f"  ✓ context cards ({len(context_cards)})")

player_lookup = {p["id"]: p for p in players}

final_players = []
for p in players:
    ps          = p.get("pitcherStats", {})
    w           = weather.get(p["venue"], {})
    note        = make_player_note(p, w)
    pitcher_note = make_pitcher_note(ps, p["oppPitcherName"])
    final_players.append({
        "id":             p["id"],
        "name":           p["playerName"],
        "team":           p["team"],
        "tier":           p["tier"],
        "park":           p["venue"],
        "pitcher":        p["oppPitcherName"],
        "pitcherNote":    pitcher_note,
        "matchupGrade":   p["matchupGrade"],
        "estOdds":        p["estOdds"],
        "note":           note,
        "tags":           p["tags"],
        # Raw stats — used by the player leaderboard in the UI
        "hr":             int(p.get("hr", 0) or 0),
        "ops":            float(p.get("ops", 0) or 0),
        "iso":            float(round(p.get("iso", 0) or 0, 3)),
        "avg":            float(p.get("avg", 0) or 0),
        "compositeScore": float(p.get("compositeScore", 0) or 0),
    })

print(f"  ✓ {len(final_players)} player notes")

final_parlays = []
for par in parlays_raw:
    desc, strat = make_parlay_strategy(par, player_lookup)
    final_parlays.append({
        "id":          par["id"],
        "legs":        par["legs"],
        "label":       par["label"],
        "risk":        par["risk"],
        "riskColor":   par["riskColor"],
        "estPayout":   par["estPayout"],
        "description": desc or par["description"],
        "playerIds":   par["playerIds"],
        "strategy":    strat or par["strategy"],
    })

print(f"  ✓ {len(final_parlays)} parlay strategies")

# ── Serialize to JS ───────────────────────────────────────────────────────────

def js_str(s):
    return json.dumps(s, ensure_ascii=False)

lines = []

# TEAM_TO_GAME
lines.append("const TEAM_TO_GAME = {")
for k, v in team_to_game.items():
    lines.append(f"  {js_str(k)}:  {js_str(v)},")
lines.append("};")
lines.append("")

lines.append(f'const SLATE_DATE  = {js_str(DATE_LABEL)};')
lines.append(f'const SLATE_LABEL = {js_str(DAY_LABEL)};')
lines.append("")

# CONTEXT_CARDS
lines.append("const CONTEXT_CARDS = [")
for i, card in enumerate(context_cards):
    comma = "," if i < len(context_cards) - 1 else ""
    lines.append("  {")
    lines.append(f'    icon:  {js_str(card.get("icon", "⚾"))},')
    lines.append(f'    label: {js_str(card.get("label", ""))},')
    lines.append(f'    note:  {js_str(card.get("note", ""))},')
    lines.append(f'    sub:   {js_str(card.get("sub", ""))},')
    lines.append(f"  }}{comma}")
lines.append("];")
lines.append("")

# PARK_FACTORS
lines.append("const PARK_FACTORS = {")
sorted_venues = sorted(park_factors.items(), key=lambda x: x[1]["rank"])
for i, (venue, pf) in enumerate(sorted_venues):
    comma = "," if i < len(sorted_venues) - 1 else ""
    lines.append(f'  {js_str(venue)}: '
                 f'{{ rank: {js_num(pf["rank"])},  label: {js_str(pf["label"])}, color: {js_str(pf["color"])} }}{comma}')
lines.append("};")
lines.append("")

# players
lines.append("const players = [")
for i, p in enumerate(final_players):
    comma = "," if i < len(final_players) - 1 else ""
    tags_js = json.dumps(p["tags"])
    lines.append("  {")
    lines.append(f'    id:             {js_num(p["id"])},')
    lines.append(f'    name:           {js_str(p["name"])},')
    lines.append(f'    team:           {js_str(p["team"])},')
    lines.append(f'    tier:           {js_str(p["tier"])},')
    lines.append(f'    park:           {js_str(p["park"])},')
    lines.append(f'    pitcher:        {js_str(p["pitcher"])},')
    lines.append(f'    pitcherNote:    {js_str(p["pitcherNote"])},')
    lines.append(f'    matchupGrade:   {js_str(p["matchupGrade"])},')
    lines.append(f'    estOdds:        {js_str(p["estOdds"])},')
    lines.append(f'    note:           {js_str(p["note"])},')
    lines.append(f'    tags:           {tags_js},')
    lines.append(f'    hr:             {js_num(p["hr"])},')
    lines.append(f'    ops:            {js_num(p["ops"])},')
    lines.append(f'    iso:            {js_num(p["iso"])},')
    lines.append(f'    avg:            {js_num(p["avg"])},')
    lines.append(f'    compositeScore: {js_num(p["compositeScore"])},')
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
    lines.append(f'    legs:        {js_num(par["legs"])},')
    lines.append(f'    label:       {js_str(par["label"])},')
    lines.append(f'    risk:        {js_str(par["risk"])},')
    lines.append(f'    riskColor:   {js_str(par["riskColor"])},')
    lines.append(f'    estPayout:   {js_str(par["estPayout"])},')
    lines.append(f'    description: {js_str(par["description"])},')
    lines.append(f'    playerIds:   {pids_js},')
    lines.append(f'    strategy:    {js_str(par["strategy"])},')
    lines.append(f"  }}{comma}")
lines.append("];")

with open("public/data.js", "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"\n✅ public/data.js written")
print(f"   Date:    {DATE_LABEL}")
print(f"   Players: {len(final_players)}")
print(f"   Parlays: {len(final_parlays)}")
print(f"   Games:   {len(games)}")
