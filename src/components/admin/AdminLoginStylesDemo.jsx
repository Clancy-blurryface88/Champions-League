import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Expand, Check } from "lucide-react";

// ─── Mini preview wrapper ────────────────────────────────────────────────────
const PreviewCard = ({ variant, onClick, isSelected }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-colors ${
      isSelected ? "border-amber-400 shadow-lg shadow-amber-400/20" : "border-white/10 hover:border-white/30"
    }`}
    style={{ height: 220 }}
  >
    <div className="absolute inset-0 scale-[0.48] origin-top-left" style={{ width: "208%", height: "208%" }}>
      {variant.preview}
    </div>
    {isSelected && (
      <div className="absolute top-2 right-2 bg-amber-400 text-black rounded-full p-0.5">
        <Check className="w-3 h-3" />
      </div>
    )}
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
      <p className="text-white text-xs font-semibold truncate">{variant.name}</p>
      <p className="text-white/50 text-[10px] truncate">{variant.description}</p>
    </div>
    <div className="absolute top-2 left-2">
      <button
        onClick={e => { e.stopPropagation(); onClick(true); }}
        className="bg-black/50 hover:bg-black/80 text-white rounded-lg p-1 backdrop-blur-sm"
        title="תצוגה מלאה"
      >
        <Expand className="w-3 h-3" />
      </button>
    </div>
  </motion.div>
);

// ─── Full-screen overlay preview ─────────────────────────────────────────────
const FullPreview = ({ variant, onClose }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white flex items-center gap-1 text-sm"
        >
          <X className="w-4 h-4" /> סגור תצוגה מלאה
        </button>
        {variant.preview}
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  25 VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

function useCountdown(target) {
  const [diff, setDiff] = useState(() => Math.max(0, new Date(target) - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setDiff(Math.max(0, new Date(target) - Date.now())), 1000);
    return () => clearInterval(t);
  }, [target]);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

const TROPHY_IMG = "/trophy.png";
const DEMO_NAME = "משה";
const DEMO_EMAIL = "playerclancy3@gmail.com";

// 1 – DARK MINIMAL (current)
const V1 = () => (
  <div className="min-h-[420px] bg-black flex items-center justify-center p-4">
    <div className="w-80 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-8 pt-8 pb-6 text-center border-b border-white/[0.06]">
        <img src={TROPHY_IMG} alt="" className="w-16 mx-auto mb-5" />
        <h2 className="text-white text-xl font-semibold">World Cup 2026</h2>
        <p className="text-white/40 text-sm mt-1">שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-center text-white text-sm">{DEMO_NAME}</div>
        <p className="text-white/25 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full bg-white text-black text-sm font-semibold py-3 rounded-xl hover:bg-white/90">התחל לשחק</button>
      </div>
    </div>
  </div>
);

// 2 – STADIUM NIGHT (green spotlight)
const V2 = () => (
  <div className="min-h-[420px] bg-[#050f05] flex items-center justify-center p-4 relative overflow-hidden">
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(34,197,94,0.18) 0%, transparent 70%)" }} />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-40 bg-green-400/10" style={{ boxShadow: "0 0 80px 40px rgba(34,197,94,0.12)" }} />
    <div className="w-80 bg-black/80 border border-green-500/20 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm relative z-10">
      <div className="px-8 pt-8 pb-6 text-center border-b border-green-500/10">
        <img src={TROPHY_IMG} alt="" className="w-16 mx-auto mb-5 drop-shadow-[0_0_16px_rgba(34,197,94,0.5)]" />
        <h2 className="text-green-400 text-xl font-bold tracking-wide">World Cup 2026</h2>
        <p className="text-green-400/50 text-sm mt-1">שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3 text-center text-white text-sm">{DEMO_NAME}</div>
        <p className="text-green-400/25 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full bg-green-500 text-black text-sm font-bold py-3 rounded-xl hover:bg-green-400 transition-colors">⚽ התחל לשחק</button>
      </div>
    </div>
  </div>
);

// 3 – GOLD TROPHY
const V3 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg,#1a0e00 0%,#2d1a00 50%,#1a0e00 100%)" }}>
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(160deg,#2a1a00,#1a0e00)", border: "1px solid rgba(251,191,36,0.3)" }}>
      <div className="px-8 pt-8 pb-6 text-center border-b border-amber-500/10">
        <div className="relative w-16 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full blur-xl bg-amber-400/40" />
          <img src={TROPHY_IMG} alt="" className="relative w-16 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
        </div>
        <h2 className="text-amber-400 text-xl font-bold tracking-wide" style={{ textShadow: "0 0 20px rgba(251,191,36,0.5)" }}>World Cup 2026</h2>
        <p className="text-amber-400/50 text-sm mt-1">שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="rounded-xl px-4 py-3 text-center text-amber-300 text-sm" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>{DEMO_NAME}</div>
        <p className="text-amber-400/25 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full text-black text-sm font-bold py-3 rounded-xl transition-all" style={{ background: "linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)" }}>🏆 התחל לשחק</button>
      </div>
    </div>
  </div>
);

// 4 – PITCH GREEN (football field lines)
const V4 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "#1a4a1a" }}>
    {/* Field lines */}
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.15) 40px, rgba(255,255,255,0.15) 42px)" }} />
    <div className="absolute inset-0 flex items-center justify-center opacity-10">
      <div className="w-48 h-48 rounded-full border-4 border-white" />
    </div>
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl relative z-10 backdrop-blur-sm" style={{ background: "rgba(0,30,0,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}>
      <div className="px-8 pt-8 pb-6 text-center border-b border-white/10">
        <img src={TROPHY_IMG} alt="" className="w-16 mx-auto mb-5" />
        <h2 className="text-white text-xl font-bold">World Cup 2026</h2>
        <p className="text-white/50 text-sm mt-1">שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center text-white text-sm">{DEMO_NAME}</div>
        <p className="text-white/30 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full bg-white text-[#1a4a1a] text-sm font-bold py-3 rounded-xl hover:bg-white/90">⚽ צא לשחק</button>
      </div>
    </div>
  </div>
);

// 5 – NEON CYBER
const V5 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#060010] relative overflow-hidden">
    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(168,85,247,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.1) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl relative z-10" style={{ background: "#0a0015", border: "1px solid rgba(168,85,247,0.5)", boxShadow: "0 0 30px rgba(168,85,247,0.2), inset 0 0 30px rgba(168,85,247,0.05)" }}>
      <div className="px-8 pt-8 pb-6 text-center border-b border-purple-500/20">
        <img src={TROPHY_IMG} alt="" className="w-16 mx-auto mb-5 drop-shadow-[0_0_16px_rgba(168,85,247,0.8)]" />
        <h2 className="font-bold text-xl" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>World Cup 2026</h2>
        <p className="text-purple-400/50 text-sm mt-1">שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="rounded-xl px-4 py-3 text-center text-purple-300 text-sm" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.3)" }}>{DEMO_NAME}</div>
        <p className="text-purple-400/30 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full text-white text-sm font-bold py-3 rounded-xl" style={{ background: "linear-gradient(90deg,#7c3aed,#db2777)", boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}>⚡ התחל לשחק</button>
      </div>
    </div>
  </div>
);

// 6 – NEWSPAPER (black & white retro)
const V6 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#f5f0e8]">
    <div className="w-80 rounded-none shadow-2xl border-4 border-black bg-[#f5f0e8]">
      <div className="border-b-4 border-black px-4 py-2 text-center">
        <div className="text-[10px] uppercase tracking-widest font-bold text-black/60 border-b border-black/30 pb-1 mb-1">⬡ WORLD CUP EDITION ⬡</div>
        <h2 className="text-2xl font-black tracking-tight text-black" style={{ fontFamily: "Georgia, serif" }}>WORLD CUP 2026</h2>
        <div className="text-[10px] tracking-widest text-black/50 mt-1">שמך בטורניר</div>
      </div>
      <div className="px-6 py-6 space-y-4 bg-[#f5f0e8]">
        <img src={TROPHY_IMG} alt="" className="w-12 mx-auto grayscale" />
        <div className="border-2 border-black rounded-none px-4 py-3 text-center text-black font-mono font-bold">{DEMO_NAME}</div>
        <p className="text-black/40 text-xs text-center font-mono">{DEMO_EMAIL}</p>
        <button className="w-full bg-black text-white text-sm font-black py-3 rounded-none tracking-widest hover:bg-black/80">▶ PLAY NOW</button>
      </div>
    </div>
  </div>
);

// 7 – RETRO SCOREBOARD
const V7 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#0a0a0a]">
    <div className="w-80 rounded-lg shadow-2xl border border-yellow-500/30 overflow-hidden" style={{ background: "#111", fontFamily: "'Courier New', monospace" }}>
      <div className="bg-yellow-500 text-black text-center py-2 text-xs font-black tracking-widest">◆ TOURNAMENT LOGIN ◆</div>
      <div className="px-6 py-6 text-center space-y-4">
        <div className="text-5xl">🏆</div>
        <div className="border border-yellow-500/40 rounded py-2 px-4">
          <div className="text-yellow-500 text-xs tracking-widest mb-1">PLAYER NAME</div>
          <div className="text-white text-xl font-bold tracking-wider">{DEMO_NAME}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {["W","O","R"].map((l,i) => <div key={i} className="border border-yellow-500/30 py-2 text-yellow-500 font-black text-lg">{l}</div>)}
          {["L","D","!"].map((l,i) => <div key={i} className="border border-yellow-500/30 py-2 text-yellow-500 font-black text-lg">{l}</div>)}
        </div>
        <button className="w-full bg-yellow-500 text-black text-sm font-black py-3 tracking-widest">[ INSERT COIN ]</button>
      </div>
    </div>
  </div>
);

// 8 – FIFA CARD (gold player card style)
const V8 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg,#1a1200,#0d0900)" }}>
    <div className="w-64 relative" style={{ aspectRatio: "2/3" }}>
      <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(145deg,#c8a84b,#f0d060,#c8a84b,#a07830)", padding: "3px" }}>
        <div className="h-full rounded-[10px] overflow-hidden" style={{ background: "linear-gradient(160deg,#1a1000 0%,#2d1e00 100%)" }}>
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="text-amber-400 font-black text-3xl" style={{ textShadow: "0 0 10px rgba(251,191,36,0.5)" }}>99</div>
              <div className="text-right">
                <div className="text-amber-400/80 text-[10px] font-bold">ATT</div>
                <div className="text-amber-400/80 text-[10px] font-bold">99</div>
                <div className="text-amber-400/80 text-[10px] font-bold">DEF</div>
                <div className="text-amber-400/80 text-[10px] font-bold">99</div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img src={TROPHY_IMG} alt="" className="w-20 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
            </div>
            <div className="text-center">
              <div className="text-amber-300 font-black text-lg tracking-wider">{DEMO_NAME}</div>
              <div className="text-amber-400/50 text-xs tracking-widest">WORLD CUP 2026</div>
              <button className="mt-3 w-full rounded text-black text-xs font-black py-2" style={{ background: "linear-gradient(90deg,#c8a84b,#f0d060)" }}>התחל לשחק</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 9 – GLASSMORPHISM (premium)
const V9 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#667eea 0%,#764ba2 50%,#f093fb 100%)" }}>
    <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
    <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-white/20 blur-2xl" />
    <div className="w-80 rounded-3xl overflow-hidden shadow-2xl relative z-10" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.3)" }}>
      <div className="px-8 pt-8 pb-6 text-center border-b border-white/20">
        <img src={TROPHY_IMG} alt="" className="w-16 mx-auto mb-5 drop-shadow-lg" />
        <h2 className="text-white text-xl font-bold">World Cup 2026</h2>
        <p className="text-white/60 text-sm mt-1">שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="rounded-2xl px-4 py-3 text-center text-white text-sm" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>{DEMO_NAME}</div>
        <p className="text-white/40 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full text-white text-sm font-bold py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.4)" }}>✨ התחל לשחק</button>
      </div>
    </div>
  </div>
);

// 10 – FLAG RAIN
const FLAGS = ["🇧🇷","🇩🇪","🇫🇷","🇦🇷","🇪🇸","🇵🇹","🇮🇹","🇳🇱","🇬🇧","🇺🇸","🇯🇵","🇲🇽","🇦🇺","🇧🇪","🇨🇷"];
const V10 = () => {
  const flags = Array.from({ length: 20 }, (_, i) => ({
    flag: FLAGS[i % FLAGS.length],
    left: `${(i * 7 + 3) % 100}%`,
    delay: (i * 0.3) % 4,
    dur: 3 + (i % 3),
  }));
  return (
    <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#070b14] relative overflow-hidden">
      {flags.map((f, i) => (
        <motion.div key={i} className="absolute top-0 text-xl select-none pointer-events-none"
          style={{ left: f.left }}
          animate={{ y: ["0%", "120vh"] }}
          transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: "linear" }}
        >{f.flag}</motion.div>
      ))}
      <div className="w-80 rounded-2xl overflow-hidden shadow-2xl relative z-10" style={{ background: "rgba(7,11,20,0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="px-8 pt-8 pb-6 text-center border-b border-white/[0.06]">
          <img src={TROPHY_IMG} alt="" className="w-16 mx-auto mb-5" />
          <h2 className="text-white text-xl font-semibold">World Cup 2026</h2>
          <p className="text-white/40 text-sm mt-1">שמך בטורניר</p>
        </div>
        <div className="px-8 py-6 space-y-4">
          <div className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-center text-white text-sm">{DEMO_NAME}</div>
          <p className="text-white/25 text-xs text-center">{DEMO_EMAIL}</p>
          <button className="w-full bg-white text-black text-sm font-bold py-3 rounded-xl">🏳 התחל לשחק</button>
        </div>
      </div>
    </div>
  );
};

// 11 – CONFETTI BURST
const CONFETTI_COLORS = ["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#ff6bcd","#ff9f43"];
const V11 = () => {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${(i * 13 + 5) % 100}%`,
    delay: (i * 0.2) % 3,
    rotate: i * 37,
  }));
  return (
    <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#0a0a1a] relative overflow-hidden">
      {pieces.map((p, i) => (
        <motion.div key={i}
          className="absolute top-0 w-2 h-4 rounded-sm"
          style={{ left: p.left, background: p.color, rotate: p.rotate }}
          animate={{ y: ["0%", "120vh"], rotate: [p.rotate, p.rotate + 360] }}
          transition={{ duration: 2.5, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
      <div className="w-80 rounded-2xl overflow-hidden shadow-2xl relative z-10 bg-[#111] border border-white/10">
        <div className="px-8 pt-8 pb-6 text-center border-b border-white/[0.06]">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <img src={TROPHY_IMG} alt="" className="w-16 mx-auto mb-5" />
          </motion.div>
          <h2 className="text-white text-xl font-semibold">World Cup 2026</h2>
          <p className="text-white/40 text-sm mt-1">🎉 שמך בטורניר</p>
        </div>
        <div className="px-8 py-6 space-y-4">
          <div className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-center text-white text-sm">{DEMO_NAME}</div>
          <p className="text-white/25 text-xs text-center">{DEMO_EMAIL}</p>
          <button className="w-full text-white text-sm font-bold py-3 rounded-xl" style={{ background: "linear-gradient(90deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff)" }}>🎊 התחל לשחק!</button>
        </div>
      </div>
    </div>
  );
};

// 12 – COUNTDOWN TIMER
const V12 = () => {
  const { d, h, m, s } = useCountdown("2026-06-11T16:00:00Z");
  return (
    <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#0d0d0d]">
      <div className="w-80 rounded-2xl overflow-hidden shadow-2xl bg-[#111] border border-white/10">
        <div className="px-8 pt-6 pb-4 text-center border-b border-white/[0.06]">
          <img src={TROPHY_IMG} alt="" className="w-12 mx-auto mb-3" />
          <h2 className="text-white text-lg font-bold">World Cup 2026</h2>
          <p className="text-white/40 text-xs mt-1">⏱ עד פתיחת המונדיאל</p>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[{ v: d, l: "ימים" }, { v: h, l: "שעות" }, { v: m, l: "דקות" }, { v: s, l: "שניות" }].map(({ v, l }) => (
              <div key={l} className="bg-white/5 border border-white/10 rounded-xl p-2">
                <div className="text-white font-black text-xl font-mono">{String(v).padStart(2, "0")}</div>
                <div className="text-white/30 text-[10px]">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-8 py-5 space-y-3">
          <div className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-center text-white text-sm">{DEMO_NAME}</div>
          <p className="text-white/25 text-xs text-center">{DEMO_EMAIL}</p>
          <button className="w-full bg-white text-black text-sm font-bold py-3 rounded-xl">🚀 התחל לשחק</button>
        </div>
      </div>
    </div>
  );
};

// 13 – MATCH TICKET
const V13 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#0d0d0d]">
    <div className="w-80 relative">
      <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#1e3a5f,#0d2137)" }}>
        <div className="px-6 py-4 flex justify-between items-center border-b border-white/10">
          <div>
            <div className="text-blue-300 text-xs font-bold tracking-widest">WORLD CUP 2026</div>
            <div className="text-white text-lg font-black">ADMISSION</div>
          </div>
          <img src={TROPHY_IMG} alt="" className="w-12" />
        </div>
        <div className="px-6 py-4 border-b border-dashed border-white/20">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div><div className="text-white/40 uppercase tracking-wider mb-1">שחקן</div><div className="text-white font-bold">{DEMO_NAME}</div></div>
            <div><div className="text-white/40 uppercase tracking-wider mb-1">קטגוריה</div><div className="text-white font-bold">VIP</div></div>
            <div><div className="text-white/40 uppercase tracking-wider mb-1">עונה</div><div className="text-white font-bold">2026</div></div>
            <div><div className="text-white/40 uppercase tracking-wider mb-1">מושב</div><div className="text-white font-bold">A-01</div></div>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="text-white/20 text-xs text-center mb-3 font-mono tracking-widest">████████████ BARCODE ████████████</div>
          <p className="text-white/25 text-xs text-center mb-3">{DEMO_EMAIL}</p>
          <button className="w-full bg-blue-500 text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-400">🎫 כנס לטורניר</button>
        </div>
      </div>
    </div>
  </div>
);

// 14 – HOLOGRAM (sci-fi)
const V14 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#000810] relative overflow-hidden">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,200,255,0.05) 3px, rgba(0,200,255,0.05) 4px)" }} />
    <motion.div
      className="absolute inset-0"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ background: "radial-gradient(ellipse 50% 30% at 50% 50%, rgba(0,200,255,0.06) 0%, transparent 70%)" }}
    />
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl relative z-10" style={{ background: "rgba(0,20,40,0.9)", border: "1px solid rgba(0,200,255,0.4)", boxShadow: "0 0 40px rgba(0,200,255,0.15), inset 0 0 40px rgba(0,200,255,0.05)" }}>
      <div className="px-8 pt-8 pb-6 text-center border-b border-cyan-500/20">
        <motion.img src={TROPHY_IMG} alt="" className="w-16 mx-auto mb-5"
          style={{ filter: "drop-shadow(0 0 20px rgba(0,200,255,0.8)) hue-rotate(180deg)" }}
          animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }}
        />
        <h2 className="text-cyan-400 text-xl font-bold tracking-widest" style={{ textShadow: "0 0 20px rgba(0,200,255,0.8)" }}>WORLD CUP 2026</h2>
        <p className="text-cyan-400/50 text-sm mt-1 tracking-wider">IDENTITY SCAN</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="rounded-xl px-4 py-3 text-center font-mono tracking-wider" style={{ background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.3)", color: "#00c8ff" }}>{DEMO_NAME}</div>
        <p className="text-cyan-400/30 text-xs text-center font-mono">{DEMO_EMAIL}</p>
        <button className="w-full text-black text-sm font-bold py-3 rounded-xl tracking-widest" style={{ background: "linear-gradient(90deg,#00c8ff,#0080ff)", boxShadow: "0 0 20px rgba(0,200,255,0.4)" }}>▶ INITIALIZE</button>
      </div>
    </div>
  </div>
);

// 15 – TV BROADCAST (sports overlay)
const V15 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "linear-gradient(180deg,#0a0a1a 0%,#000 100%)" }}>
    <div className="absolute top-0 inset-x-0 h-8 flex items-center px-4 gap-4" style={{ background: "rgba(220,30,30,0.9)" }}>
      <div className="text-white text-xs font-black tracking-widest animate-pulse">🔴 LIVE</div>
      <div className="text-white text-xs font-bold">WORLD CUP 2026 | GROUP STAGE</div>
      <div className="ml-auto text-white text-xs font-mono">22:45 IST</div>
    </div>
    <div className="w-80 rounded-xl overflow-hidden shadow-2xl relative z-10 bg-[#111] border border-white/10">
      <div className="bg-gradient-to-r from-red-900/50 to-black px-6 py-4 flex items-center gap-3 border-b border-white/10">
        <img src={TROPHY_IMG} alt="" className="w-10" />
        <div>
          <div className="text-white font-black text-base">PLAYER LOGIN</div>
          <div className="text-white/50 text-xs">FIFA World Cup™ 2026</div>
        </div>
      </div>
      <div className="px-6 py-5 space-y-3">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-sm">{DEMO_NAME[0]}</div>
          <div>
            <div className="text-white text-sm font-bold">{DEMO_NAME}</div>
            <div className="text-white/40 text-xs">{DEMO_EMAIL}</div>
          </div>
        </div>
        <button className="w-full bg-red-600 text-white text-sm font-bold py-3 rounded-lg hover:bg-red-500">▶ ENTER MATCH</button>
      </div>
    </div>
  </div>
);

