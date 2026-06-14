import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";

// ── Shared fake match data ────────────────────────────────────────────────────
const DEMO_MATCH = { home: "Brazil", away: "Argentina", score: "2 – 1", minute: "67'" };
const DEMO_LB = [
  { name: "יוסי", pts: 48, rank: 1 },
  { name: "דימה", pts: 43, rank: 2 },
  { name: "מוטי", pts: 38, rank: 3 },
  { name: "שי",   pts: 31, rank: 4 },
];

// ── 15 Demo overlays ──────────────────────────────────────────────────────────

function Demo1_SidePanel({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[200]" onClick={onClose} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="fixed inset-y-0 right-0 w-[300px] z-[201] flex flex-col"
        style={{ background: "rgba(5,10,20,0.92)", borderLeft: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(28px)" }}>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        <div className="p-5 flex items-center justify-between">
          <span className="text-white font-bold">Live Results</span>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <DemoContent />
      </motion.div>
    </>
  );
}

function Demo2_BottomSheet({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[200]" onClick={onClose} />
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed bottom-0 left-0 right-0 z-[201] rounded-t-3xl overflow-hidden"
        style={{ background: "rgba(5,10,20,0.97)", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "80vh" }}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        <div className="p-5 flex items-center justify-between">
          <span className="text-white font-bold">Live Results</span>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}><DemoContent /></div>
      </motion.div>
    </>
  );
}

function Demo3_FullScreen({ onClose }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
      className="fixed inset-0 z-[201] flex flex-col"
      style={{ background: "linear-gradient(160deg,#050a14 0%,#0c1a2e 100%)" }}>
      <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      <div className="p-5 flex items-center justify-between border-b border-white/8">
        <span className="text-white font-bold text-lg">⚽ Live Results — FIFA World Cup 2026</span>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center"><X className="w-4 h-4 text-slate-400" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <DemoMatchCard big />
        <DemoLeaderboard />
      </div>
    </motion.div>
  );
}

