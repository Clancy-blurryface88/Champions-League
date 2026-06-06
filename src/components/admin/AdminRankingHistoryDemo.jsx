import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLAYERS = [
  { id: 1, name: 'שחקן 1',  rounds: [3, 2, 1] },
  { id: 2, name: 'שחקן 2',  rounds: [1, 1, 2], isCurrentUser: true },
  { id: 3, name: 'שחקן 3',  rounds: [4, 5, 3] },
  { id: 4, name: 'שחקן 4',  rounds: [2, 3, 4] },
  { id: 5, name: 'שחקן 5',  rounds: [5, 4, 5] },
  { id: 6, name: 'Player 6', rounds: [6, 6, 6] },
];
const ROUNDS = ['מחזור 1', 'מחזור 2', 'מחזור 3'];
const N = PLAYERS.length;

const rc = (r) => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : 'rgba(255,255,255,0.45)';
const rbg = (r) =>
  r === 1 ? 'linear-gradient(135deg,rgba(250,204,21,0.28),rgba(245,158,11,0.28))' :
  r === 2 ? 'linear-gradient(135deg,rgba(209,213,219,0.22),rgba(156,163,175,0.22))' :
  r === 3 ? 'linear-gradient(135deg,rgba(205,127,50,0.22),rgba(180,100,30,0.22))' :
  'rgba(30,41,59,0.55)';
const heatColor = (r) => {
  const t = (r - 1) / (N - 1);
  const g = Math.round(180 - t * 140);
  const red = Math.round(30 + t * 200);
  return `rgba(${red},${g},60,0.35)`;
};

