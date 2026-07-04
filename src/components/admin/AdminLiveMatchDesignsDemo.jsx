import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   25 layout/containment concepts for the "live match" intro banner shown on
   app entry. The reported bug: the card has no max-width, so on narrow
   phones its content stretches edge-to-edge instead of staying nicely
   margined. Each idea is tagged with the design "skill" lens it comes from,
   per the ask — a few (see tag "layout") are direct fixes for the bug
   itself; the rest are alternative directions built on a correctly
   contained frame from the start.
   ────────────────────────────────────────────────────────────────────────── */

const M = {
  aFlag: '🇧🇷', a: 'ברזיל', aColor: '#0d9450',
  bFlag: '🇦🇷', b: 'ארגנטינה', bColor: '#5aa9e6',
  scoreA: 2, scoreB: 1, minute: "67'", pred: '2-1',
};

const SKILL_COLORS = {
  distill: '#94a3b8', layout: '#f5c518', adapt: '#2dd4bf', bolder: '#ef4444',
  quieter: '#818cf8', colorize: '#fb923c', typeset: '#e5e7eb', animate: '#4ade80', overdrive: '#d946ef',
};
const SKILL_LABELS = {
  distill: '/distill', layout: '/layout', adapt: '/adapt', bolder: '/bolder',
  quieter: '/quieter', colorize: '/colorize', typeset: '/typeset', animate: '/animate', overdrive: '/overdrive',
};

/* ── shared atoms ─────────────────────────────────────────────────────── */
const LiveDot = ({ small }) => (
  <span className="relative flex" style={{ width: small ? 6 : 9, height: small ? 6 : 9 }}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-full w-full bg-red-500" />
  </span>
);

const PhoneFrame = ({ children, dark = true }) => (
  <div style={{
    width: 168, height: 168, borderRadius: 16, position: 'relative', overflow: 'hidden',
    background: dark ? '#050d1a' : '#0d1a2e',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.4)',
  }}>
    {children}
  </div>
);

/* ── loop wrapper ─────────────────────────────────────────────────────── */
function LoopStage({ interval = 3600, children }) {
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setCycle((c) => c + 1), interval);
    return () => clearInterval(iv);
  }, [interval]);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.div key={cycle} style={{ width: '100%', height: '100%' }}>{children}</motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── 25 previews (each rendered inside a 168×168 "phone" frame) ───────── */

const P1 = () => ( // distill — minimal toast
  <PhoneFrame>
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, padding: '5px 9px' }}>
      <div className="flex items-center gap-1"><LiveDot small /><span style={{ color: '#f87171', fontSize: 7, fontWeight: 900 }}>LIVE</span></div>
      <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }} dir="ltr">{M.aFlag} {M.scoreA}-{M.scoreB} {M.bFlag}</span>
    </motion.div>
  </PhoneFrame>
);

const P2 = () => ( // layout — properly margined, max-width contained card (THE FIX)
  <PhoneFrame>
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      style={{ position: 'absolute', top: '50%', left: 14, right: 14, transform: 'translateY(-50%)', background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 14, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <div className="flex items-center gap-1 justify-center mb-1"><LiveDot small /><span style={{ color: '#f87171', fontSize: 7, fontWeight: 900 }}>LIVE</span></div>
      <div className="flex items-center justify-center gap-2" dir="ltr">
        <span style={{ fontSize: 16 }}>{M.aFlag}</span>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>{M.scoreA}-{M.scoreB}</span>
        <span style={{ fontSize: 16 }}>{M.bFlag}</span>
      </div>
    </motion.div>
    <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 6 }}>14px margin כל צד</div>
  </PhoneFrame>
);

