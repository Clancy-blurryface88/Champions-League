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
const MB = ['rgba(245,158,11,.1)','rgba(156,163,175,.08)','rgba(180,83,9,.08)'];

function D({ v, s = 11 }) {
  if (v > 0) return <span style={{ color:'#34d399', fontSize:s, display:'flex', alignItems:'center', gap:3, flexShrink:0 }}><TrendingUp size={s}/>+{v}</span>;
  if (v < 0) return <span style={{ color:'#f87171', fontSize:s, display:'flex', alignItems:'center', gap:3, flexShrink:0 }}><TrendingDown size={s}/>{v}</span>;
  return <Minus size={s} style={{ color:'#475569', flexShrink:0 }}/>;
}

/* ─── 1. פרלוגרמה (נוכחי) ─── */
const S1 = () => (
  <div style={{ maxWidth:320, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => {
      const c = r.rank<=3 ? MC[r.rank-1] : '#334155';
      const bg = r.rank<=3 ? MB[r.rank-1] : 'rgba(30,41,59,.6)';
      return (
        <div key={r.rank} style={{ transform:'skewX(-6deg)', borderRadius:8, border:`2px solid ${c}`, background:bg, marginBottom:6, overflow:'hidden', position:'relative' }}>
          <span style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%) skewX(6deg)', fontSize:26, fontWeight:900, opacity:.15, color:c, lineHeight:1 }}>{r.rank}</span>
          <div style={{ transform:'skewX(6deg)', padding:'12px 8px 12px 36px', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#e2e8f0', textAlign:'center' }}>{r.name}</span>
            <span style={{ fontSize:11, fontWeight:700, color:'#34d399' }}>{r.score}</span>
            <D v={r.delta}/>
            <span style={{ fontSize:10, color:'#7dd3fc', fontFamily:'monospace', width:28, textAlign:'right' }}>{r.pred}</span>
          </div>
        </div>
      );
    })}
  </div>
);

/* ─── 2. ניאון סייבר ─── */
const NC2 = ['#00ff88','#00d4ff','#ff6b35','#9945ff','#ff3366','#ffd700'];
const S2 = () => (
  <div style={{ background:'#030308', borderRadius:12, padding:16, maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ marginBottom:8, borderRadius:4, border:`1px solid ${NC2[i]}`, boxShadow:`0 0 14px ${NC2[i]}55`, padding:'10px 14px', display:'flex', alignItems:'center', gap:10, background:`${NC2[i]}06` }}>
        <span style={{ fontFamily:'monospace', fontSize:16, fontWeight:900, color:NC2[i], textShadow:`0 0 8px ${NC2[i]}`, minWidth:24 }}>{String(r.rank).padStart(2,'0')}</span>
        <span style={{ flex:1, fontSize:12, color:'#d0d0ff', fontFamily:'monospace' }}>{r.name}</span>
        <span style={{ fontSize:12, fontWeight:700, color:NC2[i], fontFamily:'monospace' }}>{r.score}</span>
        <D v={r.delta}/>
        <span style={{ fontSize:10, color:NC2[i]+'99', fontFamily:'monospace' }}>{r.pred}</span>
      </div>
    ))}
  </div>
);

/* ─── 3. זכוכית ─── */
const S3 = () => (
  <div style={{ background:'linear-gradient(135deg,#1e3a5f,#0f2027)', borderRadius:16, padding:16, maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => (
      <div key={r.rank} style={{ marginBottom:8, borderRadius:12, border:'1px solid rgba(255,255,255,.18)', background:'rgba(255,255,255,.07)', backdropFilter:'blur(12px)', padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:14, fontWeight:800, color:'rgba(255,255,255,.3)', minWidth:20 }}>{r.rank}</span>
        <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#fff' }}>{r.name}</span>
        <span style={{ fontSize:12, fontWeight:700, color:'#a5f3fc' }}>{r.score}</span>
        <D v={r.delta}/>
        <span style={{ fontSize:10, color:'#93c5fd', fontFamily:'monospace' }}>{r.pred}</span>
      </div>
    ))}
  </div>
);

