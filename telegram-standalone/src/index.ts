import dotenv from 'dotenv';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Telegraf } from 'telegraf';
import type { Context } from 'telegraf';

dotenv.config();

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  todos: TodoItem[];
}

interface BotStore {
  chats: Record<string, ChatStore>;
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

const SCRIPTURE_EMOJI = '📖';
const TASK_EMOJI = '📝';
const DONE_EMOJI = '✅';

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

const bot = new Telegraf(botToken);

let biblePlanCache: BiblePlan | null = null;
let bibleVerseCache: BibleVerseRow[] | null = null;

function nowIso(): string {
  return new Date().toISOString();
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

function getDayOfYear(date = new Date()): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const current = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const diff = current.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function parsePositiveInt(value: string): number | null {
  const numeric = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return numeric;
}

function parseIndexAndText(payload: string): { index: number; text: string } | null {
  const match = payload.trim().match(/^(\d+)\s+([\s\S]+)$/);
  if (!match) return null;

  const index = Number.parseInt(match[1], 10);
  if (!Number.isFinite(index) || index <= 0) return null;

  return {
    index,
    text: match[2].trim(),
  };
}

function normalizeBookName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, ' ').trim();
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

function rowsToText(rows: BibleVerseRow[]): string {
  return rows.map((row) => `${row.bookName} ${row.chapter}:${row.verse} ${row.text}`).join('\n');
}

async function readStore(): Promise<BotStore> {
  try {
    const raw = await fs.readFile(storePath, 'utf8');
    const parsed = JSON.parse(raw) as BotStore;
    return {
      chats: parsed.chats || {},
    };
  } catch (error) {
    const maybeNodeError = error as NodeJS.ErrnoException;
    if (maybeNodeError.code === 'ENOENT') {
      return { chats: {} };
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

function formatTodoList(todos: TodoItem[]): string {
  if (todos.length === 0) {
    return `${TASK_EMOJI} Your todo list is empty. Use /set or /add to create a task.`;
  }

  const lines = todos.map((task, index) => {
    const marker = task.done ? DONE_EMOJI : '⬜';
    return `${index + 1}. ${marker} ${task.text}`;
  });

  return `${TASK_EMOJI} Your tasks:\n${lines.join('\n')}`;
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

async function getScriptureForDay(day: number): Promise<string> {
  if (day < 1 || day > 366) {
    return `${SCRIPTURE_EMOJI} Please choose a day between 1 and 366.`;
  }

  try {
    const plan = await loadBiblePlan();
    const reading = plan.readings?.[String(day)];

    if (!reading?.passages) {
      return `${SCRIPTURE_EMOJI} No reading found for day ${day}.`;
    }

    const tokens = reading.passages
      .split(';')
      .map((token) => token.trim())
      .filter(Boolean)
      .slice(0, 3);

    const extracted: BibleVerseRow[] = [];
    for (const token of tokens) {
      const parsed = parseReference(token);
      if (!parsed) continue;
      const rows = await findVersesByReference(parsed, 10);
      extracted.push(...rows);
      if (extracted.length >= 20) break;
    }

    const sample = extracted.slice(0, 8);
    if (sample.length === 0) {
      return `${SCRIPTURE_EMOJI} Daily Scripture (Day ${day})\nPlan: ${reading.passages}`;
    }

    return [
      `${SCRIPTURE_EMOJI} Daily Scripture (Day ${day})`,
      `Plan: ${reading.passages}`,
      '',
      rowsToText(sample),
    ].join('\n');
  } catch {
    return `${SCRIPTURE_EMOJI} I could not read Bible plan/database files. Check BIBLE_PLAN_PATH and BIBLE_DB_PATH.`;
  }
}

async function addTask(ctx: Context, text: string): Promise<void> {
  if (!text) {
    await ctx.reply('Usage: /set <task description>');
    return;
  }

  const chatId = chatIdFrom(ctx);
  const created = nowIso();

  const chat = await mutateChat(chatId, (draft) => {
    draft.todos.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      done: false,
      createdAt: created,
      updatedAt: created,
    });
  });

  await ctx.reply(`${DONE_EMOJI} Task saved.\n\n${formatTodoList(chat.todos)}`);
}

bot.start(async (ctx) => {
  await ctx.reply(
    [
      'Welcome to your standalone Edenify Telegram backend bot.',
      'This bot is independent from the PWA and runs on its own service.',
      '',
      'Commands:',
      '/set Buy groceries',
      '/list',
      '/edit 1 Buy healthy groceries',
      '/done 1',
      '/remove 1',
      '/scripture',
      '/scripture 93',
      '/verse John 3:16',
      '/verse faith',
      '/help',
    ].join('\n')
  );
});

bot.help(async (ctx) => {
  await ctx.reply(
    [
      'Available commands:',
      '/set <task> - Set/add todo item',
      '/add <task> - Add todo item',
      '/edit <number> <new text> - Edit task text',
      '/list - Show all tasks',
      '/done <number> - Mark task complete',
      '/remove <number> - Remove task',
      '/delete <number> - Remove task',
      '/scripture - Show today\'s reading',
      '/scripture <day> - Show specific day in plan',
      '/verse <reference|keywords> - Search Bible database',
      '/find <reference|keywords> - Alias of /verse',
    ].join('\n')
  );
});

bot.command('set', async (ctx) => {
  const text = removeCommandPrefix(messageTextFrom(ctx), 'set');
  await addTask(ctx, text);
});

bot.command('add', async (ctx) => {
  const text = removeCommandPrefix(messageTextFrom(ctx), 'add');
  await addTask(ctx, text);
});

bot.command('edit', async (ctx) => {
  const payload = removeCommandPrefix(messageTextFrom(ctx), 'edit');
  const parsed = parseIndexAndText(payload);
  if (!parsed) {
    await ctx.reply('Usage: /edit <task number> <new text>');
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
    task.text = parsed.text;
    task.updatedAt = nowIso();
    reply = `${DONE_EMOJI} Updated task ${parsed.index}.`;
  });

  await ctx.reply(`${reply}\n\n${formatTodoList(chat.todos)}`);
});

bot.command('list', async (ctx) => {
  const store = await readStore();
  const chat = store.chats[chatIdFrom(ctx)] || { todos: [] };
  await ctx.reply(formatTodoList(chat.todos));
});

bot.command('done', async (ctx) => {
  const arg = removeCommandPrefix(messageTextFrom(ctx), 'done');
  const index = parsePositiveInt(arg);
  if (!index) {
    await ctx.reply('Usage: /done <task number>');
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
    task.done = true;
    task.updatedAt = nowIso();
    reply = `${DONE_EMOJI} Marked task ${index} as done.`;
  });

  await ctx.reply(`${reply}\n\n${formatTodoList(chat.todos)}`);
});

bot.command('delete', async (ctx) => {
  const arg = removeCommandPrefix(messageTextFrom(ctx), 'delete');
  const index = parsePositiveInt(arg);
  if (!index) {
    await ctx.reply('Usage: /delete <task number>');
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
    reply = `${DONE_EMOJI} Deleted: ${removed.text}`;
  });

  await ctx.reply(`${reply}\n\n${formatTodoList(chat.todos)}`);
});

