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
  W: { bg: 'rgba(74,222,128,0.18)',  bd: 'rgba(74,222,128,0.55)',  tx: '#4ade80', so: '#22c55e' },
  D: { bg: 'rgba(250,204,21,0.18)',  bd: 'rgba(250,204,21,0.48)',  tx: '#facc15', so: '#ca8a04' },
  L: { bg: 'rgba(248,113,113,0.18)', bd: 'rgba(248,113,113,0.52)', tx: '#f87171', so: '#dc2626' },
};

function FormDots({ form }) {
  if (!form?.length) return <span className="text-[10px] text-slate-600">—</span>;
  return (
    <div className="flex flex-col gap-0.5">
      {form.map((item, i) => {
        const s = R[item.result];
        return (
          <div key={i} style={{ height: 13, width: 90, background: s.bg, border: `1px solid ${s.bd}`, borderRadius: 3, display: 'flex', alignItems: 'center', paddingLeft: 5, gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.so, flexShrink: 0 }} />
            <span style={{ fontSize: 8, color: s.tx, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.opponent}  {item.scored}:{item.conceded}
            </span>
          </div>
        );
      })}
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
