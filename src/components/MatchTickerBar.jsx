import React, { useState, useEffect } from "react";
import { Match } from "@/api/entities";
import TeamFlag from "@/components/TeamFlag";

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

export default function MatchTickerBar({ onClick }) {
  const [matches, setMatches] = useState([]);
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    Match.list().then(all => {
      const todayKey = localDateKey(new Date());
      const todays = all
        .filter(m => localDateKey(new Date(m.match_date)) === todayKey)
        .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));

      if (todays.length > 0) {
        setMatches(todays);
        setDateLabel('משחקי היום ' + formatDate(todays[0].match_date) + ' -');
      } else {
        const future = all
          .filter(m => new Date(m.match_date) > new Date())
          .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
        if (future.length === 0) return;
        const nearestKey = localDateKey(new Date(future[0].match_date));
        const nearest = future.filter(m => localDateKey(new Date(m.match_date)) === nearestKey);
        setMatches(nearest);
        setDateLabel('משחקי היום ' + formatDate(nearest[0].match_date) + ' -');
      }
    }).catch(() => {});
  }, []);

  if (matches.length === 0) return null;

  // only duplicate if more than 1 match (for seamless loop)
  const items = matches.length > 1 ? [...matches, ...matches] : matches;
  const shouldScroll = matches.length > 1;

  return (
    <div
      onClick={onClick}
      className="fixed top-0 left-0 right-0 z-50 cursor-pointer overflow-hidden flex items-center"
      style={{ height: '36px', background: 'rgba(2,8,23,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(245,197,24,0.25)' }}
    >
      {/* Fixed label */}
      <div className="flex-shrink-0 flex items-center gap-1.5 px-3 border-r border-amber-400/30 h-full">
        <span className="text-amber-400 text-[11px] font-bold whitespace-nowrap">{dateLabel}</span>
      </div>

      {/* Scrolling matches */}
      <div className="flex-1 overflow-hidden h-full relative">
        <div
          className={shouldScroll ? 'ticker-track' : ''}
          style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '20px', paddingLeft: '12px', width: shouldScroll ? 'max-content' : '100%' }}
        >
          {items.map((match, i) => {
            const time = new Date(match.match_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={`${match.id}-${i}`} className="flex items-center gap-1.5 flex-shrink-0">
                <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-4 h-4" />
                <span className="text-white text-xs font-medium">{match.team_a}</span>
                {match.is_finished ? (
                  <span className="text-amber-400 text-xs font-bold mx-0.5">{match.actual_score_a ?? '-'} - {match.actual_score_b ?? '-'}</span>
                ) : (
                  <span className="text-slate-400 text-xs mx-0.5">{time}</span>
                )}
                <span className="text-white text-xs font-medium">{match.team_b}</span>
                <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-4 h-4" />
                {matches.length > 1 && <span className="text-slate-600 text-xs mx-1">|</span>}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .ticker-track {
          animation: ticker-scroll linear infinite;
          animation-duration: ${Math.max(matches.length * 7, 18)}s;
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
