import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

const MOCK = {
  homeTla: 'BRA', awayTla: 'ARG',
  homeScore: 2, awayScore: 2,
  prevHome: 0, prevAway: 0,
  prediction: '1 - 2',
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
const SGoalExplode= makeStagger(()=>({scale:0,rotate:-15,opacity:0}), ()=>({scale:[0,1.6,0.85,1.1,1],rotate:[-15,10,-5,2,0],opacity:1}), i=>({duration:0.9,delay:i*0.15}));

// ─── Premium custom components ───────────────────────────────────────────

function CRTScore({ home, away }) {
  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <motion.div initial={{ scaleY:0.02, filter:'brightness(4) blur(2px)' }} animate={{ scaleY:1, filter:'brightness(1) blur(0px)' }} transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}>
        <span style={{ fontSize:52, fontWeight:900, fontFamily:'monospace', color:'#4ade80', textShadow:'0 0 8px #4ade80, 0 0 24px rgba(74,222,128,0.4)', letterSpacing:2 }}>
          {home}<span style={{ color:'#166534', margin:'0 12px' }}>-</span>{away}
        </span>
      </motion.div>
      <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.25) 3px,rgba(0,0,0,0.25) 4px)', pointerEvents:'none' }} />
    </div>
  );
}

function VHSScore({ home, away }) {
  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <motion.span initial={{ filter:'saturate(0) brightness(2.5)', skewX:6 }} animate={{ filter:'saturate(1) brightness(1)', skewX:0 }} transition={{ duration:0.7, ease:'easeOut' }} style={{ fontSize:52, fontWeight:900, display:'block' }}>
        <span style={{ color:'#fff' }}>{home}</span><span style={{ color:'#475569', margin:'0 12px' }}>-</span><span style={{ color:'#fff' }}>{away}</span>
      </motion.span>
      <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(transparent,transparent 2px,rgba(255,50,50,0.07) 2px,rgba(255,50,50,0.07) 3px,transparent 3px,transparent 5px,rgba(50,50,255,0.07) 5px,rgba(50,50,255,0.07) 6px)', pointerEvents:'none' }} />
    </div>
  );
}

function NeonSignOnScore({ home, away }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const delays = [80,100,60,140,80,350];
    const phases = [0,1,0,1,0,2];
    let i = 0;
    const run = () => {
      if (i >= phases.length) return;
      const d = delays[i] || 100;
      setTimeout(() => { setPh(phases[i]); i++; run(); }, d);
    };
    run();
  }, []);
  const col = ['transparent','rgba(240,171,252,0.2)','#f0abfc'][ph] ?? '#f0abfc';
  const sh = ph === 2 ? '0 0 10px #f0abfc, 0 0 28px rgba(240,171,252,0.6), 0 0 55px rgba(240,171,252,0.25)' : 'none';
  return (
    <span style={{ fontSize:52, fontWeight:900, fontFamily:'monospace', color:col, textShadow:sh, transition:'all 0.07s', letterSpacing:3 }}>
      {home}<span style={{ margin:'0 14px', color:ph===2?'#a855f7':'transparent' }}>-</span>{away}
    </span>
  );
}

function PolaroidScore({ home, away }) {
  return (
    <motion.span initial={{ filter:'sepia(1) brightness(0.4) contrast(0.5) blur(4px)', scale:0.92 }} animate={{ filter:'sepia(0) brightness(1) contrast(1) blur(0px)', scale:1 }} transition={{ duration:1.4, ease:'easeOut' }} style={{ fontSize:52, fontWeight:900, display:'inline-block' }}>
      <span style={{ color:'#fef3c7' }}>{home}</span><span style={{ color:'#78716c', margin:'0 12px' }}>-</span><span style={{ color:'#fef3c7' }}>{away}</span>
    </motion.span>
  );
}

function FilmBurnScore({ home, away }) {
  return (
    <motion.span initial={{ filter:'brightness(12) saturate(0)', scale:0.8 }} animate={{ filter:['brightness(12) saturate(0)','brightness(3) saturate(0.4)','brightness(1) saturate(1)'], scale:1 }} transition={{ duration:0.85, times:[0,0.25,1] }} style={{ fontSize:52, fontWeight:900, display:'inline-block' }}>
      <span style={{ color:'#fff' }}>{home}</span><span style={{ color:'#475569', margin:'0 12px' }}>-</span><span style={{ color:'#fff' }}>{away}</span>
    </motion.span>
  );
}

function NebulaScore({ home, away }) {
  return (
    <motion.span initial={{ opacity:0, scale:0.25, filter:'blur(30px)', color:'#a855f7' }} animate={{ opacity:1, scale:1, filter:'blur(0px)', color:'#e9d5ff' }} transition={{ duration:1.4, ease:[0.16,1,0.3,1] }} style={{ fontSize:52, fontWeight:900, display:'inline-block', textShadow:'0 0 40px rgba(168,85,247,0.7), 0 0 80px rgba(168,85,247,0.3)' }}>
      {home}<span style={{ color:'#6b21a8', margin:'0 12px' }}>-</span>{away}
    </motion.span>
  );
}

function StarWarpScore({ home, away }) {
  return (
    <motion.span initial={{ scaleX:5, scaleY:0.1, opacity:0, filter:'blur(8px) brightness(4)' }} animate={{ scaleX:1, scaleY:1, opacity:1, filter:'blur(0px) brightness(1)' }} transition={{ duration:0.55, ease:'easeOut' }} style={{ fontSize:52, fontWeight:900, display:'inline-block' }}>
      <span style={{ color:'#e0f2fe' }}>{home}</span><span style={{ color:'#475569', margin:'0 12px' }}>-</span><span style={{ color:'#e0f2fe' }}>{away}</span>
    </motion.span>
  );
}

function HologramScore({ home, away }) {
  const [scan, setScan] = useState(0);
  useEffect(() => {
    let f = 0;
    const iv = setInterval(() => { f += 5; setScan(f % 80); }, 30);
    setTimeout(() => clearInterval(iv), 2500);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <motion.span initial={{ rotateX:75, opacity:0, filter:'blur(8px)' }} animate={{ rotateX:0, opacity:1, filter:'blur(0px)' }} transition={{ duration:0.7, ease:'easeOut' }} style={{ fontSize:52, fontWeight:900, display:'inline-block', perspective:400, color:'#22d3ee', textShadow:'0 0 10px #22d3ee, 0 0 30px rgba(34,211,238,0.5)', letterSpacing:2 }}>
        {home}<span style={{ color:'#164e63', margin:'0 12px' }}>-</span>{away}
      </motion.span>
      <div style={{ position:'absolute', top:scan+'%', left:'-5%', right:'-5%', height:2, background:'rgba(34,211,238,0.45)', filter:'blur(1px)', pointerEvents:'none' }} />
    </div>
  );
}

function ChromaticScore({ home, away }) {
  const txt = `${home} - ${away}`;
  const s = { position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, fontWeight:900, whiteSpace:'nowrap' };
  return (
    <div style={{ position:'relative', fontSize:52, fontWeight:900, minWidth:140, height:64 }}>
      <motion.div initial={{ x:-18, opacity:0 }} animate={{ x:0, opacity:0.5 }} transition={{ duration:0.7 }} style={{ ...s, color:'#ef4444' }}>{txt}</motion.div>
      <motion.div initial={{ x:18, opacity:0 }} animate={{ x:0, opacity:0.5 }} transition={{ duration:0.7 }} style={{ ...s, color:'#22d3ee' }}>{txt}</motion.div>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55, duration:0.35 }} style={{ ...s, color:'#fff' }}>{txt}</motion.div>
    </div>
  );
}

function ScanlineRevealScore({ home, away }) {
  return (
    <div style={{ position:'relative', overflow:'hidden', display:'inline-block' }}>
      <span style={{ fontSize:52, fontWeight:900, color:'#fff', display:'block', lineHeight:1 }}>
        {home}<span style={{ color:'#475569', margin:'0 12px' }}>-</span>{away}
      </span>
      <motion.div initial={{ scaleY:1, transformOrigin:'top center' }} animate={{ scaleY:0 }} transition={{ duration:0.65, ease:'easeInOut', delay:0.2 }} style={{ position:'absolute', inset:'-4px', background:'rgba(3,13,26,0.99)' }} />
    </div>
  );
}

function EchoScore({ home, away }) {
  const txt = `${home} - ${away}`;
  return (
    <div style={{ position:'relative', fontSize:52, fontWeight:900, minWidth:140, height:64 }}>
      {[3,2,1,0].map(i => (
        <motion.div key={i} initial={{ x:(3-i)*28, y:(3-i)*(-18), opacity:0, scale:1+(3-i)*0.1 }} animate={{ x:0, y:0, opacity:i===0?1:0, scale:1 }} transition={{ duration:0.75, delay:i*0.1, ease:'easeOut' }} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:i===0?'#fff':'rgba(255,255,255,0.12)', whiteSpace:'nowrap' }}>
          {txt}
        </motion.div>
      ))}
    </div>
  );
}

function VariableWeightScore({ home, away }) {
  return (
    <motion.span initial={{ fontWeight:100, letterSpacing:18, opacity:0 }} animate={{ fontWeight:900, letterSpacing:-2, opacity:1 }} transition={{ duration:0.95, ease:[0.22,1,0.36,1] }} style={{ fontSize:52, display:'inline-block' }}>
      <span style={{ color:'#fff' }}>{home}</span><span style={{ color:'#475569', margin:'0 8px' }}>-</span><span style={{ color:'#fff' }}>{away}</span>
    </motion.span>
  );
}

function OutlineScore({ home, away }) {
  const parts = [String(home),'-',String(away)];
  return (
    <span style={{ fontSize:52, fontWeight:900, display:'flex', alignItems:'center', gap:14 }}>
      {parts.map((p,i) => (
        <motion.span key={i}
          initial={{ color:'transparent', textShadow:`0 0 0 ${i===1?'#475569':'#fff'}, 0 0 22px ${i===1?'#475569':'#fff'}` }}
          animate={{ color:i===1?'#475569':'#fff', textShadow:'none' }}
          transition={{ duration:0.6, delay:0.2+i*0.28, ease:'easeOut' }}
          style={{ display:'inline-block' }}
        >{p}</motion.span>
      ))}
    </span>
  );
}

function ShadowLiftScore({ home, away }) {
  return (
    <motion.span initial={{ color:'rgba(255,255,255,0.03)', y:-18 }} animate={{ color:'#fff', y:0 }} transition={{ duration:0.85, ease:[0.16,1,0.3,1] }} style={{ fontSize:52, fontWeight:900, display:'inline-block' }}>
      {home}<span style={{ color:'#475569', margin:'0 12px' }}>-</span>{away}
    </motion.span>
  );
}

function EmbossScore({ home, away }) {
  return (
    <motion.span
      initial={{ color:'rgba(255,255,255,0.03)', textShadow:'none' }}
      animate={{ color:['rgba(255,255,255,0.03)','#fbbf24'], textShadow:['none','3px 3px 6px rgba(0,0,0,0.9), -1px -1px 3px rgba(255,255,255,0.15), 0 0 30px rgba(245,197,24,0.4)'] }}
      transition={{ duration:1.1 }}
      style={{ fontSize:52, fontWeight:900, display:'inline-block', letterSpacing:-1 }}
    >
      {home}<span style={{ color:'#78350f', margin:'0 12px' }}>-</span>{away}
    </motion.span>
  );
}

function ChromeScore({ home, away }) {
  return (
    <motion.div initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] }} style={{ fontSize:52, fontWeight:900, display:'inline-block', background:'linear-gradient(180deg,#fff 0%,#94a3b8 30%,#fff 52%,#64748b 72%,#e2e8f0 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:-1 }}>
      {home} - {away}
    </motion.div>
  );
}

