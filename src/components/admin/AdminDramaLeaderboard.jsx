import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const P = [
  { id:1, name:"אלון כהן",    pts:187.5, pos:1, av:"AK" },
  { id:2, name:"מיכל לוי",   pts:162.0, pos:2, av:"ML" },
  { id:3, name:"יוסי דוד",   pts:148.5, pos:3, av:"YD" },
  { id:4, name:"רונית שמיר", pts:134.0, pos:4, av:"RS" },
  { id:5, name:"דני פרידמן", pts:121.5, pos:5, av:"DF" },
  { id:6, name:"שרה גולן",   pts:109.0, pos:6, av:"SG" },
  { id:7, name:"עמי רוזן",   pts: 97.5, pos:7, av:"ER" },
];
const MAX = P[0].pts;
const GOLD = "#fbbf24"; const SILVER = "#94a3b8"; const BRONZE = "#b45309";
const RC = ["#f59e0b","#94a3b8","#b45309","#818cf8","#ec4899","#14b8a6","#84cc16"];
const C = i => RC[i % RC.length];
const medal = p => p===1?"🥇":p===2?"🥈":p===3?"🥉":null;
const s = (i,d=0) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{delay:i*0.06+d} });
const Av = ({p,sz=36,i}) => (
  <div className="rounded-full flex items-center justify-center font-bold text-black flex-shrink-0 text-xs"
    style={{width:sz,height:sz,background:C(p.pos-1),fontSize:sz*0.32}}>{p.av}</div>
);

