import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Mini match card with full color scheme applied ─────────────────────────────
function MatchCard({ scheme }) {
  const { cardBg, border, accent, accentGlow, accentDim, textMuted } = scheme;

  return (
    <div className="relative rounded-[18px] overflow-hidden" style={{ padding: "1.5px" }}>
      {/* Rotating conic border */}
      <motion.div className="absolute pointer-events-none"
        style={{ width:"200%", height:"200%", top:"-50%", left:"-50%",
          background:`conic-gradient(from 0deg, ${border.join(",")})` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />

      {/* Card content */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: cardBg, backdropFilter:"blur(20px)" }}>
        {/* Countdown */}
        <div className="p-3 flex flex-col gap-2">
          <div className="flex justify-center">
            <div className="rounded-xl px-3 py-1 flex gap-2" style={{ background:`${accentDim}`, border:`1px solid ${accent}30` }}>
              {[["15","ימים"],["0","שעות"],["10","דקות"]].map(([n,l])=>(
                <div key={l} className="flex flex-col items-center">
                  <span className="text-xs font-bold leading-none" style={{ color: accent }}>{n}</span>
                  <span className="text-[7px]" style={{ color:`${accent}70` }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Group badge */}
          <div className="flex justify-center">
            <span className="text-[9px] font-semibold px-4 py-0.5 rounded-full"
              style={{ color: accent, background:`${accent}15`, border:`1px solid ${accent}30` }}>
              Group A
            </span>
          </div>

          <div className="border-t" style={{ borderColor:`${accent}15` }} />

          {/* Teams */}
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col items-center gap-0.5 flex-1">
              <span className="fi fi-cz fis rounded-md" style={{ width:28,height:28,fontSize:28,display:"inline-block",backgroundSize:"cover" }} />
              <span className="text-[8px] text-white font-semibold">Czechia</span>
              <span className="text-[7px]" style={{ color: textMuted }}>(Home)</span>
            </div>
            <div className="flex items-center gap-1">
              {[2,0].map((v,i)=>(
                <div key={i} className="w-6 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{ background:"rgba(15,20,40,0.8)", border:`1.5px solid rgba(255,255,255,0.13)`, color:"white" }}>{v}</div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-0.5 flex-1">
              <span className="fi fi-za fis rounded-md" style={{ width:28,height:28,fontSize:28,display:"inline-block",backgroundSize:"cover" }} />
              <span className="text-[8px] text-white font-semibold">South Africa</span>
              <span className="text-[7px]" style={{ color: textMuted }}>(Away)</span>
            </div>
          </div>

          {/* Date */}
          <div className="text-center text-[7px]" style={{ color: textMuted }}>📅 18/06/2026 · Atlanta Stadium</div>

          {/* AI button */}
          <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl"
            style={{ background:`${accent}08`, border:`1px solid ${accent}28` }}>
            <span className="text-[8px] font-semibold" style={{ color: accent }}>✦ AI טרום משחק</span>
          </div>

          {/* Footer bar */}
          <div className="relative -mx-3 -mb-3 flex overflow-hidden rounded-b-2xl">
            <div className="absolute top-0 left-3 right-3 h-[1.5px]"
              style={{ background:`linear-gradient(90deg,transparent,${accent}55 20%,${accent}55 80%,transparent)` }} />
            <button className="flex-1 flex items-center justify-center py-2.5 text-[9px] font-bold"
              style={{ color: accentGlow, textShadow:`0 0 8px ${accent}60` }}>1 X 2</button>
            <div className="w-[1.5px] my-1" style={{ background:`${accent}45` }} />
            <button className="flex-1 flex items-center justify-center py-2.5 text-[9px] font-bold"
              style={{ color: accentGlow, textShadow:`0 0 8px ${accent}60` }}>ניחושים</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 40 color schemes ──────────────────────────────────────────────────────────
const SCHEMES = [
  { id:1,  name:"Blue + Jade/Gold",    tag:"נוכחי",
    cardBg:"linear-gradient(145deg,rgba(30,58,138,0.45),rgba(8,15,45,0.92),rgba(15,25,70,0.5))",
    border:["#022c22","#065f46","#059669","#6ee7b7","#fde68a","#fbbf24","#fde68a","#6ee7b7","#022c22"],
    accent:"#fbbf24", accentGlow:"rgba(255,200,50,0.9)", accentDim:"rgba(251,191,36,0.08)", textMuted:"rgba(148,163,184,0.7)" },

  { id:2,  name:"Black + Gold",        tag:"זהב",
    cardBg:"linear-gradient(145deg,rgba(20,14,2,0.95),rgba(10,8,2,0.98),rgba(18,12,0,0.9))",
    border:["#78350f","#d97706","#fbbf24","#fef3c7","#ffffff","#fef3c7","#fbbf24","#d97706","#78350f"],
    accent:"#fbbf24", accentGlow:"rgba(255,215,0,0.95)", accentDim:"rgba(251,191,36,0.1)", textMuted:"rgba(120,100,50,0.8)" },

  { id:3,  name:"Navy + Cyan",         tag:"ציאן",
    cardBg:"linear-gradient(145deg,rgba(8,20,50,0.9),rgba(5,12,35,0.95),rgba(10,25,55,0.85))",
    border:["#0c4a6e","#0ea5e9","#38bdf8","#bae6fd","#ffffff","#bae6fd","#38bdf8","#0ea5e9","#0c4a6e"],
    accent:"#38bdf8", accentGlow:"rgba(56,189,248,0.9)", accentDim:"rgba(56,189,248,0.08)", textMuted:"rgba(100,150,180,0.7)" },

  { id:4,  name:"Forest + Emerald",    tag:"יער",
    cardBg:"linear-gradient(145deg,rgba(2,20,10,0.92),rgba(1,12,6,0.96),rgba(5,18,10,0.88))",
    border:["#052e16","#166534","#16a34a","#4ade80","#86efac","#d9f99d","#86efac","#4ade80","#052e16"],
    accent:"#4ade80", accentGlow:"rgba(74,222,128,0.9)", accentDim:"rgba(74,222,128,0.08)", textMuted:"rgba(80,130,80,0.7)" },

  { id:5,  name:"Dark + Purple",       tag:"סגול",
    cardBg:"linear-gradient(145deg,rgba(30,10,60,0.88),rgba(15,5,40,0.95),rgba(25,8,55,0.85))",
    border:["#2e1065","#6d28d9","#a855f7","#d8b4fe","#ffffff","#d8b4fe","#a855f7","#6d28d9","#2e1065"],
    accent:"#c084fc", accentGlow:"rgba(192,132,252,0.9)", accentDim:"rgba(168,85,247,0.1)", textMuted:"rgba(130,80,160,0.7)" },

  { id:6,  name:"Crimson + Rose",      tag:"אדום",
    cardBg:"linear-gradient(145deg,rgba(40,5,5,0.92),rgba(20,2,2,0.97),rgba(35,5,8,0.88))",
    border:["#450a0a","#b91c1c","#ef4444","#fca5a5","#fff1f2","#fca5a5","#ef4444","#b91c1c","#450a0a"],
    accent:"#f87171", accentGlow:"rgba(248,113,113,0.9)", accentDim:"rgba(239,68,68,0.08)", textMuted:"rgba(150,80,80,0.7)" },

  { id:7,  name:"Charcoal + Orange",   tag:"כתום",
    cardBg:"linear-gradient(145deg,rgba(25,18,5,0.92),rgba(15,10,2,0.97),rgba(22,15,4,0.88))",
    border:["#431407","#c2410c","#ea580c","#fb923c","#fed7aa","#fb923c","#ea580c","#c2410c","#431407"],
    accent:"#fb923c", accentGlow:"rgba(251,146,60,0.9)", accentDim:"rgba(234,88,12,0.1)", textMuted:"rgba(140,100,50,0.7)" },

  { id:8,  name:"Midnight + Royal",    tag:"רויאל",
    cardBg:"linear-gradient(145deg,rgba(10,15,50,0.92),rgba(5,8,35,0.97),rgba(8,12,45,0.88))",
    border:["#1e1b4b","#3730a3","#6366f1","#818cf8","#e0e7ff","#818cf8","#6366f1","#3730a3","#1e1b4b"],
    accent:"#818cf8", accentGlow:"rgba(129,140,248,0.9)", accentDim:"rgba(99,102,241,0.1)", textMuted:"rgba(100,110,180,0.7)" },

  { id:9,  name:"Dark Teal + Mint",    tag:"מנטה",
    cardBg:"linear-gradient(145deg,rgba(2,20,18,0.92),rgba(1,12,10,0.97),rgba(4,18,16,0.88))",
    border:["#042f2e","#0f766e","#14b8a6","#5eead4","#ccfbf1","#5eead4","#14b8a6","#0f766e","#042f2e"],
    accent:"#5eead4", accentGlow:"rgba(94,234,212,0.9)", accentDim:"rgba(20,184,166,0.08)", textMuted:"rgba(70,130,120,0.7)" },

  { id:10, name:"Obsidian + Pink",     tag:"ורוד",
    cardBg:"linear-gradient(145deg,rgba(30,5,20,0.92),rgba(18,2,12,0.97),rgba(25,4,18,0.88))",
    border:["#500724","#9d174d","#db2777","#f472b6","#fbcfe8","#f472b6","#db2777","#9d174d","#500724"],
    accent:"#f472b6", accentGlow:"rgba(244,114,182,0.9)", accentDim:"rgba(219,39,119,0.08)", textMuted:"rgba(150,80,120,0.7)" },

  { id:11, name:"Black + Silver",      tag:"כסף",
    cardBg:"linear-gradient(145deg,rgba(10,12,16,0.96),rgba(5,6,8,0.99),rgba(8,10,14,0.95))",
    border:["#1e293b","#475569","#94a3b8","#cbd5e1","#f8fafc","#ffffff","#f8fafc","#94a3b8","#1e293b"],
    accent:"#cbd5e1", accentGlow:"rgba(203,213,225,0.85)", accentDim:"rgba(148,163,184,0.08)", textMuted:"rgba(100,116,139,0.7)" },

  { id:12, name:"Galaxy + Violet",     tag:"גלקסיה",
    cardBg:"linear-gradient(145deg,rgba(15,5,35,0.92),rgba(8,2,20,0.97),rgba(12,4,30,0.9))",
    border:["#0f0c29","#2d1b69","#6d28d9","#a78bfa","#f5d0fe","#e879f9","#a78bfa","#6d28d9","#0f0c29"],
    accent:"#a78bfa", accentGlow:"rgba(167,139,250,0.9)", accentDim:"rgba(109,40,217,0.1)", textMuted:"rgba(120,90,170,0.7)" },

  { id:13, name:"Warm Dark + Amber",   tag:"ענבר",
    cardBg:"linear-gradient(145deg,rgba(28,16,2,0.92),rgba(15,8,1,0.97),rgba(24,13,2,0.88))",
    border:["#451a03","#b45309","#d97706","#fbbf24","#fef3c7","#fbbf24","#d97706","#b45309","#451a03"],
    accent:"#fbbf24", accentGlow:"rgba(251,191,36,0.9)", accentDim:"rgba(217,119,6,0.1)", textMuted:"rgba(140,110,40,0.7)" },

  { id:14, name:"Deep Ocean + Pearl",  tag:"פנינה",
    cardBg:"linear-gradient(145deg,rgba(5,15,35,0.94),rgba(2,8,22,0.98),rgba(5,12,30,0.9))",
    border:["#0c1445","#1e3a8a","#3b82f6","#93c5fd","#e0f2fe","#ffffff","#e0f2fe","#93c5fd","#0c1445"],
    accent:"#bae6fd", accentGlow:"rgba(186,230,253,0.85)", accentDim:"rgba(59,130,246,0.08)", textMuted:"rgba(80,120,160,0.7)" },

  { id:15, name:"Lava + Fire",         tag:"לבה",
    cardBg:"linear-gradient(145deg,rgba(25,5,2,0.94),rgba(15,2,1,0.98),rgba(22,4,2,0.9))",
    border:["#1c0700","#7f1d1d","#dc2626","#f97316","#fbbf24","#f97316","#dc2626","#7f1d1d","#1c0700"],
    accent:"#f97316", accentGlow:"rgba(249,115,22,0.9)", accentDim:"rgba(220,38,38,0.1)", textMuted:"rgba(150,70,40,0.7)" },

  { id:16, name:"Rose Gold",           tag:"רוז גולד",
    cardBg:"linear-gradient(145deg,rgba(30,8,12,0.92),rgba(18,4,7,0.97),rgba(26,7,11,0.88))",
    border:["#881337","#c9748f","#e8b4b8","#fda4af","#fff1f2","#fda4af","#e8b4b8","#c9748f","#881337"],
    accent:"#fda4af", accentGlow:"rgba(253,164,175,0.9)", accentDim:"rgba(201,116,143,0.1)", textMuted:"rgba(160,90,100,0.7)" },

  { id:17, name:"Neon Matrix",         tag:"מטריקס",
    cardBg:"linear-gradient(145deg,rgba(0,8,0,0.97),rgba(0,5,0,0.99),rgba(0,6,2,0.95))",
    border:["#000000","#052e16","#166534","#16a34a","#4ade80","#86efac","#4ade80","#16a34a","#000000"],
    accent:"#4ade80", accentGlow:"rgba(74,222,128,0.95)", accentDim:"rgba(22,163,74,0.1)", textMuted:"rgba(50,120,50,0.7)" },

  { id:18, name:"Cyberpunk",           tag:"סייבר",
    cardBg:"linear-gradient(145deg,rgba(5,0,15,0.96),rgba(3,0,10,0.99),rgba(4,0,12,0.95))",
    border:["#0d001a","#6b21a8","#c026d3","#f0abfc","#00fff0","#f0abfc","#c026d3","#6b21a8","#0d001a"],
    accent:"#22d3ee", accentGlow:"rgba(34,211,238,0.9)", accentDim:"rgba(6,182,212,0.1)", textMuted:"rgba(100,180,200,0.7)" },

  { id:19, name:"Sunset + Dusk",       tag:"שקיעה",
    cardBg:"linear-gradient(145deg,rgba(25,5,18,0.92),rgba(15,2,10,0.97),rgba(22,4,16,0.88))",
    border:["#4a0020","#9d174d","#db2777","#f97316","#fbbf24","#f97316","#db2777","#9d174d","#4a0020"],
    accent:"#fb923c", accentGlow:"rgba(251,146,60,0.9)", accentDim:"rgba(249,115,22,0.1)", textMuted:"rgba(160,100,60,0.7)" },

  { id:20, name:"Arctic Ice",          tag:"ארקטי",
    cardBg:"linear-gradient(145deg,rgba(5,18,30,0.92),rgba(2,10,20,0.97),rgba(5,16,28,0.88))",
    border:["#082f49","#0369a1","#0ea5e9","#7dd3fc","#e0f2fe","#ffffff","#e0f2fe","#7dd3fc","#082f49"],
    accent:"#7dd3fc", accentGlow:"rgba(125,211,252,0.9)", accentDim:"rgba(14,165,233,0.08)", textMuted:"rgba(80,140,180,0.7)" },

  { id:21, name:"Dark Chocolate",      tag:"שוקולד",
    cardBg:"linear-gradient(145deg,rgba(20,10,5,0.94),rgba(12,5,2,0.98),rgba(18,8,4,0.9))",
    border:["#1c0700","#713f12","#a16207","#ca8a04","#fef08a","#ca8a04","#a16207","#713f12","#1c0700"],
    accent:"#fbbf24", accentGlow:"rgba(251,191,36,0.9)", accentDim:"rgba(161,98,7,0.1)", textMuted:"rgba(140,90,40,0.7)" },

  { id:22, name:"Deep Wine",           tag:"יין",
    cardBg:"linear-gradient(145deg,rgba(22,2,8,0.95),rgba(14,1,5,0.99),rgba(20,2,7,0.92))",
    border:["#300000","#7f1d1d","#991b1b","#e11d48","#fda4af","#fce7f3","#fda4af","#e11d48","#991b1b"],
    accent:"#fda4af", accentGlow:"rgba(253,164,175,0.9)", accentDim:"rgba(225,29,72,0.08)", textMuted:"rgba(160,80,90,0.7)" },

  { id:23, name:"Cobalt + Sky",        tag:"קובלט",
    cardBg:"linear-gradient(145deg,rgba(5,10,40,0.94),rgba(2,5,25,0.98),rgba(5,8,38,0.9))",
    border:["#172554","#1d4ed8","#3b82f6","#60a5fa","#bae6fd","#60a5fa","#3b82f6","#1d4ed8","#172554"],
    accent:"#60a5fa", accentGlow:"rgba(96,165,250,0.9)", accentDim:"rgba(59,130,246,0.1)", textMuted:"rgba(80,120,180,0.7)" },

  { id:24, name:"Jade Pure",           tag:"ג׳ייד",
    cardBg:"linear-gradient(145deg,rgba(2,20,15,0.92),rgba(1,12,8,0.97),rgba(3,18,13,0.88))",
    border:["#022c22","#065f46","#059669","#34d399","#a7f3d0","#d1fae5","#a7f3d0","#34d399","#022c22"],
    accent:"#34d399", accentGlow:"rgba(52,211,153,0.9)", accentDim:"rgba(5,150,105,0.1)", textMuted:"rgba(60,130,100,0.7)" },

  { id:25, name:"Volcanic + Lava",     tag:"וולקנו",
    cardBg:"linear-gradient(145deg,rgba(20,2,2,0.96),rgba(12,1,1,0.99),rgba(18,2,2,0.93))",
    border:["#1c0000","#450a0a","#b91c1c","#ea580c","#fbbf24","#fef9c3","#fbbf24","#ea580c","#b91c1c"],
    accent:"#fbbf24", accentGlow:"rgba(251,191,36,0.95)", accentDim:"rgba(185,28,28,0.1)", textMuted:"rgba(160,70,40,0.7)" },

  { id:26, name:"Northern Lights",     tag:"אורות",
    cardBg:"linear-gradient(145deg,rgba(2,8,20,0.95),rgba(1,5,12,0.99),rgba(3,7,18,0.92))",
    border:["#022c22","#065f46","#0d9488","#34d399","#67e8f9","#a78bfa","#67e8f9","#34d399","#022c22"],
    accent:"#67e8f9", accentGlow:"rgba(103,232,249,0.9)", accentDim:"rgba(13,148,136,0.1)", textMuted:"rgba(60,140,160,0.7)" },

  { id:27, name:"Amethyst Crystal",    tag:"אמטיסט",
    cardBg:"linear-gradient(145deg,rgba(18,5,30,0.94),rgba(10,2,18,0.98),rgba(16,4,28,0.9))",
    border:["#1e1b4b","#4c1d95","#7c3aed","#c084fc","#f5d0fe","#ffffff","#f5d0fe","#c084fc","#4c1d95"],
    accent:"#e879f9", accentGlow:"rgba(232,121,249,0.9)", accentDim:"rgba(192,132,252,0.1)", textMuted:"rgba(150,80,180,0.7)" },

  { id:28, name:"Copper Bronze",       tag:"נחושת",
    cardBg:"linear-gradient(145deg,rgba(22,10,3,0.94),rgba(14,6,2,0.98),rgba(20,9,3,0.9))",
    border:["#431407","#9a3412","#b87333","#cd853f","#fbbf24","#fef3c7","#fbbf24","#cd853f","#9a3412"],
    accent:"#f59e0b", accentGlow:"rgba(245,158,11,0.9)", accentDim:"rgba(180,115,51,0.1)", textMuted:"rgba(160,100,50,0.7)" },

  { id:29, name:"Peacock",             tag:"טווס",
    cardBg:"linear-gradient(145deg,rgba(2,15,20,0.94),rgba(1,8,12,0.98),rgba(2,14,18,0.9))",
    border:["#042f2e","#0e7490","#0891b2","#22d3ee","#67e8f9","#a78bfa","#67e8f9","#0891b2","#042f2e"],
    accent:"#22d3ee", accentGlow:"rgba(34,211,238,0.9)", accentDim:"rgba(8,145,178,0.1)", textMuted:"rgba(50,140,160,0.7)" },

  { id:30, name:"Neon Pink + Blue",    tag:"ניאון",
    cardBg:"linear-gradient(145deg,rgba(8,0,15,0.97),rgba(5,0,10,0.99),rgba(7,0,14,0.95))",
    border:["#0d001a","#db2777","#f472b6","#ffffff","#38bdf8","#0ea5e9","#38bdf8","#f472b6","#0d001a"],
    accent:"#f472b6", accentGlow:"rgba(244,114,182,0.9)", accentDim:"rgba(219,39,119,0.1)", textMuted:"rgba(200,100,180,0.7)" },

  { id:31, name:"Dark Steel",          tag:"פלדה",
    cardBg:"linear-gradient(145deg,rgba(10,14,18,0.96),rgba(6,8,11,0.99),rgba(9,12,16,0.93))",
    border:["#0f172a","#334155","#64748b","#94a3b8","#e2e8f0","#ffffff","#e2e8f0","#64748b","#334155"],
    accent:"#94a3b8", accentGlow:"rgba(148,163,184,0.85)", accentDim:"rgba(100,116,139,0.1)", textMuted:"rgba(80,100,120,0.7)" },

  { id:32, name:"Sapphire + White",    tag:"ספיר",
    cardBg:"linear-gradient(145deg,rgba(8,12,45,0.94),rgba(4,6,28,0.98),rgba(7,10,40,0.9))",
    border:["#172554","#1e40af","#2563eb","#60a5fa","#bfdbfe","#ffffff","#bfdbfe","#60a5fa","#1e40af"],
    accent:"#93c5fd", accentGlow:"rgba(147,197,253,0.9)", accentDim:"rgba(37,99,235,0.1)", textMuted:"rgba(80,120,190,0.7)" },

  { id:33, name:"Olive + Gold",        tag:"זית",
    cardBg:"linear-gradient(145deg,rgba(15,18,5,0.94),rgba(8,10,2,0.98),rgba(13,16,4,0.9))",
    border:["#1a2e05","#4d7c0f","#84cc16","#d9f99d","#fef9c3","#fbbf24","#fef9c3","#d9f99d","#84cc16"],
    accent:"#bef264", accentGlow:"rgba(190,242,100,0.9)", accentDim:"rgba(132,204,22,0.1)", textMuted:"rgba(100,140,40,0.7)" },

  { id:34, name:"Indigo + Lavender",   tag:"לבנדר",
    cardBg:"linear-gradient(145deg,rgba(15,8,35,0.93),rgba(8,4,20,0.98),rgba(13,7,30,0.9))",
    border:["#1e1b4b","#4338ca","#6366f1","#a5b4fc","#e0e7ff","#ffffff","#e0e7ff","#a5b4fc","#6366f1"],
    accent:"#a5b4fc", accentGlow:"rgba(165,180,252,0.9)", accentDim:"rgba(99,102,241,0.1)", textMuted:"rgba(120,110,190,0.7)" },

  { id:35, name:"Midnight Blue + Silver", tag:"לילה",
    cardBg:"linear-gradient(145deg,rgba(5,8,25,0.96),rgba(2,4,16,0.99),rgba(4,7,22,0.93))",
    border:["#020617","#1e3a8a","#3b82f6","#93c5fd","#cbd5e1","#ffffff","#cbd5e1","#93c5fd","#1e3a8a"],
    accent:"#93c5fd", accentGlow:"rgba(147,197,253,0.9)", accentDim:"rgba(30,58,138,0.1)", textMuted:"rgba(80,110,160,0.7)" },

  { id:36, name:"Warm Slate + Coral",  tag:"קורל",
    cardBg:"linear-gradient(145deg,rgba(22,10,8,0.93),rgba(14,6,5,0.98),rgba(20,9,7,0.9))",
    border:["#431407","#b91c1c","#f97316","#fca5a5","#fed7aa","#fca5a5","#f97316","#b91c1c","#431407"],
    accent:"#fca5a5", accentGlow:"rgba(252,165,165,0.9)", accentDim:"rgba(249,115,22,0.1)", textMuted:"rgba(180,100,80,0.7)" },

  { id:37, name:"Deep Teal + Gold",    tag:"טיל+זהב",
    cardBg:"linear-gradient(145deg,rgba(2,18,16,0.94),rgba(1,10,9,0.98),rgba(2,16,14,0.9))",
    border:["#042f2e","#0f766e","#14b8a6","#2dd4bf","#fbbf24","#fde68a","#fbbf24","#2dd4bf","#042f2e"],
    accent:"#fbbf24", accentGlow:"rgba(251,191,36,0.9)", accentDim:"rgba(20,184,166,0.1)", textMuted:"rgba(70,160,140,0.7)" },

  { id:38, name:"Plasma Purple",       tag:"פלזמה",
    cardBg:"linear-gradient(145deg,rgba(10,2,20,0.97),rgba(6,1,12,0.99),rgba(9,2,18,0.95))",
    border:["#000000","#2e1065","#5b21b6","#7c3aed","#c084fc","#e879f9","#c084fc","#5b21b6","#000000"],
    accent:"#c084fc", accentGlow:"rgba(192,132,252,0.95)", accentDim:"rgba(124,58,237,0.1)", textMuted:"rgba(160,90,200,0.7)" },

  { id:39, name:"Blue + Rose Gold",    tag:"כחול+רוז",
    cardBg:"linear-gradient(145deg,rgba(15,20,40,0.93),rgba(8,12,28,0.98),rgba(13,18,38,0.9))",
    border:["#1e3a8a","#3b82f6","#93c5fd","#fda4af","#fce7f3","#fda4af","#93c5fd","#3b82f6","#1e3a8a"],
    accent:"#fda4af", accentGlow:"rgba(253,164,175,0.9)", accentDim:"rgba(59,130,246,0.1)", textMuted:"rgba(140,130,180,0.7)" },

  { id:40, name:"Pure Black + Neon",   tag:"שחור+ניאון",
    cardBg:"linear-gradient(145deg,rgba(3,3,3,0.99),rgba(0,0,0,1),rgba(2,2,2,0.99))",
    border:["#000000","#0d9488","#14b8a6","#5eead4","#ffffff","#5eead4","#14b8a6","#0d9488","#000000"],
    accent:"#5eead4", accentGlow:"rgba(94,234,212,0.95)", accentDim:"rgba(20,184,166,0.1)", textMuted:"rgba(60,160,140,0.7)" },
];

export default function AdminColorSchemes() {
  const [selected, setSelected] = useState(null);
  const sel = SCHEMES.find(s => s.id === selected);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🎨 שילובי צבעים — 40 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">כל כרטיס מראה את שילוב הצבעים המלא — רקע, מסגרת, ואקצנטים. לחץ לבחירה.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {SCHEMES.map(s => (
          <motion.div key={s.id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected===s.id?"border-white/50 ring-2 ring-white/20":"border-slate-800 hover:border-slate-600"}`}
            style={{ background:"#060810" }}
            whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
            onClick={() => setSelected(s.id===selected?null:s.id)}>
            <div className="p-2" style={{ background:"#060810" }}>
              <MatchCard scheme={s} />
            </div>
            <div className="px-2.5 py-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[9px] text-slate-600 font-mono flex-shrink-0">#{s.id}</span>
                <span className="text-[10px] font-semibold text-white truncate">{s.name}</span>
              </div>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background:`${s.accent}18`, color:s.accent, border:`1px solid ${s.accent}35` }}>
                {s.tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {sel && (
          <motion.div key={selected}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }}
            className="mt-5 rounded-2xl border border-white/15 p-5 flex gap-6 items-center flex-wrap"
            style={{ background:"rgba(6,8,16,0.98)", boxShadow:"0 0 40px rgba(0,0,0,0.5)" }}>
            <div className="w-52 flex-shrink-0 rounded-xl overflow-hidden p-2" style={{ background:"#060810" }}>
              <MatchCard scheme={sel} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-bold text-white text-lg">#{sel.id} — {sel.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background:`${sel.accent}18`, color:sel.accent }}>{sel.tag}</span>
              </div>
              <div className="flex gap-2 flex-wrap mb-3">
                <div className="text-xs text-slate-400">צבע אקצנט:</div>
                <div className="w-5 h-5 rounded-full border border-white/10" style={{ background:sel.accent }} />
                <code className="text-xs text-slate-400">{sel.accent}</code>
              </div>
              <button onClick={() => setSelected(null)} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
