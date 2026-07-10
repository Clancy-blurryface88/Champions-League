import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────
// Mock data — same shape as gallery #1, self-contained on purpose
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

const withRank = (list, key) => [...list].sort((a, b) => b[key] - a[key]).map((p, i) => ({ ...p, pos: i + 1 }));
const CURRENT = withRank(RAW_PARTICIPANTS, "points");
const biggestClimber = withRank(RAW_PARTICIPANTS.map(p => ({ ...p, climb: p.points - p.prev })), "climb")[0];

const RC = ["#f59e0b", "#94a3b8", "#b45309", "#818cf8", "#ec4899", "#14b8a6", "#84cc16"];
const rankColor = (pos) => (pos === 1 ? "#FFD700" : pos === 2 ? "#C0C0C0" : pos === 3 ? "#CD7F32" : RC[(pos - 1) % RC.length]);
const medal = (pos) => (pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : null);

const Avatar = ({ p, size = 36 }) => (
  <div className="rounded-full flex items-center justify-center font-bold text-black flex-shrink-0"
    style={{ width: size, height: size, background: rankColor(p.pos), fontSize: size * 0.32 }}>
    {p.av}
  </div>
);

const Row = ({ p, i, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
    className="flex items-center gap-3 px-3 py-2 rounded-xl"
    style={{ background: p.isCurrentUser ? "rgba(96,165,250,0.12)" : "rgba(30,41,59,0.6)", border: p.isCurrentUser ? "1px solid #60A5FA" : "1px solid transparent" }}>
    <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
    <Avatar p={p} size={30} />
    <span className="flex-1 text-white text-xs font-semibold truncate">{p.name}</span>
    <span className="text-xs font-black tabular-nums" style={{ color: rankColor(p.pos) }}>{p.points}</span>
  </motion.div>
);

function NextMatchCard({ onContinue }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="rounded-2xl px-8 py-7 flex flex-col items-center gap-4 mx-auto"
      style={{ background: "rgba(8,18,32,0.95)", border: "1px solid rgba(245,197,24,0.35)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", maxWidth: 360 }}>
      <span className="text-amber-400 text-[11px] font-bold tracking-widest uppercase">המשחק הבא</span>
      <div className="flex items-center gap-6" dir="ltr">
        <div className="flex flex-col items-center gap-1 w-20"><span className="text-4xl">{NEXT_MATCH.team_a_flag}</span><span className="text-slate-400 text-[11px]">{NEXT_MATCH.team_a}</span></div>
        <span className="text-slate-500 text-xs font-bold">VS</span>
        <div className="flex flex-col items-center gap-1 w-20"><span className="text-4xl">{NEXT_MATCH.team_b_flag}</span><span className="text-slate-400 text-[11px]">{NEXT_MATCH.team_b}</span></div>
      </div>
      <span className="text-white text-sm font-bold">{NEXT_MATCH.date_label}</span>
      <button onClick={onContinue} className="mt-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide text-black"
        style={{ background: "linear-gradient(90deg,#f5c518,#fde68a)" }}>
        המשך ⌄
      </button>
    </motion.div>
  );
}

function TableShell({ children }) { return <div className="w-full max-w-md mx-auto space-y-1.5">{children}</div>; }

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
          <button onClick={() => setStage("match")} className="text-[11px] px-3 py-1.5 rounded-full border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 flex-shrink-0">
            🔄 מחדש
          </button>
        )}
      </div>
      <div className="min-h-[400px] flex items-center justify-center overflow-hidden">
        {children(stage, setStage)}
      </div>
    </div>
  );
}

const FullTable = ({ delayBase = 0, step = 0.09 }) => (
  <TableShell>{[...CURRENT].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={delayBase + i * step} />)}</TableShell>
);

