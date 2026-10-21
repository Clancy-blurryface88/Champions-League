import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/api/supabase";
import { User, Round, Match, Prediction, PublicProfile, AppSettings } from "@/api/entities";
import { computeRoundSummary, completedRounds } from "@/utils/roundSummary";
import { REVEALS, DEFAULT_REVEAL } from "@/components/roundSummary/reveals";
import { RevealStage } from "@/components/roundSummary/RoundSummaryReveal";

// Round summary: preview the cinematic entries on real data, pick the one the
// push opens, choose the push wording (used by the automatic 10:00 push the
// morning after the round's last night — none saved → no automatic push) and
// send it by hand.

export const SUMMARY_PUSH_TEXTS = [
  { heading: "🏆 סיכום המחזור שלך מוכן!", body: "איך היה המחזור שלך? כל המספרים מחכים לך. לחץ לצפייה 👉" },
  { heading: "🎬 הסיכום שלך עולה לאוויר", body: "המחזור הסתיים, ועכשיו תורך לגלות איפה סיימת 👉" },
  { heading: "🔦 הזרקורים דולקים, והפעם עליך", body: "המחזור נגמר. בוא לגלות באיזה מקום סיימת 👉" },
  { heading: "✨ סיכום המחזור מחכה לך", body: "פגיעות, נקודות ומקום, הכל בסיכום אחד. לחץ לצפייה 👉" },
  { heading: "🥁 תופים בבקשה...", body: "המקום שלך במחזור נחשף עכשיו. לחץ כדי לגלות 👉" },
  { heading: "📊 המחזור שלך במספרים", body: "כמה פגעת, כמה צברת ואיפה סיימת? הסיכום האישי שלך מוכן 👉" },
  { heading: "👀 מוכן לראות איך הלך לך?", body: "סיכום המחזור האישי שלך פורסם. לחץ וצפה 👉" },
  { heading: "🏟️ האצטדיון מואר בשבילך", body: "הסיכום האישי של המחזור מוכן, ומוצג פעם אחת בלבד 👉" },
  { heading: "⭐ ההופעה שלך במחזור", body: "המשחק הכי טוב שלך, הפגיעות והמיקום. הכל מחכה לך 👉" },
  { heading: "🏁 שריקת סיום למחזור", body: "עכשיו מגלים אם היית המלך או שיש מה לשפר. לחץ לסיכום 👉" },
];

const box = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" };
const input = "w-full rounded-lg px-3 py-2 text-sm text-white bg-white/5 border border-white/15 focus:outline-none focus:border-sky-400/60";
const chip = (on) => `text-xs py-1.5 px-2 rounded-lg border text-right ${on ? "bg-amber-500/20 border-amber-400/60 text-white" : "border-white/15 text-slate-400"}`;

