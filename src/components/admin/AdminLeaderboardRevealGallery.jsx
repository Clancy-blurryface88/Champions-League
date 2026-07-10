import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreCounter from "../ScoreCounter";

// ─────────────────────────────────────────────────────────────────
// Mock data — no API calls, purely for visual comparison in Admin
// ─────────────────────────────────────────────────────────────────
const NEXT_MATCH = {
  team_a: "ברזיל", team_a_flag: "🇧🇷",
  team_b: "ארגנטינה", team_b_flag: "🇦🇷",
  date_label: "יום חמישי · 21:00",
};

const RAW_PARTICIPANTS = [
  { id: 1, name: "אלון כהן",   av: "AK", points: 187.5, prev: 165.5 },
  { id: 2, name: "מיכל לוי",   av: "ML", points: 162.0, prev: 162.0 },
  { id: 3, name: "יוסי דוד",   av: "YD", points: 148.5, prev: 121.0, isCurrentUser: true },
  { id: 4, name: "רונית שמיר", av: "RS", points: 134.0, prev: 134.0 },
  { id: 5, name: "דני פרידמן", av: "DF", points: 121.5, prev: 145.0 },
  { id: 6, name: "שרה גולן",   av: "SG", points: 109.0, prev: 96.5 },
  { id: 7, name: "עמי רוזן",   av: "ER", points: 97.5,  prev: 97.5 },
];
const PREVIOUS_LEADER_ID = 5; // דני היה מוביל לפני הסבב — עכשיו אלון עקף אותו

const withRank = (list, key) =>
  [...list].sort((a, b) => b[key] - a[key]).map((p, i) => ({ ...p, pos: i + 1 }));

const CURRENT = withRank(RAW_PARTICIPANTS, "points");
const PREVIOUS_POS = Object.fromEntries(withRank(RAW_PARTICIPANTS, "prev").map(p => [p.id, p.pos]));
const MAX_PTS = CURRENT[0].points;

const RC = ["#f59e0b", "#94a3b8", "#b45309", "#818cf8", "#ec4899", "#14b8a6", "#84cc16"];
const rankColor = (pos) => (pos === 1 ? "#FFD700" : pos === 2 ? "#C0C0C0" : pos === 3 ? "#CD7F32" : RC[(pos - 1) % RC.length]);
const medal = (pos) => (pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : null);

const Avatar = ({ p, size = 36 }) => (
  <div
    className="rounded-full flex items-center justify-center font-bold text-black flex-shrink-0"
    style={{ width: size, height: size, background: rankColor(p.pos), fontSize: size * 0.32 }}
  >
    {p.av}
  </div>
);

