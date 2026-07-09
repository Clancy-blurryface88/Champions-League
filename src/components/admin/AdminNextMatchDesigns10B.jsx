import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamFlag from '../TeamFlag';
import { MOCK, TARGET, useCountdown, FlipUnit, Shell, DesignGrid } from './_nextMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Round 2: 10 MORE alternative concepts for the "Next Match Intro" overlay,
   distinct from the first batch (AdminNextMatchDesigns10.jsx).
   Temporary comparison tab — pick one, then it gets wired into Layout.jsx
   and both design-batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

/* ── 1. Holographic Foil Card ────────────────────────────────────────────── */
function E1() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  return (
    <Shell>
      <div
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
        style={{
          position: 'relative', width: 260, borderRadius: 16, padding: '20px 24px', overflow: 'hidden',
          background: '#0a1220',
          border: '1px solid transparent',
          backgroundImage: `linear-gradient(#0a1220,#0a1220), conic-gradient(from ${pos.x * 3.6}deg, #f5c518, #fff7cc, #38bdf8, #f5c518)`,
          backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.18), transparent 55%)`, pointerEvents: 'none' }} />
        <div className="flex flex-col items-center gap-2 relative z-10">
          <span className="text-amber-300 text-[10px] tracking-widest font-bold">✦ המשחק הבא ✦</span>
          <div className="flex items-center gap-4" dir="ltr">
            <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-12 h-12" />
            <span className="text-slate-400 text-[10px]">VS</span>
            <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-12 h-12" />
          </div>
          <span className="text-[9px] text-slate-500">הזז עכבר על הכרטיס</span>
        </div>
      </div>
    </Shell>
  );
}

/* ── 2. Jersey Reveal ─────────────────────────────────────────────────────── */
function E2() {
  const [spin, setSpin] = useState(0);
  const Jersey = ({ code, name, hue }) => (
    <motion.div
      key={spin}
      onClick={() => setSpin((s) => s + 1)}
      initial={{ rotate: -6 }}
      animate={{ rotate: [-6, 6, -4, 4, 0] }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      whileHover={{ rotate: 10 }}
      style={{ transformOrigin: 'top center', cursor: 'pointer', width: 70, height: 84, borderRadius: '10px 10px 26px 26px', background: `linear-gradient(180deg, ${hue}, rgba(3,13,26,0.9))`, border: '1px solid rgba(245,197,24,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, position: 'relative' }}
    >
      <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 26, height: 12, borderRadius: '0 0 10px 10px', background: 'rgba(3,13,26,0.9)' }} />
      <TeamFlag logo={code} name={name} className="w-7 h-7" />
      <span className="text-white text-[9px] font-bold">{name}</span>
    </motion.div>
  );
  return (
    <Shell>
      <div className="flex items-end gap-8">
        <Jersey code={MOCK.teamACode} name={MOCK.teamA} hue="#0d3b66" />
        <span style={{ color: '#f5c518', fontWeight: 900, fontSize: 12, marginBottom: 28 }}>VS</span>
        <Jersey code={MOCK.teamBCode} name={MOCK.teamB} hue="#6b4a05" />
      </div>
    </Shell>
  );
}

/* ── 3. Radar Sweep HUD ───────────────────────────────────────────────────── */
function E3() {
  const t = useCountdown(TARGET);
  const blips = useMemo(() => Array.from({ length: 5 }, () => ({ a: Math.random() * 360, r: 30 + Math.random() * 55, d: Math.random() * 4 })), []);
  return (
    <Shell>
      <div style={{ position: 'relative', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.06), rgba(3,13,26,0.95) 75%)', border: '1px solid rgba(74,222,128,0.3)', overflow: 'hidden' }}>
        {[1, 2, 3].map((i) => <div key={i} style={{ position: 'absolute', inset: 90 - i * 30, borderRadius: '50%', border: '1px solid rgba(74,222,128,0.15)' }} />)}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 0deg, rgba(74,222,128,0.35), transparent 70deg)' }} />
        {blips.map((b, i) => (
          <motion.span key={i} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity, delay: b.d }}
            style={{ position: 'absolute', left: `calc(50% + ${Math.cos(b.a) * b.r}px)`, top: `calc(50% + ${Math.sin(b.a) * b.r}px)`, width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-2" dir="ltr">
            <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-7 h-7" />
            <span style={{ color: '#4ade80', fontSize: 8 }}>VS</span>
            <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-7 h-7" />
          </div>
          <span style={{ fontFamily: 'monospace', color: '#4ade80', fontSize: 11, textShadow: '0 0 6px #4ade80' }}>{t.days}ד {t.hours}:{String(t.minutes).padStart(2, '0')}</span>
        </div>
      </div>
    </Shell>
  );
}

/* ── 4. Trailer Poster ────────────────────────────────────────────────────── */
function E4() {
  return (
    <Shell style={{ padding: 0 }}>
      <div style={{ position: 'relative', width: '92%', height: 200, borderRadius: 14, overflow: 'hidden', background: '#03060d' }}>
        <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 0.5, scaleY: 1 }} transition={{ duration: 1 }} style={{ position: 'absolute', left: '20%', top: 0, width: 90, height: '100%', background: 'linear-gradient(180deg, rgba(245,197,24,0.35), transparent)', transform: 'skewX(-12deg)', transformOrigin: 'top' }} />
        <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 0.4, scaleY: 1 }} transition={{ duration: 1, delay: 0.15 }} style={{ position: 'absolute', right: '20%', top: 0, width: 90, height: '100%', background: 'linear-gradient(180deg, rgba(56,189,248,0.3), transparent)', transform: 'skewX(12deg)', transformOrigin: 'top' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-8" dir="ltr">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}><TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-14 h-14" /></motion.div>
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}><TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-14 h-14" /></motion.div>
          </div>
          <motion.span initial={{ opacity: 0, letterSpacing: '0.4em' }} animate={{ opacity: 1, letterSpacing: '0.15em' }} transition={{ delay: 0.6, duration: 0.8 }}
            style={{ fontFamily: "'Russo One', sans-serif", fontSize: 16, color: '#f5c518', textShadow: '0 0 20px rgba(245,197,24,0.5)' }}>
            הקרב הגדול מתקרב
          </motion.span>
        </div>
      </div>
    </Shell>
  );
}

/* ── 5. Vinyl Spin Disc ───────────────────────────────────────────────────── */
function E5() {
  const [fast, setFast] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <motion.div
        onClick={() => { setFast(true); setTimeout(() => setFast(false), 1500); }}
        animate={{ rotate: 360 }}
        transition={{ duration: fast ? 0.6 : 8, repeat: Infinity, ease: 'linear' }}
        style={{ cursor: 'pointer', width: 130, height: 130, borderRadius: '50%', background: 'repeating-radial-gradient(circle, #0a0f16 0 4px, #131b26 4px 8px)', border: '3px solid rgba(245,197,24,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
      >
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#030d1a', border: '2px solid #f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-6 h-6" rounded="full" />
        </div>
        <div style={{ position: 'absolute', top: -8, right: 10, width: 3, height: 40, background: '#94a3b8', transform: 'rotate(35deg)', transformOrigin: 'top' }} />
      </motion.div>
      <span className="text-[10px] text-slate-500">לחץ להאיץ (סקראצ') 💿</span>
    </Shell>
  );
}

/* ── 6. Match Pass Flip Card ──────────────────────────────────────────────── */
function E6() {
  const [flipped, setFlipped] = useState(false);
  const t = useCountdown(TARGET);
  return (
    <Shell style={{ perspective: 900 }}>
      <motion.div onClick={() => setFlipped((f) => !f)} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6 }}
        style={{ width: 220, height: 130, position: 'relative', transformStyle: 'preserve-3d', cursor: 'pointer' }}>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 12, background: 'linear-gradient(135deg, #0d1f36, #030d1a)', border: '1px solid rgba(245,197,24,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span className="text-[8px] text-amber-400 tracking-widest">MATCH PASS</span>
          <div className="flex items-center gap-4" dir="ltr">
            <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-9 h-9" />
            <span className="text-slate-400 text-[9px]">VS</span>
            <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-9 h-9" />
          </div>
          <span className="text-[9px] text-slate-500">הקש להפוך ↺</span>
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 12, background: '#0a0f16', border: '1px solid rgba(245,197,24,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div className="flex gap-1.5">
            <FlipUnit value={t.days} label="ימים" accent="#f5c518" />
            <FlipUnit value={t.hours} label="שעות" accent="#f5c518" />
            <FlipUnit value={t.minutes} label="דק" accent="#f5c518" />
          </div>
          <div style={{ width: '70%', height: 14, backgroundImage: 'repeating-linear-gradient(90deg, #fff 0 2px, transparent 2px 5px)' }} />
        </div>
      </motion.div>
    </Shell>
  );
}

/* ── 7. Sound Wave Pulse ──────────────────────────────────────────────────── */
function E7() {
  const bars = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ h: 8 + Math.random() * 26, d: i * 0.06 })), []);
  return (
    <Shell style={{ flexDirection: 'column', gap: 14 }}>
      <div className="flex items-center gap-4" dir="ltr">
        <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-11 h-11" />
        <span style={{ color: '#f5c518', fontSize: 10 }}>VS</span>
        <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-11 h-11" />
      </div>
      <div className="flex items-end gap-1" style={{ height: 34 }}>
        {bars.map((b, i) => (
          <motion.span key={i} animate={{ height: [b.h * 0.4, b.h, b.h * 0.5, b.h * 0.9, b.h * 0.4] }} transition={{ duration: 1.1, repeat: Infinity, delay: b.d, ease: 'easeInOut' }}
            style={{ width: 3, borderRadius: 2, background: 'linear-gradient(180deg, #f5c518, #b8860b)' }} />
        ))}
      </div>
      <span className="text-[9px] text-slate-500">האצטדיון סוער — היכונו</span>
    </Shell>
  );
}

/* ── 8. Race-to-Kickoff Track ─────────────────────────────────────────────── */
function E8() {
  const pct = 42;
  return (
    <Shell style={{ flexDirection: 'column', gap: 14 }}>
      <div className="flex items-center gap-4" dir="ltr">
        <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-10 h-10" />
        <span style={{ color: '#f5c518', fontSize: 10 }}>VS</span>
        <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-10 h-10" />
      </div>
      <div style={{ position: 'relative', width: 240 }}>
        <div className="flex justify-between text-[9px] text-slate-500 mb-1">
          <span>היום</span><span>🏆 פתיחה</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.3, ease: 'easeOut' }} style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #b8860b, #f5c518)' }} />
          <motion.div initial={{ left: 0 }} animate={{ left: `${pct}%` }} transition={{ duration: 1.3, ease: 'easeOut' }}
            style={{ position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: '50%', background: '#fff', border: '3px solid #f5c518', boxShadow: '0 0 10px rgba(245,197,24,0.6)' }} />
        </div>
      </div>
    </Shell>
  );
}

/* ── 9. Puzzle Assemble ───────────────────────────────────────────────────── */
function E9() {
  const [key, setKey] = useState(0);
  const pieces = [
    { from: { x: -140, y: -80, rotate: -30 } }, { from: { x: 140, y: -80, rotate: 30 } },
    { from: { x: -140, y: 80, rotate: 25 } }, { from: { x: 140, y: 80, rotate: -25 } },
  ];
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }} className="">
      <div key={key} style={{ position: 'relative', width: 200, height: 110 }}>
        {pieces.map((p, i) => (
          <motion.div key={i} initial={{ ...p.from, opacity: 0 }} animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }} transition={{ delay: i * 0.12, type: 'spring', stiffness: 140, damping: 16 }}
            style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(245,197,24,0.3)' }} />
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="absolute inset-0 flex items-center justify-center gap-4" dir="ltr">
          <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-10 h-10" />
          <span className="text-slate-400 text-[10px]">VS</span>
          <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-10 h-10" />
        </motion.div>
      </div>
      <button onClick={() => setKey((k) => k + 1)} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2">🔁 הרכב שוב</button>
    </Shell>
  );
}

/* ── 10. Newspaper Page-Turn ──────────────────────────────────────────────── */
function E10() {
  const [turned, setTurned] = useState(false);
  return (
    <Shell style={{ perspective: 900 }}>
      <div style={{ position: 'relative', width: 240, height: 140, background: '#f4ecd8', borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
        <div className="p-3 flex flex-col gap-1.5" style={{ color: '#1a1a1a' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 15, borderBottom: '2px solid #1a1a1a', paddingBottom: 2 }}>המשחק הבא</span>
          <div className="flex items-center gap-3 mt-1" dir="ltr">
            <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-8 h-8" />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 10 }}>נגד</span>
            <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-8 h-8" />
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 9, color: '#555' }}>כתבה מלאה בפנים...</span>
        </div>
        <motion.div
          onClick={() => setTurned((t) => !t)}
          animate={{ rotateY: turned ? -160 : 0 }} transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', transformOrigin: 'right center', cursor: 'pointer', background: 'linear-gradient(120deg, #030d1a, #0d3b66)', borderLeft: '1px solid rgba(245,197,24,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ color: '#f5c518', fontFamily: "'Russo One', sans-serif", fontSize: 12, writingMode: 'vertical-rl' }}>הפוך עמוד ›</span>
        </motion.div>
      </div>
    </Shell>
  );
}

const DESIGNS = [
  { id: 1, name: 'Holographic Foil Card', Comp: E1 },
  { id: 2, name: 'Jersey Reveal', Comp: E2 },
  { id: 3, name: 'Radar Sweep HUD', Comp: E3 },
  { id: 4, name: 'Trailer Poster', Comp: E4 },
  { id: 5, name: 'Vinyl Spin Disc', Comp: E5 },
  { id: 6, name: 'Match Pass Flip Card', Comp: E6 },
  { id: 7, name: 'Sound Wave Pulse', Comp: E7 },
  { id: 8, name: 'Race-to-Kickoff Track', Comp: E8 },
  { id: 9, name: 'Puzzle Assemble', Comp: E9 },
  { id: 10, name: 'Newspaper Page-Turn', Comp: E10 },
];

export default function AdminNextMatchDesigns10B() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="עוד 10 עיצובים — Next Match Intro (סבב 2)"
      subtitle="לחץ על הכרטיס שאהבת (חלקן אינטראקטיביות — נסה גם ללחוץ/לגרור/להזיז עכבר בפנים)"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
