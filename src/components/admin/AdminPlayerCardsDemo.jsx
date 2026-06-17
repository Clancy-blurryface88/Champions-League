import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Star, Zap, Trophy, Shield } from "lucide-react";

const PLAYERS = [
  { id:1, name:'דימה',  pts:142.5, rank:1, bonus:35.75, pred:'2-1' },
  { id:2, name:'יקיר',  pts:138.2, rank:2, bonus:28.00, pred:'1-0' },
  { id:3, name:'מוטי',  pts:121.0, rank:3, bonus:14.50, pred:'0-0' },
  { id:4, name:'אלי',   pts:109.8, rank:4, bonus: 7.25, pred:'2-2' },
  { id:5, name:'יוסי',  pts: 98.3, rank:5, bonus: 0,    pred:'1-1' },
];

const MEDAL = { 1:'🥇', 2:'🥈', 3:'🥉' };
const RC = r => r===1?'#FFD700':r===2?'#C0C0C0':r===3?'#CD7F32':'#64748b';
const RBG = r => r===1?'rgba(250,204,21,.18)':r===2?'rgba(209,213,219,.14)':r===3?'rgba(205,127,50,.16)':'rgba(30,41,59,.6)';
const RBorder = r => r===1?'rgba(250,204,21,.5)':r===2?'rgba(209,213,219,.35)':r===3?'rgba(205,127,50,.45)':'rgba(71,85,105,.6)';

const delta = p => p.bonus > 0 ? <span className="text-emerald-400 text-[10px] font-bold">+{p.bonus}</span> : null;

// ─── wrapper: כל אפשרות מוצגת בתצוגה מקדימה ────────────────────────────────
function Preview({ n, label, children }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 overflow-hidden"
      style={{ background:'rgba(5,10,20,0.7)' }}>
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">#{n}</span>
        <span className="text-slate-400 text-xs">{label}</span>
      </div>
      <div className="px-4 pb-4 space-y-1.5">{children}</div>
    </div>
  );
}

// ════════════════════════ 50 DESIGNS ════════════════════════════════════════

// 1 — Skewed Classic
const C1 = ({p}) => (
  <div style={{ transform:'skewX(-6deg)', borderRadius:8, background:RBG(p.rank), border:`2px solid ${RBorder(p.rank)}` }}>
    <div style={{ transform:'skewX(6deg)', padding:'8px 10px' }} className="flex items-center gap-2">
      <span className="text-sm w-5 text-center font-black" style={{ color:RC(p.rank) }}>{p.rank}</span>
      <span className="text-white text-xs flex-1 font-semibold">{p.name}</span>
      <span className="text-emerald-400 text-xs font-bold tabular-nums">{p.pts}</span>
    </div>
  </div>
);

// 2 — Glass Pill
const C2 = ({p}) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full"
    style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(12px)', border:`1px solid ${RBorder(p.rank)}` }}>
    <span className="text-base">{MEDAL[p.rank]||p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs tabular-nums" style={{ color:RC(p.rank) }}>{p.pts}</span>
  </div>
);

// 3 — Left Color Bar
const C3 = ({p}) => (
  <div className="flex items-center rounded-xl overflow-hidden" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
    <div className="w-1.5 self-stretch" style={{ background:RC(p.rank) }} />
    <div className="flex items-center gap-2 px-3 py-2.5 flex-1">
      <span className="text-xs font-black w-4" style={{ color:RC(p.rank) }}>{p.rank}</span>
      <span className="text-white text-xs flex-1">{p.name}</span>
      <span className="text-white font-bold text-xs tabular-nums">{p.pts}</span>
    </div>
  </div>
);

// 4 — Split Background
const C4 = ({p}) => (
  <div className="flex rounded-xl overflow-hidden" style={{ border:`1px solid ${RBorder(p.rank)}` }}>
    <div className="flex items-center justify-center w-10 flex-shrink-0" style={{ background:RBG(p.rank) }}>
      <span className="font-black text-sm" style={{ color:RC(p.rank) }}>{p.rank}</span>
    </div>
    <div className="flex items-center gap-2 px-3 py-2 flex-1" style={{ background:'rgba(15,23,42,.8)' }}>
      <span className="text-white text-xs flex-1">{p.name}</span>
      <span className="text-emerald-400 font-bold text-xs">{p.pts}</span>
    </div>
  </div>
);

