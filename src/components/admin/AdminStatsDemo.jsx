import React, { useState } from 'react';
import {
  Trophy, Target, TrendingUp, Star, Zap, Award,
  BarChart2, Activity, Flame, Crown, Sparkles, Calendar
} from 'lucide-react';

// ── Demo data ──────────────────────────────────────────────
const AVG_MATCH  = 6.37;
const AVG_ROUND  = 82.77;
const BEST = {
  teamA: 'ספרד', flagA: '🇪🇸',
  teamB: 'כף ורדה', flagB: '🇨🇻',
  score: '4 - 1',
  guess: '4 - 1',
  points: 21.65,
  date: '15.6.2026',
};

const Label = ({ n, name }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="text-xs font-black text-slate-500 w-6 text-right">{n}</span>
    <span className="text-xs text-slate-400">{name}</span>
  </div>
);

// ─── 1. Current ───────────────────────────────────────────
const V1 = () => (
  <div className="space-y-3">
    <div className="rounded-2xl p-5 text-center" style={{ background: '#1e2d45' }}>
      <p className="text-white/60 text-sm mb-1">ממוצע נקודות למשחק</p>
      <p className="text-3xl font-black text-blue-400">{AVG_MATCH}</p>
    </div>
    <div className="rounded-2xl p-5 text-center" style={{ background: '#1a2e20' }}>
      <p className="text-white/60 text-sm mb-1">ממוצע נקודות למחזור</p>
      <p className="text-3xl font-black text-green-400">{AVG_ROUND}</p>
    </div>
    <div className="rounded-2xl p-5" style={{ background: '#1e2535' }}>
      <p className="text-center text-white text-sm font-bold mb-3">🏆 המשחק הכי טוב שלך</p>
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-3xl">{BEST.flagA}</span>
        <span className="text-white font-black">{BEST.score}</span>
        <span className="text-3xl">{BEST.flagB}</span>
      </div>
      <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <p className="text-white/40 text-xs">הניחוש שלך · {BEST.guess}</p>
        <p className="text-green-400 font-black text-lg">{BEST.points}</p>
      </div>
    </div>
  </div>
);

// ─── 2. Gradient colored cards + icons ───────────────────
const V2 = () => (
  <div className="space-y-3">
    <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg,#1e3a5f,#0f2340)' }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.25)' }}>
        <Target className="w-6 h-6 text-blue-400" />
      </div>
      <div>
        <p className="text-white/50 text-xs">ממוצע למשחק</p>
        <p className="text-3xl font-black text-white">{AVG_MATCH}</p>
      </div>
    </div>
    <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg,#1a3d2a,#0d2118)' }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.2)' }}>
        <TrendingUp className="w-6 h-6 text-green-400" />
      </div>
      <div>
        <p className="text-white/50 text-xs">ממוצע למחזור</p>
        <p className="text-3xl font-black text-white">{AVG_ROUND}</p>
      </div>
    </div>
    <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,#3b1f00,#1a0e00)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-amber-400" />
        <p className="text-amber-300 text-sm font-bold">המשחק הכי טוב שלך</p>
      </div>
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-3xl">{BEST.flagA}</span>
        <span className="text-white font-black text-xl">{BEST.score}</span>
        <span className="text-3xl">{BEST.flagB}</span>
      </div>
      <div className="flex justify-between text-xs px-1">
        <span className="text-white/40">ניחוש: {BEST.guess}</span>
        <span className="text-amber-400 font-black">{BEST.points} נק׳</span>
      </div>
    </div>
  </div>
);

// ─── 3. Glassmorphism neon ────────────────────────────────
const V3 = () => (
  <div className="space-y-3">
    <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 20px rgba(59,130,246,0.1)', backdropFilter: 'blur(12px)' }}>
      <p className="text-blue-300/60 text-xs mb-1 tracking-wide">ממוצע נקודות למשחק</p>
      <p className="text-4xl font-black text-blue-400" style={{ textShadow: '0 0 20px rgba(59,130,246,0.8)' }}>{AVG_MATCH}</p>
    </div>
    <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', boxShadow: '0 0 20px rgba(34,197,94,0.1)' }}>
      <p className="text-green-300/60 text-xs mb-1 tracking-wide">ממוצע נקודות למחזור</p>
      <p className="text-4xl font-black text-green-400" style={{ textShadow: '0 0 20px rgba(34,197,94,0.8)' }}>{AVG_ROUND}</p>
    </div>
    <div className="rounded-2xl p-4" style={{ background: 'rgba(245,197,24,0.06)', border: '1px solid rgba(245,197,24,0.3)', boxShadow: '0 0 20px rgba(245,197,24,0.08)' }}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-amber-400 text-xs font-bold tracking-widest">המשחק הכי טוב</span>
      </div>
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-3xl">{BEST.flagA}</span>
        <span className="text-2xl font-black text-white" style={{ textShadow: '0 0 12px rgba(245,197,24,0.5)' }}>{BEST.score}</span>
        <span className="text-3xl">{BEST.flagB}</span>
      </div>
      <div className="text-center">
        <span className="text-amber-400 font-black text-xl" style={{ textShadow: '0 0 12px rgba(245,197,24,0.6)' }}>{BEST.points}</span>
        <span className="text-amber-400/50 text-xs ml-1">נקודות</span>
      </div>
    </div>
  </div>
);

