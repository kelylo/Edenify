/// <reference lib="webworker" />

/**
 * Service Worker for background Bible reminder handling & alarm playback
 * Runs even when app is closed/backgrounded on mobile
 */

declare const self: ServiceWorkerGlobalScope;
declare const __EDEN_API_BASE__: string;

// Workbox manifest injection point (required for injectManifest strategy)
declare const self: any;
const MANIFEST = (self as any).__WB_MANIFEST || [];
const API_BASE = String(__EDEN_API_BASE__ || '').trim().replace(/\/+$/, '');

const apiUrl = (path: string) => {
  if (!path.startsWith('/')) return path;
  return API_BASE ? `${API_BASE}${path}` : path;
};

// Service Worker version for cache busting and updates
const SW_VERSION = Date.now().toString();
const CACHE_NAME = `edenify-v${Math.floor(Date.now() / 1000)}`;

// Precache manifest entries
MANIFEST.forEach((entry: any) => {
  // Manifest is auto-injected by Workbox
});

// Built-in alarm tones (sine wave)
const playAlarmTone = (frequency: number = 800, duration: number = 500): void => {
  // This runs in Service Worker context - audio playback limited
  // Real playback happens when notification is clicked/app opens
  console.log('[SW] Alarm notification - real playback when user interacts');
};

// Listen for push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Edenify';
  const options = {
    body: data.body || 'Time for your reminder',
    icon: '/edenify-logo.png',
    badge: '/edenify-logo.png',
    tag: data.tag || 'edenify-reminder',
    requireInteraction: false,
    data: data.data || { url: '/', isReminder: true, shouldPlayAlarm: true },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Listen for notification clicks (play alarm when user interacts)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  const shouldPlayAlarm = event.notification.data?.shouldPlayAlarm || false;

  // Send message to client to play alarm
  if (shouldPlayAlarm) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          client.postMessage({
            type: 'PLAY_ALARM',
            data: event.notification.data,
          });
        }
      })
    );
  }

  // Navigate to task
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
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
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// One-shot sync fallback.
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'bible-reminder-sync') {
    event.waitUntil(checkBackgroundReminder());
  }
});

// Periodic sync for background reminders.
self.addEventListener('periodicsync', (event: any) => {
  if (event.tag === 'bible-reminder-sync') {
    event.waitUntil(checkBackgroundReminder());
  }
});

/**
 * Check if it's time to send a background reminder
 * Runs in background every 15 minutes (or when triggered)
 */
async function checkBackgroundReminder(): Promise<void> {
  try {
    const response = await fetch(apiUrl('/api/user/reminder-check'), {
      method: 'GET',
    }).catch(() => null);

    if (!response || !response.ok) {
      console.debug('[SW] Background reminder check skipped - offline or no auth');
      return;
    }

    const data = await response.json();
    
    if (data.shouldNotify && data.reminder) {
      const title = data.reminder.title || 'Edenify Reminder';
      const options = {
        body: data.reminder.body || 'Time for your reminder',
        icon: '/edenify-logo.png',
        badge: '/edenify-logo.png',
        tag: data.reminder.tag || 'edenify-reminder',
        requireInteraction: true,
        data: { 
          url: data.reminder.taskId ? `/?tab=home&taskId=${encodeURIComponent(String(data.reminder.taskId))}` : '/?tab=home', 
          isReminder: true, 
          reminderKey: data.reminder.key,
          shouldPlayAlarm: true 
        },
      };

      console.log('[SW] Showing background reminder:', title);
      await self.registration.showNotification(title, options);

      await fetch(apiUrl('/api/user/reminder-sent'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: data.reminder.key }),
      }).catch(() => null);
    }
  } catch (error) {
    console.error('[SW] Error checking background reminder:', error);
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
    // Notify all clients that update is ready
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'UPDATE_ACTIVATED',
          message: 'App updated and refreshing...',
        });
      });
    });
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
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('edenify-') && !name.endsWith(CACHE_NAME))
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      }),
    ])
  );
  
  // Notify clients about update
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_UPDATE_AVAILABLE',
          message: 'A new version is available. Please refresh to update.',
        });
      });
    })
  );
});
