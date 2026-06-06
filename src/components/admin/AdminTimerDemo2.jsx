import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Check } from "lucide-react";

const TARGET = "2026-06-11T16:00:00Z";
function useCountdown() {
  const [t, setT] = useState(() => Math.max(0, new Date(TARGET) - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setT(Math.max(0, new Date(TARGET) - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);
  return {
    d: Math.floor(t / 86400000),
    h: Math.floor((t % 86400000) / 3600000),
    m: Math.floor((t % 3600000) / 60000),
    s: Math.floor((t % 60000) / 1000),
  };
}

const pad = n => String(n).padStart(2, "0");
const S = { d: 5, h: 0, m: 32, s: 3 };

const Bg = ({ children, style = {} }) => (
  <div className="w-full flex items-center justify-center py-8 px-6" style={{ minHeight: 120, ...style }}>
    {children}
  </div>
);

// Glass card atom
const G = ({ children, tint = "rgba(255,255,255,0.055)", border = "rgba(255,255,255,0.1)", blur = 24, shadow, radius = "1rem", style = {} }) => (
  <div style={{
    background: tint,
    border: `1px solid ${border}`,
    backdropFilter: `blur(${blur}px) saturate(1.6)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(1.6)`,
    borderRadius: radius,
    boxShadow: shadow,
    overflow: "hidden",
    ...style,
  }}>
    {children}
  </div>
);

const Unit = ({ v, l, vStyle = {}, lStyle = {} }) => (
  <div className="text-center">
    <div className="text-white font-bold text-3xl leading-none" style={vStyle}>{pad(v)}</div>
    <div className="text-white/30 text-[10px] mt-1.5" style={lStyle}>{l}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
//  GLASS VARIANTS (1–35)
// ════════════════════════════════════════════════════════════════════════════════

// 1 — Teal Inner Glow
const T1 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#030f0e,#050d0c)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(20,184,166,0.1)" border="rgba(20,184,166,0.22)"
          shadow="inset 0 1px 0 rgba(20,184,166,0.15), 0 8px 24px rgba(20,184,166,0.12)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} vStyle={{ color:"#5eead4" }} lStyle={{ color:"rgba(94,234,212,0.45)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// 2 — Sapphire Shimmer
const T2 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#020814,#03101f)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(59,130,246,0.1)" border="rgba(59,130,246,0.2)"
          shadow="inset 0 1px 0 rgba(120,180,255,0.2), 0 8px 20px rgba(30,80,200,0.15)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <div className="h-px w-full mb-2" style={{ background:"linear-gradient(90deg,transparent,rgba(120,180,255,0.4),transparent)" }} />
          <Unit v={v} l={l} vStyle={{ color:"#93c5fd" }} lStyle={{ color:"rgba(147,197,253,0.4)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// 3 — Amethyst
const T3 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#06020f,#0a0318)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(168,85,247,0.1)" border="rgba(168,85,247,0.22)"
          shadow="inset 0 0 20px rgba(168,85,247,0.08), 0 8px 24px rgba(100,30,200,0.15)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} vStyle={{ color:"#d8b4fe" }} lStyle={{ color:"rgba(216,180,254,0.4)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// 4 — Rose Gold
const T4 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#0f0508,#180a0c)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(244,114,182,0.1)" border="rgba(244,114,182,0.2)"
          shadow="inset 0 1px 0 rgba(244,114,182,0.15), 0 8px 20px rgba(180,40,80,0.12)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} vStyle={{ color:"#fbcfe8" }} lStyle={{ color:"rgba(251,207,232,0.4)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// 5 — Jade Deep
const T5 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#020d06,#030f08)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(34,197,94,0.09)" border="rgba(34,197,94,0.18)"
          shadow="inset 0 1px 0 rgba(34,197,94,0.12), 0 8px 20px rgba(20,120,50,0.12)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} vStyle={{ color:"#86efac" }} lStyle={{ color:"rgba(134,239,172,0.4)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// 6 — Ghost Glass (nearly invisible)
const T6 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#050508" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(255,255,255,0.025)" border="rgba(255,255,255,0.055)" blur={32}
          shadow="inset 0 1px 0 rgba(255,255,255,0.04)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} vStyle={{ color:"rgba(255,255,255,0.7)" }} lStyle={{ color:"rgba(255,255,255,0.2)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// 7 — Mica (Windows 11 style)
const T7 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#0c0c14,#10101a)", backgroundImage:"linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)", backgroundSize:"24px 24px" }}>
    <G tint="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.1)" blur={40}
      shadow="0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
      style={{ padding:"4px" }}>
      <div className="flex divide-x" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center px-5 py-3">
            <Unit v={v} l={l} />
          </div>
        ))}
      </div>
    </G>
  </Bg>
);

// 8 — Iridescent Border
const T8 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#040407" }}>
    <div className="flex gap-3">
      {[
        {v:d,l:"ימים",  b:"linear-gradient(135deg,#14b8a6,#3b82f6)"},
        {v:h,l:"שעות",  b:"linear-gradient(135deg,#3b82f6,#a855f7)"},
        {v:m,l:"דקות",  b:"linear-gradient(135deg,#a855f7,#f43f5e)"},
        {v:s,l:"שניות", b:"linear-gradient(135deg,#f43f5e,#14b8a6)"},
      ].map(({v,l,b}) => (
        <div key={l} style={{ padding:1.5, borderRadius:"0.875rem", background:b }}>
          <G tint="rgba(255,255,255,0.05)" border="transparent" blur={20}
            shadow="inset 0 1px 0 rgba(255,255,255,0.06)"
            style={{ padding:"11px 15px", minWidth:58, borderRadius:"calc(0.875rem - 1.5px)" }}>
            <Unit v={v} l={l} />
          </G>
        </div>
      ))}
    </div>
  </Bg>
);

// 9 — Scanlines Glass
const T9 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#060610,#08080f)" }}>
    <G tint="rgba(255,255,255,0.05)" border="rgba(255,255,255,0.08)" blur={24}
      shadow="0 16px 40px rgba(0,0,0,0.6)"
      style={{ position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)", pointerEvents:"none" }} />
      <div className="flex divide-x relative z-10" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center px-5 py-4"><Unit v={v} l={l} /></div>
        ))}
      </div>
    </G>
  </Bg>
);

