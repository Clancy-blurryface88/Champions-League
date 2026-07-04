import React, { useState, useEffect, Fragment } from 'react';

function diff(target) {
  const ms = Math.max(new Date(target).getTime() - Date.now(), 0);
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

// Same glass-pill countdown used on the match prediction cards (Predictions.jsx)
// — kept identical so the "time left" treatment reads consistently everywhere.
export default function MatchCountdown({ target }) {
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    setT(diff(target));
    const iv = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(iv);
  }, [target]);

  const units = [
    { val: t.seconds, label: 'שניות' },
    { val: t.minutes, label: 'דקות' },
    { val: t.hours, label: 'שעות' },
    { val: t.days, label: 'ימים' },
  ];

  return (
    <div dir="rtl" className="relative overflow-hidden flex rounded-2xl" style={{
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.18)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)',
    }}>
      <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)', borderRadius: '16px 16px 0 0' }} />
      {units.map((item, i) => (
        <Fragment key={item.label}>
          <div className="relative flex flex-col items-center px-3 py-2">
            <span className="font-extrabold leading-none mb-0.5" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.92)' }}>{item.val}</span>
            <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.label}</span>
          </div>
          {i < units.length - 1 && <div className="self-center" style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />}
        </Fragment>
      ))}
    </div>
  );
}
