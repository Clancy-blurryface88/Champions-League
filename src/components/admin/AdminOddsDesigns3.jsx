import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import TeamFlag from "@/components/TeamFlag";
import { getTeamColor } from "@/utils/teamColors";
import { TITLES, fmt } from "./AdminOddsDesigns";

// Set 3 — 25 playful, interactive takes on the markets tab: different
// layouts and different worlds (slot machine, scratch card, penalty, chat,
// receipt, boarding pass, arcade…). Hebrew rule: icons sit left of the text.

const MK = ["dir", "btts", "goals"];
const Flag = ({ m, side, s = "w-6 h-6" }) => <TeamFlag logo={side === "a" ? m.team_a_logo : m.team_b_logo} name={side === "a" ? m.team_a : m.team_b} className={s} animate={false} />;
const name = (m, o) => (o.key === "home" ? m.team_a.trim() : o.key === "away" ? m.team_b.trim() : "תיקו");
const lbl = (mk, o, m) => (mk === "dir" ? (o.key === "draw" ? "תיקו" : `ניצחון ${name(m, o)}`) : mk === "goals" ? `${o.label} שערים` : `שתיהן כובשות: ${o.label}`);
const all = (k) => MK.flatMap((mk) => k[mk].map((o) => ({ ...o, mk })));
const weighted = (items) => { let r = Math.random() * items.reduce((s, o) => s + o.p, 0); for (const o of items) { r -= o.p; if (r <= 0) return o; } return items[0]; };
const glass = { background: "linear-gradient(160deg, rgba(255,255,255,.07), rgba(255,255,255,.02))", border: "1px solid rgba(255,255,255,.1)" };
const N = ({ v, className = "" }) => <span className={`tabular-nums ${className}`} dir="ltr">{fmt(v)}</span>;
const burst = (el) => { if (!el) return; const r = el.getBoundingClientRect(); confetti({ particleCount: 60, spread: 70, origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight }, colors: ["#facc15", "#34d399", "#7cadee", "#fff"] }); };

// points for a full-time score across the three markets
function scorePts(k, a, b) {
  const dir = a > b ? "home" : a < b ? "away" : "draw";
  const btts = a > 0 && b > 0 ? "yes" : "no";
  const g = a + b <= 2 ? "g02" : a + b <= 4 ? "g34" : "g5";
  const hits = [k.dir.find((o) => o.key === dir), k.btts.find((o) => o.key === btts), k.goals.find((o) => o.key === g)];
  return { hits, total: hits.reduce((s, o) => s + o.pts, 0) };
}

