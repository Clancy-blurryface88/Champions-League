import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from "framer-motion";
import { supabase } from "@/api/supabase";
import { forecastResult, forecastHistory } from "@/utils/forecast";

// The round's score forecast (21.11.2026, designs 68 and 70):
//  ForecastPopup — after sending the predictions: "received", the forecast with its expected range
//    (a pointer slides inside it and stops on the forecast), explained under a fine line, and the numbers
//    under it as squares (Squares); a light runs around the frame.
//  ForecastResult — after the round: the actual against the forecast as two glasses filling with
//    water (like the odds squares), the verdict, and statistics per kind of prediction.

const GOLD = "#facc15", GREEN = "#22c55e", RED = "#f87171", WATER = "#22d3ee";
const NUM = "var(--num-font)";
const ease = [0.23, 1, 0.32, 1];
const TEXT = {
  fc: "התחזית מחושבת על פי הניחושים שלך, היחסים של כל משחק והכושר של הקבוצות העונה, והטווח הוא טווח אפשרי על פי התחזית.",
};
const CAT_NAMES = [["oc", "כיוון"], ["bt", "שתי קבוצות כובשות"], ["gr", "טווח שערים"], ["ex", "תוצאה מדויקת"]];
const CSS = `@property --fa { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes fa-spin { to { --fa: 360deg; } } .fa-run { animation: fa-spin 3s linear infinite; }
@keyframes fc-wave{from{transform:translateX(0)}to{transform:translateX(-50%)}}`;

function Count({ to, dec = 0, delay = 0, dur = 1.1, style }) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => { const c = animate(0, to, { duration: dur, delay, ease: [0.16, 1, 0.3, 1], onUpdate: setV }); return () => c.stop(); }, [to]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span dir="ltr" style={{ fontFamily: NUM, fontWeight: 800, fontVariantNumeric: "tabular-nums", ...style }}>{v.toFixed(dec)}</span>;
}
const Tick = ({ size = 30, delay = 0.15 }) => <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
  <motion.circle cx="20" cy="20" r="17" fill="none" stroke={GREEN} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay, ease }} />
  <motion.path d="M12 20.5 L18 26 L28.5 14.5" fill="none" stroke={GREEN} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: delay + 0.45, ease }} />
