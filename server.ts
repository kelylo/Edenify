import dotenv from 'dotenv';
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(process.cwd(), '.env.server.local') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

type RepeatMode = 'once' | 'daily' | 'weekly';
type LayerId = 'spiritual' | 'academic' | 'financial' | 'physical' | 'general';
type Priority = 'A' | 'B' | 'C' | 'D' | 'E';

interface TaskItem {
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

interface DbShape {
  users: Array<{ id: string; email: string; name: string; password?: string; role?: 'admin' | 'user'; avatar?: string; preferences?: any }>;
  data: Record<string, any>;
  sessions?: Record<string, { userId: string; createdAt: string }>;
  reminders?: Record<string, string>;
}

const layerOptions: LayerId[] = ['spiritual', 'academic', 'financial', 'physical', 'general'];
const repeatOptions: RepeatMode[] = ['once', 'daily', 'weekly'];
const priorityOptions: Priority[] = ['A', 'B', 'C', 'D', 'E'];

const defaultUserPreferences = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  focusSound: 'Rain Forest',
  focusAlarmSound: '',
  bibleReminderTime: '06:30 AM',
  bibleReminderAlarm: true,
  revisionDefaultsApplied: false,
  customFocusSongName: '',
  customFocusSongDataUrl: '',
  customFocusPlaylistNames: [],
  customFocusPlaylistDataUrls: [],
  shuffleFocusPlaylist: false,
  googleCalendarEnabled: false,
  lastAlarmSongName: '',
  lastAlarmSongDataUrl: '',
  mostRepeatedTasks: [],
  notifications: {
    taskReminders: true,
    dailyScripture: true,
    streakProtection: false,
  },
};

function normalizeUserKey(value?: string) {
  return String(value || '').trim().toLowerCase();
}

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

function resolveSessionUserId(db: DbShape, cookieHeader?: string) {
  const cookies = parseCookies(cookieHeader);
  const sessionId = cookies.edenify_session;
  if (!sessionId) return '';
  const session = db.sessions?.[sessionId];
  return normalizeUserKey(session?.userId || '');
}

function readDb(dbPath: string): DbShape {
  const raw = fs.readFileSync(dbPath, 'utf-8');
  const db = JSON.parse(raw) as DbShape;
  db.reminders = db.reminders || {};
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

function buildSessionCookie(req: express.Request, sessionId: string) {
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').toLowerCase();
  const isSecure = req.secure || forwardedProto.includes('https');
  const parts = [
    `edenify_session=${encodeURIComponent(sessionId)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${60 * 60 * 24 * 30}`,
  ];
  if (isSecure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

const geminiModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
const openAiModels = ['gpt-4o-mini', 'gpt-4.1-mini'];

function hasGeminiKeys() {
  return getGeminiKeyOrder().length > 0;
}

function hasOpenAIKeys() {
  return getOpenAIKeyOrder().length > 0;
}

function getGeminiKeyOrder() {
  const keys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
  ]
    .map((key) => String(key || '').trim())
    .filter((key): key is string => Boolean(key));

  if (keys.length <= 1) return keys;
  return Math.random() < 0.5 ? [keys[1], keys[0]] : keys;
}

function getOpenAIKeyOrder() {
  const keys = [
    process.env.OPENAI_API_KEY_1,
    process.env.OPENAI_API_KEY_2,
    process.env.OPENAI_API_KEY,
  ]
    .map((key) => String(key || '').trim())
    .filter((key): key is string => Boolean(key));

  if (keys.length <= 1) return keys;
  return Math.random() < 0.5 ? [keys[1], keys[0], ...keys.slice(2)] : keys;
}

function normalizePromptText(value: any): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map((item) => normalizePromptText(item)).filter(Boolean).join('\n');
  }
  if (value && typeof value === 'object') {
    if (typeof value.text === 'string') return value.text;
    if (typeof value.content === 'string') return value.content;
    if (Array.isArray(value.parts)) {
      return value.parts.map((part: any) => normalizePromptText(part?.text ?? part)).filter(Boolean).join('\n');
    }
  }
  return String(value ?? '');
}

