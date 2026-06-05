import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function calculateProbabilities(scoreOdds) {
  if (!scoreOdds || typeof scoreOdds !== 'object') return null;

  let home = 0, draw = 0, away = 0;

  for (const [score, odds] of Object.entries(scoreOdds)) {
    if (score === 'other' || !odds || odds <= 0) continue;
    const prob = 1 / odds;
    const [h, a] = score.split(':').map(Number);
    if (isNaN(h) || isNaN(a)) continue;
    if (h > a) home += prob;
    else if (h < a) away += prob;
    else draw += prob;
  }

  const total = home + draw + away;
  if (total === 0) return null;

  const homePct = Math.round((home / total) * 100);
  const drawPct = Math.round((draw / total) * 100);
  const awayPct = 100 - homePct - drawPct;

  return { home: homePct, draw: drawPct, away: awayPct };
}

function getTopScores(scoreOdds, n = 5) {
  if (!scoreOdds || typeof scoreOdds !== 'object') return [];

  const entries = Object.entries(scoreOdds)
    .filter(([score, odds]) => score !== 'other' && odds > 0)
    .map(([score, odds]) => ({ score, prob: 1 / odds }));

  const total = entries.reduce((s, e) => s + e.prob, 0);
  if (total === 0) return [];

  return entries
    .sort((a, b) => b.prob - a.prob)
    .slice(0, n)
    .map(e => ({ score: e.score, pct: Math.round((e.prob / total) * 100) }));
}

// Segmented control — Liquid Glass
function WinRow({ teamA, teamB, probs }) {
  return (
    <div
      className="flex w-full rounded-[16px] overflow-hidden relative"
      style={{
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 2px 0 rgba(255,255,255,0.50)',
      }}
    >
      {[
        { l: teamA,  p: probs.home },
        { l: 'תיקו', p: probs.draw },
        { l: teamB,  p: probs.away },
      ].map(({ l, p }, i) => (
        <div
          key={i}
          className="relative flex-1 flex flex-col items-center py-2"
          style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}
        >
          <span className="text-[9px] font-medium text-center px-1 w-full truncate leading-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>{l}</span>
          <span className="text-sm font-bold leading-none" style={{ color: '#ffffff' }}>{p}%</span>
        </div>
      ))}
    </div>
  );
}

// Score pills — Liquid Glass
function ScoreRow({ topScores }) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {topScores.map(({ score, pct }) => (
        <div
          key={score}
          className="relative overflow-hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(32px) saturate(160%)',
            WebkitBackdropFilter: 'blur(32px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.45)',
          }}
        >
          <span className="relative text-[11px] font-black text-white">{score}</span>
          <span className="relative text-[9px]" style={{ color: 'rgba(255,255,255,0.50)' }}>{pct}%</span>
        </div>
      ))}
    </div>
  );
}

export default function MatchOddsBar({ scoreOdds, teamA, teamB }) {
  const probs     = useMemo(() => calculateProbabilities(scoreOdds), [scoreOdds]);
  const topScores = useMemo(() => getTopScores(scoreOdds, 5), [scoreOdds]);
  const [open, setOpen] = useState(false);

  if (!probs) return null;

  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 transition-opacity hover:opacity-80"
      >
        <span className="text-[10px] font-semibold tracking-wide text-yellow-400">תחזית המשחק</span>
        <ChevronDown
          className="w-3 h-3 text-yellow-400 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden w-full flex flex-col gap-2"
          >
            <WinRow teamA={teamA} teamB={teamB} probs={probs} />
            {topScores.length > 0 && <ScoreRow topScores={topScores} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
