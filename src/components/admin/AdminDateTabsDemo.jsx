import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Demo-only: 20 ways to redesign the date-tab strip in Predictions.jsx.
// Mock data, self-contained, all live/tappable. Doesn't touch Predictions.jsx.

const BLUE = '9,122,220';

const DATES = [
  { key: '09-08', dow: 'Tue', day: 8,  month: 'ספט', finished: 0, total: 6, missing: true },
  { key: '09-09', dow: 'Wed', day: 9,  month: 'ספט', finished: 2, total: 6, missing: true },
  { key: '09-10', dow: 'Thu', day: 10, month: 'ספט', finished: 6, total: 6, missing: false },
  { key: '10-13', dow: 'Tue', day: 13, month: 'אוק', finished: 0, total: 6, missing: true },
  { key: '10-14', dow: 'Wed', day: 14, month: 'אוק', finished: 0, total: 3, missing: false },
  { key: '10-20', dow: 'Tue', day: 20, month: 'אוק', finished: 0, total: 6, missing: true },
];
const TEAMS = ['ARS', 'RMA', 'BAY', 'INT', 'PSG', 'LIV', 'BAR', 'MCI'];
const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4', '#f97316'];
function colorFor(code) {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}
function TeamDot({ code, size = 14 }) {
  return <div className="rounded-full flex-shrink-0" style={{ width: size, height: size, background: colorFor(code) }} />;
}

function Frame({ label, desc, children }) {
  return (
    <div className="bg-slate-800/40 border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
      <div className="rounded-xl overflow-hidden p-3" style={{ background: '#050a12', minHeight: 90 }}>{children}</div>
      <div><div className="text-white text-xs font-bold">{label}</div><div className="text-slate-500 text-[10px]">{desc}</div></div>
    </div>
  );
}

function useSel(init = 0) { return useState(init); }

// 1. Timeline rail — dots on a connecting line
function V1() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="relative px-2" dir="ltr">
      <div className="absolute top-3 left-2 right-2 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
      <div className="flex justify-between relative">
        {DATES.map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)} className="flex flex-col items-center gap-1.5">
            <span className="rounded-full transition-all" style={{ width: sel === i ? 14 : 8, height: sel === i ? 14 : 8, background: sel === i ? `rgba(${BLUE},1)` : '#334155', boxShadow: sel === i ? `0 0 8px rgba(${BLUE},0.8)` : 'none' }} />
            <span className="text-[9px] text-slate-400">{d.day}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// 2. Segmented control — sliding highlight
function V2() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex rounded-xl p-1 gap-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
      {DATES.slice(0, 3).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex-1 relative py-1.5 rounded-lg text-center">
          {sel === i && <motion.div layoutId="seg" className="absolute inset-0 rounded-lg" style={{ background: `rgba(${BLUE},0.9)` }} />}
          <span className="relative text-[11px] font-bold text-white">{d.dow} {d.day}</span>
        </button>
      ))}
    </div>
  );
}

// 3. Compact chips + thin progress bar
function V3() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-1.5">
      {DATES.map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg" style={{ background: sel === i ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
          <span className="text-[9px] text-slate-400">{d.dow}</span>
          <span className="text-xs font-bold text-white">{d.day}</span>
          <div className="w-6 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <div className="h-full" style={{ width: `${d.total ? (d.finished / d.total) * 100 : 0}%`, background: '#4ade80' }} />
          </div>
        </button>
      ))}
    </div>
  );
}

// 4. Team-preview thumbnails
function V4() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-2">
      {DATES.slice(0, 3).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex flex-col items-center gap-1.5 px-2.5 py-2 rounded-xl"
          style={{ background: sel === i ? `rgba(${BLUE},0.18)` : 'rgba(255,255,255,0.05)', border: sel === i ? `1px solid rgba(${BLUE},0.5)` : '1px solid transparent' }}>
          <span className="text-[10px] text-white font-bold">{d.dow} {d.day}</span>
          <div className="flex -space-x-1.5">
            {TEAMS.slice(i * 2, i * 2 + 3).map((t) => <TeamDot key={t} code={t} size={12} />)}
          </div>
        </button>
      ))}
    </div>
  );
}

