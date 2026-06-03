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
        <ChevronUp className="w-6 h-6 text-yellow-400" strokeWidth={2.5} />
      </motion.button>

      {/* תצוגת הספרה */}
      <div className="w-12 h-20 md:w-14 md:h-24 flex items-center justify-center rounded-2xl relative"
        style={{
          background: isUndefined ? 'rgba(15,20,40,0.6)' : 'rgba(20,28,55,0.75)',
          border: hasError && isUndefined
            ? '1.5px solid rgba(248,113,113,0.5)'
            : !isUndefined
              ? '1.5px solid rgba(251,191,36,0.55)'
              : '1.5px solid rgba(251,191,36,0.22)',
          boxShadow: !isUndefined
            ? '0 0 14px rgba(251,191,36,0.12), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)'
            : 'inset 0 2px 8px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
        }}>
        {/* top specular */}
        {!isUndefined && (
          <div className="absolute top-0 inset-x-2 h-px rounded-full"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)' }} />
        )}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
            initial={{ y: -10, opacity: 0, scale: 0.75 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.75 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className={`inline-block text-6xl md:text-7xl tracking-wide select-none
              ${hasError && isUndefined ? 'text-red-400' : isUndefined ? 'text-slate-600' : 'text-white'}`}
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
        <ChevronDown className="w-6 h-6 text-yellow-400" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}