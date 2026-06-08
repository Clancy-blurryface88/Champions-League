import React, { useState, useEffect, useRef, useMemo } from 'react';

const CSS = `
@keyframes wc-orbit { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes wc-orbit-rev { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
@keyframes wc-pulse-g { 0%,100%{filter:drop-shadow(0 0 3px #22c55e)} 50%{filter:drop-shadow(0 0 12px #22c55e) drop-shadow(0 0 20px #22c55e60)} }
@keyframes wc-pulse-p { 0%,100%{filter:drop-shadow(0 0 3px #818cf8)} 50%{filter:drop-shadow(0 0 12px #818cf8)} }
@keyframes wc-pulse-c { 0%,100%{filter:drop-shadow(0 0 3px #06b6d4)} 50%{filter:drop-shadow(0 0 12px #06b6d4)} }
@keyframes wc-pulse-a { 0%,100%{filter:drop-shadow(0 0 3px #f59e0b)} 50%{filter:drop-shadow(0 0 12px #f59e0b)} }
@keyframes wc-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes wc-stripe { from{background-position:0 0} to{background-position:28px 0} }
@keyframes wc-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
@keyframes wc-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes wc-radar { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes wc-hb { 0%,85%,100%{d:path("M0,20 L10,20 L13,8 L17,32 L20,14 L23,26 L26,20 L64,20")} 90%{d:path("M0,20 L10,20 L13,5 L17,35 L20,10 L23,30 L26,20 L64,20")} }
@keyframes wc-rgb { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
@keyframes wc-fire { 0%,100%{transform:scaleX(1) scaleY(1)} 33%{transform:scaleX(1.04) scaleY(.96)} 66%{transform:scaleX(.97) scaleY(1.03)} }
@keyframes wc-ripple { 0%{transform:scale(.5);opacity:1} 100%{transform:scale(2.5);opacity:0} }
@keyframes wc-flip { 0%,45%{transform:rotateX(0deg)} 55%,100%{transform:rotateX(-90deg)} }
@keyframes wc-flip2 { 0%,45%{transform:rotateX(90deg)} 55%,100%{transform:rotateX(0deg)} }
@keyframes wc-scale-in { from{transform:scale(0)} to{transform:scale(1)} }
@keyframes wc-wave-x { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes wc-glitch { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px);filter:hue-rotate(90deg)} 75%{transform:translateX(3px);filter:hue-rotate(-90deg)} }
@keyframes wc-star-pop { 0%{transform:scale(0) rotate(-30deg)} 70%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0deg)} }
@keyframes wc-count-up { from{transform:translateY(100%)} to{transform:translateY(0)} }
`;

function useAnimPct(pct, delay = 60) {
  const [v, setV] = useState(0);
  useEffect(() => {
    setV(0);
    const t = setTimeout(() => setV(pct), delay);
    return () => clearTimeout(t);
  }, [pct]);
  return v;
}

function useCountUp(target, duration = 1100) {
  const [val, setVal] = useState(0);
  const rafRef = useRef();
  useEffect(() => {
    setVal(0);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);
  return val;
}

function Card({ id, label, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 16, padding: '18px 10px 12px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 10, minHeight: 148,
    }}>
      {children}
      <div style={{ marginTop: 'auto', color: 'rgba(255,255,255,0.4)', fontSize: 10.5, textAlign: 'center', lineHeight: 1.4 }}>
        <span style={{ color: 'rgba(255,255,255,0.18)', marginRight: 2 }}>#{id}</span>{label}
      </div>
    </div>
  );
}

