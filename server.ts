import dotenv from 'dotenv';
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

type RepeatMode = 'once' | 'daily' | 'weekly';
type LayerId = 'spiritual' | 'academic' | 'financial' | 'physical' | 'general';
type Priority = 'A' | 'B' | 'C' | 'D' | 'E';

interface TelegramTask {
  id: string;
  name: string;
  layerId: LayerId;
  priority: Priority;
  repeat: RepeatMode;
  time: string;
  completed: boolean;
  date: string;
  alarmEnabled?: boolean;
  preferredMusic?: string;
  estimatedDuration?: number;
  durationStartedAt?: string;
}

interface WizardState {
  mode: 'set' | 'delete' | 'edit' | 'defaults';
  step: string;
  draft?: Partial<TelegramTask>;
  targetTaskId?: string;
  invalidAttempts?: number;
}

interface TelegramDefaults {
  preferredMusic: string;
  repeat: RepeatMode;
  layerId: LayerId;
  priority: Priority;
  time: string;
}

interface TelegramStoreItem {
  tasks: TelegramTask[];
  userId?: string;
  wizard?: WizardState;
  defaults?: Partial<TelegramDefaults>;
}

interface DbShape {
  users: Array<{ id: string; email: string; name: string; password?: string; role?: 'admin' | 'user'; avatar?: string; preferences?: any }>;
  data: Record<string, any>;
  sessions?: Record<string, { userId: string; createdAt: string }>;
  telegram?: {
    offset?: number;
    byChatId?: Record<string, TelegramStoreItem>;
    reminders?: Record<string, string>;
    poller?: {
      ownerId: string;
      updatedAt: string;
    };
  };
}

const layerOptions: LayerId[] = ['spiritual', 'academic', 'financial', 'physical', 'general'];
const repeatOptions: RepeatMode[] = ['once', 'daily', 'weekly'];
const priorityOptions: Priority[] = ['A', 'B', 'C', 'D', 'E'];
const defaultTelegramDefaults: TelegramDefaults = {
  preferredMusic: '',
  repeat: 'once',
  layerId: 'general',
  priority: 'C',
  time: '08:00',
};

type UserPreferencesShape = Partial<{
  focusAlarmSound: string;
  customFocusSongName: string;
  customFocusSongDataUrl: string;
  customFocusPlaylistNames: string[];
  customFocusPlaylistDataUrls: string[];
}>;

const defaultUserPreferences = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  focusSound: 'Rain Forest',
  focusAlarmSound: '',
  bibleReminderTime: '06:30 AM',
  bibleReminderAlarm: true,
  bibleReminderTelegram: true,
  telegramChatId: '',
  customFocusSongName: '',
  customFocusSongDataUrl: '',
  customFocusPlaylistNames: [],
  customFocusPlaylistDataUrls: [],
  shuffleFocusPlaylist: false,
  notifications: {
    taskReminders: true,
    dailyScripture: true,
    streakProtection: false,
  },
};

function normalizeUser(user: Partial<{ id: string; email: string; name: string; password?: string; role?: 'admin' | 'user'; avatar?: string; preferences?: any }>) {
  return {
    id: String(user.email || user.id || `usr-${Date.now()}`).trim().toLowerCase(),
    email: user.email || '',
    name: user.name || (user.email || 'user').split('@')[0],
    role: user.role || 'user',
    avatar: user.avatar,
    preferences: {
      ...defaultUserPreferences,
      ...(user.preferences || {}),
      notifications: {
        ...defaultUserPreferences.notifications,
        ...(user.preferences?.notifications || {}),
      },
    },
  };
}

function readDb(dbPath: string): DbShape {
  const raw = fs.readFileSync(dbPath, 'utf-8');
  const db = JSON.parse(raw) as DbShape;
  db.telegram = db.telegram || { offset: 0, byChatId: {}, reminders: {} };
  db.telegram.byChatId = db.telegram.byChatId || {};
  db.telegram.offset = db.telegram.offset || 0;
  db.telegram.reminders = db.telegram.reminders || {};
  return db;
}

function writeDb(dbPath: string, db: DbShape) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

async function loadSupabaseUserState(userId: string): Promise<any | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from('edenify_user_state')
    .select('state_json')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Supabase backend load failed, falling back to local db:', error.message);
    return null;
  }

  return data?.state_json || null;
}

async function saveSupabaseUserState(userId: string, state: any): Promise<boolean> {
  if (!supabaseAdmin) return false;

  const { error } = await supabaseAdmin.from('edenify_user_state').upsert(
    {
      user_id: userId,
      state_json: state,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    console.warn('Supabase backend save failed, falling back to local db:', error.message);
    return false;
  }

  return true;
}

function parseCookies(cookieHeader?: string) {
  return (cookieHeader || '').split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValue] = part.split('=');
    const key = rawKey?.trim();
    if (!key) return acc;
    acc[key] = decodeURIComponent(rawValue.join('=').trim());
    return acc;
  }, {});
}

