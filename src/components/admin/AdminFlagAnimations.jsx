import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PX = 64;

// ── Real flag using flag-icons ─────────────────────────────────────────────────
function Flag({ code }) {
  return (
    <span
      className={`fi fi-${code} fis`}
      style={{
        width: PX, height: PX, fontSize: PX,
        display: "inline-block",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
        minWidth: PX, flexShrink: 0,
      }}
    />
  );
}

// ── Mini match card shell ──────────────────────────────────────────────────────
function Card({ children }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full"
      style={{ background: "rgba(10,18,35,0.9)", border: "1px solid rgba(255,255,255,0.1)" }}>
      {children}
    </div>
  );
}
function Vs() {
  return <span className="text-slate-500 font-bold text-sm flex-shrink-0">VS</span>;
}

// ── Wrapper that adds an effect layer on top of the flag ──────────────────────
function FX({ code, children }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: PX, height: PX }}>
      <Flag code={code} />
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 15 NEW ambient effects
// ═══════════════════════════════════════════════════════════════════════════════

// 1. Comet Orbit — a glowing dot orbits the flag
function E1() {
  return (
    <Card>
      {["br","ar"].map((c, i) => (
        <FX key={c} code={c}>
          <motion.div className="absolute pointer-events-none"
            style={{ width: 10, height: 10, borderRadius: "50%", background: i===0?"#fbbf24":"#60a5fa", boxShadow: i===0?"0 0 10px 3px #fbbf24":"0 0 10px 3px #60a5fa", top:"50%", left:"50%", marginTop:-5, marginLeft:-5 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            style2={{ transformOrigin: `${PX/2+38}px 0px` }}>
            <motion.div className="absolute"
              style={{ width: 10, height: 10, borderRadius:"50%", background: i===0?"#fbbf24":"#60a5fa", boxShadow: i===0?"0 0 10px 3px #fbbf24":"0 0 10px 3px #60a5fa", top: -5, left: 38 }} />
          </motion.div>
          {/* orbit path using CSS */}
          <motion.div className="absolute inset-0 pointer-events-none rounded-lg overflow-visible"
            style={{ transformOrigin:"center" }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2.5 + i*0.5, repeat: Infinity, ease:"linear" }}>
            <div className="absolute" style={{ width:10, height:10, borderRadius:"50%", background: i===0?"#fbbf24":"#60a5fa", boxShadow: i===0?"0 0 10px 4px rgba(251,191,36,0.8)":"0 0 10px 4px rgba(96,165,250,0.8)", top: -5, left: "50%", marginLeft: -5 }} />
          </motion.div>
        </FX>
      ))}
      <Vs />
    </Card>
  );
}

// 2. Multi-Ring Aura — concentric rings expanding at different speeds
function E2() {
  return (
    <Card>
      {["de","fr"].map((c,i) => (
        <div key={c} className="relative flex-shrink-0 flex items-center justify-center" style={{ width: PX+24, height: PX+24 }}>
          {[0, 0.7, 1.4].map(d => (
            <motion.div key={d} className="absolute rounded-lg pointer-events-none"
              style={{ width: PX, height: PX, border: `1.5px solid ${i===0?"rgba(239,68,68,0.6)":"rgba(59,130,246,0.6)"}` }}
              animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: d, ease: "easeOut" }} />
          ))}
          <Flag code={c} />
        </div>
      ))}
      <Vs />
    </Card>
  );
}

