#!/usr/bin/env python3
"""Enhance note/pitcherNote for S/A-tier players and strategy for first 5 parlays."""
import re

ENHANCED = {
    # S-tier
    1: {
        "pitcherNote": "4.69 ERA and 1.9 HR/9 — Sugano's fly-ball disaster is free real estate for any power bat at Coors altitude.",
        "note": "John's .428 ISO is the most elite power number on today's board — a pure bomb machine disguised as a +210 prop. Sugano's 4.69 ERA and 1.9 HR/9 at the #1 HR park in baseball makes this free real estate on Friday's slate.",
    },
    2: {
        "pitcherNote": "4.69 ERA with 1.9 HR/9 — Sugano is cooked in 2026, pitching straight into the #1 HR park in baseball.",
        "note": "17 HRs puts Caglianone on a 30-HR breakout pace — one of the most underpriced power surges on the full board. Sugano's 4.69 ERA and 1.9 HR/9 fly-ball disaster at Coors Field altitude makes this a +220 gift.",
    },
    3: {
        "pitcherNote": "7.06 ERA and no reliable out pitch — Greene is the biggest SP disaster on today's entire board.",
        "note": "Valdez is posting a 1.035 OPS and .387 ISO — elite contact quality from a bomb machine facing the slate's worst SP disaster. Hunter Greene's 7.06 ERA at the #2 HR park on today's board is free real estate — the most cooked pitching matchup on Friday's slate.",
    },
    4: {
        "pitcherNote": "4.69 ERA and 1.9 HR/9 — Sugano's chronically leaky fly-ball approach meets a full bomb machine lineup at Coors altitude.",
        "note": "Luke's .333 ISO and .891 OPS from deep in KC's Coors lineup is a legitimate power number the market is sleeping on. Sugano's 4.69 ERA and 1.9 HR/9 against a .891 OPS bat at the #1 HR park makes this a pure +220 underpriced disaster setup.",
    },
    # A-tier
    5: {
        "pitcherNote": "4.05 ERA and 1.17 WHIP — Eovaldi allows consistent hard contact all season, no margin for error against elite power inside the dome.",
        "note": "35 HRs and a 1.072 OPS makes Yordan Alvarez the most dangerous power bat in baseball — the league's premier bomb machine at the plate. Eovaldi's 4.05 ERA and 1.17 WHIP inside the sealed Daikin Park dome means pure bat-to-ball execution in a controlled environment — underpriced at +316.",
    },
    6: {
        "pitcherNote": "4.69 ERA and 1.9 HR/9 — Sugano's fly-ball disaster at Coors altitude compounds across every slot in KC's lineup.",
        "note": "14 HRs and a .725 OPS gives Jensen proven middle-order power credentials in the heart of KC's Coors lineup. Sugano's 4.69 ERA and 1.9 HR/9 at the #1 HR park on today's slate is a textbook disaster-start setup — underpriced at +317.",
    },
    7: {
        "pitcherNote": "4.69 ERA and 1.9 HR/9 — Sugano is getting punished all year and Coors Field will amplify every elevated pitch.",
        "note": "15 HRs from the veteran Perez proves legitimate pull power in this KC lineup that punishes fly-ball pitchers. Sugano's 4.69 ERA and 1.9 HR/9 at the #1 outdoor HR park on today's board is a pure disaster-start for every Royals bat — underpriced at +322.",
    },
    8: {
        "pitcherNote": "1.9 HR/9 and 4.69 ERA — Sugano's fly-ball approach gets destroyed by any pull-power lineup in altitude environments.",
        "note": "10 HRs and a .716 OPS from Thomas shows consistent middle-order pop — exactly the profile that punishes a pitcher posting 1.9 HR/9. Sugano's 4.69 ERA in the #1 HR park on the slate means this +323 prop is cooked by the park-pitcher combination alone.",
    },
    9: {
        "pitcherNote": "4.69 ERA and 1.29 WHIP — Sugano pitches from behind constantly, turning every Coors plate appearance into an HR opportunity.",
        "note": "8 HRs with a .726 OPS puts Massey squarely in the productive middle of KC's Coors lineup today. Sugano's 4.69 ERA and 1.29 WHIP in the #1 HR park means every KC plate appearance is underpriced at +326 — the definition of a disaster-start stack.",
    },
    10: {
        "pitcherNote": "3.60 ERA and 1.17 WHIP — Wacha gives up consistent hard contact and Coors Field punishes every elevated mistake.",
        "note": "31 HRs and .291 ISO makes Hunter Goodman the most prolific HR producer at the #1 park on today's slate — a bomb machine in his home environment. Wacha's 3.60 ERA and 1.17 WHIP at Coors altitude means even a solid start becomes free real estate for a 31-HR bat at +329.",
    },
    11: {
        "pitcherNote": "1.9 HR/9 and 4.69 ERA — Sugano's leaky fly-ball approach turns Coors altitude into a disaster for every KC lineup slot.",
        "note": "5 HRs with a .743 OPS shows Loftin has been productive from the lower half of KC's Coors lineup all season. Sugano's 4.69 ERA and 1.9 HR/9 at the league's best HR park makes every bat in this order underpriced at +332.",
    },
    12: {
        "pitcherNote": "4.69 ERA and 1.9 HR/9 — Sugano's chronic HR rate at Coors generates free real estate for even the bottom of KC's order.",
        "note": "6 HRs and a .708 OPS out of the bottom of KC's lineup means Collins has delivered real production in Coors this season. Sugano's 4.69 ERA and 1.9 HR/9 at the #1 HR park on today's board makes this a classic underpriced +333 prop in the Coors stack.",
    },
    13: {
        "pitcherNote": "4.69 ERA with 1.9 HR/9 — Sugano's fly-ball disaster is cooked against KC's full lineup at the #1 HR park.",
        "note": "Tolbert's .866 OPS is the highest contact-rate number in KC's Coors lineup today — a value bat scoring at an elite clip in the #1 HR park. Sugano's 4.69 ERA and 1.9 HR/9 against a .866 OPS hitter at Coors altitude makes this +333 a pure lottery ticket in disguise.",
    },
    14: {
        "pitcherNote": "7.06 ERA disaster start — Greene has no reliable out pitch in 2026 and Great American Ball Park punishes every fly ball.",
        "note": "23 HRs and .810 OPS makes Lowe one of the most productive HR threats on the board facing the slate's worst arm — a bomb machine in a disaster-pitcher matchup. Hunter Greene's 7.06 ERA disaster start at the #2 HR park on the slate is free real estate for this PIT bat at +335.",
    },
    15: {
        "pitcherNote": "4.69 ERA and 1.9 HR/9 — Sugano's chronic fly-ball losses compound in Coors altitude for every KC lineup slot.",
        "note": "Starling Marte's .625 OPS represents reduced production by his standards, but veteran pull power in the #1 HR park is still real. Sugano's 4.69 ERA and 1.9 HR/9 in Coors makes even a compromised veteran bat underpriced at +339 in this disaster stack.",
    },
    16: {
        "pitcherNote": "3.60 ERA and 1.17 WHIP — Wacha allows hard contact at a rate that Coors altitude turns into a fly-ball disaster.",
        "note": "17 HRs and .883 OPS makes Moniak one of the most productive COL bats in 2026 — a legit breakout pace in the game's best HR environment. Wacha's 3.60 ERA and 1.17 WHIP at Coors altitude means this +342 prop is underpriced for the home park bomb machine context.",
    },
    17: {
        "pitcherNote": "7.06 ERA disaster — Greene is historically cooked in 2026 with no reliable approach at Great American Ball Park.",
        "note": "15 HRs and .835 OPS makes Reynolds one of Pittsburgh's most dangerous power threats against the slate's biggest disaster arm. Hunter Greene's 7.06 ERA at Great American Ball Park, the #2 HR park on today's slate, is the clearest disaster-start signal on Friday's board at +343.",
    },
    18: {
        "pitcherNote": "4.69 ERA and 1.9 HR/9 — Sugano's fly-ball disaster makes Coors altitude free real estate for even the bottom of KC's order.",
        "note": "Josh Rojas's .633 OPS is a discount entry into the Coors/Sugano disaster stack — a value play in the best HR environment on today's slate. Sugano's 4.69 ERA and 1.9 HR/9 makes every KC lineup slot underpriced at +344 — this is the Coors lottery play.",
    },
    19: {
        "pitcherNote": "7.06 ERA and no reliable approach — Greene is the slate's biggest disaster arm and Great American Ball Park amplifies every mistake.",
        "note": "5 HRs and .833 OPS from Rodríguez shows legitimate contact quality facing the slate's worst arm — a +344 play with real HR upside. Hunter Greene's 7.06 ERA disaster at the #2 HR park on the board is free real estate for a bat posting .833 OPS.",
    },
    20: {
        "pitcherNote": "3.96 ERA and 1.25 WHIP — Elder's peripherals show consistent damage-allowed tendencies against power hitters all season.",
        "note": "30 HRs and a .950 OPS makes James Wood one of the elite power-and-contact combinations on today's slate — a legitimate bomb machine at an outdoor park. Elder's 3.96 ERA and 1.25 WHIP in a 66°F Truist Park outdoor game makes this +347 prop underpriced for a 30-HR bat.",
    },
}

