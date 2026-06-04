import React, { useState } from 'react';

const DATA = [
  { label: 'פגיעה מדויקת',     pts: 61.75, pct: 37.3, color: '#4ade80', dark: '#166534' },
  { label: 'כיוון נכון',        pts: 44.10, pct: 26.6, color: '#38bdf8', dark: '#075985' },
  { label: "שתי קב' כובשות",   pts: 34.25, pct: 20.7, color: '#fbbf24', dark: '#78350f' },
  { label: 'טווח שערים',        pts: 25.45, pct: 15.4, color: '#f87171', dark: '#7f1d1d' },
];
const TOTAL = DATA.reduce((s, d) => s + d.pts, 0);

// ── SVG helpers ───────────────────────────────────────────────────────────────
function DonutSVG({ size = 110, thickness = 22, gap = 2 }) {
  const r = size / 2 - thickness / 2 - 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {DATA.map((d, i) => {
        const len = (d.pct / 100) * circ - gap;
        const dash = `${len} ${circ - len}`;
        const rotation = (offset / 100) * 360 - 90;
        offset += d.pct;
        return <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={d.color} strokeWidth={thickness} strokeDasharray={dash} strokeDashoffset={0} transform={`rotate(${rotation} ${size/2} ${size/2})`} strokeLinecap="butt" />;
      })}
    </svg>
  );
}

function PieSVG({ size = 110 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  let angle = -90;
  const slices = DATA.map(d => {
    const start = angle;
    const sweep = (d.pct / 100) * 360;
    angle += sweep;
    const s = (start * Math.PI) / 180, e = ((start + sweep) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = sweep > 180 ? 1 : 0;
    return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: d.color };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} opacity={0.9} />)}
    </svg>
  );
}

function RadialBar({ d, i, total }) {
  const r = 18 + i * 14; const circ = 2 * Math.PI * r; const len = (d.pct / 100) * circ;
  return <circle cx="80" cy="80" r={r} fill="none" stroke={d.color} strokeWidth="10" strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" opacity={0.85} />;
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children, title }) {
  return (
    <div className="rounded-2xl p-4 space-y-3 h-full" style={{ background: 'rgba(8,12,25,0.97)', border: '1px solid rgba(255,255,255,0.08)' }} dir="rtl">
      <p className="text-[11px] font-semibold text-white/40 text-center tracking-wide">{title}</p>
      {children}
    </div>
  );
}

