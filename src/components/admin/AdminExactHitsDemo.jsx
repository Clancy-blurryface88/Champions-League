import React, { useState } from 'react';

const mock = [
  { rank:1, name:'שחקן 2', hits:12, total:24, pct:50  },
  { rank:2, name:'שחקן 4', hits:9,  total:22, pct:41  },
  { rank:3, name:'שחקן 1', hits:8,  total:20, pct:40  },
  { rank:4, name:'שחקן 3', hits:6,  total:23, pct:26  },
  { rank:5, name:'שחקן 5', hits:4,  total:18, pct:22  },
];
const MAX = mock[0].hits;

const gold='#FFD700', silver='#C0C0C0', bronze='#CD7F32';
const rc = r => r===1?gold:r===2?silver:r===3?bronze:'rgba(255,255,255,0.4)';
const rb = r => r===1?'rgba(255,215,0,0.12)':r===2?'rgba(192,192,192,0.08)':r===3?'rgba(205,127,50,0.12)':'rgba(255,255,255,0.04)';
const top = r => r<=3;

const SCOPED_CSS=`
@keyframes eh-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes eh-fire{0%,100%{background-position:50% 0%}50%{background-position:50% 100%}}
@keyframes eh-aurora{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes eh-pulse{0%,100%{box-shadow:0 0 4px var(--ec)}50%{box-shadow:0 0 14px var(--ec)}}
@keyframes eh-wave{0%,100%{height:4px}50%{height:18px}}
`;

const designs = [

// ══ SHAPES 1–10 ══════════════════════════════════════════════════════════════

{ id:1, name:'Bullseye Target', desc:'טבעות מטרה קישוטיות — 🎯', bg:'#050510',
  render(p) {
    return <div style={{ position:'relative', overflow:'hidden', background:rb(p.rank), border:`2px solid ${rc(p.rank)}`, borderRadius:12, padding:'10px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      {top(p.rank)&&[70,48,28].map(s=><div key={s} style={{ position:'absolute', right:-s/2, top:'50%', transform:'translateY(-50%)', width:s, height:s, borderRadius:'50%', border:`1px solid ${rc(p.rank)}${s>60?'15':s>40?'25':'40'}`, pointerEvents:'none' }} />)}
      <span style={{ fontSize:20, flexShrink:0, position:'relative' }}>🎯</span>
      <div style={{ flex:1, textAlign:'center', position:'relative' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:rc(p.rank), fontWeight:900, fontSize:22, lineHeight:1 }}>{p.hits}</div>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>מתוך {p.total}</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:11, opacity:0.7, position:'relative' }}>#{p.rank}</span>
    </div>;
  }
},

{ id:2, name:'Dart Arrow', desc:'חץ/דארט — מכוון ימינה', bg:'#0d1117',
  render(p) {
    return <div style={{ clipPath:'polygon(0 0,calc(100% - 14px) 0,100% 50%,calc(100% - 14px) 100%,0 100%)', background:rb(p.rank), outline:`1px solid ${rc(p.rank)}44`, padding:'10px 28px 10px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:10, borderRadius:4 }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:15 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#4ade80', fontSize:11 }}>{p.hits} פגיעות מדויקות</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:20 }}>{p.hits}</span>
    </div>;
  }
},

{ id:3, name:'Pentagon Shield', desc:'מגן — צורת חמישית', bg:'#0d1117',
  render(p) {
    return <div style={{ clipPath:'polygon(15% 0,85% 0,100% 25%,100% 65%,50% 100%,0 65%,0 25%)', background:top(p.rank)?rb(p.rank):'rgba(255,255,255,0.04)', outline:`1px solid ${rc(p.rank)}44`, padding:'12px 16px 26px', marginBottom:14, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, minHeight:76 }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:11, letterSpacing:1 }}>#{p.rank}</span>
      <span style={{ color:'#fff', fontWeight:700, fontSize:12 }}>{p.name}</span>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:20 }}>{p.hits}🎯</span>
    </div>;
  }
},