export default function AdminRoundSummary() {
  const [data, setData] = useState(null);
  const [me, setMe] = useState(null);
  const [settings, setSettings] = useState(null);
  const [roundId, setRoundId] = useState("");
  const [userId, setUserId] = useState("");
  const [variant, setVariant] = useState(DEFAULT_REVEAL);
  const [replay, setReplay] = useState(0);
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    Promise.all([Round.list("order"), Match.list(), Prediction.list(), PublicProfile.list(), AppSettings.list(), User.me().catch(() => null)])
      .then(([rounds, matches, predictions, profiles, list, user]) => {
        setData({ rounds, matches, predictions, profiles });
        setMe(user);
        setUserId(user?.id || predictions[0]?.user_id || "");
        const s = list?.[0] || null;
        setSettings(s);
        if (s?.round_summary_variant) setVariant(s.round_summary_variant);
        const t = s?.round_summary_push || SUMMARY_PUSH_TEXTS[0];
        setHeading(t.heading); setBody(t.body);
        const done = completedRounds(rounds, matches);
        setRoundId(done[done.length - 1]?.id || "");
      });
  }, []);

  const done = useMemo(() => (data ? completedRounds(data.rounds, data.matches) : []), [data]);
  const people = useMemo(() => {
    if (!data) return [];
    const ids = new Set(data.predictions.map((p) => p.user_id));
    return data.profiles.filter((p) => ids.has(p.user_id)).sort((a, b) => (a.display_name || "").localeCompare(b.display_name || ""));
  }, [data]);
  const summary = useMemo(() => (data && roundId && userId ? computeRoundSummary(userId, data, roundId) : null), [data, roundId, userId]);
  const activeVariant = settings?.round_summary_variant || DEFAULT_REVEAL;
  const savedText = settings?.round_summary_push;

  const save = async (updates, label) => {
    if (!settings) return;
    const row = await AppSettings.update(settings.id, updates);
    setSettings(row);
    setSaved(label);
    setTimeout(() => setSaved(""), 2500);
  };

  const send = async (target) => {
    setSending(true); setResult(null);
    try {
      const { data: s } = await supabase.auth.getSession();
      const r = await fetch("/api/football?source=admin-push", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${s.session?.access_token || ""}` },
        body: JSON.stringify({ heading, body, link: "summary", roundId, target }),
      });
      const j = await r.json().catch(() => ({}));
      setResult(r.ok && j.ok ? { ok: true, text: target === "all" ? "נשלח לכל המשתתפים ✅" : "נשלח למכשירי הבדיקה ✅" } : { ok: false, text: `השליחה נכשלה: ${j.error || r.status}` });
    } catch (e) {
      setResult({ ok: false, text: `השליחה נכשלה: ${e.message}` });
    } finally {
      setSending(false); setConfirming(false);
    }
  };

  if (!data) return <p className="text-slate-400 text-sm" dir="rtl">טוען...</p>;

  return (
    <div dir="rtl" className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">🏆 סיכום מחזור</h2>
        <p className="text-slate-400 text-sm">הכניסה הקולנועית שנפתחת מההתראה, פעם אחת לכל משתתף. ההתראה נשלחת אוטומטית ב-10:00 בבוקר שאחרי הערב האחרון של המחזור, עם הנוסח השמור כאן.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="space-y-4 w-full lg:w-[420px] shrink-0">
          <div className="rounded-2xl p-4 space-y-3" style={box}>
            <label className="block text-xs text-slate-400">מחזור</label>
            <select value={roundId} onChange={(e) => setRoundId(e.target.value)} className={input}>
              {done.map((r) => <option key={r.id} value={r.id} className="bg-slate-900">{r.name}</option>)}
            </select>
            <label className="block text-xs text-slate-400">תצוגה מקדימה בתור</label>
            <select value={userId} onChange={(e) => setUserId(e.target.value)} className={input}>
              {people.map((p) => <option key={p.user_id} value={p.user_id} className="bg-slate-900">{p.display_name}{p.user_id === me?.id ? " (אני)" : ""}</option>)}
            </select>
          </div>

          <div className="rounded-2xl p-4 space-y-3" style={box}>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400">כניסה</label>
              {saved === "variant" && <span className="text-[11px] text-emerald-300">נשמר ✅</span>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {REVEALS.map((r) => (
                <button key={r.id} type="button" onClick={() => { setVariant(r.id); setReplay((n) => n + 1); }} className={chip(variant === r.id)}>
                  {r.id === activeVariant ? "✓ " : ""}{r.name}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">{REVEALS.find((r) => r.id === variant)?.desc}</p>
            <button type="button" disabled={variant === activeVariant} onClick={() => save({ round_summary_variant: variant }, "variant")}
              className="w-full text-sm py-2 rounded-lg bg-amber-500/20 border border-amber-400/50 text-white disabled:opacity-40">
              {variant === activeVariant ? "זו הכניסה שנשלחת עכשיו" : "קבע ככניסה של ההתראה"}
            </button>
          </div>

          <div className="rounded-2xl p-4 space-y-3" style={box}>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400">נוסח ההתראה</label>
              {saved === "text" && <span className="text-[11px] text-emerald-300">נשמר ✅</span>}
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pl-1">
              {SUMMARY_PUSH_TEXTS.map((t, i) => (
                <button key={i} type="button" onClick={() => { setHeading(t.heading); setBody(t.body); }}
                  className={`w-full text-right rounded-lg px-3 py-2 border ${heading === t.heading && body === t.body ? "bg-sky-500/15 border-sky-400/60" : "border-white/10"}`}>
                  <div className="text-[13px] text-white font-semibold">{i + 1}. {t.heading}</div>
                  <div className="text-[12px] text-slate-400">{t.body}</div>
                </button>
              ))}
            </div>
            <input value={heading} maxLength={120} onChange={(e) => setHeading(e.target.value)} className={input} />
            <textarea value={body} maxLength={300} rows={2} onChange={(e) => setBody(e.target.value)} className={input} />
            <p className="text-[11px] text-slate-500">
              {savedText ? <>הנוסח האוטומטי השמור: <b className="text-slate-300">{savedText.heading}</b></> : <span className="text-amber-300">עוד לא נשמר נוסח, ולכן ההתראה האוטומטית לא תישלח.</span>}
            </p>
            <button type="button" disabled={!heading.trim() || !body.trim()} onClick={() => save({ round_summary_push: { heading: heading.trim(), body: body.trim() } }, "text")}
              className="w-full text-sm py-2 rounded-lg bg-sky-500/20 border border-sky-400/50 text-white disabled:opacity-40">שמור כנוסח של ההתראה האוטומטית</button>

            <label className="block text-xs text-slate-400 pt-1">שליחה ידנית עכשיו (למחזור שנבחר למעלה)</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" disabled={sending || !roundId} onClick={() => send("test")} className="text-xs py-2 rounded-lg border border-emerald-400/50 bg-emerald-500/15 text-white disabled:opacity-40">🧪 שלח למכשירי בדיקה</button>
              {!confirming
                ? <button type="button" disabled={sending || !roundId} onClick={() => setConfirming(true)} className="text-xs py-2 rounded-lg border border-red-400/50 bg-red-500/15 text-white disabled:opacity-40">👥 שלח לכל המשתתפים</button>
                : <button type="button" disabled={sending} onClick={() => send("all")} className="text-xs py-2 rounded-lg border border-red-400 bg-red-500/40 text-white font-bold">בטוח? לחץ שוב לשליחה</button>}
            </div>
            {result && <p className={`text-[12px] ${result.ok ? "text-emerald-300" : "text-red-300"}`}>{result.text}</p>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 mx-auto">
          <div style={{ padding: 10, borderRadius: 46, background: "#111", boxShadow: "0 0 0 2px #333" }}>
            {summary
              ? <RevealStage summary={summary} variant={variant} replay={replay} style={{ width: 360, height: 720, borderRadius: 36 }} />
              : <div className="w-[360px] h-[720px] grid place-items-center text-slate-500 text-sm">אין נתונים למשתתף במחזור הזה</div>}
          </div>
          <button type="button" onClick={() => setReplay((n) => n + 1)} className="text-xs px-4 py-1.5 rounded-full border border-white/20 text-slate-300">↻ הרץ שוב</button>
        </div>
      </div>
    </div>
  );
}
