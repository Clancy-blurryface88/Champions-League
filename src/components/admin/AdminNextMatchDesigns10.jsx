import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamFlag from '../TeamFlag';

/* ──────────────────────────────────────────────────────────────────────────
   10 alternative concepts for the "Next Match Intro" overlay (Layout.jsx).
   Temporary comparison tab — pick one, then it gets wired into Layout.jsx
   and this file gets removed.
   ────────────────────────────────────────────────────────────────────────── */

const MOCK = { teamA: 'ברזיל', teamACode: 'br', teamB: 'ארגנטינה', teamBCode: 'ar' };
const MOCK2 = { teamA: 'ספרד', teamACode: 'es', teamB: 'צרפת', teamBCode: 'fr' };

const TARGET = new Date(Date.now() + ((2 * 24 + 14) * 3600 + 37 * 60 + 9) * 1000).toISOString();
const TARGET2 = new Date(Date.now() + 5 * 86400000).toISOString();

function diff(target) {
  const ms = Math.max(new Date(target).getTime() - Date.now(), 0);
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

function useCountdown(target) {
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    const iv = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(iv);
  }, [target]);
  return t;
}

const pad = (n) => String(n).padStart(2, '0');

/* ── shared flip-digit atom (used by #1 and #4) ─────────────────────────── */
function FlipUnit({ value, label, accent, glow }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', overflow: 'hidden', width: 34, height: 30, borderRadius: 6, background: 'rgba(0,0,0,0.35)', border: `1px solid ${accent}55` }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'monospace', fontWeight: 800, fontSize: 15, color: accent,
              textShadow: glow ? `0 0 6px ${accent}, 0 0 16px ${accent}88` : 'none',
            }}
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{label}</div>
    </div>
  );
}

const Shell = ({ children, style, className = '' }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ minHeight: 260, ...style }}>
    {children}
  </div>
);

/* ── 1. Broadcast Lower-Third ────────────────────────────────────────────── */
function D1() {
  const t = useCountdown(TARGET);
  return (
    <Shell style={{ alignItems: 'flex-end', paddingBottom: 18 }}>
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        style={{
          width: '92%', clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)',
          background: 'linear-gradient(90deg, rgba(3,13,26,0.97), rgba(20,32,52,0.9))',
          borderTop: '2px solid #f5c518', padding: '14px 26px',
        }}
      >
        <div className="flex items-center justify-between" dir="ltr">
          <div className="flex items-center gap-2">
            <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-9 h-9" rounded="md" />
            <span className="text-white text-sm font-bold">{MOCK.teamA}</span>
          </div>
          <span style={{ color: '#f5c518', fontFamily: "'Russo One', sans-serif", fontSize: 12 }}>VS</span>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-bold">{MOCK.teamB}</span>
            <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-9 h-9" rounded="md" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <FlipUnit value={t.days} label="ימים" accent="#f5c518" />
          <FlipUnit value={t.hours} label="שעות" accent="#f5c518" />
          <FlipUnit value={t.minutes} label="דק" accent="#f5c518" />
          <FlipUnit value={t.seconds} label="שנ" accent="#f5c518" />
        </div>
      </motion.div>
    </Shell>
  );
}

