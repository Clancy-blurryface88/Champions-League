import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Crown, Flame } from "lucide-react";
import { getTopScores } from "../predictions/MatchOddsBar";

// ── 50 concepts for "התוצאות הסבירות ביותר" (the תחזית tab in the match
// arena). Demo only — the real tab in MatchArenaSection is untouched.
// Options 1-30 are tag/chip variations (the old pill row the user liked),
// 31-50 are other layouts. Every option gets the same top-5 list.

const DEMO = {
  team_a: "Real Madrid",
  team_b: "Liverpool",
  score_odds: {
    "1:0": 7, "2:0": 9, "2:1": 8, "3:0": 15, "3:1": 13, "3:2": 20, "4:0": 30, "4:1": 28,
    "0:0": 10, "1:1": 6.5, "2:2": 13, "3:3": 40,
    "0:1": 9, "0:2": 14, "1:2": 10, "0:3": 25, "1:3": 22, "2:3": 24,
    other: 50,
  },
};

const sc = (s) => s.replace(":", "-");
const parts = (s) => s.split(":").map(Number);
const outcome = (s) => { const [h, a] = parts(s); return h > a ? "1" : h === a ? "X" : "2"; };
const OC = { "1": "52,211,153", X: "250,204,21", "2": "56,189,248" };
const BLUE = "59,130,246";
const GOLD = "245,197,24";

const pop = (i, base = 0.15) => ({
  initial: { opacity: 0, y: 6, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { delay: base + i * 0.09, type: "spring", stiffness: 380, damping: 24 },
});

function Title({ children = "התוצאות הסבירות ביותר" }) {
  return <p className="text-[10.5px] font-semibold text-yellow-400 text-center mb-2">{children}</p>;
}

// ── Tags 1-30 ─────────────────────────────────────────────────────────────

// 1 — the original pill row
function O1({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.5)`, boxShadow: `0 0 10px rgba(${BLUE},0.25)` }}>
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[9px] text-blue-300/70">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 2 — gold glass pills like the stage badge
function O2({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-400/40"
        style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)" }}>
        <span className="text-[12px] font-black text-yellow-400">{sc(t.score)}</span>
        <span className="text-[9px] text-yellow-200/60">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 3 — colored by outcome (1 green / X yellow / 2 sky)
function O3({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => { const c = OC[outcome(t.score)]; return (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: `rgba(${c},0.1)`, border: `1px solid rgba(${c},0.5)`, boxShadow: `0 0 10px rgba(${c},0.2)` }}>
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[9px]" style={{ color: `rgba(${c},0.85)` }}>{t.pct}%</span>
      </motion.div>); })}
  </div>
  <div className="flex justify-center gap-3 mt-2 text-[9px] text-slate-400"><span style={{ color: `rgb(${OC["1"]})` }}>● בית</span><span style={{ color: `rgb(${OC.X})` }}>● תיקו</span><span style={{ color: `rgb(${OC["2"]})` }}>● חוץ</span></div></>);
}

// 4 — size scales with probability
function O4({ top }) {
  const max = top[0].pct;
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center items-center" dir="ltr">
    {top.map((t, i) => { const k = 0.75 + 0.45 * (t.pct / max); return (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1.5 rounded-full"
        style={{ padding: `${4 * k}px ${10 * k}px`, background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.5)` }}>
        <span className="font-black text-white" style={{ fontSize: 11 * k }}>{sc(t.score)}</span>
        <span className="text-blue-300/70" style={{ fontSize: 9 * k }}>{t.pct}%</span>
      </motion.div>); })}
  </div></>);
}

// 5 — opacity fades with probability
function O5({ top }) {
  const max = top[0].pct;
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => { const a = 0.25 + 0.75 * (t.pct / max); return (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: `rgba(${BLUE},${0.25 * a})`, border: `1px solid rgba(${BLUE},${a})`, boxShadow: `0 0 ${12 * a}px rgba(${BLUE},${0.4 * a})` }}>
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[9px] text-blue-200">{t.pct}%</span>
      </motion.div>); })}
  </div></>);
}

// 6 — leader pill with crown, others smaller
function O6({ top }) {
  const [first, ...rest] = top;
  return (<><Title />
    <div className="flex justify-center mb-2" dir="ltr">
      <motion.div {...pop(0)} className="flex items-center gap-2 px-4 py-1.5 rounded-full"
        style={{ background: `rgba(${GOLD},0.14)`, border: `1px solid rgba(${GOLD},0.7)`, boxShadow: `0 0 16px rgba(${GOLD},0.35)` }}>
        <Crown className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-base font-black text-white">{sc(first.score)}</span>
        <span className="text-[10px] text-yellow-300">{first.pct}%</span>
      </motion.div>
    </div>
    <div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
      {rest.map((t, i) => (
        <motion.div key={t.score} {...pop(i + 1)} className="flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background: `rgba(${BLUE},0.08)`, border: `1px solid rgba(${BLUE},0.4)` }}>
          <span className="text-[10px] font-bold text-white">{sc(t.score)}</span>
          <span className="text-[8.5px] text-blue-300/70">{t.pct}%</span>
        </motion.div>))}
    </div></>);
}

