import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

type Mood = 'idle' | 'happy' | 'thinking' | 'excited';

interface Props {
  mood?: Mood;
  size?: number;
}

export function Companion({ mood = 'idle', size = 80 }: Props) {
  const controls = useAnimation();

  useEffect(() => {
    if (mood === 'excited') {
      controls.start({
        y: [0, -16, 0, -10, 0],
        rotate: [0, -5, 5, -3, 0],
        transition: { duration: 0.6, times: [0, 0.2, 0.5, 0.7, 1] },
      });
    } else if (mood === 'happy') {
      controls.start({
        y: [0, -6, 0],
        transition: { duration: 0.4, repeat: 1 },
      });
    } else {
      // idle breathing
      controls.start({
        y: [0, -3, 0],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      });
    }
  }, [mood, controls]);

  return (
    <motion.div animate={controls} style={{ display: 'inline-block', fontSize: size }}>
      <PlatypusSVG mood={mood} size={size} />
    </motion.div>
  );
}

function PlatypusSVG({ mood, size }: { mood: Mood; size: number }) {
  const eyeY = mood === 'happy' || mood === 'excited' ? 36 : 38;
  const mouthPath =
    mood === 'happy' || mood === 'excited'
      ? 'M 36 54 Q 44 62 52 54'
      : mood === 'thinking'
      ? 'M 38 56 Q 44 58 50 56'
      : 'M 38 56 Q 44 60 50 56';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="44" cy="52" rx="26" ry="24" fill="#7c6fa0" />
      {/* Belly */}
      <ellipse cx="44" cy="56" rx="16" ry="14" fill="#b8a9d4" opacity="0.5" />
      {/* Head */}
      <ellipse cx="44" cy="34" rx="20" ry="18" fill="#7c6fa0" />
      {/* Bill */}
      <ellipse cx="44" cy="50" rx="14" ry="6" fill="#c49a6c" />
      <ellipse cx="44" cy="49" rx="12" ry="4" fill="#d4aa7d" />
      {/* Nostrils */}
      <circle cx="40" cy="48" r="1.5" fill="#a07850" />
      <circle cx="48" cy="48" r="1.5" fill="#a07850" />
      {/* Eyes */}
      <circle cx="37" cy={eyeY} r="4" fill="#1a1025" />
      <circle cx="51" cy={eyeY} r="4" fill="#1a1025" />
      <circle cx="38.5" cy={eyeY - 1} r="1.5" fill="white" opacity="0.8" />
      <circle cx="52.5" cy={eyeY - 1} r="1.5" fill="white" opacity="0.8" />
      {/* Mouth */}
      <path d={mouthPath} stroke="#1a1025" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Tail */}
      <path d="M 68 60 Q 82 55 80 70 Q 75 78 64 72" fill="#7c6fa0" />
      {/* Feet */}
      <ellipse cx="32" cy="74" rx="9" ry="5" fill="#c49a6c" />
      <ellipse cx="56" cy="74" rx="9" ry="5" fill="#c49a6c" />
      {/* Webbing lines */}
      <path d="M 26 74 L 30 70 M 30 76 L 33 71 M 34 76 L 36 72" stroke="#a07850" strokeWidth="1" strokeLinecap="round" />
      <path d="M 50 74 L 54 70 M 54 76 L 57 71 M 58 76 L 60 72" stroke="#a07850" strokeWidth="1" strokeLinecap="round" />
      {/* Excited sparkles */}
      {(mood === 'excited' || mood === 'happy') && (
        <>
          <text x="70" y="20" fontSize="12" fill="#fbbf24">✦</text>
          <text x="8" y="24" fontSize="10" fill="#a78bfa">✦</text>
        </>
      )}
    </svg>
  );
}
