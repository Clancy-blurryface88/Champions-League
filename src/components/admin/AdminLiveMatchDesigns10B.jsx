import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamFlag from '../TeamFlag';
import { LIVE, Shell, DesignGrid } from './_liveMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Round 2 (of 2): 10 MORE alternative concepts for the Live Match intro
   card. Focus here: the reveal *mechanic* itself (split-flap, doors, coin,
   envelope, referee card, goal, long-press bloom, radio tune-in) rather
   than the minute indicator.
   Temporary comparison tab — pick one, then it gets wired in and both
   batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

function ScoreText({ revealed, size = 20, color = '#fff' }) {
  return (
    <motion.span
      animate={{ filter: revealed ? 'blur(0px)' : 'blur(6px)', opacity: revealed ? 1 : 0.45 }}
      transition={{ duration: 0.35 }}
      style={{ fontFamily: "'Russo One', sans-serif", fontSize: size, color }}
    >
      {LIVE.homeScore} - {LIVE.awayScore}
    </motion.span>
  );
}

const Flags = ({ size = 'w-10 h-10' }) => (
  <div className="flex items-center gap-3" dir="ltr">
    <TeamFlag logo={LIVE.homeCode} name={LIVE.home} className={size} />
    <TeamFlag logo={LIVE.awayCode} name={LIVE.away} className={size} />
  </div>
);

const Hint = ({ children }) => <span className="text-[10px] text-slate-500">{children}</span>;
const Minute = () => <span className="text-slate-400 text-[10px]">{LIVE.minute}'</span>;

/* ── 1. Scoreboard Split-Flap ─────────────────────────────────────────────── */
function FlapDigit({ target, revealed }) {
  return (
    <div style={{ width: 20, height: 26, borderRadius: 4, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(245,197,24,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <AnimatePresence mode="popLayout">
        <motion.span key={revealed ? target : '?'} initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: -90, opacity: 0 }} transition={{ duration: 0.3 }}
          style={{ fontFamily: 'monospace', fontWeight: 800, color: '#f5c518', fontSize: 14 }}>
          {revealed ? target : '?'}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
function B1() {
  const [revealed, setRevealed] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 12 }}>
      <Flags />
      <Minute />
      <div className="flex items-center gap-1.5" style={{ perspective: 300 }}>
        <FlapDigit target={String(LIVE.homeScore)} revealed={revealed} />
        <span className="text-slate-500 text-xs">-</span>
        <FlapDigit target={String(LIVE.awayScore)} revealed={revealed} />
      </div>
      <button onClick={() => setRevealed((r) => !r)} className="text-[10px] px-3 py-1 rounded-full border border-amber-400/40 text-amber-300">🎰 פתח לוח</button>
    </Shell>
  );
}

/* ── 2. Fog Reveal ────────────────────────────────────────────────────────── */
function B2() {
  const [drag, setDrag] = useState(0);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <Flags />
      <Minute />
      <div
        onMouseMove={(e) => { if (e.buttons === 1) { const r = e.currentTarget.getBoundingClientRect(); setDrag(((e.clientX - r.left) / r.width) * 100); } }}
        onTouchMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const t = e.touches[0]; setDrag(((t.clientX - r.left) / r.width) * 100); }}
        style={{ position: 'relative', width: 130, height: 34, borderRadius: 8, overflow: 'hidden', cursor: 'grab' }}
      >
        <div className="absolute inset-0 flex items-center justify-center"><ScoreText revealed size={16} /></div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, #cbd5e1, #94a3b8)', opacity: 0.9, clipPath: `inset(0 0 0 ${Math.min(drag, 100)}%)` }} />
      </div>
      <Hint>גרור (לחוץ) שמאלה לפזר את הערפל</Hint>
    </Shell>
  );
}