// 16 – CHALK BOARD (tactical)
const V16 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4" style={{ background: "#1a2e1a" }}>
    <div className="w-80 rounded-none shadow-2xl border-4 border-white/30 relative overflow-hidden" style={{ background: "#1f3b1f" }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='white'/%3E%3C/svg%3E\")" }} />
      <div className="relative z-10 px-8 pt-8 pb-6 text-center border-b-2 border-dashed border-white/30">
        <div className="text-4xl mb-3">⚽</div>
        <h2 className="text-white text-xl font-bold" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.5)", fontFamily: "cursive" }}>World Cup 2026</h2>
        <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "cursive" }}>שמך בטורניר</p>
        {/* Tactical arrows */}
        <div className="flex justify-center gap-4 mt-3 text-white/30 text-lg">
          <span>↗</span><span>↑</span><span>↗</span>
        </div>
      </div>
      <div className="relative z-10 px-8 py-6 space-y-4">
        <div className="border-2 border-dashed border-white/40 rounded-sm px-4 py-3 text-center text-white text-sm" style={{ fontFamily: "cursive" }}>{DEMO_NAME}</div>
        <p className="text-white/30 text-xs text-center font-mono">{DEMO_EMAIL}</p>
        <button className="w-full border-2 border-white text-white text-sm font-bold py-3 rounded-sm hover:bg-white/10" style={{ fontFamily: "cursive" }}>🟢 צא לגראונד</button>
      </div>
    </div>
  </div>
);