// 7 — rank number prefix
function O7({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full"
        style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.5)` }}>
        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-black" style={{ background: i === 0 ? "#f5c518" : "rgba(255,255,255,0.75)" }}>{i + 1}</span>
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[9px] text-blue-300/70">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 8 — percentage as a badge on the pill corner
function O8({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-3 justify-center pt-2" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="relative px-3.5 py-1.5 rounded-full"
        style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.5)` }}>
        <span className="text-[12px] font-black text-white">{sc(t.score)}</span>
        <span className="absolute -top-2 -right-2 text-[8px] font-bold px-1.5 py-[1px] rounded-full bg-sky-500 text-white">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 9 — two-line chip (score over pct)
function O9({ top }) {
  return (<><Title /><div className="flex gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex flex-col items-center px-2.5 py-1 rounded-2xl"
        style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.5)` }}>
        <span className="text-[13px] font-black text-white leading-tight">{sc(t.score)}</span>
        <span className="text-[9px] text-blue-300/80 leading-tight">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 10 — ticket stub tags
function O10({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-2 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-stretch rounded-md overflow-hidden" style={{ border: `1px solid rgba(${GOLD},0.5)` }}>
        <span className="px-2 py-1 text-[11px] font-black text-white" style={{ background: `rgba(${GOLD},0.1)` }}>{sc(t.score)}</span>
        <span className="px-1.5 py-1 text-[9px] font-bold text-yellow-300 flex items-center" style={{ borderLeft: `1px dashed rgba(${GOLD},0.6)` }}>{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 11 — hexagon tags
function O11({ top }) {
  return (<><Title /><div className="flex gap-1 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex flex-col items-center justify-center w-14 h-12"
        style={{ clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)", background: i === 0 ? "linear-gradient(135deg,#097adc,#38bdf8)" : `rgba(${BLUE},0.25)` }}>
        <span className="text-[12px] font-black text-white leading-none">{sc(t.score)}</span>
        <span className="text-[8.5px] text-white/80">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 12 — square tiles
function O12({ top }) {
  return (<><Title /><div className="grid grid-cols-5 gap-1.5" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="aspect-square rounded-xl flex flex-col items-center justify-center"
        style={{ background: i === 0 ? `rgba(${BLUE},0.22)` : "rgba(255,255,255,0.04)", border: `1px solid rgba(${BLUE},${i === 0 ? 0.7 : 0.25})` }}>
        <span className="text-[14px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[9px] text-sky-300">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 13 — scoreboard digit chips
function O13({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-2 justify-center" dir="ltr">
    {top.map((t, i) => { const [h, a] = parts(t.score); return (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1 px-1.5 py-1 rounded-lg" style={{ background: "#020812", border: "1px solid rgba(255,255,255,0.12)" }}>
        <span className="w-5 h-6 rounded flex items-center justify-center text-[14px] text-amber-300" style={{ background: "#0b1a2e", fontFamily: "'Bebas Neue', sans-serif" }}>{h}</span>
        <span className="w-5 h-6 rounded flex items-center justify-center text-[14px] text-amber-300" style={{ background: "#0b1a2e", fontFamily: "'Bebas Neue', sans-serif" }}>{a}</span>
        <span className="text-[9px] text-slate-400 pl-0.5">{t.pct}%</span>
      </motion.div>); })}
  </div></>);
}

// 14 — leader pulses with neon glow
function O14({ top }) {
  return (<><Title /><style>{`@keyframes ts-neon{0%,100%{box-shadow:0 0 4px rgba(${BLUE},.4)}50%{box-shadow:0 0 18px 3px rgba(56,189,248,.8)}}`}</style>
    <div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
      {top.map((t, i) => (
        <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},${i === 0 ? 0.9 : 0.4})`, animation: i === 0 ? "ts-neon 1.8s ease-in-out infinite" : undefined }}>
          <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
          <span className="text-[9px] text-blue-300/70">{t.pct}%</span>
        </motion.div>))}
    </div></>);
}

// 15 — scrolling marquee of pills
function O15({ top }) {
  const loop = [...top, ...top, ...top];
  return (<><Title /><style>{`@keyframes ts-marq{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}`}</style>
    <div className="overflow-hidden" dir="ltr" style={{ maskImage: "linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent)" }}>
      <div className="flex gap-1.5 w-max" style={{ animation: "ts-marq 9s linear infinite" }}>
        {loop.map((t, i) => (
          <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.5)` }}>
            <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
            <span className="text-[9px] text-blue-300/70">{t.pct}%</span>
          </div>))}
      </div>
    </div></>);
}

// 16 — pill with mini bar beneath
function O16({ top }) {
  const max = top[0].pct;
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="px-2.5 pt-1 pb-1.5 rounded-xl" style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.45)` }}>
        <div className="flex items-center gap-1.5"><span className="text-[11px] font-black text-white">{sc(t.score)}</span><span className="text-[9px] text-blue-300/70">{t.pct}%</span></div>
        <div className="h-[3px] mt-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div className="h-full rounded-full bg-sky-400" initial={{ width: 0 }} animate={{ width: `${(t.pct / max) * 100}%` }} transition={{ delay: 0.3 + i * 0.09, duration: 0.6 }} />
        </div>
      </motion.div>))}
  </div></>);
}

