import React, { useState } from 'react';

const DEMO = {
  teamA: 'Brazil',
  teamB: 'Argentina',
  home: 42,
  draw: 24,
  away: 34,
  scores: [
    { score: '1:0', pct: 18 },
    { score: '1:1', pct: 15 },
    { score: '2:1', pct: 12 },
    { score: '0:1', pct: 11 },
    { score: '2:0', pct: 10 },
  ],
};

// ─── helpers ──────────────────────────────────────────────
const Label = ({ n, name }) => (
  <div className="mb-2 flex items-center gap-2">
    <span className="text-xs font-black text-slate-500 w-6 text-right">{n}</span>
    <span className="text-xs text-slate-400">{name}</span>
  </div>
);

// ═══════════════════════════════════════════════════════════
// VARIANTS
// ═══════════════════════════════════════════════════════════

// 1 — Current (glass rounded)
const V1 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}>
        <span className="text-[9px] text-white/80">{l}</span>
        <span className="text-sm font-bold text-white/60">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 2 — Pill
const V2 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <span className="text-[9px] text-white/70">{l}</span>
        <span className="text-sm font-bold text-white">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 3 — Sharp corners
const V3 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span className="text-[9px] text-white/70">{l}</span>
        <span className="text-sm font-bold text-white">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 4 — Blue neon glow
const V4 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.5)', boxShadow: '0 0 10px rgba(59,130,246,0.25)' }}>
        <span className="text-[9px] text-blue-300">{l}</span>
        <span className="text-sm font-bold text-blue-100">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 5 — Green neon
const V5 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.4)', boxShadow: '0 0 10px rgba(34,197,94,0.2)' }}>
        <span className="text-[9px] text-green-300">{l}</span>
        <span className="text-sm font-bold text-green-100">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 6 — Purple neon
const V6 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.45)', boxShadow: '0 0 10px rgba(139,92,246,0.2)' }}>
        <span className="text-[9px] text-purple-300">{l}</span>
        <span className="text-sm font-bold text-purple-100">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 7 — Gold fill
const V7 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'linear-gradient(135deg,#78350f,#92400e)', border: '1px solid #f59e0b' }}>
        <span className="text-[9px] text-amber-300">{l}</span>
        <span className="text-sm font-bold text-amber-100">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 8 — Dark solid
const V8 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
        <span className="text-[9px] text-slate-400">{l}</span>
        <span className="text-sm font-bold text-slate-200">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 9 — Outlined only
const V9 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)' }}>
        <span className="text-[9px] text-white/60">{l}</span>
        <span className="text-sm font-bold text-white">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 10 — Score prominent (huge %)
const V10 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1 rounded-xl" style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <span className="text-xl font-black text-white">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
        <span className="text-[8px] text-white/40">{l}</span>
      </div>
    ))}
  </div>
);

// 11 — Vertical stack (column layout)
const V11 = () => (
  <div className="flex flex-col gap-1.5">
    {[{ l: DEMO.teamA, p: DEMO.home }, { l: 'תיקו', p: DEMO.draw }, { l: DEMO.teamB, p: DEMO.away }].map(({ l, p }, i) => (
      <div key={i} className="flex items-center justify-between px-3 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <span className="text-[10px] text-white/70">{l}</span>
        <span className="text-sm font-bold text-white">{p}%</span>
      </div>
    ))}
  </div>
);

