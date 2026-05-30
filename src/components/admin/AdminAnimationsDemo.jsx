import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";

const MATCHES = [
  { id: 1, a: { code: "br", name: "ברזיל" },    b: { code: "ar", name: "ארגנטינה" }, score: "2-1" },
  { id: 2, a: { code: "fr", name: "צרפת" },      b: { code: "es", name: "ספרד" },     score: "1-1" },
  { id: 3, a: { code: "de", name: "גרמניה" },    b: { code: "pt", name: "פורטוגל" }, score: "3-0" },
  { id: 4, a: { code: "us", name: 'ארה"ב' },     b: { code: "mx", name: "מקסיקו" },  score: "0-2" },
  { id: 5, a: { code: "nl", name: "הולנד" },     b: { code: "ma", name: "מרוקו" },   score: "1-0" },
];

const Flag = ({ code, name, size = 32 }) => (
  <span className="fi fis rounded-md flex-shrink-0 shadow-sm"
    style={{ width: size, height: size, fontSize: size, display: "inline-block",
             backgroundSize: "cover", backgroundPosition: "center" }} title={name}>
    <span className={`fi fi-${code}`} style={{ display: "none" }} />
  </span>
);

const Card = ({ m, children, className = "" }) => (
  <div className={`flex items-center justify-between bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 ${className}`}>
    <div className="flex items-center gap-2 flex-1">
      <Flag code={m.a.code} name={m.a.name} />
      <span className="text-white text-xs font-semibold">{m.a.name}</span>
    </div>
    <div className="bg-slate-700/80 px-3 py-1 rounded-lg mx-2 flex-shrink-0">
      {children || <span className="text-white font-bold text-sm">{m.score}</span>}
    </div>
    <div className="flex items-center gap-2 flex-1 justify-end">
      <span className="text-white text-xs font-semibold">{m.b.name}</span>
      <Flag code={m.b.code} name={m.b.name} />
    </div>
  </div>
);

// ── Typewriter helper ──────────────────────────────────────────────────────────
function TypewriterText({ text, delay = 0, speed = 55 }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [text, delay]);
  return <span>{out}<span className="opacity-60 animate-pulse">|</span></span>;
}

// ── Matrix Scramble helper ─────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZאבגדהוז0123456789!@#$";
function ScrambleText({ text, delay = 0 }) {
  const [out, setOut] = useState("■".repeat(text.length));
  useEffect(() => {
    setOut("■".repeat(text.length));
    let frame = 0;
    const frames = 18;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        frame++;
        const done = Math.floor((frame / frames) * text.length);
        setOut(
          text.slice(0, done) +
          Array.from({ length: text.length - done }, () =>
            CHARS[Math.floor(Math.random() * CHARS.length)]
          ).join("")
        );
        if (frame >= frames) { setOut(text); clearInterval(iv); }
      }, 45);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [text, delay]);
  return <span className="font-mono">{out}</span>;
}

// ── Slot Machine helper ────────────────────────────────────────────────────────
function SlotNumber({ target, delay = 0 }) {
  const [num, setNum] = useState(Math.floor(Math.random() * 9));
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    setNum(Math.floor(Math.random() * 9));
    setSettled(false);
    let spins = 0;
    const maxSpins = 12 + Math.floor(Math.random() * 8);
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        spins++;
        if (spins >= maxSpins) { setNum(target); setSettled(true); clearInterval(iv); }
        else setNum(Math.floor(Math.random() * 10));
      }, 60);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [target, delay]);
  return (
    <motion.span
      animate={{ color: settled ? "#facc15" : "#94a3b8" }}
      className="font-black text-sm tabular-nums"
    >{num}</motion.span>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DEMOS
// ══════════════════════════════════════════════════════════════════════════════

function CardFlip() {
  return (
    <div className="space-y-2" style={{ perspective: 1000 }}>
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0,  opacity: 1 }}
          transition={{ delay: i * 0.15, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
          <Card m={m} />
        </motion.div>
      ))}
    </div>
  );
}

function WaveAnimation() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ y: -50, opacity: 0, scaleY: 0.6 }}
          animate={{ y: 0,   opacity: 1, scaleY: 1 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 280, damping: 14, mass: 0.7 }}>
          <Card m={m} />
        </motion.div>
      ))}
    </div>
  );
}

function CurtainWipe() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <div key={m.id} className="relative overflow-hidden rounded-xl">
          <Card m={m} />
          <motion.div
            className="absolute inset-0 bg-slate-900 pointer-events-none"
            initial={{ scaleX: 1, originX: 0 }}
            animate={{ scaleX: 0 }}
            transition={{ delay: i * 0.22, duration: 0.45, ease: [0.77, 0, 0.18, 1] }}
          />
        </div>
      ))}
    </div>
  );
}

function NewspaperSpin() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ rotate: -12, scale: 1.4, opacity: 0, y: -60 }}
          animate={{ rotate: 0,   scale: 1,   opacity: 1, y: 0 }}
          transition={{ delay: i * 0.18, type: "spring", stiffness: 90, damping: 18 }}>
          <Card m={m} />
        </motion.div>
      ))}
    </div>
  );
}

