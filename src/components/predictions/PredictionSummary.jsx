import TeamFlag from "@/components/TeamFlag";
import OrbitSpinner from "@/components/OrbitSpinner";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const rowVariants   = { hidden: {}, visible: {} };
const teamAVariants = {
  hidden:   { x: 50, opacity: 0 },
  visible:  { x: 0,  opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 22 } },
};
const teamBVariants = {
  hidden:   { x: -50, opacity: 0 },
  visible:  { x: 0,   opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 22 } },
};
const scoreVariants = {
  hidden:   { opacity: 0, scale: 0.6 },
  visible:  { opacity: 1, scale: 1,  transition: { delay: 0.2, type: 'spring', stiffness: 300, damping: 20 } },
};
import { Match } from "@/api/entities";

export default function PredictionSummary({ predictions, roundId, onConfirm, onCancel, saving }) {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    setLoadingMatches(true);
    Match.filter({ round_id: roundId })
      .then(fresh => {
        setMatches(fresh.sort((a, b) => new Date(a.match_date) - new Date(b.match_date)));
      })
      .catch(() => {})
      .finally(() => setLoadingMatches(false));
  }, [roundId]);

  // Iterate over sorted matches (not predictions) so order is guaranteed
  // and match.id lookup works regardless of string/number type coercion
  const predictionsList = matches
    .map(match => ({ match, prediction: predictions[match.id] }))
    .filter(({ prediction }) =>
      prediction &&
      prediction.predicted_score_a != null &&
      prediction.predicted_score_b != null
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col"
        style={{
          background: 'linear-gradient(160deg, rgba(8,18,38,0.99) 0%, rgba(4,10,22,0.99) 100%)',
          border: '1px solid rgba(245,197,24,0.18)',
          boxShadow: '0 -8px 60px rgba(245,197,24,0.10), 0 0 0 1px rgba(255,255,255,0.04)',
          // 'clip' visually clips the border-radius without creating a scroll container,
          // avoiding the framer-motion transform + overflow:hidden compositing bug
          // that causes inner overflow-y:auto content to disappear on scroll.
          overflow: 'clip',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle – mobile */}
        <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-4 pb-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div>
            <h2
              className="text-lg font-bold leading-tight"
              style={{
                background: 'linear-gradient(90deg, #f5c518, #fde68a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              סיכום הניחושים שלך
            </h2>
            <p className="text-white/35 text-xs mt-0.5">עבור לפני אישור</p>
          </div>

        </div>

        {/* Match rows – flex-1 so it fills available space, overflow-y for scroll */}
        <div
          className="overflow-y-auto flex-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
          ref={scrollRef}
        >
          {loadingMatches ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <OrbitSpinner size={36} />
              <span className="text-white/40 text-sm">טוען משחקים...</span>
            </div>
          ) : (
            <div className="px-4 py-3 space-y-2">
              {predictionsList.map(({ match, prediction }) => (
                <motion.div
                  key={match.id}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4, root: scrollRef }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {/* Team A — נכנסת מימין */}
                  <motion.div
                    variants={teamAVariants}
                    className="flex items-center gap-1.5 flex-1 min-w-0 justify-end"
                  >
                    <span className="text-white/80 text-xs font-semibold truncate text-right">{match.team_a}</span>
                    <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-7 h-7 flex-shrink-0" />
                  </motion.div>

                  {/* Score pill — מופיע אחרי הדגלים */}
                  <motion.div
                    variants={scoreVariants}
                    className="flex flex-col items-center flex-shrink-0 w-[72px]"
                  >
                    <div
                      className="w-full flex items-center justify-center px-2 py-1 rounded-xl"
                      style={{
                        background: 'rgba(245,197,24,0.11)',
                        border: '1px solid rgba(245,197,24,0.32)',
                        boxShadow: '0 0 12px rgba(245,197,24,0.10)',
                      }}
                    >
                      <span
                        className="font-black text-sm tabular-nums"
                        style={{
                          background: 'linear-gradient(90deg, #f5c518, #fde68a)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {prediction.predicted_score_a} – {prediction.predicted_score_b}
                      </span>
                    </div>
                    {match.league && (
                      <span className="text-[9px] text-amber-400/45 font-medium mt-0.5 tracking-wide">{match.league}</span>
                    )}
                  </motion.div>

                  {/* Team B — נכנסת משמאל */}
                  <motion.div
                    variants={teamBVariants}
                    className="flex items-center gap-1.5 flex-1 min-w-0 justify-start"
                  >
                    <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-7 h-7 flex-shrink-0" />
                    <span className="text-white/80 text-xs font-semibold truncate">{match.team_b}</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 pt-3 pb-6 space-y-2 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={onConfirm}
            disabled={saving || loadingMatches}
            className="w-full py-3.5 rounded-2xl font-bold text-base text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(90deg, #16a34a, #22c55e)',
              boxShadow: (saving || loadingMatches) ? 'none' : '0 4px 20px rgba(34,197,94,0.35)',
            }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <OrbitSpinner size={18} />
                שומר...
              </span>
            ) : (
              'אישור ושליחה'
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={saving}
            className="w-full py-2.5 rounded-2xl text-sm font-bold text-white transition-opacity disabled:opacity-40"
            style={{
              background: 'linear-gradient(90deg, #b91c1c, #ef4444)',
              boxShadow: '0 4px 20px rgba(239,68,68,0.25)',
            }}
          >
            ביטול
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
