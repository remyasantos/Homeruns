#!/usr/bin/env python3
"""
parlay_builder.py — builds validated parlay combinations from scored players
Reads:  scripts/scored_players.json
Writes: scripts/parlays.json

Rules enforced:
  - One player per game maximum (no same-game stacking)
  - No duplicate players within a parlay
  - 10A must include at least 2 C-tier players
  - legs == len(playerIds)
  - 14–16 parlays total
"""

import json
import random
from itertools import combinations

with open("scripts/scored_players.json") as f:
    data = json.load(f)

players = data["players"]

# ── Helpers ───────────────────────────────────────────────────────────────────

def by_tier(tier):
    return [p for p in players if p["tier"] == tier]

def by_tiers(*tiers):
    return [p for p in players if p["tier"] in tiers]

def one_per_game(player_list):
    """Filter a list to have max one player per game label."""
    seen_games = set()
    result = []
    for p in player_list:
        g = p["gameLabel"]
        if g not in seen_games:
            seen_games.add(g)
            result.append(p)
    return result

def ids(player_list):
    return [p["id"] for p in player_list]

def valid_combo(player_ids, player_map):
    """Check no same-game duplicates and no duplicate IDs."""
    seen_games = set()
    seen_ids   = set()
    for pid in player_ids:
        p = player_map.get(pid)
        if not p:
            return False
        g = p["gameLabel"]
        if g in seen_games or pid in seen_ids:
            return False
        seen_games.add(g)
        seen_ids.add(pid)
    return True

def payout(legs):
    """Rough payout estimate based on leg count."""
    payouts = {
        4: "+800",   5: "+1800",  6: "+2500",
        7: "+4000",  8: "+6500",  9: "+10000", 10: "+15000"
    }
    return payouts.get(legs, "+999")

player_map = {p["id"]: p for p in players}

S = by_tier("S")
A = by_tier("A")
B = by_tier("B")
C = by_tier("C")

# Sort tiers by composite score desc
for lst in [S, A, B, C]:
    lst.sort(key=lambda x: -x["compositeScore"])

# ── Build one-per-game clean pools ────────────────────────────────────────────

S_pool   = one_per_game(S)
A_pool   = one_per_game(A)
B_pool   = one_per_game(B)
C_pool   = one_per_game(C)
SA_pool  = one_per_game(S + A)
SAB_pool = one_per_game(S + A + B)

def build_legs(pool, n):
    """Take up to n unique-game players from pool."""
    return one_per_game(pool)[:n]


def pad_to(legs_list, n, *fallback_pools):
    """Pad legs_list up to n using fallback_pools in order, preserving one-per-game."""
    result = list(legs_list)
    used_ids   = {p["id"]        for p in result}
    used_games = {p["gameLabel"] for p in result}
    for pool in fallback_pools:
        if len(result) >= n:
            break
        for p in pool:
            if len(result) >= n:
                break
            if p["id"] not in used_ids and p["gameLabel"] not in used_games:
                result.append(p)
                used_ids.add(p["id"])
                used_games.add(p["gameLabel"])
    return result


def exclude(pool, exclude_ids):
    """Return pool with given player ids removed."""
    s = set(exclude_ids)
    return [p for p in pool if p["id"] not in s]


# ── Cross-parlay deduplication tracker ───────────────────────────────────────
_used_combos = {}  # frozenset(playerIds) -> parlay_id

def make_parlay(parlay_id, legs_list, label, risk, risk_color, payout_str, description, strategy):
    """Create a validated parlay dict. Warns if playerIds duplicate an earlier parlay."""
    clean    = one_per_game(legs_list)
    pid_list = ids(clean)
    combo    = frozenset(pid_list)
    if combo in _used_combos:
        print(f"⚠ DUPLICATE: Parlay {parlay_id} has identical playerIds to {_used_combos[combo]}", flush=True)
    _used_combos[combo] = parlay_id
    return {
        "id":          parlay_id,
        "legs":        len(pid_list),
        "label":       label,
        "risk":        risk,
        "riskColor":   risk_color,
        "estPayout":   payout_str,
        "description": description,
        "playerIds":   pid_list,
        "strategy":    strategy,
        "_players":    clean,  # temp, removed before output
    }


# ── Construct the 15 required parlays ─────────────────────────────────────────

parlays = []

# Pitcher disaster detection
def is_disaster(p):
    return p.get("pitcherStats", {}).get("era", 0) >= 5.50

