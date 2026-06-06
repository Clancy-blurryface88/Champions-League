import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, RotateCcw, Play } from "lucide-react";

// ── Sample data ───────────────────────────────────────────────────────────────
const DATA = [
  { rank:1, name:"יוסי כהן",   pts:87 },
  { rank:2, name:"מירי לוי",   pts:82 },
  { rank:3, name:"דני מזרחי",  pts:79 },
  { rank:4, name:"רחל אברהם",  pts:74 },
  { rank:5, name:"אבי שפירא",  pts:71 },
];
const PODIUM = [DATA[1], DATA[0], DATA[2]]; // 2–1–3 spatial order
const H = [76, 110, 56];                    // bar heights per podium slot

// ── Color helpers ─────────────────────────────────────────────────────────────
const G='#f59e0b', S='#94a3b8', B='#b45309';
const rc  = r => r===1?G:r===2?S:r===3?B:'rgba(255,255,255,0.28)';
const rb  = r => r===1?'rgba(245,158,11,0.1)':r===2?'rgba(148,163,184,0.07)':r===3?'rgba(180,83,9,0.1)':'rgba(255,255,255,0.03)';
const rbo = r => r===1?'rgba(245,158,11,0.28)':r===2?'rgba(148,163,184,0.2)':r===3?'rgba(180,83,9,0.22)':'rgba(255,255,255,0.07)';
const rglow = r => r===1?'rgba(245,158,11,0.3)':r===2?'rgba(148,163,184,0.15)':r===3?'rgba(180,83,9,0.25)':'transparent';

// Drama delays: 3rd → 2nd → 1st (last = most suspense)
const dd = r => r===3?0.1 : r===2?0.55 : 1.1;

const Bg = ({children, style={}}) => (
  <div style={{background:'#040408',minHeight:168,width:'100%',overflow:'hidden',position:'relative',...style}}>
    {children}
  </div>
);