// ─── Premium factory variants ─────────────────────────────────────────────
const SPrism      = makeStagger(()=>({scale:0,opacity:0,rotate:120}), ()=>({scale:1,opacity:1,rotate:0}), i=>({type:'spring',stiffness:220,damping:14,delay:i*0.2}), ['#f97316','#475569','#22d3ee']);
const SSqueeze    = makeStagger(()=>({scaleX:0.01,opacity:0}), ()=>({scaleX:1,opacity:1}), i=>({type:'spring',stiffness:300,damping:18,delay:i*0.22}));
const SStretchY   = makeStagger(()=>({scaleY:0.01,opacity:0}), ()=>({scaleY:1,opacity:1}), i=>({type:'spring',stiffness:280,damping:16,delay:i*0.2}));
const SConstrict  = makeStagger(()=>({scaleX:0.01,scaleY:3,opacity:0}), ()=>({scaleX:1,scaleY:1,opacity:1}), i=>({type:'spring',stiffness:200,damping:15,delay:i*0.22}));
const SFatPop     = makeStagger(()=>({scaleX:4,scaleY:0.01,opacity:0}), ()=>({scaleX:1,scaleY:1,opacity:1}), i=>({type:'spring',stiffness:180,damping:14,delay:i*0.2}));
const SDiagTL     = makeStagger(()=>({x:-80,y:-80,opacity:0,rotate:-30,scale:0.5}), ()=>({x:0,y:0,opacity:1,rotate:0,scale:1}), i=>({type:'spring',stiffness:240,damping:16,delay:i*0.2}));
const SDiagBR     = makeStagger(()=>({x:80,y:80,opacity:0,rotate:30,scale:0.5}), ()=>({x:0,y:0,opacity:1,rotate:0,scale:1}), i=>({type:'spring',stiffness:240,damping:16,delay:i*0.2}));
const SDiagTR     = makeStagger(()=>({x:80,y:-80,opacity:0,rotate:30,scale:0.5}), ()=>({x:0,y:0,opacity:1,rotate:0,scale:1}), i=>({type:'spring',stiffness:240,damping:16,delay:i*0.2}));
const SDiagBL     = makeStagger(()=>({x:-80,y:80,opacity:0,rotate:-30,scale:0.5}), ()=>({x:0,y:0,opacity:1,rotate:0,scale:1}), i=>({type:'spring',stiffness:240,damping:16,delay:i*0.2}));
const SZigZag     = makeStagger((i)=>({x:i%2===0?-90:90,y:i*(-35),opacity:0}), ()=>({x:0,y:0,opacity:1}), i=>({type:'spring',stiffness:240,damping:16,delay:i*0.18}));
const SBigShrink  = makeStagger(()=>({scale:4,opacity:0}), ()=>({scale:1,opacity:1}), i=>({type:'spring',stiffness:150,damping:12,delay:i*0.25}));
const SGlowPurple = makeStagger(()=>({opacity:0,scale:0.4,filter:'blur(22px)'}), ()=>({opacity:1,scale:1,filter:'blur(0px)'}), i=>({duration:0.75,ease:'easeOut',delay:i*0.3}), ['#f0abfc','#475569','#f0abfc']);
const SPerspL     = makeStagger(()=>({rotateY:-70,opacity:0,scale:0.5}), ()=>({rotateY:0,opacity:1,scale:1}), i=>({duration:0.55,ease:'easeOut',delay:i*0.25}));
const SPerspR     = makeStagger(()=>({rotateY:70,opacity:0,scale:0.5}), ()=>({rotateY:0,opacity:1,scale:1}), i=>({duration:0.55,ease:'easeOut',delay:i*0.25}));
const SPerspT     = makeStagger(()=>({rotateX:70,opacity:0,scale:0.5}), ()=>({rotateX:0,opacity:1,scale:1}), i=>({duration:0.55,ease:'easeOut',delay:i*0.25}));
const SPerspB     = makeStagger(()=>({rotateX:-70,opacity:0,scale:0.5}), ()=>({rotateX:0,opacity:1,scale:1}), i=>({duration:0.55,ease:'easeOut',delay:i*0.25}));
const STiltL      = makeStagger(()=>({rotate:45,opacity:0,scale:0.5,x:-30}), ()=>({rotate:0,opacity:1,scale:1,x:0}), i=>({type:'spring',stiffness:250,damping:14,delay:i*0.2}));
const STiltR      = makeStagger(()=>({rotate:-45,opacity:0,scale:0.5,x:30}), ()=>({rotate:0,opacity:1,scale:1,x:0}), i=>({type:'spring',stiffness:250,damping:14,delay:i*0.2}));
const SFlyFast    = makeStagger(()=>({x:-300,opacity:0,scale:1.5}), ()=>({x:0,opacity:1,scale:1}), i=>({type:'spring',stiffness:200,damping:14,delay:i*0.1}));
const SBreathIn   = makeStagger(()=>({scale:0.01,opacity:0}), ()=>({scale:[0.01,1.45,0.88,1.1,1],opacity:[0,1,1,1,1]}), i=>({duration:1.0,delay:i*0.28}));
const SRipple     = makeStagger((i)=>({scale:i===1?1:0,opacity:0}), ()=>({scale:1,opacity:1}), i=>({type:'spring',stiffness:300,damping:18,delay:i===1?0:0.35+Math.abs(i-1)*0.2}));
const SFloatUp    = makeStagger(()=>({y:30,opacity:0,filter:'blur(8px)'}), ()=>({y:0,opacity:1,filter:'blur(0px)'}), i=>({duration:0.72,ease:'easeOut',delay:i*0.28}), ['#c7d2fe','#475569','#c7d2fe']);
const SAltWave    = makeStagger((i)=>({y:i%2===0?60:-60,opacity:0}), ()=>({y:0,opacity:1}), i=>({type:'spring',stiffness:260,damping:16,delay:i*0.22}));
const SFireworks  = makeStagger(()=>({scale:0,rotate:720,opacity:0}), ()=>({scale:1,rotate:0,opacity:1}), i=>({type:'spring',stiffness:160,damping:12,delay:i*0.25}));
const STelegraph  = makeStagger(()=>({opacity:0}), ()=>({opacity:[0,1,0,1,0,1,0,1,1]}), i=>({duration:0.9,delay:i*0.35}));
const SGoldRushS  = makeStagger(()=>({y:-60,opacity:0}), ()=>({y:0,opacity:1}), i=>({duration:0.6,ease:[0.22,1,0.36,1],delay:i*0.2}), ['#fbbf24','#92400e','#fbbf24']);
const SDriftR     = makeStagger(()=>({x:40,rotate:10,opacity:0}), ()=>({x:0,rotate:0,opacity:1}), i=>({type:'spring',stiffness:200,damping:15,delay:i*0.28}));
const SLiquid     = makeStagger(()=>({scaleX:0.01,scaleY:3,skewX:15,opacity:0}), ()=>({scaleX:1,scaleY:1,skewX:0,opacity:1}), i=>({duration:0.75,ease:[0.22,1,0.36,1],delay:i*0.22}));
const SBlinkOn    = makeStagger(()=>({opacity:0,scale:1.1}), ()=>({opacity:[0,1,0,0,1,0,1,0,1,1],scale:1}), i=>({duration:1.2,delay:i*0.2}));
const SFall3D     = makeStagger(()=>({rotateX:-90,y:-40,opacity:0}), ()=>({rotateX:0,y:0,opacity:1}), i=>({type:'spring',stiffness:200,damping:16,delay:i*0.25}));

// ─── Score counter components (0-0 → real score) ────────────────────────

function buildGoalSeq(home, away) {
  const seq = []; let h = 0, a = 0;
  for (let i = 0; i < home + away; i++) {
    if (h < home && (a >= away || i % 2 === 0)) h++; else a++;
    seq.push({ h, a });
  }
  return seq;
}

// 1. Odometer Roll — digit strip scrolls upward like a car odometer
function OdometerScore({ home, away }) {
  function OdometerDigit({ target, delay = 0 }) {
    return (
      <div style={{ height: 66, width: 44, overflow: 'hidden', position: 'relative', display: 'inline-block' }}>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -(target * 66) }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
        >
          {[0,1,2,3,4,5,6,7,8,9].map(d => (
            <div key={d} style={{ height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{d}</div>
          ))}
        </motion.div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <OdometerDigit target={home} delay={0.4} />
      <span style={{ color: '#475569', fontSize: 52, fontWeight: 900, lineHeight: '66px', display: 'inline-block' }}>-</span>
      <OdometerDigit target={away} delay={0.8} />
    </div>
  );
}

// 2. Flip Board (Solari airport board)
function FlipBoardScore({ home, away }) {
  function FlipDigit({ target, startDelay = 0 }) {
    const [cur, setCur] = useState(0);
    const [phase, setPhase] = useState('idle');

    useEffect(() => {
      if (target === 0) return;
      const doFlip = (to) => {
        setTimeout(() => {
          setPhase('hide');
          setTimeout(() => { setCur(to); setPhase('show'); setTimeout(() => { setPhase('idle'); if (to < target) doFlip(to + 1); }, 180); }, 160);
        }, to === 1 ? startDelay : 550);
      };
      doFlip(1);
    }, []);

    return (
      <div style={{ width: 60, height: 78, background: 'linear-gradient(180deg,#1e293b,#0f172a)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden' }}>
        <motion.span
          animate={{ rotateX: phase === 'hide' ? -90 : 0, opacity: phase === 'hide' ? 0 : 1, scale: phase === 'show' ? [0.85, 1] : 1 }}
          transition={{ duration: 0.16 }}
          style={{ fontSize: 50, fontWeight: 900, color: '#fbbf24', display: 'inline-block', fontFamily: 'monospace' }}
        >{cur}</motion.span>
        <div style={{ position: 'absolute', top: '50%', left: 4, right: 4, height: 1, background: 'rgba(0,0,0,0.6)', pointerEvents: 'none' }} />
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <FlipDigit target={home} startDelay={500} />
      <span style={{ color: '#64748b', fontSize: 44, fontWeight: 900 }}>-</span>
      <FlipDigit target={away} startDelay={home * 650 + 500} />
    </div>
  );
}

// 3. Goal Replay Sequence — flash + increment per goal
function GoalReplayScore({ home, away }) {
  const [h, setH] = useState(0);
  const [a, setA] = useState(0);
  const [flash, setFlash] = useState(false);
  const [side, setSide] = useState(null);

  useEffect(() => {
    const seq = buildGoalSeq(home, away);
    seq.forEach(({ h: nh, a: na }, i) => {
      const prev = i > 0 ? seq[i-1] : { h: 0, a: 0 };
      const sc = nh > prev.h ? 'h' : 'a';
      setTimeout(() => {
        setSide(sc); setFlash(true);
        setTimeout(() => { setH(nh); setA(na); setFlash(false); }, 320);
      }, 700 + i * 950);
    });
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <AnimatePresence>
        {flash && (
          <motion.div key="fl" initial={{ scale: 0.5, opacity: 0.9 }} animate={{ scale: 5, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}
            style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(239,68,68,0.9) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 10 }} />
        )}
      </AnimatePresence>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 52, fontWeight: 900 }}>
        <motion.span animate={{ scale: flash && side === 'h' ? 1.5 : 1, color: flash && side === 'h' ? '#ef4444' : '#fff' }} style={{ display: 'inline-block', minWidth: 38, textAlign: 'center' }}>{h}</motion.span>
        <span style={{ color: '#475569' }}>-</span>
        <motion.span animate={{ scale: flash && side === 'a' ? 1.5 : 1, color: flash && side === 'a' ? '#ef4444' : '#fff' }} style={{ display: 'inline-block', minWidth: 38, textAlign: 'center' }}>{a}</motion.span>
      </div>
    </div>
  );
}

// 4. Typewriter Mistake — types score, corrects one by one
function TypewriterMistakeScore({ home, away }) {
  const [h, setH] = useState(0);
  const [a, setA] = useState(0);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const seq = buildGoalSeq(home, away);
    seq.forEach(({ h: nh, a: na }, i) => { setTimeout(() => { setH(nh); setA(na); }, 500 + i * 650); });
    const iv = setInterval(() => setBlink(p => !p), 530);
    return () => clearInterval(iv);
  }, []);

  return (
    <span style={{ fontSize: 52, fontWeight: 900, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 10 }}>
      <motion.span key={`h${h}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#fff', minWidth: 38, display: 'inline-block', textAlign: 'center' }}>{h}</motion.span>
      <span style={{ color: '#475569' }}>-</span>
      <motion.span key={`a${a}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#fff', minWidth: 38, display: 'inline-block', textAlign: 'center' }}>{a}</motion.span>
      <span style={{ color: '#4ade80', opacity: blink ? 1 : 0, marginLeft: -6, fontSize: 42 }}>|</span>
    </span>
  );
}

