import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useDragControls, animate, useReducedMotion, LayoutGroup } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown, X, Target, Trophy, Goal, Calculator, Minus, Plus } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import { Match } from "@/api/entities";
import {
  DEMO_MATCH, calcSimPoints, parseScore, scoreEntries, exactPtsFor, markets, useSim,
  SimInput, SimTotal, Breakdown, Simulator, SectionLabel, Segmented, Markets, ExactGrid, Heatmap,
  PopupFrame, SECTIONS, SectionBody, OptionCard,
} from "./AdminScoringModalOptions";

// ── Round 2 — 20 more concepts (21-40) for the 1X2 popup. This round leans on
// fluid-interface craft: springs that start from the live value, velocity
// handoff + momentum projection on drags, rubber-banded edges, glass
// materials, origin-aware popovers, clip-path tabs, and press feedback.
// Demo only — the real MatchScoringRulesModal is untouched. ─────────────

const SPRING = { type: "spring", bounce: 0, duration: 0.4 };
const SPRING_FLICK = { type: "spring", bounce: 0.15, duration: 0.4 };
const EASE_OUT = [0.23, 1, 0.32, 1];
const blurSwap = {
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
  transition: { duration: 0.18, ease: EASE_OUT },
};
const press = "transition-transform duration-150 ease-out active:scale-[0.97]";
const glass = { background: "rgba(17,28,51,0.72)", backdropFilter: "blur(18px) saturate(160%)", WebkitBackdropFilter: "blur(18px) saturate(160%)" };

// Apple's momentum projection (Designing Fluid Interfaces): where a flick would come to rest.
const project = (v, d = 0.998) => ((v / 1000) * d) / (1 - d);
const nearest = (val, pts) => pts.reduce((a, b) => (Math.abs(b - val) < Math.abs(a - val) ? b : a));

function useElementHeight() {
  const ref = useRef(null);
  const [h, setH] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setH(e.contentRect.height));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, h];
}

const guessKey = (s) => (s.a !== null && s.b !== null ? `${s.a}:${s.b}` : null);
const dirOf = (a, b) => (a > b ? "1" : a === b ? "X" : "2");
const rangeOf = (g) => (g <= 2 ? "0–2" : g <= 4 ? "3–4" : "5+");
const bttsOf = (a, b) => (a > 0 && b > 0 ? "כן" : "לא");
const hitShort = (key, a, b) => (key === "dir" ? dirOf(a, b) : key === "btts" ? bttsOf(a, b) : rangeOf(a + b));

