import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Wifi, WifiOff, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import OrbitSpinner from "@/components/OrbitSpinner";
import ScoreCounter from "@/components/ScoreCounter";
import TeamFlag from "@/components/TeamFlag";
import { Match, Prediction, UserStats, PublicProfile } from "@/api/entities";

const FILTERS = [
  { key: 'LIVE',     label: 'חי',       emoji: '🔴' },
  { key: 'TODAY',    label: 'היום',     emoji: '📅' },
  { key: 'FINISHED', label: 'הסתיים',  emoji: '✅' },
  { key: 'LB',       label: 'טבלה',    emoji: '⚡' },
];

// ── Live leaderboard helpers ──────────────────────────────────────────────────

function calculateScore(prediction, match) {
  if (match.actual_score_a === null || match.actual_score_b === null) return { totalPoints: 0 };
  const pA = prediction.predicted_score_a, pB = prediction.predicted_score_b;
  const aA = match.actual_score_a,         aB = match.actual_score_b;
  let total = 0;
  if (pA === aA && pB === aB) {
    total += match.score_odds
      ? (match.score_odds[`${aA}:${aB}`] ?? match.score_odds['other'] ?? 0)
      : (match.exact_score_points || 0);
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

function normTeam(n = '') { return n.toLowerCase().replace(/[^a-z0-9א-ת]/g, ''); }
function teamsMatch(a, b) { const na = normTeam(a), nb = normTeam(b); return na === nb || na.includes(nb) || nb.includes(na); }
function findDbMatch(apiMatch, dbMatches) {
  const h = apiMatch.homeTeam?.name || '', hS = apiMatch.homeTeam?.shortName || '';
  const a = apiMatch.awayTeam?.name || '', aS = apiMatch.awayTeam?.shortName || '';
  return dbMatches.find(m => (teamsMatch(h, m.team_a) || teamsMatch(hS, m.team_a)) && (teamsMatch(a, m.team_b) || teamsMatch(aS, m.team_b))) || null;
}

const RANK_COLOR  = r => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : 'rgba(255,255,255,.45)';
const RANK_BORDER = r => r === 1 ? '#FFD700' : r === 2 ? '#D1D5DB' : r === 3 ? '#D97706' : '#475569';
const RANK_BG     = r => r === 1 ? 'linear-gradient(135deg,rgba(250,204,21,.22),rgba(245,158,11,.22))'
                       : r === 2 ? 'linear-gradient(135deg,rgba(209,213,219,.18),rgba(156,163,175,.18))'
                       : r === 3 ? 'linear-gradient(135deg,rgba(245,158,11,.20),rgba(217,119,6,.20))'
                       : 'rgba(30,41,59,.60)';

function DeltaIcon({ delta }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={delta} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.2 }}>
        {delta > 0
          ? <span className="flex items-center gap-0.5 text-emerald-400 text-[11px] font-bold"><TrendingUp className="w-3.5 h-3.5"/>+{delta}</span>
          : delta < 0
          ? <span className="flex items-center gap-0.5 text-red-400 text-[11px] font-bold"><TrendingDown className="w-3.5 h-3.5"/>{delta}</span>
          : <Minus className="w-3.5 h-3.5 text-slate-600"/>}
      </motion.div>
    </AnimatePresence>
  );
}

