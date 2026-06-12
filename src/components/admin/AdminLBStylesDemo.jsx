import React, { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const MOCK = [
  { rank: 1, name: 'אביב כהן',    score: 142.5, delta: 2,  pred: '2-1' },
  { rank: 2, name: 'מיכל לוי',   score: 138.0, delta: -1, pred: '1-0' },
  { rank: 3, name: 'דניאל רוזן', score: 131.5, delta: 0,  pred: '2-2' },
  { rank: 4, name: 'שירה גולן',  score: 127.0, delta: 3,  pred: '3-1' },
  { rank: 5, name: 'יונתן בר',   score: 119.5, delta: -2, pred: '0-0' },
  { rank: 6, name: 'נועה שפירא', score: 112.0, delta: 1,  pred: '1-1' },
];
const MC = ['#f59e0b','#9ca3af','#b45309'];

function D({ v, s = 11 }) {
  if (v > 0) return <span style={{ color:'#34d399', fontSize:s, display:'flex', alignItems:'center', gap:3, flexShrink:0 }}><TrendingUp size={s}/>+{v}</span>;
  if (v < 0) return <span style={{ color:'#f87171', fontSize:s, display:'flex', alignItems:'center', gap:3, flexShrink:0 }}><TrendingDown size={s}/>{v}</span>;
  return <Minus size={s} style={{ color:'#475569', flexShrink:0 }}/>;
}

/* ─── 1. פיקסל ארט ─── */
const S1 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', background:'#000', padding:12, imageRendering:'pixelated' }} dir="rtl">
    <div style={{ color:'#fff', fontSize:9, fontFamily:'monospace', letterSpacing:2, marginBottom:10, borderBottom:'2px solid #fff', paddingBottom:4 }}>* PLAYER SELECT *</div>
    {MOCK.map((r,i) => {
      const cols=['#ff0','#0ff','#f0f','#0f0','#f80','#08f'];
      return (
        <div key={r.rank} style={{ marginBottom:4, display:'flex', alignItems:'center', gap:6, border:`2px solid ${cols[i]}`, padding:'6px 8px', fontFamily:'monospace' }}>
          <span style={{ fontSize:14, color:cols[i], minWidth:20, fontWeight:900 }}>{r.rank}</span>
          <div style={{ width:14, height:14, background:cols[i], flexShrink:0, clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}/>
          <span style={{ flex:1, fontSize:11, color:'#fff' }}>{r.name}</span>
          <span style={{ fontSize:12, color:cols[i], fontWeight:700 }}>{r.score}</span>
          <D v={r.delta} s={10}/>
        </div>
      );
    })}
  </div>
);

/* ─── 2. חלל כוכבים ─── */
const S2 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', background:'radial-gradient(ellipse at top,#0f0c29,#302b63,#24243e)', borderRadius:16, padding:16, position:'relative', overflow:'hidden' }} dir="rtl">
    {[...Array(20)].map((_,i) => (
      <div key={i} style={{ position:'absolute', width:2, height:2, borderRadius:'50%', background:'#fff', opacity:Math.random()*0.7+0.3, top:`${Math.random()*100}%`, left:`${Math.random()*100}%` }}/>
    ))}
    {MOCK.map(r => {
      const c = r.rank<=3?MC[r.rank-1]:'#6366f1';
      return (
        <div key={r.rank} style={{ marginBottom:8, borderRadius:12, background:'rgba(255,255,255,.05)', border:`1px solid ${c}33`, backdropFilter:'blur(8px)', padding:'11px 16px', display:'flex', alignItems:'center', gap:10, position:'relative' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:`radial-gradient(circle,${c},${c}44)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 0 12px ${c}` }}>
            <span style={{ fontSize:12, fontWeight:900, color:'#fff' }}>{r.rank}</span>
          </div>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#e0e7ff' }}>{r.name}</span>
          <span style={{ fontSize:12, fontWeight:700, color:c }}>{r.score}</span>
          <D v={r.delta}/>
        </div>
      );
    })}
  </div>
);

/* ─── 3. אש ─── */
const S3 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', background:'linear-gradient(180deg,#1a0500,#2d0800)', borderRadius:12, padding:16, border:'1px solid #7c2d12' }} dir="rtl">
    <div style={{ textAlign:'center', fontSize:18, marginBottom:12 }}>🔥</div>
    {MOCK.map(r => {
      const intensity = 1 - (r.rank-1)/6;
      const bg = `linear-gradient(90deg, rgba(239,68,68,${intensity*.3}), rgba(249,115,22,${intensity*.2}), transparent)`;
      return (
        <div key={r.rank} style={{ marginBottom:6, borderRadius:8, background:bg, borderRight:`3px solid hsl(${20+r.rank*8},90%,${60-r.rank*5}%)`, padding:'11px 14px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:14, fontWeight:900, color:`hsl(${30-r.rank*3},100%,${65-r.rank*4}%)`, minWidth:22 }}>{r.rank}</span>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#fed7aa' }}>{r.name}</span>
          <span style={{ fontSize:12, fontWeight:700, color:`hsl(${40-r.rank*5},100%,65%)` }}>{r.score}</span>
          <D v={r.delta}/>
          <span style={{ fontSize:10, color:'#9a3412', fontFamily:'monospace' }}>{r.pred}</span>
        </div>
      );
    })}
  </div>
);

/* ─── 4. קרח ─── */
const S4 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', background:'linear-gradient(135deg,#0c1445,#0a2342)', borderRadius:16, padding:16, border:'1px solid rgba(147,210,255,.2)' }} dir="rtl">
    {MOCK.map(r => {
      const alpha = 0.15 - (r.rank-1)*0.018;
      return (
        <div key={r.rank} style={{ marginBottom:6, borderRadius:12, background:`rgba(147,210,255,${alpha})`, border:'1px solid rgba(147,210,255,.25)', backdropFilter:'blur(4px)', padding:'12px 16px', display:'flex', alignItems:'center', gap:10, boxShadow:'inset 0 1px 0 rgba(255,255,255,.1)' }}>
          <span style={{ fontSize:13, fontWeight:900, color:`rgba(147,210,255,${1-r.rank*.1})`, minWidth:22 }}>{r.rank}</span>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#bae6fd' }}>{r.name}</span>
          <span style={{ fontSize:12, fontWeight:700, color:'#e0f2fe' }}>{r.score}</span>
          <D v={r.delta}/>
          <span style={{ fontSize:10, color:'#7dd3fc', fontFamily:'monospace' }}>{r.pred}</span>
        </div>
      );
    })}
  </div>
);

/* ─── 5. מטריקס ─── */
const S5 = () => (
  <div style={{ maxWidth:360, margin:'0 auto', background:'#000', borderRadius:8, padding:14, fontFamily:'"Courier New",monospace', overflow:'hidden', position:'relative' }} dir="rtl">
    <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg,rgba(0,255,65,.03) 0px,rgba(0,255,65,.03) 1px,transparent 1px,transparent 4px)', pointerEvents:'none' }}/>
    <div style={{ color:'#00ff41', fontSize:9, letterSpacing:3, marginBottom:10, opacity:.6 }}>MATRIX://LEADERBOARD</div>
    {MOCK.map(r => (
      <div key={r.rank} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(0,255,65,.1)' }}>
        <span style={{ fontSize:13, color:r.rank===1?'#fff':'#00ff41', fontWeight:900, minWidth:20 }}>{r.rank}</span>
        <span style={{ flex:1, fontSize:11, color:r.rank===1?'#00ff41':'rgba(0,255,65,.7)' }}>{r.name}</span>
        <span style={{ fontSize:12, color:r.rank===1?'#fff':'#00ff41', fontWeight:700 }}>{r.score}</span>
        <span style={{ fontSize:10, color:'rgba(0,255,65,.4)' }}>{r.pred}</span>
      </div>
    ))}
    <div style={{ color:'rgba(0,255,65,.2)', fontSize:8, marginTop:10, letterSpacing:1 }}>WAKE UP NEO...</div>
  </div>
);