const P3 = () => ( // adapt — bottom sheet on mobile
  <PhoneFrame>
    <motion.div initial={{ y: 60 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(8,18,32,0.97)', borderTop: '1px solid rgba(239,68,68,0.35)', borderRadius: '16px 16px 0 0', padding: '10px 14px 12px' }}>
      <div style={{ width: 28, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)', margin: '0 auto 6px' }} />
      <div className="flex items-center justify-center gap-2" dir="ltr">
        <span style={{ fontSize: 15 }}>{M.aFlag}</span><span style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>{M.scoreA}-{M.scoreB}</span><span style={{ fontSize: 15 }}>{M.bFlag}</span>
        <LiveDot small />
      </div>
    </motion.div>
  </PhoneFrame>
);

const P4 = () => ( // bolder — full-bleed dramatic banner
  <PhoneFrame>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(90deg,#7f1d1d,#450a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <span style={{ fontSize: 20 }}>{M.aFlag}</span>
      <span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }} dir="ltr">{M.scoreA}-{M.scoreB}</span>
      <span style={{ fontSize: 20 }}>{M.bFlag}</span>
    </motion.div>
    <div style={{ position: 'absolute', top: 62, left: 0, right: 0, textAlign: 'center', color: '#f87171', fontSize: 8, fontWeight: 900, letterSpacing: 2 }}>● LIVE</div>
  </PhoneFrame>
);

const P5 = () => ( // quieter — subtle corner chip
  <PhoneFrame>
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
      style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
      <LiveDot small /><span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8 }} dir="ltr">{M.scoreA}-{M.scoreB}</span>
    </motion.div>
  </PhoneFrame>
);

const P6 = () => ( // colorize — team-colored gradient split
  <PhoneFrame>
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
      style={{ position: 'absolute', top: '50%', left: 16, right: 16, transform: 'translateY(-50%)', borderRadius: 14, overflow: 'hidden', display: 'flex', height: 60, boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
      <div style={{ flex: 1, background: `linear-gradient(135deg, ${M.aColor}, ${M.aColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ fontSize: 16 }}>{M.aFlag}</span><span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>{M.scoreA}</span>
      </div>
      <div style={{ flex: 1, background: `linear-gradient(135deg, ${M.bColor}88, ${M.bColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ fontSize: 16 }}>{M.bFlag}</span><span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>{M.scoreB}</span>
      </div>
    </motion.div>
  </PhoneFrame>
);

const P7 = () => ( // typeset — huge score, editorial
  <PhoneFrame>
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#f87171', fontSize: 8, fontWeight: 900, letterSpacing: 2 }}>LIVE · {M.minute}</span>
      <div style={{ color: '#fff', fontWeight: 900, fontSize: 34, lineHeight: 1, fontFamily: 'Georgia, serif' }} dir="ltr">{M.scoreA}–{M.scoreB}</div>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>{M.a} × {M.b}</span>
    </motion.div>
  </PhoneFrame>
);

const P8 = () => ( // animate — slide-in ticker bar
  <PhoneFrame>
    <motion.div initial={{ y: 30 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <LiveDot small /><span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }} dir="ltr">{M.aFlag} {M.scoreA}-{M.scoreB} {M.bFlag}</span>
    </motion.div>
  </PhoneFrame>
);

const P9 = () => ( // overdrive — immersive full takeover with particles
  <PhoneFrame>
    <div style={{ position: 'absolute', inset: 0 }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span key={i} initial={{ y: 170, opacity: 0 }} animate={{ y: -10, opacity: [0, 1, 0] }} transition={{ duration: 2.2, delay: i * 0.15, repeat: Infinity }}
          style={{ position: 'absolute', left: `${(i * 37) % 100}%`, width: 3, height: 3, borderRadius: '50%', background: '#d946ef' }} />
      ))}
    </div>
    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#d946ef', fontSize: 8, fontWeight: 900, letterSpacing: 3 }}>LIVE NOW</span>
      <div style={{ color: '#fff', fontWeight: 900, fontSize: 24 }} dir="ltr">{M.scoreA}-{M.scoreB}</div>
    </motion.div>
  </PhoneFrame>
);

const P10 = () => ( // distill — circular score orb
  <PhoneFrame>
    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 74, height: 74, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }} dir="ltr">{M.scoreA}-{M.scoreB}</span>
      <span style={{ color: '#f87171', fontSize: 6, fontWeight: 900 }}>LIVE</span>
    </motion.div>
  </PhoneFrame>
);

const P11 = () => ( // layout — inline banner under header (not an overlay/modal)
  <PhoneFrame>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 22, background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }} />
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 34 }} transition={{ duration: 0.35 }}
      style={{ position: 'absolute', top: 22, left: 0, right: 0, overflow: 'hidden', background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <LiveDot small /><span style={{ color: '#fff', fontSize: 9, fontWeight: 800 }} dir="ltr">{M.aFlag} {M.scoreA}-{M.scoreB} {M.bFlag}</span>
    </motion.div>
    <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 6 }}>דוחף את התוכן, לא overlay</div>
  </PhoneFrame>
);