// 17 — pill with progress ring
function Ring({ pct, size = 18, color = "#38bdf8" }) {
  const r = size / 2 - 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" fill="none" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"
        strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - pct / 100) }} transition={{ duration: 0.8, delay: 0.3 }} />
    </svg>
  );
}
function O17({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full" style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.5)` }}>
        <Ring pct={t.pct * 4} />
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[9px] text-blue-300/70">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 18 — split pill: home half / away half
function O18({ top, teams }) {
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => { const [h, a] = parts(t.score); return (
      <motion.div key={t.score} {...pop(i)} className="flex items-center rounded-full overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.2)" }} title={`${teams[0]} ${h} - ${a} ${teams[1]}`}>
        <span className="px-2 py-1 text-[11px] font-black text-white" style={{ background: `rgba(${OC["1"]},0.25)` }}>{h}</span>
        <span className="px-2 py-1 text-[11px] font-black text-white" style={{ background: `rgba(${OC["2"]},0.25)` }}>{a}</span>
        <span className="px-1.5 text-[9px] text-slate-300">{t.pct}%</span>
      </motion.div>); })}
  </div></>);
}

// 19 — tag cloud (scattered, rotated)
function O19({ top }) {
  const rot = [-4, 3, -2, 5, -3];
  const max = top[0].pct;
  return (<><Title /><div className="flex flex-wrap gap-2 justify-center items-center py-1" dir="ltr">
    {top.map((t, i) => (
      <motion.span key={t.score} {...pop(i)} className="font-black text-white px-2 py-0.5 rounded-md"
        style={{ fontSize: 10 + 8 * (t.pct / max), rotate: rot[i], background: `rgba(${BLUE},${0.08 + 0.2 * (t.pct / max)})`, border: `1px solid rgba(${BLUE},0.4)` }}>
        {sc(t.score)} <span className="text-[9px] text-sky-300 font-semibold">{t.pct}%</span>
      </motion.span>))}
  </div></>);
}

