import React, { useState, useEffect, useRef } from 'react';

const mockPlayers = [
  { rank: 1, name: 'שחקן 2', pts: 165.55 },
  { rank: 2, name: 'שחקן 4', pts: 122.50 },
  { rank: 3, name: 'שחקן 1', pts: 97.00 },
  { rank: 4, name: 'שחקן 3', pts: 89.35 },
  { rank: 5, name: 'שחקן 5', pts: 68.55 },
];

const gold = '#FFD700'; const silver = '#C0C0C0'; const bronze = '#CD7F32';
const rc  = r => r===1?gold:r===2?silver:r===3?bronze:'rgba(255,255,255,0.45)';
const rb  = r => r===1?'rgba(255,215,0,0.12)':r===2?'rgba(192,192,192,0.08)':r===3?'rgba(205,127,50,0.12)':'rgba(255,255,255,0.04)';
const top = r => r <= 3;

// scoped keyframes injected into a shadow-like wrapper — no global class selectors
const SCOPED_CSS = `
  @keyframes lb2-aurora { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes lb2-fire   { 0%,100%{background-position:50% 0%} 50%{background-position:50% 100%} }
  @keyframes lb2-eq     { 0%,100%{height:4px} 50%{height:20px} }
`;

const designs = [

  // ── 31. Ticket Stub ──────────────────────────────────────────────────────
  {
    id:31, name:'Ticket Stub', desc:'כרטיס כניסה — עם קצה מחורר',
    bg:'#0d1117',
    render(p) {
      return (
        <div style={{ display:'flex', marginBottom:8, position:'relative' }}>
          <div style={{ background: rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderRight:'none', borderRadius:'10px 0 0 10px', padding:'10px 14px', display:'flex', alignItems:'center', gap:10, flex:1 }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20 }}>{p.rank}</span>
            <div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
              <div style={{ color:'#34C759', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
            </div>
          </div>
          {/* Perforated divider */}
          <div style={{ width:1, background:`repeating-linear-gradient(to bottom,${rc(p.rank)}66 0,${rc(p.rank)}66 6px,transparent 6px,transparent 10px)`, margin:'4px 0' }} />
          {/* Stub */}
          <div style={{ background: rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderLeft:'none', borderRadius:'0 10px 10px 0', width:44, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:rc(p.rank), fontSize:10, fontWeight:900, writingMode:'vertical-rl', letterSpacing:1 }}>PTS</span>
          </div>
        </div>
      );
    }
  },

  // ── 32. 3D Layer Stack ───────────────────────────────────────────────────
  {
    id:32, name:'3D Stack Depth', desc:'עומק תלת-ממד — שכבות מאחורה',
    bg:'#0d1117',
    render(p) {
      return (
        <div style={{ position:'relative', marginBottom:16 }}>
          {top(p.rank) && <>
            <div style={{ position:'absolute', top:4, left:4, right:-4, bottom:-4, background:'rgba(255,255,255,0.02)', border:`1px solid ${rc(p.rank)}18`, borderRadius:12 }} />
            <div style={{ position:'absolute', top:2, left:2, right:-2, bottom:-2, background:'rgba(255,255,255,0.03)', border:`1px solid ${rc(p.rank)}28`, borderRadius:11 }} />
          </>}
          <div style={{ position:'relative', background: rb(p.rank), border:`1px solid ${rc(p.rank)}55`, borderRadius:10, padding:'10px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
              <div style={{ color:'#34C759', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
            </div>
          </div>
        </div>
      );
    }
  },

  // ── 33. Aurora Borealis ──────────────────────────────────────────────────
  {
    id:33, name:'Aurora Borealis', desc:'זוהר הצפון — ירוק/סגול/כחול',
    bg:'#020814',
    render(p) {
      const aurora = 'linear-gradient(270deg,#00ff87,#60efff,#a855f7,#00ff87)';
      return (
        <div style={{ position:'relative', background: top(p.rank)?'transparent':'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.12)`, borderRadius:12, padding:2, marginBottom:8, overflow:'hidden' }}>
          {top(p.rank) && <div style={{ position:'absolute', inset:0, borderRadius:12, background:aurora, backgroundSize:'400% 400%', animation:'lb2-aurora 4s ease infinite', opacity:0.25, pointerEvents:'none' }} />}
          <div style={{ position:'relative', background:'rgba(2,8,20,0.88)', borderRadius:10, padding:'10px 14px', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ color:'#e0f7fa', fontWeight:700, fontSize:13 }}>{p.name}</div>
              <div style={{ color:'#00ff87', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
            </div>
          </div>
        </div>
      );
    }
  },

  // ── 34. Velvet Luxury ────────────────────────────────────────────────────
  {
    id:34, name:'Velvet Luxury', desc:'קטיפה כהה — עושר ויוקרה',
    bg:'#0e0010',
    render(p) {
      return (
        <div style={{ background:`linear-gradient(135deg,#1a0022,#2d0040,#1a0022)`, border:`1px solid ${rc(p.rank)}55`, borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow: top(p.rank)?`inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 20px ${rc(p.rank)}22`:'none' }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'rgba(255,240,255,0.9)', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#c084fc', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
          {top(p.rank) && <span style={{ fontSize:14 }}>{p.rank===1?'💎':p.rank===2?'💜':'🔮'}</span>}
        </div>
      );
    }
  },

  // ── 35. Fire / Lava ──────────────────────────────────────────────────────
  {
    id:35, name:'Fire & Lava', desc:'אש ולבה — ראשונים בוערים',
    bg:'#0a0000',
    render(p) {
      const fireGrad = p.rank===1
        ? 'linear-gradient(180deg,#ff6b00,#ff0000,#8b0000,#ff4500)'
        : p.rank===2
        ? 'linear-gradient(180deg,#ff8c00,#cc4400,#661100)'
        : p.rank===3
        ? 'linear-gradient(180deg,#e05000,#993300,#440000)'
        : 'rgba(255,255,255,0.04)';
      return (
        <div style={{ background: top(p.rank)?fireGrad:'rgba(255,255,255,0.04)', backgroundSize:'100% 200%', animation: top(p.rank)?'lb2-fire 3s ease-in-out infinite':'none', border:`1px solid ${top(p.rank)?'#ff6b0066':'rgba(255,255,255,0.1)'}`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color: top(p.rank)?'#fff':rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', textShadow: top(p.rank)?'0 0 8px #ff6b00':'' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13, textShadow: top(p.rank)?'0 1px 4px rgba(0,0,0,0.6)':'' }}>{p.name}</div>
            <div style={{ color: top(p.rank)?'#ffe4a0':'#34C759', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 36. Ocean Wave ───────────────────────────────────────────────────────
  {
    id:36, name:'Ocean Wave', desc:'גל אוקיינוס — כחול-ציאן',
    bg:'#010d18',
    render(p) {
      const depth = p.rank===1?0.9:p.rank===2?0.65:p.rank===3?0.45:0.2;
      return (
        <div style={{ background:`rgba(0,${Math.round(80*depth)},${Math.round(180*depth)},0.25)`, border:`1px solid rgba(0,200,255,${depth*0.4})`, borderRadius:'10px 10px 40px 40px / 10px 10px 14px 14px', padding:'10px 16px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:`rgba(80,220,255,${depth+0.1})`, fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'rgba(220,240,255,0.9)', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#00d4ff', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 37. Deep Space ───────────────────────────────────────────────────────
  {
    id:37, name:'Deep Space', desc:'חלל חשוך — כוכבים ומסתורין',
    bg:'#020208',
    render(p) {
      const stars = top(p.rank) ? `radial-gradient(1px 1px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 60% 15%,#fff,transparent),radial-gradient(1px 1px at 80% 60%,#aaf,transparent),radial-gradient(1px 1px at 40% 75%,#fff,transparent)` : 'none';
      return (
        <div style={{ background:`${stars},${rb(p.rank)}`, border:`1px solid ${rc(p.rank)}33`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'rgba(200,220,255,0.9)', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#7cb9ff', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
          {p.rank===1 && <span style={{ fontSize:14 }}>🌟</span>}
        </div>
      );
    }
  },

  // ── 38. Vintage Sepia ────────────────────────────────────────────────────
  {
    id:38, name:'Vintage Sepia', desc:'רטרו קלאסי — עיתון ישן',
    bg:'#1a1208',
    render(p) {
      return (
        <div style={{ background:`linear-gradient(135deg,#2a1f0a,#1e1508)`, border:`1px solid #8b7355`, borderRadius:6, padding:'10px 16px', marginBottom:6, display:'flex', alignItems:'center', gap:12, boxShadow: top(p.rank)?`inset 0 0 20px rgba(139,115,85,0.15)`:'none' }}>
          <span style={{ color:p.rank===1?'#d4af37':p.rank<=3?'#8b7355':'#5a4a2a', fontWeight:900, fontSize:18, minWidth:20, textAlign:'center', fontFamily:'Georgia,serif' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#c8b89a', fontWeight:700, fontSize:13, fontFamily:'Georgia,serif' }}>{p.name}</div>
            <div style={{ color:'#8b9467', fontWeight:700, fontSize:11, fontFamily:'Georgia,serif' }}>{p.pts.toFixed(2)} נק׳</div>
          </div>
        </div>
      );
    }
  },

  // ── 39. Sports Jersey ────────────────────────────────────────────────────
  {
    id:39, name:'Sports Jersey', desc:'חולצת ספורט — מספר על הגב',
    bg:'#0d1117',
    render(p) {
      return (
        <div style={{ position:'relative', overflow:'hidden', background:`repeating-linear-gradient(90deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 8px),${rb(p.rank)}`, border:`1px solid ${rc(p.rank)}44`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', fontSize:40, fontWeight:900, color:rc(p.rank), opacity:0.12, lineHeight:1, fontStyle:'italic' }}>{p.rank}</span>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', position:'relative' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center', position:'relative' }}>
            <div style={{ color:'#fff', fontWeight:800, fontSize:13, letterSpacing:1, textTransform:'uppercase' }}>{p.name}</div>
            <div style={{ color:'#34C759', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 40. Achievement Badge ────────────────────────────────────────────────
  {
    id:40, name:'Achievement Badge', desc:'הישג נפתח — סגנון משחק',
    bg:'#0d1117',
    render(p) {
      const icons = ['🏆','🥈','🥉','🎖️','🎗️'];
      return (
        <div style={{ background:'linear-gradient(135deg,#1a1f2e,#0d1117)', border:`1px solid ${rc(p.rank)}44`, borderRadius:12, padding:'8px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:rb(p.rank), border:`2px solid ${rc(p.rank)}66`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>
            {icons[p.rank-1]}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:9, fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:2 }}>דירוג #{p.rank}</div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ color:rc(p.rank), fontWeight:900, fontSize:15 }}>{Math.floor(p.pts)}</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:9 }}>נקודות</div>
          </div>
        </div>
      );
    }
  },

  // ── 41. Pixel / 8-bit ────────────────────────────────────────────────────
  {
    id:41, name:'Pixel / 8-bit', desc:'רטרו ארקייד — פיקסלים קלאסי',
    bg:'#000',
    render(p) {
      const c = top(p.rank)?rc(p.rank):'#555';
      return (
        <div style={{ background:'#000', border:`2px solid ${c}`, borderRadius:0, padding:'8px 12px', marginBottom:6, display:'flex', alignItems:'center', gap:10, boxShadow:`2px 2px 0 ${c}, 4px 4px 0 ${c}44`, imageRendering:'pixelated', fontFamily:"'Courier New',monospace" }}>
          <span style={{ color:c, fontWeight:900, fontSize:16, minWidth:20, textAlign:'center' }}>{String(p.rank).padStart(2,'0')}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#0f0', fontWeight:700, fontSize:12, letterSpacing:2 }}>{p.name}</div>
            <div style={{ color:'#ff0', fontSize:10 }}>{'█'.repeat(Math.round(p.pts/40))}</div>
          </div>
          <span style={{ color:c, fontSize:11 }}>{p.pts.toFixed(0)}</span>
        </div>
      );
    }
  },

  // ── 42. Matrix Code Rain ─────────────────────────────────────────────────
  {
    id:42, name:'Matrix Code', desc:'מטריקס — גשם קוד ירוק',
    bg:'#000',
    render(p) {
      return (
        <div style={{ position:'relative', overflow:'hidden', background:'#001200', border:'1px solid #00ff4133', borderRadius:6, padding:'10px 14px', marginBottom:6, display:'flex', alignItems:'center', gap:12, fontFamily:"'Courier New',monospace" }}>
          <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.03) 2px,rgba(0,255,65,0.03) 4px)', pointerEvents:'none' }} />
          <span style={{ color:'#00ff41', fontWeight:900, fontSize:16, minWidth:20, textShadow:'0 0 6px #00ff41' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center', position:'relative' }}>
            <div style={{ color:'#00ff41', fontWeight:700, fontSize:13, textShadow:'0 0 4px #00ff41' }}>{p.name}</div>
            <div style={{ color:'#00cc33', fontSize:11 }}>{p.pts.toFixed(2)}</div>
          </div>
        </div>
      );
    }
  },

  // ── 43. Two-Row Block ────────────────────────────────────────────────────
  {
    id:43, name:'Two-Row Block', desc:'שורת שם + בר ניקוד נפרדת',
    bg:'#0d1117',
    render(p) {
      const pct = Math.round((p.pts / mockPlayers[0].pts) * 100);
      return (
        <div style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${rc(p.rank)}33`, borderRadius:10, overflow:'hidden', marginBottom:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 14px' }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20 }}>{p.rank}</span>
            <span style={{ color:'#fff', fontWeight:700, fontSize:13, flex:1 }}>{p.name}</span>
            <span style={{ color:'#34C759', fontSize:12, fontWeight:700 }}>{p.pts.toFixed(2)}</span>
          </div>
          <div style={{ height:4, background:'rgba(255,255,255,0.08)' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${rc(p.rank)},${rc(p.rank)}88)` }} />
          </div>
        </div>
      );
    }
  },

  // ── 44. Vertical Rank Label ──────────────────────────────────────────────
  {
    id:44, name:'Vertical Rank', desc:'מספר דירוג מסובב 90° בצד',
    bg:'#0d1117',
    render(p) {
      return (
        <div style={{ display:'flex', marginBottom:8 }}>
          <div style={{ width:28, background:rb(p.rank), borderRadius:'10px 0 0 10px', display:'flex', alignItems:'center', justifyContent:'center', borderLeft:`3px solid ${rc(p.rank)}`, borderTop:`1px solid ${rc(p.rank)}33`, borderBottom:`1px solid ${rc(p.rank)}33` }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:11, writingMode:'vertical-rl', textOrientation:'mixed', transform:'rotate(180deg)', letterSpacing:2 }}>#{p.rank}</span>
          </div>
          <div style={{ flex:1, background:'rgba(255,255,255,0.04)', border:`1px solid rgba(255,255,255,0.08)`, borderLeft:'none', borderRadius:'0 10px 10px 0', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</span>
            <span style={{ color:'#34C759', fontWeight:700, fontSize:12 }}>{p.pts.toFixed(2)} Pts</span>
          </div>
        </div>
      );
    }
  },

  // ── 45. Coin / Token ─────────────────────────────────────────────────────
  {
    id:45, name:'Coin Token', desc:'מטבע/אסימון עם הטבעה',
    bg:'#0d1117',
    render(p) {
      return (
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
          <div style={{ width:42, height:42, borderRadius:'50%', background:rb(p.rank), border:`2px solid ${rc(p.rank)}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow: top(p.rank)?`0 0 0 3px ${rc(p.rank)}22, inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3)`:'none' }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16 }}>{p.rank}</span>
          </div>
          <div style={{ flex:1, background:'rgba(255,255,255,0.04)', border:`1px solid rgba(255,255,255,0.08)`, borderRadius:10, padding:'8px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</span>
            <span style={{ color:'#34C759', fontWeight:700, fontSize:12 }}>{p.pts.toFixed(2)}</span>
          </div>
        </div>
      );
    }
  },

  // ── 46. Polaroid Frame ───────────────────────────────────────────────────
  {
    id:46, name:'Polaroid', desc:'מסגרת פולארויד — תמונה ישנה',
    bg:'#1a1510',
    render(p) {
      return (
        <div style={{ background:'#f5f0e8', borderRadius:4, padding:'10px 10px 24px', marginBottom:10, boxShadow:`0 3px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.15)`, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, background:top(p.rank)?`linear-gradient(135deg,${rb(p.rank).replace('rgba','rgba').replace(/,[\d.]+\)$/,',0.8)')},'#111`:`#ddd`, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #ccc' }}>
            <span style={{ color: top(p.rank)?rc(p.rank):'#888', fontWeight:900, fontSize:18 }}>{p.rank}</span>
          </div>
          <div>
            <div style={{ color:'#1a1208', fontWeight:700, fontSize:13, fontFamily:'Georgia,serif' }}>{p.name}</div>
            <div style={{ color:'#2d6a3a', fontWeight:700, fontSize:11, fontFamily:'Georgia,serif' }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 47. Racing Checkered ─────────────────────────────────────────────────
  {
    id:47, name:'Racing Checkered', desc:'דגל מירוץ — ריבועים שחור-לבן',
    bg:'#0a0a0a',
    render(p) {
      const checker = `repeating-conic-gradient(#fff 0% 25%,transparent 0% 50%) 0 0 / 8px 8px`;
      return (
        <div style={{ position:'relative', overflow:'hidden', background:'#111', border:`2px solid ${rc(p.rank)}`, borderRadius:8, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          {top(p.rank) && <>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:12, background:checker, opacity:0.8 }} />
            <div style={{ position:'absolute', right:0, top:0, bottom:0, width:12, background:checker, opacity:0.8 }} />
          </>}
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', marginLeft: top(p.rank)?8:0 }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:800, fontSize:13, letterSpacing:1 }}>{p.name}</div>
            <div style={{ color:rc(p.rank), fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 48. Conic Gradient Border ────────────────────────────────────────────
  {
    id:48, name:'Rainbow Border', desc:'גבול קשת סובב — מסתובב וחי',
    bg:'#0d1117',
    render(p) {
      const rainbow = 'linear-gradient(#0d1117,#0d1117) padding-box, conic-gradient(from 0deg,#ff006688,#8338ec88,#3a86ff88,#06d6a088,#ffbe0b88,#ff006688) border-box';
      return (
        <div style={{ background: top(p.rank)?rainbow:'rgba(255,255,255,0.04)', border: top(p.rank)?'2px solid transparent':'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#34C759', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 49. Sticker / Die-cut ────────────────────────────────────────────────
  {
    id:49, name:'Sticker Die-cut', desc:'מדבקה עם מתאר לבן עבה',
    bg:'#2a2a2a',
    render(p) {
      const fill = p.rank===1?'#1a3a00':p.rank===2?'#001a3a':p.rank===3?'#2a1400':'#1a1a1a';
      return (
        <div style={{ background:'#fff', borderRadius:14, padding:3, marginBottom:10, display:'inline-block', width:'100%', boxSizing:'border-box' }}>
          <div style={{ background:fill, border:`2px solid ${rc(p.rank)}`, borderRadius:12, padding:'8px 14px', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
              <div style={{ color:'#34C759', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
            </div>
          </div>
        </div>
      );
    }
  },

  // ── 50. Sunrise Gradient ─────────────────────────────────────────────────
  {
    id:50, name:'Sunrise Warm', desc:'זריחה — ורוד/כתום/זהב חם',
    bg:'#0d0810',
    render(p) {
      const intensity = p.rank===1?1:p.rank===2?0.65:p.rank===3?0.45:0.2;
      return (
        <div style={{ background:`rgba(${Math.round(255*intensity)},${Math.round(80*intensity)},${Math.round(20*intensity)},0.15)`, border:`1px solid rgba(255,${Math.round(160*intensity)},${Math.round(50*intensity)},${intensity*0.5})`, borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:`rgb(${Math.round(255*intensity)},${Math.round(200*intensity)},${Math.round(80*intensity)})`, fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'rgba(255,240,220,0.9)', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#ffb347', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 51. Dark Burgundy / Wine ──────────────────────────────────────────────
  {
    id:51, name:'Bordeaux Wine', desc:'אדום בורדו — יוקרה קלאסית',
    bg:'#08020a',
    render(p) {
      return (
        <div style={{ background:`linear-gradient(135deg,#1a0008,#2d0015,#1a0008)`, border:`1px solid ${top(p.rank)?'#8b0033':'#3d0015'}`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow: top(p.rank)?`0 0 16px #8b003322`:'none' }}>
          <span style={{ color: p.rank===1?gold:p.rank<=3?'#e07090':'#a04060', fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#ffe4ee', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#ff6090', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
          {top(p.rank) && <span style={{ fontSize:13 }}>🍷</span>}
        </div>
      );
    }
  },

  // ── 52. Newspaper Editorial ───────────────────────────────────────────────
  {
    id:52, name:'Newspaper', desc:'עיתון — כותרת ועמודות עיתונות',
    bg:'#f2ead8',
    render(p, i) {
      return (
        <div style={{ borderBottom:`${i<4?'1px':'0'} solid #c8b88a`, padding:'8px 4px', display:'flex', alignItems:'baseline', gap:10 }}>
          <span style={{ color: top(p.rank)?'#8b0000':'#555', fontWeight:900, fontSize:22, minWidth:28, fontFamily:'Georgia,serif', lineHeight:1 }}>{p.rank}</span>
          <div style={{ flex:1 }}>
            <span style={{ color:'#1a1208', fontWeight:700, fontSize:14, fontFamily:'Georgia,serif', borderBottom: p.rank===1?'2px solid #8b0000':'none' }}>{p.name}</span>
          </div>
          <span style={{ color:'#2d4a1a', fontWeight:700, fontSize:13, fontFamily:'Georgia,serif' }}>{p.pts.toFixed(2)}</span>
        </div>
      );
    }
  },

  // ── 53. Social Profile Card ───────────────────────────────────────────────
  {
    id:53, name:'Social Profile', desc:'כרטיס פרופיל — רשת חברתית',
    bg:'#0d1117',
    render(p) {
      const initials = p.name.split(' ').map(w=>w[0]).join('').slice(0,2);
      return (
        <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:'8px 12px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg,${rc(p.rank)},${rc(p.rank)}88)`, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${rc(p.rank)}66` }}>
              <span style={{ color:'#000', fontWeight:900, fontSize:12 }}>{initials}</span>
            </div>
            {top(p.rank) && <div style={{ position:'absolute', bottom:-2, right:-2, width:14, height:14, borderRadius:'50%', background:rc(p.rank), border:'2px solid #0d1117', display:'flex', alignItems:'center', justifyContent:'center', fontSize:7 }}>✓</div>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:10 }}>מקום #{p.rank} בטבלה</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ color:rc(p.rank), fontWeight:900, fontSize:14 }}>{p.pts.toFixed(0)}</div>
            <div style={{ color:'rgba(255,255,255,0.35)', fontSize:9 }}>נק׳</div>
          </div>
        </div>
      );
    }
  },

  // ── 54. Music Equalizer Bars ─────────────────────────────────────────────
  {
    id:54, name:'Equalizer Bars', desc:'בר אקולייזר — קצב ומוזיקה',
    bg:'#080808',
    render(p) {
      const barCount = 5;
      return (
        <div style={{ position:'relative', overflow:'hidden', background:'#0a0a0a', border:`1px solid ${rc(p.rank)}44`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          {top(p.rank) && (
            <div style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', display:'flex', alignItems:'flex-end', gap:2, height:24, opacity:0.2 }}>
              {[...Array(barCount)].map((_,i) => (
                <div key={i} style={{ width:3, background:rc(p.rank), borderRadius:1, height:`${30+Math.sin(i*1.3)*50}%`, animation:`lb2-eq ${0.5+i*0.15}s ease-in-out infinite alternate` }} />
              ))}
            </div>
          )}
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, position:'relative' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center', position:'relative' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:rc(p.rank), fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 55. Constellation Stars ───────────────────────────────────────────────
  {
    id:55, name:'Constellation', desc:'כוכבים מחוברים — קבוצת כוכבים',
    bg:'#020612',
    render(p) {
      return (
        <div style={{ position:'relative', overflow:'hidden', background:'rgba(5,10,30,0.9)', border:`1px solid ${rc(p.rank)}33`, borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
          {top(p.rank) && (
            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.15 }} viewBox="0 0 200 40">
              <circle cx="20" cy="8" r="1.5" fill={rc(p.rank)} />
              <circle cx="60" cy="15" r="1" fill={rc(p.rank)} />
              <circle cx="100" cy="6" r="2" fill={rc(p.rank)} />
              <circle cx="140" cy="18" r="1" fill={rc(p.rank)} />
              <circle cx="180" cy="10" r="1.5" fill={rc(p.rank)} />
              <line x1="20" y1="8" x2="60" y2="15" stroke={rc(p.rank)} strokeWidth="0.5" />
              <line x1="60" y1="15" x2="100" y2="6" stroke={rc(p.rank)} strokeWidth="0.5" />
              <line x1="100" y1="6" x2="140" y2="18" stroke={rc(p.rank)} strokeWidth="0.5" />
              <line x1="140" y1="18" x2="180" y2="10" stroke={rc(p.rank)} strokeWidth="0.5" />
            </svg>
          )}
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', position:'relative' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center', position:'relative' }}>
            <div style={{ color:'#dde8ff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#7cb9ff', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 56. Folded Corner ────────────────────────────────────────────────────
  {
    id:56, name:'Folded Corner', desc:'פינה מקופלת כמו נייר',
    bg:'#0d1117',
    render(p) {
      return (
        <div style={{ position:'relative', background: rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderRadius:'10px 10px 10px 0', padding:'10px 16px', marginBottom:10, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ position:'absolute', bottom:-1, left:-1, width:0, height:0, borderStyle:'solid', borderWidth:'10px 10px 0 0', borderColor:`rgba(0,0,0,0.4) transparent transparent transparent` }} />
          <div style={{ position:'absolute', bottom:-10, left:0, width:10, height:10, background:'rgba(255,255,255,0.06)', clipPath:'polygon(0 0,100% 0,0 100%)' }} />
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center' }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#34C759', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 57. Banner / Striped Flag ────────────────────────────────────────────
  {
    id:57, name:'Flag Banner', desc:'דגל אופקי — פסים צבעוניים',
    bg:'#0d1117',
    render(p) {
      const stripeH = top(p.rank)?3:2;
      return (
        <div style={{ background:'rgba(255,255,255,0.04)', border:`1px solid rgba(255,255,255,0.08)`, borderRadius:10, overflow:'hidden', marginBottom:8 }}>
          <div style={{ height:stripeH, background:`linear-gradient(90deg,${rc(p.rank)},${rc(p.rank)}88,transparent)` }} />
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 14px' }}>
            <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20 }}>{p.rank}</span>
            <div style={{ flex:1 }}>
              <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
              <div style={{ color:'#34C759', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
            </div>
          </div>
          <div style={{ height:stripeH, background:`linear-gradient(90deg,transparent,${rc(p.rank)}88,${rc(p.rank)})` }} />
        </div>
      );
    }
  },

  // ── 58. Scanline TV ──────────────────────────────────────────────────────
  {
    id:58, name:'Scanline TV', desc:'מסך טלוויזיה ישן — קווי סריקה',
    bg:'#000',
    render(p) {
      return (
        <div style={{ position:'relative', overflow:'hidden', background:`linear-gradient(90deg,#0a0a0a 0%,#141414 50%,#0a0a0a 100%)`, border:`2px solid ${rc(p.rank)}66`, borderRadius:4, padding:'10px 16px', marginBottom:6, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(0,0,0,0.25) 2px,rgba(0,0,0,0.25) 4px)', pointerEvents:'none' }} />
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:17, minWidth:20, textAlign:'center', position:'relative', textShadow:`0 0 4px ${rc(p.rank)}` }}>{p.rank}</span>
          <div style={{ flex:1, textAlign:'center', position:'relative' }}>
            <div style={{ color:'#e0e0e0', fontWeight:700, fontSize:13, textShadow:'0 0 3px #fff4' }}>{p.name}</div>
            <div style={{ color:'#4cff4c', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 59. Crystal / Glass Diamond ─────────────────────────────────────────
  {
    id:59, name:'Crystal Diamond', desc:'קריסטל — שקוף עם שבירת אור',
    bg:'linear-gradient(135deg,#0a1628,#1a0a2e)',
    render(p) {
      return (
        <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:`1px solid rgba(255,255,255,0.2)`, borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, boxShadow:`inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 0 ${top(p.rank)?20:0}px ${rc(p.rank)}22` }}>
          <div style={{ width:32, height:32, clipPath:'polygon(50% 0%,100% 35%,80% 100%,20% 100%,0% 35%)', background:`linear-gradient(135deg,${rc(p.rank)},${rc(p.rank)}44)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:'#fff', fontWeight:900, fontSize:13 }}>{p.rank}</span>
          </div>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ color:'rgba(255,255,255,0.9)', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'rgba(200,240,255,0.8)', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)} Pts</div>
          </div>
        </div>
      );
    }
  },

  // ── 60. Timeline Step ────────────────────────────────────────────────────
  {
    id:60, name:'Timeline Step', desc:'ציר זמן — שלבים ועמדות',
    bg:'#0d1117',
    render(p, i) {
      const isLast = i === 4;
      return (
        <div style={{ display:'flex', gap:0, marginBottom:0 }}>
          {/* Timeline column */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:32, flexShrink:0 }}>
            <div style={{ width:20, height:20, borderRadius:'50%', background: rb(p.rank), border:`2px solid ${rc(p.rank)}`, display:'flex', alignItems:'center', justifyContent:'center', zIndex:1, flexShrink:0 }}>
              <span style={{ color:rc(p.rank), fontWeight:900, fontSize:10 }}>{p.rank}</span>
            </div>
            {!isLast && <div style={{ width:2, flex:1, minHeight:16, background:`linear-gradient(to bottom,${rc(p.rank)}44,rgba(255,255,255,0.08))` }} />}
          </div>
          {/* Content */}
          <div style={{ flex:1, paddingBottom: isLast?0:10, paddingLeft:8 }}>
            <div style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${rc(p.rank)}22`, borderRadius:8, padding:'6px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ color:'rgba(255,255,255,0.85)', fontWeight:700, fontSize:13 }}>{p.name}</span>
              <span style={{ color:'#34C759', fontWeight:700, fontSize:11 }}>{p.pts.toFixed(2)}</span>
            </div>
          </div>
        </div>
      );
    }
  },
];

export default function AdminLeaderboardDemo2() {
  const [filter, setFilter] = useState('all');

  const categories = [
    { id:'all',      label:'הכול (30)' },
    { id:'shape',    label:'צורות',    ids:[31,43,47,49,56,57,59,60] },
    { id:'material', label:'חומרים',   ids:[33,34,35,36,37,38,41,42,50,51,58] },
    { id:'layout',   label:'פריסה',    ids:[32,39,40,44,45,46,53,54,55] },
    { id:'border',   label:'גבולות',   ids:[48,49,47,57,19] },
    { id:'special',  label:'מיוחד',    ids:[52,58,59,60] },
  ];

  const visible = filter === 'all'
    ? designs
    : designs.filter(d => categories.find(c=>c.id===filter)?.ids?.includes(d.id));

  return (
    <div dir="rtl" style={{ color:'#fff', fontFamily:'system-ui,sans-serif' }}>
      <style>{SCOPED_CSS}</style>
      <h1 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>30 רעיונות נוספים — שורת לידרבורד (#31–60)</h1>
      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginBottom:20 }}>
        סדרה שנייה של עיצובים יצירתיים. לחץ לסינון לפי קטגוריה.
      </p>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
        {categories.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{ padding:'6px 14px', borderRadius:999, border:'1px solid rgba(255,255,255,0.2)', background: filter===c.id?'#FFD700':'rgba(255,255,255,0.06)', color: filter===c.id?'#000':'#fff', fontWeight:700, fontSize:12, cursor:'pointer' }}>
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:24 }}>
        {visible.map(d => (
          <div key={d.id}>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:10 }}>
              <span style={{ background:'#FF6B00', color:'#fff', borderRadius:999, width:22, height:22, display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:11, flexShrink:0 }}>{d.id}</span>
              <div>
                <div style={{ fontWeight:800, fontSize:13 }}>{d.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{d.desc}</div>
              </div>
            </div>
            <div style={{ background: d.bg.startsWith('linear')?d.bg:d.bg, borderRadius:14, padding:12, border:'1px solid rgba(255,255,255,0.08)' }}>
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
