import React, { useState } from 'react';
import { Target } from 'lucide-react';

const DEMO_DATA = [
  { position: 1, full_name: 'דין פלדמן',   exact_hits_count: 12, total_predictions_count: 48, is_current_user: false },
  { position: 2, full_name: 'דימה פלדמן',  exact_hits_count: 9,  total_predictions_count: 48, is_current_user: true  },
  { position: 3, full_name: 'יובל כהן',     exact_hits_count: 7,  total_predictions_count: 45, is_current_user: false },
  { position: 4, full_name: 'אור לוי',      exact_hits_count: 6,  total_predictions_count: 48, is_current_user: false },
  { position: 5, full_name: 'נועה מזרחי',   exact_hits_count: 5,  total_predictions_count: 42, is_current_user: false },
  { position: 6, full_name: 'תום גולן',     exact_hits_count: 4,  total_predictions_count: 46, is_current_user: false },
  { position: 7, full_name: 'שירה אבי',     exact_hits_count: 3,  total_predictions_count: 40, is_current_user: false },
];

const MEDAL = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
const MAX = 12;

// ── 1: נוכחי ─────────────────────────────────────────────────────────────────
function Design1() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p, i) => {
        const c = MEDAL[p.position];
        const bg = p.position===1?'from-yellow-400/15 to-orange-500/10':p.position===2?'from-gray-300/15 to-gray-400/10':p.position===3?'from-amber-500/15 to-amber-600/10':'from-slate-800/60 to-slate-800/40';
        const border = c ? `2px solid ${c}` : p.is_current_user ? '2px solid #60a5fa' : '2px solid rgba(71,85,105,0.5)';
        return (
          <div key={i} className={`rounded-xl bg-gradient-to-br ${bg} flex items-center gap-3 px-3 py-2 cursor-pointer hover:scale-[1.02] transition-transform`} style={{border}}>
            <span className="w-7 text-center font-black" style={{color:c||'#94a3b8',fontSize:16}}>{p.position}</span>
            <div className="flex-1 text-center">
              <p className="text-white font-semibold text-sm">{p.full_name}{p.is_current_user&&' 👤'}</p>
              <p className="text-green-400 font-bold text-sm">{p.exact_hits_count} פגיעות</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 2: Racing Bars ────────────────────────────────────────────────────────────
function Design2() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i) => {
        const c = MEDAL[p.position] || (p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="space-y-0.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold" style={{color:c}}>{p.position}. {p.full_name}{p.is_current_user?' 👤':''}</span>
              <span className="text-xs font-black text-white">{p.exact_hits_count}</span>
            </div>
            <div className="h-5 rounded-lg overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
              <div className="h-full rounded-lg flex items-center px-2" style={{width:`${(p.exact_hits_count/MAX)*100}%`,background:`${c}cc`,minWidth:24}}>
                <span className="text-[9px] font-black text-black">🎯</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 3: Podium + List ──────────────────────────────────────────────────────────
function Design3() {
  const top3 = DEMO_DATA.slice(0,3);
  const rest = DEMO_DATA.slice(3);
  return (
    <div className="space-y-4">
      {/* Podium */}
      <div className="flex items-end justify-center gap-2 h-24">
        {[top3[1],top3[0],top3[2]].map((p,i)=>{
          const heights=[64,88,52]; const pos=[2,1,3]; const c=MEDAL[pos[i]];
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="text-[9px] text-white/60 text-center leading-tight">{p?.full_name.split(' ')[0]}</div>
              <div className="text-xs font-black" style={{color:c}}>{p?.exact_hits_count}🎯</div>
              <div className="w-full rounded-t-lg flex items-center justify-center font-black text-sm" style={{height:heights[i],background:`${c}20`,border:`1px solid ${c}50`,borderBottom:'none',color:c}}>{pos[i]}</div>
            </div>
          );
        })}
      </div>
      {/* Rest */}
      <div className="space-y-1.5">
        {rest.map((p,i)=>(
          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
            <span className="text-xs text-white/60">{p.position}. {p.full_name}{p.is_current_user?' 👤':''}</span>
            <span className="text-xs font-bold text-green-400">{p.exact_hits_count} 🎯</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 4: Minimal Dark ───────────────────────────────────────────────────────────
function Design4() {
  return (
    <div className="space-y-1">
      {DEMO_DATA.map((p,i)=>(
        <div key={i} className={`flex items-center justify-between py-2 border-b ${i===DEMO_DATA.length-1?'border-transparent':'border-white/[0.06]'} ${p.is_current_user?'text-blue-300':'text-white/70'}`}>
          <div className="flex items-center gap-3">
            <span className="text-xs w-5 text-white/30 font-mono">{p.position}</span>
            <span className="text-sm font-medium">{p.full_name}{p.is_current_user?' •':''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black" style={{color:MEDAL[p.position]||'white'}}>{p.exact_hits_count}</span>
            <span className="text-[10px] text-white/30">🎯</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 5: Neon Glow ──────────────────────────────────────────────────────────────
function Design5() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c = MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="rounded-xl px-3 py-2 flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform"
            style={{background:`${c}08`,border:`1px solid ${c}35`,boxShadow:`0 0 12px ${c}15`}}>
            <span className="text-lg font-black w-6 text-center" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-sm font-semibold text-white">{p.full_name}{p.is_current_user?' 👤':''}</span>
            <span className="text-base font-black" style={{color:c,textShadow:`0 0 10px ${c}`}}>{p.exact_hits_count} 🎯</span>
          </div>
        );
      })}
    </div>
  );
}

// ── 6: Compact Table ──────────────────────────────────────────────────────────
function Design6() {
  return (
    <div className="rounded-xl overflow-hidden" style={{border:'1px solid rgba(255,255,255,0.08)'}}>
      <table className="w-full text-xs">
        <thead><tr style={{background:'rgba(255,255,255,0.06)'}}>
          <th className="py-2 px-2 text-white/40 font-medium text-center">#</th>
          <th className="py-2 px-2 text-white/40 font-medium text-right">שם</th>
          <th className="py-2 px-2 text-white/40 font-medium text-center">🎯</th>
          <th className="py-2 px-2 text-white/40 font-medium text-center">%</th>
        </tr></thead>
        <tbody>{DEMO_DATA.map((p,i)=>(
          <tr key={i} className={`border-t ${p.is_current_user?'bg-blue-400/10':''}`} style={{borderColor:'rgba(255,255,255,0.05)'}}>
            <td className="py-2 px-2 text-center font-black" style={{color:MEDAL[p.position]||'#94a3b8'}}>{p.position}</td>
            <td className="py-2 px-2 text-right font-medium text-white/80">{p.full_name}{p.is_current_user?' 👤':''}</td>
            <td className="py-2 px-2 text-center font-bold text-green-400">{p.exact_hits_count}</td>
            <td className="py-2 px-2 text-center text-white/40">{(p.exact_hits_count/p.total_predictions_count*100).toFixed(0)}%</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ── 7: Heat Scale ────────────────────────────────────────────────────────────
function Design7() {
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.map((p,i)=>{
        const intensity = p.exact_hits_count / MAX;
        const r = Math.round(20 + intensity * 200);
        const g = Math.round(200 - intensity * 100);
        const b = Math.round(50);
        const c = `rgb(${r},${g},${b})`;
        return (
          <div key={i} className="rounded-xl flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:scale-[1.02] transition-transform"
            style={{background:`rgba(${r},${g},${b},0.12)`,border:`1px solid rgba(${r},${g},${b},0.3)`}}>
            <span className="text-xs font-bold w-5 text-white/40">{p.position}</span>
            <span className="flex-1 text-sm text-white/80 font-medium">{p.full_name}{p.is_current_user?' 👤':''}</span>
            <div className="flex items-center gap-1">
              {Array.from({length:p.exact_hits_count}).map((_,j)=>(
                <div key={j} className="w-1.5 h-4 rounded-full" style={{background:c,opacity:0.7+j*0.025}}/>
              ))}
            </div>
            <span className="text-xs font-black ml-1" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── 8: Big Number Cards ───────────────────────────────────────────────────────
function Design8() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c = MEDAL[p.position]||(p.is_current_user?'#60a5fa':'rgba(255,255,255,0.5)');
        return (
          <div key={i} className="rounded-2xl flex items-center gap-3 px-4 py-3 cursor-pointer hover:scale-[1.01] transition-transform"
            style={{background:`linear-gradient(135deg,${c}10,transparent)`,border:`1px solid ${c}25`}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0"
              style={{background:`${c}18`,color:c}}>{p.position}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{p.full_name}{p.is_current_user?' 👤':''}</p>
              <p className="text-[10px] text-white/30">{(p.exact_hits_count/p.total_predictions_count*100).toFixed(0)}% דיוק</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-black" style={{color:c}}>{p.exact_hits_count}</p>
              <p className="text-[9px] text-white/30">פגיעות</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 9: Score Pills Row ────────────────────────────────────────────────────────
function Design9() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.slice(0,3).map((p,i)=>{
        const c = MEDAL[p.position];
        return (
          <div key={i} className="rounded-2xl p-3" style={{background:`linear-gradient(135deg,${c}20,${c}08)`,border:`1px solid ${c}40`}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black" style={{color:c}}>{p.position}</span>
                <div>
                  <p className="text-sm font-bold text-white">{p.full_name}</p>
                  <p className="text-[10px] text-white/40">{p.total_predictions_count} ניחושים</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black" style={{color:c}}>{p.exact_hits_count}</p>
                <p className="text-[9px] text-white/40">🎯 פגיעות</p>
              </div>
            </div>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.08)'}}>
              <div className="h-full rounded-full" style={{width:`${(p.exact_hits_count/MAX)*100}%`,background:c}}/>
            </div>
          </div>
        );
      })}
      <div className="rounded-xl overflow-hidden" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
        {DEMO_DATA.slice(3).map((p,i)=>(
          <div key={i} className="flex items-center justify-between px-3 py-2 border-b last:border-0" style={{borderColor:'rgba(255,255,255,0.05)'}}>
            <span className="text-xs text-white/50">{p.position}. {p.full_name}</span>
            <span className="text-sm font-bold text-white">{p.exact_hits_count} 🎯</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 10: Glass Premium ────────────────────────────────────────────────────────
function Design10() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c = MEDAL[p.position]||(p.is_current_user?'#60a5fa':'rgba(255,255,255,0.4)');
        return (
          <div key={i} className="rounded-2xl px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-all"
            style={{background:'rgba(255,255,255,0.05)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.12)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.1)'}}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{background:`${c}20`,color:c,border:`1.5px solid ${c}50`}}>{p.position}</div>
            <span className="flex-1 text-sm font-medium text-white/80">{p.full_name}{p.is_current_user?' 👤':''}</span>
            <div className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{background:`${c}18`,border:`1px solid ${c}35`}}>
              <span className="text-sm font-black" style={{color:c}}>{p.exact_hits_count}</span>
              <span className="text-[10px]">🎯</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const DESIGNS = [
  { id:1,  name:'נוכחי — כרטיסים צבעוניים',  component:<Design1/> },
  { id:2,  name:'Racing Bars',                 component:<Design2/> },
  { id:3,  name:'פודיום + רשימה',              component:<Design3/> },
  { id:4,  name:'Minimal Dark',                component:<Design4/> },
  { id:5,  name:'Neon Glow',                   component:<Design5/> },
  { id:6,  name:'Compact Table',               component:<Design6/> },
  { id:7,  name:'Heat Scale',                  component:<Design7/> },
  { id:8,  name:'Big Number Cards',            component:<Design8/> },
  { id:9,  name:'Top 3 + List',                component:<Design9/> },
  { id:10, name:'Glass Premium',               component:<Design10/> },
];

export default function AdminExactHitsDemo() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="text-white space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><Target className="w-6 h-6 text-green-400"/>Exact Hits — 10 עיצובים</h2>
        <p className="text-slate-400 text-sm mt-1">לחץ לפריוויו מלא בצד ימין</p>
      </div>

      <div className="flex gap-6">
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
          {DESIGNS.map(d=>(
            <div key={d.id} onClick={()=>setSelected(d.id===selected?null:d.id)}
              className={`cursor-pointer rounded-xl overflow-hidden transition-all ${selected===d.id?'ring-2 ring-yellow-400 scale-[1.02]':'hover:ring-1 hover:ring-white/20'}`}
              style={{background:'rgba(5,8,18,0.97)',border:'1px solid rgba(255,255,255,0.07)'}}>
              {/* Mini preview */}
              <div className="p-3 pointer-events-none" style={{transform:'scale(0.72)',transformOrigin:'top left',height:180,overflow:'hidden',width:'138%'}}>
                {d.component}
              </div>
              <div className="px-2.5 py-2 border-t flex items-center gap-1.5" style={{borderColor:'rgba(255,255,255,0.06)'}}>
                <span className="text-[9px] text-slate-600 font-mono">#{d.id}</span>
                <span className="text-[10px] font-semibold text-white/70 truncate">{d.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Full preview */}
        {selected && (
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-4 rounded-2xl p-4 space-y-3" style={{background:'rgba(5,8,18,0.97)',border:'1px solid rgba(255,255,255,0.1)'}}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white/60">#{selected} {DESIGNS.find(d=>d.id===selected)?.name}</p>
                <button onClick={()=>setSelected(null)} className="text-white/30 hover:text-white/70 text-sm">✕</button>
              </div>
              {/* Header mockup */}
              <div className="flex items-center gap-2 pb-2 border-b border-white/8">
                <span className="text-lg">🎯</span>
                <span className="text-sm font-bold text-white">Exact Hits</span>
              </div>
              {DESIGNS.find(d=>d.id===selected)?.component}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
