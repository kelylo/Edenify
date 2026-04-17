import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Telegraf } from 'telegraf';
import type { Context } from 'telegraf';

dotenv.config();

type LayerId = 'spiritual' | 'academic' | 'financial' | 'physical' | 'general';
type Priority = 'A' | 'B' | 'C' | 'D' | 'E';
type RepeatMode = 'once' | 'daily' | 'weekly';

interface TodoItem {
  id: string;
  text: string;
  dueAt: string;
  layerId: LayerId;
  priority: Priority;
  repeat: RepeatMode;
  done: boolean;
  createdAt: string;
  updatedAt: string;
  reminderSentAt?: string;
  dueSentAt?: string;
  completedCount?: number;
}

interface ChatProfile {
  scriptureStartDate?: string;
  scriptureFirstTime?: string;
  scriptureSecondTime?: string;
  scriptureLastSentDatePart1?: string;
  scriptureLastSentDatePart2?: string;
  defaultLayerId?: LayerId;
  defaultPriority?: Priority;
  defaultRepeat?: RepeatMode;
  streakCurrent?: number;
  streakLongest?: number;
  lastCompletionDate?: string;
}

interface ChatStore {
  profile?: ChatProfile;
  todos: TodoItem[];
}

interface BotStore {
  chats: Record<string, ChatStore>;
  meta?: {
    updateOffset?: number;
  };
}

interface BibleDayEntry {
  passages: string;
}

interface BiblePlan {
  readings?: Record<string, BibleDayEntry>;
}

