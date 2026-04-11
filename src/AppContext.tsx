import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, Layer, Habit, Task, JournalEntry, LayerId, BibleReading } from './types';
import { INITIAL_USER, INITIAL_LAYERS, INITIAL_HABITS, INITIAL_TASKS, INITIAL_BIBLE_READING } from './constants';
import { getBibleReadingForDay } from './services/bible';
import { loadBackendUserState, loadUserState, saveBackendUserState, saveUserState } from './services/supabase';

interface AppState {
  user: User | null;
  authReady: boolean;
  layers: Layer[];
  habits: Habit[];
  tasks: Task[];
  journal: JournalEntry[];
  bibleReading: BibleReading;
  dailyTaskGoal: number;
  stats: {
    overallProgress: number;
    longestStreak: number;
    taskCompletionRate: number;
  };
  setUser: (user: User | null) => void;
  updateLayer: (layerId: LayerId, updates: Partial<Layer>) => void;
  addHabit: (habit: Habit) => void;
  toggleHabit: (habitId: string) => void;
  addTask: (task: Task) => void;
  toggleTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  completeBibleDay: () => Promise<void>;
  refreshBibleReading: () => Promise<void>;
  goToBibleDay: (day: number) => Promise<void>;
  setDailyTaskGoal: (goal: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);
const RESET_VERSION = 'edenify-reset-2026-04-10';
const MAX_PERSISTED_DATA_URL_LENGTH = 450_000;

const sanitizeTaskForPersistence = (task: Task): Task => {
  const audio = task.customAlarmAudioDataUrl || '';
  if (audio.length <= MAX_PERSISTED_DATA_URL_LENGTH) return task;

  return {
    ...task,
    customAlarmAudioDataUrl: undefined,
    customAlarmAudioName: undefined,
  };
};

const sanitizeUserForPersistence = (baseUser: User | null): User | null => {
  if (!baseUser) return null;

  const nextPreferences = {
    ...baseUser.preferences,
  };

  if ((nextPreferences.customFocusSongDataUrl || '').length > MAX_PERSISTED_DATA_URL_LENGTH) {
    nextPreferences.customFocusSongDataUrl = '';
    nextPreferences.customFocusSongName = '';
  }

  if (Array.isArray(nextPreferences.customFocusPlaylistDataUrls)) {
    const safePairs = nextPreferences.customFocusPlaylistDataUrls
      .map((url, index) => ({
        url,
        name: nextPreferences.customFocusPlaylistNames?.[index] || `Track ${index + 1}`,
      }))
      .filter((entry) => (entry.url || '').length <= MAX_PERSISTED_DATA_URL_LENGTH);

    nextPreferences.customFocusPlaylistDataUrls = safePairs.map((entry) => entry.url);
    nextPreferences.customFocusPlaylistNames = safePairs.map((entry) => entry.name);
  }

  return {
    ...baseUser,
    preferences: nextPreferences,
  };
};

const normalizeUser = (user: User): User => ({
  ...INITIAL_USER,
  ...user,
  preferences: {
    ...INITIAL_USER.preferences,
    ...(user.preferences || {}),
    notifications: {
      ...INITIAL_USER.preferences.notifications,
      ...(user.preferences?.notifications || {}),
    },
  },
});

const normalizeBibleReading = (reading?: Partial<BibleReading> | null): BibleReading => {
  const safeDay = Math.min(400, Math.max(1, Number(reading?.day || INITIAL_BIBLE_READING.day)));
  const safeCompleted = Math.min(400, Math.max(0, Number(reading?.highestCompletedDay || INITIAL_BIBLE_READING.highestCompletedDay || 0)));
  return {
    ...INITIAL_BIBLE_READING,
    ...(reading || {}),
    day: safeDay,
    highestCompletedDay: Math.max(safeCompleted, safeDay - (reading?.completed ? 0 : 1)),
    totalDays: 400,
    completed: safeDay <= Math.max(safeCompleted, safeDay - (reading?.completed ? 0 : 1)),
  };
};

const ensureTaskId = (task: Task): Task => {
  if (task.id && task.id.trim()) return task;
  const seed = `${task.name || 'task'}|${task.layerId || 'general'}|${task.time || '00:00'}|${task.date || ''}`;
  const compact = seed.replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 64).toLowerCase();
  return { ...task, id: `task-${compact || Date.now().toString()}` };
};