PARLAY_STRATEGIES = {
    "4A": "Four legs, four independent disaster-pitcher setups — the board's highest-conviction 4-leg build. Esmerlyn Valdez faces Hunter Greene's 7.06 ERA disaster at the #2 HR park, Yordan Alvarez brings 35 HRs against Eovaldi's 4.05 ERA inside the Daikin dome, and James Wood's 30 HRs target Elder's 3.96 ERA at Truist Park. John Rave anchors with .428 ISO at Coors — free real estate from the #1 HR park sealed with the board's most dangerous lineup slot at +800.",
    "4B": "This four-leg build stacks the board's biggest disaster-pitcher stories across three independent games — maximum SP meltdown exposure in four plays. Esmerlyn Valdez targets Hunter Greene's 7.06 ERA at the #2 HR park, Yordan Alvarez brings 35 HRs against Eovaldi's 4.05 ERA in the sealed dome, and Eduardo Valencia's 1.330 OPS faces Jeffrey Springs's 6.23 ERA disaster at Sutter Health. John Rave's .428 ISO at Coors seals the four-pack at +800 — four cooked arms, four underpriced bats.",
    "5A": "Five legs across five independent games — the most diversified lower-risk build on the board, hitting every major HR angle. Esmerlyn Valdez (14 HR) targets Hunter Greene's 7.06 ERA disaster, Yordan Alvarez (35 HR) faces Eovaldi's 4.05 ERA in the Daikin dome, and James Wood (30 HR) goes up against Elder's 3.96 ERA at Truist Park. Eduardo Valencia's 1.330 OPS faces Springs's 6.23 ERA while John Rave's .428 ISO anchors at Coors — five independent disaster-pitcher or elite park setups at +1800.",
    "5B": "Five batters with the strongest power-contact profiles outside the Core Four — the sweet spot where the odds carry more value than the tier implies. Ben Rice's 31 HRs and .931 OPS lead the group, Jake Bauers's 18 HRs target Ryan Johnson's 7.34 ERA disaster at Angel Stadium, and Jac Caglianone's 17 HRs head to the #1 HR park at Coors. Elly De La Cruz brings 18 HRs and .859 OPS at Great American Ball Park while Joc Pederson adds 19 HRs in the Daikin dome — five proven HR producers underpriced at +1800.",
    "5C": "The Regression Bomb targets the board's four biggest SP disasters in one concentrated 5-leg build — Ryan Johnson's 7.34 ERA, Hunter Greene's 7.06 ERA, Mitch Bratt's 6.32 ERA, and Jeffrey Springs's 6.23 ERA — four pitchers in simultaneous collapse. Jake Bauers, Esmerlyn Valdez, Steven Kwan, and Eduardo Valencia each face one of these cooked arms across independent game slots. John Rave anchors with .428 ISO at the #1 HR park — when four different pitchers are melting down, the compounded HR probability at +2200 is historically underpriced.",
}

