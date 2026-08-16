import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

// Demo-only: 35 alternative REVEAL CHOREOGRAPHIES for the ranked leaderboard
// list's entrance — the sequence/order/timing/motion-style the whole list
// uses when it mounts. Explores alternatives to LeaderboardPanel.jsx's
// current behavior (see V1 below, which reproduces that exact formula):
//   const rank = totalParticipants - 1 - index;
//   const cardAnimationDelay = Math.pow(rank, 1.6) * 0.22 + (position===1 ? 0.3 : 0);
// i.e. last place reveals first, rank 1 reveals last with a dramatic pause.
//
// This gallery is NOT about the row's own visual shape (see
// AdminLeaderboardCardDemo.jsx for 150 card designs) — the row here is
// deliberately a plain, constant rounded-rect so the only thing that
// changes between variants is HOW THE WHOLE LIST ANIMATES IN. Mock data,
// self-contained, replayable via the Frame's key bump. Doesn't touch
// LeaderboardPanel.jsx.

const ROWS = [
  { rank: 1, name: 'דניאל כהן', points: 61.5 },
  { rank: 2, name: 'נועה לוי', points: 54.0 },
  { rank: 3, name: 'איתי מזרחי', points: 48.5 },
  { rank: 4, name: 'שירה בן דוד', points: 39.0 },
  { rank: 5, name: 'עומר גבאי', points: 33.0 },
];
const N = ROWS.length;
const MID = (N - 1) / 2;

const RANK_COLOR = (r) => (r === 1 ? '#facc15' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : 'rgba(255,255,255,0.55)');
const RANK_BORDER = (r) => (r === 1 ? '#facc15' : r === 2 ? '#D1D5DB' : r === 3 ? '#D97706' : '#475569');

function shuffledIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

// Plain rounded-rect row — rank badge + name + points. Shape stays constant
// across all 35 variants; only the entrance choreography around it changes.
function Row({ row, style, nameStyle, nameOverride, pointsOverride, children }) {
  return (
    <div style={{ width: 208, height: 32, borderRadius: 9, border: `1.5px solid ${RANK_BORDER(row.rank)}`, background: 'rgba(30,41,59,0.65)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', position: 'relative', overflow: 'hidden', ...style }}>
      <span style={{ width: 18, height: 18, borderRadius: 5, background: 'rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: RANK_COLOR(row.rank), fontWeight: 800, fontSize: 10, flexShrink: 0 }}>{row.rank}</span>
      <span className="truncate" style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 11.5, fontWeight: 600, ...nameStyle }}>
        {nameOverride !== undefined ? nameOverride : row.name}
      </span>
      <span style={{ color: '#4ade80', fontSize: 10.5, fontWeight: 700, flexShrink: 0 }}>
        {pointsOverride !== undefined ? pointsOverride : `${row.points} Pts`}
      </span>
      {children}
    </div>
  );
}

function List({ style, children }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 208, ...style }}>{children}</div>;
}

// Generic: each row gets its own motion.div driven by variant(row, index) ->
// {initial, animate, transition, rowStyle, nameStyle}. Most order/motion
// variants just plug a different `variant` function into this.
function Stagger({ rows = ROWS, variant, listStyle }) {
  return (
    <List style={listStyle}>
      {rows.map((row, i) => {
        const v = variant(row, i);
        return (
          <motion.div key={row.rank} initial={v.initial} animate={v.animate} transition={v.transition}>
            <Row row={row} style={v.rowStyle} nameStyle={v.nameStyle} />
          </motion.div>
        );
      })}
    </List>
  );
}

// ================= Group A — Order variations (1-10) =================

// 1. Baseline — the real current behavior exactly (LeaderboardPanel.jsx)
function V1() {
  return (
    <List>
      {ROWS.map((row, index) => {
        const rank = N - 1 - index; // exact variable/logic from LeaderboardPanel.jsx
        const delay = Math.pow(rank, 1.6) * 0.22 + (row.rank === 1 ? 0.3 : 0);
        return (
          <motion.div key={row.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6, ease: 'easeOut' }}>
            <Row row={row} />
          </motion.div>
        );
      })}
    </List>
  );
}

