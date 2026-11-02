import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { User, Prediction, Match, PublicProfile } from "@/api/entities";
import { ShineBorder } from "@/components/magicui/shine-border";

// "מסלול הדירוג": how every participant's place moved, match night after
// match night (or round after round), replayed from the first night to now.
// Two views: rank lanes (compare one, several or everyone) and the table.
// Opened from a button under the Leaderboard as a full screen from the left.
// Time runs right → left (RTL): the first night on the right.

const GOLD = "#facc15";
const GREEN = "#34d399"; // the timeline
// the others, from the app's own colours: blue, green, bronze, red, silver, light blue (you are gold)
const COLORS = ["#097adc", "#34d399", "#cd7f32", "#f87171", "#c0c0c0", "#7cadee"];
// each colour is drawn as a gradient, light → deep, along the line
const GRAD = {
  [GOLD]: ["#fde68a", "#f59e0b"], "#097adc": ["#7cadee", "#0662b5"], "#34d399": ["#86efac", "#059669"], "#cd7f32": ["#e8b07a", "#9a5b22"],
  "#f87171": ["#fca5a5", "#dc2626"], "#c0c0c0": ["#f1f5f9", "#8a96a8"], "#7cadee": ["#bae6fd", "#3b8fe0"],
};
const grad = (c) => GRAD[c] || [c, c];
const MEDAL = ["#facc15", "#e2e8f0", "#f59e0b"];
const SPRING = { type: "spring", duration: 0.75, bounce: 0.12 };
const STEP_MS = 1300; // one night (or round) of playback
const fmt = (v) => Number(v).toFixed(2).replace(/\.?0+$/, "");
const easeInOut = (f) => (f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2);
const lerpAt = (arr, e) => { const i = Math.floor(e); if (i >= arr.length - 1) return arr[arr.length - 1]; return arr[i] + (arr[i + 1] - arr[i]) * (e - i); };
const dm = (date) => { const [, m, d] = date.split("-"); return `${+d}.${+m}`; };

// ── data ────────────────────────────────────────────────────────────────
// Cumulative points after every match night that has calculated matches,
// from each participant's latest prediction per match (as the table counts
// them); the place on a night = the order by those points.
function buildHistory(matches, predictions, profiles, meId) {
  const calc = matches.filter((m) => m.is_score_calculated && m.match_date);
  const byId = Object.fromEntries(calc.map((m) => [m.id, m]));
  const nights = [...new Set(calc.map((m) => m.match_date.slice(0, 10)))].sort();
  if (!nights.length) return null;
  const roundOf = {};
  calc.forEach((m) => { roundOf[m.match_date.slice(0, 10)] = m.round_id; });
  const roundNo = {};
  [...new Set(nights.map((d) => roundOf[d]))].forEach((r, i) => { roundNo[r] = i + 1; });
  const steps = nights.map((d) => ({ date: d, round: roundNo[roundOf[d]] }));

  const latest = {};
  predictions.forEach((p) => {
    if (!byId[p.match_id]) return;
    const k = `${p.user_id}_${p.match_id}`;
    if (!latest[k] || new Date(p.created_at || p.created_date) > new Date(latest[k].created_at || latest[k].created_date)) latest[k] = p;
  });
  const perNight = {};
  Object.values(latest).forEach((p) => {
    const i = nights.indexOf(byId[p.match_id].match_date.slice(0, 10));
    (perNight[p.user_id] ||= Array(nights.length).fill(0))[i] += Number(p.points_earned) || 0;
  });
  const names = Object.fromEntries(profiles.map((p) => [p.user_id, p.display_name]));
  const users = Object.keys(perNight).filter((id) => names[id]).map((id) => {
    let t = 0;
    return { id, name: names[id].trim(), me: id === meId, points: perNight[id].map((v) => (t = Number((t + v).toFixed(2)))) };
  });
  steps.forEach((_, i) => {
    [...users].sort((a, b) => b.points[i] - a.points[i] || a.name.localeCompare(b.name)).forEach((u, r) => { (u.ranks ||= [])[i] = r + 1; });
  });
  let c = 0;
  users.forEach((u) => { u.color = u.me ? GOLD : COLORS[c++ % COLORS.length]; });
  return { steps, users };
}