/* ─── 4. גביע זהב ─── */
const S4 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => {
      const isTop = r.rank<=3;
      const grad = r.rank===1 ? 'linear-gradient(135deg,#f59e0b,#fde68a,#b45309)' : r.rank===2 ? 'linear-gradient(135deg,#9ca3af,#e5e7eb,#6b7280)' : r.rank===3 ? 'linear-gradient(135deg,#b45309,#fbbf24,#92400e)' : 'none';
      return (
        <div key={r.rank} style={{ marginBottom:8, borderRadius:10, padding:isTop?'2px':0, background:isTop?grad:'transparent', boxShadow:r.rank===1?'0 4px 20px rgba(245,158,11,.4)':r.rank<=3?'0 2px 12px rgba(0,0,0,.3)':'none' }}>
          <div style={{ borderRadius:isTop?8:10, background:r.rank<=3?'#0f172a':'rgba(30,41,59,.8)', border:isTop?'none':'1px solid #1e293b', padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
            {r.rank<=3 ? <span style={{ fontSize:18 }}>{r.rank===1?'🥇':r.rank===2?'🥈':'🥉'}</span> : <span style={{ fontSize:14, fontWeight:800, color:'#475569', minWidth:20, textAlign:'center' }}>{r.rank}</span>}
            <span style={{ flex:1, fontSize:12, fontWeight:600, color:isTop?'#fde68a':'#94a3b8' }}>{r.name}</span>
            <span style={{ fontSize:12, fontWeight:800, color:isTop?'#fbbf24':'#64748b' }}>{r.score}</span>
            <D v={r.delta}/>
          </div>
        </div>
      );
    })}
  </div>
);

/* ─── 5. לוח LED ─── */
const S5 = () => (
  <div style={{ background:'#001200', borderRadius:8, padding:12, maxWidth:360, margin:'0 auto', fontFamily:'"Courier New",monospace', border:'3px solid #003300', boxShadow:'0 0 30px rgba(0,255,0,.15) inset' }} dir="rtl">
    <div style={{ color:'#00cc00', fontSize:9, letterSpacing:2, marginBottom:12, textAlign:'center', opacity:.6 }}>▶ LIVE STANDINGS ◀</div>
    {MOCK.map(r => (
      <div key={r.rank} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 4px', borderBottom:'1px solid #001f00', color:r.rank===1?'#00ff44':'#00aa00' }}>
        <span style={{ fontSize:13, fontWeight:900, minWidth:20, color:r.rank===1?'#ffff00':'#00cc00' }}>{r.rank}</span>
        <span style={{ flex:1, fontSize:11, letterSpacing:1 }}>{r.name}</span>
        <span style={{ fontSize:13, fontWeight:700, color:r.rank===1?'#ffff00':'#00ff44' }}>{r.score}</span>
        <span style={{ fontSize:9, color:'#006600' }}>[{r.pred}]</span>
      </div>
    ))}
  </div>
);

/* ─── 6. כרטיס משחק ─── */
const S6 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => (
      <div key={r.rank} style={{ marginBottom:8, borderRadius:8, background:r.rank<=3?'linear-gradient(135deg,#1e1b4b,#312e81)':'#1e293b', border:'1px solid rgba(99,102,241,.3)', display:'flex', overflow:'hidden', boxShadow:'2px 2px 8px rgba(0,0,0,.4)' }}>
        <div style={{ background:r.rank<=3?'linear-gradient(180deg,#4f46e5,#6366f1)':'#334155', width:44, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, flexDirection:'column', gap:2 }}>
          <span style={{ fontSize:16, fontWeight:900, color:r.rank<=3?'#fde68a':'#94a3b8' }}>{r.rank}</span>
          <span style={{ fontSize:7, color:'rgba(255,255,255,.4)', letterSpacing:1 }}>RANK</span>
        </div>
        <div style={{ flex:1, padding:'10px 12px', borderLeft:'2px dashed rgba(255,255,255,.12)', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{r.name}</span>
          <span style={{ fontSize:11, fontWeight:700, color:'#a5b4fc' }}>{r.score}</span>
          <D v={r.delta}/>
          <span style={{ fontSize:10, color:'#7dd3fc', fontFamily:'monospace' }}>{r.pred}</span>
        </div>
      </div>
    ))}
  </div>
);

