import React, { useState, useEffect, useRef } from 'react';

export default function BlurScoreCounter({ value, duration = 1.5, delay = 0, className = '', showDecimals = true }) {
  const [display, setDisplay] = useState(0);
  const [blur, setBlur] = useState(14);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setDisplay(0);
    setBlur(14);

    timeoutRef.current = setTimeout(() => {
      const start = performance.now();
      const ms = duration * 1000;

      const raf = (now) => {
        const p = Math.min((now - start) / ms, 1);
        const e = 1 - Math.pow(1 - p, 2.5);
        setDisplay(value * e);
        setBlur(14 * (1 - Math.pow(p, 0.7)));
        if (p < 1) rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, delay]);

  const formatted = showDecimals
    ? (Math.round(display * 100) / 100).toFixed(2)
    : Math.round(display).toString();

  return (
    <span
      className={className}
      style={{ display: 'inline-block', filter: `blur(${blur.toFixed(1)}px)`, transition: 'filter 0.04s linear' }}
    >
      {formatted}
    </span>
  );
}
