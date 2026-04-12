/**
 * Cross-platform notification service
 * Sends task reminders to system notifications and Telegram
 */

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string; // For browser notification deduplication
  taskId?: string;
}

/**
 * Request notification permission from user
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission | null> => {
  if (!('Notification' in window)) {
    console.warn('Notifications API not supported');
    return null;
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  // Request permission
  const permission = await Notification.requestPermission();
  return permission;
};

/**
 * Send system notification (browser notification)
 */
export const sendSystemNotification = async (payload: NotificationPayload): Promise<void> => {
  if (!('Notification' in window)) {
    console.warn('Notifications API not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  try {
    const targetUrl = payload.taskId
      ? `/?tab=home&taskId=${encodeURIComponent(payload.taskId)}`
      : '/';

    // Prefer service-worker notifications when available for better background reliability.
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready.catch(() => null);
      if (registration?.showNotification) {
        await registration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/edenify-logo.png',
          badge: '/edenify-logo.png',
          tag: payload.tag || 'default',
          renotify: true,
          vibrate: [240, 120, 240],
          requireInteraction: false,
          data: { url: targetUrl, taskId: payload.taskId || null },
        });
        return;
      }
    }

    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/edenify-logo.png',
      tag: payload.tag || 'default',
      badge: '/edenify-logo.png',
      requireInteraction: false,
    });

    // Auto-close after 7 seconds if not clicked
    setTimeout(() => {
      notification.close();
    }, 7000);

    // Bring app to focus when notification is clicked
    notification.onclick = () => {
      window.focus();
      if (payload.taskId) {
        window.location.href = targetUrl;
      }
      notification.close();
    };
  } catch (error) {
    console.warn('Failed to send system notification:', error);
  }
};

/**
 * Send Telegram notification via backend
 */
export const sendTelegramNotification = async (
  chatId: string,
  title: string,
  body: string
): Promise<boolean> => {
  if (!chatId || !chatId.trim()) {
    console.debug('[Telegram] Skipped - no chat ID provided');
    return false;
  }

  const normalizedChatId = chatId.trim();
  console.log('[Telegram] Sending notification:', { chatId: normalizedChatId, title, bodyLen: body.length });

  try {
    const response = await fetch('/api/telegram/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: normalizedChatId,
        message: `📋 *${title}*\n\n${body}`,
      }),
    });

    const data = await response.json();
    const success = response.ok && data?.success === true;
    
    if (success) {
      console.log('[Telegram] Successfully sent');
    } else {
      console.warn('[Telegram] Failed - response:', { status: response.status, data });
    }
    
    return success;
  } catch (error) {
    console.warn('[Telegram] Error sending notification:', error);
    return false;
  }
};

/**
 * Send notification to all available channels (system + Telegram)
 */
export const sendCrossChannelNotification = async (
  payload: NotificationPayload,
  telegramChatId?: string
): Promise<{ system: boolean; telegram: boolean }> => {
  const results = {
    system: false,
    telegram: false,
  };

  console.log('[Notifications] sendCrossChannelNotification:', { title: payload.title, hasTelegram: !!telegramChatId });

  // Send system notification
  if('Notification' in window && Notification.permission === 'granted') {
    try {
      await sendSystemNotification(payload);
      results.system = true;
    } catch (error) {
      console.warn('[Notifications] System notification failed:', error);
    }
  } else {
    console.debug('[Notifications] System notifications not available or not granted');
  }

  // Send Telegram notification
  if (telegramChatId) {
    try {
      const success = await sendTelegramNotification(
        telegramChatId,
        payload.title,
        payload.body
      );
      results.telegram = success;
    } catch (error) {
      console.warn('[Notifications] Telegram notification failed:', error);
    }
  } else {
    console.debug('[Notifications] No Telegram chat ID provided');
  }

  return results;
};

/**
 * Check if notifications are enabled on device
 */
export const areNotificationsEnabled = (): boolean => {
  if (!('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
};

/**
 * Register periodic background sync for Bible reminders
 * Tells service worker to check every 15 minutes if it's time to send Bible reminder
 * This enables reminders even when app is closed on mobile
 */
export const registerBibleReminderSync = async (): Promise<void> => {
  try {
    // Notify currently running service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'REGISTER_BIBLE_SYNC',
      });
      console.log('[Notifications] Registered periodic Bible reminder sync');
    }

    // Register periodic background sync for future SW instances
    if ('serviceWorker' in navigator && 'periodicSync' in navigator.serviceWorker.ready) {
      const registration = await navigator.serviceWorker.ready;
      if ('periodicSync' in registration) {
        try {
          await (registration as any).periodicSync.register('bible-reminder-sync', {
            minInterval: 15 * 60 * 1000, // 15 minutes
          });
          console.log('[Notifications] Periodic background sync registered');
        } catch (error) {
          console.warn('[Notifications] Periodic sync registration failed:', error);
          // Fallback: use Web Push API if available
          if ('pushManager' in registration) {
            console.log('[Notifications] Falling back to Web Push');
          }
        }
      }
    }
  } catch (error) {
    console.warn('[Notifications] Background sync registration failed:', error);
  }
};

/**
 * Unregister periodic background sync for Bible reminders
 * Called when user disables Bible reminders
 */
export const unregisterBibleReminderSync = async (): Promise<void> => {
  try {
    if ('serviceWorker' in navigator && 'periodicSync' in navigator.serviceWorker.ready) {
      const registration = await navigator.serviceWorker.ready;
      if ('periodicSync' in registration) {
        try {
          await (registration as any).periodicSync.unregister('bible-reminder-sync');
          console.log('[Notifications] Periodic background sync unregistered');
        } catch (error) {
          console.warn('[Notifications] Periodic sync unregistration failed:', error);
        }
      }
    }
  } catch (error) {
    console.warn('[Notifications] Background sync unregistration failed:', error);
  }
};
