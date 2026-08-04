#!/usr/bin/env python3
"""Quality-check enhancement pass: rewrite notes/pitcherNotes for S/A tier players
and strategy for first 5 parlays. Only modifies text fields, never touches structure."""

import re

DATA_FILE = "public/data.js"

# Enhanced notes for S and A tier players
# Format: player_id -> {note, pitcherNote}
ENHANCEMENTS = {
    # S TIER
    1: {
        "note": "Schwarber has 33 HRs and a 0.897 OPS — the board's most reliable power-contact anchor with a 0.286 ISO that turns Littell's 4.94 ERA into free real estate. Citizens Bank Park is the #3 HR park on today's slate, and Littell's 2.1 HR/9 rate makes every Schwarber fly ball a live HR threat.",
        "pitcherNote": "4.94 ERA, 2.1 HR/9 — fly-ball disaster who hands pull-power bats a live HR look every start.",
    },
    2: {
        "note": "De La Cruz is running a 1.243 OPS and 0.333 ISO — pure bomb machine contact quality that makes Littell's 4.94 ERA look exploitable from the jump. Citizens Bank Park amplifies every elevated contact event, and Littell has no reliable out pitch to counter it.",
        "pitcherNote": "4.94 ERA, 2.1 HR/9 — cooked starter whose fly-ball approach is a gift to this ISO profile.",
    },
    3: {
        "note": "Harper has gone yard 24 times this season with a 0.862 OPS and 0.248 ISO in his own house — Citizens Bank Park, the slate's #3 HR park. Littell is cooked: 4.94 ERA and 2.1 HR/9 against a stadium that punishes any fly ball Harper elevates.",
        "pitcherNote": "4.94 ERA, 2.1 HR/9 — no functional approach to neutralize Harper's pull-side explosion at CBP.",
    },
    4: {
        "note": "Basabe is hitting with a 1.274 OPS and a jaw-dropping 0.584 ISO — pure bomb machine contact regardless of sample size. Globe Life Field's closed dome eliminates weather luck and puts Gore's 4.77 ERA on a direct collision course with the most elite ISO on today's board.",
        "pitcherNote": "4.77 ERA, 1.26 WHIP — gets hit hard, and Basabe's 0.584 ISO is the worst possible matchup profile.",
    },
    # A TIER
    5: {
        "note": "Kurtz has 21 HRs and a 0.879 OPS inside the #2 HR park on today's board — Great American Ball Park is free real estate for power bats. Singer's 1.42 WHIP signals command leak that turns premium contact into hard counts, and GABP turns hard counts into home runs.",
        "pitcherNote": "4.35 ERA, 1.42 WHIP — walks men and misses spots at a park that punishes every elevated mistake.",
    },
    6: {
        "note": "Encarnacion-Strand posts a 0.936 OPS and 0.290 ISO — elite power-contact profile against the most exploitable start on the slate. Rodriguez's 7.98 ERA is a full disaster-start: no reliable out pitch, no consistent approach, and Camden Yards amplifies every mistake.",
        "pitcherNote": "7.98 ERA — historically bad run, no reliable out pitch, full disaster-start tag in 2026.",
    },
    7: {
        "note": "Alonso has 23 HRs on the season — a 0.811 OPS power bat who historically punishes pitchers running ERA north of 6.00. Rodriguez at 7.98 ERA is a disaster-start layup at Oriole Park: pure free real estate for a HR hitter of Alonso's caliber.",
        "pitcherNote": "7.98 ERA — no sequence, no consistency, pure free real estate for a 23-HR power bat.",
    },
    8: {
        "note": "Goodman is tied for the slate HR lead with 33 — a bomb machine running a 0.878 OPS and 0.297 ISO at the #1 HR park in today's lineup. Peralta's 4.99 ERA and 1.48 WHIP at Coors turns every elevated contact into a live HR window.",
        "pitcherNote": "4.99 ERA, 1.48 WHIP — Coors Field does the rest; Goodman's 0.297 ISO completes the equation.",
    },
    9: {
        "note": "Marsh has 16 HRs with a 0.449 SLG at Citizens Bank — a left-handed pull bat that Littell's 2.1 HR/9 approach is designed to serve up on a platter. The park-pitcher combo here gives Marsh the highest-volume HR floor in the entire CBP stack.",
        "pitcherNote": "4.94 ERA, 2.1 HR/9 — worst HR rate in the rotation; left-handed pull bats go deep off this approach.",
    },
    10: {
        "note": "Yordan is the HR leader on today's board with 35 — a 1.091 OPS and 0.318 ISO that make him the undisputed bomb machine on the slate. Inside Daikin Park's closed dome, pure bat-to-ball contact wins, and Alvarez has the best contact quality on any player in today's lineup.",
        "pitcherNote": "3.73 ERA, 1.16 WHIP — respectable arm, but no starter shuts down a 35-HR pace forever; Alvarez is underpriced.",
    },
    11: {
        "note": "Rice has 31 HRs on the season — a 0.907 OPS and 0.293 ISO from a left-handed pull bat at Yankee Stadium, the slate's #4 HR park. Dobbins' 1.34 WHIP means traffic, and traffic in a 70°F game at Yankee Stadium means elevated counts for Rice's power stroke.",
        "pitcherNote": "3.74 ERA, 1.34 WHIP — allows baserunner traffic that escalates counts for 31-HR power bats.",
    },
    12: {
        "note": "Turner has 16 HRs with a 0.696 OPS — a deceptively underpriced prop at CBP against Littell's 2.1 HR/9 rate. Littell's fly-ball disaster profile at Citizens Bank Park turns every above-average bat into a viable HR play regardless of odds.",
        "pitcherNote": "4.94 ERA, 2.1 HR/9 — surrenders HRs at a catastrophic rate that inflates every CBP bat's true probability.",
    },
    13: {
        "note": "Stott has 8 HRs and a 0.725 OPS — a steady middle-order bat at Citizens Bank who adds volume to the CBP stack at deeply underpriced odds. Littell's 2.1 HR/9 rate is the great equalizer: even a below-average pop profile becomes viable when the pitcher serves a HR every 4 innings.",
        "pitcherNote": "4.94 ERA, 2.1 HR/9 — worst HR rate in the rotation; CBP ensures even modest pop registers.",
    },
    14: {
        "note": "J.T. Realmuto carries 8 HRs and a 0.668 OPS into a CBP matchup at +336 — a catcher punishing command-issue starters at a premium park. Littell's 2.1 HR/9 is the rare rate where even a mid-tier power hitter becomes a massively underpriced prop.",
        "pitcherNote": "4.94 ERA, 2.1 HR/9 — fly-ball disaster who inflates every power profile, including catchers.",
    },
    15: {
        "note": "Mayo has 14 HRs with a 0.211 ISO — legitimate pull-power at Camden Yards facing Rodriguez's 7.98 ERA disaster start. Grayson's collapse makes every Oriole Park bat viable, and Mayo's ISO profile at this park is massively underpriced at +336.",
        "pitcherNote": "7.98 ERA — full collapse mode, no game-plan consistency; treat every at-bat as a live HR window.",
    },
    16: {
        "note": "Soderstrom has 17 HRs and a 0.795 OPS at the #2 HR park on today's board — Great American Ball Park. Singer's 1.42 WHIP and 4.35 ERA is a command leak that turns above-average power into above-average probability in a park built for home runs.",
        "pitcherNote": "4.35 ERA, 1.42 WHIP — command inconsistency at GABP amplifies every hard-contact event.",
    },
    17: {
        "note": "Bohm has 13 HRs and a 0.645 OPS — a volume-coverage add to the CBP stack at underpriced odds. Littell's catastrophic 2.1 HR/9 rate means the pitcher serves up HRs regardless of the hitter profile; CBP does the amplification.",
        "pitcherNote": "4.94 ERA, 2.1 HR/9 — worst HR rate in the rotation, period; the park takes care of the rest.",
    },
    18: {
        "note": "Murakami has 24 HRs and a 0.302 ISO — an elite pull-power profile walking into Fenway Park against a pitcher with a 1.58 WHIP. Sandoval's baserunner inflation means Murakami gets big counts, and big counts at Fenway end badly for pitchers facing a 0.924 OPS bat.",
        "pitcherNote": "3.32 ERA, 1.58 WHIP — compounding baserunner traffic sets up full counts for elite contact bats.",
    },
    19: {
        "note": "Serven is posting a 0.808 OPS and 0.250 ISO — legitimate power-contact profile in the #2 HR park on today's board. Singer's 1.42 WHIP and 4.35 ERA gives every Great American Ball Park bat a viable HR window, and Serven's ISO is well above the floor.",
        "pitcherNote": "4.35 ERA, 1.42 WHIP — command issues at GABP turn every elevated mistake into extra-base territory.",
    },
    20: {
        "note": "Hill has 9 HRs and a 0.741 OPS — a solid middle-order bat who becomes a real HR play at CBP against Littell's 2.1 HR/9 disaster rate. Citizens Bank Park is the #3 HR park on the slate, and the worst HR rate in the rotation plus the #3 park is a pure volume-coverage bet at +338.",
        "pitcherNote": "4.94 ERA, 2.1 HR/9 — worst HR rate on today's board; CBP amplifies the ceiling for every power bat in the lineup.",
    },
}