/* ── 2. Coin Toss Reveal ─────────────────────────────────────────────────── */
function D2() {
  const [spin, setSpin] = useState(0);
  return (
    <Shell style={{ flexDirection: 'column', gap: 14, perspective: 800 }}>
      <div className="flex items-center gap-10" key={spin}>
        <motion.div initial={{ rotateY: 180, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-16 h-16" rounded="full" />
        </motion.div>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }} style={{ color: '#f5c518', fontWeight: 900, fontSize: 13 }}>VS</motion.span>
        <motion.div initial={{ rotateY: -180, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-16 h-16" rounded="full" />
        </motion.div>
      </div>
      <button onClick={() => setSpin((s) => s + 1)} className="text-[11px] text-slate-400 hover:text-amber-300 transition-colors underline underline-offset-2">
        הקש להטיל שוב 🪙
      </button>
    </Shell>
  );
}

/* ── 3. Stadium Tunnel ───────────────────────────────────────────────────── */
function D3() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const particles = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ left: 8 + i * 9, delay: i * 0.15 })), []);
  return (
    <Shell
      style={{ perspective: 700 }}
      className=""
    >
      <div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -6, y: ((e.clientX - r.left) / r.width - 0.5) * 6 });
        }}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ position: 'relative', width: '90%', height: 200, borderRadius: 16, overflow: 'hidden', background: 'radial-gradient(circle at 50% 30%, rgba(245,197,24,0.1), rgba(3,13,26,0.95) 70%)', border: '1px solid rgba(245,197,24,0.25)', transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 0.15s ease-out' }}
      >
        {particles.map((p, i) => (
          <motion.span key={i} style={{ position: 'absolute', left: `${p.left}%`, bottom: 0, width: 3, height: 3, borderRadius: '50%', background: '#f5c518' }}
            animate={{ y: [-6, -170], opacity: [0, 0.8, 0] }} transition={{ duration: 2.4, delay: p.delay, repeat: Infinity, ease: 'easeOut' }} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center gap-10">
          <motion.div initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-14 h-14" />
          </motion.div>
          <span style={{ color: '#f5c518', fontFamily: "'Russo One', sans-serif" }}>VS</span>
          <motion.div initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-14 h-14" />
          </motion.div>
        </div>
      </div>
    </Shell>
  );
}

/* ── 4. Scoreboard Drop (LED) ────────────────────────────────────────────── */
function D4() {
  const t = useCountdown(TARGET);
  return (
    <Shell>
      <div style={{
        padding: '20px 28px', borderRadius: 10, background: '#0a0f0a',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '4px 4px',
        border: '2px solid #1a2a1a', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)',
      }}>
        <div className="text-center mb-2" style={{ color: '#4ade80', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2 }}>המשחק הבא</div>
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <FlipUnit value={t.days} label="ימים" accent="#4ade80" glow />
          <FlipUnit value={t.hours} label="שעות" accent="#4ade80" glow />
          <FlipUnit value={t.minutes} label="דק" accent="#4ade80" glow />
          <FlipUnit value={t.seconds} label="שנ" accent="#4ade80" glow />
        </div>
        <div className="flex items-center justify-center gap-4" dir="ltr">
          <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-8 h-8" />
          <span style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: 11 }}>VS</span>
          <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-8 h-8" />
        </div>
      </div>
    </Shell>
  );
}

/* ── 5. Gold Ticket Tear ─────────────────────────────────────────────────── */
function D5() {
  const [torn, setTorn] = useState(false);
  const STAGE_BG = '#0b1626';
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <motion.div
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.5}
        onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 90) { setTorn(true); setTimeout(() => setTorn(false), 1200); } }}
        animate={torn ? { opacity: 0.3, scale: 0.94 } : { opacity: 1, scale: 1 }}
        style={{ width: 300, background: 'rgba(245,197,24,0.06)', border: '1.5px dashed rgba(245,197,24,0.5)', borderRadius: 14, cursor: 'grab', position: 'relative' }}
      >
        <div style={{ position: 'absolute', left: -8, top: '50%', width: 16, height: 16, borderRadius: '50%', background: STAGE_BG, transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', right: -8, top: '50%', width: 16, height: 16, borderRadius: '50%', background: STAGE_BG, transform: 'translateY(-50%)' }} />
        <div className="px-5 py-4 flex flex-col items-center gap-2">
          <span style={{ color: '#f5c518', fontSize: 9, letterSpacing: 2, fontWeight: 700 }}>⚽ BOARDING PASS ⚽</span>
          <div className="flex items-center gap-4" dir="ltr">
            <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-10 h-10" />
            <span className="text-slate-400 text-[10px]">VS</span>
            <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-10 h-10" />
          </div>
        </div>
        <div style={{ borderTop: '1.5px dashed rgba(245,197,24,0.5)' }} className="px-5 py-2 text-center">
          <span className="text-white text-xs font-bold">GATE · {new Date(TARGET).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })} · {new Date(TARGET).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </motion.div>
      <span className="text-[10px] text-slate-500">גרור הצידה כדי "לקרוע" (הדגמה)</span>
    </Shell>
  );
}

/* ── 6. Prediction Wager Bar ─────────────────────────────────────────────── */
function D6() {
  return (
    <Shell style={{ flexDirection: 'column', gap: 16 }}>
      <div className="flex items-center gap-6" dir="ltr">
        <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-12 h-12" />
        <span style={{ color: '#f5c518', fontSize: 11 }}>VS</span>
        <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-12 h-12" />
      </div>
      <div style={{ width: 260 }}>
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-slate-400">ההימור שלי: (2-1)</span>
          <span className="text-[10px] font-bold" style={{ color: '#f5c518' }}>62%</span>
        </div>
        <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #b8860b, #f5c518, #fff7cc)', backgroundSize: '200% 100%', position: 'relative', overflow: 'hidden' }}
          >
            <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)' }} />
          </motion.div>
        </div>
        <span className="text-[9px] text-slate-500 mt-1 block text-center">רמת הביטחון שלך בניחוש</span>
      </div>
    </Shell>
  );
}