interface BibleVerseRow {
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

interface ParsedReference {
  bookName: string;
  chapterStart: number;
  chapterEnd: number;
  verseStart?: number;
  verseEnd?: number;
}

interface TaskInput {
  text: string;
  dueAt: string;
  layerId?: LayerId;
  priority?: Priority;
  repeat?: RepeatMode;
}

const LAYERS: LayerId[] = ['spiritual', 'academic', 'financial', 'physical', 'general'];
const PRIORITIES: Priority[] = ['A', 'B', 'C', 'D', 'E'];
const REPEATS: RepeatMode[] = ['once', 'daily', 'weekly'];
const PRIORITY_WEIGHT: Record<Priority, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const projectRoot = path.resolve(currentDir, '..');

const botToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
if (!botToken) {
  throw new Error('Missing TELEGRAM_BOT_TOKEN. Create telegram-standalone/.env from .env.example.');
}

const storePath = path.resolve(projectRoot, process.env.BOT_STORE_PATH || path.join('data', 'store.json'));
const biblePlanPath = path.resolve(projectRoot, process.env.BIBLE_PLAN_PATH || path.join('data', 'bible-plan.json'));
const bibleDbPath = path.resolve(projectRoot, process.env.BIBLE_DB_PATH || path.join('data', 'bible-data.json'));
const timezoneLabel = (process.env.BOT_TIMEZONE || 'UTC').trim();
const port = Number.parseInt(process.env.PORT || '8787', 10);
const reminderLeadMs = 5 * 60 * 1000;
const reminderIntervalMs = 30 * 1000;
const defaultScriptureFirstTime = '06:30';
const defaultScriptureSecondTime = '20:30';
const runMode = (process.env.BOT_RUN_MODE || 'daemon').trim().toLowerCase();

const bot = new Telegraf(botToken);

let biblePlanCache: BiblePlan | null = null;
let bibleVerseCache: BibleVerseRow[] | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function todayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function chatIdFrom(ctx: Context): string {
  const id = ctx.chat?.id;
  if (id === undefined || id === null) {
    throw new Error('Could not resolve chat id from Telegram context.');
  }
  return String(id);
}

function messageTextFrom(ctx: Context): string {
  const message = ctx.message;
  if (!message || !('text' in message)) return '';
  return String(message.text || '').trim();
}

function removeCommandPrefix(text: string, command: string): string {
  const escaped = command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^/${escaped}(?:@\\w+)?\\s*`, 'i');
  return text.replace(regex, '').trim();
}

function commandNameFromText(text: string): string | null {
  const first = text.trim().split(/\s+/)[0] || '';
  if (!first.startsWith('/')) return null;
  const token = first.slice(1).split('@')[0];
  return token.toLowerCase() || null;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function isLayerId(value: string): value is LayerId {
  return LAYERS.includes(value as LayerId);
}

function isPriority(value: string): value is Priority {
  return PRIORITIES.includes(value as Priority);
}

function isRepeat(value: string): value is RepeatMode {
  return REPEATS.includes(value as RepeatMode);
}

function parsePositiveInt(value: string): number | null {
  const numeric = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return numeric;
}

function isHHmm(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value.trim());
}

function normalizeHHmm(value: string): string {
  return value.trim();
}

function utcTimeHHmm(date = new Date()): string {
  return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
}

function utcDateKey(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function parseStartDateToIso(input: string): string | null {
  const trimmed = input.trim();
  const m = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;

  const year = Number.parseInt(m[1], 10);
  const month = Number.parseInt(m[2], 10);
  const day = Number.parseInt(m[3], 10);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;

  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  if (Number.isNaN(date.getTime())) return null;

  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    return null;
  }

  return date.toISOString();
}

function normalizeBookName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, ' ').trim();
}

function rowsToText(rows: BibleVerseRow[]): string {
  return rows.map((row) => `${row.bookName} ${row.chapter}:${row.verse} ${row.text}`).join('\n');
}

function toUtcDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000);
}

function getScriptureDayFromStart(startIso: string, now = new Date()): number {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return 1;

  const elapsed = Math.max(0, toUtcDayNumber(now) - toUtcDayNumber(start));
  return (elapsed % 366) + 1;
}

function parseTaskInput(payload: string): TaskInput | null {
  const parts = payload.split('|').map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  const dateTime = parts[0];
  const text = parts[1];
  const dt = dateTime.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})$/);
  if (!dt || !text) return null;

  const due = new Date(`${dt[1]}T${dt[2]}:00`);
  if (Number.isNaN(due.getTime())) return null;

  const layer = (parts[2] || '').toLowerCase();
  const priority = (parts[3] || '').toUpperCase();
  const repeat = (parts[4] || '').toLowerCase();

  const result: TaskInput = {
    text,
    dueAt: due.toISOString(),
  };

  if (layer && isLayerId(layer)) result.layerId = layer;
  if (priority && isPriority(priority)) result.priority = priority;
  if (repeat && isRepeat(repeat)) result.repeat = repeat;

  return result;
}

function parseEditPayload(payload: string): { index: number; updates: Partial<TaskInput> } | null {
  const match = payload.trim().match(/^(\d+)\s+([\s\S]+)$/);
  if (!match) return null;

  const index = Number.parseInt(match[1], 10);
  if (!Number.isFinite(index) || index <= 0) return null;

  const rest = match[2].trim();
  if (!rest) return null;

  const full = parseTaskInput(rest);
  if (full) {
    return { index, updates: full };
  }

  const dueOnly = rest.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})$/);
  if (dueOnly) {
    const due = new Date(`${dueOnly[1]}T${dueOnly[2]}:00`);
    if (Number.isNaN(due.getTime())) return null;
    return {
      index,
      updates: { dueAt: due.toISOString() },
    };
  }

  const textOnly = rest.replace(/^\|\s*/, '').trim();
  if (!textOnly) return null;

  return {
    index,
    updates: { text: textOnly },
  };
}

function parseReference(input: string): ParsedReference | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const verseMatch = trimmed.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/i);
  if (verseMatch) {
    const chapter = Number.parseInt(verseMatch[2], 10);
    const verseStart = Number.parseInt(verseMatch[3], 10);
    const verseEnd = verseMatch[4] ? Number.parseInt(verseMatch[4], 10) : verseStart;

    if (!Number.isFinite(chapter) || !Number.isFinite(verseStart) || !Number.isFinite(verseEnd)) {
      return null;
    }

    return {
      bookName: verseMatch[1].trim(),
      chapterStart: chapter,
      chapterEnd: chapter,
      verseStart: Math.min(verseStart, verseEnd),
      verseEnd: Math.max(verseStart, verseEnd),
    };
  }

  const chapterRangeMatch = trimmed.match(/^(.+?)\s+(\d+)-(\d+)$/i);
  if (chapterRangeMatch) {
    const start = Number.parseInt(chapterRangeMatch[2], 10);
    const end = Number.parseInt(chapterRangeMatch[3], 10);

    if (!Number.isFinite(start) || !Number.isFinite(end)) return null;

    return {
      bookName: chapterRangeMatch[1].trim(),
      chapterStart: Math.min(start, end),
      chapterEnd: Math.max(start, end),
    };
  }

  const chapterMatch = trimmed.match(/^(.+?)\s+(\d+)$/i);
  if (chapterMatch) {
    const chapter = Number.parseInt(chapterMatch[2], 10);
    if (!Number.isFinite(chapter)) return null;

    return {
      bookName: chapterMatch[1].trim(),
      chapterStart: chapter,
      chapterEnd: chapter,
    };
  }

  return null;
}

function advanceDueDate(iso: string, repeat: RepeatMode): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const stepDays = repeat === 'weekly' ? 7 : 1;
  let next = new Date(date.getTime());
  const now = new Date();

  do {
    next = new Date(next.getTime() + stepDays * 24 * 60 * 60 * 1000);
  } while (next.getTime() <= now.getTime());

  return next.toISOString();
}

function taskLine(task: TodoItem, index: number): string {
  const marker = task.done ? 'DONE' : 'TODO';
  return `${index + 1}. [${marker}] ${task.text} at ${formatDateTime(task.dueAt)} | ${task.layerId} | ${task.priority} | ${task.repeat}`;
}

function formatTodoList(todos: TodoItem[]): string {
  if (todos.length === 0) {
    return 'No tasks yet. Use /set YYYY-MM-DD HH:mm | task | layer | priority | repeat';
  }

  const sorted = [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const dueDiff = Date.parse(a.dueAt) - Date.parse(b.dueAt);
    if (dueDiff !== 0) return dueDiff;
    return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
  });

  return `Task list:\n${sorted.map((task, index) => taskLine(task, index)).join('\n')}`;
}

async function readStore(): Promise<BotStore> {
  try {
    const raw = await fs.readFile(storePath, 'utf8');
    const parsed = JSON.parse(raw) as BotStore;
    return {
      chats: parsed.chats || {},
      meta: parsed.meta || {},
    };
  } catch (error) {
    const maybeNodeError = error as NodeJS.ErrnoException;
    if (maybeNodeError.code === 'ENOENT') {
      return { chats: {}, meta: {} };
    }
    throw error;
  }
}

async function writeStore(store: BotStore): Promise<void> {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  const tempPath = `${storePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(store, null, 2), 'utf8');
  await fs.rename(tempPath, storePath);
}

async function mutateChat(chatId: string, mutate: (chat: ChatStore) => void): Promise<ChatStore> {
  const store = await readStore();
  const chat = store.chats[chatId] || { todos: [] };
  mutate(chat);
  store.chats[chatId] = chat;
  await writeStore(store);
  return chat;
}

async function processPendingUpdates(limit = 100): Promise<number> {
  const store = await readStore();
  let offset = store.meta?.updateOffset || 0;
  let processed = 0;

  for (let batch = 0; batch < 5; batch += 1) {
    const updates = await bot.telegram.getUpdates(0, limit, offset, ['message']);

    if (!updates.length) break;

    for (const update of updates) {
      await bot.handleUpdate(update);
      processed += 1;
      offset = Math.max(offset, update.update_id + 1);
    }
  }

  if (offset !== (store.meta?.updateOffset || 0)) {
    store.meta = store.meta || {};
    store.meta.updateOffset = offset;
    await writeStore(store);
  }

  return processed;
}

async function loadBiblePlan(): Promise<BiblePlan> {
  if (biblePlanCache) return biblePlanCache;

  const raw = await fs.readFile(biblePlanPath, 'utf8');
  biblePlanCache = JSON.parse(raw) as BiblePlan;
  return biblePlanCache;
}

async function loadBibleVerses(): Promise<BibleVerseRow[]> {
  if (bibleVerseCache) return bibleVerseCache;

  const raw = await fs.readFile(bibleDbPath, 'utf8');
  const parsed = JSON.parse(raw) as Array<Record<string, string>>;

  const rows = parsed
    .map((item) => {
      const bookName = String(item.__EMPTY || '').trim();
      const chapter = Number.parseInt(String(item.__EMPTY_2 || '').trim(), 10);
      const verse = Number.parseInt(String(item.__EMPTY_3 || '').trim(), 10);
      const text = String(item.__EMPTY_4 || '').trim();

      if (!bookName || !Number.isFinite(chapter) || !Number.isFinite(verse) || !text) {
        return null;
      }

      return { bookName, chapter, verse, text } as BibleVerseRow;
    })
    .filter((row): row is BibleVerseRow => Boolean(row));

  bibleVerseCache = rows;
  return rows;
}

async function findVersesByReference(reference: ParsedReference, limit = 30): Promise<BibleVerseRow[]> {
  const rows = await loadBibleVerses();
  const book = normalizeBookName(reference.bookName);

  const filtered = rows.filter((row) => {
    if (normalizeBookName(row.bookName) !== book) return false;
    if (row.chapter < reference.chapterStart || row.chapter > reference.chapterEnd) return false;
    if (reference.verseStart !== undefined && row.chapter === reference.chapterStart && row.verse < reference.verseStart) return false;
    if (reference.verseEnd !== undefined && row.chapter === reference.chapterEnd && row.verse > reference.verseEnd) return false;
    return true;
  });

  return filtered.slice(0, limit);
}

async function findVersesByKeyword(query: string, limit = 5): Promise<BibleVerseRow[]> {
  const rows = await loadBibleVerses();
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const matched = rows.filter((row) => row.text.toLowerCase().includes(needle));
  return matched.slice(0, limit);
}

function splitPassages(passages: string): string[] {
  const normalized = passages.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];

