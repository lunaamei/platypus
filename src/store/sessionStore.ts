import { create } from 'zustand';
import type { Session } from '../models/Session';
import type { Subtask } from '../models/Task';

interface SessionStore extends Session {
  setPhase: (phase: Session['phase']) => void;
  setTask: (task: string) => void;
  setSubtasks: (subtasks: Subtask[]) => void;
  setEncouragement: (msg: string) => void;
  tickTimer: () => void;
  togglePause: () => void;
  completeCurrentSubtask: () => void;
  updateSubtask: (id: string, patch: Partial<Pick<Subtask, 'title' | 'duration'>>) => void;
  addSubtask: (title: string, duration: number) => void;
  removeSubtask: (id: string) => void;
  toggleEditingPlan: () => void;
  reset: () => void;
}

const defaultState: Session = {
  task: '',
  subtasks: [],
  current: 0,
  remaining: 0,
  paused: false,
  encouragement: '',
  phase: 'welcome',
  editingPlan: false,
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  ...defaultState,

  setPhase: (phase) => set({ phase }),
  setTask: (task) => set({ task }),
  setSubtasks: (subtasks) => {
    const first = subtasks[0];
    set({
      subtasks,
      current: 0,
      remaining: first ? first.duration * 60 : 0,
    });
  },
  setEncouragement: (encouragement) => set({ encouragement }),

  tickTimer: () => {
    const { remaining, paused } = get();
    if (paused) return;
    if (remaining > 0) {
      set({ remaining: remaining - 1 });
    }
  },

  togglePause: () => set((s) => ({ paused: !s.paused })),

  completeCurrentSubtask: () => {
    const { subtasks, current } = get();
    const updated = subtasks.map((st, i) =>
      i === current ? { ...st, completed: true } : st
    );
    const next = current + 1;
    if (next >= subtasks.length) {
      set({ subtasks: updated, phase: 'complete' });
    } else {
      set({
        subtasks: updated,
        current: next,
        remaining: subtasks[next].duration * 60,
        paused: false,
      });
    }
  },

  updateSubtask: (id, patch) => {
    const { subtasks, current } = get();
    const updated = subtasks.map((st) => (st.id === id ? { ...st, ...patch } : st));
    set({
      subtasks: updated,
      remaining: updated[current] ? updated[current].duration * 60 : 0,
    });
  },

  addSubtask: (title, duration) => {
    const { subtasks } = get();
    set({
      subtasks: [...subtasks, { id: crypto.randomUUID(), title, duration, completed: false }],
    });
  },

  removeSubtask: (id) => {
    const { subtasks, current } = get();
    const removedIndex = subtasks.findIndex((st) => st.id === id);
    const updated = subtasks.filter((st) => st.id !== id);
    const next = removedIndex < current ? current - 1 : current;
    set({
      subtasks: updated,
      current: next,
      remaining: updated[next] ? updated[next].duration * 60 : 0,
    });
  },

  toggleEditingPlan: () => set((s) => ({ editingPlan: !s.editingPlan })),

  reset: () => set(defaultState),
}));
