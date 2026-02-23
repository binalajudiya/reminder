# 🔔 Push Notifications via GitHub Actions — Setup Guide

No Blaze plan, no terminal, no credit card. Just upload files on GitHub.

---

## What You Upload to GitHub

Add these NEW files to your repo (alongside existing index.html):

```
your-repo/
├── index.html                          ← REPLACE (updated with FCM)
├── firebase-messaging-sw.js            ← NEW (receives push on phone)
├── check-reminders.js                  ← NEW (checks & sends push)
├── netlify.toml                        ← same as before
└── .github/
    └── workflows/
        └── reminder-check.yml          ← NEW (runs every 5 min)
```

---

## STEP 1: Get Firebase Service Account Key (3 min)

1. Go to **Firebase Console** → your project (reminder)
2. Click ⚙️ **Project Settings** (gear icon, top left)
3. Go to **"Service accounts"** tab
4. Click **"Generate new private key"**
5. Click **"Generate key"** in the popup
6. A JSON file downloads — **keep this file safe, don't share it publicly!**

## STEP 2: Add the Key to GitHub Secrets (2 min)

1. Go to your GitHub repo → **Settings** tab (top menu)
2. In left sidebar: **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: **FIREBASE_SERVICE_ACCOUNT**
5. Value: Open the downloaded JSON file in Notepad, **copy ALL the text**, paste it here
6. Click **"Add secret"**

## STEP 3: Upload Files to GitHub (3 min)

Go to your repo on GitHub and upload/replace these files:

### Replace existing:
- **index.html** → replace with the new one

### Add new files in root:
- **firebase-messaging-sw.js**
- **check-reminders.js**

### Add new folder + file:
- Create folder **.github** → inside it **workflows** → inside it **reminder-check.yml**

**Easiest way to create the folder structure:**
1. In your repo, click **"Add file"** → **"Create new file"**
2. In the filename box type: `.github/workflows/reminder-check.yml`
3. Paste the content of the file
4. Commit

## STEP 4: Enable GitHub Actions (1 min)

1. Go to your repo → **Actions** tab
2. If you see "Workflows aren't being run" → Click **"I understand my workflows, go ahead and enable them"**
3. You should see the "Check Reminders & Send Push" workflow listed

## STEP 5: Test It! (2 min)

1. Open your app on your phone → status bar should show **PUSH: ✅ ON**
2. Go to GitHub repo → **Actions** tab
3. Click **"Check Reminders & Send Push"** workflow
4. Click **"Run workflow"** → **"Run workflow"** (green button)
5. If you have a due reminder, you'll get a push notification!

---

## How It Works

Every 5 minutes, GitHub Actions:
1. Reads your Firebase database
2. Finds reminders that are due right now
3. Sends a push notification to the right phone(s)
4. Marks the reminder as "notified" so it doesn't send again

**Even if your phone is locked and the app is closed, you get the notification!**

---

## Troubleshooting

**Actions tab shows errors?**
→ Check that the secret name is exactly `FIREBASE_SERVICE_ACCOUNT` (case-sensitive)
→ Check that you pasted the ENTIRE JSON file content

**Push status shows "⚠️ Set VAPID key"?**
→ Make sure you're using the updated index.html (VAPID key is already set)

**Not getting push on phone?**
→ Make sure you allowed notifications when the app asked
→ On iPhone: must add to Home Screen first for push to work

**Workflow doesn't run?**
→ Go to Actions tab and enable workflows
→ Note: GitHub cron can be delayed by 1-5 minutes, so reminders may arrive up to 10 min after the set time

---

## Limits (all FREE)

| Service | Free Limit | Your Usage |
|---------|-----------|------------|
| GitHub Actions | 2,000 min/month | ~180 min/month (9%) |
| FCM Push | Unlimited | A few/day |
| Firebase DB (Spark) | 1 GB + 10 GB transfer | ~1 MB |
| Netlify | 100 GB/month | ~10 MB |

**Total cost: $0 forever** 🎉