// 1 ─ slot machine: pull, three reels land on a weighted outcome each
function X1({ k, m }) {
  const [res, setRes] = useState(null), [spin, setSpin] = useState(false);
  const ref = useRef();
  const pull = () => { if (spin) return; setSpin(true); setRes(null); setTimeout(() => { const r = MK.map((mk) => ({ ...weighted(k[mk]), mk })); setRes(r); setSpin(false); burst(ref.current); }, 1400); };
  const total = res ? res.reduce((s, o) => s + o.pts, 0) : 0;
  return (
    <div className="rounded-3xl p-4" style={{ background: "linear-gradient(180deg,#7f1d1d,#3b0a0a)", border: "3px solid #facc15", boxShadow: "inset 0 0 30px rgba(0,0,0,.6)" }}>
      <div className="text-center text-[13px] font-black text-amber-300 mb-3">מכונת הניחושים 🎰</div>
      <div className="grid grid-cols-3 gap-2 mb-3" ref={ref}>
        {MK.map((mk, i) => (
          <div key={mk} className="h-24 rounded-xl bg-white overflow-hidden relative flex items-center justify-center">
            {spin ? (
              <motion.div className="absolute inset-x-0 flex flex-col items-center gap-4" animate={{ y: ["0%", "-60%"] }} transition={{ duration: 0.25, repeat: Infinity, ease: "linear", delay: i * 0.05 }}>
                {[...k[mk], ...k[mk]].map((o, j) => <span key={j} className="text-[20px] font-black text-slate-800 tabular-nums" dir="ltr">{fmt(o.pts)}</span>)}
              </motion.div>
            ) : res ? (
              <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14, delay: i * 0.15 }} className="text-center px-1">
                <div className="text-[22px] font-black text-slate-900 tabular-nums" dir="ltr">{fmt(res[i].pts)}</div>
                <div className="text-[9px] text-slate-600 leading-tight">{mk === "dir" ? name(m, res[i]) : mk === "btts" ? `שתיהן: ${res[i].label}` : `${res[i].label} שערים`}</div>
              </motion.div>
            ) : <span className="text-3xl">❔</span>}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <motion.button whileTap={{ y: 6 }} onClick={pull} className="px-5 py-2 rounded-full font-black text-slate-900" style={{ background: "linear-gradient(#fde68a,#f59e0b)", boxShadow: "0 4px 0 #92400e" }}>{spin ? "מסתובב..." : "משכו! 🕹️"}</motion.button>
        <span className="text-amber-200 text-[13px]">{res ? <>סה״כ <N v={total} className="font-black text-white text-lg" /></> : "תוצאה אקראית לפי הסיכויים"}</span>
      </div>
    </div>
  );
}

// 2 ─ wheel of fortune for the direction market
function X2({ k, m }) {
  const [rot, setRot] = useState(0), [hit, setHit] = useState(null);
  const cols = ["#2563eb", "#64748b", "#dc2626"];
  let acc = 0;
  const segs = k.dir.map((o, i) => { const s = { ...o, from: acc, to: acc + o.p * 3.6, c: cols[i] }; acc += o.p * 3.6; return s; });
  const grad = segs.map((s) => `${s.c} ${s.from}deg ${s.to}deg`).join(",");
  const spinIt = () => {
    const o = weighted(k.dir), s = segs.find((x) => x.key === o.key);
    const mid = (s.from + s.to) / 2;
    setHit(null); setRot((r) => r + 1440 + (360 - ((r + mid) % 360)));
    setTimeout(() => setHit(o), 2600);
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-56 h-56">
        <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-10 w-0 h-0" style={{ borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "18px solid #facc15" }} />
        <motion.div className="w-full h-full rounded-full relative" style={{ background: `conic-gradient(${grad})`, border: "6px solid #facc15", boxShadow: "0 0 30px rgba(250,204,21,.35)" }} animate={{ rotate: rot }} transition={{ duration: 2.5, ease: [0.15, 0.85, 0.25, 1] }}>
          {segs.map((s) => {
            const a = ((s.from + s.to) / 2 - 90) * (Math.PI / 180);
            return <span key={s.key} className="absolute text-white font-black text-[13px] text-center leading-tight" style={{ left: `${50 + 30 * Math.cos(a)}%`, top: `${50 + 30 * Math.sin(a)}%`, transform: `translate(-50%,-50%) rotate(${(s.from + s.to) / 2}deg)` }}>{fmt(s.pts)}<br /><span className="text-[9px] font-bold">{name(m, s).slice(0, 8)}</span></span>;
          })}
        </motion.div>
        <button onClick={spinIt} className="absolute inset-[38%] rounded-full bg-slate-900 border-4 border-amber-300 text-amber-300 font-black text-[12px]">סובבו</button>
      </div>
      <div className="h-6 text-[14px] text-white">{hit ? <>יצא: <b>{name(m, hit)}</b> · <N v={hit.pts} className="font-black text-amber-300" /> נק'</> : <span className="text-slate-500 text-[12px]">גודל כל פלח = הסיכוי שלו</span>}</div>
      <div className="flex gap-2 text-[11px] text-slate-300">
        {[...k.btts.map((o) => `שתיהן ${o.label} ${fmt(o.pts)}`), ...k.goals.map((o) => `${o.label}: ${fmt(o.pts)}`)].map((t) => <span key={t} className="px-2 py-1 rounded-full" style={glass}>{t}</span>)}
      </div>
    </div>
  );
}

// 3 ─ scratch card (canvas): scratch to reveal the points
function Scratch({ children }) {
  const cv = useRef(), wrap = useRef(), down = useRef(false);
  useEffect(() => {
    const c = cv.current, r = wrap.current.getBoundingClientRect();
    c.width = r.width; c.height = r.height;
    const g = c.getContext("2d");
    const gr = g.createLinearGradient(0, 0, r.width, r.height); gr.addColorStop(0, "#cbd5e1"); gr.addColorStop(.5, "#f8fafc"); gr.addColorStop(1, "#94a3b8");
    g.fillStyle = gr; g.fillRect(0, 0, r.width, r.height);
    g.fillStyle = "#64748b"; g.font = "bold 11px sans-serif"; g.textAlign = "center"; g.fillText("גרדו כאן", r.width / 2, r.height / 2 + 4);
  }, []);
  const scratch = (e) => { if (!down.current) return; const c = cv.current, r = c.getBoundingClientRect(), g = c.getContext("2d"); g.globalCompositeOperation = "destination-out"; g.beginPath(); g.arc(e.clientX - r.left, e.clientY - r.top, 14, 0, 7); g.fill(); };
  return (
    <div ref={wrap} className="relative rounded-xl overflow-hidden h-16 select-none touch-none" style={{ background: "#0f172a" }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
      <canvas ref={cv} className="absolute inset-0 cursor-crosshair" onPointerDown={(e) => { down.current = true; scratch(e); }} onPointerUp={() => (down.current = false)} onPointerLeave={() => (down.current = false)} onPointerMove={scratch} />
    </div>
  );
}
function X3({ k, m }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: "linear-gradient(150deg,#14532d,#052e16)", border: "2px dashed #86efac" }}>
      <div className="text-center text-[13px] font-black text-emerald-200 mb-2">כרטיס גירוד 🪙</div>
      <div className="space-y-2">
        {MK.map((mk) => (
          <div key={mk}>
            <div className="text-[10px] text-emerald-200/80 mb-1">{TITLES[mk]}</div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${k[mk].length},minmax(0,1fr))` }}>
              {k[mk].map((o) => (
                <Scratch key={o.key}><N v={o.pts} className="text-xl font-black text-amber-300" /><span className="text-[9px] text-slate-300">{mk === "dir" ? name(m, o) : o.label}</span></Scratch>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4 ─ penalty: shoot at the goal — left post, centre, right post = 1 / X / 2
function X4({ k, m }) {
  const [shot, setShot] = useState(null);
  const zones = [{ o: k.dir[2], x: 18 }, { o: k.dir[1], x: 50 }, { o: k.dir[0], x: 82 }]; // RTL: home on the right
  return (
    <div>
      <div className="relative h-40 rounded-xl overflow-hidden" style={{ background: "linear-gradient(#0b3d1f,#14532d)" }}>
        <div className="absolute left-[8%] right-[8%] top-3 h-24 border-4 border-white border-b-0" style={{ background: "repeating-linear-gradient(45deg,rgba(255,255,255,.08) 0 2px,transparent 2px 10px),repeating-linear-gradient(-45deg,rgba(255,255,255,.08) 0 2px,transparent 2px 10px)" }} />
        {zones.map(({ o, x }) => (
          <button key={o.key} onClick={() => setShot({ o, x })} className="absolute top-5 w-[26%] h-20 -translate-x-1/2 rounded-lg flex flex-col items-center justify-center hover:bg-white/10" style={{ left: `${x}%` }}>
            {o.key !== "draw" ? <Flag m={m} side={o.key === "home" ? "a" : "b"} s="w-5 h-5" /> : <span className="text-[11px] text-white/80">תיקו</span>}
            <N v={o.pts} className="text-lg font-black text-white drop-shadow" />
          </button>
        ))}
        <AnimatePresence>
          {shot && (
            <motion.div key={shot.o.key + Math.random()} className="absolute text-2xl" initial={{ left: "50%", top: "80%", scale: 1.4 }} animate={{ left: `${shot.x}%`, top: "28%", scale: 0.8, rotate: 540 }} transition={{ duration: 0.5, ease: "easeOut" }} style={{ x: "-50%" }}>⚽</motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white" />
      </div>
      <div className="h-6 mt-2 text-center text-[13px] text-white">{shot ? <>גול! {shot.o.key === "draw" ? "תיקו" : `ניצחון ${name(m, shot.o)}`} שווה <N v={shot.o.pts} className="font-black text-amber-300" /> נק'</> : <span className="text-slate-500 text-[12px]">בעטו לפינה כדי לראות כמה היא שווה</span>}</div>
      <div className="grid grid-cols-5 gap-1 mt-1">{[...k.btts, ...k.goals].map((o, i) => <div key={o.key} className="rounded-lg py-1 text-center" style={glass}><div className="text-[9px] text-slate-400">{i < 2 ? `שתיהן ${o.label}` : o.label}</div><N v={o.pts} className="text-[13px] font-black text-white" /></div>)}</div>
    </div>
  );
}

// 5 ─ coin for BTTS, dice for goals, scale for direction
function X5({ k, m }) {
  const [coin, setCoin] = useState(null), [flip, setFlip] = useState(0), [die, setDie] = useState(null), [roll, setRoll] = useState(0);
  const toss = () => { const o = weighted(k.btts); setFlip((f) => f + 1); setTimeout(() => setCoin(o), 700); };
  const throwDie = () => { const o = weighted(k.goals); setRoll((r) => r + 1); setTimeout(() => setDie(o), 700); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">{k.dir.map((o) => <div key={o.key} className="rounded-xl p-2 text-center" style={glass}><div className="flex justify-center h-6">{o.key === "draw" ? <span>🤝</span> : <Flag m={m} side={o.key === "home" ? "a" : "b"} s="w-5 h-5" />}</div><N v={o.pts} className="text-lg font-black text-white" /></div>)}</div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={toss} className="rounded-2xl p-3 flex flex-col items-center gap-2" style={glass}>
          <motion.div key={flip} initial={{ rotateY: 0 }} animate={{ rotateY: 1080 }} transition={{ duration: 0.7 }} className="w-14 h-14 rounded-full flex items-center justify-center font-black text-slate-900" style={{ background: "radial-gradient(circle at 35% 30%,#fef08a,#ca8a04)" }}>{coin ? coin.label : "?"}</motion.div>
          <span className="text-[11px] text-slate-300">שתיהן כובשות?</span>
          <span className="text-[13px] text-white">{coin ? <><N v={coin.pts} className="font-black text-amber-300" /> נק'</> : "הטילו מטבע 🪙"}</span>
        </button>
        <button onClick={throwDie} className="rounded-2xl p-3 flex flex-col items-center gap-2" style={glass}>
          <motion.div key={roll} initial={{ rotate: 0 }} animate={{ rotate: [0, 200, 380, 360] }} transition={{ duration: 0.7 }} className="w-14 h-14 rounded-xl bg-white flex items-center justify-center font-black text-slate-900 text-[13px]" dir="ltr">{die ? die.label : "🎲"}</motion.div>
          <span className="text-[11px] text-slate-300">כמה שערים?</span>
          <span className="text-[13px] text-white">{die ? <><N v={die.pts} className="font-black text-amber-300" /> נק'</> : "זרקו קובייה 🎲"}</span>
        </button>
      </div>
    </div>
  );
}

// 6 ─ pick a score with steppers, see which markets it hits
function Stepper({ v, set, m, side }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Flag m={m} side={side} s="w-8 h-8" />
      <button onClick={() => set(Math.min(9, v + 1))} className="w-9 h-7 rounded-lg bg-white/10 text-white font-black">+</button>
      <motion.span key={v} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="text-4xl font-black text-white tabular-nums">{v}</motion.span>
      <button onClick={() => set(Math.max(0, v - 1))} className="w-9 h-7 rounded-lg bg-white/10 text-white font-black">−</button>
    </div>
  );
}
function X6({ k, m }) {
  const [a, setA] = useState(1), [b, setB] = useState(1);
  const { hits, total } = scorePts(k, a, b);
  return (
    <div>
      <div className="flex items-center justify-center gap-6 mb-3">
        <Stepper v={a} set={setA} m={m} side="a" /><span className="text-2xl text-slate-500">:</span><Stepper v={b} set={setB} m={m} side="b" />
      </div>
      <div className="space-y-1.5">
        {MK.map((mk, i) => (
          <motion.div key={mk + hits[i].key} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.35)" }}>
            <span className="text-[12px] text-slate-300">{TITLES[mk]}</span><span className="text-[13px] font-bold text-white">{mk === "dir" ? (hits[i].key === "draw" ? "תיקו" : name(m, hits[i])) : hits[i].label}</span><N v={hits[i].pts} className="font-black text-emerald-300" />
          </motion.div>
        ))}
      </div>
      <div className="mt-2 text-center text-[13px] text-slate-300">ב־<span dir="ltr">{a}:{b}</span> תקבלו <N v={total} className="text-xl font-black text-amber-300" /> נק' (בלי בונוס תוצאה מדויקת)</div>
    </div>
  );
}

// 7 ─ score map: 0–4 × 0–4 grid, colour by total points, tap a cell
function X7({ k, m }) {
  const [sel, setSel] = useState([1, 1]);
  const vals = [0, 1, 2, 3, 4];
  const totals = vals.flatMap((a) => vals.map((b) => scorePts(k, a, b).total));
  const lo = Math.min(...totals), hi = Math.max(...totals);
  const c = (t) => `hsl(${160 - ((t - lo) / (hi - lo || 1)) * 130} 70% ${30 + ((t - lo) / (hi - lo || 1)) * 15}%)`;
  const s = scorePts(k, sel[0], sel[1]);
  return (
    <div>
      <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-400" dir="ltr"><Flag m={m} side="a" s="w-4 h-4" />↓ · <Flag m={m} side="b" s="w-4 h-4" />→</div>
      <div className="grid grid-cols-5 gap-1" dir="ltr">
        {vals.map((a) => vals.map((b) => {
          const t = scorePts(k, a, b).total, on = sel[0] === a && sel[1] === b;
          return <motion.button key={`${a}${b}`} whileHover={{ scale: 1.08 }} onClick={() => setSel([a, b])} className="aspect-square rounded-lg flex flex-col items-center justify-center" style={{ background: c(t), outline: on ? "3px solid #fff" : "none" }}><span className="text-[12px] font-black text-white">{a}:{b}</span><span className="text-[9px] text-white/80">{fmt(t)}</span></motion.button>;
        }))}
      </div>
      <div className="mt-2 rounded-xl p-2 text-[12px] text-slate-200" style={glass}><span dir="ltr" className="font-black text-white">{sel[0]}:{sel[1]}</span> · {s.hits.map((o, i) => <span key={i}>{i ? " + " : ""}<N v={o.pts} /></span>)} = <N v={s.total} className="font-black text-amber-300" /></div>
    </div>
  );
}

// 8 ─ floating bubbles, size = chance, tap to pop
function X8({ k, m }) {
  const items = useMemo(() => all(k).map((o, i) => ({ ...o, x: 10 + ((i * 37) % 80), y: 12 + ((i * 53) % 70) })), [k]);
  const [popped, setPopped] = useState({});
  const col = { dir: "#3b82f6", btts: "#10b981", goals: "#a855f7" };
  return (
    <div className="relative h-64 rounded-2xl overflow-hidden" style={{ background: "radial-gradient(circle at 50% 120%,#1e3a8a,#020617)" }}>
      {items.map((o, i) => {
        const size = 34 + o.p * 0.9, id = o.mk + o.key, p = popped[id];
        return (
          <motion.button key={id} onClick={() => setPopped({ ...popped, [id]: true })} className="absolute rounded-full flex flex-col items-center justify-center text-white"
            style={{ left: `${o.x}%`, top: `${o.y}%`, width: size, height: size, marginLeft: -size / 2, background: p ? "transparent" : `radial-gradient(circle at 30% 30%, #fff8, ${col[o.mk]})`, border: p ? `2px dashed ${col[o.mk]}` : "none" }}
            animate={{ y: [0, -10, 0] }} transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}>
            {p ? <><N v={o.pts} className="text-[15px] font-black" /><span className="text-[8px] leading-none">{o.mk === "dir" ? name(m, o).slice(0, 7) : o.label}</span></> : <span className="text-[9px] font-bold opacity-90 px-1 leading-tight">{o.mk === "dir" ? name(m, o).slice(0, 7) : o.mk === "btts" ? `שתיהן ${o.label}` : o.label}</span>}
          </motion.button>
        );
      })}
      <div className="absolute bottom-2 inset-x-0 text-center text-[10px] text-slate-400">בועה גדולה = סביר יותר · פוצצו כדי לראות נקודות 🫧</div>
    </div>
  );
}

