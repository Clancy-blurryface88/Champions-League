import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeamFlag from '../TeamFlag';
import { LIVE, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Live Match card — batch B: score-reveal-flourish concepts.
   Same automatic entrance model as the current LiveMatchCard: the minute
   settles first, then the score plays its reveal moment on its own —
   no gesture required. Each has an optional "🔁 שחזר" replay button.
   Temporary comparison tab — pick one, then it gets wired in and both
   batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

const Flags = ({ size = 'w-9 h-9' }) => (
  <div className="flex items-center gap-3" dir="ltr">
    <TeamFlag logo={LIVE.homeCode} name={LIVE.home} className={size} />
    <TeamFlag logo={LIVE.awayCode} name={LIVE.away} className={size} />
  </div>
);
const Minute = () => <span className="text-slate-400 text-[10px]">{LIVE.minute}'</span>;
const Replay = ({ onClick }) => (
  <button onClick={onClick} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2">🔁 שחזר</button>
);

/* ── 1. Broadcast Slam ────────────────────────────────────────────────────── */
function B1() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <Flags /><Minute />
      <div style={{ position: 'relative' }}>
        <motion.div initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ delay: 0.6, duration: 0.25 }} style={{ position: 'absolute', inset: -10, background: '#fff', borderRadius: 8 }} />
        <motion.span initial={{ scale: 2.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.55, type: 'spring', stiffness: 320, damping: 14 }}
          style={{ fontFamily: "'Russo One', sans-serif", fontSize: 22, color: '#fff', position: 'relative' }}>{LIVE.homeScore} - {LIVE.awayScore}</motion.span>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 2. Slot Reel Landing ─────────────────────────────────────────────────── */
function ReelDigit({ target, delay }) {
  const seq = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), target];
  return (
    <div style={{ width: 22, height: 26, overflow: 'hidden', borderRadius: 4, background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.3)' }}>
      <motion.div initial={{ y: 0 }} animate={{ y: -26 * (seq.length - 1) }} transition={{ delay, duration: 0.6, ease: 'easeIn' }}>
        {seq.map((n, i) => <div key={i} style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 800, color: '#f5c518' }}>{n}</div>)}
      </motion.div>
    </div>
  );
}
function B2() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 12 }}>
      <Flags /><Minute />
      <div className="flex items-center gap-2">
        <ReelDigit target={LIVE.homeScore} delay={0.5} />
        <span className="text-slate-500 text-xs">-</span>
        <ReelDigit target={LIVE.awayScore} delay={0.65} />
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 3. Gold Pulse Settle ─────────────────────────────────────────────────── */
function B3() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <Flags /><Minute />
      <motion.span
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, color: ['#f5c518', '#f5c518', '#fff'], textShadow: ['0 0 0px rgba(245,197,24,0)', '0 0 20px rgba(245,197,24,0.8)', '0 0 0px rgba(245,197,24,0)'] }}
        transition={{ delay: 0.5, duration: 1.3, times: [0, 0.3, 1] }}
        style={{ fontFamily: "'Russo One', sans-serif", fontSize: 22 }}
      >{LIVE.homeScore} - {LIVE.awayScore}</motion.span>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 4. LIVE Chip Flicker ─────────────────────────────────────────────────── */
function B4() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <Flags /><Minute />
      <div className="flex items-center gap-2">
        <motion.span initial={{ opacity: 0.4 }} animate={{ opacity: [0.4, 1, 0.4, 1] }} transition={{ delay: 0.4, duration: 0.6 }}
          style={{ fontSize: 8, fontWeight: 800, color: '#f87171', border: '1px solid rgba(248,113,113,0.5)', borderRadius: 999, padding: '2px 6px' }}>LIVE</motion.span>
        <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: "'Russo One', sans-serif", fontSize: 20, color: '#fff' }}>{LIVE.homeScore} - {LIVE.awayScore}</motion.span>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 5. Metallic Light Sweep ──────────────────────────────────────────────── */
