import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamFlag from '../TeamFlag';
import { MOCK, Shell, DesignGrid } from './_nextMatchDesignShared';

/* ──────────────────────────────────────────────────────────────────────────
   Round 4: 15 MORE concepts — cooler + more interactive, with the flags
   themselves as the animated/interactive centerpiece (not just static
   icons dropped into a layout).
   Temporary comparison tab — pick one, then it gets wired into Layout.jsx
   and all design-batch files get removed.
   ────────────────────────────────────────────────────────────────────────── */

const VS = () => <span className="text-slate-400 text-[10px] font-bold">VS</span>;

/* ── 1. Flag Cloth Wave ───────────────────────────────────────────────────── */
function WavingFlag({ code, name, delay = 0 }) {
  return (
    <motion.div
      animate={{ skewY: [-3, 3, -2, 2, -3], scaleY: [1, 0.97, 1.02, 0.98, 1] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ transformOrigin: 'left center' }}
    >
      <TeamFlag logo={code} name={name} className="w-14 h-14" />
    </motion.div>
  );
}
function G1() {
  return (
    <Shell>
      <div className="flex items-center gap-6" dir="ltr">
        <WavingFlag code={MOCK.teamACode} name={MOCK.teamA} />
        <VS />
        <WavingFlag code={MOCK.teamBCode} name={MOCK.teamB} delay={0.4} />
      </div>
    </Shell>
  );
}

/* ── 2. Flag Flip Battle ──────────────────────────────────────────────────── */
function FlipFlag({ code, name }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div onClick={() => setFlipped((f) => !f)} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.55 }}
      style={{ width: 56, height: 56, cursor: 'pointer', transformStyle: 'preserve-3d', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}><TeamFlag logo={code} name={name} className="w-14 h-14" /></div>
      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 8, background: '#0d3b66', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-white text-[9px] font-bold text-center px-1">{name}</span>
      </div>
    </motion.div>
  );
}
function G2() {
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div className="flex items-center gap-6" dir="ltr" style={{ perspective: 500 }}>
        <FlipFlag code={MOCK.teamACode} name={MOCK.teamA} />
        <VS />
        <FlipFlag code={MOCK.teamBCode} name={MOCK.teamB} />
      </div>
      <span className="text-[10px] text-slate-500">הקש על דגל כדי להפוך</span>
    </Shell>
  );
}

/* ── 3. Drag-to-Duel ──────────────────────────────────────────────────────── */
function G3() {
  const [docked, setDocked] = useState({ a: false, b: false });
  const bothDocked = docked.a && docked.b;
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div className="flex items-center gap-10" dir="ltr">
        <motion.div drag dragConstraints={{ left: 0, right: 60, top: 0, bottom: 0 }} dragElastic={0.3}
          onDragEnd={(_, info) => setDocked((d) => ({ ...d, a: info.offset.x > 40 }))}
          animate={docked.a ? { x: 40 } : {}} style={{ cursor: 'grab' }}>
          <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-12 h-12" />
        </motion.div>
        <AnimatePresence>{bothDocked && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><VS /></motion.div>}</AnimatePresence>
        <motion.div drag dragConstraints={{ left: -60, right: 0, top: 0, bottom: 0 }} dragElastic={0.3}
          onDragEnd={(_, info) => setDocked((d) => ({ ...d, b: info.offset.x < -40 }))}
          animate={docked.b ? { x: -40 } : {}} style={{ cursor: 'grab' }}>
          <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-12 h-12" />
        </motion.div>
      </div>
      <span className="text-[10px] text-slate-500">{bothDocked ? '⚔️ הקרב מוכן!' : 'גרור את שני הדגלים זה לעבר זה'}</span>
    </Shell>
  );
}