function buildOpenAIMessages(prompt: { contents: any; systemInstruction?: string }) {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

  if (prompt.systemInstruction) {
    messages.push({ role: 'system', content: prompt.systemInstruction });
  }

  const entries = Array.isArray(prompt.contents)
    ? prompt.contents
    : [{ role: 'user', parts: [{ text: normalizePromptText(prompt.contents) }] }];

  for (const entry of entries) {
    const role = entry?.role === 'model' ? 'assistant' : 'user';
    const content = normalizePromptText(entry?.parts ?? entry?.content ?? entry?.text ?? entry);
    if (content.trim().length > 0) {
      messages.push({ role, content });
    }
  }

  return messages;
}

async function generateWithOpenAI(prompt: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
}) {
  const keys = getOpenAIKeyOrder();
  if (keys.length === 0) return null;

  const messages = buildOpenAIMessages(prompt);
  let lastError: unknown;

  for (const model of openAiModels) {
    for (const key of keys) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.4,
            ...(prompt.responseMimeType === 'application/json' ? { response_format: { type: 'json_object' } } : {}),
          }),
        });

        const json = await response.json().catch(() => null);
        if (!response.ok) {
          lastError = json?.error?.message || `OpenAI HTTP ${response.status}`;
          continue;
        }

        const text = String(json?.choices?.[0]?.message?.content || '').trim();
        if (text) {
          return text;
        }
      } catch (error) {
        lastError = error;
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}

async function generateWithGeminiOnly(prompt: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  tools?: any[];
}) {
  const keys = getGeminiKeyOrder();
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
        const text = response.text || '';
        if (text.trim().length > 0) {
          return text;
        }
      } catch (error) {
        lastError = error;
      }
    }
  }

  if (lastError) throw lastError;
  return null;
}

