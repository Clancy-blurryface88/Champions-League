import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Play, RotateCcw } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const DATA = [
  { rank:1, name:"יוסי כהן",  pts:87 },
  { rank:2, name:"מירי לוי",  pts:82 },
  { rank:3, name:"דני מזרחי", pts:79 },
];
// Spatial podium order: 2nd–1st–3rd (left → center → right)
const POD = [DATA[1], DATA[0], DATA[2]];
const HH  = [78, 114, 58]; // platform heights

// ── Colors ────────────────────────────────────────────────────────────────────
const G='#f59e0b', S='#94a3b8', B='#b45309';
const rc  = r => r===1?G:r===2?S:B;
const rb  = r => r===1?'rgba(245,158,11,0.1)':r===2?'rgba(148,163,184,0.07)':'rgba(180,83,9,0.1)';
const rbo = r => r===1?'rgba(245,158,11,0.3)':r===2?'rgba(148,163,184,0.2)':'rgba(180,83,9,0.25)';
const rglow = r => r===1?'rgba(245,158,11,0.35)':r===2?'rgba(148,163,184,0.18)':'rgba(180,83,9,0.28)';
// Drama delays: 3rd first → 2nd → 1st last
const dd = r => r===3?0.1:r===2?0.55:1.15;

const Bg = ({ children, style={} }) => (
  <div style={{ background:'#040408', minHeight:168, width:'100%', overflow:'hidden', position:'relative', ...style }}>
    {children}
  </div>
);

