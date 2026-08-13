import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Dices } from 'lucide-react';

// Demo-only: 16 interaction/display redesigns for the score picker (ScoreInput.jsx).
// All data below is mock/fixed — no API calls, doesn't touch the real predictions flow.

const GOLD = '250,204,21';
const GREEN = '74,222,128';
const BLUE = '9,122,220';

// Mock score_odds table (same shape used by the real MatchFormDialog analyzer)
const ODDS = {
  '0:0': 11, '1:0': 10, '2:0': 14.5, '3:0': 26, '1:1': 6.25, '2:1': 10, '2:2': 11,
  '0:1': 9.75, '0:2': 13, '1:2': 9.25, '3:1': 18.5, '3:2': 23, '3:3': 34, '4:0': 51,
};
const oddsFor = (h, a) => ODDS[`${h}:${a}`] ?? 21;

// Mock crowd-prediction share per score (illustrative)
const CROWD = { '0:0': 8, '1:0': 22, '2:0': 6, '1:1': 14, '2:1': 18, '0:1': 9, '2:2': 5, '0:2': 3 };
const crowdFor = (h, a) => CROWD[`${h}:${a}`] ?? 2;

function Pill({ value, glow = 0, size = 'md', tone = 'default' }) {
  const sizes = { sm: { w: 44, h: 64, font: 34 }, md: { w: 52, h: 80, font: 44 }, lg: { w: 60, h: 92, font: 52 } }[size];
  const isUndefined = value === undefined || value === null;
  const glowColor = tone === 'gold' ? GOLD : tone === 'green' ? GREEN : BLUE;
  return (
    <div
      className="flex items-center justify-center rounded-[18px] relative overflow-hidden flex-shrink-0"
      style={{
        width: sizes.w, height: sizes.h,
        background: 'rgba(255,255,255,0.06)',
        border: `1px solid rgba(${glowColor},${0.15 + glow * 0.5})`,
        boxShadow: glow > 0 ? `0 0 ${8 + glow * 20}px rgba(${glowColor},${glow * 0.6}), inset 0 1px 0 rgba(255,255,255,0.25)` : 'inset 0 1px 0 rgba(255,255,255,0.25)',
        backdropFilter: 'blur(16px) saturate(140%)',
      }}
    >
      <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }} />
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 8, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: sizes.font }}
          className={`select-none ${isUndefined ? 'text-slate-600' : 'text-white'}`}
        >
          {isUndefined ? '?' : value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Chevrons({ onUp, onDown, disabledDown }) {
  return (
    <>
      <motion.button whileTap={{ scale: 0.85 }} onClick={onUp} className="text-yellow-400 hover:opacity-70">
        <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
      </motion.button>
      <motion.button whileTap={{ scale: 0.85 }} onClick={onDown} disabled={disabledDown} className="text-yellow-400 hover:opacity-70 disabled:opacity-25">
        <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
      </motion.button>
    </>
  );
}

function Frame({ label, desc, children }) {
  return (
    <div className="flex flex-col gap-2 bg-slate-800/40 border border-white/8 rounded-2xl p-4">
      <div className="flex items-center justify-center gap-6 py-2" style={{ minHeight: 150 }}>
        {children}
      </div>
      <div>
        <div className="text-white text-xs font-bold text-center">{label}</div>
        <div className="text-slate-500 text-[10px] text-center mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

// ── 1. Vertical drag on the pill itself ─────────────────────────────────────
function VariantDrag() {
  const [v, setV] = useState(1);
  const startRef = useRef({ y: 0, v: 1 });
  const onPointerDown = (e) => { startRef.current = { y: e.clientY, v }; e.target.setPointerCapture(e.pointerId); };
  const onPointerMove = (e) => {
    if (e.buttons !== 1) return;
    const dy = startRef.current.y - e.clientY;
    const steps = Math.round(dy / 22);
    setV(Math.max(0, startRef.current.v + steps));
  };
  return (
    <div className="flex flex-col items-center gap-1" onPointerDown={onPointerDown} onPointerMove={onPointerMove} style={{ cursor: 'grab', touchAction: 'none' }}>
      <span className="text-[9px] text-slate-500">↕ גרור</span>
      <Pill value={v} tone="green" glow={0.3} />
    </div>
  );
}

// ── 2. Long-press auto-repeat ────────────────────────────────────────────────
function VariantLongPress() {
  const [v, setV] = useState(1);
  const iv = useRef(null);
  const start = (dir) => {
    setV((p) => Math.max(0, p + dir));
    iv.current = setInterval(() => setV((p) => Math.max(0, p + dir)), 130);
  };
  const stop = () => { clearInterval(iv.current); };
  useEffect(() => () => clearInterval(iv.current), []);
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button whileTap={{ scale: 0.85 }} onPointerDown={() => start(1)} onPointerUp={stop} onPointerLeave={stop} className="text-yellow-400">
        <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
      </motion.button>
      <Pill value={v} />
      <motion.button whileTap={{ scale: 0.85 }} onPointerDown={() => start(-1)} onPointerUp={stop} onPointerLeave={stop} disabled={v === 0} className="text-yellow-400 disabled:opacity-25">
        <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}

// ── 3. Big split tap zones (no small chevrons) ──────────────────────────────
function VariantBigTapZone() {
  const [v, setV] = useState(1);
  return (
    <div className="relative rounded-[18px] overflow-hidden" style={{ width: 52, height: 96 }}>
      <button onClick={() => setV((p) => p + 1)} className="absolute inset-x-0 top-0 h-1/2 flex items-end justify-center pb-1 hover:bg-white/5">
        <ChevronUp className="w-4 h-4 text-yellow-400/70" />
      </button>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Pill value={v} size="sm" />
      </div>
      <button onClick={() => setV((p) => Math.max(0, p - 1))} className="absolute inset-x-0 bottom-0 h-1/2 flex items-start justify-center pt-1 hover:bg-white/5">
        <ChevronDown className="w-4 h-4 text-yellow-400/70" />
      </button>
    </div>
  );
}

// ── 4. Tap opens quick-pick popover grid ────────────────────────────────────
function VariantPopoverGrid() {
  const [v, setV] = useState(undefined);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex flex-col items-center">
      <button onClick={() => setOpen((o) => !o)}><Pill value={v} tone="green" glow={open ? 0.35 : 0} /></button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.9 }}
            className="absolute top-[86px] z-10 grid grid-cols-3 gap-1 p-2 rounded-xl"
            style={{ background: 'rgba(10,18,35,0.97)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            {Array.from({ length: 7 }, (_, i) => i).map((n) => (
              <button key={n} onClick={() => { setV(n); setOpen(false); }} className="w-7 h-7 rounded-md text-xs font-bold text-white bg-white/6 hover:bg-white/15">{n}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── 5. Odds-linked glow ──────────────────────────────────────────────────────
function VariantOddsGlow() {
  const [h, setH] = useState(1), [a, setA] = useState(0);
  const odds = oddsFor(h, a);
  const glow = Math.min(odds / 30, 1);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1"><Chevrons onUp={() => setH((p) => p + 1)} onDown={() => setH((p) => Math.max(0, p - 1))} disabledDown={h === 0} /><Pill value={h} tone="gold" glow={glow} size="sm" /></div>
        <span className="text-slate-500 text-xs">–</span>
        <div className="flex flex-col items-center gap-1"><Chevrons onUp={() => setA((p) => p + 1)} onDown={() => setA((p) => Math.max(0, p - 1))} disabledDown={a === 0} /><Pill value={a} tone="gold" glow={glow} size="sm" /></div>
      </div>
      <span className="text-[10px] font-bold" style={{ color: `rgba(${GOLD},1)` }}>×{odds} נק׳ על פגיעה</span>
    </div>
  );
}

// ── 6. 3D flip transition ────────────────────────────────────────────────────
function VariantFlip() {
  const [v, setV] = useState(1);
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => setV((p) => p + 1)} className="text-yellow-400"><ChevronUp className="w-5 h-5" strokeWidth={2.5} /></motion.button>
      <div style={{ perspective: 300 }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={v}
            initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center rounded-[18px]"
            style={{ width: 52, height: 80, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44 }} className="text-white">{v}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => setV((p) => Math.max(0, p - 1))} disabled={v === 0} className="text-yellow-400 disabled:opacity-25"><ChevronDown className="w-5 h-5" strokeWidth={2.5} /></motion.button>
    </div>
  );
}

// ── 7. Haptic-style pulse burst on tap ──────────────────────────────────────
function VariantPulse() {
  const [v, setV] = useState(1);
  const [burstKey, setBurstKey] = useState(0);
  const bump = (d) => { setV((p) => Math.max(0, p + d)); setBurstKey((k) => k + 1); };
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => bump(1)} className="text-yellow-400"><ChevronUp className="w-5 h-5" strokeWidth={2.5} /></motion.button>
      <div className="relative">
        <Pill value={v} />
        <motion.div
          key={burstKey}
          initial={{ opacity: 0.6, scale: 1 }} animate={{ opacity: 0, scale: 1.5 }} transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-[18px] pointer-events-none"
          style={{ border: `2px solid rgba(${GREEN},1)` }}
        />
      </div>
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => bump(-1)} disabled={v === 0} className="text-yellow-400 disabled:opacity-25"><ChevronDown className="w-5 h-5" strokeWidth={2.5} /></motion.button>
    </div>
  );
}

