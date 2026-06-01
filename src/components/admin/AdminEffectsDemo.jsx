import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// #5 — Slot Machine Result Reveal
// ─────────────────────────────────────────────────────────────────────────────
const DIGITS = ["0","1","2","3","4","5","6","7","8","9"];

function SlotDigit({ targetDigit, spinning, delay = 0 }) {
  const [offset, setOffset] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!spinning) { setOffset(0); setDone(false); return; }
    setDone(false);
    const target = parseInt(targetDigit);
    // spin extra rounds then land on target
    const totalStops = 30 + target;
    let current = 0;
    let speed = 40;
    const run = () => {
      current++;
      setOffset(current % 10);
      if (current < totalStops - 5) speed = Math.max(40, speed * 0.97);
      else speed = Math.min(speed * 1.15, 200);
      if (current >= totalStops) { setOffset(target); setDone(true); return; }
      setTimeout(run, speed);
    };
    const t = setTimeout(run, delay);
    return () => clearTimeout(t);
  }, [spinning, targetDigit, delay]);

  return (
    <div className="relative overflow-hidden w-10 h-14 rounded-lg flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #0f172a, #1e293b)", border: "1px solid #334155", boxShadow: done ? "0 0 12px rgba(34,197,94,0.6)" : "none", transition: "box-shadow 0.3s" }}>
      <span className="text-2xl font-black text-white tabular-nums" style={{ textShadow: done ? "0 0 10px #4ade80" : "none", transition: "text-shadow 0.3s" }}>
        {offset}
      </span>
      {/* scanline sheen */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)" }} />
    </div>
  );
}

