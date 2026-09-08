import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Crown, Sparkles } from "lucide-react";

// ── Demo data — 3 tournaments, ~10 winners, so every option can be judged
// against a realistic (if not exhaustive) hall of fame. ───────────────────

const TOURNAMENTS = {
  cl:   { name: "ליגת האלופות", short: "UCL",       icon: "🏆", color: "#7cadee", glow: "rgba(124,173,238,0.35)" },
  wc:   { name: "מונדיאל",      short: "World Cup", icon: "🌍", color: "#f5c518", glow: "rgba(245,197,24,0.35)" },
  euro: { name: "יורו",         short: "EURO",       icon: "⭐", color: "#34d399", glow: "rgba(52,211,153,0.35)" },
};

const WINNERS = [
  { id: 1,  t: "cl",   year: 2025, team: "פ.ס.ז'",       player: "קיליאן אמבפה",   note: "פריז עוצרת את הדומיננטיות של ריאל" },
  { id: 2,  t: "cl",   year: 2024, team: "ריאל מדריד",    player: "דני קרוואחל",    note: "אליפות אירופית 15" },
  { id: 3,  t: "cl",   year: 2023, team: "מנצ'סטר סיטי",  player: "רודרי",          note: "הטריפל ההיסטורי" },
  { id: 4,  t: "cl",   year: 2022, team: "ריאל מדריד",    player: "קרים בנזמה",     note: "בנזמה זוכה בכדור הזהב" },
  { id: 5,  t: "wc",   year: 2022, team: "ארגנטינה",       player: "ליאונל מסי",     note: "הכתר החסר הושלם בדוחא" },
  { id: 6,  t: "wc",   year: 2018, team: "צרפת",           player: "קיליאן אמבפה",   note: "דור חדש עולה לגדולה" },
  { id: 7,  t: "wc",   year: 2014, team: "גרמניה",         player: "פיליפ לאם",      note: "7:1 נגד ברזיל בדרך לגמר" },
  { id: 8,  t: "euro", year: 2024, team: "ספרד",           player: "רודרי",          note: "אליפות אירופית שישית" },
  { id: 9,  t: "euro", year: 2020, team: "איטליה",         player: "ג'ורג'ו קייליני", note: "וומבלי, פנדלים דרמטיים" },
  { id: 10, t: "euro", year: 2016, team: "פורטוגל",         player: "כריסטיאנו רונאלדו", note: "האליפות הראשונה של פורטוגל" },
];

const byYearDesc = (a, b) => b.year - a.year;
const sorted = [...WINNERS].sort(byYearDesc);
function initials(name) { return name.trim().slice(0, 2); }

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

