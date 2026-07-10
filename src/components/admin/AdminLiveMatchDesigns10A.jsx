import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TeamFlag from '../TeamFlag';
import { LIVE, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Round 1 (of 2): 10 alternative concepts for the Live Match intro card
   (Layout.jsx LiveMatchCard). Focus: creative minute indicators, each with
   an interactive reveal gesture that keeps the score hidden/blurred until
   the user acts — preserving the "tension before result" quality of the
   current ring design.
   Temporary comparison tab — pick one, then it gets wired in and both
   batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

function ScoreText({ revealed, size = 20 }) {
  return (
    <motion.span
      animate={{ filter: revealed ? 'blur(0px)' : 'blur(6px)', opacity: revealed ? 1 : 0.45 }}
      transition={{ duration: 0.35 }}
      style={{ fontFamily: "'Russo One', sans-serif", fontSize: size, color: '#fff' }}
    >
      {LIVE.homeScore} - {LIVE.awayScore}
    </motion.span>
  );
}

const Flags = ({ size = 'w-10 h-10' }) => (
  <div className="flex items-center gap-3" dir="ltr">
    <TeamFlag logo={LIVE.homeCode} name={LIVE.home} className={size} />
    <TeamFlag logo={LIVE.awayCode} name={LIVE.away} className={size} />
  </div>
);

const Hint = ({ children }) => <span className="text-[10px] text-slate-500">{children}</span>;

/* ── 1. Heartbeat Monitor ─────────────────────────────────────────────────── */
function A1() {
  const [revealed, setRevealed] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 12 }}>
      <svg width="200" height="40" viewBox="0 0 200 40">
        <motion.path
          d="M0,20 L60,20 L72,4 L84,36 L96,20 L200,20"
          fill="none" stroke="#4ade80" strokeWidth="2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          style={{ filter: 'drop-shadow(0 0 4px #4ade80)' }}
        />
      </svg>
      <span style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: 12 }}>{LIVE.minute}'</span>
      <Flags />
      <div onClick={() => setRevealed((r) => !r)} style={{ cursor: 'pointer' }}><ScoreText revealed={revealed} /></div>
      <Hint>הקש על הדופק כדי לגלות תוצאה</Hint>
    </Shell>
  );
}

/* ── 2. Pressure Gauge ────────────────────────────────────────────────────── */
function A2() {
  const [revealed, setRevealed] = useState(false);
  const pct = LIVE.minute / 90;
  const angle = -90 + pct * 180;
  return (
    <Shell style={{ flexDirection: 'column', gap: 8 }}>
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path d="M10,75 A60,60 0 0 1 130,75" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <path d="M10,75 A60,60 0 0 1 130,75" fill="none" stroke="#f5c518" strokeWidth="8" strokeDasharray={188} strokeDashoffset={188 - 188 * pct} style={{ filter: 'drop-shadow(0 0 6px rgba(245,197,24,0.5))' }} />
        <motion.line x1="70" y1="75" x2="70" y2="25" stroke="#fff" strokeWidth="2" animate={{ rotate: angle }} style={{ transformOrigin: '70px 75px' }} />
      </svg>
      <span style={{ color: '#f5c518', fontFamily: 'monospace', fontSize: 12 }}>{LIVE.minute}' לחץ</span>
      <Flags />
      <button onClick={() => setRevealed((r) => !r)} className="text-[10px] px-3 py-1 rounded-full border border-amber-400/40 text-amber-300">💨 שחרר שסתום</button>
      <ScoreText revealed={revealed} />
    </Shell>
  );
}