// ─── 4. Sports scorecard ──────────────────────────────────
const V4 = () => (
  <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0d12', border: '1px solid #1e2535' }}>
    <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#111827', borderBottom: '1px solid #1e2535' }}>
      <BarChart2 className="w-4 h-4 text-slate-500" />
      <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Stats</span>
    </div>
    {[{ label: 'ממוצע למשחק', value: AVG_MATCH, color: '#60a5fa' }, { label: 'ממוצע למחזור', value: AVG_ROUND, color: '#4ade80' }].map(({ label, value, color }, i) => (
      <div key={i} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1e2535' }}>
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="font-mono font-black text-xl" style={{ color }}>{value}</span>
      </div>
    ))}
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-amber-500" />
        <span className="text-amber-500 text-xs font-bold">BEST MATCH</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{BEST.flagA}</span>
          <span className="text-slate-300 text-xs">{BEST.teamA}</span>
        </div>
        <span className="font-mono font-black text-white text-lg bg-slate-800 px-3 py-1 rounded-lg">{BEST.score}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-300 text-xs">{BEST.teamB}</span>
          <span className="text-2xl">{BEST.flagB}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: '1px solid #1e2535' }}>
        <span className="text-slate-500 text-xs">{BEST.date}</span>
        <span className="text-amber-500 font-black">{BEST.points} pts</span>
      </div>
    </div>
  </div>
);

// ─── 5. Hero numbers minimal ──────────────────────────────
const V5 = () => (
  <div className="space-y-1">
    <div className="flex items-end gap-3 px-2 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-6xl font-black text-white leading-none">{AVG_MATCH}</span>
      <span className="text-white/30 text-sm pb-1">ממוצע למשחק</span>
    </div>
    <div className="flex items-end gap-3 px-2 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-6xl font-black text-white leading-none">{AVG_ROUND}</span>
      <span className="text-white/30 text-sm pb-1">ממוצע למחזור</span>
    </div>
    <div className="px-2 py-4">
      <p className="text-white/30 text-xs mb-2">המשחק הכי טוב</p>
      <div className="flex items-center gap-2">
        <span className="text-3xl">{BEST.flagA}</span>
        <span className="text-2xl font-black text-white">{BEST.score}</span>
        <span className="text-3xl">{BEST.flagB}</span>
        <span className="ml-auto text-amber-400 font-black text-xl">{BEST.points}</span>
      </div>
    </div>
  </div>
);

// ─── 6. Horizontal chips + big match ─────────────────────
const V6 = () => (
  <div className="space-y-4">
    <div className="flex gap-2">
      {[{ l: 'למשחק', v: AVG_MATCH, c: '#3b82f6' }, { l: 'למחזור', v: AVG_ROUND, c: '#22c55e' }].map(({ l, v, c }) => (
        <div key={l} className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${c}30` }}>
          <p className="text-[10px] text-white/40 mb-1">{l}</p>
          <p className="text-2xl font-black" style={{ color: c }}>{v}</p>
        </div>
      ))}
    </div>
    <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, rgba(245,197,24,0.15) 0%, rgba(0,0,0,0) 60%)', border: '1px solid rgba(245,197,24,0.2)' }}>
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-400" />
        <span className="text-amber-300 font-bold text-sm">המשחק הכי טוב שלך</span>
      </div>
      <div className="flex items-center justify-between px-4 pb-4 pt-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl">{BEST.flagA}</span>
          <span className="text-white/50 text-[10px]">{BEST.teamA}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl font-black text-white">{BEST.score}</span>
          <span className="text-amber-400 font-black text-lg">{BEST.points} נק׳</span>
          <span className="text-white/30 text-[10px]">{BEST.date}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl">{BEST.flagB}</span>
          <span className="text-white/50 text-[10px]">{BEST.teamB}</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── 7. Holographic ──────────────────────────────────────
const V7 = () => (
  <div className="space-y-3">
    {[{ l: 'ממוצע נקודות למשחק', v: AVG_MATCH, g: '135deg,#4f46e5,#06b6d4' },
      { l: 'ממוצע נקודות למחזור', v: AVG_ROUND, g: '135deg,#059669,#0284c7' }].map(({ l, v, g }) => (
      <div key={l} className="p-px rounded-2xl" style={{ background: `linear-gradient(${g})` }}>
        <div className="rounded-[15px] px-4 py-4 flex items-center justify-between" style={{ background: '#0d1117' }}>
          <span className="text-white/50 text-sm">{l}</span>
          <span className="text-2xl font-black text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(${g})` }}>{v}</span>
        </div>
      </div>
    ))}
    <div className="p-px rounded-2xl" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)' }}>
      <div className="rounded-[15px] p-4" style={{ background: '#0d1117' }}>
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="text-transparent bg-clip-text font-bold text-sm" style={{ backgroundImage: 'linear-gradient(90deg,#f59e0b,#ef4444)' }}>המשחק הכי טוב</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">{BEST.flagA}</span>
          <span className="text-xl font-black text-white">{BEST.score}</span>
          <span className="text-3xl">{BEST.flagB}</span>
        </div>
        <div className="text-center mt-2">
          <span className="text-transparent bg-clip-text font-black text-2xl" style={{ backgroundImage: 'linear-gradient(90deg,#f59e0b,#ef4444)' }}>{BEST.points}</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── 8. Terminal ──────────────────────────────────────────