function Stepper({ value, onChange }) {
  const v = value ?? 0;
  return (
    <div className="flex items-center gap-1.5" dir="ltr">
      <button onClick={() => onChange(Math.max(0, v - 1))} className={`w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center ${press}`}><Minus className="w-3.5 h-3.5" /></button>
      <span className="w-6 text-center text-2xl font-bold tabular-nums" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{value ?? "–"}</span>
      <button onClick={() => onChange(v + (value === null ? 0 : 1))} className={`w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center ${press}`}><Plus className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ═══ FLUID SHEETS & LAYERS (21-26) ═══════════════════════════════════════

// 21. Glass sheet with 3 detents, momentum projection + velocity handoff
function Option21({ match }) {
  const s = useSim(match);
  const [boxRef, H] = useElementHeight();
  const y = useMotionValue(9999);
  const controls = useDragControls();
  const [detent, setDetent] = useState("peek");
  const detents = H ? { full: 0, half: Math.round(H * 0.45), peek: H - 64 } : null;
  useEffect(() => { if (detents) y.set(detents[detent]); }, [H]);
  const snapTo = (name, velocity = 0) => {
    setDetent(name);
    animate(y, detents[name], { ...(Math.abs(velocity) > 400 ? SPRING_FLICK : SPRING), velocity });
  };
  const onDragEnd = (_, info) => {
    const projected = y.get() + project(info.velocity.y);
    const target = nearest(projected, Object.values(detents));
    snapTo(Object.keys(detents).find((k) => detents[k] === target), info.velocity.y);
  };
  return (
    <PopupFrame match={match} noScroll>
      <div ref={boxRef} className="absolute inset-0 px-4 py-3">
        <Simulator match={match} s={s} />
        <p className="text-center text-[10px] text-slate-500 mt-3">זרוק את הגיליון למעלה/למטה — הוא נוחת לפי מהירות ההחלקה</p>
      </div>
      {detents && (
        <motion.div className="absolute inset-x-0 top-0 bottom-0 rounded-t-3xl border-t border-white/20 flex flex-col shadow-[0_-12px_40px_rgba(0,0,0,0.45)]"
          style={{ y, ...glass }} drag="y" dragListener={false} dragControls={controls}
          dragConstraints={{ top: 0, bottom: detents.peek }} dragElastic={0.18} dragMomentum={false} onDragEnd={onDragEnd}>
          <div onPointerDown={(e) => controls.start(e)} className="pt-2 pb-2 flex flex-col items-center cursor-grab touch-none flex-shrink-0">
            <div className="w-9 h-1 rounded-full bg-white/35 mb-1.5" />
            <div className="flex gap-1">
              {["peek", "half", "full"].map((d) => (
                <button key={d} onClick={() => snapTo(d)} className={`text-[10px] px-2 py-0.5 rounded-full ${detent === d ? "bg-white/15 text-white" : "text-slate-400"}`}>
                  {d === "peek" ? "מקופל" : d === "half" ? "חצי" : "מלא"}
                </button>
              ))}
            </div>
          </div>
          <div className={`flex-1 px-4 pb-4 space-y-4 ${detent === "full" ? "overflow-y-auto" : "overflow-hidden"}`}>
            <Markets match={match} /><ExactGrid match={match} highlight={guessKey(s)} />
          </div>
        </motion.div>
      )}
    </PopupFrame>
  );
}

// 22. Clip-path tabs — a coloured copy of the tab row is clipped to the active tab
function Option22({ match }) {
  const s = useSim(match);
  const [i, setI] = useState(0);
  const step = 100 / SECTIONS.length;
  // RTL: tab 0 sits on the right
  const clip = `inset(0 ${i * step}% 0 ${(SECTIONS.length - 1 - i) * step}% round 999px)`;
  const Row = ({ active }) => (
    <div className={`flex ${active ? "bg-sky-500 text-white" : "text-slate-400"} rounded-full`}>
      {SECTIONS.map((t, k) => (
        <button key={t.id} onClick={() => setI(k)} className="flex-1 py-1.5 text-[11px] font-semibold flex items-center justify-center gap-1"><t.icon className="w-3 h-3" />{t.label}</button>
      ))}
    </div>
  );
  return (
    <PopupFrame match={match}>
      <div className="relative rounded-full bg-white/5 border border-white/10 mb-3">
        <Row />
        <div className="absolute inset-0" style={{ clipPath: clip, transition: "clip-path 260ms cubic-bezier(0.23,1,0.32,1)" }} aria-hidden><Row active /></div>
      </div>
      <AnimatePresence mode="wait"><motion.div key={i} {...blurSwap}><SectionBody id={SECTIONS[i].id} match={match} s={s} /></motion.div></AnimatePresence>
    </PopupFrame>
  );
}

// 23. "Dynamic Island" — the simulator lives in a pill that morphs open
function Option23({ match }) {
  const s = useSim(match);
  const [open, setOpen] = useState(false);
  return (
    <PopupFrame match={match} noScroll>
      <div className="absolute inset-0 overflow-y-auto px-4 pt-14 pb-4 space-y-4">
        <Markets match={match} />
        <SectionLabel title="פגיעה מדויקת" icon={Target} color="text-emerald-400/80" />
        <Heatmap match={match} selected={guessKey(s)} onPick={s.set} />
      </div>
      {open && <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />}
      <motion.div layout transition={SPRING} onClick={() => !open && setOpen(true)}
        className={`absolute left-1/2 top-2 -translate-x-1/2 bg-black border border-white/10 overflow-hidden ${open ? "" : "cursor-pointer"}`}
        style={{ borderRadius: open ? 28 : 999, width: open ? 300 : 190 }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.div key="open" {...blurSwap} className="p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-yellow-400/80 font-semibold">סימולטור</span>
                <button onClick={() => setOpen(false)} className="text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex justify-center gap-4" dir="ltr"><SimInput value={s.a} onChange={s.setA} small /><SimInput value={s.b} onChange={s.setB} small /></div>
              {s.sim && <div className="mt-2"><Breakdown sim={s.sim} /><div className="text-center mt-1"><SimTotal sim={s.sim} /></div></div>}
            </motion.div>
          ) : (
            <motion.div key="closed" {...blurSwap} className="flex items-center justify-between gap-2 px-3 py-1.5">
              <span className="flex items-center gap-1 text-[11px] text-white/80"><Calculator className="w-3.5 h-3.5 text-yellow-400" />{guessKey(s) ? <span dir="ltr">{s.a}-{s.b}</span> : "סימולטור"}</span>
              <span className="text-[11px] font-bold text-yellow-400 tabular-nums">{s.sim ? `${s.sim.total} PTS` : "הקש"}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PopupFrame>
  );
}

// 24. Navigation stack — sub-pages push in, the parent recedes and dims
function Option24({ match }) {
  const s = useSim(match);
  const [stack, setStack] = useState([]);
  const top = stack[stack.length - 1];
  const reduce = useReducedMotion();
  const pageAnim = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } };
  const pages = { markets: { title: "יחסים", body: <Markets match={match} /> }, exact: { title: "פגיעה מדויקת", body: <ExactGrid match={match} highlight={guessKey(s)} /> } };
  const Row = ({ id, icon: Icon, title, sub }) => (
    <button onClick={() => setStack([...stack, id])} className={`w-full flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 ${press}`}>
      <span className="flex items-center gap-2"><Icon className="w-4 h-4 text-sky-400" /><span className="text-right"><div className="text-xs font-semibold">{title}</div><div className="text-[10px] text-slate-400">{sub}</div></span></span>
      <ChevronLeft className="w-4 h-4 text-slate-500" />
    </button>
  );
  return (
    <PopupFrame match={match} noScroll>
      <motion.div className="absolute inset-0 overflow-y-auto px-4 py-3 space-y-3" animate={top && !reduce ? { x: "18%", scale: 0.94, opacity: 0.45 } : { x: 0, scale: 1, opacity: 1 }} transition={SPRING}>
        <Simulator match={match} s={s} />
        <Row id="markets" icon={Trophy} title="יחסים" sub={`1 ${match.home_win_points} · X ${match.draw_points} · 2 ${match.away_win_points}`} />
        <Row id="exact" icon={Target} title="פגיעה מדויקת" sub={`${scoreEntries(match).length} תוצאות + "אחר"`} />
      </motion.div>
      <AnimatePresence>
        {top && (
          <motion.div key={top} {...pageAnim} transition={SPRING} className="absolute inset-0 bg-[#0d1526] overflow-y-auto px-4 py-3 shadow-[8px_0_30px_rgba(0,0,0,0.5)]">
            <button onClick={() => setStack(stack.slice(0, -1))} className="flex items-center gap-0.5 text-xs text-sky-400 mb-3"><ChevronRight className="w-4 h-4" />חזרה</button>
            <div className="text-sm font-bold mb-3">{pages[top].title}</div>
            {pages[top].body}
          </motion.div>
        )}
      </AnimatePresence>
    </PopupFrame>
  );
}

// 25. Picker wheels (iOS UIPickerView) + live receipt
function Wheel({ value, onChange, label }) {
  const ref = useRef(null);
  const ITEM = 34;
  useEffect(() => { ref.current?.scrollTo({ top: value * ITEM }); }, []);
  const onScroll = () => { const idx = Math.round(ref.current.scrollTop / ITEM); if (idx !== value) onChange(Math.max(0, Math.min(9, idx))); };
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-white/70 mb-1">{label}</span>
      <div className="relative w-16 rounded-xl bg-white/[0.03] border border-white/10" style={{ height: ITEM * 3 }}>
        <div className="absolute inset-x-1 rounded-lg bg-white/10 pointer-events-none" style={{ top: ITEM, height: ITEM }} />
        <div ref={ref} onScroll={onScroll} className="h-full overflow-y-scroll snap-y snap-mandatory" style={{ scrollbarWidth: "none", maskImage: "linear-gradient(transparent, #000 30%, #000 70%, transparent)" }}>
          <div style={{ height: ITEM }} />
          {Array.from({ length: 10 }, (_, n) => (
            <div key={n} className="snap-center flex items-center justify-center tabular-nums transition-[opacity,transform] duration-150"
              style={{ height: ITEM, fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, opacity: n === value ? 1 : 0.35, transform: `scale(${n === value ? 1 : 0.85})` }}>{n}</div>
          ))}
          <div style={{ height: ITEM }} />
        </div>
      </div>
    </div>
  );
}
function Option25({ match }) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const sim = calcSimPoints(match, a, b);
  return (
    <PopupFrame match={match}>
      <div className="flex justify-center gap-6" dir="ltr"><Wheel value={a} onChange={setA} label={match.team_a} /><Wheel value={b} onChange={setB} label={match.team_b} /></div>
      <div className="mt-4 rounded-2xl border border-white/10 overflow-hidden">
        {sim.breakdown.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-3 py-2 border-b border-white/5 last:border-0">
            <span className="text-xs text-white/75">{r.label}</span><span className="text-xs font-bold text-yellow-400 tabular-nums">+{r.pts}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-3 py-2.5 bg-sky-500/10"><span className="text-xs font-semibold">סה״כ</span><SimTotal sim={sim} /></div>
      </div>
      <p className="text-[10px] text-slate-500 text-center mt-3">היחסים בתוך הקבלה — אין צורך בחלק נפרד. מסובבים את הגלגלים.</p>
    </PopupFrame>
  );
}