/* ── 3. Sun Arc ───────────────────────────────────────────────────────────── */
function A3() {
  const [revealed, setRevealed] = useState(false);
  const pct = LIVE.minute / 90;
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'relative', width: 200, height: 70 }}>
        <svg width="200" height="70" style={{ position: 'absolute', inset: 0 }}>
          <path d="M10,65 Q100,-10 190,65" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 4" />
        </svg>
        <motion.div
          onClick={() => setRevealed((r) => !r)}
          animate={{ offsetDistance: `${pct * 100}%` }}
          style={{ cursor: 'pointer', position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: '#f5c518', boxShadow: '0 0 12px #f5c518', offsetPath: 'path("M10,65 Q100,-10 190,65")' }}
        />
      </div>
      <span className="text-slate-400 text-[11px]">{LIVE.minute}'</span>
      <Flags />
      <ScoreText revealed={revealed} />
      <Hint>הקש על השמש לפתיחת הזרקור</Hint>
    </Shell>
  );
}

/* ── 4. Running Track ─────────────────────────────────────────────────────── */
function A4() {
  const [revealed, setRevealed] = useState(false);
  const pct = LIVE.minute / 90;
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'relative', width: 180, height: 90 }}>
        <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <motion.div
          onClick={() => setRevealed(true)}
          animate={{ offsetDistance: `${pct * 100}%` }}
          style={{ cursor: 'pointer', position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: '#f5c518', offsetPath: 'path("M90,2 A88,43 0 1 1 89.9,2")', boxShadow: '0 0 8px #f5c518' }}
        >⚽</motion.div>
        <div className="absolute inset-0 flex items-center justify-center"><Flags size="w-8 h-8" /></div>
      </div>
      <ScoreText revealed={revealed} />
      <Hint>הקש על הכדור כדי לדחוף לקו הסיום</Hint>
    </Shell>
  );
}

/* ── 5. Constellation Line ────────────────────────────────────────────────── */
function A5() {
  const [revealed, setRevealed] = useState(false);
  const lit = Math.round((LIVE.minute / 90) * 8);
  return (
    <Shell style={{ flexDirection: 'column', gap: 12 }}>
      <Flags />
      <div className="flex items-center gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span key={i} animate={{ opacity: i < lit ? 1 : 0.15, scale: i < lit ? 1 : 0.7 }} onClick={() => i === lit - 1 && setRevealed(true)}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5c518', boxShadow: i < lit ? '0 0 6px #f5c518' : 'none', cursor: i === lit - 1 ? 'pointer' : 'default' }} />
        ))}
      </div>
      <ScoreText revealed={revealed} />
      <Hint>הקש על הכוכב האחרון שנדלק</Hint>
    </Shell>
  );
}

/* ── 6. Momentum Tug Bar ──────────────────────────────────────────────────── */
function A6() {
  const [revealed, setRevealed] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <Flags />
      <div onClick={() => setRevealed((r) => !r)} style={{ cursor: 'pointer', width: 180, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
        <motion.div animate={{ x: [0, 14, -6, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: '30%', right: '35%', background: 'linear-gradient(90deg,#0d3b66,#f5c518)', borderRadius: 4 }} />
      </div>
      <span className="text-slate-400 text-[10px]">{LIVE.minute}'</span>
      <ScoreText revealed={revealed} />
      <Hint>הקש על הפס לשחרור התוצאה</Hint>
    </Shell>
  );
}

/* ── 7. Broadcast Waveform ────────────────────────────────────────────────── */
function A7() {
  const [revealed, setRevealed] = useState(false);
  const bars = useMemo(() => Array.from({ length: 20 }, (_, i) => ({ h: 6 + Math.random() * 22, d: i * 0.05 })), []);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <Flags />
      <div onClick={() => setRevealed((r) => !r)} className="flex items-end gap-1" style={{ height: 28, cursor: 'pointer' }}>
        {bars.map((b, i) => (
          <motion.span key={i} animate={{ height: [b.h * 0.4, b.h, b.h * 0.5, b.h] }} transition={{ duration: 1, repeat: Infinity, delay: b.d }}
            style={{ width: 3, borderRadius: 2, background: revealed ? '#4ade80' : '#f5c518' }} />
        ))}
      </div>
      <span className="text-slate-400 text-[10px]">{LIVE.minute}' — שידור חי</span>
      <ScoreText revealed={revealed} />
      <Hint>הקש על הגלים כדי "לכוון" לתוצאה</Hint>
    </Shell>
  );
}

/* ── 8. Scratch Reveal ────────────────────────────────────────────────────── */
function A8() {
  const [prog, setProg] = useState(0);
  const revealed = prog > 70;
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <Flags />
      <span className="text-slate-400 text-[10px]">{LIVE.minute}'</span>
      <div
        onMouseMove={(e) => { if (e.buttons === 1) setProg((p) => Math.min(p + 6, 100)); }}
        onTouchMove={() => setProg((p) => Math.min(p + 6, 100))}
        style={{ position: 'relative', width: 110, height: 34, borderRadius: 8, overflow: 'hidden', cursor: 'grab' }}
      >
        <div className="absolute inset-0 flex items-center justify-center"><ScoreText revealed size={16} /></div>
        <motion.div animate={{ opacity: 1 - prog / 100 }} style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, #64748b, #64748b 4px, #475569 4px 8px)' }} />
      </div>
      <Hint>{revealed ? '🎉 חשוף!' : 'גרור (לחוץ) על השטח כדי לגרד'}</Hint>
    </Shell>
  );
}

