import React, { useState, useEffect, useRef } from "react";
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

// Auto-scrolling strip that can also be swiped with a finger. It moves leftwards on
// its own; a swipe shifts it and, on release, keeps gliding with the finger's speed
// (decaying), then the auto-scroll takes over again. A tap (no real drag) still
// triggers onClick. Hover pauses it for a mouse only — a finger has no "leave",
// so treating a touch as hover froze the strip on phones.
const DRAG_THRESHOLD = 6; // px before a touch counts as a swipe rather than a tap
const FRICTION = 3.2;     // fling decay per second (higher = stops sooner)

function SwipeTicker({ count, onClick, children }) {
  const vpRef = useRef(null);
  const trackRef = useRef(null);
  const x = useRef(null);       // current offset (px)
  const drag = useRef(null);    // { startX, startOffset, moved, lastX, lastT, v }
  const fling = useRef(0);      // px/s left over from a swipe
  const hover = useRef(false);

  useEffect(() => {
    const vp = vpRef.current, tr = trackRef.current;
    if (!vp || !tr) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (x.current == null) x.current = vp.clientWidth;
    let raf, last = performance.now();
    const tick = (t) => {
      const dt = Math.min(64, t - last) / 1000; last = t;
      const vw = vp.clientWidth, tw = tr.scrollWidth;
      // enter at the right edge, leave fully on the left, in max(n*4.5, 10)s
      const speed = (vw + tw) / Math.max(count * 4.5, 10);
      if (!drag.current) {
        if (Math.abs(fling.current) > 20) {
          x.current += fling.current * dt;
          fling.current *= Math.exp(-FRICTION * dt);
        } else {
          fling.current = 0;
          if (!hover.current && !reduce) x.current -= speed * dt;
        }
      }
      // wrap around in both directions so a drag never runs out of matches
      // (a drag in progress is shifted by the same amount so it stays continuous)
      const wrap = x.current < -tw ? vw + tw : x.current > vw ? -(vw + tw) : 0;
      if (wrap) { x.current += wrap; if (drag.current) drag.current.startOffset += wrap; }
      tr.style.transform = `translateX(${x.current}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  const onDown = (e) => {
    fling.current = 0;
    drag.current = { startX: e.clientX, startOffset: x.current, moved: false, lastX: e.clientX, lastT: performance.now(), v: 0 };
    vpRef.current?.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) d.moved = true;
    if (d.moved) x.current = d.startOffset + dx;
    // finger speed, smoothed, for the fling on release
    const now = performance.now(), dt = (now - d.lastT) / 1000;
    if (dt > 0) { d.v = 0.75 * ((e.clientX - d.lastX) / dt) + 0.25 * d.v; d.lastX = e.clientX; d.lastT = now; }
  };
  const onUp = () => {
    const d = drag.current; drag.current = null;
    if (!d) return;
    if (!d.moved) { onClick?.(); return; }
    // a finger held still before lifting means "stop here", not "fling"
    fling.current = performance.now() - d.lastT < 80 ? Math.max(-2500, Math.min(2500, d.v)) : 0;
  };

  return (
    <div ref={vpRef} className="flex-1 overflow-hidden h-full relative select-none" dir="ltr"
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => (drag.current = null)}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') hover.current = true; }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') hover.current = false; }}
      style={{ cursor: 'grab', touchAction: 'pan-y', WebkitTapHighlightColor: 'transparent' }}>
      <div ref={trackRef}
        style={{ position: 'absolute', top: 0, display: 'flex', alignItems: 'center', height: '100%', gap: '10px', whiteSpace: 'nowrap', willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
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

  // Touches on the bar stay here: Layout's page-wide swipe (right swipe → leaderboard)
  // would otherwise fire on a ticker swipe and re-render the page on every move.
  const keepTouch = (e) => e.stopPropagation();

  return (
    <div
      dir="rtl"
      onTouchStart={keepTouch} onTouchMove={keepTouch} onTouchEnd={keepTouch}
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
        /* Multiple matches — auto-scrolling, swipeable, tappable */
        <SwipeTicker count={matches.length} onClick={onClick}>
          {matches.map((match, i) => (
            <React.Fragment key={`${match.id}-${i}`}>
              <MatchItem match={match} i={i} />
            </React.Fragment>
          ))}
        </SwipeTicker>
      )}
    </div>
  );
}
