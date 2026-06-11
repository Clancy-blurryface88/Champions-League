import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate, useSpring } from 'framer-motion';

const TARGET = 47.5;
const DEMO_DURATION = 2200; // ms

/* ─── shared hook: triggers re-run on key change ─── */
function useRun(key) {
  const [tick, setTick] = useState(0);
  useEffect(() => { setTick(t => t + 1); }, [key]);
  return tick;
}

/* ─── 1. easeOut count-up (baseline) ─── */
function D1({ run }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    setV(0);
    const start = performance.now();
    const dur = DEMO_DURATION;
    const raf = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(TARGET * e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span>{v.toFixed(2)}</span>;
}

/* ─── 2. Spring bounce ─── */
function D2({ run }) {
  const mv = useMotionValue(0);
  const disp = useTransform(mv, x => x.toFixed(2));
  useEffect(() => {
    mv.set(0);
    const ctrl = animate(mv, TARGET, { type: 'spring', stiffness: 60, damping: 8, mass: 1 });
    return () => ctrl.stop();
  }, [run]);
  return <motion.span>{disp}</motion.span>;
}

/* ─── 3. Overshoot & settle ─── */
function D3({ run }) {
  const mv = useMotionValue(0);
  const disp = useTransform(mv, x => x.toFixed(2));
  useEffect(() => {
    mv.set(0);
    const ctrl = animate(mv, TARGET, { type: 'spring', stiffness: 120, damping: 6, mass: 0.8 });
    return () => ctrl.stop();
  }, [run]);
  return <motion.span>{disp}</motion.span>;
}

/* ─── 4. Slot machine (fast cycling then landing) ─── */
function D4({ run }) {
  const [v, setV] = useState('00.00');
  useEffect(() => {
    let frame = 0;
    const total = 55;
    const id = setInterval(() => {
      frame++;
      const progress = frame / total;
      if (progress < 0.85) {
        const r = (Math.random() * TARGET * 1.5).toFixed(2);
        setV(r);
      } else {
        setV(TARGET.toFixed(2));
        clearInterval(id);
      }
    }, DEMO_DURATION / 55);
    return () => clearInterval(id);
  }, [run]);
  return <span style={{ fontFamily: 'monospace' }}>{v}</span>;
}

/* ─── 5. Random scramble → settle ─── */
function D5({ run }) {
  const [v, setV] = useState('??');
  useEffect(() => {
    const chars = '0123456789';
    let elapsed = 0;
    const step = 60;
    const id = setInterval(() => {
      elapsed += step;
      const p = elapsed / DEMO_DURATION;
      if (p >= 1) { setV(TARGET.toFixed(2)); clearInterval(id); return; }
      const partial = (TARGET * p).toFixed(2).split('');
      const scrambled = partial.map((c, i) =>
        i < partial.length * p * 1.4 ? c : chars[Math.floor(Math.random() * 10)]
      ).join('');
      setV(scrambled);
    }, step);
    return () => clearInterval(id);
  }, [run]);
  return <span style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>{v}</span>;
}

/* ─── 6. Stagger digit reveal ─── */
function D6({ run }) {
  const str = TARGET.toFixed(2);
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    setRevealed(0);
    const delay = DEMO_DURATION / str.length;
    const ids = str.split('').map((_, i) =>
      setTimeout(() => setRevealed(r => r + 1), i * delay)
    );
    return () => ids.forEach(clearTimeout);
  }, [run]);
  return (
    <span style={{ fontFamily: 'monospace' }}>
      {str.split('').map((c, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: -8 }}
          animate={i < revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}>
          {c}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── 7. Blur → focus reveal ─── */
function D7({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(12);
  useEffect(() => {
    setV(0); setBlur(12);
    const start = performance.now();
    const raf = (t) => {
      const p = Math.min((t - start) / DEMO_DURATION, 1);
      const e = 1 - Math.pow(1 - p, 2);
      setV(TARGET * e);
      setBlur(12 * (1 - e));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, transition: 'filter 0.05s' }}>{v.toFixed(2)}</span>;
}

/* ─── 8. Scale pop at landing ─── */
function D8({ run }) {
  const [v, setV] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setV(0); setDone(false);
    const start = performance.now();
    const dur = DEMO_DURATION * 0.75;
    const raf = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(TARGET * e);
      if (p >= 1) setDone(true);
      else requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return (
    <motion.span
      animate={done ? { scale: [1, 1.5, 1], color: ['#4ade80', '#fbbf24', '#4ade80'] } : {}}
      transition={{ duration: 0.5 }}>
      {v.toFixed(2)}
    </motion.span>
  );
}

/* ─── 9. Pulse on each integer ─── */
function D9({ run }) {
  const [v, setV] = useState(0);
  const [pulse, setPulse] = useState(false);
  const lastInt = useRef(-1);
  useEffect(() => {
    setV(0); lastInt.current = -1;
    const start = performance.now();
    const raf = (t) => {
      const p = Math.min((t - start) / DEMO_DURATION, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      const cur = TARGET * e;
      setV(cur);
      const curInt = Math.floor(cur);
      if (curInt !== lastInt.current) { lastInt.current = curInt; setPulse(true); setTimeout(() => setPulse(false), 100); }
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return (
    <motion.span animate={pulse ? { scale: 1.18, color: '#fbbf24' } : { scale: 1, color: '#4ade80' }} transition={{ duration: 0.1 }}>
      {v.toFixed(2)}
    </motion.span>
  );
}

/* ─── 10. Neon flicker count-up ─── */
function D10({ run }) {
  const [v, setV] = useState(0);
  const [flicker, setFlicker] = useState(1);
  useEffect(() => {
    setV(0);
    const start = performance.now();
    const raf = (t) => {
      const p = Math.min((t - start) / DEMO_DURATION, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setFlicker(Math.random() > 0.08 ? 1 : 0.3);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return (
    <span style={{
      opacity: flicker,
      color: '#67e8f9',
      textShadow: '0 0 8px #67e8f9, 0 0 20px #0891b2',
    }}>{v.toFixed(2)}</span>
  );
}

/* ─── 11. Color shift (red→yellow→green) ─── */
function D11({ run }) {
  const [v, setV] = useState(0);
  const [p, setP] = useState(0);
  useEffect(() => {
    setV(0); setP(0);
    const start = performance.now();
    const raf = (t) => {
      const prog = Math.min((t - start) / DEMO_DURATION, 1);
      const e = 1 - Math.pow(1 - prog, 2.5);
      setV(TARGET * e);
      setP(e);
      if (prog < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  const r = Math.round(p < 0.5 ? 248 : 248 - (p - 0.5) * 2 * (248 - 74));
  const g = Math.round(p < 0.5 ? 113 + p * 2 * (222 - 113) : 222 + (p - 0.5) * 2 * (222 - 74));
  const b = Math.round(p < 0.5 ? 113 : 74);
  return <span style={{ color: `rgb(${r},${g},${b})`, fontWeight: 800 }}>{v.toFixed(2)}</span>;
}

/* ─── 12. Typewriter digits ─── */
function D12({ run }) {
  const str = TARGET.toFixed(2);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    const delay = DEMO_DURATION / str.length;
    const ids = str.split('').map((_, i) => setTimeout(() => setCount(i + 1), i * delay));
    return () => ids.forEach(clearTimeout);
  }, [run]);
  return (
    <span style={{ fontFamily: 'monospace' }}>
      {str.slice(0, count)}
      {count < str.length && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>_</motion.span>}
    </span>
  );
}

/* ─── 13. easeIn (slow start, fast end) ─── */
function D13({ run }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    setV(0);
    const start = performance.now();
    const raf = (t) => {
      const p = Math.min((t - start) / DEMO_DURATION, 1);
      setV(TARGET * Math.pow(p, 3));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span>{v.toFixed(2)}</span>;
}

/* ─── 14. Binary flicker then reveal ─── */
function D14({ run }) {
  const [v, setV] = useState('00000000');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDone(false);
    let frame = 0;
    const total = 40;
    const id = setInterval(() => {
      frame++;
      const p = frame / total;
      if (p >= 1) {
        setV(TARGET.toFixed(2));
        setDone(true);
        clearInterval(id);
        return;
      }
      const bits = Math.round(TARGET * p).toString(2).padStart(8, '0');
      setV(bits);
    }, DEMO_DURATION / total);
    return () => clearInterval(id);
  }, [run]);
  return <span style={{ fontFamily: 'monospace', fontSize: done ? '1em' : '0.7em', letterSpacing: done ? 'normal' : '0.15em', transition: 'font-size 0.3s, letter-spacing 0.3s' }}>{v}</span>;
}

/* ─── 15. Odometer roll (translateY) ─── */
function D15({ run }) {
  const digits = TARGET.toFixed(2).split('');
  const [offsets, setOffsets] = useState(digits.map(() => 0));
  useEffect(() => {
    const delays = digits.map((_, i) => i * (DEMO_DURATION / digits.length / 1.5));
    const ids = digits.map((d, i) => {
      if (d === '.' || d === ',') return null;
      return setTimeout(() => {
        setOffsets(prev => {
          const n = [...prev];
          n[i] = parseInt(d);
          return n;
        });
      }, delays[i]);
    });
    return () => ids.forEach(id => id && clearTimeout(id));
  }, [run]);
  return (
    <span style={{ fontFamily: 'monospace', display: 'inline-flex', overflow: 'hidden', height: '1.2em', alignItems: 'flex-end' }}>
      {digits.map((d, i) => {
        if (d === '.' || d === ',') return <span key={i}>{d}</span>;
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', height: '1.2em' }}>
            <motion.span
              style={{ display: 'flex', flexDirection: 'column' }}
              animate={{ y: `${-offsets[i] * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.08 }}>
              {[0,1,2,3,4,5,6,7,8,9].map(n => <span key={n} style={{ height: '1.2em', display: 'flex', alignItems: 'center' }}>{n}</span>)}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

/* ─── 16. Glitch → stabilize ─── */
function D16({ run }) {
  const [v, setV] = useState(0);
  const [glitchOn, setGlitchOn] = useState(false);
  useEffect(() => {
    setV(0);
    const start = performance.now();
    const raf = (t) => {
      const p = Math.min((t - start) / DEMO_DURATION, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setGlitchOn(p < 0.85 && Math.random() > 0.7);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return (
    <span style={{
      textShadow: glitchOn ? '2px 0 #f43f5e, -2px 0 #38bdf8' : 'none',
      transform: glitchOn ? `translateX(${(Math.random() - 0.5) * 4}px)` : 'none',
      display: 'inline-block',
    }}>{v.toFixed(2)}</span>
  );
}

/* ─── 17. Heartbeat ─── */
function D17({ run }) {
  const [v, setV] = useState(0);
  const [beat, setBeat] = useState(false);
  useEffect(() => {
    setV(0);
    const start = performance.now();
    let lastBeat = 0;
    const beatInterval = 400;
    const raf = (t) => {
      const p = Math.min((t - start) / DEMO_DURATION, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      if (t - lastBeat > beatInterval) { lastBeat = t; setBeat(true); setTimeout(() => setBeat(false), 120); }
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return (
    <motion.span animate={beat ? { scale: [1, 1.25, 0.95, 1.1, 1], color: ['#4ade80', '#f43f5e', '#f43f5e', '#4ade80'] } : {}} transition={{ duration: 0.35 }}>
      {v.toFixed(2)}
    </motion.span>
  );
}

/* ─── 18. Slow burn + glow ─── */
function D18({ run }) {
  const [v, setV] = useState(0);
  const [glow, setGlow] = useState(0);
  useEffect(() => {
    setV(0); setGlow(0);
    const start = performance.now();
    const dur = DEMO_DURATION * 1.6;
    const raf = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const e = p;
      setV(TARGET * e);
      setGlow(e * 24);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ color: '#fbbf24', textShadow: `0 0 ${glow.toFixed(0)}px #f59e0b, 0 0 ${(glow * 2).toFixed(0)}px #d97706` }}>{v.toFixed(2)}</span>;
}

/* ─── 19. Step count (big jumps) ─── */
function D19({ run }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    setV(0);
    const steps = 8;
    const ids = Array.from({ length: steps }, (_, i) =>
      setTimeout(() => setV(TARGET * ((i + 1) / steps)), (i + 1) * (DEMO_DURATION / steps))
    );
    return () => ids.forEach(clearTimeout);
  }, [run]);
  return (
    <motion.span
      key={v}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.15 }}>
      {v.toFixed(2)}
    </motion.span>
  );
}

/* ─── 20. Countdown then reveal ─── */
function D20({ run }) {
  const [v, setV] = useState(TARGET * 2);
  const [phase, setPhase] = useState('down');
  useEffect(() => {
    setV(TARGET * 2); setPhase('down');
    const start = performance.now();
    const halfDur = DEMO_DURATION * 0.5;
    const raf = (t) => {
      const elapsed = t - start;
      if (elapsed < halfDur) {
        const p = elapsed / halfDur;
        setV(TARGET * 2 * (1 - p));
        setPhase('down');
      } else {
        const p = (elapsed - halfDur) / halfDur;
        const e = Math.min(p, 1);
        setV(TARGET * e);
        setPhase('up');
        if (e >= 1) return;
      }
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ color: phase === 'down' ? '#f43f5e' : '#4ade80' }}>{v.toFixed(2)}</span>;
}

/* ─── 21. Matrix chars then number ─── */
function D21({ run }) {
  const chars = '!@#$%&*?';
  const [v, setV] = useState('????');
  useEffect(() => {
    let frame = 0;
    const total = 45;
    const id = setInterval(() => {
      frame++;
      const p = frame / total;
      if (p >= 1) { setV(TARGET.toFixed(2)); clearInterval(id); return; }
      const str = TARGET.toFixed(2).split('').map((c, i) => {
        const revealed = i < p * TARGET.toFixed(2).length * 1.2;
        return revealed ? c : chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      setV(str);
    }, DEMO_DURATION / total);
    return () => clearInterval(id);
  }, [run]);
  return <span style={{ fontFamily: 'monospace', color: '#4ade80', textShadow: '0 0 6px #4ade80' }}>{v}</span>;
}

/* ─── 22. Flip (Y axis) each digit ─── */
function D22({ run }) {
  const str = TARGET.toFixed(2);
  const [flipped, setFlipped] = useState([]);
  useEffect(() => {
    setFlipped([]);
    str.split('').forEach((_, i) => {
      setTimeout(() => setFlipped(prev => [...prev, i]), i * (DEMO_DURATION / str.length));
    });
  }, [run]);
  return (
    <span style={{ fontFamily: 'monospace' }}>
      {str.split('').map((c, i) => (
        <motion.span key={i}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={flipped.includes(i) ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ display: 'inline-block' }}>
          {c}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── 23. Lightning flash then appear ─── */
function D23({ run }) {
  const [phase, setPhase] = useState('hidden');
  useEffect(() => {
    setPhase('hidden');
    const t1 = setTimeout(() => setPhase('flash'), DEMO_DURATION * 0.6);
    const t2 = setTimeout(() => setPhase('shown'), DEMO_DURATION * 0.75);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [run]);
  return (
    <motion.span
      animate={phase === 'flash' ? { opacity: [0,1,0,1,0,1], scale: [1,1.3,1,1.2,1] } : phase === 'shown' ? { opacity: 1 } : { opacity: 0 }}
      style={{ color: phase === 'flash' ? '#fff' : '#fbbf24', textShadow: phase !== 'hidden' ? '0 0 20px #fbbf24, 0 0 40px #f59e0b' : 'none' }}
      transition={{ duration: 0.3 }}>
      {phase === 'hidden' ? '??' : TARGET.toFixed(2)}
    </motion.span>
  );
}

/* ─── 24. Ripple rings on land ─── */
function D24({ run }) {
  const [v, setV] = useState(0);
  const [landed, setLanded] = useState(false);
  useEffect(() => {
    setV(0); setLanded(false);
    const start = performance.now();
    const raf = (t) => {
      const p = Math.min((t - start) / (DEMO_DURATION * 0.8), 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(TARGET * e);
      if (p >= 1) setLanded(true);
      else requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {landed && [0, 1, 2].map(i => (
        <motion.span key={`${run}-${i}`}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          style={{ position: 'absolute', inset: 0, border: '1px solid #4ade80', borderRadius: '50%', display: 'block' }} />
      ))}
      <span>{v.toFixed(2)}</span>
    </span>
  );
}

/* ─── 25. elastic spring (heavy bounce) ─── */
function D25({ run }) {
  const mv = useMotionValue(0);
  const disp = useTransform(mv, x => x.toFixed(2));
  useEffect(() => {
    mv.set(0);
    const ctrl = animate(mv, TARGET, { type: 'spring', stiffness: 200, damping: 5, mass: 0.5 });
    return () => ctrl.stop();
  }, [run]);
  return <motion.span>{disp}</motion.span>;
}

/* ─── 26. Fade-in segments ─── */
function D26({ run }) {
  const segments = [Math.floor(TARGET / 10) * 10, TARGET.toFixed(2)];
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), DEMO_DURATION * 0.4);
    const t2 = setTimeout(() => setPhase(2), DEMO_DURATION * 0.9);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [run]);
  return (
    <span>
      <motion.span animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ color: '#94a3b8' }}>
        {Math.floor(TARGET / 10) * 10}
      </motion.span>
      <motion.span animate={{ opacity: phase >= 2 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        .{TARGET.toFixed(2).split('.')[1]}
      </motion.span>
    </span>
  );
}

/* ─── 27. Swipe-up reveal ─── */
function D27({ run }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    setV(0);
    const start = performance.now();
    const raf = (t) => {
      const p = Math.min((t - start) / DEMO_DURATION, 1);
      setV(TARGET * (1 - Math.pow(1 - p, 2)));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return (
    <span style={{ overflow: 'hidden', display: 'inline-block' }}>
      <motion.span
        key={run}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ display: 'inline-block' }}>
        {v.toFixed(2)}
      </motion.span>
    </span>
  );
}

/* ─── 28. Shake around target ─── */
function D28({ run }) {
  const [v, setV] = useState(0);
  const [shake, setShake] = useState(0);
  useEffect(() => {
    setV(0); setShake(0);
    const start = performance.now();
    const raf = (t) => {
      const p = Math.min((t - start) / DEMO_DURATION, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      const wobble = p > 0.7 ? (1 - p) / 0.3 * (Math.random() - 0.5) * TARGET * 0.08 : 0;
      setV(TARGET * e + wobble);
      setShake(p > 0.7 && p < 0.95 ? (Math.random() - 0.5) * 4 : 0);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ display: 'inline-block', transform: `translateX(${shake.toFixed(1)}px)` }}>{v.toFixed(2)}</span>;
}

/* ─── 29. Gold dust particle burst on land ─── */
function D29({ run }) {
  const [v, setV] = useState(0);
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setV(0); setParticles([]);
    const start = performance.now();
    const raf = (t) => {
      const p = Math.min((t - start) / (DEMO_DURATION * 0.8), 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(TARGET * e);
      if (p >= 1) {
        setParticles(Array.from({ length: 8 }, (_, i) => ({ id: i, angle: i * 45 })));
      } else {
        requestAnimationFrame(raf);
      }
    };
    requestAnimationFrame(raf);
  }, [run]);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {particles.map(p => (
        <motion.span key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(p.angle * Math.PI / 180) * 20, y: Math.sin(p.angle * Math.PI / 180) * 20, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'absolute', top: '50%', left: '50%', width: 4, height: 4, borderRadius: '50%', background: '#fbbf24', display: 'block' }} />
      ))}
      <span>{v.toFixed(2)}</span>
    </span>
  );
}

/* ─── 30. Warp speed then land ─── */
function D30({ run }) {
  const [v, setV] = useState(0);
  const [stretch, setStretch] = useState(1);
  useEffect(() => {
    setV(0); setStretch(1);
    const start = performance.now();
    const raf = (t) => {
      const p = Math.min((t - start) / DEMO_DURATION, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(TARGET * e);
      const s = p < 0.5 ? 1 + p * 0.6 : 1 + (1 - p) * 0.6;
      setStretch(s);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ display: 'inline-block', transform: `scaleY(${stretch.toFixed(2)})`, transformOrigin: 'bottom' }}>{v.toFixed(2)}</span>;
}

const DEMOS = [
  { id: 1, name: 'easeOut (baseline)', C: D1 },
  { id: 2, name: 'Spring Bounce', C: D2 },
  { id: 3, name: 'Overshoot & Settle', C: D3 },
  { id: 4, name: 'Slot Machine', C: D4 },
  { id: 5, name: 'Random Scramble', C: D5 },
  { id: 6, name: 'Stagger Digits', C: D6 },
  { id: 7, name: 'Blur → Focus', C: D7 },
  { id: 8, name: 'Scale Pop on Land', C: D8 },
  { id: 9, name: 'Pulse per Integer', C: D9 },
  { id: 10, name: 'Neon Flicker', C: D10 },
  { id: 11, name: 'Color Shift', C: D11 },
  { id: 12, name: 'Typewriter', C: D12 },
  { id: 13, name: 'easeIn (fast end)', C: D13 },
  { id: 14, name: 'Binary → Decimal', C: D14 },
  { id: 15, name: 'Odometer Roll', C: D15 },
  { id: 16, name: 'Glitch → Stabilize', C: D16 },
  { id: 17, name: 'Heartbeat', C: D17 },
  { id: 18, name: 'Slow Burn + Glow', C: D18 },
  { id: 19, name: 'Step Jumps', C: D19 },
  { id: 20, name: 'Countdown → Up', C: D20 },
  { id: 21, name: 'Matrix Chars', C: D21 },
  { id: 22, name: 'Digit Flip (Y)', C: D22 },
  { id: 23, name: 'Lightning Strike', C: D23 },
  { id: 24, name: 'Ripple on Land', C: D24 },
  { id: 25, name: 'Elastic Spring', C: D25 },
  { id: 26, name: 'Fade Segments', C: D26 },
  { id: 27, name: 'Swipe Up Reveal', C: D27 },
  { id: 28, name: 'Shake & Settle', C: D28 },
  { id: 29, name: 'Gold Dust Burst', C: D29 },
  { id: 30, name: 'Warp Speed', C: D30 },
];

export default function AdminScoreCounterDemos() {
  const [runKeys, setRunKeys] = useState(() => Object.fromEntries(DEMOS.map(d => [d.id, 0])));
  const [chosen, setChosen] = useState(null);

  const replay = (id) => setRunKeys(k => ({ ...k, [id]: k[id] + 1 }));
  const replayAll = () => setRunKeys(k => Object.fromEntries(Object.entries(k).map(([id, v]) => [id, v + 1])));

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">30 אפקטי מונה ניקוד</h2>
          <p className="text-slate-400 text-sm mt-1">לחץ על קלף לבחירה • לחץ על ▶ להפעלה מחדש</p>
        </div>
        <div className="flex items-center gap-3">
          {chosen && (
            <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl px-3 py-1.5 text-sm text-yellow-300">
              בחרת: <strong>#{chosen.id} — {chosen.name}</strong>
            </div>
          )}
          <button onClick={replayAll} className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
            ▶ הפעל הכל
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {DEMOS.map(({ id, name, C }) => (
          <div
            key={id}
            onClick={() => setChosen({ id, name })}
            className="rounded-xl p-4 cursor-pointer transition-all duration-200 relative"
            style={{
              background: chosen?.id === id ? 'rgba(251,191,36,0.10)' : 'rgba(15,23,42,0.85)',
              border: chosen?.id === id ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: chosen?.id === id ? '0 0 14px rgba(251,191,36,0.18)' : 'none',
            }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500">#{id} {name}</span>
              <button
                onClick={e => { e.stopPropagation(); replay(id); }}
                className="text-xs text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 px-2 py-0.5 rounded transition-colors">
                ▶
              </button>
            </div>
            <div className="flex items-center justify-center py-2">
              <span style={{ fontSize: 26, fontWeight: 800, color: '#4ade80', fontFamily: "'Outfit', sans-serif" }}>
                <C run={runKeys[id]} />
              </span>
              <span style={{ fontSize: 13, color: '#64748b', marginLeft: 4, marginTop: 4 }}>Pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