/* ── 4. Flag Magnifier Peek ───────────────────────────────────────────────── */
function MagnifyFlag({ code, name }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div onHoverStart={() => setHover(true)} onHoverEnd={() => setHover(false)}
      animate={{ scale: hover ? 1.6 : 1, zIndex: hover ? 10 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      style={{ position: 'relative' }}>
      <TeamFlag logo={code} name={name} className="w-12 h-12" />
    </motion.div>
  );
}
function G4() {
  return (
    <Shell>
      <div className="flex items-center gap-8" dir="ltr">
        <MagnifyFlag code={MOCK.teamACode} name={MOCK.teamA} />
        <VS />
        <MagnifyFlag code={MOCK.teamBCode} name={MOCK.teamB} />
      </div>
    </Shell>
  );
}

/* ── 5. Flag Deal-In Shuffle ──────────────────────────────────────────────── */
function G5() {
  const [dealt, setDealt] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 12 }}>
      <div className="flex items-center gap-8" style={{ minHeight: 56 }} dir="ltr">
        <motion.div animate={dealt ? { x: 0, rotate: 0, opacity: 1 } : { x: 30, rotate: -8, opacity: 0.4 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
          <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-12 h-12" />
        </motion.div>
        {dealt && <VS />}
        <motion.div animate={dealt ? { x: 0, rotate: 0, opacity: 1 } : { x: -30, rotate: 8, opacity: 0.4 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
          <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-12 h-12" />
        </motion.div>
      </div>
      <button onClick={() => setDealt((d) => !d)} className="text-[10px] px-3 py-1 rounded-full border border-amber-400/40 text-amber-300">
        {dealt ? '🔁 ערבב מחדש' : '🃏 חלק קלפים'}
      </button>
    </Shell>
  );
}

/* ── 6. Flag Balloon Pop ──────────────────────────────────────────────────── */
function BalloonFlag({ code, name, delay = 0 }) {
  const [key, setKey] = useState(0);
  const [popping, setPopping] = useState(false);
  return (
    <motion.div
      key={key}
      onClick={() => { setPopping(true); setTimeout(() => { setPopping(false); setKey((k) => k + 1); }, 350); }}
      animate={popping ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] } : { y: [0, -10, 0] }}
      transition={popping ? { duration: 0.35 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ cursor: 'pointer' }}
    >
      <TeamFlag logo={code} name={name} className="w-12 h-12" rounded="full" />
    </motion.div>
  );
}
function G6() {
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div className="flex items-center gap-8" dir="ltr">
        <BalloonFlag code={MOCK.teamACode} name={MOCK.teamA} />
        <VS />
        <BalloonFlag code={MOCK.teamBCode} name={MOCK.teamB} delay={0.3} />
      </div>
      <span className="text-[10px] text-slate-500">הקש על בלון כדי לפוצץ 🎈</span>
    </Shell>
  );
}

/* ── 7. Flag Fabric Unfurl ────────────────────────────────────────────────── */
function UnfurlFlag({ code, name }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-1">
      <div onClick={() => setOpen((o) => !o)} style={{ width: 40, height: 8, borderRadius: 4, background: '#f5c518', cursor: 'pointer' }} />
      <motion.div animate={{ clipPath: open ? 'inset(0% 0 0% 0)' : 'inset(0% 0 100% 0)' }} transition={{ duration: 0.6, ease: 'easeInOut' }}>
        <TeamFlag logo={code} name={name} className="w-12 h-12" rounded="none" />
      </motion.div>
    </div>
  );
}
function G7() {
  return (
    <Shell>
      <div className="flex items-end gap-8" dir="ltr">
        <UnfurlFlag code={MOCK.teamACode} name={MOCK.teamA} />
        <VS />
        <UnfurlFlag code={MOCK.teamBCode} name={MOCK.teamB} />
      </div>
    </Shell>
  );
}

