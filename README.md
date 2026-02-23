# 💕 We Remember

A shared reminder app for couples. Never forget the onions again!

## Features
- 🔄 **Real-time sync** — Add a reminder on your phone, your partner sees it instantly
- 👫 **Assign to anyone** — Mark reminders for you, your partner, or both
- 🔔 **Notifications** — Get alerted at the exact time with sound + browser notifications
- 📱 **Works on phones** — Add to home screen for an app-like experience
- 🔗 **Couple code** — Simple pairing system, no passwords needed
- ✅ **Track completion** — Mark done, edit, or delete reminders

## Setup

### 1. Create a Firebase Project (free)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Create a project** → name it `we-remember`
3. Go to **Build** → **Realtime Database** → **Create Database** → Start in **test mode**
4. Click ⚙️ **Project Settings** → scroll to **Your apps** → click `</>` (web)
5. Register app and **copy the config values**

### 2. Add Your Config
Open `index.html` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← replace
  authDomain: "YOUR_PROJECT...",     // ← replace
  databaseURL: "https://YOUR...",    // ← replace
  projectId: "YOUR_PROJECT",        // ← replace
  storageBucket: "YOUR_PROJECT...",  // ← replace
  messagingSenderId: "YOUR...",      // ← replace
  appId: "YOUR_APP_ID"              // ← replace
};
```

### 3. Deploy to Netlify
1. Go to [Netlify](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project** → **GitHub**
3. Select this repo → Deploy!
4. Rename your site to something nice like `we-remember-app`

### 4. Start Using
- **You**: Open the URL → "Create Our Space" → enter both names → get a 6-letter code
- **Partner**: Open same URL → enter the code → pick their name
- **Both**: Add to home screen for app-like experience

## Tech Stack
- Vanilla HTML/CSS/JavaScript (no build step needed)
- Firebase Realtime Database (free tier)
- Netlify (free hosting)
- Web Audio API (notification chimes)
- Web Notifications API

## License
MIT — use it however you like!
