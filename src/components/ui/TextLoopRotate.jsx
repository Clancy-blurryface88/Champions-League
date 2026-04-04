import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';

export function TextLoopRotate({ texts = [], className = "", interval = 4.5 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(-1);

  useEffect(() => {
    if (!texts || texts.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % texts.length;
        setDirection(newIndex === 0 ? -1 : 1);
        return newIndex;
      });
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [texts, interval]);

  if (!texts || texts.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-center py-2 text-center">
      <div className={cn('relative inline-block overflow-hidden', 'text-xl font-bold text-blue-400', className)}>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{
              y: -direction * 20,
              rotateX: -direction * 90,
              opacity: 0,
              filter: 'blur(4px)',
            }}
            animate={{
              y: 0,
              rotateX: 0,
              opacity: 1,
              filter: 'blur(0px)',
            }}
            exit={{
              y: direction * 20,
              rotateX: direction * 90,
              opacity: 0,
              filter: 'blur(4px)',
            }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 19,
              mass: 1.2,
            }}
            className="block whitespace-nowrap"
          >
            {texts[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}