// 5. Clock Tick — digit spins fast then decelerates to target
function ClockTickScore({ home, away }) {
  function TickDigit({ target, delay = 0 }) {
    const [val, setVal] = useState(0);
    const ref = useRef(0);

    useEffect(() => {
      const tos = [];
      let t = delay;
      const total = 10 + target;
      for (let i = 0; i < total; i++) {
        const d = t;
        tos.push(setTimeout(() => { ref.current = (ref.current + 1) % 10; setVal(ref.current); }, d));
        t += Math.min(55 + i * 22, 320);
      }
      tos.push(setTimeout(() => setVal(target), t + 80));
      return () => tos.forEach(clearTimeout);
    }, []);

    return (
      <motion.span key={val} initial={{ y: -14, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.08 }}
        style={{ fontSize: 52, fontWeight: 900, color: '#fbbf24', display: 'inline-block', minWidth: 38, textAlign: 'center', fontFamily: 'monospace' }}>
        {val}
      </motion.span>
    );
  }
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <TickDigit target={home} delay={300} />
      <span style={{ color: '#475569', fontSize: 52, fontWeight: 900 }}>-</span>
      <TickDigit target={away} delay={650} />
    </span>
  );
}

// 6. Sand Fall — 0 dissolves down, target reforms from above
function SandFallScore({ home, away }) {
  function DissolveDigit({ target, delay = 0 }) {
    const [phase, setPhase] = useState('zero'); // zero → dissolve → reform

    useEffect(() => {
      setTimeout(() => setPhase('dissolve'), delay);
      setTimeout(() => setPhase('reform'), delay + 420);
    }, []);

    return (
      <div style={{ position: 'relative', width: 42, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span
          animate={phase !== 'zero' ? { y: 50, opacity: 0, scale: 0.4, filter: 'blur(6px)' } : { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.38 }}
          style={{ position: 'absolute', fontSize: 52, fontWeight: 900, color: '#94a3b8' }}
        >0</motion.span>
        <motion.span
          initial={{ y: -50, opacity: 0, scale: 0.4, filter: 'blur(6px)' }}
          animate={phase === 'reform' ? { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' } : { y: -50, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', fontSize: 52, fontWeight: 900, color: '#fff' }}
        >{target}</motion.span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <DissolveDigit target={home} delay={400} />
      <span style={{ color: '#475569', fontSize: 52, fontWeight: 900 }}>-</span>
      <DissolveDigit target={away} delay={900} />
    </div>
  );
}

// 7. Scratch Card — grey cover peels back left→right to reveal score
function ScratchCardScore({ home, away }) {
  const [scratched, setScratched] = useState(false);
  useEffect(() => { setTimeout(() => setScratched(true), 700); }, []);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ fontSize: 52, fontWeight: 900 }}>
        <span style={{ color: '#fbbf24' }}>{home}</span>
        <span style={{ color: '#475569', margin: '0 12px' }}>-</span>
        <span style={{ color: '#fbbf24' }}>{away}</span>
      </span>
      <motion.div
        initial={{ scaleX: 1, transformOrigin: 'right center' }}
        animate={{ scaleX: scratched ? 0 : 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', inset: '-6px', borderRadius: 8, background: 'repeating-linear-gradient(135deg, #334155 0px, #334155 10px, #3f4e63 10px, #3f4e63 20px)', pointerEvents: 'none' }}
      />
    </div>
  );
}

// 8. Binary Decode — shows binary → flicker → decimal
function BinaryDecodeScore({ home, away }) {
  const toBin = n => n.toString(2).padStart(4, '0');
  const [phase, setPhase] = useState('binary');

  useEffect(() => {
    setTimeout(() => setPhase('flicker'), 1000);
    setTimeout(() => setPhase('number'), 1700);
  }, []);

  if (phase !== 'number') {
    return (
      <motion.div
        animate={phase === 'flicker' ? { opacity: [1, 0.2, 1, 0.3, 1, 0.4, 1] } : { opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ fontSize: 26, fontWeight: 900, fontFamily: 'monospace', color: phase === 'flicker' ? '#fbbf24' : '#4ade80', letterSpacing: 3, textAlign: 'center' }}
      >
        {toBin(home)} — {toBin(away)}
        <div style={{ fontSize: 11, color: '#64748b', letterSpacing: 1, marginTop: 4 }}>DECODING…</div>
      </motion.div>
    );
  }
  return (
    <motion.span initial={{ scale: 0.5, opacity: 0, filter: 'blur(8px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}
      style={{ fontSize: 52, fontWeight: 900, color: '#4ade80', textShadow: '0 0 20px rgba(74,222,128,0.5)', fontFamily: 'monospace' }}>
      {home}<span style={{ color: '#166534', margin: '0 12px' }}>-</span>{away}
    </motion.span>
  );
}

// 9. Scoreboard Flash — old board blinks 0-0 then snaps to score
function ScoreboardFlashScore({ home, away }) {
  const [blinks, setBlinks] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => {
      n++; setBlinks(n);
      if (n >= 6) { clearInterval(iv); setTimeout(() => setRevealed(true), 150); }
    }, 240);
    return () => clearInterval(iv);
  }, []);

  const isOn = blinks % 2 === 0;
  if (!revealed) {
    return (
      <span style={{ fontSize: 52, fontWeight: 900, fontFamily: 'monospace', opacity: isOn ? 1 : 0.08, transition: 'opacity 0.08s' }}>
        <span style={{ color: '#fff' }}>0</span><span style={{ color: '#475569', margin: '0 10px' }}>-</span><span style={{ color: '#fff' }}>0</span>
      </span>
    );
  }
  return (
    <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 350, damping: 14 }}
      style={{ fontSize: 52, fontWeight: 900, fontFamily: 'monospace' }}>
      <span style={{ color: '#fbbf24' }}>{home}</span>
      <span style={{ color: '#475569', margin: '0 10px' }}>-</span>
      <span style={{ color: '#fbbf24' }}>{away}</span>
    </motion.span>
  );
}

// 10. Heart Rate Monitor — ECG pulse per goal, digit jumps up
function HeartRateScore({ home, away }) {
  const [h, setH] = useState(0);
  const [a, setA] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [side, setSide] = useState(null);

  useEffect(() => {
    const seq = buildGoalSeq(home, away);
    seq.forEach(({ h: nh, a: na }, i) => {
      const prev = i > 0 ? seq[i-1] : { h: 0, a: 0 };
      const sc = nh > prev.h ? 'h' : 'a';
      setTimeout(() => {
        setSide(sc); setPulse(true);
        setTimeout(() => { setH(nh); setA(na); setPulse(false); }, 380);
      }, 650 + i * 1000);
    });
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <AnimatePresence>
        {pulse && (
          <motion.div key="ecg" initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}
            style={{ position: 'absolute', top: '50%', left: '-35px', right: '-35px', height: 2, background: 'linear-gradient(90deg,transparent,#ef4444 25%,#fbbf24 50%,#ef4444 75%,transparent)', transformOrigin: 'left center', filter: 'blur(1px)' }} />
        )}
      </AnimatePresence>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 52, fontWeight: 900 }}>
        <motion.span animate={{ scale: pulse && side === 'h' ? [1, 1.6, 1] : 1 }} transition={{ duration: 0.3 }} style={{ color: '#fff', display: 'inline-block', minWidth: 38, textAlign: 'center' }}>{h}</motion.span>
        <span style={{ color: '#475569' }}>-</span>
        <motion.span animate={{ scale: pulse && side === 'a' ? [1, 1.6, 1] : 1 }} transition={{ duration: 0.3 }} style={{ color: '#fff', display: 'inline-block', minWidth: 38, textAlign: 'center' }}>{a}</motion.span>
      </div>
    </div>
  );
}

// ─── 20 More Counter Styles ──────────────────────────────────────────────

// 11. Gas Pump — mechanical digit boxes with green LED feel
function GasPumpScore({ home, away }) {
  function PumpDigit({ target, delay = 0 }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
      if (!target) return;
      const ts = [];
      for (let i = 1; i <= target; i++) ts.push(setTimeout(() => setVal(i), delay + i * 320));
      return () => ts.forEach(clearTimeout);
    }, []);
    return (
      <div style={{ width: 52, height: 72, background: '#050505', border: '2px solid #1f2937', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.6),transparent 40%,transparent 60%,rgba(0,0,0,0.6))', zIndex: 1, pointerEvents: 'none' }} />
        <motion.span key={val} initial={{ y: -22, opacity: 0.5 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.1, ease: 'easeOut' }}
          style={{ fontSize: 48, fontWeight: 900, color: '#4ade80', fontFamily: 'monospace', textShadow: '0 0 10px rgba(74,222,128,0.7)', zIndex: 2 }}>{val}</motion.span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <PumpDigit target={home} delay={300} />
      <span style={{ color: '#1f2937', fontSize: 44, fontWeight: 900 }}>-</span>
      <PumpDigit target={away} delay={home * 360 + 450} />
    </div>
  );
}