/* ── 7. Live Pulse Ring ──────────────────────────────────────────────────── */
function D7() {
  const [urgent, setUrgent] = useState(false);
  const accent = urgent ? '#f87171' : '#f5c518';
  return (
    <Shell style={{ flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative', width: 170, height: 170 }}>
        <svg width="170" height="170" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="85" cy="85" r="78" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <motion.circle
            cx="85" cy="85" r="78" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={490}
            animate={{ strokeDashoffset: [490, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: urgent ? 1.4 : 4, repeat: Infinity, ease: 'linear' }}
            style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-3" dir="ltr">
            <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-10 h-10" />
            <span style={{ color: accent, fontSize: 10 }}>VS</span>
            <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-10 h-10" />
          </div>
        </div>
      </div>
      <button onClick={() => setUrgent((u) => !u)} className="text-[10px] px-3 py-1 rounded-full transition-colors" style={{ border: `1px solid ${accent}55`, color: accent }}>
        {urgent ? '⏱ מצב רגיל' : '⏰ סימולציה: דקה אחרונה'}
      </button>
    </Shell>
  );
}

/* ── 8. Head-to-Head Duel ────────────────────────────────────────────────── */
function D8() {
  const [pick, setPick] = useState(null);
  return (
    <Shell style={{ padding: 0 }}>
      <div style={{ width: '92%', height: 190, position: 'relative', borderRadius: 14, overflow: 'hidden', display: 'flex' }}>
        <motion.div onClick={() => setPick('a')} animate={{ flex: pick === 'a' ? 1.3 : 1 }} transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          className="cursor-pointer flex flex-col items-center justify-center gap-2"
          style={{ background: 'linear-gradient(160deg, #0d3b66, #030d1a)', borderRight: pick === 'a' ? '2px solid #f5c518' : 'none' }}>
          <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-12 h-12" />
          <span className="text-white text-xs font-bold">{MOCK.teamA}</span>
        </motion.div>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 5 }}>
          <span style={{ fontFamily: "'Russo One', sans-serif", fontSize: 24, color: '#f5c518', textShadow: '0 0 20px rgba(245,197,24,0.6)', clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0 100%)', display: 'inline-block', padding: '0 6px' }}>VS</span>
        </div>
        <motion.div onClick={() => setPick('b')} animate={{ flex: pick === 'b' ? 1.3 : 1 }} transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          className="cursor-pointer flex flex-col items-center justify-center gap-2"
          style={{ background: 'linear-gradient(200deg, #6b4a05, #030d1a)', borderLeft: pick === 'b' ? '2px solid #f5c518' : 'none' }}>
          <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-12 h-12" />
          <span className="text-white text-xs font-bold">{MOCK.teamB}</span>
        </motion.div>
      </div>
    </Shell>
  );
}

/* ── 9. Confetti-Primed Reveal ───────────────────────────────────────────── */
function D9() {
  const [urgent, setUrgent] = useState(false);
  const pieces = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ left: Math.random() * 100, delay: Math.random() * 0.4, dur: 1 + Math.random() * 0.7, color: ['#f5c518', '#4ade80', '#fff', '#fca5a5'][i % 4] })), [urgent]);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <motion.div
        animate={urgent ? { boxShadow: ['0 0 20px rgba(245,197,24,0.3)', '0 0 50px rgba(245,197,24,0.7)', '0 0 20px rgba(245,197,24,0.3)'] } : { boxShadow: '0 0 20px rgba(245,197,24,0.15)' }}
        transition={{ duration: 1, repeat: urgent ? Infinity : 0 }}
        style={{ position: 'relative', overflow: 'hidden', width: 260, borderRadius: 16, background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(245,197,24,0.4)', padding: '18px 16px' }}
      >
        {urgent && pieces.map((p, i) => (
          <motion.span key={i} initial={{ y: -10, opacity: 0 }} animate={{ y: 140, opacity: [0, 1, 0] }} transition={{ duration: p.dur, delay: p.delay, repeat: Infinity }}
            style={{ position: 'absolute', top: 0, left: `${p.left}%`, width: 4, height: 8, background: p.color, borderRadius: 1 }} />
        ))}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <span className="text-amber-400 text-[10px] font-bold tracking-widest">המשחק הבא</span>
          <div className="flex items-center gap-4" dir="ltr">
            <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-11 h-11" />
            <span className="text-slate-400 text-[10px]">VS</span>
            <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-11 h-11" />
          </div>
        </div>
      </motion.div>
      <button onClick={() => setUrgent((u) => !u)} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2">
        {urgent ? 'בטל סימולציה' : 'סימולציה: פחות משעה לתחילה ⏰'}
      </button>
    </Shell>
  );
}

