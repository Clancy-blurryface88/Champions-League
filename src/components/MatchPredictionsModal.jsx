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
    if (isOpen && match) loadPredictions();
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
      const sa = (a.predicted_score_a ?? 0) * 10 + (a.predicted_score_b ?? 0);
      const sb = (b.predicted_score_a ?? 0) * 10 + (b.predicted_score_b ?? 0);
      return sb - sa;
    });
  };

  if (!match) return null;

  const now = new Date();
  const lockTime = new Date(new Date(match.match_date).getTime() - 15 * 60 * 1000);
  const isLocked = now >= lockTime || match.is_finished;
  const uniquePredictions = getUniquePredictions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#080f1e] text-white p-0 fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl border border-amber-400/15 max-w-sm w-full max-h-[85vh] overflow-hidden flex flex-col [&>button:last-child]:hidden">

        {/* Close button */}
        <div className="flex-shrink-0 px-5 pt-4 pb-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.97] transition-all text-sm font-semibold text-white/70 border border-white/8"
          >
            חזרה לדף הקודם
          </button>
        </div>

        {/* Teams header */}
        <div className="flex-shrink-0 flex items-center justify-center gap-4 px-6 py-4">
          <div className="flex flex-col items-center gap-1.5">
            <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-12 h-12" />
            <span className="text-xs text-white/70 font-medium text-center leading-tight">{match.team_a}</span>
          </div>

          <div className="flex flex-col items-center gap-0.5 mb-4">
            <span className="text-amber-400 font-bold text-sm tracking-[0.2em]">VS</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-12 h-12" />
            <span className="text-xs text-white/70 font-medium text-center leading-tight">{match.team_b}</span>
          </div>
        </div>

        {/* Gold divider */}
        <div className="flex-shrink-0 h-px mx-5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />


        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <OrbitSpinner size={40} />
            </div>
          ) : !isLocked ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <Lock className="w-7 h-7 text-amber-400/40" />
              <p className="text-white/60 font-medium text-sm">הניחושים ייחשפו לאחר נעילת המשחק</p>
              <p className="text-white/30 text-xs">המשחק ננעל 15 דקות לפני תחילתו</p>
            </div>
          ) : uniquePredictions.length === 0 ? (
            <div className="flex justify-center py-12">
              <p className="text-white/30 text-sm">אין ניחושים למשחק זה</p>
            </div>
          ) : (
            <div className="mt-3 space-y-0">
              {uniquePredictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.22 }}
                >
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center py-3.5 px-2">
                    {/* Name */}
                    <span className="text-white/80 text-sm font-medium text-center">
                      {getUserDisplayName(prediction.user_id)}
                    </span>

                    {/* Score + flags */}
                    <div className="flex items-center gap-2 px-3">
                      <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-5 h-5" />
                      <span className="text-amber-400 font-bold text-base tabular-nums min-w-[46px] text-center">
                        {prediction.predicted_score_a} – {prediction.predicted_score_b}
                      </span>
                      <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-5 h-5" />
                    </div>

                    {/* Empty cell for symmetry */}
                    <div />
                  </div>

                  {index < uniquePredictions.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent mx-2" />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