// ───────────────────────── W1. גירוד חושף (Scratch card) ─────────────────────────
function W1({ stage, setStage }) {
  const [scratched, setScratched] = useState(false);
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("reveal")} />;
  return (
    <div className="relative w-full max-w-md mx-auto">
      <FullTable />
      {!scratched && (
        <motion.div
          onClick={() => setScratched(true)}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-xl cursor-pointer flex items-center justify-center"
          style={{ background: "repeating-linear-gradient(135deg,#8b93a1,#8b93a1 10px,#a2aab8 10px,#a2aab8 20px)" }}
        >
          <span className="text-slate-900 font-black text-sm bg-white/70 px-4 py-2 rounded-full">🪙 גרד כדי לגלות את הטבלה</span>
        </motion.div>
      )}
      <AnimatePresence>
        {scratched && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: "easeIn" }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ background: "repeating-linear-gradient(135deg,#8b93a1,#8b93a1 10px,#a2aab8 10px,#a2aab8 20px)" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ───────────────────────── W2. נחש מי עלה הכי הרבה ─────────────────────────
function W2({ stage, setStage }) {
  const [picked, setPicked] = useState(null);
  const choices = [CURRENT[0], CURRENT[2], CURRENT[5]];
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("quiz")} />;
  if (stage === "quiz") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-slate-300 text-sm font-bold">מי לדעתך עלה הכי הרבה נקודות השבוע?</span>
        <div className="flex gap-2">
          {choices.map(p => (
            <button key={p.id} onClick={() => { setPicked(p.id); setTimeout(() => setStage("reveal"), 1400); }}
              className="px-3 py-2 rounded-xl border text-xs font-bold"
              style={{ borderColor: picked === p.id ? "#f5c518" : "rgba(255,255,255,0.15)", background: picked === p.id ? "rgba(245,197,24,0.15)" : "rgba(30,41,59,0.6)", color: "white" }}>
              {p.name}
            </button>
          ))}
        </div>
        {picked && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px]"
            style={{ color: picked === biggestClimber.id ? "#4ade80" : "#f87171" }}>
            {picked === biggestClimber.id ? "בול! 🎯" : `לא בדיוק... זה היה ${biggestClimber.name} 👀`}
          </motion.span>
        )}
      </div>
    );
  }
  return <FullTable />;
}

// ───────────────────────── W3. טעינה עם רמזים מדורגים ─────────────────────────
const HINTS = ["בודק תוצאות אחרונות...", "מישהו עקף את המוביל הקודם...", "מחשב ניקוד סופי...", "כמעט מוכן..."];
function W3({ stage, setStage }) {
  const [hint, setHint] = useState(0);
  const handleContinue = () => {
    setStage("loading");
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      if (i >= HINTS.length) { clearInterval(iv); setStage("reveal"); }
      else setHint(i);
    }, 650);
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  if (stage === "loading") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-amber-400 animate-spin" />
        <AnimatePresence mode="wait">
          <motion.span key={hint} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="text-slate-400 text-xs">{HINTS[hint]}</motion.span>
        </AnimatePresence>
      </div>
    );
  }
  return <FullTable />;
}

// ───────────────────────── W4. מעטפות נפתחות אחת-אחת ─────────────────────────
function W4({ stage, setStage }) {
  const [openIdx, setOpenIdx] = useState(-1);
  const list = [...CURRENT].reverse();
  const handleContinue = () => {
    setStage("reveal");
    list.forEach((_, i) => setTimeout(() => setOpenIdx(i), i * 350 + 200));
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      {list.map((p, i) => (
        <div key={p.id} className="relative h-[42px]">
          <AnimatePresence mode="wait">
            {openIdx >= i ? (
              <motion.div key="open" initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.35 }}>
                <Row p={p} i={0} delay={0} />
              </motion.div>
            ) : (
              <motion.div key="closed" exit={{ opacity: 0 }} className="flex items-center gap-2 px-3 py-2 rounded-xl h-[42px]" style={{ background: "rgba(30,41,59,0.6)" }}>
                <span className="text-lg">✉️</span>
                <span className="text-slate-500 text-[11px]">מעטפה סגורה...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </TableShell>
  );
}

// ───────────────────────── W5. זרקור בחושך ─────────────────────────
function W5({ stage, setStage }) {
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("reveal")} />;
  return (
    <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden" style={{ background: "#000" }}>
      <div className="py-2"><FullTable delayBase={0} step={0} /></div>
      <motion.div
        initial={{ top: "-20%" }} animate={{ top: "110%" }} transition={{ duration: 2.2, ease: "linear" }}
        className="absolute left-0 right-0 h-24 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 100% at 50% 50%, transparent 0%, rgba(0,0,0,0.94) 70%)" }}
      />
      <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 2.2, duration: 0.4 }}
        className="absolute inset-0 pointer-events-none" style={{ background: "#000" }} />
    </div>
  );
}

