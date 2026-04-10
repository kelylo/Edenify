export type LayerId = 'spiritual' | 'academic' | 'financial' | 'physical' | 'general';

export interface Layer {
  id: LayerId;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  habitsActive: number;
  tasksToday: number;
  color: string;
  icon: string;
}

export interface Habit {
  id: string;
  name: string;
  layerId: LayerId;
  frequency: 'daily' | 'weekly' | 'custom';
  durationMinutes: number;
  streak: number;
  history: boolean[]; // last 14 days
  completedToday: boolean;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  time?: string;
  linkedTaskId?: string;
  lastCompletedAt?: string;
}

export interface Task {
  id: string;
  name: string;
  layerId: LayerId;
  priority: 'A' | 'B' | 'C' | 'D' | 'E';
  repeat?: 'once' | 'daily' | 'weekly';
  time: string;
  completed: boolean;
  date: string; // ISO string
  alarmEnabled?: boolean;
  alarmSound?: string;
  preferredMusic?: string;
  customAlarmAudioName?: string;
  customAlarmAudioDataUrl?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  layerId?: LayerId;
}

export interface UserStats {
  level: number;
  xp: number;
  maxXp: number;
  dailyClarity: number; // percentage
  tasksCompleted: number;
  totalTasks: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    focusSound: string;
    focusAlarmSound?: string;
    bibleReminderTime?: string;
    bibleReminderAlarm?: boolean;
    bibleReminderTelegram?: boolean;
    telegramChatId?: string;
    customFocusSongName?: string;
    customFocusSongDataUrl?: string;
    customFocusPlaylistNames?: string[];
    customFocusPlaylistDataUrls?: string[];
    shuffleFocusPlaylist?: boolean;
    notifications: {
      taskReminders: boolean;
      dailyScripture: boolean;
      streakProtection: boolean;
    };
  };
}

export interface BibleReading {
  day: number;
  totalDays: number;
  highestCompletedDay: number;
  passage: string;
  text: string;
  completed: boolean;
  reflection?: string;
}
