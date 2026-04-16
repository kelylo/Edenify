/**
 * Task analytics and tracking utilities for AI prediction.
 */

import { Task, LayerId } from '../types';
import { getAllEdenTemplates, getEdenTemplatesByLayer, type EdenTemplate } from './taskTemplates';

export interface TaskPattern {
  name: string;
  layerId: LayerId;
  priority: string;
  count: number;
  frequency: 'high' | 'medium' | 'low';
  averageTime?: string;
  typicalDay?: number;
  streakLength?: number;
  completionRate?: number;
  lastUsed?: Date;
  category?: string;
  similarPatterns?: string[];
}

export interface TimeSlotAnalysis {
  hour: number;
  count: number;
  tasks: string[];
  layers: Record<LayerId, number>;
}

export interface LayerAnalytics {
  layerId: LayerId;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  avgPriority: number;
  mostFrequentTask: string;
  topTimeSlots: TimeSlotAnalysis[];
  streakDays: number;
}

export interface SuggestedTask {
  name: string;
  layerId: LayerId;
  priority: string;
  confidence: number;
  reason: string;
  suggestedTime?: string;
  templateId?: string;
}

export interface DailyPrediction {
  suggestedTasks: SuggestedTask[];
  optimalTimes: Record<string, string>;
  layerFocus: LayerId;
  confidence: number;
}

export interface AnalyticsSummary {
  totalTasksEver: number;
  totalCompletions: number;
  overallCompletionRate: number;
  activeStreaks: Record<LayerId, number>;
  bestDay: { day: number; count: number };
  bestHour: { hour: number; count: number };
  topPatterns: TaskPattern[];
  layerAnalytics: LayerAnalytics[];
}

