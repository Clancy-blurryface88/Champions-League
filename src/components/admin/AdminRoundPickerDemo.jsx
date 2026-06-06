import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Play, Pause } from 'lucide-react';

const ROUNDS = ['Group Stage - 1', 'Group Stage - 2', 'Group Stage - 3', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];

function usePicker(init = 1) {
  const [idx, setIdx] = useState(init);
  const [dir, setDir] = useState(1);
  const prev = () => { if (idx > 0) { setDir(-1); setIdx(i => i - 1); } };
  const next = () => { if (idx < ROUNDS.length - 1) { setDir(1); setIdx(i => i + 1); } };
  return { idx, dir, round: ROUNDS[idx], prev, next, canPrev: idx > 0, canNext: idx < ROUNDS.length - 1, setIdx, setDir };
}

function Card({ num, title, desc, children }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
      <div className="flex gap-2">
        <span className="font-mono text-[10px] text-slate-600 mt-0.5 shrink-0">#{String(num).padStart(2, '0')}</span>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">{title}</p>
          <p className="text-slate-500 text-[10px] mt-0.5 leading-tight">{desc}</p>
        </div>
      </div>
      <div className="flex items-center justify-center min-h-[80px]">{children}</div>
    </div>
  );
}

function CBtn({ onClick, disabled, children, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-20 transition-all shrink-0"
      style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.60)', ...style }}>
      {children}
    </button>
  );
}

function Dots({ count, active, onGo, color = '#f5c518' }) {
  return (
    <div className="flex gap-1 mt-2 justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <button key={i} onClick={() => onGo(i)}
          style={{ width: i === active ? 14 : 6, height: 6, borderRadius: 3, background: i === active ? color : 'rgba(255,255,255,0.20)', transition: 'all 0.2s' }} />
      ))}
    </div>
  );
}

// ─── 01 Flip Board (current) ──────────────────────────────────────────────────
function D01() {
  const p = usePicker();
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-3">
        <CBtn onClick={p.prev} disabled={!p.canPrev}><ChevronUp className="w-4 h-4" /></CBtn>
        <AnimatePresence mode="wait">
          <motion.div key={p.idx}
            initial={{ rotateX: -80, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 80, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ perspective: 500, background: 'rgba(245,197,24,0.09)', border: '1px solid rgba(245,197,24,0.35)', borderRadius: 12 }}
            className="px-5 py-2 min-w-[130px] text-center">
            <span style={{ color: '#f5c518', fontWeight: 700, fontSize: 12 }}>{p.round}</span>
          </motion.div>
        </AnimatePresence>
        <CBtn onClick={p.next} disabled={!p.canNext}><ChevronDown className="w-4 h-4" /></CBtn>
      </div>
      <Dots count={ROUNDS.length} active={p.idx} onGo={i => { p.setDir(i > p.idx ? 1 : -1); p.setIdx(i); }} />
    </div>
  );
}

