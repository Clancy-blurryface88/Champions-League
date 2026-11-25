import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// "ידיעות האלופות" (22.11.2026) — one issue, drawn from its facts (computed on the server) and texts (written by
// Claude). Like a real paper: pages to turn, each exactly one screen tall (no scrolling, no tap-to-expand);
// a page that's a bit long on a short phone shrinks to fit. A match with a story gets its matrix (players ×
// the score after each goal) and its live blog together on one page.
// An issue may carry a hand-made layout (25.11, the admin's editor): texts.layout.pages = [{ id, name?, html? }] — the
// pages in order; a page with html is shown as edited, the others are drawn from the facts and texts as always.
// Page numbers and the "next page" lines stay right by themselves: they are marked data-np and filled on showing.

export const NAME = "ידיעות האלופות";
const INK = "#1a1410", RED = "#b3261e", GREEN = "#166534", PAPER = "#f3ecdc";
const FR = "'Frank Ruhl Libre', serif", NUMF = "var(--num-font)";
// newsprint (22.11): grain, a little yellowing at the edges
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 .18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const paperBg = `${GRAIN}, radial-gradient(140% 100% at 50% 40%, #f3f0e8 55%, #e2dccd)`;
export function useNewspaperFonts() {
  React.useEffect(() => {
    if (document.getElementById("np-fonts")) return;
    const l = document.createElement("link"); l.id = "np-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;700;900&family=Noto+Serif+Hebrew:wght@700;900&display=swap";
    document.head.appendChild(l);
  }, []);
}