  const primary = normalized.split(';').map((s) => s.trim()).filter(Boolean);
  if (primary.length >= 2) return primary;

  const alt = normalized.split(/\s+\|\s+/).map((s) => s.trim()).filter(Boolean);
  if (alt.length >= 2) return alt;

  const andSplit = normalized.split(/\s+and\s+/i).map((s) => s.trim()).filter(Boolean);
  if (andSplit.length >= 2) return andSplit;

  return [normalized];
}

async function getScripturePartsForDay(day: number): Promise<{ day: number; part1: string; part2: string }> {
  if (day < 1 || day > 366) {
    return {
      day,
      part1: 'Please choose a day between 1 and 366.',
      part2: 'Please choose a day between 1 and 366.',
    };
  }

  try {
    const plan = await loadBiblePlan();
    const reading = plan.readings?.[String(day)];

    if (!reading?.passages) {
      return {
        day,
        part1: `No reading found for day ${day}.`,
        part2: `No reading found for day ${day}.`,
      };
    }

    const tokens = splitPassages(reading.passages);
    const first = tokens[0] || reading.passages.trim();
    const second = tokens[1] || first;

    return {
      day,
      part1: first,
      part2: second,
    };
  } catch {
    return {
      day,
      part1: 'I could not read Bible plan file. Check BIBLE_PLAN_PATH.',
      part2: 'I could not read Bible plan file. Check BIBLE_PLAN_PATH.',
    };
  }
}

