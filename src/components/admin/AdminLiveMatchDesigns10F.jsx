import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LIVE, LiveCardShell, DefaultMinuteBadge, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Live Match card — batch F: score-digit CHANGE styles, round 3.
   Same exact card as production. Only how a score digit animates on
   change is different. Click "עדכן תוצאה" to bump the score and watch it.
   Temporary comparison tab — pick one, then it gets wired in and all
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

/* ── 1. Domino Topple ─────────────────────────────────────────────────────── */
function mkDomino() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 22, height: 34, perspective: 120 }}>
        <AnimatePresence>
          <motion.span key={value} initial={{ rotateZ: -80, opacity: 0, x: -8 }} animate={{ rotateZ: 0, opacity: 1, x: 0 }} exit={{ rotateZ: 80, opacity: 0, x: 8 }} transition={{ duration: 0.4 }}
            style={{ ...digitStyle, position: 'absolute', inset: 0, transformOrigin: 'bottom' }}>{value}</motion.span>
        </AnimatePresence>
      </div>
    );
  };
}

/* ── 2. Paper Peel Corner ─────────────────────────────────────────────────── */
function mkPaperPeel() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 22, height: 34 }}>
        <AnimatePresence>
          <motion.span key={value} initial={{ opacity: 0, rotate: -25, x: 10, y: -10 }} animate={{ opacity: [0, 0, 1], rotate: 0, x: 0, y: 0 }} exit={{ opacity: 0, rotate: 25, x: -10, y: -10 }} transition={{ duration: 0.4 }}
            style={{ ...digitStyle, position: 'absolute', inset: 0, transformOrigin: 'bottom left' }}>{value}</motion.span>
        </AnimatePresence>
      </div>
    );
  };
}

/* ── 3. Origami Fold Swap ─────────────────────────────────────────────────── */
function mkOrigami() {
  return function Digit({ value }) {
    return (
      <div style={{ perspective: 140, width: 22, height: 34 }}>
        <AnimatePresence mode="wait">
          <motion.span key={value} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} transition={{ duration: 0.3 }}
            style={{ ...digitStyle, display: 'block', transformOrigin: 'center' }}>{value}</motion.span>
        </AnimatePresence>
      </div>
    );
  };
}