// 5. Month grouping with sticky label
function V5() {
  const [sel, setSel] = useSel(0);
  const groups = [['ספטמבר', DATES.slice(0, 3)], ['אוקטובר', DATES.slice(3)]];
  return (
    <div className="flex flex-col gap-2">
      {groups.map(([month, ds]) => (
        <div key={month}>
          <div className="text-[9px] text-slate-500 font-bold mb-1">{month}</div>
          <div className="flex gap-1.5">
            {ds.map((d) => {
              const i = DATES.indexOf(d);
              return (
                <button key={d.key} onClick={() => setSel(i)} className="px-2 py-1 rounded-lg text-[10px] font-bold" style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.06)', color: sel === i ? '#000' : '#fff' }}>{d.day}</button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// 6. Ticket stub cards
function V6() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-2">
      {DATES.slice(0, 3).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="relative flex flex-col items-center px-3 py-2 rounded-lg" style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.06)' }}>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {[0, 1, 2].map((n) => <span key={n} className="w-1 h-1 rounded-full" style={{ background: '#050a12' }} />)}
          </div>
          <span className="text-[9px]" style={{ color: sel === i ? '#000' : '#94a3b8' }}>{d.dow}</span>
          <span className="text-sm font-black" style={{ color: sel === i ? '#000' : '#fff' }}>{d.day}</span>
        </button>
      ))}
    </div>
  );
}

// 7. Radial dial — dates around a circle
function V7() {
  const [sel, setSel] = useSel(0);
  const R = 34;
  return (
    <div className="relative mx-auto" style={{ width: 90, height: 90 }}>
      {DATES.map((d, i) => {
        const angle = (i / DATES.length) * Math.PI * 2 - Math.PI / 2;
        const x = 45 + R * Math.cos(angle) - 12, y = 45 + R * Math.sin(angle) - 12;
        return (
          <button key={d.key} onClick={() => setSel(i)} className="absolute rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{ left: x, top: y, width: 24, height: 24, background: sel === i ? `rgba(${BLUE},1)` : 'rgba(255,255,255,0.08)', color: sel === i ? '#fff' : '#94a3b8' }}>
            {d.day}
          </button>
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-500">ימים</div>
    </div>
  );
}

// 8. Flip cards — date side / progress side, tap to flip
function V8() {
  const [flipped, setFlipped] = useState({});
  return (
    <div className="flex gap-2" style={{ perspective: 400 }}>
      {DATES.slice(0, 3).map((d) => (
        <motion.button key={d.key} onClick={() => setFlipped((f) => ({ ...f, [d.key]: !f[d.key] }))}
          animate={{ rotateY: flipped[d.key] ? 180 : 0 }} transition={{ duration: 0.4 }}
          className="w-14 h-16 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', transformStyle: 'preserve-3d' }}>
          <div style={{ transform: flipped[d.key] ? 'rotateY(180deg)' : 'none' }} className="flex flex-col items-center">
            <span className="text-[9px] text-slate-400">{d.dow}</span>
            <span className="text-lg font-black text-white">{d.day}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// 9. Gradient heat strip — proximity to today via color intensity
function V9() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-1">
      {DATES.map((d, i) => {
        const intensity = 1 - i * 0.15;
        return (
          <button key={d.key} onClick={() => setSel(i)} className="flex-1 flex flex-col items-center py-2 rounded-lg" style={{ background: `rgba(${BLUE},${Math.max(intensity * 0.5, 0.08)})`, border: sel === i ? '1px solid white' : '1px solid transparent' }}>
            <span className="text-[9px] text-white/80">{d.dow}</span>
            <span className="text-xs font-bold text-white">{d.day}</span>
          </button>
        );
      })}
    </div>
  );
}

// 10. Card-deck fan
function V10() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="relative flex justify-center" style={{ height: 70 }}>
      {DATES.slice(0, 3).map((d, i) => {
        const off = i - 1;
        return (
          <motion.button key={d.key} onClick={() => setSel(i)}
            animate={{ x: off * 26, rotate: off * 8, y: sel === i ? -8 : 0 }}
            className="absolute w-12 h-16 rounded-xl flex flex-col items-center justify-center"
            style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.08)', zIndex: sel === i ? 10 : 1 }}>
            <span className="text-[9px]" style={{ color: sel === i ? '#000' : '#94a3b8' }}>{d.dow}</span>
            <span className="text-sm font-black" style={{ color: sel === i ? '#000' : '#fff' }}>{d.day}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// 11. Gauge arc — all days as segments of a semi-circle
function V11() {
  const [sel, setSel] = useSel(0);
  const n = DATES.length;
  return (
    <div className="relative mx-auto" style={{ width: 140, height: 75 }}>
      <svg width="140" height="75">
        {DATES.map((d, i) => {
          const a0 = Math.PI - (i / n) * Math.PI, a1 = Math.PI - ((i + 1) / n) * Math.PI;
          const cx = 70, cy = 70, r = 55;
          const x0 = cx + r * Math.cos(a0), y0 = cy - r * Math.sin(a0);
          const x1 = cx + r * Math.cos(a1), y1 = cy - r * Math.sin(a1);
          return (
            <path key={d.key} d={`M${cx},${cy} L${x0},${y0} A${r},${r} 0 0 0 ${x1},${y1} Z`}
              fill={sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.08)'} stroke="#050a12" strokeWidth={1}
              onClick={() => setSel(i)} style={{ cursor: 'pointer' }} />
          );
        })}
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">{DATES[sel].dow} {DATES[sel].day}</div>
    </div>
  );
}

// 12. Vertical side rail
function V12() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-3">
      <div className="flex flex-col gap-1.5">
        {DATES.map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)} className="w-9 h-9 rounded-lg flex flex-col items-center justify-center" style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.06)' }}>
            <span className="text-[8px]" style={{ color: sel === i ? '#000' : '#94a3b8' }}>{d.dow}</span>
            <span className="text-[11px] font-bold" style={{ color: sel === i ? '#000' : '#fff' }}>{d.day}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center text-slate-500 text-[10px]">תוכן {DATES[sel].dow} {DATES[sel].day}</div>
    </div>
  );
}

// 13. Always-visible inline mini calendar
function V13() {
  const [sel, setSel] = useSel(0);
  const marked = new Set(DATES.map((d) => d.day));
  return (
    <div className="grid grid-cols-7 gap-1 max-w-[180px] mx-auto">
      {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => {
        const d = DATES.find((x) => x.day === day);
        const isSel = d && DATES.indexOf(d) === sel;
        return (
          <button key={day} disabled={!marked.has(day)} onClick={() => d && setSel(DATES.indexOf(d))}
            className="aspect-square rounded flex items-center justify-center text-[9px]"
            style={{ background: isSel ? `rgba(${BLUE},0.9)` : marked.has(day) ? 'rgba(255,255,255,0.08)' : 'transparent', color: marked.has(day) ? '#fff' : 'rgba(255,255,255,0.2)' }}>
            {day}
          </button>
        );
      })}
    </div>
  );
}

// 14. Ball-icon tally instead of numeric ring
function V14() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-2">
      {DATES.slice(0, 3).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl" style={{ background: sel === i ? `rgba(${BLUE},0.18)` : 'rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] text-white font-bold">{d.dow} {d.day}</span>
          <span className="text-[10px]">{'⚽'.repeat(Math.min(d.finished, 3)) || '·'}</span>
        </button>
      ))}
    </div>
  );
}

// 15. Countdown-style labels
function V15() {
  const [sel, setSel] = useSel(0);
  const labels = ['היום', 'מחר', 'בעוד 2 ימים', 'בעוד 5 שבועות', 'בעוד 5 שבועות', 'בעוד 6 שבועות'];
  return (
    <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      {DATES.map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-center" style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-bold" style={{ color: sel === i ? '#000' : '#fff' }}>{d.day}/{d.month === 'ספט' ? '09' : '10'}</div>
          <div className="text-[8px]" style={{ color: sel === i ? 'rgba(0,0,0,0.6)' : '#94a3b8' }}>{labels[i]}</div>
        </button>
      ))}
    </div>
  );
}

// 16. Status-coded solid colors
function V16() {
  const [sel, setSel] = useSel(0);
  const statusColor = (d) => d.finished === d.total ? 'rgba(74,222,128,0.85)' : d.finished > 0 ? `rgba(${BLUE},0.85)` : 'rgba(250,204,21,0.7)';
  return (
    <div className="flex gap-1.5">
      {DATES.slice(0, 3).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="px-2.5 py-2 rounded-lg flex flex-col items-center" style={{ background: statusColor(d), outline: sel === i ? '2px solid white' : 'none' }}>
          <span className="text-[9px] text-black/70 font-bold">{d.dow}</span>
          <span className="text-sm font-black text-black">{d.day}</span>
        </button>
      ))}
    </div>
  );
}