// 26. Collapsing header — big banner scrolls away into a glass bar, sticky section labels
function Option26({ match }) {
  const s = useSim(match);
  const [p, setP] = useState(0);
  const onScroll = (e) => setP(Math.min(1, e.currentTarget.scrollTop / 90));
  const Sticky = ({ title, icon }) => (
    <div className="sticky top-11 z-10 -mx-4 px-4 py-1.5" style={{ ...glass, maskImage: "linear-gradient(#000 80%, transparent)" }}><SectionLabel title={title} icon={icon} /></div>
  );
  return (
    <PopupFrame match={match} hideHeader noScroll>
      <div onScroll={onScroll} className="absolute inset-0 overflow-y-auto px-4 pb-4">
        <div className="sticky top-0 z-20 -mx-4 h-11 flex items-center justify-center gap-2 text-xs font-bold" style={{ ...glass, opacity: p, pointerEvents: p > 0.5 ? "auto" : "none" }}>
          <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-5 h-5" />{match.team_a}<span className="text-sky-500">VS</span>{match.team_b}<TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-5 h-5" />
        </div>
        <div className="-mt-11 pt-4 pb-4 flex items-center justify-around" style={{ opacity: 1 - p, transform: `scale(${1 - p * 0.15})`, transformOrigin: "top" }}>
          <div className="flex flex-col items-center gap-1"><TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-14 h-14" /><span className="text-xs font-bold">{match.team_a}</span></div>
          <span className="text-sm font-black text-sky-500">VS</span>
          <div className="flex flex-col items-center gap-1"><TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-14 h-14" /><span className="text-xs font-bold">{match.team_b}</span></div>
        </div>
        <Sticky title="סימולטור" icon={Calculator} /><div className="py-2"><Simulator match={match} s={s} small /></div>
        <Sticky title="יחסים" icon={Trophy} /><div className="py-2 space-y-2">{markets(match).map((m) => <Segmented key={m.key} items={m.items} />)}</div>
        <Sticky title="פגיעה מדויקת" icon={Target} /><div className="py-2"><ExactGrid match={match} /></div>
      </div>
    </PopupFrame>
  );
}

// ═══ MERGING SECTIONS (27-31) ════════════════════════════════════════════

