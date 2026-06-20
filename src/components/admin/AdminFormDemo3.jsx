import React, { useState } from 'react';

const FORM = [
  { result: 'W', scored: 3, conceded: 0, opponent: 'France' },
  { result: 'D', scored: 1, conceded: 1, opponent: 'Germany' },
  { result: 'L', scored: 0, conceded: 2, opponent: 'Spain' },
  { result: 'W', scored: 2, conceded: 1, opponent: 'Italy' },
  { result: 'W', scored: 1, conceded: 0, opponent: 'Portugal' },
];

const C = {
  W: { bg:'rgba(74,222,128,0.18)', bd:'rgba(74,222,128,0.65)', tx:'#4ade80', so:'#22c55e', dk:'#15803d' },
  D: { bg:'rgba(250,204,21,0.18)', bd:'rgba(250,204,21,0.55)', tx:'#facc15', so:'#ca8a04', dk:'#92400e' },
  L: { bg:'rgba(248,113,113,0.18)', bd:'rgba(248,113,113,0.6)', tx:'#f87171', so:'#dc2626', dk:'#991b1b' },
};

const VARIANTS = [

/* 1 */ {
  title: 'פוסט-איט',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:26,height:28,background:c.bg,borderRadius:'2px 2px 6px 2px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1,boxShadow:`2px 3px 6px rgba(0,0,0,0.4)`,position:'relative' }}>
            <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:c.so,opacity:0.7,borderRadius:'2px 2px 0 0' }} />
            <span style={{ fontSize:10,fontWeight:900,color:c.tx }}>{x.result}</span>
            <span style={{ fontSize:7,color:'rgba(255,255,255,0.4)' }}>{x.scored}:{x.conceded}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 2 */ {
  title: 'אות תקופתית',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:24,height:28,border:`1px solid ${c.bd}`,borderRadius:2,display:'flex',flexDirection:'column',padding:'2px 2px 1px',position:'relative',background:c.bg }}>
            <span style={{ fontSize:5,color:c.bd,lineHeight:1,alignSelf:'flex-end' }}>{i+1}</span>
            <span style={{ fontSize:14,fontWeight:900,color:c.tx,lineHeight:1,textAlign:'center',flex:1,display:'flex',alignItems:'center',justifyContent:'center' }}>{x.result}</span>
            <span style={{ fontSize:5,color:'rgba(255,255,255,0.3)',textAlign:'center',lineHeight:1 }}>{x.scored+x.conceded}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 3 */ {
  title: 'סרגל Wi-Fi',
  render: (f) => (
    <div className="flex gap-2 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        const arcs=x.result==='W'?3:x.result==='D'?2:1;
        return (
          <svg key={i} width={22} height={20} viewBox="0 0 22 20">
            {[3,2,1].map(a => {
              const r=a*5, active=a<=arcs;
              return <path key={a} d={`M ${11-r} ${20-r*0.4} A ${r} ${r} 0 0 1 ${11+r} ${20-r*0.4}`} fill="none" stroke={active?c.tx:'rgba(255,255,255,0.08)'} strokeWidth={2} strokeLinecap="round"/>;
            })}
            <circle cx={11} cy={19} r={1.5} fill={arcs>0?c.tx:'rgba(255,255,255,0.15)'} />
          </svg>
        );
      })}
    </div>
  ),
},

/* 4 */ {
  title: 'דגל קצר',
  render: (f) => (
    <div className="flex gap-1.5 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        const h=x.result==='W'?28:x.result==='D'?20:14;
        return (
          <div key={i} style={{ display:'flex',alignItems:'flex-end',gap:1 }}>
            <div style={{ width:2,height:h+4,background:'rgba(255,255,255,0.15)',borderRadius:1 }} />
            <div style={{ width:16,height:h,background:c.bg,border:`1px solid ${c.bd}`,borderRadius:'0 2px 2px 0',clipPath:'polygon(0 0,100% 15%,100% 85%,0 100%)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontSize:7,fontWeight:900,color:c.tx }}>{x.result}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 5 */ {
  title: 'מד דלק',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const pct=x.result==='W'?100:x.result==='D'?50:15;
        return (
          <div key={i} style={{ width:12,height:28,border:`1px solid ${c.bd}`,borderRadius:2,overflow:'hidden',position:'relative',background:'rgba(0,0,0,0.3)' }}>
            <div style={{ position:'absolute',bottom:0,left:0,right:0,height:`${pct}%`,background:`linear-gradient(to top,${c.dk},${c.so})` }} />
            <div style={{ position:'absolute',top:2,left:'50%',transform:'translateX(-50%)',fontSize:7,fontWeight:900,color:'#fff',textShadow:'0 1px 2px rgba(0,0,0,0.8)' }}>{x.result}</div>
          </div>
        );
      })}
    </div>
  ),
},

