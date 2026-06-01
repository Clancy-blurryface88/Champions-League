import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";

// ── Shared flag shell ──────────────────────────────────────────────────────────
const FLAG_PX = 56;

function FlagEl({ code, style = {}, className = "" }) {
  return (
    <span
      className={`fi fi-${code} fis rounded-md shadow-md ${className}`}
      style={{ width: FLAG_PX, height: FLAG_PX, fontSize: FLAG_PX, display: "inline-block", backgroundSize: "cover", backgroundPosition: "center", minWidth: FLAG_PX, ...style }}
    />
  );
}

function MatchShell({ children, label }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-5 p-4 rounded-2xl"
        style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
        {children}
      </div>
      <span className="text-[10px] text-slate-500 font-mono">{label}</span>
    </div>
  );
}

// Separator
function Sep() {
  return <span className="text-slate-600 font-bold text-lg mx-1">—</span>;
}

// ── 1. Pixel Reveal (current) ─────────────────────────────────────────────────
function Anim1({ run }) {
  const tiles = Array.from({ length: 16 }, (_, i) => i);
  return (
    <MatchShell label="current default">
      {["kr", "cz"].map((code, fi) => (
        <div key={code} className="relative rounded-md overflow-hidden" style={{ width: FLAG_PX, height: FLAG_PX }}>
          <FlagEl code={code} />
          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: "repeat(4,1fr)", gridTemplateRows: "repeat(4,1fr)" }}>
            {tiles.map(i => (
              <motion.div key={`${run}-${i}`} className="bg-slate-800"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: fi * 0.3 + Math.random() * 0.9, ease: "easeInOut" }} />
            ))}
          </div>
        </div>
      ))}
    </MatchShell>
  );
}

