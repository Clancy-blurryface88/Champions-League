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

// ─── Dramatic custom components ─────────────────────────────────────────

function MatrixDecode({ home, away }) {
  const CHARS = '0123456789@#$%&';
  const targets = [String(home), '-', String(away)];
  const [shown, setShown] = useState(['?', '?', '?']);
  useEffect(() => {
    targets.forEach((target, idx) => {
      let iter = 0;
      const iv = setInterval(() => {
        iter++;
        setShown(p => { const n=[...p]; n[idx] = iter > 10+idx*5 ? target : CHARS[Math.floor(Math.random()*CHARS.length)]; return n; });
        if (iter > 16+idx*5) clearInterval(iv);
      }, 60);
    });
  }, []);
  return (
    <span style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900, fontFamily:'monospace' }}>
      {shown.map((c,i) => <span key={i} style={{ color: i===1?'#475569':c===targets[i]?'#4ade80':'#22d3ee' }}>{c}</span>)}
    </span>
  );
}

function HackCount({ home, away }) {
  const [h, setH] = useState(0); const [a, setA] = useState(0); const [done, setDone] = useState(false);
  useEffect(() => {
    let i=0;
    const iv = setInterval(() => {
      i++;
      setH(Math.floor(Math.random()*10));
      setA(Math.floor(Math.random()*10));
      if (i>20) { clearInterval(iv); setH(home); setA(away); setDone(true); }
    }, 50);
    return ()=>clearInterval(iv);
  }, []);
  return (
    <span style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900, fontFamily:'monospace' }}>
      <span style={{ color: done?'#fff':'#22d3ee', transition:'color 0.3s' }}>{h}</span>
      <span style={{ color:'#475569' }}>-</span>
      <span style={{ color: done?'#fff':'#22d3ee', transition:'color 0.3s' }}>{a}</span>
    </span>
  );
}

function ErrorFix({ home, away }) {
  const [phase, setPhase] = useState('err');
  useEffect(() => {
    setTimeout(()=>setPhase('flash'), 800);
    setTimeout(()=>setPhase('ok'), 1400);
  }, []);
  const colors = { err:'#ef4444', flash:'#fbbf24', ok:'#fff' };
  const vals = phase==='err' ? ['?','?','?'] : phase==='flash' ? ['!','!','!'] : [String(home),'-',String(away)];
  return (
    <motion.span
      key={phase}
      initial={{ opacity:0, scale:0.8 }}
      animate={{ opacity:1, scale:1 }}
      style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900 }}
    >
      {vals.map((v,i)=><span key={i} style={{ color: i===1&&phase==='ok'?'#475569':colors[phase] }}>{v}</span>)}
    </motion.span>
  );
}

function SatelliteScore({ home, away }) {
  return (
    <motion.span
      initial={{ filter:'blur(30px) brightness(3)', scale:0.4, opacity:0 }}
      animate={{ filter:'blur(0px) brightness(1)', scale:1, opacity:1 }}
      transition={{ duration:1.2, ease:[0.16,1,0.3,1] }}
      style={{ fontSize:52, fontWeight:900, letterSpacing:-2 }}
    >
      <span style={{ color:'#fff' }}>{home}</span>
      <span style={{ color:'#475569', margin:'0 12px' }}>-</span>
      <span style={{ color:'#fff' }}>{away}</span>
    </motion.span>
  );
}

function CrossfadeScore({ home, away }) {
  const [cur, setCur] = useState({ h:0, a:0 });
  useEffect(() => {
    setTimeout(()=>setCur({ h:home, a:away }), 900);
  }, []);
  return (
    <motion.span
      animate={{ opacity:[1,0,1] }}
      transition={{ duration:0.8, delay:0.7, times:[0,0.5,1] }}
      style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900 }}
    >
      <span style={{ color:'#fbbf24' }}>{cur.h}</span>
      <span style={{ color:'#475569' }}>-</span>
      <span style={{ color:'#fbbf24' }}>{cur.a}</span>
    </motion.span>
  );
}

function AssembleScore({ home, away }) {
  const parts = [String(home), '-', String(away)];
  const offsets = [[-120,-80],[0,0],[120,-80]];
  return (
    <span style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900 }}>
      {parts.map((p,i) => (
        <motion.span key={i}
          initial={{ x:offsets[i][0], y:offsets[i][1], opacity:0, scale:0 }}
          animate={{ x:0, y:0, opacity:1, scale:1 }}
          transition={{ type:'spring', stiffness:200, damping:16, delay:i*0.15 }}
          style={{ color: i===1?'#475569':'#fff', display:'inline-block' }}
        >{p}</motion.span>
      ))}
    </span>
  );
}

