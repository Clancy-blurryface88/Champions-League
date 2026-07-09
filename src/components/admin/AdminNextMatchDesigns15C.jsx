import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamFlag from '../TeamFlag';
import { MOCK, TARGET, useCountdown, Shell, DesignGrid } from './_nextMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Round 3: 15 MORE concepts, this time centered on the animation itself
   (the motion is the point, not just a static layout with an entrance fade).
   Temporary comparison tab — pick one, then it gets wired into Layout.jsx
   and all design-batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

const VsRow = ({ size = 'w-10 h-10' }) => (
  <div className="flex items-center gap-4" dir="ltr">
    <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className={size} />
    <span className="text-slate-400 text-[10px]">VS</span>
    <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className={size} />
  </div>
);

/* ── 1. Particle Burst Formation ──────────────────────────────────────────── */
function F1() {
  const [key, setKey] = useState(0);
  const particles = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ a: (i / 14) * Math.PI * 2, r: 70 + Math.random() * 30 })), [key]);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div key={key} style={{ position: 'relative', width: 200, height: 70 }}>
        {particles.map((p, i) => (
          <motion.span key={i}
            initial={{ x: Math.cos(p.a) * p.r, y: Math.sin(p.a) * p.r, opacity: 0.9 }}
            animate={{ x: 0, y: 0, opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', left: '50%', top: '50%', width: 5, height: 5, borderRadius: '50%', background: '#f5c518', boxShadow: '0 0 8px #f5c518' }} />
        ))}
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.4 }} className="absolute inset-0 flex items-center justify-center">
          <VsRow />
        </motion.div>
      </div>
      <button onClick={() => setKey((k) => k + 1)} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2">🔁 שחזר אנימציה</button>
    </Shell>
  );
}

