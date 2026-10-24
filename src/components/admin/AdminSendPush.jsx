import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabase";
import { Round, Match, AppSettings } from "@/api/entities";
import { completedRounds } from "@/utils/roundSummary";

// Manual push from the admin panel: pick one of the app's ready-made formats
// (the same wording the automatic pushes use — numbers/teams are editable
// placeholders) or write freely. Sent by the server, which holds the
// OneSignal key; only admins are accepted there.

const TEMPLATES = [
  { id: "free", label: "✍️ טקסט חופשי", heading: "", body: "", link: "home" },
  { id: "daybefore", label: "📅 מחזור חדש (יום לפני)", heading: "📅 מחזור חדש פורסם ופתוח לניחוש!", body: "המשחקים מתחילים מחר ב-19:45 — כנסו לנחש 👉", link: "home" },
  { id: "lock", label: "⏰ נעילת ניחושים (יום ראשון במחזור)", heading: "⏰ הניחושים ננעלים ב-19:35!", body: "5 משתתפים עוד לא ניחשו — כנסו לנחש 👉", link: "home" },
  { id: "lineups", label: "📋 ההרכבים פורסמו", heading: "📋 ההרכבים למשחקי 22:00 פורסמו!", body: "רוצים לעדכן ניחוש? אפשר עד 21:50 👉", link: "home" },
  { id: "lastchance", label: "⏰ הזדמנות אחרונה", heading: "⏰ ניחושי משחקי 22:00 ננעלים ב-21:50", body: "הזדמנות אחרונה לעדכן ניחוש 👉", link: "home" },
  { id: "goal", label: "⚽ גול", heading: "⚽ גול! Real Madrid 1-0 Liverpool (Mbappé 23')", body: "🎯 3 משתתפים פוגעים כרגע בתוצאה המדויקת — כנסו לגלות מי בטבלת הלייב 👉", link: "live" },
  { id: "var", label: "🖥️❌ שער נפסל (VAR)", heading: "🖥️❌ השער נפסל — Real Madrid 0-0 Liverpool", body: "🎯 2 משתתפים פוגעים כרגע בתוצאה המדויקת — כנסו לגלות מי בטבלת הלייב 👉", link: "live" },
  { id: "night", label: "🏁 סיכום ערב", heading: "🏁 ערב ליגת האלופות הסתיים!", body: "🎯 4 פגיעות מדויקות הערב — כנסו לראות את הטבלה העדכנית 👉", link: "leaderboard" },
  { id: "nightlate", label: "🏁 סיכום ערב (למחרת)", heading: "🏁 סיכום ערב ליגת האלופות של אתמול", body: "🎯 4 פגיעות מדויקות אתמול — כנסו לראות את הטבלה העדכנית 👉", link: "leaderboard" },
];

// Where a tap on the push lands. round: true → a round picker appears and the
// link carries its round_id. Keep in sync with LINKS in api/_adminPush.js.
const LINKS = [
  ["home", "מסך הבית"],
  ["round", "ניחושי מחזור", true],
  ["results", "ניחושים ותוצאות"],
  ["leaderboard", "טבלת הדירוג"],
  ["live", "טבלת הלייב"],
  ["hits", "פגיעות מדויקות"],
  ["replay", "הילוך חוזר למחזור", true],
  ["summary", "סיכום המחזור (כניסה קולנועית)", true],
  ["stats", "סטטיסטיקה"],
  ["knockout", "שלב הנוקאאוט"],
  ["general", "ניחושים כלליים"],
  ["halloffame", "היכל התהילה"],
];

const box = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" };
const input = "w-full rounded-lg px-3 py-2 text-sm text-white bg-white/5 border border-white/15 focus:outline-none focus:border-sky-400/60";