// 5 — Neon Glow
const C5 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:'rgba(0,0,0,0.6)', border:`1px solid ${RC(p.rank)}`, boxShadow:`0 0 12px ${RC(p.rank)}33` }}>
    <span className="text-xs font-black" style={{ color:RC(p.rank), textShadow:`0 0 8px ${RC(p.rank)}` }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs tabular-nums" style={{ color:RC(p.rank) }}>{p.pts}</span>
  </div>
);

// 6 — Table Row
const C6 = ({p}) => (
  <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-800">
    <span className="text-slate-500 text-xs w-4 text-center">{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="text-slate-300 text-xs tabular-nums">{p.pts}</span>
    <span className="text-emerald-400 text-[10px]">+{p.bonus}</span>
  </div>
);

// 7 — Card with Progress Bar
const C7 = ({p}) => {
  const pct = (p.pts / 180) * 100;
  return (
    <div className="px-3 py-2.5 rounded-xl space-y-1.5" style={{ background:RBG(p.rank), border:`1px solid ${RBorder(p.rank)}` }}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-black" style={{ color:RC(p.rank) }}>{p.rank}</span>
        <span className="text-white text-xs flex-1">{p.name}</span>
        <span className="font-bold text-xs tabular-nums text-white">{p.pts}</span>
      </div>
      <div className="h-1 rounded-full bg-white/10">
        <div className="h-1 rounded-full transition-all" style={{ width:`${pct}%`, background:RC(p.rank) }} />
      </div>
    </div>
  );
};

// 8 — Rank Ring
const C8 = ({p}) => (
  <div className="flex items-center gap-3 px-3 py-2">
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ border:`2px solid ${RC(p.rank)}`, background:`${RC(p.rank)}22` }}>
      <span className="text-[11px] font-black" style={{ color:RC(p.rank) }}>{p.rank}</span>
    </div>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs tabular-nums text-white">{p.pts}</span>
  </div>
);

// 9 — Large Rank Number
const C9 = ({p}) => (
  <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
    style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${RBorder(p.rank)}` }}>
    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-5xl font-black leading-none pointer-events-none select-none"
      style={{ color:RC(p.rank), opacity:0.12 }}>{p.rank}</span>
    <span className="relative text-white text-sm font-semibold flex-1 pl-4">{p.name}</span>
    <span className="relative font-bold text-sm tabular-nums" style={{ color:RC(p.rank) }}>{p.pts}</span>
  </div>
);

// 10 — Gradient Card
const C10 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:`linear-gradient(135deg, ${RC(p.rank)}22, transparent)`, border:`1px solid ${RC(p.rank)}44` }}>
    <span className="text-base">{MEDAL[p.rank]||`#${p.rank}`}</span>
    <span className="text-white text-xs flex-1 font-medium">{p.name}</span>
    <div className="text-right">
      <div className="font-bold text-xs text-white">{p.pts}</div>
      <div className="text-[9px] text-emerald-400">+{p.bonus} לייב</div>
    </div>
  </div>
);

// 11 — Outlined Badge
const C11 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
    style={{ border:`1.5px solid ${RC(p.rank)}`, background:'transparent' }}>
    <span className="text-xs font-black" style={{ color:RC(p.rank) }}>#{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="text-white font-mono text-xs">{p.pts}</span>
  </div>
);

// 12 — Frosted Glass Heavy
const C12 = ({p}) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
    style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(20px) saturate(1.8)', border:'1px solid rgba(255,255,255,0.15)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.2)' }}>
    <span className="text-sm font-black" style={{ color:RC(p.rank) }}>{MEDAL[p.rank]||p.rank}</span>
    <span className="text-white/90 text-xs flex-1 font-semibold">{p.name}</span>
    <span className="font-bold text-sm tabular-nums text-white">{p.pts}</span>
  </div>
);

