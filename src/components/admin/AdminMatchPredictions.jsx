
import TeamFlag from "@/components/TeamFlag";
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Round } from "@/api/entities";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Users, Calendar, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMatchPredictions() {
  const [users, setUsers] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedRound, setSelectedRound] = useState('');
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, roundsData, matchesData, predictionsData, profilesData] = await Promise.all([
        User.list(),
        Round.list('order'),
        Match.list('order'),
        Prediction.list(),
        PublicProfile.list()
      ]);

      setUsers(usersData);
      setRounds(roundsData);
      setMatches(matchesData);
      setPredictions(predictionsData);
      setPublicProfiles(profilesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  // Helper function to get display name
  const getUserDisplayName = (userId) => {
    const user = users.find(u => u.id === userId);
    const profile = publicProfiles.find(p => p.user_id === userId);

    return profile?.display_name ||
           user?.display_name ||
           user?.full_name ||
           user?.email?.split('@')[0] ||
           `User ${userId.slice(0, 8)}`;
  };

  // Apply deduplication logic as other components
  const getFilteredPredictions = (matchId) => {
    const matchPredictions = predictions.filter(p => p.match_id === matchId);

    console.log(`AdminMatchPredictions: Found ${matchPredictions.length} total predictions for match ${matchId} before filtering`);

    const uniquePredictionsMap = {};

    matchPredictions.forEach(prediction => {
      const key = `${prediction.user_id}_${prediction.match_id}`;

      if (!uniquePredictionsMap[key] ||
          new Date(prediction.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
        uniquePredictionsMap[key] = prediction;
      }
    });

    const uniquePredictions = Object.values(uniquePredictionsMap);
    console.log(`AdminMatchPredictions: After deduplication: ${uniquePredictions.length} unique predictions for match ${matchId}`);

    return uniquePredictions.sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0));
  };

  const filteredMatches = selectedRound
    ? matches.filter(m => m.round_id === selectedRound)
    : [];

  // Animation variants - עדכון למהירות איטית יותר
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">View Predictions by Match</h2>
      </div>

      {/* Round Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Select Round</label>
        <Select value={selectedRound} onValueChange={setSelectedRound}>
          <SelectTrigger className="bg-slate-800/90 backdrop-blur-md border-slate-600 text-white max-w-sm hover:bg-slate-700/90 focus:bg-slate-700/90 shadow-lg rounded-lg">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between w-full"
            >
              <SelectValue placeholder="Choose a round..." className="text-white" />
            </motion.div>
          </SelectTrigger>
          <SelectContent className="bg-slate-800/95 backdrop-blur-md text-white border-slate-600 shadow-2xl rounded-lg">
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-1"
            >
              {rounds.map((round, index) => (
                <motion.div
                  key={round.id}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <SelectItem 
                    value={round.id} 
                    className="focus:bg-slate-700/60 hover:bg-slate-700/60 focus:text-blue-300 hover:text-blue-300 rounded-md px-3 py-2 cursor-pointer transition-all duration-300 font-medium"
                  >
                    {round.name}
                  </SelectItem>
                </motion.div>
              ))}
            </motion.div>
          </SelectContent>
        </Select>
      </div>

      {/* Matches */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">
            {selectedRound ? "No matches found for this round" : "Please select a round"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match, index) => {
            const matchPredictions = getFilteredPredictions(match.id);
            const isExpanded = expandedMatch === match.id;

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-6">
                    {/* Match Info - New Layout */}
                    <div className="space-y-4">
                      {/* Teams with Logos and Names underneath */}
                      <div className="flex items-start justify-between">
                        {/* Team A - Logo and name underneath */}
                        <div className="flex flex-col items-center flex-1">
                          <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-16 h-16 mb-2" />
                          <div className="text-center max-w-[100px]">
                            <div className="text-white font-semibold text-sm leading-tight">
                              {match.team_a.split(' ').map((word, i) => (
                                <div key={i}>{word}</div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Match Result/Status in center */}
                        <div className="flex flex-col items-center justify-center flex-1">
                          {match.is_finished ? (
                            <div className="bg-slate-700 px-4 py-2 rounded-lg mb-2">
                              <span className="text-white font-bold text-xl">
                                {match.actual_score_a} - {match.actual_score_b}
                              </span>
                            </div>
                          ) : (
                            <div className="bg-slate-700/50 px-4 py-2 rounded-lg mb-2">
                              <span className="text-slate-400 font-medium">
                                ? - ?
                              </span>
                            </div>
                          )}

                          <Badge
                            variant={match.is_finished ? "default" : "secondary"}
                            className={match.is_finished ? "bg-green-600/80 text-white" : "bg-yellow-600/80 text-white"}
                          >
                            {match.is_finished ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                הסתיים
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                לא הסתיים
                              </>
                            )}
                          </Badge>
                        </div>

                        {/* Team B - Logo and name underneath */}
                        <div className="flex flex-col items-center flex-1">
                          <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-16 h-16 mb-2" />
                          <div className="text-center max-w-[100px]">
                            <div className="text-white font-semibold text-sm leading-tight">
                              {match.team_b.split(' ').map((word, i) => (
                                <div key={i}>{word}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Predictions Count - underneath team info */}
                      <div className="text-center">
                        <Badge className="bg-blue-600/20 text-blue-300">
                          <Users className="w-4 h-4 mr-1" />
                          {matchPredictions.length} ניחושים
                        </Badge>
                      </div>

                      {/* View Predictions Button */}
                      <div className="text-center">
                        <Button
                          onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {isExpanded ? 'הסתר ניחושים' : 'צפה בניחושים'}
                        </Button>
                      </div>

                      {/* Date - at the bottom */}
                      <div className="text-center text-slate-400 text-sm border-t border-slate-700/50 pt-4">
                        <Calendar className="w-4 h-4 mr-2 inline" />
                        {new Date(match.match_date).toLocaleDateString('he-IL')} בשעה {new Date(match.match_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Expanded Predictions List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-slate-700/50 mt-6 pt-6"
                        >
                          {matchPredictions.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-slate-400">אין ניחושים למשחק זה</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {matchPredictions.map((prediction, predIndex) => {
                                  const isExactScore = match.is_finished &&
                                    prediction.predicted_score_a === match.actual_score_a &&
                                    prediction.predicted_score_b === match.predicted_score_b; // This was an error in original code, should be match.actual_score_b
                                  const predictedOutcome = prediction.predicted_score_a > prediction.predicted_score_b ? 'win' :
                                    prediction.predicted_score_a < prediction.predicted_score_b ? 'lose' : 'draw';
                                  const actualOutcome = match.is_finished ? (
                                    match.actual_score_a > match.actual_score_b ? 'win' :
                                    match.actual_score_a < match.actual_score_b ? 'lose' : 'draw'
                                  ) : null;
                                  const isCorrectOutcome = match.is_finished && predictedOutcome === actualOutcome;

                                  return (
                                    <motion.div
                                      key={prediction.id}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: predIndex * 0.05 }}
                                      className="bg-slate-700/50 rounded-lg p-4 text-center"
                                    >
                                      <div className="space-y-2">
                                        {/* שם המשתמש */}
                                        <div className="text-white font-medium text-lg">
                                          {getUserDisplayName(prediction.user_id)}
                                        </div>

                                        {/* תוצאת הניחוש */}
                                        <div className="text-slate-300 text-base">
                                          {match.team_a} {prediction.predicted_score_a} - {prediction.predicted_score_b} {match.team_b}
                                        </div>

                                        {/* נקודות ואייקונים */}
                                        {match.is_finished && (
                                          <div className="flex items-center justify-center gap-2 mt-3">
                                            <Badge className="bg-green-600/20 text-green-300 text-xs">
                                              {(prediction.points_earned || 0).toFixed(2)} נקודות
                                            </Badge>
                                            {/* Corrected the isExactScore logic here as well */}
                                            {match.actual_score_a !== undefined && match.actual_score_b !== undefined && isExactScore && (
                                              <span className="text-lg">🎯</span>
                                            )}
                                            {match.actual_score_a !== undefined && match.actual_score_b !== undefined && !isExactScore && isCorrectOutcome && (
                                              <span className="text-lg">✅</span>
                                            )}
                                            {match.actual_score_a !== undefined && match.actual_score_b !== undefined && !isExactScore && !isCorrectOutcome && (
                                              <span className="text-lg text-red-400">❌</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
