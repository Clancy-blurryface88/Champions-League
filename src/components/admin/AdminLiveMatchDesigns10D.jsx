import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LIVE, LiveCardShell, DefaultScoreDigit, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Live Match card — batch D: minute-badge UPDATE styles, round 2.
   Same exact card as production. Only how the gold minute badge reacts
   when the minute ticks is different. Click "עדכן דקה" to bump it.
   Temporary comparison tab — pick one, then it gets wired in and all five
   live-match batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

const badgeBase = { color: '#000', fontWeight: 900, fontSize: 11, borderRadius: 999, padding: '2px 7px', boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 2px #030d1a' };
const BumpMinute = ({ onClick }) => (
  <button onClick={onClick} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2 mt-2">🔁 עדכן דקה</button>
);
function useBumpableMinute() {
  const [minute, setMinute] = useState(LIVE.minute);
  const bump = () => setMinute((m) => Math.min(m + 3, 90));
  return { minute, bump };
}

/* ── 11. Comet Streak ─────────────────────────────────────────────────────── */
function Badge_Comet({ minute }) {
  return (
    <div style={{ position: 'relative' }}>
      <motion.span key={`streak-${minute}`} initial={{ opacity: 0.5, x: -12, y: -4, scale: 0.8 }} animate={{ opacity: 0, x: 0, y: 0 }} transition={{ duration: 0.45 }}
        style={{ position: 'absolute', inset: 0, background: '#FFD700', borderRadius: 999, filter: 'blur(2px)' }} />
      <span style={{ position: 'relative', background: '#FFD700', ...badgeBase }}>{minute}'</span>
    </div>
  );
}

/* ── 12. Heartbeat Double-Pulse ───────────────────────────────────────────── */
function Badge_DoublePulse({ minute }) {
  return (
    <motion.span key={minute} animate={{ scale: [1, 1.3, 1, 1.22, 1] }} transition={{ duration: 0.5, times: [0, 0.25, 0.4, 0.65, 1] }}
      style={{ display: 'inline-block', background: '#FFD700', ...badgeBase }}>{minute}'</motion.span>
  );
}

/* ── 13. Orbit Halo Ring ──────────────────────────────────────────────────── */
function Badge_HaloRing({ minute }) {
  return (
    <div style={{ position: 'relative' }}>
      <motion.span key={`halo-${minute}`} initial={{ scale: 1, opacity: 0.9 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.55 }}
        style={{ position: 'absolute', inset: -2, borderRadius: 999, border: '1.5px solid #FFD700' }} />
      <span style={{ position: 'relative', background: '#FFD700', ...badgeBase }}>{minute}'</span>
    </div>
  );
}

/* ── 14. Ink Splatter Tick ────────────────────────────────────────────────── */
function Badge_Splatter({ minute }) {
  const drops = useMemo(() => Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), [minute]);
  return (
    <div style={{ position: 'relative' }}>
      {drops.map((a, i) => (
        <motion.span key={`${minute}-${i}`} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(a) * 16, y: Math.sin(a) * 16, opacity: 0 }} transition={{ duration: 0.45 }}
          style={{ position: 'absolute', left: '50%', top: '50%', width: 3, height: 3, borderRadius: '50%', background: '#FFD700' }} />
      ))}
      <span style={{ position: 'relative', background: '#FFD700', ...badgeBase }}>{minute}'</span>
    </div>
  );
}

/* ── 15. Magnetic Wobble ──────────────────────────────────────────────────── */
function Badge_Wobble({ minute }) {
  return (
    <motion.span key={minute} animate={{ rotate: [0, -10, 8, -4, 0] }} transition={{ duration: 0.45 }}
      style={{ display: 'inline-block', background: '#FFD700', ...badgeBase }}>{minute}'</motion.span>
  );
}

/* ── 16. Number Roll Inside Badge ─────────────────────────────────────────── */
function Badge_RollInside({ minute }) {
  return (
    <span style={{ background: '#FFD700', ...badgeBase, display: 'inline-flex', overflow: 'hidden', height: 15 }}>
      <motion.span key={minute} initial={{ y: -15 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 340, damping: 20 }} style={{ display: 'block' }}>{minute}'</motion.span>
    </span>
  );
}