/* 6 */ {
  title: 'כוכב מלא/חצי/ריק',
  render: (f) => (
    <div className="flex gap-1.5 items-center">
      {f.map((x,i) => {
        const c=C[x.result];
        const clip=x.result==='D'?'inset(0 50% 0 0)':'none';
        return (
          <div key={i} style={{ position:'relative',width:22,height:22 }}>
            <span style={{ fontSize:22,lineHeight:1,color:'rgba(255,255,255,0.08)',position:'absolute' }}>★</span>
            {x.result!=='L' && <span style={{ fontSize:22,lineHeight:1,color:c.so,position:'absolute',clipPath:clip,WebkitClipPath:clip,filter:`drop-shadow(0 0 4px ${c.tx})` }}>★</span>}
          </div>
        );
      })}
    </div>
  ),
},

/* 7 */ {
  title: 'פס הולוגרפי',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:24,height:24,borderRadius:4,border:`1px solid ${c.bd}`,background:`linear-gradient(135deg,${c.bg},rgba(255,255,255,0.08),${c.bg})`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',inset:0,background:'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.12) 50%,transparent 60%)',pointerEvents:'none' }} />
            <span style={{ fontSize:10,fontWeight:900,color:c.tx,position:'relative' }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 8 */ {
  title: 'סיכת מפה',
  render: (f) => (
    <div className="flex gap-2 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ display:'flex',flexDirection:'column',alignItems:'center' }}>
            <div style={{ width:20,height:20,borderRadius:'50% 50% 50% 0',background:c.so,transform:'rotate(-45deg)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 2px 6px rgba(0,0,0,0.4)` }}>
              <span style={{ transform:'rotate(45deg)',fontSize:8,fontWeight:900,color:'#fff' }}>{x.result}</span>
            </div>
            <div style={{ width:2,height:4,background:c.dk }} />
          </div>
        );
      })}
    </div>
  ),
},

/* 9 */ {
  title: 'כרטיס לוח שנה',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:24,height:28,border:`1px solid ${c.bd}`,borderRadius:3,overflow:'hidden',background:'rgba(0,0,0,0.2)' }}>
            <div style={{ height:8,background:c.so,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontSize:6,fontWeight:700,color:'rgba(0,0,0,0.7)' }}>2026</span>
            </div>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:20 }}>
              <span style={{ fontSize:12,fontWeight:900,color:c.tx }}>{x.result}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 10 */ {
  title: 'טביעת אצבע',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const rings=x.result==='W'?4:x.result==='D'?3:2;
        return (
          <svg key={i} width={22} height={22}>
            {Array.from({length:rings}).map((_,ri) => (
              <ellipse key={ri} cx={11} cy={14} rx={3+ri*2.2} ry={2+ri*1.8} fill="none" stroke={c.tx} strokeWidth={0.8} opacity={1-ri*0.15}/>
            ))}
            <circle cx={11} cy={14} r={1.5} fill={c.so}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 11 */ {
  title: 'כדור כוח',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const s=x.result==='W'?22:x.result==='D'?16:10;
        return (
          <div key={i} style={{ width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <div style={{ width:s,height:s,borderRadius:'50%',background:`radial-gradient(circle at 35% 35%,rgba(255,255,255,0.4),${c.so} 50%,${c.dk})`,boxShadow:`0 ${s/6}px ${s/3}px ${c.dk},0 0 ${s/2}px ${c.tx}40` }} />
          </div>
        );
      })}
    </div>
  ),
},

