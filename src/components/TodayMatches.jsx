import React from 'react';
import { motion } from 'framer-motion';
import { teamEn } from '@/utils/teamHe';

// "משחקי היום" — the day's remaining matches as a poster: the logo, then each kick-off hour with its
// matches in big stencil type. Always one screen: the more matches, the smaller the type.
// The background is one flat gradient (no blur), so it opens smoothly on phones.
const YELLOW = '#facc15';
const hour = (d) => new Date(d).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

const Crest = ({ src, size }) => (
  <img src={src} alt="" draggable={false} style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }} />
);

export default function TodayMatches({ matches, onClose }) {
  const groups = [...new Set(matches.map((m) => hour(m.match_date)))].map((t) => [t, matches.filter((m) => hour(m.match_date) === t)]);
  const full = matches.length > 12; // a whole round in one evening
  const size = full ? 14 : 19;
  const crest = full ? 18 : 26;
  let i = 0;
  return (
    <motion.div
      className="fixed inset-0 z-[56] flex items-center justify-center"
      style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(23,62,160,.97), rgba(3,7,20,.97) 70%)', padding: 14 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div style={{ width: '100%', maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <img src="/champions/ch-logo.png" alt="" style={{ height: full ? 42 : 52, display: 'block', margin: '0 auto 4px' }} />
        <div style={{ textAlign: 'center', font: '800 15px Outfit, system-ui', letterSpacing: '.04em', color: YELLOW, marginBottom: full ? 8 : 12 }}>משחקי היום</div>
        {/* one grid for the whole evening: crest | name | V | name | crest. The two name columns are equal and as
            wide as the longest name, so every V stands in the middle and the crests in two straight columns.
            Plain cells (no subgrid), so older phones line up too. */}
        <div dir="ltr" className="flex justify-center">
          <div style={{
            display: 'inline-grid', gridTemplateColumns: `${crest}px 1fr 22px 1fr ${crest}px`, columnGap: 8, gridAutoRows: 'auto', alignItems: 'center',
            font: `800 min(${size}px, ${(size / 3.75).toFixed(2)}vw) 'EnStencil', 'Outfit', sans-serif`, textTransform: 'uppercase', letterSpacing: '.03em', color: '#fff', whiteSpace: 'nowrap',
          }}>
            {groups.map(([t, ms], g) => (
              <React.Fragment key={t}>
                <div className="flex items-center" style={{ gridColumn: '1 / -1', gap: 10, margin: `${g ? (full ? 8 : 12) : 0}px 0 4px` }}>
                  <span style={{ flex: 1, height: 1, background: YELLOW }} />
                  <span style={{ font: '700 20px var(--num-font)', letterSpacing: 0, color: YELLOW }}>{t}</span>
                  <span style={{ flex: 1, height: 1, background: YELLOW }} />
                </div>
                {ms.map((m) => {
                  const cell = {
                    initial: { opacity: 0, y: 14 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.12 + i++ * (full ? 0.03 : 0.06), type: 'spring', stiffness: 260, damping: 24 },
                  };
                  const row = { height: full ? 22 : 36, display: 'flex', alignItems: 'center' };
                  return (
                    <React.Fragment key={m.id}>
                      <motion.span {...cell} style={row}><Crest src={m.team_a_logo} size={crest} /></motion.span>
                      <motion.span {...cell} style={{ ...row, justifyContent: 'flex-end' }}>{teamEn(m.team_a)}</motion.span>
                      <motion.span {...cell} style={{ ...row, justifyContent: 'center', color: '#7dd3fc', fontSize: 13, letterSpacing: 0 }}>V</motion.span>
                      <motion.span {...cell} style={row}>{teamEn(m.team_b)}</motion.span>
                      <motion.span {...cell} style={row}><Crest src={m.team_b_logo} size={crest} /></motion.span>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ display: 'block', margin: '12px auto 0', border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', color: '#fff', borderRadius: 999, padding: '8px 34px', font: '700 13px Outfit, system-ui' }}
        >
          סגור
        </button>
      </div>
    </motion.div>
  );
}