</svg>;
const Explain = ({ children, d }) => <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
  <div style={{ height: 1, margin: "10px 0 8px", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)" }} />
  <div style={{ fontSize: 12, lineHeight: 1.5, color: "rgba(255,255,255,.62)", textAlign: "center", textWrap: "balance" }}>{children}</div>
</motion.div>;
const pts = (s = 12) => <span style={{ fontSize: s, fontWeight: 700, color: "rgba(255,255,255,.6)", marginInlineStart: 4 }}>נק׳</span>;
function Shell({ onClose, children, frame = false }) {
  return createPortal(<motion.div className="fixed inset-0 flex items-center justify-center px-4" style={{ zIndex: 120, background: "rgba(2,6,23,.86)" }}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <style>{CSS}</style>
    <motion.div dir="rtl" initial={{ y: 30, scale: 0.94, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={frame ? "fa-run" : undefined}
      style={{ width: "100%", maxWidth: 360, borderRadius: 22, padding: frame ? 2 : 0, color: "#fff", boxShadow: "0 24px 60px rgba(0,0,0,.6)",
        background: frame ? "conic-gradient(from var(--fa), #facc15, #1e3a8a 25%, #22c55e 50%, #1e3a8a 75%, #facc15)" : "none" }}>
      <div style={{ borderRadius: 20, padding: "18px 18px 14px", background: "linear-gradient(170deg,#132657,#0a1430 75%)", border: frame ? "none" : "1px solid rgba(255,255,255,.14)", maxHeight: "86vh", overflowY: "auto" }}>{children}</div>
    </motion.div>
  </motion.div>, document.body);
}
const CloseBtn = ({ onClose, d }) => <motion.button type="button" onClick={onClose} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d }}
  className="w-full mt-4" style={{ height: 44, borderRadius: 12, fontWeight: 900, fontSize: 15, color: "#1a1405", background: "linear-gradient(135deg,#fde047,#eab308)", transform: "skewX(-10deg)" }}>
  <span style={{ display: "inline-block", transform: "skewX(10deg)" }}>סגירה</span></motion.button>;

// The numbers under the forecast (design 4, 24.11): the chance of passing the player's average as a ring, and
// four squares beside it — no explanations, so the whole pop-up is one screen.
function Squares({ f, d }) {
  const x = f.cats || {}, R = 44, C = 2 * Math.PI * R;
  const inn = (i) => ({ initial: { opacity: 0, y: 12, scale: 0.94 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { delay: d + i * 0.1, type: "spring", stiffness: 260, damping: 22 } });
  const box = (i, t, val, dec, unit) => <motion.div {...inn(i)} className="flex flex-col items-center justify-center text-center"
    style={{ borderRadius: 16, padding: "9px 5px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)" }}>
    <div className="flex items-center justify-center" style={{ minHeight: 42, fontSize: 11.5, fontWeight: 800, lineHeight: 1.2, color: "#bfdbfe", textWrap: "balance" }}>{t}</div>
    <div style={{ marginTop: 4 }}>{val == null ? <span style={{ fontSize: 22, fontWeight: 800, color: "rgba(255,255,255,.4)" }}>—</span> : <><Count to={val} dec={dec} delay={d + 0.1 + i * 0.1} style={{ fontSize: 27, lineHeight: 1 }} />{unit && pts(11)}</>}</div>
  </motion.div>;
  return <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr 1fr", gap: 8, marginTop: 10 }}>
    <motion.div {...inn(0)} className="flex flex-col items-center justify-center" style={{ gridRow: "span 2", borderRadius: 18, padding: "10px 4px", background: "linear-gradient(170deg,rgba(34,197,94,.2),rgba(0,224,255,.08))", border: "1px solid rgba(34,227,192,.4)" }}>
      <div className="relative" style={{ width: "100%", maxWidth: 104 }}>
        <svg viewBox="0 0 104 104" style={{ display: "block", transform: "rotate(-90deg)" }}>
          <circle cx="52" cy="52" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="9" />
          {x.beat > 0 && <motion.circle cx="52" cy="52" r={R} fill="none" stroke="#22e3c0" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - x.beat / 100) }} transition={{ delay: d + 0.2, duration: 1.4, ease: "easeOut" }} />}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center" dir="ltr" style={{ fontSize: 28, fontWeight: 800 }}>{x.beat == null ? <span style={{ color: "rgba(255,255,255,.4)" }}>—</span> : <><Count to={x.beat} delay={d + 0.2} dur={1.4} style={{ lineHeight: 1 }} /><span style={{ fontFamily: NUM, lineHeight: 1 }}>%</span></>}</div>
      </div>
      <div className="text-center" style={{ marginTop: 8, fontSize: 12, fontWeight: 800, lineHeight: 1.3, color: "#8ff5df" }}>הסיכוי לעבור<br />את הממוצע</div>
    </motion.div>
    {box(1, "תחזית פגיעה בכיוונים", x.dir == null ? null : Math.round(x.dir), 0)}
    {box(2, "תחזית לפגיעה בתוצאות מדויקות", x.exact, 1)}
    {box(3, "ממוצע נקודות למחזור", f.avg == null ? null : Math.round(f.avg), 0)}
    {box(4, "פוטנציאל", Math.round(f.max), 0, true)}
  </div>;
}