// ─── 02 Horizontal Slide — Blue ──────────────────────────────────────────────
function D02() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-2">
      <CBtn onClick={p.next} disabled={!p.canNext} style={{ border: '1px solid rgba(59,130,246,0.4)', color: '#93c5fd' }}>
        <ChevronLeft className="w-4 h-4" />
      </CBtn>
      <div style={{ width: 140, overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={p.dir}>
          <motion.div key={p.idx} custom={p.dir}
            variants={{ enter: d => ({ x: d * 60, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: d => ({ x: -d * 60, opacity: 0 }) }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="text-center py-2 rounded-xl"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.35)' }}>
            <span style={{ color: '#93c5fd', fontWeight: 700, fontSize: 12 }}>{p.round}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <CBtn onClick={p.prev} disabled={!p.canPrev} style={{ border: '1px solid rgba(59,130,246,0.4)', color: '#93c5fd' }}>
        <ChevronRight className="w-4 h-4" />
      </CBtn>
    </div>
  );
}

// ─── 03 Scale Pop + Dots ─────────────────────────────────────────────────────
function D03() {
  const p = usePicker();
  return (
    <div className="flex flex-col items-center gap-1">
      <AnimatePresence mode="wait">
        <motion.div key={p.idx}
          initial={{ scale: 0.78, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.78, opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="px-6 py-2.5 rounded-full text-center cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)' }}
          onClick={p.next}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>{p.round}</span>
        </motion.div>
      </AnimatePresence>
      <Dots count={ROUNDS.length} active={p.idx} onGo={i => { p.setDir(i > p.idx ? 1 : -1); p.setIdx(i); }} color="#fff" />
    </div>
  );
}

// ─── 04 3D Cube rotateY ───────────────────────────────────────────────────────
function D04() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-3">
      <CBtn onClick={p.next} disabled={!p.canNext} style={{ border: '1px solid rgba(245,197,24,0.4)', color: '#f5c518' }}>
        <ChevronLeft className="w-4 h-4" />
      </CBtn>
      <div style={{ perspective: 600, width: 140 }}>
        <AnimatePresence mode="wait" custom={p.dir}>
          <motion.div key={p.idx} custom={p.dir}
            variants={{ enter: d => ({ rotateY: d * -90, opacity: 0 }), center: { rotateY: 0, opacity: 1 }, exit: d => ({ rotateY: d * 90, opacity: 0 }) }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="text-center py-2 rounded-xl"
            style={{ background: 'rgba(245,197,24,0.10)', border: '1px solid rgba(245,197,24,0.30)', transformStyle: 'preserve-3d' }}>
            <span style={{ color: '#fde68a', fontWeight: 700, fontSize: 12 }}>{p.round}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <CBtn onClick={p.prev} disabled={!p.canPrev} style={{ border: '1px solid rgba(245,197,24,0.4)', color: '#f5c518' }}>
        <ChevronRight className="w-4 h-4" />
      </CBtn>
    </div>
  );
}

// ─── 05 Neon Green Glow ───────────────────────────────────────────────────────
function D05() {
  const p = usePicker();
  const neon = { color: '#39ff14', border: '1px solid #39ff14', boxShadow: '0 0 8px #39ff14aa' };
  return (
    <div className="flex items-center gap-3">
      <CBtn onClick={p.prev} disabled={!p.canPrev} style={{ ...neon, borderRadius: '50%', background: 'transparent' }}>
        <ChevronUp className="w-4 h-4" />
      </CBtn>
      <AnimatePresence mode="wait">
        <motion.div key={p.idx}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.18 }}
          className="px-5 py-2 rounded-lg min-w-[130px] text-center"
          style={{ background: 'rgba(57,255,20,0.06)', border: '1px solid #39ff1470', boxShadow: '0 0 16px #39ff1433' }}>
          <span style={{ color: '#39ff14', fontWeight: 700, fontSize: 12, fontFamily: 'monospace' }}>{p.round}</span>
        </motion.div>
      </AnimatePresence>
      <CBtn onClick={p.next} disabled={!p.canNext} style={{ ...neon, borderRadius: '50%', background: 'transparent' }}>
        <ChevronDown className="w-4 h-4" />
      </CBtn>
    </div>
  );
}

// ─── 06 Liquid Glass Full ─────────────────────────────────────────────────────
function D06() {
  const p = usePicker();
  const glass = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 12 };
  return (
    <div className="flex items-center gap-2">
      <button onClick={p.next} disabled={!p.canNext}
        className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-20"
        style={{ ...glass, borderRadius: '50%' }}>
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <AnimatePresence mode="wait">
        <motion.div key={p.idx}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-5 py-2 min-w-[130px] text-center" style={glass}>
          <span style={{ color: 'rgba(255,255,255,0.90)', fontWeight: 600, fontSize: 12 }}>{p.round}</span>
        </motion.div>
      </AnimatePresence>
      <button onClick={p.prev} disabled={!p.canPrev}
        className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-20"
        style={{ ...glass, borderRadius: '50%' }}>
        <ChevronRight className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

// ─── 07 Split Flap (Airport Board) ───────────────────────────────────────────
function D07() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-3">
      <CBtn onClick={p.prev} disabled={!p.canPrev} style={{ background: '#111', border: '1px solid #333', color: '#fff' }}>
        <ChevronUp className="w-4 h-4" />
      </CBtn>
      <div style={{ background: '#111', border: '2px solid #333', borderRadius: 6, padding: '6px 20px', minWidth: 130, textAlign: 'center', boxShadow: 'inset 0 2px 8px #000' }}>
        <AnimatePresence mode="wait">
          <motion.div key={p.idx}
            initial={{ rotateX: -90 }} animate={{ rotateX: 0 }} exit={{ rotateX: 90 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ perspective: 300, transformStyle: 'preserve-3d' }}>
            <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>{p.round}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <CBtn onClick={p.next} disabled={!p.canNext} style={{ background: '#111', border: '1px solid #333', color: '#fff' }}>
        <ChevronDown className="w-4 h-4" />
      </CBtn>
    </div>
  );
}

