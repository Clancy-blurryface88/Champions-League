import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Lock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import ScoreCounter from "@/components/ScoreCounter";

// ── Mock data ────────────────────────────────────────────────────────────
// officialRank = standing before the live match; liveRank/score = after the
// live bonus is applied. Top 3 all shuffle so the reveal + diff view have
// something interesting to show.
const PARTICIPANTS = [
  { id: "moti",   name: "מוטי",   officialRank: 3, score: 149 },
  { id: "dima",   name: "דימה",   officialRank: 1, score: 145 },
  { id: "yossi",  name: "יוסי",   officialRank: 2, score: 140 },
  { id: "shai",   name: "שי",     officialRank: 4, score: 134 },
  { id: "tofahi", name: "טופחי", officialRank: 6, score: 127 },
  { id: "eli",    name: "אלי",    officialRank: 5, score: 125 },
  { id: "ron",    name: "רון",    officialRank: 7, score: 110 },
  { id: "guy",    name: "גיא",    officialRank: 8, score: 109 },
  { id: "omer",   name: "עומר",  officialRank: 9, score: 99 },
].map((p, i, arr) => ({ ...p, liveRank: i + 1 })); // array is already sorted by live score

const LIVE_MATCH = { home: "ברזיל", away: "ארגנטינה", score: "2–1", minute: 78 };

const RANK_COLOR  = r => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : 'rgba(255,255,255,.45)';
const RANK_BORDER = r => r === 1 ? '#FFD700' : r === 2 ? '#D1D5DB' : r === 3 ? '#D97706' : '#475569';
const RANK_BG     = r => r === 1 ? 'linear-gradient(135deg,rgba(250,204,21,.22),rgba(245,158,11,.22))'
                       : r === 2 ? 'linear-gradient(135deg,rgba(209,213,219,.18),rgba(156,163,175,.18))'
                       : r === 3 ? 'linear-gradient(135deg,rgba(245,158,11,.20),rgba(217,119,6,.20))'
                       : 'rgba(30,41,59,.60)';
const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

// ── Phase timeline ───────────────────────────────────────────────────────
const PHASES = [
  { key: 'match',      label: 'משחק חי',            duration: 2200 },
  { key: 'build',      label: 'טעינת 9 → 4',        duration: 2400 },
  { key: 'spot3',      label: 'זום מבעד — מקום 3', duration: 2300 },
  { key: 'spot2',      label: 'זום מבעד — מקום 2', duration: 2300 },
  { key: 'spot1',      label: 'זום מבעד — מקום 1', duration: 2800 },
  { key: 'collapsing', label: 'הקטנה חזרה לדירוג', duration: 900  },
  { key: 'final',      label: 'דירוג + הפרשים',     duration: 5000 },
];

function deltaOf(p) { return p.officialRank - p.liveRank; } // positive = climbed

function DeltaIcon({ delta }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={delta} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.2 }}>
        {delta > 0
          ? <span className="flex items-center gap-0.5 text-emerald-400 text-[11px] font-bold"><TrendingUp className="w-3.5 h-3.5" />+{delta}</span>
          : delta < 0
          ? <span className="flex items-center gap-0.5 text-red-400 text-[11px] font-bold"><TrendingDown className="w-3.5 h-3.5" />{delta}</span>
          : <Minus className="w-3.5 h-3.5 text-slate-600" />}
      </motion.div>
    </AnimatePresence>
  );
}

// ── Compact row (ranks 4-9 always, ranks 1-3 only once "revealed") ───────
function CompactRow({ p, appearDelay = 0, showDelta = false, layoutId }) {
  const rank = p.liveRank;
  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: appearDelay, duration: 0.45, ease: 'easeOut', layout: { type: 'spring', stiffness: 260, damping: 26 } }}
      className="relative mb-1.5">
      <div style={{
        borderRadius: 8, overflow: 'hidden', border: `2px solid ${RANK_BORDER(rank)}`,
        background: RANK_BG(rank), transition: 'border-color .5s ease, background .5s ease',
      }}>
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="font-black text-sm w-6 text-center flex-shrink-0" style={{ color: RANK_COLOR(rank) }}>
            {MEDAL[rank] || rank}
          </span>
          <p className="flex-1 min-w-0 truncate text-xs font-semibold text-slate-200">{p.name}</p>
          <span className="text-[11px] font-bold text-emerald-400 tabular-nums flex-shrink-0">
            <ScoreCounter value={p.score} duration={0.8} showDecimals={false} />
          </span>
          <div className="flex-shrink-0 w-11 flex justify-end">
            {showDelta && <DeltaIcon delta={deltaOf(p)} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Locked placeholder for ranks 1-3 while suspense builds ──────────────
function LockedSlot({ rank }) {
  return (
    <div className="relative mb-1.5 rounded-lg overflow-hidden border border-dashed border-slate-700/70"
      style={{ background: 'rgba(15,23,42,.5)' }}>
      <div className="flex items-center gap-2 px-3 py-2">
        <Lock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
        <div className="flex-1 h-2.5 rounded-full bg-slate-700/40 animate-pulse" style={{ maxWidth: 90 }} />
        <span className="text-slate-700 text-[10px] font-bold">#{rank}</span>
      </div>
    </div>
  );
}

// ── Big spotlight card — "זום מבעד" transition reused from the next-match demo ──
function SpotlightCard({ p, layoutId }) {
  const rank = p.liveRank;
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={p.id}
        layout
        layoutId={layoutId}
        initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        exit={{ scale: 1.6, opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl overflow-hidden" style={{
          width: 240, border: `3px solid ${RANK_BORDER(rank)}`, background: RANK_BG(rank),
          boxShadow: `0 0 40px ${RANK_BORDER(rank)}55, 0 10px 30px rgba(0,0,0,.6)`,
        }}>
          <div className="flex flex-col items-center gap-2 px-6 py-6">
            <span className="text-5xl leading-none">{MEDAL[rank]}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: RANK_COLOR(rank) }}>מקום {rank}</span>
            <p className="text-white text-xl font-black">{p.name}</p>
            <span className="text-3xl font-black tabular-nums" style={{ color: RANK_COLOR(rank) }}>
              <ScoreCounter value={p.score} duration={1.1} showDecimals={false} />
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Live match chip — big intro, then shrinks & pins to the top ─────────
function LiveMatchChip({ compact }) {
  return (
    <motion.div layout transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="mx-auto rounded-xl flex items-center gap-2"
      style={{
        background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.3)',
        padding: compact ? '6px 12px' : '16px 24px', marginBottom: compact ? 14 : 28,
        width: compact ? 'auto' : 260, justifyContent: 'center',
      }}>
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
      <span className="text-red-400 font-bold tabular-nums" style={{ fontSize: compact ? 12 : 18 }}>
        {LIVE_MATCH.home} {LIVE_MATCH.score} {LIVE_MATCH.away}
      </span>
      <span className="text-slate-500" style={{ fontSize: compact ? 10 : 13 }}>{LIVE_MATCH.minute}'</span>
    </motion.div>
  );
}

