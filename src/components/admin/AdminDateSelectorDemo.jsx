import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Demo-only: 4 interactive redesigns of the date selector (MatchesByDateSheet.jsx).
// All data below is mock/fixed so the demo is self-contained — no API calls,
// nothing here touches the real predictions flow.

const BLUE = '9,122,220';
const GREEN = '74,222,128';

const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4', '#f97316'];
function colorFor(code) {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}
function TeamBadge({ code, size = 28 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36, background: colorFor(code) }}
    >
      {code}
    </div>
  );
}

// ─── Mock schedule (first 3 real matchdays, enough dates to demo scroll/swipe) ──
const ROUNDS = [
  {
    name: 'League Phase - 1',
    days: [
      { date: '2026-09-08', matches: [
        { a: 'ARS', b: 'LIL', time: '19:00' },
        { a: 'ROM', b: 'AVL', time: '19:00' },
      ] },
      { date: '2026-09-09', matches: [
        { a: 'BAY', b: 'BRU', time: '19:00' },
        { a: 'INT', b: 'BOD', time: '19:00' },
        { a: 'GAL', b: 'FEY', time: '19:00' },
      ] },
      { date: '2026-09-10', matches: [
        { a: 'BAR', b: 'NAP', time: '19:00', finished: true, sa: 2, sb: 1 },
        { a: 'POR', b: 'LIV', time: '19:00', finished: true, sa: 0, sb: 0 },
        { a: 'RMA', b: 'LEN', time: '19:00' },
      ] },
    ],
  },
  {
    name: 'League Phase - 2',
    days: [
      { date: '2026-10-13', matches: [
        { a: 'AVL', b: 'LYO', time: '19:00' },
        { a: 'CEL', b: 'PSG', time: '19:00' },
        { a: 'ROM', b: 'BET', time: '19:00' },
      ] },
      { date: '2026-10-14', matches: [
        { a: 'INT', b: 'RMA', time: '19:00' },
        { a: 'ARS', b: 'FEY', time: '19:00' },
        { a: 'BAY', b: 'BAR', time: '19:00' },
      ] },
    ],
  },
  {
    name: 'League Phase - 3',
    days: [
      { date: '2026-10-20', matches: [
        { a: 'BAR', b: 'BOD', time: '19:00' },
        { a: 'ARS', b: 'ATM', time: '19:00' },
        { a: 'LIV', b: 'MUN', time: '19:00' },
      ] },
      { date: '2026-10-21', matches: [
        { a: 'LYO', b: 'BET', time: '19:00' },
        { a: 'POR', b: 'GAL', time: '19:00' },
        { a: 'MCI', b: 'CEL', time: '19:00' },
      ] },
    ],
  },
];
const ALL_DAYS = ROUNDS.flatMap(r => r.days.map(d => ({ ...d, round: r.name })));
const TODAY_IDX = 0; // demo: pretend the first date is "live today"

function fmtDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return { num: d.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' }), dow: d.toLocaleDateString('he-IL', { weekday: 'short' }) };
}

function Ring({ pct, size = 22 }) {
  const r = (size - 4) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2},${size / 2}) rotate(-90)`}>
        <circle r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2.5} />
        <circle r={r} fill="none" stroke={`rgba(${GREEN},1)`} strokeWidth={2.5} strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round" />
      </g>
    </svg>
  );
}

function MatchRow({ m }) {
  return (
    <div className="flex items-center gap-3 bg-white/4 border border-white/6 rounded-xl px-3 py-2.5">
      <TeamBadge code={m.a} />
      <div className="flex-1 flex flex-col items-center">
        {m.finished ? (
          <span className="text-white font-bold text-sm tabular-nums">{m.sa} – {m.sb}</span>
        ) : (
          <span style={{ background: `linear-gradient(90deg, rgba(${GREEN},1), #16a34a)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 4px rgba(${GREEN},0.85))` }} className="text-sm font-bold">{m.time}</span>
        )}
      </div>
      <TeamBadge code={m.b} />
    </div>
  );
}

function Phone({ title, desc, children }) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-white font-bold text-sm">{title}</h3>
        <p className="text-slate-500 text-xs">{desc}</p>
      </div>
      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: '#0a0f1a', maxWidth: 380 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Variant A: scroll-snap tabs + tap feedback + progress ring + live pulse ────
