import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Check } from "lucide-react";

const TROPHY = "/trophy.png";
const NAME   = "משה";
const EMAIL  = "playerclancy3@gmail.com";

// ─── countdown helper ────────────────────────────────────────────────────────
function useCountdown(iso) {
  const [t, setT] = useState(() => Math.max(0, new Date(iso) - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setT(Math.max(0, new Date(iso) - Date.now())), 1000);
    return () => clearInterval(id);
  }, [iso]);
  return {
    d: Math.floor(t / 86400000),
    h: Math.floor((t % 86400000) / 3600000),
    m: Math.floor((t % 3600000) / 60000),
    s: Math.floor((t % 60000) / 1000),
  };
}

// ─── shared sub-atoms ────────────────────────────────────────────────────────
const Field = ({ value = NAME, style = {} }) => (
  <div className="w-full rounded-xl px-4 py-3 text-sm text-center text-white/70" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", ...style }}>
    {value}
  </div>
);
const Sub = ({ children }) => (
  <p className="text-white/25 text-[11px] text-center">{children}</p>
);

// ─── Shell: standard card wrapper ────────────────────────────────────────────
const Card = ({ children, bg = "rgba(255,255,255,0.06)", border = "rgba(255,255,255,0.1)", shadow, radius = "1rem" }) => (
  <div style={{ background: bg, border: `1px solid ${border}`, backdropFilter: "blur(24px) saturate(1.6)", WebkitBackdropFilter: "blur(24px) saturate(1.6)", borderRadius: radius, boxShadow: shadow, overflow: "hidden", width: "100%", maxWidth: 340 }}>
    {children}
  </div>
);

const Wrap = ({ bg, children, style = {} }) => (
  <div className="min-h-[430px] flex items-center justify-center p-6" style={{ background: bg, ...style }}>
    {children}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
//  25 VARIANTS
// ════════════════════════════════════════════════════════════════════════════════

// 1 ─ OBSIDIAN GLASS
// Deep charcoal + pure glassmorphism, single thin border, no gimmicks
const V1 = () => (
  <Wrap bg="linear-gradient(160deg,#0e0e12 0%,#131318 100%)">
    <Card border="rgba(255,255,255,0.08)" shadow="0 32px 64px rgba(0,0,0,0.7)">
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6 opacity-90" />
        <h2 className="text-white text-[18px] font-semibold tracking-tight">World Cup 2026</h2>
        <p className="text-white/35 text-[12px] mt-1.5 tracking-wide">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-black bg-white hover:bg-white/90 transition-colors">התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 2 ─ DEEP NAVY GLASS
// Navy with blue-tinted frosted panel
const V2 = () => (
  <Wrap bg="linear-gradient(150deg,#050d1a 0%,#0a1628 60%,#060e1c 100%)">
    <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(30,90,200,0.15) 0%, transparent 60%)" }} />
    <Card bg="rgba(10,30,80,0.45)" border="rgba(80,130,255,0.15)" shadow="0 24px 60px rgba(0,10,40,0.8), inset 0 1px 0 rgba(255,255,255,0.06)">
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(80,130,255,0.1)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" style={{ filter: "drop-shadow(0 0 12px rgba(80,130,255,0.35))" }} />
        <h2 className="text-white text-[18px] font-semibold tracking-tight">World Cup 2026</h2>
        <p className="text-blue-300/40 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field style={{ border: "1px solid rgba(80,130,255,0.15)", background: "rgba(20,60,160,0.15)" }} />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-colors" style={{ background: "rgba(60,120,255,0.8)", border: "1px solid rgba(100,160,255,0.3)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 3 ─ SLATE COMMAND
// Slate grey, clean, military-precise
const V3 = () => (
  <Wrap bg="linear-gradient(160deg,#0f1117 0%,#171b24 100%)">
    <Card bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.07)" shadow="0 24px 48px rgba(0,0,0,0.6)">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }} />
      <div className="px-8 pt-8 pb-6 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-px flex-1 bg-white/10" />
          <img src={TROPHY} alt="" className="w-11 opacity-85" />
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <h2 className="text-white/90 text-[17px] font-semibold tracking-[0.04em]">World Cup 2026</h2>
        <p className="text-white/30 text-[11px] mt-1.5 tracking-[0.12em] uppercase">Tournament Login</p>
      </div>
      <div className="px-8 py-6 space-y-3">
        <Field />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-lg text-[13px] font-medium text-white/90 transition-all" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>Enter</button>
      </div>
    </Card>
  </Wrap>
);

// 4 ─ CARBON TECH
// Ultra-dark with carbon-grid background, sharp lines
const V4 = () => (
  <Wrap bg="#080808" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "32px 32px" }}>
    <Card bg="rgba(20,20,20,0.92)" border="rgba(255,255,255,0.06)" shadow="0 32px 64px rgba(0,0,0,0.9)" radius="0.875rem">
      <div className="px-8 pt-8 pb-6 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <img src={TROPHY} alt="" className="w-12 mx-auto mb-5 grayscale opacity-70" />
        <h2 className="text-white/85 text-[17px] font-bold tracking-wider uppercase">World Cup 2026</h2>
        <p className="text-white/25 text-[10px] mt-2 tracking-[0.2em] uppercase">שמך בטורניר</p>
      </div>
      <div className="px-8 py-6 space-y-3">
        <Field style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: "0.5rem" }} />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 text-[12px] font-bold text-white tracking-widest uppercase transition-colors" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "0.5rem" }}>
          Enter →
        </button>
      </div>
    </Card>
  </Wrap>
);