// 12 — Progress bar style
const V12 = () => (
  <div className="flex flex-col gap-2">
    {[{ l: DEMO.teamA, p: DEMO.home, c: '#3b82f6' }, { l: 'תיקו', p: DEMO.draw, c: '#eab308' }, { l: DEMO.teamB, p: DEMO.away, c: '#22c55e' }].map(({ l, p, c }, i) => (
      <div key={i} className="flex flex-col gap-0.5">
        <div className="flex justify-between text-[9px]">
          <span style={{ color: c }}>{l}</span>
          <span className="text-white/60">{p}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${p}%`, background: c }} />
        </div>
      </div>
    ))}
  </div>
);

// 13 — Single horizontal bar
const V13 = () => (
  <div className="flex flex-col gap-1.5">
    <div className="h-3 rounded-full overflow-hidden flex">
      <div style={{ width: `${DEMO.home}%`, background: '#3b82f6' }} />
      <div style={{ width: `${DEMO.draw}%`, background: '#eab308' }} />
      <div style={{ width: `${DEMO.away}%`, background: '#22c55e' }} />
    </div>
    <div className="flex justify-between text-[9px]">
      <span className="text-blue-400">{DEMO.teamA} {DEMO.home}%</span>
      <span className="text-yellow-400">תיקו {DEMO.draw}%</span>
      <span className="text-green-400">{DEMO.teamB} {DEMO.away}%</span>
    </div>
  </div>
);

// 14 — Colored each differently
const V14 = () => (
  <div className="flex gap-2">
    {[
      { l: DEMO.teamA, p: DEMO.home, bg: 'rgba(59,130,246,0.15)', b: 'rgba(59,130,246,0.4)', t: '#93c5fd' },
      { l: 'תיקו', p: DEMO.draw, bg: 'rgba(234,179,8,0.15)', b: 'rgba(234,179,8,0.4)', t: '#fde68a' },
      { l: DEMO.teamB, p: DEMO.away, bg: 'rgba(34,197,94,0.15)', b: 'rgba(34,197,94,0.4)', t: '#86efac' },
    ].map(({ l, p, bg, b, t }, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: bg, border: `1px solid ${b}` }}>
        <span className="text-[9px]" style={{ color: t }}>{l}</span>
        <span className="text-sm font-bold text-white">{p}%</span>
      </div>
    ))}
  </div>
);

// 15 — Cyan theme
const V15 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.35)', boxShadow: '0 0 8px rgba(6,182,212,0.15)' }}>
        <span className="text-[9px] text-cyan-300">{l}</span>
        <span className="text-sm font-bold text-cyan-100">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 16 — Pink neon
const V16 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.4)', boxShadow: '0 0 8px rgba(236,72,153,0.2)' }}>
        <span className="text-[9px] text-pink-300">{l}</span>
        <span className="text-sm font-bold text-pink-100">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 17 — Red/crimson
const V17 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)' }}>
        <span className="text-[9px] text-red-300">{l}</span>
        <span className="text-sm font-bold text-red-100">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 18 — Gradient border via box-shadow
const V18 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: '#0a0f1e', boxShadow: '0 0 0 1px #3b82f6, 0 0 0 2px #7c3aed' }}>
        <span className="text-[9px] text-slate-300">{l}</span>
        <span className="text-sm font-bold text-white">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 19 — Glassmorphism intense
const V19 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(20px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}>
        <span className="text-[9px] text-white/80">{l}</span>
        <span className="text-sm font-bold text-white">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 20 — Neumorphic
const V20 = () => (
  <div className="flex gap-2 p-2 rounded-xl" style={{ background: '#1a2035' }}>
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: '#1a2035', boxShadow: '3px 3px 6px #111827, -3px -3px 6px #243048' }}>
        <span className="text-[9px] text-slate-400">{l}</span>
        <span className="text-sm font-bold text-slate-200">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 21 — Tag/badge with left colored stripe
const V21 = () => (
  <div className="flex flex-col gap-1.5">
    {[
      { l: DEMO.teamA, p: DEMO.home, c: '#3b82f6' },
      { l: 'תיקו', p: DEMO.draw, c: '#eab308' },
      { l: DEMO.teamB, p: DEMO.away, c: '#22c55e' },
    ].map(({ l, p, c }, i) => (
      <div key={i} className="flex items-center overflow-hidden rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: 4, background: c, alignSelf: 'stretch' }} />
        <div className="flex-1 flex justify-between items-center px-2 py-1">
          <span className="text-[10px] text-white/70">{l}</span>
          <span className="text-sm font-bold text-white">{p}%</span>
        </div>
      </div>
    ))}
  </div>
);

// 22 — Score top (inverse label position)
const V22 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}>
        <span className="text-base font-black text-white">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
        <span className="text-[8px] text-white/40 uppercase tracking-wider">{l}</span>
      </div>
    ))}
  </div>
);

// 23 — Gradient fill each
const V23 = () => (
  <div className="flex gap-2">
    {[
      { l: DEMO.teamA, p: DEMO.home, bg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)' },
      { l: 'תיקו', p: DEMO.draw, bg: 'linear-gradient(135deg,#713f12,#ca8a04)' },
      { l: DEMO.teamB, p: DEMO.away, bg: 'linear-gradient(135deg,#14532d,#16a34a)' },
    ].map(({ l, p, bg }, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: bg }}>
        <span className="text-[9px] text-white/80">{l}</span>
        <span className="text-sm font-bold text-white">{p}%</span>
      </div>
    ))}
  </div>
);

// 24 — Minimal dots separator
const V24 = () => (
  <div className="flex items-center gap-1">
    {[
      { l: DEMO.teamA, p: DEMO.home },
      null,
      { l: 'תיקו', p: DEMO.draw },
      null,
      { l: DEMO.teamB, p: DEMO.away },
    ].map((item, i) =>
      item === null
        ? <div key={i} className="w-1 h-1 rounded-full bg-white/20" />
        : (
          <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <span className="text-[9px] text-white/60">{item.l}</span>
            <span className="text-sm font-bold text-white">{item.p}%</span>
          </div>
        )
    )}
  </div>
);

// 25 — Compact single row text
const V25 = () => (
  <div className="flex items-center justify-center gap-3 py-1.5 px-3 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)' }}>
    <span className="text-[10px] text-blue-300">{DEMO.teamA} <strong className="text-white">{DEMO.home}%</strong></span>
    <span className="text-white/20">|</span>
    <span className="text-[10px] text-yellow-300">תיקו <strong className="text-white">{DEMO.draw}%</strong></span>
    <span className="text-white/20">|</span>
    <span className="text-[10px] text-green-300">{DEMO.teamB} <strong className="text-white">{DEMO.away}%</strong></span>
  </div>
);

// 26 — With rank number
const V26 = () => (
  <div className="flex gap-2">
    {[{ l: DEMO.teamA, p: DEMO.home }, { l: 'תיקו', p: DEMO.draw }, { l: DEMO.teamB, p: DEMO.away }].map(({ l, p }, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl relative" style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}>
        <span className="absolute top-0.5 left-1.5 text-[8px] text-white/20 font-mono">{i + 1}</span>
        <span className="text-[9px] text-white/70">{l}</span>
        <span className="text-sm font-bold text-white">{p}%</span>
      </div>
    ))}
  </div>
);

// 27 — Bottom border accent only
const V27 = () => (
  <div className="flex gap-2">
    {[
      { l: DEMO.teamA, p: DEMO.home, c: '#3b82f6' },
      { l: 'תיקו', p: DEMO.draw, c: '#eab308' },
      { l: DEMO.teamB, p: DEMO.away, c: '#22c55e' },
    ].map(({ l, p, c }, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-t-xl" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: `2px solid ${c}` }}>
        <span className="text-[9px] text-white/70">{l}</span>
        <span className="text-sm font-bold text-white">{p}%</span>
      </div>
    ))}
  </div>
);

// 28 — Top border accent
const V28 = () => (
  <div className="flex gap-2">
    {[
      { l: DEMO.teamA, p: DEMO.home, c: '#3b82f6' },
      { l: 'תיקו', p: DEMO.draw, c: '#eab308' },
      { l: DEMO.teamB, p: DEMO.away, c: '#22c55e' },
    ].map(({ l, p, c }, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-b-xl" style={{ background: 'rgba(255,255,255,0.04)', borderTop: `2px solid ${c}` }}>
        <span className="text-[9px] text-white/70">{l}</span>
        <span className="text-sm font-bold text-white">{p}%</span>
      </div>
    ))}
  </div>
);

// 29 — Diagonal gradient bg
const V29 = () => (
  <div className="flex gap-2 p-1.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)', border: '1px solid rgba(139,92,246,0.25)' }}>
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1">
        <span className="text-[9px] text-white/70">{l}</span>
        <span className="text-sm font-bold text-white">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 30 — Rose gold
const V30 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.3)' }}>
        <span className="text-[9px] text-pink-200">{l}</span>
        <span className="text-sm font-bold text-pink-100">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 31 — Fire/orange
const V31 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.35)', boxShadow: '0 0 8px rgba(249,115,22,0.15)' }}>
        <span className="text-[9px] text-orange-300">{l}</span>
        <span className="text-sm font-bold text-orange-100">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 32 — Midnight purple
const V32 = () => (
  <div className="flex gap-2 p-1.5 rounded-xl" style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', border: '1px solid #4338ca' }}>
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1">
        <span className="text-[9px] text-indigo-300">{l}</span>
        <span className="text-sm font-bold text-white">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 33 — Split home/away big
const V33 = () => (
  <div className="flex gap-2">
    <div className="flex-1 flex flex-col items-center py-2 rounded-xl" style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', border: '1px solid #3b82f6' }}>
      <span className="text-[9px] text-blue-200">{DEMO.teamA}</span>
      <span className="text-lg font-black text-white">{DEMO.home}%</span>
    </div>
    <div className="flex flex-col items-center justify-center px-2 rounded-xl" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)' }}>
      <span className="text-[8px] text-yellow-300">תיקו</span>
      <span className="text-xs font-bold text-white">{DEMO.draw}%</span>
    </div>
    <div className="flex-1 flex flex-col items-center py-2 rounded-xl" style={{ background: 'linear-gradient(135deg,#14532d,#15803d)', border: '1px solid #22c55e' }}>
      <span className="text-[9px] text-green-200">{DEMO.teamB}</span>
      <span className="text-lg font-black text-white">{DEMO.away}%</span>
    </div>
  </div>
);

// 34 — Holographic shimmer
const V34 = () => (
  <div className="flex gap-2">
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02), rgba(255,255,255,0.1))', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.3)' }}>
        <span className="text-[9px] text-white/70">{l}</span>
        <span className="text-sm font-bold text-white">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 35 — Teal ocean
const V35 = () => (
  <div className="flex gap-2 p-1.5 rounded-xl" style={{ background: 'linear-gradient(135deg,#042f2e,#134e4a)', border: '1px solid #0d9488' }}>
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1">
        <span className="text-[9px] text-teal-300">{l}</span>
        <span className="text-sm font-bold text-teal-100">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 36 — Scores in top 5 horizontal
const V36 = () => (
  <div className="flex gap-1.5">
    {DEMO.scores.map(({ score, pct }) => (
      <div key={score} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}>
        <span className="text-[11px] font-black text-white/80">{score}</span>
        <span className="text-[9px] text-white/50">{pct}%</span>
      </div>
    ))}
  </div>
);

// 37 — Scores with color by outcome
const V37 = () => (
  <div className="flex gap-1.5">
    {DEMO.scores.map(({ score, pct }) => {
      const [h, a] = score.split(':').map(Number);
      const c = h > a ? '#3b82f6' : h < a ? '#22c55e' : '#eab308';
      return (
        <div key={score} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ border: `1px solid ${c}40`, background: `${c}12` }}>
          <span className="text-[11px] font-black" style={{ color: c }}>{score}</span>
          <span className="text-[9px] text-white/50">{pct}%</span>
        </div>
      );
    })}
  </div>
);

// 38 — Scores pill style
const V38 = () => (
  <div className="flex flex-wrap gap-1.5 justify-center">
    {DEMO.scores.map(({ score, pct }) => (
      <div key={score} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.15)' }}>
        <span className="text-[11px] font-black text-white">{score}</span>
        <span className="text-[9px] text-white/40">{pct}%</span>
      </div>
    ))}
  </div>
);

// 39 — Scores as ranking list
const V39 = () => (
  <div className="flex flex-col gap-1">
    {DEMO.scores.map(({ score, pct }, i) => (
      <div key={score} className="flex items-center gap-2">
        <span className="text-[9px] text-white/30 w-3 text-right font-mono">{i + 1}</span>
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${(pct / 18) * 100}%` }} />
        </div>
        <span className="text-[10px] font-bold text-white/70 w-6 font-mono">{score}</span>
        <span className="text-[9px] text-white/40 w-6 text-right">{pct}%</span>
      </div>
    ))}
  </div>
);