// ── 2. Fade Up ────────────────────────────────────────────────────────────────
function Anim2({ run }) {
  return (
    <MatchShell label="fade + rise">
      {["kr", "cz"].map((code, i) => (
        <motion.div key={`${run}-${code}`}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.2, ease: [0.23, 1, 0.32, 1] }}>
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── 3. Scale Spring ───────────────────────────────────────────────────────────
function Anim3({ run }) {
  return (
    <MatchShell label="scale spring bounce">
      {["kr", "cz"].map((code, i) => (
        <motion.div key={`${run}-${code}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 16, delay: i * 0.18 }}>
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── 4. 3D Flip ────────────────────────────────────────────────────────────────
function Anim4({ run }) {
  return (
    <MatchShell label="3D Y-axis flip">
      {["kr", "cz"].map((code, i) => (
        <motion.div key={`${run}-${code}`}
          style={{ perspective: 600 }}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.65, delay: i * 0.25, ease: [0.23, 1, 0.32, 1] }}>
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── 5. Slide From Sides ───────────────────────────────────────────────────────
function Anim5({ run }) {
  return (
    <MatchShell label="slide from each side">
      {[["kr", -50], ["cz", 50]].map(([code, x]) => (
        <motion.div key={`${run}-${code}`}
          initial={{ x, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}>
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── 6. Blur → Sharp ───────────────────────────────────────────────────────────
function Anim6({ run }) {
  return (
    <MatchShell label="blur → sharp focus">
      {["kr", "cz"].map((code, i) => (
        <motion.div key={`${run}-${code}`}
          initial={{ filter: "blur(14px)", opacity: 0, scale: 1.12 }}
          animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: i * 0.22, ease: "easeOut" }}>
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── 7. Glitch Entry ───────────────────────────────────────────────────────────
function Anim7({ run }) {
  const glitchVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: (i) => ({
      opacity: [0, 1, 0.7, 1, 0.85, 1],
      x: [0, -6, 5, -3, 2, 0],
      filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(-30deg)", "hue-rotate(20deg)", "hue-rotate(0deg)"],
      transition: { duration: 0.6, delay: i * 0.25, ease: "easeOut" },
    }),
  };
  return (
    <MatchShell label="glitch entry">
      {["kr", "cz"].map((code, i) => (
        <motion.div key={`${run}-${code}`} custom={i} variants={glitchVariants} initial="hidden" animate="visible">
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── 8. Wave Float (continuous) ────────────────────────────────────────────────
function Anim8({ run }) {
  return (
    <MatchShell label="wave float (loop)">
      {["kr", "cz"].map((code, i) => (
        <motion.div key={`${run}-${code}`}
          animate={{ y: [0, -6, 0, -4, 0], rotate: [0, 1.5, 0, -1, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}>
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── 9. Scan-Line Reveal ───────────────────────────────────────────────────────
function Anim9({ run }) {
  return (
    <MatchShell label="scan-line top→bottom">
      {["kr", "cz"].map((code, i) => (
        <div key={`${run}-${code}`} className="relative rounded-md overflow-hidden" style={{ width: FLAG_PX, height: FLAG_PX }}>
          <FlagEl code={code} />
          <motion.div className="absolute inset-x-0 bottom-0 bg-slate-900"
            initial={{ height: "100%" }}
            animate={{ height: "0%" }}
            transition={{ duration: 0.8, delay: i * 0.3, ease: [0.77, 0, 0.18, 1] }} />
        </div>
      ))}
    </MatchShell>
  );
}

// ── 10. Bounce Drop ───────────────────────────────────────────────────────────
function Anim10({ run }) {
  return (
    <MatchShell label="drop + bounce">
      {["kr", "cz"].map((code, i) => (
        <motion.div key={`${run}-${code}`}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 14, delay: i * 0.2 }}>
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── 11. Rotate Entry ──────────────────────────────────────────────────────────
function Anim11({ run }) {
  return (
    <MatchShell label="rotate + fade in">
      {[["kr", -180], ["cz", 180]].map(([code, deg]) => (
        <motion.div key={`${run}-${code}`}
          initial={{ rotate: deg, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}>
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── 12. Glow Pulse Entry ──────────────────────────────────────────────────────
function Anim12({ run }) {
  return (
    <MatchShell label="glow pulse entry">
      {["kr", "cz"].map((code, i) => (
        <motion.div key={`${run}-${code}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: [0.85, 1.1, 1], boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 30px rgba(255,255,255,0.8)", "0 0 0px rgba(255,255,255,0)"] }}
          transition={{ duration: 0.9, delay: i * 0.25, ease: "easeOut" }}
          className="rounded-md">
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── 13. Shatter Assembly (4 quadrants) ────────────────────────────────────────
function Anim13({ run }) {
  const quadrants = [
    { clip: "inset(0 50% 50% 0)", from: { x: -20, y: -20 } },
    { clip: "inset(0 0 50% 50%)", from: { x: 20, y: -20 } },
    { clip: "inset(50% 50% 0 0)", from: { x: -20, y: 20 } },
    { clip: "inset(50% 0 0 50%)", from: { x: 20, y: 20 } },
  ];
  return (
    <MatchShell label="shatter assembly">
      {["kr", "cz"].map((code, fi) => (
        <div key={`${run}-${code}`} className="relative" style={{ width: FLAG_PX, height: FLAG_PX }}>
          {quadrants.map((q, qi) => (
            <motion.div key={qi} className="absolute inset-0"
              style={{ clipPath: q.clip }}
              initial={{ ...q.from, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: fi * 0.3 + qi * 0.06 }}>
              <FlagEl code={code} />
            </motion.div>
          ))}
        </div>
      ))}
    </MatchShell>
  );
}

// ── 14. Typewriter Pixels (row by row) ────────────────────────────────────────
function Anim14({ run }) {
  const ROWS = 8;
  return (
    <MatchShell label="typewriter rows">
      {["kr", "cz"].map((code, fi) => (
        <div key={`${run}-${code}`} className="relative rounded-md overflow-hidden" style={{ width: FLAG_PX, height: FLAG_PX }}>
          <FlagEl code={code} />
          <div className="absolute inset-0 flex flex-col">
            {Array.from({ length: ROWS }, (_, ri) => (
              <motion.div key={ri} className="flex-1 bg-slate-900"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: fi * 0.4 + ri * 0.08, ease: "easeOut" }} />
            ))}
          </div>
        </div>
      ))}
    </MatchShell>
  );
}

// ── 15. Heartbeat ─────────────────────────────────────────────────────────────
function Anim15({ run }) {
  return (
    <MatchShell label="heartbeat pulse">
      {["kr", "cz"].map((code, i) => (
        <motion.div key={`${run}-${code}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 0.9, 1.15, 0.95, 1], opacity: [0, 1, 1, 1, 1, 1] }}
          transition={{ duration: 0.9, delay: i * 0.3, ease: "easeOut" }}>
          <FlagEl code={code} />
        </motion.div>
      ))}
    </MatchShell>
  );
}

// ── All animations ─────────────────────────────────────────────────────────────
const ANIMATIONS = [
  { id: 1,  name: "Pixel Reveal",       tag: "נוכחי",     desc: "16 טיילים כהים נמסים בזה אחר זה — כמו לחשוף תמונה", Component: Anim1 },
  { id: 2,  name: "Fade Up",            tag: "עדין",      desc: "הדגל עולה מלמטה תוך כדי שהוא מתגלה בהדרגה", Component: Anim2 },
  { id: 3,  name: "Scale Spring",       tag: "שובב",      desc: "הדגל קופץ מנקודה קטנה עם bounce אלסטי", Component: Anim3 },
  { id: 4,  name: "3D Flip",            tag: "דרמה",      desc: "הכרטיס נהפך על ציר Y כמו היפוך פיזי", Component: Anim4 },
  { id: 5,  name: "Slide Sides",        tag: "כיוון",     desc: "בית מגיע משמאל, אורח מגיע מימין — נפגשים במרכז", Component: Anim5 },
  { id: 6,  name: "Blur → Sharp",       tag: "מסתורי",    desc: "הדגל מתחיל מטושטש ומתחדד לאט לאט", Component: Anim6 },
  { id: 7,  name: "Glitch",             tag: "טכנולוגי",  desc: "רטט דיגיטלי קצר עם shift צבעים לפני שמתייצב", Component: Anim7 },
  { id: 8,  name: "Wave Float",         tag: "חי (לופ)",  desc: "הדגל מרחף בגל רציף כל הזמן שהכרטיס פתוח", Component: Anim8 },
  { id: 9,  name: "Scan-Line",          tag: "קינמטי",    desc: "וילון נשלף מלמעלה למטה כמו הדפסה", Component: Anim9 },
  { id: 10, name: "Bounce Drop",        tag: "אנרגטי",    desc: "הדגל צונח מלמעלה ומקפץ פעם אחת עם gravity", Component: Anim10 },
  { id: 11, name: "Rotate Entry",       tag: "יצירתי",    desc: "שתי הקבוצות מסתובבות מכיוונים הפוכים ומתייצבות", Component: Anim11 },
  { id: 12, name: "Glow Pulse",         tag: "פרימיום",   desc: "הדגל מופיע עם פיצוץ אור לבן שנמס מיד", Component: Anim12 },
  { id: 13, name: "Shatter Assembly",   tag: "מפחיד",     desc: "4 חלקים מגיעים מפינות שונות ומרכיבים את הדגל", Component: Anim13 },
  { id: 14, name: "Typewriter Rows",    tag: "דיגיטלי",   desc: "שורות נחשפות בזו אחר זו מלמעלה כמו מסוף", Component: Anim14 },
  { id: 15, name: "Heartbeat",          tag: "רגשי",      desc: "הדגל פועם פנימה-החוצה כמו פעימת לב לפני שמתייצב", Component: Anim15 },
];

const TAG_COLORS = {
  "נוכחי": "#94a3b8", "עדין": "#86efac", "שובב": "#fb923c", "דרמה": "#f472b6",
  "כיוון": "#60a5fa", "מסתורי": "#a78bfa", "טכנולוגי": "#4ade80", "חי (לופ)": "#34d399",
  "קינמטי": "#fbbf24", "אנרגטי": "#ef4444", "יצירתי": "#f0abfc", "פרימיום": "#fde68a",
  "מפחיד": "#ff6b6b", "דיגיטלי": "#67e8f9", "רגשי": "#f9a8d4",
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminFlagAnimations() {
  const [runKeys, setRunKeys] = useState(() => Object.fromEntries(ANIMATIONS.map(a => [a.id, 0])));
  const [selected, setSelected] = useState(null);
  const [replayAll, setReplayAll] = useState(0);

  const replay = (id) => setRunKeys(prev => ({ ...prev, [id]: prev[id] + 1 }));

  const replayAllFn = () => {
    const next = {};
    ANIMATIONS.forEach(a => { next[a.id] = (runKeys[a.id] || 0) + 1; });
    setRunKeys(next);
    setReplayAll(r => r + 1);
  };

  return (
    <div className="text-white">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">🏳️ אנימציות דגל — 15 קונספטים</h2>
          <p className="text-slate-400 mt-1 text-sm">לחץ על כרטיס לחזרה, או השתמש ב-Replay All.</p>
        </div>
        <button onClick={replayAllFn}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white" }}>
          ▶ Replay All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {ANIMATIONS.map(({ id, name, tag, desc, Component }) => (
          <motion.div key={id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected === id ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-slate-700 hover:border-slate-500"}`}
            style={{ background: "#1e293b" }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { replay(id); setSelected(id === selected ? null : id); }}>

            {/* Preview */}
            <div className="py-4 px-2 flex items-center justify-center min-h-[110px] relative"
              style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.08) 0%, transparent 70%)" }}>
              <div className="absolute top-1.5 left-2 text-[9px] text-slate-600 font-mono">#{id}</div>
              <Component run={runKeys[id]} />
            </div>

            {/* Label */}
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

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (() => {
          const anim = ANIMATIONS.find(a => a.id === selected);
          if (!anim) return null;
          const { name, tag, desc, Component } = anim;
          return (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-5 items-center flex-wrap"
              style={{ background: "rgba(15,23,42,0.95)", boxShadow: "0 0 30px rgba(99,102,241,0.1)" }}>
              <div className="flex-shrink-0">
                <Component run={runKeys[selected]} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-base font-bold">#{selected} — {name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: `${TAG_COLORS[tag]}20`, color: TAG_COLORS[tag] }}>{tag}</span>
                </div>
                <p className="text-slate-400 text-sm">{desc}</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => replay(selected)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                    style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                    ↺ הפעל שוב
                  </button>
                  <button onClick={() => setSelected(null)}
                    className="text-xs text-slate-600 hover:text-slate-400 transition-colors">✕ סגור</button>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