function B5() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <Flags /><Minute />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ position: 'relative', overflow: 'hidden' }}>
        <span style={{ fontFamily: "'Russo One', sans-serif", fontSize: 22, color: '#fff' }}>{LIVE.homeScore} - {LIVE.awayScore}</span>
        <motion.div initial={{ x: '-120%' }} animate={{ x: '220%' }} transition={{ delay: 0.7, duration: 0.7, ease: 'easeIn' }}
          style={{ position: 'absolute', top: 0, bottom: 0, width: '30%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)', transform: 'skewX(-20deg)' }} />
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 6. Goal Count-Up ─────────────────────────────────────────────────────── */
function useCountUp(target, start, active) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) { setN(0); return; }
    let i = 0;
    const t = setTimeout(function tick() {
      i += 1; setN(i);
      if (i < target) setTimeout(tick, 380);
    }, start);
    return () => clearTimeout(t);
  }, [active, target, start]);
  return n;
}
function B6() {
  const [key, setKey] = useState(0);
  const home = useCountUp(LIVE.homeScore, 500, true);
  const away = useCountUp(LIVE.awayScore, 500, true);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <Flags /><Minute />
      <div className="flex items-center gap-2">
        <motion.span key={home} initial={{ scale: 1.4 }} animate={{ scale: 1 }} style={{ fontFamily: "'Russo One', sans-serif", fontSize: 22, color: '#fff' }}>{home}</motion.span>
        <span className="text-slate-500">-</span>
        <motion.span key={away} initial={{ scale: 1.4 }} animate={{ scale: 1 }} style={{ fontFamily: "'Russo One', sans-serif", fontSize: 22, color: '#fff' }}>{away}</motion.span>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 7. Referee Whistle Beat ──────────────────────────────────────────────── */
function B7() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <Flags /><Minute />
      <motion.span initial={{ scale: 1, opacity: 1 }} animate={{ scale: [1, 1.5, 1], opacity: [1, 1, 0] }} transition={{ delay: 0.3, duration: 0.4 }}
        style={{ position: 'absolute', fontSize: 20 }}>🔺</motion.span>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
        style={{ fontFamily: "'Russo One', sans-serif", fontSize: 22, color: '#fff' }}>{LIVE.homeScore} - {LIVE.awayScore}</motion.span>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 8. CRT Power-On Scoreboard ───────────────────────────────────────────── */
function B8() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <Flags /><Minute />
      <motion.div initial={{ scaleY: 0.02, opacity: 0 }} animate={{ scaleY: [0.02, 1.15, 0.9, 1], opacity: 1 }} transition={{ delay: 0.5, duration: 0.5, times: [0, 0.5, 0.8, 1] }}
        style={{ padding: '5px 14px', borderRadius: 6, background: '#0a0f0a', border: '1px solid #1a2a1a' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: '#4ade80', textShadow: '0 0 8px #4ade80' }}>{LIVE.homeScore}-{LIVE.awayScore}</span>
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 9. Collide-In Digits ─────────────────────────────────────────────────── */
function B9() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 10 }}>
      <Flags /><Minute />
      <div className="flex items-center gap-2">
        <motion.span initial={{ x: -60, opacity: 0 }} animate={{ x: [-60, 3, 0], opacity: 1 }} transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
          style={{ fontFamily: "'Russo One', sans-serif", fontSize: 22, color: '#fff' }}>{LIVE.homeScore}</motion.span>
        <span className="text-slate-500">-</span>
        <motion.span initial={{ x: 60, opacity: 0 }} animate={{ x: [60, -3, 0], opacity: 1 }} transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
          style={{ fontFamily: "'Russo One', sans-serif", fontSize: 22, color: '#fff' }}>{LIVE.awayScore}</motion.span>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 10. Gold Underline Draw ──────────────────────────────────────────────── */
function B10() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 8 }}>
      <Flags /><Minute />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ fontFamily: "'Russo One', sans-serif", fontSize: 22, color: '#fff' }}>{LIVE.homeScore} - {LIVE.awayScore}</motion.span>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: 60, height: 2, background: '#f5c518', transformOrigin: 'center', boxShadow: '0 0 6px #f5c518' }} />
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

const DESIGNS = [
  { id: 1, name: 'Broadcast Slam', Comp: B1 },
  { id: 2, name: 'Slot Reel Landing', Comp: B2 },
  { id: 3, name: 'Gold Pulse Settle', Comp: B3 },
  { id: 4, name: 'LIVE Chip Flicker', Comp: B4 },
  { id: 5, name: 'Metallic Light Sweep', Comp: B5 },
  { id: 6, name: 'Goal Count-Up', Comp: B6 },
  { id: 7, name: 'Referee Whistle Beat', Comp: B7 },
  { id: 8, name: 'CRT Power-On Scoreboard', Comp: B8 },
  { id: 9, name: 'Collide-In Digits', Comp: B9 },
  { id: 10, name: 'Gold Underline Draw', Comp: B10 },
];

export default function AdminLiveMatchDesigns10B() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — כרטיס משחק חי (רגע חשיפת התוצאה, אוטומטי)"
      subtitle="הדקה מתיישבת קודם, ואז התוצאה 'נכנסת' ברגע דרמטי משלה — בדיוק כמו היום, רק ואריאציות שונות"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