// ───────────────────────── W6. חותמת סודי ביותר ─────────────────────────
function W6({ stage, setStage }) {
  const [stamped, setStamped] = useState(true);
  const handleContinue = () => { setStage("reveal"); setTimeout(() => setStamped(false), 700); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="filter" style={{ filter: stamped ? "blur(6px)" : "blur(0px)", transition: "filter 0.6s" }}>
        <FullTable delayBase={stamped ? 0 : 0.1} />
      </div>
      <AnimatePresence>
        {stamped && (
          <motion.div
            initial={{ opacity: 1, scale: 1, rotate: -14 }}
            exit={{ opacity: 0, scale: 1.6, rotate: -14, x: 200 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="px-6 py-3 border-4 rounded-lg" style={{ borderColor: "#ef4444", color: "#ef4444" }}>
              <span className="font-black text-xl tracking-widest">סודי ביותר</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ───────────────────────── W7. שער טריוויה ─────────────────────────
function W7({ stage, setStage }) {
  const [answered, setAnswered] = useState(false);
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("trivia")} />;
  if (stage === "trivia") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-slate-300 text-sm font-bold">טריוויה: כמה שערים היו בסך הכל בסבב האחרון?</span>
        <div className="flex gap-2">
          {["14", "19", "23"].map(v => (
            <button key={v} onClick={() => { setAnswered(true); setTimeout(() => setStage("reveal"), 900); }}
              className="w-14 h-10 rounded-xl border text-sm font-bold text-white" style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(30,41,59,0.6)" }}>
              {v}
            </button>
          ))}
        </div>
        {answered && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-400 text-xs">פותח את הטבלה...</motion.span>}
      </div>
    );
  }
  return <FullTable />;
}

// ───────────────────────── W8. רעד לפני מקום 1 ─────────────────────────
function W8({ stage, setStage }) {
  const [shake, setShake] = useState(false);
  const [showLeader, setShowLeader] = useState(false);
  const rest = CURRENT.filter(p => p.pos !== 1);
  const leader = CURRENT.find(p => p.pos === 1);
  const handleContinue = () => {
    setStage("reveal");
    setTimeout(() => setShake(true), rest.length * 100 + 500);
    setTimeout(() => { setShake(false); setShowLeader(true); }, rest.length * 100 + 900);
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <motion.div animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
      <TableShell>
        {[...rest].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.1} />)}
        <AnimatePresence>
          {showLeader && (
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(250,204,21,0.14)", border: "1px solid rgba(250,204,21,0.5)" }}>
              <span className="w-5 text-center font-black text-sm">🥇</span>
              <Avatar p={leader} size={30} />
              <span className="flex-1 text-white text-xs font-bold">{leader.name}</span>
              <span className="text-xs font-black tabular-nums text-yellow-400">{leader.points}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </TableShell>
    </motion.div>
  );
}

// ───────────────────────── W9. פס מתח עם טקסטים ─────────────────────────
function V9Bar({ pct }) {
  return (
    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
      <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#f5c518,#fb923c)" }}
        initial={{ width: "0%" }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
    </div>
  );
}
function W9({ stage, setStage }) {
  const [pct, setPct] = useState(0);
  const [label, setLabel] = useState("סורק תחזיות...");
  const handleContinue = () => {
    setStage("loading");
    const steps = [
      [30, "סורק תחזיות..."],
      [60, "משווה לתוצאה בפועל..."],
      [90, "מסדר את הטבלה..."],
      [100, "מוכן!"],
    ];
    steps.forEach(([p, l], i) => setTimeout(() => { setPct(p); setLabel(l); if (p === 100) setTimeout(() => setStage("reveal"), 400); }, i * 500 + 300));
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  if (stage === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
        <span className="text-slate-300 text-xs font-bold">{label}</span>
        <V9Bar pct={pct} />
        <span className="text-slate-500 text-[10px]">{pct}%</span>
      </div>
    );
  }
  return <FullTable />;
}

// ───────────────────────── W10. דו-קרב לפני הכל ─────────────────────────
function W10({ stage, setStage }) {
  const [expanded, setExpanded] = useState(false);
  const a = CURRENT[1], b = CURRENT[2];
  const total = a.points + b.points;
  const handleContinue = () => { setStage("duel"); setTimeout(() => setExpanded(true), 1800); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  if (stage === "duel" && !expanded) {
    return (
      <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
        <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">קרב על מקום {a.pos}</span>
        <div className="flex items-center gap-4 w-full justify-between">
          <div className="flex flex-col items-center gap-1"><Avatar p={a} size={40} /><span className="text-white text-[11px] font-bold">{a.name}</span></div>
          <span className="text-slate-500 font-black">VS</span>
          <div className="flex flex-col items-center gap-1"><Avatar p={b} size={40} /><span className="text-white text-[11px] font-bold">{b.name}</span></div>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
          <motion.div initial={{ width: "50%" }} animate={{ width: `${(a.points / total) * 100}%` }} transition={{ duration: 1.2 }} style={{ background: rankColor(a.pos) }} />
          <div className="flex-1" style={{ background: rankColor(b.pos) }} />
        </div>
      </div>
    );
  }
  return <FullTable />;
}

// ───────────────────────── W11. ערפל מתפזר ─────────────────────────
function W11({ stage, setStage }) {
  const [clear, setClear] = useState(false);
  const handleContinue = () => { setStage("reveal"); setTimeout(() => setClear(true), 300); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <div className="relative w-full max-w-md mx-auto">
      <FullTable />
      <AnimatePresence>
        {!clear && (
          <motion.div exit={{ opacity: 0, scale: 1.3 }} transition={{ duration: 1.1 }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ backdropFilter: "blur(14px)", background: "rgba(148,163,184,0.35)" }} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ───────────────────────── W12. מנעול שנפתח ─────────────────────────
function W12({ stage, setStage }) {
  const [unlocked, setUnlocked] = useState(false);
  const handleContinue = () => { setStage("locked"); setTimeout(() => { setUnlocked(true); setTimeout(() => setStage("reveal"), 500); }, 900); };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  if (stage === "locked") {
    return (
      <motion.div animate={unlocked ? { rotate: -25, y: -6, opacity: 0 } : { rotate: 0 }} transition={{ duration: 0.5 }} className="text-7xl">
        🔒
      </motion.div>
    );
  }
  return <FullTable />;
}

// ───────────────────────── W13. נחש את הניקוד שלך ─────────────────────────
function W13({ stage, setStage }) {
  const me = CURRENT.find(p => p.isCurrentUser);
  const [guess, setGuess] = useState(100);
  const [checked, setChecked] = useState(false);
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("guess")} />;
  if (stage === "guess") {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto text-center">
        <span className="text-slate-300 text-xs font-bold">כמה נקודות יש לך לדעתך כרגע?</span>
        <input type="range" min="0" max="200" value={guess} onChange={e => setGuess(Number(e.target.value))} className="w-full" disabled={checked} />
        <span className="text-2xl font-black text-amber-400">{guess}</span>
        {!checked ? (
          <button onClick={() => { setChecked(true); setTimeout(() => setStage("reveal"), 1400); }} className="px-4 py-1.5 rounded-full text-[11px] font-bold text-black" style={{ background: "linear-gradient(90deg,#f5c518,#fde68a)" }}>בדוק</button>
        ) : (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs">
            בפועל יש לך <b className="text-green-400">{me.points}</b> נק' — {Math.abs(guess - me.points) < 10 ? "היית קרוב מאוד! 🎯" : "לא בדיוק... 😅"}
          </motion.span>
        )}
      </div>
    );
  }
  return <FullTable />;
}

// ───────────────────────── W14. שביל עקבות בלש ─────────────────────────
function W14({ stage, setStage }) {
  const list = [...CURRENT].reverse();
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("reveal")} />;
  return (
    <div className="relative w-full max-w-md mx-auto">
      {list.map((p, i) => (
        <motion.div key={`fp-${p.id}`} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: i * 0.22, duration: 0.5 }} className="absolute right-2 text-[10px]" style={{ top: i * 44 }}>
          👣
        </motion.div>
      ))}
      <TableShell>{list.map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.22 + 0.15} />)}</TableShell>
    </div>
  );
}

// ───────────────────────── W15. הבזקי מצלמה ─────────────────────────
function W15({ stage, setStage }) {
  const list = [...CURRENT].reverse();
  const [flash, setFlash] = useState(false);
  const handleContinue = () => {
    setStage("reveal");
    list.forEach((_, i) => setTimeout(() => { setFlash(true); setTimeout(() => setFlash(false), 90); }, i * 300 + 200));
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <div className="relative w-full max-w-md mx-auto">
      <TableShell>{list.map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.3} />)}</TableShell>
      {flash && <div className="absolute inset-0 bg-white rounded-xl pointer-events-none" style={{ opacity: 0.85 }} />}
    </div>
  );
}

