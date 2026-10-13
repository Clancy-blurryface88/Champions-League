import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronLeft, ArrowLeft, Target, Trophy, Zap, Goal, Calculator, Search, X, ListOrdered } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import { Match } from "@/api/entities";

// ── 20 layout concepts for the 1X2 popup (MatchScoringRulesModal.jsx), which
// today stacks simulator → markets → exact-score table in one long scroll.
// Demo only — the real modal is untouched. Each option renders inside a
// phone-sized frame so lengths can be compared side by side. ──────────────

const DEMO_MATCH = {
  id: "demo",
  team_a: "Real Madrid",
  team_b: "Liverpool",
  team_a_logo: null,
  team_b_logo: null,
  home_win_points: 3, draw_points: 4.5, away_win_points: 3.8,
  btts_yes_points: 2, btts_no_points: 2.6,
  goals_0_2_points: 2.4, goals_3_4_points: 2.2, goals_5_plus_points: 5,
  score_odds: {
    "1:0": 7, "2:0": 9, "2:1": 8, "3:0": 15, "3:1": 13, "3:2": 20, "4:0": 30, "4:1": 28,
    "0:0": 10, "1:1": 6.5, "2:2": 13, "3:3": 40,
    "0:1": 9, "0:2": 14, "1:2": 10, "0:3": 25, "1:3": 22, "2:3": 24,
    other: 50,
  },
};

// ── Shared logic (copied from MatchScoringRulesModal so the demo stays isolated) ──

function calcSimPoints(match, a, b) {
  if (a === null || b === null) return null;
  const dirPts = a > b ? match.home_win_points || 0 : a === b ? match.draw_points || 0 : match.away_win_points || 0;
  const bttsPts = a > 0 && b > 0 ? match.btts_yes_points || 0 : match.btts_no_points || 0;
  const goals = a + b;
  const rangePts = goals <= 2 ? match.goals_0_2_points || 0 : goals <= 4 ? match.goals_3_4_points || 0 : match.goals_5_plus_points || 0;
  const breakdown = [
    { label: "כיוון משחק", pts: dirPts, hit: dirPts > 0 },
    { label: "שתי קבוצות כובשות", pts: bttsPts, hit: bttsPts > 0 },
    { label: "טווח שערים", pts: rangePts, hit: rangePts > 0 },
  ];
  let total = dirPts + bttsPts + rangePts;
  if (match.score_odds) {
    const exactPts = match.score_odds[`${a}:${b}`] ?? match.score_odds.other ?? 0;
    breakdown.push({ label: "פגיעה מדויקת", pts: exactPts, hit: exactPts > 0 });
    total += exactPts;
  }
  return { total: parseFloat(total.toFixed(2)), breakdown };
}

const parseScore = (s) => s.split(":").map(Number);
const scoreEntries = (m) => Object.entries(m.score_odds || {}).filter(([s]) => s !== "other");
const exactPtsFor = (m, a, b) => m.score_odds?.[`${a}:${b}`] ?? m.score_odds?.other ?? 0;

function oddsColumns(m) {
  const e = scoreEntries(m);
  const byTotal = ([ka], [kb]) => { const [ah, aa] = parseScore(ka); const [bh, ba] = parseScore(kb); return ah + aa - (bh + ba) || ah - bh; };
  return [
    { label: "1", tone: "emerald", rows: e.filter(([s]) => { const [h, a] = parseScore(s); return h > a; }).sort(byTotal) },
    { label: "X", tone: "yellow", rows: e.filter(([s]) => { const [h, a] = parseScore(s); return h === a; }).sort(byTotal) },
    { label: "2", tone: "sky", rows: e.filter(([s]) => { const [h, a] = parseScore(s); return h < a; }).sort(byTotal) },
  ];
}

function markets(m) {
  return [
    { key: "dir", title: "כיוון משחק", icon: Trophy, items: [
      { label: "ניצחון ביתי", short: "1", pts: m.home_win_points || 0 },
      { label: "תיקו", short: "X", pts: m.draw_points || 0 },
      { label: "ניצחון חוץ", short: "2", pts: m.away_win_points || 0 },
    ] },
    { key: "btts", title: "שתי קבוצות כובשות", icon: Zap, items: [
      { label: "כן", short: "כן", pts: m.btts_yes_points || 0 },
      { label: "לא", short: "לא", pts: m.btts_no_points || 0 },
    ] },
    { key: "range", title: "טווח שערים", icon: Goal, items: [
      { label: "0–2 שערים", short: "0–2", pts: m.goals_0_2_points || 0 },
      { label: "3–4 שערים", short: "3–4", pts: m.goals_3_4_points || 0 },
      { label: "5+ שערים", short: "5+", pts: m.goals_5_plus_points || 0 },
    ] },
  ];
}

function useSim(match) {
  const [a, setA] = useState(null);
  const [b, setB] = useState(null);
  useEffect(() => { setA(null); setB(null); }, [match.id]);
  return { a, b, setA, setB, set: (x, y) => { setA(x); setB(y); }, sim: calcSimPoints(match, a, b) };
}

const TONE = {
  emerald: { pill: "bg-emerald-500/6 border-emerald-500/15", pts: "text-emerald-400" },
  yellow: { pill: "bg-yellow-500/6 border-yellow-500/15", pts: "text-yellow-400" },
  sky: { pill: "bg-sky-500/6 border-sky-500/15", pts: "text-sky-400" },
};

// ── Shared visual pieces ──────────────────────────────────────────────────