function updateStreak(profile: ChatProfile, completionDate: string): void {
  const prevDate = profile.lastCompletionDate;

  if (!prevDate) {
    profile.streakCurrent = 1;
    profile.streakLongest = Math.max(1, profile.streakLongest || 0);
    profile.lastCompletionDate = completionDate;
    return;
  }

  if (prevDate === completionDate) return;

  const prev = new Date(`${prevDate}T00:00:00`);
  const curr = new Date(`${completionDate}T00:00:00`);
  const deltaDays = Math.round((curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000));

  if (deltaDays === 1) {
    profile.streakCurrent = (profile.streakCurrent || 0) + 1;
  } else {
    profile.streakCurrent = 1;
  }

  profile.streakLongest = Math.max(profile.streakLongest || 0, profile.streakCurrent || 0);
  profile.lastCompletionDate = completionDate;
}

async function processTaskReminders(): Promise<void> {
  const store = await readStore();
  const nowMs = Date.now();
  let dirty = false;

  for (const [chatId, chat] of Object.entries(store.chats)) {
    for (const task of chat.todos) {
      if (task.done) continue;

      const dueMs = Date.parse(task.dueAt);
      if (!Number.isFinite(dueMs)) continue;

      const reminderMoment = dueMs - reminderLeadMs;

      if (!task.reminderSentAt && nowMs >= reminderMoment && nowMs < dueMs) {
        try {
          await bot.telegram.sendMessage(
            chatId,
            `REMINDER: ${task.text}\nDue at ${formatDateTime(task.dueAt)} (in 5 minutes).`
          );
          task.reminderSentAt = nowIso();
          dirty = true;
        } catch (error) {
          console.warn('Reminder send failed:', error);
        }
      }

      if (!task.dueSentAt && nowMs >= dueMs) {
        try {
          await bot.telegram.sendMessage(
            chatId,
            `TASK DUE NOW: ${task.text}\nDue at ${formatDateTime(task.dueAt)}.`
          );
          task.dueSentAt = nowIso();
          dirty = true;
        } catch (error) {
          console.warn('Due send failed:', error);
        }
      }
    }
  }

  if (dirty) {
    await writeStore(store);
  }
}

async function processScriptureReminders(): Promise<void> {
  const store = await readStore();
  const now = new Date();
  const nowTime = utcTimeHHmm(now);
  const today = utcDateKey(now);
  let dirty = false;

  for (const [chatId, chat] of Object.entries(store.chats)) {
    chat.profile = chat.profile || {};
    const profile = chat.profile;

    if (!profile.scriptureStartDate) profile.scriptureStartDate = nowIso();
    if (!profile.scriptureFirstTime || !isHHmm(profile.scriptureFirstTime)) {
      profile.scriptureFirstTime = defaultScriptureFirstTime;
    }
    if (!profile.scriptureSecondTime || !isHHmm(profile.scriptureSecondTime)) {
      profile.scriptureSecondTime = defaultScriptureSecondTime;
    }

    const day = getScriptureDayFromStart(profile.scriptureStartDate, now);

    if (nowTime === profile.scriptureFirstTime && profile.scriptureLastSentDatePart1 !== today) {
      try {
        await bot.telegram.sendMessage(
          chatId,
          [
            'SCRIPTURE REMINDER',
            `It is time to read Part 1 for Day ${day}.`,
            'Use /scripture to view today\'s references.',
            `Timezone: ${timezoneLabel}`,
          ].join('\n')
        );
        profile.scriptureLastSentDatePart1 = today;
        dirty = true;
      } catch (error) {
        console.warn('Scripture part 1 send failed:', error);
      }
    }

    if (nowTime === profile.scriptureSecondTime && profile.scriptureLastSentDatePart2 !== today) {
      try {
        await bot.telegram.sendMessage(
          chatId,
          [
            'SCRIPTURE REMINDER',
            `It is time to read Part 2 for Day ${day}.`,
            'Use /scripture to view today\'s references.',
            `Timezone: ${timezoneLabel}`,
          ].join('\n')
        );
        profile.scriptureLastSentDatePart2 = today;
        dirty = true;
      } catch (error) {
        console.warn('Scripture part 2 send failed:', error);
      }
    }
  }

  if (dirty) {
    await writeStore(store);
  }
}

