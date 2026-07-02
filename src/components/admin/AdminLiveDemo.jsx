import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

const MOCK = {
  homeTla: 'BRA', awayTla: 'ARG',
  homeScore: 1, awayScore: 1,
  prevHome: 0, prevAway: 0,
  prediction: '0 - 2',
};

// ─── Score sub-components ──────────────────────────────────────────────

function StaticScore({ home, away, color = '#fff' }) {
  return (
    <span style={{ color, fontSize: 52, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>
      {home}<span style={{ color: '#475569', margin: '0 10px' }}>-</span>{away}
    </span>
  );
}

function CountUpScore({ home, away }) {
  const [h, setH] = useState(0);
  const [a, setA] = useState(0);
  useEffect(() => {
    let step = 0;
    const max = Math.max(home, away);
    const iv = setInterval(() => {
      step++;
      setH(Math.min(step, home));
      setA(Math.min(step, away));
      if (step >= max) clearInterval(iv);
    }, 500);
    return () => clearInterval(iv);
  }, []);
  return (
    <span style={{ color: '#fff', fontSize: 52, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>
      {h}<span style={{ color: '#475569', margin: '0 10px' }}>-</span>{a}
    </span>
  );
}

function SlotDigit({ value, delay = 0 }) {
  const [display, setDisplay] = useState(0);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        setDisplay(i % 10);
        i++;
        if (i > 12 + value) { setDisplay(value); setSettled(true); clearInterval(iv); }
      }, 60);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <span style={{ color: settled ? '#fbbf24' : '#94a3b8', fontSize: 52, fontWeight: 900, display: 'inline-block', minWidth: 36, textAlign: 'center', transition: 'color 0.3s' }}>
      {display}
    </span>
  );
}

function SlotScore({ home, away }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <SlotDigit value={home} delay={400} />
      <span style={{ color: '#475569', fontSize: 52, fontWeight: 900, margin: '0 8px' }}>-</span>
      <SlotDigit value={away} delay={700} />
    </span>
  );
}

function TypewriterScore({ home, away }) {
  const full = `${home} - ${away}`;
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setShown(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(iv);
    }, 120);
    return () => clearInterval(iv);
  }, []);
  return (
    <span style={{ color: '#fff', fontSize: 52, fontWeight: 900, letterSpacing: -2, fontFamily: 'monospace', lineHeight: 1 }}>
      {shown}<span style={{ opacity: 0.5 }}>_</span>
    </span>
  );
}

function StaggerScore({ home, away }) {
  const parts = [String(home), ' - ', String(away)];
  return (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      {parts.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.35, type: 'spring', stiffness: 300 }}
          style={{ color: i === 1 ? '#475569' : '#fff', fontSize: 52, fontWeight: 900, lineHeight: 1 }}
        >{p}</motion.span>
      ))}
    </span>
  );
}

function BlurScore({ home, away }) {
  return (
    <motion.span
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.4 }}
      style={{ color: '#fff', fontSize: 52, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}
    >
      {home}<span style={{ color: '#475569', margin: '0 10px' }}>-</span>{away}
    </motion.span>
  );
}

function CountdownScore({ home, away }) {
  const [phase, setPhase] = useState('count');
  const [count, setCount] = useState(3);
  useEffect(() => {
    const iv = setInterval(() => {
      setCount(p => {
        if (p <= 1) { clearInterval(iv); setPhase('score'); return 0; }
        return p - 1;
      });
    }, 700);
    return () => clearInterval(iv);
  }, []);
  if (phase === 'count') return (
    <motion.span
      key={count}
      initial={{ scale: 2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      style={{ color: '#ef4444', fontSize: 80, fontWeight: 900, lineHeight: 1 }}
    >{count}</motion.span>
  );
  return (
    <motion.span
      initial={{ scale: 0.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      style={{ color: '#fff', fontSize: 52, fontWeight: 900, letterSpacing: -2 }}
    >
      {home}<span style={{ color: '#475569', margin: '0 10px' }}>-</span>{away}
    </motion.span>
  );
}

function GlitchScore({ home, away }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => { setGlitch(p => !p); }, 200);
    setTimeout(() => clearInterval(iv), 2000);
    return () => clearInterval(iv);
  }, []);
  return (
    <span style={{
      color: '#22d3ee', fontSize: 52, fontWeight: 900, letterSpacing: -2, lineHeight: 1,
      textShadow: glitch ? '3px 0 #ef4444, -3px 0 #22d3ee' : '0 0 20px #22d3ee',
      transform: glitch ? 'skewX(-3deg)' : 'none', display: 'inline-block', transition: 'all 0.05s',
    }}>
      {home}<span style={{ color: '#475569', margin: '0 10px' }}>-</span>{away}
    </span>
  );
}

function PulseScore({ home, away, color = '#fff' }) {
  return (
    <motion.span
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{ color, fontSize: 52, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}
    >
      {home}<span style={{ color: '#475569', margin: '0 10px' }}>-</span>{away}
    </motion.span>
  );
}

function FlickerScore({ home, away }) {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    let times = [100, 180, 80, 300, 60, 500];
    let i = 0;
    const tick = () => {
      if (i >= times.length) return;
      setTimeout(() => { setVis(p => !p); i++; tick(); }, times[i]);
    };
    tick();
  }, []);
  return (
    <span style={{ color: '#fbbf24', fontSize: 52, fontWeight: 900, letterSpacing: -2, opacity: vis ? 1 : 0, transition: 'opacity 0.05s' }}>
      {home}<span style={{ color: '#475569', margin: '0 10px' }}>-</span>{away}
    </span>
  );
}

