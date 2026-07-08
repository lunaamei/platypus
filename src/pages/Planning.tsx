import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Pencil, Check } from 'lucide-react';
import { Companion } from '../components/Companion';
import { SubtaskEditor } from '../components/SubtaskEditor';
import { useSessionStore } from '../store/sessionStore';

export function Planning() {
  const { task, subtasks, setPhase, updateSubtask, addSubtask, removeSubtask } = useSessionStore();
  const [editing, setEditing] = useState(false);

  const totalMinutes = subtasks.reduce((sum, s) => sum + s.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="flex flex-col items-center justify-center min-h-screen gap-8 px-6"
    >
      <div className="flex flex-col items-center gap-3">
        <Companion mood="thinking" size={80} />
        <p className="text-stone-400 text-sm">I've got a plan for you.</p>
      </div>

      <div className="w-full max-w-sm bg-white/4 border border-white/8 rounded-2xl p-5 flex flex-col gap-4">
        <div>
          <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Goal</p>
          <p className="text-white font-medium">{task}</p>
        </div>

        <div className="flex items-center gap-2 text-violet-300">
          <Clock size={14} />
          <span className="text-sm font-medium">Estimated time: {timeLabel}</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-stone-500 uppercase tracking-wider">Today's plan</p>
            <button
              onClick={() => setEditing((e) => !e)}
              className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200 transition-colors"
            >
              {editing ? <><Check size={12} /> Done editing</> : <><Pencil size={12} /> Edit plan</>}
            </button>
          </div>

          {editing ? (
            <SubtaskEditor
              subtasks={subtasks}
              updateSubtask={updateSubtask}
              addSubtask={addSubtask}
              removeSubtask={removeSubtask}
            />
          ) : (
            <div className="space-y-2">
              {subtasks.map((st, i) => (
                <motion.div
                  key={st.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2 text-sm text-stone-300"
                >
                  <span className="w-4 h-4 rounded border border-white/20 flex-shrink-0" />
                  <span>{st.title}</span>
                  <span className="ml-auto text-stone-500 text-xs">{st.duration}m</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {!editing && <p className="text-stone-500 text-sm italic">Looks good?</p>}
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setPhase('session')}
        className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl text-sm font-medium transition-colors"
      >
        Start Session
      </motion.button>
    </motion.div>
  );
}
