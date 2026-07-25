import TeamFlag from "@/components/TeamFlag";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { User } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { Match } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { UserStats } from "@/api/entities";
import CircleLoader from "@/components/CircleLoader";
import { Round } from "@/api/entities";
import { calculateScoreByRound } from "../components/utils/calculateScoreByRound";
import { calculateMatchMaxPotentialPoints } from "../components/utils/calculateMatchMaxPotentialPoints";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidingNumber } from "../components/animate-ui/text/sliding-number";
import { FlexibleIcon } from "../components/ui/FlexibleIcon";
import { BarChart } from "../components/ui/BarChart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import RankingHistoryTable from "../components/stats/RankingHistoryTable";
import ExactHitsHistoryTable from "../components/stats/ExactHitsHistoryTable";
import PredictionsHeatmap from "../components/stats/PredictionsHeatmap";
import UserRankingsSummary from "../components/stats/UserRankingsSummary";
import RankingHistoryCharts from "../components/stats/RankingHistoryCharts";
import CategoryLeaderboards from "../components/stats/CategoryLeaderboards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComparisonBar from "../components/stats/ComparisonBar";
import CommonPredictionsStripe from "../components/stats/CommonPredictionsStripe";
import GapTrackingTable from "../components/stats/GapTrackingTable";
import RoundSummaryTable from "../components/stats/RoundSummaryTable";