/* ─── 7. מגרש כדורגל ─── */
const S7 = () => (
  <div style={{ background:'linear-gradient(180deg,#14532d,#166534,#15803d)', borderRadius:12, padding:16, maxWidth:340, margin:'0 auto', border:'3px solid rgba(255,255,255,.15)' }} dir="rtl">
    {MOCK.map(r => (
      <div key={r.rank} style={{ marginBottom:6, borderRadius:6, background:'rgba(0,0,0,.35)', border:'1px solid rgba(255,255,255,.15)', padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontSize:11, fontWeight:800, color:'#fff' }}>{r.rank}</span>
        </div>
        <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#dcfce7' }}>{r.name}</span>
        <span style={{ fontSize:12, fontWeight:700, color:'#bbf7d0' }}>{r.score}</span>
        <D v={r.delta}/>
        <span style={{ fontSize:10, color:'#86efac', fontFamily:'monospace' }}>{r.pred}</span>
      </div>
    ))}
  </div>
);

/* ─── 8. הולוגרפי ─── */
const HOLO = [
  'linear-gradient(135deg,#ff6b6b,#ffd93d)',
  'linear-gradient(135deg,#6bcbff,#a855f7)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
];
const S8 = () => (
  <div style={{ background:'#0f0f1a', borderRadius:12, padding:16, maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ marginBottom:8, borderRadius:10, padding:'2px', background:HOLO[i], boxShadow:'0 4px 15px rgba(0,0,0,.4)' }}>
        <div style={{ borderRadius:8, background:'#0f0f1a', padding:'11px 14px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:14, fontWeight:900, minWidth:20, background:HOLO[i], WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{r.rank}</span>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{r.name}</span>
          <span style={{ fontSize:12, fontWeight:700, background:HOLO[i], WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{r.score}</span>
          <D v={r.delta}/>
          <span style={{ fontSize:10, color:'#94a3b8', fontFamily:'monospace' }}>{r.pred}</span>
        </div>
      </div>
    ))}
  </div>
);

/* ─── 9. מספר ענק ─── */
const S9 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => (
      <div key={r.rank} style={{ marginBottom:8, borderRadius:10, background:'#0f172a', border:'1px solid #1e293b', padding:'10px 16px', display:'flex', alignItems:'center', gap:8, overflow:'hidden', position:'relative' }}>
        <span style={{ position:'absolute', right:-8, top:'50%', transform:'translateY(-50%)', fontSize:72, fontWeight:900, color:r.rank<=3?MC[r.rank-1]:'#1e293b', opacity:r.rank<=3?.25:.4, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>{r.rank}</span>
        <div style={{ flex:1, zIndex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>{r.name}</div>
          <div style={{ fontSize:10, color:'#64748b', marginTop:2 }}>ניחוש: <span style={{ color:'#7dd3fc' }}>{r.pred}</span></div>
        </div>
        <span style={{ fontSize:14, fontWeight:800, color:'#34d399', zIndex:1 }}>{r.score}</span>
        <D v={r.delta}/>
      </div>
    ))}
  </div>
);

/* ─── 10. סיבי פחמן ─── */
const S10 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => (
      <div key={r.rank} style={{ marginBottom:6, borderRadius:8, border:`1px solid ${r.rank<=3?MC[r.rank-1]+'44':'#334155'}`, background:'repeating-linear-gradient(45deg,#0f1117,#0f1117 2px,#111827 2px,#111827 4px)', padding:'11px 14px', display:'flex', alignItems:'center', gap:10, boxShadow:r.rank===1?'0 0 12px rgba(245,158,11,.25)':'none' }}>
        <span style={{ fontSize:13, fontWeight:900, color:r.rank<=3?MC[r.rank-1]:'#475569', minWidth:22, fontFamily:'monospace' }}>#{r.rank}</span>
        <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#cbd5e1' }}>{r.name}</span>
        <span style={{ fontSize:12, fontWeight:700, color:'#94a3b8' }}>{r.score}</span>
        <D v={r.delta}/>
        <span style={{ fontSize:10, color:'#475569', fontFamily:'monospace' }}>{r.pred}</span>
      </div>
    ))}
  </div>
);

/* ─── 11. מינימליסטי ─── */
const S11 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', background:'#f8fafc', borderRadius:12, padding:'8px 16px' }} dir="rtl">
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ padding:'12px 0', borderBottom:i<MOCK.length-1?'1px solid #e2e8f0':'none', display:'flex', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:11, fontWeight:700, color:'#94a3b8', minWidth:20 }}>{r.rank}</span>
        <span style={{ flex:1, fontSize:13, fontWeight:600, color:'#0f172a' }}>{r.name}</span>
        <span style={{ fontSize:13, fontWeight:800, color:'#0f172a' }}>{r.score}</span>
        <D v={r.delta} s={10}/>
        <span style={{ fontSize:10, color:'#94a3b8', fontFamily:'monospace' }}>{r.pred}</span>
      </div>
    ))}
  </div>
);

