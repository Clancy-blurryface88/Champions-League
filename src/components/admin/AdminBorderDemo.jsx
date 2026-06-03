import React, { useState } from "react";
import { motion } from "framer-motion";

// ── Mini card inner content ───────────────────────────────────────────────────
function CardInner() {
  return (
    <div className="rounded-2xl overflow-hidden w-full" style={{ background: "linear-gradient(145deg,rgba(30,58,138,0.45),rgba(8,15,45,0.92),rgba(15,25,70,0.5))", backdropFilter: "blur(20px)" }}>
      <div className="flex flex-col items-center gap-2 py-4 px-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-700/60 border border-white/10" />
          <div className="flex items-center gap-1">
            <div className="w-7 h-11 rounded-lg flex items-center justify-center font-bold text-base text-white" style={{ background: "rgba(15,20,40,0.8)", border: "1.5px solid rgba(255,255,255,0.13)" }}>2</div>
            <span className="text-white/30 text-sm px-0.5">-</span>
            <div className="w-7 h-11 rounded-lg flex items-center justify-center font-bold text-base text-white" style={{ background: "rgba(15,20,40,0.8)", border: "1.5px solid rgba(255,255,255,0.13)" }}>0</div>
          </div>
          <div className="w-8 h-8 rounded-md bg-slate-700/60 border border-white/10" />
        </div>
        <div className="flex gap-0 w-full overflow-hidden rounded-b-xl mt-1" style={{ borderTop: "1px solid rgba(255,200,50,0.2)" }}>
          <div className="flex-1 text-center py-1.5 text-[9px] font-bold" style={{ color: "rgba(255,200,50,0.8)" }}>1 X 2</div>
          <div className="w-px my-1" style={{ background: "rgba(255,200,50,0.3)" }} />
          <div className="flex-1 text-center py-1.5 text-[9px] font-bold" style={{ color: "rgba(255,200,50,0.8)" }}>ניחושים</div>
        </div>
      </div>
    </div>
  );
}

// ── Border wrapper ────────────────────────────────────────────────────────────
function BorderWrapper({ b }) {
  const inner = <CardInner />;

  if (b.type === "conic") {
    return (
      <div className="relative rounded-[18px] overflow-hidden" style={{ padding: "2px" }}>
        <motion.div className="absolute pointer-events-none"
          style={{ width: "200%", height: "200%", top: "-50%", left: "-50%",
            background: `conic-gradient(from 0deg, ${b.colors.join(",")})` }}
          animate={{ rotate: 360 }}
          transition={{ duration: b.duration, repeat: Infinity, ease: "linear" }} />
        <div className="relative rounded-2xl overflow-hidden">{inner}</div>
      </div>
    );
  }

  if (b.type === "linear") {
    return (
      <div className="relative rounded-[18px] overflow-hidden" style={{ padding: "2px", background: b.gradient }}>
        <div className="relative rounded-2xl overflow-hidden">{inner}</div>
      </div>
    );
  }

  if (b.type === "solid") {
    return (
      <div className="relative rounded-[18px] overflow-hidden" style={{ padding: "2px", background: b.color }}>
        <div className="relative rounded-2xl overflow-hidden">{inner}</div>
      </div>
    );
  }

  if (b.type === "glow") {
    return (
      <div className="relative rounded-[18px] overflow-hidden" style={{ boxShadow: b.shadow, border: `1px solid ${b.borderColor || "rgba(255,255,255,0.08)"}` }}>
        {inner}
      </div>
    );
  }

  if (b.type === "pulse") {
    return (
      <motion.div className="relative rounded-[18px] overflow-hidden"
        animate={{ boxShadow: [b.shadowLow, b.shadowHigh, b.shadowLow] }}
        transition={{ duration: b.speed || 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ border: `1px solid ${b.borderColor}` }}>
        {inner}
      </motion.div>
    );
  }

  if (b.type === "dash") {
    return (
      <div className="relative rounded-[18px] overflow-hidden" style={{ border: `2px dashed ${b.color}`, borderRadius: 18 }}>
        {inner}
      </div>
    );
  }

  if (b.type === "double") {
    return (
      <div className="relative rounded-[18px] overflow-hidden" style={{ padding: "2px", background: b.outer }}>
        <div className="relative rounded-2xl overflow-hidden" style={{ padding: "2px", background: b.inner }}>
          <div className="relative rounded-xl overflow-hidden">{inner}</div>
        </div>
      </div>
    );
  }

  return <div className="relative rounded-[18px] overflow-hidden">{inner}</div>;
}