// ── V01 Classic Donut ──────────────────────────────────────────────────────────
function V01({ pct }) {
  const a = useAnimPct(pct), R = 26, C = 2 * Math.PI * R;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={R} fill="none" stroke="#1e293b" strokeWidth="6" />
        <circle cx="32" cy="32" r={R} fill="none" stroke="#22c55e" strokeWidth="6"
          strokeDasharray={C} strokeDashoffset={C - (a / 100) * C} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.23,1,.32,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V02 Conic Gradient ─────────────────────────────────────────────────────────
function V02({ pct }) {
  const a = useAnimPct(pct);
  return (
    <div style={{ width: 76, height: 76, borderRadius: '50%', padding: 5,
      background: `conic-gradient(#6366f1 ${a}%, #1e293b ${a}%)`,
      transition: 'background 1s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0f172a',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#818cf8' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V03 Neon Glow Ring ─────────────────────────────────────────────────────────
function V03({ pct }) {
  const a = useAnimPct(pct), R = 26, C = 2 * Math.PI * R;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
        <defs>
          <filter id="v3g"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <circle cx="32" cy="32" r={R} fill="none" stroke="#0c1824" strokeWidth="8" />
        <circle cx="32" cy="32" r={R} fill="none" stroke="#f0abfc" strokeWidth="4" filter="url(#v3g)"
          strokeDasharray={C} strokeDashoffset={C - (a / 100) * C} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', animation: 'wc-pulse-p 2s ease-in-out infinite' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#f0abfc' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V04 Double Concentric Rings ────────────────────────────────────────────────
function V04({ pct }) {
  const a = useAnimPct(pct), R1 = 26, R2 = 17, C1 = 2 * Math.PI * R1, C2 = 2 * Math.PI * R2;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={R1} fill="none" stroke="#1e293b" strokeWidth="5" />
        <circle cx="32" cy="32" r={R1} fill="none" stroke="#06b6d4" strokeWidth="5"
          strokeDasharray={C1} strokeDashoffset={C1 - (a / 100) * C1} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <circle cx="32" cy="32" r={R2} fill="none" stroke="#1e293b" strokeWidth="3" />
        <circle cx="32" cy="32" r={R2} fill="none" stroke="#f59e0b" strokeWidth="3"
          strokeDasharray={C2} strokeDashoffset={C2 - (a / 100) * C2} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease .12s' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V05 Dot Circle ─────────────────────────────────────────────────────────────
function V05({ pct }) {
  const N = 24, R = 27;
  const filled = Math.round(pct / 100 * N);
  const dots = Array.from({ length: N }, (_, i) => {
    const angle = (2 * Math.PI * i / N) - Math.PI / 2;
    return { x: 32 + R * Math.cos(angle), y: 32 + R * Math.sin(angle), on: i < filled };
  });
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 64 64">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="2.6"
            fill={d.on ? '#22c55e' : '#1e293b'}
            style={{ transition: `fill .3s ease ${i * 20}ms` }} />
        ))}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V06 Rainbow Ring ───────────────────────────────────────────────────────────
function V06({ pct }) {
  const a = useAnimPct(pct), R = 26, C = 2 * Math.PI * R;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
        <defs>
          <linearGradient id="v6r" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="20%" stopColor="#f97316" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="60%" stopColor="#22c55e" />
            <stop offset="80%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r={R} fill="none" stroke="#1e293b" strokeWidth="6" />
        <circle cx="32" cy="32" r={R} fill="none" stroke="url(#v6r)" strokeWidth="6"
          strokeDasharray={C} strokeDashoffset={C - (a / 100) * C} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', animation: 'wc-rgb 4s linear infinite' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V07 Comet Tail ─────────────────────────────────────────────────────────────
function V07({ pct }) {
  const a = useAnimPct(pct), R = 26, C = 2 * Math.PI * R;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
        <defs>
          <linearGradient id="v7g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r={R} fill="none" stroke="#0f172a" strokeWidth="6" />
        <circle cx="32" cy="32" r={R} fill="none" stroke="#06b6d4" strokeWidth="6" opacity="0.15"
          strokeDasharray={C} strokeDashoffset={0} />
        <circle cx="32" cy="32" r={R} fill="none" stroke="url(#v7g)" strokeWidth="6"
          strokeDasharray={`${(a / 100) * C} ${C}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease', animation: 'wc-pulse-c 3s ease-in-out infinite' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#06b6d4' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V08 Thick Bold Ring ────────────────────────────────────────────────────────
function V08({ pct }) {
  const a = useAnimPct(pct), R = 22, C = 2 * Math.PI * R;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={R} fill="none" stroke="#1e293b" strokeWidth="14" />
        <circle cx="32" cy="32" r={R} fill="none" stroke="#f97316" strokeWidth="14"
          strokeDasharray={C} strokeDashoffset={C - (a / 100) * C} strokeLinecap="butt"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#f97316' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V09 Semicircle Gauge ───────────────────────────────────────────────────────
function V09({ pct }) {
  const a = useAnimPct(pct), R = 26, C = Math.PI * R;
  return (
    <div style={{ position: 'relative', width: 76, height: 44 }}>
      <svg style={{ width: '100%', height: '88px' }} viewBox="0 0 64 36">
        <circle cx="32" cy="32" r={R} fill="none" stroke="#1e293b" strokeWidth="6"
          strokeDasharray={`${Math.PI * R} ${Math.PI * R}`} strokeDashoffset={0}
          style={{ transform: 'rotate(180deg)', transformOrigin: '32px 32px' }} />
        <circle cx="32" cy="32" r={R} fill="none" stroke="#22c55e" strokeWidth="6"
          strokeDasharray={`${(a / 100) * C} ${C * 2}`} strokeLinecap="round"
          style={{ transform: 'rotate(180deg)', transformOrigin: '32px 32px', transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', bottom: -4, width: '100%', textAlign: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#22c55e' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V10 Inner Pie Fill ─────────────────────────────────────────────────────────
function V10({ pct }) {
  const a = useAnimPct(pct);
  const angle = (a / 100) * 360;
  const rad = (angle - 90) * Math.PI / 180;
  const x = 32 + 26 * Math.cos(rad), y = 32 + 26 * Math.sin(rad);
  const large = angle > 180 ? 1 : 0;
  const d = angle >= 360
    ? 'M32,6 A26,26 0 1 1 31.999,6Z'
    : `M32,6 A26,26 0 ${large},1 ${x},${y} L32,32 Z`;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#1e293b" />
        <path d={d} fill="#3b82f6" style={{ transition: 'd 0.8s ease' }} />
        <circle cx="32" cy="32" r="14" fill="#0f172a" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V11 Horizontal Shimmer Bar ─────────────────────────────────────────────────
function V11({ pct }) {
  const a = useAnimPct(pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 12 }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>{pct}%</span>
      <div style={{ width: 70, height: 10, borderRadius: 5, background: '#1e293b', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${a}%`, borderRadius: 5,
          background: 'linear-gradient(90deg, #16a34a, #22c55e, #86efac, #22c55e)',
          backgroundSize: '200% 100%', animation: 'wc-shimmer 1.5s linear infinite',
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

// ── V12 Vertical Fill Bar ──────────────────────────────────────────────────────
function V12({ pct }) {
  const a = useAnimPct(pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 4 }}>
      <div style={{ width: 32, height: 60, borderRadius: 8, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{
          height: `${a}%`, background: 'linear-gradient(0deg, #7c3aed, #a78bfa)',
          borderRadius: '6px 6px 0 0', transition: 'height 1s ease',
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa' }}>{pct}%</span>
    </div>
  );
}

// ── V13 Liquid Wave ────────────────────────────────────────────────────────────
function V13({ pct }) {
  const a = useAnimPct(pct);
  const fillY = 64 - (a / 100) * 64;
  return (
    <div style={{ position: 'relative', width: 70, height: 70 }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 64 64">
        <clipPath id="v13c"><circle cx="32" cy="32" r="28" /></clipPath>
        <circle cx="32" cy="32" r="28" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
        <g clipPath="url(#v13c)">
          <rect x="-10" y={fillY} width="84" height={64 - fillY + 10} fill="#0ea5e9" opacity="0.3" />
          <g style={{ animation: 'wc-wave-x 2s linear infinite' }}>
            <path d={`M-32,${fillY} Q-24,${fillY - 6} -16,${fillY} Q-8,${fillY + 6} 0,${fillY} Q8,${fillY - 6} 16,${fillY} Q24,${fillY + 6} 32,${fillY} Q40,${fillY - 6} 48,${fillY} Q56,${fillY + 6} 64,${fillY} Q72,${fillY - 6} 80,${fillY} Q88,${fillY + 6} 96,${fillY} L96,80 L-32,80 Z`}
              fill="#0ea5e9" style={{ transition: 'd 1s ease' }} />
          </g>
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V14 Block Segments ─────────────────────────────────────────────────────────
function V14({ pct }) {
  const N = 10;
  const filled = Math.round(pct / 100 * N);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 10 }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{pct}%</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: N }, (_, i) => (
          <div key={i} style={{
            width: 5, height: 20, borderRadius: 3,
            background: i < filled ? '#f59e0b' : '#1e293b',
            transition: `background .2s ease ${i * 40}ms`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── V15 Dot Grid ───────────────────────────────────────────────────────────────
function V15({ pct }) {
  const COLS = 8, ROWS = 5, N = COLS * ROWS;
  const filled = Math.round(pct / 100 * N);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 4, padding: '4px 2px' }}>
      {Array.from({ length: N }, (_, i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: i < filled ? '#06b6d4' : '#1e293b',
          transition: `background .15s ease ${i * 15}ms`,
        }} />
      ))}
    </div>
  );
}

// ── V16 Staircase Steps ────────────────────────────────────────────────────────
function V16({ pct }) {
  const N = 7;
  const filled = Math.round(pct / 100 * N);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, paddingTop: 6 }}>
      {Array.from({ length: N }, (_, i) => (
        <div key={i} style={{
          width: 8, height: 10 + i * 6, borderRadius: '3px 3px 0 0',
          background: i < filled ? `hsl(${130 + i * 10}, 75%, ${45 + i * 3}%)` : '#1e293b',
          transition: `background .2s ease ${i * 50}ms`,
        }} />
      ))}
    </div>
  );
}

// ── V17 Animated Stripes Bar ───────────────────────────────────────────────────
function V17({ pct }) {
  const a = useAnimPct(pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 12 }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>{pct}%</span>
      <div style={{ width: 70, height: 14, borderRadius: 7, background: '#1e293b', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${a}%`, borderRadius: 7, transition: 'width 1s ease',
          background: 'repeating-linear-gradient(45deg, #f97316 0px, #f97316 8px, #ea580c 8px, #ea580c 16px)',
          backgroundSize: '28px 100%', animation: 'wc-stripe 0.6s linear infinite',
        }} />
      </div>
    </div>
  );
}

// ── V18 Split Bar ──────────────────────────────────────────────────────────────
function V18({ pct }) {
  const a = useAnimPct(pct);
  const half = a / 2;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 12 }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: '#e879f9' }}>{pct}%</span>
      <div style={{ width: 70, height: 10, borderRadius: 5, background: '#1e293b', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', right: '50%', top: 0, bottom: 0, width: `${half}%`,
          background: 'linear-gradient(90deg, #c026d3, #e879f9)',
          transition: 'width 1s ease', borderRadius: '5px 0 0 5px',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0, width: `${half}%`,
          background: 'linear-gradient(90deg, #e879f9, #c026d3)',
          transition: 'width 1s ease', borderRadius: '0 5px 5px 0',
        }} />
      </div>
    </div>
  );
}

// ── V19 Pill 3D Bar ────────────────────────────────────────────────────────────
function V19({ pct }) {
  const a = useAnimPct(pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 12 }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: '#34d399' }}>{pct}%</span>
      <div style={{ width: 70, height: 18, borderRadius: 9, background: '#0f2318', border: '1px solid #166534', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          height: '100%', width: `${a}%`, transition: 'width 1s ease',
          background: 'linear-gradient(180deg, #34d399 0%, #059669 50%, #047857 100%)',
          borderRadius: 9, position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 4, right: 4, height: '40%', background: 'rgba(255,255,255,0.2)', borderRadius: '0 0 50% 50%' }} />
        </div>
      </div>
    </div>
  );
}

// ── V20 Gradient Ring Thin ─────────────────────────────────────────────────────
function V20({ pct }) {
  const a = useAnimPct(pct), R = 26, C = 2 * Math.PI * R;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
        <defs>
          <linearGradient id="v20g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r={R} fill="none" stroke="#1e293b" strokeWidth="2" />
        <circle cx="32" cy="32" r={R} fill="none" stroke="url(#v20g)" strokeWidth="2"
          strokeDasharray={C} strokeDashoffset={C - (a / 100) * C} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', animation: 'wc-pulse-a 2s ease-in-out infinite' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#fb923c' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V21 Count-Up Number ────────────────────────────────────────────────────────
function V21({ pct }) {
  const val = useCountUp(pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 8 }}>
      <div style={{ fontSize: 36, fontWeight: 900, color: '#22c55e', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {val}
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>%</div>
    </div>
  );
}

// ── V22 Flip Card ──────────────────────────────────────────────────────────────
function V22({ pct }) {
  const [display, setDisplay] = useState(0);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    setFlip(true);
    const t = setTimeout(() => { setDisplay(pct); setFlip(false); }, 300);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ paddingTop: 10, perspective: 200 }}>
      <div style={{
        width: 64, height: 52, background: '#1e3a5f', borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #2563eb',
        transform: flip ? 'rotateX(-90deg)' : 'rotateX(0deg)',
        transition: 'transform 0.3s ease',
      }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: '#60a5fa', fontVariantNumeric: 'tabular-nums' }}>{display}%</span>
      </div>
    </div>
  );
}

// ── V23 Slot Machine ───────────────────────────────────────────────────────────
function V23({ pct }) {
  const val = useCountUp(pct, 900);
  const digits = String(val).padStart(3, '0').split('');
  return (
    <div style={{ display: 'flex', gap: 3, paddingTop: 10 }}>
      {digits.map((d, i) => (
        <div key={i} style={{
          width: 22, height: 36, background: '#0f172a', border: '1px solid #334155',
          borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>{d}</span>
        </div>
      ))}
    </div>
  );
}

// ── V24 Typewriter ─────────────────────────────────────────────────────────────
function V24({ pct }) {
  const [text, setText] = useState('');
  useEffect(() => {
    const full = `${pct}%`;
    setText('');
    let i = 0;
    const iv = setInterval(() => {
      if (i < full.length) { setText(full.slice(0, ++i)); } else clearInterval(iv);
    }, 120);
    return () => clearInterval(iv);
  }, [pct]);
  return (
    <div style={{ paddingTop: 14, display: 'flex', alignItems: 'center', gap: 2 }}>
      <span style={{ fontSize: 28, fontWeight: 900, color: '#a3e635', fontFamily: 'monospace', minWidth: 70, textAlign: 'center' }}>
        {text}
      </span>
      <span style={{ fontSize: 28, color: '#a3e635', animation: 'wc-blink 0.8s step-end infinite' }}>|</span>
    </div>
  );
}

// ── V25 Huge Minimal Number ────────────────────────────────────────────────────
function V25({ pct }) {
  const val = useCountUp(pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
      <span style={{ fontSize: 42, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: -2 }}>{val}</span>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 2 }}>percent</span>
    </div>
  );
}

// ── V26 Fraction X/100 ─────────────────────────────────────────────────────────
function V26({ pct }) {
  const val = useCountUp(pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span style={{ fontSize: 30, fontWeight: 900, color: '#06b6d4' }}>{val}</span>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>/100</span>
      </div>
      <div style={{ width: 60, height: 2, background: '#1e293b', borderRadius: 1, marginTop: 6 }}>
        <div style={{ height: '100%', width: `${val}%`, background: '#06b6d4', transition: 'width .1s', borderRadius: 1 }} />
      </div>
    </div>
  );
}

// ── V27 Neon Text Glow ─────────────────────────────────────────────────────────
function V27({ pct }) {
  const val = useCountUp(pct);
  return (
    <div style={{ paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{
        fontSize: 34, fontWeight: 900, color: '#f0abfc',
        textShadow: '0 0 10px #d946ef, 0 0 20px #d946ef, 0 0 40px #d946ef',
        animation: 'wc-pulse-p 2s ease-in-out infinite',
        fontVariantNumeric: 'tabular-nums',
      }}>{val}%</span>
    </div>
  );
}

// ── V28 Terminal Style ─────────────────────────────────────────────────────────
function V28({ pct }) {
  const val = useCountUp(pct);
  return (
    <div style={{ paddingTop: 8, background: '#000', borderRadius: 8, padding: '10px 14px', border: '1px solid #22c55e', width: 72 }}>
      <div style={{ fontSize: 9, color: '#22c55e', fontFamily: 'monospace', marginBottom: 4 }}>$ score</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#22c55e', fontFamily: 'monospace' }}>{val}%</span>
        <span style={{ fontSize: 14, color: '#22c55e', animation: 'wc-blink 0.7s step-end infinite' }}>█</span>
      </div>
    </div>
  );
}

// ── V29 Delta / Score Style ────────────────────────────────────────────────────
function V29({ pct }) {
  const val = useCountUp(pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 4 }}>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>SCORE RATE</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 11, color: '#4ade80' }}>▲</span>
        <span style={{ fontSize: 28, fontWeight: 900, color: '#4ade80' }}>+{val}%</span>
      </div>
    </div>
  );
}

// ── V30 Odometer ───────────────────────────────────────────────────────────────
function V30({ pct }) {
  const val = useCountUp(pct, 1500);
  const s = String(val).padStart(3, '0');
  return (
    <div style={{ display: 'flex', gap: 1, paddingTop: 10, background: '#0a0a0a', borderRadius: 8, padding: 8, border: '1px solid #333' }}>
      {s.split('').map((d, i) => (
        <div key={i} style={{
          width: 20, height: 32, background: 'linear-gradient(180deg, #111 0%, #222 40%, #111 100%)',
          border: '1px solid #333', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,.8)',
        }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#f97316', fontFamily: 'monospace' }}>{d}</span>
        </div>
      ))}
      <div style={{ width: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 9, color: '#f97316', fontFamily: 'monospace' }}>%</span>
      </div>
    </div>
  );
}

// ── V31 Battery ────────────────────────────────────────────────────────────────
function V31({ pct }) {
  const a = useAnimPct(pct);
  const color = a >= 60 ? '#22c55e' : a >= 30 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 8 }}>
      <div style={{ position: 'relative', width: 50, height: 26, border: `2px solid ${color}`, borderRadius: 5 }}>
        <div style={{ position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)', width: 4, height: 10, background: color, borderRadius: '0 2px 2px 0' }} />
        <div style={{
          height: '100%', width: `${a}%`, background: color, borderRadius: 2,
          transition: 'width 1s ease, background .5s',
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{pct}%</span>
    </div>
  );
}

// ── V32 Speedometer Arc ────────────────────────────────────────────────────────
function V32({ pct }) {
  const a = useAnimPct(pct);
  const R = 24, startAngle = -210, sweepAngle = 240;
  const toRad = (d) => d * Math.PI / 180;
  const C = (sweepAngle / 360) * 2 * Math.PI * R;
  const needle = startAngle + (a / 100) * sweepAngle;
  const nx = 32 + R * Math.cos(toRad(needle));
  const ny = 32 + R * Math.sin(toRad(needle));
  return (
    <div style={{ position: 'relative', width: 76, height: 56 }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 64 50">
        <circle cx="32" cy="36" r={R} fill="none" stroke="#1e293b" strokeWidth="6"
          strokeDasharray={`${C} ${2 * Math.PI * R}`}
          style={{ transform: 'rotate(-210deg)', transformOrigin: '32px 36px' }} />
        <circle cx="32" cy="36" r={R} fill="none" stroke="#f59e0b" strokeWidth="6"
          strokeDasharray={`${(a / 100) * C} ${2 * Math.PI * R}`}
          strokeLinecap="round"
          style={{ transform: 'rotate(-210deg)', transformOrigin: '32px 36px', transition: 'stroke-dasharray 1s ease' }} />
        <line x1="32" y1="36" x2={32 + (R - 6) * Math.cos(toRad(needle))} y2={36 + (R - 6) * Math.sin(toRad(needle))}
          stroke="#fff" strokeWidth="1.5" strokeLinecap="round"
          style={{ transition: 'all 1s ease' }} />
        <circle cx="32" cy="36" r="2.5" fill="#f59e0b" />
      </svg>
      <div style={{ position: 'absolute', bottom: 2, width: '100%', textAlign: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V33 Heartbeat EKG ──────────────────────────────────────────────────────────
function V33({ pct }) {
  const a = useAnimPct(pct);
  const h = 20 + (a / 100) * 16;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 6 }}>
      <svg style={{ width: 76, height: 40 }} viewBox="0 0 76 40">
        <polyline
          points={`0,20 12,20 16,${40 - h} 20,${h < 28 ? 40 : 5} 24,20 30,20 34,${30 - (a / 100) * 12} 38,${12 + (a / 100) * 10} 42,20 76,20`}
          fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'points 0.6s ease', filter: 'drop-shadow(0 0 3px #ef4444)' }} />
      </svg>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>{pct}%</span>
    </div>
  );
}

// ── V34 Star Fill ──────────────────────────────────────────────────────────────
function V34({ pct }) {
  const filled = pct / 20;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 8 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.min(1, Math.max(0, filled - i));
          return (
            <div key={i} style={{ position: 'relative', width: 14, height: 14 }}>
              <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
                <defs><clipPath id={`sc${i}`}><rect x="0" y="0" width={`${fill * 100}%`} height="100%" /></clipPath></defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="#334155" />
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="#fbbf24" clipPath={`url(#sc${i})`} />
              </svg>
            </div>
          );
        })}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24' }}>{pct}%</span>
    </div>
  );
}

// ── V35 Football Grid ──────────────────────────────────────────────────────────
function V35({ pct }) {
  const N = 20;
  const filled = Math.round(pct / 100 * N);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 3 }}>
        {Array.from({ length: N }, (_, i) => (
          <div key={i} style={{
            fontSize: 12, opacity: i < filled ? 1 : 0.15,
            transition: `opacity .2s ease ${i * 30}ms`, filter: i < filled ? 'none' : 'grayscale(1)',
          }}>⚽</div>
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>{pct}%</span>
    </div>
  );
}

// ── V36 Trophy Glow ────────────────────────────────────────────────────────────
function V36({ pct }) {
  const a = useAnimPct(pct);
  const opacity = a / 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 6 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 40, filter: `drop-shadow(0 0 ${8 + a / 5}px rgba(251,191,36,${opacity}))` }}>🏆</div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>{pct}%</span>
    </div>
  );
}

// ── V37 Hex Grid ───────────────────────────────────────────────────────────────
function V37({ pct }) {
  const hexes = [
    { x: 32, y: 20 }, { x: 20, y: 27 }, { x: 44, y: 27 },
    { x: 14, y: 40 }, { x: 32, y: 40 }, { x: 50, y: 40 },
    { x: 20, y: 53 }, { x: 44, y: 53 }, { x: 32, y: 60 },
  ];
  const filled = Math.round(pct / 100 * hexes.length);
  const hex = (cx, cy, r) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (i * 60 - 30) * Math.PI / 180;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
    return pts;
  };
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 64 80">
        {hexes.map((h, i) => (
          <polygon key={i} points={hex(h.x, h.y, 9)}
            fill={i < filled ? '#818cf8' : '#1e293b'}
            stroke="#0f172a" strokeWidth="1.5"
            style={{ transition: `fill .3s ease ${i * 50}ms` }} />
        ))}
      </svg>
      <div style={{ position: 'absolute', top: '50%', width: '100%', textAlign: 'center', transform: 'translateY(-50%)' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#818cf8' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V38 Fire Bars ──────────────────────────────────────────────────────────────
function V38({ pct }) {
  const bars = 9;
  const filled = Math.round(pct / 100 * bars);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 4 }}>
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 50 }}>
        {Array.from({ length: bars }, (_, i) => {
          const h = 8 + i * 5;
          const on = i < filled;
          return (
            <div key={i} style={{
              width: 7, height: h, borderRadius: '3px 3px 0 0',
              background: on ? `hsl(${30 - i * 2}, 95%, ${55 + i * 2}%)` : '#1e293b',
              boxShadow: on ? `0 0 6px hsl(${30 - i * 2}, 95%, 55%)` : 'none',
              transition: `background .2s ease ${i * 30}ms, box-shadow .2s`,
              animation: on ? 'wc-fire 0.5s ease-in-out infinite' : 'none',
            }} />
          );
        })}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#fb923c' }}>{pct}%</span>
    </div>
  );
}