// ─── Stagger factory ────────────────────────────────────────────────────

function makeStagger(getInit, getAnim, getTrans, colors = ['#fff', '#475569', '#fff']) {
  return function({ home, away }) {
    const parts = [String(home), '-', String(away)];
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 52, fontWeight: 900 }}>
        {parts.map((p, i) => (
          <motion.span key={i} initial={getInit(i)} animate={getAnim(i)} transition={getTrans(i)}
            style={{ color: colors[i], display: 'inline-block' }}>{p}</motion.span>
        ))}
      </span>
    );
  };
}

const SRise      = makeStagger(()=>({y:60,opacity:0}), ()=>({y:0,opacity:1}), i=>({type:'spring',stiffness:280,damping:18,delay:i*0.28}));
const SLeft      = makeStagger(()=>({x:-80,opacity:0}), ()=>({x:0,opacity:1}), i=>({duration:0.45,ease:[0.22,1,0.36,1],delay:i*0.22}));
const SRight     = makeStagger(()=>({x:80,opacity:0}), ()=>({x:0,opacity:1}), i=>({duration:0.45,ease:[0.22,1,0.36,1],delay:i*0.22}));
const SPing      = makeStagger(()=>({scale:2.5,opacity:0}), ()=>({scale:1,opacity:1}), i=>({type:'spring',stiffness:400,damping:14,delay:i*0.25}));
const SRotateCW  = makeStagger(()=>({rotate:90,opacity:0}), ()=>({rotate:0,opacity:1}), i=>({type:'spring',stiffness:260,damping:18,delay:i*0.3}));
const SRotateCCW = makeStagger(()=>({rotate:-90,opacity:0}), ()=>({rotate:0,opacity:1}), i=>({type:'spring',stiffness:260,damping:18,delay:i*0.3}));
const SBlurEach  = makeStagger(()=>({filter:'blur(14px)',opacity:0}), ()=>({filter:'blur(0px)',opacity:1}), i=>({duration:0.55,delay:i*0.28}));
const SElastic   = makeStagger(()=>({scale:0,opacity:0}), ()=>({scale:[0,1.5,0.85,1.1,1],opacity:1}), i=>({duration:0.7,delay:i*0.2}));
const SWave      = makeStagger((i)=>({y: i===1?0:40, opacity:0}), (i)=>({y:0,opacity:1}), i=>({type:'spring',stiffness:300,damping:16,delay:0.1+i*0.18}));
const SFlipX     = makeStagger(()=>({rotateX:90,opacity:0}), ()=>({rotateX:0,opacity:1}), i=>({duration:0.5,ease:'easeOut',delay:i*0.28}));
const SFlipY     = makeStagger(()=>({rotateY:90,opacity:0}), ()=>({rotateY:0,opacity:1}), i=>({duration:0.5,ease:'easeOut',delay:i*0.28}));
const SSpin      = makeStagger(()=>({rotate:360,scale:0,opacity:0}), ()=>({rotate:0,scale:1,opacity:1}), i=>({type:'spring',stiffness:220,damping:16,delay:i*0.3}));
const SZoom      = makeStagger(()=>({scale:5,opacity:0}), ()=>({scale:1,opacity:1}), i=>({duration:0.55,ease:'easeOut',delay:i*0.25}));
const SSkew      = makeStagger(()=>({skewX:40,x:-30,opacity:0}), ()=>({skewX:0,x:0,opacity:1}), i=>({duration:0.4,ease:[0.22,1,0.36,1],delay:i*0.22}));
const SGravity   = makeStagger(()=>({y:-120,opacity:0}), ()=>({y:0,opacity:1}), i=>({duration:0.5,ease:'easeIn',delay:i*0.2}));
const SAntiGrav  = makeStagger(()=>({y:120,opacity:0}), ()=>({y:0,opacity:1}), i=>({duration:0.5,ease:'easeOut',delay:i*0.2}));
const SReverse   = makeStagger(()=>({y:-30,opacity:0}), ()=>({y:0,opacity:1}), i=>({type:'spring',stiffness:300,damping:18,delay:(2-i)*0.28}));
const SOutsideIn = makeStagger(i=>({y:i===1?0:-30,opacity:i===1?1:0,scale:i===1?1:0.5}), ()=>({y:0,opacity:1,scale:1}), i=>({type:'spring',stiffness:300,damping:18,delay:i===1?0.55:0.1}));
const SInsideOut = makeStagger(i=>({y:i===1?-30:0,opacity:i===1?0:0,scale:0.5}), ()=>({y:0,opacity:1,scale:1}), i=>({type:'spring',stiffness:300,damping:18,delay:i===1?0.05:0.4}));
const SRubber    = makeStagger(()=>({scale:0}), ()=>({scale:[0,1.6,0.75,1.2,0.92,1]}), i=>({duration:0.85,delay:i*0.22}));
const SStrobe    = makeStagger(()=>({opacity:0}), ()=>({opacity:[0,1,0,1,0,1,1]}), i=>({duration:0.7,delay:i*0.25}));
const SDepth     = makeStagger(()=>({z:-300,scale:0.1,opacity:0}), ()=>({z:0,scale:1,opacity:1}), i=>({type:'spring',stiffness:200,damping:18,delay:i*0.28}));
const SSwing     = makeStagger(()=>({rotate:-70,opacity:0,originY:0}), ()=>({rotate:0,opacity:1}), i=>({type:'spring',stiffness:180,damping:12,delay:i*0.3}));
const SMelt      = makeStagger(()=>({y:-25,scale:0.8,opacity:0}), ()=>({y:0,scale:1,opacity:1}), i=>({duration:0.9,ease:[0.16,1,0.3,1],delay:i*0.35}));
const SColorFlash= makeStagger(()=>({scale:0,opacity:0,color:'#ef4444'}), ()=>({scale:1,opacity:1,color:'#ffffff'}), i=>({duration:0.6,delay:i*0.25}), ['#fbbf24','#475569','#fbbf24']);

