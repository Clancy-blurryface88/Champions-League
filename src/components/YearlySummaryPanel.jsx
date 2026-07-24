import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Target, TrendingUp, HelpCircle, Star, Medal, ArrowRight, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prediction, Match, UserStats, Round, PublicProfile } from "@/api/entities";
import { LoaderBar } from "@/components/ui/LoaderBar";
import LottieAnimation from "@/components/ui/LottieAnimation";

const LEAGUE_ICON_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a99a73381_image.png"; // Trophy icon used in app

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const OverallLeaderboardCard = ({ summaryData, leaderboardRefId, setLeaderboardRefId }) => {
  // Determine reference user (default to 1st place if none selected)
  const refUser = leaderboardRefId ?
  summaryData.overallLeaderboard.find((u) => u.user_id === leaderboardRefId) :
  summaryData.overallLeaderboard[0];
  const refPoints = refUser?.points || 0;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 w-full">
      <h2 className="text-3xl font-black mb-2 tracking-tight mt-8"
        style={{ background:'linear-gradient(135deg,#7dd3fc,#38bdf8,#1e40af)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
        הטבלה הכללית
      </h2>
      <p className="text-slate-400 text-sm mb-6">לחץ על משתתף ובדוק את פער הנקודות</p>

      <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl flex-1 min-h-0 flex flex-col">
        <div className="overflow-y-auto custom-scrollbar p-2 space-y-2 pb-16 flex-1">
          {summaryData.overallLeaderboard.map((player, idx) => {
            const isTop3 = idx < 3;
            const diff = refPoints - player.points;
            const isRef = player.user_id === refUser?.user_id;
            const gapColor = diff > 0 ? "text-green-400" : diff < 0 ? "text-red-400" : "text-slate-500";
            const gapPrefix = diff > 0 ? "+" : "";

            const rankColors = [
            "from-yellow-300 to-yellow-600 border-yellow-500 text-yellow-950",
            "from-slate-300 to-slate-500 border-slate-400 text-slate-900",
            "from-orange-300 to-orange-500 border-orange-400 text-orange-950"];


            return (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setLeaderboardRefId(player.user_id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                player.isMe ?
                'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]' :
                isRef ?
                'bg-white/10 border-white/30 ring-1 ring-white/50 shadow-lg' :
                'bg-slate-700/30 border-slate-600/30'} hover:bg-slate-700/50 transition-all relative overflow-hidden`
                }>

                {isTop3 &&
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shine_3s_infinite]" />
                }

                <div className="flex items-center gap-4 relative z-10">
                  <div className={`
                    w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm border
                    ${isTop3 ?
                  `bg-gradient-to-br ${rankColors[idx]} shadow-lg` :
                  'bg-slate-700 text-slate-400 border-slate-600'}
                  `}>
                    {idx === 0 ? <Crown className="w-4 h-4" /> : player.rank}
                  </div>

                  <div className="text-right">
                    <p className={`font-bold text-sm ${player.isMe ? 'text-blue-300' : 'text-white'}`}>
                      {player.name}
                      {player.isMe && <span className="mr-1 text-xs opacity-70 font-normal">(אני)</span>}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end relative z-10">
                  <div className="bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-700/50 min-w-[60px] text-center mb-1">
                    <span className={`font-mono font-bold ${isTop3 ? 'text-yellow-400' : 'text-blue-400'}`}>
                      {player.points}
                    </span>
                  </div>

                  {!isRef &&
                  <span className={`text-[10px] font-bold px-1.5 rounded bg-black/20 ${gapColor}`}>
                      {gapPrefix}{diff.toFixed(2)}
                    </span>
                  }
                  {isRef &&
                  <span className="text-[10px] text-slate-400 font-medium">
                      נבחר
                    </span>
                  }
                </div>
              </motion.div>);

          })}
        </div>
      </div>
    </div>);

};

export default function YearlySummaryPanel({ onClose, user }) {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [leaderboardRefId, setLeaderboardRefId] = useState(null);

  const paginate = (newDirection) => {
    const nextPage = page + newDirection;
    // Allow navigation (UI buttons handle the exact array bounds)
    if (nextPage >= 0) {
      setPage(nextPage);
      setDirection(newDirection);
    }
  };

  useEffect(() => {
    const fetchAndCalculateSummary = async () => {
      setLoading(true);
      try {
        // Fetch all necessary data
        const allPredictionsFull = await Prediction.list();
        const myPredictions = allPredictionsFull.filter((p) => p.user_id === user.id);
        const allMatches = await Match.list();
        const allUserStats = await UserStats.list();
        const allRounds = await Round.list('order');
        const allProfiles = await PublicProfile.list();

        const currentUserStats = allUserStats.find((s) => s.user_id === user.id) || { total_points: 0, exact_hits_count: 0, total_predictions_count: 0 };

        // Profile Map
        const profileMap = new Map(allProfiles.map((p) => [p.user_id, p]));
        const getUserName = (uid) => profileMap.get(uid)?.display_name || 'User';

        // Filter out users without a display name for the visual leaderboards (but keep for myRank calculation if needed, though usually I have a name)
        // actually, for ranking calculation we should probably include everyone for accuracy, 
        // but for display lists we hide "ghost" users.

        // 1. Overall Rank (Calculation including everyone)
        const sortedByPoints = [...allUserStats].sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
        const myOverallRank = sortedByPoints.findIndex((s) => s.user_id === user.id) + 1;

        // 2. Exact Hits Rank (Calculation including everyone)
        const sortedByExactHits = [...allUserStats].sort((a, b) => (b.exact_hits_count || 0) - (a.exact_hits_count || 0));
        const myExactHitsRank = sortedByExactHits.findIndex((s) => s.user_id === user.id) + 1;

        // Filter for display lists (remove users with no profile or 'User' name)
        const validUsersForDisplay = (statsList) => statsList.filter((s) => {
          const name = profileMap.get(s.user_id)?.display_name;
          return name && name !== 'User';
        });

        const displaySortedByExactHits = validUsersForDisplay(sortedByExactHits);
        const displaySortedByPoints = validUsersForDisplay(sortedByPoints);


        const matchesMap = new Map(allMatches.map((m) => [m.id, m]));

        let totalCorrectOutcome = 0;
        let highestPointsPrediction = null;
        let teamPointsContributions = {};

        // Breakdown points
        let pointsFromExactScore = 0;
        let pointsFromGoalRange = 0;
        let pointsFromBTTS = 0;
        let pointsFromCorrectOutcome = 0;

        for (const prediction of myPredictions) {
          const match = matchesMap.get(prediction.match_id);
          if (!match) continue;

          // Points Breakdown
          pointsFromExactScore += prediction.exact_score_points_earned || 0;
          pointsFromGoalRange += prediction.goals_range_points_earned || 0;
          pointsFromBTTS += prediction.both_teams_scored_points_earned || 0;
          pointsFromCorrectOutcome += prediction.correct_outcome_points_earned || 0;

          // Correct Outcome Count
          if (prediction.correct_outcome_points_earned > 0) {
            totalCorrectOutcome++;
          }

          // Highest Points Prediction
          if (!highestPointsPrediction || prediction.points_earned > highestPointsPrediction.points_earned) {
            highestPointsPrediction = { ...prediction, match };
          }

          // Team Points Contributions
          if (match.team_a && match.team_b && prediction.points_earned > 0) {
            teamPointsContributions[match.team_a] = (teamPointsContributions[match.team_a] || 0) + prediction.points_earned;
            teamPointsContributions[match.team_b] = (teamPointsContributions[match.team_b] || 0) + prediction.points_earned;
          }
        }

        const teamWithMostPoints = Object.entries(teamPointsContributions).sort(([, pointsA], [, pointsB]) => pointsB - pointsA)[0]?.[0] || 'טרם נקבע';

        // --- PREDICTION FREQUENCY & AVERAGE ---
        const predictionCounts = {};
        const predictionHitCounts = {};

        myPredictions.forEach((p) => {
          const scoreKey = `${p.predicted_score_a}-${p.predicted_score_b}`;
          predictionCounts[scoreKey] = (predictionCounts[scoreKey] || 0) + 1;

          if (p.exact_score_points_earned > 0) {
            predictionHitCounts[scoreKey] = (predictionHitCounts[scoreKey] || 0) + 1;
          }
        });

        const predictionFrequency = Object.entries(predictionCounts).
        map(([score, count]) => ({
          score,
          count,
          hitCount: predictionHitCounts[score] || 0,
          percentage: (count / myPredictions.length * 100).toFixed(1)
        })).
        sort((a, b) => b.count - a.count);

        const finishedMatchIds = new Set(allMatches.filter(m => m.is_finished).map(m => m.id));
        const myFinishedPredictions = myPredictions.filter(p => finishedMatchIds.has(p.match_id));
        const averagePoints = myFinishedPredictions.length > 0 ?
        (currentUserStats.total_points / myFinishedPredictions.length).toFixed(2) :
        0;

        const finishedRoundIds = new Set(myFinishedPredictions.map(p => matchesMap.get(p.match_id)?.round_id).filter(Boolean));
        const roundsParticipated = finishedRoundIds.size;
        const averagePointsPerRound = roundsParticipated > 0 ? (currentUserStats.total_points / roundsParticipated).toFixed(2) : 0;

        // --- NEW CALCULATIONS ---

        // 1. Hits Per Round AND Points Per Round (My Stats)
        const hitsPerRoundMap = {};
        const pointsPerRoundMap = {};

        // Initialize with 0 for all rounds
        allRounds.forEach((r) => {
          hitsPerRoundMap[r.id] = { name: r.name, count: 0, order: r.order, id: r.id };
          pointsPerRoundMap[r.id] = { name: r.name, points: 0, order: r.order, id: r.id };
        });

        for (const prediction of myPredictions) {
          const match = matchesMap.get(prediction.match_id);
          if (match) {
            // Hits logic
            if (prediction.exact_score_points_earned > 0) {
              if (hitsPerRoundMap[match.round_id]) {
                hitsPerRoundMap[match.round_id].count++;
              }
            }
            // Points logic
            if (prediction.points_earned > 0) {
              if (pointsPerRoundMap[match.round_id]) {
                pointsPerRoundMap[match.round_id].points += prediction.points_earned;
              }
            }
          }
        }
        const hitsPerRound = Object.values(hitsPerRoundMap).sort((a, b) => a.order - b.order);
        const pointsPerRound = Object.values(pointsPerRoundMap).sort((a, b) => a.order - b.order);
        const maxPointsInRound = Math.max(...pointsPerRound.map((r) => r.points), 5); // Minimum 5 for scale


        // --- Rank Per Round Calculation ---
        // Group matches by round
        const matchesByRound = {};
        allMatches.forEach((m) => {
          if (!matchesByRound[m.round_id]) matchesByRound[m.round_id] = [];
          if (m.is_finished) matchesByRound[m.round_id].push(m);
        });

        // Pre-process predictions: map[matchId][userId] = prediction
        const predictionsMap = {};
        allPredictionsFull.forEach((p) => {
          if (!predictionsMap[p.match_id]) predictionsMap[p.match_id] = {};
          predictionsMap[p.match_id][p.user_id] = p;
        });

        // Calculate rank for each round
        const ranksPerRound = allRounds.map((round) => {
          const roundMatches = matchesByRound[round.id] || [];

          if (roundMatches.length === 0) {
            return { name: round.name, rank: '-', order: round.order };
          }

          // Calculate points for all users in this round
          const userPointsInRound = [];
          const uniqueUserIds = new Set(allProfiles.map((p) => p.user_id));
          // Ensure current user is in the list
          uniqueUserIds.add(user.id);

          uniqueUserIds.forEach((userId) => {
            let points = 0;
            roundMatches.forEach((match) => {
              const pred = predictionsMap[match.id]?.[userId];
              if (pred) {
                points += pred.points_earned || 0;
              }
            });
            userPointsInRound.push({ userId, points });
          });

          // Sort desc
          userPointsInRound.sort((a, b) => b.points - a.points);

          // Find rank
          let myRank = '-';
          let currentRank = 1;
          for (let i = 0; i < userPointsInRound.length; i++) {
            if (i > 0 && userPointsInRound[i].points < userPointsInRound[i - 1].points) {
              currentRank = i + 1;
            }
            // Note: if equal, same rank (dense ranking or standard? Standard usually skips)
            // Standard: 1, 1, 3. 
            // Logic above: if equal, currentRank stays same. If less, currentRank becomes i+1.

            if (userPointsInRound[i].userId === user.id) {
              myRank = currentRank;
              break;
            }
          }

          return { name: round.name, rank: myRank, order: round.order };
        }).sort((a, b) => a.order - b.order);

        // 2. Hits Leaderboard (Top 10)
        const hitsLeaderboard = displaySortedByExactHits.slice(0, 10).map((stats, index) => ({
          rank: index + 1,
          name: getUserName(stats.user_id),
          count: stats.exact_hits_count,
          isMe: stats.user_id === user.id
        }));

        // 3. Overall Leaderboard (Top 10)
        const overallLeaderboard = displaySortedByPoints.slice(0, 10).map((stats, index) => ({
          rank: index + 1,
          name: getUserName(stats.user_id),
          points: stats.total_points,
          isMe: stats.user_id === user.id,
          user_id: stats.user_id
        }));

        setSummaryData({
          hitsPerRound,
          hitsLeaderboard,
          overallLeaderboard,
          myOverallRank,
          myExactHitsRank,
          totalPoints: currentUserStats.total_points,
          exactHitsCount: currentUserStats.exact_hits_count,
          totalPredictionsCount: currentUserStats.total_predictions_count,
          exactHitsPoints: pointsFromExactScore, // Points strictly from exact score bonus? Or total points on exact hit matches? Usually explicitly stored.
          correctOutcomeCount: totalCorrectOutcome,
          correctOutcomePoints: pointsFromCorrectOutcome,
          teamWithMostPoints,
          highestPointsPrediction,
          pointsFromExactScore,
          pointsFromGoalRange,
          pointsFromBTTS,
          pointsPerRound,
          maxPointsInRound,
          ranksPerRound,
          predictionFrequency,
          averagePoints,
          averagePointsPerRound
        });
      } catch (error) {
        console.error("Error fetching yearly summary data:", error);
        setSummaryData(null);
      }
      setLoading(false);
    };

    if (user) {
      fetchAndCalculateSummary();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-black/70">
        <LoaderBar text="LOADING" />
      </div>);

  }

  if (!summaryData) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4">
          <X className="h-6 w-6" />
        </Button>
        <p>שגיאה בטעינת הנתונים</p>
      </div>);

  }

  // --- CARD COMPONENTS ---

  const Card1_Intro = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 select-none">
      <motion.p initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        className="text-xs uppercase tracking-[0.3em] text-white/30 font-semibold mb-8">ליגת האלופות 2026</motion.p>

      <motion.div initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.15, type:'spring', stiffness:200 }}
        className="relative mb-8">
        <div className="absolute inset-0 rounded-full blur-3xl" style={{ background:'rgba(59,130,246,0.35)', transform:'scale(1.5)' }} />
        <img src={LEAGUE_ICON_URL} alt="Trophy" draggable={false}
          className="w-36 h-36 object-contain relative z-10 pointer-events-none"
          style={{ filter:'drop-shadow(0 0 24px rgba(59,130,246,0.6))' }} />
      </motion.div>

      <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
        className="text-5xl font-black mb-2"
        style={{ background:'linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.6) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
        Champions Reel
      </motion.h1>

      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
        className="text-white/40 text-sm mb-10">הסטטיסטיקה המלאה שלך</motion.p>

      <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.45, type:'spring' }}
        className="rounded-2xl px-10 py-5" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(20px)' }}>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">המיקום שלך</p>
        <p className="text-6xl font-black" style={{ background:'linear-gradient(135deg,#38bdf8,#1e40af)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          #{summaryData.myOverallRank}
        </p>
      </motion.div>

      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
        className="mt-8 text-white/25 text-xs">החלק ימינה להמשיך →</motion.p>
    </div>
  );


  const Card2_TotalPoints = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 select-none">
      <motion.p initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        className="text-xs uppercase tracking-[0.25em] text-white/30 mb-6">סה"כ נקודות</motion.p>

      <motion.div initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.2, type:'spring', stiffness:150 }}
        className="w-56 h-56 mb-4" style={{ filter:'hue-rotate(-165deg) saturate(2) brightness(1.3)' }}>
        <LottieAnimation src="https://media.base44.com/files/public/68656264510003eeef16bac3/46691d85b_coinsblue.json" loop={false} />
      </motion.div>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}>
        <div className="text-[5.5rem] font-black leading-none"
          style={{ background:'linear-gradient(135deg,#7dd3fc,#38bdf8,#1e40af)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:'drop-shadow(0 0 30px rgba(56,189,248,0.4))' }}>
          {summaryData.totalPoints}
        </div>
        <p className="text-white/40 text-sm mt-2 tracking-widest uppercase">נקודות</p>
      </motion.div>
    </div>
  );


  const Card2b_AveragePoints = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
       <div className="relative mb-8">
         <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full"></div>
         <TrendingUp className="w-24 h-24 text-cyan-400 relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
       </div>
       <h2 className="text-2xl font-bold text-white mb-6">ממוצע נקודות</h2>
       <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 drop-shadow-lg">
         {summaryData.averagePoints}
       </div>
       <p className="text-slate-300 mt-2 text-lg">נקודות בממוצע למשחק</p>
       
       <div className="mt-8 pt-6 border-t border-slate-700/50 w-full max-w-xs">
         <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 drop-shadow-lg">
           {summaryData.averagePointsPerRound}
         </div>
         <p className="text-slate-300 mt-2 text-lg">נקודות בממוצע למחזור</p>
       </div>
    </div>;


  const Card2c_PredictionFrequency = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-4 w-full">
      <HelpCircle className="w-16 h-16 text-purple-400 mb-6" />
      <h2 className="text-2xl font-bold text-white mb-6">התוצאות הנפוצות שלך</h2>
      <div className="w-full max-w-md bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="overflow-y-auto custom-scrollbar p-0 flex-1">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-center text-slate-400">תוצאה</th>
                <th className="p-3 text-center text-slate-400">כמות</th>
                <th className="p-3 text-center text-slate-400">פגיעות</th>
                <th className="p-3 text-center text-slate-400">אחוז</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.predictionFrequency.map((item, idx) =>
            <tr key={idx} className="border-t border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-3 text-center font-mono font-bold text-white text-lg">{item.score}</td>
                  <td className="p-3 text-center font-bold text-purple-400">{item.count}</td>
                  <td className="p-3 text-center font-bold text-blue-400">{item.hitCount}</td>
                  <td className="p-3 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                       <span>{item.percentage}%</span>
                       <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-purple-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                       </div>
                    </div>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>;


  const Card3_ExactHits = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Target className="w-20 h-20 text-red-500 mb-8" />
      <h2 className="text-2xl font-bold text-white mb-4">הצלחת לפגוע ב</h2>
      <div className="text-8xl font-black text-red-500 mb-2">
        {summaryData.exactHitsCount}
      </div>
      <div className="text-2xl text-slate-300 font-medium mb-4">
        תוצאות מדויקות
      </div>
      <div className="bg-slate-800/50 rounded-full px-6 py-2 mt-4 border border-slate-700">
        <p className="text-lg text-slate-300">
          {summaryData.totalPredictionsCount > 0 ?
        (summaryData.exactHitsCount / summaryData.totalPredictionsCount * 100).toFixed(1) :
        0}% פגיעות מדויקות
        </p>
      </div>
    </div>;


  const Card_HitsPerRound = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-4 w-full">
      <h2 className="text-2xl font-bold text-white mb-6">פגיעות לפי מחזור</h2>
      <div className="w-full max-w-md bg-slate-800/50 rounded-xl p-4 border border-slate-700 h-[60vh] overflow-y-auto custom-scrollbar">
        <div className="space-y-3">
          {summaryData.hitsPerRound.map((round, idx) =>
        <div key={idx} className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-16 text-right shrink-0">{round.name}</span>
              <div className="flex-1 bg-slate-700/50 rounded-full h-4 overflow-hidden">
                <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(round.count / 5 * 100, 100)}%` }} // Assume 5 is a good max reference, or dynamic
              className="bg-emerald-500 rounded-full h-full" />

              </div>
              <span className="text-sm font-bold text-white w-6 shrink-0">{round.count}</span>
            </div>
        )}
        </div>
      </div>
    </div>;


  const Card_HitsLeaderboard = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-4 w-full">
      <Target className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-6">טבלת פגיעות מדויקות</h2>
      <div className="w-full max-w-md bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 sticky top-0">
              <tr>
                <th className="p-3 text-center text-slate-400">פגיעות</th>
                <th className="p-3 text-right text-slate-400">שם</th>
                <th className="p-3 text-center text-slate-400">#</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.hitsLeaderboard.map((player, idx) =>
            <tr key={idx} className={`border-t border-slate-700/50 ${player.isMe ? 'bg-blue-500/20' : ''}`}>
                  <td className="p-3 text-center font-bold text-red-400">{player.count}</td>
                  <td className="p-3 text-right font-medium text-white">{player.name} {player.isMe && '(אני)'}</td>
                  <td className="p-3 text-center font-medium text-slate-300">{player.rank}</td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>;




  const Card4_ExactHitsPointsRank = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 rounded-full"></div>
        <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68656264510003eeef16bac3/777e305ab_focus_18224750.png"
        alt="Focus Target"
        draggable={false}
        className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] pointer-events-none" />

      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">הצלחת לצבור סה"כ</h2>
      <div className="text-7xl font-black text-yellow-400 mb-0">
        {summaryData.exactHitsPoints}
      </div>
      <div className="text-yellow-400 mb-4 text-2xl font-bold">נקודות</div>
      
      <p className="text-yellow-400 mb-8 text-xl">מניחושים מדויקים</p>
      
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-full max-w-xs">
        <p className="text-sm text-slate-400 mb-1">המיקום שלך בטבלת הפגיעות</p>
        <p className="text-4xl font-bold text-white">מקום #{summaryData.myExactHitsRank}</p>
      </div>
    </div>;


  const Card5_CorrectOutcome = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <TrendingUp className="w-20 h-20 text-green-500 mb-8" />
      <h2 className="text-2xl font-bold text-white mb-4">הצלחת לצבור כתוצאה מניחושי קבוצה מנצחת</h2>
      <div className="text-7xl font-black text-green-500 mb-8">
        {Number(summaryData.correctOutcomePoints).toLocaleString('en-US', { maximumFractionDigits: 2 })}
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <p className="text-3xl font-bold text-white">{summaryData.correctOutcomeCount}</p>
          <p className="text-xs text-slate-400">פגיעות</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <p className="text-3xl font-bold text-white">
            {summaryData.totalPredictionsCount > 0 ?
          (summaryData.correctOutcomeCount / summaryData.totalPredictionsCount * 100).toFixed(0) :
          0}%
          </p>
          <p className="text-xs text-slate-400">אחוז דיוק</p>
        </div>
      </div>
    </div>;


  const Card6_PointsPerRound = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-4 w-full">
      <h2 className="text-2xl font-bold text-white mb-6">נקודות לפי מחזור</h2>
      <div className="w-full max-w-md bg-slate-800/50 rounded-xl p-4 border border-slate-700 h-[60vh] overflow-y-auto custom-scrollbar">
        <div className="space-y-3">
          {summaryData.pointsPerRound.map((round, idx) =>
        <div key={idx} className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-16 text-right shrink-0 leading-tight">{round.name}</span>
              <div className="flex-1 bg-slate-700/50 rounded-full h-4 overflow-hidden">
                <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${round.points / summaryData.maxPointsInRound * 100}%` }}
              className="bg-yellow-500 h-full rounded-full" />

              </div>
              <span className="text-sm font-bold text-white w-10 text-left shrink-0">{Number(round.points).toLocaleString('en-US', { maximumFractionDigits: 1 })}</span>
            </div>
        )}
        </div>
      </div>
    </div>;


  const Card6b_RankPerRound = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-4 w-full">
      <h2 className="text-2xl font-bold text-white mb-6">מיקום לפי מחזור</h2>
      <div className="w-full max-w-md bg-slate-800/50 rounded-xl p-4 border border-slate-700 h-[60vh] overflow-y-auto custom-scrollbar">
        <div className="space-y-3">
          {summaryData.ranksPerRound.map((round, idx) => {
          const isTop3 = round.rank <= 3 && round.rank !== '-';
          return (
            <div key={idx} className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg border border-slate-600/30">
                <span className="text-blue-200 text-sm">{round.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${isTop3 ? 'text-yellow-400' : 'text-white'}`}>
                    {round.rank}
                  </span>
                </div>
              </div>);

        })}
        </div>
      </div>
    </div>;


  const Card7_BestMatch = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Medal className="w-20 h-20 text-orange-400 mb-8" />
      <h2 className="text-2xl font-bold text-white mb-6">המשחק עם הכי הרבה נקודות</h2>
      {summaryData.highestPointsPrediction ?
    <div className="bg-slate-800/80 p-6 rounded-xl border border-orange-500/30 w-full">
          <div className="flex items-center justify-center gap-4 text-2xl font-bold text-white mb-4">
            <span>{summaryData.highestPointsPrediction.match.team_a}</span>
            <span className="text-sm text-slate-400">VS</span>
            <span>{summaryData.highestPointsPrediction.match.team_b}</span>
          </div>
          <div className="h-px bg-slate-700 w-full mb-4"></div>
          <p className="text-orange-400 text-5xl font-black">{summaryData.highestPointsPrediction.points_earned}</p>
          <p className="text-orange-400 mt-1 text-sm">נקודות</p>
        </div> :

    <p className="text-slate-400">אין נתונים</p>
    }
    </div>;


  const Card8_Breakdown = () => {
    const total = summaryData.totalPoints || 1; // Avoid division by zero
    const getPercent = (amount) => (amount / total * 100).toFixed(0);

    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-white mb-10">התפלגות נקודות</h2>

        <div className="space-y-4 w-full">
          <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border-r-4 border-red-500">
            <span className="text-slate-200 text-lg">פגיעה בתוצאה</span>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{Number(summaryData.pointsFromExactScore).toFixed(0)}</div>
              <div className="text-xs text-slate-400">{getPercent(summaryData.pointsFromExactScore)}%</div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border-r-4 border-green-500">
            <span className="text-slate-200 text-lg">תוצאה נכונה</span>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{Number(summaryData.correctOutcomePoints).toFixed(0)}</div>
              <div className="text-xs text-slate-400">{getPercent(summaryData.correctOutcomePoints)}%</div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border-r-4 border-purple-500">
            <span className="text-slate-200 text-lg">טווח שערים</span>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{Number(summaryData.pointsFromGoalRange).toFixed(0)}</div>
              <div className="text-xs text-slate-400">{getPercent(summaryData.pointsFromGoalRange)}%</div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border-r-4 border-blue-500">
            <span className="text-slate-200 text-lg">שתי קבוצות כובשות</span>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{Number(summaryData.pointsFromBTTS).toFixed(0)}</div>
              <div className="text-xs text-slate-400">{getPercent(summaryData.pointsFromBTTS)}%</div>
            </div>
          </div>
        </div>
      </div>);

  };

  const Card9_Outro = () =>
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="relative mb-8">
         <Star className="w-24 h-24 text-yellow-400 fill-yellow-400 animate-spin-slow" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-10">בהצלחה בהמשך</h2>
      
      <Button
      onClick={onClose}
      className="bg-white text-slate-900 hover:bg-slate-200 text-xl font-bold py-6 px-12 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105">

        סיימתי
      </Button>
    </div>;


  const pages = [
  <Card1_Intro key="1" />,
  <Card2_TotalPoints key="2" />,
  <Card2b_AveragePoints key="2b" />,
  <Card3_ExactHits key="3" />,
  <Card_HitsLeaderboard key="hits-leaderboard" />,
  <Card_HitsPerRound key="hits-per-round" />,
  <Card2c_PredictionFrequency key="2c" />,
  <Card4_ExactHitsPointsRank key="4" />,
  <Card5_CorrectOutcome key="5" />,
  <Card6_PointsPerRound key="6" />,
  <Card6b_RankPerRound key="6b" />,
  <Card7_BestMatch key="7" />,
  <Card8_Breakdown key="8" />,
  <OverallLeaderboardCard
    key="overall-leaderboard"
    summaryData={summaryData}
    leaderboardRefId={leaderboardRefId}
    setLeaderboardRefId={setLeaderboardRefId} />,

  <Card9_Outro key="9" />];


  // Per-page color themes for dynamic background
  const PAGE_COLORS = [
    '#3b82f6', '#38bdf8', '#06b6d4', '#ef4444',
    '#ef4444', '#ef4444', '#a855f7', '#f97316',
    '#22c55e', '#38bdf8', '#60a5fa', '#fb923c',
    '#f59e0b', '#3b82f6', '#facc15',
  ];
  const accent = PAGE_COLORS[page] || '#3b82f6';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed inset-0 z-50 text-white flex flex-col"
      style={{ background: '#04060f' }}>

      {/* Dynamic animated background blob */}
      <AnimatePresence mode="sync">
        <motion.div
          key={page}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `radial-gradient(ellipse at 50% 35%, ${accent}22 0%, transparent 65%)`,
          }}
        />
      </AnimatePresence>

      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '180px' }} />

      {/* Close button */}
      <div className="absolute top-14 right-4 z-50">
        <button onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <X className="h-4 w-4 text-white/80" />
        </button>
      </div>

      {/* Progress pills */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 px-3 pt-3 z-40">
        {pages.map((_, idx) => (
          <div key={idx} className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
            {idx < page && <div className="h-full w-full rounded-full" style={{ background: 'rgba(255,255,255,0.7)' }} />}
            {idx === page && (
              <motion.div className="h-full rounded-full" style={{ background: 'white' }}
                initial={{ width: '0%' }} animate={{ width: '100%' }}
                transition={{ duration: 0.3 }} />
            )}
          </div>
        ))}
      </div>


      {/* Card content — tap right half to advance, left half to go back */}
      <div className="flex-grow flex items-center justify-center relative overflow-hidden z-10">
        {/* Tap zones */}
        <div className="absolute inset-0 flex z-20">
          <div className="flex-1 cursor-pointer" onClick={() => paginate(-1)} />
          <div className="flex-1 cursor-pointer" onClick={() => paginate(1)} />
        </div>

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 280, damping: 28 }, opacity: { duration: 0.15 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) paginate(1);
              else if (swipe > swipeConfidenceThreshold) paginate(-1);
            }}
            className="absolute w-full h-full flex items-center justify-center z-10">
            {pages[page]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-between items-center px-8 pb-10 pt-4 z-40">
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 ${page === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <ArrowRight className="w-5 h-5 text-white rotate-180" />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5 items-center">
          {pages.map((_, idx) => (
            <button key={idx} onClick={() => { const d = idx > page ? 1 : -1; setDirection(d); setPage(idx); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === page ? 20 : 6,
                height: 6,
                background: idx === page ? accent : 'rgba(255,255,255,0.2)',
              }} />
          ))}
        </div>

        {page < pages.length - 1 ? (
          <button
            onClick={() => paginate(1)}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: `${accent}25`, border: `1px solid ${accent}50` }}>
            <ArrowRight className="w-5 h-5" style={{ color: accent }} />
          </button>
        ) : (
          <button onClick={onClose}
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all hover:scale-110"
            style={{ background: accent, color: '#000' }}>
            ✓
          </button>
        )}
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}