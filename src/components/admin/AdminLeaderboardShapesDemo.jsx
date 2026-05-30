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
const medal = p => p===1?"🥇":p===2?"🥈":p===3?"🥉":null;
const MAX = PLAYERS[0].pts;

const Row = ({ p, style, className="", children }) => (
  <div className={`flex items-center gap-3 px-4 py-3 ${className}`} style={style}>
    {children || <>
      <span className="text-slate-400 font-bold text-sm w-5">{medal(p.pos)||p.pos}</span>
      <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
      <span className="font-bold tabular-nums text-sm" style={{color:C(p.pos-1)}}>{p.pts}</span>
    </>}
  </div>
);

// ── 1. Left Accent Bar ────────────────────────────────────────────────────────
const LeftAccentBar = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center rounded-xl overflow-hidden"
        style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
        <div className="w-1 self-stretch flex-shrink-0" style={{background:C(i)}} />
        <div className="flex items-center gap-3 px-4 py-3 flex-1">
          <span className="font-bold text-sm" style={{color:C(i)}}>{medal(p.pos)||p.pos}</span>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold tabular-nums text-sm text-white/70">{p.pts}</span>
        </div>
      </div>
    ))}
  </div>
);

// ── 2. Parallelogram ──────────────────────────────────────────────────────────
const Parallelogram = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-5 py-3"
        style={{
          background:'rgba(255,255,255,0.05)',
          clipPath:'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
          borderLeft:`3px solid ${C(i)}`,
        }}>
        <span className="font-bold text-sm" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold tabular-nums text-sm" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 3. Ticket Shape ───────────────────────────────────────────────────────────
const Ticket = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
        style={{background:'rgba(255,255,255,0.05)',border:`1px solid ${C(i)}25`}}>
        {/* Ticket notches */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full -translate-x-1/2"
          style={{background:'#0f172a'}} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full translate-x-1/2"
          style={{background:'#0f172a'}} />
        <div className="w-px self-stretch bg-white/10 mx-1" />
        <span className="font-black text-lg" style={{color:C(i)}}>{p.pos}</span>
        <div className="w-px self-stretch bg-white/10" />
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold tabular-nums text-sm text-white/60">{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 4. Split Half ─────────────────────────────────────────────────────────────
const SplitHalf = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-stretch rounded-xl overflow-hidden h-12"
        style={{border:'1px solid rgba(255,255,255,0.07)'}}>
        {/* Left half */}
        <div className="flex items-center justify-center px-4 flex-shrink-0"
          style={{background:`${C(i)}22`,borderRight:`1px solid ${C(i)}30`, minWidth:64}}>
          <span className="font-black text-xl" style={{color:C(i)}}>{medal(p.pos)||p.pos}</span>
        </div>
        {/* Right half */}
        <div className="flex items-center gap-3 flex-1 px-4"
          style={{background:'rgba(255,255,255,0.03)'}}>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold text-sm text-white/60 tabular-nums">{p.pts}</span>
        </div>
      </div>
    ))}
  </div>
);

// ── 5. Shield ─────────────────────────────────────────────────────────────────
const Shield = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id}
        style={{
          clipPath:'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)',
          background:`linear-gradient(180deg,${C(i)}22,${C(i)}08)`,
          border:`1px solid ${C(i)}35`,
          padding:'12px 16px 20px',
          display:'flex', alignItems:'center', gap:12,
        }}>
        <span className="font-black text-lg" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 6. Tag / Label ────────────────────────────────────────────────────────────
const TagLabel = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3"
        style={{
          background:'rgba(255,255,255,0.05)',
          clipPath:'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)',
          borderLeft:`3px solid ${C(i)}`,
        }}>
        <span className="font-bold text-sm" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm text-white/60 tabular-nums mr-4">{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 7. Cutout Corner ──────────────────────────────────────────────────────────
const CutoutCorner = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3"
        style={{
          background:'rgba(255,255,255,0.05)',
          clipPath:'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          border:`1px solid rgba(255,255,255,0.08)`,
        }}>
        {/* Color triangle in cut corner */}
        <div style={{
          position:'absolute', right:0, top:0, width:0, height:0,
          borderStyle:'solid', borderWidth:'0 16px 16px 0',
          borderColor:`transparent ${C(i)} transparent transparent`,
          borderTopRightRadius:2,
        }} />
        <span className="font-bold text-sm" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm text-white/60 tabular-nums">{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 8. Double Border ──────────────────────────────────────────────────────────
