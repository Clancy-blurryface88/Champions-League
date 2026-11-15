import React, { useLayoutEffect, useRef, useState } from 'react';

// The round's bar under the round title: the league-table button on the left, then the round's
// days left to right in date order, as one bar cut by slits leaning like "/" (as the rest of the
// app). Each part has a thin outline along its cuts too. TABLE looks like an unselected day with blue lettering;
// a day shows its date large (day of month) with the month under it in English capitals; the
// active day is filled royal blue. All lettering is the stencil number font with a long diagonal
// shadow. Switching days fades colours over 0.25s.

const NUM = { fontFamily: 'var(--num-font)', fontWeight: 900 };
const H = 46;        // bar height, px
const LEAN = 18;     // how far each cut leans over the bar's height, px ("/": top further right)
const GAP = 10;      // slit width, px
const R = 0;         // outer corners: square
const MONTHS = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const longShadow = (a) => [1, 2, 3, 4, 5].map((k) => `${k}px ${k}px 0 rgba(2,6,23,${(a - k * 0.07).toFixed(2)})`).join(',');
const FADE = 'background 0.25s, color 0.25s, opacity 0.25s';

// kept for older design demos that import them
export const FRAMES = {
  white: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.4)'],
  sky: ['#93c5fd', 'rgba(96,165,250,0.55)'],
  mixed: ['rgba(255,255,255,0.9)', 'rgba(96,165,250,0.55)'],
  none: [null, null],
};
export const SEPARATORS = {
  line: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.55) 20%,rgba(255,255,255,0.85) 50%,rgba(96,165,250,0.55) 80%,transparent)',
  blue: 'linear-gradient(90deg,transparent,#3b82f6 25%,#3b82f6 75%,transparent)',
  none: null,
};

// the outline of part i (left to right) of a bar cut at `cuts` (px), outer corners rounded
function partPath(i, cuts, W) {
  const s = LEAN / 2, g = GAP / 2, arc = (x, y) => `A ${R} ${R} 0 0 1 ${x} ${y}`;
  const first = i === 0, last = i === cuts.length - 1;
  const c0 = first ? 0 : cuts[i - 1], c1 = cuts[i];
  let d = first ? `M ${R} 0` : `M ${c0 + s + g} 0`;
  d += last ? ` L ${W - R} 0 ${arc(W, R)} L ${W} ${H - R} ${arc(W - R, H)}` : ` L ${c1 + s - g} 0 L ${c1 - s - g} ${H}`;
  d += first ? ` L ${R} ${H} ${arc(0, H - R)} L 0 ${R} ${arc(R, 0)} Z` : ` L ${c0 - s + g} ${H} Z`;
  return d;
}

export default function DaysBar({ dateKeys, activeKey, onPick, onTable, tabRef, stripRef }) {
  const box = useRef(null);
  const [W, setW] = useState(0);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return undefined;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el); setW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);
  // part widths: TABLE 0.7, each day 1
  const weights = [0.7, ...dateKeys.map(() => 1)];
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const cuts = weights.map((w) => { acc += w; return (W * acc) / total; });
  // the text area of part i: clear of the slanted cuts on both sides
  const area = (i) => {
    const x0 = i ? cuts[i - 1] + LEAN / 2 + 4 : 0, x1 = i < cuts.length - 1 ? cuts[i] - LEAN / 2 - 4 : W;
    return { left: x0, width: x1 - x0 };
  };
  const part = (i, { on, fill, line, label, onClick, ref, children, pressed }) => {
    const d = partPath(i, cuts, W);
    return (
      <button key={i} ref={ref} onClick={onClick} aria-label={label} aria-pressed={pressed}
        className="absolute inset-0" style={{ clipPath: `path('${d}')`, background: fill, transition: FADE }}>
        {/* the outline; the path clips its outer half, so it reads as an inner stroke */}
        <svg className="pointer-events-none absolute inset-0" width={W} height={H}><path d={d} fill="none" stroke={line} strokeWidth="2" style={{ transition: 'stroke 0.25s' }} /></svg>
        <span className="pointer-events-none absolute inset-y-0 flex items-center justify-center" style={area(i)}>{children}</span>
      </button>
    );
  };
  return (
    <div ref={stripRef}>
      <div ref={box} dir="ltr" className="relative" style={{ height: H }}>
        {W > 0 && <>
          {part(0, {
            fill: 'rgba(255,255,255,0.06)', line: 'rgba(255,255,255,0.4)', label: 'טבלת הליגה', onClick: onTable,
            children: <span style={{ ...NUM, fontSize: 17, letterSpacing: '0.08em', color: '#60a5fa', lineHeight: 1, textShadow: longShadow(0.5) }}>TABLE</span>,
          })}
          {dateKeys.map((key, f) => {
            const on = key === activeKey;
            const [, mm, dd] = key.split('-');
            return part(f + 1, {
              on, pressed: on,
              fill: on ? '#1d4ed8' : 'rgba(255,255,255,0.06)', line: on ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
              onClick: () => onPick(key), ref: (el) => tabRef?.(key, el),
              children: (
                <span className="flex flex-col items-center" style={{ gap: 2 }}>
                  <span style={{ ...NUM, fontSize: 24, lineHeight: 1, color: on ? '#fff' : '#94a3b8', opacity: on ? 1 : 0.7, textShadow: longShadow(0.5), transition: FADE }}>{Number(dd)}</span>
                  <span style={{ ...NUM, fontSize: 9, letterSpacing: '0.18em', lineHeight: 1, color: on ? '#fff' : '#94a3b8', opacity: on ? 0.8 : 0.45, textShadow: '1px 1px 0 rgba(2,6,23,0.5)', transition: FADE }}>{MONTHS[Number(mm)]}</span>
                </span>
              ),
            });
          })}
        </>}
      </div>
    </div>
  );
}