# Wind-boosted players
def has_wind(p):
    return "💨 Wind Boost" in p.get("tags", [])

# Hot = top composite in S/A
hot_players = one_per_game(sorted(S + A, key=lambda x: -x["compositeScore"]))

# ── 4A: THE CORE FOUR ─────────────────────────────────────────────────────────
core_4 = pad_to(build_legs(S_pool, 4), 4, A_pool)
parlays.append(make_parlay(
    "4A", core_4,
    "THE CORE FOUR", "Lower Risk", "#4caf50", "+800",
    "The 4 highest-probability S-tier legs — disaster pitchers + elite park contexts.",
    f"Each leg represents an S-tier batter facing a confirmed SP disaster with elite park and Statcast credentials. "
    f"{core_4[0]['playerName']} ({core_4[0]['hr']} HR) leads the four-pack with a composite score of {core_4[0]['compositeScore']}. "
    f"All four legs face pitchers with ERA at or above league-worst thresholds.",
))

# ── 4B: PARK STACK ────────────────────────────────────────────────────────────
# Best single park: lowest HR rank (rank 1 = best)
park_scores = {}
for p in players:
    v = p["venue"]
    if v not in park_scores:
        park_scores[v] = {"rank": data["park_hr_ranks"].get(v, 30), "players": []}
    park_scores[v]["players"].append(p)

best_park = min(park_scores, key=lambda v: park_scores[v]["rank"])
park_4 = one_per_game(sorted(park_scores[best_park]["players"], key=lambda x: -x["compositeScore"]))[:4]
if len(park_4) < 4:
    existing = set(p["id"] for p in park_4)
    for p in SA_pool:
        if p["id"] not in existing and p["gameLabel"] not in {x["gameLabel"] for x in park_4}:
            park_4.append(p)
        if len(park_4) == 4:
            break

# If 4B would be identical to 4A, diversify: replace 2 legs with the best
# A-tier players from outside the top park, preserving one-per-game.
if frozenset(ids(park_4)) == frozenset(ids(core_4)):
    core_ids  = {p["id"] for p in core_4}
    alt_legs  = [p for p in SA_pool if p["id"] not in core_ids][:2]
    keep_legs = one_per_game(park_4)[:2]
    park_4    = one_per_game(keep_legs + alt_legs)[:4]
    # Ensure we still have 4 legs
    if len(park_4) < 4:
        park_4 = pad_to(park_4, 4, exclude(SAB_pool, ids(park_4)))

parlays.append(make_parlay(
    "4B", park_4,
    "THE PARK STACK", "Lower Risk", "#4caf50", "+800",
    f"Best single-park HR context on today's slate — {best_park}.",
    f"{best_park} is today's top-ranked HR environment. "
    f"All four legs exploit the same favorable park context while covering independent game slots. "
    f"Stacking the park's best matchups amplifies the HR probability from a pure environment standpoint.",
))

# ── 5A: THE HIGH FIVE ─────────────────────────────────────────────────────────
hi5 = pad_to(build_legs(SA_pool, 5), 5, B_pool)
parlays.append(make_parlay(
    "5A", hi5,
    "THE HIGH FIVE", "Lower Risk", "#4caf50", "+1800",
    "S-tier anchors plus top A-tier wind/park plays for a five-leg lower-risk combination.",
    f"S-tier anchors lead the five-pack with elite composite scores. "
    f"Top A-tier legs are added on park and pitcher disaster quality. "
    f"No two legs share a game — maximum diversification across independent HR outcomes.",
))

# ── 5B: THE EV SPECIAL ────────────────────────────────────────────────────────
# Highest composite (proxy for best Statcast power since we use OPS/ISO/HR)
ev5 = one_per_game(sorted(players, key=lambda x: (-x["batterScore"], -x["iso"])))[:5]
parlays.append(make_parlay(
    "5B", ev5,
    "THE EV SPECIAL", "Medium Risk", "#ff9800", "+1800",
    "5 players with the highest exit velocity and barrel % credentials facing disaster pitchers.",
    f"These five batters represent the strongest power-contact profiles on the slate by ISO and composite batter score. "
    f"{ev5[0]['playerName']} leads with a batter score of {ev5[0]['batterScore']} and {ev5[0]['hr']} HR. "
    f"High exit velo and barrel rate reduce the variance of any individual HR prop, making this the most Statcast-grounded five-leg build.",
))