// 20 — vertical stack of pills
function O20({ top }) {
  return (<><Title /><div className="flex flex-col items-center gap-1" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-center justify-between w-32 px-3 py-1 rounded-full" style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.45)` }}>
        <span className="text-[12px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[10px] text-blue-300/80">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 21 — horizontal swipe strip with snap
function O21({ top }) {
  return (<><Title /><div className="flex gap-2 overflow-x-auto snap-x pb-1 px-1" dir="ltr" style={{ scrollbarWidth: "none" }}>
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="snap-center flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: `rgba(${BLUE},0.12)`, border: `1px solid rgba(${BLUE},0.5)` }}>
        <span className="text-[15px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[10px] text-blue-300">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 22 — pct as superscript
function O22({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="px-3 py-1 rounded-full" style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.5)` }}>
        <span className="text-[13px] font-black text-white">{sc(t.score)}</span>
        <sup className="text-[8px] text-sky-300 ml-0.5">{t.pct}%</sup>
      </motion.div>))}
  </div></>);
}

// 23 — glass pills with a shine sweep
function O23({ top }) {
  return (<><Title /><style>{`@keyframes ts-shine{0%{transform:translateX(-120%) skewX(-20deg)}60%,100%{transform:translateX(220%) skewX(-20deg)}}`}</style>
    <div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
      {top.map((t, i) => (
        <motion.div key={t.score} {...pop(i)} className="relative overflow-hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(16px)" }}>
          <span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: `ts-shine 2.6s ease-in-out ${i * 0.2}s infinite` }} />
          <span className="relative text-[11px] font-black text-white">{sc(t.score)}</span>
          <span className="relative text-[9px] text-slate-300">{t.pct}%</span>
        </motion.div>))}
    </div></>);
}

// 24 — tap a pill to flip and reveal pct
function O24({ top }) {
  const [open, setOpen] = useState(new Set());
  const toggle = (s) => setOpen((p) => { const n = new Set(p); n.has(s) ? n.delete(s) : n.add(s); return n; });
  return (<><Title>התוצאות הסבירות ביותר · הקש לחשיפה</Title><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.button key={t.score} {...pop(i)} onClick={() => toggle(t.score)} className="w-14 py-1 rounded-full text-[11px] font-black"
        style={{ background: open.has(t.score) ? "rgba(56,189,248,0.25)" : `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.5)`, color: open.has(t.score) ? "#bae6fd" : "#fff" }}>
        {open.has(t.score) ? `${t.pct}%` : sc(t.score)}
      </motion.button>))}
  </div></>);
}

// 25 — pills grouped by outcome
function O25({ top, teams }) {
  const groups = [["1", teams[0]], ["X", "תיקו"], ["2", teams[1]]];
  return (<><Title /><div className="space-y-1.5">
    {groups.map(([k, label]) => { const list = top.filter((t) => outcome(t.score) === k); if (!list.length) return null; const c = OC[k]; return (
      <div key={k} className="flex items-center gap-2">
        <span className="text-[9.5px] w-16 truncate text-left" style={{ color: `rgb(${c})` }}>{label}</span>
        <div className="flex gap-1.5" dir="ltr">
          {list.map((t, i) => (
            <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: `rgba(${c},0.1)`, border: `1px solid rgba(${c},0.5)` }}>
              <span className="text-[11px] font-black text-white">{sc(t.score)}</span><span className="text-[9px]" style={{ color: `rgba(${c},0.85)` }}>{t.pct}%</span>
            </motion.div>))}
        </div>
      </div>); })}
  </div></>);
}

// 26 — solid gradient pills
function O26({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1.5 px-3 py-1 rounded-full"
        style={{ background: "linear-gradient(135deg,#097adc,#38bdf8)", boxShadow: "0 4px 14px rgba(9,122,220,0.35)" }}>
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[9px] text-white/80">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 27 — outline only, minimal
function O27({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-2 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-baseline gap-1 px-2.5 py-0.5 rounded-full border border-white/25">
        <span className="text-[11px] font-bold text-white">{sc(t.score)}</span>
        <span className="text-[9px] text-slate-400">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 28 — pill whose fill is the probability (liquid fill)
function O28({ top }) {
  const max = top[0].pct;
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="relative overflow-hidden flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ border: `1px solid rgba(${BLUE},0.55)`, background: "rgba(255,255,255,0.03)" }}>
        <motion.span className="absolute inset-y-0 left-0" style={{ background: `rgba(${BLUE},0.35)` }} initial={{ width: 0 }} animate={{ width: `${(t.pct / max) * 100}%` }} transition={{ delay: 0.3 + i * 0.09, duration: 0.7 }} />
        <span className="relative text-[11px] font-black text-white">{sc(t.score)}</span>
        <span className="relative text-[9px] text-blue-100">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 29 — chips with a flame on the hottest score
function O29({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-1 px-2.5 py-1 rounded-full"
        style={{ background: i === 0 ? "rgba(249,115,22,0.15)" : `rgba(${BLUE},0.1)`, border: `1px solid ${i === 0 ? "rgba(249,115,22,0.6)" : `rgba(${BLUE},0.45)`}` }}>
        {i === 0 && <Flame className="w-3 h-3 text-orange-400" />}
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[9px]" style={{ color: i === 0 ? "#fdba74" : "rgba(147,197,253,0.7)" }}>{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 30 — pills appear one by one with a typewriter "drop"
function O30({ top }) {
  return (<><Title /><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} initial={{ opacity: 0, y: -20, rotate: -8 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.2 + i * 0.35, type: "spring", stiffness: 500, damping: 14 }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.5)` }}>
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[9px] text-blue-300/70">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// ── Other layouts 31-50 ───────────────────────────────────────────────────

// 31 — current: horizontal bars list
function O31({ top }) {
  const max = top[0].pct;
  return (<><Title /><div className="space-y-1.5" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: `rgba(${BLUE},0.08)`, border: `1px solid rgba(${BLUE},0.3)` }}>
        <span className="w-10 text-lg font-black text-white tabular-nums">{sc(t.score)}</span>
        <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/5">
          <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#097adc,#38bdf8)" }} initial={{ width: 0 }} animate={{ width: `${(t.pct / max) * 100}%` }} transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }} />
        </div>
        <span className="w-9 text-right text-[12px] font-bold text-sky-300">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 32 — vertical columns
function O32({ top }) {
  const max = top[0].pct;
  return (<><Title /><div className="flex items-end justify-center gap-3 h-28" dir="ltr">
    {top.map((t, i) => (
      <div key={t.score} className="flex flex-col items-center gap-1 h-full justify-end">
        <span className="text-[9px] text-sky-300">{t.pct}%</span>
        <motion.div className="w-8 rounded-t-lg" style={{ background: "linear-gradient(180deg,#38bdf8,#097adc)" }} initial={{ height: 0 }} animate={{ height: `${(t.pct / max) * 70}%` }} transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }} />
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span>
      </div>))}
  </div></>);
}

