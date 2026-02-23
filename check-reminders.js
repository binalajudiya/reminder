// check-reminders.js
// Runs via GitHub Actions every 5 minutes
// Checks Firebase Realtime DB for due reminders and sends FCM push notifications

const { GoogleAuth } = require('google-auth-library');
const fetch = require('node-fetch');

const DB_URL = process.env.FIREBASE_DB_URL;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

async function main() {
  // Parse service account from GitHub secret
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  // Get OAuth2 access token for Firebase APIs
  const auth = new GoogleAuth({
    credentials: serviceAccount,
    scopes: [
      'https://www.googleapis.com/auth/firebase.database',
      'https://www.googleapis.com/auth/firebase.messaging'
    ]
  });
  const client = await auth.getClient();
  const tokenRes = await client.getAccessToken();
  const accessToken = tokenRes.token;

  console.log('✅ Authenticated with Firebase');

  // Read all couples from Realtime Database
  const dbRes = await fetch(`${DB_URL}/couples.json?auth=${accessToken}`);
  if (!dbRes.ok) {
    console.error('❌ Failed to read database:', dbRes.status, await dbRes.text());
    return;
  }
  const couples = await dbRes.json();
  if (!couples) {
    console.log('No couples found in database');
    return;
  }

  // Current time — generate checks for all timezones (UTC-12 to UTC+14)
  const now = new Date();
  const timeChecks = [];
  for (let offset = -12; offset <= 14; offset++) {
    const d = new Date(now.getTime() + offset * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    timeChecks.push({ date: dateStr, time: timeStr });

    // Also check 1-4 minutes ago (in case cron was slightly late)
    for (let mBack = 1; mBack <= 4; mBack++) {
      const dBack = new Date(d.getTime() - mBack * 60000);
      const dateBack = dBack.toISOString().split('T')[0];
      const timeBack = `${String(dBack.getHours()).padStart(2, '0')}:${String(dBack.getMinutes()).padStart(2, '0')}`;
      timeChecks.push({ date: dateBack, time: timeBack });
    }
  }

  console.log(`⏰ Checking ${Object.keys(couples).length} couple(s) at UTC ${now.toISOString()}`);

  let totalSent = 0;

  for (const [coupleId, coupleData] of Object.entries(couples)) {
    const reminders = coupleData.reminders || {};
    const tokens = coupleData.tokens || {};
    const info = coupleData.info || {};

    if (Object.keys(tokens).length === 0) continue;

    for (const [remId, reminder] of Object.entries(reminders)) {
      if (reminder.done) continue;
      if (reminder.notified) continue;

      // Check if this reminder is due
      const isDue = timeChecks.some(tc => tc.date === reminder.date && tc.time === reminder.time);
      if (!isDue) continue;

      console.log(`🔔 Reminder due: "${reminder.message}" for ${reminder.assignee} in couple ${coupleId}`);

      // Find target devices
      const targetTokens = [];
      for (const [tokenKey, tokenData] of Object.entries(tokens)) {
        if (reminder.assignee === 'both' || tokenData.role === reminder.assignee) {
          targetTokens.push(tokenData.token);
        }
      }

      if (targetTokens.length === 0) {
        console.log('  ⚠️ No matching device tokens');
        continue;
      }

      // Build assignee name
      const assigneeName = reminder.assignee === 'person1' ? (info.person1 || 'Person 1') :
                           reminder.assignee === 'person2' ? (info.person2 || 'Person 2') : 'Both';

      // Send push to each device
      for (const token of targetTokens) {
        const fcmPayload = {
          message: {
            token: token,
            notification: {
              title: `⏰ Reminder for ${assigneeName}`,
              body: reminder.message
            },
            data: {
              coupleId: coupleId,
              reminderId: remId,
              assignee: reminder.assignee
            },
            webpush: {
              notification: {
                icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f495/512.png',
                vibrate: [200, 100, 200],
                requireInteraction: true
              }
            }
          }
        };

        try {
          const fcmRes = await fetch(
            `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(fcmPayload)
            }
          );

          if (fcmRes.ok) {
            console.log(`  ✅ Push sent to ${token.substring(0, 15)}...`);
            totalSent++;
          } else {
            const errText = await fcmRes.text();
            console.error(`  ❌ FCM error: ${fcmRes.status} ${errText}`);

            // Remove invalid tokens
            if (fcmRes.status === 404 || fcmRes.status === 400) {
              const badKey = Object.entries(tokens).find(([k, v]) => v.token === token)?.[0];
              if (badKey) {
                await fetch(`${DB_URL}/couples/${coupleId}/tokens/${badKey}.json?auth=${accessToken}`, {
                  method: 'DELETE'
                });
                console.log(`  🗑 Removed invalid token`);
              }
            }
          }
        } catch (err) {
          console.error(`  ❌ Send error:`, err.message);
        }
      }

      // Mark as notified
      await fetch(`${DB_URL}/couples/${coupleId}/reminders/${remId}/notified.json?auth=${accessToken}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(true)
      });
    }
  }

  console.log(`\n✨ Done! Sent ${totalSent} push notification(s)`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
