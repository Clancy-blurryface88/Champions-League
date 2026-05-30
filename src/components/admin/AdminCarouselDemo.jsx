import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

const MATCHES = [
  { id: 0, a: { code: "br", name: "ברזיל" },    b: { code: "ar", name: "ארגנטינה" }, score: "2-1" },
  { id: 1, a: { code: "fr", name: "צרפת" },      b: { code: "es", name: "ספרד" },     score: "1-1" },
  { id: 2, a: { code: "de", name: "גרמניה" },    b: { code: "pt", name: "פורטוגל" }, score: "3-0" },
  { id: 3, a: { code: "us", name: 'ארה"ב' },     b: { code: "mx", name: "מקסיקו" },  score: "0-2" },
  { id: 4, a: { code: "nl", name: "הולנד" },     b: { code: "ma", name: "מרוקו" },   score: "1-0" },
  { id: 5, a: { code: "jp", name: "יפן" },       b: { code: "ca", name: "קנדה" },    score: "2-3" },
];

const Flag = ({ code, name, size = 32 }) => (
  <span className="fi fis rounded-md flex-shrink-0 shadow-md"
    style={{ width: size, height: size, fontSize: size, display: "inline-block",
             backgroundSize: "cover", backgroundPosition: "center" }} title={name}>
    <span className={`fi fi-${code}`} style={{ display: "none" }} />
  </span>
);

// ── Match display (shared) ─────────────────────────────────────────────────────
function MatchDisplay({ match }) {
  return (
    <div key={match.id} className="flex items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Flag code={match.a.code} name={match.a.name} size={36} />
        <span className="text-white/70 text-[10px]">{match.a.name}</span>
      </div>
      <div className="bg-slate-700/80 px-4 py-1.5 rounded-xl">
        <span className="text-white font-black text-lg">{match.score}</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Flag code={match.b.code} name={match.b.name} size={36} />
        <span className="text-white/70 text-[10px]">{match.b.name}</span>
      </div>
    </div>
  );
}

// ── Carousel shell ─────────────────────────────────────────────────────────────
function Carousel({ renderNav }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + MATCHES.length) % MATCHES.length);
  const next = () => setIdx(i => (i + 1) % MATCHES.length);
  const match = MATCHES[idx];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        {renderNav({ onPrev: prev, onNext: next, idx, total: MATCHES.length, match, matches: MATCHES })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }} className="flex justify-center">
          <MatchDisplay match={match} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. Dot Indicators
// ══════════════════════════════════════════════════════════════════════════════
function DotNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <button onClick={onPrev} className="p-2 text-white/40 hover:text-white transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`rounded-full transition-all ${i === idx ? 'w-5 h-2 bg-yellow-400' : 'w-2 h-2 bg-white/20'}`} />
        ))}
      </div>
      <button onClick={onNext} className="p-2 text-white/40 hover:text-white transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. Preview of next match
