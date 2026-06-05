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

// Segmented control — no winner highlight
function WinRow({ teamA, teamB, probs }) {
  return (
    <div
      className="flex w-full rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.12)' }}
    >
      {[
        { l: teamA,  p: probs.home },
        { l: 'תיקו', p: probs.draw },
        { l: teamB,  p: probs.away },
      ].map(({ l, p }, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center py-1.5"
          style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
        >
          <span className="text-[9px] text-white/70 text-center px-1 w-full truncate text-center leading-tight">{l}</span>
          <span className="text-sm font-bold text-white leading-none">{p}%</span>
        </div>
      ))}
    </div>
  );
}

// Pill + blue neon glow
function ScoreRow({ topScores }) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {topScores.map(({ score, pct }) => (
        <div
          key={score}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.5)',
            boxShadow: '0 0 10px rgba(59,130,246,0.25)',
          }}
        >
          <span className="text-[11px] font-black text-white">{score}</span>
          <span className="text-[9px] text-blue-300/70">{pct}%</span>
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