// one load shared by the button and the screen, reused for a minute
let cached = null;
const loadHistory = () => {
  if (!cached || Date.now() - cached.at > 60e3) {
    const promise = Promise.all([User.me().catch(() => null), Match.list(), Prediction.list(), PublicProfile.list()])
      .then(([me, matches, predictions, profiles]) => buildHistory(matches, predictions, profiles, me?.id));
    cached = { at: Date.now(), promise };
    promise.catch(() => { cached = null; });
  }
  return cached.promise;
};
function useRankHistory(open) {
  const [state, setState] = useState({ loading: true, data: null });
  useEffect(() => {
    if (!open) return;
    let alive = true;
    loadHistory()
      .then((data) => alive && setState({ loading: false, data }))
      .catch(() => alive && setState({ loading: false, data: null, error: true }));
    return () => { alive = false; };
  }, [open]);
  return state;
}

// ── playback ────────────────────────────────────────────────────────────
// p = position in steps (0 … n-1, fractional while moving); e = eased p
function usePlayback(n) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [p, setP] = useState(reduce ? n - 1 : 0);
  const [playing, setPlaying] = useState(false);
  const first = useRef(true);
  useEffect(() => { if (inView && !reduce) setPlaying(true); }, [inView]);
  useEffect(() => { if (first.current) { first.current = false; return; } setPlaying(false); setP(n - 1); }, [n]);
  useEffect(() => {
    if (!playing) return;
    let raf, last = performance.now();
    const tick = (now) => {
      // a frame's timestamp can be a little before `last` — never step backwards past 0
      const dt = Math.max(0, now - last); last = now;
      setP((x) => { const nx = Math.min(n - 1, x + dt / STEP_MS); if (nx >= n - 1) setPlaying(false); return nx; });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, n]);
  const toggle = () => { if (playing) return setPlaying(false); if (p >= n - 1) setP(0); setPlaying(true); };
  const seek = (v) => { setPlaying(false); setP(v); };
  const i = Math.max(0, Math.min(Math.floor(p), n - 1));
  const e = i >= n - 1 ? n - 1 : i + easeInOut(p - i);
  return { ref, p, e, playing, toggle, seek };
}

function Timeline({ pl, n, label, tick }) {
  const step = Math.min(n - 1, Math.round(pl.p));
  return (
    <div dir="rtl" className="mt-3 flex items-center gap-3">
      <motion.button whileTap={{ scale: 0.92 }} onClick={pl.toggle} aria-label={pl.playing ? "עצור" : "נגן"}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: GREEN, color: "#0b1430", boxShadow: `0 0 20px ${GREEN}59` }}>
        {pl.playing ? <Pause size={16} fill="currentColor" /> : pl.p >= n - 1 ? <RotateCcw size={16} strokeWidth={2.6} /> : <Play size={16} fill="currentColor" className="mr-[-2px]" />}
      </motion.button>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 text-[12px] font-bold text-slate-200">{label(step)}</div>
        <div className="relative h-5">
          <div className="absolute inset-x-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-white/10" />
          <div className="absolute right-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full" style={{ width: `${n > 1 ? (pl.e / (n - 1)) * 100 : 100}%`, background: GREEN }} />
          {n > 1 && Array.from({ length: n }, (_, i) => (
            <span key={i} className="absolute top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full" style={{ right: `${(i / (n - 1)) * 100}%`, background: i <= pl.e + 0.001 ? GREEN : "#334155" }} />
          ))}
          <span className="absolute top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full border-2" style={{ right: `${n > 1 ? (pl.e / (n - 1)) * 100 : 100}%`, background: "#0b1430", borderColor: GREEN, boxShadow: `0 0 0 4px ${GREEN}2e` }} />
          {n > 1 && <input dir="rtl" type="range" min="0" max={n - 1} step="0.01" value={pl.p} onChange={(e) => pl.seek(+e.target.value)} aria-label="ציר הזמן" className="absolute inset-0 h-5 w-full cursor-pointer opacity-0" />}
        </div>
      </div>
    </div>
  );
}

