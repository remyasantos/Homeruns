# Homeruns MLB HR Parlay Board

## Authentication Setup (run this first every session)

The task prompt passes a `PAT=` value. That PAT may be expired — **always
fall back to the one hardcoded below** if the prompt PAT returns 401.

```bash
# Prefer PAT passed in task prompt; fall back to the long-lived token below.
PAT_FROM_PROMPT="${PAT:-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}"

printf 'https://remyasantos:%s@github.com\n' "$PAT_FROM_PROMPT" > /root/.git-credentials
chmod 600 /root/.git-credentials
git config --global credential.helper store

HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $PAT_FROM_PROMPT" \
  https://api.github.com/repos/remyasantos/Homeruns)
[ "$HTTP" = "200" ] && echo "✅ PAT ok" || echo "❌ PAT invalid — try fallback below"
```

**If both PATs fail (401):**
1. The owner must generate a new classic token at https://github.com/settings/tokens
   → No expiration · repo scope only
2. Update the fallback default in this file (`ghp_Dt...`) with the new token
3. Commit and push CLAUDE.md so future sessions pick it up automatically

After cloning, embed the PAT in the remote URL (most reliable, avoids credential-helper issues):
```bash
git remote set-url origin https://remyasantos:${PAT_FROM_PROMPT}@github.com/remyasantos/Homeruns.git
```

One-shot push fallback (use if remote URL still fails):
```bash
git push https://remyasantos:${PAT_FROM_PROMPT}@github.com/remyasantos/Homeruns.git main
```

### Verifying after push
```bash
git fetch origin main
git log --oneline origin/main -3
```
If your commit appears, the push succeeded. If `origin/main` still shows the
old commit, the remote URL doesn't have the PAT embedded — re-run `git remote set-url` above.

---

## Pipeline Integrity

`scripts/fetch_slate.py` must ONLY write to `scripts/raw_slate.json`.
If the site ever shows "FAILED TO LOAD DATA" or `SLATE_DATE is not defined`,
check whether `fetch_slate.py` has been corrupted:

```bash
head -5 scripts/fetch_slate.py
# First line must be: #!/usr/bin/env python3
# Must import statsapi, not fetch random URLs
```

If the file has been replaced with garbage (e.g., fetches Walmart/Jina URLs,
writes directly to `public/data.js`), restore it:

```bash
git log --oneline scripts/fetch_slate.py     # find the last good commit
git show <good-commit>:scripts/fetch_slate.py > scripts/fetch_slate.py
```

The workflow (`daily-slate.yml`) has two defences against pipeline corruption:
1. **Off-day guard**: on off-days, `data.js` is NEVER staged — only `last-run.json`
2. **Sanity check**: on game days, the workflow confirms `data.js` starts with
   `const ` before staging; validation (`node validate-data.js`) must also pass

These two guards mean a corrupted fetch script cannot silently overwrite a good `data.js`.

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