/* ── 10. Swipeable Match Deck ────────────────────────────────────────────── */
function D10() {
  const [i, setI] = useState(0);
  const cards = [
    { ...MOCK, target: TARGET, tag: 'המשחק הבא' },
    { ...MOCK2, target: TARGET2, tag: 'אחריו' },
  ];
  const daysLeft = (target) => Math.max(Math.ceil((new Date(target).getTime() - Date.now()) / 86400000), 0);

  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'relative', width: 240, height: 150 }}>
        {cards.map((c, idx) => {
          const rel = (idx - i + cards.length) % cards.length;
          if (rel > 1) return null;
          return (
            <motion.div
              key={c.tag}
              drag={rel === 0 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
              onDragEnd={(_, info) => { if (info.offset.x < -60) setI((v) => (v + 1) % cards.length); }}
              animate={{ scale: rel === 0 ? 1 : 0.92, y: rel === 0 ? 0 : 12, opacity: rel === 0 ? 1 : 0.5, zIndex: rel === 0 ? 2 : 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              style={{ position: 'absolute', inset: 0, borderRadius: 14, background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(245,197,24,0.35)', cursor: rel === 0 ? 'grab' : 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <span className="text-amber-400 text-[9px] font-bold tracking-widest">{c.tag}</span>
              <div className="flex items-center gap-4" dir="ltr">
                <TeamFlag logo={c.teamACode} name={c.teamA} className="w-10 h-10" />
                <span className="text-slate-400 text-[10px]">VS</span>
                <TeamFlag logo={c.teamBCode} name={c.teamB} className="w-10 h-10" />
              </div>
              <span className="text-slate-400 text-[10px]">בעוד {daysLeft(c.target)} ימים</span>
            </motion.div>
          );
        })}
      </div>
      <span className="text-[10px] text-slate-500">גרור שמאלה לדפדוף בין המשחקים</span>
    </Shell>
  );
}

const DESIGNS = [
  { id: 1, name: 'Broadcast Lower-Third', Comp: D1 },
  { id: 2, name: 'Coin Toss Reveal', Comp: D2 },
  { id: 3, name: 'Stadium Tunnel', Comp: D3 },
  { id: 4, name: 'Scoreboard Drop (LED)', Comp: D4 },
  { id: 5, name: 'Gold Ticket Tear', Comp: D5 },
  { id: 6, name: 'Prediction Wager Bar', Comp: D6 },
  { id: 7, name: 'Live Pulse Ring', Comp: D7 },
  { id: 8, name: 'Head-to-Head Duel', Comp: D8 },
  { id: 9, name: 'Confetti-Primed Reveal', Comp: D9 },
  { id: 10, name: 'Swipeable Match Deck', Comp: D10 },
];

export default function AdminNextMatchDesigns10() {
  const [chosen, setChosen] = useState(null);

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">10 עיצובים — Next Match Intro</h2>
          <p className="text-slate-400 text-sm mt-1">לחץ על הכרטיס שאהבת (חלקן אינטראקטיביות — נסה גם ללחוץ/לגרור בפנים)</p>
        </div>
        {chosen && (
          <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl px-4 py-2 text-sm text-yellow-300">
            בחרת: <strong>#{chosen.id} — {chosen.name}</strong>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {DESIGNS.map(({ id, name, Comp }) => (
          <div
            key={id}
            onClick={() => setChosen({ id, name })}
            className="cursor-pointer rounded-2xl overflow-hidden transition-all duration-200"
            style={{
              background: '#030d1a',
              border: chosen?.id === id ? '2px solid #f5c518' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: chosen?.id === id ? '0 0 20px rgba(245,197,24,0.25)' : 'none',
            }}
          >
            <div className="px-4 pt-3 text-xs text-slate-500">#{id} {name}</div>
            <Comp />
          </div>
        ))}
      </div>
    </div>
  );
}
