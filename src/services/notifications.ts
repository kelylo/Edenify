/**
 * Cross-platform notification service
 * Sends task reminders to system notifications and Telegram
 */

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string; // For browser notification deduplication
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
          data: { url: '/' },
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
    return false;
  }

  try {
    const response = await fetch('/api/telegram/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId.trim(),
        message: `📋 *${title}*\n\n${body}`,
      }),
    });

    const data = await response.json();
    return response.ok && data?.success === true;
  } catch (error) {
    console.warn('Failed to send Telegram notification:', error);
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

  // Send system notification
  if('Notification' in window && Notification.permission === 'granted') {
    try {
      await sendSystemNotification(payload);
      results.system = true;
    } catch (error) {
      console.warn('System notification failed:', error);
    }
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
      console.warn('Telegram notification failed:', error);
    }
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
