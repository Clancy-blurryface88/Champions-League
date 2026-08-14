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

      {/* תצוגת הספרה — לוח פיצול-דפים (split-flap) */}
      <div className="w-12 h-20 md:w-14 md:h-24 relative rounded-[20px] overflow-hidden"
        style={{
          background: hasError && isUndefined
            ? 'rgba(248,113,113,0.07)'
            : 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px) saturate(140%)',
          WebkitBackdropFilter: 'blur(16px) saturate(140%)',
          border: hasError && isUndefined
            ? '1px solid rgba(248,113,113,0.35)'
            : isUndefined
              ? '1px solid rgba(255,255,255,0.10)'
              : '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}>
        {/* glass top gloss */}
        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)' }} />
        <div style={{ perspective: 240 }} className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={displayValue}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              style={{ fontFamily: "'Bebas Neue', sans-serif", display: 'inline-block' }}
              className={`text-6xl md:text-7xl tracking-wide select-none
                ${hasError && isUndefined ? 'text-red-400' : isUndefined ? 'text-slate-600' : 'text-white'}`}
            >
              {displayValue}
            </motion.span>
          </AnimatePresence>
        </div>
        {/* תפר אמצעי בין שני "הדפים" */}
        <div className="absolute left-0 right-0 top-1/2 h-px pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.55)', boxShadow: '0 1px 0 rgba(255,255,255,0.08)' }} />
        {/* הצללה קלה לדף התחתון, לתחושת עומק */}
        <div className="absolute inset-x-0 top-1/2 bottom-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.14) 0%, transparent 35%)' }} />
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
