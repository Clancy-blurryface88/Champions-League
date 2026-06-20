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
  title: 'קסטה — חלון קלטת',
  render: (f) => (
    <div style={{ background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,padding:'4px 6px',display:'flex',gap:3,alignItems:'center' }}>
      <div style={{ width:6,height:22,borderRadius:2,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:1 }}>
        <div style={{ flex:1,background:'linear-gradient(to top,rgba(255,255,255,0.2),transparent)' }}/>
      </div>
      {f.map((x,i) => {
        const c=C[x.result];
        return <div key={i} style={{ width:10,height:10,borderRadius:'50%',background:'rgba(0,0,0,0.6)',border:`1.5px solid ${c.tx}`,boxShadow:`0 0 4px ${c.tx}` }}/>;
      })}
      <div style={{ width:6,height:22,borderRadius:2,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)' }}/>
    </div>
  ),
},

/* 2 */ {
  title: 'מחשבון LCD',
  render: (f) => {
    const pts=f.filter(x=>x.result==='W').length*3+f.filter(x=>x.result==='D').length;
    return (
      <div style={{ background:'#1a2a1a',border:'1px solid #2a4a2a',borderRadius:3,padding:'3px 8px',fontFamily:'monospace' }}>
        <div style={{ fontSize:6,color:'rgba(100,200,100,0.4)',marginBottom:1 }}>PTS</div>
        <div style={{ fontSize:18,fontWeight:900,color:'#4ade80',letterSpacing:2,lineHeight:1,textShadow:'0 0 8px rgba(74,222,128,0.6)' }}>{String(pts).padStart(2,'0')}</div>
        <div style={{ display:'flex',gap:2,marginTop:2 }}>
          {f.map((x,i)=><div key={i} style={{ width:4,height:4,borderRadius:1,background:C[x.result].so,opacity:0.8 }}/>)}
        </div>
      </div>
    );
  },
},

/* 3 */ {
  title: 'שרשרת ברק',
  render: (f) => (
    <div className="flex items-center gap-0">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <React.Fragment key={i}>
            <div style={{ fontSize:16,color:c.tx,lineHeight:1,filter:`drop-shadow(0 0 4px ${c.tx})`,opacity:x.result==='L'?0.3:1 }}>⚡</div>
            {i<f.length-1 && <div style={{ width:4,height:1,background:`linear-gradient(90deg,${C[x.result].tx},${C[f[i+1].result].tx})`,opacity:0.3 }}/>}
          </React.Fragment>
        );
      })}
    </div>
  ),
},

/* 4 */ {
  title: 'שעון חול',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const fill=x.result==='W'?100:x.result==='D'?50:10;
        return (
          <svg key={i} width={16} height={26}>
            <path d="M 1 1 L 15 1 L 9 12 L 15 25 L 1 25 L 7 12 Z" fill="none" stroke={c.bd} strokeWidth={1}/>
            <clipPath id={`hg${i}`}><path d="M 1 1 L 15 1 L 9 12 Z"/></clipPath>
            <rect x={1} y={1} width={14} height={11} fill={c.bg} clipPath={`url(#hg${i})`}/>
            <rect x={`${8-fill*0.07}`} y={`${1+11*(1-fill/100)}`} width={`${fill*0.14}`} height={`${11*fill/100}`} fill={c.so} opacity={0.7} clipPath={`url(#hg${i})`}/>
            <path d="M 7 13 L 9 13 L 15 25 L 1 25 Z" fill={c.bg} opacity={0.3}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 5 */ {
  title: 'אטום / אורביטה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const orbits=x.result==='W'?3:x.result==='D'?2:1;
        return (
          <svg key={i} width={24} height={24}>
            {Array.from({length:orbits}).map((_,oi) => (
              <ellipse key={oi} cx={12} cy={12} rx={10-oi*1} ry={4-oi*0.5} fill="none" stroke={c.bd} strokeWidth={0.8} transform={`rotate(${oi*60} 12 12)`}/>
            ))}
            <circle cx={12} cy={12} r={3} fill={c.so}/>
            {Array.from({length:orbits}).map((_,oi) => (
              <circle key={oi} cx={12+(10-oi)*Math.cos(oi*2.1)} cy={12+(4-oi*0.5)*Math.sin(oi*2.1)} r={1.5} fill={c.tx} opacity={0.8}/>
            ))}
          </svg>
        );
      })}
    </div>
  ),
},

