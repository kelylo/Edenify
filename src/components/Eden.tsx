import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../AppContext';
import {
  Send,
  Sparkles,
  User,
  Loader2,
  Plus,
  Check,
  X,
  ThumbsUp,
  ThumbsDown,
  Undo2,
  Copy,
  Layers,
  Repeat,
  CheckCircle2,
  Mic,
  StopCircle,
  PanelRightClose,
  PanelRightOpen,
  History,
  BookOpen,
} from 'lucide-react';
import {
  chatWithEden,
  initializeEdenAgent,
  maybeProactiveMessage,
  remember,
  recall,
  updateProfile,
  getProfile,
  logConversation,
  getRecentConversations,
  recordFeedback,
  getDailyBibleReading,
  type UserProfile,
} from '../services/eden-agent';
import { motion, AnimatePresence } from 'motion/react';
import { cn, parseTaskDueDate } from '../lib/utils';
import { LayerId, Task, Habit } from '../types';

type TaskFlowMode = 'create' | 'delete';
interface TaskFlowState {
  mode: TaskFlowMode;
  step: 'name' | 'time' | 'repeat' | 'layer' | 'priority' | 'confirm' | 'select';
  draft: Partial<Task>;
  taskIds?: string[];
}

interface Suggestion {
  id: string;
  text: string;
  action: () => void;
  icon?: React.ReactNode;
}

interface UndoAction {
  type: 'task';
  undo: () => void;
  description: string;
}

const INTRO_MESSAGE =
  'Greetings, Kevin. I am Eden, your companion in this journey of growth. How can I help today? I can guide your Spiritual, Academic, Financial, Physical, and General layers, and I can create, edit, complete, or delete tasks for you right here.';

const defaultAlarmSound = 'Aggressive Bell';
const defaultPreferredMusic = 'Instrumental Warmth';

const formatTimeDisplay = (time: string) => {
  const m = time.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);
  if (!m) return time;
  const h24 = Number(m[1]);
  const min = m[2];
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${min} ${period}`;
};

const parseNaturalDate = (text: string, baseDate: Date = new Date()): Date | null => {
  const lower = text.toLowerCase();
  const now = new Date(baseDate);
  now.setHours(0, 0, 0, 0);

  if (/\btoday\b/.test(lower)) return now;
  if (/\bday after tomorrow\b/.test(lower)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 2);
    return d;
  }
  if (/\btomorrow\b/.test(lower)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return d;
  }

  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < weekdays.length; i += 1) {
    const regex = new RegExp(`\\b(next\\s+)?${weekdays[i]}\\b`, 'i');
    if (regex.test(lower)) {
      const result = new Date(baseDate);
      const currentDay = baseDate.getDay();
      let delta = i - currentDay;
      if (delta <= 0) delta += 7;
      result.setDate(result.getDate() + delta);
      return result;
    }
  }

  const iso = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (iso) {
    const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    if (!Number.isNaN(d.getTime())) return d;
  }

  return null;
};

const parseTimeFromText = (text: string): string | null => {
  const match12 = text.match(/\b(\d{1,2}):(\d{2})\s?(AM|PM)\b/i);
  if (match12) {
    let h = Number(match12[1]);
    const m = Number(match12[2]);
    const p = match12[3].toUpperCase();
    if (p === 'PM' && h !== 12) h += 12;
    if (p === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  const match24 = text.match(/\b([0-1]?\d|2[0-3]):([0-5]\d)\b/);
  if (match24) return `${String(Number(match24[1])).padStart(2, '0')}:${match24[2]}`;

  if (/\bnoon\b/i.test(text)) return '12:00';
  if (/\bmidnight\b/i.test(text)) return '00:00';

  const compact = text.match(/\b(\d{1,2})\s?(am|pm)\b/i);
  if (compact) {
    let h = Number(compact[1]);
    if (compact[2].toLowerCase() === 'pm' && h !== 12) h += 12;
    if (compact[2].toLowerCase() === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:00`;
  }

  return null;
};

