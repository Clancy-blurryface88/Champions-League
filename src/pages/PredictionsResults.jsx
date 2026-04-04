import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/api/entities";
import { Round } from "@/api/entities";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LoaderBar } from "../components/ui/LoaderBar";
import LottieAnimation from "@/components/ui/LottieAnimation";
// import { BrkButton } from "../components/ui/BrkButton"; // Removed BrkButton import
import { calculateScoreByRound } from "../components/utils/calculateScoreByRound"; // Import frontend version
import { getRoundLeaderboard } from "../components/utils/getRoundLeaderboard"; // NEW: Import frontend version
import { AnimatedList } from "@/components/magicui/animated-list";
import ScoreAccuracyVisuals from "@/components/predictions/ScoreAccuracyVisuals";
import { calculateMatchMaxPotentialPoints } from "../components/utils/calculateMatchMaxPotentialPoints";

export default function PredictionsResults() {
  const [user, setUser] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [selectedRound, setSelectedRound] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [finishedMatches, setFinishedMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: Add view mode state
  const [viewMode, setViewMode] = useState('all_predictions'); // 'all_predictions', 'my_predictions', or 'leaderboard'
  const [myRoundStats, setMyRoundStats] = useState(null);
  const [loadingMyStats, setLoadingMyStats] = useState(false);
  // NEW: Add leaderboard state
  const [roundLeaderboard, setRoundLeaderboard] = useState(null); // Changed to null initially as it's an object now, not an array
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const navigate = useNavigate();

  // Animation variants for dropdown
  const dropdownVariants = {
    visible: {
      clipPath: "inset(0% 0% 0% 0% round 12px)",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3
      }
    },
    hidden: {
      clipPath: "inset(10% 50% 90% 50% round 12px)",
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
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
        duration: 0.2,
        delay: i * 0.05
      }
    }),
    hidden: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(4px)",
      transition: {
        duration: 0.1
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRound && matches.length > 0) {
      const roundMatches = matches.filter((m) =>
      m.round_id === selectedRound &&
      m.is_finished &&
      m.actual_score_a !== null &&
      m.actual_score_b !== null
      );
      setFinishedMatches(roundMatches);
    }
  }, [selectedRound, matches]);

  const loadData = async () => {
    const startTime = Date.now();
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [roundsData, matchesData, predictionsData, profilesData] = await Promise.all([
      Round.list('order'),
      Match.list('order'),
      Prediction.list(),
      PublicProfile.list()]
      );

      setRounds(roundsData);
      setMatches(matchesData);
      setPredictions(predictionsData);
      setPublicProfiles(profilesData);

      // Set first round with finished matches as default
      const roundsWithFinishedMatches = roundsData.filter((round) =>
      matchesData.some((match) =>
      match.round_id === round.id &&
      match.is_finished &&
      match.actual_score_a !== null &&
      match.actual_score_b !== null
      )
      );

      if (roundsWithFinishedMatches.length > 0) {
        setSelectedRound(roundsWithFinishedMatches[roundsWithFinishedMatches.length - 1].id);
      }

    } catch (error) {
      console.error("Error loading data:", error);
    }

    // Ensure minimum 2 seconds loading time for animation
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 2000 - elapsedTime);
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }

    setLoading(false);
  };

  // NEW: Load user's personal stats for the selected round - wrapped with useCallback
  const loadMyRoundStats = useCallback(async (roundId) => {
    if (!user || !roundId) return;

    setLoadingMyStats(true);
    try {
      // CHANGED: Use frontend implementation instead of backend function
      const result = await calculateScoreByRound({
        userId: user.id,
        roundId: roundId
      });

      if (result && result.success !== false) {
        setMyRoundStats(result);
      } else {
        setMyRoundStats(null);
      }
    } catch (error) {
      console.error("Error loading my round stats:", error);
      setMyRoundStats(null);
    }
    setLoadingMyStats(false);
  }, [user]);

  // UPDATED: Load round leaderboard using frontend implementation
  const loadRoundLeaderboard = useCallback(async (roundId) => {
    if (!user || !roundId) return;

    setLoadingLeaderboard(true);
    try {
      // CHANGED: Use frontend implementation instead of backend function
      const result = await getRoundLeaderboard({
        roundId: roundId,
        currentUserId: user.id
      });
      
      if (result && result.success !== false) {
        setRoundLeaderboard(result);
      } else {
        setRoundLeaderboard(null);
      }
    } catch (error) {
      console.error("Error loading round leaderboard:", error);
      setRoundLeaderboard(null);
    }
    setLoadingLeaderboard(false);
  }, [user]); // Fixed: removed unnecessary dependencies

  // Update myRoundStats and roundLeaderboard when selectedRound changes
  useEffect(() => {
    if (selectedRound && user) {
      loadMyRoundStats(selectedRound);
      loadRoundLeaderboard(selectedRound);
    }
  }, [selectedRound, user, loadMyRoundStats, loadRoundLeaderboard]);

  const getUserDisplayName = (userId) => {
    const profile = publicProfiles.find((p) => p.user_id === userId);
    return profile?.display_name || `שחקן ${userId.slice(0, 8)}`;
  };

  const getMatchPredictions = (matchId) => {
    // Apply same deduplication logic as other components
    const matchPredictions = predictions.filter((p) => p.match_id === matchId);

    const uniquePredictionsMap = {};
    matchPredictions.forEach((prediction) => {
      const key = `${prediction.user_id}_${prediction.match_id}`;
      if (!uniquePredictionsMap[key] ||
      new Date(prediction.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
        uniquePredictionsMap[key] = prediction;
      }
    });

    return Object.values(uniquePredictionsMap).
    sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0));
  };

  const nextMatch = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % finishedMatches.length);
  };

  const prevMatch = () => {
    setCurrentMatchIndex((prev) => (prev - 1 + finishedMatches.length) % finishedMatches.length);
  };

  const getOutcomeStatus = (prediction, match) => {
    if (!prediction || !match.is_finished) return null;

    const predictedA = prediction.predicted_score_a;
    const predictedB = prediction.predicted_score_b;
    const actualA = match.actual_score_a;
    const actualB = match.actual_score_b;

    const isExactScore = predictedA === actualA && predictedB === actualB;
    const predictedOutcome = predictedA > predictedB ? 'win' : predictedA < predictedB ? 'lose' : 'draw';
    const actualOutcome = actualA > actualB ? 'win' : actualA < actualB ? 'lose' : 'draw';
    const isCorrectOutcome = predictedOutcome === actualOutcome;

    if (isExactScore) {
      return { type: 'exact', icon: '🎯' };
    } else if (isCorrectOutcome) {
      return { type: 'correct', icon: '✅' };
    } else {
      return { type: 'wrong', icon: null };
    }
  };

  // Determine if the current user has an exact hit for the currently displayed match
  const isCurrentMatchExactHit = (() => {
    if (!user || finishedMatches.length === 0) return false;
    const match = finishedMatches[currentMatchIndex];
    if (!match) return false;
    
    const myMatchPredictions = predictions.filter(p => p.match_id === match.id && p.user_id === user.id);
    if (myMatchPredictions.length === 0) return false;
    
    // Sort to get latest in case of multiple records, though typically deduplicated
    const prediction = myMatchPredictions.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];
    
    return getOutcomeStatus(prediction, match)?.type === 'exact';
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817]"> {/* Dark background matching the app theme */}
        <div className="flex items-center justify-center min-h-screen">
          <LottieAnimation
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68656264510003eeef16bac3/40dfd5188_stadiofantachampions1.json"
            className="w-full max-w-md"
          />
        </div>
      </div>);
  }

  const availableRounds = rounds.filter((round) =>
  matches.some((match) =>
  match.round_id === round.id &&
  match.is_finished &&
  match.actual_score_a !== null &&
  match.actual_score_b !== null
  )
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="bg-slate-800 border-slate-600 hover:bg-slate-700">

            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-white">ניחושים ותוצאות</h1>
            <p className="text-slate-400">צפה בניחושים ובניקוד של כל המשתתפים</p>
          </div>
        </div>

        {availableRounds.length === 0 ?
        <div className="text-center py-12">
            <Eye className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400 text-lg">אין עדיין מחזורים עם תוצאות סופיות</p>
            <p className="text-slate-500 text-sm mt-2">
              תוצאות יופיעו כאן לאחר סיום משחקים וחישוב נקודות
            </p>
          </div> :

        <>
            {/* Round Selector */}
            <div className="mb-6 flex flex-col items-end">
              <h3 className="text-lg font-semibold text-white mb-3 text-right">בחר מחזור</h3>
              <div className="w-full max-w-xs" dir="rtl">
                <Select value={selectedRound} onValueChange={setSelectedRound}>
                  <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white text-right">
                    <SelectValue placeholder="בחר מחזור" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {availableRounds.map((round) => (
                      <SelectItem 
                        key={round.id} 
                        value={round.id}
                        className="focus:bg-slate-700 focus:text-white cursor-pointer justify-end"
                      >
                        {round.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Finished Matches / Predictions View */}
            {finishedMatches.length === 0 ?
              <div className="text-center py-8">
                <p className="text-slate-400">אין משחקים שהסתיימו במחזור זה</p>
              </div> :
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden mt-6 shadow-xl">
                {/* Header with View Mode Toggle */}
                <div className="px-4 py-5 border-b border-slate-700">
                  <div className="flex justify-center gap-2 mb-4">
                    <Button
                      onClick={() => setViewMode('all_predictions')}
                      size="sm"
                      variant={viewMode === 'all_predictions' ? 'default' : 'outline'}
                      className={viewMode === 'all_predictions' ?
                        "bg-blue-600 hover:bg-blue-700 text-white" :
                        "bg-slate-700 hover:bg-slate-600 text-slate-300"
                      }>
                      כל הניחושים
                    </Button>
                    <Button
                      onClick={() => setViewMode('my_predictions')}
                      size="sm"
                      variant={viewMode === 'my_predictions' ? 'default' : 'outline'}
                      className={viewMode === 'my_predictions' ?
                        "bg-green-600 hover:bg-green-700 text-white" :
                        "bg-slate-700 hover:bg-slate-600 text-slate-300"
                      }>
                      הניחושים שלי
                    </Button>
                    <Button
                      onClick={() => setViewMode('leaderboard')}
                      size="sm"
                      variant={viewMode === 'leaderboard' ? 'default' : 'outline'}
                      className={viewMode === 'leaderboard' ?
                        "bg-red-600 hover:bg-red-700 text-white" :
                        "bg-slate-700 hover:bg-slate-600 text-slate-300"
                      }>
                      דירוג המחזור
                    </Button>
                  </div>

                  {viewMode === 'all_predictions' &&
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextMatch}
                        disabled={finishedMatches.length <= 1}
                        className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-30">
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </Button>

                      <div className="text-center flex-1 px-4">
                        <h3 className="text-white font-semibold mb-2">
                          משחק {currentMatchIndex + 1} מתוך {finishedMatches.length}
                        </h3>
                        <div className="flex items-center justify-center gap-3">
                          <img
                            src={finishedMatches[currentMatchIndex]?.team_a_logo}
                            alt={finishedMatches[currentMatchIndex]?.team_a}
                            className="w-8 h-8 object-contain" />

                          <div className="bg-slate-700 px-3 py-1 rounded-lg">
                            <span className="text-white font-bold">
                              {finishedMatches[currentMatchIndex]?.actual_score_a} - {finishedMatches[currentMatchIndex]?.actual_score_b}
                            </span>
                          </div>
                          <img
                            src={finishedMatches[currentMatchIndex]?.team_b_logo}
                            alt={finishedMatches[currentMatchIndex]?.team_b}
                            className="w-8 h-8 object-contain" />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevMatch}
                        disabled={finishedMatches.length <= 1}
                        className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-30">
                        <ChevronRight className="w-6 h-6 text-white" />
                      </Button>
                    </div>
                  }

                  {viewMode === 'my_predictions' &&
                    <div className="text-center">
                      <h3 className="text-white font-semibold mb-2">
                        הניחושים שלי - {rounds.find((r) => r.id === selectedRound)?.name}
                      </h3>
                    </div>
                  }

                  {viewMode === 'leaderboard' &&
                    <div className="text-center">
                      <h3 className="text-white font-semibold mb-2">
                        {rounds.find((r) => r.id === selectedRound)?.name}
                      </h3>
                    </div>
                  }
                </div>

                {/* Content */}
                <div className="p-4">
                  {viewMode === 'all_predictions' &&
                    <PredictionsList
                      match={finishedMatches[currentMatchIndex]}
                      predictions={getMatchPredictions(finishedMatches[currentMatchIndex].id)}
                      getUserDisplayName={getUserDisplayName}
                      getOutcomeStatus={getOutcomeStatus} />
                  }

                  {viewMode === 'my_predictions' &&
                    <MyRoundPredictions
                      user={user}
                      roundStats={myRoundStats}
                      roundLeaderboard={roundLeaderboard}
                      loading={loadingMyStats}
                      loadingLeaderboard={loadingLeaderboard}
                      matches={finishedMatches}
                      getUserDisplayName={getUserDisplayName}
                      getOutcomeStatus={getOutcomeStatus} />
                  }

                  {viewMode === 'leaderboard' &&
                    <LeaderboardView
                      roundLeaderboard={roundLeaderboard}
                      loading={loadingLeaderboard}
                      user={user} />
                  }
                </div>

                {/* Confetti Animation for Exact Hit */}
                {isCurrentMatchExactHit && viewMode === 'all_predictions' && (
                  <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
                    <LottieAnimation
                      key={finishedMatches[currentMatchIndex]?.id}
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68656264510003eeef16bac3/c1df36a33_Blueconfetti.json"
                      loop={false}
                      autoplay={true}
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>
                )}
              </div>
            }
          </>
        }
      </div>
    </div>);

}

