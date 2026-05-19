import React, { useState, useEffect } from "react";
import { Match } from "@/api/entities";
import TeamFlag from "@/components/TeamFlag";

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

export default function MatchTickerBar({ onClick }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    Match.list().then(all => {
      const todayKey = localDateKey(new Date());
      const todays = all.filter(m => localDateKey(new Date(m.match_date)) === todayKey);
      setMatches(todays);
    }).catch(() => {});
  }, []);

  if (matches.length === 0) return null;

  const items = [...matches, ...matches]; // duplicate for seamless loop

  return (
    <div
      onClick={onClick}
      className="fixed top-0 left-0 right-0 z-30 cursor-pointer overflow-hidden"
      style={{ height: '36px', background: 'rgba(2,8,23,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(245,197,24,0.2)' }}
    >
      <div className="ticker-track flex items-center h-full gap-6 px-4" style={{ width: 'max-content' }}>
        {items.map((match, i) => {
          const time = new Date(match.match_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
          return (
            <div key={`${match.id}-${i}`} className="flex items-center gap-1.5 flex-shrink-0">
              <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-4 h-4" />
              <span className="text-white text-xs font-medium">{match.team_a}</span>
              {match.is_finished ? (
                <span className="text-amber-400 text-xs font-bold mx-0.5">{match.score_a ?? '-'} - {match.score_b ?? '-'}</span>
              ) : (
                <span className="text-slate-400 text-xs mx-0.5">{time}</span>
              )}
              <span className="text-white text-xs font-medium">{match.team_b}</span>
              <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-4 h-4" />
              <span className="text-slate-600 text-xs mx-1">|</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .ticker-track {
          animation: ticker-scroll linear infinite;
          animation-duration: ${Math.max(matches.length * 6, 20)}s;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
