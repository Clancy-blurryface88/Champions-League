import React, { useState } from 'react';

const SCORES = [
  { score: '1:0', pct: 18 },
  { score: '1:1', pct: 15 },
  { score: '2:1', pct: 12 },
  { score: '0:1', pct: 11 },
  { score: '2:0', pct: 10 },
];

const Label = ({ n, name }) => (
  <div className="mb-2 flex items-center gap-2">
    <span className="text-xs font-black text-slate-500 w-6 text-right">{n}</span>
    <span className="text-xs text-slate-400">{name}</span>
  </div>
);

// ─── 1. Current neon pills ────────────────────────────────
const V1 = () => (
  <div className="flex flex-wrap gap-1.5 justify-center">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.5)', boxShadow: '0 0 10px rgba(59,130,246,0.25)' }}>
        <span className="text-[11px] font-black text-white">{score}</span>
        <span className="text-[9px] text-blue-300">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 2. Playing cards ─────────────────────────────────────
const V2 = () => (
  <div className="flex gap-2 justify-center">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex flex-col items-center justify-between w-10 h-14 rounded-lg p-1"
        style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <span className="text-[9px] font-black text-slate-800 self-start leading-none">{pct}%</span>
        <span className="text-xs font-black text-blue-700">{score}</span>
        <span className="text-[9px] font-black text-slate-800 self-end rotate-180 leading-none">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 3. Scoreboard rows ───────────────────────────────────
const V3 = () => (
  <div className="rounded-lg overflow-hidden" style={{ background: '#0d1117', border: '1px solid #21262d' }}>
    <div className="flex px-3 py-1" style={{ background: '#161b22', borderBottom: '1px solid #21262d' }}>
      <span className="text-[9px] font-mono text-slate-500 flex-1">RESULT</span>
      <span className="text-[9px] font-mono text-slate-500">PROB</span>
    </div>
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex items-center px-3 py-1.5"
        style={{ borderBottom: i < 4 ? '1px solid #21262d' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
        <span className="flex-1 font-mono text-xs text-green-400">{score}</span>
        <div className="w-16 h-1 rounded-full bg-slate-700 mr-2 overflow-hidden">
          <div className="h-full rounded-full bg-green-500" style={{ width: `${(pct / 18) * 100}%` }} />
        </div>
        <span className="font-mono text-[10px] text-slate-400 w-7 text-right">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 4. Ticket / coupon ───────────────────────────────────
const V4 = () => (
  <div className="flex gap-2 justify-center">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="relative flex flex-col items-center w-12"
        style={{ background: 'linear-gradient(180deg,#1e40af,#1d4ed8)', borderRadius: 6 }}>
        <div className="w-full flex justify-center py-1.5">
          <span className="text-sm font-black text-white">{score}</span>
        </div>
        <div className="w-full h-px border-t border-dashed border-blue-400/40" />
        <div className="w-full flex justify-center py-1">
          <span className="text-[9px] font-bold text-blue-200">{pct}%</span>
        </div>
        {/* notch */}
        <div className="absolute -left-1.5 top-1/2 w-3 h-3 rounded-full" style={{ background: '#1e293b', transform: 'translateY(-50%)' }} />
        <div className="absolute -right-1.5 top-1/2 w-3 h-3 rounded-full" style={{ background: '#1e293b', transform: 'translateY(-50%)' }} />
      </div>
    ))}
  </div>
);

// ─── 5. Jersey number style ───────────────────────────────
const V5 = () => (
  <div className="flex gap-2 justify-center">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center w-12 py-2 rounded-lg"
        style={{ background: 'linear-gradient(180deg,#0f172a 0%,#1e293b 100%)', border: '2px solid #f59e0b' }}>
        <span className="text-xs font-black text-amber-400 tracking-tighter">{score}</span>
        <span className="text-[8px] text-slate-400 mt-0.5">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 6. LED display ───────────────────────────────────────
const V6 = () => (
  <div className="flex gap-2 justify-center p-2 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center px-2 py-1.5 rounded"
        style={{ background: '#111', border: '1px solid #222' }}>
        <span className="font-mono text-xs font-bold text-red-500" style={{ textShadow: '0 0 8px #ef4444' }}>{score}</span>
        <span className="font-mono text-[8px] text-red-900 mt-0.5">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 7. Podium / ranking ─────────────────────────────────
const V7 = () => {
  const heights = [60, 45, 35, 28, 22];
  const colors = ['#f59e0b', '#94a3b8', '#b45309', '#475569', '#334155'];
  return (
    <div className="flex items-end justify-center gap-1.5 h-20">
      {SCORES.map(({ score, pct }, i) => (
        <div key={score} className="flex flex-col items-center justify-end gap-0.5" style={{ height: heights[i], flex: 1 }}>
          <span className="text-[8px] text-white/60">{pct}%</span>
          <div className="w-full rounded-t flex items-end justify-center pb-0.5"
            style={{ background: colors[i], height: `${heights[i] - 16}px` }}>
            <span className="text-[9px] font-black text-white/90">{score}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── 8. Hexagon tiles ─────────────────────────────────────
const Hex = ({ score, pct, color }) => (
  <div className="flex flex-col items-center">
    <svg viewBox="0 0 60 52" width="56" height="48">
      <polygon points="30,2 58,16 58,36 30,50 2,36 2,16"
        fill={color} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="30" y="26" textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize="10" fontWeight="bold">{score}</text>
      <text x="30" y="37" textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,255,255,0.6)" fontSize="7">{pct}%</text>
    </svg>
  </div>
);
const V8 = () => {
  const cols = ['#1d4ed8', '#0369a1', '#0f766e', '#059669', '#16a34a'];
  return (
    <div className="flex justify-center gap-1">
      {SCORES.map(({ score, pct }, i) => <Hex key={score} score={score} pct={pct} color={cols[i]} />)}
    </div>
  );
};

// ─── 9. Cyberpunk / angular ───────────────────────────────
const V9 = () => (
  <div className="flex gap-1.5 justify-center">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center px-2.5 py-1.5 relative"
        style={{ background: 'rgba(0,255,170,0.05)', border: '1px solid rgba(0,255,170,0.4)',
          clipPath: 'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)',
          boxShadow: '0 0 12px rgba(0,255,170,0.2)' }}>
        <span className="text-xs font-black text-emerald-300" style={{ textShadow: '0 0 8px #10b981' }}>{score}</span>
        <span className="text-[8px] text-emerald-500">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 10. Terminal / monospace ─────────────────────────────
const V10 = () => (
  <div className="rounded-lg p-2 font-mono text-[11px]" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
    <div className="text-green-500 mb-1">$ top_scores --limit 5</div>
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex gap-2">
        <span className="text-slate-600">[{i + 1}]</span>
        <span className="text-cyan-400">{score}</span>
        <span className="text-slate-500">{'·'.repeat(Math.max(1, 8 - score.length))}</span>
        <span className="text-yellow-400">{pct}%</span>
        <span className="text-slate-700">{'█'.repeat(Math.round(pct / 3))}</span>
      </div>
    ))}
  </div>
);

// ─── 11. Glassmorphism cards ──────────────────────────────
const V11 = () => (
  <div className="flex gap-2 justify-center">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center px-2.5 py-2 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.25)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.3)' }}>
        <span className="text-sm font-black text-white">{score}</span>
        <span className="text-[9px] text-white/50 mt-0.5">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 12. Flame / hot gradient ─────────────────────────────
const V12 = () => {
  const flames = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
  return (
    <div className="flex gap-1.5 justify-center items-end">
      {SCORES.map(({ score, pct }, i) => (
        <div key={score} className="flex-1 flex flex-col items-center py-1.5 rounded-xl"
          style={{ background: `${flames[i]}18`, border: `1px solid ${flames[i]}60`, boxShadow: `0 0 10px ${flames[i]}30` }}>
          <span className="text-xs font-black text-white">{score}</span>
          <span className="text-[8px] mt-0.5" style={{ color: flames[i] }}>{pct}%</span>
        </div>
      ))}
    </div>
  );
};

// ─── 13. Split-flap display ───────────────────────────────
const V13 = () => (
  <div className="flex gap-1.5 justify-center">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center overflow-hidden rounded"
        style={{ background: '#1a1a2e', border: '1px solid #16213e', minWidth: 44 }}>
        <div className="w-full flex justify-center py-1.5" style={{ background: '#16213e', borderBottom: '2px solid #0f3460' }}>
          <span className="font-mono text-xs font-black text-amber-400" style={{ letterSpacing: 2 }}>{score}</span>
        </div>
        <div className="w-full flex justify-center py-1">
          <span className="font-mono text-[9px] text-slate-400">{pct}%</span>
        </div>
      </div>
    ))}
  </div>
);

// ─── 14. Casino chip ─────────────────────────────────────
const Chip = ({ score, pct }) => (
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 rounded-full flex flex-col items-center justify-center relative"
      style={{ background: 'radial-gradient(circle,#dc2626,#991b1b)',
        border: '3px solid white',
        boxShadow: '0 0 0 3px #dc2626, 0 4px 12px rgba(0,0,0,0.5)' }}>
      <span className="text-[10px] font-black text-white leading-none">{score}</span>
      <span className="text-[7px] text-red-200 leading-none">{pct}%</span>
    </div>
  </div>
);
const V14 = () => (
  <div className="flex gap-2 justify-center flex-wrap">
    {SCORES.map(({ score, pct }) => <Chip key={score} score={score} pct={pct} />)}
  </div>
);

// ─── 15. Newspaper cutout ─────────────────────────────────
const V15 = () => (
  <div className="flex flex-wrap gap-1.5 justify-center">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="px-2 py-1 rounded"
        style={{ background: '#f5f0e8', border: '1px solid #d4c9a8',
          boxShadow: '1px 1px 3px rgba(0,0,0,0.3)', fontFamily: 'Georgia, serif' }}>
        <span className="text-xs font-black text-gray-900">{score}</span>
        <span className="text-[9px] text-gray-500 ml-1">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 16. Blueprint technical ──────────────────────────────
const V16 = () => (
  <div className="rounded-lg p-2" style={{ background: '#1a3a5c', border: '1px solid #2563eb' }}>
    <div className="flex justify-between mb-1">
      {['RES', 'PROB', 'BAR'].map(h => (
        <span key={h} className="text-[8px] font-mono text-blue-300/60 uppercase tracking-widest">{h}</span>
      ))}
    </div>
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex items-center gap-2 py-0.5" style={{ borderTop: '1px dashed rgba(37,99,235,0.3)' }}>
        <span className="font-mono text-[10px] text-blue-200 w-8">{score}</span>
        <span className="font-mono text-[10px] text-blue-300 w-7">{pct}%</span>
        <div className="flex-1 h-1 bg-blue-900/50">
          <div className="h-full bg-blue-400" style={{ width: `${(pct / 18) * 100}%` }} />
        </div>
      </div>
    ))}
  </div>
);

