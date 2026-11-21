import OrbitSpinner from "@/components/OrbitSpinner";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Match } from "@/api/entities";
import { useSheetDrag, SheetGrip } from "@/components/ui/SheetGrip";

// The summary before sending (design 391): over a slow aurora, each match a slanted card of
// diagonal-reflection glass (option 354) that opens from its middle, the clubs' thick crests large at
// its ends, and the predicted score in a taller glass block standing out of it, in the score picker's
// digit font with rolling digits. Days split by a line with the weekday and the date (option 397),
// scrolling with the cards.

const SKEW = -13;
const CREST = 72;
const BLOCK_W = 86, BLOCK_H = 62, CARD_H = 54;
const DIGIT = 27;
const ROW_H = Math.round(DIGIT * 1.15);
const ease = [0.23, 1, 0.32, 1];
const at = (i, plus = 0) => 0.15 + i * 0.045 + plus; // the row's own moment
const CARD_GLASS = 'linear-gradient(135deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,.02) 40%,rgba(255,255,255,.1) 60%,rgba(255,255,255,.02) 100%)';
const BLOCK_GLASS = 'linear-gradient(135deg,rgba(255,255,255,.4) 0%,rgba(255,255,255,.08) 45%,rgba(255,255,255,.22) 60%,rgba(255,255,255,.06) 100%), rgba(16,32,76,.82)';
// a thick crest: five one-pixel steps in deep navy, then a soft shadow
const THICK = 'drop-shadow(1px 1px 0 #0a1636) drop-shadow(1px 1px 0 #08122c) drop-shadow(1px 1px 0 #060e22) drop-shadow(1px 1px 0 #050b1c) drop-shadow(1px 1px 0 #040918) drop-shadow(4px 6px 6px rgba(0,0,0,.7))';

// Rolling digits (odometer): a column 0–9 behind a one-digit window slides up until the predicted
// number stops in it, slowing down at the end. Numbers past 9 just show as they are.
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

function Crest({ logo, side }) {
  if (!logo) return null;
  const b = side === 'b';
  return <img src={logo} alt="" className="absolute object-contain pointer-events-none"
    style={{ width: CREST, height: CREST, top: '50%', marginTop: -CREST / 2, [b ? 'right' : 'left']: -6, opacity: 0.8, transform: `rotate(${b ? 3 : -3}deg)`, filter: THICK }} />;
}

function Row({ match, prediction, i }) {
  return (
    // ltr: the home club on the left, as on the match card
    <div dir="ltr" className="relative mx-auto" style={{ width: '88%', height: BLOCK_H }}
      aria-label={`${match.team_a} ${prediction.predicted_score_a} – ${prediction.predicted_score_b} ${match.team_b}`}>
      {/* the card, opening from its middle */}
      <motion.div initial={{ scaleX: 0, opacity: 0.4 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ delay: at(i), duration: 0.7, ease }}
        className="absolute inset-x-0 overflow-hidden"
        style={{ top: (BLOCK_H - CARD_H) / 2, height: CARD_H, skewX: SKEW, borderRadius: 10, background: `${CARD_GLASS}, rgba(30,48,96,.35)`, border: '1px solid rgba(255,255,255,.16)' }}>
        <div className="absolute inset-0" style={{ transform: `skewX(${-SKEW}deg)` }}>
          <Crest logo={match.team_a_logo} side="a" /><Crest logo={match.team_b_logo} side="b" />
        </div>
        {/* a light running once across it */}
        <motion.span initial={{ x: '-150%' }} animate={{ x: '650%' }} transition={{ delay: at(i, 0.75), duration: 1.1, ease: 'easeInOut' }}
          className="absolute pointer-events-none" style={{ top: -10, bottom: -10, left: 0, width: 70, zIndex: 4, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)', skewX: -20 }} />
      </motion.div>
      {/* the score, taller than the card, standing out of it */}
      <motion.div initial={{ opacity: 0, scale: 0.6, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: at(i, 0.45), type: 'spring', stiffness: 380, damping: 20 }}
        className="absolute top-0 z-[2] grid place-items-center"
        style={{ left: '50%', height: BLOCK_H, width: BLOCK_W, marginLeft: -BLOCK_W / 2, skewX: SKEW, borderRadius: 12, background: BLOCK_GLASS, border: '1px solid rgba(255,255,255,.4)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55), 0 10px 22px rgba(0,0,0,.5)' }}>
        <span className="inline-flex items-center tabular-nums" style={{ transform: `skewX(${-SKEW}deg)`, gap: 5, color: '#fff', fontFamily: 'var(--num-font)', fontWeight: 800, fontSize: DIGIT, letterSpacing: 1 }}>
          <RollDigit value={prediction.predicted_score_a} delay={at(i, 0.3)} />
          <span>-</span>
          <RollDigit value={prediction.predicted_score_b} delay={at(i, 0.42)} />
        </span>
      </motion.div>
    </div>
  );
}

const fade = (dir) => ({ flex: 1, height: 1.5, background: `linear-gradient(${dir},transparent,rgba(226,232,240,.7))` });
function DayLine({ label }) {
  const [weekday, date = ''] = label.split(', ');
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      <div style={fade('90deg')} />
      <span className="flex items-baseline" style={{ gap: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: '#93c5fd' }}>{weekday}</span>
        <span dir="ltr" style={{ fontFamily: 'var(--num-font)', fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: 1 }}>{date}</span>
      </span>
      <div style={fade('270deg')} />
    </div>
  );
}

