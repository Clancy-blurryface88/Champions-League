import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Clock, Zap, FlaskConical, Plus, Minus, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { Match, Prediction, UserStats, PublicProfile } from "@/api/entities";
import ScoreCounter from "@/components/ScoreCounter";

// ── Score calculation (identical copy from AdminScoring) ──────────────────
function calculateScore(prediction, match) {
  if (match.actual_score_a === null || match.actual_score_b === null) return { totalPoints: 0 };
  const pA = prediction.predicted_score_a;
  const pB = prediction.predicted_score_b;
  const aA = match.actual_score_a;
  const aB = match.actual_score_b;
  let total = 0;
  if (pA === aA && pB === aB) {
    if (match.score_odds) {
      const key = `${aA}:${aB}`;
      total += match.score_odds[key] ?? match.score_odds['other'] ?? 0;
    } else {
      total += match.exact_score_points || 0;
    }
  }
  const pDir = pA > pB ? 'home' : pA < pB ? 'away' : 'draw';
  const aDir = aA > aB ? 'home' : aA < aB ? 'away' : 'draw';
  if (pDir === aDir) total += aDir === 'home' ? (match.home_win_points || 0) : aDir === 'away' ? (match.away_win_points || 0) : (match.draw_points || 0);
  const aBTTS = aA > 0 && aB > 0, pBTTS = pA > 0 && pB > 0;
  if (pBTTS === aBTTS) total += aBTTS ? (match.btts_yes_points || 0) : (match.btts_no_points || 0);
  const aGoals = aA + aB, pGoals = pA + pB;
  const aRange = aGoals <= 2 ? '0-2' : aGoals <= 4 ? '3-4' : '5+';
  const pRange = pGoals <= 2 ? '0-2' : pGoals <= 4 ? '3-4' : '5+';
  if (pRange === aRange) total += aRange === '0-2' ? (match.goals_0_2_points || 0) : aRange === '3-4' ? (match.goals_3_4_points || 0) : (match.goals_5_plus_points || 0);
  return { totalPoints: parseFloat(total.toFixed(2)) };
}

function normalizeName(n = '') { return n.toLowerCase().replace(/[^a-z0-9א-ת]/g, ''); }
function teamsMatch(a, b) { const na = normalizeName(a), nb = normalizeName(b); return na === nb || na.includes(nb) || nb.includes(na); }
function findDbMatch(apiMatch, dbMatches) {
  const h = apiMatch.homeTeam?.name || '', hS = apiMatch.homeTeam?.shortName || '';
  const a = apiMatch.awayTeam?.name || '', aS = apiMatch.awayTeam?.shortName || '';
  return dbMatches.find(m => (teamsMatch(h, m.team_a) || teamsMatch(hS, m.team_a)) && (teamsMatch(a, m.team_b) || teamsMatch(aS, m.team_b))) || null;
}

function deltaText(delta) {
  if (delta === 0) return null;
  const n = Math.abs(delta);
  return `${delta > 0 ? 'עלה' : 'ירד'} ${n === 1 ? 'מקום' : `${n} מקומות`}`;
}

