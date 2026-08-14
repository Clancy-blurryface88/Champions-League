import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronUp, ChevronDown, Plus, Minus, X, Trophy } from 'lucide-react';

// Demo-only: 50 alternative ways to pick a football match score (home/away
// goals), for design exploration in the admin panel. Mock, self-contained
// local state per variant, fully interactive. Doesn't touch ScoreInput.jsx
// or Predictions.jsx — this is a design gallery only.

const HOME = '#097adc';
const AWAY = '#8b5cf6';

function clamp(v, min = 0, max = 9) { return Math.max(min, Math.min(max, v)); }

function useReplay() {
  const [key, setKey] = useState(0);
  return [key, () => setKey((k) => k + 1)];
}

function Frame({ label, desc, children }) {
  const [replay, bump] = useReplay();
  return (
    <div className="bg-slate-800/40 border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
      <div className="rounded-xl overflow-hidden p-3 flex items-center justify-center" style={{ background: '#050a12', minHeight: 150 }}>
        {children(replay)}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0"><div className="text-white text-xs font-bold">{label}</div><div className="text-slate-500 text-[10px]">{desc}</div></div>
        <button onClick={bump} className="flex-shrink-0 flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-full bg-white/6 border border-white/10 text-slate-300 hover:bg-white/12">
          <RefreshCw className="w-3 h-3" /> הצג שוב
        </button>
      </div>
    </div>
  );
}

// ---- shared primitives ----

function StepBtn({ onClick, children, size = 28, color = HOME, disabled }) {
  return (
    <motion.button whileTap={{ scale: 0.85 }} onClick={onClick} disabled={disabled}
      className="flex items-center justify-center rounded-full text-white disabled:opacity-30"
      style={{ width: size, height: size, background: `${color}33`, border: `1px solid ${color}88` }}>
      {children}
    </motion.button>
  );
}

function NumberTile({ value, size = 50 }) {
  return (
    <div className="rounded-xl flex items-center justify-center font-bold text-white select-none"
      style={{ width: size, height: size * 1.15, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', fontSize: size * 0.5, fontFamily: "'Bebas Neue', sans-serif" }}>
      {value === undefined ? '?' : value}
    </div>
  );
}

// generic vertical/horizontal pointer-drag-to-value track
function useLinearDrag(onChange, { vertical = false, max = 6, invert = false, raw = false } = {}) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    let rel = vertical ? (e.clientY - rect.top) / rect.height : (e.clientX - rect.left) / rect.width;
    rel = clamp(rel, 0, 1);
    if (invert) rel = 1 - rel;
    onChange(raw ? Math.round(rel * 100) : Math.round(rel * max));
  };
  const handlers = {
    onPointerDown: (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); move(e); },
    onPointerMove: (e) => { if (e.buttons === 1) move(e); },
  };
  return [ref, handlers];
}

// generic circular/angle drag-to-value (full 360 dial, or bottom-pivot semicircle gauge)
function useAngleDrag(onChange, { max = 6, gauge = false } = {}) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    if (gauge) {
      const cx = rect.left + rect.width / 2, cy = rect.bottom;
      let ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
      ang = clamp(ang, -180, 0);
      onChange(Math.round((ang + 180) / 180 * max));
    } else {
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      let ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI + 90;
      if (ang < 0) ang += 360;
      onChange(Math.round(ang / 360 * max));
    }
  };
  const handlers = {
    onPointerDown: (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); move(e); },
    onPointerMove: (e) => { if (e.buttons === 1) move(e); },
  };
  return [ref, handlers];
}

function useLongPress(fn) {
  const ref = useRef(null);
  const start = () => {
    fn();
    let delay = 320;
    const tick = () => { fn(); delay = Math.max(40, delay * 0.72); ref.current = setTimeout(tick, delay); };
    ref.current = setTimeout(tick, delay);
  };
  const stop = () => clearTimeout(ref.current);
  return { onMouseDown: start, onMouseUp: stop, onMouseLeave: stop, onTouchStart: start, onTouchEnd: stop };
}

function MiniScoreInput({ value, onChange, color }) {
  const inc = () => onChange((value ?? -1) + 1);
  const dec = () => { if (value === undefined || value === 0) return; onChange(value - 1); };
  const disp = value === undefined ? '?' : value;
  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={inc} className="hover:opacity-70"><ChevronUp className="w-5 h-5" style={{ color }} strokeWidth={2.5} /></button>
      <div className="w-11 h-16 flex items-center justify-center rounded-2xl relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}>
        <AnimatePresence mode="popLayout">
          <motion.span key={disp} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.24 }} style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className={`text-4xl ${value === undefined ? 'text-slate-600' : 'text-white'}`}>{disp}</motion.span>
        </AnimatePresence>
      </div>
      <button onClick={dec} disabled={!value} className="hover:opacity-70 disabled:opacity-30"><ChevronDown className="w-5 h-5" style={{ color }} strokeWidth={2.5} /></button>
    </div>
  );
}

// ================= Group A — Steppers (1-10) =================

// 1. Baseline — mirrors the real ScoreInput.jsx
function V1() {
  const [a, setA] = useState(undefined);
  const [b, setB] = useState(undefined);
  return (
    <div className="flex items-center gap-4">
      <MiniScoreInput value={a} onChange={setA} color="#facc15" />
      <span className="text-slate-600 text-xl font-bold">:</span>
      <MiniScoreInput value={b} onChange={setB} color="#facc15" />
    </div>
  );
}

// 2. Horizontal pill stepper
function V2() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const Row = (v, set, color) => (
    <div className="flex items-center gap-1.5 rounded-full px-1.5 py-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
      <StepBtn onClick={() => set(clamp(v - 1, 0, 9))} color={color}><Minus className="w-3.5 h-3.5" /></StepBtn>
      <span className="w-6 text-center text-white font-bold text-lg">{v}</span>
      <StepBtn onClick={() => set(clamp(v + 1, 0, 9))} color={color}><Plus className="w-3.5 h-3.5" /></StepBtn>
    </div>
  );
  return <div className="flex flex-col gap-3">{Row(a, setA, HOME)}{Row(b, setB, AWAY)}</div>;
}

// 3. Big circular +/- flanking a bold number
function V3() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const Item = (v, set, color) => (
    <div className="flex items-center gap-2">
      <StepBtn onClick={() => set(clamp(v + 1, 0, 9))} size={36} color={color}><Plus className="w-4 h-4" /></StepBtn>
      <span className="text-3xl font-bold text-white w-8 text-center" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{v}</span>
      <StepBtn onClick={() => set(clamp(v - 1, 0, 9))} size={36} color={color}><Minus className="w-4 h-4" /></StepBtn>
    </div>
  );
  return <div className="flex flex-col gap-3">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 4. Compact inline stepper — mini +/- badges on tile corners
