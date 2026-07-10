import React from 'react';

/* Shared mock data/atoms for the "Live Match Card" design-comparison tabs. */

export const LIVE = { homeCode: 'br', home: 'ברזיל', awayCode: 'ar', away: 'ארגנטינה', homeScore: 2, awayScore: 1, minute: 63 };

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
