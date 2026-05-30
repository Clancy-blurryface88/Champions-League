import React, { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const MATCHES = [
  { id: 1, a: { code: "br", name: "ברזיל" },    b: { code: "ar", name: "ארגנטינה" } },
  { id: 2, a: { code: "fr", name: "צרפת" },      b: { code: "es", name: "ספרד" } },
  { id: 3, a: { code: "de", name: "גרמניה" },    b: { code: "pt", name: "פורטוגל" } },
  { id: 4, a: { code: "us", name: 'ארה"ב' },     b: { code: "mx", name: "מקסיקו" } },
  { id: 5, a: { code: "nl", name: "הולנד" },     b: { code: "ma", name: "מרוקו" } },
  { id: 6, a: { code: "jp", name: "יפן" },       b: { code: "ca", name: "קנדה" } },
];

const Flag = ({ code, name, size = 36 }) => (
  <span
    className="fi fis rounded-md flex-shrink-0 shadow-md"
    style={{ width: size, height: size, fontSize: size, display: "inline-block",
             backgroundSize: "cover", backgroundPosition: "center" }}
    title={name}
  >
    <span className={`fi fi-${code}`} style={{ display: "none" }} />
  </span>
);

const Row = ({ m, children }) => (
  <div className="flex items-center bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3">
    {children}
  </div>
);

const MatchContent = ({ m }) => (
  <>
    <div className="flex items-center gap-2 flex-1">
      <Flag code={m.a.code} name={m.a.name} />
      <span className="text-white text-sm font-semibold">{m.a.name}</span>
    </div>
    <span className="text-slate-600 text-xs font-bold mx-3">VS</span>
    <div className="flex items-center gap-2 flex-1 justify-end">
      <span className="text-white text-sm font-semibold">{m.b.name}</span>
      <Flag code={m.b.code} name={m.b.name} />
    </div>
  </>
);

// ── 1. Dealt Cards ─────────────────────────────────────────────────────────────
function DealtCards() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ opacity: 0, y: -80, scale: 0.6, rotate: (i % 2 === 0 ? -1 : 1) * (8 + i * 2) }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.13, type: "spring", stiffness: 220, damping: 22 }}>
          <Row m={m}><MatchContent m={m} /></Row>
        </motion.div>
      ))}
    </div>
  );
}

// ── 2. Scatter & Snap ──────────────────────────────────────────────────────────
function ScatterSnap() {
  const [offsets] = useState(() =>
    MATCHES.map(() => ({
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 300,
      rotate: (Math.random() - 0.5) * 50,
      scale: 0.2 + Math.random() * 0.3,
    }))
  );
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ opacity: 0, x: offsets[i].x, y: offsets[i].y, rotate: offsets[i].rotate, scale: offsets[i].scale }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          transition={{ delay: i * 0.07, type: "spring", stiffness: 130, damping: 16 }}>
          <Row m={m}><MatchContent m={m} /></Row>
        </motion.div>
      ))}
    </div>
  );
}

// ── 3. Spotlight Sweep ─────────────────────────────────────────────────────────
function SpotlightSweep() {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="space-y-2">
        {MATCHES.map((m, i) => (
          <motion.div key={m.id}
            initial={{ opacity: 0, filter: "brightness(0)" }}
            animate={{ opacity: 1, filter: "brightness(1)" }}
            transition={{ delay: i * 0.32, duration: 0.5, ease: "easeOut" }}>
            <Row m={m}><MatchContent m={m} /></Row>
          </motion.div>
        ))}
      </div>
      {/* Spotlight beam */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: 80,
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06), transparent)",
          top: 0,
        }}
        initial={{ top: -80 }}
        animate={{ top: "120%" }}
        transition={{ duration: 2.2, ease: "linear" }}
      />
    </div>
  );
}

// ── 4. Domino Cascade ─────────────────────────────────────────────────────────
function DominoCascade() {
  return (
    <div className="space-y-2" style={{ perspective: 1200 }}>
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ delay: i * 0.14, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: "top center" }}>
          <Row m={m}><MatchContent m={m} /></Row>
        </motion.div>
      ))}
    </div>
  );
}

