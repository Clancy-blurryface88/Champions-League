import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ─── Demo data ────────────────────────────────────────────────────────────────
const AVG_MATCH = 6.37;
const AVG_ROUND = 82.77;
const BEST = {
  teamA: "🇪🇸", nameA: "ספרד",
  teamB: "🇨🇻", nameB: "כף ורדה",
  scoreA: 4, scoreB: 1,
  guessA: 4, guessB: 1,
  pts: 21.65,
  date: "15.6.2026",
};

// ─── Animated counter ────────────────────────────────────────────────────────
function Count({ to, dec = 2, duration = 1200, delay = 0 }) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const t = setTimeout(() => {
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(parseFloat((ease * to).toFixed(dec)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [to, dec, duration, delay]);
  return <>{val.toFixed(dec)}</>;
}

// ─── Variant label ───────────────────────────────────────────────────────────
const VLabel = ({ n, title }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="text-[10px] font-mono bg-white/10 text-white/50 px-2 py-0.5 rounded-full">#{n}</span>
    <span className="text-white/60 text-xs">{title}</span>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 1 — Broadcast HUD (split scoreboard)
// ══════════════════════════════════════════════════════════════════════════════
function V1() {
  return (
    <div className="space-y-3">
      {/* Averages */}
      <div className="grid grid-cols-2 divide-x divide-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02]">
        {[["ממוצע למשחק", AVG_MATCH, 0], ["ממוצע למחזור", AVG_ROUND, 200]].map(([label, val, delay]) => (
          <div key={label} className="px-5 py-7 flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-amber-400/55">{label}</p>
            <p className="text-5xl font-bold text-white mt-2 tabular-nums leading-none">
              <Count to={val} delay={delay} />
            </p>
            <p className="text-white/20 text-xs mt-1.5">נקודות</p>
          </div>
        ))}
      </div>
      {/* Best match */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.05] flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-amber-400/55">המשחק הכי טוב</p>
          <p className="text-white/20 text-xs">{BEST.date}</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1"><span className="text-2xl">{BEST.teamA}</span><span className="text-white/40 text-xs">{BEST.nameA}</span></div>
            <div className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08]">
              <span className="text-white font-bold text-xl tabular-nums">{BEST.scoreA} – {BEST.scoreB}</span>
            </div>
            <div className="flex items-center gap-2 flex-1 flex-row-reverse"><span className="text-2xl">{BEST.teamB}</span><span className="text-white/40 text-xs text-right">{BEST.nameB}</span></div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/[0.05] rounded-xl border border-white/[0.06] bg-white/[0.03]">
            <div className="px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-widest text-white/25 mb-1.5">ניחוש</p>
              <p className="text-white font-bold text-lg">{BEST.guessA} – {BEST.guessB}</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-widest text-white/25 mb-1.5">נקודות</p>
              <p className="text-white font-bold text-2xl leading-none"><Count to={BEST.pts} delay={300} /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 2 — Neon glow numbers
// ══════════════════════════════════════════════════════════════════════════════
function V2() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[["ממוצע למשחק", AVG_MATCH, "#38bdf8", 0], ["ממוצע למחזור", AVG_ROUND, "#4ade80", 200]].map(([label, val, color, delay]) => (
          <div key={label} className="rounded-2xl p-5 flex flex-col items-center gap-2 border border-white/[0.06]" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <p className="text-[10px] uppercase tracking-widest text-white/30">{label}</p>
            <p className="text-4xl font-black tabular-nums" style={{ color, textShadow: `0 0 20px ${color}99, 0 0 40px ${color}44` }}>
              <Count to={val} delay={delay} />
            </p>
            <p className="text-white/20 text-[10px]">נק׳</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/[0.06] p-5 space-y-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
        <p className="text-[10px] uppercase tracking-widest text-white/30 text-center">המשחק הכי טוב שלך</p>
        <div className="flex items-center justify-center gap-4">
          <span className="text-3xl">{BEST.teamA}</span>
          <span className="text-white font-black text-2xl tabular-nums" style={{ textShadow: '0 0 20px #f59e0b99' }}>{BEST.scoreA} – {BEST.scoreB}</span>
          <span className="text-3xl">{BEST.teamB}</span>
        </div>
        <div className="flex justify-center gap-6 text-center">
          <div><p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">ניחוש</p><p className="text-white font-bold">{BEST.guessA} – {BEST.guessB}</p></div>
          <div className="w-px bg-white/10" />
          <div><p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">נקודות</p>
            <p className="font-black text-2xl" style={{ color: '#fbbf24', textShadow: '0 0 20px #fbbf2499' }}><Count to={BEST.pts} delay={300} /></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 3 — Glass morphism
// ══════════════════════════════════════════════════════════════════════════════
function V3() {
  const glass = { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)' };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[["ממוצע / משחק", AVG_MATCH, "text-blue-300", 0], ["ממוצע / מחזור", AVG_ROUND, "text-emerald-300", 200]].map(([label, val, cls, delay]) => (
          <div key={label} className="rounded-2xl p-5 text-center" style={glass}>
            <p className="text-white/50 text-xs mb-3">{label}</p>
            <p className={`text-4xl font-bold tabular-nums ${cls}`}><Count to={val} delay={delay} /></p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-5 space-y-4" style={glass}>
        <p className="text-white/50 text-sm text-center font-medium">🏆 המשחק הכי טוב שלך</p>
        <div className="flex items-center justify-between">
          <div className="text-center"><span className="text-3xl block">{BEST.teamA}</span><span className="text-white/40 text-xs">{BEST.nameA}</span></div>
          <div className="text-center">
            <div className="rounded-xl px-5 py-2" style={glass}>
              <span className="text-white font-bold text-2xl">{BEST.scoreA} – {BEST.scoreB}</span>
            </div>
          </div>
          <div className="text-center"><span className="text-3xl block">{BEST.teamB}</span><span className="text-white/40 text-xs">{BEST.nameB}</span></div>
        </div>
        <div className="rounded-xl p-3 grid grid-cols-3 text-center gap-2" style={glass}>
          <div><p className="text-white/40 text-[10px] mb-1">ניחוש</p><p className="text-white font-bold text-sm">{BEST.guessA}–{BEST.guessB}</p></div>
          <div><p className="text-white/40 text-[10px] mb-1">נקודות</p><p className="text-emerald-400 font-bold text-lg"><Count to={BEST.pts} delay={300} /></p></div>
          <div><p className="text-white/40 text-[10px] mb-1">תאריך</p><p className="text-white/60 text-xs">{BEST.date}</p></div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 4 — Brutalist / raw
// ══════════════════════════════════════════════════════════════════════════════
function V4() {
  return (
    <div className="space-y-0 border border-white/20 rounded-none" style={{ fontFamily: 'monospace' }}>
      <div className="grid grid-cols-2 divide-x divide-white/20 border-b border-white/20">
        {[["AVG / MATCH", AVG_MATCH, 0], ["AVG / ROUND", AVG_ROUND, 200]].map(([label, val, delay]) => (
          <div key={label} className="p-5">
            <p className="text-white/40 text-[9px] uppercase tracking-[0.3em] mb-2">{label}</p>
            <p className="text-white text-5xl font-black tabular-nums leading-none"><Count to={val} delay={delay} /></p>
            <p className="text-white/20 text-[9px] mt-2">PTS</p>
          </div>
        ))}
      </div>
      <div className="p-5 border-b border-white/20">
        <p className="text-white/40 text-[9px] uppercase tracking-[0.3em] mb-4">BEST MATCH</p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{BEST.teamA}</span>
          <span className="text-white font-black text-xl flex-1 text-center border-b border-white/20 pb-1">{BEST.scoreA} — {BEST.scoreB}</span>
          <span className="text-2xl">{BEST.teamB}</span>
        </div>
        <div className="flex gap-4 text-[10px] text-white/40 uppercase tracking-widest">
          <span>GUESS: {BEST.guessA}–{BEST.guessB}</span>
          <span>|</span>
          <span className="text-white font-black">PTS: <Count to={BEST.pts} delay={300} /></span>
          <span>|</span>
          <span>{BEST.date}</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 5 — Gradient sweep cards
// ══════════════════════════════════════════════════════════════════════════════
function V5() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0c2461 100%)' }} />
          <div className="relative">
            <p className="text-blue-200/60 text-[10px] uppercase tracking-widest mb-2">ממוצע / משחק</p>
            <p className="text-white text-5xl font-black tabular-nums"><Count to={AVG_MATCH} /></p>
            <p className="text-blue-200/40 text-xs mt-1">נקודות</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #022c22 100%)' }} />
          <div className="relative">
            <p className="text-emerald-200/60 text-[10px] uppercase tracking-widest mb-2">ממוצע / מחזור</p>
            <p className="text-white text-5xl font-black tabular-nums"><Count to={AVG_ROUND} delay={200} /></p>
            <p className="text-emerald-200/40 text-xs mt-1">נקודות</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #451a03 0%, #78350f 40%, #451a03 100%)' }} />
        <div className="relative space-y-4">
          <p className="text-amber-200/60 text-[10px] uppercase tracking-widest">המשחק הכי טוב שלך</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{BEST.teamA}</span>
            <div className="flex-1 text-center">
              <span className="text-white font-black text-2xl">{BEST.scoreA} – {BEST.scoreB}</span>
            </div>
            <span className="text-3xl">{BEST.teamB}</span>
          </div>
          <div className="flex justify-between text-sm">
            <div><p className="text-amber-200/40 text-[10px] uppercase tracking-widest mb-1">ניחוש</p><p className="text-white font-bold">{BEST.guessA}–{BEST.guessB}</p></div>
            <div className="text-center"><p className="text-amber-200/40 text-[10px] uppercase tracking-widest mb-1">נקודות</p>
              <p className="text-amber-300 font-black text-2xl"><Count to={BEST.pts} delay={300} /></p>
            </div>
            <div className="text-right"><p className="text-amber-200/40 text-[10px] uppercase tracking-widest mb-1">תאריך</p><p className="text-white/60 text-xs">{BEST.date}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 6 — Editorial / magazine (light on dark)
// ══════════════════════════════════════════════════════════════════════════════
function V6() {
  return (
    <div className="space-y-4">
      <div className="flex gap-0 divide-x divide-white/10">
        {[["ממוצע\nלמשחק", AVG_MATCH, 0], ["ממוצע\nלמחזור", AVG_ROUND, 200]].map(([label, val, delay], i) => (
          <div key={i} className="flex-1 px-5 py-2">
            <p className="text-white/30 text-[10px] leading-tight whitespace-pre mb-3 uppercase tracking-widest">{label}</p>
            <p className="text-white font-black leading-none tabular-nums" style={{ fontSize: 52 }}><Count to={val} delay={delay} /></p>
            <div className="h-px bg-white/10 mt-3" />
          </div>
        ))}
      </div>
      <div className="pt-2">
        <p className="text-white/25 text-[10px] uppercase tracking-[0.25em] mb-4">— המשחק הכי טוב שלך</p>
        <div className="flex items-start gap-5">
          <div className="flex items-center gap-2">
            <span className="text-4xl">{BEST.teamA}</span>
            <span className="text-white font-black text-4xl">{BEST.scoreA}</span>
          </div>
          <div className="flex flex-col justify-center pt-2">
            <span className="text-white/30 text-2xl font-light">–</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-4xl">{BEST.scoreB}</span>
            <span className="text-4xl">{BEST.teamB}</span>
          </div>
          <div className="flex-1 border-l border-white/10 pl-5">
            <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1">ניחוש</p>
            <p className="text-white font-bold text-lg">{BEST.guessA}–{BEST.guessB}</p>
            <p className="text-white/30 text-[9px] uppercase tracking-widest mt-3 mb-1">נקודות</p>
            <p className="text-amber-400 font-black text-3xl leading-none"><Count to={BEST.pts} delay={300} /></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 7 — Pill / badge style
// ══════════════════════════════════════════════════════════════════════════════
function V7() {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {[["ממוצע למשחק", AVG_MATCH, "#3b82f6", 0], ["ממוצע למחזור", AVG_ROUND, "#10b981", 200]].map(([label, val, color, delay]) => (
          <div key={label} className="flex-1 min-w-[130px] flex items-center gap-3 rounded-2xl px-4 py-4 border border-white/[0.08] bg-white/[0.03]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
              <span className="text-sm font-black" style={{ color }}>⌀</span>
            </div>
            <div>
              <p className="text-white/35 text-[10px] leading-none mb-1">{label}</p>
              <p className="text-white font-black text-2xl tabular-nums leading-none" style={{ color }}><Count to={val} delay={delay} /></p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <span className="text-amber-400 text-sm">★</span>
          </div>
          <p className="text-amber-400/70 text-xs font-semibold uppercase tracking-widest">המשחק הכי טוב שלך</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{BEST.teamA}</span>
            <span className="text-white/50 text-xs truncate">{BEST.nameA}</span>
          </div>
          <div className="rounded-xl px-4 py-2 bg-white/[0.06] border border-white/[0.1]">
            <span className="text-white font-black text-xl tabular-nums">{BEST.scoreA}–{BEST.scoreB}</span>
          </div>
          <div className="flex items-center gap-2 flex-1 flex-row-reverse">
            <span className="text-2xl">{BEST.teamB}</span>
            <span className="text-white/50 text-xs truncate text-right">{BEST.nameB}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl px-3 py-2 bg-white/[0.04] text-center">
            <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1">ניחוש</p>
            <p className="text-white font-bold">{BEST.guessA}–{BEST.guessB}</p>
          </div>
          <div className="flex-1 rounded-xl px-3 py-2 bg-amber-500/[0.08] border border-amber-500/20 text-center">
            <p className="text-amber-400/50 text-[9px] uppercase tracking-widest mb-1">נקודות</p>
            <p className="text-amber-400 font-black text-xl"><Count to={BEST.pts} delay={300} /></p>
          </div>
          <div className="flex-1 rounded-xl px-3 py-2 bg-white/[0.04] text-center">
            <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1">תאריך</p>
            <p className="text-white/60 text-[11px]">{BEST.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VARIANT 8 — Horizontal timeline / data-table feel
// ══════════════════════════════════════════════════════════════════════════════
function V8() {
  return (
    <div className="space-y-2">
      {[["ממוצע נקודות למשחק", AVG_MATCH, "text-blue-400", 0], ["ממוצע נקודות למחזור", AVG_ROUND, "text-green-400", 200]].map(([label, val, cls, delay]) => (
        <div key={label} className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <div className={`w-1 h-10 rounded-full flex-shrink-0 ${cls.replace('text-', 'bg-')}`} />
          <p className="text-white/50 text-sm flex-1">{label}</p>
          <p className={`font-black text-3xl tabular-nums ${cls}`}><Count to={val} delay={delay} /></p>
        </div>
      ))}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
          <div className="w-1 h-10 rounded-full flex-shrink-0 bg-amber-400" />
          <p className="text-white/50 text-sm flex-1">המשחק הכי טוב שלך</p>
          <p className="text-white/25 text-xs">{BEST.date}</p>
        </div>
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{BEST.teamA}</span>
            <span className="text-white font-black text-2xl tabular-nums">{BEST.scoreA}–{BEST.scoreB}</span>
            <span className="text-2xl">{BEST.teamB}</span>
          </div>
          <div className="flex-1 flex gap-4 justify-end text-sm">
            <div className="text-center"><p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">ניחוש</p><p className="text-white font-bold">{BEST.guessA}–{BEST.guessB}</p></div>
            <div className="text-center"><p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">נקודות</p><p className="text-amber-400 font-black text-xl"><Count to={BEST.pts} delay={300} /></p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main demo
// ══════════════════════════════════════════════════════════════════════════════
const VARIANTS = [
  { n: 1, title: "Broadcast HUD — split scoreboard, amber labels", C: V1 },
  { n: 2, title: "Neon Glow — blue/green/gold glow numbers", C: V2 },
  { n: 3, title: "Glassmorphism — frosted blur cards", C: V3 },
  { n: 4, title: "Brutalist — monospace, raw borders", C: V4 },
  { n: 5, title: "Gradient Sweep — colored gradient panels", C: V5 },
  { n: 6, title: "Editorial — magazine layout, giant numbers", C: V6 },
  { n: 7, title: "Pill / Badge — icon tiles + amber best match", C: V7 },
  { n: 8, title: "Data Table — horizontal rows with color bars", C: V8 },
];

export default function AdminStatsBlocksDemo() {
  const [search, setSearch] = useState("");
  const filtered = VARIANTS.filter(v =>
    search === "" || String(v.n).includes(search) || v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">דמו עיצובי סטטיסטיקה</h2>
          <p className="text-slate-400 text-sm mt-0.5">ממוצע למשחק/מחזור + המשחק הכי טוב</p>
        </div>
        <input
          className="mr-auto bg-slate-700/50 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 w-40 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50"
          placeholder="חפש גרסה..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map(({ n, title, C }) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (n - 1) * 0.06 }}
            className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5"
          >
            <VLabel n={n} title={title} />
            <C />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
