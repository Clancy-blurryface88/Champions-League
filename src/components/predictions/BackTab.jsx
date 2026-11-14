import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// The predictions page's back button: a wide slanted pane of smoked glass with a white edge,
// hanging below a thin line that runs across the top of the page (the match card's date-tag
// look). The arrow sits to the left of the word. Glass uses skew, not clip-path: clip-path with
// backdrop-filter broke rendering in the app before.

const SKEW = -12;
const PANE = {
  width: 220,
  height: 24,
  background: 'rgba(0,0,0,0.3)',
  backdropFilter: 'blur(14px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.5)',
  border: '1px solid rgba(255,255,255,0.55)',
  borderTop: 'none',
  borderRadius: '0 0 8px 8px',
  boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.18), 0 6px 16px rgba(0,0,0,0.3)',
  transform: `skewX(${SKEW}deg)`,
};

export default function BackTab({ onClick }) {
  return (
    <div className="relative flex justify-center">
      <span className="absolute inset-x-2 top-0 h-px bg-white/30" />
      <motion.button whileTap={{ scale: 0.97 }} transition={{ duration: 0.12 }} onClick={onClick} aria-label="חזרה" className="relative">
        <span className="flex items-center justify-center" style={PANE}>
          <span dir="ltr" className="flex items-center gap-1.5" style={{ transform: `skewX(${-SKEW}deg)` }}>
            <ArrowLeft className="h-[15px] w-[15px] text-white" strokeWidth={2.5} />
            <span className="text-[13px] font-extrabold leading-none text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}>חזרה</span>
          </span>
        </span>
      </motion.button>
    </div>
  );
}