// ── 8. Preset chips fill both digits at once ────────────────────────────────
function VariantPresetChips() {
  const [h, setH] = useState(undefined), [a, setA] = useState(undefined);
  const presets = ['1:0', '2:1', '1:1', '0:0', '2:0'];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2"><Pill value={h} size="sm" tone="green" glow={h !== undefined ? 0.25 : 0} /><span className="text-slate-500 text-xs">–</span><Pill value={a} size="sm" tone="green" glow={a !== undefined ? 0.25 : 0} /></div>
      <div className="flex gap-1 flex-wrap justify-center">
        {presets.map((p) => {
          const [ph, pa] = p.split(':').map(Number);
          const active = h === ph && a === pa;
          return (
            <button key={p} onClick={() => { setH(ph); setA(pa); }} className={`text-[10px] px-2 py-1 rounded-full border ${active ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300' : 'bg-white/5 border-white/10 text-white/50'}`}>{p.replace(':', '-')}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── 9. Dual-axis 2D pad instead of two steppers ─────────────────────────────
function VariantPad() {
  const [h, setH] = useState(1), [a, setA] = useState(0);
  const ref = useRef(null);
  const N = 5, cell = 24;
  const onPick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), N * cell);
    const y = Math.min(Math.max(e.clientY - rect.top, 0), N * cell);
    setH(N - 1 - Math.floor(y / cell));
    setA(Math.floor(x / cell));
  };
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        ref={ref} onPointerDown={(e) => { e.target.setPointerCapture(e.pointerId); onPick(e); }} onPointerMove={(e) => e.buttons === 1 && onPick(e)}
        className="relative rounded-lg" style={{ width: N * cell, height: N * cell, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', touchAction: 'none', cursor: 'crosshair' }}
      >
        <div className="absolute rounded-full" style={{ width: 14, height: 14, left: a * cell + cell / 2 - 7, top: (N - 1 - h) * cell + cell / 2 - 7, background: `rgba(${BLUE},1)`, boxShadow: `0 0 8px rgba(${BLUE},0.8)` }} />
      </div>
      <span className="text-white text-sm font-bold">{h} – {a}</span>
    </div>
  );
}

// ── 10. Numeric keypad popover ───────────────────────────────────────────────
function VariantKeypad() {
  const [v, setV] = useState(undefined);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex flex-col items-center">
      <button onClick={() => setOpen((o) => !o)}><Pill value={v} /></button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="absolute top-[86px] z-10 grid grid-cols-3 gap-1 p-2 rounded-xl" style={{ background: 'rgba(10,18,35,0.97)', border: '1px solid rgba(255,255,255,0.12)' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button key={n} onClick={() => { setV(n); setOpen(false); }} className="w-7 h-7 rounded-md text-xs font-mono text-white bg-white/6 hover:bg-white/15">{n}</button>
            ))}
            <button onClick={() => { setV(0); setOpen(false); }} className="col-span-3 h-7 rounded-md text-xs font-mono text-white bg-white/6 hover:bg-white/15">0</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── 11. Vertical tick-dot scale beside the pill ─────────────────────────────
function VariantTickScale() {
  const [v, setV] = useState(2);
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col-reverse gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setV(n)} className="w-2.5 h-2.5 rounded-full transition-all" style={{ background: n === v ? `rgba(${GREEN},1)` : 'rgba(255,255,255,0.15)', transform: n === v ? 'scale(1.4)' : 'scale(1)' }} />
        ))}
      </div>
      <Pill value={v} tone="green" glow={0.2} />
    </div>
  );
}