// ── V39 Radar Sweep ────────────────────────────────────────────────────────────
function V39({ pct }) {
  const a = useAnimPct(pct), R = 26;
  const rings = [8, 16, 24];
  const dots = Array.from({ length: 12 }, (_, i) => ({
    angle: (2 * Math.PI * i / 12) - Math.PI / 2,
    r: 8 + Math.random() * 16,
    active: (i / 12) * 100 <= pct,
  }));
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 64 64">
        {rings.map(r => (
          <circle key={r} cx="32" cy="32" r={r} fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="0.5" />
        ))}
        <line x1="8" y1="32" x2="56" y2="32" stroke="rgba(34,197,94,0.1)" strokeWidth="0.5" />
        <line x1="32" y1="8" x2="32" y2="56" stroke="rgba(34,197,94,0.1)" strokeWidth="0.5" />
        <defs>
          <radialGradient id="v39g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={`M32,32 L32,6 A26,26 0 0,1 ${32 + R * Math.sin(Math.PI / 3)},${32 - R * Math.cos(Math.PI / 3)} Z`}
          fill="url(#v39g)" style={{ transformOrigin: '32px 32px', animation: 'wc-radar 3s linear infinite' }} />
        {dots.map((d, i) => (
          <circle key={i} cx={32 + d.r * Math.cos(d.angle)} cy={32 + d.r * Math.sin(d.angle)} r="1.5"
            fill={d.active ? '#22c55e' : 'transparent'}
            style={{ filter: d.active ? 'drop-shadow(0 0 2px #22c55e)' : 'none' }} />
        ))}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', opacity: 0.8 }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V40 DNA Helix ──────────────────────────────────────────────────────────────
function V40({ pct }) {
  const N = 8;
  const filled = Math.round(pct / 100 * N);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 4 }}>
      <svg style={{ width: 50, height: 60 }} viewBox="0 0 50 60">
        {Array.from({ length: N }, (_, i) => {
          const y = 6 + i * 7;
          const wave = Math.sin(i * Math.PI / 2) * 14;
          const on = i < filled;
          return (
            <g key={i}>
              <circle cx={25 + wave} cy={y} r="3" fill={on ? '#06b6d4' : '#1e293b'}
                style={{ transition: `fill .2s ease ${i * 60}ms` }} />
              <circle cx={25 - wave} cy={y} r="3" fill={on ? '#818cf8' : '#1e293b'}
                style={{ transition: `fill .2s ease ${i * 60}ms` }} />
              <line x1={25 + wave} y1={y} x2={25 - wave} y2={y}
                stroke={on ? 'rgba(255,255,255,0.2)' : '#1e293b'} strokeWidth="1"
                style={{ transition: `stroke .2s ease ${i * 60}ms` }} />
            </g>
          );
        })}
      </svg>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#06b6d4' }}>{pct}%</span>
    </div>
  );
}

