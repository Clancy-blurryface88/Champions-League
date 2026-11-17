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

export default function RoundHeader({ name, sent }) {
  const { label, num } = splitRoundName(name);
  return (
    <div className="w-full">
      <div className="flex items-center gap-2.5">
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4))' }} />
        <div dir="ltr" className="flex items-center gap-2.5">
          <span style={{ ...NUM, fontSize: 28, letterSpacing: '0.08em', color: '#fff' }}>{label}</span>
          {num && <span style={{ ...NUM, fontSize: 40, lineHeight: 1, color: '#fff' }}>{num}</span>}
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