// 17 – BRAZIL THEME
const V17 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg,#009c3b 0%,#006b29 100%)" }}>
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400">
      <div className="px-8 pt-8 pb-6 text-center border-b-2 border-yellow-400/30" style={{ background: "#005a22" }}>
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-yellow-400 flex items-center justify-center">
          <img src={TROPHY_IMG} alt="" className="w-12" />
        </div>
        <h2 className="text-yellow-400 text-xl font-black tracking-wide">World Cup 2026</h2>
        <p className="text-yellow-400/60 text-sm mt-1">שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4" style={{ background: "#006b29" }}>
        <div className="bg-yellow-400/10 border-2 border-yellow-400/40 rounded-xl px-4 py-3 text-center text-yellow-300 text-sm">{DEMO_NAME}</div>
        <p className="text-yellow-400/30 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full bg-yellow-400 text-green-900 text-sm font-black py-3 rounded-xl hover:bg-yellow-300">🇧🇷 JOGAR AGORA!</button>
      </div>
    </div>
  </div>
);

// 18 – VIP LOUNGE (dark luxury)
const V18 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4" style={{ background: "#080508" }}>
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(160deg,#1a0f1a,#0d080d)", border: "1px solid rgba(180,140,200,0.2)" }}>
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#7c3aed,#a855f7,#7c3aed)" }} />
      <div className="px-8 pt-8 pb-6 text-center border-b border-purple-500/10">
        <div className="text-xs tracking-[0.4em] text-purple-400/60 uppercase mb-4">VIP ACCESS</div>
        <img src={TROPHY_IMG} alt="" className="w-14 mx-auto mb-4 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
        <h2 className="text-white text-xl font-light tracking-[0.15em]">World Cup 2026</h2>
        <p className="text-purple-300/40 text-xs mt-2 tracking-wider">שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="rounded-xl px-4 py-3 text-center text-purple-200 text-sm tracking-wider" style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)" }}>{DEMO_NAME}</div>
        <p className="text-purple-400/25 text-xs text-center tracking-widest">{DEMO_EMAIL}</p>
        <button className="w-full text-white text-xs font-light py-3 rounded-xl tracking-[0.3em]" style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.3)" }}>ENTER</button>
      </div>
    </div>
  </div>
);

