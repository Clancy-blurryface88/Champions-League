import React, { useLayoutEffect, useRef, useState } from 'react';

// The match card's bottom buttons ("1 X 2" on the left, "ניחושים" on the right) as one bar
// split by gentle slanted breaks with a slit between them, set inside the card. Each button is
// outlined in a darker shade of its own colour. Both labels share one font, size and weight.
// With `arena` (a variant from ARENA_VARIANTS) a narrow third part sits between them: the match
// arena, a drawn pitch icon on a yellow fill.

const H = 36, SLANT = 10, GAP = 6, R = 12, STROKE = 1.75;
const ODDS = { label: '1 X 2', fill: 'linear-gradient(90deg,#3b82f6,#1d4ed8)', line: '#1e3a8a', w: 1.4 };
const PREDS = { label: 'ניחושים', fill: 'linear-gradient(90deg,#16a34a,#15803d)', line: '#14532d', w: 1.4 };
const LABEL = { fontFamily: 'inherit', fontSize: 16, fontWeight: 600, lineHeight: 1 };

// the arena part's look: [name, fill, outline, icon colour, glow?, overlay?]
const B8 = 'linear-gradient(180deg,#fef08a,#eab308 60%,#a16207)';
const GLOSS = 'gloss', TOPLINE = 'topline';
export const ARENA_VARIANTS = [
  // yellows
  ['צהוב 1 · זהב', 'linear-gradient(90deg,#fde047,#eab308)', '#a16207', '#3a2a00'],
  ['צהוב 2 · צהוב אחיד', '#facc15', '#a16207', '#3a2a00'],
  ['צהוב 3 · לימון בהיר', 'linear-gradient(90deg,#fef9c3,#fde047)', '#ca8a04', '#713f12'],
  ['צהוב 4 · ענבר עמוק', 'linear-gradient(90deg,#f59e0b,#b45309)', '#78350f', '#fff7ed'],
  ['צהוב 5 · זהב מתכתי', 'linear-gradient(100deg,#fef3c7 0%,#facc15 30%,#b8860b 55%,#fde68a 80%,#eab308 100%)', '#92400e', '#3a2a00'],
  ['צהוב 6 · זכוכית צהובה', 'rgba(250,204,21,0.18)', '#facc15', '#fde047'],
  ['צהוב 7 · כהה עם מסגרת צהובה', 'linear-gradient(90deg,#1f2937,#0b1220)', '#facc15', '#facc15'],
  ['צהוב 8 · בהיר למעלה, כהה למטה', B8, '#854d0e', '#3a2a00'],
  ['צהוב 9 · אייקון לבן', 'linear-gradient(90deg,#eab308,#ca8a04)', '#854d0e', '#fff'],
  ['צהוב 10 · ניאון צהוב', 'rgba(10,14,25,0.85)', '#fde047', '#fde047', '#facc15'],
  // takes on yellow 8
  ['כמו 8 · 1 · כמו שהוא', B8, '#854d0e', '#3a2a00'],
  ['כמו 8 · 2 · רך יותר', 'linear-gradient(180deg,#fef9c3,#facc15 60%,#ca8a04)', '#a16207', '#3a2a00'],
  ['כמו 8 · 3 · ניגודיות חזקה', 'linear-gradient(180deg,#fef08a,#eab308 45%,#854d0e)', '#713f12', '#2a1d00'],
  ['כמו 8 · 4 · הפוך', 'linear-gradient(0deg,#fef08a,#eab308 60%,#a16207)', '#854d0e', '#3a2a00'],
  ['כמו 8 · 5 · ברק זכוכית', B8, '#854d0e', '#3a2a00', null, GLOSS],
  ['כמו 8 · 6 · חם יותר', 'linear-gradient(180deg,#fde68a,#f59e0b 60%,#b45309)', '#78350f', '#3a1a00'],
  ['כמו 8 · 7 · לימוני', 'linear-gradient(180deg,#fefce8,#fde047 55%,#eab308)', '#a16207', '#422006'],
  ['כמו 8 · 8 · מתכתי עם קו אופק', 'linear-gradient(180deg,#fef08a 0%,#eab308 50%,#a16207 51%,#ca8a04 100%)', '#713f12', '#2a1d00'],
  ['כמו 8 · 9 · קו אור למעלה', B8, '#854d0e', '#3a2a00', null, TOPLINE],
  ['כמו 8 · 10 · אייקון לבן', B8, '#854d0e', '#ffffff'],
  ['כמו 8 · 11 · מסגרת ואייקון כהים', B8, '#5c3a06', '#1c1300'],
];

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

export default function CardActions({ onOdds, onPredictions, onArena, arena }) {
  const box = useRef(null);
  const [W, setW] = useState(0);
  const [down, setDown] = useState(null);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return undefined;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el); setW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);
  const v = onArena && ARENA_VARIANTS[arena];
  const parts = v
    ? [{ ...ODDS, on: onOdds }, { arena: true, label: 'זירת המשחק', fill: v[1], line: v[2], icon: v[3], glow: v[4], over: v[5], w: 0.55, on: onArena }, { ...PREDS, on: onPredictions }]
    : [{ ...ODDS, w: 1, on: onOdds }, { ...PREDS, w: 1, on: onPredictions }];
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
            {b.over === GLOSS && <span className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.5),rgba(255,255,255,0) 50%)' }} />}
            {b.over === TOPLINE && <span className="pointer-events-none absolute inset-x-0" style={{ top: 2, height: 1.5, background: 'rgba(255,255,255,0.85)' }} />}
            {b.glow && <span className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 0 12px ${b.glow}88` }} />}
            {/* the outline; the path clips its outer half, so it reads as an inner stroke */}
            <svg className="pointer-events-none absolute inset-0" width={W} height={H}><path d={d} fill="none" stroke={b.line} strokeWidth={STROKE * 2} /></svg>
            <span dir={b.label === ODDS.label ? 'ltr' : 'rtl'} className="pointer-events-none absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-white" style={{ ...LABEL, left: mid, filter: b.glow ? `drop-shadow(0 0 4px ${b.glow})` : undefined }}>
              {b.arena ? <PitchIcon c={b.icon} /> : b.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
