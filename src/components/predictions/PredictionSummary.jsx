import TeamFlag from "@/components/TeamFlag";
import OrbitSpinner from "@/components/OrbitSpinner";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Match } from "@/api/entities";

export default function PredictionSummary({ predictions, roundId, onConfirm, onCancel, saving }) {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  // Fetch fresh match data when the modal opens
  useEffect(() => {
    setLoadingMatches(true);
    Match.filter({ round_id: roundId })
      .then(fresh => {
        setMatches(fresh.sort((a, b) => new Date(a.match_date) - new Date(b.match_date)));
      })
      .catch(() => {})
      .finally(() => setLoadingMatches(false));
  }, [roundId]);

  const predictionsList = matches.length === 0 ? [] : Object.entries(predictions)
    .map(([matchId, prediction]) => {
      const match = matches.find(m => String(m.id) === String(matchId));
      return { match, prediction };
    })
    .filter(({ match, prediction }) =>
      match &&
      match.team_a &&
      match.team_b &&
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
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(8,18,38,0.99) 0%, rgba(4,10,22,0.99) 100%)',
          border: '1px solid rgba(245,197,24,0.18)',
          boxShadow: '0 -8px 60px rgba(245,197,24,0.10), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle – mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
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

          {/* Count badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(245,197,24,0.10)', border: '1px solid rgba(245,197,24,0.28)' }}
          >
            <span className="text-amber-400 font-black text-sm tabular-nums">
              {loadingMatches ? '…' : predictionsList.length}
            </span>
            <span className="text-amber-400/60 text-[11px] font-medium">ניחושים</span>
          </div>
        </div>

        {/* Match rows */}
        <div className="overflow-y-auto" style={{ maxHeight: '52vh' }}>
          {loadingMatches ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <OrbitSpinner size={36} />
              <span className="text-white/40 text-sm">טוען משחקים...</span>
            </div>
          ) : (
            <div className="px-4 py-3 space-y-2">
              {predictionsList.map(({ match, prediction }) => (
                <div
                  key={match.id}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {/* Team A — right side */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                    <span className="text-white/80 text-xs font-semibold truncate text-right">{match.team_a}</span>
                    <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-7 h-7 flex-shrink-0" />
                  </div>

                  {/* Score pill */}
                  <div className="flex flex-col items-center flex-shrink-0 w-[72px]">
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
                  </div>

                  {/* Team B — left side */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-start">
                    <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-7 h-7 flex-shrink-0" />
                    <span className="text-white/80 text-xs font-semibold truncate">{match.team_b}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 pt-3 pb-6 space-y-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={onConfirm}
            disabled={saving || loadingMatches}
            className="w-full py-3.5 rounded-2xl font-bold text-base text-black transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(90deg, #f5c518 0%, #fde68a 50%, #f5c518 100%)',
              backgroundSize: '200% 100%',
              animation: (saving || loadingMatches) ? 'none' : 'shine 2.5s linear infinite',
              boxShadow: (saving || loadingMatches) ? 'none' : '0 4px 24px rgba(245,197,24,0.38)',
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
            className="w-full py-2.5 rounded-2xl text-sm font-medium text-white/35 hover:text-white/65 transition-colors disabled:opacity-40"
          >
            ביטול
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