function SlotMachineDemo() {
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [homeGoal, setHomeGoal] = useState("2");
  const [awayGoal, setAwayGoal] = useState("1");
  const scenarios = [["2","1"],["0","0"],["3","2"],["1","3"],["4","0"]];
  const [scenarioIdx, setScenarioIdx] = useState(0);

  const reveal = () => {
    if (spinning) return;
    const next = (scenarioIdx + 1) % scenarios.length;
    setScenarioIdx(next);
    setHomeGoal(scenarios[next][0]);
    setAwayGoal(scenarios[next][1]);
    setSpinning(true);
    setRevealed(false);
    setTimeout(() => { setSpinning(false); setRevealed(true); }, 3200);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* match card */}
      <div className="w-full max-w-sm rounded-2xl p-5 flex flex-col items-center gap-4"
        style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", border: "1px solid #334155" }}>
        <div className="text-xs text-slate-400 tracking-widest font-semibold">⚽ GROUP A · RESULT</div>

        <div className="flex items-center gap-4 w-full justify-center">
          {/* home team */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-4xl">🇧🇷</span>
            <span className="text-xs text-slate-300 font-semibold">Brazil</span>
            <span className="text-[10px] text-slate-500">Home</span>
          </div>

          {/* slot digits */}
          <div className="flex items-center gap-2">
            <SlotDigit targetDigit={homeGoal} spinning={spinning} delay={0} />
            <span className="text-slate-500 font-bold text-xl">—</span>
            <SlotDigit targetDigit={awayGoal} spinning={spinning} delay={200} />
          </div>

          {/* away team */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-4xl">🇦🇷</span>
            <span className="text-xs text-slate-300 font-semibold">Argentina</span>
            <span className="text-[10px] text-slate-500">Away</span>
          </div>
        </div>

        <AnimatePresence>
          {revealed && (
            <motion.div initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }}>
              ✓ תוצאה נחשפה!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button onClick={reveal} disabled={spinning}
        className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: spinning ? "#1e293b" : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "1px solid rgba(139,92,246,0.4)" }}>
        {spinning ? "🎰 מסתובב..." : "🎰 חשוף תוצאה"}
      </button>
      <p className="text-xs text-slate-500">לחץ כמה פעמים לתרחישים שונים</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// #6 — Rank Change Animation
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_PLAYERS = [
  { id: 1, name: "דימה פ.", avatar: "🦁", points: 340, rank: 1 },
  { id: 2, name: "דין ב.", avatar: "🐯", points: 310, rank: 2 },
  { id: 3, name: "אורי מ.", avatar: "🦊", points: 290, rank: 3 },
  { id: 4, name: "מיה ש.", avatar: "🐺", points: 270, rank: 4 },
  { id: 5, name: "יוסי ק.", avatar: "🦅", points: 250, rank: 5 },
  { id: 6, name: "נועה ל.", avatar: "🐉", points: 230, rank: 6 },
];

function RankChangeDemo() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [prevRanks, setPrevRanks] = useState({});
  const [shuffling, setShuffling] = useState(false);

  const shuffle = () => {
    if (shuffling) return;
    setShuffling(true);
    const prev = {};
    players.forEach(p => { prev[p.id] = p.rank; });
    setPrevRanks(prev);

    const changes = players.map(p => ({ ...p, points: p.points + Math.floor(Math.random() * 60) - 10 }));
    changes.sort((a, b) => b.points - a.points);
    const updated = changes.map((p, i) => ({ ...p, rank: i + 1 }));
    setPlayers(updated);
    setTimeout(() => setShuffling(false), 800);
  };

  const getRankDelta = (player) => {
    const prev = prevRanks[player.id];
    if (prev === undefined) return 0;
    return prev - player.rank; // positive = moved up
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-sm flex flex-col gap-2">
        <AnimatePresence>
          {players.map((player) => {
            const delta = getRankDelta(player);
            return (
              <motion.div key={player.id} layout layoutId={`player-${player.id}`}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ layout: { type: "spring", stiffness: 400, damping: 35 }, duration: 0.3 }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(51,65,85,0.8)" }}>

                {/* rank badge */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{
                    background: player.rank === 1 ? "linear-gradient(135deg,#fbbf24,#d97706)" : player.rank === 2 ? "linear-gradient(135deg,#9ca3af,#6b7280)" : player.rank === 3 ? "linear-gradient(135deg,#b45309,#92400e)" : "rgba(51,65,85,0.8)",
                    color: player.rank <= 3 ? "white" : "#94a3b8"
                  }}>
                  {player.rank}
                </div>

                <span className="text-xl">{player.avatar}</span>

                <span className="text-sm text-slate-200 font-medium flex-1">{player.name}</span>

                {/* rank change indicator */}
                <AnimatePresence mode="wait">
                  {delta !== 0 && (
                    <motion.div key={`delta-${player.id}-${player.rank}`}
                      initial={{ opacity: 0, y: delta > 0 ? 10 : -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: delta > 0 ? -10 : 10 }}
                      className="flex items-center gap-0.5 text-xs font-bold"
                      style={{ color: delta > 0 ? "#4ade80" : "#f87171" }}>
                      {delta > 0 ? "▲" : "▼"}{Math.abs(delta)}
                    </motion.div>
                  )}
                </AnimatePresence>

                <span className="text-xs text-slate-400 font-mono tabular-nums">{player.points}pt</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button onClick={shuffle} disabled={shuffling}
        className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-40"
        style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", color: "white" }}>
        {shuffling ? "מסדר..." : "🔀 סבב ניחושים חדש"}
      </button>
      <p className="text-xs text-slate-500">לחץ כמה פעמים וראה איך הדירוגים נעים</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// #8 — Stats Count-Up
// ─────────────────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) { setValue(0); return; }
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

function StatCard({ label, value, suffix = "", prefix = "", color, icon, running, delay = 0 }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (running) { const t = setTimeout(() => setActive(true), delay); return () => clearTimeout(t); }
    else setActive(false);
  }, [running, delay]);
  const displayed = useCountUp(value, 1600, active);

  return (
    <motion.div className="rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))", border: `1px solid ${color}30` }}
      whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      {/* ambient glow */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 blur-xl pointer-events-none" style={{ background: color }} />

      <span className="text-2xl">{icon}</span>
      <div className="text-3xl font-black tabular-nums" style={{ color }}>
        {prefix}{displayed.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>

      {/* bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full overflow-hidden bg-white/5">
        <motion.div className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: active ? "100%" : "0%" }}
          transition={{ duration: 1.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}

function StatsCountUpDemo() {
  const [running, setRunning] = useState(false);
  const [key, setKey] = useState(0);

  const trigger = () => { setRunning(false); setTimeout(() => { setKey(k => k + 1); setRunning(true); }, 50); };

  const stats = [
    { label: "ניחושים נכונים", value: 87, suffix: "%", icon: "🎯", color: "#4ade80", delay: 0 },
    { label: "נקודות כוללות", value: 1340, suffix: "pt", icon: "⭐", color: "#fbbf24", delay: 150 },
    { label: "ניחושים מדויקים", value: 23, suffix: "", icon: "✅", color: "#60a5fa", delay: 300 },
    { label: "דירוג נוכחי", value: 4, prefix: "#", suffix: "", icon: "🏆", color: "#c084fc", delay: 450 },
    { label: "ימים עד הסיום", value: 28, suffix: "d", icon: "📅", color: "#fb923c", delay: 600 },
    { label: "מתחרים", value: 156, suffix: "", icon: "👥", color: "#f472b6", delay: 750 },
  ];

  return (
    <div key={key} className="flex flex-col items-center gap-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
        {stats.map((s, i) => <StatCard key={i} {...s} running={running} />)}
      </div>
      <button onClick={trigger}
        className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
        style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "white" }}>
        ▶ הפעל אנימציה
      </button>
      <p className="text-xs text-slate-500">הספרות עולות בהדרגה עם easing — כל סטט עם עיכוב קל שלו</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "slot",   label: "#5 · Slot Machine",   icon: "🎰" },
  { id: "rank",   label: "#6 · Rank Change",    icon: "📊" },
  { id: "stats",  label: "#8 · Stats Count-Up", icon: "⭐" },
];

export default function AdminEffectsDemo() {
  const [active, setActive] = useState("slot");

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">🧪 דמו אפקטים ויזואליים</h2>
        <p className="text-slate-400 mt-1 text-sm">לחץ על כל אפקט וראה איך הוא נראה בפועל.</p>
      </div>

      {/* tab strip */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            style={active === t.id
              ? { background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.5)" }
              : { background: "rgba(30,41,59,0.6)", color: "#64748b", border: "1px solid rgba(51,65,85,0.6)" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* panel */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl p-6 sm:p-8"
          style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(51,65,85,0.6)" }}>

          {active === "slot"  && <SlotMachineDemo />}
          {active === "rank"  && <RankChangeDemo />}
          {active === "stats" && <StatsCountUpDemo />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
