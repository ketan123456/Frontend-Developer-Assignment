import type { BrowserNotificationPermission } from '../types';

export const getBrowserNotificationPermission = (): BrowserNotificationPermission => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  return Notification.permission;
};

export const registerServiceWorker = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    await navigator.serviceWorker.register('/sw.js');
  } catch (error) {
    console.error('Service worker registration failed', error);
  }
};

export const requestNotificationPermission = async (): Promise<BrowserNotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  return Notification.requestPermission();
};

export interface LocalNotificationPayload {
  title: string;
  body: string;
  tag?: string;
  url: string;
}

export const triggerLocalNotification = async (payload: LocalNotificationPayload): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported in this browser.');
  }

  const registration = await navigator.serviceWorker.ready;

  registration.active?.postMessage({
    type: 'SHOW_NOTIFICATION',
    notification: {
      title: payload.title,
      body: payload.body,
      tag: payload.tag,
      data: { url: payload.url },
    },
  });
};
