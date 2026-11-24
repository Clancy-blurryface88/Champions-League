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
        {groups.map(([t, ms]) => {
          const size = full ? 14 : ms.length < 4 ? 22 : 18;
          const crest = full ? 18 : 22;
          return (
            <div key={t} style={{ marginBottom: full ? 8 : 12 }}>
              <div dir="ltr" className="flex items-center justify-center" style={{ gap: 10, marginBottom: 4 }}>
                <span style={{ width: 60, height: 1, background: YELLOW }} />
                <span style={{ font: '700 20px var(--num-font)', color: YELLOW }}>{t}</span>
                <span style={{ width: 60, height: 1, background: YELLOW }} />
              </div>
              {ms.map((m) => (
                <motion.div
                  key={m.id}
                  dir="ltr"
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i++ * (full ? 0.03 : 0.06), type: 'spring', stiffness: 260, damping: 24 }}
                  style={{
                    gap: 8, padding: `${full ? 2 : 4}px 0`, color: '#fff', whiteSpace: 'nowrap', textTransform: 'uppercase',
                    font: `800 min(${size}px, ${(size / 3.75).toFixed(2)}vw) 'EnStencil', 'Outfit', sans-serif`, letterSpacing: '.03em',
                  }}
                >
                  <Crest src={m.team_a_logo} size={crest} />
                  {teamEn(m.team_a)}
                  <span style={{ color: '#7dd3fc', fontSize: 12 }}>V</span>
                  {teamEn(m.team_b)}
                  <Crest src={m.team_b_logo} size={crest} />
                </motion.div>
              ))}
            </div>
          );
        })}
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