async function generateCollaborativeEdenText(prompt: {
  contents: any;
  systemInstruction?: string;
}) {
  const canGemini = hasGeminiKeys();
  const canOpenAI = hasOpenAIKeys();

  if (!canGemini && !canOpenAI) {
    throw new Error('No AI provider is configured on the server.');
  }

  if (canGemini && canOpenAI) {
    const [geminiDraft, openAiDraft] = await Promise.all([
      generateWithGeminiOnly({
        contents: prompt.contents,
        systemInstruction: prompt.systemInstruction,
      }).catch(() => null),
      generateWithOpenAI({
        contents: prompt.contents,
        systemInstruction: prompt.systemInstruction,
      }).catch(() => null),
    ]);

    if (geminiDraft && openAiDraft) {
      const fused = await generateWithGeminiOnly({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Fuse these two drafts into one concise final response for Eden user chat. Keep practical next steps and spiritual tone where relevant.\n\nGemini draft:\n${geminiDraft}\n\nOpenAI draft:\n${openAiDraft}`,
              },
            ],
          },
        ],
        systemInstruction:
          'You are an editor combining two assistant drafts. Output one final response only, concise and practical.',
      }).catch(() => null);

      if (fused) return fused;
      return openAiDraft;
    }

    if (openAiDraft) return openAiDraft;
    if (geminiDraft) return geminiDraft;
  }

  if (canGemini) {
    return await generateWithGeminiOnly({
      contents: prompt.contents,
      systemInstruction: prompt.systemInstruction,
    });
  }

  return await generateWithOpenAI({
    contents: prompt.contents,
    systemInstruction: prompt.systemInstruction,
  });
}

async function generateSpeechWithOpenAI(input: string, voice = 'alloy') {
  const text = String(input || '').trim();
  if (!text) return null;

  const keys = getOpenAIKeyOrder();
  if (keys.length === 0) {
    throw new Error('No OpenAI API key is configured for TTS.');
  }

  const ttsModels = ['gpt-4o-mini-tts', 'tts-1-hd', 'tts-1'];
  let lastError: unknown;

  for (const model of ttsModels) {
    for (const key of keys) {
      try {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            input: text,
            voice,
            response_format: 'mp3',
          }),
        });

        if (!response.ok) {
          const errorJson = await response.json().catch(() => null);
          lastError = errorJson?.error?.message || `OpenAI TTS HTTP ${response.status}`;
          continue;
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length > 0) {
          return {
            audioBase64: buffer.toString('base64'),
            mimeType: 'audio/mpeg',
            model,
            voice,
          };
        }
      } catch (error) {
        lastError = error;
      }
    }
  }

  if (lastError) throw lastError;
  return null;
}

async function generateWithServerGemini(prompt: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  tools?: any[];
}) {
  const keys = getGeminiKeyOrder();
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
        const text = response.text || '';
        if (text.trim().length > 0) {
          return text;
        }
      } catch (error) {
        lastError = error;
      }
    }
  }

  const openAiText = await generateWithOpenAI({
    contents: prompt.contents,
    systemInstruction: prompt.systemInstruction,
    responseMimeType: prompt.responseMimeType,
  }).catch((error) => {
    lastError = error;
    return null;
  });

  if (openAiText) {
    return openAiText;
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error('No AI provider is configured on the server.');
}

function parseJsonSafely<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  return JSON.parse(cleaned) as T;
}

function normalizeTask(task: Partial<TaskItem>): TaskItem {
  const baseDate = new Date(task.date || Date.now());
  const safeDate = Number.isNaN(baseDate.getTime()) ? new Date().toISOString() : baseDate.toISOString();
  const rawTime = String(task.time || '08:00').trim();

  return {
    id: String(task.id || `task-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`),
    name: String(task.name || 'Untitled task'),
    layerId: layerOptions.includes(task.layerId as LayerId) ? (task.layerId as LayerId) : 'general',
    priority: priorityOptions.includes(task.priority as Priority) ? (task.priority as Priority) : 'C',
    repeat: repeatOptions.includes(task.repeat as RepeatMode) ? (task.repeat as RepeatMode) : 'once',
    time: rawTime,
    completed: Boolean(task.completed),
    date: safeDate,
    alarmEnabled: task.alarmEnabled !== false,
    preferredMusic: String(task.preferredMusic || ''),
    estimatedDuration: Number.isFinite(Number(task.estimatedDuration)) ? Number(task.estimatedDuration) : undefined,
    durationStartedAt: task.durationStartedAt,
  };
}

function parseTaskDueDate(task: TaskItem) {
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

function toCalendarDateTime(task: TaskItem, timezone: string) {
  const due = parseTaskDueDate(task);
  if (!due) return null;

  const start = due;
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  return {
    start: {
      dateTime: start.toISOString(),
      timeZone: timezone || 'UTC',
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: timezone || 'UTC',
    },
  };
}

function buildTaskRecurrence(task: TaskItem) {
  if (task.repeat === 'daily') {
    return ['RRULE:FREQ=DAILY'];
  }

  if (task.repeat === 'weekly') {
    const baseDate = new Date(task.date || new Date().toISOString());
    const weekdayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const byDay = weekdayMap[baseDate.getDay()] || weekdayMap[new Date().getDay()];
    return [`RRULE:FREQ=WEEKLY;BYDAY=${byDay}`];
  }

  return undefined;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 6001);
  const serverBootedAt = new Date().toISOString();

  app.use(express.json({ limit: '25mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'edenify-server',
      bootedAt: serverBootedAt,
      now: new Date().toISOString(),
    });
  });

  // Simple file-based DB
  const DB_PATH = path.join(process.cwd(), 'db.json');
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], data: {}, sessions: {}, reminders: {} }));
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

      const text = await generateCollaborativeEdenText({
        contents,
        systemInstruction: `You are Eden, a spiritual and personal growth companion.\nYour purpose is to provide personalized insights, suggestions, and motivation based on the user's goals and progress across different life layers: Spiritual, Academic, Financial, Physical, and General.\nYour tone is meditative, disciplined, encouraging, and wise.\nApp knowledge:\n${appKnowledge.join('\n')}\nExecution policy:\n- Handle simple requests directly without over-explaining.\n- Reserve deep analysis for complex requests only.\n- Prefer concrete actions, short plans, and next-step clarity.\n- If data is missing, make a useful assumption and continue.\n- If the user asks to create/edit/complete/delete tasks, provide concise structured intent that a task action layer can execute.\n- For communication/social-skill questions, provide practical scripts and drills, not generic motivation.\nKeep responses concise and editorial in feel.`,
      });

      res.json({ success: true, text: text || 'Tell me your goal and I will give you one practical next step.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Could not generate chat response.' });
    }
  });

  app.post('/api/eden/read-aloud', async (req, res) => {
    try {
      const text = String(req.body?.text || '').trim();
      const voice = String(req.body?.voice || 'alloy').trim() || 'alloy';

      if (!text) {
        res.status(400).json({ success: false, error: 'text is required.' });
        return;
      }

      if (text.length > 5000) {
        res.status(400).json({ success: false, error: 'Read-aloud text is too long. Please read a shorter passage.' });
        return;
      }

      const audio = await generateSpeechWithOpenAI(text, voice);
      if (!audio) {
        res.status(500).json({ success: false, error: 'Could not synthesize audio.' });
        return;
      }

      res.json({
        success: true,
        audioBase64: audio.audioBase64,
        mimeType: audio.mimeType,
        model: audio.model,
        voice: audio.voice,
        providerFlow: 'openai-tts',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Could not synthesize read-aloud audio.' });
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
      res.setHeader('Set-Cookie', buildSessionCookie(req, sessionId));
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
    res.setHeader('Set-Cookie', buildSessionCookie(req, sessionId));
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
    res.setHeader('Set-Cookie', buildSessionCookie(req, sessionId));
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
    const userId = normalizeUserKey(req.params.userId);
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
    const userId = normalizeUserKey(req.params.userId);
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

  app.get('/api/user/reminder-check', async (req, res) => {
    try {
      const db = readDb(DB_PATH);
      const sessionUserId = resolveSessionUserId(db, req.headers.cookie);
      if (!sessionUserId) {
        res.status(401).json({ shouldNotify: false, error: 'Not authenticated' });
        return;
      }

      const userData = db.data?.[sessionUserId] || {};
      const prefs = {
        ...defaultUserPreferences,
        ...(userData?.preferences || {}),
        ...(userData?.user?.preferences || {}),
        notifications: {
          ...defaultUserPreferences.notifications,
          ...(userData?.preferences?.notifications || {}),
          ...(userData?.user?.preferences?.notifications || {}),
        },
      };

      db.reminders = db.reminders || {};

      const now = new Date();
      const nowMs = now.getTime();
      const tasks = Array.isArray(userData.tasks) ? userData.tasks.map((task: any) => normalizeTask(task)) : [];

      for (const task of tasks) {
        if (task.completed || task.alarmEnabled === false) continue;
        const due = parseTaskDueDate(task);
        if (!due) continue;

        const dueStamp = due.toISOString().slice(0, 16);
        const alarmKey = `${sessionUserId}|sw|${task.id}|${dueStamp}|alarm`;

        if (!db.reminders[alarmKey] && nowMs >= due.getTime() - 60_000 && nowMs <= due.getTime() + 75_000) {
          // Pre-lock reminder key before returning to avoid duplicate notifications if client ack fails.
          db.reminders[alarmKey] = new Date().toISOString();
          writeDb(DB_PATH, db);
          res.json({
            shouldNotify: true,
            reminder: {
              key: alarmKey,
              title: 'Task due now',
              body: `${task.name} is due now (${task.time}).`,
              tag: `task-alarm-${task.id}`,
              taskId: task.id,
            },
          });
          return;
        }

      }

      // Bible reminders are delivered strictly through the scheduled Bible task.
      // No additional fallback/default scripture reminder is emitted here.

      res.json({ shouldNotify: false });
    } catch (error) {
      console.error('[API] Reminder check failed:', error);
      res.status(500).json({ shouldNotify: false, error: 'Server error' });
    }
  });

  app.post('/api/user/reminder-sent', (req, res) => {
    try {
      const db = readDb(DB_PATH);
      const sessionUserId = resolveSessionUserId(db, req.headers.cookie);
      if (!sessionUserId) {
        res.status(401).json({ success: false });
        return;
      }

      const key = String(req.body?.key || '').trim();
      if (!key.startsWith(`${sessionUserId}|sw|`)) {
        res.status(400).json({ success: false, error: 'Invalid reminder key.' });
        return;
      }

      db.reminders = db.reminders || {};
      db.reminders[key] = new Date().toISOString();
      writeDb(DB_PATH, db);

      res.json({ success: true });
    } catch (error) {
      console.error('[API] Reminder sent marker failed:', error);
      res.status(500).json({ success: false });
    }
  });

  app.get('/api/user/bible-reminder-check', async (req, res) => {
    res.redirect(307, '/api/user/reminder-check');
  });

  app.post('/api/google-calendar/upsert-task-event', async (req, res) => {
    try {
      const accessToken = String(req.body?.accessToken || '').trim();
      const timezone = String(req.body?.timezone || 'UTC').trim() || 'UTC';
      const userEmail = String(req.body?.userEmail || '').trim().toLowerCase();
      const task = req.body?.task;

      if (!accessToken) {
        res.status(400).json({ success: false, error: 'accessToken is required.' });
        return;
      }

      if (!task?.id || !task?.name || !task?.time) {
        res.status(400).json({ success: false, error: 'task.id, task.name, and task.time are required.' });
        return;
      }

      const dateTime = toCalendarDateTime(task, timezone);
      if (!dateTime) {
        res.status(400).json({ success: false, error: 'Task time is invalid for Calendar sync.' });
        return;
      }

      const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
      const queryUrl = `${baseUrl}?privateExtendedProperty=${encodeURIComponent(`edenifyTaskId=${task.id}`)}&maxResults=1&singleEvents=false`;

      const queryResponse = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!queryResponse.ok) {
        const errorBody = await queryResponse.json().catch(() => null);
        res.status(queryResponse.status).json({ success: false, error: errorBody?.error?.message || 'Google Calendar query failed.' });
        return;
      }

      const queryJson = await queryResponse.json().catch(() => ({} as any));
      const existing = Array.isArray(queryJson?.items) ? queryJson.items[0] : null;

      const payload: any = {
        summary: task.name,
        description: `Created by Edenify\nUser: ${userEmail || 'unknown'}\nLayer: ${task.layerId || 'general'}\nPriority: ${task.priority || 'C'}\nRepeat: ${task.repeat || 'once'}`,
        ...dateTime,
        recurrence: buildTaskRecurrence(task),
        extendedProperties: {
          private: {
            edenifyTaskId: task.id,
            edenifyUserEmail: userEmail,
          },
        },
      };

      if (!payload.recurrence) {
        delete payload.recurrence;
      }

      const method = existing?.id ? 'PATCH' : 'POST';
      const writeUrl = existing?.id ? `${baseUrl}/${existing.id}` : baseUrl;

      const writeResponse = await fetch(writeUrl, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const writeJson = await writeResponse.json().catch(() => null);
      if (!writeResponse.ok) {
        res.status(writeResponse.status).json({ success: false, error: writeJson?.error?.message || 'Google Calendar write failed.' });
        return;
      }

      res.json({ success: true, eventId: writeJson?.id || null });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Could not sync task to Google Calendar.' });
    }
  });

  app.post('/api/google-calendar/delete-task-event', async (req, res) => {
    try {
      const accessToken = String(req.body?.accessToken || '').trim();
      const taskId = String(req.body?.taskId || '').trim();

      if (!accessToken || !taskId) {
        res.status(400).json({ success: false, error: 'accessToken and taskId are required.' });
        return;
      }

      const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
      const queryUrl = `${baseUrl}?privateExtendedProperty=${encodeURIComponent(`edenifyTaskId=${taskId}`)}&maxResults=20&singleEvents=false`;

      const queryResponse = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!queryResponse.ok) {
        const errorBody = await queryResponse.json().catch(() => null);
        res.status(queryResponse.status).json({ success: false, error: errorBody?.error?.message || 'Google Calendar query failed.' });
        return;
      }

      const queryJson = await queryResponse.json().catch(() => ({} as any));
      const existingItems = Array.isArray(queryJson?.items) ? queryJson.items : [];

      await Promise.all(
        existingItems
          .filter((item: any) => item?.id)
          .map((item: any) =>
            fetch(`${baseUrl}/${item.id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
          )
      );

      res.json({ success: true, deleted: existingItems.length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Could not delete task event from Google Calendar.' });
    }
  });

  app.post('/api/user/bible-reminder-sent', (req, res) => {
    res.redirect(307, '/api/user/reminder-sent');
  });

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
