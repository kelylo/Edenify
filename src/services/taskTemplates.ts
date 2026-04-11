import { LayerId, Task } from '../types';

export interface EdenTemplate {
  name: string;
  layerId: LayerId;
  priority: 'A' | 'B' | 'C' | 'D' | 'E';
  repeat: 'once' | 'daily' | 'weekly';
  time: string;
}

interface Slot {
  label: string;
  time: string;
}

const SLOTS: Slot[] = [
  { label: 'Morning', time: '06:30' },
  { label: 'Midday', time: '12:30' },
  { label: 'Evening', time: '18:30' },
  { label: 'Night', time: '21:00' },
];

const SPIRITUAL_TASKS = [
  'Pray with focus',
  'Read one chapter of scripture',
  'Write gratitude journal entry',
  'Memorize one verse',
  'Worship and reflect quietly',
  'Intercede for family and friends',
  'Read devotional notes',
  'Listen to faith teaching',
  'Practice silence before prayer',
  'Write answered prayers list',
  'Study one biblical topic',
  'Plan weekly spiritual goals',
  'Review faith commitments',
];

const ACADEMIC_TASKS = [
  'Deep study block',
  'Review class notes',
  'Solve practice questions',
  'Read textbook section',
  'Write assignment draft',
  'Summarize chapter key points',
  'Revise previous mistakes',
  'Active recall session',
  'Prepare exam flashcards',
  'Watch lecture and annotate',
  'Build concept map',
  'Practice timed test',
  'Plan tomorrow study sprint',
];

const FINANCIAL_TASKS = [
  'Track daily spending',
  'Update weekly budget',
  'Review account balances',
  'Plan savings transfer',
  'Record all cash expenses',
  'Review subscriptions and cancel one',
  'Analyze debt payment plan',
  'Check business income entries',
  'Create side-income task',
  'Read one finance lesson',
  'Prepare monthly expense report',
  'Review investment notes',
  'Set financial priority for tomorrow',
];

const PHYSICAL_TASKS = [
  'Morning mobility routine',
  'Strength training set',
  'Cardio session',
  'Stretch and recover',
  'Walk 8000 steps',
  'Prepare healthy meal',
  'Hydration tracking check',
  'Core workout routine',
  'Breathing and posture reset',
  'Sleep prep routine',
  'Track body progress metrics',
  'Short home workout',
  'Plan tomorrow training session',
];

const GENERAL_TASKS = [
  'Plan top 3 priorities',
  'Inbox zero sprint',
  'Clean workspace',
  'Review daily schedule',
  'Declutter one small area',
  'Reply to pending important messages',
  'Plan tomorrow tasks',
  'Weekly reflection check',
  'Organize files and notes',
  'Family check-in call',
  'Update personal goals',
  'Read 15 minutes',
  'Mind reset and breathing break',
];

const LAYER_BASE: Record<LayerId, { names: string[]; priority: EdenTemplate['priority']; repeat: EdenTemplate['repeat'] }> = {
  spiritual: { names: SPIRITUAL_TASKS, priority: 'B', repeat: 'daily' },
  academic: { names: ACADEMIC_TASKS, priority: 'A', repeat: 'daily' },
  financial: { names: FINANCIAL_TASKS, priority: 'B', repeat: 'daily' },
  physical: { names: PHYSICAL_TASKS, priority: 'A', repeat: 'daily' },
  general: { names: GENERAL_TASKS, priority: 'C', repeat: 'once' },
};

const buildLayerTemplates = (layerId: LayerId): EdenTemplate[] => {
  const config = LAYER_BASE[layerId];
  const list: EdenTemplate[] = [];

  for (const baseName of config.names) {
    for (const slot of SLOTS) {
      list.push({
        name: `${baseName} (${slot.label})`,
        layerId,
        priority: config.priority,
        repeat: config.repeat,
        time: slot.time,
      });
    }
  }

  return list;
};

const ALL_TEMPLATES: EdenTemplate[] = [
  ...buildLayerTemplates('spiritual'),
  ...buildLayerTemplates('academic'),
  ...buildLayerTemplates('financial'),
  ...buildLayerTemplates('physical'),
  ...buildLayerTemplates('general'),
];

export const EDEN_TEMPLATE_COUNT = ALL_TEMPLATES.length;

export const getAllEdenTemplates = (): EdenTemplate[] => [...ALL_TEMPLATES];

export const getEdenTemplatesByLayer = (layerId: LayerId): EdenTemplate[] =>
  ALL_TEMPLATES.filter((template) => template.layerId === layerId);

const scoreTemplate = (
  template: EdenTemplate,
  intent: string,
  tasks: Task[],
  recentPatterns: Array<{ name: string; layerId: LayerId; count: number }>
): number => {
  const normalizedName = template.name.toLowerCase();
  const normalizedIntent = intent.toLowerCase().trim();

  let score = 0;
  if (normalizedIntent && normalizedName.includes(normalizedIntent)) score += 15;
  if (normalizedIntent) {
    const words = normalizedIntent.split(/\s+/).filter(Boolean);
    words.forEach((word) => {
      if (word.length >= 3 && normalizedName.includes(word)) score += 4;
    });
  }

  const repeatedCount = tasks.filter((task) => task.name.toLowerCase().includes(normalizedName.slice(0, 12))).length;
  score += Math.min(10, repeatedCount);

  const matchingPattern = recentPatterns.find(
    (pattern) => pattern.layerId === template.layerId && normalizedName.includes(pattern.name.toLowerCase())
  );
  if (matchingPattern) {
    score += Math.min(20, matchingPattern.count * 2);
  }

  return score;
};

export const getRecommendedEdenTemplates = (params: {
  tasks: Task[];
  layerId?: LayerId;
  intent?: string;
  mostRepeated?: Array<{ name: string; layerId: LayerId; count: number }>;
  limit?: number;
}): EdenTemplate[] => {
  const { tasks, layerId, intent = '', mostRepeated = [], limit = 20 } = params;
  const base = layerId ? getEdenTemplatesByLayer(layerId) : getAllEdenTemplates();

  return base
    .map((template) => ({
      template,
      score: scoreTemplate(template, intent, tasks, mostRepeated),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.template);
};
