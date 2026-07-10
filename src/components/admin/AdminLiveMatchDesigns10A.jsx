import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TeamFlag from '../TeamFlag';
import { LIVE, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Live Match card — batch A: minute-indicator concepts.
   SAME interaction model as the current LiveMatchCard: everything plays
   automatically on mount (minute settles in, score reveals right after) —
   no gesture required to see the result. Each card has an optional
   "🔁 שחזר" replay button only, matching the entrance-animation spirit of
   the existing design, not a gated reveal.
   Temporary comparison tab — pick one, then it gets wired in and both
   batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

const Flags = ({ size = 'w-9 h-9' }) => (
  <div className="flex items-center gap-3" dir="ltr">
    <TeamFlag logo={LIVE.homeCode} name={LIVE.home} className={size} />
    <TeamFlag logo={LIVE.awayCode} name={LIVE.away} className={size} />
  </div>
);

function Score({ delay = 0.5 }) {
  return (
    <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: 'spring', stiffness: 260, damping: 18 }}
      style={{ fontFamily: "'Russo One', sans-serif", fontSize: 20, color: '#fff' }}>
      {LIVE.homeScore} - {LIVE.awayScore}
    </motion.span>
  );
}

const Replay = ({ onClick }) => (
  <button onClick={onClick} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2">🔁 שחזר</button>
);

