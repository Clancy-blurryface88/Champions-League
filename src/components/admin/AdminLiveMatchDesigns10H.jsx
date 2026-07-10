import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LIVE, LiveCardShell, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Live Match card — batch H: component ENTRANCE-choreography styles,
   round 3. Same exact card as production (via LiveCardShell) — each design
   wraps it with one extra entrance flourish layered on top, not a
   different card. Click "שחזר כניסה" to replay.
   Temporary comparison tab — pick one, then it gets wired in and all
   live-match batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

const CARD_W = 260, CARD_H = 176;
const PROGRESS = LIVE.minute / 90;
const Replay = ({ onClick }) => (
  <button onClick={onClick} className="text-[10px] text-slate-400 hover:text-amber-300 underline underline-offset-2 mt-2">🔁 שחזר כניסה</button>
);

/* ── 1. Iris Aperture Open ────────────────────────────────────────────────── */
function H1() {
  const [key, setKey] = useState(0);
  const blades = [0, 60, 120, 180, 240, 300];
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.2 }}><LiveCardShell progress={PROGRESS} minute={LIVE.minute} /></motion.div>
        {blades.map((deg, i) => (
          <motion.div key={i} initial={{ rotate: deg, scale: 1 }} animate={{ rotate: deg + 40, scale: 0 }} transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, background: '#030d1a', clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)', transformOrigin: 'center' }} />
        ))}
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 2. Card Deal Flip-In ─────────────────────────────────────────────────── */
function H2() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300, perspective: 800 }}>
      <motion.div initial={{ x: -180, rotateY: 90, opacity: 0 }} animate={{ x: 0, rotateY: 0, opacity: 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.3, flags: 0.35, score: 0.4 }} />
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 3. Shockwave Ring Announce ───────────────────────────────────────────── */
function H3() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        <motion.div initial={{ scale: 0.2, opacity: 0.8 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'absolute', left: '50%', top: '50%', width: 60, height: 60, marginLeft: -30, marginTop: -30, borderRadius: '50%', border: '2px solid #ef4444' }} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.3 }}>
          <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.05, flags: 0.1, score: 0.15 }} />
        </motion.div>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 4. Light Beam Drop ───────────────────────────────────────────────────── */
function H4() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        <motion.div initial={{ scaleY: 0, opacity: 0.6 }} animate={{ scaleY: 1, opacity: 0 }} transition={{ duration: 0.4 }}
          style={{ position: 'absolute', left: '38%', top: -20, width: 60, height: CARD_H + 40, background: 'linear-gradient(180deg, rgba(245,197,24,0.5), transparent)', transformOrigin: 'top' }} />
        <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.15, flags: 0.2, score: 0.25 }} />
        </motion.div>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 5. Puzzle Frame Snap Together ────────────────────────────────────────── */
function H5() {
  const [key, setKey] = useState(0);
  const pieces = [
    { from: { x: -40, y: -20 }, side: 'top' }, { from: { x: 40, y: -20 }, side: 'top' },
    { from: { x: -40, y: 20 }, side: 'bottom' }, { from: { x: 40, y: 20 }, side: 'bottom' },
  ];
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        {pieces.map((p, i) => (
          <motion.div key={i} initial={{ ...p.from, opacity: 0 }} animate={{ x: 0, y: 0, opacity: [0, 1, 0] }} transition={{ duration: 0.35, delay: i * 0.04 }}
            style={{ position: 'absolute', inset: 0, border: '2px solid #f5c518', borderRadius: 18 }} />
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.3 }}>
          <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.05, flags: 0.1, score: 0.15 }} />
        </motion.div>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 6. Heat Haze Materialize ─────────────────────────────────────────────── */