// 13 — Ticket Stub
const C13 = ({p}) => (
  <div className="flex rounded-xl overflow-hidden" style={{ border:`1px solid ${RBorder(p.rank)}` }}>
    <div className="flex flex-col items-center justify-center px-3 py-2" style={{ background:RC(p.rank), minWidth:40 }}>
      <span className="text-black font-black text-lg leading-none">{p.rank}</span>
    </div>
    <div className="flex-1 flex items-center gap-2 px-3 py-2" style={{ background:'rgba(15,23,42,.9)', borderLeft:`2px dashed ${RC(p.rank)}55` }}>
      <span className="text-white text-xs flex-1">{p.name}</span>
      <span className="font-bold text-xs text-white">{p.pts}</span>
    </div>
  </div>
);

// 14 — Jersey Style
const C14 = ({p}) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background:`linear-gradient(145deg, ${RC(p.rank)}, ${RC(p.rank)}88)` }}>
      <span className="text-black font-black text-sm">{p.rank}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-white text-xs font-semibold truncate">{p.name}</div>
      <div className="text-slate-400 text-[10px]">{p.pred} ←ניחוש</div>
    </div>
    <span className="font-bold text-sm tabular-nums" style={{ color:RC(p.rank) }}>{p.pts}</span>
  </div>
);

// 15 — Shine Border
const C15 = ({p}) => (
  <div className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl overflow-hidden"
    style={{ background:'rgba(10,18,35,.9)' }}>
    <div className="absolute inset-0 rounded-xl" style={{ background:`conic-gradient(from 0deg at 50% 50%, ${RC(p.rank)}, transparent 30%, ${RC(p.rank)} 60%, transparent 80%, ${RC(p.rank)})`, padding:1 }}>
      <div className="w-full h-full rounded-xl" style={{ background:'rgba(10,18,35,.9)' }} />
    </div>
    <span className="relative text-xs font-black" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="relative text-white text-xs flex-1">{p.name}</span>
    <span className="relative font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 16 — Right Side Score Accent
const C16 = ({p}) => (
  <div className="flex items-center rounded-xl overflow-hidden" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
    <div className="flex items-center gap-2 px-3 py-2.5 flex-1">
      <span className="text-slate-500 text-xs w-4">{p.rank}</span>
      <span className="text-white text-xs">{p.name}</span>
    </div>
    <div className="flex items-center justify-center px-4 py-2.5 self-stretch" style={{ background:RC(p.rank), minWidth:56 }}>
      <span className="text-black font-black text-sm tabular-nums">{p.pts}</span>
    </div>
  </div>
);

// 17 — 3D Shadow
const C17 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:RBG(p.rank), border:`1px solid ${RBorder(p.rank)}`, boxShadow:`4px 4px 0 ${RC(p.rank)}44` }}>
    <span className="text-sm font-black" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 18 — Minimal Dots
const C18 = ({p}) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-slate-800/60">
    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:RC(p.rank) }} />
    <span className="text-slate-400 text-[10px] w-4">{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs tabular-nums text-slate-300">{p.pts}</span>
  </div>
);

// 19 — Carbon Fiber
const C19 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:'repeating-linear-gradient(45deg,rgba(255,255,255,0.02) 0,rgba(255,255,255,0.02) 1px,transparent 0,transparent 50%)', backgroundSize:'4px 4px', border:`1px solid ${RBorder(p.rank)}` }}>
    <span className="text-xs font-black" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white tabular-nums">{p.pts}</span>
  </div>
);

// 20 — Name Large
const C20 = ({p}) => (
  <div className="px-4 py-3 rounded-2xl space-y-0.5" style={{ background:RBG(p.rank), border:`1px solid ${RBorder(p.rank)}` }}>
    <div className="flex items-baseline gap-2">
      <span className="text-[10px]" style={{ color:RC(p.rank) }}>#{p.rank}</span>
      <span className="text-white font-bold text-sm flex-1">{p.name}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl font-black tabular-nums" style={{ color:RC(p.rank) }}>{p.pts}</span>
      <span className="text-slate-500 text-[10px]">נקודות</span>
      {p.bonus>0 && <span className="text-emerald-400 text-[10px] ml-auto">+{p.bonus} לייב</span>}
    </div>
  </div>
);

