import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Subtask } from '../models/Task';

interface Props {
  subtasks: Subtask[];
  current: number;
}

export function Timeline({ subtasks, current }: Props) {
  return (
    <div className="w-full space-y-2">
      {subtasks.map((st, i) => {
        const state = st.completed ? 'done' : i === current ? 'active' : 'upcoming';
        return (
          <motion.div
            key={st.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
              state === 'active'
                ? 'bg-violet-500/20 border border-violet-500/30 text-white'
                : state === 'done'
                ? 'text-stone-500'
                : 'text-stone-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                state === 'done'
                  ? 'bg-violet-600 text-white'
                  : state === 'active'
                  ? 'bg-violet-500 text-white'
                  : 'bg-white/10'
              }`}
            >
              {state === 'done' ? (
                <Check size={11} />
              ) : (
                <span className="w-2 h-2 rounded-full bg-current opacity-60" />
              )}
            </div>
            <span className={state === 'done' ? 'line-through opacity-50' : ''}>{st.title}</span>
            <span className="ml-auto text-xs opacity-50">{st.duration}m</span>
          </motion.div>
        );
      })}
    </div>
  );
}