// ─── 08 Terminal ─────────────────────────────────────────────────────────────
function D08() {
  const p = usePicker();
  const [blink, setBlink] = useState(true);
  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 500); return () => clearInterval(t); }, []);
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ background: '#0a0a0a', border: '1px solid #1a3a1a', borderRadius: 8, padding: '8px 16px', minWidth: 160, fontFamily: 'monospace' }}>
        <span style={{ color: '#22c55e', fontSize: 11 }}>{'> '}</span>
        <AnimatePresence mode="wait">
          <motion.span key={p.idx}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ color: '#4ade80', fontSize: 11, fontWeight: 700 }}>
            {p.round.toUpperCase()}
          </motion.span>
        </AnimatePresence>
        <span style={{ color: '#22c55e', fontSize: 11, opacity: blink ? 1 : 0 }}>_</span>
      </div>
      <div className="flex gap-3">
        <button onClick={p.prev} disabled={!p.canPrev}
          className="disabled:opacity-20 text-[10px] font-mono transition-all"
          style={{ color: '#22c55e' }}>{'<< PREV'}</button>
        <button onClick={p.next} disabled={!p.canNext}
          className="disabled:opacity-20 text-[10px] font-mono transition-all"
          style={{ color: '#22c55e' }}>{'NEXT >>'}</button>
      </div>
    </div>
  );
}

// ─── 09 Brutalist ────────────────────────────────────────────────────────────
function D09() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-2">
      <button onClick={p.prev} disabled={!p.canPrev}
        className="w-8 h-8 flex items-center justify-center disabled:opacity-20 font-black text-lg"
        style={{ background: '#fff', color: '#000', border: '3px solid #000' }}>‹</button>
      <AnimatePresence mode="wait">
        <motion.div key={p.idx}
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ background: '#fff', border: '3px solid #000', padding: '6px 14px', minWidth: 120, textAlign: 'center' }}>
          <span style={{ color: '#000', fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{p.round}</span>
        </motion.div>
      </AnimatePresence>
      <button onClick={p.next} disabled={!p.canNext}
        className="w-8 h-8 flex items-center justify-center disabled:opacity-20 font-black text-lg"
        style={{ background: '#fff', color: '#000', border: '3px solid #000' }}>›</button>
    </div>
  );
}