// 21 — Horizontal Gauge
const C21 = ({p}) => {
  const pct = (p.pts/180)*100;
  return (
    <div className="px-3 py-2 rounded-xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-black" style={{ color:RC(p.rank) }}>{p.rank}</span>
        <span className="text-white text-xs flex-1">{p.name}</span>
        <span className="font-bold text-xs text-white">{p.pts}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/8">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width:`${pct}%`, background:`linear-gradient(90deg, ${RC(p.rank)}, ${RC(p.rank)}cc)` }} />
      </div>
    </div>
  );
};

// 22 — Score Focus
const C22 = ({p}) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
    <span className="text-slate-500 text-xs">{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <div className="flex items-baseline gap-1">
      <span className="font-black text-lg tabular-nums" style={{ color:RC(p.rank) }}>{p.pts}</span>
      <span className="text-slate-500 text-[9px]">נק'</span>
    </div>
  </div>
);

// 23 — Top Banner for #1
const C23 = ({p}) => p.rank===1 ? (
  <div className="px-4 py-3 rounded-2xl text-center relative overflow-hidden"
    style={{ background:'linear-gradient(135deg,rgba(250,204,21,.3),rgba(245,158,11,.2))', border:'2px solid #FFD700' }}>
    <div className="absolute inset-0 opacity-20" style={{ background:'radial-gradient(ellipse at 50% 0%,#FFD700,transparent 60%)' }} />
    <div className="text-2xl mb-0.5">🏆</div>
    <div className="text-amber-300 font-black text-sm">{p.name}</div>
    <div className="text-amber-400/70 text-[10px]">{p.pts} נקודות</div>
  </div>
) : (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background:RBG(p.rank), border:`1px solid ${RBorder(p.rank)}` }}>
    <span className="text-xs font-black" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 24 — Avatar Initial
const C24 = ({p}) => (
  <div className="flex items-center gap-3 px-3 py-2">
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
      style={{ background:`linear-gradient(135deg,${RC(p.rank)},${RC(p.rank)}88)`, color:'#000' }}>
      {p.name[0]}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-white text-xs font-semibold">{p.name}</div>
      <div className="text-slate-500 text-[10px]">מקום {p.rank}</div>
    </div>
    <span className="font-bold text-xs tabular-nums" style={{ color:RC(p.rank) }}>{p.pts}</span>
  </div>
);

// 25 — Two-Tone Split
const C25 = ({p}) => (
  <div className="flex rounded-2xl overflow-hidden" style={{ border:`1px solid ${RBorder(p.rank)}` }}>
    <div className="w-1/3 flex flex-col items-center justify-center py-2.5" style={{ background:RBG(p.rank) }}>
      <span className="text-2xl font-black" style={{ color:RC(p.rank) }}>{MEDAL[p.rank]||p.rank}</span>
    </div>
    <div className="flex-1 flex flex-col justify-center px-3 py-2" style={{ background:'rgba(10,18,35,.9)' }}>
      <div className="text-white text-xs font-semibold">{p.name}</div>
      <div className="text-slate-400 text-[10px] mt-0.5">{p.pts} נק' · +{p.bonus} לייב</div>
    </div>
  </div>
);

// 26 — Delta Chip
const C26 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
    <span className="text-xs font-black" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="text-white font-bold text-xs mr-1">{p.pts}</span>
    {p.bonus>0&&<span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">+{p.bonus}</span>}
  </div>
);