const r2n = (x) => Math.round(x * 100) / 100;
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
// the Champions League's marks (22.11): the logo in the nameplate, the trophy as the headline's watermark, small balls and cups by section heads — printed in ink
const INKF = "grayscale(1) contrast(1.25) brightness(.55)";
const Mark = ({ src, h, w, style }) => <img src={src} alt="" style={{ height: h, width: w, objectFit: "contain", filter: INKF, mixBlendMode: "multiply", ...style }} />;
const Ball = ({ s = 12 }) => <Mark src="/champions/round-ball.png" h={s} w={s} style={{ display: "inline-block", verticalAlign: "-2px" }} />;
const Cup = ({ s = 16 }) => <Mark src="/champions/ch-trophy.webp" h={s} w={s * 0.8} style={{ display: "inline-block", verticalAlign: "-3px" }} />;
const footText = (no, nx) => (nx ? `בעמוד ${no + 1}: ${nx} ←` : "");
// the exact hit's mark (the user's pick, 26.11): a full green target
const Target = ({ s = 18 }) => <svg viewBox="0 0 40 40" width={s} height={s} style={{ display: "block" }}>{[[18, GREEN], [12.5, "#f1ede2"], [7.5, GREEN], [2.6, "#f1ede2"]].map(([r, c]) => <circle key={r} cx="20" cy="20" r={r} fill={c} />)}</svg>;
const Foot = ({ children, no, nx }) => <div style={{ marginTop: "auto" }}><Rule /><div style={{ fontFamily: FR, fontSize: 10.5, fontWeight: 700, textAlign: "left" }}>{children || <span data-np="foot">{footText(no, nx)}</span>}</div></div>;
const No = ({ no }) => <span data-np="no">{no}</span>;
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
function Page({ h, children, html }) {
  const inner = React.useRef(null);
  const [k, setK] = React.useState(1);
  React.useLayoutEffect(() => {
    const el = inner.current; if (!el) return;
    // transform doesn't change layout, so scrollHeight is the content's natural height at any scale
    const fit = () => { const need = el.scrollHeight; setK(need > h ? h / need : 1); };
    fit(); const t = setTimeout(fit, 700); return () => clearTimeout(t);
  }, [h, html]);
  const inner2 = html == null ? { children } : { dangerouslySetInnerHTML: { __html: html } };
  return <div dir="rtl" style={{ height: h, overflow: "hidden", position: "relative", background: paperBg, color: INK, boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 0 60px rgba(120,90,40,.16)" }}>
    <div ref={inner} data-np-inner="" {...inner2} className="flex flex-col" style={{ position: "absolute", top: 0, right: 0, width: `${100 / k}%`, minHeight: h / k, padding: "12px 12px 10px", transform: `scale(${k})`, transformOrigin: "top right" }} />
    {/* the horizontal fold of a real paper */}
    <div className="pointer-events-none absolute inset-x-0" style={{ top: "52%", height: 18, background: "linear-gradient(180deg, transparent, rgba(0,0,0,.06) 45%, rgba(255,255,255,.35) 55%, transparent)" }} /></div>;
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

// hand-edited pages: only an admin can write them, and still nothing that runs gets through
export function cleanHtml(html) {
  const d = new DOMParser().parseFromString(`<div>${html || ""}</div>`, "text/html");
  d.querySelectorAll("script,style,iframe,object,embed,link,meta,form,input,button,base").forEach((e) => e.remove());
  d.querySelectorAll("*").forEach((e) => [...e.attributes].forEach((a) => { if (/^on/i.test(a.name) || a.name === "contenteditable" || (/^(href|src|xlink:href)$/i.test(a.name) && /^\s*(javascript|data:text)/i.test(a.value))) e.removeAttribute(a.name); }));
  return d.body.firstChild.innerHTML;
}
// the numbers and the next-page line of an edited page, by where it stands now
function fillHtml(html, no, nx) {
  const d = new DOMParser().parseFromString(`<div>${cleanHtml(html)}</div>`, "text/html");
  d.querySelectorAll("[data-np=no]").forEach((e) => { e.textContent = no; });
  d.querySelectorAll("[data-np=next]").forEach((e) => { e.textContent = no + 1; });
  d.querySelectorAll("[data-np=foot]").forEach((e) => { e.textContent = footText(no, nx); });
  return d.body.firstChild.innerHTML;
}
// pages left out of an issue for now (the user, 26.11); the editor can still bring them into one
const OFF = new Set(["drama", "cost"]);
export const allPages = (issue, h) => buildPages(issue, h);
// the issue's pages as they will be shown: [{ id, name, html?, el(no, nx, h) }]
export function layoutPages(issue, h, layout = issue.texts?.layout) {
  const all = buildPages(issue, h);
  if (!layout?.pages?.length) return all.filter((x) => !OFF.has(x.id));
  return layout.pages.map((x) => { const own = all.find((a) => a.id === x.id); return own || x.html != null ? { ...own, ...x, name: x.name || own?.name || "", teaser: x.name || own?.teaser || x.name } : null; }).filter(Boolean);
}
export function pageElement(x, i, list, h) {
  const no = i + 1, nx = list[i + 1]?.teaser;
  return x.html != null ? <Page h={h} html={fillHtml(x.html, no, nx)} /> : x.el(no, nx);
}
// a new empty page's start
export const BlankPage = ({ no = 1, name, issue }) => { const f = issue.facts || {}; return <><div className="flex justify-between" style={{ fontFamily: FR, fontSize: 10, fontWeight: 700 }}><span><No no={no} /> · {name}</span><span>{NAME}</span><span>{f.round?.name?.replace(/League Phase\s*-\s*/i, "מחזור ")} · {f.dm}</span></div><Rule thick /><H s={24}>כותרת</H><P style={{ marginTop: 6 }}>כאן כותבים את הטקסט.</P><Foot no={no} nx="" /></>; };
// a picture in the page: its box keeps its shape while loading; "print" lays the paper's grey and dots over it
// a real halftone: half a screen of dots over the grey picture, then strong contrast — dark areas get big dots, light ones small
export const DOTS = "radial-gradient(circle, #000 0, #fff 78%) 0 0/3px 3px", PRINT = "grayscale(1) contrast(2.7) brightness(1.06) sepia(.12)";
export const Figure = ({ src, ratio = 1, kind, caption }) => { const plain = kind === "crest"; return <figure data-np-fig={plain ? "plain" : "print"} style={{ width: plain ? "26%" : kind === "player" ? "45%" : "70%", margin: "8px auto" }}>
  <div data-np-box="" style={{ position: "relative", overflow: "hidden", aspectRatio: String(ratio), filter: plain ? "grayscale(1) contrast(1.15)" : PRINT, mixBlendMode: "multiply", ...(plain ? {} : { border: `1px solid ${INK}` }) }}><img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />{!plain && <div data-np-dots="" style={{ position: "absolute", inset: 0, background: DOTS, opacity: 0.42 }} />}</div>
  {!plain && <figcaption style={{ fontFamily: FR, fontSize: 10.5, fontStyle: "italic", lineHeight: 1.3, marginTop: 3, textAlign: "center" }}>{caption || "כיתוב לתמונה"}</figcaption>}</figure>; };
// parts the editor can add
export const PARTS = {
  title: () => <H s={20}>כותרת חדשה</H>, text: () => <P style={{ marginTop: 6 }}>פסקה חדשה.</P>, kick: () => <Kick>כותרת קטנה</Kick>, rule: () => <Rule />,
  box: () => <Box style={{ marginTop: 6 }}><H s={14}>כותרת במסגרת</H><P style={{ fontSize: 12.3 }}>טקסט במסגרת.</P></Box>, col: () => <div><P>טקסט בעמודה החדשה.</P></div>, vline: () => <VLine />,
};

export default function Newspaper({ issue, top = 100 }) {
  useNewspaperFonts();
  const [h, setH] = React.useState(() => Math.max(480, window.innerHeight - top - 84));
  React.useEffect(() => { const on = () => setH(Math.max(480, window.innerHeight - top - 84)); window.addEventListener("resize", on); return () => window.removeEventListener("resize", on); }, [top]);
  const list = layoutPages(issue, h);
  return <Pages pages={list.map((x, i) => <React.Fragment key={x.id}>{pageElement(x, i, list, h)}</React.Fragment>)} />;
}

// the notices by their fixed categories (the user, 26.11); a notice of any other kind keeps its own name, at the end
const AD_CATS = ["להשכרה", "דרוש", "תנחומים", "אבדה", "מכירה", "שיעורים פרטיים"];
const AD_SAME = { דרושה: "דרוש", דרושים: "דרוש", למכירה: "מכירה", אבד: "אבדה", אבדות: "אבדה" };
function adGroups(ads) {
  const by = {};
  ads.forEach(({ head = "", body }) => { const [first, ...rest] = head.split(":"); const name = first.trim(), cat = AD_SAME[name] || name; const sub = rest.join(":").trim(); (by[cat] ||= []).push(sub ? `${sub}. ${body}` : body); });
  const names = [...AD_CATS.filter((c) => by[c]), ...Object.keys(by).filter((c) => !AD_CATS.includes(c))];
  return names.map((c) => [c, by[c]]);
}

function buildPages(issue, h) {
  const f = issue.facts || {}, t = issue.texts || {};
  const M = Object.fromEntries((f.matches || []).map((m) => [m.id, m]));
  const isRound = f.kind === "round";
  const issueNo = (f.round?.no || 0) * 2 - ((f.nightsInRound || 2) - (f.nightNo || 1));
  const Mast = ({ page }) => <><div className="flex justify-between" style={{ fontFamily: FR, fontSize: 10, fontWeight: 700 }}><span>{page}</span><span>{NAME}</span><span>{f.round?.name?.replace(/League Phase\s*-\s*/i, "מחזור ")} · {f.dm}</span></div><Rule thick /></>;
  const winner = f.nightRank?.[0], second = f.nightRank?.[1];
  const pages = []; // each: { id, name (in the editor), teaser (how the page before announces it), el(page number, next teaser) => <Page> }
  const add = (id, name, teaser, el) => pages.push({ id, name, teaser, el });

  // 1 — the front (22.11, the user's pick "4+5, version 2, the tables on the left"): a quality broadsheet — the line
  // above the nameplate, the folio between rules, the headline centred with an italic deck; the story on the right
  // (photo with a caption, byline, two justified columns with a drop cap, the jump line, the night winner) and on the
  // left a sports column: the night's results (bold = an exact hit) and the full table. An index box and a barcode below.
  // "more from the night" under the winner: the biggest climb in the table, who closed the most on the one above him,
  // and the night's biggest single hit (an exact hit if there was one, otherwise the best-paying prediction)
  const nightOf = Object.fromEntries((f.nightRank || []).map((r) => [r.name, r.pts]));
  const climb = [...(f.table || [])].filter((r) => r.move > 0).sort((a, b) => b.move - a.move)[0];
  const closed = (() => { const tb = f.table || []; let best = null;
    tb.forEach((r, i) => { if (!i) return; const up = tb[i - 1]; const before = (r.total - (nightOf[r.name] || 0)), upBefore = (up.total - (nightOf[up.name] || 0)); const gain = r2n((upBefore - before) - (up.total - r.total)); if (gain > 0 && (!best || gain > best.gain)) best = { name: r.name, over: up.name, gain }; });
    return best; })();
  const bestHit = (f.exact || []).length ? [...f.exact].sort((a, b) => b.pts - a.pts)[0] : (() => { let b = null; (f.matches || []).forEach((mm) => (mm.picks || []).forEach((p) => { if (!b || p.pts > b.pts) b = { name: p.name, match: mm.id, pts: p.pts, pick: p.pick }; })); return b; })();
  const photo = M[t.photoMatch];
  const pg = photo?.goals?.[photo.goals.length - 1];
  const photoHits = (f.exact || []).filter((e) => e.match === photo?.id).map((e) => e.name);
  add("front", "שער", "השער", (no) => <Page h={h}>
    <div className="grid items-center" style={{ gridTemplateColumns: "1fr 1px 118px", gap: 10 }}>
      <div><div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontWeight: 700, fontSize: 28, lineHeight: 1.1, whiteSpace: "nowrap" }}>{NAME}</div><div style={{ fontFamily: FR, fontSize: 9.5, fontStyle: "italic" }}>העיתון היחיד שקורא את הניחושים שלכם</div></div>
      <div style={{ background: INK, alignSelf: "stretch" }} /><Mark src="/champions/ch-logo.png" h={46} w="100%" /></div>
    <div className="flex justify-between" style={{ borderTop: `1px solid ${INK}`, borderBottom: `3px double ${INK}`, padding: "2px 0", margin: "4px 0 8px", fontFamily: FR, fontSize: 9.5, fontWeight: 700 }}><span>שנה א׳ · גיליון {issueNo}</span><span>{f.day ? `בוקר שאחרי ערב ${f.day}` : ""} · {f.dm}</span><span>מחיר: ניחוש אחד</span></div>
    <div className="relative"><Mark src="/champions/ch-trophy.webp" h={118} style={{ position: "absolute", left: "50%", top: -14, transform: "translateX(-50%)", opacity: 0.13 }} />
      <div className="relative"><div style={{ fontFamily: FR, fontWeight: 700, fontSize: (t.headline || "").length <= 10 ? 38 : (t.headline || "").length <= 16 ? 32 : 26, lineHeight: 1, textAlign: "center" }} data-np-text="headline">{t.headline}</div>
      <div style={{ fontFamily: FR, fontSize: 12, fontStyle: "italic", textAlign: "center", margin: "4px 10px 8px", lineHeight: 1.35 }}>{t.subhead}</div></div></div>
    <div className="grid" style={{ gridTemplateColumns: "1fr 1px 106px", gap: 8 }}>
      <div>
        {photo && <figure style={{ margin: 0 }}><div className="grid place-items-center" style={{ height: 84, background: `radial-gradient(circle at 1px 1px, rgba(20,18,16,.38) .9px, transparent 1.3px) 0 0/4px 4px, linear-gradient(135deg,#cfc6b4,#a89d88)` }}><Score m={photo} cs={32} ns={24} /></div>
          {pg && <figcaption style={{ fontFamily: FR, fontSize: 9.5, lineHeight: 1.3, marginTop: 3 }}><b>הרגע שהכריע:</b> {t.scorers?.[pg.scorer] || pg.scorer} כובש בדקה {pg.minute}, {photo.a.he} {photo.score} {photo.b.he}{photoHits.length ? ` — ופגיעה מדויקת ל${photoHits.join(" ול")}` : ""}. <span style={{ opacity: 0.6, fontSize: 8.5 }}>(צילום: ארכיון {NAME})</span></figcaption>}</figure>}
        <div style={{ fontFamily: FR, fontSize: 10, fontWeight: 700, margin: "4px 0" }}>מאת <span style={{ color: RED }}>כתב {NAME}</span> · {f.day} {f.dm}</div>
        <div style={{ columnCount: 2, columnGap: 10, columnRule: `1px solid ${INK}44`, fontFamily: FR, fontSize: 10.6, lineHeight: 1.42, textAlign: "justify" }}><p style={{ margin: 0 }}><span style={{ float: "right", fontWeight: 900, fontSize: 34, lineHeight: 0.8, marginLeft: 4, marginTop: 2 }}>{(t.lead || " ")[0]}</span>{(t.lead || "").slice(1)}</p></div>
        <div style={{ fontFamily: FR, fontSize: 10, fontWeight: 700, textAlign: "left", marginTop: 3 }}>(המשך בעמ׳ <span data-np="next">{no + 1}</span>)</div>
        {winner && <div style={{ borderTop: `2px solid ${INK}`, paddingTop: 3, marginTop: 6 }}><div style={{ fontFamily: FR, fontWeight: 900, fontSize: 12 }}><Cup /> מנצח הערב</div><div className="flex items-baseline justify-between"><span style={{ fontFamily: FR, fontWeight: 900, fontSize: 18 }}>{winner.name}</span><N s={13}>{winner.pts.toFixed(2)}</N></div>{second && <div style={{ fontFamily: FR, fontSize: 9.5 }}>שני: {second.name} ({second.pts.toFixed(2)})</div>}</div>}
        {(climb || closed || bestHit) && <div style={{ borderTop: `1px solid ${INK}`, marginTop: 6, paddingTop: 3 }}><div style={{ fontFamily: FR, fontWeight: 900, fontSize: 12 }}><Ball /> עוד מהערב</div>
          {[climb && ["הקפיצה של הערב", <><b>{climb.name}</b> עלה {climb.move === 1 ? "מקום אחד" : `${climb.move} מקומות`}, למקום {climb.rank}</>],
            closed && ["סגר פער", <><b>{closed.name}</b> צמצם ב־<N s={10.5}>{closed.gain.toFixed(2)}</N> נק׳ את הפער מ{closed.over}</>],
            bestHit && [(f.exact || []).length ? "הפגיעה הגדולה" : "הניחוש המשתלם", <><b>{bestHit.name}</b> · {M[bestHit.match]?.a.he}–{M[bestHit.match]?.b.he} <N s={10.5}>{M[bestHit.match]?.score}</N> · <N s={10.5} c={GREEN}>+{bestHit.pts.toFixed(2)}</N></>]].filter(Boolean).map(([k, v]) => <div key={k} style={{ fontFamily: FR, fontSize: 10.5, lineHeight: 1.35, padding: "3px 0", borderBottom: `1px dotted ${INK}55` }}><span style={{ fontWeight: 900, color: RED }}>{k}: </span>{v}</div>)}</div>}
      </div>
      <div style={{ background: `${INK}55` }} />
      <div className="grid gap-2" style={{ alignContent: "start" }}>
        <div><div style={{ fontFamily: FR, fontWeight: 900, fontSize: 12, borderBottom: `2px solid ${INK}` }}><Ball /> תוצאות הערב</div>
          {(f.matches || []).map((mm) => { const hit = (f.exact || []).some((e) => e.match === mm.id); return <div key={mm.id} className="flex items-center justify-between" style={{ fontFamily: FR, fontSize: 9.8, padding: "2px 0", borderBottom: `1px dotted ${INK}55`, fontWeight: hit ? 900 : 400 }}><span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 74 }}>{mm.a.he}–{mm.b.he}</span><N s={9.8} w={hit ? 900 : 700}>{mm.score}</N></div>; })}
          <div style={{ fontFamily: FR, fontSize: 8.5, fontStyle: "italic", marginTop: 2 }}>מודגש = פגיעה מדויקת</div></div>
        <div><div style={{ fontFamily: FR, fontWeight: 900, fontSize: 12, borderBottom: `2px solid ${INK}` }}><Ball /> הטבלה המלאה</div>
          {(f.table || []).map((r) => <div key={r.name} className="grid items-center" style={{ gridTemplateColumns: "13px 1fr 11px 40px", fontFamily: FR, fontSize: 10, padding: "2px 0", borderTop: `1px dotted ${INK}55`, fontWeight: r.rank === 1 ? 900 : 400 }}><span>{r.rank}</span><span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{r.name}</span><span style={{ fontSize: 8, opacity: r.move ? 1 : 0 }}>{r.move > 0 ? "▲" : "▼"}</span><span style={{ textAlign: "left" }}><N s={10} w={r.rank === 1 ? 900 : 600}>{r.total.toFixed(1)}</N></span></div>)}
          <div style={{ fontFamily: FR, fontSize: 9.5, marginTop: 3 }}>הפער בצמרת: <b>{f.gapNow}</b></div></div>
      </div>
    </div>
    <div className="flex items-end justify-between" style={{ borderTop: `1px solid ${INK}`, marginTop: "auto", paddingTop: 4 }}>
      <div style={{ border: `1px solid ${INK}`, padding: "2px 6px", fontFamily: FR, fontSize: 9, lineHeight: 1.4 }}><b>בגיליון</b><div>הכתבה · 2 · {f.dramas?.length ? "הדרמה · 3 · " : ""}מודעות · אחרון</div></div>
      <div className="flex items-end gap-1"><div style={{ display: "flex", height: 22, gap: 1 }}>{[2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2].map((w, i) => <span key={i} style={{ width: w, background: i % 2 ? "transparent" : INK }} />)}</div><div style={{ fontFamily: NUMF, fontSize: 7.5 }} dir="ltr">7 290000 0{issueNo}2026</div></div>
    </div></Page>);

  // 2 — the lead story goes on: the exact hits of the night with the goals that made them
  add("lead", "הכתבה הראשית", "הכתבה הראשית", (no, nx) => <Page h={h}><Mast page={<><No no={no} /> · הכתבה הראשית</>} /><Kick>המשך מעמוד 1</Kick>
    {(t.leadMore || []).map((p, i) => <P key={i} style={{ marginTop: i ? 6 : 2 }}>{p}</P>)}
    <Rule /><P style={{ marginBottom: 6 }}>{t.leadHitsIntro}</P>
    {/* a row per match in three parts (26.11): the goal that set the score (dark), the score and everyone who hit it, the points once */}
    {f.exact?.length ? <div className="grid gap-1.5">{Object.values(f.exact.reduce((acc, e) => { (acc[e.match] ||= { match: e.match, pts: e.pts, names: [] }).names.push(e.name); return acc; }, {})).map((g) => { const goal = (f.exactGoals || []).find((x) => x.match === g.match); return <div key={g.match} className="flex" style={{ border: `1px solid ${INK}55` }}>
      <div className="flex flex-col items-center justify-center" style={{ width: 66, flexShrink: 0, background: INK, color: PAPER, fontFamily: FR, fontSize: 11, lineHeight: 1.15, padding: "4px 3px", textAlign: "center" }}>{goal ? <><N s={17} c={PAPER}>{goal.minute}'</N><span>{t.scorers?.[goal.scorer] || goal.scorer}</span></> : <span>{M[g.match]?.score === "0-0" ? "בלי שערים" : "עד הסיום"}</span>}</div>
      <div className="flex items-center" style={{ padding: "6px 9px" }}><Score m={M[g.match]} cs={20} ns={18} /></div>
      <div className="flex items-center gap-1.5" style={{ flex: 1, minWidth: 0 }}><span style={{ flexShrink: 0 }}><Target s={14} /></span><b style={{ fontFamily: FR, fontSize: 13, lineHeight: 1.15 }}>{g.names.length > 1 ? `${g.names.slice(0, -1).join(", ")} ו${g.names[g.names.length - 1]}` : g.names[0]}</b></div>
      <div className="flex flex-col items-center justify-center" style={{ minWidth: 58, padding: "0 6px", background: `${GREEN}1a` }}><N s={14} c={GREEN}>+{g.pts.toFixed(2)}</N>{g.names.length > 1 && <span style={{ fontFamily: FR, fontSize: 9, lineHeight: 1.1 }}>לכל אחד</span>}</div></div>; })}</div>
      : <P style={{ fontWeight: 700 }}>אף משתתף לא פגע בתוצאה מדויקת הערב.</P>}
    <Foot no={no} nx={nx} /></Page>);

  // 3 — the hits on the way, match by match
  const born = (f.matches || []).filter((m) => m.born > 0).sort((a, b) => b.born - a.born);
  if (born.length) add("drama", "הדרמה", t.dramaTitle || "הפגיעות שנעלמו בדרך", (no, nx) => <Page h={h}><Mast page={<><No no={no} /> · הדרמה</>} /><Kick>מתוך משחקי הלייב</Kick><H s={24}>{t.dramaTitle}</H>
    <P style={{ margin: "4px 0 8px" }}>{t.dramaIntro}</P>
    <div style={{ border: `1px solid ${INK}` }}><div className="grid" style={{ gridTemplateColumns: "1fr 74px 74px", padding: "4px 6px", fontFamily: FR, fontSize: 10.5, fontWeight: 900, background: `${INK}10` }}><span>המשחק</span><span className="text-center">פגעו במהלך המשחק</span><span className="text-center">פגיעה מדויקת בסיום</span></div>
      {born.map((m) => <div key={m.id} className="grid items-center" style={{ gridTemplateColumns: "1fr 74px 74px", padding: "3px 6px", borderTop: `1px dotted ${INK}55` }}><span><Score m={m} cs={17} ns={12.5} /></span><span className="text-center"><N s={13}>{m.born}</N></span><span className="text-center"><N s={13} c={m.survived ? GREEN : RED}>{m.survived}</N></span></div>)}</div>
    <Foot no={no} nx={nx} /></Page>);

  // a page per dramatic match: the matrix and the live blog together
  (f.dramas || []).forEach((id, di) => { const m = M[id]; const tx = (t.matches || []).find((x) => x.id === id) || t.matches?.[di];
    if (m) add(`match-${id}`, `${m.a.he}–${m.b.he}`, tx?.title || "המשחק הדרמטי", (no, nx) => <Page h={h}><Mast page={<><No no={no} /> · הדרמה</>} /><Kick>{tx?.kicker}</Kick><H>{tx?.title}</H>
      <div style={{ margin: "4px 0" }}><Score m={m} cs={22} ns={16} /></div><Matrix m={m} /><MatrixNote /><Blog m={m} text={tx} he={t.scorers} />
      {tx?.closing && <P style={{ marginTop: 6, fontWeight: 700 }}>{tx.closing}</P>}
      <Foot no={no} nx={nx} /></Page>); });
  // what the vanished hits would have been worth
  if (f.dramas?.length) add("cost", "מה זה עלה להם", "מה זה עלה להם", (no, nx) => <Page h={h}><Mast page={<><No no={no} /> · הדרמה</>} /><H s={20}>מה זה עלה להם</H>
    {f.dramas.map((id, di) => { const m = M[id]; const tx = (t.matches || []).find((x) => x.id === id) || t.matches?.[di]; return m ? <div key={id} style={{ marginTop: 8 }}><div className="flex items-center gap-2" style={{ marginBottom: 4 }}><Score m={m} cs={18} ns={13} /><b style={{ fontFamily: FR, fontSize: 13 }}>{tx?.title}</b></div>
      {tx?.costIntro && <P style={{ fontSize: 12.5, marginBottom: 4 }}>{tx.costIntro}</P>}<Worth rows={worthRows(m)} /></div> : null; })}
    <div style={{ fontFamily: FR, fontSize: 10.5, fontStyle: "italic", marginTop: 4 }}>"ניקוד אפשרי" = הנקודות שכל אחד היה מקבל אם המשחק היה נגמר בתוצאה שלו.</div>
    <Foot no={no} nx={nx} /></Page>);

  // the biggest score, the most turnarounds, the wisdom of the crowd
  add("more", "עוד מהמגרשים", "עוד מהמגרשים", (no, nx) => <Page h={h}><Mast page={<><No no={no} /> · עוד מהמגרשים</>} />
    <div className="grid" style={{ gridTemplateColumns: "1fr 1px 1fr", gap: 10 }}>
      <div><Kick>התוצאה הגדולה</Kick><H s={15.5}>{t.bigScore?.title}</H><div style={{ margin: "4px 0" }}><Score m={M[f.biggest]} cs={18} ns={13} /></div><P style={{ fontSize: 12.3 }}>{t.bigScore?.text}</P></div><VLine />
      <div><Kick>הכי הרבה מהפכים</Kick><H s={15.5}>{t.flips?.title}</H><div style={{ margin: "4px 0" }}><Score m={M[f.flips]} cs={18} ns={13} /></div><P style={{ fontSize: 12.3 }}>{t.flips?.text}</P></div></div>
    <Rule /><Kick>ניתוח</Kick><H s={17}>חוכמת ההמונים</H><P style={{ marginTop: 3 }}>{t.crowd?.lead}</P><P style={{ marginTop: 6 }}>{t.crowd?.more}</P>
    <Foot no={no} nx={nx} /></Page>);

  // the group as forecasters (the round issue): what the group predicted against what happened, the season beside it
  const gp = f.groupProfile;
  if (isRound && gp) add("group", "הקבוצה", t.groupProfile?.title || "הקבוצה", (no, nx) => { const R = gp.round, S = gp.season, pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
    const w = (x) => Math.round(x), g2 = (x) => Math.round(x * 10) / 10;
    const rows = [["תיקו", w(R.group.D), pct(R.real.D, R.n), w(S.group.D), "%"], ["ניצחון בית", w(R.group.H), pct(R.real.H, R.n), w(S.group.H), "%"], ["ניצחון חוץ", w(R.group.A), pct(R.real.A, R.n), w(S.group.A), "%"], ["שתיהן כובשות", w(R.group.btts), pct(R.real.btts, R.n), w(S.group.btts), "%"], ["שערים למשחק", g2(R.group.goals), g2(R.real.goals), g2(S.group.goals), ""]];
    const st = gp.standouts;
    return <Page h={h}><Mast page={<><No no={no} /> · הקבוצה</>} /><Kick>הפרופיל של הקבוצה</Kick><H s={23}>{t.groupProfile?.title}</H><P style={{ margin: "4px 0 8px" }}>{t.groupProfile?.text}</P>
      <div style={{ border: `1px solid ${INK}` }}><div className="grid" style={{ gridTemplateColumns: "1fr 62px 62px 62px", padding: "4px 6px", fontFamily: FR, fontSize: 10, fontWeight: 900, background: `${INK}10` }}><span /><span className="text-center">ניחוש המשתתפים</span><span className="text-center">בפועל</span><span className="text-center">ניחשו העונה</span></div>
        {rows.map(([l, g, r, s, u]) => <div key={l} className="grid items-center" style={{ gridTemplateColumns: "1fr 62px 62px 62px", padding: "5px 6px", borderTop: `1px dotted ${INK}55`, fontFamily: FR, fontSize: 12.5 }}><b>{l}</b><span className="text-center"><N s={13}>{g}{u}</N></span><span className="text-center"><N s={13} c={RED}>{r}{u}</N></span><span className="text-center"><N s={13} c={`${INK}99`}>{s}{u}</N></span></div>)}</div>
      <Rule /><Kick c={INK}>מי בלט במחזור</Kick>
      <div className="grid grid-cols-2 gap-2" style={{ marginTop: 4 }}>{[["הכי אופטימי בשערים", st.mostGoals.name, `${st.mostGoals.goals} שערים למשחק בממוצע`], ["הכי זהיר", st.fewestGoals.name, `${st.fewestGoals.goals} שערים למשחק בממוצע`], ["מלך התיקו", st.mostDraws.name, `${st.mostDraws.draws} ניחושי תיקו`], ["המנחש המיוחד", st.mostUnique.name, `${st.mostUnique.unique} ניחושים שאף אחד אחר לא ניחש${st.mostUnique.hits ? `, ${st.mostUnique.hits} מהם פגעו` : ""}`]].map(([l, nm, d]) => <Box key={l} style={{ padding: 6 }}><Kick>{l}</Kick><H s={16}>{nm}</H><div style={{ fontFamily: FR, fontSize: 11 }}>{d}</div></Box>)}</div>
      <Foot no={no} nx={nx} /></Page>; });

  // the numbers, the table, forecast against reality (round) or the night's points (night)
  add("numbers", "מספרים", `${isRound ? "המחזור" : "הערב"} במספרים`, (no, nx) => { const nums = [[String(f.exactCount ?? 0), `פגיעות מדויקות הערב (${f.dir?.of || 0} ניחושים)`], [String(f.dir?.n ?? 0), `ניחושים שצדקו בכיוון — ${f.dir?.of ? Math.round((f.dir.n / f.dir.of) * 100) : 0}%`], [String(f.bornTotal ?? 0), "פגיעות במהלך המשחקים"], [String(f.gapNow ?? 0), "נקודות בין המקום הראשון לשני בטבלה"], [String((f.withoutExact || []).length), "משתתפים בלי פגיעה מדויקת"], [M[f.biggest] ? String(M[f.biggest].goalsTotal) : "0", "שערים בתוצאה הגדולה של הערב"]];
    return <Page h={h}><Mast page={<><No no={no} /> · מספרים</>} /><H s={23}>{isRound ? "המחזור" : "הערב"} במספרים</H>
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
      <Foot no={no} nx={nx} /></Page>; });

  // tonight (a night that isn't the round's last)
  if (f.tonight) add("tonight", "הערב", "מה מחכה הערב", (no, nx) => <Page h={h}><Mast page={<><No no={no} /> · הערב</>} /><Kick>הערב · {f.tonight.day}</Kick><H s={24}>{t.tonight?.title}</H><P style={{ margin: "4px 0 8px" }}>{t.tonight?.text}</P>
    <div className="grid gap-1.5">{f.tonight.matches.map((m) => <div key={m.id} className="flex items-center gap-2" style={{ fontFamily: FR, fontSize: 12.5, padding: "4px 0", borderBottom: `1px dotted ${INK}55` }}><span dir="ltr" className="inline-flex items-center gap-1.5"><Crest src={m.a.logo} s={18} /><b style={{ fontSize: 12 }}>{m.a.he}</b><span>–</span><b style={{ fontSize: 12 }}>{m.b.he}</b><Crest src={m.b.logo} s={18} /></span><span style={{ flex: 1 }} /><N s={12}>{new Date(m.kickoff).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" })}</N></div>)}</div>
    <Foot no={no} nx={nx} /></Page>);

  // the notices and the weather
  add("ads", "מודעות", "לוח המודעות", (no) => <Page h={h}><Mast page={<><No no={no} /> · מודעות</>} /><H s={18} style={{ textAlign: "center" }}>— לוח מודעות —</H>
    {/* classifieds, like a real paper: a name band for each category, its notices under it, two columns */}
    <div style={{ columnCount: 2, columnGap: 14, columnRule: `1px solid ${INK}66`, marginTop: 6 }}>{adGroups((t.ads || []).slice(0, 8)).map(([cat, list]) => <div key={cat} style={{ breakInside: "avoid", paddingBottom: 8 }}><div style={{ background: INK, color: PAPER, fontFamily: FR, fontSize: 13, fontWeight: 900, textAlign: "center", lineHeight: 1.5, marginBottom: 3 }}>{cat}</div>
      {list.map((x, i) => <div key={i} style={{ fontFamily: FR, fontSize: 11.8, lineHeight: 1.4, padding: "2px 0 4px", borderTop: i ? `1px dotted ${INK}77` : "none" }}>{x}</div>)}</div>)}</div><Rule />
    <div className="flex items-center gap-3" style={{ fontFamily: FR, fontSize: 12.5 }}><WeatherIcon kind={f.weather} /><div><b>מזג האוויר: {t.weather?.title}</b> {t.weather?.text} {t.weather?.forecast && <><b>תחזית:</b> {t.weather.forecast}</>}</div></div>
    <Foot>{NAME} · הגיליון הבא יוצא בבוקר שאחרי ערב המשחקים הבא</Foot></Page>);

  return pages;
}

// the issue spinning in over the screen, with a close button (for the home screen and the admin preview)
export function NewspaperOverlay({ issue, onClose }) {
  return <motion.div className="fixed inset-0" style={{ zIndex: 90, background: "radial-gradient(120% 80% at 50% 20%, rgba(20,30,60,.96), rgba(2,6,16,.99))", padding: "calc(env(safe-area-inset-top) + 56px) 12px 0", overflow: "hidden" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <button type="button" onClick={onClose} aria-label="סגירה" className="fixed grid place-items-center" style={{ top: "calc(env(safe-area-inset-top) + 12px)", left: 14, zIndex: 91, width: 34, height: 34, borderRadius: 11, background: "rgba(0,0,0,.55)", color: "#fff", border: "1px solid rgba(255,255,255,.2)", fontSize: 16 }}>✕</button>
    <motion.div initial={{ scale: 0.05, rotate: -720, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.2, 0.9, 0.3, 1] }}><Newspaper issue={issue} top={56} /></motion.div></motion.div>;
}
