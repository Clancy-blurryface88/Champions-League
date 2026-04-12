import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TextRoll({ children, className, duration = 0.5, stagger = 0.05, delay = 0 }) {
  const text = typeof children === 'string' ? children : '';

  return (
    <span className={cn('inline-flex overflow-hidden', className)} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ rotateX: 90, opacity: 0, y: '0.3em' }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
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
  );
}
