import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

const apiBase = String(import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');

if (apiBase) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      return nativeFetch(`${apiBase}${input}`, init);
    }

    if (input instanceof Request) {
      const url = input.url;
      if (url.startsWith(`${window.location.origin}/api/`)) {
        const nextUrl = `${apiBase}${url.replace(window.location.origin, '')}`;
        return nativeFetch(new Request(nextUrl, input), init);
      }
    }

    return nativeFetch(input as any, init);
  }) as typeof window.fetch;
}

const applyPersistedTheme = () => {
  try {
    const stored = window.localStorage.getItem('edenify_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const selected = stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'system';
    const theme = selected === 'system' ? (prefersDark ? 'dark' : 'light') : selected;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', selected);
  } catch {
    // Ignore storage/theme init failures.
  }
};

applyPersistedTheme();

const applyViewportMode = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;

  const isSmallMobile = window.matchMedia('(max-width: 768px), (max-height: 740px)').matches;
  if (isSmallMobile) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover');
    document.documentElement.style.touchAction = 'manipulation';
  } else {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    document.documentElement.style.removeProperty('touch-action');
  }
};

applyViewportMode();
window.addEventListener('resize', applyViewportMode);

if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onRegisteredSW(swScriptUrl) {
      console.log('PWA service worker registered:', swScriptUrl);
    },
    onRegisterError(error) {
      console.error('PWA service worker registration failed:', error);
    },
  });
} else if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  }).catch((error) => {
    console.warn('Service worker cleanup failed:', error);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const hideBootSplash = () => {
  const splash = document.getElementById('boot-splash');
  if (!splash) return;
  splash.setAttribute('data-hidden', 'true');
  window.setTimeout(() => {
    splash.remove();
  }, 260);
};

if (document.readyState === 'complete') {
  hideBootSplash();
} else {
  window.addEventListener('load', hideBootSplash, { once: true });
}