const Row = ({ p, i, delay = 0, showArrow = false, tone = "rgba(30,41,59,0.6)" }) => {
  const prevPos = PREVIOUS_POS[p.id];
  const diff = prevPos - p.pos;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 px-3 py-2 rounded-xl"
      style={{ background: p.isCurrentUser ? "rgba(96,165,250,0.12)" : tone, border: p.isCurrentUser ? "1px solid #60A5FA" : "1px solid transparent" }}
    >
      <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
      <Avatar p={p} size={30} />
      <span className="flex-1 text-white text-xs font-semibold truncate">{p.name}</span>
      {showArrow && diff !== 0 && (
        <span className={`text-[10px] font-bold ${diff > 0 ? "text-green-400" : "text-red-400"}`}>
          {diff > 0 ? `▲${diff}` : `▼${Math.abs(diff)}`}
        </span>
      )}
      <span className="text-xs font-black tabular-nums" style={{ color: rankColor(p.pos) }}>{p.points}</span>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Shared "next match" entry card — identical everywhere so the
// comparison is only about what happens AFTER it
// ─────────────────────────────────────────────────────────────────
function NextMatchCard({ onContinue, morphing }) {
  return (
    <motion.div
      layout={morphing}
      layoutId={morphing ? "morph-card" : undefined}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="rounded-2xl px-8 py-7 flex flex-col items-center gap-4 mx-auto"
      style={{ background: "rgba(8,18,32,0.95)", border: "1px solid rgba(245,197,24,0.35)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", maxWidth: 360 }}
    >
      <span className="text-amber-400 text-[11px] font-bold tracking-widest uppercase">המשחק הבא</span>
      <div className="flex items-center gap-6" dir="ltr">
        <div className="flex flex-col items-center gap-1 w-20">
          <span className="text-4xl">{NEXT_MATCH.team_a_flag}</span>
          <span className="text-slate-400 text-[11px]">{NEXT_MATCH.team_a}</span>
        </div>
        <span className="text-slate-500 text-xs font-bold">VS</span>
        <div className="flex flex-col items-center gap-1 w-20">
          <span className="text-4xl">{NEXT_MATCH.team_b_flag}</span>
          <span className="text-slate-400 text-[11px]">{NEXT_MATCH.team_b}</span>
        </div>
      </div>
      <span className="text-white text-sm font-bold">{NEXT_MATCH.date_label}</span>
      <button
        onClick={onContinue}
        className="mt-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide text-black"
        style={{ background: "linear-gradient(90deg,#f5c518,#fde68a)" }}
      >
        המשך ⌄
      </button>
    </motion.div>
  );
}

function TableShell({ children }) {
  return <div className="w-full max-w-md mx-auto space-y-1.5">{children}</div>;
}

function Frame({ id, title, subtitle, children }) {
  const [stage, setStage] = useState("match");
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-sm">{id}. {title}</h3>
          <p className="text-slate-500 text-[11px]">{subtitle}</p>
        </div>
        {stage !== "match" && (
          <button
            onClick={() => setStage("match")}
            className="text-[11px] px-3 py-1.5 rounded-full border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 flex-shrink-0"
          >
            🔄 מחדש
          </button>
        )}
      </div>
      <div className="min-h-[400px] flex items-center justify-center">
        {children(stage, setStage)}
      </div>
    </div>
  );
}

