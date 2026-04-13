import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/*', 'Mobile icon.png'],
        strategies: 'injectManifest',
        srcDir: 'public',
        filename: 'sw.ts',
        manifest: {
          name: 'Edenify',
          short_name: 'Edenify',
          description: 'A focused life architecture app for spiritual, academic, financial, physical, and general growth.',
          theme_color: '#964407',
          background_color: '#fef9f2',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'portrait',
          icons: [
            {
              src: '/Mobile%20icon.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/Mobile%20icon.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest}'],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'edenify-images',
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: ({ url }) => url.pathname.endsWith('/bible-data.json') || url.pathname.endsWith('bible-data.json'),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'edenify-bible-data',
                expiration: {
                  maxEntries: 3,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    define: {
      'process.env.SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: ['**/db.json', '**/dev-dist/**', '**/dist/**'],
      },
    },
  };
});