// 33 — podium for top 3 + chips for the rest
function O33({ top }) {
  const order = [1, 0, 2];
  const h = [64, 84, 50];
  return (<><Title /><div className="flex items-end justify-center gap-2" dir="ltr">
    {order.map((idx, k) => { const t = top[idx]; return (
      <motion.div key={t.score} initial={{ height: 0 }} animate={{ height: h[k] }} transition={{ delay: 0.2 + k * 0.1, duration: 0.5 }}
        className="w-16 rounded-t-xl flex flex-col items-center justify-center overflow-hidden" style={{ background: idx === 0 ? `rgba(${GOLD},0.22)` : `rgba(${BLUE},0.15)`, border: `1px solid ${idx === 0 ? `rgba(${GOLD},0.6)` : `rgba(${BLUE},0.4)`}` }}>
        <span className="text-[14px] font-black text-white">{sc(t.score)}</span>
        <span className="text-[9px] text-slate-300">{t.pct}%</span>
      </motion.div>); })}
  </div>
  <div className="flex justify-center gap-1.5 mt-2" dir="ltr">
    {top.slice(3).map((t) => <span key={t.score} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">{sc(t.score)} · {t.pct}%</span>)}
  </div></>);
}

// 34 — donut chart with legend
function O34({ top }) {
  const colors = ["#38bdf8", "#097adc", "#a78bfa", "#34d399", "#facc15"];
  const total = top.reduce((s, t) => s + t.pct, 0);
  const r = 34, c = 2 * Math.PI * r;
  let acc = 0;
  return (<><Title /><div className="flex items-center justify-center gap-4" dir="ltr">
    <svg width="90" height="90" className="-rotate-90">
      {top.map((t, i) => { const len = (t.pct / total) * c; const off = acc; acc += len; return (
        <motion.circle key={t.score} cx="45" cy="45" r={r} fill="none" stroke={colors[i]} strokeWidth="12"
          strokeDasharray={`${len} ${c}`} strokeDashoffset={-off} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} />); })}
    </svg>
    <div className="space-y-0.5">
      {top.map((t, i) => <div key={t.score} className="flex items-center gap-1.5 text-[10.5px]"><span className="w-2 h-2 rounded-full" style={{ background: colors[i] }} /><span className="font-black text-white w-7">{sc(t.score)}</span><span className="text-slate-400">{t.pct}%</span></div>)}
    </div>
  </div></>);
}

// 35 — heat grid of all scores 0-3 × 0-3, top 5 highlighted
function O35({ top, all }) {
  const topSet = new Set(top.map((t) => t.score));
  const max = Math.max(...Object.values(all));
  return (<><Title /><div className="flex justify-center" dir="ltr">
    <div className="grid grid-cols-5 gap-1 text-[9px]">
      <span />{[0, 1, 2, 3].map((a) => <span key={a} className="text-center text-slate-500">{a}</span>)}
      {[0, 1, 2, 3].map((h) => (
        <React.Fragment key={h}>
          <span className="text-slate-500 flex items-center">{h}</span>
          {[0, 1, 2, 3].map((a) => { const k = `${h}:${a}`; const p = all[k] || 0; return (
            <motion.div key={k} {...pop(h * 4 + a, 0.05)} className="w-9 h-8 rounded-md flex flex-col items-center justify-center"
              style={{ background: `rgba(56,189,248,${0.06 + 0.6 * (p / max)})`, border: topSet.has(k) ? "1.5px solid #f5c518" : "1px solid transparent" }}>
              <span className="font-black text-white text-[10px]">{h}-{a}</span><span className="text-white/70 text-[8px]">{p}%</span>
            </motion.div>); })}
        </React.Fragment>))}
    </div>
  </div><p className="text-center text-[9px] text-slate-500 mt-1">מסגרת זהב = 5 הסבירות ביותר · שורות = בית, עמודות = חוץ</p></>);
}

// 36 — LED scoreboard rows
function O36({ top, teams }) {
  return (<><Title /><div className="rounded-xl p-2 space-y-1" style={{ background: "#020812", border: "1px solid rgba(255,255,255,0.1)" }} dir="ltr">
    {top.map((t, i) => { const [h, a] = parts(t.score); return (
      <motion.div key={t.score} {...pop(i)} className="flex items-center justify-between text-[11px] px-2">
        <span className="text-slate-400 w-20 truncate">{teams[0]}</span>
        <span className="text-amber-300 text-lg tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif", textShadow: "0 0 6px rgba(252,211,77,0.7)" }}>{h} : {a}</span>
        <span className="text-slate-400 w-20 truncate text-right">{teams[1]}</span>
        <span className="text-emerald-400 w-8 text-right" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{t.pct}%</span>
      </motion.div>); })}
  </div></>);
}