function Demo4_FloatingCard({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.85, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="fixed top-1/2 left-1/2 z-[201] w-[320px] rounded-3xl overflow-hidden"
        style={{ transform: "translate(-50%,-50%)", background: "rgba(8,18,38,0.96)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        <div className="p-4 flex items-center justify-between">
          <span className="text-white font-bold text-sm">🔴 Live Now</span>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <div className="px-4 pb-4"><DemoMatchCard /></div>
      </motion.div>
    </>
  );
}

function Demo5_Scoreboard({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-[200]" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
        className="fixed top-1/2 left-1/2 z-[201] w-[340px] rounded-2xl overflow-hidden"
        style={{ transform: "translate(-50%,-50%)", background: "#0a0a0a", border: "2px solid #f5c518", fontFamily: "monospace" }}>
        <div className="bg-[#f5c518] text-black text-center py-2 font-black tracking-[0.3em] text-xs uppercase">FIFA World Cup 2026</div>
        <div className="p-6 text-center">
          <div className="grid grid-cols-3 items-center gap-2 mb-4">
            <div className="text-white font-black text-lg">{DEMO_MATCH.home}</div>
            <div>
              <div className="text-[#f5c518] text-4xl font-black tabular-nums">{DEMO_MATCH.score}</div>
              <div className="text-red-400 text-xs animate-pulse">{DEMO_MATCH.minute}</div>
            </div>
            <div className="text-white font-black text-lg">{DEMO_MATCH.away}</div>
          </div>
          <div className="border-t border-[#f5c518]/20 pt-4 space-y-1.5">
            {DEMO_LB.map(r => (
              <div key={r.name} className="flex justify-between text-xs">
                <span style={{ color: r.rank === 1 ? "#f5c518" : "#aaa" }}>{r.rank}. {r.name}</span>
                <span style={{ color: r.rank === 1 ? "#f5c518" : "#aaa" }}>{r.pts} נק׳</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="absolute top-2 right-3 text-black/50 hover:text-black text-xs font-bold">✕</button>
      </motion.div>
    </>
  );
}

function Demo6_TVOverlay({ onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[201] pointer-events-none flex flex-col justify-between">
      {/* Top bar */}
      <div className="pointer-events-auto" style={{ background: "rgba(0,0,0,0.85)", borderBottom: "2px solid #f5c518" }}>
        <div className="flex items-center gap-4 px-4 py-2">
          <span className="text-[#f5c518] font-black text-xs tracking-widest uppercase">● LIVE</span>
          <span className="text-white font-bold text-sm">{DEMO_MATCH.home} {DEMO_MATCH.score} {DEMO_MATCH.away}</span>
          <span className="text-slate-400 text-xs">{DEMO_MATCH.minute}</span>
          <div className="flex-1" />
          <button onClick={onClose} className="pointer-events-auto text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      </div>
      {/* Bottom ticker */}
      <div className="pointer-events-auto" style={{ background: "rgba(0,0,0,0.9)", borderTop: "2px solid #f5c518" }}>
        <div className="flex items-center gap-6 px-4 py-2 overflow-hidden">
          <span className="bg-[#f5c518] text-black text-[10px] font-black px-2 py-0.5 rounded flex-shrink-0">LEADERBOARD</span>
          {DEMO_LB.map(r => (
            <span key={r.name} className="text-white text-xs whitespace-nowrap">{r.rank}. <span className="text-[#f5c518] font-bold">{r.name}</span> {r.pts}p</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Demo7_Neon({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-[200]" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-1/2 left-1/2 z-[201] w-[320px] rounded-2xl overflow-hidden"
        style={{ transform: "translate(-50%,-50%)", background: "#000", border: "1px solid #0ff", boxShadow: "0 0 40px rgba(0,255,255,0.3), inset 0 0 40px rgba(0,255,255,0.05)" }}>
        <div className="p-4 border-b border-cyan-400/30">
          <div className="flex items-center justify-between">
            <span style={{ color: "#0ff", fontFamily: "monospace", fontWeight: 900, textShadow: "0 0 10px #0ff" }}>◉ LIVE DATA</span>
            <button onClick={onClose} style={{ color: "#0ff" }}><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 items-center gap-2 mb-4 text-center">
            <div style={{ color: "#f0f", fontWeight: 900, textShadow: "0 0 8px #f0f", fontSize: 13 }}>{DEMO_MATCH.home}</div>
            <div>
              <div style={{ color: "#0ff", fontSize: 28, fontWeight: 900, fontFamily: "monospace", textShadow: "0 0 15px #0ff" }}>{DEMO_MATCH.score}</div>
              <div style={{ color: "#ff0", fontSize: 10, animation: "pulse 1s infinite" }}>{DEMO_MATCH.minute}</div>
            </div>
            <div style={{ color: "#f0f", fontWeight: 900, textShadow: "0 0 8px #f0f", fontSize: 13 }}>{DEMO_MATCH.away}</div>
          </div>
          <div className="border-t border-cyan-400/20 pt-3 space-y-1.5">
            {DEMO_LB.map(r => (
              <div key={r.name} className="flex justify-between" style={{ fontFamily: "monospace", fontSize: 11, color: r.rank === 1 ? "#ff0" : "#0ff" }}>
                <span>{r.rank}_ {r.name}</span><span>{r.pts}pts</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Demo8_GlassCenter({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-[200]" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(20px)" }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
        className="fixed top-1/2 left-1/2 z-[201] w-[320px] rounded-3xl overflow-hidden"
        style={{ transform: "translate(-50%,-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(40px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-bold">Live Results</span>
            <button onClick={onClose}><X className="w-4 h-4 text-white/60" /></button>
          </div>
          <DemoMatchCard />
          <div className="mt-4 space-y-2">
            {DEMO_LB.map(r => (
              <div key={r.name} className="flex justify-between items-center rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                <span className="text-white/80 text-sm">{r.rank}. {r.name}</span>
                <span className="text-amber-300 text-sm font-bold">{r.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Demo9_ExpandingFAB({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-[200]" onClick={onClose} />
      <motion.div
        initial={{ scale: 0, borderRadius: "50%", width: 56, height: 56, bottom: 24, right: 24 }}
        animate={{ scale: 1, borderRadius: "20px", width: 300, height: "auto", bottom: 24, right: 24 }}
        exit={{ scale: 0, borderRadius: "50%", width: 56, height: 56 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="fixed z-[201] overflow-hidden"
        style={{ background: "rgba(5,10,20,0.97)", border: "1px solid rgba(16,185,129,0.4)", boxShadow: "0 10px 40px rgba(0,0,0,0.6)", transformOrigin: "bottom right" }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white font-bold text-sm">Live Now</span>
            </div>
            <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <DemoMatchCard />
        </div>
      </motion.div>
    </>
  );
}

function Demo10_Newspaper({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-[200]" onClick={onClose} />
      <motion.div initial={{ opacity: 0, rotateX: -15, y: -30 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} exit={{ opacity: 0, y: -30 }}
        className="fixed top-1/2 left-1/2 z-[201] w-[340px] rounded-lg overflow-hidden"
        style={{ transform: "translate(-50%,-50%)", background: "#f5f0e8", perspective: 600 }}>
        <div className="text-center border-b-2 border-black py-2 px-4">
          <div className="text-[10px] font-bold tracking-[0.3em] text-black/50 uppercase">The Daily</div>
          <div className="text-xl font-black text-black tracking-tight uppercase" style={{ fontFamily: "Georgia, serif" }}>WORLD CUP GAZETTE</div>
          <div className="text-[10px] text-black/40">{new Date().toLocaleDateString('he-IL')} · FIFA 2026</div>
        </div>
        <div className="p-4">
          <div className="text-center border-b border-black/20 pb-3 mb-3">
            <div className="text-xs uppercase font-bold text-black/50 mb-1">Live Score</div>
            <div className="text-2xl font-black text-black" style={{ fontFamily: "Georgia, serif" }}>{DEMO_MATCH.home} {DEMO_MATCH.score} {DEMO_MATCH.away}</div>
            <div className="text-xs text-red-700 font-bold">{DEMO_MATCH.minute}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase text-black/40 border-b border-black/20 mb-1">Standings</div>
              {DEMO_LB.map(r => (
                <div key={r.name} className="text-xs text-black flex justify-between py-0.5 border-b border-black/10">
                  <span>{r.rank}. {r.name}</span><span className="font-bold">{r.pts}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(0,0,0,0.06) 18px, rgba(0,0,0,0.06) 19px)" }}>
              <div className="text-[10px] font-bold uppercase text-black/40 border-b border-black/20 mb-1">Analysis</div>
              <p className="text-[10px] text-black/70 leading-relaxed">Brazil dominate possession in a thrilling Group Stage clash with Argentina...</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-2 right-3 text-black/40 hover:text-black text-xs font-bold">✕</button>
      </motion.div>
    </>
  );
}

function Demo11_Hologram({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-[200]" style={{ background: "rgba(0,5,15,0.9)" }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-1/2 left-1/2 z-[201] w-[300px]"
        style={{ transform: "translate(-50%,-50%)", border: "1px solid rgba(100,200,255,0.4)", background: "rgba(0,20,50,0.7)", backdropFilter: "blur(20px)", boxShadow: "0 0 60px rgba(50,150,255,0.2), inset 0 0 60px rgba(50,150,255,0.05)", borderRadius: 4 }}>
        {/* scan lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(100,200,255,0.03) 3px, rgba(100,200,255,0.03) 4px)", borderRadius: 4 }} />
        <div className="p-5 relative">
          <div className="flex items-center justify-between mb-4">
            <span style={{ color: "#4af", fontFamily: "monospace", fontWeight: 700, fontSize: 11, letterSpacing: "0.2em" }}>◈ LIVE FEED</span>
            <button onClick={onClose} style={{ color: "#4af" }}><X className="w-3.5 h-3.5" /></button>
          </div>
          <div className="text-center mb-4 py-3" style={{ border: "1px solid rgba(100,200,255,0.2)", borderRadius: 4 }}>
            <div style={{ color: "#4af", fontSize: 10, letterSpacing: "0.2em" }} className="mb-1">MATCH IN PROGRESS</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, fontFamily: "monospace" }}>{DEMO_MATCH.home} {DEMO_MATCH.score} {DEMO_MATCH.away}</div>
            <div style={{ color: "#4af", fontSize: 10 }} className="animate-pulse mt-1">{DEMO_MATCH.minute}</div>
          </div>
          {DEMO_LB.map(r => (
            <div key={r.name} className="flex justify-between py-1 border-b" style={{ borderColor: "rgba(100,200,255,0.1)", fontFamily: "monospace", fontSize: 11, color: r.rank === 1 ? "#ff4" : "#4af" }}>
              <span>[{String(r.rank).padStart(2,"0")}] {r.name}</span><span>{r.pts}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function Demo12_SlideFromTop({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[200]" onClick={onClose} />
      <motion.div initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed top-0 left-0 right-0 z-[201] rounded-b-3xl overflow-hidden"
        style={{ background: "rgba(5,10,20,0.97)", border: "1px solid rgba(255,255,255,0.1)", borderTop: "none", maxHeight: "80vh" }}>
        <div className="p-5 flex items-center justify-between border-b border-white/8">
          <span className="text-white font-bold">🔴 Live Results</span>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto p-4" style={{ maxHeight: "60vh" }}><DemoContent /></div>
        <div className="flex justify-center pb-3">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
      </motion.div>
    </>
  );
}

function Demo13_LeftPanel({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[200]" onClick={onClose} />
      <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="fixed inset-y-0 left-0 w-[300px] z-[201] flex flex-col"
        style={{ background: "rgba(5,10,20,0.92)", borderRight: "1px solid rgba(245,197,24,0.25)", backdropFilter: "blur(28px)" }}>
        <div className="h-px bg-gradient-to-r from-amber-400/60 via-transparent to-transparent" />
        <div className="p-5 flex items-center justify-between">
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
          <span className="text-white font-bold">Live Results</span>
        </div>
        <DemoContent rtl />
      </motion.div>
    </>
  );
}

function Demo14_CardStack({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-[200]" style={{ backdropFilter: "blur(8px)" }} onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 z-[201]" style={{ transform: "translate(-50%,-50%)" }}>
        {/* stacked background cards */}
        <div className="absolute" style={{ width: 300, height: 200, background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 20, transform: "rotate(-6deg) translateY(12px)", top: 0, left: 0 }} />
        <div className="absolute" style={{ width: 300, height: 200, background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.15)", borderRadius: 20, transform: "rotate(-3deg) translateY(6px)", top: 0, left: 0 }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="relative rounded-2xl overflow-hidden"
          style={{ width: 300, background: "rgba(8,18,38,0.98)", border: "1px solid rgba(245,197,24,0.3)", boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          <div className="p-4 flex items-center justify-between">
            <span className="text-white font-bold text-sm">Live Results</span>
            <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <div className="px-4 pb-4"><DemoMatchCard /><DemoLeaderboard compact /></div>
        </motion.div>
      </div>
    </>
  );
}

function Demo15_SplitScreen({ onClose }) {
  return (
    <motion.div className="fixed inset-0 z-[201] flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Left: dimmed main content placeholder */}
      <motion.div initial={{ flex: 1 }} animate={{ flex: 1 }}
        className="flex-1 flex items-center justify-center relative"
        style={{ background: "rgba(3,13,26,0.85)", backdropFilter: "blur(4px)" }}>
        <div className="text-white/20 text-center">
          <div className="text-4xl mb-2">⚽</div>
          <div className="text-sm">Main App</div>
        </div>
        <button onClick={onClose} className="absolute top-4 left-4 text-white/40 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </motion.div>
      {/* Right: live panel */}
      <motion.div initial={{ width: 0 }} animate={{ width: 320 }} exit={{ width: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="flex-shrink-0 overflow-hidden"
        style={{ background: "rgba(5,10,20,0.99)", borderLeft: "1px solid rgba(245,197,24,0.2)" }}>
        <div style={{ width: 320 }} className="h-full flex flex-col">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          <div className="p-4 flex items-center justify-between border-b border-white/8">
            <span className="text-white font-bold text-sm">Live Results</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4"><DemoContent /></div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function DemoMatchCard({ big }) {
  return (
    <div className="rounded-2xl p-3 mb-3" style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,13,26,0.9))", border: "1px solid rgba(16,185,129,0.25)" }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Live · {DEMO_MATCH.minute}</span>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <span className={`text-white font-bold ${big ? "text-base" : "text-xs"}`}>{DEMO_MATCH.home}</span>
        <span className={`font-black text-emerald-400 tabular-nums ${big ? "text-3xl" : "text-xl"}`}>{DEMO_MATCH.score}</span>
        <span className={`text-white font-bold ${big ? "text-base" : "text-xs"}`}>{DEMO_MATCH.away}</span>
      </div>
    </div>
  );
}

function DemoLeaderboard({ compact }) {
  return (
    <div className="space-y-1.5">
      {DEMO_LB.map(r => (
        <div key={r.name} className={`flex justify-between items-center rounded-lg ${compact ? "px-2 py-1" : "px-3 py-2"}`}
          style={{ background: r.rank === 1 ? "rgba(245,197,24,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${r.rank === 1 ? "rgba(245,197,24,0.3)" : "rgba(255,255,255,0.06)"}` }}>
          <span className={`font-semibold ${compact ? "text-[11px]" : "text-xs"}`} style={{ color: r.rank === 1 ? "#f5c518" : "rgba(255,255,255,0.7)" }}>{r.rank}. {r.name}</span>
          <span className={`font-bold tabular-nums ${compact ? "text-[11px]" : "text-xs"}`} style={{ color: r.rank === 1 ? "#f5c518" : "#34d399" }}>{r.pts}</span>
        </div>
      ))}
    </div>
  );
}

function DemoContent({ rtl }) {
  return (
    <div className={`p-4 ${rtl ? "text-right" : ""}`}>
      <DemoMatchCard />
      <DemoLeaderboard />
    </div>
  );
}

// ── Mini thumbnail previews ───────────────────────────────────────────────────

const DESIGNS = [
  {
    id: 1, title: "Side Panel (נוכחי)", tag: "Classic",
    thumb: <div className="w-full h-full flex justify-end"><div className="w-1/2 h-full bg-slate-800/80 border-l border-amber-400/40 rounded-l-lg" /></div>,
    Component: Demo1_SidePanel,
  },
  {
    id: 2, title: "Bottom Sheet", tag: "Mobile",
    thumb: <div className="w-full h-full flex items-end"><div className="w-full h-2/3 bg-slate-800/80 rounded-t-2xl border-t border-white/20" /></div>,
    Component: Demo2_BottomSheet,
  },
  {
    id: 3, title: "Full Screen", tag: "Immersive",
    thumb: <div className="w-full h-full bg-slate-800/80 rounded-lg border border-white/10 flex flex-col p-1 gap-1"><div className="h-3 bg-white/10 rounded" /><div className="flex-1 grid grid-cols-2 gap-1"><div className="bg-emerald-900/40 rounded" /><div className="bg-amber-900/20 rounded" /></div></div>,
    Component: Demo3_FullScreen,
  },
  {
    id: 4, title: "Floating Card", tag: "Minimal",
    thumb: <div className="w-full h-full flex items-center justify-center"><div className="w-3/4 h-3/4 bg-slate-800/80 rounded-2xl border border-white/15 shadow-xl" /></div>,
    Component: Demo4_FloatingCard,
  },
  {
    id: 5, title: "Scoreboard", tag: "Retro",
    thumb: <div className="w-full h-full flex items-center justify-center"><div className="w-4/5 h-3/4 bg-black rounded-lg border-2 border-amber-400 flex flex-col overflow-hidden"><div className="bg-amber-400 h-3 flex-shrink-0" /><div className="flex-1 flex items-center justify-center"><span style={{ color: "#f5c518", fontFamily: "monospace", fontSize: 9, fontWeight: 900 }}>2 – 1</span></div></div></div>,
    Component: Demo5_Scoreboard,
  },
  {
    id: 6, title: "TV Broadcast Bar", tag: "Sports TV",
    thumb: <div className="w-full h-full flex flex-col justify-between"><div className="h-4 bg-black/90 border-b-2 border-amber-400 flex items-center px-1 gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /><div className="flex-1 h-1.5 bg-white/20 rounded" /></div><div className="flex-1" /><div className="h-4 bg-black/90 border-t-2 border-amber-400 flex items-center px-1"><div className="flex-1 h-1.5 bg-white/10 rounded" /></div></div>,
    Component: Demo6_TVOverlay,
  },
  {
    id: 7, title: "Neon Cyberpunk", tag: "Futuristic",
    thumb: <div className="w-full h-full flex items-center justify-center"><div className="w-4/5 h-3/4 bg-black rounded-lg border border-cyan-400/60 flex items-center justify-center" style={{ boxShadow: "0 0 15px rgba(0,255,255,0.3)" }}><span style={{ color: "#0ff", fontFamily: "monospace", fontSize: 9, fontWeight: 900 }}>2 – 1</span></div></div>,
    Component: Demo7_Neon,
  },
  {
    id: 8, title: "Frosted Glass", tag: "Modern",
    thumb: <div className="w-full h-full relative"><div className="absolute inset-0 rounded-lg" style={{ background: "linear-gradient(135deg,rgba(100,200,255,0.1),rgba(200,100,255,0.1))" }} /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/4 rounded-2xl border border-white/25" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }} /></div>,
    Component: Demo8_GlassCenter,
  },
  {
    id: 9, title: "Expanding FAB", tag: "Playful",
    thumb: <div className="w-full h-full relative"><div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center"><span className="text-[8px]">▶</span></div><div className="absolute bottom-2 right-2 w-16 h-10 rounded-xl bg-slate-800/80 border border-white/15" style={{ opacity: 0.5 }} /></div>,
    Component: Demo9_ExpandingFAB,
  },
  {
    id: 10, title: "Newspaper", tag: "Classic Print",
    thumb: <div className="w-full h-full flex items-center justify-center"><div className="w-4/5 h-3/4 rounded bg-[#f5f0e8] border border-black/20 flex flex-col overflow-hidden"><div className="h-3 bg-black/10 border-b border-black/20 flex items-center justify-center"><span style={{ fontSize: 5, color: "#000", fontWeight: 900, fontFamily: "Georgia" }}>WORLD CUP GAZETTE</span></div><div className="flex-1 grid grid-cols-2 gap-0.5 p-0.5"><div className="bg-black/5" /><div className="bg-black/5" /></div></div></div>,
    Component: Demo10_Newspaper,
  },
  {
    id: 11, title: "Hologram", tag: "Sci-Fi",
    thumb: <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(0,5,15,0.8)", borderRadius: 8 }}><div className="w-4/5 h-3/4 border border-blue-400/40 rounded flex items-center justify-center" style={{ background: "rgba(0,20,50,0.7)", boxShadow: "0 0 20px rgba(50,150,255,0.2)" }}><span style={{ color: "#4af", fontFamily: "monospace", fontSize: 7 }}>◈ LIVE</span></div></div>,
    Component: Demo11_Hologram,
  },
  {
    id: 12, title: "Slide from Top", tag: "Alternative",
    thumb: <div className="w-full h-full flex flex-col justify-start"><div className="w-full h-2/3 bg-slate-800/80 rounded-b-2xl border-b border-white/20 flex flex-col p-1"><div className="h-2 bg-white/10 rounded mb-1" /><div className="flex-1 bg-emerald-900/20 rounded" /></div></div>,
    Component: Demo12_SlideFromTop,
  },
  {
    id: 13, title: "Left Panel (RTL)", tag: "RTL",
    thumb: <div className="w-full h-full flex justify-start"><div className="w-1/2 h-full bg-slate-800/80 border-r border-amber-400/40 rounded-r-lg" /></div>,
    Component: Demo13_LeftPanel,
  },
  {
    id: 14, title: "Card Stack", tag: "Depth",
    thumb: <div className="w-full h-full flex items-center justify-center relative"><div className="absolute w-16 h-10 bg-amber-900/20 border border-amber-400/20 rounded-xl" style={{ transform: "rotate(-6deg) translate(4px,6px)" }} /><div className="absolute w-16 h-10 bg-amber-900/15 border border-amber-400/15 rounded-xl" style={{ transform: "rotate(-3deg) translate(2px,3px)" }} /><div className="relative w-16 h-10 bg-slate-800/90 border border-amber-400/30 rounded-xl" /></div>,
    Component: Demo14_CardStack,
  },
  {
    id: 15, title: "Split Screen", tag: "Spatial",
    thumb: <div className="w-full h-full flex rounded-lg overflow-hidden"><div className="flex-1 bg-slate-900/50 flex items-center justify-center"><span style={{ fontSize: 10 }}>⚽</span></div><div className="w-1/2 bg-slate-800/80 border-l border-amber-400/30" /></div>,
    Component: Demo15_SplitScreen,
  },
];

// ── Tag color ─────────────────────────────────────────────────────────────────
const TAG_COLORS = {
  Classic: "bg-slate-700 text-slate-300",
  Mobile: "bg-blue-900/60 text-blue-300",
  Immersive: "bg-purple-900/60 text-purple-300",
  Minimal: "bg-teal-900/60 text-teal-300",
  Retro: "bg-amber-900/60 text-amber-300",
  "Sports TV": "bg-red-900/60 text-red-300",
  Futuristic: "bg-cyan-900/60 text-cyan-300",
  Modern: "bg-indigo-900/60 text-indigo-300",
  Playful: "bg-emerald-900/60 text-emerald-300",
  "Classic Print": "bg-yellow-900/60 text-yellow-300",
  "Sci-Fi": "bg-blue-900/60 text-blue-400",
  Alternative: "bg-violet-900/60 text-violet-300",
  RTL: "bg-orange-900/60 text-orange-300",
  Depth: "bg-pink-900/60 text-pink-300",
  Spatial: "bg-lime-900/60 text-lime-300",
};

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminLivePanelDesigns() {
  const [activeDemo, setActiveDemo] = useState(null);

  const ActiveComponent = activeDemo != null ? DESIGNS.find(d => d.id === activeDemo)?.Component : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Live Panel — Design Demos</h2>
        <p className="text-slate-400 text-sm">לחץ "נסה" כדי לראות כל עיצוב בגרסה מלאה ואינטראקטיבית</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {DESIGNS.map(design => (
          <div key={design.id}
            className="rounded-2xl overflow-hidden border border-white/8 flex flex-col"
            style={{ background: "rgba(15,25,45,0.7)" }}>
            {/* Thumbnail */}
            <div className="h-28 p-2 relative" style={{ background: "rgba(5,10,20,0.8)" }}>
              {design.thumb}
              <span className="absolute top-2 left-2 text-[10px] font-black text-white/30 tabular-nums">#{design.id}</span>
            </div>
            {/* Info */}
            <div className="p-3 flex flex-col gap-2 flex-1">
              <div>
                <p className="text-white text-xs font-semibold leading-tight">{design.title}</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${TAG_COLORS[design.tag] || "bg-slate-700 text-slate-300"}`}>{design.tag}</span>
              </div>
              <button
                onClick={() => setActiveDemo(design.id)}
                className="mt-auto w-full py-1.5 rounded-xl text-xs font-bold text-black transition-all hover:brightness-110 flex items-center justify-center gap-1"
                style={{ background: "linear-gradient(135deg,#f5c518,#fde68a)" }}>
                <Zap className="w-3 h-3" /> נסה
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active demo portal */}
      <AnimatePresence>
        {ActiveComponent && (
          <ActiveComponent onClose={() => setActiveDemo(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