function V4() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const Item = (v, set, color) => (
    <div className="relative">
      <NumberTile value={v} size={50} />
      <button onClick={() => set(clamp(v + 1, 0, 9))} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: color }}>+</button>
      <button onClick={() => set(clamp(v - 1, 0, 9))} className="absolute -bottom-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: color }}>−</button>
    </div>
  );
  return <div className="flex items-center gap-5">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 5. Long-press accelerating stepper
function V5() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const incA = useLongPress(() => setA(x => clamp(x + 1, 0, 20)));
  const decA = useLongPress(() => setA(x => clamp(x - 1, 0, 20)));
  const incB = useLongPress(() => setB(x => clamp(x + 1, 0, 20)));
  const decB = useLongPress(() => setB(x => clamp(x - 1, 0, 20)));
  const Col = (v, inc, dec, color) => (
    <div className="flex flex-col items-center gap-1.5">
      <button {...inc} className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: `${color}33`, border: `1px solid ${color}` }}>+</button>
      <span className="text-2xl font-bold text-white">{v}</span>
      <button {...dec} className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: `${color}33`, border: `1px solid ${color}` }}>−</button>
    </div>
  );
  return <div className="flex items-center gap-5">{Col(a, incA, decA, HOME)}{Col(b, incB, decB, AWAY)}</div>;
}

// 6. Split-tap button — top half +1, bottom half -1
function V6() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const Item = (v, set, color) => (
    <div className="flex items-center gap-2">
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${color}55`, width: 34, height: 60 }}>
        <button onClick={() => set(clamp(v + 1, 0, 9))} className="w-full h-1/2 flex items-center justify-center hover:opacity-70" style={{ background: `${color}22` }}><Plus className="w-3.5 h-3.5" style={{ color }} /></button>
        <div style={{ height: 1, background: `${color}55` }} />
        <button onClick={() => set(clamp(v - 1, 0, 9))} className="w-full h-1/2 flex items-center justify-center hover:opacity-70" style={{ background: `${color}11` }}><Minus className="w-3.5 h-3.5" style={{ color }} /></button>
      </div>
      <span className="text-3xl font-bold text-white w-7 text-center">{v}</span>
    </div>
  );
  return <div className="flex flex-col gap-3">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 7. Mini ruler / tick-mark stepper
function V7() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const Item = (v, set, color) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xl font-bold text-white">{v}</span>
      <div className="flex items-end gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <button key={i} onClick={() => set(i)} className="rounded-full" style={{ width: 4, height: i === v ? 18 : 10, background: i <= v ? color : 'rgba(255,255,255,0.15)', transition: 'all .15s' }} />
        ))}
      </div>
    </div>
  );
  return <div className="flex items-center gap-6">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 8. Native-styled number input, jersey-number bold font
function V8() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const Item = (v, set, color) => (
    <input type="number" min={0} max={20} value={v}
      onChange={e => set(clamp(parseInt(e.target.value || '0', 10), 0, 20))}
      className="w-16 h-14 rounded-lg text-center text-2xl font-black text-white outline-none"
      style={{ background: 'rgba(255,255,255,0.06)', border: `2px solid ${color}`, fontFamily: "'Bebas Neue', sans-serif" }} />
  );
  return <div className="flex items-center gap-4">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 9. Two stacked arrows very close, springy bounce on tap
function V9() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const Col = (v, set, color) => (
    <div className="flex flex-col items-center">
      <motion.button whileTap={{ scale: 0.7 }} onClick={() => set(clamp(v + 1, 0, 9))} className="p-0.5"><ChevronUp className="w-6 h-6" style={{ color }} /></motion.button>
      <motion.span key={v} initial={{ scale: 1.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }} className="text-3xl font-bold text-white my-0.5">{v}</motion.span>
      <motion.button whileTap={{ scale: 0.7 }} onClick={() => set(clamp(v - 1, 0, 9))} className="p-0.5"><ChevronDown className="w-6 h-6" style={{ color }} /></motion.button>
    </div>
  );
  return <div className="flex items-center gap-5">{Col(a, setA, HOME)}{Col(b, setB, AWAY)}</div>;
}

// 10. Score badge with tap-streak combo counter
function V10() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const [streakA, setStreakA] = useState(0); const timerA = useRef(null);
  const [streakB, setStreakB] = useState(0); const timerB = useRef(null);
  const tap = (set, setStreak, timer, d) => {
    set(x => clamp(x + d, 0, 9));
    setStreak(s => s + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStreak(0), 900);
  };
  const Col = (v, streak, onTap, onReset, color) => (
    <div className="relative flex flex-col items-center gap-1.5">
      <AnimatePresence>{streak > 1 && <motion.span initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -6 }} exit={{ opacity: 0 }} className="absolute -top-4 text-[10px] font-bold" style={{ color }}>x{streak}</motion.span>}</AnimatePresence>
      <button onClick={onTap} className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg" style={{ background: color }}>{v}</button>
      <button onClick={onReset} className="text-[10px] text-slate-400 hover:text-white">−1</button>
    </div>
  );
  return (
    <div className="flex items-center gap-6">
      {Col(a, streakA, () => tap(setA, setStreakA, timerA, 1), () => tap(setA, setStreakA, timerA, -1), HOME)}
      {Col(b, streakB, () => tap(setB, setStreakB, timerB, 1), () => tap(setB, setStreakB, timerB, -1), AWAY)}
    </div>
  );
}

// ================= Group B — Direct selection (11-20) =================

// 11. Chip row 0 1 2 3 4 5+ (OTP-style)
function V11() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const Item = (v, set, color) => (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => set(n)} className="w-6 h-8 rounded-md text-xs font-bold flex items-center justify-center text-white"
          style={{ background: v === n ? color : 'rgba(255,255,255,0.06)', border: `1px solid ${v === n ? color : 'rgba(255,255,255,0.12)'}` }}>
          {n === 5 ? '5+' : n}
        </button>
      ))}
    </div>
  );
  return <div className="flex flex-col gap-2.5">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 12. Grid picker — tap one cell sets both numbers
function V12() {
  const [a, setA] = useState(1), [b, setB] = useState(1);
  const N = 6;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-white font-bold text-sm">{a} - {b}</div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${N},1fr)` }}>
        {Array.from({ length: N * N }).map((_, i) => {
          const r = Math.floor(i / N), c = i % N;
          const sel = r === a && c === b;
          return <button key={i} onClick={() => { setA(r); setB(c); }} className="rounded" style={{ width: 16, height: 16, background: sel ? HOME : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />;
        })}
      </div>
    </div>
  );
}

