export interface Subtask {
  id: string;
  title: string;
  duration: number; // minutes
  completed: boolean;
}

export interface Task {
  title: string;
  subtasks: Subtask[];
}
