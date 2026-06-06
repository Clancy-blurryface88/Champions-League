import React, { useState } from 'react';
import { motion } from 'framer-motion';

const mock = [
  { rank:1, name:'שחקן 2', hits:12, total:24, pct:50 },
  { rank:2, name:'שחקן 4', hits:9,  total:22, pct:41 },
  { rank:3, name:'שחקן 1', hits:8,  total:20, pct:40 },
  { rank:4, name:'שחקן 3', hits:6,  total:23, pct:26 },
  { rank:5, name:'שחקן 5', hits:4,  total:18, pct:22 },
];

const MAX = 12;
const rc  = r => r===1?'#FFD700':r===2?'#C0C0C0':r===3?'#CD7F32':'rgba(255,255,255,0.35)';
const top = r => r <= 3;

/* ── Framer Motion variants ── */
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const itemUp = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1,   transition: { type:'spring', duration:0.5, bounce:0.15 } },
};
const itemClip = {
  hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
  show:   { opacity: 1, clipPath: 'inset(0 0%   0 0)', transition: { duration: 0.38, ease: [0.23,1,0.32,1] } },
};
const itemSlide = {
  hidden: { opacity: 0, x: -28 },
  show:   { opacity: 1, x: 0,    transition: { type:'spring', stiffness:300, damping:26 } },
};
const itemPop = {
  hidden: { opacity: 0, scale: 0.82 },
  show:   { opacity: 1, scale: 1,    transition: { type:'spring', duration:0.55, bounce:0.35 } },
};

const SCOPED = `
@keyframes eh2-flicker{0%,94%,100%{opacity:1}95%{opacity:0.25}97%{opacity:1}98%{opacity:0.6}}
@keyframes eh2-scan{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
@keyframes eh2-spin{to{transform:rotate(360deg)}}
`;

