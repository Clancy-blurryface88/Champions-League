import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LIVE, LiveCardShell, DefaultScoreDigit, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Live Match card — batch G: minute-badge UPDATE styles, round 3.
   Same exact card as production. Only how the gold minute badge reacts
   when the minute ticks is different. Click "עדכן דקה" to bump it.
   Temporary comparison tab — pick one, then it gets wired in and all
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

/* ── 1. Compass Spin Snap ─────────────────────────────────────────────────── */
function Badge_CompassSpin({ minute }) {
  return (
    <motion.span key={minute} initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'inline-block', background: '#FFD700', ...badgeBase }}>{minute}'</motion.span>
  );
}

/* ── 2. Camera Shutter Blink ──────────────────────────────────────────────── */
function Badge_Shutter({ minute }) {
  return (
    <motion.span key={minute} initial={{ scaleY: 1 }} animate={{ scaleY: [1, 0.05, 1] }} transition={{ duration: 0.32, times: [0, 0.5, 1] }}
      style={{ display: 'inline-block', background: '#FFD700', ...badgeBase }}>{minute}'</motion.span>
  );
}

/* ── 3. Sonar Ping Expand (square) ────────────────────────────────────────── */
function Badge_SonarSquare({ minute }) {
  return (
    <div style={{ position: 'relative' }}>
      <motion.span key={`sonar-${minute}`} initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 0.5 }}
        style={{ position: 'absolute', inset: -2, borderRadius: 4, border: '1.5px solid #FFD700' }} />
      <span style={{ position: 'relative', background: '#FFD700', ...badgeBase }}>{minute}'</span>
    </div>
  );
}

/* ── 4. Confetti Pop Micro ────────────────────────────────────────────────── */
function Badge_ConfettiPop({ minute }) {
  const pieces = [-14, -7, 7, 14];
  return (
    <div style={{ position: 'relative' }}>
      {pieces.map((x, i) => (
        <motion.span key={`${minute}-${i}`} initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x, y: -10 - i * 2, opacity: 0, rotate: x * 4 }} transition={{ duration: 0.4 }}
          style={{ position: 'absolute', left: '50%', top: '50%', width: 3, height: 3, background: i % 2 ? '#fff' : '#f5c518' }} />
      ))}
      <span style={{ position: 'relative', background: '#FFD700', ...badgeBase }}>{minute}'</span>
    </div>
  );
}

/* ── 5. Liquid Blob Jiggle ────────────────────────────────────────────────── */
function Badge_BlobJiggle({ minute }) {
  return (
    <motion.span key={minute} animate={{ borderRadius: ['999px', '40% 60% 55% 45%/50% 45% 55% 50%', '999px'] }} transition={{ duration: 0.45 }}
      style={{ display: 'inline-block', background: '#FFD700', ...badgeBase }}>{minute}'</motion.span>
  );
}

/* ── 6. Spark Flint Strike ────────────────────────────────────────────────── */
function Badge_SparkStrike({ minute }) {
  return (
    <div style={{ position: 'relative' }}>
      <motion.span key={`spark-${minute}`} initial={{ x: 0, y: 0, opacity: 1, scaleX: 1 }} animate={{ x: 14, y: -10, opacity: 0, scaleX: 2.5 }} transition={{ duration: 0.3 }}
        style={{ position: 'absolute', right: 0, top: 0, width: 6, height: 1.5, background: '#fff', boxShadow: '0 0 6px #fff' }} />
      <span style={{ position: 'relative', background: '#FFD700', ...badgeBase }}>{minute}'</span>
    </div>
  );
}

/* ── 7. Gyroscope Wobble 3D ───────────────────────────────────────────────── */
function Badge_Gyroscope({ minute }) {
  return (
    <div style={{ perspective: 120 }}>
      <motion.span key={minute} animate={{ rotateX: [0, 20, -12, 0], rotateY: [0, -18, 10, 0] }} transition={{ duration: 0.5 }}
        style={{ display: 'inline-block', background: '#FFD700', ...badgeBase }}>{minute}'</motion.span>
    </div>
  );
}

/* ── 8. Radar Blip Ping ───────────────────────────────────────────────────── */
function Badge_RadarBlip({ minute }) {
  return (
    <div style={{ position: 'relative' }}>
      <motion.div key={`blip-${minute}`} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }}
        style={{ position: 'absolute', left: '50%', top: '50%', width: 30, height: 1, background: 'linear-gradient(90deg, #FFD700, transparent)', transformOrigin: 'left' }} />
      <span style={{ position: 'relative', background: '#FFD700', ...badgeBase }}>{minute}'</span>
    </div>
  );
}

/* ── 9. Typewriter Digit Type-In ──────────────────────────────────────────── */
function Badge_TypeIn({ minute }) {
  return (
    <span style={{ background: '#FFD700', ...badgeBase, display: 'inline-block' }}>
      <motion.span key={minute} initial={{ width: 0 }} animate={{ width: 'auto' }} transition={{ duration: 0.3 }} style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
        {minute}'
      </motion.span>
    </span>
  );
}

/* ── 10. Energy Charge-Up ─────────────────────────────────────────────────── */
function Badge_ChargeUp({ minute }) {
  return (
    <motion.span key={minute} initial={{ boxShadow: '0 0 0px rgba(245,197,24,0)' }} animate={{ boxShadow: ['0 0 0px rgba(245,197,24,0)', '0 0 4px rgba(245,197,24,0.3)', '0 0 20px rgba(245,197,24,1)', '0 2px 8px rgba(0,0,0,0.5)'] }}
      transition={{ duration: 0.6, times: [0, 0.4, 0.75, 1] }}
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
  { id: 1, name: 'Compass Spin Snap', Comp: makeBadgeDesign(Badge_CompassSpin) },
  { id: 2, name: 'Camera Shutter Blink', Comp: makeBadgeDesign(Badge_Shutter) },
  { id: 3, name: 'Sonar Ping Expand', Comp: makeBadgeDesign(Badge_SonarSquare) },
  { id: 4, name: 'Confetti Pop Micro', Comp: makeBadgeDesign(Badge_ConfettiPop) },
  { id: 5, name: 'Liquid Blob Jiggle', Comp: makeBadgeDesign(Badge_BlobJiggle) },
  { id: 6, name: 'Spark Flint Strike', Comp: makeBadgeDesign(Badge_SparkStrike) },
  { id: 7, name: 'Gyroscope Wobble 3D', Comp: makeBadgeDesign(Badge_Gyroscope) },
  { id: 8, name: 'Radar Blip Ping', Comp: makeBadgeDesign(Badge_RadarBlip) },
  { id: 9, name: 'Typewriter Digit Type-In', Comp: makeBadgeDesign(Badge_TypeIn) },
  { id: 10, name: 'Energy Charge-Up', Comp: makeBadgeDesign(Badge_ChargeUp) },
];

export default function AdminLiveMatchDesigns10G() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — אותו כרטיס משחק חי, תגובת תג הדקה (סבב 3)"
      subtitle="לחץ 'עדכן דקה' כדי לראות כל וריאציה"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
