# 📱 iPhone Push Notifications — Setup Guide

This version uses **Standard Web Push** (not FCM), which works on:
- ✅ iPhone/iPad (Safari, iOS 16.4+, added to Home Screen)
- ✅ Android (Chrome)
- ✅ Desktop (Chrome, Edge, Firefox)

---

## Files to Upload to GitHub (Netlify)

Replace/add ALL these files in your GitHub repo:

| File | Action |
|------|--------|
| `index.html` | **REPLACE** existing |
| `sw.js` | **ADD NEW** (root folder) |
| `manifest.json` | **ADD NEW** (root folder) |
| `icon-192.png` | **ADD NEW** (root folder) |
| `icon-512.png` | **ADD NEW** (root folder) |
| `netlify.toml` | Keep existing |

⚠️ **Delete** the old `firebase-messaging-sw.js` from your repo (not needed anymore)

---

## Update Cloudflare Worker

Your existing Cloudflare Worker needs the new code (standard Web Push instead of FCM):

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **we-remember-push**
2. Click **"Edit code"** (Quick Edit)
3. **Select all** → **delete** → **paste** contents of new `worker.js`
4. Click **"Deploy"**

5. Go to **Settings** → **Variables and Secrets**
6. **Add 2 new secrets:**

   | Name | Value |
   |------|-------|
   | `VAPID_PUBLIC_KEY` | `BP858DqGkMwcLK_HKkCIVCN4F0mheY7aaoyN2fQnaAflFMW2zPGKB-Vxp34nqajtxyXIDZ_BIaEIJGO4_axjDsw` |
   | `VAPID_PRIVATE_KEY` | `o1FnvMNMzdAMzrYvtN5ELUA7uYRcrO08N-tsUxrAGNk` |

   (Keep existing FIREBASE_SERVICE_ACCOUNT, FIREBASE_DB_URL, FIREBASE_PROJECT_ID)

---

## How to Use on iPhone

**IMPORTANT: Must follow these steps exactly!**

1. Open your Netlify URL in **Safari** (NOT Chrome!)
2. Tap the **Share button** (square with arrow at bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. Open the app from your **Home Screen icon**
6. When asked to allow notifications → tap **"Allow"**
7. Status bar should show **PUSH: ✅ ON**

Both you and your husband need to do this on your iPhones.

---

## Testing

1. Open app from Home Screen
2. Confirm status bar shows `PUSH: ✅ ON`
3. Add a reminder for **2 minutes from now**
4. **Close the app** (swipe it away)
5. Wait — you should get a push notification!

You can also test the Cloudflare Worker:
- Visit your worker URL in browser
- Check worker Logs to see if it found and sent notifications

---

## Troubleshooting

**PUSH: N/A (not supported)**
→ You're not opening from Home Screen, OR iOS is below 16.4
→ Must add to Home Screen from Safari first!

**PUSH: DENIED**
→ Go to iPhone Settings → your app (scroll down) → Allow Notifications
→ Or: Settings → Safari → Notifications → find your site → Allow

**PUSH: ERR**
→ Check browser console for details (Safari → Develop menu)

**No push when app is closed**
→ Check Cloudflare worker logs
→ Make sure VAPID keys are set in worker secrets
→ Make sure reminder doesn't already have `notified: true` in Firebase
