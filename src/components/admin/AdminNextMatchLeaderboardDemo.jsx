import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreCounter from "../ScoreCounter";

// ─────────────────────────────────────────────────────────────────
// Mock data — no API calls, just for visual comparison
// ─────────────────────────────────────────────────────────────────
const NEXT_MATCH = {
  team_a: "ברזיל", team_a_flag: "🇧🇷",
  team_b: "ארגנטינה", team_b_flag: "🇦🇷",
  date_label: "יום חמישי · 21:00",
};

// prev = points before this round, points = current — drives the delta counter / rank-change arrows
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

// ─────────────────────────────────────────────────────────────────
// Shared "next match" card — identical across all variants so the
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
      style={{
        background: "rgba(8,18,32,0.95)",
        border: "1px solid rgba(245,197,24,0.35)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        maxWidth: 360,
      }}
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

function Frame({ title, subtitle, children }) {
  const [stage, setStage] = useState("match");
  const replay = () => setStage("match");
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-sm">{title}</h3>
          <p className="text-slate-500 text-[11px]">{subtitle}</p>
        </div>
        {stage !== "match" && (
          <button
            onClick={replay}
            className="text-[11px] px-3 py-1.5 rounded-full border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400"
          >
            🔄 הפעל מחדש
          </button>
        )}
      </div>
      <div className="min-h-[420px] flex items-center justify-center">
        {children(stage, setStage)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// A — המשך אורגני: אותו כרטיס "נפתח" ומתרחב לטבלה (רעיון #1)
// ─────────────────────────────────────────────────────────────────
function VariantOrganicMorph({ stage, setStage }) {
  if (stage === "match") {
    return <NextMatchCard morphing onContinue={() => setStage("reveal")} />;
  }
  return (
    <motion.div
      layout
      layoutId="morph-card"
      className="rounded-2xl px-5 py-5 w-full max-w-md mx-auto"
      style={{ background: "rgba(8,18,32,0.95)", border: "1px solid rgba(245,197,24,0.35)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
    >
      <div className="text-center mb-3">
        <span className="text-amber-400 text-[11px] font-bold tracking-widest uppercase">טבלת משתתפים</span>
      </div>
      <div className="space-y-1.5">
        {[...CURRENT].reverse().map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09, duration: 0.4 }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl"
            style={{ background: p.isCurrentUser ? "rgba(96,165,250,0.12)" : "rgba(30,41,59,0.6)", border: p.isCurrentUser ? "1px solid #60A5FA" : "1px solid transparent" }}
          >
            <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
            <Avatar p={p} size={30} />
            <span className="flex-1 text-white text-xs font-semibold truncate">{p.name}</span>
            <span className="text-xs font-black tabular-nums" style={{ color: rankColor(p.pos) }}>{p.points}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// B — פוקוס אישי קודם, ואז הרשימה נפתחת סביבו (רעיון #2)
// ─────────────────────────────────────────────────────────────────
function VariantPersonalSpotlight({ stage, setStage }) {
  const me = CURRENT.find(p => p.isCurrentUser);
  const [expanded, setExpanded] = useState(false);

  const handleContinue = () => {
    setStage("reveal");
    setTimeout(() => setExpanded(true), 1200);
  };

  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence>
        {!expanded && (
          <motion.div
            key="spotlight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center gap-2 py-10"
          >
            <span className="text-slate-400 text-xs">איפה אתה עומד?</span>
            <span className="text-7xl font-black" style={{ color: rankColor(me.pos), textShadow: `0 0 40px ${rankColor(me.pos)}88` }}>
              #{me.pos}
            </span>
            <span className="text-white font-bold">{me.name}</span>
            <span className="text-amber-400 font-black text-lg">{me.points} נק'</span>
          </motion.div>
        )}
      </AnimatePresence>

      {expanded && (
        <div className="space-y-1.5">
          {[...CURRENT].reverse().map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: p.isCurrentUser ? 0 : -20, scale: p.isCurrentUser ? 1.05 : 1 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: p.isCurrentUser ? 0 : i * 0.06, duration: 0.4 }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl"
              style={{ background: p.isCurrentUser ? "rgba(96,165,250,0.14)" : "rgba(30,41,59,0.6)", border: p.isCurrentUser ? "1px solid #60A5FA" : "1px solid transparent" }}
            >
              <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
              <Avatar p={p} size={30} />
              <span className="flex-1 text-white text-xs font-semibold truncate">{p.name}</span>
              <span className="text-xs font-black tabular-nums" style={{ color: rankColor(p.pos) }}>{p.points}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// C — מתח למקום הראשון: כולם נחשפים, מקום 1 נשאר "?" עד הרגע האחרון
// כולל חגיגת "מוביל חדש" אם הוא השתנה (רעיונות #6 + #7)
// ─────────────────────────────────────────────────────────────────
function VariantMysteryLeader({ stage, setStage }) {
  const [leaderRevealed, setLeaderRevealed] = useState(false);
  const rest = CURRENT.filter(p => p.pos !== 1);
  const leader = CURRENT.find(p => p.pos === 1);
  const leaderChanged = leader.id !== PREVIOUS_LEADER_ID;

  const handleContinue = () => {
    setStage("reveal");
    setTimeout(() => setLeaderRevealed(true), rest.length * 90 + 900);
  };

  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;

  return (
    <div className="w-full max-w-md mx-auto space-y-1.5">
      {/* Mystery leader row first, at top, revealed last */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl overflow-hidden"
        style={{ background: "rgba(250,204,21,0.10)", border: "1px solid rgba(250,204,21,0.4)" }}
      >
        {leaderChanged && leaderRevealed && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(255,215,0,0.5),transparent 70%)" }}
          />
        )}
        <span className="w-5 text-center font-black text-sm">🥇</span>
        <AnimatePresence mode="wait">
          {!leaderRevealed ? (
            <motion.div key="mystery" exit={{ opacity: 0 }} className="flex items-center gap-3 flex-1">
              <div className="w-[30px] h-[30px] rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-black animate-pulse">?</div>
              <span className="flex-1 text-slate-400 text-xs font-semibold tracking-widest uppercase animate-pulse">מי בראש הפעם...</span>
            </motion.div>
          ) : (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 flex-1">
              <Avatar p={leader} size={30} />
              <span className="flex-1 text-white text-xs font-bold truncate">{leader.name}</span>
              {leaderChanged && <span className="text-[9px] text-amber-300 font-bold">👑 מוביל חדש!</span>}
              <span className="text-xs font-black tabular-nums text-yellow-400">{leader.points}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {[...rest].reverse().map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.09, duration: 0.4 }}
          className="flex items-center gap-3 px-3 py-2 rounded-xl"
          style={{ background: "rgba(30,41,59,0.6)" }}
        >
          <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
          <Avatar p={p} size={30} />
          <span className="flex-1 text-white text-xs font-semibold truncate">{p.name}</span>
          <span className="text-xs font-black tabular-nums" style={{ color: rankColor(p.pos) }}>{p.points}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// D — גלילה קולנועית + דלתא נקודות + חצי שינוי דירוג (רעיונות #4,#5,#8)
// ─────────────────────────────────────────────────────────────────
function VariantCinematicDelta({ stage, setStage }) {
  const [revealScores, setRevealScores] = useState(false);

  const handleContinue = () => {
    setStage("reveal");
    setTimeout(() => setRevealScores(true), 400);
  };

  if (stage === "match") return <NextMatchCard onContinue={handleContinue} />;

  return (
    <div className="w-full max-w-md mx-auto space-y-1.5">
      {[...CURRENT].reverse().map((p, i) => {
        const prevPos = PREVIOUS_POS[p.id];
        const diff = prevPos - p.pos; // חיובי = עלה, שלילי = ירד
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.14, duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl"
            style={{ background: p.isCurrentUser ? "rgba(96,165,250,0.12)" : "rgba(30,41,59,0.6)", border: p.isCurrentUser ? "1px solid #60A5FA" : "1px solid transparent" }}
          >
            <span className="w-5 text-center font-black text-sm" style={{ color: rankColor(p.pos) }}>{medal(p.pos) || p.pos}</span>
            <Avatar p={p} size={30} />
            <span className="flex-1 text-white text-xs font-semibold truncate">{p.name}</span>
            {diff !== 0 && (
              <span className={`text-[10px] font-bold ${diff > 0 ? "text-green-400" : "text-red-400"}`}>
                {diff > 0 ? `▲${diff}` : `▼${Math.abs(diff)}`}
              </span>
            )}
            <span className="text-xs font-black tabular-nums w-12 text-left" style={{ color: rankColor(p.pos) }}>
              <ScoreCounter value={revealScores ? p.points : p.prev} duration={1.1} delay={i * 0.14} showDecimals />
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

const VARIANTS = [
  { id: "A", label: "המשך אורגני (#1)", sub: "אותו כרטיס נפתח ומתרחב לטבלה", Comp: VariantOrganicMorph },
  { id: "B", label: "פוקוס אישי קודם (#2)", sub: "קודם המקום שלך, ואז נפתחת כל הרשימה", Comp: VariantPersonalSpotlight },
  { id: "C", label: "מתח למקום 1 (#6+#7)", sub: "כולם נחשפים, המוביל נשאר '?' עד הסוף", Comp: VariantMysteryLeader },
  { id: "D", label: "קולנועי + דלתא (#4+#5+#8)", sub: "ניקוד קופץ מהערך הקודם, חצי עלייה/ירידה", Comp: VariantCinematicDelta },
];

export default function AdminNextMatchLeaderboardDemo() {
  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-white font-bold text-lg mb-1">דמו: מ"משחק הבא" לטבלת משתתפים</h2>
        <p className="text-slate-400 text-sm">
          4 גרסאות לאותה מעבר — לחצו "המשך" בכל כרטיס כדי לראות את החשיפה, ו"הפעל מחדש" כדי לחזור.
          כל הנתונים כאן הם דמה (mock) לצורך השוואה בלבד.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {VARIANTS.map(({ id, label, sub, Comp }) => (
          <Frame key={id} title={label} subtitle={sub}>
            {(stage, setStage) => <Comp stage={stage} setStage={setStage} />}
          </Frame>
        ))}
      </div>
    </div>
  );
}
