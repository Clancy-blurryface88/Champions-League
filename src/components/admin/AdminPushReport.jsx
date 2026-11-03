import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/api/supabase";

// Push report: every push sent (push_log, written by api/_goalWebhook.js push()),
// who it went to and who opened it (push_opens, written by the app on a ?pn= visit),
// plus the coming round's predictions and which reminder each participant got.

const box = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" };
const TZ = "Asia/Jerusalem";
const fmt = (iso) => iso ? new Intl.DateTimeFormat("he-IL", { timeZone: TZ, weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)) : "";
const ilDate = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
const UUID_TAIL = /:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// what kind of push a key is (see api/_reminders.js, api/_goalWebhook.js, api/_adminPush.js)
const KIND = [
  [/^rem:twodays:/, "📅 מחזור חדש (יומיים לפני)"], [/^rem:daybefore:/, "⏰ יום לפני"], [/^rem:first:/, "⏰ תזכורת לפני הערב"],
  [/^rem:slot:/, "📋 הרכבים / משבצת"], [/^goal:/, "⚽ גול"], [/^fix:/, "🖥️ VAR"], [/^night:/, "🏁 סוף ערב"],
  [/^round-summary:/, "🏆 סיכום מחזור"], [/^manual:/, "✍️ ידני"],
  [/^auto:test:/, "🤖 סגירה אוטומטית · בדיקה למנהלים"], [/^auto:/, "🤖 סגירה אוטומטית (למנהלים)"],
];
// a device that isn't subscribed to pushes is not a send failure
const notLinked = (e) => e === "not linked" || /not subscribed/i.test(e || "");
const kindOf = (key) => KIND.find(([re]) => re.test(key))?.[1] || key.split(":")[0];

export default function AdminPushReport() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [days, setDays] = useState(7);
  const [busy, setBusy] = useState(false);
  const [loadedAt, setLoadedAt] = useState(null);

  const load = async () => {
    setError("");
    setBusy(true);
    const since = new Date(Date.now() - days * 864e5).toISOString();
    const [logs, opens, profiles, rounds] = await Promise.all([
      supabase.from("push_log").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(1000),
      supabase.from("push_opens").select("log_id,user_id,opened_at").gte("opened_at", since),
      supabase.from("profiles").select("id,display_name"),
      supabase.from("rounds").select("id,name,order").order("order"),
    ]);
    setBusy(false);
    const err = logs.error || opens.error;
    if (err) { setError(err.message); setData(null); return; }
    setData({ logs: logs.data, opens: opens.data, people: profiles.data || [], rounds: rounds.data || [] });
    setLoadedAt(new Date());
  };
  useEffect(() => { load(); }, [days]);

  const name = (id) => data?.people.find((p) => p.id === id)?.display_name?.trim() || "—";

  // personal pushes (one row per participant) grouped back into one send
  const sends = useMemo(() => {
    if (!data) return [];
    const opensBy = {};
    data.opens.forEach((o) => { (opensBy[o.log_id] ||= []).push(o); });
    const groups = new Map();
    data.logs.forEach((l) => {
      const base = l.user_id ? l.key.replace(UUID_TAIL, "") : l.key;
      const g = groups.get(base) || { base, key: l.key, kind: kindOf(l.key), heading: l.heading, when: l.send_after || l.created_at, rows: [] };
      g.rows.push({ ...l, opens: opensBy[l.id] || [] });
      groups.set(base, g);
    });
    return [...groups.values()].sort((a, b) => new Date(b.when) - new Date(a.when));
  }, [data]);

  if (error) {
    return (
      <div className="rounded-2xl p-4 text-amber-200 text-sm" style={box} dir="rtl">
        לא הצלחתי לקרוא את יומן ההתראות: {error}
        <div className="text-slate-400 mt-1">אם הטבלאות push_log / push_opens עדיין לא נוצרו במסד, הדוח יתמלא אחרי שייווצרו.</div>
      </div>
    );
  }
  if (!data) return <div className="text-slate-400 text-sm" dir="rtl">טוען…</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <RoundStatus people={data.people} logs={data.logs} />

      <div className="rounded-2xl p-4" style={box}>
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div>
            <h3 className="text-white font-bold">📬 התראות שנשלחו</h3>
            {loadedAt && <div className="text-[11px] text-slate-500">עודכן ב-{new Intl.DateTimeFormat("he-IL", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(loadedAt)}</div>}
          </div>
          <div className="flex gap-1">
            {[1, 7, 30].map((d) => (
              <button key={d} onClick={() => setDays(d)} className={`text-xs px-2 py-1 rounded-md border ${days === d ? "bg-sky-500/20 border-sky-400/60 text-white" : "border-white/15 text-slate-400"}`}>
                {d === 1 ? "היום" : `${d} ימים`}
              </button>
            ))}
            <button onClick={load} disabled={busy} className="text-xs px-2 py-1 rounded-md border border-white/15 text-slate-300 active:scale-95 transition-transform disabled:opacity-60">{busy ? "מרענן…" : "רענון"}</button>
          </div>
        </div>
        {!sends.length && <div className="text-slate-500 text-sm">עוד לא נרשמו התראות בתקופה הזאת.</div>}
        <div className="space-y-2">
          {sends.map((g) => <SendCard key={g.base} g={g} name={name} />)}
        </div>
      </div>
    </div>
  );
}