// ─── 10 Neumorphic ───────────────────────────────────────────────────────────
function D10() {
  const p = usePicker();
  const neu = { background: '#1e2433', borderRadius: 12, boxShadow: '4px 4px 10px #12161f, -4px -4px 10px #2a3247' };
  return (
    <div className="flex items-center gap-3">
      <button onClick={p.prev} disabled={!p.canPrev}
        className="w-9 h-9 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
        style={{ ...neu, borderRadius: '50%', color: 'rgba(255,255,255,0.6)' }}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div style={{ ...neu, padding: '8px 18px', minWidth: 130, textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.span key={p.idx}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ color: 'rgba(255,255,255,0.80)', fontWeight: 600, fontSize: 12 }}>
            {p.round}
          </motion.span>
        </AnimatePresence>
      </div>
      <button onClick={p.next} disabled={!p.canNext}
        className="w-9 h-9 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
        style={{ ...neu, borderRadius: '50%', color: 'rgba(255,255,255,0.6)' }}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── 11 Holographic Rainbow ──────────────────────────────────────────────────
function D11() {
  const p = usePicker();
  const holo = { background: 'linear-gradient(90deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#c77dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <button onClick={p.prev} disabled={!p.canPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-20"
          style={{ background: 'linear-gradient(135deg,#ff6b6b,#c77dff)', border: 'none' }}>
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <AnimatePresence mode="wait">
          <motion.div key={p.idx}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="px-5 py-2 rounded-xl min-w-[130px] text-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ ...holo, fontWeight: 800, fontSize: 12 }}>{p.round}</span>
          </motion.div>
        </AnimatePresence>
        <button onClick={p.next} disabled={!p.canNext}
          className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-20"
          style={{ background: 'linear-gradient(135deg,#4d96ff,#6bcb77)', border: 'none' }}>
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
      <Dots count={ROUNDS.length} active={p.idx} onGo={i => { p.setDir(i > p.idx ? 1 : -1); p.setIdx(i); }} color="#c77dff" />
    </div>
  );
}

// ─── 12 Gold Luxury ──────────────────────────────────────────────────────────
function D12() {
  const p = usePicker();
  const gold = { background: 'linear-gradient(to bottom, #FFE066, #FFB300)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <button onClick={p.prev} disabled={!p.canPrev}
          className="text-xl disabled:opacity-20 transition-all hover:scale-110"
          style={{ color: '#FFB300', fontFamily: 'Georgia, serif', lineHeight: 1 }}>❮</button>
        <AnimatePresence mode="wait">
          <motion.div key={p.idx}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="px-6 py-2.5 min-w-[130px] text-center"
            style={{ background: 'linear-gradient(135deg, rgba(245,197,24,0.14) 0%, rgba(180,130,0,0.06) 100%)', border: '1px solid rgba(245,197,24,0.40)', borderRadius: 14, boxShadow: '0 0 20px rgba(245,197,24,0.12)' }}>
            <span style={{ ...gold, fontWeight: 800, fontSize: 12, letterSpacing: 0.5 }}>{p.round}</span>
          </motion.div>
        </AnimatePresence>
        <button onClick={p.next} disabled={!p.canNext}
          className="text-xl disabled:opacity-20 transition-all hover:scale-110"
          style={{ color: '#FFB300', fontFamily: 'Georgia, serif', lineHeight: 1 }}>❯</button>
      </div>
      <div className="flex gap-1">
        {ROUNDS.map((_, i) => (
          <button key={i} onClick={() => { p.setDir(i > p.idx ? 1 : -1); p.setIdx(i); }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: i === p.idx ? '#FFB300' : 'rgba(245,197,24,0.25)', transition: 'all 0.2s' }} />
        ))}
      </div>
    </div>
  );
}

// ─── 13 Minimal Underline ────────────────────────────────────────────────────
function D13() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-4">
      <button onClick={p.prev} disabled={!p.canPrev}
        className="text-sm disabled:opacity-20 transition-all"
        style={{ color: 'rgba(255,255,255,0.40)', fontWeight: 300 }}>←</button>
      <div className="flex flex-col items-center gap-1 min-w-[130px]">
        <AnimatePresence mode="wait">
          <motion.span key={p.idx}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.90)', fontWeight: 500, fontSize: 12 }}>
            {p.round}
          </motion.span>
        </AnimatePresence>
        <motion.div layoutId="ul13"
          style={{ height: 2, background: '#f5c518', borderRadius: 1, width: '70%' }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }} />
      </div>
      <button onClick={p.next} disabled={!p.canNext}
        className="text-sm disabled:opacity-20 transition-all"
        style={{ color: 'rgba(255,255,255,0.40)', fontWeight: 300 }}>→</button>
    </div>
  );
}

