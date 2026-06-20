import React, { useState } from 'react';

const FORM = [
  { result: 'W', scored: 3, conceded: 0, opponent: 'France' },
  { result: 'D', scored: 1, conceded: 1, opponent: 'Germany' },
  { result: 'L', scored: 0, conceded: 2, opponent: 'Spain' },
  { result: 'W', scored: 2, conceded: 1, opponent: 'Italy' },
  { result: 'W', scored: 1, conceded: 0, opponent: 'Portugal' },
];

const C = {
  W: { bg: 'rgba(74,222,128,0.18)', bd: 'rgba(74,222,128,0.65)', tx: '#4ade80', so: '#22c55e', dk: '#15803d' },
  D: { bg: 'rgba(250,204,21,0.18)', bd: 'rgba(250,204,21,0.55)', tx: '#facc15', so: '#ca8a04', dk: '#92400e' },
  L: { bg: 'rgba(248,113,113,0.18)', bd: 'rgba(248,113,113,0.6)', tx: '#f87171', so: '#dc2626', dk: '#991b1b' },
};

/* ── 50 NEW VARIANTS ─────────────────────────────────────────────────────── */
const VARIANTS = [

/* ━━━━━━━━━━━━━━━━  3D GROUP (8 variants) ━━━━━━━━━━━━━━━━ */

/* 1 */ {
  title: '3D — שכבות ערוכות',
  render: (f) => (
    <div className="flex gap-2.5">
      {f.map((x,i) => {
        const c = C[x.result];
        return (
          <div key={i} style={{ position:'relative', width:24, height:24 }}>
            {[4,2,0].map(offset => (
              <div key={offset} style={{ position:'absolute', inset:0, background: offset===0?c.bg:'transparent', border:`1px solid ${c.bd}`, borderRadius:4, transform:`translate(${-offset}px,${offset}px)`, opacity: offset===0?1:0.4 }} />
            ))}
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:c.tx }}>{x.result}</div>
          </div>
        );
      })}
    </div>
  ),
},

/* 2 */ {
  title: '3D — מטבע/דיסק',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => {
        const c = C[x.result];
        return (
          <div key={i} style={{ position:'relative', width:24 }}>
            <div style={{ width:24, height:6, background:c.dk, borderRadius:'50%', position:'absolute', bottom:0, left:0 }} />
            <div style={{ width:24, height:20, background:c.bg, border:`1px solid ${c.bd}`, borderRadius:'50%', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:9, fontWeight:900, color:c.tx }}>{x.result}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 3 */ {
  title: '3D — אות מוגבהת',
  render: (f) => (
    <div className="flex gap-2 items-center">
      {f.map((x,i) => {
        const c = C[x.result];
        const shadows = Array.from({length:5},(_,n)=>`${n+1}px ${n+1}px 0 ${c.dk}`).join(',');
        return (
          <div key={i} style={{ fontSize:22, fontWeight:900, color:c.tx, textShadow:shadows, lineHeight:1 }}>{x.result}</div>
        );
      })}
    </div>
  ),
},

/* 4 */ {
  title: '3D — קופסה איזומטרית',
  render: (f) => (
    <div className="flex gap-3 items-end">
      {f.map((x,i) => {
        const c = C[x.result];
        const h = x.result==='W'?28:x.result==='D'?18:10;
        return (
          <div key={i} style={{ position:'relative', width:18, height:h+8 }}>
            {/* top face */}
            <div style={{ position:'absolute', top:0, left:2, width:14, height:6, background:c.tx, opacity:0.9, transform:'skewX(-20deg)' }} />
            {/* front face */}
            <div style={{ position:'absolute', top:5, left:0, width:14, height:h, background:c.bg, border:`1px solid ${c.bd}` }} />
            {/* side face */}
            <div style={{ position:'absolute', top:5, left:14, width:4, height:h, background:c.dk, opacity:0.6, transform:'skewY(20deg)', transformOrigin:'top left' }} />
          </div>
        );
      })}
    </div>
  ),
},

/* 5 */ {
  title: '3D — כרטיס מרחף',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => {
        const c = C[x.result];
        return (
          <div key={i} style={{ width:28, height:36, background:`linear-gradient(160deg,${c.bg},rgba(255,255,255,0.03))`, border:`1px solid ${c.bd}`, borderRadius:6, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, boxShadow:`0 8px 20px ${c.so}30, 0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`, transform:'translateY(-3px)' }}>
            <span style={{ fontSize:10, fontWeight:900, color:c.tx }}>{x.result}</span>
            <span style={{ fontSize:8, color:'rgba(255,255,255,0.5)' }}>{x.scored}:{x.conceded}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 6 */ {
  title: '3D — קיפול פינה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c = C[x.result];
        return (
          <div key={i} style={{ position:'relative', width:24, height:24, background:c.bg, border:`1px solid ${c.bd}`, borderRadius:'4px 0 4px 4px', overflow:'visible' }}>
            <div style={{ position:'absolute', top:-1, right:-1, width:0, height:0, borderStyle:'solid', borderWidth:'0 9px 9px 0', borderColor:`transparent ${c.so} transparent transparent` }} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:c.tx }}>{x.result}</div>
          </div>
        );
      })}
    </div>
  ),
},