// ───────────────────────── 1. המשך אורגני ─────────────────────────
function V1({ stage, setStage }) {
  if (stage === "match") return <NextMatchCard morphing onContinue={() => setStage("reveal")} />;
  return (
    <motion.div layout layoutId="morph-card" className="rounded-2xl px-5 py-5 w-full max-w-md mx-auto"
      style={{ background: "rgba(8,18,32,0.95)", border: "1px solid rgba(245,197,24,0.35)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
      <div className="text-center mb-3"><span className="text-amber-400 text-[11px] font-bold tracking-widest uppercase">טבלת משתתפים</span></div>
      <div className="space-y-1.5">
        {[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.09} />)}
      </div>
    </motion.div>
  );
}

// ───────────────────────── 2. פוקוס אישי קודם ─────────────────────────
function V2({ stage, setStage }) {
  const me = CURRENT.find(p => p.isCurrentUser);
  const [expanded, setExpanded] = useState(false);
  const handleContinue = () => { setStage("reveal"); setTimeout(() => setExpanded(true), 1200); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      <AnimatePresence>
        {!expanded && (
          <motion.div key="spotlight" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center gap-2 py-10">
            <span className="text-slate-400 text-xs">איפה אתה עומד?</span>
            <span className="text-7xl font-black" style={{ color: rankColor(me.pos), textShadow: `0 0 40px ${rankColor(me.pos)}88` }}>#{me.pos}</span>
            <span className="text-white font-bold">{me.name}</span>
            <span className="text-amber-400 font-black text-lg">{me.points} נק'</span>
          </motion.div>
        )}
      </AnimatePresence>
      {expanded && [...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={p.isCurrentUser ? 0 : i * 0.06} />)}
    </TableShell>
  );
}

// ───────────────────────── 3. פודיום קודם ─────────────────────────
function V3({ stage, setStage }) {
  const [showRest, setShowRest] = useState(false);
  const top3 = CURRENT.filter(p => p.pos <= 3);
  const rest = CURRENT.filter(p => p.pos > 3);
  const handleContinue = () => { setStage("reveal"); setTimeout(() => setShowRest(true), 1400); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  const order = [2, 1, 3]; // silver, gold, bronze layout
  return (
    <TableShell>
      <div className="flex items-end justify-center gap-3 mb-4">
        {order.map((pos, i) => {
          const p = top3.find(t => t.pos === pos);
          const h = pos === 1 ? 96 : pos === 2 ? 76 : 60;
          return (
            <motion.div key={pos} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center gap-1">
              <Avatar p={p} size={34} />
              <span className="text-white text-[11px] font-bold truncate max-w-[64px]">{p.name}</span>
              <div className="w-16 rounded-t-lg flex items-start justify-center pt-1" style={{ height: h, background: `linear-gradient(180deg,${rankColor(pos)}55,${rankColor(pos)}15)`, border: `1px solid ${rankColor(pos)}55` }}>
                <span className="font-black text-lg" style={{ color: rankColor(pos) }}>{medal(pos)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      {showRest && <div className="space-y-1.5">{[...rest].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.08} />)}</div>}
    </TableShell>
  );
}

// ───────────────────────── 4. חצי שינוי דירוג ─────────────────────────
function V4({ stage, setStage }) {
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("reveal")} />;
  return <TableShell>{[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.1} showArrow />)}</TableShell>;
}

// ───────────────────────── 5. מונה דלתא ─────────────────────────
function V5({ stage, setStage }) {
  const [reveal, setReveal] = useState(false);
  const handleContinue = () => { setStage("reveal"); setTimeout(() => setReveal(true), 300); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      {[...CURRENT].reverse().map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
          className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: p.isCurrentUser ? "rgba(96,165,250,0.12)" : "rgba(30,41,59,0.6)" }}>
          <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
          <Avatar p={p} size={30} />
          <span className="flex-1 text-white text-xs font-semibold truncate">{p.name}</span>
          <span className="text-xs font-black tabular-nums w-12 text-left" style={{ color: rankColor(p.pos) }}>
            <ScoreCounter value={reveal ? p.points : p.prev} duration={1.2} delay={i * 0.12} showDecimals />
          </span>
        </motion.div>
      ))}
    </TableShell>
  );
}

// ───────────────────────── 6. מתח למקום 1 ─────────────────────────
function V6({ stage, setStage }) {
  const [revealed, setRevealed] = useState(false);
  const rest = CURRENT.filter(p => p.pos !== 1);
  const leader = CURRENT.find(p => p.pos === 1);
  const handleContinue = () => { setStage("reveal"); setTimeout(() => setRevealed(true), rest.length * 90 + 900); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(250,204,21,0.10)", border: "1px solid rgba(250,204,21,0.4)" }}>
        <span className="w-5 text-center font-black text-sm">🥇</span>
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div key="mystery" exit={{ opacity: 0 }} className="flex items-center gap-3 flex-1">
              <div className="w-[30px] h-[30px] rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-black animate-pulse">?</div>
              <span className="flex-1 text-slate-400 text-xs font-semibold tracking-widest uppercase animate-pulse">מי בראש הפעם...</span>
            </motion.div>
          ) : (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 flex-1">
              <Avatar p={leader} size={30} />
              <span className="flex-1 text-white text-xs font-bold truncate">{leader.name}</span>
              <span className="text-xs font-black tabular-nums text-yellow-400">{leader.points}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {[...rest].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.09} />)}
    </TableShell>
  );
}

// ───────────────────────── 7. חגיגת מוביל חדש ─────────────────────────
function V7({ stage, setStage }) {
  const [burst, setBurst] = useState(false);
  const leader = CURRENT.find(p => p.pos === 1);
  const leaderChanged = leader.id !== PREVIOUS_LEADER_ID;
  const handleContinue = () => { setStage("reveal"); setTimeout(() => setBurst(true), CURRENT.length * 90 + 400); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      <div className="relative">
        {burst && leaderChanged && (
          <motion.div initial={{ opacity: 0.9, scale: 0.6 }} animate={{ opacity: 0, scale: 1.6 }} transition={{ duration: 1.1 }}
            className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: "radial-gradient(circle,rgba(255,215,0,0.55),transparent 70%)" }} />
        )}
        {burst && leaderChanged && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-2">
            <span className="text-amber-300 text-xs font-black">👑 מוביל חדש: {leader.name}!</span>
          </motion.div>
        )}
        <div className="space-y-1.5">{[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.09} />)}</div>
      </div>
    </TableShell>
  );
}

