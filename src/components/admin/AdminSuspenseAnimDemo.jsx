import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";

const PLAYERS = [
  { id:1, name:"אלון כהן",    pts:187.5, pos:1 },
  { id:2, name:"מיכל לוי",   pts:162.0, pos:2 },
  { id:3, name:"יוסי דוד",   pts:148.5, pos:3 },
  { id:4, name:"רונית שמיר", pts:134.0, pos:4 },
  { id:5, name:"דני פרידמן", pts:121.5, pos:5 },
  { id:6, name:"שרה גולן",   pts:109.0, pos:6 },
  { id:7, name:"עמי רוזן",   pts: 97.5, pos:7 },
];
const COLORS = ["#fbbf24","#94a3b8","#b45309","#818cf8","#ec4899","#14b8a6","#84cc16"];
const C = i => COLORS[i % COLORS.length];
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZאבגדהוז0123456789!@#$%";
const rnd = () => CHARS[Math.floor(Math.random()*CHARS.length)];
const DELAY = 0.5; // seconds between rows

/* ── shared row shell ─────────────────────────────────────────── */
const Shell = ({ i, children, delay }) => (
  <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay: delay ?? i*0.05}}
    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8"
    style={{background:'rgba(255,255,255,0.04)'}}>
    {children}
  </motion.div>
);

/* ── 1. Question Marks → reveal ───────────────────────────────── */
function QMarkRow({ p, i, run }) {
  const [show, setShow] = useState(false);
  useEffect(() => { if(run){ const t=setTimeout(()=>setShow(true),(PLAYERS.length-p.pos)*DELAY*1000+800); return()=>clearTimeout(t); } else setShow(false); }, [run]);
  return (
    <Shell i={i}>
      <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
      <span className="flex-1 text-sm font-medium transition-all duration-500" style={{color: show?'white':'transparent', textShadow: show?'none':`0 0 8px white`, filter: show?'none':'blur(6px)'}}>
        {show ? p.name : "??? ???"}
      </span>
      <span className="font-bold text-sm tabular-nums transition-all duration-500" style={{color: show?C(i):'rgba(255,255,255,0.2)'}}>
        {show ? p.pts : "???"}
      </span>
    </Shell>
  );
}
const QuestionMarks = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><QMarkRow key={p.id} p={p} i={i} run={run}/>)}</div>;

/* ── 2. Redacted bars → slide away ───────────────────────────── */
function RedactedRow({ p, i, run }) {
  const [show, setShow] = useState(false);
  useEffect(() => { if(run){ const t=setTimeout(()=>setShow(true),(PLAYERS.length-p.pos)*DELAY*1000+500); return()=>clearTimeout(t); } else setShow(false); }, [run]);
  return (
    <Shell i={i}>
      <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
      <div className="flex-1 relative overflow-hidden h-5">
        <span className="text-white font-medium text-sm absolute">{p.name}</span>
        <motion.div className="absolute inset-0 rounded" animate={{scaleX: show?0:1, originX:0}}
          transition={{duration:0.5}} style={{background:C(i)+'99'}} />
      </div>
      <div className="relative overflow-hidden w-14 h-5">
        <span className="font-bold text-sm tabular-nums absolute" style={{color:C(i)}}>{p.pts}</span>
        <motion.div className="absolute inset-0 rounded" animate={{scaleX: show?0:1, originX:0}}
          transition={{duration:0.5,delay:0.15}} style={{background:C(i)+'99'}} />
      </div>
    </Shell>
  );
}
const Redacted = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><RedactedRow key={p.id} p={p} i={i} run={run}/>)}</div>;