// ── after sending ──
export function ForecastPopup({ f, onClose }) {
  const FCR = Math.round(f.fc);
  const LO = Math.max(0, Math.min(f.lo, FCR) - 6), HI = Math.max(f.hi, FCR) + 7;
  const PX = (v) => ((v - LO) / (HI - LO || 1)) * 100;
  const mv = useMotionValue(f.lo);
  const [done, setDone] = React.useState(false);
  const [v, setV] = React.useState(f.lo);
  React.useEffect(() => {
    const span = f.hi - f.lo;
    const keys = [f.lo, f.hi, f.lo + span * 0.15, f.lo + span * 0.8, f.lo + span * 0.25, f.lo + span * 0.55, FCR];
    const c = animate(mv, keys, { delay: 1.2, duration: 2.8, times: [0, 0.25, 0.45, 0.62, 0.77, 0.89, 1], ease: "easeInOut", onUpdate: setV, onComplete: () => setDone(true) });
    return () => c.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const left = useTransform(mv, (x) => `${PX(x)}%`);
  return <Shell onClose={onClose} frame>
    <div className="flex items-center justify-center gap-2.5"><span style={{ fontWeight: 900, fontSize: 18 }}>הניחושים נקלטו בהצלחה</span><Tick /></div>
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.45, ease }} style={{ marginTop: 16, padding: "12px 14px", borderRadius: 16, background: "rgba(250,204,21,.06)", border: "1px solid rgba(250,204,21,.25)" }}>
      <div className="text-center" style={{ fontWeight: 900, fontSize: 14.5, color: "#fde68a" }}>תחזית הניקוד שלך למחזור</div>
      <div className="text-center" style={{ marginTop: 6 }}>
        <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6, textShadow: done ? `0 0 24px ${GOLD}88` : "none", transition: "text-shadow .4s" }}>
          <span dir="ltr" style={{ fontFamily: NUM, fontWeight: 800, fontSize: 54, color: GOLD, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(v)}</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: "rgba(255,255,255,.7)" }}>נק׳</span></span>
      </div>
      <div dir="ltr" className="relative" style={{ height: 40, marginTop: 6 }}>
        <div className="absolute inset-x-0" style={{ top: 16, height: 8, borderRadius: 4, background: "rgba(255,255,255,.08)" }} />
        <motion.div className="absolute" style={{ top: 13, height: 14, left: `${PX(f.lo)}%`, width: `${PX(f.hi) - PX(f.lo)}%`, borderRadius: 7, background: "linear-gradient(90deg,rgba(250,204,21,.2),rgba(250,204,21,.5),rgba(250,204,21,.2))", border: "1px solid rgba(250,204,21,.6)", transformOrigin: "center" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.5 }} />
        <motion.div className="absolute" style={{ top: 4, left, translateX: "-50%" }}><div style={{ width: 4, height: 32, borderRadius: 2, background: "#fff", boxShadow: `0 0 12px ${done ? GOLD : "#fff"}` }} /></motion.div>
        <span className="absolute" style={{ top: 30, left: `${PX(f.lo)}%`, translateX: "-50%", fontFamily: NUM, fontSize: 11, color: "rgba(255,255,255,.55)" }}>{f.lo}</span>
        <span className="absolute" style={{ top: 30, left: `${PX(f.hi)}%`, translateX: "-50%", fontFamily: NUM, fontSize: 11, color: "rgba(255,255,255,.55)" }}>{f.hi}</span>
      </div>
      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.1 }} style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,.7)", marginTop: 6 }}>
        הטווח הצפוי: <span dir="ltr" style={{ fontFamily: NUM, color: "#fff", fontSize: 15 }}>{f.lo}–{f.hi}</span></motion.div>
      <Explain d={3.3}>{TEXT.fc}</Explain>
    </motion.div>
    <Squares f={f} d={3.2} />
    <CloseBtn onClose={onClose} d={4.2} />
  </Shell>;
}