/* ── 3. Locker Room Doors ─────────────────────────────────────────────────── */
function B3() {
  const [open, setOpen] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <Flags />
      <Minute />
      <div onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer', position: 'relative', width: 140, height: 50, perspective: 400 }}>
        <div className="absolute inset-0 flex items-center justify-center"><ScoreText revealed={open} size={16} /></div>
        <motion.div animate={{ rotateY: open ? -110 : 0 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', background: '#0d3b66', transformOrigin: 'left center', borderRadius: '4px 0 0 4px' }} />
        <motion.div animate={{ rotateY: open ? 110 : 0 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', background: '#6b4a05', transformOrigin: 'right center', borderRadius: '0 4px 4px 0' }} />
      </div>
      <Hint>הקש כדי לפתוח את הדלתות</Hint>
    </Shell>
  );
}

/* ── 4. Coin Flip Medallion ───────────────────────────────────────────────── */
function B4() {
  const [flipped, setFlipped] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10, perspective: 500 }}>
      <Flags />
      <Minute />
      <motion.div onClick={() => setFlipped((f) => !f)} animate={{ rotateY: flipped ? 720 : 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{ cursor: 'pointer', width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#f5c518,#b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff7cc' }}>
        <ScoreText revealed={flipped} size={13} color="#030d1a" />
      </motion.div>
      <Hint>הקש כדי להטיל את המדליה</Hint>
    </Shell>
  );
}

/* ── 5. Sealed Envelope ───────────────────────────────────────────────────── */
function B5() {
  const [open, setOpen] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10, perspective: 400 }}>
      <Flags />
      <Minute />
      <div onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer', position: 'relative', width: 100, height: 60, background: '#0d1f36', border: '1px solid rgba(245,197,24,0.35)', borderRadius: 6 }}>
        <motion.div animate={{ rotateX: open ? 160 : 0 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 30, background: '#0d3b66', transformOrigin: 'top', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
        <div className="absolute inset-0 flex items-center justify-center"><ScoreText revealed={open} size={14} /></div>
        {!open && <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: '50%', background: '#f5c518' }} />}
      </div>
      <Hint>הקש כדי לשבור את החותם</Hint>
    </Shell>
  );
}

/* ── 6. Referee Card Flip ─────────────────────────────────────────────────── */
function B6() {
  const [flipped, setFlipped] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10, perspective: 400 }}>
      <Flags />
      <Minute />
      <motion.div onClick={() => setFlipped((f) => !f)} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5 }}
        style={{ cursor: 'pointer', width: 60, height: 82, borderRadius: 6, position: 'relative', transformStyle: 'preserve-3d' }}>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: '#eab308', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 20 }}>🟨</span>
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: '#0d1f36', borderRadius: 6, border: '1px solid rgba(245,197,24,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ScoreText revealed={flipped} size={13} />
        </div>
      </motion.div>
      <Hint>הקש על כרטיס השופט</Hint>
    </Shell>
  );
}

/* ── 7. Ball Trajectory Goal ──────────────────────────────────────────────── */
function B7() {
  const [kicked, setKicked] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <Flags />
      <Minute />
      <div style={{ position: 'relative', width: 140, height: 40 }}>
        <div style={{ position: 'absolute', right: 4, top: 4, fontSize: 18 }}>🥅</div>
        <motion.div onClick={() => setKicked(true)} animate={kicked ? { x: 100, scale: 0.6, opacity: 0 } : { x: 0 }} transition={{ duration: 0.5, ease: 'easeIn' }}
          style={{ cursor: 'pointer', position: 'absolute', left: 4, top: 8, fontSize: 16 }}>⚽</motion.div>
        <div className="absolute inset-0 flex items-center justify-center"><ScoreText revealed={kicked} size={15} /></div>
      </div>
      <Hint>הקש על הכדור לבעיטה לשער</Hint>
    </Shell>
  );
}