// 13. Preset quick-pick buttons for common scorelines
function V13() {
  const [a, setA] = useState(1), [b, setB] = useState(0);
  const presets = [[1, 0], [2, 1], [1, 1], [0, 0], [2, 0], [3, 1]];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-white font-bold text-2xl">{a} : {b}</div>
      <div className="grid grid-cols-3 gap-1.5">
        {presets.map(([x, y], i) => (
          <button key={i} onClick={() => { setA(x); setB(y); }} className="px-2 py-1 rounded-lg text-xs font-bold text-white"
            style={{ background: a === x && b === y ? HOME : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>{x}-{y}</button>
        ))}
      </div>
    </div>
  );
}

// 14. Vertical scrollable list 0-5
function V14() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const Item = (v, set, color) => (
    <div className="rounded-lg overflow-y-auto" style={{ height: 80, width: 34, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
      {[0, 1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => set(n)} className="w-full py-1.5 text-sm font-bold" style={{ color: v === n ? '#fff' : '#64748b', background: v === n ? color : 'transparent' }}>{n}</button>
      ))}
    </div>
  );
  return <div className="flex items-center gap-4">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 15. Dice-pip style counter
function V15() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set, color) => (
    <div className="flex gap-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <button key={i} onClick={() => set(i + 1 === v ? i : i + 1)} className="rounded-full" style={{ width: 12, height: 12, background: i < v ? color : 'rgba(255,255,255,0.12)' }} />
      ))}
    </div>
  );
  return <div className="flex flex-col gap-3">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 16. Football-icon tally — tap adds ⚽, X clears
function V16() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set) => (
    <div className="flex items-center gap-1.5">
      <button onClick={() => set(clamp(v + 1, 0, 9))} className="flex gap-0.5 flex-wrap max-w-[70px]">
        {Array.from({ length: v }).map((_, i) => <span key={i} style={{ fontSize: 12 }}>⚽</span>)}
        {v === 0 && <span className="text-slate-500 text-[10px]">הקש להוספה</span>}
      </button>
      <button onClick={() => set(0)} className="text-slate-500 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
  return <div className="flex flex-col gap-2">{Item(a, setA)}{Item(b, setB)}</div>;
}

// 17. Star-rating style with football icons
function V17() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set) => (
    <div className="flex gap-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <button key={i} onClick={() => set(i + 1)}>
          <span style={{ fontSize: 16, filter: i < v ? 'none' : 'grayscale(1) opacity(0.3)' }}>⚽</span>
        </button>
      ))}
    </div>
  );
  return <div className="flex flex-col gap-2.5">{Item(a, setA)}{Item(b, setB)}</div>;
}

// 18. Horizontal scrollable toggle-pill group 0-9
function V18() {
  const [a, setA] = useState(1), [b, setB] = useState(0);
  const Item = (v, set, color) => (
    <div className="flex gap-1 overflow-x-auto max-w-[140px] pb-1">
      {Array.from({ length: 10 }).map((_, n) => (
        <button key={n} onClick={() => set(n)} className="flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold" style={{ background: v === n ? color : 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>{n}</button>
      ))}
    </div>
  );
  return <div className="flex flex-col gap-2.5">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 19. Compact dual segmented control — home + away in one widget
function V19() {
  const [a, setA] = useState(1), [b, setB] = useState(1);
  return (
    <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
      <div className="flex flex-col">{[0, 1, 2, 3].map(n => (
        <button key={n} onClick={() => setA(n)} className="w-9 h-8 text-xs font-bold" style={{ background: a === n ? HOME : 'transparent', color: '#fff' }}>{n}</button>
      ))}</div>
      <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
      <div className="flex flex-col">{[0, 1, 2, 3].map(n => (
        <button key={n} onClick={() => setB(n)} className="w-9 h-8 text-xs font-bold" style={{ background: b === n ? AWAY : 'transparent', color: '#fff' }}>{n}</button>
      ))}</div>
    </div>
  );
}

// 20. Numeric keypad — type score like a PIN pad
function V20() {
  const [a, setA] = useState(undefined), [b, setB] = useState(undefined);
  const [side, setSide] = useState('a');
  const press = (n) => { if (side === 'a') { setA(n); setSide('b'); } else { setB(n); setSide('a'); } };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-white font-bold text-xl">{a ?? '_'} : {b ?? '_'}</div>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <button key={i} onClick={() => press(i + 1)} className="w-7 h-7 rounded-md text-xs font-bold text-white" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>{i + 1}</button>
        ))}
        <button onClick={() => press(0)} className="w-7 h-7 rounded-md text-xs font-bold text-white col-start-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>0</button>
      </div>
      <span className="text-[9px] text-slate-500">מקליד {side === 'a' ? 'קבוצת בית' : 'קבוצת חוץ'}</span>
    </div>
  );
}

// ================= Group C — Drag / gesture based (21-30) =================

// 21. Vertical slider (volume-style)
function V21() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const [refA, handA] = useLinearDrag(setA, { vertical: true, max: 6, invert: true });
  const [refB, handB] = useLinearDrag(setB, { vertical: true, max: 6, invert: true });
  const Bar = (ref, handlers, v, color) => (
    <div ref={ref} {...handlers} className="relative rounded-full" style={{ width: 10, height: 100, background: 'rgba(255,255,255,0.1)', touchAction: 'none' }}>
      <div className="absolute rounded-full" style={{ left: 0, right: 0, bottom: 0, height: `${(v / 6) * 100}%`, background: color }} />
      <div className="absolute rounded-full shadow" style={{ left: -7, width: 24, height: 24, background: '#fff', bottom: `calc(${(v / 6) * 100}% - 12px)` }} />
      <span className="absolute -right-6 text-white text-xs font-bold" style={{ bottom: `calc(${(v / 6) * 100}% - 8px)` }}>{v}</span>
    </div>
  );
  return <div className="flex items-center gap-8">{Bar(refA, handA, a, HOME)}{Bar(refB, handB, b, AWAY)}</div>;
}