// 2. Top-to-bottom — rank 1 first, descending to last
function V2() {
  return <Stagger variant={(row, i) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.18, duration: 0.5, ease: 'easeOut' } })} />;
}

// 3. Simultaneous — no stagger at all
function V3() {
  return <Stagger variant={() => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: 'easeOut' } })} />;
}

// 4. Center-out — middle row first, expanding to both edges
function V4() {
  return <Stagger variant={(row, i) => {
    const dist = Math.abs(i - MID);
    return { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, transition: { delay: dist * 0.22, duration: 0.45, ease: 'easeOut' } };
  }} />;
}

// 5. Edges-in — top and bottom rows first, converging on the middle
function V5() {
  return <Stagger variant={(row, i) => {
    const dist = Math.min(i, N - 1 - i);
    return { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, transition: { delay: dist * 0.22, duration: 0.45, ease: 'easeOut' } };
  }} />;
}

// 6. Random order — freshly randomized on every mount/replay
function V6() {
  const order = useMemo(() => shuffledIndices(N), []);
  return <Stagger variant={(row, i) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: order.indexOf(i) * 0.2, duration: 0.45, ease: 'easeOut' } })} />;
}

// 7. Countdown-drama — baseline order, with a tick/flash pulse before each reveal
function V7() {
  return (
    <List>
      {ROWS.map((row, i) => {
        const delay = (N - 1 - i) * 0.34;
        return (
          <div key={row.rank} style={{ position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0] }}
              transition={{ delay: Math.max(0, delay - 0.22), duration: 0.22, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: -2, borderRadius: 11, background: RANK_BORDER(row.rank), pointerEvents: 'none' }}
            />
            <motion.div initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay, duration: 0.4, ease: 'easeOut' }}>
              <Row row={row} />
            </motion.div>
          </div>
        );
      })}
    </List>
  );
}

// 8. Wave sweep — tight smooth stagger, tighter than baseline's exponential curve
function V8() {
  return <Stagger variant={(row, i) => ({ initial: { opacity: 0, y: 22, scale: 0.94 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { delay: i * 0.09, duration: 0.5, ease: [0.45, 0, 0.15, 1] } })} />;
}

// 9. Alternating sides — odd rows from the left, even from the right, staggered top-down
function V9() {
  return <Stagger variant={(row, i) => ({ initial: { opacity: 0, x: i % 2 === 0 ? -34 : 34 }, animate: { opacity: 1, x: 0 }, transition: { delay: i * 0.15, duration: 0.45, ease: 'easeOut' } })} />;
}

// 10. Domino cascade — very tight, fast top-down chain
function V10() {
  return <Stagger variant={(row, i) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.045, duration: 0.22, ease: 'easeOut' } })} />;
}

// ================= Group B — Motion-style variations (11-20) =================
// Order held constant (top-to-bottom stagger); only the per-row entrance motion changes.

// 11. Card-deal — arcs in like a dealt card, with rotation
function V11() {
  return <Stagger variant={(row, i) => ({
    initial: { opacity: 0, x: -70, y: -24, rotate: -18 },
    animate: { opacity: 1, x: 0, y: 0, rotate: 0 },
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.2, 0.9, 0.3, 1] },
  })} />;
}

// 12. Elevator rise — rises up from below, slower than a short fade+slide
function V12() {
  return <Stagger variant={(row, i) => ({ initial: { opacity: 0, y: 70 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.16, duration: 0.65, ease: 'easeOut' } })} />;
}

// 13. Shuffle-then-settle — rows start jumbled and animate to their sorted spot
const JUMBLE = [
  { x: 40, y: -30, rotate: 9 },
  { x: -50, y: 10, rotate: -7 },
  { x: 20, y: 40, rotate: 5 },
  { x: -30, y: -15, rotate: -10 },
  { x: 55, y: 20, rotate: 8 },
];
function V13() {
  return <Stagger variant={(row, i) => {
    const j = JUMBLE[i % JUMBLE.length];
    return { initial: { opacity: 0.4, x: j.x, y: j.y, rotate: j.rotate }, animate: { opacity: 1, x: 0, y: 0, rotate: 0 }, transition: { delay: i * 0.1, duration: 0.55, ease: 'easeInOut' } };
  }} />;
}