// ───────────────────────── 8. גלילה קולנועית ─────────────────────────
function V8({ stage, setStage }) {
  const containerRef = useRef(null);
  const handleContinue = () => {
    setStage("reveal");
    setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      setTimeout(() => el.scrollTo({ top: 0, behavior: "smooth" }), 1400);
    }, 200);
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <div ref={containerRef} className="w-full max-w-md mx-auto space-y-1.5 max-h-[300px] overflow-y-auto scrollbar-hide">
      {[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.05} />)}
    </div>
  );
}

// ───────────────────────── 9. הימור על המשחק הבא ─────────────────────────
function V9({ stage, setStage }) {
  const [showTable, setShowTable] = useState(false);
  const me = CURRENT.find(p => p.isCurrentUser);
  const potential = 5; // ניקוד מקסימלי אפשרי על ניחוש תוצאה מדויקת
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("reveal")} />;
  return (
    <TableShell>
      {!showTable ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="text-slate-400 text-xs">אם תנחש נכון את התוצאה הבאה...</span>
          <span className="text-4xl font-black text-green-400">+{potential} נק'</span>
          <span className="text-slate-400 text-xs">אתה כרגע ב-<b className="text-white">#{me.pos}</b> עם {me.points} נק'</span>
          <button onClick={() => setShowTable(true)} className="mt-1 px-4 py-1.5 rounded-full text-[11px] font-bold text-black" style={{ background: "linear-gradient(90deg,#f5c518,#fde68a)" }}>
            הצג טבלה מלאה
          </button>
        </div>
      ) : (
        [...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.08} />)
      )}
    </TableShell>
  );
}

// ───────────────────────── 10. רץ חם ─────────────────────────
const HOT_IDS = new Set([1, 3, 6]); // עלו ברצף בסבבים אחרונים
function V10({ stage, setStage }) {
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("reveal")} />;
  return (
    <TableShell>
      {[...CURRENT].reverse().map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }}
          className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "rgba(30,41,59,0.6)" }}>
          <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
          <Avatar p={p} size={30} />
          <span className="flex-1 text-white text-xs font-semibold truncate flex items-center gap-1">
            {p.name}
            {HOT_IDS.has(p.id) && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.09 + 0.3, type: "spring" }} className="text-[10px]">🔥</motion.span>
            )}
          </span>
          <span className="text-xs font-black tabular-nums" style={{ color: rankColor(p.pos) }}>{p.points}</span>
        </motion.div>
      ))}
    </TableShell>
  );
}