// 22. Horizontal dual-range slider representing score differential
function V22() {
  const [diff, setDiff] = useState(0);
  const ref = useRef(null);
  const move = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const rel = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    setDiff(Math.round((rel * 10) - 5));
  };
  const a = Math.max(diff, 0), b = Math.max(-diff, 0);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-white font-bold">{a} - {b}</div>
      <div ref={ref} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); move(e); }} onPointerMove={e => { if (e.buttons === 1) move(e); }}
        className="relative rounded-full" style={{ width: 160, height: 10, background: `linear-gradient(90deg, ${AWAY}, rgba(255,255,255,0.1) 50%, ${HOME})`, touchAction: 'none' }}>
        <div className="absolute rounded-full bg-white shadow" style={{ width: 22, height: 22, top: -6, left: `calc(${((diff + 5) / 10) * 100}% - 11px)` }} />
      </div>
      <span className="text-[9px] text-slate-500">גררו ימינה = בית, שמאלה = חוץ</span>
    </div>
  );
}

// 23. Swipe-up/down directly on the number tile (framer drag)
function V23() {
  const [a, setA] = useState(1), [b, setB] = useState(1);
  const Item = (v, set, color) => (
    <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.5}
      onDragEnd={(e, info) => { if (info.offset.y < -20) set(x => clamp(x + 1, 0, 9)); else if (info.offset.y > 20) set(x => clamp(x - 1, 0, 9)); }}
      whileDrag={{ scale: 1.1 }}
      className="rounded-2xl flex items-center justify-center font-bold text-white cursor-grab active:cursor-grabbing"
      style={{ width: 48, height: 64, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}55`, fontSize: 26, touchAction: 'none' }}>
      {v}
    </motion.div>
  );
  return <div className="flex items-center gap-5">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 24. Draggable ball icon along a vertical track with goal-line ticks
function V24() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const [refA, handA] = useLinearDrag(setA, { vertical: true, max: 6, invert: true });
  const [refB, handB] = useLinearDrag(setB, { vertical: true, max: 6, invert: true });
  const Track = (ref, handlers, v) => (
    <div ref={ref} {...handlers} className="relative" style={{ width: 26, height: 110, touchAction: 'none' }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="absolute" style={{ right: 0, bottom: `${(i / 6) * 100}%`, width: 10, height: 1, background: 'rgba(255,255,255,0.2)' }} />
      ))}
      <motion.div animate={{ bottom: `calc(${(v / 6) * 100}% - 10px)` }} className="absolute" style={{ left: 0, fontSize: 18 }}>⚽</motion.div>
      <span className="absolute -left-4 top-0 text-white text-xs font-bold">{v}</span>
    </div>
  );
  return <div className="flex items-center gap-8">{Track(refA, handA, a)}{Track(refB, handB, b)}</div>;
}

// 25. Rotary knob — drag around to set the number
function V25() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const [refA, handA] = useAngleDrag(setA, { max: 6 });
  const [refB, handB] = useAngleDrag(setB, { max: 6 });
  const Knob = (ref, handlers, v, color) => (
    <div ref={ref} {...handlers} className="relative rounded-full flex items-center justify-center" style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.06)', border: `2px solid ${color}55`, touchAction: 'none' }}>
      <div className="absolute rounded-full" style={{ width: 4, height: 20, background: color, top: 4, left: '50%', marginLeft: -2, transformOrigin: '50% 28px', transform: `rotate(${(v / 6) * 360}deg)` }} />
      <span className="text-white font-bold text-xl">{v}</span>
    </div>
  );
  return <div className="flex items-center gap-6">{Knob(refA, handA, a, HOME)}{Knob(refB, handB, b, AWAY)}</div>;
}

// 26. Tug-of-war bar — two draggable handles on one bar
function V26() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const ref = useRef(null);
  const W = 180;
  const move = (which) => (e) => {
    const rect = ref.current.getBoundingClientRect();
    const rel = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const val = Math.round(rel * 6);
    which === 'a' ? setA(val) : setB(val);
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-white font-bold">{a} - {b}</div>
      <div ref={ref} className="relative rounded-full" style={{ width: W, height: 8, background: 'rgba(255,255,255,0.1)', touchAction: 'none' }}>
        <div onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); move('a')(e); }} onPointerMove={e => { if (e.buttons === 1) move('a')(e); }}
          className="absolute rounded-full cursor-grab" style={{ width: 18, height: 18, top: -5, background: HOME, left: `calc(${(a / 6) * 100}% - 9px)` }} />
        <div onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); move('b')(e); }} onPointerMove={e => { if (e.buttons === 1) move('b')(e); }}
          className="absolute rounded-full cursor-grab" style={{ width: 18, height: 18, top: -5, background: AWAY, left: `calc(${(b / 6) * 100}% - 9px)` }} />
      </div>
    </div>
  );
}

// 27. Swipeable card carousel — flick to change value
function V27() {
  const [a, setA] = useState(1), [b, setB] = useState(1);
  const Item = (v, set, color) => (
    <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
      onDragEnd={(e, info) => { if (info.offset.x < -30) set(x => clamp(x + 1, 0, 9)); else if (info.offset.x > 30) set(x => clamp(x - 1, 0, 9)); }}
      whileDrag={{ rotate: 8, scale: 1.05 }}
      className="rounded-xl flex items-center justify-center font-bold text-white cursor-grab"
      style={{ width: 44, height: 60, background: `linear-gradient(135deg, ${color}55, ${color}22)`, border: `1px solid ${color}`, fontSize: 24, touchAction: 'none' }}>
      {v}
    </motion.div>
  );
  return <div className="flex items-center gap-5">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 28. Draggable vertical equalizer-style bar
function V28() {
  const [a, setA] = useState(3), [b, setB] = useState(2);
  const [refA, handA] = useLinearDrag(setA, { vertical: true, max: 6, invert: true });
  const [refB, handB] = useLinearDrag(setB, { vertical: true, max: 6, invert: true });
  const Bar = (ref, handlers, v, color) => (
    <div ref={ref} {...handlers} className="relative rounded-md flex items-end justify-center" style={{ width: 24, height: 90, background: 'rgba(255,255,255,0.05)', touchAction: 'none' }}>
      <motion.div animate={{ height: `${(v / 6) * 100}%` }} className="w-full rounded-md" style={{ background: color }} />
      <span className="absolute -bottom-5 text-white text-xs font-bold">{v}</span>
    </div>
  );
  return <div className="flex items-end gap-5">{Bar(refA, handA, a, HOME)}{Bar(refB, handB, b, AWAY)}</div>;
}

// 29. Circular progress ring around a placeholder badge
function V29() {
  const [a, setA] = useState(3), [b, setB] = useState(2);
  const [refA, handA] = useAngleDrag(setA, { max: 6 });
  const [refB, handB] = useAngleDrag(setB, { max: 6 });
  const Ring = (ref, handlers, v, color) => {
    const pct = clamp(v / 6, 0, 1) * 100;
    return (
      <div ref={ref} {...handlers} className="relative rounded-full flex items-center justify-center" style={{ width: 60, height: 60, touchAction: 'none', background: `conic-gradient(${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }}>
        <div className="rounded-full flex items-center justify-center text-white font-bold" style={{ width: 44, height: 44, background: '#0b1220' }}>{v}</div>
      </div>
    );
  };
  return <div className="flex items-center gap-6">{Ring(refA, handA, a, HOME)}{Ring(refB, handB, b, AWAY)}</div>;
}