function H6() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <motion.div initial={{ filter: 'blur(6px)', opacity: 0.4, skewX: 4 }} animate={{ filter: ['blur(6px)', 'blur(3px)', 'blur(0px)'], opacity: 1, skewX: [4, -3, 0] }} transition={{ duration: 0.8, ease: 'easeInOut' }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.2, flags: 0.25, score: 0.3 }} />
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 7. Sound Equalizer Intro ─────────────────────────────────────────────── */
function H7() {
  const [key, setKey] = useState(0);
  const bars = Array.from({ length: 14 }, (_, i) => 6 + (i % 4) * 6);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 0.35, duration: 0.2 }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          {bars.map((h, i) => (
            <motion.span key={i} animate={{ height: [h * 0.3, h, h * 0.5] }} transition={{ duration: 0.35, repeat: 1, delay: i * 0.015 }} style={{ width: 3, background: '#f5c518', borderRadius: 2 }} />
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.25 }}>
          <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0, flags: 0.05, score: 0.1 }} />
        </motion.div>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 8. Film Reel Flicker-In ──────────────────────────────────────────────── */
function H8() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.2, 1, 0.5, 1], x: [0, -2, 3, -1, 0] }} transition={{ duration: 0.5, times: [0, 0.2, 0.35, 0.55, 0.7, 1] }}>
        <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.1, flags: 0.14, score: 0.18 }} />
      </motion.div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 9. Magnetic Field Lines Converge ─────────────────────────────────────── */
function H9() {
  const [key, setKey] = useState(0);
  const lines = [-1, 1].flatMap((s) => [0.6, 0.85, 1.1].map((r) => ({ s, r })));
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        {lines.map((l, i) => (
          <motion.div key={i} initial={{ scaleX: l.r, opacity: 0.5 }} animate={{ scaleX: 0.3, opacity: 0 }} transition={{ duration: 0.4, delay: i * 0.02 }}
            style={{ position: 'absolute', left: '50%', top: `${30 + i * 8}%`, width: 100, height: 1, background: '#38bdf8', transformOrigin: l.s < 0 ? 'left' : 'right' }} />
        ))}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.3 }}>
          <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.05, flags: 0.1, score: 0.15 }} />
        </motion.div>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

/* ── 10. Countdown Flash 3-2-1 ────────────────────────────────────────────── */
function H10() {
  const [key, setKey] = useState(0);
  return (
    <Shell key={key} style={{ flexDirection: 'column', gap: 4, minHeight: 300 }}>
      <div style={{ position: 'relative', width: CARD_W, height: CARD_H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {['3', '2', '1'].map((n, i) => (
          <motion.span key={n} initial={{ opacity: 0, scale: 1.6 }} animate={{ opacity: [0, 1, 0], scale: [1.6, 1, 0.8] }} transition={{ duration: 0.28, delay: i * 0.22 }}
            style={{ position: 'absolute', fontFamily: "'Russo One', sans-serif", fontSize: 40, color: '#f5c518' }}>{n}</motion.span>
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.3 }}>
          <LiveCardShell progress={PROGRESS} minute={LIVE.minute} entranceDelays={{ badge: 0.05, flags: 0.1, score: 0.15 }} />
        </motion.div>
      </div>
      <Replay onClick={() => setKey((k) => k + 1)} />
    </Shell>
  );
}

const DESIGNS = [
  { id: 1, name: 'Iris Aperture Open', Comp: H1 },
  { id: 2, name: 'Card Deal Flip-In', Comp: H2 },
  { id: 3, name: 'Shockwave Ring Announce', Comp: H3 },
  { id: 4, name: 'Light Beam Drop', Comp: H4 },
  { id: 5, name: 'Puzzle Frame Snap Together', Comp: H5 },
  { id: 6, name: 'Heat Haze Materialize', Comp: H6 },
  { id: 7, name: 'Sound Equalizer Intro', Comp: H7 },
  { id: 8, name: 'Film Reel Flicker-In', Comp: H8 },
  { id: 9, name: 'Magnetic Field Lines Converge', Comp: H9 },
  { id: 10, name: 'Countdown Flash 3-2-1', Comp: H10 },
];

export default function AdminLiveMatchDesigns10H() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים — אותו כרטיס משחק חי, סדר הופעת רכיבים (סבב 3)"
      subtitle="לחץ 'שחזר כניסה' כדי לראות כל וריאציה"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
