import { Layer, Habit, Task, User, BibleReading } from './types';

export const INITIAL_USER: User = {
  id: '1',
  email: 'niyonsabakevin15@gmail.com',
  name: 'Kevin',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcC3JJ6pbiJ4huGdQErp1HqdYXv5QSjjUVdzI5yxMSvCafZOcDElC70vwyd1yvnWQJIkA3SA3qV0hrcU_2aR21a_vYyL4__c5Vk5BMJnULE5kBRr0MVHbedGwSryNzECh11wQ0Gi7A4JRh44ZzxgSYBaozjBW6k6SNLpmcSxQ7sgHqQD_F8t7emA54L4Bk0Efhy-NicS6SGD4bOAOYC_NXfIGeo24tsTpoM26uqQn9erV_qKz6719c8vYXXpA-hWjbbQBp-e6tPA',
  preferences: {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    focusSound: 'Rain Forest',
    focusAlarmSound: 'Aggressive Bell',
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
    }
  }
};

export const INITIAL_BIBLE_READING: BibleReading = {
  day: 1,
  totalDays: 400,
  highestCompletedDay: 0,
  passage: 'Genesis 1:1-5',
  text: 'In the beginning God created the heavens and the earth.',
  completed: false,
};

export const INITIAL_LAYERS: Layer[] = [
  {
    id: 'spiritual',
    name: 'Spiritual',
    level: 1,
    xp: 0,
    maxXp: 2000,
    habitsActive: 0,
    tasksToday: 0,
    color: '#7a6550',
    icon: 'Sparkles',
  },
  {
    id: 'academic',
    name: 'Academic',
    level: 1,
    xp: 0,
    maxXp: 5000,
    habitsActive: 0,
    tasksToday: 0,
    color: '#4d6b4a',
    icon: 'BookOpen',
  },
  {
    id: 'financial',
    name: 'Financial',
    level: 1,
    xp: 0,
    maxXp: 1500,
    habitsActive: 0,
    tasksToday: 0,
    color: '#4a5d6b',
    icon: 'Building2',
  },
  {
    id: 'physical',
    name: 'Physical',
    level: 1,
    xp: 0,
    maxXp: 3000,
    habitsActive: 0,
    tasksToday: 0,
    color: '#8c3c3c',
    icon: 'Dumbbell',
  },
  {
    id: 'general',
    name: 'General',
    level: 1,
    xp: 0,
    maxXp: 2000,
    habitsActive: 0,
    tasksToday: 0,
    color: '#5c4a6b',
    icon: 'LayoutGrid',
  },
];

export const INITIAL_HABITS: Habit[] = [];

export const INITIAL_TASKS: Task[] = [];
