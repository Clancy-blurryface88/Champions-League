import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus, Star, Zap, Target, RotateCcw } from "lucide-react";

const PLAYERS = [
  { id: 1, name: "אלון כהן",    points: 187.5, trend: "up",   accuracy: "72%", correct: 14, history: [3,2,1,1,1] },
  { id: 2, name: "מיכל לוי",   points: 162.0, trend: "down", accuracy: "65%", correct: 12, history: [1,1,2,3,2] },
  { id: 3, name: "יוסי דוד",   points: 148.5, trend: "up",   accuracy: "61%", correct: 11, history: [4,3,3,2,3] },
  { id: 4, name: "רונית שמיר", points: 134.0, trend: "same", accuracy: "57%", correct: 10, history: [2,4,4,4,4] },
  { id: 5, name: "דני פרידמן", points: 121.5, trend: "up",   accuracy: "53%", correct:  9, history: [5,5,5,5,5] },
  { id: 6, name: "שרה גולן",   points: 109.0, trend: "down", accuracy: "48%", correct:  8, history: [6,6,6,6,6] },
  { id: 7, name: "עמי רוזן",   points:  97.5, trend: "up",   accuracy: "44%", correct:  7, history: [7,7,7,7,7] },
];

const PALETTE = ["#818cf8","#f472b6","#2dd4bf","#fbbf24","#a3e635","#38bdf8","#c084fc"];

const getInitials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2);
const getColor   = (idx)  => PALETTE[idx % PALETTE.length];

const maxPts = PLAYERS[0].points;

// ─── Medal icon ────────────────────────────────────────────────────────────────
const MedalIcon = ({ pos }) => {
  if (pos === 1) return <Trophy className="w-4 h-4 text-yellow-400" />;
  if (pos === 2) return <Trophy className="w-4 h-4 text-slate-300" />;
  if (pos === 3) return <Trophy className="w-4 h-4 text-amber-600" />;
  return <span className="text-xs font-bold text-slate-500">{pos}</span>;
};

// ─── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ player, size = "md" }) => {
  const s = size === "lg" ? "w-14 h-14 text-lg" : size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${s} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
         style={{ background: getColor(player.id - 1) }}>
      {getInitials(player.name)}
    </div>
  );
};

// ─── Trend icon ────────────────────────────────────────────────────────────────
const TrendIcon = ({ t }) =>
  t === "up"   ? <TrendingUp   className="w-3 h-3 text-emerald-400" /> :
  t === "down" ? <TrendingDown className="w-3 h-3 text-rose-400"    /> :
                 <Minus        className="w-3 h-3 text-slate-500"   />;