// 40 — Combined win + scores in one block
const V40 = () => (
  <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}>
    <div className="flex" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
      {[{ l: DEMO.teamA, p: DEMO.home }, { l: 'תיקו', p: DEMO.draw }, { l: DEMO.teamB, p: DEMO.away }].map(({ l, p }, i) => (
        <div key={i} className="flex-1 flex flex-col items-center py-1.5" style={{ borderRight: i < 2 ? '0.5px solid rgba(255,255,255,0.08)' : 'none' }}>
          <span className="text-[9px] text-white/60">{l}</span>
          <span className="text-sm font-bold text-white">{p}%</span>
        </div>
      ))}
    </div>
    <div className="flex">
      {DEMO.scores.map(({ score, pct }, i) => (
        <div key={score} className="flex-1 flex flex-col items-center py-1" style={{ borderRight: i < 4 ? '0.5px solid rgba(255,255,255,0.08)' : 'none' }}>
          <span className="text-[10px] font-bold text-white/70">{score}</span>
          <span className="text-[8px] text-white/40">{pct}%</span>
        </div>
      ))}
    </div>
  </div>
);

// 41 — Segmented control style
const V41 = () => (
  <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
    {[{ l: DEMO.teamA, p: DEMO.home }, { l: 'תיקו', p: DEMO.draw }, { l: DEMO.teamB, p: DEMO.away }].map(({ l, p }, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1.5" style={{ background: i === 0 ? 'rgba(59,130,246,0.2)' : 'transparent', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
        <span className="text-[9px] text-white/70">{l}</span>
        <span className="text-sm font-bold text-white">{p}%</span>
      </div>
    ))}
  </div>
);

