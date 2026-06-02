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

  // ── 50 new options ───────────────────────────────────────────────────────────
  { id:31, name:"Deep Space",        tag:"חלל",         tagC:"#818cf8", speed:7,
    stops:["#020617","#0f172a","#1e1b4b","#4c1d95","#7c3aed","#4c1d95","#1e1b4b","#020617"] },
  { id:32, name:"Lava Lamp",         tag:"לבה",         tagC:"#fb7185", speed:5,
    stops:["#1c0010","#9f1239","#e11d48","#fb7185","#fdba74","#fb7185","#e11d48","#9f1239"] },
  { id:33, name:"Northern Lights",   tag:"אורות צפון",  tagC:"#34d399", speed:6,
    stops:["#022c22","#065f46","#34d399","#67e8f9","#a78bfa","#67e8f9","#34d399","#022c22"] },
  { id:34, name:"Champagne",         tag:"שמפניה",      tagC:"#fef3c7", speed:9,
    stops:["#78350f","#b45309","#d97706","#fde68a","#fef9c3","#fde68a","#d97706","#b45309"] },
  { id:35, name:"Matrix",            tag:"מטריקס",      tagC:"#86efac", speed:4,
    stops:["#000000","#052e16","#14532d","#16a34a","#4ade80","#16a34a","#052e16","#000000"] },
  { id:36, name:"Cyberpunk",         tag:"סייבר",       tagC:"#f0abfc", speed:3,
    stops:["#0d0010","#86198f","#c026d3","#f0abfc","#00fff0","#f0abfc","#c026d3","#86198f"] },
  { id:37, name:"Jade",              tag:"ג׳ייד",       tagC:"#6ee7b7", speed:7,
    stops:["#022c22","#047857","#059669","#6ee7b7","#a7f3d0","#6ee7b7","#059669","#022c22"] },
  { id:38, name:"Blood Orange",      tag:"תפוז דם",     tagC:"#fb923c", speed:5,
    stops:["#1c0700","#9a3412","#c2410c","#ea580c","#fb923c","#fcd34d","#fb923c","#c2410c"] },
  { id:39, name:"Cherry Blossom",    tag:"דובדבן",      tagC:"#fbcfe8", speed:8,
    stops:["#500724","#9d174d","#db2777","#f472b6","#fbcfe8","#fdf2f8","#fbcfe8","#f472b6"] },
  { id:40, name:"Steel",             tag:"פלדה",        tagC:"#94a3b8", speed:8,
    stops:["#0f172a","#334155","#64748b","#94a3b8","#e2e8f0","#94a3b8","#64748b","#334155"] },
  { id:41, name:"Autumn",            tag:"סתיו",        tagC:"#fb923c", speed:6,
    stops:["#431407","#9a3412","#b45309","#d97706","#f59e0b","#84cc16","#d97706","#9a3412"] },
  { id:42, name:"Caribbean",         tag:"קריביים",     tagC:"#22d3ee", speed:5,
    stops:["#042f2e","#115e59","#0d9488","#2dd4bf","#67e8f9","#bae6fd","#2dd4bf","#0d9488"] },
  { id:43, name:"Dark Matter",       tag:"חומר כהה",   tagC:"#6366f1", speed:12,
    stops:["#000000","#0f0a1e","#1e1b4b","#312e81","#4338ca","#312e81","#1e1b4b","#000000"] },
  { id:44, name:"Poison",            tag:"ארס",         tagC:"#a3e635", speed:4,
    stops:["#1a2e05","#365314","#4d7c0f","#84cc16","#d9f99d","#bef264","#84cc16","#4d7c0f"] },
  { id:45, name:"Ruby",              tag:"רובי",        tagC:"#fca5a5", speed:5,
    stops:["#300000","#7f1d1d","#991b1b","#b91c1c","#ef4444","#fca5a5","#ef4444","#991b1b"] },
  { id:46, name:"Pearl",             tag:"פנינה",       tagC:"#f1f5f9", speed:9,
    stops:["#a8a29e","#d6d3d1","#e7e5e4","#f5f5f4","#ffffff","#fafaf9","#e7e5e4","#d6d3d1"] },
  { id:47, name:"Titanium",          tag:"טיטניום",     tagC:"#94a3b8", speed:7,
    stops:["#0f172a","#1e293b","#475569","#94a3b8","#cbd5e1","#94a3b8","#475569","#1e293b"] },
  { id:48, name:"Prism",             tag:"פריזמה",      tagC:"#e0f2fe", speed:3,
    stops:["#fef08a","#86efac","#67e8f9","#a5b4fc","#f0abfc","#fda4af","#fef08a"] },
  { id:49, name:"Watercolor",        tag:"אקוורל",      tagC:"#bae6fd", speed:8,
    stops:["rgba(186,230,253,0.3)","rgba(186,230,253,0.7)","rgba(255,255,255,0.9)","rgba(196,181,253,0.7)","rgba(186,230,253,0.3)"] },
  { id:50, name:"Volcano",           tag:"וולקנו",      tagC:"#fbbf24", speed:4,
    stops:["#0c0000","#450a0a","#7f1d1d","#b91c1c","#f97316","#fbbf24","#f97316","#b91c1c"] },
  { id:51, name:"Bioluminescent",    tag:"ביולומי",     tagC:"#34d399", speed:4,
    stops:["#001a1a","#042f2e","#0d9488","#34d399","#a7f3d0","#00fff0","#34d399","#0d9488"] },
  { id:52, name:"Candy",             tag:"ממתק",        tagC:"#f9a8d4", speed:5,
    stops:["#fce7f3","#fbcfe8","#f9a8d4","#f472b6","#a78bfa","#67e8f9","#86efac","#fce7f3"] },
  { id:53, name:"Cosmic Ray",        tag:"קוסמי",       tagC:"#e0e7ff", speed:5,
    stops:["#0c0a1e","#1e1b4b","#4338ca","#818cf8","#e0e7ff","#ffffff","#e0e7ff","#818cf8"] },
  { id:54, name:"Solar Flare",       tag:"שמש",         tagC:"#fef08a", speed:4,
    stops:["#000000","#1c0a00","#713f12","#ca8a04","#facc15","#fef08a","#ffffff","#fef08a"] },
  { id:55, name:"Midnight Silver",   tag:"כסף לילה",   tagC:"#e2e8f0", speed:7,
    stops:["#020617","#1e293b","#334155","#94a3b8","#e2e8f0","#94a3b8","#334155","#020617"] },
  { id:56, name:"Seaglass",          tag:"זכוכית ים",  tagC:"#5eead4", speed:8,
    stops:["#042f2e","#0f766e","#14b8a6","#5eead4","#ccfbf1","#5eead4","#14b8a6","#0f766e"] },
  { id:57, name:"Storm",             tag:"סערה",        tagC:"#94a3b8", speed:6,
    stops:["#0f172a","#1e3a5f","#1d4ed8","#60a5fa","#e2e8f0","#60a5fa","#1d4ed8","#0f172a"] },
  { id:58, name:"Golden Hour",       tag:"שעת זהב",    tagC:"#fde68a", speed:6,
    stops:["#1c0a00","#7c2d12","#c2410c","#ea580c","#f59e0b","#fde68a","#fff7ed","#fde68a"] },
  { id:59, name:"Plasma",            tag:"פלזמה",       tagC:"#c084fc", speed:4,
    stops:["#000000","#2e1065","#5b21b6","#7c3aed","#c084fc","#e879f9","#c084fc","#5b21b6"] },
  { id:60, name:"Desert Rose",       tag:"שושנת מדבר", tagC:"#fda4af", speed:7,
    stops:["#1c0007","#881337","#be185d","#f472b6","#fda4af","#fef3c7","#fda4af","#f472b6"] },
  { id:61, name:"Neon Orange",       tag:"ניאון כתום",  tagC:"#fb923c", speed:3,
    stops:["#1c0700","#c2410c","#ea580c","#fb923c","#fed7aa","#fb923c","#ea580c","#c2410c"] },
  { id:62, name:"Deep Wine",         tag:"יין",         tagC:"#fca5a5", speed:8,
    stops:["#1a0008","#4c0519","#881337","#9f1239","#e11d48","#fca5a5","#e11d48","#881337"] },
  { id:63, name:"Turquoise Sea",     tag:"טורקיז",      tagC:"#5eead4", speed:5,
    stops:["#003333","#0d9488","#14b8a6","#5eead4","#99f6e4","#ffffff","#5eead4","#0d9488"] },
  { id:64, name:"Spring Fresh",      tag:"אביב",        tagC:"#86efac", speed:6,
    stops:["#052e16","#166534","#16a34a","#4ade80","#86efac","#d9f99d","#86efac","#4ade80"] },
  { id:65, name:"Deep Abyss",        tag:"תהום",        tagC:"#38bdf8", speed:9,
    stops:["#000000","#001233","#023e8a","#0077b6","#0096c7","#00b4d8","#0096c7","#0077b6"] },
  { id:66, name:"Red + Gold",        tag:"אדום+זהב",    tagC:"#fbbf24", speed:5,
    stops:["#7f1d1d","#991b1b","#dc2626","#fbbf24","#fef3c7","#fbbf24","#dc2626","#991b1b"] },
  { id:67, name:"Peacock",           tag:"טווס",        tagC:"#2dd4bf", speed:5,
    stops:["#042f2e","#0e7490","#0891b2","#22d3ee","#67e8f9","#a78bfa","#67e8f9","#0891b2"] },
  { id:68, name:"Neon Pink + Blue",  tag:"ניאון מיקס",  tagC:"#f472b6", speed:3,
    stops:["#0d001a","#db2777","#f472b6","#ffffff","#38bdf8","#0ea5e9","#38bdf8","#f472b6"] },
  { id:69, name:"Sakura",            tag:"סקורה",       tagC:"#fce7f3", speed:8,
    stops:["#4a0020","#9d174d","#db2777","#f9a8d4","#fce7f3","#ffffff","#fce7f3","#f9a8d4"] },
  { id:70, name:"Radioactive",       tag:"רדיואקטיבי",  tagC:"#bef264", speed:3,
    stops:["#000000","#1a2e05","#365314","#65a30d","#bef264","#ecfccb","#bef264","#65a30d"] },
  { id:71, name:"Glacier",           tag:"קרחון",       tagC:"#e0f2fe", speed:8,
    stops:["#0c4a6e","#0ea5e9","#38bdf8","#bae6fd","#e0f2fe","#ffffff","#e0f2fe","#bae6fd"] },
  { id:72, name:"Wildfire",          tag:"שריפה",       tagC:"#fbbf24", speed:4,
    stops:["#000000","#7f1d1d","#b91c1c","#ea580c","#f97316","#fbbf24","#f97316","#ea580c"] },
  { id:73, name:"Orchid",            tag:"אורכידה",     tagC:"#e879f9", speed:6,
    stops:["#2e1065","#6b21a8","#a21caf","#c026d3","#e879f9","#f5d0fe","#e879f9","#c026d3"] },
  { id:74, name:"Arctic White",      tag:"ארקטי",       tagC:"#bae6fd", speed:9,
    stops:["#0c4a6e","#075985","#0369a1","#7dd3fc","#bae6fd","#ffffff","#bae6fd","#7dd3fc"] },
  { id:75, name:"Copper + Green",    tag:"נחושת+ירוק",  tagC:"#4ade80", speed:5,
    stops:["#431407","#b45309","#ca8a04","#4ade80","#86efac","#4ade80","#ca8a04","#b45309"] },
  { id:76, name:"Twilight",          tag:"דמדומים",     tagC:"#c084fc", speed:6,
    stops:["#0f0c29","#1e1b4b","#4c1d95","#7c3aed","#c084fc","#f472b6","#fda4af","#c084fc"] },
  { id:77, name:"Solar System",      tag:"מערכת שמש",   tagC:"#fbbf24", speed:5,
    stops:["#000000","#1e3a5f","#1d4ed8","#fbbf24","#ef4444","#fbbf24","#1d4ed8","#000000"] },
  { id:78, name:"Jade + Gold",       tag:"ג׳ייד+זהב",   tagC:"#fde68a", speed:6,
    stops:["#022c22","#065f46","#059669","#6ee7b7","#fde68a","#fbbf24","#fde68a","#6ee7b7"] },
  { id:79, name:"Nebula",            tag:"ערפילית",     tagC:"#f0abfc", speed:5,
    stops:["#000000","#1e1b4b","#5b21b6","#db2777","#f0abfc","#67e8f9","#f0abfc","#5b21b6"] },
  { id:80, name:"Platinum",          tag:"פלטינום",     tagC:"#f8fafc", speed:10,
    stops:["#1e293b","#475569","#94a3b8","#cbd5e1","#f8fafc","#ffffff","#f8fafc","#cbd5e1"] },
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