/* ── 8. Flag Orbit Swap ───────────────────────────────────────────────────── */
function G8() {
  const [spinning, setSpinning] = useState(true);
  return (
    <Shell>
      <div style={{ position: 'relative', width: 150, height: 150 }}>
        <motion.div animate={spinning ? { rotate: 360 } : {}} transition={{ duration: 3, repeat: spinning ? Infinity : 0, ease: 'linear' }} style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}><TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-11 h-11" /></div>
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}><TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-11 h-11" /></div>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center"><VS /></div>
      </div>
      <button onClick={() => setSpinning((s) => !s)} className="absolute bottom-4 text-[10px] px-3 py-1 rounded-full border border-amber-400/40 text-amber-300">
        {spinning ? '🛑 עצור' : '🔄 סובב'}
      </button>
    </Shell>
  );
}

/* ── 9. Flag Tug-of-War ───────────────────────────────────────────────────── */
function G9() {
  const [x, setX] = useState(0);
  return (
    <Shell style={{ flexDirection: 'column', gap: 12 }}>
      <div className="flex items-center gap-6" dir="ltr">
        <motion.div animate={{ scale: 1 + Math.max(-x, 0) / 200 }}><TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-12 h-12" /></motion.div>
        <motion.div drag="x" dragConstraints={{ left: -50, right: 50 }} dragElastic={0.2}
          onDrag={(_, info) => setX(info.offset.x)} onDragEnd={() => setX(0)}
          style={{ width: 60, height: 8, borderRadius: 4, background: 'linear-gradient(90deg,#f5c518,#b8860b)', cursor: 'grab' }} />
        <motion.div animate={{ scale: 1 + Math.max(x, 0) / 200 }}><TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-12 h-12" /></motion.div>
      </div>
      <span className="text-[10px] text-slate-500">גרור את החבל למי שאתה חושב ינצח 🪢</span>
    </Shell>
  );
}

/* ── 10. Flag Magnet Attract ──────────────────────────────────────────────── */
function G10() {
  const [attracted, setAttracted] = useState(false);
  return (
    <Shell style={{ flexDirection: 'column', gap: 12 }}>
      <div className="flex items-center gap-4" dir="ltr" style={{ minHeight: 56 }}>
        <motion.div animate={attracted ? { x: 0, y: 0 } : { x: -30, y: -20 }} transition={{ type: 'spring', stiffness: 120, damping: 10 }}>
          <TeamFlag logo={MOCK.teamACode} name={MOCK.teamA} className="w-12 h-12" />
        </motion.div>
        <VS />
        <motion.div animate={attracted ? { x: 0, y: 0 } : { x: 30, y: 20 }} transition={{ type: 'spring', stiffness: 120, damping: 10 }}>
          <TeamFlag logo={MOCK.teamBCode} name={MOCK.teamB} className="w-12 h-12" />
        </motion.div>
      </div>
      <button onClick={() => setAttracted((a) => !a)} className="text-[10px] px-3 py-1 rounded-full border border-amber-400/40 text-amber-300">
        {attracted ? '🔁 אפס' : '🧲 משוך למרכז'}
      </button>
    </Shell>
  );
}

/* ── 11. Flag Kaleidoscope Bloom ──────────────────────────────────────────── */
function BloomFlag({ code, name }) {
  const [key, setKey] = useState(0);
  const echoes = useMemo(() => Array.from({ length: 6 }, (_, i) => i * 60), [key]);
  return (
    <div onClick={() => setKey((k) => k + 1)} style={{ position: 'relative', width: 56, height: 56, cursor: 'pointer' }}>
      <AnimatePresence>
        {echoes.map((deg) => (
          <motion.div key={`${key}-${deg}`} initial={{ opacity: 0.6, scale: 0.4, rotate: deg }} animate={{ opacity: 0, scale: 1.4, rotate: deg }} transition={{ duration: 0.7 }}
            style={{ position: 'absolute', inset: 0 }}>
            <TeamFlag logo={code} name={name} className="w-14 h-14" />
          </motion.div>
        ))}
      </AnimatePresence>
      <TeamFlag logo={code} name={name} className="w-14 h-14" />
    </div>
  );
}
function G11() {
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div className="flex items-center gap-8" dir="ltr">
        <BloomFlag code={MOCK.teamACode} name={MOCK.teamA} />
        <VS />
        <BloomFlag code={MOCK.teamBCode} name={MOCK.teamB} />
      </div>
      <span className="text-[10px] text-slate-500">הקש על דגל לפריחה ✨</span>
    </Shell>
  );
}

