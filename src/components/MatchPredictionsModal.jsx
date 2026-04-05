import TeamFlag from "@/components/TeamFlag";
import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Prediction } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function MatchPredictionsModal({ isOpen, onClose, match }) {
  const [predictions, setPredictions] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPredictions = useCallback(async () => {
    if (!match) return;
    
    setLoading(true);
    try {
      const [predictionsData, profilesData] = await Promise.all([
        Prediction.filter({ match_id: match.id }),
        PublicProfile.list()
      ]);

      setPredictions(predictionsData);
      setPublicProfiles(profilesData);
    } catch (error) {
      console.error("Error loading predictions:", error);
    }
    setLoading(false);
  }, [match]);

  useEffect(() => {
    if (isOpen && match) {
      loadPredictions();
    }
  }, [isOpen, match, loadPredictions]);

  const getUserDisplayName = (userId) => {
    const profile = publicProfiles.find(p => p.user_id === userId);
    return profile?.display_name || `משתמש ${userId.slice(0, 8)}`;
  };

  // Deduplication logic - only latest prediction per user
  const getUniquePredictions = () => {
    const uniquePredictionsMap = {};
    
    predictions.forEach(prediction => {
      const key = `${prediction.user_id}_${prediction.match_id}`;
      if (!uniquePredictionsMap[key] || 
          new Date(prediction.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
        uniquePredictionsMap[key] = prediction;
      }
    });

    return Object.values(uniquePredictionsMap);
  };

  if (!match) return null;

  // Check if match is locked or finished
  const now = new Date();
  const matchTime = new Date(match.match_date);
  const lockTime = new Date(matchTime.getTime() - 30 * 60 * 1000);
  const isLocked = now >= lockTime || match.is_finished;

  const uniquePredictions = getUniquePredictions();

  // Group predictions by score
  const groupedPredictions = uniquePredictions.reduce((acc, prediction) => {
    const scoreKey = `${prediction.predicted_score_a} - ${prediction.predicted_score_b}`;
    if (!acc[scoreKey]) {
      acc[scoreKey] = [];
    }
    acc[scoreKey].push(prediction);
    return acc;
  }, {});

  // Sort groups by score
  const sortedScoreKeys = Object.keys(groupedPredictions).sort((a, b) => {
    const [aHome, aAway] = a.split(' - ').map(Number);
    const [bHome, bAway] = b.split(' - ').map(Number);
    if (aHome !== bHome) return bHome - aHome;
    return bAway - aAway;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white p-6 border border-slate-700 max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-center text-xl font-bold text-white flex items-center justify-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            ניחושים למשחק
          </DialogTitle>
        </DialogHeader>

        {/* Match info */}
        <div className="flex items-start justify-center w-full p-4 bg-slate-700/50 rounded-lg mb-4 flex-shrink-0">
          <div className="flex items-start gap-3 flex-1 justify-end">
            <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-10 h-10 " />
            <div className="text-slate-50 text-sm font-medium text-left leading-tight pt-2.5">
              {match.team_a.split(' ').map((word, i) => (
                <div key={i}>{word}</div>
              ))}
            </div>
          </div>
          
          <div className="text-white font-bold text-lg mx-6 pt-1.5">VS</div>
          
          <div className="flex items-start gap-3 flex-1 justify-start">
            <div className="text-slate-50 text-sm font-medium text-right leading-tight pt-2.5">
              {match.team_b.split(' ').map((word, i) => (
                <div key={i}>{word}</div>
              ))}
            </div>
            <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-10 h-10 " />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-2">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-400 mt-2">טוען...</p>
            </div>
          ) : !isLocked ? (
            <div className="text-center py-8">
              <p className="text-slate-300 text-lg font-medium">הניחושים ייחשפו לאחר נעילת המשחק</p>
              <p className="text-slate-400 text-sm mt-2">המשחק ננעל 15 דקות לפני תחילתו</p>
            </div>
          ) : uniquePredictions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">אין ניחושים למשחק זה</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedScoreKeys.map((scoreKey, groupIndex) => (
                <div key={scoreKey} className="space-y-2">
                  {groupedPredictions[scoreKey].map((prediction, index) => (
                    <motion.div
                      key={prediction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                      className="bg-slate-700/50 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between">
                        {/* User name */}
                        <div className="text-white font-medium text-sm flex-1">
                          {getUserDisplayName(prediction.user_id)}
                        </div>

                        {/* Prediction with logos */}
                        <div className="flex items-center gap-2">
                          <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-5 h-5 " />
                          <span className="text-white font-bold text-base">
                            {prediction.predicted_score_a} - {prediction.predicted_score_b}
                          </span>
                          <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-5 h-5 " />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}