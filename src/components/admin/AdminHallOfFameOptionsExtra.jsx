import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TOURNAMENTS, WINNERS, sorted } from "@/data/hallOfFameDemoData";

// ── Round 2 — 20 more Hall of Fame concepts (options 11-30), continuing
// straight on from AdminHallOfFameOptions.jsx. Heavier on museum/vitrine
// variations (as requested) plus stadium, collectible, data and playful
// takes. Same fixed demo data throughout. ─────────────────────────────────

const KEYFRAMES = `
@keyframes hofSpinY { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
@keyframes hofSway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
@keyframes hofWave { 0%,100% { transform: skewX(-4deg) translateY(0); } 50% { transform: skewX(4deg) translateY(-2px); } }
@keyframes hofShine { 0% { transform: translateX(-120%) rotate(20deg); } 100% { transform: translateX(220%) rotate(20deg); } }
@keyframes hofFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes hofPulseGlow { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
`;

// ── Shared shell every option renders inside ──────────────────────────────

function OptionCard({ n, title, tagline, approach, children }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="flex items-center justify-center rounded-full text-[11px] font-black flex-shrink-0"
              style={{ width: 22, height: 22, background: "linear-gradient(135deg,#f5c518,#fde68a)", color: "#000" }}
            >
              {n}
            </span>
            <h3 className="text-white font-bold text-sm">{title}</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">{tagline}</p>
        </div>
        <span
          className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
          style={{ background: "rgba(245,197,24,0.12)", color: "#f5c518", border: "1px solid rgba(245,197,24,0.3)" }}
        >
          {approach}
        </span>
      </div>
      <div className="rounded-xl p-4 overflow-hidden" style={{ background: "rgba(3,13,26,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
        {children}
      </div>
    </div>
  );
}

// ═══ VITRINE / MUSEUM FAMILY (11-15) ═══════════════════════════════════════

// ── 11. Single glass case with a rotating light sweep ──────────────────────
function Option11() {
  const [i, setI] = useState(0);
  const w = sorted[i];
  const t = TOURNAMENTS[w.t];
  return (
    <div>
      <div
        className="relative mx-auto rounded-xl overflow-hidden flex flex-col items-center justify-center py-8"
        style={{ width: 180, background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.15)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)", animation: "hofShine 3.5s ease-in-out infinite" }} />
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: `radial-gradient(circle at 35% 30%, ${t.color}, ${t.color}55)`, boxShadow: `0 0 30px 6px ${t.glow}` }}
        >
          {t.icon}
        </div>
        <p className="text-white text-xs font-black mt-2" dir="ltr">{w.year}</p>
        <p className="text-slate-300 text-[10px] font-semibold">{w.team}</p>
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {sorted.map((x, idx) => (
          <button key={x.id} onClick={() => setI(idx)} className="w-1.5 h-1.5 rounded-full" style={{ background: idx === i ? t.color : "rgba(255,255,255,0.2)" }} />
        ))}
      </div>
    </div>
  );
}