// ─── 17. Neon sign ────────────────────────────────────────
const V17 = () => (
  <div className="flex gap-1.5 flex-wrap justify-center p-2 rounded-xl" style={{ background: '#0a0012' }}>
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="px-2.5 py-1 rounded-full"
        style={{ border: '1.5px solid #c084fc',
          boxShadow: '0 0 8px #a855f7, inset 0 0 8px rgba(168,85,247,0.1)',
          color: '#e9d5ff' }}>
        <span className="text-[11px] font-black">{score}</span>
        <span className="text-[9px] ml-1 opacity-60">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 18. Polaroid photos ─────────────────────────────────
const V18 = () => (
  <div className="flex gap-2 justify-center">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center p-1.5 pb-3"
        style={{ background: 'white', boxShadow: '0 3px 12px rgba(0,0,0,0.4)', transform: `rotate(${(Math.random() - 0.5) * 6}deg)` }}>
        <div className="w-10 h-8 flex items-center justify-center mb-1"
          style={{ background: 'linear-gradient(135deg,#dbeafe,#ede9fe)' }}>
          <span className="text-sm font-black text-slate-700">{score}</span>
        </div>
        <span className="text-[8px] text-slate-500 font-medium">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 19. Arc / semicircle ─────────────────────────────────
const Arc = ({ score, pct }) => {
  const r = 18, cx = 22, cy = 22;
  const circ = Math.PI * r;
  const dash = (pct / 18) * circ;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="44" height="26" viewBox="0 0 44 26">
        <path d={`M4,22 A18,18 0 0,1 40,22`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <path d={`M4,22 A18,18 0 0,1 40,22`} fill="none" stroke="#3b82f6" strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        <text x="22" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{score}</text>
      </svg>
      <span className="text-[8px] text-white/50">{pct}%</span>
    </div>
  );
};
const V19 = () => (
  <div className="flex gap-1 justify-center">
    {SCORES.map(s => <Arc key={s.score} {...s} />)}
  </div>
);

// ─── 20. Minecraft pixel ──────────────────────────────────
const V20 = () => (
  <div className="flex gap-1.5 justify-center p-2" style={{ background: '#2d2d2d', imageRendering: 'pixelated' }}>
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center px-2 py-1.5"
        style={{ background: '#3c3c3c', border: '2px solid', borderColor: '#555 #222 #222 #555',
          fontFamily: '"Courier New", monospace' }}>
        <span className="text-[10px] font-black text-yellow-400">{score}</span>
        <span className="text-[8px] text-white/50">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 21. Constellation stars ──────────────────────────────
const V21 = () => (
  <div className="relative h-20 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63)' }}>
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="absolute flex flex-col items-center"
        style={{ left: `${10 + i * 18}%`, top: `${20 + (i % 2) * 30}%` }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'white', boxShadow: '0 0 6px white' }} />
        <span className="text-[8px] font-bold text-white mt-0.5">{score}</span>
        <span className="text-[7px] text-white/40">{pct}%</span>
      </div>
    ))}
    {/* connector lines */}
    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
      <polyline points="12,24 30,44 48,24 66,44 84,24" fill="none" stroke="white" strokeWidth="0.5" />
    </svg>
  </div>
);