/* ── 17. Gold Dust Trail ──────────────────────────────────────────────────── */
function Badge_DustTrail({ minute }) {
  return (
    <div style={{ position: 'relative' }}>
      {[0, 1, 2].map((i) => (
        <motion.span key={`${minute}-d${i}`} initial={{ x: -6 - i * 4, y: -2, opacity: 0.5 - i * 0.1 }} animate={{ x: 0, y: 0, opacity: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }}
          style={{ position: 'absolute', width: 3, height: 3, borderRadius: '50%', background: '#f5c518', left: '20%', top: '40%' }} />
      ))}
      <span style={{ position: 'relative', background: '#FFD700', ...badgeBase }}>{minute}'</span>
    </div>
  );
}

/* ── 18. Border Flash Ring ────────────────────────────────────────────────── */
function Badge_BorderFlash({ minute }) {
  return (
    <div style={{ position: 'relative' }}>
      <motion.span key={`flash-${minute}`} initial={{ opacity: 0.9, scale: 1.1 }} animate={{ opacity: 0, scale: 1.4 }} transition={{ duration: 0.35 }}
        style={{ position: 'absolute', inset: -3, borderRadius: 999, border: '2px solid #fff' }} />
      <span style={{ position: 'relative', background: '#FFD700', ...badgeBase }}>{minute}'</span>
    </div>
  );
}

/* ── 19. Tilt Nod ─────────────────────────────────────────────────────────── */
function Badge_TiltNod({ minute }) {
  return (
    <div style={{ perspective: 100 }}>
      <motion.span key={minute} animate={{ rotateX: [0, 30, 0] }} transition={{ duration: 0.4 }}
        style={{ display: 'inline-block', background: '#FFD700', ...badgeBase }}>{minute}'</motion.span>
    </div>
  );
}

/* ── 20. Elastic Stretch Along Path ───────────────────────────────────────── */
function Badge_StretchPath({ minute }) {
  return (
    <motion.span key={minute} animate={{ scaleX: [1, 1.5, 1], scaleY: [1, 0.75, 1] }} transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ display: 'inline-block', background: '#FFD700', ...badgeBase }}>{minute}'</motion.span>
  );
}

function makeBadgeDesign(Badge) {
  return function DesignCard() {
    const { minute, bump } = useBumpableMinute();
    return (
      <Shell style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
        <LiveCardShell progress={minute / 90} minute={minute} ScoreDigit={DefaultScoreDigit} MinuteBadge={Badge} />
        <BumpMinute onClick={bump} />
      </Shell>
    );
  };
}

const DESIGNS = [
  { id: 11, name: 'Comet Streak', Comp: makeBadgeDesign(Badge_Comet) },
  { id: 12, name: 'Heartbeat Double-Pulse', Comp: makeBadgeDesign(Badge_DoublePulse) },
  { id: 13, name: 'Orbit Halo Ring', Comp: makeBadgeDesign(Badge_HaloRing) },
  { id: 14, name: 'Ink Splatter Tick', Comp: makeBadgeDesign(Badge_Splatter) },
  { id: 15, name: 'Magnetic Wobble', Comp: makeBadgeDesign(Badge_Wobble) },
  { id: 16, name: 'Number Roll Inside Badge', Comp: makeBadgeDesign(Badge_RollInside) },
  { id: 17, name: 'Gold Dust Trail', Comp: makeBadgeDesign(Badge_DustTrail) },
  { id: 18, name: 'Border Flash Ring', Comp: makeBadgeDesign(Badge_BorderFlash) },
  { id: 19, name: 'Tilt Nod', Comp: makeBadgeDesign(Badge_TiltNod) },
  { id: 20, name: 'Elastic Stretch Along Path', Comp: makeBadgeDesign(Badge_StretchPath) },
];

export default function AdminLiveMatchDesigns10D() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — אותו כרטיס משחק חי, תגובת תג הדקה (סבב 2)"
      subtitle="לחץ 'עדכן דקה' כדי לראות כל וריאציה"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
