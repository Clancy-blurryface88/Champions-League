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
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
const DEMOS = [
  { id: "dots",     label: "Dot Indicators", emoji: "⚫", nav: DotNav },
  { id: "preview",  label: "Preview",        emoji: "👀", nav: PreviewNav },
  { id: "arc",      label: "Progress Arc",   emoji: "🌀", nav: ArcNav },
  { id: "glass",    label: "Glass Pills",    emoji: "💊", nav: GlassNav },
  { id: "swipe",    label: "Swipe Hint",     emoji: "👈", nav: SwipeNav },
  { id: "progress", label: "Progress Bar",   emoji: "📊", nav: ProgressBarNav },
  { id: "neon",     label: "Neon Glow",      emoji: "✨", nav: NeonNav },
  { id: "peek",     label: "Card Peek",      emoji: "🃏", nav: PeekNav },
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