const AURORA_CSS = '@keyframes ps-aurora{0%{transform:translate(-10%,-5%) rotate(0deg)}50%{transform:translate(8%,6%) rotate(12deg)}100%{transform:translate(-10%,-5%) rotate(0deg)}}';

export default function PredictionSummary({ predictions, roundId, matches: given, onConfirm, onCancel, saving }) {
  // the round page passes the matches it already has: the sheet opens at its full height at once (it
  // used to rise short, with a loader, and then jump up when its own fetch came back)
  const sortByDate = (list) => [...list].sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
  const [matches, setMatches] = useState(() => (given?.length ? sortByDate(given) : []));
  const [loadingMatches, setLoadingMatches] = useState(() => !given?.length);
  const { controls: grip, sheetProps } = useSheetDrag(() => { if (!saving) onCancel(); });

  useEffect(() => {
    if (given?.length) return;
    setLoadingMatches(true);
    Match.filter({ round_id: roundId })
      .then(fresh => {
        setMatches(sortByDate(fresh));
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
      style={{ background: 'rgba(2,6,18,0.9)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <motion.div
        {...sheetProps}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        dir="rtl"
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col"
        style={{
          background: '#050a1c',
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
        {/* a slow aurora behind everything */}
        <style>{AURORA_CSS}</style>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{ position: 'absolute', width: '140%', height: '70%', left: '-20%', top: '5%', background: 'radial-gradient(closest-side,rgba(59,130,246,.45),transparent), radial-gradient(closest-side at 70% 60%,rgba(45,212,191,.35),transparent)', animation: 'ps-aurora 14s ease-in-out infinite', willChange: 'transform' }} />
          <div style={{ position: 'absolute', width: '120%', height: '60%', left: '-10%', bottom: '-10%', background: 'radial-gradient(closest-side,rgba(139,92,246,.35),transparent)', animation: 'ps-aurora 18s ease-in-out infinite reverse', willChange: 'transform' }} />
        </div>

        {/* Drag handle – mobile */}
        <SheetGrip controls={grip} onClose={() => { if (!saving) onCancel(); }} className="relative z-[1] pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </SheetGrip>

        {/* Header */}
        <div className="relative z-[1] flex flex-col items-center justify-center px-5 pt-3 pb-3 flex-shrink-0 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-lg font-extrabold leading-tight text-white">סיכום הניחושים</h2>
        </div>

        {/* the cards */}
        <div className="relative z-[1] overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {loadingMatches ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <OrbitSpinner size={36} />
              <span className="text-white/40 text-sm">טוען משחקים...</span>
            </div>
          ) : (
            <div className="px-3.5 pb-3">
              {byDay.map(({ key, label, items }) => (
                <div key={key}>
                  <div style={{ padding: '10px 0 8px' }}>
                    <DayLine label={label} />
                  </div>
                  <div className="grid mb-1.5" style={{ gap: 10 }}>
              {items.map(({ match, prediction, i }) => (
                <Row key={match.id} match={match} prediction={prediction} i={i} />
              ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-[1] px-4 pt-3 pb-6 flex-shrink-0 flex flex-col items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
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
