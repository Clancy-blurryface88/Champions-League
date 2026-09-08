import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Fetches the official starting lineup once UEFA publishes it (usually
// ~45-60 min before kickoff) and renders it under the score-prediction
// chips, as a pitch graphic (jerseys placed by UEFA's own formation
// coordinates) instead of a plain list. Renders nothing at all until
// then — no placeholder/skeleton.
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
      className="mt-4 flex flex-col items-center gap-2 w-full"
    >
      <div className="w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)' }} />
      <span className="text-[10px] font-semibold tracking-wide text-yellow-400">ההרכבים פורסמו</span>
      <PitchLineup home={lineups.homeTeam} away={lineups.awayTeam} />
    </motion.div>
  );
}

function isLightColor(hex) {
  if (!hex) return false;
  const c = hex.replace('#', '');
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function coachName(team) {
  return team?.coaches?.[0]?.person?.translations?.name?.EN || null;
}

function TeamHeader({ team, coach }) {
  return (
    <div className="flex items-center justify-center gap-2 py-0.5">
      {team?.logoUrl && (
        <img
          src={team.logoUrl}
          alt=""
          className="w-6 h-6 flex-shrink-0"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      <div className="text-center">
        <p className="text-[12px] font-bold text-white leading-tight">{team?.internationalName}</p>
        {coach && <p className="text-[9px] text-slate-400 leading-tight">מאמן: {coach}</p>}
      </div>
    </div>
  );
}

function Jersey({ color, number, isCaptain }) {
  const dark = isLightColor(color);
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 21, height: 21 }}>
      <svg viewBox="0 0 100 100" width="21" height="21">
        <polygon
          points="35,10 50,20 65,10 80,10 95,25 95,40 78,32 78,90 22,90 22,32 5,40 5,25 20,10"
          fill={color || '#64748b'}
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="3"
        />
      </svg>
      <span
        className="absolute font-black tabular-nums"
        style={{ fontSize: 8, color: dark ? '#111827' : '#fff', top: '48%', transform: 'translateY(-50%)' }}
      >
        {number}
      </span>
      {isCaptain && (
        <span
          className="absolute flex items-center justify-center rounded-full bg-white text-black font-black"
          style={{ width: 8, height: 8, fontSize: 6, top: -1, right: -1, lineHeight: 1 }}
        >
          C
        </span>
      )}
    </div>
  );
}

// Kept narrow (well under the tightest real row spacing — 5-across
// defensive lines sit ~20% of pitch width apart) so a marker's jersey/name
// never reaches into its neighbor's slot.
function PlayerMarker({ entry, shirtColor, topPct, leftPct }) {
  return (
    <div
      className="absolute flex flex-col items-center gap-0.5"
      style={{ top: `${topPct}%`, left: `${leftPct}%`, transform: 'translate(-50%, -50%)', width: 42 }}
    >
      <Jersey color={shirtColor} number={entry.jerseyNumber} isCaptain={entry.type === 'CAPTAIN'} />
      <span
        className="text-[7px] text-white text-center leading-tight truncate w-full"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
      >
        {entry.player?.internationalName}
      </span>
    </div>
  );
}

// UEFA's fieldCoordinate is on a ~0-1000 scale, own-half-relative for both
// teams (y=50 is each team's own goal line, y=800 is near the halfway
// line) — so the away team's y is mirrored to sit in the bottom half of a
// single shared pitch graphic, while home's is used as-is in the top half.
function homeTopPct(y) { return (y / 1000) * 48 + 2; }
function awayTopPct(y) { return 100 - ((y / 1000) * 48 + 2); }
function leftPct(x) { return x / 10; }

function PitchLineup({ home, away }) {
  return (
    <div className="w-full">
      <TeamHeader team={home?.team} coach={coachName(home)} />
      <div
        className="relative w-full mt-1.5 rounded-lg overflow-hidden"
        style={{
          paddingBottom: '138%',
          background: 'linear-gradient(180deg, #0b1730, #0d1c40)',
          border: '1px solid rgba(56,189,248,0.35)',
        }}
      >
        <div className="absolute left-0 right-0" style={{ top: '50%', height: 1, background: 'rgba(56,189,248,0.35)' }} />
        <div
          className="absolute rounded-full"
          style={{ top: '50%', left: '50%', width: '30%', paddingBottom: '30%', transform: 'translate(-50%, -50%)', border: '1px solid rgba(56,189,248,0.35)' }}
        />
        <div
          className="absolute"
          style={{ top: 0, left: '25%', width: '50%', height: '14%', borderLeft: '1px solid rgba(56,189,248,0.3)', borderRight: '1px solid rgba(56,189,248,0.3)', borderBottom: '1px solid rgba(56,189,248,0.3)' }}
        />
        <div
          className="absolute"
          style={{ bottom: 0, left: '25%', width: '50%', height: '14%', borderLeft: '1px solid rgba(56,189,248,0.3)', borderRight: '1px solid rgba(56,189,248,0.3)', borderTop: '1px solid rgba(56,189,248,0.3)' }}
        />

        {home?.field?.map((p) => (
          <PlayerMarker
            key={p.player.id}
            entry={p}
            shirtColor={home.shirtColor}
            topPct={homeTopPct(p.fieldCoordinate.y)}
            leftPct={leftPct(p.fieldCoordinate.x)}
          />
        ))}
        {away?.field?.map((p) => (
          <PlayerMarker
            key={p.player.id}
            entry={p}
            shirtColor={away.shirtColor}
            topPct={awayTopPct(p.fieldCoordinate.y)}
            leftPct={leftPct(p.fieldCoordinate.x)}
          />
        ))}
      </div>
      <TeamHeader team={away?.team} coach={coachName(away)} />
    </div>
  );
}
