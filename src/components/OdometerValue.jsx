import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Odometer-roll digit reveal for points values — each column rolls
// independently through two full spins and settles on the real digit,
// rightmost digits settling first. Ported from the "30 effects" admin demo
// (AdminScoreEffectsDemo.jsx, variant #2).
//
// Triggered by IntersectionObserver (+ a fallback timeout, same pattern as
// the SlotBadge position-badge component in Predictions.jsx) instead of a
// fixed mount-relative delay — the surrounding lists this is used in often
// reveal their rows on a staggered timer independent of scroll position, so
// a mount-relative delay meant the roll for most rows had already finished
// off-screen by the time the user actually scrolled to see them.

function useInViewOnce() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    const fallback = setTimeout(() => setInView(true), 700);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);
  return [ref, inView];
}

function OdometerDigit({ digit, delay = 0, height = 16, width = 8, trigger }) {
  const spins = 2;
  const totalSteps = spins * 10 + Number(digit);
  const strip = Array.from({ length: totalSteps + 1 }, (_, i) => i % 10);
  return (
    <span style={{ height, width, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle' }}>
      <motion.span
        style={{ display: 'block' }}
        initial={{ y: 0 }}
        animate={trigger ? { y: -totalSteps * height } : { y: 0 }}
        transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {strip.map((d, i) => (
          <span key={i} style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d}</span>
        ))}
      </motion.span>
    </span>
  );
}

export default function OdometerValue({ target, height = 16, width = 8 }) {
  const [ref, inView] = useInViewOnce();
  const str = (target || 0).toFixed(2);
  return (
    <span ref={ref} style={{ display: 'inline-flex' }}>
      {str.split('').map((c, i) =>
        c === '.'
          ? <span key={i}>.</span>
          : <OdometerDigit key={i} digit={c} delay={str.slice(i + 1).replace('.', '').length * 0.12} trigger={inView} height={height} width={width} />
      )}
    </span>
  );
}
