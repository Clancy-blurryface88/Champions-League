import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

// Demo-only: 30 numeric reveal/counting/settling effects for the points
// value shown in a participants leaderboard row — the "35.00 PTS" pill seen
// in PredictionsResults.jsx's PredictionsList/podium. This gallery is only
// about HOW THE NUMBER ITSELF animates when the row first renders/updates
// (shape/frame variants already covered separately in AdminScoreShapeDemo).
// Mock, self-contained, replayable. Doesn't touch PredictionsResults.jsx.

const BG = '#050a12';
const NAMES = ['דניאל כהן', 'נועה לוי', 'איתי מזרחי', 'רועי אברהם', 'שירה גל', 'עומר בר'];
function nameFor(i) { return NAMES[i % NAMES.length]; }
function fmt(n) { return n.toFixed(2); }

function useReplay() {
  const [key, setKey] = useState(0);
  return [key, () => setKey((k) => k + 1)];
}

function Frame({ label, desc, children }) {
  const [replay, bump] = useReplay();
  return (
    <div className="bg-slate-800/40 border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
      <div className="rounded-xl overflow-hidden p-3 flex items-center justify-center" style={{ background: BG, minHeight: 110 }}>
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

// ================= shared primitives =================

// Easings
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t) => (t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin(((t * 10 - 0.75) * (2 * Math.PI)) / 3) + 1);

// Generic tween: 0/from -> target, driven by rAF. Component remounts on
// replay (via the `key={k}` wrapper each variant uses), so no dep tracking needed.
function useCountUp(target, { duration = 1100, ease = easeOutCubic, from = 0, delay = 0 } = {}) {
  const [val, setVal] = useState(from);
  useEffect(() => {
    let raf = null, startT = null;
    const tick = (now) => {
      if (startT === null) startT = now;
      const p = Math.min(1, (now - startT) / duration);
      setVal(from + (target - from) * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => { raf = requestAnimationFrame(tick); }, delay);
    return () => { clearTimeout(timer); if (raf) cancelAnimationFrame(raf); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return val;
}

const DIGIT_POOL = '0123456789';
function randChar(pool) { return pool[Math.floor(Math.random() * pool.length)]; }
function randomize(str, pool) { return str.split('').map((c) => (c === '.' ? '.' : randChar(pool))).join(''); }

// Whole-string scramble that decelerates and lands exactly on target — the slot-machine mechanic.
function useScramble(target, { steps = 18, baseDelay = 40, growth = 1.15, charPool = DIGIT_POOL } = {}) {
  const [display, setDisplay] = useState(() => randomize(target, charPool));
  useEffect(() => {
    const timers = [];
    let delay = 0;
    for (let i = 1; i <= steps; i++) {
      delay += baseDelay * Math.pow(growth, i);
      const isLast = i === steps;
      timers.push(setTimeout(() => setDisplay(isLast ? target : randomize(target, charPool)), delay));
    }
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return display;
}

// Per-digit independent stopping schedule — used for cascading/desynced settle effects.
function useDigitCascade(target, { direction = 'ltr', baseSteps = 5, stepDelay = 80, charPool = DIGIT_POOL } = {}) {
  const chars = target.split('');
  const positions = chars.map((_, i) => i).filter((i) => chars[i] !== '.');
  const [display, setDisplay] = useState(() => chars.map((c) => (c === '.' ? '.' : randChar(charPool))));
  useEffect(() => {
    const order = direction === 'rtl' ? [...positions].reverse()
      : direction === 'random' ? [...positions].sort(() => Math.random() - 0.5)
      : positions;
    const timers = [];
    order.forEach((pos, orderIdx) => {
      const totalTicks = baseSteps + orderIdx * 3 + (direction === 'random' ? Math.floor(Math.random() * 3) : 0);
      for (let t = 1; t <= totalTicks; t++) {
        timers.push(setTimeout(() => {
          setDisplay((d) => { const next = [...d]; next[pos] = t === totalTicks ? chars[pos] : randChar(charPool); return next; });
        }, t * stepDelay));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return display.join('');
}

// Rank avatar + name + slot for the animated pill — mirrors a real participants-table row.
function Avatar({ rank }) {
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.22)', color: '#94a3b8' }}>
      {rank}
    </div>
  );
}
function Row({ rank = 1, name, children }) {
  return (
    <div className="flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg" style={{ width: 226, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Avatar rank={rank} />
        <span className="text-white text-xs font-medium truncate">{name}</span>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}
// Matches ptsBadgeStyle from PredictionsResults.jsx (exact-hit green look).
function Pill({ children, style, className = '' }) {
  return (
    <span className={`text-xs font-bold tabular-nums px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${className}`}
      style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(52,211,153,0.35)', color: '#6ee7b7', whiteSpace: 'nowrap', ...style }}>
      {children}
    </span>
  );
}

// Wraps a self-animating value component into a full row variant (the common case).
function makeSimpleVariant(ValueComp, { rank = 1, name, target, pillStyle }) {
  return function Variant({ k }) {
    return (
      <div key={k}>
        <Row rank={rank} name={name}>
          <Pill style={pillStyle}><ValueComp target={target} /> PTS</Pill>
        </Row>
      </div>
    );
  };
}

// ================= Group A — mechanical / rolling counters (1-10) =================

// 1. Slot machine — rapid random-digit cycling that decelerates and lands on the real value
function SlotValue({ target }) {
  const str = fmt(target);
  const display = useScramble(str, { steps: 20, baseDelay: 35, growth: 1.16 });
  const settled = display === str;
  return <span style={{ textShadow: settled ? 'none' : '0 0 6px rgba(110,231,183,0.55)' }}>{display}</span>;
}
const V1 = makeSimpleVariant(SlotValue, { rank: 1, name: nameFor(0), target: 35.00 });

// 2. Odometer roll — each digit column rolls independently, rightmost settles first
function OdometerDigit({ digit, delay = 0, height = 20 }) {
  const spins = 2;
  const totalSteps = spins * 10 + Number(digit);
  const strip = Array.from({ length: totalSteps + 1 }, (_, i) => i % 10);
  return (
    <span style={{ height, width: 11, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle' }}>
      <motion.span style={{ display: 'block' }} initial={{ y: 0 }} animate={{ y: -totalSteps * height }} transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
        {strip.map((d, i) => <span key={i} style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d}</span>)}
      </motion.span>
    </span>
  );
}
function OdometerValue({ target }) {
  const str = fmt(target);
  return (
    <span style={{ display: 'inline-flex' }}>
      {str.split('').map((c, i) => c === '.' ? <span key={i}>.</span> : <OdometerDigit key={i} digit={c} delay={str.slice(i + 1).replace('.', '').length * 0.12} />)}
    </span>
  );
}
const V2 = makeSimpleVariant(OdometerValue, { rank: 2, name: nameFor(1), target: 12.50 });

// 3. Split-flap board — train-station departure-board flip per digit
function FlapDigit({ target, delay = 0, cycles = 5 }) {
  const [seq] = useState(() => { const arr = Array.from({ length: cycles }, () => String(Math.floor(Math.random() * 10))); arr.push(target); return arr; });
  const [i, setI] = useState(0);
  useEffect(() => {
    let timer;
    const step = (idx) => { setI(idx); if (idx < seq.length - 1) timer = setTimeout(() => step(idx + 1), 85); };
    timer = setTimeout(() => step(0), delay);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span className="relative inline-flex items-center justify-center overflow-hidden rounded-sm" style={{ width: 12, height: 18, perspective: 200, background: '#0b1220', border: '1px solid rgba(255,255,255,0.14)' }}>
      <AnimatePresence mode="popLayout">
        <motion.span key={i} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }} transition={{ duration: 0.12 }}
          className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">{seq[i]}</motion.span>
      </AnimatePresence>
    </span>
  );
}
function FlapValue({ target }) {
  const str = fmt(target);
  return <span className="inline-flex items-center gap-px">{str.split('').map((c, i) => c === '.' ? <span key={i} className="text-white">.</span> : <FlapDigit key={i} target={c} delay={i * 70} />)}</span>;
}
const V3 = makeSimpleVariant(FlapValue, { rank: 1, name: nameFor(2), target: 27.50 });

// 4. Simple count-up — smooth numeric tween from 0, no per-digit mechanics
function CountUpValue({ target }) {
  const v = useCountUp(target, { duration: 1100, ease: easeOutCubic });
  return <span>{fmt(v)}</span>;
}
const V4 = makeSimpleVariant(CountUpValue, { rank: 3, name: nameFor(3), target: 8.00 });

// 5. Slot-machine with per-digit stopping — leftmost digit stops first, cascading right
function CascadeValue({ target }) {
  const str = fmt(target);
  const display = useDigitCascade(str, { direction: 'ltr', baseSteps: 5, stepDelay: 80 });
  return <span>{display}</span>;
}
const V5 = makeSimpleVariant(CascadeValue, { rank: 1, name: nameFor(4), target: 41.50 });

// 6. Mechanical click-wheel — bike-lock-style tumbler rotating into place
function TumblerDigit({ target, delay = 0 }) {
  const [seq] = useState(() => { const arr = Array.from({ length: 4 }, () => String(Math.floor(Math.random() * 10))); arr.push(target); return arr; });
  const [i, setI] = useState(0);
  useEffect(() => {
    let timer;
    const step = (idx) => { setI(idx); if (idx < seq.length - 1) timer = setTimeout(() => step(idx + 1), 100); };
    timer = setTimeout(() => step(0), delay);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span className="relative inline-flex items-center justify-center rounded" style={{ width: 12, height: 16, perspective: 160, background: 'linear-gradient(180deg,#2a3242,#181d29)', border: '1px solid #3a4356' }}>
      <AnimatePresence mode="popLayout">
        <motion.span key={i} initial={{ rotateX: -70, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 70, opacity: 0 }} transition={{ duration: 0.1 }}
          className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: '#6ee7b7' }}>{seq[i]}</motion.span>
      </AnimatePresence>
    </span>
  );
}
function TumblerValue({ target }) {
  const str = fmt(target);
  return <span className="inline-flex items-center gap-px">{str.split('').map((c, i) => c === '.' ? <span key={i} className="text-white">.</span> : <TumblerDigit key={i} target={c} delay={i * 60} />)}</span>;
}
const V6 = makeSimpleVariant(TumblerValue, { rank: 2, name: nameFor(5), target: 22.50 });

// 7. Coin-payout tally — small coin stack rapidly appends while the number ticks up alongside
function CoinPayoutValue({ target }) {
  const v = useCountUp(target, { duration: 1300, ease: easeOutCubic });
  const coinCount = Math.max(0, Math.min(6, Math.round((v / target) * 6)));
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex">
        {Array.from({ length: coinCount }).map((_, i) => (
          <motion.span key={i} initial={{ scale: 0, y: -4 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 16 }}
            className="rounded-full inline-block" style={{ width: 8, height: 8, marginInlineStart: i === 0 ? 0 : -3, background: 'linear-gradient(160deg,#ffe9a8,#d4a017)', border: '1px solid #a67c00' }} />
        ))}
      </span>
      <span>{fmt(v)}</span>
    </span>
  );
}
const V7 = makeSimpleVariant(CoinPayoutValue, { rank: 1, name: nameFor(0), target: 35.00 });

// 8. Analog gauge needle sweep feeding a digital readout
function GaugeSweepValue({ target }) {
  const v = useCountUp(target, { duration: 1200, ease: easeOutCubic });
  const pct = Math.min(1, v / target);
  const angle = Math.PI * (1 - pct), cx = 10, cy = 10, R = 8;
  const x2 = cx + R * Math.cos(angle), y2 = cy - R * Math.sin(angle);
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="20" height="12" viewBox="0 0 20 12">
        <path d="M2,10 A8,8 0 0 1 18,10" fill="none" stroke="rgba(110,231,183,0.25)" strokeWidth="2" />
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#6ee7b7" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>{fmt(v)}</span>
    </span>
  );
}
const V8 = makeSimpleVariant(GaugeSweepValue, { rank: 4, name: nameFor(1), target: 19.00 });

// 9. Cash-register style rapid digit clatter — fast per-digit increments, slightly desynced
function CashRegisterValue({ target }) {
  const str = fmt(target);
  const display = useDigitCascade(str, { direction: 'random', baseSteps: 3, stepDelay: 55 });
  return <span style={{ letterSpacing: 1 }}>{display}</span>;
}
const V9 = makeSimpleVariant(CashRegisterValue, { rank: 2, name: nameFor(2), target: 12.50 });

// 10. Overshoot tick — rapid increment that overshoots past the target then springs back exactly onto it
function OvershootValue({ target }) {
  const v = useCountUp(target, { duration: 900, ease: easeOutElastic });
  return <span>{fmt(Math.max(0, v))}</span>;
}
const V10 = makeSimpleVariant(OvershootValue, { rank: 1, name: nameFor(3), target: 27.50 });

// ================= Group B — motion / physical reveals (11-20) =================

// 11. Bounce-in scale pop
function V11({ k }) {
  return (
    <div key={k}>
      <Row rank={1} name={nameFor(0)}>
        <motion.span style={{ display: 'inline-block' }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 12 }}>
          <Pill>{fmt(12.50)} PTS</Pill>
        </motion.span>
      </Row>
    </div>
  );
}

// 12. Vertical slide-up cascade per digit
function SlideUpValue({ target }) {
  const str = fmt(target);
  return <span className="inline-flex">{str.split('').map((c, i) => <motion.span key={i} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05, duration: 0.35, ease: 'easeOut' }}>{c}</motion.span>)}</span>;
}
const V12 = makeSimpleVariant(SlideUpValue, { rank: 2, name: nameFor(1), target: 8.00 });

// 13. Magnetic snap — digits fly in from off to the sides and snap into place with overshoot
function MagnetValue({ target }) {
  const str = fmt(target);
  return (
    <span className="inline-flex">
      {str.split('').map((c, i) => {
        const fromX = (i % 2 === 0 ? -1 : 1) * (16 + i * 4);
        return <motion.span key={i} initial={{ x: fromX, y: -14, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ delay: i * 0.04, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}>{c}</motion.span>;
      })}
    </span>
  );
}
const V13 = makeSimpleVariant(MagnetValue, { rank: 3, name: nameFor(2), target: 41.50 });

// 14. Shake-then-settle — badge appears immediately then wobbles and calms
function V14({ k }) {
  return (
    <div key={k}>
      <Row rank={1} name={nameFor(3)}>
        <motion.span style={{ display: 'inline-block' }} animate={{ x: [0, -6, 6, -4, 4, -2, 2, 0] }} transition={{ duration: 0.5, ease: 'easeOut' }}>
          <Pill>{fmt(22.50)} PTS</Pill>
        </motion.span>
      </Row>
    </div>
  );
}

// 15. Dice-roll physics — the whole pill tumbles in 3D like a die then settles showing the value
function V15({ k }) {
  return (
    <div key={k}>
      <Row rank={2} name={nameFor(4)}>
        <div style={{ perspective: 260 }}>
          <motion.div initial={{ rotateX: 0, rotateY: 0, scale: 0.75 }} animate={{ rotateX: [0, 320, 640, 720], rotateY: [0, 260, 500, 720], scale: [0.75, 0.9, 1, 1] }}
            transition={{ duration: 0.9, ease: 'easeOut', times: [0, 0.45, 0.8, 1] }}>
            <Pill>{fmt(19.00)} PTS</Pill>
          </motion.div>
        </div>
      </Row>
    </div>
  );
}

// 16. Ripple/water-drop distortion that resolves into the sharp number
function RippleValue({ target }) {
  return (
    <span className="relative inline-flex items-center justify-center">
      <motion.span className="absolute rounded-full" style={{ inset: -6, border: '1px solid rgba(110,231,183,0.5)' }} initial={{ scale: 0.3, opacity: 0.8 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} />
      <motion.span initial={{ filter: 'blur(6px)', scale: 0.85 }} animate={{ filter: 'blur(0px)', scale: 1 }} transition={{ duration: 0.7 }}>{fmt(target)}</motion.span>
    </span>
  );
}
const V16 = makeSimpleVariant(RippleValue, { rank: 1, name: nameFor(5), target: 6.00 });

// 17. Liquid fill / mercury rise — the pill fills like a thermometer as the number counts up
function LiquidPill({ target }) {
  const v = useCountUp(target, { duration: 1300, ease: easeOutCubic });
  const pct = Math.min(100, (v / target) * 100);
  return (
    <span className="relative inline-flex items-center justify-center px-2.5 py-1 rounded-lg overflow-hidden text-xs font-bold tabular-nums" style={{ border: '1px solid rgba(52,211,153,0.35)', color: '#eafff5', minWidth: 78, whiteSpace: 'nowrap' }}>
      <span className="absolute inset-x-0 bottom-0" style={{ height: `${pct}%`, background: 'linear-gradient(180deg, rgba(52,211,153,0.55), rgba(16,185,129,0.8))' }} />
      <span className="relative">{fmt(v)} PTS</span>
    </span>
  );
}
function V17({ k }) {
  return <div key={k}><Row rank={1} name={nameFor(0)}><LiquidPill target={35.00} /></Row></div>;
}

// 18. Confetti-burst count-up — small particle burst plays once the number finishes counting
function ConfettiValue({ target, onDone }) {
  const v = useCountUp(target, { duration: 900, ease: easeOutCubic });
  useEffect(() => { const t = setTimeout(() => onDone?.(), 950); return () => clearTimeout(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <Pill>{fmt(v)} PTS</Pill>;
}
function V18({ k }) {
  const [done, setDone] = useState(false);
  return (
    <div key={k}>
      <Row rank={1} name={nameFor(1)}>
        <span className="relative inline-block">
          <ConfettiValue target={8.00} onDone={() => setDone(true)} />
          {done && Array.from({ length: 8 }).map((_, i) => {
            const ang = (i / 8) * 2 * Math.PI;
            return <motion.span key={i} className="absolute rounded-full" style={{ width: 4, height: 4, left: '50%', top: '50%', background: ['#6ee7b7', '#fde68a', '#93c5fd', '#fca5a5'][i % 4] }}
              initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(ang) * 26, y: Math.sin(ang) * 26, opacity: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} />;
          })}
        </span>
      </Row>
    </div>
  );
}

// 19. Comet-trail arc fill (companion to this app's AnimatedDonut semicircle-comet) synced with count-up
function CometValue({ target }) {
  const v = useCountUp(target, { duration: 1200, ease: easeOutCubic });
  const pct = Math.min(1, v / target);
  const R = 9, cx = 10, cy = 10;
  const angle = Math.PI * (1 - pct);
  const tipX = cx + R * Math.cos(angle), tipY = cy - R * Math.sin(angle);
  const arcLen = Math.PI * R, fullC = 2 * Math.PI * R;
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="20" height="12" viewBox="0 0 20 12" style={{ overflow: 'visible' }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1e293b" strokeWidth="2.5" strokeDasharray={`${arcLen} ${fullC - arcLen}`} style={{ transform: 'rotate(180deg)', transformOrigin: '10px 10px' }} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeDasharray={`${pct * arcLen} ${fullC}`} strokeLinecap="round" style={{ transform: 'rotate(180deg)', transformOrigin: '10px 10px' }} />
        <circle cx={tipX} cy={tipY} r="1.6" fill="#6ee7b7" />
      </svg>
      <span>{fmt(v)}</span>
    </span>
  );
}
const V19 = makeSimpleVariant(CometValue, { rank: 2, name: nameFor(2), target: 41.50 });

// 20. Pulsing radar-ping rings expanding outward from the number as it settles
function RadarValue({ target }) {
  const v = useCountUp(target, { duration: 1300, ease: easeOutCubic });
  return <Pill>{fmt(v)} PTS</Pill>;
}
function V20({ k }) {
  return (
    <div key={k}>
      <Row rank={3} name={nameFor(3)}>
        <span className="relative inline-flex items-center justify-center">
          {[0, 1].map((i) => <motion.span key={i} className="absolute rounded-lg" style={{ inset: -4, border: '1px solid rgba(110,231,183,0.5)' }} initial={{ scale: 1, opacity: 0.6 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 1, delay: i * 0.35, repeat: 1, repeatDelay: 0.1 }} />)}
          <RadarValue target={22.50} />
        </span>
      </Row>
    </div>
  );
}

// ================= Group C — stylistic / sci-fi / novelty reveals (21-30) =================

// 21. Glitch/scramble-text — random digits/symbols flicker then resolve, Matrix/hacker-style decode
const GLITCH_POOL = '0123456789#$%&@*';
function GlitchValue({ target }) {
  const str = fmt(target);
  const display = useScramble(str, { steps: 14, baseDelay: 32, growth: 1.08, charPool: GLITCH_POOL });
  const settled = display === str;
  return <span style={{ fontFamily: 'monospace', color: settled ? '#eafff5' : '#22ff88', opacity: settled ? 1 : 0.85 }}>{display}</span>;
}
const V21 = makeSimpleVariant(GlitchValue, { rank: 1, name: nameFor(4), target: 35.00 });

// 22. Chromatic-aberration converge — RGB-split ghosting converges into a sharp single-color number
function ChromaValue({ target }) {
  const str = fmt(target);
  return (
    <span className="relative inline-block" style={{ minWidth: 44 }}>
      <motion.span className="absolute inset-0" style={{ color: '#ff3b5c' }} initial={{ x: -4 }} animate={{ x: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>{str}</motion.span>
      <motion.span className="absolute inset-0" style={{ color: '#3bb2ff' }} initial={{ x: 4 }} animate={{ x: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>{str}</motion.span>
      <span className="relative">{str}</span>
    </span>
  );
}
const V22 = makeSimpleVariant(ChromaValue, { rank: 2, name: nameFor(5), target: 12.50 });

// 23. Neon flicker-on — the number flickers like a neon sign powering on, then stays lit
function NeonFlickerValue({ target }) {
  return (
    <motion.span animate={{ opacity: [0, 1, 0.2, 1, 0.1, 1, 1] }} transition={{ duration: 1.1, times: [0, 0.15, 0.25, 0.35, 0.45, 0.6, 1] }} style={{ textShadow: '0 0 6px #6ee7b7, 0 0 14px rgba(110,231,183,0.6)' }}>
      {fmt(target)}
    </motion.span>
  );
}
const V23 = makeSimpleVariant(NeonFlickerValue, { rank: 1, name: nameFor(0), target: 27.50 });

// 24. Holographic scan-line reveal — a scan line sweeps down revealing the number, sci-fi HUD feel
function ScanlineValue({ target }) {
  return (
    <span className="relative inline-block">
      <motion.span initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 0.9, ease: 'easeInOut' }}>{fmt(target)}</motion.span>
      <motion.span className="absolute left-0 right-0" style={{ height: 2, background: 'rgba(110,231,183,0.9)', boxShadow: '0 0 6px #6ee7b7' }} initial={{ top: '0%' }} animate={{ top: '100%' }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
    </span>
  );
}
const V24 = makeSimpleVariant(ScanlineValue, { rank: 4, name: nameFor(1), target: 8.00 });

// 25. Typewriter digit-by-digit reveal with a blinking cursor
function TypewriterValue({ target }) {
  const str = fmt(target);
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { i++; setN(i); if (i >= str.length) clearInterval(iv); }, 90);
    return () => clearInterval(iv);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span dir="ltr" className="inline-flex items-center">
      {str.slice(0, n)}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }} style={{ display: 'inline-block', width: 2, height: 11, background: '#6ee7b7', marginInlineStart: 1 }} />
    </span>
  );
}
const V25 = makeSimpleVariant(TypewriterValue, { rank: 1, name: nameFor(2), target: 41.50 });

// 26. Blur-to-focus — starts heavily blurred and sharpens into place as it counts up
function BlurFocusValue({ target }) {
  const v = useCountUp(target, { duration: 1100, ease: easeOutCubic });
  const pct = v / target;
  return <span style={{ filter: `blur(${Math.max(0, (1 - pct) * 6)}px)` }}>{fmt(v)}</span>;
}
const V26 = makeSimpleVariant(BlurFocusValue, { rank: 2, name: nameFor(3), target: 22.50 });

// 27. Gradient sweep wipe — a colored gradient wipes across the number, revealing it like a spotlight
function GradientSweepValue({ target }) {
  const str = fmt(target);
  return (
    <span className="relative inline-block">
      <span style={{ opacity: 0.2 }}>{str}</span>
      <motion.span className="absolute inset-0 overflow-hidden" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 0.8, ease: 'easeInOut' }}>
        <span style={{ background: 'linear-gradient(90deg,#fde68a,#6ee7b7)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>{str}</span>
      </motion.span>
    </span>
  );
}
const V27 = makeSimpleVariant(GradientSweepValue, { rank: 3, name: nameFor(4), target: 6.00 });

// 28. Sparkle-trail count-up — small star particles trail behind the increasing digits
function SparkleValue({ target }) {
  const v = useCountUp(target, { duration: 1200, ease: easeOutCubic });
  const [sparkles, setSparkles] = useState([]);
  const prev = useRef(v);
  useEffect(() => {
    if (Math.floor(v * 10) !== Math.floor(prev.current * 10)) {
      const id = Math.random();
      setSparkles((s) => [...s.slice(-5), { id, x: Math.random() * 20 - 10, y: Math.random() * 10 - 5 }]);
    }
    prev.current = v;
  }, [v]);
  return (
    <span className="relative inline-block">
      {sparkles.map((s) => <motion.span key={s.id} className="absolute" style={{ left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)`, color: '#fde68a', fontSize: 9 }} initial={{ opacity: 1, scale: 0.6, y: 0 }} animate={{ opacity: 0, scale: 1.2, y: -8 }} transition={{ duration: 0.6 }}>✦</motion.span>)}
      <span className="relative">{fmt(v)}</span>
    </span>
  );
}
const V28 = makeSimpleVariant(SparkleValue, { rank: 1, name: nameFor(5), target: 35.00 });

// 29. Stamp/impact slam — the number stamps down onto the pill with a hard impact and a brief flash
function V29({ k }) {
  return (
    <div key={k}>
      <Row rank={1} name={nameFor(0)}>
        <span className="relative inline-block">
          <motion.span style={{ display: 'inline-block' }} initial={{ scale: 2.6, opacity: 0, rotate: -8 }} animate={{ scale: [2.6, 0.9, 1], opacity: 1, rotate: [-8, -8, 0] }} transition={{ duration: 0.45, times: [0, 0.6, 1], ease: 'easeOut' }}>
            <Pill>{fmt(19.00)} PTS</Pill>
          </motion.span>
          <motion.span className="absolute inset-0 rounded-lg pointer-events-none" style={{ background: '#fff' }} initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.35, delay: 0.22 }} />
        </span>
      </Row>
    </div>
  );
}

// 30. Coin-flip 3D rotation — the whole pill flips over, revealing the final number on its front face
function V30({ k }) {
  return (
    <div key={k}>
      <Row rank={1} name={nameFor(1)}>
        <div style={{ perspective: 300 }}>
          <motion.div className="relative" style={{ transformStyle: 'preserve-3d' }} initial={{ rotateY: 0 }} animate={{ rotateY: 180 }} transition={{ duration: 0.9, ease: 'easeInOut' }}>
            <div style={{ backfaceVisibility: 'hidden' }}>
              <Pill style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}>?? PTS</Pill>
            </div>
            <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <Pill>{fmt(6.00)} PTS</Pill>
            </div>
          </motion.div>
        </div>
      </Row>
    </div>
  );
}

// ================= variant registry =================

const VARIANTS_1_10 = [
  ['1. סלוט מאשין', 'ספרות אקראיות מסתחררות מהר ומאטות עד נחיתה על הערך האמיתי', V1],
  ['2. גלגלון קילומטראז׳', 'כל עמודת ספרה מתגלגלת בנפרד — הספרה הימנית נעצרת ראשונה', V2],
  ['3. לוח דפדוף (Split-Flap)', 'דפדוף ספרה-ספרה כמו לוח יציאות בתחנת רכבת', V3],
  ['4. ספירה חלקה', 'טוויין מספרי חלק מ-0 עד הערך, בלי מכניקת ספרות', V4],
  ['5. סלוט עם עצירה מדורגת', 'הספרה השמאלית נעצרת ראשונה, ואז הבאה — מדורג ימינה', V5],
  ['6. גלגל טמבלר מכני', 'מסתובב כמו מנעול אופניים ונוקש למקומו', V6],
  ['7. תשלום מטבעות', 'ערימת מטבעות קטנה מצטברת מהר לצד המספר העולה', V7],
  ['8. מחוג מד אנלוגי', 'מחוג קשת קטן סורק בסנכרון עם ספירת המספר', V8],
  ['9. קופה רושמת', 'עדכון ספרות מהיר וקצת לא מסונכרן, תחושה מכנית-פרקוסיבית', V9],
  ['10. חריגה וקפיצה חזרה', 'עלייה מהירה שחורגת מעבר לערך ואז קופצת בדיוק אליו', V10],
];

const VARIANTS_11_20 = [
  ['11. קפיצת קנה מידה', 'המספר נכנס מ-0 עם קפיץ elastic פנימה', V11],
  ['12. החלקה מלמטה למעלה', 'כל ספרה מחליקה פנימה מלמטה, בפיזור קל', V12],
  ['13. הצמדה מגנטית', 'ספרות "עפות" מהצדדים ונצמדות למקומן עם חריגה קלה', V13],
  ['14. רעד ואז רגיעה', 'התג מופיע מיד ואז מתנדנד לפני שנרגע', V14],
  ['15. גלגול קוביה', 'כל התג מתהפך בתלת-ממד כמו קוביית משחק ונוחת על הערך', V15],
  ['16. עיוות אדווה', 'טבעת אדווה מתפשטת בעודה המספר מתמקד מטושטש לחד', V16],
  ['17. מילוי נוזלי', 'התג מתמלא כמו מדחום בזמן שהמספר סופר למעלה', V17],
  ['18. פרץ קונפטי', 'חלקיקים קטנים מתפזרים ברגע שהספירה מסתיימת', V18],
  ['19. שביל שביט', 'קשת שביט קטנה (בהשראת AnimatedDonut) מתמלאת בסנכרון עם הספירה', V19],
  ['20. טבעות רדאר', 'טבעות פועמות מתפשטות מהמספר עד שהוא מתייצב', V20],
];

const VARIANTS_21_30 = [
  ['21. גליץ׳/דיקוד האקרים', 'תווים אקראיים מהבהבים במהירות ואז נפתרים למספר האמיתי', V21],
  ['22. התכנסות כרומטית', 'רוחות RGB מתפצלות ומתכנסות לצבע אחד חד', V22],
  ['23. הבהוב ניאון', 'המספר מהבהב כמו שלט ניאון שמתחמם ואז נשאר דלוק', V23],
  ['24. סריקה הולוגרפית', 'קו סריקה חוצה ומגלה את המספר בהדרגה, תחושת HUD מדע בדיוני', V24],
  ['25. מכונת כתיבה', 'ספרות מוקלדות אחת-אחת עם סמן מהבהב', V25],
  ['26. מטושטש לחד', 'המספר מתחיל מטושטש ומתחדד תוך כדי ספירה למעלה', V26],
  ['27. שטיפת גרדיאנט', 'גרדיאנט צבעוני נסרק על פני המספר וחושף אותו כמו זרקור', V27],
  ['28. שביל ניצוצות', 'כוכביות קטנות עוקבות אחרי הספרות בזמן שהן עולות', V28],
  ['29. חותמת חבטה', 'המספר "נוחת" חזק על התג עם הבזק קצר, כמו חותמת גומי', V29],
  ['30. הפיכת מטבע תלת-ממד', 'כל התג מתהפך ב-3D וחושף את הערך הסופי על הפנים', V30],
];

export default function AdminScoreEffectsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 30 אפקטים לחשיפת ניקוד בטבלת המשתתפים</h2>
        <p className="text-slate-500 text-sm">איך המספר עצמו נחשף/נספר/מתייצב כשהשורה נטענת — לא צורת המסגרת (זה כבר כוסה ב-40 צורות לתא התוצאה). כלי דמו בלבד — לא משפיע על PredictionsResults.jsx.</p>
      </div>
      <div>
        <h3 className="text-sm font-bold text-white/70 mb-3">מכניקות סופרים / מסתובבים — 1–10</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VARIANTS_1_10.map(([label, desc, Comp]) => <Frame key={label} label={label} desc={desc}>{(k) => <Comp k={k} />}</Frame>)}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-white/70 mb-3">תנועה / חשיפה פיזית — 11–20</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VARIANTS_11_20.map(([label, desc, Comp]) => <Frame key={label} label={label} desc={desc}>{(k) => <Comp k={k} />}</Frame>)}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-white/70 mb-3">סגנוני / מדע בדיוני / חדשני — 21–30</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VARIANTS_21_30.map(([label, desc, Comp]) => <Frame key={label} label={label} desc={desc}>{(k) => <Comp k={k} />}</Frame>)}
        </div>
      </div>
    </div>
  );
}