// 19 – PIXEL / 8-BIT
const V19 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#0a0a0a]">
    <div className="w-80 border-4 border-white shadow-2xl" style={{ fontFamily: "'Courier New', monospace", imageRendering: "pixelated", background: "#111" }}>
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b-4 border-white">
        <div className="w-3 h-3 bg-red-500 border-2 border-white" />
        <div className="w-3 h-3 bg-yellow-500 border-2 border-white" />
        <div className="w-3 h-3 bg-green-500 border-2 border-white" />
        <span className="text-white text-xs ml-2">PLAYER_ENTRY.EXE</span>
      </div>
      <div className="p-6 text-center space-y-4">
        <div className="text-5xl leading-none" style={{ imageRendering: "pixelated" }}>🏆</div>
        <div className="text-green-400 font-bold text-sm tracking-wider">
          {'>'} WORLD CUP 2026
        </div>
        <div className="text-green-400/60 text-xs">{'>'} INSERT PLAYER NAME:</div>
        <div className="border-2 border-green-400 px-3 py-2 text-green-400 text-sm text-center">
          {DEMO_NAME}<span className="animate-pulse">_</span>
        </div>
        <div className="text-green-400/30 text-xs">{DEMO_EMAIL}</div>
        <button className="w-full border-4 border-green-400 text-green-400 text-sm font-bold py-3 hover:bg-green-400 hover:text-black transition-colors">[ PRESS START ]</button>
      </div>
    </div>
  </div>
);

