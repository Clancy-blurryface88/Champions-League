import React, { useState, useEffect } from 'react';

const FORM = [
  { result: 'W', scored: 3, conceded: 0, opponent: 'France' },
  { result: 'D', scored: 1, conceded: 1, opponent: 'Germany' },
  { result: 'L', scored: 0, conceded: 2, opponent: 'Spain' },
  { result: 'W', scored: 2, conceded: 1, opponent: 'Italy' },
  { result: 'W', scored: 1, conceded: 0, opponent: 'Portugal' },
];

const C = {
  W: { bg: 'rgba(74,222,128,0.18)', bd: 'rgba(74,222,128,0.65)', tx: '#4ade80', so: '#22c55e', hex: '4ade80' },
  D: { bg: 'rgba(250,204,21,0.18)',  bd: 'rgba(250,204,21,0.55)',  tx: '#facc15', so: '#ca8a04', hex: 'facc15' },
  L: { bg: 'rgba(248,113,113,0.18)', bd: 'rgba(248,113,113,0.6)',  tx: '#f87171', so: '#dc2626', hex: 'f87171' },
};
const LBL = { W: 'ניצחון', D: 'תיקו', L: 'הפסד' };

/* ── 50 variants ─────────────────────────────────────────────────────────── */
const VARIANTS = [

/* 1 */ {
  title: 'ריבועים קלאסיים',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => <div key={i} style={{ width:22,height:22,background:C[x.result].bg,border:`1px solid ${C[x.result].bd}`,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:C[x.result].tx }}>{x.result}</div>)}
    </div>
  ),
},

/* 2 */ {
  title: 'עיגולים',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => <div key={i} style={{ width:22,height:22,background:C[x.result].bg,border:`1.5px solid ${C[x.result].bd}`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:C[x.result].tx }}>{x.result}</div>)}
    </div>
  ),
},

/* 3 */ {
  title: 'יהלומים',
  render: (f) => (
    <div className="flex gap-2 items-center">
      {f.map((x,i) => <div key={i} style={{ width:18,height:18,background:C[x.result].bg,border:`1.5px solid ${C[x.result].bd}`,transform:'rotate(45deg)',display:'flex',alignItems:'center',justifyContent:'center' }}><span style={{ transform:'rotate(-45deg)',fontSize:8,fontWeight:800,color:C[x.result].tx }}>{x.result}</span></div>)}
    </div>
  ),
},

/* 4 */ {
  title: 'פסים אנכיים',
  render: (f) => (
    <div className="flex gap-1 items-end" style={{ height:28 }}>
      {f.map((x,i) => { const h = x.result==='W'?28:x.result==='D'?18:10; return <div key={i} style={{ width:12,height:h,background:C[x.result].so,borderRadius:'3px 3px 1px 1px',opacity:0.85 }} />; })}
    </div>
  ),
},

/* 5 */ {
  title: 'חיצים',
  render: (f) => (
    <div className="flex gap-1.5 items-center">
      {f.map((x,i) => { const arrow = x.result==='W'?'↑':x.result==='D'?'→':'↓'; return <div key={i} style={{ width:22,height:22,background:C[x.result].bg,border:`1px solid ${C[x.result].bd}`,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:C[x.result].tx,fontWeight:700 }}>{arrow}</div>; })}
    </div>
  ),
},

/* 6 */ {
  title: 'ניקוד תוצאה',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => <div key={i} style={{ padding:'2px 5px',background:C[x.result].bg,border:`1px solid ${C[x.result].bd}`,borderRadius:4,fontSize:9,fontWeight:900,color:C[x.result].tx,lineHeight:1.4,whiteSpace:'nowrap' }}>{x.scored}:{x.conceded}</div>)}
    </div>
  ),
},

/* 7 */ {
  title: 'טיפות',
  render: (f) => (
    <div className="flex gap-1.5 items-end">
      {f.map((x,i) => <div key={i} style={{ width:16,height:22,background:C[x.result].so,borderRadius:'50% 50% 50% 50% / 30% 30% 70% 70%',opacity:0.8 }} />)}
    </div>
  ),
},

