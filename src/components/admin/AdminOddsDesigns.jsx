import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TeamFlag from "@/components/TeamFlag";
import { getTeamColor } from "@/utils/teamColors";
import { Match } from "@/api/entities";
import { VARIANTS2 } from "./AdminOddsDesigns2";
import { VARIANTS3 } from "./AdminOddsDesigns3";

// Admin playground: 20 ways to show a match's "יחסים" (the markets tab in the
// scoring-rules modal) — game direction, both teams score, goal range — on a
// real match. Points double as odds (lower = likelier), so each market's
// implied probability is 1/points normalized within the market.

// ── data ─────────────────────────────────────────────────────────────────────
export function marketsOf(m) {
  const mk = (items) => {
    const inv = items.map((i) => (i.pts > 0 ? 1 / i.pts : 0));
    const sum = inv.reduce((a, b) => a + b, 0) || 1;
    const out = items.map((i, k) => ({ ...i, p: Math.round((inv[k] / sum) * 100) }));
    const fav = out.reduce((a, b) => (b.p > a.p ? b : a), out[0]);
    return out.map((o) => ({ ...o, fav: o === fav }));
  };
  const short = (n) => (n || "").trim();
  return {
    dir: mk([
      { key: "home", label: short(m.team_a), short: "1", pts: Number(m.home_win_points) || 0 },
      { key: "draw", label: "תיקו", short: "X", pts: Number(m.draw_points) || 0 },
      { key: "away", label: short(m.team_b), short: "2", pts: Number(m.away_win_points) || 0 },
    ]),
    btts: mk([
      { key: "yes", label: "כן", short: "כן", pts: Number(m.btts_yes_points) || 0 },
      { key: "no", label: "לא", short: "לא", pts: Number(m.btts_no_points) || 0 },
    ]),
    goals: mk([
      { key: "g02", label: "0–2", short: "0–2", pts: Number(m.goals_0_2_points) || 0 },
      { key: "g34", label: "3–4", short: "3–4", pts: Number(m.goals_3_4_points) || 0 },
      { key: "g5", label: "5+", short: "5+", pts: Number(m.goals_5_plus_points) || 0 },
    ]),
  };
}
export const TITLES = { dir: "כיוון משחק", btts: "שתי קבוצות כובשות", goals: "טווח שערים" };
export const fmt = (n) => (Math.round(n * 100) / 100).toString();
const C = { gold: "#facc15", mint: "#34d399", sky: "#7cadee", rose: "#fb7185", ink: "#e8eefc", dim: "#8d9bbd" };

const Flag = ({ m, side, size = "w-6 h-6" }) => (
  <TeamFlag logo={side === "a" ? m.team_a_logo : m.team_b_logo} name={side === "a" ? m.team_a : m.team_b} className={size} animate={false} />
);
const Label = ({ children }) => <div className="text-[11px] font-bold text-slate-400 mb-1.5">{children}</div>;
const usePick = () => {
  const [pick, setPick] = useState({});
  return [pick, (mk, key) => setPick((p) => ({ ...p, [mk]: p[mk] === key ? null : key }))];
};

