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

function GlassBadge({ label, pct }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl flex-1"
      style={{
        background: 'rgba(0,0,0,0)',
        border: '0.5px solid rgba(255,255,255,0.12)',
        minWidth: 0,
      }}
    >
      <span className="text-[9px] font-medium text-white/80 text-center leading-tight px-1 w-full truncate text-center">{label}</span>
      <span className="text-sm font-bold text-white/60 leading-none">{pct}%</span>
    </div>
  );
}

export default function MatchOddsBar({ scoreOdds, teamA, teamB }) {
  const probs = useMemo(() => calculateProbabilities(scoreOdds), [scoreOdds]);
  const [open, setOpen] = useState(false);

  if (!probs) return null;

  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 transition-opacity hover:opacity-80"
      >
        <span className="text-[10px] font-semibold tracking-wide text-yellow-400">
          תחזית המשחק
        </span>
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
            className="overflow-hidden w-full"
          >
            <div className="flex items-stretch gap-2 w-full">
              <GlassBadge label={teamA} pct={probs.home} />
              <GlassBadge label="תיקו" pct={probs.draw} />
              <GlassBadge label={teamB} pct={probs.away} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