// 17. App-icon style round badges
function V17() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-2">
      {DATES.slice(0, 4).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center"
          style={{ background: sel === i ? `linear-gradient(135deg, rgba(${BLUE},1), #7cadee)` : 'rgba(255,255,255,0.07)', boxShadow: sel === i ? `0 4px 14px rgba(${BLUE},0.5)` : 'none' }}>
          <span className="text-[8px]" style={{ color: sel === i ? '#fff' : '#94a3b8' }}>{d.dow}</span>
          <span className="text-sm font-black" style={{ color: sel === i ? '#fff' : '#fff' }}>{d.day}</span>
        </button>
      ))}
    </div>
  );
}

// 18. Hero swipe — one big card at a time, dot indicators
function V18() {
  const [sel, setSel] = useSel(0);
  const d = DATES[sel];
  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.div key={d.key} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="w-full rounded-xl px-4 py-3 text-center" style={{ background: `rgba(${BLUE},0.18)`, border: `1px solid rgba(${BLUE},0.4)` }}>
          <div className="text-white text-sm font-bold">{d.dow}, {d.day} {d.month}</div>
          <div className="text-slate-400 text-[10px]">{d.finished}/{d.total} משחקים הסתיימו</div>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-1">
        {DATES.map((_, i) => (
          <button key={i} onClick={() => setSel(i)} className="rounded-full" style={{ width: sel === i ? 14 : 6, height: 6, background: sel === i ? `rgba(${BLUE},1)` : 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>
    </div>
  );
}

// 19. Collapsible month accordions
function V19() {
  const [open, setOpen] = useState('ספטמבר');
  const [sel, setSel] = useSel(0);
  const groups = [['ספטמבר', DATES.slice(0, 3)], ['אוקטובר', DATES.slice(3)]];
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {groups.map(([month, ds]) => (
        <div key={month} className="rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <button onClick={() => setOpen(open === month ? null : month)} className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] text-slate-300 font-bold">
            {month} <span>{open === month ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence>
            {open === month && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="flex gap-1.5 px-3 pb-2">
                  {ds.map((d) => {
                    const i = DATES.indexOf(d);
                    return <button key={d.key} onClick={() => setSel(i)} className="px-2 py-1 rounded text-[10px] font-bold" style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.08)', color: sel === i ? '#000' : '#fff' }}>{d.day}</button>;
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// 20. Fixed-center "subway" strip — active date pinned center, others slide
function V20() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="relative overflow-hidden" style={{ height: 50 }}>
      <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: `rgba(${BLUE},0.4)` }} />
      <motion.div className="flex gap-3 absolute top-0" animate={{ x: `calc(50% - ${sel * 44 + 22}px)` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        {DATES.map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)} className="w-10 flex flex-col items-center py-2 rounded-lg flex-shrink-0" style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.06)' }}>
            <span className="text-[8px]" style={{ color: sel === i ? '#000' : '#94a3b8' }}>{d.dow}</span>
            <span className="text-xs font-bold" style={{ color: sel === i ? '#000' : '#fff' }}>{d.day}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}

// 21. Bar chart — height reflects match count
function V21() {
  const [sel, setSel] = useSel(0);
  const max = Math.max(...DATES.map((d) => d.total));
  return (
    <div className="flex items-end gap-2" style={{ height: 60 }}>
      {DATES.map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full rounded-t" style={{ height: `${(d.total / max) * 40}px`, background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.15)' }} />
          <span className="text-[8px]" style={{ color: sel === i ? '#fff' : '#64748b' }}>{d.day}</span>
        </button>
      ))}
    </div>
  );
}

// 22. Donut/pie — full circle split into equal wedges
function V22() {
  const [sel, setSel] = useSel(0);
  const n = DATES.length, r = 34, cx = 40, cy = 40;
  const arc = (i) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    return `M${cx},${cy} L${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} Z`;
  };
  return (
    <div className="mx-auto" style={{ width: 80, height: 80 }}>
      <svg width="80" height="80">
        {DATES.map((d, i) => (
          <path key={d.key} d={arc(i)} fill={sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.1)'} stroke="#050a12" strokeWidth={1.5} onClick={() => setSel(i)} style={{ cursor: 'pointer' }} />
        ))}
      </svg>
    </div>
  );
}

// 23. Rotary phone dial — click a slot, decorative needle points at it
function V23() {
  const [sel, setSel] = useSel(0);
  const n = DATES.length;
  return (
    <div className="relative mx-auto" style={{ width: 90, height: 90 }}>
      <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(255,255,255,0.1)' }} />
      {DATES.map((d, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        return (
          <button key={d.key} onClick={() => setSel(i)} className="absolute rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{ left: 45 + 34 * Math.cos(angle) - 11, top: 45 + 34 * Math.sin(angle) - 11, width: 22, height: 22, background: sel === i ? `rgba(${BLUE},1)` : 'rgba(255,255,255,0.08)', color: sel === i ? '#fff' : '#94a3b8' }}>
            {d.day}
          </button>
        );
      })}
      <motion.div className="absolute origin-bottom" style={{ left: 44, top: 45, width: 2, height: 30, background: `rgba(${BLUE},0.8)`, transformOrigin: '1px 0px' }}
        animate={{ rotate: (sel / n) * 360 }} transition={{ type: 'spring', stiffness: 200 }} />
    </div>
  );
}

// 24. Weather-forecast row
function V24() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-3 justify-center">
      {DATES.slice(0, 4).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex flex-col items-center gap-1">
          <span className="text-[9px] text-slate-400">{d.dow}</span>
          <span className="text-lg">{d.finished === d.total ? '☀️' : d.finished > 0 ? '⛅' : '☁️'}</span>
          <span className="text-[10px] font-bold" style={{ color: sel === i ? `rgba(${BLUE},1)` : '#fff' }}>{d.day}</span>
        </button>
      ))}
    </div>
  );
}

// 25. Boarding pass strip
function V25() {
  const [sel, setSel] = useSel(0);
  const d = DATES[sel];
  return (
    <div className="rounded-xl overflow-hidden mx-auto" style={{ width: 200, background: `rgba(${BLUE},0.15)`, border: `1px solid rgba(${BLUE},0.4)` }}>
      <div className="flex justify-between items-center px-3 py-2">
        <div><div className="text-[8px] text-slate-400">GATE</div><div className="text-white text-sm font-black">{d.dow}</div></div>
        <div className="text-center"><div className="text-[8px] text-slate-400">DAY</div><div className="text-white text-lg font-black">{d.day}</div></div>
      </div>
      <div className="h-px" style={{ borderTop: '1px dashed rgba(255,255,255,0.25)' }} />
      <div className="flex gap-0.5 px-3 py-1.5 justify-center">
        {Array.from({ length: 16 }).map((_, i) => <span key={i} style={{ width: 2, height: i % 3 === 0 ? 12 : 8, background: 'rgba(255,255,255,0.3)' }} />)}
      </div>
      <div className="flex gap-1 px-2 pb-2 justify-center">
        {DATES.map((dd, i) => <button key={dd.key} onClick={() => setSel(i)} className="w-2 h-2 rounded-full" style={{ background: sel === i ? '#fff' : 'rgba(255,255,255,0.25)' }} />)}
      </div>
    </div>
  );
}

// 26. Metro line stops
function V26() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="relative px-2" dir="ltr">
      <div className="absolute top-4 left-2 right-2 h-1 rounded-full" style={{ background: `rgba(${BLUE},0.4)` }} />
      <div className="flex justify-between relative pt-2">
        {DATES.map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)} className="flex flex-col items-center gap-1">
            <span className="rounded-full" style={{ width: sel === i ? 16 : 10, height: sel === i ? 16 : 10, background: '#050a12', border: `3px solid ${sel === i ? '#fff' : `rgba(${BLUE},0.8)`}` }} />
            <span className="text-[8px] text-slate-400">{d.day}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// 27. Neon sign text
function V27() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-3 justify-center">
      {DATES.slice(0, 3).map((d, i) => (
        <motion.button key={d.key} onClick={() => setSel(i)}
          animate={sel === i ? { opacity: [1, 0.7, 1] } : {}} transition={{ duration: 1.6, repeat: Infinity }}
          className="text-lg font-black" style={{ color: sel === i ? '#f472b6' : '#475569', textShadow: sel === i ? '0 0 8px #f472b6, 0 0 18px #ec4899' : 'none' }}>
          {d.day}
        </motion.button>
      ))}
    </div>
  );
}

