# Homeruns MLB HR Parlay Board — Agent Guide

---

## Authentication Setup

Pushes in Claude Code Remote sessions go through a session proxy — use the
`mcp__github__push_files` or `mcp__github__create_or_update_file` MCP tools
for all file commits rather than raw `git push`. These tools use the session's
built-in GitHub credentials and bypass the proxy restriction entirely.

If you need to verify GitHub API access:
```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/remyasantos/Homeruns
```
A `200` response means access is good. If auth fails, ask the repo owner to
generate a new classic token (github.com/settings/tokens, repo scope) and
supply it in the session prompt — do NOT store tokens in this file.

---

## Two Independent Systems

This repo has two completely separate automated pipelines. They share the
same codebase but run on different schedules and commit different files.

| | HR Parlay Picks | Statcast Matchups |
|---|---|---|
| **Workflow** | `daily-slate.yml` | `daily-matchups.yml` |
| **Runs at** | 11:00 UTC / 7 AM ET | 13:00 UTC / 9 AM ET |
| **Output file** | `public/data.js` | `public/matchups_data.js` |
| **UI page** | `public/parlays.html` | `public/matchups.html` |
| **Status file** | `public/last-run.json` | none (check Actions log) |
| **Fails silently?** | No — writes `validation-failed` status | Yes — Savant steps use `continue-on-error` |

---

## System 1: Daily HR Parlay Picks

### What it does
Fetches today's MLB schedule and pitchers via MLB Stats API, scores 50
hitters by park factor + weather + matchup, builds 15 parlays, writes
`public/data.js`, validates it, and commits.

### Pipeline scripts
```
scripts/fetch_slate.py       MLB Stats API + wttr.in  → scripts/raw_slate.json
scripts/tier_engine.py       Score/tier 50 players    → scripts/scored_players.json
scripts/parlay_builder.py    Build 15 parlays          → scripts/parlays.json
scripts/generate_data_js.py  Deterministic notes       → public/data.js
validate-data.js             Schema validation
```

### How to access
Open `public/parlays.html` in a browser, or visit the GitHub Pages URL for
the repo. The page loads `public/data.js` via a `<script>` tag.

### How to manually trigger
GitHub Actions UI:
> github.com/remyasantos/Homeruns → Actions → "Daily MLB HR Slate" → Run workflow

### How to check status
```bash
curl https://raw.githubusercontent.com/remyasantos/Homeruns/main/public/last-run.json
```
Status values: `success` | `no-games` | `validation-failed`

### If the pipeline fails (`validation-failed`)
1. Check the Actions log for the error step
2. For a quick patch: edit `public/data.js` manually, run `node validate-data.js`, commit and push
3. For full regeneration: see `DATA_UPDATE_INSTRUCTIONS.txt`

### Pipeline integrity guards
- `fetch_slate.py` must ONLY write to `scripts/raw_slate.json` — never `public/data.js`
- Off-day guard: if fewer than 4 games, `data.js` is never staged
- Sanity check: workflow confirms `data.js` starts with `const ` before staging
- `validate-data.js` must pass or the commit is blocked

---

## System 2: Statcast Matchups Dashboard

### What it does
Fetches pitcher/hitter Statcast data from Baseball Savant (xwOBA, barrel%,
hard-hit%, zone data, pitch arsenal), scores all pitcher-vs-batter matchups
for today's games, and writes `public/matchups_data.js` for the KASPER-style
dashboard at `public/matchups.html`.

### Pipeline scripts
```
scripts/fetch_slate.py         MLB Stats API             → scripts/raw_slate.json
scripts/fetch_savant.py        Baseball Savant CSV API   → scripts/savant_data.json
scripts/score_matchups.py      Matchup scoring model     → scripts/matchups.json
scripts/generate_matchups_js.py  JS serializer           → public/matchups_data.js
```

### How to access
Open `public/matchups.html` in a browser. The page loads `public/matchups_data.js`
via a `<script>` tag. It shows:
- All today's games as tabs
- Per-game pitcher stats and slate ranking
- Best batter matchups with Statcast metrics (KHR, xwOBA, barrel%, zone fit)
- SVG zone heat maps for pitchers and hitters
- CSV export for each game

### How to manually trigger
GitHub Actions UI:
> github.com/remyasantos/Homeruns → Actions → "Daily Statcast Matchups" → Run workflow

### How to check if it ran
Look at the most recent commit — if it says `data: Statcast matchups ...` it ran.
Or check Actions → "Daily Statcast Matchups" → latest run log.

### If Savant is down or data is missing
All three Savant steps use `continue-on-error: true`. The pipeline degrades
gracefully: if `savant_data.json` is empty or missing, `score_matchups.py`
falls back to ERA-derived xwOBA estimates so `matchups_data.js` is still
generated with partial data. The UI will show dashes for unavailable stats.

### Scoring model (how to update)
- **KHR score**: `xwoba_vs_pitcher_hand × 170` — edit in `scripts/score_matchups.py`, function `compute_khr()`
- **Zone fit**: dot product of pitcher pitch-frequency-per-zone × batter xwOBA-per-zone
- **Matchup score**: weighted sum of khr_norm + zone_fit_norm + park_bonus + power_raw + weather_bonus
- Edit weights in `scripts/score_matchups.py` near the `WEIGHTS` dict at the top of the file
- The dashboard UI layout is in `public/matchups.html` — all rendering is client-side JS, no build step

### What the matchups workflow does NOT touch
- `public/data.js` — never written by any matchups script
- `public/last-run.json` — only the slate pipeline writes this
- `scripts/raw_slate.json` — generated fresh at runtime, gitignored

---

## Daily Schedule (full picture)

| Time (ET) | Process | Output |
|-----------|---------|--------|
| ~7:00 AM | `daily-slate.yml` (GitHub Actions) | `public/data.js` + `public/last-run.json` |
| 9:00 AM | `daily-matchups.yml` (GitHub Actions) | `public/matchups_data.js` |
| 9:30 AM | Daily quality-check agent (Claude Code) | Enhanced `public/data.js` copy + tier fixes |

The slate pipeline runs first so today's starters are known when the matchups
pipeline fetches Savant data two hours later.

---

## Project File Map

```
public/
  parlays.html        — HR parlay picks UI
  matchups.html       — Statcast matchups dashboard (KASPER-style)
  data.js             — daily slate data (written by slate pipeline)
  matchups_data.js    — daily matchup data (written by matchups pipeline)
  last-run.json       — slate pipeline status

scripts/
  fetch_slate.py      — MLB Stats API + weather (used by BOTH pipelines)
  tier_engine.py      — HR scoring model
  parlay_builder.py   — parlay construction
  generate_data_js.py — JS serializer for parlays
  fetch_savant.py     — Baseball Savant Statcast fetch
  score_matchups.py   — matchup scoring model
  generate_matchups_js.py — JS serializer for matchups
  requirements.txt    — MLB-StatsAPI, requests, pandas

.github/workflows/
  daily-slate.yml     — slate pipeline (11:00 UTC)
  daily-matchups.yml  — matchups pipeline (13:00 UTC)

validate-data.js      — Node schema validator for data.js
DATA_UPDATE_INSTRUCTIONS.txt — manual fallback for slate pipeline
```

---

## Manual Data Patch (quick fix — slate only)

```bash
# edit public/data.js
node validate-data.js
git add public/data.js
git commit -m "data: manual patch — [reason]"
git push origin main
```

## Manual Full Regeneration (slate pipeline failure)

See `DATA_UPDATE_INSTRUCTIONS.txt`. Use only when `last-run.json` shows
`"status": "validation-failed"`.