/* 12 */ {
  title: 'מדליה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:1 }}>
            <div style={{ width:4,height:6,background:`repeating-linear-gradient(90deg,${c.bd} 0px,${c.bd} 2px,transparent 2px,transparent 4px)` }} />
            <div style={{ width:20,height:20,borderRadius:'50%',background:`radial-gradient(circle at 40% 35%,rgba(255,255,255,0.25),${c.so},${c.dk})`,border:`1px solid ${c.tx}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 2px 6px rgba(0,0,0,0.5)` }}>
              <span style={{ fontSize:8,fontWeight:900,color:'rgba(255,255,255,0.9)' }}>{x.result}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 13 */ {
  title: 'שלט אנלוגי Flip',
  render: (f) => (
    <div className="flex gap-1" style={{ background:'#0a0a0a',padding:'3px 4px',borderRadius:4,border:'1px solid rgba(255,255,255,0.05)' }}>
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:20,height:26,borderRadius:2,overflow:'hidden',position:'relative',boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
            <div style={{ position:'absolute',top:0,left:0,right:0,height:'49%',background:c.bg,display:'flex',alignItems:'flex-end',justifyContent:'center',paddingBottom:0,borderBottom:'1px solid rgba(0,0,0,0.5)' }}>
              <span style={{ fontSize:11,fontWeight:900,color:c.tx,lineHeight:1 }}>{x.result}</span>
            </div>
            <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'49%',background:c.bg,display:'flex',alignItems:'flex-start',justifyContent:'center',overflow:'hidden' }}>
              <span style={{ fontSize:11,fontWeight:900,color:c.tx,lineHeight:1,marginTop:-2,opacity:0.6 }}>{x.result}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 14 */ {
  title: 'מסך פיקסל קטן',
  render: (f) => {
    const LETTERS = {
      W:[[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,0,0,1]],
      D:[[1,1,0,0,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,1,0,0],[1,1,0,0,0]],
      L:[[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0]],
    };
    return (
      <div className="flex gap-2">
        {f.map((x,i) => {
          const c=C[x.result];
          const grid=LETTERS[x.result];
          return (
            <div key={i} style={{ display:'grid',gridTemplateColumns:'repeat(5,3px)',gridTemplateRows:'repeat(5,3px)',gap:0.5 }}>
              {grid.flat().map((on,pi) => <div key={pi} style={{ width:3,height:3,background:on?c.so:'rgba(255,255,255,0.04)',borderRadius:0.5 }}/>)}
            </div>
          );
        })}
      </div>
    );
  },
},

/* 15 */ {
  title: 'מד אנרגיה',
  render: (f) => (
    <div className="flex gap-1 items-end" style={{ height:30 }}>
      {f.map((x,i) => {
        const c=C[x.result];
        const segs=x.result==='W'?5:x.result==='D'?3:1;
        return (
          <div key={i} className="flex flex-col-reverse gap-0.5">
            {Array.from({length:5}).map((_,si) => (
              <div key={si} style={{ width:10,height:4,borderRadius:1,background:si<segs?c.so:'rgba(255,255,255,0.06)',boxShadow:si<segs?`0 0 4px ${c.tx}`:'none' }} />
            ))}
          </div>
        );
      })}
    </div>
  ),
},

/* 16 */ {
  title: 'חץ כיוון',
  render: (f) => (
    <div className="flex gap-1.5 items-center">
      {f.map((x,i) => {
        const c=C[x.result];
        const d=x.result==='W'?'up':x.result==='D'?'right':'down';
        const pts={up:'12,2 22,18 2,18',right:'2,2 20,12 2,22',down:'2,2 22,2 12,20'}[d];
        return (
          <svg key={i} width={22} height={22}>
            <polygon points={pts} fill={c.bg} stroke={c.tx} strokeWidth={1.5}/>
            <text x={11} y={d==='up'?15:d==='down'?12:13} textAnchor="middle" fontSize={7} fontWeight={900} fill={c.tx}>{x.result}</text>
          </svg>
        );
      })}
    </div>
  ),
},

/* 17 */ {
  title: 'שאלת מוסיקה',
  render: (f) => (
    <div className="flex gap-1.5 items-end" style={{ height:32 }}>
      {f.map((x,i) => {
        const c=C[x.result];
        const bars=[2,4,3,5,2,4,3].slice(0,x.result==='W'?7:x.result==='D'?5:3);
        return (
          <div key={i} className="flex gap-px items-end" style={{ height:28 }}>
            {bars.map((h,bi) => <div key={bi} style={{ width:2,height:h*4,background:c.tx,borderRadius:1,opacity:0.8+bi*0.02 }}/>)}
          </div>
        );
      })}
    </div>
  ),
},

/* 18 */ {
  title: 'מגן/Shield',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:20,height:24,clipPath:'polygon(0 0,100% 0,100% 65%,50% 100%,0 65%)',background:c.bg,border:`1px solid ${c.bd}`,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ fontSize:9,fontWeight:900,color:c.tx,marginTop:-4 }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 19 */ {
  title: 'חוגה עגולה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const pct=x.result==='W'?1:x.result==='D'?0.55:0.2;
        const r=9, circ=2*Math.PI*r;
        const angle=-Math.PI/2+pct*2*Math.PI;
        const nx=11+r*Math.cos(angle), ny=11+r*Math.sin(angle);
        return (
          <svg key={i} width={22} height={22}>
            <circle cx={11} cy={11} r={r} fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.06)" strokeWidth={2}/>
            <circle cx={11} cy={11} r={r} fill="none" stroke={c.tx} strokeWidth={2} strokeDasharray={`${circ*pct} ${circ}`} strokeLinecap="round" transform="rotate(-90 11 11)"/>
            <circle cx={nx} cy={ny} r={2} fill={c.so}/>
            <text x={11} y={14} textAnchor="middle" fontSize={7} fontWeight={900} fill={c.tx}>{x.result}</text>
          </svg>
        );
      })}
    </div>
  ),
},

