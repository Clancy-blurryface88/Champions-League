import OrbitSpinner from "@/components/OrbitSpinner";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Match } from "@/api/entities";

// The summary before sending, as broadcast score bugs (design 98): each match a slanted navy bar with
// each club's crest large and slightly turned in the background (70%), and the predicted score on a
// deep silver plate in the middle. The bars slide in from the side one after another.

const NAVY = 'linear-gradient(180deg,#14306b,#0b1b45)';
const PLATE = 'linear-gradient(180deg,#e2e8f0,#64748b)'; // deep silver (option 124)
const EDGE = '1px solid rgba(203,213,225,.35)';
const SKEW = 'skewX(-10deg)';
const UNSKEW = 'skewX(10deg)';
const CREST = 62;

function Side({ logo, side }) {
  return (
    <span className="relative flex-1 overflow-hidden" style={{ background: NAVY }}>
      {logo && (
        <img src={logo} alt="" className="absolute object-contain pointer-events-none"
          style={{ width: CREST, height: CREST, top: '50%', marginTop: -CREST / 2, [side === 'b' ? 'right' : 'left']: -4, opacity: 0.7,
            transform: `rotate(${side === 'b' ? 3 : -3}deg)`, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.5))' }} />
      )}
    </span>
  );
}

export default function PredictionSummary({ predictions, roundId, onConfirm, onCancel, saving }) {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

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
        dir="rtl"
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col"
        style={{
          background: '#070b18',
          border: '1px solid rgba(9, 122, 220,0.18)',
          boxShadow: '0 -8px 60px rgba(9, 122, 220,0.10), 0 0 0 1px rgba(255,255,255,0.04)',
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
        <div className="flex flex-col items-center justify-center px-5 pt-3 pb-3 flex-shrink-0 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-lg font-bold leading-tight" style={{ color: '#93c5fd' }}>הניחושים שלך</h2>
          <p className="text-white/60 text-xs mt-0.5">
            {loadingMatches ? 'עבור לפני אישור' : `${predictionsList.length} משחקים · עבור לפני אישור`}
          </p>
        </div>

        {/* the score bugs */}
        <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {loadingMatches ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <OrbitSpinner size={36} />
              <span className="text-white/40 text-sm">טוען משחקים...</span>
            </div>
          ) : (
            <div className="px-3.5 py-3 grid gap-[7px]">
              {predictionsList.map(({ match, prediction }, i) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.045, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* ltr: the home club on the left, as on the match card */}
                  <div dir="ltr" className="flex overflow-hidden mx-auto" aria-label={`${match.team_a} ${prediction.predicted_score_a} – ${prediction.predicted_score_b} ${match.team_b}`}
                    style={{ width: '88%', height: 40, transform: SKEW, border: EDGE, boxShadow: '0 4px 14px rgba(0,0,0,.5)' }}>
                    <Side logo={match.team_a_logo} side="a" />
                    <span className="relative z-[1] grid place-items-center flex-shrink-0 tabular-nums"
                      style={{ width: 80, background: PLATE, color: '#0b1b45', fontFamily: 'var(--num-font)', fontWeight: 900, fontSize: 17 }}>
                      <span style={{ transform: UNSKEW }}>{prediction.predicted_score_a} - {prediction.predicted_score_b}</span>
                    </span>
                    <Side logo={match.team_b_logo} side="b" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pt-3 pb-6 flex-shrink-0 flex flex-col items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {/* side by side; reversed so the confirm button sits on the right */}
          <div className="flex flex-row-reverse gap-3 w-full max-w-sm">
            <button
              onClick={onConfirm}
              disabled={saving || loadingMatches}
              className="flex-[1.4] py-3 rounded font-bold text-base transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(90deg,#16a34a,#22c55e)', color: '#fff', boxShadow: '0 6px 20px rgba(34,197,94,.25)' }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2" style={{ transform: 'skewX(12deg)' }}>
                  <OrbitSpinner size={18} />
                  שומר...
                </span>
              ) : (
                <span className="inline-block" style={{ transform: 'skewX(12deg)' }}>אישור ושליחה</span>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={saving}
              className="flex-1 py-3 rounded text-base font-bold transition-opacity disabled:opacity-40"
              style={{ transform: 'skewX(-12deg)', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)', color: '#cbd5e1' }}
            >
              <span className="inline-block" style={{ transform: 'skewX(12deg)' }}>ביטול</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