const P12 = () => ( // distill — compact pill that expands
  <PhoneFrame>
    <motion.div initial={{ width: 30, height: 30 }} animate={{ width: 120, height: 40 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, overflow: 'hidden' }}>
      <LiveDot small /><span style={{ color: '#fff', fontSize: 9, fontWeight: 800, whiteSpace: 'nowrap' }} dir="ltr">{M.scoreA}-{M.scoreB}</span>
    </motion.div>
  </PhoneFrame>
);

const P13 = () => ( // colorize — split-screen halves full height
  <PhoneFrame>
    <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      style={{ position: 'absolute', inset: 0, width: '50%', background: `linear-gradient(160deg, ${M.aColor}, #030d1a)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 20 }}>{M.aFlag}</span><span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>{M.scoreA}</span>
    </motion.div>
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '50%', background: `linear-gradient(200deg, ${M.bColor}, #030d1a)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 20 }}>{M.bFlag}</span><span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>{M.scoreB}</span>
    </motion.div>
  </PhoneFrame>
);

const P14 = () => ( // adapt — draggable PIP corner widget
  <PhoneFrame>
    <motion.div drag dragConstraints={{ top: 0, left: 0, right: 90, bottom: 90 }}
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
      style={{ position: 'absolute', top: 12, right: 12, width: 64, height: 46, borderRadius: 10, background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(239,68,68,0.4)', cursor: 'grab', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#fff', fontWeight: 900, fontSize: 11 }} dir="ltr">{M.scoreA}-{M.scoreB}</span>
      <LiveDot small />
    </motion.div>
    <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 6 }}>ניתן לגרור</div>
  </PhoneFrame>
);

const P15 = () => ( // bolder — stadium scoreboard replica
  <PhoneFrame>
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      style={{ position: 'absolute', top: '50%', left: 14, right: 14, transform: 'translateY(-50%)', background: '#000', border: '3px solid #FFD700', borderRadius: 6, padding: '8px 10px', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFD700', fontSize: 8, fontWeight: 900 }}>
        <span>{M.a.toUpperCase()}</span><span>{M.b.toUpperCase()}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, color: '#4ade80', fontSize: 22, fontWeight: 900 }}>
        <span>{M.scoreA}</span><span style={{ color: '#FFD700' }}>-</span><span>{M.scoreB}</span>
      </div>
    </motion.div>
  </PhoneFrame>
);

const P16 = () => ( // quieter — side drawer notification
  <PhoneFrame>
    <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      style={{ position: 'absolute', top: 30, right: 0, width: 90, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px 0 0 10px', padding: '8px 10px', textAlign: 'center' }}>
      <LiveDot small /><div style={{ color: '#fff', fontSize: 9, fontWeight: 800, marginTop: 3 }} dir="ltr">{M.scoreA}-{M.scoreB}</div>
    </motion.div>
  </PhoneFrame>
);

const P17 = () => ( // layout — constrained centered card with safe max-width (THE FIX, v2)
  <PhoneFrame>
    <div style={{ position: 'absolute', inset: 0, border: '1px dashed rgba(255,255,255,0.15)', margin: 10, borderRadius: 12, pointerEvents: 'none' }} />
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '78%', maxWidth: 130, background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 14, padding: '10px 8px', textAlign: 'center' }}>
      <span style={{ color: '#f87171', fontSize: 7, fontWeight: 900 }}>● LIVE</span>
      <div style={{ color: '#fff', fontWeight: 900, fontSize: 14, marginTop: 2 }} dir="ltr">{M.aFlag} {M.scoreA}-{M.scoreB} {M.bFlag}</div>
    </motion.div>
  </PhoneFrame>
);

const P18 = () => ( // typeset — newspaper flash
  <PhoneFrame>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      style={{ position: 'absolute', top: '50%', left: 12, right: 12, transform: 'translateY(-50%)', background: '#efe6d0', color: '#1a1a1a', borderRadius: 4, padding: '8px 10px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 10, borderBottom: '2px solid #1a1a1a', paddingBottom: 3 }}>מבזק חי</div>
      <div style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 13, marginTop: 4 }} dir="ltr">{M.a} {M.scoreA}-{M.scoreB} {M.b}</div>
    </motion.div>
  </PhoneFrame>
);

const P19 = () => ( // animate — scrolling news ticker
  <PhoneFrame>
    <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, height: 20, background: '#7f1d1d', overflow: 'hidden' }}>
      <motion.div initial={{ x: 168 }} animate={{ x: -260 }} transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
        style={{ position: 'absolute', whiteSpace: 'nowrap', color: '#fff', fontSize: 9, fontWeight: 800, top: 4 }} dir="ltr">
        ● LIVE — {M.a} {M.scoreA}-{M.scoreB} {M.b} · {M.minute}
      </motion.div>
    </div>
  </PhoneFrame>
);