function taskDefaults(profile?: ChatProfile): { layerId: LayerId; priority: Priority; repeat: RepeatMode } {
  return {
    layerId: profile?.defaultLayerId || 'general',
    priority: profile?.defaultPriority || 'C',
    repeat: profile?.defaultRepeat || 'once',
  };
}

async function addTask(ctx: Context, payload: string): Promise<void> {
  const parsed = parseTaskInput(payload);
  if (!parsed) {
    await ctx.reply('Invalid task format. Usage: /set YYYY-MM-DD HH:mm | task | layer | priority | repeat');
    return;
  }

  const chatId = chatIdFrom(ctx);
  const created = nowIso();

  const chat = await mutateChat(chatId, (draft) => {
    draft.profile = draft.profile || {};
    const defaults = taskDefaults(draft.profile);

    draft.todos.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: parsed.text,
      dueAt: parsed.dueAt,
      layerId: parsed.layerId || defaults.layerId,
      priority: parsed.priority || defaults.priority,
      repeat: parsed.repeat || defaults.repeat,
      done: false,
      createdAt: created,
      updatedAt: created,
      completedCount: 0,
    });
  });

  await ctx.reply(`SUCCESS: Task saved for ${formatDateTime(parsed.dueAt)}.\n\n${formatTodoList(chat.todos)}`);
}

bot.use(async (ctx: Context, next) => {
  const text = messageTextFrom(ctx);
  const command = commandNameFromText(text);

  if (!command) {
    await next();
    return;
  }

  const chatId = chatIdFrom(ctx);
  await mutateChat(chatId, (chat) => {
    chat.profile = chat.profile || {};
    if (!chat.profile.scriptureStartDate) {
      chat.profile.scriptureStartDate = nowIso();
    }
    if (!chat.profile.scriptureFirstTime || !isHHmm(chat.profile.scriptureFirstTime)) {
      chat.profile.scriptureFirstTime = defaultScriptureFirstTime;
    }
    if (!chat.profile.scriptureSecondTime || !isHHmm(chat.profile.scriptureSecondTime)) {
      chat.profile.scriptureSecondTime = defaultScriptureSecondTime;
    }
    if (!chat.profile.defaultLayerId) chat.profile.defaultLayerId = 'general';
    if (!chat.profile.defaultPriority) chat.profile.defaultPriority = 'C';
    if (!chat.profile.defaultRepeat) chat.profile.defaultRepeat = 'once';
  });

  await next();
});

bot.start(async (ctx) => {
  await ctx.reply(
    [
      'SUCCESS: Standalone Telegram planner ready.',
      '',
      'Create task:',
      '/set 2026-04-17 18:30 | Pray and journal | spiritual | A | daily',
      '',
      'Track commands:',
      '/today',
      '/track',
      '/defaults general C once',
      '/list',
      '/done 1',
      '/edit 1 2026-04-18 07:00 | Updated text',
      '/remove 1',
      '/scripture',
      '/scripturetimes 06:30 20:30',
      '/scripturestart 2026-04-17',
      '/verse John 3:16',
    ].join('\n')
  );
});

bot.help(async (ctx) => {
  await ctx.reply(
    [
      'SUCCESS: Help menu',
      'Commands:',
      '/set YYYY-MM-DD HH:mm | task | layer | priority | repeat',
      '/add YYYY-MM-DD HH:mm | task | layer | priority | repeat',
      '/edit <index> YYYY-MM-DD HH:mm | task | layer | priority | repeat',
      '/edit <index> YYYY-MM-DD HH:mm',
      '/edit <index> | text',
      '/done <index>',
      '/remove <index>',
      '/delete <index>',
      '/list',
      '/today',
      '/track',
      '/defaults <layer> <priority> <repeat>',
      '/scripture or /scripture <day>',
      '/scripturetimes <HH:mm> <HH:mm>',
      '/scripturestart <YYYY-MM-DD>',
      '/verse <reference or keyword>',
      '/find <reference or keyword>',
      '',
      `Layers: ${LAYERS.join(', ')}`,
      `Priority: ${PRIORITIES.join(', ')}`,
      `Repeat: ${REPEATS.join(', ')}`,
      '',
      'Scripture behavior:',
      '- /scripture returns today\'s reference-only Part 1 and Part 2.',
      '- /scripturetimes sets two daily reminder notifications.',
      '- reminders prompt you to read and use /scripture.',
    ].join('\n')
  );
});

