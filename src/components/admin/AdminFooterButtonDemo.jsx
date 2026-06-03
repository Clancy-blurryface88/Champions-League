import React, { useState } from 'react';

const DESIGNS = [
  // ── 1-10: Gold / Amber ──────────────────────────────────────────────────────
  { id: 1, name: 'Gold Glow (נוכחי)', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold transition-colors cursor-pointer"
      style={{ color:'rgba(255,200,50,0.9)', textShadow:'0 0 12px rgba(255,200,50,0.6)' }}>{label}</div>
  )},
  { id: 2, name: 'Gold Solid', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 transition-colors">{label}</div>
  )},
  { id: 3, name: 'Gold Border', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition-colors">{label}</div>
  )},
  { id: 4, name: 'Gold Pill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-bold cursor-pointer bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/25 transition-colors">{label}</div>
  )},
  { id: 5, name: 'Gold Gradient Fill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-black transition-opacity hover:opacity-80"
      style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }}>{label}</div>
  )},
  { id: 6, name: 'Gold Underline', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-yellow-400 border-b-2 border-yellow-400/60 hover:border-yellow-400 transition-colors">{label}</div>
  )},
  { id: 7, name: 'Gold Capsule', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer text-black transition-opacity hover:opacity-80"
      style={{ background: 'linear-gradient(90deg,#fbbf24,#f59e0b)' }}>{label}</div>
  )},
  { id: 8, name: 'Amber Muted', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-medium cursor-pointer text-amber-300/70 hover:text-amber-300 transition-colors">{label}</div>
  )},
  { id: 9, name: 'Gold Shadow Box', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-yellow-400 hover:opacity-80 transition-opacity"
      style={{ background:'rgba(251,191,36,0.1)', boxShadow:'0 0 14px rgba(251,191,36,0.2), inset 0 1px 0 rgba(251,191,36,0.15)' }}>{label}</div>
  )},
  { id: 10, name: 'Burnished Gold', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(180deg,rgba(251,191,36,0.18) 0%,rgba(251,191,36,0.06) 100%)', color:'#fde68a', borderTop:'1px solid rgba(251,191,36,0.3)' }}>{label}</div>
  )},

  // ── 11-20: Blue / Cyan ──────────────────────────────────────────────────────
  { id: 11, name: 'Blue Glow', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"
      style={{ color:'rgba(96,165,250,0.9)', textShadow:'0 0 12px rgba(96,165,250,0.6)' }}>{label}</div>
  )},
  { id: 12, name: 'Blue Fill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer bg-blue-600/25 hover:bg-blue-600/40 text-blue-300 transition-colors">{label}</div>
  )},
  { id: 13, name: 'Cyan Outline', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors">{label}</div>
  )},
  { id: 14, name: 'Blue Gradient', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(135deg,#2563eb,#0ea5e9)' }}>{label}</div>
  )},
  { id: 15, name: 'Ice Capsule', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-sky-500/15 border border-sky-400/40 text-sky-300 hover:bg-sky-500/25 transition-colors">{label}</div>
  )},
  { id: 16, name: 'Cobalt Glow', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-blue-300 hover:opacity-80 transition-opacity"
      style={{ background:'rgba(37,99,235,0.15)', boxShadow:'0 0 14px rgba(37,99,235,0.25)' }}>{label}</div>
  )},
  { id: 17, name: 'Blue Underline', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-blue-400 border-b-2 border-blue-400/50 hover:border-blue-400 transition-colors">{label}</div>
  )},
  { id: 18, name: 'Neon Cyan', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"
      style={{ color:'#22d3ee', textShadow:'0 0 16px rgba(34,211,238,0.7)' }}>{label}</div>
  )},
  { id: 19, name: 'Electric Blue', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80 transition-opacity"
      style={{ background:'rgba(59,130,246,0.2)', border:'1px solid rgba(59,130,246,0.5)', boxShadow:'0 0 20px rgba(59,130,246,0.2)' }}>{label}</div>
  )},
  { id: 20, name: 'Sky Muted', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-medium cursor-pointer text-sky-300/60 hover:text-sky-300 transition-colors">{label}</div>
  )},

  // ── 21-30: Green / Emerald ──────────────────────────────────────────────────
  { id: 21, name: 'Emerald Glow', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"
      style={{ color:'rgba(52,211,153,0.9)', textShadow:'0 0 12px rgba(52,211,153,0.6)' }}>{label}</div>
  )},
  { id: 22, name: 'Green Fill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 transition-colors">{label}</div>
  )},
  { id: 23, name: 'Jade Outline', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-colors">{label}</div>
  )},
  { id: 24, name: 'Green Gradient', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-black hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(135deg,#059669,#34d399)' }}>{label}</div>
  )},
  { id: 25, name: 'Matrix', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer font-mono"
      style={{ color:'#00ff41', textShadow:'0 0 10px #00ff41' }}>{label}</div>
  )},
  { id: 26, name: 'Lime Capsule', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-lime-500/15 border border-lime-400/40 text-lime-300 hover:bg-lime-500/25 transition-colors">{label}</div>
  )},
  { id: 27, name: 'Teal Glow', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"
      style={{ color:'#2dd4bf', textShadow:'0 0 12px rgba(45,212,191,0.6)' }}>{label}</div>
  )},
  { id: 28, name: 'Green Underline', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-emerald-400 border-b-2 border-emerald-400/50 hover:border-emerald-400 transition-colors">{label}</div>
  )},
  { id: 29, name: 'Neon Green Pill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-full text-xs font-bold cursor-pointer text-green-400 hover:opacity-80 transition-opacity"
      style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.4)', boxShadow:'0 0 12px rgba(74,222,128,0.15)' }}>{label}</div>
  )},
  { id: 30, name: 'Forest Muted', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-medium cursor-pointer text-emerald-300/60 hover:text-emerald-300 transition-colors">{label}</div>
  )},

  // ── 31-40: Purple / Violet ──────────────────────────────────────────────────
  { id: 31, name: 'Purple Glow', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"
      style={{ color:'rgba(192,132,252,0.9)', textShadow:'0 0 12px rgba(192,132,252,0.6)' }}>{label}</div>
  )},
  { id: 32, name: 'Violet Fill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer bg-violet-600/25 hover:bg-violet-600/40 text-violet-300 transition-colors">{label}</div>
  )},
  { id: 33, name: 'Purple Outline', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-colors">{label}</div>
  )},
  { id: 34, name: 'Purple Gradient', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{label}</div>
  )},
  { id: 35, name: 'Neon Purple', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"
      style={{ color:'#e879f9', textShadow:'0 0 16px rgba(232,121,249,0.7)' }}>{label}</div>
  )},
  { id: 36, name: 'Indigo Capsule', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-indigo-500/15 border border-indigo-400/40 text-indigo-300 hover:bg-indigo-500/25 transition-colors">{label}</div>
  )},
  { id: 37, name: 'Lavender Muted', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-medium cursor-pointer text-purple-300/60 hover:text-purple-300 transition-colors">{label}</div>
  )},
  { id: 38, name: 'Purple Neon Box', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-purple-300 hover:opacity-80 transition-opacity"
      style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.4)', boxShadow:'0 0 16px rgba(139,92,246,0.2)' }}>{label}</div>
  )},
  { id: 39, name: 'Violet Underline', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-violet-400 border-b-2 border-violet-400/50 hover:border-violet-400 transition-colors">{label}</div>
  )},
  { id: 40, name: 'Fuchsia Glow', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"
      style={{ color:'#f0abfc', textShadow:'0 0 12px rgba(240,171,252,0.5)' }}>{label}</div>
  )},

  // ── 41-50: White / Silver / Minimal ────────────────────────────────────────
  { id: 41, name: 'White Clean', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-white/80 hover:text-white transition-colors">{label}</div>
  )},
  { id: 42, name: 'White Outline', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-white/20 text-white/80 hover:bg-white/5 transition-colors">{label}</div>
  )},
  { id: 43, name: 'Silver Glow', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"
      style={{ color:'rgba(203,213,225,0.9)', textShadow:'0 0 8px rgba(203,213,225,0.4)' }}>{label}</div>
  )},
  { id: 44, name: 'Frosted Glass', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white/90 hover:opacity-80 transition-opacity"
      style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(8px)' }}>{label}</div>
  )},
  { id: 45, name: 'Minimal Caps', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-[10px] font-semibold tracking-widest uppercase cursor-pointer text-white/50 hover:text-white/80 transition-colors">{label}</div>
  )},
  { id: 46, name: 'White Underline', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-white/70 border-b-2 border-white/20 hover:border-white/50 hover:text-white transition-colors">{label}</div>
  )},
  { id: 47, name: 'Ghost', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-medium cursor-pointer text-slate-400 hover:text-white hover:bg-white/5 transition-all">{label}</div>
  )},
  { id: 48, name: 'Platinum Pill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-slate-500/15 border border-slate-400/30 text-slate-300 hover:bg-slate-500/25 transition-colors">{label}</div>
  )},
  { id: 49, name: 'White Bold', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-black cursor-pointer text-white bg-white/8 hover:bg-white/14 transition-colors">{label}</div>
  )},
  { id: 50, name: 'Italic Light', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs italic font-light cursor-pointer text-white/60 hover:text-white transition-colors">{label}</div>
  )},

  // ── 51-60: Rose / Red / Orange ──────────────────────────────────────────────
  { id: 51, name: 'Rose Glow', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"
      style={{ color:'rgba(251,113,133,0.9)', textShadow:'0 0 12px rgba(251,113,133,0.6)' }}>{label}</div>
  )},
  { id: 52, name: 'Orange Fill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer bg-orange-600/25 hover:bg-orange-600/40 text-orange-300 transition-colors">{label}</div>
  )},
  { id: 53, name: 'Crimson Outline', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors">{label}</div>
  )},
  { id: 54, name: 'Fire Gradient', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(135deg,#dc2626,#f97316)' }}>{label}</div>
  )},
  { id: 55, name: 'Sunset Capsule', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-orange-500/15 border border-orange-400/40 text-orange-300 hover:bg-orange-500/25 transition-colors">{label}</div>
  )},

  // ── 61-70: Multi-color / Gradient Text ─────────────────────────────────────
  { id: 61, name: 'Gradient Text G→B', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer">
      <span style={{ background:'linear-gradient(90deg,#4ade80,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{label}</span>
    </div>
  )},
  { id: 62, name: 'Gradient Text G→Gold', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer">
      <span style={{ background:'linear-gradient(90deg,#34d399,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{label}</span>
    </div>
  )},
  { id: 63, name: 'Gradient Text P→C', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer">
      <span style={{ background:'linear-gradient(90deg,#a855f7,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{label}</span>
    </div>
  )},
  { id: 64, name: 'Rainbow Text', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer">
      <span style={{ background:'linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#4ade80,#38bdf8,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{label}</span>
    </div>
  )},
  { id: 65, name: 'Gradient Pill G→Gold', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-bold cursor-pointer text-black hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(90deg,#34d399,#fbbf24)' }}>{label}</div>
  )},
  { id: 66, name: 'Aurora Pill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(135deg,rgba(76,29,149,0.6),rgba(6,78,59,0.6))', border:'1px solid rgba(167,139,250,0.3)' }}>{label}</div>
  )},
  { id: 67, name: 'Jade→Gold Pill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-bold cursor-pointer text-white hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(90deg,rgba(0,95,80,0.8),rgba(180,138,12,0.8))', border:'1px solid rgba(212,175,55,0.3)' }}>{label}</div>
  )},
  { id: 68, name: 'Blue→Purple Fill', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer text-white hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(90deg,rgba(37,99,235,0.35),rgba(124,58,237,0.35))' }}>{label}</div>
  )},
  { id: 69, name: 'Sunset Gradient', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(135deg,#dc2626,#f97316,#fbbf24)' }}>{label}</div>
  )},
  { id: 70, name: 'Ocean Gradient', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80 transition-opacity"
      style={{ background:'linear-gradient(135deg,#0ea5e9,#14b8a6)' }}>{label}</div>
  )},

  // ── 71-75: Special ──────────────────────────────────────────────────────────
  { id: 71, name: 'Retro LCD', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer font-mono"
      style={{ color:'#39ff14', textShadow:'0 0 8px #39ff14', letterSpacing:'0.05em' }}>{label}</div>
  )},
  { id: 72, name: 'Chip Style', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 cursor-pointer">
      <span className="px-3 py-1 rounded-md text-[10px] font-bold tracking-wide bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 transition-colors">{label}</span>
    </div>
  )},
  { id: 73, name: 'Outlined Rounded', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-xl text-xs font-bold cursor-pointer border-2 border-yellow-400/60 text-yellow-400 hover:bg-yellow-400/10 transition-colors">{label}</div>
  )},
  { id: 74, name: 'Soft Glow Box', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80 transition-opacity"
      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 0 20px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)' }}>{label}</div>
  )},
  { id: 75, name: 'Bold Flat Dark', render: (label) => (
    <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-black cursor-pointer text-white bg-slate-800 hover:bg-slate-700 transition-colors tracking-wide">{label}</div>
  )},
];

