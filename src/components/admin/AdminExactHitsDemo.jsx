import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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

// ── 11: Stagger Bounce ────────────────────────────────────────────────────────
function Design11() {
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.map((p,i)=>(
        <motion.div key={i} initial={{x:-40,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:i*0.08,type:'spring',stiffness:300,damping:20}}
          className="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer"
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}
          whileHover={{x:4,background:'rgba(255,255,255,0.08)'}}>
          <motion.span className="text-lg font-black w-6" style={{color:MEDAL[p.position]||'#94a3b8'}}
            animate={{scale:[1,1.2,1]}} transition={{delay:i*0.1+0.5,duration:0.4}}>
            {p.position}
          </motion.span>
          <span className="flex-1 text-sm text-white/70">{p.full_name}</span>
          <motion.span className="text-base font-black text-green-400"
            initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.08+0.3,type:'spring',stiffness:400}}>
            {p.exact_hits_count}🎯
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

// ── 12: Count-up Numbers ──────────────────────────────────────────────────────
function CountUp({target,delay=0}) {
  const [val,setVal]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>{let s=0;const iv=setInterval(()=>{s=Math.min(s+1,target);setVal(s);if(s>=target)clearInterval(iv);},60);return()=>clearInterval(iv);},delay*1000);return()=>clearTimeout(t);},[target,delay]);
  return <span>{val}</span>;
}
function Design12() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>(
        <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
          <span className="font-black w-5 text-sm" style={{color:MEDAL[p.position]||'#64748b'}}>{p.position}</span>
          <span className="flex-1 text-sm text-white/70">{p.full_name}{p.is_current_user?' 👤':''}</span>
          <span className="text-xl font-black text-green-400"><CountUp target={p.exact_hits_count} delay={i*0.15}/></span>
        </div>
      ))}
    </div>
  );
}

// ── 13: Flip Cards ────────────────────────────────────────────────────────────
function Design13() {
  const [flipped,setFlipped]=useState({});
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const f=flipped[i];
        return (
          <motion.div key={i} onClick={()=>setFlipped(v=>({...v,[i]:!v[i]}))}
            className="rounded-xl cursor-pointer relative h-12 overflow-hidden"
            style={{border:`1px solid ${c}40`,transformStyle:'preserve-3d'}}>
            <AnimatePresence mode="wait">
              {!f ? (
                <motion.div key="front" initial={{rotateY:0}} exit={{rotateY:90}} transition={{duration:0.15}}
                  className="absolute inset-0 flex items-center gap-3 px-3"
                  style={{background:`${c}10`}}>
                  <span className="font-black w-5" style={{color:c}}>{p.position}</span>
                  <span className="flex-1 text-sm text-white/70">{p.full_name}</span>
                  <span className="text-base font-black" style={{color:c}}>{p.exact_hits_count}🎯</span>
                </motion.div>
              ) : (
                <motion.div key="back" initial={{rotateY:-90}} animate={{rotateY:0}} transition={{duration:0.15}}
                  className="absolute inset-0 flex items-center justify-center gap-4 px-3"
                  style={{background:`${c}20`}}>
                  <span className="text-xs text-white/50">ניחושים: <b className="text-white">{p.total_predictions_count}</b></span>
                  <span className="text-xs text-white/50">דיוק: <b style={{color:c}}>{(p.exact_hits_count/p.total_predictions_count*100).toFixed(0)}%</b></span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
      <p className="text-[9px] text-white/20 text-center">לחץ לפרטים</p>
    </div>
  );
}

// ── 14: Liquid Fill Bars ─────────────────────────────────────────────────────
function Design14() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="rounded-xl overflow-hidden relative h-10" style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}30`}}>
            <motion.div className="absolute inset-y-0 left-0 rounded-xl"
              initial={{width:0}} animate={{width:`${(p.exact_hits_count/MAX)*100}%`}}
              transition={{delay:i*0.1,duration:0.8,ease:[0.34,1.56,0.64,1]}}
              style={{background:`linear-gradient(90deg,${c}40,${c}20)`}}/>
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black" style={{color:c}}>{p.position}</span>
                <span className="text-xs text-white/70">{p.full_name}</span>
              </div>
              <motion.span initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.1+0.6}}
                className="text-sm font-black" style={{color:c}}>{p.exact_hits_count}🎯</motion.span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 15: Particle Burst on Hover ───────────────────────────────────────────────
function Design15() {
  const [hovered,setHovered]=useState(null);
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <motion.div key={i} className="relative rounded-xl px-3 py-2 cursor-pointer flex items-center gap-3 overflow-hidden"
            style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}25`}}
            onHoverStart={()=>setHovered(i)} onHoverEnd={()=>setHovered(null)}
            whileHover={{scale:1.02}}>
            {hovered===i && Array.from({length:6}).map((_,j)=>(
              <motion.div key={j} className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{background:c,left:'50%',top:'50%'}}
                initial={{x:0,y:0,opacity:1,scale:1}}
                animate={{x:(Math.cos(j/6*Math.PI*2)*30),y:(Math.sin(j/6*Math.PI*2)*20),opacity:0,scale:0}}
                transition={{duration:0.5,delay:j*0.05}}/>
            ))}
            <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-sm text-white/70">{p.full_name}</span>
            <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── 16: Retro Scoreboard ─────────────────────────────────────────────────────
function Design16() {
  return (
    <div className="rounded-xl overflow-hidden font-mono" style={{background:'#0a1208',border:'1px solid #1a3a14'}}>
      <div className="text-center py-1.5 text-[10px] tracking-[0.2em]" style={{color:'#39ff14',textShadow:'0 0 6px #39ff14',borderBottom:'1px solid #1a3a14'}}>◆ EXACT HITS BOARD ◆</div>
      {DEMO_DATA.map((p,i)=>(
        <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.1}}
          className="flex items-center justify-between px-3 py-1.5 border-b last:border-0" style={{borderColor:'#0d2410'}}>
          <div className="flex items-center gap-2">
            <span className="text-[10px]" style={{color:'rgba(57,255,20,0.5)'}}>{String(p.position).padStart(2,'0')}</span>
            <span className="text-[11px] truncate" style={{color:'#39ff14'}}>{p.full_name.toUpperCase()}</span>
          </div>
          <span className="text-sm font-black" style={{color:'#39ff14',textShadow:'0 0 8px #39ff14'}}>{String(p.exact_hits_count).padStart(2,'0')}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ── 17: Pulse Ring ────────────────────────────────────────────────────────────
function Design17() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.slice(0,5).map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="relative flex-shrink-0 w-10 h-10">
              <motion.div className="absolute inset-0 rounded-full" style={{border:`2px solid ${c}`}}
                animate={{scale:[1,1.4,1],opacity:[0.8,0,0.8]}} transition={{duration:1.5,delay:i*0.3,repeat:Infinity}}/>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm" style={{background:`${c}20`,border:`2px solid ${c}60`,color:c}}>{p.position}</div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white/70">{p.full_name}{p.is_current_user?' 👤':''}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {Array.from({length:p.exact_hits_count}).slice(0,8).map((_,j)=>(
                  <motion.div key={j} className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:c}}
                    initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.1+j*0.04}}/>
                ))}
                {p.exact_hits_count>8&&<span className="text-[9px] text-white/30">+{p.exact_hits_count-8}</span>}
              </div>
            </div>
            <span className="text-base font-black flex-shrink-0" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── 18: Typewriter Names ──────────────────────────────────────────────────────
