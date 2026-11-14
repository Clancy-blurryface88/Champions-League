import React from 'react';
import moment from 'moment';

// The match date and kick-off time as two small slanted frosted-glass panes hanging from the
// card's top edge (the days bar's lean). The date pane comes first (on the right in RTL), the
// time pane second. Glass uses skew, not clip-path: clip-path together with backdrop-filter
// broke rendering in the app before.

const SKEW = -12;
const PANE = {
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(14px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.5)',
  border: '1px solid rgba(255,255,255,0.28)',
  borderTop: 'none',
  boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.18), 0 6px 16px rgba(0,0,0,0.3)',
  transform: `skewX(${SKEW}deg)`,
};
const VALUE = { fontFamily: 'var(--num-font)', fontSize: 14, textShadow: '0 1px 3px rgba(0,0,0,0.85)' };

export default function MatchDateTag({ date }) {
  const m = moment(date);
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-10 flex -translate-x-1/2 items-start gap-2">
      {[m.format('D.MM'), m.format('HH:mm')].map((v) => (
        <div key={v} className="rounded-b-lg" style={{ ...PANE, padding: '3px 13px 4px' }}>
          <span className="block font-black leading-none text-white" style={{ ...VALUE, transform: `skewX(${-SKEW}deg)` }}>{v}</span>
        </div>
      ))}
    </div>
  );
}