/* ─── 12. פודיום גלו ─── */
const S12 = () => (
  <div style={{ background:'#070718', borderRadius:16, padding:16, maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => {
      const glow = r.rank<=3 ? MC[r.rank-1] : null;
      return (
        <div key={r.rank} style={{ marginBottom:8, borderRadius:10, background:glow?`radial-gradient(ellipse at right,${glow}22 0%,transparent 70%),#0f0f1f`:'#0f0f1f', border:`1px solid ${glow||'#1e293b'}`, boxShadow:glow?`0 0 20px ${glow}33,inset 0 0 30px ${glow}08`:'none', padding:'12px 16px', display:'flex', alignItems:'center', gap:10, transform:r.rank===1?'scale(1.03)':'scale(1)' }}>
          <span style={{ fontSize:14, fontWeight:900, color:glow||'#334155', minWidth:22, textShadow:glow?`0 0 10px ${glow}`:'none' }}>{r.rank}</span>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:glow?'#fde68a':'#64748b' }}>{r.name}</span>
          <span style={{ fontSize:12, fontWeight:700, color:glow||'#475569' }}>{r.score}</span>
          <D v={r.delta}/>
        </div>
      );
    })}
  </div>
);

/* ─── 13. רטרו טרמינל ─── */
const S13 = () => (
  <div style={{ background:'#0d0d00', borderRadius:8, padding:16, maxWidth:360, margin:'0 auto', fontFamily:'"Courier New",monospace', border:'2px solid #333300' }} dir="rtl">
    <div style={{ color:'#aaaa00', fontSize:9, marginBottom:10, letterSpacing:2 }}>█ WORLD CUP 2026 STANDINGS █</div>
    {MOCK.map(r => (
      <div key={r.rank} style={{ display:'flex', gap:8, padding:'5px 0', borderBottom:'1px solid #1a1a00', color:r.rank===1?'#ffff00':'#888800' }}>
        <span style={{ minWidth:20, fontSize:12 }}>{r.rank}.</span>
        <span style={{ flex:1, fontSize:11 }}>{r.name}</span>
        <span style={{ fontSize:12, fontWeight:700 }}>{r.score}pts</span>
        <span style={{ fontSize:10, color:'#555500' }}>[{r.pred}]</span>
      </div>
    ))}
    <div style={{ color:'#333300', fontSize:9, marginTop:10 }}>■ LAST UPDATE: LIVE ■</div>
  </div>
);

/* ─── 14. גופייה ─── */
const JC = [['#dc2626','#b91c1c'],['#1d4ed8','#1e40af'],['#15803d','#166534'],['#7c3aed','#6d28d9'],['#d97706','#b45309'],['#0891b2','#0e7490']];
const S14 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ marginBottom:8, borderRadius:10, overflow:'hidden', display:'flex', boxShadow:'0 2px 8px rgba(0,0,0,.4)' }}>
        <div style={{ background:`repeating-linear-gradient(0deg,${JC[i][0]} 0px,${JC[i][0]} 4px,${JC[i][1]} 4px,${JC[i][1]} 8px)`, width:56, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{r.rank}</span>
          </div>
        </div>
        <div style={{ flex:1, background:'#1e293b', padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{r.name}</span>
          <span style={{ fontSize:12, fontWeight:700, color:'#34d399' }}>{r.score}</span>
          <D v={r.delta}/>
          <span style={{ fontSize:10, color:'#7dd3fc', fontFamily:'monospace' }}>{r.pred}</span>
        </div>
      </div>
    ))}
  </div>
);

/* ─── 15. אלכסוני ─── */
const S15 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => {
      const c = r.rank<=3 ? MC[r.rank-1] : '#334155';
      return (
        <div key={r.rank} style={{ marginBottom:8, borderRadius:10, overflow:'hidden', position:'relative', height:52, display:'flex', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,.4)', background:'#0f172a' }}>
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'40%', background:c, clipPath:'polygon(20% 0,100% 0,100% 100%,0 100%)', opacity:.12 }}/>
          <div style={{ position:'relative', width:52, textAlign:'center', flexShrink:0 }}>
            <span style={{ fontSize:18, fontWeight:900, color:c }}>{r.rank}</span>
          </div>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#e2e8f0', position:'relative' }}>{r.name}</span>
          <span style={{ fontSize:12, fontWeight:700, color:'#34d399', position:'relative', marginLeft:8 }}>{r.score}</span>
          <div style={{ position:'relative', marginLeft:8, marginRight:14 }}><D v={r.delta}/></div>
        </div>
      );
    })}
  </div>
);