const P20 = () => ( // animate — card flip reveal
  <PhoneFrame>
    <div style={{ position: 'absolute', top: '50%', left: 20, right: 20, transform: 'translateY(-50%)', perspective: 400 }}>
      <motion.div initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} transition={{ duration: 0.6 }}
        style={{ background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, padding: '10px', textAlign: 'center' }}>
        <span style={{ color: '#f87171', fontSize: 7, fontWeight: 900 }}>● LIVE</span>
        <div style={{ color: '#fff', fontWeight: 900, fontSize: 15 }} dir="ltr">{M.scoreA}-{M.scoreB}</div>
      </motion.div>
    </div>
  </PhoneFrame>
);

const P21 = () => ( // layout — bento cells
  <PhoneFrame>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      style={{ position: 'absolute', top: '50%', left: 14, right: 14, transform: 'translateY(-50%)', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 5 }}>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 4px', textAlign: 'center' }}><div style={{ fontSize: 15 }}>{M.aFlag}</div></div>
      <div style={{ background: 'rgba(239,68,68,0.12)', borderRadius: 8, padding: '8px 6px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 13 }} dir="ltr">{M.scoreA}-{M.scoreB}</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 4px', textAlign: 'center' }}><div style={{ fontSize: 15 }}>{M.bFlag}</div></div>
    </motion.div>
  </PhoneFrame>
);

const P22 = () => ( // layout — full-width edge-to-edge BUT with correct internal padding (fix v3)
  <PhoneFrame>
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.3)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <LiveDot small />
      <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }} dir="ltr">{M.aFlag} {M.scoreA}-{M.scoreB} {M.bFlag}</span>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{M.minute}</span>
    </motion.div>
    <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 6 }}>רוחב מלא, אבל padding פנימי נכון</div>
  </PhoneFrame>
);

const P23 = () => ( // quieter — text-only status line, no card at all
  <PhoneFrame>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      style={{ position: 'absolute', top: 14, left: 0, right: 0, textAlign: 'center' }}>
      <span style={{ color: '#f87171', fontSize: 9 }}>● </span>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9 }} dir="ltr">{M.a} {M.scoreA}-{M.scoreB} {M.b}</span>
    </motion.div>
  </PhoneFrame>
);

const P24 = () => ( // adapt — stacked toasts for multiple matches
  <PhoneFrame>
    {[0, 1].map((i) => (
      <motion.div key={i} initial={{ opacity: 0, y: -10 - i * 6 }} animate={{ opacity: 1, y: 10 + i * 40 }} transition={{ delay: i * 0.15, duration: 0.35 }}
        style={{ position: 'absolute', left: 14, right: 14, background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 10, padding: '6px 10px', opacity: 1 - i * 0.35 }}>
        <span style={{ color: '#fff', fontSize: 9, fontWeight: 800 }} dir="ltr">{i === 0 ? `${M.aFlag} ${M.scoreA}-${M.scoreB} ${M.bFlag}` : '🇺🇸 0-0 🇲🇽'}</span>
      </motion.div>
    ))}
  </PhoneFrame>
);

