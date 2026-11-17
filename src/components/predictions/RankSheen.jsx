import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIRECT_R16_CUTOFF, PLAYOFF_CUTOFF } from '@/config/tournament';

// The team's league position under its name in the match card: the number in its zone colour with a
// slow, soft, wide light passing through it. A tap shows "מקום X מתוך 36 · zone".
const TOTAL = 36;
const zoneName = (p) => (p <= DIRECT_R16_CUTOFF ? 'שמינית ישירה' : p <= PLAYOFF_CUTOFF ? 'פלייאוף' : 'הדחה');

export default function RankSheen({ value, color }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => setOpen(false), 3000);
    return () => clearTimeout(t);
  }, [open]);
  return (
    <span
      onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
      role="button"
      aria-label={`מקום ${value} מתוך ${TOTAL}`}
      style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginTop: 6, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}
    >
      <motion.span
        animate={{ backgroundPosition: ['150% 0', '-50% 0'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
        style={{
          font: '900 16px var(--num-font)', lineHeight: 1,
          backgroundImage: `linear-gradient(110deg, ${color} 30%, #ffffffdd 50%, ${color} 70%)`,
          backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
        }}
      >
        {value}
      </motion.span>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: -4, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.9 }} transition={{ duration: 0.18 }}
            dir="rtl"
            style={{ position: 'absolute', top: '100%', marginTop: 6, zIndex: 30, whiteSpace: 'nowrap', padding: '4px 8px', borderRadius: 8, background: 'rgba(2,6,23,.92)', border: `1px solid ${color}66`, font: '700 10px Outfit, system-ui', color: '#e2e8f0', boxShadow: '0 6px 16px rgba(0,0,0,.5)' }}
          >
            מקום <b style={{ color }}>{value}</b> מתוך {TOTAL} · {zoneName(value)}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