function PhaseDots({ idx, onPick }) {
  return (
    <div className="flex items-center justify-center flex-wrap gap-1.5 mt-4">
      {PHASES.map((ph, i) => (
        <button key={ph.key} onClick={() => onPick(i)}
          className="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border"
          style={{
            background: i === idx ? '#f5c518' : 'rgba(255,255,255,.05)',
            color: i === idx ? '#000' : 'rgba(255,255,255,.4)',
            borderColor: i === idx ? '#f5c518' : 'rgba(255,255,255,.1)',
          }}>
          {ph.label}
        </button>
      ))}
    </div>
  );
}

export default function AdminLeaderboardRevealDemo() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => setIdx(i => (i + 1) % PHASES.length), PHASES[idx].duration);
    return () => clearTimeout(timerRef.current);
  }, [idx, playing]);

  const phase = PHASES[idx].key;

  const spotParticipant = phase === 'spot3' ? PARTICIPANTS[2]
                        : phase === 'spot2' ? PARTICIPANTS[1]
                        : phase === 'spot1' ? PARTICIPANTS[0]
                        : null;

  const overlayVisible = !!spotParticipant;
  const top3Revealed   = phase === 'collapsing' || phase === 'final';
  const showMidList    = phase !== 'match'; // ranks 4-9 mounted from 'build' onward

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🏆 חשיפת דירוג לייב — זום מבעד</h2>
        <p className="text-slate-400 text-sm max-w-2xl">
          דמו לרצף: משחק לייב ← טעינה רגילה של מקומות 9 עד 4 ← מקום 3, 2 ו-1 נחשפים בזה אחר זה
          בכרטיס גדול עם אפקט "זום מבעד" ומסגרת צבע תואמת (ארד/כסף/זהב) ← הקטנה חזרה לדירוג הרגיל
          ← תצוגת ההפרש (עלה/ירד מקומות) ביחס לתוצאת הלייב. אפשר ללחוץ על כל שלב למטה כדי לקפוץ אליו ישירות.
        </p>
      </div>

      <div className="max-w-sm mx-auto rounded-2xl overflow-hidden"
        style={{ background: 'rgba(5,10,20,0.97)', border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>

        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        <div className="px-5 py-6 relative" style={{ minHeight: 520 }}>

          {/* live match — big during 'match', pinned+small afterwards */}
          <LiveMatchChip compact={phase !== 'match'} />

          <AnimatePresence>
            {phase === 'match' && (
              <motion.p key="match-caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center text-slate-500 text-xs">מציג את תוצאת המשחק החי לפני שהדירוג נטען...</motion.p>
            )}
          </AnimatePresence>

          {/* leaderboard */}
          {showMidList && (
            <div className="relative" style={{ minHeight: 380 }}>
              {/* top 3 slots */}
              <div className="mb-1">
                {[0, 1, 2].map(i => {
                  const p = PARTICIPANTS[i];
                  return top3Revealed
                    ? <CompactRow key={p.id} p={p} showDelta={phase === 'final'} layoutId={i === 0 ? 'card-champion' : undefined} />
                    : <LockedSlot key={p.id} rank={p.liveRank} />;
                })}
              </div>

              {/* ranks 4-9 — cascade in during 'build', from 9 up to 4 */}
              <div style={{ opacity: overlayVisible ? 0.25 : 1, filter: overlayVisible ? 'blur(2px)' : 'none', transition: 'opacity .3s, filter .3s' }}>
                {PARTICIPANTS.slice(3).map((p, i) => {
                  const orderFromBottom = PARTICIPANTS.length - 1 - (i + 3); // rank9 → 0, rank4 → 5
                  return (
                    <CompactRow key={p.id} p={p} appearDelay={orderFromBottom * 0.15} showDelta={phase === 'final'} />
                  );
                })}
              </div>

              {/* spotlight overlay */}
              {overlayVisible && (
                <SpotlightCard p={spotParticipant} layoutId={spotParticipant.id === 'dima' ? 'card-champion' : undefined} />
              )}
            </div>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      </div>

      {/* controls */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setPlaying(p => !p)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {playing ? 'השהה' : 'הפעל'}
        </button>
        <button onClick={() => { setIdx(0); setPlaying(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
          <RotateCcw className="w-3.5 h-3.5" /> הפעל מחדש
        </button>
      </div>

      <PhaseDots idx={idx} onPick={(i) => setIdx(i)} />
    </div>
  );
}