function PendulumScore({ home, away }) {
  const parts = [String(home), '-', String(away)];
  return (
    <span style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900 }}>
      {parts.map((p,i) => (
        <motion.span key={i}
          initial={{ rotate:-120, opacity:0, originX:'50%', originY:'-200%' }}
          animate={{ rotate:0, opacity:1 }}
          transition={{ type:'spring', stiffness:80, damping:10, delay:i*0.25 }}
          style={{ color: i===1?'#475569':'#fff', display:'inline-block' }}
        >{p}</motion.span>
      ))}
    </span>
  );
}

function MirrorUnfold({ home, away }) {
  const parts = [String(home), '-', String(away)];
  return (
    <span style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900 }}>
      {parts.map((p,i) => (
        <motion.span key={i}
          initial={{ scaleX:0, opacity:0 }}
          animate={{ scaleX:1, opacity:1 }}
          transition={{ duration:0.5, ease:[0.22,1,0.36,1], delay:i*0.2 }}
          style={{ color: i===1?'#475569':'#fff', display:'inline-block', originX:'50%' }}
        >{p}</motion.span>
      ))}
    </span>
  );
}

function FireEmerge({ home, away }) {
  const parts = [String(home), '-', String(away)];
  return (
    <span style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900 }}>
      {parts.map((p,i) => (
        <motion.span key={i}
          initial={{ y:80, opacity:0, filter:'blur(8px)', color:'#ef4444' }}
          animate={{ y:0, opacity:1, filter:'blur(0px)', color: i===1?'#475569':'#fff' }}
          transition={{ duration:0.7, ease:[0.16,1,0.3,1], delay:i*0.2 }}
          style={{ display:'inline-block' }}
        >{p}</motion.span>
      ))}
    </span>
  );
}

function IceFreeze({ home, away }) {
  const parts = [String(home), '-', String(away)];
  return (
    <span style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900 }}>
      {parts.map((p,i) => (
        <motion.span key={i}
          initial={{ scale:2, opacity:0, filter:'blur(10px) brightness(3)', color:'#bfdbfe' }}
          animate={{ scale:1, opacity:1, filter:'blur(0px) brightness(1)', color: i===1?'#475569':'#93c5fd' }}
          transition={{ duration:0.8, ease:'easeOut', delay:i*0.22 }}
          style={{ display:'inline-block' }}
        >{p}</motion.span>
      ))}
    </span>
  );
}

function GoldPour({ home, away }) {
  const parts = [String(home), '-', String(away)];
  return (
    <span style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900 }}>
      {parts.map((p,i) => (
        <motion.span key={i}
          initial={{ y:-100, scaleY:0.1, opacity:0, color:'#fbbf24' }}
          animate={{ y:0, scaleY:1, opacity:1, color:'#fbbf24' }}
          transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay:0.3+i*0.2 }}
          style={{ display:'inline-block', originY:0, color: i===1?'#78350f':'#fbbf24' }}
        >{p}</motion.span>
      ))}
    </span>
  );
}

function RicochetScore({ home, away }) {
  const parts = [String(home), '-', String(away)];
  const paths = [
    { x:[-200,100,-60,30,-15,0], y:[0,0,0,0,0,0] },
    { x:[0,0,0,0,0,0], y:[-150,60,-30,15,-5,0] },
    { x:[200,-100,60,-30,15,0], y:[0,0,0,0,0,0] },
  ];
  return (
    <span style={{ display:'flex', alignItems:'center', gap:14, fontSize:52, fontWeight:900 }}>
      {parts.map((p,i) => (
        <motion.span key={i}
          initial={{ x:paths[i].x[0], y:paths[i].y[0], opacity:0 }}
          animate={{ x:0, y:0, opacity:1 }}
          transition={{ duration:0.9, delay:i*0.1, type:'spring', stiffness:300, damping:8 }}
          style={{ color: i===1?'#475569':'#fff', display:'inline-block' }}
        >{p}</motion.span>
      ))}
    </span>
  );
}

