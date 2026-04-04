import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/components/utils';

export function SlidingNumber({ 
  number, 
  padStart = false, 
  className = "",
  duration = 0.5,
  delay = 0 
}) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [prevNumber, setPrevNumber] = useState(0);

  useEffect(() => {
    if (number !== prevNumber) {
      const timer = setTimeout(() => {
        setPrevNumber(displayNumber);
        setDisplayNumber(number);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [number, prevNumber, displayNumber, delay]);

  const formattedNumber = padStart ? String(displayNumber).padStart(2, '0') : String(displayNumber);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={displayNumber}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ 
            duration: duration,
            ease: "easeOut"
          }}
          className="block"
        >
          {formattedNumber}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}