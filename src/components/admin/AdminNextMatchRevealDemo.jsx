import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

// Demo-only: 5 ways to show the REST of the evening's matches right after
// the "המשחק הקרוב" card, instead of cycling through them one at a time.
// Mock data, self-contained, autoplays + replayable. Doesn't touch Layout.jsx.

const BLUE = '9,122,220';
const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4', '#f97316'];
function colorFor(code) {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}
function Badge({ code, size = 26 }) {
  return (
    <div className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36, background: colorFor(code) }}>
      {code}
    </div>
  );
}

const SOLO = { a: 'ARS', b: 'BAY', time: '22:00' };
const REST = [
  { a: 'RMA', b: 'INT', time: '19:00' },
  { a: 'PSG', b: 'LIV', time: '22:00' },
  { a: 'BAR', b: 'MCI', time: '22:00' },
  { a: 'POR', b: 'CEL', time: '19:00' },
  { a: 'FEY', b: 'NAP', time: '22:00' },
];

function SoloCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.4, filter: 'blur(6px)' }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3"
    >
      <span className="text-sky-400 text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full"
        style={{ background: `rgba(${BLUE},0.12)`, border: `1px solid rgba(${BLUE},0.35)` }}>
        המשחק הקרוב
      </span>
      <div className="flex items-center gap-4" dir="ltr">
        <div className="flex flex-col items-center gap-1"><Badge code={SOLO.a} size={40} /><span className="text-slate-400 text-[10px]">{SOLO.a}</span></div>
        <span className="text-slate-500 text-xs font-bold">VS</span>
        <div className="flex flex-col items-center gap-1"><Badge code={SOLO.b} size={40} /><span className="text-slate-400 text-[10px]">{SOLO.b}</span></div>
      </div>
      <span className="text-white text-lg font-black" dir="ltr">{SOLO.time}</span>
    </motion.div>
  );
}

function MiniCard({ m, style, extraProps }) {
  return (
    <motion.div
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', ...style }}
      className="rounded-xl px-2.5 py-2 flex items-center gap-1.5"
      {...extraProps}
    >
      <Badge code={m.a} size={20} />
      <span className="text-slate-500 text-[9px] flex-shrink-0">{m.time}</span>
      <Badge code={m.b} size={20} />
    </motion.div>
  );
}

function useIntroPhase(replayKey) {
  const [phase, setPhase] = useState('solo');
  useEffect(() => {
    setPhase('solo');
    const t = setTimeout(() => setPhase('revealed'), 1300);
    return () => clearTimeout(t);
  }, [replayKey]);
  return phase;
}

function Frame({ label, desc, children }) {
  const [replayKey, setReplayKey] = useState(0);
  const phase = useIntroPhase(replayKey);
  return (
    <div className="bg-slate-800/40 border border-white/8 rounded-2xl p-4 flex flex-col gap-3">
      <div className="relative rounded-xl overflow-hidden" style={{ minHeight: 260, background: 'radial-gradient(ellipse at 50% 30%, rgba(9,122,220,0.10), #050a12 70%)' }}>
        <AnimatePresence>{phase === 'solo' && <SoloCard key="solo" />}</AnimatePresence>
        {phase === 'revealed' && children}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-white text-xs font-bold">{label}</div>
          <div className="text-slate-500 text-[10px]">{desc}</div>
        </div>
        <button onClick={() => setReplayKey(k => k + 1)}
          className="flex-shrink-0 flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-full bg-white/6 border border-white/10 text-slate-300 hover:bg-white/12">
          <RefreshCw className="w-3 h-3" /> הצג שוב
        </button>
      </div>
    </div>
  );
}

// ── 1. Grid — staggered fade+scale into a 3-column grid ─────────────────────
function VariantGrid() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="grid grid-cols-3 gap-2">
        {REST.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 20 }}>
            <MiniCard m={m} style={{ minWidth: 92 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 2. Horizontal filmstrip — slides in as one continuous row ──────────────
function VariantFilmstrip() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 overflow-hidden">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="flex gap-2 overflow-x-auto w-full px-4" style={{ scrollbarWidth: 'none' }}>
        {REST.map((m, i) => (
          <motion.div key={i} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.07, duration: 0.35 }}>
            <MiniCard m={m} style={{ minWidth: 92 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 3. Split-flap scoreboard — rows flip into place top to bottom ──────────
function VariantSplitFlap() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="flex flex-col gap-1.5 w-full max-w-[220px]">
        {REST.map((m, i) => (
          <motion.div key={i} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }}
            transition={{ delay: i * 0.12, duration: 0.3 }} style={{ perspective: 200, transformOrigin: 'top' }}>
            <MiniCard m={m} style={{ width: '100%', justifyContent: 'space-between' }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 4. Cascading stack — cards drop in from the top with spring physics ────
function VariantCascade() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="flex flex-col gap-1.5 w-full max-w-[220px]">
        {REST.map((m, i) => (
          <motion.div key={i}
            initial={{ y: -50, opacity: 0, rotate: i % 2 === 0 ? -6 : 6 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: i * 0.09, type: 'spring', stiffness: 260, damping: 16 }}>
            <MiniCard m={m} style={{ width: '100%', justifyContent: 'space-between' }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 5. Radial burst — cards fly outward from center into a grid ────────────
function VariantBurst() {
  const positions = [
    { x: -70, y: -50 }, { x: 70, y: -50 }, { x: -70, y: 20 }, { x: 70, y: 20 }, { x: 0, y: 70 },
  ];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="relative" style={{ width: 220, height: 160 }}>
        {REST.map((m, i) => (
          <motion.div key={i}
            className="absolute"
            style={{ left: '50%', top: '50%' }}
            initial={{ x: -46, y: -18, scale: 0, opacity: 0, rotate: 0 }}
            animate={{ x: positions[i].x - 46, y: positions[i].y - 18, scale: 1, opacity: 1, rotate: (i % 2 === 0 ? -1 : 1) * 4 }}
            transition={{ delay: 0.05 + i * 0.06, type: 'spring', stiffness: 220, damping: 18 }}>
            <MiniCard m={m} style={{ minWidth: 92 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const VARIANTS = [
  ['1. גריד מדורג', 'כניסה בפייד+scale מדורגת, 3 עמודות — הצעה מקורית', VariantGrid],
  ['2. פילם-סטריפ אופקי', 'שורה אחת נגללת, כל כרטיס נכנס מהצד', VariantFilmstrip],
  ['3. לוח פיצול (Split-Flap)', 'רשימה אנכית, כל שורה "מתהפכת" פנימה מלמעלה למטה', VariantSplitFlap],
  ['4. מפל קלפים', 'כרטיסים נופלים מלמעלה עם פיזיקת קפיץ ונטייה קלה', VariantCascade],
  ['5. פיצוץ רדיאלי', 'כרטיסים "מתפוצצים" החוצה ממרכז המסך אל מקומם', VariantBurst],
];

export default function AdminNextMatchRevealDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — חשיפת שאר משחקי הערב</h2>
        <p className="text-slate-500 text-sm">
          "המשחק הקרוב" מוצג כרגיל, ואז מעבר אחד לתצוגה הקבועה של כל שאר משחקי אותו ערב — במקום מעגול איטי אחד-אחד.
          כל כרטיס מתנגן אוטומטית ואפשר להריץ שוב. דמו בלבד — לא משפיע על Layout.jsx.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {VARIANTS.map(([label, desc, Comp]) => (
          <Frame key={label} label={label} desc={desc}>
            <Comp />
          </Frame>
        ))}
      </div>
    </div>
  );
}
