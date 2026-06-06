import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Check } from "lucide-react";

// ─── Live countdown ───────────────────────────────────────────────────────────
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

// Sample static values for previews
const S = { d: 5, h: 0, m: 32, s: 3 };

// Shared row wrapper
const Row = ({ children, bg = "#0a0a0a", style = {} }) => (
  <div className="w-full flex items-center justify-center py-8 px-6" style={{ background: bg, minHeight: 110, ...style }}>
    {children}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
//  50 TIMER RENDER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

// 1 — Glassmorphism Teal (current)
const T1 = ({ d, h, m, s }) => (
  <Row style={{ background: "linear-gradient(135deg,#0a2a2a,#041a1a)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[60px]" style={{ background:"rgba(0,200,180,0.12)", border:"1px solid rgba(0,200,180,0.25)", backdropFilter:"blur(12px)" }}>
          <div className="text-white font-bold text-3xl leading-none font-mono">{pad(v)}</div>
          <div className="text-teal-300/60 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 2 — Dark Obsidian
const T2 = ({ d, h, m, s }) => (
  <Row bg="#060606">
    <div className="flex gap-2">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-xl min-w-[58px]" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-white/25 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 3 — Neon Purple
const T3 = ({ d, h, m, s }) => (
  <Row bg="#06020f">
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(160,40,255,0.1)", border:"1px solid rgba(160,40,255,0.35)", boxShadow:"0 0 20px rgba(160,40,255,0.15)" }}>
          <div className="font-bold text-3xl leading-none" style={{ color:"#c084fc", textShadow:"0 0 16px rgba(192,132,252,0.8)" }}>{pad(v)}</div>
          <div className="text-purple-400/40 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 4 — Gold Premium
const T4 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#0d0900,#1a1200)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-xl min-w-[58px]" style={{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.25)" }}>
          <div className="font-bold text-3xl leading-none" style={{ color:"#fbbf24", textShadow:"0 0 12px rgba(251,191,36,0.4)" }}>{pad(v)}</div>
          <div className="text-amber-400/40 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 5 — LCD Digital
const T5 = ({ d, h, m, s }) => (
  <Row bg="#000">
    <div className="flex gap-4 items-end">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => (
        <React.Fragment key={l}>
          <div className="text-center">
            <div className="font-mono text-4xl leading-none" style={{ color:"#00ff41", textShadow:"0 0 10px #00ff41", letterSpacing:"0.05em" }}>{pad(v)}</div>
            <div className="text-[9px] mt-1.5" style={{ color:"rgba(0,255,65,0.4)", fontFamily:"monospace" }}>{l}</div>
          </div>
          {i < 3 && <div className="text-2xl font-bold mb-3 opacity-60" style={{ color:"#00ff41" }}>:</div>}
        </React.Fragment>
      ))}
    </div>
  </Row>
);

// 6 — Frosted Blue
const T6 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#040d1c,#060f22)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(60,120,255,0.12)", border:"1px solid rgba(80,140,255,0.2)", backdropFilter:"blur(12px)" }}>
          <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-blue-300/50 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 7 — Crimson
const T7 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#0d0202,#180404)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-xl min-w-[58px]" style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.25)" }}>
          <div className="text-red-400 font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-red-400/35 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 8 — Minimal Colon
const T8 = ({ d, h, m, s }) => (
  <Row bg="#080808">
    <div className="flex items-end gap-1">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => (
        <React.Fragment key={l}>
          <div className="text-center">
            <div className="text-white font-light text-4xl leading-none tracking-tight">{pad(v)}</div>
            <div className="text-white/25 text-[9px] mt-1">{l}</div>
          </div>
          {i < 3 && <div className="text-white/20 text-2xl font-thin pb-4 mx-1">:</div>}
        </React.Fragment>
      ))}
    </div>
  </Row>
);

// 9 — Carbon Grid
const T9 = ({ d, h, m, s }) => (
  <Row bg="#070707" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize:"20px 20px" }}>
    <div className="flex gap-2">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 min-w-[58px]" style={{ background:"rgba(20,20,20,0.95)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"6px" }}>
          <div className="text-white font-black text-3xl leading-none tracking-wider font-mono">{pad(v)}</div>
          <div className="text-white/20 text-[9px] mt-1.5 tracking-widest uppercase">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 10 — Split Flap
