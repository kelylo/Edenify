const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, nativeImage, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const schedule = require('node-schedule');

let mainWindow = null;
let tray = null;
let backendProcess = null;
let quitting = false;
let backendUrl = 'http://localhost:6001';
const jobs = new Map();
const activeAlarmBeeps = new Map();

function resolveIconPath() {
  return path.join(__dirname, '..', 'public', 'icons', 'desktop-256.png');
}

function showDueNotification(alarm) {
  const iconPath = resolveIconPath();
  const notification = new Notification({
    title: alarm.title || 'Edenify Alarm',
    body: alarm.body || 'Task is due now.',
    icon: iconPath,
    urgency: 'critical',
    silent: false,
  });

  notification.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  notification.show();

  const beepInterval = setInterval(() => {
    shell.beep();
  }, 900);

  const autoStop = setTimeout(() => {
    clearInterval(beepInterval);
    activeAlarmBeeps.delete(alarm.id);
  }, 60000);

  activeAlarmBeeps.set(alarm.id, { beepInterval, autoStop });
}

function clearAllJobs() {
  jobs.forEach((job) => job.cancel());
  jobs.clear();
}

function stopAlarm(alarmId) {
  const active = activeAlarmBeeps.get(alarmId);
  if (!active) return;
  clearInterval(active.beepInterval);
  clearTimeout(active.autoStop);
  activeAlarmBeeps.delete(alarmId);
}

function scheduleAlarms(payload) {
  clearAllJobs();
  const alarms = Array.isArray(payload?.alarms) ? payload.alarms : [];

  alarms.forEach((alarm) => {
    const when = new Date(alarm.dueAt);
    if (Number.isNaN(when.getTime())) return;
    if (when.getTime() <= Date.now()) return;

    const job = schedule.scheduleJob(when, () => {
      showDueNotification(alarm);
    });

    jobs.set(alarm.id, job);
  });

  return { scheduled: jobs.size };
}

function createTray() {
  if (tray) return;

  const icon = nativeImage.createFromPath(resolveIconPath());
  tray = new Tray(icon);
  tray.setToolTip('Edenify');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Edenify',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: 'Quit',
      click: () => {
        quitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 860,
    minWidth: 980,
    minHeight: 700,
    show: false,
    backgroundColor: '#fef9f2',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (quitting) return;
    event.preventDefault();
    mainWindow.hide();
  });

  const loadWithRetries = async () => {
    const candidatePorts = [6001, 6002, 6003, 6004, 6005, 6006, 6007];

    for (const port of candidatePorts) {
      try {
        const url = `http://localhost:${port}`;
        await mainWindow.loadURL(url);
        backendUrl = url;
        return;
      } catch {
        // try next port
      }
    }

    await mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  };

  setTimeout(() => {
    void loadWithRetries();
  }, 1800);
}

function startBackend() {
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  backendProcess = spawn(command, ['tsx', 'server.ts'], {
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'production',
      PORT: process.env.PORT || '6001',
    },
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  backendProcess.stdout.on('data', (chunk) => {
    const line = String(chunk || '');
    const match = line.match(/http:\/\/localhost:(\d+)/i);
    if (match) {
      backendUrl = `http://localhost:${match[1]}`;
    }
  });

  backendProcess.stderr.on('data', () => {
    // Keep silent by default to avoid noisy desktop logs.
  });

  backendProcess.on('exit', () => {
    backendProcess = null;
  });
}

ipcMain.handle('native-alarms:sync', async (_event, payload) => {
  return scheduleAlarms(payload);
});

ipcMain.handle('native-alarms:stop', async (_event, alarmId) => {
  stopAlarm(String(alarmId || ''));
  return { ok: true };
});

app.whenReady().then(() => {
  startBackend();
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      return;
    }

    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

app.on('before-quit', () => {
  quitting = true;
  clearAllJobs();
  activeAlarmBeeps.forEach((_value, key) => stopAlarm(key));

  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
});

app.on('window-all-closed', () => {
  // Keep background running for alarms.
});
