import React, { useState } from 'react';

const ROWS = [
  { name: 'שחקן 3', scoreA: 2, scoreB: 1 },
  { name: 'שחקן 2', scoreA: 2, scoreB: 1 },
  { name: 'שחקן 4', scoreA: 1, scoreB: 1 },
  { name: 'שחקן 1', scoreA: 1, scoreB: 0 },
  { name: 'שחקן 5', scoreA: 0, scoreB: 1 },
];
const FA = '🇰🇷';
const FB = '🇨🇿';

const Label = ({ n, name }) => (
  <div className="mb-2 flex items-center gap-2">
    <span className="text-xs font-black text-slate-500 w-6 text-right">{n}</span>
    <span className="text-xs text-slate-400">{name}</span>
  </div>
);

// ─── 1. Current (glass rows) ───────────────────────────────
const V1 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center justify-between px-4 py-3 rounded-2xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
    <span className="text-white/85 text-sm font-semibold">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="text-amber-400 font-black text-base">{scoreA}</span>
      <span className="text-white/30">–</span>
      <span className="text-amber-400 font-black text-base">{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 2. Scoreboard dark ───────────────────────────────────
const V2 = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #21262d' }}>
    {ROWS.map(({ name, scoreA, scoreB }, i) => (
      <div key={name} className="flex items-center px-3 py-2"
        style={{ borderBottom: i < 4 ? '1px solid #21262d' : 'none', background: i % 2 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
        <span className="text-slate-400 text-xs w-5 font-mono">{i + 1}</span>
        <span className="text-white text-sm flex-1 font-medium">{name}</span>
        <div className="flex items-center gap-1">
          <span className="text-sm">{FA}</span>
          <span className="font-mono font-black text-green-400 text-sm w-4 text-center">{scoreA}</span>
          <span className="text-slate-600 text-xs">:</span>
          <span className="font-mono font-black text-green-400 text-sm w-4 text-center">{scoreB}</span>
          <span className="text-sm">{FB}</span>
        </div>
      </div>
    ))}
  </div>
);

// ─── 3. Card with left stripe ─────────────────────────────
const STRIPE_COLORS = ['#3b82f6','#3b82f6','#eab308','#22c55e','#ef4444'];
const V3 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center overflow-hidden rounded-xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
    <div style={{ width: 3, background: STRIPE_COLORS[i], alignSelf: 'stretch' }} />
    <span className="text-white/80 text-sm flex-1 px-3 py-2.5 font-medium">{name}</span>
    <div className="flex items-center gap-1.5 pr-3">
      <span>{FA}</span>
      <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 4. Neon blue rows ────────────────────────────────────
const V4 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center justify-between px-3 py-2 rounded-xl mb-1.5"
    style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.25)', boxShadow: '0 0 8px rgba(59,130,246,0.1)' }}>
    <span className="text-blue-200 text-sm font-semibold">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="font-black text-white text-sm px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.3)' }}>{scoreA}:{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 5. Pill score badge ──────────────────────────────────
const V5 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center justify-between px-3 py-2 rounded-lg mb-1.5"
    style={{ background: 'rgba(255,255,255,0.03)' }}>
    <span className="text-white/70 text-sm">{name}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm">{FA}</span>
      <span className="px-3 py-0.5 rounded-full text-xs font-black text-white"
        style={{ background: 'linear-gradient(135deg,#1e40af,#7c3aed)' }}>{scoreA} – {scoreB}</span>
      <span className="text-sm">{FB}</span>
    </div>
  </div>
));

// ─── 6. Score centered big ────────────────────────────────
const V6 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center mb-1.5 gap-3 px-3 py-2 rounded-xl"
    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
    <span className="text-white/60 text-xs w-16 truncate">{name}</span>
    <div className="flex-1 flex items-center justify-center gap-1">
      <span>{FA}</span>
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <span className="text-lg font-black text-white">{scoreA}</span>
        <span className="text-white/30 text-sm">:</span>
        <span className="text-lg font-black text-white">{scoreB}</span>
      </div>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 7. Timeline ──────────────────────────────────────────