function SendCard({ g, name }) {
  const [open, setOpen] = useState(false);
  const personal = g.rows.some((r) => r.user_id);
  const ok = g.rows.filter((r) => !r.error);
  const unlinked = g.rows.filter((r) => notLinked(r.error)).length;
  const failed = g.rows.length - ok.length - unlinked;
  const openers = g.rows.flatMap((r) => r.opens.map((o) => ({ ...o, row: r })));
  const scheduled = g.rows[0].send_after && new Date(g.rows[0].send_after) > new Date();
  return (
    <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <button onClick={() => setOpen(!open)} className="w-full text-right">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-sky-300 font-semibold">{g.kind}{g.rows[0].mode === "test" ? " · בדיקה" : ""}</span>
          <span className="text-[11px] text-slate-400">{scheduled ? "⏳ מתוזמן ל-" : ""}{fmt(g.when)}</span>
        </div>
        <div className="text-white text-sm font-semibold mt-1">{g.heading}</div>
        <div className="flex gap-3 mt-1 text-xs">
          <span className="text-emerald-300">{personal ? `📨 ${ok.length}/${g.rows.length} נשלחו${unlinked ? ` · ${unlinked} לא רשומים` : ""}${failed ? ` · ${failed} שגיאה` : ""}` : g.rows[0].error ? `⚠️ ${g.rows[0].error}` : `📨 כולם${g.rows[0].recipients != null ? ` · ${g.rows[0].recipients} מכשירים` : ""}`}</span>
          <span className="text-amber-300">👆 {openers.length} פתחו</span>
        </div>
      </button>
      {open && (
        <div className="mt-2 pt-2 border-t border-white/10 space-y-1 text-xs">
          {personal ? g.rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-2">
              <span className="text-slate-200">{name(r.user_id)}</span>
              <span className="text-slate-400 truncate flex-1 text-left" title={r.body}>{r.body}</span>
              <span className={r.error ? "text-red-300" : "text-emerald-300"}>{notLinked(r.error) ? "⚠️ לא רשום" : r.error ? `⚠️ שגיאה (${r.error})` : "✅"}</span>
              <span className="text-amber-300 w-24 text-left">{r.opens.length ? `👆 ${fmt(r.opens[0].opened_at)}` : "—"}</span>
            </div>
          )) : (
            <>
              <div className="text-slate-400">{g.rows[0].body}</div>
              {openers.length ? openers.map((o) => (
                <div key={o.user_id} className="flex justify-between"><span className="text-slate-200">{name(o.user_id)}</span><span className="text-amber-300">👆 {fmt(o.opened_at)}</span></div>
              )) : <div className="text-slate-500">אף אחד עוד לא פתח</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// The coming round: who predicted how many of each match day, and per reminder
// whether it went out to them (a reminder only goes to whoever still misses a prediction).
function RoundStatus({ people, logs }) {
  const [st, setSt] = useState(null);
  useEffect(() => {
    (async () => {
      const now = new Date().toISOString();
      const { data: next } = await supabase.from("matches").select("round_id").gte("match_date", now).order("match_date").limit(1);
      const roundId = next?.[0]?.round_id;
      if (!roundId) { setSt({ none: true }); return; }
      const [{ data: matches }, { data: round }, { data: stats }] = await Promise.all([
        supabase.from("matches").select("id,match_date").eq("round_id", roundId),
        supabase.from("rounds").select("name").eq("id", roundId).single(),
        supabase.from("user_stats").select("user_id"),
      ]);
      const { data: preds } = await supabase.from("predictions").select("user_id,match_id").in("match_id", matches.map((m) => m.id));
      setSt({ round, matches, preds: preds || [], players: (stats || []).map((s) => s.user_id) });
    })().catch(() => setSt({ none: true }));
  }, []);
  if (!st) return null;
  if (st.none) return <div className="rounded-2xl p-4 text-slate-400 text-sm" style={box}>אין מחזור קרוב.</div>;

  const days = [...new Set(st.matches.map((m) => ilDate(new Date(m.match_date))))].sort();
  const dayMatches = (d) => st.matches.filter((m) => ilDate(new Date(m.match_date)) === d);
  const has = (u, ms) => ms.filter((m) => st.preds.some((p) => p.user_id === u && p.match_id === m.id)).length;
  // personal reminders carry the user; the lineups one goes to everyone (no user)
  const sentTo = (u, prefix) => logs.find((l) => (l.user_id === u || (!l.user_id && l.mode === "live")) && l.key.startsWith(prefix));
  const REM = [["rem:daybefore:", "יום לפני"], ["rem:first:", "לפני הערב"], ["rem:slot:", "הרכבים"]];
  const nameOf = (id) => people.find((p) => p.id === id)?.display_name?.trim() || "—";

  return (
    <div className="rounded-2xl p-4" style={box}>
      <h3 className="text-white font-bold mb-1">🎯 {st.round?.name}: מי ניחש ומי קיבל תזכורת</h3>
      <div className="text-xs text-slate-400 mb-3">"יום לפני" ו"לפני הערב" נשלחות רק למי שעוד חסר לו ניחוש. "הרכבים" נשלחת לכולם. ✅ = נשלחה · ⚠️ = לא רשום להתראות · — = לא נשלחה (לא היה צריך, או שעוד לא הגיע הזמן)</div>
      {days.map((d) => {
        const ms = dayMatches(d);
        return (
          <div key={d} className="mb-3 overflow-x-auto">
            <div className="text-sky-300 text-xs font-semibold mb-1">{new Intl.DateTimeFormat("he-IL", { weekday: "long", day: "numeric", month: "numeric" }).format(new Date(`${d}T12:00:00Z`))} · {ms.length} משחקים</div>
            <table className="w-full text-xs">
              <thead><tr className="text-slate-400"><th className="text-right font-normal py-1">משתתף</th><th className="font-normal">ניחש</th>{REM.map(([, l]) => <th key={l} className="font-normal">{l}</th>)}</tr></thead>
              <tbody>
                {st.players.map((u) => {
                  const n = has(u, ms);
                  return (
                    <tr key={u} className="border-t border-white/5">
                      <td className="py-1 text-slate-200">{nameOf(u)}</td>
                      <td className={`text-center ${n === ms.length ? "text-emerald-300" : "text-amber-300"}`}>{n}/{ms.length}</td>
                      {REM.map(([p, l]) => { const r = sentTo(u, `${p}${d}`); return <td key={l} className="text-center">{r ? (r.error ? "⚠️" : "✅") : "—"}</td>; })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
