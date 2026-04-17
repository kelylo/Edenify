import { Task, User } from '../types';

const TOKEN_STORAGE_KEY_PREFIX = 'edenify_google_calendar_token_v1';
const TOKEN_EXPIRY_STORAGE_KEY_PREFIX = 'edenify_google_calendar_token_expiry_v1';
const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const GOOGLE_IDENTITY_SCRIPT = 'https://accounts.google.com/gsi/client';

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
};

type GoogleIdentityAccounts = {
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: GoogleTokenResponse) => void;
    }) => {
      requestAccessToken: (options?: { prompt?: string }) => void;
    };
  };
};

declare global {
  interface Window {
    google?: {
      accounts?: GoogleIdentityAccounts;
    };
  }
}

function getClientId() {
  return String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
}

function normalizeAccountKey(userEmail?: string) {
  return String(userEmail || '').trim().toLowerCase() || 'guest';
}

function tokenStorageKey(userEmail?: string) {
  return `${TOKEN_STORAGE_KEY_PREFIX}_${normalizeAccountKey(userEmail)}`;
}

function tokenExpiryStorageKey(userEmail?: string) {
  return `${TOKEN_EXPIRY_STORAGE_KEY_PREFIX}_${normalizeAccountKey(userEmail)}`;
}

function getStoredToken(userEmail?: string) {
  const token = window.localStorage.getItem(tokenStorageKey(userEmail)) || '';
  const expiry = Number(window.localStorage.getItem(tokenExpiryStorageKey(userEmail)) || '0');
  if (!token || !Number.isFinite(expiry) || expiry <= Date.now() + 30_000) return '';
  return token;
}

function storeToken(token: string, expiresInSeconds: number, userEmail?: string) {
  const expiry = Date.now() + Math.max(30, Number(expiresInSeconds || 3600)) * 1000;
  window.localStorage.setItem(tokenStorageKey(userEmail), token);
  window.localStorage.setItem(tokenExpiryStorageKey(userEmail), String(expiry));
}

function clearToken(userEmail?: string) {
  window.localStorage.removeItem(tokenStorageKey(userEmail));
  window.localStorage.removeItem(tokenExpiryStorageKey(userEmail));
}

async function ensureGoogleIdentityScript() {
  if (window.google?.accounts?.oauth2) return;

  const existing = document.querySelector(`script[src="${GOOGLE_IDENTITY_SCRIPT}"]`) as HTMLScriptElement | null;
  if (existing) {
    await new Promise<void>((resolve, reject) => {
      if (window.google?.accounts?.oauth2) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Could not load Google Identity script.')), {
        once: true,
      });
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GOOGLE_IDENTITY_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Google Identity script.'));
    document.head.appendChild(script);
  });
}

export async function getGoogleCalendarAccessToken(interactive: boolean, userEmail?: string): Promise<string> {
  const clientId = getClientId();
  if (!clientId) {
    throw new Error('Google Calendar is not configured. Missing VITE_GOOGLE_CLIENT_ID.');
  }

  const stored = getStoredToken(userEmail);
  if (stored) return stored;

  if (!interactive) {
    return '';
  }

  await ensureGoogleIdentityScript();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) {
    throw new Error('Google Identity API is unavailable in this browser.');
  }

  return await new Promise<string>((resolve, reject) => {
    const tokenClient = oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_CALENDAR_SCOPE,
      callback: (response: GoogleTokenResponse) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || 'Google authorization failed.'));
          return;
        }

        storeToken(response.access_token, Number(response.expires_in || 3600), userEmail);
        resolve(response.access_token);
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

export function disconnectGoogleCalendar(userEmail?: string) {
  clearToken(userEmail);
}

export function isGoogleCalendarConnected(userEmail?: string) {
  return Boolean(getStoredToken(userEmail));
}

async function postCalendarEndpoint(endpoint: string, body: Record<string, unknown>, interactiveAuth: boolean, userEmail?: string) {
  const token = await getGoogleCalendarAccessToken(interactiveAuth, userEmail);
  if (!token) return { success: false, skipped: true } as const;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      accessToken: token,
    }),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.success) {
    if (response.status === 401 || response.status === 403) {
      clearToken(userEmail);
    }
    throw new Error(json?.error || `Calendar sync failed (${response.status})`);
  }

  return json as { success: true; [key: string]: unknown };
}

export async function syncTaskToGoogleCalendar(task: Task, user: User | null, interactiveAuth = false) {
  if (!user?.preferences.googleCalendarEnabled) return;
  const userEmail = String(user.email || '').trim().toLowerCase();
  await postCalendarEndpoint(
    '/api/google-calendar/upsert-task-event',
    {
      task,
      userEmail,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    },
    interactiveAuth,
    userEmail
  );
}

export async function removeTaskFromGoogleCalendar(task: Task, user: User | null, interactiveAuth = false) {
  if (!user?.preferences.googleCalendarEnabled) return;
  const userEmail = String(user.email || '').trim().toLowerCase();
  await postCalendarEndpoint('/api/google-calendar/delete-task-event', { taskId: task.id }, interactiveAuth, userEmail);
}