/* ── 1. Comet Trail Ring ──────────────────────────────────────────────────── */
function A1() {
  const [key, setKey] = useState(0);
  const pct = LIVE.minute / 90;
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg width="120" height="120" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <motion.circle cx="60" cy="60" r="52" fill="none" stroke="url(#cometGrad)" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={327} initial={{ strokeDashoffset: 327 }} animate={{ strokeDashoffset: 327 - 327 * pct }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
          <defs><linearGradient id="cometGrad"><stop offset="0%" stopColor="#f5c518" stopOpacity="0" /><stop offset="100%" stopColor="#f5c518" /></linearGradient></defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <span style={{ color: '#f5c518', fontSize: 14, fontWeight: 800 }}>{LIVE.minute}'</span>
          <Flags size="w-7 h-7" />
          <Score />
        </div>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 2. Broadcast Arc Gauge ───────────────────────────────────────────────── */
function A2() {
  const [key, setKey] = useState(0);
  const pct = LIVE.minute / 90;
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 8 }}>
      <svg width="140" height="76" viewBox="0 0 140 76">
        <path d="M10,70 A60,60 0 0 1 130,70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <motion.path d="M10,70 A60,60 0 0 1 130,70" fill="none" stroke="#f5c518" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={188} initial={{ strokeDashoffset: 188 }} animate={{ strokeDashoffset: 188 - 188 * pct }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(245,197,24,0.5))' }} />
        <text x="70" y="55" textAnchor="middle" fill="#f5c518" fontSize="16" fontWeight="800">{LIVE.minute}'</text>
      </svg>
      <Flags />
      <Score />
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 3. Racing Dial ───────────────────────────────────────────────────────── */
function A3() {
  const [key, setKey] = useState(0);
  const pct = LIVE.minute / 90;
  const angle = -120 + pct * 240;
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        <svg width="110" height="110">
          {Array.from({ length: 13 }).map((_, i) => {
            const a = (-120 + (i / 12) * 240) * (Math.PI / 180);
            const x1 = 55 + Math.cos(a) * 44, y1 = 55 + Math.sin(a) * 44, x2 = 55 + Math.cos(a) * 50, y2 = 55 + Math.sin(a) * 50;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i <= pct * 12 ? '#f5c518' : 'rgba(255,255,255,0.15)'} strokeWidth="2" />;
          })}
          <motion.line x1="55" y1="55" x2="55" y2="18" stroke="#fff" strokeWidth="2" initial={{ rotate: -120 }} animate={{ rotate: angle }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: '55px 55px' }} />
          <circle cx="55" cy="55" r="4" fill="#f5c518" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: 24 }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{LIVE.minute}'</span>
        </div>
      </div>
      <Flags />
      <Score />
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 4. Vertical Fill Thermometer ─────────────────────────────────────────── */
function A4() {
  const [key, setKey] = useState(0);
  const pct = LIVE.minute / 90;
  return (
    <Shell key={key} style={{ gap: 20 }}>
      <div style={{ width: 14, height: 90, borderRadius: 7, background: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
        <motion.div initial={{ height: 0 }} animate={{ height: `${pct * 100}%` }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg,#f5c518,#b8860b)' }} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span style={{ color: '#f5c518', fontSize: 13, fontWeight: 800 }}>{LIVE.minute}'</span>
        <Flags />
        <Score />
        <Replay onClick={() => setKey((k) => k + 1)} />
      </div>
    </Shell>
  );
}

/* ── 5. Half + Minute Concentric Rings ────────────────────────────────────── */
function A5() {
  const [key, setKey] = useState(0);
  const half = LIVE.minute > 45 ? 2 : 1;
  const minutePct = (LIVE.minute % 45) / 45;
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg width="120" height="120" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <motion.circle cx="60" cy="60" r="54" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray={339}
            initial={{ strokeDashoffset: 339 }} animate={{ strokeDashoffset: 339 - 339 * (half / 2) }} transition={{ duration: 0.6 }} />
          <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <motion.circle cx="60" cy="60" r="42" fill="none" stroke="#f5c518" strokeWidth="5" strokeLinecap="round" strokeDasharray={264}
            initial={{ strokeDashoffset: 264 }} animate={{ strokeDashoffset: 264 - 264 * minutePct }} transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span style={{ color: '#f5c518', fontSize: 13, fontWeight: 800 }}>{LIVE.minute}'</span>
          <span style={{ color: '#38bdf8', fontSize: 8 }}>מחצית {half}</span>
        </div>
      </div>
      <Flags />
      <Score />
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 6. LED Digital Flicker Counter ───────────────────────────────────────── */
function A6() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.4, 1] }} transition={{ duration: 0.5, times: [0, 0.4, 0.6, 1] }}
        style={{ padding: '6px 14px', borderRadius: 8, background: '#0a0f0a', border: '1px solid #1a2a1a' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, color: '#4ade80', textShadow: '0 0 8px #4ade80' }}>{LIVE.minute}′</span>
      </motion.div>
      <Flags />
      <Score />
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 7. Analog Stadium Clock ──────────────────────────────────────────────── */
function A7() {
  const [key, setKey] = useState(0);
  const pct = LIVE.minute / 90;
  const angle = pct * 360;
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 8 }}>
      <div style={{ width: 90, height: 90, borderRadius: '50%', border: '2px solid rgba(245,197,24,0.3)', position: 'relative', background: 'radial-gradient(circle, rgba(245,197,24,0.05), transparent)' }}>
        {[0, 90, 180, 270].map((d) => <div key={d} style={{ position: 'absolute', width: 2, height: 6, background: 'rgba(255,255,255,0.3)', left: '50%', top: 2, transform: `translateX(-50%) rotate(${d}deg)`, transformOrigin: '1px 43px' }} />)}
        <motion.div initial={{ rotate: 0 }} animate={{ rotate: angle }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', left: '50%', top: '50%', width: 2, height: 34, background: '#f5c518', transformOrigin: 'top', marginLeft: -1 }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 6, height: 6, borderRadius: '50%', background: '#f5c518', transform: 'translate(-50%,-50%)' }} />
      </div>
      <span style={{ color: '#f5c518', fontSize: 11 }}>{LIVE.minute}'</span>
      <Flags />
      <Score />
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 8. Progress Dot Stepper ──────────────────────────────────────────────── */
function A8() {
  const [key, setKey] = useState(0);
  const lit = Math.round((LIVE.minute / 90) * 18);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <div className="flex items-center gap-1" style={{ width: 200, flexWrap: 'wrap' }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span key={i} initial={{ opacity: 0.15, scale: 0.6 }} animate={{ opacity: i < lit ? 1 : 0.15, scale: i < lit ? 1 : 0.6 }} transition={{ delay: i * 0.03 }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5c518', boxShadow: i < lit ? '0 0 4px #f5c518' : 'none' }} />
        ))}
      </div>
      <span className="text-slate-400 text-[10px]">{LIVE.minute}'</span>
      <Flags />
      <Score delay={1} />
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 9. Ambient Heartbeat Ring ────────────────────────────────────────────── */
function A9() {
  const [key, setKey] = useState(0);
  const late = LIVE.minute >= 75;
  const pct = LIVE.minute / 90;
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        <svg width="110" height="110" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <motion.circle cx="55" cy="55" r="48" fill="none" stroke={late ? '#f87171' : '#f5c518'} strokeWidth="4" strokeLinecap="round" strokeDasharray={302}
            initial={{ strokeDashoffset: 302 }} animate={{ strokeDashoffset: 302 - 302 * pct, opacity: [1, late ? 0.5 : 0.75, 1] }}
            transition={{ strokeDashoffset: { duration: 1.3, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: late ? 0.6 : 1.6, repeat: Infinity, delay: 1.3 } }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span style={{ color: late ? '#f87171' : '#f5c518', fontSize: 13, fontWeight: 800 }}>{LIVE.minute}'</span>
          <Flags size="w-6 h-6" />
        </div>
      </div>
      <Score />
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 10. Mini Pitch Sun-Path ──────────────────────────────────────────────── */
function A10() {
  const [key, setKey] = useState(0);
  const pct = LIVE.minute / 90;
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'relative', width: 160, height: 60 }}>
        <svg width="160" height="60" style={{ position: 'absolute', inset: 0 }}>
          <path d="M10,55 Q80,-8 150,55" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 4" />
          <rect x="30" y="45" width="100" height="10" fill="none" stroke="rgba(245,197,24,0.2)" rx="2" />
        </svg>
        <motion.div initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: `${pct * 100}%` }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#f5c518', boxShadow: '0 0 10px #f5c518', offsetPath: 'path("M10,55 Q80,-8 150,55")' }} />
      </div>
      <span className="text-slate-400 text-[10px]">{LIVE.minute}'</span>
      <Flags />
      <Score />
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

const DESIGNS = [
  { id: 1, name: 'Comet Trail Ring', Comp: A1 },
  { id: 2, name: 'Broadcast Arc Gauge', Comp: A2 },
  { id: 3, name: 'Racing Dial', Comp: A3 },
  { id: 4, name: 'Vertical Fill Thermometer', Comp: A4 },
  { id: 5, name: 'Half + Minute Concentric Rings', Comp: A5 },
  { id: 6, name: 'LED Digital Flicker Counter', Comp: A6 },
  { id: 7, name: 'Analog Stadium Clock', Comp: A7 },
  { id: 8, name: 'Progress Dot Stepper', Comp: A8 },
  { id: 9, name: 'Ambient Heartbeat Ring', Comp: A9 },
  { id: 10, name: 'Mini Pitch Sun-Path', Comp: A10 },
];

export default function AdminLiveMatchDesigns10A() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — כרטיס משחק חי (אינדיקטור דקה, אוטומטי)"
      subtitle="באותו סגנון כמו הכרטיס הקיים היום — הכל קורה אוטומטית בטעינה, בלי צורך ללחוץ כדי לראות תוצאה"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