// 3. Wind Wave — flag skews as if blowing in wind
function E3() {
  return (
    <Card>
      {["es","pt"].map((c,i) => (
        <motion.div key={c} className="flex-shrink-0"
          animate={{ skewX: [0, i===0?3:-3, 0, i===0?2:-2, 0], scaleX: [1, 0.97, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i*0.4 }}
          style={{ transformOrigin: "bottom center" }}>
          <Flag code={c} />
        </motion.div>
      ))}
      <Vs />
    </Card>
  );
}

// 4. Mirror Reflection — faded upside-down flag below
function E4() {
  return (
    <Card>
      {["us","mx"].map(c => (
        <div key={c} className="flex flex-col items-center flex-shrink-0" style={{ gap: 2 }}>
          <Flag code={c} />
          <div style={{ width: PX, height: PX/2, overflow: "hidden", transform: "scaleY(-1)", opacity: 0.18, maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)" }}>
            <Flag code={c} />
          </div>
        </div>
      ))}
      <Vs />
    </Card>
  );
}

// 5. Freeze → Color — desaturates then snaps back
function E5() {
  return (
    <Card>
      {["jp","kr"].map((c,i) => (
        <motion.div key={c} className="flex-shrink-0"
          animate={{ filter: ["saturate(1) brightness(1)", "saturate(0) brightness(0.7)", "saturate(0) brightness(0.7)", "saturate(1) brightness(1)"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i*1.2, times:[0,0.3,0.6,1] }}>
          <Flag code={c} />
        </motion.div>
      ))}
      <Vs />
    </Card>
  );
}

// 6. Sparkle Crown — ✦ sparkles pop around the flag
function E6() {
  const positions = [
    { top:-10, left:"50%" }, { top:"50%", right:-10 }, { bottom:-8, left:"30%" },
    { top:"20%", left:-10 }, { top:-8, right:"25%" },
  ];
  return (
    <Card>
      {["gb","nl"].map((c,fi) => (
        <FX key={c} code={c}>
          {positions.map((pos,i) => (
            <motion.div key={i} className="absolute text-yellow-300 pointer-events-none font-bold"
              style={{ fontSize: 10, ...pos, transform: pos.left==="50%"?"translateX(-50%)":pos.top==="50%"?"translateY(-50%)":"" }}
              animate={{ opacity:[0,1,0], scale:[0.5,1.2,0], rotate:[0,20,0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: fi*0.5 + i*0.25, repeatDelay: 1.5 }}>
              ✦
            </motion.div>
          ))}
        </FX>
      ))}
      <Vs />
    </Card>
  );
}

// 7. Fire Glow — warm flicker from below
function E7() {
  return (
    <Card>
      {["it","hr"].map((c,i) => (
        <FX key={c} code={c}>
          <motion.div className="absolute inset-x-0 bottom-0 rounded-b-lg pointer-events-none h-1/2"
            animate={{ opacity:[0.5,0.9,0.6,0.8,0.5], background:[
              "linear-gradient(to top, rgba(251,146,60,0.7), transparent)",
              "linear-gradient(to top, rgba(239,68,68,0.8), transparent)",
              "linear-gradient(to top, rgba(251,191,36,0.6), transparent)",
              "linear-gradient(to top, rgba(239,68,68,0.7), transparent)",
              "linear-gradient(to top, rgba(251,146,60,0.7), transparent)",
            ]}}
            transition={{ duration: 1.5, repeat: Infinity, ease:"easeInOut", delay: i*0.3 }} />
          <motion.div className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{ boxShadow:["0 8px 20px rgba(251,146,60,0.3)","0 8px 30px rgba(239,68,68,0.5)","0 8px 20px rgba(251,146,60,0.3)"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease:"easeInOut", delay: i*0.3 }} />
        </FX>
      ))}
      <Vs />
    </Card>
  );
}

// 8. Neon Flicker — occasional flicker like a neon sign
function E8() {
  return (
    <Card>
      {["au","nz"].map((c,i) => (
        <motion.div key={c} className="flex-shrink-0 rounded-lg"
          animate={{ opacity:[1,1,0.3,1,0.6,1,1,1,1,1], boxShadow:[
            "0 0 12px rgba(74,222,128,0.6)","0 0 12px rgba(74,222,128,0.6)",
            "0 0 2px rgba(74,222,128,0.1)","0 0 20px rgba(74,222,128,0.9)",
            "0 0 5px rgba(74,222,128,0.3)","0 0 16px rgba(74,222,128,0.8)",
            "0 0 12px rgba(74,222,128,0.6)","0 0 12px rgba(74,222,128,0.6)",
            "0 0 12px rgba(74,222,128,0.6)","0 0 12px rgba(74,222,128,0.6)",
          ]}}
          transition={{ duration: 4, repeat: Infinity, delay: i*1.8, ease:"linear" }}>
          <Flag code={c} />
        </motion.div>
      ))}
      <Vs />
    </Card>
  );
}

// 9. Vortex Glow — rotating gradient behind the flag
function E9() {
  return (
    <Card>
      {["se","dk"].map((c,i) => (
        <div key={c} className="relative flex-shrink-0 flex items-center justify-center" style={{ width: PX+16, height: PX+16 }}>
          <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease:"linear" }}
            style={{ background: i===0?"conic-gradient(from 0deg, transparent 60%, rgba(59,130,246,0.7) 80%, transparent 100%)":"conic-gradient(from 0deg, transparent 60%, rgba(239,68,68,0.7) 80%, transparent 100%)" }} />
          <div className="relative z-10"><Flag code={c} /></div>
        </div>
      ))}
      <Vs />
    </Card>
  );
}

// 10. Shadow Pulse — expanding shadow only, no glow on flag
function E10() {
  return (
    <Card>
      {["ng","sn"].map((c,i) => (
        <motion.div key={c} className="flex-shrink-0"
          animate={{ filter:[
            `drop-shadow(0 4px 6px rgba(0,0,0,0.4))`,
            `drop-shadow(0 12px 24px rgba(0,0,0,0.8)) drop-shadow(0 0 16px ${i===0?"rgba(34,197,94,0.5)":"rgba(234,179,8,0.5)"})`,
            `drop-shadow(0 4px 6px rgba(0,0,0,0.4))`,
          ]}}
          transition={{ duration: 2.5, repeat: Infinity, ease:"easeInOut", delay: i*0.6 }}>
          <Flag code={c} />
        </motion.div>
      ))}
      <Vs />
    </Card>
  );
}

// 11. Thunder Flash — random electric flash
function E11() {
  return (
    <Card>
      {["ar","uy"].map((c,i) => (
        <FX key={c} code={c}>
          <motion.div className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{ opacity:[0,0,0,0,1,0,0.6,0,0,0,0,0,0,0,0] }}
            transition={{ duration: 5, repeat: Infinity, delay: i*1.5, ease:"linear" }}
            style={{ background:"rgba(255,255,255,0.7)", boxShadow:"0 0 20px 5px rgba(200,220,255,1)" }} />
        </FX>
      ))}
      <Vs />
    </Card>
  );
}

// 12. Depth Parallax — slight float on different layers
function E12() {
  return (
    <Card>
      {["pl","cz"].map((c,i) => (
        <div key={c} className="relative flex-shrink-0" style={{ width: PX, height: PX }}>
          {/* shadow layer behind */}
          <motion.div className="absolute rounded-lg"
            style={{ width: PX, height: PX, background: i===0?"rgba(239,68,68,0.3)":"rgba(59,130,246,0.3)", filter:"blur(8px)", top: 0, left: 0 }}
            animate={{ y:[0,-5,0,5,0], x:[0,3,0,-3,0] }}
            transition={{ duration: 5, repeat: Infinity, ease:"easeInOut", delay: i*0.5 }} />
          <motion.div className="relative z-10"
            animate={{ y:[0,-3,0,3,0], x:[0,2,0,-2,0] }}
            transition={{ duration: 5, repeat: Infinity, ease:"easeInOut", delay: i*0.5 + 0.2 }}>
            <Flag code={c} />
          </motion.div>
        </div>
      ))}
      <Vs />
    </Card>
  );
}

// 13. Glitch Slice — occasional horizontal slice shift
function E13() {
  return (
    <Card>
      {["tr","gr"].map((c,i) => (
        <FX key={c} code={c}>
          {[25, 55, 75].map((pct,gi) => (
            <motion.div key={gi} className="absolute inset-x-0 pointer-events-none overflow-hidden"
              style={{ top:`${pct-8}%`, height:"16%", clipPath:"inset(0)" }}
              animate={{ x:[0,0,0,i===0?-6:6,0,0,0,0,0,0,0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i*1.2 + gi*0.15, ease:"steps(1)" }}>
              <div style={{ position:"absolute", top:`-${pct-8}%`, left:0 }}>
                <Flag code={c} />
              </div>
            </motion.div>
          ))}
        </FX>
      ))}
      <Vs />
    </Card>
  );
}

// 14. Color Bloom — flag blooms in its dominant color outward
function E14() {
  const colors = { "gh":"rgba(34,197,94,", "ci":"rgba(251,146,60," };
  return (
    <Card>
      {["gh","ci"].map((c,i) => (
        <div key={c} className="relative flex-shrink-0 flex items-center justify-center" style={{ width: PX+20, height: PX+20 }}>
          <motion.div className="absolute rounded-xl pointer-events-none"
            style={{ width: PX, height: PX, background: i===0?"rgba(34,197,94,0.15)":"rgba(251,146,60,0.15)" }}
            animate={{ scale:[1,1.5,1], opacity:[0.8,0,0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease:"easeOut", delay: i*0.8 }} />
          <div className="relative z-10"><Flag code={c} /></div>
        </div>
      ))}
      <Vs />
    </Card>
  );
}

// 15. Tilt 3D on hover — 3D tilt that follows cursor
function E15() {
  const F = ({ code }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    return (
      <motion.div className="flex-shrink-0 cursor-pointer"
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -24, y: ((e.clientX - r.left) / r.width - 0.5) * 24 });
        }}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: tilt.x !== 0 ? 1.1 : 1,
          filter: `drop-shadow(${-tilt.y * 0.3}px ${tilt.x * 0.3}px 12px rgba(255,255,255,0.3))` }}
        transition={{ type:"spring", stiffness:250, damping:18 }}
        style={{ perspective:400 }}>
        <Flag code={code} />
      </motion.div>
    );
  };
  return (
    <Card>
      <F code="pt" /><Vs /><F code="es" />
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
const EFFECTS = [
  { id:1,  name:"Comet Orbit",       tag:"מסלול",    desc:"נקודה זוהרת מקיפה את הדגל כמו לוויין — צבע שונה לכל קבוצה", C:E1 },
  { id:2,  name:"Multi-Ring Aura",   tag:"גלים",     desc:"3 טבעות מתרחבות בזו אחר זו מסביב לדגל כמו רדאר", C:E2 },
  { id:3,  name:"Wind Wave",         tag:"רוח",      desc:"הדגל מתעוות קלות כאילו נושבת בו רוח", C:E3 },
  { id:4,  name:"Mirror Reflection", tag:"השתקפות",  desc:"השתקפות מעומעמת של הדגל מתחתיו כמו על משטח מבריק", C:E4 },
  { id:5,  name:"Freeze → Color",    tag:"קפיאה",    desc:"הדגל קופא לגווני אפור ואז חוזר לצבע — כמו הקפאת פריים", C:E5 },
  { id:6,  name:"Sparkle Crown",     tag:"ניצוצות",  desc:"כוכביות זהובות מופיעות ונעלמות סביב הדגל", C:E6 },
  { id:7,  name:"Fire Glow",         tag:"אש",       desc:"להבה כתומה-אדומה מרצדת בתחתית הדגל", C:E7 },
  { id:8,  name:"Neon Flicker",      tag:"ניאון",    desc:"הדגל מהבהב כמו שלט ניאון ישן שמתקלקל", C:E8 },
  { id:9,  name:"Vortex Glow",       tag:"מערבולת",  desc:"גרדיאנט זוהר מסתובב מסביב לדגל בתנועה רציפה", C:E9 },
  { id:10, name:"Shadow Pulse",      tag:"צל",       desc:"צל עמוק עם גוון צבעוני פולס מתחת לדגל", C:E10 },
  { id:11, name:"Thunder Flash",     tag:"ברק",      desc:"הדגל נחשף בהבזק לבן כמו ברק — כל כמה שניות", C:E11 },
  { id:12, name:"Depth Parallax",    tag:"3D עומק",  desc:"הדגל והצל שלו נעים בתדירויות שונות — תחושת עומק", C:E12 },
  { id:13, name:"Glitch Slice",      tag:"גליץ׳",    desc:"שורות אופקיות של הדגל מתזזות לצד לרגע ומתיישרות", C:E13 },
  { id:14, name:"Color Bloom",       tag:"פריחה",    desc:"הדגל פולט גל צבע ממרכזו החוצה ומתכווץ חזרה", C:E14 },
  { id:15, name:"3D Tilt (hover)",   tag:"עכבר 3D",  desc:"הדגל נוטה ב-3D לפי מיקום העכבר — הזז מעליו", C:E15 },
];

const COLORS = {
  "מסלול":"#fbbf24","גלים":"#60a5fa","רוח":"#86efac","השתקפות":"#cbd5e1",
  "קפיאה":"#94a3b8","ניצוצות":"#fde68a","אש":"#fb923c","ניאון":"#4ade80",
  "מערבולת":"#c084fc","צל":"#6b7280","ברק":"#e2e8f0","3D עומק":"#67e8f9",
  "גליץ׳":"#f87171","פריחה":"#f9a8d4","עכבר 3D":"#34d399",
};

export default function AdminFlagAnimations() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🏳️ אפקטים אמביינטים — 15 רעיונות חדשים</h2>
        <p className="text-slate-400 mt-1 text-sm">אפקטים רציפים שרצים על הדגל. לחץ על כרטיס לפרטים.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EFFECTS.map(({ id, name, tag, C }) => (
          <motion.div key={id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected===id?"border-indigo-500 ring-2 ring-indigo-500/30":"border-slate-700/60 hover:border-slate-500"}`}
            style={{ background:"#0f172a" }}
            whileHover={{ y:-2 }}
            whileTap={{ scale:0.98 }}
            onClick={() => setSelected(id===selected?null:id)}>

            <div className="p-4">
              <C />
            </div>

            <div className="px-4 pb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 font-mono">#{id}</span>
                <span className="text-sm font-semibold text-white">{name}</span>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background:`${COLORS[tag]}18`, color:COLORS[tag], border:`1px solid ${COLORS[tag]}30` }}>
                {tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (() => {
          const fx = EFFECTS.find(e => e.id===selected);
          if (!fx) return null;
          return (
            <motion.div key={selected}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }}
              className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-6 items-start flex-wrap"
              style={{ background:"rgba(15,23,42,0.98)", boxShadow:"0 0 30px rgba(99,102,241,0.12)" }}>
              <div className="flex-shrink-0 w-full sm:w-auto"><fx.C /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-white">#{fx.id} — {fx.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background:`${COLORS[fx.tag]}18`, color:COLORS[fx.tag] }}>{fx.tag}</span>
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
