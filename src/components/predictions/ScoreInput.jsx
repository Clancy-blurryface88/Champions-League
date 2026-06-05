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
      <div className="w-12 h-20 md:w-14 md:h-24 flex items-center justify-center rounded-[20px] relative overflow-hidden"
        style={{
          background: hasError && isUndefined
            ? 'rgba(248,113,113,0.10)'
            : 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: hasError && isUndefined
            ? '1px solid rgba(248,113,113,0.45)'
            : isUndefined
              ? '1px solid rgba(255,255,255,0.14)'
              : '1px solid rgba(255,255,255,0.28)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 2px 0 rgba(255,255,255,0.50), inset 0 -1px 0 rgba(0,0,0,0.15)',
        }}>
        {/* glass top gloss */}
        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)' }} />
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