// ── 12. Circular rotary dial ─────────────────────────────────────────────────
function VariantDial() {
  const [v, setV] = useState(1);
  const ref = useRef(null);
  const lastAngle = useRef(null);
  const onMove = (e) => {
    if (e.buttons !== 1 || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    if (lastAngle.current !== null) {
      let diff = angle - lastAngle.current;
      if (diff > Math.PI) diff -= 2 * Math.PI;
      if (diff < -Math.PI) diff += 2 * Math.PI;
      if (Math.abs(diff) > 0.35) { setV((p) => Math.max(0, p + (diff > 0 ? 1 : -1))); lastAngle.current = angle; }
    } else lastAngle.current = angle;
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        ref={ref} onPointerDown={(e) => { e.target.setPointerCapture(e.pointerId); lastAngle.current = null; }} onPointerMove={onMove}
        className="relative rounded-full flex items-center justify-center" style={{ width: 74, height: 74, border: `2px solid rgba(${BLUE},0.4)`, touchAction: 'none', cursor: 'grab' }}
      >
        <div className="absolute rounded-full" style={{ width: 6, height: 6, background: `rgba(${BLUE},1)`, top: 4, left: '50%', transform: `translateX(-50%) rotate(${v * 36}deg)`, transformOrigin: '3px 33px' }} />
        <span className="text-white font-black text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{v}</span>
      </div>
      <span className="text-[9px] text-slate-500">↻ סובב</span>
    </div>
  );
}

// ── 13. Shuffle / randomize button ──────────────────────────────────────────
function VariantShuffle() {
  const [h, setH] = useState(1), [a, setA] = useState(1);
  const [spin, setSpin] = useState(0);
  const roll = () => { setH(Math.floor(Math.random() * 4)); setA(Math.floor(Math.random() * 4)); setSpin((s) => s + 1); };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2"><Pill value={h} size="sm" /><span className="text-slate-500 text-xs">–</span><Pill value={a} size="sm" /></div>
      <motion.button whileTap={{ scale: 0.88 }} onClick={roll} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/40 text-purple-300">
        <motion.span key={spin} initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.4 }}><Dices className="w-3.5 h-3.5" /></motion.span>
        הפתעה אותי
      </motion.button>
    </div>
  );
}