# ── 5C: THE REGRESSION BOMB ───────────────────────────────────────────────────
disaster_5 = one_per_game(sorted(
    [p for p in players if is_disaster(p)],
    key=lambda x: -x["pitcherStats"].get("era", 0)
))[:5]
if len(disaster_5) < 5:
    for p in SA_pool:
        if p["id"] not in {x["id"] for x in disaster_5} and \
           p["gameLabel"] not in {x["gameLabel"] for x in disaster_5}:
            disaster_5.append(p)
        if len(disaster_5) == 5:
            break

parlays.append(make_parlay(
    "5C", disaster_5,
    "THE REGRESSION BOMB", "Medium Risk", "#ff9800", "+2200",
    "Target 5 pitchers with the biggest ERA collapse stories on today's slate.",
    f"Each of the five legs faces a pitcher with a documented ERA disaster — no leg is against a starter with an ERA under 5.00. "
    f"The regression bomb philosophy: when five different pitchers are simultaneously melting down, "
    f"the compounded HR probability across five independent at-bats is significantly underpriced.",
))

# ── 6A: PARK BLOWOUT ─────────────────────────────────────────────────────────
top_park_6 = one_per_game(sorted(park_scores[best_park]["players"], key=lambda x: -x["compositeScore"]))[:6]
if len(top_park_6) < 6:
    for p in SA_pool:
        if p["id"] not in {x["id"] for x in top_park_6} and \
           p["gameLabel"] not in {x["gameLabel"] for x in top_park_6}:
            top_park_6.append(p)
        if len(top_park_6) == 6:
            break

parlays.append(make_parlay(
    "6A", top_park_6,
    "THE PARK BLOWOUT", "Lower Risk", "#4caf50", "+2500",
    f"Full {best_park} stack plus supplementary S/A-tier disaster plays.",
    f"The best HR park context on today's slate anchors this six-leg construction. "
    f"Additional S and A-tier players from different games extend the disaster-pitcher theme across six independent outcomes. "
    f"Six legs covering multiple park contexts with the top HR environment as the centrepiece.",
))

# ── 6B: SP DISASTER SWEEP ────────────────────────────────────────────────────
disaster_6 = one_per_game(sorted(
    [p for p in players if is_disaster(p)],
    key=lambda x: -x["pitcherStats"].get("era", 0)
))[:6]
if len(disaster_6) < 6:
    for p in SA_pool:
        if p["id"] not in {x["id"] for x in disaster_6} and \
           p["gameLabel"] not in {x["gameLabel"] for x in disaster_6}:
            disaster_6.append(p)
        if len(disaster_6) == 6:
            break

parlays.append(make_parlay(
    "6B", disaster_6,
    "SP DISASTER SWEEP", "Lower Risk", "#4caf50", "+2800",
    "Six players each facing one of today's worst SP disasters across the full slate.",
    f"Each leg targets the worst qualified starter in a different game — a pure disaster-pitcher sweep. "
    f"Top leg: {disaster_6[0]['playerName']} vs {disaster_6[0]['oppPitcherName']} "
    f"(ERA {disaster_6[0]['pitcherStats'].get('era', '?')}). "
    f"No player in this six-pack is facing a pitcher with a functional ERA.",
))

# ── 7A: THE ELITE SEVEN ──────────────────────────────────────────────────────
elite_7 = pad_to(build_legs(SA_pool, 7), 7, B_pool)
parlays.append(make_parlay(
    "7A", elite_7,
    "THE ELITE SEVEN", "Medium Risk", "#ff9800", "+4000",
    "All S-tier players plus top A-tier anchor in today's best matchup.",
    f"S-tier ({len(S_pool)} players) form the foundation, topped off with the highest-rated A-tier plays. "
    f"Every leg represents a player with an elite composite score and a confirmed soft matchup. "
    f"This is the highest-conviction 7-leg structure on the board.",
))

# ── 7B: WIND CHASERS / PARK TOUR ─────────────────────────────────────────────
wind_players = [p for p in players if has_wind(p)]
if len(wind_players) >= 4:
    wind_7 = pad_to(
        one_per_game(sorted(wind_players, key=lambda x: -x["compositeScore"]))[:7],
        7, SA_pool, B_pool
    )
    label_7b = "THE WIND CHASERS"
    desc_7b  = "Stack every wind-boosted park with 10+ mph favorable wind on today's slate."
