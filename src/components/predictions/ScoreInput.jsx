import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScoreInput({ value, onChange, hasError, disabled }) {
  const dragState = useRef(null);

  const handlePointerDown = (e) => {
    if (disabled) return;
    dragState.current = { startY: e.clientY, startValue: value === undefined || value === null ? -1 : value, steps: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (disabled || !dragState.current || e.buttons !== 1) return;
    const dy = dragState.current.startY - e.clientY;
    const steps = Math.round(dy / 24); // ~24px per unit
    if (steps !== dragState.current.steps) {
      dragState.current.steps = steps;
      onChange(Math.max(0, dragState.current.startValue + steps));
    }
  };

  const handlePointerUp = () => {
    if (disabled || !dragState.current) return;
    // A tap with no meaningful drag still bumps the value by one — keeps the
    // control usable with a single finger tap, not just a drag gesture.
    if (dragState.current.steps === 0) {
      onChange(Math.max(0, dragState.current.startValue + 1));
    }
    dragState.current = null;
  };

  const displayValue = (value === undefined || value === null) ? '?' : value;
  const isUndefined = value === undefined || value === null;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="w-12 h-20 md:w-14 md:h-24 flex items-center justify-center rounded-[20px] relative overflow-hidden select-none"
      style={{
        touchAction: 'none',
        cursor: disabled ? 'default' : 'grab',
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
      <div style={{ perspective: 240 }}>
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
    </div>
  );
}