// ── 14. Crowd-wisdom inline indicator ───────────────────────────────────────
function VariantCrowd() {
  const [h, setH] = useState(1), [a, setA] = useState(0);
  const pct = crowdFor(h, a);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1"><Chevrons onUp={() => setH((p) => p + 1)} onDown={() => setH((p) => Math.max(0, p - 1))} disabledDown={h === 0} /><Pill value={h} size="sm" /></div>
        <span className="text-slate-500 text-xs">–</span>
        <div className="flex flex-col items-center gap-1"><Chevrons onUp={() => setA((p) => p + 1)} onDown={() => setA((p) => Math.max(0, p - 1))} disabledDown={a === 0} /><Pill value={a} size="sm" /></div>
      </div>
      <span className="text-[10px] text-sky-400 font-semibold">👥 {pct}% מהמשתמשים ניחשו כך</span>
    </div>
  );
}

// ── 15. Football-icon tally instead of digits ───────────────────────────────
function VariantBallTally() {
  const [v, setV] = useState(2);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => setV((p) => Math.min(6, p + 1))} className="text-yellow-400"><ChevronUp className="w-5 h-5" strokeWidth={2.5} /></motion.button>
      <div className="flex items-center justify-center rounded-[18px] px-2" style={{ minWidth: 60, height: 60, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <div className="flex flex-wrap gap-0.5 justify-center" style={{ maxWidth: 52 }}>
          {v === 0 ? <span className="text-slate-600 text-lg">?</span> : Array.from({ length: v }, (_, i) => <span key={i} className="text-sm leading-none">⚽</span>)}
        </div>
      </div>
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => setV((p) => Math.max(0, p - 1))} disabled={v === 0} className="text-yellow-400 disabled:opacity-25"><ChevronDown className="w-5 h-5" strokeWidth={2.5} /></motion.button>
    </div>
  );
}

