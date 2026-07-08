import { motion } from 'framer-motion';
import { useState } from 'react';
import { Companion } from '../components/Companion';
import { TaskInput } from '../components/TaskInput';
import { generatePlan } from '../ai/planner';
import { useSessionStore } from '../store/sessionStore';

export function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setTask, setSubtasks, setPhase } = useSessionStore();

  const handleGoal = async (goal: string) => {
    setLoading(true);
    setError('');
    try {
      const plan = await generatePlan(goal);
      setTask(plan.title);
      setSubtasks(plan.subtasks);
      setPhase('planning');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[Platypus] plan error:', msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="flex flex-col items-center justify-center min-h-screen gap-8 px-6"
    >
      <div className="flex flex-col items-center gap-4">
        <Companion mood="idle" size={100} />
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-white"
        >
          Hello!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-stone-400 text-center"
        >
          What would you like to accomplish today?
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-md"
      >
        <TaskInput onSubmit={handleGoal} loading={loading} />
        {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
      </motion.div>
    </motion.div>
  );
}
