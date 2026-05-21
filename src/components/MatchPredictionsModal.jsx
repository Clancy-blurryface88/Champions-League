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
      <DialogContent
        className="p-0 fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-3xl max-w-sm w-full max-h-[85vh] overflow-hidden flex flex-col [&>button:last-child]:hidden border-0"
        style={{
          background: 'rgba(8, 15, 35, 0.75)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          boxShadow: '0 0 0 1px rgba(245,197,24,0.15), 0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Top gold line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent flex-shrink-0" />

        {/* Close button */}
        <div className="px-5 pt-4 pb-0 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl text-sm font-medium text-white/40 hover:text-white/70 transition-colors tracking-wide"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            חזרה לדף הקודם
          </button>
        </div>

        {/* Match header — glass card */}
        <div className="px-5 pt-4 pb-2 flex-shrink-0">
          <div
            className="rounded-2xl px-5 py-4 flex items-center justify-between"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Team A */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-12 h-12" />
              <span className="text-white text-xs font-semibold text-center leading-tight">{match.team_a}</span>
              <span className="text-white/30 text-[10px]">בית</span>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-1 px-3">
              <span className="text-amber-400 font-bold text-base tracking-[0.2em]">VS</span>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-12 h-12" />
              <span className="text-white text-xs font-semibold text-center leading-tight">{match.team_b}</span>
              <span className="text-white/30 text-[10px]">חוץ</span>
            </div>
          </div>
        </div>

        {/* Section title */}
        <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-semibold">ניחושים</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {/* Predictions list */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <OrbitSpinner size={36} />
            </div>
          ) : !isLocked ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <Lock className="w-7 h-7 text-amber-400/30" />
              <p className="text-white/40 text-sm">הניחושים ייחשפו לאחר נעילת המשחק</p>
              <p className="text-white/20 text-xs" dir="rtl">15 דקות לפני תחילת המשחק</p>
            </div>
          ) : uniquePredictions.length === 0 ? (
            <div className="flex justify-center py-10">
              <p className="text-white/25 text-sm">אין ניחושים למשחק זה</p>
            </div>
          ) : (
            uniquePredictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Name */}
                <span className="text-white/85 text-sm font-semibold">
                  {getUserDisplayName(prediction.user_id)}
                </span>

                {/* Score + mini flags */}
                <div className="flex items-center gap-2">
                  <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-5 h-5 opacity-80" />
                  <span className="text-amber-400 font-bold text-base tabular-nums tracking-wide">
                    {prediction.predicted_score_a} – {prediction.predicted_score_b}
                  </span>
                  <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-5 h-5 opacity-80" />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Bottom gold line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent flex-shrink-0" />
      </DialogContent>
    </Dialog>
  );
}