/* 6 */ {
  title: 'עכביש — רשת',
  render: (f) => {
    const pts=f.map((x,i)=>{const a=i/f.length*Math.PI*2-Math.PI/2;const r=x.result==='W'?10:x.result==='D'?6:2;return[12+r*Math.cos(a),12+r*Math.sin(a)];});
    return (
      <svg width={24} height={24}>
        {[2,5,8,11].map(r=><polygon key={r} points={f.map((_,i)=>{const a=i/f.length*Math.PI*2-Math.PI/2;return`${12+r*Math.cos(a)},${12+r*Math.sin(a)}`;}).join(' ')} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5}/>)}
        {f.map((_,i)=>{const a=i/f.length*Math.PI*2-Math.PI/2;return<line key={i} x1={12} y1={12} x2={12+11*Math.cos(a)} y2={12+11*Math.sin(a)} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5}/>;} )}
        <polygon points={pts.map(p=>p.join(',')).join(' ')} fill="rgba(74,222,128,0.2)" stroke="#4ade80" strokeWidth={1.5}/>
        {pts.map(([px,py],i)=><circle key={i} cx={px} cy={py} r={2} fill={C[f[i].result].tx}/>)}
      </svg>
    );
  },
},

/* 7 */ {
  title: 'כוסית מבחנה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const fill=x.result==='W'?80:x.result==='D'?45:15;
        return (
          <svg key={i} width={14} height={28}>
            <path d="M 3 1 L 11 1 L 11 18 Q 11 26 7 26 Q 3 26 3 18 Z" fill="rgba(0,0,0,0.3)" stroke={c.bd} strokeWidth={1}/>
            <clipPath id={`tt${i}`}><path d="M 3 1 L 11 1 L 11 18 Q 11 26 7 26 Q 3 26 3 18 Z"/></clipPath>
            <rect x={3} y={1+(25*(1-fill/100))} width={8} height={25*fill/100} fill={c.so} opacity={0.7} clipPath={`url(#tt${i})`}/>
            <line x1={2} y1={5} x2={4} y2={5} stroke={c.bd} strokeWidth={0.5}/>
            <line x1={2} y1={10} x2={4} y2={10} stroke={c.bd} strokeWidth={0.5}/>
            <line x1={2} y1={15} x2={4} y2={15} stroke={c.bd} strokeWidth={0.5}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 8 */ {
  title: 'כוח / Power',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const on=x.result!=='L';
        return (
          <svg key={i} width={22} height={22}>
            <circle cx={11} cy={11} r={8} fill={c.bg} stroke={on?c.tx:'rgba(255,255,255,0.08)'} strokeWidth={2} strokeDasharray={on?'none':'40 10'}/>
            <line x1={11} y1={3} x2={11} y2={11} stroke={on?c.tx:'rgba(255,255,255,0.15)'} strokeWidth={2.5} strokeLinecap="round"/>
            {on && <circle cx={11} cy={11} r={3} fill={c.so} opacity={0.8}/>}
          </svg>
        );
      })}
    </div>
  ),
},

/* 9 */ {
  title: 'גלגל שיניים',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const teeth=x.result==='W'?8:x.result==='D'?6:4;
        const pts=Array.from({length:teeth*2}).map((_,pi)=>{
          const a=pi/teeth/2*Math.PI*2;
          const r=pi%2===0?10:7;
          return`${11+r*Math.cos(a)},${11+r*Math.sin(a)}`;
        }).join(' ');
        return (
          <svg key={i} width={22} height={22}>
            <polygon points={pts} fill={c.bg} stroke={c.tx} strokeWidth={1}/>
            <circle cx={11} cy={11} r={3} fill="rgba(0,0,0,0.4)" stroke={c.bd} strokeWidth={1}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 10 */ {
  title: 'מנעול',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const open=x.result==='L';
        return (
          <svg key={i} width={16} height={22}>
            <rect x={1} y={10} width={14} height={11} rx={2} fill={c.bg} stroke={c.tx} strokeWidth={1.2}/>
            <path d={open?`M 3 10 Q 3 2 8 2 Q 13 2 13 6`:`M 3 10 Q 3 2 8 2 Q 13 2 13 10`} fill="none" stroke={c.tx} strokeWidth={2} strokeLinecap="round"/>
            <circle cx={8} cy={15} r={2} fill={c.so}/>
            <line x1={8} y1={17} x2={8} y2={19} stroke={c.tx} strokeWidth={1.5} strokeLinecap="round"/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 11 */ {
  title: 'קשת בענן',
  render: (f) => (
    <div style={{ position:'relative',width:120,height:32 }}>
      {['#ef4444','#f97316','#facc15','#4ade80','#60a5fa','#a78bfa'].map((col,ci)=>(
        <svg key={ci} width={120} height={32} style={{ position:'absolute',top:0,left:0 }}>
          <path d={`M ${10+ci*2} ${30} A ${50-ci*2} ${40-ci*2} 0 0 1 ${110-ci*2} ${30}`} fill="none" stroke={col} strokeWidth={1.5} opacity={0.6}/>
        </svg>
      ))}
      {f.map((x,i)=>{
        const c=C[x.result];
        const angle=-0.2+i*0.4;
        const px=60+44*Math.cos(Math.PI-angle);
        const py=30-28*Math.sin(Math.PI-angle);
        return <div key={i} style={{ position:'absolute',left:px-4,top:py-4,width:8,height:8,borderRadius:'50%',background:c.so,boxShadow:`0 0 6px ${c.tx}` }}/>;
      })}
    </div>
  ),
},

/* 12 */ {
  title: 'ורד / פרח',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const petals=x.result==='W'?6:x.result==='D'?4:3;
        return (
          <svg key={i} width={22} height={22}>
            {Array.from({length:petals}).map((_,pi)=>{
              const a=pi/petals*Math.PI*2;
              return <ellipse key={pi} cx={11+5*Math.cos(a)} cy={11+5*Math.sin(a)} rx={4} ry={2.5} fill={c.bg} stroke={c.tx} strokeWidth={0.8} transform={`rotate(${a*180/Math.PI} ${11+5*Math.cos(a)} ${11+5*Math.sin(a)})`}/>;
            })}
            <circle cx={11} cy={11} r={3} fill={c.so}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 13 */ {
  title: 'מעגל TRC',
  render: (f) => (
    <div style={{ background:'rgba(0,20,0,0.5)',border:'1px solid rgba(0,200,0,0.15)',borderRadius:3,padding:'4px 5px',display:'flex',gap:5 }}>
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ position:'relative',width:14,height:22 }}>
            <div style={{ position:'absolute',top:0,left:7,width:1,height:22,background:'rgba(0,180,0,0.15)' }}/>
            {[4,10,16].map((y,yi)=>(
              <div key={yi} style={{ position:'absolute',top:y,left:4,width:7,height:3,borderRadius:'50%',background:yi===1?c.so:'rgba(0,180,0,0.1)',boxShadow:yi===1?`0 0 4px ${c.tx}`:'none' }}/>
            ))}
          </div>
        );
      })}
    </div>
  ),
},

