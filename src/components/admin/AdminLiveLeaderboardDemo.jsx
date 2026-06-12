import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Zap, ChevronRight, Eye, EyeOff } from "lucide-react";

// ── נתוני דמו ──────────────────────────────────────────────────────────────
const OFFICIAL = [
  { id: 1, name: 'דימה',  pts: 11.35 },
  { id: 2, name: 'יקיר',  pts: 11.35 },
  { id: 3, name: 'מוטי',  pts:  4.85 },
  { id: 4, name: 'אלי',   pts:  4.85 },
  { id: 5, name: 'יוסי',  pts:  3.10 },
  { id: 6, name: 'טופחי', pts:  1.50 },
  { id: 7, name: 'יבין',  pts: 11.35 },
  { id: 8, name: 'נאנם',  pts: 11.35 },
  { id: 9, name: 'שי',    pts:  1.50 },
];
const LIVE_BONUS = { 1:35.75, 2:35.75, 3:35.75, 4:35.75, 5:35.75, 6:35.75, 7:1.9, 8:1.9, 9:1.9 };

const officialSorted = [...OFFICIAL].sort((a,b) => b.pts - a.pts).map((p,i) => ({ ...p, rank: i+1 }));
const officialRankMap = {}; officialSorted.forEach(p => { officialRankMap[p.id] = p.rank; });

const liveSorted = [...OFFICIAL]
  .map(p => ({ ...p, bonus: LIVE_BONUS[p.id]||0, total: p.pts+(LIVE_BONUS[p.id]||0) }))
  .sort((a,b) => b.total - a.total)
  .map((p,i) => ({ ...p, liveRank: i+1, delta: officialRankMap[p.id] - (i+1) }));

const liveRankMap = {}; liveSorted.forEach(p => { liveRankMap[p.id] = p; });

const MEDAL = { 1:'🥇', 2:'🥈', 3:'🥉' };
const rankBg = r => r===1?'linear-gradient(135deg,rgba(250,204,21,.22),rgba(245,158,11,.22))':r===2?'linear-gradient(135deg,rgba(209,213,219,.18),rgba(156,163,175,.18))':r===3?'linear-gradient(135deg,rgba(245,158,11,.20),rgba(217,119,6,.20))':'rgba(30,41,59,.60)';
const rankBorder = r => r===1?'#FFD700':r===2?'#D1D5DB':r===3?'#D97706':'#475569';

