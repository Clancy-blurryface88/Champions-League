import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { UserStats } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { User } from "@/api/entities";
import { RefreshCw, Zap, Trophy, AlertTriangle, Wifi, WifiOff, Clock, TrendingUp, TrendingDown, Minus, LayoutList, Layers, Swords, Shield, Star } from "lucide-react";
import ScoreCounter from "@/components/ScoreCounter";

// Identical to AdminScoring — no changes to original file
function calculateScore(prediction, match) {
  if (match.actual_score_a === null || match.actual_score_b === null) {
    return { totalPoints: 0, exactScorePoints: 0, outcomePoints: 0, bttsPoints: 0, goalRangePoints: 0 };
  }
  const pA = prediction.predicted_score_a;
  const pB = prediction.predicted_score_b;
  const aA = match.actual_score_a;
  const aB = match.actual_score_b;
  let total = 0, exact = 0, outcome = 0, btts = 0, range = 0;

  if (pA === aA && pB === aB) {
    if (match.score_odds) {
      const key = `${aA}:${aB}`;
      exact = match.score_odds[key] ?? match.score_odds['other'] ?? 0;
    } else {
      exact = match.exact_score_points || 0;
    }
    total += exact;
  }

  const pDir = pA > pB ? 'home' : pA < pB ? 'away' : 'draw';
  const aDir = aA > aB ? 'home' : aA < aB ? 'away' : 'draw';
  if (pDir === aDir) {
    outcome = aDir === 'home' ? (match.home_win_points || 0)
            : aDir === 'away' ? (match.away_win_points || 0)
            : (match.draw_points || 0);
    total += outcome;
  }

  const aBTTS = aA > 0 && aB > 0;
  const pBTTS = pA > 0 && pB > 0;
  if (pBTTS === aBTTS) {
    btts = aBTTS ? (match.btts_yes_points || 0) : (match.btts_no_points || 0);
    total += btts;
  }

  const aGoals = aA + aB;
  const pGoals = pA + pB;
  const aRange = aGoals <= 2 ? '0-2' : aGoals <= 4 ? '3-4' : '5+';
  const pRange = pGoals <= 2 ? '0-2' : pGoals <= 4 ? '3-4' : '5+';
  if (pRange === aRange) {
    range = aRange === '0-2' ? (match.goals_0_2_points || 0)
          : aRange === '3-4' ? (match.goals_3_4_points || 0)
          : (match.goals_5_plus_points || 0);
    total += range;
  }

  return {
    totalPoints:      parseFloat(total.toFixed(2)),
    exactScorePoints: parseFloat(exact.toFixed(2)),
    outcomePoints:    parseFloat(outcome.toFixed(2)),
    bttsPoints:       parseFloat(btts.toFixed(2)),
    goalRangePoints:  parseFloat(range.toFixed(2)),
  };
}

function normalizeName(name = '') {
  return name.toLowerCase().replace(/[^a-z0-9֐-׿]/g, '');
}
function matchTeams(apiName, dbName) {
  const a = normalizeName(apiName);
  const d = normalizeName(dbName);
  return a === d || a.includes(d) || d.includes(a);
}
function findDbMatch(apiMatch, dbMatches) {
  const homeApi = apiMatch.homeTeam?.name || '';
  const awayApi = apiMatch.awayTeam?.name || '';
  const homeShort = apiMatch.homeTeam?.shortName || '';
  const awayShort = apiMatch.awayTeam?.shortName || '';
  return dbMatches.find(m => {
    const homeOk = matchTeams(homeApi, m.team_a) || matchTeams(homeShort, m.team_a);
    const awayOk = matchTeams(awayApi, m.team_b) || matchTeams(awayShort, m.team_b);
    return homeOk && awayOk;
  }) || null;
}

