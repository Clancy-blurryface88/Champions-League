import TeamFlag from "@/components/TeamFlag";
import LoadingScreen from "@/components/LoadingScreen";
import CircleLoader from "@/components/CircleLoader";
import React, { useState, useEffect, useCallback, useRef } from "react";
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


const OUTCOME_COLORS = {
  exact:   { hex: '#34d399', text: 'text-emerald-400', border: 'border-emerald-500/30', divider: 'bg-emerald-400/40' },
  correct: { hex: '#fbbf24', text: 'text-amber-400',   border: 'border-amber-500/30',   divider: 'bg-amber-400/40'   },
  wrong:   { hex: '#f87171', text: 'text-red-400',     border: 'border-red-500/25',     divider: 'bg-red-400/40'     },
  default: { hex: '#34d399', text: 'text-emerald-400', border: 'border-emerald-500/30', divider: 'bg-emerald-400/40' },
};

function AnimatedDonut({ percentage, size = 64, outcomeType }) {
  const [animPct, setAnimPct] = useState(0);
  const radius = 24;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setAnimPct(0);
    const timer = setTimeout(() => setAnimPct(percentage), 80);
    return () => clearTimeout(timer);
  }, [percentage]);

  const offset = circumference - (animPct / 100) * circumference;
  const color = (OUTCOME_COLORS[outcomeType] || OUTCOME_COLORS.default).hex;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#334155" strokeWidth="6" />
        <circle
          cx="32" cy="32" r={radius} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.23,1,0.32,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>{percentage}%</span>
      </div>
    </div>
  );
}

const BREAKDOWN_ROWS = [
  { key: 'exact_score_points_earned',         label: 'תוצאה מדויקת', icon: '🎯' },
  { key: 'correct_outcome_points_earned',      label: 'כיוון נכון',    icon: '✅' },
  { key: 'both_teams_scored_points_earned',    label: 'BTTS',          icon: '⚽' },
  { key: 'goals_range_points_earned',          label: 'טווח שערים',   icon: '📊' },
];