// 5 ─ FROSTED EMERALD
// Dark pitch backdrop, emerald-tinted glass card
const V5 = () => (
  <Wrap bg="linear-gradient(160deg,#020f06 0%,#041208 100%)">
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 60% at 50% 100%,rgba(16,120,60,0.12) 0%,transparent 70%)" }} />
    <Card bg="rgba(10,40,20,0.5)" border="rgba(40,180,80,0.12)" shadow="0 24px 56px rgba(0,0,0,0.8)">
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(40,180,80,0.08)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" style={{ filter: "drop-shadow(0 0 10px rgba(40,180,80,0.3))" }} />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-emerald-400/40 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field style={{ border: "1px solid rgba(40,180,80,0.12)", background: "rgba(20,80,40,0.2)" }} />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-emerald-900 transition-colors" style={{ background: "rgba(52,211,153,0.9)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 6 ─ BIOMETRIC SCAN
// Scan-line animation, thin teal ring around trophy, tech UX
const V6 = () => {
  const [scanY, setScanY] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setScanY(p => (p + 2) % 100), 20);
    return () => clearInterval(id);
  }, []);
  return (
    <Wrap bg="linear-gradient(160deg,#030a08 0%,#051410 100%)">
      <Card bg="rgba(5,20,15,0.7)" border="rgba(0,200,120,0.15)" shadow="0 24px 56px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,200,120,0.05)">
        <div className="px-8 pt-9 pb-7 text-center relative overflow-hidden" style={{ borderBottom: "1px solid rgba(0,200,120,0.08)" }}>
          {/* scan line */}
          <div className="absolute inset-x-0 h-px opacity-40 pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(0,200,120,0.8),transparent)", top: `${scanY}%`, transition: "top 0.02s linear" }} />
          <div className="relative w-14 h-14 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full animate-spin" style={{ border: "1px solid rgba(0,200,120,0.25)", animationDuration: "6s" }} />
            <div className="absolute inset-1.5 rounded-full" style={{ border: "1px solid rgba(0,200,120,0.1)" }} />
            <img src={TROPHY} alt="" className="absolute inset-2 object-contain" style={{ filter: "drop-shadow(0 0 6px rgba(0,200,120,0.5))" }} />
          </div>
          <h2 className="text-white text-[17px] font-semibold">World Cup 2026</h2>
          <p className="text-emerald-400/40 text-[11px] mt-1.5 tracking-[0.15em] uppercase">Identity Verification</p>
        </div>
        <div className="px-8 py-7 space-y-3.5">
          <Field style={{ border: "1px solid rgba(0,200,120,0.12)", color: "rgba(0,200,120,0.8)", fontFamily: "monospace", letterSpacing: "0.08em" }} />
          <Sub>{EMAIL}</Sub>
          <button className="w-full py-3 rounded-xl text-[12px] font-bold tracking-widest uppercase transition-colors" style={{ background: "rgba(0,200,120,0.12)", border: "1px solid rgba(0,200,120,0.25)", color: "rgba(0,200,120,0.9)" }}>Authenticate</button>
        </div>
      </Card>
    </Wrap>
  );
};