// NEW: Separate LeaderboardView component
function LeaderboardView({ roundLeaderboard, loading, user }) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        <p className="text-slate-400 mt-2">טוען נתונים...</p>
      </div>);

  }

  if (!roundLeaderboard || !roundLeaderboard.allParticipants || roundLeaderboard.allParticipants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">אין נתונים זמינים עבור מחזור זה</p>
      </div>);

  }

  return (
    <div className="space-y-3">
      {/* All Participants Display with Animated List - EXACT SAME AS BEFORE */}
      <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
      <h4 className="text-white font-semibold mb-2 text-center">דירוג המחזור</h4>
        <div className="max-h-60 overflow-y-auto"> {/* Original scrollable container */}
          <AnimatedList className="space-y-2">
            {roundLeaderboard.allParticipants.map((entry, index) => {
              // Original medal colors logic
              const getMedalColor = (rank) => {
                switch (rank) {
                  case 1:return 'bg-yellow-600 text-white'; // Gold
                  case 2:return 'bg-gray-400 text-white'; // Silver  
                  case 3:return 'bg-amber-600 text-white'; // Bronze
                  default:return 'bg-slate-600 text-white'; // White/Gray for others
                }
              };

              return (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between text-sm p-2 rounded-md ${
                  entry.isCurrentUser ? 'bg-blue-600/20 border border-blue-400/30' : ''}`
                  }>

                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getMedalColor(entry.rank)}`}>
                      {entry.rank}
                    </span>
                    <span className="text-white font-medium">{entry.displayName}</span>
                    {/* REMOVED: Badge with "אתה" text */}
                  </div>
                  <span className="text-green-400 font-bold">{entry.totalPoints.toFixed(2)}Pts</span>
                </div>);

            })}
          </AnimatedList>
        </div>
      </div>
    </div>
  );
}

