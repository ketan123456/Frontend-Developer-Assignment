self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const payload = event.data;

  if (!payload || payload.type !== 'SHOW_NOTIFICATION') {
    return;
  }

  const notification = payload.notification ?? {};

  event.waitUntil(
    self.registration.showNotification(notification.title || 'CareAxis alert', {
      body: notification.body || 'A new care coordination event needs review.',
      icon: '/brand-mark.svg',
      badge: '/brand-mark.svg',
      tag: notification.tag || 'careaxis-alert',
      data: notification.data || { url: '/dashboard' },
    }),
  );
});

self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};

  event.waitUntil(
    self.registration.showNotification(payload.title || 'CareAxis update', {
      body: payload.body || 'A new notification arrived from the operations hub.',
      icon: '/brand-mark.svg',
      badge: '/brand-mark.svg',
      tag: payload.tag || 'careaxis-push',
      data: payload.data || { url: '/dashboard' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      return self.clients.openWindow(targetUrl);
    }),
  );
});