const mergeTasksByIdentity = (currentTasks: Task[], incomingTasks: Task[], recentlyDeletedIds: Set<string>) => {
  const merged = new Map<string, Task>();

  currentTasks.forEach((rawTask) => {
    const task = ensureTaskId(rawTask);
    if (recentlyDeletedIds.has(task.id)) return; // Skip recently deleted
    const key = task.id || `${task.name}|${task.layerId}|${task.time}`;
    merged.set(key, task);
  });

  incomingTasks.forEach((rawTask) => {
    const task = ensureTaskId(rawTask);
    if (recentlyDeletedIds.has(task.id)) return; // Don't re-add recently deleted from cloud
    const key = task.id || `${task.name}|${task.layerId}|${task.time}`;
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, task);
    } else {
      // Smart merge: keep local state as source of truth
      const merged_task = { ...task, ...existing };

      // Preserve local completion status if it's more recent
      if (existing.completed && !task.completed) {
        merged_task.completed = true;
      }

      merged.set(key, merged_task);
    }
  });

  return Array.from(merged.values());
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getAccountKey = (currentUser: User | null) => String(currentUser?.id || currentUser?.email || '').trim().toLowerCase();

  // Cache management for session persistence
  const cacheUser = (user: User | null) => {
    if (!user) {
      localStorage.removeItem('edenify_cached_user');
      return;
    }
    try {
      localStorage.setItem('edenify_cached_user', JSON.stringify(user));
    } catch (error) {
      console.warn('Failed to cache user session:', error);
    }
  };

  const getCachedUser = (): User | null => {
    try {
      const cached = localStorage.getItem('edenify_cached_user');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to restore cached user:', error);
      localStorage.removeItem('edenify_cached_user');
      return null;
    }
  };

  const [user, setUserState] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [layers, setLayers] = useState<Layer[]>(INITIAL_LAYERS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [bibleReading, setBibleReading] = useState<BibleReading>(INITIAL_BIBLE_READING);
  const [dailyTaskGoal, setDailyTaskGoalState] = useState<number>(9);
  const applyingTelegramSyncRef = useRef(false);
  const lastTelegramTasksHashRef = useRef('');
  const hasCompletedInitialCloudSyncRef = useRef(false);
  const applyingCloudStateRef = useRef(false);
  const lastCloudStateHashRef = useRef('');
  const recentlyDeletedTaskIdsRef = useRef<Set<string>>(new Set());
  const deletionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Wrapper for setUser that also caches on localStorage (supports both value and function updates)
  const setUser = (nextUser: User | null | ((prev: User | null) => User | null)) => {
    if (typeof nextUser === 'function') {
      setUserState((prev) => {
        const result = nextUser(prev);
        cacheUser(result);
        return result;
      });
    } else {
      setUserState(nextUser);
      cacheUser(nextUser);
    }
  };

  // Load from localStorage on init
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        // Step 1: Try to restore from cached user first (enables offline session persistence)
        const cachedUser = getCachedUser();
        if (cachedUser) {
          setUserState(normalizeUser(cachedUser));
        }

        // Step 2: Check server session to validate/update cached user
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();
        if (sessionResponse.ok && sessionData?.success && sessionData?.user) {
          setUserState(normalizeUser(sessionData.user));
          cacheUser(normalizeUser(sessionData.user));
        } else if (!cachedUser) {
          // Only clear user if there's no cache to fall back on
          setUserState(null);
        }

        const resetMarker = localStorage.getItem('edenify_reset_version');
        if (resetMarker !== RESET_VERSION) {
          localStorage.setItem('edenify_reset_version', RESET_VERSION);
        }

        const saved = localStorage.getItem('edenify_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.layers) setLayers(parsed.layers);
          if (parsed.habits) setHabits(parsed.habits);
          if (parsed.tasks) setTasks(parsed.tasks);
          if (parsed.journal) setJournal(parsed.journal);
          if (parsed.bibleReading) setBibleReading(normalizeBibleReading(parsed.bibleReading));
          if (parsed.dailyTaskGoal) setDailyTaskGoalState(parsed.dailyTaskGoal);
        }
      } catch (error) {
        console.warn('Session restore failed:', error);
        // If offline or error, still try cached user as fallback
        const cachedUser = getCachedUser();
        if (cachedUser && !cancelled) {
          setUserState(normalizeUser(cachedUser));
        }
      } finally {
        if (!cancelled) {
          setAuthReady(true);
        }
      }
    };

    restore();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load cloud state from Supabase when user is available, then keep it synced.
  useEffect(() => {
    const accountKey = getAccountKey(user);
    if (!accountKey) {
      hasCompletedInitialCloudSyncRef.current = false;
      lastCloudStateHashRef.current = '';
      return;
    }

    let cancelled = false;

    const applyRemoteState = (remoteState: any) => {
      const remoteHash = JSON.stringify(remoteState || {});
      if (remoteHash === lastCloudStateHashRef.current) return;

      applyingCloudStateRef.current = true;

      if (remoteState.user) {
        setUser((prev) => {
          if (!prev) return normalizeUser(remoteState.user);
          return normalizeUser({ ...prev, ...remoteState.user });
        });
      }
      if (remoteState.layers) setLayers(remoteState.layers);
      if (remoteState.habits) setHabits(remoteState.habits);
      if (remoteState.tasks) {
        setTasks((prev) => mergeTasksByIdentity(prev, remoteState.tasks, recentlyDeletedTaskIdsRef.current));
      }
      if (remoteState.journal) setJournal(remoteState.journal);
      if (remoteState.bibleReading) setBibleReading(normalizeBibleReading(remoteState.bibleReading));
      if (remoteState.dailyTaskGoal) setDailyTaskGoalState(remoteState.dailyTaskGoal);

      lastCloudStateHashRef.current = remoteHash;
      window.setTimeout(() => {
        applyingCloudStateRef.current = false;
      }, 0);
    };

    const pullFromCloud = async () => {
      let remoteState = await loadUserState(accountKey);
      if (!remoteState) {
        remoteState = await loadBackendUserState(accountKey);
      }
      if (!remoteState || cancelled) return;
      applyRemoteState(remoteState);
    };

    const bootstrap = async () => {
      try {
        await pullFromCloud();
      } finally {
        if (!cancelled) {
          hasCompletedInitialCloudSyncRef.current = true;
        }
      }
    };

    bootstrap();
    const intervalId = window.setInterval(() => {
      void pullFromCloud();
    }, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [user?.email, user?.id]);

  // Save to localStorage on change
  useEffect(() => {
    const sanitizedUser = sanitizeUserForPersistence(user);
    const sanitizedTasks = tasks.map(sanitizeTaskForPersistence);
    const statePayload = {
      user: sanitizedUser,
      layers,
      habits,
      tasks: sanitizedTasks,
      journal,
      bibleReading,
      dailyTaskGoal,
    };

    try {
      // Keep browser cache without persisted user identity.
      localStorage.setItem('edenify_state', JSON.stringify({ ...statePayload, user: null }));
    } catch (error) {
      console.warn('Local cache save skipped (likely storage quota reached):', error);
    }

    const accountKey = getAccountKey(user);
    if (accountKey) {
      const syncState = async () => {
        if (!hasCompletedInitialCloudSyncRef.current) return;
        if (applyingCloudStateRef.current) return;

        const supabaseSaved = await saveUserState(accountKey, statePayload);
        if (!supabaseSaved) {
          const backendSaved = await saveBackendUserState(accountKey, statePayload);
          if (backendSaved) {
            lastCloudStateHashRef.current = JSON.stringify(statePayload);
          }
          return;
        }

        lastCloudStateHashRef.current = JSON.stringify(statePayload);
      };

      syncState();
    }
  }, [user, layers, habits, tasks, journal, bibleReading, dailyTaskGoal]);

  useEffect(() => {
    const chatId = user?.preferences.telegramChatId?.trim();
    if (!chatId) return;

    const pullTasks = async () => {
      try {
        const response = await fetch(`/api/telegram/tasks/${encodeURIComponent(chatId)}`);
        const data = await response.json();
        if (!response.ok || !data?.success || !Array.isArray(data.tasks)) return;

        const nextHash = JSON.stringify(data.tasks);
        if (nextHash === lastTelegramTasksHashRef.current) return;

        applyingTelegramSyncRef.current = true;
        setTasks((prev) => mergeTasksByIdentity(prev, data.tasks, recentlyDeletedTaskIdsRef.current));
        lastTelegramTasksHashRef.current = nextHash;
      } catch (error) {
        console.warn('Telegram task pull failed:', error);
      }
    };

    pullTasks();
    const id = window.setInterval(pullTasks, 10000);
    return () => window.clearInterval(id);
  }, [user?.preferences.telegramChatId]);

  useEffect(() => {
    const chatId = user?.preferences.telegramChatId?.trim();
    if (!chatId) return;

    if (applyingTelegramSyncRef.current) {
      applyingTelegramSyncRef.current = false;
      return;
    }

    const pushTasks = async () => {
      try {
        const payloadHash = JSON.stringify(tasks);
        if (payloadHash === lastTelegramTasksHashRef.current) return;

        // Local app state is authoritative on edits/toggles/deletes to prevent task resurrection.
        const mergedTasks = tasks;
        const mergedHash = payloadHash;

        await fetch(`/api/telegram/tasks/${encodeURIComponent(chatId)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: getAccountKey(user),
            tasks: mergedTasks,
          }),
        });

        await fetch('/api/telegram/link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId,
            userId: getAccountKey(user),
          }),
        });

        lastTelegramTasksHashRef.current = mergedHash;
      } catch (error) {
        console.warn('Telegram task push failed:', error);
      }
    };

    pushTasks();
  }, [tasks, user?.email, user?.id, user?.preferences.telegramChatId]);

  useEffect(() => {
    const applyTaskCompletionWindow = () => {
      const now = new Date();
      const todayString = now.toDateString();
      const nowWeekday = now.getDay();
      const nowMs = now.getTime();

      setTasks((prev) => prev.map((task) => {
        if (!task.completed) return task;

        const taskDate = new Date(task.date || now.toISOString());
        if (Number.isNaN(taskDate.getTime())) return task;

        // Habit-linked loop tasks reset with the new day at midnight.
        const isHabitTask = String(task.id || '').startsWith('habit-task-');
        if (isHabitTask) {
          if (taskDate.toDateString() !== todayString) {
            return { ...task, completed: false };
          }
          return task;
        }

        if (task.repeat === 'daily' && taskDate.toDateString() !== todayString) {
          return { ...task, completed: false };
        }

        if (task.repeat === 'weekly') {
          const taskDay = taskDate.getDay();
          const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          const startTask = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate()).getTime();
          const diffDays = Math.floor((startToday - startTask) / (24 * 60 * 60 * 1000));
          if (taskDay === nowWeekday && diffDays >= 7) {
            return { ...task, completed: false };
          }
        }

        return task;
      }));
    };

    applyTaskCompletionWindow();
    const id = window.setInterval(applyTaskCompletionWindow, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const updateLayer = (layerId: LayerId, updates: Partial<Layer>) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, ...updates } : l));
  };

  const addHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  };

  const toggleHabit = (habitId: string) => {
    let linkedTaskId: string | undefined;
    let nextCompleted = false;

    setHabits(prev => prev.map((habit) => {
      if (habit.id !== habitId) return habit;

      nextCompleted = !habit.completedToday;
      linkedTaskId = habit.linkedTaskId;

      if (!nextCompleted) {
        return {
          ...habit,
          completedToday: false,
          streak: Math.max(0, habit.streak - 1),
        };
      }

      const now = new Date();
      const last = habit.lastCompletedAt ? new Date(habit.lastCompletedAt) : null;
      const validLast = last && !Number.isNaN(last.getTime()) ? last : null;

      let nextStreak = 1;
      if (validLast) {
        const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startLast = new Date(validLast.getFullYear(), validLast.getMonth(), validLast.getDate()).getTime();
        const diffDays = Math.floor((startToday - startLast) / (24 * 60 * 60 * 1000));

        if (habit.frequency === 'weekly') {
          const sameWeekday = now.getDay() === validLast.getDay();
          nextStreak = sameWeekday && diffDays >= 7 && diffDays <= 13 ? habit.streak + 1 : 1;
        } else {
          nextStreak = diffDays === 1 ? habit.streak + 1 : 1;
        }
      }

      return {
        ...habit,
        completedToday: true,
        streak: nextStreak,
        lastCompletedAt: now.toISOString(),
        history: [...habit.history.slice(-13), true],
      };
    }));

    if (linkedTaskId) {
      setTasks((prev) => prev.map((task) => {
        if (task.id !== linkedTaskId) return task;
        if (!nextCompleted) {
          return { ...task, completed: false };
        }

        if (task.repeat === 'daily' || task.repeat === 'weekly') {
          return { ...task, completed: true, date: new Date().toISOString() };
        }

        return { ...task, completed: true };
      }));
    }
  };

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map((t) => {
      if (t.id !== taskId) return t;
      const nextCompleted = !t.completed;
      if (nextCompleted && (t.repeat === 'daily' || t.repeat === 'weekly')) {
        return { ...t, completed: true, date: new Date().toISOString() };
      }
      return { ...t, completed: nextCompleted };
    }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => task.id === taskId ? { ...task, ...updates } : task));
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    // Track this deletion to prevent re-adding during merge for next 60 seconds
    recentlyDeletedTaskIdsRef.current.add(taskId);
    if (deletionTimeoutRef.current) clearTimeout(deletionTimeoutRef.current);
    deletionTimeoutRef.current = setTimeout(() => {
      recentlyDeletedTaskIdsRef.current.clear();
    }, 60000);
  };

  const addJournalEntry = (entry: JournalEntry) => {
    setJournal(prev => [entry, ...prev]);
  };

  const loadBibleDay = async (targetDay: number, highestCompletedDay: number) => {
    const day = Math.min(400, Math.max(1, targetDay));
    const data = await getBibleReadingForDay(day);
    setBibleReading({
      day,
      totalDays: 400,
      highestCompletedDay,
      passage: data.passage,
      text: data.text,
      completed: day <= highestCompletedDay,
    });
  };

  const refreshBibleReading = async () => {
    const data = await getBibleReadingForDay(bibleReading.day);
    setBibleReading(prev => ({
      ...prev,
      passage: data.passage,
      text: data.text,
      completed: prev.day <= prev.highestCompletedDay,
    }));
  };

  const goToBibleDay = async (targetDay: number) => {
    const maxUnlockedDay = Math.min(400, bibleReading.highestCompletedDay + 2);
    const bounded = Math.min(maxUnlockedDay, Math.max(1, targetDay));
    await loadBibleDay(bounded, bibleReading.highestCompletedDay);
  };

  const completeBibleDay = async () => {
    // Mark today as completed - do NOT move to next day
    // Next day progression happens automatically on the next calendar day
    const nextHighest = Math.max(bibleReading.highestCompletedDay, bibleReading.day);
    setBibleReading(prev => ({
      ...prev,
      highestCompletedDay: nextHighest,
      completed: true,
    }));
  };

  const setDailyTaskGoal = (goal: number) => {
    setDailyTaskGoalState(Math.max(1, Math.min(20, goal)));
  };

  const stats = {
    overallProgress: layers.reduce((acc, l) => acc + (l.xp / l.maxXp), 0) / layers.length * 100,
    longestStreak: Math.max(...habits.map(h => h.streak), 0),
    taskCompletionRate: tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0,
  };

  return (
    <AppContext.Provider value={{
      user, authReady, layers, habits, tasks, journal, bibleReading, stats, dailyTaskGoal,
      setUser, updateLayer, addHabit, toggleHabit, addTask, toggleTask, updateTask, deleteTask, addJournalEntry, completeBibleDay, refreshBibleReading, goToBibleDay, setDailyTaskGoal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
