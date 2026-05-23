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
        whileTap={{ scale: 0.88 }}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
          bg-yellow-500/15 border border-yellow-500/40
          hover:bg-yellow-500/30 hover:border-yellow-400/70
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-150"
      >
        <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" strokeWidth={2.5} />
      </motion.button>

      {/* תצוגת הספרה */}
      <div className="w-12 h-14 md:w-14 md:h-16 flex items-center justify-center
        bg-slate-700/60 rounded-xl border border-slate-600/50 shadow-inner">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
            initial={{ y: -8, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`inline-block text-3xl md:text-4xl font-black tracking-tight select-none
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
        whileTap={{ scale: 0.88 }}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
          bg-yellow-500/15 border border-yellow-500/40
          hover:bg-yellow-500/30 hover:border-yellow-400/70
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-150"
      >
        <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}