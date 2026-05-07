# Homeruns MLB HR Parlay Board

## Authentication Setup (CRITICAL — run this first)

Git credentials are stored persistently in `/root/.git-credentials`.
After every clone, reset the remote to the clean URL so the credential store is used instead of any embedded PAT in the clone URL:

```bash
git remote set-url origin https://github.com/remyasantos/Homeruns.git
```

Then push with:
```bash
git push origin main
```

**Never push with a hardcoded PAT in the URL.** The credential store handles auth automatically and does not expire with the clone URL.

If push fails with 401/auth error, update the stored credential:
```bash
printf 'https://remyasantos:NEW_PAT@github.com\n' > /root/.git-credentials
```

## Project Structure

- `public/data.js` — main data file, regenerated daily by the scheduled agent
- `public/parlays.html` — the board UI, loads data.js at runtime
- `public/last-run.json` — status of the last agent run
- `validate-data.js` — schema validator, run with `node validate-data.js`
- `DATA_UPDATE_INSTRUCTIONS.txt` — full data format spec for the daily agent

## Daily Agent Steps

See the session prompt for the full step-by-step. Key overrides from this file:

1. After cloning, always run: `git remote set-url origin https://github.com/remyasantos/Homeruns.git`
2. Push with `git push origin main` — do NOT use the hardcoded PAT URL from the session prompt's Step 7
3. Read `DATA_UPDATE_INSTRUCTIONS.txt` in full before generating data.js