// ───────────────────────── W16. כרטיס תלת-ממד בריחוף ─────────────────────────
function TiltRow({ p }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 10 });
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })} style={{ perspective: 400 }}>
      <motion.div animate={{ rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: "spring", stiffness: 150, damping: 12 }}
        className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "rgba(30,41,59,0.6)", transformStyle: "preserve-3d" }}>
        <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
        <Avatar p={p} size={30} />
        <span className="flex-1 text-white text-xs font-semibold truncate">{p.name}</span>
        <span className="text-xs font-black tabular-nums" style={{ color: rankColor(p.pos) }}>{p.points}</span>
      </motion.div>
    </div>
  );
}
function W16({ stage, setStage }) {
  if (stage === "match") return <NextMatchCard onContinue={() => setStage("reveal")} />;
  return (
    <TableShell>
      {[...CURRENT].reverse().map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
          <TiltRow p={p} />
        </motion.div>
      ))}
      <p className="text-center text-slate-500 text-[10px] pt-1">רחף עם העכבר מעל שורה 👆</p>
    </TableShell>
  );
}

// ───────────────────────── W17. אימוג'י מתח מדורג ─────────────────────────
function W17({ stage, setStage }) {
  const [emojiIdx, setEmojiIdx] = useState(0);
  const emojis = ["😐", "😬", "😨", "🎉"];
  const handleContinue = () => {
    setStage("reveal");
    emojis.forEach((_, i) => setTimeout(() => setEmojiIdx(i), i * 500));
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <AnimatePresence mode="wait">
        <motion.span key={emojiIdx} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.3, opacity: 0 }} className="text-5xl">
          {emojis[emojiIdx]}
        </motion.span>
      </AnimatePresence>
      {emojiIdx === emojis.length - 1 && <FullTable />}
    </div>
  );
}