const V7 = () => (
  <div className="relative pl-4">
    <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
    {ROWS.map(({ name, scoreA, scoreB }, i) => (
      <div key={name} className="flex items-center gap-3 mb-2 relative">
        <div className="w-3 h-3 rounded-full flex-shrink-0 z-10" style={{ background: STRIPE_COLORS[i], boxShadow: `0 0 6px ${STRIPE_COLORS[i]}` }} />
        <span className="text-white/70 text-sm flex-1">{name}</span>
        <div className="flex items-center gap-1">
          <span>{FA}</span>
          <span className="text-white font-black text-sm">{scoreA}–{scoreB}</span>
          <span>{FB}</span>
        </div>
      </div>
    ))}
  </div>
);

// ─── 8. Glassmorphism intense ─────────────────────────────
const V8 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center justify-between px-4 py-2.5 rounded-2xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}>
    <span className="text-white text-sm font-semibold">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="text-white font-black">{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 9. Compact table ─────────────────────────────────────
const V9 = () => (
  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <th className="text-left py-1 text-[10px] text-white/30 font-normal px-2">שחקן</th>
        <th className="text-center py-1 text-[10px] text-white/30 font-normal">תוצאה</th>
      </tr>
    </thead>
    <tbody>
      {ROWS.map(({ name, scoreA, scoreB }) => (
        <tr key={name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <td className="py-2 px-2 text-white/75 text-xs">{name}</td>
          <td className="py-2 text-center">
            <span className="text-xs font-black text-white">{FA} {scoreA}:{scoreB} {FB}</span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// ─── 10. Cyberpunk ────────────────────────────────────────
const V10 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center justify-between px-3 py-2 mb-1.5"
    style={{ background: 'rgba(0,255,170,0.03)', borderLeft: '2px solid #00ffaa', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
    <span className="font-mono text-emerald-300 text-sm">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="font-mono font-black text-white text-sm" style={{ textShadow: '0 0 8px #00ffaa' }}>{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 11. Retro terminal ───────────────────────────────────
const V11 = () => (
  <div className="rounded-lg p-2 font-mono text-[11px]" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
    {ROWS.map(({ name, scoreA, scoreB }, i) => (
      <div key={name} className="flex gap-2 py-0.5">
        <span className="text-green-600">{'>'}</span>
        <span className="text-slate-400 w-14">{name}</span>
        <span className="text-cyan-400">{FA}</span>
        <span className="text-yellow-400 font-black">{scoreA}</span>
        <span className="text-slate-600">-</span>
        <span className="text-yellow-400 font-black">{scoreB}</span>
        <span className="text-cyan-400">{FB}</span>
      </div>
    ))}
  </div>
);

// ─── 12. Gold gradient border ────────────────────────────
const V12 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="p-px rounded-xl mb-1.5" style={{ background: 'linear-gradient(135deg,#f59e0b,#7c3aed)' }}>
    <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: '#0f172a' }}>
      <span className="text-white/80 text-sm">{name}</span>
      <div className="flex items-center gap-1.5">
        <span>{FA}</span>
        <span className="text-amber-400 font-black">{scoreA}–{scoreB}</span>
        <span>{FB}</span>
      </div>
    </div>
  </div>
));

// ─── 13. Score as big center, name small below ────────────
const V13 = () => (
  <div className="grid grid-cols-5 gap-1.5">
    {ROWS.map(({ name, scoreA, scoreB }) => (
      <div key={name} className="flex flex-col items-center py-2 px-1 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <span className="text-[8px] text-white/40">{FA}–{FB}</span>
        <span className="text-base font-black text-white">{scoreA}:{scoreB}</span>
        <span className="text-[8px] text-white/50 text-center leading-tight">{name}</span>
      </div>
    ))}
  </div>
);

// ─── 14. Split card ───────────────────────────────────────
const V14 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-stretch rounded-xl overflow-hidden mb-1.5" style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}>
    <div className="flex-1 flex items-center px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <span className="text-white/70 text-sm">{name}</span>
    </div>
    <div className="flex items-center gap-1 px-3" style={{ background: 'rgba(59,130,246,0.15)', borderLeft: '0.5px solid rgba(255,255,255,0.1)' }}>
      <span>{FA}</span>
      <span className="font-black text-white text-sm">{scoreA}:{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 15. Spotlight row ────────────────────────────────────
const V15 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center justify-between px-4 py-2.5 rounded-xl mb-1.5 relative overflow-hidden"
    style={{ background: i === 0 ? 'rgba(245,197,24,0.08)' : 'rgba(255,255,255,0.03)', border: i === 0 ? '1px solid rgba(245,197,24,0.3)' : '0.5px solid rgba(255,255,255,0.06)' }}>
    {i === 0 && <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(ellipse at 50% 0,#f5c518,transparent)' }} />}
    <span className={`text-sm font-semibold relative ${i === 0 ? 'text-amber-300' : 'text-white/70'}`}>{name}</span>
    <div className="flex items-center gap-1.5 relative">
      <span>{FA}</span>
      <span className={`font-black text-sm ${i === 0 ? 'text-amber-400' : 'text-white'}`}>{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 16. Bordered segments ────────────────────────────────
const V16 = () => (
  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
    {ROWS.map(({ name, scoreA, scoreB }, i) => (
      <div key={name} className="flex items-center"
        style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
        <div className="flex-1 px-4 py-2.5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-white/75 text-sm">{name}</span>
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2.5">
          <span>{FA}</span>
          <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
          <span>{FB}</span>
        </div>
      </div>
    ))}
  </div>
);

// ─── 17. Neon pink ────────────────────────────────────────
const V17 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center justify-between px-3 py-2 rounded-xl mb-1.5"
    style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.25)' }}>
    <span className="text-pink-200 text-sm font-semibold">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="font-black text-white text-sm px-2 rounded-full" style={{ background: 'rgba(236,72,153,0.25)' }}>{scoreA}:{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 18. Score as colored circle ──────────────────────────
const V18 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center justify-between px-3 py-2 mb-1.5">
    <span className="text-white/70 text-sm">{name}</span>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}>
        <span className="text-xs font-black text-white">{scoreA}</span>
      </div>
      <span className="text-white/20 text-xs">vs</span>
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)' }}>
        <span className="text-xs font-black text-white">{scoreB}</span>
      </div>
    </div>
  </div>
));

// ─── 19. Rank + gradient ──────────────────────────────────
const V19 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1.5"
    style={{ background: `linear-gradient(90deg, rgba(${59 + i * 20},${130 - i * 10},246,0.08) 0%, transparent 100%)`, border: '0.5px solid rgba(255,255,255,0.07)' }}>
    <span className="text-white/25 font-mono text-xs w-4">{i + 1}</span>
    <span className="text-white/75 text-sm flex-1">{name}</span>
    <span>{FA}</span>
    <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
    <span>{FB}</span>
  </div>
));

// ─── 20. Floating card with shadow ───────────────────────
const V20 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center justify-between px-4 py-3 rounded-2xl mb-2"
    style={{ background: '#1e2940', boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06)' }}>
    <span className="text-slate-300 text-sm font-medium">{name}</span>
    <div className="flex items-center gap-2">
      <span>{FA}</span>
      <span className="bg-slate-700 px-2 py-0.5 rounded-lg text-white font-black text-sm">{scoreA}:{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 21. Horizontal flip — score left, name right ─────────
const V21 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
    <div className="flex items-center gap-1 flex-shrink-0">
      <span>{FA}</span>
      <span className="font-black text-amber-400 text-sm">{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
    <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
    <span className="text-white/70 text-sm">{name}</span>
  </div>
));

// ─── 22. Card with top score bar ─────────────────────────
const V22 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="rounded-xl overflow-hidden mb-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
    <div className="h-0.5" style={{ background: STRIPE_COLORS[i] }} />
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-white/75 text-sm">{name}</span>
      <div className="flex items-center gap-1.5">
        <span>{FA}</span>
        <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
        <span>{FB}</span>
      </div>
    </div>
  </div>
));

// ─── 23. Emoji avatar + row ───────────────────────────────
const AVATARS = ['🧑','👦','👩','🧔','👱'];
const V23 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center gap-2.5 px-3 py-2 rounded-xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
    <span className="text-xl">{AVATARS[i]}</span>
    <span className="text-white/75 text-sm flex-1">{name}</span>
    <span>{FA}</span>
    <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
    <span>{FB}</span>
  </div>
));