// 14. Spotlight sweep — a light beam sweeps down; each row "switches on" as it passes
function V14() {
  const beamDuration = 0.35 * N + 0.3;
  return (
    <div style={{ position: 'relative', width: 208 }}>
      <motion.div
        initial={{ top: -20 }} animate={{ top: 38 * N }}
        transition={{ duration: beamDuration, ease: 'linear' }}
        style={{ position: 'absolute', left: -8, right: -8, height: 26, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.35), transparent)', filter: 'blur(4px)', zIndex: 5, pointerEvents: 'none' }}
      />
      <List>
        {ROWS.map((row, i) => (
          <motion.div key={row.rank} initial={{ opacity: 0.15, filter: 'brightness(0.4)' }} animate={{ opacity: 1, filter: 'brightness(1)' }} transition={{ delay: i * 0.35 + 0.15, duration: 0.3 }}>
            <Row row={row} />
          </motion.div>
        ))}
      </List>
    </div>
  );
}

// 15. Podium-first — top 3 reveal together first, then the rest cascades in
function V15() {
  return <Stagger variant={(row) => ({
    initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 },
    transition: { delay: row.rank <= 3 ? 0 : 0.5 + (row.rank - 4) * 0.18, duration: 0.45, ease: 'easeOut' },
  })} />;
}

// 16. Magnetic snap from sides — fly in from left/right edges with spring overshoot
function V16() {
  return <Stagger variant={(row, i) => ({
    initial: { opacity: 0, x: i % 2 === 0 ? -110 : 110 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: i * 0.14, type: 'spring', stiffness: 260, damping: 14 },
  })} />;
}

// 17. Typewriter row-by-row — each row's name types out before the next row starts
function TypewriterList() {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  useEffect(() => {
    if (idx >= N) return;
    setChars(0);
    const name = ROWS[idx].name;
    let c = 0;
    const iv = setInterval(() => {
      c++;
      setChars(c);
      if (c >= name.length) {
        clearInterval(iv);
        setTimeout(() => setIdx((v) => v + 1), 150);
      }
    }, 50);
    return () => clearInterval(iv);
  }, [idx]);
  return (
    <List>
      {ROWS.map((row, i) => {
        const done = i < idx;
        const typing = i === idx;
        const visible = done || typing;
        return (
          <motion.div key={row.rank} animate={{ opacity: visible ? 1 : 0.12 }} transition={{ duration: 0.2 }}>
            <Row row={row} nameOverride={done ? row.name : typing ? row.name.slice(0, chars) : ''} pointsOverride={done ? undefined : ''} />
          </motion.div>
        );
      })}
    </List>
  );
}
function V17() { return <TypewriterList />; }

// 18. Accordion unfold — the whole list unfolds open from a closed stack
function V18() {
  return (
    <motion.div initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ transformOrigin: 'top', width: 208 }}>
      <List>
        {ROWS.map((row, i) => (
          <motion.div key={row.rank} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.3 }}>
            <Row row={row} />
          </motion.div>
        ))}
      </List>
    </motion.div>
  );
}

// 19. 3D flip-in cascade — each row flips in via rotateX, staggered down the list
function V19() {
  return (
    <div style={{ perspective: 600 }}>
      <Stagger variant={(row, i) => ({
        initial: { opacity: 0, rotateX: 90, y: 6 },
        animate: { opacity: 1, rotateX: 0, y: 0 },
        transition: { delay: i * 0.14, duration: 0.5, ease: 'easeOut' },
      })} />
    </div>
  );
}