// ───────────────────────── W18. הכרזת אצטדיון ─────────────────────────
function W18({ stage, setStage }) {
  const leader = CURRENT.find(p => p.pos === 1);
  const [lettersShown, setLettersShown] = useState(0);
  const rest = CURRENT.filter(p => p.pos !== 1);
  const handleContinue = () => {
    setStage("announce");
    const iv = setInterval(() => setLettersShown(n => {
      if (n >= leader.name.length) { clearInterval(iv); setTimeout(() => setStage("reveal"), 700); return n; }
      return n + 1;
    }), 90);
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  if (stage === "announce") {
    return (
      <div className="flex flex-col items-center gap-3">
        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} className="text-amber-400 text-[11px] tracking-[0.3em] uppercase font-black">
          AND THE LEADER IS
        </motion.span>
        <span className="text-4xl font-black text-white" dir="rtl">{leader.name.slice(0, lettersShown)}<span className="animate-pulse">_</span></span>
      </div>
    );
  }
  return (
    <TableShell>
      <Row p={leader} i={0} delay={0} />
      {[...rest].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={0.2 + i * 0.08} />)}
    </TableShell>
  );
}

// ───────────────────────── W19. דופק מואץ ─────────────────────────
function W19({ stage, setStage }) {
  const [bpm, setBpm] = useState(70);
  const leader = CURRENT.find(p => p.pos === 1);
  const rest = CURRENT.filter(p => p.pos !== 1);
  const handleContinue = () => {
    setStage("reveal");
    const start = Date.now();
    const iv = setInterval(() => {
      const t = (Date.now() - start) / 1000;
      setBpm(Math.min(160, 70 + t * 45));
      if (t > 2) clearInterval(iv);
    }, 100);
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      {[...rest].reverse().map((p, i) => <Row key={p.id} p={p} i={i} delay={i * 0.08} />)}
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 60 / bpm, repeat: Infinity }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)" }}>
        <span className="text-lg">❤️</span>
        <span className="flex-1 text-slate-300 text-[11px]">{Math.round(bpm)} BPM...</span>
        {bpm >= 159 && <><Avatar p={leader} size={28} /><span className="text-white text-xs font-bold">{leader.name}</span></>}
      </motion.div>
    </TableShell>
  );
}

