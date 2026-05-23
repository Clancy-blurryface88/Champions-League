import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScoreInput({ value, onChange, hasError, disabled }) {
  const handleIncrement = () => {
    if (disabled) return;
    const currentValue = value === undefined || value === null ? -1 : value;
    onChange(currentValue + 1);
  };

  const handleDecrement = () => {
    if (disabled) return;
    if (value === undefined || value === null || value === 0) return;
    onChange(value - 1);
  };

  const displayValue = (value === undefined || value === null) ? '?' : value;
  const isUndefined = value === undefined || value === null;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* חץ למעלה */}
      <motion.button
        onClick={handleIncrement}
        disabled={disabled}
        whileTap={{ scale: 0.85 }}
        className="flex items-center justify-center
          hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed
          transition-opacity duration-150"
      >
        <ChevronUp className="w-4 h-4 text-yellow-400" strokeWidth={3} />
      </motion.button>

      {/* תצוגת הספרה */}
      <div className="w-12 h-20 md:w-14 md:h-24 flex items-center justify-center
        bg-slate-700/60 rounded-2xl border border-slate-600/50 shadow-inner">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
            initial={{ y: -8, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`inline-block text-5xl md:text-6xl font-black tracking-tight select-none
              ${hasError && isUndefined ? 'text-red-400' : isUndefined ? 'text-slate-500' : 'text-white'}`}
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* חץ למטה */}
      <motion.button
        onClick={handleDecrement}
        disabled={disabled || value === 0 || isUndefined}
        whileTap={{ scale: 0.85 }}
        className="flex items-center justify-center
          hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed
          transition-opacity duration-150"
      >
        <ChevronDown className="w-4 h-4 text-yellow-400" strokeWidth={3} />
      </motion.button>
    </div>
  );
}