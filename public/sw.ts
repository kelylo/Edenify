/// <reference lib="webworker" />

/**
 * Service Worker for background Bible reminder handling
 * Runs even when app is closed/backgrounded on mobile
 */

declare const self: ServiceWorkerGlobalScope;

// Workbox manifest injection point (required for injectManifest strategy)
declare const self: any;
const MANIFEST = (self as any).__WB_MANIFEST || [];

// Precache manifest entries
MANIFEST.forEach((entry: any) => {
  // Manifest is auto-injected by Workbox
});

// Listen for push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Edenify';
  const options = {
    body: data.body || 'Time for your reminder',
    icon: '/edenify-logo.png',
    badge: '/edenify-logo.png',
    tag: data.tag || 'edenify-reminder',
    renotify: true,
    vibrate: [240, 120, 240],
    requireInteraction: false,
    data: data.data || { url: '/' },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Listen for notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Reuse existing app window and navigate it to the deep-link target.
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          const windowClient = client as WindowClient;
          if ('navigate' in windowClient) {
            return windowClient.navigate(url).then((navigated) => navigated?.focus() || windowClient.focus());
          }
          return windowClient.focus();
        }
      }
      // Open new window if not open
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Listen for periodic background sync (for Bible reminders)
self.addEventListener('sync', (event) => {
  if (event.tag === 'bible-reminder-sync') {
    event.waitUntil(checkBibleReminder());
  }
});

/**
 * Check if it's time to send Bible reminder
 * Runs in background every 15 minutes (or when triggered)
 */
async function checkBibleReminder(): Promise<void> {
  try {
    // Get user preferences and Bible reminder settings from IndexedDB
    const dbRequest = indexedDB.open('edenify');
    
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('edenify');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        resolve(request.result);
      };
    });

    // Try to fetch current state from backend API
    const response = await fetch('/api/user/bible-reminder-check', {
      method: 'GET',
    }).catch(() => null);

    if (!response || !response.ok) {
      console.debug('[SW] Bible reminder check skipped - offline or no auth');
      return;
    }

    const data = await response.json();
    
    if (data.shouldNotify && data.reminder) {
      const title = data.reminder.title || '📖 Daily Scripture';
      const options = {
        body: data.reminder.body || 'Time for your Bible reading',
        icon: '/edenify-logo.png',
        badge: '/edenify-logo.png',
        tag: 'bible-reminder',
        renotify: true,
        vibrate: [240, 120, 240],
        requireInteraction: true, // Keep until user dismisses
        data: { url: '/', isReminder: true },
      };

      console.log('[SW] Showing Bible reminder:', title);
      await self.registration.showNotification(title, options);

      // Notify backend that reminder was sent
      await fetch('/api/user/bible-reminder-sent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: data.day, date: new Date().toISOString() }),
      }).catch(() => null);
    }
  } catch (error) {
    console.error('[SW] Error checking Bible reminder:', error);
  }
}

// Listen for messages from clients
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  if (type === 'REGISTER_BIBLE_SYNC') {
    // Register periodic background sync when user sets reminder
    if ('periodicSync' in self.registration) {
      (self.registration as any).periodicSync.register('bible-reminder-sync', {
        minInterval: 15 * 60 * 1000, // 15 minutes
      }).catch((error) => {
        console.warn('[SW] Failed to register periodic sync:', error);
      });
      console.log('[SW] Periodic Bible reminder sync registered');
    }
  }

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  self.skipWaiting();
});

// Handle activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  event.waitUntil(clients.claim());
});