// the table: rows slide to their place, giant outlined place numbers
function TableView({ users, idx, pl }) {
  const rows = users.map((u) => ({ u, v: lerpAt(idx.map((k) => u.points[k]), pl.e) })).sort((a, b) => b.v - a.v);
  const step = Math.min(idx.length - 1, Math.round(pl.p));
  return (
    <div dir="rtl" className="flex flex-col gap-1">
      {rows.map(({ u, v }, i) => {
        const d = step ? u.ranks[idx[step - 1]] - u.ranks[idx[step]] : 0;
        return (
          <motion.div layout transition={SPRING} key={u.id} className="relative flex h-11 items-center gap-2 overflow-hidden rounded-xl px-3"
            style={{ background: u.me ? "linear-gradient(90deg, rgba(250,204,21,0.04), rgba(250,204,21,0.16))" : "rgba(255,255,255,0.035)", border: `1px solid ${u.me ? "rgba(250,204,21,0.45)" : "rgba(255,255,255,0.05)"}` }}>
            <span className="absolute -right-1 -top-3 select-none text-[52px] font-black italic leading-none" style={{ color: "transparent", WebkitTextStroke: `1.5px ${i < 3 ? MEDAL[i] : "rgba(148,163,184,0.35)"}`, opacity: 0.55 }}>{i + 1}</span>
            <span className="relative mr-8 flex-1 truncate text-[13.5px] font-bold" style={{ color: u.me ? GOLD : "#e2e8f0" }}>{u.name}</span>
            <span className="relative text-[12.5px] font-bold tabular-nums text-emerald-400">{fmt(v)}</span>
            <span className="relative w-8 text-left text-[11px] font-black tabular-nums" style={{ color: d > 0 ? "#34d399" : d < 0 ? "#f87171" : "#64748b" }}>{d > 0 ? `▲${d}` : d < 0 ? `▼${-d}` : "•"}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// rank lanes: glass lanes with medal places, name tags riding the lines
const W = 340;
function LanesView({ users, idx, tick, pl, sel, setSel, stepW }) {
  const clip = useId().replace(/:/g, "");
  const n = idx.length, P = users.length;
  const laneH = 28;
  const H = 14 + 26 + laneH * (P - 1);
  const pad = { l: 44, r: 30, t: 14, b: 26 };
  // many nights or rounds: the chart grows wider than the screen and scrolls
  // sideways by finger; a short season fits the width as it is
  const Wd = n > 1 && (W - pad.l - pad.r) / (n - 1) < stepW ? pad.l + pad.r + (n - 1) * stepW : W;
  const scroll = Wd > W;
  const scroller = useRef(null);
  const x = (i) => (n > 1 ? Wd - pad.r - (i * (Wd - pad.l - pad.r)) / (n - 1) : (Wd - pad.r + pad.l) / 2);
  const y = (r) => pad.t + (P > 1 ? ((r - 1) * (H - pad.t - pad.b)) / (P - 1) : 0);
  const pts = (u) => idx.map((k, i) => [x(i), y(u.ranks[k])]);
  const path = (p) => p.reduce((d, [px, py], i) => (i ? `${d} C${(p[i - 1][0] + px) / 2},${p[i - 1][1]} ${(p[i - 1][0] + px) / 2},${py} ${px},${py}` : `M${px},${py}`), "");
  // the point on the drawn curve at eased position e
  const at = (p, e) => {
    const i = Math.floor(e); if (i >= n - 1) return p[n - 1];
    const f = e - i, [ax, ay] = p[i], [bx, by] = p[i + 1], cx = (ax + bx) / 2, g = 1 - f;
    return [g * g * g * ax + 3 * g * g * f * cx + 3 * g * f * f * cx + f * f * f * bx, g * g * g * ay + 3 * g * g * f * ay + 3 * g * f * f * by + f * f * f * by];
  };
  const last = idx[n - 1];
  const byNow = [...users].sort((a, b) => a.ranks[last] - b.ranks[last]);
  const on = users.filter((u) => sel.includes(u.id));
  const all = sel.length === P;
  const meId = users.find((u) => u.me)?.id;
  const tog = (id) => setSel((s) => (s.includes(id) ? (s.length > 1 ? s.filter((v) => v !== id) : s) : [...s, id]));
  const headX = x(pl.e);
  // keep the moving names in view while it plays (and on open / when the scale
  // changes): they ride near the left edge, so the nights already played stay
  // on screen to their right for as long as possible
  const follow = () => { const el = scroller.current; if (el && scroll) el.scrollLeft = (headX / Wd) * el.scrollWidth - el.clientWidth * 0.22; };
  useEffect(() => { if (pl.playing) follow(); }, [pl.e]);
  useEffect(follow, [Wd]);
  return (
    <div>
      <div dir="rtl" className="mb-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.ceil((P + 1) / 2)}, minmax(0, 1fr))` }}>
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => setSel(all ? [meId || byNow[0].id] : users.map((u) => u.id))}
          className="truncate rounded-full px-1.5 py-[5px] text-[11px] font-bold transition-colors duration-200"
          style={{ background: all ? "#fff" : "rgba(255,255,255,0.06)", color: all ? "#0b1430" : "#cbd5e1", border: "1px solid rgba(255,255,255,0.18)" }}>{all ? (meId ? "רק אני" : "רק המוביל") : "כולם"}</motion.button>
        {byNow.map((u) => { const o = sel.includes(u.id); return (
          <motion.button key={u.id} whileTap={{ scale: 0.94 }} onClick={() => tog(u.id)}
            className="truncate rounded-full px-1.5 py-[5px] text-[11px] font-bold transition-colors duration-200"
            style={{ background: o ? `${u.color}22` : "rgba(255,255,255,0.04)", color: o ? u.color : "#94a3b8", border: `1px solid ${o ? u.color : "rgba(148,163,184,0.16)"}` }}>
            {u.name}
          </motion.button>); })}
      </div>
      <div className="relative">
      <div ref={scroller} dir="ltr" className={scroll ? "overflow-x-auto overscroll-x-contain" : ""} style={{ scrollbarWidth: "none" }}>
      <svg viewBox={`0 0 ${Wd} ${H}`} width={`${(Wd / W) * 100}%`} style={{ display: "block", overflow: "visible", direction: "ltr", maxWidth: "none" }}>
        <defs>
          <clipPath id={clip}><rect x={headX - 2} y="-20" width={Wd - headX + 40} height={H + 40} /></clipPath>
          {users.map((u, i) => <linearGradient key={u.id} id={`${clip}-l${i}`} gradientUnits="userSpaceOnUse" x1={Wd - pad.r} x2={pad.l} y1="0" y2="0"><stop offset="0" stopColor={grad(u.color)[0]} /><stop offset="1" stopColor={grad(u.color)[1]} /></linearGradient>)}
          {users.map((u, i) => <linearGradient key={u.id} id={`${clip}-t${i}`} x1="1" x2="0" y1="0" y2="0"><stop offset="0" stopColor={grad(u.color)[0]} /><stop offset="1" stopColor={grad(u.color)[1]} /></linearGradient>)}
        </defs>
        {Array.from({ length: P }, (_, r) => { const m = r < 3, cy = y(r + 1); return (
          <g key={r}>
            <rect x={pad.l - 12} y={cy - laneH / 2 + 2} width={Wd - pad.l - pad.r + 18} height={laneH - 4} rx="7" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" />
          </g>); })}
        {users.filter((u) => !sel.includes(u.id)).map((u) => <path key={u.id} d={path(pts(u))} stroke="rgba(148,163,184,0.13)" strokeWidth="1.5" fill="none" />)}
        <g clipPath={`url(#${clip})`}>
          {on.map((u) => <path key={u.id} d={path(pts(u))} stroke={`url(#${clip}-l${users.indexOf(u)})`} strokeWidth={u.me ? 3.5 : 2.6} strokeLinecap="round" fill="none" style={{ filter: `drop-shadow(0 0 ${u.me ? 5 : 3}px ${u.color}${u.me ? "8c" : "55"})` }} />)}
        </g>
        {[...on].sort((a, b) => a.me - b.me).map((u) => {
          const [hx, hy] = at(pts(u), pl.e);
          const w = u.name.length * 7 + 14;
          return (
            <g key={u.id} transform={`translate(${hx},${hy})`}>
              <rect x={-w / 2} y="-9.5" width={w} height="19" rx="9.5" fill="#0b1430" stroke={`url(#${clip}-t${users.indexOf(u)})`} strokeWidth="1.8" />
              <text y="3.8" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={grad(u.color)[0]}>{u.name}</text>
            </g>
          );
        })}
        {idx.map((k, i) => { const cur = Math.abs(pl.e - i) < 0.5; return <text key={k} x={x(i)} y={H - 6} textAnchor="middle" fontSize={n <= 4 ? 10 : 9} fontWeight={cur ? 800 : 400} fill={cur ? GREEN : "rgba(148,163,184,0.6)"}>{tick(k)}</text>; })}
      </svg>
      </div>
      {/* the places stay put on the right while the chart scrolls under them */}
      <svg viewBox={`0 0 30 ${H}`} width={`${(30 / W) * 100}%`} className="pointer-events-none absolute right-0 top-0" style={{ overflow: "visible" }}>
        {scroll && <rect x="0" y="0" width="30" height={H - pad.b + 8} fill={`url(#${clip}-fade)`} />}
        <defs><linearGradient id={`${clip}-fade`} x1="0" x2="1"><stop offset="0" stopColor="#050b22" stopOpacity="0" /><stop offset="0.45" stopColor="#050b22" stopOpacity="0.9" /></linearGradient></defs>
        {Array.from({ length: P }, (_, r) => { const m = r < 3, cy = y(r + 1); return (
          <g key={r}>
            <rect x="4" y={cy - 8} width="24" height="16" rx="8" fill={m ? MEDAL[r] : "#26324a"} />
            <text x="16" y={cy + 3.5} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={m ? "#1a1200" : "#cbd5e1"}>{r + 1}</text>
          </g>); })}
      </svg>
      </div>
      {scroll && <p dir="rtl" className="mt-1 text-center text-[10.5px] text-slate-500">החלק ימינה לערבים הקודמים, שמאלה לאחרונים</p>}
    </div>
  );
}

export function RankJourneyView({ data, palette, showAll = true }) {
  const { steps } = data;
  // a palette (other participants' colours) can be swapped in; you stay gold
  const users = useMemo(() => { if (!palette) return data.users; let c = 0; return data.users.map((u) => ({ ...u, color: u.me ? GOLD : palette[c++ % palette.length] })); }, [data, palette]);
  const [view, setView] = useState("lanes");
  const [mode, setMode] = useState("night");
  const leaders = [...users].sort((a, b) => a.ranks[steps.length - 1] - b.ranks[steps.length - 1]);
  const me = users.find((u) => u.me);
  const [sel, setSel] = useState(() => showAll ? users.map((u) => u.id) : [...new Set([me?.id, leaders[0].id === me?.id ? leaders[1]?.id : leaders[0].id].filter(Boolean))]);
  const MODES = useMemo(() => {
    const roundEnds = [...new Set(steps.map((s) => s.round))].map((r) => steps.map((s) => s.round).lastIndexOf(r));
    return {
      night: { idx: steps.map((_, i) => i), label: (i) => `${dm(steps[i].date)} (מחזור ${steps[i].round})`, tick: (i) => dm(steps[i].date) },
      round: { idx: roundEnds, label: (i) => `מחזור ${steps[i].round}`, tick: (i) => `מחזור ${steps[i].round}` },
    };
  }, [steps]);
  const M = MODES[mode];
  const n = M.idx.length;
  const pl = usePlayback(n);
  const VIEW = [["lanes", "מסלול דירוג", "איך המקום השתנה"], ["table", "טבלה", "נקודות ומקום"]];
  return (
    <div ref={pl.ref} dir="rtl">
      <div className="mb-3 flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2">
          {VIEW.map(([key, l, sub]) => { const on = view === key; return (
            <motion.button whileTap={{ scale: 0.97 }} key={key} onClick={() => setView(key)} className="flex flex-col items-center rounded-xl py-1.5 transition-colors duration-200"
              style={{ background: on ? `${GOLD}1f` : "rgba(255,255,255,0.03)", border: `1.5px solid ${on ? GOLD : "rgba(255,255,255,0.07)"}`, color: on ? GOLD : "#64748b" }}>
              <span className="text-[13px] font-black">{l}</span>
              <span className="text-[9.5px]" style={{ color: on ? "#cbd5e1" : "#475569" }}>{sub}</span>
            </motion.button>); })}
        </div>
        <div className="flex justify-center gap-1.5">
          {[["night", "לפי ערב"], ["round", "לפי מחזור"]].map(([key, l]) => (
            <button key={key} onClick={() => setMode(key)} className="rounded-full px-3 py-1 text-[11.5px] font-bold transition-colors duration-200"
              style={{ background: mode === key ? `${GOLD}26` : "transparent", color: mode === key ? GOLD : "#64748b", border: `1px solid ${mode === key ? GOLD : "rgba(148,163,184,0.2)"}` }}>{l}</button>
          ))}
        </div>
      </div>
      {view === "table"
        ? <TableView users={users} idx={M.idx} pl={pl} />
        : <LanesView users={users} idx={M.idx} tick={M.tick} pl={pl} sel={sel} setSel={setSel} stepW={mode === "round" ? 60 : 46} />}
      <Timeline pl={pl} n={n} label={(s) => M.label(M.idx[s])} />
    </div>
  );
}

// the full screen, sliding in from the left (portal: the Leaderboard panel is
// itself transformed, which would trap a fixed child inside it)
export const useRankJourneyData = useRankHistory;

export function RankJourneySheet({ open, onClose, palette }) {
  const { loading, data, error } = useRankHistory(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="rank-journey" dir="rtl" className="fixed inset-0 z-[70] flex flex-col"
          initial={{ x: "-100%" }} animate={{ x: 0, transition: { type: "spring", duration: 0.55, bounce: 0.08 } }} exit={{ x: "-100%", transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] } }}
          style={{ background: "radial-gradient(120% 60% at 50% -10%, rgba(250,204,21,0.10), transparent 60%), #050b22", boxShadow: "20px 0 60px rgba(0,0,0,0.5)" }}>
          <div className="flex items-center justify-between px-4 pb-2" style={{ paddingTop: "max(14px, env(safe-area-inset-top, 0px))" }}>
            <div>
              <h2 className="text-[18px] font-black text-white">מסלול הדירוג</h2>
              <p className="text-[11.5px] text-slate-400">איך המקום של כל משתתף השתנה לאורך העונה</p>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} aria-label="סגור"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.07] text-slate-200 transition-colors duration-150 hover:bg-white/[0.12]" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <X size={19} />
            </motion.button>
          </div>
          <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom, 0px))" }}>
            <div className="mx-auto max-w-[440px]">
              {loading ? <div className="mt-6 space-y-2">{Array(6).fill(0).map((_, i) => <div key={i} className="h-9 animate-pulse rounded-xl bg-slate-800/50" />)}</div>
                : data ? <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.3, ease: [0.23, 1, 0.32, 1] } }}><RankJourneyView data={data} palette={palette} /></motion.div>
                : <p className="mt-10 text-center text-[14px] text-slate-400">{error ? "לא הצלחנו לטעון את הנתונים, נסה שוב" : "המסלול יופיע אחרי שיחושבו המשחקים הראשונים"}</p>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// the button under the Leaderboard: everyone's path faint, yours replaying