const NumBadge = ({rank,size=28,style={}}) => (
  <div style={{width:size,height:size,borderRadius:'50%',background:rb(rank),border:`1.5px solid ${rbo(rank)}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,...style}}>
    <span style={{fontSize:size*0.45,fontWeight:900,color:rc(rank),lineHeight:1}}>{rank}</span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// V1 — Classic Bars (2-1-3, reveal 3→2→1)
// ════════════════════════════════════════════════════════════════════════════
const V1 = ({ revealed }) => (
  <Bg style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:6,padding:'8px 20px 0'}}>
    {PODIUM.map((e,i)=>(
      <motion.div key={e.rank} style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1,maxWidth:90}}
        initial={{y:90,opacity:0}} animate={revealed?{y:0,opacity:1}:{y:90,opacity:0}}
        transition={{delay:dd(e.rank),type:'spring',stiffness:180,damping:18}}>
        <div style={{textAlign:'center',marginBottom:5}}>
          <div style={{color:rc(e.rank),fontSize:10,fontWeight:700,maxWidth:78,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.name}</div>
          <div style={{color:rc(e.rank),fontSize:9,opacity:0.6}}>{e.pts} pts</div>
        </div>
        <div style={{width:'100%',height:H[i],background:rb(e.rank),border:`1.5px solid ${rbo(e.rank)}`,borderRadius:'6px 6px 0 0',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 -4px 20px ${rglow(e.rank)}`}}>
          <span style={{fontSize:32,fontWeight:900,color:rc(e.rank)}}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V2 — Glass Cards Podium
// ════════════════════════════════════════════════════════════════════════════
const V2 = ({ revealed }) => (
  <Bg style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:8,padding:'8px 16px 0'}}>
    {PODIUM.map((e,i)=>(
      <motion.div key={e.rank}
        initial={{y:80,opacity:0,scale:0.9}} animate={revealed?{y:0,opacity:1,scale:1}:{y:80,opacity:0,scale:0.9}}
        transition={{delay:dd(e.rank),type:'spring',stiffness:200,damping:22}}
        style={{flex:1,maxWidth:92,height:H[i]+50,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',
          background:`rgba(255,255,255,0.045)`,backdropFilter:'blur(20px)',border:`1px solid ${rbo(e.rank)}`,
          borderRadius:'10px 10px 0 0',boxShadow:`inset 0 1px 0 rgba(255,255,255,0.08), 0 -8px 24px ${rglow(e.rank)}`,padding:'8px 4px 10px'}}>
        <NumBadge rank={e.rank} size={30} style={{marginBottom:6}}/>
        <div style={{color:rc(e.rank),fontSize:10,fontWeight:700,textAlign:'center',maxWidth:80,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.name}</div>
        <div style={{color:rc(e.rank),fontSize:9,opacity:0.55,marginTop:2}}>{e.pts} pts</div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V3 — Neon Glow Podium
// ════════════════════════════════════════════════════════════════════════════
const V3 = ({ revealed }) => (
  <Bg style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:6,padding:'8px 16px 0'}}>
    {PODIUM.map((e,i)=>(
      <motion.div key={e.rank}
        initial={{y:70,opacity:0}} animate={revealed?{y:0,opacity:1}:{y:70,opacity:0}}
        transition={{delay:dd(e.rank),duration:0.5}}>
        <div style={{textAlign:'center',marginBottom:6}}>
          <div style={{color:rc(e.rank),fontSize:10,fontWeight:700,textShadow:`0 0 8px ${rc(e.rank)}`,maxWidth:80,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.name}</div>
          <div style={{color:rc(e.rank),fontSize:9,opacity:0.6}}>{e.pts}</div>
        </div>
        <div style={{width:80,height:H[i],background:'rgba(0,0,0,0.6)',border:`1.5px solid ${rc(e.rank)}`,borderRadius:'4px 4px 0 0',
          boxShadow:`0 0 12px ${rglow(e.rank)}, inset 0 0 12px ${rglow(e.rank)}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:30,fontWeight:900,color:rc(e.rank),textShadow:`0 0 16px ${rc(e.rank)}`}}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V4 — Card Flip (face-down → flip to reveal, 3→2→1)
// ════════════════════════════════════════════════════════════════════════════
const V4 = ({ revealed }) => (
  <Bg style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'16px'}}>
    {DATA.slice(0,3).map(e=>(
      <motion.div key={e.rank} style={{perspective:600,width:80,height:96}}>
        <motion.div
          animate={revealed ? {rotateY:0} : {rotateY:180}}
          transition={{delay:dd(e.rank),duration:0.7,ease:[0.23,1,0.32,1]}}
          style={{width:'100%',height:'100%',transformStyle:'preserve-3d',position:'relative'}}>
          {/* Back */}
          <div style={{position:'absolute',inset:0,background:rb(1),border:'1.5px solid rgba(255,255,255,0.1)',borderRadius:10,backfaceVisibility:'hidden',transform:'rotateY(180deg)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontSize:28,color:'rgba(255,255,255,0.15)',fontWeight:900}}>?</span>
          </div>
          {/* Front */}
          <div style={{position:'absolute',inset:0,background:rb(e.rank),border:`1.5px solid ${rbo(e.rank)}`,borderRadius:10,backfaceVisibility:'hidden',
            boxShadow:`0 4px 20px ${rglow(e.rank)}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
            <span style={{fontSize:30,fontWeight:900,color:rc(e.rank)}}>{e.rank}</span>
            <span style={{fontSize:9,fontWeight:700,color:rc(e.rank),textAlign:'center',maxWidth:68,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.name}</span>
            <span style={{fontSize:8,color:rc(e.rank),opacity:0.6}}>{e.pts} pts</span>
          </div>
        </motion.div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V5 — Columns Grow Up (bars animate height from 0)
// ════════════════════════════════════════════════════════════════════════════
const V5 = ({ revealed }) => (
  <Bg style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:6,padding:'8px 16px 0'}}>
    {PODIUM.map((e,i)=>(
      <div key={e.rank} style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1,maxWidth:90}}>
        <div style={{textAlign:'center',marginBottom:4,opacity:revealed?1:0,transition:`opacity 0.4s ${dd(e.rank)+0.3}s`}}>
          <div style={{color:rc(e.rank),fontSize:10,fontWeight:700}}>{e.name}</div>
          <div style={{color:rc(e.rank),fontSize:9,opacity:0.6}}>{e.pts}</div>
        </div>
        <motion.div
          initial={{height:0}} animate={revealed?{height:H[i]}:{height:0}}
          transition={{delay:dd(e.rank),duration:0.7,ease:[0.23,1,0.32,1]}}
          style={{width:'100%',background:rb(e.rank),border:`1.5px solid ${rbo(e.rank)}`,borderRadius:'6px 6px 0 0',
            display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:6,overflow:'hidden',
            boxShadow:`0 -4px 16px ${rglow(e.rank)}`}}>
          <span style={{fontSize:28,fontWeight:900,color:rc(e.rank)}}>{e.rank}</span>
        </motion.div>
      </div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V6 — Slot Machine Numbers (count-up then stop)
// ════════════════════════════════════════════════════════════════════════════
const V6 = ({ revealed }) => {
  const [vals, setVals] = useState([0,0,0]);
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!revealed) { setVals([0,0,0]); return; }
    const targets = [DATA[1].pts, DATA[0].pts, DATA[2].pts]; // podium order
    let counts = [0,0,0], settled = [false,false,false];
    let tick = 0;
    timerRef.current = setInterval(() => {
      tick++;
      setVals(prev => prev.map((v,i) => {
        if (settled[i]) return targets[i];
        const slowAt = i===1?40:i===0?25:15; // 1st slowest → most drama
        if (tick < slowAt) return Math.floor(Math.random()*100);
        const next = Math.min(v + Math.ceil((targets[i]-v)*0.25+1), targets[i]);
        if (next >= targets[i]) { settled[i]=true; return targets[i]; }
        return next;
      }));
      if (settled.every(Boolean)) clearInterval(timerRef.current);
    }, 80);
    return () => clearInterval(timerRef.current);
  }, [revealed]);

  return (
    <Bg style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'16px'}}>
      {PODIUM.map((e,i)=>(
        <div key={e.rank} style={{flex:1,maxWidth:92,textAlign:'center',background:rb(e.rank),border:`1.5px solid ${rbo(e.rank)}`,borderRadius:10,padding:'10px 4px',boxShadow:`0 4px 20px ${rglow(e.rank)}`}}>
          <NumBadge rank={e.rank} size={24} style={{margin:'0 auto 6px'}}/>
          <div style={{fontSize:24,fontWeight:900,color:rc(e.rank),fontVariantNumeric:'tabular-nums',minHeight:32,lineHeight:1}}>{vals[i]}</div>
          <div style={{color:'rgba(255,255,255,0.35)',fontSize:8,marginTop:2}}>pts</div>
          <div style={{color:rc(e.rank),fontSize:9,fontWeight:700,marginTop:4,maxWidth:80,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',margin:'4px auto 0'}}>{e.name}</div>
        </div>
      ))}
    </Bg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// V7 — Blur → Clear reveal
// ════════════════════════════════════════════════════════════════════════════
const V7 = ({ revealed }) => (
  <Bg style={{display:'flex',flexDirection:'column',gap:5,padding:'10px 16px'}}>
    {DATA.slice(0,3).map(e=>(
      <motion.div key={e.rank}
        animate={revealed ? {filter:'blur(0px)',opacity:1} : {filter:'blur(12px)',opacity:0.3}}
        transition={{delay:dd(e.rank),duration:0.7}}
        style={{display:'flex',alignItems:'center',gap:10,background:rb(e.rank),border:`1px solid ${rbo(e.rank)}`,borderRadius:8,padding:'8px 12px'}}>
        <NumBadge rank={e.rank} size={26}/>
        <div style={{flex:1}}>
          <div style={{color:rc(e.rank),fontSize:11,fontWeight:700}}>{e.name}</div>
          <div style={{color:rc(e.rank),fontSize:9,opacity:0.55}}>מחזור · {e.pts} pts</div>
        </div>
        <span style={{color:rc(e.rank),fontWeight:900,fontSize:16}}>{e.pts}</span>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V8 — Typewriter (names type out one by one, 3→2→1)
// ════════════════════════════════════════════════════════════════════════════
const V8 = ({ revealed }) => {
  const [typed, setTyped] = useState(['','','']);
  const names = [DATA[2].name, DATA[1].name, DATA[0].name]; // 3→2→1
  const ranks = [3,2,1];

  useEffect(() => {
    if (!revealed) { setTyped(['','','']); return; }
    const delays = [200, 900, 1800];
    const timers = names.map((name, i) => setTimeout(() => {
      let j = 0;
      const id = setInterval(() => {
        j++;
        setTyped(prev => { const next=[...prev]; next[i]=name.slice(0,j); return next; });
        if (j >= name.length) clearInterval(id);
      }, 60);
      return id;
    }, delays[i]));
    return () => timers.forEach(clearTimeout);
  }, [revealed]);

  return (
    <Bg style={{display:'flex',flexDirection:'column',gap:6,padding:'12px 16px'}}>
      {[2,1,0].map((di,i)=>{
        const e = DATA[di]; const r = ranks[i];
        return (
          <div key={r} style={{display:'flex',alignItems:'center',gap:10,background:rb(r),border:`1px solid ${rbo(r)}`,borderRadius:8,padding:'9px 12px'}}>
            <NumBadge rank={r} size={26}/>
            <div style={{flex:1,color:rc(r),fontSize:11,fontWeight:700,minHeight:16}}>
              {typed[i]}<span style={{opacity:revealed&&typed[i].length<e.name.length?1:0,animation:'blink 0.7s step-end infinite'}}>|</span>
            </div>
            <span style={{color:rc(r),fontWeight:900,fontSize:13,opacity:typed[i].length>=e.name.length?1:0,transition:'opacity 0.3s'}}>{e.pts}</span>
          </div>
        );
      })}
    </Bg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// V9 — Countdown 3…2…1 → Reveal
// ════════════════════════════════════════════════════════════════════════════
const V9 = ({ revealed }) => {
  const [phase, setPhase] = useState('hidden'); // hidden | count | show
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!revealed) { setPhase('hidden'); setCount(3); return; }
    setPhase('count'); setCount(3);
    const t1 = setTimeout(()=>setCount(2),600);
    const t2 = setTimeout(()=>setCount(1),1200);
    const t3 = setTimeout(()=>{ setPhase('show'); },1800);
    return ()=>{ clearTimeout(t1);clearTimeout(t2);clearTimeout(t3); };
  }, [revealed]);

  return (
    <Bg style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <AnimatePresence mode="wait">
        {phase==='count' && (
          <motion.div key={count} initial={{scale:1.6,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.4,opacity:0}}
            transition={{duration:0.35}}
            style={{fontSize:72,fontWeight:900,color:'white',textShadow:'0 0 40px rgba(255,255,255,0.4)'}}>
            {count}
          </motion.div>
        )}
        {phase==='hidden' && (
          <motion.div style={{fontSize:14,color:'rgba(255,255,255,0.2)',fontWeight:500}}>
            לחץ הצג לחשיפה
          </motion.div>
        )}
        {phase==='show' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{width:'100%',padding:'0 16px',display:'flex',flexDirection:'column',gap:5}}>
            {DATA.slice(0,3).map((e,i)=>(
              <motion.div key={e.rank} initial={{x:40,opacity:0}} animate={{x:0,opacity:1}}
                transition={{delay:i*0.15,type:'spring',stiffness:250,damping:22}}
                style={{display:'flex',alignItems:'center',gap:10,background:rb(e.rank),border:`1px solid ${rbo(e.rank)}`,borderRadius:8,padding:'8px 12px'}}>
                <NumBadge rank={e.rank} size={26}/>
                <span style={{flex:1,color:rc(e.rank),fontSize:11,fontWeight:700}}>{e.name}</span>
                <span style={{color:rc(e.rank),fontWeight:900,fontSize:13}}>{e.pts}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Bg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// V10 — Spring Zoom (each entry pops in with spring overshoot)
// ════════════════════════════════════════════════════════════════════════════
const V10 = ({ revealed }) => (
  <Bg style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'16px'}}>
    {DATA.slice(0,3).map(e=>(
      <motion.div key={e.rank}
        initial={{scale:0,opacity:0}} animate={revealed?{scale:1,opacity:1}:{scale:0,opacity:0}}
        transition={{delay:dd(e.rank),type:'spring',stiffness:280,damping:14}}
        style={{flex:1,maxWidth:90,background:rb(e.rank),border:`1.5px solid ${rbo(e.rank)}`,borderRadius:12,
          padding:'14px 6px',textAlign:'center',boxShadow:`0 8px 28px ${rglow(e.rank)}`}}>
        <div style={{fontSize:36,fontWeight:900,color:rc(e.rank),lineHeight:1}}>{e.rank}</div>
        <div style={{color:rc(e.rank),fontSize:9,fontWeight:700,marginTop:6,maxWidth:76,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',margin:'6px auto 0'}}>{e.name}</div>
        <div style={{color:rc(e.rank),fontSize:8,opacity:0.55,marginTop:2}}>{e.pts} pts</div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V11 — Horizontal Racing Bars (bars extend from left)
// ════════════════════════════════════════════════════════════════════════════
const V11 = ({ revealed }) => {
  const max = DATA[0].pts;
  return (
    <Bg style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:8,padding:'14px 16px'}}>
      {DATA.slice(0,3).map(e=>(
        <div key={e.rank} style={{display:'flex',alignItems:'center',gap:8}}>
          <NumBadge rank={e.rank} size={22} style={{flexShrink:0}}/>
          <div style={{flex:1,height:28,background:'rgba(255,255,255,0.04)',borderRadius:6,overflow:'hidden',position:'relative'}}>
            <motion.div
              initial={{width:0}} animate={revealed?{width:`${(e.pts/max)*100}%`}:{width:0}}
              transition={{delay:dd(e.rank),duration:0.8,ease:[0.23,1,0.32,1]}}
              style={{position:'absolute',inset:'0 auto 0 0',background:rb(e.rank),borderRadius:6,
                boxShadow:`inset 0 1px 0 rgba(255,255,255,0.1)`,border:`1px solid ${rbo(e.rank)}`}}/>
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',paddingLeft:8,paddingRight:8,justifyContent:'space-between'}}>
              <span style={{color:rc(e.rank),fontSize:10,fontWeight:700,zIndex:1}}>{e.name}</span>
              <motion.span initial={{opacity:0}} animate={revealed?{opacity:1}:{opacity:0}}
                transition={{delay:dd(e.rank)+0.6}}
                style={{color:rc(e.rank),fontSize:10,fontWeight:900,zIndex:1}}>{e.pts}</motion.span>
            </div>
          </div>
        </div>
      ))}
    </Bg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// V12 — Curtain Wipe (overlay slides away to reveal)
// ════════════════════════════════════════════════════════════════════════════
const V12 = ({ revealed }) => (
  <Bg style={{padding:'10px 16px',display:'flex',flexDirection:'column',gap:5}}>
    {DATA.slice(0,3).map(e=>(
      <div key={e.rank} style={{position:'relative',display:'flex',alignItems:'center',gap:10,background:rb(e.rank),border:`1px solid ${rbo(e.rank)}`,borderRadius:8,padding:'9px 12px',overflow:'hidden'}}>
        <NumBadge rank={e.rank} size={26}/>
        <span style={{flex:1,color:rc(e.rank),fontSize:11,fontWeight:700}}>{e.name}</span>
        <span style={{color:rc(e.rank),fontWeight:900,fontSize:13}}>{e.pts}</span>
        {/* Curtain overlay */}
        <motion.div
          initial={{x:0}} animate={revealed?{x:'110%'}:{x:0}}
          transition={{delay:dd(e.rank),duration:0.6,ease:[0.23,1,0.32,1]}}
          style={{position:'absolute',inset:0,background:'#040408',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{color:'rgba(255,255,255,0.08)',fontSize:20,fontWeight:900}}>?</span>
        </motion.div>
      </div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V13 — Dramatic Slide (entries fly in from right, 3→2→1 with gap)
// ════════════════════════════════════════════════════════════════════════════
const V13 = ({ revealed }) => (
  <Bg style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:5}}>
    {DATA.slice(0,5).map(e=>(
      <motion.div key={e.rank}
        initial={{x:120,opacity:0}} animate={revealed?{x:0,opacity:1}:{x:120,opacity:0}}
        transition={{delay:dd(Math.min(e.rank,3))+(e.rank>3?(e.rank-3)*0.15:0), type:'spring',stiffness:220,damping:24}}
        style={{display:'flex',alignItems:'center',gap:8,background:rb(e.rank),border:`1px solid ${rbo(e.rank)}`,borderRadius:7,padding:'6px 10px'}}>
        <NumBadge rank={e.rank} size={22}/>
        <span style={{flex:1,color:e.rank<=3?rc(e.rank):'rgba(255,255,255,0.5)',fontSize:10,fontWeight:e.rank<=3?700:500}}>{e.name}</span>
        <span style={{color:e.rank<=3?rc(e.rank):'rgba(255,255,255,0.3)',fontWeight:700,fontSize:11}}>{e.pts}</span>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V14 — Float Drift (3 cards drift in from 3 directions)
// ════════════════════════════════════════════════════════════════════════════
const V14 = ({ revealed }) => {
  const origins = [{x:0,y:80},{x:-80,y:40},{x:80,y:40}]; // 1st from bottom, 2nd from left, 3rd from right
  return (
    <Bg style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px 16px'}}>
      {DATA.slice(0,3).map((e,i)=>(
        <motion.div key={e.rank}
          initial={{...origins[e.rank-1],opacity:0}} animate={revealed?{x:0,y:0,opacity:1}:{...origins[e.rank-1],opacity:0}}
          transition={{delay:dd(e.rank),type:'spring',stiffness:160,damping:18}}
          style={{flex:1,maxWidth:90,background:rb(e.rank),border:`1.5px solid ${rbo(e.rank)}`,borderRadius:12,
            padding:'14px 6px',textAlign:'center',boxShadow:`0 8px 28px ${rglow(e.rank)}`}}>
          <span style={{fontSize:34,fontWeight:900,color:rc(e.rank),display:'block',lineHeight:1}}>{e.rank}</span>
          <span style={{color:rc(e.rank),fontSize:9,fontWeight:700,display:'block',marginTop:5,maxWidth:76,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',margin:'5px auto 0'}}>{e.name}</span>
          <span style={{color:rc(e.rank),fontSize:8,opacity:0.55,display:'block',marginTop:2}}>{e.pts} pts</span>
        </motion.div>
      ))}
    </Bg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// V15 — Retro Scoreboard (dark green LED aesthetic)
// ════════════════════════════════════════════════════════════════════════════
const V15 = ({ revealed }) => (
  <Bg style={{background:'#020a04',display:'flex',flexDirection:'column',justifyContent:'center',padding:'10px 14px',gap:4,fontFamily:'monospace'}}>
    <div style={{color:'rgba(0,255,80,0.3)',fontSize:9,letterSpacing:'0.3em',marginBottom:4}}>ROUND RESULTS ▶</div>
    {DATA.slice(0,3).map(e=>(
      <motion.div key={e.rank}
        initial={{opacity:0,x:-20}} animate={revealed?{opacity:1,x:0}:{opacity:0,x:-20}}
        transition={{delay:dd(e.rank),duration:0.4}}
        style={{display:'flex',alignItems:'center',gap:8,padding:'5px 8px',background:'rgba(0,255,80,0.03)',border:'1px solid rgba(0,255,80,0.1)',borderRadius:3}}>
        <span style={{color:rc(e.rank),fontSize:11,fontWeight:900,width:14,textAlign:'center'}}>{e.rank}</span>
        <span style={{color:'rgba(0,255,80,0.5)',fontSize:10}}>▶</span>
        <span style={{flex:1,color:e.rank===1?'rgba(0,255,80,0.9)':'rgba(0,255,80,0.6)',fontSize:10}}>{e.name.toUpperCase()}</span>
        <span style={{color:rc(e.rank),fontWeight:900,fontSize:11}}>{e.pts}</span>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V16 — Editorial / Newspaper style
// ════════════════════════════════════════════════════════════════════════════
const V16 = ({ revealed }) => (
  <Bg style={{background:'#06060a',padding:'12px 16px'}}>
    <motion.div initial={{opacity:0,y:-10}} animate={revealed?{opacity:1,y:0}:{opacity:0,y:-10}} transition={{duration:0.4}}
      style={{color:'rgba(255,255,255,0.15)',fontSize:7,letterSpacing:'0.4em',marginBottom:8,borderBottom:'1px solid rgba(255,255,255,0.07)',paddingBottom:4}}>
      ROUND STANDINGS · OFFICIAL RESULTS
    </motion.div>
    {DATA.slice(0,3).map((e,i)=>(
      <motion.div key={e.rank}
        initial={{opacity:0}} animate={revealed?{opacity:1}:{opacity:0}}
        transition={{delay:dd(e.rank),duration:0.5}}
        style={{display:'flex',alignItems:'baseline',gap:0,marginBottom:6,borderBottom:i<2?'1px solid rgba(255,255,255,0.05)':'none',paddingBottom:i<2?6:0}}>
        <span style={{color:rc(e.rank),fontSize:e.rank===1?22:16,fontWeight:900,width:26,lineHeight:1}}>{e.rank}</span>
        <span style={{flex:1,color:e.rank===1?'white':'rgba(255,255,255,0.65)',fontSize:e.rank===1?13:11,fontWeight:e.rank===1?700:500,paddingLeft:4}}>{e.name}</span>
        <span style={{color:rc(e.rank),fontSize:e.rank===1?14:11,fontWeight:900}}>{e.pts} <span style={{fontSize:8,opacity:0.6,fontWeight:400}}>pts</span></span>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V17 — TV Broadcast Lower-Third
// ════════════════════════════════════════════════════════════════════════════
const V17 = ({ revealed }) => (
  <Bg style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 0 12px'}}>
    <AnimatePresence>
      {revealed && DATA.slice(0,3).map((e,i)=>(
        <motion.div key={e.rank}
          initial={{x:'-100%',opacity:0}} animate={{x:0,opacity:1}} exit={{x:'-100%',opacity:0}}
          transition={{delay:dd(e.rank),type:'spring',stiffness:200,damping:26}}
          style={{display:'flex',alignItems:'center',gap:0,marginBottom:4}}>
          <div style={{width:4,alignSelf:'stretch',background:rc(e.rank),flexShrink:0}}/>
          <div style={{background:'rgba(0,0,0,0.85)',backdropFilter:'blur(12px)',padding:'5px 10px',display:'flex',alignItems:'center',gap:8}}>
            <span style={{color:rc(e.rank),fontWeight:900,fontSize:11,width:14}}>{e.rank}</span>
            <span style={{color:'white',fontSize:10,fontWeight:600}}>{e.name}</span>
          </div>
          <div style={{background:rc(e.rank),padding:'5px 10px',flexShrink:0}}>
            <span style={{color:'black',fontWeight:900,fontSize:10}}>{e.pts}</span>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
    {!revealed && <div style={{color:'rgba(255,255,255,0.12)',fontSize:10,textAlign:'center',marginBottom:24}}>הדירוג ייחשף...</div>}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V18 — Glitch Text (random chars settle to correct name)
// ════════════════════════════════════════════════════════════════════════════
const CHARS = 'אבגדהוזחטיכלמנסעפצקרשת!@#$%^&*';
const V18 = ({ revealed }) => {
  const [display, setDisplay] = useState(DATA.slice(0,3).map(()=>'??????'));
  const timers = useRef([]);

  useEffect(()=>{
    timers.current.forEach(clearInterval);
    if(!revealed){ setDisplay(DATA.slice(0,3).map(()=>'??????')); return; }
    DATA.slice(0,3).forEach((e,i)=>{
      let settled = Array(e.name.length).fill(false);
      const delay = dd(e.rank)*1000;
      const t = setTimeout(()=>{
        const id = setInterval(()=>{
          setDisplay(prev=>{
            const next=[...prev];
            let all=true;
            next[i]=e.name.split('').map((ch,j)=>{
              if(settled[j]) return ch;
              if(Math.random()<0.15){ settled[j]=true; return ch; }
              all=false;
              return CHARS[Math.floor(Math.random()*CHARS.length)];
            }).join('');
            if(all) clearInterval(id);
            return next;
          });
        },80);
        timers.current[i]=id;
      }, delay);
      timers.current.push(t);
    });
    return ()=>timers.current.forEach(clearInterval);
  },[revealed]);

  return (
    <Bg style={{display:'flex',flexDirection:'column',gap:5,padding:'12px 16px'}}>
      {DATA.slice(0,3).map((e,i)=>(
        <div key={e.rank} style={{display:'flex',alignItems:'center',gap:10,background:rb(e.rank),border:`1px solid ${rbo(e.rank)}`,borderRadius:8,padding:'9px 12px'}}>
          <NumBadge rank={e.rank} size={26}/>
          <span style={{flex:1,color:rc(e.rank),fontSize:11,fontWeight:700,fontFamily:'monospace',letterSpacing:'0.02em'}}>{display[i]}</span>
          <span style={{color:rc(e.rank),fontWeight:900,fontSize:13}}>{e.pts}</span>
        </div>
      ))}
    </Bg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// V19 — Holographic Prismatic (shifting border colors)
// ════════════════════════════════════════════════════════════════════════════
const V19 = ({ revealed }) => (
  <Bg style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:6,padding:'8px 14px 0'}}>
    {PODIUM.map((e,i)=>(
      <motion.div key={e.rank}
        initial={{y:90,opacity:0}} animate={revealed?{y:0,opacity:1}:{y:90,opacity:0}}
        transition={{delay:dd(e.rank),type:'spring',stiffness:190,damping:20}}>
        <div style={{textAlign:'center',marginBottom:4}}>
          <span style={{color:rc(e.rank),fontSize:10,fontWeight:700}}>{e.name}</span><br/>
          <span style={{color:rc(e.rank),fontSize:9,opacity:0.55}}>{e.pts}</span>
        </div>
        <div style={{padding:1.5,borderRadius:'8px 8px 0 0',background:e.rank===1?'linear-gradient(135deg,#f59e0b,#a855f7,#3b82f6,#f59e0b)':e.rank===2?'linear-gradient(135deg,#94a3b8,#cbd5e1,#94a3b8)':'linear-gradient(135deg,#b45309,#d97706,#b45309)'}}>
          <div style={{width:78,height:H[i],background:'#040408',borderRadius:'6px 6px 0 0',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontSize:30,fontWeight:900,color:rc(e.rank)}}>{e.rank}</span>
          </div>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V20 — Ultra Minimal (pure typography, fade)
// ════════════════════════════════════════════════════════════════════════════
const V20 = ({ revealed }) => (
  <Bg style={{background:'#020204',display:'flex',flexDirection:'column',justifyContent:'center',padding:'12px 20px',gap:10}}>
    {DATA.slice(0,3).map(e=>(
      <motion.div key={e.rank}
        initial={{opacity:0}} animate={revealed?{opacity:1}:{opacity:0}}
        transition={{delay:dd(e.rank),duration:0.6}}
        style={{display:'flex',alignItems:'baseline',gap:10}}>
        <span style={{color:rc(e.rank),fontSize:e.rank===1?32:e.rank===2?22:16,fontWeight:900,lineHeight:1,width:36}}>{e.rank}</span>
        <span style={{flex:1,color:e.rank===1?'rgba(255,255,255,0.85)':'rgba(255,255,255,0.45)',fontSize:e.rank===1?13:11,fontWeight:e.rank===1?600:400}}>{e.name}</span>
        <span style={{color:rc(e.rank),fontSize:e.rank===1?14:11,fontWeight:700}}>{e.pts}</span>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V21 — Split Screen (1st center, 2nd left, 3rd right)
// ════════════════════════════════════════════════════════════════════════════
const V21 = ({ revealed }) => (
  <Bg style={{display:'flex',gap:0,height:168}}>
    {/* 2nd - left */}
    <motion.div initial={{x:-80,opacity:0}} animate={revealed?{x:0,opacity:1}:{x:-80,opacity:0}}
      transition={{delay:dd(2),type:'spring',stiffness:200,damping:22}}
      style={{flex:1,background:rb(2),borderRight:`1px solid ${rbo(2)}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',padding:'0 4px 14px'}}>
      <span style={{fontSize:24,fontWeight:900,color:S}}>2</span>
      <span style={{color:S,fontSize:9,fontWeight:700,textAlign:'center'}}>{DATA[1].name}</span>
      <span style={{color:S,fontSize:8,opacity:0.55}}>{DATA[1].pts}</span>
    </motion.div>
    {/* 1st - center */}
    <motion.div initial={{y:60,opacity:0}} animate={revealed?{y:0,opacity:1}:{y:60,opacity:0}}
      transition={{delay:dd(1),type:'spring',stiffness:180,damping:20}}
      style={{flex:1.5,background:rb(1),display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',padding:'0 4px 14px',boxShadow:`0 0 30px ${rglow(1)}`}}>
      <span style={{fontSize:38,fontWeight:900,color:G}}>1</span>
      <span style={{color:G,fontSize:10,fontWeight:700,textAlign:'center'}}>{DATA[0].name}</span>
      <span style={{color:G,fontSize:9,opacity:0.65}}>{DATA[0].pts}</span>
    </motion.div>
    {/* 3rd - right */}
    <motion.div initial={{x:80,opacity:0}} animate={revealed?{x:0,opacity:1}:{x:80,opacity:0}}
      transition={{delay:dd(3),type:'spring',stiffness:200,damping:22}}
      style={{flex:1,background:rb(3),borderLeft:`1px solid ${rbo(3)}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',padding:'0 4px 14px'}}>
      <span style={{fontSize:24,fontWeight:900,color:B}}>3</span>
      <span style={{color:B,fontSize:9,fontWeight:700,textAlign:'center'}}>{DATA[2].name}</span>
      <span style={{color:B,fontSize:8,opacity:0.55}}>{DATA[2].pts}</span>
    </motion.div>
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V22 — Pyramid Stack (blocks drop from top)
// ════════════════════════════════════════════════════════════════════════════
const V22 = ({ revealed }) => (
  <Bg style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',padding:'0 16px 8px',gap:4}}>
    {[DATA[0],DATA[1],DATA[2]].map((e,i)=>(
      <motion.div key={e.rank}
        initial={{y:-80,opacity:0}} animate={revealed?{y:0,opacity:1}:{y:-80,opacity:0}}
        transition={{delay:dd(e.rank),type:'spring',stiffness:200,damping:20}}
        style={{width:`${100-(i*14)}%`,background:rb(e.rank),border:`1.5px solid ${rbo(e.rank)}`,borderRadius:6,
          padding:'7px 12px',display:'flex',alignItems:'center',gap:8,boxShadow:`0 2px 12px ${rglow(e.rank)}`}}>
        <NumBadge rank={e.rank} size={22}/>
        <span style={{flex:1,color:rc(e.rank),fontSize:10,fontWeight:700}}>{e.name}</span>
        <span style={{color:rc(e.rank),fontSize:10,fontWeight:900}}>{e.pts}</span>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V23 — Cinematic Widescreen (top-bar reveal, cinematic letterbox)
// ════════════════════════════════════════════════════════════════════════════
const V23 = ({ revealed }) => (
  <Bg style={{background:'#000',position:'relative'}}>
    {/* letterbox bars */}
    <div style={{position:'absolute',top:0,left:0,right:0,height:18,background:'#000',zIndex:2}}/>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:18,background:'#000',zIndex:2}}/>
    <div style={{position:'absolute',inset:'18px 0',display:'flex',alignItems:'center',justifyContent:'center',padding:'0 14px'}}>
      <div style={{width:'100%',display:'flex',flexDirection:'column',gap:5}}>
        {DATA.slice(0,3).map(e=>(
          <motion.div key={e.rank}
            initial={{opacity:0,scale:0.95}} animate={revealed?{opacity:1,scale:1}:{opacity:0,scale:0.95}}
            transition={{delay:dd(e.rank),duration:0.5,ease:[0.23,1,0.32,1]}}
            style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{color:rc(e.rank),fontWeight:900,fontSize:10,width:14,textAlign:'center'}}>{e.rank}</span>
            <div style={{width:1,height:18,background:rbo(e.rank)}}/>
            <span style={{flex:1,color:'rgba(255,255,255,0.7)',fontSize:10,fontWeight:500}}>{e.name}</span>
            <span style={{color:rc(e.rank),fontWeight:900,fontSize:11}}>{e.pts}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V24 — Spotlight (dark, each entry lit by spotlight when revealed)
// ════════════════════════════════════════════════════════════════════════════
const V24 = ({ revealed }) => (
  <Bg style={{background:'#010104',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px 12px'}}>
    {DATA.slice(0,3).map(e=>(
      <motion.div key={e.rank}
        initial={{opacity:0.07}} animate={revealed?{opacity:1}:{opacity:0.07}}
        transition={{delay:dd(e.rank),duration:0.7}}
        style={{flex:1,maxWidth:90,textAlign:'center',position:'relative',padding:'10px 4px',borderRadius:10}}>
        {/* Spotlight glow */}
        <motion.div animate={revealed?{opacity:1}:{opacity:0}} transition={{delay:dd(e.rank)+0.2,duration:0.8}}
          style={{position:'absolute',inset:-4,borderRadius:12,background:`radial-gradient(ellipse 80% 60% at 50% 40%,${rglow(e.rank)} 0%,transparent 70%)`,pointerEvents:'none'}}/>
        <span style={{display:'block',fontSize:34,fontWeight:900,color:rc(e.rank),lineHeight:1,position:'relative'}}>{e.rank}</span>
        <span style={{display:'block',color:rc(e.rank),fontSize:9,fontWeight:700,marginTop:5,position:'relative'}}>{e.name}</span>
        <span style={{display:'block',color:rc(e.rank),fontSize:8,opacity:0.55,position:'relative',marginTop:2}}>{e.pts} pts</span>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// V25 — Grand Finale (full 5-list, 1st entry revealed last with fanfare)
// ════════════════════════════════════════════════════════════════════════════
const V25 = ({ revealed }) => (
  <Bg style={{padding:'10px 14px',display:'flex',flexDirection:'column',gap:4}}>
    {DATA.map((e,i)=>(
      <motion.div key={e.rank}
        initial={{x:60,opacity:0}} animate={revealed?{x:0,opacity:1}:{x:60,opacity:0}}
        transition={{delay:dd(Math.min(e.rank,3))+(e.rank>3?(e.rank-3)*0.1:0),type:'spring',stiffness:240,damping:22}}
        style={{display:'flex',alignItems:'center',gap:8,
          background:rb(e.rank),border:`${e.rank===1?'2px':'1px'} solid ${rbo(e.rank)}`,borderRadius:e.rank===1?10:7,
          padding:e.rank===1?'9px 12px':'6px 10px',
          boxShadow:e.rank===1?`0 0 24px ${rglow(e.rank)}`:undefined}}>
        <NumBadge rank={e.rank} size={e.rank===1?28:22}/>
        <span style={{flex:1,color:e.rank===1?rc(1):e.rank<=3?rc(e.rank):'rgba(255,255,255,0.4)',
          fontSize:e.rank===1?12:10,fontWeight:e.rank===1?700:500}}>{e.name}</span>
        <span style={{color:rc(e.rank),fontWeight:900,fontSize:e.rank===1?14:11}}>{e.pts}</span>
        {e.rank===1&&<span style={{fontSize:8,color:'rgba(255,255,255,0.3)'}}>← מנצח</span>}
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
const RENDERS = [V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11,V12,V13,V14,V15,V16,V17,V18,V19,V20,V21,V22,V23,V24,V25];

const VARIANTS = [
  { id:1,  name:"Classic Bars",      desc:"עמודים קלאסיים 2-1-3, חשיפה עולה" },
  { id:2,  name:"Glass Cards",       desc:"כרטיסי זכוכית בגבהים שונים" },
  { id:3,  name:"Neon Glow",         desc:"זוהר ניאון צבעוני לפי דירוג" },
  { id:4,  name:"Card Flip",         desc:"קלפים הפוכים מתהפכים 3→2→1" },
  { id:5,  name:"Rising Columns",    desc:"עמודים גדלים מלמטה" },
  { id:6,  name:"Slot Machine",      desc:"ספרות מתגלגלות ועוצרות" },
  { id:7,  name:"Blur Reveal",       desc:"שמות מטושטשים מתחדדים" },
  { id:8,  name:"Typewriter",        desc:"שמות מודפסים אות-אות" },
  { id:9,  name:"Countdown 3-2-1",   desc:"ספירה לאחור לפני חשיפה" },
  { id:10, name:"Spring Zoom",       desc:"כניסה ספרינגית עם קפיצה" },
  { id:11, name:"Racing Bars",       desc:"פסים אופקיים מתמלאים" },
  { id:12, name:"Curtain Wipe",      desc:"וילון נשמט ומגלה" },
  { id:13, name:"Dramatic Slide",    desc:"5 מקומות, כניסה מהצד" },
  { id:14, name:"Float Drift",       desc:"כרטיסים צפים מ-3 כיוונים" },
  { id:15, name:"Retro Board",       desc:"לוח תוצאות רטרו ירוק" },
  { id:16, name:"Editorial",         desc:"סגנון עיתון, 1 בולט" },
  { id:17, name:"TV Broadcast",      desc:"גרפיקה Lower-Third" },
  { id:18, name:"Glitch Reveal",     desc:"טקסט מתנפץ מסתדר" },
  { id:19, name:"Holographic",       desc:"גבולות פריזמטיים הולוגרפיים" },
  { id:20, name:"Ultra Minimal",     desc:"טיפוגרפיה בלבד, fade עדין" },
  { id:21, name:"Split Screen",      desc:"מסך מפוצל — 1 מרכז, 2/3 צדדים" },
  { id:22, name:"Pyramid Stack",     desc:"בלוקים נוחתים מלמעלה" },
  { id:23, name:"Cinematic",         desc:"סגנון letterbox קולנועי" },
  { id:24, name:"Spotlight",         desc:"פנס אור מאיר כל מקום בתורו" },
  { id:25, name:"Grand Finale",      desc:"5 שורות, 1 נכנס אחרון עם פאנפרה" },
];

// ─── Preview Card ─────────────────────────────────────────────────────────────
const PreviewCard = ({ variant, isSelected, onSelect, onExpand }) => {
  const Render = RENDERS[variant.id - 1];
  return (
    <motion.div layout initial={{ opacity:0 }} animate={{ opacity:1 }} className="group relative">
      <div onClick={onSelect} className="relative rounded-xl overflow-hidden cursor-pointer"
        style={{ border: isSelected ? "1.5px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ height:84, overflow:"hidden", position:"relative" }}>
          <div style={{ transform:"scale(0.5)", transformOrigin:"top left", width:"200%", height:"200%", pointerEvents:"none" }}>
            <Render revealed={true} />
          </div>
        </div>
        <button onClick={e=>{ e.stopPropagation(); onExpand(); }}
          className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-white/60 hover:text-white"
          style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)" }}>
          <Maximize2 className="w-2.5 h-2.5" />
        </button>
        {isSelected && (
          <div className="absolute top-1 right-1 rounded-full p-0.5 bg-white">
            <div className="w-2 h-2 bg-black rounded-full" />
          </div>
        )}
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-white/70 text-[11px] font-medium leading-tight truncate">{variant.id}. {variant.name}</p>
        <p className="text-white/25 text-[9px] mt-0.5 leading-tight truncate">{variant.desc}</p>
      </div>
    </motion.div>
  );
};

// ─── Full Preview Modal ───────────────────────────────────────────────────────
const FullPreview = ({ variant, onClose }) => {
  const [revealed, setRevealed] = useState(false);
  const Render = RENDERS[variant.id - 1];

  return (
    <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" onClick={onClose} />
      <motion.div className="relative z-10 w-full max-w-md"
        initial={{ scale:0.94, y:12 }} animate={{ scale:1, y:0 }}
        transition={{ type:"spring", stiffness:400, damping:30 }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-white/30 text-xs mr-1.5">#{variant.id}</span>
            <span className="text-white font-semibold text-sm">{variant.name}</span>
            <span className="text-white/30 text-xs ml-2">{variant.desc}</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1.5 rounded-lg"
            style={{ background:"rgba(255,255,255,0.05)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.08)" }}>
          <Render revealed={revealed} />
        </div>

        <div className="flex gap-2 mt-3">
          {!revealed ? (
            <button onClick={() => setRevealed(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-black transition-all"
              style={{ background:"linear-gradient(135deg,#f59e0b,#fbbf24)" }}>
              <Play className="w-4 h-4" />
              הצג תוצאות
            </button>
          ) : (
            <button onClick={() => setRevealed(false)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.1)" }}>
              <RotateCcw className="w-3.5 h-3.5" />
              אפס
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminPodiumDemo() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Podium Styles — 25 קונספטים</h2>
        <p className="text-slate-500 text-sm mt-0.5">לחץ על פריוויו לבחירה · <Maximize2 className="inline w-3 h-3" /> לחשיפה מלאה עם אנימציה</p>
      </div>

      {selected && (
        <div className="text-[12px] px-3 py-1.5 rounded-lg text-white/50 inline-block"
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
          ✓ #{selected} {VARIANTS[selected-1]?.name}
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <AnimatePresence>
          {VARIANTS.map(v => (
            <PreviewCard key={v.id} variant={v}
              isSelected={selected === v.id}
              onSelect={() => setSelected(p => p === v.id ? null : v.id)}
              onExpand={() => setExpanded(v.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {expanded !== null && (
          <FullPreview variant={VARIANTS[expanded-1]} onClose={() => setExpanded(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