// ─────────────────────────────────────────────────────────────────
// 1. Cinematic Drop
// ─────────────────────────────────────────────────────────────────
const Cinematic = () => (
  <div className="space-y-2">
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0,y:-60,scale:0.9}} animate={{opacity:1,y:0,scale:1}}
        transition={{delay:i*0.12,type:"spring",stiffness:180,damping:18}}
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl relative overflow-hidden"
        style={{background:`linear-gradient(135deg,${C(i)}18,rgba(0,0,0,0.4))`,border:`1px solid ${C(i)}35`,boxShadow:`0 8px 24px rgba(0,0,0,0.4)`}}>
        <div className="absolute inset-0" style={{background:`linear-gradient(90deg,${C(i)}15 0%,transparent 60%)`}}/>
        <span className="font-black text-4xl w-10 leading-none relative" style={{color:C(i),opacity:0.4}}>{p.pos}</span>
        <Av p={p} i={i} sz={40}/><span className="flex-1 text-white font-bold text-sm relative">{p.name}</span>
        <span className="font-black text-xl tabular-nums relative" style={{color:C(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 2. Neon Arcade
// ─────────────────────────────────────────────────────────────────
const NeonArcade = () => (
  <div className="space-y-1.5 font-mono" style={{background:'rgba(0,0,10,0.8)',padding:16,borderRadius:12,border:'2px solid rgba(0,255,180,0.2)'}}>
    <div className="text-center text-[10px] tracking-[0.4em] mb-3" style={{color:'rgba(0,255,180,0.5)'}}>— HIGH SCORES —</div>
    {P.map((p,i)=>(
      <motion.div key={p.id} {...s(i)} className="flex items-center gap-3 px-3 py-2 rounded"
        style={{background:i===0?'rgba(0,255,180,0.08)':'transparent',borderBottom:'1px solid rgba(0,255,180,0.08)'}}>
        <span className="text-[10px] w-5 text-right" style={{color:'rgba(0,255,180,0.4)'}}>{String(p.pos).padStart(2,'0')}</span>
        <span style={{color:'rgba(0,255,180,0.85)'}} className="text-xs tracking-widest uppercase flex-1">{p.name}</span>
        <span className="text-sm font-bold tabular-nums" style={{color:i===0?'#00ffb4':'rgba(0,255,180,0.6)',textShadow:i===0?'0 0 12px #00ffb4':''}}>{p.pts.toFixed(1)}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 3. Glass Luxury
// ─────────────────────────────────────────────────────────────────
const GlassLuxury = () => (
  <div className="space-y-2.5">
    {P.map((p,i)=>(
      <motion.div key={p.id} {...s(i)}
        className="p-px rounded-2xl" style={{background:`linear-gradient(135deg,${C(i)}80,${C((i+2)%7)}40,transparent)`}}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-[15px]"
          style={{background:'rgba(5,10,25,0.92)',backdropFilter:'blur(20px)'}}>
          <span className="text-2xl w-7 text-center">{medal(p.pos)||<span className="text-slate-600 text-sm font-bold">{p.pos}</span>}</span>
          <Av p={p} i={i} sz={36}/>
          <span className="flex-1 text-white font-semibold text-sm">{p.name}</span>
          <span className="font-black tabular-nums text-base" style={{color:C(i)}}>{p.pts}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 4. Flip Clock Board
// ─────────────────────────────────────────────────────────────────
const FlipBoard = () => (
  <div className="space-y-px font-mono" style={{background:'#1a1a2e',padding:12,borderRadius:12,border:'1px solid #333'}}>
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{rotateX:-90,opacity:0}} animate={{rotateX:0,opacity:1}}
        transition={{delay:i*0.14,duration:0.45,ease:[0.23,1,0.32,1]}} style={{transformOrigin:'top center',perspective:400}}
        className="flex items-center gap-3 px-4 py-2 border-b" style2={{borderColor:'#2a2a3e'}}>
        <span className="text-amber-500 font-bold text-sm w-6">{p.pos}</span>
        <div className="flex gap-1 flex-1">
          {p.name.split('').map((ch,j)=>(
            <span key={j} className="inline-flex items-center justify-center w-5 h-7 rounded text-[11px] font-bold text-green-300"
              style={{background:'#0a0a1a',border:'1px solid #1a3a1a',textShadow:'0 0 6px #00ff80'}}>{ch}</span>
          ))}
        </div>
        <span className="text-amber-400 font-bold text-sm tabular-nums">{p.pts.toFixed(1)}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 5. Racing F1
// ─────────────────────────────────────────────────────────────────
const Racing = () => (
  <div className="space-y-1.5">
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0,x:-80}} animate={{opacity:1,x:0}}
        transition={{delay:i*0.09,type:'spring',stiffness:160,damping:20}}
        className="flex items-center h-11 rounded overflow-hidden" style={{border:`1px solid ${C(i)}30`}}>
        <div className="w-10 h-full flex items-center justify-center font-black text-lg text-black" style={{background:C(i)}}>{p.pos}</div>
        <div className="w-1 h-full" style={{background:C(i)+'60'}}/>
        <div className="flex-1 px-3 flex items-center gap-2 h-full" style={{background:'rgba(255,255,255,0.04)'}}>
          <span className="text-white font-bold text-sm">{p.name}</span>
        </div>
        <div className="px-4 h-full flex items-center font-black tabular-nums text-sm" style={{background:'rgba(0,0,0,0.4)',color:C(i)}}>{p.pts}</div>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 6. Comic Book
// ─────────────────────────────────────────────────────────────────
const ComicBook = () => (
  <div className="space-y-2" style={{filter:'contrast(1.1)'}}>
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{scale:0.8,opacity:0,rotate:(i%2===0?-1:1)*3}} animate={{scale:1,opacity:1,rotate:0}}
        transition={{delay:i*0.1,type:'spring',stiffness:300,damping:20}}
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{background:C(i)+'22',border:`3px solid ${C(i)}`,boxShadow:`3px 3px 0 ${C(i)}60`}}>
        <span className="font-black text-3xl leading-none" style={{color:C(i),WebkitTextStroke:`1px ${C(i)}`,filter:'drop-shadow(1px 1px 0 rgba(0,0,0,0.5))'}}>{p.pos}</span>
        <Av p={p} i={i} sz={36}/>
        <span className="flex-1 text-white font-black text-sm uppercase tracking-wide">{p.name}</span>
        <span className="font-black text-xl" style={{color:C(i),WebkitTextStroke:'0.5px rgba(0,0,0,0.3)'}}>{p.pts}!</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 7. Holographic
// ─────────────────────────────────────────────────────────────────
const Holographic = () => (
  <div className="space-y-2">
    <style>{`@keyframes holo{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`}</style>
    {P.map((p,i)=>(
      <motion.div key={p.id} {...s(i)} className="p-px rounded-2xl"
        style={{background:'linear-gradient(135deg,#f472b6,#818cf8,#38bdf8,#34d399,#fbbf24)',backgroundSize:'300% 300%',animation:'holo 4s ease infinite'}}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-[15px]"
          style={{background:'rgba(5,8,20,0.90)',backdropFilter:'blur(16px)'}}>
          <span className="text-white/30 font-bold w-5 text-sm">{p.pos}</span>
          <Av p={p} i={i} sz={34}/>
          <span className="flex-1 text-white font-semibold text-sm">{p.name}</span>
          <span className="font-black text-base tabular-nums" style={{background:'linear-gradient(90deg,#f472b6,#818cf8,#38bdf8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{p.pts}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 8. Retro Terminal (CRT)
// ─────────────────────────────────────────────────────────────────
const Terminal = () => (
  <div className="font-mono text-xs" style={{background:'#0a0f0a',padding:16,borderRadius:8,border:'1px solid #1a3a1a',boxShadow:'inset 0 0 40px rgba(0,255,0,0.03)'}}>
    <div style={{color:'#00ff41'}} className="mb-3 text-[10px] tracking-wider">$ LEADERBOARD --live --sort=pts</div>
    <div className="mb-2 flex gap-4 text-[9px]" style={{color:'rgba(0,255,65,0.4)',borderBottom:'1px solid rgba(0,255,65,0.15)',paddingBottom:4}}>
      <span className="w-5">POS</span><span className="flex-1">PLAYER</span><span>SCORE</span><span>BAR</span>
    </div>
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.15}}
        className="flex items-center gap-4 py-1">
        <span className="w-5 text-[10px]" style={{color:'rgba(0,255,65,0.5)'}}>{p.pos}</span>
        <span className="flex-1 text-[11px]" style={{color:i===0?'#00ff41':'rgba(0,255,65,0.75)'}}>{p.name}</span>
        <span className="text-[11px] tabular-nums w-12 text-right" style={{color:'#00ff41'}}>{p.pts.toFixed(1)}</span>
        <div className="w-20 h-1.5 rounded overflow-hidden" style={{background:'rgba(0,255,65,0.1)'}}>
          <motion.div className="h-full rounded" style={{background:'#00ff41'}}
            initial={{width:0}} animate={{width:`${(p.pts/MAX)*100}%`}} transition={{delay:i*0.15+0.3,duration:0.8}}/>
        </div>
      </motion.div>
    ))}
    <div className="mt-3 text-[9px] animate-pulse" style={{color:'rgba(0,255,65,0.4)'}}>█ _</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 9. Space Mission
// ─────────────────────────────────────────────────────────────────
const Space = () => (
  <div className="space-y-2" style={{background:'rgba(0,5,20,0.95)',padding:16,borderRadius:12,border:'1px solid rgba(100,149,237,0.2)'}}>
    <div className="flex items-center gap-2 mb-3">
      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"/>
      <span className="text-blue-300 text-[10px] font-mono tracking-widest uppercase">Mission Control · Live Feed</span>
    </div>
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0,filter:'blur(8px)'}} animate={{opacity:1,filter:'blur(0px)'}}
        transition={{delay:i*0.12,duration:0.6}}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
        style={{background:'rgba(100,149,237,0.06)',border:'1px solid rgba(100,149,237,0.15)'}}>
        <div className="w-8 h-8 rounded-sm flex items-center justify-center font-black text-sm"
          style={{background:'rgba(100,149,237,0.15)',border:'1px solid rgba(100,149,237,0.3)',color:'#93c5fd'}}>{p.pos}</div>
        <div className="flex-1">
          <p className="text-white font-semibold text-xs">{p.name}</p>
          <p className="text-blue-400/50 text-[9px] font-mono uppercase tracking-widest">OPERATIVE · CLASS-{p.pos}</p>
        </div>
        <div className="text-right">
          <p className="font-black text-base tabular-nums" style={{color:'#93c5fd'}}>{p.pts}</p>
          <p className="text-[8px] text-blue-400/40 font-mono">PTS</p>
        </div>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 10. Fire Ranking (heat top → cold bottom)
// ─────────────────────────────────────────────────────────────────
const FireRank = () => {
  const heat = ["#ff4500","#ff6a00","#ff8c00","#ffa500","#ffcc00","#ffe066","#fff3b0"];
  return (
    <div className="space-y-1.5">
      {P.map((p,i)=>(
        <motion.div key={p.id} {...s(i)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0" style={{background:`linear-gradient(90deg,${heat[i]}25,transparent)`,borderLeft:`3px solid ${heat[i]}`}}/>
          <span className="font-black text-2xl w-8 leading-none relative" style={{color:heat[i]}}>{p.pos}</span>
          <Av p={p} i={i} sz={34}/>
          <span className="flex-1 text-white font-semibold text-sm relative">{p.name}</span>
          <div className="relative flex items-center gap-1">
            {i<3 && <span className="text-base">{i===0?"🔥":i===1?"💫":"⭐"}</span>}
            <span className="font-black text-base tabular-nums" style={{color:heat[i]}}>{p.pts}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// 11. Cyberpunk
// ─────────────────────────────────────────────────────────────────
const Cyberpunk = () => (
  <div className="space-y-1 font-mono">
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0,x:40,skewX:5}} animate={{opacity:1,x:0,skewX:0}}
        transition={{delay:i*0.08,type:'spring',stiffness:200,damping:20}}
        className="flex items-center gap-2 px-3 py-2.5 rounded relative overflow-hidden"
        style={{background:'rgba(0,0,0,0.7)',border:`1px solid ${C(i)}50`,borderLeft:`3px solid ${C(i)}`}}>
        <div className="absolute inset-0" style={{background:`repeating-linear-gradient(90deg,transparent,transparent 2px,${C(i)}04 2px,${C(i)}04 4px)`}}/>
        <span className="text-[10px] font-black relative" style={{color:C(i)}}>#{String(p.pos).padStart(2,'0')}</span>
        <span className="flex-1 text-[11px] tracking-widest uppercase relative" style={{color:i===0?'white':'rgba(255,255,255,0.7)'}}>{p.name}</span>
        <span className="font-black text-sm tabular-nums relative" style={{color:C(i),textShadow:`0 0 8px ${C(i)}`}}>{p.pts}</span>
        <span className="text-[8px] relative" style={{color:C(i)+'80'}}>PTS</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 12. Newspaper
// ─────────────────────────────────────────────────────────────────
const Newspaper = () => (
  <div style={{background:'rgba(245,235,210,0.06)',border:'1px solid rgba(245,235,210,0.12)',borderRadius:8,padding:16,fontFamily:'Georgia,serif'}}>
    <div className="text-center mb-3 pb-2" style={{borderBottom:'2px solid rgba(245,235,210,0.2)'}}>
      <p className="text-[9px] uppercase tracking-[0.4em] text-amber-200/40">World Cup Chronicle</p>
      <p className="text-white font-bold text-base mt-0.5">Tournament Standings</p>
    </div>
    {P.map((p,i)=>(
      <motion.div key={p.id} {...s(i)} className="flex items-baseline gap-2 py-1.5"
        style={{borderBottom:'1px dotted rgba(245,235,210,0.1)'}}>
        <span className="text-amber-200/40 text-[10px] w-4">{p.pos}.</span>
        <span className="flex-1 text-white/80 text-xs italic">{p.name}</span>
        <span className="text-amber-200/60 text-[9px]">{'·'.repeat(20).slice(0,(20-p.name.length))}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:i<3?'#fbbf24':'rgba(255,255,255,0.7)'}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 13. Military Intel
// ─────────────────────────────────────────────────────────────────
const Military = () => (
  <div className="font-mono text-xs" style={{background:'rgba(0,20,0,0.6)',border:'1px solid rgba(0,100,0,0.4)',borderRadius:8,padding:16}}>
    <div className="flex items-center gap-2 mb-3">
      <span className="text-red-400 text-[9px] font-bold tracking-widest">⚠ CLASSIFIED · LEVEL 5 ⚠</span>
    </div>
    {P.map((p,i)=>(
      <motion.div key={p.id} {...s(i)} className="flex items-center gap-3 py-1.5 border-b" style={{borderColor:'rgba(0,100,0,0.2)'}}>
        <div className="w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-black text-black" style={{background:i<3?'#4ade80':'#374151'}}>{p.pos}</div>
        <span className="flex-1 text-green-300/80 text-[11px] tracking-widest uppercase">{p.name.replace(' ','_')}</span>
        <div className="text-right">
          <span className="text-green-400 font-bold">{p.pts.toFixed(1)}</span>
          <span className="text-green-400/40 text-[9px] ml-1">PTS</span>
        </div>
      </motion.div>
    ))}
    <div className="mt-2 text-[8px] text-green-400/30 tracking-widest">LAST UPDATED: {new Date().toISOString().slice(0,10)} · EYES ONLY</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 14. Trading Cards
// ─────────────────────────────────────────────────────────────────
const TradingCards = () => (
  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0,rotateY:90}} animate={{opacity:1,rotateY:0}}
        transition={{delay:i*0.12,duration:0.5}} style={{perspective:400}}
        className="rounded-2xl overflow-hidden aspect-[2/3] flex flex-col"
        style2={{boxShadow:`0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px ${C(i)}40`}}>
        <div className="flex-1 flex items-center justify-center" style={{background:`linear-gradient(135deg,${C(i)}44,${C(i)}88)`}}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl text-black" style={{background:C(i)}}>{p.av}</div>
        </div>
        <div className="px-2 py-2 text-center" style={{background:'rgba(0,0,0,0.8)'}}>
          <p className="text-white font-bold text-[10px] leading-tight truncate">{p.name}</p>
          <p className="font-black text-base" style={{color:C(i)}}>{p.pts}</p>
          <p className="text-[8px] text-white/30">#{p.pos}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 15. Brutalist
// ─────────────────────────────────────────────────────────────────
const Brutalist = () => (
  <div className="space-y-0 border-2 border-white" style={{background:'#000'}}>
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.08}}
        className="flex items-stretch border-b border-white/40 last:border-0">
        <div className="w-12 flex items-center justify-center font-black text-4xl border-r border-white/40"
          style={{color:i===0?'#fff':'rgba(255,255,255,0.2)'}}>{p.pos}</div>
        <div className="flex-1 px-4 py-3 flex items-center">
          <span className="font-black text-white uppercase text-sm tracking-widest">{p.name}</span>
        </div>
        <div className="px-4 flex items-center border-l border-white/40">
          <span className="font-black text-white text-base tabular-nums">{p.pts}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 16. Gold Standard
// ─────────────────────────────────────────────────────────────────
const GoldStandard = () => (
  <div className="space-y-2" style={{background:'linear-gradient(180deg,rgba(30,20,0,0.9),rgba(15,10,0,0.9))',padding:16,borderRadius:16,border:'1px solid rgba(251,191,36,0.3)'}}>
    <div className="text-center mb-4">
      <p className="font-black text-xl" style={{background:'linear-gradient(90deg,#b8860b,#ffd700,#b8860b)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>🏆 HALL OF FAME</p>
    </div>
    {P.map((p,i)=>(
      <motion.div key={p.id} {...s(i)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{background:`rgba(251,191,36,${0.05+Math.max(0,0.12-i*0.015)})`,border:`1px solid rgba(251,191,36,${0.4-i*0.05})`}}>
        <span className="font-black text-2xl w-7 text-center" style={{color:`rgba(251,191,36,${1-i*0.1})`}}>{p.pos}</span>
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs text-black" style={{background:`linear-gradient(135deg,#ffd700,#b8860b)`}}>{p.av}</div>
        <span className="flex-1 font-semibold text-sm" style={{color:`rgba(255,220,100,${1-i*0.08})`}}>{p.name}</span>
        <span className="font-black text-base tabular-nums" style={{color:'#ffd700'}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 17. Diamond Tier
// ─────────────────────────────────────────────────────────────────
const DiamondTier = () => {
  const tiers = [{label:"💎 Diamond",color:"#a78bfa",bg:"rgba(167,139,250,0.12)"},{label:"🔶 Platinum",color:"#67e8f9",bg:"rgba(103,232,249,0.1)"},{label:"🥇 Gold",color:"#fbbf24",bg:"rgba(251,191,36,0.1)"}];
  const groups = [[P[0]],[P[1],P[2]],[P[3],P[4],P[5],P[6]]];
  return (
    <div className="space-y-3">
      {groups.map((group,ti)=>(
        <div key={ti} className="rounded-2xl overflow-hidden" style={{border:`1px solid ${tiers[ti].color}30`}}>
          <div className="px-4 py-2 text-xs font-bold tracking-wider" style={{background:tiers[ti].bg,color:tiers[ti].color}}>{tiers[ti].label}</div>
          {group.map((p,i)=>(
            <motion.div key={p.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:ti*0.2+i*0.08}}
              className="flex items-center gap-3 px-4 py-2.5 border-t" style={{borderColor:`${tiers[ti].color}15`,background:'rgba(0,0,0,0.3)'}}>
              <Av p={p} i={p.pos-1} sz={30}/>
              <span className="flex-1 text-white font-semibold text-sm">{p.name}</span>
              <span className="font-black text-sm tabular-nums" style={{color:tiers[ti].color}}>{p.pts}</span>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// 18. Blueprint
// ─────────────────────────────────────────────────────────────────
const Blueprint = () => (
  <div className="font-mono text-xs" style={{background:'#0a1628',padding:16,borderRadius:8,border:'1px solid rgba(100,149,237,0.3)',backgroundImage:'linear-gradient(rgba(100,149,237,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(100,149,237,0.05) 1px,transparent 1px)',backgroundSize:'20px 20px'}}>
    <div className="text-center text-[9px] tracking-widest text-blue-300/40 mb-3 uppercase">Score Distribution Analysis v2.1</div>
    {P.map((p,i)=>(
      <motion.div key={p.id} {...s(i)} className="flex items-center gap-3 py-2 border-b" style={{borderColor:'rgba(100,149,237,0.1)'}}>
        <span className="text-blue-300/50 w-4 text-[10px]">0{p.pos}</span>
        <span className="flex-1 text-blue-200/80 text-[11px] tracking-wider">{p.name}</span>
        <div className="w-24 h-1 bg-blue-900/50 rounded overflow-hidden">
          <motion.div className="h-full rounded" style={{background:'rgba(100,149,237,0.8)'}}
            initial={{width:0}} animate={{width:`${(p.pts/MAX)*100}%`}} transition={{delay:i*0.1+0.3,duration:0.8}}/>
        </div>
        <span className="text-blue-300/80 w-10 text-right text-[11px] tabular-nums">{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 19. Casino Roulette
// ─────────────────────────────────────────────────────────────────
const Casino = () => (
  <div style={{background:'rgba(20,5,5,0.95)',border:'2px solid rgba(212,175,55,0.4)',borderRadius:12,padding:16,backgroundImage:'radial-gradient(circle at 50% 0%,rgba(212,175,55,0.1),transparent 60%)'}}>
    <div className="text-center font-bold text-sm mb-3" style={{color:'#d4af37',letterSpacing:'0.3em'}}>♠ WINNERS TABLE ♠</div>
    {P.map((p,i)=>(
      <motion.div key={p.id} {...s(i)} className="flex items-center gap-3 py-2.5 border-b" style={{borderColor:'rgba(212,175,55,0.12)'}}>
        <div className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-black"
          style={{borderColor:'#d4af37',color:'#d4af37',background:`rgba(212,175,55,${i<3?0.15:0.05})`}}>{p.pos}</div>
        <span className="flex-1 text-white/80 font-semibold text-sm">{p.name}</span>
        <div className="flex items-center gap-1.5">
          {i<3 && <span className="text-base">{['♦','♣','♥'][i]}</span>}
          <span className="font-black tabular-nums" style={{color:'#d4af37'}}>{p.pts}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 20. Constellation / Star Map
// ─────────────────────────────────────────────────────────────────
const Constellation = () => (
  <div className="space-y-2" style={{background:'rgba(0,2,15,0.95)',padding:16,borderRadius:12,backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.015) 1px,transparent 1px)',backgroundSize:'20px 20px'}}>
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}}
        transition={{delay:i*0.1,type:'spring',stiffness:200,damping:20}}
        className="flex items-center gap-3 px-4 py-3 rounded-xl relative"
        style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)'}}>
        {[...Array(p.pos===1?6:p.pos===2?5:p.pos===3?4:3)].map((_,j)=>(
          <div key={j} className="absolute w-0.5 h-0.5 rounded-full bg-white/40"
            style={{left:`${10+j*15}%`,top:`${20+j*20}%`,animationDelay:`${j*0.3}s`}}/>
        ))}
        <span className="text-yellow-200/30 font-bold text-sm w-5">{p.pos}</span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)'}}>
          {i===0?'⭐':i===1?'🌟':i===2?'✨':'💫'}
        </div>
        <span className="flex-1 text-white/70 font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums text-white/60">{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 21. Museum / Gallery
// ─────────────────────────────────────────────────────────────────
const Museum = () => (
  <div style={{background:'rgba(15,10,5,0.95)',padding:20,borderRadius:12}}>
    <div className="text-center mb-5 pb-3" style={{borderBottom:'1px solid rgba(200,160,80,0.2)'}}>
      <p className="text-[8px] tracking-[0.5em] uppercase" style={{color:'rgba(200,160,80,0.5)'}}>World Cup 2026</p>
      <p className="font-bold text-lg text-white mt-1">Leaderboard Exhibition</p>
    </div>
    <div className="space-y-5">
      {P.map((p,i)=>(
        <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
          className="flex items-start gap-4">
          <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 font-black text-xl"
            style={{background:`linear-gradient(135deg,${C(i)}33,${C(i)}11)`,border:`1px solid ${C(i)}40`,color:C(i)}}>{p.pos}</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">{p.name}</p>
            <div className="h-px w-full mt-1 mb-1" style={{background:`linear-gradient(90deg,${C(i)}80,transparent)`}}/>
            <p className="text-[9px] uppercase tracking-widest" style={{color:C(i)+'80'}}>Score · {p.pts} Points</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 22. Podium Stadium
// ─────────────────────────────────────────────────────────────────
const PodiumStadium = () => {
  const rest = P.slice(3);
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-center gap-2 pt-2">
        {[P[1],P[0],P[2]].map((p,i)=>{
          const h=[72,110,54][i]; const col=[SILVER,GOLD,BRONZE][i];
          return (
            <motion.div key={p.id} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.15}}
              className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-black" style={{background:col}}>{p.av}</div>
              <p className="text-white text-[10px] font-bold text-center truncate w-full px-1">{p.name.split(' ')[0]}</p>
              <p className="font-black text-xs" style={{color:col}}>{p.pts}</p>
              <div className="w-full rounded-t-xl flex items-start justify-center pt-2 font-black text-lg text-black"
                style={{height:h,background:`linear-gradient(180deg,${col},${col}88)`}}>{[2,1,3][i]}</div>
            </motion.div>
          );
        })}
      </div>
      <div className="space-y-1">
        {rest.map((p,i)=>(
          <motion.div key={p.id} initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:0.6+i*0.07}}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/4 border border-white/5">
            <span className="text-slate-500 text-xs w-4">{p.pos}</span>
            <Av p={p} i={p.pos-1} sz={24}/>
            <span className="flex-1 text-slate-300 text-xs">{p.name}</span>
            <span className="text-slate-400 text-xs font-bold tabular-nums">{p.pts}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// 23. Festival Lineup
// ─────────────────────────────────────────────────────────────────
const Festival = () => (
  <div className="text-center" style={{background:'linear-gradient(180deg,rgba(20,0,40,0.95),rgba(5,0,15,0.95))',padding:20,borderRadius:16,border:'1px solid rgba(168,85,247,0.3)'}}>
    <div className="mb-4">
      <p className="text-[9px] tracking-[0.5em] uppercase" style={{color:'rgba(216,180,254,0.5)'}}>⭐ World Cup 2026 ⭐</p>
      <p className="font-black text-2xl text-white mt-1">LEADERBOARD</p>
      <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mt-2"/>
    </div>
    <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.1}} className="mb-3">
      <p className="font-black text-3xl text-white">{P[0].name}</p>
      <p className="text-purple-300 text-sm font-bold">{P[0].pts} PTS · #1</p>
    </motion.div>
    <div className="flex justify-center gap-4 mb-3">
      {P.slice(1,3).map((p,i)=>(
        <motion.div key={p.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.1}}>
          <p className="font-black text-xl text-white">{p.name}</p>
          <p className="text-purple-400/70 text-xs">{p.pts} · #{p.pos}</p>
        </motion.div>
      ))}
    </div>
    <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-2"/>
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
      {P.slice(3).map((p,i)=>(
        <motion.span key={p.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4+i*0.07}}
          className="text-white/50 text-xs font-semibold">{p.name} ({p.pts})</motion.span>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 24. Dark Minimal — Ultra clean
// ─────────────────────────────────────────────────────────────────
const UltraMinimal = () => (
  <div>
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.08}}
        className="flex items-center py-4 gap-6" style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
        <span className="font-black text-5xl leading-none" style={{color:`rgba(255,255,255,${0.04+Math.max(0,0.15-i*0.02)})`,minWidth:48}}>{p.pos}</span>
        <span className="flex-1 font-semibold text-base" style={{color:`rgba(255,255,255,${1-i*0.1})`}}>{p.name}</span>
        <span className="font-black text-xl tabular-nums" style={{color:`rgba(255,255,255,${0.9-i*0.1})`}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 25. Heist Board (mission briefing)
// ─────────────────────────────────────────────────────────────────
const HeistBoard = () => (
  <div style={{background:'rgba(10,8,5,0.98)',padding:16,borderRadius:8,border:'1px solid rgba(255,200,50,0.2)',backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(255,200,50,0.03) 23px,rgba(255,200,50,0.03) 24px)'}}>
    <div className="flex items-center gap-2 mb-3">
      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"/>
      <span className="text-red-400/70 text-[9px] font-mono tracking-widest uppercase">OPERATION · SCOREBOARD</span>
    </div>
    {P.map((p,i)=>(
      <motion.div key={p.id} {...s(i)} className="flex items-center gap-3 py-2 border-b" style={{borderColor:'rgba(255,200,50,0.08)'}}>
        <div className="w-8 h-8 rounded border flex items-center justify-center font-black text-xs text-black"
          style={{background:i<3?'#fbbf24':'rgba(255,200,50,0.15)',borderColor:i<3?'#fbbf24':'rgba(255,200,50,0.3)',color:i<3?'#000':'rgba(255,200,50,0.7)'}}>{p.pos}</div>
        <div className="flex-1">
          <p className="text-white/80 text-xs font-bold uppercase tracking-wide">{p.name}</p>
          <p className="text-yellow-600/50 text-[8px] font-mono">TARGET · CONFIRMED</p>
        </div>
        <span className="font-black text-sm" style={{color:'rgba(255,200,50,0.9)'}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 26. Neon Outline Only
// ─────────────────────────────────────────────────────────────────
const NeonOutline = () => (
  <div className="space-y-2">
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:i*0.09}}
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{background:'transparent',border:`1px solid ${C(i)}`,boxShadow:`0 0 12px ${C(i)}30, inset 0 0 12px ${C(i)}08`}}>
        <span className="font-black text-2xl w-8 leading-none" style={{color:C(i),textShadow:`0 0 12px ${C(i)}`}}>{p.pos}</span>
        <span className="flex-1 font-bold text-sm" style={{color:C(i)+'cc'}}>{p.name}</span>
        <span className="font-black text-base tabular-nums" style={{color:C(i),textShadow:`0 0 8px ${C(i)}`}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 27. Spotlight (you are here)
// ─────────────────────────────────────────────────────────────────
const SpotlightMe = () => {
  const ME = P[2];
  return (
    <div className="space-y-1.5">
      {P.map((p,i)=>{
        const isMe = p.id === ME.id;
        return (
          <motion.div key={p.id} {...s(i)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
            style={{
              background: isMe?`linear-gradient(135deg,rgba(99,102,241,0.25),rgba(99,102,241,0.1))`:'rgba(255,255,255,0.03)',
              border: isMe?'2px solid rgba(99,102,241,0.6)':'1px solid rgba(255,255,255,0.05)',
              boxShadow: isMe?'0 0 24px rgba(99,102,241,0.25)':'none',
              opacity: isMe?1:0.55,
              transform: isMe?'scale(1.02)':'scale(1)',
            }}>
            {isMe && <div className="absolute -top-2 left-4 bg-indigo-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">YOU</div>}
            <span className="font-bold text-sm w-5" style={{color:isMe?'#a5b4fc':'rgba(255,255,255,0.3)'}}>{p.pos}</span>
            <Av p={p} i={i} sz={isMe?38:30}/>
            <span className="flex-1 font-semibold text-sm" style={{color:isMe?'white':'rgba(255,255,255,0.5)'}}>{p.name}</span>
            <span className="font-black text-base tabular-nums" style={{color:isMe?'#a5b4fc':'rgba(255,255,255,0.3)'}}>{p.pts}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// 28. Stacked 3D
// ─────────────────────────────────────────────────────────────────
const Stacked3D = () => (
  <div className="space-y-3" style={{perspective:800}}>
    {P.map((p,i)=>(
      <motion.div key={p.id}
        initial={{opacity:0,rotateX:-40,y:40}} animate={{opacity:1,rotateX:0,y:0}}
        transition={{delay:i*0.12,duration:0.55,ease:[0.23,1,0.32,1]}}
        style={{transformStyle:'preserve-3d',transformOrigin:'top center'}}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
        style2={{background:'rgba(255,255,255,0.05)',border:`1px solid ${C(i)}30`,boxShadow:`0 ${4+i*2}px ${12+i*4}px rgba(0,0,0,0.4)`}}>
        <span className="font-black text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <Av p={p} i={i} sz={34}/>
        <span className="flex-1 text-white font-semibold text-sm">{p.name}</span>
        <span className="font-black text-base tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 29. Wave Cascade
// ─────────────────────────────────────────────────────────────────
const WaveCascade = () => (
  <div className="space-y-2">
    {P.map((p,i)=>(
      <motion.div key={p.id}
        initial={{opacity:0,x:i%2===0?-100:100,rotate:i%2===0?-5:5}}
        animate={{opacity:1,x:0,rotate:0}}
        transition={{delay:i*0.1,type:'spring',stiffness:140,damping:18}}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{background:`linear-gradient(${i%2===0?'135':'225'}deg,${C(i)}18,rgba(255,255,255,0.04))`,border:`1px solid ${C(i)}25`}}>
        <span className="font-black text-2xl w-8 leading-none" style={{color:C(i),opacity:0.5}}>{p.pos}</span>
        <Av p={p} i={i} sz={34}/>
        <span className="flex-1 text-white font-semibold text-sm">{p.name}</span>
        <span className="font-black text-base tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 30. Ranking Stream (ticker feel)
// ─────────────────────────────────────────────────────────────────
const RankStream = () => (
  <div className="overflow-hidden rounded-2xl" style={{border:'1px solid rgba(255,255,255,0.08)'}}>
    {P.map((p,i)=>(
      <motion.div key={p.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
        className="flex items-center gap-0 border-b border-white/5 last:border-0">
        <div className="w-10 h-14 flex items-center justify-center flex-shrink-0 font-black text-lg"
          style={{background:`${C(i)}18`,color:C(i),borderRight:`2px solid ${C(i)}40`}}>{p.pos}</div>
        <div className="flex items-center gap-3 flex-1 px-4 h-14" style={{background:i%2===0?'rgba(255,255,255,0.02)':'transparent'}}>
          <Av p={p} i={i} sz={30}/>
          <span className="flex-1 text-white font-semibold text-sm">{p.name}</span>
        </div>
        <div className="w-20 h-14 flex items-center justify-center font-black text-base tabular-nums"
          style={{background:`${C(i)}10`,color:C(i),borderLeft:`1px solid ${C(i)}20`}}>{p.pts}</div>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════
const DEMOS = [
  {id:"cinematic",  label:"Cinematic Drop",    emoji:"🎬", C:Cinematic},
  {id:"neonarc",   label:"Neon Arcade",        emoji:"🕹️", C:NeonArcade},
  {id:"glasslux",  label:"Glass Luxury",       emoji:"💎", C:GlassLuxury},
  {id:"flipboard", label:"Flip Clock Board",   emoji:"✈️", C:FlipBoard},
  {id:"racing",    label:"Racing F1",          emoji:"🏎️", C:Racing},
  {id:"comic",     label:"Comic Book",         emoji:"💥", C:ComicBook},
  {id:"holo",      label:"Holographic",        emoji:"🌈", C:Holographic},
  {id:"terminal",  label:"Retro Terminal",     emoji:"💻", C:Terminal},
  {id:"space",     label:"Space Mission",      emoji:"🚀", C:Space},
  {id:"fire",      label:"Fire Ranking",       emoji:"🔥", C:FireRank},
  {id:"cyber",     label:"Cyberpunk",          emoji:"⚡", C:Cyberpunk},
  {id:"news",      label:"Newspaper",          emoji:"📰", C:Newspaper},
  {id:"military",  label:"Military Intel",     emoji:"🎖️", C:Military},
  {id:"cards",     label:"Trading Cards",      emoji:"🃏", C:TradingCards},
  {id:"brutal",    label:"Brutalist",          emoji:"◼", C:Brutalist},
  {id:"gold",      label:"Gold Standard",      emoji:"🏆", C:GoldStandard},
  {id:"diamond",   label:"Diamond Tier",       emoji:"💠", C:DiamondTier},
  {id:"blueprint", label:"Blueprint",          emoji:"📐", C:Blueprint},
  {id:"casino",    label:"Casino",             emoji:"♠️", C:Casino},
  {id:"stars",     label:"Constellation",      emoji:"🌌", C:Constellation},
  {id:"museum",    label:"Museum Gallery",     emoji:"🖼️", C:Museum},
  {id:"podium",    label:"Podium Stadium",     emoji:"🏟️", C:PodiumStadium},
  {id:"festival",  label:"Festival Lineup",    emoji:"🎪", C:Festival},
  {id:"minimal",   label:"Ultra Minimal",      emoji:"▫️", C:UltraMinimal},
  {id:"heist",     label:"Heist Board",        emoji:"🎯", C:HeistBoard},
  {id:"outline",   label:"Neon Outline",       emoji:"✨", C:NeonOutline},
  {id:"spotlight", label:"Spotlight (You)",    emoji:"💡", C:SpotlightMe},
  {id:"3d",        label:"Stacked 3D",         emoji:"🎲", C:Stacked3D},
  {id:"wave",      label:"Wave Cascade",       emoji:"🌊", C:WaveCascade},
  {id:"stream",    label:"Ranking Stream",     emoji:"📊", C:RankStream},
];

export default function AdminDramaLeaderboard() {
  const [active, setActive] = useState("cinematic");
  const cur = DEMOS.find(d=>d.id===active);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">דמו — 30 עיצובי טבלת משתמשים</h2>
        <p className="text-slate-500 text-sm mt-1">דרמטי · מלוטש · מרהיב</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {DEMOS.map(d=>(
          <button key={d.id} onClick={()=>setActive(d.id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              active===d.id?"bg-indigo-500/20 border-indigo-400/50 text-indigo-300":"bg-white/4 border-white/8 text-slate-400 hover:text-white hover:bg-white/8"}`}>
            {d.emoji} {d.label}
          </button>
        ))}
      </div>
      <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}>
            <cur.C />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="text-slate-600 text-xs text-center">בחר עיצוב ואיישם על הטבלה האמיתית</p>
    </div>
  );
}