function createSessionId() {
  return `sess-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function normalizeChatId(value?: string) {
  return (value || '').trim().replace(/[^0-9-]/g, '');
}

function parseChoiceIndex(value: string, maxLength: number) {
  const index = Number(value.trim());
  if (!Number.isFinite(index) || index < 1 || index > maxLength) return -1;
  return index - 1;
}

function formatNumberedOptions(options: string[]) {
  return options.map((option, index) => `${index + 1}. ${option}`).join('\n');
}

function resolveNumberedChoice(input: string, options: string[]) {
  const choice = input.trim();
  const index = parseChoiceIndex(choice, options.length);
  if (index >= 0) return options[index];
  return null;
}

function taskToLine(task: TelegramTask, index?: number) {
  const prefix = index !== undefined ? `${index + 1}. ` : '- ';
  return `${prefix}${task.name} | ${task.time} | ${task.repeat} | ${task.layerId} | ${task.priority}`;
}

function isValidTaskTime(value: string) {
  const v = value.trim();
  return /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v);
}

function normalize24HourTime(value: string) {
  const v = value.trim();
  const match = v.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) return v;
  const h = Number(match[1]);
  const m = Number(match[2]);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function buildWizardCard(input: {
  flow: 'TASK SETUP' | 'TASK EDIT' | 'DEFAULTS';
  step: number;
  total: number;
  title: string;
  prompt: string;
  options?: string[];
  hint?: string;
}) {
  const lines = [
    `[${input.flow} ${input.step}/${input.total}]`,
    `Stage: ${input.title}`,
    input.prompt,
  ];

  if (input.options && input.options.length > 0) {
    lines.push('', formatNumberedOptions(input.options));
  }

  if (input.hint) {
    lines.push('', `Hint: ${input.hint}`);
  }

  lines.push('', 'Reply with one value. Use /cancel to stop.');
  return lines.join('\n');
}

function ensureTelegramDefaults(store: TelegramStoreItem): TelegramDefaults {
  return {
    ...defaultTelegramDefaults,
    ...(store.defaults || {}),
  };
}

function resolveUserPreferences(db: DbShape, userId?: string): UserPreferencesShape {
  if (!userId) return {};
  const fromUsers = db.users?.find((user) => user.id === userId)?.preferences || {};
  const state = db.data?.[userId] || {};
  const fromStateUser = state?.user?.preferences || {};
  const fromStateRoot = state?.preferences || {};

  return {
    ...(fromUsers || {}),
    ...(fromStateUser || {}),
    ...(fromStateRoot || {}),
  };
}

function resolveUserSongChoices(db: DbShape, userId?: string): string[] {
  const prefs = resolveUserPreferences(db, userId);
  const dynamicNames: string[] = [];

  if (Array.isArray(prefs.customFocusPlaylistNames)) {
    prefs.customFocusPlaylistNames.forEach((name) => {
      const clean = String(name || '').trim();
      if (clean) dynamicNames.push(clean);
    });
  }

  if (String(prefs.customFocusSongName || '').trim()) {
    dynamicNames.push(String(prefs.customFocusSongName || '').trim());
  }

  return Array.from(new Set(dynamicNames));
}

function inferTelegramDefaultsFromUser(db: DbShape, userId?: string): Partial<TelegramDefaults> {
  const prefs = resolveUserPreferences(db, userId);
  const inferred: Partial<TelegramDefaults> = {};

  const choices = resolveUserSongChoices(db, userId);
  if (choices.length > 0) {
    inferred.preferredMusic = choices[0];
  }

  return inferred;
}

function getTaskDurationMinutes(task: Partial<TelegramTask>) {
  const value = Number(task.estimatedDuration);
  if (!Number.isFinite(value)) return 25;
  return Math.max(5, Math.min(300, Math.floor(value)));
}

const geminiModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

function getGeminiKeyOrder() {
  const key1 = (process.env.GEMINI_API_KEY_1 || '').trim();
  const key2 = (process.env.GEMINI_API_KEY_2 || '').trim();
  const keys = [key1, key2].filter((key): key is string => Boolean(key));
  if (keys.length <= 1) return keys;
  return Math.random() < 0.7 ? [key2, key1] : [key1, key2];
}

async function generateWithServerGemini(prompt: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  tools?: any[];
}) {
  const keys = getGeminiKeyOrder();
  if (keys.length === 0) {
    throw new Error('GEMINI_API_KEY_1 or GEMINI_API_KEY_2 is not configured on server.');
  }

  let lastError: unknown;
  for (const model of geminiModels) {
    for (const key of keys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model,
          contents: prompt.contents,
          config: {
            systemInstruction: prompt.systemInstruction,
            responseMimeType: prompt.responseMimeType,
            tools: prompt.tools,
          },
        });
        return response.text || '';
      } catch (error) {
        lastError = error;
      }
    }
  }

  throw lastError;
}

function parseJsonSafely<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  return JSON.parse(cleaned) as T;
}

function normalizeTelegramTask(task: Partial<TelegramTask>, defaults?: Partial<TelegramDefaults>): TelegramTask {
  const baseDate = new Date(task.date || Date.now());
  const safeDate = Number.isNaN(baseDate.getTime()) ? new Date().toISOString() : baseDate.toISOString();
  const normalizedTime = isValidTaskTime(String(task.time || ''))
    ? normalize24HourTime(String(task.time || ''))
    : normalize24HourTime(String(defaults?.time || defaultTelegramDefaults.time));

  return {
    id: String(task.id || `tg-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`),
    name: String(task.name || 'Untitled task'),
    layerId: layerOptions.includes(task.layerId as LayerId) ? (task.layerId as LayerId) : (defaults?.layerId || 'general'),
    priority: priorityOptions.includes(task.priority as Priority) ? (task.priority as Priority) : (defaults?.priority || 'C'),
    repeat: repeatOptions.includes(task.repeat as RepeatMode) ? (task.repeat as RepeatMode) : (defaults?.repeat || 'once'),
    time: normalizedTime,
    completed: Boolean(task.completed),
    date: safeDate,
    alarmEnabled: task.alarmEnabled !== false,
    preferredMusic: String(task.preferredMusic || defaults?.preferredMusic || ''),
  };
}

function parseTelegramTaskDueDate(task: TelegramTask) {
  const normalized = task.time.trim().replace(/\s+/g, ' ').toUpperCase();
  const match12 = normalized.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  const match24 = normalized.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);

  let hours = 0;
  let minutes = 0;

  if (match12) {
    hours = Number(match12[1]);
    minutes = Number(match12[2]);
    const period = match12[3];
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  } else if (match24) {
    hours = Number(match24[1]);
    minutes = Number(match24[2]);
  } else {
    return null;
  }

  const now = new Date();
  const baseDate = new Date(task.date || now.toISOString());
  if (Number.isNaN(baseDate.getTime())) return null;

  if (task.repeat === 'daily') {
    const due = new Date(now);
    due.setHours(hours, minutes, 0, 0);
    return due;
  }

  if (task.repeat === 'weekly') {
    const due = new Date(now);
    const anchorWeekday = baseDate.getDay();
    const dayDelta = (anchorWeekday - due.getDay() + 7) % 7;
    due.setDate(due.getDate() + dayDelta);
    due.setHours(hours, minutes, 0, 0);
    return due;
  }

  baseDate.setHours(hours, minutes, 0, 0);
  return baseDate;
}

function parseTelegramTaskTime(task: TelegramTask) {
  const normalized = task.time.trim().replace(/\s+/g, ' ').toUpperCase();
  const match12 = normalized.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  const match24 = normalized.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);

  if (match12) {
    let hours = Number(match12[1]);
    const minutes = Number(match12[2]);
    const period = match12[3];
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }

  if (match24) {
    return { hours: Number(match24[1]), minutes: Number(match24[2]) };
  }

  return null;
}

function getTelegramReminderMoment(task: TelegramTask, now = new Date()) {
  const parsedTime = parseTelegramTaskTime(task);
  if (!parsedTime) return null;

  if (task.repeat === 'daily') {
    const due = new Date(now);
    due.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
    if (due.getTime() <= now.getTime()) {
      due.setDate(due.getDate() + 1);
    }
    return new Date(due.getTime() - 5 * 60 * 1000);
  }

  if (task.repeat === 'weekly') {
    const baseDate = new Date(task.date || now.toISOString());
    if (Number.isNaN(baseDate.getTime())) return null;

    const due = new Date(now);
    const anchorWeekday = baseDate.getDay();
    const dayDelta = (anchorWeekday - due.getDay() + 7) % 7;
    due.setDate(due.getDate() + dayDelta);
    due.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);

    if (due.getTime() <= now.getTime()) {
      due.setDate(due.getDate() + 7);
    }

    return new Date(due.getTime() - 5 * 60 * 1000);
  }

  const due = parseTelegramTaskDueDate(task);
  if (!due) return null;
  if (due.getTime() <= now.getTime()) return null;

  return new Date(due.getTime() - 5 * 60 * 1000);
}

function isTelegramTaskFailed(task: TelegramTask, nowMs = Date.now()) {
  return false;
}

function reopenTelegramTaskAfterWindow(task: TelegramTask, nowMs = Date.now()) {
  if (!task.completed) return task;
  const completedAt = new Date(task.durationStartedAt || task.date || nowMs).getTime();
  if (!Number.isFinite(completedAt)) return task;
  if (nowMs - completedAt < getTaskDurationMinutes(task) * 60 * 1000) return task;
  return { ...task, completed: false, durationStartedAt: new Date(nowMs).toISOString() };
}

function syncTelegramStoreToUserData(db: DbShape, store: TelegramStoreItem) {
  const userId = store.userId;
  if (!userId) return;

  db.data = db.data || {};
  const currentState = db.data[userId] || {};
  const existingTasks = Array.isArray(currentState.tasks) ? currentState.tasks : [];
  const merged = new Map<string, any>();

  existingTasks.forEach((task: any) => {
    const key = task.id || `${task.name}|${task.layerId}|${task.time}`;
    merged.set(key, task);
  });

  store.tasks.forEach((task) => {
    const key = task.id || `${task.name}|${task.layerId}|${task.time}`;
    merged.set(key, task);
  });

  db.data[userId] = {
    ...currentState,
    tasks: Array.from(merged.values()),
  };
}

function mergeTelegramTasksByIdentity(...taskLists: TelegramTask[][]) {
  const merged = new Map<string, TelegramTask>();

  taskLists.forEach((tasks) => {
    tasks.forEach((task) => {
      const key = task.id || `${task.name}|${task.layerId}|${task.time}`;
      const existing = merged.get(key);
      merged.set(key, existing ? { ...existing, ...task } : task);
    });
  });

  return Array.from(merged.values());
}

function getLinkedChatIdsByUserId(db: DbShape, userId: string) {
  return Object.entries(db.telegram?.byChatId || {})
    .filter(([, store]) => store?.userId === userId)
    .map(([chatId]) => chatId);
}

function mergeAllLinkedTelegramTasks(db: DbShape, userId: string) {
  const linkedChatIds = getLinkedChatIdsByUserId(db, userId);
  const linkedTasks = linkedChatIds.map((chatId) => db.telegram?.byChatId?.[chatId]?.tasks || []);
  return mergeTelegramTasksByIdentity(...linkedTasks);
}

function propagateUserTasksToLinkedChats(db: DbShape, userId: string, tasks: TelegramTask[]) {
  const linkedChatIds = getLinkedChatIdsByUserId(db, userId);
  linkedChatIds.forEach((chatId) => {
    const store = db.telegram?.byChatId?.[chatId];
    if (!store) return;
    const defaults = ensureTelegramDefaults(store);
    store.tasks = tasks.map((task) => normalizeTelegramTask(task, defaults));
    syncTelegramStoreToUserData(db, store);
  });
}

function canOwnTelegramPoller(db: DbShape, ownerId: string) {
  const now = Date.now();
  const heartbeatMs = 30_000;
  const current = db.telegram?.poller;

  if (!current) return true;
  if (current.ownerId === ownerId) return true;

  const updatedAt = Date.parse(current.updatedAt || '');
  if (!Number.isFinite(updatedAt)) return true;
  return now - updatedAt > heartbeatMs;
}

async function telegramRequest(token: string, method: string, body: Record<string, any>) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
}

async function sendTelegramMessage(token: string, chatId: string, text: string) {
  await telegramRequest(token, 'sendMessage', {
    chat_id: chatId,
    text,
  });
}

async function getTelegramBotStatus(token: string) {
  if (!token) {
    return {
      configured: false,
      tokenValid: false,
      botUsername: '',
      error: 'Telegram bot token is not configured.',
    };
  }

  try {
    const result = await telegramRequest(token, 'getMe', {});
    if (!result?.ok) {
      return {
        configured: true,
        tokenValid: false,
        botUsername: '',
        error: result?.description || 'Telegram token check failed.',
      };
    }

    return {
      configured: true,
      tokenValid: true,
      botUsername: String(result?.result?.username || ''),
      error: '',
    };
  } catch (error: any) {
    return {
      configured: true,
      tokenValid: false,
      botUsername: '',
      error: error?.message || 'Telegram bot check failed.',
    };
  }
}

function resolveTelegramBotToken() {
  const candidates = [
    process.env.TELEGRAM_BOT_TOKEN,
    process.env.TELEGRAM_BOT_TOKEN_1,
    process.env.TELEGRAM_BOT_TOKEN_PRIMARY,
  ]
    .map((value) => (value || '').trim())
    .filter(Boolean);

  return candidates[0] || '';
}

async function processBackgroundTaskReminders(dbPath: string) {
  const token = resolveTelegramBotToken();
  if (!token) return;

  const db = readDb(dbPath);
  db.telegram = db.telegram || { offset: 0, byChatId: {}, reminders: {} };
  db.telegram.reminders = db.telegram.reminders || {};

  const nowMs = Date.now();
  let changed = false;

  const usersById = new Map((db.users || []).map((user) => [user.id, user]));

  for (const [userId, state] of Object.entries(db.data || {})) {
    const tasks = Array.isArray((state as any)?.tasks) ? ((state as any).tasks as TelegramTask[]) : [];
    if (!tasks.length) continue;

    const userFromState = (state as any)?.user;
    const userFromDb = usersById.get(userId);
    const preferences = {
      ...defaultUserPreferences,
      ...(userFromDb?.preferences || {}),
      ...(userFromState?.preferences || {}),
      notifications: {
        ...defaultUserPreferences.notifications,
        ...(userFromDb?.preferences?.notifications || {}),
        ...(userFromState?.preferences?.notifications || {}),
      },
    };

    const chatId = normalizeChatId(preferences.telegramChatId);
    if (!chatId || !preferences.notifications?.taskReminders) continue;

    for (const rawTask of tasks) {
      const task = normalizeTelegramTask(rawTask);
      if (task.completed || task.alarmEnabled === false) continue;

      const due = parseTelegramTaskDueDate(task);
      if (!due) continue;

      const dueMs = due.getTime();
      const reminderMs = dueMs - 5 * 60 * 1000;
      const dueStamp = due.toISOString().slice(0, 16);

      const reminderKey = `${userId}|${task.id}|${dueStamp}|reminder`;
      const alarmKey = `${userId}|${task.id}|${dueStamp}|alarm`;

      if (!db.telegram.reminders[reminderKey] && nowMs >= reminderMs && nowMs <= dueMs + 75_000) {
        try {
          await sendTelegramMessage(
            token,
            chatId,
            `Task reminder: ${task.name} starts in 5 minutes (${task.time}).`
          );
          db.telegram.reminders[reminderKey] = new Date().toISOString();
          changed = true;
        } catch (error) {
          console.warn('Background reminder send failed:', error);
        }
      }

      if (!db.telegram.reminders[alarmKey] && nowMs >= dueMs && nowMs <= dueMs + 75_000) {
        try {
          await sendTelegramMessage(
            token,
            chatId,
            `Alarm now: ${task.name} is due (${task.time}).`
          );
          db.telegram.reminders[alarmKey] = new Date().toISOString();
          changed = true;
        } catch (error) {
          console.warn('Background alarm send failed:', error);
        }
      }
    }
  }

  // Keep the reminder map bounded.
  for (const [key, value] of Object.entries(db.telegram.reminders)) {
    const ts = Date.parse(value);
    if (!Number.isFinite(ts) || nowMs - ts > 3 * 24 * 60 * 60 * 1000) {
      delete db.telegram.reminders[key];
      changed = true;
    }
  }

  if (changed) {
    writeDb(dbPath, db);
  }
}

function parseBibleReminderTime(timeStr: string): { hours: number; minutes: number } | null {
  if (!timeStr) return null;
  
  const normalized = String(timeStr).trim().replace(/\s+/g, ' ').toUpperCase();
  const match12 = normalized.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  const match24 = normalized.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);

  if (match12) {
    let hours = Number(match12[1]);
    const minutes = Number(match12[2]);
    const period = match12[3];
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }

  if (match24) {
    return { hours: Number(match24[1]), minutes: Number(match24[2]) };
  }

  return null;
}

async function processBibleReminders(db: DbShape, token: string, now: Date) {
  let changed = false;
  const nowMs = now.getTime();

  // Process Bible reminders for each user with Telegram linked
  for (const [chatId, store] of Object.entries(db.telegram?.byChatId || {})) {
    const userId = store?.userId;
    if (!userId) continue;

    const userData = db.data?.[userId];
    if (!userData) continue;

    const prefs = userData.user?.preferences;
    if (!prefs?.bibleReminderTelegram || !prefs?.bibleReminderTime) continue;

    // Parse the reminder time
    const parsedTime = parseBibleReminderTime(prefs.bibleReminderTime);
    if (!parsedTime) {
      console.warn(`[Bible Reminder] Invalid time format for user ${userId}: ${prefs.bibleReminderTime}`);
      continue;
    }

    // Calculate the next reminder moment
    const reminderMoment = new Date(now);
    reminderMoment.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);

    // If the time has already passed today, it's tomorrow
    if (reminderMoment.getTime() <= now.getTime()) {
      reminderMoment.setDate(reminderMoment.getDate() + 1);
    }

    // Generate a key for this reminder (day-based to avoid multiple per day)
    const dateKey = now.toISOString().slice(0, 10);
    const reminderKey = `${chatId}|bible-reminder|${dateKey}`;

    // Check if we're within the window to send (60 seconds before to 60 seconds after)
    const delta = reminderMoment.getTime() - now.getTime();
    const isTimeToSend = delta <= 60 * 1000 && delta >= -60 * 1000;

    if (!isTimeToSend) {
      // Not yet time for the reminder
      continue;
    }

    // Check if we've already sent this reminder today
    if (db.telegram?.reminders?.[reminderKey]) {
      continue;
    }

    // Get the current Bible reading
    const reading = userData.bibleReading || { day: 1, passage: 'Bible Reading' };
    const message = `📖 *Daily Scripture* (Day ${reading.day})\n\n${reading.passage}\n\n_Time to read your daily Bible passage._`;

    try {
      console.log(`[Bible Reminder] Sending to ${chatId} at ${now.toLocaleString()}`);
      await sendTelegramMessage(token, chatId, message);
      db.telegram!.reminders![reminderKey] = now.toISOString();
      changed = true;
    } catch (error) {
      console.error(`[Bible Reminder] Failed to send for user ${userId}:`, error);
    }
  }

  return changed;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 6001);

  app.use(express.json({ limit: '25mb' }));

  // Simple file-based DB
  const DB_PATH = path.join(process.cwd(), 'db.json');
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], data: {}, sessions: {}, telegram: { offset: 0, byChatId: {} } }));
  }

  // API routes
  app.post('/api/eden/insight', async (req, res) => {
    try {
      const context = String(req.body?.context || '').trim();
      if (!context) {
        res.status(400).json({ success: false, error: 'context is required.' });
        return;
      }

      const text = await generateWithServerGemini({
        contents: `Based on this user context, provide a short, impactful Eden Insight (1-2 sentences).\nContext: ${context}\nTone: Meditative, disciplined, wise.`,
      });

      res.json({ success: true, text: text || 'Consistency over intensity. Keep one promise today.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Could not generate insight.' });
    }
  });

  app.post('/api/eden/bible-reading', async (req, res) => {
    try {
      const day = Math.max(1, Math.min(400, Number(req.body?.day || 1)));

      const raw = await generateWithServerGemini({
        contents: `Provide the Bible reading for Day ${day} of a 400-day chronological + thematic hybrid plan.\nReturn JSON only:\n{\n  "passage": "Book Chapter:Verse-Verse",\n  "text": "A key verse from this passage",\n  "context": "A brief 1-sentence explanation of why this reading matters today"\n}`,
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }],
      });

      const reading = parseJsonSafely<{ passage: string; text: string; context: string }>(raw);
      res.json({ success: true, reading });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Could not generate reading.' });
    }
  });

  app.post('/api/eden/suggest-task', async (req, res) => {
    try {
      const userName = String(req.body?.userName || 'User');
      const layer = String(req.body?.layer || 'general');
      const priority = String(req.body?.priority || 'C');
      const preferredTime = String(req.body?.preferredTime || '08:00');
      const intent = String(req.body?.intent || 'create one practical task');
      const preferredMusicHint = String(req.body?.userPreferences?.favoriteMusicName || '').trim();
      const layerKnowledge = req.body?.layerKnowledge || {};
      const appKnowledge = Array.isArray(req.body?.appKnowledge) ? req.body.appKnowledge : [];

      const raw = await generateWithServerGemini({
        contents: `Create one practical task for Edenify.\nReturn strict JSON only:\n{\n  "name": "task title",\n  "time": "08:00 AM",\n  "preferredMusic": "User uploaded song name if known"\n}\nContext:\n- User: ${userName}\n- Layer: ${layer}\n- Priority: ${priority}\n- Preferred Time: ${preferredTime}\n- Intent: ${intent}\n- Preferred user song: ${preferredMusicHint || 'none'}\n- Layer knowledge: ${Array.isArray(layerKnowledge[layer?.toLowerCase?.() || '']) ? layerKnowledge[layer.toLowerCase()].join(' ') : ''}\n- App knowledge: ${appKnowledge.join(' ')}`,
        responseMimeType: 'application/json',
      });

      const suggestion = parseJsonSafely<{ name: string; time: string; preferredMusic: string }>(raw);
      if (!suggestion.preferredMusic && preferredMusicHint) suggestion.preferredMusic = preferredMusicHint;
      res.json({ success: true, suggestion });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Could not suggest task.' });
    }
  });

  app.post('/api/eden/chat', async (req, res) => {
    try {
      const history = Array.isArray(req.body?.history) ? req.body.history : [];
      const message = String(req.body?.message || '').trim();
      const appKnowledge = Array.isArray(req.body?.appKnowledge) ? req.body.appKnowledge : [];

      if (!message) {
        res.status(400).json({ success: false, error: 'message is required.' });
        return;
      }

      const contents = history.map((h: any) => ({
        role: h.role,
        parts: Array.isArray(h.parts) ? h.parts : [{ text: String(h?.parts?.[0]?.text || '') }],
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const text = await generateWithServerGemini({
        contents,
        systemInstruction: `You are Eden, a spiritual and personal growth companion.\nYour purpose is to provide personalized insights, suggestions, and motivation based on the user's goals and progress across different life layers: Spiritual, Academic, Financial, Physical, and General.\nYour tone is meditative, disciplined, encouraging, and wise.\nApp knowledge:\n${appKnowledge.join('\n')}\nExecution policy:\n- Handle simple requests directly without over-explaining.\n- Reserve deep analysis for complex requests only.\n- Prefer concrete actions, short plans, and next-step clarity.\n- If data is missing, make a useful assumption and continue.\n- If the user asks to create/edit/complete/delete tasks, provide concise structured intent that a task action layer can execute.\n- For communication/social-skill questions, provide practical scripts and drills, not generic motivation.\nKeep responses concise and editorial in feel.`,
      });

      res.json({ success: true, text: text || 'Tell me your goal and I will give you one practical next step.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Could not generate chat response.' });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      res.status(400).json({ success: false, error: 'Email is required.' });
      return;
    }

    const db = readDb(DB_PATH);
    const isAdmin = normalizedEmail === 'kelylo.ing@gmail.com' && String(password || '') === 'K5l6l4??';

    if (isAdmin) {
      let admin = db.users.find((u) => u.email === normalizedEmail && u.role === 'admin');
      if (!admin) {
        admin = normalizeUser({
          email: normalizedEmail,
          name: 'Admin',
          role: 'admin',
        });
        db.users.push(admin);
        writeDb(DB_PATH, db);
      } else if (admin.id !== normalizedEmail) {
        admin.id = normalizedEmail;
        writeDb(DB_PATH, db);
      }

      const sessionId = createSessionId();
      db.sessions = db.sessions || {};
      db.sessions[sessionId] = { userId: admin.id, createdAt: new Date().toISOString() };
      writeDb(DB_PATH, db);
      res.setHeader('Set-Cookie', `edenify_session=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax`);
      res.json({ success: true, user: normalizeUser(admin) });
      return;
    }

    let account = db.users.find((u) => u.email === normalizedEmail);
    if (!account) {
      account = normalizeUser({
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
        password: String(password || ''),
        role: 'user',
      });
      db.users.push(account);
      writeDb(DB_PATH, db);
    } else if (account.id !== normalizedEmail) {
      const previousId = account.id;
      account.id = normalizedEmail;
      if (db.sessions) {
        Object.values(db.sessions).forEach((session) => {
          if (session.userId === previousId) {
            session.userId = normalizedEmail;
          }
        });
      }
      writeDb(DB_PATH, db);
    }

    const sessionId = createSessionId();
    db.sessions = db.sessions || {};
    db.sessions[sessionId] = { userId: account.id, createdAt: new Date().toISOString() };
    writeDb(DB_PATH, db);
    res.setHeader('Set-Cookie', `edenify_session=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax`);
    res.json({ success: true, user: normalizeUser(account) });
  });

  app.post('/api/auth/session', (req, res) => {
    const { user } = req.body as { user?: { id?: string; email?: string; name?: string; role?: 'admin' | 'user'; avatar?: string; preferences?: any } };
    if (!user?.id || !user?.email || !user?.name) {
      res.status(400).json({ success: false, error: 'user.id, user.email, and user.name are required.' });
      return;
    }

    const db = readDb(DB_PATH);
    db.users = db.users || [];

    const existing = db.users.find((item) => item.id === user.id || item.email === user.email);
    const nextUser = normalizeUser({
      ...existing,
      ...user,
      role: user.role || existing?.role || 'user',
    });

    if (existing) {
      existing.id = nextUser.id;
      existing.email = nextUser.email;
      existing.name = nextUser.name;
      existing.role = nextUser.role;
      existing.avatar = nextUser.avatar;
      existing.preferences = nextUser.preferences;
    } else {
      db.users.push(nextUser);
    }

    const sessionId = createSessionId();
    db.sessions = db.sessions || {};
    db.sessions[sessionId] = { userId: nextUser.id, createdAt: new Date().toISOString() };
    writeDb(DB_PATH, db);
    res.setHeader('Set-Cookie', `edenify_session=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax`);
    res.json({ success: true, user: nextUser });
  });

  app.get('/api/auth/session', (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.edenify_session;
    if (!sessionId) {
      res.json({ success: true, user: null });
      return;
    }

    const db = readDb(DB_PATH);
    const session = db.sessions?.[sessionId];
    if (!session) {
      res.json({ success: true, user: null });
      return;
    }

    const user = db.users.find((item) => item.id === session.userId) || null;
    if (user && user.email && user.id !== user.email) {
      const previousId = user.id;
      user.id = user.email.trim().toLowerCase();
      if (db.sessions) {
        Object.values(db.sessions).forEach((entry) => {
          if (entry.userId === previousId) {
            entry.userId = user!.id;
          }
        });
      }
      writeDb(DB_PATH, db);
    }

    if (user && !user.preferences?.telegramChatId && db.telegram?.byChatId) {
      const linked = Object.entries(db.telegram.byChatId).find(([, store]) => store?.userId === user.id);
      if (linked) {
        user.preferences = user.preferences || {};
        user.preferences.telegramChatId = linked[0];
        writeDb(DB_PATH, db);
      }
    }

    res.json({ success: true, user: user ? normalizeUser(user) : null });
  });

  app.post('/api/auth/logout', (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.edenify_session;
    const db = readDb(DB_PATH);
    if (sessionId && db.sessions?.[sessionId]) {
      delete db.sessions[sessionId];
      writeDb(DB_PATH, db);
    }

    res.setHeader('Set-Cookie', 'edenify_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    res.json({ success: true });
  });

  app.get("/api/data/:userId", async (req, res) => {
    const userId = String(req.params.userId || '').trim();
    if (!userId) {
      res.status(400).json({ success: false, error: 'userId is required.' });
      return;
    }

    const cloudState = await loadSupabaseUserState(userId);
    if (cloudState) {
      res.json(cloudState);
      return;
    }

    const db = readDb(DB_PATH);
    res.json(db.data[userId] || {});
  });

  app.post("/api/data/:userId", async (req, res) => {
    const userId = String(req.params.userId || '').trim();
    if (!userId) {
      res.status(400).json({ success: false, error: 'userId is required.' });
      return;
    }

    const db = readDb(DB_PATH);
    db.data[userId] = req.body;
    writeDb(DB_PATH, db);

    const cloudSaved = await saveSupabaseUserState(userId, req.body);
    res.json({ success: true, cloudSaved });
  });

  app.post('/api/telegram/notify', async (req, res) => {
    try {
      const token = resolveTelegramBotToken();
      const { chatId, message } = req.body as { chatId?: string; message?: string };
      const normalizedChatId = (chatId || '').trim().replace(/[^0-9-]/g, '');

      if (!token) {
        console.error('Telegram bot token is not configured. Set TELEGRAM_BOT_TOKEN (or TELEGRAM_BOT_TOKEN_1) in environment.');
        res.status(400).json({
          success: false,
          error: 'Telegram integration not configured. Please set TELEGRAM_BOT_TOKEN (or TELEGRAM_BOT_TOKEN_1) in server environment.',
        });
        return;
      }

      if (!normalizedChatId || !message) {
        res.status(400).json({ success: false, error: 'chatId and message are required.' });
        return;
      }

      const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: normalizedChatId,
          text: message,
        }),
      });

      const data = await telegramResponse.json();

      if (!telegramResponse.ok || !data?.ok) {
        console.error('Telegram API error:', data?.description || 'Unknown error', 'chatId=', normalizedChatId);
        res.status(502).json({ success: false, error: data?.description || 'Telegram API call failed.' });
        return;
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Telegram notification error:', error);
      res.status(500).json({ success: false, error: 'Could not send Telegram notification.' });
    }
  });

  app.get('/api/telegram/status', async (req, res) => {
    const token = resolveTelegramBotToken();
    const db = readDb(DB_PATH);
    const linkedChats = Object.keys(db.telegram?.byChatId || {}).length;
    const botStatus = await getTelegramBotStatus(token);
    res.json({
      success: true,
      configured: botStatus.configured,
      tokenValid: botStatus.tokenValid,
      botUsername: botStatus.botUsername,
      tokenError: botStatus.error,
      linkedChats,
      hasReminders: Boolean(db.telegram?.reminders && Object.keys(db.telegram.reminders).length > 0),
    });
  });

  app.post('/api/telegram/link', (req, res) => {
    const { chatId, userId } = req.body as { chatId?: string; userId?: string };
    const normalizedChatId = normalizeChatId(chatId);

    if (!normalizedChatId || !userId) {
      res.status(400).json({ success: false, error: 'chatId and userId are required.' });
      return;
    }

    const db = readDb(DB_PATH);
    const existingOwner = db.telegram!.byChatId![normalizedChatId]?.userId;
    if (existingOwner && existingOwner !== userId) {
      res.status(409).json({ success: false, error: 'This Telegram chat is already linked to another user.' });
      return;
    }

    const current = db.telegram!.byChatId![normalizedChatId] || { tasks: [] };
    const previousUnifiedTasks = mergeAllLinkedTelegramTasks(db, userId);

    db.telegram!.byChatId![normalizedChatId] = {
      ...current,
      userId,
    };

    db.telegram!.byChatId![normalizedChatId].defaults = {
      ...ensureTelegramDefaults(db.telegram!.byChatId![normalizedChatId]),
      ...(db.telegram!.byChatId![normalizedChatId].defaults || {}),
      ...inferTelegramDefaultsFromUser(db, userId),
    };

    const linkedTasks = mergeTelegramTasksByIdentity(
      previousUnifiedTasks,
      db.telegram!.byChatId![normalizedChatId].tasks || []
    );

    propagateUserTasksToLinkedChats(db, userId, linkedTasks);
    
    // Update user preferences in db.users to include telegramChatId
    const user = db.users?.find((u) => u.id === userId);
    if (user) {
      user.preferences = user.preferences || {};
      user.preferences.telegramChatId = normalizedChatId;
    }
    
    // Also update in db.data for consistency
    db.data = db.data || {};
    const userData = db.data[userId] || {};
    db.data[userId] = {
      ...userData,
      tasks: mergeTelegramTasksByIdentity((userData.tasks || []) as TelegramTask[], linkedTasks),
      preferences: {
        ...(userData.preferences || {}),
        telegramChatId: normalizedChatId,
      },
    };
    
    syncTelegramStoreToUserData(db, db.telegram!.byChatId![normalizedChatId]);
    writeDb(DB_PATH, db);
    res.json({ success: true });
  });

  app.get('/api/telegram/tasks/:chatId', (req, res) => {
    const normalizedChatId = normalizeChatId(req.params.chatId);
    if (!normalizedChatId) {
      res.status(400).json({ success: false, error: 'chatId is invalid.' });
      return;
    }

    const db = readDb(DB_PATH);
    const payload = db.telegram!.byChatId![normalizedChatId] || { tasks: [] };
    if (payload.userId) {
      const mergedTasks = mergeAllLinkedTelegramTasks(db, payload.userId);
      res.json({ success: true, tasks: mergedTasks });
      return;
    }

    res.json({ success: true, tasks: payload.tasks || [] });
  });

  app.post('/api/telegram/tasks/:chatId', (req, res) => {
    const normalizedChatId = normalizeChatId(req.params.chatId);
    const tasks = (req.body?.tasks || []) as TelegramTask[];
    const userId = req.body?.userId as string | undefined;

    if (!normalizedChatId) {
      res.status(400).json({ success: false, error: 'chatId is invalid.' });
      return;
    }

    const db = readDb(DB_PATH);
    const current = db.telegram!.byChatId![normalizedChatId] || { tasks: [] };
    const defaults = ensureTelegramDefaults(current);
    db.telegram!.byChatId![normalizedChatId] = {
      ...current,
      userId: userId || current.userId,
      tasks: tasks.map((task) => normalizeTelegramTask(task, defaults)),
    };

    const ownerId = db.telegram!.byChatId![normalizedChatId].userId;
    if (ownerId) {
      const unifiedTasks = mergeAllLinkedTelegramTasks(db, ownerId);
      propagateUserTasksToLinkedChats(db, ownerId, unifiedTasks);
    }

    syncTelegramStoreToUserData(db, db.telegram!.byChatId![normalizedChatId]);

    writeDb(DB_PATH, db);
    res.json({ success: true });
  });

  app.get('/api/telegram/chatid-help', (_req, res) => {
    res.json({
      success: true,
      steps: [
        'Open your Telegram bot and press Start.',
        'Send /chatid to the bot.',
        'Copy the returned numeric ID and paste it into Edenify Profile settings.',
      ],
    });
  });

  const token = resolveTelegramBotToken();
  let isPollingTelegram = false;
  let isRunningReminderScheduler = false;
  const pollerOwnerId = `${process.pid}-${Math.random().toString(16).slice(2, 8)}`;
  const pollTelegram = async () => {
    if (!token) return;
    if (isPollingTelegram) return;
    isPollingTelegram = true;

    try {
      const db = readDb(DB_PATH);
      db.telegram = db.telegram || { offset: 0, byChatId: {} };
      if (!canOwnTelegramPoller(db, pollerOwnerId)) {
        return;
      }

      db.telegram.poller = {
        ownerId: pollerOwnerId,
        updatedAt: new Date().toISOString(),
      };
      writeDb(DB_PATH, db);

      const offset = (db.telegram?.offset || 0) + 1;
      const result = await telegramRequest(token, 'getUpdates', { offset, timeout: 10 });
      const updates = (result?.result || []) as any[];
      if (updates.length === 0) {
        const latest = readDb(DB_PATH);
        latest.telegram = latest.telegram || { offset: 0, byChatId: {} };
        if (latest.telegram.poller?.ownerId === pollerOwnerId) {
          latest.telegram.poller.updatedAt = new Date().toISOString();
          writeDb(DB_PATH, latest);
        }
        return;
      }

      for (const update of updates) {
        const updateId = update.update_id as number;
        const message = update.message;
        if (!message?.chat?.id) {
          db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
          continue;
        }

        const chatId = normalizeChatId(String(message.chat.id));
        const text = String(message.text || '').trim();
        if (!chatId || !text) {
          db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
          continue;
        }

        const store = db.telegram!.byChatId![chatId] || { tasks: [] };
        store.tasks = (store.tasks || []).map((task) => reopenTelegramTaskAfterWindow(task));
        const nowMs = Date.now();
        const activeTasks = store.tasks.filter((task) => !task.completed);
        const activeDailyTasks = activeTasks.filter((task) => task.repeat === 'daily');
        const activePendingTasks = activeTasks.filter((task) => task.repeat !== 'daily');
        const command = text.toLowerCase();
        const defaults = ensureTelegramDefaults(store);
        const clearWizard = () => {
          store.wizard = undefined;
        };

        const ensureSetWizard = () => {
          store.wizard = {
            mode: 'set',
            step: 'name',
            draft: {
              layerId: defaults.layerId,
              priority: defaults.priority,
              repeat: defaults.repeat,
              time: defaults.time,
              alarmEnabled: true,
              preferredMusic: defaults.preferredMusic,
            },
          };
        };

        if (command === '/cancel') {
          clearWizard();
          await sendTelegramMessage(token, chatId, 'Wizard cancelled.');
        } else if (command === '/defaults') {
          store.wizard = { mode: 'defaults', step: 'repeat' };
          await sendTelegramMessage(token, chatId, `Default setup 1/2: choose repeat mode by number:\n${formatNumberedOptions(repeatOptions)}\nCurrent: ${defaults.repeat}`);
        } else if (command === '/help' || command === '/start') {
          await sendTelegramMessage(
            token,
            chatId,
            'Edenify bot is alive.\nCommands:\n/set - step by step add task\n/delete - choose undone task to delete\n/edit or /modify - choose task to edit\n/tasks - list tasks\n/chatid - show chat id\n/defaults - set default repeat/time\n/cancel - cancel current wizard'
          );
        } else if (command === '/chatid') {
          await sendTelegramMessage(token, chatId, `Your chat ID is: ${chatId}`);
        } else if (command === '/tasks') {
          if (activeTasks.length === 0) {
            await sendTelegramMessage(token, chatId, 'No pending tasks. Use /set to add a new one.');
          } else {
            const sections: string[] = [];
            if (activePendingTasks.length > 0) {
              sections.push(`Pending tasks:\n${activePendingTasks.map((task, index) => taskToLine(task, index)).join('\n')}`);
            }
            if (activeDailyTasks.length > 0) {
              sections.push(`Daily tasks:\n${activeDailyTasks.map((task, index) => taskToLine(task, index)).join('\n')}`);
            }
            await sendTelegramMessage(token, chatId, sections.join('\n\n'));
          }
        } else if (command === '/set') {
          ensureSetWizard();
          await sendTelegramMessage(token, chatId, buildWizardCard({
            flow: 'TASK SETUP',
            step: 1,
            total: 5,
            title: 'Task Name',
            prompt: 'Type the task name.',
            hint: 'Example: Eat healthy meal',
          }));
        } else if (command === '/delete') {
          if (activeTasks.length === 0) {
            await sendTelegramMessage(token, chatId, 'No undone tasks to delete.');
          } else {
            store.wizard = { mode: 'delete', step: 'choose' };
            await sendTelegramMessage(token, chatId, `Choose task number to delete:\n${activeTasks.map((task, index) => taskToLine(task, index)).join('\n')}`);
          }
        } else if (command === '/edit' || command === '/modify') {
          if (activeTasks.length === 0) {
            await sendTelegramMessage(token, chatId, 'No undone tasks to edit.');
          } else {
            store.wizard = { mode: 'edit', step: 'choose' };
            await sendTelegramMessage(token, chatId, `Choose task number to edit:\n${activeTasks.map((task, index) => taskToLine(task, index)).join('\n')}`);
          }
        } else if (store.wizard?.mode === 'defaults') {
          store.defaults = store.defaults || {};
          if (store.wizard.step === 'repeat') {
            const value = resolveNumberedChoice(text, repeatOptions) as RepeatMode | null;
            if (!value || !repeatOptions.includes(value)) {
              store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
              if (store.wizard.invalidAttempts >= 4) {
                await sendTelegramMessage(token, chatId, 'Too many invalid repeat entries. Defaults setup cancelled.\nUse /defaults to start over.');
                clearWizard();
                db.telegram!.byChatId![chatId] = store;
                db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                continue;
              }
              await sendTelegramMessage(token, chatId, `Invalid choice. Send a number from the list.\n${formatNumberedOptions(repeatOptions)}`);
            } else {
              store.defaults.repeat = value;
              store.wizard.step = 'time';
              store.wizard.invalidAttempts = 0;
              await sendTelegramMessage(token, chatId, `Default setup 2/2: send default time in 24h format (example 08:00). Current: ${defaults.time}`);
            }
          } else if (store.wizard.step === 'time') {
            if (!isValidTaskTime(text)) {
              store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
              if (store.wizard.invalidAttempts >= 4) {
                await sendTelegramMessage(token, chatId, 'Too many invalid time entries. Defaults setup cancelled.\nUse /defaults to start over.');
                clearWizard();
                db.telegram!.byChatId![chatId] = store;
                db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                continue;
              }
              await sendTelegramMessage(token, chatId, 'Invalid time. Use 24h format HH:mm (example 18:30).');
            } else {
              store.defaults.time = normalize24HourTime(text);
              clearWizard();
              await sendTelegramMessage(token, chatId, `Defaults saved. Repeat: ${store.defaults.repeat}, Time: ${store.defaults.time}`);
            }
          }
        } else if (store.wizard?.mode === 'delete' && store.wizard.step === 'choose') {
          const index = parseChoiceIndex(text, activeTasks.length);
          if (index < 0) {
            store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
            if (store.wizard.invalidAttempts >= 4) {
              await sendTelegramMessage(token, chatId, 'Too many invalid choices. Delete cancelled.\nUse /delete to start over.');
              clearWizard();
              db.telegram!.byChatId![chatId] = store;
              db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
              continue;
            }
            await sendTelegramMessage(token, chatId, 'Invalid choice. Send a number from the list or /cancel.');
          } else {
            const target = activeTasks[index];
            store.tasks = store.tasks.filter((task) => task.id !== target.id);
            clearWizard();
            await sendTelegramMessage(token, chatId, `Deleted: ${target.name}`);
          }
        } else if (store.wizard?.mode === 'edit') {
          if (store.wizard.step === 'choose') {
            const index = parseChoiceIndex(text, activeTasks.length);
            if (index < 0) {
              store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
              if (store.wizard.invalidAttempts >= 4) {
                await sendTelegramMessage(token, chatId, 'Too many invalid choices. Edit cancelled.\nUse /edit to start over.');
                clearWizard();
                db.telegram!.byChatId![chatId] = store;
                db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                continue;
              }
              await sendTelegramMessage(token, chatId, 'Invalid choice. Send a number from the list or /cancel.');
            } else {
              const target = activeTasks[index];
              store.wizard = { mode: 'edit', step: 'field', targetTaskId: target.id, invalidAttempts: 0 };
              await sendTelegramMessage(token, chatId, 'What to edit? Choose number:\n1. name\n2. time\n3. repeat\n4. layer\n5. priority');
            }
          } else if (store.wizard.step === 'field') {
            const editFields = ['name', 'time', 'repeat', 'layer', 'priority'];
            const fieldByNumber = parseChoiceIndex(text, editFields.length);
            const field = fieldByNumber >= 0 ? editFields[fieldByNumber] : text.toLowerCase();
            const valid = editFields;
            if (!valid.includes(field)) {
              store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
              if (store.wizard.invalidAttempts >= 4) {
                await sendTelegramMessage(token, chatId, 'Too many invalid field choices. Edit cancelled.\nUse /edit to start over.');
                clearWizard();
                db.telegram!.byChatId![chatId] = store;
                db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                continue;
              }
              await sendTelegramMessage(token, chatId, 'Invalid field. Choose: 1.name 2.time 3.repeat 4.layer 5.priority');
            } else {
              store.wizard.step = `value:${field}`;
              store.wizard.invalidAttempts = 0;
              if (field === 'repeat') {
                await sendTelegramMessage(token, chatId, `Choose new repeat mode by number:\n${formatNumberedOptions(repeatOptions)}`);
              } else if (field === 'layer') {
                await sendTelegramMessage(token, chatId, `Choose new layer by number:\n${formatNumberedOptions(layerOptions)}`);
              } else if (field === 'priority') {
                await sendTelegramMessage(token, chatId, `Choose new priority by number:\n${formatNumberedOptions(priorityOptions)}`);
              } else {
                await sendTelegramMessage(token, chatId, `Send new value for ${field}.`);
              }
            }
          } else if (store.wizard.step.startsWith('value:')) {
            const field = store.wizard.step.split(':')[1];
            const idx = store.tasks.findIndex((task) => task.id === store.wizard!.targetTaskId);
            if (idx < 0) {
              clearWizard();
              await sendTelegramMessage(token, chatId, 'Task not found anymore.');
            } else {
              const next = { ...store.tasks[idx] };
              if (field === 'name') {
                if (text.trim().length < 2) {
                  store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
                  if (store.wizard.invalidAttempts >= 4) {
                    await sendTelegramMessage(token, chatId, 'Too many invalid name entries. Edit cancelled.\nUse /edit to start over.');
                    clearWizard();
                    db.telegram!.byChatId![chatId] = store;
                    db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                    continue;
                  }
                  await sendTelegramMessage(token, chatId, 'Name is too short. Send at least 2 characters.');
                  db.telegram!.byChatId![chatId] = store;
                  db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                  continue;
                }
                next.name = text;
              }
              if (field === 'time') {
                if (!isValidTaskTime(text)) {
                  store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
                  if (store.wizard.invalidAttempts >= 4) {
                    await sendTelegramMessage(token, chatId, 'Too many invalid time entries. Edit cancelled.\nUse /edit to start over.');
                    clearWizard();
                    db.telegram!.byChatId![chatId] = store;
                    db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                    continue;
                  }
                  await sendTelegramMessage(token, chatId, 'Invalid time. Use 24h format HH:mm (example 18:30).');
                  db.telegram!.byChatId![chatId] = store;
                  db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                  continue;
                }
                next.time = normalize24HourTime(text);
              }
              if (field === 'repeat') {
                const value = resolveNumberedChoice(text, repeatOptions) as RepeatMode | null;
                if (!value || !repeatOptions.includes(value)) {
                  store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
                  if (store.wizard.invalidAttempts >= 4) {
                    await sendTelegramMessage(token, chatId, 'Too many invalid repeat entries. Edit cancelled.\nUse /edit to start over.');
                    clearWizard();
                    db.telegram!.byChatId![chatId] = store;
                    db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                    continue;
                  }
                  await sendTelegramMessage(token, chatId, `Invalid choice.\n${formatNumberedOptions(repeatOptions)}`);
                  db.telegram!.byChatId![chatId] = store;
                  db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                  continue;
                }
                next.repeat = value;
              }
              if (field === 'layer') {
                const value = resolveNumberedChoice(text, layerOptions) as LayerId | null;
                if (!value || !layerOptions.includes(value)) {
                  store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
                  if (store.wizard.invalidAttempts >= 4) {
                    await sendTelegramMessage(token, chatId, 'Too many invalid layer entries. Edit cancelled.\nUse /edit to start over.');
                    clearWizard();
                    db.telegram!.byChatId![chatId] = store;
                    db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                    continue;
                  }
                  await sendTelegramMessage(token, chatId, `Invalid choice.\n${formatNumberedOptions(layerOptions)}`);
                  db.telegram!.byChatId![chatId] = store;
                  db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                  continue;
                }
                next.layerId = value;
              }
              if (field === 'priority') {
                const value = resolveNumberedChoice(text.toUpperCase(), priorityOptions) as Priority | null;
                if (!value || !priorityOptions.includes(value)) {
                  store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
                  if (store.wizard.invalidAttempts >= 4) {
                    await sendTelegramMessage(token, chatId, 'Too many invalid priority entries. Edit cancelled.\nUse /edit to start over.');
                    clearWizard();
                    db.telegram!.byChatId![chatId] = store;
                    db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                    continue;
                  }
                  await sendTelegramMessage(token, chatId, `Invalid choice.\n${formatNumberedOptions(priorityOptions)}`);
                  db.telegram!.byChatId![chatId] = store;
                  db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                  continue;
                }
                next.priority = value;
              }
              store.tasks[idx] = next;
              clearWizard();
              await sendTelegramMessage(token, chatId, `Updated task: ${next.name}`);
            }
          }
        } else if (store.wizard?.mode === 'set') {
          const draft = store.wizard.draft || {};
          if (store.wizard.step === 'name') {
            if (text.trim().length < 2) {
              store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
              if (store.wizard.invalidAttempts >= 4) {
                await sendTelegramMessage(token, chatId, 'Task name too short too many times. Task setup cancelled.\nUse /set to start over.');
                store.wizard = undefined;
                db.telegram!.byChatId![chatId] = store;
                db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                continue;
              }
              await sendTelegramMessage(token, chatId, buildWizardCard({
                flow: 'TASK SETUP',
                step: 1,
                total: 5,
                title: 'Task Name',
                prompt: 'Task name is too short. Type at least 2 characters.',
                hint: 'Example: Drink water',
              }));
              db.telegram!.byChatId![chatId] = store;
              db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
              continue;
            }
            draft.name = text;
            store.wizard = { ...store.wizard, step: 'time', draft, invalidAttempts: 0 };
            await sendTelegramMessage(token, chatId, buildWizardCard({
              flow: 'TASK SETUP',
              step: 2,
              total: 5,
              title: 'Time (24h)',
              prompt: 'Type task time in 24-hour format HH:mm.',
              hint: 'Example: 21:30',
            }));
          } else if (store.wizard.step === 'time') {
            if (!isValidTaskTime(text)) {
              store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
              if (store.wizard.invalidAttempts >= 4) {
                await sendTelegramMessage(token, chatId, 'Too many invalid time entries. Task setup cancelled.\nUse /set to start over.');
                store.wizard = undefined;
                db.telegram!.byChatId![chatId] = store;
                db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                continue;
              }
              await sendTelegramMessage(token, chatId, buildWizardCard({
                flow: 'TASK SETUP',
                step: 2,
                total: 5,
                title: 'Time (24h)',
                prompt: 'Invalid time format.',
                hint: 'Use HH:mm, example 07:05 or 21:30',
              }));
              db.telegram!.byChatId![chatId] = store;
              db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
              continue;
            }
            draft.time = normalize24HourTime(text);
            store.wizard = { ...store.wizard, step: 'repeat', draft, invalidAttempts: 0 };
            await sendTelegramMessage(token, chatId, buildWizardCard({
              flow: 'TASK SETUP',
              step: 3,
              total: 5,
              title: 'Repeat',
              prompt: 'Choose repeat mode by number.',
              options: repeatOptions,
            }));
          } else if (store.wizard.step === 'repeat') {
            const value = resolveNumberedChoice(text, repeatOptions) as RepeatMode | null;
            if (!value || !repeatOptions.includes(value)) {
              store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
              if (store.wizard.invalidAttempts >= 4) {
                await sendTelegramMessage(token, chatId, 'Too many invalid repeat entries. Task setup cancelled.\nUse /set to start over.');
                store.wizard = undefined;
                db.telegram!.byChatId![chatId] = store;
                db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                continue;
              }
              await sendTelegramMessage(token, chatId, buildWizardCard({
                flow: 'TASK SETUP',
                step: 3,
                total: 5,
                title: 'Repeat',
                prompt: 'Invalid choice. Choose by number.',
                options: repeatOptions,
              }));
              db.telegram!.byChatId![chatId] = store;
              db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
              continue;
            }
            draft.repeat = value;
            store.wizard = { ...store.wizard, step: 'layer', draft, invalidAttempts: 0 };
            await sendTelegramMessage(token, chatId, buildWizardCard({
              flow: 'TASK SETUP',
              step: 4,
              total: 5,
              title: 'Layer',
              prompt: 'Choose layer by number.',
              options: layerOptions,
            }));
          } else if (store.wizard.step === 'layer') {
            const value = resolveNumberedChoice(text, layerOptions) as LayerId | null;
            if (!value || !layerOptions.includes(value)) {
              store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
              if (store.wizard.invalidAttempts >= 4) {
                await sendTelegramMessage(token, chatId, 'Too many invalid layer entries. Task setup cancelled.\nUse /set to start over.');
                store.wizard = undefined;
                db.telegram!.byChatId![chatId] = store;
                db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                continue;
              }
              await sendTelegramMessage(token, chatId, buildWizardCard({
                flow: 'TASK SETUP',
                step: 4,
                total: 5,
                title: 'Layer',
                prompt: 'Invalid choice. Choose by number.',
                options: layerOptions,
              }));
              db.telegram!.byChatId![chatId] = store;
              db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
              continue;
            }
            draft.layerId = value;
            store.wizard = { ...store.wizard, step: 'priority', draft, invalidAttempts: 0 };
            await sendTelegramMessage(token, chatId, buildWizardCard({
              flow: 'TASK SETUP',
              step: 5,
              total: 5,
              title: 'Priority',
              prompt: 'Choose priority by number.',
              options: priorityOptions,
            }));
          } else if (store.wizard.step === 'priority') {
            const value = resolveNumberedChoice(text.toUpperCase(), priorityOptions) as Priority | null;
            if (!value || !priorityOptions.includes(value)) {
              store.wizard.invalidAttempts = (store.wizard.invalidAttempts || 0) + 1;
              if (store.wizard.invalidAttempts >= 4) {
                await sendTelegramMessage(token, chatId, 'Too many invalid priority entries. Task setup cancelled.\nUse /set to start over.');
                store.wizard = undefined;
                db.telegram!.byChatId![chatId] = store;
                db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
                continue;
              }
              await sendTelegramMessage(token, chatId, buildWizardCard({
                flow: 'TASK SETUP',
                step: 5,
                total: 5,
                title: 'Priority',
                prompt: 'Invalid choice. Choose by number.',
                options: priorityOptions,
              }));
              db.telegram!.byChatId![chatId] = store;
              db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
              continue;
            }
            draft.priority = value;
            const task: TelegramTask = {
              id: `tg-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
              name: draft.name || 'Untitled task',
              layerId: (draft.layerId as LayerId) || 'general',
              priority: (draft.priority as Priority) || 'C',
              repeat: (draft.repeat as RepeatMode) || 'once',
              time: draft.time || defaults.time,
              completed: false,
              date: new Date().toISOString(),
              alarmEnabled: true,
              preferredMusic: draft.preferredMusic || defaults.preferredMusic || '',
              estimatedDuration: getTaskDurationMinutes(draft),
              durationStartedAt: new Date().toISOString(),
            };
            store.tasks.push(normalizeTelegramTask(task, defaults));
            clearWizard();
            await sendTelegramMessage(token, chatId, `Task created: ${task.name} at ${task.time} (${task.repeat})`);
          }
        } else {
          await sendTelegramMessage(
            token,
            chatId,
            'Become that person you have been dreaming about with Edenify.\nCommands:\n/set - step by step add task\n/delete - choose undone task to delete\n/edit or /modify - choose task to edit\n/tasks - list tasks\n/chatid - show your chat id\n/defaults - configure default repeat/time\n/cancel - cancel current wizard'
          );
        }

        syncTelegramStoreToUserData(db, store);
        db.telegram!.byChatId![chatId] = store;
        db.telegram!.offset = Math.max(db.telegram!.offset || 0, updateId);
      }

      db.telegram!.poller = {
        ownerId: pollerOwnerId,
        updatedAt: new Date().toISOString(),
      };
      writeDb(DB_PATH, db);
    } catch (error) {
      console.error('Telegram polling failed:', error);
    } finally {
      isPollingTelegram = false;
    }
  };

  if (token) {
    const runTelegramReminderScheduler = async () => {
      if (isRunningReminderScheduler) return;
      isRunningReminderScheduler = true;

      try {
        const db = readDb(DB_PATH);
        db.telegram = db.telegram || { offset: 0, byChatId: {}, reminders: {} };
        db.telegram.byChatId = db.telegram.byChatId || {};
        db.telegram.reminders = db.telegram.reminders || {};
        db.data = db.data || {};

        const now = new Date();
        let didChange = false;

        // Keep reminder state bounded to avoid unbounded db growth.
        Object.entries(db.telegram.reminders).forEach(([key, sentAt]) => {
          const sentMs = Date.parse(sentAt || '');
          if (!Number.isFinite(sentMs) || now.getTime() - sentMs > 3 * 24 * 60 * 60 * 1000) {
            delete db.telegram!.reminders![key];
            didChange = true;
          }
        });

        // Process Telegram-created tasks
        for (const [chatId, store] of Object.entries(db.telegram.byChatId)) {
          const tasks = (store?.tasks || []).map((task) => reopenTelegramTaskAfterWindow(task, now.getTime()));
          if (store) {
            store.tasks = tasks;
          }
          for (const task of tasks) {
            if (task.completed || task.alarmEnabled === false) continue;

            const reminderMoment = getTelegramReminderMoment(task, now);
            if (!reminderMoment) continue;

            const minutesKey = reminderMoment.toISOString().slice(0, 16);
            const reminderKey = `${chatId}|${task.id}|${minutesKey}`;
            const dueDate = parseTelegramTaskDueDate(task);
            const dueKey = `${chatId}|${task.id}|${minutesKey}|due`;
            const delta = reminderMoment.getTime() - now.getTime();
            if (!db.telegram.reminders[reminderKey] && delta <= 60 * 1000 && delta >= -4 * 60 * 1000) {
              await sendTelegramMessage(
                token,
                chatId,
                `Reminder: ${task.name} from ${task.layerId} starts in 5 minutes, be ready! (${task.time}).`
              );

              db.telegram.reminders[reminderKey] = now.toISOString();
              didChange = true;
            }

            if (dueDate) {
              const dueDelta = dueDate.getTime() - now.getTime();
              if (!db.telegram.reminders[dueKey] && dueDelta <= 60 * 1000 && dueDelta >= -75 * 1000) {
                await sendTelegramMessage(token, chatId, `Alarm now: ${task.name} is due (${task.time}).`);
                db.telegram.reminders[dueKey] = now.toISOString();
                didChange = true;
              }
            }
          }
        }

        // Process app-created tasks and send reminders to linked Telegram chats
        for (const [chatId, store] of Object.entries(db.telegram.byChatId)) {
          const userId = store?.userId;
          if (!userId) continue;

          const userData = db.data[userId];
          if (!userData || !Array.isArray(userData.tasks)) continue;

          const appTasks = userData.tasks || [];
          const normalizedAppTasks = appTasks.map((task: any) => {
            if (!task?.completed) return task;
            const completedAt = new Date(task.durationStartedAt || task.date || now.toISOString()).getTime();
            if (!Number.isFinite(completedAt)) return task;
            const durationMinutes = getTaskDurationMinutes(task);
            if (now.getTime() - completedAt < durationMinutes * 60 * 1000) return task;
            return { ...task, completed: false, durationStartedAt: now.toISOString() };
          });
          userData.tasks = normalizedAppTasks;

          for (const task of normalizedAppTasks) {
            if (task.completed || task.alarmEnabled === false) continue;

            // Skip if this task is already handled by Telegram store (avoid duplicates)
            const isTelegramTask = store.tasks?.some((t: any) => t.id === task.id);
            if (isTelegramTask) continue;

            const reminderMoment = getTelegramReminderMoment(task, now);
            if (!reminderMoment) continue;

            const minutesKey = reminderMoment.toISOString().slice(0, 16);
            const reminderKey = `${chatId}|${task.id}|${minutesKey}`;
            const dueDate = parseTelegramTaskDueDate(task);
            const dueKey = `${chatId}|${task.id}|${minutesKey}|due`;
            const delta = reminderMoment.getTime() - now.getTime();
            if (!db.telegram.reminders[reminderKey] && delta <= 60 * 1000 && delta >= -4 * 60 * 1000) {
              await sendTelegramMessage(
                token,
                chatId,
                `Reminder: ${task.name} from ${task.layerId} starts in 5 minutes (${task.time}).`
              );

              db.telegram.reminders[reminderKey] = now.toISOString();
              didChange = true;
            }

            if (dueDate) {
              const dueDelta = dueDate.getTime() - now.getTime();
              if (!db.telegram.reminders[dueKey] && dueDelta <= 60 * 1000 && dueDelta >= -75 * 1000) {
                await sendTelegramMessage(token, chatId, `Alarm now: ${task.name} is due (${task.time}).`);
                db.telegram.reminders[dueKey] = now.toISOString();
                didChange = true;
              }
            }
          }
        }

        // Process Bible reminders from backend
        const bibleReminderChanged = await processBibleReminders(db, token, now);
        if (bibleReminderChanged) {
          didChange = true;
        }

        if (didChange) {
          writeDb(DB_PATH, db);
        }
      } catch (error) {
        console.error('Telegram reminder scheduler failed:', error);
      } finally {
        isRunningReminderScheduler = false;
      }
    };

    setInterval(() => {
      pollTelegram();
    }, 3500);

    setInterval(() => {
      runTelegramReminderScheduler();
    }, 30000);

    pollTelegram();
    runTelegramReminderScheduler();
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const listenWithFallback = (port: number, retriesLeft: number) => {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    server.on('error', (error: any) => {
      if (error?.code === 'EADDRINUSE' && retriesLeft > 0) {
        const nextPort = port + 1;
        console.warn(`Port ${port} is busy. Retrying on ${nextPort}...`);
        listenWithFallback(nextPort, retriesLeft - 1);
        return;
      }
      console.error('Server failed to start:', error);
      process.exit(1);
    });
  };

  listenWithFallback(PORT, 5);
}

startServer();