/* 8 */ {
  title: 'אמוג\'י',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => { const e = x.result==='W'?'⚽':x.result==='D'?'🤝':'😤'; return <span key={i} style={{ fontSize:18,filter:x.result==='L'?'grayscale(0.5)':'none' }}>{e}</span>; })}
    </div>
  ),
},

/* 9 */ {
  title: 'תגיות טקסט',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => <div key={i} style={{ padding:'1px 6px',background:C[x.result].bg,border:`1px solid ${C[x.result].bd}`,borderRadius:10,fontSize:8,fontWeight:700,color:C[x.result].tx }}>{LBL[x.result]}</div>)}
    </div>
  ),
},

/* 10 */ {
  title: 'סימני V / - / X',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => { const s = x.result==='W'?'✓':x.result==='D'?'—':'✕'; return <div key={i} style={{ width:22,height:22,background:C[x.result].bg,border:`1px solid ${C[x.result].bd}`,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:C[x.result].tx }}>{s}</div>; })}
    </div>
  ),
},

/* 11 */ {
  title: 'ניאון זוהר',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => <div key={i} style={{ width:22,height:22,background:'transparent',border:`2px solid ${C[x.result].tx}`,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:C[x.result].tx,boxShadow:`0 0 8px ${C[x.result].tx}, 0 0 2px ${C[x.result].tx}`,textShadow:`0 0 6px ${C[x.result].tx}` }}>{x.result}</div>)}
    </div>
  ),
},

/* 12 */ {
  title: 'זכוכית מקוררת',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => <div key={i} style={{ width:24,height:24,background:'rgba(255,255,255,0.07)',backdropFilter:'blur(8px)',border:`1px solid rgba(255,255,255,0.15)`,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:C[x.result].tx,boxShadow:'inset 0 1px 0 rgba(255,255,255,0.15)' }}>{x.result}</div>)}
    </div>
  ),
},