// 42 — Scores large card
const V42 = () => (
  <div className="grid grid-cols-5 gap-1.5">
    {DEMO.scores.map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <span className="text-xs font-black text-white">{score}</span>
        <span className="text-[8px] text-white/40">{pct}%</span>
      </div>
    ))}
  </div>
);

// 43 — Trophy style highlight winner
const V43 = () => {
  const winner = DEMO.home > DEMO.away ? { l: DEMO.teamA, p: DEMO.home } : { l: DEMO.teamB, p: DEMO.away };
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="px-4 py-1.5 rounded-full" style={{ background: 'linear-gradient(135deg,#78350f,#d97706)', border: '1px solid #f59e0b' }}>
        <span className="text-[10px] text-amber-100">🏆 {winner.l} — {winner.p}%</span>
      </div>
      <div className="flex gap-2 w-full">
        {[{ l: 'תיקו', p: DEMO.draw }, { l: DEMO.teamB, p: DEMO.away }].map(({ l, p }, i) => (
          <div key={i} className="flex-1 flex flex-col items-center py-1 rounded-lg" style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <span className="text-[9px] text-white/50">{l}</span>
            <span className="text-xs font-bold text-white/70">{p}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 44 — Compact inline with slash
const V44 = () => (
  <div className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
    <span className="text-xs font-black text-blue-400">{DEMO.home}%</span>
    <span className="text-[10px] text-white/20 mx-0.5">/</span>
    <span className="text-xs font-black text-yellow-400">{DEMO.draw}%</span>
    <span className="text-[10px] text-white/20 mx-0.5">/</span>
    <span className="text-xs font-black text-green-400">{DEMO.away}%</span>
    <span className="text-[9px] text-white/30 ml-1.5">1 X 2</span>
  </div>
);

// 45 — Frosted white light theme
const V45 = () => (
  <div className="flex gap-2 p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.5)' }}>
    {[DEMO.teamA, 'תיקו', DEMO.teamB].map((l, i) => (
      <div key={i} className="flex-1 flex flex-col items-center py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.06)' }}>
        <span className="text-[9px] text-black/60">{l}</span>
        <span className="text-sm font-bold text-black">{[DEMO.home, DEMO.draw, DEMO.away][i]}%</span>
      </div>
    ))}
  </div>
);

// 46 — Scores with medal emoji
const V46 = () => (
  <div className="flex gap-1.5">
    {DEMO.scores.map(({ score, pct }, i) => (
      <div key={score} className="flex-1 flex flex-col items-center py-1.5 rounded-xl" style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <span className="text-[9px]">{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i]}</span>
        <span className="text-[10px] font-black text-white">{score}</span>
        <span className="text-[8px] text-white/40">{pct}%</span>
      </div>
    ))}
  </div>
);

// 47 — Score + win bar combined
const V47 = () => (
  <div className="flex flex-col gap-2">
    <div className="h-2 rounded-full overflow-hidden flex">
      <div style={{ width: `${DEMO.home}%`, background: 'linear-gradient(90deg,#1d4ed8,#3b82f6)' }} />
      <div style={{ width: `${DEMO.draw}%`, background: '#ca8a04' }} />
      <div style={{ width: `${DEMO.away}%`, background: 'linear-gradient(90deg,#15803d,#22c55e)' }} />
    </div>
    <div className="flex gap-1.5">
      {DEMO.scores.map(({ score, pct }) => (
        <div key={score} className="flex-1 flex flex-col items-center py-1 rounded-lg" style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}>
          <span className="text-[10px] font-bold text-white/80">{score}</span>
          <span className="text-[8px] text-white/40">{pct}%</span>
        </div>
      ))}
    </div>
  </div>
);

// 48 — Grid 2x3 scores
const V48 = () => (
  <div className="grid grid-cols-3 gap-1.5">
    {DEMO.scores.slice(0, 3).map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <span className="text-xs font-black text-white">{score}</span>
        <span className="text-[9px] text-white/40">{pct}%</span>
      </div>
    ))}
    {DEMO.scores.slice(3).map(({ score, pct }) => (
      <div key={score} className="flex flex-col items-center py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
        <span className="text-xs font-black text-white/70">{score}</span>
        <span className="text-[9px] text-white/30">{pct}%</span>
      </div>
    ))}
  </div>
);

