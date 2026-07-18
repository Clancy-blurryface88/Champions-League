import React from "react";

// Demo-only gallery of visual directions for the "Final Round" card/banner
// that replaces the RoundsMarquee item once only the Final remains active.
// Nothing here is wired to real data — pure exploration for picking a direction.

const ROUND = {
  he: "גמר",
  en: "FINAL",
  date: "19.07.2026",
  venue: "MetLife Stadium · New York",
};

const SharedStyles = () => (
  <style>{`
    @keyframes fd-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
    @keyframes fd-shine-sweep { 0% { transform: translateX(-160%) skewX(-20deg); } 100% { transform: translateX(260%) skewX(-20deg); } }
    @keyframes fd-ring { 0% { transform: scale(0.75); opacity: .9; } 100% { transform: scale(2.4); opacity: 0; } }
    @keyframes fd-twinkle { 0%, 100% { opacity: .25; transform: scale(.7); } 50% { opacity: 1; transform: scale(1.15); } }
    @keyframes fd-confetti { 0% { transform: translateY(-24px) rotate(0deg); opacity: 0; } 12% { opacity: 1; } 100% { transform: translateY(150px) rotate(400deg); opacity: 0; } }
    @keyframes fd-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
    @keyframes fd-glow { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
    @keyframes fd-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(220%); } }
    @keyframes fd-flicker { 0%, 19%, 21%, 23%, 56%, 100% { opacity: 1; } 20%, 22%, 55% { opacity: .3; } }
    @keyframes fd-spin { to { transform: rotate(360deg); } }
    @keyframes fd-firework { 0% { transform: scale(0); opacity: 1; } 70% { opacity: .5; } 100% { transform: scale(3.2); opacity: 0; } }
    @keyframes fd-holo { 0%, 100% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(50deg); } }
    @keyframes fd-glitch { 0%, 90%, 100% { transform: translate(0,0); opacity: 1; } 91% { transform: translate(-2px, 1px); opacity: .8; } 93% { transform: translate(2px, -1px); } 95% { transform: translate(-1px, 0); } }
    @keyframes fd-drift { 0% { background-position: 0 0; } 100% { background-position: 200px 0; } }
    @keyframes fd-pop { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
    @keyframes fd-belt-shine { 0% { background-position: -100% 0; } 100% { background-position: 200% 0; } }
    .fd-font-display { font-family: 'Playfair Display', serif; }
    .fd-font-script { font-family: 'Cormorant Garamond', serif; }
    .fd-font-royal { font-family: 'Cinzel', serif; }
    .fd-font-pixel { font-family: 'Press Start 2P', monospace; }
    .fd-font-comic { font-family: 'Bangers', cursive; }
    .fd-font-tech { font-family: 'Orbitron', sans-serif; }
    .fd-font-impact { font-family: 'Bebas Neue', sans-serif; }
    .fd-font-geo { font-family: 'Syne', sans-serif; }
    .fd-font-sport { font-family: 'Russo One', sans-serif; }
    .fd-font-out { font-family: 'Outfit', sans-serif; }
    .fd-font-cond { font-family: 'Oswald', sans-serif; }
  `}</style>
);