export default function MyStats() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [bestMatch, setBestMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [exactHitsChartData, setExactHitsChartData] = useState([]);
  const [pointsPercentageChartData, setPointsPercentageChartData] = useState([]);
  const [averagePointsPerMatch, setAveragePointsPerMatch] = useState(0);
  const [averagePointsPerRound, setAveragePointsPerRound] = useState(0);
  const [pointsBreakdownData, setPointsBreakdownData] = useState([]);
  const [exactHitsList, setExactHitsList] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [activeTab, setActiveTab] = useState("stats");
  const [activeChartTab, setActiveChartTab] = useState("points");
  const [activeHitsTab, setActiveHitsTab] = useState("hits");

  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState('');
  const [roundStats, setRoundStats] = useState(false);
  const [roundLoading, setRoundLoading] = useState(false);

  // Comparison state
  const [comparisonUserId, setComparisonUserId] = useState('');
  const [comparisonUserStats, setComparisonUserStats] = useState(null);
  const [comparisonUserName, setComparisonUserName] = useState('');
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [allPlayers, setAllPlayers] = useState([]);
  const [comparisonPointsBreakdown, setComparisonPointsBreakdown] = useState([]);
  const [comparisonBestMatch, setComparisonBestMatch] = useState(null);
  const [comparisonRank, setComparisonRank] = useState(null);
  const [myRank, setMyRank] = useState(null);

  // NEW: Two-player comparison mode
  const [comparisonMode, setComparisonMode] = useState('me'); // 'me' or 'two-players'
  const [comparisonRoundId, setComparisonRoundId] = useState('all');
  const [comparisonMyStats, setComparisonMyStats] = useState(null);
  const [comparisonMyPointsBreakdown, setComparisonMyPointsBreakdown] = useState([]);
  const [comparisonMyBestMatch, setComparisonMyBestMatch] = useState(null);
  const [comparisonMyRank, setComparisonMyRank] = useState(null);
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [player1Stats, setPlayer1Stats] = useState(null);
  const [player2Stats, setPlayer2Stats] = useState(null);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player1Rank, setPlayer1Rank] = useState(null);
  const [player2Rank, setPlayer2Rank] = useState(null);
  const [player1PointsBreakdown, setPlayer1PointsBreakdown] = useState([]);
  const [player2PointsBreakdown, setPlayer2PointsBreakdown] = useState([]);
  const [player1BestMatch, setPlayer1BestMatch] = useState(null);
  const [player2BestMatch, setPlayer2BestMatch] = useState(null);
  const [twoPlayerLoading, setTwoPlayerLoading] = useState(false);

  // Animation variants for dropdown - עדכון למהירות איטית יותר
  const dropdownVariants = {
    visible: {
      clipPath: "inset(0% 0% 0% 0% round 12px)",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.6
      }
    },
    hidden: {
      clipPath: "inset(10% 50% 90% 50% round 12px)",
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        type: "spring",
        bounce: 0
      }
    }
  };

  const itemVariants = {
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        delay: i * 0.1
      }
    }),
    hidden: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(4px)",
      transition: {
        duration: 0.2
      }
    }
  };

  // Enhanced label function for pie chart - show values in category colors
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, index }) => {
    if (!value || value === 0) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.8;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Get the color for this category
    const categoryColor = pointsBreakdownData[index]?.color || '#ffffff'; // Fallback to white if color not found

    return (
      <text
        x={x}
        y={y}
        fill={categoryColor}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm md:text-base font-bold drop-shadow-lg">

        {parseFloat(value).toFixed(2)}
      </text>);

  };

  // NEW: Generic hit rate calculator
  const calculateHitRateForStats = useCallback((stats) => {
    if (!stats || !stats.total_predictions_count || stats.total_predictions_count === 0) {
      return "0%";
    }
    const hitRate = ((stats.exact_hits_count || 0) / stats.total_predictions_count * 100).toFixed(1);
    return `${hitRate}%`;
  }, []);

  const calculatePointsPercentage = useCallback((stats) => {
    if (!stats || !stats.max_possible_points || stats.max_possible_points === 0) {
      return "0%";
    }
    const percentage = ((stats.total_points || 0) / stats.max_possible_points * 100).toFixed(1);
    return `${percentage}%`;
  }, []);

  // NEW: Load stats for a specific player (generic function)
  const loadPlayerStats = useCallback(async (userId, roundId = 'all') => {
    if (!userId) return null;

    try {
      // Get user's display name
      const profiles = await PublicProfile.filter({ user_id: userId });
      const displayName = profiles.length > 0 ? profiles[0].display_name : 'משתמש';

      // Load predictions for points breakdown and best match
      const userPredictions = await Prediction.filter({ user_id: userId });

      // Apply deduplication
      const uniquePredictionsMap = {};
      userPredictions.forEach((prediction) => {
        const key = `${prediction.user_id}_${prediction.match_id}`;
        if (!uniquePredictionsMap[key] ||
        new Date(prediction.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
          uniquePredictionsMap[key] = prediction;
        }
      });
      let uniquePredictions = Object.values(uniquePredictionsMap);

      let stats = {
        total_points: 0,
        exact_hits_count: 0,
        total_predictions_count: 0,
        max_possible_points: 0
      };
      let rank = null;

      const allMatches = await Match.list();

      if (roundId === 'all') {
          const finishedMatches = allMatches.filter(m => m.is_finished);
          const max_possible_points = finishedMatches.reduce((sum, m) => sum + calculateMatchMaxPotentialPoints(m), 0);

          // Load user stats from UserStats entity
          const [userStatsData, allUserStats] = await Promise.all([
            UserStats.filter({ user_id: userId }),
            UserStats.list(),
          ]);

          if (userStatsData.length > 0) {
              stats = { ...userStatsData[0], max_possible_points };
          } else {
              stats = {
                  total_points: 0,
                  exact_hits_count: 0,
                  total_predictions_count: 0,
                  max_possible_points
              };
          }

          // Get rank
          const sortedStats = allUserStats.sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
          const position = sortedStats.findIndex(stat => stat.user_id === userId) + 1;
          rank = position > 0 ? position : null;
      } else {
          const roundMatches = allMatches.filter(m => m.round_id === roundId);
          const finishedRoundMatches = roundMatches.filter(m => m.is_finished);
          stats.max_possible_points = finishedRoundMatches.reduce((sum, m) => sum + calculateMatchMaxPotentialPoints(m), 0);
          
          const roundMatchIds = roundMatches.map(m => m.id);
          uniquePredictions = uniquePredictions.filter(p => roundMatchIds.includes(p.match_id));
          
          stats.total_predictions_count = uniquePredictions.length;
          uniquePredictions.forEach(p => {
              stats.total_points += (p.points_earned || 0);
              if ((p.exact_score_points_earned || 0) > 0) {
                  stats.exact_hits_count += 1;
              }
          });
          
          const allRoundPredictions = await Prediction.list();
          const roundPredictions = allRoundPredictions.filter(p => roundMatchIds.includes(p.match_id));
          
          const uniqueRoundPredsMap = {};
          roundPredictions.forEach(p => {
              const key = `${p.user_id}_${p.match_id}`;
              if (!uniqueRoundPredsMap[key] || new Date(p.created_date) > new Date(uniqueRoundPredsMap[key].created_date)) {
                  uniqueRoundPredsMap[key] = p;
              }
          });
          
          const userPointsMap = {};
          Object.values(uniqueRoundPredsMap).forEach(p => {
              userPointsMap[p.user_id] = (userPointsMap[p.user_id] || 0) + (p.points_earned || 0);
          });
          
          const sortedUsers = Object.entries(userPointsMap).sort((a, b) => b[1] - a[1]);
          const position = sortedUsers.findIndex(([uid, _]) => uid === userId) + 1;
          rank = position > 0 ? position : null;
      }

      // Always calculate breakdown from actual predictions for accuracy
      // (stored user_stats aggregate fields can be stale or missing for older matches)
      const breakdown = { exactScore: 0, correctOutcome: 0, btts: 0, goalsRange: 0 };
      uniquePredictions.forEach((prediction) => {
        breakdown.exactScore     += prediction.exact_score_points_earned        || 0;
        breakdown.correctOutcome += prediction.correct_outcome_points_earned    || 0;
        breakdown.btts           += prediction.both_teams_scored_points_earned  || 0;
        breakdown.goalsRange     += prediction.goals_range_points_earned        || 0;
      });

      const pieData = [];
      if (breakdown.exactScore > 0) {
        pieData.push({ name: 'תוצאה מדויקת', value: parseFloat(breakdown.exactScore.toFixed(2)), color: '#22c55e' });
      }
      if (breakdown.correctOutcome > 0) {
        pieData.push({ name: 'כיוון נכון', value: parseFloat(breakdown.correctOutcome.toFixed(2)), color: '#0ea5e9' });
      }
      if (breakdown.btts > 0) {
        pieData.push({ name: 'שתי קבוצות כובשות', value: parseFloat(breakdown.btts.toFixed(2)), color: '#38bdf8' });
      }
      if (breakdown.goalsRange > 0) {
        pieData.push({ name: 'טווח שערים', value: parseFloat(breakdown.goalsRange.toFixed(2)), color: '#f87171' });
      }

      // Find best match
      let bestMatchResult = null;
      const bestPrediction = uniquePredictions.reduce((best, current) => {
        const currentPoints = current.points_earned || 0;
        const bestPoints = best?.points_earned || 0;
        return currentPoints > bestPoints ? current : best;
      }, null);

      if (bestPrediction && bestPrediction.points_earned > 0) {
        const matches = await Match.filter({ id: bestPrediction.match_id });
        if (matches.length > 0) {
          bestMatchResult = {
            prediction: bestPrediction,
            match: matches[0]
          };
        }
      }

      return {
        stats,
        displayName,
        pointsBreakdown: pieData,
        bestMatch: bestMatchResult,
        rank,
        uniquePredictions // Return unique predictions for chart data generation
      };

    } catch (error) {
      console.error(`Error loading stats for player ${userId}:`, error);
      return null;
    }
  }, []); // Empty dependency array because all internal dependencies are stable or primitive


  const generateChartData = async (userId, rounds, predictions, preloadedMatches = null) => {
    try {
      const allMatches = preloadedMatches || await Match.list();
      const chartPoints = [];
      const chartExactHits = [];
      const chartPointsPercentage = [];

      console.log("MyStats generateChartData: Starting with", rounds.length, "rounds and", predictions.length, "predictions");

      // Sort rounds by order in ascending order (1, 2, 3...) - מחזור 1 ראשון
      const sortedRounds = rounds.sort((a, b) => a.order - b.order);

      let totalRoundsWithFinishedMatches = 0;
      let totalPointsFromAllRounds = 0;

      for (const round of sortedRounds) {
        // Transform round name for display - convert "Group Stage - X" to "Group X"
        const displayRoundName = round.name.replace(/Group Stage - (\d+)/i, 'Group $1');

        // Get matches for this round that are finished
        const roundMatches = allMatches.filter((m) => m.round_id === round.id && m.is_finished);

        console.log(`MyStats: Round ${round.name} has ${roundMatches.length} finished matches`);

        // If no finished matches in this round, still add it with 0 points and 0 exact hits
        if (roundMatches.length === 0) {
          chartPoints.push({
            round: displayRoundName,
            points: 0,
            roundPoints: 0
          });
          chartExactHits.push({
            round: displayRoundName,
            points: 0,
            exactHits: 0
          });
          chartPointsPercentage.push({
            round: displayRoundName,
            percentage: 0
          });
          continue;
        }

        // Get predictions for matches in this round
        const roundPredictions = predictions.filter((p) =>
        roundMatches.some((m) => m.id === p.match_id)
        );

        // Sum points from this round
        const roundPoints = roundPredictions.reduce((sum, pred) => sum + (pred.points_earned || 0), 0);

        // Count exact hits in this round
        const exactHitsInRound = roundPredictions.filter((pred) => {
          const match = roundMatches.find((m) => m.id === pred.match_id);
          return match && pred.predicted_score_a === match.actual_score_a && pred.predicted_score_b === match.actual_score_b;
        }).length;

        // Calculate percentage
        const maxPossiblePoints = roundMatches.reduce((sum, m) => sum + calculateMatchMaxPotentialPoints(m), 0);
        const percentage = maxPossiblePoints > 0 ? (roundPoints / maxPossiblePoints) * 100 : 0;

        console.log(`MyStats: Round ${round.name} - ${roundPredictions.length} predictions, ${roundPoints} points, ${exactHitsInRound} exact hits, ${percentage}%`);

        // Count this round if it has finished matches and user has predictions
        if (roundMatches.length > 0 && roundPredictions.length > 0) {
          totalRoundsWithFinishedMatches++;
          totalPointsFromAllRounds += roundPoints;
        }

        // Add to chart data with transformed names
        chartPoints.push({
          round: displayRoundName,
          points: parseFloat(roundPoints.toFixed(2)),
          roundPoints: parseFloat(roundPoints.toFixed(2))
        });

        chartExactHits.push({
          round: displayRoundName,
          points: exactHitsInRound,
          exactHits: exactHitsInRound
        });

        chartPointsPercentage.push({
          round: displayRoundName,
          percentage: parseFloat(percentage.toFixed(1))
        });
      }

      // Calculate average points per round
      const avgPointsPerRound = totalRoundsWithFinishedMatches > 0 ? totalPointsFromAllRounds / totalRoundsWithFinishedMatches : 0;
      setAveragePointsPerRound(parseFloat(avgPointsPerRound.toFixed(2)));

      console.log("MyStats: Final chart data for points:", chartPoints);
      console.log("MyStats: Final chart data for exact hits:", chartExactHits);
      console.log(`MyStats: Average points per round: ${avgPointsPerRound.toFixed(2)} (from ${totalRoundsWithFinishedMatches} rounds)`);

      setChartData(chartPoints);
      setExactHitsChartData(chartExactHits);
      setPointsPercentageChartData(chartPointsPercentage);
    } catch (error) {
      console.error("Error generating chart data:", error);
      setChartData([]);
      setExactHitsChartData([]);
      setPointsPercentageChartData([]);
    }
  };


  const loadMyStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = await User.me();
      setUser(currentUser);

      // Load all player data for the current user using the new helper
      const myPlayerData = await loadPlayerStats(currentUser.id);
      if (myPlayerData) {
        setUserStats(myPlayerData.stats);
        setPointsBreakdownData(myPlayerData.pointsBreakdown);
        setBestMatch(myPlayerData.bestMatch);
        setMyRank(myPlayerData.rank);

        // Load rounds and matches first
        const roundsData = await Round.list('order');
        setRounds(roundsData);
        const allMatches = await Match.list();

        // Calculate average points per match — רק משחקים שהסתיימו
        const totalPoints = myPlayerData.stats.total_points || 0;
        const finishedMatchIds = new Set(allMatches.filter(m => m.is_finished).map(m => m.id));
        const finishedPredictionsCount = (myPlayerData.uniquePredictions || []).filter(p => finishedMatchIds.has(p.match_id)).length;
        const avgPointsPerMatch = finishedPredictionsCount > 0 ? totalPoints / finishedPredictionsCount : 0;
        setAveragePointsPerMatch(parseFloat(avgPointsPerMatch.toFixed(2)));
        
        // Process exact hits list
        const exactHits = myPlayerData.uniquePredictions.filter(p => (p.exact_score_points_earned || 0) > 0);
        const exactHitsWithMatch = exactHits.map(p => {
          const match = allMatches.find(m => m.id === p.match_id);
          return { prediction: p, match };
        }).filter(item => item.match && item.match.is_finished);
        
        // Sort by total points descending
        exactHitsWithMatch.sort((a, b) => (b.prediction.points_earned || 0) - (a.prediction.points_earned || 0));
        setExactHitsList(exactHitsWithMatch);

        await generateChartData(currentUser.id, roundsData, myPlayerData.uniquePredictions, allMatches);

        // Build heatmap data: rounds → matches → prediction result
        const heatmap = roundsData.map(round => ({
          roundName: round.name,
          roundId: round.id,
          matches: allMatches
            .filter(m => m.round_id === round.id)
            .map(match => {
              const pred = myPlayerData.uniquePredictions.find(p => p.match_id === match.id);
              return {
                matchId:      match.id,
                homeTeam:     match.team_a,
                awayTeam:     match.team_b,
                homeTeamLogo: match.team_a_logo,
                awayTeamLogo: match.team_b_logo,
                isFinished:   !!match.is_finished,
                hasPrediction: !!pred,
                pointsEarned: pred ? (parseFloat(pred.points_earned) || 0) : 0,
                homeScore:    match.actual_score_a,
                awayScore:    match.actual_score_b,
                predictedA:   pred?.predicted_score_a,
                predictedB:   pred?.predicted_score_b,
              };
            }),
        })).filter(r => r.matches.length > 0);
        setHeatmapData(heatmap);

      } else {
        // Handle error/no data for current user
        setUserStats({ total_points: 0, exact_hits_count: 0, total_predictions_count: 0 });
        setPointsBreakdownData([]);
        setBestMatch(null);
        setMyRank(null);
        setAveragePointsPerMatch(0);
        setAveragePointsPerRound(0);
        setChartData([]);
        setExactHitsChartData([]);
        setPointsPercentageChartData([]);
        setExactHitsList([]);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
      setError("שגיאה בטעינת הסטטיסטיקות");
    }
    setLoading(false);
  }, [loadPlayerStats]);

  useEffect(() => {
    loadMyStats();
  }, [loadMyStats]);

  // NEW: Load all players for comparison dropdown
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const profiles = await PublicProfile.list();
        const usersData = await User.list();

        // Create a map to deduplicate by user_id (keep only one profile per user)
        const uniqueProfilesMap = new Map();

        profiles.forEach(profile => {
          if (!uniqueProfilesMap.has(profile.user_id)) {
            uniqueProfilesMap.set(profile.user_id, profile);
          }
        });

        // Convert map back to array and combine with user data
        const playersData = Array.from(uniqueProfilesMap.values())
          .map(profile => {
            const userData = usersData.find(u => u.id === profile.user_id);
            return {
              id: profile.user_id,  // Use user_id as the unique identifier
              name: profile.display_name,  // Only use display_name from profile
              isAdmin: userData?.is_admin || false
            };
          })
          .filter(p =>
            p.name &&
            !p.name.startsWith('user_') &&
            p.id !== user?.id  // Filter out current user
          );

        console.log("MyStats: Loaded unique players:", playersData);
        setAllPlayers(playersData);
      } catch (error) {
        console.error("Error loading players:", error);
      }
    };

    if (user) { // Only load players if the current user is known
      loadPlayers();
    }
  }, [user]); // Dependency on 'user' state to ensure it's loaded before fetching players

  const handleRoundChange = async (roundId) => {
    setSelectedRound(roundId);
    if (!roundId || !user) {
      setRoundStats(false); // Set to false when no round is selected or user is null
      return;
    }

    setRoundLoading(true);
    try {
      const result = await calculateScoreByRound({
        userId: user.id,
        roundId: roundId
      });

      console.log("Frontend Round stats result:", result);

      if (result && result.success !== false) {
        setRoundStats(result);
      } else {
        throw new Error(result?.error || 'Unknown error occurred from frontend calculation');
      }

    } catch (error) {
      console.error("Error loading round stats:", error);
      setRoundStats(false); // Set to false on error
      console.warn("Failed to load round stats. Please try again.");
    }
    setRoundLoading(false);
  };

  // NEW: Enhanced load comparison stats with detailed data (refactored to use loadPlayerStats)
  const loadComparisonStats = useCallback(async (userId, roundId = comparisonRoundId) => {
    if (!userId) {
      setComparisonUserStats(null);
      setComparisonUserName('');
      setComparisonPointsBreakdown([]);
      setComparisonBestMatch(null);
      setComparisonRank(null);
      return;
    }

    setComparisonLoading(true);
    try {
      const playerData = await loadPlayerStats(userId, roundId);
      if (playerData) {
        setComparisonUserStats(playerData.stats);
        setComparisonUserName(playerData.displayName);
        setComparisonPointsBreakdown(playerData.pointsBreakdown);
        setComparisonBestMatch(playerData.bestMatch);
        setComparisonRank(playerData.rank);
      } else {
        setComparisonUserStats(null);
        setComparisonUserName('');
        setComparisonPointsBreakdown([]);
        setComparisonBestMatch(null);
        setComparisonRank(null);
      }
    } catch (error) {
      console.error("Error loading comparison stats:", error);
      setComparisonUserStats(null);
      setComparisonUserName('');
      setComparisonPointsBreakdown([]);
      setComparisonBestMatch(null);
      setComparisonRank(null);
    }
    setComparisonLoading(false);
  }, [loadPlayerStats, comparisonRoundId]);

  // Handle player selection for 'me' comparison
  const handleComparisonPlayerChange = (selectedUserId) => {
    setComparisonUserId(selectedUserId);
    if (selectedUserId) {
      loadComparisonStats(selectedUserId, comparisonRoundId);
    } else {
      setComparisonUserStats(null);
      setComparisonUserName('');
      setComparisonPointsBreakdown([]);
      setComparisonBestMatch(null);
      setComparisonRank(null);
    }
  };

  // NEW: Handle player 1 selection for two-player comparison
  const handlePlayer1Change = async (selectedUserId, roundId = comparisonRoundId) => {
    setPlayer1Id(selectedUserId);
    if (selectedUserId) {
      setTwoPlayerLoading(true);
      const playerData = await loadPlayerStats(selectedUserId, roundId);
      if (playerData) {
        setPlayer1Stats(playerData.stats);
        setPlayer1Name(playerData.displayName);
        setPlayer1PointsBreakdown(playerData.pointsBreakdown);
        setPlayer1BestMatch(playerData.bestMatch);
        setPlayer1Rank(playerData.rank);
      }
      setTwoPlayerLoading(false);
    } else {
      setPlayer1Stats(null);
      setPlayer1Name('');
      setPlayer1PointsBreakdown([]);
      setPlayer1BestMatch(null);
      setPlayer1Rank(null);
    }
  };

  // NEW: Handle player 2 selection for two-player comparison
  const handlePlayer2Change = async (selectedUserId, roundId = comparisonRoundId) => {
    setPlayer2Id(selectedUserId);
    if (selectedUserId) {
      setTwoPlayerLoading(true);
      const playerData = await loadPlayerStats(selectedUserId, roundId);
      if (playerData) {
        setPlayer2Stats(playerData.stats);
        setPlayer2Name(playerData.displayName);
        setPlayer2PointsBreakdown(playerData.pointsBreakdown);
        setPlayer2BestMatch(playerData.bestMatch);
        setPlayer2Rank(playerData.rank);
      }
      setTwoPlayerLoading(false);
    } else {
      setPlayer2Stats(null);
      setPlayer2Name('');
      setPlayer2PointsBreakdown([]);
      setPlayer2BestMatch(null);
      setPlayer2Rank(null);
    }
  };

  const handleComparisonRoundChange = async (roundId) => {
    setComparisonRoundId(roundId);
    setComparisonLoading(true);
    setTwoPlayerLoading(true);
    
    if (comparisonMode === 'me') {
        if (user?.id) {
            const myData = await loadPlayerStats(user.id, roundId);
            if (myData) {
                setComparisonMyStats(myData.stats);
                setComparisonMyPointsBreakdown(myData.pointsBreakdown);
                setComparisonMyBestMatch(myData.bestMatch);
                setComparisonMyRank(myData.rank);
            }
        }
        if (comparisonUserId) {
            await loadComparisonStats(comparisonUserId, roundId);
        }
    } else {
        if (player1Id) {
            await handlePlayer1Change(player1Id, roundId);
        }
        if (player2Id) {
            await handlePlayer2Change(player2Id, roundId);
        }
    }
    
    setComparisonLoading(false);
    setTwoPlayerLoading(false);
  };

  // Initialize my comparison stats when user loads
  useEffect(() => {
    if (user && !comparisonMyStats && userStats) {
        setComparisonMyStats(userStats);
        setComparisonMyPointsBreakdown(pointsBreakdownData);
        setComparisonMyBestMatch(bestMatch);
        setComparisonMyRank(myRank);
    }
  }, [user, userStats, pointsBreakdownData, bestMatch, myRank, comparisonMyStats]);


  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          className="min-h-screen flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <CircleLoader size={60} />
        </motion.div>
      ) : (
      <motion.div
        key="content"
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with improved mobile spacing and reduced top padding */}
        <div className="flex items-center gap-4 mb-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm text-white/70 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
             <h1 className="text-2xl font-bold text-white"></h1>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="flex w-full justify-between mb-6 relative p-1 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.22)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)',
            }}
          >
            {[
              { id: "stats", label: "סטטיסטיקה" },
              { id: "ranking", label: "דירוג" },
              { id: "tables", label: "טבלאות" },
              { id: "head2head", label: "ראש בראש" }
            ].map((tab, index, arr) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:data-[state=active]:bg-transparent rounded-lg"
                style={{
                  color: activeTab === tab.id ? '#000' : '#38bdf8',
                  borderRight: index < arr.length - 1 ? '1px solid rgba(255,255,255,0.14)' : 'none',
                }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 rounded-lg -z-10"
                    style={{
                      background: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 60%, #fff 100%)',
                      boxShadow: '0 2px 12px rgba(56, 189, 248,0.35)',
                      opacity: 0.82,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="ranking" forceMount className="space-y-6 data-[state=inactive]:hidden">
            {/* מגמות דירוג */}
            <RankingHistoryCharts />

            {/* היסטוריית מיקום */}
            <RankingHistoryTable />

            {/* מעקב פערים אינטרקטיבי */}
            <GapTrackingTable />

            {/* סיכום מיקומים למשתתף */}
            <UserRankingsSummary />

          </TabsContent>

          <TabsContent value="stats" forceMount className="space-y-6 data-[state=inactive]:hidden">
            {/* World Cup Reel Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                onClick={() => window.dispatchEvent(new Event('openYearlySummaryPanel'))}
                className="group relative grid w-full cursor-pointer overflow-hidden rounded-2xl px-4 py-5 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200"
              >
                <span>
                  <span className="spark mask-gradient animate-flip before:animate-kitrotate absolute inset-0 h-[100%] w-[100%] overflow-hidden rounded-2xl [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                </span>
                <span className="backdrop absolute inset-px rounded-[11px] bg-neutral-950 transition-colors duration-200" />
                <div className="z-10 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-yellow-400 font-bold text-lg">Champions Reel</p>
                    <span className="text-2xl">🏆</span>
                  </div>
                  <p className="text-slate-400 text-sm">הסיכום האישי שלך בטורניר</p>
                </div>
              </div>
            </motion.div>

            {/* Combined Average Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-6">

              {/* Avg per match — Apple Liquid Glass */}
              <div className="rounded-[20px] p-7 text-center relative overflow-hidden" style={{
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.22)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)',
              }}>
                <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[20px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)' }} />
                <p className="relative text-sm font-semibold mb-4" style={{ color: '#5AC8FA' }}>ממוצע למשחק</p>
                <div className="relative text-3xl font-bold tabular-nums" style={{ color: '#5AC8FA' }}>
                  <SlidingNumber number={averagePointsPerMatch} className="text-3xl font-bold" duration={1.0} delay={0.2} showDecimals={true} />
                </div>
                <p className="relative text-sm font-semibold mt-3" style={{ color: '#5AC8FA', opacity: 0.7 }}>נקודות</p>
              </div>

              {/* Avg per round — Apple Liquid Glass (green accent) */}
              <div className="rounded-[20px] p-7 text-center relative overflow-hidden" style={{
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.22)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)',
              }}>
                <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[20px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)' }} />
                <p className="relative text-sm font-semibold mb-4" style={{ color: '#34C759' }}>ממוצע למחזור</p>
                <div className="relative text-3xl font-bold tabular-nums" style={{ color: '#34C759' }}>
                  <SlidingNumber number={averagePointsPerRound} className="text-3xl font-bold" duration={1.0} delay={0.4} showDecimals={true} />
                </div>
                <p className="relative text-sm font-semibold mt-3" style={{ color: '#34C759', opacity: 0.7 }}>נקודות</p>
              </div>
            </motion.div>

            {/* Best Match Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6">

              {/* Liquid Mercury card */}
              <div className="rounded-[20px] relative overflow-hidden" style={{
                background: 'linear-gradient(160deg, rgba(200,200,210,0.18) 0%, rgba(120,120,135,0.10) 50%, rgba(200,200,210,0.16) 100%)',
                backdropFilter: 'blur(40px) saturate(140%)',
                WebkitBackdropFilter: 'blur(40px) saturate(140%)',
                border: '1px solid rgba(200,200,215,0.30)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.40), inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.20)',
              }}>
                {/* gloss */}
                <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[20px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 40%, transparent 100%)' }} />

                <div className="relative px-6 pt-6 pb-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <FlexibleIcon src="/champions/ch-trophy.png" alt="גביע" size="large" />
                    <h3 className="font-bold text-lg" style={{ color: '#E8E8E8' }}>המשחק הכי טוב שלך</h3>
                  </div>
                </div>

                <div className="relative px-6 pb-6 pt-4">
                  {bestMatch ?
                    <div className="space-y-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center justify-center flex-1">
                          <TeamFlag logo={bestMatch.match.team_a_logo} name={bestMatch.match.team_a} className="w-12 h-12" />
                        </div>
                        <div className="px-5 py-2 rounded-xl flex-shrink-0" style={{
                          background: 'rgba(255,255,255,0.10)',
                          border: '1px solid rgba(255,255,255,0.20)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30)',
                        }}>
                          <span className="font-bold text-xl" style={{ color: '#E8E8E8' }}>
                            {bestMatch.match.actual_score_a} - {bestMatch.match.actual_score_b}
                          </span>
                        </div>
                        <div className="flex items-center justify-center flex-1">
                          <TeamFlag logo={bestMatch.match.team_b_logo} name={bestMatch.match.team_b} className="w-12 h-12" />
                        </div>
                      </div>

                      <div className="rounded-xl p-4" style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.14)',
                      }}>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>הניחוש שלך</p>
                            <p className="font-bold text-lg" style={{ color: '#C0C0C0' }}>
                              {bestMatch.prediction.predicted_score_a} - {bestMatch.prediction.predicted_score_b}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>נקודות</p>
                            <span className="font-bold text-lg" style={{ color: '#E8E8E8' }}>
                              {bestMatch.prediction.points_earned}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{new Date(bestMatch.match.match_date).toLocaleDateString('he-IL')}</span>
                      </div>
                    </div> :
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🏆</div>
                      <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        המשחק הטוב ביותר שלך יופיע כאן ברגע שתצבור נקודות
                      </p>
                    </div>
                  }
                </div>
              </div>
            </motion.div>





            {/* Combined Charts Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6">
              <div className="rounded-[20px] relative overflow-hidden" style={{
                background: 'linear-gradient(160deg, rgba(200,200,210,0.18) 0%, rgba(120,120,135,0.10) 50%, rgba(200,200,210,0.16) 100%)',
                backdropFilter: 'blur(40px) saturate(140%)',
                WebkitBackdropFilter: 'blur(40px) saturate(140%)',
                border: '1px solid rgba(200,200,215,0.30)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.40), inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.20)',
              }}>
                <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[20px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 40%, transparent 100%)' }} />

                {/* Tab buttons */}
                <div className="relative px-4 pt-5 pb-3">
                  <div
                    className="flex w-full p-1 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.14)',
                    }}
                  >
                    {[
                      { id: 'points', label: 'נקודות' },
                      { id: 'percentage', label: 'אחוז צבירה' },
                      { id: 'cumulative', label: 'מצטבר' },
                    ].map((tab, index, arr) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveChartTab(tab.id)}
                        className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 relative"
                        style={{
                          color: activeChartTab === tab.id ? '#000' : 'rgba(255,255,255,0.55)',
                          background: activeChartTab === tab.id
                            ? 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 60%, #fff 100%)'
                            : 'transparent',
                          boxShadow: activeChartTab === tab.id ? '0 2px 10px rgba(56, 189, 248,0.30)' : 'none',
                          borderRight: index < arr.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart content */}
                <div className="relative px-6 pb-6">
                  {activeChartTab === 'points' && (
                    chartData.length > 0 ? (
                      <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                        <div className="relative h-48 w-full overflow-x-auto">
                          <BarChart height={100} items={chartData.map((d) => ({ label: d.round, progress: d.roundPoints || 0 }))} />
                        </div>
                        <div className="mt-6 text-center"><p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>נקודות שהושגו בכל מחזור</p></div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p style={{ color: 'rgba(255,255,255,0.40)' }}>אין נתונים זמינים עדיין</p>
                        <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.28)' }}>הגרף יופיע לאחר שיסתיימו משחקים ויחושבו נקודות</p>
                      </div>
                    )
                  )}

                  {activeChartTab === 'percentage' && (
                    pointsPercentageChartData.length > 0 ? (
                      <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                        <div className="relative h-48 w-full overflow-x-auto">
                          <BarChart height={100} items={pointsPercentageChartData.map((d) => ({ label: d.round, progress: d.percentage || 0 }))} colorScheme="blue" valueSuffix="%" valueLabel={false} />
                        </div>
                        <div className="mt-6 text-center"><p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>אחוז הנקודות שהושגו מתוך המקסימום האפשרי בכל מחזור</p></div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p style={{ color: 'rgba(255,255,255,0.40)' }}>אין נתונים זמינים עדיין</p>
                        <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.28)' }}>הגרף יופיע לאחר שיסתיימו משחקים ויחושבו נקודות</p>
                      </div>
                    )
                  )}

                  {activeChartTab === 'cumulative' && (() => {
                    if (chartData.length === 0) return (
                      <div className="text-center py-8">
                        <p style={{ color: 'rgba(255,255,255,0.40)' }}>אין נתונים זמינים עדיין</p>
                        <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.28)' }}>הגרף יופיע לאחר שיסתיימו משחקים ויחושבו נקודות</p>
                      </div>
                    );
                    let cum = 0;
                    const cumulativeData = chartData.map(d => {
                      cum = parseFloat((cum + (d.roundPoints || 0)).toFixed(2));
                      return { round: d.round, cumulative: cum, roundPts: d.roundPoints || 0 };
                    });
                    const CumulativeTooltip = ({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: 'rgba(15,20,35,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 12px' }}>
                          <p style={{ color: '#38bdf8', fontWeight: 700, fontSize: 12 }}>{d.round}</p>
                          <p style={{ color: '#fff', fontSize: 12 }}>סה״כ מצטבר: <strong>{d.cumulative}</strong></p>
                          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>במחזור זה: +{d.roundPts}</p>
                        </div>
                      );
                    };
                    return (
                      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                        <ResponsiveContainer width="100%" height={190}>
                          <LineChart data={cumulativeData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                            <defs>
                              <linearGradient id="cumLineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="100%" stopColor="#22c55e" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis dataKey="round" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CumulativeTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="cumulative"
                              stroke="url(#cumLineGrad)"
                              strokeWidth={2.5}
                              dot={{ fill: '#38bdf8', r: 4, strokeWidth: 0 }}
                              activeDot={{ r: 6, fill: '#fff', stroke: '#38bdf8', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-4 text-center"><p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>סך הנקודות שצברת לאורך כל הטורניר</p></div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>

            {/* Combined Hits Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6">
              <div className="rounded-[20px] relative overflow-hidden" style={{
                background: 'linear-gradient(160deg, rgba(200,200,210,0.18) 0%, rgba(120,120,135,0.10) 50%, rgba(200,200,210,0.16) 100%)',
                backdropFilter: 'blur(40px) saturate(140%)',
                WebkitBackdropFilter: 'blur(40px) saturate(140%)',
                border: '1px solid rgba(200,200,215,0.30)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.40), inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.20)',
              }}>
                <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[20px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 40%, transparent 100%)' }} />

                {/* Tab buttons */}
                <div className="relative px-4 pt-5 pb-3">
                  <div
                    className="flex w-full p-1 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.14)',
                    }}
                  >
                    {[
                      { id: 'hits', label: 'פגיעות' },
                      { id: 'common', label: 'ניחוש נפוץ' },
                      { id: 'history', label: 'היסטוריה' },
                    ].map((tab, index, arr) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveHitsTab(tab.id)}
                        className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 relative"
                        style={{
                          color: activeHitsTab === tab.id ? '#000' : 'rgba(255,255,255,0.55)',
                          background: activeHitsTab === tab.id
                            ? 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 60%, #fff 100%)'
                            : 'transparent',
                          boxShadow: activeHitsTab === tab.id ? '0 2px 10px rgba(56, 189, 248,0.30)' : 'none',
                          borderRight: index < arr.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart content */}
                <div className="relative px-6 pb-6">
                  {activeHitsTab === 'hits' && (
                    exactHitsChartData.length > 0 ? (
                      <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                        <div className="relative h-48 w-full overflow-x-auto">
                          <BarChart height={100} items={exactHitsChartData.map((d) => ({ label: d.round, progress: d.exactHits || 0 }))} colorScheme="green" />
                        </div>
                        <div className="mt-6 text-center"><p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>פגיעות מדויקות בכל מחזור</p></div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p style={{ color: 'rgba(255,255,255,0.40)' }}>אין נתונים זמינים עדיין</p>
                        <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.28)' }}>הגרף יופיע לאחר שיסתיימו משחקים ויחושבו נקודות</p>
                      </div>
                    )
                  )}

                  {activeHitsTab === 'common' && (
                    heatmapData.length > 0 ? (
                      <CommonPredictionsStripe
                        predictions={heatmapData.flatMap(r =>
                          r.matches
                            .filter(m => m.hasPrediction)
                            .map(m => ({
                              predicted_score_a: m.predictedA,
                              predicted_score_b: m.predictedB,
                              exact_score_points_earned:
                                m.isFinished &&
                                m.predictedA === m.homeScore &&
                                m.predictedB === m.awayScore ? 1 : 0,
                            }))
                        )}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <p style={{ color: 'rgba(255,255,255,0.40)' }}>אין נתונים זמינים עדיין</p>
                      </div>
                    )
                  )}

                  {activeHitsTab === 'history' && (
                    <ExactHitsHistoryTable />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Predictions Heatmap */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="rounded-[20px] relative overflow-hidden" style={{
                background: 'linear-gradient(160deg, rgba(200,200,210,0.18) 0%, rgba(120,120,135,0.10) 50%, rgba(200,200,210,0.16) 100%)',
                backdropFilter: 'blur(40px) saturate(140%)',
                WebkitBackdropFilter: 'blur(40px) saturate(140%)',
                border: '1px solid rgba(200,200,215,0.30)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.40), inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.20)',
              }}>
                <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[20px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 40%, transparent 100%)' }} />
                <div className="relative px-6 pt-6 pb-4 text-center flex items-center justify-center gap-2">
                  <span>🗺️</span>
                  <h3 className="font-bold text-lg" style={{ color: '#E8E8E8' }}>מפת ניחושים</h3>
                </div>
                <div className="relative px-6 pb-6">
                  <PredictionsHeatmap heatmapData={heatmapData} />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="head2head" forceMount className="space-y-6 data-[state=inactive]:hidden">
            {/* Player Comparison Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6">

              <Card style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)' }}>
                <CardHeader className="text-center">
                  <CardTitle className="text-white flex items-center justify-center gap-2">
                    <FlexibleIcon
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a99a73381_image.png"
                      alt="השוואת שחקנים"
                      size="medium"
                    />
                    השוואת סטטיסטיקות
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mode Toggle */}
                  <div className="flex justify-center gap-2">
                    <Button
                      variant={comparisonMode === 'me' ? 'default' : 'outline'}
                      onClick={() => setComparisonMode('me')}
                      className="flex-1 max-w-xs"
                    >
                      ההשוואה שלי
                    </Button>
                    <Button
                      variant={comparisonMode === 'two-players' ? 'default' : 'outline'}
                      onClick={() => setComparisonMode('two-players')}
                      className="flex-1 max-w-xs"
                    >
                      השוואה בין שחקנים
                    </Button>
                  </div>

                  {/* Round Selection */}
                  <div className="text-center mt-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      סנן לפי מחזור
                    </label>
                    <Select value={comparisonRoundId} onValueChange={handleComparisonRoundChange}>
                      <SelectTrigger className="bg-slate-800/90 backdrop-blur-md border-slate-600 text-white max-w-xs mx-auto hover:bg-slate-700/90 focus:bg-slate-700/90 shadow-lg rounded-lg">
                        <SelectValue placeholder="כל המחזורים" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/95 backdrop-blur-md text-white border-slate-600 shadow-2xl rounded-lg overflow-hidden p-1">
                        <SelectItem value="all" className="focus:bg-slate-700/60 hover:bg-slate-700/60 focus:text-blue-300 hover:text-blue-300 rounded-md px-3 py-2 cursor-pointer transition-all duration-300 font-medium">
                          כל המחזורים
                        </SelectItem>
                        {rounds.sort((a, b) => a.order - b.order).map((round) => (
                          <SelectItem key={round.id} value={round.id} className="focus:bg-slate-700/60 hover:bg-slate-700/60 focus:text-blue-300 hover:text-blue-300 rounded-md px-3 py-2 cursor-pointer transition-all duration-300 font-medium">
                            {round.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* EXISTING: My comparison mode */}
                  {comparisonMode === 'me' && (
                    <>
                      {/* Player Selection */}
                      <div className="text-center">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          בחר שחקן להשוואה
                        </label>
                        <Select value={comparisonUserId} onValueChange={handleComparisonPlayerChange}>
                          <SelectTrigger className="bg-slate-800/90 backdrop-blur-md border-slate-600 text-white max-w-xs mx-auto hover:bg-slate-700/90 focus:bg-slate-700/90 shadow-lg rounded-lg">
                            <motion.div
                              whileTap={{ scale: 0.97 }}
                              className="flex items-center justify-between w-full">
                              <SelectValue placeholder="בחר שחקן..." className="text-white" />
                            </motion.div>
                          </SelectTrigger>
                          <AnimatePresence>
                            <SelectContent
                              variants={dropdownVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="bg-slate-800/95 backdrop-blur-md text-white border-slate-600 shadow-2xl rounded-lg overflow-hidden p-1">
                              {allPlayers.map((player, index) =>
                                <motion.div
                                  key={player.id}
                                  custom={index}
                                  variants={itemVariants}
                                  initial="hidden"
                                  animate="visible">
                                  <SelectItem
                                    value={player.id}
                                    className="focus:bg-slate-700/60 hover:bg-slate-700/60 focus:text-blue-300 hover:text-blue-300 rounded-md px-3 py-2 cursor-pointer transition-all duration-300 font-medium">
                                    {player.name}
                                  </SelectItem>
                                </motion.div>
                              )}
                            </SelectContent>
                          </AnimatePresence>
                        </Select>
                      </div>

                      {/* Comparison Display */}
                      {comparisonLoading && (
                        <div className="flex justify-center py-8">
                          <CircleLoader size={60} />
                        </div>
                      )}

                      {!comparisonUserId && !comparisonLoading && (
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4 opacity-60">🤝</div>
                          <p className="text-slate-400 text-lg">בחר שחקן מהרשימה כדי להשוות סטטיסטיקות</p>
                        </div>
                      )}

                      {comparisonUserId && comparisonUserStats && !comparisonLoading && (
                        <div className="space-y-6">
                          {/* Rankings - if available */}
                          {(comparisonMyRank !== null || comparisonRank !== null) && (
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                                <p className="text-slate-400 text-sm mb-1">מיקום שלי</p>
                                <p className="text-2xl font-bold text-blue-400">#{comparisonMyRank || '—'}</p>
                              </div>
                              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                                <p className="text-slate-400 text-sm mb-1">מיקום {comparisonUserName}</p>
                                <p className="text-2xl font-bold text-green-400">#{comparisonRank || '—'}</p>
                              </div>
                            </div>
                          )}

                          {/* Basic Stats Comparison - Visual Bars */}
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-4 px-2">
                                <h4 className="text-white font-semibold text-sm w-1/3 text-left truncate">{user?.display_name || user?.full_name}</h4>
                                <span className="text-slate-500 text-xs w-1/3 text-center">VS</span>
                                <h4 className="text-white font-semibold text-sm w-1/3 text-right truncate">{comparisonUserName}</h4>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-2">
                                <ComparisonBar 
                                    label="סה״כ נקודות" 
                                    value1={comparisonMyStats?.total_points} 
                                    value2={comparisonUserStats?.total_points} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                    formatValue={(v) => parseFloat(v || 0).toFixed(2)} 
                                />
                                <ComparisonBar 
                                    label="פגיעות מדויקות" 
                                    value1={comparisonMyStats?.exact_hits_count} 
                                    value2={comparisonUserStats?.exact_hits_count} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                />
                                <ComparisonBar 
                                    label="אחוז פגיעה" 
                                    value1={parseFloat(calculateHitRateForStats(comparisonMyStats))} 
                                    value2={parseFloat(calculateHitRateForStats(comparisonUserStats))} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                    formatValue={(v) => `${v}%`} 
                                />
                                <ComparisonBar 
                                    label="אחוז צבירת נקודות" 
                                    value1={parseFloat(calculatePointsPercentage(comparisonMyStats))} 
                                    value2={parseFloat(calculatePointsPercentage(comparisonUserStats))} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                    formatValue={(v) => `${v}%`} 
                                />
                            </div>
                          </div>

                          {/* Points Breakdown Comparison */}
                          {(comparisonMyPointsBreakdown.length > 0 || comparisonPointsBreakdown.length > 0) && (
                            <div className="mt-6">
                              <h4 className="text-white font-semibold mb-4 text-center">פילוח נקודות לפי קטגוריות</h4>
                              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-2">
                                <ComparisonBar 
                                    label="תוצאה מדויקת" 
                                    value1={comparisonMyPointsBreakdown.find(d => d.name === 'תוצאה מדויקת')?.value || 0} 
                                    value2={comparisonPointsBreakdown.find(d => d.name === 'תוצאה מדויקת')?.value || 0} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                />
                                <ComparisonBar 
                                    label="כיוון נכון" 
                                    value1={comparisonMyPointsBreakdown.find(d => d.name === 'כיוון נכון')?.value || 0} 
                                    value2={comparisonPointsBreakdown.find(d => d.name === 'כיוון נכון')?.value || 0} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                />
                                <ComparisonBar 
                                    label="שתי קבוצות כובשות" 
                                    value1={comparisonMyPointsBreakdown.find(d => d.name === 'שתי קבוצות כובשות')?.value || 0} 
                                    value2={comparisonPointsBreakdown.find(d => d.name === 'שתי קבוצות כובשות')?.value || 0} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                />
                                <ComparisonBar 
                                    label="טווח שערים" 
                                    value1={comparisonMyPointsBreakdown.find(d => d.name === 'טווח שערים')?.value || 0} 
                                    value2={comparisonPointsBreakdown.find(d => d.name === 'טווח שערים')?.value || 0} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                />
                              </div>
                            </div>
                          )}

                          {/* Best Match Comparison */}
                          {(comparisonMyBestMatch || comparisonBestMatch) && (
                            <div className="mt-6">
                              <h4 className="text-white font-semibold mb-4 text-center">המשחק הכי טוב</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {/* My Best Match */}
                                <div className="bg-slate-700/20 rounded-lg p-4">
                                  <p className="text-slate-300 text-sm text-center mb-3">{user?.display_name || user?.full_name}</p>
                                  {comparisonMyBestMatch ? (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-center gap-2">
                                        <TeamFlag logo={comparisonMyBestMatch.match.team_a_logo} name={comparisonMyBestMatch.match.team_a} className="w-8 h-8 " />
                                        <span className="text-white font-bold">{comparisonMyBestMatch.match.actual_score_a}-{comparisonMyBestMatch.match.actual_score_b}</span>
                                        <TeamFlag logo={comparisonMyBestMatch.match.team_b_logo} name={comparisonMyBestMatch.match.team_b} className="w-8 h-8 " />
                                      </div>
                                      <div className="text-center">
                                        <p className="text-slate-400 text-xs">הניחוש: {comparisonMyBestMatch.prediction.predicted_score_a}-{comparisonMyBestMatch.prediction.predicted_score_b}</p>
                                        <Badge className="bg-green-600/20 text-green-300 text-sm mt-1">
                                          {comparisonMyBestMatch.prediction.points_earned} נק'
                                        </Badge>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-slate-500 text-xs text-center">אין נתונים</p>
                                  )}
                                </div>

                                {/* Comparison Best Match */}
                                <div className="bg-slate-700/20 rounded-lg p-4">
                                  <p className="text-slate-300 text-sm text-center mb-3">{comparisonUserName}</p>
                                  {comparisonBestMatch ? (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-center gap-2">
                                        <TeamFlag logo={comparisonBestMatch.match.team_a_logo} name={comparisonBestMatch.match.team_a} className="w-8 h-8 " />
                                        <span className="text-white font-bold">{comparisonBestMatch.match.actual_score_a}-{comparisonBestMatch.match.actual_score_b}</span>
                                        <TeamFlag logo={comparisonBestMatch.match.team_b_logo} name={comparisonBestMatch.match.team_b} className="w-8 h-8 " />
                                      </div>
                                      <div className="text-center">
                                        <p className="text-slate-400 text-xs">הניחוש: {comparisonBestMatch.prediction.predicted_score_a}-{comparisonBestMatch.prediction.predicted_score_b}</p>
                                        <Badge className="bg-green-600/20 text-green-300 text-sm mt-1">
                                          {comparisonBestMatch.prediction.points_earned} נק'
                                        </Badge>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-slate-500 text-xs text-center">אין נתונים</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* NEW: Two-player comparison mode */}
                  {comparisonMode === 'two-players' && (
                    <>
                      {/* Player Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center">
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            שחקן 1
                          </label>
                          <Select value={player1Id} onValueChange={handlePlayer1Change}>
                            <SelectTrigger className="bg-slate-800/90 backdrop-blur-md border-slate-600 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 shadow-lg rounded-lg">
                              <SelectValue placeholder="בחר שחקן..." />
                            </SelectTrigger>
                            <SelectContent
                              variants={dropdownVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="bg-slate-800/95 backdrop-blur-md text-white border-slate-600 shadow-2xl rounded-lg overflow-hidden p-1">
                              {allPlayers.filter(p => p.id !== player2Id).map((player, index) => ( // Filter out player 2
                                <motion.div
                                  key={player.id}
                                  custom={index}
                                  variants={itemVariants}
                                  initial="hidden"
                                  animate="visible">
                                  <SelectItem
                                    value={player.id}
                                    className="focus:bg-slate-700/60 hover:bg-slate-700/60 focus:text-blue-300 hover:text-blue-300 rounded-md px-3 py-2 cursor-pointer transition-all duration-300 font-medium"
                                  >
                                    {player.name}
                                  </SelectItem>
                                </motion.div>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="text-center">
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            שחקן 2
                          </label>
                          <Select value={player2Id} onValueChange={handlePlayer2Change}>
                            <SelectTrigger className="bg-slate-800/90 backdrop-blur-md border-slate-600 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 shadow-lg rounded-lg">
                              <SelectValue placeholder="בחר שחקן..." />
                            </SelectTrigger>
                            <SelectContent
                              variants={dropdownVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="bg-slate-800/95 backdrop-blur-md text-white border-slate-600 shadow-2xl rounded-lg overflow-hidden p-1">
                              {allPlayers.filter(p => p.id !== player1Id).map((player, index) => ( // Filter out player 1
                                <motion.div
                                  key={player.id}
                                  custom={index}
                                  variants={itemVariants}
                                  initial="hidden"
                                  animate="visible">
                                  <SelectItem
                                    value={player.id}
                                    className="focus:bg-slate-700/60 hover:bg-slate-700/60 focus:text-blue-300 hover:text-blue-300 rounded-md px-3 py-2 cursor-pointer transition-all duration-300 font-medium"
                                  >
                                    {player.name}
                                  </SelectItem>
                                </motion.div>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Loading State */}
                      {twoPlayerLoading && (
                        <div className="flex justify-center py-8">
                          <CircleLoader size={60} />
                        </div>
                      )}

                      {/* Empty State */}
                      {(!player1Id || !player2Id) && !twoPlayerLoading && (
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4 opacity-60">👥</div>
                          <p className="text-slate-400 text-lg">בחר שני שחקנים כדי להשוות ביניהם</p>
                        </div>
                      )}

                      {/* Two Players Comparison Display */}
                      {player1Id && player2Id && player1Stats && player2Stats && !twoPlayerLoading && (
                        <div className="space-y-6">
                          {/* Rankings */}
                          {(player1Rank !== null || player2Rank !== null) && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                                <p className="text-slate-400 text-sm mb-1">מיקום {player1Name}</p>
                                <p className="text-2xl font-bold text-blue-400">#{player1Rank || '—'}</p>
                              </div>
                              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                                <p className="text-slate-400 text-sm mb-1">מיקום {player2Name}</p>
                                <p className="text-2xl font-bold text-green-400">#{player2Rank || '—'}</p>
                              </div>
                            </div>
                          )}

                          {/* Basic Stats Comparison - Visual Bars */}
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-4 px-2">
                                <h4 className="text-white font-semibold text-sm w-1/3 text-left truncate">{player1Name}</h4>
                                <span className="text-slate-500 text-xs w-1/3 text-center">VS</span>
                                <h4 className="text-white font-semibold text-sm w-1/3 text-right truncate">{player2Name}</h4>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-2">
                                <ComparisonBar 
                                    label="סה״כ נקודות" 
                                    value1={player1Stats?.total_points} 
                                    value2={player2Stats?.total_points} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                    formatValue={(v) => parseFloat(v || 0).toFixed(2)} 
                                />
                                <ComparisonBar 
                                    label="פגיעות מדויקות" 
                                    value1={player1Stats?.exact_hits_count} 
                                    value2={player2Stats?.exact_hits_count} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                />
                                <ComparisonBar 
                                    label="אחוז פגיעה" 
                                    value1={parseFloat(calculateHitRateForStats(player1Stats))} 
                                    value2={parseFloat(calculateHitRateForStats(player2Stats))} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                    formatValue={(v) => `${v}%`} 
                                />
                                <ComparisonBar 
                                    label="אחוז צבירת נקודות" 
                                    value1={parseFloat(calculatePointsPercentage(player1Stats))} 
                                    value2={parseFloat(calculatePointsPercentage(player2Stats))} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                    formatValue={(v) => `${v}%`} 
                                />
                            </div>
                          </div>

                          {/* Points Breakdown Comparison */}
                          {(player1PointsBreakdown.length > 0 || player2PointsBreakdown.length > 0) && (
                            <div className="mt-6">
                              <h4 className="text-white font-semibold mb-4 text-center">פילוח נקודות לפי קטגוריות</h4>
                              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-2">
                                <ComparisonBar 
                                    label="תוצאה מדויקת" 
                                    value1={player1PointsBreakdown.find(d => d.name === 'תוצאה מדויקת')?.value || 0} 
                                    value2={player2PointsBreakdown.find(d => d.name === 'תוצאה מדויקת')?.value || 0} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                />
                                <ComparisonBar 
                                    label="כיוון נכון" 
                                    value1={player1PointsBreakdown.find(d => d.name === 'כיוון נכון')?.value || 0} 
                                    value2={player2PointsBreakdown.find(d => d.name === 'כיוון נכון')?.value || 0} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                />
                                <ComparisonBar 
                                    label="שתי קבוצות כובשות" 
                                    value1={player1PointsBreakdown.find(d => d.name === 'שתי קבוצות כובשות')?.value || 0} 
                                    value2={player2PointsBreakdown.find(d => d.name === 'שתי קבוצות כובשות')?.value || 0} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                />
                                <ComparisonBar 
                                    label="טווח שערים" 
                                    value1={player1PointsBreakdown.find(d => d.name === 'טווח שערים')?.value || 0} 
                                    value2={player2PointsBreakdown.find(d => d.name === 'טווח שערים')?.value || 0} 
                                    color1="bg-blue-500" color2="bg-emerald-500" 
                                />
                              </div>
                            </div>
                          )}

                          {/* Best Match Comparison */}
                          {(player1BestMatch || player2BestMatch) && (
                            <div className="mt-6">
                              <h4 className="text-white font-semibold mb-4 text-center">המשחק הכי טוב</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {/* Player 1 Best Match */}
                                <div className="bg-slate-700/20 rounded-lg p-4">
                                  <p className="text-slate-300 text-sm text-center mb-3">{player1Name}</p>
                                  {player1BestMatch ? (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-center gap-2">
                                        <TeamFlag logo={player1BestMatch.match.team_a_logo} name={player1BestMatch.match.team_a} className="w-8 h-8 " />
                                        <span className="text-white font-bold">{player1BestMatch.match.actual_score_a}-{player1BestMatch.match.actual_score_b}</span>
                                        <TeamFlag logo={player1BestMatch.match.team_b_logo} name={player1BestMatch.match.team_b} className="w-8 h-8 " />
                                      </div>
                                      <div className="text-center">
                                        <p className="text-slate-400 text-xs">הניחוש: {player1BestMatch.prediction.predicted_score_a}-{player1BestMatch.prediction.predicted_score_b}</p>
                                        <Badge className="bg-green-600/20 text-green-300 text-sm mt-1">
                                          {player1BestMatch.prediction.points_earned} נק'
                                        </Badge>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-slate-500 text-xs text-center">אין נתונים</p>
                                  )}
                                </div>

                                {/* Player 2 Best Match */}
                                <div className="bg-slate-700/20 rounded-lg p-4">
                                  <p className="text-slate-300 text-sm text-center mb-3">{player2Name}</p>
                                  {player2BestMatch ? (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-center gap-2">
                                        <TeamFlag logo={player2BestMatch.match.team_a_logo} name={player2BestMatch.match.team_a} className="w-8 h-8 " />
                                        <span className="text-white font-bold">{player2BestMatch.match.actual_score_a}-{player2BestMatch.match.actual_score_b}</span>
                                        <TeamFlag logo={player2BestMatch.match.team_b_logo} name={player2BestMatch.match.team_b} className="w-8 h-8 " />
                                      </div>
                                      <div className="text-center">
                                        <p className="text-slate-400 text-xs">הניחוש: {player2BestMatch.prediction.predicted_score_a}-{player2BestMatch.prediction.predicted_score_b}</p>
                                        <Badge className="bg-green-600/20 text-green-300 text-sm mt-1">
                                          {player2BestMatch.prediction.points_earned} נק'
                                        </Badge>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-slate-500 text-xs text-center">אין נתונים</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="tables" forceMount className="space-y-6 data-[state=inactive]:hidden">
            <RoundSummaryTable />
            <CategoryLeaderboards />
            
            {/* Points Breakdown Pie Chart - Fixed with simple animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6">

              <Card style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)' }}>
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-white flex items-center justify-center gap-2 text-lg md:text-xl">
                    <FlexibleIcon
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/cdffab42c_pie-chart_603148.png"
                      alt="פילוח נקודות"
                      size="medium"
                    />
                    פילוח הניקוד לפי קטגוריות
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-6">
                  {pointsBreakdownData && pointsBreakdownData.length > 0 ?
                    <div className="rounded-xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                      {(() => {
                        const total = pointsBreakdownData.reduce((s, d) => s + (d?.value || 0), 0);
                        const r = 80, cx = 120, cy = 110;
                        const semiCirc = Math.PI * r;
                        let offset = 0;
                        return (
                          <div className="flex flex-col items-center gap-5">
                            {/* Semi-circle gauge */}
                            <div className="relative">
                              <svg width="240" height="130" viewBox="0 0 240 130">
                                {/* background track */}
                                <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="22" strokeLinecap="butt"/>
                                {/* colored segments */}
                                {pointsBreakdownData.map((d, i) => {
                                  const pct = total > 0 ? d.value / total : 0;
                                  const len = pct * semiCirc - 1.5;
                                  const dashOffset = -offset * semiCirc / 1 ;
                                  const seg = (
                                    <path key={i}
                                      d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                                      fill="none"
                                      stroke={d.color}
                                      strokeWidth="22"
                                      strokeLinecap="butt"
                                      strokeDasharray={`${len} ${semiCirc - len}`}
                                      strokeDashoffset={-offset * semiCirc}
                                      opacity={0.9}
                                    />
                                  );
                                  offset += pct;
                                  return seg;
                                })}
                                {/* center total */}
                                <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="22" fontWeight="900">{parseFloat(total).toFixed(0)}</text>
                                <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="11">נקודות סה"כ</text>
                              </svg>
                            </div>

                            {/* Legend rows */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full">
                              {pointsBreakdownData.map((d, i) => {
                                const pct = total > 0 ? (d.value / total * 100).toFixed(1) : 0;
                                return (
                                  <motion.div key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center justify-between rounded-xl px-4 py-3"
                                    style={{ background:`${d.color}10`, border:`1px solid ${d.color}30` }}>
                                    <div className="flex items-center gap-2">
                                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                                      <span className="text-sm text-white/70">{d.name}</span>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-bold" style={{ color: d.color }}>{parseFloat(d.value).toFixed(2)} Pts</p>
                                      <p className="text-xs text-white/30">{pct}%</p>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div> :

                    <div className="text-center py-8 md:py-12">
                      <div className="text-5xl md:text-6xl mb-4 opacity-60">📊</div>
                      <p className="text-slate-400 text-lg md:text-xl font-medium">אין נתוני ניקוד עדיין</p>
                      <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                        הפילוח יופיע לאחר שיסתיימו משחקים ויחושבו נקודות
                      </p>
                    </div>
                  }
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

      </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}