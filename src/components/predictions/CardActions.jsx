import React, { useLayoutEffect, useRef, useState } from 'react';

// The match card's two bottom buttons ("1 X 2" on the left, "ניחושים" on the right) as a pair
// split by a gentle slanted break with a slit between them, set inside the card. Each button is
// outlined in a darker shade of its own colour. Both labels share one font, size and weight.

const H = 40, SLANT = 10, GAP = 6, R = 12, STROKE = 1.75;
const BUTTONS = [
  { label: '1 X 2', fill: 'linear-gradient(90deg,#3b82f6,#1d4ed8)', line: '#1e3a8a' },
  { label: 'ניחושים', fill: 'linear-gradient(90deg,#16a34a,#15803d)', line: '#14532d' },
];
const LABEL = { fontFamily: 'inherit', fontSize: 16, fontWeight: 600, lineHeight: 1 };

// the outline of one button in px; side 0 = left, 1 = right
function shape(side, W) {
  const mid = W / 2, g = GAP / 2, arc = (x, y) => `A ${R} ${R} 0 0 1 ${x} ${y}`;
  return side === 0
    ? `M ${R} 0 L ${mid + SLANT / 2 - g} 0 L ${mid - SLANT / 2 - g} ${H} L ${R} ${H} ${arc(0, H - R)} L 0 ${R} ${arc(R, 0)} Z`
    : `M ${mid + SLANT / 2 + g} 0 L ${W - R} 0 ${arc(W, R)} L ${W} ${H - R} ${arc(W - R, H)} L ${mid - SLANT / 2 + g} ${H} Z`;
}

export default function CardActions({ onOdds, onPredictions }) {
  const box = useRef(null);
  const [W, setW] = useState(0);
  const [down, setDown] = useState(null);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return undefined;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el); setW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);
  const actions = [onOdds, onPredictions];
  return (
    <div ref={box} className="relative" style={{ height: H }}>
      {W > 0 && BUTTONS.map((b, k) => {
        const d = shape(k, W);
        return (
          <button
            key={b.label}
            onClick={(e) => { e.stopPropagation(); actions[k]?.(); }}
            onPointerDown={() => setDown(k)} onPointerUp={() => setDown(null)} onPointerLeave={() => setDown(null)}
            className="absolute inset-0"
            style={{ clipPath: `path('${d}')`, background: b.fill, transform: down === k ? 'scale(0.97)' : 'none', transformOrigin: k ? '75% 50%' : '25% 50%', transition: 'transform 0.12s' }}
          >
            {/* the outline; the path clips its outer half, so it reads as an inner stroke */}
            <svg className="pointer-events-none absolute inset-0" width={W} height={H}><path d={d} fill="none" stroke={b.line} strokeWidth={STROKE * 2} /></svg>
            <span dir={k ? 'rtl' : 'ltr'} className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-white" style={{ ...LABEL, left: k ? '75%' : '25%' }}>{b.label}</span>
          </button>
        );
      })}
    </div>
  );
}
