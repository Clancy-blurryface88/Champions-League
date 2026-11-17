import React from 'react';
import moment from 'moment';
import { motion } from 'framer-motion';

// The match card's countdown pill as a soft 3D cube: the front shows the countdown, and every few
// seconds it turns over to the kick-off time (large) and the date (small) with a slanted divider,
// then back. The side turning away goes dark. A tap turns it at once. Both sides are the same size.
// `compact` (round 8, the test round): a little smaller, and the date has the weekday under it.

const SIZES = {
  normal: { W: 204, H: 50, num: 19, label: 9, time: 24, date: 16, div: 28 },
  compact: { W: 184, H: 44, num: 17, label: 8, time: 22, date: 13, div: 24 },
};
const SHOW_MS = 7000; // how long each side stays before turning
const TURN = { duration: 1.2, ease: [0.6, 0.05, 0.25, 1] };
// No backdrop-filter here: a blurred backdrop inside the turning 3D cube (two per card, every card on
// the page) made the round page flicker while scrolling on phones. A tinted fill gives the same glass.
const GLASS = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.05)), rgba(5,10,18,0.35)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)',
  borderRadius: 16,
  transform: 'skewX(-12deg)', // the days bar's lean; contents are set back upright
};
const UP = { transform: 'skewX(12deg)' };
const NUM = 'var(--num-font)';
// thin slanted divider that fades out at both ends (between countdown units, and between date and time)
const DIVIDER = { width: 1.5, background: 'linear-gradient(transparent, rgba(255,255,255,0.45), transparent)', transform: 'skewX(12deg) rotate(12deg)' };

function Pill({ W, H, children }) {
  return (
    <div dir="rtl" className="relative flex items-center overflow-hidden" style={{ width: W, height: H, ...GLASS }}>
      <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)', borderRadius: '16px 16px 0 0' }} />
      {children}
    </div>
  );
}

export default function CountdownSwap({ timeInfo, date, compact = false }) {
  const Z = compact ? SIZES.compact : SIZES.normal;
  const { W, H } = Z;
  const div = { ...DIVIDER, height: Z.div };
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
          <Pill W={W} H={H}>
            {units.map((u, i) => (
              <React.Fragment key={u.label}>
                {i > 0 && <span className="shrink-0" style={div} />}
                <div className="flex flex-1 flex-col items-center" style={UP}>
                  <span className="font-black leading-none mb-0.5" style={{ fontFamily: NUM, fontSize: Z.num, color: 'rgba(255,255,255,0.92)' }}>{u.val}</span>
                  <span className="font-semibold" style={{ fontSize: Z.label, color: 'rgba(255,255,255,0.45)' }}>{u.label}</span>
                </div>
              </React.Fragment>
            ))}
          </Pill>
        ))}
        {side(1, (
          <Pill W={W} H={H}>
            <div className="flex w-full items-center justify-center" style={{ gap: compact ? 12 : 14 }}>
              {compact ? (
                // the date with the weekday under it — together about as tall as the time
                <span style={{ ...UP, display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  <span style={{ font: `900 ${Z.date}px ${NUM}`, color: 'rgba(255,255,255,0.62)', letterSpacing: '0.06em' }}>{m.format('DD.MM')}</span>
                  <span style={{ font: `900 9px ${NUM}`, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em', marginTop: 2 }}>{m.clone().locale('en').format('ddd').toUpperCase()}</span>
                </span>
              ) : (
                <span style={{ ...UP, font: `900 ${Z.date}px ${NUM}`, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em' }}>{m.format('D.MM')}</span>
              )}
              <span style={div} />
              <span style={{ ...UP, font: `900 ${Z.time}px ${NUM}`, color: 'rgba(255,255,255,0.95)', lineHeight: 1 }}>{m.format('HH:mm')}</span>
            </div>
          </Pill>
        ))}
      </motion.div>
    </button>
  );
}