function Frame({ n, title, tag, format, children }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-amber-400/90 tracking-wide">#{String(n).padStart(2, "0")}</span>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-[11px] text-slate-500">{tag}</p>
        </div>
      </div>
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-xl bg-[#040a14]"
        style={{ minHeight: format === "hero" ? 230 : 110, padding: format === "hero" ? 0 : 20 }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- HERO DESIGNS (1-13) ---------- */

const D1_MidnightSpotlight = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(245,197,24,0.18), transparent 60%), #050b16" }}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-full" style={{ background: "linear-gradient(180deg, rgba(245,197,24,0.35), transparent 75%)", clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)" }} />
    {[...Array(14)].map((_, i) => (
      <span key={i} className="absolute rounded-full bg-amber-200" style={{ width: 2, height: 2, top: `${10 + (i * 7) % 70}%`, left: `${5 + (i * 13) % 90}%`, animation: `fd-twinkle ${2 + (i % 3)}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
    ))}
    <img src="/trophy-marquee.png" className="relative h-14 w-auto object-contain mb-2 drop-shadow-[0_0_18px_rgba(245,197,24,0.6)]" />
    <h2 className="fd-font-display relative text-3xl font-black text-white tracking-wide">העימות הגדול</h2>
    <p className="fd-font-out relative text-amber-300/90 text-xs tracking-[0.3em] mt-1 uppercase">The Grand {ROUND.en}</p>
    <p className="fd-font-out relative text-slate-400 text-[11px] mt-2">{ROUND.date} · {ROUND.venue}</p>
  </div>
);

const D2_GoldFoilEmboss = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
    <div className="absolute inset-6 border border-amber-500/30 rounded-lg" />
    <span className="fd-font-royal text-amber-500/70 text-lg mb-1">✦ &nbsp; ✦ &nbsp; ✦</span>
    <h2
      className="fd-font-royal relative text-4xl font-black tracking-[0.15em]"
      style={{
        backgroundImage: "linear-gradient(100deg, #8a6a1e 20%, #f5e29a 40%, #f5c518 50%, #f5e29a 60%, #8a6a1e 80%)",
        backgroundSize: "220% 100%",
        WebkitBackgroundClip: "text",
        color: "transparent",
        animation: "fd-shimmer 4s linear infinite",
      }}
    >
      {ROUND.en}
    </h2>
    <p className="fd-font-script text-slate-400 italic mt-2 text-sm">{ROUND.date} — {ROUND.venue}</p>
  </div>
);

const D3_StadiumFloodlights = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#060c18] overflow-hidden">
    <div className="absolute -top-4 left-0 w-32 h-64" style={{ background: "linear-gradient(200deg, rgba(255,255,255,0.14), transparent 70%)" }} />
    <div className="absolute -top-4 right-0 w-32 h-64" style={{ background: "linear-gradient(340deg, rgba(255,255,255,0.14), transparent 70%)" }} />
    <div className="absolute -top-4 left-1/3 w-24 h-64" style={{ background: "linear-gradient(160deg, rgba(245,197,24,0.16), transparent 70%)" }} />
    <div className="absolute -top-4 right-1/3 w-24 h-64" style={{ background: "linear-gradient(200deg, rgba(245,197,24,0.16), transparent 70%)" }} />
    <span className="fd-font-sport relative text-amber-400 text-xs tracking-[0.4em] mb-2">KICK-OFF</span>
    <h2 className="fd-font-sport relative text-white text-4xl tracking-wide">{ROUND.en}</h2>
    <p className="relative text-slate-400 text-xs mt-2 fd-font-out">{ROUND.venue} · {ROUND.date}</p>
  </div>
);

const D4_ConfettiBurst = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ background: "linear-gradient(160deg,#0a1930,#040a14)" }}>
    {[...Array(24)].map((_, i) => (
      <span key={i} className="absolute top-0 rounded-sm" style={{ width: 5, height: 8, left: `${(i * 4.3) % 100}%`, background: i % 3 === 0 ? "#f5c518" : i % 3 === 1 ? "#ffffff" : "#e0413a", animation: `fd-confetti ${2.2 + (i % 5) * 0.3}s ease-in ${(i % 6) * 0.25}s infinite` }} />
    ))}
    <img src="/trophy-marquee.png" className="relative h-16 w-auto object-contain mb-2" style={{ animation: "fd-pop 1.8s ease-in-out infinite" }} />
    <h2 className="fd-font-geo relative text-4xl font-extrabold text-white">זהו זה — {ROUND.he}!</h2>
    <p className="fd-font-out relative text-amber-300 text-xs mt-2 tracking-widest uppercase">This is it — The Final</p>
  </div>
);

const D5_ChampionshipBelt = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-[#0b0704]">
    <div className="relative px-10 py-6 rounded-2xl" style={{ background: "linear-gradient(135deg,#3a2a0c,#1a1206)", border: "3px solid #f5c518", boxShadow: "0 0 0 1px #7a5a15 inset, 0 10px 30px rgba(0,0,0,0.6)" }}>
      <div className="absolute inset-1 rounded-xl border border-amber-300/30" />
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute top-0 bottom-0 w-1/3" style={{ background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.25), transparent)", animation: "fd-belt-shine 3.5s linear infinite" }} />
      </div>
      <p className="fd-font-royal relative text-center text-amber-400 text-[11px] tracking-[0.35em] mb-1">WORLD CHAMPIONSHIP</p>
      <h2 className="fd-font-royal relative text-center text-3xl font-black text-white tracking-wider">{ROUND.en}</h2>
      <p className="fd-font-out relative text-center text-slate-400 text-[11px] mt-2">{ROUND.date}</p>
    </div>
  </div>
);

const D6_AuroraMesh = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ background: "radial-gradient(circle at 15% 20%, rgba(245,197,24,0.35), transparent 45%), radial-gradient(circle at 85% 30%, rgba(66,133,244,0.3), transparent 45%), radial-gradient(circle at 50% 90%, rgba(120,60,220,0.25), transparent 50%), #050912" }}>
    <div className="px-8 py-6 rounded-3xl backdrop-blur-md" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}>
      <h2 className="fd-font-geo text-3xl font-bold text-white text-center">{ROUND.he} · {ROUND.en}</h2>
      <p className="fd-font-out text-center text-slate-300/80 text-xs mt-2">{ROUND.date} • {ROUND.venue}</p>
    </div>
  </div>
);

const D7_NewspaperHeadline = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ background: "#ece4d3" }}>
    <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 3px)" }} />
    <p className="relative fd-font-cond text-[10px] tracking-[0.4em] text-neutral-600 uppercase mb-1">Final Edition — World Cup 2026</p>
    <h2 className="relative fd-font-impact text-5xl text-neutral-900 tracking-wide" style={{ fontFamily: "'Bebas Neue', serif" }}>THE {ROUND.en}</h2>
    <div className="relative w-2/3 h-px bg-neutral-800 my-2" />
    <p className="relative fd-font-script italic text-neutral-700 text-sm">{ROUND.date} · {ROUND.venue}</p>
  </div>
);

const D8_NeonCircuit = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden">
    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(245,197,24,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.25) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
    <h2 className="fd-font-tech relative text-4xl font-black text-amber-400" style={{ textShadow: "0 0 12px rgba(245,197,24,0.8)", animation: "fd-glitch 5s infinite" }}>{ROUND.en}</h2>
    <p className="fd-font-tech relative text-cyan-300 text-[11px] tracking-[0.3em] mt-2">// {ROUND.date} :: {ROUND.venue}</p>
    <div className="absolute left-0 right-0 h-8 bg-amber-400/10" style={{ animation: "fd-scan 3s linear infinite" }} />
  </div>
);

const D9_BlackMarbleGold = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg,#0d0d0d,#1c1c1c 40%,#0a0a0a), repeating-linear-gradient(60deg, rgba(245,197,24,0.05) 0px, transparent 3px, transparent 40px)" }}>
    <span className="fd-font-royal text-amber-400 text-xs tracking-[0.4em] mb-2">✦ CHAMPIONSHIP FINAL ✦</span>
    <h2 className="fd-font-royal text-4xl font-bold" style={{ color: "#f0d998" }}>{ROUND.he}</h2>
    <p className="fd-font-out text-slate-400 text-xs mt-2">{ROUND.date} · {ROUND.venue}</p>
  </div>
);

const D10_FireworksNight = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg,#020510,#0a1428)" }}>
    {[...Array(9)].map((_, i) => (
      <span key={i} className="absolute rounded-full bg-white" style={{ width: 2, height: 2, top: `${8 + (i * 11) % 55}%`, left: `${(i * 17) % 95}%`, animation: `fd-twinkle ${1.6 + (i % 4) * 0.4}s ease-in-out infinite` }} />
    ))}
    {[["20%", "30%", "#f5c518"], ["75%", "20%", "#ffffff"], ["50%", "45%", "#f5c518"]].map(([top, left, color], i) => (
      <span key={i} className="absolute rounded-full" style={{ top, left, width: 6, height: 6, boxShadow: `0 0 0 1px ${color}`, border: `2px solid ${color}`, animation: `fd-firework 2.4s ease-out ${i * 0.7}s infinite` }} />
    ))}
    <img src="/trophy-marquee.png" className="relative h-14 w-auto object-contain mb-2" />
    <h2 className="fd-font-display relative text-3xl font-black text-white">{ROUND.en} NIGHT</h2>
    <p className="fd-font-out relative text-amber-300 text-xs mt-1">{ROUND.date} · {ROUND.venue}</p>
  </div>
);

const D11_VelvetRibbon = () => (
  <div className="relative w-full h-full flex items-center justify-center" style={{ background: "#0a0a0a" }}>
    <div className="relative px-14 py-5" style={{ background: "linear-gradient(180deg,#6b0f18,#3d060c)", boxShadow: "0 10px 24px rgba(0,0,0,0.5)" }}>
      <div className="absolute left-0 top-full w-0 h-0" style={{ borderTop: "14px solid #3d060c", borderLeft: "14px solid transparent" }} />
      <div className="absolute right-0 top-full w-0 h-0" style={{ borderTop: "14px solid #3d060c", borderRight: "14px solid transparent" }} />
      <div className="absolute inset-x-4 top-1.5 bottom-1.5 border border-amber-400/40 rounded-sm" />
      <h2 className="fd-font-royal relative text-2xl font-bold text-amber-300 text-center tracking-[0.2em]">{ROUND.en}</h2>
      <p className="fd-font-script relative text-amber-100/70 text-center text-xs mt-1 italic">{ROUND.date}</p>
    </div>
  </div>
);

const D12_HolographicFoil = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" style={{ background: "#050505" }}>
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(120deg,#ff9ad5,#a0e7ff,#fff3a0,#c2a0ff,#a0ffcf)", opacity: 0.22, animation: "fd-holo 6s ease-in-out infinite, fd-drift 8s linear infinite", backgroundSize: "300% 300%" }}
    />
    <h2 className="fd-font-geo relative text-4xl font-extrabold text-white tracking-wide" style={{ textShadow: "0 0 20px rgba(255,255,255,0.5)" }}>{ROUND.en}</h2>
    <p className="fd-font-out relative text-slate-300 text-xs mt-2 tracking-widest">{ROUND.date} · {ROUND.venue}</p>
  </div>
);

const D13_WaxSealDecree = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ background: "#e9dcc0" }}>
    <div className="absolute inset-3 border-2 border-double border-neutral-700/50" />
    <div className="relative w-11 h-11 rounded-full flex items-center justify-center mb-2" style={{ background: "radial-gradient(circle at 35% 30%, #b5342c, #7c1c17)", boxShadow: "0 3px 6px rgba(0,0,0,0.4)" }}>
      <span className="text-amber-200 text-sm fd-font-royal">WC</span>
    </div>
    <h2 className="fd-font-script relative text-3xl text-neutral-900" style={{ fontStyle: "italic" }}>The {ROUND.en}</h2>
    <p className="fd-font-royal relative text-neutral-600 text-[11px] tracking-[0.3em] mt-2">{ROUND.date} · {ROUND.venue}</p>
  </div>
);

/* ---------- BADGE DESIGNS (14-25) ---------- */

const Pill = ({ children, style, className = "" }) => (
  <div className={`relative h-16 w-64 rounded-2xl flex items-center justify-center gap-3 px-4 ${className}`} style={style}>
    {children}
  </div>
);

const D14_ShimmerGoldClassic = () => (
  <Pill style={{ background: "linear-gradient(135deg, rgba(8,22,42,0.8), rgba(3,10,20,0.8))", border: "1px solid rgba(245,197,24,0.35)" }}>
    <img src="/trophy-marquee.png" className="h-9 w-auto object-contain" />
    <h3 className="fd-font-out font-semibold text-base" style={{ backgroundImage: "linear-gradient(90deg,#f5c518,#fff,#f5c518)", backgroundSize: "220% 100%", WebkitBackgroundClip: "text", color: "transparent", animation: "fd-shimmer 3s linear infinite" }}>{ROUND.he}</h3>
  </Pill>
);

const D15_DiamondFacet = () => (
  <Pill style={{ background: "#0c1120", border: "1px solid rgba(180,200,255,0.25)", clipPath: "polygon(4% 0,96% 0,100% 50%,96% 100%,4% 100%,0 50%)" }}>
    <span className="fd-font-royal text-cyan-200 text-lg">◆</span>
    <h3 className="fd-font-royal text-white font-bold tracking-wide">{ROUND.en}</h3>
  </Pill>
);

const D16_NeonOutlinePulse = () => (
  <Pill style={{ background: "#050505", border: "2px solid #f5c518", boxShadow: "0 0 10px rgba(245,197,24,0.6), inset 0 0 8px rgba(245,197,24,0.3)", animation: "fd-glow 2s ease-in-out infinite" }}>
    <h3 className="fd-font-tech text-amber-400 font-bold tracking-[0.15em]">{ROUND.en}</h3>
  </Pill>
);

const D17_TicketStub = () => (
  <Pill
    className="items-stretch p-0"
    style={{ background: "#f3ebd8", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}
  >
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="fd-font-impact text-2xl text-neutral-900 tracking-wide">{ROUND.en}</h3>
      <p className="fd-font-cond text-[10px] text-neutral-600 tracking-widest">ADMIT ONE</p>
    </div>
    <div className="w-px border-l border-dashed border-neutral-500 my-2" />
    <div className="w-14 flex items-center justify-center">
      <span className="fd-font-impact text-neutral-800 text-xs" style={{ writingMode: "vertical-rl" }}>{ROUND.date}</span>
    </div>
  </Pill>
);

const D18_ChromeGlass = () => (
  <Pill className="overflow-hidden" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(6px)" }}>
    <div className="absolute top-0 left-0 w-1/3 h-full" style={{ background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent)", animation: "fd-belt-shine 3s linear infinite" }} />
    <h3 className="fd-font-geo relative text-white font-bold tracking-wide">{ROUND.en}</h3>
  </Pill>
);

const D19_PixelArcade = () => (
  <Pill style={{ background: "#1a1030", border: "3px solid #f5c518", boxShadow: "3px 3px 0 #7a4dbf", borderRadius: 4 }}>
    <span className="text-amber-300 fd-font-pixel" style={{ fontSize: 8 }}>🏆</span>
    <h3 className="fd-font-pixel text-amber-300" style={{ fontSize: 10, lineHeight: 1.4 }}>{ROUND.en}</h3>
  </Pill>
);

const D20_ComicStarburst = () => (
  <Pill
    style={{
      background: "#ffcf1c",
      clipPath: "polygon(50% 0%,61% 15%,80% 5%,82% 25%,100% 30%,90% 48%,100% 66%,82% 71%,80% 92%,61% 82%,50% 100%,39% 82%,20% 92%,18% 71%,0% 66%,10% 48%,0% 30%,18% 25%,20% 5%,39% 15%)",
    }}
  >
    <h3 className="fd-font-comic text-neutral-900 text-xl tracking-wide" style={{ WebkitTextStroke: "1px #000" }}>{ROUND.en}!</h3>
  </Pill>
);

const D21_LaurelMedallion = () => (
  <Pill style={{ background: "radial-gradient(circle,#1a2740,#0a1220)", border: "1px solid rgba(245,197,24,0.4)", borderRadius: 999 }}>
    <span className="text-amber-400 text-lg">🌿</span>
    <h3 className="fd-font-royal text-amber-200 font-semibold tracking-wider">{ROUND.he}</h3>
    <span className="text-amber-400 text-lg" style={{ transform: "scaleX(-1)" }}>🌿</span>
  </Pill>
);

const D22_LEDScoreboard = () => (
  <Pill style={{ background: "#020202", border: "2px solid #222" }}>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-red-500" style={{ animation: "fd-flicker 3s infinite" }} />
      <h3 className="fd-font-tech text-red-500 font-black tracking-[0.2em]" style={{ textShadow: "0 0 8px rgba(239,68,68,0.8)" }}>{ROUND.en}</h3>
    </div>
  </Pill>
);

const D23_OrigamiGold = () => (
  <Pill className="overflow-hidden" style={{ background: "#0b1120" }}>
    <div className="absolute -left-4 -top-4 w-16 h-16" style={{ background: "linear-gradient(135deg,#f5c518,#8a6a1e)", clipPath: "polygon(0 0,100% 0,0 100%)" }} />
    <div className="absolute -right-4 -bottom-4 w-16 h-16" style={{ background: "linear-gradient(315deg,#f5c518,#8a6a1e)", clipPath: "polygon(100% 100%,0 100%,100% 0)" }} />
    <h3 className="fd-font-geo relative text-white font-bold z-10">{ROUND.en}</h3>
  </Pill>
);

const D24_BoardingPass = () => (
  <Pill className="p-0 items-stretch" style={{ background: "#0e1a2b", border: "1px solid rgba(245,197,24,0.3)" }}>
    <div className="flex-1 flex flex-col justify-center pl-4">
      <p className="fd-font-tech text-[9px] text-slate-400 tracking-[0.2em]">BOARDING · {ROUND.date}</p>
      <h3 className="fd-font-tech text-amber-400 font-bold text-lg">{ROUND.en}</h3>
    </div>
    <div className="w-10 flex items-center justify-center border-l border-dashed border-slate-600">
      <span className="text-amber-400">✈</span>
    </div>
  </Pill>
);

const D25_RoyalCrest = () => (
  <Pill style={{ background: "linear-gradient(160deg,#0d1b33,#050a14)", border: "1px solid rgba(245,197,24,0.35)" }}>
    <span className="text-amber-400 text-lg">👑</span>
    <h3 className="fd-font-royal text-white font-bold tracking-[0.15em]">{ROUND.en}</h3>
  </Pill>
);

const DESIGNS = [
  { n: 1, title: "Midnight Spotlight", tag: "Hero · ספוט-לייט חצות", format: "hero", C: D1_MidnightSpotlight },
  { n: 2, title: "Gold Foil Emboss", tag: "Hero · חריטת זהב", format: "hero", C: D2_GoldFoilEmboss },
  { n: 3, title: "Stadium Floodlights", tag: "Hero · זרקורי אצטדיון", format: "hero", C: D3_StadiumFloodlights },
  { n: 4, title: "Confetti Burst", tag: "Hero · קונפטי חגיגי", format: "hero", C: D4_ConfettiBurst },
  { n: 5, title: "Championship Belt", tag: "Hero · חגורת אליפות", format: "hero", C: D5_ChampionshipBelt },
  { n: 6, title: "Aurora Mesh Glass", tag: "Hero · זכוכית וערפל צבעוני", format: "hero", C: D6_AuroraMesh },
  { n: 7, title: "Newspaper Headline", tag: "Hero · כותרת עיתון וינטג'", format: "hero", C: D7_NewspaperHeadline },
  { n: 8, title: "Neon Circuit", tag: "Hero · נאון / אי-ספורט", format: "hero", C: D8_NeonCircuit },
  { n: 9, title: "Black Marble & Gold", tag: "Hero · שיש שחור וזהב", format: "hero", C: D9_BlackMarbleGold },
  { n: 10, title: "Fireworks Night", tag: "Hero · זיקוקים בשמי לילה", format: "hero", C: D10_FireworksNight },
  { n: 11, title: "Velvet Ribbon Banner", tag: "Hero · סרט קטיפה מלכותי", format: "hero", C: D11_VelvetRibbon },
  { n: 12, title: "Holographic Foil", tag: "Hero · הולוגרמה מנצנצת", format: "hero", C: D12_HolographicFoil },
  { n: 13, title: "Wax Seal Decree", tag: "Hero · חותם שעווה מלכותי", format: "hero", C: D13_WaxSealDecree },
  { n: 14, title: "Shimmer Gold (משודרג)", tag: "Badge · העיצוב הקיים", format: "badge", C: D14_ShimmerGoldClassic },
  { n: 15, title: "Diamond Facet Plate", tag: "Badge · לוח יהלום", format: "badge", C: D15_DiamondFacet },
  { n: 16, title: "Neon Outline Pulse", tag: "Badge · מתאר נאון פועם", format: "badge", C: D16_NeonOutlinePulse },
  { n: 17, title: "Ticket Stub", tag: "Badge · כרטיס כניסה", format: "badge", C: D17_TicketStub },
  { n: 18, title: "Chrome Glass", tag: "Badge · זכוכית כרום", format: "badge", C: D18_ChromeGlass },
  { n: 19, title: "Pixel Arcade", tag: "Badge · פיקסל 8-ביט", format: "badge", C: D19_PixelArcade },
  { n: 20, title: "Comic Starburst", tag: "Badge · פיצוץ קומיקס", format: "badge", C: D20_ComicStarburst },
  { n: 21, title: "Laurel Medallion", tag: "Badge · מדליית זר דפנה", format: "badge", C: D21_LaurelMedallion },
  { n: 22, title: "LED Scoreboard", tag: "Badge · לוח תוצאות דיגיטלי", format: "badge", C: D22_LEDScoreboard },
  { n: 23, title: "Origami Gold", tag: "Badge · אוריגמי זהב", format: "badge", C: D23_OrigamiGold },
  { n: 24, title: "Boarding Pass", tag: "Badge · כרטיס עלייה למטוס", format: "badge", C: D24_BoardingPass },
  { n: 25, title: "Royal Crest", tag: "Badge · סמל מלכותי", format: "badge", C: D25_RoyalCrest },
];

export default function AdminFinalDesigns() {
  return (
    <div>
      <SharedStyles />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">🏆 עיצובים למחזור הגמר — גלריית דמו</h2>
        <p className="text-slate-400 text-sm mt-1">
          25 כיוונים ויזואליים לכרטיס/באנר של הגמר ב-Dashboard. זו גלריית השראה בלבד — לא מחובר לנתונים אמיתיים ולא משפיע על שום דבר בפרודקשן.
          תגיד לי מספרים שאהבת (אפשר כמה) ונבנה מהם את הגרסה הסופית.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DESIGNS.map(({ n, title, tag, format, C }) => (
          <Frame key={n} n={n} title={title} tag={tag} format={format}>
            <C />
          </Frame>
        ))}
      </div>
    </div>
  );
}