function TypeText({text,delay=0}) {
  const [shown,setShown]=useState('');
  useEffect(()=>{let i=0;const t=setTimeout(()=>{const iv=setInterval(()=>{setShown(text.slice(0,++i));if(i>=text.length)clearInterval(iv);},40);return()=>clearInterval(iv);},delay*1000);return()=>clearTimeout(t);},[text,delay]);
  return <span>{shown}<span className="animate-pulse">|</span></span>;
}
function Design18() {
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="flex items-center gap-2 py-2 border-b border-white/[0.05] last:border-0">
            <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-sm font-mono" style={{color:p.is_current_user?'#93c5fd':'rgba(255,255,255,0.7)'}}>
              <TypeText text={p.full_name} delay={i*0.3}/>
            </span>
            <motion.span initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.3+0.6,type:'spring'}}
              className="font-black text-base" style={{color:c}}>{p.exact_hits_count}🎯</motion.span>
          </div>
        );
      })}
    </div>
  );
}

// ── 19: Spotlight Hover ───────────────────────────────────────────────────────
function Design19() {
  const [hov,setHov]=useState(null);
  return (
    <div className="space-y-1 rounded-xl overflow-hidden" style={{background:'rgba(3,5,12,0.97)',border:'1px solid rgba(255,255,255,0.07)'}}>
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <motion.div key={i} className="relative flex items-center gap-3 px-4 py-2.5 cursor-pointer"
            onHoverStart={()=>setHov(i)} onHoverEnd={()=>setHov(null)}>
            {hov===i&&<motion.div className="absolute inset-0" layoutId="spotlight"
              style={{background:`radial-gradient(ellipse at left,${c}12,transparent 70%)`}} initial={false}/>}
            <span className="font-black text-sm w-5 relative z-10" style={{color:hov===i?c:(MEDAL[p.position]||'#475569')}}>{p.position}</span>
            <span className="flex-1 text-sm relative z-10" style={{color:hov===i?'white':'rgba(255,255,255,0.55)'}}>{p.full_name}{p.is_current_user?' 👤':''}</span>
            <motion.span className="font-black text-sm relative z-10" style={{color:c}} animate={{scale:hov===i?1.2:1}}>{p.exact_hits_count}🎯</motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── 20: DNA Dots ──────────────────────────────────────────────────────────────
function Design20() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.slice(0,5).map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const filled=p.exact_hits_count; const total=12;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] font-bold w-4" style={{color:c}}>{p.position}</span>
            <span className="text-[10px] text-white/50 w-16 truncate">{p.full_name.split(' ')[0]}</span>
            <div className="flex gap-0.5 flex-1">
              {Array.from({length:total}).map((_,j)=>(
                <motion.div key={j} className="flex-1 h-3 rounded-full"
                  initial={{scaleY:0}} animate={{scaleY:1}} transition={{delay:i*0.05+j*0.04}}
                  style={{background:j<filled?c:'rgba(255,255,255,0.06)',transformOrigin:'bottom'}}/>
              ))}
            </div>
            <span className="text-[10px] font-black w-4" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── 21: Star Rating ───────────────────────────────────────────────────────────
function Design21() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#fbbf24');
        const stars=Math.round(p.exact_hits_count/MAX*5);
        return (
          <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/[0.05] last:border-0">
            <span className="font-black text-xs w-4" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/65">{p.full_name}{p.is_current_user?' 👤':''}</span>
            <div className="flex gap-0.5">
              {Array.from({length:5}).map((_,j)=>(
                <motion.span key={j} initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:i*0.1+j*0.06}}
                  style={{color:j<stars?c:'rgba(255,255,255,0.1)',fontSize:10}}>★</motion.span>
              ))}
            </div>
            <span className="text-[10px] font-black ml-1" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── 22: Wave Bars ─────────────────────────────────────────────────────────────
function Design22() {
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] font-bold w-4 text-center" style={{color:c}}>{p.position}</span>
            <span className="text-xs text-white/55 w-20 truncate">{p.full_name}</span>
            <div className="flex items-end gap-0.5 flex-1 h-6">
              {Array.from({length:p.exact_hits_count}).map((_,j)=>(
                <motion.div key={j} className="flex-1 rounded-full min-w-[3px]"
                  style={{background:c,opacity:0.6+j*0.03}}
                  animate={{height:['40%','100%','60%','90%','50%'][j%5]}}
                  transition={{duration:1.2,delay:j*0.1,repeat:Infinity,ease:'easeInOut'}}/>
              ))}
            </div>
            <span className="text-xs font-black flex-shrink-0" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── 23: Card Reveal ───────────────────────────────────────────────────────────
