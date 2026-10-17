import React, { useEffect, useRef, useState } from "react";

// Slot-machine number: once `trigger` turns true, every digit spins through random
// values (slightly blurred) and the reels stop one after another, left to right.
// Renders the final value straight away when the user prefers reduced motion.
const SPIN_MS = 380; // first reel stops after this
const STEP_MS = 160; // each next reel stops this much later

export default function SlotValue({ target, trigger, decimals = 2 }) {
  const final = Number(target || 0).toFixed(decimals);
  const [chars, setChars] = useState(() => [...final].map((c) => (c === "." ? "." : "0")));
  const [spinning, setSpinning] = useState([]);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || started.current) { setChars([...final]); setSpinning([]); return; }
    started.current = true;
    const stopAt = [...final].map((_, i) => SPIN_MS + i * STEP_MS);
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const el = t - t0;
      setChars([...final].map((c, i) => (c === "." || el >= stopAt[i] ? c : String(Math.floor(Math.random() * 10)))));
      setSpinning([...final].map((c, i) => c !== "." && el < stopAt[i]));
      if (el < stopAt[stopAt.length - 1]) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, final]);

  return (
    <span className="inline-flex tabular-nums" dir="ltr">
      {chars.map((c, i) => (
        <span key={i} style={{ filter: spinning[i] ? "blur(1.2px)" : undefined }}>{c}</span>
      ))}
    </span>
  );
}
