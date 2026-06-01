import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FLAG_PX = 56;

function Flag({ code }) {
  return (
    <span
      className="fi fis rounded-md shadow-md"
      style={{ width: FLAG_PX, height: FLAG_PX, fontSize: FLAG_PX, display: "inline-block",
               backgroundSize: "cover", backgroundPosition: "center", minWidth: FLAG_PX }}
    >
      <span className={`fi fi-${code}`} style={{ display: "none" }} />
    </span>
  );
}

// Wraps a flag with an ambient effect — effect is always running
function FlagWrap({ code, children }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: FLAG_PX, height: FLAG_PX }}>
      <Flag code={code} />
      {children}
    </div>
  );
}

function Shell({ children }) {
  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl"
      style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {children}
      <span className="text-slate-600 font-bold text-base">—</span>
      {React.cloneElement(children, { code: "cz" })}
    </div>
  );
}

// ── 1. Soft Glow Pulse ────────────────────────────────────────────────────────
function E1() {
  const F = ({ code }) => (
    <FlagWrap code={code}>
      <motion.div className="absolute inset-0 rounded-md pointer-events-none"
        animate={{ boxShadow: ["0 0 0px 0px rgba(255,255,255,0)", "0 0 18px 6px rgba(255,255,255,0.35)", "0 0 0px 0px rgba(255,255,255,0)"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
    </FlagWrap>
  );
  return <Shell><F code="kr" /></Shell>;
}

// ── 2. Rainbow Glow ───────────────────────────────────────────────────────────
function E2() {
  const F = ({ code }) => (
    <FlagWrap code={code}>
      <motion.div className="absolute inset-0 rounded-md pointer-events-none"
        animate={{ boxShadow: [
          "0 0 16px 4px rgba(255,80,80,0.5)", "0 0 16px 4px rgba(255,200,0,0.5)",
          "0 0 16px 4px rgba(0,255,120,0.5)", "0 0 16px 4px rgba(0,180,255,0.5)",
          "0 0 16px 4px rgba(180,0,255,0.5)", "0 0 16px 4px rgba(255,80,80,0.5)"
        ]}}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
    </FlagWrap>
  );
  return <Shell><F code="kr" /></Shell>;
}

// ── 3. Float + Shadow ─────────────────────────────────────────────────────────
function E3() {
  const F = ({ code }) => (
    <motion.div className="relative" style={{ width: FLAG_PX, height: FLAG_PX }}
      animate={{ y: [0, -6, 0], filter: ["drop-shadow(0 4px 6px rgba(0,0,0,0.6))", "drop-shadow(0 14px 12px rgba(0,0,0,0.3))", "drop-shadow(0 4px 6px rgba(0,0,0,0.6))"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      <Flag code={code} />
    </motion.div>
  );
  return <Shell><F code="kr" /></Shell>;
}

// ── 4. Heartbeat Scale ────────────────────────────────────────────────────────
function E4() {
  const F = ({ code }) => (
    <motion.div style={{ width: FLAG_PX, height: FLAG_PX }}
      animate={{ scale: [1, 1.08, 1, 1.04, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}>
      <Flag code={code} />
    </motion.div>
  );
  return <Shell><F code="kr" /></Shell>;
}

// ── 5. Shine Sweep ────────────────────────────────────────────────────────────
function E5() {
  const F = ({ code }) => (
    <FlagWrap code={code}>
      <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
        <motion.div className="absolute top-0 bottom-0 w-8"
          style={{ background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%)", transform: "skewX(-15deg)" }}
          animate={{ left: ["-40%", "140%"] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }} />
      </div>
    </FlagWrap>
  );
  return <Shell><F code="kr" /></Shell>;
}

// ── 6. Gentle Wobble ─────────────────────────────────────────────────────────
function E6() {
  const F = ({ code, delay = 0 }) => (
    <motion.div style={{ width: FLAG_PX, height: FLAG_PX }}
      animate={{ rotate: [0, 3, 0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}>
      <Flag code={code} />
    </motion.div>
  );
  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl"
      style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <F code="kr" delay={0} />
      <span className="text-slate-600 font-bold text-base">—</span>
      <F code="cz" delay={0.8} />
    </div>
  );
}

// ── 7. Breathing ─────────────────────────────────────────────────────────────
function E7() {
  const F = ({ code, delay = 0 }) => (
    <motion.div style={{ width: FLAG_PX, height: FLAG_PX }}
      animate={{ scale: [1, 1.06, 1], opacity: [1, 0.85, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}>
      <Flag code={code} />
    </motion.div>
  );
  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl"
      style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <F code="kr" delay={0} />
      <span className="text-slate-600 font-bold text-base">—</span>
      <F code="cz" delay={2} />
    </div>
  );
}

// ── 8. Particle Ring ─────────────────────────────────────────────────────────
function E8() {
  const dots = [0, 1, 2, 3, 4, 5];
  const F = ({ code, colorBase = "#60a5fa" }) => (
    <div className="relative" style={{ width: FLAG_PX, height: FLAG_PX }}>
      <Flag code={code} />
      {dots.map(i => {
        const angle = (i / dots.length) * 360;
        const rad = (angle * Math.PI) / 180;
        const r = 36;
        return (
          <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{ background: colorBase, top: "50%", left: "50%", marginTop: -3, marginLeft: -3 }}
            animate={{ x: [0, Math.cos(rad) * r, 0], y: [0, Math.sin(rad) * r, 0], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }} />
        );
      })}
    </div>
  );
  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl"
      style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <F code="kr" colorBase="#f87171" />
      <span className="text-slate-600 font-bold text-base">—</span>
      <F code="cz" colorBase="#60a5fa" />
    </div>
  );
}

// ── 9. Ripple Ring ───────────────────────────────────────────────────────────
function E9() {
  const F = ({ code }) => (
    <div className="relative flex items-center justify-center" style={{ width: FLAG_PX + 20, height: FLAG_PX + 20 }}>
      {[0, 0.8, 1.6].map(delay => (
        <motion.div key={delay} className="absolute rounded-md border border-white/30 pointer-events-none"
          style={{ width: FLAG_PX, height: FLAG_PX }}
          animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay, ease: "easeOut" }} />
      ))}
      <Flag code={code} />
    </div>
  );
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <F code="kr" /><span className="text-slate-600 font-bold">—</span><F code="cz" />
    </div>
  );
}

// ── 10. Electric Border ──────────────────────────────────────────────────────
function E10() {
  const F = ({ code }) => (
    <FlagWrap code={code}>
      <motion.div className="absolute inset-0 rounded-md pointer-events-none"
        style={{ border: "1.5px solid transparent" }}
        animate={{ boxShadow: [
          "0 0 0 1.5px rgba(0,240,255,0.8), 0 0 8px 2px rgba(0,240,255,0.4)",
          "0 0 0 1.5px rgba(180,0,255,0.8), 0 0 8px 2px rgba(180,0,255,0.4)",
          "0 0 0 1.5px rgba(0,240,255,0.8), 0 0 8px 2px rgba(0,240,255,0.4)",
        ]}}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
    </FlagWrap>
  );
  return <Shell><F code="kr" /></Shell>;
}

// ── 11. Neon Outline ─────────────────────────────────────────────────────────
function E11() {
  const F = ({ code }) => (
    <FlagWrap code={code}>
      <motion.div className="absolute inset-0 rounded-md pointer-events-none"
        animate={{ boxShadow: [
          "0 0 0 2px rgba(250,204,21,0.9), 0 0 20px 4px rgba(250,204,21,0.3)",
          "0 0 0 2px rgba(250,204,21,0.4), 0 0 6px 1px rgba(250,204,21,0.1)",
          "0 0 0 2px rgba(250,204,21,0.9), 0 0 20px 4px rgba(250,204,21,0.3)",
        ]}}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
    </FlagWrap>
  );
  return <Shell><F code="kr" /></Shell>;
}

// ── 12. Hue Shift ────────────────────────────────────────────────────────────
function E12() {
  const F = ({ code }) => (
    <motion.div style={{ width: FLAG_PX, height: FLAG_PX }}
      animate={{ filter: ["hue-rotate(0deg) saturate(1)", "hue-rotate(60deg) saturate(1.4)", "hue-rotate(120deg) saturate(1.2)", "hue-rotate(0deg) saturate(1)"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
      <Flag code={code} />
    </motion.div>
  );
  return <Shell><F code="kr" /></Shell>;
}

// ── 13. Spotlight Sweep ──────────────────────────────────────────────────────
function E13() {
  const F = ({ code }) => (
    <FlagWrap code={code}>
      <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
        <motion.div className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(circle at 0% 50%, rgba(255,255,255,0.25) 0%, transparent 55%)",
            "radial-gradient(circle at 100% 50%, rgba(255,255,255,0.25) 0%, transparent 55%)",
            "radial-gradient(circle at 0% 50%, rgba(255,255,255,0.25) 0%, transparent 55%)",
          ]}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
      </div>
    </FlagWrap>
  );
  return <Shell><F code="kr" /></Shell>;
}

// ── 14. Shadow Color Pulse ───────────────────────────────────────────────────
function E14() {
  const F = ({ code, color1, color2 }) => (
    <motion.div style={{ width: FLAG_PX, height: FLAG_PX }}
      animate={{ filter: [`drop-shadow(0 0 8px ${color1})`, `drop-shadow(0 0 16px ${color2})`, `drop-shadow(0 0 8px ${color1})`] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
      <Flag code={code} />
    </motion.div>
  );
  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl"
      style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <F code="kr" color1="rgba(239,68,68,0.6)" color2="rgba(239,68,68,1)" />
      <span className="text-slate-600 font-bold text-base">—</span>
      <F code="cz" color1="rgba(59,130,246,0.6)" color2="rgba(59,130,246,1)" />
    </div>
  );
}

// ── 15. Tilt 3D Mouse ────────────────────────────────────────────────────────
function E15() {
  const F = ({ code, dir = 1 }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    return (
      <motion.div style={{ width: FLAG_PX, height: FLAG_PX, perspective: 300 }}
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          const cx = (e.clientX - r.left) / r.width - 0.5;
          const cy = (e.clientY - r.top) / r.height - 0.5;
          setTilt({ x: cy * -20, y: cx * 20 * dir });
        }}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
        <motion.div style={{ width: FLAG_PX, height: FLAG_PX, borderRadius: 6 }}
          animate={{ rotateX: tilt.x, rotateY: tilt.y, boxShadow: `${-tilt.y * 0.5}px ${tilt.x * 0.5}px 20px rgba(255,255,255,0.15)` }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <Flag code={code} />
        </motion.div>
      </motion.div>
    );
  };
  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl"
      style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <F code="kr" dir={1} />
      <span className="text-slate-600 font-bold text-base">—</span>
      <F code="cz" dir={-1} />
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────────
const EFFECTS = [
  { id: 1,  name: "Soft Glow Pulse",    tag: "זוהר",      desc: "הילה לבנה שפולסת בעדינות מאחורי הדגל בלי הפסקה", Component: E1 },
  { id: 2,  name: "Rainbow Glow",       tag: "קשת",       desc: "הזוהר מאחורי הדגל עובר לאט דרך כל צבעי הקשת", Component: E2 },
  { id: 3,  name: "Float + Shadow",     tag: "ריחוף",     desc: "הדגל מרחף למעלה-למטה עם צל שמשתנה בהתאם לגובה", Component: E3 },
  { id: 4,  name: "Heartbeat Scale",    tag: "פולס",      desc: "פעימה עדינה של גודל כל 2-3 שניות — כמו לב חי", Component: E4 },
  { id: 5,  name: "Shine Sweep",        tag: "ברק",       desc: "פס אור לבן חולף על הדגל כל כמה שניות", Component: E5 },
  { id: 6,  name: "Gentle Wobble",      tag: "נדנוד",     desc: "הדגל מתנדנד קלות ימינה-שמאלה בקצב שונה לכל קבוצה", Component: E6 },
  { id: 7,  name: "Breathing",          tag: "נשימה",     desc: "scale ו-opacity משתנים מינימלית כמו נשימה איטית", Component: E7 },
  { id: 8,  name: "Particle Ring",      tag: "חלקיקים",   desc: "חלקיקים קטנים יוצאים מהדגל לכל הכיוונים ונעלמים", Component: E8 },
  { id: 9,  name: "Ripple Ring",        tag: "גלים",      desc: "טבעות מתרחבות מהדגל החוצה כמו אדווה במים", Component: E9 },
  { id: 10, name: "Electric Border",    tag: "חשמל",      desc: "מסגרת חשמלית ציאן-סגולה שמחליפה צבעים סביב הדגל", Component: E10 },
  { id: 11, name: "Neon Outline",       tag: "ניאון",     desc: "מסגרת זהב זוהרת שמדמה שלט ניאון", Component: E11 },
  { id: 12, name: "Hue Shift",          tag: "צבעים",     desc: "גוון הדגל משתנה לאט מעגלית — גרדיאנט צבעים חי", Component: E12 },
  { id: 13, name: "Spotlight",          tag: "זרקור",     desc: "זרקור עגול נע מצד לצד על פני הדגל", Component: E13 },
  { id: 14, name: "Shadow Color Pulse", tag: "צל צבע",    desc: "כל דגל פולט צל בצבע ייחודי לו שגדל ומתכווץ", Component: E14 },
  { id: 15, name: "3D Tilt (hover)",    tag: "3D עכבר",   desc: "הדגל נוטה ב-3D בעקבות מיקום העכבר — הזז מעליו", Component: E15 },
];

const TAG_COLORS = {
  "זוהר": "#e2e8f0", "קשת": "#f472b6", "ריחוף": "#60a5fa", "פולס": "#fb923c",
  "ברק": "#fde68a", "נדנוד": "#86efac", "נשימה": "#a5b4fc", "חלקיקים": "#f87171",
  "גלים": "#67e8f9", "חשמל": "#4ade80", "ניאון": "#fbbf24", "צבעים": "#c084fc",
  "זרקור": "#fcd34d", "צל צבע": "#f9a8d4", "3D עכבר": "#34d399",
};

// ── Main ───────────────────────────────────────────────────────────────────────
export default function AdminFlagAnimations() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🏳️ אפקטים אמביינטים על דגלים</h2>
        <p className="text-slate-400 mt-1 text-sm">אפקטים רציפים שרצים על הדגל לאחר שהוא כבר מוצג. לחץ לפרטים.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {EFFECTS.map(({ id, name, tag, Component }) => (
          <motion.div key={id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected === id ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-slate-700 hover:border-slate-500"}`}
            style={{ background: "#1e293b" }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(id === selected ? null : id)}>

            <div className="py-4 px-2 flex items-center justify-center min-h-[110px] relative"
              style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(30,41,80,0.6) 0%, transparent 70%)" }}>
              <div className="absolute top-1.5 left-2 text-[9px] text-slate-600 font-mono">#{id}</div>
              <div className="scale-90"><Component /></div>
            </div>

            <div className="px-3 py-2.5 border-t border-slate-700 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-white truncate">{name}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: `${TAG_COLORS[tag]}20`, color: TAG_COLORS[tag] }}>
                {tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (() => {
          const fx = EFFECTS.find(e => e.id === selected);
          if (!fx) return null;
          const { name, tag, desc, Component } = fx;
          return (
            <motion.div key={selected}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-6 items-center flex-wrap"
              style={{ background: "rgba(15,23,42,0.95)", boxShadow: "0 0 30px rgba(99,102,241,0.1)" }}>
              <div className="flex-shrink-0"><Component /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-base font-bold">#{selected} — {name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: `${TAG_COLORS[tag]}20`, color: TAG_COLORS[tag] }}>{tag}</span>
                </div>
                <p className="text-slate-400 text-sm">{desc}</p>
                <button onClick={() => setSelected(null)} className="mt-3 text-xs text-slate-600 hover:text-slate-400 transition-colors">✕ סגור</button>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