function MorphDot() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ borderRadius: "50%", scale: 0, opacity: 0 }}
          animate={{ borderRadius: "12px", scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.14, type: "spring", stiffness: 220, damping: 20 }}>
          <Card m={m} />
        </motion.div>
      ))}
    </div>
  );
}

function ZDepth() {
  return (
    <div className="space-y-2" style={{ perspective: 900 }}>
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ z: -400, opacity: 0, rotateX: 25 }}
          animate={{ z: 0,    opacity: 1, rotateX: 0 }}
          transition={{ delay: i * 0.13, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformStyle: "preserve-3d" }}>
          <Card m={m} />
        </motion.div>
      ))}
    </div>
  );
}

function DeckSpread() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ y: -(i * 52), opacity: 0, scale: 0.88, zIndex: MATCHES.length - i }}
          animate={{ y: 0,          opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.18, type: "spring", stiffness: 140, damping: 20 }}>
          <Card m={m} />
        </motion.div>
      ))}
    </div>
  );
}

function RunningIn() {
  return (
    <div className="space-y-2 overflow-hidden">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ x: i % 2 === 0 ? -260 : 260, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 160, damping: 22 }}>
          <Card m={m} />
        </motion.div>
      ))}
    </div>
  );
}

function TypewriterDemo() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.5 }}>
          <Card m={m}>
            <TypewriterText text={m.score} delay={i * 0.5 + 0.15} speed={80} />
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function MatrixScramble() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <motion.div key={m.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.35 }}>
          <div className="flex items-center justify-between bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 flex-1">
              <Flag code={m.a.code} name={m.a.name} />
              <span className="text-white text-xs font-semibold">
                <ScrambleText text={m.a.name} delay={i * 0.35 + 0.05} />
              </span>
            </div>
            <div className="bg-slate-700/80 px-3 py-1 rounded-lg mx-2">
              <span className="text-yellow-400 font-bold text-sm">
                <ScrambleText text={m.score} delay={i * 0.35 + 0.2} />
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className="text-white text-xs font-semibold">
                <ScrambleText text={m.b.name} delay={i * 0.35 + 0.05} />
              </span>
              <Flag code={m.b.code} name={m.b.name} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function LightningStrike() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => (
        <div key={m.id} className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.2 + 0.05 }}>
            <Card m={m} />
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(255,255,160,0.9) 0%, transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 0] }}
            transition={{ delay: i * 0.2, duration: 0.35, times: [0, 0.15, 0.4, 1] }}
          />
        </div>
      ))}
    </div>
  );
}

function SlotMachine() {
  return (
    <div className="space-y-2">
      {MATCHES.map((m, i) => {
        const [a, b] = m.score.split("-").map(Number);
        return (
          <motion.div key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}>
            <Card m={m}>
              <span className="font-black text-sm tabular-nums flex items-center gap-0.5">
                <SlotNumber target={a} delay={i * 0.15 + 0.1} />
                <span className="text-white/40 mx-0.5">-</span>
                <SlotNumber target={b} delay={i * 0.15 + 0.2} />
              </span>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
const DEMOS = [
  { id: "flip",      label: "Card Flip",       emoji: "🎴", Component: CardFlip      },
  { id: "wave",      label: "Wave",            emoji: "🌊", Component: WaveAnimation  },
  { id: "curtain",   label: "Curtain Wipe",    emoji: "🎬", Component: CurtainWipe   },
  { id: "newspaper", label: "Newspaper Spin",  emoji: "📰", Component: NewspaperSpin },
  { id: "morph",     label: "Morph from Dot",  emoji: "🎭", Component: MorphDot      },
  { id: "depth",     label: "3D Z-Depth",      emoji: "🎲", Component: ZDepth        },
  { id: "deck",      label: "Deck Spread",     emoji: "🗂️", Component: DeckSpread    },
  { id: "running",   label: "Running In",      emoji: "🏃", Component: RunningIn     },
  { id: "type",      label: "Typewriter",      emoji: "⌨️", Component: TypewriterDemo},
  { id: "matrix",    label: "Matrix Scramble", emoji: "📟", Component: MatrixScramble},
  { id: "lightning", label: "Lightning",       emoji: "⚡", Component: LightningStrike},
  { id: "slot",      label: "Slot Machine",    emoji: "🎰", Component: SlotMachine   },
];

export default function AdminAnimationsDemo() {
  const [active, setActive] = useState("flip");
  const [replayKey, setReplayKey] = useState(0);
  const current = DEMOS.find(d => d.id === active);

  const switchTo = (id) => { setActive(id); setReplayKey(k => k + 1); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">דמו — אנימציות כרטיסים</h2>
        <p className="text-slate-500 text-sm mt-1">12 אנימציות • לחץ טאב לעבור, Replay לחזרה</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {DEMOS.map(d => (
          <button key={d.id} onClick={() => switchTo(d.id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              active === d.id
                ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-300"
                : "bg-white/4 border-white/8 text-slate-400 hover:text-white hover:bg-white/8"
            }`}>
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 overflow-hidden min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div key={`${active}-${replayKey}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}>
            <current.Component />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Replay */}
      <div className="flex justify-center">
        <button onClick={() => setReplayKey(k => k + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white text-sm transition-all">
          <RotateCcw className="w-4 h-4" />
          Replay
        </button>
      </div>
    </div>
  );
}
