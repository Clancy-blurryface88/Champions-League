import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Fetches the official starting lineup once UEFA publishes it (usually
// ~45-60 min before kickoff) and renders it under the score-prediction
// chips. Renders nothing at all until then — no placeholder/skeleton.
export default function MatchLineups({ teamA, teamB }) {
  const [lineups, setLineups] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLineups(null);
    fetch(`/api/uefa-lineups?homeTeam=${encodeURIComponent(teamA)}&awayTeam=${encodeURIComponent(teamB)}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d.success && d.lineups) setLineups(d.lineups); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [teamA, teamB]);

  if (!lineups) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mt-4 flex flex-col items-center gap-2"
    >
      <span className="text-[10px] font-semibold tracking-wide text-yellow-400">ההרכבים פורסמו</span>
      <div className="flex gap-4 justify-center w-full">
        <TeamLineupColumn label={teamA} teamLineup={lineups.homeTeam} />
        <TeamLineupColumn label={teamB} teamLineup={lineups.awayTeam} />
      </div>
    </motion.div>
  );
}

function TeamLineupColumn({ label, teamLineup }) {
  return (
    <div className="flex-1 min-w-0 max-w-[160px]">
      <p className="text-[10px] font-semibold text-slate-400 mb-1.5 text-center truncate">{label}</p>
      <div className="space-y-1">
        {teamLineup?.field?.map((p) => (
          <div key={p.player.id} className="flex items-center gap-1.5 text-[11px] text-white/85">
            <span className="text-slate-500 w-4 text-center flex-shrink-0 tabular-nums">{p.jerseyNumber}</span>
            <span className="truncate">{p.player.internationalName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
