import {
  chatWithEden,
  initializeEdenAgent,
  getAgentProfile,
  getRecentAgentConversations,
  getDailyBibleReading,
  getEdenInsight,
  suggestTaskWithGemini,
} from './gemini';

export type UserProfile = {
  preferredName?: string;
  lastActiveLayer?: 'spiritual' | 'academic' | 'financial' | 'physical' | 'general';
  responseStyle?: 'concise' | 'detailed' | 'motivational' | 'practical';
  lastInteractionAt?: string;
  favoritePatterns?: string[];
  ignoredTopics?: string[];
};

type ConversationEntry = {
  id: string;
  timestamp: string;
  userMessage: string;
  edenResponse: string;
  wasHelpful?: boolean;
  userEngaged?: boolean;
};

const memoryKey = 'eden.agent.extra.memory.v1';
const conversationKey = 'eden.agent.extra.conversations.v1';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota/private mode constraints.
  }
}

export async function remember(key: string, value: unknown) {
  const memory = readJson<Record<string, unknown>>(memoryKey, {});
  memory[key] = value;
  writeJson(memoryKey, memory);
}

export async function recall<T = unknown>(key: string): Promise<T | undefined> {
  const memory = readJson<Record<string, unknown>>(memoryKey, {});
  return memory[key] as T | undefined;
}

export async function updateProfile(updates: Partial<UserProfile>) {
  const current = await getProfile();
  const next = { ...current, ...updates };
  await remember('profile', next);
  return next;
}

export async function getProfile(): Promise<UserProfile> {
  const profileFromGemini = await getAgentProfile();
  const profileFromMemory = (await recall<UserProfile>('profile')) || {};
  return {
    ...(profileFromGemini || {}),
    ...(profileFromMemory || {}),
  };
}

export async function logConversation(entry: Omit<ConversationEntry, 'id' | 'timestamp'>) {
  const list = readJson<ConversationEntry[]>(conversationKey, []);
  list.push({
    id: `conv-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
  writeJson(conversationKey, list.slice(-120));
}

export async function getRecentConversations(limit = 10) {
  const fromGemini = await getRecentAgentConversations(limit);
  const local = readJson<ConversationEntry[]>(conversationKey, []).slice(-limit);
  return [...fromGemini, ...local].slice(-limit);
}

export async function recordFeedback(_conversationId: string, helpful: boolean, engaged: boolean) {
  const stats = (await recall<{ helpful: number; unhelpful: number; engaged: number }>('feedback')) || {
    helpful: 0,
    unhelpful: 0,
    engaged: 0,
  };
  if (helpful) stats.helpful += 1;
  else stats.unhelpful += 1;
  if (engaged) stats.engaged += 1;
  await remember('feedback', stats);
}

export {
  chatWithEden,
  initializeEdenAgent,
  getDailyBibleReading,
  getEdenInsight,
  suggestTaskWithGemini,
};
