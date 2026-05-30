import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// ── 1. Gradient Fade Right ────────────────────────────────────────────────────
const GradientFade = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
        style={{border:'1px solid rgba(255,255,255,0.07)'}}>
        <div className="absolute inset-0"
          style={{background:`linear-gradient(90deg,${C(i)}18 0%,rgba(255,255,255,0.03) 45%,transparent 100%)`}} />
        <span className="font-bold text-sm w-5 relative" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm relative">{p.name}</span>
        <span className="font-bold text-sm tabular-nums relative" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 2. Corner Ribbon ─────────────────────────────────────────────────────────
const CornerRibbon = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
        style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
        {/* Corner ribbon */}
        <div className="absolute top-0 right-0 overflow-hidden w-14 h-14">
          <div className="absolute transform rotate-45 text-black font-black text-[9px] flex items-center justify-center"
            style={{background:C(i),width:56,height:20,top:12,right:-10}}>#{p.pos}</div>
        </div>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums mr-8" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 3. Dashed Border ─────────────────────────────────────────────────────────
const DashedBorder = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{background:'rgba(255,255,255,0.03)',border:`1.5px dashed ${C(i)}50`}}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 4. Diagonal Split ────────────────────────────────────────────────────────
const DiagonalSplit = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative flex items-center gap-3 h-12 rounded-xl overflow-hidden"
        style={{border:'1px solid rgba(255,255,255,0.07)'}}>
        {/* Diagonal split background */}
        <div className="absolute inset-0" style={{
          background:`linear-gradient(115deg,${C(i)}22 0%,${C(i)}22 40%,rgba(255,255,255,0.03) 40%,rgba(255,255,255,0.03) 100%)`
        }} />
        <div className="relative flex items-center gap-3 w-full px-4">
          <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        </div>
      </div>
    ))}
  </div>
);

// ── 5. Neon Tube ─────────────────────────────────────────────────────────────
const NeonTube = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-5 py-3 rounded-full"
        style={{
          background:`linear-gradient(90deg,${C(i)}12,${C(i)}06)`,
          border:`1px solid ${C(i)}40`,
          boxShadow:`0 0 16px ${C(i)}20, inset 0 1px 0 ${C(i)}30, inset 0 -1px 0 rgba(0,0,0,0.3)`,
        }}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 6. Credit Card ───────────────────────────────────────────────────────────