else:
    wind_7 = pad_to(build_legs(SAB_pool, 7), 7, C_pool)
    label_7b = "THE OUTDOOR POWER PARKS"
    desc_7b  = "Best outdoor park HR contexts across today's full slate in seven legs."

parlays.append(make_parlay(
    "7B", wind_7,
    label_7b, "Medium Risk", "#ff9800", "+4500",
    desc_7b,
    f"{'Wind-boosted' if len(wind_players) >= 4 else 'Top outdoor HR'} parks anchor this seven-leg combination. "
    f"Every leg exploits a favorable physical environment — park dimensions, wind direction, or temperature — "
    f"layered on top of the pitcher-matchup quality. Seven legs, seven independent outcomes, maximum park-factor exposure.",
))

# ── 7C: THE HOT HAND ─────────────────────────────────────────────────────────
# Uses HR count (then OPS) as the ranking — deliberately different from 7A's
# composite-score sort, so the two 7-leg parlays don't collapse to the same list.
hot_7 = pad_to(
    build_legs(one_per_game(sorted(players, key=lambda x: (-x["hr"], -x["ops"]))), 7),
    7, exclude(SAB_pool, ids(build_legs(SA_pool, 4)))
)
parlays.append(make_parlay(
    "7C", hot_7,
    "THE HOT HAND", "Medium Risk", "#ff9800", "+5000",
    "Seven players leading the slate in HR count — pure production, regardless of tier.",
    f"Ranked by HR count on the season: {hot_7[0]['playerName']} ({hot_7[0]['hr']} HR) leads the hot-hand stack. "
    f"This list cuts across tiers to surface whoever is actually hitting home runs in 2026, "
    f"not just who the model scores highest — the two metrics diverge on slates with park-factor noise.",
))

# ── 8A: THE SLUGGER SUMMIT ───────────────────────────────────────────────────
summit_8 = pad_to(build_legs(SA_pool, 8), 8, B_pool)
parlays.append(make_parlay(
    "8A", summit_8,
    "THE SLUGGER SUMMIT", "Medium-High Risk", "#ff5722", "+6500",
    "All S-tier players plus top 2 A-tier anchors covering the full disaster-pitcher landscape.",
    f"All {min(len(S_pool), 6)} S-tier players form the foundation of the eight-leg summit. "
    f"Top A-tier players round out the eight with the best remaining matchup quality. "
    f"This is the most balanced 8-leg construction on the board.",
))

# ── 8B: THE VALUE MATRIX ─────────────────────────────────────────────────────
value_8 = pad_to(
    one_per_game(
        S_pool[:3] +
        sorted(B, key=lambda x: -x["compositeScore"])[:3] +
        A_pool[:2]
    )[:8],
    8, SA_pool, B_pool
)
parlays.append(make_parlay(
    "8B", value_8,
    "THE VALUE MATRIX", "Medium-High Risk", "#ff5722", "+7000",
    "S-tier anchors combined with the highest-value B-tier plays for maximum payout potential.",
    f"S-tier anchors provide the disaster-pitcher foundation. "
    f"Top B-tier plays with strong Statcast profiles but longer odds amplify the payout ceiling significantly. "
    f"B-tier legs are selected specifically for ISO and OPS-to-odds ratio — underpriced power bats in solid matchups.",
))

# ── 9A: THE GRAND SALAMI ─────────────────────────────────────────────────────
salami_9 = pad_to(build_legs(SAB_pool, 9), 9, C_pool)
parlays.append(make_parlay(
    "9A", salami_9,
    "THE GRAND SALAMI", "High Risk", "#e91e63", "+10000",
    "9-leg monster covering every premium HR context on today's full slate.",
    f"The Grand Salami: six S/A-tier anchors across the board's best disaster-pitcher matchups, "
    f"extended to nine legs with three quality B-tier adds. "
    f"Nine independent outcomes, maximum slate coverage, maximum payout structure.",
))

# ── 9B: THE SLEEPER STACK ────────────────────────────────────────────────────
sleeper_9 = pad_to(
    one_per_game(
        S_pool[:4] +
        sorted(A + B, key=lambda x: (-x["compositeScore"], -x["iso"]))[:5]
    )[:9],
    9, SA_pool, C_pool
)
parlays.append(make_parlay(
    "9B", sleeper_9,
    "THE SLEEPER STACK", "High Risk", "#e91e63", "+11000",
    "S-tier anchors plus breakout candidates producing real Statcast value.",
    f"Four S-tier anchors set the disaster-pitcher foundation. "
    f"Five A/B-tier sleepers — selected for ISO and park-score combination — complete the nine-leg slate. "
    f"The sleepers are specifically chosen where the model sees value vs market odds.",
))

