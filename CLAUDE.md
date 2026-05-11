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
> "The PAT in the session prompt is expired. To permanently fix this, follow the **PERMANENT FIX** section below and generate a classic token (`ghp_...`) with no expiration. Until then, provide a fresh token and update the session prompt PAT= line."

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

## 🚨 PERMANENT FIX — YOU MUST DO THIS ONCE TO STOP DAILY TOKEN FAILURES

**Why this keeps breaking:** You are using a fine-grained PAT (`github_pat_...`).
GitHub **forces these to expire** — there is no way around it in automation.
Every day the token expires, the agent fails to push.

**The fix takes 3 minutes and is permanent:**

1. Open: **https://github.com/settings/tokens** — click **"Tokens (classic)"** tab
2. Click **"Generate new token (classic)"**
3. Set **Expiration → "No expiration"**
4. Check only the **`repo`** scope checkbox
5. Click **Generate token** — copy the token (starts with `ghp_`, NOT `github_pat_`)
6. In your **scheduled agent session prompt**, replace the `PAT=github_pat_...` line with `PAT=ghp_...`
7. That's it — you never touch it again

**Classic tokens with no expiration never rotate.** The `ghp_` prefix means classic.
The `github_pat_` prefix means fine-grained = expires = breaks daily.

Until you do this, you will need to paste a new token into the session prompt every time the current one expires.

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