/* ─── 6. גל ים ─── */
const S6 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', background:'linear-gradient(180deg,#0369a1,#075985,#0c4a6e)', borderRadius:16, padding:16 }} dir="rtl">
    <div style={{ textAlign:'center', fontSize:16, marginBottom:10 }}>🌊</div>
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ marginBottom:6, borderRadius:10, background:`rgba(255,255,255,${0.12-i*0.015})`, border:'1px solid rgba(255,255,255,.2)', padding:'11px 16px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:26, height:26, borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:'1px solid rgba(255,255,255,.4)' }}>
          <span style={{ fontSize:11, fontWeight:900, color:'#fff' }}>{r.rank}</span>
        </div>
        <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#e0f2fe' }}>{r.name}</span>
        <span style={{ fontSize:12, fontWeight:700, color:'#bae6fd' }}>{r.score}</span>
        <D v={r.delta}/>
        <span style={{ fontSize:10, color:'rgba(255,255,255,.5)', fontFamily:'monospace' }}>{r.pred}</span>
      </div>
    ))}
  </div>
);

/* ─── 7. קלף פוקר ─── */
const SUITS = ['♠','♥','♦','♣','★','◆'];
const SUIT_C = ['#fff','#ff4444','#ff4444','#fff','#ffd700','#fff'];
const S7 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ marginBottom:8, borderRadius:10, background:'linear-gradient(135deg,#1c1c1c,#2d2d2d)', border:'2px solid #444', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, boxShadow:'2px 2px 0 #000, inset 0 1px 0 rgba(255,255,255,.08)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', left:-8, top:-8, fontSize:36, opacity:.06, color:'#fff' }}>{SUITS[i]}</div>
        <span style={{ fontSize:22, color:SUIT_C[i], flexShrink:0 }}>{SUITS[i]}</span>
        <div>
          <div style={{ fontSize:11, color:'#9ca3af' }}>מקום</div>
          <div style={{ fontSize:20, fontWeight:900, color:'#fff', lineHeight:1 }}>{r.rank}</div>
        </div>
        <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{r.name}</span>
        <div style={{ textAlign:'left' }}>
          <div style={{ fontSize:13, fontWeight:800, color:SUIT_C[i] }}>{r.score}</div>
          <div style={{ fontSize:10, color:'#64748b', fontFamily:'monospace' }}>{r.pred}</div>
        </div>
        <D v={r.delta}/>
      </div>
    ))}
  </div>
);