// ─── Score type router ──────────────────────────────────────────────────

function ScoreDisplay({ type }) {
  const { homeScore: h, awayScore: a } = MOCK;
  switch (type) {
    case 'countup':    return <CountUpScore home={h} away={a} />;
    case 'slot':       return <SlotScore home={h} away={a} />;
    case 'typewriter': return <TypewriterScore home={h} away={a} />;
    case 'stagger':    return <StaggerScore home={h} away={a} />;
    case 'blur':       return <BlurScore home={h} away={a} />;
    case 'countdown':  return <CountdownScore home={h} away={a} />;
    case 'glitch':     return <GlitchScore home={h} away={a} />;
    case 'pulse-red':  return <PulseScore home={h} away={a} color="#ef4444" />;
    case 'pulse-gold': return <PulseScore home={h} away={a} color="#fbbf24" />;
    case 'flicker':    return <FlickerScore home={h} away={a} />;
    case 'neon-green': return <StaticScore home={h} away={a} color="#4ade80" />;
    case 'neon-cyan':  return <StaticScore home={h} away={a} color="#22d3ee" />;
    case 'white':
    default:           return <StaticScore home={h} away={a} />;
    case 's-rise':      return <SRise home={h} away={a} />;
    case 's-left':      return <SLeft home={h} away={a} />;
    case 's-right':     return <SRight home={h} away={a} />;
    case 's-ping':      return <SPing home={h} away={a} />;
    case 's-cw':        return <SRotateCW home={h} away={a} />;
    case 's-ccw':       return <SRotateCCW home={h} away={a} />;
    case 's-blur-each': return <SBlurEach home={h} away={a} />;
    case 's-elastic':   return <SElastic home={h} away={a} />;
    case 's-wave':      return <SWave home={h} away={a} />;
    case 's-flipx':     return <SFlipX home={h} away={a} />;
    case 's-flipy':     return <SFlipY home={h} away={a} />;
    case 's-spin':      return <SSpin home={h} away={a} />;
    case 's-zoom':      return <SZoom home={h} away={a} />;
    case 's-skew':      return <SSkew home={h} away={a} />;
    case 's-gravity':   return <SGravity home={h} away={a} />;
    case 's-anti':      return <SAntiGrav home={h} away={a} />;
    case 's-reverse':   return <SReverse home={h} away={a} />;
    case 's-outside':   return <SOutsideIn home={h} away={a} />;
    case 's-inside':    return <SInsideOut home={h} away={a} />;
    case 's-rubber':    return <SRubber home={h} away={a} />;
    case 's-strobe':    return <SStrobe home={h} away={a} />;
    case 's-depth':     return <SDepth home={h} away={a} />;
    case 's-swing':     return <SSwing home={h} away={a} />;
    case 's-melt':      return <SMelt home={h} away={a} />;
    case 's-color':     return <SColorFlash home={h} away={a} />;
  }
}

// ─── 25 styles ──────────────────────────────────────────────────────────

