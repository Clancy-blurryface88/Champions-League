import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mini match card for preview
function MiniCard({ delay = 0, variants, custom, style = {} }) {
  return (
    <motion.div
      variants={variants}
      custom={custom ?? delay}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden flex-shrink-0"
      style={{
        background: "radial-gradient(ellipse at 50% 120%,rgba(255,220,80,0.1) 0%,transparent 60%),linear-gradient(180deg,rgba(0,0,0,0.95),rgba(5,10,20,0.98))",
        outline: "1px solid rgba(184,148,50,0.22)",
        width: 90, ...style
      }}
    >
      <div className="p-2 flex flex-col gap-1.5">
        <div className="flex justify-center">
          <div className="rounded-lg px-2 py-0.5 flex gap-1.5" style={{ background: "rgba(26,54,45,0.8)" }}>
            {["10","6","0"].map((n, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-emerald-400 leading-none">{n}</span>
                <span className="text-[6px] text-emerald-700">{["י","ש","ד"][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <span className="text-[7px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">Group A</span>
        </div>
        <div className="border-t border-white/8" />
        <div className="flex items-center justify-between px-0.5">
          <div className="flex flex-col items-center gap-0.5 flex-1">
            <span className="fi fi-kr fis rounded" style={{ width: 20, height: 20, fontSize: 20, display: "inline-block", backgroundSize: "cover" }} />
            <span className="text-[6px] text-white">KOR</span>
          </div>
          <div className="flex gap-0.5">
            {[1,1].map((v,i)=>(
              <div key={i} className="w-4 h-5 rounded flex items-center justify-center text-white font-bold text-[8px]"
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>{v}</div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-0.5 flex-1">
            <span className="fi fi-cz fis rounded" style={{ width: 20, height: 20, fontSize: 20, display: "inline-block", backgroundSize: "cover" }} />
            <span className="text-[6px] text-white">CZE</span>
          </div>
        </div>
        <div className="text-center text-[6px] text-slate-600">Guadalajara</div>
      </div>
    </motion.div>
  );
}

const STAGGER = 0.1;
const N = 6;

function Preview({ variants, stagger = STAGGER, label, runKey }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center" key={runKey}>
      {Array.from({ length: N }, (_, i) => (
        <MiniCard key={`${runKey}-${i}`} delay={i} custom={i} variants={variants} />
      ))}
    </div>
  );
}

// ── 25 animation variants ──────────────────────────────────────────────────────

const makeV = (hidden, visible, transition = {}) => ({
  hidden,
  visible: (i = 0) => ({
    ...visible,
    transition: { delay: i * STAGGER, ...transition },
  }),
});

const ANIMATIONS = [
  {
    id: 1, name: "Fade + Scale (נוכחי)", tag: "נוכחי",
    desc: "opacity + scale 0.95→1 עם stagger — האנימציה הקיימת כרגע.",
    v: makeV({ opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1 }, { duration: 0.35 }),
  },
  {
    id: 2, name: "Fade Up", tag: "למעלה",
    desc: "הכרטיסים עולים מלמטה תוך כדי הופעה.",
    v: makeV({ opacity: 0, y: 40 }, { opacity: 1, y: 0 }, { duration: 0.5, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 3, name: "Fade Down", tag: "למטה",
    desc: "הכרטיסים יורדים מלמעלה — כמו שמיכה שנפרשת.",
    v: makeV({ opacity: 0, y: -40 }, { opacity: 1, y: 0 }, { duration: 0.5, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 4, name: "Slide From Left", tag: "משמאל",
    desc: "הכרטיסים מגיעים משמאל אחד אחרי השני.",
    v: makeV({ opacity: 0, x: -50 }, { opacity: 1, x: 0 }, { duration: 0.45, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 5, name: "Slide From Right", tag: "מימין",
    desc: "הכרטיסים מגיעים מימין — כמו מגש שנשלף.",
    v: makeV({ opacity: 0, x: 50 }, { opacity: 1, x: 0 }, { duration: 0.45, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 6, name: "Scale Pop", tag: "פוצץ",
    desc: "קופץ ממרכז עם spring — חי ואנרגטי.",
    v: makeV({ opacity: 0, scale: 0 }, { opacity: 1, scale: 1 }, { type: "spring", stiffness: 380, damping: 16 }),
  },
  {
    id: 7, name: "Elastic Bounce", tag: "אלסטי",
    desc: "גדל מעבר לגודל ואז מתכווץ חזרה — bounce מוגזם.",
    v: makeV({ opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1 }, { type: "spring", stiffness: 250, damping: 10 }),
  },
  {
    id: 8, name: "3D Flip X", tag: "היפוך X",
    desc: "כל כרטיס נהפך על ציר X — כמו הפיכת קלף.",
    v: makeV({ opacity: 0, rotateX: 90, transformPerspective: 600 }, { opacity: 1, rotateX: 0, transformPerspective: 600 }, { duration: 0.55, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 9, name: "3D Flip Y", tag: "היפוך Y",
    desc: "כל כרטיס נהפך על ציר Y — מגיע מהצד.",
    v: makeV({ opacity: 0, rotateY: -90, transformPerspective: 600 }, { opacity: 1, rotateY: 0, transformPerspective: 600 }, { duration: 0.55, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 10, name: "Rotate In", tag: "סיבוב",
    desc: "כל כרטיס מסתובב קלות בכניסה.",
    v: makeV({ opacity: 0, rotate: -12, scale: 0.85 }, { opacity: 1, rotate: 0, scale: 1 }, { duration: 0.5, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 11, name: "Blur Focus", tag: "מיקוד",
    desc: "כרטיסים מתחילים מטושטשים ומתחדדים.",
    v: makeV({ opacity: 0, filter: "blur(16px)", scale: 1.05 }, { opacity: 1, filter: "blur(0px)", scale: 1 }, { duration: 0.6, ease: "easeOut" }),
  },
  {
    id: 12, name: "Bounce Drop", tag: "נפילה",
    desc: "נופל מלמעלה ומקפץ עם gravity.",
    v: makeV({ opacity: 0, y: -80 }, { opacity: 1, y: 0 }, { type: "spring", stiffness: 280, damping: 14 }),
  },
  {
    id: 13, name: "Skew Slide", tag: "הטיה",
    desc: "נכנס עם הטיה שמתיישרת — תחושת מהירות.",
    v: makeV({ opacity: 0, x: -30, skewX: 8 }, { opacity: 1, x: 0, skewX: 0 }, { duration: 0.45, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 14, name: "Zoom Out", tag: "התרחקות",
    desc: "מתחיל גדול מדי ומתכווץ למקומו.",
    v: makeV({ opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1 }, { duration: 0.5, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 15, name: "Curtain Down", tag: "וילון",
    desc: "כל כרטיס נפתח מלמעלה למטה כמו וילון.",
    v: makeV({ opacity: 1, scaleY: 0, originY: 0 }, { opacity: 1, scaleY: 1, originY: 0 }, { duration: 0.4, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 16, name: "Clip Reveal", tag: "חשיפה",
    desc: "נחשף מהמרכז החוצה עם clip-path.",
    v: makeV(
      { clipPath: "inset(50% 50% 50% 50% round 12px)", opacity: 0 },
      { clipPath: "inset(0% 0% 0% 0% round 12px)", opacity: 1 },
      { duration: 0.55, ease: [0.23,1,0.32,1] }
    ),
  },
  {
    id: 17, name: "Rise Glow", tag: "זוהר",
    desc: "עולה מלמטה עם הילה זוהרת בכניסה.",
    v: {
      hidden: { opacity: 0, y: 35, filter: "drop-shadow(0 0 0px rgba(255,215,0,0))" },
      visible: (i = 0) => ({
        opacity: 1, y: 0,
        filter: ["drop-shadow(0 0 20px rgba(255,215,0,0.6))", "drop-shadow(0 0 0px rgba(255,215,0,0))"],
        transition: { delay: i * STAGGER, duration: 0.7, ease: [0.23,1,0.32,1] },
      }),
    },
  },
  {
    id: 18, name: "Newspaper Spin", tag: "עיתון",
    desc: "מסתובב וגדל כמו ניירת עיתון מגיע.",
    v: makeV({ opacity: 0, scale: 0.2, rotate: 180 }, { opacity: 1, scale: 1, rotate: 0 }, { duration: 0.6, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 19, name: "Diagonal Slide", tag: "אלכסון",
    desc: "מגיע מפינה תחתונה-שמאלית באלכסון.",
    v: makeV({ opacity: 0, x: -30, y: 30 }, { opacity: 1, x: 0, y: 0 }, { duration: 0.5, ease: [0.23,1,0.32,1] }),
  },
  {
    id: 20, name: "Fast Stagger", tag: "מהיר",
    desc: "אותה אנימציה כמו הנוכחית אבל בקצב כפול — פחות המתנה.",
    v: {
      hidden: { opacity: 0, y: 20 },
      visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.25, ease: [0.23,1,0.32,1] },
      }),
    },
  },
  {
    id: 21, name: "Slow Drift", tag: "איטי",
    desc: "עולה לאט מאוד — אפקט עדין ורגוע.",
    v: {
      hidden: { opacity: 0, y: 25 },
      visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.18, duration: 0.9, ease: "easeOut" },
      }),
    },
  },
  {
    id: 22, name: "Wave Cascade", tag: "גל",
    desc: "כמו גל שעובר — כל כרטיס מוסיף y שונה לפי sin.",
    v: {
      hidden: { opacity: 0, y: 50 },
      visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: {
          delay: i * 0.1,
          duration: 0.55,
          ease: [0.23, 1, 0.32, 1],
          type: "spring",
          stiffness: 200 - i * 10,
          damping: 20,
        },
      }),
    },
  },
  {
    id: 23, name: "Typewriter", tag: "טייפרייטר",
    desc: "כרטיסים מופיעים אחד אחד בדיוק — ללא חפיפה.",
    v: {
      hidden: { opacity: 0, x: -20 },
      visible: (i = 0) => ({
        opacity: 1, x: 0,
        transition: { delay: i * 0.18, duration: 0.3, ease: "easeOut" },
      }),
    },
  },
  {
    id: 24, name: "Depth Zoom", tag: "עומק",
    desc: "מגיע מעומק התלת-ממד — perspective zoom in.",
    v: makeV(
      { opacity: 0, scale: 0.5, z: -200, filter: "blur(8px)" },
      { opacity: 1, scale: 1, z: 0, filter: "blur(0px)" },
      { duration: 0.65, ease: [0.23,1,0.32,1] }
    ),
  },
  {
    id: 25, name: "Heartbeat Entry", tag: "פולס",
    desc: "מופיע עם דופק — scale קטן, גדול, מתייצב.",
    v: makeV(
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: [0, 1.2, 0.9, 1.05, 1] },
      { duration: 0.7, ease: "easeOut" }
    ),
  },
];

const TAG_COLORS = {
  "נוכחי":"#94a3b8","למעלה":"#60a5fa","למטה":"#818cf8","משמאל":"#34d399","מימין":"#f87171",
  "פוצץ":"#fb923c","אלסטי":"#fbbf24","היפוך X":"#c084fc","היפוך Y":"#e879f9","סיבוב":"#67e8f9",
  "מיקוד":"#cbd5e1","נפילה":"#f97316","הטיה":"#4ade80","התרחקות":"#a78bfa","וילון":"#fde68a",
  "חשיפה":"#38bdf8","זוהר":"#ffd700","עיתון":"#d4a017","אלכסון":"#86efac","מהיר":"#22d3ee",
  "איטי":"#94a3b8","גל":"#60a5fa","טייפרייטר":"#f9a8d4","עומק":"#c084fc","פולס":"#fb923c",
};

export default function AdminEntranceDemo() {
  const [selected, setSelected] = useState(null);
  const [keys, setKeys] = useState(() => Object.fromEntries(ANIMATIONS.map(a => [a.id, 0])));

  const replay = useCallback((id) => {
    setKeys(prev => ({ ...prev, [id]: prev[id] + 1 }));
  }, []);

  const replayAll = () => {
    setKeys(prev => Object.fromEntries(Object.keys(prev).map(k => [k, prev[k] + 1])));
  };

  return (
    <div className="text-white">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">🎬 אנימציות כניסה — 25 קונספטים</h2>
          <p className="text-slate-400 mt-1 text-sm">כל תצוגה מראה 6 כרטיסיות נכנסות. לחץ כרטיס להפעלה מחדש.</p>
        </div>
        <button onClick={replayAll}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white" }}>
          ▶ Replay All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ANIMATIONS.map(({ id, name, tag, v }) => (
          <motion.div key={id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected === id ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-slate-700/60 hover:border-slate-500"}`}
            style={{ background: "#080c1a" }}
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={() => { replay(id); setSelected(id === selected ? null : id); }}>

            {/* Preview area */}
            <div className="p-3 py-4 flex justify-center items-center min-h-[110px]"
              style={{ background: "linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
              <Preview key={keys[id]} variants={v} runKey={keys[id]} />
            </div>

            <div className="px-3 py-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 font-mono">#{id}</span>
                <span className="text-xs font-semibold text-white truncate">{name}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: `${TAG_COLORS[tag]}18`, color: TAG_COLORS[tag], border: `1px solid ${TAG_COLORS[tag]}30` }}>
                {tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (() => {
          const a = ANIMATIONS.find(x => x.id === selected);
          if (!a) return null;
          return (
            <motion.div key={selected}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-6 items-center flex-wrap"
              style={{ background: "rgba(8,12,26,0.98)", boxShadow: "0 0 30px rgba(99,102,241,0.1)" }}>
              <div className="flex-shrink-0 rounded-xl overflow-hidden p-3"
                style={{ background: "linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
                <Preview key={`detail-${keys[selected]}`} variants={a.v} runKey={`d-${keys[selected]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-white">#{a.id} — {a.name}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: `${TAG_COLORS[a.tag]}18`, color: TAG_COLORS[a.tag] }}>{a.tag}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{a.desc}</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => replay(selected)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                    ↺ הפעל שוב
                  </button>
                  <button onClick={() => setSelected(null)} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">✕ סגור</button>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