/* ── 3. Drumroll — rapid flicker then freeze ─────────────────── */
function DrumrollRow({ p, i, run }) {
  const [val, setVal] = useState({name:'??? ???', pts:'???.?'});
  const [done, setDone] = useState(false);
  useEffect(() => {
    if(!run){ setVal({name:'??? ???',pts:'???.?'}); setDone(false); return; }
    const start = setTimeout(() => {
      let ticks=0; const max=20;
      const iv = setInterval(()=>{
        ticks++;
        setVal({ name: Array.from({length:p.name.length},()=>rnd()).join(''), pts: (Math.random()*200).toFixed(1) });
        if(ticks>=max){ clearInterval(iv); setVal({name:p.name,pts:String(p.pts)}); setDone(true); }
      }, 55);
      return ()=>clearInterval(iv);
    }, (PLAYERS.length-p.pos)*DELAY*1000);
    return ()=>clearTimeout(start);
  }, [run]);
  return (
    <Shell i={i}>
      <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
      <span className="flex-1 text-sm font-mono font-medium" style={{color: done?'white':'rgba(255,255,255,0.4)'}}>{val.name}</span>
      <span className="font-bold text-sm tabular-nums font-mono" style={{color: done?C(i):'rgba(255,255,255,0.3)'}}>{val.pts}</span>
    </Shell>
  );
}
const Drumroll = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><DrumrollRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 4. Blur to sharp ────────────────────────────────────────── */
const BlurReveal = ({run}) => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <motion.div key={p.id}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8"
        style={{background:'rgba(255,255,255,0.04)'}}
        animate={run ? {filter:'blur(0px)',opacity:1} : {filter:'blur(12px)',opacity:0.3}}
        transition={{delay: run ? (PLAYERS.length-p.pos)*DELAY*0.7 : 0, duration:0.8}}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

/* ── 5. Curtain wipe per row ─────────────────────────────────── */
const CurtainReveal = ({run}) => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative overflow-hidden rounded-xl">
        <div className="flex items-center gap-3 px-4 py-3 border border-white/8" style={{background:'rgba(255,255,255,0.04)'}}>
          <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        </div>
        <motion.div className="absolute inset-0 rounded-xl" style={{background:C(i)+'33', backdropFilter:'blur(4px)'}}
          animate={run ? {scaleX:0,originX:'left'} : {scaleX:1}}
          transition={{delay: run?(PLAYERS.length-p.pos)*DELAY*0.6:0, duration:0.55, ease:[0.77,0,0.18,1]}} />
      </div>
    ))}
  </div>
);

/* ── 6. Stagger columns: pos → pause → name → pause → pts ─────── */
function StaggerColRow({ p, i, run }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if(!run){setPhase(0);return;}
    const base = (PLAYERS.length-p.pos)*DELAY*700;
    const t1=setTimeout(()=>setPhase(1),base);
    const t2=setTimeout(()=>setPhase(2),base+600);
    const t3=setTimeout(()=>setPhase(3),base+1200);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[run]);
  return (
    <Shell i={i}>
      <motion.span animate={{opacity:phase>=1?1:0,y:phase>=1?0:10}} transition={{duration:0.3}}
        className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</motion.span>
      <motion.span animate={{opacity:phase>=2?1:0,filter:phase>=2?'blur(0px)':'blur(8px)'}} transition={{duration:0.4}}
        className="flex-1 text-white font-medium text-sm">{p.name}</motion.span>
      <motion.span animate={{scale:phase>=3?1:0}} transition={{type:'spring',stiffness:300,damping:20}}
        className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</motion.span>
    </Shell>
  );
}
const StaggerColumns = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><StaggerColRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 7. Loading bar per row, then reveal ─────────────────────── */
function LoadingBarRow({ p, i, run }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if(!run){setPct(0);setDone(false);return;}
    const delay = (PLAYERS.length-p.pos)*DELAY*700;
    const t=setTimeout(()=>{
      let v=0; const iv=setInterval(()=>{ v+=7; setPct(Math.min(v,100)); if(v>=100){clearInterval(iv);setDone(true);} },30);
      return()=>clearInterval(iv);
    },delay);
    return()=>clearTimeout(t);
  },[run]);
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden" style={{background:'rgba(255,255,255,0.04)'}}>
      {!done ? (
        <div className="px-4 py-3 space-y-1.5">
          <span className="text-slate-500 text-xs">טוען מקום {p.pos}...</span>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{background:C(i)}} animate={{width:`${pct}%`}} transition={{duration:0.05}} />
          </div>
        </div>
      ) : (
        <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="flex items-center gap-3 px-4 py-3">
          <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        </motion.div>
      )}
    </div>
  );
}
const LoadingBar = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><LoadingBarRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 8. Expand from center ───────────────────────────────────── */
const ExpandCenter = ({run}) => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <motion.div key={p.id}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 overflow-hidden"
        style={{background:'rgba(255,255,255,0.04)'}}
        animate={run ? {clipPath:'inset(0% 0% 0% 0%)'} : {clipPath:'inset(0% 50% 0% 50%)'}}
        transition={{delay: run?(PLAYERS.length-p.pos)*DELAY*0.65:0, duration:0.5, ease:'easeOut'}}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