// ───────────────────────── 11. היפוך קלף פיזי ─────────────────────────
function V11({ stage, setStage }) {
  const flipped = stage === "reveal";
  return (
    <div style={{ perspective: 1200 }} className="w-full max-w-md mx-auto">
      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", position: "relative" }}>
        <div style={{ backfaceVisibility: "hidden" }}>
          <NextMatchCard onContinue={() => setStage("reveal")} />
        </div>
        <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }}
          className="rounded-2xl px-5 py-5" >
          {flipped && (
            <div className="rounded-2xl px-5 py-5" style={{ background: "rgba(8,18,32,0.95)", border: "1px solid rgba(245,197,24,0.35)" }}>
              <div className="text-center mb-3"><span className="text-amber-400 text-[11px] font-bold tracking-widest uppercase">טבלת משתתפים</span></div>
              <div className="space-y-1.5">{[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={0.9 + i * 0.07} />)}</div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ───────────────────────── 12. קו סריקה ─────────────────────────
function V12({ stage, setStage }) {
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("reveal")} />;
  return (
    <div className="relative w-full max-w-md mx-auto">
      <TableShell>{[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={0} delay={0} />)}</TableShell>
      <motion.div
        initial={{ top: "0%" }} animate={{ top: "100%" }} transition={{ duration: 1.3, ease: "easeInOut" }}
        className="absolute left-0 right-0 h-0.5 pointer-events-none"
        style={{ background: "linear-gradient(90deg,transparent,#22d3ee,transparent)", boxShadow: "0 0 20px 4px rgba(34,211,238,0.6)" }}
      />
    </div>
  );
}

// ───────────────────────── 13. מכונת מזל ─────────────────────────
function SlotNumber({ final, spinning }) {
  const [display, setDisplay] = useState(final);
  useEffect(() => {
    if (!spinning) { setDisplay(final); return; }
    const iv = setInterval(() => setDisplay(Math.floor(Math.random() * 200)), 60);
    const stop = setTimeout(() => { clearInterval(iv); setDisplay(final); }, 700);
    return () => { clearInterval(iv); clearTimeout(stop); };
  }, [spinning, final]);
  return <span className="tabular-nums">{display}</span>;
}
function V13({ stage, setStage }) {
  const [spinning, setSpinning] = useState(false);
  const handleContinue = () => { setStage("reveal"); setSpinning(true); setTimeout(() => setSpinning(false), 750); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      {[...CURRENT].reverse().map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
          className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "rgba(30,41,59,0.6)" }}>
          <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}><SlotNumber final={p.pos} spinning={spinning} /></span>
          <Avatar p={p} size={30} />
          <span className="flex-1 text-white text-xs font-semibold truncate">{p.name}</span>
          <span className="text-xs font-black tabular-nums" style={{ color: rankColor(p.pos) }}>{p.points}</span>
        </motion.div>
      ))}
    </TableShell>
  );
}

// ───────────────────────── 14. ספירה לאחור ─────────────────────────
function V14({ stage, setStage }) {
  const [count, setCount] = useState(null);
  const handleContinue = () => {
    setStage("counting");
    setCount(3);
    let n = 3;
    const iv = setInterval(() => {
      n -= 1;
      if (n === 0) { clearInterval(iv); setStage("reveal"); }
      else setCount(n);
    }, 500);
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  if (stage === "counting") {
    return (
      <AnimatePresence mode="wait">
        <motion.span key={count} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.4 }} className="text-8xl font-black text-amber-400">{count}</motion.span>
      </AnimatePresence>
    );
  }
  return <TableShell>{[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.06} />)}</TableShell>;
}

// ───────────────────────── 15. החלקת קלפים בערימה ─────────────────────────
function V15({ stage, setStage }) {
  const [dragX, setDragX] = useState(0);
  const flying = stage === "reveal";
  return (
    <div className="relative w-full max-w-md mx-auto min-h-[380px]">
      <div className="absolute inset-x-0 top-0">
        <TableShell>{[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={flying ? i * 0.05 : 0} />)}</TableShell>
      </div>
      {!flying && (
        <motion.div
          className="absolute inset-x-0 top-0 cursor-grab active:cursor-grabbing"
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
          onDrag={(e, info) => setDragX(info.offset.x)}
          onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 100) setStage("reveal"); }}
        >
          <NextMatchCard onContinue={() => setStage("reveal")} />
          <p className="text-center text-slate-500 text-[10px] mt-2">← החלק את הכרטיס הצידה →</p>
        </motion.div>
      )}
    </div>
  );
}