// Label above/below a platform
const PLabel = ({ entry, color, style={} }) => (
  <div style={{ textAlign:'center', ...style }}>
    <div style={{ color, fontSize:10, fontWeight:700, maxWidth:82, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{entry.name}</div>
    <div style={{ color, fontSize:8, opacity:0.55, marginTop:1 }}>{entry.pts} pts</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// P1 — Olympic Classic (white stepped platform, ultra-clean)
// ════════════════════════════════════════════════════════════════════════════
const P1 = ({ revealed }) => (
  <Bg style={{ background:'#06060c', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, maxWidth:100 }}
        initial={{ y:100, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:100,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', height:HH[i], background:rb(e.rank),
          borderTop:`3px solid ${rc(e.rank)}`, borderLeft:`1px solid ${rbo(e.rank)}`, borderRight:`1px solid ${rbo(e.rank)}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`inset 0 2px 8px rgba(255,255,255,0.04), 0 -4px 16px ${rglow(e.rank)}` }}>
          <span style={{ fontSize:36, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P2 — Floating Discs (circular platforms, drop shadow beneath)
// ════════════════════════════════════════════════════════════════════════════
const P2 = ({ revealed }) => (
  <Bg style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:8, paddingBottom:8 }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}
        initial={{ y:80, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:80,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:190, damping:20 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:8 }}/>
        {/* platform disc */}
        <div style={{ position:'relative', width:'80%', maxWidth:86 }}>
          <div style={{ height:HH[i], borderRadius:'50% 50% 8px 8px', background:rb(e.rank),
            border:`1.5px solid ${rbo(e.rank)}`,
            boxShadow:`0 8px 24px ${rglow(e.rank)}, 0 2px 4px rgba(0,0,0,0.6)`,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:34, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
          </div>
          {/* shadow ellipse */}
          <div style={{ position:'absolute', bottom:-8, left:'10%', right:'10%', height:8,
            background:`radial-gradient(ellipse,${rglow(e.rank)} 0%,transparent 70%)`, borderRadius:'50%' }}/>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P3 — LED Underglow (rectangle platform, neon strip below)
// ════════════════════════════════════════════════════════════════════════════
const P3 = ({ revealed }) => (
  <Bg style={{ background:'#020204', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, paddingBottom:12 }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:90, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:90,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:210, damping:22 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', position:'relative' }}>
          <div style={{ height:HH[i], background:'rgba(0,0,0,0.7)', border:`1px solid rgba(255,255,255,0.08)`,
            borderRadius:'4px 4px 0 0', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:34, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
          </div>
          {/* LED strip */}
          <div style={{ height:4, borderRadius:'0 0 4px 4px', background:rc(e.rank),
            boxShadow:`0 0 12px ${rc(e.rank)}, 0 0 24px ${rglow(e.rank)}` }}/>
          {/* Ground glow */}
          <div style={{ position:'absolute', bottom:-12, left:'-10%', right:'-10%', height:12,
            background:`radial-gradient(ellipse,${rglow(e.rank)} 0%,transparent 70%)` }}/>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P4 — Crystal Glass (transparent platforms, number etched)
// ════════════════════════════════════════════════════════════════════════════
const P4 = ({ revealed }) => (
  <Bg style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 16px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:80, opacity:0, scale:0.9 }} animate={revealed?{y:0,opacity:1,scale:1}:{y:80,opacity:0,scale:0.9}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:20 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', height:HH[i],
          background:'rgba(255,255,255,0.045)', backdropFilter:'blur(20px)',
          border:`1px solid rgba(255,255,255,0.18)`,
          borderTop:`2px solid ${rbo(e.rank)}`,
          borderRadius:'4px 4px 0 0',
          boxShadow:`inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2), 0 -8px 28px ${rglow(e.rank)}`,
          display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
          {/* gloss */}
          <div style={{ position:'absolute', inset:'0 0 50% 0', background:'linear-gradient(180deg,rgba(255,255,255,0.08) 0%,transparent 100%)' }}/>
          <span style={{ fontSize:34, fontWeight:900, color:rc(e.rank), opacity:0.9, position:'relative' }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P5 — Metallic Sheen (real gold/silver/bronze gradient)
// ════════════════════════════════════════════════════════════════════════════
const metalGrad = r => r===1
  ? 'linear-gradient(160deg,#fde68a 0%,#f59e0b 40%,#92400e 70%,#f59e0b 100%)'
  : r===2
  ? 'linear-gradient(160deg,#f1f5f9 0%,#94a3b8 40%,#475569 70%,#94a3b8 100%)'
  : 'linear-gradient(160deg,#fcd34d 0%,#b45309 40%,#78350f 70%,#b45309 100%)';

const P5 = ({ revealed }) => (
  <Bg style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:80, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:80,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', height:HH[i], background:metalGrad(e.rank),
          borderRadius:'4px 4px 0 0',
          boxShadow:`0 -4px 20px ${rglow(e.rank)}, inset 0 1px 0 rgba(255,255,255,0.4)`,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:36, fontWeight:900, color:'rgba(0,0,0,0.55)', textShadow:'0 1px 0 rgba(255,255,255,0.3)' }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P6 — Ice Blocks (frosted, cold blue glow)
// ════════════════════════════════════════════════════════════════════════════
const P6 = ({ revealed }) => (
  <Bg style={{ background:'#02050a', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:80, opacity:0, scale:0.95 }} animate={revealed?{y:0,opacity:1,scale:1}:{y:80,opacity:0,scale:0.95}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:180, damping:20 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', height:HH[i], position:'relative', overflow:'hidden',
          background:'rgba(180,220,255,0.07)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(150,210,255,0.25)', borderTop:'2px solid rgba(200,240,255,0.4)',
          borderRadius:'4px 4px 0 0',
          boxShadow:`0 -6px 24px rgba(100,180,255,0.2), inset 0 1px 0 rgba(255,255,255,0.15)` }}>
          {/* ice refraction lines */}
          {[20,45,65,80].map(pct => (
            <div key={pct} style={{ position:'absolute', top:0, bottom:0, left:`${pct}%`, width:1, background:'rgba(200,240,255,0.08)', transform:`rotate(${pct%2?3:-3}deg)` }}/>
          ))}
          <span style={{ position:'relative', fontSize:34, fontWeight:900, color:rc(e.rank), display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P7 — Wireframe 3D (isometric outline boxes)
// ════════════════════════════════════════════════════════════════════════════
const P7 = ({ revealed }) => (
  <Bg style={{ background:'#030306', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:4, padding:'8px 12px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ opacity:0, scaleY:0 }} animate={revealed?{opacity:1,scaleY:1}:{opacity:0,scaleY:0}}
        style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center', transformOrigin:'bottom' }}
        transition={{ delay:dd(e.rank), duration:0.5, ease:[0.23,1,0.32,1] }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'88%', height:HH[i], position:'relative',
          border:`1.5px solid ${rc(e.rank)}`, borderRadius:2,
          boxShadow:`0 0 0 1px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(0,0,0,0.8)`,
          display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.7)' }}>
          {/* corner accents */}
          {[[0,0],[0,1],[1,0],[1,1]].map(([t,l],ci) => (
            <div key={ci} style={{ position:'absolute', width:6, height:6,
              top:t?'auto':0, bottom:t?0:'auto', left:l?'auto':0, right:l?0:'auto',
              borderTop:t?undefined:`1.5px solid ${rc(e.rank)}`, borderBottom:t?`1.5px solid ${rc(e.rank)}`:undefined,
              borderLeft:l?undefined:`1.5px solid ${rc(e.rank)}`, borderRight:l?`1.5px solid ${rc(e.rank)}`:undefined }}/>
          ))}
          <span style={{ fontSize:30, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P8 — Hologram Scan (scan-line projection effect)
// ════════════════════════════════════════════════════════════════════════════
const P8 = ({ revealed }) => {
  const [scanY, setScanY] = useState(0);
  useEffect(() => {
    if (!revealed) return;
    let y = 0; const id = setInterval(() => { y=(y+2)%100; setScanY(y); },30);
    return () => clearInterval(id);
  }, [revealed]);
  return (
    <Bg style={{ background:'#000508', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
      {POD.map((e,i) => (
        <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
          initial={{ opacity:0 }} animate={revealed?{opacity:1}:{opacity:0}}
          transition={{ delay:dd(e.rank), duration:0.6 }}>
          <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
          <div style={{ width:'90%', height:HH[i], position:'relative', overflow:'hidden',
            background:`linear-gradient(180deg,${rb(e.rank)} 0%,rgba(0,255,180,0.04) 100%)`,
            border:`1px solid rgba(0,255,180,0.2)`, borderTop:`1px solid rgba(0,255,180,0.5)`,
            borderRadius:'2px 2px 0 0',
            boxShadow:`0 -4px 20px rgba(0,255,180,0.12)` }}>
            {/* scan line */}
            <div style={{ position:'absolute', left:0, right:0, height:2, top:`${scanY}%`,
              background:'rgba(0,255,180,0.4)', boxShadow:'0 0 8px rgba(0,255,180,0.6)', zIndex:2 }}/>
            {/* h-lines */}
            {Array.from({length:10},(_,j)=>(
              <div key={j} style={{ position:'absolute', left:0, right:0, height:1, top:`${j*10}%`, background:'rgba(0,255,180,0.05)' }}/>
            ))}
            <span style={{ position:'relative', zIndex:3, fontSize:30, fontWeight:900, color:rc(e.rank), display:'flex', height:'100%', alignItems:'center', justifyContent:'center' }}>{e.rank}</span>
          </div>
        </motion.div>
      ))}
    </Bg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// P9 — Marble Columns (tall narrow, arch top, classical)
// ════════════════════════════════════════════════════════════════════════════
const P9 = ({ revealed }) => (
  <Bg style={{ background:'#07060a', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:10, padding:'8px 16px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:90, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:90,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:190, damping:20 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        {/* column */}
        <div style={{ width:e.rank===1?72:56, display:'flex', flexDirection:'column' }}>
          {/* arch cap */}
          <div style={{ height:20, background:metalGrad(e.rank), borderRadius:'50% 50% 0 0', boxShadow:`0 -4px 12px ${rglow(e.rank)}` }}/>
          {/* shaft */}
          <div style={{ flex:1, height:HH[i]-20, background:rb(e.rank),
            border:`1px solid ${rbo(e.rank)}`, borderTop:'none',
            display:'flex', alignItems:'center', justifyContent:'center',
            backgroundImage:'repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 2px,transparent 2px,transparent 10px)' }}>
            <span style={{ fontSize:e.rank===1?30:24, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
          </div>
          {/* base */}
          <div style={{ height:10, background:metalGrad(e.rank), boxShadow:`0 4px 12px ${rglow(e.rank)}` }}/>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P10 — Arc Stage (platforms arranged in a semicircle)
// ════════════════════════════════════════════════════════════════════════════
const P10 = ({ revealed }) => {
  const positions = [
    { left:'8%',  bottom:'12px', rank:2 },
    { left:'35%', bottom:'40px', rank:1 },
    { left:'62%', bottom:'18px', rank:3 },
  ];
  return (
    <Bg style={{ position:'relative', overflow:'visible' }}>
      {/* arc guide line */}
      <div style={{ position:'absolute', left:'5%', right:'5%', bottom:10, height:60,
        border:'1px dashed rgba(255,255,255,0.05)', borderTop:'none', borderRadius:'0 0 60px 60px', pointerEvents:'none' }}/>
      {positions.map(pos => {
        const e = DATA[pos.rank-1];
        return (
          <motion.div key={pos.rank}
            initial={{ scale:0, opacity:0 }} animate={revealed?{scale:1,opacity:1}:{scale:0,opacity:0}}
            transition={{ delay:dd(pos.rank), type:'spring', stiffness:220, damping:18 }}
            style={{ position:'absolute', left:pos.left, bottom:pos.bottom, width:'28%', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <PLabel entry={e} color={rc(pos.rank)} style={{ marginBottom:5 }}/>
            <div style={{ width:'100%', height:60+(pos.rank===1?20:0),
              background:rb(pos.rank), border:`1.5px solid ${rbo(pos.rank)}`,
              borderRadius:8, boxShadow:`0 -4px 16px ${rglow(pos.rank)}`,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:28, fontWeight:900, color:rc(pos.rank) }}>{pos.rank}</span>
            </div>
          </motion.div>
        );
      })}
    </Bg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// P11 — Spotlight Stage (cone of light from above)
// ════════════════════════════════════════════════════════════════════════════
const P11 = ({ revealed }) => (
  <Bg style={{ background:'#010103', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'0 14px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}
        initial={{ opacity:0 }} animate={revealed?{opacity:1}:{opacity:0}}
        transition={{ delay:dd(e.rank), duration:0.7 }}>
        {/* spotlight cone */}
        <motion.div animate={revealed?{opacity:1}:{opacity:0}} transition={{ delay:dd(e.rank)+0.3, duration:0.8 }}
          style={{ position:'absolute', top:0, left:'20%', right:'20%', height:'60%',
            background:`linear-gradient(180deg,${rglow(e.rank)} 0%,transparent 100%)`,
            clipPath:'polygon(30% 0%,70% 0%,100% 100%,0% 100%)', pointerEvents:'none' }}/>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6, position:'relative', zIndex:2 }}/>
        <div style={{ width:'90%', height:HH[i], background:rb(e.rank),
          border:`1.5px solid ${rbo(e.rank)}`, borderRadius:'4px 4px 0 0',
          boxShadow:`0 -4px 20px ${rglow(e.rank)}`,
          display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:2 }}>
          <span style={{ fontSize:34, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P12 — Liquid Fill (platform fills up with color)
// ════════════════════════════════════════════════════════════════════════════
const P12 = ({ revealed }) => (
  <Bg style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
    {POD.map((e,i) => (
      <div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', height:HH[i], position:'relative', overflow:'hidden',
          border:`1px solid ${rbo(e.rank)}`, borderRadius:'4px 4px 0 0', background:'rgba(0,0,0,0.5)' }}>
          {/* liquid fill */}
          <motion.div
            initial={{ height:0 }} animate={revealed?{height:'100%'}:{height:0}}
            transition={{ delay:dd(e.rank), duration:0.9, ease:[0.23,1,0.32,1] }}
            style={{ position:'absolute', bottom:0, left:0, right:0, background:rb(e.rank), boxShadow:`0 -4px 12px ${rglow(e.rank)}` }}>
            {/* wave top */}
            <div style={{ height:4, background:`linear-gradient(90deg,${rbo(e.rank)},${rc(e.rank)},${rbo(e.rank)})`, opacity:0.6 }}/>
          </motion.div>
          <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:900, color:rc(e.rank), zIndex:2 }}>{e.rank}</span>
        </div>
      </div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P13 — Aurora Background (colorful light behind clean platforms)
// ════════════════════════════════════════════════════════════════════════════
const P13 = ({ revealed }) => (
  <Bg style={{ background:'#020308' }}>
    {/* Aurora */}
    <motion.div animate={revealed?{opacity:1}:{opacity:0}} transition={{ duration:1.2 }}
      style={{ position:'absolute', inset:0, background:
        'radial-gradient(ellipse 80% 50% at 20% 60%,rgba(20,100,200,0.18) 0%,transparent 55%),' +
        'radial-gradient(ellipse 60% 40% at 80% 40%,rgba(100,20,200,0.15) 0%,transparent 55%),' +
        'radial-gradient(ellipse 50% 60% at 50% 80%,rgba(0,180,120,0.1) 0%,transparent 55%)',
        pointerEvents:'none' }}/>
    <div style={{ position:'relative', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0', height:'100%' }}>
      {POD.map((e,i) => (
        <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
          initial={{ y:70, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:70,opacity:0}}
          transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
          <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
          <div style={{ width:'90%', height:HH[i], background:'rgba(255,255,255,0.055)',
            backdropFilter:'blur(20px)', border:`1.5px solid ${rbo(e.rank)}`,
            borderRadius:'6px 6px 0 0', boxShadow:`0 -6px 20px ${rglow(e.rank)}`,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:34, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P14 — Mirror Reflection (platform + mirrored reflection below)
// ════════════════════════════════════════════════════════════════════════════
const P14 = ({ revealed }) => (
  <Bg style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'8px 14px 4px' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:60, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:60,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:4 }}/>
        {/* Platform */}
        <div style={{ width:'90%', height:HH[i]*0.55, background:rb(e.rank),
          border:`1.5px solid ${rbo(e.rank)}`, borderRadius:'4px 4px 0 0',
          boxShadow:`0 -4px 14px ${rglow(e.rank)}`,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:26, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
        </div>
        {/* Reflection line */}
        <div style={{ width:'90%', height:1, background:`linear-gradient(90deg,transparent,${rbo(e.rank)},transparent)` }}/>
        {/* Reflection */}
        <div style={{ width:'90%', height:HH[i]*0.35, background:rb(e.rank), opacity:0.25,
          transform:'scaleY(-1)', borderRadius:'0 0 4px 4px',
          maskImage:'linear-gradient(to bottom,rgba(0,0,0,0.4),transparent)' }}>
          <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:22, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
          </div>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P15 — Isometric 3D Blocks
// ════════════════════════════════════════════════════════════════════════════
const isoFace = r => ({
  top:    rb(r).replace('0.1','0.14').replace('0.07','0.1').replace('0.1)','0.14)'),
  left:   rb(r),
  right:  `rgba(0,0,0,0.4)`,
});

const P15 = ({ revealed }) => {
  const iso = { transform:'skewY(-20deg) scaleX(0.866)', transformOrigin:'bottom left' };
  const W=62, D=12;
  return (
    <Bg style={{ background:'#030306', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:16, padding:'8px 20px 4px' }}>
      {POD.map((e,i) => {
        const h = HH[i]; const c = rc(e.rank);
        return (
          <motion.div key={e.rank} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}
            initial={{ y:80, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:80,opacity:0}}
            transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
            <PLabel entry={e} color={c} style={{ marginBottom:8 }}/>
            <div style={{ position:'relative', width:W+D, height:h+D }}>
              {/* Top face */}
              <div style={{ position:'absolute', top:0, left:D/2, width:W, height:D,
                background:rb(e.rank), border:`1px solid ${rbo(e.rank)}`,
                transform:'skewX(-30deg)', borderBottom:'none' }}/>
              {/* Front face */}
              <div style={{ position:'absolute', top:D*0.5, left:0, width:W, height:h,
                background:rb(e.rank), border:`1px solid ${rbo(e.rank)}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:`inset 2px 0 8px rgba(0,0,0,0.3)` }}>
                <span style={{ fontSize:28, fontWeight:900, color:c }}>{e.rank}</span>
              </div>
              {/* Right face */}
              <div style={{ position:'absolute', top:D*0.5, left:W, width:D, height:h,
                background:'rgba(0,0,0,0.35)', border:`1px solid ${rbo(e.rank)}`,
                borderLeft:'none', transform:'skewY(-60deg)', transformOrigin:'top left' }}/>
            </div>
          </motion.div>
        );
      })}
    </Bg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// P16 — Blueprint (technical drawing on dark blue)
