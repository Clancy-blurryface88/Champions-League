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

// ── 5. Vertical stacked accordion — collapsed header bars, one expands full ─
function V5() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex flex-col gap-1.5">
      {ROUND_DATES.map((d, i) => {
        const active = sel === i;
        return (
          <div key={d.key} className="rounded-xl overflow-hidden" style={{ background: active ? `rgba(${BLUE},0.14)` : 'rgba(255,255,255,0.05)', border: active ? `1px solid rgba(${BLUE},0.4)` : '1px solid transparent' }}>
            <button onClick={() => setSel(i)} className="w-full flex items-center justify-between px-3 py-2">
              <span className="text-white text-xs font-bold">{d.dow}, {d.day} {d.month}</span>
              <span className="text-slate-400 text-[10px]">{active ? '▲' : '▼'}</span>
            </button>
            <AnimatePresence>
              {active && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden px-3">
                  <div className="pb-2">{d.matches.map((m, mi) => <MatchRow key={mi} m={m} />)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ── 6. Triptych split-screen — permanently visible thirds, tap brings forward ─
function V6() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex gap-1" style={{ height: 160 }}>
      {ROUND_DATES.map((d, i) => (
        <motion.button key={d.key} onClick={() => setSel(i)} animate={{ scale: sel === i ? 1.04 : 0.96, zIndex: sel === i ? 2 : 1 }}
          className="flex-1 rounded-lg p-2 flex flex-col gap-1" style={{ background: sel === i ? `rgba(${BLUE},0.16)` : 'rgba(255,255,255,0.04)', border: sel === i ? `1px solid rgba(${BLUE},0.5)` : '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-white text-[11px] font-bold text-center">{d.day}</span>
          {d.matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
        </motion.button>
      ))}
    </div>
  );
}

// ── 7. Flip-book page turn ───────────────────────────────────────────────────
function V7() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex flex-col items-center gap-2" style={{ perspective: 800 }}>
      <div className="relative w-full" style={{ height: 130 }}>
        <AnimatePresence mode="popLayout" custom={sel}>
          <motion.div key={sel} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }} style={{ transformOrigin: 'left center' }}
            className="absolute inset-0 rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-white text-xs font-bold">{ROUND_DATES[sel].dow}, {ROUND_DATES[sel].day}</span>
            {ROUND_DATES[sel].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setSel((s) => Math.max(0, s - 1))} className="text-slate-400 text-xs">◀ עמוד קודם</button>
        <button onClick={() => setSel((s) => Math.min(ROUND_DATES.length - 1, s + 1))} className="text-slate-400 text-xs">עמוד הבא ▶</button>
      </div>
    </div>
  );
}

// ── 8. Overlapping circles — tap brings one to front and expands ────────────
function V8() {
  const [sel, setSel] = useState(0);
  return (
    <div className="relative flex justify-center items-center" style={{ height: 170 }}>
      {ROUND_DATES.map((d, i) => {
        const active = sel === i;
        const offsets = [-40, 0, 40];
        return (
          <motion.button key={d.key} onClick={() => setSel(i)}
            animate={{ x: active ? 0 : offsets[i], scale: active ? 1 : 0.7, zIndex: active ? 10 : i }}
            className="absolute rounded-full flex flex-col items-center justify-center p-3"
            style={{ width: active ? 130 : 70, height: active ? 130 : 70, background: `rgba(${BLUE},${active ? 0.22 : 0.1})`, border: `1px solid rgba(${BLUE},${active ? 0.5 : 0.25})` }}>
            <span className="text-white text-xs font-black">{d.day}</span>
            {active && <div className="mt-1 w-full">{d.matches.slice(0, 2).map((m, mi) => <MatchRow key={mi} m={m} />)}</div>}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── 9. Stacked flip-scoreboard rows — split-flap per date, always visible ──
function V9() {
  return (
    <div className="flex flex-col gap-2.5">
      {ROUND_DATES.map((d) => (
        <div key={d.key}>
          <div className="text-[9px] text-slate-500 font-bold mb-1">{d.dow}, {d.day}</div>
          <div className="flex flex-col gap-0.5">
            {d.matches.map((m, mi) => (
              <motion.div key={mi} initial={{ rotateX: -90 }} animate={{ rotateX: 0 }} transition={{ delay: mi * 0.08 }} style={{ transformOrigin: 'top', perspective: 200 }}>
                <MatchRow m={m} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 10. Comparison table — rows aligned across days ─────────────────────────
function V10() {
  const maxRows = Math.max(...ROUND_DATES.map((d) => d.matches.length));
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${ROUND_DATES.length}, 1fr)` }}>
      {ROUND_DATES.map((d) => <div key={d.key} className="text-white text-[10px] font-bold text-center pb-1">{d.day}</div>)}
      {Array.from({ length: maxRows }).map((_, r) => ROUND_DATES.map((d) => {
        const m = d.matches[r];
        return (
          <div key={d.key + r} className="rounded px-1 py-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {m ? <MatchRow m={m} /> : <div className="h-4" />}
          </div>
        );
      }))}
    </div>
  );
}

// ── 11. Horizontal scrub timeline — continuous drag, not snap ───────────────
function V11() {
  const [pct, setPct] = useState(0);
  const idx = Math.min(ROUND_DATES.length - 1, Math.round((pct / 100) * (ROUND_DATES.length - 1)));
  return (
    <div className="flex flex-col gap-2">
      <input type="range" min="0" max="100" value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full" style={{ accentColor: `rgb(${BLUE})` }} />
      <div className="flex justify-between text-[9px] text-slate-500">
        {ROUND_DATES.map((d) => <span key={d.key}>{d.day}</span>)}
      </div>
      <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <span className="text-white text-xs font-bold">{ROUND_DATES[idx].dow}, {ROUND_DATES[idx].day}</span>
        {ROUND_DATES[idx].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
      </div>
    </div>
  );
}

// ── 12. Tri-fold brochure — panels fold/unfold in 3D ─────────────────────────
function V12() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-center" style={{ perspective: 700 }}>
      <div className="flex" style={{ transformStyle: 'preserve-3d' }}>
        {ROUND_DATES.map((d, i) => (
          <motion.div key={d.key} animate={{ rotateY: open ? 0 : i === 1 ? 0 : i === 0 ? 25 : -25 }} transition={{ duration: 0.5 }}
            onClick={() => setOpen((o) => !o)} className="w-20 p-2 flex-shrink-0" style={{ background: i % 2 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', transformOrigin: i === 0 ? 'right' : i === 2 ? 'left' : 'center', cursor: 'pointer' }}>
            <span className="text-white text-[10px] font-bold block text-center mb-1">{d.day}</span>
            {open && d.matches.slice(0, 2).map((m, mi) => <MatchRow key={mi} m={m} />)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 13. Stories tray + main viewer ───────────────────────────────────────────
function V13() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-lg p-2.5" style={{ background: `rgba(${BLUE},0.12)`, border: `1px solid rgba(${BLUE},0.35)` }}>
        <span className="text-white text-xs font-bold">{ROUND_DATES[sel].dow}, {ROUND_DATES[sel].day}</span>
        {ROUND_DATES[sel].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
      </div>
      <div className="flex gap-2 justify-center">
        {ROUND_DATES.map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)} className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: sel === i ? `rgba(${BLUE},1)` : 'transparent', border: `2px solid rgba(${BLUE},${sel === i ? 1 : 0.4})`, color: '#fff' }}>
            {d.day}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 14. Dashboard widget tiles ───────────────────────────────────────────────
function V14() {
  const [sel, setSel] = useState(0);
  return (
    <div className="grid grid-cols-2 gap-2">
      {ROUND_DATES.map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className={`rounded-xl p-2 text-right ${i === 0 ? 'col-span-2' : ''}`}
          style={{ background: sel === i ? `rgba(${BLUE},0.16)` : 'rgba(255,255,255,0.05)', border: sel === i ? `1px solid rgba(${BLUE},0.5)` : '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-white text-[11px] font-bold mb-1">{d.dow}, {d.day}</div>
          {d.matches.slice(0, i === 0 ? 3 : 2).map((m, mi) => <MatchRow key={mi} m={m} />)}
        </button>
      ))}
    </div>
  );
}

// ── 15. Radial burst reveal from a center button ────────────────────────────
function V15() {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const pos = [{ x: -60, y: -10 }, { x: 0, y: -55 }, { x: 60, y: -10 }];
  return (
    <div className="relative flex flex-col items-center gap-2" style={{ minHeight: 150 }}>
      <div className="relative" style={{ width: 140, height: 70 }}>
        <button onClick={() => setOpen((o) => !o)} className="absolute rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ left: '50%', top: 55, transform: 'translateX(-50%)', width: 40, height: 40, background: `rgba(${BLUE},1)` }}>
          {open ? '✕' : 'ימים'}
        </button>
        {open && ROUND_DATES.map((d, i) => (
          <motion.button key={d.key} onClick={() => setSel(i)} initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: pos[i].x, y: pos[i].y, opacity: 1 }}
            className="absolute rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ left: '50%', top: 55, marginLeft: -16, marginTop: -16, width: 32, height: 32, background: sel === i ? '#4ade80' : 'rgba(255,255,255,0.15)' }}>
            {d.day}
          </motion.button>
        ))}
      </div>
      {open && <div className="rounded-lg p-2 w-full" style={{ background: 'rgba(255,255,255,0.04)' }}>{ROUND_DATES[sel].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}</div>}
    </div>
  );
}

// ── 16. Sliding drawers — pull one open, others stay ajar ───────────────────
function V16() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex flex-col gap-1">
      {ROUND_DATES.map((d, i) => (
        <motion.div key={d.key} animate={{ x: sel === i ? 0 : -10 }} onClick={() => setSel(i)} className="rounded-r-lg overflow-hidden cursor-pointer"
          style={{ background: sel === i ? `rgba(${BLUE},0.14)` : 'rgba(255,255,255,0.04)', borderRight: `3px solid rgba(${BLUE},${sel === i ? 1 : 0.3})` }}>
          <div className="px-3 py-1.5 text-white text-[11px] font-bold">{d.dow}, {d.day}</div>
          {sel === i && <div className="px-3 pb-2">{d.matches.map((m, mi) => <MatchRow key={mi} m={m} />)}</div>}
        </motion.div>
      ))}
    </div>
  );
}

// ── 17. Podium heights ───────────────────────────────────────────────────────
function V17() {
  const [sel, setSel] = useState(1);
  const heights = [70, 100, 60];
  return (
    <div className="flex items-end justify-center gap-1.5" style={{ height: 130 }}>
      {ROUND_DATES.map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex flex-col items-center justify-end rounded-t-lg px-2 pt-2"
          style={{ height: heights[i], width: 70, background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.08)' }}>
          <span className="text-white text-[11px] font-black mb-1">{d.day}</span>
          {sel === i && d.matches.slice(0, 1).map((m, mi) => <MatchRow key={mi} m={m} />)}
        </button>
      ))}
    </div>
  );
}

// ── 18. Magazine spread — one hero block, others as side strips ─────────────
function V18() {
  const [sel, setSel] = useState(0);
  const others = ROUND_DATES.filter((_, i) => i !== sel);
  return (
    <div className="flex gap-2" style={{ height: 165 }}>
      <div className="flex-[2] rounded-xl p-2.5" style={{ background: `rgba(${BLUE},0.14)`, border: `1px solid rgba(${BLUE},0.4)` }}>
        <span className="text-white text-xs font-bold">{ROUND_DATES[sel].dow}, {ROUND_DATES[sel].day}</span>
        {ROUND_DATES[sel].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        {others.map((d) => (
          <button key={d.key} onClick={() => setSel(ROUND_DATES.indexOf(d))} className="flex-1 rounded-lg p-1.5 text-right" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span className="text-white text-[10px] font-bold">{d.day}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 19. Orbiting previews around a hero center ───────────────────────────────
function V19() {
  const [sel, setSel] = useState(0);
  const others = ROUND_DATES.filter((_, i) => i !== sel);
  return (
    <div className="relative flex items-center justify-center" style={{ height: 160 }}>
      <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2.4, repeat: Infinity }}
        className="rounded-xl p-2.5 z-10" style={{ width: 130, background: `rgba(${BLUE},0.16)`, border: `1px solid rgba(${BLUE},0.5)` }}>
        <span className="text-white text-xs font-bold">{ROUND_DATES[sel].dow}, {ROUND_DATES[sel].day}</span>
        {ROUND_DATES[sel].matches.slice(0, 2).map((m, mi) => <MatchRow key={mi} m={m} />)}
      </motion.div>
      {others.map((d, i) => (
        <button key={d.key} onClick={() => setSel(ROUND_DATES.indexOf(d))} className="absolute rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.1)', left: i === 0 ? 10 : undefined, right: i === 1 ? 10 : undefined, top: i === 0 ? 15 : undefined, bottom: i === 1 ? 15 : undefined }}>
          {d.day}
        </button>
      ))}
    </div>
  );
}

// ── 20. Now vs Next duo — one big, the rest small alongside ─────────────────
function V20b() {
  const [sel, setSel] = useState(0);
  const rest = ROUND_DATES.filter((_, i) => i !== sel);
  return (
    <div className="flex gap-2">
      <div className="flex-1 rounded-xl p-2.5" style={{ background: `rgba(${GREEN},0.12)`, border: `1px solid rgba(${GREEN},0.4)` }}>
        <span className="text-[9px] text-emerald-400 font-bold">עכשיו</span>
        <div className="text-white text-sm font-black mb-1">{ROUND_DATES[sel].day}</div>
        {ROUND_DATES[sel].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
      </div>
      <div className="flex flex-col gap-1.5" style={{ width: 70 }}>
        <span className="text-[9px] text-slate-500 font-bold">הבא</span>
        {rest.map((d) => (
          <button key={d.key} onClick={() => setSel(ROUND_DATES.indexOf(d))} className="rounded-lg py-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span className="text-white text-xs font-bold">{d.day}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 21. Floating glass cards with tilt on tap ────────────────────────────────
function V21() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex gap-3 justify-center items-center" style={{ height: 150 }}>
      {ROUND_DATES.map((d, i) => (
        <motion.button key={d.key} onClick={() => setSel(i)} animate={{ rotateZ: sel === i ? 0 : i % 2 ? 4 : -4, y: sel === i ? -6 : 0, scale: sel === i ? 1.05 : 0.95 }}
          className="rounded-xl p-2 flex flex-col gap-1" style={{ width: 78, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: sel === i ? `1px solid rgba(${BLUE},0.5)` : '1px solid rgba(255,255,255,0.1)', boxShadow: sel === i ? `0 8px 24px rgba(${BLUE},0.3)` : 'none' }}>
          <span className="text-white text-[11px] font-bold text-center">{d.day}</span>
          {sel === i && d.matches.slice(0, 1).map((m, mi) => <MatchRow key={mi} m={m} />)}
        </motion.button>
      ))}
    </div>
  );
}

// ── 22. Fill-up quadrant square ──────────────────────────────────────────────
function V22() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex gap-3 items-center">
      <div className="grid grid-cols-3 gap-1" style={{ width: 70, height: 70 }}>
        {ROUND_DATES.map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)} className="rounded flex items-center justify-center text-[9px] font-bold text-white" style={{ background: sel === i ? `rgba(${BLUE},1)` : 'rgba(255,255,255,0.1)' }}>{d.day}</button>
        ))}
      </div>
      <div className="flex-1 rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.04)' }}>{ROUND_DATES[sel].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}</div>
    </div>
  );
}

// ── 23. Shared hourglass — days as sand-timer segments ──────────────────────
function V23() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-end gap-0.5" style={{ height: 40 }}>
        {ROUND_DATES.map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)} style={{ width: 20, height: 14 + i * 10, background: sel === i ? `rgba(${BLUE},1)` : 'rgba(255,255,255,0.15)', clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
        ))}
      </div>
      <div className="rounded-lg p-2 w-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <span className="text-white text-xs font-bold">{ROUND_DATES[sel].dow}, {ROUND_DATES[sel].day}</span>
        {ROUND_DATES[sel].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}
      </div>
    </div>
  );
}

// ── 24. Football pitch zones — dates as thirds of the pitch ─────────────────
function V24() {
  const [sel, setSel] = useState(0);
  const labels = ['הגנה', 'קישור', 'התקפה'];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-0.5 rounded-lg overflow-hidden" style={{ border: '2px solid rgba(255,255,255,0.15)' }}>
        {ROUND_DATES.map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)} className="flex-1 flex flex-col items-center py-2"
            style={{ background: sel === i ? 'rgba(74,222,128,0.2)' : i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)' }}>
            <span className="text-[8px] text-slate-400">{labels[i] || d.dow}</span>
            <span className="text-white text-sm font-black">{d.day}</span>
          </button>
        ))}
      </div>
      <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.04)' }}>{ROUND_DATES[sel].matches.map((m, mi) => <MatchRow key={mi} m={m} />)}</div>
    </div>
  );
}

const VARIANTS = [
  ['1. פאנלים רחבים זה לצד זה', 'כל 3 התאריכים גלויים במקביל, כל אחד עם תצוגה מקדימה מלאה — אין "בחירה", רק לחיצה להדגשה', V1],
  ['2. התרחבות בלחיצה (Accordion אופקי)', 'לוחצים על תאריך והוא "אוכל" את הרוחב מהשכנים ומגלה את כל המשחקים בפנים', V2],
  ['3. קרוסלה נגררת עם הצצה', 'גוררים אצבע ימינה/שמאלה בין תאריכים, כל אחד כרטיס עשיר מלא', V3],
  ['4. ציר מסע מחובר', 'תאריכים כתחנות גדולות על קו התקדמות, לחיצה מציגה את כל משחקי היום למטה', V4],
  ['5. מחסנית אנכית מתקפלת', 'שורות כותרת מתקפלות, אחת פתוחה בכל רגע עם כל המשחקים', V5],
  ['6. שלישיה מפוצלת', 'שלושת התאריכים גלויים תמיד זה לצד זה, לחיצה מגדילה ומדגישה', V6],
  ['7. דפדוף ספר', 'כל תאריך "עמוד" שמתהפך בתלת-ממד לעמוד הבא', V7],
  ['8. עיגולים חופפים', 'תאריכים כעיגולים חופפים, לחיצה מביאה אחד לחזית ומרחיבה', V8],
  ['9. סקורבורד מתהפך ערום', 'כל התאריכים גלויים, כל שורת משחק "מתהפכת" פנימה בכניסה', V9],
  ['10. טבלת השוואה', 'עמודה לכל תאריך, שורות מיושרות כדי להשוות משחק מול משחק', V10],
  ['11. ציר גרירה רציף', 'סליידר אחד גורר בין הימים ברצף, לא קפיצה בין כרטיסים', V11],
  ['12. חוברת מתקפלת', 'שלושה פאנלים כמו חוברת מתקפלת, טאפ פותח/סוגר בתלת-ממד', V12],
  ['13. רצועת סטוריז + מציג ראשי', 'עיגולים קטנים למטה כמו סטוריז, התוכן המלא למעלה', V13],
  ['14. אריחי דשבורד', 'התאריך הראשי אריח רחב, השאר אריחים קטנים לצדו', V14],
  ['15. פיצוץ רדיאלי ממרכז', 'כפתור מרכזי "פותח" את הימים כבועות שמתפזרות סביבו', V15],
  ['16. ערימת מגירות', 'כל תאריך מגירה שנפתחת בלחיצה, השאר נשארות פתוחות חלקית', V16],
  ['17. פודיום', 'התאריכים בגבהים משתנים כמו פודיום אולימפי', V17],
  ['18. פריסת מגזין', 'בלוק גיבור גדול אחד + שני פסי צד קטנים לשאר התאריכים', V18],
  ['19. לוויינים מקיפים', 'תאריך מרכזי "נושם" באמצע, השאר מקיפים אותו כלוויינים', V19],
  ['20. עכשיו מול הבא', 'בלוק גדול "עכשיו" ולידו עמודת "הבא" קטנה וצרה', V20b],
  ['21. כרטיסי זכוכית מרחפים', 'כרטיסים עם נטייה עדינה שמתיישרים בלחיצה, אפקט זכוכית', V21],
  ['22. ריבוע מתמלא', 'גריד קטן 3 משבצות לצד תוכן מלא של הנבחר', V22],
  ['23. שעון חול משותף', 'ימים כמשולשי שעון חול בגבהים משתנים', V23],
  ['24. מגרש כדורגל', 'שלושת התאריכים כשליש הגנה/קישור/התקפה של המגרש', V24],
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
