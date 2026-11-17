import React from 'react';
import { motion } from 'framer-motion';

// The team's league position under its name in the match card: the number in its zone colour with a
// slow, soft, wide light passing through it.
export default function RankSheen({ value, color }) {
  return (
    <motion.span
      aria-label={`מקום ${value}`}
      animate={{ backgroundPosition: ['150% 0', '-50% 0'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
      style={{
        marginTop: 6, font: '900 16px var(--num-font)', lineHeight: 1,
        backgroundImage: `linear-gradient(110deg, ${color} 30%, #ffffffdd 50%, ${color} 70%)`,
        backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
      }}
    >
      {value}
    </motion.span>
  );
}