// 28. Parallax depth stack
function V28() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="relative flex justify-center items-center" style={{ height: 60 }}>
      {DATES.slice(0, 3).map((d, i) => {
        const dist = Math.abs(i - sel);
        return (
          <button key={d.key} onClick={() => setSel(i)} className="absolute flex flex-col items-center justify-center rounded-xl"
            style={{ width: 48, height: 48, left: `calc(50% + ${(i - sel) * 30}px - 24px)`, zIndex: 10 - dist, filter: dist ? `blur(${dist}px)` : 'none', opacity: dist ? 0.5 : 1, background: 'rgba(255,255,255,0.08)', transition: 'all 0.3s' }}>
            <span className="text-[8px] text-slate-400">{d.dow}</span>
            <span className="text-white text-sm font-bold">{d.day}</span>
          </button>
        );
      })}
    </div>
  );
}

// 29. Level-select path map
function V29() {
  const [sel, setSel] = useSel(0);
  const ys = [40, 15, 40, 15, 40, 15];
  return (
    <div className="relative" style={{ height: 60 }}>
      <svg width="100%" height="60" className="absolute inset-0"><path d={`M20,${ys[0]} ${DATES.map((_, i) => `L${20 + i * 45},${ys[i]}`).join(' ')}`} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} strokeDasharray="4 4" /></svg>
      {DATES.map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="absolute rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{ left: 20 + i * 45 - 12, top: ys[i] - 12, width: 24, height: 24, background: sel === i ? `rgba(${BLUE},1)` : 'rgba(255,255,255,0.12)', color: '#fff' }}>
          {d.day}
        </button>
      ))}
    </div>
  );
}

