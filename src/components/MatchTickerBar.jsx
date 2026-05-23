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
        setDateLabel(formatDate(todays[0].match_date));
      } else {
        // אין משחקים היום — הצג 14/06 (יום הפתיחה)
        const opening = all
          .filter(m => localDateKey(new Date(m.match_date)) === '2026-06-14')
          .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
        if (opening.length > 0) {
          setMatches(opening);
          setDateLabel(formatDate(opening[0].match_date));
        }
      }
    }).catch(() => {});
  }, []);

  if (matches.length === 0) return null;

  // always duplicate for seamless loop
  const items = [...matches, ...matches];

  return (
    <div
      onClick={onClick}
      dir="rtl"
      className="fixed top-0 left-0 right-0 z-50 cursor-pointer overflow-hidden flex items-center"
      style={{ height: '36px', background: 'rgba(3,13,26,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(245,197,24,0.22)', boxShadow: '0 1px 20px rgba(245,197,24,0.06)' }}
    >
      {/* Fixed label — appears on the right in RTL */}
      <div className="flex-shrink-0 flex items-center gap-1.5 px-3 border-l border-amber-400/30 h-full">
        <span className="text-amber-400 text-[11px] font-bold whitespace-nowrap">{dateLabel}</span>
      </div>

      {/* Scrolling matches */}
      <div className="flex-1 overflow-hidden h-full relative" dir="ltr">
        <div
          className="ticker-track"
          style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '20px', paddingLeft: '12px', width: 'max-content' }}
        >
          {items.map((match, i) => {
            const time = new Date(match.match_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={`${match.id}-${i}`} className="flex items-center gap-1.5 flex-shrink-0" dir="ltr">
                <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-4 h-4" />
                <span className="text-white text-xs font-medium">{match.team_a}</span>
                {match.is_finished ? (
                  <span className="text-amber-400 text-xs font-bold mx-0.5">{match.actual_score_a ?? '-'} - {match.actual_score_b ?? '-'}</span>
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
      </div>

      <style>{`
        .ticker-track {
          animation: ticker-scroll linear infinite;
          animation-duration: ${Math.max(matches.length * 8, 16)}s;
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
