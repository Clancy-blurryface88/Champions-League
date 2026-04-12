import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TextRoll({ children, className, duration = 0.4, stagger = 0.045, delay = 0, loop = false, loopInterval = 2000 }) {
  const text = typeof children === 'string' ? children : '';
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    if (!loop) return;
    const totalAnimationTime = delay * 1000 + text.length * stagger * 1000 + duration * 1000;
    const interval = Math.max(loopInterval, totalAnimationTime + 300);
    const t = setInterval(() => setIteration(i => i + 1), interval);
    return () => clearInterval(t);
  }, [loop, loopInterval, text.length, stagger, duration, delay]);

  return (
    <AnimatePresence mode="wait">
      <span key={iteration} className={cn('inline-flex', className)} aria-label={text}>
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.215, 0.61, 0.355, 1],
            }}
            style={{ display: 'inline-block', transformOrigin: 'top center', whiteSpace: 'pre' }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </AnimatePresence>
  );
}