/* 14 */ {
  title: 'אוהל / מאהל',
  render: (f) => (
    <div className="flex gap-1.5 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        const h=x.result==='W'?28:x.result==='D'?20:14;
        return (
          <svg key={i} width={22} height={h}>
            <polygon points={`11,0 22,${h} 0,${h}`} fill={c.bg} stroke={c.tx} strokeWidth={1}/>
            <polygon points={`9,${h*0.5} 13,${h*0.5} 11,${h}`} fill={c.so} opacity={0.6}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 15 */ {
  title: 'חץ מתקדם',
  render: (f) => (
    <div className="flex gap-0">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ position:'relative',width:26,height:24,background:c.bg,border:`1px solid ${c.bd}`,clipPath:i<f.length-1?'polygon(0 0,88% 0,100% 50%,88% 100%,0 100%,12% 50%)':'polygon(0 0,100% 0,100% 100%,0 100%,12% 50%)',display:'flex',alignItems:'center',justifyContent:'center',marginLeft:i>0?-8:0 }}>
            <span style={{ fontSize:8,fontWeight:900,color:c.tx }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 16 */ {
  title: 'מנהרה / פרספקטיבה',
  render: (f) => (
    <svg width={120} height={40}>
      {f.map((x,i)=>{
        const c=C[x.result];
        const cx=10+i*24,cy=20;
        const r=18-i*2.5;
        return <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={c.bg} stroke={c.tx} strokeWidth={1} opacity={0.5+i*0.1}/>
          <text x={cx} y={cy+4} textAnchor="middle" fontSize={8} fontWeight={900} fill={c.tx}>{x.result}</text>
        </g>;
      })}
    </svg>
  ),
},

/* 17 */ {
  title: 'פאזמה / פריים',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => {
        const c=C[x.result];
        const seg=x.result==='W'?4:x.result==='D'?2:1;
        return (
          <div key={i} style={{ width:20,height:20,position:'relative' }}>
            {[0,1,2,3].map(s=>(
              <div key={s} style={{ position:'absolute',background:s<seg?c.so:'rgba(255,255,255,0.05)',
                ...(s===0?{top:0,left:0,right:0,height:2}:
                   s===1?{top:0,right:0,bottom:0,width:2}:
                   s===2?{bottom:0,left:0,right:0,height:2}:
                        {top:0,left:0,bottom:0,width:2})
              }}/>
            ))}
            <div style={{ position:'absolute',inset:3,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:c.tx }}>{x.result}</div>
          </div>
        );
      })}
    </div>
  ),
},

/* 18 */ {
  title: 'גל ים',
  render: (f) => {
    const ys=f.map(x=>x.result==='W'?6:x.result==='D'?16:26);
    const d=`M 5,${ys[0]} C 20,${ys[0]-8} 20,${ys[1]+8} 35,${ys[1]} C 50,${ys[1]-8} 50,${ys[2]+8} 65,${ys[2]} C 80,${ys[2]-8} 80,${ys[3]+8} 95,${ys[3]} C 108,${ys[3]-8} 108,${ys[4]+8} 115,${ys[4]}`;
    return (
      <svg width={120} height={36}>
        <defs><linearGradient id="wave4" x1="0" y1="0" x2="1" y2="0">{f.map((x,i)=><stop key={i} offset={`${i*25}%`} stopColor={C[x.result].tx}/>)}</linearGradient></defs>
        <path d={d} fill="none" stroke="url(#wave4)" strokeWidth={2.5} strokeLinecap="round"/>
        {ys.map((y,i)=><circle key={i} cx={5+i*27.5} cy={y} r={3.5} fill={C[f[i].result].so}/>)}
      </svg>
    );
  },
},

/* 19 */ {
  title: 'ספינה/סירה',
  render: (f) => (
    <div className="flex gap-1.5 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        const mast=x.result==='W'?20:x.result==='D'?14:8;
        return (
          <svg key={i} width={20} height={28}>
            <path d="M 2 22 Q 10 28 18 22 L 16 18 L 4 18 Z" fill={c.so} opacity={0.7}/>
            <line x1={10} y1={18} x2={10} y2={28-mast} stroke={c.tx} strokeWidth={1.5}/>
            {x.result!=='L' && <polygon points={`10,${28-mast} 16,${28-mast+6} 10,${28-mast+8}`} fill={c.bg} stroke={c.bd} strokeWidth={0.8}/>}
          </svg>
        );
      })}
    </div>
  ),
},

