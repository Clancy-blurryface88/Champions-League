import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Shield, Zap, AlertTriangle, Target, Users } from "lucide-react";

// ── Fake data ────────────────────────────────────────────────────────────────
const LIVE_MATCH = {
  home: "Brazil", away: "Argentina",
  homeFlag: "🇧🇷", awayFlag: "🇦🇷",
  currentHome: 1, currentAway: 0, minute: 67,
};

const PLAYERS = [
  { name: "יוסי",   pts: 48.5, rank: 1, predicted_a: 1, predicted_b: 0 },
  { name: "דימה",   pts: 43.0, rank: 2, predicted_a: 2, predicted_b: 1 }, // ← ME
  { name: "מוטי",   pts: 38.5, rank: 3, predicted_a: 2, predicted_b: 1 },
  { name: "שי",     pts: 31.0, rank: 4, predicted_a: 0, predicted_b: 0 },
  { name: "טופחי",  pts: 28.0, rank: 5, predicted_a: 3, predicted_b: 1 },
  { name: "אלי",    pts: 22.5, rank: 6, predicted_a: 1, predicted_b: 1 },
];
const ME_INDEX = 1; // דימה

// ── Points calculation ───────────────────────────────────────────────────────
function calcPoints(predicted_a, predicted_b, actual_a, actual_b) {
  let total = 0;

  // Exact score: 8 pts
  if (predicted_a === actual_a && predicted_b === actual_b) total += 8;

  // Direction: 3 pts
  const predDir = predicted_a > predicted_b ? "home" : predicted_a < predicted_b ? "away" : "draw";
  const actDir  = actual_a   > actual_b     ? "home" : actual_a   < actual_b     ? "away" : "draw";
  if (predDir === actDir) total += 3;

  // BTTS: 2 pts
  const predBTTS = predicted_a > 0 && predicted_b > 0;
  const actBTTS  = actual_a   > 0 && actual_b   > 0;
  if (predBTTS === actBTTS) total += 2;

  // Goals range: 1 pt
  const predGoals = predicted_a + predicted_b;
  const actGoals  = actual_a   + actual_b;
  const range = g => g <= 2 ? "0-2" : g <= 4 ? "3-4" : "5+";
  if (range(predGoals) === range(actGoals)) total += 1;

  return total;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const RANK_BG = r =>
  r === 1 ? "linear-gradient(135deg,rgba(250,204,21,.22),rgba(245,158,11,.22))"
: r === 2 ? "linear-gradient(135deg,rgba(209,213,219,.18),rgba(156,163,175,.18))"
: r === 3 ? "linear-gradient(135deg,rgba(245,158,11,.20),rgba(217,119,6,.20))"
: "rgba(30,41,59,.60)";

const RANK_BORDER = r =>
  r === 1 ? "#FFD700"
: r === 2 ? "#D1D5DB"
: r === 3 ? "#D97706"
: "#475569";

const MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

// Pre-compute live bonuses (based on current score 1-0)
const CURRENT = { a: LIVE_MATCH.currentHome, b: LIVE_MATCH.currentAway };

function computeLiveRows(actualA, actualB) {
  return PLAYERS.map((p, i) => {
    const bonus = calcPoints(p.predicted_a, p.predicted_b, actualA, actualB);
    return { ...p, index: i, bonus, liveTotal: p.pts + bonus };
  }).sort((a, b) => b.liveTotal - a.liveTotal)
    .map((p, i) => ({ ...p, liveRank: i + 1 }))
    .sort((a, b) => a.index - b.index); // restore original order for lookup
}

const liveRows = computeLiveRows(CURRENT.a, CURRENT.b);

// Sort by live rank for display
const sortedByLiveRank = [...liveRows].sort((a, b) => a.liveRank - b.liveRank);

// Me
const ME = liveRows[ME_INDEX];

// ── Leaderboard card (skewed, matching app style) ────────────────────────────
function LeaderboardCard({ player, isMe }) {
  const { name, pts, rank, liveRank, bonus, liveTotal } = player;
  const border = RANK_BORDER(liveRank);
  const bg     = RANK_BG(liveRank);
  return (
    <div className="relative mb-1.5">
      <div style={{
        transform: "skewX(-6deg)", borderRadius: 8, overflow: "hidden",
        border: `2px solid ${border}`,
        background: isMe ? `linear-gradient(135deg,rgba(52,211,153,.18),${bg})` : bg,
        boxShadow: isMe ? "0 0 12px rgba(52,211,153,.25)" : "none",
        transition: "border-color .4s ease",
        position: "relative",
      }}>
        {/* Ghost rank number */}
        <span style={{
          position: "absolute", left: 8, top: "50%",
          transform: "translateY(-50%) skewX(6deg)",
          fontSize: 28, fontWeight: 900,
          color: RANK_BORDER(liveRank),
          opacity: 0.13, lineHeight: 1,
          userSelect: "none", pointerEvents: "none",
        }}>{liveRank}</span>

        <div style={{ transform: "skewX(6deg)", padding: "9px 10px 9px 36px" }}>
          <div className="flex items-center gap-2">
            {/* Medal */}
            <span style={{ fontSize: 14, minWidth: 18 }}>{MEDAL[liveRank] || ""}</span>

            {/* Name */}
            <p className="flex-1 min-w-0 truncate text-xs font-semibold"
              style={{ color: isMe ? "#34d399" : "#e2e8f0" }}>
              {name}
              {isMe && <span className="text-[9px] text-emerald-400 font-bold ml-1">← אתה</span>}
            </p>

            {/* Bonus chip */}
            {bonus > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(52,211,153,.15)", color: "#34d399" }}>
                +{bonus}
              </span>
            )}

            {/* Total */}
            <span className="text-[11px] font-bold tabular-nums"
              style={{ color: bonus > 0 ? "#34d399" : "#94a3b8" }}>
              {liveTotal.toFixed(1)}
            </span>
          </div>

          {/* Prediction row */}
          <div className="flex items-center gap-1 mt-0.5 pl-5">
            <span className="text-[9px] text-slate-500">ניחוש:</span>
            <span className="text-[9px] text-slate-400 font-medium">
              {player.predicted_a}–{player.predicted_b}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, color = "#94a3b8" }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
      <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>{title}</p>
    </div>
  );
}