// ── 50 border definitions ─────────────────────────────────────────────────────
const BORDERS = [
  // ── ROTATING CONIC (1–15) ────────────────────────────────────────────────────
  { id: 1,  type:"conic", duration:3,  name:"Green + Cyan",      tag:"נוכחי",
    colors:["#022c22","#065f46","#059669","#6ee7b7","#67e8f9","#22d3ee","#67e8f9","#6ee7b7","#022c22"] },
  { id: 2,  type:"conic", duration:3,  name:"Pure Green",         tag:"ירוק",
    colors:["#022c22","#065f46","#16a34a","#4ade80","#86efac","#4ade80","#16a34a","#065f46","#022c22"] },
  { id: 3,  type:"conic", duration:3,  name:"Green + Gold",       tag:"ירוק+זהב",
    colors:["#022c22","#059669","#6ee7b7","#fbbf24","#fde68a","#fbbf24","#6ee7b7","#059669","#022c22"] },
  { id: 4,  type:"conic", duration:3,  name:"Pure Gold",          tag:"זהב",
    colors:["#78350f","#d97706","#fbbf24","#fef3c7","#ffffff","#fef3c7","#fbbf24","#d97706","#78350f"] },
  { id: 5,  type:"conic", duration:3,  name:"Blue + Cyan",        tag:"כחול+ציאן",
    colors:["#0c4a6e","#0369a1","#0ea5e9","#38bdf8","#bae6fd","#38bdf8","#0ea5e9","#0369a1","#0c4a6e"] },
  { id: 6,  type:"conic", duration:3,  name:"Purple + Pink",      tag:"סגול+ורוד",
    colors:["#2e1065","#6d28d9","#a855f7","#d8b4fe","#f0abfc","#d8b4fe","#a855f7","#6d28d9","#2e1065"] },
  { id: 7,  type:"conic", duration:3,  name:"Fire",               tag:"אש",
    colors:["#1c0700","#7f1d1d","#dc2626","#f97316","#fbbf24","#f97316","#dc2626","#7f1d1d","#1c0700"] },
  { id: 8,  type:"conic", duration:4,  name:"Rainbow",            tag:"קשת",
    colors:["#4ade80","#22d3ee","#818cf8","#f472b6","#fbbf24","#f472b6","#818cf8","#22d3ee","#4ade80"] },
  { id: 9,  type:"conic", duration:4,  name:"Blue + Purple + Pink",tag:"כחול+סגול",
    colors:["#1e3a8a","#3b82f6","#818cf8","#c084fc","#f472b6","#c084fc","#818cf8","#3b82f6","#1e3a8a"] },
  { id: 10, type:"conic", duration:3,  name:"Teal + Gold",        tag:"טיל+זהב",
    colors:["#042f2e","#0f766e","#14b8a6","#2dd4bf","#fbbf24","#fde68a","#fbbf24","#2dd4bf","#042f2e"] },
  { id: 11, type:"conic", duration:5,  name:"Silver",             tag:"כסף",
    colors:["#1e293b","#475569","#94a3b8","#cbd5e1","#ffffff","#cbd5e1","#94a3b8","#475569","#1e293b"] },
  { id: 12, type:"conic", duration:3,  name:"Rose Gold",          tag:"רוז גולד",
    colors:["#881337","#c9748f","#e8b4b8","#fda4af","#ffffff","#fda4af","#e8b4b8","#c9748f","#881337"] },
  { id: 13, type:"conic", duration:3,  name:"Sunset",             tag:"שקיעה",
    colors:["#4a0020","#9d174d","#db2777","#f97316","#fbbf24","#f97316","#db2777","#9d174d","#4a0020"] },
  { id: 14, type:"conic", duration:4,  name:"Ocean",              tag:"אוקיינוס",
    colors:["#0c1445","#1e3a8a","#3b82f6","#93c5fd","#e0f2fe","#ffffff","#e0f2fe","#93c5fd","#0c1445"] },
  { id: 15, type:"conic", duration:1.5,name:"Fast Gold Flash",    tag:"פלאש מהיר",
    colors:["#000000","#fbbf24","#fde68a","#ffffff","#fde68a","#fbbf24","#000000"] },

  // ── STATIC GRADIENT (16–25) ──────────────────────────────────────────────────
  { id: 16, type:"linear", name:"Green Vertical",    tag:"ירוק אנכי",   gradient:"linear-gradient(180deg,#4ade80,#059669)" },
  { id: 17, type:"linear", name:"Gold Vertical",     tag:"זהב אנכי",    gradient:"linear-gradient(180deg,#fbbf24,#d97706)" },
  { id: 18, type:"linear", name:"Blue Vertical",     tag:"כחול אנכי",   gradient:"linear-gradient(180deg,#60a5fa,#1d4ed8)" },
  { id: 19, type:"linear", name:"Purple Vertical",   tag:"סגול אנכי",   gradient:"linear-gradient(180deg,#c084fc,#7c3aed)" },
  { id: 20, type:"linear", name:"Green → Cyan Diag", tag:"ירוק→ציאן",   gradient:"linear-gradient(135deg,#4ade80,#22d3ee)" },
  { id: 21, type:"linear", name:"Gold → Orange Diag",tag:"זהב→כתום",    gradient:"linear-gradient(135deg,#fbbf24,#f97316)" },
  { id: 22, type:"linear", name:"Pink → Gold Diag",  tag:"ורוד→זהב",    gradient:"linear-gradient(135deg,#f472b6,#fbbf24)" },
  { id: 23, type:"linear", name:"Cyan → Purple Diag",tag:"ציאן→סגול",   gradient:"linear-gradient(135deg,#22d3ee,#818cf8)" },
  { id: 24, type:"linear", name:"3-Color Diag",       tag:"3 צבעים",    gradient:"linear-gradient(135deg,#4ade80,#fbbf24,#f472b6)" },
  { id: 25, type:"linear", name:"White → Transparent",tag:"לבן→שקוף",   gradient:"linear-gradient(135deg,rgba(255,255,255,0.8),rgba(255,255,255,0.15))" },

  // ── SOLID (26–30) ────────────────────────────────────────────────────────────
  { id: 26, type:"solid", name:"Solid Gold",   tag:"זהב מוצק",   color:"#fbbf24" },
  { id: 27, type:"solid", name:"Solid Green",  tag:"ירוק מוצק",  color:"#4ade80" },
  { id: 28, type:"solid", name:"Solid Blue",   tag:"כחול מוצק",  color:"#60a5fa" },
  { id: 29, type:"solid", name:"Solid Purple", tag:"סגול מוצק",  color:"#c084fc" },
  { id: 30, type:"solid", name:"Solid White",  tag:"לבן מוצק",   color:"rgba(255,255,255,0.7)" },

  // ── GLOW / BOX-SHADOW (31–40) ────────────────────────────────────────────────
  { id: 31, type:"glow", name:"Green Glow",       tag:"גלואו ירוק",  borderColor:"rgba(74,222,128,0.4)",
    shadow:"0 0 12px rgba(74,222,128,0.7), 0 0 28px rgba(74,222,128,0.3)" },
  { id: 32, type:"glow", name:"Gold Glow",         tag:"גלואו זהב",   borderColor:"rgba(251,191,36,0.4)",
    shadow:"0 0 12px rgba(251,191,36,0.7), 0 0 28px rgba(251,191,36,0.3)" },
  { id: 33, type:"glow", name:"Blue Glow",         tag:"גלואו כחול",  borderColor:"rgba(96,165,250,0.4)",
    shadow:"0 0 12px rgba(96,165,250,0.7), 0 0 28px rgba(96,165,250,0.3)" },
  { id: 34, type:"glow", name:"Purple Glow",       tag:"גלואו סגול",  borderColor:"rgba(192,132,252,0.4)",
    shadow:"0 0 12px rgba(192,132,252,0.7), 0 0 28px rgba(192,132,252,0.3)" },
  { id: 35, type:"glow", name:"White Glow",        tag:"גלואו לבן",   borderColor:"rgba(255,255,255,0.3)",
    shadow:"0 0 14px rgba(255,255,255,0.5), 0 0 32px rgba(255,255,255,0.2)" },
  { id: 36, type:"glow", name:"Green Inner+Outer", tag:"ירוק כפול",   borderColor:"rgba(74,222,128,0.5)",
    shadow:"0 0 8px rgba(74,222,128,0.9), 0 0 24px rgba(74,222,128,0.4), inset 0 0 10px rgba(74,222,128,0.15)" },
  { id: 37, type:"glow", name:"Gold Inner+Outer",  tag:"זהב כפול",    borderColor:"rgba(251,191,36,0.5)",
    shadow:"0 0 8px rgba(251,191,36,0.9), 0 0 24px rgba(251,191,36,0.4), inset 0 0 10px rgba(251,191,36,0.15)" },
  { id: 38, type:"glow", name:"Green + Gold Glow", tag:"ירוק+זהב גלואו",borderColor:"rgba(74,222,128,0.35)",
    shadow:"0 0 14px rgba(74,222,128,0.6), 0 0 14px rgba(251,191,36,0.4)" },
  { id: 39, type:"glow", name:"Intense Neon Green",tag:"ניאון ירוק",   borderColor:"rgba(74,222,128,0.6)",
    shadow:"0 0 5px #4ade80, 0 0 16px rgba(74,222,128,0.9), 0 0 40px rgba(74,222,128,0.4)" },
  { id: 40, type:"glow", name:"Intense Neon Cyan", tag:"ניאון ציאן",   borderColor:"rgba(34,211,238,0.6)",
    shadow:"0 0 5px #22d3ee, 0 0 16px rgba(34,211,238,0.9), 0 0 40px rgba(34,211,238,0.4)" },

  // ── PULSING (41–45) ──────────────────────────────────────────────────────────
  { id: 41, type:"pulse", speed:2, name:"Pulse Gold",   tag:"פולס זהב",   borderColor:"rgba(251,191,36,0.35)",
    shadowLow:"0 0 6px rgba(251,191,36,0.2), 0 0 12px rgba(251,191,36,0.1)",
    shadowHigh:"0 0 18px rgba(251,191,36,0.85), 0 0 36px rgba(251,191,36,0.4)" },
  { id: 42, type:"pulse", speed:2, name:"Pulse Green",  tag:"פולס ירוק",  borderColor:"rgba(74,222,128,0.35)",
    shadowLow:"0 0 6px rgba(74,222,128,0.2), 0 0 12px rgba(74,222,128,0.1)",
    shadowHigh:"0 0 18px rgba(74,222,128,0.85), 0 0 36px rgba(74,222,128,0.4)" },
  { id: 43, type:"pulse", speed:2, name:"Pulse Blue",   tag:"פולס כחול",  borderColor:"rgba(96,165,250,0.35)",
    shadowLow:"0 0 6px rgba(96,165,250,0.2), 0 0 12px rgba(96,165,250,0.1)",
    shadowHigh:"0 0 18px rgba(96,165,250,0.85), 0 0 36px rgba(96,165,250,0.4)" },
  { id: 44, type:"pulse", speed:3, name:"Pulse White",  tag:"פולס לבן",   borderColor:"rgba(255,255,255,0.25)",
    shadowLow:"0 0 6px rgba(255,255,255,0.15), 0 0 12px rgba(255,255,255,0.08)",
    shadowHigh:"0 0 18px rgba(255,255,255,0.6), 0 0 36px rgba(255,255,255,0.25)" },
  { id: 45, type:"pulse", speed:1.5,name:"Fast Pulse Purple",tag:"פולס סגול מהיר",borderColor:"rgba(192,132,252,0.4)",
    shadowLow:"0 0 6px rgba(192,132,252,0.2), 0 0 12px rgba(192,132,252,0.1)",
    shadowHigh:"0 0 20px rgba(192,132,252,0.9), 0 0 40px rgba(192,132,252,0.45)" },

  // ── DASHED (46–48) ───────────────────────────────────────────────────────────
  { id: 46, type:"dash", name:"Dashed Gold",   tag:"מקווקו זהב",  color:"rgba(251,191,36,0.6)" },
  { id: 47, type:"dash", name:"Dashed Green",  tag:"מקווקו ירוק", color:"rgba(74,222,128,0.6)" },
  { id: 48, type:"dash", name:"Dashed White",  tag:"מקווקו לבן",  color:"rgba(255,255,255,0.3)" },

  // ── DOUBLE (49–50) ───────────────────────────────────────────────────────────
  { id: 49, type:"double", name:"Double Gold + Green", tag:"כפול זהב+ירוק",
    outer:"rgba(251,191,36,0.7)", inner:"rgba(74,222,128,0.4)" },
  { id: 50, type:"double", name:"Double White + Blue", tag:"כפול לבן+כחול",
    outer:"rgba(255,255,255,0.5)", inner:"rgba(96,165,250,0.4)" },
];