/* ── 9. Color burst then reveal ──────────────────────────────── */
function BurstRow({ p, i, run }) {
  const [burst, setBurst] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if(!run){setBurst(false);setShow(false);return;}
    const base=(PLAYERS.length-p.pos)*DELAY*700;
    const t1=setTimeout(()=>setBurst(true),base);
    const t2=setTimeout(()=>{setBurst(false);setShow(true);},base+350);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[run]);
  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border border-white/8" style={{background:'rgba(255,255,255,0.04)'}}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 font-medium text-sm" style={{color:show?'white':'transparent'}}>{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:show?C(i):'transparent'}}>{p.pts}</span>
      </div>
      <AnimatePresence>
        {burst && <motion.div className="absolute inset-0" style={{background:C(i)}}
          initial={{opacity:0.9}} animate={{opacity:0}} transition={{duration:0.35}} />}
      </AnimatePresence>
    </div>
  );
}
const ColorBurst = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><BurstRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 10. Typewriter slow + dramatic pause before pts ─────────── */
function TypewriterRow({ p, i, run }) {
  const [name, setName] = useState('');
  const [pts, setPts] = useState('');
  useEffect(() => {
    if(!run){setName('');setPts('');return;}
    const base=(PLAYERS.length-p.pos)*DELAY*900;
    let ni=0;
    const t1=setTimeout(()=>{
      const iv=setInterval(()=>{ ni++; setName(p.name.slice(0,ni)); if(ni>=p.name.length){clearInterval(iv);
        setTimeout(()=>{ let pi=0; const pv=String(p.pts); const iv2=setInterval(()=>{ pi++; setPts(pv.slice(0,pi)); if(pi>=pv.length)clearInterval(iv2); },80); },500);
      }},65);
    },base);
    return()=>clearTimeout(t1);
  },[run]);
  return (
    <Shell i={i}>
      <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
      <span className="flex-1 text-white font-medium text-sm font-mono">{name}<span className="opacity-60 animate-pulse">|</span></span>
      <span className="font-bold text-sm tabular-nums font-mono" style={{color:C(i)}}>{pts}</span>
    </Shell>
  );
}
const TypewriterDrama = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><TypewriterRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 11. Rising from below a mask ────────────────────────────── */
const RisingFloor = ({run}) => (
  <div className="space-y-1 overflow-hidden">
    {PLAYERS.map((p,i) => (
      <motion.div key={p.id}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8"
        style={{background:'rgba(255,255,255,0.04)'}}
        animate={run ? {y:0,opacity:1} : {y:60,opacity:0}}
        transition={{delay: run?(PLAYERS.length-p.pos)*DELAY*0.6:0, type:'spring', stiffness:180, damping:22}}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

/* ── 12. X-ray skeleton → fill ───────────────────────────────── */
function XrayRow({ p, i, run }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => { if(run){const t=setTimeout(()=>setFilled(true),(PLAYERS.length-p.pos)*DELAY*700+300);return()=>clearTimeout(t);} else setFilled(false); },[run]);
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500"
      style={{background: filled?'rgba(255,255,255,0.04)':'transparent', borderColor: filled?'rgba(255,255,255,0.08)':`${C(i)}50`}}>
      <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
      <div className="flex-1">
        {filled ? <span className="text-white font-medium text-sm">{p.name}</span>
          : <div className="h-3 rounded-full bg-white/10 w-24 animate-pulse" />}
      </div>
      {filled ? <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        : <div className="h-3 rounded-full bg-white/10 w-10 animate-pulse" />}
    </div>
  );
}
const Xray = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><XrayRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 13. Matrix decode ───────────────────────────────────────── */
function MatrixRow({ p, i, run }) {
  const [display, setDisplay] = useState({ name: Array(p.name.length).fill('█').join(''), pts: '███' });
  const [done, setDone] = useState(false);
  useEffect(() => {
    if(!run){setDisplay({name:Array(p.name.length).fill('█').join(''),pts:'███'});setDone(false);return;}
    const base=(PLAYERS.length-p.pos)*DELAY*700;
    const t=setTimeout(()=>{
      let frame=0; const frames=20;
      const iv=setInterval(()=>{
        frame++;
        const nameRevealed=Math.floor((frame/frames)*p.name.length);
        setDisplay({
          name: p.name.slice(0,nameRevealed) + Array.from({length:p.name.length-nameRevealed},()=>rnd()).join(''),
          pts: frame>=frames ? String(p.pts) : Array.from({length:5},()=>rnd()).join(''),
        });
        if(frame>=frames){clearInterval(iv);setDone(true);}
      },50);
    },base);
    return()=>clearTimeout(t);
  },[run]);
  return (
    <Shell i={i}>
      <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
      <span className="flex-1 font-mono text-sm" style={{color:done?'white':'rgba(0,255,80,0.7)'}}>{display.name}</span>
      <span className="font-bold text-sm tabular-nums font-mono" style={{color:done?C(i):'rgba(0,255,80,0.5)'}}>{display.pts}</span>
    </Shell>
  );
}
const MatrixDecode = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><MatrixRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 14. Dice roll digits ────────────────────────────────────── */
function DiceRow({ p, i, run }) {
  const [pts, setPts] = useState('--');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if(!run){setPts('--');setDone(false);return;}
    const base=(PLAYERS.length-p.pos)*DELAY*700;
    const t=setTimeout(()=>{
      let tick=0; const max=18;
      const iv=setInterval(()=>{
        tick++;
        setPts((Math.random()*200).toFixed(1));
        if(tick>=max){clearInterval(iv);setPts(String(p.pts));setDone(true);}
      },60);
    },base);
    return()=>clearTimeout(t);
  },[run]);
  return (
    <Shell i={i}>
      <motion.span animate={done?{scale:[1.4,1]}:{}} transition={{duration:0.3}}
        className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</motion.span>
      <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
      <span className="font-black text-base tabular-nums font-mono" style={{color:done?C(i):'rgba(255,255,255,0.3)'}}>{pts}</span>
    </Shell>
  );
}
const DiceRoll = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><DiceRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 15. Scratch spark then reveal ──────────────────────────── */
function ScratchRow({ p, i, run }) {
  const [sparks, setSparks] = useState([]);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if(!run){setSparks([]);setRevealed(false);return;}
    const base=(PLAYERS.length-p.pos)*DELAY*700;
    const t=setTimeout(()=>{
      const newS=Array.from({length:8},(_,k)=>({id:k,x:(Math.random()-0.5)*60,y:(Math.random()-0.5)*30}));
      setSparks(newS);
      setTimeout(()=>{setSparks([]);setRevealed(true);},500);
    },base);
    return()=>clearTimeout(t);
  },[run]);
  return (
    <div className="relative">
      <Shell i={i}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 font-medium text-sm" style={{color:revealed?'white':'transparent',transition:'color 0.3s'}}>{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:revealed?C(i):'transparent',transition:'color 0.3s'}}>{p.pts}</span>
        {!revealed && <div className="absolute inset-0 rounded-xl" style={{background:'rgba(255,255,255,0.06)',backdropFilter:'blur(4px)'}} />}
      </Shell>
      {sparks.map(s=>(
        <motion.div key={s.id} className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{background:C(i),left:'50%',top:'50%'}}
          animate={{x:s.x,y:s.y,opacity:0,scale:0}}
          transition={{duration:0.45}} />
      ))}
    </div>
  );
}
const ScratchReveal = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><ScratchRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 16. Glitch then settle ──────────────────────────────────── */
function GlitchRow({ p, i, run }) {
  const [glitch, setGlitch] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if(!run){setGlitch(false);setSettled(false);return;}
    const base=(PLAYERS.length-p.pos)*DELAY*700;
    const t1=setTimeout(()=>setGlitch(true),base);
    const t2=setTimeout(()=>{setGlitch(false);setSettled(true);},base+450);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[run]);
  return (
    <motion.div animate={glitch?{x:[0,4,-3,2,-1,0],filter:['none','hue-rotate(90deg)','hue-rotate(200deg)','none']}:{}}
      transition={{duration:0.4}}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 relative overflow-hidden"
      style={{background:'rgba(255,255,255,0.04)'}}>
      {glitch && <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,0,0.15) 2px,rgba(0,255,0,0.15) 4px)'}} />}
      <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
      <span className="flex-1 font-medium text-sm" style={{color:settled?'white':'rgba(255,255,255,0.2)'}}>{p.name}</span>
      <span className="font-bold text-sm tabular-nums" style={{color:settled?C(i):'rgba(255,255,255,0.15)'}}>{p.pts}</span>
    </motion.div>
  );
}
const GlitchSettle = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><GlitchRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 17. Heartbeat then freeze ───────────────────────────────── */
function HeartbeatRow({ p, i, run }) {
  const [frozen, setFrozen] = useState(false);
  useEffect(()=>{ if(run){const t=setTimeout(()=>setFrozen(true),(PLAYERS.length-p.pos)*DELAY*700+800);return()=>clearTimeout(t);} else setFrozen(false); },[run]);
  return (
    <motion.div
      animate={run && !frozen ? {scale:[1,1.04,1,1.02,1]} : {scale:1}}
      transition={{repeat: frozen?0:Infinity, duration:1.2}}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border"
      style={{background:'rgba(255,255,255,0.04)', borderColor: frozen?`${C(i)}50`:'rgba(255,255,255,0.08)'}}>
      <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
      <span className="flex-1 font-medium text-sm" style={{color:frozen?'white':'rgba(255,255,255,0.4)'}}>{p.name}</span>
      <span className="font-bold text-sm tabular-nums" style={{color:frozen?C(i):'rgba(255,255,255,0.2)'}}>{p.pts}</span>
    </motion.div>
  );
}
const HeartbeatFreeze = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><HeartbeatRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 18. Morse flash then reveal ─────────────────────────────── */
function MorseRow({ p, i, run }) {
  const [visible, setVisible] = useState(false);
  const [flashing, setFlashing] = useState(false);
  useEffect(() => {
    if(!run){setVisible(false);setFlashing(false);return;}
    const base=(PLAYERS.length-p.pos)*DELAY*700;
    const t1=setTimeout(()=>setFlashing(true),base);
    const t2=setTimeout(()=>{setFlashing(false);setVisible(true);},base+600);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[run]);
  return (
    <motion.div animate={flashing?{opacity:[0,1,0,1,0,1,1]}:{opacity:visible?1:0.15}}
      transition={{duration:flashing?0.6:0.3}}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8"
      style={{background:'rgba(255,255,255,0.04)'}}>
      <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
      <span className="flex-1 font-medium text-sm" style={{color:visible?'white':'rgba(255,255,255,0.2)'}}>{p.name}</span>
      <span className="font-bold text-sm tabular-nums" style={{color:visible?C(i):'rgba(255,255,255,0.1)'}}>{p.pts}</span>
    </motion.div>
  );
}
const MorseReveal = ({run}) => <div className="space-y-2">{PLAYERS.map((p,i)=><MorseRow key={`${p.id}-${run}`} p={p} i={i} run={run}/>)}</div>;

/* ── 19. Zoom from invisible ─────────────────────────────────── */
const ZoomReveal = ({run}) => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <motion.div key={p.id}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8"
        style={{background:'rgba(255,255,255,0.04)'}}
        animate={run?{scale:1,opacity:1}:{scale:0.01,opacity:0}}
        transition={{delay:run?(PLAYERS.length-p.pos)*DELAY*0.6:0, type:'spring', stiffness:260, damping:20}}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

/* ── 20. Envelope unfold ─────────────────────────────────────── */
const EnvelopeUnfold = ({run}) => (
  <div className="space-y-2" style={{perspective:600}}>
    {PLAYERS.map((p,i) => (
      <motion.div key={p.id}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8"
        style={{background:'rgba(255,255,255,0.04)',transformOrigin:'top center'}}
        animate={run ? {rotateX:0,opacity:1,scaleY:1} : {rotateX:-90,opacity:0,scaleY:0}}
        transition={{delay:run?(PLAYERS.length-p.pos)*DELAY*0.65:0, duration:0.5, ease:[0.23,1,0.32,1]}}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
const DEMOS = [
  {id:"qmarks",   label:"? → גילוי",        emoji:"❓", C:QuestionMarks},
  {id:"redact",   label:"Redacted",          emoji:"⬛", C:Redacted},
  {id:"drum",     label:"Drumroll",          emoji:"🥁", C:Drumroll},
  {id:"blur",     label:"Blur to Sharp",     emoji:"🔭", C:BlurReveal},
  {id:"curtain",  label:"Curtain",           emoji:"🎬", C:CurtainReveal},
  {id:"columns",  label:"Stagger Columns",   emoji:"📊", C:StaggerColumns},
  {id:"loadbar",  label:"Loading Bar",       emoji:"⏳", C:LoadingBar},
  {id:"expand",   label:"Expand Center",     emoji:"↔️", C:ExpandCenter},
  {id:"burst",    label:"Color Burst",       emoji:"💥", C:ColorBurst},
  {id:"type",     label:"Typewriter Drama",  emoji:"⌨️", C:TypewriterDrama},
  {id:"rise",     label:"Rising Floor",      emoji:"📈", C:RisingFloor},
  {id:"xray",     label:"X-ray Skeleton",    emoji:"🩻", C:Xray},
  {id:"matrix",   label:"Matrix Decode",     emoji:"📟", C:MatrixDecode},
  {id:"dice",     label:"Dice Roll",         emoji:"🎲", C:DiceRoll},
  {id:"scratch",  label:"Scratch Reveal",    emoji:"✨", C:ScratchReveal},
  {id:"glitch",   label:"Glitch & Settle",   emoji:"⚡", C:GlitchSettle},
  {id:"heart",    label:"Heartbeat Freeze",  emoji:"❤️", C:HeartbeatFreeze},
  {id:"morse",    label:"Morse Flash",       emoji:"📡", C:MorseReveal},
  {id:"zoom",     label:"Zoom from Dot",     emoji:"🔍", C:ZoomReveal},
  {id:"envelope", label:"Envelope Unfold",   emoji:"✉️", C:EnvelopeUnfold},
];

export default function AdminSuspenseAnimDemo() {
  const [active, setActive] = useState("qmarks");
  const [run, setRun] = useState(false);
  const cur = DEMOS.find(d=>d.id===active);

  const switchTo = id => { setActive(id); setRun(false); setTimeout(()=>setRun(true),100); };
  const replay   = ()  => { setRun(false); setTimeout(()=>setRun(true),100); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">דמו — אנימציות מתח וגילוי</h2>
        <p className="text-slate-500 text-sm mt-1">20 סגנונות • האחרון מקום מתגלה ראשון</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEMOS.map(d=>(
          <button key={d.id} onClick={()=>switchTo(d.id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              active===d.id ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-300"
                           : "bg-white/4 border-white/8 text-slate-400 hover:text-white hover:bg-white/8"}`}>
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 min-h-[320px]">
        <cur.C run={run} />
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={replay}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-sm transition-all">
          <RotateCcw className="w-4 h-4" /> Replay
        </button>
        {!run && <button onClick={()=>setRun(true)}
          className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-sm hover:bg-indigo-500/30 transition-all">
          ▶ הפעל
        </button>}
      </div>
    </div>
  );
}