bot.command('remove', async (ctx) => {
  const arg = removeCommandPrefix(messageTextFrom(ctx), 'remove');
  const index = parsePositiveInt(arg);
  if (!index) {
    await ctx.reply('Usage: /remove <task number>');
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
    reply = `${DONE_EMOJI} Removed: ${removed.text}`;
  });

  await ctx.reply(`${reply}\n\n${formatTodoList(chat.todos)}`);
});

bot.command('scripture', async (ctx) => {
  const arg = removeCommandPrefix(messageTextFrom(ctx), 'scripture');
  const providedDay = parsePositiveInt(arg);
  const day = providedDay || getDayOfYear();
  const scripture = await getScriptureForDay(day);
  await ctx.reply(`${scripture}\n\nTimezone: ${timezoneLabel}`);
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
      await ctx.reply(`${SCRIPTURE_EMOJI} No verses found for "${query}".`);
      return;
    }

    await ctx.reply(`${SCRIPTURE_EMOJI} Search Results\n${rowsToText(rows)}`);
  } catch {
    await ctx.reply(`${SCRIPTURE_EMOJI} Unable to search Bible database now. Check BIBLE_DB_PATH.`);
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
    await ctx.reply(`${SCRIPTURE_EMOJI} No verses found for "${query}".`);
    return;
  }

  await ctx.reply(`${SCRIPTURE_EMOJI} Search Results\n${rowsToText(rows)}`);
});

bot.hears(/^(scripture|daily scripture|verse)$/i, async (ctx) => {
  const scripture = await getScriptureForDay(getDayOfYear());
  await ctx.reply(`${scripture}\n\nTimezone: ${timezoneLabel}`);
});

bot.catch((error) => {
  console.error('[telegram-standalone] Unhandled bot error:', error);
});

async function start(): Promise<void> {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await loadBiblePlan();
  await loadBibleVerses();
  await bot.launch();

  console.log('[telegram-standalone] Bot started.');
  console.log(`[telegram-standalone] Store file: ${storePath}`);
  console.log(`[telegram-standalone] Bible plan file: ${biblePlanPath}`);
  console.log(`[telegram-standalone] Bible database file: ${bibleDbPath}`);
}

void start();

process.once('SIGINT', () => {
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
});