// 7 ─ SPORTS HUD
// Heads-up display corners, dark, minimal
const V7 = () => {
  const corner = "absolute w-4 h-4";
  const borderStyle = "2px solid rgba(255,255,255,0.3)";
  return (
    <Wrap bg="linear-gradient(160deg,#080c10 0%,#0c1018 100%)">
      <Card bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.07)" shadow="0 24px 48px rgba(0,0,0,0.7)" radius="0.5rem">
        <div className="px-8 pt-9 pb-7 text-center relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {/* HUD corners */}
          <div className={corner} style={{ top:8, left:8, borderTop:borderStyle, borderLeft:borderStyle }} />
          <div className={corner} style={{ top:8, right:8, borderTop:borderStyle, borderRight:borderStyle }} />
          <div className={corner} style={{ bottom:0, left:8, borderBottom:borderStyle, borderLeft:borderStyle }} />
          <div className={corner} style={{ bottom:0, right:8, borderBottom:borderStyle, borderRight:borderStyle }} />
          <img src={TROPHY} alt="" className="w-12 mx-auto mb-5 opacity-90" />
          <h2 className="text-white text-[17px] font-bold tracking-wider">WORLD CUP 2026</h2>
          <p className="text-white/30 text-[10px] mt-1.5 tracking-[0.2em] uppercase">Player Registration</p>
        </div>
        <div className="px-8 py-6 space-y-3">
          <Field style={{ borderRadius: "0.375rem", fontFamily: "monospace" }} />
          <Sub>{EMAIL}</Sub>
          <button className="w-full py-2.5 text-[12px] font-bold tracking-widest text-white uppercase transition-all" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.375rem" }}>[ ENTER ]</button>
        </div>
      </Card>
    </Wrap>
  );
};

// 8 ─ MIDNIGHT PITCH
// Subtle pitch circle in background, premium dark glass
const V8 = () => (
  <Wrap bg="#070a0a">
    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.04, pointerEvents:"none" }}>
      <div style={{ width:320, height:320, borderRadius:"50%", border:"2px solid white" }} />
    </div>
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 50% 60%,rgba(20,60,40,0.12) 0%,transparent 60%)" }} />
    <Card bg="rgba(255,255,255,0.05)" border="rgba(255,255,255,0.08)" shadow="0 32px 64px rgba(0,0,0,0.85)">
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6 opacity-85" />
        <h2 className="text-white/90 text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-white/30 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white/90 transition-all" style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.1)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 9 ─ FROSTED STEEL BLUE
