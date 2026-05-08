# Homeruns MLB HR Parlay Board

## Authentication Setup (CRITICAL — run this first, every run)

The session prompt always contains a `PAT=github_pat_...` variable at the top. **At the very start of Step 0**, write that PAT into the credential store and configure git to use it. This must happen before the clone:

```bash
printf 'https://remyasantos:PASTE_PAT_HERE@github.com\n' > /root/.git-credentials
chmod 600 /root/.git-credentials
git config --global credential.helper store
```

Replace `PASTE_PAT_HERE` with the exact token from the `PAT=` line in the session prompt.

After cloning, reset the remote to the clean URL (no embedded PAT):

```bash
git remote set-url origin https://github.com/remyasantos/Homeruns.git
```

Then push with:
```bash
git push origin main
```

**Why this works:** writing the PAT to `/root/.git-credentials` on every run means the credential store is always up to date with whatever token was provided in the session prompt. The push step never needs the token in the URL, and a stale or expired credential is overwritten automatically on the next run.

**Never push with a hardcoded PAT in the URL.** The credential store handles auth automatically once set up.

## Project Structure

- `public/data.js` — main data file, regenerated daily by the scheduled agent
- `public/parlays.html` — the board UI, loads data.js at runtime
- `public/last-run.json` — status of the last agent run
- `validate-data.js` — schema validator, run with `node validate-data.js`
- `DATA_UPDATE_INSTRUCTIONS.txt` — full data format spec for the daily agent

## Daily Agent Steps

See the session prompt for the full step-by-step. Key overrides from this file:

1. **Step 0 — before clone:** write the session PAT into `/root/.git-credentials` and run `git config --global credential.helper store`
2. **After cloning:** run `git remote set-url origin https://github.com/remyasantos/Homeruns.git`
3. **Step 7 push:** use `git push origin main` — do NOT use the hardcoded PAT URL from the session prompt's Step 7
4. Read `DATA_UPDATE_INSTRUCTIONS.txt` in full before generating data.js
