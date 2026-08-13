import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Demo-only: rethinking the date selector for what it actually is — 2-3 dates
// per round, not 9. Ditches the "tab" paradigm (built to save space with many
// items) for wide, content-rich panels that use the space instead of hiding
// from it. 4 genuinely interactive directions. Doesn't touch Predictions.jsx.

const BLUE = '9,122,220';
const GREEN = '74,222,128';
const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4', '#f97316'];
function colorFor(code) {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}
function TeamDot({ code, size = 18 }) {
  return (
    <div className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ width: size, height: size, fontSize: size * 0.4, background: colorFor(code) }}>
      {code[0]}
    </div>
  );
}

const ROUND_DATES = [
  { key: 'd1', dow: 'שלישי', day: 8, month: 'ספטמבר', matches: [
    { a: 'ARS', b: 'LIL', time: '19:00', done: true, sa: 2, sb: 1 },
    { a: 'ROM', b: 'AVL', time: '19:00', done: true, sa: 0, sb: 0 },
    { a: 'BAY', b: 'BRU', time: '22:00', done: false },
  ] },
  { key: 'd2', dow: 'רביעי', day: 9, month: 'ספטמבר', matches: [
    { a: 'INT', b: 'BOD', time: '19:00', done: false },
    { a: 'GAL', b: 'FEY', time: '22:00', done: false },
    { a: 'BAR', b: 'NAP', time: '22:00', done: false },
  ] },
  { key: 'd3', dow: 'חמישי', day: 10, month: 'ספטמבר', matches: [
    { a: 'POR', b: 'LIV', time: '19:00', done: false },
    { a: 'RMA', b: 'LEN', time: '22:00', done: false },
  ] },
];

function MatchRow({ m }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <TeamDot code={m.a} size={16} />
      <span className="text-slate-300 text-[10px] flex-1 truncate">{m.a} - {m.b}</span>
      {m.done ? (
        <span className="text-emerald-400 text-[10px] font-bold flex-shrink-0">{m.sa}-{m.sb}</span>
      ) : (
        <span className="text-slate-500 text-[10px] flex-shrink-0" dir="ltr">{m.time}</span>
      )}
      <TeamDot code={m.b} size={16} />
    </div>
  );
}

function Frame({ label, desc, children }) {
  return (
    <div className="bg-slate-800/40 border border-white/8 rounded-2xl p-4 flex flex-col gap-3">
      <div className="rounded-xl overflow-hidden p-3" style={{ background: '#050a12', minHeight: 190 }}>{children}</div>
      <div><div className="text-white text-xs font-bold">{label}</div><div className="text-slate-500 text-[10px]">{desc}</div></div>
    </div>
  );
}