// 30. LED digital display with arrows
function V30() {
  const [sel, setSel] = useSel(0);
  const d = DATES[sel];
  return (
    <div className="flex items-center justify-center gap-3">
      <button onClick={() => setSel((s) => Math.max(0, s - 1))} className="text-slate-400">◀</button>
      <div className="px-3 py-1.5 rounded" style={{ background: '#000' }}>
        <span className="font-bold text-xl tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif", color: '#ff3b30', textShadow: '0 0 8px rgba(255,59,48,0.8)' }}>{String(d.day).padStart(2, '0')}</span>
      </div>
      <button onClick={() => setSel((s) => Math.min(DATES.length - 1, s + 1))} className="text-slate-400">▶</button>
    </div>
  );
}

// 31. Jersey number tags
function V31() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-2 justify-center">
      {DATES.slice(0, 4).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="w-10 h-12 rounded flex items-center justify-center"
          style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.08)', clipPath: 'polygon(20% 0,80% 0,100% 20%,100% 100%,0 100%,0 20%)' }}>
          <span className="text-white font-black text-base">{d.day}</span>
        </button>
      ))}
    </div>
  );
}

// 32. Spinning vinyl record
function V32() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex items-center gap-3 justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="rounded-full flex items-center justify-center" style={{ width: 50, height: 50, background: 'repeating-radial-gradient(circle, #222 0px, #222 2px, #000 3px, #000 5px)' }}>
        <div className="w-4 h-4 rounded-full" style={{ background: `rgba(${BLUE},1)` }} />
      </motion.div>
      <div className="flex flex-col gap-1">
        {DATES.slice(0, 3).map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)} className="text-[10px] text-right" style={{ color: sel === i ? '#fff' : '#64748b', fontWeight: sel === i ? 700 : 400 }}>{d.dow} {d.day}</button>
        ))}
      </div>
    </div>
  );
}