/* 7 */ {
  title: '3D — זווית שונה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c = C[x.result];
        return (
          <div key={i} style={{ width:26, height:26, background:c.bg, border:`1px solid ${c.bd}`, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:c.tx, transform:'perspective(120px) rotateX(-20deg) rotateY(15deg)', boxShadow:`-4px 4px 0 ${c.so}40` }}>{x.result}</div>
        );
      })}
    </div>
  ),
},

/* 8 */ {
  title: '3D — כפתור לחוץ',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c = C[x.result];
        return (
          <div key={i} style={{ width:26, height:26, background:c.bg, border:`1px solid ${c.bd}`, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:c.tx, boxShadow:`0 4px 0 ${c.dk}, 0 5px 6px rgba(0,0,0,0.4)`, transform:'translateY(-3px)' }}>{x.result}</div>
        );
      })}
    </div>
  ),
},

/* ━━━━━━━━━━━━━━━━  SYMBOLS ━━━━━━━━━━━━━━━━ */

/* 9 */ {
  title: 'להבה / קרח / גולגולת',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => { const e=x.result==='W'?'🔥':x.result==='D'?'🧊':'💀'; return <span key={i} style={{ fontSize:20, lineHeight:1, filter:`drop-shadow(0 2px 4px rgba(0,0,0,0.5))` }}>{e}</span>; })}
    </div>
  ),
},

/* 10 */ {
  title: 'קוביות דוט',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c = C[x.result];
        const dots = x.result==='W'?6:x.result==='D'?3:1;
        const pattern = {
          1:[[1,1]],
          3:[[0,0],[1,1],[2,2]],
          6:[[0,0],[0,1],[1,0],[1,1],[2,0],[2,1]]
        }[dots]||[];
        return (
          <div key={i} style={{ width:24,height:24,background:c.bg,border:`1px solid ${c.bd}`,borderRadius:4,padding:3,display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr 1fr',gap:1,position:'relative' }}>
            {Array.from({length:6}).map((_,di) => {
              const r=Math.floor(di/2), col=di%2;
              const on=pattern.some(([pr,pc])=>pr===r&&pc===col);
              return <div key={di} style={{ borderRadius:'50%',background:on?c.so:'rgba(255,255,255,0.06)' }} />;
            })}
          </div>
        );
      })}
    </div>
  ),
},

/* 11 */ {
  title: 'רמזור',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => (
        <div key={i} style={{ width:12,height:30,background:'rgba(0,0,0,0.4)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-evenly',padding:'3px 0' }}>
          {['W','D','L'].map(r=><div key={r} style={{ width:7,height:7,borderRadius:'50%',background:x.result===r?C[r].so:'rgba(255,255,255,0.06)' }} />)}
        </div>
      ))}
    </div>
  ),
},

/* 12 */ {
  title: 'מזג אוויר',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => { const e=x.result==='W'?'☀️':x.result==='D'?'⛅':'🌧️'; return <span key={i} style={{ fontSize:20,lineHeight:1 }}>{e}</span>; })}
    </div>
  ),
},

/* 13 */ {
  title: 'לב מלא / חצי / שבור',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => { const e=x.result==='W'?'❤️':x.result==='D'?'🩶':'💔'; return <span key={i} style={{ fontSize:20,lineHeight:1 }}>{e}</span>; })}
    </div>
  ),
},

