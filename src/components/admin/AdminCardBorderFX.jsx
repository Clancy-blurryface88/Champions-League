import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShineBorder } from "@/components/magicui/shine-border";

// ── Shared card shell ──────────────────────────────────────────────────────────
const CARD_BG = {
  background: 'linear-gradient(145deg, rgba(30,58,138,0.45) 0%, rgba(8,15,45,0.92) 45%, rgba(15,25,70,0.5) 100%)',
  backdropFilter: 'blur(24px)',
};

function CardInner() {
  return (
    <div className="p-3 flex flex-col gap-2">
      <div className="flex justify-center">
        <div className="rounded-xl px-3 py-1 flex gap-2 text-center" style={{ background:"rgba(26,54,45,0.8)", border:"1px solid rgba(74,222,128,0.2)" }}>
          {[["9","ימים"],["8","שעות"],["15","דקות"]].map(([n,l])=>(
            <div key={l} className="flex flex-col items-center">
              <span className="text-xs font-bold text-emerald-400 leading-none">{n}</span>
              <span className="text-[7px] text-emerald-700">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <span className="text-[9px] text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-0.5 rounded-full">Group A</span>
      </div>
      <div className="border-t border-white/8" />
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col items-center gap-0.5 flex-1">
          <span className="fi fi-kr fis rounded-md" style={{ width:32,height:32,fontSize:32,display:"inline-block",backgroundSize:"cover" }} />
          <span className="text-[8px] text-white font-semibold">Korea</span>
        </div>
        <div className="flex items-center gap-1">
          {[2,1].map((v,i)=>(
            <div key={i} className="w-7 h-9 rounded-lg flex items-center justify-center font-bold text-white text-base"
              style={{ background:"rgba(15,20,40,0.75)", border:"1.5px solid rgba(255,255,255,0.15)" }}>{v}</div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-0.5 flex-1">
          <span className="fi fi-cz fis rounded-md" style={{ width:32,height:32,fontSize:32,display:"inline-block",backgroundSize:"cover" }} />
          <span className="text-[8px] text-white font-semibold">Czechia</span>
        </div>
      </div>
      <div className="text-center text-[7px] text-slate-500">📅 12/06/2026 · Guadalajara</div>
    </div>
  );
}

function Shell({ children, style = {}, className = "" }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={{ ...CARD_BG, ...style }}>
      {children}
      <CardInner />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

// 1. Dual ShineBorder (נוכחי)
function FX1() {
  return (
    <Shell>
      <ShineBorder borderRadius={16} borderWidth={1} duration={10} shineColor={["rgba(59,130,246,0.3)","rgba(147,197,253,0.85)","rgba(219,234,254,0.95)","rgba(147,197,253,0.85)","rgba(59,130,246,0.3)"]} />
      <ShineBorder borderRadius={16} borderWidth={1} duration={10} shineColor={["rgba(59,130,246,0.3)","rgba(147,197,253,0.85)","rgba(219,234,254,0.95)","rgba(147,197,253,0.85)","rgba(59,130,246,0.3)"]} className="[&>div]:[animation-delay:-5s]" />
    </Shell>
  );
}

// 2. Pulsing Border
function FX2() {
  return (
    <motion.div className="relative rounded-2xl overflow-hidden" style={CARD_BG}
      animate={{ boxShadow:["0 0 0 1px rgba(59,130,246,0.2)","0 0 0 1.5px rgba(59,130,246,0.7), 0 0 16px rgba(59,130,246,0.25)","0 0 0 1px rgba(59,130,246,0.2)"] }}
      transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}>
      <CardInner />
    </motion.div>
  );
}

// 3. Rotating Conic Gradient
function FX3() {
  return (
    <div className="relative rounded-2xl overflow-hidden p-[1.5px]" style={{ background:"conic-gradient(from var(--angle,0deg), #1e3a8a, #3b82f6, #93c5fd, #3b82f6, #1e3a8a)", animation:"rotateBorder 4s linear infinite" }}>
      <style>{`@keyframes rotateBorder { to { --angle: 360deg; } } @property --angle { syntax:'<angle>'; inherits:false; initial-value:0deg; }`}</style>
      <div className="rounded-[14px] overflow-hidden" style={CARD_BG}><CardInner /></div>
    </div>
  );
}

// 4. Aurora Color Shift
function FX4() {
  return (
    <motion.div className="relative rounded-2xl overflow-hidden" style={CARD_BG}
      animate={{ boxShadow:[
        "0 0 0 1px rgba(99,102,241,0.6), 0 0 16px rgba(99,102,241,0.15)",
        "0 0 0 1px rgba(6,182,212,0.6), 0 0 16px rgba(6,182,212,0.15)",
        "0 0 0 1px rgba(168,85,247,0.6), 0 0 16px rgba(168,85,247,0.15)",
        "0 0 0 1px rgba(99,102,241,0.6), 0 0 16px rgba(99,102,241,0.15)",
      ]}}
      transition={{ duration:5, repeat:Infinity, ease:"linear" }}>
      <CardInner />
    </motion.div>
  );
}

// 5. Electric Flicker
function FX5() {
  return (
    <motion.div className="relative rounded-2xl overflow-hidden" style={CARD_BG}
      animate={{ boxShadow:[
        "0 0 0 1px rgba(147,197,253,0.3)","0 0 0 1px rgba(147,197,253,0.3)",
        "0 0 0 2px rgba(147,197,253,0.9), 0 0 20px rgba(147,197,253,0.5)",
        "0 0 0 1px rgba(147,197,253,0.2)","0 0 0 1px rgba(147,197,253,0.3)",
        "0 0 0 1.5px rgba(147,197,253,0.7), 0 0 10px rgba(147,197,253,0.3)",
        "0 0 0 1px rgba(147,197,253,0.3)","0 0 0 1px rgba(147,197,253,0.3)",
        "0 0 0 1px rgba(147,197,253,0.3)","0 0 0 1px rgba(147,197,253,0.3)",
      ]}}
      transition={{ duration:4, repeat:Infinity, ease:"linear" }}>
      <CardInner />
    </motion.div>
  );
}

// 6. Hover Glow (simulate with auto toggle)
function FX6() {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setInterval(() => setOn(p=>!p), 1800); return ()=>clearInterval(t); }, []);
  return (
    <motion.div className="relative rounded-2xl overflow-hidden cursor-pointer" style={CARD_BG}
      animate={{ boxShadow: on ? "0 0 0 1.5px rgba(147,197,253,0.8), 0 0 30px rgba(59,130,246,0.35), 0 8px 32px rgba(0,0,40,0.6)" : "0 0 0 1px rgba(59,130,246,0.15)" }}
      transition={{ duration:0.4, ease:"easeOut" }}>
      <div className="absolute top-1 right-1 text-[7px] text-slate-500 px-1">{on?"hover":"—"}</div>
      <CardInner />
    </motion.div>
  );
}

// 7. Tilt Border (3D simulate)
function FX7() {
  const [tilt, setTilt] = useState({ x:0, y:0 });
  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 0.05;
      setTilt({ x: Math.sin(t)*12, y: Math.cos(t)*8 });
    }, 50);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div className="relative rounded-2xl overflow-hidden" style={{ ...CARD_BG, perspective:400 }}
      animate={{ rotateX:tilt.x, rotateY:tilt.y, boxShadow:`${-tilt.y*0.5}px ${tilt.x*0.5}px 0 1px rgba(147,197,253,0.5), 0 0 20px rgba(59,130,246,0.2)` }}
      transition={{ type:"spring", stiffness:200, damping:20 }}>
      <CardInner />
    </motion.div>
  );
}

// 8. Click Ripple (auto trigger)
function FX8() {
  const [rings, setRings] = useState([]);
  useEffect(() => {
    const id = setInterval(() => setRings(r=>[...r, Date.now()].slice(-3)), 2000);
    return ()=>clearInterval(id);
  }, []);
  return (
    <div className="relative rounded-2xl overflow-visible" style={CARD_BG}>
      {rings.map(k=>(
        <motion.div key={k} className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border:"1.5px solid rgba(147,197,253,0.7)" }}
          initial={{ scale:1, opacity:0.8 }} animate={{ scale:1.12, opacity:0 }}
          transition={{ duration:0.9, ease:"easeOut" }} />
      ))}
      <CardInner />
    </div>
  );
}