bot.command('set', async (ctx) => {
  await addTask(ctx, removeCommandPrefix(messageTextFrom(ctx), 'set'));
});

bot.command('add', async (ctx) => {
  await addTask(ctx, removeCommandPrefix(messageTextFrom(ctx), 'add'));
});

bot.command('edit', async (ctx) => {
  const payload = removeCommandPrefix(messageTextFrom(ctx), 'edit');
  const parsed = parseEditPayload(payload);
  if (!parsed) {
    await ctx.reply('Invalid edit format. Usage: /edit <index> YYYY-MM-DD HH:mm | text | layer | priority | repeat');
    return;
  }

  const chatId = chatIdFrom(ctx);
  let reply = '';

  const chat = await mutateChat(chatId, (draft) => {
    const task = draft.todos[parsed.index - 1];
    if (!task) {
      reply = `Task ${parsed.index} does not exist.`;
      return;
    }

    if (parsed.updates.text) task.text = parsed.updates.text;
    if (parsed.updates.dueAt) {
      task.dueAt = parsed.updates.dueAt;
      task.reminderSentAt = undefined;
      task.dueSentAt = undefined;
      task.done = false;
    }
    if (parsed.updates.layerId) task.layerId = parsed.updates.layerId;
    if (parsed.updates.priority) task.priority = parsed.updates.priority;
    if (parsed.updates.repeat) task.repeat = parsed.updates.repeat;

    task.updatedAt = nowIso();
    reply = `Updated task ${parsed.index}.`;
  });

  await ctx.reply(`${reply.startsWith('Updated') ? `SUCCESS: ${reply}` : reply}\n\n${formatTodoList(chat.todos)}`);
});

bot.command('list', async (ctx) => {
  const store = await readStore();
  const chat = store.chats[chatIdFrom(ctx)] || { todos: [] };
  await ctx.reply(`SUCCESS: Retrieved task list.\n\n${formatTodoList(chat.todos)}`);
});

bot.command('today', async (ctx) => {
  const store = await readStore();
  const chat = store.chats[chatIdFrom(ctx)] || { todos: [] };
  const key = todayKey();
  const now = Date.now();

  const todays = chat.todos.filter((t) => !t.done && formatDateTime(t.dueAt).startsWith(key));
  const overdue = chat.todos.filter((t) => !t.done && Date.parse(t.dueAt) < now);
  const byPriority = [...todays].sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
  const top = byPriority.slice(0, 5);

  const profile = chat.profile || {};
  const streak = profile.streakCurrent || 0;

  await ctx.reply(
    [
      `SUCCESS: Today summary`,
      `TODAY (${key})`,
      `Open today: ${todays.length}`,
      `Overdue: ${overdue.length}`,
      `Current streak: ${streak}`,
      '',
      top.length > 0 ? top.map((task, i) => taskLine(task, i)).join('\n') : 'No open tasks for today.',
    ].join('\n')
  );
});

bot.command('track', async (ctx) => {
  const store = await readStore();
  const chat = store.chats[chatIdFrom(ctx)] || { todos: [] };
  const total = chat.todos.length;
  const done = chat.todos.filter((t) => t.done).length;
  const open = total - done;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
  const profile = chat.profile || {};

  const layerCount = new Map<LayerId, number>();
  for (const layer of LAYERS) layerCount.set(layer, 0);
  for (const task of chat.todos) {
    layerCount.set(task.layerId, (layerCount.get(task.layerId) || 0) + 1);
  }

  await ctx.reply(
    [
      'SUCCESS: Track dashboard',
      'TRACK DASHBOARD',
      `Total: ${total}`,
      `Done: ${done}`,
      `Open: ${open}`,
      `Completion rate: ${completionRate}%`,
      `Current streak: ${profile.streakCurrent || 0}`,
      `Longest streak: ${profile.streakLongest || 0}`,
      '',
      'Layer balance:',
      ...LAYERS.map((layer) => `- ${layer}: ${layerCount.get(layer) || 0}`),
    ].join('\n')
  );
});

bot.command('defaults', async (ctx) => {
  const payload = removeCommandPrefix(messageTextFrom(ctx), 'defaults').trim();
  const parts = payload.split(/\s+/).filter(Boolean);
  if (parts.length < 3) {
    await ctx.reply('Invalid defaults format. Usage: /defaults <layer> <priority> <repeat>');
    return;
  }

  const layer = parts[0].toLowerCase();
  const priority = parts[1].toUpperCase();
  const repeat = parts[2].toLowerCase();

  if (!isLayerId(layer) || !isPriority(priority) || !isRepeat(repeat)) {
    await ctx.reply(`Invalid defaults. Use layer(${LAYERS.join(', ')}), priority(${PRIORITIES.join(', ')}), repeat(${REPEATS.join(', ')}).`);
    return;
  }

  await mutateChat(chatIdFrom(ctx), (chat) => {
    chat.profile = chat.profile || {};
    chat.profile.defaultLayerId = layer;
    chat.profile.defaultPriority = priority;
    chat.profile.defaultRepeat = repeat;
  });

  await ctx.reply(`SUCCESS: Defaults saved: ${layer}, ${priority}, ${repeat}.`);
});