/* 14 */ {
  title: 'מד סוללה',
  render: (f) => (
    <div className="flex gap-2 items-center">
      {f.map((x,i) => {
        const c=C[x.result];
        const pct=x.result==='W'?100:x.result==='D'?50:15;
        return (
          <div key={i} style={{ position:'relative', width:14, height:26 }}>
            <div style={{ position:'absolute',top:0,left:3,width:8,height:3,background:c.bd,borderRadius:'2px 2px 0 0' }} />
            <div style={{ position:'absolute',top:3,left:0,width:14,height:23,border:`1px solid ${c.bd}`,borderRadius:2,overflow:'hidden' }}>
              <div style={{ position:'absolute',bottom:0,left:0,right:0,height:`${pct}%`,background:c.so,opacity:0.8 }} />
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 15 */ {
  title: 'כוכבי דירוג',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => {
        const stars=x.result==='W'?3:x.result==='D'?2:1;
        return (
          <div key={i} className="flex gap-0.5">
            {[1,2,3].map(s=><span key={s} style={{ fontSize:10,color:s<=stars?C[x.result].tx:'rgba(255,255,255,0.1)',lineHeight:1 }}>★</span>)}
          </div>
        );
      })}
    </div>
  ),
},

/* 16 */ {
  title: 'אצבע למעלה/צד/למטה',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => { const e=x.result==='W'?'👍':x.result==='D'?'👉':'👎'; return <span key={i} style={{ fontSize:20,lineHeight:1 }}>{e}</span>; })}
    </div>
  ),
},

/* ━━━━━━━━━━━━━━━━  CARD / MEDIA ━━━━━━━━━━━━━━━━ */

/* 17 */ {
  title: 'פולרואיד',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:3,padding:'3px 3px 7px 3px',display:'flex',flexDirection:'column',gap:2 }}>
            <div style={{ width:22,height:18,background:c.bg,border:`1px solid ${c.bd}`,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontSize:10,fontWeight:900,color:c.tx }}>{x.result}</span>
            </div>
            <div style={{ fontSize:6,color:'rgba(255,255,255,0.3)',textAlign:'center',fontFamily:'serif' }}>{x.scored}-{x.conceded}</div>
          </div>
        );
      })}
    </div>
  ),
},

