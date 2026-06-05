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

function firstWord(name) {
  return name ? name.split(' ')[0] : name;
}

function GlassBadge({ label, pct }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
      style={{
        background: 'rgba(0,0,0,0)',
        border: '0.5px solid rgba(255,255,255,0.12)',
      }}
    >
      <span className="text-[9px] font-medium text-white/80 text-center leading-tight">{label}</span>
      <span className="text-sm font-bold text-white/60 leading-none">{pct}%</span>
    </div>
  );
}

export default function MatchOddsBar({ scoreOdds, teamA, teamB }) {
  const probs = useMemo(() => calculateProbabilities(scoreOdds), [scoreOdds]);

  if (!probs) return null;

  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <span className="text-[10px] font-semibold tracking-wide text-yellow-400">
        תחזית המשחק
      </span>
      <div className="flex items-center justify-center gap-2">
        <GlassBadge label={firstWord(teamA)} pct={probs.home} />
        <GlassBadge label="תיקו" pct={probs.draw} />
        <GlassBadge label={firstWord(teamB)} pct={probs.away} />
      </div>
    </div>
  );
}
