import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '../utils';

export function TextLoop({
  children,
  className = '',
  interval = 2.5,
  transition = {
    type: 'spring',
    stiffness: 150,
    damping: 19,
    mass: 1.2,
  },
  variants = {
    initial: { y: -20, rotateX: -90, opacity: 0, filter: 'blur(4px)' },
    animate: { y: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)' },
    exit: { y: 20, rotateX: 90, opacity: 0, filter: 'blur(4px)' },
  },
  onIndexChange,
}) {
  const [index, setIndex] = useState(0);
  
  // Convert children to array safely
  const items = Array.isArray(children) ? children : [children];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % items.length;
        if (onIndexChange) {
          onIndexChange(newIndex);
        }
        return newIndex;
      });
    }, interval * 1000);

    return () => clearInterval(intervalId);
  }, [items.length, interval, onIndexChange]);

  return (
    <div className={cn('relative inline-block overflow-hidden', className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={transition}
        >
          {items[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}