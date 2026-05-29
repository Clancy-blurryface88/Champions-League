import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEMO_PLAYERS = [
  { id: 1, name: "פלדמן", points: 189.15 },
  { id: 2, name: "דימה",   points: 162.15 },
  { id: 3, name: "ישראל",  points: 98.40  },
  { id: 4, name: "yosii",  points: 74.20  },
  { id: 5, name: "ויטל",   points: 51.00  },
];

const MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

// ---- Flip digit (single character) ----
function FlipChar({ char, prevChar }) {
  const changed = char !== prevChar;
  return (
    <span className="relative inline-block overflow-hidden" style={{ minWidth: "0.6em" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={changed ? { rotateX: -90, opacity: 0 } : false}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{ display: "inline-block", transformOrigin: "50% 50%", fontVariantNumeric: "tabular-nums" }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ---- Flip number (full number string) ----
function FlipNumber({ value, className }) {
  const str = value.toFixed(2);
  const prevRef = useRef(str);
  const prev = prevRef.current;
  useEffect(() => { prevRef.current = str; }, [str]);

  return (
    <span className={className} style={{ display: "inline-flex" }}>
      {str.split("").map((ch, i) => (
        <FlipChar key={i} char={ch} prevChar={prev[i] ?? ch} />
      ))}
    </span>
  );
}

// ---- Flip rank digit ----
function FlipRank({ rank }) {
  const prev = useRef(rank);
  const changed = prev.current !== rank;
  useEffect(() => { prev.current = rank; }, [rank]);

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={rank}
        initial={changed ? { rotateX: -90, opacity: 0 } : false}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: 90, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{ display: "inline-block", transformOrigin: "50% 50%" }}
        className="font-bold text-lg tabular-nums"
      >
        {MEDAL[rank] || rank}
      </motion.span>
    </AnimatePresence>
  );
}

export default function LeaderboardFlipDemo() {
  const [players, setPlayers] = useState(DEMO_PLAYERS);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevOrder = useRef(players.map(p => p.id));

  const shuffle = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // randomly add/subtract a few points to each player
    setPlayers(prev => {
      const updated = prev.map(p => ({
        ...p,
        points: Math.max(0, parseFloat((p.points + (Math.random() * 40 - 10)).toFixed(2)))
      }));
      return [...updated].sort((a, b) => b.points - a.points);
    });

    setTimeout(() => setIsAnimating(false), 600);
  };

  const reset = () => {
    setPlayers([...DEMO_PLAYERS].sort((a, b) => b.points - a.points));
  };

  const sorted = [...players];

  return (
    <div className="p-6 max-w-sm mx-auto" dir="rtl">
      <h2 className="text-xl font-bold text-white mb-1 text-center">דמו — Flip Leaderboard</h2>
      <p className="text-slate-400 text-xs text-center mb-6">מספרי הדירוג והניקוד מתהפכים כמו לוח נחיתות</p>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {sorted.map((player, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            return (
              <motion.div
                key={player.id}
                layout
                layoutId={String(player.id)}
                transition={{ type: "spring", stiffness: 340, damping: 30 }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl border
                  ${rank === 1 ? "bg-gradient-to-l from-yellow-500/15 to-amber-600/10 border-yellow-500/40" :
                    rank === 2 ? "bg-gradient-to-l from-slate-400/10 to-slate-500/8 border-slate-400/30" :
                    rank === 3 ? "bg-gradient-to-l from-amber-700/15 to-amber-800/8 border-amber-700/30" :
                    "bg-slate-800/50 border-slate-700/40"}
                `}
              >
                {/* Rank */}
                <div className="w-8 flex-shrink-0 flex items-center justify-center text-center">
                  <FlipRank rank={rank} />
                </div>

                {/* Name */}
                <div className="flex-1 text-white font-semibold text-sm">{player.name}</div>

                {/* Points */}
                <FlipNumber
                  value={player.points}
                  className={`text-sm font-bold tabular-nums ${
                    rank === 1 ? "text-yellow-400" :
                    rank === 2 ? "text-slate-300" :
                    rank === 3 ? "text-amber-600" :
                    "text-green-400"
                  }`}
                />
                <span className={`text-xs ${isTop3 ? "text-slate-400" : "text-slate-500"}`}>PTS</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={shuffle}
          disabled={isAnimating}
          className="flex-1 py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-sm font-semibold border border-yellow-500/30 transition-all disabled:opacity-50"
        >
          עדכן ניקוד
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm border border-slate-600/40 transition-all"
        >
          איפוס
        </button>
      </div>
    </div>
  );
}