/* ════════════════════════════════════════════════════════ DESIGNS ═══ */
const designs = [

/* 1 ─ BRUTALIST ─────────────────────────────────────────────────────── */
{ id:1, name:'Brutalist Raw', desc:'לבן גס, גבולות עבים — Brutalism',
  bg:'#f5f0e8',
  render(p,i) {
    const accents=['#E8112D','#003DA6','#FFD700','#1a1a1a','#E8112D'];
    const acc=accents[i];
    return (
      <motion.div variants={itemUp} style={{ display:'flex', alignItems:'stretch', borderTop:`6px solid ${acc}`, border:`2px solid #111`, borderTop:`6px solid ${acc}`, marginBottom:5, background:'#fff' }}>
        <div style={{ width:36, background:acc, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ color:'#fff', fontWeight:900, fontSize:18, fontFamily:'Arial Black,Impact,sans-serif' }}>{p.rank}</span>
        </div>
        <div style={{ flex:1, padding:'8px 12px' }}>
          <div style={{ color:'#000', fontWeight:900, fontSize:13, textTransform:'uppercase', letterSpacing:1, fontFamily:'Arial Black,sans-serif' }}>{p.name}</div>
          <div style={{ color:'#555', fontSize:10, fontFamily:'monospace', marginTop:2 }}>{p.hits}/{p.total} exact · {p.pct}%</div>
        </div>
        <div style={{ borderLeft:'2px solid #111', padding:'8px 12px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'#000', fontWeight:900, fontSize:22, fontFamily:'Arial Black,sans-serif', lineHeight:1 }}>{p.hits}</span>
          <span style={{ color:'#666', fontSize:8, fontFamily:'monospace', textTransform:'uppercase' }}>hits</span>
        </div>
      </motion.div>
    );
  }
},

/* 2 ─ SWISS GRID ─────────────────────────────────────────────────────── */
{ id:2, name:'Swiss Grid', desc:'עיצוב שוויצרי — אדום/שחור, Helvetica',
  bg:'#f5f5f0',
  render(p,i) {
    const isTop = p.rank === 1;
    return (
      <motion.div variants={itemClip}
        style={{ display:'grid', gridTemplateColumns:'44px 1fr 44px', borderBottom:'1px solid #ddd',
                 background: isTop?'#E8112D':'#fff', marginBottom:0 }}>
        <div style={{ background:'#E8112D', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px 0' }}>
          <span style={{ color:'#fff', fontWeight:900, fontSize:20, fontFamily:'Helvetica Neue,Arial,sans-serif' }}>{p.rank}</span>
        </div>
        <div style={{ padding:'10px 14px', borderLeft:'1px solid rgba(0,0,0,0.08)', borderRight:'1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ color:isTop?'#fff':'#000', fontWeight:700, fontSize:13, fontFamily:'Helvetica Neue,Arial,sans-serif', textTransform:'uppercase', letterSpacing:.5 }}>{p.name}</div>
          <div style={{ color:isTop?'rgba(255,255,255,0.65)':'#888', fontSize:10, marginTop:2 }}>EXACT {p.hits}/{p.total} · {p.pct}%</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:isTop?'#fff':'#E8112D', fontWeight:900, fontSize:20, fontFamily:'Helvetica Neue,Arial,sans-serif' }}>{p.hits}</span>
        </div>
      </motion.div>
    );
  }
},

/* 3 ─ TERMINAL CLI ───────────────────────────────────────────────────── */
{ id:3, name:'Terminal CLI', desc:'פקודות מסוף — ירוק על שחור',
  bg:'#000',
  render(p,i) {
    const labels=['[LEADER]','[2ND]','[3RD]','[4TH]','[5TH]'];
    return (
      <motion.div variants={itemSlide} style={{ fontFamily:"'Courier New',monospace", fontSize:12, lineHeight:1.8, padding:'1px 0' }}>
        <span style={{ color:'#00ff41' }}>$ </span>
        <span style={{ color:'#666' }}>{labels[i]} </span>
        <span style={{ color:'#00ff41', fontWeight:700 }}>{p.name} </span>
        <span style={{ color:'#44ff88' }}>--exact={p.hits} </span>
        <span style={{ color:'#888' }}>--of={p.total} </span>
        <span style={{ color:'#ffcc00' }}>--acc={p.pct}%</span>
        {i===0&&<div style={{ color:'#00cc33', paddingLeft:14, fontSize:11 }}>→ confirmed leader · {p.hits} exact hits</div>}
      </motion.div>
    );
  }
},

/* 4 ─ THERMAL RECEIPT ────────────────────────────────────────────────── */
{ id:4, name:'Thermal Receipt', desc:'קבלה תרמית — קרם, מונוספייס',
  bg:'#f2ede0',
  render(p,i) {
    if(i===0) return (
      <motion.div variants={itemUp} style={{ fontFamily:'monospace', textAlign:'center', padding:'10px 0', borderTop:'2px dashed #aaa', borderBottom:'2px dashed #aaa', marginBottom:8 }}>
        <div style={{ fontSize:10, color:'#666', letterSpacing:2 }}>── EXACT HITS STANDINGS ──</div>
        <div style={{ fontSize:26, fontWeight:900, color:'#000', letterSpacing:4, margin:'4px 0' }}>{p.hits}/{p.total}</div>
        <div style={{ fontSize:13, color:'#333' }}>🏆 {p.name}</div>
        <div style={{ fontSize:10, color:'#888', marginTop:2 }}>ACCURACY: {p.pct}%</div>
      </motion.div>
    );
    return (
      <motion.div variants={itemUp} style={{ fontFamily:'monospace', display:'flex', justifyContent:'space-between', padding:'3px 0', borderBottom:'1px dashed #bbb', fontSize:11, color:'#333' }}>
        <span>{p.rank}. {p.name}</span>
        <span>{p.hits} · {p.pct}%</span>
      </motion.div>
    );
  }
},

/* 5 ─ SPLIT-FLAP BOARD ───────────────────────────────────────────────── */
{ id:5, name:'Split-Flap Board', desc:'לוח נחיתות מכאני — תאים נפרדים',
  bg:'#0a0a0a',
  render(p,i) {
    return (
      <motion.div variants={itemUp}
        style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', marginBottom:4, borderBottom:'1px solid #1e1e1e' }}>
        <span style={{ color:'#555', fontFamily:'monospace', fontWeight:700, fontSize:12, minWidth:16 }}>{p.rank}</span>
        <span style={{ color:'#ccc', fontFamily:'monospace', fontSize:12, flex:1 }}>{p.name}</span>
        <div style={{ display:'flex', gap:2 }}>
          {String(p.hits).split('').map((d,di)=>(
            <div key={di} style={{ width:24,height:30, background:'#181818', border:'1px solid #2e2e2e', borderRadius:3, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', boxShadow:'0 2px 4px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.04)' }}>
              <div style={{ position:'absolute', left:0, right:0, top:'50%', height:1, background:'#000', opacity:.7 }} />
              <span style={{ fontFamily:'monospace', fontWeight:900, fontSize:15, color:'#f0e060', lineHeight:1 }}>{d}</span>
            </div>
          ))}
          <div style={{ width:24, height:30, background:'#181818', border:'1px solid #2e2e2e', borderRadius:3, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'monospace', fontSize:8, color:'#444', textAlign:'center', lineHeight:1.2 }}>EX</span>
          </div>
        </div>
      </motion.div>
    );
  }
},

/* 6 ─ POLAROID ───────────────────────────────────────────────────────── */
{ id:6, name:'Polaroid Stack', desc:'פולארויד — מסגרת לבנה, כתב יד',
  bg:'#c8bfb0', layout:'wrap',
  render(p,i) {
    const rot=[-2.5,1.8,-1.2,2.2,-1.6][i];
    const fills=['#3b82f6','#ef4444','#22c55e','#f59e0b','#8b5cf6'];
    return (
      <motion.div
        variants={{ hidden:{opacity:0,scale:.88,rotate:rot-4}, show:{opacity:1,scale:1,rotate:rot,transition:{type:'spring',duration:.6,bounce:.3}} }}
        whileHover={{ scale:1.08, rotate:0, zIndex:10, transition:{type:'spring',stiffness:400,damping:20} }}
        style={{ background:'#fff', padding:'8px 8px 24px', boxShadow:'0 4px 16px rgba(0,0,0,0.2),0 1px 3px rgba(0,0,0,0.1)', cursor:'pointer', position:'relative', margin:4 }}
      >
        <div style={{ width:90, height:70, background:fills[i], display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'#fff', fontWeight:900, fontSize:28 }}>{p.hits}</span>
        </div>
        <div style={{ fontFamily:'cursive', fontSize:11, color:'#444', textAlign:'center', marginTop:2, lineHeight:1.4 }}>
          <div>{p.name}</div>
          <div style={{ color:'#999', fontSize:9 }}>#{p.rank}</div>
        </div>
      </motion.div>
    );
  }
},

/* 7 ─ BLUEPRINT ──────────────────────────────────────────────────────── */
{ id:7, name:'Blueprint Technical', desc:'שרטוט הנדסי — כחול כהה, קווי רשת',
  bg:'#0a1628',
  render(p,i) {
    return (
      <motion.div variants={itemUp} style={{ border:'1px solid rgba(80,130,220,0.3)', padding:'10px 12px', marginBottom:5, background:'rgba(10,20,50,0.5)', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(80,130,220,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(80,130,220,0.05) 1px,transparent 1px)', backgroundSize:'16px 16px', pointerEvents:'none' }} />
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:26,height:26, border:'1px solid rgba(80,160,255,0.6)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:'#5da8ff', fontFamily:'monospace', fontWeight:700, fontSize:12 }}>{p.rank}</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:'#8ec8ff', fontFamily:'monospace', fontWeight:700, fontSize:11, letterSpacing:1 }}>{p.name.toUpperCase()}</div>
            <div style={{ marginTop:4, height:3, background:'rgba(80,130,220,0.15)' }}>
              <motion.div initial={{width:0}} animate={{width:`${(p.hits/MAX)*100}%`}} transition={{duration:.8,ease:[0.23,1,0.32,1],delay:.1+i*.08}}
                style={{ height:'100%', background:'#3d9eff' }} />
            </div>
          </div>
          <div style={{ textAlign:'right', fontFamily:'monospace' }}>
            <div style={{ color:'#3d9eff', fontWeight:900, fontSize:18 }}>{p.hits}</div>
            <div style={{ color:'rgba(80,130,220,0.5)', fontSize:9 }}>{p.pct}%</div>
          </div>
        </div>
      </motion.div>
    );
  }
},

/* 8 ─ RISOGRAPH ──────────────────────────────────────────────────────── */
{ id:8, name:'Risograph Print', desc:'הדפסת ריזוגרף — היסט צבע, מסך הדפסה',
  bg:'#f5eeda',
  render(p,i) {
    const combos=[['#E8112D','#1a1a2e'],['#FC913A','#003049'],['#1a6b3a','#f5eeda'],['#6B2D8B','#f5eeda'],['#0047AB','#f5eeda']];
    const [c1,c2]=combos[i]||combos[0];
    return (
      <motion.div variants={itemUp} style={{ position:'relative', marginBottom:10 }}>
        <div style={{ position:'absolute', top:3, left:3, right:-3, bottom:-3, background:c1, opacity:.45 }} />
        <div style={{ position:'relative', background:'#fff', border:`2px solid ${c2}`, padding:'9px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34,height:34, background:c1, border:`2px solid ${c2}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:'#fff', fontWeight:900, fontSize:17, fontFamily:'Impact,sans-serif' }}>{p.rank}</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:c2, fontWeight:900, fontSize:13, fontFamily:'Impact,sans-serif', letterSpacing:1, textTransform:'uppercase' }}>{p.name}</div>
            <div style={{ color:c1, fontSize:10, fontWeight:700 }}>{p.hits} exact · {p.pct}%</div>
          </div>
          <span style={{ color:c2, fontWeight:900, fontSize:26, fontFamily:'Impact,sans-serif' }}>{p.hits}</span>
        </div>
      </motion.div>
    );
  }
},

/* 9 ─ TCG TRADING CARD ───────────────────────────────────────────────── */
{ id:9, name:'TCG Trading Card', desc:'כרטיס אספנות — נדירות, הולוגרפי',
  bg:'#12122a',
  render(p,i) {
    const rar=[
      {name:'LEGENDARY',c:'#FF6B35',stars:5},
      {name:'EPIC',     c:'#B44FFF',stars:4},
      {name:'RARE',     c:'#3D9EFF',stars:3},
      {name:'UNCOMMON', c:'#22c55e',stars:2},
      {name:'COMMON',   c:'#888',   stars:1},
    ][i];
    return (
      <motion.div
        variants={itemPop}
        whileHover={{ scale:1.05, rotate:-1, transition:{type:'spring',stiffness:400,damping:18} }}
        style={{ background:'linear-gradient(145deg,#16213e,#0f3460)', border:`2px solid ${rar.c}`, borderRadius:8, overflow:'hidden', marginBottom:8, cursor:'pointer' }}
      >
        <div style={{ background:`${rar.c}28`, padding:'5px 10px', borderBottom:`1px solid ${rar.c}44`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ color:rar.c, fontSize:9, fontWeight:900, letterSpacing:2 }}>{rar.name}</span>
          <span style={{ fontSize:11 }}>{'★'.repeat(rar.stars)}{'☆'.repeat(5-rar.stars)}</span>
        </div>
        <div style={{ padding:'10px', textAlign:'center' }}>
          <div style={{ color:rar.c, fontWeight:900, fontSize:30, lineHeight:1 }}>{p.hits}</div>
          <div style={{ color:'rgba(255,255,255,0.35)', fontSize:9, margin:'2px 0' }}>EXACT HITS</div>
          <div style={{ color:'#fff', fontWeight:700, fontSize:13 }}>{p.name}</div>
          <div style={{ color:'rgba(255,255,255,0.3)', fontSize:10, marginTop:4 }}>{p.pct}% · #{p.rank}</div>
        </div>
      </motion.div>
    );
  }
},

/* 10 ─ AIRPORT DEPARTURES ────────────────────────────────────────────── */
{ id:10, name:'Airport FIDS', desc:'לוח נסיעות שדה-תעופה — FIDS מונוספייס',
  bg:'#0e0e0e',
  render(p,i) {
    const status=['LEADER','ON TIME','ON TIME','DELAYED','STANDBY'][i];
    const stC  =['#FFD700','#22c55e','#22c55e','#ef4444','#f59e0b'][i];
    return (
      <motion.div variants={itemClip}
        style={{ display:'grid', gridTemplateColumns:'28px 1fr 48px 74px', alignItems:'center', gap:10, padding:'10px 12px', borderBottom:'1px solid #1e1e1e', background:i%2===0?'#0a0a0a':'#0e0e0e' }}>
        <span style={{ color:'#555', fontFamily:'monospace', fontSize:12 }}>{String(p.rank).padStart(2,'0')}</span>
        <span style={{ color:'#e0e0e0', fontFamily:'monospace', fontWeight:600, fontSize:12, letterSpacing:.5 }}>{p.name.toUpperCase()}</span>
        <span style={{ color:'#fff', fontFamily:'monospace', fontSize:18, fontWeight:900, textAlign:'center' }}>{p.hits}</span>
        <span style={{ color:stC, fontFamily:'monospace', fontSize:10, fontWeight:700, letterSpacing:1, textAlign:'right' }}>{status}</span>
      </motion.div>
    );
  }
},

/* 11 ─ ART DECO ──────────────────────────────────────────────────────── */
{ id:11, name:'Art Deco Gatsby', desc:'ארט-דקו — זהב גיאומטרי, שנות ה-20',
  bg:'#0a0a08',
  render(p,i) {
    const col=rc(p.rank);
    return (
      <motion.div variants={itemUp} style={{ position:'relative', padding:'10px 16px', marginBottom:10, textAlign:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:56, height:1, background:`linear-gradient(90deg,transparent,${col},transparent)` }} />
        <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:56, height:1, background:`linear-gradient(90deg,transparent,${col},transparent)` }} />
        <div style={{ position:'absolute', left:8, top:0, bottom:0, width:1, background:`linear-gradient(180deg,transparent,${col}44,transparent)` }} />
        <div style={{ position:'absolute', right:8, top:0, bottom:0, width:1, background:`linear-gradient(180deg,transparent,${col}44,transparent)` }} />
        <div style={{ color:col, fontSize:9, letterSpacing:4, fontFamily:'Georgia,serif', opacity:.65 }}>✦ RANK {p.rank} ✦</div>
        <div style={{ color:'#fff', fontWeight:700, fontSize:14, fontFamily:'Georgia,serif', margin:'2px 0', letterSpacing:1 }}>{p.name}</div>
        <div style={{ color:col, fontWeight:900, fontSize:26, fontFamily:'Georgia,serif', lineHeight:1 }}>{p.hits}</div>
        <div style={{ color:'rgba(255,255,255,0.3)', fontSize:9, letterSpacing:3 }}>EXACT HITS</div>
      </motion.div>
    );
  }
},

/* 12 ─ HAZARD TAPE ───────────────────────────────────────────────────── */
{ id:12, name:'Hazard Tape', desc:'סרט אזהרה — פסי זהב/שחור, Impact',
  bg:'#0d0d00',
  render(p,i) {
    const stripe='repeating-linear-gradient(45deg,#FFD700 0,#FFD700 6px,#000 6px,#000 12px)';
    return (
      <motion.div variants={itemUp}
        style={{ display:'flex', alignItems:'stretch', background:'#111100', border:'2px solid #FFD700', marginBottom:7, overflow:'hidden' }}>
        <div style={{ width:18, background:stripe, flexShrink:0 }} />
        <div style={{ flex:1, padding:'9px 12px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ color:'#FFD700', fontWeight:900, fontSize:16, fontFamily:'Impact,sans-serif', minWidth:20 }}>{p.rank}</span>
          <div style={{ flex:1 }}>
            <div style={{ color:'#FFD700', fontWeight:900, fontFamily:'Impact,sans-serif', fontSize:14, letterSpacing:1 }}>{p.name.toUpperCase()}</div>
            <div style={{ color:'rgba(255,215,0,0.45)', fontSize:10, fontFamily:'monospace' }}>EXACT {p.hits}/{p.total} · {p.pct}%</div>
          </div>
          <span style={{ color:'#FFD700', fontWeight:900, fontSize:26, fontFamily:'Impact,sans-serif' }}>{p.hits}</span>
        </div>
        <div style={{ width:18, background:stripe, flexShrink:0 }} />
      </motion.div>
    );
  }
},

/* 13 ─ CRT SCANLINE ─────────────────────────────────────────────────── */
{ id:13, name:'CRT Scanline', desc:'מסך CRT — זרחן ירוק, שורות סריקה',
  bg:'#000',
  render(p,i) {
    return (
      <motion.div variants={itemUp}
        style={{ position:'relative', overflow:'hidden', background:'#001400', border:'1px solid #00aa44', borderRadius:3, padding:'10px 12px', marginBottom:6, display:'flex', alignItems:'center', gap:10, animation:'eh2-flicker 10s linear infinite' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.14) 2px,rgba(0,0,0,0.14) 4px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.55))', pointerEvents:'none' }} />
        <span style={{ color:'#00ff41', fontFamily:'monospace', fontWeight:700, fontSize:14, position:'relative', textShadow:'0 0 6px #00ff41', minWidth:18 }}>{p.rank}</span>
        <div style={{ flex:1, position:'relative' }}>
          <div style={{ color:'#00ff41', fontFamily:'monospace', fontWeight:700, fontSize:12, textShadow:'0 0 4px #00ff41' }}>{p.name}</div>
          <div style={{ color:'#008822', fontFamily:'monospace', fontSize:10 }}>EXACT::{p.hits}/{p.total}</div>
        </div>
        <span style={{ color:'#00ff41', fontWeight:900, fontSize:22, fontFamily:'monospace', position:'relative', textShadow:'0 0 8px #00ff41' }}>{p.hits}</span>
      </motion.div>
    );
  }
},

/* 14 ─ BAUHAUS ───────────────────────────────────────────────────────── */
{ id:14, name:'Bauhaus Geometry', desc:'באוהאוס — צבעי ראשוניים, גיאומטריה טהורה',
  bg:'#f0ece4',
  render(p,i) {
    const schemes=[
      {bg:'#E8112D',circle:'#FFD700',txt:'#fff'},
      {bg:'#003DA6',circle:'#E8112D',txt:'#fff'},
      {bg:'#FFD700',circle:'#003DA6',txt:'#000'},
      {bg:'#1a1a1a',circle:'#FFD700',txt:'#fff'},
      {bg:'#E8112D',circle:'#003DA6',txt:'#fff'},
    ][i];
    return (
      <motion.div variants={itemUp}
        style={{ background:schemes.bg, padding:'12px', marginBottom:6, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:44,height:44, borderRadius:'50%', background:schemes.circle, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ color:schemes.bg, fontWeight:900, fontSize:20, fontFamily:'Arial Black,sans-serif' }}>{p.hits}</span>
        </div>
        <div>
          <div style={{ color:schemes.txt, fontWeight:900, fontSize:14, fontFamily:'Arial Black,sans-serif', textTransform:'uppercase' }}>{p.name}</div>
          <div style={{ color:`${schemes.txt}88`, fontSize:10 }}>RANK {p.rank} · {p.pct}%</div>
        </div>
      </motion.div>
    );
  }
},

/* 15 ─ NEWSPAPER ────────────────────────────────────────────────────── */
{ id:15, name:'Newspaper Column', desc:'כתבת עיתון — עמודות, Georgia, עיצוב ישן',
  bg:'#f5f0e4',
  render(p,i) {
    if(i===0) return (
      <motion.div variants={itemUp} style={{ fontFamily:'Georgia,Times New Roman,serif', borderBottom:'2px solid #000', paddingBottom:8, marginBottom:8 }}>
        <div style={{ fontSize:9, color:'#555', letterSpacing:2, textTransform:'uppercase', borderBottom:'1px solid #aaa', paddingBottom:3, marginBottom:6 }}>SPORTS · EXACT PREDICTIONS</div>
        <div style={{ fontSize:17, fontWeight:900, color:'#000', lineHeight:1.2, marginBottom:4 }}>{p.name} Leads With {p.hits} Exact Hits</div>
        <div style={{ fontSize:10, color:'#444', lineHeight:1.6 }}>With a {p.pct}% accuracy rate across {p.total} predictions, the leader holds a commanding advantage in the standings.</div>
      </motion.div>
    );
    return (
      <motion.div variants={itemUp} style={{ fontFamily:'Georgia,serif', display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:'1px solid #ccc' }}>
        <span style={{ fontSize:11, color:'#222' }}>{p.rank}. {p.name}</span>
        <span style={{ fontSize:11, color:'#000', fontWeight:700 }}>{p.hits} ({p.pct}%)</span>
      </motion.div>
    );
  }
},

/* 16 ─ STOCK TICKER ─────────────────────────────────────────────────── */
{ id:16, name:'Stock Ticker', desc:'מסחר בורסאי — אדום/ירוק, נתוני שוק',
  bg:'#040404',
  render(p,i) {
    const isUp=p.rank<=2;
    const col=isUp?'#00d68f':'#ff4757';
    const chg=['+8.3%','+4.1%','+2.0%','-3.5%','-6.2%'][i];
    return (
      <motion.div variants={itemSlide}
        style={{ background:'#090909', borderLeft:`3px solid ${col}`, padding:'8px 12px', marginBottom:4, display:'flex', alignItems:'center', gap:10, fontFamily:'monospace' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
            <span style={{ color:'#e0e0e0', fontWeight:700, fontSize:13 }}>{p.name}</span>
            <span style={{ color:'#444', fontSize:9 }}>EXHIT</span>
          </div>
          <div style={{ color:'#444', fontSize:10, marginTop:1 }}>VOL:{p.total} ACC:{p.pct}%</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ color:'#e0e0e0', fontWeight:900, fontSize:20 }}>{p.hits}</div>
          <div style={{ color:col, fontSize:11, fontWeight:700 }}>{isUp?'▲':'▼'} {chg}</div>
        </div>
      </motion.div>
    );
  }
},

/* 17 ─ CASSETTE LABEL ────────────────────────────────────────────────── */
{ id:17, name:'Cassette Label', desc:'תווית קסטה — שנות ה-80, צבעוני',
  bg:'#1a1a1a',
  render(p,i) {
    const palettes=[['#FF6B6B','#FFE66D'],['#4ECDC4','#FF6B6B'],['#A8E6CF','#FF8B94'],['#FFD93D','#6C63FF'],['#FF9A8B','#88D8B0']];
    const [c1,c2]=palettes[i];
    return (
      <motion.div
        variants={{ hidden:{opacity:0,x:-18,rotate:-1.5}, show:{opacity:1,x:0,rotate:0,transition:{type:'spring',duration:.5,bounce:.2}} }}
        style={{ background:`linear-gradient(120deg,${c1},${c2})`, padding:'8px 12px', marginBottom:7, borderRadius:2, boxShadow:'0 3px 10px rgba(0,0,0,0.5)', display:'flex', alignItems:'center', gap:10 }}
      >
        <div style={{ width:26,height:26, borderRadius:'50%', background:'rgba(0,0,0,0.22)', border:'1px solid rgba(0,0,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <div style={{ width:8,height:8, borderRadius:'50%', background:'rgba(0,0,0,0.45)' }} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ color:'rgba(0,0,0,0.8)', fontWeight:900, fontSize:13, fontFamily:'Impact,sans-serif', letterSpacing:1 }}>{p.name.toUpperCase()}</div>
          <div style={{ color:'rgba(0,0,0,0.45)', fontSize:10 }}>Side A · {p.hits} exact · {p.pct}%</div>
        </div>
        <div style={{ width:26,height:26, borderRadius:'50%', background:'rgba(0,0,0,0.22)', border:'1px solid rgba(0,0,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <div style={{ width:8,height:8, borderRadius:'50%', background:'rgba(0,0,0,0.45)' }} />
        </div>
      </motion.div>
    );
  }
},

/* 18 ─ DIE-CUT STICKER ───────────────────────────────────────────────── */
{ id:18, name:'Die-Cut Sticker', desc:'מדבקה — לבן מסביב, עגול, בונוס hover',
  bg:'linear-gradient(135deg,#667eea,#764ba2)', layout:'wrap',
  render(p,i) {
    const fills=['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6'];
    const emojis=['🎯','🏆','⭐','🎖️','🎗️'];
    return (
      <motion.div
        variants={itemPop}
        whileHover={{ scale:1.12, rotate:[-2,2,-2,0], transition:{type:'spring',stiffness:400,damping:12} }}
        style={{ background:'#fff', borderRadius:999, padding:'12px 18px', margin:6, boxShadow:`0 0 0 4px #fff,0 0 0 6px rgba(0,0,0,0.22),0 8px 20px rgba(0,0,0,0.35)`, display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer' }}
      >
        <span style={{ fontSize:20 }}>{emojis[i]}</span>
        <span style={{ color:fills[i], fontWeight:900, fontSize:22, lineHeight:1 }}>{p.hits}</span>
        <span style={{ color:'#333', fontSize:11, fontWeight:700 }}>{p.name}</span>
        <span style={{ color:'#aaa', fontSize:9 }}>#{p.rank}</span>
      </motion.div>
    );
  }
},

/* 19 ─ NEGATIVE SPACE ────────────────────────────────────────────────── */
{ id:19, name:'Negative Space', desc:'מינימליזם קיצוני — גדול, אוויר, ריק',
  bg:'#fafafa',
  render(p,i) {
    if(i===0) return (
      <motion.div variants={itemUp} style={{ padding:'20px 0', borderBottom:'1px solid #eee', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          <div style={{ color:'#bbb', fontSize:9, letterSpacing:3, textTransform:'uppercase', marginBottom:6 }}>Exact Hits Leader</div>
          <div style={{ color:'#111', fontSize:26, fontWeight:900, letterSpacing:-1, lineHeight:1 }}>{p.name}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ color:'#111', fontSize:44, fontWeight:900, lineHeight:1, letterSpacing:-2 }}>{p.hits}</div>
          <div style={{ color:'#ccc', fontSize:11 }}>of {p.total}</div>
        </div>
      </motion.div>
    );
    return (
      <motion.div variants={itemUp} style={{ padding:'9px 0', borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ color:'#ddd', fontSize:12, fontWeight:700 }}>0{p.rank}</span>
          <span style={{ color:'#333', fontSize:13, fontWeight:600 }}>{p.name}</span>
        </div>
        <span style={{ color:'#111', fontWeight:800, fontSize:16 }}>{p.hits}</span>
      </motion.div>
    );
  }
},

/* 20 ─ CELESTIAL MAP ─────────────────────────────────────────────────── */
{ id:20, name:'Celestial Star Map', desc:'מפת כוכבים — קונסטלציות, קוסמי',
  bg:'#020917',
  render(p,i) {
    const pts=Array.from({length:Math.max(3,p.hits)},(_,si)=>({
      x:8+Math.abs(Math.sin(si*2.1+p.rank*0.7)*100),
      y:4+Math.abs(Math.cos(si*1.6+p.rank)*34),
    }));
    return (
      <motion.div variants={itemUp}
        style={{ position:'relative', overflow:'hidden', border:'1px solid rgba(100,140,220,0.2)', borderRadius:12, padding:'10px 12px', marginBottom:7, background:`radial-gradient(ellipse at ${20+i*14}% 50%,rgba(30,50,100,0.5),transparent)` }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:top(p.rank)?.5:.15 }} viewBox="0 0 130 44" preserveAspectRatio="xMidYMid slice">
          {pts.map((s,si)=><circle key={si} cx={s.x} cy={s.y} r={si===0?2.2:1.2} fill={rc(p.rank)} />)}
          {pts.slice(1).map((s,si)=><line key={si} x1={pts[si].x} y1={pts[si].y} x2={s.x} y2={s.y} stroke={rc(p.rank)} strokeWidth=".6" strokeDasharray="2 3" />)}
        </svg>
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ color:rc(p.rank), fontWeight:900, fontSize:14, minWidth:18, fontFamily:'Georgia,serif' }}>{p.rank}</span>
          <div style={{ flex:1 }}>
            <div style={{ color:'#c8d8f8', fontWeight:700, fontSize:13, fontFamily:'Georgia,serif' }}>{p.name}</div>
            <div style={{ color:'rgba(150,180,255,0.5)', fontSize:10 }}>{p.hits} constellation points</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ color:rc(p.rank), fontWeight:900, fontSize:22, fontFamily:'Georgia,serif' }}>{p.hits}</div>
            <div style={{ color:'rgba(150,180,255,0.35)', fontSize:8 }}>✦ EXACT ✦</div>
          </div>
        </div>
      </motion.div>
    );
  }
},

];
/* ══════════════════════════════════════════════════════════════════════ */

const CATS = [
  { id:'all',   label:'כולם (20)' },
  { id:'light', label:'⬜ בהיר',      ids:[1,2,4,8,14,15,19] },
  { id:'dark',  label:'⬛ כהה',       ids:[3,5,7,10,11,12,13,16,20] },
  { id:'anim',  label:'⚡ Spring',     ids:[6,9,17,18] },
  { id:'type',  label:'Aa טיפוגרפיה', ids:[2,11,14,15,19] },
];

export default function AdminExactHitsDemo2() {
  const [filter, setFilter] = useState('all');
  const visible = filter==='all' ? designs : designs.filter(d => CATS.find(c=>c.id===filter)?.ids?.includes(d.id));

  return (
    <div dir="rtl" style={{ color:'#fff', fontFamily:'system-ui,sans-serif' }}>
      <style>{SCOPED}</style>
      <h1 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>20 עיצובים מתקדמים — Exact Hits</h1>
      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginBottom:20 }}>
        Framer Motion springs · clip-path reveals · ברוטליזם · שוויצרי · CRT · קסטות · פולארויד
      </p>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
        {CATS.map(c=>(
          <button key={c.id} onClick={()=>setFilter(c.id)}
            style={{ padding:'6px 14px', borderRadius:999, border:'1px solid rgba(255,255,255,0.2)', background:filter===c.id?'#FFD700':'rgba(255,255,255,0.06)', color:filter===c.id?'#000':'#fff', fontWeight:700, fontSize:12, cursor:'pointer', transition:'all .15s' }}>
            {c.label}
          </button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:28 }}>
        {visible.map(d=>(
          <div key={d.id}>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:10 }}>
              <span style={{ background:'#6366f1', color:'#fff', borderRadius:999, width:22, height:22, display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:11, flexShrink:0 }}>{d.id}</span>
              <div>
                <div style={{ fontWeight:800, fontSize:13 }}>{d.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{d.desc}</div>
              </div>
            </div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once:true, margin:'-60px' }}
              style={{ background:d.bg||'#0d1117', borderRadius:14, padding:12, border:'1px solid rgba(255,255,255,0.08)', overflow:'hidden' }}
            >
              <div style={{ display:d.layout==='wrap'?'flex':'block', flexWrap:'wrap', justifyContent:'center' }}>
                {mock.map((p,i)=><React.Fragment key={p.rank}>{d.render(p,i)}</React.Fragment>)}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