/* ─── 16. פס ניקוד ─── */
const MAX_S = MOCK[0].score;
const S16 = () => (
  <div style={{ maxWidth:360, margin:'0 auto', background:'#0f172a', borderRadius:12, padding:16 }} dir="rtl">
    {MOCK.map(r => {
      const pct = (r.score/MAX_S*100).toFixed(1);
      const c = r.rank<=3 ? MC[r.rank-1] : '#3b82f6';
      return (
        <div key={r.rank} style={{ marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:11, color:c, fontWeight:700, minWidth:16 }}>{r.rank}</span>
              <span style={{ fontSize:12, color:'#e2e8f0', fontWeight:600 }}>{r.name}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <D v={r.delta}/>
              <span style={{ fontSize:12, fontWeight:700, color:c }}>{r.score}</span>
            </div>
          </div>
          <div style={{ height:6, background:'#1e293b', borderRadius:99 }}>
            <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${c},${c}88)`, borderRadius:99 }}/>
          </div>
        </div>
      );
    })}
  </div>
);

/* ─── 17. עיתון ─── */
const S17 = () => (
  <div style={{ maxWidth:360, margin:'0 auto', background:'#fafaf7', borderRadius:8, padding:'16px 20px', border:'1px solid #d1d5db' }} dir="rtl">
    <div style={{ borderBottom:'3px solid #111', marginBottom:12, paddingBottom:6, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
      <span style={{ fontSize:13, fontWeight:900, color:'#111', letterSpacing:-0.5 }}>WORLD CUP 2026 — STANDINGS</span>
      <span style={{ fontSize:9, color:'#6b7280', letterSpacing:1 }}>LIVE</span>
    </div>
    {MOCK.map((r,i) => (
      <div key={r.rank} style={{ display:'flex', alignItems:'baseline', gap:10, padding:'7px 0', borderBottom:i<MOCK.length-1?'1px solid #e5e7eb':'none' }}>
        <span style={{ fontSize:20, fontWeight:900, color:r.rank===1?'#111':'#9ca3af', minWidth:28, lineHeight:1 }}>{r.rank}</span>
        <span style={{ flex:1, fontSize:13, color:'#111', fontWeight:r.rank===1?700:400 }}>{r.name}</span>
        <span style={{ fontSize:13, fontWeight:700, color:'#111' }}>{r.score}</span>
        <D v={r.delta} s={10}/>
        <span style={{ fontSize:10, color:'#6b7280', fontFamily:'monospace' }}>{r.pred}</span>
      </div>
    ))}
  </div>
);

/* ─── 18. בועות ─── */
const S18 = () => (
  <div style={{ maxWidth:380, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }} dir="rtl">
    {MOCK.map(r => {
      const c = r.rank<=3 ? MC[r.rank-1] : '#334155';
      const bg = r.rank<=3 ? MB[r.rank-1] : 'rgba(30,41,59,.5)';
      return (
        <div key={r.rank} style={{ borderRadius:'50%', aspectRatio:'1', border:`2px solid ${c}`, background:bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, boxShadow:r.rank<=3?`0 0 16px ${c}33`:'none', padding:8 }}>
          <span style={{ fontSize:18, fontWeight:900, color:c }}>{r.rank}</span>
          <span style={{ fontSize:9, color:'#e2e8f0', fontWeight:600, textAlign:'center', lineHeight:1.2 }}>{r.name}</span>
          <span style={{ fontSize:10, fontWeight:700, color:'#34d399' }}>{r.score}</span>
        </div>
      );
    })}
  </div>
);

/* ─── 19. פרמיום כהה ─── */
const S19 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => (
      <div key={r.rank} style={{ marginBottom:6, borderRadius:6, background:'#090912', border:`1px solid ${r.rank===1?'rgba(245,158,11,.5)':r.rank<=3?'rgba(245,158,11,.2)':'rgba(255,255,255,.04)'}`, padding:'13px 18px', display:'flex', alignItems:'center', gap:12, boxShadow:r.rank===1?'0 1px 0 rgba(245,158,11,.3) inset,0 4px 20px rgba(0,0,0,.6)':'0 4px 20px rgba(0,0,0,.6)' }}>
        <span style={{ fontSize:11, fontWeight:700, color:r.rank<=3?'#f59e0b':'#374151', minWidth:22, letterSpacing:1 }}>{String(r.rank).padStart(2,'0')}</span>
        <div style={{ width:1, height:20, background:r.rank<=3?'rgba(245,158,11,.3)':'rgba(255,255,255,.06)', flexShrink:0 }}/>
        <span style={{ flex:1, fontSize:12, fontWeight:500, color:r.rank<=3?'#fde68a':'#6b7280' }}>{r.name}</span>
        <span style={{ fontSize:13, fontWeight:700, color:r.rank<=3?'#f59e0b':'#374151' }}>{r.score}</span>
        <D v={r.delta}/>
      </div>
    ))}
  </div>
);

/* ─── 20. צף עמוק ─── */
const S20 = () => (
  <div style={{ maxWidth:340, margin:'0 auto', padding:'8px 4px' }} dir="rtl">
    {MOCK.map(r => {
      const c = r.rank<=3 ? MC[r.rank-1] : '#6366f1';
      return (
        <div key={r.rank} style={{ marginBottom:12, borderRadius:14, background:'linear-gradient(135deg,#1e293b,#0f172a)', padding:'14px 18px', display:'flex', alignItems:'center', gap:12, boxShadow:`0 8px 24px rgba(0,0,0,.5),0 2px 0 ${c}44 inset`, transform:r.rank===1?'translateY(-4px)':'none' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${c},${c}88)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 12px ${c}44` }}>
            <span style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{r.rank}</span>
          </div>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{r.name}</span>
          <span style={{ fontSize:13, fontWeight:800, color:c }}>{r.score}</span>
          <D v={r.delta}/>
          <span style={{ fontSize:10, color:'#7dd3fc', fontFamily:'monospace' }}>{r.pred}</span>
        </div>
      );
    })}
  </div>
);