// 9 ─ swipe deck: swipe right to keep, left to skip; builds your picks
function X9({ k, m }) {
  const deck = useMemo(() => all(k), [k]);
  const [i, setI] = useState(0), [kept, setKept] = useState([]);
  const x = useMotionValue(0), rot = useTransform(x, [-150, 150], [-14, 14]);
  const card = deck[i];
  const decide = (keep) => { if (keep) setKept([...kept, card]); setI(i + 1); x.set(0); };
  if (!card) return (
    <div className="text-center space-y-2 py-6">
      <div className="text-white font-black">שמרתם {kept.length} אפשרויות 💚</div>
      <div className="flex flex-wrap gap-1 justify-center">{kept.map((o) => <span key={o.mk + o.key} className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-200">{lbl(o.mk, o, m)} · {fmt(o.pts)}</span>)}</div>
      <button onClick={() => { setI(0); setKept([]); }} className="text-[12px] text-sky-300 underline">שוב</button>
    </div>
  );
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-48 w-56">
        <motion.div key={i} drag="x" style={{ x, rotate: rot }} dragConstraints={{ left: 0, right: 0 }} onDragEnd={(e, info) => { if (info.offset.x > 90) decide(true); else if (info.offset.x < -90) decide(false); }}
          className="absolute inset-0 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 cursor-grab" style={{ background: "linear-gradient(160deg,#1e293b,#0f172a)", border: "1px solid rgba(255,255,255,.15)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
          <span className="text-[11px] text-slate-400">{TITLES[card.mk]}</span>
          {card.mk === "dir" && card.key !== "draw" && <Flag m={m} side={card.key === "home" ? "a" : "b"} s="w-10 h-10" />}
          <span className="text-[16px] font-black text-white text-center">{card.mk === "dir" ? (card.key === "draw" ? "תיקו" : name(m, card)) : card.mk === "goals" ? `${card.label} שערים` : card.label}</span>
          <N v={card.pts} className="text-4xl font-black text-amber-300" />
        </motion.div>
      </div>
      <div className="flex gap-4">
        <button onClick={() => decide(false)} className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-300 text-xl">✕</button>
        <span className="text-[11px] text-slate-500 self-center">{i + 1} / {deck.length}</span>
        <button onClick={() => decide(true)} className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 text-xl">♥</button>
      </div>
    </div>
  );
}

// 10 ─ chat with the bot
function X10({ k, m }) {
  const fav = (mk) => k[mk].find((o) => o.fav);
  const Q = [
    { q: "מי הפייבוריט?", a: () => `${fav("dir").key === "draw" ? "תיקו" : name(m, fav("dir"))} הכי צפוי, ${fmt(fav("dir").pts)} נק'. ההפתעה הגדולה שווה ${fmt(Math.max(...k.dir.map((o) => o.pts)))}.` },
    { q: "שתיהן יבקיעו?", a: () => `כן שווה ${fmt(k.btts[0].pts)}, לא שווה ${fmt(k.btts[1].pts)}. ${fav("btts").label === "כן" ? "סביר יותר שכן" : "סביר יותר שלא"}.` },
    { q: "כמה שערים יהיו?", a: () => `הכי סביר ${fav("goals").label} שערים (${fmt(fav("goals").pts)}). ${k.goals.filter((o) => !o.fav).map((o) => `${o.label}: ${fmt(o.pts)}`).join(", ")}.` },
    { q: "מה הכי משתלם?", a: () => { const mx = all(k).reduce((a, b) => (b.pts > a.pts ? b : a)); return `${lbl(mx.mk, mx, m)}: ${fmt(mx.pts)} נק'. סיכון גבוה, תגמול גבוה 🔥`; } },
  ];
  const [log, setLog] = useState([{ bot: true, t: "היי! על מה תרצו לדעת? 👋" }]);
  const end = useRef();
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [log]);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#0b1220", border: "1px solid rgba(255,255,255,.08)" }}>
      <div className="h-48 overflow-y-auto p-3 space-y-2">
        {log.map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12px] ${l.bot ? "bg-slate-800 text-slate-100 rounded-tr-sm" : "bg-emerald-500 text-slate-900 font-bold mr-auto rounded-tl-sm"}`}>{l.t}</motion.div>
        ))}
        <div ref={end} />
      </div>
      <div className="flex flex-wrap gap-1.5 p-2 border-t border-white/5">
        {Q.map((x) => <button key={x.q} onClick={() => setLog((L) => [...L, { t: x.q }, { bot: true, t: x.a() }])} className="text-[11px] px-2.5 py-1.5 rounded-full bg-white/5 text-sky-200 hover:bg-white/10">{x.q}</button>)}
      </div>
    </div>
  );
}

// 11 ─ 3-step wizard with a finish line
function X11({ k, m }) {
  const [step, setStep] = useState(0), [pick, setPick] = useState({});
  const ref = useRef();
  const mk = MK[step];
  const total = MK.reduce((s, x) => s + (k[x].find((o) => o.key === pick[x])?.pts || 0), 0);
  const choose = (key) => { const p = { ...pick, [mk]: key }; setPick(p); if (step < 2) setStep(step + 1); else { setStep(3); setTimeout(() => burst(ref.current), 100); } };
  return (
    <div ref={ref}>
      <div className="flex gap-1 mb-3">{[0, 1, 2].map((i) => <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i < step ? "#34d399" : i === step ? "#7cadee" : "#1e293b" }} />)}</div>
      <AnimatePresence mode="wait">
        {step < 3 ? (
          <motion.div key={step} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 30, opacity: 0 }}>
            <div className="text-[11px] text-slate-400">שלב {step + 1} מתוך 3</div>
            <div className="text-[17px] font-black text-white mb-3">{["מי תנצח?", "שתי הקבוצות יבקיעו?", "כמה שערים?"][step]}</div>
            <div className="space-y-2">{k[mk].map((o) => (
              <button key={o.key} onClick={() => choose(o.key)} className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/10" style={glass}>
                <span className="text-[13px] text-white flex items-center gap-2">{mk === "dir" ? name(m, o) : mk === "goals" ? `${o.label} שערים` : o.label}{mk === "dir" && o.key !== "draw" && <Flag m={m} side={o.key === "home" ? "a" : "b"} s="w-5 h-5" />}</span>
                <N v={o.pts} className="font-black text-amber-300" />
              </button>
            ))}</div>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-3">
            <div className="text-white font-black text-lg">הניחוש שלכם 🏁</div>
            <div className="text-[12px] text-slate-300 my-2">{MK.map((x) => { const o = k[x].find((y) => y.key === pick[x]); return x === "dir" ? name(m, o) : x === "goals" ? `${o.label} שערים` : `שתיהן ${o.label}`; }).join(" · ")}</div>
            <N v={total} className="text-4xl font-black text-amber-300" /><div className="text-[11px] text-slate-400">נקודות אם הכל נכון</div>
            <button onClick={() => { setStep(0); setPick({}); }} className="mt-2 text-[12px] text-sky-300 underline">מהתחלה</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 12 ─ weather forecast: sunny = safe, storm = long shot
function X12({ k, m }) {
  const icon = (p) => (p >= 50 ? "☀️" : p >= 35 ? "🌤️" : p >= 22 ? "☁️" : "⛈️");
  return (
    <div className="rounded-2xl p-3" style={{ background: "linear-gradient(180deg,#0c4a6e,#082f49)" }}>
      <div className="text-[13px] font-black text-sky-100 mb-2">תחזית המשחק 🌦️</div>
      {MK.map((mk) => (
        <div key={mk} className="mb-2">
          <div className="text-[10px] text-sky-200/70 mb-1">{TITLES[mk]}</div>
          <div className="flex gap-1.5">
            {k[mk].map((o) => (
              <div key={o.key} className="flex-1 rounded-xl py-2 text-center bg-white/10">
                <div className="text-[10px] text-sky-100 truncate px-1">{mk === "dir" ? name(m, o) : o.label}</div>
                <div className="text-2xl my-0.5">{icon(o.p)}</div>
                <div className="text-[11px] text-sky-200">{o.p}%</div>
                <N v={o.pts} className="text-[15px] font-black text-white" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="text-[9px] text-sky-200/60 text-center">☀️ צפוי ומשתלם פחות · ⛈️ הפתעה ששווה הרבה</div>
    </div>
  );
}

// 13 ─ printed receipt
function X13({ k, m }) {
  const lines = all(k);
  return (
    <motion.div initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 1.6, ease: "easeOut" }}
      className="mx-auto w-64 bg-[#fafaf9] text-slate-900 px-4 pt-4 pb-6 font-mono text-[12px]" style={{ maskImage: "linear-gradient(#000 96%, transparent)", clipPath: "polygon(0 0,100% 0,100% 100%,95% 97%,90% 100%,85% 97%,80% 100%,75% 97%,70% 100%,65% 97%,60% 100%,55% 97%,50% 100%,45% 97%,40% 100%,35% 97%,30% 100%,25% 97%,20% 100%,15% 97%,10% 100%,5% 97%,0 100%)" }}>
      <div className="text-center font-black">*** קופת הניחושים ***</div>
      <div className="text-center text-[10px] mb-2">{m.team_a.trim()} נגד {m.team_b.trim()}</div>
      {MK.map((mk) => (
        <div key={mk} className="mb-1">
          <div className="font-bold border-b border-dashed border-slate-400">{TITLES[mk]}</div>
          {lines.filter((o) => o.mk === mk).map((o) => <div key={o.key} className="flex justify-between"><span>{mk === "dir" ? name(m, o) : o.label}</span><span dir="ltr">{fmt(o.pts)}</span></div>)}
        </div>
      ))}
      <div className="border-t border-dashed border-slate-400 mt-2 pt-1 flex justify-between font-black"><span>מקסימום אפשרי</span><span dir="ltr">{fmt(MK.reduce((s, mk) => s + Math.max(...k[mk].map((o) => o.pts)), 0))}</span></div>
      <div className="text-center text-[10px] mt-2">תודה ובהצלחה! 🧾</div>
    </motion.div>
  );
}

// 14 ─ boarding pass
function X14({ k, m }) {
  const [h, d, a] = k.dir;
  return (
    <div className="rounded-2xl overflow-hidden flex" style={{ background: "#f8fafc" }}>
      <div className="flex-1 p-3 text-slate-900">
        <div className="flex items-center justify-between text-[10px] font-bold text-sky-700"><span>כרטיס עלייה למשחק ✈️</span><span>UCL</span></div>
        <div className="flex items-center justify-between my-2">
          <div className="text-center"><Flag m={m} side="a" s="w-8 h-8" /><div className="text-[18px] font-black">{fmt(h.pts)}</div></div>
          <div className="flex-1 mx-2 border-t-2 border-dashed border-slate-300 relative"><span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-1 text-[12px] font-black">{fmt(d.pts)}</span></div>
          <div className="text-center"><Flag m={m} side="b" s="w-8 h-8" /><div className="text-[18px] font-black">{fmt(a.pts)}</div></div>
        </div>
        <div className="grid grid-cols-5 gap-1 text-center text-[9px] text-slate-500">
          {[...k.btts, ...k.goals].map((o, i) => <div key={o.key}><div>{i < 2 ? `שתיהן ${o.label}` : `${o.label} ש׳`}</div><div className="text-[13px] font-black text-slate-900 tabular-nums" dir="ltr">{fmt(o.pts)}</div></div>)}
        </div>
      </div>
      <div className="w-16 border-r-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 bg-slate-100">
        <div className="w-10 h-10" style={{ background: "repeating-linear-gradient(90deg,#0f172a 0 2px,transparent 2px 4px,#0f172a 4px 5px,transparent 5px 8px)" }} />
        <span className="text-[8px] text-slate-500 rotate-90 whitespace-nowrap mt-3">שער 22:00</span>
      </div>
    </div>
  );
}

// 15 ─ 8-bit arcade
function X15({ k, m }) {
  const [cur, setCur] = useState(0);
  const items = all(k);
  const px = { fontFamily: "'Courier New', monospace", imageRendering: "pixelated" };
  useEffect(() => {
    const h = (e) => { if (e.key === "ArrowDown") setCur((c) => (c + 1) % items.length); if (e.key === "ArrowUp") setCur((c) => (c + items.length - 1) % items.length); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [items.length]);
  return (
    <div className="rounded-lg p-3" style={{ ...px, background: "#000", border: "4px solid #22c55e", boxShadow: "0 0 0 4px #000, 0 0 0 8px #22c55e" }}>
      <div className="text-center text-[13px] font-bold mb-2" style={{ color: "#facc15" }}>★ INSERT COIN ★</div>
      {items.map((o, i) => (
        <button key={o.mk + o.key} onClick={() => setCur(i)} className="w-full flex justify-between text-[12px] py-0.5" style={{ color: i === cur ? "#000" : "#22c55e", background: i === cur ? "#22c55e" : "transparent" }}>
          <span>{o.mk === "dir" ? name(m, o) : o.mk === "btts" ? `שתיהן ${o.label}` : `${o.label} שערים`} {i === cur ? "▶" : ""}</span><span dir="ltr">{fmt(o.pts).padStart(5, ".")}</span>
        </button>
      ))}
      <div className="text-center text-[10px] mt-2" style={{ color: "#22c55e" }}>↑↓ או לחיצה · HI-SCORE <span dir="ltr">{fmt(Math.max(...items.map((o) => o.pts)))}</span></div>
    </div>
  );
}

// 16 ─ sports newspaper front page
function X16({ k, m }) {
  const fav = k.dir.find((o) => o.fav), g = k.goals.find((o) => o.fav);
  return (
    <div className="bg-[#f5f1e6] text-[#1c1917] p-3 rounded-sm" style={{ fontFamily: "Georgia, serif" }}>
      <div className="flex justify-between text-[9px] border-b-2 border-[#1c1917] pb-1"><span>מהדורת הערב</span><span>ספורט</span></div>
      <h3 className="text-[22px] font-black leading-tight my-2">{fav.key === "draw" ? "המומחים צופים תיקו" : `${name(m, fav)} הפייבוריטית`}</h3>
      <p className="text-[11px] leading-snug mb-2">ניצחון {name(m, fav)} שווה {fmt(fav.pts)} נקודות בלבד, אבל מי שיהמר על ההפתעה יקבל עד {fmt(Math.max(...k.dir.map((o) => o.pts)))}. הצפי: {g.label} שערים.</p>
      <div className="grid grid-cols-3 gap-2 border-t border-[#1c1917] pt-2">
        {MK.map((mk) => (
          <div key={mk} className="text-[10px]"><div className="font-black mb-1">{TITLES[mk]}</div>{k[mk].map((o) => <div key={o.key} className="flex justify-between"><span>{mk === "dir" ? (o.key === "draw" ? "X" : o.key === "home" ? "1" : "2") : o.label}</span><b dir="ltr">{fmt(o.pts)}</b></div>)}</div>
        ))}
      </div>
    </div>
  );
}

// 17 ─ 3D tilt cards (follow the pointer)
function Tilt({ children, c }) {
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setT({ x: ((e.clientY - r.top) / r.height - 0.5) * -24, y: ((e.clientX - r.left) / r.width - 0.5) * 24 }); }} onPointerLeave={() => setT({ x: 0, y: 0 })} style={{ perspective: 600 }} className="flex-1">
      <motion.div animate={{ rotateX: t.x, rotateY: t.y }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="rounded-2xl p-3 text-center h-full" style={{ background: `linear-gradient(150deg, ${c}, #0f172a)`, border: "1px solid rgba(255,255,255,.15)", transformStyle: "preserve-3d", boxShadow: "0 16px 30px rgba(0,0,0,.45)" }}>
        <div style={{ transform: "translateZ(30px)" }}>{children}</div>
      </motion.div>
    </div>
  );
}
function X17({ k, m }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {k.dir.map((o) => (
          <Tilt key={o.key} c={o.key === "home" ? getTeamColor(m.team_a) : o.key === "away" ? getTeamColor(m.team_b) : "#475569"}>
            <div className="flex justify-center h-8">{o.key === "draw" ? <span className="text-2xl">🤝</span> : <Flag m={m} side={o.key === "home" ? "a" : "b"} s="w-8 h-8" />}</div>
            <N v={o.pts} className="text-2xl font-black text-white" /><div className="text-[10px] text-white/80">{o.key === "draw" ? "תיקו" : "ניצחון"}</div>
          </Tilt>
        ))}
      </div>
      <div className="flex gap-2">{k.btts.map((o) => <Tilt key={o.key} c="#047857"><div className="text-[10px] text-white/80">שתיהן כובשות</div><div className="text-[13px] font-bold text-white">{o.label}</div><N v={o.pts} className="text-xl font-black text-white" /></Tilt>)}</div>
      <div className="flex gap-2">{k.goals.map((o) => <Tilt key={o.key} c="#6d28d9"><div className="text-[10px] text-white/80" dir="ltr">{o.label}</div><N v={o.pts} className="text-xl font-black text-white" /></Tilt>)}</div>
      <div className="text-[10px] text-slate-500 text-center">הזיזו את העכבר או האצבע על הכרטיסים</div>
    </div>
  );
}

// 18 ─ fanned deck: tap a card to pull it out
function X18({ k, m }) {
  const cards = all(k);
  const [up, setUp] = useState(null);
  const col = { dir: "#1d4ed8", btts: "#047857", goals: "#7c3aed" };
  return (
    <div className="relative h-72 overflow-hidden">
      {cards.map((o, i) => {
        const ang = (i - (cards.length - 1) / 2) * 9, id = o.mk + o.key, on = up === id;
        return (
          <motion.button key={id} onClick={() => setUp(on ? null : id)} className="absolute left-1/2 bottom-8 w-20 h-28 -ml-10 rounded-xl flex flex-col items-center justify-center text-white origin-bottom"
            style={{ background: `linear-gradient(160deg, ${col[o.mk]}, #0f172a)`, border: "2px solid rgba(255,255,255,.3)", zIndex: on ? 50 : i }}
            animate={{ rotate: on ? 0 : ang, y: on ? -60 : 0, scale: on ? 1.25 : 1, x: on ? 0 : ang * 3 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
            <span className="text-[9px] opacity-80">{TITLES[o.mk]}</span>
            <span className="text-[11px] font-bold text-center leading-tight px-1">{o.mk === "dir" ? name(m, o) : o.label}</span>
            <N v={o.pts} className="text-xl font-black" />
          </motion.button>
        );
      })}
    </div>
  );
}

// 19 ─ lottery machine: balls bounce, draw one per market
function X19({ k, m }) {
  const [drawn, setDrawn] = useState([]);
  const col = { dir: "#ef4444", btts: "#22c55e", goals: "#3b82f6" };
  const balls = all(k);
  const draw = () => setDrawn(MK.map((mk) => ({ ...weighted(k[mk]), mk })));
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-48 rounded-full overflow-hidden" style={{ background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.25), rgba(255,255,255,.04) 60%)", border: "3px solid rgba(255,255,255,.3)" }}>
        {balls.map((o, i) => (
          <motion.div key={o.mk + o.key} className="absolute w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white"
            style={{ background: `radial-gradient(circle at 35% 30%, #fff, ${col[o.mk]} 45%)`, left: "40%", top: "40%" }}
            animate={{ x: [0, (i % 3 - 1) * 50, ((i * 7) % 5 - 2) * 25, 0], y: [0, ((i * 5) % 5 - 2) * 30, (i % 2 ? 1 : -1) * 50, 0] }} transition={{ duration: 2.4 + (i % 4) * 0.4, repeat: Infinity, ease: "easeInOut" }}>
            <span dir="ltr">{fmt(o.pts)}</span>
          </motion.div>
        ))}
      </div>
      <button onClick={draw} className="px-5 py-2 rounded-full font-black text-white" style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)" }}>הגרילו 🎱</button>
      <div className="flex gap-2 min-h-[56px]">
        {drawn.map((o, i) => (
          <motion.div key={o.mk + o.key + i} initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.25, type: "spring" }} className="flex flex-col items-center">
            <span className="w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-black text-white" style={{ background: `radial-gradient(circle at 35% 30%, #fff, ${col[o.mk]} 45%)` }} dir="ltr">{fmt(o.pts)}</span>
            <span className="text-[9px] text-slate-300 mt-0.5">{o.mk === "dir" ? name(m, o).slice(0, 8) : o.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 20 ─ equalizer: bars dance, tap to freeze on the real values
function X20({ k, m }) {
  const [live, setLive] = useState(true);
  const items = all(k);
  const col = { dir: "#38bdf8", btts: "#34d399", goals: "#e879f9" };
  return (
    <button onClick={() => setLive(!live)} className="w-full rounded-2xl p-3" style={{ background: "#020617" }}>
      <div className="flex items-end justify-between h-36 gap-1.5" dir="ltr">
        {items.map((o, i) => (
          <div key={o.mk + o.key} className="flex-1 flex flex-col items-center justify-end h-full">
            <span className="text-[10px] font-black text-white mb-0.5">{live ? "" : fmt(o.pts)}</span>
            <motion.div className="w-full rounded-t" style={{ background: `linear-gradient(${col[o.mk]}, ${col[o.mk]}33)` }}
              animate={live ? { height: ["20%", `${30 + ((i * 37) % 60)}%`, "35%", `${20 + ((i * 53) % 70)}%`] } : { height: `${Math.max(o.p, 8)}%` }}
              transition={live ? { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: i * 0.07 } : { type: "spring", stiffness: 120, damping: 14 }} />
            <span className="text-[8px] text-slate-400 mt-0.5">{o.mk === "dir" ? o.short : o.label}</span>
          </div>
        ))}
      </div>
      <div className="text-[11px] text-slate-400 mt-2">{live ? "הקישו כדי לעצור על הסיכויים האמיתיים ⏸️" : "גובה = סיכוי · מעל = נקודות · הקישו להפעלה ▶️"}</div>
    </button>
  );
}

// 21 ─ battle cards: each team as a trading card
function X21({ k, m }) {
  const [h, d, a] = k.dir;
  const Card = ({ o, side }) => {
    const c = getTeamColor(side === "a" ? m.team_a : m.team_b);
    return (
      <motion.div whileHover={{ y: -6, rotate: side === "a" ? 2 : -2 }} className="flex-1 rounded-2xl p-2" style={{ background: `linear-gradient(160deg, #fde68a, ${c})`, padding: 3 }}>
        <div className="rounded-xl p-2 h-full" style={{ background: "#0f172a" }}>
          <div className="flex justify-between items-center text-[10px] text-amber-200"><span className="font-black truncate">{(side === "a" ? m.team_a : m.team_b).trim()}</span><span>{o.fav ? "★" : ""}</span></div>
          <div className="flex justify-center my-2"><Flag m={m} side={side} s="w-12 h-12" /></div>
          <div className="text-[10px] text-slate-300 flex justify-between"><span>כוח ניצחון</span><b className="text-white">{o.p}%</b></div>
          <div className="h-1.5 rounded bg-white/10 my-1"><div className="h-full rounded" style={{ width: `${o.p}%`, background: c }} /></div>
          <div className="text-[10px] text-slate-300 flex justify-between"><span>פרס</span><b className="text-amber-300 tabular-nums" dir="ltr">{fmt(o.pts)}</b></div>
        </div>
      </motion.div>
    );
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-stretch"><Card o={h} side="a" /><div className="flex flex-col items-center justify-center"><span className="text-[10px] text-slate-400">תיקו</span><N v={d.pts} className="font-black text-white" /></div><Card o={a} side="b" /></div>
      <div className="grid grid-cols-5 gap-1">{[...k.btts, ...k.goals].map((o, i) => <div key={o.key} className="rounded-lg py-1 text-center" style={glass}><div className="text-[9px] text-slate-400">{i < 2 ? `שתיהן ${o.label}` : o.label}</div><N v={o.pts} className="text-[13px] font-black text-white" /></div>)}</div>
    </div>
  );
}

// 22 ─ drag the ball between the teams: where you drop it decides 1 / X / 2
function X22({ k, m }) {
  const [pos, setPos] = useState(50);
  const track = useRef();
  const [h, d, a] = k.dir;
  const zone = pos > 62 ? h : pos < 38 ? a : d; // RTL: home on the right
  const move = (e) => { const r = track.current.getBoundingClientRect(); setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))); };
  return (
    <div className="space-y-3">
      <div ref={track} className="relative h-20 rounded-2xl touch-none" style={{ background: `linear-gradient(90deg, ${getTeamColor(m.team_b)}88, #1e293b 38%, #1e293b 62%, ${getTeamColor(m.team_a)}88)` }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); move(e); }} onPointerMove={(e) => e.buttons && move(e)}>
        <div className="absolute inset-y-0 left-[38%] right-[38%] border-x border-dashed border-white/20" />
        <div className="absolute left-2 top-1/2 -translate-y-1/2"><Flag m={m} side="b" s="w-7 h-7" /></div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2"><Flag m={m} side="a" s="w-7 h-7" /></div>
        <motion.div className="absolute top-1/2 text-3xl -translate-y-1/2 -translate-x-1/2 cursor-grab" animate={{ left: `${pos}%`, rotate: pos * 7 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>⚽</motion.div>
      </div>
      <motion.div key={zone.key} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center rounded-xl py-2" style={glass}>
        <div className="text-[12px] text-slate-300">גררו את הכדור לצד שלדעתכם ינצח</div>
        <div className="text-[15px] font-black text-white">{zone.key === "draw" ? "תיקו" : `ניצחון ${name(m, zone)}`} · <N v={zone.pts} className="text-amber-300" /> נק'</div>
      </motion.div>
      <div className="grid grid-cols-5 gap-1">{[...k.btts, ...k.goals].map((o, i) => <div key={o.key} className="rounded-lg py-1 text-center" style={glass}><div className="text-[9px] text-slate-400">{i < 2 ? `שתיהן ${o.label}` : o.label}</div><N v={o.pts} className="text-[13px] font-black text-white" /></div>)}</div>
    </div>
  );
}