// 49 — Win % as big text center
const V49 = () => (
  <div className="flex items-center justify-around py-2 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
    <div className="flex flex-col items-center">
      <span className="text-2xl font-black text-blue-400">{DEMO.home}<span className="text-sm">%</span></span>
      <span className="text-[9px] text-white/40">{DEMO.teamA}</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-lg font-black text-yellow-400">{DEMO.draw}<span className="text-xs">%</span></span>
      <span className="text-[9px] text-white/40">תיקו</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-2xl font-black text-green-400">{DEMO.away}<span className="text-sm">%</span></span>
      <span className="text-[9px] text-white/40">{DEMO.teamB}</span>
    </div>
  </div>
);

// 50 — Retro scoreboard
const V50 = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #333', fontFamily: 'monospace' }}>
    <div className="flex px-2 py-0.5" style={{ background: '#111', borderBottom: '1px solid #222' }}>
      <span className="text-[8px] text-green-500 tracking-widest">MATCH FORECAST</span>
    </div>
    <div className="flex">
      {[{ l: DEMO.teamA, p: DEMO.home }, { l: 'DRAW', p: DEMO.draw }, { l: DEMO.teamB, p: DEMO.away }].map(({ l, p }, i) => (
        <div key={i} className="flex-1 flex flex-col items-center py-1.5" style={{ borderRight: i < 2 ? '1px solid #222' : 'none' }}>
          <span className="text-[8px] text-green-600 tracking-wider">{l.toUpperCase().slice(0, 3)}</span>
          <span className="text-sm font-bold text-green-400">{p}%</span>
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════════════════
const VARIANTS = [
  { n: 1,  name: 'Current — Glass rounded',          C: V1 },
  { n: 2,  name: 'Pill capsule',                     C: V2 },
  { n: 3,  name: 'Sharp corners',                    C: V3 },
  { n: 4,  name: 'Blue neon glow',                   C: V4 },
  { n: 5,  name: 'Green neon glow',                  C: V5 },
  { n: 6,  name: 'Purple neon',                      C: V6 },
  { n: 7,  name: 'Gold fill',                        C: V7 },
  { n: 8,  name: 'Dark solid',                       C: V8 },
  { n: 9,  name: 'Outlined only',                    C: V9 },
  { n: 10, name: 'Score prominent (huge %)',          C: V10 },
  { n: 11, name: 'Vertical stack',                   C: V11 },
  { n: 12, name: 'Progress bars',                    C: V12 },
  { n: 13, name: 'Single horizontal bar',            C: V13 },
  { n: 14, name: 'Each badge different color',       C: V14 },
  { n: 15, name: 'Cyan / teal neon',                 C: V15 },
  { n: 16, name: 'Pink neon',                        C: V16 },
  { n: 17, name: 'Red / crimson',                    C: V17 },
  { n: 18, name: 'Double border glow',               C: V18 },
  { n: 19, name: 'Glassmorphism intense',            C: V19 },
  { n: 20, name: 'Neumorphic',                       C: V20 },
  { n: 21, name: 'Left color stripe',                C: V21 },
  { n: 22, name: '% on top, label below',            C: V22 },
  { n: 23, name: 'Gradient fill each',               C: V23 },
  { n: 24, name: 'Dot separators',                   C: V24 },
  { n: 25, name: 'Single row inline text',           C: V25 },
  { n: 26, name: 'With rank number',                 C: V26 },
  { n: 27, name: 'Bottom border accent',             C: V27 },
  { n: 28, name: 'Top border accent',                C: V28 },
  { n: 29, name: 'Diagonal gradient wrapper',        C: V29 },
  { n: 30, name: 'Rose gold',                        C: V30 },
  { n: 31, name: 'Fire / orange',                    C: V31 },
  { n: 32, name: 'Midnight purple',                  C: V32 },
  { n: 33, name: 'Split home/away big + small draw', C: V33 },
  { n: 34, name: 'Holographic shimmer',              C: V34 },
  { n: 35, name: 'Teal ocean',                       C: V35 },
  { n: 36, name: 'Scores — basic',                   C: V36 },
  { n: 37, name: 'Scores — colored by outcome',      C: V37 },
  { n: 38, name: 'Scores — pill style',              C: V38 },
  { n: 39, name: 'Scores — ranking bar list',        C: V39 },
  { n: 40, name: 'Win + scores combined table',      C: V40 },
  { n: 41, name: 'Segmented control (winner highlighted)', C: V41 },
  { n: 42, name: 'Scores — large card grid',         C: V42 },
  { n: 43, name: 'Trophy highlight winner',          C: V43 },
  { n: 44, name: 'Compact 1 X 2 inline',             C: V44 },
  { n: 45, name: 'Light / white theme',              C: V45 },
  { n: 46, name: 'Scores — medal emoji',             C: V46 },
  { n: 47, name: 'Bar + scores combined',            C: V47 },
  { n: 48, name: 'Scores — 2×3 grid',                C: V48 },
  { n: 49, name: 'Big centered %',                   C: V49 },
  { n: 50, name: 'Retro scoreboard',                 C: V50 },
];

export default function AdminOddsDemo() {
  const [filter, setFilter] = useState('');

  const filtered = VARIANTS.filter(v =>
    filter === '' || v.name.toLowerCase().includes(filter.toLowerCase()) || String(v.n) === filter
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">עיצובי תחזית המשחק — 50 וריאציות</h2>
        <p className="text-slate-400 text-sm">נתוני דמו: Brazil {DEMO.home}% / תיקו {DEMO.draw}% / Argentina {DEMO.away}%</p>
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
