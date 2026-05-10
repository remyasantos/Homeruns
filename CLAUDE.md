# Homeruns MLB HR Parlay Board

## Authentication Setup (CRITICAL — run this first, every run)

**Step 0 — before clone**, run this block exactly:

```bash
PAT_FROM_PROMPT="PASTE_PAT_HERE"   # replace with PAT= value from session prompt

# 1. Write to credential store
printf 'https://remyasantos:%s@github.com\n' "$PAT_FROM_PROMPT" > /root/.git-credentials
chmod 600 /root/.git-credentials
git config --global credential.helper store

# 2. Verify the PAT works before continuing — catch expired tokens immediately
HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $PAT_FROM_PROMPT" \
  https://api.github.com/repos/remyasantos/Homeruns)
if [ "$HTTP" != "200" ]; then
  echo "❌ PAT INVALID (HTTP $HTTP) — stopping. Provide a fresh token."
  exit 1
fi
echo "✅ PAT verified (HTTP $HTTP)"
```

If the PAT check fails (HTTP 401), **stop immediately** and tell the user:
> "The PAT in the session prompt is expired. Please go to GitHub → Settings → Developer Settings → Personal Access Tokens and generate a new one with repo scope, then paste it at the top of the session prompt as `PAT=github_pat_...`"

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

## ⚠️ PERMANENT FIX — Stop the daily token rotation

The session prompt currently uses a **fine-grained PAT that expires**. This is why a new token is required every run.

**One-time fix (takes 5 minutes):**

1. Go to: https://github.com/settings/tokens → **"Tokens (classic)"** tab
2. Click **"Generate new token (classic)"**
3. Set expiration to **"No expiration"**
4. Check only the **`repo`** scope
5. Generate and copy the token (it will start with `ghp_`)
6. Open the **scheduled agent session prompt** and replace the `PAT=github_pat_...` line with the new `ghp_...` token
7. Done — never touch it again unless you manually revoke it

Classic tokens with no expiration are supported by GitHub and will persist indefinitely. Fine-grained PATs (github_pat_...) have mandatory expiration enforced by GitHub policy.

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