function buildLeaderboard(dbMatch, homeScore, awayScore, predictions, userStats, getName) {
  const liveMatch = { ...dbMatch, actual_score_a: homeScore, actual_score_b: awayScore };

  const matchPreds = predictions.filter(p => p.match_id === dbMatch.id);
  const latestMap = {};
  matchPreds.forEach(p => {
    if (!latestMap[p.user_id] || new Date(p.created_at) > new Date(latestMap[p.user_id].created_at))
      latestMap[p.user_id] = p;
  });

  const confirmedMap = {};
  userStats.forEach(s => { confirmedMap[s.user_id] = s.total_points || 0; });

  const rows = Object.values(latestMap).map(pred => {
    const b = calculateScore(pred, liveMatch);
    const confirmed = confirmedMap[pred.user_id] || 0;
    return {
      userId:    pred.user_id,
      name:      getName(pred.user_id),
      confirmed: parseFloat(confirmed.toFixed(2)),
      liveBonus: parseFloat(b.totalPoints.toFixed(2)),
      total:     parseFloat((confirmed + b.totalPoints).toFixed(2)),
      predicted: `${pred.predicted_score_a}–${pred.predicted_score_b}`,
      breakdown: b,
    };
  });

  const predUsers = new Set(Object.keys(latestMap));
  userStats.forEach(s => {
    if (!predUsers.has(s.user_id)) {
      rows.push({
        userId:    s.user_id,
        name:      getName(s.user_id),
        confirmed: parseFloat((s.total_points || 0).toFixed(2)),
        liveBonus: 0,
        total:     parseFloat((s.total_points || 0).toFixed(2)),
        predicted: '—',
        breakdown: null,
      });
    }
  });

  rows.sort((a, b) => b.total - a.total || b.confirmed - a.confirmed);

  // assign liveRank and officialRank for the card view
  const byConfirmed = [...rows].sort((a, b) => b.confirmed - a.confirmed);
  byConfirmed.forEach((r, i) => { r.officialRank = i + 1; });
  rows.forEach((r, i) => { r.liveRank = i + 1; });

  return rows;
}

// ── Card view components ──────────────────────────────────────────────────────

const RANK_COLOR  = r => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : 'rgba(255,255,255,.45)';
const RANK_BORDER = r => r === 1 ? '#FFD700' : r === 2 ? '#D1D5DB' : r === 3 ? '#D97706' : '#475569';
const RANK_BG     = r => r === 1 ? 'linear-gradient(135deg,rgba(250,204,21,.22),rgba(245,158,11,.22))'
                       : r === 2 ? 'linear-gradient(135deg,rgba(209,213,219,.18),rgba(156,163,175,.18))'
                       : r === 3 ? 'linear-gradient(135deg,rgba(245,158,11,.20),rgba(217,119,6,.20))'
                       : 'rgba(30,41,59,.60)';

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