/* 20 */ {
  title: 'ריצוף / Tiles',
  render: (f) => (
    <div style={{ display:'grid',gridTemplateColumns:'repeat(5,22px)',gap:2 }}>
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:22,height:22,background:c.bg,border:`1px solid ${c.bd}`,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',inset:0,backgroundImage:`repeating-linear-gradient(45deg,${c.so}15 0px,${c.so}15 1px,transparent 1px,transparent 6px)` }}/>
            <span style={{ position:'relative',fontSize:9,fontWeight:900,color:c.tx }}>{x.result}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 21 */ {
  title: 'שלג / פתית',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const arms=x.result==='W'?6:x.result==='D'?4:2;
        return (
          <svg key={i} width={22} height={22}>
            {Array.from({length:arms}).map((_,ai)=>{
              const a=ai/arms*Math.PI*2;
              return <g key={ai}>
                <line x1={11} y1={11} x2={11+9*Math.cos(a)} y2={11+9*Math.sin(a)} stroke={c.tx} strokeWidth={1.5} strokeLinecap="round" opacity={0.8}/>
                <line x1={11+5*Math.cos(a)} y1={11+5*Math.sin(a)} x2={11+5*Math.cos(a)+3*Math.cos(a+Math.PI/3)} y2={11+5*Math.sin(a)+3*Math.sin(a+Math.PI/3)} stroke={c.bd} strokeWidth={1}/>
              </g>;
            })}
            <circle cx={11} cy={11} r={2} fill={c.so}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 22 */ {
  title: 'מגדל שידור',
  render: (f) => (
    <div className="flex gap-2 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        const waves=x.result==='W'?3:x.result==='D'?2:0;
        return (
          <svg key={i} width={22} height={26}>
            <line x1={11} y1={26} x2={8} y2={14} stroke={c.bd} strokeWidth={1.2}/>
            <line x1={11} y1={26} x2={14} y2={14} stroke={c.bd} strokeWidth={1.2}/>
            <line x1={11} y1={14} x2={11} y2={4} stroke={c.tx} strokeWidth={1.5} strokeLinecap="round"/>
            <circle cx={11} cy={4} r={2} fill={x.result==='L'?'transparent':c.so} stroke={c.tx} strokeWidth={1}/>
            {Array.from({length:waves}).map((_,wi)=>(
              <path key={wi} d={`M ${11-4-wi*3} ${8+wi*2} A ${4+wi*3} ${3+wi*2} 0 0 1 ${11+4+wi*3} ${8+wi*2}`} fill="none" stroke={c.tx} strokeWidth={0.8} opacity={0.6-wi*0.1}/>
            ))}
          </svg>
        );
      })}
    </div>
  ),
},

/* 23 */ {
  title: 'קרח / קריסטל',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const pts=x.result==='W'?'11,1 20,8 17,20 5,20 2,8':x.result==='D'?'11,3 19,9 16,19 6,19 3,9':'11,5 18,10 15,19 7,19 4,10';
        return (
          <svg key={i} width={22} height={22}>
            <polygon points={pts} fill={c.bg} stroke={c.tx} strokeWidth={1}/>
            <polygon points={pts} fill="rgba(255,255,255,0.08)" style={{ clipPath:'polygon(0 0,50% 0,50% 100%,0 100%)' }}/>
            <text x={11} y={14} textAnchor="middle" fontSize={8} fontWeight={900} fill={c.tx}>{x.result}</text>
          </svg>
        );
      })}
    </div>
  ),
},

/* 24 */ {
  title: 'חיצים מדורגים',
  render: (f) => (
    <div className="flex gap-1.5 items-center">
      {f.map((x,i) => {
        const c=C[x.result];
        const n=x.result==='W'?3:x.result==='D'?2:1;
        return (
          <div key={i} className="flex gap-px items-center">
            {Array.from({length:n}).map((_,ai) => (
              <svg key={ai} width={8} height={14}>
                <polygon points="4,0 8,7 5,7 5,14 3,14 3,7 0,7" fill={c.so} opacity={1-ai*0.25}/>
              </svg>
            ))}
          </div>
        );
      })}
    </div>
  ),
},