// 20 – MINIMALIST WHITE (Apple style)
const V20 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 bg-gray-50">
    <div className="w-80 rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-100">
      <div className="px-8 pt-10 pb-6 text-center border-b border-gray-100">
        <img src={TROPHY_IMG} alt="" className="w-14 mx-auto mb-6" />
        <h2 className="text-gray-900 text-xl font-semibold">World Cup 2026</h2>
        <p className="text-gray-400 text-sm mt-1">שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-center text-gray-800 text-sm">{DEMO_NAME}</div>
        <p className="text-gray-400 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full bg-gray-900 text-white text-sm font-semibold py-3 rounded-2xl hover:bg-gray-700">התחל לשחק</button>
      </div>
    </div>
  </div>
);

// 21 – FIRE/INFERNO
const V21 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "#0d0200" }}>
    <div className="absolute bottom-0 inset-x-0 h-32 opacity-60" style={{ background: "linear-gradient(0deg,rgba(255,80,0,0.4) 0%,transparent 100%)" }} />
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl relative z-10" style={{ background: "#100500", border: "1px solid rgba(255,100,0,0.4)" }}>
      <div className="px-8 pt-8 pb-6 text-center border-b border-orange-500/20">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <img src={TROPHY_IMG} alt="" className="w-16 mx-auto mb-5 drop-shadow-[0_0_20px_rgba(255,100,0,0.9)]" style={{ filter: "drop-shadow(0 0 20px rgba(255,100,0,0.9))" }} />
        </motion.div>
        <h2 className="font-bold text-xl" style={{ background: "linear-gradient(90deg,#ff6b00,#ff9f43,#ff6b00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>World Cup 2026</h2>
        <p className="text-orange-400/50 text-sm mt-1">🔥 שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="rounded-xl px-4 py-3 text-center text-orange-300 text-sm" style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.3)" }}>{DEMO_NAME}</div>
        <p className="text-orange-400/25 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full text-white text-sm font-bold py-3 rounded-xl" style={{ background: "linear-gradient(90deg,#c2410c,#ea580c,#c2410c)", boxShadow: "0 0 25px rgba(234,88,12,0.5)" }}>🔥 IGNITE</button>
      </div>
    </div>
  </div>
);