// 12. Dice Roll — die faces change rapidly then settle
function DiceRollScore({ home, away }) {
  function Die({ target, delay = 0 }) {
    const [face, setFace] = useState(1);
    const [done, setDone] = useState(false);
    useEffect(() => {
      const t = setTimeout(() => {
        const speeds = [55,60,70,85,105,135,175,225,290,380];
        let i = 0;
        const tick = () => {
          setFace(f => (f % 6) + 1);
          if (i >= speeds.length) { setFace(Math.max(target, 1)); setDone(true); return; }
          setTimeout(tick, speeds[i++]);
        };
        tick();
      }, delay);
      return () => clearTimeout(t);
    }, []);
    const dotMap = { 1:[[50,50]], 2:[[28,28],[72,72]], 3:[[28,28],[50,50],[72,72]], 4:[[28,28],[72,28],[28,72],[72,72]], 5:[[28,28],[72,28],[50,50],[28,72],[72,72]], 6:[[28,20],[72,20],[28,50],[72,50],[28,80],[72,80]] };
    const pts = dotMap[face] || dotMap[1];
    return (
      <motion.div animate={{ rotate: done ? 0 : [0,12,-12,9,-7,4,0] }} transition={{ duration: 0.7 }}
        style={{ width: 66, height: 66, background: '#f8fafc', borderRadius: 10, position: 'relative', boxShadow: done ? '0 0 20px rgba(99,102,241,0.5), 2px 4px 10px rgba(0,0,0,0.5)' : '2px 4px 10px rgba(0,0,0,0.5)', border: '1px solid #e2e8f0', transition: 'box-shadow 0.3s' }}>
        {pts.map(([x, y], i) => (
          <div key={i} style={{ position: 'absolute', width: 11, height: 11, borderRadius: '50%', background: '#1e293b', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }} />
        ))}
      </motion.div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Die target={home} delay={300} />
      <span style={{ color: '#475569', fontSize: 40, fontWeight: 900 }}>-</span>
      <Die target={away} delay={950} />
    </div>
  );
}

// 13. Traffic Light — red → yellow → green, then score bursts in
function TrafficLightScore({ home, away }) {
  const [light, setLight] = useState('red');
  const [show, setShow] = useState(false);
  useEffect(() => {
    const ts = [setTimeout(() => setLight('yellow'), 800), setTimeout(() => setLight('green'), 1500), setTimeout(() => setShow(true), 1800)];
    return () => ts.forEach(clearTimeout);
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', gap: 10, padding: '8px 14px', background: '#111', borderRadius: 22, border: '2px solid #1f2937' }}>
        {['red','yellow','green'].map(c => (
          <motion.div key={c}
            animate={{ opacity: light === c ? 1 : 0.15, boxShadow: light === c ? `0 0 16px 5px ${c === 'red' ? '#ef4444' : c === 'yellow' ? '#fbbf24' : '#4ade80'}` : 'none' }}
            style={{ width: 20, height: 20, borderRadius: '50%', background: c === 'red' ? '#ef4444' : c === 'yellow' ? '#fbbf24' : '#4ade80' }} />
        ))}
      </div>
      <AnimatePresence>
        {show && (
          <motion.span key="s" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 450, damping: 14 }}
            style={{ fontSize: 52, fontWeight: 900, color: '#4ade80', textShadow: '0 0 24px rgba(74,222,128,0.55)' }}>
            {home}<span style={{ color: '#1a3a22', margin: '0 10px' }}>-</span>{away}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// 14. Lottery Balls — balls pop up for each goal, then final score
function LotteryBallsScore({ home, away }) {
  const [balls, setBalls] = useState([]);
  useEffect(() => {
    const seq = buildGoalSeq(home, away);
    seq.forEach(({ h: nh, a: na }, i) => {
      const prev = i > 0 ? seq[i - 1] : { h: 0, a: 0 };
      const side = nh > prev.h ? 'h' : 'a';
      setTimeout(() => setBalls(b => [...b, { id: i, side, num: i + 1 }]), 500 + i * 750);
    });
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, minHeight: 52, alignItems: 'center' }}>
        {balls.map(b => (
          <motion.div key={b.id} initial={{ scale: 0, y: 28 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 14 }}
            style={{ width: 46, height: 46, borderRadius: '50%', background: b.side === 'h' ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : 'linear-gradient(135deg,#ef4444,#b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.45)', border: '2px solid rgba(255,255,255,0.2)' }}>
            <span style={{ color: '#fff', fontSize: 17, fontWeight: 900 }}>{b.num}</span>
          </motion.div>
        ))}
      </div>
      {balls.length === home + away && (
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 250, damping: 14 }}
          style={{ fontSize: 48, fontWeight: 900, color: '#fff' }}>
          {home}<span style={{ color: '#334155', margin: '0 10px' }}>-</span>{away}
        </motion.span>
      )}
    </div>
  );
}

// 15. Roman Numerals — shows Roman then morphs to Arabic
function RomanNumeralScore({ home, away }) {
  const toRoman = n => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][n] || String(n);
  const [phase, setPhase] = useState('roman');
  useEffect(() => {
    const ts = [setTimeout(() => setPhase('fade'), 1400), setTimeout(() => setPhase('arabic'), 1900)];
    return () => ts.forEach(clearTimeout);
  }, []);
  if (phase !== 'arabic') {
    return (
      <motion.span animate={phase === 'fade' ? { opacity: 0, scale: 0.8, filter: 'blur(6px)' } : { opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        style={{ fontSize: 40, fontWeight: 900, color: '#fbbf24', letterSpacing: 5, fontFamily: 'serif', textShadow: '0 0 20px rgba(251,191,36,0.4)' }}>
        {toRoman(home)} · {toRoman(away)}
      </motion.span>
    );
  }
  return (
    <motion.span initial={{ opacity: 0, scale: 1.5, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      style={{ fontSize: 52, fontWeight: 900, color: '#fff' }}>
      {home}<span style={{ color: '#475569', margin: '0 12px' }}>-</span>{away}
    </motion.span>
  );
}

// 16. Morse Code — dots/dashes blink then number emerges
function MorseCodeScore({ home, away }) {
  const morse = { 0:'- - - - -', 1:'. - - - -', 2:'. . - - -', 3:'. . . - -', 4:'. . . . -', 5:'. . . . .', 6:'- . . . .', 7:'- - . . .', 8:'- - - . .', 9:'- - - - .' };
  const [phase, setPhase] = useState('morse');
  useEffect(() => {
    const ts = [setTimeout(() => setPhase('decode'), 1400), setTimeout(() => setPhase('number'), 2000)];
    return () => ts.forEach(clearTimeout);
  }, []);
  if (phase !== 'number') {
    return (
      <div style={{ textAlign: 'center' }}>
        <motion.div animate={phase === 'decode' ? { opacity: [1, 0.3, 1, 0.2, 0] } : { opacity: 1 }} transition={{ duration: 0.55 }}
          style={{ fontSize: 20, letterSpacing: 5, color: '#22d3ee', fontFamily: 'monospace', lineHeight: 1.8 }}>
          <div>{morse[home]}</div>
          <div style={{ color: '#475569', fontSize: 12, letterSpacing: 2 }}>— · —</div>
          <div>{morse[away]}</div>
        </motion.div>
      </div>
    );
  }
  return (
    <motion.span initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 280, damping: 15 }}
      style={{ fontSize: 52, fontWeight: 900, color: '#22d3ee', textShadow: '0 0 24px rgba(34,211,238,0.45)' }}>
      {home}<span style={{ color: '#164e63', margin: '0 12px' }}>-</span>{away}
    </motion.span>
  );
}

// 17. Thermometer — bars rise from 0 to goal count
function ThermometerScore({ home, away }) {
  const max = Math.max(home, away, 1);
  const pct = n => `${(n / max) * 82}%`;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span style={{ color: '#64748b', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{MOCK.homeTla}</span>
        <div style={{ width: 28, height: 84, background: 'rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.08)' }}>
          <motion.div initial={{ height: 0 }} animate={{ height: pct(home) }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg,#60a5fa,#1d4ed8)', borderRadius: 14 }} />
        </div>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, type: 'spring', stiffness: 320, damping: 14 }}
          style={{ fontSize: 38, fontWeight: 900, color: '#60a5fa' }}>{home}</motion.span>
      </div>
      <span style={{ color: '#334155', fontSize: 38, fontWeight: 900, paddingBottom: 10 }}>-</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span style={{ color: '#64748b', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{MOCK.awayTla}</span>
        <div style={{ width: 28, height: 84, background: 'rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.08)' }}>
          <motion.div initial={{ height: 0 }} animate={{ height: pct(away) }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg,#f87171,#b91c1c)', borderRadius: 14 }} />
        </div>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.0, type: 'spring', stiffness: 320, damping: 14 }}
          style={{ fontSize: 38, fontWeight: 900, color: '#f87171' }}>{away}</motion.span>
      </div>
    </div>
  );
}

// 18. ATM Display — sequential machine messages then score
function ATMDisplayScore({ home, away }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const ts = [setTimeout(() => setStep(1), 700), setTimeout(() => setStep(2), 1400)];
    return () => ts.forEach(clearTimeout);
  }, []);
  const lines = ['PROCESSING…', 'SCORE FOUND ✓', null];
  return (
    <div style={{ background: '#001400', border: '2px solid #14532d', borderRadius: 6, padding: '14px 22px', fontFamily: 'monospace', minWidth: 210, textAlign: 'center' }}>
      {step < 2 ? (
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          style={{ fontSize: 14, color: '#4ade80', letterSpacing: 3 }}>{lines[step]}</motion.div>
      ) : (
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 14 }}>
          <div style={{ fontSize: 10, color: '#166534', letterSpacing: 3, marginBottom: 6 }}>SCORE CONFIRMED</div>
          <div style={{ fontSize: 50, fontWeight: 900, color: '#4ade80', textShadow: '0 0 14px rgba(74,222,128,0.55)' }}>{home} - {away}</div>
        </motion.div>
      )}
    </div>
  );
}

// 19. Safe Dial — combo lock dials spin then click to number
function SafeDialScore({ home, away }) {
  function Dial({ target, delay = 0 }) {
    const [cur, setCur] = useState('0');
    const [settled, setSettled] = useState(false);
    const ref = useRef(0);
    useEffect(() => {
      const t = setTimeout(() => {
        let iter = 0;
        const total = 14 + target * 3;
        const tick = () => {
          if (iter >= total) { setCur(String(target)); setSettled(true); return; }
          ref.current = (ref.current + 1) % 10;
          setCur(String(ref.current));
          iter++;
          setTimeout(tick, Math.min(40 + iter * 12, 240));
        };
        tick();
      }, delay);
      return () => clearTimeout(t);
    }, []);
    return (
      <div style={{ width: 66, height: 66, borderRadius: '50%', border: `3px solid ${settled ? '#fbbf24' : '#334155'}`, background: 'radial-gradient(circle,#1e293b,#0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: settled ? '0 0 22px rgba(251,191,36,0.5)' : 'none', transition: 'border-color 0.3s,box-shadow 0.3s' }}>
        <motion.span key={cur} initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.08 }}
          style={{ fontSize: 28, fontWeight: 900, color: settled ? '#fbbf24' : '#64748b', fontFamily: 'monospace' }}>{cur}</motion.span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Dial target={home} delay={300} />
      <span style={{ color: '#334155', fontSize: 40, fontWeight: 900 }}>-</span>
      <Dial target={away} delay={home * 430 + 500} />
    </div>
  );
}

// 20. Progress Bars — fill per team then numbers pop
function ProgressBarScore({ home, away }) {
  const total = home + away || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 230 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#64748b', fontSize: 10, fontWeight: 700, width: 28, letterSpacing: 1 }}>{MOCK.homeTla}</span>
        <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${(home / total) * 100}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            style={{ height: '100%', background: 'linear-gradient(90deg,#3b82f6,#60a5fa)', borderRadius: 5 }} />
        </div>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: 'spring', stiffness: 300, damping: 12 }}
          style={{ fontSize: 22, fontWeight: 900, color: '#3b82f6', width: 22, textAlign: 'right' }}>{home}</motion.span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#64748b', fontSize: 10, fontWeight: 700, width: 28, letterSpacing: 1 }}>{MOCK.awayTla}</span>
        <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${(away / total) * 100}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
            style={{ height: '100%', background: 'linear-gradient(90deg,#ef4444,#f87171)', borderRadius: 5 }} />
        </div>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.9, type: 'spring', stiffness: 300, damping: 12 }}
          style={{ fontSize: 22, fontWeight: 900, color: '#ef4444', width: 22, textAlign: 'right' }}>{away}</motion.span>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}
        style={{ textAlign: 'center', fontSize: 40, fontWeight: 900, color: '#fff', marginTop: 4 }}>
        {home}<span style={{ color: '#334155', margin: '0 8px' }}>-</span>{away}
      </motion.div>
    </div>
  );
}