// Steel-blue glassmorphism, premium feel, slight shimmer top
const V9 = () => (
  <Wrap bg="linear-gradient(150deg,#07101f 0%,#0c1a2e 100%)">
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 40% at 50% 0%,rgba(56,100,200,0.08) 0%,transparent 60%)" }} />
    <Card bg="rgba(255,255,255,0.06)" border="rgba(100,160,255,0.12)" shadow="0 24px 56px rgba(0,10,40,0.8), inset 0 1px 0 rgba(255,255,255,0.07)">
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(120,180,255,0.4),transparent)" }} />
      <div className="px-8 pt-8 pb-7 text-center" style={{ borderBottom: "1px solid rgba(100,160,255,0.07)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-blue-300/40 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field style={{ background: "rgba(60,100,200,0.08)", border: "1px solid rgba(100,160,255,0.1)" }} />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all" style={{ background: "rgba(60,120,255,0.6)", border: "1px solid rgba(100,160,255,0.25)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 10 ─ DARK MATTER
// Almost pure black, very faint purple aurora, ultra-minimal
const V10 = () => (
  <Wrap bg="#050508">
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 40% at 50% 30%,rgba(80,40,160,0.07) 0%,transparent 70%)" }} />
    <Card bg="rgba(255,255,255,0.035)" border="rgba(255,255,255,0.06)" shadow="0 40px 80px rgba(0,0,0,0.9)">
      <div className="px-8 pt-10 pb-8 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <img src={TROPHY} alt="" className="w-12 mx-auto mb-7 opacity-75" />
        <h2 className="text-white/80 text-[17px] font-light tracking-[0.06em]">World Cup 2026</h2>
        <p className="text-white/20 text-[11px] mt-2 tracking-[0.15em]">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3">
        <Field style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-light text-white/70 transition-all" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>התחל</button>
      </div>
    </Card>
  </Wrap>
);

// 11 ─ COUNTDOWN — GLASS
// Live countdown on glass card, clean and purposeful
const V11 = () => {
  const { d, h, m, s } = useCountdown("2026-06-11T16:00:00Z");
  const pad = n => String(n).padStart(2, "0");
  return (
    <Wrap bg="linear-gradient(160deg,#080c14 0%,#0e1420 100%)">
      <Card bg="rgba(255,255,255,0.05)" border="rgba(255,255,255,0.08)" shadow="0 24px 56px rgba(0,0,0,0.75)">
        <div className="px-8 pt-7 pb-5 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <img src={TROPHY} alt="" className="w-10 mx-auto mb-4 opacity-85" />
          <h2 className="text-white text-[16px] font-semibold">World Cup 2026</h2>
          <p className="text-white/30 text-[10px] mt-1 tracking-widest uppercase">Open in</p>
          <div className="flex justify-center gap-3 mt-4">
            {[{v:pad(d),l:"D"},{v:pad(h),l:"H"},{v:pad(m),l:"M"},{v:pad(s),l:"S"}].map(({v,l}) => (
              <div key={l} className="text-center" style={{ minWidth:40 }}>
                <div className="text-white font-bold text-xl font-mono" style={{ fontVariantNumeric:"tabular-nums" }}>{v}</div>
                <div className="text-white/25 text-[9px] tracking-widest mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-8 py-5 space-y-3">
          <Field />
          <Sub>{EMAIL}</Sub>
          <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white/90 transition-all" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>Register Now</button>
        </div>
      </Card>
    </Wrap>
  );
};

// 12 ─ MONO LINE
// Thin horizontal dividers, monochrome, editorial
const V12 = () => (
  <Wrap bg="#0a0a0a">
    <Card bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.07)" shadow="0 24px 48px rgba(0,0,0,0.8)" radius="0.5rem">
      <div className="px-8 pt-8 pb-0">
        <div className="text-[10px] text-white/20 tracking-[0.3em] uppercase mb-6">FIFA / WC2026</div>
        <div className="h-px w-full bg-white/8 mb-6" />
        <img src={TROPHY} alt="" className="w-10 mb-5 opacity-70" />
        <h2 className="text-white/85 text-[22px] font-semibold leading-tight tracking-tight">World Cup<br/>2026</h2>
        <div className="h-px w-full bg-white/8 mt-5 mb-5" />
      </div>
      <div className="px-8 pb-8 space-y-3">
        <Field style={{ textAlign:"left", paddingLeft:"1rem", borderRadius:"0.375rem" }} value={NAME} />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 text-[13px] font-medium text-white transition-all" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "0.375rem" }}>Continue →</button>
      </div>
    </Card>
  </Wrap>
);

// 13 ─ AURORA GLASS
// Soft aurora gradient behind a transparent card
const V13 = () => (
  <Wrap bg="#050509">
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 20% 60%,rgba(30,80,200,0.12) 0%,transparent 50%), radial-gradient(ellipse 60% 40% at 80% 30%,rgba(80,30,180,0.1) 0%,transparent 50%)", pointerEvents:"none" }} />
    <Card bg="rgba(255,255,255,0.05)" border="rgba(255,255,255,0.09)" shadow="0 32px 64px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)">
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-white/35 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all" style={{ background: "linear-gradient(135deg,rgba(60,80,200,0.7),rgba(120,60,200,0.7))", border: "1px solid rgba(120,100,255,0.25)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 14 ─ TACTICAL BOARD
// Dark green with faint pitch grid, glassmorphism card
const V14 = () => (
  <Wrap bg="#040d06" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)", backgroundSize:"28px 28px" }}>
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 50% at 50% 50%,rgba(20,100,50,0.08) 0%,transparent 70%)" }} />
    <Card bg="rgba(5,20,10,0.75)" border="rgba(50,150,80,0.12)" shadow="0 24px 56px rgba(0,0,0,0.85)">
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(50,150,80,0.08)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6 opacity-85" />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-green-400/35 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field style={{ background: "rgba(30,80,45,0.2)", border: "1px solid rgba(50,150,80,0.12)" }} />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all" style={{ background: "rgba(40,160,80,0.25)", border: "1px solid rgba(50,180,90,0.2)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 15 ─ CRIMSON EDGE
// Dark red accent — power, competition, intensity
const V15 = () => (
  <Wrap bg="linear-gradient(160deg,#0c0608 0%,#120508 100%)">
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 40% at 50% 100%,rgba(180,20,20,0.1) 0%,transparent 60%)" }} />
    <Card bg="rgba(255,255,255,0.05)" border="rgba(200,40,40,0.15)" shadow="0 24px 56px rgba(0,0,0,0.85)">
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(220,50,50,0.6),transparent)" }} />
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(200,40,40,0.08)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" style={{ filter: "drop-shadow(0 0 10px rgba(200,40,40,0.3))" }} />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-red-400/40 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field style={{ background: "rgba(180,20,20,0.08)", border: "1px solid rgba(200,40,40,0.12)" }} />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all" style={{ background: "rgba(200,40,40,0.7)", border: "1px solid rgba(220,60,60,0.3)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 16 ─ AMBIENT GLOW
// Soft white glow behind card, warm-neutral, premium brand feel
const V16 = () => (
  <Wrap bg="#060606">
    <div style={{ position:"absolute", width:320, height:320, borderRadius:"50%", background:"radial-gradient(rgba(255,255,255,0.06) 0%,transparent 70%)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }} />
    <Card bg="rgba(255,255,255,0.05)" border="rgba(255,255,255,0.09)" shadow="0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03)">
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 blur-xl bg-white/20 rounded-full" />
          <img src={TROPHY} alt="" className="relative w-14 opacity-90" />
        </div>
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-white/30 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-black transition-all bg-white hover:bg-white/90">התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 17 ─ SPLIT GLASS (left band accent)
// Left colored strip, card split into two zones
const V17 = () => (
  <Wrap bg="linear-gradient(160deg,#07090f 0%,#0c0f18 100%)">
    <Card bg="rgba(255,255,255,0.05)" border="rgba(255,255,255,0.08)" shadow="0 24px 56px rgba(0,0,0,0.8)" radius="1rem">
      <div style={{ display:"flex", height:"100%" }}>
        <div style={{ width:4, flexShrink:0, background:"linear-gradient(180deg,rgba(80,160,255,0.8) 0%,rgba(40,100,200,0.3) 100%)", borderRadius:"1rem 0 0 1rem" }} />
        <div style={{ flex:1 }}>
          <div className="px-7 pt-8 pb-6 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <img src={TROPHY} alt="" className="w-12 mx-auto mb-5" />
            <h2 className="text-white text-[17px] font-semibold">World Cup 2026</h2>
            <p className="text-white/30 text-[11px] mt-1.5">שמך בטורניר</p>
          </div>
          <div className="px-7 py-6 space-y-3">
            <Field />
            <Sub>{EMAIL}</Sub>
            <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all" style={{ background: "rgba(60,120,255,0.5)", border: "1px solid rgba(80,140,255,0.2)" }}>התחל</button>
          </div>
        </div>
      </div>
    </Card>
  </Wrap>
);

// 18 ─ NOISE GLASS
// Glassmorphism with subtle film-grain texture (SVG filter), premium
const V18 = () => (
  <Wrap bg="linear-gradient(135deg,#0a0a14 0%,#0f0f1c 100%)">
    <svg style={{ position:"absolute", width:0, height:0 }}>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    </svg>
    <div style={{ position:"absolute", inset:0, filter:"url(#grain)", opacity:0.04, mixBlendMode:"overlay" }} />
    <Card bg="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.09)" shadow="0 32px 64px rgba(0,0,0,0.85)">
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-white/35 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 19 ─ MONOCHROME PURE
// Black background, white card tones only, absolute minimal
const V19 = () => (
  <Wrap bg="#000">
    <Card bg="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.1)" shadow="0 32px 64px rgba(0,0,0,0.95)" radius="1.25rem">
      <div className="px-8 pt-10 pb-8 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-7 grayscale opacity-80" />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-white/25 text-[12px] mt-2">שמך בטורניר</p>
      </div>
      <div className="px-8 py-8 space-y-4">
        <Field />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-black bg-white hover:bg-white/90 transition-colors">התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 20 ─ DEEP SPACE
// Space-dark, tiny star dots, frosted card
const V20 = () => {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    x: (i * 137.5) % 100, y: (i * 97.3) % 100,
    size: i % 3 === 0 ? 2 : 1, opacity: 0.1 + (i % 4) * 0.06,
  }));
  return (
    <Wrap bg="#030308">
      {stars.map((s, i) => (
        <div key={i} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size, borderRadius:"50%", background:"white", opacity:s.opacity, pointerEvents:"none" }} />
      ))}
      <Card bg="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.09)" shadow="0 32px 64px rgba(0,0,0,0.9)">
        <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" />
          <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
          <p className="text-white/30 text-[12px] mt-1.5">שמך בטורניר</p>
        </div>
        <div className="px-8 py-7 space-y-3.5">
          <Field />
          <Sub>{EMAIL}</Sub>
          <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>התחל לשחק</button>
        </div>
      </Card>
    </Wrap>
  );
};

// 21 ─ LAYERED DEPTH
// Three glass pane effect — depth and dimensionality
const V21 = () => (
  <Wrap bg="linear-gradient(160deg,#080a10 0%,#0c1018 100%)">
    <div style={{ position:"relative", width:"100%", maxWidth:340 }}>
      {/* back layers */}
      <div style={{ position:"absolute", inset:0, transform:"translateY(8px) scale(0.96)", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"1rem", backdropFilter:"blur(4px)" }} />
      <div style={{ position:"absolute", inset:0, transform:"translateY(4px) scale(0.98)", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"1rem", backdropFilter:"blur(8px)" }} />
      <Card bg="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.1)" shadow="0 24px 56px rgba(0,0,0,0.8)">
        <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" />
          <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
          <p className="text-white/35 text-[12px] mt-1.5">שמך בטורניר</p>
        </div>
        <div className="px-8 py-7 space-y-3.5">
          <Field />
          <Sub>{EMAIL}</Sub>
          <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-black bg-white transition-all hover:bg-white/90">התחל לשחק</button>
        </div>
      </Card>
    </div>
  </Wrap>
);

// 22 ─ BRAND GOLD (premium sponsor feel)
// Very dark with single warm-gold accent line and hover
const V22 = () => (
  <Wrap bg="linear-gradient(160deg,#0a0800 0%,#100d00 100%)">
    <Card bg="rgba(255,255,255,0.04)" border="rgba(200,160,40,0.15)" shadow="0 24px 56px rgba(0,0,0,0.85)">
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(220,180,60,0.6),transparent)" }} />
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(200,160,40,0.07)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" style={{ filter: "drop-shadow(0 0 8px rgba(220,180,60,0.25))" }} />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-amber-400/35 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field style={{ background: "rgba(200,160,40,0.05)", border: "1px solid rgba(200,160,40,0.1)" }} />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold transition-all" style={{ background: "rgba(200,160,40,0.15)", border: "1px solid rgba(220,180,60,0.3)", color: "rgba(220,180,60,0.9)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 23 ─ AMBIENT LIGHT (bokeh soft)
// Large blurred circles like bokeh lights from a stadium
const V23 = () => (
  <Wrap bg="#04050a">
    {[
      { size:200, x:"10%",  y:"20%",  color:"rgba(60,120,255,0.06)" },
      { size:160, x:"80%",  y:"10%",  color:"rgba(100,200,100,0.05)" },
      { size:180, x:"70%",  y:"75%",  color:"rgba(80,60,200,0.06)" },
      { size:140, x:"20%",  y:"80%",  color:"rgba(60,160,255,0.04)" },
    ].map((b,i) => (
      <div key={i} style={{ position:"absolute", width:b.size, height:b.size, borderRadius:"50%", background:`radial-gradient(${b.color} 0%,transparent 70%)`, left:b.x, top:b.y, pointerEvents:"none", transform:"translate(-50%,-50%)" }} />
    ))}
    <Card bg="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.09)" shadow="0 32px 64px rgba(0,0,0,0.85)">
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-white/35 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-black bg-white transition-all hover:bg-white/90">התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 24 ─ JERSEY NUMBER (large typography background)
// Giant "26" behind the card — sports editorial feel
const V24 = () => (
  <Wrap bg="#060608">
    <div style={{ position:"absolute", fontSize:"22rem", fontWeight:900, color:"rgba(255,255,255,0.025)", lineHeight:1, userSelect:"none", pointerEvents:"none", letterSpacing:"-0.05em" }}>26</div>
    <Card bg="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.09)" shadow="0 32px 64px rgba(0,0,0,0.85)">
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-white/35 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all" style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.11)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// 25 ─ ICE GLASS (premium final)
// Cool icy whites, micro-shimmer, cleanest high-tech glass
const V25 = () => (
  <Wrap bg="linear-gradient(160deg,#060d14 0%,#0a1422 100%)">
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 100% 60% at 50% 0%,rgba(180,220,255,0.04) 0%,transparent 60%)", pointerEvents:"none" }} />
    <Card bg="rgba(200,230,255,0.06)" border="rgba(180,220,255,0.12)" shadow="0 32px 64px rgba(0,0,0,0.85), inset 0 1px 0 rgba(220,240,255,0.08)">
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(180,220,255,0.5),transparent)" }} />
      <div className="px-8 pt-9 pb-7 text-center" style={{ borderBottom: "1px solid rgba(180,220,255,0.07)" }}>
        <img src={TROPHY} alt="" className="w-14 mx-auto mb-6" style={{ filter: "drop-shadow(0 0 12px rgba(160,210,255,0.3)) brightness(1.1)" }} />
        <h2 className="text-white text-[18px] font-semibold">World Cup 2026</h2>
        <p className="text-sky-300/40 text-[12px] mt-1.5">שמך בטורניר</p>
      </div>
      <div className="px-8 py-7 space-y-3.5">
        <Field style={{ background: "rgba(160,210,255,0.05)", border: "1px solid rgba(180,220,255,0.1)" }} />
        <Sub>{EMAIL}</Sub>
        <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all" style={{ background: "rgba(160,210,255,0.15)", border: "1px solid rgba(180,220,255,0.2)" }}>התחל לשחק</button>
      </div>
    </Card>
  </Wrap>
);

// ════════════════════════════════════════════════════════════════════════════════
const VARIANTS = [
  { id:1,  name:"Obsidian Glass",   desc:"שחור עמוק + זכוכית נקייה",          tags:["glass","minimal"],         preview:<V1/> },
  { id:2,  name:"Deep Navy",        desc:"ים כהה עם גוון כחול-זכוכית",        tags:["glass","dark"],            preview:<V2/> },
  { id:3,  name:"Slate Command",    desc:"אפור-פלדה, קווי הפרדה דקים",        tags:["minimal","dark"],          preview:<V3/> },
  { id:4,  name:"Carbon Tech",      desc:"גריד פחם כהה, קווים חדים",          tags:["tech","dark"],             preview:<V4/> },
  { id:5,  name:"Frosted Emerald",  desc:"ירוק-מגרש + זכוכית מטושטשת",       tags:["glass","football"],        preview:<V5/> },
  { id:6,  name:"Biometric Scan",   desc:"טבעת סריקה, קו מעבר חי",           tags:["tech","animated"],         preview:<V6/> },
  { id:7,  name:"Sports HUD",       desc:"פינות HUD, דיוק צבאי",             tags:["tech","football"],         preview:<V7/> },
  { id:8,  name:"Midnight Pitch",   desc:"עיגול מגרש מאחורה, אפל פרמיום",    tags:["glass","football"],        preview:<V8/> },
  { id:9,  name:"Steel Blue Glass", desc:"פרמיום כחול-פלדה עם שימר",          tags:["glass","dark"],            preview:<V9/> },
  { id:10, name:"Dark Matter",      desc:"שחור-מוחלט, נגיעת סגול, יוקרה",    tags:["minimal","dark"],          preview:<V10/> },
  { id:11, name:"Countdown Glass",  desc:"טיימר לייב לפתיחת המונדיאל",        tags:["glass","animated","football"], preview:<V11/> },
  { id:12, name:"Mono Line",        desc:"מינימל אדיטוריאל, שורות דקות",      tags:["minimal","dark"],          preview:<V12/> },
  { id:13, name:"Aurora Glass",     desc:"אורורה כחול-סגול עדין ברקע",        tags:["glass","dark"],            preview:<V13/> },
  { id:14, name:"Tactical Board",   desc:"גריד מגרש ירוק, זכוכית על שחור",   tags:["glass","football"],        preview:<V14/> },
  { id:15, name:"Crimson Edge",     desc:"שחור + אקצנט אדום אינטנסיבי",       tags:["dark","football"],         preview:<V15/> },
  { id:16, name:"Ambient Glow",     desc:"הילת לבן רכה, פרמיום בראנד",        tags:["glass","minimal"],         preview:<V16/> },
  { id:17, name:"Split Glass",      desc:"סרט אקצנט שמאלי + זכוכית",          tags:["glass","tech"],            preview:<V17/> },
  { id:18, name:"Noise Glass",      desc:"זכוכית + גרין פילם יוקרתי",         tags:["glass","minimal"],         preview:<V18/> },
  { id:19, name:"Monochrome Pure",  desc:"שחור ולבן בלבד, אפל-סטייל",         tags:["minimal","dark"],          preview:<V19/> },
  { id:20, name:"Deep Space",       desc:"כוכבים עדינים, כרטיס זכוכית",       tags:["glass","dark"],            preview:<V20/> },
  { id:21, name:"Layered Depth",    desc:"3 פנלים שקופים שכובים, עומק",       tags:["glass","tech"],            preview:<V21/> },
  { id:22, name:"Brand Gold",       desc:"זהב אקצנט בודד, ספונסר פרמיום",     tags:["dark","football"],         preview:<V22/> },
  { id:23, name:"Ambient Bokeh",    desc:"עיגולי בוקה של ספוטלייטים",          tags:["glass","animated"],        preview:<V23/> },
  { id:24, name:"Jersey #26",       desc:"'26' ענקי ברקע, אדיטוריאל ספורט",  tags:["football","minimal"],      preview:<V24/> },
  { id:25, name:"Ice Glass",        desc:"זכוכית קרח — הנקי והפרמיום ביותר",  tags:["glass","minimal"],         preview:<V25/> },
];

const ALL_TAGS = ["all","glass","dark","minimal","tech","football","animated"];

// ─── Preview card ─────────────────────────────────────────────────────────────
const PreviewCard = ({ variant, isSelected, onSelect, onExpand }) => (
  <motion.div layout initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="group relative">
    <div
      onClick={onSelect}
      className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
      style={{ height:200, border: isSelected ? "1.5px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.07)", boxShadow: isSelected ? "0 0 0 1px rgba(255,255,255,0.1)" : "none" }}
    >
      {/* scaled preview */}
      <div className="absolute inset-0" style={{ transform:"scale(0.46)", transformOrigin:"top left", width:"217%", height:"217%", pointerEvents:"none" }}>
        {variant.preview}
      </div>
      {/* expand button */}
      <button
        onClick={e => { e.stopPropagation(); onExpand(); }}
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-white/70 hover:text-white"
        style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)" }}
      >
        <Maximize2 className="w-3 h-3" />
      </button>
      {isSelected && (
        <div className="absolute top-2 right-2 rounded-full p-0.5 bg-white">
          <Check className="w-2.5 h-2.5 text-black" />
        </div>
      )}
    </div>
    <div className="mt-2 px-0.5">
      <p className="text-white/80 text-[12px] font-medium leading-tight">{variant.name}</p>
      <p className="text-white/30 text-[10px] mt-0.5 leading-tight">{variant.desc}</p>
    </div>
  </motion.div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminLoginStylesDemo() {
  const [selected, setSelected]   = useState(null);
  const [expanded, setExpanded]   = useState(null);
  const [filter, setFilter]       = useState("all");

  const list = filter === "all" ? VARIANTS : VARIANTS.filter(v => v.tags.includes(filter));
  const expandedVariant = VARIANTS.find(v => v.id === expanded);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Login Screen — 25 Styles</h2>
          <p className="text-slate-500 text-sm mt-0.5">הייטקי, זכוכית, סולידי. לחץ להגדלה.</p>
        </div>
        {selected && (
          <div className="text-[12px] font-medium px-3 py-1.5 rounded-lg text-white/60" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
            ✓ {VARIANTS.find(v=>v.id===selected)?.name}
          </div>
        )}
      </div>

      {/* filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {ALL_TAGS.map(tag => (
          <button key={tag} onClick={() => setFilter(tag)}
            className="px-3 py-1 rounded-full text-[11px] font-medium transition-all"
            style={filter===tag
              ? { background:"rgba(255,255,255,0.12)", color:"white", border:"1px solid rgba(255,255,255,0.2)" }
              : { background:"transparent", color:"rgba(255,255,255,0.3)", border:"1px solid rgba(255,255,255,0.07)" }
            }
          >{tag}</button>
        ))}
      </div>

      {/* grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AnimatePresence>
          {list.map(v => (
            <PreviewCard key={v.id} variant={v}
              isSelected={selected===v.id}
              onSelect={() => setSelected(p => p===v.id ? null : v.id)}
              onExpand={() => setExpanded(v.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* full-screen overlay */}
      <AnimatePresence>
        {expandedVariant && (
          <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xl" onClick={() => setExpanded(null)} />
            <motion.div className="relative z-10 w-full max-w-md"
              initial={{ scale:0.94, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:12 }}
              transition={{ type:"spring", stiffness:400, damping:30 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-white font-semibold text-sm">{expandedVariant.name}</span>
                  <span className="text-white/35 text-xs ml-2">{expandedVariant.desc}</span>
                </div>
                <button onClick={() => setExpanded(null)} className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg" style={{ background:"rgba(255,255,255,0.05)" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border:"1px solid rgba(255,255,255,0.08)" }}>
                {expandedVariant.preview}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