// 10 — Multi-Layer Glass
const T10 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#050508" }}>
    <div style={{ position:"relative", display:"flex", gap:12 }}>
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} style={{ position:"relative", minWidth:60 }}>
          <div style={{ position:"absolute", inset:0, transform:"translateY(5px) scale(0.96)", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:"0.875rem", backdropFilter:"blur(4px)" }} />
          <div style={{ position:"absolute", inset:0, transform:"translateY(2.5px) scale(0.98)", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.055)", borderRadius:"0.875rem", backdropFilter:"blur(8px)" }} />
          <G tint="rgba(255,255,255,0.065)" border="rgba(255,255,255,0.11)" blur={24}
            shadow="0 12px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)"
            style={{ position:"relative", padding:"12px 16px" }}>
            <Unit v={v} l={l} />
          </G>
        </div>
      ))}
    </div>
  </Bg>
);

// 11 — Pill One-Piece
const T11 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#060610,#09091a)" }}>
    <G tint="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.1)" blur={28}
      shadow="0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)"
      radius="9999px">
      <div className="flex items-center divide-x" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center px-6 py-4"><Unit v={v} l={l} /></div>
        ))}
      </div>
    </G>
  </Bg>
);

// 12 — Colored Shadow Glass
const T12 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#040408" }}>
    <div className="flex gap-3">
      {[
        {v:d,l:"ימים",  t:"rgba(20,184,166,0.08)",  b:"rgba(20,184,166,0.18)",  sh:"0 12px 24px rgba(20,184,166,0.2)"},
        {v:h,l:"שעות",  t:"rgba(59,130,246,0.08)",  b:"rgba(59,130,246,0.18)",  sh:"0 12px 24px rgba(59,130,246,0.2)"},
        {v:m,l:"דקות",  t:"rgba(168,85,247,0.08)",  b:"rgba(168,85,247,0.18)",  sh:"0 12px 24px rgba(168,85,247,0.2)"},
        {v:s,l:"שניות", t:"rgba(245,158,11,0.08)",  b:"rgba(245,158,11,0.18)",  sh:"0 12px 24px rgba(245,158,11,0.2)"},
      ].map(({v,l,t,b,sh}) => (
        <G key={l} tint={t} border={b} blur={20} shadow={sh} style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} />
        </G>
      ))}
    </div>
  </Bg>
);

// 13 — Frosted Tall Pillars
const T13 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#060610,#08080f)" }}>
    <div className="flex gap-2 items-end">
      {[{v:d,l:"ימים",h:110},{v:h,l:"שעות",h:90},{v:m,l:"דקות",h:100},{v:s,l:"שניות",h:80}].map(({v,l,h:ht}) => (
        <G key={l} tint="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.09)" blur={24}
          shadow="inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 20px rgba(0,0,0,0.4)"
          radius="0.75rem"
          style={{ minWidth:56, height:ht, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", paddingBottom:12 }}>
          <div className="text-white font-bold text-2xl leading-none">{pad(v)}</div>
          <div className="text-white/30 text-[9px] mt-1.5">{l}</div>
        </G>
      ))}
    </div>
  </Bg>
);

// 14 — Top Shimmer Glass
const T14 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#07070f,#0a0a16)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.1)" blur={24}
          shadow="inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 20px rgba(0,0,0,0.5)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <div className="h-px w-full mb-2.5" style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)" }} />
          <Unit v={v} l={l} />
        </G>
      ))}
    </div>
  </Bg>
);

// 15 — Warm Cream Glass
const T15 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#0d0a07,#140e08)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(255,230,180,0.07)" border="rgba(255,220,160,0.15)" blur={24}
          shadow="inset 0 1px 0 rgba(255,220,160,0.1), 0 8px 20px rgba(0,0,0,0.4)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} vStyle={{ color:"#fde68a" }} lStyle={{ color:"rgba(253,230,138,0.35)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// 16 — Arctic Glass
const T16 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#04090f,#060c14)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(200,230,255,0.07)" border="rgba(180,220,255,0.14)" blur={28}
          shadow="inset 0 1px 0 rgba(220,240,255,0.1), 0 8px 24px rgba(0,20,60,0.4)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} vStyle={{ color:"#bae6fd" }} lStyle={{ color:"rgba(186,230,253,0.35)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// 17 — Smoked Glass
const T17 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#030303" }}>
    <G tint="rgba(255,255,255,0.08)" border="rgba(255,255,255,0.12)" blur={32}
      shadow="0 20px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)"
      style={{ padding:"4px" }}>
      <div className="flex divide-x" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center px-6 py-4"><Unit v={v} l={l} /></div>
        ))}
      </div>
    </G>
  </Bg>
);

// 18 — Bokeh Glass
const T18 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#040508", position:"relative", overflow:"hidden" }}>
    {[{s:180,x:"10%",y:"30%",c:"rgba(59,130,246,0.07)"},{s:150,x:"85%",y:"20%",c:"rgba(168,85,247,0.06)"},{s:160,x:"60%",y:"80%",c:"rgba(20,184,166,0.06)"}].map((b,i)=>(
      <div key={i} style={{ position:"absolute", width:b.s, height:b.s, borderRadius:"50%", background:`radial-gradient(${b.c} 0%,transparent 70%)`, left:b.x, top:b.y, transform:"translate(-50%,-50%)", pointerEvents:"none" }} />
    ))}
    <div className="flex gap-3 relative z-10">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.1)" blur={28}
          shadow="0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} />
        </G>
      ))}
    </div>
  </Bg>
);