// 30. Slot machine reel — flick/drag to spin and snap
function V30() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const ITEM = 26;
  const Item = ({ v, set, color }) => {
    const dragY = useRef(0);
    return (
      <div className="overflow-hidden rounded-lg relative" style={{ width: 34, height: ITEM, background: 'rgba(255,255,255,0.05)', border: `1px solid ${color}55` }}>
        <motion.div drag="y" dragElastic={0.15} dragMomentum={false}
          animate={{ y: -v * ITEM }} transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          onDrag={(e, info) => { dragY.current = info.offset.y; }}
          onDragEnd={() => { const delta = Math.round(dragY.current / ITEM); set(x => clamp(x - delta, 0, 9)); dragY.current = 0; }}
          style={{ touchAction: 'none' }}>
          {Array.from({ length: 10 }).map((_, n) => (
            <div key={n} style={{ height: ITEM }} className="flex items-center justify-center text-white font-bold text-sm">{n}</div>
          ))}
        </motion.div>
      </div>
    );
  };
  return <div className="flex items-center gap-6"><Item v={a} set={setA} color={HOME} /><Item v={b} set={setB} color={AWAY} /></div>;
}

// ================= Group D — Wheel / mechanical / novelty (31-40) =================

// 31. iOS-style scroll-snap picker wheel
function V31() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const ITEM = 28;
  const Item = ({ v, set, color }) => {
    const ref = useRef(null);
    const onScroll = () => { const el = ref.current; if (!el) return; set(clamp(Math.round(el.scrollTop / ITEM), 0, 9)); };
    useEffect(() => { if (ref.current) ref.current.scrollTop = v * ITEM; }, []);
    return (
      <div ref={ref} onScroll={onScroll} className="overflow-y-scroll rounded-lg" style={{ width: 36, height: ITEM * 3, scrollSnapType: 'y mandatory', border: `1px solid ${color}33` }}>
        <div style={{ height: ITEM }} />
        {Array.from({ length: 10 }).map((_, n) => (
          <div key={n} style={{ height: ITEM, scrollSnapAlign: 'center' }} className="flex items-center justify-center font-bold">
            <span style={{ color: v === n ? '#fff' : '#475569', fontSize: v === n ? 20 : 14 }}>{n}</span>
          </div>
        ))}
        <div style={{ height: ITEM }} />
      </div>
    );
  };
  return <div className="flex items-center gap-6"><Item v={a} set={setA} color={HOME} /><Item v={b} set={setB} color={AWAY} /></div>;
}

// 32. Combination-lock digit wheel — tap top/bottom edges to roll
function V32() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set, color) => (
    <div className="flex flex-col items-center rounded-lg overflow-hidden" style={{ width: 32, border: `1px solid ${color}55` }}>
      <button onClick={() => set(x => clamp(x + 1, 0, 9))} className="w-full text-[9px] text-slate-400 py-0.5 hover:text-white">▲</button>
      <motion.div key={v} initial={{ rotateX: -50, opacity: 0.4 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.15 }}
        className="w-full text-center font-bold text-white text-xl py-1" style={{ background: 'rgba(255,255,255,0.05)' }}>{v}</motion.div>
      <button onClick={() => set(x => clamp(x - 1, 0, 9))} className="w-full text-[9px] text-slate-400 py-0.5 hover:text-white">▼</button>
    </div>
  );
  return <div className="flex items-center gap-5">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 33. Odometer/mechanical-counter roller digits
function V33() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set, color) => (
    <div className="relative overflow-hidden rounded-md cursor-pointer select-none" style={{ width: 30, height: 40, background: '#0b1220', border: `1px solid ${color}` }}
      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); const top = e.clientY - r.top < r.height / 2; set(x => clamp(top ? x + 1 : x - 1, 0, 9)); }}>
      <AnimatePresence mode="popLayout">
        <motion.div key={v} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{v}</motion.div>
      </AnimatePresence>
    </div>
  );
  return <div className="flex items-center gap-5">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 34. Roulette-style circular number wheel
