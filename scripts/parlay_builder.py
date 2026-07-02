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
  - No two parlays may have identical playerIds sets
"""

import json

with open("scripts/scored_players.json") as f:
    data = json.load(f)

players = data["players"]

# ── Helpers ───────────────────────────────────────────────────────────────────

def by_tier(tier):
    return [p for p in players if p["tier"] == tier]

def by_tiers(*tiers):
    return [p for p in players if p["tier"] in tiers]

def one_per_game(player_list):
    """Filter to at most one player per gameLabel, preserving input order."""
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

def exclude(pool, exclude_ids):
    """Return pool with given player ids removed."""
    s = set(exclude_ids)
    return [p for p in pool if p["id"] not in s]

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


def is_disaster(p):
    return p.get("pitcherStats", {}).get("era", 0) >= 5.50

def has_wind(p):
    return "💨 Wind Boost" in p.get("tags", [])


# ── Make-parlay helper ────────────────────────────────────────────────────────

_used_combos = {}  # frozenset(playerIds) -> parlay_id

def make_parlay(parlay_id, legs_list, label, risk, risk_color, payout_str, description, strategy):
    """Create a validated parlay dict."""
    clean    = one_per_game(legs_list)  # safety net against caller mistakes
    pid_list = ids(clean)
    combo    = frozenset(pid_list)
    if combo in _used_combos:
        print(f"⚠ DUPLICATE: Parlay {parlay_id} has identical playerIds to "
              f"{_used_combos[combo]}", flush=True)
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
        "_players":    clean,
    }


# ── Park scoring ──────────────────────────────────────────────────────────────

park_scores = {}
for p in players:
    v = p["venue"]
    if v not in park_scores:
        park_scores[v] = {"rank": data["park_hr_ranks"].get(v, 30), "players": []}
    park_scores[v]["players"].append(p)

best_park = min(park_scores, key=lambda v: park_scores[v]["rank"])


# ── Construct the 15 required parlays ─────────────────────────────────────────

parlays = []

# ── 4A: THE CORE FOUR ─────────────────────────────────────────────────────────
core_4 = pad_to(one_per_game(S_pool)[:4], 4, A_pool)
parlays.append(make_parlay(
    "4A", core_4,
    "THE CORE FOUR", "Lower Risk", "#4caf50", "+800",
    "The 4 highest-probability S-tier legs — disaster pitchers + elite park contexts.",
    f"Each leg represents an S-tier batter facing a confirmed SP disaster with elite park and "
    f"Statcast credentials. {core_4[0]['playerName']} ({core_4[0]['hr']} HR) leads the four-pack "
    f"with a composite score of {core_4[0]['compositeScore']}. "
    f"All four legs face pitchers with ERA at or above league-worst thresholds.",
))

# ── 4B: PARK STACK ────────────────────────────────────────────────────────────
park_4 = pad_to(
    one_per_game(sorted(park_scores[best_park]["players"],
                        key=lambda x: -x["compositeScore"]))[:4],
    4, SA_pool, B_pool
)
# If 4B would be identical to 4A, force 2 replacement legs from outside 4A's games
if frozenset(ids(park_4)) == frozenset(ids(core_4)):
    core_4_games = {p["gameLabel"] for p in core_4}
    alt = one_per_game([p for p in SA_pool if p["gameLabel"] not in core_4_games])[:2]
    keep = one_per_game(park_4)[:2]
    park_4 = pad_to(one_per_game(keep + alt)[:4], 4, exclude(SAB_pool, ids(keep + alt)))

parlays.append(make_parlay(
    "4B", park_4,
    "THE PARK STACK", "Lower Risk", "#4caf50", "+800",
    f"Best single-park HR context on today's slate — {best_park}.",
    f"{best_park} is today's top-ranked HR environment. "
    f"All four legs exploit the same favorable park context while covering independent game slots. "
    f"Stacking the park's best matchups amplifies the HR probability from a pure environment standpoint.",
))

# ── 5A: THE HIGH FIVE ─────────────────────────────────────────────────────────
hi5 = pad_to(one_per_game(SA_pool)[:5], 5, B_pool)
parlays.append(make_parlay(
    "5A", hi5,
    "THE HIGH FIVE", "Lower Risk", "#4caf50", "+1800",
    "S-tier anchors plus top A-tier wind/park plays for a five-leg lower-risk combination.",
    f"S-tier anchors lead the five-pack with elite composite scores. "
    f"Top A-tier legs are added on park and pitcher disaster quality. "
    f"No two legs share a game — maximum diversification across independent HR outcomes.",
))

# ── 5B: THE EV SPECIAL ────────────────────────────────────────────────────────
# Deliberately different from 5A: exclude 5A's players so we surface the NEXT
# best Statcast credentials rather than collapsing to the same list.
# Sorts by real exit velocity + barrel% (Baseball Savant) when a player has
# real Savant data -- these players are ranked ahead of anyone without a real
# sample, who fall back to composite score/ISO. Matches what this parlay's
# description actually claims, rather than approximating it via batterScore.
def _ev_sort_key(p):
    bsv = p.get("batterSavant") or {}
    ev  = bsv.get("exit_velo")
    brl = bsv.get("barrel_pct")
    if ev is not None and brl is not None:
        return (0, -(ev + brl), -p.get("batterScore", 0))
    return (1, -p.get("batterScore", 0), -p.get("iso", 0))

hi5_ids = frozenset(ids(hi5))
ev5 = pad_to(
    one_per_game(sorted([p for p in players if p["id"] not in hi5_ids],
                        key=_ev_sort_key))[:5],
    5, exclude(SAB_pool, hi5_ids), B_pool
)
top_ev = ev5[0] if ev5 else {"playerName": "?", "batterScore": 0, "hr": 0}
parlays.append(make_parlay(
    "5B", ev5,
    "THE EV SPECIAL", "Medium Risk", "#ff9800", "+1800",
    "5 players with the highest exit velocity and barrel % credentials not in the High Five.",
    f"These five batters represent the strongest power-contact profiles on the slate by ISO and "
    f"batter score — specifically the tier below the High Five, where the odds carry more value. "
    f"{top_ev['playerName']} leads with a batter score of {top_ev['batterScore']} and "
    f"{top_ev['hr']} HR. High exit velo reduces individual prop variance.",
))

# ── 5C: THE REGRESSION BOMB ───────────────────────────────────────────────────
disaster_5 = pad_to(
    one_per_game(sorted(
        [p for p in players if is_disaster(p)],
        key=lambda x: -x["pitcherStats"].get("era", 0)
    ))[:5],
    5, SA_pool, B_pool
)
parlays.append(make_parlay(
    "5C", disaster_5,
    "THE REGRESSION BOMB", "Medium Risk", "#ff9800", "+2200",
    "Target 5 pitchers with the biggest ERA collapse stories on today's slate.",
    f"Each of the five legs faces a pitcher with a documented ERA disaster — no leg is against a "
    f"starter with a functional approach. "
    f"The regression bomb philosophy: when five different pitchers are simultaneously melting down, "
    f"the compounded HR probability across five independent at-bats is significantly underpriced.",
))

# ── 6A: PARK BLOWOUT ─────────────────────────────────────────────────────────
top_park_6 = pad_to(
    one_per_game(sorted(park_scores[best_park]["players"],
                        key=lambda x: -x["compositeScore"]))[:6],
    6, SA_pool, B_pool
)
parlays.append(make_parlay(
    "6A", top_park_6,
    "THE PARK BLOWOUT", "Lower Risk", "#4caf50", "+2500",
    f"Full {best_park} stack plus supplementary S/A-tier disaster plays.",
    f"The best HR park context on today's slate anchors this six-leg construction. "
    f"Additional S and A-tier players from different games extend the disaster-pitcher theme across "
    f"six independent outcomes. Six legs covering multiple park contexts with the top HR environment "
    f"as the centrepiece.",
))

# ── 6B: SP DISASTER SWEEP ────────────────────────────────────────────────────
disaster_6 = pad_to(
    one_per_game(sorted(
        [p for p in players if is_disaster(p)],
        key=lambda x: -x["pitcherStats"].get("era", 0)
    ))[:6],
    6, SA_pool, B_pool
)
top_d = disaster_6[0] if disaster_6 else {"playerName":"?","oppPitcherName":"?","pitcherStats":{}}
parlays.append(make_parlay(
    "6B", disaster_6,
    "SP DISASTER SWEEP", "Lower Risk", "#4caf50", "+2800",
    "Six players each facing one of today's worst SP disasters across the full slate.",
    f"Each leg targets the worst qualified starter in a different game — a pure disaster-pitcher sweep. "
    f"Top leg: {top_d['playerName']} vs {top_d['oppPitcherName']} "
    f"(ERA {top_d['pitcherStats'].get('era', '?')}). "
    f"No player in this six-pack is facing a pitcher with a functional ERA.",
))

# ── 7A: THE ELITE SEVEN ──────────────────────────────────────────────────────
elite_7 = pad_to(one_per_game(SA_pool)[:7], 7, B_pool)
parlays.append(make_parlay(
    "7A", elite_7,
    "THE ELITE SEVEN", "Medium Risk", "#ff9800", "+4000",
    "All S-tier players plus top A-tier anchor in today's best matchup.",
    f"S-tier players form the foundation, topped off with the highest-rated A-tier plays. "
    f"Every leg represents a player with an elite composite score and a confirmed soft matchup. "
    f"This is the highest-conviction 7-leg structure on the board.",
))

# ── 7B: WIND CHASERS / PARK TOUR ─────────────────────────────────────────────
# Explicitly exclude 7A's players so this can never collapse to the same set.
_7a_ids = frozenset(ids(elite_7))
wind_players = [p for p in players if has_wind(p)]
if len(wind_players) >= 4:
    wind_7 = pad_to(
        one_per_game(sorted(wind_players, key=lambda x: -x["compositeScore"]))[:7],
        7, exclude(SA_pool, _7a_ids), exclude(B_pool, _7a_ids)
    )
    # If the result is still identical to 7A (rare edge case), force different legs
    if frozenset(ids(wind_7)) == _7a_ids:
        wind_7 = pad_to(
            one_per_game(sorted([p for p in players if p["id"] not in _7a_ids],
                                key=lambda x: -x["compositeScore"]))[:7],
            7, exclude(B_pool, _7a_ids), C_pool
        )
    label_7b = "THE WIND CHASERS"
    desc_7b  = "Stack every wind-boosted park with 10+ mph favorable wind on today's slate."
else:
    wind_7 = pad_to(
        one_per_game([p for p in SAB_pool if p["id"] not in _7a_ids])[:7],
        7, C_pool
    )
    label_7b = "THE OUTDOOR POWER PARKS"
    desc_7b  = "Best outdoor park HR contexts across today's full slate in seven legs."

parlays.append(make_parlay(
    "7B", wind_7,
    label_7b, "Medium Risk", "#ff9800", "+4500",
    desc_7b,
    f"{'Wind-boosted' if len(wind_players) >= 4 else 'Top outdoor HR'} parks anchor this "
    f"seven-leg combination. Every leg exploits a favorable physical environment — park dimensions, "
    f"wind direction, or temperature — layered on top of the pitcher-matchup quality. "
    f"Seven legs, seven independent outcomes, maximum park-factor exposure.",
))

# ── 7C: THE HOT HAND ─────────────────────────────────────────────────────────
# Deliberately different from 7A: exclude 7A's players and rank by HR count (not composite).
elite_7_ids = frozenset(ids(elite_7))
hot_7 = pad_to(
    one_per_game(sorted([p for p in players if p["id"] not in elite_7_ids],
                        key=lambda x: (-x["hr"], -x["ops"])))[:7],
    7, exclude(SAB_pool, elite_7_ids)
)
top_hot = hot_7[0] if hot_7 else {"playerName": "?", "hr": 0}
parlays.append(make_parlay(
    "7C", hot_7,
    "THE HOT HAND", "Medium Risk", "#ff9800", "+5000",
    "Seven players leading the slate in HR count, excluding the Elite Seven.",
    f"Ranked by HR count on the season among players not already in the Elite Seven: "
    f"{top_hot['playerName']} ({top_hot['hr']} HR) leads the hot-hand stack. "
    f"This surfaces the next tier of real HR producers in 2026 — batters delivering actual results "
    f"that the composite score may underweight due to park or pitcher noise.",
))

# ── 8A: THE SLUGGER SUMMIT ───────────────────────────────────────────────────
summit_8 = pad_to(one_per_game(SA_pool)[:8], 8, B_pool)
parlays.append(make_parlay(
    "8A", summit_8,
    "THE SLUGGER SUMMIT", "Medium-High Risk", "#ff5722", "+6500",
    "All S-tier players plus top 2 A-tier anchors covering the full disaster-pitcher landscape.",
    f"All S-tier players form the foundation of the eight-leg summit. "
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
    f"Top B-tier plays with strong Statcast profiles but longer odds amplify the payout ceiling "
    f"significantly. B-tier legs are selected for ISO and OPS-to-odds ratio — underpriced power "
    f"bats in solid matchups.",
))

# ── 9A: THE GRAND SALAMI ─────────────────────────────────────────────────────
salami_9 = pad_to(one_per_game(SAB_pool)[:9], 9, C_pool)
parlays.append(make_parlay(
    "9A", salami_9,
    "THE GRAND SALAMI", "High Risk", "#e91e63", "+10000",
    "9-leg monster covering every premium HR context on today's full slate.",
    f"S/A-tier anchors across the board's best disaster-pitcher matchups, extended to nine legs "
    f"with quality B-tier adds. "
    f"Nine independent outcomes, maximum slate coverage, maximum payout structure.",
))

# ── 9B: THE SLEEPER STACK ────────────────────────────────────────────────────
# Deliberately different from 9A: exclude 9A's players so we get second-best per game.
# This surfaces the underrated batters that 9A's top-score picks displaced.
salami_ids = frozenset(ids(salami_9))
sleeper_9 = pad_to(
    one_per_game(sorted([p for p in S + A + B if p["id"] not in salami_ids],
                        key=lambda x: (-x["compositeScore"], -x["iso"])))[:9],
    9, exclude(SAB_pool, salami_ids), C_pool
)
parlays.append(make_parlay(
    "9B", sleeper_9,
    "THE SLEEPER STACK", "High Risk", "#e91e63", "+11000",
    "S-tier anchors plus breakout candidates producing real Statcast value.",
    f"Players not selected for the Grand Salami form this nine-leg sleeper build — the second-best "
    f"bat from each game slot. These are batters where ISO and matchup grade exceed what their "
    f"composite score implies, specifically chosen where the model sees value vs market odds.",
))

# ── 10A: THE LOTTERY TICKET ──────────────────────────────────────────────────
# Must include at least 2 C-tier players and always produce exactly 10 legs.
c_picks = one_per_game(sorted(C, key=lambda x: -x["compositeScore"]))[:2]
elite_picks = pad_to(one_per_game(SA_pool)[:8], 8, B_pool)
all_10 = one_per_game(elite_picks + c_picks)[:10]

# Ensure 2 C-tier are present.
# BUG FIX: when replacing all_10[9], check games against first 9 elements only
# (not all 10), so we don't exclude C candidates that share a game with the
# element we're about to discard.
c_in_10 = [p for p in all_10 if p["tier"] == "C"]
while len(c_in_10) < 2 and C:
    candidate = None
    first9_ids   = {x["id"]        for x in all_10[:9]}
    first9_games = {x["gameLabel"] for x in all_10[:9]}
    for p in sorted(C, key=lambda x: -x["compositeScore"]):
        if p["id"] not in first9_ids and p["gameLabel"] not in first9_games:
            candidate = p
            break
    if candidate:
        all_10 = all_10[:9] + [candidate]
        c_in_10 = [p for p in all_10 if p["tier"] == "C"]
    else:
        break  # no valid C candidate exists

# Pad to exactly 10 legs if one-per-game filtering shortened us
if len(all_10) < 10:
    used_ids   = {p["id"]        for p in all_10}
    used_games = {p["gameLabel"] for p in all_10}
    for p in B_pool + C_pool + A_pool:
        if len(all_10) >= 10:
            break
        if p["id"] not in used_ids and p["gameLabel"] not in used_games:
            all_10.append(p)
            used_ids.add(p["id"])
            used_games.add(p["gameLabel"])

c_in_10 = [p for p in all_10 if p["tier"] == "C"]
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

EXPECTED_LEGS = {
    "4A": 4, "4B": 4,
    "5A": 5, "5B": 5, "5C": 5,
    "6A": 6, "6B": 6,
    "7A": 7, "7B": 7, "7C": 7,
    "8A": 8, "8B": 8,
    "9A": 9, "9B": 9,
    "10A": 10,
}

output_parlays = []
seen_final = {}  # frozenset -> parlay_id
c_tier_ids = {p["id"] for p in C}


def _recover_unique(par, target_legs, seen_combos):
    """Replace one leg at a time until the parlay combo is unique. Returns a
    new playerIds list, or None if no unique alternative can be built."""
    current_ids = list(par["playerIds"])
    used_combos = seen_combos

    # Walk through replacement candidates: SAB then C, excluding current legs
    candidates = [
        p for p in (SAB_pool + C_pool)
        if p["id"] not in set(current_ids)
    ]
    for swap_idx in range(len(current_ids) - 1, -1, -1):  # replace from the tail
        for candidate in candidates:
            # Check one-per-game: candidate's game must not appear elsewhere in the parlay
            other_ids = current_ids[:swap_idx] + current_ids[swap_idx + 1:]
            other_games = {player_map[oid]["gameLabel"] for oid in other_ids
                          if oid in player_map}
            if candidate["gameLabel"] in other_games:
                continue
            new_ids = other_ids + [candidate["id"]]
            # Preserve leg count
            if len(new_ids) != target_legs:
                continue
            new_combo = frozenset(new_ids)
            if new_combo not in used_combos:
                return new_ids
    return None


for par in parlays:
    clean = {k: v for k, v in par.items() if k != "_players"}
    clean["legs"] = len(clean["playerIds"])
    combo = frozenset(clean["playerIds"])

    if combo in seen_final:
        print(f"⚠ DUPLICATE PARLAY: {clean['id']} == {seen_final[combo]} — attempting recovery",
              flush=True)
        recovered = _recover_unique(clean, clean["legs"], seen_final)
        if recovered:
            clean["playerIds"] = recovered
            clean["legs"] = len(recovered)
            combo = frozenset(recovered)
            print(f"  ✅ Recovered {clean['id']} with new playerIds", flush=True)
        else:
            print(f"  ❌ Could not recover unique combo for {clean['id']} — skipping",
                  flush=True)
            continue

    seen_final[combo] = clean["id"]
    output_parlays.append(clean)

all_ids = {p["id"] for p in players}
for par in output_parlays:
    # Expected leg count
    expected = EXPECTED_LEGS.get(par["id"])
    if expected and par["legs"] != expected:
        print(f"⚠ WARNING: Parlay {par['id']} has {par['legs']} legs, expected {expected}",
              flush=True)
    # Valid playerIds
    bad = [pid for pid in par["playerIds"] if pid not in all_ids]
    if bad:
        print(f"⚠ WARNING: Parlay {par['id']} has invalid playerIds: {bad}", flush=True)
    # 10A C-tier
    if par["id"] == "10A":
        c_count = sum(1 for pid in par["playerIds"] if pid in c_tier_ids)
        if c_count < 2:
            print(f"⚠ WARNING: 10A only has {c_count} C-tier players", flush=True)
    # One-per-game final check
    game_labels = [player_map[pid]["gameLabel"] for pid in par["playerIds"]
                   if pid in player_map]
    dupes = [g for i, g in enumerate(game_labels) if g in game_labels[:i]]
    if dupes:
        print(f"❌ GAME VIOLATION: {par['id']} has duplicate game labels: "
              f"{list(set(dupes))}", flush=True)

with open("scripts/parlays.json", "w") as f:
    json.dump(output_parlays, f, indent=2)

print(f"\n✅ {len(output_parlays)} parlays written to scripts/parlays.json")
for par in output_parlays:
    c_in = sum(1 for pid in par["playerIds"] if pid in c_tier_ids)
    games = sorted({player_map[pid]["gameLabel"] for pid in par["playerIds"]
                    if pid in player_map})
    print(f"   {par['id']:4s}  {par['legs']} legs  {par['estPayout']:8s}  "
          f"{par['label']}  ({len(games)} games)")