function SimInput({ value, onChange, small }) {
  const isSet = value !== null;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button onClick={() => onChange((value ?? -1) + 1)} className="text-yellow-400 hover:opacity-70"><ChevronUp className="w-4 h-4" strokeWidth={2.5} /></button>
      <div className={`${small ? "w-9 h-10" : "w-11 h-14"} flex items-center justify-center rounded-xl border`}
        style={{ background: isSet ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", borderColor: isSet ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)" }}>
        <span className={`${small ? "text-2xl" : "text-3xl"} font-bold tabular-nums`} style={{ fontFamily: "'Bebas Neue', sans-serif", color: isSet ? "white" : "rgba(255,255,255,0.25)" }}>
          {isSet ? value : "—"}
        </span>
      </div>
      <button onClick={() => { if (isSet && value > 0) onChange(value - 1); }} disabled={!isSet || value === 0} className="text-yellow-400 hover:opacity-70 disabled:opacity-20"><ChevronDown className="w-4 h-4" strokeWidth={2.5} /></button>
    </div>
  );
}

function SimTotal({ sim }) {
  return (
    <motion.span key={sim.total} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="text-base font-bold text-yellow-400 tabular-nums">
      {sim.total} PTS
    </motion.span>
  );
}

function Breakdown({ sim }) {
  return (
    <div className="space-y-1">
      {sim.breakdown.map((r) => (
        <div key={r.label} className="flex items-center justify-between">
          <span className={`text-xs ${r.hit ? "text-white/80" : "text-white/25 line-through"}`}>{r.label}</span>
          <span className={`text-xs font-bold tabular-nums ${r.hit ? "text-yellow-400" : "text-white/20"}`}>+{r.pts}</span>
        </div>
      ))}
    </div>
  );
}

function Simulator({ match, s, small }) {
  return (
    <div className="rounded-2xl border border-yellow-500/25 overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(9,122,220,0.07) 0%, rgba(10,20,50,0.6) 100%)" }}>
      <div className="px-3 pt-2.5 text-center">
        <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-yellow-400/80">סימולטור — כמה שווה הניחוש שלך</span>
      </div>
      <div className="flex items-center justify-center gap-3 pb-2 pt-1" dir="ltr">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[11px] text-white font-semibold">{match.team_a}</span>
          <SimInput value={s.a} onChange={s.setA} small={small} />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[11px] text-white font-semibold">{match.team_b}</span>
          <SimInput value={s.b} onChange={s.setB} small={small} />
        </div>
      </div>
      <AnimatePresence>
        {s.sim && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-yellow-500/15">
            <div className="px-3 py-2"><Breakdown sim={s.sim} /></div>
            <div className="mx-3 mb-2.5 rounded-xl flex justify-center py-2" style={{ background: "rgba(9,122,220,0.12)", border: "1px solid rgba(9,122,220,0.3)" }}>
              <SimTotal sim={s.sim} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionLabel({ title, icon: Icon, color = "text-sky-400" }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${color}`}>
      {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
      <span className="text-[10px] uppercase tracking-[0.12em] font-semibold">{title}</span>
    </div>
  );
}

function Segmented({ items }) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-white/10">
      {items.map((it, i) => (
        <React.Fragment key={it.label}>
          {i > 0 && <div className="w-px bg-white/10" />}
          <div className="flex flex-col items-center gap-1 py-2.5 flex-1 bg-sky-500/5">
            <span className="text-xl font-bold tabular-nums leading-none bg-gradient-to-br from-sky-400 to-white bg-clip-text text-transparent">{it.pts}</span>
            <span className="text-[10px] text-sky-200/80">{it.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function Markets({ match }) {
  return (
    <div className="space-y-3">
      {markets(match).map((mk) => (
        <div key={mk.key} className="space-y-2">
          <SectionLabel title={mk.title} icon={mk.icon} />
          <Segmented items={mk.items} />
        </div>
      ))}
    </div>
  );
}

function ExactGrid({ match, highlight }) {
  if (!match.score_odds) return <p className="text-center text-xs text-slate-500">אין טבלת פגיעה מדויקת למשחק</p>;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        {oddsColumns(match).map((col) => (
          <div key={col.label}>
            <div className="text-center text-xs font-bold text-white/55 mb-1">{col.label}</div>
            <div className="space-y-1">
              {col.rows.map(([score, pts]) => (
                <div key={score} className={`flex justify-between items-center rounded-lg border px-1.5 py-1 ${TONE[col.tone].pill} ${highlight === score ? "ring-1 ring-yellow-400" : ""}`}>
                  <span className={`font-bold text-[11px] tabular-nums ${TONE[col.tone].pts}`}>{pts}</span>
                  <span className="text-white/70 text-[11px] font-mono">{score}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {"other" in match.score_odds && (
        <div className="flex justify-between items-center rounded-lg bg-yellow-500/6 border border-yellow-500/15 px-3 py-1.5">
          <span className="text-yellow-400 font-bold text-xs tabular-nums">{match.score_odds.other}</span>
          <span className="text-white/70 text-[11px]">כל תוצאה אחרת</span>
        </div>
      )}
    </div>
  );
}

// Home goals = rows, away goals = columns. Brighter = more points (= less likely).
function Heatmap({ match, selected, onPick }) {
  const keys = scoreEntries(match).map(([s]) => parseScore(s));
  const max = Math.min(5, Math.max(3, ...keys.flat()));
  const vals = scoreEntries(match).map(([, p]) => p);
  const lo = Math.min(...vals), hi = Math.max(...vals, match.score_odds?.other ?? 0);
  const range = Array.from({ length: max + 1 }, (_, i) => i);
  return (
    <div dir="ltr" className="select-none">
      <div className="grid gap-1" style={{ gridTemplateColumns: `20px repeat(${max + 1}, 1fr)` }}>
        <div />
        {range.map((c) => <div key={c} className="text-center text-[9px] text-sky-300/70">{c}</div>)}
        {range.map((r) => (
          <React.Fragment key={r}>
            <div className="text-[9px] text-emerald-300/70 flex items-center justify-center">{r}</div>
            {range.map((c) => {
              const key = `${r}:${c}`;
              const inTable = key in (match.score_odds || {});
              const pts = exactPtsFor(match, r, c);
              const t = hi > lo ? (pts - lo) / (hi - lo) : 0.5;
              const isSel = selected === key;
              return (
                <button key={c} onClick={() => onPick?.(r, c)}
                  className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold tabular-nums transition-transform ${isSel ? "ring-2 ring-yellow-400 scale-110 z-10" : ""}`}
                  style={{ background: inTable ? `rgba(245,197,24,${0.08 + t * 0.55})` : "rgba(255,255,255,0.03)", color: inTable ? "#fff" : "rgba(255,255,255,0.3)" }}>
                  {pts}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-slate-500 mt-1.5" dir="rtl">
        <span>שורות = {match.team_a} · עמודות = {match.team_b}</span>
        <span>אפור = "כל תוצאה אחרת"</span>
      </div>
    </div>
  );
}