{ id:4, name:'Double Cut Corner', desc:'שתי פינות חתוכות — מדויק', bg:'#0d1117',
  render(p) {
    return <div style={{ clipPath:'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)', background:rb(p.rank), outline:`1px solid ${rc(p.rank)}44`, padding:'10px 16px', marginBottom:10, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#34C759', fontSize:11, fontWeight:700 }}>{p.hits} / {p.total} • {p.pct}%</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:20 }}>{p.hits}</span>
    </div>;
  }
},

{ id:5, name:'Pill Capsule', desc:'כמוסה עגולה — נקי ואלגנטי', bg:'#0d1117',
  render(p) {
    return <div style={{ background:rb(p.rank), border:`1.5px solid ${rc(p.rank)}55`, borderRadius:999, padding:'8px 20px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:28, height:28, borderRadius:'50%', background:`${rc(p.rank)}22`, border:`1.5px solid ${rc(p.rank)}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:13 }}>{p.rank}</span>
      </div>
      <span style={{ color:'#fff', fontWeight:700, fontSize:13, flex:1 }}>{p.name}</span>
      <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:20 }}>{p.hits}</span>
        <span style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>/{p.total}</span>
      </div>
    </div>;
  }
},

{ id:6, name:'Hexagon Tile', desc:'משושה — כמו כדורגל', bg:'#080f1a',
  render(p) {
    return <div style={{ clipPath:'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)', background:top(p.rank)?rb(p.rank):'rgba(255,255,255,0.05)', outline:`1px solid ${rc(p.rank)}33`, padding:'14px 28px', marginBottom:12, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:24, lineHeight:1 }}>{p.hits}</span>
      <span style={{ color:'#fff', fontWeight:600, fontSize:12 }}>{p.name}</span>
      <span style={{ color:'rgba(255,255,255,0.4)', fontSize:9 }}>פגיעות</span>
    </div>;
  }
},

{ id:7, name:'Notched Octagon', desc:'שמונה קצוות גזורים', bg:'#0d1117',
  render(p) {
    return <div style={{ clipPath:'polygon(8px 0,calc(100% - 8px) 0,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0 calc(100% - 8px),0 8px)', background:rb(p.rank), outline:`1px solid ${rc(p.rank)}44`, padding:'10px 16px', marginBottom:10, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:22 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#34C759', fontSize:11 }}>{p.hits} פגיעות • {p.pct}%</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:20 }}>{p.hits}</span>
    </div>;
  }
},

{ id:8, name:'Stadium Arch', desc:'קשת אצטדיון — כניסה לשדה', bg:'#0a1020',
  render(p) {
    return <div style={{ background:rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderRadius:'12px 12px 50% 50% / 12px 12px 22px 22px', padding:'10px 16px 16px', marginBottom:10, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#34C759', fontSize:11, fontWeight:700 }}>{p.hits} / {p.total}</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:20 }}>{p.hits}</span>
    </div>;
  }
},

{ id:9, name:'Ticket Perforated', desc:'כרטיס כניסה עם קצה מחורר', bg:'#0d1117',
  render(p) {
    return <div style={{ display:'flex', marginBottom:8 }}>
      <div style={{ flex:1, background:rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderRight:'none', borderRadius:'10px 0 0 10px', padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:15 }}>{p.rank}</span>
        <div>
          <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
          <div style={{ color:'#34C759', fontSize:11 }}>{p.hits} פגיעות מדויקות</div>
        </div>
      </div>
      <div style={{ width:1, background:`repeating-linear-gradient(to bottom,${rc(p.rank)}66 0,${rc(p.rank)}66 5px,transparent 5px,transparent 9px)`, margin:'4px 0' }} />
      <div style={{ width:44, background:rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderLeft:'none', borderRadius:'0 10px 10px 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1 }}>
        <span style={{ color:rc(p.rank), fontSize:18, fontWeight:900 }}>{p.hits}</span>
        <span style={{ fontSize:10 }}>🎯</span>
      </div>
    </div>;
  }
},

{ id:10, name:'Left Accent Rail', desc:'פס שמאלי עם אייקון מיקום', bg:'#0d1117',
  render(p) {
    return <div style={{ display:'flex', marginBottom:8, borderRadius:10, overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ width:36, background:rb(p.rank), borderRight:`1px solid ${rc(p.rank)}33`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2 }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, lineHeight:1 }}>{p.rank}</span>
        <span style={{ fontSize:9 }}>🎯</span>
      </div>
      <div style={{ flex:1, background:'rgba(255,255,255,0.03)', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ color:'rgba(255,255,255,0.85)', fontWeight:700, fontSize:13 }}>{p.name}</span>
        <div>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:18 }}>{p.hits}</span>
          <span style={{ color:'rgba(255,255,255,0.3)', fontSize:10 }}>/{p.total}</span>
        </div>
      </div>
    </div>;
  }
},

// ══ MATERIALS 11–20 ══════════════════════════════════════════════════════════

{ id:11, name:'Liquid Glass', desc:'זכוכית נוזלית — Apple style', bg:'linear-gradient(135deg,#1a2a4a,#0d1f3c)',
  render(p) {
    return <div style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(20px) saturate(180%)', WebkitBackdropFilter:'blur(20px) saturate(180%)', border:'1px solid rgba(255,255,255,0.20)', borderRadius:14, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10, boxShadow:'0 4px 24px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.3)' }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'rgba(255,255,255,0.9)', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#5AC8FA', fontSize:11, fontWeight:700 }}>{p.hits} פגיעות • {p.pct}%</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:22 }}>{p.hits}</span>
    </div>;
  }
},