// NEW: Updated MyRoundPredictions WITHOUT leaderboard section
function MyRoundPredictions({ user, roundStats, loading, loadingLeaderboard, roundLeaderboard, matches, getUserDisplayName, getOutcomeStatus }) {
  if (loading || loadingLeaderboard) {// Show loading if either is loading
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        <p className="text-slate-400 mt-2">טוען נתונים...</p>
      </div>);

  }

  // Determine if there's any data to display in this mode
  const hasMyStats = roundStats && roundStats.predictionDetails && roundStats.predictionDetails.length > 0;
  // Check if roundLeaderboard is an object, has success, and contains currentUser info
  const hasLeaderboard = roundLeaderboard && roundLeaderboard.success && roundLeaderboard.currentUser && roundLeaderboard.currentUser.rank && roundLeaderboard.totalParticipants;

  if (!hasMyStats) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">אין נתונים זמינים עבור מחזור זה</p>
      </div>);

  }

  return (
    <div className="space-y-3">
      {/* My Round Summary with Ranking */}
      {hasMyStats &&
      <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <h4 className="text-white font-semibold mb-2 text-center">סיכום ניחושים שלי</h4>

          {/* Points and Ranking Display */}
          <div className="text-center mb-4">
            <div className="bg-slate-600/50 rounded-lg p-3 inline-block">
              <div className="text-green-400 font-bold text-xl mb-1">
                סה"כ נקודות: {roundStats.summary?.totalRoundPoints?.toFixed(2) || '0.00'}
              </div>

              {/* NEW: Display ranking if available */}
              {hasLeaderboard &&
            <div className="text-blue-300 font-semibold text-lg">
                  מקום {roundLeaderboard.currentUser.rank} מתוך {roundLeaderboard.totalParticipants}
                </div>
            }
            </div>
            
            {/* Round Accuracy Stats */}
            <div className="mt-2">
              <ScoreAccuracyVisuals 
                earnedPoints={roundStats.summary?.totalRoundPoints || 0}
                maxPoints={matches.reduce((acc, match) => acc + calculateMatchMaxPotentialPoints(match), 0)}
                className="bg-slate-800/80 border-slate-600"
              />
            </div>
          </div>
        </div>
      }

      {/* Individual Match Predictions (My Predictions) */}
      {hasMyStats &&
      <>
          <h4 className="text-white font-semibold mb-2 text-center">הניחושים שלי למשחקי המחזור</h4>
          <div className="space-y-3">
            {roundStats.predictionDetails.map((detail, index) => {
            const match = matches.find((m) => m.id === detail.matchId);
            if (!match) return null;

            return (
              <motion.div
                key={detail.matchId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-700/50 rounded-lg p-3">

                  <div className="flex items-center justify-between">
                    {/* Team logos and match info */}
                    <div className="flex items-center gap-3 flex-1">
                      <img src={match.team_a_logo} alt={match.team_a} className="w-6 h-6 object-contain" />
                      <div className="text-center">
                        <div className="text-slate-300 text-sm font-medium">
                          {detail.prediction}
                        </div>
                        <div className="text-blue-400 text-xs">
                          ניחוש
                        </div>
                      </div>
                      <span className="text-slate-300">vs</span>
                      <div className="text-center">
                        <div className="text-white text-sm font-bold">
                          {detail.actual !== 'Not finished' ? detail.actual : '--'}
                        </div>
                        <div className="text-emerald-400 text-xs">
                          תוצאה
                        </div>
                      </div>
                      <img src={match.team_b_logo} alt={match.team_b} className="w-6 h-6 object-contain" />
                    </div>

                    {/* Points and status */}
                    <div className="text-left flex items-center gap-2">
                      <div className="bg-slate-600 px-2 py-1 rounded text-xs">
                        <span className="text-green-300 font-bold">
                          {detail.points.toFixed(2)} Pts
                        </span>
                      </div>

                      {/* Status indicators */}
                      {detail.actual !== 'Not finished' &&
                    <div className="flex gap-1">
                          {detail.exactScore && <span className="text-lg">🎯</span>}
                          {!detail.exactScore && detail.correctOutcome && <span className="text-lg">✅</span>}
                          {!detail.exactScore && !detail.correctOutcome && <span className="text-lg text-red-400">❌</span>}
                        </div>
                    }
                    </div>
                  </div>
                </motion.div>);

          })}
          </div>
        </>
      }
    </div>);

}