/* ── 4. Halftone Dot Build ────────────────────────────────────────────────── */
function mkHalftone() {
  return function Digit({ value }) {
    const dots = useMemo(() => Array.from({ length: 9 }, (_, i) => i * 0.03), [value]);
    return (
      <div style={{ position: 'relative', width: 22, height: 34 }}>
        <span style={{ ...digitStyle, position: 'absolute', inset: 0, opacity: 0.08 }}>{value}</span>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)' }}>
          {dots.map((delay, i) => (
            <motion.div key={`${value}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay, duration: 0.15 }}
              style={{ width: 3, height: 3, borderRadius: '50%', background: '#f5c518', alignSelf: 'center', justifySelf: 'center' }} />
          ))}
        </div>
        <motion.span key={`${value}-final`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.2 }} style={{ ...digitStyle, position: 'absolute', inset: 0 }}>{value}</motion.span>
      </div>
    );
  };
}

/* ── 5. TV Static Interrupt ───────────────────────────────────────────────── */
function mkStatic() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 22, height: 34 }}>
        <motion.div key={`${value}-static`} initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.12 }}
          style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, #fff 0 1px, #333 1px 2px)', borderRadius: 2 }} />
        <motion.span key={value} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.15 }} style={{ ...digitStyle, position: 'absolute', inset: 0 }}>{value}</motion.span>
      </div>
    );
  };
}

/* ── 6. Rubber Stamp Bleed ────────────────────────────────────────────────── */
function mkStampBleed() {
  return function Digit({ value }) {
    return (
      <motion.span key={value} initial={{ opacity: 0, filter: 'blur(0px)', scale: 1.05 }}
        animate={{ opacity: [0, 1, 1], filter: ['blur(0px)', 'blur(1.5px)', 'blur(0px)'], scale: [1.05, 1.05, 1] }} transition={{ duration: 0.5, times: [0, 0.4, 1] }}
        style={{ ...digitStyle, display: 'inline-block' }}>{value}</motion.span>
    );
  };
}

/* ── 7. Hourglass Sand Fill ───────────────────────────────────────────────── */
function mkSandFill() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 22, height: 34 }}>
        <span style={{ ...digitStyle, position: 'absolute', inset: 0, color: 'rgba(245,197,24,0.15)' }}>{value}</span>
        <motion.span key={value} initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 0.6, ease: 'easeIn' }}
          style={{ ...digitStyle, position: 'absolute', inset: 0, color: '#f5c518' }}>{value}</motion.span>
      </div>
    );
  };
}

/* ── 8. X-Ray Scan Reveal ─────────────────────────────────────────────────── */
function mkScanReveal() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 22, height: 34, overflow: 'hidden' }}>
        <span style={{ ...digitStyle, position: 'absolute', inset: 0, opacity: 0.1 }}>{value}</span>
        <motion.div key={`${value}-scan`} initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 0.45, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0 }}>
          <span style={{ ...digitStyle, position: 'absolute', inset: 0, color: '#4ade80' }}>{value}</span>
        </motion.div>
        <motion.div key={`${value}-line`} initial={{ top: '0%' }} animate={{ top: '100%' }} transition={{ duration: 0.45, ease: 'linear' }}
          style={{ position: 'absolute', left: 0, right: 0, height: 2, background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
      </div>
    );
  };
}

/* ── 9. Confetti Burst Formation ──────────────────────────────────────────── */
function mkConfettiBurst() {
  return function Digit({ value }) {
    const pieces = useMemo(() => Array.from({ length: 6 }, () => ({ x: (Math.random() - 0.5) * 30, y: (Math.random() - 0.5) * 30, r: Math.random() * 180 })), [value]);
    return (
      <div style={{ position: 'relative', width: 22, height: 34 }}>
        {pieces.map((p, i) => (
          <motion.span key={`${value}-${i}`} initial={{ x: p.x, y: p.y, rotate: p.r, opacity: 1 }} animate={{ x: 0, y: 0, rotate: 0, opacity: 0 }} transition={{ duration: 0.4, delay: i * 0.02 }}
            style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, background: ['#f5c518', '#4ade80', '#fff'][i % 3] }} />
        ))}
        <motion.span key={value} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.2 }} style={{ ...digitStyle, position: 'absolute', inset: 0 }}>{value}</motion.span>
      </div>
    );
  };
}

/* ── 10. Zipper Unzip Swap ────────────────────────────────────────────────── */
function mkZipper() {
  return function Digit({ value }) {
    return (
      <div style={{ position: 'relative', width: 22, height: 34, overflow: 'hidden' }}>
        <AnimatePresence>
          <motion.div key={`${value}-l`} initial={{ x: 0, opacity: 1 }} animate={{ x: -14, opacity: 0 }} transition={{ duration: 0.28 }}
            style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 50% 0 0)' }}><span style={{ ...digitStyle, position: 'absolute', inset: 0 }}>{value}</span></motion.div>
        </AnimatePresence>
        <motion.span key={value} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.2 }} style={{ ...digitStyle, position: 'absolute', inset: 0 }}>{value}</motion.span>
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
  { id: 1, name: 'Domino Topple', Comp: makeDesign(mkDomino) },
  { id: 2, name: 'Paper Peel Corner', Comp: makeDesign(mkPaperPeel) },
  { id: 3, name: 'Origami Fold Swap', Comp: makeDesign(mkOrigami) },
  { id: 4, name: 'Halftone Dot Build', Comp: makeDesign(mkHalftone) },
  { id: 5, name: 'TV Static Interrupt', Comp: makeDesign(mkStatic) },
  { id: 6, name: 'Rubber Stamp Bleed', Comp: makeDesign(mkStampBleed) },
  { id: 7, name: 'Hourglass Sand Fill', Comp: makeDesign(mkSandFill) },
  { id: 8, name: 'X-Ray Scan Reveal', Comp: makeDesign(mkScanReveal) },
  { id: 9, name: 'Confetti Burst Formation', Comp: makeDesign(mkConfettiBurst) },
  { id: 10, name: 'Zipper Unzip Swap', Comp: makeDesign(mkZipper) },
];

export default function AdminLiveMatchDesigns10F() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — אותו כרטיס משחק חי, החלפת מספר תוצאה (סבב 3)"
      subtitle="לחץ 'עדכן תוצאה' כדי לראות כל וריאציה"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