// 20. Bounce/spring cascade — springy elastic overshoot, staggered
function V20() {
  return <Stagger variant={(row, i) => ({
    initial: { opacity: 0, y: -36, scale: 0.6 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { delay: i * 0.15, type: 'spring', stiffness: 340, damping: 11 },
  })} />;
}

// ================= Group C — Interaction-driven / dynamic reveals (21-30) =================

// 21. Rank-climbing race — rows start jumbled and "race" to their correct position
function RaceList() {
  const initialOrder = useMemo(() => shuffledIndices(N), []);
  const [order, setOrder] = useState(initialOrder);
  useEffect(() => {
    const t = setTimeout(() => setOrder(Array.from({ length: N }, (_, i) => i)), 450);
    return () => clearTimeout(t);
  }, []);
  return (
    <List>
      {order.map((origIdx) => {
        const row = ROWS[origIdx];
        return (
          <motion.div key={row.rank} layout transition={{ type: 'spring', stiffness: 230, damping: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Row row={row} />
          </motion.div>
        );
      })}
    </List>
  );
}
function V21() { return <RaceList />; }

// 22. Confetti-on-winner — normal reveal, confetti burst when rank 1 finally appears
function ConfettiBurst() {
  const pieces = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    angle: (i / 10) * Math.PI * 2, dist: 24 + Math.random() * 18, color: ['#facc15', '#4ade80', '#7cadee', '#f87171'][i % 4],
  })), []);
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', pointerEvents: 'none' }}>
      {pieces.map((p, i) => (
        <motion.span key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: Math.cos(p.angle) * p.dist, y: Math.sin(p.angle) * p.dist, scale: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'absolute', width: 5, height: 5, borderRadius: 2, background: p.color }}
        />
      ))}
    </div>
  );
}
function V22() {
  const [burst, setBurst] = useState(false);
  return (
    <List>
      {ROWS.map((row, i) => {
        const delay = i * 0.18;
        return (
          <motion.div key={row.rank} style={{ position: 'relative' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45, ease: 'easeOut' }}
            onAnimationComplete={() => { if (row.rank === 1) setBurst(true); }}>
            <Row row={row} />
            {row.rank === 1 && burst && <ConfettiBurst />}
          </motion.div>
        );
      })}
    </List>
  );
}

// 23. Progressive blur-to-focus — each row starts blurred and sharpens, staggered
function V23() {
  return <Stagger variant={(row, i) => ({
    initial: { opacity: 0, filter: 'blur(9px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { delay: i * 0.16, duration: 0.55, ease: 'easeOut' },
  })} />;
}

// 24. Zoom-in cascade — each row scales from near-0 to full size, staggered
function V24() {
  return <Stagger variant={(row, i) => ({
    initial: { opacity: 0, scale: 0.15 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: i * 0.14, duration: 0.4, ease: 'easeOut' },
  })} />;
}

// 25. Curtain wipe — a moving mask wipes away to reveal each row in sequence
function V25() {
  return (
    <List>
      {ROWS.map((row, i) => (
        <div key={row.rank} style={{ position: 'relative', width: 208, height: 32, borderRadius: 9, overflow: 'hidden' }}>
          <Row row={row} style={{ position: 'absolute', inset: 0 }} />
          <motion.div
            initial={{ width: '100%' }} animate={{ width: '0%' }}
            transition={{ delay: 0.2 + i * 0.22, duration: 0.4, ease: 'easeInOut' }}
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0, background: '#050a12' }}
          />
        </div>
      ))}
    </List>
  );
}

// 26. Tap-to-reveal-next — the user must click to reveal each row, one at a time
function TapReveal() {
  const [revealed, setRevealed] = useState(0);
  return (
    <List>
      {ROWS.map((row, i) => {
        const isRevealed = i < revealed;
        const isNext = i === revealed;
        return (
          <motion.div key={row.rank}
            animate={{ opacity: isRevealed ? 1 : isNext ? 0.95 : 0.3, y: isRevealed ? 0 : 4 }}
            transition={{ duration: 0.3 }}
            onClick={() => { if (isNext) setRevealed((v) => v + 1); }}
            style={{ cursor: isNext ? 'pointer' : 'default' }}
          >
            <Row row={row}
              style={isNext ? { borderStyle: 'dashed' } : undefined}
              nameOverride={isRevealed ? undefined : isNext ? 'הקש לחשיפה' : '•••'}
              pointsOverride={isRevealed ? undefined : ''}
            />
          </motion.div>
        );
      })}
    </List>
  );
}
function V26() { return <TapReveal />; }

// 27. Auto-scroll-then-settle — the list auto-scrolls down slowly, then settles
function V27() {
  const rowH = 32, gap = 6, visibleCount = 3;
  const containerH = rowH * visibleCount + gap * (visibleCount - 1);
  const totalH = rowH * N + gap * (N - 1);
  const scrollDist = totalH - containerH;
  return (
    <div style={{ width: 208, height: containerH, overflow: 'hidden', position: 'relative', borderRadius: 9 }}>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -scrollDist, 0] }}
        transition={{ duration: 2.4, times: [0, 0.7, 1], ease: ['easeInOut', 'easeOut'], delay: 0.2 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <List style={{ gap }}>
          {ROWS.map((row) => <Row key={row.rank} row={row} />)}
        </List>
      </motion.div>
    </div>
  );
}