// ── after the round ──
function Liquid({ pct, color = WATER, delay = 0.6, dur = 2.6, style, children }) {
  return <div className="relative overflow-hidden" style={{ borderRadius: 18, background: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.13)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 24px rgba(0,0,0,0.3)", ...style }}>
    <motion.div className="absolute inset-x-0 bottom-0" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay, duration: dur, ease: [0.33, 1, 0.68, 1] }}
      style={{ height: `${Math.max(Math.min(pct, 100), 3)}%`, transformOrigin: "bottom", background: `linear-gradient(180deg, ${color}66, ${color}bb)` }}>
      <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute left-0" style={{ top: -9, height: 10, width: "200%", animation: "fc-wave 4.5s linear infinite" }}>
        <path d="M0 6 Q25 0 50 6 T100 6 T150 6 T200 6 V12 H0Z" fill={`${color}66`} /></svg>
    </motion.div>
    <div className="relative h-full">{children}</div>
  </div>;
}
function Stats({ fc, act }) {
  const max = Math.max(1, ...CAT_NAMES.map(([k]) => Math.max(fc[k] || 0, act[k] || 0)));
  const NW = 46;
  return <div className="grid gap-2.5">{CAT_NAMES.map(([k, name], i) => { const e = fc[k] || 0, a = act[k] || 0, up = a >= e; return <div key={k}>
    <div className="text-center" style={{ fontSize: 12.5, fontWeight: 800 }}>{name}</div>
    <div dir="ltr" className="flex items-center gap-1.5" style={{ marginTop: 3 }}>
      <span style={{ width: NW, textAlign: "center", fontFamily: NUM, fontSize: 14, color: GOLD }}>{e.toFixed(1)}</span>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}><motion.div style={{ height: 10, borderRadius: "5px 0 0 5px", background: GOLD }} initial={{ width: 0 }} animate={{ width: `${(e / max) * 100}%` }} transition={{ delay: 0.1 + i * 0.12, duration: 0.7, ease }} /></div>
      <div style={{ width: 2, height: 16, background: "rgba(255,255,255,.4)" }} />
      <div style={{ flex: 1 }}><motion.div style={{ height: 10, borderRadius: "0 5px 5px 0", background: up ? GREEN : RED }} initial={{ width: 0 }} animate={{ width: `${(a / max) * 100}%` }} transition={{ delay: 0.3 + i * 0.12, duration: 0.7, ease }} /></div>
      <span style={{ width: NW, textAlign: "center", fontFamily: NUM, fontSize: 14, color: up ? GREEN : RED }}>{a.toFixed(1)}</span>
    </div></div>; })}
    <div dir="ltr" className="flex justify-between gap-1.5" style={{ fontSize: 11.5, fontWeight: 800, borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 6 }}>
      <span style={{ width: NW, textAlign: "center", color: GOLD }}>תחזית</span><span style={{ width: NW, textAlign: "center" }}>בפועל</span></div>
  </div>;
}
// round against round: a pair of bars per finished round (forecast gold, actual green/red), this round lit
function History({ hist, roundId, d = 0.5 }) {
  const top = Math.max(1, ...hist.flatMap((h) => [h.fc, h.actual])), H = 70;
  const beat = hist.filter((h) => h.actual >= h.fc).length;
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d }}
    style={{ marginTop: 12, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)' }}>
    <div className="text-center" style={{ fontSize: 12.5, fontWeight: 800, color: '#bfdbfe' }}>מחזור מול מחזור</div>
    <div className="flex justify-around items-end" style={{ height: H + 40, marginTop: 6 }}>
      {hist.map((h, i) => { const me = h.round_id === roundId, up = h.actual >= h.fc; return <div key={h.round_id} className="flex flex-col items-center" style={{ opacity: me ? 1 : 0.75 }}>
        <div dir="ltr" className="flex items-end gap-[2px]" style={{ height: H + 16 }}>
          {[[h.fc, GOLD, 0], [h.actual, up ? GREEN : RED, 0.1]].map(([val, c, dd], j) => <div key={j} className="flex flex-col items-center" style={{ width: 22 }}>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 0.5 + i * 0.1 }} dir="ltr" style={{ fontFamily: NUM, fontSize: 11.5, color: c, lineHeight: 1, marginBottom: 2 }}>{Math.round(val)}</motion.span>
            <motion.div style={{ width: 13, borderRadius: '3px 3px 1px 1px', background: c }} initial={{ height: 0 }} animate={{ height: Math.max(2, (val / top) * H) }} transition={{ delay: d + 0.1 + dd + i * 0.1, duration: 0.6, ease }} /></div>)}
        </div>
        <div style={{ marginTop: 4, fontSize: 10.5, fontWeight: 800, padding: '1px 6px', borderRadius: 6, background: me ? 'rgba(147,197,253,.22)' : 'transparent', color: me ? '#fff' : 'rgba(255,255,255,.6)' }}>מחזור {h.order}</div>
      </div>; })}
    </div>
    <div className="text-center" style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.75)', marginTop: 6 }}>עקפת את התחזית ב־<b dir="ltr" style={{ color: '#fff' }}>{beat}</b> מתוך <b dir="ltr" style={{ color: '#fff' }}>{hist.length}</b> מחזורים</div>
  </motion.div>;
}

