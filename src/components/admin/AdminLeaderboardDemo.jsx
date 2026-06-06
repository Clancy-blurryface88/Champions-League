import React, { useState } from 'react';

const mockPlayers = [
  { rank: 1, name: 'שחקן 2', pts: 165.55 },
  { rank: 2, name: 'שחקן 4', pts: 122.50 },
  { rank: 3, name: 'שחקן 1', pts: 97.00 },
  { rank: 4, name: 'שחקן 3', pts: 89.35 },
  { rank: 5, name: 'שחקן 5', pts: 68.55 },
];

const gold = '#FFD700';
const silver = '#C0C0C0';
const bronze = '#CD7F32';
const green = '#34C759';

const rc = r => r === 1 ? gold : r === 2 ? silver : r === 3 ? bronze : 'rgba(255,255,255,0.45)';
const rb = r => r === 1 ? 'rgba(255,215,0,0.13)' : r === 2 ? 'rgba(192,192,192,0.09)' : r === 3 ? 'rgba(205,127,50,0.13)' : 'rgba(255,255,255,0.04)';
const top = r => r <= 3;

// ─── CSS animations injected once ────────────────────────────────────────────
const css = `
@keyframes lb-pulse { 0%,100%{box-shadow:0 0 6px 2px var(--gc)} 50%{box-shadow:0 0 18px 6px var(--gc)} }
@keyframes lb-spin { to{transform:rotate(360deg)} }
@keyframes lb-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes lb-slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
`;