function RankCard({ row, index, total, isInitial }) {
  const delta          = row.officialRank - row.liveRank;
  const rankFromBottom = total - 1 - index;
  const cardDelay      = isInitial ? Math.pow(rankFromBottom, 1.4) * 0.22 + (row.liveRank === 1 ? 0.3 : 0) : 0;
  const scoreDuration  = isInitial ? 1.1 : 2.8;
  const scoreDelay     = isInitial ? cardDelay + 0.2 : 0;
  const border         = RANK_BORDER(row.liveRank);
  const bg             = RANK_BG(row.liveRank);

  return (
    <motion.div layout layoutId={row.userId}
      initial={isInitial ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        layout: { type: 'spring', stiffness: 30, damping: 16 },
        ...(isInitial ? { delay: cardDelay, duration: 0.5, ease: 'easeOut' } : {}),
      }}
      className="relative mb-1">

      <div style={{
        transform: 'skewX(-6deg)', borderRadius: 8, overflow: 'hidden',
        border: `2px solid ${border}`, background: bg,
        transition: 'border-color .5s ease, background .5s ease',
        position: 'relative',
      }}>
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

        <div style={{ transform: 'skewX(6deg)', padding: '9px 6px 9px 34px' }}>
          <div className="flex items-center gap-1">
            <p className="flex-1 min-w-0 truncate text-xs font-semibold text-slate-200"
              style={isInitial ? { animation: 'lb-blur-focus 1.0s ease-out both', animationDelay: `${cardDelay}s` } : {}}>
              {row.name}
            </p>
            <span className="text-[11px] font-bold text-emerald-400 tabular-nums flex-shrink-0">
              <ScoreCounter value={row.total} duration={scoreDuration} delay={scoreDelay} showDecimals={true} />
            </span>
            <div className="flex-shrink-0 w-10 flex justify-end">
              <DeltaIcon delta={delta} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const INTERVAL = 30000;

export default function AdminLiveLeaderboard() {
  const [dbData, setDbData]       = useState(null);
  const [liveState, setLiveState] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [liveError, setLiveError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode]   = useState('cards');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const dbDataRef      = useRef(null);
  const isInitialRef   = useRef(true);

  const getName = useCallback(uid => {
    const profiles = dbDataRef.current?.profiles || [];
    return profiles.find(p => p.user_id === uid)?.display_name || uid?.slice(0, 6) || '?';
  }, []);

  useEffect(() => {
    User.me().then(u => { if (u?.id) setCurrentUserId(u.id); }).catch(() => {});
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [matches, profiles, userStats, predictions] = await Promise.all([
          Match.list(), PublicProfile.list(), UserStats.list(), Prediction.list(),
        ]);
        const data = { matches, profiles, userStats, predictions };
        setDbData(data);
        dbDataRef.current = data;
      } catch (e) {
        console.error('[LiveLB] DB load error:', e);
      }
      setLoading(false);
    })();
  }, []);

  const fetchAndRecalc = useCallback(async (isManual = false) => {
    const data = dbDataRef.current;
    if (!data) return;
    if (isManual) setRefreshing(true);

    try {
      const localDate = new Date().toLocaleDateString('sv-SE');
      const res  = await fetch(`/api/football?competition=WC&filter=LIVE&date=${localDate}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'שגיאה');

      const liveMatches = json.matches || [];
      setLiveError(null);

      if (liveMatches.length === 0) {
        setLiveState(null);
        setLastUpdate(new Date());
        if (isManual) setRefreshing(false);
        return;
      }

      const unfinished = data.matches.filter(m => !m.is_finished);
      let matched = null, apiMatch = null;
      for (const lm of liveMatches) {
        const found = findDbMatch(lm, unfinished);
        if (found) { matched = found; apiMatch = lm; break; }
      }

      if (!matched) {
        setLiveState({ apiMatches: liveMatches, dbMatch: null, rows: null });
        setLastUpdate(new Date());
        if (isManual) setRefreshing(false);
        return;
      }

      const homeScore = apiMatch.score?.fullTime?.home ?? apiMatch.score?.halfTime?.home ?? 0;
      const awayScore = apiMatch.score?.fullTime?.away ?? apiMatch.score?.halfTime?.away ?? 0;
      const minute    = apiMatch.minute ?? null;
      const rows      = buildLeaderboard(matched, homeScore, awayScore, data.predictions, data.userStats, getName);

      const isInitial = isInitialRef.current;
      isInitialRef.current = false;
      setIsInitialLoad(isInitial);
      setLiveState({ apiMatch, dbMatch: matched, homeScore, awayScore, minute, rows, apiMatches: liveMatches });
      setLastUpdate(new Date());
    } catch (e) {
      setLiveError(e.message);
    }
    if (isManual) setRefreshing(false);
  }, [getName]);

  useEffect(() => {
    if (!dbData) return;
    fetchAndRecalc();
    const iv = setInterval(() => fetchAndRecalc(), INTERVAL);
    return () => clearInterval(iv);
  }, [dbData, fetchAndRecalc]);

  const insights = useMemo(() => {
    if (!liveState?.rows || !liveState?.dbMatch || !dbData || !currentUserId) return null;
    const { rows, dbMatch } = liveState;
    const myRow = rows.find(r => r.userId === currentUserId);
    if (!myRow) return null;

    const myRank = myRow.liveRank;
    const myTotal = myRow.total;

    // golden scenario: recalculate leaderboard assuming my prediction comes true
    const myPred = dbData.predictions.find(p => p.match_id === dbMatch.id && p.user_id === currentUserId);
    let goldenRows = null, myGoldenRow = null;
    if (myPred) {
      goldenRows = buildLeaderboard(dbMatch, myPred.predicted_score_a, myPred.predicted_score_b, dbData.predictions, dbData.userStats, getName);
      myGoldenRow = goldenRows.find(r => r.userId === currentUserId);
    }

    // can overtake: people above me NOW who fall below me in golden scenario
    const canOvertake = goldenRows
      ? rows.filter(r => {
          if (r.liveRank >= myRank) return false;
          const goldenRank = goldenRows.find(g => g.userId === r.userId)?.liveRank ?? r.liveRank;
          return goldenRank > (myGoldenRow?.liveRank ?? myRank);
        })
      : [];

    // threatens me: people below me NOW who are within 12 pts of my current total
    const threatens = rows.filter(r => r.liveRank > myRank && (myTotal - r.total) <= 12);

    return { myRow, myRank, myTotal, myPred, myGoldenRow, canOvertake, threatens };
  }, [liveState, dbData, currentUserId, getName]);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <RefreshCw className="w-5 h-5 animate-spin mr-2" /> טוען נתונים...
    </div>
  );

  const { apiMatch, dbMatch, homeScore, awayScore, minute, rows, apiMatches } = liveState || {};

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes lb-blur-focus {
          from { filter: blur(6px); opacity: 0; }
          to   { filter: blur(0);  opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Live Leaderboard</h2>
            <p className="text-slate-400 text-sm">מתעדכן אוטומטית כל 30 שניות</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <div className="flex items-center gap-1 text-slate-600 text-xs">
              <Clock className="w-3 h-3" />
              {lastUpdate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          )}
          <button onClick={() => fetchAndRecalc(true)} disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'מרענן...' : 'רענן עכשיו'}
          </button>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-amber-300/80 text-xs">
          כלי בדיקה בלבד — לא נכתב לסופאבייס ולא משפיע על הטבלה הרשמית, ניחושים, תוצאות, או כל חלק אחר באפליקציה.
        </p>
      </div>

      {/* Error */}
      {liveError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
          <WifiOff className="w-4 h-4 flex-shrink-0" /> {liveError}
        </div>
      )}

      {/* No live matches */}
      {!liveError && !liveState && lastUpdate && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-slate-800/40 rounded-xl border border-slate-700">
          <span className="text-4xl">⚽</span>
          <p className="text-slate-300 font-medium">אין משחקים חיים כרגע</p>
          <p className="text-slate-500 text-sm">הטבלה תתעדכן אוטומטית כשמשחק יתחיל</p>
        </div>
      )}

      {/* API match found but no DB match */}
      {liveState && !dbMatch && apiMatches?.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
          <p className="text-amber-400 text-sm font-medium">נמצאו משחקים חיים ב-API אך לא הצלחתי להתאים אותם למשחקים ב-DB:</p>
          {apiMatches.map(m => (
            <div key={m.id} className="flex items-center justify-between text-sm text-slate-300 bg-slate-700/50 rounded-lg px-4 py-2.5">
              <span>{m.homeTeam?.name}</span>
              <span className="font-bold text-emerald-400 tabular-nums">
                {m.score?.fullTime?.home ?? 0} – {m.score?.fullTime?.away ?? 0}
                {m.minute != null && <span className="text-slate-500 font-normal text-xs ml-1">{m.minute}'</span>}
              </span>
              <span>{m.awayTeam?.name}</span>
            </div>
          ))}
          <p className="text-slate-500 text-xs">ייתכן שהשמות ב-DB שונים מהשמות ב-API. בדוק בטאב "Matches".</p>
        </div>
      )}

      {/* Live match + leaderboard */}
      {liveState && dbMatch && rows && (
        <>
          {/* Live match card */}
          <div className="rounded-xl p-4 border" style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,13,26,0.9) 100%)',
            borderColor: 'rgba(16,185,129,0.25)',
          }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
                  LIVE{minute != null ? ` ${minute}'` : ''}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>football-data.org</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                {apiMatch.homeTeam?.crest && <img src={apiMatch.homeTeam.crest} className="w-8 h-8 object-contain" alt="" />}
                <span className="text-white font-semibold text-sm">{apiMatch.homeTeam?.shortName || apiMatch.homeTeam?.name}</span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-black tabular-nums" style={{ background: 'linear-gradient(135deg,#34d399,#fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {homeScore} – {awayScore}
                </span>
                <p className="text-slate-500 text-[10px] mt-0.5">↔ {dbMatch.team_a} vs {dbMatch.team_b}</p>
              </div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="text-white font-semibold text-sm">{apiMatch.awayTeam?.shortName || apiMatch.awayTeam?.name}</span>
                {apiMatch.awayTeam?.crest && <img src={apiMatch.awayTeam.crest} className="w-8 h-8 object-contain" alt="" />}
              </div>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-white font-semibold text-sm flex-1">
              {dbMatch.team_a} {homeScore}–{awayScore} {dbMatch.team_b}
            </span>
            <div className="flex rounded-lg overflow-hidden border border-slate-700">
              <button onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'cards' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
                <Layers className="w-3.5 h-3.5" /> קלפים
              </button>
              <button onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-l border-slate-700 ${viewMode === 'table' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
                <LayoutList className="w-3.5 h-3.5" /> טבלה
              </button>
            </div>
          </div>

          {/* Card view */}
          {viewMode === 'cards' && (
            <div style={{ maxWidth: 340, margin: '0 auto' }}>
              <AnimatePresence>
                {rows.map((row, idx) => (
                  <RankCard
                    key={row.userId}
                    row={row}
                    index={idx}
                    total={rows.length}
                    isInitial={isInitialLoad}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Table view */}
          {viewMode === 'table' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
              <div className="px-5 py-2 border-b border-slate-700 flex justify-end">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">זמני · לא נשמר</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs border-b border-slate-700/60">
                    <th className="px-4 py-2.5 text-left w-8">#</th>
                    <th className="px-4 py-2.5 text-left">שם</th>
                    <th className="px-4 py-2.5 text-center">ניחוש</th>
                    <th className="px-4 py-2.5 text-right">נק' רשמי</th>
                    <th className="px-4 py-2.5 text-right">+לייב</th>
                    <th className="px-4 py-2.5 text-right font-bold text-amber-400">סה"כ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const rank = i + 1;
                    const b = row.breakdown;
                    return (
                      <React.Fragment key={row.userId}>
                        <tr className={`border-b border-slate-700/20 ${rank <= 3 ? 'bg-amber-500/4' : ''}`}>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-base leading-none">{MEDAL[rank] || rank}</span>
                          </td>
                          <td className="px-4 py-2.5 text-white font-medium">{row.name}</td>
                          <td className="px-4 py-2.5 text-center text-slate-400 font-mono text-xs">{row.predicted}</td>
                          <td className="px-4 py-2.5 text-right text-slate-400">{row.confirmed}</td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={row.liveBonus > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-600'}>
                              {row.liveBonus > 0 ? `+${row.liveBonus}` : '–'}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold text-white">{row.total}</td>
                        </tr>
                        {b && b.totalPoints > 0 && (
                          <tr className={`border-b border-slate-700/40 ${rank <= 3 ? 'bg-amber-500/4' : ''}`}>
                            <td />
                            <td colSpan={5} className="px-4 pb-2">
                              <div className="flex gap-3 text-[10px] text-slate-500">
                                {b.exactScorePoints > 0 && <span>🎯 מדויק +{b.exactScorePoints}</span>}
                                {b.outcomePoints    > 0 && <span>✅ כיוון +{b.outcomePoints}</span>}
                                {b.bttsPoints       > 0 && <span>⚽ BTTS +{b.bttsPoints}</span>}
                                {b.goalRangePoints  > 0 && <span>📊 טווח +{b.goalRangePoints}</span>}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Personal Insights */}
          {insights && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-700/60" />
                <span className="text-slate-500 text-xs font-medium tracking-wider uppercase">תובנות אישיות</span>
                <div className="flex-1 h-px bg-slate-700/60" />
              </div>

              {/* My current position strip */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-slate-400 text-xs">המיקום שלי עכשיו</span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-sm">מקום {insights.myRank}</span>
                  <span className="text-slate-500 text-xs">{insights.myTotal} נק'</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Can overtake */}
                <div className="rounded-xl border p-4" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.20)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Swords className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-emerald-300 font-semibold text-sm">את מי אני יכול לעקוף?</span>
                  </div>
                  {!insights.myPred ? (
                    <p className="text-slate-500 text-xs">אין לך ניחוש למשחק הזה</p>
                  ) : insights.canOvertake.length === 0 ? (
                    <p className="text-slate-500 text-xs">
                      {insights.myGoldenRow?.liveRank === 1 ? 'כבר במקום הראשון בתרחיש הזהב 🥇' : 'לא ניתן לעקוף אף אחד בתרחיש הזהב'}
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {insights.canOvertake.map(r => (
                        <div key={r.userId} className="flex items-center justify-between">
                          <span className="text-white text-xs font-medium">{r.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-[10px]">מקום {r.liveRank}</span>
                            <span className="text-emerald-400 text-[10px] font-semibold">+{(r.total - insights.myTotal).toFixed(1)} יתרון</span>
                          </div>
                        </div>
                      ))}
                      <p className="text-emerald-400/60 text-[10px] pt-1">אם ניחושך ({insights.myPred.predicted_score_a}–{insights.myPred.predicted_score_b}) יצא נכון</p>
                    </div>
                  )}
                </div>

                {/* Threatens me */}
                <div className="rounded-xl border p-4" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.20)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-red-300 font-semibold text-sm">מי מאיים עליי?</span>
                  </div>
                  {insights.threatens.length === 0 ? (
                    <p className="text-slate-500 text-xs">אף אחד לא קרוב מספיק כדי לאיים</p>
                  ) : (
                    <div className="space-y-1.5">
                      {insights.threatens.map(r => (
                        <div key={r.userId} className="flex items-center justify-between">
                          <span className="text-white text-xs font-medium">{r.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-[10px]">מקום {r.liveRank}</span>
                            <span className="text-red-400 text-[10px] font-semibold">{(insights.myTotal - r.total).toFixed(1)} נק' מאחורי</span>
                          </div>
                        </div>
                      ))}
                      <p className="text-red-400/60 text-[10px] pt-1">בטווח של עד 12 נקודות</p>
                    </div>
                  )}
                </div>

                {/* Golden scenario */}
                <div className="rounded-xl border p-4" style={{ background: 'rgba(251,191,36,0.06)', borderColor: 'rgba(251,191,36,0.20)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-amber-300 font-semibold text-sm">תרחיש זהב</span>
                  </div>
                  {!insights.myPred ? (
                    <p className="text-slate-500 text-xs">אין לך ניחוש למשחק הזה</p>
                  ) : !insights.myGoldenRow ? (
                    <p className="text-slate-500 text-xs">לא ניתן לחשב</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">ניחוש שלך</span>
                        <span className="text-amber-300 font-bold text-sm font-mono">
                          {insights.myPred.predicted_score_a}–{insights.myPred.predicted_score_b}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">נקודות סופיות</span>
                        <span className="text-white font-bold text-sm">{insights.myGoldenRow.total} נק'</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">מיקום בתרחיש זהב</span>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-black text-base">מקום {insights.myGoldenRow.liveRank}</span>
                          {insights.myGoldenRow.liveRank < insights.myRank && (
                            <span className="text-emerald-400 text-xs font-semibold">
                              ↑{insights.myRank - insights.myGoldenRow.liveRank} מיקומים
                            </span>
                          )}
                          {insights.myGoldenRow.liveRank === insights.myRank && (
                            <span className="text-slate-500 text-xs">ללא שינוי</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
