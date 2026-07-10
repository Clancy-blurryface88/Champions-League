import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LIVE, LiveCardShell, DefaultMinuteBadge, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Live Match card — batch A: score-digit CHANGE styles only.
   This is the exact same card as production (rounded card, red ring on the
   minute, LIVE pill, flags flanking the score) — every design here changes
   nothing except *how a score digit animates when it updates* (today it's
   an odometer roll). Click "עדכן תוצאה" to bump the score and watch it.
   Temporary comparison tab — pick one, then it gets wired in and both
   batch files get removed.
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

/* ── 1. 3D Flip Card ──────────────────────────────────────────────────────── */
function mk3DFlip() {
  return function Digit({ value }) {
    return (
      <div style={{ perspective: 200, width: 26, height: 34 }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={value} initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: -90, opacity: 0 }} transition={{ duration: 0.35 }}
            style={{ display: 'block', fontFamily: "'Russo One', sans-serif", fontSize: 28, color: '#fff' }}>{value}</motion.span>
        </AnimatePresence>
      </div>
    );
  };
}

/* ── 2. Fade Cross-Dissolve ───────────────────────────────────────────────── */
function mkFade() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 20, height: 34 }}>
        <AnimatePresence>
          <motion.span key={value} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, position: 'absolute' }} transition={{ duration: 0.4 }}
            style={{ fontFamily: "'Russo One', sans-serif", fontSize: 28, color: '#fff', position: 'absolute', inset: 0 }}>{value}</motion.span>
        </AnimatePresence>
      </div>
    );
  };
}