// ─── 22. Stamp collection ─────────────────────────────────
const V22 = () => (
  <div className="flex gap-2 justify-center flex-wrap">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center p-2"
        style={{ background: '#fafafa', border: '2px solid #e2e8f0',
          borderImage: 'repeating-linear-gradient(45deg,#cbd5e1 0,#cbd5e1 4px,transparent 0,transparent 50%) 4',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <span className="text-xs font-black text-slate-800">{score}</span>
        <span className="text-[8px] text-slate-500">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 23. Heatmap tiles ───────────────────────────────────
const V23 = () => {
  const max = 18;
  return (
    <div className="flex gap-1 justify-center">
      {SCORES.map(({ score, pct }) => {
        const intensity = pct / max;
        const r = Math.round(30 + intensity * 200);
        const g = Math.round(50 + intensity * 60);
        const b = Math.round(200 - intensity * 150);
        return (
          <div key={score} className="flex flex-col items-center py-2 px-2 rounded-lg flex-1"
            style={{ background: `rgb(${r},${g},${b})` }}>
            <span className="text-xs font-black text-white">{score}</span>
            <span className="text-[8px] text-white/70">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── 24. Floating bubbles ─────────────────────────────────
const V24 = () => {
  const sizes = [48, 42, 38, 34, 30];
  return (
    <div className="flex items-center justify-center gap-1">
      {SCORES.map(({ score, pct }, i) => (
        <div key={score} className="flex flex-col items-center justify-center rounded-full"
          style={{ width: sizes[i], height: sizes[i],
            background: `radial-gradient(circle at 35% 35%, rgba(99,179,237,0.9), rgba(49,130,206,0.7))`,
            boxShadow: `0 ${2 + i}px ${8 + i * 2}px rgba(49,130,206,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)` }}>
          <span className="text-[9px] font-black text-white leading-none">{score}</span>
          <span className="text-[7px] text-white/60 leading-none">{pct}%</span>
        </div>
      ))}
    </div>
  );
};

// ─── 25. Art deco panels ─────────────────────────────────
const V25 = () => (
  <div className="flex gap-0 justify-center overflow-hidden rounded-xl" style={{ border: '1px solid #b45309' }}>
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex-1 flex flex-col items-center py-2"
        style={{ background: i % 2 === 0 ? '#1c1407' : '#0f0b03',
          borderRight: i < 4 ? '1px solid #78350f' : 'none' }}>
        <div className="w-full flex justify-center py-0.5" style={{ borderBottom: '1px solid #78350f40' }}>
          <span className="text-xs font-black text-amber-400">{score}</span>
        </div>
        <span className="text-[8px] text-amber-700 mt-1">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 26. Speech bubbles ───────────────────────────────────
const V26 = () => (
  <div className="flex gap-2 justify-center flex-wrap">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="relative px-2.5 py-1.5 rounded-xl"
        style={{ background: i % 2 === 0 ? '#1e40af' : '#6d28d9', maxWidth: 56 }}>
        <span className="text-xs font-black text-white block text-center">{score}</span>
        <span className="text-[8px] text-white/50 block text-center">{pct}%</span>
        <div className="absolute -bottom-1.5 left-1/2 w-3 h-3 -translate-x-1/2 rotate-45"
          style={{ background: i % 2 === 0 ? '#1e40af' : '#6d28d9' }} />
      </div>
    ))}
  </div>
);

// ─── 27. Slot machine row ─────────────────────────────────
const V27 = () => (
  <div className="flex justify-center gap-1">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center overflow-hidden"
        style={{ background: '#1a1a1a', border: '2px solid #333', borderRadius: 4, minWidth: 44 }}>
        <div className="w-full h-1" style={{ background: 'linear-gradient(90deg,#555,#888,#555)' }} />
        <div className="py-2 px-1 flex flex-col items-center">
          <span className="font-mono text-sm font-black" style={{ color: '#ffd700', textShadow: '0 0 8px #ffd700' }}>{score}</span>
          <span className="font-mono text-[8px] text-slate-500">{pct}%</span>
        </div>
        <div className="w-full h-1" style={{ background: 'linear-gradient(90deg,#555,#888,#555)' }} />
      </div>
    ))}
  </div>
);

// ─── 28. Vinyl record tracks ─────────────────────────────
const V28 = () => (
  <div className="flex gap-1.5 justify-center">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="w-12 h-12 rounded-full flex flex-col items-center justify-center"
        style={{ background: 'radial-gradient(circle at center,#1a1a1a 30%,#2d2d2d 30%,#111 40%,#2d2d2d 40%,#111 50%,#2d2d2d 50%,#0a0a0a 100%)',
          border: '2px solid #333', boxShadow: '0 3px 10px rgba(0,0,0,0.5)' }}>
        <span className="text-[9px] font-black text-white">{score}</span>
        <span className="text-[7px] text-white/40">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 29. Price tag ────────────────────────────────────────
const V29 = () => (
  <div className="flex gap-1.5 justify-center flex-wrap">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="relative flex flex-col items-center px-2.5 py-1 rounded-r-full"
        style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', border: '1px solid #475569' }}>
        <div className="absolute -left-1 top-1/2 w-2.5 h-2.5 rounded-full -translate-y-1/2"
          style={{ background: '#0f172a', border: '1px solid #475569' }} />
        <span className="text-xs font-black text-slate-200">{score}</span>
        <span className="text-[8px] text-slate-500">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 30. Retro TV static ─────────────────────────────────
const V30 = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: '#0a0a0a', border: '3px solid #1a1a1a', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
    <div className="flex">
      {SCORES.map(({ score, pct }, i) => (
        <div key={score} className="flex-1 flex flex-col items-center py-2"
          style={{ borderRight: i < 4 ? '1px solid #111' : 'none',
            background: `rgba(0,255,0,${0.02 + i * 0.01})` }}>
          <span className="font-mono text-xs font-bold" style={{ color: '#00ff41', textShadow: '0 0 5px #00ff41' }}>{score}</span>
          <span className="font-mono text-[8px]" style={{ color: 'rgba(0,255,65,0.5)' }}>{pct}%</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── 31. Gradient border glow ────────────────────────────
const V31 = () => (
  <div className="flex gap-2 justify-center">
    {SCORES.map(({ score, pct }, i) => {
      const colors = ['#3b82f6,#8b5cf6', '#8b5cf6,#ec4899', '#ec4899,#ef4444', '#ef4444,#f97316', '#f97316,#eab308'];
      return (
        <div key={score} className="p-px rounded-xl" style={{ background: `linear-gradient(135deg,${colors[i]})` }}>
          <div className="flex flex-col items-center px-2 py-1.5 rounded-xl h-full" style={{ background: '#0f172a' }}>
            <span className="text-xs font-black text-white">{score}</span>
            <span className="text-[8px] text-white/40">{pct}%</span>
          </div>
        </div>
      );
    })}
  </div>
);

// ─── 32. Domino tiles ────────────────────────────────────
const Dot = ({ x, y }) => <circle cx={x} cy={y} r="2.5" fill="white" opacity="0.8" />;
const DominoFace = ({ n }) => {
  const dots = {
    0: [],
    1: [[15,15]],
    2: [[8,8],[22,22]],
    3: [[8,8],[15,15],[22,22]],
  }[Math.min(n, 3)] || [];
  return (
    <svg width="30" height="30" viewBox="0 0 30 30">
      <rect width="30" height="30" rx="3" fill="rgba(255,255,255,0.08)" />
      {dots.map(([x, y], i) => <Dot key={i} x={x} y={y} />)}
    </svg>
  );
};
const V32 = () => (
  <div className="flex gap-1.5 justify-center">
    {SCORES.map(({ score, pct }) => {
      const [h, a] = score.split(':').map(Number);
      return (
        <div key={score} className="flex flex-col items-center rounded-lg overflow-hidden"
          style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <DominoFace n={h} />
          <div className="w-full h-px" style={{ background: '#334155' }} />
          <DominoFace n={a} />
          <span className="text-[7px] text-white/40 py-0.5 font-mono">{pct}%</span>
        </div>
      );
    })}
  </div>
);

// ─── 33. Brutalist ───────────────────────────────────────
const V33 = () => (
  <div className="flex gap-0 border-2 border-white overflow-hidden">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex-1 flex flex-col items-center py-2"
        style={{ borderRight: i < 4 ? '2px solid white' : 'none', background: i === 0 ? 'white' : 'transparent' }}>
        <span className="text-xs font-black" style={{ color: i === 0 ? 'black' : 'white' }}>{score}</span>
        <span className="text-[8px]" style={{ color: i === 0 ? '#666' : 'rgba(255,255,255,0.4)' }}>{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 34. Periodic table ──────────────────────────────────
const V34 = () => (
  <div className="flex gap-1.5 justify-center">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex flex-col items-center px-1 py-1 w-12 h-14 rounded"
        style={{ background: '#0f2027', border: '1px solid #1a3a5c' }}>
        <span className="text-[7px] text-slate-500 self-end leading-none">{i + 1}</span>
        <span className="text-sm font-black text-cyan-400 leading-none">{score}</span>
        <span className="text-[7px] text-slate-500 leading-none mt-0.5">{pct}%</span>
        <span className="text-[6px] text-slate-600 leading-none">GOAL</span>
      </div>
    ))}
  </div>
);

// ─── 35. Map pins ─────────────────────────────────────────
const V35 = () => (
  <div className="flex gap-3 justify-center items-end">
    {SCORES.map(({ score, pct }, i) => {
      const h = 24 + i * 8;
      return (
        <div key={score} className="flex flex-col items-center" style={{ height: 70 - i * 8 }}>
          <div className="flex flex-col items-center px-2 py-1 rounded-t-full rounded-b-none"
            style={{ background: '#dc2626', border: '1.5px solid #991b1b', flex: 1, justifyContent: 'center' }}>
            <span className="text-[9px] font-black text-white">{score}</span>
            <span className="text-[7px] text-red-200">{pct}%</span>
          </div>
          <div style={{ width: 2, flex: 1, background: '#dc2626', maxHeight: h }} />
          <div className="w-2 h-2 rounded-full" style={{ background: '#dc2626' }} />
        </div>
      );
    })}
  </div>
);

// ─── 36. Scoreboard with flashing rank 1 ─────────────────
const V36 = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: '#0a0a0a' }}>
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex items-center gap-2 px-3 py-1.5"
        style={{ borderBottom: i < 4 ? '1px solid #1a1a1a' : 'none',
          background: i === 0 ? 'rgba(245,158,11,0.1)' : 'transparent' }}>
        <span className="text-[9px] font-mono text-slate-600 w-4">{i + 1}</span>
        <span className="font-mono text-xs font-bold flex-1" style={{ color: i === 0 ? '#f59e0b' : '#94a3b8' }}>{score}</span>
        <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full"
            style={{ width: `${(pct / 18) * 100}%`, background: i === 0 ? '#f59e0b' : '#334155' }} />
        </div>
        <span className="font-mono text-[9px] text-slate-500 w-7 text-right">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 37. Emoji flags style ───────────────────────────────
const V37 = () => (
  <div className="flex flex-col gap-1">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex items-center gap-2 px-2 py-1 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
        <span className="text-base">{'⚽🥅🎯🏅🌟'[i]}</span>
        <span className="font-bold text-xs text-white flex-1">{score}</span>
        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${(pct / 18) * 100}%` }} />
        </div>
        <span className="text-[9px] text-white/50 w-7 text-right">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 38. Holographic foil ────────────────────────────────
const V38 = () => (
  <div className="flex gap-2 justify-center">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex flex-col items-center px-2.5 py-2 rounded-xl"
        style={{
          background: `linear-gradient(${135 + i * 30}deg, rgba(255,0,128,0.15), rgba(0,200,255,0.15), rgba(128,255,0,0.15))`,
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: `0 0 15px rgba(${i * 50},${100 + i * 30},255,0.2)`
        }}>
        <span className="text-xs font-black text-white">{score}</span>
        <span className="text-[8px] text-white/50">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 39. Circuit board ───────────────────────────────────
const V39 = () => (
  <div className="rounded-xl p-2" style={{ background: '#0a1628', border: '1px solid #1a4a1a' }}>
    <div className="flex gap-2 justify-center mb-1.5">
      {SCORES.map(({ score, pct }) => (
        <div key={score} className="flex flex-col items-center px-2 py-1 rounded"
          style={{ background: '#0f2d0f', border: '1px solid #16a34a', boxShadow: '0 0 6px rgba(22,163,74,0.3)' }}>
          <span className="text-[10px] font-mono font-bold text-green-400">{score}</span>
          <span className="text-[7px] font-mono text-green-700">{pct}%</span>
        </div>
      ))}
    </div>
    <div className="flex justify-between px-2">
      {SCORES.map(({ score }) => (
        <div key={score} className="w-1 h-3 rounded-t"
          style={{ background: 'linear-gradient(#16a34a,#065f46)' }} />
      ))}
    </div>
  </div>
);

// ─── 40. Award ribbons ───────────────────────────────────
const V40 = () => (
  <div className="flex gap-1.5 justify-center">
    {SCORES.map(({ score, pct }, i) => {
      const colors = [['#fbbf24', '#92400e'], ['#94a3b8', '#475569'], ['#b45309', '#78350f'], ['#6b7280', '#374151'], ['#6b7280', '#374151']];
      const [top, bot] = colors[i];
      return (
        <div key={score} className="flex flex-col items-center" style={{ width: 42 }}>
          <div className="w-full flex flex-col items-center py-2 rounded-t-full"
            style={{ background: `linear-gradient(180deg,${top},${bot})`, boxShadow: '0 3px 8px rgba(0,0,0,0.4)' }}>
            <span className="text-[9px] font-black text-white">{score}</span>
            <span className="text-[7px] text-white/60">{pct}%</span>
          </div>
          <div style={{ width: 0, borderLeft: '21px solid transparent', borderRight: '21px solid transparent', borderTop: `8px solid ${bot}` }} />
        </div>
      );
    })}
  </div>
);

// ─── 41. QR tile pattern ─────────────────────────────────
const V41 = () => (
  <div className="flex gap-1.5 justify-center">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center p-1.5 rounded-lg"
        style={{ background: '#f8f8f8', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <div className="grid grid-cols-3 gap-px mb-1" style={{ width: 24, height: 24 }}>
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} style={{ background: Math.random() > 0.5 ? '#000' : '#fff' }} />
          ))}
        </div>
        <span className="text-[8px] font-black text-slate-800">{score}</span>
        <span className="text-[7px] text-slate-400">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 42. Flip cards (CSS perspective) ────────────────────
const V42 = () => (
  <div className="flex gap-2 justify-center">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex flex-col items-center px-2 py-2 rounded-xl"
        style={{
          background: 'linear-gradient(145deg,#1e293b,#0f172a)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '4px 4px 8px rgba(0,0,0,0.4), -2px -2px 6px rgba(255,255,255,0.03)',
          transform: `perspective(200px) rotateY(${(i - 2) * 5}deg)`
        }}>
        <span className="text-xs font-black text-white">{score}</span>
        <span className="text-[8px] text-white/40">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 43. Neon bracket ────────────────────────────────────
const V43 = () => (
  <div className="flex gap-1.5 justify-center">
    {SCORES.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center px-1 py-1.5 relative"
        style={{ minWidth: 44 }}>
        {/* brackets */}
        <div className="absolute inset-0 flex items-stretch">
          <div style={{ width: 4, borderLeft: '2px solid #0ea5e9', borderTop: '2px solid #0ea5e9', borderBottom: '2px solid #0ea5e9', borderRadius: '4px 0 0 4px', boxShadow: '-2px 0 8px #0ea5e9' }} />
          <div className="flex-1" />
          <div style={{ width: 4, borderRight: '2px solid #0ea5e9', borderTop: '2px solid #0ea5e9', borderBottom: '2px solid #0ea5e9', borderRadius: '0 4px 4px 0', boxShadow: '2px 0 8px #0ea5e9' }} />
        </div>
        <span className="text-xs font-black text-sky-300 relative z-10">{score}</span>
        <span className="text-[8px] text-sky-500 relative z-10">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 44. Glitch effect ───────────────────────────────────
const V44 = () => (
  <div className="flex gap-1.5 justify-center">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex flex-col items-center px-2 py-1.5 rounded relative overflow-hidden"
        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        <div className="absolute inset-0 opacity-20" style={{ background: `repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,0,0.05) 2px,rgba(0,255,0,0.05) 4px)` }} />
        <span className="relative font-mono text-xs font-black" style={{ color: '#00ff88', textShadow: '2px 0 #ff0080, -2px 0 #00ffff' }}>{score}</span>
        <span className="relative font-mono text-[8px]" style={{ color: 'rgba(0,255,136,0.5)' }}>{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 45. Watercolor blobs ────────────────────────────────
const V45 = () => {
  const colors = ['rgba(99,102,241,0.3)', 'rgba(236,72,153,0.3)', 'rgba(245,158,11,0.3)', 'rgba(16,185,129,0.3)', 'rgba(239,68,68,0.3)'];
  return (
    <div className="flex gap-1.5 justify-center">
      {SCORES.map(({ score, pct }, i) => (
        <div key={score} className="flex flex-col items-center px-3 py-2 rounded-[40%_60%_55%_45%/45%_55%_60%_40%]"
          style={{ background: colors[i], backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <span className="text-xs font-black text-white">{score}</span>
          <span className="text-[8px] text-white/60">{pct}%</span>
        </div>
      ))}
    </div>
  );
};

// ─── 46. Minimalist long dash ────────────────────────────
const V46 = () => (
  <div className="space-y-1.5">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex items-center gap-2">
        <span className="text-[10px] font-black text-white/70 w-8 font-mono">{score}</span>
        <div className="flex-1 h-px" style={{ background: `rgba(255,255,255,${0.08 + (5 - i) * 0.08})` }} />
        <span className="text-[10px] text-white/40 w-6 text-right">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 47. Scoreboard grid ─────────────────────────────────
const V47 = () => (
  <div className="grid grid-cols-5 gap-px overflow-hidden rounded-xl" style={{ background: '#1e293b' }}>
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex flex-col items-center py-2" style={{ background: '#0f172a' }}>
        <span className="text-[8px] text-slate-600 font-mono">#{i + 1}</span>
        <span className="text-xs font-black text-white">{score}</span>
        <span className="text-[8px] text-slate-500">{pct}%</span>
      </div>
    ))}
  </div>
);

// ─── 48. Trophy podium (top 3 big + 2 small) ─────────────
const V48 = () => (
  <div className="flex flex-col gap-1.5">
    <div className="flex gap-2">
      {SCORES.slice(0, 3).map(({ score, pct }, i) => (
        <div key={score} className="flex-1 flex flex-col items-center py-2 rounded-xl"
          style={{ background: ['rgba(245,158,11,0.15)', 'rgba(148,163,184,0.1)', 'rgba(180,83,9,0.1)'][i],
            border: `1px solid ${['rgba(245,158,11,0.4)', 'rgba(148,163,184,0.3)', 'rgba(180,83,9,0.3)'][i]}` }}>
          <span className="text-base">{'🥇🥈🥉'[i]}</span>
          <span className="text-xs font-black text-white">{score}</span>
          <span className="text-[9px] text-white/50">{pct}%</span>
        </div>
      ))}
    </div>
    <div className="flex gap-2">
      {SCORES.slice(3).map(({ score, pct }) => (
        <div key={score} className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <span className="text-[10px] font-bold text-white/60">{score}</span>
          <span className="text-[10px] text-white/40">{pct}%</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── 49. Matrix rain ─────────────────────────────────────
const V49 = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: '#000', border: '1px solid #00ff41' }}>
    <div className="flex">
      {SCORES.map(({ score, pct }, i) => (
        <div key={score} className="flex-1 flex flex-col items-center py-2"
          style={{ borderRight: i < 4 ? '1px solid rgba(0,255,65,0.2)' : 'none' }}>
          <div className="flex flex-col items-center" style={{ opacity: 0.3 + (4 - i) * 0.15 }}>
            <span className="font-mono text-[7px]" style={{ color: '#00ff41' }}>{'01'[i % 2]}</span>
            <span className="font-mono text-[7px]" style={{ color: '#00ff41' }}>{'10'[i % 2]}</span>
          </div>
          <span className="font-mono text-xs font-bold" style={{ color: '#00ff41', textShadow: '0 0 8px #00ff41' }}>{score}</span>
          <span className="font-mono text-[7px]" style={{ color: 'rgba(0,255,65,0.4)' }}>{pct}%</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── 50. Rotating diamond ────────────────────────────────
const V50 = () => (
  <div className="flex gap-3 justify-center items-center">
    {SCORES.map(({ score, pct }, i) => (
      <div key={score} className="flex flex-col items-center justify-center w-12 h-12"
        style={{ background: `linear-gradient(135deg,#1e40af,#7c3aed)`, transform: 'rotate(45deg)',
          border: '1px solid rgba(139,92,246,0.6)', boxShadow: '0 0 12px rgba(124,58,237,0.4)' }}>
        <div style={{ transform: 'rotate(-45deg)', textAlign: 'center' }}>
          <div className="text-[9px] font-black text-white leading-none">{score}</div>
          <div className="text-[7px] text-white/50 leading-none">{pct}%</div>
        </div>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════
const VARIANTS = [
  { n: 1,  name: 'נוכחי — Neon pills כחול',        C: V1 },
  { n: 2,  name: 'Playing cards',                  C: V2 },
  { n: 3,  name: 'Scoreboard rows + bar',          C: V3 },
  { n: 4,  name: 'Ticket / coupon',                C: V4 },
  { n: 5,  name: 'Jersey number',                  C: V5 },
  { n: 6,  name: 'LED display אדום',               C: V6 },
  { n: 7,  name: 'Podium bar chart',               C: V7 },
  { n: 8,  name: 'Hexagon tiles',                  C: V8 },
  { n: 9,  name: 'Cyberpunk angular',              C: V9 },
  { n: 10, name: 'Terminal / monospace',           C: V10 },
  { n: 11, name: 'Glassmorphism cards',            C: V11 },
  { n: 12, name: 'Flame gradient by rank',         C: V12 },
  { n: 13, name: 'Split-flap display',             C: V13 },
  { n: 14, name: 'Casino chips',                   C: V14 },
  { n: 15, name: 'Newspaper cutout',               C: V15 },
  { n: 16, name: 'Blueprint technical',            C: V16 },
  { n: 17, name: 'Neon sign סגול',                 C: V17 },
  { n: 18, name: 'Polaroid photos',                C: V18 },
  { n: 19, name: 'Arc / semicircle SVG',           C: V19 },
  { n: 20, name: 'Minecraft pixel',                C: V20 },
  { n: 21, name: 'Constellation stars',            C: V21 },
  { n: 22, name: 'Stamp collection',               C: V22 },
  { n: 23, name: 'Heatmap tiles',                  C: V23 },
  { n: 24, name: 'Floating bubbles',               C: V24 },
  { n: 25, name: 'Art deco panels',                C: V25 },
  { n: 26, name: 'Speech bubbles',                 C: V26 },
  { n: 27, name: 'Slot machine',                   C: V27 },
  { n: 28, name: 'Vinyl record',                   C: V28 },
  { n: 29, name: 'Price tag',                      C: V29 },
  { n: 30, name: 'Retro TV / Matrix green',        C: V30 },
  { n: 31, name: 'Rainbow gradient border',        C: V31 },
  { n: 32, name: 'Domino tiles',                   C: V32 },
  { n: 33, name: 'Brutalist black/white',          C: V33 },
  { n: 34, name: 'Periodic table',                 C: V34 },
  { n: 35, name: 'Map pins',                       C: V35 },
  { n: 36, name: 'Scoreboard ranked',              C: V36 },
  { n: 37, name: 'Emoji + progress bar',           C: V37 },
  { n: 38, name: 'Holographic foil',               C: V38 },
  { n: 39, name: 'Circuit board',                  C: V39 },
  { n: 40, name: 'Award ribbons',                  C: V40 },
  { n: 41, name: 'QR tile pattern',                C: V41 },
  { n: 42, name: 'Perspective 3D cards',           C: V42 },
  { n: 43, name: 'Neon brackets',                  C: V43 },
  { n: 44, name: 'Glitch scanlines',               C: V44 },
  { n: 45, name: 'Watercolor blobs',               C: V45 },
  { n: 46, name: 'Minimalist dash lines',          C: V46 },
  { n: 47, name: 'Grid scoreboard',                C: V47 },
  { n: 48, name: 'Trophy podium top 3',            C: V48 },
  { n: 49, name: 'Matrix rain',                    C: V49 },
  { n: 50, name: 'Rotating diamonds',              C: V50 },
];

export default function AdminScoresDemo() {
  const [filter, setFilter] = useState('');

  const filtered = VARIANTS.filter(v =>
    filter === '' || v.name.toLowerCase().includes(filter.toLowerCase()) || String(v.n) === filter
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">עיצובי תוצאות — 50 וריאציות</h2>
        <p className="text-slate-400 text-sm">נתוני דמו: 1:0 18% · 1:1 15% · 2:1 12% · 0:1 11% · 2:0 10%</p>
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