// 21. Poker Cards — face-down then flip to show numbers
function PokerCardsScore({ home, away }) {
  function Card({ value, delay = 0, accent = '#1d4ed8' }) {
    const [flipped, setFlipped] = useState(false);
    useEffect(() => { const t = setTimeout(() => setFlipped(true), delay); return () => clearTimeout(t); }, []);
    return (
      <div style={{ perspective: 320, width: 62, height: 84 }}>
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,#1e3a5f,#0f2040)', borderRadius: 8, border: '2px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 24, opacity: 0.3 }}>★</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: '#f8fafc', borderRadius: 8, border: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.35)' }}>
            <span style={{ fontSize: 30, fontWeight: 900, color: accent, lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: 16, color: accent }}>♦</span>
          </div>
        </motion.div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Card value={home} delay={500} accent="#1d4ed8" />
      <span style={{ color: '#334155', fontSize: 30, fontWeight: 900 }}>vs</span>
      <Card value={away} delay={1100} accent="#b91c1c" />
    </div>
  );
}

// 22. Loading Percentage — bar fills with %, then score pops in
function LoadingPctScore({ home, away }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 9 + 3;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setDone(true), 350); }
      setPct(Math.round(p));
    }, 55);
    return () => clearInterval(iv);
  }, []);
  if (!done) {
    return (
      <div style={{ width: 210, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#475569', letterSpacing: 3, marginBottom: 10 }}>LOADING SCORE…</div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
          <motion.div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#a78bfa)', borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 13, color: '#8b5cf6', fontFamily: 'monospace' }}>{pct}%</div>
      </div>
    );
  }
  return (
    <motion.span initial={{ scale: 0.45, opacity: 0, filter: 'blur(10px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 280, damping: 14 }}
      style={{ fontSize: 52, fontWeight: 900, color: '#fff' }}>
      {home}<span style={{ color: '#475569', margin: '0 12px' }}>-</span>{away}
    </motion.span>
  );
}

// 23. Neon Counter — glowing neon digits tick up per goal
function NeonCounterScore({ home, away }) {
  const [h, setH] = useState(0);
  const [a, setA] = useState(0);
  useEffect(() => {
    buildGoalSeq(home, away).forEach(({ h: nh, a: na }, i) => {
      setTimeout(() => { setH(nh); setA(na); }, 500 + i * 680);
    });
  }, []);
  const glow = n => n > 0 ? '0 0 8px currentColor,0 0 28px currentColor,0 0 55px currentColor' : 'none';
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 52, fontWeight: 900, fontFamily: 'monospace' }}>
      <motion.span key={`h-${h}`} initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 12 }}
        style={{ color: '#e879f9', textShadow: glow(h), minWidth: 38, textAlign: 'center', display: 'inline-block' }}>{h}</motion.span>
      <span style={{ color: '#334155' }}>-</span>
      <motion.span key={`a-${a}`} initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 12 }}
        style={{ color: '#e879f9', textShadow: glow(a), minWidth: 38, textAlign: 'center', display: 'inline-block' }}>{a}</motion.span>
    </span>
  );
}

// 24. Film Countdown — 5-4-3-2-1 then score
function FilmCountdownScore({ home, away }) {
  const [count, setCount] = useState(5);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => {
      setCount(c => { if (c <= 1) { clearInterval(iv); setDone(true); return 0; } return c - 1; });
    }, 340);
    return () => clearInterval(iv);
  }, []);
  if (!done) {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <motion.div key={count} initial={{ scale: 2, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.2, opacity: 0 }} transition={{ duration: 0.26 }}
          style={{ fontSize: 84, fontWeight: 900, color: '#fff', textShadow: '0 0 40px rgba(255,255,255,0.4)', fontFamily: 'monospace', lineHeight: 1 }}>{count}</motion.div>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(255,255,255,0.18)', borderRadius: 4, pointerEvents: 'none' }} />
      </div>
    );
  }
  return (
    <motion.span initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 360, damping: 14 }}
      style={{ fontSize: 52, fontWeight: 900, color: '#fff' }}>
      {home}<span style={{ color: '#475569', margin: '0 12px' }}>-</span>{away}
    </motion.span>
  );
}

