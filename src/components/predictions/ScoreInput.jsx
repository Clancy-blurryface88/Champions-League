import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// locked: read-only view of a saved prediction — same frame and digits, arrows hidden (space kept so the frame sits where it does when open)
export default function ScoreInput({ value, onChange, hasError, disabled, locked = false }) {
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
        disabled={disabled || locked}
        aria-hidden={locked || undefined}
        style={locked ? { visibility: 'hidden' } : undefined}
        whileTap={{ scale: 0.85 }}
        className="flex items-center justify-center
          hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed
          transition-opacity duration-150"
      >
        <ChevronUp className="w-7 h-7 text-yellow-400" strokeWidth={2.5} />
      </motion.button>

      {/* תצוגת הספרה — מסגרת זכוכית (מלבן מעוגל) */}
      <div className="w-[54px] h-[90px] md:w-16 md:h-[106px] relative rounded-[20px] md:rounded-[22px] overflow-hidden"
        style={{
          background: hasError && isUndefined
            ? 'rgba(52,211,153,0.10)'
            : 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: hasError && isUndefined
            ? '1px solid rgba(52,211,153,0.45)'
            : '1px solid rgba(255,255,255,0.30)',
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.40)',
        }}>
        {/* glass top gloss */}
        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)' }} />
        <div style={{ perspective: 240 }} className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={displayValue}
              // "rubber" change: the new digit squashes in and settles
              initial={{ scaleX: 0.4, scaleY: 1.4, opacity: 0 }}
              animate={{ scaleX: [0.4, 1.25, 0.92, 1], scaleY: [1.4, 0.8, 1.06, 1], opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              transition={{ duration: 0.46, ease: 'easeOut', times: [0, 0.45, 0.75, 1], opacity: { duration: 0.1 } }}
              style={{
                // digits in Karantina (bold); the "?" placeholder keeps Bebas Neue
                fontFamily: isUndefined ? "'Bebas Neue', sans-serif" : "'Karantina', sans-serif",
                fontWeight: isUndefined ? undefined : 700,
                // Karantina digits sit low in their line box (measured: 20.5px above vs 12.5px below at 78px);
                // lift by half the difference so the gap to the frame is the same top and bottom
                y: isUndefined ? 0 : '-0.051em',
                display: 'inline-block',
                ...(isUndefined ? {
                  backgroundImage: 'linear-gradient(135deg, #bbf7d0 0%, #4ade80 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                } : {}),
              }}
              className={`tracking-wide select-none ${isUndefined ? 'text-[66px] md:text-[80px]' : 'text-[86px] md:text-[100px] text-white'}`}
            >
              {displayValue}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* חץ למטה */}
      <motion.button
        onClick={handleDecrement}
        disabled={disabled || locked || value === 0 || isUndefined}
        aria-hidden={locked || undefined}
        style={locked ? { visibility: 'hidden' } : undefined}
        whileTap={{ scale: 0.85 }}
        className="flex items-center justify-center
          hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed
          transition-opacity duration-150"
      >
        <ChevronDown className="w-7 h-7 text-yellow-400" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}
