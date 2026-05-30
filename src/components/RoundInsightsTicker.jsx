import TeamFlag from "@/components/TeamFlag";
import React, { useState, useEffect } from 'react';
import { Match } from "@/api/entities";
import { Round } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { calculateMatchMaxPotentialPoints } from "@/components/utils/calculateMatchMaxPotentialPoints";
import { Trophy, Target, Star, Zap } from "lucide-react";
import { TextLoop } from "@/components/core/text-loop";

const CircularProgress = ({ percentage }) => {
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage / 100 * circumference;
  const color = percentage >= 80 ? '#10b981' : percentage >= 50 ? '#eab308' : '#ef4444';

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="transform -rotate-90">
      <circle cx="10" cy="10" r={radius} stroke="#334155" strokeWidth="3" fill="none" />
      <circle cx="10" cy="10" r={radius} stroke={color} strokeWidth="3" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
    </svg>);

};

// Helper to calculate score for a user in a specific round using pre-fetched data
const calculateRoundStats = (userId, roundMatches, allPredictions) => {
  // Filter predictions for this user and these matches
  const roundMatchIds = roundMatches.map((m) => m.id);
  const userPredictions = allPredictions.filter((p) =>
  p.user_id === userId && roundMatchIds.includes(p.match_id)
  );

  // Deduplicate predictions (keep latest)
  const uniquePredictionsMap = {};
  userPredictions.forEach((prediction) => {
    const key = `${prediction.user_id}_${prediction.match_id}`;
    if (!uniquePredictionsMap[key] ||
    new Date(prediction.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
      uniquePredictionsMap[key] = prediction;
    }
  });
  const uniquePredictions = Object.values(uniquePredictionsMap);

  let totalPoints = 0;
  let exactScoreHits = 0;
  let correctOutcomes = 0;
  let totalFinishedPredictions = 0;
  const predictionDetails = [];

  for (const prediction of uniquePredictions) {
    const match = roundMatches.find((m) => m.id === prediction.match_id);
    if (!match || !match.is_finished) continue;

    totalFinishedPredictions++;
    const points = prediction.points_earned || 0;
    totalPoints += points;

    // Check exact score
    if (prediction.predicted_score_a === match.actual_score_a &&
    prediction.predicted_score_b === match.actual_score_b) {
      exactScoreHits++;
    }

    // Check correct outcome
    const predOutcome = prediction.predicted_score_a > prediction.predicted_score_b ? 'home' :
    prediction.predicted_score_a < prediction.predicted_score_b ? 'away' : 'draw';
    const actualOutcome = match.actual_score_a > match.actual_score_b ? 'home' :
    match.actual_score_a < match.actual_score_b ? 'away' : 'draw';

    if (predOutcome === actualOutcome) {
      correctOutcomes++;
    }

    predictionDetails.push({
      matchId: match.id,
      points: points
    });
  }

  predictionDetails.sort((a, b) => b.points - a.points);

  return {
    totalPoints,
    exactScoreHits,
    correctOutcomes,
    totalFinishedPredictions,
    predictionDetails
  };
};

export default function RoundInsightsTicker({ user }) {
  const [tickerData, setTickerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // Parallel fetch for maximum speed
        const [rounds, matches, allPredictions] = await Promise.all([
        Round.list('order'),
        Match.list(),
        Prediction.list()]
        );

        // מציג סיכום של המחזור האחרון שהושלם לגמרי
        const roundsWithMatches = rounds.filter((r) => matches.some((m) => m.round_id === r.id));

        let lastCompletedRound = null;
        let previousCompletedRound = null;
        let roundMatches = [];
        let previousRoundMatches = [];

        // חיפוש מהאחרון לראשון — מצא את המחזור האחרון שכל משחקיו הסתיימו וחושבו
        for (let i = roundsWithMatches.length - 1; i >= 0; i--) {
          const r = roundsWithMatches[i];
          const rMatches = matches.filter((m) => m.round_id === r.id);
          const allFinished = rMatches.length > 0 && rMatches.every((m) => m.is_finished && m.is_score_calculated);
          if (allFinished) {
            if (!lastCompletedRound) {
              lastCompletedRound = r;
              roundMatches = rMatches;
            } else if (!previousCompletedRound) {
              previousCompletedRound = r;
              previousRoundMatches = rMatches;
              break;
            }
          }
        }

        if (!lastCompletedRound) {
          setLoading(false);
          return;
        }

        // Calculate stats for current round
        const currentStats = calculateRoundStats(user.id, roundMatches, allPredictions);
        const userPoints = currentStats.totalPoints;

        // Calculate max possible points
        let maxPossiblePoints = 0;
        roundMatches.forEach((m) => {
          maxPossiblePoints += calculateMatchMaxPotentialPoints(m);
        });

        if (maxPossiblePoints === 0) {
          setLoading(false);
          return;
        }

        const hitPercentage = (userPoints / maxPossiblePoints * 100).toFixed(1);

        // Calculate stats for previous round for comparison
        let pointsChangePercentage = null;
        let prevUserPoints = null;
        if (previousCompletedRound) {
          const prevStats = calculateRoundStats(user.id, previousRoundMatches, allPredictions);
          prevUserPoints = prevStats.totalPoints;

          if (prevUserPoints > 0) {
            pointsChangePercentage = ((userPoints - prevUserPoints) / prevUserPoints * 100).toFixed(1);
          } else if (userPoints > 0) {
            pointsChangePercentage = "100.0";
          } else {
            pointsChangePercentage = "0.0";
          }
        }

        // Calculate rank efficiently using loaded predictions
        const roundMatchIds = roundMatches.map((m) => m.id);
        const roundPredictions = allPredictions.filter((p) => roundMatchIds.includes(p.match_id));

        const userPointsMap = {};
        roundPredictions.forEach((p) => {
          // Simple deduplication for rank calc (taking latest point value if multiple exist, though backend handles this usually)
          // Ideally we should do full dedupe, but summing points_earned is usually enough if data is clean
          // Let's do a safer grouping
          const key = `${p.user_id}_${p.match_id}`;
          // We need to ensure we only sum the VALID prediction for each user/match
          // But since we have allPredictions, let's just group by user
          if (!userPointsMap[p.user_id]) userPointsMap[p.user_id] = 0;
        });

        // We need to sum points correctly per user
        // Group all round predictions by user
        const predsByUser = {};
        roundPredictions.forEach((p) => {
          if (!predsByUser[p.user_id]) predsByUser[p.user_id] = [];
          predsByUser[p.user_id].push(p);
        });

        Object.keys(predsByUser).forEach((uid) => {
          // Dedupe for each user
          const userPreds = predsByUser[uid];
          const uniqueMap = {};
          userPreds.forEach((p) => {
            const k = p.match_id;
            if (!uniqueMap[k] || new Date(p.created_date) > new Date(uniqueMap[k].created_date)) {
              uniqueMap[k] = p;
            }
          });

          let uPoints = 0;
          Object.values(uniqueMap).forEach((p) => uPoints += p.points_earned || 0);
          userPointsMap[uid] = uPoints;
        });

        const sortedUsers = Object.entries(userPointsMap).sort(([, a], [, b]) => b - a);
        let myRank = '-';
        let currentRank = 1;
        for (let i = 0; i < sortedUsers.length; i++) {
          if (i > 0 && sortedUsers[i][1] < sortedUsers[i - 1][1]) {
            currentRank = i + 1;
          }
          if (sortedUsers[i][0] === user.id) {
            myRank = currentRank;
            break;
          }
        }

        // Best match item
        let bestMatchItem = null;
        if (currentStats.predictionDetails.length > 0) {
          const bestMatch = currentStats.predictionDetails[0];
          if (bestMatch.points > 0) {
            const matchObj = roundMatches.find((m) => m.id === bestMatch.matchId);
            if (matchObj) {
              bestMatchItem = {
                id: 6,
                text: <><span className="text-white">המשחק הכי טוב שלך:</span> <span className="text-emerald-400 font-bold">{bestMatch.points} נק'</span></>,
                icon:
                <div className="flex items-center gap-1">
                                {matchObj.team_a_logo && <TeamFlag logo={matchObj.team_a_logo} name={matchObj.team_a} className="w-[18px] h-[18px] " />}
                                <span className="text-slate-400 text-[10px] mx-0.5">vs</span>
                                {matchObj.team_b_logo && <TeamFlag logo={matchObj.team_b_logo} name={matchObj.team_b} className="w-[18px] h-[18px] " />}
                            </div>

              };
            }
          }
        }

        const items = [
        {
          id: 0,
          text: <span className="text-white font-bold">סיכום מחזור - {lastCompletedRound.name}</span>,
          icon: <img src="https://media.base44.com/images/public/68656264510003eeef16bac3/628f03bf9_Pngtreegoldtrophyicon-trophy_4979039.png" alt="Trophy" className="w-[18px] h-[18px] object-contain" />
        },
        {
          id: 1,
          text: <><span className="text-white">המיקום שלך במחזור :</span> <span className="text-emerald-400 font-bold">{myRank}</span></>,
          icon: <img src="https://media.base44.com/images/public/68656264510003eeef16bac3/9ec46453b_podium_6111775.png" alt="Rank" className="w-[18px] h-[18px] object-contain" />
        },
        {
          id: 2,
          text: <><span className="text-white">פגיעות:</span> <span className="text-emerald-400 font-bold">{currentStats.exactScoreHits}</span></>,
          icon: <img src="https://media.base44.com/images/public/68656264510003eeef16bac3/ec8635298_target_18283876.png" alt="Target" className="w-[18px] h-[18px] object-contain" />
        },
        ...(pointsChangePercentage !== null ? [{
          id: 3,
          text: <><span className="text-white">אחוז שינוי בצבירת נקודות ממחזור קודם:</span> <span className={`${parseFloat(pointsChangePercentage) > 0 ? 'text-emerald-400' : parseFloat(pointsChangePercentage) < 0 ? 'text-red-400' : 'text-emerald-400'} font-bold`} dir="ltr">{parseFloat(pointsChangePercentage) > 0 ? '+' : ''}{pointsChangePercentage}%</span> <span className="text-slate-400 text-[13px] mr-1">(<span className="text-blue-300 font-bold">{userPoints} נק' בנוכחי</span> לעומת <span className="text-red-300 font-bold">{prevUserPoints} נק' בקודם</span>)</span></>,
          icon: <img src="https://media.base44.com/images/public/68656264510003eeef16bac3/2ee1df452_mobile-data_3466264.png" alt="Trend" className="w-[18px] h-[18px] object-contain" />
        }] : []),
        {
          id: 4,
          text: <><span className="text-white">אחוז הצבירה מסך הנקודות האפשרי:</span> <span className="text-emerald-400 font-bold">{hitPercentage}%</span></>,
          icon: <CircularProgress percentage={parseFloat(hitPercentage)} />
        },
        {
          id: 5,
          text: <><span className="text-white">ניחושי כיוון:</span> <span className="text-emerald-400 font-bold">{currentStats.correctOutcomes}</span> <span className="text-slate-300 text-sm">מתוך {currentStats.totalFinishedPredictions}</span></>,
          icon: <img src="https://media.base44.com/images/public/68656264510003eeef16bac3/c658b4327_goal_17549795.png" alt="Direction" className="w-[18px] h-[18px] object-contain" />
        },
        ...(bestMatchItem !== null ? [bestMatchItem] : [])];


        setTickerData(items);
      } catch (error) {
        console.error("Error fetching round insights:", error);
      }
      setLoading(false);
    };

    fetchInsights();
  }, [user]);

  if (loading || !tickerData || tickerData.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 h-[44px] rounded-t-3xl border-t border-white/[0.08]"
      style={{ background: 'rgba(5,10,20,0.35)', backdropFilter: 'blur(28px) saturate(1.6)', WebkitBackdropFilter: 'blur(28px) saturate(1.6)', boxShadow: '0 -4px 20px rgba(0,0,0,0.2)' }}
    >
    <div className="h-full flex items-center justify-center overflow-hidden rounded-t-3xl">
      <TextLoop
        interval={4}
        className="text-[14px] font-medium"
      >
        {tickerData.map((item) => (
          <div key={item.id} className="flex items-center justify-center gap-2 px-4" dir="rtl">
            {item.icon && (
              <span className="flex items-center justify-center bg-slate-800/80 p-1.5 rounded-md shadow-sm border border-slate-700/50 shrink-0">
                {item.icon}
              </span>
            )}
            <span className="tracking-wide">{item.text}</span>
          </div>
        ))}
      </TextLoop>
    </div>
    </div>
  );
}