// 25. Spin Wheel — fortune wheel circles spin then lock on target
function SpinWheelScore({ home, away }) {
  function Wheel({ target, delay = 0 }) {
    const [cur, setCur] = useState(0);
    const [settled, setSettled] = useState(false);
    const ref = useRef(0);
    useEffect(() => {
      const t = setTimeout(() => {
        let iter = 0;
        const total = 18 + target * 3;
        const tick = () => {
          if (iter >= total) { setCur(target); setSettled(true); return; }
          ref.current = (ref.current + 1) % 10;
          setCur(ref.current);
          iter++;
          setTimeout(tick, Math.min(38 + iter * 11, 260));
        };
        tick();
      }, delay);
      return () => clearTimeout(t);
    }, []);
    return (
      <motion.div animate={{ rotate: settled ? [0, 12, -8, 5, -3, 0] : 0 }} transition={{ duration: 0.6 }}
        style={{ width: 66, height: 66, borderRadius: '50%', border: `3px solid ${settled ? '#fbbf24' : '#334155'}`, background: 'radial-gradient(circle,#1e293b 60%,#0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: settled ? '0 0 22px rgba(251,191,36,0.5)' : 'none', transition: 'border-color 0.3s,box-shadow 0.3s' }}>
        <span style={{ fontSize: 30, fontWeight: 900, color: settled ? '#fbbf24' : '#64748b', fontFamily: 'monospace' }}>{cur}</span>
      </motion.div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Wheel target={home} delay={300} />
      <span style={{ color: '#334155', fontSize: 40, fontWeight: 900 }}>-</span>
      <Wheel target={away} delay={900} />
    </div>
  );
}

// 26. Barcode Scan — laser sweeps then number appears
function BarcodeScanScore({ home, away }) {
  const [scanY, setScanY] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let y = 0;
    const iv = setInterval(() => {
      y += 3.5;
      setScanY(y);
      if (y >= 100) { clearInterval(iv); setTimeout(() => setDone(true), 300); }
    }, 18);
    return () => clearInterval(iv);
  }, []);
  if (!done) {
    return (
      <div style={{ position: 'relative', width: 160, height: 72 }}>
        <div style={{ display: 'flex', gap: 2, height: '100%', alignItems: 'stretch', padding: '0 4px' }}>
          {Array.from({ length: 26 }, (_, i) => (
            <div key={i} style={{ flex: i % 3 === 0 ? 2 : 1, background: i % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'transparent', borderRadius: 1 }} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: '-2px', right: '-2px', top: `${scanY}%`, height: 2, background: 'rgba(239,68,68,0.95)', filter: 'blur(1px)', boxShadow: '0 0 8px #ef4444,0 0 18px rgba(239,68,68,0.4)', pointerEvents: 'none' }} />
      </div>
    );
  }
  return (
    <motion.span initial={{ opacity: 0, scale: 0.8, filter: 'blur(6px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 280, damping: 14 }}
      style={{ fontSize: 52, fontWeight: 900, color: '#fff' }}>
      {home}<span style={{ color: '#334155', margin: '0 12px' }}>-</span>{away}
    </motion.span>
  );
}

// 27. Goal Stamps — stamp impression per goal, score updates live
function GoalStampScore({ home, away }) {
  const [hCount, setHCount] = useState(0);
  const [aCount, setACount] = useState(0);
  useEffect(() => {
    buildGoalSeq(home, away).forEach(({ h: nh, a: na }, i) => {
      setTimeout(() => { setHCount(nh); setACount(na); }, 450 + i * 720);
    });
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ display: 'flex', gap: 5, minWidth: 52, justifyContent: 'flex-end' }}>
        {Array.from({ length: hCount }, (_, i) => (
          <motion.div key={i} initial={{ scale: 2.5, opacity: 0, rotate: -25 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 12 }}
            style={{ width: 24, height: 24, background: 'rgba(59,130,246,0.18)', border: '2px solid #3b82f6', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: '#3b82f6' }}>⚽</span>
          </motion.div>
        ))}
      </div>
      <div style={{ fontSize: 44, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
        <motion.span key={hCount} initial={{ scale: 1.6, color: '#3b82f6' }} animate={{ scale: 1, color: '#fff' }} transition={{ duration: 0.35 }}>{hCount}</motion.span>
        <span style={{ color: '#334155', fontSize: 32 }}>-</span>
        <motion.span key={`a-${aCount}`} initial={{ scale: 1.6, color: '#ef4444' }} animate={{ scale: 1, color: '#fff' }} transition={{ duration: 0.35 }}>{aCount}</motion.span>
      </div>
      <div style={{ display: 'flex', gap: 5, minWidth: 52 }}>
        {Array.from({ length: aCount }, (_, i) => (
          <motion.div key={i} initial={{ scale: 2.5, opacity: 0, rotate: 25 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 12 }}
            style={{ width: 24, height: 24, background: 'rgba(239,68,68,0.18)', border: '2px solid #ef4444', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: '#ef4444' }}>⚽</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 28. Wormhole — 0-0 gets sucked in, real score emerges
function WormholeScore({ home, away }) {
  const [phase, setPhase] = useState('show');
  useEffect(() => {
    const ts = [setTimeout(() => setPhase('suck'), 600), setTimeout(() => setPhase('emerge'), 1250)];
    return () => ts.forEach(clearTimeout);
  }, []);
  return (
    <div style={{ position: 'relative', display: 'inline-block', minWidth: 180, textAlign: 'center' }}>
      {phase === 'show' && (
        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ fontSize: 52, fontWeight: 900, color: '#64748b', display: 'block' }}>
          0<span style={{ margin: '0 12px', color: '#334155' }}>-</span>0
        </motion.span>
      )}
      {phase === 'suck' && (
        <motion.span initial={{ scale: 1, opacity: 1, rotate: 0 }} animate={{ scale: 0.02, opacity: 0, rotate: 540, filter: 'blur(10px)' }} transition={{ duration: 0.55, ease: 'easeIn' }}
          style={{ fontSize: 52, fontWeight: 900, color: '#64748b', display: 'block' }}>
          0<span style={{ margin: '0 12px', color: '#334155' }}>-</span>0
        </motion.span>
      )}
      {phase === 'emerge' && (
        <motion.span initial={{ scale: 0.02, opacity: 0, rotate: -540, filter: 'blur(10px)' }} animate={{ scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 190, damping: 14 }}
          style={{ fontSize: 52, fontWeight: 900, color: '#fff', display: 'block' }}>
          {home}<span style={{ margin: '0 12px', color: '#334155' }}>-</span>{away}
        </motion.span>
      )}
    </div>
  );
}

// 29. Domino Fall — digits topple into place
function DominoScore({ home, away }) {
  const [fallen, setFallen] = useState([false, false, false]);
  useEffect(() => {
    [380, 860, 1340].forEach((d, i) => setTimeout(() => setFallen(p => { const n = [...p]; n[i] = true; return n; }), d));
  }, []);
  const parts = [String(home), '-', String(away)];
  const cols = ['#60a5fa', '#475569', '#f87171'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
      {parts.map((p, i) => (
        <motion.div key={i}
          initial={{ rotateZ: -90, y: -22, opacity: 0.35 }}
          animate={fallen[i] ? { rotateZ: 0, y: 0, opacity: 1 } : { rotateZ: -90, y: -22, opacity: 0.35 }}
          transition={{ type: 'spring', stiffness: 210, damping: 13 }}
          style={{ transformOrigin: 'bottom center', fontSize: 54, fontWeight: 900, color: cols[i], display: 'inline-block' }}>
          {p}
        </motion.div>
      ))}
    </div>
  );
}

// 30. Question Reveal — ?-? then digits pop in one by one
function QuestionRevealScore({ home, away }) {
  const [rev, setRev] = useState([false, false, false]);
  useEffect(() => {
    [380, 680, 980].forEach((d, i) => setTimeout(() => setRev(p => { const n = [...p]; n[i] = true; return n; }), d));
  }, []);
  const parts = [String(home), '-', String(away)];
  const cols = ['#fff', '#334155', '#fff'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 54, fontWeight: 900 }}>
      {parts.map((p, i) => (
        <div key={i} style={{ position: 'relative', minWidth: i === 1 ? 26 : 40, textAlign: 'center' }}>
          <AnimatePresence mode="wait">
            {rev[i] ? (
              <motion.span key="v" initial={{ scale: 1.6, opacity: 0, filter: 'blur(4px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 14 }}
                style={{ color: cols[i], display: 'block' }}>{p}</motion.span>
            ) : (
              <motion.span key="q" exit={{ scale: 0, opacity: 0, rotate: 180 }} transition={{ duration: 0.18 }}
                style={{ color: '#1e293b', display: 'block' }}>{i === 1 ? '-' : '?'}</motion.span>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

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
    // Premium batch
    case 'p-crt':          return <CRTScore home={h} away={a} />;
    case 'p-vhs':          return <VHSScore home={h} away={a} />;
    case 'p-neon-on':      return <NeonSignOnScore home={h} away={a} />;
    case 'p-polaroid':     return <PolaroidScore home={h} away={a} />;
    case 'p-filmburn':     return <FilmBurnScore home={h} away={a} />;
    case 'p-nebula':       return <NebulaScore home={h} away={a} />;
    case 'p-starwarp':     return <StarWarpScore home={h} away={a} />;
    case 'p-hologram':     return <HologramScore home={h} away={a} />;
    case 'p-chromatic':    return <ChromaticScore home={h} away={a} />;
    case 'p-scanline':     return <ScanlineRevealScore home={h} away={a} />;
    case 'p-echo':         return <EchoScore home={h} away={a} />;
    case 'p-varweight':    return <VariableWeightScore home={h} away={a} />;
    case 'p-outline':      return <OutlineScore home={h} away={a} />;
    case 'p-shadowlift':   return <ShadowLiftScore home={h} away={a} />;
    case 'p-emboss':       return <EmbossScore home={h} away={a} />;
    case 'p-chrome':       return <ChromeScore home={h} away={a} />;
    case 'p-squeeze':      return <SSqueeze home={h} away={a} />;
    case 'p-stretchy':     return <SStretchY home={h} away={a} />;
    case 'p-constrict':    return <SConstrict home={h} away={a} />;
    case 'p-fatpop':       return <SFatPop home={h} away={a} />;
    case 'p-diagtl':       return <SDiagTL home={h} away={a} />;
    case 'p-diagbr':       return <SDiagBR home={h} away={a} />;
    case 'p-diagtr':       return <SDiagTR home={h} away={a} />;
    case 'p-diagbl':       return <SDiagBL home={h} away={a} />;
    case 'p-zigzag':       return <SZigZag home={h} away={a} />;
    case 'p-bigshrink':    return <SBigShrink home={h} away={a} />;
    case 'p-prism':        return <SPrism home={h} away={a} />;
    case 'p-glowp':        return <SGlowPurple home={h} away={a} />;
    case 'p-perspl':       return <SPerspL home={h} away={a} />;
    case 'p-perspr':       return <SPerspR home={h} away={a} />;
    case 'p-perspt':       return <SPerspT home={h} away={a} />;
    case 'p-perspb':       return <SPerspB home={h} away={a} />;
    case 'p-tiltl':        return <STiltL home={h} away={a} />;
    case 'p-tiltr':        return <STiltR home={h} away={a} />;
    case 'p-flyfast':      return <SFlyFast home={h} away={a} />;
    case 'p-breathin':     return <SBreathIn home={h} away={a} />;
    case 'p-ripple':       return <SRipple home={h} away={a} />;
    case 'p-floatup':      return <SFloatUp home={h} away={a} />;
    case 'p-altwave':      return <SAltWave home={h} away={a} />;
    case 'p-fireworks':    return <SFireworks home={h} away={a} />;
    case 'p-telegraph':    return <STelegraph home={h} away={a} />;
    case 'p-goldrush':     return <SGoldRushS home={h} away={a} />;
    case 'p-driftr':       return <SDriftR home={h} away={a} />;
    case 'p-liquid':       return <SLiquid home={h} away={a} />;
    case 'p-blinkon':      return <SBlinkOn home={h} away={a} />;
    case 'p-fall3d':       return <SFall3D home={h} away={a} />;
    // Counter batch (0-0 → real score)
    case 'c-odometer':     return <OdometerScore home={h} away={a} />;
    case 'c-flipboard':    return <FlipBoardScore home={h} away={a} />;
    case 'c-goalreplay':   return <GoalReplayScore home={h} away={a} />;
    case 'c-typewriter':   return <TypewriterMistakeScore home={h} away={a} />;
    case 'c-clocktick':    return <ClockTickScore home={h} away={a} />;
    case 'c-sandfall':     return <SandFallScore home={h} away={a} />;
    case 'c-scratch':      return <ScratchCardScore home={h} away={a} />;
    case 'c-binary':       return <BinaryDecodeScore home={h} away={a} />;
    case 'c-scoreboard':   return <ScoreboardFlashScore home={h} away={a} />;
    case 'c-heartrate':    return <HeartRateScore home={h} away={a} />;
    case 'c-gaspump':     return <GasPumpScore home={h} away={a} />;
    case 'c-dice':        return <DiceRollScore home={h} away={a} />;
    case 'c-traffic':     return <TrafficLightScore home={h} away={a} />;
    case 'c-lottery':     return <LotteryBallsScore home={h} away={a} />;
    case 'c-roman':       return <RomanNumeralScore home={h} away={a} />;
    case 'c-morse':       return <MorseCodeScore home={h} away={a} />;
    case 'c-thermo':      return <ThermometerScore home={h} away={a} />;
    case 'c-atm':         return <ATMDisplayScore home={h} away={a} />;
    case 'c-safedial':    return <SafeDialScore home={h} away={a} />;
    case 'c-progress':    return <ProgressBarScore home={h} away={a} />;
    case 'c-poker':       return <PokerCardsScore home={h} away={a} />;
    case 'c-loading':     return <LoadingPctScore home={h} away={a} />;
    case 'c-neon':        return <NeonCounterScore home={h} away={a} />;
    case 'c-film':        return <FilmCountdownScore home={h} away={a} />;
    case 'c-spinwheel':   return <SpinWheelScore home={h} away={a} />;
    case 'c-barcode':     return <BarcodeScanScore home={h} away={a} />;
    case 'c-stamps':      return <GoalStampScore home={h} away={a} />;
    case 'c-wormhole':    return <WormholeScore home={h} away={a} />;
    case 'c-domino':      return <DominoScore home={h} away={a} />;
    case 'c-question':    return <QuestionRevealScore home={h} away={a} />;
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

const C = (bg,br,sh) => ({ card: { background:bg, border:br, boxShadow:sh } });
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

const PREMIUM_STYLES = [
  // === רטרו ===
  { id:101, name:'CRT Monitor',       category:'רטרו',       desc:'מסך ירוק קלאסי עם שורות סריקה',    scoreType:'p-crt',       ...C('rgba(0,8,0,0.97)',   '1px solid rgba(74,222,128,0.5)','0 0 50px rgba(74,222,128,0.2)'),                                                                      ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,5,0,0.95)') },
  { id:102, name:'VHS Tape',          category:'רטרו',       desc:'עיוות וצבע VHS וינטג\'',             scoreType:'p-vhs',       ...C('#050505',            '1px solid rgba(255,255,255,0.15)','0 0 40px rgba(255,255,255,0.05)'),                                                             ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.95)') },
  { id:103, name:'Neon Sign On',      category:'רטרו',       desc:'ניאון מהבהב ומתאיר בהדרגה',         scoreType:'p-neon-on',   ...C('rgba(5,0,10,0.97)',  '1px solid rgba(240,171,252,0.6)','0 0 50px rgba(168,85,247,0.25)'),                                                             ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(3,0,8,0.95)') },
  { id:104, name:'Polaroid Develop',  category:'רטרו',       desc:'מצלמה מיידית — מסיפיה לצבע',        scoreType:'p-polaroid',  ...C('rgba(20,16,10,0.97)','1px solid rgba(254,243,199,0.3)','0 20px 60px rgba(0,0,0,0.8)'),                                                              ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(12,10,6,0.95)') },
  { id:105, name:'Film Burn',         category:'רטרו',       desc:'בהבהוב פילם חשיפה מוגזמת',           scoreType:'p-filmburn',  ...C('rgba(5,5,5,0.98)',   '1px solid rgba(255,255,255,0.1)','0 0 80px rgba(255,255,255,0.05)'),                                                           ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(0,0,0,0.97)') },
  { id:106, name:'Arcade Squeeze',    category:'רטרו',       desc:'נמשך לצדדים ומתפשט כמו ספרייט',     scoreType:'p-squeeze',   ...C('rgba(0,0,15,0.97)',  '2px solid rgba(34,211,238,0.6)','0 0 50px rgba(34,211,238,0.2)'),                                                             ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,10,0.95)') },
  { id:107, name:'Teletype',          category:'רטרו',       desc:'מהבהב כמו מכונת כתיבה ישנה',         scoreType:'p-telegraph', ...C('#0a0a0a',            '1px solid rgba(74,222,128,0.4)','0 0 30px rgba(74,222,128,0.12)'),                                                            ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.95)') },
  { id:108, name:'Scanline Reveal',   category:'רטרו',       desc:'וילון שורות קלטה מתרומם',            scoreType:'p-scanline',  ...C('rgba(5,10,18,0.97)','1px solid rgba(99,102,241,0.5)','0 0 50px rgba(99,102,241,0.15)'),                                                             ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(3,6,12,0.95)') },
  { id:109, name:'Echo Ghost',        category:'רטרו',       desc:'4 תמונות רפאים מתאחדות',             scoreType:'p-echo',      ...C('rgba(5,5,5,0.97)',   '1px solid rgba(255,255,255,0.08)','0 40px 80px rgba(0,0,0,0.9)'),                                                           ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.97)') },
  { id:110, name:'Blink On',          category:'רטרו',       desc:'הבהובים בלתי סדירים עד הדלקה',       scoreType:'p-blinkon',   ...C('rgba(3,3,3,0.97)',   '1px solid rgba(251,191,36,0.5)','0 0 40px rgba(251,191,36,0.15)'),                                                           ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(2,2,2,0.97)') },
  // === קוסמי ===
  { id:111, name:'Nebula Form',       category:'קוסמי',      desc:'מתהווה מענן נבולה סגולה',            scoreType:'p-nebula',    ...C('rgba(8,2,20,0.97)',  '1px solid rgba(168,85,247,0.5)','0 0 70px rgba(168,85,247,0.25), 0 0 140px rgba(168,85,247,0.08)'),                          ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,1,14,0.97)') },
  { id:112, name:'Star Warp',         category:'קוסמי',      desc:'מתמתח ממהירות אור ומתייצב',          scoreType:'p-starwarp',  ...C('rgba(2,4,15,0.98)',  '1px solid rgba(224,242,254,0.3)','0 0 60px rgba(186,230,253,0.1)'),                                                          ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(1,2,10,0.97)') },
  { id:113, name:'Hologram Scan',     category:'קוסמי',      desc:'הקרנה הולוגרפית עם קרן סריקה',       scoreType:'p-hologram',  ...C('rgba(0,8,18,0.97)',  '1px solid rgba(34,211,238,0.6)','0 0 60px rgba(34,211,238,0.2), inset 0 0 40px rgba(34,211,238,0.05)'),                  ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,4,12,0.95)') },
  { id:114, name:'Chromatic Blast',   category:'קוסמי',      desc:'הפרדת RGB ואחדות לאחר רגע',          scoreType:'p-chromatic', ...C('rgba(5,5,5,0.98)',   '1px solid rgba(255,255,255,0.1)','0 0 60px rgba(255,255,255,0.04)'),                                                          ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(0,0,0,0.97)') },
  { id:115, name:'Purple Glow Cloud', category:'קוסמי',      desc:'עולה מאובך סגול זוהר',                scoreType:'p-glowp',     ...C('rgba(8,2,18,0.97)',  '1px solid rgba(168,85,247,0.5)','0 0 70px rgba(168,85,247,0.25)'),                                                           ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,1,12,0.97)') },
  { id:116, name:'Diagonal TL',       category:'קוסמי',      desc:'מגיע מהפינה השמאלית עליונה',          scoreType:'p-diagtl',    ...C('rgba(5,5,15,0.97)', '1px solid rgba(99,102,241,0.5)','0 0 60px rgba(99,102,241,0.2)'),                                                            ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(3,3,10,0.95)') },
  { id:117, name:'Fat Pop',           category:'קוסמי',      desc:'מסחוט אופקי לקפיץ עגול',              scoreType:'p-fatpop',    ...C('rgba(5,8,20,0.97)',  '1px solid rgba(139,92,246,0.5)','0 0 60px rgba(139,92,246,0.2)'),                                                           ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(3,5,14,0.95)') },
  { id:118, name:'ZigZag Entry',      category:'קוסמי',      desc:'כל ספרה מגיחה בצד חליפי',             scoreType:'p-zigzag',    ...C('rgba(8,18,32,0.97)', '1px solid rgba(245,197,24,0.5)','0 0 60px rgba(245,197,24,0.2)'),                                                           ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:119, name:'Big Shrink',        category:'קוסמי',      desc:'ענק x4 ומתכווץ לתוצאה',               scoreType:'p-bigshrink', ...C('rgba(8,18,32,0.97)', '1px solid rgba(239,68,68,0.5)','0 0 60px rgba(239,68,68,0.2)'),                                                            ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.9)') },
  { id:120, name:'Prism Colors',      category:'קוסמי',      desc:'נסחף עם צבעים ומתמצע',                scoreType:'p-prism',     ...C('rgba(5,5,5,0.98)',   '1px solid rgba(249,115,22,0.5)','0 0 60px rgba(249,115,22,0.15), 0 0 120px rgba(34,211,238,0.08)'),                        ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(2,2,2,0.97)') },
  // === טיפוגרפיה ===
  { id:121, name:'Variable Weight',   category:'טיפוגרפיה',  desc:'מ-thin ל-black בשניה אחת',            scoreType:'p-varweight', ...C('rgba(8,18,32,0.97)', '1px solid rgba(255,255,255,0.12)','0 20px 60px rgba(0,0,0,0.7)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.9)') },
  { id:122, name:'Outline Reveal',    category:'טיפוגרפיה',  desc:'מתגלה כהילת אור ואז מתמלא',           scoreType:'p-outline',   ...C('rgba(5,10,20,0.97)','1px solid rgba(255,255,255,0.1)','0 20px 60px rgba(0,0,0,0.8)'),                                                          ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.95)') },
  { id:123, name:'Shadow Lift',       category:'טיפוגרפיה',  desc:'צף מתוך צל עמוק',                     scoreType:'p-shadowlift',...C('rgba(5,5,5,0.98)',   '1px solid rgba(255,255,255,0.06)','0 40px 100px rgba(0,0,0,0.95)'),                                                     ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.97)') },
  { id:124, name:'Emboss Gold',       category:'טיפוגרפיה',  desc:'מגולף בזהב מהמשטח',                   scoreType:'p-emboss',    ...C('rgba(15,10,0,0.97)','2px solid rgba(245,197,24,0.6)','0 0 60px rgba(245,197,24,0.2)'),                                                          ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(10,7,0,0.97)') },
  { id:125, name:'Persp. Left',       category:'טיפוגרפיה',  desc:'מגלגל נכנס ממישור שמאלי',              scoreType:'p-perspl',    ...C('rgba(8,18,32,0.97)','1px solid rgba(99,102,241,0.5)','0 0 60px rgba(99,102,241,0.2)'),                                                          ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,22,0.95)') },
  { id:126, name:'Persp. Right',      category:'טיפוגרפיה',  desc:'מגלגל נכנס ממישור ימני',               scoreType:'p-perspr',    ...C('rgba(8,18,32,0.97)','1px solid rgba(99,102,241,0.4)','0 0 60px rgba(99,102,241,0.15)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,22,0.95)') },
  { id:127, name:'Persp. Top',        category:'טיפוגרפיה',  desc:'מגלגל נכנס ממישור עליון',               scoreType:'p-perspt',    ...C('rgba(8,18,32,0.97)','1px solid rgba(168,85,247,0.5)','0 0 60px rgba(168,85,247,0.2)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,22,0.95)') },
  { id:128, name:'Tilt In Left',      category:'טיפוגרפיה',  desc:'מוטה 45° ונוחת מהשמאל',               scoreType:'p-tiltl',     ...C('rgba(8,18,32,0.97)','1px solid rgba(239,68,68,0.5)','0 0 60px rgba(239,68,68,0.2)'),                                                            ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,22,0.9)') },
  { id:129, name:'Tilt In Right',     category:'טיפוגרפיה',  desc:'מוטה 45° ונוחת מהימין',                scoreType:'p-tiltr',     ...C('rgba(8,18,32,0.97)','1px solid rgba(239,68,68,0.4)','0 0 60px rgba(239,68,68,0.15)'),                                                           ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,22,0.9)') },
  { id:130, name:'Float Up Indigo',   category:'טיפוגרפיה',  desc:'עולה מטשטוש בצבע אינדיגו',             scoreType:'p-floatup',   ...C('rgba(10,5,30,0.97)','1px solid rgba(99,102,241,0.6)','0 0 60px rgba(99,102,241,0.25)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(6,3,20,0.97)') },
  // === אופטי ===
  { id:131, name:'Chrome Metal',      category:'אופטי',      desc:'ברק מתכת עם גרדיאנט עליון',           scoreType:'p-chrome',    ...C('rgba(5,8,15,0.98)',  '1px solid rgba(148,163,184,0.3)','0 0 60px rgba(148,163,184,0.1)'),                                                          ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(2,4,10,0.97)') },
  { id:132, name:'Constrict Morph',   category:'אופטי',      desc:'נמתח אנכית ומתכווץ לצורה',             scoreType:'p-constrict', ...C('rgba(8,18,32,0.97)', '1px solid rgba(34,211,238,0.5)','0 0 60px rgba(34,211,238,0.2)'),                                                          ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,12,22,0.95)') },
  { id:133, name:'Fast Fly In',       category:'אופטי',      desc:'טסות ממהירות גבוהה משמאל',             scoreType:'p-flyfast',   ...C('rgba(8,18,32,0.97)', '1px solid rgba(245,197,24,0.4)','0 0 50px rgba(245,197,24,0.15)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(5,10,20,0.95)') },
  { id:134, name:'Breath In',         category:'אופטי',      desc:'קפיצת נשימה — מנקודה לאוברשוט',        scoreType:'p-breathin',  ...C('rgba(8,18,32,0.97)', '1px solid rgba(168,85,247,0.5)','0 0 60px rgba(168,85,247,0.2)'),                                                          ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:135, name:'Ripple Center',     category:'אופטי',      desc:'המקף מגיע ראשון ואז הקצוות',           scoreType:'p-ripple',    ...C('rgba(0,8,20,0.97)',  '1px solid rgba(34,211,238,0.5)','0 0 60px rgba(34,211,238,0.2)'),                                                          ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,5,14,0.95)') },
  { id:136, name:'Alt Wave',          category:'אופטי',      desc:'ספרות מגיחות ממעלה ומטה חלופי',        scoreType:'p-altwave',   ...C('rgba(8,18,32,0.97)', '1px solid rgba(74,222,128,0.5)','0 0 60px rgba(74,222,128,0.18)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,12,22,0.95)') },
  { id:137, name:'Fireworks Spin',    category:'אופטי',      desc:'מסתובב 720° ומתכווץ כמו זיקוק',        scoreType:'p-fireworks', ...C('rgba(5,5,5,0.98)',   '1px solid rgba(245,197,24,0.6)','0 0 80px rgba(245,197,24,0.25), 0 0 160px rgba(239,68,68,0.08)'),                       ...E({opacity:0},{opacity:1},{duration:0.2},'rgba(2,2,2,0.97)') },
  { id:138, name:'Gold Rush Stagger', category:'אופטי',      desc:'ספרות זהובות יורדות בזה אחר זה',       scoreType:'p-goldrush',  ...C('rgba(20,12,0,0.97)','2px solid rgba(245,197,24,0.7)','0 0 70px rgba(245,197,24,0.3)'),                                                           ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(12,8,0,0.97)') },
  { id:139, name:'Drift Right',       category:'אופטי',      desc:'נסחף מהימין בעדינות לנחיתה',            scoreType:'p-driftr',    ...C('rgba(8,18,32,0.97)', '1px solid rgba(148,163,184,0.3)','0 20px 60px rgba(0,0,0,0.7)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.92)') },
  { id:140, name:'Liquid Morph',      category:'אופטי',      desc:'נוזל הנמשך לצדדים ומתייצב',             scoreType:'p-liquid',    ...C('rgba(0,8,20,0.97)',  '1px solid rgba(147,197,253,0.4)','0 0 60px rgba(147,197,253,0.15)'),                                                      ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,5,15,0.95)') },
  // === פרמיום ===
  { id:141, name:'Stretch Pop',       category:'פרמיום',     desc:'נמתח אנכית ומתפוצץ לצורה',             scoreType:'p-stretchy',  ...C('rgba(5,5,18,0.97)',  '2px solid rgba(139,92,246,0.6)','0 0 70px rgba(139,92,246,0.25)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(3,3,12,0.97)') },
  { id:142, name:'Diagonal TR',       category:'פרמיום',     desc:'מגיע מהפינה הימנית עליונה',             scoreType:'p-diagtr',    ...C('rgba(5,0,10,0.97)',  '2px solid rgba(240,171,252,0.6)','0 0 70px rgba(168,85,247,0.3)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(3,0,8,0.97)') },
  { id:143, name:'Diagonal BL',       category:'פרמיום',     desc:'מגיע מהפינה השמאלית תחתונה',            scoreType:'p-diagbl',    ...C('rgba(0,5,15,0.97)',  '2px solid rgba(34,211,238,0.6)','0 0 70px rgba(34,211,238,0.25)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,3,12,0.97)') },
  { id:144, name:'Persp. Bottom',     category:'פרמיום',     desc:'מגלגל נכנס ממישור תחתון',               scoreType:'p-perspb',    ...C('rgba(8,18,32,0.97)', '2px solid rgba(245,197,24,0.6)','0 0 70px rgba(245,197,24,0.25)'),                                                         ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,22,0.97)') },
  { id:145, name:'3D Fall Forward',   category:'פרמיום',     desc:'נופל קדימה על ציר X',                   scoreType:'p-fall3d',    ...C('rgba(5,5,5,0.98)',   '2px solid rgba(255,255,255,0.12)','0 40px 100px rgba(0,0,0,0.9)'),                                                       ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.97)') },
  { id:146, name:'Emboss Extreme',    category:'פרמיום',     desc:'חריטת זהב ממעמקי החושך',                scoreType:'p-emboss',    ...C('rgba(20,12,2,0.97)', '2px solid rgba(245,197,24,0.7)','0 0 80px rgba(245,197,24,0.35), 0 0 160px rgba(245,197,24,0.08)'),                     ...E({scale:0.2,opacity:0},{scale:1,opacity:1},{type:'spring',stiffness:120,damping:10},'rgba(12,7,1,0.97)') },
  { id:147, name:'VHS Neon',          category:'פרמיום',     desc:'VHS בצבעי ניאון סגול',                  scoreType:'p-vhs',       ...C('rgba(0,0,8,0.98)',   '2px solid rgba(240,171,252,0.5)','0 0 60px rgba(168,85,247,0.2), 4px 0 rgba(34,211,238,0.15)'),                        ...E({opacity:0,x:-20},{opacity:1,x:0},{type:'spring',stiffness:200,damping:16},'rgba(0,0,5,0.97)') },
  { id:148, name:'CRT Overdrive',     category:'פרמיום',     desc:'CRT ענק עם glow קיצוני',                scoreType:'p-crt',       ...C('rgba(0,5,0,0.98)',   '2px solid rgba(74,222,128,0.7)','0 0 100px rgba(74,222,128,0.4), 0 0 200px rgba(74,222,128,0.08)'),                    ...E({scaleY:0.01,opacity:0},{scaleY:1,opacity:1},{duration:0.5,ease:[0.22,1,0.36,1]},'rgba(0,3,0,0.97)') },
  { id:149, name:'Hologram Elite',    category:'פרמיום',     desc:'הולוגרם פרמיום עם הילה מרובדת',         scoreType:'p-hologram',  ...C('rgba(0,5,12,0.98)',  '2px solid rgba(34,211,238,0.7)','0 0 100px rgba(34,211,238,0.4), 0 0 200px rgba(34,211,238,0.08), inset 0 0 60px rgba(34,211,238,0.04)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,3,8,0.97)') },
  { id:150, name:'Ultimate Premium',  category:'פרמיום',     desc:'נבולה + קפיץ + הילה משולשת',            scoreType:'p-nebula',    ...C('rgba(10,5,20,0.99)', '3px solid rgba(168,85,247,0.9)','0 0 120px rgba(168,85,247,0.5), 0 0 240px rgba(34,211,238,0.2), 0 0 360px rgba(245,197,24,0.06)'), ...E({scale:0,rotate:-15,opacity:0},{scale:1,rotate:0,opacity:1},{type:'spring',stiffness:200,damping:10},'rgba(6,3,14,0.98)') },
];

const COUNTER_STYLES = [
  { id:151, name:'Odometer Roll',      category:'ספירה', desc:'ספרות גוללות למעלה כמו מד-קילומטרים',    scoreType:'c-odometer',   ...C('rgba(5,5,5,0.98)',   '2px solid rgba(255,255,255,0.15)','0 0 60px rgba(255,255,255,0.06), inset 0 0 40px rgba(0,0,0,0.5)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.95)') },
  { id:152, name:'Flip Board',         category:'ספירה', desc:'לוח נחיות — כל ספרה מתהפכת בנפרד',        scoreType:'c-flipboard',  ...C('rgba(8,12,24,0.98)', '2px solid rgba(251,191,36,0.5)','0 0 50px rgba(251,191,36,0.15)'),                                    ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(4,6,14,0.97)') },
  { id:153, name:'Goal Replay',        category:'ספירה', desc:'כל שער נפרד: פלאש אדום + ספרה עולה',      scoreType:'c-goalreplay',  ...C('rgba(8,18,32,0.97)', '2px solid rgba(239,68,68,0.6)','0 0 70px rgba(239,68,68,0.25)'),                                     ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:154, name:'Typewriter Fix',     category:'ספירה', desc:'מקליד ומתקן שגיאות עד לתוצאה הנכונה',    scoreType:'c-typewriter',  ...C('#0a0a0a',            '2px solid rgba(74,222,128,0.5)','0 0 40px rgba(74,222,128,0.15)'),                                       ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.95)') },
  { id:155, name:'Clock Tick',         category:'ספירה', desc:'ספרות מסתחררות ומאטות עד שנעצרות',        scoreType:'c-clocktick',   ...C('rgba(15,10,0,0.98)', '2px solid rgba(251,191,36,0.6)','0 0 60px rgba(251,191,36,0.2)'),                                     ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(10,7,0,0.97)') },
  { id:156, name:'Sand Fall',          category:'ספירה', desc:'0 מתפורר למטה, התוצאה נבנית מלמעלה',     scoreType:'c-sandfall',    ...C('rgba(5,5,5,0.98)',   '1px solid rgba(148,163,184,0.2)','0 40px 80px rgba(0,0,0,0.9)'),                                      ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.97)') },
  { id:157, name:'Scratch Card',       category:'ספירה', desc:'כרטיס גרד מתגלה משמאל לימין',              scoreType:'c-scratch',     ...C('rgba(8,18,32,0.97)', '2px solid rgba(245,197,24,0.5)','0 0 50px rgba(245,197,24,0.15)'),                                    ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:158, name:'Binary Decode',      category:'ספירה', desc:'מציג בינארי → מפצח → ספרות עשרוניות',     scoreType:'c-binary',      ...C('rgba(0,8,0,0.98)',   '2px solid rgba(74,222,128,0.6)','0 0 60px rgba(74,222,128,0.2)'),                                     ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,5,0,0.97)') },
  { id:159, name:'Scoreboard Flash',   category:'ספירה', desc:'לוח ישן מהבהב 0-0 ואז מתקפל לתוצאה',     scoreType:'c-scoreboard',  ...C('rgba(10,8,0,0.98)',  '2px solid rgba(251,191,36,0.7)','0 0 70px rgba(251,191,36,0.25), inset 0 0 30px rgba(0,0,0,0.5)'), ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(6,5,0,0.97)') },
  { id:160, name:'Heart Rate Monitor', category:'ספירה', desc:'דופק ECG לכל שער, ספרה קופצת עם פולס',    scoreType:'c-heartrate',   ...C('rgba(8,18,32,0.97)', '2px solid rgba(239,68,68,0.5)','0 0 60px rgba(239,68,68,0.2)'),                                     ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
];

const COUNTER_STYLES_2 = [
  { id:161, name:'Gas Pump',        category:'ספירה', desc:'תצוגת LED ירוק — ספרות מתקתקות כמו משאבת דלק',   scoreType:'c-gaspump',   ...C('#050505',           '2px solid #1f2937','inset 0 0 30px rgba(0,0,0,0.9)'),                                ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.97)') },
  { id:162, name:'Dice Roll',       category:'ספירה', desc:'קוביות מסתחררות ונוחתות על המספר הנכון',          scoreType:'c-dice',      ...C('rgba(8,18,32,0.97)', '2px solid rgba(99,102,241,0.5)','0 0 50px rgba(99,102,241,0.18)'),                              ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:163, name:'Traffic Light',   category:'ספירה', desc:'אדום → צהוב → ירוק, ואז התוצאה פורצת',           scoreType:'c-traffic',   ...C('rgba(8,18,32,0.97)', '2px solid rgba(74,222,128,0.4)','0 0 50px rgba(74,222,128,0.12)'),                              ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,12,22,0.95)') },
  { id:164, name:'Lottery Balls',   category:'ספירה', desc:'כדורי הגרלה קופצים לכל שער',                      scoreType:'c-lottery',   ...C('rgba(8,18,32,0.97)', '2px solid rgba(251,191,36,0.5)','0 0 60px rgba(251,191,36,0.15)'),                              ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:165, name:'Roman Numerals',  category:'ספירה', desc:'II · II מומר ל-2-2 בהמרה דרמטית',               scoreType:'c-roman',     ...C('rgba(10,8,0,0.98)',  '2px solid rgba(251,191,36,0.55)','0 0 55px rgba(251,191,36,0.2)'),                               ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(7,5,0,0.97)') },
  { id:166, name:'Morse Code',      category:'ספירה', desc:'קוד מורס מהבהב ומתפוגג לתוצאה',                   scoreType:'c-morse',     ...C('rgba(0,18,26,0.98)', '2px solid rgba(34,211,238,0.5)','0 0 55px rgba(34,211,238,0.18)'),                               ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,12,18,0.97)') },
  { id:167, name:'Thermometer',     category:'ספירה', desc:'עמוד כחול/אדום עולה לפי מספר שערים',              scoreType:'c-thermo',    ...C('rgba(8,18,32,0.97)', '1px solid rgba(148,163,184,0.2)','0 40px 80px rgba(0,0,0,0.9)'),                                 ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.97)') },
  { id:168, name:'ATM Display',     category:'ספירה', desc:'מסך ATM ירוק: PROCESSING → תוצאה',               scoreType:'c-atm',       ...C('#001400',            '2px solid #14532d','0 0 40px rgba(20,83,45,0.3)'),                                              ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,8,0,0.97)') },
  { id:169, name:'Safe Dial',       category:'ספירה', desc:'חוגות כספת מסתובבות ונולחות על המספר',            scoreType:'c-safedial',  ...C('rgba(8,18,32,0.97)', '2px solid rgba(251,191,36,0.45)','0 0 50px rgba(251,191,36,0.15)'),                              ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:170, name:'Progress Bars',   category:'ספירה', desc:'פסי טעינה לכל קבוצה, ואז תוצאה מופיעה',          scoreType:'c-progress',  ...C('rgba(8,18,32,0.97)', '1px solid rgba(148,163,184,0.15)','0 20px 60px rgba(0,0,0,0.8)'),                                ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:171, name:'Poker Cards',     category:'ספירה', desc:'קלפים הפוכים מתהפכים וחושפים את התוצאה',          scoreType:'c-poker',     ...C('rgba(8,18,32,0.97)', '2px solid rgba(148,163,184,0.3)','0 20px 60px rgba(0,0,0,0.8)'),                                 ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:172, name:'Loading %',       category:'ספירה', desc:'סרגל טעינה בסגול, 100% → תוצאה מתפרצת',          scoreType:'c-loading',   ...C('rgba(8,8,24,0.98)',  '2px solid rgba(139,92,246,0.5)','0 0 50px rgba(139,92,246,0.18)'),                               ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,5,18,0.97)') },
  { id:173, name:'Neon Counter',    category:'ספירה', desc:'ניאון ורוד זוהר ספור שערים אחד-אחד',              scoreType:'c-neon',      ...C('rgba(8,0,18,0.98)',  '2px solid rgba(232,121,249,0.5)','0 0 60px rgba(232,121,249,0.2)'),                               ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,0,14,0.97)') },
  { id:174, name:'Film Countdown',  category:'ספירה', desc:'5-4-3-2-1 כמו פתיח סרט, ואז פצצת תוצאה',         scoreType:'c-film',      ...C('rgba(5,5,5,0.98)',   '2px solid rgba(255,255,255,0.25)','0 0 60px rgba(255,255,255,0.05)'),                               ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.97)') },
  { id:175, name:'Spin Wheel',      category:'ספירה', desc:'גלגלת מזל מסתובבת ומאטת לתוצאה',                  scoreType:'c-spinwheel', ...C('rgba(8,18,32,0.97)', '2px solid rgba(251,191,36,0.45)','0 0 50px rgba(251,191,36,0.15)'),                              ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:176, name:'Barcode Scan',    category:'ספירה', desc:'לייזר סורק ברקוד ומפענח לתוצאה',                  scoreType:'c-barcode',   ...C('rgba(5,5,5,0.98)',   '2px solid rgba(239,68,68,0.4)','0 0 40px rgba(239,68,68,0.1)'),                                  ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(0,0,0,0.97)') },
  { id:177, name:'Goal Stamps',     category:'ספירה', desc:'חותמת כדורגל מוטבעת לכל שער',                     scoreType:'c-stamps',    ...C('rgba(8,18,32,0.97)', '1px solid rgba(148,163,184,0.2)','0 20px 60px rgba(0,0,0,0.8)'),                                 ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:178, name:'Wormhole',        category:'ספירה', desc:'0-0 נבלע בחור תולעת, התוצאה מופיעה מהשני',       scoreType:'c-wormhole',  ...C('rgba(8,18,32,0.97)', '2px solid rgba(139,92,246,0.5)','0 0 60px rgba(139,92,246,0.2)'),                                 ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.97)') },
  { id:179, name:'Domino Fall',     category:'ספירה', desc:'ספרות נופלות כדומינו אחת אחרי השניה',             scoreType:'c-domino',    ...C('rgba(8,18,32,0.97)', '2px solid rgba(96,165,250,0.4)','0 0 50px rgba(96,165,250,0.12)'),                               ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
  { id:180, name:'Question Reveal', category:'ספירה', desc:'?-? מתגלה ספרה אחרי ספרה בקפיצה',                scoreType:'c-question',  ...C('rgba(8,18,32,0.97)', '2px solid rgba(148,163,184,0.2)','0 20px 60px rgba(0,0,0,0.8)'),                                 ...E({opacity:0},{opacity:1},{duration:0.3},'rgba(5,10,20,0.95)') },
];

const ALL_STYLES = [...COUNTER_STYLES, ...COUNTER_STYLES_2];

const CATEGORIES = ['הכל', 'ספירה'];

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
  const CATEGORY_COLOR = { כניסה:'#3b82f6', מספרים:'#8b5cf6', עיצוב:'#f59e0b', מיוחד:'#ef4444', סטאגר:'#06b6d4', דרמה:'#ec4899', רטרו:'#84cc16', קוסמי:'#a855f7', טיפוגרפיה:'#f97316', אופטי:'#14b8a6', פרמיום:'#fbbf24', ספירה:'#22d3ee' };
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
        <p className="text-slate-400 text-sm mt-1">160 סגנונות שונים — לחץ "הצג תצוגה מקדימה" לראות בגודל מלא</p>
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