# Enhanced strategies for first 5 parlays
PARLAY_STRATEGIES = {
    "4A": "Schwarber's 33 HRs anchor the core, stacked with Basabe's 1.274 OPS bomb machine in the dome and Kurtz's 21-HR pace at the #2 park on the board. Encarnacion-Strand adds the Grayson Rodriguez disaster tag — 7.98 ERA is the single most exploitable start on today's slate. Four legs, four independent disaster-pitcher contexts, two S-tier probability floors.",
    "4B": "Goodman at Coors Field, Schwarber at CBP, Basabe inside Globe Life's closed dome, and Kurtz at Great American Ball Park — four of the top-ranked HR environments on the slate covered in one ticket. The park-factor stack bets that favorable ballpark physics compound across four independent outcomes. Two S-tier anchors hold the probability floor.",
    "5A": "S-tier anchors Schwarber (33 HR, 0.897 OPS) and Basabe (1.274 OPS) lead the five-pack, backed by Kurtz (21 HR, GABP #2) and Goodman (33 HR, Coors #1) on pure park-factor context. Encarnacion-Strand's Rodriguez disaster tag (7.98 ERA) makes this five a zero-functional-ERA construction — five games, five separate HR contexts, maximum diversification.",
    "5B": "Yordan Alvarez leads this build with 35 HRs and a 1.091 OPS — the board's best pure power producer at underpriced odds. Murakami (24 HR, 0.924 OPS) at Fenway against a 1.58 WHIP arm and Wood's 30-HR pace add elite contact to the build; Ohtani and Caissie inject B-tier ceiling where the book hasn't fully priced the ISO profile.",
    "5C": "Every leg targets a pitcher in documented decline or command crisis — from Rodriguez's 7.98 ERA to Singer's 1.42 WHIP to Gore's 4.77 ERA. Schwarber (33 HR) and Alvarez (35 HR, 1.091 OPS) anchor with maximum power profiles; Basabe's 1.274 OPS and Encarnacion-Strand's disaster matchup add ceiling. Five melting-down pitchers, one ticket.",
}