const PRIORITY_WEIGHT: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const normalizeText = (value: string) => {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const getHourFromTime = (time: string): number => {
  const hour = Number(String(time || '').split(':')[0]);
  return Number.isFinite(hour) ? hour : 0;
};

const getDayOfWeek = (dateStr: string): number => {
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getDay();
};

const getTimeKey = (time: string) => {
  const match = String(time || '').trim().match(/^([0-2]?\d):([0-5]\d)/);
  if (!match) return '00:00';
  const hour = Math.max(0, Math.min(23, Number(match[1])));
  return `${String(hour).padStart(2, '0')}:${match[2]}`;
};

const levenshteinDistance = (a: string, b: string): number => {
  const left = normalizeText(a);
  const right = normalizeText(b);
  const matrix: number[][] = [];

  for (let i = 0; i <= right.length; i += 1) matrix[i] = [i];
  for (let j = 0; j <= left.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= right.length; i += 1) {
    for (let j = 1; j <= left.length; j += 1) {
      if (right.charAt(i - 1) === left.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[right.length][left.length];
};

const fuzzyMatchScore = (a: string, b: string): number => {
  const left = normalizeText(a);
  const right = normalizeText(b);
  const maxLength = Math.max(left.length, right.length);
  if (maxLength === 0) return 1;
  const distance = levenshteinDistance(left, right);
  return 1 - distance / maxLength;
};

const getBaseName = (value: string) => value.replace(/\s*\([^)]*\)\s*$/, '').trim();

const getPatternName = (key: string, layerId: LayerId) => key.replace(new RegExp(`\|${layerId}$`), '').trim();

const getEmptyLayerCounts = (): Record<LayerId, number> => ({
  spiritual: 0,
  academic: 0,
  financial: 0,
  physical: 0,
  general: 0,
});

const deriveFrequency = (count: number): 'high' | 'medium' | 'low' => {
  if (count >= 10) return 'high';
  if (count >= 5) return 'medium';
  return 'low';
};

const buildExactPatterns = (tasks: Task[], minCount: number) => {
  const exactMap = new Map<string, {
    tasks: Task[];
    layerId: LayerId;
    priorities: string[];
    times: string[];
    days: number[];
    completions: number;
  }>();

  tasks.forEach((task) => {
    const key = `${normalizeText(task.name)}|${task.layerId}`;
    const existing = exactMap.get(key);
    const normalizedTime = getTimeKey(task.time);
    const day = getDayOfWeek(task.date);

    if (existing) {
      existing.tasks.push(task);
      existing.priorities.push(task.priority || 'C');
      existing.times.push(normalizedTime);
      existing.days.push(day);
      if (task.completed) existing.completions += 1;
      return;
    }

    exactMap.set(key, {
      tasks: [task],
      layerId: task.layerId,
      priorities: [task.priority || 'C'],
      times: [normalizedTime],
      days: [day],
      completions: task.completed ? 1 : 0,
    });
  });

  const patterns: TaskPattern[] = [];

  for (const [key, data] of exactMap.entries()) {
    if (data.tasks.length < minCount) continue;

    const name = getPatternName(key, data.layerId);
    const timeFreq = new Map<string, number>();
    data.times.forEach((time) => timeFreq.set(time, (timeFreq.get(time) || 0) + 1));
    const averageTime = Array.from(timeFreq.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];

    const dayFreq = new Map<number, number>();
    data.days.forEach((day) => dayFreq.set(day, (dayFreq.get(day) || 0) + 1));
    const typicalDay = Array.from(dayFreq.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];

    const sortedTasks = [...data.tasks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let streak = 0;
    let maxStreak = 0;
    let lastDate: Date | null = null;

    sortedTasks.forEach((task) => {
      const date = new Date(task.date);
      date.setHours(0, 0, 0, 0);

      if (!lastDate) {
        streak = 1;
      } else {
        const diffDays = Math.round((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) streak += 1;
        else if (diffDays > 1) streak = 1;
      }

      maxStreak = Math.max(maxStreak, streak);
      lastDate = date;
    });

    const priorityCounts = data.priorities.reduce<Record<string, number>>((accumulator, priority) => {
      accumulator[priority] = (accumulator[priority] || 0) + 1;
      return accumulator;
    }, {});
    const priority = Object.entries(priorityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'C';

    patterns.push({
      name: name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Task',
      layerId: data.layerId,
      priority,
      count: data.tasks.length,
      frequency: deriveFrequency(data.tasks.length),
      averageTime,
      typicalDay,
      streakLength: maxStreak,
      completionRate: data.tasks.length > 0 ? (data.completions / data.tasks.length) * 100 : 0,
      lastUsed: sortedTasks[sortedTasks.length - 1] ? new Date(sortedTasks[sortedTasks.length - 1].date) : undefined,
      category: data.layerId,
    });
  }

  return patterns;
};

const mergeSimilarPatterns = (patterns: TaskPattern[], limit: number) => {
  if (patterns.length <= limit) {
    return patterns;
  }

  const mergedPatterns: TaskPattern[] = [];
  const consumed = new Set<number>();

  for (let i = 0; i < patterns.length; i += 1) {
    if (consumed.has(i)) continue;

    const base = patterns[i];
    const similar: TaskPattern[] = [base];
    consumed.add(i);

    for (let j = i + 1; j < patterns.length; j += 1) {
      if (consumed.has(j)) continue;
      const candidate = patterns[j];
      if (base.layerId !== candidate.layerId) continue;
      if (fuzzyMatchScore(base.name, candidate.name) > 0.7) {
        similar.push(candidate);
        consumed.add(j);
      }
    }

    if (similar.length === 1) {
      mergedPatterns.push(base);
      continue;
    }

    const mergedCount = similar.reduce((sum, pattern) => sum + pattern.count, 0);
    const mergedCompletionRate = similar.reduce((sum, pattern) => sum + (pattern.completionRate || 0), 0) / similar.length;

    mergedPatterns.push({
      ...base,
      count: mergedCount,
      frequency: deriveFrequency(mergedCount),
      streakLength: Math.max(...similar.map((pattern) => pattern.streakLength || 0)),
      completionRate: mergedCompletionRate,
      similarPatterns: similar.slice(1).map((pattern) => pattern.name),
    });
  }

  return mergedPatterns;
};

export function analyzeMostRepeatedTasks(tasks: Task[], limit?: number): TaskPattern[];
export function analyzeMostRepeatedTasks(tasks: Task[], options?: {
  limit?: number;
  includeCompleted?: boolean;
  minCount?: number;
  fuzzyMatch?: boolean;
}): TaskPattern[];
export function analyzeMostRepeatedTasks(
  tasks: Task[],
  limitOrOptions: number | {
    limit?: number;
    includeCompleted?: boolean;
    minCount?: number;
    fuzzyMatch?: boolean;
  } = 5
): TaskPattern[] {
  const options = typeof limitOrOptions === 'number'
    ? { limit: limitOrOptions }
    : limitOrOptions;

  const {
    limit = 5,
    includeCompleted = true,
    minCount = 1,
    fuzzyMatch = true,
  } = options;

  const filteredTasks = includeCompleted ? tasks : tasks.filter((task) => !task.completed);
  if (filteredTasks.length === 0) return [];

  const exactPatterns = buildExactPatterns(filteredTasks, minCount).sort((a, b) => b.count - a.count);
  const finalPatterns = fuzzyMatch ? mergeSimilarPatterns(exactPatterns, limit) : exactPatterns;

  return finalPatterns.sort((a, b) => b.count - a.count).slice(0, limit);
}

export interface TimeSlotAnalysis {
  hour: number;
  count: number;
  tasks: string[];
  layers: Record<LayerId, number>;
}

export const analyzeTimeSlots = (tasks: Task[]): TimeSlotAnalysis[] => {
  const hourMap = new Map<number, { count: number; tasks: Set<string>; layers: Record<LayerId, number> }>();

  for (let hour = 0; hour < 24; hour += 1) {
    hourMap.set(hour, { count: 0, tasks: new Set<string>(), layers: getEmptyLayerCounts() });
  }

  tasks.forEach((task) => {
    const hour = getHourFromTime(task.time);
    const bucket = hourMap.get(hour);
    if (!bucket) return;
    bucket.count += 1;
    bucket.tasks.add(task.name);
    bucket.layers[task.layerId] = (bucket.layers[task.layerId] || 0) + 1;
  });

  return Array.from(hourMap.entries())
    .map(([hour, data]) => ({
      hour,
      count: data.count,
      tasks: Array.from(data.tasks),
      layers: data.layers,
    }))
    .sort((a, b) => b.count - a.count);
};

export const getLayerAnalytics = (tasks: Task[]): LayerAnalytics[] => {
  const layers: LayerId[] = ['spiritual', 'academic', 'financial', 'physical', 'general'];

  return layers.map((layerId) => {
    const layerTasks = tasks.filter((task) => task.layerId === layerId);
    const completedTasks = layerTasks.filter((task) => task.completed);
    const avgPriority = layerTasks.length > 0
      ? layerTasks.reduce((sum, task) => sum + (PRIORITY_WEIGHT[task.priority] || 3), 0) / layerTasks.length
      : 3;

    const nameFreq = new Map<string, number>();
    layerTasks.forEach((task) => nameFreq.set(task.name, (nameFreq.get(task.name) || 0) + 1));
    const mostFrequentTask = Array.from(nameFreq.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    const topTimeSlots = Array.from(
      layerTasks.reduce((accumulator, task) => {
        const hour = getHourFromTime(task.time);
        accumulator.set(hour, (accumulator.get(hour) || 0) + 1);
        return accumulator;
      }, new Map<number, number>()).entries()
    )
      .map(([hour, count]) => ({ hour, count, tasks: [], layers: getEmptyLayerCounts() }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const uniqueDates = [...new Set(layerTasks.map((task) => new Date(task.date).toDateString()))]
      .map((date) => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime());

    let streak = 0;
    let maxStreak = 0;
    let lastDate: Date | null = null;

    uniqueDates.forEach((date) => {
      if (!lastDate) {
        streak = 1;
      } else {
        const diffDays = Math.round((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) streak += 1;
        else if (diffDays > 1) streak = 1;
      }

      maxStreak = Math.max(maxStreak, streak);
      lastDate = date;
    });

    return {
      layerId,
      totalTasks: layerTasks.length,
      completedTasks: completedTasks.length,
      completionRate: layerTasks.length > 0 ? (completedTasks.length / layerTasks.length) * 100 : 0,
      avgPriority,
      mostFrequentTask,
      topTimeSlots,
      streakDays: maxStreak,
    };
  });
};

export const getPredictionSuggestions = (patterns: TaskPattern[], limit: number = 3): string[] => {
  return patterns
    .filter((pattern) => pattern.frequency === 'high' || pattern.frequency === 'medium')
    .map((pattern) => pattern.name)
    .slice(0, limit);
};

export const predictNextTasks = (
  tasks: Task[],
  context: {
    currentHour?: number;
    currentDay?: number;
    recentCompletions?: string[];
    preferredLayer?: LayerId;
    limit?: number;
  } = {}
): SuggestedTask[] => {
  const now = new Date();
  const currentHour = context.currentHour ?? now.getHours();
  const currentDay = context.currentDay ?? now.getDay();
  const limit = context.limit ?? 5;

  const patterns = analyzeMostRepeatedTasks(tasks, { limit: 50, includeCompleted: true, fuzzyMatch: true });
  const timeSlots = analyzeTimeSlots(tasks);

  const suggestions: SuggestedTask[] = [];

  const hourWindowTasks = timeSlots
    .filter((slot) => Math.abs(slot.hour - currentHour) <= 1)
    .flatMap((slot) => slot.tasks);

  patterns.forEach((pattern) => {
    let confidence = 0;
    const reasons: string[] = [];

    confidence += pattern.count * 2;
    if (pattern.frequency === 'high') confidence += 30;
    else if (pattern.frequency === 'medium') confidence += 15;

    if (pattern.averageTime) {
      const patternHour = getHourFromTime(pattern.averageTime);
      const hourDiff = Math.abs(patternHour - currentHour);
      if (hourDiff === 0) {
        confidence += 40;
        reasons.push('usually done at this time');
      } else if (hourDiff <= 1) {
        confidence += 20;
        reasons.push('often done around this time');
      }
    }

    if (pattern.typicalDay === currentDay) {
      confidence += 25;
      reasons.push(`commonly done on ${DAY_NAMES[currentDay]}s`);
    }

    if ((pattern.streakLength || 0) > 2) {
      confidence += (pattern.streakLength || 0) * 5;
      reasons.push(`${pattern.streakLength}-day streak`);
    }

    if ((pattern.completionRate || 0) > 80) {
      confidence += 15;
      reasons.push('high completion rate');
    }

    if (context.preferredLayer && pattern.layerId === context.preferredLayer) {
      confidence += 20;
      reasons.push(`aligned with current ${pattern.layerId} focus`);
    }

    if (context.recentCompletions?.some((recent) => fuzzyMatchScore(recent, pattern.name) > 0.7)) {
      confidence -= 30;
    }

    if (hourWindowTasks.some((taskName) => fuzzyMatchScore(taskName, pattern.name) > 0.7)) {
      confidence += 15;
      reasons.push('others do similar tasks now');
    }

    const suggestedTime = pattern.averageTime || `${String(currentHour).padStart(2, '0')}:00`;

    if (confidence > 20) {
      suggestions.push({
        name: pattern.name,
        layerId: pattern.layerId,
        priority: pattern.priority,
        confidence: Math.min(100, Math.round(confidence)),
        reason: reasons.slice(0, 2).join(', ') || 'frequent task',
        suggestedTime,
      });
    }
  });

  if (suggestions.length < limit) {
    const templates = context.preferredLayer
      ? getEdenTemplatesByLayer(context.preferredLayer)
      : getAllEdenTemplates();

    const usedNames = new Set(suggestions.map((suggestion) => suggestion.name.toLowerCase()));
    const additionalTemplates = templates
      .filter((template) => !usedNames.has(template.name.toLowerCase()))
      .slice(0, limit - suggestions.length)
      .map((template) => ({
        name: template.name,
        layerId: template.layerId,
        priority: template.priority,
        confidence: 50,
        reason: `recommended for ${template.layerId} growth`,
        suggestedTime: template.time,
        templateId: template.id,
      }));

    suggestions.push(...additionalTemplates);
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, limit);
};

export const getAnalyticsSummary = (tasks: Task[]): AnalyticsSummary => {
  const completedTasks = tasks.filter((task) => task.completed);
  const topPatterns = analyzeMostRepeatedTasks(tasks, { limit: 10 });
  const layerAnalytics = getLayerAnalytics(tasks);
  const timeSlots = analyzeTimeSlots(tasks);

  const dayCounts = new Map<number, number>();
  tasks.forEach((task) => {
    const day = getDayOfWeek(task.date);
    dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
  });
  const bestDay = Array.from(dayCounts.entries()).sort((a, b) => b[1] - a[1])[0] || [0, 0];
  const bestHour = timeSlots[0] || { hour: 9, count: 0 };

  const activeStreaks: Record<LayerId, number> = getEmptyLayerCounts();
  layerAnalytics.forEach((layerAnalyticsItem) => {
    activeStreaks[layerAnalyticsItem.layerId] = layerAnalyticsItem.streakDays;
  });

  return {
    totalTasksEver: tasks.length,
    totalCompletions: completedTasks.length,
    overallCompletionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
    activeStreaks,
    bestDay: { day: bestDay[0], count: bestDay[1] },
    bestHour: { hour: bestHour.hour, count: bestHour.count },
    topPatterns,
    layerAnalytics,
  };
};

export const getDailyPrediction = (tasks: Task[], date?: Date): DailyPrediction => {
  const targetDate = date || new Date();
  const currentDay = targetDate.getDay();
  const currentHour = targetDate.getHours();
  const predictions = predictNextTasks(tasks, {
    currentHour,
    currentDay,
    limit: 10,
  });

  const layerAnalytics = getLayerAnalytics(tasks);
  const leastCompletedLayer = [...layerAnalytics].sort((a, b) => a.completionRate - b.completionRate)[0];

  const optimalTimes: Record<string, string> = {};
  predictions.forEach((prediction) => {
    if (prediction.suggestedTime) {
      optimalTimes[prediction.name] = prediction.suggestedTime;
    }
  });

  const avgConfidence = predictions.reduce((sum, prediction) => sum + prediction.confidence, 0) / (predictions.length || 1);

  return {
    suggestedTasks: predictions,
    optimalTimes,
    layerFocus: leastCompletedLayer?.layerId || 'general',
    confidence: Math.round(avgConfidence),
  };
};

export default {
  analyzeMostRepeatedTasks,
  analyzeTimeSlots,
  getLayerAnalytics,
  predictNextTasks,
  getPredictionSuggestions,
  getAnalyticsSummary,
  getDailyPrediction,
};