// ── Match card for tabs 1-3 ─────────────────────────────────────────────────
const STATUS_MAP = {
  IN_PLAY:   { label: 'LIVE',    dot: 'bg-red-500',    text: 'text-red-400',    pulse: true  },
  PAUSED:    { label: 'HT',      dot: 'bg-orange-400', text: 'text-orange-400', pulse: false },
  FINISHED:  { label: 'FT',      dot: 'bg-slate-500',  text: 'text-slate-400',  pulse: false },
  SCHEDULED: { label: 'מתוכנן', dot: 'bg-blue-500',   text: 'text-blue-400',   pulse: false },
  TIMED:     { label: 'מתוכנן', dot: 'bg-blue-500',   text: 'text-blue-400',   pulse: false },
};
function StatusBadge({ status, minute }) {
  const s = STATUS_MAP[status] || { label: status, dot: 'bg-slate-600', text: 'text-slate-400', pulse: false };
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`} />
      <span className={`text-[10px] font-bold tracking-widest uppercase ${s.text}`}>{s.label}{minute != null && (status === 'IN_PLAY' || status === 'PAUSED') ? ` ${minute}'` : ''}</span>
    </div>
  );
}
function MatchCard({ match, index }) {
  const home = match.homeTeam?.shortName || match.homeTeam?.name || '?';
  const away = match.awayTeam?.shortName || match.awayTeam?.name || '?';
  const hS = match.score?.fullTime?.home ?? null;
  const aS = match.score?.fullTime?.away ?? null;
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className="rounded-2xl mb-3 overflow-hidden"
      style={{ background: isLive ? 'linear-gradient(135deg,rgba(16,185,129,.06),rgba(5,13,26,.9))' : 'rgba(255,255,255,.04)', border: isLive ? '1px solid rgba(16,185,129,.25)' : '1px solid rgba(255,255,255,.07)' }}>
      {isLive && <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <StatusBadge status={match.status} minute={match.minute} />
          {match.utcDate && !isLive && <span className="text-[10px] text-slate-500">{new Date(match.utcDate).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-white/80 text-xs font-semibold flex-1">{home}</span>
          {hS !== null ? (
            <motion.span className="text-lg font-black tabular-nums mx-2"
              animate={isLive ? { opacity: [1, .7, 1] } : {}} transition={{ duration: 2.5, repeat: Infinity }}
              style={{ background: isLive ? 'linear-gradient(135deg,#34d399,#fff)' : 'linear-gradient(135deg,#94a3b8,#fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {hS} – {aS}
            </motion.span>
          ) : (
            <span className="text-white/20 text-sm mx-2">vs</span>
          )}
          <span className="text-white/80 text-xs font-semibold flex-1 text-right">{away}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Rank card ───────────────────────────────────────────────────────────────
const RANK_COLOR  = r => r === 1 ? '#7dd3fc' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : 'rgba(255,255,255,.45)';
const RANK_BORDER = r => r === 1 ? '#7dd3fc' : r === 2 ? '#D1D5DB' : r === 3 ? '#D97706' : '#475569';
const RANK_BG     = r => r === 1 ? 'linear-gradient(135deg,rgba(125,211,252,.22),rgba(56,189,248,.22))'
                       : r === 2 ? 'linear-gradient(135deg,rgba(209,213,219,.18),rgba(156,163,175,.18))'
                       : r === 3 ? 'linear-gradient(135deg,rgba(56,189,248,.20),rgba(217,119,6,.20))'
                       : 'rgba(30,41,59,.60)';
const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

// ── Delta indicator — TrendingUp/Down + number (same as demo option 2) ──────
function DeltaIcon({ delta }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={delta}
        initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
        transition={{ duration: 0.2 }}>
        {delta > 0
          ? <span className="flex items-center gap-0.5 text-emerald-400 text-[11px] font-bold"><TrendingUp className="w-3.5 h-3.5"/>+{delta}</span>
          : delta < 0
          ? <span className="flex items-center gap-0.5 text-red-400 text-[11px] font-bold"><TrendingDown className="w-3.5 h-3.5"/>{delta}</span>
          : <Minus className="w-3.5 h-3.5 text-slate-600"/>
        }
      </motion.div>
    </AnimatePresence>
  );
}

// ── Rank card ───────────────────────────────────────────────────────────────
// Layout (LTR): [ghost rank] [name flex-1] [score] [delta icon]
// Ghost rank = large translucent number, no medals
// No bonus chip — points just count up to the new total
function RankCard({ row, index, total, shockwave, isInitial }) {
  const delta          = row.officialRank - row.liveRank;
  const rankFromBottom = total - 1 - index; // 0=rank1 (longest delay)
  // Faster initial: pow 1.4 * 0.26 instead of 1.6 * 0.36
  const cardDelay      = isInitial ? Math.pow(rankFromBottom, 1.4) * 0.26 + (row.liveRank === 1 ? 0.4 : 0) : 0;
  // Initial: 1.1s | Live update: 2.8s (suspense)
  const scoreDuration  = isInitial ? 1.1 : 2.8;
  const scoreDelay     = isInitial ? cardDelay + 0.2 : 0;
  const shockDelay     = (total - 1 - index) * 0.18;
  const border         = RANK_BORDER(row.liveRank);
  const bg             = RANK_BG(row.liveRank);

  return (
    <motion.div
      layout
      layoutId={row.userId}
      initial={isInitial ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        layout: { type: 'spring', stiffness: 30, damping: 16 },
        ...(isInitial ? { delay: cardDelay, duration: 0.5, ease: 'easeOut' } : {}),
      }}
      className="relative mb-1">

      {shockwave && isInitial && (
        <motion.div className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: [0, .2, 0] }}
          transition={{ duration: .55, delay: shockDelay }}
          style={{ background: 'rgba(125,211,252,.22)', zIndex: 5 }} />
      )}

      {/* parallelogram card */}
      <div style={{
        transform: 'skewX(-6deg)', borderRadius: 8, overflow: 'hidden',
        border: `2px solid ${border}`, background: bg,
        transition: 'border-color .5s ease, background .5s ease',
        position: 'relative',
      }}>
        {/* ghost rank number — large, translucent, behind content */}
        <span style={{
          position: 'absolute', left: 8, top: '50%',
          transform: 'translateY(-50%) skewX(6deg)',
          fontSize: 28, fontWeight: 900,
          color: RANK_COLOR(row.liveRank),
          opacity: 0.15, lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
          transition: 'color .5s ease',
        }}>
          {row.liveRank}
        </span>

        {/* content row — counter-skewed, pl to avoid ghost overlap */}
        <div style={{ transform: 'skewX(6deg)', padding: '9px 6px 9px 34px' }}>
          <div className="flex items-center gap-1">

            {/* name */}
            <p className="flex-1 min-w-0 truncate text-xs font-semibold text-slate-200"
              style={isInitial ? { animation: `lp-blur-focus 1.0s ease-out both`, animationDelay: `${cardDelay}s` } : {}}>
              {row.name}
            </p>

            {/* score — right of name */}
            <span className="text-[11px] font-bold text-emerald-400 tabular-nums flex-shrink-0">
              <ScoreCounter value={row.total} duration={scoreDuration} delay={scoreDelay} showDecimals={true} />
            </span>

            {/* delta — right of score */}
            <div className="flex-shrink-0 w-12 flex justify-end">
              <DeltaIcon delta={delta} />
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Live Leaderboard Tab ────────────────────────────────────────────────────
function LiveLBTab() {
  const [status, setStatus]       = useState('idle');
  const [rows, setRows]           = useState([]);
  const [liveInfo, setLiveInfo]   = useState(null);
  const [shockwave, setShockwave] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // simulation state
  const [simMode, setSimMode]   = useState(false);
  const [simScore, setSimScore] = useState({ h: 1, a: 1 });
  const dbRef        = useRef(null);
  const isInitialRef = useRef(true); // true only for the very first buildAndSet call
  const glowTimer    = useRef(null);

  const triggerGlow = (total) => {
    if (glowTimer.current) clearTimeout(glowTimer.current);
    const glowAt = (Math.pow(total - 1, 1.6) * 0.36 + 0.5 + 1.4 + 0.6) * 1000;
    glowTimer.current = setTimeout(() => setShockwave(true), glowAt);
  };

  const buildAndSet = useCallback((uniqueStats, officialRankMap, getName, liveBonus, liveMatchInfo) => {
    const isInitial = isInitialRef.current;
    isInitialRef.current = false;

    const built = uniqueStats.map(s => {
      const bonus     = liveBonus[s.user_id] || 0;
      const confirmed = s.total_points || 0;
      return {
        userId:       s.user_id,
        name:         getName(s.user_id),
        confirmed:    parseFloat(confirmed.toFixed(2)),
        liveBonus:    parseFloat(bonus.toFixed(2)),
        total:        parseFloat((confirmed + bonus).toFixed(2)),
        officialRank: officialRankMap[s.user_id] || 99,
      };
    });
    built.sort((a, b) => b.total - a.total);
    built.forEach((r, i) => { r.liveRank = i + 1; });
    built.sort((a, b) => a.liveRank - b.liveRank); // rank 1 first

    setIsInitialLoad(isInitial);
    setRows(built);
    setLiveInfo(liveMatchInfo);
    setLastUpdate(new Date());
    if (isInitial) {
      setShockwave(false);
      triggerGlow(built.length);
    }
  }, []);

  // apply simulated score to stored data
  const applySimScore = useCallback((score) => {
    const d = dbRef.current;
    if (!d || !d.simMatch) return;
    const { uniqueStats, officialRankMap, getName, allPreds, simMatch } = d;
    const liveDbMatch = { ...simMatch, actual_score_a: score.h, actual_score_b: score.a };
    const matchPreds = allPreds.filter(p => p.match_id === simMatch.id);
    const latestMap = {};
    matchPreds.forEach(p => {
      if (!latestMap[p.user_id] || new Date(p.created_at) > new Date(latestMap[p.user_id].created_at))
        latestMap[p.user_id] = p;
    });
    const liveBonus = {};
    Object.values(latestMap).forEach(pred => {
      const b = calculateScore(pred, liveDbMatch);
      liveBonus[pred.user_id] = b.totalPoints;
    });
    buildAndSet(uniqueStats, officialRankMap, getName, liveBonus, {
      home: simMatch.team_a, away: simMatch.team_b,
      score: `${score.h}–${score.a}`, minute: '🧪',
    });
  }, [buildAndSet]);

  const load = useCallback(async () => {
    setStatus('loading');
    setShockwave(false);
    try {
      const [allMatches, allProfiles, allStats, allPreds] = await Promise.all([
        Match.list(), PublicProfile.list(), UserStats.list(), Prediction.list(),
      ]);

      const nameMap = {};
      allProfiles.forEach(p => { nameMap[p.user_id] = p.display_name; });
      const getName = uid => nameMap[uid] || uid.slice(0, 8);

      const statsMap = {};
      allStats.forEach(s => {
        if (!statsMap[s.user_id] || (s.total_points || 0) > (statsMap[s.user_id].total_points || 0))
          statsMap[s.user_id] = s;
      });
      const uniqueStats = Object.values(statsMap).filter(s => {
        const n = nameMap[s.user_id]; return n && !n.startsWith('user_');
      });

      const officialSorted = [...uniqueStats].sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
      const officialRankMap = {};
      officialSorted.forEach((s, i) => { officialRankMap[s.user_id] = i + 1; });

      // pick a simulation match: first unfinished match with predictions, else any match with preds
      const predMatchIds = new Set(allPreds.map(p => p.match_id));
      const simMatch = allMatches.find(m => !m.is_finished && predMatchIds.has(m.id))
                    || allMatches.find(m => predMatchIds.has(m.id))
                    || null;

      dbRef.current = { uniqueStats, officialRankMap, getName, allPreds, allMatches, simMatch };

      // live match from API
      const localDate = new Date().toLocaleDateString('sv-SE');
      const res = await fetch(`/api/football?competition=WC&filter=LIVE&date=${localDate}`);
      const json = await res.json();
      const apiMatch = (json.matches || [])[0] || null;

      let liveBonus = {};
      let liveMatchInfo = null;

      if (apiMatch) {
        const dbMatch = findDbMatch(apiMatch, allMatches);
        if (dbMatch) {
          const hS = apiMatch.score?.fullTime?.home ?? apiMatch.score?.halfTime?.home ?? 0;
          const aS = apiMatch.score?.fullTime?.away ?? apiMatch.score?.halfTime?.away ?? 0;
          liveMatchInfo = { home: apiMatch.homeTeam?.name || dbMatch.team_a, away: apiMatch.awayTeam?.name || dbMatch.team_b, score: `${hS}–${aS}`, minute: apiMatch.minute };
          const liveDbMatch = { ...dbMatch, actual_score_a: hS, actual_score_b: aS };
          const matchPreds = allPreds.filter(p => p.match_id === dbMatch.id);
          const latestMap = {};
          matchPreds.forEach(p => {
            if (!latestMap[p.user_id] || new Date(p.created_at) > new Date(latestMap[p.user_id].created_at))
              latestMap[p.user_id] = p;
          });
          Object.values(latestMap).forEach(pred => {
            const b = calculateScore(pred, liveDbMatch);
            liveBonus[pred.user_id] = b.totalPoints;
          });
        }
      }

      buildAndSet(uniqueStats, officialRankMap, getName, liveBonus, liveMatchInfo);
      setStatus('done');

    } catch (e) {
      console.error('LiveLBTab:', e);
      setStatus('error');
    }
  }, [buildAndSet]);

  useEffect(() => { load(); return () => { if (glowTimer.current) clearTimeout(glowTimer.current); }; }, [load]);

  // when sim score changes while in sim mode
  useEffect(() => {
    if (simMode && status === 'done') applySimScore(simScore);
  }, [simScore, simMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSim = () => {
    if (!simMode) {
      setSimMode(true);
      applySimScore(simScore);
    } else {
      setSimMode(false);
      load();
    }
  };

  if (status === 'loading' && rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
        <span className="text-slate-500 text-xs">טוען נתונים...</span>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="text-center py-16">
        <WifiOff className="w-10 h-10 text-red-400/40 mx-auto mb-3" />
        <p className="text-red-400 text-sm mb-3">שגיאה בטעינת נתונים</p>
        <button onClick={load} className="text-sky-400 text-xs underline">נסה שוב</button>
      </div>
    );
  }

  const d = dbRef.current;

  return (
    <div>
      {/* live match chip */}
      <AnimatePresence mode="wait">
        {liveInfo ? (
          <motion.div key="live" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-3 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: simMode ? 'rgba(139,92,246,.08)' : 'rgba(52,211,153,.08)', border: `1px solid ${simMode ? 'rgba(139,92,246,.3)' : 'rgba(52,211,153,.25)'}` }}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${simMode ? 'bg-purple-400' : 'bg-red-500 animate-pulse'}`} />
            <span className="font-bold text-xs" style={{ color: simMode ? '#a78bfa' : '#34d399' }}>
              {liveInfo.home} {liveInfo.score} {liveInfo.away}
            </span>
            {liveInfo.minute && <span className="text-slate-500 text-[10px]">{typeof liveInfo.minute === 'number' ? `${liveInfo.minute}'` : liveInfo.minute}</span>}
            {simMode && <span className="text-purple-400 text-[10px] font-bold mr-auto">הדמיה</span>}
          </motion.div>
        ) : (
          <motion.div key="no-live" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-3 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(100,116,139,.06)', border: '1px solid rgba(100,116,139,.2)' }}>
            <p className="text-slate-500 text-xs">אין משחק חי — ניקוד רשמי</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* simulation panel */}
      {d?.simMatch && (
        <div className="mb-3">
          <button onClick={toggleSim}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all border"
            style={{
              background: simMode ? 'rgba(139,92,246,.15)' : 'rgba(139,92,246,.06)',
              border: `1px solid ${simMode ? 'rgba(139,92,246,.5)' : 'rgba(139,92,246,.2)'}`,
              color: simMode ? '#a78bfa' : '#7c3aed',
            }}>
            <FlaskConical className="w-3.5 h-3.5" />
            {simMode ? 'צא ממצב הדמיה ← חזור לאמיתי' : `🧪 הדמה משחק: ${d.simMatch.team_a} vs ${d.simMatch.team_b}`}
          </button>

          <AnimatePresence>
            {simMode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden">
                <div className="mt-2 px-3 py-3 rounded-xl flex items-center justify-between gap-4"
                  style={{ background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.2)' }}>
                  {/* Home score */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-slate-400 text-[10px] truncate max-w-[70px] text-center">{d.simMatch.team_a}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSimScore(s => ({ ...s, h: Math.max(0, s.h - 1) }))}
                        className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 transition-all">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-black text-xl w-8 text-center">{simScore.h}</span>
                      <button onClick={() => setSimScore(s => ({ ...s, h: s.h + 1 }))}
                        className="w-6 h-6 rounded-lg bg-purple-700 text-white flex items-center justify-center hover:bg-purple-600 transition-all">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <span className="text-slate-600 font-bold text-lg">–</span>

                  {/* Away score */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-slate-400 text-[10px] truncate max-w-[70px] text-center">{d.simMatch.team_b}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSimScore(s => ({ ...s, a: Math.max(0, s.a - 1) }))}
                        className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 transition-all">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-black text-xl w-8 text-center">{simScore.a}</span>
                      <button onClick={() => setSimScore(s => ({ ...s, a: s.a + 1 }))}
                        className="w-6 h-6 rounded-lg bg-purple-700 text-white flex items-center justify-center hover:bg-purple-600 transition-all">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button onClick={() => applySimScore(simScore)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:bg-purple-500/20"
                    style={{ color: '#a78bfa' }}>
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-[9px] font-bold">חשב</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* leaderboard cards — rank 1 top, last place bottom */}
      <div style={{ maxWidth: 220, margin: '0 auto' }}>
        <AnimatePresence>
          {rows.map((row, idx) => (
            <RankCard
              key={row.userId}
              row={row}
              index={idx}
              total={rows.length}
              shockwave={shockwave}
              isInitial={isInitialLoad}
            />
          ))}
        </AnimatePresence>
      </div>

      {lastUpdate && (
        <p className="text-center text-slate-700 text-[10px] mt-3 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" />
          עודכן {lastUpdate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  );
}

// ── Match list tabs 1-3 ─────────────────────────────────────────────────────
function MatchListTab({ filter }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const localDate = new Date().toLocaleDateString('sv-SE');
      const res  = await fetch(`/api/football?competition=WC&filter=${filter}&date=${localDate}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'שגיאה');
      setMatches(json.matches || []);
      setLastUpdate(new Date());
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  if (loading && !matches.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
        <span className="text-slate-500 text-xs">טוען...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-16">
        <WifiOff className="w-10 h-10 text-red-400/40 mx-auto mb-3" />
        <p className="text-red-400 text-sm mb-3">{error}</p>
        <button onClick={load} className="text-sky-400 text-xs underline">נסה שוב</button>
      </div>
    );
  }
  if (!matches.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-5xl">⚽</span>
        <p className="text-slate-400 text-sm">אין משחקים</p>
      </div>
    );
  }
  return (
    <div>
      {matches.map((m, i) => <MatchCard key={m.id} match={m} index={i} />)}
      {lastUpdate && (
        <p className="text-center text-slate-700 text-[10px] mt-1 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" />
          {lastUpdate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'LIVE',     label: 'חי',         emoji: '🔴' },
  { key: 'TODAY',    label: 'היום',       emoji: '📅' },
  { key: 'FINISHED', label: 'הסתיים',     emoji: '✅' },
  { key: 'LB',       label: 'טבלה לייב', emoji: '⚡' },
];

export default function AdminLivePanelDemo() {
  const [active, setActive] = useState('LB');

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Live Panel — דמו עם טבלה</h2>
          <p className="text-slate-400 text-sm">סימולציה של פאנל LIVE RESULTS עם לשונית "טבלה לייב"</p>
        </div>
      </div>

      <div className="max-w-sm mx-auto rounded-2xl overflow-hidden"
        style={{ background: 'rgba(5,10,20,0.97)', border: '1px solid rgba(255,255,255,.1)', boxShadow: '-20px 0 60px rgba(0,0,0,.5)' }}>

        <div className="h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5 mb-4">
            <div>
              <p className="text-white font-bold text-[15px] leading-tight">Live Results</p>
              <p className="text-[10px] font-bold tracking-[.2em] uppercase"
                style={{ background: 'linear-gradient(90deg,#38bdf8,#fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                UEFA Champions League 2026
              </p>
            </div>
          </div>

          <div className="relative flex bg-white/4 rounded-xl p-1 border border-white/6">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActive(t.key)}
                className="relative flex-1 py-2 text-[10px] font-semibold rounded-lg transition-colors z-10"
                style={{ color: active === t.key ? '#000' : 'rgba(255,255,255,.4)' }}>
                {active === t.key && (
                  <motion.div layoutId="demo-tab-pill" className="absolute inset-0 rounded-lg"
                    style={{ background: t.key === 'LB' ? 'linear-gradient(135deg,#8b5cf6,#6366f1)' : 'linear-gradient(135deg,#38bdf8,#7dd3fc)' }}
                    transition={{ type: 'spring', bounce: .2, duration: .5 }} />
                )}
                <span className="relative z-10">{t.emoji} {t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        <div className="px-4 py-4 overflow-y-auto" style={{ maxHeight: '75vh' }}>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}>
              {active === 'LB' ? <LiveLBTab /> : <MatchListTab filter={active} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />
      </div>

      <style>{`
        @keyframes lp-blur-focus {
          from { filter: blur(10px); opacity: .2; }
          to   { filter: blur(0);    opacity: 1;  }
        }
      `}</style>
    </div>
  );
}