/* 13 */ {
  title: 'פיקסל רטרו',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => <div key={i} style={{ width:22,height:22,background:C[x.result].so,imageRendering:'pixelated',border:`2px solid rgba(0,0,0,0.5)`,boxShadow:`inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.2)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,color:'#fff',fontFamily:'monospace' }}>{x.result}</div>)}
    </div>
  ),
},

/* 14 */ {
  title: 'קרדיוגרף',
  render: (f) => {
    const pts = f.map(x => x.result==='W'?24:x.result==='D'?12:0);
    const w=120, h=32, pad=10;
    const xStep = (w-pad*2)/(pts.length-1);
    const d = pts.map((p,i) => `${i===0?'M':'L'} ${pad+i*xStep} ${h-4-p*((h-8)/24)}`).join(' ');
    return (
      <svg width={w} height={h} style={{ overflow:'visible' }}>
        <defs><linearGradient id="ecg" x1="0" y1="0" x2="1" y2="0">{pts.map((p,i) => <stop key={i} offset={`${i*25}%`} stopColor={C[f[i].result].tx} />)}</linearGradient></defs>
        <path d={d} fill="none" stroke="url(#ecg)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i) => <circle key={i} cx={pad+i*xStep} cy={h-4-p*((h-8)/24)} r={3} fill={C[f[i].result].tx} />)}
      </svg>
    );
  },
},

/* 15 */ {
  title: 'מדרגות',
  render: (f) => {
    const h = (r) => r==='W'?4:r==='D'?12:22;
    return (
      <div className="flex gap-1 items-start" style={{ height:32 }}>
        {f.map((x,i) => <div key={i} style={{ width:18,height:26-h(x.result),marginTop:h(x.result),background:C[x.result].bg,border:`1px solid ${C[x.result].bd}`,borderRadius:'3px 3px 0 0',display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:2,fontSize:7,fontWeight:800,color:C[x.result].tx }}>{x.result}</div>)}
      </div>
    );
  },
},

/* 16 */ {
  title: 'טיימליין',
  render: (f) => (
    <div className="flex items-center">
      {f.map((x,i) => (
        <React.Fragment key={i}>
          <div style={{ width:18,height:18,borderRadius:'50%',background:C[x.result].so,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:'#fff' }}>{x.result}</div>
          {i<f.length-1 && <div style={{ width:10,height:2,background:`linear-gradient(90deg,${C[x.result].tx},${C[f[i+1].result].tx})`,opacity:0.5 }} />}
        </React.Fragment>
      ))}
    </div>
  ),
},

/* 17 */ {
  title: 'פסי גרדיאנט',
  render: (f) => (
    <div className="flex gap-1 items-end" style={{ height:32 }}>
      {f.map((x,i) => { const h=x.result==='W'?32:x.result==='D'?20:10; return <div key={i} style={{ width:14,height:h,background:`linear-gradient(to top, ${C[x.result].so}, ${C[x.result].tx})`,borderRadius:'3px 3px 0 0',opacity:0.85 }} />; })}
    </div>
  ),
},

/* 18 */ {
  title: 'עיגולי טבעת',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => <div key={i} style={{ width:22,height:22,borderRadius:'50%',border:`3px solid ${C[x.result].tx}`,background:'transparent',boxShadow:`0 0 0 1px ${C[x.result].bg}` }} />)}
    </div>
  ),
},

/* 19 */ {
  title: 'גלאוו פולסינג',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => <div key={i} style={{ width:20,height:20,borderRadius:'50%',background:C[x.result].so,boxShadow:`0 0 0 4px ${C[x.result].bg},0 0 12px ${C[x.result].tx}`,opacity: x.result==='L'?0.5:1 }} />)}
    </div>
  ),
},

/* 20 */ {
  title: 'חציוני',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => (
        <div key={i} style={{ width:22,height:22,borderRadius:4,overflow:'hidden',border:`1px solid ${C[x.result].bd}`,position:'relative' }}>
          <div style={{ position:'absolute',top:0,left:0,right:0,bottom:'50%',background:C[x.result].so,opacity:0.6 }} />
          <div style={{ position:'absolute',top:'50%',left:0,right:0,bottom:0,background:C[x.result].bg }} />
          <div style={{ position:'relative',zIndex:1,display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontSize:8,fontWeight:900,color:'#fff' }}>{x.result}</div>
        </div>
      ))}
    </div>
  ),
},

/* 21 */ {
  title: 'הקסגון',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => <div key={i} style={{ width:22,height:24,clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',background:C[x.result].so,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:'#fff' }}>{x.result}</div>)}
    </div>
  ),
},

/* 22 */ {
  title: '3D פרספקטיבה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => <div key={i} style={{ width:22,height:22,background:C[x.result].bg,border:`1px solid ${C[x.result].bd}`,borderRadius:3,transform:'perspective(60px) rotateX(15deg) rotateY(-10deg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:C[x.result].tx,boxShadow:`3px 3px 0 ${C[x.result].so}40` }}>{x.result}</div>)}
    </div>
  ),
},

/* 23 */ {
  title: 'רצועות אלכסוניות',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => (
        <div key={i} style={{ width:22,height:22,overflow:'hidden',borderRadius:4,border:`1px solid ${C[x.result].bd}`,position:'relative',background:'rgba(255,255,255,0.03)' }}>
          <div style={{ position:'absolute',top:0,left:0,right:0,bottom:0,background:C[x.result].so,clipPath:'polygon(0 0,70% 0,30% 100%,0 100%)',opacity:0.7 }} />
          <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:'#fff' }}>{x.result}</div>
        </div>
      ))}
    </div>
  ),
},

/* 24 */ {
  title: 'צ\'יפים',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => <div key={i} style={{ padding:'2px 7px',background:C[x.result].so,borderRadius:20,fontSize:9,fontWeight:900,color:'#fff',letterSpacing:0.5 }}>{x.result}</div>)}
    </div>
  ),
},

/* 25 */ {
  title: 'מספרים',
  render: (f) => (
    <div className="flex gap-1.5 items-end">
      {f.map((x,i) => <div key={i} style={{ width:22,height:22,background:C[x.result].bg,border:`1px solid ${C[x.result].bd}`,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,color:C[x.result].tx }}>{x.scored}</div>)}
    </div>
  ),
},

/* 26 */ {
  title: 'כוכבים',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => <div key={i} style={{ fontSize:18,lineHeight:1,filter:`drop-shadow(0 0 4px ${C[x.result].tx})`,opacity:x.result==='L'?0.3:x.result==='D'?0.65:1 }}>★</div>)}
    </div>
  ),
},

/* 27 */ {
  title: 'פסי דירוג',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const bars = x.result==='W'?3:x.result==='D'?2:1;
        return (
          <div key={i} className="flex gap-0.5 items-end" style={{ height:20 }}>
            {[1,2,3].map(b => <div key={b} style={{ width:5,height:b<=bars?b*6:6,background:b<=bars?C[x.result].tx:'rgba(255,255,255,0.1)',borderRadius:1,opacity:b<=bars?1:0.3 }} />)}
          </div>
        );
      })}
    </div>
  ),
},

/* 28 */ {
  title: 'בועות דיבור',
  render: (f) => (
    <div className="flex gap-1.5 items-center">
      {f.map((x,i) => (
        <div key={i} style={{ position:'relative' }}>
          <div style={{ padding:'2px 6px',background:C[x.result].bg,border:`1px solid ${C[x.result].bd}`,borderRadius:6,fontSize:9,fontWeight:800,color:C[x.result].tx }}>
            {x.scored}:{x.conceded}
          </div>
          <div style={{ position:'absolute',bottom:-4,left:'50%',marginLeft:-3,width:0,height:0,borderLeft:'3px solid transparent',borderRight:'3px solid transparent',borderTop:`4px solid ${C[x.result].bd}` }} />
        </div>
      ))}
    </div>
  ),
},

/* 29 */ {
  title: 'חשמל / ברק',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => <div key={i} style={{ fontSize:x.result==='W'?20:x.result==='D'?16:14,lineHeight:1,filter:x.result==='W'?`drop-shadow(0 0 6px ${C.W.tx})`:'none',opacity:x.result==='L'?0.3:1,color:C[x.result].tx }}>{x.result==='W'?'⚡':x.result==='D'?'〰':'✕'}</div>)}
    </div>
  ),
},

/* 30 */ {
  title: 'מד עיגול',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const pct = x.result==='W'?100:x.result==='D'?60:20;
        const r=9, circ=2*Math.PI*r;
        return (
          <svg key={i} width={22} height={22}>
            <circle cx={11} cy={11} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={2.5} />
            <circle cx={11} cy={11} r={r} fill="none" stroke={C[x.result].tx} strokeWidth={2.5}
              strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
              strokeLinecap="round" transform="rotate(-90 11 11)" />
            <text x={11} y={14} textAnchor="middle" fontSize={7} fontWeight={800} fill={C[x.result].tx}>{x.result}</text>
          </svg>
        );
      })}
    </div>
  ),
},

/* 31 */ {
  title: 'DNA/גדיל',
  render: (f) => (
    <div className="flex items-center gap-0">
      {f.map((x,i) => {
        const top = i%2===0;
        return (
          <div key={i} className="flex flex-col items-center" style={{ width:24 }}>
            {top && <div style={{ width:14,height:14,borderRadius:'50%',background:C[x.result].so,fontSize:7,fontWeight:900,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center' }}>{x.result}</div>}
            <div style={{ width:2,height:top?8:8,background:'rgba(255,255,255,0.15)' }} />
            {!top && <div style={{ width:14,height:14,borderRadius:'50%',background:C[x.result].so,fontSize:7,fontWeight:900,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center' }}>{x.result}</div>}
          </div>
        );
      })}
    </div>
  ),
},

/* 32 */ {
  title: 'כרטיסי ציון',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => (
        <div key={i} style={{ background:'rgba(255,255,255,0.05)',border:`1px solid rgba(255,255,255,0.1)`,borderRadius:4,padding:'2px 4px',textAlign:'center',minWidth:22 }}>
          <div style={{ fontSize:11,fontWeight:900,color:C[x.result].tx,lineHeight:1 }}>{x.scored}:{x.conceded}</div>
          <div style={{ fontSize:6,color:'rgba(255,255,255,0.3)',marginTop:1 }}>נ</div>
        </div>
      ))}
    </div>
  ),
},

/* 33 */ {
  title: 'קרנות בלבד',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => (
        <div key={i} style={{ width:20,height:20,position:'relative' }}>
          {['tl','tr','bl','br'].map(corner => {
            const s = { position:'absolute',width:5,height:5,borderColor:C[x.result].tx };
            if(corner==='tl') Object.assign(s,{top:0,left:0,borderTopWidth:2,borderLeftWidth:2,borderStyle:'solid'});
            if(corner==='tr') Object.assign(s,{top:0,right:0,borderTopWidth:2,borderRightWidth:2,borderStyle:'solid'});
            if(corner==='bl') Object.assign(s,{bottom:0,left:0,borderBottomWidth:2,borderLeftWidth:2,borderStyle:'solid'});
            if(corner==='br') Object.assign(s,{bottom:0,right:0,borderBottomWidth:2,borderRightWidth:2,borderStyle:'solid'});
            return <div key={corner} style={s} />;
          })}
          <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,fontWeight:900,color:C[x.result].tx }}>{x.result}</div>
        </div>
      ))}
    </div>
  ),
},

/* 34 */ {
  title: 'סיכום מצטבר',
  render: (f) => {
    const w=f.filter(x=>x.result==='W').length;
    const d=f.filter(x=>x.result==='D').length;
    const l=f.filter(x=>x.result==='L').length;
    return (
      <div className="flex gap-1.5 items-center">
        {[[w,'W'],[d,'D'],[l,'L']].map(([n,r],i) => (
          <div key={i} style={{ display:'flex',alignItems:'center',gap:3 }}>
            <div style={{ width:14,height:14,borderRadius:3,background:C[r].bg,border:`1px solid ${C[r].bd}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,fontWeight:800,color:C[r].tx }}>{r}</div>
            <span style={{ fontSize:13,fontWeight:900,color:C[r].tx }}>{n}</span>
          </div>
        ))}
      </div>
    );
  },
},