/* 25 */ {
  title: 'קוביה פתוחה / Wireframe',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <svg key={i} width={22} height={22}>
            <rect x={1} y={5} width={14} height={14} fill="none" stroke={c.bd} strokeWidth={1}/>
            <rect x={7} y={1} width={14} height={14} fill="none" stroke={c.bd} strokeWidth={1}/>
            <line x1={1} y1={5} x2={7} y2={1} stroke={c.bd} strokeWidth={1}/>
            <line x1={15} y1={5} x2={21} y2={1} stroke={c.bd} strokeWidth={1}/>
            <line x1={15} y1={19} x2={21} y2={15} stroke={c.bd} strokeWidth={1}/>
            <line x1={1} y1={19} x2={7} y2={15} stroke={c.bd} strokeWidth={1}/>
            <text x={8} y={15} textAnchor="middle" fontSize={7} fontWeight={900} fill={c.tx}>{x.result}</text>
          </svg>
        );
      })}
    </div>
  ),
},

/* 26 */ {
  title: 'רוח / ספירלה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const turns=x.result==='W'?2.5:x.result==='D'?1.5:0.8;
        const pts=Array.from({length:Math.floor(turns*20)}).map((_,pi)=>{
          const t=pi/20;const a=t*Math.PI*2;const r=1+t*4;
          return`${11+r*Math.cos(a)},${11+r*Math.sin(a)}`;
        }).join(' ');
        return (
          <svg key={i} width={22} height={22}>
            <polyline points={pts} fill="none" stroke={c.tx} strokeWidth={1.5} strokeLinecap="round"/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 27 */ {
  title: 'כפפה / כוח איגרוף',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => { const e=x.result==='W'?'🥊':x.result==='D'?'🤜':'👊'; return <span key={i} style={{ fontSize:20,lineHeight:1,filter:`drop-shadow(0 2px 4px rgba(0,0,0,0.5))`,opacity:x.result==='L'?0.4:1 }}>{e}</span>; })}
    </div>
  ),
},

/* 28 */ {
  title: 'גרף נפילה / עלייה',
  render: (f) => {
    const ys=f.map(x=>x.result==='W'?5:x.result==='D'?15:25);
    return (
      <svg width={110} height={32}>
        {f.map((x,ii)=>{
          if(ii===0)return null;
          const x1=5+(ii-1)*24,y1=ys[ii-1],x2=5+ii*24,y2=ys[ii];
          return <line key={ii} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C[x.result].tx} strokeWidth={2} strokeLinecap="round" opacity={0.6}/>;
        })}
        {f.map((x,ii)=>(
          <g key={ii}>
            <circle cx={5+ii*24} cy={ys[ii]} r={4} fill={C[x.result].bg} stroke={C[x.result].tx} strokeWidth={1.5}/>
            <text x={5+ii*24} y={ys[ii]+3.5} textAnchor="middle" fontSize={6} fontWeight={900} fill={C[x.result].tx}>{x.result}</text>
          </g>
        ))}
      </svg>
    );
  },
},

/* 29 */ {
  title: 'כתר / מלוכה',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <svg key={i} width={22} height={18}>
            <path d="M 1 16 L 3 6 L 8 12 L 11 2 L 14 12 L 19 6 L 21 16 Z" fill={x.result==='L'?'transparent':c.bg} stroke={c.tx} strokeWidth={1.2} strokeLinejoin="round"/>
            {x.result==='W' && [5,11,17].map(bx=><circle key={bx} cx={bx} cy={15} r={1.5} fill={c.so}/>)}
          </svg>
        );
      })}
    </div>
  ),
},

/* 30 */ {
  title: 'כדורגל — כדור',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <svg key={i} width={22} height={22}>
            <circle cx={11} cy={11} r={9} fill={c.bg} stroke={c.tx} strokeWidth={1}/>
            <polygon points="11,5 14,9 12,13 10,13 8,9" fill={c.so} opacity={0.5}/>
            {[[4,8],[18,8],[6,17],[16,17]].map(([px,py],pi)=>(
              <path key={pi} d={`M ${px} ${py} Q ${11} ${11} ${22-px} ${22-py}`} fill="none" stroke={c.bd} strokeWidth={0.5}/>
            ))}
          </svg>
        );
      })}
    </div>
  ),
},

/* 31 */ {
  title: 'ממשק טקסט ישן',
  render: (f) => (
    <div style={{ background:'#000',border:'1px solid #333',borderRadius:3,padding:'4px 6px',fontFamily:'monospace' }}>
      {f.map((x,i) => {
        const c=C[x.result];
        const sym=x.result==='W'?'[OK]':x.result==='D'?'[--]':'[XX]';
        return <div key={i} style={{ fontSize:9,color:c.tx,lineHeight:1.6 }}>{sym} {x.scored}-{x.conceded}</div>;
      })}
    </div>
  ),
},