/* 18 */ {
  title: 'פסי פילם',
  render: (f) => (
    <div style={{ display:'flex',background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:3,overflow:'hidden',padding:'2px 0' }}>
      {/* sprocket holes left */}
      <div className="flex flex-col justify-evenly px-1">
        {[0,1,2].map(i=><div key={i} style={{ width:4,height:4,borderRadius:1,background:'rgba(0,0,0,0.8)',border:'1px solid rgba(255,255,255,0.15)' }} />)}
      </div>
      {/* frames */}
      <div className="flex gap-0.5 px-0.5">
        {f.map((x,i) => {
          const c=C[x.result];
          return (
            <div key={i} style={{ width:18,height:24,background:c.bg,border:`1px solid ${c.bd}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1 }}>
              <span style={{ fontSize:8,fontWeight:900,color:c.tx }}>{x.result}</span>
              <span style={{ fontSize:6,color:c.bd }}>{x.scored}:{x.conceded}</span>
            </div>
          );
        })}
      </div>
      {/* sprocket holes right */}
      <div className="flex flex-col justify-evenly px-1">
        {[0,1,2].map(i=><div key={i} style={{ width:4,height:4,borderRadius:1,background:'rgba(0,0,0,0.8)',border:'1px solid rgba(255,255,255,0.15)' }} />)}
      </div>
    </div>
  ),
},

/* 19 */ {
  title: 'ג\'יפ קזינו',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:24,height:24,borderRadius:'50%',background:'rgba(0,0,0,0.5)',border:`2px solid ${c.tx}`,boxShadow:`0 0 0 3px rgba(0,0,0,0.3),0 0 0 4px ${c.bd}`,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ fontSize:8,fontWeight:900,color:c.tx }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 20 */ {
  title: 'כרטיס קרוע',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ position:'relative',width:22,height:28 }}>
            <div style={{ position:'absolute',inset:0,background:c.bg,border:`1px solid ${c.bd}`,borderRadius:'3px 3px 0 0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1 }}>
              <span style={{ fontSize:9,fontWeight:900,color:c.tx }}>{x.result}</span>
              <span style={{ fontSize:7,color:c.bd }}>{x.scored}:{x.conceded}</span>
            </div>
            <div style={{ position:'absolute',bottom:0,left:0,right:0,height:4,background:'repeating-linear-gradient(90deg,transparent 0px,transparent 2px,rgba(0,0,0,0.5) 2px,rgba(0,0,0,0.5) 4px)' }} />
          </div>
        );
      })}
    </div>
  ),
},

/* 21 */ {
  title: 'מספר חולצה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const num=x.result==='W'?'1':x.result==='D'?'0':'2';
        return (
          <div key={i} style={{ width:22,height:28,background:c.bg,border:`1px solid ${c.bd}`,borderRadius:'4px 4px 2px 2px',clipPath:'polygon(15% 0,85% 0,100% 15%,100% 100%,0 100%,0 15%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
            <span style={{ fontSize:14,fontWeight:900,color:c.tx,lineHeight:1 }}>{num}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 22 */ {
  title: 'בול דואר',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:26,height:26,background:c.bg,backgroundImage:`radial-gradient(circle at 0 50%,transparent 4px,${c.bg} 4px) left/4px 8px repeat-y, radial-gradient(circle at 100% 50%,transparent 4px,${c.bg} 4px) right/4px 8px repeat-y`,border:`1px solid ${c.bd}`,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ fontSize:10,fontWeight:900,color:c.tx }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 23 */ {
  title: 'ויניל רקורד',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:24,height:24,borderRadius:'50%',background:`conic-gradient(${c.dk} 0deg,rgba(0,0,0,0.6) 30deg,${c.dk} 60deg,rgba(0,0,0,0.6) 90deg,${c.dk} 120deg,rgba(0,0,0,0.6) 150deg,${c.dk} 180deg,rgba(0,0,0,0.6) 210deg,${c.dk} 240deg,rgba(0,0,0,0.6) 270deg,${c.dk} 300deg,rgba(0,0,0,0.6) 330deg,${c.dk} 360deg)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 0 1px ${c.bd}` }}>
            <div style={{ width:10,height:10,borderRadius:'50%',background:'rgba(10,18,35,0.9)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontSize:6,fontWeight:900,color:c.tx }}>{x.result}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* ━━━━━━━━━━━━━━━━  DATA VIZ ━━━━━━━━━━━━━━━━ */

/* 24 */ {
  title: 'מד מהירות',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const pct=x.result==='W'?1:x.result==='D'?0.5:0.15;
        const angle=-150+pct*300;
        return (
          <div key={i} style={{ position:'relative',width:26,height:16,overflow:'hidden' }}>
            <svg width={26} height={26} viewBox="0 0 26 26" style={{ position:'absolute',top:0,left:0 }}>
              <path d="M 3 22 A 10 10 0 0 1 23 22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} strokeLinecap="round"/>
              <path d="M 3 22 A 10 10 0 0 1 23 22" fill="none" stroke={c.tx} strokeWidth={3} strokeLinecap="round" strokeDasharray={`${pct*31.4} 31.4`}/>
              <line x1={13} y1={22} x2={13+9*Math.cos((angle-90)*Math.PI/180)} y2={22+9*Math.sin((angle-90)*Math.PI/180)} stroke={c.tx} strokeWidth={1.5} strokeLinecap="round"/>
            </svg>
          </div>
        );
      })}
    </div>
  ),
},

/* 25 */ {
  title: 'גלים קוליים',
  render: (f) => (
    <div className="flex gap-1.5 items-center">
      {f.map((x,i) => {
        const c=C[x.result];
        const heights = x.result==='W'?[4,10,18,10,4]:x.result==='D'?[3,7,10,7,3]:[2,4,5,4,2];
        return (
          <div key={i} className="flex gap-0.5 items-center" style={{ height:22 }}>
            {heights.map((h,b) => <div key={b} style={{ width:3,height:h,background:c.tx,borderRadius:2,opacity:0.9 }} />)}
          </div>
        );
      })}
    </div>
  ),
},

/* 26 */ {
  title: 'עוצמת חום',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const size=x.result==='W'?24:x.result==='D'?16:10;
        return (
          <div key={i} style={{ width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <div style={{ width:size,height:size,borderRadius:'50%',background:c.so,boxShadow:`0 0 ${size/2}px ${c.tx}`,opacity:0.85 }} />
          </div>
        );
      })}
    </div>
  ),
},

/* 27 */ {
  title: 'מילוי מים',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const fill=x.result==='W'?90:x.result==='D'?55:20;
        return (
          <div key={i} style={{ width:18,height:28,border:`1px solid ${c.bd}`,borderRadius:4,overflow:'hidden',position:'relative',background:'rgba(0,0,0,0.2)' }}>
            <div style={{ position:'absolute',bottom:0,left:0,right:0,height:`${fill}%`,background:`linear-gradient(to top,${c.so},${c.tx})`,opacity:0.7 }} />
            <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:'#fff' }}>{x.result}</div>
          </div>
        );
      })}
    </div>
  ),
},

/* 28 */ {
  title: 'פאזל רדאר (כל 5 יחד)',
  render: (f) => {
    const size=60;
    const cx=size/2, cy=size/2, r=22;
    const pts=f.map((x,i)=>{
      const angle=(i/f.length)*2*Math.PI-Math.PI/2;
      const len=x.result==='W'?r:x.result==='D'?r*0.6:r*0.25;
      return [cx+len*Math.cos(angle), cy+len*Math.sin(angle)];
    });
    const d='M '+pts.map(p=>p.join(',')).join(' L ')+' Z';
    return (
      <svg width={size} height={size}>
        {[1,0.6,0.25].map(frac=>(
          <polygon key={frac} points={f.map((_,i)=>{const a=(i/f.length)*2*Math.PI-Math.PI/2;return `${cx+r*frac*Math.cos(a)},${cy+r*frac*Math.sin(a)}`;}).join(' ')} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1}/>
        ))}
        <path d={d} fill="rgba(74,222,128,0.25)" stroke="#4ade80" strokeWidth={1.5}/>
        {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={3} fill={C[f[i].result].tx}/>)}
      </svg>
    );
  },
},

/* 29 */ {
  title: 'בועות גודל',
  render: (f) => (
    <div className="flex gap-1 items-end" style={{ height:34 }}>
      {f.map((x,i) => {
        const c=C[x.result];
        const s=x.result==='W'?34:x.result==='D'?22:13;
        return <div key={i} style={{ width:s,height:s,borderRadius:'50%',background:c.bg,border:`1.5px solid ${c.bd}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:s>20?10:7,fontWeight:900,color:c.tx }}>{x.result}</div>;
      })}
    </div>
  ),
},

/* ━━━━━━━━━━━━━━━━  UNIQUE STYLES ━━━━━━━━━━━━━━━━ */

/* 30 */ {
  title: 'LED 7-סגמנטים',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => {
        const c=C[x.result];
        const n=x.result==='W'?1:x.result==='D'?0:2;
        return (
          <div key={i} style={{ fontFamily:'monospace',fontSize:20,fontWeight:900,color:c.tx,textShadow:`0 0 10px ${c.tx}`,background:'rgba(0,0,0,0.4)',padding:'2px 5px',borderRadius:3,border:`1px solid rgba(0,0,0,0.3)` }}>{n}</div>
        );
      })}
    </div>
  ),
},