const CreditCard = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative flex items-center gap-3 px-4 py-4 rounded-2xl"
        style={{
          background:`linear-gradient(135deg,rgba(30,40,70,0.95),rgba(15,22,45,0.95))`,
          border:`1px solid ${C(i)}30`,
          boxShadow:`0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}>
        {/* Holographic stripe */}
        <div className="absolute right-4 top-0 bottom-0 w-8 rounded-r-2xl"
          style={{background:`linear-gradient(180deg,${C(i)}30,transparent,${C(i)}20)`}} />
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm"
          style={{background:`linear-gradient(135deg,${C(i)},${C(i)}bb)`}}>{p.pos}</div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{p.name}</p>
          <p className="text-slate-500 text-[10px] font-mono tracking-widest">**** **** ****</p>
        </div>
        <span className="font-black text-lg tabular-nums mr-10" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 7. Road Sign (octagon) ───────────────────────────────────────────────────
const RoadSign = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3"
        style={{
          clipPath:'polygon(8px 0%,calc(100% - 8px) 0%,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0% calc(100% - 8px),0% 8px)',
          background:'rgba(255,255,255,0.05)',
          border:`1px solid ${C(i)}40`,
        }}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 8. Torn Edge ─────────────────────────────────────────────────────────────
const TornEdge = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} style={{
        clipPath:`polygon(0 0,100% 0,100% 70%,97% 85%,94% 75%,91% 88%,88% 72%,85% 86%,82% 74%,79% 88%,76% 73%,73% 87%,70% 75%,67% 88%,64% 73%,61% 87%,58% 74%,55% 88%,52% 73%,49% 87%,46% 74%,43% 88%,40% 73%,37% 87%,34% 74%,31% 88%,28% 73%,25% 87%,22% 74%,19% 88%,16% 73%,13% 87%,10% 74%,7% 88%,4% 73%,0 85%)`,
        background:'rgba(255,255,255,0.05)',
        border:`1px solid ${C(i)}25`,
        padding:'12px 16px 24px',
        display:'flex', alignItems:'center', gap:12,
      }}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 9. Folded Corner ─────────────────────────────────────────────────────────
const FoldedCorner = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)'}}>
        {/* Folded corner */}
        <div style={{
          position:'absolute', bottom:0, left:0, width:0, height:0,
          borderStyle:'solid', borderWidth:'14px 14px 0 0',
          borderColor:`transparent rgba(255,255,255,0.15) transparent transparent`,
          transform:'rotate(90deg)',
          borderBottomLeftRadius:2,
        }} />
        <div style={{
          position:'absolute', bottom:0, left:0, width:0, height:0,
          borderStyle:'solid', borderWidth:'14px 0 0 14px',
          borderColor:`transparent transparent transparent ${C(i)}60`,
          borderBottomLeftRadius:2,
        }} />
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 10. Wave Bottom ──────────────────────────────────────────────────────────
const WaveBottom = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} style={{position:'relative',paddingBottom:10}}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-t-xl"
          style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderBottom:'none'}}>
          <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        </div>
        <svg style={{position:'absolute',bottom:0,left:0,right:0,width:'100%',height:12,overflow:'visible'}} viewBox="0 0 300 12" preserveAspectRatio="none">
          <path d="M0,0 Q75,12 150,4 Q225,-4 300,8 L300,12 L0,12 Z" fill={`${C(i)}22`} />
          <path d="M0,0 Q75,12 150,4 Q225,-4 300,8" fill="none" stroke={C(i)} strokeWidth="1" strokeOpacity="0.4"/>
        </svg>
      </div>
    ))}
  </div>
);

// ── 11. Hexagon ──────────────────────────────────────────────────────────────
const Hexagon = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-6 py-3"
        style={{
          clipPath:'polygon(12px 0%,calc(100% - 12px) 0%,100% 50%,calc(100% - 12px) 100%,12px 100%,0% 50%)',
          background:`linear-gradient(90deg,${C(i)}18,rgba(255,255,255,0.04),${C(i)}10)`,
          border:`1px solid ${C(i)}35`,
        }}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 12. Full Arrow Right ─────────────────────────────────────────────────────
const ArrowRight = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 pl-5 py-3"
        style={{
          clipPath:'polygon(0% 0%,calc(100% - 16px) 0%,100% 50%,calc(100% - 16px) 100%,0% 100%)',
          background:'rgba(255,255,255,0.05)',
          borderTop:`1px solid ${C(i)}30`,
          borderBottom:`1px solid ${C(i)}20`,
        }}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums mr-4" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 13. LCD Display ──────────────────────────────────────────────────────────
const LCD = () => (
  <div className="space-y-1.5 font-mono"
    style={{background:'rgba(0,20,0,0.6)',padding:12,borderRadius:12,border:'2px solid rgba(0,100,0,0.4)'}}>
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-3 py-2"
        style={{background:i%2===0?'rgba(0,255,0,0.04)':'transparent',borderRadius:4}}>
        <span className="text-xs w-5" style={{color:'rgba(0,255,0,0.5)'}}>0{p.pos}</span>
        <span className="flex-1 text-xs tracking-widest uppercase" style={{color:'rgba(0,255,0,0.85)'}}>{p.name}</span>
        <span className="text-xs font-bold tabular-nums" style={{color:'rgba(0,255,0,0.7)',textShadow:'0 0 8px rgba(0,255,0,0.5)'}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 14. Beveled Edges ────────────────────────────────────────────────────────
const Beveled = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3"
        style={{
          clipPath:'polygon(6px 0%,calc(100% - 6px) 0%,100% 6px,100% calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,0% calc(100% - 6px),0% 6px)',
          background:'rgba(255,255,255,0.05)',
          outline:`1px solid ${C(i)}40`,
        }}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 15. Stair / Step ─────────────────────────────────────────────────────────
const Stair = () => (
  <div className="space-y-0">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 relative"
        style={{marginLeft: Math.min(i*8, 40), background:'rgba(255,255,255,0.03)',borderLeft:`3px solid ${C(i)}`}}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 16. Chat Bubble ──────────────────────────────────────────────────────────
const ChatBubble = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{
          background:'rgba(255,255,255,0.05)',
          border:`1px solid ${C(i)}30`,
          borderBottomLeftRadius: i%2===0 ? 4 : 18,
          borderBottomRightRadius: i%2===1 ? 4 : 18,
        }}>
        {/* Tail */}
        <div style={{
          position:'absolute',
          bottom:-8, [i%2===0?'left':'right']:16,
          width:0, height:0,
          borderLeft: i%2===0?`8px solid transparent`:undefined,
          borderRight: i%2===1?`8px solid transparent`:undefined,
          borderTop:`8px solid ${C(i)}30`,
        }} />
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 17. Gradient Border (via wrapper) ────────────────────────────────────────
const GradientBorder = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="p-px rounded-xl"
        style={{background:`linear-gradient(135deg,${C(i)},${C((i+2)%7)},${C((i+4)%7)})`}}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-[11px]"
          style={{background:'rgba(12,18,36,0.95)'}}>
          <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        </div>
      </div>
    ))}
  </div>
);

// ── 18. Half Cut ─────────────────────────────────────────────────────────────
const HalfCut = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3"
        style={{
          clipPath:`polygon(0 0,100% 0,100% 100%,${20+(i*3)}px 100%)`,
          background:'rgba(255,255,255,0.05)',
          borderTop:`1px solid ${C(i)}35`,
          borderRight:`1px solid ${C(i)}25`,
        }}>
        <span className="font-bold text-sm w-5" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 19. Newspaper Column ─────────────────────────────────────────────────────
const Newspaper = () => (
  <div style={{columnCount:2, columnGap:12}}>
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="break-inside-avoid mb-2 px-3 py-2.5 rounded-lg"
        style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${C(i)}25`,borderLeft:`3px solid ${C(i)}`}}>
        <div className="flex items-center justify-between">
          <span className="font-black text-xs" style={{color:C(i)}}>#{p.pos}</span>
          <span className="font-bold text-xs tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        </div>
        <p className="text-white font-semibold text-xs mt-0.5 leading-tight">{p.name}</p>
      </div>
    ))}
  </div>
);

