import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LIVE, LiveCardShell, DefaultMinuteBadge, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Live Match card — batch C: score-digit CHANGE styles, round 2.
   Same exact card as production. Only how a score digit animates on
   change is different. Click "עדכן תוצאה" to bump the score and watch it.
   Temporary comparison tab — pick one, then it gets wired in and all five
   live-match batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

const PROGRESS = LIVE.minute / 90;
function useBumpableScore() {
  const [home, setHome] = useState(LIVE.homeScore);
  const [away, setAway] = useState(LIVE.awayScore);
  const bump = () => { setHome((h) => (h + 1) % 10); setAway((a) => (a + 1) % 10); };
  return { home, away, bump };
}
const BumpButton = ({ onClick }) => (
  <button onClick={onClick} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2 mt-2">🔁 עדכן תוצאה</button>
);
const digitStyle = { fontFamily: "'Russo One', sans-serif", fontSize: 28, color: '#fff' };

/* ── 1. Roulette Wheel Settle ─────────────────────────────────────────────── */
function mkRoulette() {
  return function Digit({ value }) {
    const seq = useMemo(() => {
      const s = [];
      for (let i = 0; i < 5; i++) s.push(Math.floor(Math.random() * 10));
      s.push(value);
      return s;
    }, [value]);
    return (
      <div style={{ width: 22, height: 34, overflow: 'hidden' }}>
        <motion.div initial={{ y: 0 }} animate={{ y: -34 * (seq.length - 1) }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
          {seq.map((n, i) => <div key={i} style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', ...digitStyle }}>{n}</div>)}
        </motion.div>
      </div>
    );
  };
}

/* ── 2. Ink Drop Morph ────────────────────────────────────────────────────── */
function mkInkDrop() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 22, height: 34 }}>
        <AnimatePresence>
          <motion.span key={value} initial={{ y: -14, opacity: 0, scaleY: 0.3 }} animate={{ y: [0, 3, 0], opacity: 1, scaleY: 1 }} exit={{ y: 10, opacity: 0, scaleY: 0.3 }} transition={{ duration: 0.45 }}
            style={{ ...digitStyle, position: 'absolute', inset: 0, transformOrigin: 'top' }}>{value}</motion.span>
        </AnimatePresence>
      </div>
    );
  };
}

/* ── 3. Card Suit Shuffle ─────────────────────────────────────────────────── */
function mkShuffle() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 22, height: 34 }}>
        {[-8, 8].map((x, i) => (
          <motion.span key={`${value}-g${i}`} initial={{ x, opacity: 0.5 }} animate={{ x: 0, opacity: 0 }} transition={{ duration: 0.3, delay: i * 0.06 }}
            style={{ ...digitStyle, color: '#94a3b8', position: 'absolute', inset: 0 }}>{value}</motion.span>
        ))}
        <motion.span key={value} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.2 }} style={{ ...digitStyle, position: 'absolute', inset: 0 }}>{value}</motion.span>
      </div>
    );
  };
}

/* ── 4. Magnetic Snap-In ──────────────────────────────────────────────────── */
function mkMagnetic() {
  return function Digit({ value }) {
    const from = useMemo(() => ({ x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 60 }), [value]);
    return (
      <motion.span key={value} initial={{ ...from, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 340, damping: 12 }}
        style={{ ...digitStyle, display: 'inline-block' }}>{value}</motion.span>
    );
  };
}

/* ── 5. Neon Sign Flicker-In ──────────────────────────────────────────────── */
function mkNeon() {
  return function Digit({ value }) {
    return (
      <AnimatePresence mode="wait">
        <motion.span key={value} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0, 0.8, 0.2, 1] }} transition={{ duration: 0.6, times: [0, 0.15, 0.3, 0.5, 0.65, 1] }}
          style={{ ...digitStyle, color: '#4ade80', textShadow: '0 0 8px #4ade80, 0 0 18px #4ade80' }}>{value}</motion.span>
      </AnimatePresence>
    );
  };
}

/* ── 6. Pixel Dissolve ────────────────────────────────────────────────────── */
function mkPixelDissolve() {
  return function Digit({ value }) {
    const cells = useMemo(() => Array.from({ length: 9 }, () => Math.random() * 0.4), [value]);
    return (
      <div style={{ position: 'relative', width: 22, height: 34 }}>
        <span style={{ ...digitStyle, position: 'absolute', inset: 0 }}>{value}</span>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)' }}>
          {cells.map((delay, i) => (
            <motion.span key={`${value}-${i}`} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3, delay }} style={{ background: '#030d1a' }} />
          ))}
        </div>
      </div>
    );
  };
}

