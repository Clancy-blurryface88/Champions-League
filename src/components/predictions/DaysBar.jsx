import React from 'react';

// The round's days as one bar cut on diagonals with a slit between the days (design 42 of the
// days-strip options): each day shows its date with the month as large background numerals and
// its weekday; the active day's lettering is filled silver, the others are dimmed; switching days
// fades the lettering over 0.3s. Works for any number of days (two is the usual round).

const NUM = { fontFamily: 'var(--num-font)' };
const KAR = { fontFamily: 'Karantina, Heebo, sans-serif', fontWeight: 700 };
const SILVER = {
  backgroundImage: 'linear-gradient(180deg,#ffffff,#94a3b8 55%,#e2e8f0)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.35))',
};
const DIM = { color: '#475569' };
const SLANT = 3;   // how far (in % of the bar) each cut leans
const GAP = 1.2;   // half the slit's width, in %
const FADE = 'opacity 0.3s ease, transform 0.3s ease';   // the switch: the new day brightens and grows a touch

const weekday = (key) => new Intl.DateTimeFormat('he-IL', { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${key}T12:00:00Z`)).replace('יום ', '');

// the polygon of the segment whose left edge is cut `fromLeft` (0-based, counted from the left)
function segment(fromLeft, n) {
  const cut = (j) => (100 * j) / n;   // the j-th cut, at the bar's middle height
  const leftTop = fromLeft === 0 ? 0 : cut(fromLeft) - SLANT + GAP;
  const leftBot = fromLeft === 0 ? 0 : cut(fromLeft) + SLANT + GAP;
  const rightTop = fromLeft === n - 1 ? 100 : cut(fromLeft + 1) - SLANT - GAP;
  const rightBot = fromLeft === n - 1 ? 100 : cut(fromLeft + 1) + SLANT - GAP;
  return `polygon(${leftTop}% 0%, ${rightTop}% 0%, ${rightBot}% 100%, ${leftBot}% 100%)`;
}

export default function DaysBar({ dateKeys, activeKey, onPick, tabRef, stripRef }) {
  const n = dateKeys.length;
  const big = n <= 2;
  return (
    <div ref={stripRef} className="relative h-14 overflow-hidden rounded-xl">
      {dateKeys.map((key, i) => {
        const on = key === activeKey;
        const fromLeft = n - 1 - i;           // the first day sits on the right
        const left = (100 * fromLeft) / n, width = 100 / n;
        const [, mm, dd] = key.split('-');
        const rightSide = fromLeft >= n / 2;   // days on the bar's right half put the date at the right edge
        return (
          <button
            key={key}
            ref={(el) => tabRef?.(key, el)}
            onClick={() => onPick(key)}
            className="absolute inset-0"
            style={{ clipPath: segment(fromLeft, n), background: on ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.025)', transition: 'background 0.25s' }}
            aria-pressed={on}
          >
            {/* the date with its month, large, cut by the bar's outer edge; the weekday toward the slit */}
            <span
              dir="ltr"
              className="pointer-events-none absolute top-1/2 font-black leading-none"
              style={{ ...NUM, fontSize: big ? 54 : 38, ...(on ? SILVER : DIM), opacity: on ? 0.5 : 0.14, transform: `translateY(-50%) scale(${on ? 1 : 0.94})`, transformOrigin: rightSide ? 'right center' : 'left center', transition: FADE, ...(rightSide ? { right: `calc(${100 - left - width}% - 4px)` } : { left: `calc(${left}% - 4px)` }) }}
            >{Number(dd)}.{mm}</span>
            <span
              className="pointer-events-none absolute top-1/2 -translate-y-[46%] leading-none"
              style={{ ...KAR, fontSize: big ? 34 : 24, ...(on ? SILVER : DIM), opacity: on ? 1 : 0.55, transition: FADE, ...(rightSide ? { left: `calc(${left}% + 22px)` } : { right: `calc(${100 - left - width}% + 22px)` }) }}
            >{weekday(key)}</span>
          </button>
        );
      })}
    </div>
  );
}