function V34() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const N = 7;
  const Item = (v, set, color) => (
    <div className="relative" style={{ width: 70, height: 70 }}>
      {Array.from({ length: N }).map((_, i) => {
        const ang = (i / N) * 2 * Math.PI - Math.PI / 2;
        const x = 35 + Math.cos(ang) * 28, y = 35 + Math.sin(ang) * 28;
        return (
          <button key={i} onClick={() => set(i)} className="absolute rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ width: 18, height: 18, left: x - 9, top: y - 9, background: v === i ? color : 'rgba(255,255,255,0.08)' }}>{i}</button>
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold pointer-events-none">{v}</div>
    </div>
  );
  return <div className="flex items-center gap-4">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 35. Arc dial — numbers along a semicircular arc
function V35() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const N = 6;
  const Item = (v, set, color) => (
    <div className="relative" style={{ width: 90, height: 50 }}>
      {Array.from({ length: N }).map((_, i) => {
        const ang = Math.PI - (i / (N - 1)) * Math.PI;
        const x = 45 + Math.cos(ang) * 38, y = 48 - Math.sin(ang) * 38;
        return (
          <button key={i} onClick={() => set(i)} className="absolute rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ width: 16, height: 16, left: x - 8, top: y - 8, background: v === i ? color : 'rgba(255,255,255,0.08)' }}>{i}</button>
        );
      })}
    </div>
  );
  return <div className="flex items-center gap-2">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 36. Split-flap "flip clock" style display
function V36() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set, color) => (
    <div className="flex flex-col items-center gap-1">
      <button onClick={() => set(x => clamp(x + 1, 0, 9))} className="text-slate-400 hover:text-white text-[10px]">▲</button>
      <div className="relative" style={{ width: 32, height: 42, perspective: 200 }}>
        <AnimatePresence mode="popLayout">
          <motion.div key={v} initial={{ rotateX: 90 }} animate={{ rotateX: 0 }} exit={{ rotateX: -90 }} transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center font-bold text-white text-2xl rounded-sm"
            style={{ background: '#111a2b', border: '1px solid rgba(255,255,255,0.15)' }}>{v}</motion.div>
        </AnimatePresence>
        <div className="absolute left-0 right-0 top-1/2 h-px bg-black/50" />
      </div>
      <button onClick={() => set(x => clamp(x - 1, 0, 9))} className="text-slate-400 hover:text-white text-[10px]">▼</button>
    </div>
  );
  return <div className="flex items-center gap-5">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 37. Dartboard-style concentric rings
function V37() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set, color) => {
    const rings = [30, 24, 18, 12, 6];
    return (
      <div className="relative" style={{ width: 64, height: 64 }}>
        {rings.map((r, i) => (
          <button key={i} onClick={() => set(rings.length - 1 - i)} className="absolute rounded-full"
            style={{ width: r * 2, height: r * 2, left: 32 - r, top: 32 - r, background: v === rings.length - 1 - i ? color : 'transparent', border: `1px solid ${color}66` }} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm pointer-events-none">{v}</div>
      </div>
    );
  };
  return <div className="flex items-center gap-6">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 38. Compass-style dial with rotating needle
function V38() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const [refA, handA] = useAngleDrag(setA, { max: 6 });
  const [refB, handB] = useAngleDrag(setB, { max: 6 });
  const Dial = (ref, handlers, v, color) => (
    <div ref={ref} {...handlers} className="relative rounded-full flex items-center justify-center" style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', touchAction: 'none' }}>
      {[0, 1, 2, 3, 4, 5].map(n => {
        const a2 = (n / 6) * 2 * Math.PI - Math.PI / 2;
        return <span key={n} className="absolute text-[8px] text-slate-400" style={{ left: 30 + Math.cos(a2) * 24 - 3, top: 30 + Math.sin(a2) * 24 - 5 }}>{n}</span>;
      })}
      <motion.div animate={{ rotate: (v / 6) * 360 }} className="absolute rounded-full" style={{ width: 3, height: 22, background: color, top: 6, left: '50%', marginLeft: -1.5, transformOrigin: '50% 24px' }} />
    </div>
  );
  return <div className="flex items-center gap-6">{Dial(refA, handA, a, HOME)}{Dial(refB, handB, b, AWAY)}</div>;
}

// 39. Poker-chip stack — tap to add a chip
function V39() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set, color) => (
    <div className="flex flex-col items-center gap-1">
      <button onClick={() => set(x => clamp(x + 1, 0, 8))} className="relative" style={{ width: 36, height: 20 + v * 4 }}>
        {Array.from({ length: v }).map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{ width: 32, height: 10, left: 2, bottom: i * 4, background: color, border: '2px dashed rgba(255,255,255,0.4)' }} />
        ))}
      </button>
      <div className="flex gap-2 items-center">
        <span className="text-white font-bold text-xs">{v}</span>
        <button onClick={() => set(0)} className="text-slate-500 hover:text-white text-[10px]">נקה</button>
      </div>
    </div>
  );
  return <div className="flex items-end gap-6">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 40. Semi-circular gauge — drag the needle
function V40() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const [refA, handA] = useAngleDrag(setA, { max: 6, gauge: true });
  const [refB, handB] = useAngleDrag(setB, { max: 6, gauge: true });
  const Gauge = (ref, handlers, v, color) => (
    <div ref={ref} {...handlers} className="relative" style={{ width: 70, height: 40, touchAction: 'none' }}>
      <div className="absolute inset-0 rounded-t-full" style={{ border: '6px solid rgba(255,255,255,0.1)', borderBottom: 'none' }} />
      <motion.div animate={{ rotate: (v / 6) * 180 - 180 }} className="absolute" style={{ width: 2, height: 32, background: color, bottom: 0, left: '50%', marginLeft: -1, transformOrigin: '50% 100%' }} />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white font-bold text-xs">{v}</span>
    </div>
  );
  return <div className="flex items-end gap-8">{Gauge(refA, handA, a, HOME)}{Gauge(refB, handB, b, AWAY)}</div>;
}

// ================= Group E — Football / novelty & alternate paradigms (41-50) =================

// 41. Animated dice-roll button
function V41() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const [rollingA, setRollingA] = useState(false);
  const [rollingB, setRollingB] = useState(false);
  const roll = (set, rolling, setRolling) => () => {
    if (rolling) return;
    setRolling(true);
    let n = 0;
    const iv = setInterval(() => { set(Math.floor(Math.random() * 6)); n++; if (n > 10) { clearInterval(iv); setRolling(false); } }, 60);
  };
  const Col = (v, rolling, onRoll, color) => (
    <button onClick={onRoll} className="flex flex-col items-center gap-1">
      <motion.div animate={rolling ? { rotate: [0, 15, -15, 0] } : {}} transition={{ repeat: rolling ? Infinity : 0, duration: 0.2 }}
        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-2xl"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>{v}</motion.div>
      <span className="text-[9px] text-slate-400">{rolling ? 'מגלגל...' : 'הטל קוביה'}</span>
    </button>
  );
  return <div className="flex items-center gap-6">{Col(a, rollingA, roll(setA, rollingA, setRollingA), HOME)}{Col(b, rollingB, roll(setB, rollingB, setRollingB), AWAY)}</div>;
}

// 42. Dual control: stepper + confidence slider
function V42() {
  const [a, setA] = useState(1), [b, setB] = useState(1);
  const [conf, setConf] = useState(60);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <StepBtn onClick={() => setA(clamp(a + 1, 0, 9))} color={HOME}><Plus className="w-3.5 h-3.5" /></StepBtn>
        <span className="text-white font-bold text-xl">{a} - {b}</span>
        <StepBtn onClick={() => setB(clamp(b + 1, 0, 9))} color={AWAY}><Plus className="w-3.5 h-3.5" /></StepBtn>
      </div>
      <input type="range" min={0} max={100} value={conf} onChange={e => setConf(+e.target.value)} className="w-32 accent-sky-400" />
      <span className="text-[10px] text-slate-400">{conf > 70 ? 'בטוח מאוד' : conf > 40 ? 'די בטוח' : 'לא בטוח'} ({conf}%)</span>
    </div>
  );
}

// 43. Retro LED/pixel scoreboard
function V43() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set) => (
    <div className="flex flex-col items-center gap-1">
      <button onClick={() => set(clamp(v + 1, 0, 9))} className="text-green-400 hover:text-green-300 text-xs">▲</button>
      <div className="px-2.5 py-1 rounded font-mono font-bold text-xl" style={{ background: '#000', color: '#22ff66', textShadow: '0 0 6px #22ff66', border: '1px solid #123' }}>{v}</div>
      <button onClick={() => set(clamp(v - 1, 0, 9))} className="text-green-400 hover:text-green-300 text-xs">▼</button>
    </div>
  );
  return <div className="flex items-center gap-4">{Item(a, setA)}{Item(b, setB)}</div>;
}