// ── 12. Row of suspended cases, spotlit from above, gently swaying ─────────
function Option12() {
  return (
    <div className="flex justify-center gap-4 py-4 overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
      {sorted.slice(0, 4).map((w, idx) => {
        const t = TOURNAMENTS[w.t];
        return (
          <div key={w.id} className="flex flex-col items-center flex-shrink-0" style={{ animation: `hofSway ${3 + idx * 0.4}s ease-in-out infinite` }}>
            <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.25)" }} />
            <div className="relative w-16 h-20 rounded-b-lg flex items-center justify-center" style={{ background: `linear-gradient(180deg, ${t.glow}, transparent 70%)`, border: "1px solid rgba(255,255,255,0.1)", borderTop: "none" }}>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-6 rounded-full" style={{ background: `radial-gradient(ellipse, ${t.glow}, transparent 70%)` }} />
              <span className="text-2xl relative">{t.icon}</span>
            </div>
            <p className="text-slate-300 text-[9px] font-bold mt-1" dir="ltr">{w.year}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── 13. Rotating cabinet — continuous 360° spin, pick which trophy ─────────
function Option13() {
  const [active, setActive] = useState(sorted[0].id);
  const w = sorted.find((x) => x.id === active);
  const t = TOURNAMENTS[w.t];
  return (
    <div className="text-center">
      <div style={{ perspective: 500 }} className="mx-auto" >
        <div
          className="w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-3xl"
          style={{ background: `linear-gradient(135deg, ${t.color}33, ${t.color}0a)`, border: `1px solid ${t.color}66`, animation: "hofSpinY 5s linear infinite", transformStyle: "preserve-3d" }}
        >
          {t.icon}
        </div>
      </div>
      <p className="text-white text-xs font-black mt-2" dir="ltr">{w.year} · {w.team}</p>
      <div className="flex justify-center gap-1.5 mt-2.5 flex-wrap">
        {sorted.map((x) => (
          <button key={x.id} onClick={() => setActive(x.id)} className="text-sm px-1.5 py-0.5 rounded-md" style={{ background: active === x.id ? `${TOURNAMENTS[x.t].color}33` : "rgba(255,255,255,0.04)" }}>
            {TOURNAMENTS[x.t].icon}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 14. Curved gallery alcoves — walk through a museum hall ────────────────
function Option14() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
      {sorted.map((w) => {
        const t = TOURNAMENTS[w.t];
        return (
          <div key={w.id} className="flex-shrink-0 flex flex-col items-center justify-end pt-6 pb-2 px-2" style={{ width: 78, height: 100, borderRadius: "40px 40px 8px 8px", background: `radial-gradient(circle at 50% 20%, ${t.glow}, rgba(255,255,255,0.02) 75%)`, border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-xl mb-1">{t.icon}</span>
            <span className="text-white text-[10px] font-bold" dir="ltr">{w.year}</span>
            <span className="text-slate-500 text-[8px] truncate w-full text-center">{w.team}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── 15. Staircase tiers — ascending steps, newest highest ──────────────────
function Option15() {
  const items = [...sorted].reverse();
  return (
    <div className="flex items-end justify-center gap-1.5 pt-4">
      {items.map((w, idx) => {
        const t = TOURNAMENTS[w.t];
        const h = 30 + idx * 9;
        return (
          <div key={w.id} className="flex flex-col items-center flex-shrink-0" style={{ width: 46 }}>
            <span className="text-base mb-1">{t.icon}</span>
            <div className="w-full rounded-t-md" style={{ height: h, background: `linear-gradient(180deg, ${t.color}44, ${t.color}11)`, border: `1px solid ${t.color}55`, borderBottom: "none" }} />
            <span className="text-slate-400 text-[8px] font-bold mt-0.5" dir="ltr">{w.year}</span>
          </div>
        );
      })}
    </div>
  );
}

// ═══ STADIUM FAMILY (16-19) ═════════════════════════════════════════════

// ── 16. Hanging championship banners ────────────────────────────────────
function Option16() {
  return (
    <div className="flex justify-center gap-2.5 pt-2">
      {sorted.slice(0, 5).map((w, idx) => {
        const t = TOURNAMENTS[w.t];
        return (
          <div key={w.id} className="flex flex-col items-center flex-shrink-0" style={{ animation: `hofSway ${4 + idx * 0.3}s ease-in-out infinite`, transformOrigin: "top center" }}>
            <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.3)" }} />
            <div
              className="w-10 flex flex-col items-center justify-start pt-2 text-center"
              style={{ height: 64, background: `linear-gradient(180deg, ${t.color}dd, ${t.color}99)`, clipPath: "polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)" }}
            >
              <span className="text-sm">{t.icon}</span>
              <span className="text-black/70 text-[8px] font-black mt-0.5" dir="ltr">{w.year}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 17. Digital jumbotron / scoreboard ──────────────────────────────────
function Option17() {
  const [i, setI] = useState(0);
  const w = sorted[i];
  const t = TOURNAMENTS[w.t];
  return (
    <div
      className="rounded-lg p-4 text-center"
      style={{ background: "#02100a", border: "2px solid rgba(255,255,255,0.08)", backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "6px 6px" }}
    >
      <p className="text-[9px] tracking-[0.3em] font-bold uppercase mb-1" style={{ color: "#4ade80", fontFamily: "'Orbitron', sans-serif" }}>{t.name}</p>
      <p className="text-3xl font-black" style={{ color: "#4ade80", fontFamily: "'Orbitron', sans-serif", textShadow: "0 0 12px rgba(74,222,128,0.6)" }} dir="ltr">{w.year}</p>
      <p className="text-white text-[11px] font-bold mt-1 uppercase tracking-wide">{w.team}</p>
      <p className="text-[9px]" style={{ color: "#4ade80" }}>{w.player}</p>
      <div className="flex justify-center gap-2 mt-3">
        <button onClick={() => setI((p) => (p - 1 + sorted.length) % sorted.length)} className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>◄</button>
        <button onClick={() => setI((p) => (p + 1) % sorted.length)} className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>►</button>
      </div>
    </div>
  );
}

// ── 18. Walk of Fame — star tiles set into pavement ─────────────────────
function Option18() {
  return (
    <div className="grid grid-cols-3 gap-2 p-3 rounded-lg" style={{ background: "linear-gradient(160deg,#2a2a2e,#18181b)" }}>
      {sorted.map((w) => {
        const t = TOURNAMENTS[w.t];
        return (
          <motion.div
            key={w.id}
            whileHover={{ y: -2 }}
            className="rounded-md p-2 text-center"
            style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.35)", clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
          >
            <p className="text-white text-[9px] font-black pt-1.5" dir="ltr">{w.year}</p>
            <p className="text-[7px] truncate" style={{ color: t.color }}>{w.player.split(" ")[0]}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── 19. Waving pennant bunting strung across the top ────────────────────
function Option19() {
  return (
    <div>
      <div className="h-px w-full mb-1" style={{ background: "rgba(255,255,255,0.15)" }} />
      <div className="flex justify-center gap-1">
        {sorted.map((w, idx) => {
          const t = TOURNAMENTS[w.t];
          return (
            <div
              key={w.id}
              className="flex-shrink-0 flex flex-col items-center justify-start pt-1.5"
              style={{ width: 34, height: 40, background: t.color, clipPath: "polygon(0 0, 100% 0, 50% 100%)", animation: `hofWave ${2.4 + (idx % 3) * 0.3}s ease-in-out infinite`, transformOrigin: "top center", animationDelay: `${idx * 0.15}s` }}
            >
              <span className="text-black/70 text-[7px] font-black" dir="ltr">{w.year}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══ COLLECTIBLE FAMILY (20-23) ═══════════════════════════════════════════

// ── 20. Panini-style sticker album ──────────────────────────────────────
function Option20() {
  const slots = [...sorted, { id: "empty1", empty: true }, { id: "empty2", empty: true }];
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {slots.map((w) => {
        if (w.empty) {
          return (
            <div key={w.id} className="aspect-square rounded-md flex items-center justify-center text-slate-600 text-sm" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.15)" }}>?</div>
          );
        }
        const t = TOURNAMENTS[w.t];
        return (
          <div
            key={w.id}
            className="aspect-square rounded-md flex flex-col items-center justify-center relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${t.color}55, ${t.color}11 60%, #fff2)`, border: `1px solid ${t.color}88` }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)", animation: "hofShine 4s ease-in-out infinite" }} />
            <span className="text-base relative">{t.icon}</span>
            <span className="text-white text-[8px] font-black relative" dir="ltr">{w.year}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── 21. Swipeable stacked card deck ──────────────────────────────────────
function Option21() {
  const [i, setI] = useState(0);
  const w = sorted[i];
  const t = TOURNAMENTS[w.t];
  return (
    <div className="relative flex flex-col items-center py-3" style={{ height: 150 }}>
      <div className="absolute rounded-xl" style={{ width: 140, height: 90, top: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", transform: "rotate(4deg)" }} />
      <div className="absolute rounded-xl" style={{ width: 140, height: 90, top: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", transform: "rotate(-3deg)" }} />
      <AnimatePresence mode="wait">
        <motion.div
          key={w.id}
          initial={{ opacity: 0, x: 40, rotate: 6 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, x: -60, rotate: -8 }}
          transition={{ duration: 0.25 }}
          className="absolute rounded-xl flex flex-col items-center justify-center text-center"
          style={{ width: 140, height: 90, background: `linear-gradient(160deg, ${t.glow}, rgba(255,255,255,0.03))`, border: `1px solid ${t.color}77`, top: 0 }}
        >
          <span className="text-xl">{t.icon}</span>
          <span className="text-white text-[11px] font-black" dir="ltr">{w.year}</span>
          <span className="text-slate-300 text-[9px]">{w.team}</span>
        </motion.div>
      </AnimatePresence>
      <button onClick={() => setI((p) => (p + 1) % sorted.length)} className="absolute bottom-0 text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: "rgba(245,197,24,0.15)", color: "#f5c518" }}>
        הבא בערימה ←
      </button>
    </div>
  );
}

// ── 22. Leather diary with a page-curl turn ──────────────────────────────
function Option22() {
  const [page, setPage] = useState(0);
  const per = 2;
  const items = sorted.slice(page * per, page * per + per);
  const maxPage = Math.ceil(sorted.length / per) - 1;
  return (
    <div className="relative" style={{ perspective: 900 }}>
      <div className="rounded-r-lg rounded-l-sm p-4" style={{ background: "linear-gradient(100deg, #3b2412, #4a2e17)", border: "1px solid rgba(0,0,0,0.4)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ transformOrigin: "left center" }}
          >
            <p className="text-[9px] uppercase tracking-widest mb-2 text-amber-200/70">עמוד {page + 1}</p>
            {items.map((w) => {
              const t = TOURNAMENTS[w.t];
              return (
                <p key={w.id} className="text-amber-50 text-[11px] mb-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>
                  <span dir="ltr" className="font-black">{w.year}</span> — {t.icon} {w.team} <span className="text-amber-300/70">· {w.player}</span>
                </p>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-3 mt-2">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-20 text-amber-300 text-[10px]">« הקודם</button>
        <button disabled={page === maxPage} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-20 text-amber-300 text-[10px]">הבא »</button>
      </div>
    </div>
  );
}

// ── 23. Fridge magnets — playful tilted collage ──────────────────────────
function Option23() {
  const tilts = [-6, 4, -3, 7, -8, 5, 2, -5, 6, -2];
  return (
    <div className="relative p-3 rounded-lg" style={{ background: "linear-gradient(160deg,#71717a,#52525b)", backgroundImage: "radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)", backgroundSize: "8px 8px" }}>
      <div className="flex flex-wrap gap-2 justify-center">
        {sorted.map((w, idx) => {
          const t = TOURNAMENTS[w.t];
          return (
            <div key={w.id} className="relative rounded-md px-2 py-1.5 text-center shadow-lg" style={{ background: "#fff", transform: `rotate(${tilts[idx % tilts.length]}deg)`, width: 62 }}>
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: t.color, boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />
              <span className="text-sm block">{t.icon}</span>
              <span className="text-slate-900 text-[8px] font-black block" dir="ltr">{w.year}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══ DATA / STATS FAMILY (24-27) ═══════════════════════════════════════

// ── 24. Branching trophy tree ─────────────────────────────────────────────
function Option24() {
  const groups = Object.entries(TOURNAMENTS).map(([id, t]) => ({ id, t, items: sorted.filter((w) => w.t === id) }));
  return (
    <svg viewBox="0 0 280 170" className="w-full">
      <line x1="140" y1="165" x2="140" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      {groups.map((g, gi) => {
        const bx = 50 + gi * 90;
        return (
          <g key={g.id}>
            <line x1="140" y1="120" x2={bx} y2="80" stroke={g.t.color} strokeWidth="1.5" opacity="0.6" />
            <circle cx={bx} cy="72" r="12" fill={`${g.t.color}33`} stroke={g.t.color} />
            <text x={bx} y="76" textAnchor="middle" fontSize="10">{g.t.icon}</text>
            {g.items.map((w, wi) => {
              const lx = bx - 20 + wi * 20;
              return (
                <g key={w.id}>
                  <line x1={bx} y1="80" x2={lx} y2="130" stroke={g.t.color} strokeWidth="1" opacity="0.4" />
                  <circle cx={lx} cy="136" r="7" fill="#0a0f1a" stroke={g.t.color} />
                  <text x={lx} y="152" textAnchor="middle" fontSize="7" fill="#94a3b8">{w.year}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

// ── 25. Heatmap grid — tournaments × years ────────────────────────────────
function Option25() {
  const years = Array.from({ length: 12 }, (_, i) => 2025 - i).reverse();
  return (
    <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `50px repeat(${years.length}, 20px)` }}>
        <div />
        {years.map((y) => <div key={y} className="text-slate-500 text-[7px] text-center" dir="ltr">{String(y).slice(2)}</div>)}
        {Object.entries(TOURNAMENTS).map(([id, t]) => (
          <React.Fragment key={id}>
            <div className="text-[9px] font-semibold flex items-center" style={{ color: t.color }}>{t.short}</div>
            {years.map((y) => {
              const hit = WINNERS.find((w) => w.t === id && w.year === y);
              return (
                <div
                  key={y}
                  title={hit ? `${hit.team} · ${hit.player}` : ""}
                  className="w-5 h-5 rounded-sm"
                  style={{ background: hit ? t.color : "rgba(255,255,255,0.04)", boxShadow: hit ? `0 0 6px ${t.glow}` : "none" }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <p className="text-slate-500 text-[9px] mt-2">כל תא ממולא = זכייה באותה שנה; ריחוף מגלה פרטים.</p>
    </div>
  );
}

// ── 26. Animated bar chart ranking ────────────────────────────────────────
function Option26() {
  const byPlayer = {};
  WINNERS.forEach((w) => { byPlayer[w.player] = (byPlayer[w.player] || 0) + 1; });
  const ranked = Object.entries(byPlayer).sort((a, b) => b[1] - a[1]);
  const max = ranked[0][1];
  return (
    <div className="space-y-2">
      {ranked.map(([player, count]) => (
        <div key={player} className="flex items-center gap-2">
          <span className="text-slate-300 text-[10px] w-20 truncate flex-shrink-0">{player}</span>
          <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(count / max) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full flex items-center justify-end pl-1.5"
              style={{ background: "linear-gradient(90deg, #f5c518, #fde68a)" }}
            >
              <span className="text-slate-900 text-[9px] font-black">{count}</span>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 27. World map with gold pins per winning nation ───────────────────────
function Option27() {
  const [open, setOpen] = useState(null);
  // Rough illustrative positions (%) — abstract continents, not a real geo map.
  const PINS = [
    { id: 1, x: 47, y: 38, label: "ספרד" }, { id: 2, x: 51, y: 34, label: "צרפת" },
    { id: 3, x: 53, y: 30, label: "אנגליה" }, { id: 4, x: 56, y: 32, label: "גרמניה" },
    { id: 5, x: 58, y: 40, label: "איטליה" }, { id: 6, x: 30, y: 62, label: "ארגנטינה" },
  ];
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ height: 150, background: "linear-gradient(180deg,#0c2436,#081826)" }}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
      <div className="absolute rounded-full" style={{ left: "38%", top: "22%", width: "34%", height: "38%", background: "rgba(52,211,153,0.12)", filter: "blur(2px)" }} />
      <div className="absolute rounded-full" style={{ left: "20%", top: "45%", width: "20%", height: "35%", background: "rgba(52,211,153,0.1)", filter: "blur(2px)" }} />
      {PINS.map((p) => (
        <button key={p.id} onClick={() => setOpen(open === p.id ? null : p.id)} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <span className="block w-2.5 h-2.5 rounded-full" style={{ background: "#f5c518", boxShadow: "0 0 8px #f5c518", animation: "hofPulseGlow 1.8s ease-in-out infinite" }} />
          {open === p.id && (
            <span className="absolute bottom-full mb-1 -translate-x-1/2 left-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[8px] font-bold text-slate-900" style={{ background: "#f5c518" }}>{p.label}</span>
          )}
        </button>
      ))}
      <p className="absolute bottom-1.5 right-2 text-slate-500 text-[8px]">מפה מופשטת להמחשה — לא גיאוגרפית מדויקת</p>
    </div>
  );
}

// ═══ PLAYFUL / GAMIFIED (28-30) ═══════════════════════════════════════════

// ── 28. Treasure chest reveal ──────────────────────────────────────────────
function Option28() {
  const [openIdx, setOpenIdx] = useState(null);
  const w = sorted[0];
  const t = TOURNAMENTS[w.t];
  const isOpen = openIdx === w.id;
  return (
    <div className="flex flex-col items-center py-3">
      <motion.button
        onClick={() => setOpenIdx(isOpen ? null : w.id)}
        whileTap={{ scale: 0.92 }}
        className="relative w-20 h-16 rounded-lg flex items-center justify-center text-3xl"
        style={{ background: "linear-gradient(160deg,#78350f,#451a03)", border: "2px solid #b45309" }}
      >
        {!isOpen && "📦"}
        {isOpen && (
          <AnimatePresence>
            <motion.div key="burst" className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-xs"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ x: Math.cos((i / 6) * 2 * Math.PI) * 40, y: Math.sin((i / 6) * 2 * Math.PI) * 40, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >✨</motion.span>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
        {isOpen && <span className="relative text-2xl">{t.icon}</span>}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center mt-2">
            <p className="text-white text-xs font-black" dir="ltr">{w.year}</p>
            <p className="text-slate-300 text-[10px]">{w.team} · {w.player}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && <p className="text-slate-500 text-[9px] mt-2">לחיצה על הקופסה "פותחת" ומגלה את הזוכה האחרון</p>}
    </div>
  );
}

// ── 29. Spinning year dial ─────────────────────────────────────────────────
function Option29() {
  const [i, setI] = useState(0);
  const w = sorted[i];
  const t = TOURNAMENTS[w.t];
  const R = 70;
  const rotation = -(i / sorted.length) * 360;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 190, height: 190 }}>
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          style={{ border: "1px dashed rgba(255,255,255,0.15)" }}
        >
          {sorted.map((x, idx) => {
            const angle = (idx / sorted.length) * 2 * Math.PI - Math.PI / 2;
            const px = 95 + R * Math.cos(angle);
            const py = 95 + R * Math.sin(angle);
            const xt = TOURNAMENTS[x.t];
            return (
              <button
                key={x.id}
                onClick={() => setI(idx)}
                className="absolute w-8 h-8 rounded-full flex items-center justify-center text-xs"
                style={{ left: px - 16, top: py - 16, background: idx === i ? xt.color : "rgba(255,255,255,0.06)", border: `1px solid ${xt.color}` }}
              >
                {xt.icon}
              </button>
            );
          })}
        </motion.div>
        <div className="absolute rounded-full flex flex-col items-center justify-center text-center" style={{ width: 76, height: 76, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: `radial-gradient(circle at 35% 30%, ${t.color}, ${t.color}44)`, boxShadow: `0 0 24px ${t.glow}` }}>
          <span className="text-white text-[11px] font-black" dir="ltr">{w.year}</span>
        </div>
      </div>
      <p className="text-slate-300 text-[10px] mt-1">{w.team} · {w.player}</p>
    </div>
  );
}

// ── 30. Cinematic poster wall ──────────────────────────────────────────────
function Option30() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
      {sorted.slice(0, 4).map((w) => {
        const t = TOURNAMENTS[w.t];
        return (
          <div key={w.id} className="relative flex-shrink-0 rounded-lg overflow-hidden flex flex-col justify-end p-2" style={{ width: 96, height: 130, background: `linear-gradient(200deg, ${t.color}44, #05070c 75%)` }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 55%)" }} />
            <span className="absolute top-2 left-2 text-lg">{t.icon}</span>
            <p className="relative text-white font-black text-sm leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }} dir="ltr">{w.year}</p>
            <p className="relative text-white text-[10px] font-bold truncate">{w.team}</p>
            <p className="relative text-slate-300 text-[8px] uppercase tracking-wide truncate">בכיכובם: {w.player}</p>
          </div>
        );
      })}
    </div>
  );
}

const OPTIONS = [
  { n: 11, title: "תא זכוכית עם ברק מסתחרר",       tagline: "גביע יחיד בתא זכוכית, קו אור עובר עליו לאט; מחליפים זוכה עם נקודות בתחתית.", approach: "ויטרינה",   Comp: Option11 },
  { n: 12, title: "ויטרינות תלויות מהתקרה",          tagline: "כל גביע תלוי בתא נפרד עם ספוט מלמעלה, מתנדנד קלות כמו במוזיאון אמיתי.",       approach: "ויטרינה",   Comp: Option12 },
  { n: 13, title: "ארון מסתובב 360°",                tagline: "הגביע הנבחר מסתובב ברצף בתוך מסגרת קטנה; שורת אייקונים למטה למעבר בין זוכים.", approach: "ויטרינה",   Comp: Option13 },
  { n: 14, title: "אלקובות גלריה מקומרות",           tagline: "שורת גומחות מקומרות גוללת אופקית — תחושת הליכה במסדרון מוזיאון.",              approach: "ויטרינה",   Comp: Option14 },
  { n: 15, title: "ויטרינת מדרגות עולה",             tagline: "הגביעים עומדים על מדרגות בגובה עולה — הזכייה האחרונה הכי גבוהה.",              approach: "ויטרינה",   Comp: Option15 },
  { n: 16, title: "באנרים תלויים מגג האצטדיון",      tagline: "דגלי אליפות תלויים בשורה כמו על גבי קורות אצטדיון אמיתי, מתנופפים קלות.",       approach: "אצטדיון",   Comp: Option16 },
  { n: 17, title: "לוח סקורבורד דיגיטלי",            tagline: "מסך LED ירוק-על-שחור בסגנון ג'מבוטרון, דפדוף בין שנים בחיצים ◄►.",              approach: "אצטדיון",   Comp: Option17 },
  { n: 18, title: "שביל כוכבים (Walk of Fame)",      tagline: "אריחי כוכב זהובים על 'מדרכה' כהה, כל כוכב = שנת זכייה.",                        approach: "אצטדיון",   Comp: Option18 },
  { n: 19, title: "דגלוני ניצחון מתנופפים",          tagline: "שרשרת דגלונים משולשים לאורך קו עליון, כל אחד מתנועע בקצב משלו.",                approach: "אצטדיון",   Comp: Option19 },
  { n: 20, title: "אלבום מדבקות לאיסוף",             tagline: "גריד תאים בסגנון אלבום פאניני — משבצות מלאות נוצצות, ריקות מסומנות ב-'?'.",     approach: "קולקציה",   Comp: Option20 },
  { n: 21, title: "ערימת קלפים לדפדוף",              tagline: "חפיסת קלפים מוטית מאחור, לחיצה 'מעיפה' את הקלף הקדמי לצד ומגלה את הבא.",       approach: "קולקציה",   Comp: Option21 },
  { n: 22, title: "פנקס עור עם דפדוף עמוד",          tagline: "יומן זוכים בכריכת עור, כל דפדוף מסובב את העמוד כמו ספר אמיתי.",                 approach: "קולקציה",   Comp: Option22 },
  { n: 23, title: "מגנטים על לוח מתכת",              tagline: "כרטיסים קטנים מוטים באקראי עם 'סיכת מגנט', כמו אוסף על דלת מקרר.",              approach: "קולקציה",   Comp: Option23 },
  { n: 24, title: "עץ ניצחונות מסתעף",               tagline: "דיאגרמת SVG: גזע מרכזי מסתעף לכל טורניר, ומשם לעלים של כל שנה.",                approach: "דאטה",       Comp: Option24 },
  { n: 25, title: "מפת חום טורנירים×שנים",           tagline: "טבלת חום — שורה לכל תחרות, עמודה לכל שנה, תא זוהר = זכייה.",                    approach: "דאטה",       Comp: Option25 },
  { n: 26, title: "גרף עמודות מונפש",                tagline: "דירוג שחקנים לפי מספר תארים, הפסים 'נטענים' פנימה באנימציה.",                   approach: "דאטה",       Comp: Option26 },
  { n: 27, title: "מפת עולם עם סיכות זהב",           tagline: "מפה מופשטת עם סיכה פועמת לכל מדינה מנצחת; לחיצה מגלה את שם המדינה.",           approach: "דאטה",       Comp: Option27 },
  { n: 28, title: "תיבת אוצר להוצאה",                tagline: "לחיצה על קופסה 'פותחת' אותה בפיצוץ ניצוצות ומגלה את הזוכה האחרון.",             approach: "משחקי",      Comp: Option28 },
  { n: 29, title: "גלגל שנים מסתובב",                tagline: "טבעת שנים מקיפה מרכז זוהר; לחיצה על שנה מסובבת את הגלגל אליה בקפיץ.",          approach: "משחקי",      Comp: Option29 },
  { n: 30, title: "קיר פוסטרים קולנועי",             tagline: "כרטיסים בפרופורציית פוסטר סרט, שם הזוכה ככותרת וה'כיכובם' לשחקן.",             approach: "עיצוב עריכתי", Comp: Option30 },
];

export default function AdminHallOfFameOptionsExtra() {
  return (
    <div>
      <style>{KEYFRAMES}</style>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">20 אפשרויות נוספות להיכל התהילה</h2>
        <p className="text-slate-400 text-sm">
          המשך ישיר לגלריית 10 האפשרויות הראשונה (מספור 11-30) — דגש על גרסאות ויטרינה/מוזיאון נוספות (11-15),
          ולצידן כיווני אצטדיון, קולקציה, דאטה, ומשחקי. אותם נתוני דמו קבועים לאורך כל הגלריה.
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {OPTIONS.map((opt) => (
          <OptionCard key={opt.n} n={opt.n} title={opt.title} tagline={opt.tagline} approach={opt.approach}>
            <opt.Comp />
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
