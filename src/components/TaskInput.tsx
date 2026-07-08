import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Props {
  onSubmit: (goal: string) => void;
  loading?: boolean;
}

export function TaskInput({ onSubmit, loading }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const goal = value.trim();
    if (!goal || loading) return;
    onSubmit(goal);
  };

  return (
    <div className="w-full flex gap-2">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="What would you like to accomplish today?"
        disabled={loading}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 outline-none focus:border-violet-500/50 focus:bg-white/8 transition-colors disabled:opacity-50"
        autoFocus
      />
      <motion.button
        onClick={handleSubmit}
        disabled={!value.trim() || loading}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <ArrowRight size={16} />
        )}
      </motion.button>
    </div>
  );
}