/* 20 */ {
  title: 'מסגרת תמונה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:24,height:24,padding:2,background:c.bd,borderRadius:2,boxShadow:`0 2px 6px rgba(0,0,0,0.5)` }}>
            <div style={{ width:'100%',height:'100%',background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:1 }}>
              <span style={{ fontSize:10,fontWeight:900,color:c.tx }}>{x.result}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 21 */ {
  title: 'ניאון קו תחתון',
  render: (f) => (
    <div className="flex gap-2 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:2 }}>
            <span style={{ fontSize:13,fontWeight:900,color:c.tx,lineHeight:1 }}>{x.result}</span>
            <div style={{ width:x.result==='W'?20:x.result==='D'?14:8,height:2,background:c.so,borderRadius:1,boxShadow:`0 0 6px ${c.tx}` }} />
          </div>
        );
      })}
    </div>
  ),
},

/* 22 */ {
  title: 'פס ספורט',
  render: (f) => (
    <div className="flex gap-0.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:20,height:28,background:c.so,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',top:0,bottom:0,left:-4,width:8,background:'rgba(255,255,255,0.08)',transform:'skewX(-10deg)' }} />
            <span style={{ fontSize:9,fontWeight:900,color:'rgba(0,0,0,0.7)',position:'relative' }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 23 */ {
  title: 'כרטיס ניקוד עב',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:26,height:32,borderRadius:4,overflow:'hidden',border:`1px solid ${c.bd}` }}>
            <div style={{ height:18,background:c.so,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontSize:12,fontWeight:900,color:'rgba(0,0,0,0.75)' }}>{x.scored}:{x.conceded}</span>
            </div>
            <div style={{ height:14,background:c.bg,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontSize:8,fontWeight:700,color:c.tx }}>{x.result}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 24 */ {
  title: 'פולאריטי אנלוג',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const deg=x.result==='W'?-60:x.result==='D'?0:60;
        return (
          <svg key={i} width={24} height={20}>
            <path d="M 2 18 A 10 10 0 0 1 22 18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} strokeLinecap="round"/>
            <path d="M 2 18 A 10 10 0 0 1 22 18" fill="none" stroke={c.tx} strokeWidth={3} strokeLinecap="round"
              strokeDasharray={x.result==='W'?'31.4 0':x.result==='D'?'15 16':'5 26'}/>
            <line x1={12} y1={18} x2={12+9*Math.sin(deg*Math.PI/180)} y2={18-9*Math.cos(deg*Math.PI/180)} stroke={c.tx} strokeWidth={1.5} strokeLinecap="round"/>
            <circle cx={12} cy={18} r={2} fill={c.so}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 25 */ {
  title: 'עיגול חצוי אנכי',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:22,height:22,borderRadius:'50%',border:`1.5px solid ${c.bd}`,overflow:'hidden',position:'relative' }}>
            <div style={{ position:'absolute',left:0,top:0,width:`${x.result==='W'?100:x.result==='D'?50:15}%`,height:'100%',background:c.so }} />
            <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:'#fff',mixBlendMode:'difference' }}>{x.result}</div>
          </div>
        );
      })}
    </div>
  ),
},

/* 26 */ {
  title: 'כוכב דוד / פולי',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const n=x.result==='W'?6:x.result==='D'?5:4;
        const pts=Array.from({length:n*2}).map((_,pi) => {
          const a=pi/n/2*Math.PI*2-Math.PI/2;
          const r=pi%2===0?10:5;
          return `${11+r*Math.cos(a)},${11+r*Math.sin(a)}`;
        }).join(' ');
        return (
          <svg key={i} width={22} height={22}>
            <polygon points={pts} fill={c.bg} stroke={c.tx} strokeWidth={1}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 27 */ {
  title: 'לוח דמקה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:20,height:20,display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr',borderRadius:3,overflow:'hidden',border:`1px solid ${c.bd}` }}>
            {[0,1,1,0].map((fill,ci) => (
              <div key={ci} style={{ background:fill?c.so:c.bg }} />
            ))}
          </div>
        );
      })}
    </div>
  ),
},

