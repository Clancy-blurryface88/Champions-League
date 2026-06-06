import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const PLAYERS = [
  { id: 1, name: 'שחקן 1',  rounds: [3, 2, 1] },
  { id: 2, name: 'שחקן 2',  rounds: [1, 1, 2], isCurrentUser: true },
  { id: 3, name: 'שחקן 3',  rounds: [4, 5, 3] },
  { id: 4, name: 'שחקן 4',  rounds: [2, 3, 4] },
  { id: 5, name: 'שחקן 5',  rounds: [5, 4, 5] },
  { id: 6, name: 'Player 6', rounds: [6, 6, 6] },
];
const ROUNDS = ['מחזור 1', 'מחזור 2', 'מחזור 3'];
const N = PLAYERS.length;

const rc  = r => r===1?'#FFD700':r===2?'#C0C0C0':r===3?'#CD7F32':'rgba(255,255,255,0.45)';
const rbg = r =>
  r===1?'linear-gradient(135deg,rgba(250,204,21,0.28),rgba(245,158,11,0.28))':
  r===2?'linear-gradient(135deg,rgba(209,213,219,0.22),rgba(156,163,175,0.22))':
  r===3?'linear-gradient(135deg,rgba(205,127,50,0.22),rgba(180,100,30,0.22))':
  'rgba(30,41,59,0.55)';

// ── 1. Glassmorphism Float Cards ──────────────────────────────────────────────
const Design1 = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
    {PLAYERS.map((p,i) => (
      <motion.div key={p.id}
        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06, type:'spring', stiffness:260, damping:22 }}
        whileHover={{ y:-3, boxShadow:`0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${p.isCurrentUser?'rgba(59,130,246,0.4)':'rgba(255,255,255,0.12)'}` }}
        style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderRadius:14,
          background:p.isCurrentUser?'rgba(59,130,246,0.08)':'rgba(255,255,255,0.05)',
          backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
          border:`1px solid ${p.isCurrentUser?'rgba(59,130,246,0.25)':'rgba(255,255,255,0.1)'}`,
          boxShadow:'0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
          cursor:'default' }}>
        <span style={{ color:'rgba(255,255,255,0.25)', fontSize:10, width:14 }}>{i+1}</span>
        <span style={{ flex:1, fontSize:13, fontWeight:600, color:p.isCurrentUser?'#93c5fd':'#e2e8f0' }}>{p.name}</span>
        {p.rounds.map((r,ri) => (
          <div key={ri} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
            <span style={{ fontSize:8, color:'rgba(255,255,255,0.25)' }}>{ROUNDS[ri].replace('מחזור ','R')}</span>
            {r ? <div style={{ width:28, height:28, borderRadius:8, background:rbg(r), border:`1px solid ${rc(r)}55`,
              display:'flex', alignItems:'center', justifyContent:'center', color:rc(r), fontWeight:800, fontSize:13 }}>{r}</div>
              : <span style={{ color:'rgba(255,255,255,0.1)', fontSize:12 }}>–</span>}
          </div>
        ))}
      </motion.div>
    ))}
  </div>
);