// 19 — Neon Rim Glass
const T19 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#030308" }}>
    <div className="flex gap-3">
      {[
        {v:d,l:"ימים",  c:"#2dd4bf"},
        {v:h,l:"שעות",  c:"#60a5fa"},
        {v:m,l:"דקות",  c:"#c084fc"},
        {v:s,l:"שניות", c:"#fb923c"},
      ].map(({v,l,c}) => (
        <div key={l} style={{ padding:1, borderRadius:"0.875rem", background:c, boxShadow:`0 0 12px ${c}55` }}>
          <G tint="rgba(0,0,0,0.7)" border="transparent" blur={12}
            style={{ padding:"11px 15px", minWidth:58, borderRadius:"calc(0.875rem - 1px)" }}>
            <div className="font-bold text-3xl leading-none" style={{ color:c }}>{pad(v)}</div>
            <div className="text-[10px] mt-1.5" style={{ color:`${c}66` }}>{l}</div>
          </G>
        </div>
      ))}
    </div>
  </Bg>
);

// 20 — Label Outside Glass
const T20 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#06060e,#09091a)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center">
          <div className="text-white/25 text-[9px] tracking-widest uppercase mb-1.5">{l}</div>
          <G tint="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.09)" blur={24}
            shadow="0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
            style={{ padding:"10px 16px", minWidth:60 }}>
            <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
          </G>
        </div>
      ))}
    </div>
  </Bg>
);

// 21 — Dual-Tone Glass
const T21 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#050510,#080814)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => (
        <G key={l} tint={i<2?"rgba(59,130,246,0.08)":"rgba(168,85,247,0.08)"}
          border={i<2?"rgba(59,130,246,0.18)":"rgba(168,85,247,0.18)"} blur={24}
          shadow="0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l}
            vStyle={{ color: i<2 ? "#93c5fd" : "#d8b4fe" }}
            lStyle={{ color: i<2 ? "rgba(147,197,253,0.4)" : "rgba(216,180,254,0.4)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// 22 — Aurora Background Glass
const T22 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#050509", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 50% at 15% 70%,rgba(20,80,200,0.12) 0%,transparent 55%),radial-gradient(ellipse 60% 40% at 85% 25%,rgba(100,30,200,0.1) 0%,transparent 55%)", pointerEvents:"none" }} />
    <div className="flex gap-3 relative z-10">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.09)" blur={28}
          shadow="0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} />
        </G>
      ))}
    </div>
  </Bg>
);

// 23 — Corner Accent Glass
const T23 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#060610,#08080f)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים",c:"#14b8a6"},{v:h,l:"שעות",c:"#3b82f6"},{v:m,l:"דקות",c:"#a855f7"},{v:s,l:"שניות",c:"#f59e0b"}].map(({v,l,c}) => (
        <div key={l} className="relative" style={{ minWidth:60 }}>
          <div style={{ position:"absolute", top:0, left:0, width:8, height:8, borderTop:`1.5px solid ${c}`, borderLeft:`1.5px solid ${c}`, borderRadius:"0.5rem 0 0 0" }} />
          <div style={{ position:"absolute", bottom:0, right:0, width:8, height:8, borderBottom:`1.5px solid ${c}`, borderRight:`1.5px solid ${c}`, borderRadius:"0 0 0.5rem 0" }} />
          <G tint="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.07)" blur={20}
            style={{ padding:"12px 16px" }}>
            <Unit v={v} l={l} vStyle={{ color:c }} lStyle={{ color:`${c}66` }} />
          </G>
        </div>
      ))}
    </div>
  </Bg>
);

// 24 — Bottom Fade Glass
const T24 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#050508" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} style={{ position:"relative", minWidth:60 }}>
          <G tint="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.1)" blur={24}
            shadow="0 8px 20px rgba(0,0,0,0.5)"
            style={{ padding:"12px 16px" }}>
            <Unit v={v} l={l} />
          </G>
          <div style={{ position:"absolute", inset:"50% 0 0 0", background:"linear-gradient(to bottom,transparent,rgba(0,0,0,0.4))", borderRadius:"0 0 1rem 1rem", pointerEvents:"none" }} />
        </div>
      ))}
    </div>
  </Bg>
);

// 25 — Vision Pro (Apple-like)
const T25 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#060608,#0a0a0e)" }}>
    <G tint="rgba(255,255,255,0.07)" border="rgba(255,255,255,0.13)" blur={40}
      shadow="0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)"
      radius="1.5rem"
      style={{ padding:"6px" }}>
      <div className="flex divide-x" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center px-6 py-4"><Unit v={v} l={l} /></div>
        ))}
      </div>
    </G>
  </Bg>
);

// 26 — Holographic Glass
const T26 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#030308" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => {
        const hues = [180, 220, 280, 320];
        return (
          <G key={l} tint={`hsla(${hues[i]},80%,60%,0.08)`} border={`hsla(${hues[i]},80%,70%,0.2)`} blur={20}
            shadow={`0 8px 20px hsla(${hues[i]},80%,50%,0.12), inset 0 1px 0 hsla(${hues[i]},80%,80%,0.12)`}
            style={{ padding:"12px 16px", minWidth:60 }}>
            <div className="font-bold text-3xl leading-none" style={{ color:`hsl(${hues[i]},80%,80%)` }}>{pad(v)}</div>
            <div className="text-[10px] mt-1.5" style={{ color:`hsla(${hues[i]},80%,70%,0.4)` }}>{l}</div>
          </G>
        );
      })}
    </div>
  </Bg>
);

// 27 — Glass on Mesh Gradient
const T27 = ({ d, h, m, s }) => (
  <Bg style={{ background:"#040408", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 60% at 0% 50%,rgba(30,60,180,0.09) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 100% 50%,rgba(100,20,180,0.09) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 50% 100%,rgba(20,140,100,0.07) 0%,transparent 60%)", pointerEvents:"none" }} />
    <div className="flex gap-3 relative z-10">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.09)" blur={28}
          shadow="0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} />
        </G>
      ))}
    </div>
  </Bg>
);