// ───────────────────────── 16. זיקוקים אישיים ─────────────────────────
function V16({ stage, setStage }) {
  const [burst, setBurst] = useState(false);
  const me = CURRENT.find(p => p.isCurrentUser);
  const inTop3 = me.pos <= 3;
  const handleContinue = () => { setStage("reveal"); if (inTop3) setTimeout(() => setBurst(true), CURRENT.length * 80 + 300); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      <div className="relative">
        {burst && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span key={i} initial={{ opacity: 1, x: 0, y: 0 }}
                animate={{ opacity: 0, x: Math.cos((i / 14) * Math.PI * 2) * 90, y: Math.sin((i / 14) * Math.PI * 2) * 90 }}
                transition={{ duration: 0.9 }} className="absolute text-lg">🎉</motion.span>
            ))}
          </div>
        )}
        {[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.08} />)}
        {burst && <p className="text-center text-amber-300 text-[11px] font-bold mt-2">נכנסת לשלושת המקומות הראשונים! 🏆</p>}
      </div>
    </TableShell>
  );
}

// ───────────────────────── 17. טיקר עליון ─────────────────────────
function V17({ stage, setStage }) {
  const [expanded, setExpanded] = useState(false);
  const top3 = CURRENT.filter(p => p.pos <= 3);
  const handleContinue = () => { setStage("reveal"); setTimeout(() => setExpanded(true), 1600); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      {!expanded ? (
        <div className="overflow-hidden rounded-full border border-amber-400/30 py-2" style={{ background: "rgba(245,197,24,0.06)" }}>
          <motion.div className="flex gap-8 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
            {[...top3, ...top3].map((p, i) => (
              <span key={i} className="text-xs font-bold flex items-center gap-2 px-2" style={{ color: rankColor(p.pos) }}>
                {medal(p.pos)} {p.name} · {p.points}
              </span>
            ))}
          </motion.div>
        </div>
      ) : (
        [...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.07} />)
      )}
    </TableShell>
  );
}

// ───────────────────────── 18. פיתוח כמו תצלום ─────────────────────────
function V18({ stage, setStage }) {
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("reveal")} />;
  return (
    <TableShell>
      {[...CURRENT].reverse().map((p, i) => (
        <motion.div key={p.id} initial={{ filter: "blur(10px) grayscale(1)", opacity: 0.3 }} animate={{ filter: "blur(0px) grayscale(0)", opacity: 1 }}
          transition={{ delay: i * 0.15, duration: 0.9 }} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "rgba(30,41,59,0.6)" }}>
          <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
          <Avatar p={p} size={30} />
          <span className="flex-1 text-white text-xs font-semibold truncate">{p.name}</span>
          <span className="text-xs font-black tabular-nums" style={{ color: rankColor(p.pos) }}>{p.points}</span>
        </motion.div>
      ))}
    </TableShell>
  );
}

// ───────────────────────── 19. וילון נפתח ─────────────────────────
function V19({ stage, setStage }) {
  const open = stage === "reveal";
  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-2xl min-h-[380px]">
      <div className="absolute inset-0 pt-2"><TableShell>{[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={open ? 0.6 + i * 0.05 : 0} />)}</TableShell></div>
      <motion.div animate={{ x: open ? "-100%" : "0%" }} transition={{ duration: 0.7, ease: "easeInOut" }}
        className="absolute inset-y-0 left-0 w-1/2" style={{ background: "linear-gradient(135deg,#0b1930,#08121f)", borderRight: "1px solid rgba(245,197,24,0.3)" }} />
      <motion.div animate={{ x: open ? "100%" : "0%" }} transition={{ duration: 0.7, ease: "easeInOut" }}
        className="absolute inset-y-0 right-0 w-1/2" style={{ background: "linear-gradient(225deg,#0b1930,#08121f)", borderLeft: "1px solid rgba(245,197,24,0.3)" }} />
      {!open && (
        <div className="absolute inset-0 flex items-center justify-center">
          <NextMatchCard onContinue={() => setStage("reveal")} />
        </div>
      )}
    </div>
  );
}