/* ── 7. Liquid Fill Swap ──────────────────────────────────────────────────── */
function mkLiquidFill() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 22, height: 34 }}>
        <span style={{ ...digitStyle, position: 'absolute', inset: 0, color: 'rgba(255,255,255,0.15)' }}>{value}</span>
        <motion.span key={value} initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ ...digitStyle, position: 'absolute', inset: 0 }}>{value}</motion.span>
      </div>
    );
  };
}

/* ── 8. Stamp Impact ──────────────────────────────────────────────────────── */
function mkStamp() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative' }}>
        <motion.span key={`${value}-flash`} initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.25 }}
          style={{ position: 'absolute', inset: -4, background: '#fff', borderRadius: 4 }} />
        <motion.span key={value} initial={{ scale: 2.4, opacity: 0 }} animate={{ scale: [2.4, 1, 1], x: [0, 0, -1, 1, 0] }} transition={{ duration: 0.35, times: [0, 0.6, 0.7, 0.85, 1] }}
          style={{ ...digitStyle, position: 'relative', display: 'inline-block' }}>{value}</motion.span>
      </div>
    );
  };
}

/* ── 9. Rotate-Through Carousel ───────────────────────────────────────────── */
function mkCarousel() {
  return function Digit({ value }) {
    const mid = useMemo(() => Math.floor(Math.random() * 10), [value]);
    return (
      <div style={{ width: 22, height: 34, perspective: 120, overflow: 'hidden' }}>
        <AnimatePresence mode="popLayout">
          <motion.div key={value} initial={{ rotateX: -70, y: -6 }} animate={{ rotateX: 0, y: 0 }} exit={{ rotateX: 70, y: 6 }} transition={{ duration: 0.4 }}
            style={{ ...digitStyle, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{value}</motion.div>
        </AnimatePresence>
      </div>
    );
  };
}

/* ── 10. Trace Outline Draw ───────────────────────────────────────────────── */
function mkTraceOutline() {
  return function Digit({ value }) {
    return (
      <svg width="24" height="34" key={value}>
        <motion.text x="12" y="26" textAnchor="middle" fontFamily="'Russo One', sans-serif" fontSize="26" fill="none" stroke="#f5c518" strokeWidth="1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}>{value}</motion.text>
        <motion.text x="12" y="26" textAnchor="middle" fontFamily="'Russo One', sans-serif" fontSize="26" fill="#fff"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.3 }}>{value}</motion.text>
      </svg>
    );
  };
}

function makeDesign(factory) {
  return function DesignCard() {
    const { home, away, bump } = useBumpableScore();
    const Digit = useRef(factory()).current;
    return (
      <Shell style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} homeScore={home} awayScore={away} ScoreDigit={Digit} MinuteBadge={DefaultMinuteBadge} />
        <BumpButton onClick={bump} />
      </Shell>
    );
  };
}

const DESIGNS = [
  { id: 1, name: 'Roulette Wheel Settle', Comp: makeDesign(mkRoulette) },
  { id: 2, name: 'Ink Drop Morph', Comp: makeDesign(mkInkDrop) },
  { id: 3, name: 'Card Suit Shuffle', Comp: makeDesign(mkShuffle) },
  { id: 4, name: 'Magnetic Snap-In', Comp: makeDesign(mkMagnetic) },
  { id: 5, name: 'Neon Sign Flicker-In', Comp: makeDesign(mkNeon) },
  { id: 6, name: 'Pixel Dissolve', Comp: makeDesign(mkPixelDissolve) },
  { id: 7, name: 'Liquid Fill Swap', Comp: makeDesign(mkLiquidFill) },
  { id: 8, name: 'Stamp Impact', Comp: makeDesign(mkStamp) },
  { id: 9, name: 'Rotate-Through Carousel', Comp: makeDesign(mkCarousel) },
  { id: 10, name: 'Trace Outline Draw', Comp: makeDesign(mkTraceOutline) },
];

export default function AdminLiveMatchDesigns10C() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — אותו כרטיס משחק חי, החלפת מספר תוצאה (סבב 2)"
      subtitle="לחץ 'עדכן תוצאה' כדי לראות כל וריאציה"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
