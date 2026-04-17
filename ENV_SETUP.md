# Environment Configuration Guide

## Local Development (.env.local)

Create a `.env.local` file in the root directory with these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini API (Eden AI)
GEMINI_API_KEY_1=your-primary-api-key
GEMINI_API_KEY_2=your-secondary-api-key (optional backup)

# Google Calendar OAuth (client-side token flow)
VITE_GOOGLE_CLIENT_ID=your-google-oauth-web-client-id

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-from-botfather
# OR use these alternatives:
# TELEGRAM_BOT_TOKEN_1=...
# TELEGRAM_BOT_TOKEN_PRIMARY=...

# Server Configuration
PORT=6001
NODE_ENV=development

# Database
DATABASE_PATH=./db.json
```

## Production Deployment (Render)

### Setting Environment Variables on Render:

1. Go to your Render deployment dashboard
2. Navigate to **Environment** tab
3. Add these environment variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY_1=your-gemini-api-key
VITE_GOOGLE_CLIENT_ID=your-google-oauth-web-client-id
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
NODE_ENV=production
PORT=6001
```

### Telegram Bot Token Setup:

1. Message @BotFather on Telegram
2. Create a new bot or use existing one
3. Get the HTTP API token (format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)
4. Copy this exact token to `TELEGRAM_BOT_TOKEN` on Render

### Verifying Setup:

After setting environment variables on Render:

1. Redeploy the application
2. Check Render logs for successful startup
3. Test Telegram bot: Message `/help` to your bot
4. Should see available commands without "not configured" error

## File Access for Bible Plan

Ensure these files are in the public directory (accessible to frontend):

- `/public/bible_plan.html` - 365-day reading schedule
- `/public/bible_database.html` - Bible verse database

These should be automatically included when deploying to Render.

## Troubleshooting

### "Telegram integration not configured" Error

**Cause**: `TELEGRAM_BOT_TOKEN` environment variable not set or empty

**Solution**:
1. Verify token is set in Render environment variables
2. Ensure no leading/trailing whitespace
3. Redeploy application
4. Check server logs: `logs` should show token loaded

### Different data on different browsers

**Fixed in latest version** - User ID is now based on email and consistent across devices

**If still occurring**:
1. Clear localStorage on all browsers
2. Log out completely
3. Log back in - should sync with server

###  Data not persisting across sessions

**Cause**: Database path issue or file permissions

**Local**: Check `db.json` file exists and is writable
**Production**: Render uses ephemeral filesystem - data won't persist after restart

**Solution**: Implement Supabase sync (already in code, ensure SUPABASE_SERVICE_ROLE_KEY is set)

## Security Notes

- Never commit `.env` files to git
- `.env.local` is in `.gitignore`
- Keep SUPABASE_SERVICE_ROLE_KEY private (only used server-side)
- ANON_KEY can be public (used by frontend)

