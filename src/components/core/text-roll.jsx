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

  // Total time for one roll-out + roll-in cycle (in seconds)
  const cycleDuration = duration * 2;
  // Hold time between cycles
  const holdTime = loopInterval / 1000 - cycleDuration;

  return (
    <span className={cn('inline-flex', className)} aria-label={text} style={{ perspective: '500px' }}>
      {text.split('').map((char, i) => {
        const charDelay = i * stagger;

        return (
          <motion.span
            key={i}
            initial={variants.exit.animate}
            animate={
              loop
                ? {
                    rotateX: [0, 90, 90, 0],
                    filter: ['blur(0px)', 'blur(2px)', 'blur(2px)', 'blur(0px)'],
                  }
                : variants.exit.animate
            }
            transition={
              loop
                ? {
                    duration: cycleDuration,
                    delay: charDelay,
                    ease: 'easeInOut',
                    times: [0, 0.45, 0.55, 1],
                    repeat: Infinity,
                    repeatDelay: holdTime > 0 ? holdTime : 0,
                  }
                : {
                    duration,
                    delay: charDelay,
                    ease: 'easeInOut',
                  }
            }
            style={{
              display: 'inline-block',
              transformOrigin: 'center center',
              whiteSpace: 'pre',
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}
