import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../AppContext';
import { format } from 'date-fns';
import { ArrowLeft, ArrowRight, BellRing, CheckCircle2, Circle, Loader2, Maximize2, Minimize2, Pause, Play, Plus, RefreshCw, SkipForward, Timer, Trash2, WandSparkles, X } from 'lucide-react';
import { cn, getDailyTaskStats, getProgress, isTaskCompletedForToday, isTaskScheduledForToday, parseTaskDueDate, requestMediaPermission, isTaskFailedByDuration } from '../lib/utils';
import { getEdenInsight, suggestTaskWithGemini } from '../services/gemini';
import { BibleVerse, getChapter, getSuggestedVerse, searchVerses } from '../services/bible';
import { sendCrossChannelNotification, areNotificationsEnabled, registerBibleReminderSync } from '../services/notifications';
import { playTaskAlarm, playBibleReminderAlarm, stopAlarm as stopPlaybackAlarm } from '../services/alarm-playback';
import { analyzeMostRepeatedTasks } from '../services/taskAnalytics';
import { EDEN_TEMPLATE_COUNT, EdenTemplate, getEdenTypingSuggestions, getRecommendedEdenTemplates } from '../services/taskTemplates';
import { LayerId, Task } from '../types';
import { AnimatePresence, motion } from 'motion/react';
import Focus from './Focus';
import { BibleReadingUI } from './BibleReadingUI';

const DEFAULT_REVISION_TASK_ID = 'default-academic-revision-task';
const ACADEMIC_TIMETABLE: Record<number, string[]> = {
  0: [],
  1: ['Resistance des materiaux', 'Hydraulique appliquee', 'Beton arme'],
  2: ['Geotechnique', 'Topographie', 'Mecanique des sols'],
  3: ['Construction metallique', 'DAO', 'Organisation des chantiers'],
  4: ['Routes et ouvrages', 'Assainissement', 'Securite industrielle'],
  5: ['Anglais technique', 'Methodologie de projet', 'Projet tutorat'],
  6: [],
};
const getRoundedCurrentTime = () => {
  const now = new Date();
  const roundedMinutes = Math.ceil(now.getMinutes() / 5) * 5;
  const next = new Date(now);
  next.setSeconds(0, 0);
  if (roundedMinutes >= 60) {
    next.setHours(now.getHours() + 1, 0, 0, 0);
  } else {
    next.setMinutes(roundedMinutes, 0, 0);
  }
  return `${String(next.getHours()).padStart(2, '0')}:${String(next.getMinutes()).padStart(2, '0')}`;
};

const pad2 = (value: number) => String(value).padStart(2, '0');

const parseTimeToEditor = (time24: string) => {
  const match = String(time24 || '').trim().match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) {
    return {
      hour24: '08',
      minute: '00',
      hour12: '08',
      period: 'AM' as 'AM' | 'PM',
    };
  }

  const hour24 = Number(match[1]);
  const minute = Number(match[2]);
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return {
    hour24: pad2(hour24),
    minute: pad2(minute),
    hour12: pad2(hour12),
    period: period as 'AM' | 'PM',
  };
};

const buildTimeFromEditor = (
  format: '12' | '24',
  hourInput: string,
  minuteInput: string,
  period: 'AM' | 'PM'
) => {
  const hour = Number(hourInput);
  const minute = Number(minuteInput);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (minute < 0 || minute > 59) return null;

  if (format === '24') {
    if (hour < 0 || hour > 23) return null;
    return `${pad2(hour)}:${pad2(minute)}`;
  }

  if (hour < 1 || hour > 12) return null;
  let hours24 = hour % 12;
  if (period === 'PM') hours24 += 12;
  return `${pad2(hours24)}:${pad2(minute)}`;
};

const parseAnyTimeTo24 = (value: string) => {
  const normalized = String(value || '').toUpperCase().replace(/\s+/g, ' ').trim();
  const match12 = normalized.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  const match24 = normalized.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);

  if (match12) {
    let hours = Number(match12[1]);
    const minutes = Number(match12[2]);
    const nextPeriod = match12[3].toUpperCase();
    if (nextPeriod === 'PM' && hours !== 12) hours += 12;
    if (nextPeriod === 'AM' && hours === 12) hours = 0;
    return `${pad2(hours)}:${pad2(minutes)}`;
  }

  if (match24) {
    return `${pad2(Number(match24[1]))}:${match24[2]}`;
  }

  return null;
};

const useDebouncedValue = <T,>(value: T, delayMs: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
};