const V8 = () => (
  <div className="rounded-xl overflow-hidden font-mono text-sm" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
    <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#161b22', borderBottom: '1px solid #30363d' }}>
      <div className="flex gap-1.5">{['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}</div>
      <span className="text-slate-500 text-xs">stats.sh</span>
    </div>
    <div className="p-3 space-y-1">
      <p className="text-green-500">$ stats --user</p>
      <p className="text-slate-500"># ממוצע נקודות</p>
      <p className="text-white">avg_per_match=<span className="text-cyan-400">{AVG_MATCH}</span></p>
      <p className="text-white">avg_per_round=<span className="text-cyan-400">{AVG_ROUND}</span></p>
      <p className="text-slate-500 mt-2"># best match</p>
      <p className="text-white">match=<span className="text-yellow-400">"{BEST.teamA} {BEST.score} {BEST.teamB}"</span></p>
      <p className="text-white">guess=<span className="text-yellow-400">"{BEST.guess}"</span></p>
      <p className="text-white">points=<span className="text-green-400">{BEST.points}</span></p>
      <p className="text-green-500 mt-1">✓ done</p>
    </div>
  </div>
);

// ─── 9. Cyberpunk ─────────────────────────────────────────
const V9 = () => (
  <div className="space-y-2">
    {[{ l: 'AVG / MATCH', v: AVG_MATCH, c: '#00ffff' }, { l: 'AVG / ROUND', v: AVG_ROUND, c: '#00ff88' }].map(({ l, v, c }) => (
      <div key={l} className="px-4 py-3 flex justify-between items-center"
        style={{ background: `${c}08`, borderLeft: `3px solid ${c}`, clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)' }}>
        <span className="font-mono text-xs" style={{ color: `${c}99` }}>{l}</span>
        <span className="font-mono font-black text-2xl" style={{ color: c, textShadow: `0 0 12px ${c}` }}>{v}</span>
      </div>
    ))}
    <div className="px-4 py-3 mt-1"
      style={{ background: 'rgba(255,200,0,0.06)', borderLeft: '3px solid #ffc800', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)' }}>
      <p className="font-mono text-xs text-yellow-400/60 mb-2">BEST_MATCH.exe</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{BEST.flagA}</span>
        <span className="font-mono font-black text-white text-lg" style={{ textShadow: '0 0 8px #ffc800' }}>{BEST.score}</span>
        <span className="text-2xl">{BEST.flagB}</span>
        <span className="ml-auto font-mono font-black text-yellow-400 text-xl" style={{ textShadow: '0 0 8px #ffc800' }}>{BEST.points}</span>
      </div>
    </div>
  </div>
);

// ─── 10. Retro arcade ────────────────────────────────────
const V10 = () => (
  <div className="space-y-3 font-mono">
    <div className="rounded-xl p-4 text-center" style={{ background: '#000', border: '2px solid #ff00ff', boxShadow: '0 0 16px rgba(255,0,255,0.4), inset 0 0 16px rgba(255,0,255,0.05)' }}>
      <p className="text-[10px] tracking-widest" style={{ color: '#ff00ff99' }}>PER MATCH</p>
      <p className="text-4xl font-black" style={{ color: '#ff00ff', textShadow: '0 0 12px #ff00ff' }}>{AVG_MATCH}</p>
    </div>
    <div className="rounded-xl p-4 text-center" style={{ background: '#000', border: '2px solid #00ff88', boxShadow: '0 0 16px rgba(0,255,136,0.4), inset 0 0 16px rgba(0,255,136,0.05)' }}>
      <p className="text-[10px] tracking-widest" style={{ color: '#00ff8899' }}>PER ROUND</p>
      <p className="text-4xl font-black" style={{ color: '#00ff88', textShadow: '0 0 12px #00ff88' }}>{AVG_ROUND}</p>
    </div>
    <div className="rounded-xl p-3 text-center" style={{ background: '#000', border: '2px solid #ffd700', boxShadow: '0 0 16px rgba(255,215,0,0.4)' }}>
      <p className="text-[10px] tracking-widest mb-2" style={{ color: '#ffd70099' }}>★ BEST MATCH ★</p>
      <p className="text-white text-lg">{BEST.flagA} {BEST.score} {BEST.flagB}</p>
      <p className="text-3xl font-black mt-1" style={{ color: '#ffd700', textShadow: '0 0 12px #ffd700' }}>{BEST.points}</p>
    </div>
  </div>
);

// ─── 11. Frosted glass rainbow border ────────────────────
const V11 = () => (
  <div className="space-y-3">
    {[{ l: 'ממוצע נקודות למשחק', v: AVG_MATCH, angle: '135deg,#60a5fa,#a78bfa' },
      { l: 'ממוצע נקודות למחזור', v: AVG_ROUND, angle: '135deg,#34d399,#60a5fa' }].map(({ l, v, angle }) => (
      <div key={l} className="p-[1.5px] rounded-2xl" style={{ background: `linear-gradient(${angle})` }}>
        <div className="rounded-[14px] p-4 flex justify-between items-center" style={{ background: 'rgba(10,14,25,0.95)', backdropFilter: 'blur(20px)' }}>
          <p className="text-white/50 text-xs">{l}</p>
          <p className="text-2xl font-black text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(${angle})` }}>{v}</p>
        </div>
      </div>
    ))}
    <div className="p-[1.5px] rounded-2xl" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6,#3b82f6)' }}>
      <div className="rounded-[14px] p-4" style={{ background: 'rgba(10,14,25,0.95)', backdropFilter: 'blur(20px)' }}>
        <p className="text-white/50 text-xs mb-3">🏆 המשחק הכי טוב שלך</p>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">{BEST.flagA}</span>
          <span className="text-2xl font-black text-white">{BEST.score}</span>
          <span className="text-3xl">{BEST.flagB}</span>
        </div>
        <p className="text-center font-black text-2xl text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#f59e0b,#ef4444)' }}>{BEST.points} נק׳</p>
      </div>
    </div>
  </div>
);

// ─── 12. Dark luxury gold ────────────────────────────────
const V12 = () => (
  <div className="space-y-3">
    {[{ l: 'ממוצע נקודות למשחק', v: AVG_MATCH }, { l: 'ממוצע נקודות למחזור', v: AVG_ROUND }].map(({ l, v }) => (
      <div key={l} className="rounded-2xl px-5 py-4 flex justify-between items-center"
        style={{ background: 'linear-gradient(135deg,#1a1400,#0d0a00)', border: '1px solid rgba(245,197,24,0.2)' }}>
        <span className="text-amber-200/50 text-xs">{l}</span>
        <span className="text-3xl font-black text-amber-400" style={{ textShadow: '0 0 20px rgba(245,197,24,0.4)' }}>{v}</span>
      </div>
    ))}
    <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,#1a1400,#0d0a00)', border: '1px solid rgba(245,197,24,0.35)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(245,197,24,0.4))' }} />
        <Crown className="w-4 h-4 text-amber-400" />
        <span className="text-amber-400 text-xs font-bold tracking-widest">BEST MATCH</span>
        <Crown className="w-4 h-4 text-amber-400" />
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,rgba(245,197,24,0.4),transparent)' }} />
      </div>
      <div className="flex justify-center gap-4 mb-3">
        <span className="text-4xl">{BEST.flagA}</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-white">{BEST.score}</span>
          <span className="text-amber-400/60 text-[10px]">{BEST.date}</span>
        </div>
        <span className="text-4xl">{BEST.flagB}</span>
      </div>
      <div className="text-center">
        <span className="text-amber-400 font-black text-3xl" style={{ textShadow: '0 0 20px rgba(245,197,24,0.5)' }}>{BEST.points}</span>
        <span className="text-amber-400/50 text-sm ml-1">נקודות</span>
      </div>
    </div>
  </div>
);

// ─── 13. Brutalist ───────────────────────────────────────
const V13 = () => (
  <div className="space-y-3">
    {[{ l: 'ממוצע / משחק', v: AVG_MATCH, c: '#60a5fa' },
      { l: 'ממוצע / מחזור', v: AVG_ROUND, c: '#4ade80' }].map(({ l, v, c }) => (
      <div key={l} className="p-4" style={{ background: c + '15', border: `3px solid ${c}`, borderRadius: 4 }}>
        <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: c }}>{l}</p>
        <p className="text-4xl font-black text-white">{v}</p>
      </div>
    ))}
    <div className="p-4" style={{ background: '#fbbf2415', border: '3px solid #fbbf24', borderRadius: 4 }}>
      <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">⭐ BEST MATCH</p>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{BEST.flagA}</span>
        <span className="text-2xl font-black text-white">{BEST.score}</span>
        <span className="text-3xl">{BEST.flagB}</span>
        <span className="ml-auto text-3xl font-black text-amber-400">{BEST.points}</span>
      </div>
    </div>
  </div>
);

// ─── 14. Neumorphism dark ────────────────────────────────
const V14 = () => (
  <div className="space-y-4 p-2" style={{ background: '#1a2035', borderRadius: 20 }}>
    {[{ l: 'ממוצע נקודות למשחק', v: AVG_MATCH, c: '#60a5fa' },
      { l: 'ממוצע נקודות למחזור', v: AVG_ROUND, c: '#4ade80' }].map(({ l, v, c }) => (
      <div key={l} className="px-5 py-4 rounded-2xl flex justify-between items-center"
        style={{ background: '#1a2035', boxShadow: '-4px -4px 10px rgba(255,255,255,0.04), 4px 4px 12px rgba(0,0,0,0.5)' }}>
        <span className="text-white/40 text-xs">{l}</span>
        <span className="text-2xl font-black" style={{ color: c }}>{v}</span>
      </div>
    ))}
    <div className="px-5 py-4 rounded-2xl"
      style={{ background: '#1a2035', boxShadow: '-4px -4px 10px rgba(255,255,255,0.04), 4px 4px 12px rgba(0,0,0,0.5)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-amber-400" />
        <span className="text-amber-400/70 text-xs">המשחק הכי טוב שלך</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <span className="text-3xl">{BEST.flagA}</span>
        <span className="text-xl font-black text-white">{BEST.score}</span>
        <span className="text-3xl">{BEST.flagB}</span>
      </div>
      <p className="text-center mt-2 text-amber-400 font-black text-xl">{BEST.points} נק׳</p>
    </div>
  </div>
);

// ─── 15. Split layout ────────────────────────────────────
const V15 = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <Activity className="w-4 h-4 text-blue-400 mx-auto mb-1" />
        <p className="text-2xl font-black text-blue-400">{AVG_MATCH}</p>
        <p className="text-[10px] text-white/30 mt-1">למשחק</p>
      </div>
      <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
        <p className="text-2xl font-black text-green-400">{AVG_ROUND}</p>
        <p className="text-[10px] text-white/30 mt-1">למחזור</p>
      </div>
    </div>
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(245,197,24,0.2)' }}>
      <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(245,197,24,0.08)' }}>
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span className="text-amber-300 text-xs font-bold">המשחק הכי טוב שלך</span>
      </div>
      <div className="p-4" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{BEST.flagA}</span>
            <span className="text-white/60 text-xs">{BEST.teamA}</span>
          </div>
          <div className="px-4 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <span className="text-white font-black text-lg">{BEST.score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xs">{BEST.teamB}</span>
            <span className="text-3xl">{BEST.flagB}</span>
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/30">ניחוש: {BEST.guess}</span>
          <span className="text-amber-400 font-black">{BEST.points} נק׳</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── 16. Timeline stacked ────────────────────────────────
const V16 = () => (
  <div className="relative pl-6">
    <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-green-500 to-amber-500" />
    {[
      { icon: Target, color: '#60a5fa', label: 'ממוצע למשחק', value: AVG_MATCH },
      { icon: TrendingUp, color: '#4ade80', label: 'ממוצע למחזור', value: AVG_ROUND },
      { icon: Trophy, color: '#fbbf24', label: 'נקודות הכי טוב', value: BEST.points },
    ].map(({ icon: Icon, color, label, value }, i) => (
      <div key={i} className="flex items-center gap-3 mb-4 relative">
        <div className="absolute -left-[18px] w-3 h-3 rounded-full border-2" style={{ background: '#0f172a', borderColor: color, boxShadow: `0 0 6px ${color}` }} />
        <div className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${color}30` }}>
          <span className="text-white/50 text-sm">{label}</span>
          <span className="font-black text-xl" style={{ color }}>{value}</span>
        </div>
      </div>
    ))}
    <div className="relative ml-0">
      <div className="absolute -left-[18px] w-3 h-3 rounded-full" style={{ background: '#fbbf24' }} />
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <span className="text-2xl">{BEST.flagA}</span>
        <span className="text-white font-black">{BEST.score}</span>
        <span className="text-2xl">{BEST.flagB}</span>
        <span className="text-[10px] text-white/30 ml-auto">{BEST.date}</span>
      </div>
    </div>
  </div>
);

// ─── 17. Circular progress ───────────────────────────────
const CircleProgress = ({ value, max, color, label, size = 80 }) => {
  const r = 32, circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" />
      </svg>
      <span className="font-black text-xl -mt-16" style={{ color }}>{value}</span>
      <span style={{ marginTop: 36 }} />
      <span className="text-[10px] text-white/40 text-center">{label}</span>
    </div>
  );
};
const V17 = () => (
  <div className="space-y-4">
    <div className="flex justify-around py-2">
      <CircleProgress value={AVG_MATCH} max={20} color="#60a5fa" label="למשחק" />
      <CircleProgress value={AVG_ROUND} max={150} color="#4ade80" label="למחזור" />
      <CircleProgress value={BEST.points} max={30} color="#fbbf24" label="הכי טוב" />
    </div>
    <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
      <p className="text-white/30 text-xs mb-2">המשחק הכי טוב</p>
      <div className="flex items-center justify-center gap-3">
        <span className="text-3xl">{BEST.flagA}</span>
        <span className="text-2xl font-black text-white">{BEST.score}</span>
        <span className="text-3xl">{BEST.flagB}</span>
      </div>
    </div>
  </div>
);

// ─── 18. Trophy ceremony ─────────────────────────────────
const V18 = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      {[{ l: 'למשחק', v: AVG_MATCH, c: '#93c5fd', Icon: Target },
        { l: 'למחזור', v: AVG_ROUND, c: '#86efac', Icon: BarChart2 }].map(({ l, v, c, Icon }) => (
        <div key={l} className="rounded-2xl p-3 flex flex-col items-center gap-1" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <Icon className="w-5 h-5 opacity-40" style={{ color: c }} />
          <span className="text-2xl font-black" style={{ color: c }}>{v}</span>
          <span className="text-[10px] text-white/30">{l}</span>
        </div>
      ))}
    </div>
    <div className="rounded-2xl p-5 text-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,197,24,0.18) 0%, rgba(0,0,0,0) 70%)', border: '1px solid rgba(245,197,24,0.25)' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(245,197,24,0.8),transparent)' }} />
      <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" style={{ filter: 'drop-shadow(0 0 8px rgba(245,197,24,0.6))' }} />
      <p className="text-amber-300/70 text-xs mb-3">המשחק הכי טוב שלך</p>
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-4xl">{BEST.flagA}</span>
        <span className="text-2xl font-black text-white">{BEST.score}</span>
        <span className="text-4xl">{BEST.flagB}</span>
      </div>
      <span className="text-4xl font-black text-amber-400" style={{ textShadow: '0 0 20px rgba(245,197,24,0.5)' }}>{BEST.points}</span>
      <span className="text-amber-400/50 text-sm"> נקודות</span>
    </div>
  </div>
);

// ─── 19. Broadcast overlay ───────────────────────────────
const V19 = () => (
  <div className="space-y-2">
    <div className="px-3 py-2 flex items-center gap-3" style={{ background: '#001a4d', borderLeft: '3px solid #0066ff' }}>
      <span className="text-blue-400/60 text-[10px] font-black tracking-widest uppercase">AVG/MATCH</span>
      <span className="ml-auto font-black text-2xl text-white">{AVG_MATCH}</span>
    </div>
    <div className="px-3 py-2 flex items-center gap-3" style={{ background: '#001a10', borderLeft: '3px solid #00cc44' }}>
      <span className="text-green-400/60 text-[10px] font-black tracking-widest uppercase">AVG/ROUND</span>
      <span className="ml-auto font-black text-2xl text-white">{AVG_ROUND}</span>
    </div>
    <div className="mt-2 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="px-3 py-1.5" style={{ background: '#cc9900' }}>
        <span className="text-black font-black text-xs tracking-widest">★ BEST MATCH</span>
      </div>
      <div className="p-3" style={{ background: '#0f0f0f' }}>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{BEST.flagA}</span>
          <span className="font-black text-white text-xl flex-1 text-center">{BEST.score}</span>
          <span className="text-3xl">{BEST.flagB}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-white/30 text-xs">{BEST.date}</span>
          <span className="text-yellow-400 font-black">{BEST.points} pts</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── 20. Editorial minimal ───────────────────────────────
const V20 = () => (
  <div className="space-y-6 py-2">
    <div className="space-y-4">
      {[{ l: 'ממוצע נקודות למשחק', v: AVG_MATCH, c: '#c7d2fe' },
        { l: 'ממוצע נקודות למחזור', v: AVG_ROUND, c: '#bbf7d0' }].map(({ l, v, c }) => (
        <div key={l} className="flex items-baseline justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
          <span className="text-white/40 text-xs">{l}</span>
          <span className="text-4xl font-black" style={{ color: c }}>{v}</span>
        </div>
      ))}
    </div>
    <div>
      <p className="text-white/20 text-[10px] uppercase tracking-widest mb-3">המשחק הכי טוב שלך</p>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{BEST.flagA}</span>
        <div>
          <p className="text-2xl font-black text-white">{BEST.score}</p>
          <p className="text-white/30 text-xs">{BEST.teamA} · {BEST.teamB}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-3xl font-black text-amber-400">{BEST.points}</p>
          <p className="text-white/30 text-xs">{BEST.date}</p>
        </div>
      </div>
    </div>
  </div>
);

// ─── 21. Billboard neon ──────────────────────────────────
const V21 = () => (
  <div className="rounded-2xl overflow-hidden" style={{ background: '#050505' }}>
    <div className="p-4 grid grid-cols-2 gap-3">
      {[{ l: 'PER MATCH', v: AVG_MATCH, c: '#ff6b6b' }, { l: 'PER ROUND', v: AVG_ROUND, c: '#51cf66' }].map(({ l, v, c }) => (
        <div key={l} className="rounded-xl p-3 text-center" style={{ border: `1px solid ${c}44` }}>
          <p className="text-[9px] tracking-widest mb-1" style={{ color: `${c}88` }}>{l}</p>
          <p className="text-2xl font-black" style={{ color: c, textShadow: `0 0 10px ${c}88` }}>{v}</p>
        </div>
      ))}
    </div>
    <div className="px-4 pb-4">
      <div className="rounded-xl p-3 text-center" style={{ border: '1px solid #ffd70044' }}>
        <p className="text-[9px] tracking-widest mb-2" style={{ color: '#ffd70088' }}>BEST MATCH</p>
        <div className="flex justify-center gap-2 items-center mb-1">
          <span className="text-2xl">{BEST.flagA}</span>
          <span className="font-black text-white text-lg">{BEST.score}</span>
          <span className="text-2xl">{BEST.flagB}</span>
        </div>
        <p className="text-2xl font-black" style={{ color: '#ffd700', textShadow: '0 0 10px #ffd70088' }}>{BEST.points}</p>
      </div>
    </div>
  </div>
);

// ─── 22. Cosmic / space ──────────────────────────────────
const V22 = () => (
  <div className="space-y-3">
    {[{ l: 'ממוצע נקודות למשחק', v: AVG_MATCH, g: 'radial-gradient(ellipse at 30% 50%,rgba(99,102,241,0.3),transparent 70%)', c: '#a5b4fc' },
      { l: 'ממוצע נקודות למחזור', v: AVG_ROUND, g: 'radial-gradient(ellipse at 70% 50%,rgba(16,185,129,0.25),transparent 70%)', c: '#6ee7b7' }].map(({ l, v, g, c }) => (
      <div key={l} className="rounded-2xl px-5 py-4 flex justify-between items-center relative overflow-hidden"
        style={{ background: '#060a14', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute inset-0" style={{ background: g }} />
        <span className="relative text-white/40 text-xs">{l}</span>
        <span className="relative text-3xl font-black" style={{ color: c }}>{v}</span>
      </div>
    ))}
    <div className="rounded-2xl p-4 relative overflow-hidden"
      style={{ background: '#060a14', border: '1px solid rgba(245,197,24,0.15)' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(245,197,24,0.12),transparent 70%)' }} />
      <div className="relative flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-amber-300/70 text-xs">המשחק הכי טוב שלך</span>
      </div>
      <div className="relative flex items-center justify-center gap-4 mb-2">
        <span className="text-4xl">{BEST.flagA}</span>
        <span className="text-2xl font-black text-white">{BEST.score}</span>
        <span className="text-4xl">{BEST.flagB}</span>
      </div>
      <p className="relative text-center text-amber-400 font-black text-2xl">{BEST.points}</p>
    </div>
  </div>
);

// ─── 23. Art deco geometric ──────────────────────────────
const V23 = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      {[{ l: 'ממוצע למשחק', v: AVG_MATCH, c: '#fde68a' },
        { l: 'ממוצע למחזור', v: AVG_ROUND, c: '#fde68a' }].map(({ l, v, c }) => (
        <div key={l} className="p-3 text-center relative" style={{ background: '#0d0a00', border: '1px solid rgba(253,230,138,0.25)' }}>
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: '#fde68a55' }} />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: '#fde68a55' }} />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: '#fde68a55' }} />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: '#fde68a55' }} />
          <p className="text-[9px] text-amber-200/40 tracking-widest mb-1">{l}</p>
          <p className="text-2xl font-black" style={{ color: c }}>{v}</p>
        </div>
      ))}
    </div>
    <div className="p-4 relative text-center" style={{ background: '#0d0a00', border: '1px solid rgba(253,230,138,0.3)' }}>
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: '#fde68a88' }} />
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: '#fde68a88' }} />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: '#fde68a88' }} />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: '#fde68a88' }} />
      <p className="text-[9px] text-amber-200/40 tracking-widest mb-3">◆ BEST MATCH ◆</p>
      <div className="flex justify-center gap-3 mb-2">
        <span className="text-3xl">{BEST.flagA}</span>
        <span className="text-xl font-black text-amber-200">{BEST.score}</span>
        <span className="text-3xl">{BEST.flagB}</span>
      </div>
      <p className="text-amber-400 font-black text-3xl">{BEST.points}</p>
    </div>
  </div>
);

// ─── 24. Gradient mesh ───────────────────────────────────
const V24 = () => (
  <div className="rounded-2xl overflow-hidden p-4 space-y-3"
    style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }}>
    {[{ l: 'ממוצע נקודות למשחק', v: AVG_MATCH, c: '#c4b5fd' },
      { l: 'ממוצע נקודות למחזור', v: AVG_ROUND, c: '#86efac' }].map(({ l, v, c }) => (
      <div key={l} className="flex justify-between items-center px-4 py-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}>
        <span className="text-white/50 text-xs">{l}</span>
        <span className="text-2xl font-black" style={{ color: c }}>{v}</span>
      </div>
    ))}
    <div className="px-4 py-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}>
      <p className="text-violet-300/60 text-xs mb-3">🏆 המשחק הכי טוב שלך</p>
      <div className="flex justify-center gap-3 mb-2">
        <span className="text-3xl">{BEST.flagA}</span>
        <span className="text-2xl font-black text-white">{BEST.score}</span>
        <span className="text-3xl">{BEST.flagB}</span>
      </div>
      <span className="text-3xl font-black text-violet-300">{BEST.points}</span>
    </div>
  </div>
);

// ─── 25. 3D perspective card ─────────────────────────────
const V25 = () => (
  <div className="space-y-3">
    {[{ l: 'ממוצע נקודות למשחק', v: AVG_MATCH, c1: '#1e3a8a', c2: '#1e40af', text: '#93c5fd' },
      { l: 'ממוצע נקודות למחזור', v: AVG_ROUND, c1: '#14532d', c2: '#166534', text: '#86efac' }].map(({ l, v, c1, c2, text }) => (
      <div key={l} className="rounded-2xl overflow-hidden" style={{ boxShadow: `4px 8px 24px ${c1}88` }}>
        <div className="px-5 py-4 flex justify-between items-center" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
          <span className="text-white/60 text-xs">{l}</span>
          <span className="text-3xl font-black" style={{ color: text }}>{v}</span>
        </div>
        <div className="h-1" style={{ background: `linear-gradient(90deg,${text}40,${text}10)` }} />
      </div>
    ))}
    <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '4px 8px 24px rgba(180,140,0,0.4)' }}>
      <div className="px-4 py-4" style={{ background: 'linear-gradient(135deg,#92400e,#b45309)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-amber-200" />
          <span className="text-amber-200 text-xs font-bold">המשחק הכי טוב שלך</span>
        </div>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">{BEST.flagA}</span>
          <span className="text-2xl font-black text-white">{BEST.score}</span>
          <span className="text-3xl">{BEST.flagB}</span>
        </div>
        <p className="text-center text-amber-200 font-black text-2xl">{BEST.points} נק׳</p>
      </div>
      <div className="h-1" style={{ background: 'linear-gradient(90deg,rgba(253,230,138,0.4),rgba(253,230,138,0.1))' }} />
    </div>
  </div>
);

// ── Variants registry ─────────────────────────────────────
const VARIANTS = [
  { n: 1,  name: 'נוכחי — כרטיסים כהים',           C: V1  },
  { n: 2,  name: 'Gradient cards + icons',          C: V2  },
  { n: 3,  name: 'Glassmorphism neon glow',         C: V3  },
  { n: 4,  name: 'Sports scorecard',                C: V4  },
  { n: 5,  name: 'Hero numbers minimal',            C: V5  },
  { n: 6,  name: 'Horizontal chips + big match',    C: V6  },
  { n: 7,  name: 'Holographic gradient border',     C: V7  },
  { n: 8,  name: 'Terminal monospace',              C: V8  },
  { n: 9,  name: 'Cyberpunk angular',               C: V9  },
  { n: 10, name: 'Retro arcade neon',               C: V10 },
  { n: 11, name: 'Frosted glass rainbow border',    C: V11 },
  { n: 12, name: 'Dark luxury gold',                C: V12 },
  { n: 13, name: 'Brutalist heavy borders',         C: V13 },
  { n: 14, name: 'Neumorphism dark',                C: V14 },
  { n: 15, name: 'Split layout grid',               C: V15 },
  { n: 16, name: 'Timeline stacked',                C: V16 },
  { n: 17, name: 'Circular progress rings',         C: V17 },
  { n: 18, name: 'Trophy ceremony',                 C: V18 },
  { n: 19, name: 'Broadcast overlay',               C: V19 },
  { n: 20, name: 'Editorial minimal',               C: V20 },
  { n: 21, name: 'Billboard neon',                  C: V21 },
  { n: 22, name: 'Cosmic / space',                  C: V22 },
  { n: 23, name: 'Art deco geometric',              C: V23 },
  { n: 24, name: 'Gradient mesh purple',            C: V24 },
  { n: 25, name: '3D perspective cards',            C: V25 },
];

export default function AdminStatsDemo() {
  const [filter, setFilter] = useState('');

  const filtered = VARIANTS.filter(v =>
    filter === '' ||
    v.name.toLowerCase().includes(filter.toLowerCase()) ||
    String(v.n) === filter
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">עיצובי סטטיסטיקה — 25 וריאציות</h2>
        <p className="text-slate-400 text-sm">דמו: ממוצע למשחק · ממוצע למחזור · המשחק הכי טוב</p>
      </div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="חפש לפי מספר או שם..."
        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-700 border border-slate-600 text-white placeholder-slate-400"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