// ─── 14 Slot Machine ─────────────────────────────────────────────────────────
function D14() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-3">
      <CBtn onClick={p.prev} disabled={!p.canPrev}><ChevronUp className="w-4 h-4" /></CBtn>
      <div style={{ overflow: 'hidden', height: 36, width: 140, position: 'relative', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, background: 'linear-gradient(180deg, rgba(10,14,26,0.8) 0%, transparent 30%, transparent 70%, rgba(10,14,26,0.8) 100%)' }} />
        <AnimatePresence mode="wait">
          <motion.div key={p.idx}
            initial={{ y: p.dir > 0 ? -40 : 40 }} animate={{ y: 0 }} exit={{ y: p.dir > 0 ? 40 : -40 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <span style={{ color: '#f5c518', fontWeight: 700, fontSize: 12 }}>{p.round}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <CBtn onClick={p.next} disabled={!p.canNext}><ChevronDown className="w-4 h-4" /></CBtn>
    </div>
  );
}

// ─── 15 Aurora Glow ──────────────────────────────────────────────────────────
function D15() {
  const p = usePicker();
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <button onClick={p.next} disabled={!p.canNext}
          className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-20"
          style={{ background: 'rgba(72,199,142,0.20)', border: '1px solid rgba(72,199,142,0.45)', color: '#48c78e' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <AnimatePresence mode="wait">
          <motion.div key={p.idx}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="px-5 py-2 rounded-xl min-w-[130px] text-center"
            style={{ background: 'linear-gradient(135deg, rgba(72,199,142,0.15) 0%, rgba(77,150,255,0.12) 100%)', border: '1px solid rgba(72,199,142,0.30)', boxShadow: '0 0 20px rgba(72,199,142,0.15)' }}>
            <span style={{ color: '#48c78e', fontWeight: 700, fontSize: 12 }}>{p.round}</span>
          </motion.div>
        </AnimatePresence>
        <button onClick={p.prev} disabled={!p.canPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-20"
          style={{ background: 'rgba(77,150,255,0.20)', border: '1px solid rgba(77,150,255,0.45)', color: '#4d96ff' }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <Dots count={ROUNDS.length} active={p.idx} onGo={i => { p.setDir(i > p.idx ? 1 : -1); p.setIdx(i); }} color="#48c78e" />
    </div>
  );
}

// ─── 16 Progress Bar ─────────────────────────────────────────────────────────
function D16() {
  const p = usePicker();
  const pct = ((p.idx) / (ROUNDS.length - 1)) * 100;
  return (
    <div className="flex flex-col items-center gap-3 w-full px-4">
      <div className="flex items-center gap-2 w-full justify-between">
        <button onClick={p.prev} disabled={!p.canPrev}
          className="text-xs disabled:opacity-20 font-semibold transition-all"
          style={{ color: '#f5c518' }}>◀</button>
        <AnimatePresence mode="wait">
          <motion.span key={p.idx}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: '#fff', fontWeight: 600, fontSize: 11 }}>
            {p.round}
          </motion.span>
        </AnimatePresence>
        <button onClick={p.next} disabled={!p.canNext}
          className="text-xs disabled:opacity-20 font-semibold transition-all"
          style={{ color: '#f5c518' }}>▶</button>
      </div>
      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.10)', borderRadius: 2 }}>
        <motion.div animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #f5c518, #fde68a)', borderRadius: 2 }} />
      </div>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{p.idx + 1} / {ROUNDS.length}</span>
    </div>
  );
}