// 28. Glitch-decode — each row flickers/glitches before settling clean, staggered
function V28() {
  return (
    <List>
      {ROWS.map((row, i) => {
        const delay = i * 0.22;
        return (
          <motion.div key={row.rank} style={{ position: 'relative' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.3, 1, 0.5, 1], x: [0, -3, 2, -2, 1, 0] }}
            transition={{ delay, duration: 0.5, times: [0, 0.15, 0.3, 0.5, 0.7, 1] }}
          >
            <Row row={row} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }} transition={{ delay, duration: 0.35 }}
              style={{ position: 'absolute', inset: 0, borderRadius: 9, background: 'linear-gradient(90deg, rgba(248,113,113,0.35), transparent, rgba(124,173,238,0.35))', mixBlendMode: 'screen', pointerEvents: 'none' }} />
          </motion.div>
        );
      })}
    </List>
  );
}

// 29. Liquid-fill reveal — each row's background fills like liquid pouring in, staggered
function V29() {
  return (
    <List>
      {ROWS.map((row, i) => (
        <div key={row.rank} style={{ position: 'relative', width: 208, height: 32, borderRadius: 9, overflow: 'hidden', border: `1.5px solid ${RANK_BORDER(row.rank)}` }}>
          <motion.div
            initial={{ width: '0%' }} animate={{ width: '100%' }}
            transition={{ delay: i * 0.24, duration: 0.55, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(30,41,59,0.9)' }}
          />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.24 + 0.3, duration: 0.3 }} style={{ position: 'relative' }}>
            <Row row={row} style={{ border: 'none', background: 'transparent' }} />
          </motion.div>
        </div>
      ))}
    </List>
  );
}

