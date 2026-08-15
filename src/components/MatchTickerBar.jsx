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

  const [isUpcoming, setIsUpcoming] = useState(false);

  useEffect(() => {
    const load = () => {
      Match.list().then(all => {
        const now = new Date();
        const todayKey = localDateKey(now);
        const todays = all
          .filter(m => localDateKey(new Date(m.match_date)) === todayKey)
          .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));

        if (todays.length > 0) {
          setMatches(todays);
          setDateLabel(formatDate(todays[0].match_date));
          setIsUpcoming(false);
          return;
        }

        // No games today — fall back to the next upcoming match day
        const future = all
          .filter(m => new Date(m.match_date) > now)
          .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));

        if (future.length > 0) {
          const nextKey = localDateKey(new Date(future[0].match_date));
          const nextDay = future.filter(m => localDateKey(new Date(m.match_date)) === nextKey);
          setMatches(nextDay);
          setDateLabel(formatDate(nextDay[0].match_date));
          setIsUpcoming(true);
        } else {
          setMatches([]);
        }
      }).catch(() => {});
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  if (matches.length === 0) return null;

  const single = matches.length === 1;

  const MatchItem = ({ match, i }) => {
    const time = new Date(match.match_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    return (
      <div key={`${match.id}-${i}`} className="flex items-center gap-1.5 flex-shrink-0" dir="ltr">
        <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-4 h-4" />
        <span className="text-white text-xs font-medium">{match.team_a}</span>
        {match.is_finished ? (
          <span
            className="text-xs font-bold mx-0.5"
            style={{
              background: 'linear-gradient(90deg, #facc15, #f97316)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >{match.actual_score_a ?? '-'} - {match.actual_score_b ?? '-'}</span>
        ) : (
          <span
            className="text-xs font-bold mx-0.5"
            style={{
              background: 'linear-gradient(90deg, #4ade80, #16a34a)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >{time}</span>
        )}
        <span className="text-white text-xs font-medium">{match.team_b}</span>
        <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div
      dir="rtl"
      className="fixed top-0 left-0 right-0 z-50 flex items-center"
      style={{ height: '36px', background: 'rgba(3,13,26,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(9, 122, 220,0.22)', boxShadow: '0 1px 20px rgba(9, 122, 220,0.06)' }}
    >
      {/* Date button */}
      <button
        type="button"
        onClick={onClick}
        style={{
          flexShrink: 0,
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          minWidth: 64,
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          borderLeft: '1px solid rgba(9, 122, 220,0.3)',
          position: 'relative',
          zIndex: 1,
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
          <span style={{ color: '#ffffff', fontSize: 8, fontWeight: 700, whiteSpace: 'nowrap', userSelect: 'none' }}>
            {isUpcoming ? 'בקרוב' : 'משחקי היום'}
          </span>
          <span
            style={{
              fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', userSelect: 'none',
              background: 'linear-gradient(90deg, #4ade80, #16a34a)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >{dateLabel}</span>
        </span>
      </button>

      {/* Single match — centered, no animation */}
      {single ? (
        <div onClick={onClick} className="flex-1 flex items-center justify-center h-full px-3"
          style={{ cursor: 'pointer', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
          <MatchItem match={matches[0]} i={0} />
        </div>
      ) : (
        /* Multiple matches — scrolling, tappable */
        <div onClick={onClick} className="flex-1 overflow-hidden h-full relative" dir="ltr"
          style={{ cursor: 'pointer', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
          <div
            className="ticker-track"
            style={{ position: 'absolute', top: 0, display: 'flex', alignItems: 'center', height: '100%', gap: '20px', whiteSpace: 'nowrap' }}
          >
            {matches.map((match, i) => (
              <React.Fragment key={`${match.id}-${i}`}>
                <MatchItem match={match} i={i} />
                {i < matches.length - 1 && <span className="text-slate-600 text-xs mx-1">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .ticker-track {
          animation: ticker-scroll linear infinite;
          animation-duration: ${Math.max(matches.length * 10, 20)}s;
        }
        @keyframes ticker-scroll {
          from { transform: translateX(100vw); }
          to   { transform: translateX(-100%); }
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
