# Homeruns MLB HR Parlay Board — Agent Guide

---

## Authentication Setup (run this first every session)

The task prompt passes a `PAT=` value. That PAT may be expired — **always
fall back to the one hardcoded below** if the prompt PAT returns 401.

```bash
PAT_FROM_PROMPT="${PAT:-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}"

printf 'https://remyasantos:%s@github.com\n' "$PAT_FROM_PROMPT" > /root/.git-credentials
chmod 600 /root/.git-credentials
git config --global credential.helper store

HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $PAT_FROM_PROMPT" \
  https://api.github.com/repos/remyasantos/Homeruns)
[ "$HTTP" = "200" ] && echo "✅ PAT ok" || echo "❌ PAT invalid — try fallback below"
```

Embed the PAT in the remote URL (most reliable):
```bash
git remote set-url origin https://remyasantos:${PAT_FROM_PROMPT}@github.com/remyasantos/Homeruns.git
```

**If both PATs fail (401):**
1. Owner generates a new classic token: https://github.com/settings/tokens
   → No expiration · repo scope only
2. Update the fallback default in this file with the new token
3. Commit and push CLAUDE.md so future sessions pick it up automatically

**Git push note:** Direct git push is blocked by the session proxy. Use the
GitHub Git Data REST API (blob → tree → commit → PATCH ref) for all pushes:
```bash
# See push_api.py pattern used in prior sessions, or use:
git push https://remyasantos:${PAT_FROM_PROMPT}@github.com/remyasantos/Homeruns.git main
```

**Commit signing:** always run before committing:
```bash
git config --global commit.gpgsign false
```

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
| **Fails silently?** | No — writes `validation-failed` status | Partially — Savant steps use `continue-on-error`, but missing data becomes `null` in the output, never a fabricated stat |

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
scripts/fetch_slate.py         MLB Stats API              → scripts/raw_slate.json
scripts/fetch_savant.py        Baseball Savant CSV API    → scripts/savant_data.json
scripts/fetch_park_factors.js  BallparkPal→VSiN (Playwright) → scripts/park_factors.json
scripts/score_matchups.py      Matchup scoring model      → scripts/matchups.json
scripts/generate_matchups_js.py  JS serializer            → public/matchups_data.js
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
All three Savant steps use `continue-on-error: true`. **The pipeline never
fabricates a stat.** If `savant_data.json` is empty, missing, or a specific
player has no real Savant sample, every Statcast-derived field for that
player (`khr`, `xwoba`, `xwobac`, `ceiling`, `zone_fit`, `matchup_score`,
`pitcher_score`, `swstr_pct`, `hh_pct`, `brl_bip_pct`, `pull_brl_pct`,
`fb_pct`, `la`, `csw_pct`, `hard_hit_pct`) is written as `null` — never
estimated from ERA/K9/OPS/ISO proxies. `matchups_data.js` is still
generated with whatever real data is available; the UI shows `—` for
anything null. Real box-score stats (`era`, `whip`, `k9`, `bb9`, `fip`,
`ip`, `iso`, `hr_form`, `likely`) are unaffected since they come from the
MLB Stats API directly, not Savant.

Same principle for weather: `fetch_slate.py` fetches real per-game weather
and roof state from the MLB live game feed (`gameData.weather`) and the
venue's real `roofType` (via `/api/v1/venues/{id}?hydrate=fieldInfo`), with
`wttr.in` as a real (not fabricated) fallback for open-air parks when the
live feed hasn't posted yet. If a retractable-roof park's live status can't
be confirmed, `roof` is `null` (unknown) — never assumed open or closed.
The old behavior of hardcoding all retractable/dome parks to
`temp_f: 72, wind_mph: 0, roof: true` regardless of actual conditions was
removed because it silently zeroed out real wind data on open-roof days
(e.g. Rogers Centre, Chase Field).

### Park factors (BallparkPal, via BallparkPal or VSiN)
Neither MLB Stats API nor Baseball Savant expose a park-factor endpoint, so
`park_bonus` is sourced from BallparkPal's park-factor model — a real,
per-game HR factor that already combines stadium dimensions with today's
actual weather. `scripts/fetch_park_factors.js` (Playwright/Chromium,
required because both source pages render their tables client-side) tries
two sources in order:

1. **Primary — ballparkpal.com/Park-Factors.php.** Rows are keyed by the
   real MLB `gamePk` (BallparkPal's own game link uses the same gamePk MLB
   Stats API does — verified, not assumed), so the join to
   `score_matchups.py` is exact, not name-matched. This page's schema
   metadata (`isAccessibleForFree: false`) and its behavior under repeated
   same-day requests indicate at least part of the site is subscriber-gated
   — in testing, hitting it many times in one session eventually produced a
   "Select Your Plan / $10 a month" wall instead of the table. A single
   fetch per day (the pipeline's actual cadence) is expected to avoid this;
   if you need to test this script manually, don't run it more than once or
   twice in a short window.
2. **Fallback — vsin.com/projections-park-factors/**, used only if the
   primary returns nothing. This page republishes the same BallparkPal
   numbers for free (its own title is literally "Park Factors Powered by
   Ballpark Pal") and was verified to match BallparkPal's numbers exactly.
   It exposes no gamePk, so its rows are keyed by `"AWAY@HOME"` team
   abbreviations instead (normalized through `TEAM_ABBR_ALIASES` in
   `fetch_park_factors.js`, since BallparkPal/VSiN sometimes use a
   different abbreviation than MLB's, e.g. `CHW`/`WAS` vs. our `CWS`/`WSH`).
   `score_matchups.py` tries the gamePk key first, then this one.

This is a deliberate exception to "MLB Stats API or Savant only": no
authentic park-factor source exists on either of those, and the
alternatives (a static hardcoded rank table, or dropping the bonus term
entirely) were both judged less authentic than pulling the real number from
BallparkPal's model. If both sources fail or their markup changes,
`fetch_park_factors.js` writes an empty `{}` — `park_bonus` for a game
becomes `0` (no bonus), never a guessed rank-based number.

### Scoring model (how to update)
- **KHR score**: `xwoba_vs_pitcher_hand × 170` — edit in `scripts/score_matchups.py`, function `compute_khr()`
- **Zone fit**: dot product of pitcher pitch-frequency-per-zone × batter xwOBA-per-zone (real Savant zone data only — `None` if either side lacks it)
- **Park bonus**: BallparkPal's real per-game HR% factor, scaled and capped 0–10 — `0` if not available (see above)
- **Matchup score**: weighted sum of khr_norm + zone_fit_norm + park_bonus + power_raw + weather_bonus — `None` if khr/zone_fit/ceiling aren't all real
- Edit weights inline in `scripts/score_matchups.py`, function `compute_matchup_score()`
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
