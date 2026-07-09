import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* Shared mock data/atoms for the "Next Match Intro" design-comparison tabs. */

export const MOCK = { teamA: 'ברזיל', teamACode: 'br', teamB: 'ארגנטינה', teamBCode: 'ar' };
export const MOCK2 = { teamA: 'ספרד', teamACode: 'es', teamB: 'צרפת', teamBCode: 'fr' };

export const TARGET = new Date(Date.now() + ((2 * 24 + 14) * 3600 + 37 * 60 + 9) * 1000).toISOString();
export const TARGET2 = new Date(Date.now() + 5 * 86400000).toISOString();

function diff(target) {
  const ms = Math.max(new Date(target).getTime() - Date.now(), 0);
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

export function useCountdown(target) {
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    const iv = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(iv);
  }, [target]);
  return t;
}

export const pad = (n) => String(n).padStart(2, '0');

export function FlipUnit({ value, label, accent, glow }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', overflow: 'hidden', width: 34, height: 30, borderRadius: 6, background: 'rgba(0,0,0,0.35)', border: `1px solid ${accent}55` }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'monospace', fontWeight: 800, fontSize: 15, color: accent,
              textShadow: glow ? `0 0 6px ${accent}, 0 0 16px ${accent}88` : 'none',
            }}
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{label}</div>
    </div>
  );
}

export const Shell = ({ children, style, className = '' }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ minHeight: 260, ...style }}>
    {children}
  </div>
);

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