// When the automatic round-summary push (10:00 after the round's last night)
// didn't go out: one tap sends it to everyone with the saved wording. Every
// tap is a new send (the server gives it its own key), hence the confirm step.
function ManualRoundSummary() {
  const [rounds, setRounds] = useState(null);
  const [roundId, setRoundId] = useState("");
  const [wording, setWording] = useState(undefined);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    Promise.all([Round.list("order"), Match.list("match_date"), AppSettings.list()]).then(([list, matches, settings]) => {
      const done = completedRounds(list, matches);
      setRounds(done);
      setRoundId(done[done.length - 1]?.id || "");
      setWording(settings?.[0]?.round_summary_push || null);
    }).catch(() => { setRounds([]); setWording(null); });
  }, []);

  const send = async () => {
    setSending(true); setResult(null);
    try {
      const { data } = await supabase.auth.getSession();
      const r = await fetch("/api/football?source=admin-push", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token || ""}` },
        body: JSON.stringify({ kind: "round-summary", roundId }),
      });
      const j = await r.json().catch(() => ({}));
      const errors = j.sent?.body?.errors;
      const d = j.delivery;
      setResult(r.ok && j.ok
        ? { ok: true, text: `סיכום המחזור נשלח לכל המשתתפים ✅${d ? ` · נמסר ל-${d.successful} מכשירים${d.remaining ? `, עוד ${d.remaining} בדרך` : ""}${d.failed + d.errored ? `, ${d.failed + d.errored} נכשלו` : ""}` : ""}` }
        : { ok: false, text: `השליחה נכשלה: ${j.error || (Array.isArray(errors) ? errors.join(", ") : errors && JSON.stringify(errors)) || r.status}` });
    } catch (e) {
      setResult({ ok: false, text: `השליחה נכשלה: ${e.message}` });
    } finally {
      setSending(false); setConfirming(false);
    }
  };

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.3)" }}>
      <div>
        <p className="text-sm font-bold text-white">🏆 שליחה ידנית של סיכום המחזור</p>
        <p className="text-[11px] text-slate-400 mt-0.5">אם ההתראה האוטומטית לא יצאה: שולח לכולם את הנוסח השמור, ולחיצה פותחת את סיכום המחזור שנבחר. כל לחיצה היא שליחה חדשה.</p>
      </div>
      {!rounds ? <p className="text-[11px] text-slate-500">טוען מחזורים...</p> : !rounds.length ? <p className="text-[11px] text-slate-500">עוד אין מחזור שהסתיים.</p> : (
        <select value={roundId} onChange={(e) => { setRoundId(e.target.value); setConfirming(false); setResult(null); }} className={input}>
          {rounds.map((r) => <option key={r.id} value={r.id} className="bg-slate-900">{r.name}</option>)}
        </select>
      )}
      {wording === null && <p className="text-[11px] text-amber-300">עוד לא נשמר נוסח (לשונית סיכום מחזור), ולכן אי אפשר לשלוח.</p>}
      {wording && (
        <div className="rounded-xl p-3 bg-white/[0.06] border border-white/10">
          <p className="text-sm font-bold text-white">{wording.heading}</p>
          <p className="text-xs text-slate-300 mt-0.5">{wording.body}</p>
        </div>
      )}
      {!confirming ? (
        <button type="button" disabled={!roundId || !wording || sending} onClick={() => setConfirming(true)}
          className="w-full py-2.5 rounded-xl font-bold text-sm text-black disabled:opacity-40" style={{ background: "linear-gradient(135deg,#f5c518,#fde68a)" }}>
          שלח את סיכום המחזור לכולם
        </button>
      ) : (
        <div className="rounded-xl p-3 border border-red-400/50 bg-red-500/10 space-y-2">
          <p className="text-sm text-red-200">סיכום {rounds.find((r) => r.id === roundId)?.name} יישלח עכשיו לכל המשתתפים. לשלוח?</p>
          <div className="flex gap-2">
            <button type="button" onClick={send} disabled={sending} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-bold">{sending ? "שולח..." : "כן, שלח לכולם"}</button>
            <button type="button" onClick={() => setConfirming(false)} className="flex-1 py-2 rounded-lg border border-white/20 text-slate-300 text-sm">ביטול</button>
          </div>
        </div>
      )}
      {result && <p className={`text-sm ${result.ok ? "text-emerald-300" : "text-red-300"}`}>{result.text}</p>}
    </div>
  );
}

export default function AdminSendPush() {
  const [tpl, setTpl] = useState("free");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("home");
  const [target, setTarget] = useState("test");
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [userId, setUserId] = useState("");
  const [onesignalId, setOnesignalId] = useState("");
  const [participants, setParticipants] = useState(null); // from admin-subscribers, loaded on first "user" pick
  const [rounds, setRounds] = useState(null); // loaded when a round link is picked
  const [roundId, setRoundId] = useState("");
  const needsRound = LINKS.find(([id]) => id === link)?.[2];

  useEffect(() => {
    if (!needsRound || rounds) return;
    Promise.all([Round.list("order"), Match.list("match_date")]).then(([list, matches]) => {
      setRounds(list);
      // default: the round of the nearest match not yet over (kickoff within the
      // last ~3h counts as still on), else the last round
      const cutoff = Date.now() - 3 * 3600e3;
      const next = matches.find((m) => new Date(m.match_date).getTime() > cutoff);
      setRoundId(next?.round_id || list[list.length - 1]?.id || "");
    }).catch(() => setRounds([]));
  }, [needsRound, rounds]);

  useEffect(() => {
    if (target !== "user" || participants) return;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const r = await fetch("/api/football?source=admin-subscribers", { headers: { Authorization: `Bearer ${data.session?.access_token || ""}` } });
        const j = await r.json();
        const linked = (u) => u.subscriptions.some((s) => s.enabled);
        setParticipants(r.ok ? [...j.users].sort((a, b) => linked(b) - linked(a)).map((u) => ({ ...u, ready: linked(u) })) : []);
      } catch {
        setParticipants([]);
      }
    })();
  }, [target, participants]);

  const pick = (id) => {
    const t = TEMPLATES.find((x) => x.id === id);
    setTpl(id);
    setHeading(t.heading);
    setBody(t.body);
    setLink(t.link);
    setResult(null);
    setConfirming(false);
  };

  const validOsId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(onesignalId.trim());
  const ready = heading.trim() && body.trim() && (target !== "user" || userId) && (target !== "onesignal" || validOsId) && (!needsRound || roundId);
  const chosen = participants?.find((u) => u.id === userId);

  const send = async () => {
    setSending(true);
    setResult(null);
    try {
      const { data } = await supabase.auth.getSession();
      const r = await fetch("/api/football?source=admin-push", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token || ""}` },
        body: JSON.stringify({
          heading, body, link, target,
          roundId: needsRound ? roundId : undefined,
          userId: target === "user" ? userId : undefined,
          onesignalId: target === "onesignal" ? onesignalId.trim() : undefined,
        }),
      });
      const j = await r.json().catch(() => ({}));
      const okText = target === "all" ? "נשלח לכל המשתתפים ✅"
        : target === "user" ? `נשלח ל${chosen?.name || "משתתף"} ✅`
        : target === "onesignal" ? "נשלח למזהה OneSignal ✅"
        : "נשלח למכשירי הבדיקה (Test Users) ✅";
      const errors = j.sent?.body?.errors;
      setResult(r.ok && j.ok
        ? { ok: true, text: okText }
        : { ok: false, text: `השליחה נכשלה: ${j.error || (Array.isArray(errors) ? errors.join(", ") : errors && JSON.stringify(errors)) || (target === "user" ? "המשתתף לא מקושר להתראות" : target === "onesignal" ? "לא נמצא מכשיר רשום למזהה הזה" : r.status)}` });
    } catch (e) {
      setResult({ ok: false, text: `השליחה נכשלה: ${e.message}` });
    } finally {
      setSending(false);
      setConfirming(false);
    }
  };

  return (
    <div dir="rtl" className="space-y-4 max-w-xl">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">📣 שליחת התראה</h2>
        <p className="text-slate-400 text-sm">בחר נוסח מוכן ועדכן את הפרטים (שעות, קבוצות, מספרים), או כתוב טקסט חופשי.</p>
      </div>

      <ManualRoundSummary />

      <div className="rounded-2xl p-4 space-y-3" style={box}>
        <label className="block text-xs text-slate-400">נוסח</label>
        <select value={tpl} onChange={(e) => pick(e.target.value)} className={input}>
          {TEMPLATES.map((t) => <option key={t.id} value={t.id} className="bg-slate-900">{t.label}</option>)}
        </select>

        <label className="block text-xs text-slate-400">כותרת <span className="text-slate-600">({heading.length}/120)</span></label>
        <input value={heading} maxLength={120} onChange={(e) => setHeading(e.target.value)} className={input} placeholder="למשל: ⚽ גול!" />

        <label className="block text-xs text-slate-400">טקסט <span className="text-slate-600">({body.length}/300 — במסך נעילה רואים בערך שורה אחת)</span></label>
        <textarea value={body} maxLength={300} rows={3} onChange={(e) => setBody(e.target.value)} className={input} placeholder="מה כתוב בהתראה" />

        <label className="block text-xs text-slate-400">לחיצה על ההתראה פותחת</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {LINKS.map(([id, label]) => (
            <button key={id} type="button" onClick={() => setLink(id)}
              className={`text-xs py-1.5 px-2 rounded-lg border ${link === id ? "bg-sky-500/20 border-sky-400/60 text-white" : "border-white/15 text-slate-400"}`}>{label}</button>
          ))}
        </div>
        {needsRound && (
          !rounds ? <p className="text-[11px] text-slate-500">טוען מחזורים...</p> : (
            <select value={roundId} onChange={(e) => setRoundId(e.target.value)} className={input}>
              {rounds.map((r) => <option key={r.id} value={r.id} className="bg-slate-900">{r.name}</option>)}
            </select>
          )
        )}

        <label className="block text-xs text-slate-400">למי לשלוח</label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => { setTarget("test"); setConfirming(false); }}
            className={`flex-1 text-xs py-1.5 rounded-lg border ${target === "test" ? "bg-emerald-500/20 border-emerald-400/60 text-white" : "border-white/15 text-slate-400"}`}>🧪 רק מכשירי בדיקה</button>
          <button type="button" onClick={() => { setTarget("all"); setConfirming(false); }}
            className={`flex-1 text-xs py-1.5 rounded-lg border ${target === "all" ? "bg-red-500/20 border-red-400/60 text-white" : "border-white/15 text-slate-400"}`}>👥 כל המשתתפים</button>
          <button type="button" onClick={() => { setTarget("user"); setConfirming(false); }}
            className={`flex-1 text-xs py-1.5 rounded-lg border ${target === "user" ? "bg-violet-500/20 border-violet-400/60 text-white" : "border-white/15 text-slate-400"}`}>👤 משתתף מסוים</button>
          <button type="button" onClick={() => { setTarget("onesignal"); setConfirming(false); }}
            className={`flex-1 text-xs py-1.5 rounded-lg border ${target === "onesignal" ? "bg-violet-500/20 border-violet-400/60 text-white" : "border-white/15 text-slate-400"}`}>🆔 לפי מזהה OneSignal</button>
        </div>
        {target === "onesignal" && (
          <>
            <input value={onesignalId} onChange={(e) => setOnesignalId(e.target.value)} dir="ltr"
              className={`${input} font-mono`} placeholder="3bed3a29-a08b-401e-9f01-e0b95fea610c" />
            <p className="text-[11px] text-slate-500">
              הדבק OneSignal ID מלוח הבקרה של OneSignal (Audience → Users). עובד גם למכשירים שעוד לא מקושרים למשתתף.
              {onesignalId.trim() && !validOsId && <span className="text-red-300"> · המזהה לא תקין</span>}
            </p>
          </>
        )}
        {target === "test" && <p className="text-[11px] text-slate-500">מגיע רק למכשירים שסומנו ב-OneSignal כ-Test Users (Audience → Subscriptions → Add to Test Users).</p>}
        {target === "user" && (
          !participants ? <p className="text-[11px] text-slate-500">טוען משתתפים...</p> : (
            <>
              <select value={userId} onChange={(e) => setUserId(e.target.value)} className={input}>
                <option value="" className="bg-slate-900">בחר משתתף</option>
                {participants.map((u) => (
                  <option key={u.id} value={u.id} disabled={!u.ready} className="bg-slate-900">
                    {u.ready ? "🔔" : "🔕"} {u.name}{u.ready ? "" : " (לא רשום)"}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">אפשר לבחור רק משתתפים שרשומים להתראות (🔔). השאר יופיעו אחרי שייכנסו לאפליקציה.</p>
            </>
          )
        )}
      </div>

      <div className="rounded-2xl p-4" style={box}>
        <p className="text-xs text-slate-400 mb-2">תצוגה מקדימה</p>
        <div className="rounded-xl p-3 bg-white/[0.06] border border-white/10">
          <p className="text-sm font-bold text-white">{heading || "כותרת"}</p>
          <p className="text-xs text-slate-300 mt-0.5">{body || "טקסט ההתראה"}</p>
        </div>
      </div>

      {!confirming ? (
        <button type="button" disabled={!ready || sending} onClick={() => (target === "all" ? setConfirming(true) : send())}
          className="w-full py-2.5 rounded-xl font-bold text-sm text-black disabled:opacity-40" style={{ background: "linear-gradient(135deg,#f5c518,#fde68a)" }}>
          {sending ? "שולח..." : target === "all" ? "שלח לכל המשתתפים" : target === "user" ? `שלח ל${chosen?.name || "משתתף"}` : target === "onesignal" ? "שלח למזהה הזה" : "שלח למכשירי בדיקה"}
        </button>
      ) : (
        <div className="rounded-xl p-3 border border-red-400/50 bg-red-500/10 space-y-2">
          <p className="text-sm text-red-200">ההתראה תישלח עכשיו לכל המשתתפים. לא ניתן לבטל אחרי השליחה. לשלוח?</p>
          <div className="flex gap-2">
            <button type="button" onClick={send} disabled={sending} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-bold">{sending ? "שולח..." : "כן, שלח לכולם"}</button>
            <button type="button" onClick={() => setConfirming(false)} className="flex-1 py-2 rounded-lg border border-white/20 text-slate-300 text-sm">ביטול</button>
          </div>
        </div>
      )}

      {result && <p className={`text-sm ${result.ok ? "text-emerald-300" : "text-red-300"}`}>{result.text}</p>}
    </div>
  );
}