// 9. Countdown Pulse (fast)
function FX9() {
  return (
    <motion.div className="relative rounded-2xl overflow-hidden" style={CARD_BG}
      animate={{ boxShadow:["0 0 0 1px rgba(248,113,113,0.3)","0 0 0 1.5px rgba(248,113,113,0.8), 0 0 14px rgba(248,113,113,0.3)","0 0 0 1px rgba(248,113,113,0.3)"] }}
      transition={{ duration:0.8, repeat:Infinity, ease:"easeInOut" }}>
      <div className="absolute top-1 left-1 text-[7px] text-red-400 px-1 font-bold">● LIVE</div>
      <CardInner />
    </motion.div>
  );
}

// 10. Locked Fade
function FX10() {
  return (
    <div className="relative rounded-2xl overflow-hidden opacity-50" style={{ ...CARD_BG, filter:"grayscale(0.7)", outline:"1px solid rgba(255,255,255,0.06)" }}>
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <span className="text-[9px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700/50">🔒 נעול</span>
      </div>
      <CardInner />
    </div>
  );
}

// 11. Team Colors
function FX11() {
  return (
    <div className="p-[1.5px] rounded-2xl" style={{ background:"linear-gradient(90deg, rgba(205,45,58,0.7) 0%, rgba(30,58,138,0.3) 50%, rgba(17,95,196,0.7) 100%)" }}>
      <div className="rounded-[14px] overflow-hidden" style={CARD_BG}><CardInner /></div>
    </div>
  );
}