def escape_for_js(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

with open("public/data.js", "r") as f:
    content = f.read()

# Update player note/pitcherNote fields
# Strategy: find each player block by id, then replace the note/pitcherNote within it
for pid, fields in ENHANCED.items():
    # Match the player block from id: N to the closing brace
    # Find the player by id and name
    pattern = rf'(  \{{\n    id:\s+{pid},\n    name:\s+"[^"]+",.*?)(    pitcherNote:\s+")(.*?)(",\n)'

    # Simpler approach: find "id: N," then work from there
    # Use a two-pass: first find position of "id: N,", then find pitcherNote and note within the next 500 chars

    # Find position of this player's id line
    id_pattern = rf'    id:\s+{pid},\n'
    id_match = re.search(id_pattern, content)
    if not id_match:
        print(f"WARNING: Could not find player id {pid}")
        continue

    start = id_match.start()
    # Find the end of this player block (next "},")
    end_match = re.search(r'\n  \},', content[start:])
    if not end_match:
        print(f"WARNING: Could not find end of player block for id {pid}")
        continue
    end = start + end_match.end()

    block = content[start:end]
    original_block = block

    if "pitcherNote" in fields:
        new_val = escape_for_js(fields["pitcherNote"])
        block = re.sub(r'    pitcherNote:\s+".*?"', f'    pitcherNote:    "{new_val}"', block)

    if "note" in fields:
        new_val = escape_for_js(fields["note"])
        block = re.sub(r'    note:\s+".*?"', f'    note:          "{new_val}"', block)

    if block != original_block:
        content = content[:start] + block + content[end:]
        print(f"Updated player id {pid}")
    else:
        print(f"WARNING: No changes made for player id {pid}")

# Update parlay strategies
for parlay_id, strategy in PARLAY_STRATEGIES.items():
    # Find parlay block by id
    id_pattern = rf'    id:\s+"{parlay_id}",\n'
    id_match = re.search(id_pattern, content)
    if not id_match:
        print(f"WARNING: Could not find parlay id {parlay_id}")
        continue

    start = id_match.start()
    end_match = re.search(r'\n  \},', content[start:])
    if not end_match:
        print(f"WARNING: Could not find end of parlay block for id {parlay_id}")
        continue
    end = start + end_match.end()

    block = content[start:end]
    original_block = block

    new_val = escape_for_js(strategy)
    block = re.sub(r'    strategy:\s+".*?"', f'    strategy:    "{new_val}"', block)

    if block != original_block:
        content = content[:start] + block + content[end:]
        print(f"Updated parlay id {parlay_id}")
    else:
        print(f"WARNING: No changes made for parlay id {parlay_id}")

with open("public/data.js", "w") as f:
    f.write(content)

print("Done.")
