import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Demo data (fixed fake match, not connected to real live data) ─────────

const TEAMS = {
  home: { name: "ריאל מדריד", code: "RM", c1: "#fbbf24", c2: "#1e293b" },
  away: { name: "מנצ'סטר סיטי", code: "MC", c1: "#38bdf8", c2: "#0c4a6e" },
};

const DEMO_PLAYERS = [
  { id: 1, name: "עידן", pts: 14, color: "#f5c518" },
  { id: 2, name: "נועה", pts: 12, color: "#38bdf8" },
  { id: 3, name: "תום", pts: 11, color: "#a78bfa" },
  { id: 4, name: "רון", pts: 9, color: "#22c55e" },
];

// Ticks a fake match forward on a loop: minute sweeps 0→90, and once per
// loop (at goalAtMs) the home team scores — drives every demo below so they
// autoplay without needing a click.
function useDemoMatch({ loopMs = 8000, goalAtMs = 4000 } = {}) {
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState({ home: 1, away: 0 });
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let fired = false;
    const id = setInterval(() => {
      setElapsed((prev) => {
        const next = (prev + 100) % loopMs;
        if (next < prev) fired = false;
        if (!fired && next >= goalAtMs) {
          fired = true;
          setScore((s) => ({ ...s, home: s.home === 1 ? 2 : 1 }));
          setFlash(true);
          setTimeout(() => setFlash(false), 1100);
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [loopMs, goalAtMs]);

  const minute = Math.min(90, Math.round((elapsed / loopMs) * 95));
  const progress = Math.min(1, elapsed / (loopMs * 0.97));
  return { minute, progress, score, flash };
}

function TeamBadge({ team, size = 40 }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${team.c1}, ${team.c2})`,
        fontWeight: 900, color: "#03101f", fontSize: size * 0.32,
        boxShadow: `0 0 10px ${team.c1}55`,
      }}
    >
      {team.code}
    </div>
  );
}

// ── Shared shell every option renders inside (same pattern as the Hall of
// Fame / menu display-option galleries) ────────────────────────────────────

function OptionCard({ n, title, tagline, approach, children }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="flex items-center justify-center rounded-full text-[11px] font-black flex-shrink-0"
              style={{ width: 22, height: 22, background: "linear-gradient(135deg,#f5c518,#fde68a)", color: "#000" }}
            >
              {n}
            </span>
            <h3 className="text-white font-bold text-sm">{title}</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">{tagline}</p>
        </div>
        <span
          className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
          style={{ background: "rgba(245,197,24,0.12)", color: "#f5c518", border: "1px solid rgba(245,197,24,0.3)" }}
        >
          {approach}
        </span>
      </div>
      <div className="rounded-xl p-4 overflow-hidden" style={{ background: "rgba(3,13,26,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
        {children}
      </div>
    </div>
  );
}

// ── 1. התפרצות שער במסך מלא ────────────────────────────────────────────────
function Option1() {
  const { score, flash } = useDemoMatch({ loopMs: 7000, goalAtMs: 3500 });
  const particles = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    angle: (i / 26) * 360 + Math.random() * 10,
    dist: 55 + Math.random() * 45,
    color: ["#f5c518", "#ef4444", "#38bdf8", "#22c55e"][i % 4],
    size: 4 + Math.random() * 4,
  })), []);

  return (
    <div className="relative flex flex-col items-center justify-center py-6" style={{ minHeight: 150 }}>
      <div className="flex items-center gap-4">
        <TeamBadge team={TEAMS.home} />
        <span className="text-white font-black text-3xl" dir="ltr">{score.home}-{score.away}</span>
        <TeamBadge team={TEAMS.away} />
      </div>
      <AnimatePresence>
        {flash && (
          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }}
              className="absolute text-[10px] font-black tracking-widest px-3 py-1 rounded-full"
              style={{ top: 4, background: "rgba(239,68,68,0.9)", color: "#fff" }}
            >
              GOAL!
            </motion.div>
            {particles.map((p, i) => (
              <motion.span
                key={i} className="absolute rounded-full" style={{ width: p.size, height: p.size, background: p.color }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: Math.cos((p.angle * Math.PI) / 180) * p.dist, y: Math.sin((p.angle * Math.PI) / 180) * p.dist, opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── 2. פס לחץ/מומנטום ───────────────────────────────────────────────────────
function Option2() {
  const [lean, setLean] = useState(0.5);
  useEffect(() => {
    const id = setInterval(() => setLean(0.15 + Math.random() * 0.7), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="py-6">
      <div className="flex items-center gap-3 justify-center mb-4">
        <TeamBadge team={TEAMS.home} />
        <span className="text-slate-500 text-xs">מומנטום</span>
        <TeamBadge team={TEAMS.away} />
      </div>
      <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="absolute inset-y-0 right-0"
          animate={{ width: `${(1 - lean) * 100}%` }} transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ background: `linear-gradient(90deg, ${TEAMS.home.c1}, transparent)`, boxShadow: `0 0 12px ${TEAMS.home.c1}` }}
        />
        <motion.div
          className="absolute inset-y-0 left-0"
          animate={{ width: `${lean * 100}%` }} transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ background: `linear-gradient(270deg, ${TEAMS.away.c1}, transparent)`, boxShadow: `0 0 12px ${TEAMS.away.c1}` }}
        />
      </div>
      <p className="text-center text-slate-500 text-[10px] mt-2">משקף מי "לוחצת" כרגע — בעיטות/קרנות/זמן בשליש האחרון</p>
    </div>
  );
}

// ── 3. לוח תוצאות פליפ (Split-Flap) ────────────────────────────────────────
function FlipDigit({ value }) {
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);
  useEffect(() => {
    if (value === display) return;
    setFlipping(true);
    const t = setTimeout(() => { setDisplay(value); setFlipping(false); }, 260);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ width: 34, height: 50, perspective: 200 }} className="relative">
      <div className="absolute inset-0 rounded-md flex items-center justify-center text-white font-black text-3xl" style={{ background: "#0f2136", border: "1px solid rgba(255,255,255,0.1)" }}>
        {display}
      </div>
      {flipping && (
        <motion.div
          className="absolute inset-0 rounded-md flex items-center justify-center text-white font-black text-3xl"
          style={{ background: "#16304a", border: "1px solid rgba(255,255,255,0.15)", transformOrigin: "center" }}
          initial={{ rotateX: 0 }} animate={{ rotateX: -180 }} transition={{ duration: 0.26 }}
        >
          {value}
        </motion.div>
      )}
    </div>
  );
}
function Option3() {
  const { score } = useDemoMatch({ loopMs: 6000, goalAtMs: 3000 });
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <TeamBadge team={TEAMS.home} />
      <FlipDigit value={score.home} />
      <span className="text-slate-500 font-black text-2xl">-</span>
      <FlipDigit value={score.away} />
      <TeamBadge team={TEAMS.away} />
    </div>
  );
}

// ── 4. רגע קלאץ' — זרקור בתוספת זמן ────────────────────────────────────────
function Option4() {
  const [clutch, setClutch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setClutch((c) => !c), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="rounded-xl p-5 flex flex-col items-center gap-2"
      animate={{
        boxShadow: clutch ? "0 0 40px rgba(245,197,24,0.5)" : "0 0 0px rgba(245,197,24,0)",
        scale: clutch ? 1.03 : 1,
        background: clutch ? "linear-gradient(160deg, rgba(245,197,24,0.14), rgba(8,18,32,0.9))" : "rgba(8,18,32,0.9)",
      }}
      transition={{ duration: 0.8 }}
    >
      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: clutch ? "#f5c518" : "#ef4444" }}>
        {clutch ? "⏱ תוספת זמן — רגעי הכרעה" : "🔴 LIVE"}
      </span>
      <div className="flex items-center gap-3">
        <TeamBadge team={TEAMS.home} />
        <span className="text-white font-black text-2xl" dir="ltr">1-1</span>
        <TeamBadge team={TEAMS.away} />
      </div>
      <motion.span
        animate={{ opacity: clutch ? [1, 0.4, 1] : 1 }} transition={{ duration: 0.9, repeat: clutch ? Infinity : 0 }}
        className="text-xs font-bold" style={{ color: clutch ? "#f5c518" : "#94a3b8" }}
      >
        {clutch ? "90+3'" : "67'"}
      </motion.span>
    </motion.div>
  );
}

// ── 5. קו הניחוש שלי חי ─────────────────────────────────────────────────────
function Option5() {
  const { score } = useDemoMatch({ loopMs: 7000, goalAtMs: 3500 });
  const myPrediction = { home: 2, away: 0 };
  const match = score.home === myPrediction.home && score.away === myPrediction.away;

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="flex items-center gap-3">
        <TeamBadge team={TEAMS.home} />
        <span className="text-white font-black text-2xl" dir="ltr">{score.home}-{score.away}</span>
        <TeamBadge team={TEAMS.away} />
      </div>
      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        animate={{ background: match ? "rgba(34,197,94,0.15)" : "rgba(148,163,184,0.1)", borderColor: match ? "rgba(34,197,94,0.4)" : "rgba(148,163,184,0.2)" }}
        style={{ border: "1px solid" }}
      >
        <span className="text-slate-400 text-[11px]">הניחוש שלי</span>
        <span className="text-white font-bold text-xs" dir="ltr">{myPrediction.home}-{myPrediction.away}</span>
        <motion.span key={String(match)} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sm">{match ? "✅" : "⏳"}</motion.span>
      </motion.div>
    </div>
  );
}

// ── 6. מיני-מגרש עם פינג אירועים ────────────────────────────────────────────
function Option6() {
  const { flash } = useDemoMatch({ loopMs: 7000, goalAtMs: 3500 });
  const [pos, setPos] = useState({ x: 100, y: 50 });
  useEffect(() => { if (flash) setPos({ x: 20 + Math.random() * 160, y: 15 + Math.random() * 70 }); }, [flash]);

  return (
    <div className="flex flex-col items-center py-4">
      <svg width="200" height="100" viewBox="0 0 200 100" className="rounded-md" style={{ background: "#0d2818", border: "1px solid rgba(255,255,255,0.08)" }}>
        <rect x="4" y="4" width="192" height="92" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <line x1="100" y1="4" x2="100" y2="96" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <circle cx="100" cy="50" r="16" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <rect x="4" y="25" width="20" height="50" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <rect x="176" y="25" width="20" height="50" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <AnimatePresence>
          {flash && (
            <motion.circle
              cx={pos.x} cy={pos.y} fill="#f5c518"
              initial={{ opacity: 1, r: 4 }}
              animate={{ opacity: [1, 1, 0], r: [4, 4, 18] }}
              transition={{ duration: 1.1 }}
            />
          )}
        </AnimatePresence>
      </svg>
      <p className="text-slate-500 text-[10px] mt-2">מיקום משוער של אירוע השער האחרון</p>
    </div>
  );
}

// ── 7. דופק על הטבעת (Heartbeat) ────────────────────────────────────────────
function Option7() {
  const { minute, progress } = useDemoMatch({ loopMs: 9000, goalAtMs: 99999 });
  const danger = minute >= 80;

  return (
    <div className="flex flex-col items-center py-6 gap-3">
      <motion.div
        className="rounded-full flex items-center justify-center"
        style={{ width: 90, height: 90, padding: 4, background: `conic-gradient(from 0deg, ${danger ? "#f5c518" : "#ef4444"} ${progress * 360}deg, rgba(255,255,255,0.08) ${progress * 360}deg 360deg)` }}
        animate={{
          scale: danger ? [1, 1.08, 1] : 1,
          boxShadow: danger ? ["0 0 10px rgba(245,197,24,0.3)", "0 0 26px rgba(245,197,24,0.6)", "0 0 10px rgba(245,197,24,0.3)"] : "0 0 14px rgba(239,68,68,0.2)",
        }}
        transition={{ duration: danger ? 0.6 : 0, repeat: danger ? Infinity : 0 }}
      >
        <div className="rounded-full w-full h-full flex items-center justify-center" style={{ background: "#081220" }}>
          <span className="text-white font-black text-lg">{minute}'</span>
        </div>
      </motion.div>
      <p className="text-[10px]" style={{ color: danger ? "#f5c518" : "#64748b" }}>{danger ? "דופק מואץ — דקות אחרונות" : "קצב רגיל"}</p>
    </div>
  );
}

// ── 8. מירוץ חי בטבלת המובילים ──────────────────────────────────────────────
function Option8() {
  const [players, setPlayers] = useState(DEMO_PLAYERS);
  useEffect(() => {
    const id = setInterval(() => {
      setPlayers((prev) => {
        const next = prev.map((p) => ({ ...p }));
        const i = Math.floor(Math.random() * next.length);
        next[i].pts += 3;
        return next.sort((a, b) => b.pts - a.pts);
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-2 py-2">
      <AnimatePresence initial={false}>
        {players.map((p, idx) => (
          <motion.div
            layout key={p.id} transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <span className="text-slate-500 font-bold text-xs w-4">{idx + 1}</span>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ background: p.color, color: "#03101f" }}>{p.name[0]}</span>
            <span className="text-slate-200 text-xs flex-1">{p.name}</span>
            <span className="text-white font-bold text-xs" dir="ltr">{p.pts}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── 9. אקוולייזר רעש קהל ────────────────────────────────────────────────────
function Option9() {
  const { flash } = useDemoMatch({ loopMs: 7000, goalAtMs: 3500 });
  const bars = useMemo(() => Array.from({ length: 14 }), []);

  return (
    <div className="flex flex-col items-center py-6 gap-3">
      <div className="flex items-end gap-1 h-14">
        {bars.map((_, i) => (
          <motion.div
            key={i} className="w-1.5 rounded-full" style={{ background: flash ? "#ef4444" : "#38bdf8" }}
            animate={{ height: flash ? [10, 40 + Math.random() * 16, 14] : [8, 20 + Math.random() * 10, 8] }}
            transition={{ duration: flash ? 0.6 : 1.2 + Math.random() * 0.6, repeat: Infinity, repeatType: "mirror", delay: i * 0.05 }}
          />
        ))}
      </div>
      <p className="text-[10px]" style={{ color: flash ? "#ef4444" : "#64748b" }}>{flash ? "🔊 רעש קהל — שער!" : "רעש קהל רגיל"}</p>
    </div>
  );
}

// ── 10. זום דרמטי ברגע מפתח ─────────────────────────────────────────────────
function Option10() {
  const { score, flash } = useDemoMatch({ loopMs: 8000, goalAtMs: 4000 });

  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        className="flex items-center gap-3 rounded-xl px-5 py-3"
        animate={{ scale: flash ? 1.12 : 1, boxShadow: flash ? "0 0 40px rgba(245,197,24,0.5)" : "0 0 0px rgba(0,0,0,0)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ background: "rgba(8,18,32,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <TeamBadge team={TEAMS.home} />
        <span className="text-white font-black text-2xl" dir="ltr">{score.home}-{score.away}</span>
        <TeamBadge team={TEAMS.away} />
      </motion.div>
    </div>
  );
}

const OPTIONS = [
  { n: 1, title: "התפרצות שער במסך מלא", tagline: "כשמבקעים שער, פרץ קונפטי/זיקוקים בצבעי הקבוצה לכמה שניות ואז חוזרים לתצוגה הרגילה.", approach: "צלילה מלאה", Comp: Option1 },
  { n: 2, title: "פס לחץ/מומנטום", tagline: "פס אופקי שזז ונדלק לכיוון הקבוצה שכרגע 'לוחצת' יותר, עם זוהר פועם.", approach: "אינדיקטור חי", Comp: Option2 },
  { n: 3, title: "לוח תוצאות פליפ (Split-Flap)", tagline: "במקום אודומטר מתגלגל — ספרות שמתהפכות כמו לוח תוצאות שדה תעופה קלאסי.", approach: "אנימציית ספרות", Comp: Option3 },
  { n: 4, title: "רגע קלאץ' בתוספת זמן", tagline: "בדקות האחרונות/תוספת זמן הכרטיס עצמו זוהר בזהב ופועם — מעביר מתח בלי טקסט.", approach: "מצב דרמטי", Comp: Option4 },
  { n: 5, title: "קו הניחוש שלי חי", tagline: "התחזית האישית מוצגת ליד התוצאה החיה, עם וי/שעון שמתעדכן ברגע שהתוצאה תואמת.", approach: "אישי", Comp: Option5 },
  { n: 6, title: "מיני-מגרש עם פינג אירועים", tagline: "איור מגרש זעיר עם נקודה מהבהבת במיקום המשוער של האירוע האחרון (שער).", approach: "ויזואליזציה", Comp: Option6 },
  { n: 7, title: "דופק על הטבעת", tagline: "הטבעת עצמה פועמת מהר יותר ככל שהמשחק נכנס לדקות המתוחות (80'+).", approach: "עדין/תת-מודע", Comp: Option7 },
  { n: 8, title: "מירוץ חי בטבלת המובילים", tagline: "אווטארים של חברים קופצים מקום בזמן אמת עם אנימציית מעקף, כמו מסלול מרוץ.", approach: "חברתי", Comp: Option8 },
  { n: 9, title: "אקוולייזר רעש קהל", tagline: "פסי אקוולייזר פועמים סביב הכרטיס, מתפרצים בעוצמה ברגע שער.", approach: "אווירה", Comp: Option9 },
  { n: 10, title: "זום דרמטי ברגע מפתח", tagline: "הכרטיס 'מתקרב' עם זוהר לכמה שניות בכל אירוע גדול, ואז חוזר לגודל רגיל.", approach: "תשומת לב", Comp: Option10 },
];

export default function AdminLiveMatchDisplayOptions() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">10 רעיונות לתצוגת משחק חי</h2>
        <p className="text-slate-400 text-sm">
          גלריית דמו בלבד — כל האפשרויות רצות אוטומטית על נתוני משחק פיקטיביים (ריאל מדריד נגד מנצ'סטר סיטי) כדי להדגים את התחושה.
          שום דבר כאן לא מחובר למשחקים החיים האמיתיים ולא הוחלף בתצוגה הקיימת ב-{"Layout.jsx"} — זו רק בחירת כיוון.
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {OPTIONS.map((opt) => (
          <OptionCard key={opt.n} n={opt.n} title={opt.title} tagline={opt.tagline} approach={opt.approach}>
            <opt.Comp />
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
