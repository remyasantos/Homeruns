#!/usr/bin/env python3
"""Enhance notes for S/A tier players and first 5 parlay strategies in data.js."""
import json, re, sys

with open('public/data.js', 'r') as f:
    content = f.read()

# ---------- player note/pitcherNote patches ----------
# Only touching: note, pitcherNote for S and A tier players (IDs 1-20)
# Only using numbers that already exist in the file.

patches = {
    # --- S-TIER ---
    1: {  # Yordan Alvarez vs Shane Bieber
        'pitcherNote': '5.74 ERA, 2.0 HR/9 — Bieber is cooked, free real estate for any pull-power bat',
        'note': 'Yordan leads the entire board at 35 HRs and a 1.092 OPS — the definitive bomb machine on today\'s slate, operating at an .320 ISO pace that targets disaster arms. Shane Bieber\'s 5.74 ERA and 2.0 HR/9 rate inside Daikin Park is free real estate — this is the single highest-probability HR setup of the day.',
    },
    2: {  # Junior Caminero vs Michael Lorenzen
        'note': 'Junior\'s 30 HRs and 0.262 ISO make him the most underpriced power bat on the board at +218 — elite production in a premium HR park. Michael Lorenzen\'s 6.54 ERA is the worst on today\'s slate, and Coors Field amplifies every hard contact swing into a live bomb at altitude.',
    },
    3: {  # James Wood vs Aaron Nola
        'pitcherNote': '5.61 ERA, 2.0 HR/9 — Nola is cooked, Citizens Bank is a death trap for broken fly-ball arms',
        'note': 'James Wood is a 30-HR bomb machine posting 0.932 OPS — the most productive bat in the Washington lineup and statistically underpriced at +219 in a premium HR environment. Aaron Nola\'s 5.61 ERA and 2.0 HR/9 rate make Citizens Bank Park a disaster delivery system for any pull-side swing today.',
    },
    4: {  # CJ Abrams vs Aaron Nola
        'pitcherNote': '5.61 ERA, 2.0 HR/9 — Nola has no reliable out pitch against power-first lineups at Citizens Bank',
        'note': 'CJ Abrams is a 28-HR threat with a 0.917 OPS and .287 average — the definition of underpriced at +220 against a broken disaster arm. Aaron Nola\'s 5.61 ERA and 2.0 HR/9 rate confirm this is free real estate for any pull-side swing at Citizens Bank Park today.',
    },
    # --- A-TIER ---
    5: {  # Kyle Schwarber vs TBD
        'note': 'Kyle Schwarber is a 33-HR, 0.287 ISO bomb machine — pure power profile that doesn\'t need a great average to go yard at .247 AVG. Citizens Bank Park is the #2 HR park on today\'s slate, and with a TBD arm Schwarber\'s +313 line is structurally underpriced regardless of the opposing starter.',
    },
    6: {  # Andrés Chaparro vs Aaron Nola
        'pitcherNote': '5.61 ERA, 2.0 HR/9 — Nola\'s fly-ball approach is cooked, a disaster setup for Chaparro\'s pull power',
        'note': 'Andrés Chaparro\'s 0.280 ISO and 0.847 OPS reveal a genuine power bat with only 6 HRs on the board — the breakout is overdue and underpriced at +313. Aaron Nola\'s 5.61 ERA and 2.0 HR/9 rate confirm this matchup at Citizens Bank Park is free real estate for Chaparro\'s pull profile.',
    },
    7: {  # Ben Rice vs Michael McGreevy
        'note': 'Ben Rice is a 31-HR, 0.295 ISO bomb machine — confirmed elite power in Yankee Stadium with 10mph wind blowing out today, a perfect storm for carry. Even Michael McGreevy\'s 3.57 ERA can\'t neutralize the park-weather synergy that turns every elevated Ball hit by Rice into a live HR candidate.',
    },
    8: {  # Brady House vs Aaron Nola
        'pitcherNote': '5.61 ERA, 2.0 HR/9 — Nola is cooked, sets up every pull-power bat in this lineup at Citizens Bank',
        'note': 'Brady House has 7 HRs and an 0.167 ISO — a raw power bat who\'s underpriced at +316 when Nola\'s disaster arm comes to Citizens Bank. Aaron Nola\'s 5.61 ERA and 2.0 HR/9 rate make this a pure value prop: odds doing the work in today\'s best HR park context.',
    },
    9: {  # Jonathan Aranda vs Michael Lorenzen
        'note': 'Jonathan Aranda\'s 0.430 SLG and 0.801 OPS represent a legitimate power spike at Coors Field — 14 HRs from a bat that makes consistent hard contact at altitude. Michael Lorenzen\'s 6.54 ERA is today\'s worst disaster arm, and Coors doesn\'t forgive pitchers like this — Aranda at +319 is structurally underpriced.',
    },
    10: {  # Esmerlyn Valdez vs Brandon Sproat
        'note': 'Esmerlyn Valdez is posting 0.366 ISO and 0.994 OPS — the best per-contact power signature on today\'s board, bar none. Brandon Sproat\'s 5.05 ERA in the dome removes all weather luck and rewards pure bat-to-ball execution — at +319, Valdez is the definition of underpriced on today\'s slate.',
    },
    11: {  # Yandy Díaz vs Michael Lorenzen
        'note': 'Yandy Díaz\'s .301 average and 0.460 SLG represent elite contact consistency — 15 HRs from a bat that consistently makes hard contact at Coors Field is a recurring formula. Michael Lorenzen\'s 6.54 ERA is a disaster start that turns this Coors trip into free real estate for anyone making elevated contact today.',
    },
    12: {  # Jeremy Peña vs Shane Bieber
        'pitcherNote': '5.74 ERA, 2.0 HR/9 — Bieber\'s approach is disaster-level, pull-power bats eat him alive inside the dome',
        'note': 'Jeremy Peña\'s 0.529 SLG and 0.904 OPS tag him as a stealth bomb machine operating inside Daikin Park at +320. Shane Bieber\'s 5.74 ERA and 2.0 HR/9 rate is free real estate — Peña\'s pull profile exploits the same disaster pattern that makes Yordan Alvarez the slate\'s top pick today.',
    },
    13: {  # Ryan Vilade vs Michael Lorenzen
        'note': 'Ryan Vilade\'s 0.216 ISO and 9 HRs represent real pop from a lineup that\'s already hammering Lorenzen hard today — underpriced at +320. Michael Lorenzen\'s 6.54 ERA at Coors Field is a structural gift: a pure lottery play where the park and the disaster arm do all the work.',
    },
    14: {  # Hunter Goodman vs Ian Seymour
        'note': 'Hunter Goodman is a 33-HR, 0.301 ISO bomb machine playing every home game in the world\'s best HR environment — Coors Field ranked #1 today. Ian Seymour\'s 4.37 ERA in the thin mountain air is underpriced vulnerability: Goodman at +321 is the most structurally sound park-power play on today\'s slate.',
    },
    15: {  # Christian Walker vs Shane Bieber
        'pitcherNote': '5.74 ERA, 2.0 HR/9 — Bieber is cooked, Walker\'s pull power sets up free real estate inside Daikin Park',
        'note': 'Christian Walker\'s 22 HRs and 0.460 SLG represent proven middle-order power against disaster arms — he produces against the same ERA profiles all year. Shane Bieber\'s 5.74 ERA and 2.0 HR/9 rate are free real estate for Walker\'s pull power inside Daikin Park today.',
    },
    16: {  # Victor Mesa Jr. vs Michael Lorenzen
        'note': 'Victor Mesa Jr.\'s 0.212 ISO and 8 HRs make him a live lottery play in the mile-high air at Coors Field — enough raw power to exploit a disaster arm on any given at-bat. Michael Lorenzen\'s 6.54 ERA is today\'s worst disaster start, and at +325 the Coors multiplier turns Mesa\'s swing into a legitimate HR threat.',
    },
    17: {  # Kazuma Okamoto vs Cristian Javier
        'note': 'Kazuma Okamoto\'s 24 HRs and 0.447 SLG reveal a consistent international power threat who produces against disaster arms — 0.218 ISO confirms genuine pop. Cristian Javier\'s 7.17 ERA is the worst on today\'s board — this is pure free real estate inside Daikin Park at +326.',
    },
    18: {  # Jesús Sánchez vs Cristian Javier
        'note': 'Jesús Sánchez\'s 0.747 OPS and 7 HRs understate his real ceiling — a contact-plus-power bat primed to exploit the board\'s worst disaster arm. Cristian Javier\'s 7.17 ERA inside Daikin Park translates directly into underpriced HR equity at +328 for any bat making hard contact.',
    },
    19: {  # Bryan De La Cruz vs TBD
        'note': 'Bryan De La Cruz is posting a 1.235 OPS and 0.350 ISO at a .450 average — the hottest contact profile on the entire board, and Citizens Bank Park is the #2 HR park on today\'s slate. At +328 with a TBD arm, this is the definition of underpriced: a bomb-machine bat in a premium HR environment with maximum uncertainty baked into the line.',
    },
    20: {  # Spencer Jones vs Michael McGreevy
        'note': 'Spencer Jones has 5 HRs and 0.196 ISO — a raw power bat scratching the surface at Yankee Stadium with 10mph wind blowing out today. That outbound wind turns every elevated Spencer Jones contact into a live HR candidate at +329 — pure lottery odds with legitimate park-boosted carry upside.',
    },
}

