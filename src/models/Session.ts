import type { Subtask } from './Task';

export interface Session {
  task: string;
  subtasks: Subtask[];
  current: number;
  remaining: number; // seconds remaining for current subtask
  paused: boolean;
  encouragement: string;
  phase: 'welcome' | 'planning' | 'session' | 'complete';
  editingPlan: boolean;
}