// Factory extras for dramatic styles
const SNuke       = makeStagger(()=>({scale:0,opacity:0}), ()=>({scale:[0,12,0.6,1.2,1],opacity:[0,1,1,1,1]}), i=>({duration:1.1,delay:i*0.18}));
const SSlam       = makeStagger(()=>({y:-500,opacity:0}), ()=>({y:[0,12,-6,3,-1,0],opacity:1}), i=>({duration:0.9,delay:i*0.15}));
const SVortex     = makeStagger(()=>({rotate:-720,scale:0,opacity:0}), ()=>({rotate:0,scale:1,opacity:1}), i=>({type:'spring',stiffness:120,damping:12,delay:i*0.2}));
const SMeteor     = makeStagger(()=>({x:200,y:-200,rotate:45,opacity:0}), ()=>({x:0,y:0,rotate:0,opacity:1}), i=>({type:'spring',stiffness:200,damping:16,delay:i*0.18}));
const SThunder    = makeStagger(()=>({x:0,opacity:0}), ()=>({x:[-180,160,-120,90,-60,40,-20,10,0],opacity:1}), i=>({duration:0.7,delay:i*0.12}));
const SCrush      = makeStagger(()=>({scale:4,opacity:0}), ()=>({scale:[4,0.4,1.2,0.85,1],opacity:[0,1,1,1,1]}), i=>({duration:0.9,delay:i*0.2}));
const SSnap       = makeStagger(()=>({scale:0,opacity:0}), ()=>({scale:[0,1.8,0.7,1.1,1],opacity:1}), i=>({duration:0.4,delay:i*0.08}));
const SMagnetic   = makeStagger((i)=>({x:i===0?-250:i===2?250:0, y:i===1?-120:0, opacity:0}), ()=>({x:0,y:0,opacity:1}), i=>({type:'spring',stiffness:180,damping:14,delay:i*0.1}));
const SSlingshot  = makeStagger(()=>({x:-300,y:200,opacity:0,rotate:-30}), ()=>({x:0,y:0,opacity:1,rotate:0}), i=>({type:'spring',stiffness:250,damping:14,delay:i*0.15}));
const SDropSplash = makeStagger(()=>({y:-400,opacity:0}), ()=>({y:[0,-20,8,-4,2,0],opacity:1}), i=>({duration:0.8,delay:i*0.2}));
const SOrbital    = makeStagger((i)=>({rotate:i*120,scale:0,opacity:0,originX:'50%',originY:'150%'}), ()=>({rotate:0,scale:1,opacity:1}), i=>({type:'spring',stiffness:160,damping:14,delay:i*0.22}));
const SSpringHeavy= makeStagger(()=>({y:-60,scale:0.2,opacity:0}), ()=>({y:0,scale:1,opacity:1}), i=>({type:'spring',stiffness:600,damping:8,delay:i*0.2}));
const SIrisIn     = makeStagger(()=>({scale:0.01,opacity:0}), ()=>({scale:1,opacity:1}), i=>({type:'spring',stiffness:150,damping:10,delay:i*0.3}));
const SSlowBurn   = makeStagger(()=>({opacity:0,filter:'blur(4px)'}), ()=>({opacity:1,filter:'blur(0px)'}), i=>({duration:1.8,ease:'easeInOut',delay:i*0.6}));
const SFreezeUnfreeze = makeStagger(()=>({scale:0.95,opacity:0,filter:'saturate(0)'}), ()=>({scale:[0.95,0.95,0.95,1],opacity:[0,0,0,1],filter:'saturate(1)'}), i=>({duration:0.9,delay:0.5+i*0.15}));
const SMovieTitle = makeStagger(()=>({letterSpacing:40,opacity:0,scale:0.8}), ()=>({letterSpacing:0,opacity:1,scale:1}), i=>({duration:1.0,ease:[0.16,1,0.3,1],delay:i*0.3}));
const SDramaticPause = makeStagger(()=>({opacity:0,scale:1.5}), ()=>({opacity:[0,0,0,0,0,1],scale:[1.5,1.5,1.5,1.5,1.5,1]}), i=>({duration:2.0,delay:i*0.1}));
const SWaveCascade= makeStagger((i)=>({y:i*30,opacity:0}), ()=>({y:0,opacity:1}), i=>({type:'spring',stiffness:260,damping:16,delay:i*0.12}));
const SSmoke      = makeStagger(()=>({opacity:0,scale:1.4,filter:'blur(20px) saturate(0)'}), ()=>({opacity:1,scale:1,filter:'blur(0px) saturate(1)'}), i=>({duration:1.0,delay:i*0.28}));
const SGoalExplode= makeStagger(()=>({scale:0,rotate:-15,opacity:0}), ()=>({scale:[0,1.6,0.85,1.1,1],rotate:[−15,10,-5,2,0],opacity:1}), i=>({duration:0.9,delay:i*0.15}));

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
    case 's-color':        return <SColorFlash home={h} away={a} />;
    // Dramatic batch
    case 'd-matrix':       return <MatrixDecode home={h} away={a} />;
    case 'd-hack':         return <HackCount home={h} away={a} />;
    case 'd-error':        return <ErrorFix home={h} away={a} />;
    case 'd-satellite':    return <SatelliteScore home={h} away={a} />;
    case 'd-crossfade':    return <CrossfadeScore home={h} away={a} />;
    case 'd-assemble':     return <AssembleScore home={h} away={a} />;
    case 'd-pendulum':     return <PendulumScore home={h} away={a} />;
    case 'd-mirror':       return <MirrorUnfold home={h} away={a} />;
    case 'd-fire':         return <FireEmerge home={h} away={a} />;
    case 'd-ice':          return <IceFreeze home={h} away={a} />;
    case 'd-gold':         return <GoldPour home={h} away={a} />;
    case 'd-ricochet':     return <RicochetScore home={h} away={a} />;
    case 'd-nuke':         return <SNuke home={h} away={a} />;
    case 'd-slam':         return <SSlam home={h} away={a} />;
    case 'd-vortex':       return <SVortex home={h} away={a} />;
    case 'd-meteor':       return <SMeteor home={h} away={a} />;
    case 'd-thunder':      return <SThunder home={h} away={a} />;
    case 'd-crush':        return <SCrush home={h} away={a} />;
    case 'd-snap':         return <SSnap home={h} away={a} />;
    case 'd-magnetic':     return <SMagnetic home={h} away={a} />;
    case 'd-slingshot':    return <SSlingshot home={h} away={a} />;
    case 'd-dropsplash':   return <SDropSplash home={h} away={a} />;
    case 'd-orbital':      return <SOrbital home={h} away={a} />;
    case 'd-spring2':      return <SSpringHeavy home={h} away={a} />;
    case 'd-iris':         return <SIrisIn home={h} away={a} />;
    case 'd-slowburn':     return <SSlowBurn home={h} away={a} />;
    case 'd-freeze':       return <SFreezeUnfreeze home={h} away={a} />;
    case 'd-movietitle':   return <SMovieTitle home={h} away={a} />;
    case 'd-pause':        return <SDramaticPause home={h} away={a} />;
    case 'd-cascade':      return <SWaveCascade home={h} away={a} />;
    case 'd-smoke':        return <SSmoke home={h} away={a} />;
    case 'd-goal':         return <SGoalExplode home={h} away={a} />;
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