// ── 1. Trophy wall — glowing grid of cards ────────────────────────────────
function Option1() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {sorted.map((w) => {
        const t = TOURNAMENTS[w.t];
        return (
          <motion.div
            key={w.id}
            whileHover={{ y: -3, scale: 1.02 }}
            className="rounded-xl p-3 text-center cursor-default"
            style={{ background: `linear-gradient(160deg, ${t.glow}, rgba(255,255,255,0.02))`, border: `1px solid ${t.color}55` }}
          >
            <div
              className="w-9 h-9 mx-auto rounded-full flex items-center justify-center text-base mb-1.5"
              style={{ background: `radial-gradient(circle at 35% 30%, ${t.color}, ${t.color}66)`, boxShadow: `0 0 14px ${t.glow}` }}
            >
              {t.icon}
            </div>
            <p className="text-white text-[11px] font-bold" dir="ltr">{w.year}</p>
            <p className="text-slate-300 text-[10px] font-semibold truncate">{w.team}</p>
            <p className="text-[9px] truncate" style={{ color: t.color }}>{w.player}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── 2. Vertical timeline ───────────────────────────────────────────────────
function Option2() {
  return (
    <div className="relative pr-6 max-h-[280px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
      <div className="absolute top-0 bottom-0 right-2 w-px" style={{ background: "linear-gradient(to bottom, rgba(245,197,24,0.5), rgba(245,197,24,0.05))" }} />
      <div className="space-y-3">
        {sorted.map((w) => {
          const t = TOURNAMENTS[w.t];
          return (
            <div key={w.id} className="relative flex items-center gap-2.5">
              <div
                className="absolute right-2 translate-x-1/2 w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }}
              />
              <div className="flex-1 flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="text-sm">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-[11px] font-semibold truncate">{w.team} <span style={{ color: t.color }}>· {w.player}</span></p>
                </div>
                <span className="text-white text-[11px] font-black flex-shrink-0" dir="ltr">{w.year}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 3. 3D vitrine shelf — one shelf per tournament ─────────────────────────
function Option3() {
  const [hover, setHover] = useState(null);
  return (
    <div style={{ perspective: 700 }} className="space-y-6 py-2">
      {Object.entries(TOURNAMENTS).map(([tid, t]) => {
        const items = sorted.filter((w) => w.t === tid);
        return (
          <div key={tid} style={{ transform: "rotateX(6deg)", transformStyle: "preserve-3d" }} className="relative">
            <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: t.color }}>{t.name}</p>
            <div className="flex items-end gap-3 pb-2 relative overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
              {items.map((w) => (
                <div
                  key={w.id}
                  className="relative flex-shrink-0 flex flex-col items-center cursor-default transition-transform duration-200"
                  style={{ transform: hover === w.id ? "translateY(-6px) scale(1.15)" : "translateY(0) scale(1)" }}
                  onMouseEnter={() => setHover(w.id)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${t.color}, ${t.color}55)`, boxShadow: hover === w.id ? `0 6px 16px ${t.glow}` : "none" }}
                  >
                    {t.icon}
                  </div>
                  <span className="text-slate-400 text-[9px] font-bold" dir="ltr">{w.year}</span>
                  {hover === w.id && (
                    <div className="absolute bottom-full mb-1.5 whitespace-nowrap rounded-md px-2 py-1 text-[9px] font-semibold text-white z-10" style={{ background: "rgba(0,0,0,0.85)" }}>
                      {w.team} · {w.player}
                    </div>
                  )}
                </div>
              ))}
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${t.color}88, transparent)` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 4. Flip trading card ───────────────────────────────────────────────────
function Option4() {
  const [flipped, setFlipped] = useState({});
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {sorted.slice(0, 6).map((w) => {
        const t = TOURNAMENTS[w.t];
        const isFlipped = !!flipped[w.id];
        return (
          <div key={w.id} style={{ perspective: 600 }} className="aspect-[3/4]">
            <motion.div
              className="relative w-full h-full cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setFlipped((f) => ({ ...f, [w.id]: !f[w.id] }))}
            >
              <div
                className="absolute inset-0 rounded-lg flex flex-col items-center justify-center gap-1 p-1.5"
                style={{ backfaceVisibility: "hidden", background: `linear-gradient(160deg, ${t.glow}, rgba(255,255,255,0.02))`, border: `1px solid ${t.color}66` }}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="text-white text-[11px] font-black" dir="ltr">{w.year}</span>
                <span className="text-[8px] uppercase tracking-wide" style={{ color: t.color }}>{t.short}</span>
              </div>
              <div
                className="absolute inset-0 rounded-lg flex flex-col items-center justify-center gap-0.5 p-1.5 text-center"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "rgba(10,16,28,0.95)", border: `1px solid ${t.color}66` }}
              >
                <span className="text-slate-200 text-[10px] font-bold truncate w-full">{w.team}</span>
                <span className="text-[9px] font-semibold" style={{ color: t.color }}>{w.player}</span>
              </div>
            </motion.div>
          </div>
        );
      })}
      <p className="col-span-3 text-slate-500 text-[10px] mt-1">מציג 6 מתוך 10 בשביל הדמו — לחיצה על כרטיס הופכת אותו ומגלה את הזוכה.</p>
    </div>
  );
}

// ── 5. Spotlight carousel — one winner center-stage at a time ─────────────
function Option5() {
  const [i, setI] = useState(0);
  const w = sorted[i];
  const t = TOURNAMENTS[w.t];
  const move = (d) => setI((p) => (p + d + sorted.length) % sorted.length);
  return (
    <div className="relative rounded-xl overflow-hidden py-6" style={{ background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.06), transparent 65%), #05070c" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={w.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center px-8"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3"
            style={{ background: `radial-gradient(circle at 35% 30%, ${t.color}, ${t.color}44)`, boxShadow: `0 0 40px 8px ${t.glow}` }}
          >
            {t.icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: t.color }}>{t.name} · <span dir="ltr">{w.year}</span></span>
          <p className="text-white text-base font-black mt-1">{w.team}</p>
          <p className="text-slate-300 text-xs font-semibold">{w.player}</p>
          <p className="text-slate-500 text-[10px] mt-1.5 italic">"{w.note}"</p>
        </motion.div>
      </AnimatePresence>
      <button onClick={() => move(1)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <ChevronRight className="w-4 h-4" />
      </button>
      <button onClick={() => move(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex justify-center gap-1 mt-4">
        {sorted.map((_, idx) => (
          <span key={idx} className="w-1 h-1 rounded-full" style={{ background: idx === i ? t.color : "rgba(255,255,255,0.15)" }} />
        ))}
      </div>
    </div>
  );
}

// ── 6. Radial burst around a central emblem ────────────────────────────────
function Option6() {
  const [sel, setSel] = useState("cl");
  const t = TOURNAMENTS[sel];
  const items = sorted.filter((w) => w.t === sel);
  const R = 78;
  return (
    <div>
      <div className="flex justify-center gap-1.5 mb-3">
        {Object.entries(TOURNAMENTS).map(([id, tt]) => (
          <button
            key={id}
            onClick={() => setSel(id)}
            className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors"
            style={sel === id ? { background: tt.color, color: "#000" } : { background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
          >
            {tt.icon} {tt.short}
          </button>
        ))}
      </div>
      <div className="relative mx-auto" style={{ width: 220, height: 220 }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `conic-gradient(${t.color}22, transparent 30%, ${t.color}22, transparent 60%, ${t.color}22)` }}
        />
        <div
          className="absolute rounded-full flex items-center justify-center text-2xl font-black text-white"
          style={{ width: 60, height: 60, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: `radial-gradient(circle at 35% 30%, ${t.color}, ${t.color}66)`, boxShadow: `0 0 24px ${t.glow}` }}
        >
          {t.icon}
        </div>
        {items.map((w, idx) => {
          const angle = (idx / items.length) * 2 * Math.PI - Math.PI / 2;
          const x = 110 + R * Math.cos(angle);
          const y = 110 + R * Math.sin(angle);
          return (
            <div
              key={w.id}
              className="absolute flex flex-col items-center"
              style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black text-white" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${t.color}` }} dir="ltr">
                {w.year}
              </div>
              <span className="text-slate-400 text-[8px] mt-0.5 max-w-[54px] truncate">{w.team}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 7. Tabs per tournament — compact filtered list ─────────────────────────
function Option7() {
  const [sel, setSel] = useState("cl");
  const t = TOURNAMENTS[sel];
  const items = sorted.filter((w) => w.t === sel);
  return (
    <div>
      <div className="flex gap-1.5 mb-3">
        {Object.entries(TOURNAMENTS).map(([id, tt]) => (
          <button
            key={id}
            onClick={() => setSel(id)}
            className="flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-colors"
            style={sel === id ? { background: `${tt.color}22`, color: tt.color, border: `1px solid ${tt.color}66` } : { background: "rgba(255,255,255,0.03)", color: "#64748b", border: "1px solid transparent" }}
          >
            {tt.icon} {tt.name}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        {items.map((w) => (
          <div key={w.id} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-white text-[11px] font-black w-9 flex-shrink-0" dir="ltr" style={{ color: t.color }}>{w.year}</span>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-[11px] font-semibold truncate">{w.team}</p>
              <p className="text-slate-500 text-[9px] truncate">{w.player}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 8. Player leaderboard — grouped by winning player ──────────────────────
function Option8() {
  const byPlayer = {};
  WINNERS.forEach((w) => {
    byPlayer[w.player] = byPlayer[w.player] || [];
    byPlayer[w.player].push(w);
  });
  const ranked = Object.entries(byPlayer).sort((a, b) => b[1].length - a[1].length);
  return (
    <div className="space-y-1.5">
      {ranked.map(([player, wins], idx) => (
        <div key={player} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-900 flex-shrink-0" style={{ background: idx === 0 ? "#f5c518" : "#475569" }}>
            {initials(player)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-[11px] font-semibold truncate flex items-center gap-1">
              {player} {idx === 0 && <Crown className="w-3 h-3" style={{ color: "#f5c518" }} />}
            </p>
            <p className="text-slate-500 text-[9px] truncate" dir="ltr">
              {wins.map((w) => w.year).sort((a, b) => b - a).join(" · ")}
            </p>
          </div>
          <div className="flex gap-0.5 flex-shrink-0">
            {wins.map((w) => (
              <span key={w.id} className="text-xs" title={`${TOURNAMENTS[w.t].name} ${w.year}`}>{TOURNAMENTS[w.t].icon}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 9. Podium — top 3 most decorated players ───────────────────────────────
function Option9() {
  const byPlayer = {};
  WINNERS.forEach((w) => {
    byPlayer[w.player] = byPlayer[w.player] || [];
    byPlayer[w.player].push(w);
  });
  const ranked = Object.entries(byPlayer).sort((a, b) => b[1].length - a[1].length);
  const [p1, p2, p3] = ranked;
  const order = [p2, p1, p3].filter(Boolean);
  const heights = [64, 88, 50];
  const podiumColors = ["#c0c0c0", "#f5c518", "#cd7f32"];
  const posIdx = [1, 0, 2]; // p2 place=2, p1 place=1, p3 place=3
  return (
    <div>
      <div className="flex items-end justify-center gap-2 mb-3">
        {order.map(([player, wins], i) => (
          <div key={player} className="flex flex-col items-center" style={{ width: 72 }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-900 mb-1" style={{ background: podiumColors[posIdx[i]] }}>
              {initials(player)}
            </div>
            <p className="text-slate-200 text-[10px] font-bold truncate w-full text-center">{player}</p>
            <p className="text-slate-500 text-[9px] mb-1">{wins.length} תארים</p>
            <div
              className="w-full rounded-t-md flex items-start justify-center pt-1"
              style={{ height: heights[i], background: `linear-gradient(180deg, ${podiumColors[posIdx[i]]}55, ${podiumColors[posIdx[i]]}11)`, border: `1px solid ${podiumColors[posIdx[i]]}66` }}
            >
              <span className="text-white text-sm font-black">{posIdx[i] + 1}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {ranked.slice(3).map(([player, wins]) => (
          <div key={player} className="flex items-center justify-between text-[10px] px-2 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-slate-300">{player}</span>
            <span className="text-slate-500">{wins.length} תארים</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 10. Scrapbook — editorial open-page style ──────────────────────────────
function Option10() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const items = sorted.slice(page * perPage, page * perPage + perPage);
  const maxPage = Math.ceil(sorted.length / perPage) - 1;
  return (
    <div
      className="rounded-lg p-4"
      style={{ background: "linear-gradient(160deg, rgba(245,197,24,0.05), rgba(255,255,255,0.02))", border: "1px solid rgba(245,197,24,0.2)" }}
    >
      <p className="text-center text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "#f5c518", fontFamily: "'Syne', sans-serif" }}>
        <Sparkles className="w-3 h-3 inline mb-0.5" /> יומן הזוכים <Sparkles className="w-3 h-3 inline mb-0.5" />
      </p>
      <div className="space-y-2.5">
        {items.map((w) => {
          const t = TOURNAMENTS[w.t];
          return (
            <div key={w.id} className="flex items-center gap-3 pb-2.5" style={{ borderBottom: "1px dashed rgba(255,255,255,0.1)" }}>
              <span
                className="text-lg font-black flex-shrink-0"
                style={{ fontFamily: "'Bebas Neue', sans-serif", color: t.color }}
                dir="ltr"
              >
                {w.year}
              </span>
              <span className="text-base flex-shrink-0">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 text-[11px] font-semibold italic">{w.team} — {w.player}</p>
                <p className="text-slate-500 text-[9px]">{w.note}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-3 mt-3">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-20 text-slate-400 hover:text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-slate-500 text-[9px]">עמוד {page + 1} מתוך {maxPage + 1}</span>
        <button disabled={page === maxPage} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-20 text-slate-400 hover:text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const OPTIONS = [
  { n: 1,  title: "קיר גביעים זוהר",                 tagline: "גריד כרטיסים, כל אחד עם אמבלמת הטורניר בעיגול זוהר, שנה, קבוצה ושחקן.",       approach: "רשת גביעים",   Comp: Option1 },
  { n: 2,  title: "ציר זמן אנכי",                     tagline: "קו זהב יורד עם נקודה לכל זכייה — גוללים דרך ההיסטוריה כרונולוגית.",             approach: "ציר זמן",       Comp: Option2 },
  { n: 3,  title: "מדף ויטרינה תלת-ממדי",             tagline: "מדף נפרד לכל טורניר בפרספקטיבה קלה, הגביעים 'עומדים' עליו וקופצים בהובר.",     approach: "תלת-ממד",       Comp: Option3 },
  { n: 4,  title: "כרטיס טריידינג מתהפך",             tagline: "לחיצה הופכת את הכרטיס — צד קדמי אמבלמה+שנה, צד אחורי קבוצה+שחקן.",             approach: "אינטראקציה",    Comp: Option4 },
  { n: 5,  title: "קרוסלת ספוטלייט",                  tagline: "זוכה אחד במרכז הבמה עם תאורת ספוט, דפדוף בין השנים בחיצים.",                    approach: "קרוסלה",        Comp: Option5 },
  { n: 6,  title: "פיצוץ רדיאלי",                      tagline: "אמבלמת הטורניר במרכז, השנים מפוזרות סביבה במעגל כמו קרני שמש.",                  approach: "רדיאלי",        Comp: Option6 },
  { n: 7,  title: "טאבים לפי טורניר",                 tagline: "כפתור לכל תחרות, למטה רשימה מסוננת נקייה של שנה+קבוצה+שחקן.",                   approach: "לפי טורניר",    Comp: Option7 },
  { n: 8,  title: "לוח מלכים לפי שחקן",               tagline: "מקובץ לפי שחקן במקום לפי שנה — כל תג טורניר קטן שהוא זכה בו מוצג לידו.",         approach: "לפי שחקן",      Comp: Option8 },
  { n: 9,  title: "פודיום 3 המובילים",                tagline: "שלושת השחקנים המעוטרים ביותר על פודיום זהב/כסף/ארד, השאר ברשימה למטה.",         approach: "לפי שחקן",      Comp: Option9 },
  { n: 10, title: "יומן זוכים עריכתי",                tagline: "עיצוב 'ספר תיעוד' עם טיפוגרפיה נפרדת, קווים מקווקווים, ודפדוף עמודים.",          approach: "עיצוב עריכתי",  Comp: Option10 },
];

export default function AdminHallOfFameOptions() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">10 אפשרויות להיכל התהילה</h2>
        <p className="text-slate-400 text-sm">
          כל האפשרויות מודגמות על אותם נתוני דמו: 3 תחרויות (ליגת האלופות / מונדיאל / יורו) × כמה שנים אחורה, כולל שם הקבוצה והשחקן הבולט.
          הן אינטראקטיביות (הובר/לחיצה/דפדוף) בדיוק כמו שיתנהגו בפועל — האמבלמות כרגע אימוג'י placeholder, בפועל יוחלפו בלוגו האמיתי של כל תחרות.
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