// 27. Merged simulator — every market row shows all its options; the guess lights up the winners
function Option27({ match }) {
  const s = useSim(match);
  const [heat, setHeat] = useState(false);
  const has = guessKey(s);
  return (
    <PopupFrame match={match}>
      <div className="flex items-center justify-center gap-5 mb-3">
        <div className="flex flex-col items-center gap-1"><span className="text-[10px] text-white/70">{match.team_a}</span><Stepper value={s.a} onChange={s.setA} /></div>
        <div className="flex flex-col items-center gap-1"><span className="text-[10px] text-white/70">{match.team_b}</span><Stepper value={s.b} onChange={s.setB} /></div>
      </div>
      <div className="space-y-2.5">
        {markets(match).map((mk) => {
          const hit = has ? hitShort(mk.key, s.a, s.b) : null;
          return (
            <div key={mk.key}>
              <div className="text-[10px] text-sky-400 mb-1 flex items-center gap-1"><mk.icon className="w-3 h-3" />{mk.title}</div>
              <div className="flex gap-1.5">
                {mk.items.map((it) => {
                  const on = hit === it.short;
                  return (
                    <motion.div key={it.short} animate={{ opacity: hit && !on ? 0.35 : 1, scale: on ? 1.03 : 1 }} transition={SPRING}
                      className="flex-1 rounded-xl border py-1.5 text-center" style={{ borderColor: on ? "rgba(250,204,21,0.6)" : "rgba(255,255,255,0.1)", background: on ? "rgba(250,204,21,0.1)" : "rgba(14,165,233,0.05)" }}>
                      <div className={`text-base font-bold tabular-nums ${on ? "text-yellow-400" : ""}`}>{it.pts}</div><div className="text-[9px] text-slate-400">{it.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div>
          <div className="text-[10px] text-emerald-400 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1"><Target className="w-3 h-3" />פגיעה מדויקת</span>
            <button onClick={() => setHeat(!heat)} className="text-[10px] text-slate-400 underline">{heat ? "הסתר" : "כל התוצאות"}</button>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-2 text-center">
            {has ? <><span className="font-mono text-sm" dir="ltr">{s.a}-{s.b}</span> = <b className="text-emerald-400">{exactPtsFor(match, s.a, s.b)}</b></> : <span className="text-[11px] text-slate-500">בחר תוצאה למעלה</span>}
          </div>
          {heat && <div className="mt-2"><Heatmap match={match} selected={has} onPick={s.set} /></div>}
        </div>
        <AnimatePresence>{s.sim && <motion.div {...blurSwap} className="rounded-xl py-2 text-center" style={{ background: "rgba(9,122,220,0.12)", border: "1px solid rgba(9,122,220,0.3)" }}><SimTotal sim={s.sim} /></motion.div>}</AnimatePresence>
      </div>
    </PopupFrame>
  );
}

// 28. Expanding cards (App Store style) — summary cards morph to full screen
function Option28({ match }) {
  const s = useSim(match);
  const [open, setOpen] = useState(null);
  const mk = markets(match);
  const cards = [
    { id: "sim", title: "סימולטור", icon: Calculator, sub: s.sim ? `${s.a}-${s.b} → ${s.sim.total} נק׳` : "כמה שווה הניחוש שלך?", tint: "rgba(250,204,21,0.12)" },
    { id: "markets", title: "יחסים", icon: Trophy, sub: mk.map((m) => m.items.map((i) => i.pts).join("/")).join("  ·  "), tint: "rgba(14,165,233,0.12)" },
    { id: "exact", title: "פגיעה מדויקת", icon: Target, sub: `${scoreEntries(match).length} תוצאות · עד ${match.score_odds?.other ?? "—"} נק׳`, tint: "rgba(16,185,129,0.12)" },
  ];
  return (
    <PopupFrame match={match} noScroll>
      <LayoutGroup id="o28">
        <div className="absolute inset-0 px-4 py-3 space-y-2.5">
          {cards.map((c) => (
            <motion.button key={c.id} layoutId={`o28-${c.id}`} onClick={() => setOpen(c.id)} transition={SPRING}
              className={`w-full text-right rounded-2xl border border-white/10 p-4 ${press}`} style={{ background: c.tint, borderRadius: 16 }}>
              <motion.div layoutId={`o28-t-${c.id}`} className="flex items-center gap-2 text-sm font-bold"><c.icon className="w-4 h-4" />{c.title}</motion.div>
              <div className="text-[11px] text-slate-400 mt-1" dir="auto">{c.sub}</div>
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {open && (
            <motion.div layoutId={`o28-${open}`} transition={SPRING} className="absolute inset-2 rounded-2xl border border-white/15 bg-[#101a30] overflow-hidden flex flex-col z-10" style={{ borderRadius: 16 }}>
              <div className="flex items-center justify-between p-4 pb-2">
                <motion.div layoutId={`o28-t-${open}`} className="flex items-center gap-2 text-sm font-bold">{React.createElement(cards.find((c) => c.id === open).icon, { className: "w-4 h-4" })}{cards.find((c) => c.id === open).title}</motion.div>
                <button onClick={() => setOpen(null)} className={`p-1 rounded-full bg-white/10 ${press}`}><X className="w-4 h-4" /></button>
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.12 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }} className="flex-1 overflow-y-auto px-4 pb-4">
                <SectionBody id={open} match={match} s={s} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </PopupFrame>
  );
}

// 29. Hold to peek — press & hold reveals the exact table, release dismisses (asymmetric timing)
function Option29({ match }) {
  const s = useSim(match);
  const [peek, setPeek] = useState(false);
  const [holding, setHolding] = useState(false);
  const timer = useRef(null);
  const down = () => { setHolding(true); timer.current = setTimeout(() => setPeek(true), 280); };
  const up = () => { clearTimeout(timer.current); setHolding(false); setPeek(false); };
  return (
    <PopupFrame match={match} noScroll>
      <div className="absolute inset-0 overflow-y-auto px-4 py-3 space-y-4">
        <Simulator match={match} s={s} small />
        <Markets match={match} />
        <button onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up} onContextMenu={(e) => e.preventDefault()}
          className="relative w-full overflow-hidden rounded-xl border border-emerald-500/30 py-3 text-xs font-semibold text-emerald-300 select-none touch-none active:scale-[0.97] transition-transform duration-150">
          <span className="absolute inset-0 bg-emerald-500/25" style={{ clipPath: holding ? "inset(0 0 0 0)" : "inset(0 0 0 100%)", transition: holding ? "clip-path 280ms linear" : "clip-path 160ms ease-out" }} />
          <span className="relative flex items-center justify-center gap-1"><Target className="w-3.5 h-3.5" />החזק להצצה בכל התוצאות</span>
        </button>
      </div>
      <AnimatePresence>
        {peek && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }} transition={{ duration: 0.2, ease: EASE_OUT }}
            className="absolute inset-x-3 bottom-16 rounded-2xl border border-white/15 p-3 pointer-events-none shadow-2xl" style={{ ...glass, transformOrigin: "bottom center" }}>
            <ExactGrid match={match} highlight={guessKey(s)} />
          </motion.div>
        )}
      </AnimatePresence>
    </PopupFrame>
  );
}

// 30. Horizontal scroll-snap pager — the indicator tracks the finger 1:1
function Option30({ match }) {
  const s = useSim(match);
  const ref = useRef(null);
  const [prog, setProg] = useState(0);
  const onScroll = () => { const el = ref.current; setProg(Math.abs(el.scrollLeft) / Math.max(1, el.scrollWidth - el.clientWidth)); };
  const go = (k) => ref.current.scrollTo({ left: -k * ref.current.clientWidth, behavior: "smooth" });
  const n = SECTIONS.length;
  return (
    <PopupFrame match={match} noScroll>
      <div className="absolute inset-0 flex flex-col">
        <div className="relative flex mx-4 mb-2">
          {SECTIONS.map((t, k) => <button key={t.id} onClick={() => go(k)} className="flex-1 py-1.5 text-[11px] font-semibold" style={{ opacity: 0.45 + 0.55 * Math.max(0, 1 - Math.abs(prog * (n - 1) - k)) }}>{t.label}</button>)}
          <div className="absolute bottom-0 h-0.5 rounded-full bg-sky-400" style={{ width: `${100 / n}%`, right: `${prog * (100 - 100 / n)}%` }} />
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 flex overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
          {SECTIONS.map((t) => (
            <div key={t.id} className="w-full flex-shrink-0 snap-start overflow-y-auto px-4 pb-3"><SectionBody id={t.id} match={match} s={s} /></div>
          ))}
        </div>
      </div>
    </PopupFrame>
  );
}

// 31. Goals ladder — pick a total, see only the scores with that many goals
function Option31({ match }) {
  const s = useSim(match);
  const [total, setTotal] = useState(2);
  const rows = scoreEntries(match).filter(([sc]) => { const [h, a] = parseScore(sc); return h + a === total; }).sort((x, y) => parseScore(y[0])[0] - parseScore(x[0])[0]);
  const rangePts = markets(match)[2].items.find((it) => it.short === rangeOf(total)).pts;
  return (
    <PopupFrame match={match}>
      <Simulator match={match} s={s} small />
      <div className="mt-4 space-y-2">
        {markets(match).slice(0, 2).map((m) => <div key={m.key} className="flex items-center gap-2"><span className="text-[10px] text-sky-400 w-20">{m.title}</span><div className="flex-1"><Segmented items={m.items} /></div></div>)}
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-slate-300 flex items-center gap-1"><Goal className="w-3.5 h-3.5 text-sky-400" />סך שערים: <b className="text-white text-sm">{total}{total === 6 ? "+" : ""}</b></span>
          <span className="text-[10px] text-slate-400">טווח {rangeOf(total)} = <b className="text-sky-300">{rangePts}</b></span>
        </div>
        <input type="range" min={0} max={6} value={total} onChange={(e) => setTotal(Number(e.target.value))} className="w-full accent-sky-500" dir="ltr" />
        <div className="flex flex-wrap gap-1.5 mt-2 min-h-[30px]">
          <AnimatePresence mode="popLayout">
            {rows.map(([sc, p]) => (
              <motion.button layout key={sc} {...blurSwap} onClick={() => s.set(...parseScore(sc))} className={`rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-2 py-1 text-[11px] ${press}`}>
                <span className="font-mono" dir="ltr">{sc.replace(":", "-")}</span> <b className="text-emerald-400">{p}</b>
              </motion.button>
            ))}
          </AnimatePresence>
          {!rows.length && <span className="text-[11px] text-slate-500">לא בטבלה — כל תוצאה כזו שווה {match.score_odds?.other}</span>}
        </div>
      </div>
    </PopupFrame>
  );
}

// ═══ GESTURE-FIRST (32-37) ═══════════════════════════════════════════════

// 32. Always-on simulator in a floating glass bar; content scrolls underneath
function Option32({ match }) {
  const s = useSim(match);
  const key = guessKey(s);
  return (
    <PopupFrame match={match} noScroll>
      <div className="absolute inset-0 overflow-y-auto px-4 pt-1 pb-28 space-y-4">
        <Markets match={match} />
        <SectionLabel title="פגיעה מדויקת" icon={Target} color="text-emerald-400/80" />
        <ExactGrid match={match} highlight={key} />
      </div>
      <div className="absolute inset-x-2 bottom-2 rounded-2xl border border-white/15 px-3 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" style={glass}>
        <div className="flex items-center justify-between">
          <Stepper value={s.a} onChange={s.setA} />
          <AnimatePresence mode="wait">
            <motion.div key={s.sim?.total ?? "none"} {...blurSwap} className="text-center">
              {s.sim ? <><div className="text-lg font-black text-yellow-400 tabular-nums leading-none">{s.sim.total}</div><div className="text-[9px] text-slate-400">נקודות</div></> : <div className="text-[10px] text-slate-400 leading-tight">סמלץ<br />ניחוש</div>}
            </motion.div>
          </AnimatePresence>
          <Stepper value={s.b} onChange={s.setB} />
        </div>
      </div>
    </PopupFrame>
  );
}

// 33. Resizable split view — drag the divider; flick snaps by momentum, edges rubber-band
function Option33({ match }) {
  const s = useSim(match);
  const [boxRef, H] = useElementHeight();
  const y = useMotionValue(0);
  const [split, setSplit] = useState(0);
  useEffect(() => { if (H) { y.set(H * 0.5); setSplit(H * 0.5); } }, [H]);
  useEffect(() => y.on("change", setSplit), [y]);
  const snaps = H ? [H * 0.28, H * 0.5, H * 0.75] : [];
  return (
    <PopupFrame match={match} noScroll>
      <div ref={boxRef} className="absolute inset-0">
        {H > 0 && <>
          <div className="absolute inset-x-0 top-0 overflow-y-auto px-4 pt-1" style={{ height: split }}><Simulator match={match} s={s} /></div>
          <div className="absolute inset-x-0 bottom-0 overflow-y-auto px-4 pt-5 pb-3 space-y-4 bg-[#0a1222]" style={{ top: split }}>
            <Markets match={match} /><ExactGrid match={match} highlight={guessKey(s)} />
          </div>
          <motion.div className="absolute inset-x-0 h-5 -mt-2.5 flex items-center justify-center cursor-row-resize touch-none z-10" style={{ y }}
            drag="y" dragConstraints={{ top: snaps[0], bottom: snaps[2] }} dragElastic={0.2} dragMomentum={false}
            onDragEnd={(_, info) => animate(y, nearest(y.get() + project(info.velocity.y), snaps), { ...SPRING, velocity: info.velocity.y })}>
            <div className="w-12 h-1.5 rounded-full bg-white/30" />
          </motion.div>
        </>}
      </div>
    </PopupFrame>
  );
}

// 34. Swipe deck — likeliest scores as cards; flick to the next, tap to simulate
function Option34({ match }) {
  const s = useSim(match);
  const deck = scoreEntries(match).sort((a, b) => a[1] - b[1]);
  const [i, setI] = useState(0);
  const x = useMotionValue(0);
  const cur = deck[i % deck.length];
  const next = (dir) => {
    animate(x, dir * 400, { duration: 0.18, ease: EASE_OUT }).then(() => { x.set(0); setI((v) => v + 1); });
  };
  const sim = cur ? calcSimPoints(match, ...parseScore(cur[0])) : null;
  return (
    <PopupFrame match={match}>
      <div className="flex gap-1.5 mb-3">
        {markets(match).map((m) => (
          <div key={m.key} className="flex-1 rounded-xl bg-white/[0.03] border border-white/10 p-1.5 text-center">
            <div className="text-[9px] text-sky-400">{m.title}</div>
            <div className="text-[10px] tabular-nums">{m.items.map((it) => it.pts).join(" / ")}</div>
          </div>
        ))}
      </div>
      <div className="relative h-[250px]">
        {[2, 1].map((d) => (
          <div key={d} className="absolute inset-0 rounded-3xl border border-white/10 bg-[#13203a]" style={{ transform: `translateY(${d * 10}px) scale(${1 - d * 0.05})`, opacity: 1 - d * 0.3 }} />
        ))}
        {cur && (
          <motion.div key={i} style={{ x }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.9}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) next(Math.sign(info.offset.x || info.velocity.x)); }}
            className="absolute inset-0 rounded-3xl border border-white/15 bg-gradient-to-b from-[#1b2c4f] to-[#101a30] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing touch-none">
            <div className="text-[10px] text-slate-400 mb-1">#{(i % deck.length) + 1} הכי סבירה</div>
            <div className="text-6xl font-bold tabular-nums" dir="ltr" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{cur[0].replace(":", " - ")}</div>
            <div className="text-xs text-emerald-400 mt-1">פגיעה מדויקת: <b>{cur[1]}</b></div>
            <div className="text-xs text-yellow-400 mt-0.5">ניחוש כולל: <b>{sim.total}</b> נק׳</div>
            <button onClick={() => s.set(...parseScore(cur[0]))} className={`mt-3 text-[11px] px-3 py-1 rounded-full bg-white/10 ${press}`}>בחר כניחוש</button>
          </motion.div>
        )}
      </div>
      <div className="text-center text-[10px] text-slate-500 mt-4">החלק ימינה/שמאלה לתוצאה הבאה</div>
      {s.sim && <div className="mt-2 text-center text-[11px]">הניחוש שלך: <span dir="ltr">{s.a}-{s.b}</span> → <b className="text-yellow-400">{s.sim.total}</b></div>}
    </PopupFrame>
  );
}

// 35. Focus mode — once a guess is set, everything irrelevant collapses away
function Option35({ match }) {
  const s = useSim(match);
  const has = guessKey(s);
  const near = has ? scoreEntries(match).filter(([sc]) => { const [h, a] = parseScore(sc); return Math.abs(h - s.a) <= 1 && Math.abs(a - s.b) <= 1; }) : [];
  return (
    <PopupFrame match={match}>
      <Simulator match={match} s={s} small />
      {has && <button onClick={() => s.set(null, null)} className="w-full text-[10px] text-slate-400 mt-1.5 underline">נקה וחזור לתצוגה המלאה</button>}
      <LayoutGroup id="o35">
        <div className="mt-3 space-y-3">
          {markets(match).map((mk) => {
            const hit = has ? hitShort(mk.key, s.a, s.b) : null;
            const items = hit ? mk.items.filter((it) => it.short === hit) : mk.items;
            return (
              <motion.div layout key={mk.key} transition={SPRING} className="space-y-1.5">
                <motion.div layout="position"><SectionLabel title={mk.title} icon={mk.icon} /></motion.div>
                <div className="flex gap-1.5">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {items.map((it) => (
                      <motion.div layout key={it.short} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={SPRING}
                        className={`flex-1 rounded-xl border py-2 text-center ${hit ? "border-yellow-400/50 bg-yellow-400/10" : "border-white/10 bg-sky-500/5"}`}>
                        <div className={`text-lg font-bold ${hit ? "text-yellow-400" : ""}`}>{it.pts}</div><div className="text-[9px] text-slate-400">{it.label}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
          <motion.div layout transition={SPRING}>
            <SectionLabel title={has ? "פגיעה מדויקת — תוצאות שכנות" : "פגיעה מדויקת"} icon={Target} color="text-emerald-400/80" />
            <div className="mt-1.5">
              {has ? (
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {near.map(([sc, p]) => (
                    <span key={sc} className={`rounded-lg px-2 py-1 text-[11px] border ${sc === has ? "border-yellow-400 bg-yellow-400/10" : "border-white/10 bg-white/[0.03]"}`}><span className="font-mono" dir="ltr">{sc.replace(":", "-")}</span> <b className="text-emerald-400">{p}</b></span>
                  ))}
                </div>
              ) : <ExactGrid match={match} />}
            </div>
          </motion.div>
        </div>
      </LayoutGroup>
    </PopupFrame>
  );
}

// 36. Origin-aware popovers — 1 / X / 2 buttons open their score list from the button itself
function Option36({ match }) {
  const s = useSim(match);
  const [open, setOpen] = useState(null);
  const groups = { "1": [], X: [], "2": [] };
  scoreEntries(match).forEach(([sc, p]) => { const [h, a] = parseScore(sc); groups[dirOf(h, a)].push([sc, p]); });
  Object.values(groups).forEach((g) => g.sort((x, y) => x[1] - y[1]));
  const origin = { "1": "bottom right", X: "bottom center", "2": "bottom left" };
  return (
    <PopupFrame match={match}>
      <Simulator match={match} s={s} small />
      <div className="h-4" />
      <Markets match={match} />
      <div className="h-4" />
      <SectionLabel title="פגיעה מדויקת" icon={Target} color="text-emerald-400/80" />
      <div className="relative mt-2">
        {open && <div className="fixed inset-0 z-10" onClick={() => setOpen(null)} />}
        <div className="flex gap-1.5">
          {["1", "X", "2"].map((d) => (
            <div key={d} className="relative flex-1">
              <button onClick={() => setOpen(open === d ? null : d)} className={`w-full rounded-xl border py-2 text-center ${open === d ? "border-emerald-400/60 bg-emerald-500/15" : "border-white/10 bg-white/[0.03]"} ${press}`}>
                <div className="text-sm font-bold">{d}</div><div className="text-[9px] text-slate-400">{groups[d].length} תוצאות</div>
              </button>
              <AnimatePresence>
                {open === d && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }} transition={{ duration: 0.18, ease: EASE_OUT }}
                    className={`absolute bottom-full mb-2 z-20 w-40 rounded-xl border border-white/15 p-2 space-y-1 shadow-2xl ${d === "1" ? "right-0" : d === "2" ? "left-0" : "left-1/2 -translate-x-1/2"}`}
                    style={{ ...glass, transformOrigin: origin[d] }}>
                    {groups[d].map(([sc, p]) => (
                      <button key={sc} onClick={() => { s.set(...parseScore(sc)); setOpen(null); }} className="w-full flex justify-between rounded-md px-2 py-1 hover:bg-white/10 text-[11px]">
                        <span className="font-mono" dir="ltr">{sc.replace(":", "-")}</span><b className="text-emerald-400">{p}</b>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-slate-500 text-center mt-1.5">כל תוצאה אחרת: {match.score_odds?.other}</div>
      </div>
    </PopupFrame>
  );
}

// 37. Crosshair scrub — drag a finger across the grid, the readout follows 1:1
function Option37({ match }) {
  const keys = scoreEntries(match).map(([sc]) => parseScore(sc));
  const max = Math.min(5, Math.max(3, ...keys.flat()));
  const [cell, setCell] = useState(null);
  const gridRef = useRef(null);
  const pick = (e) => {
    const r = gridRef.current.getBoundingClientRect();
    const c = Math.floor(((e.clientX - r.left) / r.width) * (max + 1));
    const row = Math.floor(((e.clientY - r.top) / r.height) * (max + 1));
    if (c >= 0 && c <= max && row >= 0 && row <= max) setCell([row, c]);
  };
  const sim = cell ? calcSimPoints(match, cell[0], cell[1]) : null;
  const vals = scoreEntries(match).map(([, p]) => p);
  const lo = Math.min(...vals), hi = Math.max(...vals, match.score_odds?.other ?? 0);
  return (
    <PopupFrame match={match}>
      <div className="rounded-2xl border border-yellow-500/25 p-3 mb-3 min-h-[118px]" style={{ background: "rgba(9,122,220,0.06)" }}>
        {sim ? <><div className="flex items-center justify-between mb-1.5"><span className="text-2xl font-bold" dir="ltr" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{cell[0]} - {cell[1]}</span><span className="text-lg font-black text-yellow-400 tabular-nums">{sim.total}</span></div><Breakdown sim={sim} /></>
          : <div className="text-center text-xs text-slate-500 pt-9">גרור את האצבע על הגריד</div>}
      </div>
      <div className="flex justify-between text-[9px] text-slate-500 mb-1"><span>↓ {match.team_a}</span><span>{match.team_b} →</span></div>
      <div ref={gridRef} dir="ltr" className="relative grid gap-1 touch-none select-none cursor-crosshair" style={{ gridTemplateColumns: `repeat(${max + 1}, 1fr)` }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); pick(e); }} onPointerMove={(e) => e.buttons && pick(e)}>
        {Array.from({ length: (max + 1) ** 2 }, (_, k) => {
          const r = Math.floor(k / (max + 1)), c = k % (max + 1);
          const inT = `${r}:${c}` in (match.score_odds || {});
          const p = exactPtsFor(match, r, c);
          const t = hi > lo ? (p - lo) / (hi - lo) : 0.5;
          const onRow = cell && cell[0] === r, onCol = cell && cell[1] === c;
          return (
            <div key={k} className="aspect-square rounded-md flex items-center justify-center text-[10px] font-bold tabular-nums transition-[box-shadow,transform] duration-100"
              style={{ background: inT ? `rgba(245,197,24,${0.08 + t * 0.5})` : "rgba(255,255,255,0.03)", color: inT ? "#fff" : "rgba(255,255,255,0.3)",
                boxShadow: onRow && onCol ? "0 0 0 2px #facc15" : onRow || onCol ? "inset 0 0 0 1px rgba(250,204,21,0.35)" : "none", transform: onRow && onCol ? "scale(1.12)" : "none" }}>{p}</div>
          );
        })}
      </div>
      <div className="mt-3 space-y-1">
        {markets(match).map((m) => <div key={m.key} className="flex justify-between text-[10px]"><span className="text-sky-400">{m.title}</span><span className="text-slate-300">{m.items.map((it) => `${it.short} ${it.pts}`).join(" · ")}</span></div>)}
      </div>
    </PopupFrame>
  );
}

// ═══ LAYOUT SYSTEMS (38-40) ══════════════════════════════════════════════

// 38. Bento — no scroll at all; tiles expand in place
function Option38({ match }) {
  const s = useSim(match);
  const [open, setOpen] = useState(null);
  const [dir, btts, range] = markets(match);
  const Tile = ({ id, className, children }) => (
    <motion.button layoutId={`o38-${id}`} onClick={() => setOpen(id)} transition={SPRING} className={`rounded-2xl border border-white/10 bg-white/[0.035] p-2.5 text-right ${press} ${className}`} style={{ borderRadius: 16 }}>{children}</motion.button>
  );
  const mini = (m) => <div className="flex justify-between mt-1">{m.items.map((it) => <div key={it.short} className="text-center"><div className="text-sm font-bold">{it.pts}</div><div className="text-[8px] text-slate-400">{it.short}</div></div>)}</div>;
  return (
    <PopupFrame match={match} noScroll>
      <LayoutGroup id="o38">
        <div className="absolute inset-0 p-3 grid grid-cols-2 grid-rows-4 gap-2">
          <Tile id="sim" className="row-span-2"><div className="text-[10px] text-yellow-400 flex items-center gap-1"><Calculator className="w-3 h-3" />סימולטור</div><div className="text-3xl font-black text-yellow-400 mt-3 tabular-nums">{s.sim ? s.sim.total : "?"}</div><div className="text-[10px] text-slate-400">{s.sim ? <span dir="ltr">{s.a}-{s.b}</span> : "הקש לסימולציה"}</div></Tile>
          <Tile id="dir"><div className="text-[10px] text-sky-400">{dir.title}</div>{mini(dir)}</Tile>
          <Tile id="btts"><div className="text-[10px] text-sky-400">{btts.title}</div>{mini(btts)}</Tile>
          <Tile id="range" className="col-span-2"><div className="text-[10px] text-sky-400">{range.title}</div>{mini(range)}</Tile>
          <Tile id="exact" className="col-span-2"><div className="text-[10px] text-emerald-400 flex items-center gap-1"><Target className="w-3 h-3" />פגיעה מדויקת</div><div className="text-[11px] text-slate-300 mt-1">{scoreEntries(match).length} תוצאות · מ-{Math.min(...scoreEntries(match).map(([, p]) => p))} עד {match.score_odds?.other}</div></Tile>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div layoutId={`o38-${open}`} transition={SPRING} className="absolute inset-2 z-10 rounded-2xl border border-white/15 bg-[#101a30] p-3 flex flex-col" style={{ borderRadius: 16 }}>
              <button onClick={() => setOpen(null)} className={`self-start p-1 rounded-full bg-white/10 mb-2 ${press}`}><X className="w-4 h-4" /></button>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} exit={{ opacity: 0, transition: { duration: 0.06 } }} className="flex-1 overflow-y-auto">
                {open === "sim" ? <Simulator match={match} s={s} /> : open === "exact" ? <ExactGrid match={match} highlight={guessKey(s)} /> : (() => { const m = markets(match).find((x) => x.key === open); return <div className="space-y-2"><SectionLabel title={m.title} icon={m.icon} /><Segmented items={m.items} /></div>; })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </PopupFrame>
  );
}

// 39. Vertical full-page snap (Reels style) with a side progress rail
function Option39({ match }) {
  const s = useSim(match);
  const ref = useRef(null);
  const [page, setPage] = useState(0);
  const onScroll = () => setPage(Math.round(ref.current.scrollTop / ref.current.clientHeight));
  return (
    <PopupFrame match={match} noScroll>
      <div ref={ref} onScroll={onScroll} className="absolute inset-0 overflow-y-auto snap-y snap-mandatory" style={{ scrollbarWidth: "none" }}>
        {SECTIONS.map((t, k) => (
          <div key={t.id} className="h-full snap-start snap-always overflow-hidden px-4 py-3 pl-7 flex flex-col">
            <div className="text-[11px] font-bold text-sky-300 mb-2 flex items-center gap-1"><t.icon className="w-3.5 h-3.5" />{t.label}</div>
            <div className="flex-1 overflow-y-auto">{t.id === "exact" ? <ExactGrid match={match} highlight={guessKey(s)} /> : <SectionBody id={t.id} match={match} s={s} />}</div>
            {k < SECTIONS.length - 1 && <div className="text-center text-[10px] text-slate-500 pt-1 flex items-center justify-center gap-1"><ChevronDown className="w-3 h-3" />{SECTIONS[k + 1].label}</div>}
          </div>
        ))}
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
        {SECTIONS.map((t, k) => <motion.button key={t.id} onClick={() => ref.current.scrollTo({ top: k * ref.current.clientHeight, behavior: "smooth" })} animate={{ height: page === k ? 18 : 6, opacity: page === k ? 1 : 0.35 }} transition={SPRING} className="w-1.5 rounded-full bg-sky-400" />)}
      </div>
    </PopupFrame>
  );
}

// 40. Simple ⇄ Advanced — common path first, the rest one switch deeper
function Option40({ match }) {
  const s = useSim(match);
  const [adv, setAdv] = useState(false);
  const [dir, ...rest] = markets(match);
  return (
    <PopupFrame match={match}>
      <button onClick={() => setAdv(!adv)} className="w-full flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 mb-3">
        <span className="text-xs font-semibold">תצוגה מלאה</span>
        <span className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${adv ? "bg-emerald-500" : "bg-white/15"}`}>
          <motion.span layout transition={SPRING} className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" style={adv ? { left: 2 } : { right: 2 }} />
        </span>
      </button>
      <Simulator match={match} s={s} />
      <div className="mt-4 space-y-2"><SectionLabel title={dir.title} icon={dir.icon} /><Segmented items={dir.items} /></div>
      <AnimatePresence initial={false}>
        {adv && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: EASE_OUT }} className="overflow-hidden">
            <div className="pt-4 space-y-4">
              {rest.map((m) => <div key={m.key} className="space-y-2"><SectionLabel title={m.title} icon={m.icon} /><Segmented items={m.items} /></div>)}
              <SectionLabel title="פגיעה מדויקת" icon={Target} color="text-emerald-400/80" />
              <ExactGrid match={match} highlight={guessKey(s)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!adv && <p className="text-[10px] text-slate-500 text-center mt-3">שתי קבוצות כובשות, טווח שערים ופגיעה מדויקת — בתצוגה המלאה</p>}
    </PopupFrame>
  );
}

const OPTIONS = [
  { n: 21, title: "גיליון זכוכית עם 3 עצירות", tagline: "גיליון שקוף-מטושטש נגרר בין מקופל/חצי/מלא; זריקה מהירה נוחתת לפי מומנטום, הקצוות 'נמתחים'.", approach: "גיליון/שכבות", Comp: Option21 },
  { n: 22, title: "טאבים בחיתוך clip-path", tagline: "עותק צבוע של שורת הטאבים 'נחתך' לטאב הפעיל — מעבר צבע מושלם, והתוכן מתחלף עם טשטוש עדין.", approach: "ניווט", Comp: Option22 },
  { n: 23, title: "Dynamic Island לסימולטור", tagline: "הסימולטור הוא גלולה שחורה צפה שמראה את הניקוד; הקשה 'מותחת' אותה לפאנל מלא.", approach: "גיליון/שכבות", Comp: Option23 },
  { n: 24, title: "מחסנית ניווט (iOS)", tagline: "המסך הראשי = סימולטור + שתי שורות. כל שורה דוחפת עמוד חדש, והקודם נסוג אחורה ומתעמעם.", approach: "גיליון/שכבות", Comp: Option24 },
  { n: 25, title: "גלגלי בחירה + קבלה", tagline: "שני גלגלים בסגנון אייפון לבחירת התוצאה; מתחת קבלה חיה עם כל רכיבי הניקוד.", approach: "מיזוג חלקים", Comp: Option25 },
  { n: 26, title: "כותרת מתכווצת", tagline: "באנר הקבוצות הגדול נגלל ונהפך לפס זכוכית דק; כותרות החלקים נדבקות למעלה.", approach: "גיליון/שכבות", Comp: Option26 },
  { n: 27, title: "סימולטור ממוזג ביחסים", tagline: "אין חלק יחסים נפרד: כל שוק מציג את כל האפשרויות, והניחוש מאיר את מה שפוגע ומעמעם את השאר.", approach: "מיזוג חלקים", Comp: Option27 },
  { n: 28, title: "כרטיסים מתרחבים (App Store)", tagline: "שלושה כרטיסי סיכום; הקשה 'מותחת' כרטיס למסך מלא עם אנימציית morph ואותה דרך חזרה.", approach: "פריסה", Comp: Option28 },
  { n: 29, title: "החזק להצצה", tagline: "לחיצה ארוכה מציגה את טבלת התוצאות כ'הצצה', שחרור מעלים אותה מהר. אין צורך לגלול אליה.", approach: "מחווה", Comp: Option29 },
  { n: 30, title: "דפדוף אופקי עם מחוון חי", tagline: "החלקה בין 3 עמודים עם snap; קו המחוון והטאבים עוקבים אחרי האצבע 1:1, לא רק בסוף.", approach: "ניווט", Comp: Option30 },
  { n: 31, title: "סולם שערים", tagline: "מחוון 'סך שערים' — לכל ערך מוצגות רק התוצאות המדויקות עם אותו מספר שערים.", approach: "מיזוג חלקים", Comp: Option31 },
  { n: 32, title: "סימולטור בבר צף", tagline: "הסימולטור עובר לבר זכוכית קבוע למטה, תמיד זמין; היחסים והטבלה נגללים מתחתיו.", approach: "מחווה", Comp: Option32 },
  { n: 33, title: "מסך מפוצל נגרר", tagline: "סימולטור למעלה, יחסים למטה; גוררים את המפריד — זריקה מהירה נצמדת לעצירה הקרובה.", approach: "מחווה", Comp: Option33 },
  { n: 34, title: "חפיסת קלפים להחלקה", tagline: "התוצאות מהסבירה ביותר כקלפים; זורקים לצד לקלף הבא, הקשה בוחרת כניחוש.", approach: "מחווה", Comp: Option34 },
  { n: 35, title: "מצב פוקוס", tagline: "ברגע שיש ניחוש — כל מה שלא רלוונטי מתקפל, נשארות רק האפשרויות שפוגעות ותוצאות שכנות.", approach: "מיזוג חלקים", Comp: Option35 },
  { n: 36, title: "פופאוברים מהכפתור", tagline: "טבלת התוצאות נהיית 3 כפתורים 1/X/2; כל אחד פותח רשימה שצומחת מהכפתור עצמו.", approach: "מחווה", Comp: Option36 },
  { n: 37, title: "גריד עם כוונת", tagline: "גוררים אצבע על מפת התוצאות — כוונת עוקבת והניקוד המלא מתעדכן ברציפות.", approach: "מחווה", Comp: Option37 },
  { n: 38, title: "Bento בלי גלילה", tagline: "הכל במסך אחד כאריחים; כל אריח נפתח במקום לתצוגה מלאה.", approach: "פריסה", Comp: Option38 },
  { n: 39, title: "דפדוף אנכי (Reels)", tagline: "כל חלק בעמוד מלא, נצמד בגלילה; פס התקדמות אנכי בצד.", approach: "פריסה", Comp: Option39 },
  { n: 40, title: "פשוט ⇄ מלא", tagline: "ברירת מחדל: סימולטור + כיוון בלבד. מתג אחד מוסיף את כל השאר.", approach: "פריסה", Comp: Option40 },
];

export default function AdminScoringModalOptionsExtra() {
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
        <h2 className="text-xl font-bold text-white mb-1">20 אפשרויות נוספות לפופאפ 1X2 (21-40)</h2>
        <p className="text-slate-400 text-sm mb-3">
          סבב שני, עם דגש על תחושת ממשק "נוזלית": גיליונות עם מומנטום, מחוות גרירה, שכבות זכוכית, אנימציות morph,
          ומיזוג של הסימולטור עם היחסים כדי לקצר באמת. דמו בלבד — הפופאפ האמיתי לא שונה. מומלץ לנסות גם בטלפון.
        </p>
        <label className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
          משחק לתצוגה:
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-white text-xs">
            <option value="demo">דמו — {DEMO_MATCH.team_a} נגד {DEMO_MATCH.team_b}</option>
            {realMatches.map((m) => <option key={m.id} value={String(m.id)}>{m.team_a} נגד {m.team_b}</option>)}
          </select>
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