// 12. Neon Sign
function FX12() {
  return (
    <motion.div className="relative rounded-2xl overflow-hidden" style={CARD_BG}
      animate={{ boxShadow:[
        "0 0 0 1.5px #00fff0, 0 0 10px #00fff040, 0 0 30px #00fff020",
        "0 0 0 1.5px #00fff0, 0 0 20px #00fff060, 0 0 40px #00fff030",
        "0 0 0 1.5px #00fff0, 0 0 10px #00fff040, 0 0 30px #00fff020",
      ]}}
      transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>
      <CardInner />
    </motion.div>
  );
}

// 13. Gold Trophy
function FX13() {
  return (
    <Shell>
      <ShineBorder borderRadius={16} borderWidth={1.5} duration={12} shineColor={["#b8860b","#ffd700","#fffacd","#ffd700","#b8860b"]} />
      <div className="absolute top-0 inset-x-0 h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.8),transparent)" }} />
    </Shell>
  );
}

// 14. Particle Border
function FX14() {
  const particles = Array.from({length:6},(_,i)=>i);
  return (
    <div className="relative rounded-2xl overflow-visible" style={CARD_BG}>
      {particles.map(i=>(
        <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{ background:"rgba(147,197,253,0.9)", boxShadow:"0 0 6px rgba(147,197,253,0.8)", top:"50%", left:"50%", marginTop:-3, marginLeft:-3 }}
          animate={{ rotate:360 }} transition={{ duration:3+i*0.4, repeat:Infinity, ease:"linear" }}>
          <div className="absolute" style={{ width:6, height:6, borderRadius:"50%", background:"rgba(147,197,253,0.9)", top:-3, left:Math.cos((i/6)*Math.PI*2)*52, top:Math.sin((i/6)*Math.PI*2)*52 }} />
        </motion.div>
      ))}
      <div className="relative overflow-hidden rounded-2xl"><CardInner /></div>
    </div>
  );
}

// 15. Corner Accents Only
function FX15() {
  const corners = [
    { top:0, left:0, borderTop:"2px solid rgba(147,197,253,0.7)", borderLeft:"2px solid rgba(147,197,253,0.7)", borderRadius:"16px 0 0 0" },
    { top:0, right:0, borderTop:"2px solid rgba(147,197,253,0.7)", borderRight:"2px solid rgba(147,197,253,0.7)", borderRadius:"0 16px 0 0" },
    { bottom:0, left:0, borderBottom:"2px solid rgba(147,197,253,0.7)", borderLeft:"2px solid rgba(147,197,253,0.7)", borderRadius:"0 0 0 16px" },
    { bottom:0, right:0, borderBottom:"2px solid rgba(147,197,253,0.7)", borderRight:"2px solid rgba(147,197,253,0.7)", borderRadius:"0 0 16px 0" },
  ];
  return (
    <div className="relative rounded-2xl overflow-hidden" style={CARD_BG}>
      {corners.map((s,i)=>(
        <motion.div key={i} className="absolute w-5 h-5 pointer-events-none" style={s}
          animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:2, repeat:Infinity, delay:i*0.5 }} />
      ))}
      <CardInner />
    </div>
  );
}

// 16. Breathing Scale
function FX16() {
  return (
    <motion.div className="relative rounded-2xl overflow-hidden" style={{ ...CARD_BG, outline:"1px solid rgba(147,197,253,0.35)" }}
      animate={{ scale:[1,1.015,1], boxShadow:["0 0 0 1px rgba(147,197,253,0.2)","0 0 0 1px rgba(147,197,253,0.6), 0 0 20px rgba(59,130,246,0.2)","0 0 0 1px rgba(147,197,253,0.2)"] }}
      transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut" }}>
      <CardInner />
    </motion.div>
  );
}