// ── 30 visualizations ─────────────────────────────────────────────────────────
const DESIGNS = [
  {
    id: 1, name: 'Donut + Rows (נוכחי)',
    render: () => (
      <Card title="פילוח הניקוד לפי קטגוריות">
        <div className="flex justify-center"><DonutSVG /></div>
        <div className="space-y-1.5">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded-lg" style={{background:'rgba(255,255,255,0.04)'}}>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:d.color}}/><span className="text-xs text-white/70">{d.label}</span></div>
            <div className="text-right"><p className="text-xs font-bold" style={{color:d.color}}>{d.pts} Pts</p><p className="text-[10px] text-white/30">{d.pct}%</p></div>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 2, name: 'Pie + List',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="flex justify-center"><PieSVG /></div>
        <div className="space-y-1">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{background:d.color}}/><span className="text-xs text-white/60">{d.label}</span></div>
            <span className="text-xs font-bold text-white">{d.pts}</span>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 3, name: 'Horizontal Bars',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-3">{DATA.map((d,i)=>(
          <div key={i}>
            <div className="flex justify-between text-xs mb-1"><span className="text-white/60">{d.label}</span><span className="font-bold" style={{color:d.color}}>{d.pts} pts</span></div>
            <div className="h-2.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full" style={{width:`${d.pct}%`,background:d.color}}/></div>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 4, name: 'Vertical Bars',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="flex items-end justify-center gap-3 h-28">{DATA.map((d,i)=>(
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-[9px] font-bold" style={{color:d.color}}>{d.pts}</span>
            <div className="w-full rounded-t-lg" style={{height:`${d.pct*2.2}px`,background:d.color,opacity:0.85}}/>
            <span className="text-[8px] text-white/40 text-center leading-tight">{d.label.split(' ')[0]}</span>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 5, name: 'Big Numbers',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="grid grid-cols-2 gap-2">{DATA.map((d,i)=>(
          <div key={i} className="rounded-xl p-3 text-center" style={{background:`${d.color}12`,border:`1px solid ${d.color}35`}}>
            <p className="text-xl font-black" style={{color:d.color}}>{d.pts}</p>
            <p className="text-[9px] text-white/50 mt-0.5">{d.label}</p>
            <p className="text-[10px] font-semibold text-white/30">{d.pct}%</p>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 6, name: 'Radial Bars',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="flex justify-center">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {DATA.map((d,i)=><RadialBar key={i} d={d} i={i} total={TOTAL}/>)}
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-1">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.color}}/><span className="text-[9px] text-white/50 truncate">{d.label}</span></div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 7, name: 'Stacked Bar',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="h-8 rounded-xl overflow-hidden flex">
          {DATA.map((d,i)=><div key={i} className="h-full flex items-center justify-center text-[9px] font-bold text-black" style={{width:`${d.pct}%`,background:d.color}}>{d.pct>10?`${d.pct}%`:''}</div>)}
        </div>
        <div className="space-y-1.5 mt-1">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{background:d.color}}/><span className="text-white/60">{d.label}</span></div>
            <span className="font-bold" style={{color:d.color}}>{d.pts} pts</span>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 8, name: 'Lollipop',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-3">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] text-white/50 w-20 text-right flex-shrink-0">{d.label}</span>
            <div className="flex-1 h-0.5 rounded-full relative" style={{background:'rgba(255,255,255,0.06)'}}>
              <div className="absolute top-0 left-0 h-full rounded-full" style={{width:`${d.pct}%`,background:d.color}}/>
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2" style={{left:`calc(${d.pct}% - 6px)`,background:d.dark,borderColor:d.color}}/>
            </div>
            <span className="text-[10px] font-bold flex-shrink-0" style={{color:d.color}}>{d.pts}</span>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 9, name: 'Waffle 10×10',
    render: () => {
      const cells = [];
      DATA.forEach((d,di)=>{ for(let j=0;j<Math.round(d.pct/10);j++) cells.push(d.color); });
      while(cells.length<10) cells.push('rgba(255,255,255,0.06)');
      return (
        <Card title="פילוח הניקוד">
          <div className="grid gap-1" style={{gridTemplateColumns:'repeat(10,1fr)'}}>
            {cells.map((c,i)=><div key={i} className="aspect-square rounded-sm" style={{background:c}}/>)}
          </div>
          <div className="grid grid-cols-2 gap-1">{DATA.map((d,i)=>(
            <div key={i} className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{background:d.color}}/><span className="text-[9px] text-white/50">{d.label}</span></div>
          ))}</div>
        </Card>
      );
    }
  },
  {
    id: 10, name: 'Progress Rings',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="grid grid-cols-2 gap-3">{DATA.map((d,i)=>{
          const r=24; const circ=2*Math.PI*r; const len=(d.pct/100)*circ;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="relative w-14 h-14">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
                  <circle cx="28" cy="28" r={r} fill="none" stroke={d.color} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${len} ${circ-len}`}/>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black" style={{color:d.color}}>{d.pct}%</span>
              </div>
              <p className="text-[9px] text-white/50 text-center leading-tight">{d.label}</p>
            </div>
          );
        })}</div>
      </Card>
    )
  },
  {
    id: 11, name: 'Gauge Semi-circle',
    render: () => {
      const r=50; const circ=Math.PI*r;
      return (
        <Card title="פילוח הניקוד">
          <div className="flex justify-center">
            <svg width="120" height="70" viewBox="0 0 120 70">
              {(() => {
                let off = 0;
                return DATA.map((d,i)=>{
                  const len=(d.pct/100)*circ; const dash=`${len} ${circ-len}`;
                  const rot = off/100*180;
                  off+=d.pct;
                  return <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={d.color} strokeWidth="16" strokeDasharray={dash} strokeDashoffset={0} transform={`rotate(${180+rot} 60 60)`} strokeLinecap="butt"/>;
                });
              })()}
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-1">{DATA.map((d,i)=>(
            <div key={i} className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{background:d.color}}/><span className="text-[9px] text-white/60">{d.label}</span><span className="text-[9px] font-bold ml-auto" style={{color:d.color}}>{d.pct}%</span></div>
          ))}</div>
        </Card>
      );
    }
  },
  {
    id: 12, name: 'Neon Cards',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-2">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{background:`${d.color}08`,border:`1px solid ${d.color}40`,boxShadow:`0 0 12px ${d.color}20`}}>
            <span className="text-lg font-black" style={{color:d.color}}>{d.pct}%</span>
            <span className="flex-1 text-xs text-white/60">{d.label}</span>
            <span className="text-xs font-bold" style={{color:d.color}}>{d.pts} pts</span>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 13, name: 'Treemap',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="grid gap-1" style={{gridTemplateColumns:'60% 40%',gridTemplateRows:'55% 45%'}}>
          {DATA.map((d,i)=>(
            <div key={i} className={`rounded-xl flex flex-col items-center justify-center p-2 ${i===0?'row-span-1 col-span-1':''}`} style={{background:`${d.color}25`,border:`1px solid ${d.color}50`,minHeight:i===0?60:40}}>
              <span className="text-xs font-black" style={{color:d.color}}>{d.pts}</span>
              <span className="text-[8px] text-white/50 text-center">{d.label}</span>
            </div>
          ))}
        </div>
      </Card>
    )
  },
  {
    id: 14, name: 'Step Bars',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-2">{DATA.map((d,i)=>(
          <div key={i} className="relative">
            <div className="absolute inset-y-0 left-0 rounded-xl opacity-20" style={{width:`${d.pct}%`,background:d.color}}/>
            <div className="relative flex items-center justify-between px-3 py-2.5">
              <span className="text-xs text-white/70">{d.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40">{d.pct}%</span>
                <span className="text-xs font-black" style={{color:d.color}}>{d.pts}</span>
              </div>
            </div>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 15, name: 'Icon Badges',
    render: () => (
      <Card title="פילוח הניקוד">
        {['🎯','📍','⚽','🥅'].map((icon,i)=>(
          <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0" style={{borderColor:'rgba(255,255,255,0.06)'}}>
            <span className="text-xl">{icon}</span>
            <div className="flex-1">
              <p className="text-xs text-white/70">{DATA[i].label}</p>
              <div className="h-1 mt-1 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full" style={{width:`${DATA[i].pct}%`,background:DATA[i].color}}/></div>
            </div>
            <span className="text-sm font-black" style={{color:DATA[i].color}}>{DATA[i].pts}</span>
          </div>
        ))}
      </Card>
    )
  },
  {
    id: 16, name: 'Ranking List',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-2">{[...DATA].sort((a,b)=>b.pts-a.pts).map((d,i)=>(
          <div key={i} className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-black flex-shrink-0" style={{background:d.color}}>{i+1}</span>
            <span className="flex-1 text-xs text-white/60">{d.label}</span>
            <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full" style={{width:`${d.pct}%`,background:d.color}}/></div>
            <span className="text-xs font-bold w-10 text-right" style={{color:d.color}}>{d.pts}</span>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 17, name: 'Split Pill',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-3">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center gap-2">
            <div className="flex-1 h-7 rounded-full overflow-hidden flex" style={{background:'rgba(255,255,255,0.04)'}}>
              <div className="h-full flex items-center justify-center text-[10px] font-bold text-black rounded-full" style={{width:`${Math.max(d.pct,15)}%`,background:d.color}}>{d.pct}%</div>
            </div>
            <div className="text-right w-16 flex-shrink-0">
              <p className="text-xs font-bold" style={{color:d.color}}>{d.pts} pts</p>
              <p className="text-[9px] text-white/30">{d.label}</p>
            </div>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 18, name: 'Heat Row',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="grid grid-cols-4 gap-1 mb-3">{DATA.map((d,i)=>(
          <div key={i} className="rounded-lg aspect-square flex flex-col items-center justify-center" style={{background:`${d.color}${Math.round(d.pct*2.5).toString(16).padStart(2,'0')}`}}>
            <span className="text-sm font-black text-white">{d.pct}%</span>
          </div>
        ))}</div>
        <div className="space-y-1">{DATA.map((d,i)=>(
          <div key={i} className="flex justify-between text-xs"><span className="text-white/50">{d.label}</span><span className="font-bold" style={{color:d.color}}>{d.pts}</span></div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 19, name: 'Minimal Text',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-4">{DATA.map((d,i)=>(
          <div key={i} className="flex items-baseline justify-between border-b pb-3 last:border-0" style={{borderColor:'rgba(255,255,255,0.06)'}}>
            <div>
              <p className="text-2xl font-black" style={{color:d.color}}>{d.pts}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{d.label}</p>
            </div>
            <span className="text-3xl font-thin text-white/10">{d.pct}%</span>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 20, name: 'Gradient Bars',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-2.5">{DATA.map((d,i)=>(
          <div key={i}>
            <div className="flex justify-between text-[10px] mb-1"><span className="text-white/50">{d.label}</span><span className="font-bold" style={{color:d.color}}>{d.pts} pts · {d.pct}%</span></div>
            <div className="h-3 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.04)'}}>
              <div className="h-full rounded-full" style={{width:`${d.pct}%`,background:`linear-gradient(90deg,${d.dark},${d.color})`}}/>
            </div>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 21, name: 'Bubble Chart',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="relative h-32">
          {DATA.map((d,i)=>{
            const size = 20 + d.pct * 1.5;
            const positions = [{top:5,left:5},{top:5,right:5},{bottom:5,left:30},{bottom:5,right:20}];
            return (
              <div key={i} className="absolute rounded-full flex flex-col items-center justify-center" style={{width:size,height:size,background:`${d.color}30`,border:`2px solid ${d.color}70`,...positions[i]}}>
                <span className="text-[9px] font-black" style={{color:d.color}}>{d.pct}%</span>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-1">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background:d.color}}/><span className="text-[9px] text-white/50">{d.label}</span></div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 22, name: 'Clock Style',
    render: () => {
      const r=40; const circ=2*Math.PI*r;
      let off=0;
      return (
        <Card title="פילוח הניקוד">
          <div className="flex justify-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="18"/>
              {DATA.map((d,i)=>{
                const len=(d.pct/100)*circ-1.5; const rot=(off/100)*360-90; off+=d.pct;
                return <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={d.color} strokeWidth="18" strokeDasharray={`${len} ${circ-len}`} transform={`rotate(${rot} 50 50)`} strokeLinecap="butt"/>;
              })}
              <text x="50" y="54" textAnchor="middle" fill="white" fontSize="13" fontWeight="900">{TOTAL.toFixed(0)}</text>
            </svg>
          </div>
          <div className="space-y-1">{DATA.map((d,i)=>(
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:d.color}}/>
              <span className="flex-1 text-white/55">{d.label}</span>
              <span className="font-bold" style={{color:d.color}}>{d.pts}</span>
            </div>
          ))}</div>
        </Card>
      );
    }
  },
  {
    id: 23, name: 'Score Cards Row',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-2">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center gap-3 rounded-2xl px-4 py-2" style={{background:`linear-gradient(135deg,${d.color}15,transparent)`,border:`1px solid ${d.color}30`}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm" style={{background:`${d.color}20`,color:d.color}}>{d.pct}%</div>
            <div className="flex-1"><p className="text-xs text-white/70">{d.label}</p></div>
            <p className="text-sm font-black" style={{color:d.color}}>{d.pts} <span className="text-[10px] font-normal text-white/30">pts</span></p>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 24, name: 'Vertical Progress',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="flex items-end justify-center gap-4 h-24">{DATA.map((d,i)=>(
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold" style={{color:d.color}}>{d.pts}</span>
            <div className="w-6 rounded-t-full overflow-hidden" style={{height:`${d.pct*2}px`,background:`linear-gradient(0deg,${d.dark},${d.color})`}}/>
            <span className="text-[8px] text-white/30 text-center">{d.pct}%</span>
          </div>
        ))}</div>
        <div className="grid grid-cols-2 gap-1">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background:d.color}}/><span className="text-[9px] text-white/50 truncate">{d.label}</span></div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 25, name: 'Waterfall',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-1.5">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center gap-2">
            <div className="w-24 text-right flex-shrink-0"><span className="text-[10px] text-white/50">{d.label}</span></div>
            <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{background:'rgba(255,255,255,0.04)'}}>
              <div className="h-full flex items-center" style={{width:`${d.pct}%`}}>
                <div className="h-full w-full rounded-lg" style={{background:`linear-gradient(90deg,${d.color}cc,${d.color})`}}/>
              </div>
            </div>
            <span className="text-xs font-bold w-12 flex-shrink-0 text-right" style={{color:d.color}}>{d.pts}</span>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 26, name: 'Glass Premium',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-2.5">{DATA.map((d,i)=>(
          <div key={i} className="rounded-2xl p-3 relative overflow-hidden" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',backdropFilter:'blur(20px)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.12)'}}>
            <div className="absolute inset-y-0 left-0 rounded-l-2xl" style={{width:`${d.pct}%`,background:`${d.color}15`}}/>
            <div className="relative flex justify-between items-center">
              <span className="text-xs text-white/70">{d.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/30">{d.pct}%</span>
                <span className="text-sm font-black" style={{color:d.color}}>{d.pts}</span>
              </div>
            </div>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 27, name: 'Segment Strip',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="space-y-3">{DATA.map((d,i)=>(
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-[10px]"><span className="text-white/50">{d.label}</span><span style={{color:d.color}}>{d.pts} pts</span></div>
            <div className="flex gap-0.5">{Array.from({length:10}).map((_,j)=>(
              <div key={j} className="flex-1 h-3 rounded-sm" style={{background:j<Math.round(d.pct/10)?d.color:'rgba(255,255,255,0.05)'}}/>
            ))}</div>
          </div>
        ))}</div>
      </Card>
    )
  },
  {
    id: 28, name: 'Compact Table',
    render: () => (
      <Card title="פילוח הניקוד">
        <table className="w-full text-xs">
          <thead><tr className="text-white/30 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}><th className="text-right pb-2 font-medium">קטגוריה</th><th className="text-center pb-2 font-medium">נקודות</th><th className="text-center pb-2 font-medium">%</th><th className="pb-2 font-medium">גרף</th></tr></thead>
          <tbody>{DATA.map((d,i)=>(
            <tr key={i} className="border-b last:border-0" style={{borderColor:'rgba(255,255,255,0.04)'}}>
              <td className="py-2 text-white/60">{d.label}</td>
              <td className="py-2 text-center font-bold" style={{color:d.color}}>{d.pts}</td>
              <td className="py-2 text-center text-white/40">{d.pct}%</td>
              <td className="py-2"><div className="h-2 rounded-full overflow-hidden bg-white/5"><div className="h-full rounded-full" style={{width:`${d.pct}%`,background:d.color}}/></div></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    )
  },
  {
    id: 29, name: 'Emoji Rating',
    render: () => (
      <Card title="פילוח הניקוד">
        {['🎯','📌','⚽','🥅'].map((icon,i)=>(
          <div key={i} className="flex items-center gap-2 py-2 border-b last:border-0" style={{borderColor:'rgba(255,255,255,0.06)'}}>
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
              <p className="text-[10px] text-white/50">{DATA[i].label}</p>
              <div className="flex gap-0.5 mt-1">{Array.from({length:5}).map((_,j)=>(
                <div key={j} className="w-4 h-4 rounded-sm" style={{background:j<Math.round(DATA[i].pct/7.5)?DATA[i].color:'rgba(255,255,255,0.05)'}}/>
              ))}</div>
            </div>
            <span className="text-sm font-black" style={{color:DATA[i].color}}>{DATA[i].pts}</span>
          </div>
        ))}
      </Card>
    )
  },
  {
    id: 30, name: 'Full Donut + Center Total',
    render: () => (
      <Card title="פילוח הניקוד">
        <div className="flex justify-center relative">
          <DonutSVG size={120} thickness={20}/>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-white">{TOTAL.toFixed(0)}</span>
            <span className="text-[9px] text-white/30">נקודות</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">{DATA.map((d,i)=>(
          <div key={i} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5" style={{background:`${d.color}10`}}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.color}}/>
            <div className="min-w-0"><p className="text-[9px] text-white/50 truncate">{d.label}</p><p className="text-xs font-bold" style={{color:d.color}}>{d.pts}</p></div>
          </div>
        ))}</div>
      </Card>
    )
  },
];

export default function AdminPointsBreakdownDemo() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="text-white space-y-6">
      <div>
        <h2 className="text-2xl font-bold">📊 פילוח נקודות — 30 קונספטים</h2>
        <p className="text-slate-400 text-sm mt-1">30 אפשרויות שונות לאופן הצגת פילוח הנקודות לפי קטגוריה</p>
      </div>

      {selected && (
        <div className="max-w-xs mx-auto">
          {DESIGNS.find(d=>d.id===selected)?.render()}
          <button onClick={()=>setSelected(null)} className="w-full mt-2 text-xs text-white/30 hover:text-white/60 transition-colors">סגור ✕</button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {DESIGNS.map(d => (
          <div key={d.id} onClick={()=>setSelected(d.id===selected?null:d.id)}
            className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${selected===d.id?'ring-2 ring-yellow-400 scale-105':'hover:ring-1 hover:ring-white/20'}`}>
            <div className="scale-[0.65] origin-top" style={{height:180,overflow:'hidden'}}>{d.render()}</div>
            <div className="px-2 py-1.5 border-t flex items-center gap-1.5" style={{background:'rgba(5,8,16,0.98)',borderColor:'rgba(255,255,255,0.06)'}}>
              <span className="text-[9px] text-slate-600 font-mono">#{d.id}</span>
              <span className="text-[10px] text-white/70 font-semibold truncate">{d.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