// ─── 24. Score badge right ────────────────────────────────
const V24 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
    <span className="text-white/70 text-sm flex-1">{name}</span>
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <span className="text-sm">{FA}</span>
      <span className="font-black text-sm text-white">{scoreA}</span>
      <span className="text-white/30 text-xs">:</span>
      <span className="font-black text-sm text-white">{scoreB}</span>
      <span className="text-sm">{FB}</span>
    </div>
  </div>
));

// ─── 25. Minimal — just name + score ─────────────────────
const V25 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center py-2" style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
    <span className="text-white/55 text-sm flex-1">{name}</span>
    <span className="font-black text-white text-sm">{scoreA} – {scoreB}</span>
  </div>
));

// ─── 26. Progress highlight ───────────────────────────────
const V26 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="relative flex items-center justify-between px-3 py-2.5 rounded-xl mb-1.5 overflow-hidden">
    <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, rgba(59,130,246,${0.15 - i * 0.02}) 0%, transparent 60%)` }} />
    <div className="absolute inset-0" style={{ border: '0.5px solid rgba(255,255,255,0.07)' , borderRadius: 12}} />
    <span className="relative text-white/80 text-sm font-medium">{name}</span>
    <div className="relative flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 27. Score as scoreboard digits ───────────────────────
const V27 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1.5"
    style={{ background: '#111', border: '1px solid #222' }}>
    <span className="text-slate-400 text-sm flex-1 font-mono">{name}</span>
    <div className="flex items-center gap-1">
      <span>{FA}</span>
      <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: '#000', border: '1px solid #333' }}>
        <span className="font-mono font-black text-red-500 text-base" style={{ textShadow: '0 0 8px #ef4444' }}>{scoreA}</span>
        <span className="text-slate-700 font-mono">:</span>
        <span className="font-mono font-black text-red-500 text-base" style={{ textShadow: '0 0 8px #ef4444' }}>{scoreB}</span>
      </div>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 28. Glassmorphism + avatar initials ─────────────────
const V28 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center gap-2.5 px-3 py-2 rounded-2xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)' }}>
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
      style={{ background: STRIPE_COLORS[i] }}>
      {name.slice(-1)}
    </div>
    <span className="text-white/80 text-sm flex-1">{name}</span>
    <span>{FA}</span>
    <span className="font-black text-white">{scoreA}:{scoreB}</span>
    <span>{FB}</span>
  </div>
));

// ─── 29. Score box framed ────────────────────────────────
const V29 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center gap-2 px-3 py-2 mb-1.5">
    <span className="text-white/65 text-sm flex-1">{name}</span>
    <div className="flex items-center gap-0 overflow-hidden rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
      <div className="px-2 py-1 flex items-center gap-1" style={{ background: 'rgba(59,130,246,0.15)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <span className="text-sm">{FA}</span>
        <span className="font-black text-white text-sm">{scoreA}</span>
      </div>
      <div className="px-2 py-1 flex items-center gap-1" style={{ background: 'rgba(34,197,94,0.15)' }}>
        <span className="font-black text-white text-sm">{scoreB}</span>
        <span className="text-sm">{FB}</span>
      </div>
    </div>
  </div>
));

// ─── 30. Art deco horizontal ─────────────────────────────
const V30 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center justify-between px-3 py-2 mb-1.5"
    style={{ background: '#0d0a00', borderLeft: '3px solid #b45309', borderBottom: i < 4 ? '1px solid #1a1200' : 'none' }}>
    <span className="text-amber-200/70 text-sm font-medium">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="font-black text-amber-400 text-sm">{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 31. Ticker tape ──────────────────────────────────────
const V31 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center gap-2 px-3 py-1.5 mb-1 rounded" style={{ background: '#0a0a0a', fontFamily: 'monospace' }}>
    <span className="text-green-500 text-[10px]">{name.replace('שחקן', 'PLR')}</span>
    <span className="text-slate-600 text-[10px]">|</span>
    <span className="text-yellow-400 text-xs font-bold">{FA}{scoreA}-{scoreB}{FB}</span>
    <span className="text-slate-600 text-[10px]">|</span>
    <span className="text-slate-700 text-[9px]">{'▓'.repeat(scoreA + scoreB + 1)}</span>
  </div>
));

// ─── 32. Colored score text ───────────────────────────────
const V32 = () => ROWS.map(({ name, scoreA, scoreB }) => {
  const winner = scoreA > scoreB ? 'home' : scoreA < scoreB ? 'away' : 'draw';
  return (
    <div key={name} className="flex items-center justify-between px-3 py-2 rounded-xl mb-1.5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
      <span className="text-white/75 text-sm">{name}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{FA}</span>
        <span className={`font-black text-sm ${winner === 'home' ? 'text-blue-400' : winner === 'draw' ? 'text-yellow-400' : 'text-slate-400'}`}>{scoreA}</span>
        <span className="text-white/20">–</span>
        <span className={`font-black text-sm ${winner === 'away' ? 'text-green-400' : winner === 'draw' ? 'text-yellow-400' : 'text-slate-400'}`}>{scoreB}</span>
        <span className="text-sm">{FB}</span>
      </div>
    </div>
  );
});

// ─── 33. Stacked with connecting line ────────────────────
const V33 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center gap-2 mb-0">
    <div className="flex flex-col items-center">
      <div className="w-2 h-2 rounded-full" style={{ background: STRIPE_COLORS[i] }} />
      {i < 4 && <div className="w-px flex-1 mt-0.5" style={{ background: 'rgba(255,255,255,0.1)', minHeight: 12 }} />}
    </div>
    <div className="flex items-center justify-between flex-1 px-3 py-1.5 rounded-lg mb-1"
      style={{ background: 'rgba(255,255,255,0.04)' }}>
      <span className="text-white/70 text-sm">{name}</span>
      <div className="flex items-center gap-1">
        <span>{FA}</span>
        <span className="font-black text-white text-sm">{scoreA}:{scoreB}</span>
        <span>{FB}</span>
      </div>
    </div>
  </div>
));

// ─── 34. Score first big, then name ──────────────────────
const V34 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
    <div className="flex items-center gap-1 flex-shrink-0">
      <span>{FA}</span>
      <span className="text-lg font-black text-white leading-none">{scoreA}</span>
      <span className="text-white/30">:</span>
      <span className="text-lg font-black text-white leading-none">{scoreB}</span>
      <span>{FB}</span>
    </div>
    <span className="text-white/45 text-xs">{name}</span>
  </div>
));

// ─── 35. Bubble clusters ─────────────────────────────────
const V35 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center gap-2 px-2 py-1.5 rounded-2xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
      style={{ background: `rgba(${59 + i * 30},${130 - i * 15},246,0.4)` }}>{i + 1}</div>
    <span className="text-white/70 text-sm flex-1">{name}</span>
    <div className="flex items-center gap-1">
      <span>{FA}</span>
      <div className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
      </div>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 36. Brick / mosaic ───────────────────────────────────
const V36 = () => (
  <div className="grid grid-cols-1 gap-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
    {ROWS.map(({ name, scoreA, scoreB }) => (
      <div key={name} className="flex items-center justify-between px-3 py-2.5"
        style={{ background: '#0f172a' }}>
        <span className="text-white/70 text-sm">{name}</span>
        <div className="flex items-center gap-1.5">
          <span>{FA}</span>
          <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
          <span>{FB}</span>
        </div>
      </div>
    ))}
  </div>
);

// ─── 37. Neon green glow ─────────────────────────────────
const V37 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center justify-between px-3 py-2 rounded-xl mb-1.5"
    style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', boxShadow: '0 0 8px rgba(34,197,94,0.08)' }}>
    <span className="text-green-200/80 text-sm font-semibold">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="font-black text-white text-sm" style={{ textShadow: '0 0 6px #22c55e' }}>{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 38. Flip score reveal ────────────────────────────────
const V38 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
    <span className="text-white/70 text-sm flex-1">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      {[scoreA, scoreB].map((s, j) => (
        <div key={j} className="w-7 h-8 flex items-center justify-center rounded-md"
          style={{ background: 'linear-gradient(180deg,#1e293b 50%,#0f172a 50%)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="font-black text-white text-base">{s}</span>
        </div>
      ))}
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 39. Colored background by result ────────────────────
const V39 = () => ROWS.map(({ name, scoreA, scoreB }) => {
  const win = scoreA > scoreB ? '#1e3a8a' : scoreA < scoreB ? '#14532d' : '#713f12';
  return (
    <div key={name} className="flex items-center justify-between px-3 py-2 rounded-xl mb-1.5"
      style={{ background: `${win}30`, border: `1px solid ${win}60` }}>
      <span className="text-white/80 text-sm">{name}</span>
      <div className="flex items-center gap-1.5">
        <span>{FA}</span>
        <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
        <span>{FB}</span>
      </div>
    </div>
  );
});

// ─── 40. Transparent with hover-like highlight ────────────
const V40 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center justify-between px-3 py-2.5 rounded-xl mb-1"
    style={{ background: i === 0 ? 'rgba(255,255,255,0.08)' : 'transparent', borderLeft: i === 0 ? '2px solid #f59e0b' : '2px solid transparent' }}>
    <span className={`text-sm font-medium ${i === 0 ? 'text-white' : 'text-white/55'}`}>{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className={`font-black text-sm ${i === 0 ? 'text-amber-400' : 'text-white/60'}`}>{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 41. Score as VS card ─────────────────────────────────
const V41 = () => (
  <div className="grid grid-cols-2 gap-1.5">
    {ROWS.slice(0, 4).map(({ name, scoreA, scoreB }) => (
      <div key={name} className="flex flex-col items-center py-2 px-1 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <span className="text-[10px] text-white/50 mb-1">{name}</span>
        <div className="flex items-center gap-1">
          <span>{FA}</span>
          <span className="font-black text-white text-sm">{scoreA}</span>
          <span className="text-white/30 text-xs">vs</span>
          <span className="font-black text-white text-sm">{scoreB}</span>
          <span>{FB}</span>
        </div>
      </div>
    ))}
  </div>
);

// ─── 42. Score as horizontal gauge ───────────────────────
const V42 = () => ROWS.map(({ name, scoreA, scoreB }) => {
  const total = scoreA + scoreB || 1;
  return (
    <div key={name} className="flex flex-col gap-0.5 mb-2">
      <div className="flex justify-between text-[10px]">
        <span className="text-white/60">{name}</span>
        <span className="font-bold text-white">{FA}{scoreA}–{scoreB}{FB}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ width: `${(scoreA / total) * 100}%`, background: '#3b82f6' }} />
        <div style={{ width: `${(scoreB / total) * 100}%`, background: '#22c55e' }} />
      </div>
    </div>
  );
});

// ─── 43. Holographic row ──────────────────────────────────
const V43 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center justify-between px-3 py-2 rounded-xl mb-1.5"
    style={{ background: `linear-gradient(90deg, rgba(${[255,100,50,30,10][i]},${[0,100,200,100,50][i]},${[255,200,100,200,255][i]},0.08) 0%, transparent 100%)`,
      border: '0.5px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
    <span className="text-white/80 text-sm">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 44. Minimalist underline ────────────────────────────
const V44 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-end justify-between py-2"
    style={{ borderBottom: `1px solid ${i < 4 ? STRIPE_COLORS[i] + '40' : 'transparent'}` }}>
    <span className="text-white/60 text-sm">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 45. Score in speech bubble right ────────────────────
const V45 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center gap-3 mb-2">
    <span className="text-white/65 text-sm flex-1">{name}</span>
    <div className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
      style={{ background: '#1e40af' }}>
      <span>{FA}</span>
      <span className="font-black text-white text-sm">{scoreA}:{scoreB}</span>
      <span>{FB}</span>
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45" style={{ background: '#1e40af' }} />
    </div>
  </div>
));

// ─── 46. Glassy pill full row ─────────────────────────────
const V46 = () => ROWS.map(({ name, scoreA, scoreB }) => (
  <div key={name} className="flex items-center justify-between px-4 py-2 rounded-full mb-1.5"
    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
    <span className="text-white/80 text-sm font-medium">{name}</span>
    <div className="flex items-center gap-1.5">
      <span>{FA}</span>
      <span className="font-black text-white text-sm">{scoreA}–{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

// ─── 47. Dark card + accent dot ──────────────────────────
const V47 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-xl mb-1.5"
    style={{ background: '#111827', border: '1px solid #1f2937' }}>
    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: STRIPE_COLORS[i] }} />
    <span className="text-slate-400 text-sm flex-1">{name}</span>
    <span>{FA}</span>
    <span className="font-black text-white text-sm">{scoreA}:{scoreB}</span>
    <span>{FB}</span>
  </div>
));

// ─── 48. Score on left, user avatar pill on right ─────────
const V48 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-xl mb-1.5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
    <span className="text-white/70 text-sm flex-1">{name}</span>
    <span className="text-sm">{FA}</span>
    <span className="px-2 py-0.5 rounded-full text-sm font-black text-white"
      style={{ background: STRIPE_COLORS[i], minWidth: 32, textAlign: 'center' }}>{scoreA}:{scoreB}</span>
    <span className="text-sm">{FB}</span>
  </div>
));

// ─── 49. Large mosaic (2-up grid) ────────────────────────
const V49 = () => (
  <div className="grid grid-cols-2 gap-2">
    {ROWS.map(({ name, scoreA, scoreB }, i) => (
      <div key={name} className={`flex flex-col items-center justify-center py-3 rounded-xl ${i === 0 ? 'col-span-2' : ''}`}
        style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-1.5">
          <span>{FA}</span>
          <span className={`font-black text-white ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{scoreA}:{scoreB}</span>
          <span>{FB}</span>
        </div>
        <span className="text-[10px] text-white/40 mt-0.5">{name}</span>
      </div>
    ))}
  </div>
);