// 17. Fire Border Bottom
function FX17() {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ ...CARD_BG, outline:"1px solid rgba(255,255,255,0.06)" }}>
      <motion.div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none rounded-b-2xl"
        animate={{ background:[
          "linear-gradient(to top, rgba(251,146,60,0.4), transparent)",
          "linear-gradient(to top, rgba(239,68,68,0.5), transparent)",
          "linear-gradient(to top, rgba(251,191,36,0.4), transparent)",
          "linear-gradient(to top, rgba(251,146,60,0.4), transparent)",
        ], boxShadow:["0 8px 24px rgba(251,146,60,0.3)","0 8px 24px rgba(239,68,68,0.4)","0 8px 24px rgba(251,191,36,0.3)","0 8px 24px rgba(251,146,60,0.3)"] }}
        transition={{ duration:1.8, repeat:Infinity, ease:"easeInOut" }} />
      <CardInner />
    </div>
  );
}

// 18. Dashed Animated
function FX18() {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ ...CARD_BG, outline:"1.5px dashed rgba(147,197,253,0.4)", animation:"dashMove 1s linear infinite" }}>
      <style>{`@keyframes dashMove { to { outline-offset: 2px; } }`}</style>
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border:"1.5px dashed rgba(147,197,253,0.4)", borderRadius:16 }}
        animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:"linear" }} />
      <CardInner />
    </div>
  );
}

// 19. Double Ring
function FX19() {
  return (
    <div className="relative" style={{ padding:3 }}>
      <div className="absolute inset-0 rounded-[20px]" style={{ border:"1px solid rgba(59,130,246,0.5)" }} />
      <div className="absolute inset-[3px] rounded-[18px]" style={{ border:"1px solid rgba(147,197,253,0.25)" }} />
      <div className="rounded-2xl overflow-hidden" style={CARD_BG}><CardInner /></div>
    </div>
  );
}

