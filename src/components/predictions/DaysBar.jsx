import React, { useLayoutEffect, useRef, useState } from 'react';

// The round's days as one bar cut on diagonals with a slit between the days: each day shows its
// date with the month as large background numerals and its weekday. The active day is filled
// royal blue; every day has a thin outline (along the diagonal too) so the unselected one still
// reads as a button; a fine line under the bar separates it from the matches. Days run left to
// right in date order. Switching days fades the lettering over 0.3s.

const NUM = { fontFamily: 'var(--num-font)' };
const KAR = { fontFamily: 'Karantina, Heebo, sans-serif', fontWeight: 700 };
const SLANT = 3;   // how far (in % of the bar) each cut leans
const GAP = 1.2;   // half the slit's width, in %
const R = 12;      // the bar's outer corner radius, px
const H = 56;      // the bar's height, px
const FADE = 'opacity 0.3s ease, transform 0.3s ease, color 0.3s ease';

// outline colours per look: [active, inactive]
export const FRAMES = {
  white: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.4)'],
  sky: ['#93c5fd', 'rgba(96,165,250,0.55)'],
  mixed: ['rgba(255,255,255,0.9)', 'rgba(96,165,250,0.55)'],
  none: [null, null],
};
// the line under the bar
export const SEPARATORS = {
  line: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.55) 20%,rgba(255,255,255,0.85) 50%,rgba(96,165,250,0.55) 80%,transparent)',
  blue: 'linear-gradient(90deg,transparent,#3b82f6 25%,#3b82f6 75%,transparent)',
  none: null,
};

const weekday = (key) => new Intl.DateTimeFormat('he-IL', { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${key}T12:00:00Z`)).replace('יום ', '');

// the outline of segment `f` (0 = leftmost) of `n`, in px, with the bar's outer corners rounded
function segmentPath(f, n, W) {
  const s = (W * SLANT) / 100, g = (W * GAP) / 100, cut = (j) => (W * j) / n;
  const first = f === 0, last = f === n - 1;
  const lt = cut(f) - s + g, lb = cut(f) + s + g, rt = cut(f + 1) - s - g, rb = cut(f + 1) + s - g;
  let d = first ? `M ${R} 0` : `M ${lt} 0`;
  d += last ? ` L ${W - R} 0 A ${R} ${R} 0 0 1 ${W} ${R} L ${W} ${H - R} A ${R} ${R} 0 0 1 ${W - R} ${H}` : ` L ${rt} 0 L ${rb} ${H}`;
  d += first ? ` L ${R} ${H} A ${R} ${R} 0 0 1 0 ${H - R} L 0 ${R} A ${R} ${R} 0 0 1 ${R} 0 Z` : ` L ${lb} ${H} Z`;
  return d;
}

export default function DaysBar({ dateKeys, activeKey, onPick, tabRef, stripRef, frame = 'white', separator = 'line' }) {
  const n = dateKeys.length;
  const big = n <= 2;
  const box = useRef(null);
  const [W, setW] = useState(0);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return undefined;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el); setW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);
  const [lineOn, lineOff] = FRAMES[frame] || FRAMES.mixed;
  const sep = SEPARATORS[separator];
  return (
    <div ref={stripRef}>
      <div ref={box} className="relative" style={{ height: H }}>
        {W > 0 && dateKeys.map((key, f) => {
          const on = key === activeKey;
          const left = (100 * f) / n, width = 100 / n;
          const [, mm, dd] = key.split('-');
          const leftSide = f < n / 2;   // days on the bar's left half put the date at the left edge
          const path = segmentPath(f, n, W);
          const line = on ? lineOn : lineOff;
          return (
            <button
              key={key}
              ref={(el) => tabRef?.(key, el)}
              onClick={() => onPick(key)}
              className="absolute inset-0"
              style={{ clipPath: `path('${path}')`, background: on ? '#1d4ed8' : 'rgba(255,255,255,0.06)', transition: 'background 0.25s' }}
              aria-pressed={on}
            >
              {/* the outline; the path clips its outer half, so it reads as an inner stroke */}
              {line && <svg className="pointer-events-none absolute inset-0" width={W} height={H}><path d={path} fill="none" stroke={line} strokeWidth="3" style={{ transition: 'stroke 0.25s' }} /></svg>}
              {/* the date with its month, large, cut by the bar's outer edge; the weekday toward the slit */}
              <span
                dir="ltr"
                className="pointer-events-none absolute top-1/2 font-black leading-none"
                style={{ ...NUM, fontSize: big ? 54 : 38, color: on ? '#fff' : '#94a3b8', opacity: on ? 0.32 : 0.16, transform: `translateY(-50%) scale(${on ? 1 : 0.94})`, transformOrigin: leftSide ? 'left center' : 'right center', transition: FADE, ...(leftSide ? { left: `calc(${left}% - 4px)` } : { right: `calc(${100 - left - width}% - 4px)` }) }}
              >{Number(dd)}.{mm}</span>
              <span
                className="pointer-events-none absolute top-1/2 -translate-y-[46%] leading-none"
                style={{ ...KAR, fontSize: big ? 34 : 24, color: on ? '#fff' : '#94a3b8', opacity: on ? 1 : 0.6, transition: FADE, ...(leftSide ? { right: `calc(${100 - left - width}% + 22px)` } : { left: `calc(${left}% + 22px)` }) }}
              >{weekday(key)}</span>
            </button>
          );
        })}
      </div>
      {sep && <div className="mt-2.5 h-px" style={{ background: sep, boxShadow: '0 0 6px rgba(96,165,250,0.35)' }} />}
    </div>
  );
}
