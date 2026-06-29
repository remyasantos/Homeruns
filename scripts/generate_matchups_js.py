#!/usr/bin/env python3
"""
generate_matchups_js.py — builds public/matchups_data.js from matchup data.
Reads:  scripts/matchups.json
Writes: public/matchups_data.js  (NEVER writes to public/data.js)

Output is plain JavaScript (no ES module exports), loaded via <script> tag.
"""

import json
import datetime
import sys
import os
from pathlib import Path

# ── Resolve paths relative to repo root ──────────────────────────────────────
# Support running from repo root or from scripts/ subdirectory.
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT   = SCRIPT_DIR.parent

INPUT_PATH  = REPO_ROOT / "scripts" / "matchups.json"
OUTPUT_PATH = REPO_ROOT / "public" / "matchups_data.js"

# ── Load matchups.json ────────────────────────────────────────────────────────

if not INPUT_PATH.exists():
    print(f"❌ {INPUT_PATH} not found — run the matchup fetch script first")
    sys.exit(1)

with open(INPUT_PATH, encoding="utf-8") as f:
    matchups = json.load(f)

date_label     = matchups.get("date", "")          # e.g. "JUNE 29, 2026"
day_label      = matchups.get("label", "")          # e.g. "MONDAY"
generated_at   = matchups.get("generated_at",
                               datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"))
games          = matchups.get("games", [])
pitchers_slate = matchups.get("pitchers_slate", [])

# ── Build BATTERS_BY_ID ───────────────────────────────────────────────────────
# Collect all unique batters across every game's awayMatchups + homeMatchups.
# Keyed by str(playerId) for O(1) frontend lookup.

batters_by_id: dict = {}
for game in games:
    for matchup_list in (game.get("awayMatchups", []), game.get("homeMatchups", [])):
        for batter in matchup_list:
            bid = str(batter.get("playerId", batter.get("id", "")))
            if bid and bid not in batters_by_id:
                batters_by_id[bid] = batter

# ── Build PITCHERS_BY_ID ──────────────────────────────────────────────────────
# Keyed by str(pitcherId) for O(1) frontend lookup.

pitchers_by_id: dict = {}
for pitcher in pitchers_slate:
    pid = str(pitcher.get("pitcherId", pitcher.get("id", "")))
    if pid and pid not in pitchers_by_id:
        pitchers_by_id[pid] = pitcher

# ── Serialize ─────────────────────────────────────────────────────────────────

def js_val(value, indent=2) -> str:
    """Serialize a Python value to a JS literal using json.dumps."""
    return json.dumps(value, indent=indent, ensure_ascii=False)

lines: list[str] = []

# Header constants — MUST appear first, no leading blank lines, no BOM.
lines.append(f'const MATCHUPS_DATE = {js_val(date_label)};')
lines.append(f'const MATCHUPS_LABEL = {js_val(day_label)};')
lines.append(f'const MATCHUPS_GENERATED_AT = {js_val(generated_at)};')

# MATCHUPS_GAMES — full game objects including awayMatchups and homeMatchups arrays.
games_json = js_val(games, indent=2)
lines.append(f'const MATCHUPS_GAMES = {games_json};')

# PITCHERS_SLATE — flat array of pitcher objects.
pitchers_json = js_val(pitchers_slate, indent=2)
lines.append(f'const PITCHERS_SLATE = {pitchers_json};')

# BATTERS_BY_ID — object keyed by string batter ID.
batters_json = js_val(batters_by_id, indent=2)
lines.append(f'const BATTERS_BY_ID = {batters_json};')

# PITCHERS_BY_ID — object keyed by string pitcher ID.
pitchers_by_id_json = js_val(pitchers_by_id, indent=2)
lines.append(f'const PITCHERS_BY_ID = {pitchers_by_id_json};')

# ── Write output ──────────────────────────────────────────────────────────────

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

output_text = "\n".join(lines) + "\n"

# Safety guard — never write to public/data.js.
assert str(OUTPUT_PATH).endswith("matchups_data.js"), (
    f"Output path safety check failed: {OUTPUT_PATH}"
)

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(output_text)

print(f"✅ matchups_data.js written — {len(games)} games, {len(pitchers_slate)} pitchers")
