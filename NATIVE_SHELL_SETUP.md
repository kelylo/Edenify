# Native Shell Setup (Mobile + Desktop)

This project now supports native wrappers while keeping Telegram reminders as fallback.

## 1) Mobile Native Shell (Capacitor)

### Install Android platform files

```bash
npm run mobile:sync
npm run mobile:android
```

### What is wired

- Task reminders are scheduled as native local notifications:
- `5 minutes before due`
- `at due time`
- Scheduling is synchronized from app tasks automatically.

Code path:
- `src/services/native-alarms.ts`
- `src/AppContext.tsx` (sync hook)

### Important Android settings

To improve exact timing reliability:
1. Disable battery optimization for the app.
2. Allow notifications.
3. On Android 12+, allow exact alarms in app settings if shown.

### iOS

You can add iOS platform from macOS:

```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```

## 2) Desktop/Laptop Native Shell (Electron)

### Run desktop shell

```bash
npm run desktop:start
```

### Build Windows installer

```bash
npm run desktop:build
```

### What is wired

- Electron runs Edenify in a native window.
- App is minimized to tray (background) instead of closing, so alarms keep firing.
- Due alarms trigger OS notification + repeated beep for up to 60s.

Code path:
- `electron/main.cjs`
- `electron/preload.cjs`
- `src/services/native-alarms.ts`

## 3) Closed-App Reliability Model

- Telegram reminders remain fallback for fully closed/killed app states.
- Native shell alarms are now primary for installed mobile/desktop clients.
- Best reliability is: native shell + notification permission + battery optimization disabled + Telegram fallback enabled.