const STYLES = [
  // === ENTRANCE ===
  {
    id: 1, name: 'Elastic Spring', category: 'כניסה',
    desc: 'קפיץ אלסטי עם bounce טבעי',
    scoreType: 'white',
    card: { background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(239,68,68,0.5)', boxShadow: '0 0 60px rgba(239,68,68,0.18)' },
    entry: { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring', stiffness: 300, damping: 12 } },
    overlay: 'rgba(0,0,0,0.75)',
  },
  {
    id: 2, name: 'Drop & Bounce', category: 'כניסה',
    desc: 'נופל מלמעלה עם קפיצה',
    scoreType: 'white',
    card: { background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(245,197,24,0.5)', boxShadow: '0 0 60px rgba(245,197,24,0.15)' },
    entry: { initial: { y: -300, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { type: 'spring', stiffness: 200, damping: 15 } },
    overlay: 'rgba(0,0,0,0.8)',
  },
  {
    id: 3, name: 'Slide Up', category: 'כניסה',
    desc: 'עולה חלק מלמטה',
    scoreType: 'white',
    card: { background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(99,102,241,0.5)', boxShadow: '0 0 60px rgba(99,102,241,0.2)' },
    entry: { initial: { y: 200, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    overlay: 'rgba(0,0,0,0.75)',
  },
  {
    id: 4, name: 'Zoom In', category: 'כניסה',
    desc: 'מתקרב ממרחוק למרכז',
    scoreType: 'white',
    card: { background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(239,68,68,0.4)', boxShadow: '0 0 80px rgba(239,68,68,0.25)' },
    entry: { initial: { scale: 4, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.7, ease: 'easeOut' } },
    overlay: 'rgba(0,0,0,0.85)',
  },
  {
    id: 5, name: 'Flip In', category: 'כניסה',
    desc: 'קפיצת 3D מהצד',
    scoreType: 'white',
    card: { background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(168,85,247,0.5)', boxShadow: '0 0 60px rgba(168,85,247,0.2)' },
    entry: { initial: { rotateY: 90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 }, transition: { duration: 0.6, ease: 'easeOut' } },
    overlay: 'rgba(0,0,0,0.8)',
  },
  {
    id: 6, name: 'Scale Fade', category: 'כניסה',
    desc: 'fade עם קנה מידה',
    scoreType: 'blur',
    card: { background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 80px rgba(0,0,0,0.6)' },
    entry: { initial: { scale: 0.6, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    overlay: 'rgba(0,0,0,0.7)',
  },
  {
    id: 7, name: 'Shake & Land', category: 'כניסה',
    desc: 'כניסה עם רעידה דרמטית',
    scoreType: 'pulse-red',
    card: { background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(239,68,68,0.6)', boxShadow: '0 0 80px rgba(239,68,68,0.3)' },
    entry: { initial: { scale: 0, rotate: -10 }, animate: { scale: [0, 1.15, 0.95, 1.05, 1], rotate: [- 10, 5, -3, 1, 0] }, transition: { duration: 0.8 } },
    overlay: 'rgba(0,0,0,0.8)',
  },
  // === SCORE ANIMATION ===
  {
    id: 8, name: 'Slot Machine', category: 'מספרים',
    desc: 'ספרות מתגלגלות כמו פרוטומט',
    scoreType: 'slot',
    card: { background: 'rgba(8,18,32,0.97)', border: '1px solid rgba(251,191,36,0.6)', boxShadow: '0 0 60px rgba(251,191,36,0.2)' },
    entry: { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.4 } },
    overlay: 'rgba(0,0,0,0.85)',
  },
  {
    id: 9, name: 'Count Up', category: 'מספרים',
    desc: 'מתחיל 0-0 וסופר עד התוצאה',
    scoreType: 'countup',
    card: { background: 'rgba(8,18,32,0.97)', border: '1px solid rgba(34,211,238,0.5)', boxShadow: '0 0 60px rgba(34,211,238,0.15)' },
    entry: { initial: { y: 40, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.5 } },
    overlay: 'rgba(0,0,0,0.8)',
  },
  {
    id: 10, name: 'Typewriter', category: 'מספרים',
    desc: 'הספרות מוקלדות תו אחר תו',
    scoreType: 'typewriter',
    card: { background: '#0a0a0a', border: '1px solid rgba(74,222,128,0.5)', boxShadow: '0 0 40px rgba(74,222,128,0.15)' },
    entry: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } },
    overlay: 'rgba(0,0,0,0.9)',
  },
  {
    id: 11, name: 'Stagger Digits', category: 'מספרים',
    desc: 'כל ספרה נופלת בנפרד',
    scoreType: 'stagger',
    card: { background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(168,85,247,0.4)', boxShadow: '0 0 50px rgba(168,85,247,0.15)' },
    entry: { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.4 } },
    overlay: 'rgba(0,0,0,0.8)',
  },
  {
    id: 12, name: 'Blur Reveal', category: 'מספרים',
    desc: 'מתגלה מטשטוש לחד',
    scoreType: 'blur',
    card: { background: 'rgba(8,18,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' },
    entry: { initial: { scale: 1, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.3 } },
    overlay: 'rgba(0,0,0,0.75)',
  },
  {
    id: 13, name: 'Countdown', category: 'מספרים',
    desc: '3-2-1 ואז התוצאה',
    scoreType: 'countdown',
    card: { background: 'rgba(8,18,32,0.97)', border: '1px solid rgba(239,68,68,0.5)', boxShadow: '0 0 60px rgba(239,68,68,0.2)' },
    entry: { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.3 } },
    overlay: 'rgba(0,0,0,0.88)',
  },
  {
    id: 14, name: 'Flicker On', category: 'מספרים',
    desc: 'מהבהב כמו נורת ניאון',
    scoreType: 'flicker',
    card: { background: '#050505', border: '1px solid rgba(251,191,36,0.6)', boxShadow: '0 0 60px rgba(251,191,36,0.2), inset 0 0 30px rgba(251,191,36,0.05)' },
    entry: { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.2 } },
    overlay: 'rgba(0,0,0,0.92)',
  },
  // === VISUAL THEMES ===
  {
    id: 15, name: 'Neon Glow', category: 'עיצוב',
    desc: 'ניאון כחול עם glow מסביב',
    scoreType: 'neon-cyan',
    card: { background: 'rgba(0,10,20,0.97)', border: '2px solid rgba(34,211,238,0.7)', boxShadow: '0 0 30px rgba(34,211,238,0.4), inset 0 0 30px rgba(34,211,238,0.05)' },
    entry: { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring', stiffness: 250, damping: 20 } },
    overlay: 'rgba(0,0,20,0.9)',
  },
  {
    id: 16, name: 'Neon Green', category: 'עיצוב',
    desc: 'ניאון ירוק סטייל מטריקס',
    scoreType: 'neon-green',
    card: { background: '#020b02', border: '1px solid rgba(74,222,128,0.6)', boxShadow: '0 0 40px rgba(74,222,128,0.3), inset 0 0 20px rgba(74,222,128,0.05)' },
    entry: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
    overlay: 'rgba(0,10,0,0.92)',
  },
  {
    id: 17, name: 'Gold Rush', category: 'עיצוב',
    desc: 'זהב מלכותי עם ברק',
    scoreType: 'pulse-gold',
    card: {
      background: 'linear-gradient(135deg, rgba(30,20,0,0.98) 0%, rgba(20,15,0,0.98) 100%)',
      border: '1.5px solid rgba(245,197,24,0.7)',
      boxShadow: '0 0 60px rgba(245,197,24,0.25), inset 0 1px 0 rgba(245,197,24,0.2)',
    },
    entry: { initial: { scale: 0.85, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring', stiffness: 200, damping: 18 } },
    overlay: 'rgba(10,6,0,0.88)',
  },
  {
    id: 18, name: 'Cinematic Dark', category: 'עיצוב',
    desc: 'קולנועי כהה עם חשיפה איטית',
    scoreType: 'blur',
    card: { background: 'rgba(3,3,3,0.98)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 40px 120px rgba(0,0,0,0.9)' },
    entry: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.2, ease: 'easeInOut' } },
    overlay: 'rgba(0,0,0,0.95)',
  },
  {
    id: 19, name: 'Fire', category: 'עיצוב',
    desc: 'גרדיאנט אש עם אנרגיה',
    scoreType: 'pulse-red',
    card: {
      background: 'linear-gradient(180deg, rgba(30,5,0,0.97) 0%, rgba(15,3,0,0.97) 100%)',
      border: '1px solid rgba(249,115,22,0.6)',
      boxShadow: '0 0 60px rgba(239,68,68,0.3), 0 0 120px rgba(249,115,22,0.1)',
    },
    entry: { initial: { scale: 0.7, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring', stiffness: 350, damping: 14 } },
    overlay: 'rgba(15,3,0,0.88)',
  },
  {
    id: 20, name: 'Ice Blue', category: 'עיצוב',
    desc: 'קרח כחול עדין וקריר',
    scoreType: 'neon-cyan',
    card: {
      background: 'linear-gradient(135deg, rgba(0,15,35,0.97) 0%, rgba(0,8,22,0.97) 100%)',
      border: '1px solid rgba(147,197,253,0.4)',
      boxShadow: '0 0 50px rgba(147,197,253,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
    },
    entry: { initial: { scale: 0.9, opacity: 0, filter: 'blur(8px)' }, animate: { scale: 1, opacity: 1, filter: 'blur(0px)' }, transition: { duration: 0.7 } },
    overlay: 'rgba(0,8,22,0.88)',
  },
  {
    id: 21, name: 'Purple Drama', category: 'עיצוב',
    desc: 'סגול עמוק עם glow',
    scoreType: 'stagger',
    card: {
      background: 'linear-gradient(135deg, rgba(20,5,40,0.97) 0%, rgba(10,2,25,0.97) 100%)',
      border: '1px solid rgba(168,85,247,0.5)',
      boxShadow: '0 0 60px rgba(168,85,247,0.2), inset 0 1px 0 rgba(168,85,247,0.1)',
    },
    entry: { initial: { scale: 1.1, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.5, ease: 'easeOut' } },
    overlay: 'rgba(5,0,15,0.9)',
  },
  {
    id: 22, name: 'Glitch', category: 'מיוחד',
    desc: 'אפקט גליץ\' סייברפאנק',
    scoreType: 'glitch',
    card: { background: '#030a0f', border: '1px solid rgba(34,211,238,0.5)', boxShadow: '0 0 40px rgba(34,211,238,0.2), 4px 0 rgba(239,68,68,0.3)' },
    entry: { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.2 } },
    overlay: 'rgba(0,5,10,0.92)',
  },
  {
    id: 23, name: 'Heartbeat', category: 'מיוחד',
    desc: 'פולס כמו דופק',
    scoreType: 'pulse-red',
    card: { background: 'rgba(8,18,32,0.97)', border: '1px solid rgba(239,68,68,0.4)', boxShadow: '0 0 40px rgba(239,68,68,0.15)' },
    entry: { initial: { scale: 0 }, animate: { scale: [0, 1.3, 0.9, 1.1, 1] }, transition: { duration: 0.8, times: [0, 0.3, 0.5, 0.7, 1] } },
    overlay: 'rgba(0,0,0,0.82)',
  },
  {
    id: 24, name: 'Flash Bang', category: 'מיוחד',
    desc: 'פלאש לבן ואז גילוי',
    scoreType: 'countup',
    card: { background: 'rgba(8,18,32,0.97)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 0 80px rgba(255,255,255,0.1)' },
    entry: { initial: { opacity: 0, scale: 2, filter: 'brightness(10)' }, animate: { opacity: 1, scale: 1, filter: 'brightness(1)' }, transition: { duration: 0.6, ease: 'easeOut' } },
    overlay: 'rgba(0,0,0,0.8)',
  },
  {
    id: 25, name: 'Stadium Roar', category: 'מיוחד',
    desc: 'רטט אנרגטי כמו קהל',
    scoreType: 'slot',
    card: { background: 'rgba(8,18,32,0.97)', border: '1px solid rgba(245,197,24,0.5)', boxShadow: '0 0 60px rgba(245,197,24,0.2)' },
    entry: {
      initial: { scale: 0.5, opacity: 0 },
      animate: { scale: 1, opacity: 1, x: [0, -6, 6, -4, 4, -2, 2, 0] },
      transition: { duration: 0.9, x: { delay: 0.3, duration: 0.5 } },
    },
    overlay: 'rgba(0,0,0,0.85)',
  },
];

const STAGGER_STYLES = [
  { id:26, name:'Stagger Rise',      category:'סטאגר', desc:'ספרות עולות מלמטה בזו אחר זו',      scoreType:'s-rise',      card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(99,102,241,0.5)',boxShadow:'0 0 50px rgba(99,102,241,0.15)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.8)' },
  { id:27, name:'Stagger Left',      category:'סטאגר', desc:'ספרות נכנסות משמאל',                 scoreType:'s-left',      card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(245,197,24,0.4)',boxShadow:'0 0 50px rgba(245,197,24,0.12)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.8)' },
  { id:28, name:'Stagger Right',     category:'סטאגר', desc:'ספרות נכנסות מימין',                  scoreType:'s-right',     card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(245,197,24,0.4)',boxShadow:'0 0 50px rgba(245,197,24,0.12)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.8)' },
  { id:29, name:'Stagger Ping',      category:'סטאגר', desc:'כל ספרה מתכווצת מגודל ענק',          scoreType:'s-ping',      card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(239,68,68,0.5)',boxShadow:'0 0 50px rgba(239,68,68,0.18)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:30, name:'Stagger Rotate CW', category:'סטאגר', desc:'כל ספרה מסתובבת מ-90° עם כיוון השעון', scoreType:'s-cw',      card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(168,85,247,0.5)',boxShadow:'0 0 50px rgba(168,85,247,0.15)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:31, name:'Stagger Rotate CCW',category:'סטאגר', desc:'כל ספרה מסתובבת נגד כיוון השעון',    scoreType:'s-ccw',       card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(168,85,247,0.4)',boxShadow:'0 0 50px rgba(168,85,247,0.12)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:32, name:'Stagger Blur Each', category:'סטאגר', desc:'כל ספרה מתחדדת מטשטוש בנפרד',        scoreType:'s-blur-each', card:{background:'rgba(5,10,20,0.97)',border:'1px solid rgba(255,255,255,0.1)',boxShadow:'0 20px 60px rgba(0,0,0,0.7)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.78)' },
  { id:33, name:'Stagger Elastic',   category:'סטאגר', desc:'כל ספרה קופצת ב-overshoot מאוד',     scoreType:'s-elastic',   card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(34,211,238,0.5)',boxShadow:'0 0 50px rgba(34,211,238,0.15)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:34, name:'Stagger Wave',      category:'סטאגר', desc:'גלים — האמצע מגיע ראשון',            scoreType:'s-wave',      card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(74,222,128,0.4)',boxShadow:'0 0 50px rgba(74,222,128,0.12)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:35, name:'Stagger Flip X',    category:'סטאגר', desc:'כל ספרה מתהפכת על ציר X',           scoreType:'s-flipx',     card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(251,191,36,0.5)',boxShadow:'0 0 50px rgba(251,191,36,0.15)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:36, name:'Stagger Flip Y',    category:'סטאגר', desc:'כל ספרה נפתחת כמו דלת על ציר Y',   scoreType:'s-flipy',     card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(251,191,36,0.4)',boxShadow:'0 0 50px rgba(251,191,36,0.12)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:37, name:'Stagger Spin',      category:'סטאגר', desc:'כל ספרה מסתובבת 360° ומתייצבת',     scoreType:'s-spin',      card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(239,68,68,0.5)',boxShadow:'0 0 50px rgba(239,68,68,0.18)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.85)' },
  { id:38, name:'Stagger Zoom Far',  category:'סטאגר', desc:'כל ספרה מגיעה ממרחק רב',             scoreType:'s-zoom',      card:{background:'rgba(3,5,15,0.97)',border:'1px solid rgba(99,102,241,0.5)',boxShadow:'0 0 60px rgba(99,102,241,0.2)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.88)' },
  { id:39, name:'Stagger Skew',      category:'סטאגר', desc:'כל ספרה נכנסת עם הטיה אלכסונית',    scoreType:'s-skew',      card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(245,197,24,0.5)',boxShadow:'0 0 50px rgba(245,197,24,0.15)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:40, name:'Stagger Gravity',   category:'סטאגר', desc:'כל ספרה נופלת בתאוצה (ease-in)',     scoreType:'s-gravity',   card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(239,68,68,0.4)',boxShadow:'0 0 50px rgba(239,68,68,0.15)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:41, name:'Stagger Anti-Grav', category:'סטאגר', desc:'כל ספרה עולה בהאטה (ease-out)',      scoreType:'s-anti',      card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(34,211,238,0.4)',boxShadow:'0 0 50px rgba(34,211,238,0.12)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:42, name:'Stagger Reverse',   category:'סטאגר', desc:'ספרות מגיעות מימין לשמאל',           scoreType:'s-reverse',   card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(168,85,247,0.5)',boxShadow:'0 0 50px rgba(168,85,247,0.15)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:43, name:'Outside → In',      category:'סטאגר', desc:'שני הצדדים קודם, המקף אחרון',        scoreType:'s-outside',   card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(74,222,128,0.5)',boxShadow:'0 0 50px rgba(74,222,128,0.15)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:44, name:'Inside → Out',      category:'סטאגר', desc:'המקף קודם, הספרות אחרון',            scoreType:'s-inside',    card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(251,191,36,0.5)',boxShadow:'0 0 50px rgba(251,191,36,0.15)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:45, name:'Stagger Rubber',    category:'סטאגר', desc:'כל ספרה מתמתחת ומתכווצת כגומי',      scoreType:'s-rubber',    card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(239,68,68,0.5)',boxShadow:'0 0 50px rgba(239,68,68,0.2)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.85)' },
  { id:46, name:'Stagger Strobe',    category:'סטאגר', desc:'כל ספרה מהבהבת לפני שמתייצבת',       scoreType:'s-strobe',    card:{background:'#050505',border:'1px solid rgba(255,255,255,0.2)',boxShadow:'0 0 40px rgba(255,255,255,0.08)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.92)' },
  { id:47, name:'Stagger 3D Depth',  category:'סטאגר', desc:'כל ספרה מגיחה ממעמקי הZ-axis',       scoreType:'s-depth',     card:{background:'rgba(3,5,15,0.97)',border:'1px solid rgba(99,102,241,0.6)',boxShadow:'0 0 70px rgba(99,102,241,0.25)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,5,0.9)' },
  { id:48, name:'Stagger Swing',     category:'סטאגר', desc:'כל ספרה מתנדנדת כמו מטוטלת',         scoreType:'s-swing',     card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(245,197,24,0.5)',boxShadow:'0 0 50px rgba(245,197,24,0.15)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:49, name:'Stagger Melt',      category:'סטאגר', desc:'ספרות ממיסות פנימה לאט ומפנקות',     scoreType:'s-melt',      card:{background:'rgba(8,18,32,0.95)',border:'1px solid rgba(168,85,247,0.4)',boxShadow:'0 0 50px rgba(168,85,247,0.12)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.82)' },
  { id:50, name:'Stagger Color Flash',category:'סטאגר', desc:'כל ספרה מבזיקה בצבע ומתלבנת',       scoreType:'s-color',     card:{background:'rgba(5,5,15,0.97)',border:'1px solid rgba(251,191,36,0.6)',boxShadow:'0 0 60px rgba(251,191,36,0.2)'}, entry:{initial:{opacity:0},animate:{opacity:1},transition:{duration:0.3}}, overlay:'rgba(0,0,0,0.88)' },
];

const ALL_STYLES = [...STYLES, ...STAGGER_STYLES];

const CATEGORIES = ['הכל', 'כניסה', 'מספרים', 'עיצוב', 'מיוחד', 'סטאגר'];

// ─── Preview Overlay ────────────────────────────────────────────────────

function PreviewOverlay({ style, onClose }) {
  const [key, setKey] = useState(0);
  const replay = () => setKey(k => k + 1);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: style.overlay, backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[101] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
      ><X className="w-5 h-5" /></button>

      {/* Replay */}
      <button
        onClick={replay}
        className="fixed top-4 left-4 z-[101] flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm"
      ><Play className="w-4 h-4" /> הפעל שוב</button>

      {/* Style name */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[101]">
        <div className="px-4 py-2 rounded-full bg-black/60 text-white text-sm font-medium">
          {style.id}. {style.name} — {style.desc}
        </div>
      </div>

      {/* The animated card */}
      <motion.div
        key={key}
        className="rounded-2xl overflow-hidden"
        style={style.card}
        {...style.entry}
      >
        <div className="px-10 py-8 flex flex-col items-center gap-5">
          {/* LIVE pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span style={{ color: '#f87171', fontSize: 11, fontWeight: 700, letterSpacing: 3 }}>LIVE</span>
          </div>

          {/* Teams + Score */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1.5 w-20">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ background: 'rgba(255,255,255,0.08)' }}>🇧🇷</div>
              <span style={{ color: '#94a3b8', fontSize: 11 }}>{MOCK.homeTla}</span>
            </div>

            <ScoreDisplay key={key} type={style.scoreType} />

            <div className="flex flex-col items-center gap-1.5 w-20">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ background: 'rgba(255,255,255,0.08)' }}>🇦🇷</div>
              <span style={{ color: '#94a3b8', fontSize: 11 }}>{MOCK.awayTla}</span>
            </div>
          </div>

          {/* Prediction */}
          <div className="flex flex-col items-center gap-1">
            <span style={{ color: '#64748b', fontSize: 12 }}>הניחוש שלי</span>
            <span style={{ color: '#fbbf24', fontSize: 14, fontWeight: 700 }}>({MOCK.prediction})</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Style Card ─────────────────────────────────────────────────────────

function StyleCard({ style, onPreview }) {
  const CATEGORY_COLOR = { כניסה: '#3b82f6', מספרים: '#8b5cf6', עיצוב: '#f59e0b', מיוחד: '#ef4444' };
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 cursor-pointer hover:scale-[1.02] transition-transform"
      style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700 }}>#{style.id}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: `${CATEGORY_COLOR[style.category]}22`, color: CATEGORY_COLOR[style.category] }}>
              {style.category}
            </span>
          </div>
          <h3 className="text-white font-bold mt-1">{style.name}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{style.desc}</p>
        </div>
      </div>

      {/* Mini preview swatch */}
      <div className="rounded-lg h-10 flex items-center justify-center"
        style={{ background: style.card.background || 'rgba(8,18,32,0.9)', border: style.card.border }}>
        <span style={{ color: '#fff', fontSize: 16, fontWeight: 900, letterSpacing: -1 }}>1 - 1</span>
      </div>

      <button
        onClick={() => onPreview(style)}
        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
        style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}
      >
        <Play className="w-3.5 h-3.5" /> הצג תצוגה מקדימה
      </button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function AdminLiveDemo() {
  const [activeCategory, setActiveCategory] = useState('הכל');
  const [previewStyle, setPreviewStyle] = useState(null);

  const filtered = activeCategory === 'הכל'
    ? ALL_STYLES
    : ALL_STYLES.filter(s => s.category === activeCategory);

  return (
    <div className="text-white" dir="rtl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">דמו אנימציות Live Overlay</h2>
        <p className="text-slate-400 text-sm mt-1">50 סגנונות שונים — לחץ "הצג תצוגה מקדימה" לראות בגודל מלא</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: activeCategory === cat ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)',
              border: activeCategory === cat ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.1)',
              color: activeCategory === cat ? '#93c5fd' : '#94a3b8',
            }}
          >{cat} {cat === 'הכל' ? `(${ALL_STYLES.length})` : `(${ALL_STYLES.filter(s => s.category === cat).length})`}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(style => (
          <StyleCard key={style.id} style={style} onPreview={setPreviewStyle} />
        ))}
      </div>

      {/* Preview overlay */}
      <AnimatePresence>
        {previewStyle && (
          <PreviewOverlay style={previewStyle} onClose={() => setPreviewStyle(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
