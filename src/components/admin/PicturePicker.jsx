import React from "react";
import { supabase } from "@/api/supabase";
import { UploadFile } from "@/api/functions";

// The newspaper editor's pictures (26.11.2026): what belongs to this issue first — the players of a chosen match (UEFA's
// portraits, its scorers first) and the crests — then the app's own pictures, what was uploaded before, and an upload
// (made smaller before it is sent). onPick({ src, ratio, caption, kind }) — kind "crest" is printed plain, without dots.
const APP = [["/champions/ch-trophy.webp", "הגביע"], ["/champions/ch-logo.png", "לוגו"], ["/champions/round-ball.png", "כדור"], ["/champions/arena-stadium.png", "אצטדיון"], ["/champions/match-card-bg-2.webp", "רקע 1"], ["/champions/match-card-bg-3.webp", "רקע 2"], ["/champions/trophy-marquee.png", "גביע 2"], ["/hall-of-fame/champions-league.png", "היכל התהילה"]];
const FOLDER = "newspaper";
const plain = (s = "") => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ø/g, "o").replace(/ł/g, "l").toLowerCase();
const last = (s) => plain(s).replace(/\(.*\)/, "").trim().split(/[\s.]+/).pop();

const sizeOf = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i.naturalWidth / i.naturalHeight || 1); i.onerror = () => ok(null); i.src = src; });

// at most 1200px on the long side; a png keeps its transparency
async function smaller(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error("סוג התמונה לא נתמך")); i.src = url; });
    const k = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight)), png = file.type === "image/png";
    const cv = document.createElement("canvas"); cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
    cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
    const blob = await new Promise((ok) => cv.toBlob(ok, png ? "image/png" : "image/jpeg", 0.82));
    if (!blob) throw new Error("התמונה לא נקראה");
    return new File([blob], png ? "picture.png" : "picture.jpg", { type: blob.type });
  } finally { URL.revokeObjectURL(url); }
}

const Chip = ({ on, onClick, children }) => <button type="button" onClick={onClick} className="shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-bold" style={{ background: on ? "#fbbf24" : "rgba(255,255,255,.12)", color: on ? "#1a1405" : "#fff", whiteSpace: "nowrap" }}>{children}</button>;
function Tile({ src, label, mark, fit = "contain", onClick }) {
  const [gone, setGone] = React.useState(false);
  if (gone) return null;
  return <button type="button" onClick={onClick} className="rounded-lg p-1.5 text-center text-white" style={{ background: "rgba(255,255,255,.08)", border: `1px solid ${mark ? "#fbbf24" : "rgba(255,255,255,.12)"}` }}>
    <img src={src} alt="" loading="lazy" onError={() => setGone(true)} style={{ width: "100%", aspectRatio: "1", objectFit: fit, objectPosition: "top", borderRadius: 6 }} /><div className="mt-1 truncate text-[11px]">{label}</div></button>;
}