const P25 = () => ( // overdrive — countdown-ring morphing into score
  <PhoneFrame>
    <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      <svg width="78" height="78" viewBox="0 0 78 78">
        <circle cx="39" cy="39" r="34" stroke="rgba(239,68,68,0.2)" strokeWidth="4" fill="none" />
        <motion.circle cx="39" cy="39" r="34" stroke="#ef4444" strokeWidth="4" fill="none" strokeDasharray="214"
          initial={{ strokeDashoffset: 214 }} animate={{ strokeDashoffset: 60 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
        <text x="39" y="36" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900" dir="ltr">{M.scoreA}-{M.scoreB}</text>
        <text x="39" y="50" textAnchor="middle" fill="#f87171" fontSize="7" fontWeight="900">LIVE</text>
      </svg>
    </motion.div>
  </PhoneFrame>
);

/* ── data ─────────────────────────────────────────────────────────────── */
const DESIGNS = [
  { id: 1, skill: 'distill', name: 'טוסט מינימלי עליון', desc: 'שורה דקה עם הדגלים והתוצאה בלבד — כמעט ולא תופס מקום.', Preview: P1 },
  { id: 2, skill: 'layout', name: 'כרטיס ממורכז עם שוליים', desc: 'התיקון הישיר לבאג: 14px מרווח קבוע מכל צד, לא נוגע בקצוות המסך.', Preview: P2 },
  { id: 3, skill: 'adapt', name: 'גיליון תחתון (Bottom Sheet)', desc: 'עולה מלמטה כמו רכיב מובייל טבעי, נשאר צר וברור.', Preview: P3 },
  { id: 4, skill: 'bolder', name: 'באנר דרמטי מלא-רוחב', desc: 'רוחב מלא בכוונה — סטרייפ אדום עוצמתי בסגנון גרפיקת שידור.', Preview: P4 },
  { id: 5, skill: 'quieter', name: 'צ׳יפ פינתי עדין', desc: 'מופיע בפינה בלי להפריע, כמעט שקוף.', Preview: P5 },
  { id: 6, skill: 'colorize', name: 'גרדיאנט צבעי נבחרות', desc: 'הכרטיס מחולק לשני צבעי הנבחרות עצמן, לא רק אדום גנרי.', Preview: P6 },
  { id: 7, skill: 'typeset', name: 'טיפוגרפיה עורכת', desc: 'התוצאה בגופן סריף ענק, כמעט בלי מסגרת — הטקסט הוא הגיבור.', Preview: P7 },
  { id: 8, skill: 'animate', name: 'רצועת טיקר מחליקה', desc: 'נכנסת מלמטה כפילה צרה, לא חוסמת את המסך.', Preview: P8 },
  { id: 9, skill: 'overdrive', name: 'השתלטות אימרסיבית', desc: 'מסך מלא עם חלקיקים — לרגעים הכי דרמטיים בלבד.', Preview: P9 },
  { id: 10, skill: 'distill', name: 'כדור תוצאה עגול', desc: 'עיגול קומפקטי אחד עם התוצאה, בלי שום דבר נוסף.', Preview: P10 },
  { id: 11, skill: 'layout', name: 'רצועה קבועה מתחת לכותרת', desc: 'לא overlay בכלל — דוחפת את התוכן מתחתיה, אף פעם לא "נמתחת".', Preview: P11 },
  { id: 12, skill: 'distill', name: 'פיל מתרחב', desc: 'מתחיל כעיגול קטן ומתרחב לתצוגה מלאה — קומפקטי כברירת מחדל.', Preview: P12 },
  { id: 13, skill: 'colorize', name: 'מסך מפוצל לשני צבעים', desc: 'כל חצי מסך בצבע נבחרת אחרת עד למרכז — דרמטי וברור.', Preview: P13 },
  { id: 14, skill: 'adapt', name: 'ווידג\'ט פינתי נגרר (PIP)', desc: 'ניתן לגרירה כמו תמונה-בתוך-תמונה, המשתמש שולט במיקום.', Preview: P14 },
  { id: 15, skill: 'bolder', name: 'לוח תוצאות אצטדיון', desc: 'חיקוי מלא של לוח תוצאות פיזי — LED ירוק, מסגרת זהב.', Preview: P15 },
  { id: 16, skill: 'quieter', name: 'מגירת צד', desc: 'נכנסת מהצד ונשארת דבוקה לקצה, לא במרכז השדה.', Preview: P16 },
  { id: 17, skill: 'layout', name: 'כרטיס עם max-width קשיח', desc: 'תיקון שני: רוחב מוגבל ל-130px גם במסכים הכי צרים.', Preview: P17 },
  { id: 18, skill: 'typeset', name: 'מבזק עיתון', desc: 'רקע נייר ישן וגופן סריף — מרגיש כמו כותרת דחופה.', Preview: P18 },
  { id: 19, skill: 'animate', name: 'טיקר חדשות רץ', desc: 'שורת טקסט שזזה לרוחב ברצף, כמו ערוץ חדשות.', Preview: P19 },
  { id: 20, skill: 'animate', name: 'היפוך קלף', desc: 'הכרטיס מסתובב על ציר Y ונכנס בפעם אחת חדה.', Preview: P20 },
  { id: 21, skill: 'layout', name: 'תאי בנטו', desc: 'שלושה תאים ברורים: דגל | תוצאה | דגל — מבנה גריד נקי.', Preview: P21 },
  { id: 22, skill: 'layout', name: 'רוחב מלא עם padding נכון', desc: 'תיקון שלישי: נשאר edge-to-edge בכוונה, אבל עם ריפוד פנימי שמונע דחיסות.', Preview: P22 },
  { id: 23, skill: 'quieter', name: 'שורת סטטוס טקסט בלבד', desc: 'בלי כרטיס בכלל — רק טקסט ונקודה אדומה. הכי לא פולשני שיש.', Preview: P23 },
  { id: 24, skill: 'adapt', name: 'ערימת התראות', desc: 'כשיש כמה משחקים חיים במקביל, כל אחד מקבל טוסט משלו במחסנית.', Preview: P24 },
  { id: 25, skill: 'overdrive', name: 'טבעת שמתמזגת לתוצאה', desc: 'טבעת התקדמות נטענת ואז הופכת להיות מסגרת התוצאה.', Preview: P25 },
];

const SKILLS = ['הכול', 'distill', 'layout', 'adapt', 'bolder', 'quieter', 'colorize', 'typeset', 'animate', 'overdrive'];

/* ── Card ─────────────────────────────────────────────────────────────── */
function DesignCard({ d, isSelected, onSelect }) {
  const { Preview } = d;
  const accent = SKILL_COLORS[d.skill];
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      style={{
        borderRadius: 14, overflow: 'hidden',
        border: isSelected ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
        boxShadow: isSelected ? `0 0 24px ${accent}55` : '0 4px 20px rgba(0,0,0,0.5)',
        transition: 'border-color .2s, box-shadow .2s',
      }}
    >
      <div style={{ height: 200, position: 'relative', background: 'linear-gradient(160deg,#050d1a,#0d1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <LoopStage><Preview /></LoopStage>
        {isSelected && (
          <div style={{ position: 'absolute', top: 10, left: 10, width: 22, height: 22, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <span style={{ color: '#000', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 999, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>{d.id}</div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{d.name}</span>
          <span style={{ color: accent, fontSize: 9, fontFamily: 'monospace' }}>{SKILL_LABELS[d.skill]}</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10.5, marginTop: 4, lineHeight: 1.5 }}>{d.desc}</div>
      </div>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function AdminLiveMatchDesignsDemo() {
  const [selected, setSelected] = useState(null);
  const [skill, setSkill] = useState('הכול');

  const visible = skill === 'הכול' ? DESIGNS : DESIGNS.filter((d) => d.skill === skill);
  const selectedDesign = DESIGNS.find((d) => d.id === selected);

  return (
    <div dir="rtl" style={{ color: '#fff', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>25 עיצובים — באנר משחק חי</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            {selectedDesign ? `✓ נבחר: ${selectedDesign.name} (${SKILL_LABELS[selectedDesign.skill]})` : 'הבאג: הכרטיס נמתח לקצוות במסכים צרים · #2, #11, #17, #21, #22 הן תיקונים ישירים לבעיית ההכלה'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {SKILLS.map((s) => {
          const count = s === 'הכול' ? DESIGNS.length : DESIGNS.filter((d) => d.skill === s).length;
          const active = skill === s;
          const c = SKILL_COLORS[s] || '#FFD700';
          return (
            <button
              key={s}
              onClick={() => setSkill(s)}
              style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${active ? c : 'rgba(255,255,255,0.18)'}`, background: active ? c : 'rgba(255,255,255,0.06)', color: active ? '#000' : '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}
            >
              {s === 'הכול' ? s : SKILL_LABELS[s]} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
        {visible.map((d) => (
          <DesignCard key={d.id} d={d} isSelected={selected === d.id} onSelect={() => setSelected(selected === d.id ? null : d.id)} />
        ))}
      </div>
    </div>
  );
}