/* 32 */ {
  title: 'פסי שיפוע',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:20,height:26,borderRadius:3,overflow:'hidden',position:'relative',border:`1px solid ${c.bd}` }}>
            {Array.from({length:5}).map((_,li)=>(
              <div key={li} style={{ height:'20%',background:`rgba(${x.result==='W'?'74,222,128':x.result==='D'?'250,204,21':'248,113,113'},${0.1+li*0.15})` }}/>
            ))}
            <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,color:c.tx }}>{x.result}</div>
          </div>
        );
      })}
    </div>
  ),
},

/* 33 */ {
  title: 'מיקרוצ\'יפ',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ position:'relative',width:22,height:22 }}>
            <div style={{ position:'absolute',inset:3,background:c.bg,border:`1px solid ${c.bd}`,borderRadius:2 }}/>
            {[0,1,2].map(p=>(
              <React.Fragment key={p}>
                <div style={{ position:'absolute',top:5+p*4,left:0,width:3,height:2,background:c.so,opacity:0.7 }}/>
                <div style={{ position:'absolute',top:5+p*4,right:0,width:3,height:2,background:c.so,opacity:0.7 }}/>
              </React.Fragment>
            ))}
            <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,fontWeight:900,color:c.tx }}>{x.result}</div>
          </div>
        );
      })}
    </div>
  ),
},

/* 34 */ {
  title: 'חץ 3 חלקים',
  render: (f) => (
    <div className="flex flex-col gap-0.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const w=x.result==='W'?90:x.result==='D'?60:30;
        return (
          <div key={i} style={{ display:'flex',alignItems:'center',gap:2 }}>
            <div style={{ width:w,height:8,background:c.bg,border:`1px solid ${c.bd}`,borderRadius:'2px 0 0 2px' }}/>
            <svg width={8} height={12}>
              <polygon points="0,0 8,6 0,12" fill={c.so}/>
            </svg>
          </div>
        );
      })}
    </div>
  ),
},