// ── 1. Classic Circles (current) ─────────────────────────────────────────────
const Design1 = () => (
  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
    <thead>
      <tr>
        <th style={{ textAlign: 'right', padding: '6px 10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>משתתף</th>
        {ROUNDS.map(r => <th key={r} style={{ padding: '6px 10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{r}</th>)}
      </tr>
    </thead>
    <tbody>
      {PLAYERS.map((p, i) => (
        <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: p.isCurrentUser ? 'rgba(59,130,246,0.07)' : 'transparent' }}>
          <td style={{ padding: '8px 10px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, width: 14 }}>{i + 1}</span>
            {p.isCurrentUser && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />}
            {p.name}
          </td>
          {p.rounds.map((r, ri) => (
            <td key={ri} style={{ padding: '8px 10px', textAlign: 'center' }}>
              {r ? <div style={{ width: 30, height: 30, borderRadius: '50%', background: rbg(r), border: `1px solid ${rc(r)}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto', color: rc(r), fontWeight: 700, fontSize: 13 }}>{r}</div> : <span style={{ color: 'rgba(255,255,255,0.15)' }}>–</span>}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// ── 2. Heatmap Cells ──────────────────────────────────────────────────────────
const Design2 = () => (
  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
    <thead>
      <tr>
        <th style={{ textAlign: 'right', padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>משתתף</th>
        {ROUNDS.map(r => <th key={r} style={{ padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>{r}</th>)}
      </tr>
    </thead>
    <tbody>
      {PLAYERS.map((p, i) => (
        <tr key={p.id}>
          <td style={{ padding: '6px 10px', color: '#e2e8f0' }}><span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 6, fontSize: 11 }}>{i + 1}</span>{p.name}</td>
          {p.rounds.map((r, ri) => (
            <td key={ri} style={{ padding: 4, textAlign: 'center' }}>
              {r ? <div style={{ background: heatColor(r), borderRadius: 6, padding: '6px 0', color: '#fff', fontWeight: 700, fontSize: 13, border: `1px solid ${rc(r)}30` }}>{r}</div> : <span style={{ color: 'rgba(255,255,255,0.15)' }}>–</span>}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// ── 3. SVG Trend Lines ────────────────────────────────────────────────────────
const Design3 = () => {
  const W = 260, H = 130, PAD = 20;
  const xStep = (W - PAD * 2) / (ROUNDS.length - 1);
  const yStep = (H - PAD * 2) / (N - 1);
  const colors = ['#FFD700','#60a5fa','#f472b6','#34d399','#fb923c','#a78bfa'];
  return (
    <div>
      <svg width={W} height={H} style={{ display: 'block', margin: '0 auto 8px' }}>
        {PLAYERS.map((p, pi) => {
          const pts = p.rounds.map((r, ri) => r ? `${PAD + ri * xStep},${PAD + (r - 1) * yStep}` : null).filter(Boolean);
          return (
            <g key={p.id}>
              <polyline points={pts.join(' ')} fill="none" stroke={colors[pi]} strokeWidth={p.isCurrentUser ? 2.5 : 1.5} strokeOpacity={p.isCurrentUser ? 1 : 0.55} strokeDasharray={p.isCurrentUser ? '' : '4 2'} />
              {p.rounds.map((r, ri) => r ? <circle key={ri} cx={PAD + ri * xStep} cy={PAD + (r - 1) * yStep} r={p.isCurrentUser ? 4 : 3} fill={colors[pi]} fillOpacity={0.85} /> : null)}
            </g>
          );
        })}
        {ROUNDS.map((r, i) => <text key={r} x={PAD + i * xStep} y={H - 4} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.3)">{r}</text>)}
        {[1,2,3,4,5,6].map(r => <text key={r} x={4} y={PAD + (r - 1) * yStep + 4} fontSize={9} fill="rgba(255,255,255,0.25)">{r}</text>)}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {PLAYERS.map((p, pi) => <span key={p.id} style={{ fontSize: 10, color: colors[pi], display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 12, height: 2, background: colors[pi], display: 'inline-block', borderRadius: 1 }} />{p.name}</span>)}
      </div>
    </div>
  );
};

// ── 4. Horizontal Bars (inverse rank) ─────────────────────────────────────────
const Design4 = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
    {ROUNDS.map((round, ri) => (
      <div key={ri}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textAlign: 'center' }}>{round}</div>
        {[...PLAYERS].sort((a,b) => (a.rounds[ri]||99)-(b.rounds[ri]||99)).map(p => {
          const r = p.rounds[ri];
          const pct = r ? Math.round((N - r + 1) / N * 100) : 0;
          return (
            <div key={p.id} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 10, color: p.isCurrentUser ? '#60a5fa' : '#e2e8f0', marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
                <span>{p.name}</span><span style={{ color: rc(r) }}>#{r || '–'}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.1 }} style={{ height: '100%', borderRadius: 3, background: r ? `linear-gradient(90deg, ${rc(r)}, ${rc(r)}88)` : 'transparent' }} />
              </div>
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

// ── 5. Podium Blocks ──────────────────────────────────────────────────────────
const Design5 = () => (
  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
    {ROUNDS.map((round, ri) => {
      const sorted = [...PLAYERS].filter(p=>p.rounds[ri]).sort((a,b)=>a.rounds[ri]-b.rounds[ri]);
      const maxH = 80;
      return (
        <div key={ri} style={{ minWidth: 120, flex: 1 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 6 }}>{round}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 3, height: maxH + 20 }}>
            {sorted.map(p => {
              const r = p.rounds[ri];
              const h = Math.round(maxH - (r - 1) * (maxH / N));
              return (
                <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontSize: 9, color: rc(r), fontWeight: 700 }}>#{r}</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: h }} transition={{ duration: 0.6, delay: r * 0.05 }}
                    style={{ width: 22, background: rbg(r), border: `1px solid ${rc(r)}50`, borderRadius: '3px 3px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 3 }}>
                    <span style={{ fontSize: 8, color: rc(r) }}>{p.name.slice(0,3)}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
);

// ── 6. Jersey Numbers ─────────────────────────────────────────────────────────
const Design6 = () => (
  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
    <thead><tr>
      <th style={{ textAlign: 'right', padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>שחקן</th>
      {ROUNDS.map(r => <th key={r} style={{ padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>{r}</th>)}
    </tr></thead>
    <tbody>{PLAYERS.map((p, i) => (
      <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <td style={{ padding: '8px 10px', color: p.isCurrentUser ? '#60a5fa' : '#e2e8f0' }}>{p.name}</td>
        {p.rounds.map((r, ri) => (
          <td key={ri} style={{ padding: '6px 10px', textAlign: 'center' }}>
            {r ? (
              <div style={{ width: 34, height: 38, margin: 'auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 34 38" width={34} height={38} style={{ position: 'absolute' }}>
                  <path d="M4,6 L10,2 L17,4 L24,2 L30,6 L32,12 L28,14 L28,36 L6,36 L6,14 L2,12 Z" fill={rc(r)+'22'} stroke={rc(r)+'66'} strokeWidth={1} />
                </svg>
                <span style={{ position: 'relative', fontWeight: 900, fontSize: 13, color: rc(r) }}>{r}</span>
              </div>
            ) : <span style={{ color: 'rgba(255,255,255,0.15)' }}>–</span>}
          </td>
        ))}
      </tr>
    ))}</tbody>
  </table>
);

// ── 7. Momentum Arrows ────────────────────────────────────────────────────────
const Design7 = () => (
  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
    <thead><tr>
      <th style={{ textAlign: 'right', padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>משתתף</th>
      {ROUNDS.map(r => <th key={r} style={{ padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>{r}</th>)}
    </tr></thead>
    <tbody>{PLAYERS.map(p => (
      <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <td style={{ padding: '8px 10px', color: p.isCurrentUser ? '#60a5fa' : '#e2e8f0' }}>{p.name}</td>
        {p.rounds.map((r, ri) => {
          const prev = p.rounds[ri - 1];
          const arrow = !r ? '–' : !prev ? '' : r < prev ? '↑' : r > prev ? '↓' : '→';
          const arrowColor = arrow === '↑' ? '#22c55e' : arrow === '↓' ? '#ef4444' : '#94a3b8';
          return (
            <td key={ri} style={{ padding: '8px 10px', textAlign: 'center' }}>
              {r ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <span style={{ color: rc(r), fontWeight: 700 }}>{r}</span>
                {arrow && <span style={{ color: arrowColor, fontSize: 14, lineHeight: 1 }}>{arrow}</span>}
              </div> : <span style={{ color: 'rgba(255,255,255,0.15)' }}>–</span>}
            </td>
          );
        })}
      </tr>
    ))}</tbody>
  </table>
);

// ── 8. Retro Scoreboard (LCD) ─────────────────────────────────────────────────
const Design8 = () => (
  <div style={{ background: '#0a0a0a', border: '2px solid #333', borderRadius: 8, padding: 12, fontFamily: 'monospace' }}>
    <div style={{ color: '#ff6b00', fontSize: 10, textAlign: 'center', marginBottom: 8, letterSpacing: 2 }}>◄ RANKING HISTORY ►</div>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead><tr>
        <th style={{ color: '#ff6b00', textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #ff6b0033' }}>PLAYER</th>
        {ROUNDS.map((r, i) => <th key={i} style={{ color: '#ff6b00', padding: '4px 8px', borderBottom: '1px solid #ff6b0033' }}>R{i+1}</th>)}
      </tr></thead>
      <tbody>{PLAYERS.map(p => (
        <tr key={p.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
          <td style={{ padding: '5px 8px', color: p.isCurrentUser ? '#ffcc00' : '#ff6b0099' }}>{p.name.toUpperCase().slice(0,8)}</td>
          {p.rounds.map((r, ri) => (
            <td key={ri} style={{ padding: '5px 8px', textAlign: 'center', color: r === 1 ? '#ffcc00' : r ? '#ff6b00' : '#333', fontWeight: 700 }}>{r || '--'}</td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

// ── 9. Neon Arcade ────────────────────────────────────────────────────────────
const Design9 = () => (
  <div style={{ background: '#050010', border: '1px solid #7c3aed44', borderRadius: 10, padding: 12 }}>
    <div style={{ textAlign: 'center', fontSize: 11, color: '#a78bfa', letterSpacing: 3, marginBottom: 10, textShadow: '0 0 8px #a78bfa' }}>HI-SCORE RANKING</div>
    {PLAYERS.map((p, i) => (
      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '4px 8px', borderRadius: 4, background: p.isCurrentUser ? 'rgba(124,58,237,0.15)' : 'transparent' }}>
        <span style={{ width: 18, color: '#7c3aed', fontWeight: 900, fontSize: 12, textShadow: '0 0 6px #7c3aed' }}>{i+1}</span>
        <span style={{ flex: 1, color: p.isCurrentUser ? '#c4b5fd' : '#a78bfa88', fontSize: 11, fontFamily: 'monospace' }}>{p.name}</span>
        {p.rounds.map((r, ri) => (
          <div key={ri} style={{ width: 26, height: 26, borderRadius: 4, border: `1px solid ${rc(r)}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rc(r), fontWeight: 900, fontSize: 12, textShadow: `0 0 8px ${rc(r)}`, background: `${rc(r)}11` }}>{r || '·'}</div>
        ))}
      </div>
    ))}
  </div>
);

// ── 10. Football ⚽ Badges ────────────────────────────────────────────────────
const Design10 = () => (
  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
    <thead><tr>
      <th style={{ textAlign: 'right', padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>שחקן</th>
      {ROUNDS.map(r => <th key={r} style={{ padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>{r}</th>)}
    </tr></thead>
    <tbody>{PLAYERS.map(p => (
      <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <td style={{ padding: '8px 10px', color: p.isCurrentUser ? '#60a5fa' : '#e2e8f0' }}>{p.name}</td>
        {p.rounds.map((r, ri) => (
          <td key={ri} style={{ padding: '6px 10px', textAlign: 'center' }}>
            {r ? <div style={{ position: 'relative', width: 32, height: 32, margin: 'auto' }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>⚽</span>
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontWeight: 900, fontSize: 11, color: '#fff', textShadow: '0 0 4px #000' }}>{r}</span>
            </div> : <span style={{ color: 'rgba(255,255,255,0.15)' }}>–</span>}
          </td>
        ))}
      </tr>
    ))}</tbody>
  </table>
);

// ── 11. Glass Cards per Round ─────────────────────────────────────────────────
const Design11 = () => (
  <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
    {ROUNDS.map((round, ri) => (
      <div key={ri} style={{ flex: 1, minWidth: 110, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 8 }}>{round}</div>
        {[...PLAYERS].filter(p=>p.rounds[ri]).sort((a,b)=>a.rounds[ri]-b.rounds[ri]).map(p => {
          const r = p.rounds[ri];
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', marginBottom: 3, borderRadius: 6, background: rbg(r), border: `1px solid ${rc(r)}30` }}>
              <span style={{ fontSize: 10, color: p.isCurrentUser ? '#93c5fd' : '#e2e8f0' }}>{p.name.slice(0,5)}</span>
              <span style={{ fontWeight: 900, color: rc(r), fontSize: 12 }}>#{r}</span>
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

// ── 12. Parallelogram Skew Rows ───────────────────────────────────────────────
const Design12 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    {PLAYERS.map((p, i) => (
      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, width: 14, flexShrink: 0 }}>{i+1}</span>
        <div style={{ flex: 1, transform: 'skewX(-6deg)', background: p.isCurrentUser ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${p.isCurrentUser ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 4, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ transform: 'skewX(6deg)', flex: 1, color: p.isCurrentUser ? '#93c5fd' : '#e2e8f0', fontSize: 12 }}>{p.name}</span>
          {p.rounds.map((r, ri) => (
            <div key={ri} style={{ transform: 'skewX(6deg)', width: 26, height: 26, borderRadius: '50%', background: rbg(r), display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${rc(r)}50`, color: rc(r), fontWeight: 700, fontSize: 11 }}>{r || '–'}</div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ── 13. Star Rating ───────────────────────────────────────────────────────────
const Design13 = () => {
  const stars = (r) => {
    if (!r) return '–';
    const filled = N - r + 1;
    return Array.from({ length: N }, (_, i) => i < filled ? '★' : '☆').join('');
  };
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead><tr>
        <th style={{ textAlign: 'right', padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>שחקן</th>
        {ROUNDS.map(r => <th key={r} style={{ padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>{r}</th>)}
      </tr></thead>
      <tbody>{PLAYERS.map(p => (
        <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <td style={{ padding: '8px 10px', color: p.isCurrentUser ? '#60a5fa' : '#e2e8f0' }}>{p.name}</td>
          {p.rounds.map((r, ri) => (
            <td key={ri} style={{ padding: '6px 10px', textAlign: 'center', color: rc(r), fontSize: 10, letterSpacing: -1 }}>{stars(r)}</td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  );
};

// ── 14. Timeline Dots ─────────────────────────────────────────────────────────
const Design14 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', paddingRight: 90 }}>
      {ROUNDS.map((r, i) => <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{r}</div>)}
    </div>
    {PLAYERS.map((p, i) => (
      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <div style={{ width: 90, fontSize: 11, color: p.isCurrentUser ? '#60a5fa' : '#e2e8f0', flexShrink: 0, paddingLeft: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 4, fontSize: 10 }}>{i+1}</span>{p.name}
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: p.isCurrentUser ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)' }} />
          {p.rounds.map((r, ri) => (
            <div key={ri} style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div whileHover={{ scale: 1.3 }} style={{ width: 28, height: 28, borderRadius: '50%', background: rbg(r), border: `2px solid ${rc(r)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rc(r), fontWeight: 900, fontSize: 12, cursor: 'default' }}>{r || '·'}</motion.div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ── 15. F1 Racing Grid ────────────────────────────────────────────────────────
const Design15 = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    {ROUNDS.map((round, ri) => {
      const sorted = [...PLAYERS].filter(p=>p.rounds[ri]).sort((a,b)=>a.rounds[ri]-b.rounds[ri]);
      return (
        <div key={ri} style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 6, letterSpacing: 1 }}>🏎 {round}</div>
          {sorted.map((p, pos) => {
            const r = p.rounds[ri];
            const barW = `${((N - pos) / N) * 100}%`;
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ width: 14, fontSize: 10, color: rc(r), fontWeight: 700, textAlign: 'right' }}>{r}</span>
                <div style={{ flex: 1, height: 18, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: barW }} transition={{ duration: 0.7, delay: pos * 0.05 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${rc(r)}, ${rc(r)}44)`, borderRadius: 2 }} />
                  <span style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', fontSize: 9, color: p.isCurrentUser ? '#93c5fd' : '#e2e8f0' }}>{p.name.slice(0,5)}</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    })}
  </div>
);

// ── 16. Flame / Ice Temperature ───────────────────────────────────────────────
const Design16 = () => {
  const tempColor = (r) => {
    if (!r) return 'rgba(255,255,255,0.1)';
    if (r === 1) return 'linear-gradient(135deg,#fbbf24,#f97316)';
    if (r === 2) return 'linear-gradient(135deg,#fb923c,#ef4444)';
    if (r === 3) return 'linear-gradient(135deg,#60a5fa,#3b82f6)';
    return `linear-gradient(135deg,rgba(100,116,139,0.5),rgba(71,85,105,0.5))`;
  };
  const emoji = (r) => r === 1 ? '🔥' : r === 2 ? '♨️' : r === 3 ? '❄️' : '🌫️';
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead><tr>
        <th style={{ textAlign: 'right', padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>שחקן</th>
        {ROUNDS.map(r => <th key={r} style={{ padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>{r}</th>)}
      </tr></thead>
      <tbody>{PLAYERS.map(p => (
        <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <td style={{ padding: '8px 10px', color: p.isCurrentUser ? '#60a5fa' : '#e2e8f0' }}>{p.name}</td>
          {p.rounds.map((r, ri) => (
            <td key={ri} style={{ padding: '6px 10px', textAlign: 'center' }}>
              {r ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: 16 }}>{emoji(r)}</span>
                <div style={{ width: 26, height: 20, borderRadius: 4, background: tempColor(r), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{r}</div>
              </div> : <span style={{ color: 'rgba(255,255,255,0.15)' }}>–</span>}
            </td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  );
};

// ── 17. World Cup Trophy Sizes ────────────────────────────────────────────────
const Design17 = () => {
  const tSize = (r) => [28, 24, 20, 16, 14, 12][r - 1] || 12;
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead><tr>
        <th style={{ textAlign: 'right', padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>שחקן</th>
        {ROUNDS.map(r => <th key={r} style={{ padding: '6px 10px', color: 'rgba(255,255,255,0.4)' }}>{r}</th>)}
      </tr></thead>
      <tbody>{PLAYERS.map(p => (
        <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <td style={{ padding: '8px 10px', color: p.isCurrentUser ? '#60a5fa' : '#e2e8f0' }}>{p.name}</td>
          {p.rounds.map((r, ri) => (
            <td key={ri} style={{ padding: '6px 10px', textAlign: 'center', verticalAlign: 'middle' }}>
              {r ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/wc-trophy.png" alt="" style={{ width: tSize(r), height: tSize(r), objectFit: 'contain', opacity: r === 1 ? 1 : 0.5 + (N - r) / (N * 2) }} />
                <span style={{ fontSize: 9, color: rc(r), marginTop: 1 }}>#{r}</span>
              </div> : <span style={{ color: 'rgba(255,255,255,0.15)' }}>–</span>}
            </td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  );
};

// ── 18. Rank Delta Chips ──────────────────────────────────────────────────────
const Design18 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ display: 'flex', paddingRight: 100 }}>
      {ROUNDS.map((r, i) => <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{r}</div>)}
    </div>
    {PLAYERS.map((p, i) => (
      <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '5px 8px', borderRadius: 8, background: p.isCurrentUser ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${p.isCurrentUser ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
        <div style={{ width: 100, fontSize: 11, color: p.isCurrentUser ? '#93c5fd' : '#e2e8f0', flexShrink: 0 }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, marginLeft: 4 }}>{i+1}</span>{p.name}
        </div>
        {p.rounds.map((r, ri) => {
          const prev = p.rounds[ri - 1];
          const delta = prev && r ? prev - r : 0;
          return (
            <div key={ri} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontWeight: 700, color: rc(r), fontSize: 13 }}>{r || '–'}</span>
              {ri > 0 && r && prev && delta !== 0 && (
                <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 10, background: delta > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: delta > 0 ? '#22c55e' : '#ef4444' }}>
                  {delta > 0 ? `+${delta}` : delta}
                </span>
              )}
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

// ── 19. Mini Radar (Spider) ───────────────────────────────────────────────────
const Design19 = () => {
  const SIZE = 60, CX = 30, CY = 30, R = 22;
  const colors = ['#FFD700','#60a5fa','#f472b6','#34d399','#fb923c','#a78bfa'];
  const pts = (scores) => scores.map((s, i) => {
    if (!s) return null;
    const angle = (i / scores.length) * Math.PI * 2 - Math.PI / 2;
    const r = R * (1 - (s - 1) / N);
    return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)];
  }).filter(Boolean);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
      {PLAYERS.map((p, pi) => {
        const points = pts(p.rounds);
        return (
          <div key={p.id} style={{ textAlign: 'center' }}>
            <svg width={SIZE} height={SIZE}>
              {[1,2,3].map(lvl => <circle key={lvl} cx={CX} cy={CY} r={R * lvl / 3} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />)}
              {p.rounds.map((_, i) => {
                const angle = (i / p.rounds.length) * Math.PI * 2 - Math.PI / 2;
                return <line key={i} x1={CX} y1={CY} x2={CX + R * Math.cos(angle)} y2={CY + R * Math.sin(angle)} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />;
              })}
              {points.length > 1 && <polygon points={points.map(p => p.join(',')).join(' ')} fill={colors[pi] + '33'} stroke={colors[pi]} strokeWidth={1.2} />}
              {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.5} fill={colors[pi]} />)}
            </svg>
            <div style={{ fontSize: 9, color: colors[pi], marginTop: 2 }}>{p.name.slice(0,6)}</div>
          </div>
        );
      })}
    </div>
  );
};

// ── 20. World Cup Bracket Style ───────────────────────────────────────────────
const Design20 = () => (
  <div>
    {ROUNDS.map((round, ri) => {
      const sorted = [...PLAYERS].filter(p=>p.rounds[ri]).sort((a,b)=>a.rounds[ri]-b.rounds[ri]);
      return (
        <div key={ri} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 5, letterSpacing: 1, paddingRight: 6, borderRight: '2px solid rgba(245,197,24,0.4)', textAlign: 'right' }}>🏆 {round}</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {sorted.map(p => {
              const r = p.rounds[ri];
              return (
                <motion.div key={p.id} whileHover={{ scale: 1.05 }}
                  style={{ padding: '4px 10px', borderRadius: 4, background: rbg(r), border: `1px solid ${rc(r)}50`, display: 'flex', alignItems: 'center', gap: 5, cursor: 'default' }}>
                  <span style={{ fontWeight: 900, color: rc(r), fontSize: 12, minWidth: 14 }}>{r}</span>
                  <span style={{ fontSize: 10, color: p.isCurrentUser ? '#93c5fd' : '#e2e8f0' }}>{p.name.slice(0,6)}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
);

// ── Registry ──────────────────────────────────────────────────────────────────
const DESIGNS = [
  { id: 1,  label: 'עיגולים קלאסיים',       desc: 'עיצוב המקורי — עיגולי מיקום צבעוניים',       Component: Design1 },
  { id: 2,  label: 'Heatmap תאים',           desc: 'צבע תא לפי דירוג — ירוק=מקום גבוה, אדום=נמוך', Component: Design2 },
  { id: 3,  label: 'קווי מגמה SVG',          desc: 'גרף קו אנימטיבי לכל שחקן',                  Component: Design3 },
  { id: 4,  label: 'Bars אופקיים',           desc: 'פסי התקדמות לפי מיקום',                       Component: Design4 },
  { id: 5,  label: 'Podium בלוקים',          desc: 'עמודי פודיום — גובה לפי מיקום',              Component: Design5 },
  { id: 6,  label: 'Jersey מספרים',          desc: 'מספר בצורת חולצת כדורגל',                    Component: Design6 },
  { id: 7,  label: 'חצי מומנטום ↑↓→',        desc: 'חצים שמראים שינוי מיקום בין מחזורים',        Component: Design7 },
  { id: 8,  label: 'Retro LCD Scoreboard',   desc: 'לוח תוצאות רטרו LCD כתום',                   Component: Design8 },
  { id: 9,  label: 'Neon Arcade',            desc: 'סגנון ארקייד ניאון סגול',                     Component: Design9 },
  { id: 10, label: '⚽ כדורגל Badges',       desc: 'מיקום בתוך כדורגל',                          Component: Design10 },
  { id: 11, label: 'Glass Cards per Round',  desc: 'קארדים זכוכית לכל מחזור',                    Component: Design11 },
  { id: 12, label: 'Parallelogram שורות',    desc: 'שורות מוטות כמו הלידרבורד',                  Component: Design12 },
  { id: 13, label: '★ Star Rating',          desc: 'כוכבים לפי מיקום — יותר כוכבים = מקום גבוה', Component: Design13 },
  { id: 14, label: 'Timeline נקודות',        desc: 'ציר זמן עם עיגולי מיקום אינטרקטיביים',       Component: Design14 },
  { id: 15, label: '🏎 F1 Racing Grid',       desc: 'רשת מירוץ F1 עם פסים',                       Component: Design15 },
  { id: 16, label: '🔥❄️ Flame / Ice',        desc: 'מקום גבוה = אש, נמוך = קרח',                Component: Design16 },
  { id: 17, label: '🏆 גודל גביע',            desc: 'גביע גדול יותר = מיקום גבוה יותר',           Component: Design17 },
  { id: 18, label: 'Delta Chips +/-',        desc: 'הצגת השינוי כצ׳יפ +/- ירוק/אדום',           Component: Design18 },
  { id: 19, label: 'Radar Spider',           desc: 'גרף עכביש — צורה לפי עקביות בין מחזורים',   Component: Design19 },
  { id: 20, label: '🏆 Bracket מונדיאל',      desc: 'סגנון סיבוב טורניר — מיון לפי מחזור',        Component: Design20 },
];

export default function AdminRankingHistoryDemo() {
  const [selected, setSelected] = useState(1);
  const ActiveDesign = DESIGNS.find(d => d.id === selected)?.Component;

  return (
    <div style={{ padding: 24, color: 'white', fontFamily: "'Outfit', sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>היסטוריית מיקום — Demo</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20 }}>20 עיצובים שונים — לחץ לבחור</p>

      {/* Grid of options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginBottom: 28 }}>
        {DESIGNS.map(d => (
          <motion.div key={d.id} whileHover={{ scale: 1.02 }} onClick={() => setSelected(d.id)}
            style={{ cursor: 'pointer', padding: '10px 12px', borderRadius: 10, background: selected === d.id ? 'rgba(245,197,24,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selected === d.id ? 'rgba(245,197,24,0.5)' : 'rgba(255,255,255,0.08)'}`, transition: 'border 0.15s, background 0.15s' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: selected === d.id ? '#f5c518' : 'rgba(255,255,255,0.7)', marginBottom: 3 }}>#{d.id} {d.label}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.3 }}>{d.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Active Design Preview */}
      <AnimatePresence mode="wait">
        <motion.div key={selected} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
            עיצוב #{selected} — {DESIGNS.find(d => d.id === selected)?.label}
          </div>
          {ActiveDesign && <ActiveDesign />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
