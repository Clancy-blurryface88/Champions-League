import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Odometer-roll digit reveal for points values — each column rolls
// independently through two full spins and settles on the real digit,
// rightmost digits settling first. Ported from the "30 effects" admin demo
// (AdminScoreEffectsDemo.jsx, variant #2).
//
// By default, triggered by IntersectionObserver (+ a fallback timeout, same
// pattern as the SlotBadge position-badge component in Predictions.jsx).
// IMPORTANT: this only detects *geometric* viewport intersection — it does
// NOT know about a parent's own opacity/blur reveal animation. An element
// occupies its layout box (and so counts as "intersecting") from the moment
// it mounts, even while a parent motion.div is animating it from opacity:0.
// So when this is used inside a list whose rows reveal on a staggered
// opacity/blur timer (like PredictionsList's per-row reveal), the default
// auto-detection fires almost immediately for every row regardless of that
// row's own reveal delay — meaning the roll can finish well before a
// late-revealing row (e.g. rank 1, revealed last) is actually visible,
// while an early-revealing row (rank N, revealed first) still happens to
// catch it mid-roll. That looks exactly like "only the first-revealed rows
// show the effect."
//
// Fix: pass an explicit `trigger` boolean tied to the row's *actual* reveal
// completion (e.g. via the row's own `onAnimationComplete`) wherever rows
// reveal on a stagger. `trigger` overrides the auto-detection entirely when
// provided; omit it only for standalone/non-staggered usage.

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

export default function OdometerValue({ target, height = 16, width = 8, trigger, decimals = 2 }) {
  const [ref, autoInView] = useInViewOnce();
  const active = trigger !== undefined ? trigger : autoInView;
  const str = (target || 0).toFixed(decimals);
  return (
    <span ref={trigger === undefined ? ref : undefined} style={{ display: 'inline-flex' }}>
      {str.split('').map((c, i) =>
        c === '.'
          ? <span key={i}>.</span>
          : <OdometerDigit key={i} digit={c} delay={str.slice(i + 1).replace('.', '').length * 0.12} trigger={active} height={height} width={width} />
      )}
    </span>
  );
}