def update_player_field(content, player_id, field, new_value):
    """Find a player by id and replace a specific field value."""
    # Match the player block starting with the id field
    # We look for id: <number>, and then find the field within that block

    # Pattern to find the specific player entry - look for id: N, followed by fields
    id_pattern = rf'(\{{[^{{}}]*?id:\s+{player_id},[^{{}}]*?){re.escape(field)}:\s+"([^"]*)"'

    # Try multi-line approach
    escaped_val = new_value.replace("\\", "\\\\").replace('"', '\\"')

    replacement = rf'\g<1>{field}:           "{new_value}"'
    result = re.sub(id_pattern, replacement, content, flags=re.DOTALL)
    if result == content:
        print(f"  WARNING: Could not update {field} for player {player_id}")
    return result


def update_player_field_v2(content, player_id, field, new_value):
    """Update a field value for a specific player by searching near the id pattern."""
    # Find the player block that contains the id
    # We'll use a simpler line-by-line approach
    lines = content.split('\n')

    in_player = False
    player_start = -1
    player_end = -1
    brace_depth = 0

    # Find the player block boundaries
    for i, line in enumerate(lines):
        if not in_player:
            if re.match(rf'\s+id:\s+{player_id},', line):
                in_player = True
                # Find the opening brace before this line
                for j in range(i, -1, -1):
                    if '{' in lines[j]:
                        player_start = j
                        break
                brace_depth = 1
        else:
            for ch in line:
                if ch == '{':
                    brace_depth += 1
                elif ch == '}':
                    brace_depth -= 1
            if brace_depth == 0:
                player_end = i
                break

    if player_start == -1 or player_end == -1:
        print(f"  WARNING: Could not find player {player_id} block")
        return content

    # Now within those lines, find and replace the field
    field_pattern = re.compile(rf'(\s+{re.escape(field)}:\s+)"([^"]*)"(.*)')

    found = False
    for i in range(player_start, player_end + 1):
        m = field_pattern.match(lines[i])
        if m:
            lines[i] = f'{m.group(1)}"{new_value}"{m.group(3)}'
            found = True
            break

    if not found:
        print(f"  WARNING: Field '{field}' not found in player {player_id} block (lines {player_start}-{player_end})")

    return '\n'.join(lines)


