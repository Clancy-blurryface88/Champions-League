import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatchOddsBar from './MatchOddsBar';
import CrowdWisdomStats from './CrowdWisdomStats';

function getTeamForm(allMatches, teamName) {
  const played = allMatches
    .filter(m =>
      m.is_finished &&
      m.actual_score_a != null &&
      m.actual_score_b != null &&
      (m.team_a === teamName || m.team_b === teamName)
    )
    .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));

  let totalGoals = 0;
  let totalConceded = 0;
  const results = played.map(m => {
    const isHome  = m.team_a === teamName;
    const scored   = isHome ? Number(m.actual_score_a) : Number(m.actual_score_b);
    const conceded = isHome ? Number(m.actual_score_b) : Number(m.actual_score_a);
    totalGoals += scored;
    totalConceded += conceded;
    const result = scored > conceded ? 'W' : scored < conceded ? 'L' : 'D';
    return { result, scored, conceded, opponent: isHome ? m.team_b : m.team_a };
  });

  return {
    last5: results.slice(-5),
    avgGoals: played.length > 0 ? (totalGoals / played.length).toFixed(1) : null,
    avgConceded: played.length > 0 ? (totalConceded / played.length).toFixed(1) : null,
    played: played.length,
  };
}

const R = {
  W: { bg: 'rgba(74,222,128,0.18)',  border: 'rgba(74,222,128,0.55)',  text: '#4ade80' },
  D: { bg: 'rgba(250,204,21,0.18)',  border: 'rgba(250,204,21,0.48)',  text: '#facc15' },
  L: { bg: 'rgba(248,113,113,0.18)', border: 'rgba(248,113,113,0.52)', text: '#f87171' },
};

const RESULT_HE = { W: 'ניצחון', D: 'תיקו', L: 'הפסד' };

function FormDots({ form }) {
  const [openSlot, setOpenSlot] = useState(null); // { idx, x, y, s, item }

  useEffect(() => {
    if (!openSlot) return;
    const close = () => setOpenSlot(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openSlot]);

  if (!form?.length) return <span className="text-[10px] text-slate-600">—</span>;

  return (
    <div className="flex gap-[5px]">
      {form.map((item, i) => {
        const s = R[item.result];
        const isOpen = openSlot?.idx === i;
        return (
          <div key={i}>
            <div
              onClick={e => {
                e.stopPropagation();
                if (isOpen) { setOpenSlot(null); return; }
                const rect = e.currentTarget.getBoundingClientRect();
                const POPUP_H = 95;
                const spaceBelow = window.innerHeight - rect.bottom;
                const below = spaceBelow >= POPUP_H + 12;
                setOpenSlot({
                  idx: i,
                  x: rect.left + rect.width / 2,
                  y: below ? rect.bottom + 8 : rect.top - POPUP_H - 8,
                  below,
                  s,
                  item,
                });
              }}
              style={{
                width: 20, height: 20,
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isOpen ? `0 0 0 2px ${s.border}` : 'none',
                transition: 'box-shadow 0.15s ease',
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 800, color: s.text, lineHeight: 1 }}>
                {item.result}
              </span>
            </div>
          </div>
        );
      })}

      {/* Popup rendered with position:fixed to escape overflow:hidden parents */}
      {openSlot && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            left: openSlot.x,
            top: openSlot.y,
            transform: 'translateX(-50%)',
            background: 'rgba(8,15,30,0.97)',
            border: `1px solid ${openSlot.s.border}`,
            borderRadius: 10,
            padding: '8px 12px',
            whiteSpace: 'nowrap',
            zIndex: 9999,
            textAlign: 'center',
            boxShadow: `0 8px 24px rgba(0,0,0,0.7), 0 0 0 1px ${openSlot.s.border}`,
            minWidth: 90,
            pointerEvents: 'none',
          }}
        >
          {/* Arrow — points toward the dot */}
          <div style={{
            position: 'absolute',
            ...(openSlot.below
              ? { top: -5, borderBottom: 'none', borderRight: 'none' }
              : { bottom: -5, borderTop: 'none', borderLeft: 'none' }),
            left: '50%',
            marginLeft: -4,
            width: 8, height: 8,
            background: 'rgba(8,15,30,0.97)',
            border: `1px solid ${openSlot.s.border}`,
            transform: 'rotate(45deg)',
          }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: openSlot.s.text, marginBottom: 4 }}>
            {RESULT_HE[openSlot.item.result]}
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 4, letterSpacing: 1 }}>
            {openSlot.item.scored}:{openSlot.item.conceded}
          </div>
          <div style={{ fontSize: 9, color: '#94a3b8' }}>
            נגד {openSlot.item.opponent}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchArenaSection({ match, isLocked, allMatches, loading }) {
  const formA = useMemo(() => getTeamForm(allMatches, match.team_a), [allMatches, match.team_a]);
  const formB = useMemo(() => getTeamForm(allMatches, match.team_b), [allMatches, match.team_b]);
  const hasForm = formA.played > 0 || formB.played > 0;

  // Show odds section after form section has entered
  const [showOdds, setShowOdds] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowOdds(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <div className="pt-2 space-y-3">
        {/* Last 5 matches form — enters first */}
        {loading ? (
          <div className="flex justify-center py-1">
            <span className="text-[10px] text-slate-600 animate-pulse">טוען...</span>
          </div>
        ) : hasForm ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-start justify-between gap-2 px-0.5"
          >
            {/* Team A form */}
            <div className="flex flex-col items-start gap-1">
              <FormDots form={formA.last5} />
              {formA.avgGoals != null && (
                <span className="text-[10px] font-medium flex items-center">
                  <span>⚽</span>
                  <span style={{
                    background: 'linear-gradient(135deg, #bbf7d0, #4ade80)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginLeft: 2,
                  }}>{formA.avgGoals}</span>
                  <span className="text-slate-600 mx-1">/</span>
                  <span style={{ color: '#f87171' }}>✕ {formA.avgConceded}</span>
                </span>
              )}
            </div>

{/* Team B form */}
            <div className="flex flex-col items-end gap-1">
              <FormDots form={formB.last5} />
              {formB.avgGoals != null && (
                <span className="text-[10px] font-medium flex items-center">
                  <span>⚽</span>
                  <span style={{
                    background: 'linear-gradient(135deg, #bbf7d0, #4ade80)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginLeft: 2,
                  }}>{formB.avgGoals}</span>
                  <span className="text-slate-600 mx-1">/</span>
                  <span style={{ color: '#f87171' }}>✕ {formB.avgConceded}</span>
                </span>
              )}
            </div>
          </motion.div>
        ) : null}

        {/* Odds Bar — fades in after form section, no y-jump */}
        <AnimatePresence>
          {showOdds && match.score_odds && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            >
              <MatchOddsBar
                scoreOdds={match.score_odds}
                teamA={match.team_a}
                teamB={match.team_b}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crowd Wisdom — only when locked, unchanged design */}
        {isLocked && showOdds && (
          <CrowdWisdomStats
            matchId={match.id}
            teamA={match.team_a}
            teamB={match.team_b}
          />
        )}
      </div>
    </motion.div>
  );
}