/* ─── 21. ציר זמן ─── */
const S21 = () => (
  <div style={{ maxWidth:400, margin:'0 auto', position:'relative', padding:'0 16px' }} dir="ltr">
    <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:2, background:'linear-gradient(180deg,#f59e0b,#3b82f6)', opacity:.3 }}/>
    {MOCK.map((r,i) => {
      const isLeft = i%2===0;
      const c = r.rank<=3 ? MC[r.rank-1] : '#3b82f6';
      return (
        <div key={r.rank} style={{ display:'flex', justifyContent:isLeft?'flex-start':'flex-end', marginBottom:14, position:'relative' }}>
          <div style={{ position:'absolute', left:'calc(50% - 8px)', top:'50%', transform:'translateY(-50%)', width:16, height:16, borderRadius:'50%', background:c, border:'2px solid #0f172a', zIndex:1, boxShadow:`0 0 8px ${c}88` }}/>
          <div style={{ width:'42%', borderRadius:10, background:'#1e293b', border:`1px solid ${c}44`, padding:'10px 12px', marginLeft:isLeft?0:'8%', marginRight:isLeft?'8%':0 }}>
            <div style={{ fontSize:10, color:c, fontWeight:700 }}>#{r.rank}</div>
            <div style={{ fontSize:11, color:'#e2e8f0', fontWeight:600 }}>{r.name}</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:2 }}>
              <span style={{ fontSize:11, color:'#34d399', fontWeight:700 }}>{r.score}</span>
              <D v={r.delta} s={10}/>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

/* ─── 22. פודיום ─── */
const S22 = () => (
  <div style={{ maxWidth:380, margin:'0 auto' }} dir="rtl">
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:4, marginBottom:16, height:150 }}>
      {[MOCK[1],MOCK[0],MOCK[2]].map((r,pi) => {
        const heights=[100,150,80], colors=['#9ca3af','#f59e0b','#b45309'];
        return (
          <div key={r.rank} style={{ width:90, height:heights[pi], background:`linear-gradient(180deg,${colors[pi]}33,${colors[pi]}11)`, border:`2px solid ${colors[pi]}`, borderRadius:'8px 8px 0 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', padding:'10px 6px 0' }}>
            <span style={{ fontSize:22 }}>{r.rank===1?'🥇':r.rank===2?'🥈':'🥉'}</span>
            <span style={{ fontSize:10, color:'#e2e8f0', fontWeight:600, textAlign:'center', marginTop:4, lineHeight:1.2 }}>{r.name}</span>
            <span style={{ fontSize:12, color:colors[pi], fontWeight:800, marginTop:4 }}>{r.score}</span>
          </div>
        );
      })}
    </div>
    {MOCK.slice(3).map(r => (
      <div key={r.rank} style={{ marginBottom:6, background:'#1e293b', borderRadius:8, padding:'8px 14px', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:12, color:'#475569', minWidth:20, fontWeight:700 }}>{r.rank}</span>
        <span style={{ flex:1, fontSize:12, color:'#94a3b8' }}>{r.name}</span>
        <span style={{ fontSize:12, color:'#64748b', fontWeight:700 }}>{r.score}</span>
        <D v={r.delta}/>
      </div>
    ))}
  </div>
);

