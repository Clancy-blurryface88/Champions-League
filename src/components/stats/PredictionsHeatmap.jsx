import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TeamFlag from "@/components/TeamFlag";

function getOutcome(match) {
  if (!match.isFinished || !match.hasPrediction) return 'none';
  const { predictedA: pA, predictedB: pB, homeScore: aA, awayScore: aB } = match;
  if (aA === null || aB === null) return 'none';
  if (pA === aA && pB === aB) return 'exact';
  const predDir = pA > pB ? 1 : pA < pB ? -1 : 0;
  const actDir  = aA > aB ? 1 : aA < aB ? -1 : 0;
  return predDir === actDir ? 'correct' : 'wrong';
}

function getCellStyle(match) {
  if (!match.isFinished)
    return { bg: 'rgba(71,85,105,0.18)', border: 'rgba(71,85,105,0.30)', text: '#475569' };
  if (!match.hasPrediction)
    return { bg: 'rgba(71,85,105,0.22)', border: 'rgba(100,116,139,0.35)', text: '#64748b' };
  const outcome = getOutcome(match);
  if (outcome === 'exact')
    return { bg: 'rgba(20,83,45,0.80)',   border: 'rgba(74,222,128,0.90)', text: '#4ade80' };
  if (outcome === 'correct')
    return { bg: 'rgba(120,80,5,0.65)',   border: 'rgba(234,179,8,0.85)',  text: '#fde68a' };
  return   { bg: 'rgba(185,28,28,0.55)', border: 'rgba(239,68,68,0.75)',  text: '#fca5a5' };
}

const LEGEND = [
  { bg: 'rgba(71,85,105,0.35)',  border: 'rgba(100,116,139,0.5)', label: 'אין נתון' },
  { bg: 'rgba(20,83,45,0.80)',   border: 'rgba(74,222,128,0.90)', label: 'פגיעה מדויקת' },
  { bg: 'rgba(120,80,5,0.65)',   border: 'rgba(234,179,8,0.85)',  label: 'כיוון נכון' },
  { bg: 'rgba(185,28,28,0.55)', border: 'rgba(239,68,68,0.75)',   label: 'שגיאה' },
];

const OUTCOME_LABEL = {
  exact:   { text: 'פגיעה מדויקת 🎯', color: '#4ade80' },
  correct: { text: 'כיוון נכון',      color: '#fde68a' },
  wrong:   { text: 'שגיאה',           color: '#fca5a5' },
};

export default function PredictionsHeatmap({ heatmapData }) {
  const [active, setActive] = useState(null);

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        נתונים יתווספו לאחר תחילת הטורניר
      </div>
    );
  }

  const activeStyle = active ? getCellStyle(active) : null;
  const activeOutcome = active ? getOutcome(active) : 'none';

  return (
    <div className="space-y-5" dir="rtl">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
        {LEGEND.map((l, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm inline-block flex-shrink-0"
              style={{ background: l.bg, border: `1px solid ${l.border}` }} />
            <span>{l.label}</span>
          </span>
        ))}
      </div>

      {/* Popup — wrapper נשאר מאונט, תוכן מתחלף בפנים בצורה חלקה */}
      <AnimatePresence>
        {active && activeStyle && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="rounded-2xl p-4 mx-auto overflow-hidden"
            style={{
              maxWidth: 280,
              background: 'rgba(8,15,28,0.97)',
              border: `1px solid ${activeStyle.border}`,
              backdropFilter: 'blur(16px)',
              boxShadow: `0 8px 32px rgba(0,0,0,0.55), 0 0 16px ${activeStyle.border}40`,
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            dir="rtl"
          >
            {/* התוכן עם key — מתחלף בפנים */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active.matchId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {/* Flags */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <TeamFlag logo={active.homeTeamLogo} name={active.homeTeam} className="w-8 h-8" rounded="sm" />
                  <span className="text-white/30 text-sm">—</span>
                  <TeamFlag logo={active.awayTeamLogo} name={active.awayTeam} className="w-8 h-8" rounded="sm" />
                </div>

                {active.isFinished ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">תוצאה</span>
                      <span className="font-bold text-white tabular-nums">
                        {active.homeScore ?? '?'} – {active.awayScore ?? '?'}
                      </span>
                    </div>
                    {active.hasPrediction ? (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">ניחוש</span>
                          <span className="font-bold text-white tabular-nums">
                            {active.predictedA} – {active.predictedB}
                          </span>
                        </div>
                        {OUTCOME_LABEL[activeOutcome] && (
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">סטטוס</span>
                            <span className="font-semibold" style={{ color: OUTCOME_LABEL[activeOutcome].color }}>
                              {OUTCOME_LABEL[activeOutcome].text}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs pt-1.5 mt-0.5 border-t border-white/10">
                          <span className="text-slate-400">ניקוד</span>
                          <span className="font-black tabular-nums" style={{ color: activeStyle.text }}>
                            {active.pointsEarned}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-500 text-xs text-center pt-1">ללא ניחוש</p>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs text-center">טרם הסתיים</p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rounds */}
      {heatmapData.map((round, ri) => (
        <div key={round.roundId}>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2 text-center">
            {round.roundName}
          </p>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }} dir="ltr">
            {round.matches.map((match, mi) => {
              const style  = getCellStyle(match);
              const isOpen = active?.matchId === match.matchId;
              return (
                <motion.button
                  key={match.matchId}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: ri * 0.04 + mi * 0.02, type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-9 h-9 rounded-lg select-none"
                  style={{
                    background: style.bg,
                    border: `1.5px solid ${style.border}`,
                    boxShadow: isOpen ? `0 0 14px ${style.border}` : 'none',
                  }}
                  onClick={() => setActive(isOpen ? null : { matchId: match.matchId, ...match })}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* סגירה בלחיצה על הרקע */}
      {active && (
        <div className="fixed inset-0 z-40" onClick={() => setActive(null)} />
      )}
    </div>
  );
}
