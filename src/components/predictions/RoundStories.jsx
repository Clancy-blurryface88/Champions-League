import React from 'react';
import moment from 'moment';
import { motion } from 'framer-motion';

// The round as "stories": a strip of the round's matches that scrolls sideways under the days bar, the
// days split by a thin line with the day in English. Each match is a circle with both crests; its ring is
// green once you've predicted it, yellow while it's still open and waiting for you, grey if it closed
// without a prediction. The chosen match's ring turns slowly. Picking a match shows its card below.

const NUM = 'var(--num-font)';
const RING = {
  done: 'conic-gradient(#4ade80,#16a34a,#86efac,#4ade80)',
  todo: 'conic-gradient(#facc15,#f59e0b,#fde68a,#facc15)',
  missed: 'conic-gradient(#475569,#334155,#64748b,#475569)',
};
const SIZE = 60, CREST = 48, INNER = 27.5; // ring 2.5px wide
const RING_MASK = { WebkitMask: `radial-gradient(circle,transparent ${INNER}px,#000 ${INNER + 0.5}px)`, mask: `radial-gradient(circle,transparent ${INNER}px,#000 ${INNER + 0.5}px)` };

function Crest({ src, s, style }) {
  return src ? <img src={src} alt="" draggable={false} style={{ width: s, height: s, objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,.55))', ...style }} /> : null;
}

// both crests in a circle, split by a slanted line
function Pair({ m }) {
  const s = CREST;
  return (
    <span style={{ position: 'relative', width: s, height: s, borderRadius: '50%', overflow: 'hidden', display: 'block', background: '#0b1426' }}>
      <span style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0,62% 0,38% 100%,0 100%)', background: 'rgba(255,255,255,.06)' }} />
      <Crest src={m.team_a_logo} s={s * 0.44} style={{ position: 'absolute', left: s * 0.08, top: s * 0.14 }} />
      <Crest src={m.team_b_logo} s={s * 0.44} style={{ position: 'absolute', right: s * 0.08, bottom: s * 0.14 }} />
      <span style={{ position: 'absolute', left: '50%', top: -4, bottom: -4, width: 1, background: 'rgba(255,255,255,.25)', transform: 'rotate(14deg)' }} />
    </span>
  );
}

function DayMark({ dateKey }) {
  return (
    <span dir="ltr" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'stretch' }}>
      <span style={{ width: 1, alignSelf: 'stretch', background: 'linear-gradient(transparent,rgba(255,255,255,.4),transparent)' }} />
      <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', font: `900 17px ${NUM}`, letterSpacing: '.1em', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,.6)' }}>
        {moment(dateKey).locale('en').format('ddd').toUpperCase()}
      </span>
    </span>
  );
}

export default function RoundStories({ dateKeys, matchesByDate, selectedId, onSelect, statusOf }) {
  const ref = React.useRef(null);
  // keep the chosen match in the middle of the strip
  React.useEffect(() => {
    const strip = ref.current;
    const el = strip?.querySelector(`[data-mid="${selectedId}"]`);
    if (!el) return;
    strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.offsetWidth / 2, behavior: 'smooth' });
  }, [selectedId]);

  return (
    <div ref={ref} dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', padding: '8px 4px 4px', marginTop: 4 }}>
      {dateKeys.map((key) => (
        <React.Fragment key={key}>
          <DayMark dateKey={key} />
          {(matchesByDate[key] || []).map((m) => {
            const on = m.id === selectedId;
            return (
              <button key={m.id} data-mid={m.id} type="button" onClick={() => onSelect(m.id)} aria-label={`${m.team_a} – ${m.team_b}`}
                style={{ flex: '0 0 auto', padding: '2px 0', WebkitTapHighlightColor: 'transparent' }}>
                <motion.span animate={{ scale: on ? 1.06 : 1 }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  style={{ position: 'relative', display: 'grid', placeItems: 'center', width: SIZE, height: SIZE }}>
                  <motion.span
                    animate={{ rotate: on ? 360 : 0 }}
                    transition={on ? { duration: 6, repeat: Infinity, ease: 'linear' } : { duration: 0.4 }}
                    style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: RING[statusOf(m)], ...RING_MASK }}
                  />
                  <Pair m={m} />
                </motion.span>
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