// 23 ─ goals slider 0–7 lights up the matching range and BTTS hint
function X23({ k }) {
  const [g, setG] = useState(2);
  const range = g <= 2 ? "g02" : g <= 4 ? "g34" : "g5";
  const r = k.goals.find((o) => o.key === range);
  return (
    <div className="space-y-3">
      <div className="text-center"><motion.span key={g} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-5xl font-black text-white inline-block">{g}</motion.span><div className="text-[11px] text-slate-400">שערים במשחק</div></div>
      <div className="flex justify-center gap-0.5 text-xl h-7" dir="ltr">{Array.from({ length: g }).map((_, i) => <motion.span key={i} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>⚽</motion.span>)}</div>
      <input type="range" min={0} max={7} value={g} onChange={(e) => setG(Number(e.target.value))} className="w-full accent-emerald-400" dir="ltr" />
      <div className="flex gap-2">
        {k.goals.map((o) => (
          <div key={o.key} className="flex-1 rounded-xl py-2 text-center transition-all" style={{ background: o.key === range ? "rgba(52,211,153,.18)" : "rgba(255,255,255,.04)", border: `1px solid ${o.key === range ? "#34d399" : "transparent"}` }}>
            <div className="text-[11px] text-slate-300" dir="ltr">{o.label}</div><N v={o.pts} className={`text-lg font-black ${o.key === range ? "text-emerald-300" : "text-white"}`} />
          </div>
        ))}
      </div>
      <div className="text-[12px] text-center text-slate-300">טווח {r.label} שווה <N v={r.pts} className="font-black text-amber-300" /> · {g === 0 ? "שתיהן לא יבקיעו" : g === 1 ? "רק קבוצה אחת תבקיע" : "אולי שתיהן יבקיעו"} ({g >= 2 ? `כן ${fmt(k.btts[0].pts)}` : `לא ${fmt(k.btts[1].pts)}`})</div>
    </div>
  );
}

