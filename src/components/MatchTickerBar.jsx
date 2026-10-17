import React, { useState, useEffect } from "react";
import { Match } from "@/api/entities";
import TeamFlag from "@/components/TeamFlag";

const SKEW = 12;
const UNSKEW = `skewX(${SKEW}deg)`;
// 3-letter club codes for the ticker; anything not listed falls back to its first letters
const CODES = {
  'AEK Athens': 'AEK', 'AS Roma': 'ROM', 'Arsenal': 'ARS', 'Aston villa': 'AVL', 'Atletico Madrid': 'ATM', 'Barcelona': 'BAR',
  'Bayern Munich': 'BAY', 'Bodø/Glimt': 'BOD', 'Club Brugge': 'BRU', 'Como': 'COM', 'Dortmund': 'BVB', 'Fenerbahce': 'FEN',
  'Feyenoord': 'FEY', 'Galatasaray': 'GAL', 'Inter': 'INT', 'LOSC LIlle': 'LIL', 'Lask': 'LAS', 'Leipzig': 'RBL',
  'Liverpool': 'LIV', 'Manchaster City': 'MCI', 'Manchester City': 'MCI', 'Manchester United': 'MUN', 'Napoli': 'NAP',
  'PSV': 'PSV', 'Paris': 'PSG', 'Porto': 'POR', 'RC Lens': 'RCL', 'Real Betis': 'BET', 'Real Madrid': 'RMA', 'Sabah FC': 'SAB',
  'Shakhtar Donetsk': 'SHA', 'Slavia Prague': 'SLA', 'Slovan Bratislava': 'SLO', 'Sporting Lisbon': 'SCP', 'Stuttgart': 'STU',
  'Viking': 'VIK', 'Villarreal': 'VIL',
};
const teamCode = (name = '') => CODES[name.trim()] || name.trim().replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();

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

  // Each match: three slanted plates — home code | time or score | away code
  const MatchItem = ({ match, i }) => {
    const time = new Date(match.match_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const plate = { display: 'flex', alignItems: 'center', gap: 5, padding: '0 9px', transform: `skewX(-${SKEW}deg)`, borderRadius: 2 };
    return (
      <div key={`${match.id}-${i}`} className="flex items-center flex-shrink-0" style={{ height: 24, gap: 2 }} dir="ltr">
        <span style={{ ...plate, background: 'rgba(255,255,255,0.07)', height: '100%' }}>
          <span className="flex items-center gap-[5px]" style={{ transform: UNSKEW }}>
            <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-[14px] h-[14px]" />
            <span className="text-white text-xs font-bold tracking-wide">{teamCode(match.team_a)}</span>
          </span>
        </span>
        <span style={{ ...plate, background: match.is_finished ? '#22d3ee' : '#4ade80', height: '100%' }}>
          <span className="text-xs font-bold tabular-nums" style={{ transform: UNSKEW, color: '#04201d' }}>
            {match.is_finished ? `${match.actual_score_a ?? '-'}-${match.actual_score_b ?? '-'}` : time}
          </span>
        </span>
        <span style={{ ...plate, background: 'rgba(255,255,255,0.07)', height: '100%' }}>
          <span className="flex items-center gap-[5px]" style={{ transform: UNSKEW }}>
            <span className="text-white text-xs font-bold tracking-wide">{teamCode(match.team_b)}</span>
            <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-[14px] h-[14px]" />
          </span>
        </span>
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
          border: 'none',
          background: 'none',
          overflow: 'hidden',
          paddingLeft: 22,
          position: 'relative',
          zIndex: 1,
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
      >
        {/* slanted tag with rounded corners: a skewed green plate that runs off the screen edge */}
        <span aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: 4, right: -12, background: '#4ade80', borderRadius: 6, transform: `skewX(-${SKEW}deg)`, transformOrigin: 'bottom left' }} />
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, color: '#04201d', whiteSpace: 'nowrap', userSelect: 'none' }}>
          <span style={{ fontSize: 12, fontWeight: 800 }}>{dateLabel}</span>
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
            style={{ position: 'absolute', top: 0, display: 'flex', alignItems: 'center', height: '100%', gap: '10px', whiteSpace: 'nowrap' }}
          >
            {matches.map((match, i) => (
              <React.Fragment key={`${match.id}-${i}`}>
                <MatchItem match={match} i={i} />
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
