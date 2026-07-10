import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LIVE, LiveCardShell, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Live Match card — batch E: component ENTRANCE-choreography styles,
   round 2. Same exact card as production (via LiveCardShell) — each design
   wraps it with one extra entrance flourish (unfold, radial wipe, curtain,
   siren sweep, corner pins, etc.) layered on top, not a different card.
   Click "שחזר כניסה" to replay.
   Temporary comparison tab — pick one, then it gets wired in and all five
   live-match batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

const CARD_W = 260, CARD_H = 176;
const PROGRESS = LIVE.minute / 90;
const Replay = ({ onClick }) => (
  <button onClick={onClick} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2 mt-2">🔁 שחזר כניסה</button>
);

/* ── 21. Ring-to-Card Unfold ──────────────────────────────────────────────── */
function E21() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <motion.div initial={{ scaleY: 0.04, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: 'center' }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.1, flags: 0.15, score: 0.2 }} />
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 22. Radial Reveal from Badge ─────────────────────────────────────────── */
function E22() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <motion.div initial={{ clipPath: 'circle(0% at 82% 12%)' }} animate={{ clipPath: 'circle(120% at 82% 12%)' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0, flags: 0, score: 0 }} />
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 23. Flags Fly-In With Color Streak ───────────────────────────────────── */
function E23() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        <motion.div initial={{ x: '-40%', opacity: 0.7 }} animate={{ x: '0%', opacity: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ position: 'absolute', left: 40, top: 95, width: 50, height: 6, background: 'linear-gradient(90deg, transparent, #38bdf8)', filter: 'blur(2px)' }} />
        <motion.div initial={{ x: '40%', opacity: 0.7 }} animate={{ x: '0%', opacity: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ position: 'absolute', right: 40, top: 95, width: 50, height: 6, background: 'linear-gradient(-90deg, transparent, #fbbf24)', filter: 'blur(2px)' }} />
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.3, flags: 0.1, score: 0.35 }} />
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 24. Score Curtain Rise ───────────────────────────────────────────────── */
function E24() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.05, flags: 0.15, score: 0.2 }} />
        <motion.div initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ delay: 0.55, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', left: 74, top: 95, width: 56, height: 38, background: '#0d1f36', transformOrigin: 'left', borderRadius: '4px 0 0 4px' }} />
        <motion.div initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ delay: 0.55, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', left: 130, top: 95, width: 56, height: 38, background: '#0d1f36', transformOrigin: 'right', borderRadius: '0 4px 4px 0' }} />
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 25. LIVE Badge Siren Sweep ───────────────────────────────────────────── */
function E25() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.2, flags: 0.3, score: 0.4 }} />
        <motion.div initial={{ opacity: 0.9, rotate: 0 }} animate={{ opacity: 0, rotate: 180 }} transition={{ duration: 0.6, ease: 'linear' }}
          style={{ position: 'absolute', left: 96, top: 22, width: 68, height: 20, borderRadius: 999, background: 'conic-gradient(from 0deg, transparent, #f87171, transparent)', pointerEvents: 'none' }} />
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 26. Depth Stack Settle ───────────────────────────────────────────────── */
function E26() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <motion.div initial={{ scale: 0.55, opacity: 0, rotate: -4 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.12, flags: 0.15, score: 0.17 }} />
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 27. Typewriter Status Line ───────────────────────────────────────────── */
function useTypewriter(text, active) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    setN(0);
    const iv = setInterval(() => setN((v) => (v < text.length ? v + 1 : v)), 40);
    return () => clearInterval(iv);
  }, [active, text]);
  return { shown: text.slice(0, n), done: n === text.length };
}
function E27() {
  const [key, setKey] = useState(0);
  const text = '🔴 משחק בעיצומו...';
  const { shown, done } = useTypewriter(text, true);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 8, minHeight: 300 }}>
      <span style={{ color: '#f87171', fontSize: 11, fontFamily: 'monospace', minHeight: 16 }}>{shown}<span style={{ opacity: done ? 0 : 1 }}>|</span></span>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0.3 }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0, flags: 0.08, score: 0.16 }} />
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 28. Zoom-Through Focus Pull ──────────────────────────────────────────── */
function E28() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <motion.div initial={{ scale: 1.6, filter: 'blur(14px)', opacity: 0.3 }} animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.15, flags: 0.2, score: 0.25 }} />
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 29. Bottom-Up Wipe Reveal ────────────────────────────────────────────── */
function E29() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <motion.div initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.1, flags: 0.15, score: 0.2 }} />
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 30. Staggered Corner Pins ────────────────────────────────────────────── */
function E30() {
  const [key, setKey] = useState(0);
  const corners = [
    { from: { x: -20, y: -20 }, style: { left: 6, top: 6, borderTop: '2px solid #f5c518', borderLeft: '2px solid #f5c518' } },
    { from: { x: 20, y: -20 }, style: { right: 6, top: 6, borderTop: '2px solid #f5c518', borderRight: '2px solid #f5c518' } },
    { from: { x: -20, y: 20 }, style: { left: 6, bottom: 6, borderBottom: '2px solid #f5c518', borderLeft: '2px solid #f5c518' } },
    { from: { x: 20, y: 20 }, style: { right: 6, bottom: 6, borderBottom: '2px solid #f5c518', borderRight: '2px solid #f5c518' } },
  ];
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        {corners.map((c, i) => (
          <motion.div key={i} initial={{ ...c.from, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ delay: i * 0.05, duration: 0.3 }}
            style={{ position: 'absolute', width: 14, height: 14, ...c.style }} />
        ))}
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.3, flags: 0.34, score: 0.38 }} />
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

const DESIGNS = [
  { id: 21, name: 'Ring-to-Card Unfold', Comp: E21 },
  { id: 22, name: 'Radial Reveal from Badge', Comp: E22 },
  { id: 23, name: 'Flags Fly-In With Color Streak', Comp: E23 },
  { id: 24, name: 'Score Curtain Rise', Comp: E24 },
  { id: 25, name: 'LIVE Badge Siren Sweep', Comp: E25 },
  { id: 26, name: 'Depth Stack Settle', Comp: E26 },
  { id: 27, name: 'Typewriter Status Line', Comp: E27 },
  { id: 28, name: 'Zoom-Through Focus Pull', Comp: E28 },
  { id: 29, name: 'Bottom-Up Wipe Reveal', Comp: E29 },
  { id: 30, name: 'Staggered Corner Pins', Comp: E30 },
];

export default function AdminLiveMatchDesigns10E() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — אותו כרטיס משחק חי, סדר הופעת רכיבים (סבב 2)"
      subtitle="לחץ 'שחזר כניסה' כדי לראות כל וריאציה"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