/* ── 8. Live Pulse Long-Press Bloom ───────────────────────────────────────── */
function B8() {
  const [bloomed, setBloomed] = useState(false);
  const timer = useRef(null);
  const start = () => { timer.current = setTimeout(() => setBloomed(true), 600); };
  const cancel = () => clearTimeout(timer.current);
  return (
    <Shell style={{ flexDirection: 'column', gap: 12 }}>
      <AnimatePresence mode="wait">
        {!bloomed ? (
          <motion.div key="dot" onMouseDown={start} onMouseUp={cancel} onMouseLeave={cancel} onTouchStart={start} onTouchEnd={cancel}
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
            style={{ cursor: 'pointer', width: 16, height: 16, borderRadius: '50%', background: '#f87171', boxShadow: '0 0 10px #f87171' }} />
        ) : (
          <motion.div key="full" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2">
            <Flags /><Minute /><ScoreText revealed size={18} />
          </motion.div>
        )}
      </AnimatePresence>
      <Hint>{bloomed ? '' : 'לחיצה ארוכה על הנקודה האדומה'}</Hint>
    </Shell>
  );
}

/* ── 9. Tension-Scaling Ring ──────────────────────────────────────────────── */
function B9() {
  const [revealed, setRevealed] = useState(false);
  const late = LIVE.minute >= 75;
  const accent = late ? '#f87171' : '#f5c518';
  const pct = LIVE.minute / 90;
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'relative', width: 110, height: 110 }} onClick={() => setRevealed((r) => !r)}>
        <svg width="110" height="110" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <motion.circle cx="55" cy="55" r="48" fill="none" stroke={accent} strokeWidth="4" strokeDasharray={302} strokeDashoffset={302 - 302 * pct} strokeLinecap="round"
            animate={{ opacity: [1, late ? 0.4 : 0.7, 1] }} transition={{ duration: late ? 0.6 : 1.6, repeat: Infinity }}
            style={{ cursor: 'pointer', filter: `drop-shadow(0 0 6px ${accent})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span style={{ color: accent, fontSize: 12, fontWeight: 800 }}>{LIVE.minute}'</span>
          <Flags size="w-6 h-6" />
        </div>
      </div>
      <ScoreText revealed={revealed} />
      <Hint>{late ? 'דקות אחרונות — הטבעת דופקת מהר' : 'הקש על הטבעת לתוצאה'}</Hint>
    </Shell>
  );
}

/* ── 10. Radio Static Tune-In ─────────────────────────────────────────────── */
function useGlitchText(text, active) {
  const glyphs = '01#$%&?*';
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    const iv = setInterval(() => setDisplay(text.split('').map((c) => (c === ' ' || c === '-' ? c : glyphs[Math.floor(Math.random() * glyphs.length)])).join('')), 70);
    return () => clearInterval(iv);
  }, [active, text]);
  return display;
}
function B10() {
  const [tuned, setTuned] = useState(false);
  const raw = `${LIVE.homeScore} - ${LIVE.awayScore}`;
  const display = useGlitchText(raw, !tuned);
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <Flags />
      <Minute />
      <span onClick={() => setTuned(true)} style={{ cursor: 'pointer', fontFamily: 'monospace', fontSize: 20, color: tuned ? '#4ade80' : '#94a3b8', letterSpacing: 1 }}>{display}</span>
      <Hint>הקש כדי "לכוון" את השידור</Hint>
    </Shell>
  );
}

const DESIGNS = [
  { id: 1, name: 'Scoreboard Split-Flap', Comp: B1 },
  { id: 2, name: 'Fog Reveal', Comp: B2 },
  { id: 3, name: 'Locker Room Doors', Comp: B3 },
  { id: 4, name: 'Coin Flip Medallion', Comp: B4 },
  { id: 5, name: 'Sealed Envelope', Comp: B5 },
  { id: 6, name: 'Referee Card Flip', Comp: B6 },
  { id: 7, name: 'Ball Trajectory Goal', Comp: B7 },
  { id: 8, name: 'Live Pulse Long-Press Bloom', Comp: B8 },
  { id: 9, name: 'Tension-Scaling Ring', Comp: B9 },
  { id: 10, name: 'Radio Static Tune-In', Comp: B10 },
];

export default function AdminLiveMatchDesigns10B() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="10 עיצובים נוספים — כרטיס משחק חי (סבב 2: מנגנון החשיפה)"
      subtitle="כאן הדגש הוא איך התוצאה 'נפתחת' — נסה ללחוץ/לגרור/להחזיק בכל כרטיס"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
