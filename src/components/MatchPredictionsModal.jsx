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
      <DialogContent className="p-0 fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl max-w-sm w-full max-h-[85vh] overflow-hidden flex flex-col [&>button:last-child]:hidden border border-emerald-500/25"
        style={{ background: '#050d0a' }}>

        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 rounded-2xl overflow-hidden">
          <div style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,120,0.018) 3px, rgba(0,255,120,0.018) 4px)',
            position: 'absolute', inset: 0
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">

          {/* Close button */}
          <div className="px-5 pt-4 pb-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/4 hover:bg-white/8 active:scale-[0.97] transition-all text-sm font-semibold text-white/50 border border-white/8 font-mono tracking-widest uppercase text-xs"
            >
              ← חזרה
            </button>
          </div>

          {/* Teams row — compact scoreboard style */}
          <div className="flex items-center justify-center gap-4 px-5 pb-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-8 h-8" />
              <span className="text-white/60 text-xs font-mono">{match.team_a}</span>
            </div>
            <span className="text-emerald-400/70 font-mono font-bold text-xs tracking-[0.3em]">VS</span>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs font-mono">{match.team_b}</span>
              <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-8 h-8" />
            </div>
          </div>

          {/* Column header */}
          <div className="flex items-center px-5 py-2 border-y border-emerald-500/20 bg-emerald-500/5 flex-shrink-0">
            <span className="text-emerald-400/50 text-[10px] font-mono uppercase tracking-[0.2em] flex-1 text-right">שחקן</span>
            <span className="text-emerald-400/50 text-[10px] font-mono uppercase tracking-[0.2em] mr-4">ניחוש</span>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <OrbitSpinner size={36} />
              </div>
            ) : !isLocked ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-6">
                <Lock className="w-6 h-6 text-emerald-400/30" />
                <p className="text-white/40 text-sm font-mono">LOCKED</p>
                <p className="text-white/25 text-xs">הניחושים ייחשפו לאחר נעילת המשחק</p>
              </div>
            ) : uniquePredictions.length === 0 ? (
              <div className="flex justify-center py-12">
                <p className="text-white/25 text-sm font-mono">NO DATA</p>
              </div>
            ) : (
              <div>
                {uniquePredictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="group flex items-center px-5 py-3.5 border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors"
                  >
                    {/* Row index */}
                    <span className="text-emerald-400/25 font-mono text-[10px] w-5 text-left flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Name */}
                    <span className="text-white/80 text-sm font-medium flex-1 text-right mr-3">
                      {getUserDisplayName(prediction.user_id)}
                    </span>

                    {/* Score */}
                    <span className="text-emerald-400 font-mono font-bold text-lg tabular-nums tracking-wider mr-1 group-hover:text-emerald-300 transition-colors">
                      {prediction.predicted_score_a} – {prediction.predicted_score_b}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