// ── Phone frame that mimics the real popup chrome ─────────────────────────

function PopupFrame({ match, children, compactHeader, noScroll, footer }) {
  return (
    <div className="mx-auto bg-[#0d1526] text-white rounded-2xl border border-white/10 overflow-hidden flex flex-col relative" style={{ width: 340, height: 600 }} dir="rtl">
      <div className="flex-shrink-0">
        <div className="px-4 pt-3 pb-2 flex items-center">
          <span className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70"><ArrowLeft className="w-4 h-4" /></span>
        </div>
        <div className={`flex items-center justify-between mx-3 mb-1 rounded-2xl px-4 ${compactHeader ? "py-2" : "py-3"}`}
          style={{ background: "linear-gradient(90deg, rgba(9,122,220,0.35) 0%, rgba(15,23,42,0.85) 35%, rgba(15,23,42,0.85) 65%, rgba(220,38,38,0.35) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className={`flex ${compactHeader ? "flex-row gap-2" : "flex-col gap-1"} items-center flex-1`}>
            <TeamFlag logo={match.team_a_logo} name={match.team_a} className={compactHeader ? "w-7 h-7" : "w-10 h-10"} />
            <span className="text-[11px] font-bold">{match.team_a}</span>
          </div>
          <span className="text-xs font-black tracking-widest text-sky-500 mx-2">VS</span>
          <div className={`flex ${compactHeader ? "flex-row gap-2" : "flex-col gap-1"} items-center flex-1`}>
            <TeamFlag logo={match.team_b_logo} name={match.team_b} className={compactHeader ? "w-7 h-7" : "w-10 h-10"} />
            <span className="text-[11px] font-bold">{match.team_b}</span>
          </div>
        </div>
      </div>
      <div className={`flex-1 min-h-0 ${noScroll ? "overflow-hidden relative" : "overflow-y-auto"} px-4 py-3`}>{children}</div>
      {footer}
    </div>
  );
}

const SECTIONS = [
  { id: "sim", label: "סימולטור", icon: Calculator },
  { id: "markets", label: "יחסים", icon: Trophy },
  { id: "exact", label: "תוצאה מדויקת", icon: Target },
];

function SectionBody({ id, match, s }) {
  if (id === "sim") return <Simulator match={match} s={s} />;
  if (id === "markets") return <Markets match={match} />;
  return <><SectionLabel title="פגיעה מדויקת" icon={Target} color="text-emerald-400/80" /><div className="h-2" /><ExactGrid match={match} /></>;
}

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.2 } };

// ═══ NAVIGATION BETWEEN SECTIONS (1-8) ═══════════════════════════════════

