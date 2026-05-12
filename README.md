# Homeruns — Daily MLB HR Parlay Board

Data-driven MLB home run picks and parlay builder. Updated automatically every morning at 9:00 AM ET.

## How It Works

A GitHub Actions pipeline runs daily and commits an updated `public/data.js`:

| Script | Does |
|---|---|
| `fetch_slate.py` | Pulls today's schedule, probable pitchers, batter/pitcher stats from MLB Stats API; fetches weather from wttr.in |
| `tier_engine.py` | Scores every batter 0–100 (40% pitcher disaster + 30% park factor + 30% batter power); assigns S/A/B/C tiers |
| `parlay_builder.py` | Builds 15 validated parlay combinations (4-leg through 10-leg) |
| `generate_data_js.py` | Writes `public/data.js` with deterministic stat-grounded notes |
| `validate-data.js` | Schema validation before push |

**Zero cost to run** — no paid APIs, no Claude API tokens.

## Files

```
public/parlays.html     — the UI (static HTML)
public/data.js          — daily data (auto-committed by pipeline)
public/last-run.json    — pipeline run status
scripts/                — Python pipeline
validate-data.js        — Node schema validator
DATA_UPDATE_INSTRUCTIONS.txt — schema reference + manual fallback prompt
```

## Manual Trigger

GitHub Actions → Daily MLB HR Slate → Run workflow

## Fallback

If the pipeline fails, `public/last-run.json` will show `"status": "validation-failed"`.
See `DATA_UPDATE_INSTRUCTIONS.txt` for the manual Claude fallback prompt.
