import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { parseTaskDueDate } from '../lib/utils';
import { Task, User } from '../types';

interface NativeAlarmItem {
  id: string;
  title: string;
  body: string;
  dueAt: string;
}

const STORAGE_KEY = 'edenify_native_alarm_ids_v1';

function hashToInt(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 2147483000) + 1;
}

function isElectronShell() {
  return typeof window !== 'undefined' && Boolean(window.edenNative?.platform === 'electron');
}

function isNativeMobileShell() {
  return Capacitor.isNativePlatform();
}

function getFutureDue(task: Task, nowMs: number) {
  const due = parseTaskDueDate(task);
  if (!due) return null;

  const reminderDue = new Date(due);
  if (task.repeat === 'daily' && reminderDue.getTime() <= nowMs) {
    reminderDue.setDate(reminderDue.getDate() + 1);
  }
  if (task.repeat === 'weekly' && reminderDue.getTime() <= nowMs) {
    reminderDue.setDate(reminderDue.getDate() + 7);
  }
  if (reminderDue.getTime() <= nowMs) return null;

  return reminderDue;
}

function buildNativeAlarms(tasks: Task[]): NativeAlarmItem[] {
  const nowMs = Date.now();
  const items: NativeAlarmItem[] = [];

  tasks.forEach((task) => {
    if (task.completed || task.alarmEnabled === false) return;

    const dueDate = getFutureDue(task, nowMs);
    if (!dueDate) return;

    // Limit scheduling horizon to avoid over-scheduling old/far-future jobs.
    const horizonMs = 48 * 60 * 60 * 1000;
    if (dueDate.getTime() - nowMs > horizonMs) return;

    const reminderDate = new Date(dueDate.getTime() - 5 * 60 * 1000);
    if (reminderDate.getTime() > nowMs) {
      items.push({
        id: `${task.id}|reminder|${dueDate.toISOString().slice(0, 16)}`,
        title: 'Edenify Reminder',
        body: `${task.name} starts in 5 minutes (${task.time}).`,
        dueAt: reminderDate.toISOString(),
      });
    }

    items.push({
      id: `${task.id}|due|${dueDate.toISOString().slice(0, 16)}`,
      title: 'Edenify Alarm',
      body: `${task.name} is due now (${task.time}).`,
      dueAt: dueDate.toISOString(),
    });
  });

  return items;
}

function readPreviousIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value) => Number.isFinite(value)).map((value) => Number(value));
  } catch {
    return [];
  }
}

function saveIds(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage write failures.
  }
}

async function syncCapacitorAlarms(items: NativeAlarmItem[]) {
  await LocalNotifications.requestPermissions();

  const previous = readPreviousIds();
  if (previous.length > 0) {
    await LocalNotifications.cancel({
      notifications: previous.map((id) => ({ id })),
    }).catch(() => undefined);
  }

  const notifications = items.map((item) => ({
    id: hashToInt(item.id),
    title: item.title,
    body: item.body,
    schedule: {
      at: new Date(item.dueAt),
      allowWhileIdle: true,
    },
    ongoing: false,
    autoCancel: true,
  }));

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }

  saveIds(notifications.map((notification) => notification.id));
}

async function syncElectronAlarms(items: NativeAlarmItem[]) {
  await window.edenNative?.syncAlarms({ alarms: items });
}

export async function syncNativeTaskAlarms(tasks: Task[], user: User | null) {
  if (!user) return;
  if (!user.preferences.notifications.taskReminders) return;

  const items = buildNativeAlarms(tasks);
  if (items.length === 0) return;

  if (isNativeMobileShell()) {
    await syncCapacitorAlarms(items);
    return;
  }

  if (isElectronShell()) {
    await syncElectronAlarms(items);
  }
}