bot.command('done', async (ctx) => {
  const arg = removeCommandPrefix(messageTextFrom(ctx), 'done');
  const index = parsePositiveInt(arg);
  if (!index) {
    await ctx.reply('Invalid done format. Usage: /done <task index>');
    return;
  }

  const chatId = chatIdFrom(ctx);
  let reply = '';

  const chat = await mutateChat(chatId, (draft) => {
    const task = draft.todos[index - 1];
    if (!task) {
      reply = `Task ${index} does not exist.`;
      return;
    }

    draft.profile = draft.profile || {};
    updateStreak(draft.profile, todayKey());

    if (task.repeat === 'once') {
      task.done = true;
      task.updatedAt = nowIso();
      task.completedCount = (task.completedCount || 0) + 1;
      reply = `Completed task ${index}.`;
      return;
    }

    task.completedCount = (task.completedCount || 0) + 1;
    task.done = false;
    task.dueAt = advanceDueDate(task.dueAt, task.repeat);
    task.updatedAt = nowIso();
    task.reminderSentAt = undefined;
    task.dueSentAt = undefined;
    reply = `Completed and rolled forward task ${index} (${task.repeat}) to ${formatDateTime(task.dueAt)}.`;
  });

  await ctx.reply(`${reply.startsWith('Completed') ? `SUCCESS: ${reply}` : reply}\n\n${formatTodoList(chat.todos)}`);
});

async function removeTask(ctx: Context, index: number, usageLabel: string): Promise<void> {
  if (!index) {
    await ctx.reply(`Invalid remove format. Usage: ${usageLabel} <task index>`);
    return;
  }

  const chatId = chatIdFrom(ctx);
  let reply = '';

  const chat = await mutateChat(chatId, (draft) => {
    if (!draft.todos[index - 1]) {
      reply = `Task ${index} does not exist.`;
      return;
    }

    const [removed] = draft.todos.splice(index - 1, 1);
    reply = `Removed: ${removed.text}`;
  });

  await ctx.reply(`${reply.startsWith('Removed') ? `SUCCESS: ${reply}` : reply}\n\n${formatTodoList(chat.todos)}`);
}

bot.command('delete', async (ctx) => {
  await removeTask(ctx, parsePositiveInt(removeCommandPrefix(messageTextFrom(ctx), 'delete')) || 0, '/delete');
});

bot.command('remove', async (ctx) => {
  await removeTask(ctx, parsePositiveInt(removeCommandPrefix(messageTextFrom(ctx), 'remove')) || 0, '/remove');
});

bot.command('scripture', async (ctx) => {
  const arg = removeCommandPrefix(messageTextFrom(ctx), 'scripture');
  const explicitDay = parsePositiveInt(arg);

  let day = explicitDay || 1;
  if (!explicitDay) {
    const store = await readStore();
    const chat = store.chats[chatIdFrom(ctx)] || { todos: [] };
    const startDate = chat.profile?.scriptureStartDate || nowIso();
    day = getScriptureDayFromStart(startDate);
  }

  const parts = await getScripturePartsForDay(day);
  await ctx.reply(
    [
      'SUCCESS: Scripture retrieved',
      `SCRIPTURE DAY ${parts.day}`,
      `Part 1: ${parts.part1}`,
      `Part 2: ${parts.part2}`,
      `Timezone: ${timezoneLabel}`,
    ].join('\n')
  );
});

bot.command('scripturetimes', async (ctx) => {
  const payload = removeCommandPrefix(messageTextFrom(ctx), 'scripturetimes').trim();
  const parts = payload.split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    await ctx.reply('Invalid scripturetimes format. Usage: /scripturetimes <HH:mm> <HH:mm>. Example: /scripturetimes 06:30 20:30');
    return;
  }

  const first = normalizeHHmm(parts[0]);
  const second = normalizeHHmm(parts[1]);

  if (!isHHmm(first) || !isHHmm(second)) {
    await ctx.reply('Invalid time format. Use 24-hour HH:mm, for example 06:30 20:30');
    return;
  }

  await mutateChat(chatIdFrom(ctx), (chat) => {
    chat.profile = chat.profile || {};
    chat.profile.scriptureFirstTime = first;
    chat.profile.scriptureSecondTime = second;
  });

  await ctx.reply(
    [
      'SUCCESS: Scripture schedule saved.',
      'These times send reminder notifications only.',
      `Part 1 time: ${first}`,
      `Part 2 time: ${second}`,
      'Use /scripture anytime to view today\'s references.',
      `Timezone: ${timezoneLabel}`,
    ].join('\n')
  );
});