// 33. Folder tab dividers
function V33() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex items-end gap-1">
      {DATES.slice(0, 4).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="rounded-t-lg flex items-center justify-center px-2"
          style={{ height: sel === i ? 44 : 34, background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.08)' }}>
          <span className="text-[10px] font-bold" style={{ color: sel === i ? '#fff' : '#94a3b8', writingMode: 'vertical-rl' }}>{d.dow} {d.day}</span>
        </button>
      ))}
    </div>
  );
}

// 34. Bubble cluster — size reflects match count
function V34() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex items-center gap-2 justify-center flex-wrap">
      {DATES.map((d, i) => (
        <motion.button key={d.key} onClick={() => setSel(i)} animate={{ y: [0, -4, 0] }} transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 22 + d.total * 3, height: 22 + d.total * 3, background: sel === i ? `rgba(${BLUE},0.5)` : 'rgba(255,255,255,0.08)', border: sel === i ? `1px solid rgba(${BLUE},0.8)` : 'none' }}>
          <span className="text-white text-[10px] font-bold">{d.day}</span>
        </motion.button>
      ))}
    </div>
  );
}

// 35. Chat-bubble style
function V35() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex flex-col gap-1.5 items-end">
      {DATES.slice(0, 3).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="px-3 py-1.5 rounded-2xl rounded-tl-sm text-[10px] font-bold"
          style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.08)', color: sel === i ? '#fff' : '#94a3b8' }}>
          {d.dow}, {d.day}
        </button>
      ))}
    </div>
  );
}

// 36. Barcode strip
function V36() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-3 justify-center">
      {DATES.slice(0, 3).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex flex-col items-center gap-1 px-2 py-1.5 rounded" style={{ background: sel === i ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
          <div className="flex gap-px">{Array.from({ length: 8 }).map((_, b) => <span key={b} style={{ width: 1.5, height: 14, background: (b + d.day) % 3 === 0 ? '#334155' : '#fff' }} />)}</div>
          <span className="text-[8px] text-slate-400">{d.day}</span>
        </button>
      ))}
    </div>
  );
}

// 37. Jersey rack — hanging tags, tap pulls one forward
function V37() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-2 justify-center items-start">
      {DATES.slice(0, 4).map((d, i) => (
        <motion.button key={d.key} onClick={() => setSel(i)} animate={{ y: sel === i ? 6 : 0, rotate: sel === i ? 0 : -3 + i * 2 }}
          className="w-9 h-12 rounded-b-lg flex items-center justify-center" style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.08)', borderTop: '3px solid #64748b' }}>
          <span className="text-white text-[11px] font-black">{d.day}</span>
        </motion.button>
      ))}
    </div>
  );
}

// 38. Activity rings cluster (concentric)
function V38() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex items-center gap-3 justify-center">
      <svg width="70" height="70">
        {DATES.slice(0, 3).map((d, i) => {
          const r = 30 - i * 9, c = 2 * Math.PI * r, pct = d.total ? d.finished / d.total : 0;
          return (
            <g key={d.key} transform="translate(35,35) rotate(-90)">
              <circle r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
              <circle r={r} fill="none" stroke={colorFor(TEAMS[i])} strokeWidth={5} strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
      <div className="flex flex-col gap-1">
        {DATES.slice(0, 3).map((d, i) => <button key={d.key} onClick={() => setSel(i)} className="text-[9px] text-right" style={{ color: sel === i ? '#fff' : '#64748b' }}>● {d.dow} {d.day}</button>)}
      </div>
    </div>
  );
}

// 39. Card stack with peek (top card full, others peek at edge)
function V39() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="relative mx-auto" style={{ width: 100, height: 55 }}>
      {DATES.slice(0, 3).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="absolute rounded-xl flex items-center justify-center"
          style={{ width: 90, height: 48, left: i * 8, top: i * 4, zIndex: 3 - i, background: sel === i ? `rgba(${BLUE},0.9)` : '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
          {i === sel && <span className="text-white text-sm font-bold">{DATES[sel].dow} {DATES[sel].day}</span>}
        </button>
      ))}
    </div>
  );
}

// 40. Sound equalizer bars
function V40() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-2 justify-center">
      {DATES.slice(0, 4).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex items-end gap-0.5" style={{ height: 34 }}>
          {[6, 14, 22, 12].map((h, b) => (
            <motion.span key={b} animate={sel === i ? { height: [h, h + 8, h] } : { height: h }} transition={{ duration: 0.8, repeat: sel === i ? Infinity : 0, delay: b * 0.1 }}
              style={{ width: 3, background: sel === i ? `rgba(${BLUE},1)` : '#334155', borderRadius: 2 }} />
          ))}
        </button>
      ))}
    </div>
  );
}

