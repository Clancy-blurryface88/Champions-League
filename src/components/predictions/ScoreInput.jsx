import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScoreInput({ value, onChange, hasError, disabled }) {
  // Dragging updates this local value only — instant, cheap re-render of just
  // this pill. Calling the parent's onChange on every pixel of movement was
  // triggering a re-render of the whole match card on every step, which made
  // fast pointermove events coalesce and the count skip out of order. The
  // parent is only told about the change once, when the drag ends.
  const [localValue, setLocalValue] = useState(value);
  const dragState = useRef(null);

  useEffect(() => {
    if (!dragState.current) setLocalValue(value);
  }, [value]);

  const handlePointerDown = (e) => {
    if (disabled) return;
    const startValue = localValue === undefined || localValue === null ? -1 : localValue;
    dragState.current = { startY: e.clientY, startValue, steps: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (disabled || !dragState.current || e.buttons !== 1) return;
    const dy = dragState.current.startY - e.clientY;
    const steps = Math.round(dy / 24); // ~24px per unit
    if (steps !== dragState.current.steps) {
      dragState.current.steps = steps;
      setLocalValue(Math.max(0, dragState.current.startValue + steps));
    }
  };

  const handlePointerUp = () => {
    if (disabled || !dragState.current) return;
    // A tap with no meaningful drag still bumps the value by one — keeps the
    // control usable with a single finger tap, not just a drag gesture.
    const finalValue = dragState.current.steps === 0
      ? Math.max(0, dragState.current.startValue + 1)
      : Math.max(0, dragState.current.startValue + dragState.current.steps);
    setLocalValue(finalValue);
    dragState.current = null;
    onChange(finalValue);
  };

  const displayValue = (localValue === undefined || localValue === null) ? '?' : localValue;
  const isUndefined = localValue === undefined || localValue === null;

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
