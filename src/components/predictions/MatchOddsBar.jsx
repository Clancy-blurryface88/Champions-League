import React, { useMemo, useState, useEffect } from 'react';

function useCountUp(target, duration = 750) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return count;
}

function AnimatedPct({ value, className, style }) {
  const count = useCountUp(value);
  return <span className={className} style={style}>{count}%</span>;
}

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
          <span className="text-[9px] text-white/70 text-center px-1 w-full truncate leading-tight">{l}</span>
          <AnimatedPct value={p} className="text-sm font-bold text-white leading-none" />
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
          <AnimatedPct value={pct} className="text-[9px] text-blue-300/70" />
        </div>
      ))}
    </div>
  );
}

export default function MatchOddsBar({ scoreOdds, teamA, teamB }) {
  const probs     = useMemo(() => calculateProbabilities(scoreOdds), [scoreOdds]);
  const topScores = useMemo(() => getTopScores(scoreOdds, 5), [scoreOdds]);

  if (!probs) return null;

  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <span className="text-[10px] font-semibold tracking-wide text-yellow-400">תחזית המשחק</span>
      <WinRow teamA={teamA} teamB={teamB} probs={probs} />
      {topScores.length > 0 && <ScoreRow topScores={topScores} />}
    </div>
  );
}
