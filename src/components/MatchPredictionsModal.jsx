import TeamFlag from "@/components/TeamFlag";
import OrbitSpinner from "@/components/OrbitSpinner";
import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Prediction } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useModalBackButton } from "@/hooks/useModalBackButton";
import { PREDICTION_LOCK_MINUTES } from "@/config/tournament";

// ── Slot digit ────────────────────────────────────────────────────────────────
function SlotDigit({ target, delay = 0 }) {
  const [num, setNum]       = useState(Math.floor(Math.random() * 9));
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setNum(Math.floor(Math.random() * 9));
    setSettled(false);
    let spins = 0;
    const max = 18 + Math.floor(Math.random() * 8);
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        spins++;
        if (spins >= max) { setNum(target); setSettled(true); clearInterval(iv); }
        else setNum(Math.floor(Math.random() * 10));
      }, 90);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [target, delay]);

  return (
    <motion.span
      animate={{ color: settled ? '#097adc' : '#475569' }}
      transition={{ duration: 0.2 }}
      className="font-black text-2xl tabular-nums leading-none"
    >
      {num}
    </motion.span>
  );
}

// ── Slot score ────────────────────────────────────────────────────────────────
function SlotScore({ scoreA, scoreB, delay = 0 }) {
  return (
    <div className="flex items-center gap-1.5">
      <SlotDigit target={scoreA} delay={delay} />
      <span className="text-white/30 font-bold text-xl leading-none">–</span>
      <SlotDigit target={scoreB} delay={delay + 0.15} />
    </div>
  );
}

export default function MatchPredictionsModal({ isOpen, onClose, match }) {
  const [predictions, setPredictions]     = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [loading, setLoading]             = useState(true);

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
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [match]);

  useEffect(() => {
    if (isOpen && match) loadPredictions();
  }, [isOpen, match, loadPredictions]);

  useModalBackButton(isOpen, onClose);


  const getUserName = (userId) =>
    publicProfiles.find(p => p.user_id === userId)?.display_name || `משתמש ${userId.slice(0, 6)}`;

  const getUnique = () => {
    const map = {};
    predictions.forEach(p => {
      const key = `${p.user_id}_${p.match_id}`;
      if (!map[key] || new Date(p.created_date) > new Date(map[key].created_date)) map[key] = p;
    });
    return Object.values(map);
  };

  // קיבוץ לפי ניחוש זהה
  const getGrouped = () => {
    const groups = {};
    getUnique().forEach(p => {
      const key = `${p.predicted_score_a}-${p.predicted_score_b}`;
      if (!groups[key]) groups[key] = { scoreA: p.predicted_score_a, scoreB: p.predicted_score_b, users: [] };
      groups[key].users.push(getUserName(p.user_id));
    });
    return Object.values(groups).sort((a, b) =>
      (b.scoreA * 10 + b.scoreB) - (a.scoreA * 10 + a.scoreB)
    );
  };

  if (!match) return null;

  const lockTime  = new Date(new Date(match.match_date).getTime() - PREDICTION_LOCK_MINUTES * 60 * 1000);
  const isLocked  = new Date() >= lockTime || match.is_finished;
  const grouped   = getGrouped();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-3xl max-w-sm w-full max-h-[85vh] overflow-hidden flex flex-col [&>button:last-child]:hidden border-0"
        style={{
          background: 'rgba(5, 10, 25, 0.72)',
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
          boxShadow: '0 0 0 1px rgba(9, 122, 220,0.18), 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {/* Top gradient line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/70 to-transparent flex-shrink-0" />

        {/* Back button */}
        <div className="px-5 pt-4 pb-0 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl text-sm font-medium transition-colors tracking-wide"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            חזרה לדף הקודם
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-5 py-2 flex-shrink-0">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-sky-400/50" />
          <span className="text-sky-400/70 text-[10px] uppercase tracking-[0.2em] font-semibold">ניחושים</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-sky-400/50" />
        </div>

        {/* Predictions */}
        <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-2">
          {loading ? (
            <div className="flex justify-center py-10"><OrbitSpinner size={36} /></div>
          ) : !isLocked ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <Lock className="w-7 h-7 text-sky-400/30" />
              <p className="text-white/40 text-sm">הניחושים ייחשפו לאחר נעילת המשחק</p>
              <p className="text-white/20 text-xs" dir="rtl">15 דקות לפני תחילת המשחק</p>
            </div>
          ) : grouped.length === 0 ? (
            <div className="flex justify-center py-10">
              <p className="text-white/25 text-sm">אין ניחושים למשחק זה</p>
            </div>
          ) : (
            <div className="space-y-3">
              {grouped.map((group, gi) => (
                <div key={`${group.scoreA}-${group.scoreB}`} className="space-y-1.5">
                  {group.users.map((name, ui) => {
                    const rowDelay = gi * 0.15 + ui * 0.08;
                    const gradientOpacity = Math.max(0.05, 0.15 - gi * 0.025);
                    return (
                      <motion.div
                        key={`${gi}-${ui}`}
                        initial={{ opacity: 0, x: 20, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
                        transition={{ delay: rowDelay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="relative flex items-center justify-between px-4 py-2 rounded-2xl overflow-hidden"
                        style={{
                          border: '1px solid rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(12px)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                        }}
                      >
                        {/* Background gradient — progress style, no effect on score */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{ background: `linear-gradient(90deg, rgba(59,130,246,${gradientOpacity}) 0%, transparent 65%)` }}
                        />
                        <span className="relative text-white/85 text-sm font-semibold truncate flex-1 min-w-0">
                          {name}
                        </span>
                        <div className="relative flex items-center gap-2 flex-shrink-0">
                          <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-5 h-5 opacity-75" />
                          {/* Slot Machine — delay based on group, not per user row */}
                          <SlotScore scoreA={group.scoreA} scoreB={group.scoreB} delay={gi * 0.15 + 0.1} />
                          <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-5 h-5 opacity-75" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/30 to-transparent flex-shrink-0" />
      </DialogContent>
    </Dialog>
  );
}
