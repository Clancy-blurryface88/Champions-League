import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// The predictions page's round header: one glass card with the round number large on the right
// (the app's stencil number font) and, to its left, the stage name in the same font, heavy and
// spaced wide. Once predictions are sent, a pulsing green dot and
// "הניחושים נשלחו בהצלחה" appear under the stage name (before that, progress is shown at the
// bottom of the page, so nothing is added here).

// "League Phase - 3" -> label "LEAGUE PHASE", number "3"
const splitRoundName = (name = '') => {
  const m = name.trim().match(/^(.*?)\s*-\s*(\d+)$/);
  return m ? { label: m[1].toUpperCase(), num: m[2] } : { label: name.trim().toUpperCase(), num: null };
};

// the stage name: the number font, heavy, spaced wide
export default function RoundHeader({ name, sent, labelFont = 'var(--num-font)', labelWeight = 900, labelSpacing = '0.08em' }) {
  const { label, num } = splitRoundName(name);
  return (
    <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }}>
      <div dir="rtl" className="flex items-center justify-center gap-4 px-4 py-3">
        {num && <span className="font-black leading-none text-white" style={{ fontFamily: 'var(--num-font)', fontSize: 60 }}>{num}</span>}
        <div className="text-right leading-tight">
          {/* larger while it stands alone; a step smaller once the sent line sits under it */}
          <div className="text-white" style={{ fontFamily: labelFont, fontWeight: labelWeight, fontSize: sent ? 22 : 29, lineHeight: 1.05, letterSpacing: labelSpacing, transition: 'font-size 0.2s ease' }}>{label}</div>
          <AnimatePresence initial={false}>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="mt-1.5 flex items-center gap-2 text-[12px] font-bold"
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
      </div>
    </div>
  );
}
