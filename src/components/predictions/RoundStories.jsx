import React from 'react';
import moment from 'moment';
import { motion } from 'framer-motion';

// The round as "stories": a strip of the round's matches that scrolls sideways at the top of the round,
// the days split by a thin line with the day in English and its date. Each match is a circle with both crests; its ring is
// green once you've predicted it, yellow while it's still open and waiting for you, grey if it closed
// without a prediction. The chosen match's ring turns slowly. Picking a match shows its card below.

const NUM = 'var(--num-font)';
const RING = {
  done: '#4ade80,#16a34a,#86efac,#4ade80',
  todo: '#facc15,#f59e0b,#fde68a,#facc15',
  missed: '#475569,#334155,#64748b,#475569',
};
// The chosen ring "turns" by turning its gradient's angle (a registered CSS property), not by rotating an
// element: a rotating square grew the strip's scroll area every frame (the page jumped), and clipping it
// to a circle cut the ring's edges and made it shimmer. Where the property isn't supported it stays still.
const RING_CSS = `@property --rs-a{syntax:'<angle>';inherits:false;initial-value:0deg}@keyframes rs-turn{to{--rs-a:360deg}}`;
const SIZE = 60, CREST = 48, INNER = 27.5; // ring 2.5px wide
const ringMask = (inner) => ({ WebkitMask: `radial-gradient(circle,transparent ${inner}px,#000 ${inner + 0.5}px)`, mask: `radial-gradient(circle,transparent ${inner}px,#000 ${inner + 0.5}px)` });
const RING_MASK = ringMask(INNER);
const RING_MASK_ON = ringMask(INNER - 1.5); // the chosen match's ring: 4px instead of 2.5

function Crest({ src, s, style }) {
  return src ? <img src={src} alt="" draggable={false} style={{ width: s, height: s, objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,.55))', ...style }} /> : null;
}

// both crests in a circle, split by a soft slanted line ('split'); big crests meeting in the middle
// ('big'; 'bigReveal' = those in grey, the colour sharpening in out of a blur when chosen: the final design); or 'reveal': the split circle in grey, and when chosen its colour opens out from the centre
function Pair({ m, circle = 'split', on = false }) {
  const s = CREST;
  if (circle === 'big' || circle === 'bigReveal') {
    const big = (style) => <>
      <Crest src={m.team_a_logo} s={28} style={{ position: 'absolute', left: 3, top: 6, ...style }} />
      <Crest src={m.team_b_logo} s={28} style={{ position: 'absolute', right: 3, bottom: 6, ...style }} />
    </>;
    return (
      <span style={{ position: 'relative', width: s, height: s, borderRadius: '50%', overflow: 'hidden', display: 'block', background: '#0b1426' }}>
        {circle === 'bigReveal' ? <>
          {big({ filter: 'grayscale(1) brightness(.85) drop-shadow(0 1px 3px rgba(0,0,0,.55))' })}
          {/* the colour sharpens in out of a blur when the match is chosen */}
          <motion.span initial={false} animate={{ opacity: on ? 1 : 0, filter: on ? 'blur(0px)' : 'blur(6px)' }} transition={{ duration: 0.45, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0 }}>
            {big()}
          </motion.span>
        </> : big()}
      </span>
    );
  }
  const crests = (style) => <>
    {/* the crests keep a little room from the divider */}
    <Crest src={m.team_a_logo} s={s * 0.37} style={{ position: 'absolute', left: s * 0.09, top: s * 0.13, ...style }} />
    <Crest src={m.team_b_logo} s={s * 0.37} style={{ position: 'absolute', right: s * 0.09, bottom: s * 0.13, ...style }} />
  </>;
  return (
    <span style={{ position: 'relative', width: s, height: s, borderRadius: '50%', overflow: 'hidden', display: 'block', background: '#0b1426' }}>
      <span style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0,62% 0,38% 100%,0 100%)', background: 'rgba(255,255,255,.06)' }} />
      {circle === 'reveal' ? <>
        {crests({ filter: 'grayscale(1) brightness(.85) drop-shadow(0 1px 3px rgba(0,0,0,.55))' })}
        <motion.span initial={false} animate={{ clipPath: on ? 'circle(75% at 50% 50%)' : 'circle(0% at 50% 50%)' }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0 }}>
          {crests()}
        </motion.span>
      </> : crests()}
      {/* slanted divider: brighter in the middle, fading out at both ends */}
      <span style={{ position: 'absolute', left: '50%', top: -4, bottom: -4, width: 1, marginLeft: -0.5, background: 'linear-gradient(transparent,rgba(255,255,255,.5),transparent)', transform: 'rotate(14deg)' }} />
    </span>
  );
}

// the day as plain text (English), its date under it, after a thin line
function DayMark({ dateKey }) {
  const d = moment(dateKey);
  return (
    <span style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'stretch' }}>
      <span style={{ width: 1, alignSelf: 'stretch', background: 'linear-gradient(transparent,rgba(255,255,255,.35),transparent)' }} />
      <span dir="ltr" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
        <span style={{ font: `900 16px ${NUM}`, letterSpacing: '.08em', color: '#e2e8f0' }}>{d.locale('en').format('ddd').toUpperCase()}</span>
        <span style={{ font: `900 11px ${NUM}`, letterSpacing: '.06em', color: '#cbd5e1', marginTop: 3 }}>{d.format('DD.MM')}</span>
      </span>
    </span>
  );
}

export default function RoundStories({ dateKeys, matchesByDate, selectedId, onSelect, statusOf, circle = 'split' }) {
  const ref = React.useRef(null);
  // keep the chosen match in the middle of the strip
  React.useEffect(() => {
    const strip = ref.current;
    const el = strip?.querySelector(`[data-mid="${selectedId}"]`);
    if (!el) return;
    strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.offsetWidth / 2, behavior: 'smooth' });
  }, [selectedId]);

  return (
    // scrolls sideways only: no vertical scrolling or overscroll, so the strip stays put
    <div ref={ref} dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', overflowY: 'hidden', overscrollBehavior: 'contain', touchAction: 'pan-x', scrollbarWidth: 'none', padding: '12px 6px 10px', marginTop: 0 }}>
      <style>{RING_CSS}</style>
      {dateKeys.map((key) => (
        <React.Fragment key={key}>
          <DayMark dateKey={key} />
          {(matchesByDate[key] || []).map((m) => {
            const on = m.id === selectedId;
            return (
              <button key={m.id} data-mid={m.id} type="button" onClick={() => onSelect(m.id)} aria-label={`${m.team_a} – ${m.team_b}`}
                // the chosen match is drawn 1.2× larger; it gets a little room on both sides so it
                // doesn't overlap its neighbours
                style={{ flex: '0 0 auto', padding: '2px 0', margin: on ? '0 6px' : 0, transition: 'margin .25s', WebkitTapHighlightColor: 'transparent' }}>
                <motion.span animate={{ scale: on ? 1.2 : 1 }} transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  style={{ position: 'relative', display: 'grid', placeItems: 'center', width: SIZE, height: SIZE }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from var(--rs-a, 0deg), ${RING[statusOf(m)]})`, animation: on ? 'rs-turn 6s linear infinite' : 'none', ...(on ? RING_MASK_ON : RING_MASK) }} />
                  <Pair m={m} circle={circle} on={on} />
                </motion.span>
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