function LiveChip({ score='1–1', min='67' }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold w-fit"
      style={{ background:'rgba(16,185,129,.12)', border:'1px solid rgba(16,185,129,.3)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      <span className="text-emerald-400">קוריאה {score} צ'כיה</span>
      <span className="text-slate-500">{min}'</span>
    </div>
  );
}

function DeltaIcon({ d }) {
  if (d > 0) return <span className="flex items-center gap-0.5 text-emerald-400 text-[11px] font-bold"><TrendingUp className="w-3 h-3"/>+{d}</span>;
  if (d < 0) return <span className="flex items-center gap-0.5 text-red-400 text-[11px] font-bold"><TrendingDown className="w-3 h-3"/>{d}</span>;
  return <Minus className="w-3 h-3 text-slate-600"/>;
}

// ══ 1 — טוגל ════════════════════════════════════════════════════════════════
function Opt1() {
  const [live, setLive] = useState(false);
  const rows = live ? liveSorted.map(p=>({...p,rank:p.liveRank,display:p.total})) : officialSorted.map(p=>({...p,display:p.pts}));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <LiveChip/>
        <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          {[false,true].map(m=>(
            <button key={String(m)} onClick={()=>setLive(m)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${live===m?'bg-amber-400 text-black':'text-slate-400 hover:text-white'}`}>
              {m?'🔴 לייב':'רשמי'}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={String(live)} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-1.5">
          {rows.map(p=>(
            <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{background:rankBg(p.rank),border:`1px solid ${rankBorder(p.rank)}40`}}>
              <span className="text-sm w-6 text-center">{MEDAL[p.rank]||p.rank}</span>
              <span className="text-white text-sm flex-1">{p.name}</span>
              <span className="font-bold text-sm tabular-nums text-white">{p.display.toFixed(2)}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ══ 2 — חצים ════════════════════════════════════════════════════════════════
function Opt2() {
  return (
    <div className="space-y-3">
      <LiveChip/>
      <div className="space-y-1.5">
        {officialSorted.map(p=>{
          const d = liveRankMap[p.id]?.delta||0;
          return (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{background:rankBg(p.rank),border:`1px solid ${rankBorder(p.rank)}40`}}>
              <span className="text-sm w-6 text-center">{MEDAL[p.rank]||p.rank}</span>
              <span className="text-white text-sm flex-1">{p.name}</span>
              <span className="font-bold text-sm tabular-nums text-white">{p.pts.toFixed(2)}</span>
              <div className="w-10 flex justify-end"><DeltaIcon d={d}/></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══ 3 — פאנל צד ══════════════════════════════════════════════════════════════
function Opt3() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><LiveChip/></div>
      <div className="space-y-1.5">
        {officialSorted.slice(0,4).map(p=>(
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{background:rankBg(p.rank),border:`1px solid ${rankBorder(p.rank)}40`}}>
            <span className="text-sm w-6 text-center">{MEDAL[p.rank]||p.rank}</span>
            <span className="text-white text-sm flex-1">{p.name}</span>
            <span className="font-bold text-sm text-white">{p.pts.toFixed(2)}</span>
          </div>
        ))}
        <p className="text-slate-600 text-[10px] text-center">... עוד 5</p>
      </div>
      <button onClick={()=>setOpen(true)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl"
        style={{background:'linear-gradient(135deg,rgba(16,185,129,.1),rgba(5,13,26,.8))',border:'1px solid rgba(16,185,129,.3)'}}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
          <span className="text-emerald-400 text-sm font-bold">טבלה לייב</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400"/>
      </button>
      <AnimatePresence>
        {open && <>
          <motion.div className="fixed inset-0 z-40 bg-black/50" onClick={()=>setOpen(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/>
          <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',stiffness:300,damping:30}}
            className="fixed inset-y-0 right-0 w-64 z-50 flex flex-col"
            style={{background:'rgba(5,10,20,.95)',backdropFilter:'blur(28px)',borderLeft:'1px solid rgba(16,185,129,.2)'}}>
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"/>
            <div className="px-4 pt-4 pb-3 border-b border-white/8 flex items-center justify-between">
              <div><p className="text-white font-bold">טבלה לייב ⚡</p><p className="text-emerald-400 text-xs">קוריאה 1–1 צ'כיה · 67'</p></div>
              <button onClick={()=>setOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {liveSorted.map(p=>(
                <div key={p.id} className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                  style={{background:rankBg(p.liveRank),border:`1px solid ${rankBorder(p.liveRank)}30`}}>
                  <span className="text-sm w-5 text-center">{MEDAL[p.liveRank]||p.liveRank}</span>
                  <span className="text-white text-sm flex-1">{p.name}</span>
                  <span className="text-emerald-400 text-xs font-bold">{p.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-600 text-[10px] text-center py-2">⚡ זמני · לא נשמר</p>
          </motion.div>
        </>}
      </AnimatePresence>
    </div>
  );
}

// ══ 4 — באנר ═════════════════════════════════════════════════════════════════
function Opt4() {
  const leader = liveSorted[0];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{background:'linear-gradient(135deg,rgba(16,185,129,.08),rgba(5,13,26,.9))',border:'1px solid rgba(16,185,129,.2)'}}>
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"/>
        <p className="text-sm text-slate-300">
          אם קוריאה 1–1 תישמר — <span className="text-emerald-400 font-bold">{leader.name}</span> יוביל עם <span className="text-white font-bold">{leader.total.toFixed(2)}</span>
        </p>
      </div>
      <div className="space-y-1.5">
        {officialSorted.map(p=>(
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{background:rankBg(p.rank),border:`1px solid ${rankBorder(p.rank)}40`}}>
            <span className="text-sm w-6 text-center">{MEDAL[p.rank]||p.rank}</span>
            <span className="text-white text-sm flex-1">{p.name}</span>
            <span className="font-bold text-sm text-white">{p.pts.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══ 5 — מקבילי ═══════════════════════════════════════════════════════════════
function Opt5() {
  return (
    <div className="space-y-3">
      <LiveChip/>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-2 py-2 bg-slate-800/60 border-b border-slate-700 text-center text-xs font-bold text-slate-300">📋 רשמי</div>
          <div className="p-1.5 space-y-1">
            {officialSorted.map(p=>(
              <div key={p.id} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{background:rankBg(p.rank)}}>
                <span className="text-xs w-4">{MEDAL[p.rank]||p.rank}</span>
                <span className="text-white text-xs flex-1 truncate">{p.name}</span>
                <span className="text-slate-300 text-xs">{p.pts.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl overflow-hidden" style={{border:'1px solid rgba(16,185,129,.3)'}}>
          <div className="px-2 py-2 border-b border-emerald-900/40 text-center text-xs font-bold text-emerald-400" style={{background:'rgba(16,185,129,.08)'}}>⚡ לייב</div>
          <div className="p-1.5 space-y-1">
            {liveSorted.map(p=>(
              <div key={p.id} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{background:rankBg(p.liveRank)}}>
                <span className="text-xs w-4">{MEDAL[p.liveRank]||p.liveRank}</span>
                <span className="text-white text-xs flex-1 truncate">{p.name}</span>
                <span className="text-emerald-400 text-xs font-bold">{p.total.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══ 6 — אנימציית מיזוג (שורות זזות למקום) ════════════════════════════════
function Opt6() {
  const [live, setLive] = useState(false);
  const rows = live
    ? liveSorted.map(p=>({...p, rank:p.liveRank, display:p.total, color:'#34d399'}))
    : officialSorted.map(p=>({...p, display:p.pts, color:'#fff'}));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <LiveChip/>
        <button onClick={()=>setLive(v=>!v)}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${live?'border-emerald-500/40 text-emerald-400 bg-emerald-500/10':'border-slate-600 text-slate-400 bg-slate-800'}`}>
          {live?'⚡ לייב — לחץ לרשמי':'לחץ ללייב'}
        </button>
      </div>
      <div className="relative space-y-1.5">
        <AnimatePresence>
          {rows.map(p=>(
            <motion.div key={p.id}
              layout
              layoutId={`row-${p.id}`}
              initial={false}
              animate={{opacity:1}}
              transition={{type:'spring',stiffness:400,damping:35}}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{background:rankBg(p.rank),border:`1px solid ${rankBorder(p.rank)}40`}}>
              <motion.span className="text-sm w-6 text-center" layout>{MEDAL[p.rank]||p.rank}</motion.span>
              <span className="text-white text-sm flex-1">{p.name}</span>
              <motion.span className="font-bold text-sm tabular-nums" animate={{color:p.color}} transition={{duration:.4}}>
                {p.display.toFixed(2)}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p className="text-slate-600 text-[10px] text-center">השורות זזות למקום החדש עם אנימציה</p>
    </div>
  );
}

// ══ 7 — גילוי דרמטי (reveal) ════════════════════════════════════════════════
function Opt7() {
  const [revealed, setRevealed] = useState(false);
  const [revealIdx, setRevealIdx] = useState(-1);
  const revealAll = () => {
    setRevealed(true);
    liveSorted.forEach((_,i) => {
      setTimeout(()=>setRevealIdx(i), (liveSorted.length-1-i)*180);
    });
  };
  const reset = () => { setRevealed(false); setRevealIdx(-1); };
  return (
    <div className="space-y-3">
      <LiveChip/>
      {!revealed ? (
        <button onClick={revealAll} className="w-full py-3 rounded-xl font-bold text-sm transition-all"
          style={{background:'linear-gradient(135deg,#f5c518,#fde68a)',color:'#000'}}>
          🎬 גלה טבלה לייב
        </button>
      ) : (
        <button onClick={reset} className="text-slate-500 text-xs underline w-full text-center">אפס</button>
      )}
      <div className="space-y-1.5">
        {[...liveSorted].reverse().map((p,i)=>{
          const realIdx = liveSorted.length-1-i;
          const show = revealIdx >= realIdx;
          return (
            <AnimatePresence key={p.id}>
              {show && (
                <motion.div initial={{opacity:0,x:40,scale:.95}} animate={{opacity:1,x:0,scale:1}}
                  transition={{type:'spring',stiffness:350,damping:28}}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{background:rankBg(p.liveRank),border:`1px solid ${rankBorder(p.liveRank)}60`}}>
                  <span className="text-lg w-6 text-center">{MEDAL[p.liveRank]||p.liveRank}</span>
                  <span className="text-white text-sm flex-1">{p.name}</span>
                  <span className="font-bold text-sm text-emerald-400">{p.total.toFixed(2)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
}

// ══ 8 — פס פרוגרס (שורה מתמלאת) ═════════════════════════════════════════════
function Opt8() {
  const [live, setLive] = useState(false);
  const maxPts = Math.max(...liveSorted.map(p=>p.total));
  const rows = live ? liveSorted.map(p=>({...p,rank:p.liveRank,val:p.total,max:maxPts}))
                    : officialSorted.map(p=>({...p,val:p.pts,max:officialSorted[0].pts}));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <LiveChip/>
        <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          {[false,true].map(m=>(
            <button key={String(m)} onClick={()=>setLive(m)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${live===m?'bg-amber-400 text-black':'text-slate-400'}`}>
              {m?'🔴 לייב':'רשמי'}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {rows.map(p=>(
          <div key={p.id} className="space-y-0.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium">{MEDAL[p.rank]||p.rank} {p.name}</span>
              <span className={live?'text-emerald-400 font-bold':'text-slate-300'}>{p.val.toFixed(2)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
              <motion.div className="h-full rounded-full"
                animate={{width:`${Math.round(p.val/p.max*100)}%`}}
                transition={{duration:.6,ease:'easeOut'}}
                style={{background:live?'linear-gradient(90deg,#34d399,#6ee7b7)':'linear-gradient(90deg,#f5c518,#fde68a)'}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══ 9 — כרטיסי TOP 3 פודיום ══════════════════════════════════════════════════
function Opt9() {
  const [live, setLive] = useState(false);
  const top3 = live ? liveSorted.slice(0,3) : officialSorted.slice(0,3).map(p=>({...p,liveRank:p.rank,total:p.pts}));
  const rest = live ? liveSorted.slice(3) : officialSorted.slice(3).map(p=>({...p,liveRank:p.rank,total:p.pts}));
  const ORDER = [1,0,2];
  const HEIGHTS = {0:'h-16',1:'h-20',2:'h-12'};
  const podium = ORDER.map(i=>top3[i]).filter(Boolean);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <LiveChip/>
        <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          {[false,true].map(m=>(
            <button key={String(m)} onClick={()=>setLive(m)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${live===m?'bg-amber-400 text-black':'text-slate-400'}`}>
              {m?'🔴 לייב':'רשמי'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-end justify-center gap-2 pt-2">
        {podium.map((p,i)=>{
          const rank = ORDER[i]+1;
          const color = rank===1?'#FFD700':rank===2?'#C0C0C0':'#CD7F32';
          return (
            <motion.div key={p.id} layout className="flex flex-col items-center gap-1 flex-1">
              <span className="text-lg">{MEDAL[rank]}</span>
              <span className="text-white text-xs font-bold truncate w-full text-center">{p.name}</span>
              <span className="text-[10px] tabular-nums" style={{color}}>{(live?p.total:p.pts).toFixed(1)}</span>
              <motion.div className={`w-full rounded-t-lg ${HEIGHTS[i]}`} layout
                style={{background:`linear-gradient(180deg,${color}33,${color}11)`,border:`1px solid ${color}40`,borderBottom:'none'}}/>
            </motion.div>
          );
        })}
      </div>
      <div className="space-y-1">
        {rest.map((p,i)=>(
          <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/40">
            <span className="text-slate-400 text-xs w-5 text-center">{(live?p.liveRank:p.rank)}</span>
            <span className="text-white text-sm flex-1">{p.name}</span>
            <span className="text-slate-300 text-xs">{(live?p.total:p.pts).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══ 10 — גלוי/סמוי (לחץ לחשוף) ════════════════════════════════════════════
function Opt10() {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-3">
      <LiveChip/>
      <div className="space-y-1.5">
        {officialSorted.map(p=>(
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{background:rankBg(p.rank),border:`1px solid ${rankBorder(p.rank)}40`}}>
            <span className="text-sm w-6 text-center">{MEDAL[p.rank]||p.rank}</span>
            <span className="text-white text-sm flex-1">{p.name}</span>
            <span className="font-bold text-sm text-white">{p.pts.toFixed(2)}</span>
            <AnimatePresence>
              {show && (
                <motion.span initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.8}}
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: liveRankMap[p.id]?.delta>0?'rgba(52,211,153,.15)':liveRankMap[p.id]?.delta<0?'rgba(239,68,68,.15)':'rgba(100,116,139,.15)',
                    color: liveRankMap[p.id]?.delta>0?'#34d399':liveRankMap[p.id]?.delta<0?'#f87171':'#64748b'
                  }}>
                  {liveRankMap[p.id]?.delta>0?`↑${liveRankMap[p.id].delta}`:liveRankMap[p.id]?.delta<0?`↓${Math.abs(liveRankMap[p.id].delta)}`:'='}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <button onClick={()=>setShow(v=>!v)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border border-slate-600 text-slate-400 hover:text-white hover:border-slate-500">
        {show?<><EyeOff className="w-4 h-4"/>הסתר לייב</>:<><Eye className="w-4 h-4"/>הצג שינויי לייב</>}
      </button>
    </div>
  );
}

// ══ 11 — ספירה מקורית (score counter בסגנון האפליקציה) ════════════════════
function Opt11() {
  const [live, setLive] = useState(false);
  const [key, setKey] = useState(0);
  const toggle = () => { setLive(v=>!v); setKey(k=>k+1); };
  const rows = live ? liveSorted.map(p=>({...p,rank:p.liveRank,val:p.total})) : officialSorted.map(p=>({...p,val:p.pts}));

  function AnimatedNum({val,color}) {
    const [display, setDisplay] = useState(0);
    useEffect(()=>{
      let start = 0; const end = val; const dur = 800; const step = 16;
      const inc = (end-start)/(dur/step);
      const iv = setInterval(()=>{ start+=inc; if(start>=end){setDisplay(end);clearInterval(iv);}else setDisplay(start); },step);
      return ()=>clearInterval(iv);
    },[val]);
    return <span className="font-black text-sm tabular-nums" style={{color}}>{display.toFixed(2)}</span>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <LiveChip/>
        <button onClick={toggle}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${live?'border-emerald-500/40 text-emerald-400 bg-emerald-500/10':'border-slate-600 text-slate-400 bg-slate-800'}`}>
          {live?'⚡ לייב':'הפעל לייב'}
        </button>
      </div>
      <div className="space-y-1.5">
        {rows.map(p=>(
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{background:rankBg(p.rank),border:`1px solid ${rankBorder(p.rank)}40`}}>
            <span className="text-sm w-6 text-center">{MEDAL[p.rank]||p.rank}</span>
            <span className="text-white text-sm flex-1">{p.name}</span>
            <AnimatedNum key={`${key}-${p.id}`} val={p.val} color={live?'#34d399':'#fff'}/>
          </div>
        ))}
      </div>
      <p className="text-slate-600 text-[10px] text-center">המספרים סופרים לערך החדש</p>
    </div>
  );
}

// ══ 12 — שורת מידע רוחבית (ticker) ══════════════════════════════════════════
function Opt12() {
  const text = liveSorted.map(p=>`${MEDAL[p.liveRank]||p.liveRank} ${p.name} ${p.total.toFixed(1)}`).join('   ·   ');
  return (
    <div className="space-y-3">
      {/* Ticker */}
      <div className="overflow-hidden rounded-xl py-2 px-0"
        style={{background:'linear-gradient(135deg,rgba(16,185,129,.08),rgba(5,13,26,.9))',border:'1px solid rgba(16,185,129,.2)'}}>
        <div className="flex items-center gap-3 mb-1 px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"/>
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">LIVE · קוריאה 1–1 צ'כיה · 67'</span>
        </div>
        <div className="overflow-hidden">
          <motion.div className="flex gap-4 whitespace-nowrap text-slate-300 text-xs px-3"
            animate={{x:[0,-600]}} transition={{duration:12,repeat:Infinity,ease:'linear'}}>
            <span>{text}</span><span className="opacity-50">{text}</span>
          </motion.div>
        </div>
      </div>
      {/* Official unchanged */}
      <div className="space-y-1.5">
        {officialSorted.map(p=>(
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{background:rankBg(p.rank),border:`1px solid ${rankBorder(p.rank)}40`}}>
            <span className="text-sm w-6 text-center">{MEDAL[p.rank]||p.rank}</span>
            <span className="text-white text-sm flex-1">{p.name}</span>
            <span className="font-bold text-sm text-white">{p.pts.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══ 13 — טייל (כרטיסי שחקן) ══════════════════════════════════════════════════
function Opt13() {
  const [live, setLive] = useState(false);
  const rows = live ? liveSorted.map(p=>({...p,rank:p.liveRank,val:p.total})) : officialSorted.map(p=>({...p,val:p.pts}));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <LiveChip/>
        <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          {[false,true].map(m=>(
            <button key={String(m)} onClick={()=>setLive(m)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${live===m?'bg-amber-400 text-black':'text-slate-400'}`}>
              {m?'🔴 לייב':'רשמי'}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {rows.map(p=>(
          <motion.div key={p.id} layout
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-center"
            style={{background:rankBg(p.rank),border:`1px solid ${rankBorder(p.rank)}40`}}>
            <span className="text-base">{MEDAL[p.rank]||`#${p.rank}`}</span>
            <span className="text-white text-xs font-semibold truncate w-full text-center">{p.name}</span>
            <span className={`text-xs font-bold tabular-nums ${live?'text-emerald-400':'text-slate-300'}`}>{p.val.toFixed(1)}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ══ 14 — מיני פוקוס "המשחק שלי" ════════════════════════════════════════════
function Opt14() {
  const ME = liveSorted.find(p=>p.id===1); // דימה = המשתמש הנוכחי
  const myOfficialRank = officialRankMap[ME.id];
  const bonus = ME.bonus;
  return (
    <div className="space-y-3">
      <LiveChip/>
      {/* My card — prominent */}
      <div className="p-4 rounded-2xl space-y-2" style={{background:'linear-gradient(135deg,rgba(245,197,24,.12),rgba(5,13,26,.9))',border:'1px solid rgba(245,197,24,.3)'}}>
        <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">המיקום שלי — לייב</p>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{MEDAL[ME.liveRank]||ME.liveRank}</span>
          <div className="flex-1">
            <p className="text-white font-bold">{ME.name}</p>
            <p className="text-emerald-400 text-sm font-bold">{ME.total.toFixed(2)} נק'</p>
          </div>
          {ME.liveRank < myOfficialRank && (
            <div className="text-center">
              <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto"/>
              <p className="text-emerald-400 text-xs font-bold">+{myOfficialRank-ME.liveRank}</p>
            </div>
          )}
        </div>
        {bonus > 0 && <p className="text-slate-400 text-xs">⚡ +{bonus} מהמשחק הנוכחי</p>}
      </div>
      {/* Others small */}
      <div className="space-y-1">
        {liveSorted.filter(p=>p.id!==ME.id).map(p=>(
          <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
            <span className="text-xs text-slate-500 w-4">{p.liveRank}</span>
            <span className="text-slate-300 text-xs flex-1">{p.name}</span>
            <span className="text-slate-400 text-xs">{p.total.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══ 15 — שינוי צבע רקע לפי מקום (heat map) ══════════════════════════════
function Opt15() {
  const [live, setLive] = useState(false);
  const official = officialSorted.map(p=>({...p,val:p.pts,heat:0}));
  const liveWithHeat = officialSorted.map(p=>{
    const lr = liveRankMap[p.id];
    return {...p,val:lr?.total||p.pts,heat:lr?.delta||0};
  }).sort((a,b)=>b.val-a.val).map((p,i)=>({...p,rank:i+1}));
  const rows = live ? liveWithHeat : official;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <LiveChip/>
        <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          {[false,true].map(m=>(
            <button key={String(m)} onClick={()=>setLive(m)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${live===m?'bg-amber-400 text-black':'text-slate-400'}`}>
              {m?'🔴 לייב':'רשמי'}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        {rows.map(p=>{
          const heatBg = !live ? rankBg(p.rank)
            : p.heat>0 ? 'linear-gradient(135deg,rgba(52,211,153,.18),rgba(5,13,26,.9))'
            : p.heat<0 ? 'linear-gradient(135deg,rgba(239,68,68,.12),rgba(5,13,26,.9))'
            : rankBg(p.rank);
          const heatBorder = !live ? `${rankBorder(p.rank)}40`
            : p.heat>0 ? 'rgba(52,211,153,.35)'
            : p.heat<0 ? 'rgba(239,68,68,.3)'
            : `${rankBorder(p.rank)}40`;
          return (
            <motion.div key={p.id} layout className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{background:heatBg,border:`1px solid ${heatBorder}`}}>
              <span className="text-sm w-6 text-center">{MEDAL[p.rank]||p.rank}</span>
              <span className="text-white text-sm flex-1">{p.name}</span>
              <span className={`font-bold text-sm tabular-nums ${live&&p.heat>0?'text-emerald-400':live&&p.heat<0?'text-red-400':'text-white'}`}>
                {p.val.toFixed(2)}
              </span>
            </motion.div>
          );
        })}
      </div>
      <p className="text-slate-600 text-[10px] text-center">ירוק = עולה · אדום = יורד · לפי תוצאה זמנית</p>
    </div>
  );
}

// ══ Main ════════════════════════════════════════════════════════════════════
const TABS = [
  { id:'1',  label:'טוגל',       component:<Opt1/> },
  { id:'2',  label:'חצים',       component:<Opt2/> },
  { id:'3',  label:'פאנל צד',    component:<Opt3/> },
  { id:'4',  label:'באנר',       component:<Opt4/> },
  { id:'5',  label:'מקבילי',     component:<Opt5/> },
  { id:'6',  label:'אנימציה',    component:<Opt6/> },
  { id:'7',  label:'גילוי',      component:<Opt7/> },
  { id:'8',  label:'פרוגרס',     component:<Opt8/> },
  { id:'9',  label:'פודיום',     component:<Opt9/> },
  { id:'10', label:'גלוי/סמוי',  component:<Opt10/> },
  { id:'11', label:'ספירה',      component:<Opt11/> },
  { id:'12', label:'טיקר',       component:<Opt12/> },
  { id:'13', label:'כרטיסים',    component:<Opt13/> },
  { id:'14', label:'המיקום שלי', component:<Opt14/> },
  { id:'15', label:'חום',        component:<Opt15/> },
];

export default function AdminLiveLeaderboardDemo() {
  const [active, setActive] = useState('1');
  const current = TABS.find(t=>t.id===active);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-purple-400"/>
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Live Leaderboard — דמו אפשרויות</h2>
          <p className="text-slate-400 text-sm">נתונים סטטיים לצורך השוואה בלבד</p>
        </div>
      </div>

      {/* Tab grid */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setActive(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              active===t.id
                ?'bg-purple-500/20 border-purple-500/40 text-purple-300'
                :'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}>
            <span className="text-slate-600 mr-1">#{t.id}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Demo */}
      <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5 max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.2}}>
            {current?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