function VariantA() {
  const [sel, setSel] = useState(0);
  const day = ALL_DAYS[sel];
  const finished = day.matches.filter(m => m.finished).length;

  return (
    <Phone title="A · טאבים משופרים" desc="Scroll-snap, אנימציית לחיצה, טבעת התקדמות, נקודה פועמת על 'היום'">
      <div className="flex gap-2 px-3 py-3 overflow-x-auto" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
        {ALL_DAYS.map((d, i) => {
          const { num, dow } = fmtDay(d.date);
          const active = sel === i;
          const f = d.matches.filter(m => m.finished).length;
          return (
            <motion.button
              key={d.date}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSel(i)}
              style={{ scrollSnapAlign: 'center' }}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-colors ${active ? 'bg-sky-500/15 border-sky-400/40' : 'bg-white/4 border-white/8'}`}
            >
              <div className="flex items-center gap-1">
                {i === TODAY_IDX && (
                  <span className="relative flex h-1.5 w-1.5">
                    <motion.span animate={{ scale: [1, 2], opacity: [0.8, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="absolute inline-flex h-full w-full rounded-full bg-red-500" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                  </span>
                )}
                <span className={`text-xs font-bold ${active ? 'text-sky-400' : 'text-white/70'}`}>{num}</span>
              </div>
              <span className="text-[9px] text-white/30">{dow}</span>
              <Ring pct={d.matches.length ? f / d.matches.length : 0} />
            </motion.button>
          );
        })}
      </div>
      <div className="h-px bg-white/5" />
      <div className="p-3 space-y-2 min-h-[180px]">
        <AnimatePresence mode="wait">
          <motion.div key={sel} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-2">
            {day.matches.map((m, i) => <MatchRow key={i} m={m} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </Phone>
  );
}

// ─── Variant B: swipe/drag carousel + dot pagination ────────────────────────────
function VariantB() {
  const [sel, setSel] = useState(0);
  const day = ALL_DAYS[sel];
  const { num, dow } = fmtDay(day.date);

  const onDragEnd = (_, info) => {
    if (info.offset.x < -60 && sel < ALL_DAYS.length - 1) setSel(sel + 1);
    else if (info.offset.x > 60 && sel > 0) setSel(sel - 1);
  };

  return (
    <Phone title="B · ניווט בהחלקה" desc="גוררים ימינה/שמאלה על כרטיס המשחקים כדי לעבור בין תאריכים">
      <div className="px-3 pt-3 flex items-center justify-between">
        <span className="text-white font-bold text-sm">{num} · {dow}</span>
        <span className="text-white/30 text-[10px]">{sel + 1}/{ALL_DAYS.length}</span>
      </div>
      <div className="p-3 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={sel}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
            className="space-y-2 cursor-grab active:cursor-grabbing"
          >
            {day.matches.map((m, i) => <MatchRow key={i} m={m} />)}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-1.5 pb-3">
        {ALL_DAYS.map((_, i) => (
          <button key={i} onClick={() => setSel(i)} className="rounded-full transition-all" style={{ width: sel === i ? 16 : 6, height: 6, background: sel === i ? `rgba(${BLUE},1)` : 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>
    </Phone>
  );
}

// ─── Variant C: two-level — round chips, then day sub-tabs within the round ────
function VariantC() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [dayIdx, setDayIdx] = useState(0);
  const round = ROUNDS[roundIdx];
  const day = round.days[dayIdx];

  return (
    <Phone title="C · קיבוץ לפי מחזור" desc="טאב עליון למחזור, תת-טאבים לימים בתוכו — פחות עומס גלילה">
      <div className="flex gap-2 px-3 pt-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {ROUNDS.map((r, i) => (
          <motion.button
            key={r.name}
            whileTap={{ scale: 0.94 }}
            onClick={() => { setRoundIdx(i); setDayIdx(0); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border ${roundIdx === i ? 'bg-sky-500/15 border-sky-400/40 text-sky-400' : 'bg-white/4 border-white/8 text-white/50'}`}
          >
            {r.name}
          </motion.button>
        ))}
      </div>
      <div className="flex gap-2 px-3 pt-2 pb-3">
        {round.days.map((d, i) => {
          const { num, dow } = fmtDay(d.date);
          return (
            <motion.button
              key={d.date}
              whileTap={{ scale: 0.92 }}
              onClick={() => setDayIdx(i)}
              className={`flex-1 flex flex-col items-center py-1.5 rounded-lg border ${dayIdx === i ? 'bg-white/10 border-white/20' : 'bg-white/3 border-white/6'}`}
            >
              <span className="text-white text-xs font-bold">{num}</span>
              <span className="text-white/30 text-[9px]">{dow}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="h-px bg-white/5" />
      <div className="p-3 space-y-2 min-h-[140px]">
        <AnimatePresence mode="wait">
          <motion.div key={`${roundIdx}-${dayIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {day.matches.map((m, i) => <MatchRow key={i} m={m} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </Phone>
  );
}

// ─── Variant D: quick-jump mini calendar popover ────────────────────────────────
function MiniMonth({ monthDate, markedDates, selected, onPick }) {
  const y = monthDate.getFullYear(), m = monthDate.getMonth();
  const first = new Date(y, m, 1);
  const startPad = (first.getDay() + 1) % 7; // Sunday-first grid, RTL-friendly enough for a demo
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const key = (day) => `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <div className="p-3">
      <div className="text-center text-white/70 text-xs font-bold mb-2">{monthDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}</div>
      <div className="grid grid-cols-7 gap-1">
        {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(d => <div key={d} className="text-center text-[9px] text-white/25">{d}</div>)}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dk = key(day);
          const hasMatch = markedDates.has(dk);
          const isSel = dk === selected;
          return (
            <motion.button
              key={i}
              whileTap={hasMatch ? { scale: 0.85 } : {}}
              disabled={!hasMatch}
              onClick={() => hasMatch && onPick(dk)}
              className="relative aspect-square rounded-md flex items-center justify-center text-[10px]"
              style={{
                background: isSel ? `rgba(${BLUE},0.25)` : 'transparent',
                border: isSel ? `1px solid rgba(${BLUE},0.6)` : '1px solid transparent',
                color: hasMatch ? '#fff' : 'rgba(255,255,255,0.2)',
                fontWeight: hasMatch ? 700 : 400,
              }}
            >
              {day}
              {hasMatch && !isSel && <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ background: `rgba(${GREEN},1)` }} />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function VariantD() {
  const markedDates = new Set(ALL_DAYS.map(d => d.date));
  const [selected, setSelected] = useState(ALL_DAYS[0].date);
  const [open, setOpen] = useState(false);
  const day = ALL_DAYS.find(d => d.date === selected);

  return (
    <Phone title="D · קפיצה מהירה עם לוח שנה" desc="שימושי כי בין מחזורים יש פערים של שבועות — קופצים ישר לתאריך בלי לגלול">
      <div className="px-3 pt-3 flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-sm">{fmtDay(selected).num} · {fmtDay(selected).dow}</div>
          <div className="text-white/30 text-[10px]">{day.round}</div>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => setOpen(o => !o)} className="px-2.5 py-1.5 rounded-lg bg-white/8 border border-white/10 text-xs text-white/70 flex items-center gap-1">
          📅 קפיצה מהירה
        </motion.button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-y border-white/8 mt-3">
            <MiniMonth monthDate={new Date(2026, 8, 1)} markedDates={markedDates} selected={selected} onPick={(d) => { setSelected(d); setOpen(false); }} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-px bg-white/5 mt-3" />
      <div className="p-3 space-y-2 min-h-[140px]">
        <AnimatePresence mode="wait">
          <motion.div key={selected} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {day.matches.map((m, i) => <MatchRow key={i} m={m} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </Phone>
  );
}

export default function AdminDateSelectorDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — בורר תאריכים אינטראקטיבי</h2>
        <p className="text-slate-500 text-sm">4 גרסאות חיות ולחיצות, דאטה קבוע לדוגמה. כלי דמו בלבד — לא משפיע על ה-sheet האמיתי (MatchesByDateSheet.jsx).</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VariantA />
        <VariantB />
        <VariantC />
        <VariantD />
      </div>
    </div>
  );
}