// 28 — Floating Glass (big shadow)
const T28 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#020204" }}>
    <div className="flex gap-4">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(255,255,255,0.07)" border="rgba(255,255,255,0.12)" blur={24}
          shadow="0 24px 48px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.09)"
          style={{ padding:"14px 18px", minWidth:62 }}>
          <Unit v={v} l={l} />
        </G>
      ))}
    </div>
  </Bg>
);

// 29 — Glass Left Accent
const T29 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#060610,#08080f)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים",c:"#14b8a6"},{v:h,l:"שעות",c:"#3b82f6"},{v:m,l:"דקות",c:"#a855f7"},{v:s,l:"שניות",c:"#f59e0b"}].map(({v,l,c}) => (
        <div key={l} style={{ display:"flex", minWidth:60 }}>
          <div style={{ width:3, flexShrink:0, background:`linear-gradient(180deg,${c},${c}44)`, borderRadius:"4px 0 0 4px" }} />
          <G tint="rgba(255,255,255,0.05)" border="rgba(255,255,255,0.08)" blur={20}
            shadow="0 8px 20px rgba(0,0,0,0.4)"
            radius="0 0.875rem 0.875rem 0"
            style={{ padding:"12px 14px", flex:1 }}>
            <Unit v={v} l={l} vStyle={{ color:c }} lStyle={{ color:`${c}55` }} />
          </G>
        </div>
      ))}
    </div>
  </Bg>
);

// 30 — Stacked Glass Rows
const T30 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#060610,#090914)" }}>
    <div className="space-y-2 w-52">
      {[
        {v:d,l:"ימים",  c:"rgba(20,184,166,0.12)",  b:"rgba(20,184,166,0.2)"},
        {v:h,l:"שעות",  c:"rgba(59,130,246,0.12)",  b:"rgba(59,130,246,0.2)"},
        {v:m,l:"דקות",  c:"rgba(168,85,247,0.12)",  b:"rgba(168,85,247,0.2)"},
        {v:s,l:"שניות", c:"rgba(245,158,11,0.12)",  b:"rgba(245,158,11,0.2)"},
      ].map(({v,l,c,b}) => (
        <G key={l} tint={c} border={b} blur={20}
          shadow="inset 0 1px 0 rgba(255,255,255,0.05)"
          style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px" }}>
          <span className="text-white/40 text-xs">{l}</span>
          <span className="text-white font-bold text-2xl font-mono">{pad(v)}</span>
        </G>
      ))}
    </div>
  </Bg>
);

// 31 — Minimal Ultra Glass
const T31 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#030305" }}>
    <div className="flex gap-2">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(255,255,255,0.03)" border="rgba(255,255,255,0.06)" blur={36}
          shadow="0 4px 16px rgba(0,0,0,0.4)"
          style={{ padding:"12px 14px", minWidth:58 }}>
          <Unit v={v} l={l} vStyle={{ color:"rgba(255,255,255,0.75)", fontWeight:300 }} lStyle={{ color:"rgba(255,255,255,0.18)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// 32 — Cinematic Glass (wide)
const T32 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#030305" }}>
    <G tint="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.08)" blur={28}
      shadow="0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)"
      radius="0.5rem"
      style={{ width:"100%", maxWidth:380 }}>
      <div className="px-2 py-1">
        <div className="text-white/15 text-[8px] tracking-[0.35em] uppercase px-4 pt-3 pb-2">World Cup 2026</div>
        <div className="flex items-center gap-0 divide-x" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
          {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
            <div key={l} className="text-center flex-1 py-3">
              <div className="text-white font-semibold text-2xl leading-none">{pad(v)}</div>
              <div className="text-white/25 text-[9px] mt-1.5">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </G>
  </Bg>
);

// 33 — Night Mode Glass
const T33 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#000" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(255,255,255,0.045)" border="rgba(255,255,255,0.08)" blur={30}
          shadow="0 12px 32px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)"
          style={{ padding:"12px 16px", minWidth:60 }}>
          <Unit v={v} l={l} />
        </G>
      ))}
    </div>
  </Bg>
);

// 34 — Star Dust Glass
const T34 = ({ d, h, m, s }) => {
  const dots = Array.from({length:30},(_,i)=>({x:(i*137)%100,y:(i*89)%100,r:i%4===0?1.5:0.8}));
  return (
    <Bg style={{ background:"#020208", position:"relative", overflow:"hidden" }}>
      {dots.map((dt,i)=><div key={i} style={{ position:"absolute", left:`${dt.x}%`, top:`${dt.y}%`, width:dt.r, height:dt.r, borderRadius:"50%", background:"white", opacity:0.12, pointerEvents:"none" }} />)}
      <div className="flex gap-3 relative z-10">
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <G key={l} tint="rgba(255,255,255,0.05)" border="rgba(255,255,255,0.09)" blur={24}
            shadow="0 8px 24px rgba(0,0,0,0.6)"
            style={{ padding:"12px 16px", minWidth:60 }}>
            <Unit v={v} l={l} />
          </G>
        ))}
      </div>
    </Bg>
  );
};

// 35 — Premium Glass (inset border)
const T35 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#07070e,#0a0a16)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <G key={l} tint="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.12)" blur={28}
          shadow="0 12px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.04)"
          style={{ padding:"14px 18px", minWidth:62 }}>
          <div className="h-px w-full mb-3" style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)" }} />
          <Unit v={v} l={l} />
          <div className="h-px w-full mt-3" style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)" }} />
        </G>
      ))}
    </div>
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════════
//  DAYS HERO VARIANTS (36–50)
// ════════════════════════════════════════════════════════════════════════════════