// ── 1. Side-by-side rich panels — all 3 shown at once, no switching ────────
function V1() {
  const [sel, setSel] = useState(0);
  return (
    <div className="grid grid-cols-3 gap-2">
      {ROUND_DATES.map((d, i) => {
        const finished = d.matches.filter((m) => m.done).length;
        const active = sel === i;
        return (
          <button key={d.key} onClick={() => setSel(i)} className="rounded-xl p-2.5 flex flex-col gap-1.5 text-right"
            style={{ background: active ? `rgba(${BLUE},0.14)` : 'rgba(255,255,255,0.04)', border: active ? `1px solid rgba(${BLUE},0.5)` : '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-black">{d.day}</span>
              <span className="text-slate-400 text-[9px]">{d.dow}</span>
            </div>
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            {d.matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
            <span className="text-[9px] text-slate-500 mt-0.5">{finished}/{d.matches.length} הסתיימו</span>
          </button>
        );
      })}
    </div>
  );
}

// ── 2. Expand-on-tap — tapped panel grows and eats the space, others shrink ─
function V2() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex gap-1.5" style={{ height: 175 }}>
      {ROUND_DATES.map((d, i) => {
        const active = sel === i;
        return (
          <motion.button
            key={d.key}
            onClick={() => setSel(i)}
            animate={{ flex: active ? 5 : 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="rounded-xl overflow-hidden flex flex-col items-center py-2.5 px-1.5"
            style={{ background: active ? `rgba(${BLUE},0.16)` : 'rgba(255,255,255,0.05)', border: active ? `1px solid rgba(${BLUE},0.5)` : '1px solid rgba(255,255,255,0.08)' }}
          >
            {active ? (
              <div className="flex flex-col gap-1.5 w-full px-1">
                <div className="text-center mb-1"><span className="text-white text-sm font-black">{d.dow}, {d.day} {d.month}</span></div>
                {d.matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 h-full justify-center">
                <span className="text-white text-base font-black">{d.day}</span>
                <span className="text-slate-400 text-[9px]" style={{ writingMode: 'vertical-rl' }}>{d.dow}</span>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── 3. Drag carousel with side peeks — one focused, neighbors peek in ──────
function V3() {
  const [sel, setSel] = useState(0);
  const onDragEnd = (_, info) => {
    if (info.offset.x < -50 && sel < ROUND_DATES.length - 1) setSel(sel + 1);
    else if (info.offset.x > 50 && sel > 0) setSel(sel - 1);
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-full overflow-hidden" style={{ height: 150 }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={sel}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, x: 40, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 rounded-xl p-3 flex flex-col gap-1.5 cursor-grab active:cursor-grabbing"
            style={{ background: `rgba(${BLUE},0.14)`, border: `1px solid rgba(${BLUE},0.4)` }}
          >
            <span className="text-white text-sm font-black text-center">{ROUND_DATES[sel].dow}, {ROUND_DATES[sel].day} {ROUND_DATES[sel].month}</span>
            {ROUND_DATES[sel].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5">
        {ROUND_DATES.map((_, i) => (
          <button key={i} onClick={() => setSel(i)} className="rounded-full transition-all" style={{ width: sel === i ? 16 : 6, height: 6, background: sel === i ? `rgba(${BLUE},1)` : 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>
      <span className="text-[9px] text-slate-500">← גרור לתאריך הבא/הקודם →</span>
    </div>
  );
}

// ── 4. Connected journey stepper — full-content nodes on a progress line ───
function V4() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        {ROUND_DATES.map((d, i) => {
          const finished = d.matches.filter((m) => m.done).length;
          const complete = finished === d.matches.length;
          return (
            <React.Fragment key={d.key}>
              {i > 0 && <div className="flex-1 h-0.5" style={{ background: complete || sel > i - 1 ? `rgba(${GREEN},0.6)` : 'rgba(255,255,255,0.1)' }} />}
              <motion.button
                onClick={() => setSel(i)}
                whileTap={{ scale: 0.92 }}
                className="flex-shrink-0 rounded-full flex flex-col items-center justify-center relative"
                style={{
                  width: sel === i ? 50 : 38, height: sel === i ? 50 : 38,
                  background: sel === i ? `rgba(${BLUE},1)` : complete ? `rgba(${GREEN},0.25)` : 'rgba(255,255,255,0.08)',
                  border: sel === i ? '2px solid white' : complete ? `1px solid rgba(${GREEN},0.6)` : '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <span className="text-white text-sm font-black">{d.day}</span>
                {complete && sel !== i && <span className="absolute -top-1 -right-1 text-[10px]">✓</span>}
              </motion.button>
            </React.Fragment>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {ROUND_DATES[sel].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const VARIANTS = [
  ['1. פאנלים רחבים זה לצד זה', 'כל 3 התאריכים גלויים במקביל, כל אחד עם תצוגה מקדימה מלאה — אין "בחירה", רק לחיצה להדגשה', V1],
  ['2. התרחבות בלחיצה (Accordion אופקי)', 'לוחצים על תאריך והוא "אוכל" את הרוחב מהשכנים ומגלה את כל המשחקים בפנים', V2],
  ['3. קרוסלה נגררת עם הצצה', 'גוררים אצבע ימינה/שמאלה בין תאריכים, כל אחד כרטיס עשיר מלא', V3],
  ['4. ציר מסע מחובר', 'תאריכים כתחנות גדולות על קו התקדמות, לחיצה מציגה את כל משחקי היום למטה', V4],
];

export default function AdminRichDatePanelsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — פאנלים עשירים ל-2-3 תאריכים</h2>
        <p className="text-slate-500 text-sm">
          מחזור טיפוסי = 2-3 תאריכים בלבד, אז יש מקום להראות תוכן אמיתי (משחקים, תוצאות) במקום ספרה יבשה בטאב קטן.
          כולן חיות ולחיצות. כלי דמו בלבד — לא משפיע על Predictions.jsx.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {VARIANTS.map(([label, desc, Comp]) => (
          <Frame key={label} label={label} desc={desc}><Comp /></Frame>
        ))}
      </div>
    </div>
  );
}
