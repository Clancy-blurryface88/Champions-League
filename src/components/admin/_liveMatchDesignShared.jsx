import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeamFlag from '../TeamFlag';

/* Shared mock data/atoms for the "Live Match Card" design-comparison tabs. */

export const LIVE = { homeCode: 'br', home: 'ברזיל', awayCode: 'ar', away: 'ארגנטינה', homeScore: 2, awayScore: 1, minute: 63 };

/* Point on the card's rounded-rect perimeter at a given 0–1 progress —
   mirrors how the real LiveMatchCard rides its minute marker on the ring
   edge, so these mock-ups sit on literally the same border shape. */
function useRectEdgePoint(pct) {
  const pathRef = useRef(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    setPoint(pathRef.current.getPointAtLength(pct * len));
  }, [pct]);
  return { pathRef, point };
}

const CARD_W = 260;
const CARD_H = 176;
const RX = 20;

/* Same shell as the real card: rounded card, red ring stroked clockwise by
   minute progress, LIVE pill, flags flanking the score. Only the minute
   badge's update-motion and the score digit's change-motion are swappable
   per design, so every mock-up reads as "the current card" with one detail
   changed — not a different card. */
export function LiveCardShell({ progress, minute, homeScore = LIVE.homeScore, awayScore = LIVE.awayScore, ScoreDigit = DefaultScoreDigit, MinuteBadge = DefaultMinuteBadge, entranceDelays }) {
  const { pathRef, point } = useRectEdgePoint(progress);
  const d = { badge: 0, flags: 0.1, score: 0.25, ...entranceDelays };
  return (
    <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
      <svg width={CARD_W} height={CARD_H} style={{ position: 'absolute', inset: 0 }}>
        <rect ref={pathRef} x="2" y="2" width={CARD_W - 4} height={CARD_H - 4} rx={RX} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
        <rect x="2" y="2" width={CARD_W - 4} height={CARD_H - 4} rx={RX} fill="none" stroke="#ef4444" strokeWidth="2.5"
          strokeDasharray={pathRef.current ? pathRef.current.getTotalLength() : 900}
          strokeDashoffset={pathRef.current ? pathRef.current.getTotalLength() * (1 - progress) : 900}
          style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.5))', transition: 'stroke-dashoffset 0.3s linear' }}
        />
      </svg>

      {MinuteBadge && (
        <div style={{ position: 'absolute', left: point.x, top: point.y, transform: 'translate(-50%,-50%)', zIndex: 5 }}>
          <MinuteBadge minute={minute} />
        </div>
      )}

      <div className="rounded-2xl" style={{ position: 'absolute', inset: 6, background: 'rgba(8,18,32,0.95)', backdropFilter: 'blur(28px)', boxShadow: '0 0 40px rgba(239,68,68,0.15)', overflow: 'hidden' }}>
        <div className="px-5 py-5 flex flex-col items-center gap-3 h-full justify-center">
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d.badge, duration: 0.35 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-red-400 text-xs font-bold tracking-widest uppercase">Live</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: d.flags, duration: 0.35 }}
            className="flex items-center gap-3" dir="ltr">
            <div className="relative flex flex-col items-center">
              <TeamFlag logo={LIVE.homeCode} name={LIVE.home} className="w-11 h-11" />
              <span className="absolute top-full mt-1 text-slate-400 text-[9px] whitespace-nowrap">{LIVE.homeCode.toUpperCase()}</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d.score, duration: 0.3 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ScoreDigit value={homeScore} side="home" />
              <span style={{ color: '#475569', fontSize: 28, fontWeight: 900 }}>-</span>
              <ScoreDigit value={awayScore} side="away" />
            </motion.div>
            <div className="relative flex flex-col items-center">
              <TeamFlag logo={LIVE.awayCode} name={LIVE.away} className="w-11 h-11" />
              <span className="absolute top-full mt-1 text-slate-400 text-[9px] whitespace-nowrap">{LIVE.awayCode.toUpperCase()}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export const Shell = ({ children, style, className = '' }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ minHeight: 260, ...style }}>
    {children}
  </div>
);

/* The current production badge style (gold pill, scale-pulse on update) —
   the default for designs that aren't specifically exploring badge motion. */
export function DefaultMinuteBadge({ minute }) {
  return (
    <motion.div key={minute} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11, borderRadius: 999, padding: '2px 7px', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 2px #030d1a' }}>
      {minute}'
    </motion.div>
  );
}

/* The current production digit style (odometer roll) — the default for
   designs that aren't specifically exploring score-digit motion. */
export function DefaultScoreDigit({ value }) {
  return (
    <motion.span key={value} initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ fontFamily: "'Russo One', sans-serif", fontSize: 28, color: '#fff', display: 'inline-block' }}>
      {value}
    </motion.span>
  );
}

export function DesignGrid({ title, subtitle, designs, chosen, setChosen }) {
  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
        </div>
        {chosen && (
          <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl px-4 py-2 text-sm text-yellow-300">
            בחרת: <strong>#{chosen.id} — {chosen.name}</strong>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {designs.map(({ id, name, Comp }) => (
          <div
            key={id}
            onClick={() => setChosen({ id, name })}
            className="cursor-pointer rounded-2xl overflow-hidden transition-all duration-200"
            style={{
              background: '#030d1a',
              border: chosen?.id === id ? '2px solid #f5c518' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: chosen?.id === id ? '0 0 20px rgba(245,197,24,0.25)' : 'none',
            }}
          >
            <div className="px-4 pt-3 text-xs text-slate-500">#{id} {name}</div>
            <Comp />
          </div>
        ))}
      </div>
    </div>
  );
}