// 36 — Classic Hero (days left, rest stacked right)
const T36 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#060608" }}>
    <div className="flex items-center gap-6">
      <div className="text-center">
        <div className="text-white font-black leading-none" style={{ fontSize:"5.5rem", letterSpacing:"-0.04em" }}>{pad(d)}</div>
        <div className="text-white/25 text-xs mt-1 tracking-widest">DAYS</div>
      </div>
      <div className="w-px h-20 bg-white/10" />
      <div className="space-y-1.5">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="flex items-baseline gap-2">
            <span className="text-white/70 font-semibold text-xl font-mono">{pad(v)}</span>
            <span className="text-white/25 text-[10px]">{l}</span>
          </div>
        ))}
      </div>
    </div>
  </Bg>
);

// 37 — Centered Hero (days huge center, rest row below)
const T37 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#050505" }}>
    <div className="text-center">
      <div className="text-white/15 text-[9px] tracking-[0.4em] uppercase mb-1">WC2026</div>
      <div className="text-white font-black leading-none mb-3" style={{ fontSize:"6rem", letterSpacing:"-0.05em" }}>{pad(d)}</div>
      <div className="text-white/20 text-xs tracking-widest mb-3">DAYS TO GO</div>
      <div className="flex justify-center gap-4">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center">
            <div className="text-white/60 font-semibold text-lg leading-none">{pad(v)}</div>
            <div className="text-white/20 text-[9px] mt-0.5">{l}</div>
          </div>
        ))}
      </div>
    </div>
  </Bg>
);

// 38 — Background Watermark Hero
const T38 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#040408", position:"relative", overflow:"hidden" }}>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ fontSize:"14rem", fontWeight:900, color:"rgba(255,255,255,0.03)", lineHeight:1, letterSpacing:"-0.05em" }}>{pad(d)}</div>
    <div className="flex gap-3 relative z-10">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => (
        <G key={l} tint="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.1)" blur={24}
          shadow="0 8px 20px rgba(0,0,0,0.5)"
          style={{ padding:"12px 16px", minWidth:60, opacity: i===0 ? 1 : 0.7 }}>
          <div className={`font-bold text-3xl leading-none ${i===0?"text-white":"text-white/60"}`}>{pad(v)}</div>
          <div className="text-white/25 text-[10px] mt-1.5">{l}</div>
        </G>
      ))}
    </div>
  </Bg>
);

// 39 — Split Panel Hero
const T39 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#040408", padding:0 }}>
    <div className="flex w-full" style={{ minHeight:110 }}>
      <div className="flex-1 flex flex-col items-center justify-center bg-white/5 border-r border-white/8">
        <div className="text-white font-black leading-none" style={{ fontSize:"4.5rem", letterSpacing:"-0.04em" }}>{pad(d)}</div>
        <div className="text-white/25 text-[10px] tracking-widest mt-0.5">DAYS</div>
      </div>
      <div className="flex flex-col justify-center px-6 gap-2">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="flex items-baseline gap-2">
            <span className="text-white font-bold text-2xl font-mono">{pad(v)}</span>
            <span className="text-white/30 text-[10px]">{l}</span>
          </div>
        ))}
      </div>
    </div>
  </Bg>
);

// 40 — Glass Hero (days in glass card, rest tiny)
const T40 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#060610,#09091a)" }}>
    <div className="flex items-center gap-4">
      <G tint="rgba(255,255,255,0.07)" border="rgba(255,255,255,0.12)" blur={28}
        shadow="0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.09)"
        style={{ padding:"16px 24px", textAlign:"center" }}>
        <div className="text-white/20 text-[8px] tracking-widest uppercase mb-2">ימים</div>
        <div className="text-white font-black leading-none" style={{ fontSize:"4rem", letterSpacing:"-0.04em" }}>{pad(d)}</div>
      </G>
      <div className="space-y-2">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <G key={l} tint="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.07)" blur={16}
            style={{ padding:"6px 14px", display:"flex", alignItems:"center", gap:8, minWidth:90 }}>
            <span className="text-white font-bold text-lg font-mono">{pad(v)}</span>
            <span className="text-white/25 text-[9px]">{l}</span>
          </G>
        ))}
      </div>
    </div>
  </Bg>
);

// 41 — Color Accent Hero
const T41 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#050508" }}>
    <div className="flex items-center gap-5">
      <div className="text-center">
        <div className="font-black leading-none" style={{ fontSize:"5.5rem", letterSpacing:"-0.04em", color:"#14b8a6", textShadow:"0 0 40px rgba(20,184,166,0.3)" }}>{pad(d)}</div>
        <div className="text-teal-400/40 text-[10px] tracking-widest">ימים</div>
      </div>
      <div className="w-px h-16 bg-white/8" />
      <div className="space-y-1.5">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="flex items-baseline gap-2">
            <span className="text-white/60 font-semibold text-xl font-mono">{pad(v)}</span>
            <span className="text-white/20 text-[9px]">{l}</span>
          </div>
        ))}
      </div>
    </div>
  </Bg>
);

// 42 — Circular Hero
const T42 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#040408" }}>
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
        <svg className="absolute inset-0" width="128" height="128">
          <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2"
            strokeDasharray={`${(d/30)*364} 364`} strokeLinecap="round" transform="rotate(-90 64 64)" />
        </svg>
        <div>
          <div className="text-white font-black text-4xl leading-none" style={{ letterSpacing:"-0.03em" }}>{pad(d)}</div>
          <div className="text-white/25 text-[9px] tracking-widest text-center">ימים</div>
        </div>
      </div>
      <div className="flex justify-center gap-5">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center">
            <div className="text-white/60 font-semibold text-lg leading-none">{pad(v)}</div>
            <div className="text-white/20 text-[9px] mt-0.5">{l}</div>
          </div>
        ))}
      </div>
    </div>
  </Bg>
);