// ════════════════════════════════════════════════════════════════════════════
const P16 = ({ revealed }) => (
  <Bg style={{ background:'#040816',
    backgroundImage:'linear-gradient(rgba(80,120,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(80,120,255,0.06) 1px,transparent 1px)',
    backgroundSize:'16px 16px' }}>
    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
      {POD.map((e,i) => (
        <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
          initial={{ opacity:0, scaleY:0 }} animate={revealed?{opacity:1,scaleY:1}:{opacity:0,scaleY:0}}
          style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center', transformOrigin:'bottom' }}
          transition={{ delay:dd(e.rank), duration:0.55, ease:[0.23,1,0.32,1] }}>
          <PLabel entry={e} color='rgba(120,160,255,0.9)' style={{ marginBottom:6 }}/>
          <div style={{ width:'90%', height:HH[i], border:`1.5px solid rgba(80,140,255,0.5)`,
            borderRadius:'2px 2px 0 0', background:'rgba(30,60,180,0.07)',
            position:'relative', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:`0 -4px 16px rgba(80,120,255,0.15)` }}>
            {/* dimension lines */}
            <div style={{ position:'absolute', left:-6, top:4, bottom:4, width:1, background:'rgba(80,140,255,0.3)' }}/>
            <div style={{ position:'absolute', left:-9, top:4, width:4, height:1, background:'rgba(80,140,255,0.3)' }}/>
            <div style={{ position:'absolute', left:-9, bottom:4, width:4, height:1, background:'rgba(80,140,255,0.3)' }}/>
            <span style={{ fontSize:30, fontWeight:900, color:'rgba(100,160,255,0.9)' }}>{e.rank}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P17 — Diamond Shapes (45° rotated platform blocks)
// ════════════════════════════════════════════════════════════════════════════
const P17 = ({ revealed }) => (
  <Bg style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, padding:'14px 16px' }}>
    {POD.map((e,i) => {
      const s = e.rank===1?82:e.rank===2?66:56;
      return (
        <motion.div key={e.rank} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}
          initial={{ scale:0, rotate:45 }} animate={revealed?{scale:1,rotate:0}:{scale:0,rotate:45}}
          transition={{ delay:dd(e.rank), type:'spring', stiffness:220, damping:18 }}>
          <PLabel entry={e} color={rc(e.rank)}/>
          <div style={{ width:s, height:s, transform:'rotate(45deg)',
            background:rb(e.rank), border:`2px solid ${rbo(e.rank)}`,
            boxShadow:`0 0 20px ${rglow(e.rank)}`,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ transform:'rotate(-45deg)', fontSize:s*0.38, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
          </div>
        </motion.div>
      );
    })}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P18 — Crown Above 1st (decorative crown SVG, others plain)
// ════════════════════════════════════════════════════════════════════════════
const P18 = ({ revealed }) => (
  <Bg style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'4px 14px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:80, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:80,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
        {/* Crown only for 1st */}
        {e.rank===1 && (
          <motion.div initial={{ scale:0, rotate:-15 }} animate={revealed?{scale:1,rotate:0}:{scale:0,rotate:-15}}
            transition={{ delay:1.4, type:'spring', stiffness:300, damping:14 }}
            style={{ marginBottom:2 }}>
            <svg width={28} height={20} viewBox="0 0 28 20">
              <polygon points="2,18 4,8 9,14 14,2 19,14 24,8 26,18" fill={G} fillOpacity={0.9} stroke={G} strokeWidth={0.5}/>
            </svg>
          </motion.div>
        )}
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:4 }}/>
        <div style={{ width:'90%', height:HH[i], background:rb(e.rank),
          border:`${e.rank===1?2:1}px solid ${rbo(e.rank)}`, borderRadius:'4px 4px 0 0',
          boxShadow:e.rank===1?`0 -6px 24px ${rglow(1)}`:undefined,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:e.rank===1?36:26, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P19 — Gravity Flip (1st heaviest = at bottom, like reversed chart)
// ════════════════════════════════════════════════════════════════════════════
const P19 = ({ revealed }) => (
  <Bg style={{ display:'flex', alignItems:'flex-start', justifyContent:'center', gap:6, padding:'0 14px 8px', flexDirection:'column-reverse', justifyContent:'flex-end' }}>
    {/* Actually: 3rd at top (shortest), 2nd middle, 1st at bottom (longest) */}
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'center', gap:6, width:'100%' }}>
      {[DATA[0],DATA[1],DATA[2]].map((e,i) => (
        <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
          initial={{ y:-70, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:-70,opacity:0}}
          transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
          <div style={{ width:'90%', height:[110,76,54][i], background:rb(e.rank),
            border:`1.5px solid ${rbo(e.rank)}`, borderRadius:'0 0 4px 4px',
            boxShadow:`0 6px 20px ${rglow(e.rank)}`,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:30, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
          </div>
          <PLabel entry={e} color={rc(e.rank)} style={{ marginTop:5 }}/>
        </motion.div>
      ))}
    </div>
    <div style={{ textAlign:'center', width:'100%', color:'rgba(255,255,255,0.1)', fontSize:8, marginBottom:4 }}>▲ gravity flip</div>
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P20 — Stadium Terraces (many small steps building the height)
// ════════════════════════════════════════════════════════════════════════════
const P20 = ({ revealed }) => (
  <Bg style={{ background:'#030608', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:4, padding:'8px 10px 0' }}>
    {POD.map((e,i) => {
      const steps = e.rank===1?6:e.rank===2?4:3;
      const stepH = HH[i]/steps;
      return (
        <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
          initial={{ y:100, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:100,opacity:0}}
          transition={{ delay:dd(e.rank), type:'spring', stiffness:180, damping:22 }}>
          <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:4 }}/>
          <div style={{ width:'90%', display:'flex', flexDirection:'column', alignItems:'center' }}>
            {Array.from({length:steps},(_,si)=>(
              <div key={si} style={{
                width:`${100-si*10}%`, height:stepH,
                background:rb(e.rank), border:`1px solid ${rbo(e.rank)}`,
                marginBottom:0, display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:si===0?`0 -2px 10px ${rglow(e.rank)}`:undefined }}
              >
                {si===0&&<span style={{ fontSize:22, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>}
              </div>
            ))}
          </div>
        </motion.div>
      );
    })}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P21 — Circuit Board (PCB traces on platform)
// ════════════════════════════════════════════════════════════════════════════
const P21 = ({ revealed }) => (
  <Bg style={{ background:'#020A04', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:80, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:80,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', height:HH[i], background:'rgba(0,20,8,0.9)',
          border:`1px solid rgba(0,200,80,0.2)`, borderTop:`2px solid ${rc(e.rank)}`,
          borderRadius:'2px 2px 0 0', position:'relative', overflow:'hidden',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 -4px 16px ${rglow(e.rank)}` }}>
          {/* PCB traces */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.15 }}>
            <line x1="20%" y1="0%" x2="20%" y2="40%" stroke={rc(e.rank)} strokeWidth="1"/>
            <line x1="20%" y1="40%" x2="60%" y2="40%" stroke={rc(e.rank)} strokeWidth="1"/>
            <line x1="60%" y1="0%" x2="60%" y2="60%" stroke={rc(e.rank)} strokeWidth="1"/>
            <line x1="60%" y1="60%" x2="80%" y2="60%" stroke={rc(e.rank)} strokeWidth="1"/>
            <circle cx="20%" cy="40%" r="3" fill={rc(e.rank)}/>
            <circle cx="60%" cy="60%" r="3" fill={rc(e.rank)}/>
          </svg>
          <span style={{ position:'relative', fontSize:28, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P22 — Lava / Ember (glowing cracks on 1st's platform)
// ════════════════════════════════════════════════════════════════════════════
const P22 = ({ revealed }) => (
  <Bg style={{ background:'#080200', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:80, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:80,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', height:HH[i], position:'relative', overflow:'hidden',
          background:e.rank===1?'rgba(60,10,0,0.8)':rb(e.rank),
          border:`1.5px solid ${rbo(e.rank)}`, borderRadius:'4px 4px 0 0',
          boxShadow:e.rank===1?`0 -8px 28px rgba(255,80,0,0.4)`:undefined,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          {e.rank===1 && <>
            {/* lava cracks */}
            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.5 }}>
              <line x1="30%" y1="100%" x2="50%" y2="60%" stroke="#ff4400" strokeWidth="2"/>
              <line x1="50%" y1="60%" x2="70%" y2="100%" stroke="#ff4400" strokeWidth="2"/>
              <line x1="15%" y1="100%" x2="30%" y2="75%" stroke="#ff6600" strokeWidth="1.5"/>
            </svg>
            {/* lava glow at bottom */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:20,
              background:'linear-gradient(to top,rgba(255,80,0,0.4),transparent)' }}/>
          </>}
          <span style={{ position:'relative', fontSize:34, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P23 — Hexagonal Tops (hex-shaped platform caps)
// ════════════════════════════════════════════════════════════════════════════
const P23 = ({ revealed }) => (
  <Bg style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:80, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:80,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        {/* hex cap */}
        <div style={{ width:'70%' }}>
          <svg viewBox="0 0 60 26" style={{ display:'block', width:'100%' }}>
            <polygon points="15,0 45,0 60,13 45,26 15,26 0,13"
              fill={rc(e.rank)} fillOpacity={0.18} stroke={rc(e.rank)} strokeWidth="1.5"/>
          </svg>
        </div>
        {/* shaft */}
        <div style={{ width:'60%', height:HH[i]-10, background:rb(e.rank),
          border:`1px solid ${rbo(e.rank)}`, borderTop:'none',
          boxShadow:`0 -4px 14px ${rglow(e.rank)}`,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:28, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P24 — Space Platforms (floating in stars)
// ════════════════════════════════════════════════════════════════════════════
const P24 = ({ revealed }) => {
  const stars = Array.from({length:25},(_,i)=>({ x:(i*97)%100, y:(i*61)%100, s:(i%3===0)?1.5:0.8 }));
  return (
    <Bg style={{ background:'#010209' }}>
      {stars.map((st,i)=>(
        <div key={i} style={{ position:'absolute', left:`${st.x}%`, top:`${st.y}%`, width:st.s, height:st.s,
          borderRadius:'50%', background:'white', opacity:0.25, pointerEvents:'none' }}/>
      ))}
      <div style={{ position:'relative', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0', height:'100%' }}>
        {POD.map((e,i) => (
          <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
            initial={{ y:80, opacity:0, scale:0.8 }} animate={revealed?{y:0,opacity:1,scale:1}:{y:80,opacity:0,scale:0.8}}
            transition={{ delay:dd(e.rank), type:'spring', stiffness:180, damping:20 }}>
            <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
            <div style={{ width:'90%', height:HH[i], background:rb(e.rank),
              border:`1.5px solid ${rbo(e.rank)}`, borderRadius:'4px 4px 0 0',
              boxShadow:`0 -4px 20px ${rglow(e.rank)}, 0 0 40px rgba(${e.rank===1?'245,158,11':e.rank===2?'148,163,184':'180,83,9'},0.08)`,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:34, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
            </div>
            {/* thruster glow */}
            <div style={{ width:'60%', height:6, background:`radial-gradient(ellipse,${rglow(e.rank)} 0%,transparent 70%)` }}/>
          </motion.div>
        ))}
      </div>
    </Bg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// P25 — Chalk Blackboard
// ════════════════════════════════════════════════════════════════════════════
const P25 = ({ revealed }) => (
  <Bg style={{ background:'#0d1a0d',
    backgroundImage:'repeating-linear-gradient(0deg,rgba(255,255,255,0.01) 0px,rgba(255,255,255,0.01) 1px,transparent 1px,transparent 24px)' }}>
    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
      {POD.map((e,i) => (
        <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
          initial={{ opacity:0, scaleY:0 }} animate={revealed?{opacity:1,scaleY:1}:{opacity:0,scaleY:0}}
          style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center', transformOrigin:'bottom' }}
          transition={{ delay:dd(e.rank), duration:0.6, ease:[0.23,1,0.32,1] }}>
          <PLabel entry={e} color='rgba(230,230,200,0.8)' style={{ marginBottom:6, fontFamily:'cursive' }}/>
          <div style={{ width:'90%', height:HH[i],
            border:`2px solid rgba(${e.rank===1?'245,200,80':e.rank===2?'180,180,180':'200,140,60'},0.5)`,
            borderStyle:'dashed', borderRadius:'2px 2px 0 0', background:'rgba(255,255,255,0.02)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:34, fontWeight:400, color:rc(e.rank), opacity:0.85, fontFamily:'cursive' }}>{e.rank}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P26 — Trophy Case (glass dome over each platform)
// ════════════════════════════════════════════════════════════════════════════
const P26 = ({ revealed }) => (
  <Bg style={{ background:'#04060a', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:8, padding:'8px 12px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:70, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:70,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:4 }}/>
        {/* glass dome */}
        <div style={{ width:'80%', position:'relative' }}>
          <div style={{ paddingBottom:4, background:'rgba(255,255,255,0.04)',
            backdropFilter:'blur(12px)', border:`1px solid rgba(255,255,255,0.12)`,
            borderBottom:'none', borderRadius:'50% 50% 0 0 / 30% 30% 0 0',
            boxShadow:`inset 0 2px 8px rgba(255,255,255,0.06)` }}>
            <div style={{ height:HH[i]*0.55, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:28, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
            </div>
          </div>
          {/* base plinth */}
          <div style={{ height:14, background:rb(e.rank), border:`1px solid ${rbo(e.rank)}`,
            boxShadow:`0 4px 12px ${rglow(e.rank)}` }}/>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P27 — Force Field (energy shield aesthetic)
// ════════════════════════════════════════════════════════════════════════════
const P27 = ({ revealed }) => (
  <Bg style={{ background:'#030308', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ scaleX:0, opacity:0 }} animate={revealed?{scaleX:1,opacity:1}:{scaleX:0,opacity:0}}
        style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center', transformOrigin:'center bottom' }}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:220, damping:20 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', height:HH[i], position:'relative', overflow:'hidden',
          background:`linear-gradient(180deg,${rb(e.rank)} 0%,rgba(0,0,0,0.6) 100%)`,
          border:`1.5px solid ${rc(e.rank)}`, borderRadius:'4px 4px 0 0',
          boxShadow:`0 0 0 1px ${rglow(e.rank)}, 0 -6px 20px ${rglow(e.rank)}, inset 0 0 20px ${rglow(e.rank)}`,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          {/* hexagonal energy pattern */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.1 }}>
            <pattern id={`hex-${e.rank}`} x="0" y="0" width="20" height="23" patternUnits="userSpaceOnUse">
              <polygon points="10,1 19,6 19,17 10,22 1,17 1,6" fill="none" stroke={rc(e.rank)} strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill={`url(#hex-${e.rank})`}/>
          </svg>
          <span style={{ position:'relative', fontSize:32, fontWeight:900, color:rc(e.rank), textShadow:`0 0 12px ${rc(e.rank)}` }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P28 — Prism Gradient (full-spectrum, each step different hue)
// ════════════════════════════════════════════════════════════════════════════
const prismGrad = r => r===1
  ? 'linear-gradient(160deg,#fde68a,#f59e0b,#dc2626)'
  : r===2
  ? 'linear-gradient(160deg,#e2e8f0,#94a3b8,#475569)'
  : 'linear-gradient(160deg,#fcd34d,#b45309,#7c2d12)';

const P28 = ({ revealed }) => (
  <Bg style={{ background:'#030305', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:80, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:80,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', height:HH[i], background:prismGrad(e.rank),
          borderRadius:'4px 4px 0 0',
          boxShadow:`0 -6px 24px ${rglow(e.rank)}, inset 0 1px 0 rgba(255,255,255,0.3)`,
          display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
          {/* gloss */}
          <div style={{ position:'absolute', inset:'0 0 50% 0', background:'linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 100%)' }}/>
          <span style={{ fontSize:36, fontWeight:900, color:'rgba(0,0,0,0.5)', position:'relative', textShadow:'0 1px 0 rgba(255,255,255,0.4)' }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P29 — Thick Border Frame (emphasised border, minimal inside)
// ════════════════════════════════════════════════════════════════════════════
const P29 = ({ revealed }) => (
  <Bg style={{ background:'#020204', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 14px 0' }}>
    {POD.map((e,i) => (
      <motion.div key={e.rank} style={{ flex:1, maxWidth:96, display:'flex', flexDirection:'column', alignItems:'center' }}
        initial={{ y:80, opacity:0 }} animate={revealed?{y:0,opacity:1}:{y:80,opacity:0}}
        transition={{ delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}>
        <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
        <div style={{ width:'90%', height:HH[i], background:'transparent',
          borderTop:`4px solid ${rc(e.rank)}`, borderLeft:`4px solid ${rc(e.rank)}`, borderRight:`4px solid ${rc(e.rank)}`,
          borderRadius:'4px 4px 0 0',
          boxShadow:`0 -4px 20px ${rglow(e.rank)}, inset 0 0 16px rgba(0,0,0,0.3)`,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:36, fontWeight:900, color:rc(e.rank), opacity:0.7 }}>{e.rank}</span>
        </div>
      </motion.div>
    ))}
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
// P30 — Grand Finale (max drama: 1st center+large, bursts in last)
// ════════════════════════════════════════════════════════════════════════════
const P30 = ({ revealed }) => (
  <Bg style={{ background:'#030206', position:'relative' }}>
    {/* background burst for 1st */}
    <motion.div animate={revealed?{opacity:1,scale:1}:{opacity:0,scale:0.5}}
      transition={{ delay:1.3, duration:0.8 }}
      style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 50% 60% at 50% 70%,rgba(245,158,11,0.08) 0%,transparent 60%)', pointerEvents:'none' }}/>
    <div style={{ position:'relative', display:'flex', alignItems:'flex-end', justifyContent:'center', gap:6, padding:'8px 8px 0', height:'100%' }}>
      {[
        { e:DATA[1], h:76,  w:'26%', fs:28 },
        { e:DATA[0], h:120, w:'36%', fs:46, extra:true },
        { e:DATA[2], h:56,  w:'26%', fs:24 },
      ].map(({ e, h, w, fs, extra }) => (
        <motion.div key={e.rank}
          initial={extra?{scale:0,opacity:0,y:20}:{y:80,opacity:0}}
          animate={revealed?(extra?{scale:1,opacity:1,y:0}:{y:0,opacity:1}):(extra?{scale:0,opacity:0,y:20}:{y:80,opacity:0})}
          transition={extra
            ? { delay:1.2, type:'spring', stiffness:260, damping:16 }
            : { delay:dd(e.rank), type:'spring', stiffness:200, damping:22 }}
          style={{ width:w, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <PLabel entry={e} color={rc(e.rank)} style={{ marginBottom:6 }}/>
          <div style={{ width:'100%', height:h, background:rb(e.rank),
            border:`${extra?2:1}px solid ${rbo(e.rank)}`, borderRadius:'6px 6px 0 0',
            boxShadow:extra?`0 -12px 40px ${rglow(1)}, 0 0 60px rgba(245,158,11,0.1)`:undefined,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:fs, fontWeight:900, color:rc(e.rank) }}>{e.rank}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════
const RENDERS = [P1,P2,P3,P4,P5,P6,P7,P8,P9,P10,P11,P12,P13,P14,P15,P16,P17,P18,P19,P20,P21,P22,P23,P24,P25,P26,P27,P28,P29,P30];

const VARIANTS = [
  { id:1,  name:"Olympic Classic",    desc:"פלטפורמה מדורגת נקייה ביותר" },
  { id:2,  name:"Floating Discs",     desc:"עמודים עגולים מרחפים עם צל" },
  { id:3,  name:"LED Underglow",      desc:"רצועת LED זוהרת מתחת לפלטפורמה" },
  { id:4,  name:"Crystal Glass",      desc:"פלטפורמות שקופות, זכוכית קריסטל" },
  { id:5,  name:"Metallic Sheen",     desc:"גרדיאנט מתכת אמיתי זהב/כסף/ברונזה" },
  { id:6,  name:"Ice Blocks",         desc:"בלוקי קרח, אור כחול קר" },
  { id:7,  name:"Wireframe",          desc:"מסגרת תיל בלבד, פינות מודגשות" },
  { id:8,  name:"Hologram Scan",      desc:"סריקת הולוגרם sci-fi" },
  { id:9,  name:"Marble Columns",     desc:"עמודים קלאסיים עם כיפה וראש" },
  { id:10, name:"Arc Stage",          desc:"פריסה בחצי עיגול כמו במה" },
  { id:11, name:"Spotlight Stage",    desc:"פנס אור קוני מלמעלה על כל מקום" },
  { id:12, name:"Liquid Fill",        desc:"פלטפורמה מתמלאת בנוזל צבעוני" },
  { id:13, name:"Aurora BG",          desc:"זכוכית קלאסית על אורורה" },
  { id:14, name:"Mirror Reflection",  desc:"פלטפורמה + השתקפות למטה" },
  { id:15, name:"Isometric 3D",       desc:"בלוקים איזומטריים תלת-ממדיים" },
  { id:16, name:"Blueprint",          desc:"תכנית טכנית על רקע כחול כהה" },
  { id:17, name:"Diamond Shapes",     desc:"פלטפורמות מסובבות 45°" },
  { id:18, name:"Crown",              desc:"כתר מעל מקום 1 עם אנימציה" },
  { id:19, name:"Gravity Flip",       desc:"פודיום הפוך — 1 כבד = נמוך ביותר" },
  { id:20, name:"Stadium Terraces",   desc:"מדרגות מרובות לכל דרגה" },
  { id:21, name:"Circuit Board",      desc:"עיצוב PCB על הפלטפורמה" },
  { id:22, name:"Lava & Ember",       desc:"סדקי לבה בוערת למקום 1" },
  { id:23, name:"Hexagonal Tops",     desc:"כיפת שישה צלעות על הפלטפורמה" },
  { id:24, name:"Space Platform",     desc:"רקע כוכבים, פלטפורמות מרחפות" },
  { id:25, name:"Chalk Board",        desc:"גיר על לוח, סגנון ידני" },
  { id:26, name:"Trophy Case",        desc:"כיפת זכוכית מעל כל מיקום" },
  { id:27, name:"Force Field",        desc:"מגן אנרגיה, תבנית שישה צלעות" },
  { id:28, name:"Prism Gradient",     desc:"גרדיאנט ספקטרלי מלא" },
  { id:29, name:"Thick Frame",        desc:"מסגרת עבה צבעונית, פנים ריק" },
  { id:30, name:"Grand Finale",       desc:"1 גדול ביותר, נחשף אחרון עם פיצוץ" },
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
          <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-black"/>
          </div>
        )}
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-white/70 text-[11px] font-medium leading-tight truncate">{variant.id + 25}. {variant.name}</p>
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
            <span className="text-white/30 text-xs mr-1.5">#{variant.id + 25}</span>
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
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-black"
              style={{ background:"linear-gradient(135deg,#f59e0b,#fbbf24)" }}>
              <Play className="w-4 h-4" /> הצג תוצאות
            </button>
          ) : (
            <button onClick={() => setRevealed(false)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm"
              style={{ background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.1)" }}>
              <RotateCcw className="w-3.5 h-3.5" /> אפס
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminPodiumDemo2() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Podium Vol.2 — 30 פודיומים</h2>
        <p className="text-slate-500 text-sm mt-0.5">כולם פודיום ויזואלי · מספרים בלבד · חשיפה 3→2→1</p>
      </div>
      {selected && (
        <div className="text-[12px] px-3 py-1.5 rounded-lg text-white/50 inline-block"
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
          ✓ #{selected+25} {VARIANTS[selected-1]?.name}
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
