import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Lock } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";

// ── Mock data — 4 fictional semifinalists + their road to get here ──────
const TEAMS = [
  {
    id: 'br', name: 'ברזיל', flag: 'br',
    path: [
      { stage: 'בתים',        opp: 'סרביה',         oppFlag: 'rs', score: '2-0' },
      { stage: 'בתים',        opp: 'שוויץ',         oppFlag: 'ch', score: '3-1' },
      { stage: 'בתים',        opp: 'קמרון',         oppFlag: 'cm', score: '1-1' },
      { stage: 'שמינית גמר', opp: 'דרום קוריאה', oppFlag: 'kr', score: '2-0' },
      { stage: 'רבע גמר',    opp: 'הולנד',         oppFlag: 'nl', score: '1-0' },
    ],
  },
  {
    id: 'ar', name: 'ארגנטינה', flag: 'ar',
    path: [
      { stage: 'בתים',        opp: 'פולין',          oppFlag: 'pl', score: '2-0' },
      { stage: 'בתים',        opp: 'מקסיקו',        oppFlag: 'mx', score: '2-0' },
      { stage: 'בתים',        opp: 'ערב הסעודית', oppFlag: 'sa', score: '2-1' },
      { stage: 'שמינית גמר', opp: 'אוסטרליה',      oppFlag: 'au', score: '2-1' },
      { stage: 'רבע גמר',    opp: 'פורטוגל',       oppFlag: 'pt', score: '2-1' },
    ],
  },
  {
    id: 'fr', name: 'צרפת', flag: 'fr',
    path: [
      { stage: 'בתים',        opp: 'דנמרק',   oppFlag: 'dk', score: '2-1' },
      { stage: 'בתים',        opp: 'תוניסיה', oppFlag: 'tn', score: '1-0' },
      { stage: 'בתים',        opp: 'פרו',      oppFlag: 'pe', score: '3-0' },
      { stage: 'שמינית גמר', opp: 'פולין',    oppFlag: 'pl', score: '3-1' },
      { stage: 'רבע גמר',    opp: 'מרוקו',    oppFlag: 'ma', score: '2-0' },
    ],
  },
  {
    id: 'gb-eng', name: 'אנגליה', flag: 'gb-eng',
    path: [
      { stage: 'בתים',        opp: 'איראן',    oppFlag: 'ir',     score: '6-2' },
      { stage: 'בתים',        opp: 'ארה"ב',   oppFlag: 'us',     score: '0-0' },
      { stage: 'בתים',        opp: 'ויילס',    oppFlag: 'gb-wls', score: '3-0' },
      { stage: 'שמינית גמר', opp: 'סנגל',     oppFlag: 'sn',     score: '3-0' },
      { stage: 'רבע גמר',    opp: 'קרואטיה', oppFlag: 'hr',     score: '2-1' },
    ],
  },
];

// Semifinal matchups, ordered by date (earliest first)
const SF_MATCHES = [
  { pair: [TEAMS[0], TEAMS[1]], date: '09.07' },
  { pair: [TEAMS[2], TEAMS[3]], date: '10.07' },
];

const NODE_STEP = 750; // ms between each path-node revealing (slow enough to actually read)
const teamRoadDuration = team => 900 + team.path.length * NODE_STEP;
const matchOf = teamIdx => Math.floor(teamIdx / 2); // which SF match a team belongs to

// Interleaved sequence: intro -> match 1 -> its 2 teams' roads -> match 2 -> its 2 teams' roads
const PHASES = [
  { key: 'intro',    label: 'פתיחה' },
  { key: 'match-0',  label: `משחק 1 (${SF_MATCHES[0].date})` },
  { key: 'team-0',   label: `הדרך: ${TEAMS[0].name}` },
  { key: 'team-1',   label: `הדרך: ${TEAMS[1].name}` },
  { key: 'match-1',  label: `משחק 2 (${SF_MATCHES[1].date})` },
  { key: 'team-2',   label: `הדרך: ${TEAMS[2].name}` },
  { key: 'team-3',   label: `הדרך: ${TEAMS[3].name}` },
].map(p => ({
  ...p,
  duration: p.key === 'intro' ? 1800
          : p.key.startsWith('match-') ? 3200
          : teamRoadDuration(TEAMS[parseInt(p.key.split('-')[1], 10)]),
}));