// 20. Gradient Border Sweep
function FX20() {
  return (
    <div className="p-[1.5px] rounded-2xl" style={{ background:"linear-gradient(135deg,#1e3a8a,#3b82f6,#93c5fd,#3b82f6,#1e3a8a)", backgroundSize:"300% 300%", animation:"gradientSweep 4s ease infinite" }}>
      <style>{`@keyframes gradientSweep { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>
      <div className="rounded-[14px] overflow-hidden" style={CARD_BG}><CardInner /></div>
    </div>
  );
}

// 21. Rainbow Holographic
function FX21() {
  return (
    <div className="p-[1.5px] rounded-2xl" style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899,#f59e0b,#10b981,#3b82f6)", backgroundSize:"400% 400%", animation:"gradientSweep 5s ease infinite" }}>
      <div className="rounded-[14px] overflow-hidden" style={CARD_BG}><CardInner /></div>
    </div>
  );
}

// ── Effects catalog ────────────────────────────────────────────────────────────
const EFFECTS = [
  { id:1,  name:"Dual ShineBorder",    tag:"נוכחי",     desc:"שתי נקודות אור רצות מצדדים מנוגדים — קיים כרגע", C:FX1 },
  { id:2,  name:"Pulsing Border",      tag:"פולס",      desc:"עוצמת המסגרת פולסת פנימה-החוצה לאט", C:FX2 },
  { id:3,  name:"Rotating Conic",      tag:"סיבוב",     desc:"גרדיאנט שמסתובב סביב המסגרת בלופ", C:FX3 },
  { id:4,  name:"Aurora Shift",        tag:"אורורה",    desc:"המסגרת מחליפה צבעים: כחול↔ציאן↔סגול", C:FX4 },
  { id:5,  name:"Electric Flicker",    tag:"חשמל",      desc:"הבזקים רנדומיים כמו חוט חשמלי", C:FX5 },
  { id:6,  name:"Hover Glow",          tag:"hover",     desc:"hover מחזק מסגרת + גלואו חיצוני", C:FX6 },
  { id:7,  name:"3D Tilt Border",      tag:"3D",        desc:"המסגרת מחזקת צד לפי הטיית הכרטיס", C:FX7 },
  { id:8,  name:"Click Ripple",        tag:"גל",        desc:"לחיצה שולחת גל מתרחב מהמסגרת", C:FX8 },
  { id:9,  name:"Countdown Pulse",     tag:"מתח",       desc:"פולס מהיר לאדום — מדמה משחק קרוב", C:FX9 },
  { id:10, name:"Locked Fade",         tag:"נעול",      desc:"מסגרת דוהה + greyscale כשהמשחק נעול", C:FX10 },
  { id:11, name:"Team Colors",         tag:"צוות",      desc:"גרדיאנט צבעי שתי הקבוצות בגבול", C:FX11 },
  { id:12, name:"Neon Sign",           tag:"ניאון",     desc:"מסגרת ניאון ציאן עם גלואו חיצוני", C:FX12 },
  { id:13, name:"Gold Trophy",         tag:"זהב",       desc:"ShineBorder זהוב עם פס specular", C:FX13 },
  { id:14, name:"Particle Border",     tag:"חלקיקים",   desc:"נקודות אור קטנות מקיפות את הכרטיס", C:FX14 },
  { id:15, name:"Corner Accents",      tag:"פינות",     desc:"גלואו רק בארבע הפינות, פולס בתורות", C:FX15 },
  { id:16, name:"Breathing",           tag:"נשימה",     desc:"הכרטיס וגבולו גדלים ומתכווצים בנשימה", C:FX16 },
  { id:17, name:"Fire Bottom",         tag:"אש",        desc:"להבה פולסת בתחתית הכרטיס", C:FX17 },
  { id:18, name:"Dashed Spin",         tag:"מקווקו",    desc:"מסגרת מקווקו מסתובבת לאט", C:FX18 },
  { id:19, name:"Double Ring",         tag:"כפול",      desc:"שני קווים מקוננים: כחול חזק + כחול עדין", C:FX19 },
  { id:20, name:"Gradient Sweep",      tag:"גרדיאנט",   desc:"גרדיאנט כחול שנע לאחור ולפנים", C:FX20 },
  { id:21, name:"Holographic",         tag:"הולוגרפי",  desc:"קשת 6 צבעים מסתובבת סביב הכרטיס", C:FX21 },
];

const TAG_COLORS = {
  "נוכחי":"#94a3b8","פולס":"#fb923c","סיבוב":"#60a5fa","אורורה":"#c084fc","חשמל":"#22d3ee",
  "hover":"#34d399","3D":"#67e8f9","גל":"#818cf8","מתח":"#f87171","נעול":"#64748b",
  "צוות":"#f9a8d4","ניאון":"#4ade80","זהב":"#fbbf24","חלקיקים":"#93c5fd","פינות":"#a78bfa",
  "נשימה":"#e2e8f0","אש":"#f97316","מקווקו":"#fde68a","כפול":"#60a5fa","גרדיאנט":"#818cf8","הולוגרפי":"#f0abfc",
};

export default function AdminCardBorderFX() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">✨ אפקטי מסגרת — 21 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">כל תצוגה מראה את האפקט בפעולה על כרטיסיית משחק אמיתית. לחץ לפרטים.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {EFFECTS.map(({ id, name, tag, C }) => (
          <motion.div key={id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected===id?"border-indigo-500 ring-2 ring-indigo-500/30":"border-slate-700/60 hover:border-slate-500"}`}
            style={{ background:"#080c1a" }}
            whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
            onClick={() => setSelected(id===selected?null:id)}>
            <div className="p-2.5" style={{ background:"linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
              <C />
            </div>
            <div className="px-2.5 py-2 border-t border-slate-800 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[9px] text-slate-600 font-mono flex-shrink-0">#{id}</span>
                <span className="text-[10px] font-semibold text-white truncate">{name}</span>
              </div>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background:`${TAG_COLORS[tag]}15`, color:TAG_COLORS[tag], border:`1px solid ${TAG_COLORS[tag]}30` }}>
                {tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (() => {
          const fx = EFFECTS.find(e=>e.id===selected);
          if (!fx) return null;
          return (
            <motion.div key={selected}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }}
              className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-6 items-center flex-wrap"
              style={{ background:"rgba(8,12,26,0.98)", boxShadow:"0 0 30px rgba(99,102,241,0.1)" }}>
              <div className="w-44 flex-shrink-0 rounded-xl p-2.5" style={{ background:"linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
                <fx.C />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-white">#{fx.id} — {fx.name}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background:`${TAG_COLORS[fx.tag]}15`, color:TAG_COLORS[fx.tag] }}>{fx.tag}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{fx.desc}</p>
                <button onClick={() => setSelected(null)} className="mt-3 text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