// 27 — Striped
const C27 = ({p, i}) => (
  <div className="flex items-center gap-2 px-3 py-2.5"
    style={{ background: i%2===0?'rgba(255,255,255,0.03)':'transparent', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
    <span className="text-slate-500 text-[10px] w-4 text-center">{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs tabular-nums text-white">{p.pts}</span>
  </div>
);

// 28 — Cut Corner
const C28 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5"
    style={{ background:RBG(p.rank), border:`1px solid ${RBorder(p.rank)}`, borderRadius:'12px 4px 12px 4px' }}>
    <span className="font-black text-sm" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 29 — Shield Icon
const C29 = ({p}) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
    style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${RBorder(p.rank)}` }}>
    <Shield className="w-5 h-5 flex-shrink-0" style={{ color:RC(p.rank) }} />
    <span className="text-white text-xs flex-1">{p.name}</span>
    <div className="text-right">
      <div className="font-bold text-xs text-white tabular-nums">{p.pts}</div>
      <div className="text-[9px] text-slate-500">#{p.rank}</div>
    </div>
  </div>
);

// 30 — Monochrome
const C30 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:`rgba(255,255,255,${0.03+(4-Math.min(p.rank,4))*0.02})`, border:'1px solid rgba(255,255,255,0.06)' }}>
    <span className="text-slate-400 text-xs w-5 font-bold">{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="text-white font-bold text-xs tabular-nums">{p.pts}</span>
  </div>
);

// 31 — Points Bar Right
const C31 = ({p}) => {
  const pct = (p.pts/180)*100;
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
      <span className="text-xs font-black w-4" style={{ color:RC(p.rank) }}>{p.rank}</span>
      <span className="text-white text-xs flex-1">{p.name}</span>
      <div className="flex items-center gap-2 w-24">
        <div className="flex-1 h-2 rounded-full bg-white/8">
          <div className="h-2 rounded-full" style={{ width:`${pct}%`, background:RC(p.rank) }} />
        </div>
        <span className="text-white font-bold text-[10px] w-8 text-right tabular-nums">{p.pts}</span>
      </div>
    </div>
  );
};

// 32 — Pastel
const pastels = ['rgba(219,234,254,.15)','rgba(220,252,231,.12)','rgba(254,243,199,.12)','rgba(237,233,254,.12)','rgba(255,228,230,.10)'];
const pastelB = ['rgba(96,165,250,.4)','rgba(52,211,153,.4)','rgba(251,191,36,.4)','rgba(167,139,250,.4)','rgba(251,113,133,.4)'];
const C32 = ({p,i}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:pastels[i], border:`1px solid ${pastelB[i]}` }}>
    <span className="text-xs font-black" style={{ color:pastelB[i] }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 33 — Underline Only
const C33 = ({p}) => (
  <div className="flex items-center gap-2 px-2 py-2.5" style={{ borderBottom:`2px solid ${RC(p.rank)}44` }}>
    <span className="font-black text-xs" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white tabular-nums">{p.pts}</span>
  </div>
);

// 34 — Holographic
const C34 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl relative overflow-hidden"
    style={{ background:'rgba(10,18,35,0.9)', border:`1px solid ${RC(p.rank)}66` }}>
    <div className="absolute inset-0 opacity-30 pointer-events-none"
      style={{ background:`linear-gradient(105deg, transparent 40%, ${RC(p.rank)}33 50%, transparent 60%)` }} />
    <span className="relative text-xs font-black" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="relative text-white text-xs flex-1">{p.name}</span>
    <span className="relative font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 35 — Bold Number Left
const C35 = ({p}) => (
  <div className="flex items-center gap-0 rounded-xl overflow-hidden" style={{ border:`1px solid ${RBorder(p.rank)}` }}>
    <div className="text-3xl font-black flex items-center justify-center px-3 py-3 flex-shrink-0"
      style={{ color:RC(p.rank), background:`${RC(p.rank)}18`, minWidth:52, textAlign:'center' }}>{p.rank}</div>
    <div className="flex-1 flex items-center justify-between px-3 py-3" style={{ background:'rgba(15,23,42,.8)' }}>
      <span className="text-white text-xs font-semibold">{p.name}</span>
      <span className="font-bold text-xs text-white">{p.pts}</span>
    </div>
  </div>
);

// 36 — Trophy for Top 3
const C36 = ({p}) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
    style={{ background:RBG(p.rank), border:`1px solid ${RBorder(p.rank)}` }}>
    {p.rank<=3
      ? <Trophy className="w-5 h-5 flex-shrink-0" style={{ color:RC(p.rank) }}/>
      : <span className="text-slate-500 text-xs w-5 text-center">{p.rank}</span>}
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 37 — Points First
const C37 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
    <span className="font-black text-lg tabular-nums" style={{ color:RC(p.rank) }}>{p.pts}</span>
    <div className="flex-1 min-w-0">
      <div className="text-white text-xs font-semibold truncate">{p.name}</div>
      <div className="text-slate-500 text-[9px]">מקום {p.rank}</div>
    </div>
    {p.bonus>0 && <span className="text-emerald-400 text-[10px] font-bold">+{p.bonus}</span>}
  </div>
);

// 38 — Gradient Left to Right
const C38 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:`linear-gradient(90deg, ${RC(p.rank)}33, transparent)`, border:`1px solid ${RC(p.rank)}33` }}>
    <span className="font-black text-sm" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 39 — Chip Tags
const C39 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
    <span className="px-1.5 py-0.5 rounded text-[10px] font-black" style={{ background:RC(p.rank), color:'#000' }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/8 text-white">{p.pts}</span>
  </div>
);

// 40 — Glow Dot
const C40 = ({p}) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
    style={{ background:'rgba(10,18,35,0.8)', border:'1px solid rgba(255,255,255,0.07)' }}>
    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:RC(p.rank), boxShadow:`0 0 6px ${RC(p.rank)}` }} />
    <span className="text-slate-400 text-[10px] w-4">{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 41 — Star Icon
const C41 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:RBG(p.rank), border:`1px solid ${RBorder(p.rank)}` }}>
    {[...Array(Math.max(0,4-p.rank))].map((_,i)=><Star key={i} className="w-2.5 h-2.5" style={{ color:RC(p.rank), fill:RC(p.rank) }}/>)}
    <span className="text-white text-xs flex-1 ml-1">{p.name}</span>
    <span className="font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 42 — Zap Icon Live
const C42 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
    <span className="text-xs font-black w-4" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white mr-1">{p.pts}</span>
    {p.bonus>0 && <Zap className="w-3 h-3 text-amber-400" />}
  </div>
);

// 43 — Mega Card
const C43 = ({p}) => (
  <div className="px-4 py-4 rounded-2xl relative overflow-hidden"
    style={{ background:RBG(p.rank), border:`2px solid ${RBorder(p.rank)}` }}>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-6xl font-black pointer-events-none select-none"
      style={{ color:RC(p.rank), opacity:0.1 }}>{p.rank}</div>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[10px] font-bold" style={{ color:RC(p.rank) }}>#{p.rank}</span>
      {p.bonus>0&&<span className="text-emerald-400 text-[9px] bg-emerald-400/10 px-1.5 py-0.5 rounded-full">🔴 לייב</span>}
    </div>
    <div className="text-white font-bold text-sm">{p.name}</div>
    <div className="flex items-baseline gap-1.5 mt-1">
      <span className="font-black text-2xl tabular-nums" style={{ color:RC(p.rank) }}>{p.pts}</span>
      <span className="text-slate-400 text-[10px]">נקודות</span>
    </div>
  </div>
);

// 44 — Compact Inline
const C44 = ({p}) => (
  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
    style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
    <span className="text-[10px] font-bold" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="text-white text-[11px] flex-1">{p.name}</span>
    <span className="text-white font-bold text-[11px] tabular-nums">{p.pts}</span>
  </div>
);

// 45 — Inset Shadow
const C45 = ({p}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{ background:'rgba(0,0,0,0.4)', border:`1px solid ${RBorder(p.rank)}`, boxShadow:`inset 0 1px 0 ${RC(p.rank)}22, inset 0 -1px 0 rgba(0,0,0,0.3)` }}>
    <span className="font-black text-xs" style={{ color:RC(p.rank) }}>{p.rank}</span>
    <span className="text-white text-xs flex-1">{p.name}</span>
    <span className="font-bold text-xs text-white">{p.pts}</span>
  </div>
);

// 46 — Magazine Row
const C46 = ({p}) => (
  <div className="flex items-stretch rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
    <div className="w-8 flex items-center justify-center flex-shrink-0 text-xs font-black"
      style={{ background:RC(p.rank), color:'#000' }}>{p.rank}</div>
    <div className="flex-1 flex items-center justify-between px-3 py-2.5 bg-white/3">
      <span className="text-white text-xs font-medium">{p.name}</span>
      <div className="flex items-center gap-2">
        {p.bonus>0&&<span className="text-emerald-400 text-[10px]">+{p.bonus}</span>}
        <span className="text-white font-bold text-xs">{p.pts}</span>
      </div>
    </div>
  </div>
);

// 47 — Gradient Pulse Border
const C47 = ({p}) => (
  <div className="p-px rounded-xl" style={{ background:`linear-gradient(135deg, ${RC(p.rank)}, transparent, ${RC(p.rank)})` }}>
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background:'rgba(10,18,35,0.95)' }}>
      <span className="font-black text-xs" style={{ color:RC(p.rank) }}>{p.rank}</span>
      <span className="text-white text-xs flex-1">{p.name}</span>
      <span className="font-bold text-xs text-white">{p.pts}</span>
    </div>
  </div>
);

// 48 — Right Rank Badge
const C48 = ({p}) => (
  <div className="flex items-center rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.07)' }}>
    <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-white/3">
      <span className="text-white text-xs">{p.name}</span>
    </div>
    <div className="flex items-center justify-between gap-2 px-3 py-2.5 flex-shrink-0"
      style={{ background:RBG(p.rank), borderLeft:`1px solid ${RBorder(p.rank)}`, minWidth:80 }}>
      <span className="font-bold text-xs tabular-nums text-white">{p.pts}</span>
      <span className="font-black text-xs" style={{ color:RC(p.rank) }}>#{p.rank}</span>
    </div>
  </div>
);

// 49 — Compare Bar
const C49 = ({p, all}) => {
  const max = Math.max(...all.map(x=>x.pts));
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span className="text-xs font-black w-4" style={{ color:RC(p.rank) }}>{p.rank}</span>
      <span className="text-white text-xs w-12 truncate">{p.name}</span>
      <div className="flex-1 h-2 rounded-full bg-white/8">
        <motion.div className="h-2 rounded-full" initial={{ width:0 }} animate={{ width:`${(p.pts/max)*100}%` }}
          transition={{ duration:0.8, delay:p.rank*0.1 }} style={{ background:RC(p.rank) }} />
      </div>
      <span className="text-white font-bold text-[10px] tabular-nums w-10 text-right">{p.pts}</span>
    </div>
  );
};

// 50 — Podium Special
const C50 = ({p}) => {
  const sizes = { 1:'text-xl', 2:'text-base', 3:'text-sm' };
  const pads  = { 1:'py-5', 2:'py-3.5', 3:'py-2.5' };
  return (
    <div className={`flex items-center gap-3 px-4 ${pads[p.rank]||'py-2'} rounded-2xl transition-all`}
      style={{ background:RBG(p.rank), border:`${p.rank===1?2:1}px solid ${RBorder(p.rank)}`, boxShadow:p.rank===1?`0 0 24px ${RC(p.rank)}33`:'none' }}>
      <span className={`${sizes[p.rank]||'text-sm'} font-black`} style={{ color:RC(p.rank) }}>{MEDAL[p.rank]||p.rank}</span>
      <span className={`text-white flex-1 font-${p.rank===1?'bold':'medium'} text-${p.rank===1?'sm':'xs'}`}>{p.name}</span>
      <span className={`font-black tabular-nums text-${p.rank===1?'base':'xs'}`} style={{ color:RC(p.rank) }}>{p.pts}</span>
    </div>
  );
};

// ════════════ MAIN COMPONENT ═════════════════════════════════════════════════
const OPTIONS = [
  { n:1,  label:'Skewed Classic',        C:C1  },
  { n:2,  label:'Glass Pill',            C:C2  },
  { n:3,  label:'Left Color Bar',        C:C3  },
  { n:4,  label:'Split Background',      C:C4  },
  { n:5,  label:'Neon Glow',             C:C5  },
  { n:6,  label:'Table Row',             C:C6  },
  { n:7,  label:'Progress Bar',          C:C7  },
  { n:8,  label:'Rank Ring',             C:C8  },
  { n:9,  label:'Large Rank Number',     C:C9  },
  { n:10, label:'Gradient Card',         C:C10 },
  { n:11, label:'Outlined Badge',        C:C11 },
  { n:12, label:'Frosted Glass Heavy',   C:C12 },
  { n:13, label:'Ticket Stub',           C:C13 },
  { n:14, label:'Jersey Style',          C:C14 },
  { n:15, label:'Shine Border',          C:C15 },
  { n:16, label:'Score Accent Right',    C:C16 },
  { n:17, label:'3D Shadow',             C:C17 },
  { n:18, label:'Minimal Dots',          C:C18 },
  { n:19, label:'Carbon Fiber',          C:C19 },
  { n:20, label:'Name Large',            C:C20 },
  { n:21, label:'Horizontal Gauge',      C:C21 },
  { n:22, label:'Score Focus',           C:C22 },
  { n:23, label:'Top Banner #1',         C:C23 },
  { n:24, label:'Avatar Initial',        C:C24 },
  { n:25, label:'Two-Tone Split',        C:C25 },
  { n:26, label:'Delta Chip',            C:C26 },
  { n:27, label:'Striped Rows',          C:C27 },
  { n:28, label:'Cut Corner',            C:C28 },
  { n:29, label:'Shield Icon',           C:C29 },
  { n:30, label:'Monochrome',            C:C30 },
  { n:31, label:'Points Bar Right',      C:C31 },
  { n:32, label:'Pastel',                C:C32 },
  { n:33, label:'Underline Only',        C:C33 },
  { n:34, label:'Holographic',           C:C34 },
  { n:35, label:'Bold Number Left',      C:C35 },
  { n:36, label:'Trophy Top 3',          C:C36 },
  { n:37, label:'Points First',          C:C37 },
  { n:38, label:'Gradient L→R',          C:C38 },
  { n:39, label:'Chip Tags',             C:C39 },
  { n:40, label:'Glow Dot',              C:C40 },
  { n:41, label:'Star Rating',           C:C41 },
  { n:42, label:'Zap Live',              C:C42 },
  { n:43, label:'Mega Card',             C:C43 },
  { n:44, label:'Compact Inline',        C:C44 },
  { n:45, label:'Inset Shadow',          C:C45 },
  { n:46, label:'Magazine Row',          C:C46 },
  { n:47, label:'Gradient Pulse Border', C:C47 },
  { n:48, label:'Right Rank Badge',      C:C48 },
  { n:49, label:'Compare Bar',           C:C49 },
  { n:50, label:'Podium Special',        C:C50 },
];

export default function AdminPlayerCardsDemo() {
  const [search, setSearch] = useState('');
  const filtered = OPTIONS.filter(o =>
    search==='' || o.label.toLowerCase().includes(search.toLowerCase()) || String(o.n).includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Player Cards Demo</h2>
          <p className="text-slate-400 text-sm">50 עיצובים שונים לקלפי משתתפים</p>
        </div>
        <div className="mr-auto">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="חפש עיצוב..."
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs placeholder-slate-500 outline-none focus:border-amber-500/50 w-40" />
        </div>
      </div>

      <div className="text-slate-500 text-xs">
        {filtered.length} מתוך 50 עיצובים · כל תצוגה מראה את 5 השחקנים עם נתוני דמו
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(({ n, label, C }) => (
          <Preview key={n} n={n} label={label}>
            {PLAYERS.map((p, i) => (
              <C key={p.id} p={p} i={i} all={PLAYERS} />
            ))}
          </Preview>
        ))}
      </div>
    </div>
  );
}