// ══════════════════════════════════════════════════════════════════════════════
function PreviewNav({ onPrev, onNext, idx, total, matches }) {
  const prevM = matches[(idx - 1 + total) % total];
  const nextM = matches[(idx + 1) % total];
  return (
    <>
      <button onClick={onPrev}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 transition-all">
        <ChevronRight className="w-4 h-4 text-white/50" />
        <Flag code={prevM.a.code} name={prevM.a.name} size={22} />
        <span className="text-white/40 text-[10px]">vs</span>
        <Flag code={prevM.b.code} name={prevM.b.name} size={22} />
      </button>
      <span className="text-slate-500 text-xs">{idx + 1} / {total}</span>
      <button onClick={onNext}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 transition-all">
        <Flag code={nextM.a.code} name={nextM.a.name} size={22} />
        <span className="text-white/40 text-[10px]">vs</span>
        <Flag code={nextM.b.code} name={nextM.b.name} size={22} />
        <ChevronLeft className="w-4 h-4 text-white/50" />
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. Progress Arc
// ══════════════════════════════════════════════════════════════════════════════
function ArcButton({ onClick, dir, pct }) {
  const r = 18, c = 22, stroke = 2.5;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <button onClick={onClick} className="relative w-11 h-11 flex items-center justify-center">
      <svg width={c * 2} height={c * 2} className="absolute" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={c} cy={c} r={r} fill="none" stroke="#f5c518" strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      {dir === 'prev'
        ? <ChevronRight className="w-4 h-4 text-white relative z-10" />
        : <ChevronLeft  className="w-4 h-4 text-white relative z-10" />}
    </button>
  );
}
function ArcNav({ onPrev, onNext, idx, total }) {
  const pct = (idx + 1) / total;
  return (
    <>
      <ArcButton onClick={onPrev} dir="prev" pct={pct} />
      <span className="text-slate-400 text-sm font-semibold">{idx + 1} / {total}</span>
      <ArcButton onClick={onNext} dir="next" pct={pct} />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. Glass Pills
// ══════════════════════════════════════════════════════════════════════════════
function GlassNav({ onPrev, onNext, idx, total }) {
  const btn = "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-semibold";
  const style = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', borderColor: 'rgba(245,197,24,0.3)' };
  return (
    <>
      <button onClick={onPrev} className={btn} style={style}>
        <ChevronRight className="w-4 h-4 text-yellow-400" />
        <span className="text-white/70">הקודם</span>
      </button>
      <span className="text-slate-500 text-xs">{idx + 1} / {total}</span>
      <button onClick={onNext} className={btn} style={style}>
        <span className="text-white/70">הבא</span>
        <ChevronLeft className="w-4 h-4 text-yellow-400" />
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. Swipe Hint (pulsing arrows)
// ══════════════════════════════════════════════════════════════════════════════
function SwipeNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <button onClick={onPrev} className="relative p-3 group">
        <motion.div animate={{ x: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>
          <ChevronRight className="w-7 h-7 text-white/30 group-hover:text-white/80 transition-colors" />
        </motion.div>
      </button>
      <span className="text-slate-500 text-xs">{idx + 1} / {total}</span>
      <button onClick={onNext} className="relative p-3 group">
        <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>
          <ChevronLeft className="w-7 h-7 text-white/30 group-hover:text-white/80 transition-colors" />
        </motion.div>
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. Progress Bar counter
// ══════════════════════════════════════════════════════════════════════════════
function ProgressBarNav({ onPrev, onNext, idx, total }) {
  const pct = ((idx + 1) / total) * 100;
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onPrev}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-all">
          <ChevronRight className="w-4 h-4 text-white/60" />
        </button>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-300"
            animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} />
        </div>
        <button onClick={onNext}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-all">
          <ChevronLeft className="w-4 h-4 text-white/60" />
        </button>
      </div>
      <p className="text-center text-slate-500 text-[10px]">משחק {idx + 1} מתוך {total}</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. Neon Glow
// ══════════════════════════════════════════════════════════════════════════════
function NeonNav({ onPrev, onNext, idx, total }) {
  const neon = {
    width: 40, height: 40, borderRadius: 12,
    background: 'rgba(245,197,24,0.08)',
    border: '1px solid rgba(245,197,24,0.35)',
    boxShadow: '0 0 12px rgba(245,197,24,0.25), inset 0 0 8px rgba(245,197,24,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    transition: 'all 0.2s',
  };
  return (
    <>
      <button onClick={onPrev} style={neon}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 22px rgba(245,197,24,0.55), inset 0 0 12px rgba(245,197,24,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(245,197,24,0.25), inset 0 0 8px rgba(245,197,24,0.05)'}>
        <ChevronRight className="w-5 h-5 text-yellow-400" />
      </button>
      <span className="text-slate-500 text-xs">{idx + 1} / {total}</span>
      <button onClick={onNext} style={neon}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 22px rgba(245,197,24,0.55), inset 0 0 12px rgba(245,197,24,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(245,197,24,0.25), inset 0 0 8px rgba(245,197,24,0.05)'}>
        <ChevronLeft className="w-5 h-5 text-yellow-400" />
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 8. Card Peek (side glimpse)
// ══════════════════════════════════════════════════════════════════════════════
function PeekNav({ onPrev, onNext, idx, total, matches }) {
  const prevM = matches[(idx - 1 + total) % total];
  const nextM = matches[(idx + 1) % total];
  return (
    <>
      {/* Left peek */}
      <button onClick={onPrev}
        className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl border border-white/8 transition-all hover:border-yellow-400/30"
        style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}>
        <ChevronRight className="w-4 h-4 text-white/30 mb-1" />
        <Flag code={prevM.a.code} name={prevM.a.name} size={20} />
      </button>

      <span className="text-slate-500 text-xs flex-1 text-center">{idx + 1} / {total}</span>

      {/* Right peek */}
      <button onClick={onNext}
        className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl border border-white/8 transition-all hover:border-yellow-400/30"
        style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}>
        <ChevronLeft className="w-4 h-4 text-white/30 mb-1" />
        <Flag code={nextM.b.code} name={nextM.b.name} size={20} />
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 9. Rubber Stamp — לחיצה כבדה עם bounce
// ══════════════════════════════════════════════════════════════════════════════
function StampNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      {['prev','next'].map(dir => (
        <motion.button key={dir}
          onClick={dir==='prev' ? onPrev : onNext}
          whileTap={{ scaleY: 0.6, scaleX: 1.2 }}
          transition={{ type:'spring', stiffness:600, damping:15 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/15"
          style={{ background:'rgba(255,255,255,0.06)' }}>
          {dir==='prev'
            ? <ChevronRight className="w-6 h-6 text-white/70" />
            : <ChevronLeft  className="w-6 h-6 text-white/70" />}
        </motion.button>
      ))}
      <span className="text-slate-500 text-xs order-first w-full text-center hidden" />
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 10. Elastic Stretch
// ══════════════════════════════════════════════════════════════════════════════
function ElasticNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <motion.button onClick={onPrev}
        whileHover={{ scaleX: 1.35, scaleY: 0.8 }}
        whileTap={{ scaleX: 0.7, scaleY: 1.2 }}
        transition={{ type:'spring', stiffness:400, damping:12 }}
        className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
        <ChevronRight className="w-5 h-5 text-indigo-300" />
      </motion.button>
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <motion.button onClick={onNext}
        whileHover={{ scaleX: 1.35, scaleY: 0.8 }}
        whileTap={{ scaleX: 0.7, scaleY: 1.2 }}
        transition={{ type:'spring', stiffness:400, damping:12 }}
        className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
        <ChevronLeft className="w-5 h-5 text-indigo-300" />
      </motion.button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 11. Liquid Fill
// ══════════════════════════════════════════════════════════════════════════════
function LiquidBtn({ onClick, dir }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="relative w-12 h-12 rounded-full border border-emerald-500/30 overflow-hidden flex items-center justify-center">
      <motion.div className="absolute inset-0 bg-emerald-500/40 rounded-full"
        initial={{ scale:0, opacity:0 }}
        animate={{ scale: hov?1:0, opacity: hov?1:0 }}
        transition={{ duration:0.35, ease:'easeOut' }} />
      {dir==='prev'
        ? <ChevronRight className="w-5 h-5 text-emerald-300 relative z-10" />
        : <ChevronLeft  className="w-5 h-5 text-emerald-300 relative z-10" />}
    </button>
  );
}
function LiquidNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <LiquidBtn onClick={onPrev} dir="prev" />
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <LiquidBtn onClick={onNext} dir="next" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 12. Holographic — גרדיאנט קשת משתנה
// ══════════════════════════════════════════════════════════════════════════════
function HoloNav({ onPrev, onNext, idx, total }) {
  const holo = { background:'linear-gradient(135deg,#f472b6,#818cf8,#38bdf8,#34d399,#fbbf24)', backgroundSize:'300% 300%', animation:'holo-shift 3s ease infinite', border:'none', borderRadius:14, width:46, height:46, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' };
  return (
    <>
      <style>{`@keyframes holo-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`}</style>
      <motion.button onClick={onPrev} style={holo} whileTap={{ scale:0.9 }}>
        <ChevronRight className="w-5 h-5 text-white drop-shadow" />
      </motion.button>
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <motion.button onClick={onNext} style={holo} whileTap={{ scale:0.9 }}>
        <ChevronLeft className="w-5 h-5 text-white drop-shadow" />
      </motion.button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 13. Scanner Line
// ══════════════════════════════════════════════════════════════════════════════
function ScanBtn({ onClick, dir }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="relative w-12 h-12 rounded-xl border border-cyan-400/25 overflow-hidden flex items-center justify-center"
      style={{ background:'rgba(6,182,212,0.06)' }}>
      <AnimatePresence>
        {hov && <motion.div className="absolute inset-0 w-full h-0.5 bg-cyan-400/70"
          initial={{ top:0 }} animate={{ top:'100%' }} exit={{ opacity:0 }}
          transition={{ duration:0.5, ease:'linear' }} style={{ left:0 }} />}
      </AnimatePresence>
      {dir==='prev'
        ? <ChevronRight className="w-5 h-5 text-cyan-300 relative z-10" />
        : <ChevronLeft  className="w-5 h-5 text-cyan-300 relative z-10" />}
    </button>
  );
}
function ScannerNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <ScanBtn onClick={onPrev} dir="prev" />
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <ScanBtn onClick={onNext} dir="next" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 14. Ripple
// ══════════════════════════════════════════════════════════════════════════════
function RippleBtn({ onClick, dir }) {
  const [ripples, setRipples] = useState([]);
  const fire = () => { const id=Date.now(); setRipples(r=>[...r,id]); setTimeout(()=>setRipples(r=>r.filter(x=>x!==id)),700); onClick(); };
  return (
    <button onClick={fire} className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border border-white/10"
      style={{ background:'rgba(255,255,255,0.06)' }}>
      {ripples.map(id => (
        <motion.span key={id} className="absolute rounded-full bg-white/25"
          initial={{ width:0, height:0, opacity:1 }}
          animate={{ width:80, height:80, opacity:0 }}
          transition={{ duration:0.65, ease:'easeOut' }}
          style={{ left:'50%', top:'50%', transform:'translate(-50%,-50%)' }} />
      ))}
      {dir==='prev'
        ? <ChevronRight className="w-5 h-5 text-white/70 relative z-10" />
        : <ChevronLeft  className="w-5 h-5 text-white/70 relative z-10" />}
    </button>
  );
}
function RippleNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <RippleBtn onClick={onPrev} dir="prev" />
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <RippleBtn onClick={onNext} dir="next" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 15. 3D Flip
// ══════════════════════════════════════════════════════════════════════════════
function FlipNav({ onPrev, onNext, idx, total }) {
  return (
    <div style={{ perspective:600 }} className="flex items-center gap-4 w-full justify-between">
      <motion.button onClick={onPrev} whileTap={{ rotateY:180 }}
        transition={{ duration:0.4 }}
        className="w-12 h-12 rounded-xl flex items-center justify-center border border-purple-400/30"
        style={{ background:'rgba(168,85,247,0.12)', transformStyle:'preserve-3d' }}>
        <ChevronRight className="w-5 h-5 text-purple-300" />
      </motion.button>
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <motion.button onClick={onNext} whileTap={{ rotateY:-180 }}
        transition={{ duration:0.4 }}
        className="w-12 h-12 rounded-xl flex items-center justify-center border border-purple-400/30"
        style={{ background:'rgba(168,85,247,0.12)', transformStyle:'preserve-3d' }}>
        <ChevronLeft className="w-5 h-5 text-purple-300" />
      </motion.button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 16. Heartbeat Pulse
// ══════════════════════════════════════════════════════════════════════════════
function HeartNav({ onPrev, onNext, idx, total }) {
  const pulse = { animate:{ scale:[1,1.18,1,1.08,1] }, transition:{ repeat:Infinity, duration:1.5, ease:'easeInOut' } };
  return (
    <>
      <motion.button onClick={onPrev} {...pulse}
        className="w-12 h-12 rounded-full flex items-center justify-center border border-rose-400/35"
        style={{ background:'rgba(244,63,94,0.12)' }}>
        <ChevronRight className="w-5 h-5 text-rose-300" />
      </motion.button>
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <motion.button onClick={onNext} {...pulse}
        className="w-12 h-12 rounded-full flex items-center justify-center border border-rose-400/35"
        style={{ background:'rgba(244,63,94,0.12)' }}>
        <ChevronLeft className="w-5 h-5 text-rose-300" />
      </motion.button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 17. Stagger Chevrons
// ══════════════════════════════════════════════════════════════════════════════
function ChevronStackBtn({ onClick, dir }) {
  const icons = [0,1,2];
  const [active, setActive] = useState(false);
  const fire = () => { setActive(true); setTimeout(()=>setActive(false),400); onClick(); };
  return (
    <button onClick={fire} className="flex items-center gap-[-6px] px-3 py-2.5 rounded-xl border border-white/8 hover:border-yellow-400/30 transition-all"
      style={{ background:'rgba(255,255,255,0.04)' }}>
      {icons.map(i => (
        <motion.div key={i} animate={active ? { x: dir==='prev' ? [0,-8,0] : [0,8,0], opacity:[1,0.3,1] } : {}}
          transition={{ delay:i*0.06, duration:0.3 }}>
          {dir==='prev' ? <ChevronRight className="w-4 h-4 text-yellow-400/80" style={{ marginRight:-4 }} />
                        : <ChevronLeft  className="w-4 h-4 text-yellow-400/80" style={{ marginLeft:-4 }} />}
        </motion.div>
      ))}
    </button>
  );
}
function StaggerChevronNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <ChevronStackBtn onClick={onPrev} dir="prev" />
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <ChevronStackBtn onClick={onNext} dir="next" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 18. Orbit Dot
// ══════════════════════════════════════════════════════════════════════════════
function OrbitBtn({ onClick, dir }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="relative w-12 h-12 flex items-center justify-center">
      {hov && <motion.div className="absolute w-2 h-2 rounded-full bg-amber-400"
        animate={{ rotate: 360 }} transition={{ repeat:Infinity, duration:1, ease:'linear' }}
        style={{ top:2, left:'50%', transformOrigin:'0 22px', marginLeft:-4 }} />}
      <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center"
        style={{ background:'rgba(255,255,255,0.05)' }}>
        {dir==='prev' ? <ChevronRight className="w-4 h-4 text-white/60" /> : <ChevronLeft className="w-4 h-4 text-white/60" />}
      </div>
    </button>
  );
}
function OrbitNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <OrbitBtn onClick={onPrev} dir="prev" />
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <OrbitBtn onClick={onNext} dir="next" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 19. Glitch Effect
// ══════════════════════════════════════════════════════════════════════════════
function GlitchBtn({ onClick, dir }) {
  const [g, setG] = useState(false);
  const fire = () => { setG(true); setTimeout(()=>setG(false),400); onClick(); };
  return (
    <button onClick={fire} className="relative w-12 h-12 rounded-lg flex items-center justify-center border border-green-400/25 overflow-hidden"
      style={{ background:'rgba(34,197,94,0.07)', fontFamily:'monospace' }}>
      <motion.div animate={g ? { x:[0,3,-3,2,-1,0], filter:['none','hue-rotate(90deg)','hue-rotate(180deg)','none'] } : {}}
        transition={{ duration:0.35 }}>
        {dir==='prev' ? <ChevronRight className="w-5 h-5 text-green-400" /> : <ChevronLeft className="w-5 h-5 text-green-400" />}
      </motion.div>
      {g && <div className="absolute inset-0 opacity-30" style={{ background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,0,0.1) 2px,rgba(0,255,0,0.1) 4px)' }} />}
    </button>
  );
}
function GlitchNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <GlitchBtn onClick={onPrev} dir="prev" />
      <span className="text-slate-500 text-xs font-mono">{idx+1}/{total}</span>
      <GlitchBtn onClick={onNext} dir="next" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 20. Morphing Shape
// ══════════════════════════════════════════════════════════════════════════════
function MorphNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      {['prev','next'].map(dir => (
        <motion.button key={dir} onClick={dir==='prev'?onPrev:onNext}
          whileHover={{ borderRadius:'50%' }}
          whileTap={{ borderRadius:'4px', scale:0.9 }}
          transition={{ duration:0.25 }}
          className="w-12 h-12 flex items-center justify-center border border-violet-400/35"
          style={{ background:'rgba(139,92,246,0.12)', borderRadius:12 }}>
          {dir==='prev' ? <ChevronRight className="w-5 h-5 text-violet-300" /> : <ChevronLeft className="w-5 h-5 text-violet-300" />}
        </motion.button>
      ))}
      <span className="text-slate-500 text-xs order-2">{idx+1}/{total}</span>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 21. Energy Charge
// ══════════════════════════════════════════════════════════════════════════════
function ChargeBtn({ onClick, dir }) {
  const [pct, setPct] = useState(0);
  const [fired, setFired] = useState(false);
  let timer = null;
  const start = () => { timer = setInterval(()=>setPct(p=>Math.min(p+8,100)),40); };
  const end = () => { clearInterval(timer); if(pct>=100){onClick();setFired(true);setTimeout(()=>setFired(false),300);}; setPct(0); };
  return (
    <button onMouseDown={start} onMouseUp={end} onMouseLeave={end}
      className="relative w-14 h-10 rounded-xl overflow-hidden border border-orange-400/30 flex items-center justify-center"
      style={{ background:'rgba(249,115,22,0.07)' }}>
      <motion.div className="absolute left-0 top-0 h-full bg-orange-500/40 rounded-xl"
        animate={{ width:`${pct}%` }} transition={{ duration:0.04 }} />
      {dir==='prev' ? <ChevronRight className="w-4 h-4 text-orange-300 relative z-10" /> : <ChevronLeft className="w-4 h-4 text-orange-300 relative z-10" />}
    </button>
  );
}
function ChargeNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <ChargeBtn onClick={onPrev} dir="prev" />
      <div className="text-center"><span className="text-slate-500 text-[10px] block">לחץ & החזק</span><span className="text-slate-400 text-xs">{idx+1}/{total}</span></div>
      <ChargeBtn onClick={onNext} dir="next" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 22. Double Tap Ring
// ══════════════════════════════════════════════════════════════════════════════
function RingBtn({ onClick, dir }) {
  const [rings, setRings] = useState([]);
  const fire = () => { const id=Date.now(); setRings(r=>[...r,id]); setTimeout(()=>setRings(r=>r.filter(x=>x!==id)),800); onClick(); };
  return (
    <button onClick={fire} className="relative w-12 h-12 flex items-center justify-center">
      {rings.map(id=>(
        <motion.div key={id} className="absolute rounded-full border border-yellow-400/70"
          initial={{ width:12,height:12,opacity:1 }}
          animate={{ width:52,height:52,opacity:0 }}
          transition={{ duration:0.8, ease:'easeOut' }}
          style={{ left:'50%',top:'50%',transform:'translate(-50%,-50%)' }} />
      ))}
      <div className="w-10 h-10 rounded-full flex items-center justify-center border border-yellow-400/30"
        style={{ background:'rgba(245,197,24,0.08)' }}>
        {dir==='prev' ? <ChevronRight className="w-4 h-4 text-yellow-400" /> : <ChevronLeft className="w-4 h-4 text-yellow-400" />}
      </div>
    </button>
  );
}
function RingNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <RingBtn onClick={onPrev} dir="prev" />
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <RingBtn onClick={onNext} dir="next" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 23. Magnetic Pull
// ══════════════════════════════════════════════════════════════════════════════
function MagneticBtn({ onClick, dir }) {
  const [pos, setPos] = useState({ x:0, y:0 });
  const ref = React.useRef(null);
  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    setPos({ x:(e.clientX-cx)*0.35, y:(e.clientY-cy)*0.35 });
  };
  return (
    <motion.button ref={ref} onClick={onClick}
      onMouseMove={onMove} onMouseLeave={()=>setPos({x:0,y:0})}
      animate={{ x:pos.x, y:pos.y }} transition={{ type:'spring', stiffness:300, damping:20 }}
      className="w-12 h-12 rounded-full flex items-center justify-center border border-sky-400/30"
      style={{ background:'rgba(56,189,248,0.10)' }}>
      {dir==='prev' ? <ChevronRight className="w-5 h-5 text-sky-300" /> : <ChevronLeft className="w-5 h-5 text-sky-300" />}
    </motion.button>
  );
}
function MagneticNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <MagneticBtn onClick={onPrev} dir="prev" />
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <MagneticBtn onClick={onNext} dir="next" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 24. Typewriter Counter
// ══════════════════════════════════════════════════════════════════════════════
function TypewriterCounter({ idx, total }) {
  const [displayed, setDisplayed] = useState('');
  const text = `משחק ${idx+1} מתוך ${total}`;
  React.useEffect(() => {
    setDisplayed('');
    let i = 0;
    const iv = setInterval(() => { i++; setDisplayed(text.slice(0,i)); if(i>=text.length) clearInterval(iv); }, 40);
    return () => clearInterval(iv);
  }, [idx]);
  return <span className="text-slate-400 text-xs font-mono min-w-[100px] text-center">{displayed}<span className="opacity-60 animate-pulse">|</span></span>;
}
function TypeNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <button onClick={onPrev} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/8 transition-all">
        <ChevronRight className="w-4 h-4 text-white/50" />
      </button>
      <TypewriterCounter idx={idx} total={total} />
      <button onClick={onNext} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/8 transition-all">
        <ChevronLeft className="w-4 h-4 text-white/50" />
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 25. Drag Track
// ══════════════════════════════════════════════════════════════════════════════
function DragNav({ onPrev, onNext, idx, total }) {
  const [dragging, setDragging] = useState(false);
  const handleDrag = (e, info) => { if(Math.abs(info.offset.x) > 40) { info.offset.x>0 ? onPrev() : onNext(); } };
  const pos = ((idx)/(total-1))*100;
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        <button onClick={onPrev} className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-all">
          <ChevronRight className="w-4 h-4 text-white/50" />
        </button>
        <div className="flex-1 relative h-9 bg-white/5 rounded-lg border border-white/8 overflow-hidden flex items-center px-1">
          <motion.div className="absolute h-7 w-12 rounded-md cursor-grab active:cursor-grabbing flex items-center justify-center"
            style={{ background:'rgba(245,197,24,0.25)', border:'1px solid rgba(245,197,24,0.4)', left:`calc(${pos}% - ${pos*0.4}px)` }}
            drag="x" dragConstraints={{ left:0, right:0 }} dragElastic={0.3}
            onDragEnd={handleDrag}>
            <span className="text-yellow-400 text-[10px] font-bold select-none">{idx+1}</span>
          </motion.div>
        </div>
        <button onClick={onNext} className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-all">
          <ChevronLeft className="w-4 h-4 text-white/50" />
        </button>
      </div>
      <p className="text-center text-slate-600 text-[10px]">אפשר גם לגרור</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 26. Flip Counter (3D digit)
// ══════════════════════════════════════════════════════════════════════════════
function FlipCounterNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <motion.button onClick={onPrev} whileTap={{ scale:0.85, rotate:-15 }}
        className="w-11 h-11 rounded-xl border border-white/12 flex items-center justify-center"
        style={{ background:'rgba(255,255,255,0.05)' }}>
        <ChevronRight className="w-5 h-5 text-white/60" />
      </motion.button>

      <div style={{ perspective:300 }} className="flex items-center gap-1">
        <AnimatePresence mode="wait">
          <motion.div key={idx}
            initial={{ rotateX:90, opacity:0 }}
            animate={{ rotateX:0, opacity:1 }}
            exit={{ rotateX:-90, opacity:0 }}
            transition={{ duration:0.25 }}
            className="w-8 h-10 bg-slate-700 rounded-lg flex items-center justify-center border border-white/10">
            <span className="text-white font-black text-lg">{idx+1}</span>
          </motion.div>
        </AnimatePresence>
        <span className="text-slate-600 text-sm">/</span>
        <span className="text-slate-500 text-sm">{total}</span>
      </div>

      <motion.button onClick={onNext} whileTap={{ scale:0.85, rotate:15 }}
        className="w-11 h-11 rounded-xl border border-white/12 flex items-center justify-center"
        style={{ background:'rgba(255,255,255,0.05)' }}>
        <ChevronLeft className="w-5 h-5 text-white/60" />
      </motion.button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 27. Smoke Trail
// ══════════════════════════════════════════════════════════════════════════════
function SmokeBtn({ onClick, dir }) {
  const [particles, setParticles] = useState([]);
  const fire = () => {
    const newP = Array.from({length:6},(_,i)=>({ id:Date.now()+i, x:(Math.random()-0.5)*30, y:(Math.random()-0.5)*30 }));
    setParticles(p=>[...p,...newP]);
    setTimeout(()=>setParticles(p=>p.filter(x=>!newP.find(n=>n.id===x.id))),700);
    onClick();
  };
  return (
    <button onClick={fire} className="relative w-12 h-12 rounded-full flex items-center justify-center border border-slate-500/30"
      style={{ background:'rgba(100,116,139,0.12)' }}>
      {particles.map(p=>(
        <motion.div key={p.id} className="absolute w-1.5 h-1.5 rounded-full bg-slate-400/60"
          initial={{ x:0,y:0,opacity:1,scale:1 }}
          animate={{ x:p.x,y:p.y,opacity:0,scale:0 }}
          transition={{ duration:0.65 }} />
      ))}
      {dir==='prev' ? <ChevronRight className="w-5 h-5 text-slate-300 relative z-10" /> : <ChevronLeft className="w-5 h-5 text-slate-300 relative z-10" />}
    </button>
  );
}
function SmokeNav({ onPrev, onNext, idx, total }) {
  return (
    <>
      <SmokeBtn onClick={onPrev} dir="prev" />
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <SmokeBtn onClick={onNext} dir="next" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 28. Split Reveal
// ══════════════════════════════════════════════════════════════════════════════
function SplitNav({ onPrev, onNext, idx, total }) {
  const [split, setSplit] = useState(null);
  const fire = (dir) => { setSplit(dir); setTimeout(()=>setSplit(null),350); dir==='prev'?onPrev():onNext(); };
  return (
    <>
      <button onClick={()=>fire('prev')}
        className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/8 transition-all overflow-hidden relative"
        style={{ background:'rgba(255,255,255,0.04)' }}>
        <AnimatePresence>
          {split==='prev' && <>
            <motion.div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10"
              initial={{y:0}} animate={{y:'-100%'}} exit={{}} transition={{duration:0.3}} />
            <motion.div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/10"
              initial={{y:0}} animate={{y:'100%'}} exit={{}} transition={{duration:0.3}} />
          </>}
        </AnimatePresence>
        <ChevronRight className="w-5 h-5 text-white/60 relative z-10" />
      </button>
      <span className="text-slate-500 text-xs">{idx+1}/{total}</span>
      <button onClick={()=>fire('next')}
        className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/8 transition-all overflow-hidden relative"
        style={{ background:'rgba(255,255,255,0.04)' }}>
        <AnimatePresence>
          {split==='next' && <>
            <motion.div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10"
              initial={{y:0}} animate={{y:'-100%'}} exit={{}} transition={{duration:0.3}} />
            <motion.div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/10"
              initial={{y:0}} animate={{y:'100%'}} exit={{}} transition={{duration:0.3}} />
          </>}
        </AnimatePresence>
        <ChevronLeft className="w-5 h-5 text-white/60 relative z-10" />
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
const DEMOS = [
  { id: "dots",     label: "Dot Indicators",  emoji: "⚫", nav: DotNav },
  { id: "preview",  label: "Preview",          emoji: "👀", nav: PreviewNav },
  { id: "arc",      label: "Progress Arc",     emoji: "🌀", nav: ArcNav },
  { id: "glass",    label: "Glass Pills",      emoji: "💊", nav: GlassNav },
  { id: "swipe",    label: "Swipe Hint",       emoji: "👈", nav: SwipeNav },
  { id: "progress", label: "Progress Bar",     emoji: "📊", nav: ProgressBarNav },
  { id: "neon",     label: "Neon Glow",        emoji: "✨", nav: NeonNav },
  { id: "peek",     label: "Card Peek",        emoji: "🃏", nav: PeekNav },
  { id: "stamp",    label: "Rubber Stamp",     emoji: "🖊️", nav: StampNav },
  { id: "elastic",  label: "Elastic Stretch",  emoji: "🤸", nav: ElasticNav },
  { id: "liquid",   label: "Liquid Fill",      emoji: "💧", nav: LiquidNav },
  { id: "holo",     label: "Holographic",      emoji: "🌈", nav: HoloNav },
  { id: "scanner",  label: "Scanner Line",     emoji: "📡", nav: ScannerNav },
  { id: "ripple",   label: "Ripple",           emoji: "💦", nav: RippleNav },
  { id: "flip3d",   label: "3D Flip",          emoji: "🎲", nav: FlipNav },
  { id: "heart",    label: "Heartbeat",        emoji: "❤️", nav: HeartNav },
  { id: "stagger",  label: "Stagger Chevrons", emoji: "»»", nav: StaggerChevronNav },
  { id: "orbit",    label: "Orbit Dot",        emoji: "🪐", nav: OrbitNav },
  { id: "glitch",   label: "Glitch",           emoji: "⚡", nav: GlitchNav },
  { id: "morph",    label: "Morphing Shape",   emoji: "🔮", nav: MorphNav },
  { id: "charge",   label: "Energy Charge",    emoji: "🔋", nav: ChargeNav },
  { id: "ring",     label: "Ring Burst",       emoji: "💫", nav: RingNav },
  { id: "magnetic", label: "Magnetic Pull",    emoji: "🧲", nav: MagneticNav },
  { id: "type",     label: "Typewriter",       emoji: "⌨️", nav: TypeNav },
  { id: "drag",     label: "Drag Track",       emoji: "🎚️", nav: DragNav },
  { id: "flipcnt",  label: "Flip Counter",     emoji: "🔢", nav: FlipCounterNav },
  { id: "smoke",    label: "Smoke Trail",      emoji: "💨", nav: SmokeNav },
  { id: "split",    label: "Split Reveal",     emoji: "✂️", nav: SplitNav },
];

export default function AdminCarouselDemo() {
  const [active, setActive] = useState("dots");
  const current = DEMOS.find(d => d.id === active);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">דמו — עיצובי לחצני קרוסלה</h2>
        <p className="text-slate-500 text-sm mt-1">לחץ על כל סגנון ונסה ניווט בין המשחקים</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {DEMOS.map(d => (
          <button key={d.id} onClick={() => setActive(d.id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              active === d.id
                ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-300"
                : "bg-white/4 border-white/8 text-slate-400 hover:text-white hover:bg-white/8"
            }`}>
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      {/* Demo panel */}
      <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6 min-h-[180px]">
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}>
            <Carousel renderNav={(props) => <current.nav {...props} />} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
