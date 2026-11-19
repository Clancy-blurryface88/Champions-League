import OrbitSpinner from "@/components/OrbitSpinner";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Match } from "@/api/entities";
import { useSheetDrag, SheetGrip } from "@/components/ui/SheetGrip";

// The summary before sending, as broadcast score bugs (design 98): each match a slanted navy bar with
// each club's crest large and slightly turned in the background (70%), and the predicted score on a
// deep silver plate in the middle. The bars slide in from the side one after another.

const NAVY = 'linear-gradient(180deg,#14306b,#0b1b45)';
const PLATE = 'linear-gradient(180deg,#e2e8f0,#64748b)'; // deep silver (option 124)
const EDGE = '1px solid rgba(203,213,225,.35)';
const SKEW = 'skewX(-10deg)';
const UNSKEW = 'skewX(10deg)';
const CREST = 62;

// Rolling digits (odometer): a column 0–9 behind a one-digit window slides up until the predicted
// number stops in it, slowing down at the end. Numbers past 9 just show as they are.
const ROW_H = 20;
function RollDigit({ value, delay }) {
  const v = Number(value);
  if (!(v >= 0 && v <= 9)) return <span>{value}</span>;
  return (
    <span className="inline-block overflow-hidden" style={{ height: ROW_H }}>
      <motion.span className="grid" initial={{ y: 0 }} animate={{ y: -v * ROW_H }} transition={{ delay, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}>
        {Array.from({ length: 10 }, (_, n) => <span key={n} className="grid place-items-center" style={{ height: ROW_H }}>{n}</span>)}
      </motion.span>
    </span>
  );
}

function Side({ logo, side }) {
  return (
    <span className="relative flex-1 overflow-hidden" style={{ background: NAVY }}>
      {logo && (
        <img src={logo} alt="" className="absolute object-contain pointer-events-none"
          style={{ width: CREST, height: CREST, top: '50%', marginTop: -CREST / 2, [side === 'b' ? 'right' : 'left']: -4, opacity: 0.7,
            transform: `rotate(${side === 'b' ? 3 : -3}deg)`,
            // a thick crest (option 179): three one-pixel steps in deep navy, then a soft shadow
            filter: 'drop-shadow(1px 1px 0 #0a1636) drop-shadow(1px 1px 0 #08122c) drop-shadow(1px 1px 0 #060e22) drop-shadow(3px 4px 4px rgba(0,0,0,.6))' }} />
      )}
    </span>
  );
}

export default function PredictionSummary({ predictions, roundId, onConfirm, onCancel, saving }) {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const { controls: grip, sheetProps } = useSheetDrag(() => { if (!saving) onCancel(); });

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
  // by the day they're played (local date), each with its date only
  const byDay = [];
  predictionsList.forEach((row, i) => {
    const d = new Date(row.match.match_date);
    const key = d.toDateString();
    let g = byDay[byDay.length - 1];
    if (!g || g.key !== key) {
      g = { key, label: d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' }), items: [] };
      byDay.push(g);
    }
    g.items.push({ ...row, i });
  });

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
        {...sheetProps}
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
        <SheetGrip controls={grip} onClose={() => { if (!saving) onCancel(); }} className="pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </SheetGrip>

        {/* Header */}
        <div className="flex flex-col items-center justify-center px-5 pt-3 pb-3 flex-shrink-0 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-lg font-bold leading-tight" style={{ color: '#93c5fd' }}>הניחושים שלך</h2>
        </div>

        {/* the score bugs */}
        <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {loadingMatches ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <OrbitSpinner size={36} />
              <span className="text-white/40 text-sm">טוען משחקים...</span>
            </div>
          ) : (
            <div className="px-3.5 pb-3">
              {byDay.map(({ key, label, items }) => (
                <div key={key}>
                  <div className="sticky top-0 z-[3] flex justify-center pt-2.5 pb-2" style={{ background: 'linear-gradient(#070b18 72%, rgba(7,11,24,0))' }}>
                    <span style={{ padding: '3px 14px', transform: SKEW, background: PLATE, color: '#0b1b45', fontWeight: 800, fontSize: 11.5 }}>
                      <span className="inline-block" style={{ transform: UNSKEW }}>{label}</span>
                    </span>
                  </div>
                  <div className="grid gap-[7px] mb-1.5">
              {items.map(({ match, prediction, i }) => (
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
                      <span className="inline-flex items-center" style={{ transform: UNSKEW, gap: 5 }}>
                        <RollDigit value={prediction.predicted_score_a} delay={0.45 + i * 0.045} />
                        <span>-</span>
                        <RollDigit value={prediction.predicted_score_b} delay={0.57 + i * 0.045} />
                      </span>
                    </span>
                    <Side logo={match.team_b_logo} side="b" />
                  </div>
                </motion.div>
              ))}
                  </div>
                </div>
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
              className="flex-1 py-3 rounded font-bold text-base transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(90deg,#16a34a,#22c55e)', color: '#fff', boxShadow: '0 6px 20px rgba(34,197,94,.25)' }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2" style={{ transform: 'skewX(12deg)' }}>
                  <OrbitSpinner size={18} />
                  שומר...
                </span>
              ) : (
                <span className="inline-block" style={{ transform: 'skewX(12deg)' }}>שליחה</span>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={saving}
              className="flex-1 py-3 rounded text-base font-bold transition-opacity disabled:opacity-40"
              style={{ transform: 'skewX(-12deg)', background: 'linear-gradient(90deg,#b91c1c,#ef4444)', color: '#fff', boxShadow: '0 6px 20px rgba(239,68,68,.25)' }}
            >
              <span className="inline-block" style={{ transform: 'skewX(12deg)' }}>ביטול</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