/* 28 */ {
  title: 'תו מוסיקלי',
  render: (f) => (
    <div className="flex gap-2 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        const y=x.result==='W'?2:x.result==='D'?10:18;
        return (
          <svg key={i} width={14} height={28}>
            <line x1={10} y1={y} x2={10} y2={26} stroke={c.tx} strokeWidth={1.5}/>
            <ellipse cx={8} cy={25} rx={5} ry={3} fill={c.so} transform="rotate(-15 8 25)"/>
            {x.result==='W' && <path d="M 10 2 Q 14 4 10 8 Q 6 12 10 14" fill="none" stroke={c.tx} strokeWidth={1.2}/>}
          </svg>
        );
      })}
    </div>
  ),
},

/* 29 */ {
  title: 'מצפן',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const deg=x.result==='W'?0:x.result==='D'?90:180;
        return (
          <svg key={i} width={22} height={22}>
            <circle cx={11} cy={11} r={9} fill="rgba(0,0,0,0.3)" stroke={c.bd} strokeWidth={1}/>
            <polygon points={`11,${11-8} ${11+4},${11+4} 11,${11+2} ${11-4},${11+4}`} fill={c.tx} transform={`rotate(${deg} 11 11)`} opacity={0.9}/>
            <polygon points={`11,${11-8} ${11+4},${11+4} 11,${11+2} ${11-4},${11+4}`} fill="rgba(255,255,255,0.15)" transform={`rotate(${deg+180} 11 11)`}/>
            <circle cx={11} cy={11} r={2} fill={c.so}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 30 */ {
  title: 'פנס זרקור',
  render: (f) => (
    <div className="flex gap-1.5 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ position:'relative',width:20,height:28 }}>
            <div style={{ position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',width:0,height:0,borderLeft:'8px solid transparent',borderRight:'8px solid transparent',borderBottom:`20px solid ${c.so}20`,filter:'blur(3px)' }} />
            <div style={{ position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:10,height:10,borderRadius:'50%',background:c.so,boxShadow:`0 0 10px ${c.tx}` }} />
          </div>
        );
      })}
    </div>
  ),
},

/* 31 */ {
  title: 'תגית מחיר',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ position:'relative',paddingLeft:6 }}>
            <div style={{ position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:6,height:6,borderRadius:'50%',border:`1px solid ${c.bd}`,background:'transparent' }} />
            <div style={{ padding:'2px 5px',background:c.bg,border:`1px solid ${c.bd}`,clipPath:'polygon(8px 0,100% 0,100% 100%,8px 100%,0 50%)',display:'flex',flexDirection:'column',alignItems:'center' }}>
              <span style={{ fontSize:9,fontWeight:900,color:c.tx }}>{x.result}</span>
              <span style={{ fontSize:6,color:c.bd }}>{x.scored}:{x.conceded}</span>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 32 */ {
  title: 'ענבל / קוביה מגולגלת',
  render: (f) => {
    const [tick, setTick] = React.useState(0);
    React.useEffect(() => { const t = setInterval(() => setTick(n=>n+1), 800); return () => clearInterval(t); }, []);
    return (
      <div className="flex gap-2 items-center">
        {f.map((x,ii) => {
          const c=C[x.result];
          const rot=(tick+ii)*90;
          return (
            <div key={ii} style={{ width:22,height:22,background:c.bg,border:`1px solid ${c.bd}`,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',transform:`rotate(${rot}deg)`,transition:'transform 0.4s ease' }}>
              <span style={{ fontSize:9,fontWeight:900,color:c.tx,transform:`rotate(${-rot}deg)`,transition:'transform 0.4s ease' }}>{x.result}</span>
            </div>
          );
        })}
      </div>
    );
  },
},

/* 33 */ {
  title: 'קוד בר',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const widths=x.result==='W'?[2,1,2,1,2,1,3]:[1,2,1,3,1,2,1];
        return (
          <div key={i} style={{ display:'flex',gap:0.5,alignItems:'stretch',height:22,padding:'0 2px',background:c.bg,border:`1px solid ${c.bd}`,borderRadius:2 }}>
            {widths.map((w,wi) => <div key={wi} style={{ width:w,background:wi%2===0?c.so:'transparent' }}/>)}
          </div>
        );
      })}
    </div>
  ),
},

