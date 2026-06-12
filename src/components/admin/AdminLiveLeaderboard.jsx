import React, { useState, useEffect, useCallback } from "react";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { UserStats } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { RefreshCw, Zap, Trophy, AlertTriangle } from "lucide-react";

// Copied from AdminScoring — no changes to original
function calculateScore(prediction, match) {
  if (match.actual_score_a === null || match.actual_score_b === null) {
    return { totalPoints: 0, exactScorePoints: 0, outcomePoints: 0, bttsPoints: 0, goalRangePoints: 0 };
  }

  const predictedA = prediction.predicted_score_a;
  const predictedB = prediction.predicted_score_b;
  const actualA = match.actual_score_a;
  const actualB = match.actual_score_b;

  let totalPoints = 0;
  let exactScorePoints = 0;
  let outcomePoints = 0;
  let bttsPoints = 0;
  let goalRangePoints = 0;

  // 1. exact score
  if (predictedA === actualA && predictedB === actualB) {
    if (match.score_odds) {
      const key = `${actualA}-${actualB}`;
      exactScorePoints = match.score_odds[key] ?? match.score_odds['other'] ?? 0;
    } else {
      exactScorePoints = match.exact_score_points || 0;
    }
    totalPoints += exactScorePoints;
  }

  // 2. correct outcome
  const predictedOutcome = predictedA > predictedB ? 'home' : predictedA < predictedB ? 'away' : 'draw';
  const actualOutcome    = actualA    > actualB    ? 'home' : actualA    < actualB    ? 'away' : 'draw';
  if (predictedOutcome === actualOutcome) {
    if      (actualOutcome === 'home') outcomePoints = match.home_win_points || 0;
    else if (actualOutcome === 'away') outcomePoints = match.away_win_points || 0;
    else                               outcomePoints = match.draw_points     || 0;
    totalPoints += outcomePoints;
  }

  // 3. BTTS
  const actualBTTS    = actualA    > 0 && actualB    > 0;
  const predictedBTTS = predictedA > 0 && predictedB > 0;
  if (predictedBTTS === actualBTTS) {
    bttsPoints = actualBTTS ? (match.btts_yes_points || 0) : (match.btts_no_points || 0);
    totalPoints += bttsPoints;
  }

  // 4. goals range
  const totalGoals = actualA + actualB;
  const actualRange    = totalGoals <= 2 ? '0-2' : totalGoals <= 4 ? '3-4' : '5+';
  const predTotalGoals = predictedA + predictedB;
  const predictedRange = predTotalGoals <= 2 ? '0-2' : predTotalGoals <= 4 ? '3-4' : '5+';
  if (predictedRange === actualRange) {
    if      (actualRange === '0-2') goalRangePoints = match.goals_0_2_points || 0;
    else if (actualRange === '3-4') goalRangePoints = match.goals_3_4_points || 0;
    else                            goalRangePoints = match.goals_5_plus_points || 0;
    totalPoints += goalRangePoints;
  }

  return {
    totalPoints:     parseFloat(totalPoints.toFixed(2)),
    exactScorePoints: parseFloat(exactScorePoints.toFixed(2)),
    outcomePoints:   parseFloat(outcomePoints.toFixed(2)),
    bttsPoints:      parseFloat(bttsPoints.toFixed(2)),
    goalRangePoints: parseFloat(goalRangePoints.toFixed(2)),
  };
}

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function AdminLiveLeaderboard() {
  const [matches,      setMatches]      = useState([]);
  const [profiles,     setProfiles]     = useState([]);
  const [userStats,    setUserStats]    = useState([]);
  const [predictions,  setPredictions]  = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [scoreA,       setScoreA]       = useState(0);
  const [scoreB,       setScoreB]       = useState(0);
  const [leaderboard,  setLeaderboard]  = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [calculating,  setCalculating]  = useState(false);

  // load base data once
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [m, p, s, pr] = await Promise.all([
          Match.list(),
          PublicProfile.list(),
          UserStats.list(),
          Prediction.list(),
        ]);
        setMatches(m);
        setProfiles(p);
        setUserStats(s);
        setPredictions(pr);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  const getName = useCallback(uid =>
    profiles.find(p => p.user_id === uid)?.display_name || uid.slice(0, 6),
    [profiles]
  );

  const unfinished = matches.filter(m => !m.is_finished);

  const handleCalculate = () => {
    if (!selectedMatchId) return;
    setCalculating(true);

    const dbMatch = matches.find(m => m.id === selectedMatchId);
    if (!dbMatch) { setCalculating(false); return; }

    // treat live score as "actual" for calculation only
    const liveMatch = {
      ...dbMatch,
      actual_score_a: scoreA,
      actual_score_b: scoreB,
      is_finished: true, // only for calculateScore logic
    };

    // latest prediction per user for this match
    const matchPreds = predictions.filter(p => p.match_id === selectedMatchId);
    const latestMap  = {};
    matchPreds.forEach(p => {
      if (!latestMap[p.user_id] || new Date(p.created_at) > new Date(latestMap[p.user_id].created_at)) {
        latestMap[p.user_id] = p;
      }
    });

    // confirmed points per user (from user_stats)
    const confirmedMap = {};
    userStats.forEach(s => { confirmedMap[s.user_id] = s.total_points || 0; });

    // build rows
    const rows = Object.values(latestMap).map(pred => {
      const { totalPoints } = calculateScore(pred, liveMatch);
      const confirmed = confirmedMap[pred.user_id] || 0;
      return {
        userId:    pred.user_id,
        name:      getName(pred.user_id),
        confirmed: parseFloat(confirmed.toFixed(2)),
        liveBonus: parseFloat(totalPoints.toFixed(2)),
        total:     parseFloat((confirmed + totalPoints).toFixed(2)),
        predicted: `${pred.predicted_score_a}–${pred.predicted_score_b}`,
      };
    });

    // users who didn't predict: still appear with confirmed points
    const predictingUsers = new Set(Object.keys(latestMap));
    userStats.forEach(s => {
      if (!predictingUsers.has(s.user_id)) {
        rows.push({
          userId:    s.user_id,
          name:      getName(s.user_id),
          confirmed: parseFloat((s.total_points || 0).toFixed(2)),
          liveBonus: 0,
          total:     parseFloat((s.total_points || 0).toFixed(2)),
          predicted: '—',
        });
      }
    });

    rows.sort((a, b) => b.total - a.total || b.confirmed - a.confirmed);
    setLeaderboard({ rows, matchName: `${dbMatch.team_a} ${scoreA}–${scoreB} ${dbMatch.team_b}` });
    setCalculating(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <RefreshCw className="w-5 h-5 animate-spin mr-2" /> טוען נתונים...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Live Leaderboard</h2>
          <p className="text-slate-400 text-sm">בחן את הטבלה לפי תוצאה זמנית — לא נשמר לשום מקום</p>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-amber-300/80 text-xs leading-relaxed">
          כלי בדיקה בלבד — הנתונים המוצגים כאן <strong>לא</strong> נכתבים לסופאבייס ולא משפיעים על הטבלה הרשמית, על ניחושים, על תוצאות או על כל חלק אחר באפליקציה.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-4">
        <h3 className="text-slate-300 font-semibold text-sm">הגדר תרחיש</h3>

        {/* Match selector */}
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">בחר משחק שטרם הסתיים</label>
          <select
            value={selectedMatchId}
            onChange={e => setSelectedMatchId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="">-- בחר משחק --</option>
            {unfinished.map(m => (
              <option key={m.id} value={m.id}>
                {m.team_a} vs {m.team_b}
                {m.match_date ? `  (${new Date(m.match_date).toLocaleDateString('he-IL')})` : ''}
              </option>
            ))}
          </select>
          {unfinished.length === 0 && (
            <p className="text-slate-500 text-xs mt-1">אין משחקים שלא הסתיימו במסד הנתונים</p>
          )}
        </div>

        {/* Score inputs */}
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">תוצאה זמנית (בית – חוץ)</label>
          <div className="flex items-center gap-3">
            <input
              type="number" min="0" max="20"
              value={scoreA}
              onChange={e => setScoreA(parseInt(e.target.value) || 0)}
              className="w-20 bg-slate-900 border border-slate-600 text-white text-center rounded-lg px-3 py-2 text-lg font-bold focus:outline-none focus:border-amber-500"
            />
            <span className="text-slate-400 font-bold text-lg">–</span>
            <input
              type="number" min="0" max="20"
              value={scoreB}
              onChange={e => setScoreB(parseInt(e.target.value) || 0)}
              className="w-20 bg-slate-900 border border-slate-600 text-white text-center rounded-lg px-3 py-2 text-lg font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!selectedMatchId || calculating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg,#f5c518,#fde68a)', color: '#000' }}
        >
          <Zap className="w-4 h-4" />
          {calculating ? 'מחשב...' : 'חשב טבלה לייב'}
        </button>
      </div>

      {/* Result table */}
      {leaderboard && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-white font-semibold text-sm">{leaderboard.matchName}</span>
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
              {leaderboard.rows.map((row, i) => {
                const rank = i + 1;
                return (
                  <tr
                    key={row.userId}
                    className={`border-b border-slate-700/40 transition-colors ${rank <= 3 ? 'bg-amber-500/4' : ''}`}
                  >
                    <td className="px-4 py-3 text-center">
                      <span className="text-base leading-none">{MEDAL[rank] || rank}</span>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-center text-slate-400 font-mono text-xs">{row.predicted}</td>
                    <td className="px-4 py-3 text-right text-slate-400">{row.confirmed}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={row.liveBonus > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-600'}>
                        {row.liveBonus > 0 ? `+${row.liveBonus}` : '–'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">{row.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
