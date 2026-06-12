import React, { useState, useEffect, useCallback, useRef } from "react";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { UserStats } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { RefreshCw, Zap, Trophy, AlertTriangle, Wifi, WifiOff, Clock } from "lucide-react";

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

// Normalize team name for fuzzy matching
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

  // users who didn't predict — still show with confirmed points
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
  return rows;
}

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const INTERVAL = 30000;

export default function AdminLiveLeaderboard() {
  const [dbData, setDbData] = useState(null); // { matches, predictions, userStats, profiles }
  const [liveState, setLiveState] = useState(null); // { apiMatch, dbMatch, homeScore, awayScore, minute, rows }
  const [loading, setLoading]   = useState(true);
  const [liveError, setLiveError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const dbDataRef = useRef(null);

  const getName = useCallback(uid => {
    const profiles = dbDataRef.current?.profiles || [];
    return profiles.find(p => p.user_id === uid)?.display_name || uid?.slice(0, 6) || '?';
  }, []);

  // Load Supabase data once
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [matches, profiles, userStats, predictions] = await Promise.all([
          Match.list(),
          PublicProfile.list(),
          UserStats.list(),
          Prediction.list(),
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

      // Try to auto-match first live match to a DB match
      const unfinished = data.matches.filter(m => !m.is_finished);
      let matched = null;
      let apiMatch = null;

      for (const lm of liveMatches) {
        const found = findDbMatch(lm, unfinished);
        if (found) { matched = found; apiMatch = lm; break; }
      }

      if (!matched) {
        // No auto-match — show live matches from API but can't calculate
        setLiveState({ apiMatches: liveMatches, dbMatch: null, rows: null });
        setLastUpdate(new Date());
        if (isManual) setRefreshing(false);
        return;
      }

      const homeScore = apiMatch.score?.fullTime?.home ?? apiMatch.score?.halfTime?.home ?? 0;
      const awayScore = apiMatch.score?.fullTime?.away ?? apiMatch.score?.halfTime?.away ?? 0;
      const minute    = apiMatch.minute ?? null;

      const rows = buildLeaderboard(matched, homeScore, awayScore, data.predictions, data.userStats, getName);

      setLiveState({ apiMatch, dbMatch: matched, homeScore, awayScore, minute, rows, apiMatches: liveMatches });
      setLastUpdate(new Date());
    } catch (e) {
      setLiveError(e.message);
    }
    if (isManual) setRefreshing(false);
  }, [getName]);

  // Auto-refresh every 30s once DB data is loaded
  useEffect(() => {
    if (!dbData) return;
    fetchAndRecalc();
    const iv = setInterval(() => fetchAndRecalc(), INTERVAL);
    return () => clearInterval(iv);
  }, [dbData, fetchAndRecalc]);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <RefreshCw className="w-5 h-5 animate-spin mr-2" /> טוען נתונים...
    </div>
  );

  const { apiMatch, dbMatch, homeScore, awayScore, minute, rows, apiMatches } = liveState || {};

  return (
    <div className="space-y-6">
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
          <button
            onClick={() => fetchAndRecalc(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors disabled:opacity-50"
          >
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

      {/* Live matches from API but no DB match found */}
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

      {/* Live match found + leaderboard */}
      {liveState && dbMatch && rows && (
        <>
          {/* Live match card */}
          <div
            className="rounded-xl p-4 border"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,13,26,0.9) 100%)',
              borderColor: 'rgba(16,185,129,0.25)',
            }}
          >
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

          {/* Leaderboard table */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-white font-semibold text-sm">
                  {dbMatch.team_a} {homeScore}–{awayScore} {dbMatch.team_b}
                </span>
              </div>
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
        </>
      )}
    </div>
  );
}