// 1. Classic top tabs with sliding underline
function Option1({ match }) {
  const s = useSim(match);
  const [tab, setTab] = useState("sim");
  return (
    <PopupFrame match={match}>
      <div className="flex border-b border-white/10 mb-3 -mx-1">
        {SECTIONS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex-1 py-2 text-xs font-semibold ${tab === t.id ? "text-white" : "text-slate-500"}`}>
            {t.label}
            {tab === t.id && <motion.div layoutId="o1-underline" className="absolute bottom-0 inset-x-2 h-0.5 bg-sky-400 rounded-full" />}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} match={match} s={s} /></motion.div></AnimatePresence>
    </PopupFrame>
  );
}

// 2. Swipe carousel with dots
function Option2({ match }) {
  const s = useSim(match);
  const [i, setI] = useState(0);
  const go = (n) => setI(Math.max(0, Math.min(SECTIONS.length - 1, n)));
  return (
    <PopupFrame match={match} noScroll footer={
      <div className="flex justify-center gap-1.5 py-2.5">
        {SECTIONS.map((t, k) => <button key={t.id} onClick={() => setI(k)} className="h-1.5 rounded-full transition-all" style={{ width: k === i ? 18 : 6, background: k === i ? "#38bdf8" : "rgba(255,255,255,0.2)" }} />)}
      </div>
    }>
      <motion.div className="flex h-full" dir="ltr" animate={{ x: `${-i * 100}%` }} transition={{ type: "spring", stiffness: 300, damping: 32 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
        onDragEnd={(_, info) => { if (info.offset.x < -50) go(i + 1); else if (info.offset.x > 50) go(i - 1); }}>
        {SECTIONS.map((t) => (
          <div key={t.id} className="w-full flex-shrink-0 h-full overflow-y-auto px-0.5" dir="rtl">
            <div className="text-center text-[10px] text-slate-500 mb-2">{t.label} · החלק לצדדים</div>
            <SectionBody id={t.id} match={match} s={s} />
          </div>
        ))}
      </motion.div>
    </PopupFrame>
  );
}

// 3. iOS-style segmented control
function Option3({ match }) {
  const s = useSim(match);
  const [tab, setTab] = useState("sim");
  return (
    <PopupFrame match={match}>
      <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 mb-3">
        {SECTIONS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="relative flex-1 py-1.5 text-[11px] font-semibold">
            {tab === t.id && <motion.div layoutId="o3-pill" className="absolute inset-0 rounded-lg bg-sky-600" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <span className={`relative ${tab === t.id ? "text-white" : "text-slate-400"}`}>{t.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} match={match} s={s} /></motion.div></AnimatePresence>
    </PopupFrame>
  );
}

// 4. Accordion — one section open at a time
function Option4({ match }) {
  const s = useSim(match);
  const [open, setOpen] = useState("sim");
  return (
    <PopupFrame match={match}>
      <div className="space-y-2">
        {SECTIONS.map((t) => (
          <div key={t.id} className="rounded-xl border border-white/10 overflow-hidden">
            <button onClick={() => setOpen(open === t.id ? null : t.id)} className="w-full flex items-center justify-between px-3 py-2.5 bg-white/[0.03]">
              <span className="flex items-center gap-2 text-xs font-semibold"><t.icon className="w-3.5 h-3.5 text-sky-400" />{t.label}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open === t.id ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === t.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="p-3"><SectionBody id={t.id} match={match} s={s} /></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </PopupFrame>
  );
}

// 5. Simulator only, "show odds" reveals the rest
function Option5({ match }) {
  const s = useSim(match);
  const [more, setMore] = useState(false);
  return (
    <PopupFrame match={match}>
      <Simulator match={match} s={s} />
      <button onClick={() => setMore(!more)} className="w-full mt-3 py-2 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-semibold flex items-center justify-center gap-1">
        {more ? "הסתר יחסים" : "הצג יחסים וטבלת תוצאות"}<ChevronDown className={`w-4 h-4 transition-transform ${more ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {more && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="pt-4 space-y-4"><Markets match={match} /><ExactGrid match={match} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </PopupFrame>
  );
}

// 6. Bottom sheet over the simulator — drag up for the odds
function Option6({ match }) {
  const s = useSim(match);
  const [expanded, setExpanded] = useState(false);
  return (
    <PopupFrame match={match} noScroll>
      <Simulator match={match} s={s} />
      <motion.div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-white/15 flex flex-col"
        style={{ background: "#111c33", height: "92%" }}
        animate={{ y: expanded ? "0%" : "72%" }} transition={{ type: "spring", stiffness: 300, damping: 32 }}
        drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.15}
        onDragEnd={(_, info) => { if (info.offset.y < -40) setExpanded(true); else if (info.offset.y > 40) setExpanded(false); }}>
        <button onClick={() => setExpanded(!expanded)} className="flex flex-col items-center pt-2 pb-1.5 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/25 mb-1.5" />
          <span className="text-[11px] text-sky-300 font-semibold">{expanded ? "גרור למטה לסגירה" : "גרור למעלה — יחסים ותוצאות"}</span>
        </button>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4" onPointerDownCapture={(e) => expanded && e.stopPropagation()}>
          <Markets match={match} /><ExactGrid match={match} />
        </div>
      </motion.div>
    </PopupFrame>
  );
}

// 7. Bottom tab bar (thumb zone)
function Option7({ match }) {
  const s = useSim(match);
  const [tab, setTab] = useState("sim");
  return (
    <PopupFrame match={match} footer={
      <div className="flex border-t border-white/10 bg-[#0a1120]">
        {SECTIONS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex flex-col items-center gap-0.5 py-2 ${tab === t.id ? "text-sky-400" : "text-slate-500"}`}>
            <t.icon className="w-4 h-4" /><span className="text-[10px] font-semibold">{t.label}</span>
          </button>
        ))}
      </div>
    }>
      <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} match={match} s={s} /></motion.div></AnimatePresence>
    </PopupFrame>
  );
}

// 8. One scroll, but a sticky jump-nav with scroll-spy
function Option8({ match }) {
  const s = useSim(match);
  const scrollRef = useRef(null);
  const refs = useRef({});
  const [active, setActive] = useState("sim");
  const onScroll = () => {
    const top = scrollRef.current.scrollTop;
    let cur = "sim";
    SECTIONS.forEach((t) => { if (refs.current[t.id] && refs.current[t.id].offsetTop - 50 <= top) cur = t.id; });
    setActive(cur);
  };
  const jump = (id) => scrollRef.current.scrollTo({ top: refs.current[id].offsetTop - 40, behavior: "smooth" });
  return (
    <PopupFrame match={match} noScroll>
      <div ref={scrollRef} onScroll={onScroll} className="absolute inset-0 overflow-y-auto px-4 pb-4">
        <div className="sticky top-0 z-10 flex gap-1.5 py-2 bg-[#0d1526]">
          {SECTIONS.map((t) => (
            <button key={t.id} onClick={() => jump(t.id)} className={`flex-1 py-1 rounded-full text-[10px] font-semibold border transition-colors ${active === t.id ? "bg-sky-600 border-sky-500 text-white" : "border-white/10 text-slate-400"}`}>{t.label}</button>
          ))}
        </div>
        {SECTIONS.map((t) => (
          <div key={t.id} ref={(el) => { refs.current[t.id] = el; }} className="pt-3"><SectionBody id={t.id} match={match} s={s} /></div>
        ))}
      </div>
    </PopupFrame>
  );
}

// ═══ RE-ARRANGING THE CONTENT (9-13) ═════════════════════════════════════

// 9. Flip card — simulator on the front, odds on the back
function Option9({ match }) {
  const s = useSim(match);
  const [flipped, setFlipped] = useState(false);
  return (
    <PopupFrame match={match} noScroll>
      <div className="h-full" style={{ perspective: 1000 }}>
        <motion.div className="relative h-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
          <div className="absolute inset-0 overflow-y-auto" style={{ backfaceVisibility: "hidden" }}>
            <Simulator match={match} s={s} />
            <button onClick={() => setFlipped(true)} className="w-full mt-3 py-2 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-300 text-xs font-semibold">↻ הפוך לצפייה ביחסים</button>
          </div>
          <div className="absolute inset-0 overflow-y-auto space-y-4" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <button onClick={() => setFlipped(false)} className="w-full py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-semibold">↻ חזרה לסימולטור</button>
            <Markets match={match} /><ExactGrid match={match} />
          </div>
        </motion.div>
      </div>
    </PopupFrame>
  );
}

// 10. Compact dashboard: mini simulator + market table side by side
function Option10({ match }) {
  const s = useSim(match);
  return (
    <PopupFrame match={match} compactHeader>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl border border-yellow-500/25 p-2 flex flex-col items-center" style={{ background: "rgba(9,122,220,0.06)" }}>
          <span className="text-[9px] text-yellow-400/80 font-semibold mb-1">סימולטור</span>
          <div className="flex gap-1.5" dir="ltr"><SimInput value={s.a} onChange={s.setA} small /><SimInput value={s.b} onChange={s.setB} small /></div>
          <div className="mt-1 h-6 flex items-center">{s.sim ? <SimTotal sim={s.sim} /> : <span className="text-[10px] text-slate-500">בחר תוצאה</span>}</div>
        </div>
        <div className="rounded-xl border border-white/10 p-2 space-y-1.5">
          {markets(match).map((mk) => (
            <div key={mk.key}>
              <div className="text-[9px] text-sky-400 mb-0.5">{mk.title}</div>
              <div className="flex gap-1">
                {mk.items.map((it) => (
                  <div key={it.label} className="flex-1 rounded-md bg-sky-500/8 text-center py-0.5">
                    <div className="text-[11px] font-bold">{it.pts}</div><div className="text-[8px] text-slate-400">{it.short}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ExactGrid match={match} highlight={s.a !== null && s.b !== null ? `${s.a}:${s.b}` : null} />
    </PopupFrame>
  );
}

// 11. Heatmap replaces the 3-column exact table
function Option11({ match }) {
  const s = useSim(match);
  return (
    <PopupFrame match={match}>
      <Simulator match={match} s={s} small />
      <div className="h-4" />
      <Markets match={match} />
      <div className="h-4" />
      <SectionLabel title="פגיעה מדויקת — מפת חום" icon={Target} color="text-emerald-400/80" />
      <div className="h-2" />
      <Heatmap match={match} selected={s.a !== null && s.b !== null ? `${s.a}:${s.b}` : null} onPick={s.set} />
    </PopupFrame>
  );
}

// 12. Heatmap IS the simulator — tap a cell, see the breakdown
function Option12({ match }) {
  const s = useSim(match);
  const sel = s.a !== null && s.b !== null ? `${s.a}:${s.b}` : null;
  return (
    <PopupFrame match={match}>
      <div className="text-center text-[11px] text-slate-400 mb-2">הקש על תוצאה כדי לראות כמה היא שווה</div>
      <Heatmap match={match} selected={sel} onPick={s.set} />
      <div className="mt-3 rounded-xl border border-yellow-500/25 p-3 min-h-[120px]" style={{ background: "rgba(9,122,220,0.06)" }}>
        {s.sim ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold tabular-nums" dir="ltr" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.a} - {s.b}</span>
              <SimTotal sim={s.sim} />
            </div>
            <Breakdown sim={s.sim} />
          </>
        ) : <div className="h-full flex items-center justify-center text-xs text-slate-500 pt-8">לא נבחרה תוצאה</div>}
      </div>
    </PopupFrame>
  );
}

// 13. All markets squeezed into one line of chips
function Option13({ match }) {
  const s = useSim(match);
  const [showTable, setShowTable] = useState(false);
  return (
    <PopupFrame match={match}>
      <Simulator match={match} s={s} small />
      <div className="mt-3 space-y-1.5">
        {markets(match).map((mk) => (
          <div key={mk.key} className="flex items-center gap-1.5">
            <span className="text-[10px] text-sky-400 w-[70px] flex-shrink-0">{mk.title}</span>
            {mk.items.map((it) => (
              <span key={it.label} className="flex-1 text-center rounded-full border border-white/10 bg-white/[0.03] py-1 text-[10px]">
                <span className="text-slate-400">{it.short} </span><b className="text-white">{it.pts}</b>
              </span>
            ))}
          </div>
        ))}
      </div>
      <button onClick={() => setShowTable(!showTable)} className="w-full mt-3 text-[11px] text-emerald-400 font-semibold py-1.5">
        {showTable ? "▲ הסתר פגיעה מדויקת" : "▼ פגיעה מדויקת (18 תוצאות)"}
      </button>
      {showTable && <ExactGrid match={match} />}
    </PopupFrame>
  );
}

// ═══ GUIDED / PROGRESSIVE FLOWS (14-16) ══════════════════════════════════

// 14. Stories — full-screen pages with progress bars, tap sides to move
function Option14({ match }) {
  const s = useSim(match);
  const [i, setI] = useState(0);
  return (
    <PopupFrame match={match} noScroll>
      <div className="flex gap-1 mb-3">
        {SECTIONS.map((t, k) => (
          <div key={t.id} className="flex-1 h-1 rounded-full bg-white/15 overflow-hidden">
            <motion.div className="h-full bg-white" animate={{ width: k <= i ? "100%" : "0%" }} transition={{ duration: 0.3 }} />
          </div>
        ))}
      </div>
      <div className="text-xs font-bold text-white/80 mb-2">{SECTIONS[i].label}</div>
      <div className="relative" style={{ height: "calc(100% - 40px)" }}>
        <AnimatePresence mode="wait"><motion.div key={i} {...fade} className="h-full overflow-y-auto"><SectionBody id={SECTIONS[i].id} match={match} s={s} /></motion.div></AnimatePresence>
        {i !== 0 && <button onClick={() => setI(i - 1)} className="absolute top-0 bottom-0 right-0 w-8 flex items-center justify-center text-white/30 hover:text-white"><ChevronUp className="w-5 h-5 rotate-90" /></button>}
        {i < SECTIONS.length - 1 && <button onClick={() => setI(i + 1)} className="absolute top-0 bottom-0 left-0 w-8 flex items-center justify-center text-white/30 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>}
      </div>
    </PopupFrame>
  );
}

// 15. Step-by-step: pick a direction, then a range, then only matching scores
function Option15({ match }) {
  const [dir, setDir] = useState(null);
  const [range, setRange] = useState(null);
  const mk = markets(match);
  const fits = ([sc]) => {
    const [h, a] = parseScore(sc);
    const d = h > a ? "1" : h === a ? "X" : "2";
    const g = h + a;
    const r = g <= 2 ? "0–2" : g <= 4 ? "3–4" : "5+";
    return (!dir || d === dir) && (!range || r === range);
  };
  const scores = scoreEntries(match).filter(fits).sort((x, y) => x[1] - y[1]);
  const Step = ({ n, title, done, children }) => (
    <div className={`rounded-xl border p-2.5 ${done ? "border-sky-500/40 bg-sky-500/5" : "border-white/10"}`}>
      <div className="text-[10px] text-slate-400 mb-1.5"><b className="text-sky-400">שלב {n}</b> · {title}</div>{children}
    </div>
  );
  const Choice = ({ items, value, onPick }) => (
    <div className="flex gap-1.5">
      {items.map((it) => (
        <button key={it.short} onClick={() => onPick(value === it.short ? null : it.short)}
          className={`flex-1 rounded-lg py-1.5 text-[11px] border ${value === it.short ? "bg-sky-600 border-sky-500 text-white" : "border-white/10 bg-white/[0.03]"}`}>
          {it.label}<div className="font-bold">{it.pts}</div>
        </button>
      ))}
    </div>
  );
  return (
    <PopupFrame match={match}>
      <div className="space-y-2">
        <Step n={1} title="מי ינצח?" done={!!dir}><Choice items={mk[0].items} value={dir} onPick={setDir} /></Step>
        <Step n={2} title="כמה שערים?" done={!!range}><Choice items={mk[2].items} value={range} onPick={setRange} /></Step>
        <Step n={3} title={`תוצאות שמתאימות (${scores.length})`} done={false}>
          <div className="flex flex-wrap gap-1.5">
            {scores.map(([sc, p]) => (
              <span key={sc} className="rounded-lg bg-emerald-500/8 border border-emerald-500/20 px-2 py-1 text-[11px]"><span className="font-mono text-white/80">{sc}</span> <b className="text-emerald-400">{p}</b></span>
            ))}
            {!scores.length && <span className="text-[11px] text-slate-500">אין תוצאות בטבלה — שווה "{match.score_odds?.other}"</span>}
          </div>
        </Step>
        <div className="text-[10px] text-slate-500 text-center">שתי קבוצות כובשות: כן {mk[1].items[0].pts} · לא {mk[1].items[1].pts}</div>
      </div>
    </PopupFrame>
  );
}

// 16. Summary rows — the headline number of each section, tap to expand
function Option16({ match }) {
  const s = useSim(match);
  const [open, setOpen] = useState(null);
  const mk = markets(match);
  const minExact = scoreEntries(match).sort((a, b) => a[1] - b[1])[0];
  const rows = [
    { id: "sim", title: "סימולטור", summary: s.sim ? `${s.a}-${s.b} = ${s.sim.total} נק׳` : "בדוק כמה שווה ניחוש", body: <Simulator match={match} s={s} small /> },
    ...mk.map((m) => ({ id: m.key, title: m.title, summary: m.items.map((it) => `${it.short} ${it.pts}`).join(" · "), body: <Segmented items={m.items} /> })),
    { id: "exact", title: "פגיעה מדויקת", summary: minExact ? `החל מ-${minExact[1]} (${minExact[0]}) עד ${match.score_odds.other}` : "—", body: <ExactGrid match={match} /> },
  ];
  return (
    <PopupFrame match={match}>
      <div className="rounded-xl border border-white/10 divide-y divide-white/5 overflow-hidden">
        {rows.map((r) => (
          <div key={r.id}>
            <button onClick={() => setOpen(open === r.id ? null : r.id)} className="w-full flex items-center justify-between px-3 py-2.5 text-right">
              <div><div className="text-[11px] font-semibold">{r.title}</div><div className="text-[10px] text-slate-400" dir="auto">{r.summary}</div></div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open === r.id ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === r.id && <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden"><div className="px-3 pb-3">{r.body}</div></motion.div>}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </PopupFrame>
  );
}

// ═══ SHRINKING THE EXACT-SCORE TABLE (17-20) ═════════════════════════════

// 17. Exact table moves to a second layer that slides in
function Option17({ match }) {
  const s = useSim(match);
  const [layer, setLayer] = useState(false);
  return (
    <PopupFrame match={match} noScroll>
      <div className="h-full overflow-y-auto space-y-4">
        <Simulator match={match} s={s} small />
        <Markets match={match} />
        <button onClick={() => setLayer(true)} className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1">
          <Target className="w-3.5 h-3.5" />כל התוצאות המדויקות<ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <AnimatePresence>
        {layer && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute inset-0 bg-[#0d1526] px-4 py-3 overflow-y-auto">
            <button onClick={() => setLayer(false)} className="flex items-center gap-1 text-xs text-sky-400 mb-3"><ChevronUp className="w-4 h-4 rotate-90" />חזרה</button>
            <ExactGrid match={match} />
          </motion.div>
        )}
      </AnimatePresence>
    </PopupFrame>
  );
}

// 18. Type a score instead of scanning a table
function Option18({ match }) {
  const [q, setQ] = useState("");
  const m = q.match(/^\s*(\d{1,2})\s*[-:. ]\s*(\d{1,2})\s*$/);
  const sim = m ? calcSimPoints(match, Number(m[1]), Number(m[2])) : null;
  const quick = scoreEntries(match).sort((a, b) => a[1] - b[1]).slice(0, 6);
  return (
    <PopupFrame match={match}>
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='הקלד תוצאה, למשל 2-1' dir="ltr"
          className="w-full rounded-xl bg-white/5 border border-white/15 py-2.5 pr-9 pl-3 text-center text-lg font-bold outline-none focus:border-sky-500" style={{ fontFamily: "'Bebas Neue', sans-serif" }} />
        {q && <button onClick={() => setQ("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><X className="w-4 h-4" /></button>}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
        {quick.map(([sc]) => <button key={sc} onClick={() => setQ(sc.replace(":", "-"))} className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] font-mono text-slate-300" dir="ltr">{sc.replace(":", "-")}</button>)}
      </div>
      <div className="mt-3 rounded-xl border border-yellow-500/25 p-3" style={{ background: "rgba(9,122,220,0.06)" }}>
        {sim ? <><div className="flex justify-center mb-2"><SimTotal sim={sim} /></div><Breakdown sim={sim} /></> : <div className="text-center text-xs text-slate-500 py-4">הקלד תוצאה כדי לראות את הניקוד המלא</div>}
      </div>
      <div className="h-4" />
      <Markets match={match} />
    </PopupFrame>
  );
}

// 19. Vertical icon rail on the side
function Option19({ match }) {
  const s = useSim(match);
  const [tab, setTab] = useState("sim");
  return (
    <PopupFrame match={match} noScroll>
      <div className="absolute inset-0 flex">
        <div className="w-12 flex-shrink-0 border-l border-white/10 flex flex-col items-center gap-2 py-3 bg-[#0a1120]">
          {SECTIONS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} title={t.label}
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center ${tab === t.id ? "text-white" : "text-slate-500"}`}>
              {tab === t.id && <motion.div layoutId="o19-rail" className="absolute inset-0 rounded-xl bg-sky-600" />}
              <t.icon className="w-4 h-4 relative" />
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-[11px] font-bold text-sky-300 mb-2">{SECTIONS.find((t) => t.id === tab).label}</div>
          <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} match={match} s={s} /></motion.div></AnimatePresence>
        </div>
      </div>
    </PopupFrame>
  );
}

// 20. Top 5 likeliest scores (lowest points), "show all" for the rest
function Option20({ match }) {
  const s = useSim(match);
  const [all, setAll] = useState(false);
  const top = scoreEntries(match).sort((a, b) => a[1] - b[1]).slice(0, 5);
  return (
    <PopupFrame match={match}>
      <Simulator match={match} s={s} small />
      <div className="h-4" />
      <Markets match={match} />
      <div className="h-4" />
      <SectionLabel title={all ? "פגיעה מדויקת — הכל" : "5 התוצאות הסבירות ביותר"} icon={ListOrdered} color="text-emerald-400/80" />
      <div className="h-2" />
      {all ? <ExactGrid match={match} /> : (
        <div className="space-y-1">
          {top.map(([sc, p], k) => (
            <button key={sc} onClick={() => s.set(...parseScore(sc))} className="w-full flex items-center justify-between rounded-lg border border-emerald-500/15 bg-emerald-500/5 px-3 py-1.5">
              <span className="text-[10px] text-slate-500">#{k + 1}</span>
              <span className="font-mono text-xs text-white/80" dir="ltr">{sc.replace(":", " - ")}</span>
              <span className="font-bold text-xs text-emerald-400 tabular-nums">{p}</span>
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setAll(!all)} className="w-full mt-2 text-[11px] text-emerald-400 font-semibold py-1">{all ? "▲ הצג רק 5" : "▼ הצג את כל התוצאות"}</button>
    </PopupFrame>
  );
}

// ── Gallery shell ────────────────────────────────────────────────────────

function OptionCard({ n, title, tagline, approach, children }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center rounded-full text-[11px] font-black flex-shrink-0" style={{ width: 22, height: 22, background: "linear-gradient(135deg,#f5c518,#fde68a)", color: "#000" }}>{n}</span>
            <h3 className="text-white font-bold text-sm">{title}</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">{tagline}</p>
        </div>
        <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap" style={{ background: "rgba(245,197,24,0.12)", color: "#f5c518", border: "1px solid rgba(245,197,24,0.3)" }}>{approach}</span>
      </div>
      {children}
    </div>
  );
}

const OPTIONS = [
  { n: 1, title: "טאבים עליונים", tagline: "שלושה טאבים — סימולטור / יחסים / תוצאה מדויקת — עם קו תחתון מחליק.", approach: "ניווט", Comp: Option1 },
  { n: 2, title: "קרוסלה בהחלקה", tagline: "שלושה מסכים זה לצד זה, מחליקים באצבע; נקודות התקדמות למטה.", approach: "ניווט", Comp: Option2 },
  { n: 3, title: "מתג מקטעים בסגנון iOS", tagline: "בורר גלולה עם רקע שזז בקפיץ בין שלושת החלקים.", approach: "ניווט", Comp: Option3 },
  { n: 4, title: "אקורדיון", tagline: "כל חלק מקופל לכותרת; פתיחת אחד סוגרת את השאר.", approach: "ניווט", Comp: Option4 },
  { n: 5, title: "סימולטור + \"הצג עוד\"", tagline: "רק הסימולטור גלוי; כפתור אחד חושף יחסים וטבלה מתחתיו.", approach: "ניווט", Comp: Option5 },
  { n: 6, title: "Bottom sheet נגרר", tagline: "הסימולטור ברקע, גיליון היחסים מציץ מלמטה — גוררים אותו למעלה.", approach: "ניווט", Comp: Option6 },
  { n: 7, title: "טאבים בתחתית", tagline: "סרגל אייקונים קבוע למטה, בטווח האגודל — כמו אפליקציה.", approach: "ניווט", Comp: Option7 },
  { n: 8, title: "גלילה אחת + ניווט נדבק", tagline: "התוכן נשאר ארוך, אבל פס קפיצה נדבק למעלה ומסמן איפה אתה.", approach: "ניווט", Comp: Option8 },
  { n: 9, title: "קלף מתהפך", tagline: "צד אחד סימולטור, צד שני יחסים וטבלה — סיבוב תלת-ממדי ביניהם.", approach: "סידור מחדש", Comp: Option9 },
  { n: 10, title: "דשבורד קומפקטי", tagline: "סימולטור מוקטן ויחסים בטבלה זעירה זה לצד זה; הניחוש מודגש בטבלה.", approach: "סידור מחדש", Comp: Option10 },
  { n: 11, title: "מפת חום במקום טבלה", tagline: "התוצאות המדויקות כגריד בית×חוץ — צבע חזק = שווה יותר. הקשה ממלאת את הסימולטור.", approach: "סידור מחדש", Comp: Option11 },
  { n: 12, title: "מפת החום היא הסימולטור", tagline: "אין חלק סימולטור נפרד — מקישים על משבצת ורואים את פירוט הניקוד.", approach: "סידור מחדש", Comp: Option12 },
  { n: 13, title: "יחסים בשורות צ'יפים", tagline: "כל שוק בשורה צרה אחת; הטבלה המדויקת מקופלת כברירת מחדל.", approach: "סידור מחדש", Comp: Option13 },
  { n: 14, title: "סטורי", tagline: "מסכים מלאים עם פסי התקדמות בראש, מעבר בהקשה על הצדדים.", approach: "זרימה מודרכת", Comp: Option14 },
  { n: 15, title: "שלב אחרי שלב", tagline: "בוחרים כיוון, אחר כך טווח שערים — ורק התוצאות המדויקות שמתאימות מוצגות.", approach: "זרימה מודרכת", Comp: Option15 },
  { n: 16, title: "שורות סיכום נפתחות", tagline: "כל חלק = שורה עם המספרים בקצרה; הקשה פותחת את התצוגה המלאה.", approach: "זרימה מודרכת", Comp: Option16 },
  { n: 17, title: "טבלה בשכבה שנייה", tagline: "הפופאפ בלי הטבלה; כפתור \"כל התוצאות\" מחליק מסך נפרד מעליו.", approach: "קיצור הטבלה", Comp: Option17 },
  { n: 18, title: "חיפוש תוצאה", tagline: "מקלידים 2-1 ומקבלים מיד את כל הניקוד — במקום לסרוק טבלה.", approach: "קיצור הטבלה", Comp: Option18 },
  { n: 19, title: "פס אייקונים צדדי", tagline: "תפריט אנכי צר בצד, התוכן מתחלף לידו — מנצל רוחב במקום גובה.", approach: "ניווט", Comp: Option19 },
  { n: 20, title: "Top 5 + הצג הכל", tagline: "רק 5 התוצאות הסבירות ביותר (הכי פחות נקודות); השאר בלחיצה.", approach: "קיצור הטבלה", Comp: Option20 },
];

export default function AdminScoringModalOptions() {
  const [realMatches, setRealMatches] = useState([]);
  const [selectedId, setSelectedId] = useState("demo");

  useEffect(() => {
    Match.list("match_date")
      .then((all) => setRealMatches((all || []).filter((m) => m.score_odds && Object.keys(m.score_odds).length > 0)))
      .catch(() => setRealMatches([]));
  }, []);

  const match = realMatches.find((m) => String(m.id) === selectedId) || DEMO_MATCH;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">20 אפשרויות לפופאפ 1X2</h2>
        <p className="text-slate-400 text-sm mb-3">
          היום הפופאפ מציג סימולטור → יחסים → טבלת פגיעה מדויקת בגלילה אחת ארוכה. כאן 20 דרכים לקצר אותו —
          כל אחת אינטראקטיבית, בתוך מסגרת בגודל טלפון. דמו בלבד, הפופאפ האמיתי לא שונה.
        </p>
        <label className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
          משחק לתצוגה:
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-white text-xs">
            <option value="demo">דמו — {DEMO_MATCH.team_a} נגד {DEMO_MATCH.team_b}</option>
            {realMatches.map((m) => <option key={m.id} value={String(m.id)}>{m.team_a} נגד {m.team_b}</option>)}
          </select>
          {realMatches.length === 0 && <span className="text-slate-500">(אין עדיין משחקים עם טבלת יחסים — מוצג דמו)</span>}
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {OPTIONS.map((opt) => (
          <OptionCard key={opt.n} n={opt.n} title={opt.title} tagline={opt.tagline} approach={opt.approach}>
            <opt.Comp match={match} />
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