// 24 ─ vending machine: press a code, the snack drops
function X24({ k, m }) {
  const items = all(k);
  const [got, setGot] = useState(null);
  return (
    <div className="rounded-2xl p-2 flex gap-2" style={{ background: "#991b1b" }}>
      <div className="flex-1 rounded-xl p-2 grid grid-cols-2 gap-1.5" style={{ background: "#0f172a", border: "3px solid #e5e7eb" }}>
        {items.map((o, i) => (
          <button key={o.mk + o.key} onClick={() => setGot({ ...o, code: `${"ABCD"[Math.floor(i / 2)]}${(i % 2) + 1}` })} className="rounded-md py-1.5 text-center bg-slate-800 hover:bg-slate-700">
            <div className="text-[9px] text-slate-400" dir="ltr">{"ABCD"[Math.floor(i / 2)]}{(i % 2) + 1}</div>
            <div className="text-[10px] text-white leading-tight px-0.5">{o.mk === "dir" ? name(m, o).slice(0, 9) : o.mk === "btts" ? `שתיהן ${o.label}` : `${o.label} ש׳`}</div>
          </button>
        ))}
      </div>
      <div className="w-24 flex flex-col gap-2">
        <div className="rounded-md bg-black text-emerald-400 text-center text-[13px] py-1 font-mono" dir="ltr">{got ? got.code : "--"}</div>
        <div className="flex-1 rounded-md bg-black/60 relative overflow-hidden flex items-end justify-center pb-1">
          <AnimatePresence>{got && <motion.div key={got.code} initial={{ y: -120 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="rounded-md px-2 py-1 bg-amber-300 text-slate-900 text-center"><N v={got.pts} className="text-lg font-black" /><div className="text-[8px]">נק'</div></motion.div>}</AnimatePresence>
        </div>
        <div className="text-[9px] text-white/80 text-center">בחרו קוד 🍫</div>
      </div>
    </div>
  );
}

// 25 ─ retro terminal that types its answer
function X25({ k, m }) {
  // one entry per printed line; rows are laid out as columns so Hebrew and
  // numbers don't get reordered by the bidi algorithm
  const lines = useMemo(() => [
    { cmd: `> analyze ${m.team_a.trim()} vs ${m.team_b.trim()}` },
    ...MK.flatMap((mk) => [{ head: TITLES[mk] }, ...k[mk].map((o) => ({ row: o, label: mk === "dir" ? name(m, o) : o.label }))]),
    { cmd: "> done ✔" },
  ], [k, m]);
  const [n, setN] = useState(0);
  useEffect(() => { setN(0); const iv = setInterval(() => setN((x) => (x >= lines.length ? x : x + 1)), 260); return () => clearInterval(iv); }, [lines]);
  return (
    <div className="rounded-xl p-3 font-mono text-[11px] leading-relaxed" style={{ background: "#0a0a0a", color: "#4ade80", border: "1px solid #14532d", boxShadow: "inset 0 0 30px rgba(74,222,128,.08)" }}>
      <div className="flex gap-1 mb-2"><i className="w-2.5 h-2.5 rounded-full bg-red-500" /><i className="w-2.5 h-2.5 rounded-full bg-yellow-400" /><i className="w-2.5 h-2.5 rounded-full bg-green-500" /></div>
      {lines.slice(0, n).map((l, i) => l.cmd ? <div key={i} dir="ltr">{l.cmd}</div>
        : l.head ? <div key={i} className="text-green-300 mt-1"># {l.head}</div>
        : <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-3 pr-3"><span>{l.label}</span><span dir="ltr" className="text-green-200">{fmt(l.row.pts)}</span><span dir="ltr" className="text-green-700 w-10 text-left">{l.row.p}%</span></div>)}
      {n < lines.length && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>█</motion.span>}
      <button onClick={() => setN(0)} className="mt-2 text-[10px] text-green-300/70 underline block">הרצה מחדש</button>
    </div>
  );
}

export const VARIANTS3 = [
  { C: X1, name: "מכונת מזל", note: "מושכים בידית, שלושה גלגלים נעצרים לפי הסיכויים" },
  { C: X2, name: "גלגל המזל", note: "פלח לכל תוצאה בגודל הסיכוי שלה, מסובבים ורואים מה יצא" },
  { C: X3, name: "כרטיס גירוד", note: "גורדים עם האצבע או העכבר כדי לחשוף נקודות" },
  { C: X4, name: "בעיטת פנדל", note: "בועטים לפינה: בית, אמצע (תיקו) או חוץ" },
  { C: X5, name: "מטבע וקובייה", note: "מטבע לשתי קבוצות כובשות, קובייה לכמות השערים" },
  { C: X6, name: "בחרו תוצאה", note: "קובעים תוצאה עם + ו־−, ורואים אילו שווקים פוגעים וכמה זה שווה" },
  { C: X7, name: "מפת תוצאות", note: "כל תוצאה מ־0:0 עד 4:4 צבועה לפי הנקודות, לחיצה מפרטת" },
  { C: X8, name: "בועות", note: "בועה גדולה = סבירה יותר, מפוצצים כדי לגלות נקודות" },
  { C: X9, name: "סוויפ", note: "מחליקים ימינה לשמור, שמאלה לדלג, ובסוף רואים את הבחירות" },
  { C: X10, name: "צ'אט עם הבוט", note: "שואלים שאלות מוכנות ומקבלים תשובות עם המספרים" },
  { C: X11, name: "אשף 3 שלבים", note: "מי תנצח? שתיהן יבקיעו? כמה שערים? ובסוף סיכום" },
  { C: X12, name: "תחזית מזג אוויר", note: "שמש = צפוי, סערה = הפתעה ששווה הרבה" },
  { C: X13, name: "קבלה מודפסת", note: "הקבלה יוצאת מהמדפסת עם כל היחסים והמקסימום האפשרי" },
  { C: X14, name: "כרטיס עלייה", note: "כרטיס טיסה בין שתי הקבוצות" },
  { C: X15, name: "ארקייד", note: "מסך 8־ביט ירוק, בוחרים עם החיצים" },
  { C: X16, name: "עיתון ספורט", note: "כותרת ראשית וכתבה קצרה מתוך היחסים" },
  { C: X17, name: "כרטיסים בתלת־ממד", note: "הכרטיסים נוטים אחרי העכבר או האצבע" },
  { C: X18, name: "חפיסת קלפים", note: "קלפים בהנפה, לחיצה שולפת קלף" },
  { C: X19, name: "מכונת הגרלות", note: "כדורים קופצים, מגרילים תוצאה לכל שוק" },
  { C: X20, name: "אקולייזר", note: "עמודות רוקדות, הקשה עוצרת על הסיכויים האמיתיים" },
  { C: X21, name: "קלפי קרב", note: "כל קבוצה כקלף אספנים עם כוח ניצחון ופרס" },
  { C: X22, name: "גררו את הכדור", note: "גוררים כדור בין הקבוצות, האזור קובע 1 / X / 2" },
  { C: X23, name: "מחוון שערים", note: "בוחרים כמה שערים, הטווח המתאים נדלק" },
  { C: X24, name: "מכונת ממכר", note: "לוחצים קוד והנקודות נופלות למגש" },
  { C: X25, name: "טרמינל", note: "מסוף רטרו שמקליד את הניתוח שורה אחרי שורה" },
];