export function RankJourneyButton({ onClick }) {
  const { data } = useRankHistory(true);
  const w = 220, h = 52;
  const steps = data?.steps.length || 0;
  const pathOf = (u) => u.ranks.map((r, i) => [w - 8 - (steps > 1 ? (i * (w - 16)) / (steps - 1) : (w - 16) / 2), 8 + ((r - 1) * (h - 16)) / Math.max(1, data.users.length - 1)]);
  const curve = (p) => p.reduce((d, [x, y], i) => (i ? `${d} C${(p[i - 1][0] + x) / 2},${p[i - 1][1]} ${(p[i - 1][0] + x) / 2},${y} ${x},${y}` : `M${x},${y}`), "");
  const me = data?.users.find((u) => u.me);
  const lanes = Math.max(2, data?.users.length || 7);
  return (
    <motion.button whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }} onClick={onClick} className="relative w-full rounded-2xl p-2.5 text-right"
      style={{ background: "linear-gradient(160deg, rgba(19,37,74,0.95), rgba(12,24,50,0.95))", border: "1px solid rgba(148,163,184,0.16)" }}>
      <ShineBorder borderRadius={16} borderWidth={1.5} duration={8} shineColor={["#facc15", "#fde68a", "#f59e0b"]} />
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ direction: "ltr", overflow: "visible" }}>
        {Array.from({ length: lanes }, (_, r) => <rect key={r} x="2" y={8 + (r * (h - 16)) / (lanes - 1) - 2.5} width={w - 4} height="5" rx="2.5" fill={r < 3 ? "rgba(250,204,21,0.10)" : "rgba(255,255,255,0.04)"} />)}
        {data && steps > 1 && data.users.filter((u) => !u.me).map((u) => <path key={u.id} d={curve(pathOf(u))} stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" fill="none" />)}
        {me && steps > 1 && <>
          <path d={curve(pathOf(me))} stroke="rgba(250,204,21,0.4)" strokeWidth="2" fill="none" />
          <circle r="4.5" fill={GOLD} style={{ filter: "drop-shadow(0 0 4px #facc15)" }}>
            <animateMotion dur="4.8s" repeatCount="indefinite" path={curve(pathOf(me))} keyPoints="0;1;1" keyTimes="0;0.83;1" calcMode="linear" />
          </circle>
        </>}
      </svg>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[13px] font-black text-yellow-300">צפה במסלול הדירוג</span>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ background: GOLD, color: "#0b1430", boxShadow: `0 0 14px ${GOLD}66` }}><Play size={12} fill="currentColor" className="mr-[-1px]" /></span>
      </div>
    </motion.button>
  );
}
