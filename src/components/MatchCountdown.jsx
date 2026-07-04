import React, { useState, useEffect } from 'react';

function diff(target) {
  const ms = Math.max(new Date(target).getTime() - Date.now(), 0);
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

export default function MatchCountdown({ target }) {
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    setT(diff(target));
    const iv = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(iv);
  }, [target]);

  const units = [
    [t.days, 'ימים'],
    [t.hours, 'שעות'],
    [t.minutes, 'דק'],
    [t.seconds, 'שנ'],
  ];

  return (
    <div className="flex items-center gap-2" dir="ltr">
      {units.map(([value, label]) => (
        <div key={label} className="text-center">
          <div
            className="rounded-lg px-2.5 py-1.5 font-mono text-lg font-bold text-white"
            style={{ background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.35)', minWidth: 44 }}
          >
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-[9px] text-slate-400 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}