// 41. Origami fold reveal
function V41() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex gap-2 justify-center" style={{ perspective: 300 }}>
      {DATES.slice(0, 3).map((d, i) => (
        <motion.button key={d.key} onClick={() => setSel(i)} initial={{ rotateX: -60 }} animate={{ rotateX: 0 }} style={{ transformOrigin: 'top' }}
          className="px-3 py-2 rounded-lg" style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.08)' }}>
          <span className="text-[11px] font-bold" style={{ color: sel === i ? '#fff' : '#94a3b8' }}>{d.dow} {d.day}</span>
        </motion.button>
      ))}
    </div>
  );
}

// 42. Race track laps
function V42() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="relative mx-auto" style={{ width: 140, height: 60 }}>
      <div className="absolute inset-0 rounded-full" style={{ border: '6px solid rgba(255,255,255,0.08)' }} />
      {DATES.map((d, i) => {
        const angle = (i / DATES.length) * Math.PI * 2;
        return (
          <button key={d.key} onClick={() => setSel(i)} className="absolute rounded-full flex items-center justify-center text-[8px] font-bold"
            style={{ left: 70 + 64 * Math.cos(angle) - 10, top: 30 + 24 * Math.sin(angle) - 10, width: 20, height: 20, background: sel === i ? '#facc15' : '#334155', color: sel === i ? '#000' : '#fff' }}>
            {d.day}
          </button>
        );
      })}
    </div>
  );
}

// 43. Interlocking puzzle-piece tabs
function V43() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex justify-center">
      {DATES.slice(0, 4).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="w-10 h-10 flex items-center justify-center relative"
          style={{ background: sel === i ? `rgba(${BLUE},0.9)` : 'rgba(255,255,255,0.08)', marginRight: i < 3 ? -4 : 0, borderRadius: '30% 30% 30% 30% / 20% 20% 20% 20%', zIndex: sel === i ? 2 : 1 }}>
          <span className="text-white text-[11px] font-bold">{d.day}</span>
        </button>
      ))}
    </div>
  );
}

// 44. Constellation — stars connected by faint lines
function V44() {
  const [sel, setSel] = useSel(0);
  const pos = [{ x: 15, y: 40 }, { x: 45, y: 12 }, { x: 75, y: 35 }, { x: 55, y: 55 }, { x: 25, y: 60 }, { x: 90, y: 55 }];
  return (
    <div className="relative mx-auto" style={{ width: 100, height: 65 }}>
      <svg width="100" height="65" className="absolute inset-0">
        {pos.slice(1).map((p, i) => <line key={i} x1={pos[i].x} y1={pos[i].y} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />)}
      </svg>
      {DATES.map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="absolute rounded-full flex items-center justify-center text-[8px] font-bold"
          style={{ left: pos[i].x - 9, top: pos[i].y - 9, width: 18, height: 18, background: sel === i ? '#facc15' : 'rgba(255,255,255,0.15)', color: sel === i ? '#000' : '#fff', boxShadow: sel === i ? '0 0 8px #facc15' : 'none' }}>
          {d.day}
        </button>
      ))}
    </div>
  );
}

// 45. Elevator floor buttons
function V45() {
  const [sel, setSel] = useSel(0);
  return (
    <div className="flex flex-col gap-1 mx-auto" style={{ width: 60 }}>
      {DATES.slice(0, 4).map((d, i) => (
        <button key={d.key} onClick={() => setSel(i)} className="flex items-center justify-between px-2 py-1 rounded" style={{ background: sel === i ? '#facc15' : 'rgba(255,255,255,0.08)' }}>
          <span className="text-[9px] font-bold" style={{ color: sel === i ? '#000' : '#94a3b8' }}>{d.dow}</span>
          <span className="text-xs font-black" style={{ color: sel === i ? '#000' : '#fff' }}>{d.day}</span>
        </button>
      ))}
    </div>
  );
}