// ─── 50. Retro chip + score panel ────────────────────────
const V50 = () => ROWS.map(({ name, scoreA, scoreB }, i) => (
  <div key={name} className="flex items-center gap-0 mb-1.5 overflow-hidden rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
    <div className="px-3 py-2.5 flex items-center justify-center min-w-[32px]"
      style={{ background: STRIPE_COLORS[i], writingMode: 'horizontal-tb' }}>
      <span className="text-white font-black text-xs">{i + 1}</span>
    </div>
    <div className="flex-1 px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <span className="text-white/75 text-sm">{name}</span>
    </div>
    <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <span>{FA}</span>
      <span className="font-black text-white text-sm">{scoreA}:{scoreB}</span>
      <span>{FB}</span>
    </div>
  </div>
));

const VARIANTS = [
  { n: 1,  name: 'נוכחי — Glass rows',               C: V1  },
  { n: 2,  name: 'Scoreboard dark + zebra',          C: V2  },
  { n: 3,  name: 'Left color stripe',                C: V3  },
  { n: 4,  name: 'Blue neon glow',                   C: V4  },
  { n: 5,  name: 'Pill score badge',                 C: V5  },
  { n: 6,  name: 'Score centered large',             C: V6  },
  { n: 7,  name: 'Timeline dots',                    C: V7  },
  { n: 8,  name: 'Glassmorphism intense',            C: V8  },
  { n: 9,  name: 'Compact table',                    C: V9  },
  { n: 10, name: 'Cyberpunk angular',                C: V10 },
  { n: 11, name: 'Terminal monospace',               C: V11 },
  { n: 12, name: 'Gradient border (rainbow)',        C: V12 },
  { n: 13, name: 'Score top, name bottom (grid)',    C: V13 },
  { n: 14, name: 'Split card — name / score',        C: V14 },
  { n: 15, name: 'Spotlight first row',              C: V15 },
  { n: 16, name: 'Bordered segments table',          C: V16 },
  { n: 17, name: 'Pink neon glow',                   C: V17 },
  { n: 18, name: 'Score in circles',                 C: V18 },
  { n: 19, name: 'Rank + gradient fade',             C: V19 },
  { n: 20, name: 'Floating cards dark',              C: V20 },
  { n: 21, name: 'Score left, name right',           C: V21 },
  { n: 22, name: 'Top color bar per row',            C: V22 },
  { n: 23, name: 'Emoji avatar per player',          C: V23 },
  { n: 24, name: 'Score badge box',                  C: V24 },
  { n: 25, name: 'Ultra minimal',                    C: V25 },
  { n: 26, name: 'Background gradient progress',     C: V26 },
  { n: 27, name: 'LED scoreboard digits',            C: V27 },
  { n: 28, name: 'Glassmorphism + initials avatar',  C: V28 },
  { n: 29, name: 'Score split box (blue/green)',     C: V29 },
  { n: 30, name: 'Art deco left border',             C: V30 },
  { n: 31, name: 'Ticker tape monospace',            C: V31 },
  { n: 32, name: 'Winner colored score text',        C: V32 },
  { n: 33, name: 'Stacked with connector line',      C: V33 },
  { n: 34, name: 'Score big left, name small',       C: V34 },
  { n: 35, name: 'Bubble number + pill score',       C: V35 },
  { n: 36, name: 'Mosaic brick rows',                C: V36 },
  { n: 37, name: 'Green neon glow',                  C: V37 },
  { n: 38, name: 'Split-flap score digits',          C: V38 },
  { n: 39, name: 'Background color by result',       C: V39 },
  { n: 40, name: 'Hover-like highlight first',       C: V40 },
  { n: 41, name: 'VS card grid (2×2)',               C: V41 },
  { n: 42, name: 'Gauge bar per score',              C: V42 },
  { n: 43, name: 'Holographic gradient',             C: V43 },
  { n: 44, name: 'Minimalist colored underline',     C: V44 },
  { n: 45, name: 'Speech bubble right',              C: V45 },
  { n: 46, name: 'Full-row pill',                    C: V46 },
  { n: 47, name: 'Dark card + accent dot',           C: V47 },
  { n: 48, name: 'Colored score pill center',        C: V48 },
  { n: 49, name: 'Mosaic grid (1 large + 4 small)',  C: V49 },
  { n: 50, name: 'Numbered chip + score panel',      C: V50 },
];

export default function AdminPredictionsRowDemo() {
  const [filter, setFilter] = useState('');

  const filtered = VARIANTS.filter(v =>
    filter === '' || v.name.toLowerCase().includes(filter.toLowerCase()) || String(v.n) === filter
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">עיצובי שורות ניחושים — 50 וריאציות</h2>
        <p className="text-slate-400 text-sm">דמו: 5 שחקנים · 🇰🇷 vs 🇨🇿</p>
      </div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="חפש לפי מספר או שם..."
        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-700 border border-slate-600 text-white placeholder-slate-400"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(({ n, name, C }) => (
          <div key={n} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <Label n={n} name={name} />
            <C />
          </div>
        ))}
      </div>
    </div>
  );
}
