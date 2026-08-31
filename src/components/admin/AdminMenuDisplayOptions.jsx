import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, X } from "lucide-react";

// ── Shared demo data — the real 5 sidebar categories from Layout.jsx ──────
const CATEGORIES = [
  { id: "table", label: "טבלה", sub: "טבלת הליגה המלאה, 36 קבוצות", emoji: "🏆",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a99a73381_image.png", color: "#097adc" },
  { id: "exact", label: "פגיעות מדויקות", sub: "מי ניחש הכי מדויק החודש", emoji: "🎯",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7ec75a888_target_5987470.png", color: "#f5c518" },
  { id: "stats", label: "סטטיסטיקה", sub: "הביצועים האישיים שלך", emoji: "📊",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/04dbdbc00_web_15025147.png", color: "#34d399" },
  { id: "results", label: "ניחושים ותוצאות", sub: "כל המשחקים, כל הניחושים", emoji: "📋",
    img: "/icon-scoreboard.png", color: "#a78bfa" },
  { id: "general", label: "ניחושים כלליים", sub: "שאלות עונתיות מיוחדות", emoji: "🌟",
    img: null, color: "#f97316" },
];

function CatIcon({ cat, size = 40 }) {
  if (cat.img) return <img src={cat.img} alt="" style={{ width: size, height: size }} className="object-contain flex-shrink-0" />;
  return <span style={{ fontSize: size * 0.6, lineHeight: 1 }} className="flex-shrink-0">{cat.emoji}</span>;
}

// ── Shared shell every option renders inside ──────────────────────────────
function OptionCard({ n, title, tagline, family, children }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center rounded-full text-[11px] font-black flex-shrink-0"
              style={{ width: 22, height: 22, background: "linear-gradient(135deg,#097adc,#7cadee)", color: "#000" }}>
              {n}
            </span>
            <h3 className="text-white font-bold text-sm">{title}</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">{tagline}</p>
        </div>
        <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
          style={{ background: "rgba(124,173,238,0.12)", color: "#7cadee", border: "1px solid rgba(124,173,238,0.25)" }}>
          {family}
        </span>
      </div>
      <div className="rounded-xl p-4 overflow-hidden" style={{ background: "rgba(3,13,26,0.6)", border: "1px solid rgba(255,255,255,0.05)", minHeight: 220 }}>
        {children}
      </div>
    </div>
  );
}

// ── 1. Baseline — current production design ───────────────────────────────
function Option1() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {CATEGORIES.slice(0, 4).map(c => (
        <div key={c.id} className="rounded-xl p-4 flex flex-col items-center text-center h-28 justify-center gap-2 cursor-pointer hover:scale-105 transition-transform"
          style={{ background: "linear-gradient(110deg,rgba(0,1,3,0.7),45%,rgba(30,38,49,0.9),55%,rgba(0,1,3,0.7))", border: "1px solid rgba(255,255,255,0.08)" }}>
          <CatIcon cat={c} size={32} />
          <span className="text-white text-xs font-semibold leading-tight">{c.label}</span>
        </div>
      ))}
      <div className="col-span-2 rounded-xl p-3 flex items-center justify-center h-12 cursor-pointer hover:scale-105 transition-transform"
        style={{ background: "linear-gradient(110deg,rgba(0,1,3,0.7),45%,rgba(30,38,49,0.9),55%,rgba(0,1,3,0.7))", border: "1px solid rgba(255,255,255,0.08)" }}>
        <span className="text-white text-xs font-semibold">🌟 {CATEGORIES[4].label}</span>
      </div>
      <p className="col-span-2 text-slate-500 text-[10px] mt-1">המצב הקיים היום — גריד 2×2 + כרטיס רחב, כרטיסים נכנסים מ-4 הפינות עם אפקט "shine".</p>
    </div>
  );
}

// ── 2. EDGE — vertical rail docked to the screen edge ─────────────────────
function Option2() {
  const [active, setActive] = useState("table");
  return (
    <div className="flex items-stretch gap-3 h-full">
      <div className="flex flex-col gap-1.5 rounded-xl p-1.5 flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)} className="rounded-lg p-2.5 flex items-center justify-center transition-all"
            style={{ background: active === c.id ? `${c.color}22` : "transparent", boxShadow: active === c.id ? `inset 3px 0 0 ${c.color}` : "none" }}>
            <CatIcon cat={c} size={24} />
          </button>
        ))}
      </div>
      <div className="flex-1 rounded-xl flex flex-col items-center justify-center gap-2 p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        {CATEGORIES.filter(c => c.id === active).map(c => (
          <React.Fragment key={c.id}>
            <CatIcon cat={c} size={48} />
            <p className="text-white font-bold text-sm">{c.label}</p>
            <p className="text-slate-500 text-[11px] text-center">{c.sub}</p>
          </React.Fragment>
        ))}
      </div>
      <p className="sr-only">EDGE rail</p>
    </div>
  );
}