// 43 — Editorial Mono Hero
const T43 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#000" }}>
    <div className="w-full px-2">
      <div className="text-white/10 text-[8px] tracking-[0.5em] uppercase mb-1">COUNTDOWN · WC2026</div>
      <div className="flex items-end justify-between border-b border-white/8 pb-3 mb-3">
        <div className="text-white font-black leading-none" style={{ fontSize:"6rem", letterSpacing:"-0.05em", fontFamily:"Arial Black,sans-serif" }}>{pad(d)}</div>
        <div className="text-right pb-2">
          <div className="text-white/15 text-[9px] leading-relaxed">ימים<br/>נותרו</div>
        </div>
      </div>
      <div className="flex gap-6">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l}>
            <div className="text-white/50 font-bold text-2xl leading-none">{pad(v)}</div>
            <div className="text-white/15 text-[9px] mt-0.5">{l}</div>
          </div>
        ))}
      </div>
    </div>
  </Bg>
);

// 44 — Vertical Hero
const T44 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#060610,#08080f)", padding:"12px 24px" }}>
    <div className="flex gap-5">
      <div className="flex flex-col items-center justify-center border-r border-white/8 pr-5">
        <div className="text-white font-black leading-none" style={{ fontSize:"4.5rem", letterSpacing:"-0.04em", writingMode:"horizontal-tb" }}>{pad(d)}</div>
        <div className="text-white/20 text-[9px] tracking-widest mt-1">ימים</div>
      </div>
      <div className="flex flex-col justify-center gap-2.5">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-white/60 font-semibold text-lg font-mono">{pad(v)}</span>
            <span className="text-white/25 text-[10px]">{l}</span>
          </div>
        ))}
      </div>
    </div>
  </Bg>
);

// 45 — Glass + Glow Hero
const T45 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#050510,#080818)" }}>
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl blur-xl bg-indigo-500/20" style={{ transform:"scale(1.1)" }} />
        <G tint="rgba(99,102,241,0.12)" border="rgba(99,102,241,0.25)" blur={24}
          shadow="0 16px 40px rgba(99,102,241,0.2), inset 0 1px 0 rgba(200,200,255,0.1)"
          style={{ padding:"16px 22px", textAlign:"center", position:"relative" }}>
          <div className="text-[8px] text-indigo-300/40 tracking-widest uppercase mb-1.5">ימים</div>
          <div className="font-black leading-none" style={{ fontSize:"4rem", color:"#a5b4fc", textShadow:"0 0 30px rgba(165,180,252,0.5)", letterSpacing:"-0.04em" }}>{pad(d)}</div>
        </G>
      </div>
      <div className="space-y-2">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <G key={l} tint="rgba(99,102,241,0.05)" border="rgba(99,102,241,0.12)" blur={16}
            style={{ padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
            <span className="text-indigo-200/60 font-semibold text-lg">{pad(v)}</span>
            <span className="text-indigo-300/25 text-[9px]">{l}</span>
          </G>
        ))}
      </div>
    </div>
  </Bg>
);

// 46 — Trophy Hero
const T46 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#0a0800,#120e00)" }}>
    <div className="text-center">
      <img src="/trophy.png" alt="" style={{ width:28, margin:"0 auto 6px", opacity:0.7 }} />
      <div className="font-black leading-none mb-1" style={{ fontSize:"4.5rem", color:"#fbbf24", letterSpacing:"-0.04em", textShadow:"0 0 30px rgba(251,191,36,0.3)" }}>{pad(d)}</div>
      <div className="text-amber-400/30 text-[9px] tracking-widest mb-3">DAYS</div>
      <div className="flex justify-center gap-4">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center">
            <div className="text-amber-300/50 font-semibold text-lg leading-none">{pad(v)}</div>
            <div className="text-amber-400/20 text-[9px] mt-0.5">{l}</div>
          </div>
        ))}
      </div>
    </div>
  </Bg>
);

// 47 — Broadcast Hero
const T47 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#08080f" }}>
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <div className="text-white/30 text-[8px] tracking-widest">LIVE · WORLD CUP 2026</div>
      </div>
      <div className="flex items-end gap-4 border-t border-white/8 pt-3">
        <div>
          <div className="text-white font-black leading-none" style={{ fontSize:"4.5rem", letterSpacing:"-0.04em" }}>{pad(d)}</div>
          <div className="text-white/20 text-xs tracking-widest">ימים</div>
        </div>
        <div className="flex gap-1 pb-2 text-white/40 text-sm items-baseline">
          <span className="font-bold text-xl text-white/50">{pad(h)}</span><span className="text-[9px]">h</span>
          <span className="font-bold text-xl text-white/50 ml-1">{pad(m)}</span><span className="text-[9px]">m</span>
          <span className="font-bold text-xl text-red-400 ml-1">{pad(s)}</span><span className="text-[9px] text-red-400/50">s</span>
        </div>
      </div>
    </div>
  </Bg>
);

// 48 — Dark Editorial Hero
const T48 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#000" }}>
    <div className="w-full">
      <div className="flex items-baseline gap-3 mb-2">
        <div className="text-white font-black leading-none" style={{ fontSize:"7rem", letterSpacing:"-0.05em" }}>{pad(d)}</div>
        <div className="text-white/10 font-light text-sm leading-tight pb-2">ימים<br/>נותרו</div>
      </div>
      <div className="h-px bg-white/6 mb-2" />
      <div className="flex gap-6">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l}>
            <div className="text-white/40 font-semibold text-2xl leading-none">{pad(v)}</div>
            <div className="text-white/12 text-[9px] mt-0.5">{l}</div>
          </div>
        ))}
      </div>
    </div>
  </Bg>
);