/* 35 */ {
  title: 'כוכב ים',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const arms=x.result==='W'?5:x.result==='D'?4:3;
        const pts=Array.from({length:arms*2}).map((_,pi)=>{
          const a=pi/arms/2*Math.PI*2-Math.PI/2;
          const r=pi%2===0?9:4;
          return`${11+r*Math.cos(a)},${11+r*Math.sin(a)}`;
        }).join(' ');
        return (
          <svg key={i} width={22} height={22}>
            <polygon points={pts} fill={c.bg} stroke={c.tx} strokeWidth={1} opacity={0.9}/>
            <circle cx={11} cy={11} r={2.5} fill={c.so}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 36 */ {
  title: 'טיפסט / קונפטי',
  render: (f) => {
    const shapes=[{x:10,y:4,r:0},{x:25,y:8,r:45},{x:45,y:3,r:20},{x:60,y:9,r:-30},{x:78,y:5,r:60},{x:90,y:8,r:15},{x:105,y:4,r:-45}];
    return (
      <svg width={120} height={22}>
        {f.map((x,i)=>{
          const c=C[x.result];
          return [0,1].map(si=>{
            const s=shapes[i*1.2+si|0]||{x:i*20,y:8,r:0};
            return <rect key={`${i}-${si}`} x={s.x} y={s.y} width={7} height={5} fill={c.so} opacity={0.7+si*0.1} rx={1} transform={`rotate(${s.r} ${s.x+3} ${s.y+2})`}/>;
          });
        })}
      </svg>
    );
  },
},

/* 37 */ {
  title: 'אמוג\'י ספורט',
  render: (f) => (
    <div className="flex gap-1">
      {f.map((x,i) => { const e=x.result==='W'?'🏆':x.result==='D'?'🤝':'😤'; return <span key={i} style={{ fontSize:20,lineHeight:1 }}>{e}</span>; })}
    </div>
  ),
},

/* 38 */ {
  title: 'גרדיאנט מרובע',
  render: (f) => (
    <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',width:110,height:22 }}>
      {f.map((x,i) => {
        const c=C[x.result];
        const next=f[i+1]?C[f[i+1].result].so:c.so;
        return <div key={i} style={{ background:`linear-gradient(90deg,${c.so},${next})`,height:'100%',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <span style={{ fontSize:8,fontWeight:900,color:'rgba(0,0,0,0.6)' }}>{x.result}</span>
        </div>;
      })}
    </div>
  ),
},

/* 39 */ {
  title: 'חלון GUI ישן',
  render: (f) => (
    <div style={{ border:'1px solid rgba(255,255,255,0.15)',borderRadius:3,overflow:'hidden',background:'rgba(0,0,0,0.3)',minWidth:100 }}>
      <div style={{ background:'rgba(255,255,255,0.06)',padding:'2px 5px',display:'flex',gap:3,alignItems:'center',borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        {['#ef4444','#facc15','#22c55e'].map((col,ci)=><div key={ci} style={{ width:5,height:5,borderRadius:'50%',background:col,opacity:0.7 }}/>)}
        <span style={{ fontSize:7,color:'rgba(255,255,255,0.3)',marginLeft:2 }}>Stats</span>
      </div>
      <div style={{ padding:'3px 5px',display:'flex',gap:4 }}>
        {f.map((x,i)=>{
          const c=C[x.result];
          return <div key={i} style={{ fontSize:9,fontWeight:900,color:c.tx }}>{x.result}</div>;
        })}
      </div>
    </div>
  ),
},

/* 40 */ {
  title: 'מסך טלוויזיה ישן',
  render: (f) => (
    <div style={{ background:'#111',border:'2px solid #333',borderRadius:'6px 6px 4px 4px',padding:'4px 6px',boxShadow:'inset 0 0 10px rgba(0,0,0,0.8)' }}>
      <div style={{ display:'flex',gap:3,background:'rgba(0,0,0,0.5)',padding:'2px 3px',borderRadius:2 }}>
        {f.map((x,i)=>{
          const c=C[x.result];
          return <span key={i} style={{ fontSize:11,fontWeight:900,color:c.tx,textShadow:`0 0 4px ${c.tx}`,fontFamily:'monospace' }}>{x.result}</span>;
        })}
      </div>
      <div style={{ display:'flex',justifyContent:'space-between',marginTop:2 }}>
        <div style={{ width:8,height:4,borderRadius:1,background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ width:4,height:4,borderRadius:'50%',background:'rgba(255,100,0,0.4)' }}/>
      </div>
    </div>
  ),
},

/* 41 */ {
  title: 'מד לחץ',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        const pct=x.result==='W'?90:x.result==='D'?50:10;
        return (
          <svg key={i} width={22} height={16}>
            <path d="M 2 14 A 9 9 0 0 1 20 14" fill={c.bg} stroke={c.bd} strokeWidth={1}/>
            <path d={`M 2 14 A 9 9 0 0 1 ${2+18*pct/100} ${14-Math.sin(Math.PI*pct/100)*9}`} fill="none" stroke={c.so} strokeWidth={3} strokeLinecap="round"/>
            <line x1={11} y1={14} x2={11+7*Math.cos(-Math.PI+Math.PI*pct/100)} y2={14+7*Math.sin(-Math.PI+Math.PI*pct/100)} stroke={c.tx} strokeWidth={1.5} strokeLinecap="round"/>
            <circle cx={11} cy={14} r={2} fill={c.so}/>
          </svg>
        );
      })}
    </div>
  ),
},

/* 42 */ {
  title: 'טיפה / ראנדיב',
  render: (f) => (
    <div className="flex gap-1.5 items-end">
      {f.map((x,i) => {
        const c=C[x.result];
        const s=x.result==='W'?28:x.result==='D'?20:12;
        return (
          <div key={i} style={{ width:s*0.7,height:s,borderRadius:`${s*0.4}px ${s*0.4}px ${s*0.4}px 0`,background:`radial-gradient(circle at 35% 30%,rgba(255,255,255,0.3),${c.so})`,transform:'rotate(-45deg)',boxShadow:`0 2px 6px ${c.dk}` }}/>
        );
      })}
    </div>
  ),
},

/* 43 */ {
  title: 'ריבוע מסתובב טקסט',
  render: (f) => {
    const [deg,setDeg]=React.useState(0);
    React.useEffect(()=>{const t=setInterval(()=>setDeg(d=>d+1),30);return()=>clearInterval(t);},[]);
    return (
      <div className="flex gap-2">
        {f.map((x,i)=>{
          const c=C[x.result];
          return <div key={i} style={{ width:22,height:22,border:`1.5px solid ${c.bd}`,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',transform:`rotate(${deg+(i*72)}deg)`,transition:'none' }}>
            <span style={{ fontSize:9,fontWeight:900,color:c.tx,transform:`rotate(-${deg+(i*72)}deg)` }}>{x.result}</span>
          </div>;
        })}
      </div>
    );
  },
},

/* 44 */ {
  title: 'ניאון מלבן זוהר',
  render: (f) => (
    <div className="flex gap-1.5">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ width:22,height:22,borderRadius:4,border:`1.5px solid ${c.tx}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 6px ${c.tx}, 0 0 12px ${c.tx}40, inset 0 0 6px ${c.tx}20`,fontSize:9,fontWeight:900,color:c.tx,textShadow:`0 0 6px ${c.tx}` }}>{x.result}</div>
        );
      })}
    </div>
  ),
},