// ── Personal Card ─────────────────────────────────────────────────────────────
function PersonalCard() {
  const actualA = CURRENT.a;
  const actualB = CURRENT.b;
  const myPredA = ME.predicted_a;
  const myPredB = ME.predicted_b;

  // Points I earn right now (based on 1-0)
  const myBonusNow = calcPoints(myPredA, myPredB, actualA, actualB);
  const myTotalNow = ME.pts + myBonusNow;

  // Points if match stays 1-0 → my new rank
  const rowsIfCurrent = computeLiveRows(actualA, actualB);
  const sortedIfCurrent = [...rowsIfCurrent].sort((a, b) => b.liveTotal - a.liveTotal);
  const myRankIfCurrent = sortedIfCurrent.findIndex(p => p.name === ME.name) + 1;

  // Points if MY prediction comes true (2-1)
  const rowsIfMyPred = computeLiveRows(myPredA, myPredB);
  const myBonusIfMyPred = calcPoints(myPredA, myPredB, myPredA, myPredB);
  const myTotalIfMyPred = ME.pts + myBonusIfMyPred;
  const sortedIfMyPred = [...rowsIfMyPred].sort((a, b) => b.liveTotal - a.liveTotal);
  const myRankIfMyPred = sortedIfMyPred.findIndex(p => p.name === ME.name) + 1;

  // Section 2: threats — players ranked BELOW me whose prediction, if true, overtakes me
  const threats = PLAYERS.filter((p, i) => i !== ME_INDEX && p.rank > ME.rank).map(p => {
    const theirBonusIfTheyRight = calcPoints(p.predicted_a, p.predicted_b, p.predicted_a, p.predicted_b);
    const theirTotalIfRight = p.pts + theirBonusIfTheyRight;
    const overtakes = theirTotalIfRight > myTotalNow;
    return { ...p, theirTotalIfRight, overtakes };
  }).filter(p => p.overtakes);

  // Section 3: who I can overtake — players ranked ABOVE me
  const canOvertake = PLAYERS.filter((p, i) => i !== ME_INDEX && p.rank < ME.rank).map(p => {
    // Their bonus if current score stays (1-0)
    const theirBonusIfCurrent = calcPoints(p.predicted_a, p.predicted_b, actualA, actualB);
    const theirTotalIfCurrent = p.pts + theirBonusIfCurrent;
    // My total if my prediction comes true
    const iOvertake = myTotalIfMyPred > theirTotalIfCurrent;
    return { ...p, theirBonusIfCurrent, theirTotalIfCurrent, iOvertake };
  });

  // Section 4: golden scenario — best score for me (0-0 to 4-4)
  let goldScore = null, goldBonus = -1, goldRank = 99;
  for (let a = 0; a <= 4; a++) {
    for (let b = 0; b <= 4; b++) {
      const bonus = calcPoints(myPredA, myPredB, a, b);
      const total = ME.pts + bonus;
      const rows = computeLiveRows(a, b);
      const sorted = [...rows].sort((x, y) => y.liveTotal - x.liveTotal);
      const rank = sorted.findIndex(p => p.name === ME.name) + 1;
      if (bonus > goldBonus || (bonus === goldBonus && rank < goldRank)) {
        goldBonus = bonus; goldRank = rank; goldScore = { a, b };
      }
    }
  }

  // Section 5: same prediction as me
  const sameBoat = PLAYERS.filter((p, i) => i !== ME_INDEX && p.predicted_a === myPredA && p.predicted_b === myPredB);

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(10,18,35,0.95)", border: "1px solid rgba(52,211,153,.25)", boxShadow: "0 8px 32px rgba(0,0,0,.5)" }}>
      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.3)" }}>
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div>
          <p className="text-white text-sm font-bold leading-tight">הכרטיס שלי — דימה</p>
          <p className="text-emerald-400 text-[10px]">ניחוש: ברזיל {myPredA}–{myPredB} ארגנטינה</p>
        </div>
        <div className="mr-auto flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-[10px] font-bold">{LIVE_MATCH.currentHome}–{LIVE_MATCH.currentAway} · {LIVE_MATCH.minute}'</span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">

        {/* ── Section 1: המצב שלי עכשיו ─────────────────────────────── */}
        <div>
          <SectionHeader icon={Target} title="המצב שלי עכשיו" color="#34d399" />
          <div className="grid grid-cols-2 gap-2">
            {/* Current score column */}
            <div className="rounded-xl p-3 space-y-1.5"
              style={{ background: "rgba(52,211,153,.06)", border: "1px solid rgba(52,211,153,.18)" }}>
              <p className="text-[10px] text-slate-500 font-medium">אם נגמר {actualA}–{actualB} (עכשיו)</p>
              <p className="text-emerald-400 text-lg font-black">+{myBonusNow} נק'</p>
              <p className="text-white text-xs font-bold">{myTotalNow.toFixed(1)} סה"כ</p>
              <p className="text-slate-400 text-[10px]">מקום {myRankIfCurrent}</p>
            </div>
            {/* My prediction column */}
            <div className="rounded-xl p-3 space-y-1.5"
              style={{ background: "rgba(245,197,24,.06)", border: "1px solid rgba(245,197,24,.22)" }}>
              <p className="text-[10px] text-slate-500 font-medium">אם ניחושי {myPredA}–{myPredB} מתממש</p>
              <p className="text-amber-400 text-lg font-black">+{myBonusIfMyPred} נק'</p>
              <p className="text-white text-xs font-bold">{myTotalIfMyPred.toFixed(1)} סה"כ</p>
              <p className="text-slate-400 text-[10px]">מקום {myRankIfMyPred}</p>
            </div>
          </div>
        </div>

        {/* ── Section 2: מי מאיים עלי? ─────────────────────────────── */}
        <div>
          <SectionHeader icon={AlertTriangle} title="מי מאיים עלי?" color="#f87171" />
          {threats.length === 0 ? (
            <p className="text-emerald-400 text-xs text-center py-2">אף אחד לא מאיים עליך כרגע ✓</p>
          ) : (
            <div className="space-y-1.5">
              {threats.map(p => (
                <div key={p.name} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: "rgba(248,113,113,.07)", border: "1px solid rgba(248,113,113,.22)" }}>
                  <span className="text-[10px] font-bold text-red-400 w-4 text-center">✗</span>
                  <p className="text-slate-300 text-xs flex-1">
                    <span className="font-bold text-white">{p.name}</span>
                    {" "}ניחש {p.predicted_a}–{p.predicted_b}
                  </p>
                  <span className="text-[10px] text-red-400 font-bold">יעקוף אותי!</span>
                  <span className="text-[9px] text-slate-500">{p.theirTotalIfRight.toFixed(1)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Players below me who are NOT threats */}
          {PLAYERS.filter((p, i) => i !== ME_INDEX && p.rank > ME.rank && !threats.find(t => t.name === p.name)).map(p => {
            const theirBonusIfRight = calcPoints(p.predicted_a, p.predicted_b, p.predicted_a, p.predicted_b);
            const theirTotalIfRight = p.pts + theirBonusIfRight;
            return (
              <div key={p.name} className="flex items-center gap-2 px-3 py-1.5 rounded-xl mt-1.5"
                style={{ background: "rgba(30,41,59,.5)", border: "1px solid rgba(71,85,105,.4)" }}>
                <span className="text-[10px] font-bold text-emerald-400 w-4 text-center">✓</span>
                <p className="text-slate-500 text-[10px] flex-1">
                  <span className="text-slate-400">{p.name}</span>
                  {" "}ניחש {p.predicted_a}–{p.predicted_b} — לא מאיים
                </p>
                <span className="text-[9px] text-slate-600">{theirTotalIfRight.toFixed(1)}</span>
              </div>
            );
          })}
        </div>

        {/* ── Section 3: מי אני יכול לעקוף? ────────────────────────── */}
        <div>
          <SectionHeader icon={Zap} title="מי אני יכול לעקוף?" color="#f5c518" />
          <div className="space-y-1.5">
            {canOvertake.map(p => (
              <div key={p.name} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: p.iOvertake ? "rgba(52,211,153,.07)" : "rgba(30,41,59,.5)",
                  border: `1px solid ${p.iOvertake ? "rgba(52,211,153,.22)" : "rgba(71,85,105,.4)"}`,
                }}>
                <span className="text-[10px] font-bold w-4 text-center"
                  style={{ color: p.iOvertake ? "#34d399" : "#475569" }}>
                  {p.iOvertake ? "✓" : "—"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs">
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-slate-500 text-[10px]"> ניחש {p.predicted_a}–{p.predicted_b}</span>
                  </p>
                  <p className="text-[9px] text-slate-600">
                    אם {CURRENT.a}–{CURRENT.b} נשאר: {p.theirTotalIfCurrent.toFixed(1)} נק' ({p.iOvertake ? "אני עוקף ✓" : "נשאר מעלי"})
                  </p>
                </div>
                <span className="text-[10px] font-bold flex-shrink-0"
                  style={{ color: p.iOvertake ? "#34d399" : "#64748b" }}>
                  מק' {p.rank}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 4: תרחיש הזהב ─────────────────────────────────── */}
        <div>
          <SectionHeader icon={Target} title="תרחיש הזהב" color="#f5c518" />
          {goldScore && (
            <div className="rounded-xl p-3 text-center"
              style={{ background: "linear-gradient(135deg,rgba(245,197,24,.12),rgba(245,158,11,.08))", border: "2px solid rgba(245,197,24,.35)" }}>
              <p className="text-slate-400 text-[10px] mb-1">התוצאה הכי טובה בשבילך:</p>
              <p className="text-amber-400 font-black text-2xl mb-1">
                {LIVE_MATCH.homeFlag} {goldScore.a}–{goldScore.b} {LIVE_MATCH.awayFlag}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-400 font-bold text-sm">+{goldBonus} נק'</span>
                <span className="text-slate-600">→</span>
                <span className="text-white font-bold text-sm">{(ME.pts + goldBonus).toFixed(1)} סה"כ</span>
                <span className="text-slate-600">→</span>
                <span className="text-amber-400 font-bold text-sm">מקום {goldRank}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Section 5: מי ניחש כמוני? ────────────────────────────── */}
        <div>
          <SectionHeader icon={Users} title="מי ניחש כמוני?" color="#a78bfa" />
          {sameBoat.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-2">אף אחד לא ניחש כמוך — אתה ייחודי</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sameBoat.map(p => (
                <div key={p.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.3)" }}>
                  <span className="text-purple-400 text-[10px]">⚓</span>
                  <span className="text-slate-200 text-xs font-medium">{p.name}</span>
                  <span className="text-purple-400 text-[9px]">ניחש גם {myPredA}–{myPredB}</span>
                </div>
              ))}
              <p className="w-full text-center text-[10px] text-slate-600 mt-0.5">אנחנו באותה סירה</p>
            </div>
          )}
        </div>

      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function AdminLiveCardDemo() {
  const [cardOpen, setCardOpen] = useState(true);

  return (
    <div className="space-y-5" dir="rtl">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.25)" }}>
          <Zap className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Live Card — דמו אישי</h2>
          <p className="text-slate-400 text-sm">
            {LIVE_MATCH.homeFlag} {LIVE_MATCH.home} {LIVE_MATCH.currentHome}–{LIVE_MATCH.currentAway} {LIVE_MATCH.away} {LIVE_MATCH.awayFlag} · {LIVE_MATCH.minute}'
          </p>
        </div>
      </div>

      {/* ── Leaderboard ─────────────────────────────────────────────── */}
      <div className="max-w-xs mx-auto rounded-2xl overflow-hidden"
        style={{ background: "rgba(5,10,20,0.97)", border: "1px solid rgba(255,255,255,.1)", boxShadow: "-8px 0 40px rgba(0,0,0,.4)" }}>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {/* Match chip */}
        <div className="mx-4 mt-4 mb-3 px-3 py-2 rounded-xl flex items-center gap-2"
          style={{ background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.25)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <span className="text-emerald-400 text-xs font-bold">
            {LIVE_MATCH.homeFlag} {LIVE_MATCH.home} {LIVE_MATCH.currentHome}–{LIVE_MATCH.currentAway} {LIVE_MATCH.away} {LIVE_MATCH.awayFlag}
          </span>
          <span className="text-slate-500 text-[10px] mr-auto">{LIVE_MATCH.minute}'</span>
        </div>

        {/* Cards */}
        <div className="px-4 pb-4 space-y-0">
          {sortedByLiveRank.map(p => (
            <LeaderboardCard key={p.name} player={p} isMe={p.name === ME.name} />
          ))}
        </div>

        <div className="h-px mx-4 bg-gradient-to-r from-transparent via-white/8 to-transparent mb-1" />
        <p className="text-center text-slate-700 text-[10px] pb-3">⚡ זמני · לא נשמר</p>
      </div>

      {/* ── Toggle button ─────────────────────────────────────────────── */}
      <div className="max-w-xs mx-auto">
        <motion.button
          onClick={() => setCardOpen(v => !v)}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all"
          style={{
            background: cardOpen
              ? "linear-gradient(135deg,rgba(52,211,153,.18),rgba(16,185,129,.08))"
              : "linear-gradient(135deg,rgba(52,211,153,.08),rgba(5,13,26,.9))",
            border: "1px solid rgba(52,211,153,.35)",
            color: "#34d399",
          }}>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            מה המצב שלי?
          </span>
          {cardOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* ── Personal card ─────────────────────────────────────────────── */}
      <div className="max-w-xs mx-auto">
        <AnimatePresence>
          {cardOpen && (
            <motion.div
              key="personal-card"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}>
              <PersonalCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        [dir="rtl"] .mr-auto { margin-right: auto; margin-left: 0; }
      `}</style>
    </div>
  );
}