function Design23() {
  const [revealed,setRevealed]=useState(new Set());
  const toggle=i=>setRevealed(s=>{const n=new Set(s);n.has(i)?n.delete(i):n.add(i);return n;});
  return (
    <div className="grid grid-cols-2 gap-2">
      {DEMO_DATA.slice(0,6).map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const isRev=revealed.has(i);
        return (
          <motion.div key={i} onClick={()=>toggle(i)}
            className="rounded-xl h-14 flex items-center justify-center cursor-pointer relative overflow-hidden"
            style={{background:isRev?`${c}20`:'rgba(255,255,255,0.04)',border:`1px solid ${isRev?c+'50':'rgba(255,255,255,0.08)'}`}}
            whileTap={{scale:0.95}}>
            <AnimatePresence mode="wait">
              {!isRev ? (
                <motion.span key="q" initial={{opacity:1}} exit={{opacity:0,scale:0}} className="text-2xl text-white/20">?</motion.span>
              ) : (
                <motion.div key="a" initial={{scale:0,rotate:-10}} animate={{scale:1,rotate:0}} className="text-center">
                  <p className="text-lg font-black" style={{color:c}}>{p.exact_hits_count}🎯</p>
                  <p className="text-[9px] text-white/40">{p.full_name.split(' ')[0]}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── 24: Sliding Rank ─────────────────────────────────────────────────────────
function Design24() {
  return (
    <div className="space-y-1.5 relative">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <motion.div key={i}
            initial={{x:200,opacity:0}} animate={{x:0,opacity:1}}
            transition={{delay:i*0.12,type:'spring',stiffness:200,damping:25}}
            className="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer"
            style={{background:`linear-gradient(90deg,${c}12,rgba(255,255,255,0.03))`,border:`1px solid ${c}25`}}
            whileHover={{x:-2}}>
            <motion.span className="text-xl font-black w-7" style={{color:c}}
              animate={{rotateY:[0,360]}} transition={{delay:i*0.15+0.8,duration:0.4}}>
              {p.position}
            </motion.span>
            <span className="flex-1 text-sm text-white/70">{p.full_name}{p.is_current_user?' 👤':''}</span>
            <span className="font-black" style={{color:c}}>{p.exact_hits_count}🎯</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── 25: Confetti Row ─────────────────────────────────────────────────────────
function Design25() {
  const [burst,setBurst]=useState(null);
  const emojis=['🎯','⚽','🎉','✨','🔥'];
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="relative">
            <motion.div className="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer"
              style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}25`}}
              onClick={()=>setBurst(i)} whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
              <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
              <span className="flex-1 text-sm text-white/65">{p.full_name}</span>
              <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
            </motion.div>
            {burst===i && Array.from({length:8}).map((_,j)=>(
              <motion.span key={j} className="absolute text-sm pointer-events-none"
                style={{left:'50%',top:'50%',zIndex:10}}
                initial={{x:0,y:0,opacity:1}}
                animate={{x:(Math.random()-0.5)*80,y:(Math.random()-0.5)*60,opacity:0,scale:1.5}}
                onAnimationComplete={()=>setBurst(null)}
                transition={{duration:0.6,delay:j*0.04}}>
                {emojis[j%emojis.length]}
              </motion.span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── 26: Heartbeat ────────────────────────────────────────────────────────────
function Design26() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.slice(0,5).map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#f87171');
        return (
          <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${c}20`}}>
            <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/60">{p.full_name}</span>
            <svg width="60" height="24" viewBox="0 0 60 24">
              {Array.from({length:p.exact_hits_count}).map((_,j)=>{
                const x=j*(60/Math.min(p.exact_hits_count,8));
                return <motion.circle key={j} cx={x+4} cy={12} r="2" fill={c}
                  animate={{cy:[12,4,12,20,12],opacity:[0.4,1,0.4]}} transition={{duration:0.8,delay:j*0.1,repeat:Infinity}}/>;
              })}
            </svg>
            <span className="text-sm font-black" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── 27: Radar Chart ──────────────────────────────────────────────────────────
function Design27() {
  const top5=DEMO_DATA.slice(0,5);
  const r=45,cx=60,cy=60;
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {[0.2,0.4,0.6,0.8,1].map((s,i)=>(
          <circle key={i} cx={cx} cy={cy} r={r*s} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        ))}
        {top5.map((p,i)=>{
          const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
          const angle=(i/top5.length)*Math.PI*2-Math.PI/2;
          const pr=r*(p.exact_hits_count/MAX);
          const x=cx+pr*Math.cos(angle),y=cy+pr*Math.sin(angle);
          const lx=cx+(r+12)*Math.cos(angle),ly=cy+(r+12)*Math.sin(angle);
          return (
            <g key={i}>
              <motion.circle cx={x} cy={y} r="4" fill={c} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.1+0.3}}/>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={c} strokeWidth="1.5" strokeOpacity="0.5"/>
              <text x={lx} y={ly} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6">{p.full_name.split(' ')[0]}</text>
            </g>
          );
        })}
      </svg>
      <div className="grid grid-cols-3 gap-1 w-full">{top5.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return <div key={i} className="text-center"><p className="text-[9px] text-white/40">{p.full_name.split(' ')[0]}</p><p className="text-xs font-black" style={{color:c}}>{p.exact_hits_count}</p></div>;
      })}</div>
    </div>
  );
}

// ── 28: Neon Sign Flicker ─────────────────────────────────────────────────────
function Design28() {
  return (
    <div className="rounded-xl overflow-hidden p-3 space-y-1.5" style={{background:'#02040a',border:'1px solid rgba(236,72,153,0.3)'}}>
      <div className="text-center text-[10px] tracking-widest mb-2" style={{color:'#ec4899',textShadow:'0 0 10px #ec4899'}}>
        <motion.span animate={{opacity:[1,0.3,1,0.8,1]}} transition={{duration:2,repeat:Infinity,times:[0,0.1,0.2,0.5,1]}}>
          ◆ EXACT HITS ◆
        </motion.span>
      </div>
      {DEMO_DATA.map((p,i)=>{
        const c=['#f59e0b','#94a3b8','#cd7f32','#ec4899','#4ade80','#38bdf8','#c084fc'][i];
        return (
          <div key={i} className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px]" style={{color:`${c}80`}}>{String(p.position).padStart(2,'0')}.</span>
            <motion.span className="text-[10px] font-bold" style={{color:c}}
              animate={{opacity:[1,0.7,1]}} transition={{duration:1.5,delay:i*0.4,repeat:Infinity}}>
              {p.full_name}
            </motion.span>
            <span className="text-sm font-black" style={{color:c,textShadow:`0 0 8px ${c}`}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── 29: Stack Reveal ─────────────────────────────────────────────────────────
function Design29() {
  const [shown,setShown]=useState(3);
  return (
    <div className="space-y-2">
      {DEMO_DATA.slice(0,shown).map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <motion.div key={i} initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.05}}
            className="rounded-xl flex items-center gap-3 px-3 py-2.5"
            style={{background:`${c}0d`,border:`1px solid ${c}30`}}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{background:`${c}25`,color:c}}>{p.position}</span>
            <span className="flex-1 text-sm text-white/70">{p.full_name}</span>
            <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
          </motion.div>
        );
      })}
      {shown<DEMO_DATA.length&&(
        <motion.button onClick={()=>setShown(s=>Math.min(s+2,DEMO_DATA.length))} whileTap={{scale:0.95}}
          className="w-full py-2 rounded-xl text-xs text-white/40 border border-white/10 hover:bg-white/5 transition-colors">
          הצג עוד ↓
        </motion.button>
      )}
    </div>
  );
}

// ── 30: Holographic Shimmer ───────────────────────────────────────────────────
function Design30() {
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <motion.div key={i} className="rounded-xl px-3 py-2 flex items-center gap-3 cursor-pointer overflow-hidden relative"
            style={{border:`1px solid ${c}30`}} whileHover={{scale:1.02}}>
            <motion.div className="absolute inset-0 opacity-0" style={{background:`linear-gradient(105deg,transparent 40%,${c}15 50%,transparent 60%)`}}
              whileHover={{opacity:1,backgroundPosition:['200% 0','0% 0']}}
              transition={{duration:0.4}}/>
            <span className="font-black text-sm w-5 relative z-10" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-sm text-white/65 relative z-10">{p.full_name}{p.is_current_user?' 👤':''}</span>
            <span className="font-black text-sm relative z-10" style={{color:c}}>{p.exact_hits_count}🎯</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── 31-60: More designs ───────────────────────────────────────────────────────

function Design31() { // Orbit circles
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.slice(0,5).map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="flex items-center gap-3 py-1.5">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black" style={{background:`${c}20`,color:c}}>{p.position}</div>
              <motion.div className="absolute inset-0 rounded-full border" style={{borderColor:c,borderStyle:'dashed'}}
                animate={{rotate:360}} transition={{duration:3+i,repeat:Infinity,ease:'linear'}}/>
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/65">{p.full_name}</p>
              <div className="flex gap-0.5 mt-0.5">
                {Array.from({length:p.exact_hits_count}).slice(0,MAX).map((_,j)=>(
                  <motion.div key={j} className="w-1 h-1 rounded-full" style={{background:c}}
                    initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.1+j*0.05}}/>
                ))}
              </div>
            </div>
            <span className="text-sm font-black flex-shrink-0" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

function Design32() { // Accordion expand
  const [open,setOpen]=useState(0);
  return (
    <div className="space-y-1">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const isOpen=open===i;
        return (
          <div key={i} className="rounded-xl overflow-hidden" style={{border:`1px solid ${c}${isOpen?'50':'20'}`}}>
            <motion.div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={()=>setOpen(isOpen?-1:i)}
              style={{background:isOpen?`${c}15`:'rgba(255,255,255,0.03)'}}>
              <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
              <span className="flex-1 text-sm text-white/70">{p.full_name}</span>
              <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
              <motion.span className="text-white/30 text-xs" animate={{rotate:isOpen?180:0}}>▼</motion.span>
            </motion.div>
            <AnimatePresence>
              {isOpen&&(
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                  className="px-4 pb-3 pt-1 text-xs text-white/40 flex gap-4">
                  <span>ניחושים: <b className="text-white/70">{p.total_predictions_count}</b></span>
                  <span>דיוק: <b style={{color:c}}>{(p.exact_hits_count/p.total_predictions_count*100).toFixed(0)}%</b></span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function Design33() { // Morphing progress rings
  return (
    <div className="grid grid-cols-2 gap-2">
      {DEMO_DATA.slice(0,6).map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const r=20,circ=2*Math.PI*r,len=(p.exact_hits_count/MAX)*circ;
        return (
          <div key={i} className="flex flex-col items-center gap-1 py-2 rounded-xl cursor-pointer"
            style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${c}25`}}>
            <div className="relative w-12 h-12">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
                <motion.circle cx="24" cy="24" r={r} fill="none" stroke={c} strokeWidth="4" strokeLinecap="round"
                  initial={{strokeDasharray:`0 ${circ}`}} animate={{strokeDasharray:`${len} ${circ-len}`}}
                  transition={{delay:i*0.1,duration:0.8,ease:'easeOut'}}/>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black" style={{color:c}}>{p.exact_hits_count}</span>
            </div>
            <p className="text-[9px] text-white/50 text-center leading-tight">{p.full_name.split(' ')[0]}</p>
          </div>
        );
      })}
    </div>
  );
}

function Design34() { // Trophy shelf
  const top3=DEMO_DATA.slice(0,3);
  const icons=['🥇','🥈','🥉'];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {top3.map((p,i)=>{
          const c=MEDAL[p.position];
          return (
            <motion.div key={i} initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:i*0.15,type:'spring',stiffness:200}}
              className="rounded-2xl p-3 text-center cursor-pointer" style={{background:`${c}12`,border:`1px solid ${c}40`}}
              whileHover={{y:-4,boxShadow:`0 8px 20px ${c}25`}}>
              <motion.span className="text-3xl block" animate={{rotateZ:[-5,5,-5]}} transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}>{icons[i]}</motion.span>
              <p className="text-[10px] text-white/60 mt-1">{p.full_name.split(' ')[0]}</p>
              <p className="text-lg font-black mt-0.5" style={{color:c}}>{p.exact_hits_count}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="space-y-1">
        {DEMO_DATA.slice(3).map((p,i)=>(
          <div key={i} className="flex justify-between items-center px-2 py-1 text-xs">
            <span className="text-white/40">{p.position}. {p.full_name}</span>
            <span className="font-bold text-green-400">{p.exact_hits_count}🎯</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Design35() { // Speed gauge bars
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const spd=p.exact_hits_count/MAX;
        return (
          <div key={i} className="rounded-xl px-3 py-2" style={{background:'rgba(255,255,255,0.03)',border:`1px solid rgba(255,255,255,0.06)`}}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black w-4" style={{color:c}}>{p.position}</span>
                <span className="text-xs text-white/60">{p.full_name}</span>
              </div>
              <span className="text-xs font-black" style={{color:c}}>{p.exact_hits_count}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
              <motion.div className="h-full rounded-full relative overflow-hidden"
                initial={{width:0}} animate={{width:`${spd*100}%`}} transition={{delay:i*0.1,duration:0.7,ease:'easeOut'}}
                style={{background:`linear-gradient(90deg,${c}80,${c})`}}>
                <motion.div className="absolute inset-0" style={{background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)'}}
                  animate={{x:['-100%','200%']}} transition={{duration:1.5,delay:i*0.1+0.7,repeat:Infinity,repeatDelay:2}}/>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Design36() { // Chat bubbles
  return (
    <div className="space-y-2 p-1">
      {DEMO_DATA.slice(0,5).map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const isRight=i%2===0;
        return (
          <motion.div key={i} className={`flex ${isRight?'justify-end':'justify-start'}`}
            initial={{opacity:0,x:isRight?30:-30}} animate={{opacity:1,x:0}} transition={{delay:i*0.12}}>
            <div className="max-w-[80%] rounded-2xl px-3 py-2" style={{background:isRight?`${c}20`:'rgba(255,255,255,0.06)',border:`1px solid ${c}${isRight?'40':'20'}`}}>
              <p className="text-[10px] text-white/50 mb-0.5">{p.full_name}</p>
              <p className="text-sm font-black" style={{color:c}}>{p.exact_hits_count}🎯 פגיעות!</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Design37() { // Instagram story circles
  const [active,setActive]=useState(null);
  return (
    <div className="space-y-3">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {DEMO_DATA.map((p,i)=>{
          const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
          return (
            <motion.div key={i} className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
              onClick={()=>setActive(active===i?null:i)} whileTap={{scale:0.9}}>
              <div className="w-12 h-12 rounded-full p-0.5" style={{background:active===i?'rgba(255,255,255,0.2)':`conic-gradient(${c} ${p.exact_hits_count/MAX*360}deg, rgba(255,255,255,0.1) 0)`}}>
                <div className="w-full h-full rounded-full flex items-center justify-center text-base font-black" style={{background:'#030612',color:c}}>{p.position}</div>
              </div>
              <span className="text-[9px] text-white/50 text-center">{p.full_name.split(' ')[0]}</span>
            </motion.div>
          );
        })}
      </div>
      {active!==null&&(
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
          className="rounded-xl p-3" style={{background:`${MEDAL[DEMO_DATA[active]?.position]||'#4ade80'}15`,border:`1px solid ${MEDAL[DEMO_DATA[active]?.position]||'#4ade80'}40`}}>
          <p className="text-sm font-bold text-white">{DEMO_DATA[active]?.full_name}</p>
          <p className="text-xs text-white/50 mt-1">🎯 {DEMO_DATA[active]?.exact_hits_count} פגיעות מדויקות</p>
          <p className="text-xs text-white/40">{(DEMO_DATA[active]?.exact_hits_count/DEMO_DATA[active]?.total_predictions_count*100).toFixed(0)}% דיוק</p>
        </motion.div>
      )}
    </div>
  );
}

function Design38() { // Matrix rain
  return (
    <div className="rounded-xl overflow-hidden relative" style={{background:'#020802',border:'1px solid rgba(0,255,0,0.2)'}}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{backgroundImage:'repeating-linear-gradient(0deg,rgba(0,255,0,0.3) 0px,rgba(0,255,0,0.3) 1px,transparent 1px,transparent 20px)',backgroundSize:'20px 20px'}}/>
      {DEMO_DATA.map((p,i)=>(
        <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.15}}
          className="flex items-center justify-between px-3 py-2 border-b last:border-0 font-mono" style={{borderColor:'rgba(0,200,0,0.1)'}}>
          <span className="text-[10px]" style={{color:'rgba(0,200,0,0.5)'}}>{i+1}</span>
          <span className="text-[11px]" style={{color:'rgba(0,220,0,0.8)'}}>{p.full_name}</span>
          <motion.span className="text-sm font-black" style={{color:'#00ff41',textShadow:'0 0 8px #00ff41'}}
            animate={{opacity:[1,0.6,1]}} transition={{duration:1.5,delay:i*0.3,repeat:Infinity}}>
            {p.exact_hits_count}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

function Design39() { // Dice roll
  const [rolled,setRolled]=useState({});
  const diceFaces=['⚀','⚁','⚂','⚃','⚄','⚅'];
  return (
    <div className="space-y-2">
      {DEMO_DATA.slice(0,5).map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <motion.div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer"
            style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}25`}}
            onClick={()=>setRolled(r=>({...r,[i]:!r[i]}))}
            whileTap={{scale:0.95}}>
            <motion.span className="text-xl" animate={rolled[i]?{rotate:[0,360],scale:[1,1.3,1]}:{}}
              transition={{duration:0.5}}>{diceFaces[p.exact_hits_count%6]}</motion.span>
            <span className="flex-1 text-xs text-white/60">{p.full_name}</span>
            <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Design40() { // Slot machine numbers
  const [spin,setSpin]=useState(false);
  const [shown,setShown]=useState(DEMO_DATA.map(p=>p.exact_hits_count));
  const doSpin=()=>{
    setSpin(true);
    let count=0;
    const iv=setInterval(()=>{
      setShown(DEMO_DATA.map(p=>Math.floor(Math.random()*p.exact_hits_count)+1));
      if(++count>8){clearInterval(iv);setShown(DEMO_DATA.map(p=>p.exact_hits_count));setSpin(false);}
    },80);
  };
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}25`}}>
            <span className="font-black text-sm w-4" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/60">{p.full_name}</span>
            <motion.span className="text-xl font-black w-8 text-center" style={{color:c,fontFamily:'monospace'}}
              animate={spin?{y:[-2,2,-2]}:{}} transition={{duration:0.1,repeat:spin?Infinity:0}}>
              {shown[i]}
            </motion.span>
          </div>
        );
      })}
      <motion.button onClick={doSpin} disabled={spin} whileTap={{scale:0.95}}
        className="w-full py-2 rounded-xl text-xs font-bold text-black mt-1" style={{background:'linear-gradient(135deg,#fbbf24,#f59e0b)'}}>
        {spin?'🎰 מסתובב...':'🎰 Spin!'}
      </motion.button>
    </div>
  );
}

function Design41() { // Glitch effect
  const [glitch,setGlitch]=useState(null);
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <motion.div key={i} className="rounded-xl px-3 py-2 flex items-center gap-3 cursor-pointer relative overflow-hidden"
            style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${c}20`}}
            onHoverStart={()=>setGlitch(i)} onHoverEnd={()=>setGlitch(null)}>
            <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/60 relative">
              {glitch===i&&<span className="absolute inset-0" style={{color:'#f87171',opacity:0.5,textShadow:'2px 0 0 #4ade80',transform:'translate(1px,0)'}}>{p.full_name}</span>}
              {p.full_name}
            </span>
            <motion.span className="font-black text-sm" style={{color:c}}
              animate={glitch===i?{x:[-1,1,-1,0]}:{}} transition={{duration:0.15,repeat:3}}>
              {p.exact_hits_count}🎯
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Design42() { // Fire intensity
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.map((p,i)=>{
        const intensity=p.exact_hits_count/MAX;
        const fires=['🧊','❄️','💧','🌿','🔥','🔥','🌋'][Math.round(intensity*6)];
        const c=`hsl(${(1-intensity)*220},80%,60%)`;
        return (
          <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{background:`${c}10`,border:`1px solid ${c}30`}}>
            <motion.span animate={{scale:[1,1.1,1]}} transition={{duration:0.8+i*0.1,repeat:Infinity}}>{fires}</motion.span>
            <span className="font-black text-sm w-4" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/60">{p.full_name}</span>
            <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

function Design43() { // Morse code dots
  const toMorse=n=>Array.from({length:n}).map((_,i)=>i%3===0?'—':'·').join('');
  return (
    <div className="space-y-2 font-mono">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/[0.05] last:border-0">
            <span className="text-xs w-4" style={{color:c}}>{p.position}</span>
            <span className="text-[10px] text-white/50 w-20">{p.full_name.split(' ')[0]}</span>
            <motion.span className="flex-1 text-sm tracking-widest" style={{color:`${c}90`}}
              initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.1}}>
              {toMorse(p.exact_hits_count)}
            </motion.span>
            <span className="text-xs font-black" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

function Design44() { // Neon tube horizontal
  return (
    <div className="space-y-1.5 p-2 rounded-xl" style={{background:'#010206',border:'1px solid rgba(0,100,255,0.2)'}}>
      {DEMO_DATA.map((p,i)=>{
        const colors=['#fbbf24','#c0c0c0','#cd7f32','#60a5fa','#4ade80','#a78bfa','#f87171'];
        const c=colors[i];
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] font-black w-4" style={{color:c,textShadow:`0 0 6px ${c}`}}>{p.position}</span>
            <motion.div className="flex-1 h-3 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.04)'}}>
              <motion.div className="h-full rounded-full" style={{background:c,boxShadow:`0 0 8px ${c}`}}
                initial={{width:0}} animate={{width:`${(p.exact_hits_count/MAX)*100}%`}} transition={{delay:i*0.1,duration:0.6}}/>
            </motion.div>
            <span className="text-xs font-black w-5" style={{color:c,textShadow:`0 0 6px ${c}`}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

function Design45() { // Vinyl record
  const [playing,setPlaying]=useState(null);
  return (
    <div className="space-y-2">
      {DEMO_DATA.slice(0,5).map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const isPlay=playing===i;
        return (
          <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer" style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${c}25`}}
            onClick={()=>setPlaying(isPlay?null:i)}>
            <motion.div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black"
              style={{background:`radial-gradient(circle,${c}30 20%,#111 21%,#222 50%,#111 51%)`,color:c}}
              animate={{rotate:isPlay?360:0}} transition={{duration:2,repeat:isPlay?Infinity:0,ease:'linear'}}>
              {p.position}
            </motion.div>
            <span className="flex-1 text-xs text-white/60">{p.full_name}</span>
            <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
            <span className="text-[10px]">{isPlay?'⏸':'▶'}</span>
          </div>
        );
      })}
    </div>
  );
}

function Design46() { // Traffic lights
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const tier=p.exact_hits_count>=10?'green':p.exact_hits_count>=6?'yellow':'red';
        const c={green:'#4ade80',yellow:'#fbbf24',red:'#f87171'}[tier];
        return (
          <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
            <span className="font-black text-sm w-5" style={{color:MEDAL[p.position]||'#64748b'}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/60">{p.full_name}</span>
            <div className="flex gap-1 items-center">
              {['red','yellow','green'].map(t=>(
                <motion.div key={t} className="w-2.5 h-2.5 rounded-full"
                  style={{background:t===tier?{red:'#f87171',yellow:'#fbbf24',green:'#4ade80'}[t]:'rgba(255,255,255,0.08)'}}
                  animate={t===tier?{scale:[1,1.2,1]}:{}} transition={{duration:1,repeat:Infinity}}/>
              ))}
            </div>
            <span className="text-sm font-black ml-1" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

function Design47() { // Constellation
  const pts=DEMO_DATA.map((p,i)=>({x:15+i*22,y:50-(p.exact_hits_count/MAX)*40,c:MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80'),p}));
  return (
    <div className="space-y-2">
      <svg width="160" height="70" viewBox="0 0 160 70">
        {pts.map((a,i)=>pts.slice(i+1).map((b,j)=>i<3&&j<2&&(
          <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        )))}
        {pts.map((pt,i)=>(
          <g key={i}>
            <motion.circle cx={pt.x} cy={pt.y} r="4" fill={pt.c} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.1}}/>
            <motion.circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke={pt.c} strokeWidth="0.5" opacity="0.3"
              animate={{r:[6,10,6]}} transition={{duration:2,delay:i*0.3,repeat:Infinity}}/>
            <text x={pt.x} y={pt.y+16} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7">{pt.p.full_name.split(' ')[0]}</text>
          </g>
        ))}
      </svg>
      <div className="space-y-1">{DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return <div key={i} className="flex justify-between text-[10px] px-1"><span style={{color:c}}>{p.position}. {p.full_name}</span><span className="font-bold" style={{color:c}}>{p.exact_hits_count}🎯</span></div>;
      })}</div>
    </div>
  );
}

function Design48() { // Glow cards hover
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <motion.div key={i} className="rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer"
            style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}
            whileHover={{background:`${c}0d`,border:`1px solid ${c}40`,boxShadow:`0 0 20px ${c}15`,scale:1.02}}
            transition={{duration:0.2}}>
            <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{background:`${c}15`,color:c}} whileHover={{background:`${c}30`,rotate:5}}>
              {p.position}
            </motion.div>
            <span className="flex-1 text-sm text-white/65">{p.full_name}{p.is_current_user?' 👤':''}</span>
            <motion.span className="font-black" style={{color:c}} whileHover={{scale:1.2}}>{p.exact_hits_count}🎯</motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Design49() { // Stock ticker style
  return (
    <div className="rounded-xl overflow-hidden" style={{background:'#020408',border:'1px solid rgba(16,185,129,0.2)'}}>
      <div className="flex gap-1 px-2 py-1.5 border-b" style={{borderColor:'rgba(16,185,129,0.1)'}}>
        {['NAME','HITS','%','RANK'].map(h=><span key={h} className="flex-1 text-center text-[9px] font-bold text-white/20">{h}</span>)}
      </div>
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#10b981');
        const up=p.exact_hits_count>5;
        return (
          <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.1}}
            className="flex gap-1 px-2 py-1.5 border-b last:border-0" style={{borderColor:'rgba(16,185,129,0.05)'}}>
            <span className="flex-1 text-[10px] text-white/60 truncate">{p.full_name.split(' ')[0]}</span>
            <span className="flex-1 text-center text-[11px] font-black" style={{color:c}}>{p.exact_hits_count}</span>
            <span className="flex-1 text-center text-[10px]" style={{color:up?'#4ade80':'#f87171'}}>{up?'▲':'▼'}{(p.exact_hits_count/p.total_predictions_count*100).toFixed(0)}%</span>
            <span className="flex-1 text-center text-[10px] text-white/40">#{p.position}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Design50() { // Parallax depth 3D
  const [mouse,setMouse]=useState({x:0,y:0});
  return (
    <div className="space-y-2" onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();setMouse({x:(e.clientX-r.left)/r.width-0.5,y:(e.clientY-r.top)/r.height-0.5});}}>
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const depth=1+i*0.3;
        return (
          <motion.div key={i} className="rounded-xl px-3 py-2.5 flex items-center gap-3 cursor-pointer"
            style={{background:`${c}0a`,border:`1px solid ${c}25`,transformStyle:'preserve-3d'}}
            animate={{x:mouse.x*depth*8,y:mouse.y*depth*4}}
            transition={{type:'spring',stiffness:200,damping:20}}>
            <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/60">{p.full_name}</span>
            <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Design51() { // Scanlines
  return (
    <div className="rounded-xl overflow-hidden relative" style={{background:'#020508',border:'1px solid rgba(0,200,255,0.2)'}}>
      <div className="absolute inset-0 pointer-events-none" style={{background:'repeating-linear-gradient(0deg,rgba(0,0,0,0.3) 0px,rgba(0,0,0,0.3) 1px,transparent 1px,transparent 3px)',zIndex:1}}/>
      {DEMO_DATA.map((p,i)=>{
        const c=['#fbbf24','#c0c0c0','#cd7f32','#00cfff','#00ff88','#ff6bff','#ff8c00'][i];
        return (
          <motion.div key={i} initial={{x:-30,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:i*0.08}}
            className="relative z-10 flex items-center justify-between px-3 py-2 border-b last:border-0" style={{borderColor:'rgba(0,200,255,0.08)'}}>
            <span className="text-[10px] font-mono" style={{color:`${c}70`}}>{String(i+1).padStart(2,'0')}</span>
            <span className="text-[11px] font-mono" style={{color:`${c}cc`}}>{p.full_name.toUpperCase()}</span>
            <span className="text-sm font-black font-mono" style={{color:c,textShadow:`0 0 6px ${c}`}}>{p.exact_hits_count}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Design52() { // Emoji explode on click
  const [explode,setExplode]=useState({});
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="relative">
            <motion.div className="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer"
              style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}25`}}
              onClick={()=>{setExplode(e=>({...e,[i]:Date.now()}));}}
              whileTap={{scale:0.96}}>
              <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
              <span className="flex-1 text-xs text-white/60">{p.full_name}</span>
              <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
            </motion.div>
            {explode[i]&&Array.from({length:p.exact_hits_count}).slice(0,6).map((_,j)=>(
              <motion.span key={`${explode[i]}-${j}`} className="absolute text-sm pointer-events-none" style={{left:'70%',top:'0%',zIndex:20}}
                initial={{x:0,y:0,opacity:1}} animate={{x:(Math.random()-0.5)*60,y:-Math.random()*50,opacity:0,scale:1.5}}
                transition={{duration:0.6,delay:j*0.05}}>🎯</motion.span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function Design53() { // Gradient mesh
  return (
    <div className="space-y-1.5 p-3 rounded-xl" style={{background:'radial-gradient(at 0% 0%,rgba(251,191,36,0.1),transparent 50%),radial-gradient(at 100% 100%,rgba(74,222,128,0.1),transparent 50%),rgba(5,8,18,0.97)',border:'1px solid rgba(255,255,255,0.08)'}}>
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.07}}
            className="flex items-center gap-3 rounded-xl px-3 py-2"
            style={{background:'rgba(255,255,255,0.04)',backdropFilter:'blur(8px)',border:`1px solid ${c}20`}}
            whileHover={{background:'rgba(255,255,255,0.08)'}}>
            <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/60">{p.full_name}{p.is_current_user?' 👤':''}</span>
            <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Design54() { // Celebration banner
  return (
    <div className="space-y-2">
      {DEMO_DATA.slice(0,3).map((p,i)=>{
        const c=MEDAL[p.position];
        const crowns=['👑','🥈','🥉'];
        return (
          <motion.div key={i} initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:i*0.2,type:'spring',stiffness:200}}
            className="rounded-2xl overflow-hidden relative" style={{border:`2px solid ${c}60`}}>
            <div className="absolute inset-0" style={{background:`linear-gradient(135deg,${c}20,${c}05)`}}/>
            <div className="relative flex items-center gap-3 px-4 py-3">
              <motion.span className="text-2xl" animate={{rotate:[0,-10,10,-10,0]}} transition={{delay:i*0.2+1,duration:0.5}}>{crowns[i]}</motion.span>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{p.full_name}</p>
                <div className="flex gap-1 mt-0.5">{Array.from({length:Math.min(p.exact_hits_count,10)}).map((_,j)=>(
                  <motion.span key={j} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.2+j*0.05}} className="text-[10px]">🎯</motion.span>
                ))}</div>
              </div>
              <motion.p className="text-3xl font-black" style={{color:c}} animate={{scale:[1,1.1,1]}} transition={{delay:i*0.2+0.5,duration:0.3}}>{p.exact_hits_count}</motion.p>
            </div>
          </motion.div>
        );
      })}
      {DEMO_DATA.slice(3).map((p,i)=>(
        <div key={i} className="flex items-center justify-between px-3 py-1.5 text-xs">
          <span className="text-white/40">{p.position}. {p.full_name}</span>
          <span className="font-bold text-white/60">{p.exact_hits_count}</span>
        </div>
      ))}
    </div>
  );
}

function Design55() { // Interactive sort
  const [sort,setSort]=useState('hits');
  const sorted=[...DEMO_DATA].sort((a,b)=>sort==='hits'?b.exact_hits_count-a.exact_hits_count:sort==='pct'?(b.exact_hits_count/b.total_predictions_count)-(a.exact_hits_count/a.total_predictions_count):a.position-b.position);
  return (
    <div className="space-y-2">
      <div className="flex gap-1 p-1 rounded-xl" style={{background:'rgba(255,255,255,0.04)'}}>
        {[['hits','פגיעות'],['pct','%'],['rank','דירוג']].map(([k,l])=>(
          <button key={k} onClick={()=>setSort(k)} className="flex-1 py-1 rounded-lg text-[10px] font-semibold transition-all"
            style={{background:sort===k?'rgba(255,255,255,0.12)':'transparent',color:sort===k?'white':'rgba(255,255,255,0.4)'}}>
            {l}
          </button>
        ))}
      </div>
      <AnimatePresence mode="popLayout">
        {sorted.map((p)=>{
          const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
          return (
            <motion.div key={p.full_name} layout initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
              className="flex items-center gap-3 rounded-xl px-3 py-2"
              style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}20`}}>
              <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
              <span className="flex-1 text-xs text-white/60">{p.full_name}</span>
              <span className="text-xs font-bold text-white/40">{(p.exact_hits_count/p.total_predictions_count*100).toFixed(0)}%</span>
              <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function Design56() { // Pixel blocks
  return (
    <div className="space-y-2" style={{fontFamily:'monospace'}}>
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] w-4 font-bold" style={{color:c}}>{p.position}</span>
            <span className="text-[10px] w-16 text-white/50 truncate">{p.full_name.split(' ')[0]}</span>
            <div className="flex gap-0.5 flex-1">
              {Array.from({length:MAX}).map((_,j)=>(
                <motion.div key={j} className="w-2 h-4 rounded-[1px]"
                  style={{background:j<p.exact_hits_count?c:'rgba(255,255,255,0.05)'}}
                  initial={{scaleY:0,opacity:0}} animate={{scaleY:1,opacity:1}} transition={{delay:i*0.05+j*0.04,type:'spring'}}/>
              ))}
            </div>
            <span className="text-[10px] font-black w-4 text-right" style={{color:c}}>{p.exact_hits_count}</span>
          </div>
        );
      })}
    </div>
  );
}

function Design57() { // Countdown timer style
  const [tick,setTick]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>setTick(t=>t+1),1000);return()=>clearInterval(iv);},[]);
  return (
    <div className="space-y-2">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const flash=tick%2===0&&i===0;
        return (
          <div key={i} className="rounded-xl flex items-center gap-3 px-3 py-2" style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${c}${flash?'60':'20'}`}}>
            <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/60">{p.full_name}</span>
            <div className="flex gap-1 items-center">
              <span className="rounded px-1.5 py-0.5 text-sm font-black font-mono" style={{background:`${c}20`,color:c}}>{String(Math.floor(p.exact_hits_count/10)).padStart(1,'0')}</span>
              <span className="text-white/30 text-xs">:</span>
              <span className="rounded px-1.5 py-0.5 text-sm font-black font-mono" style={{background:`${c}20`,color:c}}>{String(p.exact_hits_count%10).padStart(1,'0')}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Design58() { // Aurora background
  return (
    <div className="space-y-1.5 p-3 rounded-xl overflow-hidden relative" style={{background:'rgba(3,6,15,0.97)',border:'1px solid rgba(100,200,255,0.15)'}}>
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(at 20% 30%,rgba(59,130,246,0.15) 0%,transparent 50%),radial-gradient(at 80% 70%,rgba(16,185,129,0.12) 0%,transparent 50%)'}}/>
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        return (
          <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            className="relative z-10 flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer"
            style={{background:'rgba(255,255,255,0.04)',backdropFilter:'blur(8px)',border:`1px solid rgba(255,255,255,0.07)`}}
            whileHover={{background:'rgba(255,255,255,0.08)',boxShadow:`0 0 15px ${c}15`}}>
            <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/60">{p.full_name}{p.is_current_user?' 👤':''}</span>
            <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Design59() { // Expanding detail
  const [sel,setSel]=useState(null);
  return (
    <div className="space-y-1.5">
      {DEMO_DATA.map((p,i)=>{
        const c=MEDAL[p.position]||(p.is_current_user?'#60a5fa':'#4ade80');
        const open=sel===i;
        return (
          <motion.div key={i} layout className="rounded-xl overflow-hidden cursor-pointer"
            style={{border:`1px solid ${open?c+'50':'rgba(255,255,255,0.07)'}`}}
            onClick={()=>setSel(open?null:i)}>
            <motion.div layout className="flex items-center gap-3 px-3 py-2" style={{background:open?`${c}10`:'rgba(255,255,255,0.03)'}}>
              <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
              <span className="flex-1 text-xs text-white/65">{p.full_name}</span>
              <motion.span className="text-sm font-black" style={{color:c}} animate={{scale:open?1.2:1}}>{p.exact_hits_count}🎯</motion.span>
              <motion.span className="text-white/20 text-[10px]" animate={{rotate:open?180:0}}>▼</motion.span>
            </motion.div>
            <AnimatePresence>
              {open&&(
                <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}}
                  className="px-4 pb-3 pt-1 overflow-hidden">
                  <div className="flex gap-4 text-xs">
                    <div><p className="text-white/30">ניחושים</p><p className="font-bold text-white">{p.total_predictions_count}</p></div>
                    <div><p className="text-white/30">דיוק</p><p className="font-bold" style={{color:c}}>{(p.exact_hits_count/p.total_predictions_count*100).toFixed(0)}%</p></div>
                    <div><p className="text-white/30">מיקום</p><p className="font-bold text-white">#{p.position}</p></div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
                    <motion.div className="h-full rounded-full" style={{background:c}} initial={{width:0}} animate={{width:`${(p.exact_hits_count/MAX)*100}%`}} transition={{duration:0.5}}/>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

function Design60() { // Rainbow gradient rows
  return (
    <div className="space-y-1 rounded-xl overflow-hidden" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
      {DEMO_DATA.map((p,i)=>{
        const hue=(i/DEMO_DATA.length)*280;
        const c=`hsl(${hue},80%,65%)`;
        return (
          <motion.div key={i} initial={{x:50,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:i*0.07,type:'spring',stiffness:200}}
            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer relative overflow-hidden"
            style={{background:`hsl(${hue},50%,8%)`}} whileHover={{paddingLeft:'24px'}}>
            <div className="absolute left-0 inset-y-0 w-0.5" style={{background:c}}/>
            <span className="font-black text-sm w-5" style={{color:c}}>{p.position}</span>
            <span className="flex-1 text-xs text-white/65">{p.full_name}{p.is_current_user?' 👤':''}</span>
            <span className="font-black text-sm" style={{color:c}}>{p.exact_hits_count}🎯</span>
          </motion.div>
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
  { id:11, name:'Stagger Bounce',              component:<Design11/> },
  { id:12, name:'Count-up Numbers',            component:<Design12/> },
  { id:13, name:'Flip Cards',                  component:<Design13/> },
  { id:14, name:'Liquid Fill Bars',            component:<Design14/> },
  { id:15, name:'Particle Burst',              component:<Design15/> },
  { id:16, name:'Retro Scoreboard',            component:<Design16/> },
  { id:17, name:'Pulse Ring',                  component:<Design17/> },
  { id:18, name:'Typewriter Names',            component:<Design18/> },
  { id:19, name:'Spotlight Hover',             component:<Design19/> },
  { id:20, name:'DNA Dots',                    component:<Design20/> },
  { id:21, name:'Star Rating',                 component:<Design21/> },
  { id:22, name:'Wave Bars',                   component:<Design22/> },
  { id:23, name:'Card Reveal',                 component:<Design23/> },
  { id:24, name:'Sliding Rank',                component:<Design24/> },
  { id:25, name:'Confetti Row',                component:<Design25/> },
  { id:26, name:'Heartbeat',                   component:<Design26/> },
  { id:27, name:'Radar Chart',                 component:<Design27/> },
  { id:28, name:'Neon Sign Flicker',           component:<Design28/> },
  { id:29, name:'Stack Reveal',                component:<Design29/> },
  { id:30, name:'Holographic Shimmer',         component:<Design30/> },
  { id:31, name:'Orbit Circles',               component:<Design31/> },
  { id:32, name:'Accordion Expand',            component:<Design32/> },
  { id:33, name:'Morphing Rings',              component:<Design33/> },
  { id:34, name:'Trophy Shelf',                component:<Design34/> },
  { id:35, name:'Speed Gauge Bars',            component:<Design35/> },
  { id:36, name:'Chat Bubbles',                component:<Design36/> },
  { id:37, name:'Instagram Stories',           component:<Design37/> },
  { id:38, name:'Matrix Rain',                 component:<Design38/> },
  { id:39, name:'Dice Roll',                   component:<Design39/> },
  { id:40, name:'Slot Machine',                component:<Design40/> },
  { id:41, name:'Glitch Effect',               component:<Design41/> },
  { id:42, name:'Fire Intensity',              component:<Design42/> },
  { id:43, name:'Morse Code',                  component:<Design43/> },
  { id:44, name:'Neon Tube',                   component:<Design44/> },
  { id:45, name:'Vinyl Record',                component:<Design45/> },
  { id:46, name:'Traffic Lights',              component:<Design46/> },
  { id:47, name:'Constellation',               component:<Design47/> },
  { id:48, name:'Glow Hover Cards',            component:<Design48/> },
  { id:49, name:'Stock Ticker',                component:<Design49/> },
  { id:50, name:'Parallax 3D',                 component:<Design50/> },
  { id:51, name:'Scanlines',                   component:<Design51/> },
  { id:52, name:'Emoji Explode',               component:<Design52/> },
  { id:53, name:'Gradient Mesh',               component:<Design53/> },
  { id:54, name:'Celebration Banner',          component:<Design54/> },
  { id:55, name:'Interactive Sort',            component:<Design55/> },
  { id:56, name:'Pixel Blocks',                component:<Design56/> },
  { id:57, name:'Countdown Style',             component:<Design57/> },
  { id:58, name:'Aurora Background',           component:<Design58/> },
  { id:59, name:'Expanding Detail',            component:<Design59/> },
  { id:60, name:'Rainbow Gradient Rows',       component:<Design60/> },
];

export default function AdminExactHitsDemo() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="text-white space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><Target className="w-6 h-6 text-green-400"/>Exact Hits — 60 עיצובים</h2>
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
