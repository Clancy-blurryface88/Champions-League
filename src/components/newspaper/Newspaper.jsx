import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// "מבט לאלופות" (22.11.2026) — one issue, drawn from its facts (computed on the server) and texts (written by
// Claude). Like a real paper: pages to turn, each exactly one screen tall (no scrolling, no tap-to-expand);
// a page that's a bit long on a short phone shrinks to fit. A match with a story gets its matrix (players ×
// the score after each goal) and its live blog together on one page.

export const NAME = "מבט לאלופות";
const INK = "#1a1410", RED = "#b3261e", GREEN = "#166534", PAPER = "#f3ecdc";
const FR = "'Frank Ruhl Libre', serif", NUMF = "var(--num-font)";
const paperBg = `radial-gradient(130% 90% at 30% 10%, #faf5e8, ${PAPER} 60%, #e6dcc6)`;
export function useNewspaperFonts() {
  React.useEffect(() => {
    if (document.getElementById("np-fonts")) return;
    const l = document.createElement("link"); l.id = "np-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;700;900&display=swap";
    document.head.appendChild(l);
  }, []);
}

const N = ({ children, s = 13, c, w = 800 }) => <span dir="ltr" style={{ fontFamily: NUMF, fontWeight: w, fontSize: s, color: c, whiteSpace: "nowrap" }}>{children}</span>;
const Crest = ({ src, s = 20, gray = true }) => (src ? <img src={src} alt="" style={{ width: s, height: s, objectFit: "contain", filter: gray ? "grayscale(1) contrast(1.15)" : "none", mixBlendMode: gray ? "multiply" : "normal" }} /> : null);
// a match as crest · score · crest, always home on the left
const Score = ({ m, cs = 20, ns = 15, c = INK }) => (m ? <span dir="ltr" className="inline-flex items-center gap-1.5"><Crest src={m.a.logo} s={cs} /><N s={ns} c={c}>{m.score}</N><Crest src={m.b.logo} s={cs} /></span> : null);
const Rule = ({ thick, m = 6 }) => <div style={{ borderTop: `${thick ? 3 : 1}px solid ${INK}`, borderBottom: thick ? `1px solid ${INK}` : "none", height: thick ? 4 : 0, margin: `${m}px 0` }} />;
const VLine = () => <div style={{ background: INK, opacity: 0.45 }} />;
const H = ({ children, s = 18, style }) => <div style={{ fontFamily: FR, fontWeight: 900, fontSize: s, lineHeight: 1.12, ...style }}>{children}</div>;
const P = ({ children, style }) => <p style={{ fontFamily: FR, fontSize: 13, lineHeight: 1.55, textAlign: "justify", margin: 0, ...style }}>{children}</p>;
const Kick = ({ children, c = RED }) => <div style={{ fontFamily: FR, fontSize: 10.5, fontWeight: 900, color: c }}>{children}</div>;
const Box = ({ children, style }) => <div style={{ border: `1px solid ${INK}`, padding: 8, ...style }}>{children}</div>;
// a round ink stamp (the user's pick, 22.11): red "מנצח הערב" with the date, green "פגיעה מדויקת" on each hit
const Stamp = ({ children, s = 86, c = RED, r = -12 }) => <div className="grid place-items-center" style={{ width: s, height: s, borderRadius: "50%", border: `3px solid ${c}`, boxShadow: `inset 0 0 0 4px ${PAPER}, inset 0 0 0 6px ${c}`, color: c, transform: `rotate(${r}deg)`, textAlign: "center", flexShrink: 0, fontFamily: FR, fontWeight: 900, lineHeight: 1.05 }}>{children}</div>;
const Foot = ({ children }) => <div style={{ marginTop: "auto" }}><Rule /><div style={{ fontFamily: FR, fontSize: 10.5, fontWeight: 700, textAlign: "left" }}>{children}</div></div>;
// the front page's "photo" (the user's pick, 22.11): a match ticket — the teams and the score, and on a torn stub the
// goal that decided it (the last goal: its minute and scorer); a goalless match says so
const Ticket = ({ m, dm, he, cap }) => { const g = m.goals?.[m.goals.length - 1];
  return <div><div className="flex" style={{ border: `2px solid ${INK}`, background: "#efe5cf" }}>
    <div style={{ flex: 1, padding: "7px 12px" }}><div style={{ fontFamily: FR, fontSize: 10, fontWeight: 900, color: RED, letterSpacing: ".1em" }}>כרטיס · ליגת האלופות · {dm}</div>
      <div className="flex items-center justify-between" dir="ltr" style={{ margin: "3px 0" }}><Crest src={m.a.logo} s={36} /><N s={30} w={900}>{m.score}</N><Crest src={m.b.logo} s={36} /></div>
      <div style={{ fontFamily: FR, fontSize: 12, fontWeight: 700, textAlign: "center" }}>{m.a.he} – {m.b.he}</div></div>
    <div className="flex flex-col items-center justify-center" style={{ width: 70, borderInlineStart: `2px dashed ${INK}`, padding: 6, textAlign: "center" }}>
      {g ? <><div style={{ fontFamily: FR, fontSize: 9 }}>השער המכריע</div><N s={22} c={RED}>{g.minute}'</N><div style={{ fontFamily: FR, fontSize: 9.5, fontWeight: 900 }}>{he?.[g.scorer] || g.scorer}</div></> : <div style={{ fontFamily: FR, fontSize: 11, fontWeight: 900 }}>בלי שערים</div>}</div></div>
    {cap && <div style={{ fontFamily: FR, fontSize: 10.5, fontStyle: "italic", lineHeight: 1.35, marginTop: 4 }}>{cap}</div>}</div>; };
const Halftone = ({ m, h = 112, cap }) => <div className="relative" style={{ height: h, border: `1px solid ${INK}`, overflow: "hidden", background: `radial-gradient(circle at 1px 1px, rgba(26,20,16,.33) 1px, transparent 1.4px) 0 0/5px 5px, linear-gradient(135deg,#d8ccb2,#b9ab8e)` }}>
  <div className="absolute inset-0 grid place-items-center"><Score m={m} cs={54} ns={42} /></div>
  {cap && <div className="absolute" style={{ bottom: 0, insetInline: 0, padding: "2px 6px", background: "rgba(243,236,220,.92)", fontFamily: FR, fontSize: 10, fontStyle: "italic", color: INK }}>{cap}</div>}</div>;

// one page = one screen; taller content is scaled down to fit
function Page({ h, children }) {
  const inner = React.useRef(null);
  const [k, setK] = React.useState(1);
  React.useLayoutEffect(() => {
    const el = inner.current; if (!el) return;
    // transform doesn't change layout, so scrollHeight is the content's natural height at any scale
    const fit = () => { const need = el.scrollHeight; setK(need > h ? h / need : 1); };
    fit(); const t = setTimeout(fit, 700); return () => clearTimeout(t);
  }, [h]);
  return <div dir="rtl" style={{ height: h, overflow: "hidden", position: "relative", background: paperBg, color: INK, boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 0 60px rgba(120,90,40,.16)" }}>
    <div ref={inner} className="flex flex-col" style={{ position: "absolute", top: 0, right: 0, width: `${100 / k}%`, minHeight: h / k, padding: "12px 12px 10px", transform: `scale(${k})`, transformOrigin: "top right" }}>{children}</div></div>;
}
// pages that turn on their spine (button or swipe)
function Pages({ pages }) {
  const [i, setI] = React.useState(0), [dir, setDir] = React.useState(1);
  const go = (d) => { const j = i + d; if (j < 0 || j >= pages.length) return; setDir(d); setI(j); };
  return <div style={{ perspective: 1400 }}>
    <AnimatePresence mode="wait" custom={dir}>
      <motion.div key={i} custom={dir} variants={{ in: (d) => ({ rotateY: d > 0 ? -95 : 95, opacity: 0.4 }), on: { rotateY: 0, opacity: 1 }, out: (d) => ({ rotateY: d > 0 ? 95 : -95, opacity: 0.4 }) }} initial="in" animate="on" exit="out" transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15} onDragEnd={(e, inf) => { if (inf.offset.x > 60) go(1); if (inf.offset.x < -60) go(-1); }}
        style={{ transformOrigin: dir > 0 ? "right center" : "left center", touchAction: "pan-y" }}>{pages[i]}</motion.div></AnimatePresence>
    <div className="flex items-center justify-between" style={{ marginTop: 8, fontFamily: FR, color: "#fff", fontSize: 12.5, fontWeight: 700 }}>
      <button type="button" onClick={() => go(-1)} style={{ opacity: i ? 1 : 0.3, padding: "6px 10px", borderRadius: 10, background: "rgba(255,255,255,.1)" }}>→ הקודם</button>
      <span style={{ opacity: 0.75 }}>עמוד {i + 1} מתוך {pages.length}</span>
      <button type="button" onClick={() => go(1)} style={{ opacity: i < pages.length - 1 ? 1 : 0.3, padding: "6px 10px", borderRadius: 10, background: RED, color: "#fff" }}>לעמוד הבא ←</button></div></div>;
}

// the matrix: players down, the score after each goal across; orange = the score was their pick then, green = still at the whistle
function Matrix({ m }) {
  const last = m.states.length - 1;
  const order = [...m.picks].sort((a, b) => { const ia = m.states.findIndex((s) => s.score === a.pick), ib = m.states.findIndex((s) => s.score === b.pick); return (ib < 0 ? -1 : ib) - (ia < 0 ? -1 : ia); });
  return <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: FR, fontSize: 11, margin: "4px 0" }}>
    <thead><tr><th style={{ textAlign: "right", padding: 3 }}>ניחש</th>{m.states.map((s, i) => <th key={i} style={{ padding: "2px 1px", fontWeight: 900 }}><N s={11}>{s.score}</N><div style={{ fontSize: 9, fontWeight: 400 }}>{s.minute ? `${s.minute}'` : "פתיחה"}</div></th>)}</tr></thead>
    <tbody>{order.map((p) => <tr key={p.name} style={{ borderTop: `1px dotted ${INK}55` }}><td style={{ padding: 3, fontWeight: 700, whiteSpace: "nowrap" }}>{p.name} <N s={10.5}>{p.pick}</N></td>
      {m.states.map((s, i) => <td key={i} style={{ padding: 2 }}><div style={{ height: 15, background: s.score === p.pick ? (i === last ? GREEN : "#d97706") : `${INK}10` }} /></td>)}</tr>)}</tbody></table>;
}
const MatrixNote = () => <div style={{ fontFamily: FR, fontSize: 10.5, fontStyle: "italic", marginBottom: 4 }}>כתום = באותו רגע התוצאה על המגרש הייתה הניחוש שלו. ירוק = פגיעה מדויקת בסיום.</div>;
// a sentence per goal: Claude's, or one made from the facts
const autoLine = (g, he) => `${he?.[g.scorer] || g.scorer || "שער"} — ${g.score}.${g.took.length ? ` הפגיעה של ${g.took.join(", ")} נעלמה${g.held ? ` אחרי ${g.held} דקות` : ""}.` : ""}${g.gave.length ? ` פגיעה מדויקת ל${g.gave.join(", ")}.` : ""}`;
const Blog = ({ m, text, he }) => <div className="grid gap-1.5" style={{ marginTop: 4 }}>{m.goals.map((g, i) => <div key={i} className="flex gap-2" style={{ fontFamily: FR, fontSize: 12.6, lineHeight: 1.45 }}>
  <span style={{ background: INK, color: PAPER, padding: "0 5px", height: 19, flexShrink: 0 }}><N s={12}>{g.minute}'</N></span><span>{text?.blog?.find((b) => Number(b.minute) === g.minute)?.text || autoLine(g, he)}</span></div>)}</div>;
const Worth = ({ rows }) => <div style={{ border: `1px solid ${INK}` }}><div className="grid" style={{ gridTemplateColumns: "1fr 44px 70px 50px", padding: "4px 6px", fontFamily: FR, fontSize: 10.5, fontWeight: 900, background: `${INK}10` }}><span>מי</span><span className="text-center">ניחש</span><span className="text-center">ניקוד אפשרי</span><span className="text-center">ניקוד בפועל</span></div>
  {rows.map((r, i) => <div key={i} className="grid items-center" style={{ gridTemplateColumns: "1fr 44px 70px 50px", padding: "4px 6px", borderTop: `1px dotted ${INK}55`, fontFamily: FR, fontSize: 12.5 }}><span style={{ fontWeight: 700 }}>{r.names}</span><span className="text-center"><N s={12.5}>{r.score}</N></span><span className="text-center"><N s={12.5} c={GREEN}>{r.worth.toFixed(2)}</N></span><span className="text-center"><N s={12.5} c={RED}>{r.got}</N></span></div>)}</div>;
const worthRows = (m) => m.holds.filter((h) => !h.survived).map((h) => { const gots = [...new Set(h.got.map((g) => g.pts.toFixed(2)))]; return { names: h.names.join(", "), score: h.score, worth: h.worth, got: gots.join(" / ") }; });

// the weather box: an ink drawing for the kind of night
function WeatherIcon({ kind }) {
  const sun = (c, r = 8) => <g><circle cx="20" cy="20" r={r} fill="none" stroke={c} strokeWidth="2.4" />{[...Array(8)].map((_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={20 + (r + 4) * Math.cos(a)} y1={20 + (r + 4) * Math.sin(a)} x2={20 + (r + 9) * Math.cos(a)} y2={20 + (r + 9) * Math.sin(a)} stroke={c} strokeWidth="2.4" strokeLinecap="round" />; })}</g>;
  const cloud = <path d="M10 28 a7 7 0 0 1 3-13 a9 9 0 0 1 17 2 a6 6 0 0 1 1 11 z" fill={PAPER} stroke={INK} strokeWidth="2.2" />;
  return <svg viewBox="0 0 40 42" width="40" style={{ flexShrink: 0 }}>
    {kind === "heat" && sun(INK)}
    {kind === "partly" && <g transform="translate(6 -4) scale(.75)">{sun(INK)}</g>}
    {kind !== "heat" && cloud}
    {(kind === "showers" || kind === "storm") && [13, 20, 27].map((x) => <line key={x} x1={x} y1="32" x2={x - 3} y2="39" stroke={INK} strokeWidth="2" strokeLinecap="round" />)}
    {kind === "storm" && <path d="M22 29 l-4 6 h4 l-3 6" stroke={RED} strokeWidth="2.2" fill="none" />}</svg>;
}

export default function Newspaper({ issue, top = 100 }) {
  useNewspaperFonts();
  const f = issue.facts || {}, t = issue.texts || {};
  const [h, setH] = React.useState(() => Math.max(480, window.innerHeight - top - 84));
  React.useEffect(() => { const on = () => setH(Math.max(480, window.innerHeight - top - 84)); window.addEventListener("resize", on); return () => window.removeEventListener("resize", on); }, [top]);
  const M = Object.fromEntries((f.matches || []).map((m) => [m.id, m]));
  const isRound = f.kind === "round";
  const issueNo = (f.round?.no || 0) * 2 - ((f.nightsInRound || 2) - (f.nightNo || 1));
  const Mast = ({ page }) => <><div className="flex justify-between" style={{ fontFamily: FR, fontSize: 10, fontWeight: 700 }}><span>{page}</span><span>{NAME}</span><span>{f.round?.name?.replace(/League Phase\s*-\s*/i, "מחזור ")} · {f.dm}</span></div><Rule thick /></>;
  const winner = f.nightRank?.[0], second = f.nightRank?.[1];
  const pages = []; // each: (page number) => <Page>

  // 1 — the front
  pages.push((no) => <Page h={h}><div className="flex justify-between" style={{ fontFamily: FR, fontSize: 10, fontWeight: 700 }}><span>גיליון {issueNo}</span><span>{f.day ? `בוקר שאחרי ערב ${f.day}` : ""} · {f.dm}</span><span>מחיר: ניחוש אחד</span></div><Rule thick />
    {/* the masthead with two "ears", like a real front page: the weather on the right, the small ad on the left */}
    <div className="grid items-center" style={{ gridTemplateColumns: "76px 1fr 76px", gap: 6 }}>
      <div className="flex flex-col items-center text-center" style={{ border: `1px solid ${INK}`, padding: "3px 2px" }}><div style={{ transform: "scale(.7)", margin: "-6px 0 -8px" }}><WeatherIcon kind={f.weather} /></div><div style={{ fontFamily: FR, fontSize: 9, fontWeight: 900, lineHeight: 1.15 }}>{t.weather?.title}</div></div>
      <div className="text-center"><div style={{ fontFamily: FR, fontSize: 30, fontWeight: 900, lineHeight: 1 }}>{NAME}</div><div style={{ fontFamily: FR, fontSize: 9.5, fontStyle: "italic", opacity: 0.75, marginTop: 2 }}>העיתון היחיד שקורא את הניחושים שלכם</div></div>
      {t.rent ? <div style={{ background: "#fff6c8", border: `1px solid ${INK}`, transform: "rotate(2deg)", padding: "3px 4px" }}><div style={{ fontFamily: FR, fontWeight: 900, fontSize: 10.5 }}>{t.rent.head}</div><div style={{ fontFamily: FR, fontSize: 8.5, lineHeight: 1.2 }}>{t.rent.body}</div></div> : <div />}</div><Rule thick />
    {/* the headline takes the whole width; its size follows its length so it fills the line */}
    <Kick>{t.kicker}</Kick><div style={{ fontFamily: FR, fontSize: (t.headline || "").length <= 9 ? 60 : (t.headline || "").length <= 14 ? 48 : 36, fontWeight: 900, lineHeight: 0.95 }}>{t.headline}</div>
    <div style={{ fontFamily: FR, fontWeight: 700, fontSize: 14.5, lineHeight: 1.35, margin: "6px 0 8px" }}>{t.subhead}</div>
    {M[t.photoMatch] && <Ticket m={M[t.photoMatch]} dm={f.dm} he={t.scorers} />}
    <P style={{ marginTop: 8 }}>{t.lead}</P>
    <Rule />{winner && <div className="flex items-center gap-3" style={{ border: `1px solid ${INK}`, padding: 8 }}>
      <motion.div initial={{ scale: 2.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.3, type: "spring", stiffness: 300, damping: 14 }}><Stamp s={74}><span style={{ fontSize: 9.5 }}>מנצח<br />הערב</span><N s={12} c={RED}>{f.dm}</N></Stamp></motion.div>
      <div><div style={{ fontFamily: FR, fontWeight: 900, fontSize: 24, lineHeight: 1 }}>{winner.name}</div><N s={17}>{winner.pts.toFixed(2)}</N>
        {second && <div style={{ fontFamily: FR, fontSize: 11, opacity: 0.85 }}>במקום השני: {second.name} ({second.pts.toFixed(2)})</div>}</div></div>}
    <Foot>המשך הכתבה בעמוד {no + 1} ←</Foot></Page>);

  // 2 — the lead story goes on: the exact hits of the night, the goals that made them
  pages.push((no) => <Page h={h}><Mast page={`${no} · הכתבה הראשית`} /><Kick>המשך מעמוד 1</Kick>
    {(t.leadMore || []).map((p, i) => <P key={i} style={{ marginTop: i ? 6 : 2 }}>{p}</P>)}
    <Rule /><P style={{ marginBottom: 6 }}>{t.leadHitsIntro}</P>
    {f.exact?.length ? <div className="grid gap-2">{f.exact.map((e, i) => <div key={i} className="flex items-center gap-3" style={{ borderBottom: `1px dotted ${INK}66`, paddingBottom: 6 }}>
      <Stamp s={46} c={GREEN} r={-10}><span style={{ fontSize: 8.5 }}>פגיעה<br />מדויקת</span></Stamp>
      <div style={{ flex: 1 }}><b style={{ fontFamily: FR, fontSize: 15 }}>{e.name}</b><div><Score m={M[e.match]} cs={16} ns={13} /></div></div><N s={16} c={GREEN}>+{e.pts.toFixed(2)}</N></div>)}</div>
      : <P style={{ fontWeight: 700 }}>אף משתתף לא פגע בתוצאה מדויקת הערב.</P>}
    {f.exactGoals?.length > 0 && <><Rule /><Kick c={INK}>השערים שהעניקו פגיעה מדויקת עד הסוף</Kick>
      <div className="grid gap-2" style={{ marginTop: 4 }}>{f.exactGoals.map((g, i) => <div key={i} className="flex items-start gap-2" style={{ fontFamily: FR, fontSize: 12.8 }}><N s={15} c={RED}>{g.minute}'</N><div style={{ flex: 1 }}><b>{t.scorers?.[g.scorer] || g.scorer}</b> · <span style={{ display: "inline-block", verticalAlign: "middle" }}><Score m={M[g.match]} cs={14} ns={11} /></span> — פגיעה מדויקת ל{g.names.join(" ול")}</div>{g.pts != null && <N s={13} c={GREEN}>+{g.pts.toFixed(2)}</N>}</div>)}</div></>}
    <Foot>בעמוד {no + 1}: {t.dramaTitle || "הפגיעות שנעלמו בדרך"} ←</Foot></Page>);

  // 3 — the hits on the way, match by match
  const born = (f.matches || []).filter((m) => m.born > 0).sort((a, b) => b.born - a.born);
  if (born.length) pages.push((no) => <Page h={h}><Mast page={`${no} · הדרמה`} /><Kick>מתוך משחקי הלייב</Kick><H s={24}>{t.dramaTitle}</H>
    <P style={{ margin: "4px 0 8px" }}>{t.dramaIntro}</P>
    <div style={{ border: `1px solid ${INK}` }}><div className="grid" style={{ gridTemplateColumns: "1fr 74px 74px", padding: "4px 6px", fontFamily: FR, fontSize: 10.5, fontWeight: 900, background: `${INK}10` }}><span>המשחק</span><span className="text-center">פגעו במהלך המשחק</span><span className="text-center">פגיעה מדויקת בסיום</span></div>
      {born.map((m) => <div key={m.id} className="grid items-center" style={{ gridTemplateColumns: "1fr 74px 74px", padding: "3px 6px", borderTop: `1px dotted ${INK}55` }}><span><Score m={m} cs={17} ns={12.5} /></span><span className="text-center"><N s={13}>{m.born}</N></span><span className="text-center"><N s={13} c={m.survived ? GREEN : RED}>{m.survived}</N></span></div>)}</div>
    <Foot>{f.dramas?.length ? `בעמוד ${no + 1}: ${t.matches?.[0]?.title || "המשחק הדרמטי"} ←` : `בעמוד ${no + 1} ←`}</Foot></Page>);

  // a page per dramatic match: the matrix and the live blog together
  (f.dramas || []).forEach((id, di) => { const m = M[id]; const tx = (t.matches || []).find((x) => x.id === id) || t.matches?.[di];
    if (m) pages.push((no) => <Page h={h}><Mast page={`${no} · הדרמה`} /><Kick>{tx?.kicker}</Kick><H>{tx?.title}</H>
      <div style={{ margin: "4px 0" }}><Score m={m} cs={22} ns={16} /></div><Matrix m={m} /><MatrixNote /><Blog m={m} text={tx} he={t.scorers} />
      {tx?.closing && <P style={{ marginTop: 6, fontWeight: 700 }}>{tx.closing}</P>}
      <Foot>בעמוד {no + 1} ←</Foot></Page>); });
  // what the vanished hits would have been worth
  if (f.dramas?.length) pages.push((no) => <Page h={h}><Mast page={`${no} · הדרמה`} /><H s={20}>מה זה עלה להם</H>
    {f.dramas.map((id, di) => { const m = M[id]; const tx = (t.matches || []).find((x) => x.id === id) || t.matches?.[di]; return m ? <div key={id} style={{ marginTop: 8 }}><div className="flex items-center gap-2" style={{ marginBottom: 4 }}><Score m={m} cs={18} ns={13} /><b style={{ fontFamily: FR, fontSize: 13 }}>{tx?.title}</b></div>
      {tx?.costIntro && <P style={{ fontSize: 12.5, marginBottom: 4 }}>{tx.costIntro}</P>}<Worth rows={worthRows(m)} /></div> : null; })}
    <div style={{ fontFamily: FR, fontSize: 10.5, fontStyle: "italic", marginTop: 4 }}>"ניקוד אפשרי" = הנקודות שכל אחד היה מקבל אם המשחק היה נגמר בתוצאה שלו.</div>
    <Foot>בעמוד {no + 1}: עוד מהמגרשים ←</Foot></Page>);

  // the biggest score, the most turnarounds, the wisdom of the crowd
  pages.push((no) => <Page h={h}><Mast page={`${no} · עוד מהמגרשים`} />
    <div className="grid" style={{ gridTemplateColumns: "1fr 1px 1fr", gap: 10 }}>
      <div><Kick>התוצאה הגדולה</Kick><H s={15.5}>{t.bigScore?.title}</H><div style={{ margin: "4px 0" }}><Score m={M[f.biggest]} cs={18} ns={13} /></div><P style={{ fontSize: 12.3 }}>{t.bigScore?.text}</P></div><VLine />
      <div><Kick>הכי הרבה מהפכים</Kick><H s={15.5}>{t.flips?.title}</H><div style={{ margin: "4px 0" }}><Score m={M[f.flips]} cs={18} ns={13} /></div><P style={{ fontSize: 12.3 }}>{t.flips?.text}</P></div></div>
    <Rule /><Kick>ניתוח</Kick><H s={17}>חוכמת ההמונים</H><P style={{ marginTop: 3 }}>{t.crowd?.lead}</P><P style={{ marginTop: 6 }}>{t.crowd?.more}</P>
    <Foot>בעמוד {no + 1}: {isRound ? "המחזור" : "הערב"} במספרים ←</Foot></Page>);

  // the group as forecasters (the round issue): what the group predicted against what happened, the season beside it
  const gp = f.groupProfile;
  if (isRound && gp) pages.push((no) => { const R = gp.round, S = gp.season, pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
    const w = (x) => Math.round(x), g2 = (x) => Math.round(x * 10) / 10;
    const rows = [["תיקו", w(R.group.D), pct(R.real.D, R.n), w(S.group.D), "%"], ["ניצחון בית", w(R.group.H), pct(R.real.H, R.n), w(S.group.H), "%"], ["ניצחון חוץ", w(R.group.A), pct(R.real.A, R.n), w(S.group.A), "%"], ["שתיהן כובשות", w(R.group.btts), pct(R.real.btts, R.n), w(S.group.btts), "%"], ["שערים למשחק", g2(R.group.goals), g2(R.real.goals), g2(S.group.goals), ""]];
    const st = gp.standouts;
    return <Page h={h}><Mast page={`${no} · הקבוצה`} /><Kick>הפרופיל של הקבוצה</Kick><H s={23}>{t.groupProfile?.title}</H><P style={{ margin: "4px 0 8px" }}>{t.groupProfile?.text}</P>
      <div style={{ border: `1px solid ${INK}` }}><div className="grid" style={{ gridTemplateColumns: "1fr 62px 62px 62px", padding: "4px 6px", fontFamily: FR, fontSize: 10, fontWeight: 900, background: `${INK}10` }}><span /><span className="text-center">ניחוש המשתתפים</span><span className="text-center">בפועל</span><span className="text-center">ניחשו העונה</span></div>
        {rows.map(([l, g, r, s, u]) => <div key={l} className="grid items-center" style={{ gridTemplateColumns: "1fr 62px 62px 62px", padding: "5px 6px", borderTop: `1px dotted ${INK}55`, fontFamily: FR, fontSize: 12.5 }}><b>{l}</b><span className="text-center"><N s={13}>{g}{u}</N></span><span className="text-center"><N s={13} c={RED}>{r}{u}</N></span><span className="text-center"><N s={13} c={`${INK}99`}>{s}{u}</N></span></div>)}</div>
      <Rule /><Kick c={INK}>מי בלט במחזור</Kick>
      <div className="grid grid-cols-2 gap-2" style={{ marginTop: 4 }}>{[["הכי אופטימי בשערים", st.mostGoals.name, `${st.mostGoals.goals} שערים למשחק בממוצע`], ["הכי זהיר", st.fewestGoals.name, `${st.fewestGoals.goals} שערים למשחק בממוצע`], ["מלך התיקו", st.mostDraws.name, `${st.mostDraws.draws} ניחושי תיקו`], ["המנחש המיוחד", st.mostUnique.name, `${st.mostUnique.unique} ניחושים שאף אחד אחר לא ניחש${st.mostUnique.hits ? `, ${st.mostUnique.hits} מהם פגעו` : ""}`]].map(([l, nm, d]) => <Box key={l} style={{ padding: 6 }}><Kick>{l}</Kick><H s={16}>{nm}</H><div style={{ fontFamily: FR, fontSize: 11 }}>{d}</div></Box>)}</div>
      <Foot>בעמוד {no + 1}: המחזור במספרים ←</Foot></Page>; });

  // the numbers, the table, forecast against reality (round) or the night's points (night)
  pages.push((no) => { const nums = [[String(f.exactCount ?? 0), `פגיעות מדויקות הערב (${f.dir?.of || 0} ניחושים)`], [String(f.dir?.n ?? 0), `ניחושים שצדקו בכיוון — ${f.dir?.of ? Math.round((f.dir.n / f.dir.of) * 100) : 0}%`], [String(f.bornTotal ?? 0), "פגיעות במהלך המשחקים"], [String(f.gapNow ?? 0), "נקודות בין המקום הראשון לשני בטבלה"], [String((f.withoutExact || []).length), "משתתפים בלי פגיעה מדויקת"], [M[f.biggest] ? String(M[f.biggest].goalsTotal) : "0", "שערים בתוצאה הגדולה של הערב"]];
    return <Page h={h}><Mast page={`${no} · מספרים`} /><H s={23}>{isRound ? "המחזור" : "הערב"} במספרים</H>
      <div className="grid grid-cols-3 gap-2" style={{ margin: "6px 0" }}>{nums.map(([v, l]) => <div key={l} className="text-center" style={{ borderTop: `3px solid ${INK}`, paddingTop: 3 }}><N s={21}>{v}</N><div style={{ fontFamily: FR, fontSize: 10.5, lineHeight: 1.2 }}>{l}</div></div>)}</div><Rule />
      <div className="grid" style={{ gridTemplateColumns: "1fr 1px 1fr", gap: 10 }}>
        <div style={{ fontFamily: FR }}><div style={{ fontSize: 11, fontWeight: 900 }}>הטבלה הכללית</div>
          <div style={{ border: `1px solid ${INK}`, marginTop: 3 }}>{(f.table || []).map((r, i) => <div key={r.name} className="flex items-center" style={{ padding: "3px 6px", borderTop: i ? `1px dotted ${INK}55` : "none", fontSize: 12.5, fontWeight: i ? 700 : 900, background: i ? "transparent" : `${RED}14` }}>
            <span style={{ width: 14 }}>{r.rank}</span><span style={{ flex: 1 }}>{r.name}</span><span style={{ width: 14, fontSize: 10, color: r.move > 0 ? GREEN : RED, opacity: r.move ? 1 : 0 }}>{r.move > 0 ? "▲" : "▼"}</span><N s={12}>{r.total.toFixed(1)}</N></div>)}</div></div><VLine />
        {isRound && f.forecast?.length ? <div style={{ fontFamily: FR }}><div style={{ fontSize: 11, fontWeight: 900 }}>תחזית מול מציאות</div>
          <div className="grid gap-1" style={{ marginTop: 4 }}>{f.forecast.map((x) => { const max = Math.max(...f.forecast.map((y) => Math.max(y.pts, y.fc))) * 1.05; return <div key={x.name}><div className="flex items-center justify-between" style={{ fontSize: 11, fontWeight: 700 }}><span>{x.name}</span><span dir="ltr"><N s={11} c={x.pts >= x.fc ? GREEN : INK}>{x.pts.toFixed(1)}</N><span style={{ opacity: 0.6 }}> / </span><N s={11} c={RED}>{x.fc.toFixed(1)}</N></span></div>
            <div dir="ltr" className="relative" style={{ height: 6, background: `${INK}1a` }}><div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(x.pts / max) * 100}%`, background: x.pts >= x.fc ? GREEN : `${INK}77` }} /><div style={{ position: "absolute", left: `${(x.fc / max) * 100}%`, top: -2, bottom: -2, width: 2, background: RED }} /></div></div>; })}</div>
          <div style={{ fontSize: 10, fontStyle: "italic", opacity: 0.8, marginTop: 3 }}>{t.forecastNote || "הראשון = מה שצבר, האדום = התחזית."}</div></div>
          : <div style={{ fontFamily: FR }}><div style={{ fontSize: 11, fontWeight: 900 }}>הנקודות של הערב</div>
            <div style={{ border: `1px solid ${INK}`, marginTop: 3 }}>{(f.nightRank || []).map((r, i) => <div key={r.name} className="flex items-center justify-between" style={{ padding: "3px 6px", borderTop: i ? `1px dotted ${INK}55` : "none", fontSize: 12.5, fontWeight: i ? 700 : 900 }}><span>{r.name}</span><N s={12}>{r.pts.toFixed(2)}</N></div>)}</div></div>}</div>
      <Foot>בעמוד {no + 1}: {f.tonight ? "מה מחכה הערב" : "לוח המודעות"} ←</Foot></Page>; });

  // tonight (a night that isn't the round's last)
  if (f.tonight) pages.push((no) => <Page h={h}><Mast page={`${no} · הערב`} /><Kick>הערב · {f.tonight.day}</Kick><H s={24}>{t.tonight?.title}</H><P style={{ margin: "4px 0 8px" }}>{t.tonight?.text}</P>
    <div className="grid gap-1.5">{f.tonight.matches.map((m) => <div key={m.id} className="flex items-center gap-2" style={{ fontFamily: FR, fontSize: 12.5, padding: "4px 0", borderBottom: `1px dotted ${INK}55` }}><span dir="ltr" className="inline-flex items-center gap-1.5"><Crest src={m.a.logo} s={18} /><b style={{ fontSize: 12 }}>{m.a.he}</b><span>–</span><b style={{ fontSize: 12 }}>{m.b.he}</b><Crest src={m.b.logo} s={18} /></span><span style={{ flex: 1 }} /><N s={12}>{new Date(m.kickoff).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" })}</N></div>)}</div>
    <Foot>בעמוד {no + 1}: לוח המודעות ←</Foot></Page>);

  // the notices and the weather
  pages.push((no) => <Page h={h}><Mast page={`${no} · מודעות`} /><H s={18} style={{ textAlign: "center" }}>— לוח מודעות —</H>
    <div className="grid grid-cols-2 gap-2" style={{ marginTop: 6 }}>{(t.ads || []).slice(0, 6).map((a, i) => <div key={i} style={{ border: `1px solid ${INK}`, padding: 6 }}><div style={{ fontFamily: FR, fontWeight: 900, fontSize: 14 }}>{a.head}</div><div style={{ fontFamily: FR, fontSize: 11.5, lineHeight: 1.35 }}>{a.body}</div></div>)}</div><Rule />
    <div className="flex items-center gap-3" style={{ fontFamily: FR, fontSize: 12.5 }}><WeatherIcon kind={f.weather} /><div><b>מזג האוויר: {t.weather?.title}</b> {t.weather?.text} {t.weather?.forecast && <><b>תחזית:</b> {t.weather.forecast}</>}</div></div>
    <Foot>{NAME} · הגיליון הבא יוצא בבוקר שאחרי ערב המשחקים הבא</Foot></Page>);

  return <Pages pages={pages.map((fn, i) => <React.Fragment key={i}>{fn(i + 1)}</React.Fragment>)} />;
}

// the issue spinning in over the screen, with a close button (for the home screen and the admin preview)
export function NewspaperOverlay({ issue, onClose }) {
  return <motion.div className="fixed inset-0" style={{ zIndex: 90, background: "radial-gradient(120% 80% at 50% 20%, rgba(20,30,60,.96), rgba(2,6,16,.99))", padding: "calc(env(safe-area-inset-top) + 56px) 12px 0", overflow: "hidden" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <button type="button" onClick={onClose} aria-label="סגירה" className="fixed grid place-items-center" style={{ top: "calc(env(safe-area-inset-top) + 12px)", left: 14, zIndex: 91, width: 34, height: 34, borderRadius: 11, background: "rgba(0,0,0,.55)", color: "#fff", border: "1px solid rgba(255,255,255,.2)", fontSize: 16 }}>✕</button>
    <motion.div initial={{ scale: 0.05, rotate: -720, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.2, 0.9, 0.3, 1] }}><Newspaper issue={issue} top={56} /></motion.div></motion.div>;
}