const designs = [

  // ── 1. Full Pill Capsule ──────────────────────────────────────────────────
  {
    id: 1, name: 'Full Pill Capsule', desc: 'כמוסה עגולה מלאה',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ display:'flex', alignItems:'center', gap:12, background: rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderRadius:999, padding:'10px 16px', marginBottom:8 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 2. Parallelogram Skew ─────────────────────────────────────────────────
  {
    id: 2, name: 'Parallelogram', desc: 'מקבילית משוכה - דינאמי',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ transform:'skewX(-6deg)', background: rb(p.rank), border:`1px solid ${rc(p.rank)}55`, borderRadius:6, padding:'10px 18px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ transform:'skewX(6deg)', color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ transform:'skewX(6deg)', flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 3. Cut Corner (top-right) ─────────────────────────────────────────────
  {
    id: 3, name: 'Cut Corner', desc: 'פינה חתוכה אלכסונית',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ clipPath:'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)', background: top(p.rank) ? rb(p.rank) : 'rgba(255,255,255,0.04)', border:`1px solid ${rc(p.rank)}44`, borderRadius:6, padding:'10px 18px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 4. Right Arrow Chevron ────────────────────────────────────────────────
  {
    id: 4, name: 'Arrow Chevron', desc: 'חץ ימינה — תנועה וכיוון',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ clipPath:'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)', background: rb(p.rank), borderRadius:4, padding:'10px 28px 10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, outline:`1px solid ${rc(p.rank)}33` }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20 }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 5. Neon Glow ──────────────────────────────────────────────────────────
  {
    id: 5, name: 'Neon Glow', desc: 'זוהר ניאון סייברפאנק',
    bg: '#050510',
    render(p) {
      const c = rc(p.rank);
      return (
        <div style={{ background:'rgba(0,0,0,0.7)', border:`1px solid ${c}`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow:`0 0 ${top(p.rank)?12:4}px ${c}${top(p.rank)?'88':'22'}, inset 0 0 8px ${c}11` }}>
          <span style={{ color:c, fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', textShadow:`0 0 8px ${c}` }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#e0e0ff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#00ff88', fontWeight:700, fontSize:11, textShadow:'0 0 6px #00ff88' }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 6. Liquid Glass ───────────────────────────────────────────────────────
  {
    id: 6, name: 'Liquid Glass', desc: 'זכוכית נוזלית — Apple style',
    bg: 'linear-gradient(135deg,#1a2a4a,#0d1f3c)',
    render(p) {
      return (
        <div style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(20px) saturate(180%)', WebkitBackdropFilter:'blur(20px) saturate(180%)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:14, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow:'0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)' }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'rgba(255,255,255,0.9)', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#5AC8FA', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 7. Metallic Podium ────────────────────────────────────────────────────
  {
    id: 7, name: 'Metallic Podium', desc: 'מתכת — זהב/כסף/ארד לשלושת הראשונים',
    bg: '#111',
    render(p) {
      const grad = p.rank===1
        ? 'linear-gradient(135deg,#BF953F,#FCF6BA,#B38728,#FBF5B7,#AA771C)'
        : p.rank===2
        ? 'linear-gradient(135deg,#8e9eab,#eef2f3,#8e9eab)'
        : p.rank===3
        ? 'linear-gradient(135deg,#8B4513,#CD7F32,#8B4513,#E8974A,#8B4513)'
        : 'rgba(255,255,255,0.05)';
      return (
        <div style={{ background:top(p.rank)?grad:'rgba(255,255,255,0.05)', border:top(p.rank)?'none':'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color: top(p.rank)?'#1a1a1a':'rgba(255,255,255,0.4)', fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:top(p.rank)?'#1a1a1a':'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:top(p.rank)?'#2a5a1a':'#34C759', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 8. Ghost Rank Number ──────────────────────────────────────────────────
  {
    id: 8, name: 'Ghost Rank', desc: 'מספר דירוג ענק ברקע כרוח',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ position:'relative', overflow:'hidden', background: rb(p.rank), border:`1px solid ${rc(p.rank)}33`, borderRadius:12, padding:'12px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', fontSize:56, fontWeight:900, color:rc(p.rank), opacity:0.10, lineHeight:1, userSelect:'none' }}>{p.rank}</span>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', position:'relative' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center', position:'relative' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 9. Left Color Bar ─────────────────────────────────────────────────────
  {
    id: 9, name: 'Left Accent Bar', desc: 'פס צבעוני שמאלי בלבד',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.04)', borderRadius:'0 10px 10px 0', borderLeft:`4px solid ${rc(p.rank)}`, padding:'10px 16px', marginBottom:8 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1 }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 10. Progress Fill Bar ─────────────────────────────────────────────────
  {
    id: 10, name: 'Progress Fill', desc: 'מילוי רוחב לפי ניקוד',
    bg: '#0d1117',
    render(p) {
      const pct = Math.round((p.pts / mockPlayers[0].pts) * 100);
      return (
        <div style={{ position:'relative', overflow:'hidden', background:'rgba(255,255,255,0.05)', border:`1px solid ${rc(p.rank)}33`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${pct}%`, background:`${rc(p.rank)}14`, transition:'width 0.6s ease' }} />
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', position:'relative' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center', position:'relative' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
          <span style={{ color:rc(p.rank), fontSize:10, fontWeight:700, position:'relative' }}>{pct}%</span>
        </div>
      );
    }
  },

  // ── 11. Medal Circle Badge ────────────────────────────────────────────────
  {
    id: 11, name: 'Medal Badge Overlap', desc: 'עיגול מדליה חופף שמאל',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ position:'relative', marginLeft:20, marginBottom:8 }}>
          <div style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${rc(p.rank)}33`, borderRadius:12, padding:'10px 16px 10px 36px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
              <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
            </div>
          </div>
          <div style={{ position:'absolute', left:-20, top:'50%', transform:'translateY(-50%)', width:40, height:40, borderRadius:'50%', background:rb(p.rank), border:`2px solid ${rc(p.rank)}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:15 }}>{p.rank}</span>
          </div>
        </div>
      );
    }
  },

  // ── 12. Horizontal Split ──────────────────────────────────────────────────
  {
    id: 12, name: 'Vertical Split', desc: 'שני חצאים: כהה + צבע',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ display:'flex', borderRadius:12, overflow:'hidden', marginBottom:8, border:`1px solid ${rc(p.rank)}33` }}>
          <div style={{ width:44, background:top(p.rank)?rb(p.rank):'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', borderRight:`1px solid ${rc(p.rank)}33` }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:18 }}>{p.rank}</span>
          </div>
          <div style={{ flex:1, background:'rgba(255,255,255,0.03)', padding:'10px 16px', textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 13. Carbon Fiber Dark ─────────────────────────────────────────────────
  {
    id: 13, name: 'Carbon Fiber', desc: 'טקסטורת סיבי פחמן כהה',
    bg: '#080808',
    render(p) {
      return (
        <div style={{ background:`repeating-linear-gradient(45deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 6px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 6px),#0a0a0a`, border:`1px solid ${rc(p.rank)}44`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#e8e8e8', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#4CAF50', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 14. Holographic / Iridescent ──────────────────────────────────────────
  {
    id: 14, name: 'Holographic', desc: 'הולוגרפי — ססגוניות קשת',
    bg: '#0a0a14',
    render(p) {
      const holo = `linear-gradient(135deg, #ff006688, #8338ec88, #3a86ff88, #06d6a088, #ffbe0b88)`;
      return (
        <div style={{ background: top(p.rank)?holo:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, backdropFilter:'blur(10px)' }}>
          <span style={{ color:'#fff', fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', textShadow:'0 0 8px #fff8' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13, textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>{p.name}</div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:11, opacity:0.85 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 15. Brutalist ────────────────────────────────────────────────────────
  {
    id: 15, name: 'Brutalist', desc: 'גבול עבה שטוח — גס ועוצמתי',
    bg: '#f5f5f0',
    render(p) {
      return (
        <div style={{ background:'#f5f5f0', border:`3px solid ${top(p.rank)?rc(p.rank):'#222'}`, borderRadius:0, padding:'10px 16px', marginBottom:6, display:'flex', alignItems:'center', gap:12, boxShadow:`4px 4px 0 ${top(p.rank)?rc(p.rank):'#222'}` }}>
          <span style={{ color:top(p.rank)?rc(p.rank):'#222', fontWeight:900, fontSize:20, minWidth:24, textAlign:'center', fontFamily:'monospace' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#111', fontWeight:900, fontSize:13, fontFamily:'monospace' }}>{p.name}</div>
            <div style={{ color:'#006600', fontWeight:900, fontSize:11, fontFamily:'monospace' }}>{p.pts.toFixed(2)} PTS</div>
          </div>
        </div>
      );
    }
  },

  // ── 16. Neumorphic ────────────────────────────────────────────────────────
  {
    id: 16, name: 'Neumorphic', desc: 'נויומורפיזם — לחץ רך תלת-ממדי',
    bg: '#e0e5ec',
    render(p) {
      const active = top(p.rank);
      return (
        <div style={{ background:'#e0e5ec', borderRadius:14, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow: active ? 'inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff' : '4px 4px 10px #b8bec7, -4px -4px 10px #ffffff' }}>
          <span style={{ color: active ? rc(p.rank) : '#8a94a6', fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#4a5568', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#2d7a3d', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 17. Stadium Arc ───────────────────────────────────────────────────────
  {
    id: 17, name: 'Stadium Arc', desc: 'קשת אצטדיון — עיגול תחתון',
    bg: '#0d1525',
    render(p) {
      return (
        <div style={{ background: rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderRadius:'12px 12px 40px 40px / 12px 12px 18px 18px', padding:'10px 16px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 18. Ribbon / Streamer ─────────────────────────────────────────────────
  {
    id: 18, name: 'Ribbon Banner', desc: 'סרט/באנר עם קפל בפינה',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ position:'relative', background: rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderRadius:10, padding:'10px 36px 10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
          {top(p.rank) && (
            <div style={{ position:'absolute', top:0, right:0, width:0, height:0, borderStyle:'solid', borderWidth:'0 28px 28px 0', borderColor:`transparent ${rc(p.rank)} transparent transparent`, borderRadius:'0 10px 0 0' }} />
          )}
        </div>
      );
    }
  },

  // ── 19. Double Border Frame ───────────────────────────────────────────────
  {
    id: 19, name: 'Double Frame', desc: 'מסגרת כפולה — פנימי וחיצוני',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ background:'transparent', border:`2px solid ${rc(p.rank)}`, borderRadius:12, padding:3, marginBottom:8 }}>
          <div style={{ background: rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderRadius:10, padding:'8px 14px', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
              <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
            </div>
          </div>
        </div>
      );
    }
  },

  // ── 20. Minimal Lines Only ────────────────────────────────────────────────
  {
    id: 20, name: 'Minimal Lines', desc: 'מינימליסטי — קו הפרדה בלבד',
    bg: '#0d1117',
    render(p, i) {
      return (
        <div style={{ display:'flex', alignItems:'center', gap:16, padding:'12px 8px', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none', borderLeft: top(p.rank) ? `3px solid ${rc(p.rank)}` : '3px solid transparent', paddingLeft:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20 }}>{p.rank}</span>
          <span style={{ color:'rgba(255,255,255,0.85)', fontWeight:600, fontSize:13, flex:1 }}>{p.name}</span>
          <span style={{ color:green, fontWeight:700, fontSize:12 }}>{p.pts.toFixed(2)}</span>
        </div>
      );
    }
  },

  // ── 21. Paper Card ────────────────────────────────────────────────────────
  {
    id: 21, name: 'Paper Card', desc: 'כרטיס נייר לבן עם צל ריאליסטי',
    bg: '#f0f0f0',
    render(p) {
      return (
        <div style={{ background:'#fff', borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow:`0 2px 8px rgba(0,0,0,0.12), 0 0 0 ${top(p.rank)?'2px 0px '+rc(p.rank):'0'}` }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#1a1a2e', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#16a34a', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 22. LED Scoreboard ────────────────────────────────────────────────────
  {
    id: 22, name: 'LED Scoreboard', desc: 'לוח תוצאות דיגיטלי — LED',
    bg: '#080808',
    render(p) {
      return (
        <div style={{ background:'#0a0a0a', border:`1px solid ${rc(p.rank)}66`, borderRadius:6, padding:'8px 14px', marginBottom:6, display:'flex', alignItems:'center', gap:12, fontFamily:"'Courier New',monospace" }}>
          <span style={{ color:rc(p.rank), fontWeight:700, fontSize:18, minWidth:22, textShadow:`0 0 6px ${rc(p.rank)}` }}>{String(p.rank).padStart(2,'0')}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#00ff41', fontSize:13, letterSpacing:2, textShadow:'0 0 4px #00ff41' }}>{p.name}</div>
            <div style={{ color:'#ff6600', fontSize:11, letterSpacing:2, textShadow:'0 0 4px #ff6600' }}>{p.pts.toFixed(2)}</div>
          </div>
        </div>
      );
    }
  },

  // ── 23. Top Accent Bar ────────────────────────────────────────────────────
  {
    id: 23, name: 'Top Accent Bar', desc: 'פס צבעוני עליון — כמו כרטיסייה',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ background:'rgba(255,255,255,0.04)', border:`1px solid rgba(255,255,255,0.1)`, borderTop:`3px solid ${rc(p.rank)}`, borderRadius:'0 0 10px 10px', padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 24. World Cup 2026 ────────────────────────────────────────────────────
  {
    id: 24, name: 'World Cup 2026', desc: 'ארה"ב/קנדה/מקסיקו — צבעי המונדיאל',
    bg: '#0a1628',
    render(p) {
      const stripes = p.rank===1
        ? 'linear-gradient(90deg,#B22234 0%,#B22234 33%,#fff 33%,#fff 34%,#3C3B6E 66%,#3C3B6E 100%)'
        : p.rank===2
        ? 'linear-gradient(90deg,#FF0000 0%,#FF0000 33%,#fff 33%,#fff 66%,#006600 66%,#006600 100%)'
        : p.rank===3
        ? 'linear-gradient(90deg,#EF3340 0%,#EF3340 33%,#fff 33%,#fff 66%,#009E49 66%,#009E49 100%)'
        : 'none';
      return (
        <div style={{ background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.12)`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, overflow:'hidden', position:'relative' }}>
          {top(p.rank) && <div style={{ position:'absolute', left:0, top:0, width:8, bottom:0, background:stripes, opacity:0.9 }} />}
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', marginLeft:top(p.rank)?6:0 }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 25. Gradient Full Background ──────────────────────────────────────────
  {
    id: 25, name: 'Gradient Fill', desc: 'גרדיאנט מלא לכל כרטיס',
    bg: '#0d1117',
    render(p) {
      const grad = p.rank===1
        ? 'linear-gradient(135deg,#1a1200,#3d2c00,#1a1200)'
        : p.rank===2
        ? 'linear-gradient(135deg,#111518,#1e2830,#111518)'
        : p.rank===3
        ? 'linear-gradient(135deg,#150b00,#2d1800,#150b00)'
        : 'rgba(255,255,255,0.04)';
      return (
        <div style={{ background:grad, border:`1px solid ${rc(p.rank)}44`, borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 26. Outlined Ghost ────────────────────────────────────────────────────
  {
    id: 26, name: 'Outlined Ghost', desc: 'מסגרת בלבד — רקע שקוף לגמרי',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ background:'transparent', border:`1.5px solid ${top(p.rank)?rc(p.rank):'rgba(255,255,255,0.15)'}`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'rgba(255,255,255,0.85)', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 27. Notched Hexagon ───────────────────────────────────────────────────
  {
    id: 27, name: 'Notched Hex', desc: 'חתך משושה — פינות גזורות',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ clipPath:'polygon(10px 0%,calc(100% - 10px) 0%,100% 10px,100% calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,0% calc(100% - 10px),0% 10px)', background: top(p.rank)?rb(p.rank):'rgba(255,255,255,0.05)', outline:`1px solid ${rc(p.rank)}44`, padding:'10px 18px', marginBottom:10, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 28. Floating Rank Outside ─────────────────────────────────────────────
  {
    id: 28, name: 'Floating Rank', desc: 'מספר דירוג צף מחוץ לכרטיס',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:20, minWidth:28, textAlign:'right' }}>{p.rank}</span>
          <div style={{ flex:1, background:'rgba(255,255,255,0.05)', border:`1px solid ${rc(p.rank)}33`, borderRadius:10, padding:'10px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
              <div style={{ color:green, fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
            </div>
            {top(p.rank) && <span style={{ fontSize:16 }}>{p.rank===1?'🏆':p.rank===2?'🥈':'🥉'}</span>}
          </div>
        </div>
      );
    }
  },

  // ── 29. Segmented Score Display ───────────────────────────────────────────
  {
    id: 29, name: 'Score Segmented', desc: 'ניקוד מודגש בצד — דגש על מספרים',
    bg: '#0d1117',
    render(p) {
      return (
        <div style={{ display:'flex', borderRadius:12, overflow:'hidden', marginBottom:8, border:`1px solid ${rc(p.rank)}33` }}>
          <div style={{ width:36, background:top(p.rank)?rb(p.rank):'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16 }}>{p.rank}</span>
          </div>
          <div style={{ flex:1, background:'rgba(255,255,255,0.03)', padding:'8px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</span>
            <div style={{ textAlign:'right' }}>
              <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16 }}>{Math.floor(p.pts)}</span>
              <span style={{ color:green, fontWeight:700, fontSize:10 }}>.{String(p.pts.toFixed(2)).split('.')[1]}</span>
            </div>
          </div>
        </div>
      );
    }
  },

  // ── 30. Animated Pulse Glow ───────────────────────────────────────────────
  {
    id: 30, name: 'Animated Pulse Glow', desc: 'פעימת זוהר אנימציה — חי ודינמי',
    bg: '#050510',
    render(p) {
      const c = rc(p.rank);
      return (
        <div style={{
          '--gc': `${c}66`,
          background:'rgba(0,0,20,0.8)',
          border:`1px solid ${c}55`,
          borderRadius:12,
          padding:'10px 16px',
          marginBottom:8,
          display:'flex',
          alignItems:'center',
          gap:12,
          animation: top(p.rank) ? 'lb-pulse 2.5s ease-in-out infinite' : 'none',
        }}>
          <span style={{ color:c, fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', textShadow:`0 0 6px ${c}` }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#e0e0ff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#00ff88', fontWeight:700, fontSize:11, textShadow:'0 0 4px #00ff88' }}>{p.pts.toFixed(2)} Pts</div>
          </div>
          {top(p.rank) && <div style={{ width:6, height:6, borderRadius:'50%', background:c, animation:'lb-pulse 1.5s ease-in-out infinite', boxShadow:`0 0 6px ${c}` }} />}
        </div>
      );
    }
  },
];

export default function AdminLeaderboardDemo() {
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'הכול (30)' },
    { id: 'shape', label: 'צורות', ids: [1,2,3,4,17,27] },
    { id: 'material', label: 'חומרים', ids: [5,6,7,13,14,15,16,21] },
    { id: 'layout', label: 'פריסה', ids: [8,9,10,11,12,18,19,20,23,28,29] },
    { id: 'worldcup', label: 'מונדיאל', ids: [24,25,26] },
    { id: 'special', label: 'מיוחד', ids: [22,30] },
  ];

  const visible = filter === 'all'
    ? designs
    : designs.filter(d => categories.find(c=>c.id===filter)?.ids?.includes(d.id));

  return (
    <div dir="rtl" style={{ color:'#fff', fontFamily:'system-ui,sans-serif' }}>
      <style>{css}</style>

      <h1 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>30 רעיונות עיצוב — שורת לידרבורד</h1>
      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginBottom:20 }}>
        לחץ על קטגוריה לסינון. כל תצוגה מציגה 5 שחקנים לדוגמה.
      </p>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
        {categories.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{ padding:'6px 14px', borderRadius:999, border:'1px solid rgba(255,255,255,0.2)', background: filter===c.id ? '#FFD700' : 'rgba(255,255,255,0.06)', color: filter===c.id ? '#000' : '#fff', fontWeight:700, fontSize:12, cursor:'pointer' }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:24 }}>
        {visible.map(d => (
          <div key={d.id}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:10 }}>
              <span style={{ background:'#FFD700', color:'#000', borderRadius:999, width:22, height:22, display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:11, flexShrink:0 }}>{d.id}</span>
              <div>
                <div style={{ fontWeight:800, fontSize:13 }}>{d.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{d.desc}</div>
              </div>
            </div>

            {/* Preview box */}
            <div style={{ background: d.bg.startsWith('linear') ? d.bg : d.bg, borderRadius:14, padding:12, border:'1px solid rgba(255,255,255,0.08)' }}>
              {mockPlayers.map((p, i) => (
                <div key={p.rank}>{d.render(p, i)}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