/* ─── 8. דאשבורד ─── */
const S8 = () => (
  <div style={{ maxWidth:380, margin:'0 auto', background:'#111827', borderRadius:16, padding:16 }} dir="rtl">
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
      {MOCK.slice(0,3).map(r => (
        <div key={r.rank} style={{ borderRadius:10, background:r.rank===1?'linear-gradient(135deg,#f59e0b,#d97706)':r.rank===2?'linear-gradient(135deg,#6366f1,#4f46e5)':'linear-gradient(135deg,#10b981,#059669)', padding:'12px 10px', textAlign:'center' }}>
          <div style={{ fontSize:9, color:'rgba(255,255,255,.7)', letterSpacing:1, marginBottom:4 }}>#{r.rank}</div>
          <div style={{ fontSize:11, color:'#fff', fontWeight:700, lineHeight:1.2 }}>{r.name}</div>
          <div style={{ fontSize:15, color:'#fff', fontWeight:900, marginTop:4 }}>{r.score}</div>
        </div>
      ))}
    </div>
    {MOCK.slice(3).map(r => (
      <div key={r.rank} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:8, background:'#1f2937', marginBottom:6 }}>
        <span style={{ fontSize:12, color:'#4b5563', fontWeight:700, minWidth:20 }}>{r.rank}</span>
        <span style={{ flex:1, fontSize:12, color:'#9ca3af' }}>{r.name}</span>
        <span style={{ fontSize:12, fontWeight:700, color:'#6b7280' }}>{r.score}</span>
        <D v={r.delta}/>
      </div>
    ))}
  </div>
);

/* ─── 9. טבעות ─── */
const S9 = () => (
  <div style={{ maxWidth:380, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }} dir="rtl">
    {MOCK.map(r => {
      const pct = r.score/MOCK[0].score*100;
      const c = r.rank<=3?MC[r.rank-1]:'#6366f1';
      const r2 = 38, circ = 2*Math.PI*r2;
      return (
        <div key={r.rank} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, background:'#1e293b', borderRadius:14, padding:'14px 8px 10px' }}>
          <div style={{ position:'relative', width:88, height:88 }}>
            <svg width={88} height={88} style={{ transform:'rotate(-90deg)' }}>
              <circle cx={44} cy={44} r={r2} fill="none" stroke="#1e293b" strokeWidth={7}/>
              <circle cx={44} cy={44} r={r2} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
                style={{ filter:`drop-shadow(0 0 6px ${c}88)` }}/>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:16, fontWeight:900, color:c }}>{r.rank}</span>
            </div>
          </div>
          <span style={{ fontSize:10, color:'#e2e8f0', fontWeight:600, textAlign:'center', lineHeight:1.2 }}>{r.name}</span>
          <span style={{ fontSize:11, fontWeight:700, color:c }}>{r.score}</span>
          <D v={r.delta} s={10}/>
        </div>
      );
    })}
  </div>
);

/* ─── 10. כרטיס ביקור ─── */
const BIZ_BG = ['linear-gradient(135deg,#1e3a5f,#0369a1)','linear-gradient(135deg,#1a1a2e,#16213e)','linear-gradient(135deg,#1a0000,#4a0000)','linear-gradient(135deg,#0d1117,#1e293b)','linear-gradient(135deg,#0f2027,#203a43)','linear-gradient(135deg,#0a0a0a,#1a1a1a)'];
const S10 = () => (
  <div style={{ maxWidth:380, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }} dir="rtl">
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ borderRadius:12, background:BIZ_BG[i], padding:'14px 14px 12px', border:'1px solid rgba(255,255,255,.1)', boxShadow:'0 4px 16px rgba(0,0,0,.4)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', bottom:-10, left:-10, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,.04)' }}/>
        <div style={{ fontSize:9, color:'rgba(255,255,255,.4)', letterSpacing:2, marginBottom:6 }}>RANK #{r.rank}</div>
        <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:2 }}>{r.name}</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,.5)', marginBottom:8, fontFamily:'monospace' }}>{r.pred}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(255,255,255,.1)', paddingTop:8 }}>
          <span style={{ fontSize:14, fontWeight:900, color:r.rank<=3?MC[r.rank-1]:'#94a3b8' }}>{r.score}</span>
          <D v={r.delta} s={10}/>
        </div>
      </div>
    ))}
  </div>
);

