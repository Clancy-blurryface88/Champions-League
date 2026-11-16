import React from 'react';
import moment from 'moment';
import { motion } from 'framer-motion';

// The match card's countdown pill as a soft 3D cube: the front shows the countdown, and every few
// seconds it turns over to the kick-off time (large) and the date (small) with a slanted divider,
// then back. The side turning away goes dark. A tap turns it at once. Both sides are the same size.

const W = 204, H = 50;
const SHOW_MS = 7000; // how long each side stays before turning
const TURN = { duration: 1.2, ease: [0.6, 0.05, 0.25, 1] };
const GLASS = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)',
  borderRadius: 16,
  transform: 'skewX(-12deg)', // the days bar's lean; contents are set back upright
};
const UP = { transform: 'skewX(12deg)' };
const NUM = 'var(--num-font)';

function Pill({ children }) {
  return (
    <div dir="rtl" className="relative flex items-center overflow-hidden" style={{ width: W, height: H, ...GLASS }}>
      <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)', borderRadius: '16px 16px 0 0' }} />
      {children}
    </div>
  );
}

export default function CountdownSwap({ timeInfo, date }) {
  const [face, setFace] = React.useState(0);
  const [taps, setTaps] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setFace((f) => 1 - f), SHOW_MS);
    return () => clearInterval(id);
  }, [taps]); // a tap restarts the wait

  const m = moment(date);
  const units = [
    { val: timeInfo.seconds, label: 'שניות' },
    { val: timeInfo.minutes, label: 'דקות' },
    { val: timeInfo.hours, label: 'שעות' },
    { val: timeInfo.days, label: 'ימים' },
  ];
  const side = (k, children) => (
    <motion.div
      initial={false}
      animate={{ filter: face === k ? 'brightness(1)' : 'brightness(0.3)' }}
      transition={TURN}
      className="absolute inset-0"
      style={{ transform: k ? `rotateX(-90deg) translateZ(${H / 2}px)` : `translateZ(${H / 2}px)`, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
    >
      {children}
    </motion.div>
  );

  return (
    <button
      type="button"
      aria-label="החלף בין הספירה לשעת המשחק"
      onClick={() => { setFace((f) => 1 - f); setTaps((t) => t + 1); }}
      style={{ perspective: 520, width: W, height: H, WebkitTapHighlightColor: 'transparent' }}
    >
      <motion.div initial={false} animate={{ rotateX: face * 90 }} transition={TURN} className="relative" style={{ width: W, height: H, transformStyle: 'preserve-3d' }}>
        {side(0, (
          <Pill>
            {units.map((u, i) => (
              <React.Fragment key={u.label}>
                {i > 0 && <div className="shrink-0" style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />}
                <div className="flex flex-1 flex-col items-center" style={UP}>
                  <span className="font-black leading-none mb-0.5" style={{ fontFamily: NUM, fontSize: 19, color: 'rgba(255,255,255,0.92)' }}>{u.val}</span>
                  <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>{u.label}</span>
                </div>
              </React.Fragment>
            ))}
          </Pill>
        ))}
        {side(1, (
          <Pill>
            <div className="flex w-full items-center justify-center" style={{ gap: 14 }}>
              <span style={{ ...UP, font: `900 16px ${NUM}`, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em' }}>{m.format('D.MM')}</span>
              <span style={{ width: 1.5, height: 28, background: 'linear-gradient(transparent, rgba(255,255,255,0.45), transparent)', transform: 'skewX(12deg) rotate(12deg)' }} />
              <span style={{ ...UP, font: `900 30px ${NUM}`, color: 'rgba(255,255,255,0.95)', lineHeight: 1 }}>{m.format('HH:mm')}</span>
            </div>
          </Pill>
        ))}
      </motion.div>
    </button>
  );
}