// ── 3. Colorful live-tile board (Windows Start style) ──────────────────────
function Option3() {
  const spans = ["col-span-2 row-span-2", "col-span-1", "col-span-1", "col-span-1", "col-span-1"];
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-1.5" style={{ height: 190 }}>
      {CATEGORIES.map((c, i) => (
        <motion.div key={c.id} whileHover={{ scale: 1.04 }} className={`rounded-lg p-2.5 flex flex-col justify-between cursor-pointer ${spans[i]}`}
          style={{ background: `linear-gradient(135deg, ${c.color}dd, ${c.color}66)` }}>
          <CatIcon cat={c} size={i === 0 ? 30 : 20} />
          <span className="text-white text-[11px] font-bold leading-tight">{c.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ── 4. Neon edge-glow cards ──────────────────────────────────────────────
function Option4() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CATEGORIES.map(c => (
        <motion.div key={c.id} whileHover={{ scale: 1.03 }} className="rounded-xl p-3 flex items-center gap-2.5 cursor-pointer"
          style={{ background: "rgba(8,14,28,0.9)", border: `1px solid ${c.color}`, boxShadow: `0 0 14px ${c.color}55, inset 0 0 12px ${c.color}22` }}>
          <CatIcon cat={c} size={26} />
          <span className="text-white text-[12px] font-semibold leading-tight">{c.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ── 5. Asymmetric bento grid ────────────────────────────────────────────
function Option5() {
  return (
    <div className="grid grid-cols-4 gap-2" style={{ gridTemplateRows: "70px 70px" }}>
      <div className="col-span-2 row-span-2 rounded-xl p-3 flex flex-col justify-end" style={{ background: "rgba(9,122,220,0.14)", border: "1px solid rgba(9,122,220,0.3)" }}>
        <CatIcon cat={CATEGORIES[0]} size={30} /><span className="text-white text-xs font-bold mt-1">{CATEGORIES[0].label}</span>
      </div>
      <div className="col-span-2 rounded-xl p-2.5 flex items-center gap-2" style={{ background: "rgba(245,197,24,0.12)", border: "1px solid rgba(245,197,24,0.3)" }}>
        <CatIcon cat={CATEGORIES[1]} size={22} /><span className="text-white text-[11px] font-bold">{CATEGORIES[1].label}</span>
      </div>
      <div className="rounded-xl p-2 flex flex-col items-center justify-center gap-1" style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }}>
        <CatIcon cat={CATEGORIES[2]} size={18} /><span className="text-white text-[9px] font-bold text-center">{CATEGORIES[2].label}</span>
      </div>
      <div className="rounded-xl p-2 flex flex-col items-center justify-center gap-1" style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)" }}>
        <CatIcon cat={CATEGORIES[3]} size={18} /><span className="text-white text-[9px] font-bold text-center">{CATEGORIES[3].label}</span>
      </div>
      <div className="col-span-4 rounded-xl p-2 flex items-center justify-center gap-2" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)" }}>
        <CatIcon cat={CATEGORIES[4]} size={18} /><span className="text-white text-[11px] font-bold">{CATEGORIES[4].label}</span>
      </div>
    </div>
  );
}

// ── 6. Minimal list with chevron ────────────────────────────────────────
function Option6() {
  return (
    <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      {CATEGORIES.map(c => (
        <button key={c.id} className="w-full flex items-center gap-3 py-2.5 hover:bg-white/5 rounded-lg px-2 transition-colors">
          <CatIcon cat={c} size={22} />
          <span className="flex-1 text-right text-white text-[13px] font-medium">{c.label}</span>
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
      ))}
    </div>
  );
}

// ── 7. Fixed bottom nav bar ──────────────────────────────────────────────
function Option7() {
  const [active, setActive] = useState("table");
  return (
    <div className="relative h-full flex items-end justify-center pb-1">
      <div className="flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)} className="flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 transition-colors"
            style={{ background: active === c.id ? `${c.color}22` : "transparent" }}>
            <CatIcon cat={c} size={18} />
            <span className="text-[8px] font-semibold" style={{ color: active === c.id ? c.color : "#64748b" }}>{c.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 8. Radial fan menu around a FAB ─────────────────────────────────────
function Option8() {
  const [open, setOpen] = useState(true);
  const R = 78;
  return (
    <div className="relative flex items-center justify-center" style={{ height: 190 }}>
      {CATEGORIES.map((c, i) => {
        const angle = (Math.PI / (CATEGORIES.length - 1)) * i - Math.PI;
        const x = open ? Math.cos(angle) * R : 0;
        const y = open ? Math.sin(angle) * R * 0.75 : 0;
        return (
          <motion.div key={c.id} animate={{ x, y, opacity: open ? 1 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="absolute rounded-full flex items-center justify-center" style={{ width: 40, height: 40, background: c.color }}>
            <CatIcon cat={c} size={20} />
          </motion.div>
        );
      })}
      <button onClick={() => setOpen(o => !o)} className="relative z-10 rounded-full flex items-center justify-center text-white font-bold"
        style={{ width: 48, height: 48, background: "linear-gradient(135deg,#097adc,#7cadee)" }}>
        {open ? "✕" : "☰"}
      </button>
    </div>
  );
}

// ── 9. Horizontal snap carousel ─────────────────────────────────────────
function Option9() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollSnapType: "x mandatory" }}>
      {CATEGORIES.map(c => (
        <div key={c.id} className="flex-shrink-0 rounded-xl p-4 flex flex-col items-center gap-2 justify-center" style={{ width: 110, height: 130, scrollSnapAlign: "start", background: `${c.color}18`, border: `1px solid ${c.color}44` }}>
          <CatIcon cat={c} size={30} />
          <span className="text-white text-[11px] font-semibold text-center leading-tight">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── 10. macOS-style dock, magnifies on hover ────────────────────────────
function Option10() {
  const [hover, setHover] = useState(null);
  return (
    <div className="flex items-end justify-center gap-3 h-full pb-4">
      {CATEGORIES.map(c => (
        <motion.div key={c.id} onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)}
          animate={{ scale: hover === c.id ? 1.5 : 1, y: hover === c.id ? -10 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="rounded-2xl flex items-center justify-center cursor-pointer" style={{ width: 44, height: 44, background: `${c.color}33`, border: `1px solid ${c.color}` }}>
          <CatIcon cat={c} size={22} />
        </motion.div>
      ))}
    </div>
  );
}

// ── 11. Hexagon honeycomb ───────────────────────────────────────────────
function Option11() {
  const hex = { clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" };
  return (
    <div className="flex flex-wrap justify-center gap-1" style={{ maxWidth: 260 }}>
      {CATEGORIES.map((c, i) => (
        <div key={c.id} className="flex flex-col items-center justify-center gap-1"
          style={{ ...hex, width: 78, height: 68, background: `${c.color}2a`, border: `1px solid ${c.color}66`, marginTop: i % 2 ? 20 : 0 }}>
          <CatIcon cat={c} size={20} />
          <span className="text-white text-[8px] font-bold text-center px-1 leading-tight">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── 12. Circular ring menu ──────────────────────────────────────────────
function Option12() {
  const R = 72;
  return (
    <div className="relative mx-auto" style={{ width: 190, height: 190 }}>
      <div className="absolute inset-0 rounded-full" style={{ border: "1px dashed rgba(255,255,255,0.1)" }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xs font-bold">תפריט</span>
      </div>
      {CATEGORIES.map((c, i) => {
        const angle = (2 * Math.PI * i) / CATEGORIES.length - Math.PI / 2;
        const x = 95 + Math.cos(angle) * R - 20;
        const y = 95 + Math.sin(angle) * R - 20;
        return (
          <div key={c.id} className="absolute rounded-full flex items-center justify-center" style={{ left: x, top: y, width: 40, height: 40, background: c.color }}>
            <CatIcon cat={c} size={20} />
          </div>
        );
      })}
    </div>
  );
}

// ── 13. Expandable accordion ────────────────────────────────────────────
function Option13() {
  const [openId, setOpenId] = useState("table");
  return (
    <div className="space-y-1.5">
      {CATEGORIES.map(c => (
        <div key={c.id} className="rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          <button onClick={() => setOpenId(openId === c.id ? null : c.id)} className="w-full flex items-center gap-2.5 p-2.5">
            <CatIcon cat={c} size={20} />
            <span className="flex-1 text-right text-white text-[12px] font-semibold">{c.label}</span>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-500" style={{ transform: openId === c.id ? "rotate(-90deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          <AnimatePresence>
            {openId === c.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-3 pb-2.5 overflow-hidden">
                <p className="text-slate-400 text-[10px]">{c.sub}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── 14. LED scoreboard / TV-guide channels ──────────────────────────────
function Option14() {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: "#050b16", border: "1px solid rgba(52,211,153,0.25)" }}>
      {CATEGORIES.map((c, i) => (
        <div key={c.id} className="flex items-center gap-3 px-3 py-2" style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
          <span className="text-[10px] font-mono" style={{ color: "#34d399" }}>CH{i + 1}</span>
          <CatIcon cat={c} size={18} />
          <span className="flex-1 text-[11px] font-mono font-bold tracking-wide" style={{ color: "#a7f3d0" }}>{c.label.toUpperCase()}</span>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#34d399" }} />
        </div>
      ))}
    </div>
  );
}

// ── 15. 3D stacked cards, cycle through ─────────────────────────────────
function Option15() {
  const [idx, setIdx] = useState(0);
  const order = [...CATEGORIES.slice(idx), ...CATEGORIES.slice(0, idx)];
  return (
    <div className="relative flex items-center justify-center" style={{ height: 190 }}>
      {order.slice(0, 3).reverse().map((c, i) => {
        const depth = 2 - i;
        return (
          <motion.div key={c.id} onClick={() => depth === 0 && setIdx((idx + 1) % CATEGORIES.length)}
            animate={{ scale: 1 - depth * 0.07, y: depth * 10, opacity: 1 - depth * 0.25 }}
            className="absolute rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ width: 140, height: 150, background: `${c.color}22`, border: `1px solid ${c.color}66`, zIndex: 10 - depth }}>
            <CatIcon cat={c} size={30} />
            <span className="text-white text-xs font-bold">{c.label}</span>
          </motion.div>
        );
      })}
      <p className="absolute bottom-0 text-slate-500 text-[9px]">לחיצה על הקלף הקדמי מעבירה הבאה</p>
    </div>
  );
}

// ── 16. Featured hero + compact list ─────────────────────────────────────
function Option16() {
  const [hero, ...rest] = CATEGORIES;
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${hero.color}33, transparent)`, border: `1px solid ${hero.color}55` }}>
        <CatIcon cat={hero} size={36} />
        <div><p className="text-white font-bold text-sm">{hero.label}</p><p className="text-slate-400 text-[10px]">{hero.sub}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {rest.map(c => (
          <div key={c.id} className="rounded-lg p-2 flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <CatIcon cat={c} size={16} /><span className="text-white text-[10px] font-medium">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 17. Isometric 3D tile grid ───────────────────────────────────────────
function Option17() {
  return (
    <div className="flex items-center justify-center" style={{ height: 190, perspective: 600 }}>
      <div className="grid grid-cols-3 gap-2" style={{ transform: "rotateX(45deg) rotateZ(-45deg)", transformStyle: "preserve-3d" }}>
        {CATEGORIES.map(c => (
          <div key={c.id} className="flex flex-col items-center justify-center rounded-md" style={{ width: 50, height: 50, background: c.color, boxShadow: "4px 4px 0 rgba(0,0,0,0.4)" }}>
            <CatIcon cat={c} size={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 18. Full-screen immersive typographic menu ───────────────────────────
function Option18() {
  const [hover, setHover] = useState(null);
  return (
    <div className="flex flex-col justify-center h-full gap-2 px-2">
      {CATEGORIES.map(c => (
        <div key={c.id} onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)} className="cursor-pointer transition-all"
          style={{ opacity: hover && hover !== c.id ? 0.35 : 1 }}>
          <span className="font-black text-white block" style={{ fontSize: hover === c.id ? 26 : 20, transition: "font-size 0.2s", borderBottom: hover === c.id ? `2px solid ${c.color}` : "2px solid transparent" }}>
            {c.label}
          </span>
        </div>
      ))}
      <p className="text-slate-500 text-[9px] mt-1">גרסה מלאה: תפריט מסך-מלא עם רשימת שמות ענקית, ריחוף מדגיש שורה ומעמעם את השאר.</p>
    </div>
  );
}

// ── 19. Holographic / iridescent gradient cards ──────────────────────────
function Option19() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {CATEGORIES.map((c, i) => (
        <div key={c.id} className="rounded-xl p-3 flex flex-col items-center gap-1.5 text-center h-24 justify-center"
          style={{ background: `linear-gradient(${120 + i * 40}deg, #ff6ec4, #7873f5, #4adede, #f5c518)`, backgroundSize: "300% 300%", opacity: 0.9 }}>
          <CatIcon cat={c} size={22} />
          <span className="text-white text-[10px] font-bold drop-shadow" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── 20. Minimal glyph row, label appears on tap ──────────────────────────
function Option20() {
  const [sel, setSel] = useState(null);
  return (
    <div className="flex flex-col items-center gap-4 justify-center h-full">
      <div className="flex items-center gap-4">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setSel(c.id)} className="rounded-full flex items-center justify-center transition-all"
            style={{ width: 40, height: 40, background: sel === c.id ? `${c.color}33` : "rgba(255,255,255,0.04)", border: sel === c.id ? `1px solid ${c.color}` : "1px solid transparent" }}>
            <CatIcon cat={c} size={20} />
          </button>
        ))}
      </div>
      <p className="text-white text-xs font-semibold h-4">{CATEGORIES.find(c => c.id === sel)?.label || "בחר אייקון למעלה"}</p>
    </div>
  );
}

// ── 21. Editorial magazine layout ─────────────────────────────────────────
function Option21() {
  return (
    <div className="space-y-2.5">
      {CATEGORIES.map((c, i) => (
        <div key={c.id} className="flex items-center gap-3">
          <span className="text-2xl font-black" style={{ color: `${c.color}55`, fontStyle: "italic" }}>0{i + 1}</span>
          <div className="flex-1 border-b pb-1.5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-white font-bold text-[13px]">{c.label}</p>
            <p className="text-slate-500 text-[9px]">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 22. Radial donut segments (SVG) ───────────────────────────────────────
function Option22() {
  const [sel, setSel] = useState(null);
  const n = CATEGORIES.length, R = 70, r = 40, cx = 90, cy = 90;
  const arc = (i) => {
    const a0 = (2 * Math.PI * i) / n - Math.PI / 2, a1 = (2 * Math.PI * (i + 1)) / n - Math.PI / 2;
    const pt = (rad, ang) => [cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)];
    const [x0, y0] = pt(R, a0), [x1, y1] = pt(R, a1), [x2, y2] = pt(r, a1), [x3, y3] = pt(r, a0);
    return `M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 0 0 ${x3},${y3} Z`;
  };
  return (
    <div className="flex items-center justify-center" style={{ height: 190 }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        {CATEGORIES.map((c, i) => (
          <path key={c.id} d={arc(i)} fill={c.color} opacity={sel === c.id || sel === null ? 0.85 : 0.25}
            onClick={() => setSel(c.id)} style={{ cursor: "pointer" }} />
        ))}
        <text x="90" y="94" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
          {sel ? CATEGORIES.find(c => c.id === sel).label : "בחר"}
        </text>
      </svg>
    </div>
  );
}

// ── 23. Command palette (search launcher) ─────────────────────────────────
function Option23() {
  const [q, setQ] = useState("");
  const filtered = CATEGORIES.filter(c => c.label.includes(q));
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "rgba(8,14,28,0.9)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="flex items-center gap-2 px-3 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <Search className="w-4 h-4 text-slate-500" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="חפש קטגוריה... (טבלה, סטטיסטיקה...)"
          className="bg-transparent text-white text-xs flex-1 outline-none placeholder:text-slate-600" dir="rtl" />
        {q && <X className="w-3.5 h-3.5 text-slate-500 cursor-pointer" onClick={() => setQ("")} />}
      </div>
      <div className="p-1.5">
        {filtered.map(c => (
          <div key={c.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5">
            <CatIcon cat={c} size={18} /><span className="text-white text-[11px] font-medium">{c.label}</span>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-slate-600 text-[10px] px-2 py-2 text-center">אין תוצאות</p>}
      </div>
    </div>
  );
}

// ── 24. Flip cards (tap → back reveals description) ───────────────────────
function Option24() {
  const [flipped, setFlipped] = useState({});
  return (
    <div className="grid grid-cols-2 gap-2.5" style={{ perspective: 800 }}>
      {CATEGORIES.slice(0, 4).map(c => (
        <div key={c.id} onClick={() => setFlipped(f => ({ ...f, [c.id]: !f[c.id] }))} className="cursor-pointer" style={{ height: 80, transformStyle: "preserve-3d" }}>
          <motion.div animate={{ rotateY: flipped[c.id] ? 180 : 0 }} transition={{ duration: 0.4 }} className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
            <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1" style={{ backfaceVisibility: "hidden", background: `${c.color}22`, border: `1px solid ${c.color}55` }}>
              <CatIcon cat={c} size={22} /><span className="text-white text-[10px] font-bold">{c.label}</span>
            </div>
            <div className="absolute inset-0 rounded-xl flex items-center justify-center p-2" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "rgba(255,255,255,0.06)" }}>
              <span className="text-slate-300 text-[9px] text-center leading-tight">{c.sub}</span>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ── 25. Live-widget dashboard preview per category ────────────────────────
function Option25() {
  const widgets = {
    table: "🥇 ריאל מדריד",
    exact: "🔥 דימה — 6 פגיעות",
    stats: "📈 מקום 3/12",
    results: "⏱ המשחק הבא בעוד 2 ימים",
    general: "❓ 3 שאלות פתוחות",
  };
  return (
    <div className="grid grid-cols-1 gap-1.5">
      {CATEGORIES.map(c => (
        <div key={c.id} className="flex items-center gap-2.5 rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)", borderRight: `3px solid ${c.color}` }}>
          <CatIcon cat={c} size={20} />
          <div className="flex-1">
            <p className="text-white text-[11px] font-semibold">{c.label}</p>
            <p className="text-slate-500 text-[9px]">{widgets[c.id]}</p>
          </div>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
        </div>
      ))}
    </div>
  );
}

const OPTIONS = [
  { n: 1, title: "עיצוב נוכחי (בסיס להשוואה)", tagline: "המצב הקיים היום — גריד 2×2 + כרטיס רחב עם אנימציית shine, נפתח כמסך מלא.", family: "בסיס", Comp: Option1 },
  { n: 2, title: "EDGE — פס ניווט צמוד לקצה המסך", tagline: "עמודת אייקונים דקה שצמודה לקצה המסך תמיד, לחיצה מציגה פירוט בפאנל לצידה.", family: "EDGE", Comp: Option2 },
  { n: 3, title: "לוח אריחים חי (Live Tiles)", tagline: "אריחים צבעוניים בגדלים שונים בהשראת Windows — אריח אחד גדול בולט, השאר קטנים.", family: "גריד", Comp: Option3 },
  { n: 4, title: "כרטיסים עם זוהר קצוות (Neon Edge Glow)", tagline: "מסגרת דקה זוהרת בצבע הקטגוריה סביב כל כרטיס, אפקט הייטק/גיימינג.", family: "ויזואלי", Comp: Option4 },
  { n: 5, title: "Bento Grid א-סימטרי", tagline: "כרטיסים בגדלים שונים בהשראת ממשקי SaaS מודרניים — קטגוריה ראשית גדולה, שאר קטנות.", family: "גריד", Comp: Option5 },
  { n: 6, title: "רשימה מינימלית עם שברון", tagline: "שורות פשוטות עם אייקון, תווית ושברון — כמו תפריט הגדרות סטנדרטי.", family: "רשימה", Comp: Option6 },
  { n: 7, title: "סרגל ניווט תחתון קבוע", tagline: "5 אייקונים בשורה תחתונה קבועה, כמו אפליקציית מובייל — מחליף לגמרי את המודאל.", family: "ניווט קבוע", Comp: Option7 },
  { n: 8, title: "תפריט רדיאלי סביב כפתור מרכזי", tagline: "כפתור FAB מרכזי שנפתח למניפה של 5 קטגוריות מסביב.", family: "רדיאלי", Comp: Option8 },
  { n: 9, title: "קרוסלה אופקית נגררת", tagline: "כרטיסים ברוחב קבוע גוללים אופקית, עם snap לכל קטגוריה.", family: "קרוסלה/סטאק", Comp: Option9 },
  { n: 10, title: "Dock בסגנון macOS", tagline: "שורת אייקונים שמתעצם בריחוף, כמו הדוק של מק.", family: "ניווט קבוע", Comp: Option10 },
  { n: 11, title: "כוורת משושים (Honeycomb)", tagline: "אריחים משושים בסידור מדבורים, שורות מוזחות זו מזו.", family: "גריד", Comp: Option11 },
  { n: 12, title: "טבעת מעגלית", tagline: "5 הקטגוריות מסודרות במעגל סביב תווית מרכזית.", family: "רדיאלי", Comp: Option12 },
  { n: 13, title: "אקורדיון מתרחב", tagline: "לחיצה על קטגוריה פותחת תיאור קצר מתחתיה, בלי לעזוב את הרשימה.", family: "רשימה", Comp: Option13 },
  { n: 14, title: "סקורבורד LED / מדריך ערוצים", tagline: "השראה ממסך תוצאות ספורט — שורות ירוקות זוהרות בפונט מונוספייס.", family: "ויזואלי", Comp: Option14 },
  { n: 15, title: "ערימת קלפים תלת-ממדית", tagline: "3 קלפים בערימה עם עומק, לחיצה על הקדמי מעבירה לבא בתור.", family: "קרוסלה/סטאק", Comp: Option15 },
  { n: 16, title: "Hero גדול + רשימה משנית", tagline: "קטגוריה אחת מודגשת למעלה (למשל טבלה), שאר 4 בשורה קומפקטית מתחת.", family: "רשימה", Comp: Option16 },
  { n: 17, title: "גריד איזומטרי תלת-ממדי", tagline: "אריחים בהטיה איזומטרית שיוצרת תחושת עומק, בסגנון משחקי אסטרטגיה.", family: "ויזואלי", Comp: Option17 },
  { n: 18, title: "תפריט טיפוגרפי מסך-מלא", tagline: "רשימת שמות ענקית, ריחוף מדגיש שורה אחת ומעמעם את השאר — מינימליסטי ודרמטי.", family: "ויזואלי", Comp: Option18 },
  { n: 19, title: "כרטיסים הולוגרפיים", tagline: "רקע גרדיאנט אירידיסנטי (הולוגרמה) לכל כרטיס, אפקט פרימיום צעצועי.", family: "ויזואלי", Comp: Option19 },
  { n: 20, title: "גליפים מינימליים, תווית בלחיצה", tagline: "רק אייקונים בשורה; שם הקטגוריה מופיע רק אחרי לחיצה על האייקון.", family: "רשימה", Comp: Option20 },
  { n: 21, title: "לייאאוט עיתונאי (Editorial)", tagline: "מספור גדול לצד כל קטגוריה בסגנון מגזין, עם קו הפרדה דק.", family: "רשימה", Comp: Option21 },
  { n: 22, title: "חוגת דונאט רדיאלית (SVG)", tagline: "5 פלחים בגרף דונאט, כל פלח = קטגוריה; לחיצה מציגה את השם במרכז.", family: "רדיאלי", Comp: Option22 },
  { n: 23, title: "פלטת פקודות (Command Palette)", tagline: "תיבת חיפוש בסגנון Cmd+K — מקלידים ומסננים בין הקטגוריות.", family: "אינטראקטיבי", Comp: Option23 },
  { n: 24, title: "קלפים מתהפכים (Flip Cards)", tagline: "לחיצה על כרטיס הופכת אותו 180° וחושפת תיאור קצר בגב הקלף.", family: "אינטראקטיבי", Comp: Option24 },
  { n: 25, title: "דשבורד ווידג'טים חיים", tagline: "כל קטגוריה מציגה תצוגה מקדימה אמיתית — מוביל בטבלה, הדירוג שלך, המשחק הבא וכו'.", family: "דשבורד", Comp: Option25 },
];

export default function AdminMenuDisplayOptions() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">25 אפשרויות לתצוגת תפריט הקטגוריות</h2>
        <p className="text-slate-400 text-sm">
          כל האפשרויות מודגמות על 5 הקטגוריות האמיתיות מהתפריט הראשי (טבלה, פגיעות מדויקות, סטטיסטיקה, ניחושים ותוצאות, ניחושים כלליים).
          הן אינטראקטיביות — ריחוף/לחיצה עובדים בדיוק כמו שיתנהגו בפועל. זו גלריית דמו בלבד, שום דבר כאן לא משפיע על התפריט האמיתי עד שתבחר כיוון.
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {OPTIONS.map(opt => (
          <OptionCard key={opt.n} n={opt.n} title={opt.title} tagline={opt.tagline} family={opt.family}>
            <opt.Comp />
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