/* ── 12. Flag Domino Fall ─────────────────────────────────────────────────── */
function DominoFlag({ code, name }) {
  const [key, setKey] = useState(0);
  const tiles = Array.from({ length: 5 });
  return (
    <div onClick={() => setKey((k) => k + 1)} style={{ position: 'relative', width: 56, height: 56, cursor: 'pointer' }}>
      <div key={key} style={{ position: 'absolute', inset: 0, display: 'flex' }}>
        {tiles.map((_, i) => (
          <motion.div key={i} initial={{ rotateY: 0 }} animate={{ rotateY: 90 }} transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
            style={{ flex: 1, background: '#0d3b66', borderLeft: i ? '1px solid rgba(255,255,255,0.15)' : 'none' }} />
        ))}
      </div>
      <TeamFlag logo={code} name={name} className="w-14 h-14" />
    </div>
  );
}
function G12() {
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div className="flex items-center gap-8" dir="ltr">
        <DominoFlag code={MOCK.teamACode} name={MOCK.teamA} />
        <VS />
        <DominoFlag code={MOCK.teamBCode} name={MOCK.teamB} />
      </div>
      <span className="text-[10px] text-slate-500">הקש על דגל להפלת הדומינו 🁢</span>
    </Shell>
  );
}

/* ── 13. Flag Slot Machine Spin ───────────────────────────────────────────── */
function SlotFlag({ code, name, others }) {
  const [spinning, setSpinning] = useState(false);
  const reel = spinning ? [...others, code, ...others, code] : [code];
  return (
    <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(245,197,24,0.4)', cursor: 'pointer' }}
      onClick={() => { setSpinning(true); setTimeout(() => setSpinning(false), 900); }}>
      <motion.div animate={spinning ? { y: [0, -260] } : { y: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} style={{ display: 'flex', flexDirection: 'column' }}>
        {reel.map((c, i) => <div key={i} style={{ width: 52, height: 52, flexShrink: 0 }}><TeamFlag logo={c} name={name} className="w-12 h-12" /></div>)}
      </motion.div>
    </div>
  );
}
function G13() {
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div className="flex items-center gap-8" dir="ltr">
        <SlotFlag code={MOCK.teamACode} name={MOCK.teamA} others={['fr', 'de', 'it']} />
        <VS />
        <SlotFlag code={MOCK.teamBCode} name={MOCK.teamB} others={['es', 'pt', 'nl']} />
      </div>
      <span className="text-[10px] text-slate-500">הקש על דגל לסיבוב מזל 🎰</span>
    </Shell>
  );
}

/* ── 14. Flag Ink Splash Reveal ───────────────────────────────────────────── */
function SplashFlag({ code, name }) {
  const [key, setKey] = useState(0);
  const drops = useMemo(() => Array.from({ length: 6 }, () => ({ x: (Math.random() - 0.5) * 30, y: (Math.random() - 0.5) * 30, d: Math.random() * 0.2 })), [key]);
  return (
    <div onClick={() => setKey((k) => k + 1)} style={{ position: 'relative', width: 56, height: 56, cursor: 'pointer' }}>
      <div key={key}>
        {drops.map((d, i) => (
          <motion.span key={i} initial={{ scale: 0, opacity: 0.8, x: d.x, y: d.y }} animate={{ scale: [0, 1.6, 1], opacity: [0.8, 0.4, 0] }} transition={{ duration: 0.6, delay: d.d }}
            style={{ position: 'absolute', left: '50%', top: '50%', width: 18, height: 18, borderRadius: '50%', background: '#f5c518' }} />
        ))}
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, type: 'spring' }}>
          <TeamFlag logo={code} name={name} className="w-14 h-14" />
        </motion.div>
      </div>
    </div>
  );
}
function G14() {
  return (
    <Shell style={{ flexDirection: 'column', gap: 10 }}>
      <div className="flex items-center gap-8" dir="ltr">
        <SplashFlag code={MOCK.teamACode} name={MOCK.teamA} />
        <VS />
        <SplashFlag code={MOCK.teamBCode} name={MOCK.teamB} />
      </div>
      <span className="text-[10px] text-slate-500">הקש על דגל להתזה מחדש 🎨</span>
    </Shell>
  );
}