const getTomorrowSubjects = (baseDate = new Date()) => {
  const tomorrow = new Date(baseDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayIndex = tomorrow.getDay();
  return ACADEMIC_TIMETABLE[dayIndex] || [];
};

const Home: React.FC = () => {
  const {
    user,
    setUser,
    layers,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    bibleReading,
    completeBibleDay,
    goToBibleDay,
    refreshBibleReading,
    dailyTaskGoal,
    addJournalEntry,
  } = useApp();

  const [insight, setInsight] = useState('Consistent spiritual habits act as the fertile soil for all other life pillars.');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loadingBible, setLoadingBible] = useState(false);

  const [showScripturePage, setShowScripturePage] = useState(false);
  const [showFocusPage, setShowFocusPage] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [showInstallSuggestion, setShowInstallSuggestion] = useState(false);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

  const [readingSuggestion, setReadingSuggestion] = useState('');
  const [scripturePages, setScripturePages] = useState<BibleVerse[][]>([]);
  const [scripturePageLabels, setScripturePageLabels] = useState<string[]>([]);
  const [scripturePageIndex, setScripturePageIndex] = useState(0);
  const [loadingScriptureText, setLoadingScriptureText] = useState(false);
  const [isScriptureFullscreen, setIsScriptureFullscreen] = useState(false);
  const [isReadingScriptureAloud, setIsReadingScriptureAloud] = useState(false);
  const [showReflectionComposer, setShowReflectionComposer] = useState(false);
  const [reflectionDraft, setReflectionDraft] = useState('');

  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskLayer, setNewTaskLayer] = useState<LayerId>('general');
  const [newTaskPriority, setNewTaskPriority] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('C');
  const [newTaskRepeat, setNewTaskRepeat] = useState<'once' | 'daily' | 'weekly'>('once');
  const [newTaskTime, setNewTaskTime] = useState(() => getRoundedCurrentTime());
  const [newTaskTimeFormat, setNewTaskTimeFormat] = useState<'12' | '24'>('24');
  const [newTaskHourInput, setNewTaskHourInput] = useState(() => parseTimeToEditor(getRoundedCurrentTime()).hour24);
  const [newTaskMinuteInput, setNewTaskMinuteInput] = useState(() => parseTimeToEditor(getRoundedCurrentTime()).minute);
  const [newTaskPeriod, setNewTaskPeriod] = useState<'AM' | 'PM'>(() => parseTimeToEditor(getRoundedCurrentTime()).period);
  const [newTaskDate, setNewTaskDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newTaskAlarmEnabled, setNewTaskAlarmEnabled] = useState(true);
  const [newTaskPreferredMusic, setNewTaskPreferredMusic] = useState(() => {
    const playlist = user?.preferences.customFocusPlaylistNames || [];
    if (playlist.length > 0 && playlist[0]) return playlist[0];
    if (user?.preferences.customFocusSongName) return user.preferences.customFocusSongName;
    return 'Instrumental Warmth';
  });
  const [newTaskCustomAlarmName, setNewTaskCustomAlarmName] = useState('');
  const [newTaskCustomAlarmDataUrl, setNewTaskCustomAlarmDataUrl] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(25); // default 25 minutes
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  const [isTaskPreviewPlaying, setIsTaskPreviewPlaying] = useState(false);
  const [quickAddError, setQuickAddError] = useState('');
  const [alarmTask, setAlarmTask] = useState<Task | null>(null);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('');
  const scriptureSpeechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [reminderFeed, setReminderFeed] = useState<Array<{ id: string; title: string; detail: string; createdAt: string }>>([]);
  const [toastReminder, setToastReminder] = useState<{ id: string; title: string; detail: string } | null>(null);
  const [mediaPermissionGranted, setMediaPermissionGranted] = useState<boolean | null>(null);
  const [opsLastCheckedAt, setOpsLastCheckedAt] = useState('');
  const [opsCheckError, setOpsCheckError] = useState('');
  const [opsChecking, setOpsChecking] = useState(false);
  const isSubPageOpen = showScripturePage || showFocusPage;

  const todayDateKey = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  })();

  const reminderTimeoutsRef = useRef<Record<string, number>>({});
  const alarmTimeoutsRef = useRef<Record<string, number>>({});
  const triggeredRef = useRef<Set<string>>(new Set());
  const alarmTriggeredRef = useRef<Set<string>>(new Set());
  const scripturePageRef = useRef<HTMLDivElement | null>(null);
  const reflectionComposerRef = useRef<HTMLTextAreaElement | null>(null);
  const taskPreviewMediaRef = useRef<HTMLAudioElement | null>(null);
  const taskPreviewAudioRef = useRef<AudioContext | null>(null);
  const taskPreviewEndRef = useRef<number | null>(null);
  const bibleReminderTimeoutRef = useRef<number | null>(null);
  const bibleReminderTriggeredDateRef = useRef('');
  const academicReminderTimeoutRef = useRef<number | null>(null);
  const academicReminderTriggeredDateRef = useRef('');
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);

  const completedToday = bibleReading.completed && bibleReading.lastCompletedDate === todayDateKey;
  const readingStartDate = user?.preferences?.readingPlanStartDate || todayDateKey;
  const readingElapsedMs = new Date(`${todayDateKey}T00:00:00`).getTime() - new Date(`${readingStartDate}T00:00:00`).getTime();
  const readingElapsedDays = Number.isFinite(readingElapsedMs)
    ? Math.max(0, Math.floor(readingElapsedMs / (24 * 60 * 60 * 1000)))
    : 0;
  const maxBibleDay = Math.max(1, Math.min(bibleReading.totalDays, readingElapsedDays + 1));
  const canNavigateBible = true;
  const notificationsEnabled = Boolean(
    user?.preferences.notifications.taskReminders &&
    user?.preferences.notifications.dailyScripture &&
    user?.preferences.notifications.streakProtection
  );

  const activeScripturePage = scripturePages[scripturePageIndex] || [];
  const activeScriptureLabel = scripturePageLabels[scripturePageIndex] || bibleReading.passage;

  const stopScriptureReading = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    scriptureSpeechRef.current = null;
    setIsReadingScriptureAloud(false);
  }, []);

  const readScriptureAloud = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setNotificationStatus('Read aloud is not available in this browser.');
      return;
    }

    const flattenedPassage = scripturePages.flat();
    const versesToRead = flattenedPassage.length > 0
      ? flattenedPassage
          .map((verse) => `${verse.bookName} ${verse.chapter}:${verse.verse}. ${verse.text}`)
          .join(' ')
      : activeScripturePage.length > 0
        ? activeScripturePage
            .map((verse) => `${verse.bookName} ${verse.chapter}:${verse.verse}. ${verse.text}`)
            .join(' ')
        : bibleReading.text;
    const textToRead = `${bibleReading.passage}. ${versesToRead}`.trim();

    if (!textToRead) {
      setNotificationStatus('No scripture text is available to read aloud yet.');
      return;
    }

    stopScriptureReading();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => {
      scriptureSpeechRef.current = null;
      setIsReadingScriptureAloud(false);
    };
    utterance.onerror = () => {
      scriptureSpeechRef.current = null;
      setIsReadingScriptureAloud(false);
    };

    scriptureSpeechRef.current = utterance;
    setIsReadingScriptureAloud(true);
    window.speechSynthesis.speak(utterance);
  }, [activeScripturePage, bibleReading.passage, bibleReading.text, scripturePages, stopScriptureReading]);

  const favoriteFocusTrack = useMemo(() => {
    const names = user?.preferences.customFocusPlaylistNames || [];
    const urls = user?.preferences.customFocusPlaylistDataUrls || [];
    if (names.length > 0 && urls.length > 0 && names[0] && urls[0]) {
      return { name: names[0], dataUrl: urls[0] };
    }
    if (user?.preferences.customFocusSongName && user?.preferences.customFocusSongDataUrl) {
      return { name: user.preferences.customFocusSongName, dataUrl: user.preferences.customFocusSongDataUrl };
    }
    return null;
  }, [
    user?.preferences.customFocusPlaylistNames,
    user?.preferences.customFocusPlaylistDataUrls,
    user?.preferences.customFocusSongName,
    user?.preferences.customFocusSongDataUrl,
  ]);

  const getDefaultAlarmFromPreferences = () => {
    if (user?.preferences.lastAlarmSongName && user?.preferences.lastAlarmSongDataUrl) {
      return {
        name: user.preferences.lastAlarmSongName,
        dataUrl: user.preferences.lastAlarmSongDataUrl,
      };
    }
    return favoriteFocusTrack;
  };

  const resolveTaskUploadedAlarm = (task: Task) => {
    if (task.customAlarmAudioDataUrl) {
      return { dataUrl: task.customAlarmAudioDataUrl, name: task.customAlarmAudioName || task.preferredMusic || 'Uploaded audio' };
    }

    const preferredName = String(task.preferredMusic || '').trim();
    if (!preferredName) return getDefaultAlarmFromPreferences();

    const playlistNames = user?.preferences.customFocusPlaylistNames || [];
    const playlistUrls = user?.preferences.customFocusPlaylistDataUrls || [];
    const index = playlistNames.findIndex((name) => String(name || '').trim().toLowerCase() === preferredName.toLowerCase());
    if (index >= 0 && playlistUrls[index]) {
      return { dataUrl: playlistUrls[index], name: playlistNames[index] };
    }

    const singleName = String(user?.preferences.customFocusSongName || '').trim();
    const singleUrl = String(user?.preferences.customFocusSongDataUrl || '').trim();
    if (singleName && singleUrl && singleName.toLowerCase() === preferredName.toLowerCase()) {
      return { dataUrl: singleUrl, name: singleName };
    }

    return getDefaultAlarmFromPreferences();
  };

  const [edenTemplatePool, setEdenTemplatePool] = useState<EdenTemplate[]>([]);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const debouncedTaskName = useDebouncedValue(newTaskName.trim(), 220);

  const realtimeTemplateSuggestions = useMemo(() => {
    const query = debouncedTaskName.trim();
    if (query.length < 2) return [] as EdenTemplate[];

    const suggestions = getEdenTypingSuggestions({
      tasks,
      layerId: newTaskLayer,
      intent: query,
      mostRepeated: user?.preferences.mostRepeatedTasks?.map((entry) => ({
        name: entry.name,
        layerId: entry.layerId,
        count: entry.count,
      })),
      limit: 12,
    });

    return suggestions.slice(0, 8);
  }, [debouncedTaskName, newTaskLayer, tasks, user?.preferences.mostRepeatedTasks]);

  useEffect(() => {
    if (showQuickAdd) return;
    setShowTemplatePicker(false);
    setEdenTemplatePool([]);
    const defaultAlarm = getDefaultAlarmFromPreferences();
    if (defaultAlarm) {
      setNewTaskPreferredMusic(defaultAlarm.name);
      setNewTaskCustomAlarmName(defaultAlarm.name);
      setNewTaskCustomAlarmDataUrl(defaultAlarm.dataUrl);
    } else {
      setNewTaskPreferredMusic('');
      setNewTaskCustomAlarmName('');
      setNewTaskCustomAlarmDataUrl('');
    }
  }, [favoriteFocusTrack, showQuickAdd, user?.preferences.lastAlarmSongName, user?.preferences.lastAlarmSongDataUrl]);

  useEffect(() => {
    if (!user) return;
    const mostRepeated = analyzeMostRepeatedTasks(tasks, 12).map((item) => ({
      name: item.name,
      layerId: item.layerId,
      priority: item.priority,
      count: item.count,
    }));

    const current = user.preferences.mostRepeatedTasks || [];
    if (JSON.stringify(current) === JSON.stringify(mostRepeated)) return;

    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        mostRepeatedTasks: mostRepeated,
      },
    });
  }, [tasks, user?.id]);

  const stopActiveAlarm = () => {
    stopPlaybackAlarm();
    setAlarmOpen(false);
    setAlarmTask(null);
  };

  const snoozeActiveAlarm = useCallback(() => {
    if (!alarmTask) return;

    const snoozeMinutes = 10;
    const snoozedAt = new Date(Date.now() + snoozeMinutes * 60 * 1000);

    updateTask(alarmTask.id, {
      time: format(snoozedAt, 'HH:mm'),
      date: snoozedAt.toISOString(),
      completed: false,
      alarmEnabled: true,
    });

    stopPlaybackAlarm();
    setAlarmOpen(false);
    setAlarmTask(null);
    setNotificationStatus(`${alarmTask.name} snoozed for 10 minutes.`);
  }, [alarmTask, updateTask]);

  const enterActiveAlarm = useCallback(() => {
    if (!alarmTask) return;

    stopPlaybackAlarm();
    setAlarmOpen(false);
    setAlarmTask(null);
    setShowQuickAdd(false);
    setShowFocusPage(false);
    setShowScripturePage(false);
    setNotificationStatus(`${alarmTask.name} opened in Edenify.`);
  }, [alarmTask]);

  const skipActiveAlarm = useCallback(() => {
    if (!alarmTask) return;

    stopPlaybackAlarm();
    setAlarmOpen(false);
    setAlarmTask(null);
    setNotificationStatus(`${alarmTask.name} dismissed.`);
  }, [alarmTask]);

  useEffect(() => {
    if (!alarmOpen || !alarmTask) return;

    const latestTask = tasks.find((task) => task.id === alarmTask.id);
    if (!latestTask || latestTask.alarmEnabled === false || isTaskCompletedForToday(latestTask)) {
      stopActiveAlarm();
    }
  }, [alarmOpen, alarmTask, tasks]);

  useEffect(() => {
    return () => {
      stopScriptureReading();
    };
  }, [stopScriptureReading]);

  useEffect(() => {
    if (!showScripturePage) {
      stopScriptureReading();
    }
  }, [showScripturePage, stopScriptureReading]);

  const requestNotificationPermission = async (withFeedback: boolean) => {
    if (!('Notification' in window)) {
      if (withFeedback) setNotificationStatus('Notifications are not supported on this browser.');
      return false;
    }

    if (Notification.permission === 'granted') {
      if (withFeedback) setNotificationStatus('Notifications are already enabled.');
      return true;
    }

    if (Notification.permission === 'denied') {
      if (withFeedback) setNotificationStatus('Notifications are blocked in browser settings.');
      return false;
    }

    const permission = await Notification.requestPermission();
    if (withFeedback) {
      setNotificationStatus(permission === 'granted' ? 'Notifications enabled.' : 'Notification permission was not granted.');
    }
    return permission === 'granted';
  };

  const tryBrowserNotification = async (title: string, body: string) => {
    const granted = await requestNotificationPermission(false);
    if (!granted) return;
    new Notification(title, { body, icon: '/edenify-logo.png' });
  };

  const toggleNotifications = async () => {
    if (!user) return;

    const turningOn = !notificationsEnabled;
    if (turningOn) {
      const allowed = await requestNotificationPermission(true);
      if (!allowed) return;
    }

    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        notifications: {
          taskReminders: turningOn,
          dailyScripture: turningOn,
          streakProtection: turningOn,
        },
      },
    });

    setNotificationStatus(turningOn ? 'Notification is ON' : 'Notification is OFF');

    if (!turningOn) {
      stopActiveAlarm();
    }

    if (turningOn) {
      await tryBrowserNotification('Edenify Notifications', 'All notifications are now enabled.');
    }
  };

  const pushReminderEvent = async (title: string, detail: string, taskId?: string) => {
    const item = {
      id: `evt-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      title,
      detail,
      createdAt: new Date().toISOString(),
    };

    console.log('[Reminder] Event triggered:', { title, detail, isBibleReminder: title.includes('📖') });

    setReminderFeed((prev) => [item, ...prev].slice(0, 20));
    setToastReminder({ id: item.id, title, detail });

    // Send reminder notification through available local channels.
    if (areNotificationsEnabled()) {
      try {
        const results = await sendCrossChannelNotification(
          {
            title: title,
            body: detail,
            icon: '/edenify-logo.png',
            tag: `reminder-${item.id}`,
            taskId,
          }
        );
        console.log('[Reminder] Notification results:', results);
      } catch (error) {
        console.warn('[Reminder] Failed to send notifications:', error);
      }
    } else {
      console.debug('[Reminder] Skipped notifications - not enabled');
    }
  };

  const getTaskCardDomId = useCallback((taskId: string) => `task-card-${encodeURIComponent(taskId)}`, []);

  const focusTaskFromNotification = useCallback((taskId: string) => {
    setFocusedTaskId(taskId);
    window.setTimeout(() => {
      const element = document.getElementById(getTaskCardDomId(taskId));
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 140);
  }, [getTaskCardDomId]);

  useEffect(() => {
    const handleFocusTask = (event: Event) => {
      const custom = event as CustomEvent<{ taskId?: string }>;
      const taskId = custom.detail?.taskId;
      if (!taskId) return;
      focusTaskFromNotification(taskId);
    };

    // Listen for Service Worker messages (including alarm playback signals)
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PLAY_ALARM') {
        const customUrl = event.data?.data?.customAudioDataUrl || getDefaultAlarmFromPreferences()?.dataUrl;
        if (event.data?.data?.isBibleReminder) {
          playBibleReminderAlarm(customUrl).catch(err => console.warn('[Alarm] SW Bible reminder failed:', err));
        } else {
          playTaskAlarm(event.data?.data?.taskName || 'Task', customUrl).catch(err => console.warn('[Alarm] SW task alarm failed:', err));
        }
      }
    };

    window.addEventListener('edenify:focus-task', handleFocusTask as EventListener);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage as EventListener);
    }

    const params = new URLSearchParams(window.location.search);
    const taskId = params.get('taskId');
    if (taskId) {
      focusTaskFromNotification(taskId);
    }

    return () => {
      window.removeEventListener('edenify:focus-task', handleFocusTask as EventListener);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage as EventListener);
      }
    };
  }, [focusTaskFromNotification]);

  useEffect(() => {
    if (!focusedTaskId) return;
    const id = window.setTimeout(() => setFocusedTaskId(null), 8000);
    return () => window.clearTimeout(id);
  }, [focusedTaskId]);

  useEffect(() => {
    if (!notificationStatus) return;
    const id = window.setTimeout(() => {
      setNotificationStatus('');
    }, 10000);
    return () => window.clearTimeout(id);
  }, [notificationStatus]);

  useEffect(() => {
    if (!toastReminder) return;
    const id = window.setTimeout(() => {
      setToastReminder(null);
    }, 7000);
    return () => window.clearTimeout(id);
  }, [toastReminder]);

  const stopTaskPreview = () => {
    if (taskPreviewEndRef.current) {
      window.clearTimeout(taskPreviewEndRef.current);
      taskPreviewEndRef.current = null;
    }

    if (taskPreviewMediaRef.current) {
      taskPreviewMediaRef.current.pause();
      taskPreviewMediaRef.current.currentTime = 0;
      taskPreviewMediaRef.current = null;
    }

    if (taskPreviewAudioRef.current) {
      taskPreviewAudioRef.current.close();
      taskPreviewAudioRef.current = null;
    }

    setIsTaskPreviewPlaying(false);
  };

  const previewUploadedReminder = () => {
    if (!newTaskCustomAlarmDataUrl) {
      setQuickAddError('Upload a reminder song first.');
      return;
    }
    previewCustomReminder();
  };

  const previewCustomReminder = () => {
    if (!newTaskCustomAlarmDataUrl) return;
    stopTaskPreview();

    const media = new Audio(newTaskCustomAlarmDataUrl);
    media.volume = 0.85;
    media.play().then(() => {
      setIsTaskPreviewPlaying(true);
    }).catch(() => {
      setIsTaskPreviewPlaying(false);
    });
    media.onended = () => {
      setIsTaskPreviewPlaying(false);
      taskPreviewMediaRef.current = null;
    };

    taskPreviewMediaRef.current = media;
  };

  useEffect(() => {
    return () => {
      stopTaskPreview();
    };
  }, []);

  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM dd');
  const taskStats = getDailyTaskStats(tasks, dailyTaskGoal);
  const priorityTask = useMemo(() => {
    const candidates = tasks.filter((task) => isTaskScheduledForToday(task) && !isTaskCompletedForToday(task) && (task.priority === 'A' || task.priority === 'B'));
    return candidates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
  }, [tasks]);

  const todaysTasks = useMemo(() => {
    return tasks.filter((task) => isTaskScheduledForToday(task));
  }, [tasks]);
  const dailyTasks = useMemo(() => todaysTasks.filter((t) => t.repeat === 'daily'), [todaysTasks]);
  const weeklyTasks = useMemo(() => todaysTasks.filter((t) => t.repeat === 'weekly'), [todaysTasks]);

  const sortedTodayTasks = useMemo(() => {
    return [...todaysTasks].sort((a, b) => {
      const aCompleted = isTaskCompletedForToday(a);
      const bCompleted = isTaskCompletedForToday(b);
      if (aCompleted !== bCompleted) return Number(aCompleted) - Number(bCompleted);

      const aDue = parseTaskDueDate(a)?.getTime() || 0;
      const bDue = parseTaskDueDate(b)?.getTime() || 0;
      if (aDue !== bDue) return bDue - aDue;

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [todaysTasks]);

  const failedTaskIds = useMemo(() => {
    return new Set(
      todaysTasks
        .filter((task) => {
          if (String(task.id || '').startsWith('habit-task-')) return false;
          if (isTaskCompletedForToday(task)) return false;
          // Use duration-based failure detection if duration is set
          return isTaskFailedByDuration(task);
        })
        .map((task) => task.id)
    );
  }, [todaysTasks]);

  const dailyCompleted = dailyTasks.filter((t) => isTaskCompletedForToday(t)).length;
  const onceCompleted = weeklyTasks.filter((t) => isTaskCompletedForToday(t)).length;
  const dailyPercent = dailyTasks.length ? Math.round((dailyCompleted / dailyTasks.length) * 100) : 0;
  const oncePercent = weeklyTasks.length ? Math.round((onceCompleted / weeklyTasks.length) * 100) : 0;
  const notificationPermissionState = typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;
  const notificationStateLabel = notificationPermissionState === 'granted'
    ? 'Granted'
    : notificationPermissionState === 'denied'
      ? 'Blocked'
      : notificationPermissionState === 'default'
        ? 'Pending'
        : 'Unsupported';
  const alarmReadyCount = useMemo(() => {
    return tasks.filter((task) => {
      if (isTaskCompletedForToday(task)) return false;
      if (task.alarmEnabled === false) return false;
      return Boolean(parseTaskDueDate(task));
    }).length;
  }, [tasks]);

  const refreshOperationalStatus = useCallback(async (withFeedback: boolean) => {
    setOpsChecking(true);
    setOpsCheckError('');

    try {
      const health = await fetch('/api/health', { cache: 'no-store' });
      if (!health.ok) {
        throw new Error('Backend health check is unavailable.');
      }

      setOpsLastCheckedAt(new Date().toISOString());
      if (withFeedback) {
        setNotificationStatus('System status refreshed.');
      }
    } catch (error) {
      setOpsCheckError(error instanceof Error ? error.message : 'Could not refresh operational status.');
      if (withFeedback) {
        setNotificationStatus('Could not refresh system status.');
      }
    } finally {
      setOpsChecking(false);
    }
  }, []);

  const runSystemCheck = async () => {
    await pushReminderEvent('System check', 'Reminder channels are alive.');
    void refreshOperationalStatus(true);
  };

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      try {
        const context = `User is level ${layers[0]?.level || 1}. Tasks today: ${tasks.length}. Focus areas active.`;
        const nextInsight = await getEdenInsight(context);
        if (nextInsight) setInsight(nextInsight);
      } catch (error) {
        console.warn('Insight unavailable', error);
      } finally {
        setLoadingInsight(false);
      }
    };

    const fetchReadingSuggestion = async () => {
      try {
        const suggested = await getSuggestedVerse();
        if (suggested?.suggestion) {
          setReadingSuggestion(suggested.suggestion);
        }
      } catch (error) {
        console.warn('Reading suggestion unavailable', error);
      }
    };

    fetchInsight();
    fetchReadingSuggestion();
  }, [layers, tasks]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as any);
      setShowInstallSuggestion(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const checkMediaPermission = async () => {
      const permitted = await requestMediaPermission();
      setMediaPermissionGranted(permitted);
    };
    checkMediaPermission();
  }, []);

  useEffect(() => {
    return () => {
      stopActiveAlarm();
    };
  }, []);

  useEffect(() => {
    const clearAllScheduledTimeouts = () => {
      (Object.values(reminderTimeoutsRef.current) as number[]).forEach((timeoutId) => window.clearTimeout(timeoutId));
      reminderTimeoutsRef.current = {};
      (Object.values(alarmTimeoutsRef.current) as number[]).forEach((timeoutId) => window.clearTimeout(timeoutId));
      alarmTimeoutsRef.current = {};
    };

    const getFutureDue = (task: Task, nowMs: number) => {
      const due = parseTaskDueDate(task);
      if (!due) return null;

      const reminderDue = new Date(due);
      if (task.repeat === 'daily' && reminderDue.getTime() <= nowMs) {
        reminderDue.setDate(reminderDue.getDate() + 1);
      }
      if (task.repeat === 'weekly' && reminderDue.getTime() <= nowMs) {
        reminderDue.setDate(reminderDue.getDate() + 7);
      }
      return reminderDue;
    };

    const triggerReminder = async (task: Task, reminderKey: string) => {
      if (triggeredRef.current.has(reminderKey)) return;
      triggeredRef.current.add(reminderKey);

      const layerName = layers.find((layer) => layer.id === task.layerId)?.name || 'General';
      await pushReminderEvent('Task reminder', `${task.name} from ${layerName} starts in 5 minutes.`, task.id);

      if (user?.preferences.notifications.taskReminders) {
        await tryBrowserNotification('Edenify Task Reminder', `${task.name} from ${layerName} starts in 5 minutes.`);
      }
      setNotificationStatus(`${task.name} from ${layerName} is coming in 5 minutes.`);
    };

    const triggerAlarm = async (task: Task, alarmKey: string) => {
      if (alarmTriggeredRef.current.has(alarmKey)) return;
      alarmTriggeredRef.current.add(alarmKey);

      await pushReminderEvent('Task due now', `${task.name} is due now (${task.time}).`, task.id);
      setNotificationStatus(`${task.name} is due now.`);
      setAlarmTask(task);
      setAlarmOpen(true);
      const uploaded = resolveTaskUploadedAlarm(task);
      await playTaskAlarm(task.name, uploaded?.dataUrl);
    };

    clearAllScheduledTimeouts();

    const now = Date.now();
    tasks.forEach((task) => {
      if (!user?.preferences.notifications.taskReminders) return;
      if (isTaskCompletedForToday(task) || task.alarmEnabled === false) return;

      const reminderDue = getFutureDue(task, now);
      if (!reminderDue) return;

      const dueMs = reminderDue.getTime();
      if (dueMs <= now) return;

      const reminderAtMs = dueMs - 5 * 60 * 1000;
      const delay = reminderAtMs <= now ? 500 : reminderAtMs - now;
      const reminderKey = `${task.id}|${reminderDue.toISOString().slice(0, 16)}`;
      const alarmDelay = dueMs <= now ? 500 : dueMs - now;
      const alarmKey = `${task.id}|alarm|${reminderDue.toISOString().slice(0, 16)}`;

      if (delay > 1000 * 60 * 60 * 26) return;

      if (user?.preferences.notifications.taskReminders) {
        reminderTimeoutsRef.current[reminderKey] = window.setTimeout(() => {
          void triggerReminder(task, reminderKey);
        }, delay);
      }

      alarmTimeoutsRef.current[alarmKey] = window.setTimeout(() => {
        void triggerAlarm(task, alarmKey);
      }, alarmDelay);
    });

    return () => {
      clearAllScheduledTimeouts();
    };
  }, [tasks, layers, user?.preferences.notifications.taskReminders, user?.preferences.customFocusPlaylistNames, user?.preferences.customFocusPlaylistDataUrls, user?.preferences.customFocusSongName, user?.preferences.customFocusSongDataUrl]);

  useEffect(() => {
    const askOnce = async () => {
      if (!user) return;
      if (localStorage.getItem('edenify_notification_asked') === 'true') return;
      await requestNotificationPermission(false);
      localStorage.setItem('edenify_notification_asked', 'true');
    };

    askOnce();
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;

    const revisionTask = tasks.find((task) => task.id === DEFAULT_REVISION_TASK_ID)
      || tasks.find((task) => task.layerId === 'academic' && task.name.trim().toLowerCase() === 'revision');
    if (!revisionTask) return;

    const normalizedTime = parseAnyTimeTo24(revisionTask.time || '');
    if (!normalizedTime) return;

    const [hours, minutes] = normalizedTime.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;

    const scheduleNextReminder = () => {
      const now = new Date();
      const nextReminder = new Date(now);
      nextReminder.setHours(hours, minutes, 0, 0);
      if (nextReminder.getTime() <= now.getTime()) {
        nextReminder.setDate(nextReminder.getDate() + 1);
      }

      if (academicReminderTimeoutRef.current) {
        window.clearTimeout(academicReminderTimeoutRef.current);
      }

      const delay = Math.max(500, nextReminder.getTime() - now.getTime());
      academicReminderTimeoutRef.current = window.setTimeout(() => {
        const todayKey = format(new Date(), 'yyyy-MM-dd');
        if (academicReminderTriggeredDateRef.current !== todayKey) {
          academicReminderTriggeredDateRef.current = todayKey;

          const subjects = getTomorrowSubjects();
          const detail = subjects.length
            ? `Tomorrow's subjects: ${subjects.join(', ')}. Start your revision now.`
            : 'No scheduled classes tomorrow. Use this revision block for consolidation and weak-topic review.';

          void pushReminderEvent('Academic revision reminder', detail, revisionTask.id);
          setNotificationStatus(subjects.length ? `Tomorrow: ${subjects.join(', ')}` : 'Revision block: no classes tomorrow.');
          if (revisionTask.alarmEnabled !== false) {
            void playTaskAlarm(revisionTask.name, revisionTask.customAlarmAudioDataUrl || getDefaultAlarmFromPreferences()?.dataUrl);
          }
        }

        scheduleNextReminder();
      }, delay);
    };

    scheduleNextReminder();

    return () => {
      if (academicReminderTimeoutRef.current) {
        window.clearTimeout(academicReminderTimeoutRef.current);
        academicReminderTimeoutRef.current = null;
      }
    };
  }, [tasks, user?.id]);

  useEffect(() => {
    void refreshOperationalStatus(false);

    const intervalId = window.setInterval(() => {
      void refreshOperationalStatus(false);
    }, 45000);

    const handleVisible = () => {
      if (document.visibilityState !== 'visible') return;
      void refreshOperationalStatus(false);
    };

    document.addEventListener('visibilitychange', handleVisible);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisible);
    };
  }, [refreshOperationalStatus]);

  useEffect(() => {
    if (!user) return;
    if (!user.preferences.notifications.dailyScripture) return;

    void registerBibleReminderSync();

    const preferredTime = user.preferences.bibleReminderTime || '06:30 AM';
    const normalized = preferredTime.toUpperCase();
    const match12 = normalized.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    const match24 = normalized.match(/^(\d{1,2}):(\d{2})$/);
    
    if (!match12 && !match24) {
      console.warn('[Bible Reminder] Invalid time format:', preferredTime);
      return;
    }

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
    }

    const now = new Date();
    const nextReminder = new Date();
    nextReminder.setHours(hours, minutes, 0, 0);
    if (nextReminder.getTime() <= now.getTime()) {
      nextReminder.setDate(nextReminder.getDate() + 1);
    }

    const delay = Math.max(500, nextReminder.getTime() - now.getTime());
    const nextReminderStr = nextReminder.toLocaleString();
    console.log(`[Bible Reminder] Scheduled for ${nextReminderStr} (in ${Math.round(delay / 1000 / 60)} minutes)`);

    if (bibleReminderTimeoutRef.current) {
      window.clearTimeout(bibleReminderTimeoutRef.current);
      bibleReminderTimeoutRef.current = null;
    }

    const fireBibleReminder = async () => {
      try {
        const dateKey = format(new Date(), 'yyyy-MM-dd');
        if (bibleReminderTriggeredDateRef.current === dateKey) {
          console.log('[Bible Reminder] Skipped (already triggered today)');
          return;
        }
        bibleReminderTriggeredDateRef.current = dateKey;

        console.log('[Bible Reminder] Firing at', new Date().toLocaleString());
        
        // Use current bibleReading state at callback time
        pushReminderEvent('Bible reminder', `Day ${bibleReading.day}: ${bibleReading.passage}`);

        await tryBrowserNotification('Edenify Bible Reading', `Day ${bibleReading.day}: ${bibleReading.passage}`);

        if (user?.preferences.bibleReminderAlarm) {
          await playBibleReminderAlarm(getDefaultAlarmFromPreferences()?.dataUrl);
        }
      } catch (err) {
        console.error('[Bible Reminder] Error during execution:', err);
      }
    };

    bibleReminderTimeoutRef.current = window.setTimeout(() => {
      void fireBibleReminder();
    }, delay);

    const catchUpId = window.setInterval(() => {
      const current = new Date();
      const todayKey = format(current, 'yyyy-MM-dd');
      if (bibleReminderTriggeredDateRef.current === todayKey) return;

      const scheduledToday = new Date(current);
      scheduledToday.setHours(hours, minutes, 0, 0);
      const lagMs = current.getTime() - scheduledToday.getTime();

      // If app was backgrounded/killed around reminder time, fire once when back.
      if (lagMs >= 0 && lagMs <= 6 * 60 * 60 * 1000) {
        void fireBibleReminder();
      }
    }, 60_000);

    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      const current = new Date();
      const todayKey = format(current, 'yyyy-MM-dd');
      if (bibleReminderTriggeredDateRef.current === todayKey) return;

      const scheduledToday = new Date(current);
      scheduledToday.setHours(hours, minutes, 0, 0);
      const lagMs = current.getTime() - scheduledToday.getTime();

      if (lagMs >= 0 && lagMs <= 6 * 60 * 60 * 1000) {
        void fireBibleReminder();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (bibleReminderTimeoutRef.current) {
        window.clearTimeout(bibleReminderTimeoutRef.current);
        bibleReminderTimeoutRef.current = null;
      }
      window.clearInterval(catchUpId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [
    user?.id,
    user?.preferences.notifications.dailyScripture,
    user?.preferences.bibleReminderAlarm,
    user?.preferences.bibleReminderTime,
    bibleReading.day,
    bibleReading.passage,
  ]);

  useEffect(() => {
    if (!showScripturePage) return;

    const loadFullPassage = async () => {
      setLoadingScriptureText(true);
      try {
        const loadChapterWithAliases = async (bookName: string, chapterNo: number): Promise<BibleVerse[]> => {
          const normalized = bookName.trim();
          const candidates = Array.from(new Set([
            normalized,
            normalized.replace(/\bPsalms\b/i, 'Psalm'),
            normalized.replace(/\bPsalm\b/i, 'Psalms'),
            normalized.replace(/\bSong of Solomon\b/i, 'Song of Songs'),
            normalized.replace(/\bSong of Songs\b/i, 'Song of Solomon'),
            normalized.replace(/\bSong of Songs\b/i, 'Canticles'),
            normalized.replace(/\bCanticles\b/i, 'Song of Songs'),
          ]));

          for (const candidate of candidates) {
            const chapter = await getChapter(candidate, chapterNo);
            if (chapter.length > 0) return chapter;
          }

          return [];
        };

        const segments = bibleReading.passage
          .split(';')
          .map((part) => part.trim())
          .filter(Boolean);

        const parsedPages: BibleVerse[][] = [];
        const labels: string[] = [];

        for (const segment of segments) {
          const match = segment.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?(?:-(\d+))?$/);
          if (!match) continue;

          const book = match[1].trim();
          const chapterStart = Number(match[2]);
          const singleVerseStart = match[3] ? Number(match[3]) : null;
          const singleVerseEnd = match[4] ? Number(match[4]) : null;
          const chapterEnd = match[5] ? Number(match[5]) : chapterStart;

          const passagePage: BibleVerse[] = [];

          if (singleVerseStart !== null) {
            const chapter = await loadChapterWithAliases(book, chapterStart);
            const filtered = chapter.filter((v) => {
              if (singleVerseEnd !== null) return v.verse >= singleVerseStart && v.verse <= singleVerseEnd;
              return v.verse === singleVerseStart;
            });
            passagePage.push(...filtered);
            if (passagePage.length > 0) {
              parsedPages.push(passagePage);
              labels.push(segment);
            }
            continue;
          }

          for (let chapterNo = chapterStart; chapterNo <= chapterEnd; chapterNo += 1) {
            const chapter = await loadChapterWithAliases(book, chapterNo);
            passagePage.push(...chapter);
          }

          if (passagePage.length > 0) {
            parsedPages.push(passagePage);
            labels.push(segment);
          }
        }

        if (parsedPages.length > 0) {
          setScripturePageIndex(0);
          setScripturePages(parsedPages);
          setScripturePageLabels(labels);
          return;
        }

        const fallback = await searchVerses(bibleReading.passage.split(' ')[0], 40);
        setScripturePageIndex(0);
        setScripturePages(fallback.length > 0 ? [fallback] : []);
        setScripturePageLabels([bibleReading.passage]);
      } catch (error) {
        console.error('Could not load ASV passage', error);
        setScripturePageIndex(0);
        setScripturePages([]);
        setScripturePageLabels([]);
      } finally {
        setLoadingScriptureText(false);
      }
    };

    loadFullPassage();
  }, [showScripturePage, bibleReading.passage, bibleReading.text]);

  useEffect(() => {
    if (!showScripturePage) {
      setShowReflectionComposer(false);
      setIsScriptureFullscreen(false);
      setScripturePageIndex(0);
      setScripturePages([]);
      setScripturePageLabels([]);
      return;
    }

    setReflectionDraft(bibleReading.reflection || '');

    const handleFullscreenChange = () => {
      const currentFullscreen = document.fullscreenElement;
      setIsScriptureFullscreen(Boolean(currentFullscreen));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [showScripturePage, bibleReading.reflection]);

  const toggleScriptureFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const element = scripturePageRef.current || document.documentElement;
        
        // Ensure theme classes are applied to fullscreen element
        const selectedTheme = document.documentElement.getAttribute('data-theme') || 'system';
        const isDark = document.documentElement.classList.contains('dark');
        element.setAttribute('data-theme', selectedTheme);
        
        if (isDark) {
          element.classList.add('dark');
        } else {
          element.classList.remove('dark');
        }
        
        await element.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen toggle failed:', error);
    }
  };

  const closeScripturePage = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // no-op
      }
    }
    setShowScripturePage(false);
  };

  const openReflectionComposer = () => {
    setShowReflectionComposer(true);
    window.setTimeout(() => {
      reflectionComposerRef.current?.focus();
      reflectionComposerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 20);
  };

  const saveReflection = () => {
    const content = reflectionDraft.trim();
    if (!content) {
      setNotificationStatus('Write a short reflection before saving.');
      return;
    }

    addJournalEntry({
      id: `journal-${Date.now()}`,
      date: new Date().toISOString(),
      layerId: 'spiritual',
      content: `Day ${bibleReading.day} • ${bibleReading.passage}\n${content}`,
    });

    setShowReflectionComposer(false);
    setNotificationStatus('Reflection saved to your journal.');
  };

  const handleRefreshBible = async () => {
    setLoadingBible(true);
    try {
      await refreshBibleReading();
    } finally {
      setLoadingBible(false);
    }
  };

  const handleBibleNavigation = async (direction: 'prev' | 'next') => {
    if (!canNavigateBible) return;

    const delta = direction === 'next' ? 1 : -1;
    const targetDay = Math.min(maxBibleDay, Math.max(1, bibleReading.day + delta));
    if (targetDay === bibleReading.day) return;

    setLoadingBible(true);
    try {
      await goToBibleDay(targetDay);
    } finally {
      setLoadingBible(false);
    }
  };

  const handleCompleteReading = async () => {
    await completeBibleDay(!bibleReading.completed);
  };

  const handleQuickAddTask = () => {
    const trimmedName = newTaskName.trim();
    if (!trimmedName) {
      setQuickAddError('Task name is required.');
      return;
    }

    if (newTaskRepeat === 'weekly' && !newTaskDate) {
      setQuickAddError('Please choose a calendar date for weekly tasks.');
      return;
    }

    if (!newTaskCustomAlarmDataUrl) {
      setQuickAddError('Upload a reminder song first. This app now uses upload-only audio for task alarms.');
      return;
    }

    const resolvedTime = buildTimeFromEditor(newTaskTimeFormat, newTaskHourInput, newTaskMinuteInput, newTaskPeriod);
    if (!resolvedTime) {
      setQuickAddError('Please enter a valid time (hour and minute).');
      return;
    }

    const baseDate = newTaskRepeat === 'weekly' ? new Date(`${newTaskDate}T00:00:00`) : new Date();
    const dueDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;

    const draftTask: Task = {
      id: `task-${Date.now()}`,
      name: trimmedName,
      layerId: newTaskLayer,
      priority: newTaskPriority,
      repeat: newTaskRepeat,
      time: resolvedTime,
      completed: false,
      date: dueDate.toISOString(),
      alarmEnabled: newTaskAlarmEnabled,
      preferredMusic: newTaskPreferredMusic || newTaskCustomAlarmName || 'Uploaded Song',
      customAlarmAudioName: newTaskCustomAlarmName || 'Uploaded Song',
      customAlarmAudioDataUrl: newTaskCustomAlarmDataUrl,
      estimatedDuration: newTaskDuration,
      durationStartedAt: new Date().toISOString(),
    };

    const due = parseTaskDueDate(draftTask);
    if (!due) {
      setQuickAddError('Could not understand this time. Please check hour/minute values.');
      return;
    }

    if (due.getTime() <= Date.now()) {
      setQuickAddError('Please choose a future time. Past times cannot be used.');
      return;
    }

    addTask(draftTask);

    // Save last used alarm song for future task creation
    if (newTaskCustomAlarmDataUrl && newTaskCustomAlarmName && user) {
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          lastAlarmSongName: newTaskCustomAlarmName,
          lastAlarmSongDataUrl: newTaskCustomAlarmDataUrl,
        },
      });
    }

    setNewTaskName('');
    setNewTaskLayer('general');
    setNewTaskPriority('C');
    setNewTaskRepeat('once');
    const rounded = getRoundedCurrentTime();
    const roundedParts = parseTimeToEditor(rounded);
    setNewTaskTime(rounded);
    setNewTaskTimeFormat('24');
    setNewTaskHourInput(roundedParts.hour24);
    setNewTaskMinuteInput(roundedParts.minute);
    setNewTaskPeriod(roundedParts.period);
    setNewTaskDate(format(new Date(), 'yyyy-MM-dd'));
    setNewTaskAlarmEnabled(true);
    const defaultAlarm = getDefaultAlarmFromPreferences();
    if (defaultAlarm) {
      setNewTaskPreferredMusic(defaultAlarm.name);
      setNewTaskCustomAlarmName(defaultAlarm.name);
      setNewTaskCustomAlarmDataUrl(defaultAlarm.dataUrl);
    } else {
      setNewTaskPreferredMusic('');
      setNewTaskCustomAlarmName('');
      setNewTaskCustomAlarmDataUrl('');
    }
    setQuickAddError('');
    setShowTemplatePicker(false);
    setEdenTemplatePool([]);
    setShowQuickAdd(false);
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Could not read audio file.'));
      reader.readAsDataURL(file);
    });
  };

  const handleReminderSongUpload = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      setQuickAddError('Please choose a valid reminder audio file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setQuickAddError('Reminder audio is too large. Use a file under 20MB.');
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    if ((dataUrl || '').length > 25 * 1024 * 1024) {
      setQuickAddError('Reminder audio is too large after encoding. Please use a shorter or more compressed file.');
      return;
    }

    setNewTaskCustomAlarmName(file.name);
    setNewTaskCustomAlarmDataUrl(dataUrl);
    setQuickAddError('');
  };

  const applyTemplateDraft = (template: EdenTemplate) => {
    setNewTaskName(template.name);
    setNewTaskLayer(template.layerId);
    setNewTaskPriority(template.priority);
    setNewTaskRepeat(template.repeat);

    const parts = parseTimeToEditor(template.time);
    setNewTaskTime(template.time);
    if (newTaskTimeFormat === '12') {
      setNewTaskHourInput(parts.hour12);
      setNewTaskPeriod(parts.period);
    } else {
      setNewTaskHourInput(parts.hour24);
    }
    setNewTaskMinuteInput(parts.minute);
  };

  const handleTaskByEdenDraft = async () => {
    setIsGeneratingTask(true);
    setQuickAddError('');

    const recommendations = getRecommendedEdenTemplates({
      tasks,
      layerId: newTaskLayer,
      intent: newTaskName,
      mostRepeated: user?.preferences.mostRepeatedTasks?.map((entry) => ({
        name: entry.name,
        layerId: entry.layerId,
        count: entry.count,
      })),
      limit: 18,
    });

    if (recommendations.length > 0) {
      setEdenTemplatePool(recommendations);
      setShowTemplatePicker(true);
    } else {
      setShowTemplatePicker(false);
      setQuickAddError('No strong template match yet. You can keep typing or add the task manually.');
    }

    const suggestion = await suggestTaskWithGemini({
      userName: user?.name,
      layer: newTaskLayer,
      priority: newTaskPriority,
      preferredTime: newTaskTime,
      intent: newTaskName || 'help me create one meaningful task for today',
      userPreferences: {
        favoriteMusicName: favoriteFocusTrack?.name,
      },
    });

    if (!suggestion) {
      if (recommendations.length === 0) {
        setQuickAddError('Task by Eden is unavailable right now. Try again.');
      }
      setIsGeneratingTask(false);
      return;
    }

    setQuickAddError('');
    setNewTaskName(suggestion.name || newTaskName);
    const normalizedTime = parseAnyTimeTo24(suggestion.time || newTaskTime);
    if (normalizedTime) {
      const parts = parseTimeToEditor(normalizedTime);
      setNewTaskTime(normalizedTime);
      if (newTaskTimeFormat === '12') {
        setNewTaskHourInput(parts.hour12);
        setNewTaskPeriod(parts.period);
      } else {
        setNewTaskHourInput(parts.hour24);
      }
      setNewTaskMinuteInput(parts.minute);
    }
    setNewTaskPreferredMusic(favoriteFocusTrack?.name || suggestion.preferredMusic || newTaskPreferredMusic);
    if (favoriteFocusTrack && suggestion.preferredMusic === favoriteFocusTrack.name) {
      setNewTaskCustomAlarmName(favoriteFocusTrack.name);
      setNewTaskCustomAlarmDataUrl(favoriteFocusTrack.dataUrl);
    }
    setIsGeneratingTask(false);
  };

  useEffect(() => {
    const normalized = buildTimeFromEditor(newTaskTimeFormat, newTaskHourInput, newTaskMinuteInput, newTaskPeriod);
    if (normalized) {
      setNewTaskTime(normalized);
    }
  }, [newTaskTimeFormat, newTaskHourInput, newTaskMinuteInput, newTaskPeriod]);

  useEffect(() => {
    const parts = parseTimeToEditor(newTaskTime);
    if (newTaskTimeFormat === '12') {
      setNewTaskHourInput(parts.hour12);
      setNewTaskPeriod(parts.period);
      return;
    }

    setNewTaskHourInput(parts.hour24);
  }, [newTaskTimeFormat]);

  const handleInstallApp = async () => {
    if (!installPromptEvent) return;

    installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;
    if (choice?.outcome === 'accepted') {
      setShowInstallSuggestion(false);
    }
    setInstallPromptEvent(null);
  };

  const pillarMeta: Record<string, { icon: string; iconClass: string; bgClass: string; strokeClass: string }> = {
    spiritual: {
      icon: 'church',
      iconClass: 'text-[var(--color-spiritual)]',
      bgClass: 'bg-[color:rgba(122,101,80,0.12)]',
      strokeClass: 'stroke-[var(--color-spiritual)]',
    },
    academic: {
      icon: 'school',
      iconClass: 'text-[var(--color-academic)]',
      bgClass: 'bg-[color:rgba(77,107,74,0.12)]',
      strokeClass: 'stroke-[var(--color-academic)]',
    },
    financial: {
      icon: 'payments',
      iconClass: 'text-[var(--color-financial)]',
      bgClass: 'bg-[color:rgba(74,93,107,0.12)]',
      strokeClass: 'stroke-[var(--color-financial)]',
    },
    physical: {
      icon: 'fitness_center',
      iconClass: 'text-[var(--color-physical)]',
      bgClass: 'bg-[color:rgba(140,60,60,0.12)]',
      strokeClass: 'stroke-[var(--color-physical)]',
    },
    general: {
      icon: 'grid_view',
      iconClass: 'text-[var(--color-general)]',
      bgClass: 'bg-[color:rgba(92,74,107,0.12)]',
      strokeClass: 'stroke-[var(--color-general)]',
    },
  };

  const openLayerFromHome = (layerId: LayerId) => {
    window.dispatchEvent(new CustomEvent('edenify:navigate', {
      detail: {
        tab: 'layers',
        layerId,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-surface pb-24">
      {!isSubPageOpen && (
      <header className="fixed top-0 left-0 right-0 z-50 h-[62px] bg-[#fef9f2]/92 dark:bg-background/92 backdrop-blur-xl border-b border-outline-variant/25">
        <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container shadow-sm ring-1 ring-white/60">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {user?.name?.[0] || 'U'}
                </div>
              )}
            </div>
            <div className="leading-tight -space-y-0.5">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary/55">Good day</p>
              <p className="text-sm sm:text-base font-serif font-medium tracking-[-0.02em] text-on-surface">{user?.name || 'User'}</p>
            </div>
          </div>

          <button
            aria-label="Notifications"
            title="Notifications"
            onClick={toggleNotifications}
            className="relative h-10 w-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[20px]">{notificationsEnabled ? 'notifications_active' : 'notifications_off'}</span>
            <span className={cn('absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full', notificationsEnabled ? 'bg-emerald-500' : 'bg-outline')} />
          </button>
        </div>
      </header>
      )}

      {!isSubPageOpen && (
      <main className="pt-[82px] px-4 sm:px-6 lg:px-8 w-full space-y-7">
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 px-1">
          <p className="font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-bold">{formattedDate}</p>
          <h1 className="display-text text-[2.6rem] sm:text-5xl font-medium tracking-[-0.04em] leading-[0.98] text-on-surface max-w-[12ch]">Good day, {user?.name || 'there'}.</h1>
          {notificationStatus && <p className="text-[11px] text-primary font-semibold">{notificationStatus}</p>}
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/35">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-outline-variant/30">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="font-label text-[10px] font-bold uppercase tracking-widest text-primary-container mb-2">Today's Task Progression</p>
                  <h2 className="display-text text-2xl text-on-surface">{taskStats.completed} of {taskStats.total} tasks</h2>
                </div>
                <p className="display-text text-4xl text-primary">{taskStats.percentage}%</p>
              </div>

              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${taskStats.percentage}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-primary to-primary-container" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-label text-[10px] uppercase tracking-[0.14em] text-outline font-bold">Daily</p>
                    <p className="font-label text-[10px] uppercase tracking-[0.14em] text-primary font-bold">{dailyCompleted}/{dailyTasks.length}</p>
                  </div>
                  <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${dailyPercent}%` }} transition={{ duration: 0.7 }} className="h-full bg-primary" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-label text-[10px] uppercase tracking-[0.14em] text-outline font-bold">Weekly</p>
                    <p className="font-label text-[10px] uppercase tracking-[0.14em] text-primary font-bold">{onceCompleted}/{weeklyTasks.length}</p>
                  </div>
                  <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${oncePercent}%` }} transition={{ duration: 0.7 }} className="h-full bg-primary-container" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-label text-[10px] uppercase tracking-[0.14em] text-red-500 font-bold">Failure</p>
                  <p className="font-label text-[10px] uppercase tracking-[0.14em] text-red-500 font-bold">{failedTaskIds.size}/{Math.max(1, todaysTasks.length)}</p>
                </div>
                <div className="h-1 bg-red-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (failedTaskIds.size / Math.max(1, todaysTasks.length)) * 100)}%` }}
                    transition={{ duration: 0.7 }}
                    className="h-full bg-red-500"
                  />
                </div>
              </div>

            </div>

            <div className="p-6 sm:p-7 text-left bg-surface-container-lowest rounded-2xl">
              <BibleReadingUI
                currentDay={bibleReading.day || 1}
                completedToday={bibleReading.completed || false}
                onToggleComplete={(completed) => {
                  completeBibleDay(completed);
                }}
                onReadMore={() => {
                  setShowScripturePage(true);
                }}
                isProgressionEnforced={true}
              />
            </div>
          </div>
        </motion.section>

          <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-container-low p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-[#7a6550]" />
          <p className="font-label text-[10px] font-bold tracking-[0.15em] text-[#7a6550] uppercase mb-3">AI Insight</p>
          <p className="serif-text text-base text-on-surface-variant leading-snug italic">
            {loadingInsight ? 'Eden is reflecting...' : `"${insight}"`}
          </p>
        </motion.section>

        {priorityTask && (
          <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-[0_10px_28px_rgba(44,33,24,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-container" />
            <div className="flex justify-between items-start mb-4">
              <p className="font-label text-[10px] uppercase tracking-widest text-primary-container font-bold">Today's Priority</p>
              <p className="font-label text-[11px] text-outline">{priorityTask.time}</p>
            </div>
            <h3 className="display-text text-2xl text-on-surface">{priorityTask.name}</h3>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-outline-variant/30" />
              <button onClick={() => toggleTask(priorityTask.id)} className="text-primary font-label text-xs uppercase tracking-[0.14em] font-bold hover:opacity-70">Start now</button>
            </div>
          </motion.section>
        )}

        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-between bg-surface-container-highest/30 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Timer size={18} className="text-primary" />
            <span className="font-label font-bold text-sm text-on-surface">Focus Session</span>
          </div>
          <button onClick={() => setShowFocusPage(true)} className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-2 rounded-full font-label text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95">Open</button>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {layers.map((layer, index) => {
            const layerTasksToday = todaysTasks.filter((task) => task.layerId === layer.id);
            const createdCount = layerTasksToday.length;
            const doneCount = layerTasksToday.filter((task) => isTaskCompletedForToday(task)).length;
            const progress = createdCount > 0 ? Math.round((doneCount / createdCount) * 100) : Math.round(getProgress(layer.xp, layer.maxXp));
            const radius = 30;
            const circumference = 2 * Math.PI * radius;
            const dashOffset = circumference - (progress / 100) * circumference;
            const meta = pillarMeta[layer.id] || pillarMeta.general;

            return (
              <motion.button
                key={layer.id}
                type="button"
                onClick={() => openLayerFromHome(layer.id)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.38 + index * 0.04 }}
                className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/25 aspect-square flex flex-col justify-between text-left hover:border-primary/35 transition-colors"
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', meta.bgClass)}>
                  <span className={cn('material-symbols-outlined text-lg', meta.iconClass)}>{meta.icon}</span>
                </div>

                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.14em] text-outline font-bold mb-2">{layer.name}</p>
                  <div className="relative w-[80%] aspect-square min-w-[82px] max-w-[150px] mx-auto">
                    <svg viewBox="0 0 80 80" className="w-full h-full">
                      <circle cx="40" cy="40" r={radius} className="fill-none stroke-outline-variant/35" strokeWidth="7" />
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        className={cn('fill-none transition-all duration-700', meta.strokeClass)}
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-label text-[clamp(11px,1.7vw,14px)] font-bold text-on-surface">{progress}%</span>
                    </div>
                  </div>
                  <p className="mt-1 font-label text-[9px] uppercase tracking-[0.12em] text-secondary/70 font-bold">{doneCount}/{createdCount} done</p>
                </div>
              </motion.button>
            );
          })}
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-5 pb-12">
          <div className="flex items-center justify-between">
            <h2 className="display-text text-2xl text-on-surface">Today's Tasks</h2>
            <p className="font-label text-[10px] uppercase tracking-[0.14em] text-outline font-bold">Hour + Layer</p>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sortedTodayTasks.slice(0, 20).map((task, index) => {
                const layer = layers.find((l) => l.id === task.layerId);
                const failed = failedTaskIds.has(task.id);
                const completed = isTaskCompletedForToday(task);
                return (
                  <motion.div
                    key={task.id}
                    id={getTaskCardDomId(task.id)}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      'rounded-xl border px-4 py-3 flex items-center gap-3 bg-surface-container-lowest',
                      completed ? 'opacity-60 border-transparent bg-surface-container-low' : 'border-outline-variant/35',
                      failed && !completed ? 'border-red-300 bg-red-50/70' : '',
                      focusedTaskId === task.id ? 'ring-2 ring-primary border-primary/60 shadow-[0_0_0_3px_rgba(150,68,7,0.15)]' : ''
                    )}
                  >
                    <button aria-label={`Toggle task ${task.name}`} title="Toggle task" onClick={() => toggleTask(task.id)} className={cn('transition-colors', completed ? 'text-primary' : 'text-secondary/35 hover:text-primary')}>
                      {completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className={cn('text-sm font-medium text-on-surface truncate', completed && 'line-through text-secondary')}>{task.name}</p>
                      <p className={cn('font-label text-[10px] uppercase tracking-[0.14em] font-bold mt-1', failed && !completed ? 'text-red-600' : 'text-outline')}>
                        {layer?.name || 'General'} • {task.time}{failed && !completed ? ' • Failed (duration passed)' : ''}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={`Delete task ${task.name}`}
                      title="Delete task"
                      onClick={() => deleteTask(task.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-md border border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>
      )}

      {!isSubPageOpen && (
      <button
        aria-label="Quick add task"
        title="Quick add task"
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-24 right-6 z-[60] h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-[0_12px_32px_rgba(150,68,7,0.3)] flex items-center justify-center transition-transform active:scale-95"
      >
        <Plus size={24} />
      </button>
      )}

      <AnimatePresence>
        {showScripturePage && (
          <motion.div ref={scripturePageRef} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="min-h-screen bg-surface overflow-y-auto no-scrollbar pb-24">
            {isScriptureFullscreen && (
              <div
                className="fixed left-0 right-0 z-40 px-3 pointer-events-none top-[env(safe-area-inset-top)]"
              >
                <div className="max-w-4xl mx-auto pt-2 flex items-center justify-between pointer-events-auto">
                  <button
                    aria-label="Back to home"
                    title="Back"
                    onClick={closeScripturePage}
                    className="h-11 w-11 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur-sm"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    aria-label="Exit fullscreen"
                    title="Exit fullscreen"
                    onClick={toggleScriptureFullscreen}
                    className="h-11 w-11 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur-sm"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            <header className="sticky top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/15">
              <div className="min-h-16 max-w-4xl mx-auto px-4 sm:px-6 pt-[max(0.25rem,env(safe-area-inset-top))] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button aria-label="Close scripture page" title="Back" onClick={closeScripturePage} className="h-10 w-10 rounded-full hover:bg-surface-container-low text-primary flex items-center justify-center transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h1 className="text-lg font-serif text-on-surface">Day {bibleReading.day} of {bibleReading.totalDays}</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-primary bg-primary/10 rounded-full px-2 py-1">Current: {bibleReading.day}</span>
                      <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-secondary bg-surface-container-low rounded-full px-2 py-1">Highest: {bibleReading.highestCompletedDay}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label={isScriptureFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    title={isScriptureFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    onClick={toggleScriptureFullscreen}
                    className="h-10 w-10 rounded-full hover:bg-surface-container-low text-primary flex items-center justify-center transition-colors"
                  >
                    {isScriptureFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button
                    aria-label="Previous scripture"
                    title="Previous"
                    disabled={!canNavigateBible || bibleReading.day <= 1 || loadingBible}
                    onClick={() => handleBibleNavigation('prev')}
                    className="h-10 w-10 rounded-full hover:bg-surface-container-low text-primary flex items-center justify-center transition-colors disabled:opacity-40"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button aria-label="Refresh reading" title="Refresh reading" onClick={handleRefreshBible} className="h-10 w-10 rounded-full hover:bg-surface-container-low text-primary flex items-center justify-center transition-colors">
                    {loadingBible ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  </button>
                  <button
                    aria-label={isReadingScriptureAloud ? 'Stop reading aloud' : 'Read scripture aloud'}
                    title={isReadingScriptureAloud ? 'Stop reading aloud' : 'Read aloud'}
                    onClick={isReadingScriptureAloud ? stopScriptureReading : readScriptureAloud}
                    className="h-10 w-10 rounded-full hover:bg-surface-container-low text-primary flex items-center justify-center transition-colors"
                  >
                    {isReadingScriptureAloud ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    aria-label="Next day reading"
                    title="Next day"
                    disabled={!canNavigateBible || bibleReading.day >= maxBibleDay || loadingBible}
                    onClick={() => handleBibleNavigation('next')}
                    className="h-10 w-10 rounded-full hover:bg-surface-container-low text-primary flex items-center justify-center transition-colors disabled:opacity-40"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 space-y-10">
              <section>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Read More</p>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-on-surface tracking-tight">{activeScriptureLabel}</h2>
                  {scripturePages.length > 1 && (
                    <p className="text-xs text-secondary uppercase tracking-[0.14em] font-bold">Passage {scripturePageIndex + 1} of {scripturePages.length}</p>
                  )}
                </div>
              </section>

              <section className="space-y-7 max-w-2xl">
                {loadingScriptureText && <p className="text-sm text-on-surface-variant">Loading chapter text from ASV database...</p>}

                {!loadingScriptureText && scripturePages.length === 0 && (
                  <p className="text-base leading-7 text-on-surface-variant dark:text-on-surface">
                    <span className="text-primary font-semibold mr-2">1</span>
                    {bibleReading.text}
                  </p>
                )}

                {!loadingScriptureText && scripturePages.length > 0 && (
                  <div className="space-y-6">
                    <p className="text-xs uppercase tracking-[0.14em] font-bold text-primary">{activeScriptureLabel}</p>
                    {activeScripturePage.map((verse, index) => {
                      const prev = index > 0 ? activeScripturePage[index - 1] : null;
                      const showChapterTitle = !prev || prev.bookName !== verse.bookName || prev.chapter !== verse.chapter;

                      return (
                        <div key={`${verse.bookName}-${verse.chapter}-${verse.verse}`} className="space-y-2">
                          {showChapterTitle && (
                            <p className="text-xs uppercase tracking-[0.14em] font-bold text-primary">{verse.bookName} {verse.chapter}</p>
                          )}
                          <p className="text-base leading-7 text-on-surface-variant dark:text-on-surface">
                            <span className="text-primary font-semibold mr-2">{verse.verse}</span>
                            {verse.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {scripturePages.length > 1 && (
                  <section className="max-w-2xl pt-8">
                    <div className="flex items-center justify-between gap-3 border-t border-outline-variant/25 pt-6">
                      <button
                        type="button"
                        onClick={() => setScripturePageIndex((prev) => Math.max(0, prev - 1))}
                        disabled={scripturePageIndex <= 0}
                        className="px-4 py-2 rounded-full bg-surface-container-low text-primary text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-40"
                      >
                        Keep Reading Left
                      </button>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">{scripturePageIndex + 1}/{scripturePages.length}</p>
                      <button
                        type="button"
                        onClick={() => setScripturePageIndex((prev) => Math.min(scripturePages.length - 1, prev + 1))}
                        disabled={scripturePageIndex >= scripturePages.length - 1}
                        className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-40"
                      >
                        Keep Reading Right
                      </button>
                    </div>
                  </section>
                )}
              </section>

              <section className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 sm:p-8 max-w-2xl">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-primary">Eden Insight</p>
                  <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
                    {readingSuggestion || 'Reflect on one practical action you will take today from this reading.'}
                  </p>
                </div>
              </section>

            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFocusPage && (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }}>
            <Focus user={user} setUser={setUser} onClose={() => setShowFocusPage(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQuickAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickAdd(false)}
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-surface-container-low border border-outline-variant/25 shadow-[0_20px_50px_rgba(44,33,24,0.08)] p-5 sm:p-6 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-[0.16em] text-outline font-bold">Quick Add Task</p>
                    <h3 className="display-text text-2xl text-on-surface mt-1">Create a task without the noise</h3>
                  </div>
                  <button
                    aria-label="Close quick add"
                    title="Close"
                    onClick={() => setShowQuickAdd(false)}
                    className="h-9 w-9 rounded-full bg-surface-container-low text-primary flex items-center justify-center border border-outline-variant/30"
                  >
                    <ArrowLeft size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {quickAddError && <p className="text-xs text-red-600">{quickAddError}</p>}

                  <div>
                    <label className="font-label text-[10px] uppercase tracking-[0.16em] text-outline font-bold block mb-2">Task Name</label>
                    <input
                      aria-label="Task name"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      placeholder="Write one clear task"
                      className="w-full rounded-xl border border-outline-variant/45 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
                    />
                    {realtimeTemplateSuggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {realtimeTemplateSuggestions.map((template, index) => (
                          <button
                            key={`${template.layerId}-${template.name}-rt-${index}`}
                            type="button"
                            onClick={() => applyTemplateDraft(template)}
                            className="px-2.5 py-1.5 rounded-full border border-outline-variant/35 bg-surface-container-lowest text-[10px] font-bold uppercase tracking-[0.1em] text-secondary hover:text-primary hover:border-primary/40"
                          >
                            {template.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-label text-[10px] uppercase tracking-[0.16em] text-outline font-bold block mb-2">Layer</label>
                      <select
                        aria-label="Task layer"
                        value={newTaskLayer}
                        onChange={(e) => setNewTaskLayer(e.target.value as LayerId)}
                        className="w-full rounded-xl border border-outline-variant/45 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
                      >
                        <option value="spiritual">Spiritual</option>
                        <option value="academic">Academic</option>
                        <option value="financial">Financial</option>
                        <option value="physical">Physical</option>
                        <option value="general">General</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-label text-[10px] uppercase tracking-[0.16em] text-outline font-bold block mb-2">Priority</label>
                      <select
                        aria-label="Task priority"
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as 'A' | 'B' | 'C' | 'D' | 'E')}
                        className="w-full rounded-xl border border-outline-variant/45 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-label text-[10px] uppercase tracking-[0.16em] text-outline font-bold block mb-2">Time</label>
                      <div className="space-y-2 rounded-xl border border-outline-variant/45 bg-surface-container-low p-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setNewTaskTimeFormat('24')}
                            className={cn(
                              'px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] border transition-colors',
                              newTaskTimeFormat === '24'
                                ? 'bg-primary text-white border-primary'
                                : 'bg-surface-container-lowest text-secondary border-outline-variant/40'
                            )}
                          >
                            24H
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewTaskTimeFormat('12')}
                            className={cn(
                              'px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] border transition-colors',
                              newTaskTimeFormat === '12'
                                ? 'bg-primary text-white border-primary'
                                : 'bg-surface-container-lowest text-secondary border-outline-variant/40'
                            )}
                          >
                            12H
                          </button>
                        </div>

                        <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                          <input
                            aria-label="Task hour"
                            inputMode="numeric"
                            value={newTaskHourInput}
                            onChange={(e) => setNewTaskHourInput(e.target.value.replace(/\D/g, '').slice(0, 2))}
                            placeholder={newTaskTimeFormat === '24' ? '00-23' : '01-12'}
                            className="w-full rounded-lg border border-outline-variant/45 bg-surface-container-lowest px-2 py-1.5 text-center text-sm text-on-surface"
                          />
                          <span className="text-sm font-bold text-secondary">:</span>
                          <input
                            aria-label="Task minute"
                            inputMode="numeric"
                            value={newTaskMinuteInput}
                            onChange={(e) => setNewTaskMinuteInput(e.target.value.replace(/\D/g, '').slice(0, 2))}
                            placeholder="00-59"
                            className="w-full rounded-lg border border-outline-variant/45 bg-surface-container-lowest px-2 py-1.5 text-center text-sm text-on-surface"
                          />
                          {newTaskTimeFormat === '12' ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setNewTaskPeriod('AM')}
                                className={cn(
                                  'px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.12em] border',
                                  newTaskPeriod === 'AM'
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-surface-container-lowest text-secondary border-outline-variant/40'
                                )}
                              >
                                AM
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewTaskPeriod('PM')}
                                className={cn(
                                  'px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.12em] border',
                                  newTaskPeriod === 'PM'
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-surface-container-lowest text-secondary border-outline-variant/40'
                                )}
                              >
                                PM
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">24H</span>
                          )}
                        </div>

                        <p className="text-[10px] text-secondary">Saved time: {newTaskTime}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-label text-[10px] uppercase tracking-[0.16em] text-outline font-bold block mb-2">Repeat</label>
                    <select
                      aria-label="Task repeat"
                      value={newTaskRepeat}
                      onChange={(e) => setNewTaskRepeat(e.target.value as 'once' | 'daily' | 'weekly')}
                      className="w-full rounded-xl border border-outline-variant/45 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
                    >
                      <option value="once">Once</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-label text-[10px] uppercase tracking-[0.16em] text-outline font-bold block mb-2">Duration (Minutes)</label>
                    <input
                      type="number"
                      min="5"
                      max="300"
                      value={newTaskDuration}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 5 && val <= 300) setNewTaskDuration(val);
                      }}
                      className="w-full rounded-xl border border-outline-variant/45 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
                      title="Set task duration (5-300 minutes)"
                    />
                    <p className="text-xs text-secondary mt-1">Task will be marked as failed if not completed within this time</p>
                  </div>

                  {newTaskRepeat === 'weekly' && (
                    <div>
                      <label className="font-label text-[10px] uppercase tracking-[0.16em] text-outline font-bold block mb-2">Calendar Day</label>
                      <input
                        type="date"
                        aria-label="Task calendar date"
                        value={newTaskDate}
                        onChange={(e) => setNewTaskDate(e.target.value)}
                        className="w-full rounded-xl border border-outline-variant/45 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
                      />
                    </div>
                  )}

                  <div className="rounded-2xl border border-outline-variant/35 bg-surface-container-lowest p-4 space-y-3">
                    <label className="font-label text-[10px] uppercase tracking-[0.16em] text-outline font-bold block">Reminder Song (Upload Only)</label>
                    {mediaPermissionGranted === false ? (
                      <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                        <p className="text-xs text-red-700 font-semibold">Media access denied</p>
                        <p className="text-xs text-red-600 mt-1">Please enable media/file permissions in your browser settings to upload songs.</p>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => audioFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-full bg-surface-container-low text-primary text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-surface-container-high transition-colors active:scale-95"
                        >
                          Upload song
                        </button>
                        <input
                          ref={audioFileInputRef}
                          type="file"
                          accept="audio/*"
                          title="Upload reminder song"
                          onChange={(e) => handleReminderSongUpload(e.target.files?.[0])}
                          className="hidden"
                          disabled={mediaPermissionGranted !== true}
                        />
                        {newTaskCustomAlarmName ? (
                          <p className="text-xs text-on-surface-variant">Selected: {newTaskCustomAlarmName}</p>
                        ) : (
                          <p className="text-xs text-secondary">No upload yet. Upload a song to enable task alarm audio.</p>
                        )}
                      </>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={previewUploadedReminder}
                        className="px-3 py-1.5 rounded-full bg-surface-container-low text-primary text-[11px] font-bold uppercase tracking-[0.14em]"
                      >
                        Preview Upload
                      </button>
                      {isTaskPreviewPlaying && (
                        <button
                          type="button"
                          onClick={stopTaskPreview}
                          className="px-3 py-1.5 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-[0.14em]"
                        >
                          Stop Preview
                        </button>
                      )}
                    </div>
                  </div>

                  <label className="flex items-center justify-between rounded-xl border border-outline-variant/35 bg-surface-container-lowest px-3 py-2">
                    <span className="text-sm text-on-surface">Enable aggressive alarm reminder</span>
                    <button
                      type="button"
                      aria-label="Toggle alarm"
                      onClick={() => setNewTaskAlarmEnabled((prev) => !prev)}
                      className={cn(
                        'h-8 w-14 rounded-full relative transition-all duration-300 border',
                        newTaskAlarmEnabled
                          ? 'bg-gradient-to-r from-primary to-primary-container border-primary/40 shadow-[0_8px_20px_rgba(150,68,7,0.25)]'
                          : 'bg-surface-container-low border-outline-variant/60'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center',
                          newTaskAlarmEnabled ? 'translate-x-7' : 'translate-x-1'
                        )}
                      >
                        <span className={cn('h-2 w-2 rounded-full', newTaskAlarmEnabled ? 'bg-primary' : 'bg-outline')} />
                      </span>
                    </button>
                  </label>

                  <button
                    onClick={handleTaskByEdenDraft}
                    disabled={isGeneratingTask}
                    className="w-full rounded-full px-4 py-2 border border-primary/40 text-primary font-label text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isGeneratingTask ? <Loader2 size={14} className="animate-spin" /> : <WandSparkles size={14} />}
                    {isGeneratingTask ? 'Preparing task by Eden...' : 'Task by Eden'}
                  </button>

                  <div className="rounded-xl border border-outline-variant/35 bg-surface-container-lowest px-3 py-2">
                    <p className="text-[11px] text-on-surface-variant">
                      Task by Eden includes {EDEN_TEMPLATE_COUNT}+ templates across all 5 layers.
                    </p>
                    {showTemplatePicker && edenTemplatePool.length > 0 && (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {edenTemplatePool.map((template, index) => (
                          <button
                            key={`${template.layerId}-${template.name}-${index}`}
                            type="button"
                            onClick={() => applyTemplateDraft(template)}
                            className="text-left rounded-lg border border-outline-variant/35 px-2 py-2 bg-surface-container-low hover:bg-surface-container-high"
                          >
                            <p className="text-xs font-semibold text-on-surface truncate">{template.name}</p>
                            <p className="text-[10px] text-secondary uppercase tracking-[0.1em] mt-1">
                              {template.layerId} • {template.time} • {template.repeat}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => setShowQuickAdd(false)}
                      className="flex-1 rounded-full px-4 py-2 bg-surface-container-low text-secondary font-label text-xs font-bold uppercase tracking-[0.14em]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleQuickAddTask}
                      className="flex-1 rounded-full px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-white font-label text-xs font-bold uppercase tracking-[0.14em]"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstallSuggestion && !isSubPageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="w-full max-w-md bg-surface rounded-3xl border border-outline-variant/35 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.15em] text-primary font-bold">Install Edenify</p>
                  <h3 className="display-text text-2xl text-on-surface mt-1">Add app to your home screen</h3>
                </div>
                <button
                  onClick={() => setShowInstallSuggestion(false)}
                  className="h-9 w-9 rounded-full bg-surface-container-low text-primary flex items-center justify-center"
                  aria-label="Close install prompt"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-on-surface-variant">Install for faster startup, offline support, and native app feel on mobile.</p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setShowInstallSuggestion(false)}
                  className="flex-1 px-4 py-2 rounded-full bg-surface-container-low text-secondary font-label text-xs font-bold uppercase tracking-[0.14em]"
                >
                  Later
                </button>
                <button
                  onClick={handleInstallApp}
                  className="flex-1 px-4 py-2 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-label text-xs font-bold uppercase tracking-[0.14em]"
                >
                  Install Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {alarmOpen && alarmTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[#2a1e14]/92 backdrop-blur-md flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.98 }}
              className="w-full max-w-lg rounded-3xl border border-white/20 bg-[#fff7ec] p-6 text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center text-primary mb-4">
                <BellRing size={24} />
              </div>
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-primary font-bold">Alarm Active</p>
              <h3 className="display-text text-3xl text-on-surface mt-2">{alarmTask.name}</h3>
              <p className="mt-3 text-sm text-on-surface-variant">{alarmTask.time} • {alarmTask.preferredMusic || 'Uploaded Song'}</p>
              <p className="mt-2 text-xs text-secondary">Reminder is sent 5 minutes early. Alarm stays visible across the app and can be snoozed, entered, or skipped.</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={snoozeActiveAlarm}
                  className="rounded-full px-4 py-3 bg-surface-container-low text-primary font-label text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2"
                >
                  <SkipForward size={14} />
                  Postpone 10m
                </button>
                <button
                  onClick={enterActiveAlarm}
                  className="rounded-full px-4 py-3 bg-primary text-white font-label text-xs font-bold uppercase tracking-[0.14em]"
                >
                  Enter Edenify
                </button>
                <button
                  onClick={skipActiveAlarm}
                  className="rounded-full px-4 py-3 border border-outline-variant/35 text-secondary font-label text-xs font-bold uppercase tracking-[0.14em]"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
