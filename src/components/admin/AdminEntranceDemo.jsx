import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";

// ── Mock leaderboard data ──────────────────────────────────────────────────────
const PLAYERS = [
  { rank: 1, name: "דימה פ.", pts: 340, color: "#fbbf24", medal: "🥇" },
  { rank: 2, name: "דין ב.",  pts: 310, color: "#9ca3af", medal: "🥈" },
  { rank: 3, name: "אורי מ.", pts: 290, color: "#b45309", medal: "🥉" },
  { rank: 4, name: "מיה ש.", pts: 270, color: "#6366f1", medal: null },
  { rank: 5, name: "יוסי ק.", pts: 250, color: "#06b6d4", medal: null },
];

function LeaderRow({ player, style, className = "" }) {
  const bg = player.rank === 1 ? "rgba(251,191,36,0.12)" : player.rank === 2 ? "rgba(156,163,175,0.1)" : player.rank === 3 ? "rgba(180,83,9,0.1)" : "rgba(255,255,255,0.04)";
  const border = player.rank === 1 ? "rgba(251,191,36,0.4)" : player.rank <= 3 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)";
  return (
    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${className}`}
      style={{ background: bg, border: `1px solid ${border}`, ...style }}>
      <div className="w-6 flex items-center justify-center flex-shrink-0">
        {player.medal ? <span className="text-base leading-none">{player.medal}</span>
          : <span className="text-xs font-bold text-slate-400">{player.rank}</span>}
      </div>
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
        style={{ background: `${player.color}40`, border: `1.5px solid ${player.color}60` }}>
        {player.name[0]}
      </div>
      <span className="flex-1 text-xs font-semibold text-white truncate">{player.name}</span>
      <span className="text-xs font-bold tabular-nums" style={{ color: player.color }}>{player.pts}</span>
    </div>
  );
}

// ── Animation variants ─────────────────────────────────────────────────────────
const S = 0.12; // stagger

const makeV = (hidden, vis, tr = {}) => ({
  hidden,
  visible: (i = 0) => ({ ...vis, transition: { delay: i * S, ...tr } }),
});

// Exponential delay — last place fast, first place dramatic (like current leaderboard)
const expV = (hidden, vis, tr = {}) => ({
  hidden,
  visible: (i = 0) => {
    const rank = PLAYERS.length - 1 - i;
    const d = Math.pow(rank, 1.6) * 0.25;
    return { ...vis, transition: { delay: d, ...tr } };
  },
});

const VARIANTS = [
  // 1 — current
  { hidden: { opacity: 0, y: 20 }, vis: { opacity: 1, y: 0 }, tr: { duration: 0.6, ease: "easeOut" }, exp: true },
  // 2
  { hidden: { opacity: 0, x: -60 }, vis: { opacity: 1, x: 0 }, tr: { duration: 0.45, ease: [0.23,1,0.32,1] } },
  // 3
  { hidden: { opacity: 0, x: 60 }, vis: { opacity: 1, x: 0 }, tr: { duration: 0.45, ease: [0.23,1,0.32,1] } },
  // 4
  { hidden: { opacity: 0, scale: 0.7 }, vis: { opacity: 1, scale: 1 }, tr: { type:"spring", stiffness:320, damping:18 } },
  // 5
  { hidden: { opacity: 0, y: -30 }, vis: { opacity: 1, y: 0 }, tr: { type:"spring", stiffness:280, damping:14 } },
  // 6
  { hidden: { opacity: 0, filter:"blur(12px)", scale:1.08 }, vis: { opacity:1, filter:"blur(0px)", scale:1 }, tr: { duration:0.55, ease:"easeOut" } },
  // 7
  { hidden: { opacity: 0, x: -40, skewX: 10 }, vis: { opacity: 1, x: 0, skewX: 0 }, tr: { duration: 0.4, ease:[0.23,1,0.32,1] } },
  // 8 — rotate
  { hidden: { opacity: 0, rotate: -8, scale: 0.88 }, vis: { opacity: 1, rotate: 0, scale: 1 }, tr: { duration: 0.45, ease:[0.23,1,0.32,1] } },
  // 9 — flip Y
  { hidden: { opacity: 0, rotateY: 90 }, vis: { opacity: 1, rotateY: 0 }, tr: { duration: 0.5, ease:[0.23,1,0.32,1] } },
  // 10 — zoom out
  { hidden: { opacity: 0, scale: 1.5 }, vis: { opacity: 1, scale: 1 }, tr: { duration: 0.45, ease:[0.23,1,0.32,1] } },
  // 11 — clip left→right
  { hidden: { clipPath:"inset(0 100% 0 0 round 10px)", opacity:1 }, vis: { clipPath:"inset(0 0% 0 0 round 10px)", opacity:1 }, tr: { duration:0.5, ease:[0.23,1,0.32,1] } },
  // 12 — drop bounce
  { hidden: { opacity:0, y:-50 }, vis: { opacity:1, y:0 }, tr: { type:"spring", stiffness:260, damping:12 } },
  // 13 — diagonal
  { hidden: { opacity:0, x:-30, y:30 }, vis: { opacity:1, x:0, y:0 }, tr: { duration:0.5, ease:[0.23,1,0.32,1] } },
  // 14 — curtain scaleY
  { hidden: { scaleY:0, originY:0, opacity:1 }, vis: { scaleY:1, originY:0, opacity:1 }, tr: { duration:0.4, ease:[0.23,1,0.32,1] } },
  // 15 — elastic
  { hidden: { opacity:0, scale:0.2 }, vis: { opacity:1, scale:1 }, tr: { type:"spring", stiffness:200, damping:8 } },
  // 16 — newspaper spin
  { hidden: { opacity:0, scale:0.3, rotate:180 }, vis: { opacity:1, scale:1, rotate:0 }, tr: { duration:0.6, ease:[0.23,1,0.32,1] } },
  // 17 — fast
  { hidden: { opacity:0, y:15 }, vis: { opacity:1, y:0 }, tr: { duration:0.2, ease:"easeOut" }, fastS:0.06 },
  // 18 — slow drift
  { hidden: { opacity:0, y:25 }, vis: { opacity:1, y:0 }, tr: { duration:1, ease:"easeOut" }, fastS:0.2 },
  // 19 — typewriter exact (no overlap)
  { hidden: { opacity:0, x:-15 }, vis: { opacity:1, x:0 }, tr: { duration:0.25, ease:"easeOut" }, fastS:0.22 },
  // 20 — depth zoom
  { hidden: { opacity:0, scale:0.4, filter:"blur(8px)" }, vis: { opacity:1, scale:1, filter:"blur(0px)" }, tr: { duration:0.6, ease:[0.23,1,0.32,1] } },
  // 21 — heartbeat
  { hidden: { opacity:0, scale:0 }, vis: { opacity:1, scale:[0,1.15,0.92,1.05,1] }, tr: { duration:0.7, ease:"easeOut" } },
  // 22 — glow rise
  { hidden: { opacity:0, y:30, filter:"drop-shadow(0 0 0px rgba(255,215,0,0))" }, vis: { opacity:1, y:0, filter:["drop-shadow(0 0 16px rgba(255,215,0,0.7))","drop-shadow(0 0 0px rgba(255,215,0,0))"] }, tr: { duration:0.7, ease:[0.23,1,0.32,1] } },
  // 23 — wave spring (variable stiffness)
  { hidden: { opacity:0, y:40 }, vis: { opacity:1, y:0 }, tr: { type:"spring", stiffness:180, damping:18 }, waveS:true },
  // 24 — flip X
  { hidden: { opacity:0, rotateX:90 }, vis: { opacity:1, rotateX:0 }, tr: { duration:0.5, ease:[0.23,1,0.32,1] } },
  // 25 — fade only
  { hidden: { opacity:0 }, vis: { opacity:1 }, tr: { duration:0.4, ease:"easeIn" }, fastS:0.14 },
];

const ANIMATIONS = [
  { id:1,  name:"Exp Fade Up (נוכחי)", tag:"נוכחי",    desc:"האנימציה הנוכחית — מקום אחרון מהיר, מקום ראשון עם דרמה." },
  { id:2,  name:"Slide From Left",     tag:"משמאל",    desc:"כל שורה נכנסת מהצד שמאל." },
  { id:3,  name:"Slide From Right",    tag:"מימין",    desc:"כל שורה נכנסת מהצד ימין." },
  { id:4,  name:"Scale Spring",        tag:"קפיצה",    desc:"כל שורה קופצת ממרכזה עם spring." },
  { id:5,  name:"Drop Bounce",         tag:"נפילה",    desc:"נופלת מלמעלה ומקפצת." },
  { id:6,  name:"Blur Focus",          tag:"מיקוד",    desc:"מתחיל מטושטש ומתחדד." },
  { id:7,  name:"Skew Slide",          tag:"הטיה",     desc:"נכנסת עם הטיה שמתיישרת." },
  { id:8,  name:"Rotate In",           tag:"סיבוב",    desc:"מסתובבת קלות בכניסה." },
  { id:9,  name:"3D Flip Y",           tag:"היפוך Y",  desc:"נהפכת על ציר Y." },
  { id:10, name:"Zoom Out",            tag:"התרחקות",  desc:"מתחילה גדולה ומתכווצת למקומה." },
  { id:11, name:"Clip Reveal",         tag:"חשיפה",    desc:"נחשפת משמאל לימין עם clip-path." },
  { id:12, name:"Spring Drop",         tag:"spring",   desc:"נופלת מלמעלה עם bounce חזק." },
  { id:13, name:"Diagonal",            tag:"אלכסון",   desc:"נכנסת מפינה שמאל-תחתית." },
  { id:14, name:"Curtain Down",        tag:"וילון",    desc:"נפתחת מלמעלה למטה." },
  { id:15, name:"Elastic",             tag:"אלסטי",    desc:"מתרחבת עם bounce מוגזם." },
  { id:16, name:"Newspaper Spin",      tag:"עיתון",    desc:"מסתובבת 180° בכניסה." },
  { id:17, name:"Fast Stagger",        tag:"מהיר",     desc:"stagger קצר — מהיר ואנרגטי." },
  { id:18, name:"Slow Drift",          tag:"איטי",     desc:"stagger ארוך — רגוע ורציני." },
  { id:19, name:"Typewriter",          tag:"טייפרייטר",desc:"אחת אחת בדיוק ללא חפיפה." },
  { id:20, name:"Depth Zoom",          tag:"עומק",     desc:"מגיעה מעומק עם blur." },
  { id:21, name:"Heartbeat",           tag:"פולס",     desc:"פועמת בכניסה." },
  { id:22, name:"Glow Rise",           tag:"זוהר",     desc:"עולה עם הבזק זהוב שנמס." },
  { id:23, name:"Wave Spring",         tag:"גל",       desc:"spring שמשתנה לפי השורה." },
  { id:24, name:"3D Flip X",           tag:"היפוך X",  desc:"נהפכת על ציר X." },
  { id:25, name:"Fade Only",           tag:"פייד",     desc:"opacity בלבד — הכי עדין." },
];

const TAG_COLORS = {
  "נוכחי":"#94a3b8","משמאל":"#34d399","מימין":"#f87171","קפיצה":"#fb923c","נפילה":"#fbbf24",
  "מיקוד":"#cbd5e1","הטיה":"#4ade80","סיבוב":"#67e8f9","היפוך Y":"#c084fc","התרחקות":"#a78bfa",
  "חשיפה":"#38bdf8","spring":"#60a5fa","אלכסון":"#86efac","וילון":"#fde68a","אלסטי":"#fb923c",
  "עיתון":"#d4a017","מהיר":"#22d3ee","איטי":"#6b7280","טייפרייטר":"#f9a8d4","עומק":"#818cf8",
  "פולס":"#f97316","זוהר":"#ffd700","גל":"#60a5fa","היפוך X":"#e879f9","פייד":"#94a3b8",
};

function MiniLeaderboard({ vIdx, runKey }) {
  const def = VARIANTS[vIdx];

  const getVariants = (i) => {
    if (def.exp) return expV(def.hidden, def.vis, def.tr);
    const s = def.fastS ?? S;
    if (def.waveS) {
      return {
        hidden: def.hidden,
        visible: (idx = 0) => ({
          ...def.vis,
          transition: { delay: idx * s, type:"spring", stiffness: 220 - idx*15, damping:18 },
        }),
      };
    }
    return makeV(def.hidden, def.vis, def.tr);
  };

  const v = getVariants();

  return (
    <div className="space-y-1.5 w-full" key={runKey}>
      {PLAYERS.map((p, i) => (
        <motion.div key={`${runKey}-${i}`}
          custom={i}
          variants={v}
          initial="hidden"
          animate="visible">
          <LeaderRow player={p} />
        </motion.div>
      ))}
    </div>
  );
}

export default function AdminEntranceDemo() {
  const [selected, setSelected] = useState(null);
  const [keys, setKeys] = useState(() => Object.fromEntries(ANIMATIONS.map(a => [a.id, 0])));

  const replay = useCallback((id) => setKeys(prev => ({ ...prev, [id]: prev[id] + 1 })), []);
  const replayAll = () => setKeys(prev => Object.fromEntries(Object.keys(prev).map(k => [k, prev[k] + 1])));

  return (
    <div className="text-white">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">🏆 אנימציות כניסה — לוח משתתפים</h2>
          <p className="text-slate-400 mt-1 text-sm">25 דרכים שונות לכניסת שורות הטבלה. לחץ על כרטיס להפעלה.</p>
        </div>
        <button onClick={replayAll}
          className="px-4 py-2 rounded-xl text-sm font-bold"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color:"white" }}>
          ▶ Replay All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ANIMATIONS.map(({ id, name, tag }) => (
          <motion.div key={id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected===id?"border-indigo-500 ring-2 ring-indigo-500/30":"border-slate-700/60 hover:border-slate-500"}`}
            style={{ background:"#080c1a" }}
            whileHover={{ y:-2 }} whileTap={{ scale:0.98 }}
            onClick={() => { replay(id); setSelected(id===selected?null:id); }}>

            <div className="p-3 min-h-[170px] flex items-center"
              style={{ background:"linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
              <MiniLeaderboard key={keys[id]} vIdx={id-1} runKey={keys[id]} />
            </div>

            <div className="px-3 py-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-600 font-mono">#{id}</span>
                <span className="text-xs font-semibold text-white truncate">{name}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background:`${TAG_COLORS[tag]}18`, color:TAG_COLORS[tag], border:`1px solid ${TAG_COLORS[tag]}30` }}>
                {tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {selected && (() => {
        const a = ANIMATIONS.find(x=>x.id===selected);
        if (!a) return null;
        return (
          <motion.div key={selected}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-6 items-start flex-wrap"
            style={{ background:"rgba(8,12,26,0.98)", boxShadow:"0 0 30px rgba(99,102,241,0.1)" }}>
            <div className="w-56 flex-shrink-0 rounded-xl p-3" style={{ background:"linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
              <MiniLeaderboard key={`d-${keys[selected]}`} vIdx={selected-1} runKey={`d-${keys[selected]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-bold text-white">#{a.id} — {a.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background:`${TAG_COLORS[a.tag]}18`, color:TAG_COLORS[a.tag] }}>{a.tag}</span>
              </div>
              <p className="text-slate-400 text-sm">{a.desc}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => replay(selected)}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background:"rgba(99,102,241,0.15)", color:"#a5b4fc", border:"1px solid rgba(99,102,241,0.3)" }}>
                  ↺ הפעל שוב
                </button>
                <button onClick={() => setSelected(null)} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">✕ סגור</button>
              </div>
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
}
