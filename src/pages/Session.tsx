import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Check, SkipForward, X, Pencil } from 'lucide-react';
import { Companion } from '../components/Companion';
import { ChatBubble } from '../components/ChatBubble';
import { ProgressBar } from '../components/ProgressBar';
import { Timeline } from '../components/Timeline';
import { SubtaskEditor } from '../components/SubtaskEditor';
import { useSessionStore } from '../store/sessionStore';
import { getEncouragement } from '../ai/encouragement';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function Session() {
  const {
    task, subtasks, current, remaining, paused,
    encouragement, phase, editingPlan,
    tickTimer, togglePause, completeCurrentSubtask,
    setEncouragement, reset,
    updateSubtask, addSubtask, removeSubtask, toggleEditingPlan,
  } = useSessionStore();

  const previousMessages = useRef<string[]>([]);
  const elapsedRef = useRef(0);

  const currentSubtask = subtasks[current];
  const totalDuration = currentSubtask ? currentSubtask.duration * 60 : 1;
  const progress = 1 - remaining / totalDuration;

  // Tick timer
  useEffect(() => {
    if (phase !== 'session') return;
    const id = setInterval(() => {
      tickTimer();
      elapsedRef.current += 1;
    }, 1000);
    return () => clearInterval(id);
  }, [phase, tickTimer]);

  // Encouragement every 10 minutes
  const fetchEncouragement = useCallback(async () => {
    if (!currentSubtask) return;
    const msg = await getEncouragement(
      currentSubtask.title,
      Math.floor(elapsedRef.current / 60),
      previousMessages.current
    );
    previousMessages.current = [...previousMessages.current.slice(-4), msg];
    setEncouragement(msg);
  }, [currentSubtask, setEncouragement]);

  useEffect(() => {
    fetchEncouragement();
  }, [current]); // refresh on subtask change

  useEffect(() => {
    if (phase !== 'session') return;
    const id = setInterval(fetchEncouragement, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [phase, fetchEncouragement]);

  // Companion mood
  const mood =
    phase === 'complete'
      ? 'excited'
      : paused
      ? 'thinking'
      : remaining < 60
      ? 'happy'
      : 'idle';

  if (phase === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-screen gap-6 px-6"
      >
        <Companion mood="excited" size={110} />
        <div className="text-center">
          <p className="text-4xl mb-2">🎉</p>
          <h2 className="text-2xl font-semibold text-white mb-1">Amazing!</h2>
          <p className="text-stone-400">
            <span className="text-violet-300 font-medium">{task}</span> complete.
          </p>
          <p className="text-stone-500 text-sm mt-2">We waddled all the way through.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={reset}
          className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          Start something new
        </motion.button>
      </motion.div>
    );
  }

  if (editingPlan) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col min-h-screen px-4 py-8 max-w-sm mx-auto gap-4"
      >
        <div className="flex items-center justify-between">
          <p className="text-white font-medium">Edit plan</p>
          <button
            onClick={toggleEditingPlan}
            className="text-xs text-violet-300 hover:text-violet-200 transition-colors"
          >
            Done editing
          </button>
        </div>
        <div className="w-full bg-white/4 border border-white/8 rounded-2xl p-5">
          <SubtaskEditor
            subtasks={subtasks}
            updateSubtask={updateSubtask}
            addSubtask={addSubtask}
            removeSubtask={removeSubtask}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center min-h-screen px-4 py-8 max-w-sm mx-auto gap-6"
    >
      {/* Widget card */}
      <div className="w-full bg-white/4 border border-white/8 rounded-2xl p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Companion mood={mood} size={64} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-0.5">Current Task</p>
            <p className="text-white font-medium text-sm leading-snug">{task}</p>
            <p className="text-xs text-stone-500 uppercase tracking-wider mt-2 mb-0.5">Current Step</p>
            <p className="text-violet-300 text-sm font-medium leading-snug truncate">
              {currentSubtask?.title}
            </p>
          </div>
          <button
            onClick={toggleEditingPlan}
            className="text-stone-500 hover:text-violet-300 transition-colors flex-shrink-0"
            title="Edit plan"
          >
            <Pencil size={14} />
          </button>
        </div>

        {/* Timer */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-mono text-white tabular-nums">
              ⏱ {formatTime(remaining)}
            </span>
            <span className="text-xs text-stone-500">
              {subtasks.filter((s) => s.completed).length}/{subtasks.length} done
            </span>
          </div>
          <ProgressBar value={progress} />
        </div>

        {/* Chat bubble */}
        <AnimatePresence>
          {encouragement && <ChatBubble message={encouragement} />}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={togglePause}
            className="flex-1 flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 text-white rounded-xl py-2.5 text-sm transition-colors"
          >
            {paused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}
          </button>
          <button
            onClick={completeCurrentSubtask}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600/80 hover:bg-violet-600 text-white rounded-xl py-2.5 text-sm transition-colors"
          >
            <Check size={14} /> Done
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={completeCurrentSubtask}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/8 text-stone-400 hover:text-white rounded-xl py-2 text-xs transition-colors"
          >
            <SkipForward size={12} /> Skip
          </button>
          <button
            onClick={() => { reset(); }}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 text-stone-400 hover:text-red-400 rounded-xl py-2 text-xs transition-colors"
          >
            <X size={12} /> Quit
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="w-full">
        <p className="text-xs text-stone-500 uppercase tracking-wider mb-3 px-1">Today's plan</p>
        <Timeline subtasks={subtasks} current={current} />
      </div>
    </motion.div>
  );
}