bot.command('scripturestart', async (ctx) => {
  const payload = removeCommandPrefix(messageTextFrom(ctx), 'scripturestart').trim();
  if (!payload) {
    await ctx.reply('Invalid scripturestart format. Usage: /scripturestart <YYYY-MM-DD>. Example: /scripturestart 2026-04-17');
    return;
  }

  const startIso = parseStartDateToIso(payload);
  if (!startIso) {
    await ctx.reply('Invalid date format. Use YYYY-MM-DD, for example /scripturestart 2026-04-17');
    return;
  }

  await mutateChat(chatIdFrom(ctx), (chat) => {
    chat.profile = chat.profile || {};
    chat.profile.scriptureStartDate = startIso;
    chat.profile.scriptureLastSentDatePart1 = undefined;
    chat.profile.scriptureLastSentDatePart2 = undefined;
  });

  const day = getScriptureDayFromStart(startIso, new Date());
  const parts = await getScripturePartsForDay(day);
  await ctx.reply(
    [
      `SUCCESS: Scripture start date saved: ${payload}`,
      `Current journey day: ${parts.day}`,
      `Part 1: ${parts.part1}`,
      `Part 2: ${parts.part2}`,
      `Timezone: ${timezoneLabel}`,
    ].join('\n')
  );
});

bot.on('text', async (ctx) => {
  const text = messageTextFrom(ctx);
  const known = new Set([
    'start',
    'help',
    'set',
    'add',
    'edit',
    'done',
    'remove',
    'delete',
    'list',
    'today',
    'track',
    'defaults',
    'scripture',
    'scripturetimes',
    'scripturestart',
    'verse',
    'find',
  ]);

  if (text.startsWith('/')) {
    const command = commandNameFromText(text);
    if (!command || !known.has(command)) {
      await ctx.reply('Unknown command. Type /help to see all commands.');
      return;
    }
    return;
  }

  await ctx.reply('I did not understand that. Type /help to see commands.');
});

bot.command('verse', async (ctx) => {
  const query = removeCommandPrefix(messageTextFrom(ctx), 'verse');
  if (!query) {
    await ctx.reply('Usage: /verse <reference or keyword>. Example: /verse John 3:16 or /verse faith');
    return;
  }

  try {
    const parsedRef = parseReference(query);
    const rows = parsedRef ? await findVersesByReference(parsedRef, 8) : await findVersesByKeyword(query, 5);

    if (rows.length === 0) {
      await ctx.reply(`No verses found for "${query}".`);
      return;
    }

    await ctx.reply(`Verse search results\n${rowsToText(rows)}`);
  } catch {
    await ctx.reply('Unable to search Bible database now. Check BIBLE_DB_PATH.');
  }
});

bot.command('find', async (ctx) => {
  const query = removeCommandPrefix(messageTextFrom(ctx), 'find');
  if (!query) {
    await ctx.reply('Usage: /find <reference or keyword>');
    return;
  }

  const parsedRef = parseReference(query);
  const rows = parsedRef ? await findVersesByReference(parsedRef, 8) : await findVersesByKeyword(query, 5);

  if (rows.length === 0) {
    await ctx.reply(`No verses found for "${query}".`);
    return;
  }

  await ctx.reply(`Verse search results\n${rowsToText(rows)}`);
});

bot.catch((error) => {
  console.error('[telegram-standalone] Unhandled bot error:', error);
});

async function start(): Promise<void> {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await loadBiblePlan();
  await loadBibleVerses();

  if (runMode === 'once') {
    const processed = await processPendingUpdates();
    await processTaskReminders();
    await processScriptureReminders();
    console.log(`[telegram-standalone] One-shot run complete. Updates processed: ${processed}`);
    return;
  }

  await bot.launch();

  const webServer = createServer((req, res) => {
    const url = req.url || '/';
    if (url === '/healthz' || url === '/api/health') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, service: 'edenify-telegram-standalone' }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('edenify-telegram-standalone is running');
  });

  webServer.listen(port, () => {
    console.log(`[telegram-standalone] Health endpoint listening on :${port}`);
  });

  setInterval(() => {
    void processTaskReminders();
    void processScriptureReminders();
  }, reminderIntervalMs);

  console.log('[telegram-standalone] Bot started.');
  console.log(`[telegram-standalone] Store file: ${storePath}`);
  console.log(`[telegram-standalone] Bible plan file: ${biblePlanPath}`);
  console.log(`[telegram-standalone] Bible database file: ${bibleDbPath}`);
  console.log(`[telegram-standalone] Reminder interval ms: ${reminderIntervalMs}`);
  console.log(`[telegram-standalone] Run mode: ${runMode}`);
}

void start();

process.once('SIGINT', () => {
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
});