// ── 2. Neumorphic Dark ────────────────────────────────────────────────────────
const Design2 = () => (
  <div style={{ background:'#0d1526', borderRadius:14, padding:16 }}>
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
      <thead><tr>
        <th style={{ textAlign:'right', padding:'6px 10px', color:'rgba(255,255,255,0.3)', fontSize:10 }}>משתתף</th>
        {ROUNDS.map(r=><th key={r} style={{ padding:'6px 10px', color:'rgba(255,255,255,0.3)', fontSize:10 }}>{r}</th>)}
      </tr></thead>
      <tbody>{PLAYERS.map((p,i)=>(
        <tr key={p.id} style={{ borderTop:'1px solid rgba(255,255,255,0.03)' }}>
          <td style={{ padding:'8px 10px', color:p.isCurrentUser?'#93c5fd':'#cbd5e1', fontSize:12 }}>
            <span style={{ color:'rgba(255,255,255,0.2)', marginLeft:6, fontSize:10 }}>{i+1}</span>{p.name}
          </td>
          {p.rounds.map((r,ri)=>(
            <td key={ri} style={{ padding:'6px 10px', textAlign:'center' }}>
              {r ? <div style={{ width:32, height:32, borderRadius:8, margin:'auto',
                background:'#0d1526',
                boxShadow:r<=3?`4px 4px 8px rgba(0,0,0,0.5), -2px -2px 6px ${rc(r)}22, inset 0 0 0 1px ${rc(r)}33`
                  :'4px 4px 8px rgba(0,0,0,0.5), -2px -2px 5px rgba(255,255,255,0.03)',
                display:'flex', alignItems:'center', justifyContent:'center', color:rc(r), fontWeight:800, fontSize:13 }}>{r}</div>
              : <span style={{ color:'rgba(255,255,255,0.1)' }}>–</span>}
            </td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

// ── 3. Neon Pulse ─────────────────────────────────────────────────────────────
const NeonCell = ({ r }) => {
  const color = rc(r);
  return (
    <motion.div animate={{ boxShadow:['0 0 6px '+color+'88, 0 0 14px '+color+'44','0 0 14px '+color+'cc, 0 0 28px '+color+'66','0 0 6px '+color+'88, 0 0 14px '+color+'44'] }}
      transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
      style={{ width:30, height:30, borderRadius:6, border:`1px solid ${color}99`, margin:'auto',
        display:'flex', alignItems:'center', justifyContent:'center', color, fontWeight:900, fontSize:13,
        background:`${color}0f`, textShadow:`0 0 8px ${color}` }}>
      {r}
    </motion.div>
  );
};
const Design3 = () => (
  <div style={{ background:'#02040f', borderRadius:12, padding:14 }}>
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
      <thead><tr>
        <th style={{ textAlign:'right', padding:'6px 10px', color:'rgba(255,255,255,0.2)', fontSize:10 }}>שחקן</th>
        {ROUNDS.map(r=><th key={r} style={{ padding:'6px 10px', color:'rgba(255,255,255,0.2)', fontSize:10 }}>{r}</th>)}
      </tr></thead>
      <tbody>{PLAYERS.map(p=>(
        <tr key={p.id} style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
          <td style={{ padding:'8px 10px', color:p.isCurrentUser?'#818cf8':'#64748b', fontFamily:'monospace', fontSize:11 }}>{p.name}</td>
          {p.rounds.map((r,ri)=>(
            <td key={ri} style={{ padding:'6px 10px', textAlign:'center' }}>
              {r ? <NeonCell r={r}/> : <span style={{ color:'rgba(255,255,255,0.08)' }}>·</span>}
            </td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

// ── 4. Editorial / Magazine ───────────────────────────────────────────────────
const Design4 = () => (
  <div style={{ fontFamily:"'Georgia', serif" }}>
    <div style={{ borderBottom:'2px solid rgba(255,255,255,0.6)', paddingBottom:6, marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
      <span style={{ fontSize:10, letterSpacing:3, color:'rgba(255,255,255,0.5)', textTransform:'uppercase' }}>Ranking History</span>
      <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)' }}>World Cup 2026</span>
    </div>
    {PLAYERS.map((p,i) => (
      <div key={p.id} style={{ display:'flex', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'8px 0' }}>
        <span style={{ fontSize:28, fontWeight:900, color:'rgba(255,255,255,0.06)', width:36, lineHeight:1, flexShrink:0 }}>{i+1}</span>
        <span style={{ flex:1, fontSize:13, color:p.isCurrentUser?'#fde68a':'rgba(255,255,255,0.8)', fontStyle:p.isCurrentUser?'italic':'normal', fontWeight:p.isCurrentUser?700:400 }}>{p.name}</span>
        {p.rounds.map((r,ri)=>(
          <div key={ri} style={{ width:44, textAlign:'center', borderLeft:'1px solid rgba(255,255,255,0.07)', paddingLeft:8 }}>
            {r ? <>
              <div style={{ fontSize:20, fontWeight:900, color:rc(r), lineHeight:1 }}>{r}</div>
              <div style={{ fontSize:8, color:'rgba(255,255,255,0.3)', marginTop:1 }}>R{ri+1}</div>
            </> : <span style={{ color:'rgba(255,255,255,0.1)' }}>–</span>}
          </div>
        ))}
      </div>
    ))}
  </div>
);

// ── 5. Apple Dynamic Island Pills ─────────────────────────────────────────────
const Design5 = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
    {PLAYERS.map((p,i) => (
      <motion.div key={p.id} layout
        style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:999,
          background:p.isCurrentUser?'rgba(59,130,246,0.15)':'rgba(255,255,255,0.06)',
          border:`1px solid ${p.isCurrentUser?'rgba(59,130,246,0.3)':'rgba(255,255,255,0.09)'}`,
          backdropFilter:'blur(12px)' }}>
        <span style={{ fontSize:10, color:'rgba(255,255,255,0.25)', width:14 }}>{i+1}</span>
        <span style={{ flex:1, fontSize:12, fontWeight:600, color:p.isCurrentUser?'#93c5fd':'#e2e8f0' }}>{p.name}</span>
        {p.rounds.map((r,ri)=>(
          <motion.div key={ri} whileHover={{ scale:1.15 }}
            style={{ padding:'3px 10px', borderRadius:999, background:rbg(r), border:`1px solid ${rc(r)}50`,
              fontSize:11, fontWeight:800, color:rc(r) }}>{r||'–'}</motion.div>
        ))}
      </motion.div>
    ))}
  </div>
);

// ── 6. Metro / Subway Map ─────────────────────────────────────────────────────
const Design6 = () => {
  const lineColors = ['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#14b8a6'];
  return (
    <div>
      <div style={{ display:'flex', paddingRight:90, marginBottom:8 }}>
        {ROUNDS.map((r,i)=><div key={i} style={{ flex:1, textAlign:'center', fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:1 }}>{r}</div>)}
      </div>
      {PLAYERS.map((p,pi)=>{
        const col = lineColors[pi];
        return (
          <div key={p.id} style={{ display:'flex', alignItems:'center', marginBottom:10 }}>
            <div style={{ width:90, fontSize:11, color:'#e2e8f0', flexShrink:0, display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:col, flexShrink:0 }}/>
              <span style={{ color:p.isCurrentUser?col:'rgba(255,255,255,0.6)', fontWeight:p.isCurrentUser?700:400 }}>{p.name.slice(0,7)}</span>
            </div>
            <div style={{ flex:1, position:'relative', height:28, display:'flex', alignItems:'center' }}>
              <div style={{ position:'absolute', top:'50%', left:0, right:0, height:2, background:col, opacity:0.3, transform:'translateY(-50%)' }}/>
              {p.rounds.map((r,ri)=>(
                <div key={ri} style={{ flex:1, display:'flex', justifyContent:'center', position:'relative', zIndex:1 }}>
                  <motion.div whileHover={{ scale:1.2 }}
                    style={{ width:26, height:26, borderRadius:'50%', background:'#0f172a', border:`2.5px solid ${col}`,
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:col, cursor:'default' }}>{r||'·'}</motion.div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── 7. Playing Cards ──────────────────────────────────────────────────────────
const suits = ['♠','♥','♦','♣','★','◆'];
const Design7 = () => (
  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
    <thead><tr>
      <th style={{ textAlign:'right', padding:'6px 10px', color:'rgba(255,255,255,0.4)' }}>שחקן</th>
      {ROUNDS.map(r=><th key={r} style={{ padding:'6px 10px', color:'rgba(255,255,255,0.4)' }}>{r}</th>)}
    </tr></thead>
    <tbody>{PLAYERS.map((p,pi)=>(
      <tr key={p.id} style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <td style={{ padding:'8px 10px', color:p.isCurrentUser?'#fde68a':'#e2e8f0', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ color:pi<2?'#ef4444':pi<4?'#1e293b':'rgba(255,255,255,0.5)', fontSize:12 }}>{suits[pi]}</span>{p.name}
        </td>
        {p.rounds.map((r,ri)=>(
          <td key={ri} style={{ padding:'5px 8px', textAlign:'center' }}>
            {r ? <div style={{ width:30, height:38, borderRadius:4, background:'rgba(255,255,255,0.96)', border:'1px solid rgba(255,255,255,0.2)',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', padding:'3px 0', margin:'auto',
              boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>
              <span style={{ fontSize:9, color:pi<2?'#ef4444':'#1e293b', fontWeight:900, lineHeight:1 }}>{suits[pi]}</span>
              <span style={{ fontSize:14, fontWeight:900, color:pi<2?'#ef4444':'#1e293b', lineHeight:1 }}>{r}</span>
              <span style={{ fontSize:9, color:pi<2?'#ef4444':'#1e293b', fontWeight:900, lineHeight:1, transform:'rotate(180deg)' }}>{suits[pi]}</span>
            </div> : <span style={{ color:'rgba(255,255,255,0.15)' }}>–</span>}
          </td>
        ))}
      </tr>
    ))}</tbody>
  </table>
);

// ── 8. Holographic Iridescent ─────────────────────────────────────────────────
const Design8 = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} whileHover={{ scale:1.01 }}
        style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px', borderRadius:10,
          background:'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.06), rgba(236,72,153,0.06))',
          border:'1px solid rgba(255,255,255,0.08)',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize:10, color:'rgba(255,255,255,0.25)', width:14 }}>{i+1}</span>
        <span style={{ flex:1, fontSize:12, fontWeight:600,
          background:p.isCurrentUser?'linear-gradient(90deg,#818cf8,#c084fc)':'linear-gradient(90deg,#94a3b8,#cbd5e1)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{p.name}</span>
        {p.rounds.map((r,ri)=>(
          <div key={ri} style={{ width:30, height:30, borderRadius:6, margin:'0 2px',
            background:r?`linear-gradient(135deg, ${rc(r)}33, ${rc(r)}11)`:'rgba(255,255,255,0.03)',
            border:r?`1px solid ${rc(r)}55`:'1px solid rgba(255,255,255,0.05)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:12,
            color:r?rc(r):'rgba(255,255,255,0.15)',
            boxShadow:r?`0 0 10px ${rc(r)}22`:'none' }}>{r||'–'}</div>
        ))}
      </motion.div>
    ))}
  </div>
);

// ── 9. Circuit Board ──────────────────────────────────────────────────────────
const Design9 = () => (
  <div style={{ background:'#001a0d', border:'1px solid #00ff4411', borderRadius:10, padding:14, fontFamily:'monospace' }}>
    <div style={{ color:'#00ff44', fontSize:9, marginBottom:10, letterSpacing:2 }}>// MATCH RANKING HISTORY v2.0</div>
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
      <thead><tr>
        <th style={{ textAlign:'left', padding:'4px 8px', color:'#00ff4466', borderBottom:'1px solid #00ff4422' }}>PLAYER_ID</th>
        {ROUNDS.map((r,i)=><th key={i} style={{ padding:'4px 8px', color:'#00ff4466', borderBottom:'1px solid #00ff4422' }}>RND_{i+1}</th>)}
      </tr></thead>
      <tbody>{PLAYERS.map(p=>(
        <tr key={p.id} style={{ borderBottom:'1px solid #00ff4408' }}>
          <td style={{ padding:'6px 8px', color:p.isCurrentUser?'#00ff44':'#00ff4488' }}>{`> ${p.name}`}</td>
          {p.rounds.map((r,ri)=>(
            <td key={ri} style={{ padding:'6px 8px', textAlign:'center' }}>
              {r?<span style={{ color:r===1?'#ffff00':r===2?'#00ff44':r===3?'#00aaff':'#00ff4455', fontWeight:700 }}>P{r}</span>
              :<span style={{ color:'#ffffff11' }}>null</span>}
            </td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

// ── 10. Polaroid Frames ───────────────────────────────────────────────────────
const Design10 = () => (
  <div style={{ overflowX:'auto' }}>
    <div style={{ display:'flex', gap:6, minWidth:'max-content', padding:'4px 0 12px' }}>
      {PLAYERS.map((p,i)=>(
        <motion.div key={p.id} whileHover={{ rotate:0, y:-6 }} initial={{ rotate:(i%2===0?-1:1)*1.5 }}
          style={{ background:'#f8f8f4', borderRadius:3, padding:'8px 8px 20px', width:90,
            boxShadow:'0 4px 16px rgba(0,0,0,0.5)', cursor:'default' }}>
          <div style={{ background:p.isCurrentUser?'#dbeafe':'#1e293b', height:54, borderRadius:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2 }}>
            <span style={{ fontSize:20, lineHeight:1 }}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'👤'}</span>
            <div style={{ display:'flex', gap:2 }}>
              {p.rounds.map((r,ri)=>(
                <div key={ri} style={{ width:18, height:18, borderRadius:3, background:rbg(r), border:`1px solid ${rc(r)}66`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:rc(r) }}>{r||'–'}</div>
              ))}
            </div>
          </div>
          <div style={{ marginTop:6, textAlign:'center', fontSize:9, color:'#374151', fontFamily:'cursive', lineHeight:1.2 }}>{p.name}</div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ── 11. TV Broadcast Score Bar ────────────────────────────────────────────────
const Design11 = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
    <div style={{ display:'flex', background:'rgba(0,0,0,0.4)', borderRadius:4, padding:'4px 10px', marginBottom:4 }}>
      <span style={{ flex:1, fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, letterSpacing:2 }}>PLAYER</span>
      {ROUNDS.map((r,i)=><span key={i} style={{ width:60, textAlign:'center', fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, letterSpacing:1 }}>RD {i+1}</span>)}
    </div>
    {PLAYERS.map((p,i)=>(
      <motion.div key={p.id} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.07 }}
        style={{ display:'flex', alignItems:'center', borderRadius:4, overflow:'hidden',
          background:p.isCurrentUser?'linear-gradient(90deg,rgba(37,99,235,0.8),rgba(29,78,216,0.6))':'linear-gradient(90deg,rgba(15,23,42,0.9),rgba(30,41,59,0.7))',
          border:`1px solid ${p.isCurrentUser?'rgba(59,130,246,0.4)':'rgba(255,255,255,0.06)'}` }}>
        <div style={{ padding:'7px 10px', flex:1, display:'flex', alignItems:'center', gap:8, borderRight:'1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ width:18, height:18, borderRadius:3, background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.5)', flexShrink:0 }}>{i+1}</span>
          <span style={{ fontSize:12, fontWeight:700, color:'#fff', letterSpacing:0.5 }}>{p.name}</span>
        </div>
        {p.rounds.map((r,ri)=>(
          <div key={ri} style={{ width:60, textAlign:'center', padding:'7px 0', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
            {r?<span style={{ fontWeight:900, fontSize:15, color:rc(r), textShadow:`0 0 8px ${rc(r)}66` }}>{r}</span>
            :<span style={{ color:'rgba(255,255,255,0.15)', fontSize:12 }}>–</span>}
          </div>
        ))}
      </motion.div>
    ))}
  </div>
);

// ── 12. Constellation Star Map ────────────────────────────────────────────────
const Design12 = () => {
  const W=280, H=120, PAD=18;
  const xStep=(W-PAD*2)/(ROUNDS.length-1);
  const yStep=(H-PAD*2)/(N-1);
  const colors=['#FFD700','#60a5fa','#f472b6','#34d399','#fb923c','#a78bfa'];
  return (
    <div style={{ background:'#02061a', borderRadius:12, padding:12 }}>
      <svg width={W} height={H} style={{ display:'block', margin:'0 auto' }}>
        {/* Star field */}
        {Array.from({length:30},(_,i)=>(
          <circle key={i} cx={Math.random()*W} cy={Math.random()*H} r={Math.random()*1} fill="white" opacity={Math.random()*0.4+0.1}/>
        ))}
        {PLAYERS.map((p,pi)=>{
          const col=colors[pi];
          const pts=p.rounds.map((r,ri)=>r?[PAD+ri*xStep, PAD+(r-1)*yStep]:null).filter(Boolean);
          return (
            <g key={p.id}>
              {pts.slice(1).map(([x,y],i)=>(
                <line key={i} x1={pts[i][0]} y1={pts[i][1]} x2={x} y2={y} stroke={col} strokeWidth={0.8} strokeOpacity={0.3} strokeDasharray="3 2"/>
              ))}
              {p.rounds.map((r,ri)=>r?(
                <g key={ri}>
                  <circle cx={PAD+ri*xStep} cy={PAD+(r-1)*yStep} r={p.isCurrentUser?5:3.5} fill={col} fillOpacity={0.9}/>
                  <circle cx={PAD+ri*xStep} cy={PAD+(r-1)*yStep} r={p.isCurrentUser?9:6} fill="none" stroke={col} strokeWidth={0.5} strokeOpacity={0.3}/>
                  <text x={PAD+ri*xStep+6} y={PAD+(r-1)*yStep+3} fontSize={7} fill={col} fillOpacity={0.7}>{r}</text>
                </g>
              ):null)}
            </g>
          );
        })}
        {ROUNDS.map((r,i)=><text key={i} x={PAD+i*xStep} y={H-4} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.25)">{r}</text>)}
      </svg>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center', marginTop:4 }}>
        {PLAYERS.map((p,pi)=><span key={p.id} style={{ fontSize:9, color:colors[pi], display:'flex', alignItems:'center', gap:3 }}>✦ {p.name}</span>)}
      </div>
    </div>
  );
};

// ── 13. Flip Board (airport style) ────────────────────────────────────────────
const FlipCell = ({ r }) => (
  <div style={{ width:30, height:36, perspective:200, margin:'auto' }}>
    <motion.div animate={{ rotateX:[0,90,0] }} transition={{ duration:0.5, delay:Math.random()*0.3 }}
      style={{ width:'100%', height:'100%', position:'relative' }}>
      <div style={{ background:'#1a1a2e', border:'1px solid #333', borderRadius:3, height:'100%',
        display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:0 }}>
        <div style={{ width:'100%', height:'50%', background:'rgba(0,0,0,0.2)', borderBottom:'1px solid #000',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontWeight:900, fontSize:14, color:rc(r), fontFamily:'monospace' }}>{r}</span>
        </div>
        <div style={{ width:'100%', height:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontWeight:900, fontSize:14, color:rc(r)+'88', fontFamily:'monospace' }}>{r}</span>
        </div>
      </div>
    </motion.div>
  </div>
);
const Design13 = () => (
  <div style={{ background:'#0a0a14', borderRadius:10, padding:14 }}>
    <div style={{ color:'#555', fontSize:9, textAlign:'center', marginBottom:8, letterSpacing:3 }}>DEPARTURES — RANKING</div>
    <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:'4px 4px', fontSize:11 }}>
      <thead><tr>
        <th style={{ textAlign:'left', color:'#444', fontFamily:'monospace', padding:'4px 8px' }}>NAME</th>
        {ROUNDS.map((r,i)=><th key={i} style={{ color:'#444', fontFamily:'monospace', padding:'4px 0' }}>R{i+1}</th>)}
      </tr></thead>
      <tbody>{PLAYERS.map(p=>(
        <tr key={p.id}>
          <td style={{ padding:'4px 8px', color:p.isCurrentUser?'#fbbf24':'#555', fontFamily:'monospace', fontSize:10 }}>{p.name.toUpperCase()}</td>
          {p.rounds.map((r,ri)=>(
            <td key={ri} style={{ padding:'4px 0', textAlign:'center' }}>
              {r?<FlipCell r={r}/>:<span style={{ color:'#222', fontFamily:'monospace' }}>--</span>}
            </td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

// ── 14. Gradient Waterfall ────────────────────────────────────────────────────
const Design14 = () => {
  const gradients = [
    'linear-gradient(90deg,rgba(245,197,24,0.15),rgba(245,197,24,0.02))',
    'linear-gradient(90deg,rgba(192,192,192,0.12),rgba(192,192,192,0.02))',
    'linear-gradient(90deg,rgba(205,127,50,0.12),rgba(205,127,50,0.02))',
    'linear-gradient(90deg,rgba(100,116,139,0.1),rgba(100,116,139,0.02))',
    'linear-gradient(90deg,rgba(71,85,105,0.1),rgba(71,85,105,0.02))',
    'linear-gradient(90deg,rgba(51,65,85,0.1),rgba(51,65,85,0.02))',
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      {PLAYERS.map((p,i)=>(
        <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:8,
          background:gradients[i], borderLeft:`3px solid ${rc(i+1)}` }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', width:14 }}>{i+1}</span>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:p.isCurrentUser?'#fde68a':'#e2e8f0' }}>{p.name}</span>
          {p.rounds.map((r,ri)=>(
            <div key={ri} style={{ width:28, height:28, borderRadius:'50%', background:rbg(r), border:`1px solid ${rc(r)}44`,
              display:'flex', alignItems:'center', justifyContent:'center', color:rc(r), fontWeight:800, fontSize:12 }}>{r||'–'}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ── 15. Vinyl Record ──────────────────────────────────────────────────────────
const Design15 = () => {
  const colors=['#FFD700','#60a5fa','#f472b6','#34d399','#fb923c','#a78bfa'];
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
      {PLAYERS.map((p,pi)=>{
        const col=colors[pi];
        return (
          <div key={p.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <motion.div animate={{ rotate:360 }} transition={{ duration:4, repeat:Infinity, ease:'linear' }}
              style={{ width:60, height:60, borderRadius:'50%', background:`conic-gradient(${col}22 0deg, #1a1a2e 30deg, ${col}11 60deg, #0f0f1a 90deg, ${col}22 120deg, #1a1a2e 150deg, ${col}11 180deg, #0f0f1a 210deg, ${col}22 240deg, #1a1a2e 270deg, ${col}11 300deg, #0f0f1a 330deg)`,
                border:`2px solid ${col}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:'#0d1117', border:`2px solid ${col}66`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:col }}>
                {p.rounds[p.rounds.length-1]||'?'}
              </div>
            </motion.div>
            <span style={{ fontSize:9, color:p.isCurrentUser?col:'rgba(255,255,255,0.4)' }}>{p.name.slice(0,6)}</span>
            <div style={{ display:'flex', gap:3 }}>
              {p.rounds.map((r,ri)=>(
                <div key={ri} style={{ width:14, height:14, borderRadius:3, background:rbg(r), border:`1px solid ${rc(r)}44`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:7, fontWeight:800, color:rc(r) }}>{r||'–'}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── 16. Rank Bubbles ──────────────────────────────────────────────────────────
const Design16 = () => {
  const bubbleSize = r => 38 - (r-1)*4;
  return (
    <div>
      {ROUNDS.map((round,ri)=>(
        <div key={ri} style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginBottom:6, letterSpacing:1 }}>◆ {round}</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:52 }}>
            {[...PLAYERS].filter(p=>p.rounds[ri]).sort((a,b)=>a.rounds[ri]-b.rounds[ri]).map(p=>{
              const r=p.rounds[ri];
              const size=bubbleSize(r);
              return (
                <motion.div key={p.id} initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300, damping:20, delay:r*0.05 }}
                  title={p.name}
                  style={{ width:size, height:size, borderRadius:'50%', background:rbg(r), border:`2px solid ${rc(r)}`,
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0,
                    boxShadow:`0 0 ${r===1?14:8}px ${rc(r)}44` }}>
                  <span style={{ fontWeight:900, fontSize:size>32?13:10, color:rc(r), lineHeight:1 }}>{r}</span>
                  <span style={{ fontSize:7, color:'rgba(255,255,255,0.4)', lineHeight:1 }}>{p.name.slice(0,3)}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── 17. Progress Arc ──────────────────────────────────────────────────────────
const ArcCell = ({ r }) => {
  const pct = (N - r) / (N - 1);
  const R2 = 14, cx = 18, cy = 18, circumference = Math.PI * R2;
  const strokeDash = circumference * pct;
  return (
    <svg width={36} height={22} style={{ display:'block', margin:'auto' }}>
      <path d={`M ${cx-R2} ${cy} A ${R2} ${R2} 0 0 1 ${cx+R2} ${cy}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} strokeLinecap="round"/>
      <motion.path d={`M ${cx-R2} ${cy} A ${R2} ${R2} 0 0 1 ${cx+R2} ${cy}`} fill="none" stroke={rc(r)} strokeWidth={3} strokeLinecap="round"
        initial={{ pathLength:0 }} animate={{ pathLength:pct }} transition={{ duration:0.8, ease:[0.23,1,0.32,1] }}/>
      <text x={cx} y={cy-3} textAnchor="middle" fontSize={10} fontWeight={800} fill={rc(r)}>{r}</text>
    </svg>
  );
};
const Design17 = () => (
  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
    <thead><tr>
      <th style={{ textAlign:'right', padding:'6px 10px', color:'rgba(255,255,255,0.4)' }}>שחקן</th>
      {ROUNDS.map(r=><th key={r} style={{ padding:'6px 10px', color:'rgba(255,255,255,0.4)' }}>{r}</th>)}
    </tr></thead>
    <tbody>{PLAYERS.map(p=>(
      <tr key={p.id} style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <td style={{ padding:'8px 10px', color:p.isCurrentUser?'#60a5fa':'#e2e8f0', fontSize:12 }}>{p.name}</td>
        {p.rounds.map((r,ri)=>(
          <td key={ri} style={{ padding:'4px 10px', textAlign:'center' }}>
            {r?<ArcCell r={r}/>:<span style={{ color:'rgba(255,255,255,0.15)' }}>–</span>}
          </td>
        ))}
      </tr>
    ))}</tbody>
  </table>
);

// ── 18. Sticky Notes ──────────────────────────────────────────────────────────
const noteColors = ['#fef08a','#86efac','#93c5fd','#f9a8d4','#c4b5fd','#fdba74'];
const Design18 = () => (
  <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', padding:'4px 0 8px' }}>
    {PLAYERS.map((p,pi)=>(
      <motion.div key={p.id} whileHover={{ rotate:0, scale:1.04 }} initial={{ rotate:(pi%3-1)*2 }}
        style={{ width:100, background:noteColors[pi], borderRadius:3, padding:'8px 10px',
          boxShadow:'0 3px 12px rgba(0,0,0,0.4)', cursor:'default' }}>
        <div style={{ fontSize:10, fontWeight:700, color:'#374151', marginBottom:4, borderBottom:'1px solid rgba(0,0,0,0.1)', paddingBottom:3, fontFamily:'cursive' }}>{p.name}</div>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {p.rounds.map((r,ri)=>(
            <div key={ri} style={{ flex:1, textAlign:'center' }}>
              <div style={{ fontSize:8, color:'rgba(0,0,0,0.4)', marginBottom:1 }}>R{ri+1}</div>
              <div style={{ fontSize:16, fontWeight:900, color:r===1?'#854d0e':r===2?'#1e3a5f':r===3?'#431407':'#374151' }}>{r||'?'}</div>
            </div>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
);

// ── 19. Spark Line Mini Charts ────────────────────────────────────────────────
const Spark = ({ rounds }) => {
  const W=60, H=24, PAD=4;
  const xStep=(W-PAD*2)/(rounds.length-1);
  const yStep=(H-PAD*2)/(N-1);
  const pts=rounds.map((r,i)=>r?`${PAD+i*xStep},${PAD+(r-1)*yStep}`:null).filter(Boolean);
  const last=rounds.findLast(r=>r);
  return (
    <svg width={W} height={H}>
      <polyline points={pts.join(' ')} fill="none" stroke={rc(last)} strokeWidth={1.5}/>
      {rounds.map((r,i)=>r?<circle key={i} cx={PAD+i*xStep} cy={PAD+(r-1)*yStep} r={i===rounds.length-1?3:2} fill={rc(r)}/>:null)}
    </svg>
  );
};
const Design19 = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
    <div style={{ display:'flex', alignItems:'center', paddingBottom:4, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ flex:1, fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:1 }}>PLAYER</span>
      <span style={{ width:80, textAlign:'center', fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:1 }}>TREND</span>
      {ROUNDS.map((r,i)=><span key={i} style={{ width:32, textAlign:'center', fontSize:9, color:'rgba(255,255,255,0.3)' }}>R{i+1}</span>)}
    </div>
    {PLAYERS.map((p,i)=>(
      <div key={p.id} style={{ display:'flex', alignItems:'center', padding:'5px 0' }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.25)', width:14 }}>{i+1}</span>
          <span style={{ fontSize:12, color:p.isCurrentUser?'#60a5fa':'#e2e8f0' }}>{p.name}</span>
        </div>
        <div style={{ width:80, display:'flex', justifyContent:'center' }}><Spark rounds={p.rounds}/></div>
        {p.rounds.map((r,ri)=>(
          <div key={ri} style={{ width:32, textAlign:'center', fontWeight:700, fontSize:13, color:rc(r) }}>{r||'–'}</div>
        ))}
      </div>
    ))}
  </div>
);

// ── 20. 3D Perspective Rows ───────────────────────────────────────────────────
const Design20 = () => (
  <div style={{ perspective:600 }}>
    <div style={{ transformStyle:'preserve-3d' }}>
      {PLAYERS.map((p,i)=>(
        <motion.div key={p.id}
          initial={{ opacity:0, rotateX:-30 }} animate={{ opacity:1, rotateX:0 }}
          transition={{ delay:i*0.07, duration:0.5, ease:[0.23,1,0.32,1] }}
          whileHover={{ scale:1.02, z:10 }}
          style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', marginBottom:5, borderRadius:10,
            background:`linear-gradient(135deg, rgba(255,255,255,${0.06-i*0.005}), rgba(255,255,255,${0.02-i*0.002}))`,
            border:`1px solid rgba(255,255,255,${0.1-i*0.01})`,
            boxShadow:`0 ${4+i*2}px ${12+i*4}px rgba(0,0,0,${0.2+i*0.05})`,
            cursor:'default' }}>
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.25)', width:14 }}>{i+1}</span>
          <span style={{ flex:1, fontSize:13, fontWeight:600, color:p.isCurrentUser?'#93c5fd':'#e2e8f0' }}>{p.name}</span>
          {p.rounds.map((r,ri)=>(
            <motion.div key={ri} whileHover={{ rotateY:10 }}
              style={{ width:32, height:32, borderRadius:8, background:rbg(r), border:`1px solid ${rc(r)}66`,
                display:'flex', alignItems:'center', justifyContent:'center', color:rc(r), fontWeight:900, fontSize:14,
                boxShadow:`0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)` }}>
              {r||'–'}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  </div>
);

// ── Registry ──────────────────────────────────────────────────────────────────
const DESIGNS = [
  { id:1,  label:'Glassmorphism Float',    desc:'קארדים צפים עם blur + spring animation',          Component:Design1 },
  { id:2,  label:'Neumorphic Dark',         desc:'עיגולי inset shadow על רקע כהה',                 Component:Design2 },
  { id:3,  label:'Neon Pulse',              desc:'מספרים ניאון עם גלו פעימה אנימטיבי',             Component:Design3 },
  { id:4,  label:'Editorial Magazine',      desc:'טיפוגרפיה עיתונאית — bold serif',                Component:Design4 },
  { id:5,  label:'Dynamic Island Pills',    desc:'פילים מעוגלים בסגנון Apple',                     Component:Design5 },
  { id:6,  label:'Metro / Subway Map',      desc:'מפת רכבת — כל שחקן הוא קו',                    Component:Design6 },
  { id:7,  label:'Playing Cards',           desc:'קלפי משחק עם דרגות וסמלים',                     Component:Design7 },
  { id:8,  label:'Holographic Iridescent',  desc:'צבעי קשת הולוגרפיים',                           Component:Design8 },
  { id:9,  label:'Circuit Board',           desc:'לוח מעגלים ירוק — נתוני קוד',                  Component:Design9 },
  { id:10, label:'Polaroid Frames',         desc:'מסגרות פולרואיד עם הטיה',                       Component:Design10 },
  { id:11, label:'TV Broadcast Bar',        desc:'פס תוצאות שידור טלוויזיה',                      Component:Design11 },
  { id:12, label:'Constellation Star Map',  desc:'מפת כוכבים — מסלולים כמו קבוצות',              Component:Design12 },
  { id:13, label:'Airport Flip Board',      desc:'לוח נחתות / תעופה — flip animation',            Component:Design13 },
  { id:14, label:'Gradient Waterfall',      desc:'גרדיאנט ייחודי לכל שחקן',                       Component:Design14 },
  { id:15, label:'Vinyl Record Spin',       desc:'תקליט מסתובב — מיקום במרכז',                   Component:Design15 },
  { id:16, label:'Rank Bubbles',            desc:'בועות — גדולות יותר = מיקום גבוה',             Component:Design16 },
  { id:17, label:'Progress Arc',            desc:'קשת חצי עיגול לפי אחוז דירוג',                Component:Design17 },
  { id:18, label:'Sticky Notes',            desc:'פתקיות צהובות/צבעוניות עם הטיה',               Component:Design18 },
  { id:19, label:'Spark Line + Table',      desc:'גרף ספארק מיני + מספרים',                      Component:Design19 },
  { id:20, label:'3D Perspective Depth',    desc:'שורות בטשומת עומק 3D עם hover',                Component:Design20 },
];

export default function AdminRankingHistoryDemo() {
  const [selected, setSelected] = useState(1);
  const ActiveDesign = DESIGNS.find(d => d.id === selected)?.Component;

  return (
    <div style={{ padding:24, color:'white', fontFamily:"'Outfit', sans-serif" }}>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>היסטוריית מיקום — Demo v2</h2>
      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:20 }}>20 עיצובים חדשים — לחץ לבחור</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(175px, 1fr))', gap:8, marginBottom:28 }}>
        {DESIGNS.map(d=>(
          <motion.div key={d.id} whileHover={{ scale:1.02 }} onClick={()=>setSelected(d.id)}
            style={{ cursor:'pointer', padding:'10px 12px', borderRadius:10,
              background:selected===d.id?'rgba(245,197,24,0.12)':'rgba(255,255,255,0.04)',
              border:`1px solid ${selected===d.id?'rgba(245,197,24,0.5)':'rgba(255,255,255,0.08)'}`,
              transition:'border 0.15s, background 0.15s' }}>
            <div style={{ fontSize:11, fontWeight:700, color:selected===d.id?'#f5c518':'rgba(255,255,255,0.7)', marginBottom:3 }}>#{d.id} {d.label}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', lineHeight:1.3 }}>{d.desc}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={selected} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.2 }}
          style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:20 }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:16 }}>
            עיצוב #{selected} — {DESIGNS.find(d=>d.id===selected)?.label}
          </div>
          {ActiveDesign && <ActiveDesign />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
