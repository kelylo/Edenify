/**
 * Task analytics and tracking utilities for AI prediction
 */

import { Task, LayerId } from '../types';

export interface TaskPattern {
  name: string;
  layerId: LayerId;
  priority: string;
  count: number;
  frequency: 'high' | 'medium' | 'low';
}

/**
 * Analyze tasks to find most repeated patterns for AI prediction
 */
export const analyzeMostRepeatedTasks = (tasks: Task[], limit: number = 5): TaskPattern[] => {
  const taskMap = new Map<string, { count: number; layerId: LayerId; priority: string }>();

  tasks.forEach((task) => {
    const key = `${task.name.toLowerCase()}${task.layerId}`;
    const existing = taskMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      taskMap.set(key, {
        count: 1,
        layerId: task.layerId,
        priority: task.priority || 'C',
      });
    }
  });

  const patterns = Array.from(taskMap.entries())
    .map(([name, data]) => {
      const frequencyValue = data.count > 10 ? 'high' : data.count > 5 ? 'medium' : 'low';
      return {
        name: name.replace(data.layerId, '').trim(),
        layerId: data.layerId,
        priority: data.priority,
        count: data.count,
        frequency: frequencyValue as 'high' | 'medium' | 'low',
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return patterns;
};

/**
 * Get AI prediction suggestions based on task patterns
 */
export const getPredictionSuggestions = (patterns: TaskPattern[]): string[] => {
  return patterns
    .filter((p) => p.frequency === 'high' || p.frequency === 'medium')
    .map((p) => p.name)
    .slice(0, 3);
};