/* ── 15. Flag Drag Cube ───────────────────────────────────────────────────── */
function CubeFlag({ code, name }) {
  const [rot, setRot] = useState(0);
  return (
    <motion.div
      drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={1}
      onDrag={(_, info) => setRot((r) => r + info.delta.x)}
      animate={{ rotateY: rot }}
      style={{ width: 52, height: 52, cursor: 'grab', transformStyle: 'preserve-3d', position: 'relative' }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: 'rotateY(0deg) translateZ(26px)' }}><TeamFlag logo={code} name={name} className="w-12 h-12" /></div>
      <div style={{ position: 'absolute', inset: 0, transform: 'rotateY(90deg) translateZ(26px)', background: '#0d3b66', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
        <span className="text-white text-[8px] font-bold text-center">{name}</span>
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg) translateZ(26px)', background: '#6b4a05', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-white text-[8px]">⚽</span>
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: 'rotateY(-90deg) translateZ(26px)', background: '#0d3b66', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-white text-[8px] font-bold">VS</span>
      </div>
    </motion.div>
  );
}
function G15() {
  return (
    <Shell style={{ flexDirection: 'column', gap: 10, perspective: 400 }}>
      <div className="flex items-center gap-8" dir="ltr">
        <CubeFlag code={MOCK.teamACode} name={MOCK.teamA} />
        <VS />
        <CubeFlag code={MOCK.teamBCode} name={MOCK.teamB} />
      </div>
      <span className="text-[10px] text-slate-500">גרור דגל שמאלה/ימינה לסובב קובייה 🎲</span>
    </Shell>
  );
}

const DESIGNS = [
  { id: 1, name: 'Flag Cloth Wave', Comp: G1 },
  { id: 2, name: 'Flag Flip Battle', Comp: G2 },
  { id: 3, name: 'Drag-to-Duel', Comp: G3 },
  { id: 4, name: 'Flag Magnifier Peek', Comp: G4 },
  { id: 5, name: 'Flag Deal-In Shuffle', Comp: G5 },
  { id: 6, name: 'Flag Balloon Pop', Comp: G6 },
  { id: 7, name: 'Flag Fabric Unfurl', Comp: G7 },
  { id: 8, name: 'Flag Orbit Swap', Comp: G8 },
  { id: 9, name: 'Flag Tug-of-War', Comp: G9 },
  { id: 10, name: 'Flag Magnet Attract', Comp: G10 },
  { id: 11, name: 'Flag Kaleidoscope Bloom', Comp: G11 },
  { id: 12, name: 'Flag Domino Fall', Comp: G12 },
  { id: 13, name: 'Flag Slot Machine Spin', Comp: G13 },
  { id: 14, name: 'Flag Ink Splash Reveal', Comp: G14 },
  { id: 15, name: 'Flag Drag Cube', Comp: G15 },
];

export default function AdminNextMatchDesigns15D() {
  const [chosen, setChosen] = useState(null);
  return (
    <DesignGrid
      title="15 עיצובים נוספים — מגניבים ואינטראקטיביים, מבוססי דגלים (סבב 4)"
      subtitle="נסה ללחוץ/לגרור/להעביר עכבר על הדגלים בכל כרטיס — כאן הדגל עצמו הוא הכוכב"
      designs={DESIGNS}
      chosen={chosen}
      setChosen={setChosen}
    />
  );
}