function FooterPreview({ design }) {
  return (
    <div className="rounded-b-xl overflow-hidden relative" style={{ background:'rgba(6,8,16,0.98)' }}>
      <div className="absolute top-0 left-4 right-4 h-[2px]"
        style={{ background:'linear-gradient(90deg, transparent, rgba(255,200,50,0.4) 20%, rgba(255,200,50,0.4) 80%, transparent)' }} />
      <div className="flex">
        {design.render('1 X 2')}
        <div className="w-[2px] my-1.5" style={{ background:'rgba(255,255,255,0.1)' }} />
        {design.render('ניחושים')}
      </div>
    </div>
  );
}

export default function AdminFooterButtonDemo() {
  const [selected, setSelected] = useState(null);
  const sel = DESIGNS.find(d => d.id === selected);

  return (
    <div className="text-white space-y-6">
      <div>
        <h2 className="text-2xl font-bold">🎨 עיצובי כפתורי Footer — 75 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">כל תא מציג איך ייראו כפתורי "1X2" ו-"ניחושים" בתחתית כרטיסיית המשחק. לחץ לבחירה.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {DESIGNS.map(d => (
          <div
            key={d.id}
            onClick={() => setSelected(d.id === selected ? null : d.id)}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected === d.id ? 'border-white/50 ring-2 ring-white/20 scale-105' : 'border-slate-800 hover:border-slate-600'}`}
            style={{ background:'#0a0c14' }}
          >
            <div className="pt-3 px-2 pb-1 flex flex-col justify-center min-h-[60px]">
              <FooterPreview design={d} />
            </div>
            <div className="px-2.5 py-2 border-t border-slate-800/80 flex items-center gap-1.5">
              <span className="text-[9px] text-slate-600 font-mono flex-shrink-0">#{d.id}</span>
              <span className="text-[10px] font-semibold text-white truncate">{d.name}</span>
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <div className="mt-4 rounded-2xl border border-white/15 p-5 flex gap-6 items-center flex-wrap" style={{ background:'rgba(6,8,16,0.98)' }}>
          <div className="w-64 rounded-xl overflow-hidden border border-slate-700" style={{ background:'#0a0c14' }}>
            <div className="p-4 text-center">
              <p className="text-white/40 text-xs">תחתית כרטיסיית משחק</p>
              <p className="text-white text-sm font-semibold mt-1">Israel vs Brazil</p>
            </div>
            <div className="h-px bg-slate-800" />
            <FooterPreview design={sel} />
          </div>
          <div>
            <p className="font-bold text-white text-lg">#{sel.id} — {sel.name}</p>
            <button onClick={() => setSelected(null)} className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">✕ סגור</button>
          </div>
        </div>
      )}
    </div>
  );
}
