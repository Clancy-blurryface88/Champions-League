import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MATCHES = [
  { teamA: 'Brazil', teamB: 'Argentina', prediction: '2-0', actual: '2-0', exactScore: true, correctOutcome: true, points: 21.5, maxPoints: 21.5 },
  { teamA: 'France', teamB: 'Spain',     prediction: '1-1', actual: '3-3', exactScore: false, correctOutcome: true, points: 3.0,  maxPoints: 17.0 },
  { teamA: 'Germany', teamB: 'Portugal', prediction: '2-1', actual: '0-2', exactScore: false, correctOutcome: false, points: 0,    maxPoints: 17.0 },
];

function statusColor(m, type = 'bg') {
  if (m.exactScore)     return type === 'bg' ? 'rgba(16,185,129,0.18)' : '#10b981';
  if (m.correctOutcome) return type === 'bg' ? 'rgba(245,158,11,0.18)' : '#f59e0b';
  return                       type === 'bg' ? 'rgba(239,68,68,0.14)'  : '#ef4444';
}
function statusIcon(m) {
  if (m.exactScore) return '🎯';
  if (m.correctOutcome) return '✅';
  return '❌';
}
function pct(m) { return m.maxPoints > 0 ? Math.round((m.points / m.maxPoints) * 100) : 0; }

