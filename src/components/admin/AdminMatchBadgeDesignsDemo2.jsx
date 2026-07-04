import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   Round 2 of the "today's matches" button exploration — this time: shapes
   beyond the circle, real 3D depth treatments, and genuinely interactive
   previews (respond to your actual cursor/press, not just a looping demo).
   ────────────────────────────────────────────────────────────────────────── */

const COUNT = 3;
const GREEN_BG = 'linear-gradient(145deg, #1a3a2a 0%, #0d2018 100%)';
const GOLD = 'rgba(245,197,24,0.5)';

const CAT_COLORS = { shape: '#22d3ee', depth: '#a78bfa', interact: '#fb923c' };
const CAT_LABELS = { shape: 'צורה חלופית', depth: 'עומק תלת-מימד', interact: 'אינטראקטיבי אמיתי' };

const NumBadge = ({ style }) => (
  <span className="absolute flex items-center justify-center font-bold" style={{ minWidth: 16, height: 16, padding: '0 2px', borderRadius: 999, background: '#fbbf24', color: '#000', fontSize: 9, boxShadow: '0 2px 6px rgba(0,0,0,0.4)', ...style }}>{COUNT}</span>
);

function LoopStage({ interval = 3400, children }) {
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setCycle((c) => c + 1), interval);
    return () => clearInterval(iv);
  }, [interval]);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait"><motion.div key={cycle}>{children}</motion.div></AnimatePresence>
    </div>
  );
}

/* ── 8 · shapes ───────────────────────────────────────────────────────── */

