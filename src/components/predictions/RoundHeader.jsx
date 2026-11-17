import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// The predictions page's round title: "LEAGUE PHASE 5" in the stencil number font, the number
// larger, between two thin lines that fade out toward the edges. Once predictions are sent, a
// pulsing green dot and "הניחושים נשלחו בהצלחה" appear under it. (The league-table button
// lives in the days bar under the title.)

const NUM = { fontFamily: 'var(--num-font)', fontWeight: 900 };

// "League Phase - 3" -> label "LEAGUE PHASE", number "3"
const splitRoundName = (name = '') => {
  const m = name.trim().match(/^(.*?)\s*-\s*(\d+)$/);
  return m ? { label: m[1].toUpperCase(), num: m[2] } : { label: name.trim().toUpperCase(), num: null };
};

// When the round opens, its number rolls up like an odometer, runs two past the real number and rolls
// back to land on it.
const OVER = 2, LINE = 40;
function RollingNumber({ num }) {
  const n = Number(num);
  if (!Number.isFinite(n) || n < 1) return <span style={{ ...NUM, fontSize: 40, lineHeight: 1, color: '#fff' }}>{num}</span>;
  const top = n + OVER;
  const end = -(n - 1) * LINE;
  // up to two past the number, back down a touch past it, and settle on it (a CSS animation per number)
  const css = `@keyframes rn-roll-${n}{0%{transform:translateY(0)}62%{transform:translateY(${-(top - 1) * LINE}px)}86%{transform:translateY(${end + 5}px)}100%{transform:translateY(${end}px)}}`;
  return (
    <span style={{ display: 'inline-block', height: LINE, overflow: 'hidden' }} aria-label={String(n)}>
      <style>{css}</style>
      <span
        style={{ display: 'flex', flexDirection: 'column', transform: `translateY(${end}px)`, animation: `rn-roll-${n} 1.6s cubic-bezier(.45,0,.3,1) .25s both` }}
        aria-hidden
      >
        {Array.from({ length: top }, (_, i) => (
          <span key={i} style={{ ...NUM, fontSize: 40, lineHeight: 1, height: LINE, display: 'grid', placeItems: 'center', color: '#fff' }}>{i + 1}</span>
        ))}
      </span>
    </span>
  );
}

export default function RoundHeader({ name, sent }) {
  const { label, num } = splitRoundName(name);
  return (
    <div className="w-full">
      <div className="flex items-center gap-2.5">
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4))' }} />
        <div dir="ltr" className="flex items-center gap-2.5">
          <span style={{ ...NUM, fontSize: 22, letterSpacing: '0.08em', color: '#fff' }}>{label}</span>
          {num && <RollingNumber num={num} />}
        </div>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.4),transparent)' }} />
      </div>
      <AnimatePresence initial={false}>
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mt-1 flex items-center justify-center gap-1.5 text-[12px] font-bold"
            style={{ color: '#6ee7b7' }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" style={{ animationDuration: '2.4s' }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            הניחושים נשלחו בהצלחה
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