const matchPhaseIdx = m => PHASES.findIndex(p => p.key === `match-${m}`);
const teamPhaseIdx  = t => PHASES.findIndex(p => p.key === `team-${t}`);

// ── Top strip — locked until a team's match is revealed, highlighted while
// its road is being told, settled once done ─────────────────────────────
function SemifinalistStrip({ phaseIdx }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      {TEAMS.map((t, i) => {
        const revealedAt = matchPhaseIdx(matchOf(i));
        const ownPhaseIdx = teamPhaseIdx(i);
        const state = phaseIdx < revealedAt ? 'locked'
                    : phaseIdx === ownPhaseIdx ? 'active'
                    : phaseIdx > ownPhaseIdx ? 'done'
                    : 'known';
        return (
          <div key={t.id} className="flex flex-col items-center gap-1" style={{ width: 52 }}>
            {state === 'locked' ? (
              <div className="w-8 h-8 rounded-full border border-dashed border-slate-700 flex items-center justify-center flex-shrink-0">
                <Lock className="w-3 h-3 text-slate-600" />
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: state === 'active' ? 1.08 : 1, opacity: state === 'known' ? 0.5 : 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                style={{
                  borderRadius: '9999px',
                  boxShadow: state === 'active' ? '0 0 12px rgba(245,197,24,.6)' : 'none',
                  border: state === 'active' ? '2px solid #f5c518' : '2px solid transparent',
                }}>
                <TeamFlag logo={t.flag} name={t.name} className="w-8 h-8" rounded="full" />
              </motion.div>
            )}
            <span className={`text-[9px] font-semibold ${state === 'active' ? 'text-amber-400' : state === 'done' ? 'text-slate-300' : 'text-slate-600'}`}>
              {state === 'locked' ? '?' : t.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── One team's road: flag intro + cascading match-node timeline ─────────
function TeamRoad({ team }) {
  return (
    <motion.div key={team.id}
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-4">

      {/* header — flag zoom-through */}
      <div className="flex flex-col items-center gap-2">
        <motion.div
          initial={{ scale: 0.4, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ borderRadius: '9999px', border: '3px solid #f5c518', boxShadow: '0 0 30px rgba(245,197,24,.35)' }}>
          <TeamFlag logo={team.flag} name={team.name} className="w-16 h-16" rounded="full" />
        </motion.div>
        <h3 className="text-white text-lg font-black">{team.name}</h3>
        <p className="text-amber-400/70 text-[10px] font-bold tracking-widest uppercase">הדרך לחצי הגמר</p>
      </div>

      {/* path timeline */}
      <div className="relative" style={{ width: 240 }}>
        <motion.div
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: (team.path.length * NODE_STEP) / 1000, ease: 'linear' }}
          className="absolute"
          style={{ right: 11, top: 6, bottom: 6, width: 2, background: 'linear-gradient(to bottom, rgba(245,197,24,.7), rgba(245,197,24,.05))', transformOrigin: 'top' }}
        />
        {team.path.map((node, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * (NODE_STEP / 1000), duration: 0.35 }}
            className="relative flex items-center gap-2 mb-2.5 pr-7">
            <span className="absolute right-[8px] w-2 h-2 rounded-full bg-amber-400" style={{ boxShadow: '0 0 6px rgba(245,197,24,.8)' }} />
            <span className="text-[9px] text-slate-500 flex-shrink-0" style={{ width: 58 }}>{node.stage}</span>
            <TeamFlag logo={node.oppFlag} name={node.opp} className="w-4 h-4 flex-shrink-0" rounded="sm" />
            <span className="text-slate-300 text-[11px] flex-1 truncate">{node.opp}</span>
            <span className="text-emerald-400 font-bold text-xs tabular-nums flex-shrink-0">{node.score}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Single semifinal match reveal — dramatic slam-in flags + VS burst ───
function MatchReveal({ match, index }) {
  return (
    <motion.div key={`match-${index}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-6">

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="flex flex-col items-center gap-1">
        <span className="text-amber-400 text-[10px] font-bold tracking-widest uppercase">חצי גמר {index + 1}</span>
        <span className="text-slate-500 text-[10px]">{match.date}</span>
      </motion.div>

      <div className="relative flex items-center justify-center gap-5" style={{ minHeight: 110, width: 280 }}>
        {/* team A — slams in from the right */}
        <motion.div
          initial={{ x: 140, opacity: 0, scale: 0.5, rotate: 10 }}
          animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 15, delay: 0.35 }}
          className="flex flex-col items-center gap-2 flex-1">
          <div style={{ borderRadius: '9999px', border: '3px solid #f5c518', boxShadow: '0 0 26px rgba(245,197,24,.45)' }}>
            <TeamFlag logo={match.pair[0].flag} name={match.pair[0].name} className="w-16 h-16" rounded="full" />
          </div>
          <span className="text-white font-black text-xs">{match.pair[0].name}</span>
        </motion.div>

        {/* VS burst */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 11, delay: 0.95 }}
          className="text-2xl font-black flex-shrink-0" style={{ color: '#f5c518', textShadow: '0 0 18px rgba(245,197,24,.7)' }}>
          VS
        </motion.div>

        {/* team B — slams in from the left */}
        <motion.div
          initial={{ x: -140, opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 15, delay: 0.55 }}
          className="flex flex-col items-center gap-2 flex-1">
          <div style={{ borderRadius: '9999px', border: '3px solid #f5c518', boxShadow: '0 0 26px rgba(245,197,24,.45)' }}>
            <TeamFlag logo={match.pair[1].flag} name={match.pair[1].name} className="w-16 h-16" rounded="full" />
          </div>
          <span className="text-white font-black text-xs">{match.pair[1].name}</span>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="h-px w-48 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
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

export default function AdminSemifinalRevealDemo() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => setIdx(i => (i + 1) % PHASES.length), PHASES[idx].duration);
    return () => clearTimeout(timerRef.current);
  }, [idx, playing]);

  const phase = PHASES[idx].key;
  const teamIdx = phase.startsWith('team-') ? parseInt(phase.split('-')[1], 10) : null;
  const matchIdx = phase.startsWith('match-') ? parseInt(phase.split('-')[1], 10) : null;

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🏆 הדרך לחצי הגמר — דמו חד-פעמי</h2>
        <p className="text-slate-400 text-sm max-w-2xl">
          עכשיו לפי סדר המשחקים בפועל: קודם המשחק הראשון לפי התאריך (עם כניסה דרמטית של שני הדגלים
          ו"VS" מתפוצץ), ואז הדרך של כל אחת משתי הנבחרות שבו ← ואז המשחק השני, וכך גם שתי הנבחרות שלו.
          אפשר ללחוץ על כל שלב למטה כדי לקפוץ אליו ישירות. הכל כאן נתוני דמו בלבד.
        </p>
      </div>

      <div className="max-w-sm mx-auto rounded-2xl overflow-hidden"
        style={{ background: 'rgba(5,10,20,0.97)', border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        <div className="px-5 py-6" style={{ minHeight: 480 }}>
          {phase !== 'intro' && <SemifinalistStrip phaseIdx={idx} />}

          <AnimatePresence mode="wait">
            {phase === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3" style={{ minHeight: 380 }}>
                <span className="text-5xl">🏆</span>
                <h2 className="text-white text-2xl font-black">הדרך לחצי הגמר</h2>
                <p className="text-slate-500 text-xs">4 נבחרות. דרך אחת. חצי גמר.</p>
              </motion.div>
            )}

            {teamIdx !== null && <TeamRoad key={phase} team={TEAMS[teamIdx]} />}

            {matchIdx !== null && <MatchReveal key={phase} match={SF_MATCHES[matchIdx]} index={matchIdx} />}
          </AnimatePresence>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      </div>

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

      <PhaseDots idx={idx} onPick={setIdx} />
    </div>
  );
}
