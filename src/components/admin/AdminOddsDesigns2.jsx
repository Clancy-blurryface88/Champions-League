import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TeamFlag from "@/components/TeamFlag";
import { ShineBorder } from "@/components/magicui/shine-border";
import { getTeamColor } from "@/utils/teamColors";
import { TITLES, fmt } from "./AdminOddsDesigns";

// Set 2 — 25 product-grade treatments for the markets tab, built to sit in the
// scoring-rules modal (dark glass, gold/mint, team crests and colours) rather
// than as charts. Hebrew rule: icons/emoji sit to the LEFT of the text.

const MK = ["dir", "btts", "goals"];
const Flag = ({ m, side, s = "w-6 h-6" }) => <TeamFlag logo={side === "a" ? m.team_a_logo : m.team_b_logo} name={side === "a" ? m.team_a : m.team_b} className={s} animate={false} />;
const dirLabel = (o) => (o.key === "home" ? "ניצחון בית" : o.key === "away" ? "ניצחון חוץ" : "תיקו");
const lbl = (mk, o) => (mk === "dir" ? dirLabel(o) : mk === "goals" ? `${o.label} שערים` : o.label);
const maxOf = (arr) => arr.reduce((a, b) => (b.pts > a.pts ? b : a), arr[0]);
const glass = { background: "linear-gradient(160deg, rgba(255,255,255,.07), rgba(255,255,255,.02))", border: "1px solid rgba(255,255,255,.1)" };
// Counts up to the value on mount / change (plain rAF, no dependencies).
function Num({ v, className = "" }) {
  const target = Number(v) || 0;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let raf; const t0 = performance.now();
    const tick = (now) => { const k = Math.min(1, (now - t0) / 900); setShown(target * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  const dec = String(target).includes(".") ? String(target).split(".")[1].length : 0;
  return <span className={`tabular-nums ${className}`} dir="ltr">{shown.toFixed(dec)}</span>;
}
const Title = ({ children, className = "" }) => <div className={`text-[12px] font-bold text-slate-300 mb-2 ${className}`}>{children}</div>;
const usePick = () => { const [p, set] = useState({}); return [p, (mk, k) => set((x) => ({ ...x, [mk]: x[mk] === k ? null : k }))]; };

// 1 ─ premium glass segments with crests and a shine border
function W1({ k, m }) {
  return (
    <div className="space-y-4">
      {MK.map((mk) => (
        <div key={mk}>
          <Title>{TITLES[mk]}</Title>
          <div className="relative flex rounded-2xl overflow-hidden" style={glass}>
            <ShineBorder borderRadius={16} borderWidth={1.5} duration={10} shineColor={["#facc15", "#ffffff", "#34d399"]} />
            {k[mk].map((o, i) => (
              <div key={o.key} className="flex-1 flex flex-col items-center gap-1 py-3" style={{ borderRight: i ? "1px solid rgba(255,255,255,.08)" : "none" }}>
                {mk === "dir" && o.key !== "draw" ? <Flag m={m} side={o.key === "home" ? "a" : "b"} s="w-5 h-5" /> : <span className="h-5" />}
                <Num v={o.pts} className={`text-2xl font-black ${o.fav ? "text-amber-300" : "text-white"}`} />
                <span className="text-[11px] text-slate-400">{lbl(mk, o)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 2 ─ sportsbook slip: market rows, odds buttons, gold selection
function W2({ k, m }) {
  const [pick, toggle] = usePick();
  return (
    <div className="rounded-2xl overflow-hidden" style={glass}>
      {MK.map((mk, r) => (
        <div key={mk} className="px-3 py-3" style={{ borderTop: r ? "1px solid rgba(255,255,255,.07)" : "none" }}>
          <div className="text-[12px] font-bold text-white mb-2">{TITLES[mk]}</div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${k[mk].length},minmax(0,1fr))` }}>
            {k[mk].map((o) => {
              const on = pick[mk] === o.key;
              return (
                <motion.button key={o.key} whileTap={{ scale: 0.95 }} onClick={() => toggle(mk, o.key)}
                  className="rounded-lg px-2 py-2 flex items-center justify-between gap-1 transition-colors"
                  style={{ background: on ? "#facc15" : "rgba(255,255,255,.06)", border: `1px solid ${on ? "#facc15" : "rgba(255,255,255,.08)"}` }}>
                  <span className={`text-[11px] truncate ${on ? "text-slate-900 font-bold" : "text-slate-300"}`}>{mk === "dir" ? (o.key === "draw" ? "X" : o.key === "home" ? m.team_a.trim() : m.team_b.trim()) : o.label}</span>
                  <span className={`text-[14px] font-black tabular-nums ${on ? "text-slate-900" : "text-amber-300"}`} dir="ltr">{fmt(o.pts)}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// 3 ─ VS hero: direction under each crest, draw in the VS badge
function W3({ k, m }) {
  const [h, d, a] = k.dir;
  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl p-4 overflow-hidden" style={{ background: `linear-gradient(90deg, ${getTeamColor(m.team_a)}66, #0f172a 35%, #0f172a 65%, ${getTeamColor(m.team_b)}66)`, border: "1px solid rgba(255,255,255,.1)" }}>
        <div className="flex items-center justify-between">
          {[h, null, a].map((o, i) => o ? (
            <div key={o.key} className="flex flex-col items-center gap-1.5 w-24">
              <Flag m={m} side={i === 0 ? "a" : "b"} s="w-12 h-12" />
              <span className="text-[11px] text-white/80 truncate max-w-full">{(i === 0 ? m.team_a : m.team_b).trim()}</span>
              <Num v={o.pts} className={`text-2xl font-black ${o.fav ? "text-amber-300" : "text-white"}`} />
            </div>
          ) : (
            <div key="vs" className="flex flex-col items-center gap-1">
              <span className="w-14 h-14 rounded-full flex items-center justify-center font-black text-slate-900 text-lg" style={{ background: "linear-gradient(135deg,#fde68a,#f59e0b)", boxShadow: "0 0 24px rgba(250,204,21,.45)" }}>VS</span>
              <span className="text-[10px] text-slate-400">תיקו</span>
              <Num v={d.pts} className={`text-xl font-black ${d.fav ? "text-amber-300" : "text-white"}`} h={22} w={12} />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {[...k.btts, ...k.goals].map((o, i) => (
          <div key={o.key} className="rounded-xl py-2 text-center" style={glass}>
            <div className="text-[9px] text-slate-400 leading-tight">{i < 2 ? `שתיהן · ${o.label}` : `${o.label} שערים`}</div>
            <div className="text-[15px] font-black text-white tabular-nums" dir="ltr">{fmt(o.pts)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4 ─ "best value" and "safest" tags, sportsbook style
function W4({ k }) {
  return (
    <div className="space-y-3">
      {MK.map((mk) => {
        const best = maxOf(k[mk]);
        return (
          <div key={mk} className="rounded-2xl p-3" style={glass}>
            <Title>{TITLES[mk]}</Title>
            <div className="space-y-1.5">
              {k[mk].map((o) => (
                <div key={o.key} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: o === best ? "rgba(249,115,22,.12)" : o.fav ? "rgba(52,211,153,.1)" : "rgba(255,255,255,.03)", border: `1px solid ${o === best ? "rgba(249,115,22,.45)" : o.fav ? "rgba(52,211,153,.4)" : "transparent"}` }}>
                  <span className="text-[13px] text-white flex-1 truncate">{lbl(mk, o)}</span>
                  {o === best && <span className="text-[10px] font-bold text-orange-300">הכי משתלם 🔥</span>}
                  {o.fav && <span className="text-[10px] font-bold text-emerald-300">הכי בטוח 🛡️</span>}
                  <span className="text-[16px] font-black text-white tabular-nums w-12 text-left" dir="ltr">{fmt(o.pts)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 5 ─ snap carousel of market cards
function W5({ k, m }) {
  return (
    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
      {MK.map((mk, i) => (
        <div key={mk} className="snap-center flex-shrink-0 w-[78%] rounded-3xl p-4 relative overflow-hidden"
          style={{ background: ["linear-gradient(150deg,#1d4ed8,#0b1330 70%)", "linear-gradient(150deg,#047857,#071d17 70%)", "linear-gradient(150deg,#6d28d9,#140b2e 70%)"][i], border: "1px solid rgba(255,255,255,.12)" }}>
          <div className="text-[11px] text-white/60">{i + 1} מתוך 3</div>
          <div className="text-[18px] font-black text-white mb-4">{TITLES[mk]}</div>
          <div className="flex justify-around">
            {k[mk].map((o) => (
              <div key={o.key} className="text-center">
                {mk === "dir" && o.key !== "draw" && <div className="flex justify-center mb-1"><Flag m={m} side={o.key === "home" ? "a" : "b"} /></div>}
                <div className="text-3xl font-black text-white tabular-nums" dir="ltr">{fmt(o.pts)}</div>
                <div className="text-[11px] text-white/70">{mk === "dir" ? (o.key === "draw" ? "תיקו" : "ניצחון") : o.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 6 ─ iOS segmented control: one market at a time, big numbers
function W6({ k, m }) {
  const [mk, setMk] = useState("dir");
  return (
    <div>
      <div className="relative flex p-1 rounded-xl mb-4" style={{ background: "rgba(255,255,255,.06)" }}>
        {MK.map((x) => (
          <button key={x} onClick={() => setMk(x)} className="relative flex-1 py-2 text-[12px] font-bold">
            {mk === x && <motion.span layoutId="w6seg" className="absolute inset-0 rounded-lg" style={{ background: "#1e293b", boxShadow: "0 2px 8px rgba(0,0,0,.4)" }} />}
            <span className={`relative ${mk === x ? "text-white" : "text-slate-400"}`}>{TITLES[x]}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={mk} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex justify-around">
          {k[mk].map((o) => (
            <div key={o.key} className="text-center">
              {mk === "dir" && o.key !== "draw" ? <div className="flex justify-center mb-1"><Flag m={m} side={o.key === "home" ? "a" : "b"} s="w-8 h-8" /></div> : <div className="h-9" />}
              <Num v={o.pts} h={40} w={22} className={`text-[38px] font-black ${o.fav ? "text-amber-300" : "text-white"}`} />
              <div className="text-[11px] text-slate-400 mt-1">{lbl(mk, o)}</div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 7 ─ goal nets: BTTS as two nets, goals as ball counts
function W7({ k, m }) {
  const balls = { g02: "⚽⚽", g34: "⚽⚽⚽⚽", g5: "⚽⚽⚽⚽⚽" };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {k.dir.map((o) => (
          <div key={o.key} className="rounded-2xl p-2.5 text-center" style={glass}>
            <div className="flex justify-center h-7">{o.key === "draw" ? <span className="text-xl">🤝</span> : <Flag m={m} side={o.key === "home" ? "a" : "b"} />}</div>
            <div className="text-xl font-black text-white tabular-nums" dir="ltr">{fmt(o.pts)}</div>
            <div className="text-[10px] text-slate-400">{dirLabel(o)}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {k.btts.map((o) => (
          <div key={o.key} className="rounded-2xl p-3 flex items-center justify-between" style={glass}>
            <div><div className="text-[11px] text-slate-400">שתיהן כובשות</div><div className="text-[14px] font-bold text-white">{o.label}</div></div>
            <div className="text-center"><div className="text-lg">{o.key === "yes" ? "🥅⚽ 🥅⚽" : "🥅 🥅⚽"}</div><div className="text-lg font-black text-white tabular-nums" dir="ltr">{fmt(o.pts)}</div></div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {k.goals.map((o) => (
          <div key={o.key} className="flex items-center gap-3 rounded-xl px-3 py-2" style={glass}>
            <span className="text-[13px] font-bold text-white w-16">{o.label} שערים</span>
            <span className="flex-1 text-[13px] tracking-tight" dir="ltr">{balls[o.key]}{o.key === "g5" ? "+" : ""}</span>
            <span className="text-lg font-black text-white tabular-nums" dir="ltr">{fmt(o.pts)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8 ─ podium: the likeliest outcome stands tallest
function W8({ k }) {
  return (
    <div className="space-y-5">
      {MK.map((mk) => {
        const sorted = [...k[mk]].sort((a, b) => b.p - a.p);
        const order = sorted.length === 3 ? [sorted[1], sorted[0], sorted[2]] : [sorted[0], sorted[1]];
        const hs = sorted.length === 3 ? [70, 96, 52] : [92, 64];
        return (
          <div key={mk}>
            <Title className="text-center">{TITLES[mk]}</Title>
            <div className="flex items-end justify-center gap-2">
              {order.map((o, i) => (
                <div key={o.key} className="flex flex-col items-center w-24">
                  <div className="text-[11px] text-slate-300 mb-1 truncate max-w-full">{lbl(mk, o)}</div>
                  <motion.div initial={{ height: 0 }} animate={{ height: hs[i] }} transition={{ type: "spring", stiffness: 90, damping: 14, delay: i * 0.08 }}
                    className="w-full rounded-t-xl flex items-start justify-center pt-2" style={{ background: o.fav ? "linear-gradient(#facc15,#a16207)" : "linear-gradient(#64748b,#1e293b)" }}>
                    <span className="text-lg font-black text-white tabular-nums drop-shadow" dir="ltr">{fmt(o.pts)}</span>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 9 ─ black & gold luxury
function W9({ k }) {
  return (
    <div className="rounded-2xl p-4 space-y-4" style={{ background: "linear-gradient(160deg,#151515,#050505)", border: "1px solid #a16207" }}>
      {MK.map((mk) => (
        <div key={mk}>
          <div className="flex items-center gap-2 mb-2"><span className="text-[12px] font-bold" style={{ color: "#e7c873" }}>{TITLES[mk]}</span><span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,#a16207,transparent)" }} /></div>
          <div className="flex justify-between">
            {k[mk].map((o) => (
              <div key={o.key} className="flex-1 text-center">
                <div className="text-[26px] font-black tabular-nums" dir="ltr" style={{ background: "linear-gradient(180deg,#fff7d6,#d4a017 60%,#8a6508)", WebkitBackgroundClip: "text", color: "transparent" }}>{fmt(o.pts)}</div>
                <div className="text-[10px]" style={{ color: "#bfa76a" }}>{lbl(mk, o)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 10 ─ tap-to-reveal: pick an option, the points roll in
function W10({ k }) {
  const [pick, toggle] = usePick();
  return (
    <div className="space-y-3">
      {MK.map((mk) => (
        <div key={mk}>
          <Title>{TITLES[mk]}</Title>
          <div className="flex gap-2">
            {k[mk].map((o) => {
              const on = pick[mk] === o.key;
              return (
                <motion.button key={o.key} whileTap={{ scale: 0.94 }} onClick={() => toggle(mk, o.key)} className="flex-1 rounded-2xl py-3 flex flex-col items-center gap-1"
                  style={{ background: on ? "linear-gradient(150deg,#065f46,#0b1d18)" : "rgba(255,255,255,.04)", border: `1px solid ${on ? "#34d399" : "rgba(255,255,255,.1)"}`, boxShadow: on ? "0 0 22px rgba(52,211,153,.35)" : "none" }}>
                  <span className="text-[12px] text-white truncate max-w-full px-1">{lbl(mk, o)}</span>
                  {on ? <Num v={o.pts} className="text-2xl font-black text-emerald-300" /> : <span className="text-2xl font-black text-slate-600">?</span>}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-[10px] text-slate-500 text-center">הקישו על אפשרות כדי לגלות כמה היא שווה</p>
    </div>
  );
}

// 11 ─ underline meters: a quiet list where a thin bar shows the chance
function W11({ k }) {
  const col = { dir: "#7cadee", btts: "#34d399", goals: "#c084fc" };
  return (
    <div className="space-y-4">
      {MK.map((mk) => (
        <div key={mk}>
          <Title>{TITLES[mk]}</Title>
          {k[mk].map((o) => (
            <div key={o.key} className="py-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-white">{lbl(mk, o)}</span>
                <span className="text-[15px] font-black text-white tabular-nums" dir="ltr">{fmt(o.pts)}</span>
              </div>
              <div className="h-1 mt-1 rounded-full bg-white/5 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${o.p}%` }} transition={{ duration: 0.9 }} className="h-full rounded-full" style={{ background: col[mk] }} /></div>
              <div className="text-[9px] text-slate-500 mt-0.5">סיכוי משוער {o.p}%</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// 12 ─ hexagon tiles
function W12({ k, m }) {
  const hex = { clipPath: "polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)" };
  const col = { dir: "#1d4ed8", btts: "#047857", goals: "#6d28d9" };
  return (
    <div className="space-y-3">
      {MK.map((mk) => (
        <div key={mk}>
          <Title className="text-center">{TITLES[mk]}</Title>
          <div className="flex justify-center gap-1">
            {k[mk].map((o) => (
              <div key={o.key} className="w-24 h-[84px] flex flex-col items-center justify-center" style={{ ...hex, background: o.fav ? "linear-gradient(150deg,#facc15,#a16207)" : `linear-gradient(150deg,${col[mk]},#0f172a)` }}>
                {mk === "dir" && o.key !== "draw" && <Flag m={m} side={o.key === "home" ? "a" : "b"} s="w-5 h-5" />}
                <span className="text-xl font-black text-white tabular-nums" dir="ltr">{fmt(o.pts)}</span>
                <span className="text-[9px] text-white/80">{mk === "dir" ? (o.key === "draw" ? "תיקו" : "ניצחון") : o.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 13 ─ neon outlines
function W13({ k }) {
  const neon = { dir: "#38bdf8", btts: "#34d399", goals: "#e879f9" };
  return (
    <div className="space-y-4 rounded-2xl p-3" style={{ background: "#030712" }}>
      {MK.map((mk) => (
        <div key={mk}>
          <div className="text-[12px] font-bold mb-2" style={{ color: neon[mk], textShadow: `0 0 10px ${neon[mk]}` }}>{TITLES[mk]}</div>
          <div className="flex gap-2">
            {k[mk].map((o) => (
              <div key={o.key} className="flex-1 rounded-xl py-2.5 text-center" style={{ border: `1.5px solid ${neon[mk]}`, boxShadow: `0 0 12px ${neon[mk]}55, inset 0 0 12px ${neon[mk]}22` }}>
                <div className="text-xl font-black tabular-nums" dir="ltr" style={{ color: "#fff", textShadow: `0 0 8px ${neon[mk]}` }}>{fmt(o.pts)}</div>
                <div className="text-[10px] text-slate-300 truncate px-1">{lbl(mk, o)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 14 ─ accordion markets
function W14({ k }) {
  const [open, setOpen] = useState("dir");
  return (
    <div className="rounded-2xl overflow-hidden" style={glass}>
      {MK.map((mk, i) => {
        const on = open === mk;
        const fav = k[mk].find((o) => o.fav);
        return (
          <div key={mk} style={{ borderTop: i ? "1px solid rgba(255,255,255,.07)" : "none" }}>
            <button onClick={() => setOpen(on ? null : mk)} className="w-full flex items-center justify-between px-3 py-3">
              <span className="text-[13px] font-bold text-white">{TITLES[mk]}</span>
              <span className="flex items-center gap-2 text-[11px] text-slate-400">{!on && <>הכי סביר: {lbl(mk, fav)} · {fmt(fav.pts)}</>}<motion.span animate={{ rotate: on ? 180 : 0 }}>⌄</motion.span></span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="flex gap-2 px-3 pb-3">
                    {k[mk].map((o) => (
                      <div key={o.key} className="flex-1 rounded-xl py-2 text-center" style={{ background: o.fav ? "rgba(250,204,21,.12)" : "rgba(255,255,255,.05)", border: `1px solid ${o.fav ? "rgba(250,204,21,.5)" : "transparent"}` }}>
                        <Num v={o.pts} h={22} w={12} className="text-xl font-black text-white" />
                        <div className="text-[10px] text-slate-400">{lbl(mk, o)}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// 15 ─ team-colour split hero + chips
function W15({ k, m }) {
  const [h, d, a] = k.dir;
  const ca = getTeamColor(m.team_a), cb = getTeamColor(m.team_b);
  return (
    <div className="space-y-3">
      <div className="flex rounded-2xl overflow-hidden h-28">
        <div className="flex-1 flex flex-col items-center justify-center gap-1" style={{ background: `linear-gradient(135deg, ${ca}, ${ca}88)` }}><Flag m={m} side="a" s="w-9 h-9" /><span className="text-2xl font-black text-white drop-shadow tabular-nums">{fmt(h.pts)}</span></div>
        <div className="w-20 flex flex-col items-center justify-center bg-slate-900"><span className="text-[10px] text-slate-400">תיקו</span><span className="text-xl font-black text-amber-300 tabular-nums">{fmt(d.pts)}</span></div>
        <div className="flex-1 flex flex-col items-center justify-center gap-1" style={{ background: `linear-gradient(225deg, ${cb}, ${cb}88)` }}><Flag m={m} side="b" s="w-9 h-9" /><span className="text-2xl font-black text-white drop-shadow tabular-nums">{fmt(a.pts)}</span></div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {[...k.btts.map((o) => ({ ...o, t: `שתיהן כובשות · ${o.label}` })), ...k.goals.map((o) => ({ ...o, t: `${o.label} שערים` }))].map((o) => (
          <span key={o.key} className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1" style={glass}>
            <span className="text-[11px] text-slate-200">{o.t}</span>
            <span className="rounded-full px-2 py-0.5 text-[12px] font-black text-slate-900 bg-white tabular-nums" dir="ltr">{fmt(o.pts)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// 16 ─ stacked depth cards
function W16({ k }) {
  return (
    <div className="relative pt-4">
      {MK.map((mk, i) => (
        <motion.div key={mk} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.12, type: "spring", stiffness: 160, damping: 18 }}
          className="relative rounded-3xl p-4 -mt-3 first:mt-0"
          style={{ zIndex: 3 - i, background: `linear-gradient(160deg, rgba(30,41,59,${0.98 - i * 0.08}), rgba(15,23,42,.98))`, border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 -10px 30px rgba(0,0,0,.45)" }}>
          <div className="text-[13px] font-black text-white mb-2">{TITLES[mk]}</div>
          <div className="flex justify-between">
            {k[mk].map((o) => (
              <div key={o.key} className="flex-1 text-center">
                <div className={`text-2xl font-black tabular-nums ${o.fav ? "text-amber-300" : "text-white"}`} dir="ltr">{fmt(o.pts)}</div>
                <div className="text-[10px] text-slate-400">{lbl(mk, o)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// 17 ─ score matrix 3×3
function W17({ k }) {
  return (
    <div className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,.1)" }}>
      {MK.flatMap((mk) => [
        ...k[mk].map((o) => (
          <div key={mk + o.key} className="bg-[#0d1526] p-3 text-center">
            <div className="text-[9px] text-slate-500">{TITLES[mk]}</div>
            <div className={`text-2xl font-black tabular-nums ${o.fav ? "text-amber-300" : "text-white"}`} dir="ltr">{fmt(o.pts)}</div>
            <div className="text-[11px] text-slate-300">{lbl(mk, o)}</div>
          </div>
        )),
        ...(k[mk].length === 2 ? [<div key={mk + "pad"} className="bg-[#0d1526] flex items-center justify-center text-[22px]">⚽</div>] : []),
      ])}
    </div>
  );
}

// 18 ─ pitch-side LED perimeter board (scrolling)
function W18({ k }) {
  const items = MK.flatMap((mk) => k[mk].map((o) => `${lbl(mk, o)} ${fmt(o.pts)}`));
  const row = items.join("   •   ");
  return (
    <div className="space-y-3">
      <div className="rounded-lg overflow-hidden py-2" style={{ background: "#020617", border: "2px solid #1e293b" }}>
        <motion.div className="whitespace-nowrap text-[20px] font-black" style={{ color: "#facc15", textShadow: "0 0 8px #f59e0b" }}
          animate={{ x: ["0%", "50%"] }} transition={{ duration: 18, ease: "linear", repeat: Infinity }}>{row}   •   {row}</motion.div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {MK.map((mk) => {
          const fav = k[mk].find((o) => o.fav);
          return <div key={mk} className="rounded-xl p-2 text-center" style={glass}><div className="text-[10px] text-slate-400">{TITLES[mk]}</div><div className="text-[13px] font-bold text-white">{lbl(mk, fav)}</div><div className="text-lg font-black text-amber-300 tabular-nums" dir="ltr">{fmt(fav.pts)}</div></div>;
        })}
      </div>
    </div>
  );
}

// 19 ─ risk ↔ reward slider per market
function W19({ k }) {
  return (
    <div className="space-y-4">
      {MK.map((mk) => {
        const lo = Math.min(...k[mk].map((o) => o.pts)), hi = Math.max(...k[mk].map((o) => o.pts));
        return (
          <div key={mk}>
            <Title>{TITLES[mk]}</Title>
            <div className="relative h-[74px] rounded-xl" style={{ background: "linear-gradient(270deg, rgba(52,211,153,.25), rgba(249,115,22,.25))" }} dir="rtl">
              <span className="absolute right-2 top-1 text-[9px] text-emerald-300">בטוח</span>
              <span className="absolute left-2 top-1 text-[9px] text-orange-300">משתלם</span>
              {k[mk].map((o, idx) => {
                const x = hi === lo ? 50 : 8 + ((o.pts - lo) / (hi - lo)) * 84;
                return (
                  <motion.div key={o.key} initial={{ right: "50%" }} animate={{ right: `${x}%` }} transition={{ type: "spring", stiffness: 80, damping: 14 }}
                    className="absolute translate-x-1/2 flex flex-col items-center" style={{ bottom: idx % 2 ? 30 : 4 }}>
                    <span className="text-[13px] font-black text-white tabular-nums" dir="ltr">{fmt(o.pts)}</span>
                    <span className="text-[9px] text-slate-300 whitespace-nowrap">{mk === "dir" ? o.short : o.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 20 ─ ticket stubs with team colours
function W20({ k, m }) {
  return (
    <div className="space-y-2">
      {k.dir.map((o) => {
        const c = o.key === "home" ? getTeamColor(m.team_a) : o.key === "away" ? getTeamColor(m.team_b) : "#475569";
        return (
          <div key={o.key} className="flex rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.12)" }}>
            <div className="flex-1 flex items-center gap-3 px-3 py-2.5" style={{ background: `linear-gradient(90deg, ${c}55, transparent)` }}>
              {o.key === "draw" ? <span className="text-xl w-7 text-center">🤝</span> : <Flag m={m} side={o.key === "home" ? "a" : "b"} s="w-7 h-7" />}
              <div><div className="text-[13px] font-bold text-white">{o.key === "draw" ? "תיקו" : (o.key === "home" ? m.team_a : m.team_b).trim()}</div><div className="text-[10px] text-slate-400">{TITLES.dir}</div></div>
            </div>
            <div className="w-20 flex items-center justify-center border-r-2 border-dashed border-white/20 bg-black/30"><span className="text-xl font-black text-white tabular-nums" dir="ltr">{fmt(o.pts)}</span></div>
          </div>
        );
      })}
      <div className="grid grid-cols-5 gap-1.5 pt-1">
        {[...k.btts, ...k.goals].map((o, i) => (
          <div key={o.key} className="rounded-xl py-1.5 text-center bg-black/30 border border-dashed border-white/15">
            <div className="text-[9px] text-slate-400">{i < 2 ? `שתיהן ${o.label}` : o.label}</div><div className="text-[14px] font-black text-white tabular-nums" dir="ltr">{fmt(o.pts)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 21 ─ orbit around the ball
function W21({ k }) {
  const all = MK.flatMap((mk) => k[mk].map((o) => ({ ...o, mk })));
  const col = { dir: "#60a5fa", btts: "#34d399", goals: "#c084fc" };
  const [sel, setSel] = useState(all[0]);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
          {all.map((o, i) => {
            const ang = (i / all.length) * 2 * Math.PI;
            return (
              <button key={o.mk + o.key} onClick={() => setSel(o)} className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center text-[12px] font-black text-slate-900"
                style={{ left: `${50 + 42 * Math.cos(ang)}%`, top: `${50 + 42 * Math.sin(ang)}%`, background: col[o.mk], boxShadow: sel === o ? "0 0 0 3px #fff" : "none" }}><motion.span animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} dir="ltr">{fmt(o.pts)}</motion.span></button>
            );
          })}
        </motion.div>
        <div className="absolute inset-[30%] rounded-full flex flex-col items-center justify-center text-center" style={{ background: "radial-gradient(circle at 35% 30%, #fff, #cbd5e1 40%, #475569)" }}>
          <span className="text-[10px] text-slate-700">{TITLES[sel.mk]}</span>
          <span className="text-[12px] font-black text-slate-900 leading-tight">{lbl(sel.mk, sel)}</span>
          <span className="text-xl font-black text-slate-900 tabular-nums" dir="ltr">{fmt(sel.pts)}</span>
        </div>
      </div>
      <div className="flex gap-3 text-[10px] text-slate-400">{MK.map((mk) => <span key={mk} className="flex items-center gap-1">{TITLES[mk]}<i className="w-2 h-2 rounded-full" style={{ background: col[mk] }} /></span>)}</div>
    </div>
  );
}

// 22 ─ watermark crests, monochrome
function W22({ k, m }) {
  return (
    <div className="relative rounded-2xl p-4 overflow-hidden" style={{ background: "#0b1120", border: "1px solid rgba(255,255,255,.08)" }}>
      <div className="absolute -right-6 -top-6 opacity-10"><Flag m={m} side="a" s="w-32 h-32" /></div>
      <div className="absolute -left-6 -bottom-6 opacity-10"><Flag m={m} side="b" s="w-32 h-32" /></div>
      <div className="relative space-y-4">
        {MK.map((mk) => (
          <div key={mk} className="flex items-baseline justify-between gap-3">
            <span className="text-[12px] text-slate-400 w-24">{TITLES[mk]}</span>
            <div className="flex-1 flex justify-between">
              {k[mk].map((o) => (
                <div key={o.key} className="text-center flex-1">
                  <div className={`text-[22px] font-light tabular-nums ${o.fav ? "text-white" : "text-slate-400"}`} dir="ltr">{fmt(o.pts)}</div>
                  <div className="text-[9px] text-slate-500">{mk === "dir" ? o.short : o.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 23 ─ combo builder with live total and chips
function W23({ k, m }) {
  const [pick, setPick] = useState({ dir: null, btts: null, goals: null });
  const chosen = MK.map((mk) => k[mk].find((o) => o.key === pick[mk])).filter(Boolean);
  const total = chosen.reduce((s, o) => s + o.pts, 0);
  return (
    <div className="space-y-3">
      {MK.map((mk) => (
        <div key={mk} className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 w-20">{TITLES[mk]}</span>
          <div className="flex-1 flex gap-1.5">
            {k[mk].map((o) => {
              const on = pick[mk] === o.key;
              return (
                <button key={o.key} onClick={() => setPick({ ...pick, [mk]: on ? null : o.key })} className="flex-1 rounded-full py-1.5 text-[11px] font-bold transition-all"
                  style={{ background: on ? "#34d399" : "rgba(255,255,255,.06)", color: on ? "#052e1e" : "#cbd5e1" }}>
                  {mk === "dir" ? (o.key === "draw" ? "X" : (o.key === "home" ? m.team_a : m.team_b).trim().slice(0, 9)) : o.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="rounded-2xl p-4 text-center" style={{ background: "linear-gradient(135deg, rgba(52,211,153,.15), rgba(124,173,238,.12))", border: "1px solid rgba(52,211,153,.4)" }}>
        <div className="text-[11px] text-slate-300">{chosen.length ? `${chosen.length} מתוך 3 שווקים נבחרו` : "בחרו אפשרויות כדי לראות כמה הן שוות"}</div>
        <Num v={Math.round(total * 100) / 100} h={44} w={24} className="text-[40px] font-black text-white" />
        <div className="text-[11px] text-emerald-300">נקודות אפשריות (בלי תוצאה מדויקת)</div>
      </div>
    </div>
  );
}

// 24 ─ match-centre widget (TV graphic)
function W24({ k, m }) {
  const [h, d, a] = k.dir;
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.12)" }}>
      <div className="flex items-stretch" style={{ background: "linear-gradient(90deg,#1e3a8a,#312e81)" }}>
        <div className="flex items-center gap-2 px-3 py-2 flex-1"><Flag m={m} side="a" /><span className="text-[12px] font-black text-white truncate">{m.team_a.trim()}</span></div>
        <div className="px-3 flex items-center bg-white text-slate-900 font-black text-[12px]">VS</div>
        <div className="flex items-center gap-2 px-3 py-2 flex-1 justify-end"><span className="text-[12px] font-black text-white truncate">{m.team_b.trim()}</span><Flag m={m} side="b" /></div>
      </div>
      <div className="grid grid-cols-3 text-center bg-[#0b1226]">
        {[h, d, a].map((o) => (
          <div key={o.key} className="py-2 border-l border-white/5 first:border-0">
            <div className="text-[10px] text-slate-400">{o.short}</div>
            <div className={`text-xl font-black tabular-nums ${o.fav ? "text-amber-300" : "text-white"}`}>{fmt(o.pts)}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 bg-[#081022] border-t border-white/5">
        <div className="p-2 text-center border-l border-white/5"><div className="text-[10px] text-slate-400 mb-1">{TITLES.btts}</div><div className="flex justify-around">{k.btts.map((o) => <span key={o.key} className="text-[12px] text-white">{o.label} <b className="tabular-nums" dir="ltr">{fmt(o.pts)}</b></span>)}</div></div>
        <div className="p-2 text-center"><div className="text-[10px] text-slate-400 mb-1">{TITLES.goals}</div><div className="flex justify-around">{k.goals.map((o) => <span key={o.key} className="text-[12px] text-white"><span dir="ltr">{o.label}</span> <b className="tabular-nums" dir="ltr">{fmt(o.pts)}</b></span>)}</div></div>
      </div>
    </div>
  );
}

// 25 ─ story-style: one bold sentence per market
function W25({ k, m }) {
  const [h, d, a] = k.dir;
  const fav = k.dir.find((o) => o.fav);
  const favName = fav.key === "draw" ? "תיקו" : `ניצחון של ${(fav.key === "home" ? m.team_a : m.team_b).trim()}`;
  const by = k.btts.find((o) => o.key === "yes"), bn = k.btts.find((o) => o.key === "no");
  const g = k.goals.find((o) => o.fav);
  const S = ({ children }) => <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-[15px] leading-relaxed text-slate-200">{children}</motion.p>;
  const B = ({ children }) => <b className="text-amber-300 font-black tabular-nums" dir="ltr">{children}</b>;
  return (
    <div className="rounded-2xl p-4 space-y-3" style={glass}>
      <S>הכי צפוי: <span className="text-white font-bold">{favName}</span>, ששווה <B>{fmt(fav.pts)}</B> נק'. הפתעה של הצד השני שווה <B>{fmt(Math.max(h.pts, a.pts))}</B>, ותיקו <B>{fmt(d.pts)}</B>.</S>
      <S>שתי הקבוצות יבקיעו? כן שווה <B>{fmt(by.pts)}</B>, לא שווה <B>{fmt(bn.pts)}</B>.</S>
      <S>הכי סביר: <span className="text-white font-bold">{g.label} שערים</span> (<B>{fmt(g.pts)}</B>). {k.goals.filter((o) => o !== g).map((o, i) => <span key={o.key}>{i ? " ו־" : "אחרת "}<span dir="ltr">{o.label}</span> שווה <B>{fmt(o.pts)}</B></span>)}.</S>
    </div>
  );
}

export const VARIANTS2 = [
  { C: W1, name: "זכוכית פרימיום", note: "לוגו הקבוצות, מסגרת זוהרת, מספרים מתגלגלים" },
  { C: W2, name: "טופס הימורים", note: "כמו אפליקציית הימורים: כפתורים עם יחס, בחירה בזהב" },
  { C: W3, name: "VS גדול", note: "היחס מתחת לכל קבוצה, תיקו בתוך עיגול ה־VS" },
  { C: W4, name: "הכי משתלם / הכי בטוח", note: "תגיות שמסמנות את ההימור המשתלם ואת הבטוח" },
  { C: W5, name: "קרוסלת שווקים", note: "כרטיס צבעוני לכל שוק, מחליקים הצידה" },
  { C: W6, name: "בורר שווקים", note: "שוק אחד בכל פעם, מספרים ענקיים" },
  { C: W7, name: "רשתות וכדורים", note: "שערים וכדורים מאיירים כל שוק" },
  { C: W8, name: "פודיום", note: "האפשרות הסבירה עומדת הכי גבוה" },
  { C: W9, name: "שחור וזהב", note: "מראה יוקרתי עם ספרות זהב" },
  { C: W10, name: "גלו את השווי", note: "לוחצים על אפשרות והנקודות מתגלות" },
  { C: W11, name: "רשימה עם מד", note: "שורות נקיות, פס דק מראה את הסיכוי" },
  { C: W12, name: "משושים", note: "אריחי משושה, הפייבוריט בזהב" },
  { C: W13, name: "ניאון", note: "מסגרות זוהרות בצבע לכל שוק" },
  { C: W14, name: "אקורדיון", note: "שווקים נפתחים, בסגור רואים את הסביר ביותר" },
  { C: W15, name: "חצויים בצבעי הקבוצות", note: "פס בצבעי הקבוצות וצ'יפים לשאר" },
  { C: W16, name: "כרטיסים בשכבות", note: "שלושה כרטיסים מונחים זה על זה" },
  { C: W17, name: "טבלת 3×3", note: "כל 8 האפשרויות ברשת אחת" },
  { C: W18, name: "שלט לד היקפי", note: "שלט רץ כמו בצד המגרש + הסביר בכל שוק" },
  { C: W19, name: "בטוח ↔ משתלם", note: "כל אפשרות ממוקמת על ציר מבטוח למשתלם" },
  { C: W20, name: "כרטיסי כניסה", note: "שובר לכל תוצאה עם צבע הקבוצה" },
  { C: W21, name: "מסלול סביב הכדור", note: "האפשרויות מקיפות כדור, לחיצה מציגה פרטים" },
  { C: W22, name: "מינימליסטי עם סמלים", note: "סמלי הקבוצות ברקע, ספרות דקות" },
  { C: W23, name: "בונה צירוף", note: "בוחרים בכל שוק, סכום הנקודות מתגלגל" },
  { C: W24, name: "גרפיקת שידור", note: "כמו לוח מידע בשידור טלוויזיה" },
  { C: W25, name: "במילים", note: "משפט אחד לכל שוק, המספרים מודגשים" },
];