{ id:12, name:'Neon Cyberpunk', desc:'ניאון סייברפאנק — זוהר עז', bg:'#04001a',
  render(p) {
    const c=p.rank===1?'#b44fff':p.rank===2?'#00ffcc':p.rank===3?'#ff6bff':'#5555ff';
    return <div style={{ '--ec':`${c}aa`, background:'rgba(0,0,10,0.85)', border:`1px solid ${c}`, borderRadius:8, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10, animation:top(p.rank)?'eh-pulse 2s ease-in-out infinite':'none', boxShadow:top(p.rank)?`0 0 10px ${c}44`:'none' }}>
      <span style={{ color:c, fontWeight:900, fontSize:16, textShadow:`0 0 8px ${c}`, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#e0e0ff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#00ff88', fontSize:11, textShadow:'0 0 6px #00ff88' }}>{p.hits} exact hits</div>
      </div>
      <span style={{ color:c, fontWeight:900, fontSize:22, textShadow:`0 0 10px ${c}` }}>{p.hits}</span>
    </div>;
  }
},

{ id:13, name:'Carbon Fiber', desc:'סיבי פחמן — חשוך ועוצמתי', bg:'#060606',
  render(p) {
    return <div style={{ background:`repeating-linear-gradient(45deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 6px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 6px),#0a0a0a`, border:`1px solid ${rc(p.rank)}55`, borderRadius:8, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#e8e8e8', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#4CAF50', fontSize:11 }}>{p.hits} / {p.total}</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:20 }}>{p.hits}🎯</span>
    </div>;
  }
},

{ id:14, name:'Metallic Gradient', desc:'מתכת — זהב/כסף/ארד אמיתי', bg:'#111',
  render(p) {
    const grad=p.rank===1?'linear-gradient(135deg,#BF953F,#FCF6BA,#B38728,#FBF5B7)':p.rank===2?'linear-gradient(135deg,#8e9eab,#eef2f3,#8e9eab)':p.rank===3?'linear-gradient(135deg,#CD7F32,#E8974A,#8B4513)':'rgba(255,255,255,0.05)';
    return <div style={{ background:grad, border:top(p.rank)?'none':'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ color:top(p.rank)?'#1a1a1a':'rgba(255,255,255,0.4)', fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:top(p.rank)?'#1a1a1a':'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:top(p.rank)?'#1a4a1a':'#34C759', fontSize:11 }}>{p.hits} פגיעות מדויקות</div>
      </div>
      <span style={{ color:top(p.rank)?'#1a1a1a':'rgba(255,255,255,0.4)', fontWeight:900, fontSize:22 }}>{p.hits}</span>
    </div>;
  }
},

{ id:15, name:'Holographic', desc:'הולוגרפי קשת — ססגוניות', bg:'#04040e',
  render(p) {
    return <div style={{ background:top(p.rank)?'linear-gradient(135deg,#ff006699,#8338ec99,#3a86ff99,#06d6a099,#ffbe0b99)':'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10, backdropFilter:'blur(8px)' }}>
      <span style={{ color:'#fff', fontWeight:900, fontSize:16, textShadow:'0 0 6px #fff8', minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13, textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>{p.name}</div>
        <div style={{ color:'rgba(255,255,255,0.85)', fontSize:11 }}>{p.hits} פגיעות</div>
      </div>
      <span style={{ color:'#fff', fontWeight:900, fontSize:22, textShadow:'0 0 8px #fff' }}>{p.hits}</span>
    </div>;
  }
},

{ id:16, name:'Dark Velvet Gold', desc:'קטיפה כהה עם זהב יוקרתי', bg:'#0e0010',
  render(p) {
    return <div style={{ background:'linear-gradient(135deg,#1a0022,#2d0040)', border:`1px solid ${rc(p.rank)}55`, borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10, boxShadow:top(p.rank)?`inset 0 1px 0 rgba(255,255,255,0.1),0 4px 20px ${rc(p.rank)}22`:'none' }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'rgba(255,240,255,0.9)', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#c084fc', fontSize:11 }}>{p.hits} / {p.total} • {p.pct}%</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:22 }}>{p.hits}</span>
    </div>;
  }
},

{ id:17, name:'Neumorphic', desc:'נויומורפיזם — לחץ רך 3D', bg:'#e0e5ec',
  render(p) {
    return <div style={{ background:'#e0e5ec', borderRadius:14, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10, boxShadow:top(p.rank)?'inset 4px 4px 8px #b8bec7,inset -4px -4px 8px #ffffff':'4px 4px 10px #b8bec7,-4px -4px 10px #ffffff' }}>
      <span style={{ color:top(p.rank)?rc(p.rank):'#8a94a6', fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#4a5568', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#2d7a3d', fontSize:11, fontWeight:700 }}>{p.hits} פגיעות</div>
      </div>
      <span style={{ color:top(p.rank)?rc(p.rank):'#8a94a6', fontWeight:900, fontSize:22 }}>{p.hits}</span>
    </div>;
  }
},

{ id:18, name:'Fire Animated', desc:'אש ולבה — ראשונים בוערים', bg:'#0a0000',
  render(p) {
    const grad=p.rank===1?'linear-gradient(180deg,#ff6b00,#ff0000,#8b0000,#ff4500)':p.rank===2?'linear-gradient(180deg,#ff8c00,#cc4400,#661100)':p.rank===3?'linear-gradient(180deg,#e05000,#993300,#440000)':'rgba(255,255,255,0.04)';
    return <div style={{ background:top(p.rank)?grad:'rgba(255,255,255,0.04)', backgroundSize:'100% 200%', animation:top(p.rank)?'eh-fire 3s ease-in-out infinite':'none', border:`1px solid ${top(p.rank)?'#ff6b0066':'rgba(255,255,255,0.1)'}`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ color:top(p.rank)?'#fff':rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:top(p.rank)?'#ffe4a0':'#34C759', fontSize:11 }}>{p.hits} exact hits 🔥</div>
      </div>
      <span style={{ color:top(p.rank)?'#fff':rc(p.rank), fontWeight:900, fontSize:22 }}>{p.hits}</span>
    </div>;
  }
},

{ id:19, name:'Ice Crystal', desc:'קרח קריסטל — קר וחד', bg:'#010c1a',
  render(p) {
    const i=p.rank===1?1:p.rank===2?0.7:p.rank===3?0.5:0.2;
    return <div style={{ background:`rgba(0,${Math.round(100*i)},${Math.round(200*i)},0.18)`, border:`1px solid rgba(100,200,255,${i*0.5})`, borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10, boxShadow:top(p.rank)?`0 0 20px rgba(0,150,255,${i*0.3}),inset 0 1px 0 rgba(255,255,255,0.3)`:'none' }}>
      <span style={{ color:`rgba(100,220,255,${i+0.1})`, fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'rgba(220,240,255,0.9)', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#7dd3fc', fontSize:11 }}>{p.hits} פגיעות ❄️</div>
      </div>
      <span style={{ color:`rgba(100,220,255,${i+0.1})`, fontWeight:900, fontSize:22 }}>{p.hits}</span>
    </div>;
  }
},

{ id:20, name:'Aurora Borealis', desc:'זוהר צפוני — אנימציה', bg:'#020814',
  render(p) {
    return <div style={{ position:'relative', overflow:'hidden', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:2, marginBottom:8 }}>
      {top(p.rank)&&<div style={{ position:'absolute', inset:0, background:'linear-gradient(270deg,#00ff87,#60efff,#a855f7,#00ff87)', backgroundSize:'400% 100%', animation:'eh-aurora 5s ease infinite', opacity:0.22, pointerEvents:'none' }} />}
      <div style={{ position:'relative', background:'rgba(2,8,20,0.88)', borderRadius:10, padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
        <div style={{ flex:1, textAlign:'center' }}>
          <div style={{ color:'#e0f7fa', fontWeight:700, fontSize:13 }}>{p.name}</div>
          <div style={{ color:'#00ff87', fontSize:11 }}>{p.hits} פגיעות</div>
        </div>
        <span style={{ color:'#00ff87', fontWeight:900, fontSize:22 }}>{p.hits}</span>
      </div>
    </div>;
  }
},

// ══ DATA VISUALIZATION 21–30 ═════════════════════════════════════════════════

{ id:21, name:'Dot Matrix', desc:'נקודות ●/○ — פגיעות מול החטאות', bg:'#0d1117',
  render(p) {
    return <div style={{ background:rb(p.rank), border:`1px solid ${rc(p.rank)}33`, borderRadius:12, padding:'10px 14px', marginBottom:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:13 }}>#{p.rank} {p.name}</span>
        <span style={{ color:'#34C759', fontWeight:900, fontSize:14 }}>{p.hits}🎯/{p.total}</span>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
        {Array.from({length:p.total},(_,i)=><span key={i} style={{ color:i<p.hits?rc(p.rank):'rgba(255,255,255,0.15)', fontSize:11 }}>{i<p.hits?'●':'○'}</span>)}
      </div>
    </div>;
  }
},

{ id:22, name:'Progress Bar Fill', desc:'מילוי רוחב לפי אחוז פגיעות', bg:'#0d1117',
  render(p) {
    return <div style={{ position:'relative', overflow:'hidden', background:'rgba(255,255,255,0.04)', border:`1px solid ${rc(p.rank)}33`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${p.pct}%`, background:`${rc(p.rank)}18` }} />
      <span style={{ position:'relative', color:rc(p.rank), fontWeight:900, fontSize:15, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, position:'relative' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#34C759', fontSize:11 }}>{p.hits}/{p.total} פגיעות</div>
      </div>
      <span style={{ position:'relative', color:rc(p.rank), fontWeight:900, fontSize:13 }}>{p.pct}%</span>
    </div>;
  }
},

{ id:23, name:'SVG Arc Progress', desc:'קשת SVG עגולה — מד התקדמות', bg:'#0d1117',
  render(p) {
    const r=18, circ=2*Math.PI*r, off=circ*(1-p.pct/100);
    return <div style={{ background:rb(p.rank), border:`1px solid ${rc(p.rank)}33`, borderRadius:12, padding:'8px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
      <svg width="48" height="48" style={{ flexShrink:0 }}>
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
        <circle cx="24" cy="24" r={r} fill="none" stroke={rc(p.rank)} strokeWidth="3.5" strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 24 24)"/>
        <text x="24" y="28" textAnchor="middle" fill={rc(p.rank)} fontSize="11" fontWeight="900">{p.hits}</text>
      </svg>
      <div style={{ flex:1 }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>מתוך {p.total} • {p.pct}%</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:11 }}>#{p.rank}</span>
    </div>;
  }
},

{ id:24, name:'Hit Pills Row', desc:'גלולה צבעונית לכל ניחוש', bg:'#0d1117',
  render(p) {
    return <div style={{ background:rb(p.rank), border:`1px solid ${rc(p.rank)}33`, borderRadius:12, padding:'10px 14px', marginBottom:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:13 }}>#{p.rank} {p.name}</span>
        <span style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{p.hits}/{p.total}</span>
      </div>
      <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
        {Array.from({length:p.total},(_,i)=><div key={i} style={{ height:8, width:14, borderRadius:999, background:i<p.hits?rc(p.rank):'rgba(255,255,255,0.1)' }} />)}
      </div>
    </div>;
  }
},

{ id:25, name:'Heat Map Color', desc:'עוצמת צבע לפי פגיעות', bg:'#0d1117',
  render(p) {
    const t=p.hits/MAX, r=Math.round(255*t), g=Math.round(100*t), b=20;
    return <div style={{ background:`rgba(${r},${g},${b},0.18)`, border:`1px solid rgba(${r},${g},${b},0.5)`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:`rgb(${r},${Math.round(g+100)},${b+80})`, fontSize:11 }}>{p.hits} פגיעות</div>
      </div>
      <span style={{ color:`rgb(${r},${Math.round(g+60)},${b+40})`, fontWeight:900, fontSize:22 }}>{p.hits}</span>
    </div>;
  }
},

{ id:26, name:'Triple Split Stats', desc:'הפרדה לשלושה עמודות', bg:'#0d1117',
  render(p) {
    return <div style={{ display:'flex', background:'rgba(255,255,255,0.04)', border:`1px solid ${rc(p.rank)}33`, borderRadius:12, overflow:'hidden', marginBottom:8 }}>
      <div style={{ width:40, background:rb(p.rank), display:'flex', alignItems:'center', justifyContent:'center', borderRight:`1px solid ${rc(p.rank)}33` }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16 }}>{p.rank}</span>
      </div>
      <div style={{ flex:2, padding:'8px 12px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>מדויקות</div>
      </div>
      <div style={{ width:46, borderLeft:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:20 }}>{p.hits}</span>
        <span style={{ color:'rgba(255,255,255,0.3)', fontSize:9 }}>פגיעות</span>
      </div>
      <div style={{ width:46, borderLeft:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(52,199,89,0.08)' }}>
        <span style={{ color:'#34C759', fontWeight:700, fontSize:14 }}>{p.pct}%</span>
        <span style={{ color:'rgba(255,255,255,0.3)', fontSize:9 }}>אחוז</span>
      </div>
    </div>;
  }
},

{ id:27, name:'Milestone Line', desc:'ציוני דרך על קו זמן', bg:'#0d1117',
  render(p) {
    const marks=[0,3,6,9,12];
    return <div style={{ background:rb(p.rank), border:`1px solid ${rc(p.rank)}33`, borderRadius:10, padding:'10px 14px', marginBottom:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:12 }}>#{p.rank} {p.name}</span>
        <span style={{ color:'#34C759', fontWeight:700, fontSize:13 }}>{p.hits}🎯</span>
      </div>
      <div style={{ position:'relative', height:20 }}>
        <div style={{ position:'absolute', left:0, right:0, top:'50%', height:2, background:'rgba(255,255,255,0.1)', transform:'translateY(-50%)' }} />
        <div style={{ position:'absolute', left:0, top:'50%', height:2, width:`${(p.hits/MAX)*100}%`, background:rc(p.rank), transform:'translateY(-50%)' }} />
        {marks.map(m=><div key={m} style={{ position:'absolute', left:`${(m/MAX)*100}%`, top:'50%', transform:'translate(-50%,-50%)', width:8, height:8, borderRadius:'50%', background:m<=p.hits?rc(p.rank):'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)' }} />)}
      </div>
    </div>;
  }
},

{ id:28, name:'Stats 2×2 Grid', desc:'ארבעה ריבועי נתונים', bg:'#0d1117',
  render(p) {
    return <div style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${rc(p.rank)}33`, borderRadius:12, overflow:'hidden', marginBottom:8 }}>
      <div style={{ background:rb(p.rank), padding:'6px 14px', display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${rc(p.rank)}22` }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:13 }}>#{p.rank}</span>
        <span style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'rgba(255,255,255,0.05)' }}>
        {[['פגיעות',p.hits,rc(p.rank)],['סה״כ',p.total,'#7dd3fc'],['אחוז',p.pct+'%','#34C759'],['דירוג','#'+p.rank,'rgba(255,255,255,0.5)']].map(([l,v,c])=>(
          <div key={l} style={{ background:'rgba(13,17,23,0.9)', padding:'8px', textAlign:'center' }}>
            <div style={{ color:c, fontWeight:900, fontSize:16 }}>{v}</div>
            <div style={{ color:'rgba(255,255,255,0.35)', fontSize:9 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>;
  }
},

{ id:29, name:'Conic Pie Slice', desc:'עוגת עיגול — conic-gradient', bg:'#0d1117',
  render(p) {
    const deg=Math.round(p.pct*3.6);
    return <div style={{ background:rb(p.rank), border:`1px solid ${rc(p.rank)}33`, borderRadius:12, padding:'8px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:44, height:44, borderRadius:'50%', background:`conic-gradient(${rc(p.rank)} 0deg ${deg}deg,rgba(255,255,255,0.1) ${deg}deg 360deg)`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:30, height:30, borderRadius:'50%', background:'#0d1117', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:rc(p.rank), fontSize:10, fontWeight:900 }}>{p.pct}%</span>
        </div>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#34C759', fontSize:11 }}>{p.hits} פגיעות מדויקות</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:11 }}>#{p.rank}</span>
    </div>;
  }
},

{ id:30, name:'Wave Equalizer', desc:'גלים — אקולייזר מוזיקלי', bg:'#060606',
  render(p) {
    return <div style={{ position:'relative', overflow:'hidden', background:'#0a0a0a', border:`1px solid ${rc(p.rank)}44`, borderRadius:10, padding:'10px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ position:'absolute', right:8, bottom:4, display:'flex', alignItems:'flex-end', gap:2, opacity:0.2, height:24 }}>
        {Array.from({length:Math.max(4,p.hits)},(_,i)=><div key={i} style={{ width:3, background:rc(p.rank), borderRadius:1, height:`${30+Math.sin(i*0.9)*60}%`, animation:`eh-wave ${0.5+i*0.12}s ease-in-out infinite alternate` }} />)}
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:15, position:'relative', minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, position:'relative' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:rc(p.rank), fontSize:11 }}>{p.hits} exact hits</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:22, position:'relative' }}>{p.hits}</span>
    </div>;
  }
},

// ══ WORLD CUP / SOCCER 31–40 ═════════════════════════════════════════════════

{ id:31, name:'FIFA Card Style', desc:'כרטיס FIFA Ultimate Team', bg:'#0a1428',
  render(p) {
    const g=p.rank===1?'linear-gradient(160deg,#bf953f,#fcf6ba,#b38728)':p.rank===2?'linear-gradient(160deg,#8e9eab,#eef2f3,#8e9eab)':p.rank===3?'linear-gradient(160deg,#cd7f32,#e8974a,#8b4513)':'linear-gradient(160deg,#1a2a4a,#0d1f3c)';
    return <div style={{ background:g, borderRadius:10, padding:'10px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:10, boxShadow:'0 4px 16px rgba(0,0,0,0.5)' }}>
      <div style={{ textAlign:'center', flexShrink:0 }}>
        <div style={{ color:top(p.rank)?'#1a1a1a':'#fff', fontWeight:900, fontSize:26, lineHeight:1 }}>{p.hits}</div>
        <div style={{ color:top(p.rank)?'rgba(0,0,0,0.55)':'rgba(255,255,255,0.5)', fontSize:8, fontWeight:700, letterSpacing:1 }}>EXH</div>
      </div>
      <div style={{ width:1, background:top(p.rank)?'rgba(0,0,0,0.2)':'rgba(255,255,255,0.15)', alignSelf:'stretch' }} />
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:top(p.rank)?'#1a1a1a':'rgba(255,255,255,0.9)', fontWeight:800, fontSize:14, letterSpacing:0.5 }}>{p.name}</div>
        <div style={{ color:top(p.rank)?'rgba(0,0,0,0.45)':'rgba(255,255,255,0.4)', fontSize:9, marginTop:2 }}>{p.pct}% ACCURACY</div>
      </div>
      <div style={{ color:top(p.rank)?'#1a1a1a':'rgba(255,255,255,0.5)', fontWeight:900, fontSize:14 }}>#{p.rank}</div>
    </div>;
  }
},

{ id:32, name:'Goal Net Background', desc:'רשת שער ברקע', bg:'#001a00',
  render(p) {
    return <div style={{ position:'relative', background:`repeating-linear-gradient(0deg,rgba(255,255,255,0.07) 0,rgba(255,255,255,0.07) 1px,transparent 1px,transparent 16px),repeating-linear-gradient(90deg,rgba(255,255,255,0.07) 0,rgba(255,255,255,0.07) 1px,transparent 1px,transparent 16px),rgba(0,30,0,0.85)`, border:`1px solid ${rc(p.rank)}55`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:20, position:'relative' }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center', position:'relative' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#4ade80', fontSize:11 }}>{p.hits} שערים מדויקים ⚽</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:22, position:'relative' }}>{p.hits}</span>
    </div>;
  }
},

{ id:33, name:'Jersey Number', desc:'חולצת ספורט — ספרה ענקית ברקע', bg:'#0d1117',
  render(p) {
    return <div style={{ position:'relative', overflow:'hidden', background:`repeating-linear-gradient(90deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 8px),${rb(p.rank)}`, border:`1px solid ${rc(p.rank)}44`, borderRadius:10, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ position:'absolute', right:6, top:'50%', transform:'translateY(-50%)', fontSize:52, fontWeight:900, color:rc(p.rank), opacity:0.10, lineHeight:1, fontStyle:'italic', pointerEvents:'none' }}>{p.rank}</span>
      <span style={{ position:'relative', color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center', position:'relative' }}>
        <div style={{ color:'#fff', fontWeight:800, fontSize:13, letterSpacing:1, textTransform:'uppercase' }}>{p.name}</div>
        <div style={{ color:'#34C759', fontSize:11 }}>{p.hits} / {p.total} ⚽</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:22, position:'relative' }}>{p.hits}</span>
    </div>;
  }
},

{ id:34, name:'VAR Review', desc:'בחינת VAR — מסגרת ניתוח', bg:'#0a0a00',
  render(p) {
    return <div style={{ position:'relative', background:'#0f0f00', border:`2px solid ${top(p.rank)?'#ffff00':'#333'}`, borderRadius:6, padding:'10px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:10, boxShadow:top(p.rank)?'0 0 10px #ffff0033':'' }}>
      <div style={{ background:'#ffff00', color:'#000', padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:900, flexShrink:0 }}>VAR</div>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#e8e800', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#fff', fontSize:11 }}>EXACT HITS: {p.hits}/{p.total}</div>
      </div>
      <span style={{ color:'#ffff00', fontWeight:900, fontSize:22 }}>{p.hits}</span>
    </div>;
  }
},

{ id:35, name:'LED Scoreboard', desc:'לוח LED דיגיטלי של אצטדיון', bg:'#040404',
  render(p) {
    return <div style={{ background:'#030303', border:`2px solid ${rc(p.rank)}88`, borderRadius:4, padding:'8px 12px', marginBottom:6, display:'flex', alignItems:'center', gap:10, fontFamily:"'Courier New',monospace" }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, textShadow:`0 0 6px ${rc(p.rank)}`, minWidth:22 }}>{String(p.rank).padStart(2,'0')}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#00ff41', fontSize:12, letterSpacing:2, textShadow:'0 0 4px #00ff41' }}>{p.name}</div>
        <div style={{ color:'#ff6600', fontSize:10, textShadow:'0 0 4px #ff6600' }}>EXACT:{p.hits}</div>
      </div>
      <span style={{ color:rc(p.rank), fontSize:22, fontWeight:900, textShadow:`0 0 8px ${rc(p.rank)}` }}>{p.hits}</span>
    </div>;
  }
},

{ id:36, name:'Trophy Badge', desc:'עיצוב גביע — כרטיס הישג', bg:'#0d1117',
  render(p) {
    const icons=['🏆','🥈','🥉','🎖️','🎗️'];
    return <div style={{ background:'linear-gradient(135deg,#1a1f2e,#0d1117)', border:`1px solid ${rc(p.rank)}44`, borderRadius:12, padding:'8px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:40, height:40, borderRadius:8, background:rb(p.rank), border:`2px solid ${rc(p.rank)}66`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>{icons[p.rank-1]||'🎗️'}</div>
      <div style={{ flex:1 }}>
        <div style={{ color:'rgba(255,255,255,0.45)', fontSize:9, fontWeight:700, letterSpacing:1 }}>EXACT HITS LEADER #{p.rank}</div>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ color:rc(p.rank), fontWeight:900, fontSize:24 }}>{p.hits}</div>
        <div style={{ color:'rgba(255,255,255,0.35)', fontSize:9 }}>פגיעות</div>
      </div>
    </div>;
  }
},

{ id:37, name:'Grass Pitch', desc:'דשא ירוק — מגרש כדורגל', bg:'#001400',
  render(p) {
    return <div style={{ background:`repeating-linear-gradient(180deg,rgba(255,255,255,0.025) 0,rgba(255,255,255,0.025) 1px,transparent 1px,transparent 10px),linear-gradient(180deg,rgba(0,60,0,0.9),rgba(0,40,0,0.9))`, border:`1px solid rgba(0,200,0,${top(p.rank)?0.4:0.15})`, borderRadius:8, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ color:top(p.rank)?'#7fff00':rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:'#e8ffe8', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#7fff00', fontSize:11 }}>{p.hits} ⚽ exact</div>
      </div>
      <span style={{ color:top(p.rank)?'#7fff00':rc(p.rank), fontWeight:900, fontSize:22 }}>{p.hits}</span>
    </div>;
  }
},

{ id:38, name:'Referee Card', desc:'כרטיס שופט — צהוב/אדום', bg:'#0d1117',
  render(p) {
    const col=p.rank===1?'#ef4444':p.rank===2?'#f59e0b':p.rank===3?'#f97316':'rgba(255,255,255,0.1)';
    return <div style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${rc(p.rank)}33`, borderRadius:10, padding:'10px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:24, height:32, borderRadius:3, background:col, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:top(p.rank)?`0 0 8px ${col}88`:'' }}>
        <span style={{ color:'#fff', fontWeight:900, fontSize:11 }}>{p.rank}</span>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#34C759', fontSize:11 }}>{p.hits} פגיעות מדויקות</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:22 }}>{p.hits}</span>
    </div>;
  }
},

{ id:39, name:'Soccer Ball Pattern', desc:'טקסטורת כדורגל', bg:'#050a00',
  render(p) {
    return <div style={{ position:'relative', overflow:'hidden', background:`repeating-conic-gradient(rgba(255,255,255,0.03) 0% 16.7%,transparent 16.7% 33.3%) 0 0/10px 10px,rgba(5,15,5,0.95)`, border:`1px solid rgba(100,200,50,${top(p.rank)?0.4:0.15})`, borderRadius:999, padding:'9px 20px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:15, position:'relative', minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center', position:'relative' }}>
        <div style={{ color:'#e8ffe8', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#7fff00', fontSize:11 }}>{p.hits} ⚽ • {p.pct}%</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:22, position:'relative' }}>{p.hits}</span>
    </div>;
  }
},

{ id:40, name:'Captain Armband', desc:'כפפת קפטן — פס זהוב', bg:'#0d1117',
  render(p) {
    return <div style={{ display:'flex', marginBottom:8 }}>
      <div style={{ width:10, background:top(p.rank)?`linear-gradient(180deg,${rc(p.rank)},${rc(p.rank)}88)`:'rgba(255,255,255,0.1)', borderRadius:'10px 0 0 10px', flexShrink:0 }} />
      <div style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderLeft:'none', borderRadius:'0 10px 10px 0', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:15 }}>{p.rank}</span>
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
            <div style={{ color:'#34C759', fontSize:11 }}>{p.hits}/{p.total} פגיעות</div>
          </div>
        </div>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:22 }}>{p.hits}</span>
      </div>
    </div>;
  }
},

// ══ SPECIAL EFFECTS 41–50 ════════════════════════════════════════════════════

{ id:41, name:'Shimmer Gold', desc:'ברק זהב נע — אנימציה', bg:'#0d1117',
  render(p) {
    return <div style={{ position:'relative', overflow:'hidden', background:rb(p.rank), border:`1px solid ${rc(p.rank)}55`, borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      {top(p.rank)&&<div style={{ position:'absolute', inset:0, background:`linear-gradient(90deg,transparent 0%,${rc(p.rank)}22 50%,transparent 100%)`, backgroundSize:'200% 100%', animation:'eh-shimmer 2s linear infinite', pointerEvents:'none' }} />}
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, position:'relative', minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center', position:'relative' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#34C759', fontSize:11 }}>{p.hits} פגיעות ✨</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:24, position:'relative' }}>{p.hits}</span>
    </div>;
  }
},

{ id:42, name:'Star Burst Deco', desc:'פיצוץ כוכבים לשלושת הראשונים', bg:'#040410',
  render(p) {
    const stars=['✦','✧','★','☆','✴'];
    return <div style={{ position:'relative', overflow:'hidden', background:rb(p.rank), border:`1px solid ${rc(p.rank)}44`, borderRadius:12, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      {top(p.rank)&&stars.slice(0,p.rank===1?5:p.rank===2?3:2).map((s,i)=>(
        <span key={i} style={{ position:'absolute', color:rc(p.rank), opacity:0.12+i*0.04, fontSize:10+i*4, top:`${8+i*20}%`, right:`${4+i*9}%`, transform:`rotate(${i*40}deg)`, pointerEvents:'none' }}>{s}</span>
      ))}
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, position:'relative', minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center', position:'relative' }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:'#fbbf24', fontSize:11 }}>{p.hits} פגיעות מדויקות</div>
      </div>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:24, position:'relative' }}>{p.hits}</span>
    </div>;
  }
},

{ id:43, name:'Breaking News', desc:'חדשות דחופות — כותרת עיתון', bg:'#f0e8d0',
  render(p) {
    return <div style={{ background:'#f5f0e8', padding:'8px 12px', marginBottom:6, display:'flex', alignItems:'center', gap:10, borderLeft:`6px solid ${top(p.rank)?rc(p.rank):'#555'}`, boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
      {top(p.rank)&&<span style={{ background:'#cc0000', color:'#fff', padding:'2px 6px', fontSize:9, fontWeight:900, letterSpacing:1, flexShrink:0, fontFamily:'Georgia,serif' }}>BREAKING</span>}
      <div style={{ flex:1 }}>
        <div style={{ color:'#1a1208', fontWeight:900, fontSize:14, fontFamily:'Georgia,serif' }}>{p.name}</div>
        <div style={{ color:'#5a4a20', fontSize:10, fontFamily:'Georgia,serif' }}>רשם {p.hits} פגיעות מדויקות מתוך {p.total}</div>
      </div>
      <span style={{ color:top(p.rank)?rc(p.rank):'#555', fontWeight:900, fontSize:24, fontFamily:'Georgia,serif' }}>{p.hits}</span>
    </div>;
  }
},

{ id:44, name:'Achievement Unlock', desc:'הישג נפתח — סגנון משחק', bg:'#0d1117',
  render(p) {
    return <div style={{ background:'linear-gradient(135deg,#1a1f2e,#0d1117)', border:`1px solid ${rc(p.rank)}44`, borderRadius:14, padding:'8px 12px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:40, height:40, borderRadius:10, background:rb(p.rank), border:`2px solid ${rc(p.rank)}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>🎯</div>
      <div style={{ flex:1 }}>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:9, fontWeight:700, letterSpacing:1 }}>ACHIEVEMENT UNLOCKED</div>
        <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
        <div style={{ color:rc(p.rank), fontSize:10 }}>{p.hits} EXACT HITS · RANK #{p.rank}</div>
      </div>
      <div style={{ background:rc(p.rank), borderRadius:8, padding:'4px 10px' }}>
        <span style={{ color:'#000', fontWeight:900, fontSize:18 }}>{p.hits}</span>
      </div>
    </div>;
  }
},

{ id:45, name:'Podium Heights', desc:'גובה כרטיס לפי מיקום — פודיום', bg:'#0d1117',
  render(p, i) {
    const h=[74,62,54,46,42];
    return <div style={{ background:rb(p.rank), border:`2px solid ${rc(p.rank)}`, borderRadius:10, height:h[i]||42, marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'0 14px', overflow:'hidden' }}>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:16, minWidth:20 }}>{p.rank}</span>
      <span style={{ color:'#fff', fontWeight:700, fontSize:13, flex:1 }}>{p.name}</span>
      <span style={{ color:rc(p.rank), fontWeight:900, fontSize:22 }}>{p.hits}🎯</span>
    </div>;
  }
},

{ id:46, name:'Comic Book Pop', desc:'קומיקס — פופ ארט עם האלפטון', bg:'#fff5e0',
  render(p) {
    return <div style={{ background:`radial-gradient(circle,rgba(255,200,0,0.15) 1px,transparent 1px) 0 0/8px 8px,${top(p.rank)?'#fff8e1':'#f5f5f5'}`, border:`3px solid #111`, borderRadius:4, padding:'8px 12px', marginBottom:8, display:'flex', alignItems:'center', gap:10, boxShadow:`3px 3px 0 ${rc(p.rank)}` }}>
      <span style={{ color:top(p.rank)?rc(p.rank):'#333', fontWeight:900, fontSize:20, fontFamily:'Impact,sans-serif', minWidth:22, WebkitTextStroke:'1px #111' }}>{p.rank}</span>
      <div style={{ flex:1 }}>
        <div style={{ color:'#111', fontWeight:900, fontSize:14, fontFamily:'Impact,sans-serif', letterSpacing:1 }}>{p.name}</div>
        <div style={{ color:'#cc2200', fontWeight:700, fontSize:11 }}>EXACT: {p.hits}!!</div>
      </div>
      <div style={{ background:rc(p.rank), border:'2px solid #111', borderRadius:4, padding:'2px 8px' }}>
        <span style={{ color:'#111', fontWeight:900, fontSize:20, fontFamily:'Impact' }}>{p.hits}</span>
      </div>
    </div>;
  }
},

{ id:47, name:'Matrix Code', desc:'גשם קוד ירוק — מטריקס', bg:'#000',
  render(p) {
    return <div style={{ position:'relative', overflow:'hidden', background:'#001200', border:`1px solid #00ff41${top(p.rank)?'66':'22'}`, borderRadius:6, padding:'10px 14px', marginBottom:6, display:'flex', alignItems:'center', gap:10, fontFamily:"'Courier New',monospace" }}>
      <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.02) 2px,rgba(0,255,65,0.02) 4px)', pointerEvents:'none' }} />
      <span style={{ color:'#00ff41', fontWeight:900, fontSize:15, textShadow:'0 0 6px #00ff41', position:'relative' }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center', position:'relative' }}>
        <div style={{ color:'#00ff41', fontWeight:700, fontSize:13, textShadow:'0 0 4px #00ff41' }}>{p.name}</div>
        <div style={{ color:'#00cc33', fontSize:11 }}>HITS::{p.hits}/{p.total}</div>
      </div>
      <span style={{ color:'#00ff41', fontWeight:900, fontSize:22, position:'relative', textShadow:'0 0 8px #00ff41' }}>{p.hits}</span>
    </div>;
  }
},

{ id:48, name:'Neon Retro Sign', desc:'שלט ניאון רטרו', bg:'#020008',
  render(p) {
    const cols=['#ff006e','#00ffff','#ff8c00'];
    const c=top(p.rank)?cols[p.rank-1]:'rgba(255,255,255,0.25)';
    return <div style={{ background:'rgba(0,0,5,0.9)', border:`2px solid ${c}`, borderRadius:8, padding:'10px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:10, boxShadow:top(p.rank)?`0 0 10px ${c}44,0 0 28px ${c}18,inset 0 0 10px ${c}11`:'none' }}>
      <span style={{ color:c, fontWeight:900, fontSize:16, fontFamily:'monospace', textShadow:top(p.rank)?`0 0 6px ${c},0 0 12px ${c}`:'none', minWidth:20 }}>{p.rank}</span>
      <div style={{ flex:1, textAlign:'center' }}>
        <div style={{ color:top(p.rank)?'#fff':'rgba(255,255,255,0.6)', fontWeight:700, fontSize:13, fontFamily:'monospace', textShadow:top(p.rank)?`0 0 4px ${c}`:'none' }}>{p.name}</div>
        <div style={{ color:c, fontSize:11, textShadow:top(p.rank)?`0 0 6px ${c}`:'none' }}>⟩ {p.hits} EXACT ⟨</div>
      </div>
      <span style={{ color:c, fontWeight:900, fontSize:24, fontFamily:'monospace', textShadow:top(p.rank)?`0 0 8px ${c},0 0 20px ${c}`:'none' }}>{p.hits}</span>
    </div>;
  }
},

{ id:49, name:'Pixel Art 8-bit', desc:'פיקסל ארט רטרו — 8 ביט', bg:'#000',
  render(p) {
    const c=top(p.rank)?rc(p.rank):'#555';
    return <div style={{ background:'#111', border:`2px solid ${c}`, borderRadius:0, padding:'8px 12px', marginBottom:6, display:'flex', alignItems:'center', gap:10, boxShadow:`3px 3px 0 ${c}44`, fontFamily:"'Courier New',monospace" }}>
      <span style={{ color:c, fontWeight:700, fontSize:14 }}>{String(p.rank).padStart(2,'0')}.</span>
      <div style={{ flex:1 }}>
        <div style={{ color:'#0f0', fontSize:12, letterSpacing:2 }}>{p.name.toUpperCase()}</div>
        <div style={{ display:'flex', gap:2, marginTop:3 }}>
          {Array.from({length:MAX},(_,i)=><div key={i} style={{ width:6, height:6, background:i<p.hits?c:'#222' }} />)}
        </div>
      </div>
      <span style={{ color:c, fontWeight:700, fontSize:20 }}>{p.hits}</span>
    </div>;
  }
},

{ id:50, name:'Constellation Map', desc:'מפת כוכבים קשורים', bg:'#010610',
  render(p) {
    const pts=[[14,10],[38,20],[58,8],[78,18],[94,10],[50,32],[70,26]].slice(0,Math.max(3,p.hits));
    return <div style={{ position:'relative', overflow:'hidden', background:'rgba(1,6,16,0.9)', border:`1px solid ${rc(p.rank)}33`, borderRadius:12, padding:'10px 14px', marginBottom:8 }}>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:top(p.rank)?0.28:0.1 }} viewBox="0 0 120 46" preserveAspectRatio="none">
        {pts.map((pt,i)=><circle key={i} cx={pt[0]} cy={pt[1]} r={i===0?2.5:1.5} fill={rc(p.rank)} />)}
        {pts.slice(1).map((pt,i)=><line key={i} x1={pts[i][0]} y1={pts[i][1]} x2={pt[0]} y2={pt[1]} stroke={rc(p.rank)} strokeWidth="0.6" />)}
      </svg>
      <div style={{ position:'relative', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:15, minWidth:20 }}>{p.rank}</span>
        <div style={{ flex:1, textAlign:'center' }}>
          <div style={{ color:'#dde8ff', fontWeight:700, fontSize:13 }}>{p.name}</div>
          <div style={{ color:'#7cb9ff', fontSize:11 }}>{p.hits} פגיעות ✦</div>
        </div>
        <span style={{ color:rc(p.rank), fontWeight:900, fontSize:24 }}>{p.hits}</span>
      </div>
    </div>;
  }
},

]; // ── end designs ──────────────────────────────────────────────────────────

const CATS = [
  { id:'all',      label:'הכול (50)' },
  { id:'shape',    label:'צורות',    ids:[1,2,3,4,5,6,7,8,9,10] },
  { id:'material', label:'חומרים',   ids:[11,12,13,14,15,16,17,18,19,20] },
  { id:'dataviz',  label:'דאטה',     ids:[21,22,23,24,25,26,27,28,29,30] },
  { id:'worldcup', label:'מונדיאל',  ids:[31,32,33,34,35,36,37,38,39,40] },
  { id:'special',  label:'אפקטים',   ids:[41,42,43,44,45,46,47,48,49,50] },
];

export default function AdminExactHitsDemo() {
  const [filter, setFilter] = useState('all');
  const visible = filter==='all' ? designs : designs.filter(d=>CATS.find(c=>c.id===filter)?.ids?.includes(d.id));

  return (
    <div dir="rtl" style={{ color:'#fff', fontFamily:'system-ui,sans-serif' }}>
      <style>{SCOPED_CSS}</style>
      <h1 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>50 רעיונות עיצוב — Exact Hits</h1>
      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginBottom:20 }}>
        כל כרטיס: שם • פגיעות מדויקות • סה"כ ניחושים • אחוזים. סנן לפי קטגוריה.
      </p>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
        {CATS.map(c=>(
          <button key={c.id} onClick={()=>setFilter(c.id)} style={{ padding:'6px 14px', borderRadius:999, border:'1px solid rgba(255,255,255,0.2)', background:filter===c.id?'#FFD700':'rgba(255,255,255,0.06)', color:filter===c.id?'#000':'#fff', fontWeight:700, fontSize:12, cursor:'pointer', transition:'all 0.15s' }}>
            {c.label}
          </button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:24 }}>
        {visible.map(d=>(
          <div key={d.id}>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:10 }}>
              <span style={{ background:'#FF6B00', color:'#fff', borderRadius:999, width:22, height:22, display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:11, flexShrink:0 }}>{d.id}</span>
              <div>
                <div style={{ fontWeight:800, fontSize:13 }}>{d.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{d.desc}</div>
              </div>
            </div>
            <div style={{ background:d.bg.startsWith('linear')?d.bg:d.bg, borderRadius:14, padding:12, border:'1px solid rgba(255,255,255,0.08)' }}>
              {mock.map((p,i)=><div key={p.rank}>{d.render(p,i)}</div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