/* ── 2. Liquid Morph Blob ─────────────────────────────────────────────────── */
function F2() {
  return (
    <Shell>
      <motion.div
        animate={{ borderRadius: ['42% 58% 65% 35% / 45% 40% 60% 55%', '65% 35% 42% 58% / 55% 60% 40% 45%', '42% 58% 65% 35% / 45% 40% 60% 55%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 180, height: 180, background: 'linear-gradient(140deg, rgba(245,197,24,0.18), rgba(13,59,102,0.5))', border: '1px solid rgba(245,197,24,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <VsRow />
      </motion.div>
    </Shell>
  );
}

/* ── 3. Kinetic Typography Countdown ──────────────────────────────────────── */
function KineticUnit({ value, label }) {
  return (
    <div style={{ textAlign: 'center', perspective: 300 }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ rotateX: 70, scale: 1.3, opacity: 0, filter: 'blur(4px)' }}
          animate={{ rotateX: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ rotateX: -70, scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          style={{ display: 'inline-block', fontFamily: "'Russo One', sans-serif", fontSize: 30, color: '#f5c518', textShadow: '0 0 18px rgba(245,197,24,0.5)' }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </div>
  );
}
function F3() {
  const t = useCountdown(TARGET);
  return (
    <Shell style={{ flexDirection: 'column', gap: 12 }}>
      <div className="flex items-center gap-3">
        <KineticUnit value={t.hours} label="שעות" />
        <span style={{ color: '#f5c518', fontSize: 22, fontWeight: 900 }}>:</span>
        <KineticUnit value={t.minutes} label="דק" />
        <span style={{ color: '#f5c518', fontSize: 22, fontWeight: 900 }}>:</span>
        <KineticUnit value={t.seconds} label="שנ" />
      </div>
      <VsRow size="w-8 h-8" />
    </Shell>
  );
}

/* ── 4. Zoom Trail Entrance ───────────────────────────────────────────────── */
function F4() {
  const [key, setKey] = useState(0);
  const lines = useMemo(() => Array.from({ length: 10 }, (_, i) => i * 36), [key]);
  return (
    <Shell>
      <div key={key} style={{ position: 'relative', width: 200, height: 100 }}>
        {lines.map((deg, i) => (
          <motion.span key={i} initial={{ scaleX: 0, opacity: 0.8 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, delay: 0.02 * i }}
            style={{ position: 'absolute', left: '50%', top: '50%', width: 60, height: 2, background: 'linear-gradient(90deg, transparent, #f5c518)', transformOrigin: 'left center', transform: `rotate(${deg}deg)` }} />
        ))}
        <motion.div initial={{ scale: 2.4, opacity: 0, filter: 'blur(10px)' }} animate={{ scale: [2.4, 0.9, 1], opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.6, times: [0, 0.7, 1], ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center">
          <VsRow />
        </motion.div>
      </div>
      <button onClick={() => setKey((k) => k + 1)} className="absolute bottom-4 text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2">🔁 שחזר</button>
    </Shell>
  );
}

/* ── 5. Magnetic Snap Frame ───────────────────────────────────────────────── */
function F5() {
  const corners = [
    { from: { x: -90, y: -60 }, to: { top: 6, left: 6 } },
    { from: { x: 90, y: -60 }, to: { top: 6, right: 6 } },
    { from: { x: -90, y: 60 }, to: { bottom: 6, left: 6 } },
    { from: { x: 90, y: 60 }, to: { bottom: 6, right: 6 } },
  ];
  return (
    <Shell>
      <div style={{ position: 'relative', width: 220, height: 130, borderRadius: 14, background: 'rgba(8,18,32,0.7)' }}>
        {corners.map((c, i) => (
          <motion.span key={i} initial={{ x: c.from.x, y: c.from.y, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ delay: 0.1 * i, type: 'spring', stiffness: 260, damping: 14 }}
            style={{ position: 'absolute', ...c.to, width: 18, height: 18, borderTop: c.to.top !== undefined ? '2px solid #f5c518' : 'none', borderBottom: c.to.bottom !== undefined ? '2px solid #f5c518' : 'none', borderLeft: c.to.left !== undefined ? '2px solid #f5c518' : 'none', borderRight: c.to.right !== undefined ? '2px solid #f5c518' : 'none' }} />
        ))}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="absolute inset-0 flex items-center justify-center">
          <VsRow />
        </motion.div>
      </div>
    </Shell>
  );
}

/* ── 6. Ripple Wave Reveal ────────────────────────────────────────────────── */
function F6() {
  const [key, setKey] = useState(0);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <motion.div key={key}
        initial={{ clipPath: 'circle(0% at 50% 50%)' }} animate={{ clipPath: 'circle(75% at 50% 50%)' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: 220, height: 130, borderRadius: 14, background: 'radial-gradient(circle, rgba(245,197,24,0.18), rgba(3,13,26,0.97) 70%)', border: '1px solid rgba(245,197,24,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <VsRow />
      </motion.div>
      <button onClick={() => setKey((k) => k + 1)} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2">🔁 שחזר גל</button>
    </Shell>
  );
}

/* ── 7. Elastic Digit Ticks ───────────────────────────────────────────────── */
function ElasticUnit({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.div key={value} initial={{ scaleY: 0.6, scaleX: 1.3 }} animate={{ scaleY: 1, scaleX: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 10 }}
        style={{ width: 34, height: 30, borderRadius: 6, background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 800, color: '#f5c518' }}>
        {String(value).padStart(2, '0')}
      </motion.div>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{label}</div>
    </div>
  );
}
function F7() {
  const t = useCountdown(TARGET);
  return (
    <Shell style={{ flexDirection: 'column', gap: 14 }}>
      <VsRow />
      <div className="flex gap-2">
        <ElasticUnit value={t.hours} label="שעות" />
        <ElasticUnit value={t.minutes} label="דק" />
        <ElasticUnit value={t.seconds} label="שנ" />
      </div>
    </Shell>
  );
}

/* ── 8. Light Trail Orbit ─────────────────────────────────────────────────── */
function F8() {
  return (
    <Shell>
      <div style={{ position: 'relative', width: 220, height: 150, borderRadius: 16, border: '1px solid rgba(245,197,24,0.25)', background: 'rgba(8,18,32,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="220" height="150" style={{ position: 'absolute', inset: 0 }}>
          <rect x="2" y="2" width="216" height="146" rx="16" fill="none" stroke="rgba(255,255,255,0.05)" />
        </svg>
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.span key={i}
            style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: '#f5c518', boxShadow: '0 0 10px #f5c518', offsetPath: 'path("M 10,10 H 210 V 140 H 10 Z")', opacity: 1 - i * 0.3 }}
            animate={{ offsetDistance: ['0%', '100%'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', delay }}
          />
        ))}
        <VsRow />
      </div>
    </Shell>
  );
}

/* ── 9. Shattering Glass Assemble ─────────────────────────────────────────── */
function F9() {
  const [key, setKey] = useState(0);
  const shards = [
    { clip: 'polygon(0 0, 50% 0, 30% 50%, 0 60%)', from: { x: -60, y: -50, rotate: -40 } },
    { clip: 'polygon(50% 0, 100% 0, 100% 60%, 70% 50%)', from: { x: 60, y: -50, rotate: 35 } },
    { clip: 'polygon(0 60%, 30% 50%, 40% 100%, 0 100%)', from: { x: -60, y: 50, rotate: 30 } },
    { clip: 'polygon(70% 50%, 100% 60%, 100% 100%, 40% 100%)', from: { x: 60, y: 50, rotate: -30 } },
  ];
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div key={key} style={{ position: 'relative', width: 220, height: 130 }}>
        {shards.map((s, i) => (
          <motion.div key={i} initial={{ ...s.from, opacity: 0 }} animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }} transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, clipPath: s.clip, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(245,197,24,0.3)' }} />
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute inset-0 flex items-center justify-center">
          <VsRow />
        </motion.div>
      </div>
      <button onClick={() => setKey((k) => k + 1)} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2">🔁 שחזר</button>
    </Shell>
  );
}

/* ── 10. Breathing Glow Aura ──────────────────────────────────────────────── */
function F10() {
  return (
    <Shell>
      <motion.div
        animate={{ scale: [1, 1.035, 1], boxShadow: ['0 0 18px rgba(245,197,24,0.2)', '0 0 46px rgba(245,197,24,0.55)', '0 0 18px rgba(245,197,24,0.2)'] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 220, padding: '22px 20px', borderRadius: 16, background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(245,197,24,0.4)', display: 'flex', justifyContent: 'center' }}
      >
        <VsRow />
      </motion.div>
    </Shell>
  );
}

/* ── 11. Typewriter Reveal ────────────────────────────────────────────────── */
function useTypewriter(text, active, speed = 45) {
  const [n, setN] = useState(0);
  React.useEffect(() => {
    if (!active) return;
    setN(0);
    const iv = setInterval(() => setN((v) => (v < text.length ? v + 1 : v)), speed);
    return () => clearInterval(iv);
  }, [active, text, speed]);
  return text.slice(0, n);
}
function F11() {
  const [key, setKey] = useState(0);
  const text = 'המשחק הבא מתקרב...';
  const shown = useTypewriter(text, true, 45);
  const done = shown.length === text.length;
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 14 }}>
      <span style={{ fontFamily: "'Russo One', sans-serif", fontSize: 14, color: '#f5c518', minHeight: 20 }}>
        {shown}<span style={{ opacity: done ? 0 : 1 }}>|</span>
      </span>
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <VsRow />
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setKey((k) => k + 1)} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2">🔁 שחזר</button>
    </Shell>
  );
}

/* ── 12. Marquee Ticker Wrap ──────────────────────────────────────────────── */
function F12() {
  const line = '⚽ ברזיל נגד ארגנטינה  •  05/07 20:00  •  היכונו  •  ';
  return (
    <Shell style={{ padding: 0 }}>
      <div style={{ width: '92%', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(245,197,24,0.3)', background: 'rgba(8,18,32,0.95)' }}>
        <div style={{ overflow: 'hidden', borderBottom: '1px solid rgba(245,197,24,0.2)', background: 'rgba(245,197,24,0.08)' }}>
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
            <span style={{ color: '#f5c518', fontSize: 10, padding: '4px 0' }}>{line.repeat(4)}</span>
          </motion.div>
        </div>
        <div className="py-6 flex justify-center"><VsRow /></div>
      </div>
    </Shell>
  );
}

/* ── 13. Depth Parallax Layers ────────────────────────────────────────────── */
function F13() {
  const [t, setT] = useState({ x: 0, y: 0 });
  const dots = useMemo(() => Array.from({ length: 12 }, () => ({ left: Math.random() * 100, top: Math.random() * 100 })), []);
  return (
    <Shell>
      <div
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setT({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 }); }}
        onMouseLeave={() => setT({ x: 0, y: 0 })}
        style={{ position: 'relative', width: 220, height: 150, borderRadius: 14, overflow: 'hidden', background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(245,197,24,0.25)' }}
      >
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${t.x * 6}px, ${t.y * 6}px)` }}>
          {dots.map((d, i) => <span key={i} style={{ position: 'absolute', left: `${d.left}%`, top: `${d.top}%`, width: 2, height: 2, borderRadius: '50%', background: 'rgba(245,197,24,0.5)' }} />)}
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translate(${t.x * 16}px, ${t.y * 16}px)` }}>
          <VsRow />
        </div>
        <div style={{ position: 'absolute', inset: 6, border: '1px solid rgba(245,197,24,0.4)', borderRadius: 10, pointerEvents: 'none', transform: `translate(${t.x * -10}px, ${t.y * -10}px)` }} />
      </div>
    </Shell>
  );
}

/* ── 14. Morphing Ring ↔ Bar ──────────────────────────────────────────────── */
function F14() {
  const [ring, setRing] = useState(true);
  return (
    <Shell style={{ flexDirection: 'column', gap: 14 }}>
      <VsRow />
      <motion.div
        onClick={() => setRing((r) => !r)}
        animate={ring ? { width: 64, height: 64, borderRadius: 32 } : { width: 160, height: 10, borderRadius: 6 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        style={{ cursor: 'pointer', background: 'conic-gradient(#f5c518 62%, rgba(255,255,255,0.1) 0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      />
      <span className="text-[10px] text-slate-500">לחץ למעבר טבעת ↔ פס</span>
    </Shell>
  );
}

/* ── 15. Explosive Reveal ─────────────────────────────────────────────────── */
function F15() {
  const [key, setKey] = useState(0);
  const rays = useMemo(() => Array.from({ length: 12 }, (_, i) => i * 30), [key]);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div key={key} style={{ position: 'relative', width: 220, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 5, borderRadius: 14 }} />
        {rays.map((deg, i) => (
          <motion.span key={i} initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            style={{ position: 'absolute', width: 70, height: 2, background: '#f5c518', transformOrigin: 'left center', transform: `rotate(${deg}deg)` }} />
        ))}
        <motion.div initial={{ x: 0 }} animate={{ x: [0, -4, 4, -3, 3, 0] }} transition={{ duration: 0.4, delay: 0.35 }}>
          <VsRow />
        </motion.div>
      </div>
      <button onClick={() => setKey((k) => k + 1)} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2">🎬 הפעל שוב</button>
    </Shell>
  );
}

const DESIGNS = [
  { id: 1, name: 'Particle Burst Formation', Comp: F1 },
  { id: 2, name: 'Liquid Morph Blob', Comp: F2 },
  { id: 3, name: 'Kinetic Typography Countdown', Comp: F3 },
  { id: 4, name: 'Zoom Trail Entrance', Comp: F4 },
  { id: 5, name: 'Magnetic Snap Frame', Comp: F5 },
  { id: 6, name: 'Ripple Wave Reveal', Comp: F6 },
  { id: 7, name: 'Elastic Digit Ticks', Comp: F7 },
  { id: 8, name: 'Light Trail Orbit', Comp: F8 },
  { id: 9, name: 'Shattering Glass Assemble', Comp: F9 },
  { id: 10, name: 'Breathing Glow Aura', Comp: F10 },
  { id: 11, name: 'Typewriter Reveal', Comp: F11 },
  { id: 12, name: 'Marquee Ticker Wrap', Comp: F12 },
  { id: 13, name: 'Depth Parallax Layers', Comp: F13 },
  { id: 14, name: 'Morphing Ring ↔ Bar', Comp: F14 },
  { id: 15, name: 'Explosive Reveal', Comp: F15 },
];

export default function AdminNextMatchDesigns15C() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="15 עיצובים נוספים — בדגש אנימציה (סבב 3)"
      subtitle="כאן האנימציה היא הכוכבת — חלק יש כפתור 'שחזר' כדי לראות שוב"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