/* 31 */ {
  title: 'גרפיטי/תגית',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ fontSize:18,fontWeight:900,color:c.tx,fontStyle:'italic',lineHeight:1,WebkitTextStroke:`1px ${c.dk}`,textShadow:`2px 2px 0 ${c.dk},-1px -1px 0 ${c.dk}` }}>{x.result}</div>
        );
      })}
    </div>
  ),
},

/* 32 */ {
  title: 'לוח גיר',
  render: (f) => (
    <div style={{ background:'rgba(28,65,28,0.6)',border:'1px solid rgba(60,100,60,0.5)',borderRadius:4,padding:'4px 6px',display:'flex',gap:6 }}>
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ fontSize:12,fontWeight:900,color:c.tx,opacity:0.85,letterSpacing:1,fontFamily:'serif',textShadow:`0 0 3px ${c.tx}40` }}>{x.result}</div>
        );
      })}
    </div>
  ),
},

/* 33 */ {
  title: 'חריטה טכנית',
  render: (f) => (
    <div style={{ background:'rgba(0,40,80,0.4)',border:'1px solid rgba(0,140,255,0.2)',borderRadius:3,padding:'4px 6px',display:'flex',gap:4 }}>
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:18,height:18,border:`1px dashed ${c.tx}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:c.tx,fontFamily:'monospace' }}>{x.result}</div>
        );
      })}
    </div>
  ),
},

/* 34 */ {
  title: 'גל / ספירל',
  render: (f) => {
    const pts=f.map((x,i)=>{
      const y=x.result==='W'?4:x.result==='D'?14:24;
      return [10+i*24, y];
    });
    return (
      <svg width={130} height={32}>
        <defs>
          <linearGradient id="wave2" x1="0" y1="0" x2="1" y2="0">
            {f.map((x,i)=><stop key={i} offset={`${i*25}%`} stopColor={C[x.result].tx}/>)}
          </linearGradient>
        </defs>
        <path d={`M ${pts.map(p=>p.join(',')).join(' C ')}`} fill="none" stroke="url(#wave2)" strokeWidth={2} strokeLinecap="round"/>
        {pts.map(([x,y],i)=>(
          <g key={i}>
            <circle cx={x} cy={y} r={5} fill={C[f[i].result].bg} stroke={C[f[i].result].tx} strokeWidth={1.5}/>
            <text x={x} y={y+3.5} textAnchor="middle" fontSize={7} fontWeight={900} fill={C[f[i].result].tx}>{f[i].result}</text>
          </g>
        ))}
      </svg>
    );
  },
},

/* 35 */ {
  title: 'מסך מטריקס',
  render: (f) => (
    <div style={{ background:'rgba(0,10,0,0.7)',border:'1px solid rgba(0,255,0,0.2)',borderRadius:3,padding:'4px 6px',display:'flex',gap:5,fontFamily:'monospace' }}>
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ display:'flex',flexDirection:'column',gap:1,alignItems:'center' }}>
            {[x.result,'.',x.scored].map((ch,ci)=>(
              <span key={ci} style={{ fontSize:8,color:ci===0?c.tx:'rgba(0,255,70,0.4)',lineHeight:1 }}>{ch}</span>
            ))}
          </div>
        );
      })}
    </div>
  ),
},

/* 36 */ {
  title: 'כרטיס עם סטטוס צד',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ display:'flex',height:28,overflow:'hidden',borderRadius:4,border:`1px solid ${c.bd}` }}>
            <div style={{ width:4,background:c.so }} />
            <div style={{ padding:'2px 5px',background:c.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1 }}>
              <span style={{ fontSize:9,fontWeight:900,color:c.tx }}>{x.result}</span>
              <span style={{ fontSize:7,color:'rgba(255,255,255,0.4)' }}>{x.scored}:{x.conceded}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 37 */ {
  title: 'מעגל חלקי מתמלא',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const pct=x.result==='W'?100:x.result==='D'?60:20;
        const r=9,circ=2*Math.PI*r;
        return (
          <svg key={i} width={22} height={22}>
            <circle cx={11} cy={11} r={r} fill={c.bg} stroke="rgba(255,255,255,0.06)" strokeWidth={2}/>
            <circle cx={11} cy={11} r={r} fill="none" stroke={c.so} strokeWidth={2} strokeDasharray={`${circ*pct/100} ${circ}`} strokeLinecap="round" transform="rotate(-90 11 11)"/>
            <text x={11} y={14} textAnchor="middle" fontSize={7} fontWeight={900} fill={c.tx}>{x.result}</text>
          </svg>
        );
      })}
    </div>
  ),
},

/* 38 */ {
  title: 'שלט הפוך-קדימה',
  render: (f) => (
    <div style={{ display:'flex',gap:1,background:'rgba(0,0,0,0.5)',borderRadius:4,padding:2,border:'1px solid rgba(255,255,255,0.06)' }}>
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:22,height:30,borderRadius:2,overflow:'hidden',position:'relative' }}>
            <div style={{ position:'absolute',top:0,left:0,right:0,height:'50%',background:c.bg,border:`1px solid ${c.bd}`,borderBottom:'1px solid rgba(0,0,0,0.3)',display:'flex',alignItems:'flex-end',justifyContent:'center',paddingBottom:1 }}>
              <span style={{ fontSize:9,fontWeight:900,color:c.tx }}>{x.result}</span>
            </div>
            <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'50%',background:c.bg,border:`1px solid ${c.bd}`,borderTop:'1px solid rgba(0,0,0,0.3)',display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:1 }}>
              <span style={{ fontSize:9,fontWeight:900,color:c.tx }}>{x.result}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 39 */ {
  title: 'מקשי מכונת כתיבה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:24,height:24,background:`linear-gradient(to bottom,rgba(255,255,255,0.1),rgba(255,255,255,0.03))`,border:`1px solid rgba(255,255,255,0.15)`,borderRadius:'4px 4px 3px 3px',boxShadow:`0 3px 0 rgba(0,0,0,0.5),0 4px 0 ${c.so}60`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:900,color:c.tx }}>{x.result}</div>
        );
      })}
    </div>
  ),
},

/* 40 */ {
  title: 'טרייל שביל',
  render: (f) => (
    <svg width={140} height={30}>
      {f.map((x,i) => {
        const c=C[x.result];
        const cx=15+i*26, cy=15;
        return (
          <g key={i}>
            {i>0 && <line x1={cx-26+10} y1={15} x2={cx-10} y2={15} stroke={`${C[f[i-1].result].tx}50`} strokeWidth={2} strokeDasharray="3,2"/>}
            <circle cx={cx} cy={cy} r={10} fill={c.bg} stroke={c.tx} strokeWidth={1.5}/>
            <text x={cx} y={cy+3.5} textAnchor="middle" fontSize={8} fontWeight={900} fill={c.tx}>{x.result}</text>
          </g>
        );
      })}
    </svg>
  ),
},

/* 41 */ {
  title: 'פנים ביטוי',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => { const e=x.result==='W'?'😄':x.result==='D'?'😐':'😞'; return <span key={i} style={{ fontSize:22,lineHeight:1 }}>{e}</span>; })}
    </div>
  ),
},

/* 42 */ {
  title: 'כפתור Toggle',
  render: (f) => (
    <div className="flex flex-col gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const on=x.result==='W';
        const half=x.result==='D';
        return (
          <div key={i} style={{ width:36,height:14,borderRadius:7,background:on?c.so:half?`linear-gradient(90deg,${c.so} 50%,rgba(255,255,255,0.1) 50%)`:'rgba(255,255,255,0.1)',border:`1px solid ${c.bd}`,position:'relative',display:'flex',alignItems:'center' }}>
            <div style={{ position:'absolute',width:10,height:10,borderRadius:'50%',background:'#fff',left:on?24:half?13:2,transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.4)' }}/>
          </div>
        );
      })}
    </div>
  ),
},

/* 43 */ {
  title: 'פיקסל 8-ביט דמות',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => {
        const c=C[x.result];
        const face = x.result==='W'
          ? [[0,1,0,1,0],[1,1,1,1,1],[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0]]
          : x.result==='D'
          ? [[0,1,0,1,0],[1,1,1,1,1],[0,1,1,1,0],[0,1,0,1,0],[0,0,0,0,0]]
          : [[0,1,0,1,0],[1,1,1,1,1],[0,1,1,1,0],[0,0,0,0,0],[1,0,1,0,1]];
        return (
          <div key={i} style={{ display:'grid',gridTemplateColumns:'repeat(5,4px)',gridTemplateRows:'repeat(5,4px)',gap:1 }}>
            {face.flat().map((on,pi) => <div key={pi} style={{ width:4,height:4,background:on?c.so:'rgba(255,255,255,0.04)',borderRadius:1 }}/>)}
          </div>
        );
      })}
    </div>
  ),
},

/* 44 */ {
  title: 'ג\'ם / אבן חן',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:22,height:22,clipPath:'polygon(50% 0%,100% 35%,80% 100%,20% 100%,0% 35%)',background:`linear-gradient(135deg,${c.tx},${c.so})`,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ fontSize:7,fontWeight:900,color:'rgba(0,0,0,0.6)',transform:'translateY(3px)' }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 45 */ {
  title: 'מפת חום שורה',
  render: (f) => {
    const colors=['W','W','D','L','W'];
    return (
      <div className="flex">
        {f.map((x,i) => {
          const c=C[x.result];
          return <div key={i} style={{ width:22,height:22,background:c.so,opacity:x.result==='W'?0.9:x.result==='D'?0.55:0.25,border:'1px solid rgba(0,0,0,0.3)' }}/>;
        })}
      </div>
    );
  },
},

/* 46 */ {
  title: 'מעטפה / מכתב',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:26,height:20,border:`1px solid ${c.bd}`,borderRadius:2,background:c.bg,position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',top:0,left:0,right:0,borderStyle:'solid',borderWidth:'10px 13px 0',borderColor:`${c.so}50 transparent transparent` }}/>
            <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'flex-end',justifyContent:'center',paddingBottom:2,fontSize:8,fontWeight:900,color:c.tx }}>{x.result}</div>
          </div>
        );
      })}
    </div>
  ),
},

/* 47 */ {
  title: 'שוחות / חריצים',
  render: (f) => (
    <div className="flex gap-1.5 items-center">
      {f.map((x,i) => {
        const c=C[x.result];
        const lines=x.result==='W'?4:x.result==='D'?2:1;
        return (
          <div key={i} style={{ display:'flex',flexDirection:'column',gap:2,alignItems:'center' }}>
            {Array.from({length:lines}).map((_,li) => (
              <div key={li} style={{ width:li===lines-1&&lines===4?14:16,height:2,background:c.so,borderRadius:1,opacity:0.85 }}/>
            ))}
          </div>
        );
      })}
    </div>
  ),
},

/* 48 */ {
  title: 'שמש / קרניים',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => {
        const c=C[x.result];
        const rays=x.result==='W'?8:x.result==='D'?4:0;
        const r=8;
        return (
          <svg key={i} width={24} height={24}>
            {Array.from({length:rays}).map((_,ri) => {
              const a=ri/rays*Math.PI*2;
              return <line key={ri} x1={12+r*Math.cos(a)} y1={12+r*Math.sin(a)} x2={12+(r+4)*Math.cos(a)} y2={12+(r+4)*Math.sin(a)} stroke={c.tx} strokeWidth={1.5} strokeLinecap="round"/>;
            })}
            <circle cx={12} cy={12} r={r-1} fill={c.bg} stroke={c.tx} strokeWidth={1.5}/>
            <text x={12} y={15} textAnchor="middle" fontSize={7} fontWeight={900} fill={c.tx}>{x.result}</text>
          </svg>
        );
      })}
    </div>
  ),
},

/* 49 */ {
  title: 'ניאון שלט',
  render: (f) => (
    <div className="flex gap-1" style={{ background:'rgba(0,0,0,0.5)',padding:'4px 6px',borderRadius:4,border:'1px solid rgba(255,255,255,0.05)' }}>
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ fontSize:14,fontWeight:900,color:c.tx,textShadow:`0 0 5px ${c.tx},0 0 10px ${c.tx},0 0 20px ${c.tx}`,lineHeight:1,fontFamily:'serif',letterSpacing:1 }}>{x.result}</div>
        );
      })}
    </div>
  ),
},

/* 50 */ {
  title: 'ספר ציונים',
  render: (f) => {
    const w=f.filter(x=>x.result==='W').length;
    const d=f.filter(x=>x.result==='D').length;
    const l=f.filter(x=>x.result==='L').length;
    const pts=w*3+d;
    return (
      <div style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,padding:'6px 10px',display:'flex',flexDirection:'column',gap:3 }}>
        <div className="flex gap-3">
          {[[w,'W','ניצ'],[d,'D','תי'],[l,'L','הפ']].map(([n,r,lbl])=>(
            <div key={r} style={{ display:'flex',alignItems:'center',gap:3 }}>
              <span style={{ fontSize:8,color:'rgba(255,255,255,0.3)' }}>{lbl}</span>
              <span style={{ fontSize:14,fontWeight:900,color:C[r].tx,lineHeight:1 }}>{n}</span>
            </div>
          ))}
        </div>
        <div style={{ height:4,borderRadius:2,overflow:'hidden',display:'flex' }}>
          <div style={{ flex:w,background:C.W.so }}/>
          <div style={{ flex:d,background:C.D.so }}/>
          <div style={{ flex:l,background:C.L.so }}/>
        </div>
        <div style={{ fontSize:8,color:'rgba(255,255,255,0.3)',textAlign:'right' }}>{pts} נקודות</div>
      </div>
    );
  },
},

];

/* ── Card + Main (same structure as AdminFormDemo.jsx) ────────────────────── */
function DemoCard({ variant, idx, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(idx)}
      style={{
        background: selected ? 'rgba(250,204,21,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 12,
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', minWidth: 22 }}>#{idx + 1}</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: selected ? '#facc15' : 'rgba(255,255,255,0.5)' }}>{variant.title}</span>
      </div>
      <div className="flex items-center justify-center" style={{ minHeight: 40 }}>
        {variant.render(FORM)}
      </div>
    </div>
  );
}

export default function AdminFormDemo2() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו 2 — 5 משחקים אחרונים</h2>
        <p className="text-slate-500 text-sm">50 עיצובים נוספים · כולל 8 תלת-מימד · לחץ לתצוגה מוגדלת</p>
      </div>

      {selected !== null && (
        <div style={{ background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#facc15', fontWeight: 700, marginBottom: 16 }}>תצוגה מוגדלת — #{selected + 1} {VARIANTS[selected].title}</p>
          <div style={{ display: 'flex', justifyContent: 'center', transform: 'scale(2)', transformOrigin: 'center', marginBottom: 16 }}>
            {VARIANTS[selected].render(FORM)}
          </div>
          <button onClick={() => setSelected(null)} style={{ marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>סגור תצוגה</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {VARIANTS.map((v, i) => (
          <DemoCard key={i} variant={v} idx={i} selected={selected === i} onSelect={setSelected} />
        ))}
      </div>
    </div>
  );
}
