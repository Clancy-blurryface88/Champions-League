import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TextShimmer({ children, className, duration = 2 }) {
  return (
    <motion.span
      className={cn(
        'inline-block bg-[linear-gradient(110deg,rgba(255,255,255,0.4),45%,rgba(255,255,255,1),55%,rgba(255,255,255,0.4))] bg-[length:200%_100%] bg-clip-text text-transparent',
        className
      )}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        repeat: Infinity,
        duration: duration,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
}