/* ── 9. Peek Spotlight ────────────────────────────────────────────────────── */
function A9() {
  const [pos, setPos] = useState(null);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <Flags />
      <span className="text-slate-400 text-[10px]">{LIVE.minute}'</span>
      <div
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
        onMouseLeave={() => setPos(null)}
        style={{ position: 'relative', width: 120, height: 36, borderRadius: 8, overflow: 'hidden', background: '#111' }}
      >
        <div className="absolute inset-0 flex items-center justify-center"><ScoreText revealed size={16} /></div>
        <div style={{ position: 'absolute', inset: 0, background: '#0a0f16', maskImage: pos ? `radial-gradient(circle 26px at ${pos.x}% ${pos.y}%, transparent 0%, black 70%)` : 'none', WebkitMaskImage: pos ? `radial-gradient(circle 26px at ${pos.x}% ${pos.y}%, transparent 0%, black 70%)` : 'none' }} />
      </div>
      <Hint>הזז עכבר מעל כדי לגלות עם פנס</Hint>
    </Shell>
  );
}

/* ── 10. Hold-to-Peek ─────────────────────────────────────────────────────── */
function A10() {
  const [held, setHeld] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 12 }}>
      <Flags />
      <span className="text-slate-400 text-[10px]">{LIVE.minute}'</span>
      <div
        onMouseDown={() => setHeld(true)} onMouseUp={() => setHeld(false)} onMouseLeave={() => setHeld(false)}
        onTouchStart={() => setHeld(true)} onTouchEnd={() => setHeld(false)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <ScoreText revealed={held} />
      </div>
      <Hint>לחץ והחזק כדי להתמקד, שחרר וזה מיטשטש שוב</Hint>
    </Shell>
  );
}

const DESIGNS = [
  { id: 1, name: 'Heartbeat Monitor', Comp: A1 },
  { id: 2, name: 'Pressure Gauge', Comp: A2 },
  { id: 3, name: 'Sun Arc', Comp: A3 },
  { id: 4, name: 'Running Track', Comp: A4 },
  { id: 5, name: 'Constellation Line', Comp: A5 },
  { id: 6, name: 'Momentum Tug Bar', Comp: A6 },
  { id: 7, name: 'Broadcast Waveform', Comp: A7 },
  { id: 8, name: 'Scratch Reveal', Comp: A8 },
  { id: 9, name: 'Peek Spotlight', Comp: A9 },
  { id: 10, name: 'Hold-to-Peek', Comp: A10 },
];

export default function AdminLiveMatchDesigns10A() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — כרטיס משחק חי (סבב 1: אינדיקטור דקה)"
      subtitle="התוצאה מוסתרת/מטושטשת בכוונה — נסה ללחוץ/לגרור/להזיז עכבר כדי לחשוף אותה"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