// ── 5. Stadium Entrance ────────────────────────────────────────────────────────
function StadiumEntrance() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => {
        const base = i * 0.18;
        return (
          <motion.div key={m.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: base }}>
            <Row m={m}>
              <motion.div className="flex items-center gap-2 flex-1"
                initial={{ x: -70, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: base + 0.05, type: "spring", stiffness: 200, damping: 22 }}>
                <Flag code={m.a.code} name={m.a.name} />
                <span className="text-white text-sm font-semibold">{m.a.name}</span>
              </motion.div>

              <motion.span className="text-slate-600 text-xs font-bold mx-3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: base + 0.3, type: "spring", stiffness: 300 }}>
                VS
              </motion.span>

              <motion.div className="flex items-center gap-2 flex-1 justify-end"
                initial={{ x: 70, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: base + 0.05, type: "spring", stiffness: 200, damping: 22 }}>
                <span className="text-white text-sm font-semibold">{m.b.name}</span>
                <Flag code={m.b.code} name={m.b.name} />
              </motion.div>
            </Row>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── 6. Pixel Build ────────────────────────────────────────────────────────────
function PixelBuild() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ filter: "blur(18px)", scale: 0.82, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.17, duration: 0.75, ease: "easeOut" }}>
          <Row m={m}><MatchContent m={m} /></Row>
        </motion.div>
      ))}
    </div>
  );
}

// ── 7. Countdown Flash ────────────────────────────────────────────────────────
function CountdownFlash() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <div key={m.id} className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.21, duration: 0.05 }}>
            <Row m={m}><MatchContent m={m} /></Row>
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ background: "rgba(255,255,255,0.95)" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: i * 0.21, duration: 0.5, ease: "easeOut" }}
          />
        </div>
      ))}
    </div>
  );
}

// ── 8. Bounce Drop ────────────────────────────────────────────────────────────
function BounceDrop() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ y: -140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 380, damping: 18, mass: 0.9 }}>
          <Row m={m}><MatchContent m={m} /></Row>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const DEMOS = [
  { id: "dealt",    label: "Dealt Cards",     emoji: "🃏", Component: DealtCards    },
  { id: "scatter",  label: "Scatter & Snap",  emoji: "💥", Component: ScatterSnap  },
  { id: "spotlight",label: "Spotlight Sweep", emoji: "🔦", Component: SpotlightSweep },
  { id: "domino",   label: "Domino",          emoji: "🁣",  Component: DominoCascade },
  { id: "stadium",  label: "Stadium Entrance",emoji: "🏟️", Component: StadiumEntrance },
  { id: "pixel",    label: "Pixel Build",     emoji: "🔲", Component: PixelBuild    },
  { id: "flash",    label: "Flash",           emoji: "⚡", Component: CountdownFlash },
  { id: "bounce",   label: "Bounce Drop",     emoji: "⚽", Component: BounceDrop    },
];

export default function AdminFlagRevealDemo() {
  const [active, setActive] = useState("dealt");
  const [replayKey, setReplayKey] = useState(0);
  const current = DEMOS.find(d => d.id === active);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">דמו — אנימציות חשיפת דגלים</h2>
        <p className="text-slate-500 text-sm mt-1">בחר אנימציה ולחץ Replay לצפייה חוזרת</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {DEMOS.map(d => (
          <button key={d.id} onClick={() => { setActive(d.id); setReplayKey(k => k + 1); }}
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
      <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 overflow-hidden">
        <div key={`${active}-${replayKey}`}>
          <current.Component />
        </div>
      </div>

      {/* Replay */}
      <div className="flex justify-center">
        <button
          onClick={() => setReplayKey(k => k + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white text-sm transition-all">
          <RotateCcw className="w-4 h-4" />
          Replay
        </button>
      </div>
    </div>
  );
}
