import React, { useMemo } from 'react';

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

export default function MatchOddsBar({ scoreOdds, teamA, teamB }) {
  const probs = useMemo(() => calculateProbabilities(scoreOdds), [scoreOdds]);

  if (!probs) return null;

  const favorite =
    probs.home >= probs.away && probs.home >= probs.draw
      ? { label: teamA, pct: probs.home }
      : probs.away >= probs.home && probs.away >= probs.draw
      ? { label: teamB, pct: probs.away }
      : { label: 'תיקו', pct: probs.draw };

  return (
    <div className="flex justify-center mt-3">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-white"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1d4ed8 100%)',
          boxShadow: '0 0 12px rgba(59,130,246,0.35)',
        }}
      >
        <span className="opacity-70">פייבוריט:</span>
        <span>{favorite.label}</span>
        <span className="font-black">{favorite.pct}%</span>
      </div>
    </div>
  );
}