function ScoreBreakdownAnimated({ prediction, match, outcomeType }) {
  const [visibleRows, setVisibleRows] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [showDonut, setShowDonut] = useState(false);
  const rowDelay = 700;

  useEffect(() => {
    setVisibleRows(0); setShowTotal(false); setShowDonut(false);
    BREAKDOWN_ROWS.forEach((_, i) => {
      setTimeout(() => setVisibleRows(v => Math.max(v, i + 1)), i * rowDelay);
    });
    setTimeout(() => setShowTotal(true), BREAKDOWN_ROWS.length * rowDelay + 400);
    setTimeout(() => setShowDonut(true), BREAKDOWN_ROWS.length * rowDelay + 900);
  }, [prediction.id]);

  const maxPoints = calculateMatchMaxPotentialPoints(match);
  const percentage = maxPoints > 0
    ? Math.min(100, Math.round((prediction.points_earned || 0) / maxPoints * 100))
    : 0;

  const c = OUTCOME_COLORS[outcomeType] || OUTCOME_COLORS.default;

  return (
    <div className="p-4 space-y-1">
      {BREAKDOWN_ROWS.map((row, i) => {
        const pts = prediction[row.key] || 0;
        return (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, x: -12 }}
            animate={visibleRows > i ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex justify-between items-center py-1.5 px-2 rounded-lg"
          >
            <span className="text-white/70 text-xs">{row.label}</span>
            <span className={`text-xs font-bold tabular-nums ${pts > 0 ? c.text : 'text-slate-600'}`}>
              {pts > 0 ? `+${pts.toFixed(2)}` : '+0.00'}
            </span>
          </motion.div>
        );
      })}

      <AnimatePresence>
        {showTotal && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="mt-1"
          >
            <div className={`h-px mx-2 mb-2 ${c.divider}`} />
            <div className="flex justify-between items-center px-2">
              <span className="text-white text-xs font-semibold">סה"כ</span>
              <span className={`text-sm font-bold tabular-nums ${c.text}`}>
                {(prediction.points_earned || 0).toFixed(2)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDonut && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center gap-4 pt-3 px-2"
          >
            <AnimatedDonut percentage={percentage} size={72} outcomeType={outcomeType} />
            <motion.div
              className="flex flex-col items-end flex-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="text-white/50 text-xs mb-1">ניקוד שנצבר</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold tabular-nums ${c.text}`}>
                  {(prediction.points_earned || 0).toFixed(2)}
                </span>
                <span className="text-white/30 text-sm font-semibold">/ {maxPoints.toFixed(2)}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ITEM_H = 44;

function IosRoundPicker({ rounds, value, onChange }) {
  const ref = useRef(null);
  const isScrolling = useRef(false);
  const scrollTimer = useRef(null);

  // Scroll to selected on mount / value change
  useEffect(() => {
    if (!ref.current || !value) return;
    const idx = rounds.findIndex(r => r.id === value);
    if (idx === -1) return;
    ref.current.scrollTop = idx * ITEM_H;
  }, [value, rounds]);

  const commitScroll = () => {
    if (!ref.current) return;
    const idx = Math.max(0, Math.min(rounds.length - 1, Math.round(ref.current.scrollTop / ITEM_H)));
    ref.current.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
    if (rounds[idx] && rounds[idx].id !== value) onChange(rounds[idx].id);
  };

  const handleScroll = () => {
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(commitScroll, 120);
  };

  return (
    <div className="relative" style={{ height: ITEM_H * 3, width: 160 }}>
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: ITEM_H, background: 'linear-gradient(to bottom, rgba(8,15,35,0.95), transparent)' }} />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: ITEM_H, background: 'linear-gradient(to top, rgba(8,15,35,0.95), transparent)' }} />
      {/* Center selector highlight — soft glow, no border */}
      <div className="absolute inset-x-0 z-10 pointer-events-none"
        style={{ top: ITEM_H, height: ITEM_H, background: 'radial-gradient(ellipse at center, rgba(245,197,24,0.18) 0%, transparent 75%)' }} />

      {/* Scroll list */}
      <div
        ref={ref}
        onScroll={handleScroll}
        className="overflow-y-scroll scrollbar-hide h-full"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* top spacer */}
        <div style={{ height: ITEM_H }} />
        {rounds.map((round, idx) => {
          const isSelected = round.id === value;
          return (
            <div
              key={round.id}
              style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
              className={`flex items-center justify-center cursor-pointer transition-all duration-200 text-sm font-semibold ${
                isSelected ? 'text-amber-400 scale-105' : 'text-white/35'
              }`}
              onClick={() => {
                onChange(round.id);
                ref.current?.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
              }}
            >
              {round.name}
            </div>
          );
        })}
        {/* bottom spacer */}
        <div style={{ height: ITEM_H }} />
      </div>
    </div>
  );
}

