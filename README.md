<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/748d00fe-b2c1-4d2b-9415-ceec8b9d8421

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env.local` from `.env.example` and set your keys:
   - `GEMINI_API_KEY_1`
   - `GEMINI_API_KEY_2`
   - optional fallback: `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
   The app rotates Gemini keys automatically for better reliability.
3. Create Supabase table for cloud state sync:
   - Open Supabase SQL editor
   - Run SQL from `supabase-schema.sql`
4. Migrate your existing local `db.json` user states into Supabase:
   `npm run migrate:supabase`
5. Run the app:
   `npm run dev`

## Build Production

1. Build the app:
   `npm run build`
2. Preview built app:
   `npm run preview`

## Deploy to Render (24/7 Bot)

This project includes a ready-to-use Render blueprint: `render.yaml`.

Why this matters for Telegram:
- The Telegram polling loop runs in the Node server process.
- If you run locally and close VS Code, that process stops, so the bot stops.
- Deploying to Render keeps the process running remotely.
- For true always-on behavior, use a non-sleeping plan (Starter or higher).

### Option A: Blueprint Deploy (recommended)

1. Push this repository to GitHub.
2. In Render dashboard, choose **New +** -> **Blueprint**.
3. Select your repository and confirm creation.

Render will use:
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Health check: `/api/health`

### Option B: Manual Web Service

1. Create a new **Web Service** in Render.
2. Runtime: **Node**.
3. Build command: `npm install && npm run build`
4. Start command: `npm run start`
5. Plan: **Starter** (or higher) for 24/7 Telegram polling.

### Environment Variables (Render)

Set these in the Render service settings:

- `GEMINI_API_KEY_1`
- `GEMINI_API_KEY_2`
- `VITE_GOOGLE_CLIENT_ID` (Google OAuth Web Client ID for Calendar sync)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `TELEGRAM_BOT_TOKEN` (optional)

Notes:
- Do not expose Gemini keys to frontend code; they are server-only.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to frontend code; keep it server-only.
- Keep backend secrets in `.env.server.local` for local dev and Render secret env vars in production.
- Render injects `PORT` automatically; this server already reads it.
- If using free/sleeping instances, Telegram polling can pause when the service sleeps.

### Keep App Awake (No Cold Starts)

This repo includes a Render cron service (`edenify-keepalive`) that runs every 5 minutes and pings only:
- `/api/health`

Required env for the cron service:
- `KEEPALIVE_URL` = your web app URL (example: `https://edenify.onrender.com`)
- optional fallback: `APP_URL`

You can also keep the app awake with an external monitor.

UptimeRobot setup:
1. Create a new monitor of type **HTTP(s)**.
2. URL: `https://your-app.onrender.com/api/health`
3. Interval: **5 minutes**.
4. Timeout: **30 seconds**.
5. Save and confirm monitor status is Up.

Cron-job.org setup:
1. Create a new cronjob with method **GET**.
2. URL: `https://your-app.onrender.com/api/health`
3. Schedule expression: `*/5 * * * *`.
4. Enable the cronjob and verify successful runs.

Result:
- App stays warm.
- No wake-up delay from sleep.

## PWA Install (Mobile + Desktop)

- Edenify is configured as a Progressive Web App.
- Open the app in a supported browser (Chrome/Edge/Safari on iOS), then use:
  - Browser install prompt, or
  - the in-app "Install" suggestion banner on Home.
- Installed app supports standalone launch and offline shell caching.

## Native Shells (Mobile + Desktop/Laptop)

Use native wrappers for stronger due/reminder reliability and background alarms.

### Mobile (Capacitor)

- Sync native platform:
   - `npm run mobile:sync`
- Open Android Studio project:
   - `npm run mobile:android`

### Desktop/Laptop (Electron)

- Run desktop shell:
   - `npm run desktop:start`
- Build Windows installer:
   - `npm run desktop:build`

Detailed setup is in `NATIVE_SHELL_SETUP.md`.