// ── main component ────────────────────────────────────────────────────────────
export default function AdminBorderDemo() {
  const [selected, setSelected] = useState(null);
  const sel = BORDERS.find(b => b.id === selected);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🖼️ אפקטי מסגרת — 50 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">כל תא מציג אפקט מסגרת שונה על כרטיסיית משחק. לחץ לבחירה.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {BORDERS.map(b => (
          <div key={b.id}
            className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${selected === b.id ? "ring-2 ring-white/40" : "opacity-90 hover:opacity-100"}`}
            style={{ background: "#060810" }}
            onClick={() => setSelected(b.id === selected ? null : b.id)}>
            <div className="p-2.5" style={{ background: "#060810" }}>
              <BorderWrapper b={b} />
            </div>
            <div className="px-2.5 py-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[9px] text-slate-600 font-mono flex-shrink-0">#{b.id}</span>
                <span className="text-[10px] font-semibold text-white truncate">{b.name}</span>
              </div>
              <span className="text-[8px] px-1.5 py-0.5 rounded-full flex-shrink-0 bg-white/5 text-slate-400 border border-white/10">{b.tag}</span>
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <motion.div key={selected}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-2xl border border-white/15 p-6 flex gap-8 items-center flex-wrap"
          style={{ background: "rgba(6,8,16,0.98)" }}>
          <div className="w-52 flex-shrink-0" style={{ background: "#060810", padding: 12, borderRadius: 16 }}>
            <BorderWrapper b={sel} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-bold text-white text-lg">#{sel.id} — {sel.name}</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">{sel.tag}</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">סוג: <span className="text-slate-300">{sel.type}</span></p>
            <button onClick={() => setSelected(null)} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