# ---------- parlay strategy patches (first 5) ----------
parlay_patches = {
    '4A': 'Yordan Alvarez (35 HR, 1.092 OPS) anchors this four-pack against Shane Bieber\'s 5.74 ERA disaster start — the highest-probability leg on today\'s entire board. Junior Caminero (30 HR) and James Wood (30 HR) stack two more confirmed disasters: Lorenzen\'s 6.54 ERA at Coors and Nola\'s 5.61 ERA at Citizens Bank, while Ben Rice rides the 10mph Yankee Stadium wind boost as the final independent leg. Three separate confirmed disaster starts, one wind-boosted park — the most structurally sound four-pack on today\'s board.',
    '4B': 'This four-pack targets the two most dangerous disaster arms today — Lorenzen (6.54 ERA at Coors) and Bieber (5.74 ERA at Daikin) — while Nola\'s 5.61 ERA at Citizens Bank anchors James Wood as the fourth leg. Junior Caminero (30 HR), Yordan Alvarez (35 HR), and Esmerlyn Valdez (0.366 ISO) each deliver elite power credentials against a cooked rotation — three confirmed disaster starts across four independent legs in today\'s best HR parks.',
    '5A': 'Yordan Alvarez (35 HR, 1.092 OPS) leads the five-pack, and every other leg either faces a confirmed disaster arm — Lorenzen 6.54 ERA, Nola 5.61 ERA, Bieber 5.74 ERA — or rides Yankee Stadium\'s 10mph wind boost. Esmerlyn Valdez (0.366 ISO, 0.994 OPS) is the most underpriced contact-power leg on the board, and this five-pack covers five independent games with no two legs from the same matchup. At true five-leg odds, this is the board\'s strongest risk-adjusted five-pack.',
    '5B': 'Brady House (Nola\'s 5.61 ERA at Citizens Bank) and Hunter Goodman (33 HR in Coors Field) anchor this five-pack with proven power credentials against real disaster context. Jesús Sánchez faces Cristian Javier\'s 7.17 ERA — the worst arm on the board — while Spencer Jones rides Yankee Stadium\'s 10mph wind boost; at five-leg odds this group is statistically underpriced across every leg.',
    '5C': 'Kazuma Okamoto vs. Cristian Javier\'s 7.17 ERA — today\'s worst disaster arm — opens the regression bomb thesis: when five pitchers are simultaneously cooked, compounded HR probability across five at-bats is underpriced on the card. Junior Caminero (30 HR vs. Lorenzen 6.54 ERA), James Wood (30 HR vs. Nola 5.61 ERA), and Esmerlyn Valdez (0.366 ISO vs. Sproat 5.05 ERA) each deliver the same thesis — today\'s rotation is collectively melting down, and the market hasn\'t fully priced the cascade.',
}