// ─── 17 Step Pills ───────────────────────────────────────────────────────────
function D17() {
  const p = usePicker();
  return (
    <div className="flex flex-col items-center gap-2 w-full px-2">
      <AnimatePresence mode="wait">
        <motion.p key={p.idx}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          style={{ color: '#f5c518', fontWeight: 700, fontSize: 12 }}>
          {p.round}
        </motion.p>
      </AnimatePresence>
      <div className="flex gap-1 flex-wrap justify-center">
        {ROUNDS.map((r, i) => (
          <button key={i} onClick={() => { p.setDir(i > p.idx ? 1 : -1); p.setIdx(i); }}
            className="transition-all duration-200"
            style={{
              width: 22, height: 22, borderRadius: '50%', fontSize: 9, fontWeight: 700,
              background: i === p.idx ? '#f5c518' : 'rgba(255,255,255,0.08)',
              color: i === p.idx ? '#000' : 'rgba(255,255,255,0.40)',
              border: i < p.idx ? '1px solid rgba(245,197,24,0.40)' : '1px solid transparent',
            }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 18 Horizontal Tab Strip ─────────────────────────────────────────────────
function D18() {
  const p = usePicker();
  return (
    <div className="flex flex-col items-center gap-1 w-full overflow-hidden">
      <div className="flex gap-1 overflow-x-auto w-full pb-1" style={{ scrollbarWidth: 'none' }}>
        {ROUNDS.map((r, i) => (
          <button key={i} onClick={() => { p.setDir(i > p.idx ? 1 : -1); p.setIdx(i); }}
            className="shrink-0 px-2 py-1 rounded-lg transition-all duration-200 text-[10px] font-semibold whitespace-nowrap"
            style={{
              background: i === p.idx ? 'rgba(245,197,24,0.20)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${i === p.idx ? 'rgba(245,197,24,0.50)' : 'rgba(255,255,255,0.08)'}`,
              color: i === p.idx ? '#f5c518' : 'rgba(255,255,255,0.40)',
            }}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 19 Material Filled ──────────────────────────────────────────────────────
function D19() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-2">
      <button onClick={p.prev} disabled={!p.canPrev}
        className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-20 transition-all active:scale-95"
        style={{ background: '#1565c0', color: '#fff' }}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      <AnimatePresence mode="wait">
        <motion.div key={p.idx}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="px-5 py-2 rounded-lg min-w-[130px] text-center"
          style={{ background: '#1976d2', boxShadow: '0 2px 8px rgba(21,101,192,0.5)' }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>{p.round}</span>
        </motion.div>
      </AnimatePresence>
      <button onClick={p.next} disabled={!p.canNext}
        className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-20 transition-all active:scale-95"
        style={{ background: '#1565c0', color: '#fff' }}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── 20 Dark Ghost ───────────────────────────────────────────────────────────
function D20() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-3">
      <button onClick={p.prev} disabled={!p.canPrev}
        className="text-base disabled:opacity-15 transition-all hover:scale-125"
        style={{ color: 'rgba(255,255,255,0.25)' }}>‹</button>
      <AnimatePresence mode="wait">
        <motion.div key={p.idx}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-5 py-2 rounded-xl min-w-[130px] text-center"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400, fontSize: 12 }}>{p.round}</span>
        </motion.div>
      </AnimatePresence>
      <button onClick={p.next} disabled={!p.canNext}
        className="text-base disabled:opacity-15 transition-all hover:scale-125"
        style={{ color: 'rgba(255,255,255,0.25)' }}>›</button>
    </div>
  );
}

// ─── 21 Retro LCD ────────────────────────────────────────────────────────────
function D21() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-2">
      <button onClick={p.prev} disabled={!p.canPrev}
        className="w-7 h-7 flex items-center justify-center disabled:opacity-20 font-black text-base"
        style={{ background: '#1a1a00', border: '2px solid #554400', color: '#ffaa00', borderRadius: 4 }}>◂</button>
      <div style={{ background: '#0d1100', border: '2px solid #334400', borderRadius: 6, padding: '6px 14px', minWidth: 130, textAlign: 'center', boxShadow: 'inset 0 0 12px rgba(180,200,0,0.08)' }}>
        <AnimatePresence mode="wait">
          <motion.span key={p.idx}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{ color: '#aacc00', fontFamily: 'monospace', fontWeight: 700, fontSize: 11, letterSpacing: 1, textShadow: '0 0 8px #aacc00' }}>
            {p.round.toUpperCase()}
          </motion.span>
        </AnimatePresence>
      </div>
      <button onClick={p.next} disabled={!p.canNext}
        className="w-7 h-7 flex items-center justify-center disabled:opacity-20 font-black text-base"
        style={{ background: '#1a1a00', border: '2px solid #554400', color: '#ffaa00', borderRadius: 4 }}>▸</button>
    </div>
  );
}

// ─── 22 Soft Fade ────────────────────────────────────────────────────────────
function D22() {
  const p = usePicker();
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <button onClick={p.prev} disabled={!p.canPrev}
          className="disabled:opacity-20 font-light text-2xl transition-all hover:scale-110"
          style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>←</button>
        <div className="min-w-[130px] text-center">
          <AnimatePresence mode="wait">
            <motion.span key={p.idx}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ color: 'rgba(255,255,255,0.80)', fontWeight: 500, fontSize: 12 }}>
              {p.round}
            </motion.span>
          </AnimatePresence>
        </div>
        <button onClick={p.next} disabled={!p.canNext}
          className="disabled:opacity-20 font-light text-2xl transition-all hover:scale-110"
          style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>→</button>
      </div>
      <Dots count={ROUNDS.length} active={p.idx} onGo={i => { p.setDir(i > p.idx ? 1 : -1); p.setIdx(i); }} color="rgba(255,255,255,0.70)" />
    </div>
  );
}

// ─── 23 Blur Morph ───────────────────────────────────────────────────────────
function D23() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-3">
      <CBtn onClick={p.prev} disabled={!p.canPrev}><ChevronLeft className="w-4 h-4" /></CBtn>
      <div className="min-w-[130px] text-center">
        <AnimatePresence mode="wait">
          <motion.span key={p.idx}
            initial={{ filter: 'blur(10px)', opacity: 0, scale: 1.05 }}
            animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
            exit={{ filter: 'blur(10px)', opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'block', color: '#c084fc', fontWeight: 700, fontSize: 12 }}>
            {p.round}
          </motion.span>
        </AnimatePresence>
      </div>
      <CBtn onClick={p.next} disabled={!p.canNext}><ChevronRight className="w-4 h-4" /></CBtn>
    </div>
  );
}

// ─── 24 Spring Bounce ────────────────────────────────────────────────────────
function D24() {
  const p = usePicker();
  return (
    <div className="flex items-center gap-3">
      <button onClick={p.prev} disabled={!p.canPrev}
        className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-20 transition-all active:scale-90"
        style={{ background: 'rgba(251,146,60,0.18)', border: '1px solid rgba(251,146,60,0.45)', color: '#fb923c' }}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      <AnimatePresence mode="wait">
        <motion.div key={p.idx}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          className="px-5 py-2 rounded-xl min-w-[130px] text-center"
          style={{ background: 'rgba(251,146,60,0.10)', border: '1px solid rgba(251,146,60,0.35)' }}>
          <span style={{ color: '#fb923c', fontWeight: 700, fontSize: 12 }}>{p.round}</span>
        </motion.div>
      </AnimatePresence>
      <button onClick={p.next} disabled={!p.canNext}
        className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-20 transition-all active:scale-90"
        style={{ background: 'rgba(251,146,60,0.18)', border: '1px solid rgba(251,146,60,0.45)', color: '#fb923c' }}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── 25 Auto Carousel ────────────────────────────────────────────────────────
function D25() {
  const p = usePicker(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => p.next(), 1800);
    return () => clearInterval(t);
  }, [playing, p.idx]);

  useEffect(() => {
    if (p.idx === ROUNDS.length - 1 && playing) {
      setTimeout(() => { p.setDir(-1); p.setIdx(0); }, 400);
    }
  }, [p.idx]);

  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.div key={p.idx}
          initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="px-6 py-2 rounded-xl min-w-[130px] text-center"
          style={{ background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.40)' }}>
          <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 12 }}>{p.round}</span>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center gap-3">
        <button onClick={p.prev} disabled={!p.canPrev}
          className="disabled:opacity-20 text-xs" style={{ color: '#a78bfa' }}>‹</button>
        <button onClick={() => setPlaying(pl => !pl)}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'rgba(139,92,246,0.20)', border: '1px solid rgba(139,92,246,0.45)', color: '#a78bfa' }}>
          {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <button onClick={p.next} disabled={!p.canNext}
          className="disabled:opacity-20 text-xs" style={{ color: '#a78bfa' }}>›</button>
      </div>
      <Dots count={ROUNDS.length} active={p.idx} onGo={i => { p.setPlaying?.(false); p.setDir(i > p.idx ? 1 : -1); p.setIdx(i); }} color="#a78bfa" />
    </div>
  );
}

