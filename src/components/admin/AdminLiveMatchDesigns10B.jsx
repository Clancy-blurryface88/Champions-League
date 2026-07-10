import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LIVE, LiveCardShell, DefaultScoreDigit, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Live Match card — batch B: minute-badge UPDATE styles + component
   ENTRANCE-choreography styles. Same exact card as production — every
   design here changes only (a) how the gold minute badge reacts when the
   minute ticks, or (b) the order/timing the badge/flags/score fade in on
   mount. The ring, flags, and score digit stay exactly as today.
   Temporary comparison tab — pick one, then it gets wired in and both
   batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

const BumpMinute = ({ onClick }) => (
  <button onClick={onClick} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2 mt-2">🔁 עדכן דקה</button>
);
const Replay = ({ onClick }) => (
  <button onClick={onClick} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2 mt-2">🔁 שחזר כניסה</button>
);

function useBumpableMinute() {
  const [minute, setMinute] = useState(LIVE.minute);
  const bump = () => setMinute((m) => Math.min(m + 3, 90));
  return { minute, bump };
}

/* ── 1. Ripple Burst Badge ────────────────────────────────────────────────── */
function Badge_Ripple({ minute }) {
  return (
    <div style={{ position: 'relative' }}>
      <motion.span key={`ripple-${minute}`} initial={{ scale: 1, opacity: 0.6 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 0.6 }}
        style={{ position: 'absolute', inset: 0, borderRadius: 999, background: '#FFD700' }} />
      <span style={{ position: 'relative', background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11, borderRadius: 999, padding: '2px 7px', boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 2px #030d1a' }}>{minute}'</span>
    </div>
  );
}

/* ── 2. Color Shift Badge ─────────────────────────────────────────────────── */
function Badge_ColorShift({ minute }) {
  return (
    <motion.span key={minute} animate={{ backgroundColor: ['#fff', '#fff', '#FFD700'] }} transition={{ duration: 0.7 }}
      style={{ color: '#000', fontWeight: 900, fontSize: 11, borderRadius: 999, padding: '2px 7px', boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 2px #030d1a' }}>{minute}'</motion.span>
  );
}

/* ── 3. Glow Burst Badge ──────────────────────────────────────────────────── */
function Badge_GlowBurst({ minute }) {
  return (
    <motion.span key={minute} animate={{ boxShadow: ['0 0 0px rgba(245,197,24,0)', '0 0 18px rgba(245,197,24,0.9)', '0 2px 8px rgba(0,0,0,0.5)'] }} transition={{ duration: 0.6 }}
      style={{ background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11, borderRadius: 999, padding: '2px 7px' }}>{minute}'</motion.span>
  );
}

/* ── 4. Bounce Hop Badge ──────────────────────────────────────────────────── */
function Badge_BounceHop({ minute }) {
  return (
    <motion.span key={minute} animate={{ y: [0, -9, 0] }} transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ display: 'inline-block', background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11, borderRadius: 999, padding: '2px 7px', boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 2px #030d1a' }}>{minute}'</motion.span>
  );
}

/* ── 5. Shake Twitch Badge ────────────────────────────────────────────────── */
function Badge_Shake({ minute }) {
  return (
    <motion.span key={minute} animate={{ x: [0, -3, 3, -2, 0] }} transition={{ duration: 0.35 }}
      style={{ display: 'inline-block', background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11, borderRadius: 999, padding: '2px 7px', boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 2px #030d1a' }}>{minute}'</motion.span>
  );
}

/* ── 6. Size Morph Pulse Badge ────────────────────────────────────────────── */
function Badge_SizeMorph({ minute }) {
  return (
    <motion.span key={minute} animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ display: 'inline-block', background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11, borderRadius: 999, padding: '2px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 2px #030d1a' }}>{minute}'</motion.span>
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

/* ── 7–10. Entrance choreography variants (badge/flags/score stagger) ────── */
function makeEntranceDesign(entranceDelays, drawRing = false) {
  return function DesignCard() {
    const [key, setKey] = useState(0);
    const [progress, setProgress] = useState(drawRing ? 0 : LIVE.minute / 90);
    useEffect(() => {
      if (!drawRing) return;
      setProgress(0);
      const t = setTimeout(() => setProgress(LIVE.minute / 90), 30);
      return () => clearTimeout(t);
    }, [key, drawRing]);
    return (
      <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
        <LiveCardShell progress={progress} minute={LIVE.minute} ScoreDigit={DefaultScoreDigit} entranceDelays={entranceDelays} />
        <Replay onClick={() => setKey((k) => k + 1)} />
      </Shell>
    );
  };
}

const DESIGNS = [
  { id: 1, name: 'Ripple Burst Badge', Comp: makeBadgeDesign(Badge_Ripple) },
  { id: 2, name: 'Color Shift Badge', Comp: makeBadgeDesign(Badge_ColorShift) },
  { id: 3, name: 'Glow Burst Badge', Comp: makeBadgeDesign(Badge_GlowBurst) },
  { id: 4, name: 'Bounce Hop Badge', Comp: makeBadgeDesign(Badge_BounceHop) },
  { id: 5, name: 'Shake Twitch Badge', Comp: makeBadgeDesign(Badge_Shake) },
  { id: 6, name: 'Size Morph Pulse Badge', Comp: makeBadgeDesign(Badge_SizeMorph) },
  { id: 7, name: 'Entrance: Score-First Anticipation', Comp: makeEntranceDesign({ score: 0, flags: 0.18, badge: 0.36 }) },
  { id: 8, name: 'Entrance: Flags Converge First', Comp: makeEntranceDesign({ flags: 0, badge: 0.22, score: 0.4 }) },
  { id: 9, name: 'Entrance: Soft Simultaneous', Comp: makeEntranceDesign({ badge: 0.1, flags: 0.14, score: 0.16 }) },
  { id: 10, name: 'Entrance: Ring Draws, Then Reveal', Comp: makeEntranceDesign({ badge: 0.5, flags: 0.6, score: 0.75 }, true) },
];

export default function AdminLiveMatchDesigns10B() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — אותו כרטיס משחק חי, רק עדכון דקה / סדר הופעת רכיבים שונה"
      subtitle="הכרטיס, הטבעת, הדגלים והתוצאה זהים להיום — #1-6: לחץ 'עדכן דקה' לראות את התג מגיב; #7-10: לחץ 'שחזר כניסה' לראות סדר הופעה שונה"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
