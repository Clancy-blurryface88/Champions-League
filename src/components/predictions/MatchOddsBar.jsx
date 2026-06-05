import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

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

  return {
    home: Math.round((home / total) * 100),
    draw: Math.round((draw / total) * 100),
    away: 100 - Math.round((home / total) * 100) - Math.round((draw / total) * 100),
  };
}

export default function MatchOddsBar({ scoreOdds, teamA, teamB }) {
  const probs = useMemo(() => calculateProbabilities(scoreOdds), [scoreOdds]);

  if (!probs) return null;

  const winner = probs.home > probs.away && probs.home > probs.draw ? 'home'
    : probs.away > probs.home && probs.away > probs.draw ? 'away'
    : 'draw';

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">הסתברויות לפי אודס</span>
      </div>

      {/* Bar */}
      <div className="relative h-2.5 w-full rounded-full overflow-hidden flex bg-slate-800/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${probs.home}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="h-full rounded-l-full"
          style={{ background: 'linear-gradient(90deg,#22c55e,#16a34a)' }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${probs.draw}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          className="h-full"
          style={{ background: '#eab308' }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${probs.away}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-r-full"
          style={{ background: 'linear-gradient(90deg,#3b82f6,#2563eb)' }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-[10px] font-medium">
        <div className={`flex flex-col items-start gap-0.5 ${winner === 'home' ? 'text-green-400' : 'text-slate-400'}`}>
          <span className="truncate max-w-[70px]">{teamA}</span>
          <span className={`text-sm font-black ${winner === 'home' ? 'text-green-300' : ''}`}>{probs.home}%</span>
        </div>
        <div className={`flex flex-col items-center gap-0.5 ${winner === 'draw' ? 'text-yellow-400' : 'text-slate-400'}`}>
          <span>תיקו</span>
          <span className={`text-sm font-black ${winner === 'draw' ? 'text-yellow-300' : ''}`}>{probs.draw}%</span>
        </div>
        <div className={`flex flex-col items-end gap-0.5 ${winner === 'away' ? 'text-blue-400' : 'text-slate-400'}`}>
          <span className="truncate max-w-[70px] text-right">{teamB}</span>
          <span className={`text-sm font-black ${winner === 'away' ? 'text-blue-300' : ''}`}>{probs.away}%</span>
        </div>
      </div>
    </div>
  );
}