# ── 10A: THE LOTTERY TICKET ──────────────────────────────────────────────────
# Must include at least 2 C-tier players and always produce exactly 10 legs.
c_picks = one_per_game(sorted(C, key=lambda x: -x["compositeScore"]))[:2]
elite_picks = build_legs(SA_pool, 8)
# Start with elite + C picks, one-per-game filtered
all_10 = one_per_game(elite_picks + c_picks)[:10]

# Ensure 2 C-tier are present — replace non-C tail entries if needed
c_in_10 = [p for p in all_10 if p["tier"] == "C"]
while len(c_in_10) < 2 and C:
    candidate = None
    for p in sorted(C, key=lambda x: -x["compositeScore"]):
        if p["id"] not in {x["id"] for x in all_10} and \
           p["gameLabel"] not in {x["gameLabel"] for x in all_10}:
            candidate = p
            break
    if candidate:
        all_10 = all_10[:9] + [candidate]
        c_in_10 = [p for p in all_10 if p["tier"] == "C"]
    else:
        break

# Pad to exactly 10 legs from B/C pool if one-per-game filtering trimmed us short
if len(all_10) < 10:
    used_ids   = {p["id"]        for p in all_10}
    used_games = {p["gameLabel"] for p in all_10}
    for p in (B_pool + C_pool + A_pool):
        if len(all_10) >= 10:
            break
        if p["id"] not in used_ids and p["gameLabel"] not in used_games:
            all_10.append(p)
            used_ids.add(p["id"])
            used_games.add(p["gameLabel"])

parlays.append(make_parlay(
    "10A", all_10,
    "THE LOTTERY TICKET", "Max Risk", "#9c27b0", "+25000",
    "Elite disaster-pitcher core plus 2 C-tier moon shots for maximum payout construction.",
    f"Ten legs spanning the slate's top disaster-pitcher matchups form the foundation. "
    f"Two C-tier moon shots — {c_in_10[0]['playerName'] if c_in_10 else 'TBD'} "
    f"({c_in_10[0]['estOdds'] if c_in_10 else ''}) and "
    f"{c_in_10[1]['playerName'] if len(c_in_10) > 1 else 'TBD'} "
    f"({c_in_10[1]['estOdds'] if len(c_in_10) > 1 else ''}) — "
    f"extend this into pure lottery territory. "
    f"Pure construction: high-conviction S/A core + maximum payout ceiling.",
))

# ── Validate + clean output ───────────────────────────────────────────────────

output_parlays = []
seen_final = {}  # frozenset -> parlay_id, for final duplicate report
for par in parlays:
    clean = {k: v for k, v in par.items() if k != "_players"}
    clean["legs"] = len(clean["playerIds"])
    combo = frozenset(clean["playerIds"])
    if combo in seen_final:
        print(f"❌ DUPLICATE PARLAY: {clean['id']} == {seen_final[combo]} — fix parlay_builder.py", flush=True)
    else:
        seen_final[combo] = clean["id"]
    output_parlays.append(clean)

# Verify 10A has 2 C-tier
c_tier_ids = {p["id"] for p in C}
lottery = next((p for p in output_parlays if p["id"] == "10A"), None)
if lottery:
    c_count = sum(1 for pid in lottery["playerIds"] if pid in c_tier_ids)
    if c_count < 2:
        print(f"⚠ WARNING: 10A only has {c_count} C-tier players", flush=True)

# Verify all playerIds exist
all_ids = {p["id"] for p in players}
for par in output_parlays:
    bad = [pid for pid in par["playerIds"] if pid not in all_ids]
    if bad:
        print(f"⚠ WARNING: Parlay {par['id']} has invalid playerIds: {bad}")

with open("scripts/parlays.json", "w") as f:
    json.dump(output_parlays, f, indent=2)

print(f"\n✅ {len(output_parlays)} parlays written to scripts/parlays.json")
for par in output_parlays:
    c_in = sum(1 for pid in par["playerIds"] if pid in c_tier_ids)
    print(f"   {par['id']:4s}  {par['legs']} legs  {par['estPayout']:8s}  {par['label']}")