/* 45 */ {
  title: 'כרטיס מינימל שורה',
  render: (f) => (
    <div className="flex flex-col gap-1">
      {f.map((x,i) => {
        const c=C[x.result];
        return (
          <div key={i} style={{ display:'flex',alignItems:'center',gap:5 }}>
            <div style={{ width:3,height:14,borderRadius:2,background:c.so }} />
            <span style={{ fontSize:9,fontWeight:700,color:c.tx,width:10 }}>{x.result}</span>
            <span style={{ fontSize:8,color:'rgba(255,255,255,0.3)' }}>vs {x.opponent}</span>
            <span style={{ fontSize:9,fontWeight:900,color:'rgba(255,255,255,0.6)',marginLeft:'auto' }}>{x.scored}:{x.conceded}</span>
          </div>
        );
      })}
    </div>
  ),
},

/* 46 */ {
  title: 'גרף עמודות + קו',
  render: (f) => {
    const ys=f.map(x=>x.result==='W'?5:x.result==='D'?15:25);
    return (
      <svg width={110} height={34}>
        {f.map((x,ii)=>{
          const c=C[x.result];
          const bh=x.result==='W'?28:x.result==='D'?18:8;
          return <rect key={ii} x={4+ii*22} y={34-bh} width={16} height={bh} fill={c.bg} stroke={c.bd} strokeWidth={1} rx={2}/>;
        })}
        <polyline points={f.map((x,ii)=>`${12+ii*22},${ys[ii]}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
        {f.map((x,ii)=><circle key={ii} cx={12+ii*22} cy={ys[ii]} r={2.5} fill={C[x.result].tx}/>)}
      </svg>
    );
  },
},

/* 47 */ {
  title: 'ענבל זמן ריאל',
  render: (f) => {
    const [t,setT]=React.useState(0);
    React.useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),600);return()=>clearInterval(id);},[]);
    const active=t%f.length;
    return (
      <div className="flex gap-1.5 items-center">
        {f.map((x,i)=>{
          const c=C[x.result];
          const isActive=i===active;
          return <div key={i} style={{ width:isActive?26:20,height:isActive?26:20,borderRadius:4,background:c.bg,border:`${isActive?2:1}px solid ${c.tx}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isActive?11:8,fontWeight:900,color:c.tx,boxShadow:isActive?`0 0 10px ${c.tx}`:'none',transition:'all 0.3s ease' }}>{x.result}</div>;
        })}
      </div>
    );
  },
},

/* 48 */ {
  title: 'חיצי מצפן 4',
  render: (f) => {
    const dirs=['N','NE','E','SE','S'];
    return (
      <div className="flex gap-1.5">
        {f.map((x,i)=>{
          const c=C[x.result];
          return (
            <div key={i} style={{ width:22,height:22,position:'relative' }}>
              <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
                <div style={{ width:1,height:18,background:`linear-gradient(to bottom,${C.W.tx},${C.L.tx})`,opacity:0.15 }}/>
              </div>
              <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
                <div style={{ width:18,height:1,background:`linear-gradient(to right,${C.W.tx},${C.L.tx})`,opacity:0.15 }}/>
              </div>
              <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:c.tx }}>{dirs[i]}</div>
              <div style={{ position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:0,height:0,borderLeft:'4px solid transparent',borderRight:'4px solid transparent',borderBottom:`6px solid ${c.so}`,opacity:x.result==='W'?1:0.2 }}/>
            </div>
          );
        })}
      </div>
    );
  },
},

/* 49 */ {
  title: 'לייזר / קרן',
  render: (f) => (
    <svg width={120} height={30}>
      {f.map((x,i)=>{
        const c=C[x.result];
        const y=x.result==='W'?5:x.result==='D'?15:25;
        return (
          <g key={i}>
            <line x1={0} y1={y} x2={10+i*22} y2={y} stroke={c.tx} strokeWidth={1} opacity={0.2}/>
            <circle cx={10+i*22} cy={y} r={4} fill={c.so} opacity={0.9}/>
            <circle cx={10+i*22} cy={y} r={7} fill="none" stroke={c.tx} strokeWidth={0.5} opacity={0.3}/>
          </g>
        );
      })}
    </svg>
  ),
},

/* 50 */ {
  title: 'כרטיס טרמינל',
  render: (f) => (
    <div style={{ background:'#0d1117',border:'1px solid #30363d',borderRadius:6,padding:'6px 8px',fontFamily:'monospace',minWidth:120 }}>
      <div style={{ display:'flex',gap:4,marginBottom:4 }}>
        {['#ff5f57','#ffbd2e','#28c840'].map((col,ci)=><div key={ci} style={{ width:6,height:6,borderRadius:'50%',background:col }}/>)}
      </div>
      <div style={{ fontSize:9,color:'rgba(255,255,255,0.25)',marginBottom:2 }}>$ form --last 5</div>
      <div style={{ display:'flex',gap:3 }}>
        {f.map((x,i)=>{
          const c=C[x.result];
          return <span key={i} style={{ fontSize:10,fontWeight:900,color:c.tx,background:c.bg,padding:'0 3px',borderRadius:2 }}>{x.result}</span>;
        })}
      </div>
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

export default function AdminFormDemo4() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו 4 — 5 משחקים אחרונים</h2>
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