export default function PredictionsResults() {
  const [user, setUser] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [selectedRound, setSelectedRound] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [revealComplete, setRevealComplete] = useState(false);
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

  // Reset reveal state when switching matches or view mode
  useEffect(() => {
    setRevealComplete(false);
  }, [currentMatchIndex, viewMode]);

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

  if (loading) return <LoadingScreen />;

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
      <div className="max-w-4xl mx-auto px-4 py-2">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-2">
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
            <div
              className="mb-6 flex items-center justify-between px-4 py-3 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              }}
              dir="rtl"
            >
              {/* Label — right side in RTL */}
              <span className="text-xs uppercase tracking-[0.16em] text-white/25 font-semibold">בחר מחזור</span>

              {/* iOS picker — left side */}
              <IosRoundPicker
                rounds={availableRounds}
                value={selectedRound}
                onChange={setSelectedRound}
              />
            </div>

            {/* Finished Matches / Predictions View */}
            {finishedMatches.length === 0 ?
              <div className="text-center py-8">
                <p className="text-slate-400">אין משחקים שהסתיימו במחזור זה</p>
              </div> :
              <div
                className="rounded-2xl overflow-hidden mt-6"
                style={{
                  background: 'rgba(8,15,35,0.72)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 0 1px rgba(245,197,24,0.06), 0 24px 48px rgba(0,0,0,0.5)',
                }}
              >
                {/* Header with View Mode Toggle */}
                <div className="px-4 py-5">
                  {/* Glass tab bar */}
                  <div
                    className="relative flex p-1 mb-4 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {[
                      { key: 'all_predictions', label: 'כל הניחושים'  },
                      { key: 'my_predictions',  label: 'הניחושים שלי' },
                      { key: 'leaderboard',     label: 'דירוג המחזור' },
                    ].map((tab) => {
                      const active = viewMode === tab.key;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setViewMode(tab.key)}
                          className="relative flex-1 flex items-center justify-center py-2.5 px-1 rounded-xl transition-colors z-10"
                          style={{ color: active ? '#000' : 'rgba(255,255,255,0.38)' }}
                        >
                          {active && (
                            <motion.div
                              layoutId="tab-pill"
                              className="absolute inset-0 rounded-xl"
                              style={{
                                background: 'linear-gradient(135deg, #f5c518 0%, #fde68a 60%, #fff 100%)',
                                boxShadow: '0 2px 12px rgba(245,197,24,0.35)',
                              }}
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                            />
                          )}
                          <span className="relative z-10 text-[11px] font-bold tracking-wide leading-tight text-center whitespace-nowrap">
                            {tab.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {viewMode === 'all_predictions' &&
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextMatch}
                        disabled={finishedMatches.length <= 1}
                        className="w-10 h-10 rounded-full bg-slate-500 hover:bg-slate-400 disabled:opacity-30">
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </Button>

                      <div className="text-center flex-1 px-4">
                        <h3 className="text-white font-semibold mb-2">
                          משחק {currentMatchIndex + 1} מתוך {finishedMatches.length}
                        </h3>
                        <div className="flex items-center justify-center gap-3">
                          <TeamFlag logo={finishedMatches[currentMatchIndex]?.team_a_logo} name={finishedMatches[currentMatchIndex]?.team_a} className="w-8 h-8 " />

                          <div className="bg-slate-700 px-3 py-1 rounded-lg">
                            <span className="text-white font-bold">
                              {finishedMatches[currentMatchIndex]?.actual_score_a} - {finishedMatches[currentMatchIndex]?.actual_score_b}
                            </span>
                          </div>
                          <TeamFlag logo={finishedMatches[currentMatchIndex]?.team_b_logo} name={finishedMatches[currentMatchIndex]?.team_b} className="w-8 h-8 " />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevMatch}
                        disabled={finishedMatches.length <= 1}
                        className="w-10 h-10 rounded-full bg-slate-500 hover:bg-slate-400 disabled:opacity-30">
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

                {/* Gold gradient divider */}
                <div className="h-px mx-0 bg-gradient-to-r from-transparent via-amber-400/35 to-transparent" />

                {/* Content */}
                <div className="p-4">
                  {viewMode === 'all_predictions' &&
                    <PredictionsList
                      match={finishedMatches[currentMatchIndex]}
                      predictions={getMatchPredictions(finishedMatches[currentMatchIndex].id)}
                      getUserDisplayName={getUserDisplayName}
                      getOutcomeStatus={getOutcomeStatus}
                      onAllRevealed={() => setRevealComplete(true)} />
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
                {isCurrentMatchExactHit && viewMode === 'all_predictions' && revealComplete && (
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

function PodiumStand({ entry, position, isCurrentUser }) {
  const configs = {
    1: { height: 'h-24', bg: 'bg-amber-500/15', border: 'border-amber-400/40', medal: '🥇', label: 'text-amber-400', pts: 'text-amber-300' },
    2: { height: 'h-16', bg: 'bg-slate-400/10',  border: 'border-slate-400/30', medal: '🥈', label: 'text-slate-300', pts: 'text-slate-300' },
    3: { height: 'h-12', bg: 'bg-amber-700/10',  border: 'border-amber-700/30', medal: '🥉', label: 'text-amber-600', pts: 'text-amber-600' },
  };
  const c = configs[position];
  if (!entry) return <div className="flex-1" />;

  return (
    <motion.div
      className="flex-1 flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position === 1 ? 0.4 : position === 2 ? 0.15 : 0.25, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <span className="text-[11px] font-semibold text-white/80 text-center leading-tight max-w-[72px] truncate">
        {entry.displayName}
      </span>
      <span className={`text-xs font-bold tabular-nums ${c.pts}`}>
        {entry.totalPoints.toFixed(2)}
      </span>
      <div className={`w-full ${c.height} rounded-t-xl border ${c.bg} ${c.border} flex items-center justify-center ${isCurrentUser ? 'ring-2 ring-blue-400/50' : ''}`}>
        <span className="text-2xl">{c.medal}</span>
      </div>
    </motion.div>
  );
}

function LeaderboardView({ roundLeaderboard, loading, user }) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <CircleLoader size={60} />
      </div>
    );
  }

  if (!roundLeaderboard || !roundLeaderboard.allParticipants || roundLeaderboard.allParticipants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">אין נתונים זמינים עבור מחזור זה</p>
      </div>
    );
  }

  const participants = roundLeaderboard.allParticipants;
  const top3 = [1, 2, 3].map(r => participants.find(e => e.rank === r));
  const rest = participants.filter(e => e.rank > 3);

  return (
    <div className="space-y-4">
      {/* Podium */}
      <div className="pt-2 pb-1">
        <div className="flex items-end justify-center gap-2 px-4">
          {/* Order: 2nd (left) · 1st (center) · 3rd (right) */}
          <PodiumStand entry={top3[1]} position={2} isCurrentUser={top3[1]?.isCurrentUser} />
          <PodiumStand entry={top3[0]} position={1} isCurrentUser={top3[0]?.isCurrentUser} />
          <PodiumStand entry={top3[2]} position={3} isCurrentUser={top3[2]?.isCurrentUser} />
        </div>
        {/* Podium base */}
        <div className="h-2 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full mx-4" />
      </div>

      {/* Rest of the list */}
      {rest.length > 0 && (
        <div className="space-y-1.5">
          <AnimatedList className="space-y-1.5">
            {rest.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between text-sm px-3 py-2 rounded-xl ${
                  entry.isCurrentUser
                    ? 'bg-blue-600/20 border border-blue-400/30'
                    : 'bg-slate-700/40 border border-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white/70">
                    {entry.rank}
                  </span>
                  <span className="text-white font-medium">{entry.displayName}</span>
                </div>
                <span className="text-green-400 font-bold tabular-nums">{entry.totalPoints.toFixed(2)}</span>
              </div>
            ))}
          </AnimatedList>
        </div>
      )}
    </div>
  );
}