# ---- Apply player patches ----
def patch_player_field(content, player_id, field, new_value):
    """Patch a specific field for a player with given id."""
    # Find the player block by id
    # Pattern: id: N, ... field: "old_value"
    # We look for id: <N>, then within that block find and replace the field

    # Find the player entry
    id_pattern = re.compile(
        r'(id:\s+' + str(player_id) + r',\s*\n(?:.*\n)*?)\s+(' + re.escape(field) + r':\s+)"([^"]*(?:\\.[^"]*)*)"',
        re.MULTILINE
    )

    def replacer(m):
        return m.group(1) + '    ' + field + ':' + m.group(2).split(':')[1] + '"' + new_value.replace('"', '\\"') + '"'

    # More targeted approach: find the player block by id and the specific field
    new_content = content

    # Locate the player block
    block_start_pattern = re.compile(r'\{\s*\n\s+id:\s+' + str(player_id) + r',\s*\n')
    m = block_start_pattern.search(content)
    if not m:
        print(f"WARNING: Could not find player id={player_id}")
        return content

    start = m.start()
    # Find end of this player block (next { or end of players array)
    # Count braces to find end
    depth = 0
    end = start
    for i, ch in enumerate(content[start:], start):
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break

    block = content[start:end]

    # Now replace the field inside block
    field_pattern = re.compile(
        r'(' + re.escape(field) + r':\s+)"([^"]*(?:\\.[^"]*)*)"'
    )

    new_value_escaped = new_value.replace('\\', '\\\\').replace('"', '\\"')

    new_block, n = field_pattern.subn(
        lambda m2: m2.group(1) + '"' + new_value_escaped + '"',
        block
    )

    if n == 0:
        print(f"WARNING: field '{field}' not found in player id={player_id} block")
        return content

    return content[:start] + new_block + content[end:]

def patch_parlay_strategy(content, parlay_id, new_strategy):
    """Patch strategy for a parlay with given id."""
    # Find the parlay block by id
    id_pattern = re.compile(
        r'(\{\s*\n\s+id:\s+"' + re.escape(parlay_id) + r'",\s*\n(?:.*\n)*?\s+strategy:\s+)"([^"]*(?:\\.[^"]*)*)"'
    )

    new_value_escaped = new_strategy.replace('\\', '\\\\').replace('"', '\\"')

    def replacer(m):
        return m.group(1) + '"' + new_value_escaped + '"'

    new_content, n = id_pattern.subn(replacer, content)
    if n == 0:
        print(f"WARNING: parlay id={parlay_id} strategy not found")
        return content
    return new_content

# Apply player patches
for player_id, fields in patches.items():
    for field, value in fields.items():
        content = patch_player_field(content, player_id, field, value)
        print(f"Patched player {player_id} {field}")

# Apply parlay patches
for parlay_id, strategy in parlay_patches.items():
    content = patch_parlay_strategy(content, parlay_id, strategy)
    print(f"Patched parlay {parlay_id} strategy")

with open('public/data.js', 'w') as f:
    f.write(content)

print("Done.")