const DoubleBorder = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="p-0.5 rounded-xl" style={{border:`1px solid ${C(i)}50`}}>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-[10px]"
          style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${C(i)}25`}}>
          <span className="font-bold text-sm" style={{color:C(i)}}>{p.pos}</span>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        </div>
      </div>
    ))}
  </div>
);

// ── 9. Stadium Pill ───────────────────────────────────────────────────────────
const StadiumPill = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-5 py-2.5"
        style={{background:'rgba(255,255,255,0.05)',border:`1px solid ${C(i)}30`,borderRadius:100}}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
          style={{background:C(i),color:'#000'}}>{p.pos}</div>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 10. Underline Only ────────────────────────────────────────────────────────
const UnderlineOnly = () => (
  <div>
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-2 py-3"
        style={{borderBottom:`2px solid ${C(i)}40`}}>
        <span className="font-black text-sm" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums text-white/60">{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 11. Floating Card ─────────────────────────────────────────────────────────
const FloatingCard = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{
          background:'rgba(20,28,48,0.9)',
          boxShadow:`0 8px 24px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), 0 0 0 1px ${C(i)}20`,
        }}>
        <span className="font-black text-sm" style={{color:C(i)}}>{medal(p.pos)||p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 12. Inset / Pressed ───────────────────────────────────────────────────────
const InsetPressed = () => (
  <div className="space-y-2 p-2 rounded-2xl" style={{background:'rgba(0,0,0,0.3)'}}>
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
          background:'rgba(255,255,255,0.03)',
          boxShadow:'inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.05)',
          border:'1px solid rgba(0,0,0,0.3)',
        }}>
        <span className="font-bold text-sm" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white/80 font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 13. Diagonal Stripe ───────────────────────────────────────────────────────
const DiagonalStripe = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden relative"
        style={{border:'1px solid rgba(255,255,255,0.07)'}}>
        <div className="absolute inset-0"
          style={{background:`repeating-linear-gradient(135deg,${C(i)}08 0px,${C(i)}08 4px,transparent 4px,transparent 12px)`}} />
        <span className="font-bold text-sm relative z-10" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm relative z-10">{p.name}</span>
        <span className="font-bold text-sm tabular-nums text-white/70 relative z-10">{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 14. Glow Border ───────────────────────────────────────────────────────────
const GlowBorder = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
          background:'rgba(10,16,32,0.8)',
          border:`1px solid ${C(i)}60`,
          boxShadow:`0 0 12px ${C(i)}25, inset 0 0 12px ${C(i)}08`,
        }}>
        <span className="font-black text-sm" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i),textShadow:`0 0 8px ${C(i)}80`}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 15. Layered Stack ─────────────────────────────────────────────────────────
const LayeredStack = () => (
  <div className="space-y-4">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative">
        {/* Shadow layers */}
        <div className="absolute inset-0 translate-y-1.5 translate-x-1 rounded-xl opacity-40"
          style={{background:C(i)+'22',border:`1px solid ${C(i)}20`}} />
        <div className="absolute inset-0 translate-y-0.5 translate-x-0.5 rounded-xl opacity-60"
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)'}} />
        {/* Main card */}
        <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{background:'rgba(15,22,40,0.95)',border:`1px solid ${C(i)}30`}}>
          <span className="font-bold text-sm" style={{color:C(i)}}>{p.pos}</span>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        </div>
      </div>
    ))}
  </div>
);

// ── 16. Circle Left ───────────────────────────────────────────────────────────
const CircleLeft = () => (
  <div className="space-y-2 pl-6">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative flex items-center">
        {/* Circle outside */}
        <div className="absolute -left-6 w-12 h-12 rounded-full flex items-center justify-center font-black text-sm z-10 flex-shrink-0"
          style={{background:`radial-gradient(circle,${C(i)},${C(i)}88)`,color:'#000',border:'2px solid rgba(255,255,255,0.15)',boxShadow:`0 0 12px ${C(i)}50`}}>
          {p.pos}
        </div>
        <div className="flex items-center gap-3 pl-8 pr-4 py-3 rounded-xl flex-1"
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        </div>
      </div>
    ))}
  </div>
);

// ── 17. Asymmetric Radius ─────────────────────────────────────────────────────
const Asymmetric = () => (
  <div className="space-y-2">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-3 px-4 py-3"
        style={{
          background:'rgba(255,255,255,0.05)',
          border:`1px solid ${C(i)}30`,
          borderRadius:'4px 20px 20px 4px',
          borderLeft:`3px solid ${C(i)}`,
        }}>
        <span className="font-bold text-sm" style={{color:C(i)}}>{p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 18. Ribbon Banner ─────────────────────────────────────────────────────────
const RibbonBanner = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="relative flex items-center gap-3 px-4 py-3"
        style={{
          background:`linear-gradient(90deg,${C(i)}18 0%,rgba(255,255,255,0.04) 40%)`,
          clipPath:'polygon(0 0,100% 0,calc(100% - 0px) 50%,100% 100%,0 100%)',
          borderTop:`1px solid ${C(i)}30`,
          borderBottom:`1px solid ${C(i)}20`,
        }}>
        <span className="font-black text-base" style={{color:C(i)}}>{medal(p.pos)||p.pos}</span>
        <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums text-white/60">{p.pts}</span>
      </div>
    ))}
  </div>
);

// ── 19. Arc Top ───────────────────────────────────────────────────────────────
const ArcTop = () => (
  <div className="space-y-3">
    {PLAYERS.map((p,i) => (
      <div key={p.id} style={{position:'relative', paddingTop:6}}>
        <svg style={{position:'absolute',top:0,left:0,right:0,width:'100%',height:12,overflow:'visible'}} viewBox="0 0 300 12" preserveAspectRatio="none">
          <path d="M0,12 Q150,0 300,12" fill="none" stroke={C(i)} strokeWidth="1.5" strokeOpacity="0.5"/>
        </svg>
        <div className="flex items-center gap-3 px-4 py-3 rounded-b-xl"
          style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${C(i)}20`,borderTop:'none'}}>
          <span className="font-bold text-sm" style={{color:C(i)}}>{p.pos}</span>
          <span className="flex-1 text-white font-medium text-sm">{p.name}</span>
          <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
        </div>
      </div>
    ))}
  </div>
);

