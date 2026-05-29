import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getCellStyle(hasPrediction, isFinished, points) {
  if (!isFinished) return { bg: 'rgba(71,85,105,0.18)', border: 'rgba(71,85,105,0.3)', text: '#475569' };
  if (!hasPrediction) return { bg: 'rgba(71,85,105,0.22)', border: 'rgba(100,116,139,0.35)', text: '#64748b' };
  if (points === 0)  return { bg: 'rgba(185,28,28,0.45)',  border: 'rgba(239,68,68,0.7)',   text: '#fca5a5' };
  if (points < 2)   return { bg: 'rgba(180,83,9,0.45)',   border: 'rgba(245,158,11,0.65)',  text: '#fcd34d' };
  if (points < 4)   return { bg: 'rgba(133,77,14,0.5)',   border: 'rgba(234,179,8,0.75)',   text: '#fde68a' };
  if (points < 6)   return { bg: 'rgba(20,83,45,0.55)',   border: 'rgba(34,197,94,0.7)',    text: '#86efac' };
  return              { bg: 'rgba(20,83,45,0.8)',          border: 'rgba(74,222,128,0.9)',   text: '#4ade80' };
}

const LEGEND = [
  { bg: 'rgba(71,85,105,0.35)',  border: 'rgba(100,116,139,0.5)', label: 'אין נתון' },
  { bg: 'rgba(185,28,28,0.55)',  border: 'rgba(239,68,68,0.7)',   label: '0' },
  { bg: 'rgba(180,83,9,0.55)',   border: 'rgba(245,158,11,0.7)',  label: '1–2' },
  { bg: 'rgba(133,77,14,0.6)',   border: 'rgba(234,179,8,0.8)',   label: '2–4' },
  { bg: 'rgba(20,83,45,0.65)',   border: 'rgba(34,197,94,0.75)',  label: '4–6' },
  { bg: 'rgba(20,83,45,0.9)',    border: 'rgba(74,222,128,1)',    label: '6+' },
];

export default function PredictionsHeatmap({ heatmapData }) {
  const [tooltip, setTooltip] = useState(null);

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        נתונים יתווספו לאחר תחילת הטורניר
      </div>
    );
  }

  return (
    <div className="space-y-5" dir="rtl">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">מפתח:</span>
        {LEGEND.map((l, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm inline-block flex-shrink-0"
              style={{ background: l.bg, border: `1px solid ${l.border}` }} />
            {l.label}
          </span>
        ))}
      </div>

      {/* Rounds */}
      {heatmapData.map((round, ri) => (
        <div key={round.roundId}>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">
            {round.roundName}
          </p>
          <div className="flex flex-wrap gap-1.5" dir="ltr">
            {round.matches.map((match, mi) => {
              const style = getCellStyle(match.hasPrediction, match.isFinished, match.pointsEarned);
              const isActive = tooltip?.matchId === match.matchId;

              return (
                <div key={match.matchId} className="relative">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: ri * 0.04 + mi * 0.02, type: "spring", stiffness: 300, damping: 20 }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-bold select-none"
                    style={{
                      background: style.bg,
                      border: `1px solid ${style.border}`,
                      color: style.text,
                      fontSize: '0.65rem',
                      boxShadow: isActive ? `0 0 14px ${style.border}` : 'none',
                    }}
                    onMouseEnter={() => setTooltip({ matchId: match.matchId, ...match })}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => setTooltip(isActive ? null : { matchId: match.matchId, ...match })}
                  >
                    {match.isFinished && match.hasPrediction
                      ? match.pointsEarned
                      : '–'}
                  </motion.button>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-44 rounded-xl p-3 pointer-events-none"
                        style={{
                          bottom: 'calc(100% + 8px)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(10,18,32,0.97)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(14px)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                        dir="rtl"
                      >
                        <p className="text-white font-bold text-xs text-center mb-2 leading-tight">
                          {match.homeTeam} — {match.awayTeam}
                        </p>
                        {match.isFinished ? (
                          <>
                            <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                              <span>תוצאה</span>
                              <span className="font-semibold">{match.homeScore ?? '?'}–{match.awayScore ?? '?'}</span>
                            </div>
                            {match.hasPrediction ? (
                              <>
                                <div className="flex justify-between text-xs text-slate-300 mb-1">
                                  <span>ניחוש</span>
                                  <span className="font-semibold">{match.predictedA}–{match.predictedB}</span>
                                </div>
                                <div className="flex justify-between text-xs pt-1 border-t border-white/10">
                                  <span className="text-slate-400">נקודות</span>
                                  <span className="font-bold" style={{ color: style.text }}>
                                    {match.pointsEarned}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <p className="text-slate-500 text-xs text-center mt-1">ללא ניחוש</p>
                            )}
                          </>
                        ) : (
                          <p className="text-slate-500 text-xs text-center">טרם הסתיים</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