// 22 – ICE / ARCTIC (opposite of fire)
const V22 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#001220,#000a18)" }}>
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(100,200,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(100,200,255,0.2) 0%, transparent 50%)" }} />
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl relative z-10" style={{ background: "rgba(0,20,40,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(100,200,255,0.3)", boxShadow: "0 0 40px rgba(100,200,255,0.1)" }}>
      <div className="px-8 pt-8 pb-6 text-center border-b border-sky-400/15">
        <img src={TROPHY_IMG} alt="" className="w-16 mx-auto mb-5 drop-shadow-[0_0_15px_rgba(100,200,255,0.6)]" style={{ filter: "drop-shadow(0 0 15px rgba(100,200,255,0.6)) hue-rotate(200deg) brightness(1.2)" }} />
        <h2 className="text-sky-300 text-xl font-bold tracking-wide">World Cup 2026</h2>
        <p className="text-sky-400/50 text-sm mt-1">❄️ שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="rounded-xl px-4 py-3 text-center text-sky-300 text-sm" style={{ background: "rgba(100,200,255,0.06)", border: "1px solid rgba(100,200,255,0.25)" }}>{DEMO_NAME}</div>
        <p className="text-sky-400/25 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full text-white text-sm font-bold py-3 rounded-xl" style={{ background: "linear-gradient(90deg,#0284c7,#38bdf8,#0284c7)", boxShadow: "0 0 20px rgba(56,189,248,0.3)" }}>❄️ ENTER THE ICE</button>
      </div>
    </div>
  </div>
);

