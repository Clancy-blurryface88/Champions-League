import React, { useMemo, useState, useEffect } from 'react';

const STEP_MS = 2250; // 2.25s per counter

function useCountUp(target, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let startTime = null;
    let animId;
    const timer = setTimeout(() => {
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / STEP_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(animId); };
  }, [target, delay]);
  return count;
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
  return { home: homePct, draw: drawPct, away: 100 - homePct - drawPct };
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

// Sequential: home → draw → away, each 4s
function WinRow({ teamA, teamB, probs }) {
  const cols = [
    { label: teamA,  p: probs.home, delay: 0 },
    { label: 'תיקו', p: probs.draw, delay: STEP_MS },
    { label: teamB,  p: probs.away, delay: STEP_MS * 2 },
  ];
  return (
    <div
      className="flex w-full rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.12)' }}
    >
      {cols.map(({ label, p, delay }, i) => {
        const count = useCountUp(p, delay); // eslint-disable-line react-hooks/rules-of-hooks
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center py-1.5"
            style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
          >
            <span className="text-[9px] text-white/70 text-center px-1 w-full truncate leading-tight">{label}</span>
            <span className="text-sm font-bold text-white leading-none">{count}%</span>
          </div>
        );
      })}
    </div>
  );
}

// Pills: sorted descending (highest left, lowest right).
// Appear right-to-left (lowest first) after all 3 counters finish, stagger 700ms.
function ScoreRow({ topScores }) {
  const sorted = useMemo(
    () => [...topScores].sort((a, b) => b.pct - a.pct), // descending → highest left
    [topScores]
  );
  const n = sorted.length;
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const startAfter = STEP_MS * 3;
    const stagger = 700;
    const timers = sorted.map((_, i) =>
      setTimeout(() => setVisibleCount(v => v + 1), startAfter + i * stagger)
    );
    return () => timers.forEach(clearTimeout);
  }, [n]);

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {sorted.map(({ score, pct }, i) => {
        // rightmost pill (index n-1) appears first: visible when n - visibleCount <= i
        const isVisible = i >= n - visibleCount;
        return (
          <div
            key={score}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.5)',
              boxShadow: '0 0 10px rgba(59,130,246,0.25)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            <span className="text-[11px] font-black text-white">{score}</span>
            <span className="text-[9px] text-blue-300/70">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

export default function MatchOddsBar({ scoreOdds, teamA, teamB }) {
  const probs     = useMemo(() => calculateProbabilities(scoreOdds), [scoreOdds]);
  const topScores = useMemo(() => getTopScores(scoreOdds, 5), [scoreOdds]);

  if (!probs) return null;

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <span className="text-[10px] font-semibold tracking-wide text-yellow-400">תחזית המשחק</span>
      <WinRow teamA={teamA} teamB={teamB} probs={probs} />
      {topScores.length > 0 && <ScoreRow topScores={topScores} />}
    </div>
  );
}