const T10 = ({ d, h, m, s }) => (
  <Row bg="#0a0a0a">
    <div className="flex gap-1.5">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center">
          <div className="relative flex gap-0.5">
            {pad(v).split('').map((c,i) => (
              <div key={i} className="relative w-10 h-14 flex items-center justify-center overflow-hidden" style={{ background:"#1a1a1a", border:"1px solid #333", borderRadius:"4px" }}>
                <div className="absolute inset-x-0 top-1/2 h-px bg-black/60 z-10" />
                <span className="text-white font-black text-3xl font-mono">{c}</span>
              </div>
            ))}
          </div>
          <div className="text-white/30 text-[9px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 11 — Circular Rings
const T11 = ({ d, h, m, s }) => {
  const maxes = [30,24,60,60];
  const colors = ["#14b8a6","#3b82f6","#a855f7","#f59e0b"];
  return (
    <Row bg="#060606">
      <div className="flex gap-4">
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => {
          const pct = Math.min(v / maxes[i], 1);
          const r = 26, circ = 2 * Math.PI * r;
          return (
            <div key={l} className="text-center">
              <svg width="64" height="64">
                <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <circle cx="32" cy="32" r={r} fill="none" stroke={colors[i]} strokeWidth="4"
                  strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round"
                  transform="rotate(-90 32 32)" />
                <text x="32" y="36" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{pad(v)}</text>
              </svg>
              <div className="text-white/30 text-[9px] mt-0.5">{l}</div>
            </div>
          );
        })}
      </div>
    </Row>
  );
};

// 12 — Progress Bars
const T12 = ({ d, h, m, s }) => {
  const maxes = [30,24,60,60];
  const colors = ["#14b8a6","#3b82f6","#a855f7","#f59e0b"];
  return (
    <Row bg="#080808">
      <div className="space-y-3 w-48">
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => (
          <div key={l}>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-white/40">{l}</span>
              <span className="text-white font-bold font-mono">{pad(v)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5">
              <div className="h-full rounded-full" style={{ width:`${(v/maxes[i])*100}%`, background:colors[i] }} />
            </div>
          </div>
        ))}
      </div>
    </Row>
  );
};

// 13 — Bold Editorial
const T13 = ({ d, h, m, s }) => (
  <Row bg="#050505">
    <div className="flex items-baseline gap-1">
      {[{v:d,l:"D"},{v:h,l:"H"},{v:m,l:"M"},{v:s,l:"S"}].map(({v,l},i) => (
        <React.Fragment key={l}>
          <div className="text-center">
            <span className="text-white font-black leading-none" style={{ fontSize:"3.5rem", letterSpacing:"-0.04em" }}>{pad(v)}</span>
            <span className="text-white/20 font-light text-sm ml-0.5">{l}</span>
          </div>
          {i < 3 && <span className="text-white/10 font-thin text-4xl mx-0.5 pb-2">·</span>}
        </React.Fragment>
      ))}
    </div>
  </Row>
);