// ── 16. Lock-in confidence gesture ──────────────────────────────────────────
function VariantLockIn() {
  const [v, setV] = useState(2);
  const [locked, setLocked] = useState(false);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex gap-2">
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => !locked && setV((p) => p + 1)} className="text-yellow-400"><ChevronUp className="w-5 h-5" strokeWidth={2.5} /></motion.button>
      </div>
      <motion.div onClick={() => setLocked((l) => !l)} whileTap={{ scale: 0.9 }} className="cursor-pointer">
        <Pill value={v} tone="gold" glow={locked ? 0.7 : 0} />
      </motion.div>
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => !locked && setV((p) => Math.max(0, p - 1))} disabled={v === 0} className="text-yellow-400 disabled:opacity-25"><ChevronDown className="w-5 h-5" strokeWidth={2.5} /></motion.button>
      <span className="text-[9px]" style={{ color: locked ? `rgba(${GOLD},1)` : '#64748b' }}>{locked ? '🔒 ננעל בביטחון' : 'לחץ על התוצאה לנעילה'}</span>
    </div>
  );
}

const VARIANTS = [
  ['1. גרירה אנכית', 'גוררים למעלה/למטה על הריבוע עצמו', VariantDrag],
  ['2. החזקה ארוכה', 'לחיצה רציפה = עלייה מהירה ואוטומטית', VariantLongPress],
  ['3. אזורי מגע גדולים', 'חצי עליון/תחתון של הכרטיס כולו לחיץ', VariantBigTapZone],
  ['4. פופאובר בחירה מהירה', 'טאפ פותח גריד 0-6 לבחירה ישירה', VariantPopoverGrid],
  ['5. זוהר לפי אודס', 'הריבוע זוהר בזהב לפי שווי הפגיעה המדויקת', VariantOddsGlow],
  ['6. אנימציית פליפ תלת-ממד', 'סיבוב מכני במקום slide רגיל', VariantFlip],
  ['7. פולס מגע', 'טבעת דופק ירוקה בכל טאפ', VariantPulse],
  ['8. צ׳יפים לתוצאות נפוצות', 'טאפ אחד ממלא את שני הבוררים יחד', VariantPresetChips],
  ['9. משטח דו-מימדי', 'נקודה אחת גוררים על ריבוע — X=חוץ, Y=בית', VariantPad],
  ['10. מקלדת מספרים', 'טאפ פותח קיפאד להזנה ישירה', VariantKeypad],
  ['11. סולם נקודות אנכי', 'טאפ ישיר על נקודה בסולם קופץ לערך', VariantTickScale],
  ['12. חוגה מסתובבת', 'גוררים בתנועה מעגלית סביב הריבוע', VariantDial],
  ['13. הפתעה אותי (שיפל)', 'כפתור זריקת קוביה שממלא תוצאה רנדומלית', VariantShuffle],
  ['14. חוכמת ההמונים', 'אחוז המשתמשים שניחשו את אותה תוצאה', VariantCrowd],
  ['15. ספירת כדורים', 'אייקוני ⚽ במקום ספרה יבשה', VariantBallTally],
  ['16. נעילת ביטחון', 'טאפ על התוצאה "נועל" אותה בזהב', VariantLockIn],
];

export default function AdminScorePickerDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 16 רעיונות לבורר תוצאה</h2>
        <p className="text-slate-500 text-sm">כולן חיות ולחיצות, דאטה קבוע לדוגמה. כלי דמו בלבד — לא משפיע על ScoreInput.jsx האמיתי.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VARIANTS.map(([label, desc, Comp]) => (
          <Frame key={label} label={label} desc={desc}>
            <Comp />
          </Frame>
        ))}
      </div>
    </div>
  );
}
