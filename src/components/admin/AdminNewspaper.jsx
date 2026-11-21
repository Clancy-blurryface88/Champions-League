import React from "react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/api/supabase";
import { NewspaperOverlay, NAME } from "@/components/newspaper/Newspaper";

// "מבט לאלופות" in the admin (22.11.2026): every issue — built by itself once a night is all calculated —
// with its state. Preview it exactly as the participants will see it, build it again, and publish it:
// at 08:00 the morning after (the default) or right now. Nothing reaches the participants before "publish".
// A rehearsal (a past night, built on demand) is never shown to the participants.
const STATE = { generating: ["בהכנה…", "#facc15"], draft: ["טיוטה — מחכה לאישור", "#60a5fa"], published: ["פורסם", "#22c55e"], error: ["שגיאה", "#f87171"] };
const fmt = (d) => (d ? new Date(d).toLocaleString("he-IL", { weekday: "long", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" }) : "");
// 08:00 Israel on the day after the night
const morningAfter = (date) => { for (const h of [5, 6]) { const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); d.setUTCHours(h); if (d.toLocaleTimeString("en-GB", { timeZone: "Asia/Jerusalem", hour: "2-digit" }).startsWith("08")) return d.toISOString(); } return null; };

export default function AdminNewspaper() {
  const [issues, setIssues] = React.useState([]);
  const [open, setOpen] = React.useState(null);
  const [busy, setBusy] = React.useState("");
  const [date, setDate] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const load = React.useCallback(async () => {
    const { data } = await supabase.from("newspaper_issues").select("*").order("night_date", { ascending: false }).limit(12);
    setIssues(data || []);
  }, []);
  React.useEffect(() => { load(); }, [load]);
  // while something is being built, look again every 10 seconds
  React.useEffect(() => { if (!issues.some((i) => i.status === "generating")) return; const t = setInterval(load, 10000); return () => clearInterval(t); }, [issues, load]);

  const generate = async (d, rehearsal) => {
    setBusy(d); setMsg("בונה את הגיליון — הנתונים ואז הכתיבה (בערך דקה-שתיים)…");
    try {
      const { data } = await supabase.auth.getSession();
      const r = await fetch(`/api/football?source=newspaper&action=generate&date=${d}${rehearsal ? "&rehearsal=1" : ""}`, { headers: { Authorization: `Bearer ${data.session?.access_token || ""}` } });
      const j = await r.json().catch(() => ({}));
      setMsg(r.ok ? "הגיליון מוכן לתצוגה מקדימה ✓" : `נכשל: ${j.error || r.status}`);
    } catch (e) { setMsg(`נכשל: ${e.message}`); }
    setBusy(""); load();
  };
  const publish = async (i, now) => {
    const at = now ? new Date().toISOString() : (morningAfter(i.night_date) || new Date().toISOString());
    await supabase.from("newspaper_issues").update({ status: "published", publish_at: at, published_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", i.id);
    load();
  };
  const unpublish = async (i) => { await supabase.from("newspaper_issues").update({ status: "draft", published_at: null }).eq("id", i.id); load(); };

  return (
    <div dir="rtl" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white">
      <div className="flex items-center justify-between"><h3 className="text-lg font-black">📰 {NAME}</h3><button type="button" onClick={load} className="text-xs text-slate-400">רענון</button></div>
      <p className="mt-1 text-xs text-slate-400">הגיליון נבנה לבד כשכל משחקי הערב מחושבים. הוא מגיע לכאן כטיוטה, ורק אחרי "פרסם" המשתתפים רואים אותו (ב־08:00 בבוקר שאחרי, או מיד).</p>
      <div className="mt-3 grid gap-2">
        {issues.map((i) => { const [label, col] = STATE[i.status] || [i.status, "#94a3b8"]; return (
          <div key={i.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex flex-wrap items-center gap-2">
              <b>ערב {i.facts?.day || ""} {i.facts?.dm || i.night_date}</b>
              <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: `${col}22`, color: col }}>{label}</span>
              {i.rehearsal && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">חזרה גנרלית — לא יוצג למשתתפים</span>}
              {i.kind === "round" && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">סיכום מחזור</span>}
            </div>
            {i.texts?.headline && <div className="mt-1 text-sm">"{i.texts.headline}"</div>}
            {i.status === "published" && <div className="mt-1 text-xs text-slate-400">מוצג מ־{fmt(i.publish_at)}</div>}
            {i.error && <div className="mt-1 text-xs text-red-300">{i.error}</div>}
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
              {i.facts && i.texts && <button type="button" onClick={() => setOpen(i)} className="rounded-lg bg-amber-400 px-3 py-1.5 text-black">תצוגה מקדימה</button>}
              {i.status === "draft" && !i.rehearsal && <><button type="button" onClick={() => publish(i, false)} className="rounded-lg bg-green-600 px-3 py-1.5">פרסם ב־08:00 בבוקר</button><button type="button" onClick={() => publish(i, true)} className="rounded-lg bg-green-900 px-3 py-1.5">פרסם עכשיו</button></>}
              {i.status === "published" && <button type="button" onClick={() => unpublish(i)} className="rounded-lg bg-white/10 px-3 py-1.5">בטל פרסום</button>}
              {i.status !== "generating" && <button type="button" disabled={!!busy} onClick={() => generate(i.night_date, i.rehearsal)} className="rounded-lg bg-white/10 px-3 py-1.5 disabled:opacity-40">{busy === i.night_date ? "בונה…" : "כתוב מחדש"}</button>}
            </div>
          </div>); })}
        {!issues.length && <div className="text-sm text-slate-400">עדיין אין גיליונות.</div>}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400">חזרה גנרלית על ערב שעבר:</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg bg-white/10 px-2 py-1 text-white" />
        <button type="button" disabled={!date || !!busy} onClick={() => generate(date, true)} className="rounded-lg bg-white/10 px-3 py-1.5 font-bold disabled:opacity-40">בנה גיליון לבדיקה</button>
      </div>
      {msg && <div className="mt-2 text-xs text-amber-300">{msg}</div>}
      <AnimatePresence>{open && <NewspaperOverlay issue={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}