/* ─── 23. מסגרת בלבד ─── */
const S23 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map(r => {
      const c = r.rank<=3 ? MC[r.rank-1] : '#475569';
      return (
        <div key={r.rank} style={{ marginBottom:8, borderRadius:8, border:`2px solid ${c}`, padding:'11px 16px', display:'flex', alignItems:'center', gap:10, background:'transparent' }}>
          <span style={{ fontSize:13, fontWeight:900, color:c, minWidth:24 }}>[{r.rank}]</span>
          <span style={{ flex:1, fontSize:12, fontWeight:500, color:c }}>{r.name}</span>
          <span style={{ fontSize:13, fontWeight:700, color:c }}>{r.score}</span>
          <D v={r.delta}/>
          <span style={{ fontSize:10, color:c+'99', fontFamily:'monospace' }}>{r.pred}</span>
        </div>
      );
    })}
  </div>
);

/* ─── 24. קשת צבעים ─── */
const S24 = () => (
  <div style={{ maxWidth:340, margin:'0 auto' }} dir="rtl">
    {MOCK.map((r,i) => {
      const hue = 190+i*28;
      return (
        <div key={r.rank} style={{ marginBottom:6, borderRadius:10, background:`hsl(${hue},60%,13%)`, border:`1px solid hsl(${hue},70%,32%)`, padding:'11px 16px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:14, fontWeight:900, color:`hsl(${hue},90%,62%)`, minWidth:22 }}>{r.rank}</span>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:`hsl(${hue},40%,82%)` }}>{r.name}</span>
          <span style={{ fontSize:12, fontWeight:700, color:`hsl(${hue},90%,62%)` }}>{r.score}</span>
          <D v={r.delta}/>
          <span style={{ fontSize:10, color:`hsl(${hue},50%,55%)`, fontFamily:'monospace' }}>{r.pred}</span>
        </div>
      );
    })}
  </div>
);

/* ─── 25. מונדיאל ─── */
const S25 = () => (
  <div style={{ background:'linear-gradient(180deg,#0a0e1a,#0d1226,#0a0e1a)', borderRadius:16, padding:16, maxWidth:360, margin:'0 auto', border:'1px solid rgba(245,197,24,.2)', boxShadow:'0 0 40px rgba(245,197,24,.05) inset' }} dir="rtl">
    <div style={{ textAlign:'center', marginBottom:14 }}>
      <span style={{ fontSize:22 }}>🏆</span>
      <span style={{ display:'block', fontSize:9, color:'#f5c518', letterSpacing:3, fontWeight:700, marginTop:2 }}>FIFA WORLD CUP 2026</span>
    </div>
    {MOCK.map(r => {
      const c = r.rank===1?'#f5c518':r.rank===2?'#d1d5db':r.rank===3?'#cd7f32':'#334155';
      const sym = r.rank===1?'★':r.rank===2?'✦':r.rank===3?'◆':r.rank;
      return (
        <div key={r.rank} style={{ marginBottom:6, borderRadius:8, background:r.rank===1?'linear-gradient(135deg,rgba(245,197,24,.15),rgba(245,197,24,.05))':'rgba(255,255,255,.03)', border:`1px solid ${r.rank<=3?c+'44':'rgba(255,255,255,.05)'}`, padding:'11px 16px', display:'flex', alignItems:'center', gap:10, boxShadow:r.rank===1?'0 0 20px rgba(245,197,24,.15)':'none' }}>
          <span style={{ fontSize:14, fontWeight:900, color:c, minWidth:22, textShadow:r.rank===1?'0 0 10px #f5c51888':'none' }}>{sym}</span>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:r.rank===1?'#fde68a':r.rank<=3?'#e2e8f0':'#64748b' }}>{r.name}</span>
          <span style={{ fontSize:13, fontWeight:800, color:c }}>{r.score}</span>
          <D v={r.delta}/>
          <span style={{ fontSize:10, color:'#7dd3fc', fontFamily:'monospace' }}>{r.pred}</span>
        </div>
      );
    })}
  </div>
);

