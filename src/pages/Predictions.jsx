import React, { useState, useEffect, useCallback } from "react";
import { Round } from "@/api/entities";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { User } from "@/api/entities";
import { ArrowLeft, Check, Calendar, Lock, HelpCircle, Eye } from "lucide-react"; // ADDED Eye icon
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import ScoreInput from "../components/predictions/ScoreInput";
import PredictionSummary from "../components/predictions/PredictionSummary";
import { GlowButton } from "../components/ui/GlowButton";
import { useNavigate } from 'react-router-dom';
import MatchScoringRulesModal from "../components/MatchScoringRulesModal";
import MatchPredictionsModal from "../components/MatchPredictionsModal"; // ADDED MatchPredictionsModal import
import CrowdWisdomStats from "../components/predictions/CrowdWisdomStats"; // ADDED CrowdWisdomStats import
import { RevealText } from "@/components/magicui/reveal-text";
import TeamFlag from "@/components/TeamFlag";
import GroupStandingsModal from "@/components/GroupStandingsModal";

export default function Predictions() {
  const [currentRound, setCurrentRound] = useState(null);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  // NEW: Add state for scoring rules modal
  const [showScoringRulesModal, setShowScoringRulesModal] = useState(false);
  const [selectedMatchForRules, setSelectedMatchForRules] = useState(null);
  // NEW: Add state for predictions modal
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMatchForPredictions, setSelectedMatchForPredictions] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const roundId = urlParams.get('round_id');

  const navigate = useNavigate();

  useEffect(() => {
    if (roundId) {
      const hasAnimated = localStorage.getItem(`animated_round_${roundId}`);
      if (!hasAnimated) {
        setShouldAnimate(true);
        localStorage.setItem(`animated_round_${roundId}`, 'true');
      } else {
        setShouldAnimate(false);
      }
    }
  }, [roundId]);

  // Update current time every second for countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to check if a match is locked (15 minutes before start)
  const isMatchLocked = (matchDate) => {
    const now = new Date();
    const matchTime = new Date(matchDate);
    const lockTime = new Date(matchTime.getTime() - 15 * 60 * 1000);
    return now >= lockTime;
  };

  // MODIFIED: Enhanced to return breakdown of time units while preserving all existing logic
  // Also added textColor and bgColor for status display
  const getTimeUntilLock = (matchDate) => {
    const now = currentTime;
    const matchTime = new Date(matchDate);
    const lockTime = new Date(matchTime.getTime() - 15 * 60 * 1000);

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let status;
    let text;
    let textColor;
    let bgColor;

    if (now >= matchTime) {
      status = 'finished';
      text = 'המשחק נעול / הסתיים';
      textColor = 'text-blue-400';
      bgColor = 'bg-blue-900/50';
    } else if (now >= lockTime) {
      status = 'locked';
      text = 'נעול להימור';
      textColor = 'text-red-400';
      bgColor = 'bg-red-900/50';
    } else {
      const timeLeft = lockTime.getTime() - now.getTime();
      const duration = moment.duration(timeLeft);

      days = Math.floor(duration.asDays());
      hours = duration.hours();
      minutes = duration.minutes();
      seconds = duration.seconds();

      if (days >= 1 || hours >= 1) {
        text = `עוד ${days > 0 ? `${days} ימים, ` : ''}${hours} שעות ו-${minutes} דקות`;
        status = 'active'; // This is 'open' in the outline's context
        textColor = 'text-green-400';
        bgColor = 'bg-green-900/50';
      } else if (minutes > 0) {
        text = `ע עוד ${minutes} דקות ו-${seconds} שניות`;
        status = 'warning';
        textColor = 'text-orange-400';
        bgColor = 'bg-orange-900/50';
      } else {
        text = `עוד ${seconds} שניות!`;
        status = 'urgent';
        textColor = 'text-red-400';
        bgColor = 'bg-red-900/50';
      }
    }

    return {
      status,
      text,
      days,
      hours,
      minutes,
      seconds,
      textColor,
      bgColor
    };
  };

  const loadRoundData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const currentUser = await User.me();
      setUser(currentUser);

      const [rounds, roundMatches] = await Promise.all([
      Round.filter({ id: roundId }),
      Match.filter({ round_id: roundId })]
      );

      if (rounds.length === 0) {
        setError('מחזור לא נמצא');
        setLoading(false);
        return;
      }

      setCurrentRound(rounds[0]);
      setMatches(roundMatches.sort((a, b) => new Date(a.match_date) - new Date(b.match_date)));

      const userPredictions = await Prediction.filter({
        user_id: currentUser.id
      });

      const predictionsMap = {};
      let hasSubmittedPredictions = false;

      const latestPredictions = {};
      userPredictions.forEach((prediction) => {
        const key = `${prediction.user_id}_${prediction.match_id}`;
        if (!latestPredictions[key] ||
        new Date(prediction.created_date) > new Date(latestPredictions[key].created_date)) {
          latestPredictions[key] = prediction;
        }
      });

      Object.values(latestPredictions).forEach((prediction) => {
        const matchExists = roundMatches.some((match) => match.id === prediction.match_id);
        if (matchExists) {
          predictionsMap[prediction.match_id] = {
            predicted_score_a: prediction.predicted_score_a,
            predicted_score_b: prediction.predicted_score_b,
            prediction_id: prediction.id
          };
          hasSubmittedPredictions = true;
        }
      });

      setPredictions(predictionsMap);
      setSubmitted(hasSubmittedPredictions);
      setShowSummary(false);

    } catch (error) {
      console.error("Error loading round data:", error);
      setError('שגיאה בטעינת נתוני המחזור');
    }

    setLoading(false);
  }, [roundId]);

  useEffect(() => {
    if (roundId) {
      loadRoundData();
    }
  }, [roundId, loadRoundData]);

  const handlePredictionChange = (matchId, field, value) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    if (isMatchLocked(match.match_date)) return;

    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }));
  };

  const areAllPredictionsComplete = () => {
    const availableMatches = matches.filter((match) => !isMatchLocked(match.match_date));

    return availableMatches.every((match) => {
      const prediction = predictions[match.id];
      return prediction &&
      prediction.predicted_score_a !== undefined &&
      prediction.predicted_score_a !== null &&
      prediction.predicted_score_b !== undefined &&
      prediction.predicted_score_b !== null;
    });
  };

  const handleSubmit = () => {
    // The button will be disabled if predictions are not complete, so no alert needed here.
    setShowSummary(true);
  };

  const handleConfirmPredictions = async () => {
    console.log("🚀 Starting handleConfirmPredictions");
    setSaving(true);
    setError('');

    try {
      const predictionPromises = matches.map(async (match) => {
        if (isMatchLocked(match.match_date)) {
          return;
        }

        const prediction = predictions[match.id];
        if (!prediction ||
        prediction.predicted_score_a === undefined ||
        prediction.predicted_score_a === null ||
        prediction.predicted_score_b === undefined ||
        prediction.predicted_score_b === null) {
          return;
        }

        const predictionData = {
          match_id: match.id,
          user_id: user.id,
          predicted_score_a: prediction.predicted_score_a,
          predicted_score_b: prediction.predicted_score_b
        };

        if (prediction.prediction_id) {
          return await Prediction.update(prediction.prediction_id, predictionData);
        } else {
          return await Prediction.create(predictionData);
        }
      }).filter(Boolean);

      await Promise.all(predictionPromises);

      console.log("✅ Predictions saved successfully, starting animation");

      // Reset saving state first
      setSaving(false);

      // Close the summary modal
      setShowSummary(false);

      // Show success animation
      console.log("🎬 Setting showSubmissionSuccess to true");
      setShowSubmissionSuccess(true);

      // Navigate after animation
      setTimeout(() => {
        console.log("🔄 Navigating to Dashboard after animation");
        navigate(createPageUrl("Dashboard")); // Use navigate instead of window.location.href
      }, 2000); // Increased to 2 seconds to make sure we see it

    } catch (error) {
      console.error("❌ Error saving predictions:", error);
      setError('שגיאה בשמירת הניחושים. אנא נסה שוב.');
      setSaving(false);
    }
  };

  const handleCancelPredictions = () => {
    setShowSummary(false);
  };

  // NEW: Handle scoring rules modal open
  const handleShowScoringRules = (match) => {
    setSelectedMatchForRules(match);
    setShowScoringRulesModal(true);
  };

  // NEW: Handle scoring rules modal close
  const handleCloseScoringRules = () => {
    setShowScoringRulesModal(false);
    setSelectedMatchForRules(null);
  };

  // NEW: Handle predictions modal open
  const handleShowPredictions = (match) => {
    setSelectedMatchForPredictions(match);
    setShowPredictionsModal(true);
  };

  // NEW: Handle predictions modal close
  const handleClosePredictions = () => {
    setShowPredictionsModal(false);
    setSelectedMatchForPredictions(null);
  };



  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>);

  }

  if (!currentRound) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">מחזור לא נמצא</p>
          </div>
        </div>
      </div>);

  }

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
            <h1 className="text-3xl font-bold text-white mb-2">{currentRound?.name}</h1>
            <p className="text-slate-400">נחש את תוצאות המשחקים</p>
          </div>
        </div>

        {error &&
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        }

        {submitted &&
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-900/50 border border-green-700 rounded-lg p-6 mb-6 text-center">

            <div className="flex items-center justify-center gap-3 mb-3">
              <Check className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-bold text-green-300">הניחושים נשלחו בהצלחה</h3>
            </div>
            <p className="text-green-200 mb-4">
              הניחושים שלך נשמרו במערכת ויחושבו לאחר סיום המשחק/ים
            </p>
            <p className="text-green-100 text-sm">
              ניתן לעדכן ניחושים עד 15 דקות לפני תחילת המשחק
            </p>
          </motion.div>
        }


        {/* Matches List - Carousel on Mobile */}
        <div className="flex overflow-x-auto gap-8 snap-x snap-mandatory py-4 px-6 -mx-6 scrollbar-hide md:grid md:grid-cols-2 md:gap-6 md:space-y-0 md:mx-0 md:px-0">
          {matches.map((match, index) => {
            const isLocked = isMatchLocked(match.match_date);
            const timeInfo = getTimeUntilLock(match.match_date);
            const prediction = predictions[match.id] || {};

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="snap-center flex-shrink-0 w-[85vw] max-w-md md:w-auto h-full">

                <Card
                  className={`relative border transition-all duration-300 h-full flex flex-col ${
                  isLocked ?
                  'border-slate-700/50 opacity-70' :
                  'border-neutral-800'}`}
                  style={isLocked ? { background: 'rgba(15,23,42,0.3)' } : {
                    background: 'linear-gradient(110deg, rgba(0,1,3,0.7) 0%, rgba(0,1,3,0.7) 45%, rgba(30,38,49,0.9) 55%, rgba(0,1,3,0.7) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shine 8s linear infinite',
                  }}
                >
                  {/* Buttons */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowScoringRules(match);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 hover:text-blue-400 transition-colors z-10"
                    title="כללי ניקוד">
                    <HelpCircle className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowPredictions(match);
                    }}
                    className="absolute top-2 left-2 w-8 h-8 bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 hover:text-green-400 transition-colors z-10"
                    title="צפה בניחושים">
                    <Eye className="w-4 h-4" />
                  </Button>

                  <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between">
                    {/* Header: Countdown / Status */}
                    <div className="flex justify-center mb-3">
                      {timeInfo.status === 'locked' || timeInfo.status === 'finished' ?
                      <div className="bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700/50">
                          <Lock className="w-3.5 h-3.5" />
                          <span className="text-sm font-medium">{timeInfo.text}</span>
                        </div> :

                      <div className="bg-[#1a362d] text-[#4ade80] rounded-lg px-4 py-1.5 flex gap-4 text-center shadow-lg border border-[#244a3d]" dir="rtl">
                          <div className="flex flex-col items-center">
                            <span className="text-base font-bold leading-none mb-0.5">{timeInfo.seconds}</span>
                            <span className="text-[10px] font-medium">שניות</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-base font-bold leading-none mb-0.5">{timeInfo.minutes}</span>
                            <span className="text-[10px] font-medium">דקות</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-base font-bold leading-none mb-0.5">{timeInfo.hours}</span>
                            <span className="text-[10px] font-medium">שעות</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-base font-bold leading-none mb-0.5">{timeInfo.days}</span>
                            <span className="text-[10px] font-medium">ימים</span>
                          </div>
                        </div>
                      }
                    </div>

                    {/* Group badge */}
                    {match.league && (
                      <div className="flex justify-center mb-4">
                        <button
                          onClick={() => setSelectedGroup(match.league)}
                          className="text-sm font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-5 py-1 rounded-full hover:bg-yellow-400/20 hover:border-yellow-400/60 transition-colors cursor-pointer"
                        >
                          {match.league}
                        </button>
                      </div>
                    )}

                    {/* Separator below group badge */}
                    <div className="border-t border-slate-700/50 mb-4" />

                    {/* Teams & Score Input */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      {/* Team A */}
                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-12 h-12" animate={shouldAnimate} />
                        <RevealText delay={0.5} animate={shouldAnimate} className="text-white font-semibold text-xs leading-tight text-center w-full break-words flex items-start justify-center">
                          {match.team_a}
                        </RevealText>
                        <span className="text-slate-400 text-[10px] leading-none">(Home)</span>
                      </div>

                      {/* Score Input */}
                      <div className="flex flex-col items-center justify-center px-1">
                        <div className="flex items-center gap-2">
                           {!isLocked ?
                          <>
                                <ScoreInput
                              value={prediction.predicted_score_a}
                              onChange={(value) => handlePredictionChange(match.id, 'predicted_score_a', value)}
                              hasError={!areAllPredictionsComplete() && (prediction.predicted_score_a === undefined || prediction.predicted_score_a === null)} />

                                <span className="text-slate-400 font-bold text-lg">-</span>
                                <ScoreInput
                              value={prediction.predicted_score_b}
                              onChange={(value) => handlePredictionChange(match.id, 'predicted_score_b', value)}
                              hasError={!areAllPredictionsComplete() && (prediction.predicted_score_b === undefined || prediction.predicted_score_b === null)} />
                              </> :
                          <>
                                <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                                  <span className="text-slate-400 text-lg font-bold">
                                    {prediction.predicted_score_a !== undefined && prediction.predicted_score_a !== null ? prediction.predicted_score_a : '?'}
                                  </span>
                                </div>
                                <span className="text-slate-400 font-bold text-lg">-</span>
                                <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                                  <span className="text-slate-400 text-lg font-bold">
                                    {prediction.predicted_score_b !== undefined && prediction.predicted_score_b !== null ? prediction.predicted_score_b : '?'}
                                  </span>
                                </div>
                              </>
                          }
                        </div>
                      </div>

                      {/* Team B */}
                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-12 h-12" animate={shouldAnimate} />
                        <RevealText delay={0.5} animate={shouldAnimate} className="text-white font-semibold text-xs leading-tight text-center w-full break-words flex items-start justify-center">
                          {match.team_b}
                        </RevealText>
                        <span className="text-slate-400 text-[10px] leading-none">(Away)</span>
                      </div>
                    </div>

                    {/* Previous Match Score */}
                    {match.previous_match_score_a !== undefined && match.previous_match_score_a !== null &&
                    match.previous_match_score_b !== undefined && match.previous_match_score_b !== null &&
                    <div className="flex justify-center mb-4">
                        <div className="bg-slate-800/80 text-slate-300 px-3 py-1 text-[10px] font-medium rounded-full border border-slate-700/50">
                          משחק ראשון: {match.previous_match_score_b} - {match.previous_match_score_a}
                        </div>
                      </div>
                    }

                    {/* Footer: Date & Location */}
                    <div className="mt-auto pt-4 border-t border-slate-700/50 space-y-1.5">
                      <div className="flex items-center justify-center gap-1.5 text-sm text-white">
                        <span className="text-base">🗓️</span>
                        <span>{moment(match.match_date).format('DD/MM/YYYY')} · {moment(match.match_date).format('HH:mm')}</span>
                      </div>
                      {match.location && (
                        <div className="flex items-center justify-center text-xs text-white">
                          <span>📍 {match.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Crowd Wisdom Stats */}
                    {isLocked &&
                    <div className="mt-3">
                        <CrowdWisdomStats
                        matchId={match.id}
                        teamA={match.team_a}
                        teamB={match.team_b} />
                      </div>
                    }
                  </CardContent>
                </Card>
              </motion.div>);

          })}
        </div>

        {/* Submit Button with Animation - החלפת הכפתור */}
        {matches.some((match) => !isMatchLocked(match.match_date)) &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-6 mt-2 flex justify-center">

            <GlowButton
            onClick={handleSubmit}
            disabled={saving || !areAllPredictionsComplete()}
            className="px-12 py-4 text-lg font-semibold">

              {saving ?
            <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>שולח...</span>
                </div> :

            <span className="text-emerald-400">{submitted ? 'עדכן ניחושים' : 'שלח ניחושים'}</span>
            }
            </GlowButton>
          </motion.div>
        }

        {/* Summary Modal */}
        <AnimatePresence>
          {showSummary &&
          <PredictionSummary
            currentRound={currentRound}
            predictions={predictions}
            matches={matches}
            onConfirm={handleConfirmPredictions}
            onCancel={handleCancelPredictions}
            saving={saving} />

          }
        </AnimatePresence>

        {/* NEW: Scoring Rules Modal */}
        <MatchScoringRulesModal
          isOpen={showScoringRulesModal}
          onClose={handleCloseScoringRules}
          match={selectedMatchForRules} />


        {/* NEW: Predictions Modal */}
        <MatchPredictionsModal
          isOpen={showPredictionsModal}
          onClose={handleClosePredictions}
          match={selectedMatchForPredictions} />

        {selectedGroup && (
          <GroupStandingsModal
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)} />
        )}

        {/* --- SUCCESS ANIMATION OVERLAY --- */}
        <AnimatePresence>
          {showSubmissionSuccess &&
          <>
              <motion.div
              className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>

                <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                animate={{
                  scale: [0.5, 1.2, 1],
                  opacity: 1,
                  rotate: 0
                }}
                exit={{ scale: 0.8, opacity: 0, rotate: 15 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 10,
                  duration: 0.6
                }}
                className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-800/95 to-green-900/95 rounded-3xl shadow-2xl border-2 border-green-600 text-white backdrop-blur-sm max-w-xs mx-auto">

                  <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>

                    <Check className="w-20 h-20 text-green-300 mb-4" />
                  </motion.div>

                  <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="2xl font-bold text-green-100 mb-2 text-center">

                    נשלח בהצלחה
                  </motion.h2>

                  <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-green-200 text-center text-sm">

                    הניחושים שלך נשמרו במערכת
                  </motion.p>
                </motion.div>
              </motion.div>
            </>
          }
        </AnimatePresence>

      </div>
    </div>);

}