// ── 1. current ───────────────────────────────────────────────────────────────
function V1({ k }) {
  const theme = { dir: ["text-sky-300", "rgba(9,122,220,.08)"], btts: ["text-emerald-400", "rgba(16,185,129,.07)"], goals: ["text-sky-300", "rgba(14,165,233,.07)"] };
  return (
    <div className="space-y-4">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk}>
          <Label>{TITLES[mk]}</Label>
          <div className="flex rounded-xl overflow-hidden border border-white/10">
            {k[mk].map((o, i) => (
              <div key={o.key} className="flex-1 flex flex-col items-center gap-1 py-3" style={{ background: theme[mk][1], borderRight: i ? "1px solid rgba(255,255,255,.1)" : "none" }}>
                <span className={`text-2xl font-bold tabular-nums ${mk === "btts" && o.key === "no" ? "text-rose-400" : theme[mk][0]}`}>{fmt(o.pts)}</span>
                <span className="text-[11px] text-slate-300 truncate max-w-full px-1">{mk === "dir" && o.key !== "draw" ? (o.key === "home" ? "ניצחון ביתי" : "ניצחון חוץ") : o.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 2. probability bars ──────────────────────────────────────────────────────
function V2({ k, m }) {
  const cols = { dir: ["#3b82f6", "#64748b", "#ef4444"], btts: ["#10b981", "#f43f5e"], goals: ["#0ea5e9", "#6366f1", "#a855f7"] };
  return (
    <div className="space-y-5">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk}>
          <div className="flex items-center justify-between mb-1.5">
            {mk === "dir" ? <Flag m={m} side="a" size="w-5 h-5" /> : <span />}
            <span className="text-[11px] font-bold text-slate-400">{TITLES[mk]}</span>
            {mk === "dir" ? <Flag m={m} side="b" size="w-5 h-5" /> : <span />}
          </div>
          <div className="flex h-11 rounded-lg overflow-hidden" dir="ltr">
            {k[mk].map((o, i) => (
              <motion.div key={o.key} initial={{ width: "0%" }} animate={{ width: `${Math.max(o.p, 9)}%` }} transition={{ type: "spring", stiffness: 80, damping: 18, delay: i * 0.08 }}
                className="flex flex-col items-center justify-center min-w-0 px-1 flex-shrink-0 overflow-hidden" style={{ background: cols[mk][i] }}>
                <span className="text-white font-black text-[15px] leading-none tabular-nums">{fmt(o.pts)}</span>
                <span className="text-white/80 text-[9px] font-bold truncate max-w-full">{o.short} · {o.p}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 3. betting tickets ───────────────────────────────────────────────────────
function V3({ k }) {
  const [pick, toggle] = usePick();
  const notch = "radial-gradient(circle at 0 50%, transparent 7px, #000 7.5px) left/51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 7px, #000 7.5px) right/51% 100% no-repeat";
  return (
    <div className="space-y-4">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk}>
          <Label>{TITLES[mk]}</Label>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${k[mk].length},minmax(0,1fr))` }}>
            {k[mk].map((o) => {
              const on = pick[mk] === o.key;
              return (
                <motion.button key={o.key} whileTap={{ scale: 0.94 }} onClick={() => toggle(mk, o.key)}
                  className="relative py-3 px-1 text-center" style={{ WebkitMask: notch, mask: notch, background: on ? "linear-gradient(160deg,#fde68a,#f59e0b)" : "linear-gradient(160deg,#1e293b,#0f172a)", borderTop: "2px dashed rgba(255,255,255,.12)" }}>
                  <div className={`text-[10px] font-bold truncate ${on ? "text-amber-900" : "text-slate-400"}`}>{o.label}</div>
                  <div className={`text-xl font-black tabular-nums ${on ? "text-slate-900" : "text-amber-300"}`}>{fmt(o.pts)}</div>
                  <AnimatePresence>{on && <motion.div initial={{ scale: 2, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} exit={{ opacity: 0 }}
                    className="absolute top-1 left-1 text-[8px] font-black text-red-700 border border-red-700 rounded px-1">נבחר</motion.div>}</AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 4. split-flap board ──────────────────────────────────────────────────────
function Flap({ value, delay = 0 }) {
  const [shown, setShown] = useState("--");
  useEffect(() => {
    let n = 0, iv;
    const to = setTimeout(() => {
      iv = setInterval(() => {
        n++;
        if (n > 9) { setShown(fmt(value)); clearInterval(iv); }
        else setShown((Math.random() * 9 + 1).toFixed(1));
      }, 55);
    }, delay);
    return () => { clearTimeout(to); clearInterval(iv); };
  }, [value, delay]);
  return (
    <span className="inline-flex gap-[2px]" dir="ltr">
      {shown.split("").map((ch, i) => (
        <span key={i} className="relative inline-block w-[17px] h-[26px] rounded-[3px] text-center font-black text-[18px] leading-[26px] text-amber-200 tabular-nums"
          style={{ background: "linear-gradient(#1f2937 50%,#111827 50%)", boxShadow: "inset 0 -1px 0 rgba(0,0,0,.6)" }}>
          {ch}<span className="absolute left-0 right-0 top-1/2 h-px bg-black/70" />
        </span>
      ))}
    </span>
  );
}
function V4({ k }) {
  let d = 0;
  return (
    <div className="rounded-xl p-3 space-y-3" style={{ background: "#0a0a0a", border: "1px solid #262626" }}>
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk}>
          <div className="text-[10px] font-bold text-amber-500/80 mb-1.5">{TITLES[mk]}</div>
          {k[mk].map((o) => (
            <div key={o.key} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
              <span className="text-[12px] text-slate-200 truncate">{o.label}{o.fav && <span className="text-amber-400 text-[10px] mr-1">פייבוריט ●</span>}</span>
              <Flap value={o.pts} delay={(d += 90)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── 5. donut rings ───────────────────────────────────────────────────────────
function Donut({ items, colors, active, onPick }) {
  const R = 34, Cc = 2 * Math.PI * R;
  let acc = 0;
  const sel = items.find((o) => o.key === active) || items.find((o) => o.fav);
  return (
    <svg viewBox="0 0 90 90" className="w-[88px] h-[88px]">
      <circle cx="45" cy="45" r={R} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10" />
      {items.map((o, i) => {
        const len = (o.p / 100) * Cc, off = acc; acc += len;
        return (
          <circle key={o.key} cx="45" cy="45" r={R} fill="none" stroke={colors[i]} strokeWidth={sel?.key === o.key ? 13 : 9}
            strokeDasharray={`${Math.max(len - 2, 0.1)} ${Cc}`} strokeDashoffset={-off} transform="rotate(-90 45 45)"
            style={{ cursor: "pointer", transition: "stroke-width .25s" }} onClick={() => onPick(o.key)} />
        );
      })}
      <text x="45" y="45" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="900">{fmt(sel?.pts || 0)}</text>
      <text x="45" y="58" textAnchor="middle" fill="#94a3b8" fontSize="8">{sel?.label?.slice(0, 10)}</text>
    </svg>
  );
}
function V5({ k }) {
  const [pick, toggle] = usePick();
  const cols = { dir: ["#60a5fa", "#94a3b8", "#f87171"], btts: ["#34d399", "#fb7185"], goals: ["#38bdf8", "#818cf8", "#c084fc"] };
  return (
    <div className="grid grid-cols-3 gap-1">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk} className="flex flex-col items-center gap-1">
          <Donut items={k[mk]} colors={cols[mk]} active={pick[mk]} onPick={(key) => toggle(mk, key)} />
          <span className="text-[10px] font-bold text-slate-400 text-center">{TITLES[mk]}</span>
          <div className="flex flex-wrap justify-center gap-1">
            {k[mk].map((o, i) => (
              <button key={o.key} onClick={() => toggle(mk, o.key)} className="flex items-center gap-1 text-[9px] text-slate-300">
                <i className="w-2 h-2 rounded-full inline-block" style={{ background: cols[mk][i] }} />{o.short}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 6. pitch ─────────────────────────────────────────────────────────────────
function V6({ k, m }) {
  const [h, d, a] = k.dir;
  const alpha = (p) => 0.12 + (p / 100) * 0.7;
  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/10", background: "repeating-linear-gradient(90deg,#14532d 0 12.5%,#166534 12.5% 25%)" }} dir="ltr">
        <div className="absolute inset-2 border-2 border-white/40 rounded-sm" />
        <div className="absolute top-2 bottom-2 left-1/2 w-0.5 bg-white/40" />
        <div className="absolute left-1/2 top-1/2 w-[28%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40 flex flex-col items-center justify-center"
          style={{ background: `rgba(250,204,21,${alpha(d.p)})` }}>
          <span className="text-white font-black text-lg leading-none">{fmt(d.pts)}</span><span className="text-[9px] text-white/80">תיקו {d.p}%</span>
        </div>
        <div className="absolute inset-y-2 left-2 w-[36%] flex flex-col items-center justify-center gap-1" style={{ background: `rgba(59,130,246,${alpha(h.p)})` }}>
          <Flag m={m} side="a" size="w-7 h-7" /><span className="text-white font-black text-xl leading-none">{fmt(h.pts)}</span><span className="text-[9px] text-white/80">{h.p}%</span>
        </div>
        <div className="absolute inset-y-2 right-2 w-[36%] flex flex-col items-center justify-center gap-1" style={{ background: `rgba(239,68,68,${alpha(a.p)})` }}>
          <Flag m={m} side="b" size="w-7 h-7" /><span className="text-white font-black text-xl leading-none">{fmt(a.pts)}</span><span className="text-[9px] text-white/80">{a.p}%</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-2 bg-white/5 border border-white/10"><Label>{TITLES.btts} ⚽⚽</Label>
          <div className="flex justify-around">{k.btts.map((o) => <div key={o.key} className="text-center"><div className="text-lg font-black text-white">{fmt(o.pts)}</div><div className="text-[10px] text-slate-400">{o.label}</div></div>)}</div></div>
        <div className="rounded-xl p-2 bg-white/5 border border-white/10"><Label>{TITLES.goals} 🥅</Label>
          <div className="flex justify-around">{k.goals.map((o) => <div key={o.key} className="text-center"><div className="text-lg font-black text-white">{fmt(o.pts)}</div><div className="text-[10px] text-slate-400" dir="ltr">{o.label}</div></div>)}</div></div>
      </div>
    </div>
  );
}

// ── 7. balance scale ─────────────────────────────────────────────────────────
function V7({ k, m }) {
  const [h, d, a] = k.dir;
  const tilt = Math.max(-16, Math.min(16, (a.p - h.p) * 0.4));
  const [btts, setBtts] = useState("yes");
  const b = k.btts.find((o) => o.key === btts);
  return (
    <div className="space-y-4">
      <div><Label>{TITLES.dir}</Label>
        <div className="relative h-28" dir="ltr">
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-0 h-0" style={{ borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderBottom: "40px solid #475569" }} />
          <motion.div className="absolute left-[8%] right-[8%] top-10 h-1 rounded bg-slate-300 origin-center" initial={{ rotate: 0 }} animate={{ rotate: tilt }} transition={{ type: "spring", stiffness: 40, damping: 6 }}>
            {[h, a].map((o, i) => (
              <div key={o.key} className={`absolute top-1 ${i ? "right-0" : "left-0"} flex flex-col items-center -translate-y-full`} style={{ transform: `translateX(${i ? "40%" : "-40%"}) translateY(-100%)` }}>
                <Flag m={m} side={i ? "b" : "a"} />
                <span className="text-white font-black">{fmt(o.pts)}</span>
              </div>
            ))}
          </motion.div>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 text-center"><div className="text-amber-300 font-black">{fmt(d.pts)}</div><div className="text-[9px] text-slate-400">תיקו</div></div>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl p-2.5 bg-white/5 border border-white/10">
        <span className="text-[12px] text-slate-300">{TITLES.btts}</span>
        <button onClick={() => setBtts(btts === "yes" ? "no" : "yes")} className="relative w-24 h-8 rounded-full bg-slate-700" dir="ltr">
          <motion.span layout className="absolute top-1 w-11 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-slate-900"
            style={{ left: btts === "yes" ? 4 : "auto", right: btts === "no" ? 4 : "auto", background: btts === "yes" ? C.mint : C.rose }}>{b.label}</motion.span>
        </button>
        <span className="text-xl font-black text-white tabular-nums">{fmt(b.pts)}</span>
      </div>
      <div><Label>{TITLES.goals}</Label>
        <div className="flex items-end gap-2 h-24" dir="ltr">
          {k.goals.map((o, i) => (
            <motion.div key={o.key} initial={{ height: 0 }} animate={{ height: `${35 + i * 30}%` }} transition={{ delay: i * 0.12 }}
              className="flex-1 rounded-t-lg flex flex-col items-center justify-start pt-1" style={{ background: `linear-gradient(#38bdf8, #0c4a6e)` }}>
              <span className="text-white font-black">{fmt(o.pts)}</span><span className="text-[10px] text-white/80">{o.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 8. risk vs reward ────────────────────────────────────────────────────────
function V8({ k }) {
  const all = [...k.dir.map((o) => ({ ...o, mk: "dir" })), ...k.btts.map((o) => ({ ...o, mk: "btts" })), ...k.goals.map((o) => ({ ...o, mk: "goals" }))];
  const maxP = Math.max(...all.map((o) => o.pts), 1);
  const col = { dir: C.sky, btts: C.mint, goals: "#c084fc" };
  const [hover, setHover] = useState(null);
  return (
    <div>
      <div className="relative h-56 rounded-xl bg-white/[.03] border border-white/10" dir="ltr">
        <span className="absolute left-2 top-1 text-[9px] text-slate-500">תגמול ↑</span>
        <span className="absolute right-2 bottom-1 text-[9px] text-slate-500">סיכוי →</span>
        {all.map((o) => (
          <motion.button key={o.mk + o.key} onClick={() => setHover(o)} initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -translate-x-1/2 translate-y-1/2 rounded-full flex items-center justify-center text-[9px] font-black text-slate-900"
            style={{ left: `${6 + o.p * 0.88}%`, bottom: `${8 + (o.pts / maxP) * 80}%`, width: 26, height: 26, background: col[o.mk], boxShadow: hover === o ? `0 0 0 3px #fff` : "none" }}>
            {o.short.slice(0, 3)}
          </motion.button>
        ))}
      </div>
      <div className="flex gap-3 justify-center mt-2 text-[10px] text-slate-400">
        {Object.entries(col).map(([mk, c]) => <span key={mk} className="flex items-center gap-1"><i className="w-2 h-2 rounded-full" style={{ background: c }} />{TITLES[mk]}</span>)}
      </div>
      <div className="mt-2 h-9 text-center text-[12px] text-slate-200">
        {hover ? <><b>{TITLES[hover.mk]}: {hover.label}</b> · {fmt(hover.pts)} נק' · סיכוי {hover.p}%</> : "לחצו על נקודה: למעלה = יותר נקודות, ימינה = סביר יותר"}
      </div>
    </div>
  );
}

// ── 9. heat chips ────────────────────────────────────────────────────────────
function V9({ k }) {
  const all = [...k.dir, ...k.btts, ...k.goals].map((o) => o.pts);
  const lo = Math.min(...all), hi = Math.max(...all);
  const heat = (v) => { const t = (v - lo) / (hi - lo || 1); return `hsl(${210 - t * 190} 85% ${55 - t * 5}%)`; };
  return (
    <div className="space-y-4">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk}><Label>{TITLES[mk]}</Label>
          <div className="flex flex-wrap gap-2">
            {k[mk].map((o) => {
              const t = (o.pts - lo) / (hi - lo || 1);
              return (
                <div key={o.key} className="flex items-center gap-2 rounded-full pr-3 pl-1 py-1" style={{ background: `${heat(o.pts)}22`, border: `1px solid ${heat(o.pts)}` }}>
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-black text-slate-950" style={{ background: heat(o.pts) }}>{fmt(o.pts)}</span>
                  <span className="text-[12px] text-slate-100">{o.label}</span>
                  {t > 0.6 && <span className="text-[12px]">{t > 0.85 ? "🔥🔥" : "🔥"}</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 text-[10px] text-slate-500"><span>בטוח</span><div className="flex-1 h-1.5 rounded-full" style={{ background: `linear-gradient(90deg, ${heat(lo)}, ${heat(hi)})` }} dir="ltr" /><span>הימור</span></div>
    </div>
  );
}

// ── 10. big numbers ──────────────────────────────────────────────────────────
function V10({ k }) {
  return (
    <div className="space-y-5">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${k[mk].length},minmax(0,1fr))` }}>
          {k[mk].map((o) => (
            <div key={o.key} className="text-center">
              <div className="font-black tabular-nums leading-none" style={{ fontSize: 40, color: o.fav ? C.gold : "#f1f5f9", letterSpacing: "-.03em" }}>{fmt(o.pts)}</div>
              <div className={`text-[11px] mt-1 truncate ${o.fav ? "text-amber-300" : "text-slate-400"}`}>{o.label}</div>
            </div>
          ))}
          <div className="col-span-full h-px bg-white/10" />
        </div>
      ))}
      <p className="text-[10px] text-slate-500 text-center">בזהב: האפשרות הסבירה ביותר בכל שוק</p>
    </div>
  );
}

// ── 11. swipe cards ──────────────────────────────────────────────────────────
function V11({ k, m }) {
  const order = ["dir", "btts", "goals"];
  const [i, setI] = useState(0);
  const mk = order[i];
  return (
    <div>
      <div className="relative h-44 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={mk} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={(e, info) => { if (info.offset.x < -40) setI((i + 1) % 3); if (info.offset.x > 40) setI((i + 2) % 3); }}
            initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -80, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 rounded-2xl p-4 flex flex-col cursor-grab" style={{ background: "linear-gradient(150deg,#1e3a8a,#0f172a 70%)", border: "1px solid rgba(124,173,238,.35)" }}>
            <div className="text-[13px] font-black text-white">{TITLES[mk]}</div>
            <div className="flex-1 flex items-center justify-around">
              {k[mk].map((o) => (
                <div key={o.key} className="text-center">
                  {mk === "dir" && o.key !== "draw" && <div className="flex justify-center mb-1"><Flag m={m} side={o.key === "home" ? "a" : "b"} /></div>}
                  <div className="text-3xl font-black text-white tabular-nums">{fmt(o.pts)}</div>
                  <div className="text-[11px] text-sky-200/80">{mk === "dir" ? (o.key === "draw" ? "תיקו" : "ניצחון") : o.label}</div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-slate-400 text-center">← החליקו לשוק הבא →</div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-1.5 mt-2">{order.map((x, j) => <button key={x} onClick={() => setI(j)} className="h-1.5 rounded-full transition-all" style={{ width: j === i ? 20 : 6, background: j === i ? C.sky : "#334155" }} />)}</div>
    </div>
  );
}

// ── 12. gauge ────────────────────────────────────────────────────────────────
function Gauge({ value, label, sub, color }) {
  const ang = -90 + (value / 100) * 180;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-full max-w-[150px]">
        <path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" strokeLinecap="round" />
        <motion.path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" pathLength="100"
          strokeDasharray="100 100" initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 100 - value }} transition={{ duration: 1 }} />
        <motion.line x1="60" y1="62" x2="60" y2="20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ originX: "60px", originY: "62px" }}
          initial={{ rotate: -90 }} animate={{ rotate: ang }} transition={{ type: "spring", stiffness: 60, damping: 10 }} />
        <circle cx="60" cy="62" r="4" fill="#fff" />
      </svg>
      <div className="text-white font-black text-lg -mt-1">{label}</div>
      <div className="text-[10px] text-slate-400">{sub}</div>
    </div>
  );
}
function V12({ k, m }) {
  const [h, d, a] = k.dir;
  const by = k.btts.find((o) => o.key === "yes");
  const fav = k.goals.find((o) => o.fav);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2"><Flag m={m} side="a" /><span className="text-[11px] text-slate-400">מי יותר צפוי לנצח?</span><Flag m={m} side="b" /></div>
      <Gauge value={Math.round(a.p + d.p / 2)} label={`${fmt(h.pts)} · ${fmt(d.pts)} · ${fmt(a.pts)}`} sub="1 · X · 2 (נקודות)" color={C.sky} />
      <div className="grid grid-cols-2 gap-2">
        <Gauge value={by.p} label={`כן ${fmt(by.pts)} / לא ${fmt(k.btts[1].pts)}`} sub={`${TITLES.btts} · ${by.p}% כן`} color={C.mint} />
        <Gauge value={fav.p} label={`${fav.label} · ${fmt(fav.pts)}`} sub={`${TITLES.goals} · הכי סביר`} color="#c084fc" />
      </div>
    </div>
  );
}

// ── 13. column bars ──────────────────────────────────────────────────────────
function V13({ k }) {
  const col = { dir: C.sky, btts: C.mint, goals: "#c084fc" };
  return (
    <div className="flex items-end gap-3 h-52" dir="ltr">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk} className="flex-1 flex flex-col h-full">
          <div className="flex-1 flex items-end gap-1">
            {k[mk].map((o, i) => (
              <div key={o.key} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[11px] font-black text-white tabular-nums mb-0.5">{fmt(o.pts)}</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(o.p, 6)}%` }} transition={{ type: "spring", stiffness: 70, damping: 14, delay: i * 0.08 }}
                  className="w-full rounded-t-md" style={{ background: `linear-gradient(${col[mk]}, ${col[mk]}33)` }} />
                <span className="text-[9px] text-slate-400 mt-0.5 truncate max-w-full">{o.short}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate-400 text-center mt-1 border-t border-white/10 pt-1">{TITLES[mk]}</div>
        </div>
      ))}
    </div>
  );
}

// ── 14. build-a-guess ────────────────────────────────────────────────────────
function V14({ k, m }) {
  const [pick, setPick] = useState({ dir: k.dir.find((o) => o.fav).key, btts: k.btts.find((o) => o.fav).key, goals: k.goals.find((o) => o.fav).key });
  const total = ["dir", "btts", "goals"].reduce((s, mk) => s + (k[mk].find((o) => o.key === pick[mk])?.pts || 0), 0);
  return (
    <div className="space-y-3">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk}><Label>{TITLES[mk]}</Label>
          <div className="flex gap-1.5 p-1 rounded-xl bg-white/5">
            {k[mk].map((o) => {
              const on = pick[mk] === o.key;
              return (
                <button key={o.key} onClick={() => setPick({ ...pick, [mk]: o.key })} className="relative flex-1 py-2 rounded-lg text-center">
                  {on && <motion.span layoutId={`b14-${mk}`} className="absolute inset-0 rounded-lg" style={{ background: "linear-gradient(135deg,#a7f3d0,#34d399)" }} />}
                  <span className={`relative block text-[11px] font-bold truncate px-1 ${on ? "text-slate-900" : "text-slate-300"}`}>
                    {mk === "dir" && o.key !== "draw" ? <span className="inline-flex align-middle"><Flag m={m} side={o.key === "home" ? "a" : "b"} size="w-4 h-4" /></span> : o.label}
                  </span>
                  <span className={`relative block text-[13px] font-black tabular-nums ${on ? "text-slate-900" : "text-white"}`} dir="ltr">+{fmt(o.pts)}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="rounded-2xl p-3 flex items-center justify-between" style={{ background: "rgba(250,204,21,.08)", border: "1px solid rgba(250,204,21,.45)" }}>
        <span className="text-[12px] text-amber-200">אם הכל נכון, תקבלו</span>
        <motion.span key={total} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-2xl font-black text-amber-300 tabular-nums">{fmt(total)} נק'</motion.span>
      </div>
      <p className="text-[10px] text-slate-500 text-center">בלי התוצאה המדויקת · בחרו בכל שוק וראו את הסכום</p>
    </div>
  );
}

// ── 15. team colours ─────────────────────────────────────────────────────────
function V15({ k, m }) {
  const ca = getTeamColor(m.team_a), cb = getTeamColor(m.team_b);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {k.dir.map((o) => {
          const c = o.key === "home" ? ca : o.key === "away" ? cb : "#475569";
          return (
            <div key={o.key} className="rounded-2xl p-3 flex flex-col items-center gap-1 relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${c}cc, ${c}33 70%)`, border: `1px solid ${c}` }}>
              {o.key !== "draw" ? <Flag m={m} side={o.key === "home" ? "a" : "b"} size="w-8 h-8" /> : <span className="text-2xl">🤝</span>}
              <span className="text-2xl font-black text-white tabular-nums drop-shadow">{fmt(o.pts)}</span>
              <span className="text-[10px] text-white/85 truncate max-w-full">{o.key === "draw" ? "תיקו" : "ניצחון"}</span>
              {o.fav && <span className="absolute top-1 left-1 text-[8px] font-black bg-white text-slate-900 rounded px-1">פייבוריט</span>}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[...k.btts].map((o) => (
          <div key={o.key} className="rounded-xl p-2 text-center backdrop-blur" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
            <div className="text-[10px] text-slate-400">שתיהן כובשות · {o.label}</div><div className="text-xl font-black text-white">{fmt(o.pts)}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {k.goals.map((o) => (
          <div key={o.key} className="rounded-xl p-2 text-center" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
            <div className="text-[10px] text-slate-400" dir="ltr">{o.label} שערים</div><div className="text-xl font-black text-white">{fmt(o.pts)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 16. tug of war ───────────────────────────────────────────────────────────
function V16({ k, m }) {
  const [h, d, a] = k.dir;
  const pos = 50 + (a.p - h.p) * 0.45;
  return (
    <div className="space-y-4">
      <div><Label>{TITLES.dir} · מי מושך חזק יותר</Label>
        <div className="relative h-20" dir="ltr">
          <div className="absolute left-[38%] right-[38%] top-0 bottom-0 rounded-lg" style={{ background: "rgba(250,204,21,.08)", border: "1px dashed rgba(250,204,21,.35)" }} />
          <span className="absolute left-1/2 -translate-x-1/2 top-0.5 text-[9px] text-amber-300">תיקו {fmt(d.pts)}</span>
          <div className="absolute left-10 right-10 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ background: "repeating-linear-gradient(45deg,#a16207 0 6px,#ca8a04 6px 12px)" }} />
          <motion.div className="absolute top-1/2 w-4 h-7 -translate-y-1/2 -translate-x-1/2 rounded bg-red-500 shadow" initial={{ left: "50%" }}
            animate={{ left: [`${pos - 2}%`, `${pos + 2}%`, `${pos}%`] }} transition={{ duration: 1.6, ease: "easeInOut" }} />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center"><Flag m={m} side="a" size="w-8 h-8" /><b className="text-white text-sm">{fmt(h.pts)}</b></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center"><Flag m={m} side="b" size="w-8 h-8" /><b className="text-white text-sm">{fmt(a.pts)}</b></div>
        </div>
      </div>
      {["btts", "goals"].map((mk) => (
        <div key={mk}><Label>{TITLES[mk]}</Label>
          <div className="flex gap-2">{k[mk].map((o) => (
            <div key={o.key} className="flex-1 rounded-lg py-2 text-center bg-white/5 border border-white/10"><b className="text-white text-lg">{fmt(o.pts)}</b><div className="text-[10px] text-slate-400" dir={mk === "goals" ? "ltr" : undefined}>{o.label}</div></div>
          ))}</div>
        </div>
      ))}
    </div>
  );
}

// ── 17. chip stacks ──────────────────────────────────────────────────────────
function Stack({ pts, color }) {
  const n = Math.max(1, Math.min(12, Math.round(pts)));
  return (
    <div className="relative w-10" style={{ height: n * 6 + 14 }}>
      {Array.from({ length: n }).map((_, i) => (
        <motion.div key={i} initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
          className="absolute left-0 right-0 h-3 rounded-[50%] border-2 border-dashed" style={{ bottom: i * 6, background: color, borderColor: "rgba(255,255,255,.55)" }} />
      ))}
    </div>
  );
}
function V17({ k }) {
  const col = { dir: "#2563eb", btts: "#059669", goals: "#7c3aed" };
  return (
    <div className="space-y-4">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk}><Label>{TITLES[mk]} · כמה אסימונים זה שווה</Label>
          <div className="flex items-end justify-around">
            {k[mk].map((o) => (
              <div key={o.key} className="flex flex-col items-center gap-1">
                <Stack pts={o.pts} color={col[mk]} />
                <b className="text-white tabular-nums">{fmt(o.pts)}</b>
                <span className="text-[10px] text-slate-400 truncate max-w-[72px]">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 18. clean list ───────────────────────────────────────────────────────────
function V18({ k }) {
  return (
    <div className="space-y-4">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk}>
          <div className="text-[12px] font-bold text-white mb-1">{TITLES[mk]}</div>
          {k[mk].map((o) => (
            <div key={o.key} className="flex items-baseline gap-2 py-1.5 text-[13px]">
              <span className="text-slate-200 truncate">{o.label}</span>
              {o.fav && <span className="text-[9px] font-bold px-1.5 rounded bg-emerald-400/15 text-emerald-300">הכי סביר</span>}
              <span className="flex-1 border-b border-dotted border-slate-600 translate-y-[-3px]" />
              <span className="font-bold text-white tabular-nums">{fmt(o.pts)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── 19. LED stadium board ────────────────────────────────────────────────────
function V19({ k }) {
  const led = { fontFamily: "'Courier New', monospace", color: "#fbbf24", textShadow: "0 0 6px #f59e0b, 0 0 14px #b45309" };
  return (
    <div className="rounded-xl p-3 space-y-3" style={{ background: "radial-gradient(circle,#1c1917 1px,#000 1.5px) 0 0/5px 5px", border: "3px solid #292524" }}>
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk}>
          <div className="text-[10px] font-bold mb-1" style={{ ...led, color: "#f97316" }}>{TITLES[mk]}</div>
          <div className="flex justify-between gap-2">
            {k[mk].map((o) => (
              <div key={o.key} className="flex-1 text-center">
                <div className="text-[22px] font-bold leading-none" style={led} dir="ltr">{fmt(o.pts)}</div>
                <div className="text-[9px] truncate" style={{ ...led, color: "#fde68a", textShadow: "0 0 4px #f59e0b" }}>{o.short}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 20. flip cards ───────────────────────────────────────────────────────────
function FlipCard({ o, color }) {
  const [flip, setFlip] = useState(false);
  return (
    <button onClick={() => setFlip(!flip)} className="flex-1 h-20" style={{ perspective: 600 }}>
      <motion.div className="relative w-full h-full" animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.5 }} style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center" style={{ backfaceVisibility: "hidden", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)" }}>
          <span className="text-[11px] text-slate-300 truncate max-w-full px-1">{o.label}</span>
          <span className="text-lg font-black" style={{ color }}>{o.p}%</span>
          <span className="text-[9px] text-slate-500">סיכוי · הפכו</span>
        </div>
        <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: `linear-gradient(150deg, ${color}, ${color}55)` }}>
          <span className="text-2xl font-black text-white">{fmt(o.pts)}</span>
          <span className="text-[10px] text-white/80">נקודות</span>
        </div>
      </motion.div>
    </button>
  );
}
function V20({ k }) {
  const col = { dir: "#3b82f6", btts: "#10b981", goals: "#8b5cf6" };
  return (
    <div className="space-y-3">
      {["dir", "btts", "goals"].map((mk) => (
        <div key={mk}><Label>{TITLES[mk]}</Label><div className="flex gap-2">{k[mk].map((o) => <FlipCard key={o.key} o={o} color={col[mk]} />)}</div></div>
      ))}
    </div>
  );
}

const VARIANTS = [
  { C: V1, name: "העיצוב הנוכחי", note: "לשם השוואה" },
  { C: V2, name: "פסי סיכוי", note: "רוחב כל חלק = הסיכוי, הנקודות בתוכו" },
  { C: V3, name: "כרטיסי הימור", note: "כרטיס מחורר לכל אפשרות, לחיצה מסמנת" },
  { C: V4, name: "לוח מתהפך", note: "ספרות מסתובבות כמו לוח בשדה תעופה" },
  { C: V5, name: "טבעות", note: "דונאט לכל שוק, לחיצה על פלח מציגה נקודות" },
  { C: V6, name: "מגרש", note: "חצי מגרש לכל קבוצה ועיגול מרכזי לתיקו" },
  { C: V7, name: "מאזניים", note: "המאזניים נוטים לפייבוריט, מתג כן/לא, מדרגות שערים" },
  { C: V8, name: "סיכון מול תגמול", note: "כל האפשרויות על גרף אחד: סיכוי מול נקודות" },
  { C: V9, name: "צ'יפים חמים", note: "צבע לפי נקודות: כחול בטוח, כתום הימור" },
  { C: V10, name: "מספרים גדולים", note: "טיפוגרפיה בלבד, הפייבוריט בזהב" },
  { C: V11, name: "החלקה בין שווקים", note: "כרטיס אחד בכל פעם, מחליקים הצידה" },
  { C: V12, name: "שעוני מהירות", note: "מחוג שמצביע על הפייבוריט" },
  { C: V13, name: "עמודות", note: "גרף עמודות לפי סיכוי, הנקודות מעל" },
  { C: V14, name: "בונה ניחוש", note: "בוחרים אפשרות בכל שוק ורואים סכום נקודות" },
  { C: V15, name: "צבעי הקבוצות", note: "אריחים בצבעי הקבוצות עם תג פייבוריט" },
  { C: V16, name: "משיכת חבל", note: "הקשר בחבל זז לפי מי שחזק יותר" },
  { C: V17, name: "ערימות אסימונים", note: "גובה הערימה = כמה נקודות זה שווה" },
  { C: V18, name: "רשימה נקייה", note: "שורות פשוטות עם נקודות וקו מנחה" },
  { C: V19, name: "לוח לד", note: "לוח תוצאות של אצטדיון" },
  { C: V20, name: "קלפים הפוכים", note: "בצד אחד הסיכוי, הופכים לנקודות" },
];

export default function AdminOddsDesigns() {
  const [matches, setMatches] = useState(null);
  const [id, setId] = useState(null);
  useEffect(() => {
    Match.list("match_date").then((all) => {
      const ok = all.filter((m) => Number(m.home_win_points) > 0 && Number(m.btts_yes_points) > 0 && Number(m.goals_0_2_points) > 0);
      // upcoming first, then the latest played
      const now = Date.now();
      const up = ok.filter((m) => Date.parse(m.match_date) > now);
      const list = [...up, ...ok.filter((m) => Date.parse(m.match_date) <= now).reverse()].slice(0, 18);
      setMatches(list);
      setId(list[0]?.id || null);
    });
  }, []);
  const [set, setSet] = useState(3);
  const m = matches?.find((x) => x.id === id);
  const k = useMemo(() => (m ? marketsOf(m) : null), [m]);
  const list = set === 3 ? VARIANTS3 : set === 2 ? VARIANTS2 : VARIANTS;

  if (!matches) return <div className="text-slate-400 p-6" dir="rtl">טוען משחקים...</div>;
  if (!m) return <div className="text-slate-400 p-6" dir="rtl">אין משחקים עם יחסים</div>;
  return (
    <div dir="rtl" className="text-slate-200">
      <h2 className="text-2xl font-black text-white mb-1">עיצובי יחסים 🎨</h2>
      <p className="text-slate-400 text-sm mb-3">דרכים להציג כיוון משחק, שתי קבוצות כובשות וטווח שערים. כולן מציגות את אותו משחק אמיתי, ואפשר ללחוץ ולשחק עם כל אחת.</p>
      <div className="inline-flex p-1 rounded-xl mb-3" style={{ background: "rgba(255,255,255,.06)" }}>
        {[[3, "סט 3 · 25 אינטראקטיביים"], [2, "סט 2 · 25"], [1, "סט 1 · 20"]].map(([n, t]) => (
          <button key={n} onClick={() => setSet(n)} className="px-3 py-1.5 rounded-lg text-[12px] font-bold"
            style={{ background: set === n ? "#facc15" : "transparent", color: set === n ? "#0f172a" : "#94a3b8" }}>{t}</button>
        ))}
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: "none" }}>
        {matches.map((x) => (
          <button key={x.id} onClick={() => setId(x.id)} className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold"
            style={{ background: x.id === id ? "rgba(52,211,153,.16)" : "rgba(255,255,255,.04)", border: `1px solid ${x.id === id ? "rgba(52,211,153,.55)" : "rgba(255,255,255,.08)"}`, color: x.id === id ? "#a7f3d0" : "#cbd5e1" }}>
            <TeamFlag logo={x.team_a_logo} name={x.team_a} className="w-4 h-4" animate={false} />
            <span>{x.team_a.trim()} – {x.team_b.trim()}</span>
            <TeamFlag logo={x.team_b_logo} name={x.team_b} className="w-4 h-4" animate={false} />
          </button>
        ))}
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))" }}>
        {list.map(({ C: Comp, name, note }, i) => (
          <section key={`${set}-${i}-${m.id}`} className="rounded-2xl p-4 min-w-0" style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,.08)" }}>
            <header className="flex items-baseline gap-2 mb-0.5">
              <span className="text-[12px] font-black text-amber-300 tabular-nums">{i + 1}</span>
              <h3 className="text-[15px] font-black text-white">{name}</h3>
            </header>
            <p className="text-[11px] text-slate-500 mb-3">{note}</p>
            <Comp k={k} m={m} />
          </section>
        ))}
      </div>
    </div>
  );
}