// ───────────────────────── W20. מנעול קומבינציה נסגר בהדרגה ─────────────────────────
function W20({ stage, setStage }) {
  const list = [...CURRENT].reverse();
  const [locked, setLocked] = useState([]);
  const handleContinue = () => {
    setStage("reveal");
    list.forEach((p, i) => setTimeout(() => setLocked(prev => [...prev, p.id]), i * 260 + 150));
  };
  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;
  return (
    <TableShell>
      {list.map((p, i) => {
        const isLocked = locked.includes(p.id);
        return (
          <motion.div key={p.id} animate={isLocked ? { scale: [1.08, 1] } : {}} transition={{ duration: 0.25 }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: isLocked ? "rgba(30,41,59,0.6)" : "rgba(30,41,59,0.3)" }}>
            <span className="w-5 text-center font-black text-sm" style={{ color: isLocked ? rankColor(p.pos) : "#475569" }}>{isLocked ? (medal(p.pos) || p.pos) : "•"}</span>
            {isLocked ? <Avatar p={p} size={30} /> : <div className="w-[30px] h-[30px] rounded-full bg-slate-700" />}
            <span className="flex-1 text-xs font-semibold truncate" style={{ color: isLocked ? "white" : "#475569" }}>{isLocked ? p.name : "מנעול נסגר..."}</span>
            {isLocked && <span className="text-xs font-black tabular-nums" style={{ color: rankColor(p.pos) }}>{p.points}</span>}
          </motion.div>
        );
      })}
    </TableShell>
  );
}

const VARIANTS = [
  { label: "גירוד חושף", sub: "מגרדים שכבת 'כרטיס פיס' כדי לחשוף את הטבלה", Comp: W1 },
  { label: "נחש מי עלה הכי הרבה", sub: "בוחרים תשובה לפני שרואים את האמת", Comp: W2 },
  { label: "טעינה עם רמזים", sub: "רמזים מתחלפים לפני שהטבלה קופצת", Comp: W3 },
  { label: "מעטפות נפתחות", sub: "כל שורה היא מעטפה שנפתחת בתורה", Comp: W4 },
  { label: "זרקור בחושך", sub: "אור נע וחושף שורה אחר שורה מתוך חושך", Comp: W5 },
  { label: "חותמת סודי ביותר", sub: "חותמת אדומה עפה הצידה וחושפת את הטבלה", Comp: W6 },
  { label: "שער טריוויה", sub: "שאלה קצרה לפני כניסה לטבלה", Comp: W7 },
  { label: "רעד לפני מקום 1", sub: "המסך 'רועד' רגע לפני חשיפת המוביל", Comp: W8 },
  { label: "פס מתח עם טקסטים", sub: "פס טעינה עם הודעות סטטוס משתנות", Comp: W9 },
  { label: "דו-קרב לפני הכל", sub: "שני מתחרים סמוכים מתמודדים קודם", Comp: W10 },
  { label: "ערפל מתפזר", sub: "שכבת ערפל דוהה וחושפת את הפרטים", Comp: W11 },
  { label: "מנעול שנפתח", sub: "אייקון מנעול נפתח לפני הכניסה לטבלה", Comp: W12 },
  { label: "נחש את הניקוד שלך", sub: "מזיזים סליידר ומשווים לניקוד האמיתי", Comp: W13 },
  { label: "שביל עקבות בלש", sub: "עקבות קטנות מובילות את העין למעלה", Comp: W14 },
  { label: "הבזקי מצלמה", sub: "פלאשים לבנים מלווים כל שורה שנחשפת", Comp: W15 },
  { label: "כרטיס 3D בריחוף", sub: "השורות מגיבות בהטיה תלת-ממדית לעכבר", Comp: W16 },
  { label: "אימוג'י מתח מדורג", sub: "הבעה שמסלימה עד לרגע החשיפה", Comp: W17 },
  { label: "הכרזת אצטדיון", sub: "השם נחשף אות-אות בסגנון ג'מבוטרון", Comp: W18 },
  { label: "דופק מואץ", sub: "מד לב שמאיץ לפני חשיפת המוביל", Comp: W19 },
  { label: "מנעול קומבינציה", sub: "כל שורה 'ננעלת' במקומה בזו אחר זו", Comp: W20 },
];

export default function AdminLeaderboardRevealGallery2() {
  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-white font-bold text-lg mb-1">20 רעיונות נוספים: דרמה ומתח בחשיפת הטבלה</h2>
        <p className="text-slate-400 text-sm">
          כל גרסה כאן בנויה סביב שער/מכניקה שמעכבת את החשיפה המלאה — לא הכל נגלה במכה אחת. לחצו "המשך" ופעלו לפי ההנחיה בכל כרטיס.
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