// 49 — Full Glass Hero
const T49 = ({ d, h, m, s }) => (
  <Bg style={{ background: "linear-gradient(160deg,#060610,#09091a)", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 30% 50%,rgba(99,102,241,0.08) 0%,transparent 60%)", pointerEvents:"none" }} />
    <G tint="rgba(255,255,255,0.055)" border="rgba(255,255,255,0.09)" blur={28}
      shadow="0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)"
      style={{ display:"flex", alignItems:"center", gap:0, position:"relative", overflow:"hidden" }}>
      <div className="px-6 py-5 border-r" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
        <div className="text-white/20 text-[8px] tracking-widest uppercase mb-1">ימים</div>
        <div className="text-white font-black leading-none" style={{ fontSize:"4rem", letterSpacing:"-0.04em" }}>{pad(d)}</div>
      </div>
      <div className="px-5 py-4 space-y-2">
        {[{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="flex items-baseline gap-2">
            <span className="text-white/70 font-semibold text-xl font-mono">{pad(v)}</span>
            <span className="text-white/20 text-[9px]">{l}</span>
          </div>
        ))}
      </div>
    </G>
  </Bg>
);

// 50 — Minimal Hero
const T50 = ({ d, h, m, s }) => (
  <Bg style={{ background: "#030305" }}>
    <div className="flex items-baseline gap-5">
      <div>
        <div className="text-white font-light leading-none" style={{ fontSize:"6.5rem", letterSpacing:"-0.05em" }}>{pad(d)}</div>
        <div className="text-white/15 text-[9px] tracking-[0.3em] uppercase mt-0.5">DAYS</div>
      </div>
      <div className="pb-4 text-white/8 text-4xl font-thin">|</div>
      <div className="pb-4 space-y-0.5">
        {[{v:h,l:"h"},{v:m,l:"m"},{v:s,l:"s"}].map(({v,l}) => (
          <div key={l} className="flex items-baseline gap-1">
            <span className="text-white/30 font-light text-2xl">{pad(v)}</span>
            <span className="text-white/12 text-[10px]">{l}</span>
          </div>
        ))}
      </div>
    </div>
  </Bg>
);

// ════════════════════════════════════════════════════════════════════════════════
const RENDERS = [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49,T50];

const VARIANTS = [
  // Glass
  { id:1,  name:"Teal Inner Glow",    desc:"זוהר פנימי טיל",           cat:"glass" },
  { id:2,  name:"Sapphire Shimmer",   desc:"שימר ספיר עם קו עליון",    cat:"glass" },
  { id:3,  name:"Amethyst",           desc:"אמתיסט סגול עמוק",          cat:"glass" },
  { id:4,  name:"Rose Gold",          desc:"זכוכית ורוד-זהב",           cat:"glass" },
  { id:5,  name:"Jade Deep",          desc:"ירוק ג׳ייד עמוק",           cat:"glass" },
  { id:6,  name:"Ghost Glass",        desc:"כמעט בלתי נראה, מקסימלי",   cat:"glass" },
  { id:7,  name:"Mica",               desc:"אפקט Mica של Windows 11",   cat:"glass" },
  { id:8,  name:"Iridescent Border",  desc:"גבול גרדיאנט ייחודי",       cat:"glass" },
  { id:9,  name:"Scanlines",          desc:"קווי סריקה מעל זכוכית",     cat:"glass" },
  { id:10, name:"Multi-Layer",        desc:"3 שכבות זכוכית שקופה",      cat:"glass" },
  { id:11, name:"One-Piece Pill",     desc:"פיל אחד גדול עגול",         cat:"glass" },
  { id:12, name:"Colored Shadows",    desc:"צל צבעוני לכל כרטיס",      cat:"glass" },
  { id:13, name:"Tall Pillars",       desc:"עמודים גבוהים בגבהים שונים", cat:"glass" },
  { id:14, name:"Top Shimmer",        desc:"קו שימר בולט בראש",          cat:"glass" },
  { id:15, name:"Warm Cream",         desc:"זכוכית קרם חמה",            cat:"glass" },
  { id:16, name:"Arctic Glass",       desc:"קרח ארקטי תכלת עדין",       cat:"glass" },
  { id:17, name:"Smoked",             desc:"זכוכית מעושנת כהה",         cat:"glass" },
  { id:18, name:"Bokeh Glass",        desc:"עיגולי בוקה מאחורי זכוכית", cat:"glass" },
  { id:19, name:"Neon Rim",           desc:"זוהר ניאון מסביב לגבול",    cat:"glass" },
  { id:20, name:"Label Outside",      desc:"תווית מחוץ לכרטיס",         cat:"glass" },
  { id:21, name:"Dual-Tone",          desc:"שני גוונים — כחול/סגול",    cat:"glass" },
  { id:22, name:"Aurora BG",          desc:"אורורה מאחורי זכוכית",      cat:"glass" },
  { id:23, name:"Corner Accents",     desc:"פינות צבעוניות לכל כרטיס",  cat:"glass" },
  { id:24, name:"Bottom Fade",        desc:"זכוכית עם דהייה בתחתית",    cat:"glass" },
  { id:25, name:"Vision Pro",         desc:"Apple Vision Pro aesthetic", cat:"glass" },
  { id:26, name:"Holographic",        desc:"גוונים הולוגרפיים משתנים",   cat:"glass" },
  { id:27, name:"Mesh Gradient BG",   desc:"רקע mesh gradient",          cat:"glass" },
  { id:28, name:"Floating",           desc:"צל ענק, כרטיסים מרחפים",    cat:"glass" },
  { id:29, name:"Left Accent",        desc:"פס צבעוני משמאל לכרטיס",    cat:"glass" },
  { id:30, name:"Stacked Rows",       desc:"שורות זכוכית צבעוניות",     cat:"glass" },
  { id:31, name:"Ultra Minimal",      desc:"זכוכית כמעט בלתי נראית",     cat:"glass" },
  { id:32, name:"Cinematic",          desc:"פאנל רחב, קו WC2026",        cat:"glass" },
  { id:33, name:"Night Mode",         desc:"שחור מוחלט + זכוכית עמוקה", cat:"glass" },
  { id:34, name:"Star Dust",          desc:"נקודות כוכבים, זכוכית",      cat:"glass" },
  { id:35, name:"Premium Inset",      desc:"זכוכית עם גבול פנימי כפול", cat:"glass" },
  // Hero
  { id:36, name:"Classic Hero",       desc:"ימים ענק שמאל, שאר ימין",   cat:"hero" },
  { id:37, name:"Centered Hero",      desc:"ימים ענק מרכז, שאר למטה",   cat:"hero" },
  { id:38, name:"Watermark Hero",     desc:"ימים כווטרמרק ברקע",         cat:"hero" },
  { id:39, name:"Split Panel",        desc:"פאנל שמאל/ימין חצוי",        cat:"hero" },
  { id:40, name:"Glass Hero",         desc:"ימים בכרטיס זכוכית גדול",    cat:"hero" },
  { id:41, name:"Color Accent Hero",  desc:"ימים בצבע, שאר אפור",        cat:"hero" },
  { id:42, name:"Circular Hero",      desc:"ימים בעיגול progress",        cat:"hero" },
  { id:43, name:"Editorial Mono",     desc:"ימים ענק + כותרת אדיטוריאל", cat:"hero" },
  { id:44, name:"Vertical Hero",      desc:"ימים שמאל אנכי, שאר ימין",  cat:"hero" },
  { id:45, name:"Glow Glass Hero",    desc:"ימים בזכוכית זוהרת סגולה",   cat:"hero" },
  { id:46, name:"Trophy Hero",        desc:"גביע + ימים זהוב ענק",        cat:"hero" },
  { id:47, name:"Broadcast Hero",     desc:"סגנון שידור ספורט LIVE",     cat:"hero" },
  { id:48, name:"Dark Editorial",     desc:"ימים ענקי, שחור מוחלט",      cat:"hero" },
  { id:49, name:"Full Glass Hero",    desc:"ימים + שאר בתוך פאנל זכוכית", cat:"hero" },
  { id:50, name:"Minimal Hero",       desc:"ימים אור, שאר קטן מאוד",     cat:"hero" },
];

// ─── Preview card ─────────────────────────────────────────────────────────────
const PreviewCard = ({ variant, isSelected, onSelect, onExpand }) => {
  const Render = RENDERS[variant.id - 1];
  return (
    <motion.div layout initial={{ opacity:0 }} animate={{ opacity:1 }} className="group relative">
      <div onClick={onSelect} className="relative rounded-xl overflow-hidden cursor-pointer"
        style={{ border: isSelected ? "1.5px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ height:82, overflow:"hidden", position:"relative" }}>
          <div style={{ transform:"scale(0.5)", transformOrigin:"top left", width:"200%", height:"200%", pointerEvents:"none" }}>
            <Render {...S} />
          </div>
        </div>
        <button onClick={e=>{ e.stopPropagation(); onExpand(); }}
          className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-white/60 hover:text-white"
          style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)" }}>
          <Maximize2 className="w-2.5 h-2.5" />
        </button>
        {isSelected && (
          <div className="absolute top-1 right-1 rounded-full p-0.5 bg-white">
            <Check className="w-2 h-2 text-black" />
          </div>
        )}
        <div className="absolute bottom-1 left-1">
          <span className="text-[8px] px-1.5 py-0.5 rounded-full font-medium" style={{
            background: variant.cat === "glass" ? "rgba(20,184,166,0.2)" : "rgba(99,102,241,0.2)",
            color:      variant.cat === "glass" ? "#5eead4" : "#a5b4fc",
          }}>{variant.cat}</span>
        </div>
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-white/70 text-[11px] font-medium leading-tight truncate">{variant.id + 50}. {variant.name}</p>
        <p className="text-white/25 text-[9px] mt-0.5 leading-tight truncate">{variant.desc}</p>
      </div>
    </motion.div>
  );
};

const FullPreview = ({ variant, onClose }) => {
  const time = useCountdown();
  const Render = RENDERS[variant.id - 1];
  return (
    <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <motion.div className="relative z-10 w-full max-w-lg"
        initial={{ scale:0.94, y:12 }} animate={{ scale:1, y:0 }}
        transition={{ type:"spring", stiffness:400, damping:30 }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-white/30 text-xs mr-1.5">#{variant.id + 50}</span>
            <span className="text-white font-semibold text-sm">{variant.name}</span>
            <span className="text-white/35 text-xs ml-2">{variant.desc}</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1.5 rounded-lg" style={{ background:"rgba(255,255,255,0.05)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.08)" }}>
          <Render {...time} />
        </div>
        <p className="text-white/20 text-[10px] text-center mt-2">ספירה חיה — WC2026</p>
      </motion.div>
    </motion.div>
  );
};

export default function AdminTimerDemo2() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  const list = filter === "all" ? VARIANTS : VARIANTS.filter(v => v.cat === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Timer Styles Vol.2 — 50 עיצובים</h2>
          <p className="text-slate-500 text-sm mt-0.5">זכוכית מתקדמת + סגנון Days Hero</p>
        </div>
        {selected && (
          <div className="text-[12px] px-3 py-1.5 rounded-lg text-white/50" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
            ✓ #{selected + 50} {VARIANTS[selected-1]?.name}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {["all","glass","hero"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-full text-[11px] font-medium transition-all"
            style={filter === f
              ? { background:"rgba(255,255,255,0.12)", color:"white", border:"1px solid rgba(255,255,255,0.2)" }
              : { background:"transparent", color:"rgba(255,255,255,0.3)", border:"1px solid rgba(255,255,255,0.07)" }
            }>{f}</button>
        ))}
        <span className="text-white/20 text-xs self-center ml-1">{list.length} סגנונות</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        <AnimatePresence>
          {list.map(v => (
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
