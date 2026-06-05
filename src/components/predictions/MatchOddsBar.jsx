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

function abbr(name) {
  if (!name) return '';
  return name.slice(0, 2).toLowerCase();
}

function Badge({ label, pct, color }) {
  const configs = {
    green: {
      bg: 'rgba(20,50,30,0.85)',
      border: 'rgba(74,222,128,0.45)',
      text: '#4ade80',
      glow: 'rgba(74,222,128,0.2)',
    },
    yellow: {
      bg: 'rgba(50,40,10,0.85)',
      border: 'rgba(234,179,8,0.45)',
      text: '#eab308',
      glow: 'rgba(234,179,8,0.2)',
    },
  };

  const c = configs[color] || configs.green;

  return (
    <div
      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 10px ${c.glow}`,
        color: c.text,
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="opacity-70">{label}</span>
      <span className="font-black">{pct}%</span>
    </div>
  );
}

export default function MatchOddsBar({ scoreOdds, teamA, teamB }) {
  const probs = useMemo(() => calculateProbabilities(scoreOdds), [scoreOdds]);

  if (!probs) return null;

  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <span className="text-[10px] font-semibold text-slate-400 tracking-wide">תחזית ניצחון</span>
      <div className="flex items-center justify-center gap-2">
        <Badge label={abbr(teamA)} pct={probs.home} color="green" />
        <Badge label="תיקו" pct={probs.draw} color="yellow" />
        <Badge label={abbr(teamB)} pct={probs.away} color="green" />
      </div>
    </div>
  );
}
