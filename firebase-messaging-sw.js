// Firebase Messaging Service Worker
// This runs in the background and receives push notifications even when app is closed

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAn4zE7zPyv7E8FObb3GdhkDuhs5OvTrzs",
  authDomain: "reminder-c471c.firebaseapp.com",
  projectId: "reminder-c471c",
  messagingSenderId: "748294654989",
  appId: "1:748294654989:web:8f20508178fce97305d944"
});

const messaging = firebase.messaging();

// Handle background messages (when app is closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message:', payload);

  const title = payload.notification?.title || '⏰ We Remember';
  const body = payload.notification?.body || 'You have a reminder!';

  self.registration.showNotification(title, {
    body: body,
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💕</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>',
    vibrate: [200, 100, 200],
    tag: payload.data?.reminderId || 'reminder',
    renotify: true,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'done', title: '✓ Done' }
    ]
  });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      return clients.openWindow('/');
    })
  );
});