// 23 – SPLIT TEAMS (home vs away)
const V23 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#0a0a0a]">
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <div className="h-2 flex">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-blue-600" />
      </div>
      <div className="flex">
        <div className="flex-1 bg-red-900/60 text-center py-4">
          <div className="text-3xl">🇪🇸</div>
          <div className="text-red-300 text-xs font-bold mt-1">HOME</div>
        </div>
        <div className="flex items-center justify-center px-3">
          <div className="text-white/20 text-xs font-black">VS</div>
        </div>
        <div className="flex-1 bg-blue-900/60 text-center py-4">
          <div className="text-3xl">🇫🇷</div>
          <div className="text-blue-300 text-xs font-bold mt-1">AWAY</div>
        </div>
      </div>
      <div className="bg-[#111] px-8 py-5 border-t border-white/10 space-y-3">
        <img src={TROPHY_IMG} alt="" className="w-10 mx-auto" />
        <h2 className="text-white text-center font-bold text-base">World Cup 2026</h2>
        <div className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-center text-white text-sm">{DEMO_NAME}</div>
        <p className="text-white/25 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full bg-white text-black text-sm font-bold py-2.5 rounded-xl">בחר צד 🏟</button>
      </div>
    </div>
  </div>
);

// 24 – WORLD MAP (globe background)
const V24 = () => (
  <div className="min-h-[420px] flex items-center justify-center p-4 bg-[#05090f] relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center opacity-8">
      <div className="text-[18rem] select-none pointer-events-none grayscale" style={{ fontSize: "16rem", opacity: 0.06 }}>🌍</div>
    </div>
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl relative z-10" style={{ background: "rgba(5,9,15,0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(59,130,246,0.25)" }}>
      <div className="px-8 pt-8 pb-6 text-center border-b border-blue-500/15">
        <div className="relative w-16 h-16 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-spin" style={{ animationDuration: "8s" }} />
          <img src={TROPHY_IMG} alt="" className="absolute inset-2 object-contain" />
        </div>
        <h2 className="text-white text-xl font-semibold">World Cup 2026</h2>
        <p className="text-blue-300/50 text-sm mt-1">🌍 שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 text-center text-white text-sm">{DEMO_NAME}</div>
        <p className="text-blue-400/25 text-xs text-center">{DEMO_EMAIL}</p>
        <button className="w-full text-white text-sm font-semibold py-3 rounded-xl" style={{ background: "linear-gradient(90deg,#1d4ed8,#3b82f6,#1d4ed8)" }}>🌍 הצטרף למדינות</button>
      </div>
    </div>
  </div>
);

// 25 – ANIMATED GRADIENT BURST (festive final)
const V25 = () => {
  return (
    <div className="min-h-[420px] flex items-center justify-center p-4 relative overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0"
        animate={{ background: [
          "linear-gradient(135deg,#1a0533 0%,#0d1a33 100%)",
          "linear-gradient(135deg,#0d1a33 0%,#001a0d 100%)",
          "linear-gradient(135deg,#1a0a00 0%,#1a0033 100%)",
          "linear-gradient(135deg,#1a0533 0%,#0d1a33 100%)",
        ]}}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="w-80 rounded-2xl overflow-hidden shadow-2xl relative z-10" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)" }}>
        <motion.div
          className="h-1 w-full"
          animate={{ background: [
            "linear-gradient(90deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#ff6bcd)",
            "linear-gradient(90deg,#4d96ff,#ff6bcd,#ff6b6b,#ffd93d,#6bcb77)",
            "linear-gradient(90deg,#6bcb77,#4d96ff,#ff6bcd,#ff6b6b,#ffd93d)",
          ]}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="px-8 pt-8 pb-6 text-center border-b border-white/10">
          <motion.img
            src={TROPHY_IMG} alt=""
            className="w-16 mx-auto mb-5"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.h2
            className="text-xl font-bold"
            animate={{ background: ["linear-gradient(90deg,#ff6b6b,#ffd93d)","linear-gradient(90deg,#4d96ff,#6bcb77)","linear-gradient(90deg,#ff6bcd,#ff6b6b)"] }}
            style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            transition={{ duration: 2, repeat: Infinity }}
          >World Cup 2026</motion.h2>
          <p className="text-white/40 text-sm mt-1">שמך בטורניר</p>
        </div>
        <div className="px-8 py-6 space-y-4">
          <div className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-center text-white text-sm">{DEMO_NAME}</div>
          <p className="text-white/25 text-xs text-center">{DEMO_EMAIL}</p>
          <motion.button
            className="w-full text-white text-sm font-bold py-3 rounded-xl"
            animate={{ background: [
              "linear-gradient(90deg,#7c3aed,#db2777)",
              "linear-gradient(90deg,#059669,#0284c7)",
              "linear-gradient(90deg,#dc2626,#d97706)",
              "linear-gradient(90deg,#7c3aed,#db2777)",
            ]}}
            transition={{ duration: 3, repeat: Infinity }}
            whileTap={{ scale: 0.97 }}
          >
            ✨ התחל לשחק ✨
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  VARIANTS REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

const VARIANTS = [
  { id: 1,  name: "Dark Minimal",       description: "הסגנון הנוכחי — נקי ואפל",          tags: ["current"],       preview: <V1 /> },
  { id: 2,  name: "Stadium Night",      description: "אצטדיון לילי עם ספוטלייט ירוק",      tags: ["worldcup"],      preview: <V2 /> },
  { id: 3,  name: "Gold Trophy",        description: "זהב ואמבר סביב גביע מנצנץ",          tags: ["worldcup"],      preview: <V3 /> },
  { id: 4,  name: "Pitch Green",        description: "דשא ירוק עם קווי מגרש",              tags: ["worldcup"],      preview: <V4 /> },
  { id: 5,  name: "Neon Cyber",         description: "סייברפאנק ניאון סגול-ורוד",          tags: ["futuristic"],    preview: <V5 /> },
  { id: 6,  name: "Newspaper Extra",    description: "עיתון רטרו שחור-לבן",                tags: ["retro"],         preview: <V6 /> },
  { id: 7,  name: "Retro Scoreboard",   description: "לוח תוצאות ישן בסגנון ארקייד",       tags: ["retro","worldcup"], preview: <V7 /> },
  { id: 8,  name: "FIFA Card",          description: "כרטיס שחקן FIFA זהוב",               tags: ["worldcup","premium"], preview: <V8 /> },
  { id: 9,  name: "Glassmorphism",      description: "זכוכית מטושטשת עם גרדיאנט סגול",     tags: ["premium"],       preview: <V9 /> },
  { id: 10, name: "Flag Rain",          description: "דגלי עולם נופלים ברקע",               tags: ["worldcup","animated"], preview: <V10 /> },
  { id: 11, name: "Confetti Burst",     description: "קונפטי חגיגי צבעוני",                tags: ["festive","animated"], preview: <V11 /> },
  { id: 12, name: "Countdown Timer",    description: "טיימר ספירה לאחור לפתיחת המונדיאל",  tags: ["worldcup","interactive"], preview: <V12 /> },
  { id: 13, name: "Match Ticket",       description: "כרטיס כניסה לאצטדיון",               tags: ["worldcup","premium"], preview: <V13 /> },
  { id: 14, name: "Hologram",           description: "הולוגרם עתידני כחול-ציאן",            tags: ["futuristic"],    preview: <V14 /> },
  { id: 15, name: "TV Broadcast",       description: "שידור ספורט טלוויזיוני LIVE",         tags: ["worldcup","interactive"], preview: <V15 /> },
  { id: 16, name: "Chalkboard",         description: "לוח טקטי של מאמן",                   tags: ["worldcup"],      preview: <V16 /> },
  { id: 17, name: "Brazil Theme",       description: "ירוק-צהוב של ברזיל",                 tags: ["worldcup","country"], preview: <V17 /> },
  { id: 18, name: "VIP Lounge",         description: "יוקרה כהה עם מגע סגול",              tags: ["premium"],       preview: <V18 /> },
  { id: 19, name: "Pixel / 8-bit",      description: "סגנון משחק ארקייד רטרו",             tags: ["retro","gaming"], preview: <V19 /> },
  { id: 20, name: "Minimal White",      description: "לבן נקי בסגנון Apple",               tags: ["minimal"],       preview: <V20 /> },
  { id: 21, name: "Fire / Inferno",     description: "אלמנטים של אש ואנרגיה",              tags: ["animated","dramatic"], preview: <V21 /> },
  { id: 22, name: "Ice / Arctic",       description: "קרח ותכלת ארקטי",                    tags: ["animated"],      preview: <V22 /> },
  { id: 23, name: "Split Teams",        description: "Home vs Away — שני צבעים מחולקים",   tags: ["worldcup","interactive"], preview: <V23 /> },
  { id: 24, name: "World Map",          description: "כדור הארץ ברקע — כל המדינות",        tags: ["worldcup"],      preview: <V24 /> },
  { id: 25, name: "Rainbow Burst",      description: "גרדיאנט אנימציה חגיגי צבעוני",       tags: ["festive","animated"], preview: <V25 /> },
];

const ALL_TAGS = ["all", "worldcup", "animated", "premium", "retro", "festive", "futuristic", "minimal", "interactive", "country", "gaming", "dramatic", "current"];

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminLoginStylesDemo() {
  const [selectedId, setSelectedId]       = useState(null);
  const [fullPreviewId, setFullPreviewId] = useState(null);
  const [filter, setFilter]               = useState("all");

  const filtered = filter === "all" ? VARIANTS : VARIANTS.filter(v => v.tags.includes(filter));
  const fullVariant = VARIANTS.find(v => v.id === fullPreviewId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Login Screen Styles</h2>
          <p className="text-slate-400 text-sm mt-1">25 וריאציות שונות למסך הכניסה — לחץ להצגה מלאה</p>
        </div>
        {selectedId && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 text-amber-400 text-sm font-medium">
            ✓ נבחר: {VARIANTS.find(v => v.id === selectedId)?.name}
          </div>
        )}
      </div>

      {/* Filter tags */}
      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filter === tag
                ? "bg-amber-500 text-black"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Counter */}
      <div className="text-slate-500 text-xs">{filtered.length} סגנונות</div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filtered.map(variant => (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <PreviewCard
                variant={variant}
                isSelected={selectedId === variant.id}
                onClick={(fullScreen) => {
                  if (fullScreen) { setFullPreviewId(variant.id); }
                  else { setSelectedId(prev => prev === variant.id ? null : variant.id); }
                }}
              />
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2 px-1">
                {variant.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Full-screen preview */}
      {fullVariant && (
        <FullPreview variant={fullVariant} onClose={() => setFullPreviewId(null)} />
      )}
    </div>
  );
}