/* 35 */ {
  title: 'צבע מלא + אות',
  render: (f) => (
    <div className="flex gap-0.5">
      {f.map((x,i) => <div key={i} style={{ width:22,height:22,background:C[x.result].so,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:900,color:'rgba(0,0,0,0.7)',borderRadius:i===0?'6px 2px 2px 6px':i===4?'2px 6px 6px 2px':'2px' }}>{x.result}</div>)}
    </div>
  ),
},

/* 36 */ {
  title: 'טקסט שורה',
  render: (f) => (
    <div className="flex items-center gap-1">
      {f.map((x,i) => (
        <React.Fragment key={i}>
          <span style={{ fontSize:11,fontWeight:900,color:C[x.result].tx,textShadow:`0 0 8px ${C[x.result].tx}60` }}>{x.scored}:{x.conceded}</span>
          {i<f.length-1 && <span style={{ color:'rgba(255,255,255,0.15)',fontSize:8 }}>·</span>}
        </React.Fragment>
      ))}
    </div>
  ),
},

/* 37 */ {
  title: 'עוצמת צבע',
  render: (f) => {
    const ops = f.map(x=>x.result==='W'?1:x.result==='D'?0.55:0.2);
    return (
      <div className="flex gap-1">
        {f.map((x,i) => <div key={i} style={{ width:22,height:22,background:C[x.result].so,borderRadius:4,opacity:ops[i],display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,color:'#fff' }}>{x.result}</div>)}
      </div>
    );
  },
},