/* ─── metadata ─── */
const STYLES = [
  { id:1,  label:'פרלוגרמה',    sub:'נוכחי',          C:S1  },
  { id:2,  label:'ניאון סייבר', sub:'Cyberpunk',       C:S2  },
  { id:3,  label:'זכוכית',      sub:'Glassmorphism',   C:S3  },
  { id:4,  label:'גביע זהב',    sub:'Trophy medals',   C:S4  },
  { id:5,  label:'לוח LED',     sub:'Scoreboard',      C:S5  },
  { id:6,  label:'כרטיס משחק',  sub:'Match ticket',    C:S6  },
  { id:7,  label:'מגרש',        sub:'Football pitch',  C:S7  },
  { id:8,  label:'הולוגרפי',    sub:'Holographic',     C:S8  },
  { id:9,  label:'מספר ענק',    sub:'Big number',      C:S9  },
  { id:10, label:'סיבי פחמן',   sub:'Carbon fiber',    C:S10 },
  { id:11, label:'מינימליסטי',  sub:'Minimal',         C:S11 },
  { id:12, label:'פודיום גלו',  sub:'Neon podium',     C:S12 },
  { id:13, label:'רטרו טרמינל', sub:'Retro terminal',  C:S13 },
  { id:14, label:'גופייה',      sub:'Jersey stripes',  C:S14 },
  { id:15, label:'אלכסוני',     sub:'Diagonal split',  C:S15 },
  { id:16, label:'פס ניקוד',    sub:'Progress bars',   C:S16 },
  { id:17, label:'עיתון',       sub:'Editorial',       C:S17 },
  { id:18, label:'בועות',       sub:'Bubble grid',     C:S18 },
  { id:19, label:'פרמיום כהה',  sub:'Dark premium',    C:S19 },
  { id:20, label:'צף עמוק',     sub:'Floating depth',  C:S20 },
  { id:21, label:'ציר זמן',     sub:'Timeline',        C:S21 },
  { id:22, label:'פודיום',      sub:'Podium stage',    C:S22 },
  { id:23, label:'מסגרת בלבד',  sub:'Wireframe',       C:S23 },
  { id:24, label:'קשת צבעים',   sub:'Rainbow sweep',   C:S24 },
  { id:25, label:'מונדיאל',     sub:'WC Official',     C:S25 },
];

export default function AdminLBStylesDemo() {
  const [sel, setSel] = useState(1);
  const found = STYLES.find(s => s.id === sel);
  const Comp = found.C;

  return (
    <div style={{ minHeight:'100vh', background:'#0a0f1e', color:'#e2e8f0', padding:24 }} dir="rtl">
      <h2 style={{ fontSize:18, fontWeight:700, marginBottom:4, color:'#f8fafc' }}>25 עיצובי לוח חי — דמו</h2>
      <p style={{ fontSize:11, color:'#64748b', marginBottom:20 }}>בחר סגנון לתצוגה מקדימה</p>

      {/* picker grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, marginBottom:28, maxWidth:580 }}>
        {STYLES.map(s => (
          <button key={s.id} onClick={() => setSel(s.id)}
            style={{ padding:'7px 4px', borderRadius:8, border:`1px solid ${sel===s.id?'#f5c518':'#1e293b'}`, background:sel===s.id?'rgba(245,197,24,.12)':'#1e293b', color:sel===s.id?'#f5c518':'#64748b', fontSize:10, fontWeight:600, cursor:'pointer', lineHeight:1.3, transition:'all .15s' }}>
            <div style={{ fontSize:12, color:sel===s.id?'#f5c518':'#475569', fontWeight:800 }}>{s.id}</div>
            {s.label}
          </button>
        ))}
      </div>

      {/* preview */}
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