const P1 = () => ( // hexagon
  <div style={{ position: 'relative', width: 56, height: 56, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span className="text-xl">🏟️</span><NumBadge style={{ top: 2, right: 2 }} />
  </div>
);

const P2 = () => ( // squircle
  <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '30% 30% 32% 32% / 40% 40% 30% 30%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4 }} />
  </div>
);

const P3 = () => ( // shield
  <div style={{ position: 'relative', width: 50, height: 58, clipPath: 'polygon(50% 0%, 100% 15%, 100% 55%, 50% 100%, 0% 55%, 0% 15%)', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 8 }}>
    <span className="text-xl">🏟️</span><NumBadge style={{ top: 4, right: 2 }} />
  </div>
);

const P4 = () => ( // ticket stub with notches
  <div style={{ position: 'relative', width: 68, height: 40, background: GREEN_BG, border: `1.5px solid ${GOLD}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', top: -6, left: '50%', marginLeft: -6, width: 12, height: 12, borderRadius: '50%', background: '#050d1a' }} />
    <div style={{ position: 'absolute', bottom: -6, left: '50%', marginLeft: -6, width: 12, height: 12, borderRadius: '50%', background: '#050d1a' }} />
    <span className="text-lg">🏟️</span>
    <NumBadge style={{ top: 2, right: 4 }} />
  </div>
);

const P5 = () => ( // diamond
  <div style={{ position: 'relative', width: 44, height: 44, background: GREEN_BG, border: `1.5px solid ${GOLD}`, transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span className="text-lg" style={{ transform: 'rotate(-45deg)' }}>🏟️</span>
    <span className="absolute flex items-center justify-center font-bold" style={{ top: -8, right: -8, transform: 'rotate(-45deg)', minWidth: 16, height: 16, borderRadius: 999, background: '#fbbf24', color: '#000', fontSize: 9 }}>{COUNT}</span>
  </div>
);

const P6 = () => { // organic morphing blob
  const shapes = ['62% 38% 55% 45% / 45% 55% 45% 55%', '45% 55% 62% 38% / 55% 45% 55% 45%', '55% 45% 45% 55% / 38% 62% 38% 62%'];
  const [i, setI] = useState(0);
  useEffect(() => { const iv = setInterval(() => setI((v) => (v + 1) % shapes.length), 1400); return () => clearInterval(iv); }, []);
  return (
    <motion.div animate={{ borderRadius: shapes[i] }} transition={{ duration: 1.2, ease: 'easeInOut' }}
      style={{ position: 'relative', width: 56, height: 56, background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4 }} />
    </motion.div>
  );
};

const P7 = () => ( // stadium arch
  <div style={{ position: 'relative', width: 56, height: 52 }}>
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 34, background: GREEN_BG, border: `1.5px solid ${GOLD}`, borderTop: 'none', borderRadius: '0 0 8px 8px' }} />
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 36, background: GREEN_BG, border: `1.5px solid ${GOLD}`, borderBottom: 'none', borderRadius: '28px 28px 0 0' }} />
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="text-lg">🏟️</span></div>
    <NumBadge style={{ top: -4, right: -4 }} />
  </div>
);

const P8 = () => ( // pentagon / home-plate
  <div style={{ position: 'relative', width: 54, height: 54, clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span className="text-lg" style={{ marginTop: -4 }}>🏟️</span><NumBadge style={{ top: 6, right: 2 }} />
  </div>
);

/* ── 8 · 3D depth ─────────────────────────────────────────────────────── */

const P9 = () => ( // isometric cube
  <div style={{ position: 'relative', width: 60, height: 60 }}>
    <div style={{ position: 'absolute', top: 6, left: 6, width: 44, height: 44, background: '#0a1a10', borderRadius: 10 }} />
    <div style={{ position: 'absolute', top: 0, left: 0, width: 44, height: 44, background: GREEN_BG, border: `1.5px solid ${GOLD}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="text-lg">🏟️</span>
    </div>
    <NumBadge style={{ top: -4, right: 2 }} />
  </div>
);

const P10 = () => ( // neumorphism soft extrude
  <div style={{ position: 'relative', width: 56, height: 56, borderRadius: 18, background: '#132a1c', boxShadow: '7px 7px 14px rgba(0,0,0,0.55), -6px -6px 12px rgba(50,90,65,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4 }} />
  </div>
);

const P11 = () => { // glass layered parallax
  const [t, setT] = useState(0);
  useEffect(() => { const iv = setInterval(() => setT((v) => v + 1), 50); return () => clearInterval(iv); }, []);
  const off = Math.sin(t / 20) * 3;
  return (
    <div style={{ position: 'relative', width: 60, height: 60 }}>
      <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', transform: `translate(${-off}px, ${off}px)` }} />
      <div style={{ position: 'absolute', inset: 3, borderRadius: '50%', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', transform: `translate(${off * 0.5}px, ${-off * 0.5}px)` }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
        <span className="text-xl">🏟️</span>
      </div>
      <NumBadge style={{ top: -2, right: -2 }} />
    </div>
  );
};

const P12 = () => ( // embossed medal
  <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', background: 'conic-gradient(from 180deg,#fde68a,#b8860b,#fde68a,#b8860b,#fde68a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: GREEN_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
      <span className="text-lg">🏟️</span>
    </div>
    <NumBadge style={{ top: -2, right: -2 }} />
  </div>
);

const P13 = () => { // floating disc + shadow base
  const [up, setUp] = useState(false);
  useEffect(() => { const iv = setInterval(() => setUp((v) => !v), 1200); return () => clearInterval(iv); }, []);
  return (
    <div style={{ position: 'relative', width: 60, height: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
      <motion.div animate={{ y: up ? -8 : 0 }} transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ width: 48, height: 48, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <span className="text-lg">🏟️</span><NumBadge style={{ top: -4, right: -4 }} />
      </motion.div>
      <motion.div animate={{ scale: up ? 0.8 : 1, opacity: up ? 0.25 : 0.5 }} transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ width: 36, height: 8, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', filter: 'blur(2px)', marginTop: 4 }} />
    </div>
  );
};

const P14 = () => ( // extruded icon (fake thickness via layered duplicates)
  <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span className="text-xl" style={{ position: 'absolute', color: '#052e10', transform: 'translate(2px,2px)' }}>🏟️</span>
    <span className="text-xl" style={{ position: 'absolute', color: '#0a4a20', transform: 'translate(1px,1px)' }}>🏟️</span>
    <span className="text-xl" style={{ position: 'relative' }}>🏟️</span>
    <NumBadge style={{ top: -4, right: -4 }} />
  </div>
);

const P15 = () => ( // isometric mini stadium tiers
  <div style={{ position: 'relative', width: 60, height: 56 }}>
    <div style={{ position: 'absolute', bottom: 0, left: 4, right: 4, height: 14, background: '#0d3a1f', borderRadius: 3, transform: 'perspective(80px) rotateX(35deg)' }} />
    <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, height: 14, background: '#155a2c', borderRadius: 3, transform: 'perspective(80px) rotateX(35deg)' }} />
    <div style={{ position: 'absolute', bottom: 20, left: 16, right: 16, height: 14, background: GREEN_BG, border: `1px solid ${GOLD}`, borderRadius: 3, transform: 'perspective(80px) rotateX(35deg)' }} />
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center' }}><span className="text-sm">⚽</span></div>
    <NumBadge style={{ top: -2, right: 4 }} />
  </div>
);

const P16 = () => { // holographic prism edge
  const [deg, setDeg] = useState(0);
  useEffect(() => { const iv = setInterval(() => setDeg((d) => d + 4), 60); return () => clearInterval(iv); }, []);
  return (
    <div style={{ position: 'relative', width: 58, height: 58, borderRadius: '50%', padding: 2, background: `conic-gradient(from ${deg}deg, #7dd3fc, #f0abfc, #fde68a, #86efac, #7dd3fc)` }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: GREEN_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-lg">🏟️</span>
      </div>
      <NumBadge style={{ top: 0, right: 0 }} />
    </div>
  );
};

/* ── 9 · real interactivity ───────────────────────────────────────────── */

const P17 = () => { // tilt follows cursor
  const ref = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setRot({ x: py * -30, y: px * 30 });
      }}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      animate={{ rotateX: rot.x, rotateY: rot.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
    >
      <span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4 }} />
      <div style={{ position: 'absolute', bottom: -16, fontSize: 8, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>העבר עכבר מעל</div>
    </motion.div>
  );
};

const P18 = () => { // press-down squish
  const [pressed, setPressed] = useState(false);
  return (
    <motion.div
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      animate={{ scale: pressed ? 0.85 : 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: pressed ? '0 1px 4px rgba(0,0,0,0.4)' : '0 6px 16px rgba(0,0,0,0.5)' }}
    >
      <span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4 }} />
      <div style={{ position: 'absolute', bottom: -16, fontSize: 8, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>לחץ והחזק</div>
    </motion.div>
  );
};

const P19 = () => { // magnetic hover
  const ref = useRef(null);
  const [off, setOff] = useState({ x: 0, y: 0 });
  return (
    <div ref={ref} style={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        setOff({ x: dx * 0.25, y: dy * 0.25 });
      }}
      onMouseLeave={() => setOff({ x: 0, y: 0 })}
    >
      <motion.div animate={{ x: off.x, y: off.y }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ width: 52, height: 52, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <span className="text-lg">🏟️</span><NumBadge style={{ top: -4, right: -4 }} />
      </motion.div>
    </div>
  );
};

const P20 = () => { // long-press reveal
  const [held, setHeld] = useState(false);
  const timerRef = useRef(null);
  const start = () => { timerRef.current = setTimeout(() => setHeld(true), 550); };
  const cancel = () => { clearTimeout(timerRef.current); setHeld(false); };
  return (
    <motion.div
      onMouseDown={start} onMouseUp={cancel} onMouseLeave={cancel}
      onTouchStart={start} onTouchEnd={cancel}
      animate={{ width: held ? 130 : 56, borderRadius: held ? 20 : 999 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ height: 56, background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: held ? 'flex-start' : 'center', overflow: 'hidden', cursor: 'pointer', paddingInline: held ? 14 : 0 }}
    >
      <span className="text-lg flex-shrink-0">🏟️</span>
      {held && <span style={{ color: '#fbbf24', fontSize: 10, fontWeight: 800, marginRight: 8, whiteSpace: 'nowrap' }}>ברזיל · ארגנטינה · +1</span>}
      {!held && <NumBadge style={{ top: -4, right: -4 }} />}
    </motion.div>
  );
};

const P21 = () => { // ripple on tap
  const [ripples, setRipples] = useState([]);
  const onClick = (e) => {
    const id = Date.now();
    setRipples((r) => [...r, id]);
    setTimeout(() => setRipples((r) => r.filter((x) => x !== id)), 650);
  };
  return (
    <div onClick={onClick} style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
      {ripples.map((id) => (
        <motion.span key={id} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'absolute', width: 20, height: 20, borderRadius: '50%', background: 'rgba(245,197,24,0.5)' }} />
      ))}
      <span className="text-xl" style={{ position: 'relative' }}>🏟️</span>
      <NumBadge style={{ top: -4, right: -4 }} />
    </div>
  );
};

const P22 = () => ( // drag to peek
  <motion.div
    drag dragConstraints={{ top: -30, bottom: 0, left: -10, right: 10 }} dragElastic={0.3}
    dragTransition={{ bounceStiffness: 400, bounceDamping: 18 }}
    whileDrag={{ scale: 1.08 }}
    style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab' }}
  >
    <span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4 }} />
    <div style={{ position: 'absolute', bottom: -30, fontSize: 8, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>גרור מעלה לתצוגה</div>
  </motion.div>
);

const P23 = () => { // flip on click to reveal back
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ perspective: 400 }}>
      <motion.div
        onClick={() => setFlipped((f) => !f)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', cursor: 'pointer', transformStyle: 'preserve-3d' }}
      >
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' }}>
          <span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4 }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#0d2018', border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 800, textAlign: 'center' }}>ברזיל<br />ארגנטינה</span>
        </div>
      </motion.div>
    </div>
  );
};

const P24 = () => { // double-tap bounce confirmation
  const [key, setKey] = useState(0);
  return (
    <motion.div
      key={key}
      onDoubleClick={() => setKey((k) => k + 1)}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.35, 0.9, 1.1, 1] }}
      transition={{ duration: 0.6 }}
      style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
    >
      <span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4 }} />
      <div style={{ position: 'absolute', bottom: -16, fontSize: 8, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>לחיצה כפולה</div>
    </motion.div>
  );
};

const P25 = () => { // orbiting satellite mini-badges
  const [t, setT] = useState(0);
  useEffect(() => { const iv = setInterval(() => setT((v) => v + 1), 40); return () => clearInterval(iv); }, []);
  const flags = ['🇧🇷', '🇦🇷', '🇺🇸'];
  return (
    <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {flags.map((f, i) => {
        const angle = (t * 1.2 + i * 120) * (Math.PI / 180);
        const x = Math.cos(angle) * 30;
        const y = Math.sin(angle) * 30;
        return <span key={i} style={{ position: 'absolute', fontSize: 13, transform: `translate(${x}px, ${y}px)` }}>{f}</span>;
      })}
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: GREEN_BG, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <span className="text-lg">🏟️</span>
      </div>
      <NumBadge style={{ top: 14, right: 14, zIndex: 3 }} />
    </div>
  );
};

/* ── data ─────────────────────────────────────────────────────────────── */
const DESIGNS = [
  { id: 1, cat: 'shape', name: 'משושה', sub: 'Hexagon', desc: 'צורה ספורטיבית, מרגישה כמו תג e-sports.', Preview: P1 },
  { id: 2, cat: 'shape', name: 'סקוארקל', sub: 'Squircle', desc: 'ריבוע-עיגול בסגנון אייקוני אפליקציה.', Preview: P2 },
  { id: 3, cat: 'shape', name: 'מגן', sub: 'Shield', desc: 'כמו סמל נבחרת — מרגיש "רשמי" יותר.', Preview: P3 },
  { id: 4, cat: 'shape', name: 'בדל כרטיס', sub: 'Ticket Stub', desc: 'עם חריצי ניקוב בצדדים כמו כרטיס אמיתי.', Preview: P4 },
  { id: 5, cat: 'shape', name: 'מעוין', sub: 'Diamond', desc: 'ריבוע מוטה ב-45°, בולט ושונה מכל השאר בתפריט.', Preview: P5 },
  { id: 6, cat: 'shape', name: 'בלוב אורגני', sub: 'Organic Morphing Blob', desc: 'הצורה עצמה זזה ומשתנה בעדינות ברציפות.', Preview: P6 },
  { id: 7, cat: 'shape', name: 'קשת אצטדיון', sub: 'Stadium Arch', desc: 'קימור עליון כמו כניסת אצטדיון.', Preview: P7 },
  { id: 8, cat: 'shape', name: 'מחומש', sub: 'Pentagon / Home Plate', desc: 'צורת "בית" מבייסבול — ייחודי וזוויתי.', Preview: P8 },
  { id: 9, cat: 'depth', name: 'קובייה איזומטרית', sub: 'Isometric Cube', desc: 'שכבת צל מוזחת יוצרת תחושת בלוק תלת-מימדי.', Preview: P9 },
  { id: 10, cat: 'depth', name: 'נאומורפיזם', sub: 'Soft Neumorphism', desc: 'בליטה רכה מתוך הרקע, בלי מסגרת חדה.', Preview: P10 },
  { id: 11, cat: 'depth', name: 'שכבות זכוכית פרלקס', sub: 'Glass Layered Parallax', desc: 'כמה שכבות שקופות זזות בעדינות זו ביחס לזו.', Preview: P11 },
  { id: 12, cat: 'depth', name: 'מדליה מוטבעת', sub: 'Embossed Medal', desc: 'טבעת זהב מסתובבת עם עומק מתכתי, כמו אות הצטיינות.', Preview: P12 },
  { id: 13, cat: 'depth', name: 'דיסקית מרחפת', sub: 'Floating Disc + Shadow', desc: 'הכפתור מרחף מעל צל בסיס שמתכווץ/מתרחב בהתאם.', Preview: P13 },
  { id: 14, cat: 'depth', name: 'אייקון מוקצע', sub: 'Extruded Icon', desc: 'שכבות כפולות מוזחות מאחורי האייקון יוצרות עומק מזויף.', Preview: P14 },
  { id: 15, cat: 'depth', name: 'אצטדיון מיניאטורי איזומטרי', sub: 'Isometric Mini Stadium', desc: 'שלוש יציעים בפרספקטיבה — ממש נראה כמו אצטדיון קטן.', Preview: P15 },
  { id: 16, cat: 'depth', name: 'קצה הולוגרפי', sub: 'Holographic Prism Edge', desc: 'טבעת צבעים שמסתובבת ברציפות כמו אפקט שבירת אור.', Preview: P16 },
  { id: 17, cat: 'interact', name: 'הטיה עוקבת עכבר', sub: 'Cursor-Tracking Tilt', desc: 'תזיז את העכבר מעל — הכפתור נוטה תלת-מימדית לכיוון שלך.', Preview: P17 },
  { id: 18, cat: 'interact', name: 'לחיצה עם דחיסה', sub: 'Press-Down Squish', desc: 'לחץ והחזק — הכפתור מתכווץ פיזית ברגע הלחיצה.', Preview: P18 },
  { id: 19, cat: 'interact', name: 'משיכה מגנטית', sub: 'Magnetic Hover', desc: 'הכפתור "נמשך" בעדינות לכיוון העכבר כשמתקרבים אליו.', Preview: P19 },
  { id: 20, cat: 'interact', name: 'לחיצה ארוכה חושפת', sub: 'Long-Press Reveal', desc: 'החזק לחיצה כחצי שנייה — הכפתור מתרחב ומראה את המשחקים בפועל.', Preview: P20 },
  { id: 21, cat: 'interact', name: 'ריפל בלחיצה', sub: 'Ripple on Tap', desc: 'כל קליק שולח גל טבעת שמתפשט ונמוג, כמו Material Design.', Preview: P21 },
  { id: 22, cat: 'interact', name: 'גרירה להצצה', sub: 'Drag to Peek', desc: 'ניתן לגרור את הכפתור עצמו, עם קפיץ חזרה למקום.', Preview: P22 },
  { id: 23, cat: 'interact', name: 'היפוך בלחיצה', sub: 'Click-to-Flip', desc: 'קליק הופך את הכפתור ומגלה את שמות הקבוצות בגב.', Preview: P23 },
  { id: 24, cat: 'interact', name: 'קפיצת אישור בלחיצה כפולה', sub: 'Double-Tap Bounce', desc: 'לחיצה כפולה מפעילה קפיצת אישור משחקית.', Preview: P24 },
  { id: 25, cat: 'interact', name: 'לוויינים מקיפים', sub: 'Orbiting Satellites', desc: 'דגלי הקבוצות שמשחקות היום מקיפים את הכפתור במסלול מתמשך.', Preview: P25 },
];

const CATS = ['הכול', 'shape', 'depth', 'interact'];

/* ── Card ─────────────────────────────────────────────────────────────── */
function DesignCard({ d, isSelected, onSelect }) {
  const { Preview } = d;
  const accent = CAT_COLORS[d.cat];
  const isInteractive = d.cat === 'interact';
  return (
    <motion.div
      onClick={(e) => { if (isInteractive) return; onSelect(); }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      style={{
        borderRadius: 14, overflow: 'hidden',
        border: isSelected ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.07)',
        cursor: isInteractive ? 'default' : 'pointer',
        boxShadow: isSelected ? `0 0 24px ${accent}55` : '0 4px 20px rgba(0,0,0,0.5)',
        transition: 'border-color .2s, box-shadow .2s',
      }}
    >
      <div style={{ height: 160, position: 'relative', background: 'linear-gradient(160deg,#050d1a,#0d1a2e)', overflow: 'hidden' }}>
        {isInteractive ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Preview /></div>
        ) : (
          <LoopStage><Preview /></LoopStage>
        )}
        {isSelected && (
          <div style={{ position: 'absolute', top: 10, left: 10, width: 22, height: 22, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <span style={{ color: '#000', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 999, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>{d.id}</div>
      </div>

      <div
        onClick={isInteractive ? onSelect : undefined}
        style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', padding: '10px 12px', cursor: isInteractive ? 'pointer' : 'default' }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{d.name}</span>
          <span style={{ color: accent, fontSize: 9 }}>{CAT_LABELS[d.cat]}</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginTop: 2 }}>{d.sub}</div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10.5, marginTop: 4, lineHeight: 1.5 }}>{d.desc}</div>
      </div>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function AdminMatchBadgeDesignsDemo2() {
  const [selected, setSelected] = useState(null);
  const [cat, setCat] = useState('הכול');

  const visible = cat === 'הכול' ? DESIGNS : DESIGNS.filter((d) => d.cat === cat);
  const selectedDesign = DESIGNS.find((d) => d.id === selected);

  return (
    <div dir="rtl" style={{ color: '#fff', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>סבב 2 — צורות, עומק ואינטראקציה אמיתית</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            {selectedDesign ? `✓ נבחר: ${selectedDesign.name} (${CAT_LABELS[selectedDesign.cat]})` : 'קטגוריית "אינטראקטיבי אמיתי" מגיבה בפועל לעכבר/מגע שלך — נסה!'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATS.map((c) => {
          const count = c === 'הכול' ? DESIGNS.length : DESIGNS.filter((d) => d.cat === c).length;
          const active = cat === c;
          const accent = CAT_COLORS[c] || '#FFD700';
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${active ? accent : 'rgba(255,255,255,0.18)'}`, background: active ? accent : 'rgba(255,255,255,0.06)', color: active ? '#000' : '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}
            >
              {c === 'הכול' ? c : CAT_LABELS[c]} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
        {visible.map((d) => (
          <DesignCard key={d.id} d={d} isSelected={selected === d.id} onSelect={() => setSelected(selected === d.id ? null : d.id)} />
        ))}
      </div>
    </div>
  );
}
