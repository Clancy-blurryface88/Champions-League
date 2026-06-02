import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CARD_BG = {
  background: 'linear-gradient(145deg, rgba(30,58,138,0.45) 0%, rgba(8,15,45,0.92) 45%, rgba(15,25,70,0.5) 100%)',
  backdropFilter: 'blur(24px)',
};

function CardInner() {
  return (
    <div className="p-3 flex flex-col gap-2">
      <div className="flex justify-center">
        <div className="rounded-xl px-3 py-1 flex gap-2" style={{ background:"rgba(26,54,45,0.8)", border:"1px solid rgba(74,222,128,0.2)" }}>
          {[["9","ימים"],["8","שעות"],["15","דקות"]].map(([n,l])=>(
            <div key={l} className="flex flex-col items-center">
              <span className="text-xs font-bold text-emerald-400 leading-none">{n}</span>
              <span className="text-[7px] text-emerald-700">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <span className="text-[9px] text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-0.5 rounded-full">Group A</span>
      </div>
      <div className="border-t border-white/8" />
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col items-center gap-0.5 flex-1">
          <span className="fi fi-kr fis rounded-md" style={{ width:28,height:28,fontSize:28,display:"inline-block",backgroundSize:"cover" }} />
          <span className="text-[8px] text-white font-semibold">Korea</span>
        </div>
        <div className="flex items-center gap-1">
          {[2,1].map((v,i)=>(
            <div key={i} className="w-6 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
              style={{ background:"rgba(15,20,40,0.75)", border:"1.5px solid rgba(255,255,255,0.13)" }}>{v}</div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-0.5 flex-1">
          <span className="fi fi-cz fis rounded-md" style={{ width:28,height:28,fontSize:28,display:"inline-block",backgroundSize:"cover" }} />
          <span className="text-[8px] text-white font-semibold">Czechia</span>
        </div>
      </div>
      <div className="text-center text-[7px] text-slate-500">📅 12/06/2026 · Guadalajara</div>
    </div>
  );
}

// Rotating conic border using a spinning inner div
function ConicCard({ stops, speed = 5 }) {
  return (
    <div className="relative rounded-[18px] overflow-hidden" style={{ padding:"1.5px" }}>
      {/* Spinning gradient */}
      <motion.div className="absolute pointer-events-none"
        style={{ width:"200%", height:"200%", top:"-50%", left:"-50%",
          background:`conic-gradient(from 0deg, ${stops.join(",")})` }}
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }} />
      {/* Card content */}
      <div className="relative rounded-2xl overflow-hidden" style={CARD_BG}>
        <CardInner />
      </div>
    </div>
  );
}

// ── 30 gradient definitions ────────────────────────────────────────────────────
const DESIGNS = [
  { id:1,  name:"Blue (נוכחי)",      tag:"נוכחי",      tagC:"#60a5fa", speed:5,
    stops:["#1e3a8a","#3b82f6","#93c5fd","#ffffff","#93c5fd","#3b82f6","#1e3a8a"] },
  { id:2,  name:"Gold",              tag:"זהב",         tagC:"#fbbf24", speed:5,
    stops:["#78350f","#d97706","#fbbf24","#fef3c7","#fbbf24","#d97706","#78350f"] },
  { id:3,  name:"Emerald Green",     tag:"ירוק",        tagC:"#4ade80", speed:5,
    stops:["#14532d","#16a34a","#4ade80","#dcfce7","#4ade80","#16a34a","#14532d"] },
  { id:4,  name:"Purple",            tag:"סגול",        tagC:"#c084fc", speed:5,
    stops:["#4c1d95","#7c3aed","#c084fc","#f5f3ff","#c084fc","#7c3aed","#4c1d95"] },
  { id:5,  name:"Crimson Red",       tag:"אדום",        tagC:"#f87171", speed:5,
    stops:["#7f1d1d","#dc2626","#f87171","#fee2e2","#f87171","#dc2626","#7f1d1d"] },
  { id:6,  name:"Rose Gold",         tag:"רוז גולד",    tagC:"#fda4af", speed:6,
    stops:["#881337","#e11d48","#fda4af","#fff1f2","#fda4af","#e11d48","#881337"] },
  { id:7,  name:"Rainbow",           tag:"קשת",         tagC:"#f9a8d4", speed:4,
    stops:["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#ef4444"] },
  { id:8,  name:"Cyan / Teal",       tag:"ציאן",        tagC:"#22d3ee", speed:5,
    stops:["#164e63","#0e7490","#22d3ee","#e0f2fe","#22d3ee","#0e7490","#164e63"] },
  { id:9,  name:"Silver Chrome",     tag:"כסף",         tagC:"#cbd5e1", speed:6,
    stops:["#475569","#94a3b8","#e2e8f0","#ffffff","#e2e8f0","#94a3b8","#475569"] },
  { id:10, name:"Amber / Orange",    tag:"כתום",        tagC:"#fb923c", speed:5,
    stops:["#7c2d12","#ea580c","#fb923c","#ffedd5","#fb923c","#ea580c","#7c2d12"] },
  { id:11, name:"Pure White Glow",   tag:"לבן",         tagC:"#f8fafc", speed:7,
    stops:["rgba(255,255,255,0.1)","rgba(255,255,255,0.6)","rgba(255,255,255,0.95)","rgba(255,255,255,0.6)","rgba(255,255,255,0.1)"] },
  { id:12, name:"Neon Lime",         tag:"ניאון",        tagC:"#a3e635", speed:3,
    stops:["#1a2e05","#4d7c0f","#a3e635","#ecfccb","#a3e635","#4d7c0f","#1a2e05"] },
  { id:13, name:"Holographic Fast",  tag:"הולו",        tagC:"#e879f9", speed:2,
    stops:["#3b82f6","#8b5cf6","#ec4899","#ef4444","#f97316","#eab308","#22c55e","#3b82f6"] },
  { id:14, name:"Copper / Bronze",   tag:"נחושת",       tagC:"#f59e0b", speed:6,
    stops:["#431407","#9a3412","#c2410c","#fb923c","#fbbf24","#c2410c","#431407"] },
  { id:15, name:"Ice Arctic",        tag:"קרח",         tagC:"#bae6fd", speed:7,
    stops:["#0c4a6e","#0ea5e9","#7dd3fc","#e0f2fe","#ffffff","#e0f2fe","#7dd3fc","#0ea5e9"] },
  { id:16, name:"Sunset",            tag:"שקיעה",       tagC:"#fdba74", speed:5,
    stops:["#7c1d6f","#db2777","#f97316","#fbbf24","#f97316","#db2777","#7c1d6f"] },
  { id:17, name:"Ocean",             tag:"ים",          tagC:"#38bdf8", speed:6,
    stops:["#0c4a6e","#0369a1","#0ea5e9","#38bdf8","#67e8f9","#a5f3fc","#38bdf8","#0ea5e9"] },
  { id:18, name:"Fire",              tag:"אש",          tagC:"#f97316", speed:4,
    stops:["#1c0a00","#7f1d1d","#dc2626","#ea580c","#f97316","#fbbf24","#f97316","#dc2626"] },
  { id:19, name:"Forest",            tag:"יער",         tagC:"#86efac", speed:6,
    stops:["#052e16","#166534","#15803d","#4ade80","#86efac","#4ade80","#15803d","#052e16"] },
  { id:20, name:"Galaxy",            tag:"גלקסיה",      tagC:"#a78bfa", speed:6,
    stops:["#0f0c29","#302b63","#6d28d9","#a78bfa","#ec4899","#a78bfa","#6d28d9","#0f0c29"] },
  { id:21, name:"Mint",              tag:"מנטה",        tagC:"#6ee7b7", speed:7,
    stops:["#022c22","#065f46","#059669","#6ee7b7","#d1fae5","#6ee7b7","#059669","#022c22"] },
  { id:22, name:"Coral",             tag:"קורל",        tagC:"#fca5a5", speed:6,
    stops:["#7f1d1d","#b91c1c","#ef4444","#fca5a5","#fed7aa","#fca5a5","#ef4444","#b91c1c"] },
  { id:23, name:"Electric Blue",     tag:"חשמל",        tagC:"#38bdf8", speed:3,
    stops:["#001233","#0353a4","#0077b6","#00b4d8","#90e0ef","#00b4d8","#0077b6","#001233"] },
  { id:24, name:"Dark Luxury Gold",  tag:"יוקרה",       tagC:"#fde68a", speed:8,
    stops:["#000000","#78350f","#b45309","#fbbf24","#fef3c7","#fbbf24","#b45309","#000000"] },
  { id:25, name:"Hot Pink",          tag:"ורוד",        tagC:"#f472b6", speed:4,
    stops:["#500724","#9d174d","#db2777","#f472b6","#fbcfe8","#f472b6","#db2777","#9d174d"] },
  { id:26, name:"Deep Teal",         tag:"ירקרק",       tagC:"#2dd4bf", speed:6,
    stops:["#042f2e","#0f766e","#0d9488","#2dd4bf","#99f6e4","#2dd4bf","#0d9488","#042f2e"] },
  { id:27, name:"Warm Cream",        tag:"קרם",         tagC:"#fde68a", speed:8,
    stops:["rgba(180,120,60,0.4)","rgba(253,230,138,0.7)","rgba(255,255,255,0.9)","rgba(253,230,138,0.7)","rgba(180,120,60,0.4)"] },
  { id:28, name:"Blue + Gold Mix",   tag:"פרימיום",     tagC:"#fbbf24", speed:5,
    stops:["#1e3a8a","#3b82f6","#fbbf24","#ffffff","#fbbf24","#3b82f6","#1e3a8a"] },
  { id:29, name:"Indigo Violet",     tag:"אינדיגו",     tagC:"#818cf8", speed:5,
    stops:["#1e1b4b","#3730a3","#6366f1","#818cf8","#e0e7ff","#818cf8","#6366f1","#1e1b4b"] },
  { id:30, name:"Monochrome White",  tag:"לבן מט",      tagC:"#e2e8f0", speed:10,
    stops:["rgba(255,255,255,0.05)","rgba(255,255,255,0.3)","rgba(255,255,255,0.08)","rgba(255,255,255,0.3)","rgba(255,255,255,0.05)"] },
];

export default function AdminConicDemo() {
  const [selected, setSelected] = useState(null);
  const sel = DESIGNS.find(d => d.id === selected);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🎨 גרדיאנט מסתובב — 30 צבעים</h2>
        <p className="text-slate-400 mt-1 text-sm">כל כרטיס מראה את האפקט חי. לחץ לפרטים ולבחירה.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {DESIGNS.map(d => (
          <motion.div key={d.id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected===d.id?"border-indigo-500 ring-2 ring-indigo-500/30":"border-slate-800 hover:border-slate-600"}`}
            style={{ background:"#080c1a" }}
            whileHover={{ y:-2 }} whileTap={{ scale:0.98 }}
            onClick={() => setSelected(d.id === selected ? null : d.id)}>
            <div className="p-2" style={{ background:"linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
              <ConicCard stops={d.stops} speed={d.speed} />
            </div>
            <div className="px-2.5 py-2 border-t border-slate-800 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[9px] text-slate-600 font-mono flex-shrink-0">#{d.id}</span>
                <span className="text-[10px] font-semibold text-white truncate">{d.name}</span>
              </div>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background:`${d.tagC}18`, color:d.tagC, border:`1px solid ${d.tagC}35` }}>
                {d.tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {sel && (
          <motion.div key={selected}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }}
            className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-6 items-center flex-wrap"
            style={{ background:"rgba(8,12,26,0.98)", boxShadow:"0 0 30px rgba(99,102,241,0.1)" }}>
            <div className="w-44 flex-shrink-0 rounded-xl p-2" style={{ background:"linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
              <ConicCard stops={sel.stops} speed={sel.speed} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-bold text-white text-lg">#{sel.id} — {sel.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background:`${sel.tagC}18`, color:sel.tagC }}>{sel.tag}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {sel.stops.map((s,i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-white/10 flex-shrink-0"
                    style={{ background: s.startsWith("rgba") || s.startsWith("#") ? s : "#fff" }} />
                ))}
              </div>
              <p className="text-slate-500 text-xs">מהירות סיבוב: {sel.speed}s מחזור</p>
              <button onClick={() => setSelected(null)} className="mt-3 text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