// 30. Visible countdown-gated — explicit 3-2-1 ticks down before each row's reveal
function CountdownList() {
  const revealOrder = useMemo(() => Array.from({ length: N }, (_, k) => N - 1 - k), []);
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(3);
  const [phase, setPhase] = useState('counting');
  useEffect(() => {
    if (step >= N) return;
    setPhase('counting'); setCount(3);
    const t1 = setTimeout(() => setCount(2), 350);
    const t2 = setTimeout(() => setCount(1), 700);
    const t3 = setTimeout(() => setPhase('reveal'), 1050);
    const t4 = setTimeout(() => setStep((s) => s + 1), 1450);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [step]);
  const revealedSet = new Set(revealOrder.slice(0, step));
  const currentIdx = step < N ? revealOrder[step] : null;
  return (
    <List>
      {ROWS.map((row, i) => {
        const isRevealed = revealedSet.has(i);
        const isCurrent = i === currentIdx;
        return (
          <div key={row.rank} style={{ position: 'relative' }}>
            <motion.div animate={{ opacity: isRevealed ? 1 : 0.15, y: isRevealed ? 0 : 6 }} transition={{ duration: 0.3 }}>
              <Row row={row} />
            </motion.div>
            <AnimatePresence>
              {isCurrent && phase === 'counting' && (
                <motion.div key={count} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.4 }} transition={{ duration: 0.25 }}
                  style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff', background: 'rgba(5,10,18,0.75)', borderRadius: 9 }}>
                  {count}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </List>
  );
}
function V30() { return <CountdownList />; }

// ================= Group D — Novelty/thematic (31-35) =================

// 31. Stadium-scoreboard style — split-flap style flips, staggered worst-to-best
function V31() {
  return (
    <div style={{ perspective: 500 }}>
      <Stagger variant={(row, i) => {
        const delay = (N - 1 - i) * 0.28;
        return {
          initial: { opacity: 0, rotateX: 0 },
          animate: { rotateX: [0, -90, 0, -40, 0], opacity: [0, 0, 1, 1, 1] },
          transition: { delay, duration: 0.5, times: [0, 0.25, 0.3, 0.6, 1], ease: 'easeInOut' },
        };
      }} />
    </div>
  );
}

// 32. Photo-finish sprint — rows slide in horizontally at different speeds, arriving in rank order
function V32() {
  return <Stagger variant={(row, i) => ({
    initial: { opacity: 0, x: -240 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: i * 0.03, duration: 0.5 + row.rank * 0.12, ease: 'easeOut' },
  })} />;
}

// 33. Trophy-shine cascade — a golden shine sweeps over each row after it reveals
function V33() {
  return (
    <List>
      {ROWS.map((row, i) => {
        const delay = i * 0.18;
        return (
          <motion.div key={row.rank} style={{ position: 'relative', overflow: 'hidden', borderRadius: 9 }}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4, ease: 'easeOut' }}>
            <Row row={row} />
            <motion.div
              initial={{ x: '-120%' }} animate={{ x: '220%' }}
              transition={{ delay: delay + 0.35, duration: 0.55, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: 'linear-gradient(100deg, transparent, rgba(250,204,21,0.55), transparent)', pointerEvents: 'none' }}
            />
          </motion.div>
        );
      })}
    </List>
  );
}

// 34. Heartbeat pulse-in — quick double-pulse scale before settling, staggered
function V34() {
  return <Stagger variant={(row, i) => ({
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: [0.6, 1.18, 0.92, 1.1, 1] },
    transition: { delay: i * 0.17, duration: 0.55, times: [0, 0.3, 0.5, 0.7, 1], ease: 'easeInOut' },
  })} />;
}

// 35. Final-whistle burst — everything hidden, then reveals nearly simultaneously in a punchy burst
function V35() {
  const holdDelay = 0.45;
  return (
    <div style={{ position: 'relative' }}>
      <motion.div initial={{ opacity: 0, scale: 1.6 }} animate={{ opacity: [0, 0.5, 0], scale: [1.6, 2.4, 2.4] }} transition={{ delay: holdDelay - 0.1, duration: 0.35 }}
        style={{ position: 'absolute', inset: -10, borderRadius: 16, background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)', pointerEvents: 'none', zIndex: 5 }} />
      <Stagger variant={(row, i) => ({
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: holdDelay + i * 0.025, type: 'spring', stiffness: 420, damping: 16 },
      })} />
    </div>
  );
}

// ================= Groups =================

const GROUPS = [
  { title: 'קבוצה A — סדר החשיפה', items: [
    ['1. הנוכחי (בסיס להשוואה)', 'עיכוב אקספוננציאלי: אחרון ראשון, מקום 1 אחרון עם השהיה דרמטית — הלוגיקה המדויקת מ-LeaderboardPanel', V1],
    ['2. מלמעלה למטה', 'מקום 1 נחשף ראשון, ואז יורד בהדרגה עד האחרון', V2],
    ['3. בו-זמנית', 'כל השורות נכנסות יחד, בלי מדרג כלל', V3],
    ['4. מהמרכז החוצה', 'השורה האמצעית נחשפת ראשונה ומתרחבת כלפי מעלה ומטה בו-זמנית', V4],
    ['5. מהקצוות פנימה', 'מקום 1 והאחרון נחשפים יחד ראשונים, מתכנסים לעבר האמצע', V5],
    ['6. סדר אקראי', 'בכל הצגה מחדש הסדר מתערבב מחדש', V6],
    ['7. דרמת ספירה לאחור', 'אותו סדר כמו הבסיס, עם הבהוב לפני כל חשיפה לבניית מתח', V7],
    ['8. גל גורף', 'מדרג צפוף וחלק שנע כמו גל במורד הרשימה', V8],
    ['9. צדדים מתחלפים', 'שורות אי-זוגיות נכנסות משמאל, זוגיות מימין, עדיין מלמעלה למטה', V9],
    ['10. אפקט דומינו', 'כל שורה מפעילה כמעט מיידית את הבאה — מפל מהיר וצפוף', V10],
  ]},
  { title: 'קבוצה B — סגנון התנועה של כל שורה', items: [
    ['11. חלוקת קלפים', 'כל שורה נכנסת בקשת עקומה עם סיבוב קל, כמו חלוקת קלף מהחפיסה', V11],
    ['12. עלייה במעלית', 'שורות עולות מלמטה כמו מעלית שמגיעה, לא רק גלישה קצרה', V12],
    ['13. ערבוב ואז התיישבות', 'כל השורות מתחילות במיקום מעורבב ונעות למקומן הנכון', V13],
    ['14. סריקת זרקור', 'קרן אור עוברת במורד הרשימה וכל שורה "נדלקת" כשהיא חולפת', V14],
    ['15. פודיום קודם', 'שלושת המקומות הראשונים נחשפים יחד קודם, ואז השאר במפל', V15],
    ['16. הצמדה מגנטית מהצדדים', 'שורות מגיעות מקצוות המסך ונצמדות למקום עם overshoot קל', V16],
    ['17. מכונת כתיבה שורה-אחר-שורה', 'תוכן כל שורה מוקלד אות-אחר-אות לפני שהבאה מתחילה', V17],
    ['18. פתיחת אקורדיון', 'הרשימה כולה נפתחת מערימה סגורה, כמו מניפה', V18],
    ['19. היפוך תלת-ממד במפל', 'כל שורה נכנסת בסיבוב תלת-ממדי (rotateX), במדרג יורד', V19],
    ['20. מפל קפיצי-אלסטי', 'כל שורה "קופצת" פנימה עם overshoot אלסטי, במדרג', V20],
  ]},
  { title: 'קבוצה C — חשיפות אינטראקטיביות ודינמיות', items: [
    ['21. מרוץ טיפוס בדירוג', 'השורות מתחילות בסדר אקראי ו"מתחרות" פיזית למקומן הנכון', V21],
    ['22. קונפטי למקום הראשון', 'הרצף הרגיל מתנגן, וכשמקום 1 נחשף מתפוצץ קונפטי קטן', V22],
    ['23. מטושטש להתמקדות הדרגתית', 'כל שורה מתחילה מטושטשת ומתחדדת בחשיפה, במדרג', V23],
    ['24. מפל זום-אין', 'כל שורה גדלה מכמעט אפס לגודל מלא, במדרג', V24],
    ['25. גל וילון', 'מסכה נעה כמו וילון חושפת כל שורה בתורה', V25],
    ['26. הקשה לחשיפת הבאה', 'המשתמש צריך להקיש כדי לחשוף כל שורה בתורה — בקצב שלו', V26],
    ['27. גלילה אוטומטית ואז התיישבות', 'הרשימה גוללת לאט למטה בטעינה, חושפת שורות תוך כדי, ואז מתייצבת', V27],
    ['28. פענוח גליץ׳', 'כל שורה מתממשת דרך הבהוב דיגיטלי קצר לפני שמתייצבת', V28],
    ['29. מילוי נוזלי', 'רקע כל שורה מתמלא כמו נוזל שנשפך, במדרג', V29],
    ['30. ספירה לאחור גלויה', 'ספרה 3-2-1 גלויה נספרת לפני כל חשיפה — קצב דרמטי ומכוון', V30],
  ]},
  { title: 'קבוצה D — נושאי וחווייתי', items: [
    ['31. לוח תוצאות אצטדיון', 'שורות "מתהפכות" כמו לוח split-flap בשדה תעופה, במדרג מהאחרון לראשון', V31],
    ['32. ספרינט צילום-סיום', 'שורות נכנסות אופקית במהירויות שונות כמו רצים, ומגיעות למקומן לפי דירוג', V32],
    ['33. מפל זוהר גביע', 'כל שורה מקבלת מעבר ברק זהוב חולף אחרי החשיפה, במדרג', V33],
    ['34. פעימת לב', 'כל שורה נחשפת עם דופק כפול מהיר לפני שהיא מתייצבת, במדרג', V34],
    ['35. משרוקית סיום', 'כל השורות מוסתרות עד רגע "המשרוקית", ואז כולן מתפרצות כמעט בו-זמנית', V35],
  ]},
];

export default function AdminListRevealDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 35 רעיונות לרצף חשיפת טבלת הדירוג</h2>
        <p className="text-slate-500 text-sm">איך כל הרשימה המדורגת נכנסת למסך — סדר, קצב וסגנון תנועה. לא נוגע בעיצוב הכרטיס עצמו (ר׳ 150 עיצובי כרטיס משתתף) ולא ב-LeaderboardPanel.jsx עצמו. כולן חיות עם כפתור "הצג שוב".</p>
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
