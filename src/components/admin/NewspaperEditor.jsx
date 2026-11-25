import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { motion } from "framer-motion";
import { supabase } from "@/api/supabase";
import { NAME, NewspaperOverlay, BlankPage, PARTS, cleanHtml, layoutPages, pageElement, useNewspaperFonts } from "@/components/newspaper/Newspaper";

// Editing an issue by hand (25.11.2026, admin only), on the page itself: tap any text and type; tap any part to select
// it and move, copy, cut, delete or restyle it, or add a part or a column after it; and above, the issue's pages — add,
// copy, remove, bring back, reorder. A page that was touched is kept as it looks (texts.layout, see Newspaper.jsx); the
// others go on being drawn from the facts. Saving changes the issue only; publishing stays a separate button.
const INK = "#1a1410", RED = "#b3261e", GREEN = "#166534";
const PAPER_BG = "radial-gradient(140% 100% at 50% 40%, #f3f0e8 55%, #e2dccd)";
const uid = () => `custom-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

// the html of a React element, drawn off screen
function htmlOf(el, inner) {
  const box = document.createElement("div"), root = createRoot(box);
  flushSync(() => root.render(el));
  const html = inner ? box.querySelector("[data-np-inner]")?.innerHTML : box.innerHTML;
  setTimeout(() => root.unmount(), 0);
  return html || "";
}
const nodeOf = (el) => { const d = document.createElement("div"); d.innerHTML = htmlOf(el); return d.firstElementChild; };
const thin = (n) => n && n.tagName === "DIV" && !n.textContent.trim() && !n.children.length; // a column's dividing line
const tokens = (n) => (n?.style?.gridTemplateColumns || "").split(/\s+/).filter(Boolean);
const isCols = (n) => { const k = tokens(n); return k.length > 1 && k.length === n.children.length; };
const isInline = (n) => ["inline", "contents"].includes(getComputedStyle(n).display);

const Btn = ({ onClick, children, on, danger, disabled, title }) => (
  <button type="button" title={title} disabled={disabled} onPointerDown={(e) => e.preventDefault()} onClick={onClick}
    className="shrink-0 rounded-lg px-2.5 py-1.5 text-[13px] font-bold disabled:opacity-30"
    style={{ background: on ? "#fbbf24" : danger ? "rgba(220,38,38,.85)" : "rgba(255,255,255,.12)", color: on ? "#1a1405" : "#fff", whiteSpace: "nowrap" }}>{children}</button>
);

export default function NewspaperEditor({ issue, onClose, onSaved }) {
  useNewspaperFonts();
  const h = 660;
  const originals = React.useMemo(() => layoutPages(issue, h, { pages: [] }), [issue]);
  const [pages, setPages] = React.useState(() => layoutPages(issue, h).map(({ id, name, teaser, html, el }) => ({ id, name, teaser, html, el })));
  const [cur, setCur] = React.useState(0);
  const [sel, setSel] = React.useState(null); // the selected element
  const [box, setBox] = React.useState(null); // its place on screen
  const [clip, setClip] = React.useState(null); // a cut or copied part
  const [menu, setMenu] = React.useState(""); // "add" | "page"
  const [dirty, setDirty] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [tall, setTall] = React.useState(0);
  const [preview, setPreview] = React.useState(null);
  const [steps, setSteps] = React.useState(0);
  const root = React.useRef(null), scroller = React.useRef(null), undo = React.useRef([]), typing = React.useRef(0);
  const page = pages[cur];

  // the page on the table
  const htmlNow = (x, i, list) => x.html ?? htmlOf(pageElement(x, i, list, h), true);
  React.useEffect(() => {
    if (!root.current || !page) return undefined;
    // after React is done: drawing a page off screen cannot run inside an effect
    const t = setTimeout(() => {
    root.current.innerHTML = cleanHtml(htmlNow(page, cur, pages));
    // numbers of the place it has now
    root.current.querySelectorAll("[data-np=no]").forEach((e) => { e.textContent = cur + 1; });
    root.current.querySelectorAll("[data-np=next]").forEach((e) => { e.textContent = cur + 2; });
    root.current.querySelectorAll("[data-np=foot]").forEach((e) => { const nx = pages[cur + 1]?.teaser; e.textContent = nx ? `בעמוד ${cur + 2}: ${nx} ←` : ""; });
    undo.current = []; setSteps(0); setSel(null); measure();
    }, 0);
    return () => clearTimeout(t);
  }, [page?.id, cur, pages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const measure = () => setTimeout(() => { if (root.current) setTall(Math.max(0, Math.round((root.current.scrollHeight / h - 1) * 100))); }, 60);
  const place = React.useCallback(() => {
    if (!sel || !root.current?.contains(sel)) { setBox(null); return; }
    const a = sel.getBoundingClientRect(), b = scroller.current.getBoundingClientRect();
    setBox({ top: a.top - b.top + scroller.current.scrollTop, left: a.left - b.left + scroller.current.scrollLeft, width: a.width, height: a.height });
  }, [sel]);
  React.useLayoutEffect(() => { place(); }, [place, steps]);
  React.useEffect(() => { window.addEventListener("resize", place); return () => window.removeEventListener("resize", place); }, [place]);

  // remember what there was, before a change
  const remember = () => { undo.current.push(root.current.innerHTML); if (undo.current.length > 60) undo.current.shift(); };
  const store = () => {
    const html = cleanHtml(root.current.innerHTML);
    setPages((L) => L.map((x, i) => (i === cur ? { ...x, html } : x)));
    setDirty(true); setMsg(""); setSteps((n) => n + 1); measure();
  };
  const change = (fn) => { remember(); fn(); store(); };
  const back = () => { const prev = undo.current.pop(); if (prev == null) return; root.current.innerHTML = prev; setSel(null); store(); };

  // typing: one undo step per pause; a page number typed over stops being automatic
  const beforeInput = () => {
    if (Date.now() - typing.current > 900) remember();
    typing.current = Date.now();
    const at = document.getSelection()?.anchorNode; const host = at && (at.nodeType === 1 ? at : at.parentElement)?.closest?.("[data-np]");
    if (host && root.current.contains(host)) host.removeAttribute("data-np");
  };
  const paste = (e) => { e.preventDefault(); document.execCommand("insertText", false, e.clipboardData.getData("text/plain")); };

  const pickAt = (e) => {
    let n = e.target; if (!root.current.contains(n) || n === root.current) { setSel(null); return; }
    while (n !== root.current && n.parentElement !== root.current && (isInline(n) || ["IMG", "svg", "path", "circle", "line", "g", "B"].includes(n.tagName))) n = n.parentElement;
    setSel(n === root.current ? null : n);
  };

  // the parts
  const kin = (n, d) => { let x = d < 0 ? n.previousElementSibling : n.nextElementSibling; if (isCols(n.parentElement)) while (x && thin(x)) x = d < 0 ? x.previousElementSibling : x.nextElementSibling; return x; };
  const move = (d) => { const o = kin(sel, d); if (!o) return; change(() => {
    if (isCols(sel.parentElement)) { // columns change places (their widths with them)
      const P = sel.parentElement, k = tokens(P), K = [...P.children], i = K.indexOf(sel), j = K.indexOf(o);
      [k[i], k[j]] = [k[j], k[i]]; P.style.gridTemplateColumns = k.join(" ");
      const mark = document.createElement("i"); sel.replaceWith(mark); o.replaceWith(sel); mark.replaceWith(o);
    } else if (d < 0) o.before(sel); else o.after(sel);
  }); };
  const drop = (n) => {
    const P = n.parentElement;
    if (isCols(P)) {
      const K = [...P.children], i = K.indexOf(n), k = tokens(P), line = thin(K[i + 1]) ? i + 1 : thin(K[i - 1]) ? i - 1 : -1;
      const out = [i, line].filter((x) => x >= 0);
      P.style.gridTemplateColumns = k.filter((_, x) => !out.includes(x)).map((x, _, a) => (a.length === 1 ? "1fr" : x)).join(" ");
      out.map((x) => K[x]).forEach((x) => x.remove());
    } else n.remove();
  };
  const remove = () => change(() => { const n = sel; setSel(null); drop(n); });
  const cut = () => { setClip(sel.outerHTML); remove(); };
  const fresh = (html) => { const d = document.createElement("div"); d.innerHTML = cleanHtml(html); return d.firstElementChild; };
  // a new part goes after the selected one (after the whole column row if a column is selected), else before the page's foot
  const put = (n) => change(() => {
    if (!n) return;
    const foot = [...root.current.children].find((x) => x.style.marginTop === "auto");
    if (sel && sel !== foot) { if (isCols(sel.parentElement) && !thin(sel)) sel.append(n); else sel.after(n); }
    else if (foot) foot.before(n); else root.current.append(n);
    setSel(n); setMenu("");
  });
  const dup = () => put2(fresh(sel.outerHTML));
  const put2 = (n) => change(() => { if (isCols(sel.parentElement)) { const P = sel.parentElement; P.style.gridTemplateColumns = [...tokens(P), "1px", "1fr"].join(" "); P.append(nodeOf(PARTS.vline()), n); } else sel.after(n); setSel(n); });
  // a column: in the row the selected part stands in, or the part becomes a row of two
  const addCol = () => change(() => {
    let P = sel; while (P && P !== root.current && !isCols(P)) P = P.parentElement;
    const col = nodeOf(PARTS.col()), line = nodeOf(PARTS.vline());
    if (P && P !== root.current) { P.style.gridTemplateColumns = [...tokens(P), "1px", "1fr"].join(" "); P.append(line, col); }
    else { const row = document.createElement("div"); row.className = "grid"; row.style.cssText = "grid-template-columns: 1fr 1px 1fr; gap: 10px;"; sel.before(row); const one = document.createElement("div"); one.append(sel); row.append(one, line, col); }
    setSel(col); setMenu("");
  });
  const colOf = () => { let n = sel; while (n && n !== root.current && !isCols(n.parentElement)) n = n.parentElement; return n && n !== root.current ? n : null; };
  const removeCol = () => { const c = colOf(); if (c) change(() => { setSel(null); drop(c); }); };
  // a column wider or narrower
  const widen = (d) => { const c = colOf(); if (!c) return; change(() => {
    const P = c.parentElement, K = [...P.children], k = tokens(P).map((x, i) => (thin(K[i]) ? x : `${Math.max(0.3, (/fr$/.test(x) ? parseFloat(x) : K[i].offsetWidth / 110)).toFixed(2)}fr`)), i = K.indexOf(c);
    k[i] = `${Math.max(0.3, parseFloat(k[i]) + d).toFixed(2)}fr`; P.style.gridTemplateColumns = k.join(" ");
  }); };
  // the look
  const size = (d) => change(() => [sel, ...sel.querySelectorAll("*")].forEach((n) => { if (n === sel || n.style?.fontSize) n.style.fontSize = `${Math.max(7, parseFloat(getComputedStyle(n).fontSize) + d).toFixed(1)}px`; }));
  const bold = () => { const s = document.getSelection(); if (s && !s.isCollapsed && root.current.contains(s.anchorNode)) { change(() => document.execCommand("bold")); return; } change(() => { sel.style.fontWeight = Number(getComputedStyle(sel).fontWeight) >= 700 ? 400 : 900; }); };
  const align = () => change(() => { const L = ["right", "center", "left", "justify"]; sel.style.textAlign = L[(L.indexOf(getComputedStyle(sel).textAlign.replace("start", "right")) + 1) % 4]; });
  const color = () => change(() => { const L = [INK, RED, GREEN], rgb = (c) => { const d = document.createElement("i"); d.style.color = c; return d.style.color; }; sel.style.color = L[(L.findIndex((c) => rgb(c) === getComputedStyle(sel).color) + 1) % 3]; });
  const textCols = () => change(() => { const n = (Number(sel.style.columnCount) || 1) % 3 + 1; sel.style.columnCount = n; sel.style.columnGap = "10px"; sel.style.columnRule = n > 1 ? `1px solid ${INK}44` : ""; });
  const gap = (d) => change(() => { sel.style.marginTop = `${Math.max(0, (parseFloat(getComputedStyle(sel).marginTop) || 0) + d)}px`; });

  // the pages
  const pagesTo = (L, at) => { setPages(L); setCur(Math.max(0, Math.min(at, L.length - 1))); setSel(null); setMenu(""); setDirty(true); setMsg(""); };
  const newPage = () => { const id = uid(), name = "דף חדש"; const L = [...pages]; L.splice(cur + 1, 0, { id, name, teaser: name, html: htmlOf(<BlankPage no={cur + 2} name={name} issue={issue} />) }); pagesTo(L, cur + 1); };
  const copyPage = () => { const L = [...pages]; const x = { ...page, id: uid(), name: `${page.name} (עותק)`, teaser: `${page.teaser || page.name}`, html: cleanHtml(root.current.innerHTML), el: undefined }; L.splice(cur + 1, 0, x); pagesTo(L, cur + 1); };
  const movePage = (d) => { const j = cur + d; if (j < 0 || j >= pages.length) return; const L = [...pages]; [L[cur], L[j]] = [L[j], L[cur]]; pagesTo(L, j); };
  const dropPage = () => { if (pages.length < 2 || !window.confirm(`להסיר את הדף "${page.name}"? דף מקורי אפשר להחזיר מ"＋ דף".`)) return; pagesTo(pages.filter((_, i) => i !== cur), Math.max(0, cur - 1)); };
  const bringBack = (o) => { const L = [...pages]; L.splice(cur + 1, 0, { id: o.id, name: o.name, teaser: o.teaser, el: o.el }); pagesTo(L, cur + 1); };
  const reset = () => { const o = originals.find((x) => x.id === page.id); if (!o || !window.confirm("להחזיר את הדף למקור? העריכות שלו יימחקו.")) return; const L = pages.map((x, i) => (i === cur ? { id: o.id, name: o.name, teaser: o.teaser, el: o.el } : x)); setPages(L); root.current.innerHTML = cleanHtml(htmlNow(L[cur], cur, L)); undo.current = []; setSel(null); setDirty(true); setSteps((n) => n + 1); measure(); };
  const rename = (name) => { setPages((L) => L.map((x, i) => (i === cur ? { ...x, name, teaser: name, named: true } : x))); setDirty(true); };
  const gone = originals.filter((o) => !pages.some((x) => x.id === o.id));

  // what is kept: only what differs from the automatic page
  const layout = () => ({ pages: pages.map((x) => { const o = originals.find((a) => a.id === x.id); return { id: x.id, ...(x.html != null ? { html: x.html } : {}), ...(!o || x.name !== o.name ? { name: x.name } : {}) }; }) });
  const texts = () => {
    const t = { ...issue.texts, layout: layout() };
    const front = pages.find((x) => x.id === "front")?.html; // the headline is also on the home screen's button
    if (front) { const d = document.createElement("div"); d.innerHTML = cleanHtml(front); const head = d.querySelector("[data-np-text=headline]")?.textContent.trim(); if (head) t.headline = head; }
    return t;
  };
  const save = async () => {
    setMsg("שומר…");
    const { data, error } = await supabase.from("newspaper_issues").update({ texts: texts(), updated_at: new Date().toISOString() }).eq("id", issue.id).select("id");
    if (error || !data?.length) { setMsg(`לא נשמר: ${error?.message || "אין הרשאה"}`); return; }
    setDirty(false); setMsg("נשמר ✓"); onSaved?.();
  };
  const close = () => { if (!dirty || window.confirm("יש שינויים שלא נשמרו. לצאת בלי לשמור?")) onClose(); };

  const c = sel && root.current?.contains(sel) ? colOf() : null;
  return (
    <motion.div dir="rtl" className="fixed inset-0 flex flex-col text-white" style={{ zIndex: 85, background: "#0a1020", paddingTop: "env(safe-area-inset-top)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center gap-2 px-3 py-2">
        <Btn onClick={close}>✕</Btn><b className="flex-1 truncate text-sm">עריכת {NAME} · {issue.facts?.dm || issue.night_date}</b>
        {msg && <span className="text-xs text-amber-300">{msg}</span>}
        <Btn onClick={back} disabled={!undo.current.length} title="ביטול הפעולה האחרונה">↶</Btn><Btn onClick={() => setPreview({ ...issue, texts: texts() })}>תצוגה</Btn><Btn on={dirty} onClick={save} disabled={!dirty}>שמירה</Btn>
      </div>
      <div className="flex gap-1.5 overflow-x-auto px-3 pb-1.5" style={{ scrollbarWidth: "none" }}>
        {pages.map((x, i) => <Btn key={x.id} on={i === cur} onClick={() => { setCur(i); setMenu(""); }}>{i + 1} · {x.name}{x.html != null && " ✎"}</Btn>)}
        <Btn onClick={() => setMenu(menu === "page" ? "" : "page")}>＋ דף</Btn>
      </div>
      <div className="flex gap-1.5 overflow-x-auto px-3 pb-2" style={{ scrollbarWidth: "none" }}>
        <input value={page?.name || ""} onChange={(e) => rename(e.target.value)} aria-label="שם הדף" className="w-32 shrink-0 rounded-lg px-2 text-[13px] text-white" style={{ background: "rgba(255,255,255,.12)" }} />
        <Btn onClick={() => movePage(-1)} disabled={!cur}>→ הקדם</Btn><Btn onClick={() => movePage(1)} disabled={cur === pages.length - 1}>אחר ←</Btn><Btn onClick={copyPage}>שכפל דף</Btn>
        {page?.html != null && originals.some((o) => o.id === page.id) && <Btn onClick={reset}>החזר למקור</Btn>}<Btn danger onClick={dropPage} disabled={pages.length < 2}>הסר דף</Btn>
      </div>
      {menu === "page" && <div className="flex flex-wrap gap-1.5 px-3 pb-2"><Btn onClick={newPage}>דף ריק</Btn>{gone.map((o) => <Btn key={o.id} onClick={() => bringBack(o)}>החזר: {o.name}</Btn>)}{!gone.length && <span className="self-center text-xs text-slate-400">אין דפים שהוסרו</span>}</div>}
      <div ref={scroller} className="relative flex-1 overflow-auto" style={{ background: "#060a16", padding: "14px 12px 30px" }} onClick={(e) => { if (e.target === scroller.current) setSel(null); }}>
        <div style={{ width: "min(390px, 100%)", margin: "0 auto", position: "relative" }}>
          <div dir="rtl" ref={root} contentEditable suppressContentEditableWarning spellCheck={false} className="flex flex-col outline-none" onClick={pickAt} onKeyUp={place} onBeforeInput={beforeInput} onInput={store} onPaste={paste} onDrop={(e) => e.preventDefault()}
            style={{ minHeight: h, padding: "12px 12px 10px", background: PAPER_BG, color: INK }} />
          {tall > 0 && <div className="pointer-events-none absolute inset-x-0 text-center text-[11px] font-bold" style={{ top: h, borderTop: "2px dashed #dc2626", color: "#dc2626" }}>כאן נגמר מסך רגיל. הדף ארוך ב־{tall}% ויוקטן כדי להיכנס</div>}
        </div>
        {box && <div className="pointer-events-none absolute" style={{ ...box, outline: "2px solid #2563eb", outlineOffset: 2, background: "rgba(37,99,235,.07)" }} />}
      </div>
      <div style={{ background: "#0f1830", borderTop: "1px solid rgba(255,255,255,.15)", paddingBottom: "calc(env(safe-area-inset-bottom) + 6px)" }}>
        {menu === "add" && <div className="flex gap-1.5 overflow-x-auto px-3 pt-2" style={{ scrollbarWidth: "none" }}>{[["title", "כותרת"], ["text", "פסקה"], ["kick", "כותרת קטנה"], ["rule", "קו מפריד"], ["box", "מסגרת"]].map(([k, l]) => <Btn key={k} onClick={() => put(nodeOf(PARTS[k]()))}>{l}</Btn>)}<Btn onClick={addCol} disabled={!sel}>עמודה</Btn>{clip && <Btn on onClick={() => put(fresh(clip))}>הדבק</Btn>}</div>}
        <div className="flex gap-1.5 overflow-x-auto px-3 pt-2" style={{ scrollbarWidth: "none" }}>
          <Btn on={menu === "add"} onClick={() => setMenu(menu === "add" ? "" : "add")}>＋ הוסף</Btn>
          {sel ? <>
            <Btn onClick={() => { const n = sel.parentElement; if (n && n !== root.current) setSel(n); }} disabled={sel.parentElement === root.current}>אזור גדול יותר</Btn>
            <Btn onClick={() => move(-1)} disabled={!kin(sel, -1)}>▲</Btn><Btn onClick={() => move(1)} disabled={!kin(sel, 1)}>▼</Btn>
            <Btn onClick={dup}>שכפל</Btn><Btn onClick={cut}>גזור</Btn>{clip && <Btn on onClick={() => put(fresh(clip))}>הדבק</Btn>}<Btn danger onClick={remove}>מחק</Btn>
          </> : <span className="self-center text-xs text-slate-400">לחיצה על טקסט כדי לערוך, או על אזור כדי לסדר אותו</span>}
        </div>
        {sel && <div className="flex gap-1.5 overflow-x-auto px-3 pt-1.5" style={{ scrollbarWidth: "none" }}>
          <Btn onClick={() => size(1)}>א+</Btn><Btn onClick={() => size(-1)}>א−</Btn><Btn onClick={bold}><b>מודגש</b></Btn><Btn onClick={align}>יישור</Btn><Btn onClick={color}>צבע</Btn><Btn onClick={textCols}>עמודות טקסט</Btn><Btn onClick={() => gap(4)}>רווח +</Btn><Btn onClick={() => gap(-4)}>רווח −</Btn>
          <Btn onClick={addCol}>＋ עמודה</Btn>{c && <><Btn onClick={() => widen(0.2)}>עמודה רחבה</Btn><Btn onClick={() => widen(-0.2)}>עמודה צרה</Btn><Btn danger onClick={removeCol}>הסר עמודה</Btn></>}
        </div>}
      </div>
      {preview && <NewspaperOverlay issue={preview} onClose={() => setPreview(null)} />}
    </motion.div>
  );
}