// ───────────────────────── 20. מירוץ עמודות ─────────────────────────
function V20({ stage, setStage }) {
  const [grown, setGrown] = useState(false);
  const handleContinue = () => { setStage("reveal"); setTimeout(() => setGrown(true), 200); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      {[...CURRENT].map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
          className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "rgba(30,41,59,0.6)" }}>
          <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
          <Avatar p={p} size={26} />
          <span className="text-white text-xs font-semibold truncate w-16">{p.name}</span>
          <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: grown ? `${(p.points / MAX_PTS) * 100}%` : 0 }} transition={{ delay: i * 0.08, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full" style={{ background: rankColor(p.pos) }} />
          </div>
          <span className="text-xs font-black tabular-nums w-10 text-left" style={{ color: rankColor(p.pos) }}>{p.points}</span>
        </motion.div>
      ))}
    </TableShell>
  );
}

const VARIANTS = [
  { label: "המשך אורגני", sub: "אותו כרטיס נפתח ומתרחב לטבלה", Comp: V1 },
  { label: "פוקוס אישי קודם", sub: "קודם המקום שלך, ואז נפתחת כל הרשימה", Comp: V2 },
  { label: "פודיום קודם", sub: "שלושת הראשונים על בימה, ואז שאר הרשימה", Comp: V3 },
  { label: "חצי שינוי דירוג", sub: "▲▼ ליד כל שם לפי הביקור הקודם", Comp: V4 },
  { label: "מונה דלתא", sub: "הניקוד קופץ מהערך הקודם לחדש", Comp: V5 },
  { label: "מתח למקום 1", sub: "כולם נחשפים, המוביל נשאר '?' עד הסוף", Comp: V6 },
  { label: "חגיגת מוביל חדש", sub: "פלאש זהב כשהראשון בטבלה השתנה", Comp: V7 },
  { label: "גלילה קולנועית", sub: "גלילה אוטומטית מהתחתית ובחזרה למעלה", Comp: V8 },
  { label: "הימור על המשחק הבא", sub: "כמה נקודות תרוויח אם תנחש נכון", Comp: V9 },
  { label: "רץ חם", sub: "🔥 ליד שחקנים שעולים ברצף", Comp: V10 },
  { label: "היפוך קלף פיזי", sub: "הכרטיס כולו מסתובב בתלת-ממד", Comp: V11 },
  { label: "קו סריקה", sub: "קו אור סורק את הרשימה מלמעלה למטה", Comp: V12 },
  { label: "מכונת מזל", sub: "מספרי הדירוג 'מסתובבים' לפני שנעצרים", Comp: V13 },
  { label: "ספירה לאחור", sub: "3־2־1 לפני שהטבלה מופיעה", Comp: V14 },
  { label: "החלקת קלפים", sub: "מחליקים את כרטיס המשחק הצידה כדי לגלות טבלה", Comp: V15 },
  { label: "זיקוקים אישיים", sub: "חגיגה מיוחדת רק כשאתה נכנס לטופ 3", Comp: V16 },
  { label: "טיקר עליון", sub: "רצועת טופ 3 נעה, ואז נפתחת לרשימה מלאה", Comp: V17 },
  { label: "פיתוח כמו תצלום", sub: "השורות עוברות מטושטש/אפור לצבע חד", Comp: V18 },
  { label: "וילון נפתח", sub: "שני פאנלים נפתחים לצדדים וחושפים את הטבלה", Comp: V19 },
  { label: "מירוץ עמודות", sub: "פסי ניקוד גדלים כמו מד התקדמות לכל שחקן", Comp: V20 },
];

export default function AdminLeaderboardRevealGallery() {
  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-white font-bold text-lg mb-1">20 רעיונות: מ"משחק הבא" לטבלת משתתפים</h2>
        <p className="text-slate-400 text-sm">
          לחצו "המשך" בכל כרטיס כדי לראות את החשיפה, ו"🔄 מחדש" כדי לחזור. כל הנתונים כאן הם דמה (mock) לצורך השוואה בלבד.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {VARIANTS.map(({ label, sub, Comp }, idx) => (
          <Frame key={idx} id={idx + 1} title={label} subtitle={sub}>
            {(stage, setStage) => <Comp stage={stage} setStage={setStage} />}
          </Frame>
        ))}
      </div>
    </div>
  );
}