// ── V41 Orbiting Dots ──────────────────────────────────────────────────────────
function V41({ pct }) {
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="12" fill="#1e293b" />
        <circle cx="32" cy="32" r="24" fill="none" stroke="#1e293b" strokeWidth="1" />
        <g style={{ transformOrigin: '32px 32px', animation: 'wc-orbit 2s linear infinite' }}>
          <circle cx="56" cy="32" r="4" fill="#22c55e" style={{ filter: 'drop-shadow(0 0 4px #22c55e)' }} />
        </g>
        <g style={{ transformOrigin: '32px 32px', animation: 'wc-orbit 3s linear infinite reverse' }}>
          <circle cx="32" cy="8" r="3" fill="#818cf8" style={{ filter: 'drop-shadow(0 0 3px #818cf8)' }} />
        </g>
        <g style={{ transformOrigin: '32px 32px', animation: 'wc-orbit 1.5s linear infinite' }}>
          <circle cx="8" cy="32" r="2.5" fill="#f59e0b" style={{ filter: 'drop-shadow(0 0 3px #f59e0b)' }} />
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V42 Ripple Rings ───────────────────────────────────────────────────────────
function V42({ pct }) {
  const a = useAnimPct(pct);
  const color = `rgba(6,182,212,${0.3 + (a / 100) * 0.7})`;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 64 64">
        {[1, 0.6, 0.35].map((op, i) => (
          <circle key={i} cx="32" cy="32" r="20" fill="none" stroke="#06b6d4"
            strokeWidth="1" opacity={op}
            style={{ transformOrigin: '32px 32px', animation: `wc-ripple ${1.5 + i * 0.7}s ease-out infinite`, animationDelay: `${i * 0.5}s` }} />
        ))}
        <circle cx="32" cy="32" r="10" fill={color} style={{ transition: 'fill 1s' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#06b6d4' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V43 Pixel Scatter ──────────────────────────────────────────────────────────
function V43({ pct }) {
  const a = useAnimPct(pct);
  const GRID = 6;
  const filled = Math.round((a / 100) * GRID * GRID);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 4 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID}, 1fr)`, gap: 2 }}>
        {Array.from({ length: GRID * GRID }, (_, i) => (
          <div key={i} style={{
            width: 9, height: 9, borderRadius: 2,
            background: i < filled ? '#a855f7' : '#1e293b',
            transition: `background .15s ease ${i * 12}ms`,
            boxShadow: i < filled ? '0 0 4px #a855f7' : 'none',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#a855f7' }}>{pct}%</span>
    </div>
  );
}

// ── V44 Lightning Energy ───────────────────────────────────────────────────────
function V44({ pct }) {
  const a = useAnimPct(pct);
  const bars = 7;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 4 }}>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 52 }}>
        {Array.from({ length: bars }, (_, i) => {
          const threshold = (i / bars) * 100;
          const on = a > threshold;
          const h = 16 + Math.sin((i / (bars - 1)) * Math.PI) * 28;
          return (
            <div key={i} style={{
              width: 8, height: h, borderRadius: 4,
              background: on ? 'linear-gradient(0deg, #ef4444, #f97316, #fbbf24)' : '#1e293b',
              transition: `background .3s ease`, boxShadow: on ? '0 0 8px #f97316' : 'none',
            }} />
          );
        })}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24' }}>{pct}%</span>
    </div>
  );
}

// ── V45 Holographic Shimmer ────────────────────────────────────────────────────
function V45({ pct }) {
  const val = useCountUp(pct);
  return (
    <div style={{ paddingTop: 10 }}>
      <span style={{
        fontSize: 36, fontWeight: 900,
        background: 'linear-gradient(90deg, #f43f5e, #f97316, #eab308, #22c55e, #06b6d4, #818cf8, #f43f5e)',
        backgroundSize: '400% 100%',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        animation: 'wc-shimmer 2.5s linear infinite',
      }}>{val}%</span>
    </div>
  );
}

// ── V46 Matrix Rain ────────────────────────────────────────────────────────────
function V46({ pct }) {
  const val = useCountUp(pct);
  const chars = '01アイウエオカキクケコ'.split('');
  return (
    <div style={{ position: 'relative', width: 76, height: 76, overflow: 'hidden', borderRadius: 8, background: '#000' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute', left: i * 15 + 3, top: 0, width: 12, fontSize: 9, color: '#22c55e',
          fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 1,
          animation: `wc-orbit ${1.5 + i * 0.3}s linear infinite`,
          animationTimingFunction: 'linear', opacity: 0.6,
        }}>
          {Array.from({ length: 10 }, (_, j) => (
            <span key={j}>{chars[Math.floor(Math.random() * chars.length)]}</span>
          ))}
        </div>
      ))}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse, rgba(0,0,0,.8) 50%, transparent 100%)' }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: '#22c55e', fontFamily: 'monospace',
          textShadow: '0 0 10px #22c55e' }}>{val}%</span>
      </div>
    </div>
  );
}

// ── V47 Fireworks ──────────────────────────────────────────────────────────────
function V47({ pct }) {
  const a = useAnimPct(pct);
  const particles = useMemo(() => Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 2 * Math.PI;
    const dist = 20 + Math.random() * 10;
    return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, color: ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#818cf8'][i % 5] };
  }), [pct]);
  const active = a > 90;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: '#fbbf24' }}>{pct}%</span>
      </div>
      {active && particles.map((p, i) => (
        <div key={`${pct}-${i}`} style={{
          position: 'absolute', top: '50%', left: '50%', width: 4, height: 4, borderRadius: '50%',
          background: p.color, '--fx': `${p.dx}px`, '--fy': `${p.dy}px`,
          animation: 'wc-firework 1s ease-out forwards',
          animationDelay: `${i * 30}ms`,
        }} />
      ))}
    </div>
  );
}

// ── V48 Crystal/Polygon ────────────────────────────────────────────────────────
function V48({ pct }) {
  const a = useAnimPct(pct);
  const N = 6, R = 26;
  const pts = Array.from({ length: N }, (_, i) => {
    const angle = (2 * Math.PI * i / N) - Math.PI / 2;
    const r = R * (a / 100);
    return `${32 + r * Math.cos(angle)},${32 + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 64 64">
        <defs>
          <linearGradient id="v48g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <polygon points={Array.from({ length: N }, (_, i) => {
          const angle = (2 * Math.PI * i / N) - Math.PI / 2;
          return `${32 + R * Math.cos(angle)},${32 + R * Math.sin(angle)}`;
        }).join(' ')} fill="none" stroke="#1e293b" strokeWidth="1" />
        <polygon points={pts} fill="url(#v48g)" stroke="#818cf8" strokeWidth="1.5"
          style={{ transition: 'points 1s ease', filter: 'drop-shadow(0 0 6px #818cf8)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd' }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── V49 Gradient Glow Blob ─────────────────────────────────────────────────────
function V49({ pct }) {
  const a = useAnimPct(pct);
  const size = 40 + (a / 100) * 28;
  return (
    <div style={{ width: 76, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'radial-gradient(circle, #f43f5e, #a855f7, #06b6d4)',
        filter: 'blur(6px)', opacity: 0.6, transition: 'width 1s ease, height 1s ease',
        position: 'absolute',
      }} />
      <span style={{ position: 'relative', fontSize: 16, fontWeight: 900, color: '#fff' }}>{pct}%</span>
    </div>
  );
}

// ── V50 Sport Dashboard ────────────────────────────────────────────────────────
function V50({ pct }) {
  const a = useAnimPct(pct), R = 24, C = 2 * Math.PI * R;
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
        <defs>
          <linearGradient id="v50g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <filter id="v50f">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx="32" cy="32" r={R} fill="none" stroke="#0f172a" strokeWidth="10" />
        <circle cx="32" cy="32" r={R} fill="none" stroke="#1e293b" strokeWidth="6" />
        <circle cx="32" cy="32" r={R} fill="none" stroke="url(#v50g)" strokeWidth="6"
          filter="url(#v50f)"
          strokeDasharray={C} strokeDashoffset={C - (a / 100) * C} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.23,1,.32,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{pct}%</span>
        <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>SCORE</span>
      </div>
    </div>
  );
}

// ─── Main Demo Component ───────────────────────────────────────────────────────

const VARIANTS = [
  { id: 1, label: 'Classic Donut', C: V01 },
  { id: 2, label: 'Conic Gradient', C: V02 },
  { id: 3, label: 'Neon Glow Ring', C: V03 },
  { id: 4, label: 'Double Rings', C: V04 },
  { id: 5, label: 'Dot Circle', C: V05 },
  { id: 6, label: 'Rainbow Ring', C: V06 },
  { id: 7, label: 'Comet Trail', C: V07 },
  { id: 8, label: 'Thick Bold Ring', C: V08 },
  { id: 9, label: 'Semicircle Gauge', C: V09 },
  { id: 10, label: 'Inner Pie Fill', C: V10 },
  { id: 11, label: 'Shimmer Bar', C: V11 },
  { id: 12, label: 'Vertical Bar', C: V12 },
  { id: 13, label: 'Liquid Wave', C: V13 },
  { id: 14, label: 'Block Segments', C: V14 },
  { id: 15, label: 'Dot Grid', C: V15 },
  { id: 16, label: 'Staircase Steps', C: V16 },
  { id: 17, label: 'Striped Bar', C: V17 },
  { id: 18, label: 'Split Mirror Bar', C: V18 },
  { id: 19, label: 'Pill 3D Bar', C: V19 },
  { id: 20, label: 'Thin Gradient Ring', C: V20 },
  { id: 21, label: 'Count-Up Number', C: V21 },
  { id: 22, label: 'Flip Card', C: V22 },
  { id: 23, label: 'Slot Machine', C: V23 },
  { id: 24, label: 'Typewriter', C: V24 },
  { id: 25, label: 'Huge Number', C: V25 },
  { id: 26, label: 'Fraction X/100', C: V26 },
  { id: 27, label: 'Neon Glow Text', C: V27 },
  { id: 28, label: 'Terminal Style', C: V28 },
  { id: 29, label: 'Delta Score', C: V29 },
  { id: 30, label: 'Odometer', C: V30 },
  { id: 31, label: 'Battery Level', C: V31 },
  { id: 32, label: 'Speedometer Arc', C: V32 },
  { id: 33, label: 'Heartbeat EKG', C: V33 },
  { id: 34, label: 'Star Fill', C: V34 },
  { id: 35, label: 'Football Grid', C: V35 },
  { id: 36, label: 'Trophy Glow', C: V36 },
  { id: 37, label: 'Hex Grid', C: V37 },
  { id: 38, label: 'Fire Bars', C: V38 },
  { id: 39, label: 'Radar Sweep', C: V39 },
  { id: 40, label: 'DNA Helix', C: V40 },
  { id: 41, label: 'Orbiting Dots', C: V41 },
  { id: 42, label: 'Ripple Rings', C: V42 },
  { id: 43, label: 'Pixel Scatter', C: V43 },
  { id: 44, label: 'Lightning Energy', C: V44 },
  { id: 45, label: 'Holographic', C: V45 },
  { id: 46, label: 'Matrix Rain', C: V46 },
  { id: 47, label: 'Fireworks Burst', C: V47 },
  { id: 48, label: 'Crystal Polygon', C: V48 },
  { id: 49, label: 'Gradient Blob', C: V49 },
  { id: 50, label: 'Sport Dashboard', C: V50 },
];

export default function AdminPercentageDemos() {
  const [pct, setPct] = useState(75);

  return (
    <div style={{ padding: '24px 16px', maxWidth: 1200, margin: '0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
          % Display Demos
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
          50 אפשרויות להצגת אחוזים — הזז את הסליידר כדי לראות את האנימציות
        </p>

        {/* Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 400 }}>
          <input
            type="range" min="0" max="100" value={pct}
            onChange={e => setPct(+e.target.value)}
            style={{ flex: 1, accentColor: '#22c55e', cursor: 'pointer' }}
          />
          <div style={{
            minWidth: 60, textAlign: 'center', fontSize: 20, fontWeight: 900, color: '#22c55e',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 8, padding: '4px 8px',
          }}>
            {pct}%
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 10,
      }}>
        {VARIANTS.map(({ id, label, C: Comp }) => (
          <Card key={id} id={id} label={label}>
            <Comp pct={pct} />
          </Card>
        ))}
      </div>
    </div>
  );
}