/* 38 */ {
  title: 'SVG פוליגון',
  render: (f) => (
    <svg width={120} height={30}>
      {f.map((x,i) => {
        const cx = 12 + i*24, cy = 15;
        const r = x.result==='W'?12:x.result==='D'?8:5;
        return <circle key={i} cx={cx} cy={cy} r={r} fill={C[x.result].so} opacity={0.8} />;
      })}
    </svg>
  ),
},

/* 39 */ {
  title: 'אותיות גדולות',
  render: (f) => (
    <div className="flex gap-1 items-baseline">
      {f.map((x,i) => <span key={i} style={{ fontSize:x.result==='W'?20:x.result==='D'?16:12,fontWeight:900,color:C[x.result].tx,lineHeight:1,transition:'font-size 0.2s' }}>{x.result}</span>)}
    </div>
  ),
},

/* 40 */ {
  title: 'קציר חריצים',
  render: (f) => {
    const w=f.filter(x=>x.result==='W').length;
    const marks = Array.from({length:w}).map((_,i)=>i);
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5 items-center">
          {[0,1,2,3].map(i => <div key={i} style={{ width:i===3?2:2,height:i===3?14:10,background:i<w?C.W.tx:'rgba(255,255,255,0.15)',borderRadius:1,transform:i===3?'rotate(45deg)':'none' }} />)}
        </div>
        <div style={{ fontSize:9,color:'rgba(255,255,255,0.4)' }}>·</div>
        <span style={{ fontSize:9,color:C.W.tx,fontWeight:800 }}>{w}/5 ניצ׳</span>
      </div>
    );
  },
},