/* ─── 11. לוח שחמט ─── */
const S11 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', border:'2px solid #475569', borderRadius:8, overflow:'hidden' }} dir="rtl">
    {MOCK.map((r,i) => {
      const isEven = i%2===0;
      return (
        <div key={r.rank} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 16px', background:isEven?'#1e293b':'#0f172a', borderBottom:'1px solid #334155' }}>
          <div style={{ width:28, height:28, background:isEven?'#f8fafc':'#1e293b', border:`2px solid ${isEven?'#1e293b':'#f8fafc'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:13, fontWeight:900, color:isEven?'#0f172a':'#f8fafc' }}>{r.rank}</span>
          </div>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:isEven?'#f1f5f9':'#94a3b8' }}>{r.name}</span>
          <span style={{ fontSize:12, fontWeight:700, color:r.rank<=3?MC[r.rank-1]:'#64748b' }}>{r.score}</span>
          <D v={r.delta}/>
        </div>
      );
    })}
  </div>
);

/* ─── 12. מדיה חברתית ─── */
const AVATARS = ['🦁','🐯','🦊','🐺','🦅','🐬'];
const S12 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ marginBottom:10, borderRadius:16, background:'#1e293b', padding:'12px 14px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 2px 12px rgba(0,0,0,.3)' }}>
        <div style={{ position:'relative', flexShrink:0 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg,${r.rank<=3?MC[r.rank-1]:'#334155'},${r.rank<=3?MC[r.rank-1]+'88':'#1e293b'})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{AVATARS[i]}</div>
          <div style={{ position:'absolute', bottom:-2, right:-2, width:16, height:16, borderRadius:'50%', background:r.rank<=3?MC[r.rank-1]:'#334155', border:'2px solid #1e293b', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:8, fontWeight:900, color:'#fff' }}>{r.rank}</span>
          </div>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>{r.name}</div>
          <div style={{ fontSize:10, color:'#64748b', marginTop:1 }}>ניחוש: <span style={{ color:'#7dd3fc' }}>{r.pred}</span></div>
        </div>
        <div style={{ textAlign:'left' }}>
          <div style={{ fontSize:14, fontWeight:800, color:r.rank<=3?MC[r.rank-1]:'#475569' }}>{r.score}</div>
          <D v={r.delta} s={10}/>
        </div>
      </div>
    ))}
  </div>
);

/* ─── 13. לילה בעיר ─── */
const S13 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', background:'linear-gradient(180deg,#0f0c1a,#1a0f2e,#0f0c1a)', borderRadius:16, padding:16, border:'1px solid rgba(139,92,246,.2)' }} dir="rtl">
    <div style={{ textAlign:'center', fontSize:10, color:'#8b5cf6', letterSpacing:3, marginBottom:14, opacity:.7 }}>🌃 NIGHT MODE</div>
    {MOCK.map(r => {
      const glow = r.rank===1?'#f59e0b':r.rank===2?'#8b5cf6':r.rank===3?'#06b6d4':'#334155';
      return (
        <div key={r.rank} style={{ marginBottom:6, borderRadius:10, background:'rgba(255,255,255,.03)', border:`1px solid ${glow}33`, padding:'11px 16px', display:'flex', alignItems:'center', gap:10, boxShadow:r.rank<=3?`0 0 20px ${glow}22`:'none' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:glow, boxShadow:`0 0 8px ${glow}`, flexShrink:0 }}/>
          <span style={{ fontSize:13, fontWeight:800, color:glow, minWidth:18 }}>{r.rank}</span>
          <span style={{ flex:1, fontSize:12, fontWeight:500, color:'#c4b5fd' }}>{r.name}</span>
          <span style={{ fontSize:13, fontWeight:700, color:glow }}>{r.score}</span>
          <D v={r.delta}/>
        </div>
      );
    })}
  </div>
);

/* ─── 14. ברצועות ─── */
const S14 = () => (
  <div style={{ maxWidth:360, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => {
      const c = r.rank<=3?MC[r.rank-1]:'#3b82f6';
      return (
        <div key={r.rank} style={{ marginBottom:6, display:'flex', alignItems:'stretch', borderRadius:10, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,.4)' }}>
          <div style={{ width:6, background:c, flexShrink:0 }}/>
          <div style={{ flex:1, background:'#1e293b', padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:16, fontWeight:900, color:c, minWidth:24 }}>{r.rank}</span>
            <div style={{ width:1, height:24, background:'#334155', flexShrink:0 }}/>
            <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{r.name}</span>
            <span style={{ fontSize:12, fontWeight:700, color:c }}>{r.score}</span>
            <D v={r.delta}/>
          </div>
          <div style={{ width:6, background:`${c}44`, flexShrink:0 }}/>
        </div>
      );
    })}
  </div>
);

/* ─── 15. ספורט NBA ─── */
const S15 = () => (
  <div style={{ maxWidth:380, margin:'0 auto', background:'#0a0a0a', borderRadius:10, overflow:'hidden', border:'1px solid #222' }} dir="rtl">
    <div style={{ display:'grid', gridTemplateColumns:'32px 1fr 72px 44px', gap:0, background:'#c8102e', padding:'8px 14px' }}>
      {['#','שחקן','נק\'','שינוי'].map(h => <span key={h} style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,.8)', letterSpacing:1 }}>{h}</span>)}
    </div>
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ display:'grid', gridTemplateColumns:'32px 1fr 72px 44px', gap:0, padding:'10px 14px', background:i%2===0?'#111':'#0a0a0a', borderBottom:'1px solid #1a1a1a', alignItems:'center' }}>
        <span style={{ fontSize:13, fontWeight:900, color:r.rank<=3?'#c8102e':'#444' }}>{r.rank}</span>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{r.name}</div>
          <div style={{ fontSize:9, color:'#555', fontFamily:'monospace' }}>{r.pred}</div>
        </div>
        <span style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{r.score}</span>
        <D v={r.delta} s={11}/>
      </div>
    ))}
  </div>
);

/* ─── 16. ריבועי צבע ─── */
const TILE_G = ['linear-gradient(135deg,#f59e0b,#ef4444)','linear-gradient(135deg,#3b82f6,#8b5cf6)','linear-gradient(135deg,#10b981,#3b82f6)','linear-gradient(135deg,#f43f5e,#ec4899)','linear-gradient(135deg,#14b8a6,#6366f1)','linear-gradient(135deg,#f97316,#eab308)'];
const S16 = () => (
  <div style={{ maxWidth:360, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }} dir="rtl">
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ borderRadius:14, background:TILE_G[i], padding:'2px' }}>
        <div style={{ borderRadius:12, background:'rgba(0,0,0,.75)', padding:'14px 12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
            <span style={{ fontSize:10, color:'rgba(255,255,255,.5)', fontWeight:700 }}>#{r.rank}</span>
            <D v={r.delta} s={10}/>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:4 }}>{r.name}</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:16, fontWeight:900, background:TILE_G[i], WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{r.score}</span>
            <span style={{ fontSize:10, color:'rgba(255,255,255,.4)', fontFamily:'monospace' }}>{r.pred}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ─── 17. נוסף עתיק ─── */
const S17 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', background:'linear-gradient(135deg,#1c0a00,#2d1500)', borderRadius:12, padding:'16px 14px', border:'2px solid #92400e', boxShadow:'inset 0 0 40px rgba(180,83,9,.2)' }} dir="rtl">
    <div style={{ textAlign:'center', fontSize:11, color:'#d97706', letterSpacing:4, marginBottom:14, fontFamily:'serif' }}>━ CHAMPIONS ━</div>
    {MOCK.map(r => (
      <div key={r.rank} style={{ marginBottom:8, display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderBottom:'1px solid rgba(180,83,9,.2)', position:'relative' }}>
        <span style={{ fontSize:r.rank===1?20:r.rank===2?17:r.rank===3?15:13, fontWeight:900, color:r.rank===1?'#f59e0b':r.rank===2?'#d1d5db':r.rank===3?'#cd7f32':'#78350f', minWidth:28, fontFamily:'serif' }}>{r.rank===1?'Ⅰ':r.rank===2?'Ⅱ':r.rank===3?'Ⅲ':r.rank}</span>
        <span style={{ flex:1, fontSize:12, color:'#fde68a', fontFamily:'serif' }}>{r.name}</span>
        <span style={{ fontSize:13, fontWeight:700, color:r.rank<=3?MC[r.rank-1]:'#92400e' }}>{r.score}</span>
        <D v={r.delta}/>
      </div>
    ))}
  </div>
);

/* ─── 18. טיפוגרפיה ענקית ─── */
const S18 = () => (
  <div style={{ maxWidth:360, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => (
      <div key={r.rank} style={{ marginBottom:4, padding:'8px 0', borderBottom:'1px solid #1e293b', display:'flex', alignItems:'baseline', gap:12 }}>
        <span style={{ fontSize:r.rank===1?52:r.rank===2?44:r.rank===3?38:30, fontWeight:900, color:r.rank<=3?MC[r.rank-1]:'rgba(71,85,105,.4)', lineHeight:1, minWidth:r.rank===1?56:48 }}>{r.rank}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:r.rank<=3?14:12, fontWeight:700, color:r.rank<=3?'#f1f5f9':'#475569' }}>{r.name}</div>
          <div style={{ fontSize:10, color:'#334155', fontFamily:'monospace' }}>{r.pred}</div>
        </div>
        <span style={{ fontSize:r.rank===1?18:14, fontWeight:900, color:r.rank<=3?MC[r.rank-1]:'#334155' }}>{r.score}</span>
        <D v={r.delta}/>
      </div>
    ))}
  </div>
);

/* ─── 19. שקיפות מלאה ─── */
const S19 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', background:'linear-gradient(135deg,#667eea,#764ba2)', borderRadius:20, padding:16 }} dir="rtl">
    {MOCK.map(r => (
      <div key={r.rank} style={{ marginBottom:8, borderRadius:14, background:'rgba(255,255,255,.15)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,.3)', padding:'12px 16px', display:'flex', alignItems:'center', gap:10, boxShadow:'0 4px 16px rgba(0,0,0,.1)' }}>
        <div style={{ width:30, height:30, borderRadius:10, background:'rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontSize:13, fontWeight:900, color:'#fff' }}>{r.rank}</span>
        </div>
        <span style={{ flex:1, fontSize:12, fontWeight:700, color:'#fff', textShadow:'0 1px 2px rgba(0,0,0,.2)' }}>{r.name}</span>
        <span style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{r.score}</span>
        <D v={r.delta}/>
        <span style={{ fontSize:10, color:'rgba(255,255,255,.6)', fontFamily:'monospace' }}>{r.pred}</span>
      </div>
    ))}
  </div>
);

/* ─── 20. ניאון קווים ─── */
const NL = ['#ff006e','#fb5607','#ffbe0b','#06d6a0','#118ab2','#8338ec'];
const S20 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', background:'#000', padding:16, borderRadius:12, border:'1px solid #111' }} dir="rtl">
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ marginBottom:10, position:'relative', paddingRight:20 }}>
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:3, background:NL[i], boxShadow:`0 0 10px ${NL[i]}` }}/>
        <div style={{ display:'flex', alignItems:'center', gap:10, paddingBottom:8, borderBottom:`1px solid ${NL[i]}22` }}>
          <span style={{ fontSize:14, fontWeight:900, color:NL[i], minWidth:22, textShadow:`0 0 8px ${NL[i]}` }}>{r.rank}</span>
          <span style={{ flex:1, fontSize:12, color:'#e2e8f0' }}>{r.name}</span>
          <span style={{ fontSize:13, fontWeight:700, color:NL[i] }}>{r.score}</span>
          <D v={r.delta}/>
        </div>
        <div style={{ display:'flex', gap:4, marginTop:4, paddingRight:32 }}>
          {[...Array(Math.round(r.score/25))].map((_,j) => (
            <div key={j} style={{ height:3, flex:1, background:NL[i], opacity:.4, borderRadius:2, boxShadow:`0 0 4px ${NL[i]}` }}/>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/* ─── 21. ספינה מלחמה (HUD) ─── */
const S21 = () => (
  <div style={{ maxWidth:360, margin:'0 auto', background:'#000814', borderRadius:12, padding:14, border:'1px solid rgba(0,200,255,.3)', fontFamily:'monospace' }} dir="rtl">
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, borderBottom:'1px solid rgba(0,200,255,.2)', paddingBottom:8 }}>
      <span style={{ fontSize:9, color:'#00c8ff', letterSpacing:2 }}>HUD://LIVE</span>
      <span style={{ fontSize:9, color:'rgba(0,200,255,.4)' }}>STATUS: ACTIVE</span>
    </div>
    {MOCK.map(r => {
      const hpPct = Math.round(r.score/MOCK[0].score*100);
      return (
        <div key={r.rank} style={{ marginBottom:10 }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:3 }}>
            <span style={{ fontSize:10, color:'#00c8ff', minWidth:22 }}>[{r.rank}]</span>
            <span style={{ flex:1, fontSize:11, color:'#7dd3fc' }}>{r.name}</span>
            <span style={{ fontSize:11, color:'#00ff88', fontWeight:700 }}>{r.score}</span>
            <D v={r.delta} s={10}/>
          </div>
          <div style={{ display:'flex', gap:2 }}>
            {[...Array(20)].map((_,j) => (
              <div key={j} style={{ flex:1, height:4, background:j<Math.round(hpPct/5)?'#00c8ff':'#0a1628', borderRadius:1, boxShadow:j<Math.round(hpPct/5)?'0 0 4px #00c8ff44':'' }}/>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

/* ─── 22. שיפוע אנכי ─── */
const S22 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', borderRadius:16, overflow:'hidden', background:'linear-gradient(180deg,#1e1b4b 0%,#312e81 20%,#1e40af 50%,#0369a1 80%,#0c4a6e 100%)' }} dir="rtl">
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid rgba(255,255,255,.08)', background:`rgba(0,0,0,${i*0.04})` }}>
        <span style={{ fontSize:13, fontWeight:900, color:`rgba(255,255,255,${1-i*0.12})`, minWidth:22 }}>{r.rank}</span>
        <span style={{ flex:1, fontSize:12, fontWeight:600, color:`rgba(255,255,255,${0.95-i*0.1})` }}>{r.name}</span>
        <span style={{ fontSize:13, fontWeight:700, color:`rgba(255,255,255,${1-i*0.12})` }}>{r.score}</span>
        <D v={r.delta}/>
        <span style={{ fontSize:10, color:'rgba(255,255,255,.3)', fontFamily:'monospace' }}>{r.pred}</span>
      </div>
    ))}
  </div>
);

/* ─── 23. תגים ─── */
const S23 = () => (
  <div style={{ maxWidth:360, margin:'0 auto', display:'flex', flexWrap:'wrap', gap:10 }} dir="rtl">
    {MOCK.map(r => {
      const c = r.rank<=3?MC[r.rank-1]:'#4b5563';
      return (
        <div key={r.rank} style={{ borderRadius:99, background:`${c}18`, border:`2px solid ${c}`, padding:'8px 16px', display:'flex', alignItems:'center', gap:8, boxShadow:r.rank<=3?`0 0 12px ${c}44`:'none' }}>
          <span style={{ fontSize:14, fontWeight:900, color:c }}>{r.rank}</span>
          <div style={{ width:1, height:14, background:`${c}44` }}/>
          <span style={{ fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{r.name}</span>
          <div style={{ width:1, height:14, background:`${c}44` }}/>
          <span style={{ fontSize:12, fontWeight:700, color:c }}>{r.score}</span>
          <D v={r.delta} s={10}/>
        </div>
      );
    })}
  </div>
);

/* ─── 24. שולחן בלוקצ'יין ─── */
const S24 = () => (
  <div style={{ maxWidth:380, margin:'0 auto', background:'#050d18', borderRadius:12, overflow:'hidden', border:'1px solid #0d2035' }} dir="rtl">
    <div style={{ background:'linear-gradient(90deg,#0d47a1,#1565c0)', padding:'10px 16px', display:'grid', gridTemplateColumns:'24px 1fr 80px 50px', gap:8, alignItems:'center' }}>
      {['#','שם','ניקוד','Δ'].map(h => <span key={h} style={{ fontSize:9, color:'rgba(255,255,255,.7)', fontWeight:700, fontFamily:'monospace', letterSpacing:1 }}>{h}</span>)}
    </div>
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ display:'grid', gridTemplateColumns:'24px 1fr 80px 50px', gap:8, padding:'10px 16px', background:i%2===0?'rgba(13,71,161,.08)':'transparent', borderBottom:'1px solid rgba(13,71,161,.15)', alignItems:'center' }}>
        <span style={{ fontSize:12, fontWeight:800, color:r.rank<=3?'#60a5fa':'#334155', fontFamily:'monospace' }}>{r.rank}</span>
        <div>
          <span style={{ fontSize:12, fontWeight:600, color:'#93c5fd' }}>{r.name}</span>
          <div style={{ fontSize:9, color:'#1e3a5f', fontFamily:'monospace' }}>{r.pred}</div>
        </div>
        <span style={{ fontSize:13, fontWeight:800, color:'#3b82f6' }}>{r.score}</span>
        <D v={r.delta} s={11}/>
      </div>
    ))}
  </div>
);

/* ─── 25. מונדיאל 2026 ─── */
const S25 = () => (
  <div style={{ maxWidth:360, margin:'0 auto', background:'#04080f', borderRadius:16, padding:16, border:'2px solid transparent', backgroundClip:'padding-box', position:'relative', overflow:'hidden' }} dir="rtl">
    <div style={{ position:'absolute', inset:0, borderRadius:16, padding:2, background:'linear-gradient(135deg,#f5c518,#c8860a,#f5c518)', WebkitMask:'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)', WebkitMaskComposite:'xor', maskComposite:'exclude', pointerEvents:'none' }}/>
    <div style={{ textAlign:'center', marginBottom:14 }}>
      <div style={{ fontSize:24 }}>🏆</div>
      <div style={{ fontSize:9, color:'#f5c518', letterSpacing:4, fontWeight:700 }}>FIFA WORLD CUP 2026™</div>
      <div style={{ fontSize:8, color:'rgba(245,197,24,.4)', letterSpacing:2, marginTop:2 }}>LIVE STANDINGS</div>
    </div>
    {MOCK.map(r => {
      const gold = r.rank===1, silver = r.rank===2, bronze = r.rank===3;
      const textC = gold?'#f5c518':silver?'#e5e7eb':bronze?'#cd7f32':'#475569';
      return (
        <div key={r.rank} style={{ marginBottom:6, borderRadius:10, background:gold?'linear-gradient(90deg,rgba(245,197,24,.12),transparent)':silver?'linear-gradient(90deg,rgba(229,231,235,.06),transparent)':bronze?'linear-gradient(90deg,rgba(205,127,50,.06),transparent)':'transparent', borderRight:`3px solid ${textC}`, paddingRight:12, padding:'10px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:r.rank<=3?16:13, fontWeight:900, color:textC, minWidth:24, textShadow:gold?'0 0 12px #f5c518':'' }}>{r.rank<=3?['🥇','🥈','🥉'][r.rank-1]:r.rank}</span>
          <span style={{ flex:1, fontSize:12, fontWeight:r.rank<=3?700:400, color:r.rank<=3?'#f1f5f9':'#64748b' }}>{r.name}</span>
          <span style={{ fontSize:r.rank<=3?14:12, fontWeight:800, color:textC }}>{r.score}</span>
          <D v={r.delta}/>
          <span style={{ fontSize:10, color:'#7dd3fc', fontFamily:'monospace' }}>{r.pred}</span>
        </div>
      );
    })}
  </div>
);

/* ─── metadata ─── */
const STYLES = [
  { id:1,  label:'פיקסל ארט',     sub:'8-bit arcade',       C:S1  },
  { id:2,  label:'חלל כוכבים',    sub:'Space nebula',        C:S2  },
  { id:3,  label:'אש',            sub:'Fire gradient',       C:S3  },
  { id:4,  label:'קרח',           sub:'Frozen crystal',      C:S4  },
  { id:5,  label:'מטריקס',        sub:'Matrix code rain',    C:S5  },
  { id:6,  label:'גל ים',         sub:'Ocean wave',          C:S6  },
  { id:7,  label:'קלף פוקר',      sub:'Playing card',        C:S7  },
  { id:8,  label:'דאשבורד',       sub:'Stats dashboard',     C:S8  },
  { id:9,  label:'טבעות',         sub:'Score rings',         C:S9  },
  { id:10, label:'כרטיס ביקור',   sub:'Business card grid',  C:S10 },
  { id:11, label:'שחמט',          sub:'Checkerboard',        C:S11 },
  { id:12, label:'סושיאל',        sub:'Social profile',      C:S12 },
  { id:13, label:'לילה בעיר',     sub:'Night mode',          C:S13 },
  { id:14, label:'ברצועות',       sub:'Side stripe',         C:S14 },
  { id:15, label:'NBA',           sub:'Sports stats table',  C:S15 },
  { id:16, label:'ריבועי גרדיאנט',sub:'Gradient tiles',      C:S16 },
  { id:17, label:'עתיקות',        sub:'Ancient / Roman',     C:S17 },
  { id:18, label:'טיפוגרפיה',    sub:'Giant type',          C:S18 },
  { id:19, label:'שקיפות',        sub:'Purple glass',        C:S19 },
  { id:20, label:'ניאון קווים',   sub:'Neon lines + bars',   C:S20 },
  { id:21, label:'HUD',           sub:'Spaceship HUD',       C:S21 },
  { id:22, label:'שיפוע אנכי',    sub:'Vertical gradient',   C:S22 },
  { id:23, label:'תגים',          sub:'Pill badges',         C:S23 },
  { id:24, label:'בלוקצ\'יין',    sub:'Data table',          C:S24 },
  { id:25, label:'מונדיאל 2026',  sub:'FIFA official',       C:S25 },
];

export default function AdminLBStylesDemo() {
  const [sel, setSel] = useState(1);
  const found = STYLES.find(s => s.id === sel);
  const Comp = found.C;

  return (
    <div style={{ minHeight:'100vh', background:'#0a0f1e', color:'#e2e8f0', padding:24 }} dir="rtl">
      <h2 style={{ fontSize:18, fontWeight:700, marginBottom:4, color:'#f8fafc' }}>25 עיצובי לוח חי — דמו</h2>
      <p style={{ fontSize:11, color:'#64748b', marginBottom:20 }}>בחר סגנון לתצוגה מקדימה</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, marginBottom:28, maxWidth:580 }}>
        {STYLES.map(s => (
          <button key={s.id} onClick={() => setSel(s.id)}
            style={{ padding:'7px 4px', borderRadius:8, border:`1px solid ${sel===s.id?'#f5c518':'#1e293b'}`, background:sel===s.id?'rgba(245,197,24,.12)':'#1e293b', color:sel===s.id?'#f5c518':'#64748b', fontSize:10, fontWeight:600, cursor:'pointer', lineHeight:1.4, transition:'all .15s' }}>
            <div style={{ fontSize:13, color:sel===s.id?'#f5c518':'#475569', fontWeight:900 }}>{s.id}</div>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ background:'#060c1a', borderRadius:16, padding:28, border:'1px solid #1e293b', maxWidth:500 }}>
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <span style={{ fontSize:15, fontWeight:700, color:'#f8fafc' }}>{sel}. {found.label}</span>
          <span style={{ display:'block', fontSize:11, color:'#64748b', marginTop:3 }}>{found.sub}</span>
        </div>
        <Comp/>
      </div>
    </div>
  );
}