/* 34 */ {
  title: 'שביל כוכבים',
  render: (f) => {
    const stars=[[10,5],[20,12],[35,4],[50,14],[65,6],[80,10],[95,8]];
    return (
      <svg width={110} height={22}>
        {f.map((x,i) => {
          const c=C[x.result];
          const [sx,sy]=stars[i*1.2|0]||[i*20+10,10];
          const s=x.result==='W'?4:x.result==='D'?2.5:1.5;
          return (
            <g key={i}>
              <circle cx={10+i*22} cy={11} r={s} fill={c.so} opacity={0.9}/>
              {x.result==='W' && [[-3,-3],[3,-3],[0,3]].map(([dx,dy],pi)=>
                <circle key={pi} cx={10+i*22+dx} cy={11+dy} r={0.8} fill={c.tx} opacity={0.5}/>
              )}
            </g>
          );
        })}
      </svg>
    );
  },
},

/* 35 */ {
  title: 'קוביות טטריס',
  render: (f) => (
    <div className="flex gap-1.5 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        const h=x.result==='W'?3:x.result==='D'?2:1;
        return (
          <div key={i} className="flex flex-col gap-0.5">
            {Array.from({length:h}).map((_,ri) => (
              <div key={ri} style={{ width:14,height:14,background:c.so,border:`1px solid ${c.dk}`,boxShadow:`inset 2px 2px 0 rgba(255,255,255,0.2),inset -1px -1px 0 rgba(0,0,0,0.3)` }}/>
            ))}
          </div>
        );
      })}
    </div>
  ),
},

/* 36 */ {
  title: 'עיגול סטטוס',
  render: (f) => (
    <div className="flex gap-1.5 items-center">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ display:'flex',alignItems:'center',gap:4 }}>
            <div style={{ width:8,height:8,borderRadius:'50%',background:c.so,boxShadow:`0 0 6px ${c.tx}` }}/>
            <span style={{ fontSize:9,fontWeight:700,color:c.tx }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 37 */ {
  title: 'קוסמטי גרדיאנט',
  render: (f) => (
    <div className="flex gap-0">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:24,height:24,background:`linear-gradient(180deg,${c.tx},${c.dk})`,display:'flex',alignItems:'center',justifyContent:'center',opacity:0.85 }}>
            <span style={{ fontSize:9,fontWeight:900,color:'rgba(255,255,255,0.9)' }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 38 */ {
  title: 'מגנט',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:22,height:24,borderRadius:'10px 10px 0 0',overflow:'hidden',border:`1px solid ${c.bd}` }}>
            <div style={{ height:12,background:c.so,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontSize:9,fontWeight:900,color:'rgba(0,0,0,0.7)' }}>{x.result}</span>
            </div>
            <div style={{ height:12,display:'flex' }}>
              <div style={{ flex:1,background:C.W.so,opacity:0.6 }}/>
              <div style={{ flex:1,background:C.L.so,opacity:0.6 }}/>
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 39 */ {
  title: 'ענן מחשבה',
  render: (f) => (
    <div className="flex gap-2 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ position:'relative' }}>
            <div style={{ padding:'3px 7px',background:c.bg,border:`1px solid ${c.bd}`,borderRadius:10,fontSize:9,fontWeight:900,color:c.tx }}>
              {x.result}
            </div>
            {[{bottom:-5,left:8,w:5,h:5},{bottom:-9,left:4,w:3,h:3}].map((dot,di)=>(
              <div key={di} style={{ position:'absolute',bottom:dot.bottom,left:dot.left,width:dot.w,height:dot.h,borderRadius:'50%',background:c.bd }}/>
            ))}
          </div>
        );
      })}
    </div>
  ),
},

