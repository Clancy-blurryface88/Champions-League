import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

const PLAYERS = [
  { id:1, name:"אלון כהן",    pts:187.5, pos:1 },
  { id:2, name:"מיכל לוי",   pts:162.0, pos:2 },
  { id:3, name:"יוסי דוד",   pts:148.5, pos:3 },
  { id:4, name:"רונית שמיר", pts:134.0, pos:4 },
  { id:5, name:"דני פרידמן", pts:121.5, pos:5 },
  { id:6, name:"שרה גולן",   pts:109.0, pos:6 },
  { id:7, name:"עמי רוזן",   pts: 97.5, pos:7 },
];
const MAX = PLAYERS[0].pts;
const COLORS = ["#fbbf24","#94a3b8","#b45309","#6366f1","#ec4899","#14b8a6","#84cc16"];
const getColor = i => COLORS[i % COLORS.length];
const getInitials = n => n.split(" ").map(w=>w[0]).join("").slice(0,2);
const medal = p => p===1?"🥇":p===2?"🥈":p===3?"🥉":null;

const Avatar = ({ p, size=36 }) => (
  <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 text-sm"
    style={{ width:size, height:size, background: getColor(p.pos-1), fontSize: size*0.35 }}>
    {getInitials(p.name)}
  </div>
);

const stagger = i => ({ initial:{opacity:0,y:8}, animate:{opacity:1,y:0}, transition:{delay:i*0.05} });