function RankCard({ row, index, total, isInitial }) {
  const delta = row.officialRank - row.liveRank;
  const rankFromBottom = total - 1 - index;
  const cardDelay   = isInitial ? Math.pow(rankFromBottom, 1.4) * 0.22 + (row.liveRank === 1 ? 0.3 : 0) : 0;
  const scoreDur    = isInitial ? 1.1 : 2.8;
  const scoreDelay  = isInitial ? cardDelay + 0.2 : 0;
  return (
    <motion.div layout layoutId={`lb-${row.userId}`}
      initial={isInitial ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ layout: { type: 'spring', stiffness: 18, damping: 14 }, ...(isInitial ? { delay: cardDelay, duration: 0.5, ease: 'easeOut' } : {}) }}
      className="relative mb-1">
      <div style={{ transform: 'skewX(-6deg)', borderRadius: 8, overflow: 'hidden', border: `2px solid ${RANK_BORDER(row.liveRank)}`, background: RANK_BG(row.liveRank), transition: 'border-color .5s ease, background .5s ease', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%) skewX(6deg)', fontSize: 28, fontWeight: 900, color: RANK_COLOR(row.liveRank), opacity: 0.15, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', transition: 'color .5s ease' }}>
          {row.liveRank}
        </span>
        <div style={{ transform: 'skewX(6deg)', padding: '16px 6px 16px 34px' }}>
          <div className="flex items-center gap-1">
            <p className="flex-1 min-w-0 truncate text-xs font-semibold text-slate-200 text-center"
              style={isInitial ? { animation: 'lb-blur-focus 1.0s ease-out both', animationDelay: `${cardDelay}s` } : {}}>
              {row.name}
            </p>
            <span className="text-[11px] font-bold text-emerald-400 tabular-nums flex-shrink-0">
              <ScoreCounter value={row.total} duration={scoreDur} delay={scoreDelay} showDecimals={true} />
            </span>
            <div className="flex-shrink-0 w-10 flex justify-end">
              <DeltaIcon delta={delta} />
            </div>
            {row.predicted ? (
              <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 w-8 text-right">{row.predicted}</span>
            ) : (
              <span className="w-8 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LiveLBTab() {
  const [rows, setRows]                   = useState([]);
  const [status, setStatus]               = useState('loading');
  const [liveInfo, setLiveInfo]           = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastUpdate, setLastUpdate]       = useState(null);
  const hasShownInitial  = useRef(false);
  const officialRankMap  = useRef({}); // userId → officialRank, set once from Phase 1
  const dbRef            = useRef(null);

  const getName = useCallback(uid => {
    const profiles = dbRef.current?.profiles || [];
    return profiles.find(p => p.user_id === uid)?.display_name || uid?.slice(0, 6) || '?';
  }, []);

  const load = useCallback(async () => {
    try {
      // ── Phase 1: load Supabase once, show official scores with reveal animation ──
      if (!dbRef.current) {
        const [matches, profiles, userStats, predictions] = await Promise.all([
          Match.list(), PublicProfile.list(), UserStats.list(), Prediction.list(),
        ]);
        dbRef.current = { matches, profiles, userStats, predictions };
      }
      const data = dbRef.current;

      if (!hasShownInitial.current) {
        const official = data.userStats.map(s => ({
          userId: s.user_id,
          name: getName(s.user_id),
          confirmed: parseFloat((s.total_points || 0).toFixed(2)),
          liveBonus: 0,
          total: parseFloat((s.total_points || 0).toFixed(2)),
        }));
        official.sort((a, b) => b.total - a.total);
        official.forEach((r, i) => {
          r.liveRank = i + 1;
          r.officialRank = i + 1;
          officialRankMap.current[r.userId] = i + 1;
        });
        hasShownInitial.current = true;
        setIsInitialLoad(true);   // reveal animation
        setRows(official);
        setStatus('done');
        // wait for reveal animation to complete before live update
        const revealWait = Math.pow(Math.max(official.length - 1, 0), 1.4) * 0.22 + 2.2;
        await new Promise(resolve => setTimeout(resolve, revealWait * 1000));
      }

      // ── Phase 2: fetch live API and smoothly reorder ──────────────────────────
      const localDate = new Date().toLocaleDateString('sv-SE');
      const res  = await fetch(`/api/football?competition=WC&filter=LIVE&date=${localDate}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      const liveMatches = json.matches || [];
      setLastUpdate(new Date());

      if (liveMatches.length === 0) { setLiveInfo(null); return; }

      const unfinished = data.matches.filter(m => !m.is_finished);
      let dbMatch = null, apiMatch = null;
      for (const lm of liveMatches) {
        const f = findDbMatch(lm, unfinished);
        if (f) { dbMatch = f; apiMatch = lm; break; }
      }
      if (!dbMatch) return;

      const homeScore = apiMatch.score?.fullTime?.home ?? apiMatch.score?.halfTime?.home ?? 0;
      const awayScore = apiMatch.score?.fullTime?.away ?? apiMatch.score?.halfTime?.away ?? 0;
      const liveMatch = { ...dbMatch, actual_score_a: homeScore, actual_score_b: awayScore };

      const matchPreds = data.predictions.filter(p => p.match_id === dbMatch.id);
      const latestMap  = {};
      matchPreds.forEach(p => {
        if (!latestMap[p.user_id] || new Date(p.created_at) > new Date(latestMap[p.user_id].created_at))
          latestMap[p.user_id] = p;
      });
      const confirmedMap = {};
      data.userStats.forEach(s => { confirmedMap[s.user_id] = s.total_points || 0; });

      const built = Object.values(latestMap).map(pred => {
        const b = calculateScore(pred, liveMatch);
        const confirmed = confirmedMap[pred.user_id] || 0;
        return { userId: pred.user_id, name: getName(pred.user_id), confirmed: parseFloat(confirmed.toFixed(2)), liveBonus: parseFloat(b.totalPoints.toFixed(2)), total: parseFloat((confirmed + b.totalPoints).toFixed(2)), predicted: `${pred.predicted_score_a}-${pred.predicted_score_b}` };
      });
      const predUsers = new Set(Object.keys(latestMap));
      data.userStats.forEach(s => {
        if (!predUsers.has(s.user_id))
          built.push({ userId: s.user_id, name: getName(s.user_id), confirmed: parseFloat((s.total_points || 0).toFixed(2)), liveBonus: 0, total: parseFloat((s.total_points || 0).toFixed(2)), predicted: null });
      });
      built.sort((a, b) => b.total - a.total);
      built.forEach((r, i) => { r.liveRank = i + 1; });
      built.forEach(r => { r.officialRank = officialRankMap.current[r.userId] ?? r.liveRank; });

      setIsInitialLoad(false);  // smooth reorder only, no re-reveal
      setRows(built);
      setLiveInfo({ home: dbMatch.team_a, away: dbMatch.team_b, homeLogo: dbMatch.team_a_logo ?? null, awayLogo: dbMatch.team_b_logo ?? null, score: `${homeScore}–${awayScore}`, minute: apiMatch.minute ?? null });
    } catch (e) {
      console.error('[LiveLBTab]', e);
      if (!hasShownInitial.current) setStatus('error');
    }
  }, [getName]);

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [load]);

  if (status === 'loading') return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      <span className="text-slate-500 text-xs">טוען טבלה...</span>
    </div>
  );
  if (status === 'error') return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <WifiOff className="w-8 h-8 text-red-400/40" />
      <p className="text-slate-500 text-sm">לא ניתן לטעון את הטבלה</p>
    </div>
  );

  return (
    <div>
      <style>{`@keyframes lb-blur-focus { from { filter: blur(6px); opacity: 0; } to { filter: blur(0); opacity: 1; } }`}</style>

      {/* live match chip */}
      <AnimatePresence>
        {liveInfo && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-3 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: 'rgba(52,211,153,.08)', border: '1px solid rgba(52,211,153,.25)' }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <TeamFlag logo={liveInfo.homeLogo} name={liveInfo.home} className="w-4 h-4 flex-shrink-0" />
            <span className="font-bold text-xs text-emerald-400">{liveInfo.home}</span>
            <span className="font-bold text-xs text-white tabular-nums">{liveInfo.score}</span>
            <span className="font-bold text-xs text-emerald-400">{liveInfo.away}</span>
            <TeamFlag logo={liveInfo.awayLogo} name={liveInfo.away} className="w-4 h-4 flex-shrink-0" />
            {liveInfo.minute && <span className="text-slate-500 text-[10px] mr-1">{liveInfo.minute}'</span>}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 220, margin: '0 auto' }}>
        <AnimatePresence>
          {rows.map((row, idx) => (
            <RankCard key={row.userId} row={row} index={idx} total={rows.length} isInitial={isInitialLoad} />
          ))}
        </AnimatePresence>
      </div>

      {lastUpdate && (
        <p className="text-center text-slate-700 text-[10px] mt-3 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" /> עודכן {lastUpdate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  );
}

const STATUS_MAP = {
  IN_PLAY:   { label: 'LIVE',    dot: 'bg-red-500',    text: 'text-red-400',    pulse: true  },
  PAUSED:    { label: 'HT',      dot: 'bg-orange-400', text: 'text-orange-400', pulse: false },
  FINISHED:  { label: 'FT',      dot: 'bg-slate-500',  text: 'text-slate-400',  pulse: false },
  SCHEDULED: { label: 'מתוכנן', dot: 'bg-blue-500',   text: 'text-blue-400',   pulse: false },
  TIMED:     { label: 'מתוכנן', dot: 'bg-blue-500',   text: 'text-blue-400',   pulse: false },
  POSTPONED: { label: 'נדחה',   dot: 'bg-red-700',    text: 'text-red-500',    pulse: false },
  CANCELLED: { label: 'בוטל',   dot: 'bg-red-700',    text: 'text-red-500',    pulse: false },
};

function StatusBadge({ status, minute }) {
  const s = STATUS_MAP[status] || { label: status, dot: 'bg-slate-600', text: 'text-slate-400', pulse: false };
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`} />
      <span className={`text-[10px] font-bold tracking-widest uppercase ${s.text}`}>
        {s.label}{minute != null && (status === 'IN_PLAY' || status === 'PAUSED') ? ` ${minute}'` : ''}
      </span>
    </div>
  );
}

function MatchCard({ match, index }) {
  const home = match.homeTeam?.shortName || match.homeTeam?.name || '?';
  const away = match.awayTeam?.shortName || match.awayTeam?.name || '?';
  const homeCrest = match.homeTeam?.crest;
  const awayCrest = match.awayTeam?.crest;
  const homeScore = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? null;
  const awayScore = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? null;
  const hasScore = homeScore !== null && awayScore !== null;
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden rounded-2xl mb-3"
      style={{
        background: isLive
          ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,13,26,0.9) 100%)'
          : 'rgba(255,255,255,0.04)',
        border: isLive
          ? '1px solid rgba(16,185,129,0.25)'
          : '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Live glow strip */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      )}

      <div className="px-4 py-3.5">
        {/* Status row */}
        <div className="flex items-center justify-between mb-3">
          <StatusBadge status={match.status} minute={match.minute} />
          {match.utcDate && !isLive && (
            <span className="text-[10px] text-slate-500">
              {new Date(match.utcDate).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Teams + Score */}
        <div className="flex items-center gap-2">
          {/* Home team */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            {homeCrest
              ? <img src={homeCrest} alt={home} className="w-9 h-9 object-contain drop-shadow-md" />
              : <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-lg">⚽</div>
            }
            <span className="text-white/80 text-[11px] font-semibold text-center leading-tight">{home}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center flex-shrink-0 min-w-[64px]">
            {(hasScore || isLive) ? (
              <motion.div
                className="flex items-center gap-1"
                animate={isLive ? { opacity: [1, 0.75, 1] } : {}}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span
                  className="text-2xl font-black tabular-nums"
                  style={{
                    background: isLive
                      ? 'linear-gradient(135deg, #34d399, #fff)'
                      : isFinished
                        ? 'linear-gradient(135deg, #94a3b8, #fff)'
                        : 'linear-gradient(135deg, #fbbf24, #fff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {homeScore ?? 0}
                </span>
                <span className="text-white/30 text-lg font-light">–</span>
                <span
                  className="text-2xl font-black tabular-nums"
                  style={{
                    background: isLive
                      ? 'linear-gradient(135deg, #34d399, #fff)'
                      : isFinished
                        ? 'linear-gradient(135deg, #94a3b8, #fff)'
                        : 'linear-gradient(135deg, #fbbf24, #fff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {awayScore ?? 0}
                </span>
              </motion.div>
            ) : (
              <span className="text-white/20 text-lg font-bold">vs</span>
            )}
            {/* Minute indicator */}
            {isLive && match.minute != null && (
              <span className="text-[10px] font-bold text-emerald-400/80 mt-0.5 tabular-nums">
                {match.minute}'
              </span>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            {awayCrest
              ? <img src={awayCrest} alt={away} className="w-9 h-9 object-contain drop-shadow-md" />
              : <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-lg">⚽</div>
            }
            <span className="text-white/80 text-[11px] font-semibold text-center leading-tight">{away}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveDataPanel({ onClose }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filter, setFilter] = useState('LIVE');

  const load = useCallback(async () => {
    if (filter === 'LB') return;
    setLoading(true);
    setError(null);
    try {
      const localDate = new Date().toLocaleDateString('sv-SE');
      const res = await fetch(`/api/football?competition=WC&filter=${filter}&date=${localDate}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'שגיאה');
      setMatches(json.matches || []);
      setLastUpdate(new Date());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[45]"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="fixed inset-y-0 right-0 w-[340px] z-50 flex flex-col"
        style={{
          background: 'rgba(5,10,20,0.35)',
          backdropFilter: 'blur(28px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Gold top border */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent flex-shrink-0" />

        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img src="/wc-trophy.png" alt="trophy" className="w-7 h-7 object-contain"
                  onError={e => { e.target.style.display='none'; }} />
              </div>
              <div>
                <p className="text-white font-bold text-[15px] leading-tight tracking-wide">Live Results</p>
                <p
                  className="text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ background: 'linear-gradient(90deg, #f5c518, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  FIFA World Cup 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={load}
                disabled={loading}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/8"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/8"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="relative flex bg-white/4 rounded-xl p-1 border border-white/6">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="relative flex-1 py-2 text-xs font-semibold rounded-lg transition-colors z-10"
                style={{ color: filter === f.key ? '#000' : 'rgba(255,255,255,0.4)' }}
              >
                {filter === f.key && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: f.key === 'LB' ? 'linear-gradient(135deg,#8b5cf6,#6366f1)' : 'linear-gradient(135deg, #f5c518, #fde68a)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{f.emoji} {f.label}</span>
              </button>
            ))}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between mt-3 text-[10px]">
            <div className="flex items-center gap-1.5">
              {error
                ? <WifiOff className="w-3 h-3 text-red-400" />
                : <Wifi className="w-3 h-3 text-emerald-400" />
              }
              <span className="text-slate-500">מתעדכן כל 30 שניות</span>
            </div>
            {lastUpdate && (
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3 h-3" />
                <span>{lastUpdate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/8 to-transparent flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-white/10">
          {filter === 'LB' ? (
            <LiveLBTab />
          ) : (
          <AnimatePresence mode="wait">
            {loading && matches.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-3"
              >
                <OrbitSpinner size={36} />
                <span className="text-slate-500 text-xs">טוען נתונים...</span>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <WifiOff className="w-10 h-10 text-red-400/40 mx-auto mb-3" />
                <p className="text-red-400 text-sm mb-3">{error}</p>
                <button onClick={load} className="text-amber-400 text-xs underline hover:text-amber-300">נסה שוב</button>
              </motion.div>
            ) : matches.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-3"
              >
                <span className="text-5xl">⚽</span>
                <p className="text-slate-400 text-sm font-medium">אין משחקים כרגע</p>
                <p className="text-slate-600 text-xs">נסה "היום" לראות משחקי היום</p>
              </motion.div>
            ) : (
              <motion.div key="matches" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {matches.map((match, i) => (
                  <MatchCard key={match.id} match={match} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>

        {/* Bottom gold line */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent flex-shrink-0" />
      </motion.div>
    </>
  );
}
