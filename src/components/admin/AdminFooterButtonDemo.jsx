import React, { useState } from 'react';

const DESIGNS = [
  // ── 1-15: Gold / Amber ──────────────────────────────────────────────────────
  { id: 1,  name: 'Gold Glow (נוכחי)', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'rgba(255,200,50,0.9)', textShadow:'0 0 12px rgba(255,200,50,0.6)' }}>{l}</div> },
  { id: 2,  name: 'Gold Fill', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 transition-colors">{l}</div> },
  { id: 3,  name: 'Gold Border Box', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition-colors">{l}</div> },
  { id: 4,  name: 'Gold Pill', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-bold cursor-pointer bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/25 transition-colors">{l}</div> },
  { id: 5,  name: 'Gold Solid Fill', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-black hover:opacity-80 transition-opacity" style={{ background:'linear-gradient(135deg,#f59e0b,#fbbf24)' }}>{l}</div> },
  { id: 6,  name: 'Gold Underline', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-yellow-400 border-b-2 border-yellow-400/60 hover:border-yellow-400 transition-colors">{l}</div> },
  { id: 7,  name: 'Gold Capsule Solid', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer text-black hover:opacity-80" style={{ background:'linear-gradient(90deg,#fbbf24,#f59e0b)' }}>{l}</div> },
  { id: 8,  name: 'Amber Muted', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-medium cursor-pointer text-amber-300/70 hover:text-amber-300 transition-colors">{l}</div> },
  { id: 9,  name: 'Gold Shadow Box', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-yellow-400 hover:opacity-80" style={{ background:'rgba(251,191,36,0.1)', boxShadow:'0 0 14px rgba(251,191,36,0.2),inset 0 1px 0 rgba(251,191,36,0.15)' }}>{l}</div> },
  { id: 10, name: 'Burnished Gold', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer hover:opacity-80" style={{ background:'linear-gradient(180deg,rgba(251,191,36,0.18) 0%,rgba(251,191,36,0.06) 100%)', color:'#fde68a', borderTop:'1px solid rgba(251,191,36,0.3)' }}>{l}</div> },
  { id: 11, name: 'Gold Wide Pill', render: (l) => <div className="flex-1 flex items-center justify-center py-1.5 mx-3 my-2 rounded-full text-xs font-bold cursor-pointer border-2 border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/10">{l}</div> },
  { id: 12, name: 'Satin Gold', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer" style={{ background:'linear-gradient(90deg,transparent,rgba(251,191,36,0.12),transparent)', color:'#fbbf24' }}>{l}</div> },
  { id: 13, name: 'Gold Glow Box', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-xl text-xs font-black cursor-pointer text-yellow-300" style={{ background:'rgba(251,191,36,0.07)', border:'1px solid rgba(251,191,36,0.35)', boxShadow:'0 0 20px rgba(251,191,36,0.15),0 0 40px rgba(251,191,36,0.07)' }}>{l}</div> },
  { id: 14, name: 'Honey Gradient', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1 my-1 rounded-lg text-xs font-bold cursor-pointer text-amber-900" style={{ background:'linear-gradient(135deg,#fbbf24,#f59e0b,#d97706)' }}>{l}</div> },
  { id: 15, name: 'Gold Serif', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-sm cursor-pointer text-yellow-400/90 hover:text-yellow-300" style={{ fontFamily:'Georgia,serif', letterSpacing:'0.03em' }}>{l}</div> },

  // ── 16-30: Blue / Cyan / Sky ────────────────────────────────────────────────
  { id: 16, name: 'Blue Glow', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'rgba(96,165,250,0.9)', textShadow:'0 0 12px rgba(96,165,250,0.6)' }}>{l}</div> },
  { id: 17, name: 'Blue Fill', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer bg-blue-600/25 hover:bg-blue-600/40 text-blue-300 transition-colors">{l}</div> },
  { id: 18, name: 'Cyan Outline', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors">{l}</div> },
  { id: 19, name: 'Blue Gradient', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,#2563eb,#0ea5e9)' }}>{l}</div> },
  { id: 20, name: 'Ice Capsule', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-sky-500/15 border border-sky-400/40 text-sky-300 hover:bg-sky-500/25 transition-colors">{l}</div> },
  { id: 21, name: 'Cobalt Glow', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-blue-300 hover:opacity-80" style={{ background:'rgba(37,99,235,0.15)', boxShadow:'0 0 14px rgba(37,99,235,0.25)' }}>{l}</div> },
  { id: 22, name: 'Blue Underline', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-blue-400 border-b-2 border-blue-400/50 hover:border-blue-400 transition-colors">{l}</div> },
  { id: 23, name: 'Neon Cyan', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'#22d3ee', textShadow:'0 0 16px rgba(34,211,238,0.7)' }}>{l}</div> },
  { id: 24, name: 'Electric Blue', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'rgba(59,130,246,0.18)', border:'1px solid rgba(59,130,246,0.5)', boxShadow:'0 0 20px rgba(59,130,246,0.2)' }}>{l}</div> },
  { id: 25, name: 'Steel Pill', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-bold cursor-pointer text-blue-200 border border-blue-400/30 hover:bg-blue-400/10 transition-colors">{l}</div> },
  { id: 26, name: 'Ocean Fill', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(90deg,rgba(7,89,133,0.5),rgba(14,165,233,0.3))' }}>{l}</div> },
  { id: 27, name: 'Sky Glow Pill', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-full text-xs font-bold cursor-pointer text-sky-300" style={{ background:'rgba(14,165,233,0.08)', border:'1px solid rgba(14,165,233,0.4)', boxShadow:'0 0 14px rgba(14,165,233,0.15)' }}>{l}</div> },
  { id: 28, name: 'Arctic', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,#0c4a6e,#0284c7)' }}>{l}</div> },
  { id: 29, name: 'Blue Mono', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer font-mono text-cyan-400/80 hover:text-cyan-300 transition-colors tracking-wider">{l}</div> },
  { id: 30, name: 'Blueprint', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-md text-xs font-bold cursor-pointer text-blue-300" style={{ background:'rgba(30,64,175,0.2)', border:'1px solid rgba(59,130,246,0.3)', borderBottom:'2px solid rgba(59,130,246,0.6)' }}>{l}</div> },

  // ── 31-45: Green / Teal / Jade ─────────────────────────────────────────────
  { id: 31, name: 'Emerald Glow', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'rgba(52,211,153,0.9)', textShadow:'0 0 12px rgba(52,211,153,0.6)' }}>{l}</div> },
  { id: 32, name: 'Green Fill', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 transition-colors">{l}</div> },
  { id: 33, name: 'Jade Outline', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-colors">{l}</div> },
  { id: 34, name: 'Green Gradient', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-black hover:opacity-80" style={{ background:'linear-gradient(135deg,#059669,#34d399)' }}>{l}</div> },
  { id: 35, name: 'Matrix', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer font-mono" style={{ color:'#00ff41', textShadow:'0 0 10px #00ff41' }}>{l}</div> },
  { id: 36, name: 'Lime Capsule', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-lime-500/15 border border-lime-400/40 text-lime-300 hover:bg-lime-500/25 transition-colors">{l}</div> },
  { id: 37, name: 'Teal Glow', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'#2dd4bf', textShadow:'0 0 12px rgba(45,212,191,0.6)' }}>{l}</div> },
  { id: 38, name: 'Green Underline', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-emerald-400 border-b-2 border-emerald-400/50 hover:border-emerald-400 transition-colors">{l}</div> },
  { id: 39, name: 'Neon Green Pill', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-full text-xs font-bold cursor-pointer text-green-400 hover:opacity-80" style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.4)', boxShadow:'0 0 12px rgba(74,222,128,0.15)' }}>{l}</div> },
  { id: 40, name: 'Deep Forest', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-emerald-300 hover:opacity-80" style={{ background:'rgba(6,78,59,0.4)', border:'1px solid rgba(16,185,129,0.3)' }}>{l}</div> },
  { id: 41, name: 'Spearmint', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer text-emerald-200 hover:opacity-80" style={{ background:'linear-gradient(90deg,transparent,rgba(16,185,129,0.15),transparent)', borderTop:'1px solid rgba(16,185,129,0.2)' }}>{l}</div> },
  { id: 42, name: 'Jade Solid', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,#065f46,#0d9488)' }}>{l}</div> },
  { id: 43, name: 'Teal Neon Box', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-teal-300 hover:opacity-80" style={{ background:'rgba(20,184,166,0.08)', border:'1px solid rgba(20,184,166,0.4)', boxShadow:'0 0 16px rgba(20,184,166,0.18)' }}>{l}</div> },
  { id: 44, name: 'Mint Muted', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-medium cursor-pointer text-teal-300/60 hover:text-teal-300 transition-colors">{l}</div> },
  { id: 45, name: 'Chlorophyll', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-xl text-xs font-bold cursor-pointer border-2 border-green-500/50 text-green-400 hover:bg-green-500/10 transition-colors">{l}</div> },

  // ── 46-58: Purple / Violet / Pink ───────────────────────────────────────────
  { id: 46, name: 'Purple Glow', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'rgba(192,132,252,0.9)', textShadow:'0 0 12px rgba(192,132,252,0.6)' }}>{l}</div> },
  { id: 47, name: 'Violet Fill', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer bg-violet-600/25 hover:bg-violet-600/40 text-violet-300 transition-colors">{l}</div> },
  { id: 48, name: 'Purple Outline', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-colors">{l}</div> },
  { id: 49, name: 'Purple Gradient', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{l}</div> },
  { id: 50, name: 'Neon Purple', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'#e879f9', textShadow:'0 0 16px rgba(232,121,249,0.7)' }}>{l}</div> },
  { id: 51, name: 'Indigo Capsule', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-indigo-500/15 border border-indigo-400/40 text-indigo-300 hover:bg-indigo-500/25 transition-colors">{l}</div> },
  { id: 52, name: 'Purple Neon Box', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-purple-300 hover:opacity-80" style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.4)', boxShadow:'0 0 16px rgba(139,92,246,0.2)' }}>{l}</div> },
  { id: 53, name: 'Violet Underline', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-violet-400 border-b-2 border-violet-400/50 hover:border-violet-400 transition-colors">{l}</div> },
  { id: 54, name: 'Fuchsia Glow', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'#f0abfc', textShadow:'0 0 12px rgba(240,171,252,0.5)' }}>{l}</div> },
  { id: 55, name: 'Royal Purple', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,#4c1d95,#7c3aed)' }}>{l}</div> },
  { id: 56, name: 'Pink Capsule', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-pink-500/15 border border-pink-400/40 text-pink-300 hover:bg-pink-500/25 transition-colors">{l}</div> },
  { id: 57, name: 'Magenta Glow', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'#f472b6', textShadow:'0 0 14px rgba(244,114,182,0.6)' }}>{l}</div> },
  { id: 58, name: 'Deep Indigo', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-indigo-200 hover:opacity-80" style={{ background:'rgba(67,56,202,0.2)', border:'1px solid rgba(99,102,241,0.4)', boxShadow:'0 0 18px rgba(99,102,241,0.15)' }}>{l}</div> },

  // ── 59-68: White / Silver / Minimal ────────────────────────────────────────
  { id: 59, name: 'White Clean', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-white/80 hover:text-white transition-colors">{l}</div> },
  { id: 60, name: 'White Outline', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-white/20 text-white/80 hover:bg-white/5 transition-colors">{l}</div> },
  { id: 61, name: 'Silver Glow', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'rgba(203,213,225,0.9)', textShadow:'0 0 8px rgba(203,213,225,0.4)' }}>{l}</div> },
  { id: 62, name: 'Frosted Glass', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white/90 hover:opacity-80" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(8px)' }}>{l}</div> },
  { id: 63, name: 'Minimal Caps', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-[10px] font-semibold tracking-widest uppercase cursor-pointer text-white/50 hover:text-white/80 transition-colors">{l}</div> },
  { id: 64, name: 'White Underline', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer text-white/70 border-b-2 border-white/20 hover:border-white/50 hover:text-white transition-colors">{l}</div> },
  { id: 65, name: 'Ghost', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-medium cursor-pointer text-slate-400 hover:text-white hover:bg-white/5 transition-all">{l}</div> },
  { id: 66, name: 'Platinum Pill', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-slate-500/15 border border-slate-400/30 text-slate-300 hover:bg-slate-500/25 transition-colors">{l}</div> },
  { id: 67, name: 'Italic Light', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs italic font-light cursor-pointer text-white/60 hover:text-white transition-colors">{l}</div> },
  { id: 68, name: 'Soft Glow Box', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 0 20px rgba(255,255,255,0.05),inset 0 1px 0 rgba(255,255,255,0.08)' }}>{l}</div> },

  // ── 69-76: Rose / Red / Orange / Fire ───────────────────────────────────────
  { id: 69, name: 'Rose Glow', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer" style={{ color:'rgba(251,113,133,0.9)', textShadow:'0 0 12px rgba(251,113,133,0.6)' }}>{l}</div> },
  { id: 70, name: 'Orange Fill', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer bg-orange-600/25 hover:bg-orange-600/40 text-orange-300 transition-colors">{l}</div> },
  { id: 71, name: 'Crimson Outline', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors">{l}</div> },
  { id: 72, name: 'Fire Gradient', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,#dc2626,#f97316)' }}>{l}</div> },
  { id: 73, name: 'Sunset Capsule', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-semibold cursor-pointer bg-orange-500/15 border border-orange-400/40 text-orange-300 hover:bg-orange-500/25 transition-colors">{l}</div> },
  { id: 74, name: 'Lava Glow', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-red-300 hover:opacity-80" style={{ background:'rgba(220,38,38,0.1)', border:'1px solid rgba(239,68,68,0.4)', boxShadow:'0 0 16px rgba(220,38,38,0.2)' }}>{l}</div> },
  { id: 75, name: 'Coral Pill', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-bold cursor-pointer text-rose-300" style={{ background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.35)', boxShadow:'0 0 12px rgba(244,63,94,0.15)' }}>{l}</div> },
  { id: 76, name: 'Volcano', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,#7f1d1d,#c2410c,#f97316)' }}>{l}</div> },

  // ── 77-88: Gradient Text & Multi-color ─────────────────────────────────────
  { id: 77,  name: 'Grad Text: Green→Blue', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"><span style={{ background:'linear-gradient(90deg,#4ade80,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{l}</span></div> },
  { id: 78,  name: 'Grad Text: Green→Gold', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"><span style={{ background:'linear-gradient(90deg,#34d399,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{l}</span></div> },
  { id: 79,  name: 'Grad Text: Purple→Cyan', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"><span style={{ background:'linear-gradient(90deg,#a855f7,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{l}</span></div> },
  { id: 80,  name: 'Rainbow Text', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"><span style={{ background:'linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#4ade80,#38bdf8,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{l}</span></div> },
  { id: 81,  name: 'Jade→Gold Pill', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 rounded-full text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(90deg,rgba(0,95,80,0.8),rgba(180,138,12,0.8))', border:'1px solid rgba(212,175,55,0.3)' }}>{l}</div> },
  { id: 82,  name: 'Blue→Purple Fill', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(90deg,rgba(37,99,235,0.35),rgba(124,58,237,0.35))' }}>{l}</div> },
  { id: 83,  name: 'Sunset Gradient Box', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,#dc2626,#f97316,#fbbf24)' }}>{l}</div> },
  { id: 84,  name: 'Ocean Box', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,#0ea5e9,#14b8a6)' }}>{l}</div> },
  { id: 85,  name: 'Aurora Pill', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,rgba(76,29,149,0.6),rgba(6,78,59,0.6))', border:'1px solid rgba(167,139,250,0.3)' }}>{l}</div> },
  { id: 86,  name: 'Blue+Gold Outlined', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer hover:opacity-80"><span style={{ background:'linear-gradient(90deg,#60a5fa,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', border:'1px solid rgba(251,191,36,0.3)', padding:'2px 8px', borderRadius:'6px' }}>{l}</span></div> },
  { id: 87,  name: 'Grad Text: Rose→Gold', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer"><span style={{ background:'linear-gradient(90deg,#fb7185,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{l}</span></div> },
  { id: 88,  name: 'Nebula Fill', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer text-white hover:opacity-80" style={{ background:'linear-gradient(135deg,rgba(49,10,101,0.55),rgba(7,89,133,0.45))' }}>{l}</div> },

  // ── 89-100: Special / Unique ────────────────────────────────────────────────
  { id: 89,  name: 'Retro LCD', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-bold cursor-pointer font-mono" style={{ color:'#39ff14', textShadow:'0 0 8px #39ff14', letterSpacing:'0.05em' }}>{l}</div> },
  { id: 90,  name: 'Chip Style', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-1.5 cursor-pointer"><span className="px-3 py-1 rounded-md text-[10px] font-bold tracking-wide bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 transition-colors">{l}</span></div> },
  { id: 91,  name: 'Bold Flat Dark', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-black cursor-pointer text-white bg-slate-800 hover:bg-slate-700 transition-colors tracking-wide">{l}</div> },
  { id: 92,  name: 'Split Colors', render: (l, i) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer" style={{ background: i === 0 ? 'rgba(37,99,235,0.2)' : 'rgba(234,179,8,0.2)', border: `1px solid ${i === 0 ? 'rgba(59,130,246,0.4)' : 'rgba(234,179,8,0.4)'}`, color: i === 0 ? '#93c5fd' : '#fde047' }}>{l}</div> },
  { id: 93,  name: 'Top Accent Line', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer text-yellow-400/90 hover:text-yellow-300" style={{ borderTop:'2px solid rgba(251,191,36,0.5)', background:'rgba(251,191,36,0.05)' }}>{l}</div> },
  { id: 94,  name: 'Raised Card', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-2 rounded-lg text-xs font-bold cursor-pointer text-white/80 hover:text-white" style={{ background:'rgba(30,41,59,0.8)', boxShadow:'0 4px 0 rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.06)' }}>{l}</div> },
  { id: 95,  name: 'Dotted Border', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-1.5 my-1.5 rounded-lg text-xs font-bold cursor-pointer text-yellow-400 hover:bg-yellow-400/5" style={{ border:'1.5px dashed rgba(251,191,36,0.5)' }}>{l}</div> },
  { id: 96,  name: 'Double Border', render: (l) => <div className="flex-1 flex items-center justify-center py-2 mx-2 my-2 text-xs font-bold cursor-pointer text-white/80 hover:text-white" style={{ outline:'1px solid rgba(255,255,255,0.08)', outlineOffset:'3px', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'8px' }}>{l}</div> },
  { id: 97,  name: 'Shimmer', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer hover:opacity-80"><span style={{ background:'linear-gradient(90deg,#94a3b8,#f8fafc,#94a3b8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{l}</span></div> },
  { id: 98,  name: 'Carbon', render: (l) => <div className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold cursor-pointer text-slate-300 hover:text-white" style={{ background:'repeating-linear-gradient(45deg,rgba(255,255,255,0.01) 0px,rgba(255,255,255,0.01) 1px,transparent 1px,transparent 8px)', borderTop:'1px solid rgba(255,255,255,0.08)' }}>{l}</div> },
  { id: 99,  name: 'Wide Spaced', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-[10px] font-semibold cursor-pointer text-white/60 hover:text-white/90 transition-colors" style={{ letterSpacing:'0.2em' }}>{l}</div> },
  { id: 100, name: 'Glitch', render: (l) => <div className="flex-1 flex items-center justify-center py-3 text-xs font-black cursor-pointer" style={{ color:'#fff', textShadow:'1px 0 0 #f87171, -1px 0 0 #38bdf8' }}>{l}</div> },
];

function FooterPreview({ design }) {
  return (
    <div className="rounded-b-xl overflow-hidden relative" style={{ background:'rgba(6,8,16,0.98)' }}>
      <div className="absolute top-0 left-4 right-4 h-[2px]"
        style={{ background:'linear-gradient(90deg,transparent,rgba(255,200,50,0.4) 20%,rgba(255,200,50,0.4) 80%,transparent)' }} />
      <div className="flex">
        {design.render('1 X 2', 0)}
        <div className="w-[2px] my-1.5" style={{ background:'rgba(255,255,255,0.1)' }} />
        {design.render('ניחושים', 1)}
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
        <h2 className="text-2xl font-bold">🎨 עיצובי Footer — 100 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">פריוויו אמיתי של כפתורי "1X2" ו-"ניחושים". לחץ לבחירה.</p>
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