def update_parlay_strategy(content, parlay_id, new_strategy):
    """Update the strategy field of a specific parlay by id."""
    lines = content.split('\n')

    in_parlay = False
    parlay_start = -1
    parlay_end = -1
    brace_depth = 0

    for i, line in enumerate(lines):
        if not in_parlay:
            if re.match(rf'\s+id:\s+"{re.escape(parlay_id)}",', line):
                in_parlay = True
                for j in range(i, -1, -1):
                    if '{' in lines[j]:
                        parlay_start = j
                        break
                brace_depth = 1
        else:
            for ch in line:
                if ch == '{':
                    brace_depth += 1
                elif ch == '}':
                    brace_depth -= 1
            if brace_depth == 0:
                parlay_end = i
                break

    if parlay_start == -1 or parlay_end == -1:
        print(f"  WARNING: Could not find parlay {parlay_id} block")
        return content

    strategy_pattern = re.compile(r'(\s+strategy:\s+)"([^"]*)"(.*)')

    found = False
    for i in range(parlay_start, parlay_end + 1):
        m = strategy_pattern.match(lines[i])
        if m:
            lines[i] = f'{m.group(1)}"{new_strategy}"{m.group(3)}'
            found = True
            break

    if not found:
        print(f"  WARNING: strategy field not found in parlay {parlay_id} block")

    return '\n'.join(lines)


def main():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    print("Enhancing S/A tier player notes...")
    for player_id, fields in ENHANCEMENTS.items():
        print(f"  Player {player_id}:")
        for field, value in fields.items():
            content = update_player_field_v2(content, player_id, field, value)
            print(f"    {field} updated")

    print("\nEnhancing parlay strategies...")
    for parlay_id, strategy in PARLAY_STRATEGIES.items():
        content = update_parlay_strategy(content, parlay_id, strategy)
        print(f"  Parlay {parlay_id} strategy updated")

    if content == original:
        print("\nNo changes made — check field matching patterns")
        return

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\nWrote updated {DATA_FILE}")


if __name__ == "__main__":
    main()