const C = (bg,br,sh) => ({ background:bg, border:br, boxShadow:sh });
const E = (init,anim,trans,ov='rgba(0,0,0,0.85)') => ({ entry:{initial:init,animate:anim,transition:trans}, overlay:ov });

const DRAMATIC_STYLES = [
  { id:51, name:'Matrix Decode',    category:'דרמה', desc:'ספרות מפוצחות מתוך מטריקס', scoreType:'d-matrix',     ...C('rgba(0,10,0,0.97)','1px solid rgba(74,222,128,0.6)','0 0 60px rgba(74,222,128,0.25)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,8,0,0.95)') },
  { id:52, name:'Hack Lock',        category:'דרמה', desc:'מחשב פורץ ונועל את התוצאה',  scoreType:'d-hack',       ...C('rgba(3,8,18,0.97)','1px solid rgba(34,211,238,0.5)','0 0 50px rgba(34,211,238,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:53, name:'Error → Fix',      category:'דרמה', desc:'מראה שגיאה ואז מתקן לתוצאה', scoreType:'d-error',      ...C('rgba(8,3,3,0.97)','1px solid rgba(239,68,68,0.6)','0 0 60px rgba(239,68,68,0.25)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:54, name:'Satellite Link',   category:'דרמה', desc:'מתפרק ומתחבר כמו שידור לוויין',scoreType:'d-satellite',  ...C('rgba(3,5,15,0.97)','1px solid rgba(99,102,241,0.5)','0 0 60px rgba(99,102,241,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,10,0.9)') },
  { id:55, name:'Score Crossfade',  category:'דרמה', desc:'0-0 מתפוגג ל-1-1',            scoreType:'d-crossfade',  ...C('rgba(20,15,0,0.97)','1px solid rgba(251,191,36,0.5)','0 0 60px rgba(251,191,36,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:56, name:'Particle Assemble',category:'דרמה', desc:'שלושה חלקים מתאספים ממרחק',  scoreType:'d-assemble',   ...C('rgba(8,18,32,0.97)','1px solid rgba(168,85,247,0.6)','0 0 70px rgba(168,85,247,0.25)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:57, name:'Pendulum Swing',   category:'דרמה', desc:'ספרות מתנדנדות כמו מטוטלת',  scoreType:'d-pendulum',   ...C('rgba(8,18,32,0.97)','1px solid rgba(245,197,24,0.5)','0 0 50px rgba(245,197,24,0.15)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:58, name:'Mirror Unfold',    category:'דרמה', desc:'כל ספרה נפתחת ממרכז כמו מראה',scoreType:'d-mirror',     ...C('rgba(5,10,20,0.97)','1px solid rgba(255,255,255,0.15)','0 20px 80px rgba(0,0,0,0.8)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.88)') },
  { id:59, name:'Fire Emerge',      category:'דרמה', desc:'ספרות עולות מאש עם glow אדום', scoreType:'d-fire',       ...C('linear-gradient(180deg,rgba(20,3,0,0.97),rgba(10,2,0,0.97))','1px solid rgba(249,115,22,0.6)','0 0 80px rgba(239,68,68,0.35)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(12,2,0,0.92)') },
  { id:60, name:'Ice Freeze',       category:'דרמה', desc:'ספרות מתקפאות ממפל אור קר',   scoreType:'d-ice',        ...C('linear-gradient(135deg,rgba(0,10,30,0.97),rgba(0,5,18,0.97))','1px solid rgba(147,197,253,0.5)','0 0 70px rgba(147,197,253,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,5,15,0.92)') },
  { id:61, name:'Gold Pour',        category:'דרמה', desc:'ספרות שופעות מלמעלה כמו זהב',  scoreType:'d-gold',       ...C('linear-gradient(135deg,rgba(25,18,0,0.98),rgba(15,10,0,0.98))','2px solid rgba(245,197,24,0.7)','0 0 80px rgba(245,197,24,0.3), inset 0 1px rgba(245,197,24,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(10,7,0,0.92)') },
  { id:62, name:'Ricochet',         category:'דרמה', desc:'ספרות מקפצות מקירות כמו כדור', scoreType:'d-ricochet',   ...C('rgba(8,18,32,0.97)','1px solid rgba(239,68,68,0.5)','0 0 60px rgba(239,68,68,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:63, name:'Nuclear',          category:'דרמה', desc:'מתפוצץ ל-x12 ומתכווץ לתוצאה', scoreType:'d-nuke',       ...C('rgba(5,0,0,0.98)','1px solid rgba(239,68,68,0.7)','0 0 100px rgba(239,68,68,0.4)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(3,0,0,0.95)') },
  { id:64, name:'Ground Slam',      category:'דרמה', desc:'נופל 500px וקופץ עם רעידה',    scoreType:'d-slam',       ...C('rgba(8,18,32,0.97)','1px solid rgba(245,197,24,0.5)','0 0 60px rgba(245,197,24,0.2)'), ...E({scale:0,opacity:0},{scale:1,opacity:1},{type:'spring',stiffness:200,damping:10}) },
  { id:65, name:'Vortex Spin',      category:'דרמה', desc:'720° סיבוב ומתכווץ פנימה',     scoreType:'d-vortex',     ...C('rgba(5,3,20,0.97)','1px solid rgba(168,85,247,0.6)','0 0 80px rgba(168,85,247,0.3)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(3,2,12,0.92)') },
  { id:66, name:'Meteor Strike',    category:'דרמה', desc:'נכנס בזווית 45° כמו מטאור',    scoreType:'d-meteor',     ...C('rgba(5,3,0,0.97)','1px solid rgba(251,191,36,0.6)','0 0 80px rgba(251,191,36,0.25), 0 0 150px rgba(239,68,68,0.1)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(4,2,0,0.92)') },
  { id:67, name:'Thunder Shock',    category:'דרמה', desc:'רטט אופקי חזק כמו ברק',        scoreType:'d-thunder',    ...C('rgba(3,5,15,0.97)','1px solid rgba(250,204,21,0.7)','0 0 80px rgba(250,204,21,0.3)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(2,3,10,0.92)') },
  { id:68, name:'Crush & Release',  category:'דרמה', desc:'גדל x4 ונמעך לתוצאה',          scoreType:'d-crush',      ...C('rgba(8,18,32,0.97)','1px solid rgba(239,68,68,0.5)','0 0 60px rgba(239,68,68,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:69, name:'Instant Snap',     category:'דרמה', desc:'מופיע בבת אחת עם overshoot', scoreType:'d-snap',       ...C('rgba(8,18,32,0.97)','1px solid rgba(74,222,128,0.5)','0 0 60px rgba(74,222,128,0.2)'), ...E({scale:0},{scale:1},{type:'spring',stiffness:500,damping:10}) },
  { id:70, name:'Magnetic Pull',    category:'דרמה', desc:'ספרות נמשכות ממרחק למרכז',     scoreType:'d-magnetic',   ...C('rgba(3,5,18,0.97)','1px solid rgba(99,102,241,0.6)','0 0 70px rgba(99,102,241,0.25)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:71, name:'Slingshot',        category:'דרמה', desc:'נזרק מהפינה בזווית חדה',       scoreType:'d-slingshot',  ...C('rgba(8,18,32,0.97)','1px solid rgba(245,197,24,0.5)','0 0 60px rgba(245,197,24,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:72, name:'Drop & Splash',    category:'דרמה', desc:'נופל ומתיז כמו טיפת מים',       scoreType:'d-dropsplash', ...C('rgba(0,8,20,0.97)','1px solid rgba(34,211,238,0.5)','0 0 70px rgba(34,211,238,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,5,15,0.9)') },
  { id:73, name:'Orbital Entry',    category:'דרמה', desc:'מסתובב ממסלול מעגלי לנחיתה',  scoreType:'d-orbital',    ...C('rgba(3,5,20,0.97)','1px solid rgba(168,85,247,0.5)','0 0 70px rgba(168,85,247,0.25)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:74, name:'Heavy Spring',     category:'דרמה', desc:'קפיץ כבד עם תנודות מרובות',    scoreType:'d-spring2',    ...C('rgba(8,18,32,0.97)','1px solid rgba(34,211,238,0.4)','0 0 60px rgba(34,211,238,0.15)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:75, name:'Iris Open',        category:'דרמה', desc:'נפתח מנקודה אפסית כמו עדשה',  scoreType:'d-iris',       ...C('rgba(5,5,15,0.97)','1px solid rgba(255,255,255,0.12)','0 40px 100px rgba(0,0,0,0.9)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.95)') },
  { id:76, name:'Slow Burn',        category:'דרמה', desc:'3 ספרות מתגלות אחת לאחת, לאט', scoreType:'d-slowburn',   ...C('rgba(3,3,3,0.98)','1px solid rgba(255,255,255,0.06)','0 40px 120px rgba(0,0,0,0.95)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.97)') },
  { id:77, name:'Freeze Frame',     category:'דרמה', desc:'קפוא → פתאום חי',              scoreType:'d-freeze',     ...C('rgba(3,5,15,0.97)','1px solid rgba(147,197,253,0.3)','0 0 60px rgba(147,197,253,0.1)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,3,10,0.92)') },
  { id:78, name:'Movie Title',      category:'דרמה', desc:'spacing מצטמצם כמו כותרת סרט', scoreType:'d-movietitle',  ...C('rgba(2,2,2,0.99)','1px solid rgba(255,255,255,0.08)','0 0 80px rgba(255,255,255,0.05)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.97)') },
  { id:79, name:'Dramatic Pause',   category:'דרמה', desc:'מחכה 2 שניות ואז מגיע פתאום', scoreType:'d-pause',      ...C('rgba(8,18,32,0.97)','1px solid rgba(239,68,68,0.4)','0 0 60px rgba(239,68,68,0.15)'), ...E({opacity:0},{opacity:1},{duration:0.3}) },
  { id:80, name:'Wave Cascade',     category:'דרמה', desc:'גל מדורג שמתפשט ממרכז',        scoreType:'d-cascade',    ...C('rgba(0,8,22,0.97)','1px solid rgba(34,211,238,0.5)','0 0 70px rgba(34,211,238,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,5,15,0.9)') },
  { id:81, name:'Smoke Appear',     category:'דרמה', desc:'מגיח מעשן כמו קסמאי',          scoreType:'d-smoke',      ...C('rgba(5,5,8,0.98)','1px solid rgba(148,163,184,0.25)','0 0 60px rgba(148,163,184,0.1)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(2,2,4,0.95)') },
  { id:82, name:'Goal Explosion',   category:'דרמה', desc:'כמו פיצוץ שער - rocket league', scoreType:'d-goal',       ...C('rgba(8,18,32,0.97)','2px solid rgba(245,197,24,0.8)','0 0 100px rgba(245,197,24,0.4), 0 0 200px rgba(239,68,68,0.1)'), ...E({scale:0,opacity:0},{scale:1,opacity:1},{type:'spring',stiffness:400,damping:8},'rgba(0,0,0,0.9)') },
  // 18 more creative variations
  { id:83, name:'Nuke + Glow Red',  category:'דרמה', desc:'פיצוץ ענק עם אורה אדומה',      scoreType:'d-nuke',       ...C('rgba(8,0,0,0.98)','2px solid rgba(239,68,68,0.8)','0 0 120px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.3)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(5,0,0,0.95)') },
  { id:84, name:'Slam + Gold',      category:'דרמה', desc:'נופל עם אורת זהב',              scoreType:'d-slam',       ...C('rgba(15,10,0,0.98)','2px solid rgba(245,197,24,0.8)','0 0 80px rgba(245,197,24,0.4)'), ...E({scale:0,opacity:0},{scale:1,opacity:1},{type:'spring',stiffness:300,damping:8}) },
  { id:85, name:'Vortex + Purple',  category:'דרמה', desc:'מערבולת סגולה אינטנסיבית',      scoreType:'d-vortex',     ...C('rgba(10,0,20,0.98)','2px solid rgba(168,85,247,0.8)','0 0 100px rgba(168,85,247,0.45)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(5,0,12,0.95)') },
  { id:86, name:'Meteor + Cyan',    category:'דרמה', desc:'מטאור כחול-ירוק שמאיר',        scoreType:'d-meteor',     ...C('rgba(0,8,15,0.98)','2px solid rgba(34,211,238,0.7)','0 0 90px rgba(34,211,238,0.35)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(0,4,10,0.95)') },
  { id:87, name:'Thunder White',    category:'דרמה', desc:'ברק לבן עיוור',                  scoreType:'d-thunder',    ...C('rgba(5,5,5,0.98)','2px solid rgba(255,255,255,0.6)','0 0 100px rgba(255,255,255,0.3)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(0,0,0,0.95)') },
  { id:88, name:'Assemble Gold',    category:'דרמה', desc:'חלקים זהובים מתאספים',          scoreType:'d-assemble',   ...C('rgba(12,8,0,0.98)','2px solid rgba(245,197,24,0.7)','0 0 80px rgba(245,197,24,0.3)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(8,5,0,0.95)') },
  { id:89, name:'Fire + Slam',      category:'דרמה', desc:'עולה מאש ומתרסק למקומו',        scoreType:'d-fire',       ...C('rgba(15,3,0,0.98)','2px solid rgba(249,115,22,0.7)','0 0 100px rgba(239,68,68,0.45)'), ...E({scale:0,opacity:0},{scale:1,opacity:1},{type:'spring',stiffness:350,damping:10},'rgba(10,2,0,0.95)') },
  { id:90, name:'Ice Shard',        category:'דרמה', desc:'שברי קרח מתחברים',              scoreType:'d-ice',        ...C('rgba(0,5,18,0.98)','2px solid rgba(147,197,253,0.7)','0 0 90px rgba(147,197,253,0.35)'), ...E({scale:0,opacity:0},{scale:1,opacity:1},{type:'spring',stiffness:300,damping:12},'rgba(0,3,12,0.95)') },
  { id:91, name:'Gold Cascade',     category:'דרמה', desc:'ספרות זהב גולשות מלמעלה',       scoreType:'d-gold',       ...C('rgba(18,12,0,0.98)','2px solid rgba(245,197,24,0.8)','0 0 100px rgba(245,197,24,0.4), inset 0 1px rgba(255,220,100,0.2)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(10,7,0,0.95)') },
  { id:92, name:'Matrix + Nuke',    category:'דרמה', desc:'פיצחון וניוקליאר בשילוב',       scoreType:'d-matrix',     ...C('rgba(0,8,0,0.98)','2px solid rgba(74,222,128,0.8)','0 0 100px rgba(74,222,128,0.4), 0 0 200px rgba(74,222,128,0.1)'), ...E({scale:0,opacity:0},{scale:1,opacity:1},{type:'spring',stiffness:400,damping:10},'rgba(0,5,0,0.97)') },
  { id:93, name:'Slingshot Red',    category:'דרמה', desc:'נזרק בכח עם אורה אדומה',        scoreType:'d-slingshot',  ...C('rgba(10,2,2,0.98)','2px solid rgba(239,68,68,0.7)','0 0 90px rgba(239,68,68,0.35)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(6,1,1,0.95)') },
  { id:94, name:'Orbital Gold',     category:'דרמה', desc:'מסלול מעגלי עם זהב',            scoreType:'d-orbital',    ...C('rgba(15,10,0,0.98)','2px solid rgba(245,197,24,0.7)','0 0 90px rgba(245,197,24,0.35)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(8,5,0,0.95)') },
  { id:95, name:'Smoke + Purple',   category:'דרמה', desc:'עשן סגול מיסטי',                scoreType:'d-smoke',      ...C('rgba(8,3,15,0.98)','2px solid rgba(168,85,247,0.6)','0 0 80px rgba(168,85,247,0.3)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(5,2,10,0.97)') },
  { id:96, name:'Crossfade Drama',  category:'דרמה', desc:'0-0 → תוצאה עם גלייד',          scoreType:'d-crossfade',  ...C('rgba(8,18,32,0.98)','2px solid rgba(34,211,238,0.6)','0 0 80px rgba(34,211,238,0.25)'), ...E({scale:0.5,opacity:0},{scale:1,opacity:1},{type:'spring',stiffness:200,damping:15}) },
  { id:97, name:'Movie + Red',      category:'דרמה', desc:'כותרת סרט עם אורה אדומה',       scoreType:'d-movietitle', ...C('rgba(5,0,0,0.98)','2px solid rgba(239,68,68,0.6)','0 0 80px rgba(239,68,68,0.25)'), ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(3,0,0,0.97)') },
  { id:98, name:'Pendulum Extreme', category:'דרמה', desc:'מטוטלת ב-120° עם damping נמוך', scoreType:'d-pendulum',   ...C('rgba(8,18,32,0.98)','2px solid rgba(245,197,24,0.6)','0 0 80px rgba(245,197,24,0.25)'), ...E({scale:0.8,opacity:0},{scale:1,opacity:1},{type:'spring',stiffness:100,damping:8}) },
  { id:99, name:'Goal + Cyan',      category:'דרמה', desc:'פיצוץ שער עם cyan blast',       scoreType:'d-goal',       ...C('rgba(0,8,18,0.98)','2px solid rgba(34,211,238,0.8)','0 0 120px rgba(34,211,238,0.5)'), ...E({scale:0,opacity:0},{scale:1,opacity:1},{type:'spring',stiffness:500,damping:8},'rgba(0,4,12,0.95)') },
  { id:100, name:'Ultimate Drama',  category:'דרמה', desc:'נוקליאר + מטריקס + זהב',       scoreType:'d-nuke',       ...C('rgba(10,8,0,0.98)','2px solid rgba(245,197,24,0.9)','0 0 150px rgba(245,197,24,0.5), 0 0 300px rgba(239,68,68,0.15)'), ...E({scale:0,rotate:-20,opacity:0},{scale:1,rotate:0,opacity:1},{type:'spring',stiffness:300,damping:8},'rgba(5,4,0,0.97)') },
];

const ALL_STYLES = [...STYLES, ...STAGGER_STYLES, ...DRAMATIC_STYLES];

const CATEGORIES = ['הכל', 'כניסה', 'מספרים', 'עיצוב', 'מיוחד', 'סטאגר', 'דרמה'];

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
        <p className="text-slate-400 text-sm mt-1">100 סגנונות שונים — לחץ "הצג תצוגה מקדימה" לראות בגודל מלא</p>
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
