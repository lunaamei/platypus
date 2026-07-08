import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  message: string;
}

export function ChatBubble({ message }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-stone-300 italic max-w-xs"
      >
        <span className="not-italic text-stone-400 mr-1">💬</span>
        {message}
      </motion.div>
    </AnimatePresence>
  );
}