// ══════════════════════════════════════════════════════════════════════════════
// 1. PODIUM
// ══════════════════════════════════════════════════════════════════════════════
function PodiumDemo() {
  const [p2, p1, p3] = [PLAYERS[1], PLAYERS[0], PLAYERS[2]];
  const rest = PLAYERS.slice(3);

  const PodiumSlot = ({ player, pos, height, color }) => (
    <div className="flex flex-col items-center gap-2">
      <Avatar player={player} size="lg" />
      <span className="text-white text-sm font-semibold text-center">{player.name}</span>
      <span className="text-xs text-slate-400">{player.points} pts</span>
      <motion.div
        initial={{ height: 0 }} animate={{ height }}
        transition={{ duration: 0.8, delay: pos * 0.15, ease: "easeOut" }}
        className="w-20 rounded-t-xl flex items-start justify-center pt-2 font-bold text-2xl"
        style={{ background: color }}>
        {pos}
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* podium */}
      <div className="flex items-end justify-center gap-3 pt-4">
        <PodiumSlot player={p2} pos={2} height={80}  color="linear-gradient(180deg,#94a3b8,#64748b)" />
        <PodiumSlot player={p1} pos={1} height={120} color="linear-gradient(180deg,#fbbf24,#d97706)" />
        <PodiumSlot player={p3} pos={3} height={60}  color="linear-gradient(180deg,#b45309,#92400e)" />
      </div>
      {/* rest */}
      <div className="space-y-2">
        {rest.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            className="flex items-center gap-3 bg-white/4 border border-white/6 rounded-xl px-4 py-2.5">
            <span className="text-slate-500 font-bold w-5 text-sm">{i + 4}</span>
            <Avatar player={p} size="sm" />
            <span className="flex-1 text-slate-300 text-sm">{p.name}</span>
            <TrendIcon t={p.trend} />
            <span className="text-slate-400 text-sm font-semibold">{p.points}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. RACE BARS
// ══════════════════════════════════════════════════════════════════════════════
function RaceBarsDemo() {
  return (
    <div className="space-y-3 pt-2">
      {PLAYERS.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay: i * 0.07 }} className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <MedalIcon pos={i + 1} />
              <span className="text-slate-300 font-medium">{p.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendIcon t={p.trend} />
              <span className="font-bold text-white">{p.points}</span>
              <span className="text-slate-600">pts</span>
            </div>
          </div>
          <div className="h-7 bg-white/5 rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${(p.points / maxPts) * 100}%` }}
              transition={{ duration: 1, delay: i * 0.07, ease: "easeOut" }}
              className="h-full rounded-lg flex items-center justify-end pr-2"
              style={{ background: `linear-gradient(90deg, ${getColor(i)}44, ${getColor(i)})` }}>
              <Avatar player={p} size="sm" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. BENTO GRID
// ══════════════════════════════════════════════════════════════════════════════
function BentoDemo() {
  const [p1, p2, p3] = PLAYERS;
  const rest = PLAYERS.slice(3);

  return (
    <div className="space-y-3">
      {/* top row */}
      <div className="grid grid-cols-3 gap-3">
        {/* #1 large */}
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          className="col-span-2 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-amber-600/5 p-5 flex items-center gap-4">
          <Avatar player={p1} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold uppercase">מקום 1</span>
            </div>
            <p className="text-white font-bold text-lg">{p1.name}</p>
            <p className="text-3xl font-black text-yellow-400">{p1.points}</p>
            <p className="text-slate-500 text-xs">נקודות</p>
          </div>
          <Star className="w-16 h-16 text-yellow-400/10" />
        </motion.div>

        {/* #2 */}
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-400/20 bg-slate-800/40 p-4 flex flex-col items-center justify-center gap-2">
          <Avatar player={p2} size="md" />
          <Trophy className="w-4 h-4 text-slate-300" />
          <p className="text-slate-200 font-semibold text-sm text-center">{p2.name}</p>
          <p className="text-xl font-black text-slate-300">{p2.points}</p>
        </motion.div>
      </div>

      {/* #3 + compact row */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-amber-700/20 bg-amber-900/10 p-4 flex flex-col items-center justify-center gap-2">
          <Avatar player={p3} size="md" />
          <Trophy className="w-4 h-4 text-amber-600" />
          <p className="text-slate-200 font-semibold text-sm text-center">{p3.name}</p>
          <p className="text-xl font-black text-amber-500">{p3.points}</p>
        </motion.div>

        <div className="col-span-2 space-y-2">
          {rest.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-center gap-2 bg-white/4 border border-white/6 rounded-xl px-3 py-2">
              <span className="text-slate-600 font-bold text-xs w-4">{i + 4}</span>
              <Avatar player={p} size="sm" />
              <span className="flex-1 text-slate-300 text-xs truncate">{p.name}</span>
              <span className="text-white font-bold text-sm">{p.points}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. FLIP CARDS
// ══════════════════════════════════════════════════════════════════════════════
function FlipCardsDemo() {
  const [flipped, setFlipped] = useState({});
  const toggle = (id) => setFlipped(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      <p className="text-slate-500 text-xs text-center mb-4">לחץ על כרטיס לפרטים נוספים</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PLAYERS.map((p, i) => (
          <div key={p.id} className="cursor-pointer h-32" style={{ perspective: 1000 }}
               onClick={() => toggle(p.id)}>
            <motion.div className="relative w-full h-full"
              animate={{ rotateY: flipped[p.id] ? 180 : 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}>

              {/* Front */}
              <div className="absolute inset-0 rounded-2xl border border-white/8 bg-white/4 p-3 flex flex-col items-center justify-center gap-2"
                   style={{ backfaceVisibility: "hidden" }}>
                <Avatar player={p} size="md" />
                <MedalIcon pos={i + 1} />
                <p className="text-white text-xs font-semibold text-center leading-tight">{p.name}</p>
                <p className="font-black text-sm" style={{ color: getColor(i) }}>{p.points}</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 rounded-2xl border p-3 flex flex-col items-center justify-center gap-2"
                   style={{
                     backfaceVisibility: "hidden", transform: "rotateY(180deg)",
                     background: `linear-gradient(135deg, ${getColor(i)}22, ${getColor(i)}08)`,
                     borderColor: getColor(i) + "44"
                   }}>
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                  <Target className="w-3 h-3" />
                  <span>דיוק: {p.accuracy}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span>{p.correct} ניחושים</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <TrendIcon t={p.trend} />
                  <span>{p.trend === "up" ? "עלייה" : p.trend === "down" ? "ירידה" : "יציב"}</span>
                </div>
                <RotateCcw className="w-3 h-3 text-slate-600 mt-1" />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. TIMELINE / GRAPH
// ══════════════════════════════════════════════════════════════════════════════
function TimelineDemo() {
  const [hovered, setHovered] = useState(null);
  const W = 400, H = 200, PAD = { t:20, r:20, b:30, l:30 };
  const rounds = [1,2,3,4,5];
  const xStep = (W - PAD.l - PAD.r) / (rounds.length - 1);
  const yStep = (H - PAD.t - PAD.b) / (PLAYERS.length - 1);

  const getX = (ri) => PAD.l + ri * xStep;
  const getY = (rank) => PAD.t + (rank - 1) * yStep;

  return (
    <div className="space-y-4">
      <p className="text-slate-500 text-xs text-center">דירוג לאורך המחזורים (1 = הכי גבוה)</p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto block">
          {/* Grid lines */}
          {rounds.map((_, ri) => (
            <line key={ri} x1={getX(ri)} y1={PAD.t} x2={getX(ri)} y2={H - PAD.b}
                  stroke="white" strokeOpacity="0.05" strokeWidth="1" />
          ))}
          {PLAYERS.map((_, pi) => (
            <line key={pi} x1={PAD.l} y1={getY(pi + 1)} x2={W - PAD.r} y2={getY(pi + 1)}
                  stroke="white" strokeOpacity="0.05" strokeWidth="1" />
          ))}

          {/* Round labels */}
          {rounds.map((r, ri) => (
            <text key={ri} x={getX(ri)} y={H - 8} textAnchor="middle"
                  fill="rgba(148,163,184,0.7)" fontSize="9">מ'{r}</text>
          ))}

          {/* Rank labels */}
          {[1,3,5,7].map(r => (
            <text key={r} x={PAD.l - 6} y={getY(r) + 3} textAnchor="end"
                  fill="rgba(148,163,184,0.5)" fontSize="8">{r}</text>
          ))}

          {/* Lines + dots */}
          {PLAYERS.map((p, pi) => {
            const pts = p.history.map((rank, ri) => `${getX(ri)},${getY(rank)}`);
            const isHov = hovered === p.id;
            return (
              <g key={p.id} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)}
                 style={{ cursor: "pointer" }}>
                <polyline points={pts.join(" ")} fill="none"
                  stroke={getColor(pi)} strokeWidth={isHov ? 2.5 : 1.5}
                  strokeOpacity={hovered && !isHov ? 0.2 : 1}
                  strokeLinejoin="round" strokeLinecap="round" />
                {p.history.map((rank, ri) => (
                  <circle key={ri} cx={getX(ri)} cy={getY(rank)} r={isHov ? 4 : 2.5}
                    fill={getColor(pi)} fillOpacity={hovered && !isHov ? 0.2 : 1} />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        {PLAYERS.map((p, i) => (
          <div key={p.id} className="flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-lg transition-colors"
               style={{ background: hovered === p.id ? getColor(i) + "22" : "transparent" }}
               onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)}>
            <div className="w-2 h-2 rounded-full" style={{ background: getColor(i) }} />
            <span className="text-xs text-slate-400">{p.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. SPOTLIGHT
// ══════════════════════════════════════════════════════════════════════════════
function SpotlightDemo() {
  const ME = PLAYERS[3]; // simulate "you" at rank 4
  const above = PLAYERS.slice(0, 3);
  const below = PLAYERS.slice(4);

  return (
    <div className="space-y-2 pt-2">
      {/* above */}
      {above.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay: i * 0.07 }}
          className="flex items-center gap-3 bg-white/4 border border-white/6 rounded-xl px-4 py-2.5 opacity-60">
          <span className="text-slate-500 font-bold w-5 text-xs">{i + 1}</span>
          <Avatar player={p} size="sm" />
          <span className="flex-1 text-slate-400 text-sm">{p.name}</span>
          <span className="text-slate-400 text-sm font-semibold">{p.points}</span>
          <span className="text-xs text-rose-400/70">-{(p.points - ME.points).toFixed(1)}</span>
        </motion.div>
      ))}

      {/* YOU */}
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        transition={{ delay: 0.25 }}
        className="relative flex items-center gap-4 rounded-2xl px-5 py-4 border-2 border-indigo-400/50"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))" }}>
        <div className="absolute -top-2.5 left-4 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          אתה • מקום 4
        </div>
        <Avatar player={ME} size="lg" />
        <div className="flex-1">
          <p className="text-white font-bold text-base">{ME.name}</p>
          <p className="text-3xl font-black text-indigo-300">{ME.points}</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-xs text-slate-500">פער ממקום 3</div>
          <div className="text-rose-400 font-bold">{(PLAYERS[2].points - ME.points).toFixed(1)}-</div>
          <div className="text-xs text-slate-500">פער ממקום 5</div>
          <div className="text-emerald-400 font-bold">+{(ME.points - PLAYERS[4].points).toFixed(1)}</div>
        </div>
      </motion.div>

      {/* below */}
      {below.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay: 0.35 + i * 0.07 }}
          className="flex items-center gap-3 bg-white/4 border border-white/6 rounded-xl px-4 py-2.5 opacity-60">
          <span className="text-slate-500 font-bold w-5 text-xs">{i + 5}</span>
          <Avatar player={p} size="sm" />
          <span className="flex-1 text-slate-400 text-sm">{p.name}</span>
          <span className="text-slate-400 text-sm font-semibold">{p.points}</span>
          <span className="text-xs text-emerald-400/70">+{(ME.points - p.points).toFixed(1)}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
const DEMOS = [
  { id: "podium",   label: "פודיום",     emoji: "🏆", component: PodiumDemo    },
  { id: "race",     label: "Race Bars",  emoji: "🏁", component: RaceBarsDemo  },
  { id: "bento",    label: "Bento Grid", emoji: "⬛", component: BentoDemo     },
  { id: "flip",     label: "Flip Cards", emoji: "🔄", component: FlipCardsDemo },
  { id: "timeline", label: "Timeline",   emoji: "📈", component: TimelineDemo  },
  { id: "spotlight",label: "Spotlight",  emoji: "💡", component: SpotlightDemo },
];

export default function AdminLeaderboardDemo() {
  const [active, setActive] = useState("podium");
  const current = DEMOS.find(d => d.id === active);
  const Component = current.component;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">דמו — עיצובי טבלת דירוג</h2>
        <p className="text-slate-500 text-sm mt-1">נתוני דמו בלבד — בחר סגנון לצפייה</p>
      </div>

      {/* Tab selector */}
      <div className="flex flex-wrap gap-2">
        {DEMOS.map(d => (
          <button key={d.id} onClick={() => setActive(d.id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              active === d.id
                ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-300"
                : "bg-white/4 border-white/8 text-slate-400 hover:text-white hover:bg-white/8"
            }`}>
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      {/* Demo panel */}
      <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}>
            <Component />
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-slate-600 text-xs text-center">
        אמור לי איזה סגנון (או שילוב) אתה רוצה ואיישם על הטבלה האמיתית
      </p>
    </div>
  );
}