// ── 20. Bracket / Code Block ─────────────────────────────────────────────────
const CodeBlock = () => (
  <div className="space-y-1.5 font-mono text-xs"
    style={{background:'rgba(0,0,0,0.4)',borderRadius:12,padding:12,border:'1px solid rgba(255,255,255,0.08)'}}>
    <div className="text-slate-600 mb-2">{'{'} leaderboard {'}'}</div>
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-2 px-2 py-1 rounded"
        style={{background: i===0?'rgba(255,255,255,0.04)':'transparent'}}>
        <span style={{color:C(i)}}>"{p.pos}"</span>
        <span className="text-slate-600">:</span>
        <span className="text-emerald-400">{'{'}</span>
        <span className="text-blue-300">name</span>
        <span className="text-slate-600">:</span>
        <span className="text-amber-300">"{p.name}"</span>
        <span className="text-slate-600">,</span>
        <span className="text-blue-300">pts</span>
        <span className="text-slate-600">:</span>
        <span style={{color:C(i)}}>{p.pts}</span>
        <span className="text-emerald-400">{'}'}</span>
      </div>
    ))}
    <div className="text-slate-600 mt-1">{'}'}</div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
const DEMOS = [
  {id:"gradfade", label:"Gradient Fade",    emoji:"🌅", C:GradientFade},
  {id:"ribbon",   label:"Corner Ribbon",    emoji:"🎀", C:CornerRibbon},
  {id:"dashed",   label:"Dashed Border",    emoji:"- -", C:DashedBorder},
  {id:"diag",     label:"Diagonal Split",   emoji:"◩", C:DiagonalSplit},
  {id:"tube",     label:"Neon Tube",        emoji:"💡", C:NeonTube},
  {id:"card",     label:"Credit Card",      emoji:"💳", C:CreditCard},
  {id:"sign",     label:"Road Sign",        emoji:"🛑", C:RoadSign},
  {id:"torn",     label:"Torn Edge",        emoji:"📄", C:TornEdge},
  {id:"fold",     label:"Folded Corner",    emoji:"📐", C:FoldedCorner},
  {id:"wave",     label:"Wave Bottom",      emoji:"🌊", C:WaveBottom},
  {id:"hex",      label:"Hexagon",          emoji:"⬡",  C:Hexagon},
  {id:"arrow",    label:"Arrow Right",      emoji:"➡️", C:ArrowRight},
  {id:"lcd",      label:"LCD Display",      emoji:"📺", C:LCD},
  {id:"bevel",    label:"Beveled Edges",    emoji:"💎", C:Beveled},
  {id:"stair",    label:"Stair / Step",     emoji:"🪜", C:Stair},
  {id:"chat",     label:"Chat Bubble",      emoji:"💬", C:ChatBubble},
  {id:"gborder",  label:"Gradient Border",  emoji:"🌈", C:GradientBorder},
  {id:"halfcut",  label:"Half Cut",         emoji:"✂️", C:HalfCut},
  {id:"news",     label:"Newspaper",        emoji:"📰", C:Newspaper},
  {id:"code",     label:"Code Block",       emoji:"💻", C:CodeBlock},
];

export default function AdminLeaderboardShapes2Demo() {
  const [active, setActive] = useState("gradfade");
  const cur = DEMOS.find(d=>d.id===active);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">דמו — צורות עיצוב #2</h2>
        <p className="text-slate-500 text-sm mt-1">20 צורות חדשות • ללא אנימציות</p>
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
      <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}>
            <cur.C />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