/* 41 */ {
  title: 'כרטיסים עם קו',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => (
        <div key={i} style={{ width:18,height:24,background:'rgba(255,255,255,0.04)',borderRadius:3,overflow:'hidden',display:'flex',flexDirection:'column',border:`1px solid rgba(255,255,255,0.08)` }}>
          <div style={{ height:4,background:C[x.result].so }} />
          <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:800,color:C[x.result].tx }}>{x.result}</div>
        </div>
      ))}
    </div>
  ),
},

/* 42 */ {
  title: 'פס אחד עם נקודות',
  render: (f) => (
    <div style={{ position:'relative',height:28,width:120 }}>
      <div style={{ position:'absolute',top:'50%',left:0,right:0,height:1,background:'rgba(255,255,255,0.1)',transform:'translateY(-50%)' }} />
      {f.map((x,i) => {
        const y = x.result==='W'?6:x.result==='D'?50:94;
        return (
          <div key={i} style={{ position:'absolute',left:4+i*24,top:`${y}%`,transform:'translate(-50%,-50%)',width:14,height:14,borderRadius:'50%',background:C[x.result].so,border:`2px solid rgba(0,0,0,0.4)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,fontWeight:900,color:'#fff' }}>{x.result}</div>
        );
      })}
    </div>
  ),
},

/* 43 */ {
  title: 'מד סרגל',
  render: (f) => {
    const w = f.filter(x=>x.result==='W').length/5*100;
    const d = f.filter(x=>x.result==='D').length/5*100;
    const l = 100-w-d;
    return (
      <div style={{ width:110,height:14,borderRadius:7,overflow:'hidden',display:'flex',border:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width:`${w}%`,background:C.W.so,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:'rgba(0,0,0,0.6)' }}>{w?`${w}%`:''}</div>
        <div style={{ width:`${d}%`,background:C.D.so,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:'rgba(0,0,0,0.6)' }}>{d?`${d}%`:''}</div>
        <div style={{ flex:1,background:C.L.so,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:'rgba(0,0,0,0.6)' }}>{l?`${l}%`:''}</div>
      </div>
    );
  },
},

/* 44 */ {
  title: 'דוט מינימל',
  render: (f) => (
    <div className="flex gap-2 items-center">
      {f.map((x,i) => <div key={i} style={{ width:10,height:10,borderRadius:'50%',background:C[x.result].so }} />)}
    </div>
  ),
},

/* 45 */ {
  title: 'מסגרות כפולות',
  render: (f) => (
    <div className="flex gap-2">
      {f.map((x,i) => (
        <div key={i} style={{ width:22,height:22,border:`2px solid ${C[x.result].tx}`,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`inset 0 0 0 3px ${C[x.result].bg}`,fontSize:9,fontWeight:800,color:C[x.result].tx }}>
          {x.result}
        </div>
      ))}
    </div>
  ),
},

/* 46 */ {
  title: 'כיוון אנכי',
  render: (f) => (
    <div className="flex flex-col gap-0.5">
      {f.map((x,i) => <div key={i} style={{ height:9,width:80,background:C[x.result].bg,border:`1px solid ${C[x.result].bd}`,borderRadius:3,display:'flex',alignItems:'center',paddingLeft:4,gap:4 }}><div style={{ width:5,height:5,borderRadius:'50%',background:C[x.result].so }} /><span style={{ fontSize:7,color:C[x.result].tx,fontWeight:700 }}>{x.opponent} {x.scored}:{x.conceded}</span></div>)}
    </div>
  ),
},

/* 47 */ {
  title: 'צבע + טשטוש',
  render: (f) => (
    <div className="flex gap-1 items-center">
      {f.map((x,i) => <div key={i} style={{ width:22,height:22,background:C[x.result].so,borderRadius:4,filter:`blur(${x.result==='L'?2:0}px)`,opacity:x.result==='W'?1:x.result==='D'?0.7:0.4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,color:'#fff' }}>{x.result}</div>)}
    </div>
  ),
},

/* 48 */ {
  title: 'ספינר כוכב',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => (
        <div key={i} style={{ position:'relative',width:22,height:22 }}>
          <div style={{ position:'absolute',inset:0,background:`conic-gradient(${C[x.result].so} ${x.result==='W'?100:x.result==='D'?60:25}%, rgba(255,255,255,0.05) 0)`,borderRadius:'50%' }} />
          <div style={{ position:'absolute',inset:3,background:'rgba(10,18,35,0.9)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,fontWeight:900,color:C[x.result].tx }}>{x.result}</div>
        </div>
      ))}
    </div>
  ),
},

/* 49 */ {
  title: 'כרטיס הפוך',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => (
        <div key={i} style={{ width:28,height:36,background:`linear-gradient(135deg,${C[x.result].bg},rgba(255,255,255,0.03))`,border:`1px solid ${C[x.result].bd}`,borderRadius:4,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1 }}>
          <div style={{ fontSize:10,fontWeight:900,color:C[x.result].tx }}>{x.scored}:{x.conceded}</div>
          <div style={{ fontSize:6,color:'rgba(255,255,255,0.3)',textAlign:'center',lineHeight:1.2,maxWidth:26,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{x.opponent}</div>
        </div>
      ))}
    </div>
  ),
},

/* 50 */ {
  title: 'וולייב אנימציה',
  render: (f) => {
    const [step, setStep] = React.useState(0);
    React.useEffect(() => { const t = setInterval(() => setStep(s=>(s+1)%f.length), 700); return ()=>clearInterval(t); }, []);
    return (
      <div className="flex gap-1.5 items-center">
        {f.map((x,i) => (
          <div key={i} style={{ width:22,height:22,background:C[x.result].bg,border:`1.5px solid ${C[x.result].bd}`,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:C[x.result].tx,transform:i===step?'scale(1.4)':'scale(1)',boxShadow:i===step?`0 0 10px ${C[x.result].tx}`:'none',transition:'transform 0.25s ease, box-shadow 0.25s ease' }}>{x.result}</div>
        ))}
      </div>
    );
  },
},

];

/* ── Card component ──────────────────────────────────────────────────────── */
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
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', minWidth: 18 }}>#{idx + 1}</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: selected ? '#facc15' : 'rgba(255,255,255,0.5)' }}>{variant.title}</span>
      </div>
      <div className="flex items-center justify-center" style={{ minHeight: 36 }}>
        {variant.render(FORM)}
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────────── */
export default function AdminFormDemo() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 5 משחקים אחרונים</h2>
        <p className="text-slate-500 text-sm">50 עיצובים שונים · לחץ לצפייה בתצוגה מוגדלת</p>
      </div>

      {/* Large preview */}
      {selected !== null && (
        <div style={{ background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#facc15', fontWeight: 700, marginBottom: 16 }}>תצוגה מוגדלת — #{selected + 1} {VARIANTS[selected].title}</p>
          <div style={{ display: 'flex', justifyContent: 'center', transform: 'scale(2)', transformOrigin: 'center', marginBottom: 16 }}>
            {VARIANTS[selected].render(FORM)}
          </div>
          <button onClick={() => setSelected(null)} style={{ marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>סגור תצוגה</button>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {VARIANTS.map((v, i) => (
          <DemoCard key={i} variant={v} idx={i} selected={selected === i} onSelect={setSelected} />
        ))}
      </div>
    </div>
  );
}