export default function PicturePicker({ issue, onPick, onClose }) {
  const f = issue.facts || {}, he = issue.texts?.scorers || {};
  const matches = React.useMemo(() => f.matches || [], [f.matches]);
  const [tab, setTab] = React.useState("players");
  const [mid, setMid] = React.useState(() => matches.find((m) => m.id === issue.texts?.photoMatch)?.id || matches[0]?.id);
  const [players, setPlayers] = React.useState({}); // by match: list | "none"
  const [mine, setMine] = React.useState(null);
  const [busy, setBusy] = React.useState(""), file = React.useRef(null);
  const m = matches.find((x) => x.id === mid);

  React.useEffect(() => {
    if (tab !== "players" || !m || players[m.id]) return;
    fetch(`/api/uefa-lineups?homeTeam=${encodeURIComponent(m.a.en)}&awayTeam=${encodeURIComponent(m.b.en)}`).then((r) => r.json()).then(({ lineups: L }) => {
      const all = ["homeTeam", "awayTeam"].flatMap((k) => [...(L?.[k]?.field || []), ...(L?.[k]?.bench || [])].map((x) => x.player).filter((p) => p?.imageUrl));
      const goals = (m.goals || []).map((g) => g.scorer).filter(Boolean);
      const list = all.map((p) => { const g = goals.find((s) => last(s) && last(s) === last(p.internationalName)); return { src: p.imageUrl, name: g ? he[g] || p.internationalName : p.internationalName, goal: !!g }; });
      setPlayers((S) => ({ ...S, [m.id]: list.length ? list.sort((a, b) => b.goal - a.goal) : "none" }));
    }).catch(() => setPlayers((S) => ({ ...S, [m.id]: "none" })));
  }, [tab, m?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMine = async () => {
    const { data } = await supabase.storage.from("uploads").list(FOLDER, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    setMine((data || []).filter((x) => x.id).map((x) => supabase.storage.from("uploads").getPublicUrl(`${FOLDER}/${x.name}`).data.publicUrl));
  };
  React.useEffect(() => { if (tab === "mine" && !mine) loadMine().catch(() => setMine([])); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = async (src, kind, caption = "") => {
    setBusy("טוען…");
    const ratio = await sizeOf(src);
    if (!ratio) { setBusy("התמונה לא נטענה"); return; }
    onPick({ src, ratio, kind, caption });
  };
  const upload = async (e) => {
    const x = e.target.files?.[0]; e.target.value = "";
    if (!x) return;
    setBusy("מעלה…");
    try { const { file_url } = await UploadFile({ file: await smaller(x), folder: FOLDER }); setMine(null); await pick(file_url, "photo"); } catch (err) { setBusy(`לא עלה: ${err.message}`); }
  };
  const crests = [...new Map([...matches, ...(f.tonight?.matches || [])].flatMap((x) => [x.a, x.b]).filter((t) => t?.logo).map((t) => [t.logo, t])).values()];
  const list = m && players[m.id];
  const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 8 };
  return (
    <div dir="rtl" className="fixed inset-0 flex flex-col text-white" style={{ zIndex: 88, background: "#0a1020", padding: "calc(env(safe-area-inset-top) + 10px) 12px calc(env(safe-area-inset-bottom) + 10px)" }}>
      <div className="flex items-center gap-2 pb-2"><Chip onClick={onClose}>✕</Chip><b className="flex-1">בחירת תמונה</b>{busy && <span className="text-xs text-amber-300">{busy}</span>}<Chip on onClick={() => file.current?.click()}>⬆ העלאה</Chip><input ref={file} type="file" accept="image/*" hidden onChange={upload} /></div>
      <div className="flex gap-1.5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>{[["players", "שחקנים"], ["crests", "סמלי קבוצות"], ["app", "האפליקציה"], ["mine", "שהעליתי"]].map(([k, l]) => <Chip key={k} on={tab === k} onClick={() => setTab(k)}>{l}</Chip>)}</div>
      {tab === "players" && <div className="flex gap-1.5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>{matches.map((x) => <Chip key={x.id} on={x.id === mid} onClick={() => setMid(x.id)}>{x.a.he}–{x.b.he}</Chip>)}</div>}
      <div className="flex-1 overflow-auto">
        {tab === "players" && (!list ? <p className="py-8 text-center text-sm text-slate-400">{m ? "טוען שחקנים…" : "אין משחקים בגיליון"}</p> : list === "none" ? <p className="py-8 text-center text-sm text-slate-400">אין תמונות שחקנים למשחק הזה</p>
          : <><p className="pb-2 text-xs text-slate-400">במסגרת צהובה: מי שכבש במשחק</p><div style={grid}>{list.map((p) => <Tile key={p.src} src={p.src} label={p.name} mark={p.goal} fit="cover" onClick={() => pick(p.src, "player", p.name)} />)}</div></>)}
        {tab === "crests" && <div style={grid}>{crests.map((t) => <Tile key={t.logo} src={t.logo} label={t.he} onClick={() => pick(t.logo, "crest")} />)}</div>}
        {tab === "app" && <div style={grid}>{APP.map(([src, l]) => <Tile key={src} src={src} label={l} onClick={() => pick(src, /logo|ball|trophy|hall/.test(src) ? "crest" : "photo")} />)}</div>}
        {tab === "mine" && (!mine ? <p className="py-8 text-center text-sm text-slate-400">טוען…</p> : !mine.length ? <p className="py-8 text-center text-sm text-slate-400">עוד לא העלית תמונות</p> : <div style={grid}>{mine.map((src) => <Tile key={src} src={src} label="" fit="cover" onClick={() => pick(src, "photo")} />)}</div>)}
      </div>
    </div>
  );
}