// 14 — Pill Connected
const T14 = ({ d, h, m, s }) => (
  <Row bg="#080808">
    <div className="flex rounded-2xl overflow-hidden border border-white/10">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => (
        <div key={l} className={`text-center px-5 py-4 ${i>0?'border-l border-white/10':''}`} style={{ background:"rgba(255,255,255,0.04)" }}>
          <div className="text-white font-bold text-2xl leading-none">{pad(v)}</div>
          <div className="text-white/30 text-[9px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 15 — Underline Only
const T15 = ({ d, h, m, s }) => (
  <Row bg="#070707">
    <div className="flex gap-6">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center">
          <div className="text-white font-semibold text-3xl leading-none pb-2 border-b border-white/20">{pad(v)}</div>
          <div className="text-white/30 text-[10px] mt-2">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 16 — Frosted White (light)
const T16 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#e8edf5,#dde4ef)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.9)", backdropFilter:"blur(12px)", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
          <div className="text-gray-800 font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-gray-400 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 17 — Navy Pro
const T17 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#020814,#040c20)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-xl min-w-[58px]" style={{ background:"rgba(30,58,138,0.3)", border:"1px solid rgba(59,130,246,0.2)" }}>
          <div className="text-blue-100 font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-blue-300/40 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 18 — Emerald Pitch
const T18 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#020f06,#041208)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)" }}>
          <div className="text-emerald-300 font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-emerald-400/40 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 19 — Hologram Cyan
const T19 = ({ d, h, m, s }) => (
  <Row bg="#020a0a" style={{ backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,200,0.025) 3px,rgba(0,200,200,0.025) 4px)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-xl min-w-[58px]" style={{ background:"rgba(0,200,200,0.06)", border:"1px solid rgba(0,200,200,0.25)" }}>
          <div className="font-bold text-3xl leading-none font-mono" style={{ color:"#00d4d4", textShadow:"0 0 12px #00d4d4" }}>{pad(v)}</div>
          <div className="text-[10px] mt-1.5" style={{ color:"rgba(0,212,212,0.4)" }}>{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 20 — Fire Gradient
const T20 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#0d0200,#150500)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(234,88,12,0.1)", border:"1px solid rgba(234,88,12,0.25)" }}>
          <div className="font-bold text-3xl leading-none" style={{ background:"linear-gradient(180deg,#fbbf24,#ea580c)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{pad(v)}</div>
          <div className="text-orange-400/40 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 21 — Pixel 8-bit
const T21 = ({ d, h, m, s }) => (
  <Row bg="#080808">
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-3 py-3 min-w-[56px]" style={{ background:"#1a1a1a", border:"3px solid #333" }}>
          <div className="font-mono font-black text-2xl leading-none" style={{ color:"#00ff00", textShadow:"2px 2px 0 #004400" }}>{pad(v)}</div>
          <div className="text-[8px] mt-1.5" style={{ color:"rgba(0,255,0,0.4)" }}>{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 22 — Vertical Stack
const T22 = ({ d, h, m, s }) => {
  const colors = ["#14b8a6","#3b82f6","#a855f7","#f59e0b"];
  return (
    <Row bg="#060606">
      <div className="space-y-2">
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => (
          <div key={l} className="flex items-center gap-4 px-5 py-2.5 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <div className="font-bold text-2xl w-14 text-right" style={{ color:colors[i] }}>{pad(v)}</div>
            <div className="h-4 w-px bg-white/10" />
            <div className="text-white/40 text-xs">{l}</div>
          </div>
        ))}
      </div>
    </Row>
  );
};

// 23 — Newspaper
const T23 = ({ d, h, m, s }) => (
  <Row style={{ background:"#f0ebe0" }}>
    <div className="text-center border-4 border-black px-8 py-4" style={{ fontFamily:"Georgia,serif" }}>
      <div className="text-[9px] uppercase tracking-widest text-black/50 mb-2">עד לפתיחת המונדיאל</div>
      <div className="flex items-baseline gap-3">
        {[{v:d,l:"D"},{v:h,l:"H"},{v:m,l:"M"},{v:s,l:"S"}].map(({v,l},i) => (
          <React.Fragment key={l}>
            <div className="text-center">
              <div className="text-black font-black text-4xl leading-none">{pad(v)}</div>
              <div className="text-black/40 text-[9px]">{l}</div>
            </div>
            {i < 3 && <div className="text-black/30 text-2xl font-bold">:</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  </Row>
);

// 24 — Retro Scoreboard
const T24 = ({ d, h, m, s }) => (
  <Row bg="#0a0800">
    <div className="border-2 border-yellow-500/50 rounded-lg overflow-hidden">
      <div className="bg-yellow-500/20 px-4 py-1 text-center text-[9px] font-bold tracking-widest text-yellow-400">WORLD CUP 2026</div>
      <div className="flex divide-x divide-yellow-500/20">
        {[{v:d,l:"DAYS"},{v:h,l:"HRS"},{v:m,l:"MIN"},{v:s,l:"SEC"}].map(({v,l}) => (
          <div key={l} className="text-center px-5 py-3">
            <div className="text-yellow-400 font-black text-3xl leading-none font-mono">{pad(v)}</div>
            <div className="text-yellow-400/40 text-[8px] mt-1 tracking-wider">{l}</div>
          </div>
        ))}
      </div>
    </div>
  </Row>
);

// 25 — TV Broadcast
const T25 = ({ d, h, m, s }) => (
  <Row bg="#08080f">
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <div className="text-white/50 text-[9px] font-bold tracking-widest uppercase">Live — World Cup 2026</div>
      </div>
      <div className="flex gap-0 rounded-lg overflow-hidden border border-white/10">
        {[{v:d,l:"DAYS"},{v:h,l:"HRS"},{v:m,l:"MIN"},{v:s,l:"SEC"}].map(({v,l},i) => (
          <div key={l} className={`text-center px-4 py-3 ${i>0?'border-l border-white/10':''}`} style={{ background:i===3?"rgba(220,38,38,0.15)":"rgba(255,255,255,0.04)" }}>
            <div className={`font-black text-2xl leading-none ${i===3?"text-red-400":"text-white"}`}>{pad(v)}</div>
            <div className="text-white/30 text-[8px] mt-1">{l}</div>
          </div>
        ))}
      </div>
    </div>
  </Row>
);

// 26 — Circular Rings (color variant)
const T26 = ({ d, h, m, s }) => (
  <Row bg="#050508">
    <div className="flex gap-3">
      {[{v:d,l:"ימים",c:"#14b8a6"},{v:h,l:"שעות",c:"#3b82f6"},{v:m,l:"דקות",c:"#a855f7"},{v:s,l:"שניות",c:"#f59e0b"}].map(({v,l,c}) => (
        <div key={l} className="text-center">
          <div className="relative w-16 h-16 flex items-center justify-center rounded-full" style={{ background:`${c}15`, border:`2px solid ${c}33` }}>
            <span className="font-bold text-xl" style={{ color:c }}>{pad(v)}</span>
          </div>
          <div className="text-white/30 text-[9px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 27 — Watch Bezel
const T27 = ({ d, h, m, s }) => (
  <Row bg="#030303">
    <div className="relative w-52 h-52 rounded-full flex items-center justify-center" style={{ background:"linear-gradient(145deg,#1a1a1a,#0a0a0a)", border:"4px solid #2a2a2a", boxShadow:"0 0 0 2px #111,0 0 0 4px #222,0 8px 30px rgba(0,0,0,0.8)" }}>
      <div className="text-center">
        <div className="text-white/30 text-[9px] tracking-widest uppercase mb-2">World Cup</div>
        <div className="flex items-baseline gap-1">
          <span className="text-white font-light text-3xl">{pad(d)}</span>
          <span className="text-white/30 text-sm">d</span>
          <span className="text-white font-light text-3xl">{pad(h)}</span>
          <span className="text-white/30 text-sm">h</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-white font-light text-3xl">{pad(m)}</span>
          <span className="text-white/30 text-sm">m</span>
          <span className="text-white font-light text-3xl">{pad(s)}</span>
          <span className="text-white/30 text-sm">s</span>
        </div>
      </div>
    </div>
  </Row>
);

// 28 — Aurora Glass
const T28 = ({ d, h, m, s }) => (
  <Row bg="#050509" style={{ position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 20% 60%,rgba(30,80,200,0.1) 0%,transparent 50%),radial-gradient(ellipse 60% 40% at 80% 30%,rgba(120,40,200,0.08) 0%,transparent 50%)", pointerEvents:"none" }} />
    <div className="flex gap-3 relative z-10">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(150,100,255,0.2)", backdropFilter:"blur(16px)" }}>
          <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-purple-300/40 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 29 — Ice Crystal
const T29 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#050d14,#060f1c)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(186,230,253,0.06)", border:"1px solid rgba(186,230,253,0.15)", backdropFilter:"blur(16px)" }}>
          <div className="text-sky-200 font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-sky-300/35 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 30 — Depth Layers
const T30 = ({ d, h, m, s }) => (
  <Row bg="#060606">
    <div className="flex gap-4">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center relative" style={{ paddingBottom:6 }}>
          <div className="absolute inset-x-0 rounded-xl" style={{ bottom:0, top:6, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)" }} />
          <div className="absolute inset-x-0 rounded-xl" style={{ bottom:2, top:3, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }} />
          <div className="relative px-4 py-3 rounded-xl min-w-[58px]" style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)" }}>
            <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
            <div className="text-white/30 text-[10px] mt-1.5">{l}</div>
          </div>
        </div>
      ))}
    </div>
  </Row>
);

// 31 — Terminal
const T31 = ({ d, h, m, s }) => (
  <Row bg="#020602">
    <div className="font-mono text-sm" style={{ color:"#00ff41" }}>
      <div className="opacity-50 text-xs mb-2">$ countdown --wc2026</div>
      <div className="space-y-1">
        {[{k:"days   ",v:d},{k:"hours  ",v:h},{k:"minutes",v:m},{k:"seconds",v:s}].map(({k,v}) => (
          <div key={k} className="flex gap-3">
            <span className="opacity-50">{k}</span>
            <span className="opacity-30">=</span>
            <span className="font-bold text-lg">{pad(v)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 opacity-30 text-xs animate-pulse">█</div>
    </div>
  </Row>
);

// 32 — Rainbow Pills
const T32 = ({ d, h, m, s }) => (
  <Row bg="#040408">
    <div className="flex gap-2.5">
      {[
        {v:d,l:"ימים",  g:"linear-gradient(135deg,#667eea,#764ba2)"},
        {v:h,l:"שעות",  g:"linear-gradient(135deg,#f093fb,#f5576c)"},
        {v:m,l:"דקות",  g:"linear-gradient(135deg,#4facfe,#00f2fe)"},
        {v:s,l:"שניות", g:"linear-gradient(135deg,#43e97b,#38f9d7)"},
      ].map(({v,l,g}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:g }}>
          <div className="text-white font-black text-3xl leading-none">{pad(v)}</div>
          <div className="text-white/70 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 33 — Dot Separator
const T33 = ({ d, h, m, s }) => (
  <Row bg="#050505">
    <div className="flex items-center gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => (
        <React.Fragment key={l}>
          <div className="text-center">
            <div className="text-white font-semibold text-3xl leading-none tracking-tight">{pad(v)}</div>
            <div className="text-white/20 text-[9px] mt-1">{l}</div>
          </div>
          {i < 3 && <div className="flex flex-col gap-1.5 pb-4"><div className="w-1 h-1 rounded-full bg-white/20"/><div className="w-1 h-1 rounded-full bg-white/20"/></div>}
        </React.Fragment>
      ))}
    </div>
  </Row>
);

// 34 — Noise Glass
const T34 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#0a0a14,#0f0f1c)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(255,255,255,0.055)", border:"1px solid rgba(255,255,255,0.09)", backdropFilter:"blur(24px) saturate(1.6)" }}>
          <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-white/30 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 35 — Brand Stamp
const T35 = ({ d, h, m, s }) => (
  <Row bg="#040404">
    <div className="border-2 border-white/15 rounded-2xl overflow-hidden">
      <div className="flex divide-x divide-white/10">
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center px-6 py-5">
            <div className="text-white font-black text-3xl leading-none tracking-tight">{pad(v)}</div>
            <div className="text-white/25 text-[10px] mt-2 tracking-widest uppercase">{l}</div>
          </div>
        ))}
      </div>
      <div className="h-0.5 w-full" style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }} />
    </div>
  </Row>
);

// 36 — Space Stars
const T36 = ({ d, h, m, s }) => {
  const stars = Array.from({length:20},(_,i)=>({x:(i*137.5)%100,y:(i*97.3)%100,size:i%3===0?2:1}));
  return (
    <Row bg="#02020a" style={{ position:"relative", overflow:"hidden" }}>
      {stars.map((st,i) => <div key={i} style={{ position:"absolute", left:`${st.x}%`, top:`${st.y}%`, width:st.size, height:st.size, borderRadius:"50%", background:"white", opacity:0.15, pointerEvents:"none" }} />)}
      <div className="flex gap-3 relative z-10">
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(12px)" }}>
            <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
            <div className="text-white/25 text-[10px] mt-1.5">{l}</div>
          </div>
        ))}
      </div>
    </Row>
  );
};

// 37 — Ambient Bokeh
const T37 = ({ d, h, m, s }) => (
  <Row bg="#04050a" style={{ position:"relative", overflow:"hidden" }}>
    {[{size:120,x:"15%",y:"30%",c:"rgba(56,120,255,0.08)"},{size:100,x:"80%",y:"20%",c:"rgba(80,200,120,0.07)"},{size:110,x:"70%",y:"75%",c:"rgba(120,60,200,0.07)"}].map((b,i)=>(
      <div key={i} style={{ position:"absolute", width:b.size, height:b.size, borderRadius:"50%", background:`radial-gradient(${b.c} 0%,transparent 70%)`, left:b.x, top:b.y, transform:"translate(-50%,-50%)", pointerEvents:"none" }} />
    ))}
    <div className="flex gap-3 relative z-10">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(255,255,255,0.055)", border:"1px solid rgba(255,255,255,0.09)", backdropFilter:"blur(24px)" }}>
          <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-white/30 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 38 — Sports HUD
const T38 = ({ d, h, m, s }) => (
  <Row bg="#080c10" style={{ position:"relative" }}>
    {[[true,false,true,false],[true,false,false,true],[false,true,true,false],[false,true,false,true]].map(([t,r,b,l],i)=>(
      <div key={i} style={{ position:"absolute", width:12, height:12, top:i<2?8:undefined, bottom:i>=2?8:undefined, left:i%2===0?8:undefined, right:i%2!==0?8:undefined, borderTop:t?"1px solid rgba(255,255,255,0.25)":undefined, borderRight:r?"1px solid rgba(255,255,255,0.25)":undefined, borderBottom:b?"1px solid rgba(255,255,255,0.25)":undefined, borderLeft:l?"1px solid rgba(255,255,255,0.25)":undefined }} />
    ))}
    <div className="flex gap-2 relative z-10">
      {[{v:d,l:"DAYS"},{v:h,l:"HRS"},{v:m,l:"MIN"},{v:s,l:"SEC"}].map(({v,l}) => (
        <div key={l} className="text-center px-3 py-2.5 min-w-[52px]" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px" }}>
          <div className="text-white font-bold text-2xl leading-none font-mono">{pad(v)}</div>
          <div className="text-white/25 text-[8px] mt-1.5 tracking-widest">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 39 — Chalkboard
const T39 = ({ d, h, m, s }) => (
  <Row style={{ background:"#1f3b1f" }}>
    <div className="text-center">
      <div className="text-white/40 text-[9px] mb-3" style={{ fontFamily:"cursive" }}>עד לפתיחת המונדיאל</div>
      <div className="flex items-baseline gap-3">
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => (
          <React.Fragment key={l}>
            <div className="text-center">
              <div className="text-white font-bold text-4xl leading-none" style={{ fontFamily:"cursive" }}>{pad(v)}</div>
              <div className="text-white/40 text-[9px] mt-1" style={{ fontFamily:"cursive" }}>{l}</div>
            </div>
            {i < 3 && <div className="text-white/20 text-xl font-bold pb-3">:</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  </Row>
);

// 40 — Trophy Frame
const T40 = ({ d, h, m, s }) => (
  <Row bg="#080600">
    <div className="text-center">
      <img src="/trophy.png" alt="" style={{ width:32, margin:"0 auto 10px", opacity:0.8 }} />
      <div className="flex gap-2">
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
          <div key={l} className="text-center px-3 py-2.5 rounded-xl min-w-[52px]" style={{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)" }}>
            <div className="text-amber-300 font-bold text-2xl leading-none">{pad(v)}</div>
            <div className="text-amber-400/35 text-[9px] mt-1">{l}</div>
          </div>
        ))}
      </div>
    </div>
  </Row>
);

// 41 — Mono Large (days big)
const T41 = ({ d, h, m, s }) => (
  <Row bg="#000">
    <div>
      <div className="text-white/15 text-[9px] tracking-[0.4em] uppercase mb-2">WC2026</div>
      <div className="flex items-end gap-3">
        <div>
          <div className="text-white font-black leading-none" style={{ fontSize:"4.5rem", letterSpacing:"-0.04em" }}>{pad(d)}</div>
          <div className="text-white/20 text-xs mt-0.5">DAYS</div>
        </div>
        <div className="text-white/10 text-3xl font-thin pb-6">·</div>
        <div className="pb-1 text-white/60 font-bold text-2xl leading-none">{pad(h)}<span className="text-white/20 text-sm font-light ml-0.5">h</span> {pad(m)}<span className="text-white/20 text-sm font-light ml-0.5">m</span> {pad(s)}<span className="text-white/20 text-sm font-light ml-0.5">s</span></div>
      </div>
    </div>
  </Row>
);

// 42 — Stacked Gradient
const T42 = ({ d, h, m, s }) => (
  <Row bg="#040408">
    <div className="space-y-1.5 w-48">
      {[
        {v:d,l:"ימים",  g:"linear-gradient(90deg,rgba(20,184,166,0.2),rgba(20,184,166,0.04))"},
        {v:h,l:"שעות",  g:"linear-gradient(90deg,rgba(59,130,246,0.2),rgba(59,130,246,0.04))"},
        {v:m,l:"דקות",  g:"linear-gradient(90deg,rgba(168,85,247,0.2),rgba(168,85,247,0.04))"},
        {v:s,l:"שניות", g:"linear-gradient(90deg,rgba(245,158,11,0.2),rgba(245,158,11,0.04))"},
      ].map(({v,l,g}) => (
        <div key={l} className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background:g, border:"1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-white/40 text-xs">{l}</span>
          <span className="text-white font-bold text-2xl font-mono">{pad(v)}</span>
        </div>
      ))}
    </div>
  </Row>
);

// 43 — Top Accent Card
const T43 = ({ d, h, m, s }) => {
  const accents = ["#14b8a6","#3b82f6","#a855f7","#f59e0b"];
  return (
    <Row bg="#060606">
      <div className="flex gap-3">
        {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l},i) => (
          <div key={l} className="text-center rounded-xl overflow-hidden min-w-[58px]" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <div className="h-0.5" style={{ background:accents[i] }} />
            <div className="px-4 py-3">
              <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
              <div className="text-white/25 text-[10px] mt-1.5">{l}</div>
            </div>
          </div>
        ))}
      </div>
    </Row>
  );
};

// 44 — Frosted Amber
const T44 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#0d0900,#120c00)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.15)", backdropFilter:"blur(16px)" }}>
          <div className="text-amber-200 font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-amber-400/35 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 45 — Split Accent Line
const T45 = ({ d, h, m, s }) => (
  <Row bg="#070707">
    <div className="flex gap-6">
      {[{v:d,l:"ימים",c:"#14b8a6"},{v:h,l:"שעות",c:"#3b82f6"},{v:m,l:"דקות",c:"#a855f7"},{v:s,l:"שניות",c:"#f59e0b"}].map(({v,l,c}) => (
        <div key={l} className="text-center">
          <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="h-0.5 rounded-full mt-1.5 mb-1.5" style={{ background:c }} />
          <div className="text-white/30 text-[10px]">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 46 — Glassmorphism Rose
const T46 = ({ d, h, m, s }) => (
  <Row style={{ background:"linear-gradient(135deg,#0d0206,#14030a)" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px]" style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.2)", backdropFilter:"blur(16px)" }}>
          <div className="text-rose-300 font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-rose-400/35 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 47 — Jersey Number
const T47 = ({ d, h, m, s }) => (
  <Row bg="#080808">
    <div className="flex gap-4">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center">
          <div className="text-white font-black leading-none" style={{ fontSize:"3rem", letterSpacing:"-0.03em", WebkitTextStroke:"1px rgba(255,255,255,0.1)" }}>{pad(v)}</div>
          <div className="text-white/25 text-[9px] mt-0.5 tracking-widest uppercase">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 48 — Stadium Lights
const T48 = ({ d, h, m, s }) => (
  <Row bg="#040a04" style={{ position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:1, height:80, background:"rgba(255,255,180,0.05)", boxShadow:"0 0 60px 30px rgba(255,255,180,0.05)", pointerEvents:"none" }} />
    <div className="flex gap-3 relative z-10">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-xl min-w-[58px]" style={{ background:"rgba(0,0,0,0.6)", border:"1px solid rgba(255,255,255,0.07)", backdropFilter:"blur(12px)" }}>
          <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
          <div className="text-white/25 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 49 — Minimal White Apple
const T49 = ({ d, h, m, s }) => (
  <Row style={{ background:"#f5f5f7" }}>
    <div className="flex gap-3">
      {[{v:d,l:"ימים"},{v:h,l:"שעות"},{v:m,l:"דקות"},{v:s,l:"שניות"}].map(({v,l}) => (
        <div key={l} className="text-center px-4 py-3 rounded-2xl min-w-[58px] bg-white shadow-sm" style={{ border:"1px solid rgba(0,0,0,0.06)" }}>
          <div className="text-gray-900 font-semibold text-3xl leading-none">{pad(v)}</div>
          <div className="text-gray-400 text-[10px] mt-1.5">{l}</div>
        </div>
      ))}
    </div>
  </Row>
);

// 50 — Gradient Border
const T50 = ({ d, h, m, s }) => (
  <Row bg="#050505">
    <div className="flex gap-3">
      {[
        {v:d,l:"ימים",  g:"linear-gradient(135deg,#14b8a6,#3b82f6)"},
        {v:h,l:"שעות",  g:"linear-gradient(135deg,#3b82f6,#a855f7)"},
        {v:m,l:"דקות",  g:"linear-gradient(135deg,#a855f7,#f59e0b)"},
        {v:s,l:"שניות", g:"linear-gradient(135deg,#f59e0b,#14b8a6)"},
      ].map(({v,l,g}) => (
        <div key={l} className="relative text-center min-w-[58px]" style={{ padding:"1.5px", borderRadius:"1rem", background:g }}>
          <div className="px-4 py-3 rounded-[calc(1rem-1.5px)]" style={{ background:"#0a0a0a" }}>
            <div className="text-white font-bold text-3xl leading-none">{pad(v)}</div>
            <div className="text-white/30 text-[10px] mt-1.5">{l}</div>
          </div>
        </div>
      ))}
    </div>
  </Row>
);

// ════════════════════════════════════════════════════════════════════════════════
const RENDERS = [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49,T50];

const VARIANTS = [
  { id:1,  name:"Glassmorphism Teal",  desc:"הסגנון הנוכחי"                 },
  { id:2,  name:"Dark Obsidian",       desc:"שחור עמוק, כרטיסים עדינים"     },
  { id:3,  name:"Neon Purple",         desc:"ניאון סגול עם זוהר"             },
  { id:4,  name:"Gold Premium",        desc:"זהב על שחור"                   },
  { id:5,  name:"LCD Digital",         desc:"LED ירוקה על שחור"             },
  { id:6,  name:"Frosted Blue",        desc:"זכוכית כחולה-פלדה"             },
  { id:7,  name:"Crimson",             desc:"כרטיסי אדום אינטנסיבי"         },
  { id:8,  name:"Minimal Colon",       desc:"נקודותיים בלבד, נקי מאוד"      },
  { id:9,  name:"Carbon Grid",         desc:"גריד פחם, קווים חדים"          },
  { id:10, name:"Split Flap",          desc:"לוח שדה תעופה"                 },
  { id:11, name:"Circular Rings",      desc:"עיגולי progress"               },
  { id:12, name:"Progress Bars",       desc:"פסי התקדמות אופקיים"           },
  { id:13, name:"Bold Editorial",      desc:"מספרים ענקיים, מינימל"         },
  { id:14, name:"Pill Connected",      desc:"פיל מחובר עם מחיצות"           },
  { id:15, name:"Underline Only",      desc:"קו תחתון בלבד"                 },
  { id:16, name:"Frosted White",       desc:"לייט מוד זכוכית לבנה"          },
  { id:17, name:"Navy Pro",            desc:"כחול כהה מקצועי"               },
  { id:18, name:"Emerald Pitch",       desc:"ירוק מגרש, זכוכית"             },
  { id:19, name:"Hologram Cyan",       desc:"הולוגרם ציאן"                  },
  { id:20, name:"Fire Gradient",       desc:"גרדיאנט אש כתום-צהוב"          },
  { id:21, name:"Pixel 8-bit",         desc:"רטרו ארקייד"                   },
  { id:22, name:"Vertical Stack",      desc:"ערימה אנכית"                   },
  { id:23, name:"Newspaper",           desc:"עיתון שחור-לבן"                },
  { id:24, name:"Retro Scoreboard",    desc:"לוח תוצאות צהוב"              },
  { id:25, name:"TV Broadcast",        desc:"שידור LIVE"                    },
  { id:26, name:"Colored Circles",     desc:"עיגולים צבעוניים"              },
  { id:27, name:"Watch Bezel",         desc:"פנים שעון עגול"                },
  { id:28, name:"Aurora Glass",        desc:"אורורה כחול-סגול"              },
  { id:29, name:"Ice Crystal",         desc:"קרח ארקטי"                     },
  { id:30, name:"Depth Layers",        desc:"שכבות עומק 3D"                 },
  { id:31, name:"Terminal",            desc:"שורת פקודה"                    },
  { id:32, name:"Rainbow Pills",       desc:"4 גרדיאנטים צבעוניים"          },
  { id:33, name:"Dot Separator",       desc:"נקודות כפולות כמפריד"          },
  { id:34, name:"Noise Glass",         desc:"זכוכית עם grain עדין"          },
  { id:35, name:"Brand Stamp",         desc:"חותמת מותג"                    },
  { id:36, name:"Space Stars",         desc:"כוכבים ברקע"                   },
  { id:37, name:"Ambient Bokeh",       desc:"עיגולי בוקה, זכוכית"           },
  { id:38, name:"Sports HUD",          desc:"פינות HUD"                     },
  { id:39, name:"Chalkboard",          desc:"לוח טקטי"                      },
  { id:40, name:"Trophy Frame",        desc:"גביע מעל הטיימר"               },
  { id:41, name:"Days Hero",           desc:"ימים ענקיים + שאר קטן"         },
  { id:42, name:"Stacked Gradient",    desc:"שורות עם גרדיאנט"              },
  { id:43, name:"Top Accent",          desc:"קו עליון צבעוני"               },
  { id:44, name:"Frosted Amber",       desc:"זכוכית ענבר חם"                },
  { id:45, name:"Split Line",          desc:"קו צבעוני תחת כל מספר"         },
  { id:46, name:"Glass Rose",          desc:"זכוכית ורוד-אדום"              },
  { id:47, name:"Jersey Number",       desc:"מספרי גב חולצה"                },
  { id:48, name:"Stadium Lights",      desc:"ספוטלייט עדין מלמטה"           },
  { id:49, name:"Minimal White",       desc:"לבן Apple style"               },
  { id:50, name:"Gradient Border",     desc:"גבול גרדיאנט לכל כרטיס"       },
];

// ─── Preview card ─────────────────────────────────────────────────────────────
const PreviewCard = ({ variant, isSelected, onSelect, onExpand }) => {
  const Render = RENDERS[variant.id - 1];
  return (
    <motion.div layout initial={{ opacity:0 }} animate={{ opacity:1 }} className="group relative">
      <div onClick={onSelect} className="relative rounded-xl overflow-hidden cursor-pointer"
        style={{ border: isSelected ? "1.5px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ height:80, overflow:"hidden", position:"relative" }}>
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
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-white/70 text-[11px] font-medium leading-tight truncate">{variant.id}. {variant.name}</p>
        <p className="text-white/25 text-[9px] mt-0.5 leading-tight truncate">{variant.desc}</p>
      </div>
    </motion.div>
  );
};

// ─── Full preview (live) ──────────────────────────────────────────────────────
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
            <span className="text-white font-semibold text-sm">{variant.name}</span>
            <span className="text-white/35 text-xs ml-2">{variant.desc}</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1.5 rounded-lg transition-colors" style={{ background:"rgba(255,255,255,0.05)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.08)" }}>
          <Render {...time} />
        </div>
        <p className="text-white/20 text-[10px] text-center mt-2">ספירה לאחור חיה — WC2026</p>
      </motion.div>
    </motion.div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminTimerDemo() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Timer Styles — 50 עיצובים</h2>
          <p className="text-slate-500 text-sm mt-0.5">לחץ להגדלה לתצוגה עם ספירה חיה</p>
        </div>
        {selected && (
          <div className="text-[12px] font-medium px-3 py-1.5 rounded-lg text-white/60" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
            ✓ {VARIANTS[selected-1]?.name}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {VARIANTS.map(v => (
          <PreviewCard key={v.id} variant={v}
            isSelected={selected === v.id}
            onSelect={() => setSelected(p => p === v.id ? null : v.id)}
            onExpand={() => setExpanded(v.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {expanded !== null && (
          <FullPreview variant={VARIANTS[expanded-1]} onClose={() => setExpanded(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