// ─── Wrapper ──────────────────────────────────────────────────────────────────
function Card({ num, title, desc, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-600">#{String(num).padStart(2,'0')}</span>
          <div className="text-left">
            <p className="text-white text-sm font-semibold leading-tight">{title}</p>
            <p className="text-slate-500 text-[10px] leading-tight">{desc}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <div className="p-3 space-y-2 border-t border-white/8">{children}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 01 Current — Split blue/green with scatter animation
// ══════════════════════════════════════════════════════════════════════════════
function D01() {
  return MATCHES.map((m, i) => (
    <motion.div key={i}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: statusColor(m, 'fg') + '66', background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex items-center px-3 pt-3 pb-1 gap-2 justify-between">
        <span className="text-white/70 text-xs font-medium">{m.teamA} vs {m.teamB}</span>
        <span>{statusIcon(m)}</span>
      </div>
      <div className="flex mx-3 mb-3 mt-1 rounded-lg overflow-hidden border border-white/8">
        <div className="flex-1 flex flex-col items-center py-2.5 bg-blue-900/20">
          <span className="text-[9px] text-blue-400 uppercase tracking-widest mb-1">הניחוש שלי</span>
          <span className="text-white font-bold text-lg">{m.prediction}</span>
        </div>
        <div className="w-px bg-white/8" />
        <div className="flex-1 flex flex-col items-center py-2.5" style={{ background: statusColor(m) }}>
          <span className="text-[9px] uppercase tracking-widest mb-1" style={{ color: statusColor(m, 'fg') }}>תוצאה</span>
          <span className="text-white font-bold text-lg">{m.actual}</span>
        </div>
      </div>
      <div className="mx-3 mb-3 flex items-center justify-between px-2 py-1.5 rounded-lg" style={{ background: statusColor(m) }}>
        <span className="text-[10px] font-bold" style={{ color: statusColor(m, 'fg') }}>{m.points.toFixed(2)} pts</span>
        <span className="text-[10px]" style={{ color: statusColor(m, 'fg'), opacity: 0.7 }}>({pct(m)}%)</span>
      </div>
    </motion.div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 02 Bento Box — flat dark tiles
// ══════════════════════════════════════════════════════════════════════════════
function D02() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-2xl p-3 flex gap-3" style={{ background: '#12181f', border: '1px solid #1e2a35' }}>
      <div className="flex flex-col justify-center min-w-[90px] gap-1">
        <span className="text-white/80 text-xs font-semibold leading-tight">{m.teamA}</span>
        <span className="text-white/40 text-[10px]">vs</span>
        <span className="text-white/80 text-xs font-semibold leading-tight">{m.teamB}</span>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2">
        <div className="rounded-xl flex flex-col items-center py-2" style={{ background: 'rgba(59,130,246,0.12)' }}>
          <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mb-0.5">ניחוש</span>
          <span className="text-white font-black text-base">{m.prediction}</span>
        </div>
        <div className="rounded-xl flex flex-col items-center py-2" style={{ background: statusColor(m) }}>
          <span className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: statusColor(m,'fg') }}>תוצאה</span>
          <span className="text-white font-black text-base">{m.actual}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1 min-w-[40px]">
        <span className="text-lg">{statusIcon(m)}</span>
        <span className="text-[10px] font-bold text-white/70">{m.points}</span>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 03 Liquid Glass
// ══════════════════════════════════════════════════════════════════════════════
function D03() {
  const gl = { backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.20)', boxShadow: '0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.30)' };
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-2xl p-3" style={gl}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/80 text-xs font-semibold">{m.teamA} vs {m.teamB}</span>
        <span>{statusIcon(m)}</span>
      </div>
      <div className="flex gap-2 mb-2">
        <div className="flex-1 rounded-xl py-2 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <p className="text-white/50 text-[9px] uppercase tracking-widest">ניחוש</p>
          <p className="text-white font-bold text-base">{m.prediction}</p>
        </div>
        <div className="flex-1 rounded-xl py-2 text-center" style={{ background: statusColor(m), border: `1px solid ${statusColor(m,'fg')}44` }}>
          <p className="text-[9px] uppercase tracking-widest" style={{ color: statusColor(m,'fg'), opacity: 0.8 }}>תוצאה</p>
          <p className="text-white font-bold text-base">{m.actual}</p>
        </div>
      </div>
      <div className="text-center">
        <span className="text-[10px] font-bold" style={{ color: statusColor(m,'fg') }}>{m.points} pts ({pct(m)}%)</span>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 04 Timeline — vertical with connector dots
// ══════════════════════════════════════════════════════════════════════════════
function D04() {
  return (
    <div className="relative pl-6">
      <div className="absolute left-2.5 top-2 bottom-2 w-px bg-white/10" />
      {MATCHES.map((m, i) => (
        <div key={i} className="relative mb-3 last:mb-0">
          <div className="absolute -left-[13px] top-3 w-3 h-3 rounded-full border-2" style={{ background: statusColor(m,'fg'), borderColor: statusColor(m,'fg') + '88' }} />
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/70 text-xs">{m.teamA} vs {m.teamB}</span>
              <span className="text-[10px] font-bold" style={{ color: statusColor(m,'fg') }}>{m.points} pts</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-blue-400 font-bold">🔵 {m.prediction}</span>
              <span className="text-white/30">→</span>
              <span className="font-bold" style={{ color: statusColor(m,'fg') }}>{statusIcon(m)} {m.actual}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 05 Ticket — perforated event ticket style
// ══════════════════════════════════════════════════════════════════════════════
function D05() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-xl overflow-hidden flex" style={{ background: '#0f172a', border: `2px solid ${statusColor(m,'fg')}55` }}>
      <div className="flex-1 p-3">
        <p className="text-white/50 text-[9px] uppercase tracking-widest mb-1">Match Prediction</p>
        <p className="text-white font-semibold text-xs mb-2">{m.teamA} vs {m.teamB}</p>
        <div className="flex gap-3">
          <div>
            <p className="text-[9px] text-blue-400 mb-0.5">הניחוש</p>
            <p className="text-white font-black text-sm">{m.prediction}</p>
          </div>
          <div className="w-px bg-white/10 self-stretch mx-1" />
          <div>
            <p className="text-[9px] mb-0.5" style={{ color: statusColor(m,'fg') }}>תוצאה</p>
            <p className="text-white font-black text-sm">{m.actual}</p>
          </div>
        </div>
      </div>
      <div className="w-px border-l-2 border-dashed" style={{ borderColor: statusColor(m,'fg') + '44' }} />
      <div className="flex flex-col items-center justify-center px-3 gap-1" style={{ background: statusColor(m) }}>
        <span className="text-base">{statusIcon(m)}</span>
        <span className="text-[10px] font-black text-white">{m.points}</span>
        <span className="text-[8px] text-white/60">pts</span>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 06 ESPN-style compact sports card
// ══════════════════════════════════════════════════════════════════════════════
function D06() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-lg overflow-hidden" style={{ background: '#1a1f2e', borderLeft: `3px solid ${statusColor(m,'fg')}` }}>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="text-center min-w-[36px]">
          <p className="text-white font-black text-sm">{m.prediction}</p>
          <p className="text-blue-400 text-[8px] font-bold uppercase">ניחוש</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-white/60 text-[10px] font-semibold">{m.teamA}</p>
          <p className="text-white/30 text-[8px]">vs</p>
          <p className="text-white/60 text-[10px] font-semibold">{m.teamB}</p>
        </div>
        <div className="text-center min-w-[36px]">
          <p className="text-white font-black text-sm">{m.actual}</p>
          <p className="text-[8px] font-bold uppercase" style={{ color: statusColor(m,'fg') }}>תוצאה</p>
        </div>
        <div className="text-center min-w-[28px]">
          <p className="font-bold text-xs" style={{ color: statusColor(m,'fg') }}>{m.points}</p>
          <p className="text-white/30 text-[8px]">pts</p>
        </div>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 07 Neon border glow
// ══════════════════════════════════════════════════════════════════════════════
function D07() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-xl p-3" style={{ background: '#080c14', border: `1px solid ${statusColor(m,'fg')}`, boxShadow: `0 0 12px ${statusColor(m,'fg')}44, inset 0 0 20px ${statusColor(m,'fg')}08` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/70 text-xs font-mono">{m.teamA} / {m.teamB}</span>
        <span className="text-xs font-black" style={{ color: statusColor(m,'fg'), textShadow: `0 0 8px ${statusColor(m,'fg')}` }}>{m.points} PTS</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 rounded-lg py-2 text-center border" style={{ borderColor: '#3b82f688', background: 'rgba(59,130,246,0.08)' }}>
          <p className="text-[9px] font-mono text-blue-400 mb-0.5">PRED</p>
          <p className="text-white font-black text-sm font-mono">{m.prediction}</p>
        </div>
        <div className="flex-1 rounded-lg py-2 text-center border" style={{ borderColor: statusColor(m,'fg') + '88', background: statusColor(m) }}>
          <p className="text-[9px] font-mono mb-0.5" style={{ color: statusColor(m,'fg') }}>RESULT</p>
          <p className="text-white font-black text-sm font-mono">{m.actual}</p>
        </div>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 08 Neumorphic
// ══════════════════════════════════════════════════════════════════════════════
function D08() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-2xl p-4" style={{ background: '#1e2433', boxShadow: '6px 6px 14px #13182a, -6px -6px 14px #29303c' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/60 text-xs font-semibold">{m.teamA} vs {m.teamB}</span>
        <span>{statusIcon(m)}</span>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl py-2.5 text-center" style={{ background: '#1e2433', boxShadow: 'inset 3px 3px 8px #13182a, inset -3px -3px 8px #29303c' }}>
          <p className="text-[9px] text-blue-400 font-semibold mb-0.5">ניחוש</p>
          <p className="text-white font-bold text-base">{m.prediction}</p>
        </div>
        <div className="flex-1 rounded-xl py-2.5 text-center" style={{ background: '#1e2433', boxShadow: `inset 3px 3px 8px #13182a, inset -3px -3px 8px #29303c, 0 0 0 1px ${statusColor(m,'fg')}44` }}>
          <p className="text-[9px] font-semibold mb-0.5" style={{ color: statusColor(m,'fg') }}>תוצאה</p>
          <p className="text-white font-bold text-base">{m.actual}</p>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className="text-[10px]" style={{ color: statusColor(m,'fg') }}>{m.points} pts · {pct(m)}%</span>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 09 Holographic gradient border
// ══════════════════════════════════════════════════════════════════════════════
function D09() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-xl p-[1.5px]" style={{ background: 'linear-gradient(135deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#c77dff)' }}>
      <div className="rounded-xl p-3" style={{ background: '#0d1117' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/70 text-xs">{m.teamA} vs {m.teamB}</span>
          <span>{statusIcon(m)}</span>
        </div>
        <div className="flex gap-2 mb-2">
          <div className="flex-1 rounded-lg py-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] text-white/40 mb-0.5">ניחוש</p>
            <p className="font-black text-base" style={{ background: 'linear-gradient(90deg,#4d96ff,#c77dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{m.prediction}</p>
          </div>
          <div className="flex-1 rounded-lg py-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] text-white/40 mb-0.5">תוצאה</p>
            <p className="font-black text-base" style={{ background: 'linear-gradient(90deg,#ff6b6b,#ffd93d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{m.actual}</p>
          </div>
        </div>
        <p className="text-center text-[10px] font-bold" style={{ background: 'linear-gradient(90deg,#6bcb77,#4d96ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{m.points} pts ({pct(m)}%)</p>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 10 Minimal — single row, no heavy containers
// ══════════════════════════════════════════════════════════════════════════════
function D10() {
  return MATCHES.map((m, i) => (
    <div key={i} className="flex items-center gap-3 py-2.5 px-1 border-b border-white/5 last:border-0">
      <span className="text-lg">{statusIcon(m)}</span>
      <div className="flex-1">
        <p className="text-white/70 text-xs leading-tight">{m.teamA} vs {m.teamB}</p>
        <p className="text-[10px] mt-0.5">
          <span className="text-blue-400 font-bold">{m.prediction}</span>
          <span className="text-white/25 mx-1">→</span>
          <span className="font-bold" style={{ color: statusColor(m,'fg') }}>{m.actual}</span>
        </p>
      </div>
      <span className="text-xs font-black tabular-nums" style={{ color: statusColor(m,'fg') }}>{m.points}</span>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 11 Progress Bar per match
// ══════════════════════════════════════════════════════════════════════════════
function D11() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/70 text-xs">{m.teamA} vs {m.teamB}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-blue-400 text-xs font-bold">{m.prediction}</span>
          <span className="text-white/25 text-xs">→</span>
          <span className="text-xs font-bold" style={{ color: statusColor(m,'fg') }}>{m.actual}</span>
          <span className="ml-1">{statusIcon(m)}</span>
        </div>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div className="h-full rounded-full"
          initial={{ width: 0 }} animate={{ width: `${pct(m)}%` }}
          transition={{ duration: 0.8, ease: [0.23,1,0.32,1] }}
          style={{ background: statusColor(m,'fg') }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-white/30">{m.points} pts</span>
        <span className="text-[9px] font-bold" style={{ color: statusColor(m,'fg') }}>{pct(m)}%</span>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 12 Dark Terminal / Code style
// ══════════════════════════════════════════════════════════════════════════════
function D12() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-lg p-3 font-mono text-[11px]" style={{ background: '#0a0f0a', border: '1px solid #1a2a1a' }}>
      <p style={{ color: '#22c55e' }}>{'>'} match.{m.teamA.toLowerCase()}_vs_{m.teamB.toLowerCase()}</p>
      <p style={{ color: '#6b7280' }}>  prediction: <span style={{ color: '#60a5fa' }}>"{m.prediction}"</span></p>
      <p style={{ color: '#6b7280' }}>  actual:     <span style={{ color: statusColor(m,'fg') }}>"{m.actual}"</span></p>
      <p style={{ color: '#6b7280' }}>  points:     <span style={{ color: '#f5c518' }}>{m.points}</span></p>
      <p style={{ color: '#6b7280' }}>  status:     <span style={{ color: statusColor(m,'fg') }}>"{m.exactScore ? 'EXACT' : m.correctOutcome ? 'CORRECT_OUTCOME' : 'MISS'}"</span></p>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 13 Comparison bars (side by side vertical bars)
// ══════════════════════════════════════════════════════════════════════════════
function D13() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/70 text-xs">{m.teamA} vs {m.teamB}</span>
        <span>{statusIcon(m)}</span>
      </div>
      <div className="flex gap-4 items-end justify-center h-16">
        <div className="flex flex-col items-center gap-1">
          <span className="text-white font-bold text-sm">{m.prediction}</span>
          <div className="w-10 rounded-t-sm" style={{ height: 32, background: 'rgba(59,130,246,0.5)' }} />
          <span className="text-[9px] text-blue-400">ניחוש</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white font-bold text-sm">{m.actual}</span>
          <div className="w-10 rounded-t-sm" style={{ height: pct(m) > 50 ? 44 : 20, background: statusColor(m,'fg') + 'aa' }} />
          <span className="text-[9px]" style={{ color: statusColor(m,'fg') }}>תוצאה</span>
        </div>
        <div className="flex flex-col items-center gap-1 mb-4">
          <span className="font-bold text-xs" style={{ color: statusColor(m,'fg') }}>{m.points}</span>
          <span className="text-[9px] text-white/30">pts</span>
        </div>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 14 Retro vintage badge style
// ══════════════════════════════════════════════════════════════════════════════
function D14() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-xl p-3" style={{ background: 'linear-gradient(135deg,#1a1400,#0d0a00)', border: `2px solid ${statusColor(m,'fg')}55`, boxShadow: `0 0 0 1px #f5c51820` }}>
      <div className="text-center mb-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: '#f5c518', opacity: 0.6 }}>World Cup 2026</span>
        <p className="text-white/70 text-xs mt-0.5">{m.teamA} vs {m.teamB}</p>
      </div>
      <div className="flex gap-2 mb-2">
        <div className="flex-1 rounded-lg py-2 text-center" style={{ background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.2)' }}>
          <p className="text-[9px] text-amber-400/60 font-bold uppercase tracking-wider mb-0.5">ניחוש</p>
          <p className="font-black text-base" style={{ color: '#f5c518' }}>{m.prediction}</p>
        </div>
        <div className="flex-1 rounded-lg py-2 text-center" style={{ background: statusColor(m), border: `1px solid ${statusColor(m,'fg')}44` }}>
          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: statusColor(m,'fg'), opacity: 0.8 }}>תוצאה</p>
          <p className="text-white font-black text-base">{m.actual}</p>
        </div>
      </div>
      <div className="text-center border-t border-white/8 pt-2">
        <span className="text-[10px] font-bold" style={{ color: '#f5c518' }}>{m.points} pts</span>
        <span className="text-[10px] text-white/30 mx-1">·</span>
        <span className="text-[10px]" style={{ color: statusColor(m,'fg') }}>{pct(m)}%</span>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 15 Frosted dark
// ══════════════════════════════════════════════════════════════════════════════
function D15() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-2xl p-3" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/55 text-xs">{m.teamA} vs {m.teamB}</span>
        <span className="text-[10px] font-bold" style={{ color: statusColor(m,'fg') }}>{m.points} pts</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-[9px] text-white/30 mb-0.5">ניחוש</p>
          <p className="text-white/80 font-bold text-base">{m.prediction}</p>
        </div>
        <div className="flex items-center text-white/20 text-sm">{statusIcon(m)}</div>
        <div className="flex-1 text-center py-2 rounded-xl" style={{ background: statusColor(m) }}>
          <p className="text-[9px] mb-0.5" style={{ color: statusColor(m,'fg'), opacity: 0.7 }}>תוצאה</p>
          <p className="text-white font-bold text-base">{m.actual}</p>
        </div>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 16 Chat bubble style — prediction as sent, result as received
// ══════════════════════════════════════════════════════════════════════════════
function D16() {
  return MATCHES.map((m, i) => (
    <div key={i} className="space-y-1.5">
      <p className="text-white/50 text-[10px] text-center">{m.teamA} vs {m.teamB}</p>
      <div className="flex justify-end">
        <div className="rounded-2xl rounded-tr-sm px-3 py-2" style={{ background: '#1d4ed8', maxWidth: '70%' }}>
          <p className="text-[9px] text-blue-200 mb-0.5">הניחוש שלי</p>
          <p className="text-white font-black text-base">{m.prediction}</p>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="rounded-2xl rounded-tl-sm px-3 py-2" style={{ background: statusColor(m), maxWidth: '70%' }}>
          <p className="text-[9px] mb-0.5" style={{ color: statusColor(m,'fg') }}>תוצאה {statusIcon(m)}</p>
          <p className="text-white font-black text-base">{m.actual}</p>
        </div>
      </div>
      <p className="text-center text-[9px] font-bold" style={{ color: statusColor(m,'fg') }}>{m.points} pts</p>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 17 Scoreboard / LED panel
// ══════════════════════════════════════════════════════════════════════════════
function D17() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-lg overflow-hidden" style={{ background: '#050a05', border: '1px solid #1a2a1a' }}>
      <div className="bg-gray-900 px-3 py-1 flex justify-between">
        <span className="text-[10px] font-mono text-gray-400">{m.teamA.toUpperCase()} VS {m.teamB.toUpperCase()}</span>
        <span className="text-[10px] font-mono" style={{ color: statusColor(m,'fg') }}>{statusIcon(m)}</span>
      </div>
      <div className="flex">
        <div className="flex-1 flex flex-col items-center py-3" style={{ background: '#070f07' }}>
          <span className="text-[8px] font-mono text-green-600 mb-1">PRED</span>
          <span className="font-mono font-black text-lg" style={{ color: '#00ff41', textShadow: '0 0 10px #00ff4188' }}>{m.prediction}</span>
        </div>
        <div className="w-px bg-green-900" />
        <div className="flex-1 flex flex-col items-center py-3" style={{ background: '#070f07' }}>
          <span className="text-[8px] font-mono mb-1" style={{ color: statusColor(m,'fg') + '99' }}>RESULT</span>
          <span className="font-mono font-black text-lg" style={{ color: statusColor(m,'fg'), textShadow: `0 0 10px ${statusColor(m,'fg')}88` }}>{m.actual}</span>
        </div>
        <div className="w-px bg-green-900" />
        <div className="flex flex-col items-center justify-center px-3" style={{ background: '#070f07' }}>
          <span className="font-mono font-black text-sm" style={{ color: '#f5c518', textShadow: '0 0 8px #f5c51888' }}>{m.points}</span>
          <span className="text-[8px] font-mono text-yellow-800">PTS</span>
        </div>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 18 Flip card (hover reveals result)
// ══════════════════════════════════════════════════════════════════════════════
function FlipCard({ m }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ perspective: 600, height: 80 }} onClick={() => setFlipped(f => !f)} className="cursor-pointer">
      <motion.div style={{ transformStyle: 'preserve-3d', position: 'relative', height: '100%' }}
        animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.45, ease: 'easeInOut' }}>
        {/* Front */}
        <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.35)', borderRadius: 12 }}
          className="flex flex-col items-center justify-center">
          <p className="text-[9px] text-blue-400 mb-1">הניחוש שלי · {m.teamA} vs {m.teamB}</p>
          <p className="text-white font-black text-2xl">{m.prediction}</p>
          <p className="text-[8px] text-white/30 mt-1">לחץ לגילוי תוצאה</p>
        </div>
        {/* Back */}
        <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0, background: statusColor(m), border: `1px solid ${statusColor(m,'fg')}66`, borderRadius: 12 }}
          className="flex flex-col items-center justify-center">
          <p className="text-[9px] mb-1" style={{ color: statusColor(m,'fg') }}>תוצאה {statusIcon(m)}</p>
          <p className="text-white font-black text-2xl">{m.actual}</p>
          <p className="font-bold text-sm mt-1" style={{ color: statusColor(m,'fg') }}>{m.points} pts</p>
        </div>
      </motion.div>
    </div>
  );
}
function D18() {
  return (
    <div className="space-y-2">
      <p className="text-white/40 text-[10px] text-center">לחץ על כרטיס לגילוי תוצאה</p>
      {MATCHES.map((m, i) => <FlipCard key={i} m={m} />)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 19 Stacked layers with offset shadow
// ══════════════════════════════════════════════════════════════════════════════
function D19() {
  return (
    <div className="space-y-4">
      {MATCHES.map((m, i) => (
        <div key={i} className="relative">
          <div className="absolute inset-0 rounded-xl translate-x-1.5 translate-y-1.5" style={{ background: statusColor(m,'fg') + '33' }} />
          <div className="relative rounded-xl p-3" style={{ background: '#111827', border: `1px solid ${statusColor(m,'fg')}55` }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-xs font-semibold">{m.teamA} vs {m.teamB}</span>
              <span>{statusIcon(m)}</span>
            </div>
            <div className="flex gap-2">
              <span className="flex-1 text-center py-2 rounded-lg text-blue-400 font-black text-base" style={{ background: 'rgba(59,130,246,0.10)' }}>{m.prediction}</span>
              <span className="flex-1 text-center py-2 rounded-lg font-black text-base text-white" style={{ background: statusColor(m) }}>{m.actual}</span>
            </div>
            <p className="text-center mt-2 text-[10px] font-bold" style={{ color: statusColor(m,'fg') }}>{m.points} pts</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 20 Accordion — click to expand breakdown
// ══════════════════════════════════════════════════════════════════════════════
function AccordionItem({ m }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span>{statusIcon(m)}</span>
          <span className="text-white/70 text-xs">{m.teamA} vs {m.teamB}</span>
          <span className="text-blue-400 font-bold text-xs">{m.prediction}</span>
          <span className="text-white/25 text-xs">→</span>
          <span className="font-bold text-xs" style={{ color: statusColor(m,'fg') }}>{m.actual}</span>
        </div>
        <span className="text-[10px] font-black" style={{ color: statusColor(m,'fg') }}>{m.points} pts</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-white/8">
          <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
            {['תוצאה מדויקת','כיוון נכון','BTTS','טווח שערים'].map((cat, ci) => (
              <div key={ci} className="flex justify-between px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <span className="text-white/50">{cat}</span>
                <span className="font-bold" style={{ color: statusColor(m,'fg') }}>{ci === 0 && m.exactScore ? '+15' : ci === 1 && m.correctOutcome ? '+3' : '+0'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function D20() { return MATCHES.map((m, i) => <AccordionItem key={i} m={m} />); }

// ══════════════════════════════════════════════════════════════════════════════
// 21 Gauge / donut ring per match
// ══════════════════════════════════════════════════════════════════════════════
function MiniDonut({ pct: p, color }) {
  const r = 18, c = 22, circ = 2 * Math.PI * r;
  return (
    <svg width={44} height={44}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={`${circ * p / 100} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`} />
      <text x={c} y={c + 4} textAnchor="middle" fill="white" fontSize={8} fontWeight="bold">{p}%</text>
    </svg>
  );
}
function D21() {
  return MATCHES.map((m, i) => (
    <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <MiniDonut pct={pct(m)} color={statusColor(m,'fg')} />
      <div className="flex-1">
        <p className="text-white/70 text-xs font-semibold">{m.teamA} vs {m.teamB}</p>
        <p className="text-[10px] mt-0.5">
          <span className="text-blue-400 font-bold">{m.prediction}</span>
          <span className="text-white/25 mx-1">→</span>
          <span className="font-bold" style={{ color: statusColor(m,'fg') }}>{m.actual}</span>
          <span className="ml-1">{statusIcon(m)}</span>
        </p>
      </div>
      <span className="font-black text-sm tabular-nums" style={{ color: statusColor(m,'fg') }}>{m.points}</span>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 22 Material Design chip style
// ══════════════════════════════════════════════════════════════════════════════
function D22() {
  return MATCHES.map((m, i) => (
    <div key={i} className="rounded-xl overflow-hidden" style={{ background: '#1e1e2e' }}>
      <div className="h-1" style={{ background: statusColor(m,'fg') }} />
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-xs">{m.teamA} vs {m.teamB}</span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: statusColor(m), color: statusColor(m,'fg') }}>
            {m.exactScore ? 'EXACT' : m.correctOutcome ? 'OUTCOME' : 'MISS'}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg py-2 text-center border border-blue-500/30" style={{ background: 'rgba(59,130,246,0.08)' }}>
            <p className="text-[9px] text-blue-400 font-medium mb-0.5">הניחוש שלי</p>
            <p className="text-white font-bold text-base">{m.prediction}</p>
          </div>
          <div className="flex-1 rounded-lg py-2 text-center" style={{ background: statusColor(m), border: `1px solid ${statusColor(m,'fg')}44` }}>
            <p className="text-[9px] font-medium mb-0.5" style={{ color: statusColor(m,'fg') }}>תוצאה</p>
            <p className="text-white font-bold text-base">{m.actual}</p>
          </div>
        </div>
        <p className="text-right text-[10px] mt-2 font-semibold" style={{ color: statusColor(m,'fg') }}>+{m.points} pts</p>
      </div>
    </div>
  ));
}

// ══════════════════════════════════════════════════════════════════════════════
// 23 Inline row — all on one line, ultra compact
// ══════════════════════════════════════════════════════════════════════════════
function D23() {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-4 text-[8px] text-white/25 px-2 pb-1 uppercase tracking-wider">
        <span>משחק</span><span className="text-center">ניחוש</span><span className="text-center">תוצאה</span><span className="text-right">נק'</span>
      </div>
      {MATCHES.map((m, i) => (
        <div key={i} className="grid grid-cols-4 items-center px-2 py-2 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <span className="text-white/60 truncate">{m.teamA} v {m.teamB}</span>
          <span className="text-center text-blue-400 font-bold">{m.prediction}</span>
          <span className="text-center font-bold" style={{ color: statusColor(m,'fg') }}>{m.actual} {statusIcon(m)}</span>
          <span className="text-right font-black" style={{ color: statusColor(m,'fg') }}>{m.points}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 24 Dashboard analytics style — wide stat card
// ══════════════════════════════════════════════════════════════════════════════
function D24() {
  const total = MATCHES.reduce((s, m) => s + m.points, 0);
  const exact = MATCHES.filter(m => m.exactScore).length;
  const correct = MATCHES.filter(m => m.correctOutcome && !m.exactScore).length;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[{ label: 'נקודות', value: total.toFixed(1), color: '#f5c518' },
          { label: 'מדויק', value: exact, color: '#10b981' },
          { label: 'נכון', value: correct, color: '#f59e0b' }].map((s, i) => (
          <div key={i} className="rounded-xl py-2 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[9px] text-white/40 mb-0.5">{s.label}</p>
            <p className="font-black text-base" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      {MATCHES.map((m, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${statusColor(m,'fg')}33` }}>
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColor(m,'fg') }} />
          <span className="text-white/60 text-xs flex-1">{m.teamA} vs {m.teamB}</span>
          <span className="text-blue-400 font-bold text-xs">{m.prediction}</span>
          <span className="text-white/25 text-xs">·</span>
          <span className="font-bold text-xs" style={{ color: statusColor(m,'fg') }}>{m.actual}</span>
          <span className="ml-1 font-black text-xs" style={{ color: statusColor(m,'fg') }}>{m.points}p</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 25 Instagram story strip — horizontal scroll
// ══════════════════════════════════════════════════════════════════════════════
function D25() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {MATCHES.map((m, i) => (
        <div key={i} className="shrink-0 rounded-2xl p-3 flex flex-col items-center gap-2" style={{ width: 120, background: `linear-gradient(160deg, ${statusColor(m,'fg')}22, rgba(255,255,255,0.04))`, border: `1px solid ${statusColor(m,'fg')}44` }}>
          <span className="text-xl">{statusIcon(m)}</span>
          <p className="text-white/60 text-[9px] text-center leading-tight">{m.teamA}<br />vs<br />{m.teamB}</p>
          <div className="w-full rounded-lg py-1.5 text-center" style={{ background: 'rgba(59,130,246,0.18)' }}>
            <p className="text-[9px] text-blue-400">ניחוש</p>
            <p className="text-white font-black text-sm">{m.prediction}</p>
          </div>
          <div className="w-full rounded-lg py-1.5 text-center" style={{ background: statusColor(m) }}>
            <p className="text-[9px]" style={{ color: statusColor(m,'fg') }}>תוצאה</p>
            <p className="text-white font-black text-sm">{m.actual}</p>
          </div>
          <p className="font-black text-xs" style={{ color: statusColor(m,'fg') }}>{m.points} pts</p>
        </div>
      ))}
    </div>
  );
}

// ─── Registry ─────────────────────────────────────────────────────────────────
const DEMOS = [
  { n:1,  t:'Current Style',      d:'Split card, scatter animation, border glow',     C: D01 },
  { n:2,  t:'Bento Box',          d:'flat dark tiles, 3-column layout',               C: D02 },
  { n:3,  t:'Liquid Glass',       d:'blur(24px) frosted glass cards',                 C: D03 },
  { n:4,  t:'Timeline',           d:'vertical dots connector, left accent border',    C: D04 },
  { n:5,  t:'Ticket',             d:'event ticket with perforation divider',          C: D05 },
  { n:6,  t:'ESPN Compact',       d:'sports-app horizontal row, side accent',         C: D06 },
  { n:7,  t:'Neon Border',        d:'glowing neon outline per outcome',               C: D07 },
  { n:8,  t:'Neumorphic',         d:'inset soft shadow buttons',                      C: D08 },
  { n:9,  t:'Holographic',        d:'rainbow gradient border & text',                 C: D09 },
  { n:10, t:'Minimal Single Row', d:'single line, no containers, ultra clean',        C: D10 },
  { n:11, t:'Progress Bar',       d:'animated bar shows % per match',                 C: D11 },
  { n:12, t:'Terminal / Code',    d:'JSON-like monospace dark code block',            C: D12 },
  { n:13, t:'Comparison Bars',    d:'vertical bar chart per match',                   C: D13 },
  { n:14, t:'Retro Vintage',      d:'dark gold border, World Cup badge feel',         C: D14 },
  { n:15, t:'Frosted Dark',       d:'near-black heavy blur glass',                    C: D15 },
  { n:16, t:'Chat Bubbles',       d:'prediction as sent msg, result as received',     C: D16 },
  { n:17, t:'LED Scoreboard',     d:'LCD green monospace, stadium display',           C: D17 },
  { n:18, t:'Flip Card',          d:'click to flip — reveals result on back',         C: D18 },
  { n:19, t:'Stacked Shadow',     d:'offset colored shadow, layered depth',           C: D19 },
  { n:20, t:'Accordion',          d:'click to expand point breakdown',                C: D20 },
  { n:21, t:'Donut Gauge',        d:'mini donut ring per match + compact row',        C: D21 },
  { n:22, t:'Material Chip',      d:'top accent bar, outcome chip badge',             C: D22 },
  { n:23, t:'Ultra Compact Grid', d:'single-line grid, 4 columns',                   C: D23 },
  { n:24, t:'Dashboard',          d:'stat summary + per-match rows',                  C: D24 },
  { n:25, t:'Story Strip',        d:'horizontal scroll cards like IG stories',        C: D25 },
];

export default function AdminMyPredictionsDemo() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold text-white">My Predictions Demo</h2>
        <p className="text-slate-400 mt-1 text-sm">25 עיצובים לכרטיסיית "הניחושים שלי" — לחץ על כל כרטיס להצגה</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DEMOS.map(({ n, t, d, C }) => (
          <Card key={n} num={n} title={t} desc={d}><C /></Card>
        ))}
      </div>
    </div>
  );
}
