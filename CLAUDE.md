# Homeruns MLB HR Parlay Board

## Authentication Setup (run this first every session)

```bash
PAT_FROM_PROMPT="${PAT:-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}"

printf 'https://remyasantos:%s@github.com\n' "$PAT_FROM_PROMPT" > /root/.git-credentials
chmod 600 /root/.git-credentials
git config --global credential.helper store

HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $PAT_FROM_PROMPT" \
  https://api.github.com/repos/remyasantos/Homeruns)
[ "$HTTP" = "200" ] && echo "✅ PAT ok" || echo "❌ PAT invalid — regenerate at github.com/settings/tokens"
```

If the PAT fails, generate a new classic token (no expiration, `repo` scope) at
https://github.com/settings/tokens and update the default above.

After cloning, reset the remote URL:
```bash
git remote set-url origin https://github.com/remyasantos/Homeruns.git
```

Push fallback (if credential store doesn't work):
```bash
git push https://remyasantos:${PAT_FROM_PROMPT}@github.com/remyasantos/Homeruns.git main
```

---

## Daily Schedule & Flow

Two automated processes run each morning in sequence:

| Time (ET)  | Process | What it does |
|------------|---------|-------------|
| ~7:00 AM*  | GitHub Actions pipeline | Fetches MLB Stats API + weather, scores 50 players, builds 15 parlays, commits `data.js` |
| 9:30 AM    | Daily quality-check agent | Validates pipeline output, fixes any schema warnings, enhances copy, pushes clean version |

\* Scheduled at 7:00 AM ET (11:00 UTC). GitHub Actions runner queue typically
adds 1–2 hours of delay, so it usually completes by 8:30–9:00 AM ET — before
the agent runs.

**The pipeline costs $0 — no Claude API, no secrets required.**

```
scripts/fetch_slate.py       MLB Stats API + wttr.in → scripts/raw_slate.json
scripts/tier_engine.py       Score/tier 50 players  → scripts/scored_players.json
scripts/parlay_builder.py    Build 15 parlays        → scripts/parlays.json
scripts/generate_data_js.py  Deterministic notes     → public/data.js
validate-data.js             Schema validation
.github/workflows/daily-slate.yml  Orchestration (cron 7 AM ET / 11:00 UTC)
```

Intermediate JSON files (`scripts/*.json`) are generated at runtime and are
gitignored — do not commit them.

---

## Project Structure

```
public/
  parlays.html    — the UI (static HTML, loads data.js via <script>)
  data.js         — daily generated data (committed by the pipeline)
  last-run.json   — pipeline status: success | no-games | validation-failed
scripts/
  fetch_slate.py  — MLB Stats API fetch + weather enrichment
  tier_engine.py  — scoring model + tier assignment
  parlay_builder.py — parlay construction
  generate_data_js.py — JS serializer with deterministic text generation
  requirements.txt
validate-data.js  — Node schema validator (uses only built-in modules)
DATA_UPDATE_INSTRUCTIONS.txt — full schema reference + manual fallback prompt
```

---

## Manual Trigger

GitHub Actions UI:
> github.com/remyasantos/Homeruns → Actions → "Daily MLB HR Slate" → Run workflow

---

## Manual Data Patch (quick fix)

To patch a single player stat in `public/data.js` without regenerating:

```bash
git clone https://github.com/remyasantos/Homeruns.git
cd Homeruns
git remote set-url origin https://github.com/remyasantos/Homeruns.git
# edit public/data.js
node validate-data.js
git add public/data.js
git commit -m "data: manual patch — [reason]"
git push origin main
```

---

## Manual Full Regeneration (pipeline failure fallback)

See `DATA_UPDATE_INSTRUCTIONS.txt` — the manual fallback section has a
self-contained Claude prompt that generates a complete `data.js` replacement.
Use this only when `public/last-run.json` shows `"status": "validation-failed"`.

---

## Commit Signing

GitHub Actions runner requires:
```bash
git config --global commit.gpgsign false
```
