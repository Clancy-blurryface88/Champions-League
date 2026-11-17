import React, { useLayoutEffect, useRef, useState } from 'react';

// The match card's bottom buttons as one bar split by gentle slanted breaks with a slit between
// them, set inside the card: "1 X 2" on the left, the match arena (a narrow lemon-yellow part
// with a drawn pitch) in the middle, "BETS" (everyone's predictions) on the right. Each part is outlined in a darker
// shade of its own colour. Both labels share one font, size and weight.

const H = 36, SLANT = -10, GAP = 6, R = 12, STROKE = 1.75; // negative SLANT: the cuts lean like "/", as the rest of the app
const ODDS = { label: '1 X 2', fill: 'linear-gradient(90deg,#3b82f6,#1d4ed8)', line: '#1e3a8a', w: 1.4 };
const PREDS = { label: 'BETS', fill: 'linear-gradient(90deg,#16a34a,#15803d)', line: '#14532d', w: 1.4 };
// labels in the stencil number font with a long diagonal shadow
const LONG_SHADOW = [1, 2, 3, 4, 5].map((k) => `${k}px ${k}px 0 rgba(2,6,23,${(0.55 - k * 0.07).toFixed(2)})`).join(',');
const LABEL = { fontFamily: 'var(--num-font)', fontSize: 17, fontWeight: 900, letterSpacing: '0.06em', lineHeight: 1, textShadow: LONG_SHADOW };

// the match arena: lemon yellow, light at the top and deeper at the bottom
const ARENA = { arena: true, label: 'זירת המשחק', fill: 'linear-gradient(180deg,#fefce8,#fde047 55%,#eab308)', line: '#a16207', icon: '#422006', w: 0.55 };

// a small football pitch: touchlines, halfway line, centre circle, both boxes
const PitchIcon = ({ c }) => (
  <svg width="24" height="17" viewBox="0 0 24 17" fill="none" stroke={c} strokeWidth="1.6" aria-hidden>
    <rect x="1" y="1" width="22" height="15" rx="1.5" /><line x1="12" y1="1" x2="12" y2="16" /><circle cx="12" cy="8.5" r="3" />
    <rect x="1" y="5" width="3.5" height="7" /><rect x="19.5" y="5" width="3.5" height="7" />
  </svg>
);

// the outline of part i of `parts` (left to right) in px, with the bar's outer corners rounded
function shape(i, parts, W) {
  const tot = parts.reduce((a, p) => a + p.w, 0);
  const cut = (k) => (W * parts.slice(0, k + 1).reduce((a, p) => a + p.w, 0)) / tot;
  const s = SLANT / 2, g = GAP / 2, arc = (x, y) => `A ${R} ${R} 0 0 1 ${x} ${y}`;
  const first = i === 0, last = i === parts.length - 1;
  const c0 = first ? 0 : cut(i - 1), c1 = cut(i);
  let d = first ? `M ${R} 0` : `M ${c0 - s + g} 0`;
  d += last ? ` L ${W - R} 0 ${arc(W, R)} L ${W} ${H - R} ${arc(W - R, H)}` : ` L ${c1 - s - g} 0 L ${c1 + s - g} ${H}`;
  d += first ? ` L ${R} ${H} ${arc(0, H - R)} L 0 ${R} ${arc(R, 0)} Z` : ` L ${c0 + s + g} ${H} Z`;
  return { d, mid: (c0 + c1) / 2 };
}

// arenaPx: width of the middle (arena) part in px; the two side parts share the rest equally
function BarActions({ onOdds, onPredictions, onArena, arenaPx = 66 }) {
  const box = useRef(null);
  const [W, setW] = useState(0);
  const [down, setDown] = useState(null);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return undefined;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el); setW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);
  // the arena's visible width is its share of the bar less the gap at each cut
  const arenaW = arenaPx && W > arenaPx ? ((ODDS.w + PREDS.w) * (arenaPx + GAP)) / (W - arenaPx - GAP) : ARENA.w;
  const parts = [{ ...ODDS, on: onOdds }, { ...ARENA, w: arenaW, on: onArena }, { ...PREDS, on: onPredictions }];
  return (
    <div ref={box} className="relative" style={{ height: H }}>
      {W > 0 && parts.map((b, k) => {
        const { d, mid } = shape(k, parts, W);
        return (
          <button
            key={b.label}
            aria-label={b.arena ? b.label : undefined}
            onClick={(e) => { e.stopPropagation(); b.on?.(); }}
            onPointerDown={() => setDown(k)} onPointerUp={() => setDown(null)} onPointerLeave={() => setDown(null)}
            className="absolute inset-0"
            style={{ clipPath: `path('${d}')`, background: b.fill, transform: down === k ? 'scale(0.97)' : 'none', transformOrigin: `${(mid / W) * 100}% 50%`, transition: 'transform 0.12s' }}
          >
            {/* the outline; the path clips its outer half, so it reads as an inner stroke */}
            <svg className="pointer-events-none absolute inset-0" width={W} height={H}><path d={d} fill="none" stroke={b.line} strokeWidth={STROKE * 2} /></svg>
            <span dir={b.label === ODDS.label ? 'ltr' : 'rtl'} className="pointer-events-none absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-white" style={{ ...LABEL, left: mid }}>
              {b.arena ? <PitchIcon c={b.icon} /> : b.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// The same three buttons as one glass pill built like the match card's countdown (CountdownSwap): the
// app's slant, a soft light at the top, and thin slanted dividers that fade out at both ends. Used on the
// stories test rounds.
const PILL_DIVIDER = { width: 1.5, height: 26, background: 'linear-gradient(transparent, rgba(255,255,255,0.45), transparent)', transform: 'skewX(12deg) rotate(12deg)', flexShrink: 0 };
function PillActions({ onOdds, onPredictions, onArena }) {
  const [down, setDown] = useState(null);
  const items = [
    { k: 'odds', on: onOdds, flex: 1, node: <span dir="ltr" style={{ ...LABEL, fontSize: 16, color: '#93c5fd' }}>1 X 2</span> },
    { k: 'arena', on: onArena, flex: 0.62, label: 'זירת המשחק', node: <PitchIcon c="#facc15" /> },
    { k: 'bets', on: onPredictions, flex: 1, node: <span style={{ ...LABEL, fontSize: 16, color: '#86efac' }}>BETS</span> },
  ];
  return (
    <div dir="ltr" className="relative flex items-center overflow-hidden" style={{ width: '92%', maxWidth: 300, height: 44, transform: 'skewX(-12deg)', borderRadius: 16,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.05)), rgba(5,10,18,0.35)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)' }} />
      {items.map((b, i) => (
        <React.Fragment key={b.k}>
          {i > 0 && <span style={PILL_DIVIDER} />}
          <button type="button" aria-label={b.label} onClick={(e) => { e.stopPropagation(); b.on?.(); }}
            onPointerDown={() => setDown(i)} onPointerUp={() => setDown(null)} onPointerLeave={() => setDown(null)}
            className="relative h-full grid place-items-center" style={{ flex: b.flex, background: down === i ? 'rgba(255,255,255,0.08)' : 'transparent', transition: 'background .12s' }}>
            <span style={{ transform: 'skewX(12deg)', display: 'inline-flex' }}>{b.node}</span>
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

// pill: the glass-pill version (stories test rounds); otherwise the coloured bar
export default function CardActions({ pill = false, ...props }) {
  return pill ? <PillActions {...props} /> : <BarActions {...props} />;
}
