import TeamFlag from "@/components/TeamFlag";
import OrbitSpinner from "@/components/OrbitSpinner";
import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Prediction } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

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

  const getUniquePredictions = () => {
    const map = {};
    predictions.forEach(p => {
      const key = `${p.user_id}_${p.match_id}`;
      if (!map[key] || new Date(p.created_date) > new Date(map[key].created_date)) {
        map[key] = p;
      }
    });
    return Object.values(map).sort((a, b) => {
      const scoreA = (a.predicted_score_a ?? 0) * 10 + (a.predicted_score_b ?? 0);
      const scoreB = (b.predicted_score_a ?? 0) * 10 + (b.predicted_score_b ?? 0);
      return scoreB - scoreA;
    });
  };

  if (!match) return null;

  const now = new Date();
  const lockTime = new Date(new Date(match.match_date).getTime() - 15 * 60 * 1000);
  const isLocked = now >= lockTime || match.is_finished;
  const uniquePredictions = getUniquePredictions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0d1526] text-white p-0 fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl border border-white/8 max-w-sm w-full max-h-[85vh] overflow-hidden flex flex-col [&>button:last-child]:hidden">

        {/* Header */}
        <div className="flex-shrink-0">
          <div className="px-5 pt-4 pb-3">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/6 hover:bg-white/10 active:scale-[0.97] transition-all text-sm font-semibold text-white/80 border border-white/10"
            >
              חזרה לדף הקודם
            </button>
          </div>

          {/* Title */}
          <p className="text-center text-white/50 text-xs font-semibold uppercase tracking-widest pb-1">
            ניחושים למשחק
          </p>

          {/* Teams */}
          <div className="flex items-center justify-between px-7 py-3">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-12 h-12" />
              <span className="text-xs text-white font-semibold leading-tight text-center">{match.team_a}</span>
              <span className="text-[10px] text-slate-400">(בית)</span>
            </div>
            <span className="text-sm font-bold text-amber-400 tracking-widest mx-3 pb-5">VS</span>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-12 h-12" />
              <span className="text-xs text-white font-semibold leading-tight text-center">{match.team_b}</span>
              <span className="text-[10px] text-slate-400">(חוץ)</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 flex-shrink-0" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <OrbitSpinner size={40} />
            </div>
          ) : !isLocked ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-3 text-center">
              <Lock className="w-8 h-8 text-slate-500" />
              <p className="text-white/70 font-medium">הניחושים ייחשפו לאחר נעילת המשחק</p>
              <p className="text-slate-500 text-sm">המשחק ננעל 15 דקות לפני תחילתו</p>
            </div>
          ) : uniquePredictions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <p className="text-slate-400">אין ניחושים למשחק זה</p>
            </div>
          ) : (
            <div className="px-5 py-3">
              {/* Count badge */}
              <div className="flex justify-center mb-4">
                <span className="text-[11px] text-white/30 uppercase tracking-widest font-semibold">
                  {uniquePredictions.length} ניחושים
                </span>
              </div>

              {/* Predictions list */}
              <div className="space-y-0">
                {uniquePredictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between py-3">
                      {/* Name */}
                      <span className="text-white/85 font-medium text-sm flex-1 text-right">
                        {getUserDisplayName(prediction.user_id)}
                      </span>

                      {/* Score + flags */}
                      <div className="flex items-center gap-2 mr-4">
                        <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-5 h-5" />
                        <span className="text-white font-bold text-base tabular-nums tracking-wide min-w-[52px] text-center">
                          {prediction.predicted_score_a} – {prediction.predicted_score_b}
                        </span>
                        <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-5 h-5" />
                      </div>
                    </div>

                    {index < uniquePredictions.length - 1 && (
                      <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
