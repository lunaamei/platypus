import { motion } from 'framer-motion';

interface Props {
  value: number; // 0–1
  color?: string;
}

export function ProgressBar({ value, color = '#a78bfa' }: Props) {
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={false}
        animate={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}