// NEW: Updated MyRoundPredictions WITHOUT leaderboard section
function MyRoundPredictions({ user, roundStats, loading, loadingLeaderboard, roundLeaderboard, matches, getUserDisplayName, getOutcomeStatus }) {
  if (loading || loadingLeaderboard) {
    return (
      <div className="flex justify-center py-8">
        <CircleLoader size={60} />
      </div>
    );
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
      {hasMyStats && (() => {
        const earned  = roundStats.summary?.totalRoundPoints || 0;
        const maxPts  = matches.reduce((acc, m) => acc + calculateMatchMaxPotentialPoints(m), 0);
        const pct     = maxPts > 0 ? Math.round((earned / maxPts) * 100) : 0;
        const pctColor = pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400';

        return (
          <div
            className="rounded-2xl p-5 mb-4 flex flex-col items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-xs uppercase tracking-[0.18em] text-white/60 font-semibold">סיכום ניחושים שלי</span>

            {/* Big score */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-5xl font-black tabular-nums leading-none text-white">
                {earned.toFixed(2)}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-white/65 text-sm">מתוך {maxPts.toFixed(2)} נקודות</span>
                <span className={`text-sm font-bold tabular-nums ${pctColor}`}>({pct}%)</span>
              </div>
            </div>

            {/* Rank */}
            {hasLeaderboard && (
              <div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
              >
                <span className="text-blue-300 text-xs font-semibold">מקום</span>
                <span className="text-white font-bold text-sm">{roundLeaderboard.currentUser.rank}</span>
                <span className="text-blue-300/50 text-xs">מתוך {roundLeaderboard.totalParticipants}</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Individual Match Predictions (My Predictions) */}
      {hasMyStats &&
      <>
          <h4 className="text-white font-semibold mb-3 text-center">הניחושים שלי למשחקי המחזור</h4>
          <div className="space-y-3">
            {roundStats.predictionDetails.map((detail, index) => {
              const match = matches.find((m) => m.id === detail.matchId);
              if (!match) return null;

              const isFinished = detail.actual !== 'Not finished';
              const verdictBorder =
                !isFinished              ? 'border-white/10' :
                detail.exactScore        ? 'border-emerald-500/40' :
                detail.correctOutcome    ? 'border-amber-500/35' :
                                           'border-red-500/30';
              const verdictGlow =
                !isFinished              ? '' :
                detail.exactScore        ? 'shadow-[0_0_16px_rgba(16,185,129,0.15)]' :
                detail.correctOutcome    ? 'shadow-[0_0_16px_rgba(245,158,11,0.12)]' :
                                           'shadow-[0_0_16px_rgba(239,68,68,0.10)]';
              const statusIcon =
                !isFinished           ? null :
                detail.exactScore     ? '🎯' :
                detail.correctOutcome ? '✅' :
                                        '❌';

              return (
                <motion.div
                  key={detail.matchId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  className={`rounded-xl overflow-hidden border ${verdictBorder} ${verdictGlow}`}
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  {/* Teams row */}
                  <div className="flex items-center px-3 pt-3 pb-1">
                    {/* Teams centered */}
                    <div className="flex-1 flex items-center justify-center gap-2">
                      <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-5 h-5" />
                      <span className="text-white/70 text-xs font-medium">{match.team_a}</span>
                      <span className="text-amber-400/50 text-[10px] font-bold tracking-widest">VS</span>
                      <span className="text-white/70 text-xs font-medium">{match.team_b}</span>
                      <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-5 h-5" />
                    </div>
                    {/* Status icon — right */}
                    <span className="text-base w-6 text-right flex-shrink-0">
                      {statusIcon || ''}
                    </span>
                  </div>

                  {/* Split card: prediction vs actual */}
                  <div className="flex mx-3 mb-3 mt-1 rounded-lg overflow-hidden border border-white/8">
                    {/* My prediction */}
                    <div className="flex-1 flex flex-col items-center py-2.5 px-2 bg-blue-900/20">
                      <span className="text-[9px] text-blue-400 uppercase tracking-widest font-semibold mb-1">הניחוש שלי</span>
                      <span className="text-white font-bold text-lg tabular-nums leading-none">{detail.prediction}</span>
                    </div>
                    {/* Divider */}
                    <div className="w-px bg-white/8 self-stretch" />
                    {/* Actual result */}
                    <div className={`flex-1 flex flex-col items-center py-2.5 px-2 ${
                      !isFinished ? 'bg-slate-800/30' :
                      detail.exactScore     ? 'bg-emerald-900/25' :
                      detail.correctOutcome ? 'bg-amber-900/20' :
                                              'bg-red-900/15'
                    }`}>
                      <span className={`text-[9px] uppercase tracking-widest font-semibold mb-1 ${
                        !isFinished ? 'text-slate-500' :
                        detail.exactScore     ? 'text-emerald-400' :
                        detail.correctOutcome ? 'text-amber-400' :
                                                'text-red-400'
                      }`}>תוצאה</span>
                      <span className="text-white font-bold text-lg tabular-nums leading-none">
                        {isFinished ? detail.actual : '–'}
                      </span>
                    </div>
                  </div>

                  {/* Points bar */}
                  {isFinished && (() => {
                    const matchMax = calculateMatchMaxPotentialPoints(match);
                    const matchPct = matchMax > 0 ? Math.round((detail.points / matchMax) * 100) : 0;
                    const colorClass =
                      detail.exactScore     ? 'bg-emerald-500/15 text-emerald-300' :
                      detail.correctOutcome ? 'bg-amber-500/15 text-amber-300' :
                                              'bg-red-500/15 text-red-300';
                    const pctC =
                      detail.exactScore     ? 'text-emerald-400' :
                      detail.correctOutcome ? 'text-amber-400' :
                                              'text-red-400';
                    return (
                      <div className="px-3 pb-2.5 flex justify-center items-center gap-2">
                        <span className={`text-xs font-bold tabular-nums px-2.5 py-1 rounded-full ${colorClass}`}>
                          {detail.points.toFixed(2)} pts
                        </span>
                        <span className="text-white/55 text-xs">מתוך {matchMax.toFixed(2)}</span>
                        <span className={`text-xs font-bold tabular-nums ${pctC}`}>({matchPct}%)</span>
                      </div>
                    );
                  })()}
                </motion.div>
              );
          })}
          </div>
        </>
      }
    </div>);

}

// רכיב נפרד לרשימת הניחושים עם פירוט הניקוד מתוקן
function PredictionsList({ match, predictions, getUserDisplayName, getOutcomeStatus, onAllRevealed }) {
  const [expandedPrediction, setExpandedPrediction] = useState(null);

  const REVEAL_DELAY = 0.75; // שניות בין חשיפת כל שחקן

  // מיין מהגבוה לנמוך — הגבוה בראש, הנמוך בתחתית ומופיע ראשון
  const sortedPredictions = [...predictions].sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0));

  const bottomRef = useRef(null);

  useEffect(() => {
    if (sortedPredictions.length === 0) { onAllRevealed?.(); return; }
    // גלול לתחתית כך שהמשתמש רואה את החשיפה הראשונה (הנמוך) ומעלה למנצח
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
    const lastRevealTime = (sortedPredictions.length - 1) * REVEAL_DELAY + 0.5;
    const timer = setTimeout(() => onAllRevealed?.(), lastRevealTime * 1000);
    return () => clearTimeout(timer);
  }, [match?.id]);

  if (predictions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">אין ניחושים למשחק זה</p>
      </div>);
  }

  return (
    <div className="space-y-3">
      {sortedPredictions.map((prediction, index) => {
        const outcomeStatus = getOutcomeStatus(prediction, match);
        const isExpanded = expandedPrediction === prediction.id;
        // מקום N (תחתית) מופיע ראשון (delay=0), מקום 1 (ראש) מופיע אחרון
        const revealDelay = (sortedPredictions.length - 1 - index) * REVEAL_DELAY;

        const verdictBg =
          outcomeStatus?.type === 'exact'   ? 'bg-emerald-900/20 border border-emerald-500/30' :
          outcomeStatus?.type === 'correct' ? 'bg-amber-900/15 border border-amber-500/25' :
          outcomeStatus?.type === 'wrong'   ? 'bg-red-900/15 border border-red-500/20' :
          'bg-slate-700/50 border border-white/5';

        const rankBg =
          outcomeStatus?.type === 'exact'   ? 'bg-emerald-500' :
          outcomeStatus?.type === 'correct' ? 'bg-amber-500' :
          outcomeStatus?.type === 'wrong'   ? 'bg-red-600' :
          'bg-blue-600';

        return (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: revealDelay, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className={`rounded-lg overflow-hidden ${verdictBg}`}>

            {/* פרטי הניחוש הבסיסיים */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandedPrediction(isExpanded ? null : prediction.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-colors hover:opacity-80 ${rankBg}`}>
                    {index + 1}
                  </button>

                  <div className="flex-1 flex flex-col items-center">
                    <button
                      onClick={() => setExpandedPrediction(isExpanded ? null : prediction.id)}
                      className="text-white font-medium text-sm hover:text-blue-300 transition-colors text-center mb-0.5">
                      {getUserDisplayName(prediction.user_id)}
                    </button>
                    <div className="text-slate-400 text-base flex items-center gap-1">
                      <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-4 h-4" />
                      <span className="text-slate-50 pr-2 pl-2 text-sm font-medium">{prediction.predicted_score_a} - {prediction.predicted_score_b}</span>
                      <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="text-left flex items-center gap-2">
                  <Badge className={`text-xs ${
                    outcomeStatus?.type === 'exact'   ? 'bg-emerald-500/20 text-emerald-300' :
                    outcomeStatus?.type === 'correct' ? 'bg-amber-500/20 text-amber-300' :
                    outcomeStatus?.type === 'wrong'   ? 'bg-red-500/20 text-red-300' :
                    'bg-green-600/20 text-green-300'
                  }`}>
                    {(prediction.points_earned || 0).toFixed(2)} PTS
                  </Badge>
                  {outcomeStatus?.type === 'exact'   && <span className="text-lg">🎯</span>}
                  {outcomeStatus?.type === 'correct' && <span className="text-lg">✅</span>}
                  {outcomeStatus?.type === 'wrong'   && <span className="text-lg">❌</span>}
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
                className={`border-t bg-black/20 ${
                  outcomeStatus?.type === 'exact'   ? 'border-emerald-400/35' :
                  outcomeStatus?.type === 'correct' ? 'border-amber-400/35' :
                  outcomeStatus?.type === 'wrong'   ? 'border-red-400/30' :
                  'border-white/8'
                }`}>
                  <ScoreBreakdownAnimated prediction={prediction} match={match} outcomeType={outcomeStatus?.type} />
              </motion.div>}
            </AnimatePresence>
          </motion.div>);

      })}
      <div ref={bottomRef} />
    </div>);

}