/* 40 */ {
  title: 'סוללת תצוגה',
  render: (f) => (
    <div style={{ display:'flex',flexDirection:'column',gap:2 }}>
      {f.map((x,i) => {
        const c=C[x.result];
        const w=x.result==='W'?100:x.result==='D'?60:20;
        return (
          <div key={i} style={{ display:'flex',alignItems:'center',gap:4 }}>
            <span style={{ fontSize:7,color:'rgba(255,255,255,0.3)',width:12 }}>{x.scored}:{x.conceded}</span>
            <div style={{ flex:1,height:6,background:'rgba(255,255,255,0.05)',borderRadius:3,overflow:'hidden',border:`1px solid ${c.bd}50` }}>
              <div style={{ width:`${w}%`,height:'100%',background:`linear-gradient(90deg,${c.dk},${c.so})`,borderRadius:3 }}/>
            </div>
            <span style={{ fontSize:7,fontWeight:900,color:c.tx,width:8 }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 41 */ {
  title: 'שמש זוהרת',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const rayCount=x.result==='W'?8:x.result==='D'?5:0;
        return (
          <svg key={i} width={24} height={24}>
            {Array.from({length:rayCount}).map((_,ri) => {
              const a=ri/rayCount*Math.PI*2;
              return <line key={ri} x1={12+6*Math.cos(a)} y1={12+6*Math.sin(a)} x2={12+10*Math.cos(a)} y2={12+10*Math.sin(a)} stroke={c.tx} strokeWidth={1.2} strokeLinecap="round" opacity={0.7}/>;
            })}
            <circle cx={12} cy={12} r={5} fill={c.bg} stroke={c.tx} strokeWidth={1.5}/>
            <text x={12} y={15} textAnchor="middle" fontSize={7} fontWeight={900} fill={c.tx}>{x.result}</text>
          </svg>
        );
      })}
    </div>
  ),
},

/* 42 */ {
  title: 'פח אשפה / מחזור',
  render: (f) => (
    <div className="flex gap-1.5 items-center">
      {f.map((x,i) => { const e=x.result==='W'?'♻️':x.result==='D'?'⬜':'🗑️'; return <span key={i} style={{ fontSize:18,lineHeight:1 }}>{e}</span>; })}
    </div>
  ),
},

/* 43 */ {
  title: 'ספייס / פלנטה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <svg key={i} width={24} height={24}>
            <circle cx={12} cy={12} r={7} fill={c.bg} stroke={c.tx} strokeWidth={1}/>
            <ellipse cx={12} cy={12} rx={11} ry={4} fill="none" stroke={c.bd} strokeWidth={1} transform="rotate(-20 12 12)"/>
            <text x={12} y={15} textAnchor="middle" fontSize={7} fontWeight={900} fill={c.tx}>{x.result}</text>
          </svg>
        );
      })}
    </div>
  ),
},

