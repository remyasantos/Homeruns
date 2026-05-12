# Homeruns MLB HR Parlay Board

## Authentication Setup (CRITICAL — run this first, every run)

**Step 0 — before clone**, run this block exactly:

```bash
# Classic PAT — no expiration, repo scope
PAT_FROM_PROMPT="${PAT:-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}"

# 1. Write to credential store
printf 'https://remyasantos:%s@github.com\n' "$PAT_FROM_PROMPT" > /root/.git-credentials
chmod 600 /root/.git-credentials
git config --global credential.helper store

# 2. Verify the PAT works before continuing
HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $PAT_FROM_PROMPT" \
  https://api.github.com/repos/remyasantos/Homeruns)
if [ "$HTTP" != "200" ]; then
  echo "❌ PAT INVALID (HTTP $HTTP) — token may have been revoked. Update the default in CLAUDE.md."
  exit 1
fi
echo "✅ PAT verified (HTTP $HTTP)"
```

If the PAT check fails, the classic token was revoked. Generate a new one at
https://github.com/settings/tokens (classic, no expiration, repo scope) and update
the default value in the line above.

After cloning, reset the remote to the clean URL:

```bash
git remote set-url origin https://github.com/remyasantos/Homeruns.git
```

Then push with:
```bash
git push origin main
```

**Push fallback:** If `git push origin main` fails despite the credential store being written, push directly with the PAT embedded in the URL:
```bash
git push https://remyasantos:${PAT_FROM_PROMPT}@github.com/remyasantos/Homeruns.git main
```

---

## ✅ Token Status — Classic PAT installed, no expiration

A classic PAT (`ghp_...`) with no expiration is now hardcoded as the default in Step 0 above.
The daily agent no longer needs a token in the session prompt — it will use the default automatically.

If the token is ever revoked and needs replacing:
1. Go to https://github.com/settings/tokens → **Tokens (classic)**
2. Generate new token — **No expiration**, `repo` scope only
3. Update the default value in the Step 0 block in this file

---

## Project Structure

- `public/data.js` — main data file, regenerated daily by the scheduled agent
- `public/parlays.html` — the board UI, loads data.js at runtime
- `public/last-run.json` — status of the last agent run
- `validate-data.js` — schema validator, run with `node validate-data.js`
- `DATA_UPDATE_INSTRUCTIONS.txt` — full data format spec for the daily agent

## Daily Agent Steps

See the session prompt for the full step-by-step. Key overrides from this file:

1. **Step 0 — before clone:** verify PAT via API (HTTP 200), write to `/root/.git-credentials`, run `git config --global credential.helper store`
2. **After cloning:** run `git remote set-url origin https://github.com/remyasantos/Homeruns.git`
3. **Step 7 push:** try `git push origin main` first; if it fails auth, push with the PAT embedded in the URL as the fallback
4. Read `DATA_UPDATE_INSTRUCTIONS.txt` in full before generating data.js
