
import TeamFlag from "@/components/TeamFlag";
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Round } from "@/api/entities";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Eye, Award, Trophy, RotateCcw, Edit, Save, X, Trash2 } from "lucide-react";
import { LoaderBar } from "../ui/LoaderBar";
import { motion } from "framer-motion";

export default function AdminPredictions() {
  const [users, setUsers] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRound, setSelectedRound] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingMatch, setEditingMatch] = useState(null);
  const [editScores, setEditScores] = useState({ team_a: '', team_b: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, roundsData, matchesData, predictionsData, profilesData] = await Promise.all([
        User.list('-total_points'),
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

  // **CRITICAL CHANGE: Apply identical deduplication logic as AdminScoring**
  const getFilteredPredictions = () => {
    if (!selectedUser || !selectedRound) return [];
    
    const roundMatches = matches.filter(m => m.round_id === selectedRound);
    const userPredictions = predictions.filter(p => p.user_id === selectedUser);
    
    console.log(`AdminPredictions: Found ${userPredictions.length} total predictions for user ${selectedUser} before filtering`);
    
    // **Apply IDENTICAL deduplication logic as AdminScoring**
    const uniquePredictionsMap = {};
    
    userPredictions.forEach(prediction => {
      const key = `${prediction.user_id}_${prediction.match_id}`;
      
      // Only keep the LATEST prediction for each user-match combination (by created_date)
      if (!uniquePredictionsMap[key] || 
          new Date(prediction.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
        uniquePredictionsMap[key] = prediction;
        console.log(`AdminPredictions: Selected prediction ${prediction.id} (created: ${prediction.created_date}) for match ${prediction.match_id}`);
      } else {
        console.log(`AdminPredictions: Skipped older prediction ${prediction.id} (created: ${prediction.created_date}) for match ${prediction.match_id}`);
      }
    });
    
    const uniquePredictions = Object.values(uniquePredictionsMap);
    console.log(`AdminPredictions: After deduplication: ${uniquePredictions.length} unique predictions for user ${selectedUser}`);
    
    // Map matches with their unique predictions
    return roundMatches.map(match => {
      const prediction = uniquePredictions.find(p => p.match_id === match.id);
      return { match, prediction };
    });
  };

  const handleResetUserRound = async () => {
    if (!selectedUser || !selectedRound) return;
    
    const selectedRoundData = rounds.find(r => r.id === selectedRound);
    
    if (!window.confirm(`האם אתה בטוח שברצונך לאפס את כל הניחושים של ${getUserDisplayName(selectedUser)} במחזור ${selectedRoundData?.name}?`)) {
      return;
    }

    try {
      const roundMatches = matches.filter(m => m.round_id === selectedRound);
      const userRoundPredictions = predictions.filter(p => 
        p.user_id === selectedUser && 
        roundMatches.some(m => m.id === p.match_id)
      );

      // Delete all predictions for this user in this round
      for (const prediction of userRoundPredictions) {
        await Prediction.delete(prediction.id);
      }

      setMessage({ type: 'success', text: `ניחושי ${getUserDisplayName(selectedUser)} במחזור ${selectedRoundData?.name} אופסו בהצלחה` });
      loadData();
    } catch (error) {
      console.error("Error resetting predictions:", error);
      setMessage({ type: 'error', text: 'שגיאה באיפוס הניחושים' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDeleteUserPredictions = async (userId, roundId) => {
    const selectedRoundData = rounds.find(r => r.id === roundId);
    
    const confirmMessage = `האם אתה בטוח שברצונך למחוק את כל הניחושים של ${getUserDisplayName(userId)} במחזור ${selectedRoundData?.name}?\n\nפעולה זו בלתי הפיכה!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const roundMatches = matches.filter(m => m.round_id === roundId);
      const userRoundPredictions = predictions.filter(p => 
        p.user_id === userId && 
        roundMatches.some(m => m.id === p.match_id)
      );

      // Delete all predictions for this user in this round
      for (const prediction of userRoundPredictions) {
        await Prediction.delete(prediction.id);
      }

      setMessage({ 
        type: 'success', 
        text: `נמחקו ${userRoundPredictions.length} ניחושים של ${getUserDisplayName(userId)} במחזור ${selectedRoundData?.name}` 
      });
      loadData();
    } catch (error) {
      console.error("Error deleting predictions:", error);
      setMessage({ type: 'error', text: 'שגיאה במחיקת הניחושים' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match.id);
    setEditScores({ 
      team_a: match.actual_score_a !== null ? match.actual_score_a.toString() : '', 
      team_b: match.actual_score_b !== null ? match.actual_score_b.toString() : '' 
    });
  };

  const handleSaveMatch = async () => {
    if (!editingMatch) return;

    try {
      const scoreA = editScores.team_a === '' ? null : parseInt(editScores.team_a);
      const scoreB = editScores.team_b === '' ? null : parseInt(editScores.team_b);
      
      await Match.update(editingMatch, {
        actual_score_a: scoreA,
        actual_score_b: scoreB,
        is_finished: scoreA !== null && scoreB !== null
      });

      setEditingMatch(null);
      setMessage({ type: 'success', text: 'תוצאת המשחק עודכנה בהצלחה' });
      loadData();
    } catch (error) {
      console.error("Error updating match:", error);
      setMessage({ type: 'error', text: 'שגיאה בעדכון תוצאת המשחק' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getPointsDisplay = (prediction, match) => {
    if (!prediction || !match.is_finished) return null;
    
    const points = (prediction.points_earned || 0).toFixed(2);
    const isCorrect = parseFloat(points) > 0;
    
    console.log(`AdminPredictions: Display points for prediction ${prediction.id} on match ${match.team_a} vs ${match.team_b}: ${points} points (predicted: ${prediction.predicted_score_a}-${prediction.predicted_score_b}, actual: ${match.actual_score_a}-${match.actual_score_b})`);
    
    return (
      <Badge className={isCorrect ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-400'}>
        <Award className="w-3 h-3 mr-1" />
        {points} נקודות
      </Badge>
    );
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
      return <Badge className="bg-green-600 text-white">🎯 תוצאה מדויקת</Badge>;
    } else if (isCorrectOutcome) {
      return <Badge className="bg-yellow-600 text-white">✅ תוצאה נכונה</Badge>;
    } else {
      return <Badge className="bg-red-600 text-white">❌ תוצאה שגויה</Badge>;
    }
  };

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

  const selectedRoundData = rounds.find(r => r.id === selectedRound);
  const filteredPredictions = getFilteredPredictions();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderBar text="LOADING" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">צפייה בניחושי משתמשים (ניחושים ייחודיים בלבד - זהים לחישוב הניקוד)</h2>
      </div>

      {message.text && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={
          message.type === 'success' ? 'bg-green-900/50 border-green-700' : ''
        }>
          <AlertDescription className={message.type === 'success' ? 'text-green-300' : 'text-red-300'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">בחר משתמש</label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="bg-slate-800/90 backdrop-blur-md border-slate-600 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 shadow-lg rounded-lg">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-between w-full"
              >
                <SelectValue placeholder="בחר משתמש..." className="text-white" />
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
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SelectItem 
                      value={user.id} 
                      className="focus:bg-slate-700/60 hover:bg-slate-700/60 focus:text-blue-300 hover:text-blue-300 rounded-md px-3 py-2 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{getUserDisplayName(user.id)}</span>
                        <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-2 shadow-sm">
                          <Trophy className="w-3 h-3 mr-1" />
                          {(user.total_points || 0).toFixed(2)}
                        </Badge>
                      </div>
                    </SelectItem>
                  </motion.div>
                ))}
              </motion.div>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">בחר מחזור</label>
          <Select value={selectedRound} onValueChange={setSelectedRound}>
            <SelectTrigger className="bg-slate-800/90 backdrop-blur-md border-slate-600 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 shadow-lg rounded-lg">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-between w-full"
              >
                <SelectValue placeholder="בחר מחזור..." className="text-white" />
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
      </div>

      {selectedUser && selectedRound && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                ניחושי {getUserDisplayName(selectedUser)} - {selectedRoundData?.name}
                <Badge className="bg-blue-600/20 text-blue-300 text-sm">
                  ניחושים ייחודיים בלבד (זהים לחישוב הניקוד) ✅
                </Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={handleResetUserRound}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  אפס מחזור
                </Button>
                <Button
                  onClick={() => handleDeleteUserPredictions(selectedUser, selectedRound)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  מחק ניחושים
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPredictions.length === 0 ? (
              <p className="text-slate-400 text-center py-8">המשתמש לא הגיש ניחושים למחזור זה</p>
            ) : (
              <div className="space-y-4">
                {filteredPredictions.map(({ match, prediction }) => (
                  <div key={match.id} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-6 h-6 " />
                          <span className="font-medium text-white text-sm">{match.team_a}</span>
                        </div>
                        <div className="bg-slate-600 px-2 py-1 rounded-md">
                          <span className="text-white font-bold text-sm">
                            {prediction ? `${prediction.predicted_score_a} - ${prediction.predicted_score_b}` : 'לא נוחש'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-sm">{match.team_b}</span>
                          <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-6 h-6 " />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getPointsDisplay(prediction, match)}
                        {getOutcomeStatus(prediction, match)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        {editingMatch === match.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={editScores.team_a}
                              onChange={(e) => setEditScores({...editScores, team_a: e.target.value})}
                              className="w-16 h-8 bg-slate-600 border-slate-500 text-white text-center"
                              placeholder="0"
                            />
                            <span className="text-slate-400">-</span>
                            <Input
                              type="number"
                              value={editScores.team_b}
                              onChange={(e) => setEditScores({...editScores, team_b: e.target.value})}
                              className="w-16 h-8 bg-slate-600 border-slate-500 text-white text-center"
                              placeholder="0"
                            />
                            <Button size="sm" onClick={handleSaveMatch} className="bg-green-600 hover:bg-green-700 h-8">
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingMatch(null)} className="h-8">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">
                              תוצאה בפועל: {match.actual_score_a !== null && match.actual_score_b !== null ? `${match.actual_score_a} - ${match.actual_score_b}` : 'לא הוגדרה'}
                            </span>
                            <Button size="sm" variant="outline" onClick={() => handleEditMatch(match)} className="h-8">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <span className="text-slate-400">
                        {match.match_date && new Date(match.match_date).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                    
                    {/* Add prediction ID for debugging/verification */}
                    {prediction && (
                      <div className="mt-2 text-xs text-slate-500">
                        ID ניחוש: {prediction.id} | נוצר: {new Date(prediction.created_date).toLocaleString('he-IL')} ⭐ נבחר לחישוב
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
