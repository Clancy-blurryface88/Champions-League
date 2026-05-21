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

  const cycleDuration = duration * 2;
  const holdTime = loopInterval / 1000 - cycleDuration;

  return (
    <span className={cn('inline-flex', className)} aria-label={text} style={{ perspective: '800px' }}>
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
                    filter: [
                      'blur(0px) brightness(1)',
                      'blur(1px) brightness(2)',
                      'blur(1px) brightness(2)',
                      'blur(0px) brightness(1)',
                    ],
                    color: ['#ffffff', '#f5c518', '#f5c518', '#ffffff'],
                    scale: [1, 1.15, 1.15, 1],
                    textShadow: [
                      '0 0 0px rgba(245,197,24,0)',
                      '0 0 24px rgba(245,197,24,1), 0 0 48px rgba(245,197,24,0.5)',
                      '0 0 24px rgba(245,197,24,1), 0 0 48px rgba(245,197,24,0.5)',
                      '0 0 0px rgba(245,197,24,0)',
                    ],
                  }
                : variants.exit.animate
            }
            transition={
              loop
                ? {
                    duration: cycleDuration,
                    delay: charDelay,
                    ease: [0.4, 0, 0.2, 1],
                    times: [0, 0.4, 0.6, 1],
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