const parseCombinedDateTime = (text: string): { date?: Date; time?: string } | null => {
  const date = parseNaturalDate(text);
  const time = parseTimeFromText(text);
  if (!date && !time) return null;
  return { date: date || undefined, time: time || undefined };
};

const Eden: React.FC = () => {
  const { user, tasks, habits, addTask, toggleTask, updateTask, deleteTask, addHabit, toggleHabit } = useApp();

  const favoriteFocusTrack = React.useMemo(() => {
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

  const preferredAlarmSound = user?.preferences.focusAlarmSound || defaultAlarmSound;
  const preferredTaskMusic = favoriteFocusTrack?.name || defaultPreferredMusic;

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; text: string; id: string; timestamp: Date; feedback?: 'helpful' | 'unhelpful' }>>([
    { role: 'model', text: INTRO_MESSAGE, id: 'intro', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [taskFlow, setTaskFlow] = useState<TaskFlowState | null>(null);
  const [inputPlaceholder, setInputPlaceholder] = useState('Reflect with Eden... (Enter to send, Shift+Enter for new line)');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showProactive, setShowProactive] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [agentProfile, setAgentProfile] = useState<UserProfile | null>(null);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const proactiveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addModelMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { role: 'model', text, id: `msg-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`, timestamp: new Date() }]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { role: 'user', text, id: `msg-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`, timestamp: new Date() }]);
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEdenAgent();
      const prof = await getProfile();
      setAgentProfile(prof);
      const recent = await getRecentConversations(10);
      setConversationHistory(recent);

      const msg = await maybeProactiveMessage();
      if (msg) setShowProactive(msg);

      const savedName = await recall<string>('preferredName');
      if (savedName && !prof.preferredName) {
        const updated = await updateProfile({ preferredName: savedName });
        setAgentProfile(updated);
      }
    };

    void init();
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    const area = textAreaRef.current;
    if (!area) return;
    const wasEmpty = input.trim().length === 0;
    const backup = area.placeholder;
    if (wasEmpty) area.placeholder = '';
    area.style.height = '0px';
    area.style.height = `${Math.min(160, area.scrollHeight)}px`;
    if (wasEmpty) area.placeholder = backup;
  }, [input]);

  useEffect(() => {
    const updatePlaceholderResponsive = () => {
      const w = window.innerWidth;
      if (w <= 430) setInputPlaceholder('Message Eden...');
      else if (w <= 768) setInputPlaceholder('Message Eden... (Enter to send)');
      else setInputPlaceholder('Reflect with Eden... (Enter to send, Shift+Enter for new line)');
    };
    updatePlaceholderResponsive();
    window.addEventListener('resize', updatePlaceholderResponsive);
    return () => window.removeEventListener('resize', updatePlaceholderResponsive);
  }, []);

  useEffect(() => {
    proactiveTimerRef.current = setInterval(async () => {
      const msg = await maybeProactiveMessage();
      if (msg && !showProactive) setShowProactive(msg);
    }, 30 * 60 * 1000);

    return () => {
      if (proactiveTimerRef.current) clearInterval(proactiveTimerRef.current);
    };
  }, [showProactive]);

  useEffect(() => {
    const SpeechRecognitionApi = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionApi) return;

    recognitionRef.current = new SpeechRecognitionApi();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || '';
      setInput((prev) => `${prev} ${transcript}`.trim());
    };
    recognitionRef.current.onend = () => setIsListening(false);
  }, []);

  useEffect(() => {
    if (!input.trim() || input.length < 3) {
      setSuggestions([]);
      return;
    }

    const lower = input.toLowerCase();
    const list: Suggestion[] = [];

    if (/\b(create|add|new)\b.*\btask\b/.test(lower)) {
      list.push({ id: 'create-task', text: 'Create a new task', icon: <Plus size={14} />, action: () => startTaskCreation() });
    }
    if (/\b(list|show|view)\b.*\btasks?\b/.test(lower) || /^tasks?$/.test(lower.trim())) {
      list.push({ id: 'list-tasks', text: 'Show my tasks', icon: <CheckCircle2 size={14} />, action: () => handleQuickCommand('tasks') });
    }
    if (/\b(bible|verse|reading|scripture)\b/.test(lower)) {
      list.push({ id: 'bible-reading', text: 'Get today reading', icon: <BookOpen size={14} />, action: () => handleQuickCommand('bible') });
    }
    if (/\b(habit|daily|routine)\b/.test(lower)) {
      list.push({ id: 'create-habit', text: 'Create daily habit', icon: <Repeat size={14} />, action: () => setInput('create habit ') });
    }

    setSuggestions(list.slice(0, 5));
  }, [input]);

  const pushUndo = useCallback((action: UndoAction) => {
    setUndoStack((prev) => [action, ...prev].slice(0, 20));
    window.setTimeout(() => {
      setUndoStack((prev) => prev.filter((entry) => entry !== action));
    }, 10000);
  }, []);

  const performUndo = useCallback((action: UndoAction) => {
    action.undo();
    setUndoStack((prev) => prev.filter((entry) => entry !== action));
  }, []);

  const parseRepeat = (text: string): Task['repeat'] | null => {
    const lower = text.trim().toLowerCase();
    if (lower === '1' || lower.includes('once')) return 'once';
    if (lower === '2' || lower.includes('daily')) return 'daily';
    if (lower === '3' || lower.includes('weekly')) return 'weekly';
    return null;
  };

  const parseLayer = (text: string): LayerId | null => {
    const lower = text.trim().toLowerCase();
    if (lower === '1' || lower.includes('spiritual')) return 'spiritual';
    if (lower === '2' || lower.includes('academic')) return 'academic';
    if (lower === '3' || lower.includes('financial')) return 'financial';
    if (lower === '4' || lower.includes('physical')) return 'physical';
    if (lower === '5' || lower.includes('general')) return 'general';
    return null;
  };

  const parsePriority = (text: string): Task['priority'] | null => {
    const lower = text.trim().toLowerCase();
    if (lower === '1' || lower === 'a') return 'A';
    if (lower === '2' || lower === 'b') return 'B';
    if (lower === '3' || lower === 'c') return 'C';
    if (lower === '4' || lower === 'd') return 'D';
    if (lower === '5' || lower === 'e') return 'E';
    return null;
  };

  const startTaskCreation = () => {
    setTaskFlow({ mode: 'create', step: 'name', draft: {} });
    setInput('');
  };

  const findTaskByQuery = (query: string): Task | null => {
    const clean = query.trim().toLowerCase();
    if (!clean) return null;
    const exact = tasks.find((task) => task.name.toLowerCase() === clean);
    if (exact) return exact;
    const partial = tasks.find((task) => task.name.toLowerCase().includes(clean));
    return partial || null;
  };

  const handleTaskFlowInput = async (text: string): Promise<string | null> => {
    if (!taskFlow) return null;

    const raw = text.trim();
    if (!raw) return 'Please send a value or type "cancel".';

    if (raw.toLowerCase() === 'cancel' || raw.toLowerCase() === '/cancel') {
      setTaskFlow(null);
      return 'Task setup cancelled.';
    }

    if (taskFlow.mode === 'create') {
      const draft = { ...taskFlow.draft };
      let nextStep: TaskFlowState['step'] = taskFlow.step;

      if (taskFlow.step === 'name') {
        if (raw.length < 2) return 'Please send a clear task name.';
        draft.name = raw;
        nextStep = 'time';
      } else if (taskFlow.step === 'time') {
        const parsed = parseCombinedDateTime(raw);
        const time = parsed?.time || parseTimeFromText(raw);
        if (!time) return 'Time not recognized. Try: 14:30, 2:30 PM, tomorrow 9am, or noon.';

        const probe: Task = {
          id: 'probe',
          name: draft.name || 'Task',
          layerId: 'general',
          priority: 'C',
          repeat: 'once',
          time,
          completed: false,
          date: parsed?.date?.toISOString() || new Date().toISOString(),
        };
        const due = parseTaskDueDate(probe);
        if (!due || due.getTime() <= Date.now()) {
          return 'That time is in the past. Please choose a future time.';
        }

        draft.time = time;
        if (parsed?.date) draft.date = parsed.date.toISOString();
        nextStep = 'repeat';
      } else if (taskFlow.step === 'repeat') {
        const repeat = parseRepeat(raw);
        if (!repeat) return 'Choose repeat: 1.Once  2.Daily  3.Weekly';
        draft.repeat = repeat;
        nextStep = 'layer';
      } else if (taskFlow.step === 'layer') {
        const layer = parseLayer(raw);
        if (!layer) return 'Choose layer: 1.Spiritual 2.Academic 3.Financial 4.Physical 5.General';
        draft.layerId = layer;
        nextStep = 'priority';
      } else if (taskFlow.step === 'priority') {
        const priority = parsePriority(raw);
        if (!priority) return 'Choose priority: 1.A 2.B 3.C 4.D 5.E';
        draft.priority = priority;
        nextStep = 'confirm';
      } else if (taskFlow.step === 'confirm') {
        if (!raw.toLowerCase().startsWith('y')) {
          setTaskFlow(null);
          return 'Task creation cancelled.';
        }

        const newTask: Task = {
          id: `task-${Date.now()}`,
          name: draft.name || 'New task',
          layerId: (draft.layerId as LayerId) || 'general',
          priority: (draft.priority as Task['priority']) || 'C',
          repeat: (draft.repeat as Task['repeat']) || 'once',
          time: draft.time || '08:00',
          completed: false,
          date: draft.date || new Date().toISOString(),
          alarmEnabled: true,
          alarmSound: preferredAlarmSound,
          preferredMusic: preferredTaskMusic,
          customAlarmAudioName: favoriteFocusTrack?.name,
          customAlarmAudioDataUrl: favoriteFocusTrack?.dataUrl,
        };

        addTask(newTask);
        pushUndo({
          type: 'task',
          undo: () => deleteTask(newTask.id),
          description: `Undo create \"${newTask.name}\"`,
        });

        setTaskFlow(null);
        return `Task created: \"${newTask.name}\" at ${formatTimeDisplay(newTask.time)} (${newTask.repeat}, ${newTask.layerId}, priority ${newTask.priority}).`;
      }

      setTaskFlow({ ...taskFlow, step: nextStep, draft });
      if (nextStep === 'time') return 'What time? Example: 14:30, 2:30 PM, tomorrow 9am, or noon.';
      if (nextStep === 'repeat') return 'How often? 1.Once  2.Daily  3.Weekly';
      if (nextStep === 'layer') return 'Which layer? 1.Spiritual 2.Academic 3.Financial 4.Physical 5.General';
      if (nextStep === 'priority') return 'Priority? 1.A (highest) to 5.E (lowest)';
      return `Confirm task:\n\"${draft.name}\" at ${draft.time} | ${draft.repeat} | ${draft.layerId} | priority ${draft.priority}. Reply \"yes\" or \"cancel\".`;
    }

    if (taskFlow.mode === 'delete') {
      const ids = taskFlow.taskIds || [];
      const list = ids.map((id) => tasks.find((task) => task.id === id)).filter(Boolean) as Task[];
      if (list.length === 0) {
        setTaskFlow(null);
        return 'No tasks to delete.';
      }

      const idx = Number(raw);
      if (!Number.isNaN(idx) && idx >= 1 && idx <= list.length) {
        const target = list[idx - 1];
        deleteTask(target.id);
        pushUndo({
          type: 'task',
          undo: () => addTask(target),
          description: `Undo delete \"${target.name}\"`,
        });
        setTaskFlow(null);
        return `Deleted: \"${target.name}\"`;
      }

      return `Type a number between 1 and ${list.length}, or cancel.`;
    }

    return null;
  };

  const parseTaskOperation = (text: string): { handled: boolean; reply?: string } => {
    const raw = text.trim();
    const lower = raw.toLowerCase();

    if (/^tasks?$/.test(lower) || /\b(list|show|view|pending)\b.*\btasks?\b/.test(lower)) {
      const active = tasks.filter((task) => !task.completed).slice(0, 15);
      if (active.length === 0) return { handled: true, reply: 'You have no active tasks right now.' };
      return {
        handled: true,
        reply: `Here are your active tasks:\n${active.map((task, index) => `${index + 1}. ${task.name} | ${task.time} | ${task.repeat || 'once'} | ${task.priority}`).join('\n')}`,
      };
    }

    if (/\b(create|add|new|set)\b/.test(lower) && /\btask\b/.test(lower)) {
      startTaskCreation();
      return { handled: true, reply: 'Sure. First, what is the task name?' };
    }

    if (/\b(delete|remove)\b/.test(lower) && /\btask\b/.test(lower)) {
      const available = tasks.filter((task) => !task.completed).slice(0, 10);
      if (available.length === 0) return { handled: true, reply: 'You have no active tasks to delete.' };
      setTaskFlow({ mode: 'delete', step: 'select', draft: {}, taskIds: available.map((task) => task.id) });
      return {
        handled: true,
        reply: `Choose a task to delete:\n${available.map((task, index) => `${index + 1}. ${task.name} (${task.time})`).join('\n')}`,
      };
    }

    if (/\b(done|complete|finish|check)\b/.test(lower) && /\btask\b/.test(lower)) {
      const targetName = raw.replace(/.*\btask\b/i, '').trim().replace(/^['"]|['"]$/g, '');
      const target = findTaskByQuery(targetName);
      if (!target) return { handled: true, reply: 'I could not find that task. Try quoting the exact task name.' };
      if (!target.completed) {
        toggleTask(target.id);
        pushUndo({
          type: 'task',
          undo: () => toggleTask(target.id),
          description: `Undo complete \"${target.name}\"`,
        });
      }
      return { handled: true, reply: `Marked \"${target.name}\" as completed.` };
    }

    if (/\b(edit|update|change|modify)\b/.test(lower) && /\btask\b/.test(lower)) {
      const targetName = raw.replace(/.*\btask\b/i, '').replace(/\b(time|priority|layer|repeat)\b.*$/i, '').trim();
      const target = findTaskByQuery(targetName);
      if (!target) return { handled: true, reply: 'I could not find that task. Try quoting the exact task name.' };

      const updates: Partial<Task> = {};
      const parsedTime = parseTimeFromText(raw);
      if (parsedTime) updates.time = parsedTime;
      const priorityMatch = raw.match(/\bpriority\s*([A-E])\b/i) || raw.match(/\b([A-E])\s*priority\b/i);
      if (priorityMatch?.[1]) updates.priority = priorityMatch[1].toUpperCase() as Task['priority'];
      const layerMatch = lower.match(/\b(spiritual|academic|financial|physical|general)\b/);
      if (layerMatch?.[1]) updates.layerId = layerMatch[1] as LayerId;
      const repeatMatch = lower.match(/\b(once|daily|weekly)\b/);
      if (repeatMatch?.[1]) updates.repeat = repeatMatch[1] as Task['repeat'];

      if (Object.keys(updates).length === 0) {
        return { handled: true, reply: 'I found the task but no update field was detected. Mention time, priority, layer, or repeat.' };
      }

      updateTask(target.id, updates);
      pushUndo({
        type: 'task',
        undo: () => updateTask(target.id, target),
        description: `Undo edit \"${target.name}\"`,
      });
      return { handled: true, reply: `Updated \"${target.name}\" successfully.` };
    }

    if (/\b(create|add)\b/.test(lower) && /\bhabit\b/.test(lower)) {
      const name = raw.replace(/.*\bhabit\b/i, '').trim() || 'New habit';
      const habit: Habit = {
        id: `habit-${Date.now()}`,
        name,
        layerId: 'general',
        frequency: 'daily',
        durationMinutes: 20,
        streak: 0,
        history: Array(14).fill(false),
        completedToday: false,
      };
      addHabit(habit);
      return { handled: true, reply: `Created habit: \"${habit.name}\".` };
    }

    if (/\b(toggle|complete|done)\b/.test(lower) && /\bhabit\b/.test(lower)) {
      const targetName = raw.replace(/.*\bhabit\b/i, '').trim();
      const target = habits.find((habit) => habit.name.toLowerCase().includes(targetName.toLowerCase()));
      if (!target) return { handled: true, reply: 'I could not find that habit.' };
      toggleHabit(target.id);
      return { handled: true, reply: `Toggled habit: \"${target.name}\".` };
    }

    if (/\b(bible|scripture|reading|verse)\b/.test(lower) && /\b(today|day|plan|suggest)\b/.test(lower)) {
      void (async () => {
        const day = Math.max(1, Math.min(400, Math.floor((Date.now() / (1000 * 60 * 60 * 24)) % 400) + 1));
        const reading = await getDailyBibleReading(day);
        addModelMessage(`Day ${day}/400 reading:\n${reading.passage}\n\"${reading.text}\"\n${reading.context}`);
      })();
      return { handled: true, reply: 'I will prepare today spiritual reading now.' };
    }

    return { handled: false };
  };

  const handleQuickCommand = (cmd: string) => {
    if (cmd === 'tasks') {
      const active = tasks.filter((task) => !task.completed).slice(0, 10);
      const reply =
        active.length === 0
          ? 'You have no active tasks.'
          : `Here are your tasks:\n${active.map((task, index) => `${index + 1}. ${task.name} | ${task.time} | ${task.repeat || 'once'} | ${task.priority}`).join('\n')}`;
      addModelMessage(reply);
    }

    if (cmd === 'bible') {
      void (async () => {
        const day = Math.max(1, Math.min(400, Math.floor((Date.now() / (1000 * 60 * 60 * 24)) % 400) + 1));
        const reading = await getDailyBibleReading(day);
        addModelMessage(`Day ${day}/400 reading:\n${reading.passage}\n\"${reading.text}\"\n${reading.context}`);
      })();
    }

    setInput('');
  };

  const handleFeedback = async (messageId: string, type: 'helpful' | 'unhelpful') => {
    setMessages((prev) => prev.map((message) => (message.id === messageId ? { ...message, feedback: type } : message)));
    await recordFeedback(messageId, type === 'helpful', true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    setIsListening(true);
    recognitionRef.current.start();
  };

  const startNewConversation = async () => {
    setMessages([{ role: 'model', text: INTRO_MESSAGE, id: `intro-${Date.now()}`, timestamp: new Date() }]);
    setInput('');
    setTaskFlow(null);
    await remember('lastConversationResetAt', new Date().toISOString());
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    addUserMessage(userMsg);
    setIsTyping(true);

    const historyForApi = messages.map((message) => ({ role: message.role, parts: [{ text: message.text }] }));

    if (taskFlow) {
      const flowReply = await handleTaskFlowInput(userMsg);
      if (flowReply) {
        addModelMessage(flowReply);
        setIsTyping(false);
        return;
      }
    }

    const operation = parseTaskOperation(userMsg);
    if (operation.handled) {
      addModelMessage(operation.reply || 'Done.');
      setIsTyping(false);
      return;
    }

    try {
      const response = await chatWithEden(historyForApi, userMsg);
      addModelMessage(response);
      await logConversation({ userMessage: userMsg, edenResponse: response, wasHelpful: undefined, userEngaged: true });
      const prof = await getProfile();
      setAgentProfile(prof);
      const recent = await getRecentConversations(10);
      setConversationHistory(recent);
    } catch {
      addModelMessage('I am having trouble connecting. Please try again in a moment.');
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, taskFlow, messages, addUserMessage, addModelMessage]);

  return (
    <div className="flex flex-col h-full bg-background relative">
      <AnimatePresence>
        {showProactive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-surface-container-high shadow-lg rounded-2xl px-4 py-3 border border-primary/20 flex items-center gap-3"
          >
            <Sparkles className="text-primary" size={18} />
            <span className="text-sm">{showProactive}</span>
            <button onClick={() => setShowProactive(null)} className="ml-2">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="p-6 border-b border-outline-variant bg-surface-container-low/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-medium">Eden</h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary">AI Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen((prev) => !prev)} className="h-10 w-10 rounded-2xl bg-surface-container-low border border-outline-variant/35 text-primary flex items-center justify-center">
              {sidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
            </button>
            <button onClick={() => void startNewConversation()} className="h-10 w-10 rounded-2xl bg-surface-container-low border border-outline-variant/35 text-primary flex items-center justify-center">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {agentProfile?.lastActiveLayer && (
          <div className="mt-2 flex items-center gap-3 text-xs text-on-surface-variant">
            <div className="flex items-center gap-1">
              <Layers size={12} />
              <span>Focus: {agentProfile.lastActiveLayer}</span>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-outline-variant bg-surface-container-lowest overflow-y-auto p-4"
            >
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <History size={16} /> Recent Conversations
              </h3>
              <div className="space-y-2">
                {conversationHistory.map((conv, index) => (
                  <div key={`${conv.id || index}`} className="text-xs p-2 rounded-lg bg-surface-container-low">
                    <div className="font-medium truncate">{conv.userMessage}</div>
                    <div className="text-on-surface-variant truncate">{conv.edenResponse}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn('flex gap-3 max-w-[85%]', message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto')}>
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', message.role === 'user' ? 'bg-secondary text-white' : 'bg-primary/10 text-primary')}>
                  {message.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                <div className="group relative">
                  <div className={cn('p-4 rounded-2xl text-sm leading-relaxed', message.role === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-surface-container-low border border-outline-variant rounded-tl-none font-serif italic text-on-surface-variant')}>
                    {message.text}
                  </div>
                  {message.role === 'model' && (
                    <div className="absolute -bottom-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background p-1 rounded-lg shadow">
                      <button onClick={() => copyToClipboard(message.text)} className="p-1 hover:bg-surface-container rounded">
                        <Copy size={12} />
                      </button>
                      <button onClick={() => void handleFeedback(message.id, 'helpful')} className="p-1 hover:bg-surface-container rounded">
                        <ThumbsUp size={12} />
                      </button>
                      <button onClick={() => void handleFeedback(message.id, 'unhelpful')} className="p-1 hover:bg-surface-container rounded">
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mr-auto">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {undoStack.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
            <span>{undoStack[0].description}</span>
            <button onClick={() => performUndo(undoStack[0])} className="font-medium text-primary-light flex items-center gap-1">
              <Undo2 size={14} /> Undo
            </button>
            <button onClick={() => setUndoStack((prev) => prev.slice(1))}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {suggestions.length > 0 && (
        <div className="px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map((suggestion) => (
            <button key={suggestion.id} onClick={suggestion.action} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-full text-xs whitespace-nowrap hover:bg-surface-container transition-colors">
              {suggestion.icon}
              {suggestion.text}
            </button>
          ))}
        </div>
      )}

      <div className="p-6 bg-background/80 backdrop-blur-md border-t border-outline-variant">
        {taskFlow && (
          <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                {taskFlow.step === 'name' ? '1' : taskFlow.step === 'time' ? '2' : taskFlow.step === 'repeat' ? '3' : taskFlow.step === 'layer' ? '4' : taskFlow.step === 'priority' ? '5' : <Check size={12} />}
              </div>
              <span>{taskFlow.mode === 'create' ? `Creating task: ${taskFlow.draft.name || '...'}` : 'Deleting task'}</span>
            </div>
            <button onClick={() => setTaskFlow(null)} className="text-xs text-on-surface-variant hover:text-error">
              Cancel
            </button>
          </div>
        )}

        <div className="relative flex items-end gap-2">
          <button onClick={toggleListening} className={cn('p-3 rounded-xl transition-colors', isListening ? 'bg-error text-white' : 'bg-surface-container-low text-primary border border-outline-variant')}>
            {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>

          <div className="relative flex-1">
            <textarea
              ref={textAreaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              rows={1}
              placeholder={inputPlaceholder}
              className="w-full resize-none overflow-y-auto bg-surface-container-lowest border border-outline-variant rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-serif italic"
            />
            <button onClick={() => void handleSend()} disabled={!input.trim() || isTyping} className="absolute right-2 bottom-2 p-2.5 rounded-xl bg-primary text-white disabled:opacity-50 disabled:bg-secondary transition-all shadow-md active:scale-95">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eden;
