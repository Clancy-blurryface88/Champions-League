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

// ── 6. Accordion — a bar expands downward, rows reveal inside ──────────────
function VariantAccordion() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <motion.div
        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
        transition={{ duration: 0.4 }} className="w-full max-w-[220px] overflow-hidden rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex flex-col gap-1.5 p-1.5">
          {REST.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08 }}>
              <MiniCard m={m} style={{ width: '100%', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)' }} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── 7. Curtain wipe — a solid panel slides away to reveal the grid ─────────
function VariantCurtain() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
        <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
        <div className="grid grid-cols-3 gap-2">
          {REST.map((m, i) => <MiniCard key={i} m={m} style={{ minWidth: 92 }} />)}
        </div>
      </div>
      <motion.div
        initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 0.55, ease: 'easeInOut' }}
        style={{ transformOrigin: 'left', background: '#050a12', position: 'absolute', inset: 0 }}
      />
    </div>
  );
}

// ── 8. Coin flip grid — each cell flips face-down to face-up ───────────────
function VariantCoinFlip() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="grid grid-cols-3 gap-2">
        {REST.map((m, i) => (
          <motion.div key={i} style={{ perspective: 300 }}>
            <motion.div initial={{ rotateY: 180 }} animate={{ rotateY: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
              <MiniCard m={m} style={{ minWidth: 92 }} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 9. Typewriter build-up — rows widen open left to right ─────────────────
function VariantTypewriter() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="flex flex-col gap-1.5 w-full max-w-[220px]">
        {REST.map((m, i) => (
          <motion.div key={i} initial={{ width: 0, opacity: 0 }} animate={{ width: '100%', opacity: 1 }}
            transition={{ delay: i * 0.18, duration: 0.35, ease: 'easeOut' }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <MiniCard m={m} style={{ width: '100%', justifyContent: 'space-between' }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 10. Zoom-out — solo card stays pinned small, grid appears around it ────
function VariantZoomOut() {
  return (
    <motion.div initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <div className="scale-75 opacity-60 mb-1"><MiniCard m={SOLO} style={{ minWidth: 92, borderColor: `rgba(${BLUE},0.4)` }} /></div>
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="grid grid-cols-3 gap-2">
        {REST.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.05 }}>
            <MiniCard m={m} style={{ minWidth: 92 }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── 11. Confetti coalesce — particles gather into each card ────────────────
function VariantConfetti() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="grid grid-cols-3 gap-2 relative">
        {REST.map((m, i) => (
          <div key={i} className="relative">
            {Array.from({ length: 4 }).map((_, p) => (
              <motion.span key={p} className="absolute w-1 h-1 rounded-full" style={{ background: colorFor(m.a), left: '50%', top: '50%' }}
                initial={{ x: (p - 1.5) * 30, y: (p % 2 === 0 ? -1 : 1) * 20, opacity: 1 }}
                animate={{ x: 0, y: 0, opacity: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }} />
            ))}
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 + 0.25, duration: 0.25 }}>
              <MiniCard m={m} style={{ minWidth: 92 }} />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 12. Domino chain — cards appear with a connecting tick between them ────
function VariantDomino() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="flex flex-col gap-0 w-full max-w-[220px]">
        {REST.map((m, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.16 - 0.05, duration: 0.1 }}
                style={{ width: 2, height: 8, background: `rgba(${BLUE},0.5)`, marginRight: 12, transformOrigin: 'top' }} />
            )}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.16, type: 'spring', stiffness: 300, damping: 20 }}>
              <MiniCard m={m} style={{ width: '100%', justifyContent: 'space-between' }} />
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── 13. Wave ripple — diagonal stagger across a 2-column grid ──────────────
function VariantWave() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="grid grid-cols-2 gap-2">
        {REST.map((m, i) => {
          const row = Math.floor(i / 2), col = i % 2;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (row + col) * 0.12, duration: 0.35 }}>
              <MiniCard m={m} style={{ minWidth: 96 }} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── 14. Coverflow — horizontal 3D carousel, side cards tilted/scaled down ──
function VariantCoverflow() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4" style={{ perspective: 500 }}>
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="flex items-center gap-1.5">
        {REST.map((m, i) => {
          const offset = i - 2;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, rotateY: offset * 40, x: offset * 10, scale: 0.7 }}
              animate={{ opacity: 1, rotateY: offset * 35, x: 0, scale: offset === 0 ? 1 : 0.85 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              style={{ zIndex: 10 - Math.abs(offset) }}
            >
              <MiniCard m={m} style={{ minWidth: 80 }} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── 15. Venetian blinds — horizontal strips wipe open ───────────────────────
function VariantBlinds() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="flex flex-col gap-1.5 w-full max-w-[220px]">
        {REST.map((m, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.div initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeInOut' }}>
              <MiniCard m={m} style={{ width: '100%', justifyContent: 'space-between' }} />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 16. Magnetic snap — cards fly in scattered, snap to grid positions ─────
function VariantMagnetic() {
  const scatter = [{ x: -90, y: -60, r: -30 }, { x: 100, y: -40, r: 25 }, { x: -110, y: 30, r: 15 }, { x: 90, y: 60, r: -20 }, { x: 0, y: -90, r: 10 }];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="grid grid-cols-3 gap-2">
        {REST.map((m, i) => (
          <motion.div key={i}
            initial={{ x: scatter[i].x, y: scatter[i].y, rotate: scatter[i].r, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 180, damping: 14 }}>
            <MiniCard m={m} style={{ minWidth: 92 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 17. Countdown punch — 3-2-1 then the whole grid pops in at once ────────
function VariantCountdown() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) return;
    const t = setTimeout(() => setCount(c => c - 1), 300);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      {count > 0 ? (
        <motion.span key={count} initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-white text-4xl font-black">{count}</motion.span>
      ) : (
        <>
          <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="grid grid-cols-3 gap-2">
            {REST.map((m, i) => <MiniCard key={i} m={m} style={{ minWidth: 92 }} />)}
          </motion.div>
        </>
      )}
    </div>
  );
}

// ── 18. Ticket peel — cards rotate/skew in from an angled, "torn" position ─
function VariantTicketPeel() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="flex flex-col gap-1.5 w-full max-w-[220px]">
        {REST.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, rotate: -18, skewX: -8, x: -20 }} animate={{ opacity: 1, rotate: 0, skewX: 0, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }} style={{ transformOrigin: 'left center' }}>
            <MiniCard m={m} style={{ width: '100%', justifyContent: 'space-between' }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 19. Floodlight sweep — a light beam passes over as cards illuminate ────
function VariantFloodlight() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 overflow-hidden">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <motion.div initial={{ x: '-30%' }} animate={{ x: '130%' }} transition={{ duration: 1, ease: 'easeInOut' }}
        className="absolute inset-y-0 w-16 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
      <div className="grid grid-cols-3 gap-2">
        {REST.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0.15 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.14, duration: 0.2 }}>
            <MiniCard m={m} style={{ minWidth: 92 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 20. Unroll — a banner drops and unfurls from the top ───────────────────
function VariantUnroll() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <motion.div initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ transformOrigin: 'top' }} className="flex flex-col gap-1.5 w-full max-w-[220px]">
        {REST.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.06 }}>
            <MiniCard m={m} style={{ width: '100%', justifyContent: 'space-between' }} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ── 21. Glowing connectors — SVG lines draw from center to each card ───────
function VariantConnectors() {
  const positions = [{ x: -70, y: -50 }, { x: 70, y: -50 }, { x: -70, y: 20 }, { x: 70, y: 20 }, { x: 0, y: 70 }];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="relative" style={{ width: 220, height: 160 }}>
        <svg width="220" height="160" className="absolute inset-0" style={{ overflow: 'visible' }}>
          {positions.map((p, i) => (
            <motion.line key={i} x1={110} y1={80} x2={110 + p.x} y2={80 + p.y} stroke={`rgba(${BLUE},0.4)`} strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: i * 0.08, duration: 0.3 }} />
          ))}
        </svg>
        {REST.map((m, i) => (
          <motion.div key={i} className="absolute" style={{ left: 110 + positions[i].x - 46, top: 80 + positions[i].y - 18 }}
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 + 0.15, duration: 0.25 }}>
            <MiniCard m={m} style={{ minWidth: 92 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 22. Puzzle assembly — each card slides in from a different edge ────────
function VariantPuzzle() {
  const from = [{ x: 0, y: -100 }, { x: 100, y: 0 }, { x: -100, y: 0 }, { x: 0, y: 100 }, { x: 60, y: 60 }];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="grid grid-cols-3 gap-2">
        {REST.map((m, i) => (
          <motion.div key={i} initial={{ x: from[i].x, y: from[i].y, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 240, damping: 20 }}>
            <MiniCard m={m} style={{ minWidth: 92 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 23. Honeycomb — offset hex-like rows fading/scaling in ─────────────────
function VariantHoneycomb() {
  const rows = [[REST[0], REST[1]], [REST[2], REST[3], REST[4]]];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="flex flex-col gap-1.5 items-center">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-1.5" style={{ marginRight: ri % 2 === 1 ? 44 : 0 }}>
            {row.map((m, ci) => {
              const idx = ri === 0 ? ci : ci + 2;
              return (
                <motion.div key={ci} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.09, duration: 0.3 }}>
                  <MiniCard m={m} style={{ minWidth: 80 }} />
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 24. Elastic bounce — cards pop in with an exaggerated overshoot ────────
function VariantElastic() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="grid grid-cols-3 gap-2">
        {REST.map((m, i) => (
          <motion.div key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 400, damping: 10 }}>
            <MiniCard m={m} style={{ minWidth: 92 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 25. Card-deck fan — cards fan out from a single stacked point ──────────
function VariantCardFan() {
  const angles = [-32, -16, 0, 16, 32];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
      <span className="text-slate-400 text-[10px] font-semibold tracking-wide">שאר משחקי הערב</span>
      <div className="relative" style={{ width: 220, height: 90 }}>
        {REST.map((m, i) => (
          <motion.div key={i} className="absolute" style={{ left: '50%', top: 0, transformOrigin: 'top center' }}
            initial={{ x: -46, rotate: 0, opacity: 0 }} animate={{ x: -46, rotate: angles[i], opacity: 1 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}>
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
  ['6. אקורדיון', 'רצועה נפתחת כלפי מטה, השורות נחשפות בפנים', VariantAccordion],
  ['7. וילון נגלל', 'פאנל אטום נגלל הצידה וחושף את הגריד מתחתיו', VariantCurtain],
  ['8. הפיכת מטבע', 'כל תא בגריד מתהפך מ"גב" ל"פנים" כמו קלף', VariantCoinFlip],
  ['9. מכונת כתיבה', 'כל שורה "נכתבת" משמאל לימין ברצף', VariantTypewriter],
  ['10. זום-אאוט', 'הקרוב נשאר מוקטן, המצלמה מתרחקת וחושפת את הגריד סביבו', VariantZoomOut],
  ['11. קונפטי מתכנס', 'חלקיקים קטנים מתכנסים לתוך כל כרטיס', VariantConfetti],
  ['12. שרשרת דומינו', 'כרטיסים נכנסים ברצף עם קו מחבר קצר ביניהם', VariantDomino],
  ['13. גל אלכסוני', 'עיכוב אלכסוני על גריד 2 עמודות — תחושת גל', VariantWave],
  ['14. קרוסלה תלת-ממד', 'שורה אופקית עם פרספקטיבה, הצדדים מוטים וקטנים יותר', VariantCoverflow],
  ['15. תריסים ונציאניים', 'כל שורה נחשפת בגילוי אופקי כמו תריס נפתח', VariantBlinds],
  ['16. הצמדה מגנטית', 'כרטיסים מתעופפים ממיקומים מפוזרים ו"נצמדים" לגריד', VariantMagnetic],
  ['17. ספירה לאחור', '3-2-1 ואז כל הגריד קופץ פנימה בבת אחת', VariantCountdown],
  ['18. קילוף כרטיס', 'כל כרטיס נכנס מזווית "קרועה" ומתיישר', VariantTicketPeel],
  ['19. זרקור נע', 'קרן אור עוברת על המסך והכרטיסים "נדלקים" בעקבותיה', VariantFloodlight],
  ['20. גלילה נפתחת', 'באנר יורד מלמעלה ונפתח כמו מגילה', VariantUnroll],
  ['21. קווי חיבור זוהרים', 'קווי SVG נמתחים ממרכז המסך לכל כרטיס', VariantConnectors],
  ['22. הרכבת פאזל', 'כל כרטיס נכנס מכיוון אחר, כמו חלקי פאזל מתחברים', VariantPuzzle],
  ['23. כוורת', 'שורות עם היסט לסירוגין (מבנה כוורת), פייד+scale', VariantHoneycomb],
  ['24. קפיץ אלסטי', 'קפיצה מוגזמת עם overshoot בכניסת כל כרטיס', VariantElastic],
  ['25. מניפת קלפים', 'כרטיסים נפתחים כמו מניפה ממקום ערימה אחד', VariantCardFan],
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