// רכיב נפרד לרשימת הניחושים עם פירוט הניקוד מתוקן
function PredictionsList({ match, predictions, getUserDisplayName, getOutcomeStatus }) {
  const [expandedPrediction, setExpandedPrediction] = useState(null);

  if (predictions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">אין ניחושים למשחק זה</p>
      </div>);

  }

  return (
    <div className="space-y-3">
      {predictions.map((prediction, index) => {
        const outcomeStatus = getOutcomeStatus(prediction, match);
        const isExpanded = expandedPrediction === prediction.id;

        return (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-700/50 rounded-lg overflow-hidden">

            {/* פרטי הניחוש הבסיסיים */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandedPrediction(isExpanded ? null : prediction.id)}
                    className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-blue-700 transition-colors">

                    {index + 1}
                  </button>

                  {/* קונטיינר שם המשתמש והניחוש - עיצוב חדש */}
                  <div className="flex-1 flex flex-col items-center">
                    <button
                      onClick={() => setExpandedPrediction(isExpanded ? null : prediction.id)}
                      className="text-white font-medium text-sm hover:text-blue-300 transition-colors text-center mb-0.5">

                      {getUserDisplayName(prediction.user_id)}
                    </button>
                    <div className="text-slate-400 text-base flex items-center gap-1">
                      <img src={match.team_a_logo} alt={match.team_a} className="w-4 h-4 object-contain" />
                      <span className="text-slate-50 pr-2 pl-2 text-sm font-medium hover:text-blue-300 transition-colors">{prediction.predicted_score_a} - {prediction.predicted_score_b}</span>
                      <img src={match.team_b_logo} alt={match.team_b} className="w-4 h-4 object-contain" />
                    </div>
                  </div>
                </div>

                <div className="text-left flex items-center gap-2">
                  <Badge className="bg-green-600/20 text-green-300 text-xs">
                    {(prediction.points_earned || 0).toFixed(2)} PTS
                  </Badge>
                  {/* אייקון פגיעה רק עבור תוצאה מדויקת */}
                  {outcomeStatus?.type === 'exact' &&
                  <span className="text-lg">{outcomeStatus.icon}</span>
                  }
                  {/* X אדום עבור ניחוש שגיו */}
                  {outcomeStatus?.type === 'wrong' &&
                  <span className="text-lg text-red-400">❌</span>
                  }
                  {/* V ירוק עבור כיוון נכון */}
                  {outcomeStatus?.type === 'correct' &&
                  <span className="text-lg">{outcomeStatus.icon}</span>
                  }
                </div>
              </div>
            </div>

            {/* פירוט הניקוד - נפתח בלחיצה */}
            <AnimatePresence>
              {isExpanded &&
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-slate-600 bg-slate-800/50">

                  <div className="p-3 space-y-2">
                    <h4 className="text-white text-sm font-semibold mb-2">פירוט ניקוד</h4>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>תוצאה מדויקת -</span>
                        <span>+{(prediction.exact_score_points_earned || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>כיוון נכון -</span>
                        <span>+{(prediction.correct_outcome_points_earned || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>BTTS -</span>
                        <span>+{(prediction.both_teams_scored_points_earned || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>טווח שערים -</span>
                        <span>+{(prediction.goals_range_points_earned || 0).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-slate-600 mt-2 pt-2 flex justify-between text-white font-semibold">
                      <span>סה"כ</span>
                      <span className="text-blue-400 text-sm font-bold">{(prediction.points_earned || 0).toFixed(2)}</span>
                      </div>

                      {/* תצוגת דיוק וניקוד מקסימלי */}
                      <ScoreAccuracyVisuals 
                        earnedPoints={prediction.points_earned || 0} 
                        maxPoints={calculateMatchMaxPotentialPoints(match)} 
                      />
                      </div>
                      </div>
                      </motion.div>
                      }
            </AnimatePresence>
          </motion.div>);

      })}
    </div>);

}