/* ── 3. Slide-Up Push ─────────────────────────────────────────────────────── */
function mkSlideUp() {
  return function Digit({ value }) {
    return (
      <div style={{ width: 20, height: 34, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence>
          <motion.span key={value} initial={{ y: 34, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -34, opacity: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, fontFamily: "'Russo One', sans-serif", fontSize: 28, color: '#fff' }}>{value}</motion.span>
        </AnimatePresence>
      </div>
    );
  };
}

/* ── 4. Bounce Pop + Gold Flash ───────────────────────────────────────────── */
function mkBouncePop() {
  return function Digit({ value }) {
    return (
      <motion.span key={value} initial={{ scale: 1.8 }} animate={{ scale: 1, color: ['#f5c518', '#f5c518', '#fff'] }} transition={{ scale: { type: 'spring', stiffness: 320, damping: 14 }, color: { duration: 0.9 } }}
        style={{ fontFamily: "'Russo One', sans-serif", fontSize: 28, display: 'inline-block' }}>{value}</motion.span>
    );
  };
}

/* ── 5. Blur Focus-In ─────────────────────────────────────────────────────── */
function mkBlurFocus() {
  return function Digit({ value }) {
    return (
      <motion.span key={value} initial={{ filter: 'blur(8px)', opacity: 0.3 }} animate={{ filter: 'blur(0px)', opacity: 1 }} transition={{ duration: 0.5 }}
        style={{ fontFamily: "'Russo One', sans-serif", fontSize: 28, color: '#fff', display: 'inline-block' }}>{value}</motion.span>
    );
  };
}

/* ── 6. Elastic Squish ────────────────────────────────────────────────────── */
function mkElastic() {
  return function Digit({ value }) {
    return (
      <motion.span key={value} initial={{ scaleY: 0.4, scaleX: 1.4 }} animate={{ scaleY: 1, scaleX: 1 }} transition={{ type: 'spring', stiffness: 480, damping: 11 }}
        style={{ fontFamily: "'Russo One', sans-serif", fontSize: 28, color: '#fff', display: 'inline-block' }}>{value}</motion.span>
    );
  };
}

/* ── 7. Split-Flap Mechanical ─────────────────────────────────────────────── */
function mkSplitFlap() {
  return function Digit({ value }) {
    return (
      <div style={{ width: 22, height: 34, position: 'relative', overflow: 'hidden', borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
        <AnimatePresence>
          <motion.div key={value} initial={{ rotateX: 90 }} animate={{ rotateX: 0 }} exit={{ rotateX: -90 }} transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Russo One', sans-serif", fontSize: 26, color: '#fff' }}>{value}</motion.div>
        </AnimatePresence>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(0,0,0,0.4)' }} />
      </div>
    );
  };
}

/* ── 8. Glitch Settle ─────────────────────────────────────────────────────── */
function mkGlitch() {
  return function Digit({ value }) {
    const [display, setDisplay] = useState(value);
    const first = useRef(true);
    useEffect(() => {
      if (first.current) { first.current = false; return; }
      let n = 0;
      const iv = setInterval(() => {
        n += 1;
        setDisplay(n < 4 ? Math.floor(Math.random() * 10) : value);
        if (n >= 4) clearInterval(iv);
      }, 55);
      return () => clearInterval(iv);
    }, [value]);
    return <span style={{ fontFamily: "'Russo One', sans-serif", fontSize: 28, color: display === value ? '#fff' : '#4ade80' }}>{display}</span>;
  };
}

/* ── 9. Tick Count-Up ─────────────────────────────────────────────────────── */
function mkTickCountUp() {
  return function Digit({ value }) {
    const [display, setDisplay] = useState(value);
    const prev = useRef(value);
    useEffect(() => {
      const from = prev.current, to = value;
      if (from === to) return;
      let n = from;
      const iv = setInterval(() => { n = (n + 1) % 10; setDisplay(n); if (n === to) { clearInterval(iv); prev.current = to; } }, 90);
      return () => clearInterval(iv);
    }, [value]);
    return (
      <motion.span key={`${display}-tick`} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.15 }}
        style={{ fontFamily: "'Russo One', sans-serif", fontSize: 28, color: '#fff', display: 'inline-block' }}>{display}</motion.span>
    );
  };
}

/* ── 10. Ghost Trail Slide ────────────────────────────────────────────────── */
function mkGhostTrail() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 22, height: 34 }}>
        {[0.15, 0.08].map((op, i) => (
          <motion.span key={`${value}-ghost${i}`} initial={{ y: 20 - i * 6, opacity: op }} animate={{ y: -6 - i * 6, opacity: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }}
            style={{ position: 'absolute', inset: 0, fontFamily: "'Russo One', sans-serif", fontSize: 28, color: '#f5c518' }}>{value}</motion.span>
        ))}
        <motion.span key={value} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, fontFamily: "'Russo One', sans-serif", fontSize: 28, color: '#fff' }}>{value}</motion.span>
      </div>
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
  { id: 1, name: '3D Flip Card', Comp: makeDesign(mk3DFlip) },
  { id: 2, name: 'Fade Cross-Dissolve', Comp: makeDesign(mkFade) },
  { id: 3, name: 'Slide-Up Push', Comp: makeDesign(mkSlideUp) },
  { id: 4, name: 'Bounce Pop + Gold Flash', Comp: makeDesign(mkBouncePop) },
  { id: 5, name: 'Blur Focus-In', Comp: makeDesign(mkBlurFocus) },
  { id: 6, name: 'Elastic Squish', Comp: makeDesign(mkElastic) },
  { id: 7, name: 'Split-Flap Mechanical', Comp: makeDesign(mkSplitFlap) },
  { id: 8, name: 'Glitch Settle', Comp: makeDesign(mkGlitch) },
  { id: 9, name: 'Tick Count-Up', Comp: makeDesign(mkTickCountUp) },
  { id: 10, name: 'Ghost Trail Slide', Comp: makeDesign(mkGhostTrail) },
];

export default function AdminLiveMatchDesigns10A() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — אותו כרטיס משחק חי, רק החלפת מספר התוצאה שונה"
      subtitle="הכרטיס, הטבעת האדומה, התג הזהוב והדגלים זהים לחלוטין להיום — לחץ 'עדכן תוצאה' כדי לראות איך הספרה מתחלפת בכל וריאציה"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