const VARIANTS = [
  ['1. פס-רכבת (timeline)', 'נקודות על ציר מחבר, הנוכחית מוארת ומוגדלת', V1],
  ['2. בקרת מקטעים נגללת', 'הדגשה שנעה חלק בין המקטעים', V2],
  ['3. צ׳יפים + פס התקדמות', 'פס דק במקום טבעת — קומפקטי יותר', V3],
  ['4. תצוגת קבוצות', 'לוגואים זעירים במקום ספרות — זיהוי לפי משחק', V4],
  ['5. קיבוץ לפי חודש', 'תווית חודש מעל כל אשכול תאריכים', V5],
  ['6. כרטיס-כניסה (Ticket)', 'קצה מחורר בסגנון כרטיס אצטדיון', V6],
  ['7. חוגה מעגלית', 'תאריכים מסודרים במעגל סביב מרכז', V7],
  ['8. כרטיסים מתהפכים', 'טאפ הופך בין תאריך להתקדמות', V8],
  ['9. רצועת חום', 'עוצמת צבע משקפת קרבה להיום', V9],
  ['10. ערימת קלפים', 'תאריכים כמניפת קלפים, טאפ מביא לחזית', V10],
  ['11. קשת מד-מהירות', 'כל הימים כמקטעים בקשת חצי-עיגול אחת', V11],
  ['12. פס צד אנכי', 'רכבת אנכית דקה בצד במקום שורה אופקית', V12],
  ['13. לוח שנה מוטמע קבוע', 'גריד מיני תמיד גלוי, לא פופאפ', V13],
  ['14. אייקוני כדורגל', 'ספירת משחקים בכדורים ⚽ במקום מספרים', V14],
  ['15. תגי ספירה לאחור', '"היום"/"מחר"/"בעוד N ימים" במקום תאריך יבש', V15],
  ['16. צביעה לפי סטטוס', 'צבע רקע מלא מקודד: ירוק=הסתיים, זהב=קרוב', V16],
  ['17. תגי-מדבקה עגולים', 'סגנון אייקון אפליקציה, פינות מעוגלות מאוד', V17],
  ['18. גיבור אחד (Hero swipe)', 'כרטיס גדול אחד, נקודות עמוד מתחת', V18],
  ['19. אקורדיון חודשים', 'קיבוץ מתקפל, פותחים חודש כדי לראות ימים', V19],
  ['20. רכבת תחתית קבועה', 'הפעיל תמיד במרכז, השאר "נעים" סביבו', V20],
  ['21. תרשים עמודות', 'גובה העמודה משקף כמות משחקים', V21],
  ['22. פאי/דונאט', 'עיגול מחולק לפרוסות שוות, כל פרוסה תאריך', V22],
  ['23. חוגת טלפון', 'מחוג דקורטיבי מצביע על התאריך שנבחר', V23],
  ['24. תחזית מזג אוויר', 'אייקון מצב + יום, בסגנון אפליקציית תחזית', V24],
  ['25. כרטיס עלייה למטוס', 'עיצוב Boarding Pass מלא עם "ברקוד"', V25],
  ['26. תחנות רכבת תחתית', 'תאריכים כתחנות על קו צבעוני', V26],
  ['27. שלט ניאון', 'טקסט זוהר מהבהב עבור התאריך הפעיל', V27],
  ['28. מחסנית בעומק (Parallax)', 'כרטיסים בעומק — הקרוב חד, הרחוקים מטושטשים', V28],
  ['29. מפת שלבים', 'נקודות על שביל מפותל, כמו מפת רמות במשחק', V29],
  ['30. תצוגה דיגיטלית LED', 'מספר היום במסך 7-segment עם חצי דפדוף', V30],
  ['31. תגי מספר חולצה', 'תאריכים כמספרי חולצת שחקן', V31],
  ['32. תקליט מסתובב', 'תקליט מונפש מסתובב לצד רשימת תאריכים', V32],
  ['33. מפרידי תיקייה', 'לשוניות בולטות בגובה משתנה כמו בתיקייה פיזית', V33],
  ['34. אשכול בועות', 'בועות בגדלים משתנים לפי כמות משחקים, מרחפות', V34],
  ['35. בועות צ׳אט', 'כל תאריך בבועת הודעה כמו שיחה', V35],
  ['36. פס ברקוד', 'קווים אנכיים בסגנון ברקוד כרטיס', V36],
  ['37. מתלה חולצות', 'תאריכים תלויים על מתלה, טאפ "מושך" קדימה', V37],
  ['38. טבעות פעילות', 'טבעות מרוכזות (Apple Watch style) לכמה תאריכים יחד', V38],
  ['39. ערימת קלפים עם הצצה', 'הקלף העליון גלוי לגמרי, הבאים מציצים בקצה', V39],
  ['40. אקולייזר סאונד', 'פסים מונפשים כמו אקולייזר', V40],
  ['41. קיפול אוריגמי', 'כל תאריך "נפתח" בכניסתו כמו קיפול נייר', V41],
  ['42. מסלול מרוץ', 'תאריכים כדגלוני ליפ על מסלול מעוקל', V42],
  ['43. חלקי פאזל', 'תאריכים כחלקי פאזל נעולים זה בזה', V43],
  ['44. מפת כוכבים', 'תאריכים ככוכבים מחוברים בקווים דקים', V44],
  ['45. כפתורי מעלית', 'תאריכים כלוח כפתורי קומות מעלית', V45],
];

export default function AdminDateTabsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 45 רעיונות לתצוגת התאריכים</h2>
        <p className="text-slate-500 text-sm">כולן חיות ולחיצות, דאטה קבוע לדוגמה. כלי דמו בלבד — לא משפיע על Predictions.jsx.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VARIANTS.map(([label, desc, Comp]) => (
          <Frame key={label} label={label} desc={desc}><Comp /></Frame>
        ))}
      </div>
    </div>
  );
}