// 44. Giant jersey-badge tap target — swipe up/down
function V44() {
  const [a, setA] = useState(1), [b, setB] = useState(1);
  const Item = (v, set, color) => (
    <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.4}
      onDragEnd={(e, info) => { if (info.offset.y < -25) set(x => clamp(x + 1, 0, 9)); else if (info.offset.y > 25) set(x => clamp(x - 1, 0, 9)); }}
      whileDrag={{ scale: 1.08 }} className="rounded-2xl flex items-center justify-center font-black text-white cursor-grab"
      style={{ width: 64, height: 64, background: `linear-gradient(160deg, ${color}, ${color}55)`, fontSize: 30, touchAction: 'none' }}>
      {v}
    </motion.div>
  );
  return <div className="flex items-center gap-6">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 45. Fill-up trophy icon — tap adds proportional fill
function V45() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set, color) => {
    const pct = clamp(v / 6, 0, 1) * 100;
    return (
      <button onClick={() => set(x => (x + 1) % 7)} className="flex flex-col items-center gap-1">
        <div className="relative">
          <Trophy className="w-9 h-9" style={{ color: 'rgba(255,255,255,0.15)' }} />
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(${100 - pct}% 0 0 0)` }}>
            <Trophy className="w-9 h-9" style={{ color }} />
          </div>
        </div>
        <span className="text-white font-bold text-xs">{v}</span>
      </button>
    );
  };
  return <div className="flex items-center gap-6">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 46. Twin speedometer-style arcs side by side
function V46() {
  const [a, setA] = useState(2), [b, setB] = useState(1);
  const Item = (v, set, color) => (
    <div className="flex flex-col items-center gap-1">
      <div className="relative rounded-t-full overflow-hidden" style={{ width: 56, height: 28 }}>
        <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute inset-0" style={{ background: color, transform: `scaleX(${v / 6})`, transformOrigin: 'bottom left' }} />
      </div>
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4, 5, 6].map(n => <button key={n} onClick={() => set(n)} className="w-2 h-2 rounded-full" style={{ background: n <= v ? color : 'rgba(255,255,255,0.15)' }} />)}
      </div>
      <span className="text-white font-bold text-xs">{v}</span>
    </div>
  );
  return <div className="flex items-end gap-5">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 47. Text entry with autocomplete suggestion chips
function V47() {
  const [txt, setTxt] = useState('');
  const suggestions = ['1-0', '2-1', '1-1', '0-0', '2-0'];
  return (
    <div className="flex flex-col items-center gap-2">
      <input value={txt} onChange={e => setTxt(e.target.value)} placeholder="לדוגמה 2-1"
        className="w-24 text-center rounded-lg px-2 py-1.5 text-white text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }} />
      <div className="flex gap-1 flex-wrap justify-center max-w-[160px]">
        {suggestions.map(s => (
          <button key={s} onClick={() => setTxt(s)} className="text-[10px] px-2 py-0.5 rounded-full text-slate-300" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>{s}</button>
        ))}
      </div>
      <span className="text-[9px] text-slate-500">נפוצים: {suggestions.join(', ')}</span>
    </div>
  );
}

// 48. Tally-mark counter, grouped in fives
function V48() {
  const [a, setA] = useState(3), [b, setB] = useState(2);
  const Item = (v, set, color) => {
    const groups = Math.max(Math.ceil(v / 5), 1);
    return (
      <button onClick={() => set(x => (x + 1) % 11)} className="flex flex-col items-center gap-1">
        <div className="flex gap-1.5">
          {Array.from({ length: groups }).map((_, g) => {
            const inGroup = Math.max(Math.min(5, v - g * 5), 0);
            return (
              <div key={g} className="flex gap-0.5 items-end" style={{ height: 16 }}>
                {Array.from({ length: inGroup }).map((_, i) => (
                  <div key={i} style={{ width: 2, height: 14, background: color, transform: i === 4 ? 'rotate(35deg) translateX(-3px)' : 'none' }} />
                ))}
              </div>
            );
          })}
        </div>
        <span className="text-white font-bold text-xs">{v}</span>
      </button>
    );
  };
  return <div className="flex items-center gap-6">{Item(a, setA, HOME)}{Item(b, setB, AWAY)}</div>;
}

// 49. Split-divider tug bar
function V49() {
  const [pos, setPos] = useState(50);
  const [ref, handlers] = useLinearDrag(setPos, { raw: true });
  const a = Math.round(pos / 100 * 6), b = Math.round((100 - pos) / 100 * 6);
  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={ref} {...handlers} className="relative rounded-full overflow-hidden flex items-center" style={{ width: 180, height: 26, touchAction: 'none' }}>
        <div style={{ width: `${pos}%`, height: '100%', background: HOME }} className="flex items-center justify-start pl-2 text-white text-xs font-bold">{a}</div>
        <div style={{ width: `${100 - pos}%`, height: '100%', background: AWAY }} className="flex items-center justify-end pr-2 text-white text-xs font-bold">{b}</div>
        <div className="absolute rounded-full bg-white shadow" style={{ width: 16, height: 16, top: 5, left: `calc(${pos}% - 8px)` }} />
      </div>
    </div>
  );
}

// 50. Minimal/accessible native number input
function V50() {
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const Item = (v, set, label, color) => (
    <label className="flex flex-col items-center gap-1">
      <span className="text-slate-400 text-[10px] font-bold">{label}</span>
      <input type="number" min={0} max={20} value={v} onChange={e => set(clamp(parseInt(e.target.value || '0', 10), 0, 20))}
        className="w-16 h-14 rounded-lg text-center text-2xl font-bold outline-none focus:ring-4"
        style={{ background: '#fff', color: '#000', border: `3px solid ${color}` }} />
    </label>
  );
  return <div className="flex items-center gap-6">{Item(a, setA, 'בית', HOME)}{Item(b, setB, 'חוץ', AWAY)}</div>;
}

const GROUPS = [
  { title: 'קבוצה A — סטפרים (ספירה מספרית)', items: [
    ['1. הבסיס הנוכחי (להשוואה)', 'זהה ל-ScoreInput.jsx: חיצים והיפוך ספרה', V1],
    ['2. סטפר אופקי', 'כפתורי + / − משני צידי המספר בשורה אחת', V2],
    ['3. כפתורים עגולים גדולים', '+/− גדולים מסביב למספר מודגש', V3],
    ['4. סטפר קומפקטי בפינות', 'תגיות +/− זעירות בפינות אריח המספר', V4],
    ['5. לחיצה ארוכה מואצת', 'החזקת הכפתור מגדילה את קצב הספירה', V5],
    ['6. כפתור מפוצל', 'חצי עליון = +1, חצי תחתון = −1', V6],
    ['7. סרגל עם קווי סימון', 'סרגל אופקי 0–6, לחיצה לבחירת נקודה', V7],
    ['8. שדה מספרי טבעי', 'input מסוג number עם חצי גלילה, פונט מספרי', V8],
    ['9. חיצים צמודים עם קפיץ', 'אנימציית בוינס קפיצית בכל הקשה', V9],
    ['10. תג עם רצף הקשות', 'מונה קומבו קטן שמופיע בהקשות מהירות', V10],
  ]},
  { title: 'קבוצה B — בחירה ישירה (הקשה לקביעת ערך)', items: [
    ['11. שבבי מספרים', 'שורת 0 1 2 3 4 5+ בסגנון OTP, נגיעה ישירה', V11],
    ['12. מטריצת תוצאות', 'רשת 6×6, נגיעה אחת קובעת את שתי הקבוצות', V12],
    ['13. כפתורי תוצאה נפוצה', 'כפתורים מוכנים מראש לתוצאות שכיחות', V13],
    ['14. רשימה גוללת', 'רשימה אנכית קומפקטית של 0–5', V14],
    ['15. פיפס קוביה', 'נגיעה ממלאת נקודות בשורה, כמות = שערים', V15],
    ['16. תלי כדורגל', 'הקשה מוסיפה אייקון ⚽, X מנקה', V16],
    ['17. דירוג בכדורים', 'כמו דירוג כוכבים אך עם כדורי כדורגל', V17],
    ['18. פילס בחירה גוללים', 'קבוצת כפתורי מתג 0–9 בגלילה אופקית', V18],
    ['19. בקרה מפוצלת קומפקטית', 'בית וחוץ צמודים באותו רכיב מיני', V19],
    ['20. מקלדת מספרים', 'לוח ספרות בסגנון קוד PIN', V20],
  ]},
  { title: 'קבוצה C — גרירה ומחוות', items: [
    ['21. סליידר אנכי', 'כמו בקרת ווליום, גררו למעלה/מטה', V21],
    ['22. סליידר הפרש דו-ראשי', 'מסלול אחד שמייצג את הפרש השערים', V22],
    ['23. סווייפ על האריח', 'גררו את אריח הספרה עצמו למעלה/מטה', V23],
    ['24. כדור נגרר על מסלול', 'גררו אייקון כדור על ציר עם קווי שער', V24],
    ['25. חוגה מסתובבת', 'כמו כפתור ווליום — גררו מסביב לסובב', V25],
    ['26. משיכת חבל', 'שני ידיות נגררות על פס אחד, אחת לכל קבוצה', V26],
    ['27. קלפים מוחלקים', 'החליקו ימינה/שמאלה בין כרטיסי מספרים', V27],
    ['28. עמודת אקולייזר', 'גובה העמודה הנגררת קובע את מספר השערים', V28],
    ['29. טבעת התקדמות', 'גררו מסביב לטבעת סביב סמל קבוצה', V29],
    ['30. גלגל מזל', 'החליקו לסיבוב גלגל ספרות שנעצר בהצמדה', V30],
  ]},
  { title: 'קבוצה D — גלגלים, מנגנונים וחוגות', items: [
    ['31. גלגלת iOS', 'עמודה גוללת עם הצמדה, המספר במרכז נבחר', V31],
    ['32. גלגל מנעול', 'כמו מנעול קומבינציה — הקשה על קצוות לגלגול', V32],
    ['33. מונה אודומטר', 'הקשה על קצה הספרה מגלגלת אותה מעלה/מטה', V33],
    ['34. גלגל רולטה', 'מקטעים סביב מעגל, הקשה על מקטע בוחרת ערך', V34],
    ['35. חצי-קשת', 'מספרים על קשת חצי-עיגול, הקשה לבחירה', V35],
    ['36. לוח פיצול-דפים', 'כמו טבלת תחנת רכבת, חצים לגלגול', V36],
    ['37. טבעות דארטס', 'טבעות קונצנטריות — הקשה על טבעת קובעת ערך', V37],
    ['38. חוגת מצפן', 'מחט מסתובבת שנצמדת למספרים סביב חוגה', V38],
    ['39. ערימת אסימונים', 'הקשה מוסיפה אסימון לערימה — אסימון = שער', V39],
    ['40. מד דלק חצי-עגול', 'גררו את המחוג לאורך קשת המד', V40],
  ]},
  { title: 'קבוצה E — כדורגל, נובלטי ופרדיגמות חלופיות', items: [
    ['41. הטלת קובייה', 'הקשה מגלגלת מספרים באנימציה ונוחתת אקראית', V41],
    ['42. סטפר + מד ביטחון', 'בורר שערים לצד סליידר רמת ביטחון', V42],
    ['43. לוח תוצאות LED', 'תצוגת פיקסלים רטרו עם זוהר וחצים', V43],
    ['44. תג ג׳רזי ענק', 'החליקו על התג הגדול למעלה/מטה לשינוי הערך', V44],
    ['45. גביע מתמלא', 'הקשה ממלאת את הגביע בהדרגה לפי כמות השערים', V45],
    ['46. זוג מדי מהירות', 'שתי קשתות מד עם נקודות מילוי, אחת לכל קבוצה', V46],
    ['47. הקלדה עם הצעות', 'שדה טקסט חופשי עם צ׳יפים של תוצאות נפוצות', V47],
    ['48. סימוני נמנה', 'הקשה מוסיפה קו נמנה, קבוצות של חמישה', V48],
    ['49. פס מפריד נגרר', 'מפריד אנכי נגרר על פס דו-צבעוני, כל צד = קבוצה', V49],
    ['50. נגיש ומינימלי', 'input גדול וברור עם ניגודיות גבוהה, נגיש במיוחד', V50],
  ]},
];

export default function AdminScoreInputDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 50 דרכים לבחור תוצאת משחק</h2>
        <p className="text-slate-500 text-sm">כולן אינטראקטיביות עם כפתור "הצג שוב". דאטה מקומית לדוגמה. כלי דמו בלבד — לא משפיע על ScoreInput.jsx או Predictions.jsx.</p>
      </div>
      {GROUPS.map((group) => (
        <div key={group.title} className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">{group.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map(([label, desc, Comp]) => (
              <Frame key={label} label={label} desc={desc}>{(k) => <Comp key={k} />}</Frame>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