export function ForecastResult({ r, roundNo, hist = [], roundId, onClose }) {
  const [open, setOpen] = React.useState(false);
  const fc = Number(r.forecast.fc), act = r.actual, FCR = Math.round(fc);
  const pct = fc > 0 ? Math.round((act / fc) * 100) : 0;
  const d = act - fc, beat = d >= 0;
  const v = d >= 0 ? { t: `עקפת את התחזית ב־${Math.round(d)} נק׳ 🔥`, c: GREEN } : { t: `נשארת ${Math.round(-d)} נק׳ מתחת לתחזית`, c: RED };
  return <Shell onClose={onClose}>
    <div className="text-center"><div style={{ fontSize: 12, fontWeight: 800, color: "#93c5fd" }}>סיכום המחזור{roundNo ? ` · מחזור ${roundNo}` : ""}</div><div style={{ fontWeight: 900, fontSize: 19, marginTop: 2 }}>הניקוד שלך בפועל מול התחזית</div></div>
    <div dir="ltr" className="flex gap-3 justify-center" style={{ marginTop: 14 }}>
      <Liquid pct={100} color={GOLD} delay={0.2} dur={0.01} style={{ width: 130, height: 150 }}>
        <div className="h-full flex flex-col items-center justify-center"><span style={{ fontFamily: NUM, fontWeight: 800, fontSize: 40, textShadow: "0 2px 8px rgba(0,0,0,.4)" }}>{FCR}</span><span style={{ fontSize: 12, fontWeight: 800 }}>תחזית</span></div></Liquid>
      {/* beating the forecast: the water turns green, fills to the brim, and a burst goes off as it lands */}
      <div className="relative">
        <Liquid pct={pct} color={beat ? GREEN : WATER} delay={0.6} style={{ width: 130, height: 150, boxShadow: `0 0 0 1px ${beat ? GREEN : WATER}99, 0 0 22px -2px ${beat ? GREEN : WATER}88` }}>
          <div className="h-full flex flex-col items-center justify-center"><Count to={act} delay={0.6} dur={2.4} style={{ fontSize: 40, textShadow: "0 2px 8px rgba(0,0,0,.4)" }} /><span style={{ fontSize: 12, fontWeight: 800 }}>בפועל · <span dir="ltr">{pct}%</span></span></div></Liquid>
        {beat && <>
          {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <motion.span key={i} className="absolute pointer-events-none" style={{ left: 63, top: 6, width: 6, height: 6, borderRadius: 3, background: [GREEN, GOLD, "#fff"][i % 3] }}
            initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: Math.cos(a) * 70, y: Math.sin(a) * 50 - 10, opacity: [0, 1, 0] }} transition={{ delay: 3, duration: 1 }} />; })}
          <motion.span className="absolute grid place-items-center" style={{ right: -10, top: -12, height: 26, padding: "0 9px", borderRadius: 13, background: GREEN, color: "#052e16", fontFamily: NUM, fontWeight: 800, fontSize: 15, boxShadow: "0 4px 12px rgba(0,0,0,.45)" }}
            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 3.1, type: "spring", stiffness: 400, damping: 11 }}><span dir="ltr">+{Math.round(d)}</span></motion.span>
        </>}
      </div>
    </div>
    <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3, type: "spring" }} style={{ marginTop: 12, fontWeight: 900, fontSize: 15, color: v.c }}>{v.t}</motion.div>
    <motion.button type="button" onClick={() => setOpen((o) => !o)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}
      className="w-full flex items-center justify-center gap-2" style={{ marginTop: 12, height: 40, borderRadius: 12, fontWeight: 800, fontSize: 13.5, background: open ? "rgba(147,197,253,.18)" : "rgba(255,255,255,.07)", border: "1px solid rgba(147,197,253,.35)", color: "#bfdbfe" }}>
      📊 סטטיסטיקה <motion.span animate={{ rotate: open ? 180 : 0 }} style={{ display: "inline-block" }}>▾</motion.span></motion.button>
    <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
      <div style={{ paddingTop: 12 }}><Stats fc={r.forecast.cats || {}} act={r.actCats} />{hist.length >= 2 && <History hist={hist} roundId={roundId} />}</div></motion.div>}</AnimatePresence>
    <CloseBtn onClose={onClose} d={3.4} />
  </Shell>;
}

// On the home screen: the last round that has ended and has a stored forecast, shown once
const SEEN = (id) => `fc_result_seen_${id}`;
export function ForecastResultGate({ user, rounds }) {
  const [res, setRes] = React.useState(null);
  React.useEffect(() => {
    if (!user?.id || !rounds?.length) return undefined;
    let alive = true;
    (async () => {
      const { data } = await supabase.from("round_forecasts").select("round_id,backfill").eq("user_id", user.id);
      // only forecasts made when the predictions were sent (backfilled rounds feed the history only)
      const have = new Set((data || []).filter((x) => !x.backfill).map((x) => x.round_id));
      const replay = new URLSearchParams(window.location.search).get("fcresult");
      const cand = [...rounds].sort((a, b) => (b.order || 0) - (a.order || 0)).filter((r) => have.has(r.id) && (replay || !localStorage.getItem(SEEN(r.id))));
      for (const round of cand) {
        const r = await forecastResult(user.id, round.id);
        if (r?.done) {
          const hist = await forecastHistory(user.id).catch(() => []);
          // after any tour on the screen (the notifications tour opens on the home screen too)
          const show = () => { if (!alive) return; if (document.querySelector('[data-tour-overlay],[data-fc-wait]')) setTimeout(show, 1000); else setRes({ r, round, hist }); };
          setTimeout(show, 1500); return;
        }
      }
    })().catch(() => {});
    return () => { alive = false; };
  }, [user?.id, rounds?.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const close = () => { try { localStorage.setItem(SEEN(res.round.id), "1"); } catch {} setRes(null); };
  return <AnimatePresence>{res && <ForecastResult key="fcr" r={res.r} roundNo={res.round.order} hist={res.hist} roundId={res.round.id} onClose={close} />}</AnimatePresence>;
}