const DEMOS = [
  { num: 1,  title: 'Flip Board',         desc: 'סגנון נוכחי — זהב, חץ למעלה/מטה, rotateX',         C: D01 },
  { num: 2,  title: 'Horizontal Slide',   desc: 'כחול, חצים שמאל/ימין, translateX',                  C: D02 },
  { num: 3,  title: 'Scale Pop',          desc: 'ניווט נקודות, scale spring',                         C: D03 },
  { num: 4,  title: '3D Cube',            desc: 'rotateY perspective, זהב',                           C: D04 },
  { num: 5,  title: 'Neon Green',         desc: 'ירוק ניאון זוהר, מונוספייס',                         C: D05 },
  { num: 6,  title: 'Liquid Glass',       desc: 'blur(20px) זכוכית מלאה, חצי זכוכית',                C: D06 },
  { num: 7,  title: 'Split Flap',         desc: 'לוח נמל תעופה, B&W, מכאני מהיר',                    C: D07 },
  { num: 8,  title: 'Terminal',           desc: '> CMD prompt, ירוק מונוספייס, קורסור מהבהב',         C: D08 },
  { num: 9,  title: 'Brutalist',          desc: 'גבול עבה שחור/לבן, ללא עיגולים',                     C: D09 },
  { num: 10, title: 'Neumorphic',         desc: 'צל רך, כפתורי הדחיפה, פנימי עמוק',                   C: D10 },
  { num: 11, title: 'Holographic',        desc: 'קשת צבעים, גרדיאנט רינבו',                           C: D11 },
  { num: 12, title: 'Gold Luxury',        desc: 'זהב אורנטי, גבולות זהב, נקודות גולד',               C: D12 },
  { num: 13, title: 'Minimal Underline',  desc: 'רק טקסט + קו תחתון אנימטי, נקי',                    C: D13 },
  { num: 14, title: 'Slot Machine',       desc: 'גלגל מזל אנכי עם overflow mask',                     C: D14 },
  { num: 15, title: 'Aurora Glow',        desc: 'ירוק/כחול גרדיאנט Aurora Borealis',                  C: D15 },
  { num: 16, title: 'Progress Bar',       desc: 'סרגל קידמה זהב + מספר מחזור',                        C: D16 },
  { num: 17, title: 'Step Indicators',    desc: 'ספרות מעגל לכל מחזור, ניווט ישיר',                   C: D17 },
  { num: 18, title: 'Tab Strip',          desc: 'לשוניות אופקיות גלילה, קומפקטי',                      C: D18 },
  { num: 19, title: 'Material Design',    desc: 'כפתורים מלאים כחול Material, ללא גבול',               C: D19 },
  { num: 20, title: 'Dark Ghost',         desc: 'שקוף כמעט לגמרי, מינימלי מאוד',                      C: D20 },
  { num: 21, title: 'Retro LCD',          desc: 'תצוגת LCD ירוק/אמבר, מונוספייס',                     C: D21 },
  { num: 22, title: 'Soft Fade',          desc: 'מעבר opacity חלק מאוד, חצים דקים',                   C: D22 },
  { num: 23, title: 'Blur Morph',         desc: 'blur in/out + scale, לילך',                          C: D23 },
  { num: 24, title: 'Spring Bounce',      desc: 'scale spring גמיש, כתום',                            C: D24 },
  { num: 25, title: 'Auto Carousel',      desc: 'מתקדם אוטומטי + play/pause, סגול',                   C: D25 },
];

export default function AdminRoundPickerDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Round Picker Demo</h2>
        <p className="text-slate-400 mt-1">25 עיצובים ואנימציות לבורר המחזורים</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMOS.map(({ num, title, desc, C }) => (
          <Card key={num} num={num} title={title} desc={desc}>
            <C />
          </Card>
        ))}
      </div>
    </div>
  );
}
