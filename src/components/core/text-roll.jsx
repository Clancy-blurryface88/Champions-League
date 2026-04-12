import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const DEFAULT_VARIANTS = {
  enter: {
    initial: { rotateX: 0, filter: 'blur(0px)' },
    animate: { rotateX: 90, filter: 'blur(2px)' },
  },
  exit: {
    initial: { rotateX: 90, filter: 'blur(2px)' },
    animate: { rotateX: 0, filter: 'blur(0px)' },
  },
};

export function TextRoll({
  children,
  className,
  duration = 0.3,
  stagger = 0.045,
  loop = false,
  loopInterval = 2000,
  variants = DEFAULT_VARIANTS,
}) {
  const text = typeof children === 'string' ? children : '';
  const [phase, setPhase] = useState('exit'); // 'exit' = visible, 'enter' = rolling out

  useEffect(() => {
    if (!loop) return;

    const totalDuration = text.length * stagger * 1000 + duration * 1000;

    const tick = () => {
      // Roll out (enter phase)
      setPhase('enter');
      setTimeout(() => {
        // Roll in (exit phase)
        setPhase('exit');
      }, totalDuration + 100);
    };

    const interval = setInterval(tick, loopInterval);
    return () => clearInterval(interval);
  }, [loop, loopInterval, text.length, stagger, duration]);

  return (
    <span className={cn('inline-flex', className)} aria-label={text} style={{ perspective: '500px' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${phase}-${i}`}
          initial={variants[phase].initial}
          animate={variants[phase].animate}
          transition={{
            duration,
            delay: i * stagger,
            ease: 'easeInOut',
          }}
          style={{
            display: 'inline-block',
            transformOrigin: phase === 'enter' ? 'bottom center' : 'top center',
            whiteSpace: 'pre',
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
