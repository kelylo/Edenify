# Edenify Platform Deployment

Edenify is split for production deployment:

- `frontend` deploys as a mobile-first PWA on Cloudflare Pages.
- `backend` deploys as a persistent Node service on Railway for Telegram polling, reminders, and API routes.

## 🚀 1. Cloudflare Pages Deployment (Frontend)
Cloudflare statically builds and serves the mobile-first PWA globally.

**Click-by-Click Guide:**
1. Log into your Cloudflare Dashboard.
2. Navigate to **Workers & Pages** on the left menu.
3. Click the blue **Create application** button.
4. Select the **Pages** tab, then click **Connect to Git**.
5. Select your GitHub account and authorize access. Select the **Edenify** repository.
6. Click **Begin setup**.
7. In the **Set up builds and deployments** screen, fill out the forms *exactly* as follows:
   - **Project name:** `edenify-app` (or any name you prefer)
   - **Production branch:** `main` (or whatever branch you use)
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory (IMPORTANT):** `frontend`
8. Scroll down, click **Environment variables (advanced)** > **Add variable**. Add these exact keys:
   - `VITE_API_BASE_URL` -> *(Value: Enter your Railway backend URL once deployed, e.g., `https://edenify-production.up.railway.app`)*
   - `VITE_SUPABASE_URL` -> *(Value: Your public Supabase project URL)*
   - `VITE_SUPABASE_ANON_KEY` -> *(Value: Your public Supabase anon key)*
9. Click **Save and Deploy**.

## 🚂 2. Railway Deployment (Backend)
Railway runs the Node.js Express backend for AI routes, Telegram polling, and reminder scheduling.

**Click-by-Click Guide:**
1. Log into your Railway Dashboard (railway.app).
2. Click **+ New Project** at the top right.
3. Select **Deploy from GitHub repo**.
4. Select the **Edenify** repository. Railway will immediately detect the repository and start creating a service.
5. Once the service appears in your dashboard canvas, click squarely on the new service node.
6. On the right panel, navigate to the **Settings** tab.
7. Scroll down to the **Service** section and configure exactly as follows:
   - **Root Directory:** `backend`
8. Scroll down to the **Build** section and configure exactly as follows:
   - **Builder:** `Nixpacks` (It will automatically detect `package.json`).
   - **Build Command:** `npm run build`
9. Scroll down to the **Deploy** section and configure exactly as follows:
   - **Start Command:** `npm run start` (or `node server.js`).
10. At the top of the panel, switch from the **Settings** tab to the **Variables** tab. Click **New Variable** and add:
   - `PORT` -> `6001` (Railway automatically detects and routes HTTP to this port)
   - `TELEGRAM_BOT_TOKEN` -> *(Your bot token string)*
   - `SUPABASE_URL` -> *(Your Supabase URL)*
   - `SUPABASE_SERVICE_KEY` -> *(Your Supabase Service-Role / Master Key to bypass RLS)*
   - `GEMINI_API_KEY_1` -> *(Your Gemini AI token)*
   - `GEMINI_API_KEY_2` -> *(Optional Gemini rotation key)*
   - `OPENAI_API_KEY` -> *(Optional fallback model key)*
   - `CORS_ORIGIN` -> *(Your Cloudflare Pages URL, e.g., `https://edenify-app.pages.dev`)*
11. Finally, switch to the **Settings** tab, scroll to **Networking**, and click **Generate Domain**.
12. Copy this new domain (e.g., `edenify-xxx.up.railway.app`). This is what you put in Cloudflare's `VITE_API_BASE_URL` variable.

Wait 2-3 minutes. If Railway shows a green checkmark, your API is fully alive!

## 📖 Product Notes (Corrected)

- Bible reading uses an established **365-day** plan.
- Focus is mobile-first via PWA and native mobile alarms.
- Desktop shell support is optional and not the primary reminder path.

---

## Running Locally
**1. Boot Backend:**
```bash
cd backend
npm install
npm run dev
```

**2. Boot Frontend:**
```bash
cd frontend
npm install
npm run dev
```