/* 44 */ {
  title: 'בניין / גובה עיר',
  render: (f) => (
    <div className="flex gap-0.5 items-end" style={{ height:32 }}>
      {f.map((x,i) => {
        const c=C[x.result];
        const h=x.result==='W'?32:x.result==='D'?20:12;
        return (
          <div key={i} style={{ width:16,height:h,background:c.bg,border:`1px solid ${c.bd}`,position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',top:3,left:2,right:2,display:'grid',gridTemplateColumns:'1fr 1fr',gap:1 }}>
              {Array.from({length:Math.floor((h-6)/5)}).map((_,wi) => (
                <div key={wi} style={{ height:3,background:c.so,opacity:0.5 }}/>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  ),
},

/* 45 */ {
  title: 'מדחף / טורבינה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const blades=x.result==='W'?3:x.result==='D'?2:1;
        return (
          <svg key={i} width={22} height={22}>
            {Array.from({length:blades}).map((_,bi) => {
              const a=bi/blades*Math.PI*2;
              return <ellipse key={bi} cx={11+6*Math.cos(a)} cy={11+6*Math.sin(a)} rx={5} ry={2} fill={c.bg} stroke={c.tx} strokeWidth={1} transform={`rotate(${a*180/Math.PI+30} ${11+6*Math.cos(a)} ${11+6*Math.sin(a)})`}/>;
            })}
            <circle cx={11} cy={11} r={3} fill={c.so}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 46 */ {
  title: 'גביע הגרלה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <svg key={i} width={18} height={24}>
            <path d="M 2 2 L 16 2 L 14 12 Q 9 18 9 20 L 9 22 M 5 22 L 13 22 M 4 8 Q 1 6 1 3 L 3 3 M 14 8 Q 17 6 17 3 L 15 3" fill="none" stroke={c.tx} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
            <text x={9} y={10} textAnchor="middle" fontSize={7} fontWeight={900} fill={c.tx}>{x.result}</text>
          </svg>
        );
      })}
    </div>
  ),
},

/* 47 */ {
  title: 'מחוג שעון',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const minAngle=x.result==='W'?-90:x.result==='D'?0:90;
        const hrAngle=x.result==='W'?-30:x.result==='D'?0:60;
        return (
          <svg key={i} width={22} height={22}>
            <circle cx={11} cy={11} r={9} fill={c.bg} stroke={c.bd} strokeWidth={1}/>
            {[0,3,6,9].map(h=>{
              const a=h/12*Math.PI*2-Math.PI/2;
              return <circle key={h} cx={11+7.5*Math.cos(a)} cy={11+7.5*Math.sin(a)} r={0.8} fill={c.tx} opacity={0.4}/>;
            })}
            <line x1={11} y1={11} x2={11+5*Math.cos((minAngle-90)*Math.PI/180)} y2={11+5*Math.sin((minAngle-90)*Math.PI/180)} stroke={c.tx} strokeWidth={1.5} strokeLinecap="round"/>
            <line x1={11} y1={11} x2={11+3*Math.cos((hrAngle-90)*Math.PI/180)} y2={11+3*Math.sin((hrAngle-90)*Math.PI/180)} stroke={c.tx} strokeWidth={2} strokeLinecap="round"/>
            <circle cx={11} cy={11} r={1.5} fill={c.so}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 48 */ {
  title: 'מורס קוד',
  render: (f) => {
    const MORSE = { W:'·--', D:'-·-', L:'·-··' };
    return (
      <div className="flex gap-2 items-center">
        {f.map((x,i) => {
          const c=C[x.result];
          return (
            <div key={i} className="flex gap-0.5 items-center">
              {MORSE[x.result].split('').map((ch,ci) => (
                <div key={ci} style={{ height:4,width:ch==='·'?4:10,background:c.so,borderRadius:2,boxShadow:`0 0 4px ${c.tx}60` }}/>
              ))}
            </div>
          );
        })}
      </div>
    );
  },
},

/* 49 */ {
  title: 'הצבעה / Vote',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => {
        const c=C[x.result];
        const pct=x.result==='W'?85:x.result==='D'?50:15;
        return (
          <div key={i} style={{ width:22,display:'flex',flexDirection:'column',alignItems:'center',gap:2 }}>
            <span style={{ fontSize:8,fontWeight:900,color:c.tx }}>{pct}%</span>
            <div style={{ width:10,height:24,background:'rgba(255,255,255,0.05)',borderRadius:2,overflow:'hidden',border:`1px solid ${c.bd}50` }}>
              <div style={{ position:'relative',bottom:0,marginTop:`${100-pct}%`,height:`${pct}%`,background:`linear-gradient(to top,${c.dk},${c.so})`,borderRadius:2 }}/>
            </div>
            <span style={{ fontSize:7,color:c.bd }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 50 */ {
  title: 'כרטיס פלזמה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:28,height:36,borderRadius:4,border:`1px solid ${c.bd}`,background:`radial-gradient(ellipse at 30% 20%,${c.so}30,transparent 60%),radial-gradient(ellipse at 70% 80%,${c.dk}40,transparent 60%),rgba(0,0,0,0.3)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,boxShadow:`inset 0 0 12px ${c.tx}20` }}>
            <span style={{ fontSize:11,fontWeight:900,color:c.tx,textShadow:`0 0 8px ${c.tx}` }}>{x.result}</span>
            <span style={{ fontSize:9,fontWeight:700,color:'rgba(255,255,255,0.7)' }}>{x.scored}:{x.conceded}</span>
          </div>
        );
      })}
    </div>
  ),
},

];

function DemoCard({ variant, idx, selected, onSelect }) {
  return (
    <div onClick={() => onSelect(idx)} style={{ background: selected ? 'rgba(250,204,21,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selected ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '12px', cursor: 'pointer', transition: 'all 0.15s ease' }}>
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

export default function AdminFormDemo3() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו 3 — 5 משחקים אחרונים</h2>
        <p className="text-slate-500 text-sm">50 עיצובים נוספים · לחץ לתצוגה מוגדלת</p>
      </div>
      {selected !== null && (
        <div style={{ background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#facc15', fontWeight: 700, marginBottom: 16 }}>#{selected + 1} {VARIANTS[selected].title}</p>
          <div style={{ display: 'flex', justifyContent: 'center', transform: 'scale(2)', transformOrigin: 'center', marginBottom: 16 }}>
            {VARIANTS[selected].render(FORM)}
          </div>
          <button onClick={() => setSelected(null)} style={{ marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>סגור</button>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {VARIANTS.map((v, i) => <DemoCard key={i} variant={v} idx={i} selected={selected === i} onSelect={setSelected} />)}
      </div>
    </div>
  );
}