// ── 20. Section Divider ───────────────────────────────────────────────────────
const SectionDivider = () => (
  <div>
    {PLAYERS.map((p,i) => (
      <div key={p.id} className="flex items-center gap-4 px-2 py-3"
        style={{borderBottom:`1px solid rgba(255,255,255,0.06)`}}>
        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{background:C(i)}} />
        <span className="font-black text-2xl w-8 leading-none" style={{color:C(i),opacity:0.35}}>{p.pos}</span>
        <span className="flex-1 text-white font-semibold text-sm">{p.name}</span>
        <span className="font-bold text-sm tabular-nums" style={{color:C(i)}}>{p.pts}</span>
      </div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
const DEMOS = [
  { id:"accent",    label:"Left Accent Bar",   emoji:"▌", C:LeftAccentBar },
  { id:"slant",     label:"Parallelogram",      emoji:"◧", C:Parallelogram },
  { id:"ticket",    label:"Ticket",             emoji:"🎫", C:Ticket },
  { id:"split",     label:"Split Half",         emoji:"◑", C:SplitHalf },
  { id:"shield",    label:"Shield",             emoji:"🛡️", C:Shield },
  { id:"tag",       label:"Tag / Label",        emoji:"🏷️", C:TagLabel },
  { id:"cutout",    label:"Cutout Corner",      emoji:"✂️", C:CutoutCorner },
  { id:"double",    label:"Double Border",      emoji:"⬜", C:DoubleBorder },
  { id:"pill",      label:"Stadium Pill",       emoji:"💊", C:StadiumPill },
  { id:"underline", label:"Underline Only",     emoji:"▃", C:UnderlineOnly },
  { id:"floating",  label:"Floating Card",      emoji:"☁️", C:FloatingCard },
  { id:"inset",     label:"Inset / Pressed",    emoji:"⬇️", C:InsetPressed },
  { id:"stripe",    label:"Diagonal Stripe",    emoji:"////", C:DiagonalStripe },
  { id:"glow",      label:"Glow Border",        emoji:"✨", C:GlowBorder },
  { id:"stack",     label:"Layered Stack",      emoji:"🗂️", C:LayeredStack },
  { id:"circle",    label:"Circle Left",        emoji:"⭕", C:CircleLeft },
  { id:"asym",      label:"Asymmetric Radius",  emoji:"◑", C:Asymmetric },
  { id:"ribbon",    label:"Ribbon Banner",      emoji:"🎀", C:RibbonBanner },
  { id:"arc",       label:"Arc Top",            emoji:"⌢", C:ArcTop },
  { id:"divider",   label:"Section Divider",    emoji:"▏", C:SectionDivider },
];

export default function AdminLeaderboardShapesDemo() {
  const [active, setActive] = useState("accent");
  const cur = DEMOS.find(d => d.id === active);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">דמו — צורות עיצוב שורת משתתף</h2>
        <p className="text-slate-500 text-sm mt-1">20 עיצובי צורה • ללא אנימציות</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEMOS.map(d => (
          <button key={d.id} onClick={() => setActive(d.id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              active === d.id
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}>
            <cur.C />
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-slate-600 text-xs text-center">בחר סגנון ואבנה אותו על הנתונים האמיתיים</p>
    </div>
  );
}