// 37 — hero card for #1 + chips for the rest
function O37({ top }) {
  const [first, ...rest] = top;
  return (<><Title /><motion.div {...pop(0)} className="rounded-2xl py-3 text-center mb-2" style={{ background: "linear-gradient(135deg,rgba(9,122,220,0.25),rgba(56,189,248,0.08))", border: "1px solid rgba(56,189,248,0.45)" }}>
    <p className="text-[9.5px] text-sky-300">התוצאה הכי סבירה</p>
    <p className="text-4xl font-black text-white" dir="ltr" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{sc(first.score)}</p>
    <p className="text-[11px] text-sky-200">{first.pct}%</p>
  </motion.div>
  <div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {rest.map((t, i) => (
      <motion.div key={t.score} {...pop(i + 1)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `rgba(${BLUE},0.1)`, border: `1px solid rgba(${BLUE},0.45)` }}>
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span><span className="text-[9px] text-blue-300/70">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 38 — medals list
function O38({ top }) {
  const medal = ["🥇", "🥈", "🥉", "4", "5"];
  return (<><Title /><div className="space-y-1" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">
        <span className="w-5 text-center text-[12px] text-slate-400">{medal[i]}</span>
        <span className="text-[14px] font-black text-white flex-1">{sc(t.score)}</span>
        <span className="text-[11px] text-sky-300 font-bold">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 39 — bubbles sized by probability
function O39({ top }) {
  const max = top[0].pct;
  return (<><Title /><div className="flex items-center justify-center gap-2 h-24" dir="ltr">
    {top.map((t, i) => { const s = 36 + 40 * (t.pct / max); return (
      <motion.div key={t.score} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 300, damping: 15 }}
        className="rounded-full flex flex-col items-center justify-center" style={{ width: s, height: s, background: `radial-gradient(circle at 30% 30%, rgba(56,189,248,0.55), rgba(9,122,220,0.25))`, border: "1px solid rgba(56,189,248,0.6)" }}>
        <span className="font-black text-white" style={{ fontSize: 9 + 5 * (t.pct / max) }}>{sc(t.score)}</span>
        <span className="text-[8px] text-white/80">{t.pct}%</span>
      </motion.div>); })}
  </div></>);
}

// 40 — segmented stacked bar
function O40({ top }) {
  const colors = ["#38bdf8", "#097adc", "#a78bfa", "#34d399", "#facc15"];
  const total = top.reduce((s, t) => s + t.pct, 0);
  return (<><Title /><div className="flex h-8 rounded-full overflow-hidden" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} className="flex items-center justify-center text-[10px] font-black text-black/80" style={{ background: colors[i] }}
        initial={{ width: 0 }} animate={{ width: `${(t.pct / total) * 100}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}>{sc(t.score)}</motion.div>))}
  </div>
  <div className="flex justify-between text-[9px] text-slate-400 mt-1 px-1" dir="ltr">{top.map((t) => <span key={t.score}>{t.pct}%</span>)}</div></>);
}

// 41 — slot machine reel cycling through the scores
function O41({ top }) {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % top.length), 1600); return () => clearInterval(id); }, [top.length]);
  const t = top[i];
  return (<><Title /><div className="flex items-center justify-center gap-3">
    <div className="relative h-16 w-32 overflow-hidden rounded-xl" style={{ background: "#020812", border: "1px solid rgba(56,189,248,0.4)" }}>
      <AnimatePresence mode="popLayout">
        <motion.div key={t.score} initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: -60 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl text-white" dir="ltr" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{sc(t.score)}</span>
          <span className="text-[10px] text-sky-300">#{i + 1} · {t.pct}%</span>
        </motion.div>
      </AnimatePresence>
    </div>
  </div></>);
}

// 42 — stacked card deck, tap to cycle
function O42({ top }) {
  const [i, setI] = useState(0);
  return (<><Title>התוצאות הסבירות ביותר · הקש להבא</Title><div className="relative h-24 flex justify-center cursor-pointer" onClick={() => setI((x) => (x + 1) % top.length)}>
    {top.map((t, k) => { const d = (k - i + top.length) % top.length; if (d > 2) return null; return (
      <motion.div key={t.score} animate={{ y: d * 8, scale: 1 - d * 0.06, opacity: 1 - d * 0.3, zIndex: 10 - d }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="absolute w-40 h-20 rounded-2xl flex items-center justify-between px-4" style={{ background: "linear-gradient(135deg,#0b2a4a,#071629)", border: "1px solid rgba(56,189,248,0.4)" }}>
        <span className="text-[10px] text-slate-400">#{k + 1}</span>
        <span className="text-3xl text-white" dir="ltr" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{sc(t.score)}</span>
        <span className="text-[11px] text-sky-300 font-bold">{t.pct}%</span>
      </motion.div>); })}
  </div></>);
}

// 43 — ladder with connecting line
function O43({ top }) {
  return (<><Title /><div className="relative pr-4" dir="rtl">
    <div className="absolute right-1.5 top-2 bottom-2 w-px bg-sky-400/30" />
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="relative flex items-center gap-3 py-1">
        <span className="absolute -right-[13px] w-2.5 h-2.5 rounded-full" style={{ background: i === 0 ? "#f5c518" : "#38bdf8" }} />
        <span className="text-[14px] font-black text-white" dir="ltr">{sc(t.score)}</span>
        <span className="text-[10px] text-slate-400">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 44 — big numbers row, no boxes
function O44({ top }) {
  return (<><Title /><div className="flex justify-around" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="text-center">
        <p className="text-2xl text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", opacity: 1 - i * 0.13 }}>{sc(t.score)}</p>
        <p className="text-[9px] text-sky-300 mt-0.5">{t.pct}%</p>
      </motion.div>))}
  </div></>);
}

// 45 — mini pitch with score in the center circle
function O45({ top }) {
  return (<><Title /><div className="grid grid-cols-5 gap-1.5" dir="ltr">
    {top.map((t, i) => (
      <motion.div key={t.score} {...pop(i)} className="relative h-16 rounded-md overflow-hidden flex flex-col items-center justify-center" style={{ background: "linear-gradient(180deg,#14532d,#166534)", border: "1px solid rgba(255,255,255,0.25)" }}>
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/30" />
        <div className="absolute w-8 h-8 rounded-full border border-white/30" />
        <span className="relative text-[12px] font-black text-white">{sc(t.score)}</span>
        <span className="relative text-[8px] text-white/80 mt-3">{t.pct}%</span>
      </motion.div>))}
  </div></>);
}

// 46 — ticker tape along the bottom
function O46({ top }) {
  const text = top.map((t, i) => `#${i + 1}  ${sc(t.score)}  ${t.pct}%`).join("   •   ");
  return (<><Title /><style>{`@keyframes ts-tape{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    <div className="overflow-hidden rounded-md py-1.5" style={{ background: "#f5c518" }} dir="ltr">
      <div className="whitespace-nowrap w-max text-[11px] font-black text-black" style={{ animation: "ts-tape 12s linear infinite" }}>{text}   •   {text}   •   </div>
    </div></>);
}

// 47 — radial: scores around a circle
function O47({ top }) {
  return (<><Title /><div className="relative mx-auto w-40 h-40">
    <div className="absolute inset-[38%] rounded-full flex items-center justify-center text-[9px] text-slate-400 text-center" style={{ border: "1px dashed rgba(56,189,248,0.4)" }}>טופ 5</div>
    {top.map((t, i) => { const ang = (i / top.length) * 2 * Math.PI - Math.PI / 2; const x = 50 + 38 * Math.cos(ang), y = 50 + 38 * Math.sin(ang); return (
      <motion.div key={t.score} {...pop(i)} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center px-2 py-0.5 rounded-full"
        style={{ left: `${x}%`, top: `${y}%`, background: `rgba(${BLUE},0.15)`, border: `1px solid rgba(${BLUE},0.5)` }} dir="ltr">
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span><span className="text-[8px] text-sky-300">{t.pct}%</span>
      </motion.div>); })}
  </div></>);
}

// 48 — dot matrix (each dot = 1%)
function O48({ top }) {
  return (<><Title /><div className="space-y-1.5" dir="ltr">
    {top.map((t, i) => (
      <div key={t.score} className="flex items-center gap-2">
        <span className="w-8 text-[12px] font-black text-white">{sc(t.score)}</span>
        <div className="flex flex-wrap gap-[3px] flex-1">
          {Array.from({ length: t.pct }).map((_, k) => <motion.span key={k} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 + i * 0.1 + k * 0.02 }} className="w-2 h-2 rounded-full bg-sky-400" />)}
        </div>
        <span className="text-[10px] text-slate-400 w-8 text-right">{t.pct}%</span>
      </div>))}
  </div></>);
}

// 49 — score vs. team logos row (home name · score · away name)
function O49({ top, teams }) {
  return (<><Title /><div className="space-y-1" dir="ltr">
    {top.map((t, i) => { const [h, a] = parts(t.score); const o = outcome(t.score); return (
      <motion.div key={t.score} {...pop(i)} className="flex items-center gap-2 text-[11px] rounded-lg px-2 py-1 bg-white/[0.03]">
        <span className={`flex-1 truncate ${o === "1" ? "text-emerald-300 font-bold" : "text-slate-400"}`}>{teams[0]}</span>
        <span className="text-[14px] font-black text-white w-12 text-center">{h} - {a}</span>
        <span className={`flex-1 truncate text-right ${o === "2" ? "text-sky-300 font-bold" : "text-slate-400"}`}>{teams[1]}</span>
        <span className="w-9 text-right text-yellow-300 font-bold">{t.pct}%</span>
      </motion.div>); })}
  </div></>);
}

// 50 — tags + a "tap to predict" CTA (copies the score into the prediction)
function O50({ top }) {
  const [picked, setPicked] = useState(null);
  return (<><Title>התוצאות הסבירות ביותר · הקש כדי לנחש</Title><div className="flex flex-wrap gap-1.5 justify-center" dir="ltr">
    {top.map((t, i) => (
      <motion.button key={t.score} {...pop(i)} whileTap={{ scale: 0.92 }} onClick={() => setPicked(t.score)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: picked === t.score ? "rgba(52,211,153,0.2)" : `rgba(${BLUE},0.1)`, border: `1px solid ${picked === t.score ? "rgba(52,211,153,0.8)" : `rgba(${BLUE},0.5)`}` }}>
        <span className="text-[11px] font-black text-white">{sc(t.score)}</span><span className="text-[9px] text-blue-300/70">{t.pct}%</span>
      </motion.button>))}
  </div>
  {picked && <p className="text-center text-[10px] text-emerald-300 mt-2">בפועל: ימלא {sc(picked)} בשדות הניחוש של המשחק</p>}</>);
}

const OPTIONS = [
  ["גלולות כחולות (המקור)", "שורת התגיות הקודמת: תוצאה + אחוז בגלולה כחולה זוהרת.", O1],
  ["גלולות זהב שקופות", "באותו סגנון של התג League Phase וכפתור זירת המשחק.", O2],
  ["צבע לפי תוצאה", "ירוק = ניצחון בית, צהוב = תיקו, תכלת = ניצחון חוץ.", O3],
  ["גודל לפי סבירות", "ככל שהתוצאה סבירה יותר — הגלולה גדולה יותר.", O4],
  ["שקיפות לפי סבירות", "הסבירה ביותר בוהקת, האחרונות דהויות.", O5],
  ["מוביל עם כתר", "התוצאה הראשונה גדולה ובזהב, השאר קטנות מתחת.", O6],
  ["מספר דירוג", "עיגול קטן עם 1-5 בתחילת כל גלולה.", O7],
  ["אחוז כתג פינתי", "האחוז יושב כבאדג' בפינת הגלולה.", O8],
  ["תגית דו-שורתית", "תוצאה גדולה, אחוז מתחת.", O9],
  ["כרטיס כניסה", "תגית מלבנית עם קו מקווקו בין התוצאה לאחוז.", O10],
  ["משושים", "תגיות בצורת משושה, הראשונה בגרדיאנט מלא.", O11],
  ["אריחים מרובעים", "5 ריבועים בשורה, הראשון מודגש.", O12],
  ["ספרות לוח תוצאות", "כל תוצאה כשתי ספרות בסגנון לוח אצטדיון.", O13],
  ["מוביל פועם", "התגית הראשונה מהבהבת בזוהר ניאון.", O14],
  ["סרט נע", "התגיות גוללות ברצף מימין לשמאל.", O15],
  ["תגית + פס קטן", "מתחת לכל תגית פס דק שמראה את הסבירות.", O16],
  ["תגית + טבעת", "טבעת התקדמות קטנה בתוך כל תגית.", O17],
  ["תגית מפוצלת בית/חוץ", "חצי ירוק לשערי הבית, חצי תכלת לשערי החוץ.", O18],
  ["ענן תגיות", "תגיות מפוזרות ומוטות, גודל לפי סבירות.", O19],
  ["עמודת תגיות", "התגיות אחת מתחת לשנייה, ממורכזות.", O20],
  ["רצועה נגללת", "תגיות גדולות בשורה, גוללים באצבע.", O21],
  ["אחוז קטן מעל", "האחוז כספרה עילית קטנה ליד התוצאה.", O22],
  ["זכוכית + ברק", "תגיות זכוכית עם קרן אור שעוברת עליהן.", O23],
  ["הקש לחשיפה", "רואים רק תוצאות; הקשה מחליפה לאחוז.", O24],
  ["מקובץ לפי תוצאה", "שורה לכל קבוצה ושורה לתיקו.", O25],
  ["גרדיאנט מלא", "גלולות כחולות מלאות עם צל.", O26],
  ["קו מתאר בלבד", "מינימליסטי: מסגרת דקה, בלי רקע.", O27],
  ["מילוי נוזלי", "הרקע של כל תגית מתמלא לפי הסבירות.", O28],
  ["להבה למוביל", "התוצאה הכי סבירה בכתום עם להבה.", O29],
  ["נפילה אחת-אחת", "התגיות נופלות למקום בקפיץ, אחת אחרי השנייה.", O30],
  ["פסים אופקיים (הנוכחי)", "מה שיש היום בטאב תחזית.", O31],
  ["עמודות", "גרף עמודות קטן.", O32],
  ["פודיום", "3 הראשונות על פודיום, השאר כתגיות.", O33],
  ["דונאט", "עוגה + מקרא.", O34],
  ["מפת חום", "כל התוצאות 0-3 בטבלה, 5 הסבירות במסגרת זהב.", O35],
  ["לוח LED", "שורות לוח תוצאות זוהר עם שמות הקבוצות.", O36],
  ["כרטיס גיבור", "התוצאה הראשונה ענקית, השאר תגיות מתחת.", O37],
  ["מדליות", "רשימה עם 🥇🥈🥉.", O38],
  ["בועות", "עיגולים בגודל לפי סבירות.", O39],
  ["פס מפולח", "פס אחד מחולק ל-5 חלקים.", O40],
  ["מכונת מזל", "התוצאות מתחלפות בגלגול כל 1.6 שניות.", O41],
  ["חפיסת קלפים", "הקשה מעבירה לקלף הבא.", O42],
  ["סולם", "קו אנכי עם נקודות, הראשונה בזהב.", O43],
  ["מספרים גדולים בלבד", "בלי מסגרות, רק ספרות ענקיות שדוהות.", O44],
  ["מיני-מגרשים", "כל תוצאה על מגרש ירוק קטן.", O45],
  ["סרט זהב נע", "סרט חדשות צהוב עם הדירוג.", O46],
  ["מעגל", "5 התגיות מסודרות סביב עיגול.", O47],
  ["מטריצת נקודות", "כל נקודה = 1%.", O48],
  ["שורת קבוצות", "שם בית · תוצאה · שם חוץ, המנצחת מודגשת.", O49],
  ["תגיות לחיצות לניחוש", "הקשה על תגית ממלאת את הניחוש (רעיון).", O50],
];

export default function AdminTopScoresOptions() {
  const top = useMemo(() => getTopScores(DEMO.score_odds, 5), []);
  const all = useMemo(() => Object.fromEntries(getTopScores(DEMO.score_odds, 99).map((t) => [t.score, t.pct])), []);
  const teams = [DEMO.team_a, DEMO.team_b];
  const [replay, setReplay] = useState({});
  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold text-white mb-1">50 תצוגות "התוצאות הסבירות ביותר"</h2>
      <p className="text-slate-400 text-sm mb-6">דמו בלבד ({teams[0]} נגד {teams[1]}). 1-30 תגיות, 31-50 תצוגות אחרות. הטאב האמיתי לא שונה.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {OPTIONS.map(([title, tagline, Comp], i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center justify-center rounded-full text-[11px] font-black flex-shrink-0" style={{ width: 22, height: 22, background: "linear-gradient(135deg,#f5c518,#fde68a)", color: "#000" }}>{i + 1}</span>
                  <h3 className="text-white font-bold text-sm">{title}</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{tagline}</p>
              </div>
              <button onClick={() => setReplay((r) => ({ ...r, [i]: (r[i] || 0) + 1 }))} className="flex-shrink-0 text-slate-400 hover:text-white" title="הפעל שוב">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#060e1c" }}>
              <Comp key={replay[i] || 0} top={top} teams={teams} all={all} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
