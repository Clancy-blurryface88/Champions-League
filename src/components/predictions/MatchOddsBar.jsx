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

function GlassBadge({ label, pct }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl flex-1"
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 2px 12px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      <span className="text-[10px] font-medium text-white/60 text-center leading-tight">{label}</span>
      <span className="text-base font-black text-white leading-none">{pct}%</span>
    </div>
  );
}

function DrawBadge({ pct }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1d4ed8 100%)',
        boxShadow: '0 0 14px rgba(59,130,246,0.4)',
      }}
    >
      <span className="text-[10px] font-semibold text-white/80 leading-tight">תיקו</span>
      <span className="text-sm font-black text-white leading-none">{pct}%</span>
    </div>
  );
}

export default function MatchOddsBar({ scoreOdds, teamA, teamB }) {
  const probs = useMemo(() => calculateProbabilities(scoreOdds), [scoreOdds]);

  if (!probs) return null;

  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <span className="text-[10px] font-semibold text-white/40 tracking-wide">תחזית המשחק</span>
      <DrawBadge pct={probs.draw} />
      <div className="flex items-stretch gap-2 w-full">
        <GlassBadge label={teamA} pct={probs.home} />
        <GlassBadge label={teamB} pct={probs.away} />
      </div>
    </div>
  );
}