// ══════════════════════════════════════════════════════════════════════════════
// 1. Classic Flat
// ══════════════════════════════════════════════════════════════════════════════
const ClassicFlat = () => (
  <div className="space-y-1.5">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/4 border border-white/6">
        <span className="w-6 text-center text-slate-500 font-bold text-sm">{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="text-amber-400 font-bold tabular-nums text-sm">{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 2. Racing Bars
// ══════════════════════════════════════════════════════════════════════════════
const RacingBars = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)} className="space-y-0.5">
        <div className="flex justify-between text-xs px-1">
          <span className="text-white/70">{p.pos}. {p.name}</span>
          <span className="text-amber-400 font-bold">{p.pts}</span>
        </div>
        <div className="h-6 bg-white/5 rounded-lg overflow-hidden">
          <motion.div initial={{width:0}} animate={{width:`${(p.pts/MAX)*100}%`}}
            transition={{delay:i*0.07,duration:0.8,ease:"easeOut"}}
            className="h-full rounded-lg flex items-center justify-end pr-2"
            style={{background:`linear-gradient(90deg,${getColor(i)}44,${getColor(i)})`}}>
            <Avatar p={p} size={20} />
          </motion.div>
        </div>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 3. Glass Cards
// ══════════════════════════════════════════════════════════════════════════════
const GlassCards = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.10)',backdropFilter:'blur(12px)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.07)'}}>
        <span className="text-2xl w-8 text-center">{medal(p.pos)||p.pos}</span>
        <Avatar p={p} />
        <span className="flex-1 text-white font-semibold text-sm">{p.name}</span>
        <span className="font-black tabular-nums" style={{color:getColor(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 4. Bold Rank Number
// ══════════════════════════════════════════════════════════════════════════════
const BoldRank = () => (
  <div className="space-y-1.5">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/6"
        style={{background:'rgba(255,255,255,0.03)'}}>
        <span className="font-black text-4xl w-14 text-center leading-none"
          style={{color:getColor(i),opacity:0.5}}>{p.pos}</span>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm leading-tight">{p.name}</p>
          <p className="text-slate-500 text-xs">#{p.pos}</p>
        </div>
        <span className="text-white font-bold text-sm tabular-nums">{p.pts} <span className="text-slate-600 text-xs">pts</span></span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 5. Neon Arcade
// ══════════════════════════════════════════════════════════════════════════════
const NeonArcade = () => (
  <div className="space-y-1.5 font-mono">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg"
        style={{background:'rgba(0,255,100,0.04)',border:'1px solid rgba(0,255,100,0.15)',boxShadow:`0 0 8px rgba(0,255,100,0.05)`}}>
        <span className="text-green-400 text-xs w-4">{String(p.pos).padStart(2,'0')}</span>
        <span className="flex-1 text-green-300 text-xs tracking-widest uppercase">{p.name}</span>
        <span className="text-green-400 font-bold text-sm tabular-nums" style={{textShadow:'0 0 8px rgba(0,255,100,0.6)'}}>{p.pts.toFixed(1)}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 6. Gradient Rank Cards
// ══════════════════════════════════════════════════════════════════════════════
const GradientRank = () => (
  <div className="space-y-1.5">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
        style={{background:`linear-gradient(135deg,${getColor(i)}18,${getColor(i)}06)`,border:`1px solid ${getColor(i)}30`}}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{background:getColor(i),color:'#000'}}>{p.pos}</div>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold tabular-nums text-sm" style={{color:getColor(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 7. Compact Chips
// ══════════════════════════════════════════════════════════════════════════════
const CompactChips = () => (
  <div className="flex flex-wrap gap-2">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center gap-2 px-3 py-2 rounded-full"
        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}>
        <span className="text-xs font-bold" style={{color:getColor(i)}}>#{p.pos}</span>
        <Avatar p={p} size={24} />
        <span className="text-white text-xs font-semibold">{p.name.split(' ')[0]}</span>
        <span className="text-amber-400 text-xs font-bold">{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 8. Score Focus
// ══════════════════════════════════════════════════════════════════════════════
const ScoreFocus = () => (
  <div className="space-y-1.5">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/4 border border-white/6">
        <span className="text-slate-600 text-xs w-4">{p.pos}</span>
        <span className="flex-1 text-slate-300 text-xs">{p.name}</span>
        <span className="font-black text-2xl tabular-nums leading-none" style={{color:getColor(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 9. Name Tag
// ══════════════════════════════════════════════════════════════════════════════
const NameTag = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-stretch rounded-xl overflow-hidden border border-white/8">
        <div className="w-10 flex items-center justify-center text-black font-black text-sm"
          style={{background:getColor(i)}}>{p.pos}</div>
        <div className="flex-1 px-3 py-2 flex items-center justify-between bg-white/4">
          <span className="text-white font-semibold text-sm">{p.name}</span>
          <span className="text-slate-400 font-bold text-sm tabular-nums">{p.pts}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 10. Flip Board (airport style)
// ══════════════════════════════════════════════════════════════════════════════
const FlipBoard = () => (
  <div className="space-y-0.5 font-mono">
    <div className="flex text-[10px] text-slate-600 px-3 pb-1 uppercase tracking-widest">
      <span className="w-8">מקום</span><span className="flex-1">שם</span><span className="w-20 text-left">נקודות</span>
    </div>
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center px-3 py-1.5 text-sm"
        style={{background: i%2===0?'rgba(255,255,255,0.03)':'transparent', borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
        <span className="w-8 text-amber-500 font-bold">{p.pos}</span>
        <span className="flex-1 text-green-300 tracking-wide">{p.name}</span>
        <span className="w-20 text-left text-amber-400 font-bold tabular-nums">{p.pts.toFixed(1)}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 11. Rank Badge
// ══════════════════════════════════════════════════════════════════════════════
const RankBadge = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/4 border border-white/6">
        <div className="w-12 h-12 rounded-full flex flex-col items-center justify-center flex-shrink-0"
          style={{background:`radial-gradient(circle,${getColor(i)}44,${getColor(i)}22)`,border:`2px solid ${getColor(i)}60`}}>
          <span className="font-black text-lg leading-none" style={{color:getColor(i)}}>{p.pos}</span>
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{p.name}</p>
          <div className="h-1 mt-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{background:getColor(i)}}
              initial={{width:0}} animate={{width:`${(p.pts/MAX)*100}%`}} transition={{delay:i*0.07+0.3,duration:0.6}} />
          </div>
        </div>
        <span className="font-black tabular-nums text-sm" style={{color:getColor(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 12. Two-Column Grid
// ══════════════════════════════════════════════════════════════════════════════
const TwoColumn = () => (
  <div className="grid grid-cols-2 gap-2">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex flex-col items-center gap-2 p-3 rounded-2xl text-center"
        style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${getColor(i)}30`}}>
        <Avatar p={p} size={40} />
        <p className="text-white font-semibold text-xs leading-tight">{p.name}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 text-xs">#{p.pos}</span>
          <span className="font-black text-sm" style={{color:getColor(i)}}>{p.pts}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 13. Striped Table
// ══════════════════════════════════════════════════════════════════════════════
const StripedTable = () => (
  <div className="rounded-xl overflow-hidden border border-white/8">
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5 last:border-0"
        style={{background: i%2===0?'rgba(255,255,255,0.03)':'rgba(255,255,255,0.01)'}}>
        <span className="text-slate-600 text-xs w-5">{p.pos}</span>
        <Avatar p={p} size={28} />
        <span className="flex-1 text-white text-sm font-medium">{p.name}</span>
        <span className="text-amber-400 font-bold text-sm tabular-nums">{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 14. Timeline
// ══════════════════════════════════════════════════════════════════════════════
const Timeline = () => (
  <div className="relative pl-8">
    <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)} className="relative mb-3 flex items-center gap-3">
        <div className="absolute -left-[18px] w-4 h-4 rounded-full border-2 border-slate-700 flex items-center justify-center"
          style={{background:getColor(i)}}>
          <span className="text-[8px] font-black text-black">{p.pos}</span>
        </div>
        <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-white/4 border border-white/6">
          <span className="text-white text-sm font-medium">{p.name}</span>
          <span className="font-bold text-sm tabular-nums" style={{color:getColor(i)}}>{p.pts}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 15. Podium + Dense list
// ══════════════════════════════════════════════════════════════════════════════
const PodiumDense = () => {
  const [p1,p2,p3] = PLAYERS; const rest = PLAYERS.slice(3);
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-center gap-2">
        {[p2,p1,p3].map((p,i)=>{
          const h = [64,96,48][i];
          return (
            <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1*i}}
              className="flex-1 flex flex-col items-center gap-1">
              <Avatar p={p} size={32} />
              <span className="text-white text-[10px] font-semibold text-center leading-tight">{p.name.split(' ')[0]}</span>
              <div className="w-full rounded-t-xl flex items-start justify-center pt-1.5 text-black font-black text-sm"
                style={{height:h,background:getColor(p.pos-1)}}>{medal(p.pos)||p.pos}</div>
            </motion.div>
          );
        })}
      </div>
      <div className="space-y-1">
        {rest.map((p,i)=>(
          <motion.div key={p.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.07}}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/5">
            <span className="text-slate-500 text-xs w-4">{p.pos}</span>
            <Avatar p={p} size={20} />
            <span className="flex-1 text-slate-300 text-xs">{p.name}</span>
            <span className="text-slate-400 text-xs font-bold">{p.pts}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 16. Bento
// ══════════════════════════════════════════════════════════════════════════════
const Bento = () => {
  const [p1,p2,p3] = PLAYERS; const rest = PLAYERS.slice(3);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
          className="col-span-2 rounded-2xl p-4 flex items-center gap-3"
          style={{background:`linear-gradient(135deg,${getColor(0)}22,${getColor(0)}08)`,border:`1px solid ${getColor(0)}40`}}>
          <Avatar p={p1} size={44} />
          <div><p className="text-white font-bold text-sm">{p1.name}</p>
            <p className="font-black text-2xl" style={{color:getColor(0)}}>{p1.pts}</p></div>
          <span className="ml-auto text-3xl">🥇</span>
        </motion.div>
        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.1}}
          className="rounded-2xl p-3 flex flex-col items-center justify-center gap-1"
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
          <span className="text-2xl">🥈</span>
          <Avatar p={p2} size={28} />
          <p className="text-white text-[10px] font-semibold text-center">{p2.name.split(' ')[0]}</p>
          <p className="font-black text-sm" style={{color:getColor(1)}}>{p2.pts}</p>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.15}}
          className="rounded-2xl p-3 flex items-center gap-2"
          style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${getColor(2)}30`}}>
          <span className="text-xl">🥉</span><Avatar p={p3} size={28} />
          <div><p className="text-white text-xs font-semibold">{p3.name}</p>
            <p className="font-bold text-sm" style={{color:getColor(2)}}>{p3.pts}</p></div>
        </motion.div>
        <div className="space-y-1.5">
          {rest.slice(0,2).map((p,i)=>(
            <motion.div key={p.id} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:0.2+i*0.07}}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/4 border border-white/5">
              <span className="text-slate-500 text-xs">{p.pos}</span>
              <Avatar p={p} size={20} />
              <span className="flex-1 text-slate-300 text-xs truncate">{p.name}</span>
              <span className="text-xs font-bold" style={{color:getColor(p.pos-1)}}>{p.pts}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 17. Radial Progress
// ══════════════════════════════════════════════════════════════════════════════
const RadialProgress = () => {
  const R=16, C=20, stroke=3, circ=2*Math.PI*R;
  return (
    <div className="space-y-2">
      {PLAYERS.map((p,i)=>{
        const pct = p.pts/MAX;
        return (
          <motion.div key={p.id} {...stagger(i)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/4 border border-white/6">
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg width={C*2} height={C*2} style={{transform:'rotate(-90deg)',position:'absolute'}}>
                <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke}/>
                <motion.circle cx={C} cy={C} r={R} fill="none" stroke={getColor(i)} strokeWidth={stroke}
                  strokeLinecap="round"
                  initial={{strokeDasharray:`0 ${circ}`}}
                  animate={{strokeDasharray:`${circ*pct} ${circ}`}}
                  transition={{delay:i*0.07+0.2,duration:0.8}}/>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black"
                style={{color:getColor(i)}}>{p.pos}</span>
            </div>
            <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
            <span className="font-bold tabular-nums text-sm" style={{color:getColor(i)}}>{p.pts}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 18. 3D Depth Cards
// ══════════════════════════════════════════════════════════════════════════════
const DepthCards = () => (
  <div className="space-y-2" style={{perspective:800}}>
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id}
        initial={{opacity:0,rotateX:-20,y:20}} animate={{opacity:1,rotateX:0,y:0}}
        transition={{delay:i*0.07,duration:0.5}}
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
          background:'rgba(255,255,255,0.05)',
          border:'1px solid rgba(255,255,255,0.1)',
          boxShadow:`0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
          transformStyle:'preserve-3d',
        }}>
        <Avatar p={p} size={32} />
        <span className="flex-1 text-white font-semibold text-sm">{p.name}</span>
        <span className="text-slate-500 text-xs">#{p.pos}</span>
        <span className="font-black text-sm tabular-nums" style={{color:getColor(i)}}>{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 19. Minimal Ultra-Thin
// ══════════════════════════════════════════════════════════════════════════════
const Minimal = () => (
  <div>
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} {...stagger(i)}
        className="flex items-center py-2.5 border-b border-white/5 last:border-0 gap-3">
        <span className="text-slate-700 text-xs w-4">{p.pos}</span>
        <span className="flex-1 text-white/80 text-sm">{p.name}</span>
        <span className="text-white/50 text-sm tabular-nums">{p.pts}</span>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 20. Spotlight (current user style)
// ══════════════════════════════════════════════════════════════════════════════
const Spotlight = () => {
  const ME = PLAYERS[3];
  const above = PLAYERS.slice(0,3);
  const below = PLAYERS.slice(4);
  return (
    <div className="space-y-1.5">
      {above.map((p,i)=>(
        <motion.div key={p.id} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
          className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3 border border-white/5 opacity-55">
          <span className="text-slate-600 text-xs w-4">{p.pos}</span>
          <Avatar p={p} size={24} />
          <span className="flex-1 text-slate-400 text-xs">{p.name}</span>
          <span className="text-slate-500 text-xs font-bold">{p.pts}</span>
          <span className="text-rose-400/60 text-[10px]">-{(p.pts-ME.pts).toFixed(1)}</span>
        </motion.div>
      ))}
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.25}}
        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl relative"
        style={{background:'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(99,102,241,0.08))',border:'2px solid rgba(99,102,241,0.5)',boxShadow:'0 0 20px rgba(99,102,241,0.2)'}}>
        <div className="absolute -top-2.5 right-4 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">אתה · #{ME.pos}</div>
        <Avatar p={ME} size={36} />
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{ME.name}</p>
          <p className="text-indigo-300 font-black text-xl tabular-nums leading-tight">{ME.pts}</p>
        </div>
        <div className="text-right text-[10px] space-y-0.5">
          <div className="text-rose-400">-{(PLAYERS[2].pts-ME.pts).toFixed(1)} מ-#3</div>
          <div className="text-emerald-400">+{(ME.pts-PLAYERS[4].pts).toFixed(1)} מ-#5</div>
        </div>
      </motion.div>
      {below.map((p,i)=>(
        <motion.div key={p.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.35+i*0.07}}
          className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3 border border-white/5 opacity-55">
          <span className="text-slate-600 text-xs w-4">{p.pos}</span>
          <Avatar p={p} size={24} />
          <span className="flex-1 text-slate-400 text-xs">{p.name}</span>
          <span className="text-slate-500 text-xs font-bold">{p.pts}</span>
          <span className="text-emerald-400/60 text-[10px]">+{(ME.pts-p.pts).toFixed(1)}</span>
        </motion.div>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
const DEMOS = [
  { id:"classic",   label:"Classic Flat",    emoji:"📋", C:ClassicFlat },
  { id:"racing",    label:"Racing Bars",     emoji:"🏁", C:RacingBars },
  { id:"glass",     label:"Glass Cards",     emoji:"🪟", C:GlassCards },
  { id:"bold",      label:"Bold Rank",       emoji:"🔢", C:BoldRank },
  { id:"neon",      label:"Neon Arcade",     emoji:"🕹️", C:NeonArcade },
  { id:"gradient",  label:"Gradient Rank",   emoji:"🌈", C:GradientRank },
  { id:"chips",     label:"Compact Chips",   emoji:"🪙", C:CompactChips },
  { id:"score",     label:"Score Focus",     emoji:"🎯", C:ScoreFocus },
  { id:"nametag",   label:"Name Tag",        emoji:"🏷️", C:NameTag },
  { id:"flip",      label:"Flip Board",      emoji:"✈️", C:FlipBoard },
  { id:"badge",     label:"Rank Badge",      emoji:"🎖️", C:RankBadge },
  { id:"twocol",    label:"Two Column",      emoji:"⬛", C:TwoColumn },
  { id:"striped",   label:"Striped Table",   emoji:"🦓", C:StripedTable },
  { id:"timeline",  label:"Timeline",        emoji:"📅", C:Timeline },
  { id:"podium",    label:"Podium + Dense",  emoji:"🏆", C:PodiumDense },
  { id:"bento",     label:"Bento Grid",      emoji:"⊞",  C:Bento },
  { id:"radial",    label:"Radial Progress", emoji:"🌀", C:RadialProgress },
  { id:"depth",     label:"3D Depth",        emoji:"🎲", C:DepthCards },
  { id:"minimal",   label:"Ultra Minimal",   emoji:"➖", C:Minimal },
  { id:"spotlight", label:"Spotlight",       emoji:"💡", C:Spotlight },
];

export default function AdminLeaderboardStylesDemo() {
  const [active, setActive] = useState("classic");
  const cur = DEMOS.find(d=>d.id===active);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">דמו — עיצובי שורת משתתף בטבלה</h2>
        <p className="text-slate-500 text-sm mt-1">20 סגנונות • נתוני דמו בלבד</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEMOS.map(d=>(
          <button key={d.id} onClick={()=>setActive(d.id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              active===d.id
                ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-300"
                : "bg-white/4 border-white/8 text-slate-400 hover:text-white hover:bg-white/8"
            }`}>
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
            transition={{duration:0.18}}>
            <cur.C />
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-slate-600 text-xs text-center">בחר סגנון ואבנה אותו על הנתונים האמיתיים</p>
    </div>
  );
}
