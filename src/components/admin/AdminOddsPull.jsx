import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabase";
import { Round, Match } from "@/api/entities";

// Pull a round's odds (api/_odds.js — OddsPapi: the exact-score table from 888sport,
// 1X2 / both score / goal bands from bwin, rounded up to 0.05) and write them into
// the match cards — the same fields as the manual edit, which stays available
// afterwards. "Preview" only shows; nothing is saved until "Save".

const box = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" };
const FIELDS = [
  ["home_win_points", "1"], ["draw_points", "X"], ["away_win_points", "2"],
  ["btts_yes_points", "כן"], ["btts_no_points", "לא"],
  ["goals_0_2_points", "0-2"], ["goals_3_4_points", "3-4"], ["goals_5_plus_points", "5+"],
];
const CAT = { score: "תוצאה מדויקת", h2h: "1X2", btts: "מבקיעות", bands: "שערים" };
const fmt = (iso) => new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const hasOdds = (m) => FIELDS.some(([f]) => m?.[f] != null && Number(m[f]) > 0) || Object.keys(m?.score_odds || {}).length > 0;
const byScore = (a, b) => { const [x, y] = a.split(":").map(Number), [u, v] = b.split(":").map(Number); return x - u || y - v; };

export default function AdminOddsPull() {
  const [rounds, setRounds] = useState([]);
  const [roundId, setRoundId] = useState("");
  const [current, setCurrent] = useState({});
  const [pulled, setPulled] = useState(null);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");
  const [credits, setCredits] = useState(null); // { used, left } — requests this month
  const [spent, setSpent] = useState(0); // requests this pull cost

  const api = async (q) => {
    const { data } = await supabase.auth.getSession();
    const r = await fetch(`/api/football?source=odds&${q}`, { headers: { Authorization: `Bearer ${data.session?.access_token || ""}` } });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || r.status);
    if (j.credits?.left != null) setCredits(j.credits);
    return j;
  };

  useEffect(() => {
    Promise.all([Round.list("order"), Match.list()]).then(([rs, ms]) => {
      setRounds(rs);
      // default: the round of the next match to kick off
      const next = ms.filter((m) => new Date(m.match_date) > new Date()).sort((a, b) => new Date(a.match_date) - new Date(b.match_date))[0];
      setRoundId(next?.round_id || rs[rs.length - 1]?.id || "");
    });
    api("usage=1").catch(() => {}); // the month's usage — free
  }, []);
  useEffect(() => {
    setPulled(null); setMsg(""); setSpent(0);
    if (!roundId) return;
    Match.filter({ round_id: roundId }).then((ms) => setCurrent(Object.fromEntries(ms.map((m) => [m.id, m]))));
  }, [roundId]);

  // 1 request for the round's fixtures, then 1 per match — one at a time with a
  // short pause (the provider has per-endpoint cooldowns); a failed match is
  // retried once, then marked, and the rest carry on.
  const pull = async () => {
    setBusy("pull"); setMsg(""); setSpent(0); setPulled(null);
    let cost = 0;
    try {
      const plan = await api(`round=${roundId}`);
      cost += plan.rows.some((r) => r.eventId || r.skipped !== "המשחק כבר התחיל") ? 1 : 0;
      setSpent(cost);
      const rows = plan.rows.map((r) => (r.eventId ? { ...r, loading: true } : r));
      setPulled({ rows: [...rows], total: rows.filter((r) => r.eventId).length });
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (!r.eventId) continue;
        await new Promise((res) => setTimeout(res, 700));
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const j = await api(`event=${r.eventId}&swapped=${r.swapped ? 1 : 0}`);
            cost += 1;
            rows[i] = { ...r, loading: false, values: j.values, sources: j.sources, missing: j.missing };
            break;
          } catch (e) {
            if (attempt) rows[i] = { ...r, loading: false, failed: e.message };
            else await new Promise((res) => setTimeout(res, 2500));
          }
        }
        setSpent(cost);
        setPulled((p) => ({ ...p, rows: [...rows] }));
      }
      const got = rows.filter((r) => r.values).length, failed = rows.filter((r) => r.failed).length;
      setMsg(!got && !failed ? "אין משחקים למשוך במחזור הזה (עוד אין יחסים, או שהמשחקים כבר התחילו)" : failed ? `⚠️ ${failed} משחקים לא נמשכו (אפשר ללחוץ שוב)` : `✅ נמשכו ${got} משחקים`);
    } catch (e) { setMsg(`⚠️ המשיכה נכשלה: ${e.message}`); }
    setBusy("");
  };

  const ready = (pulled?.rows || []).filter((r) => !r.skipped && Object.keys(r.values || {}).length);
  const save = async () => {
    const filled = ready.filter((r) => hasOdds(current[r.id]));
    if (filled.length && !window.confirm(`יש כבר יחסים ב-${filled.length} משחקים. לדרוס?`)) return;
    setBusy("save"); setMsg("");
    try {
      for (const r of ready) await Match.update(r.id, r.values);
      const ms = await Match.filter({ round_id: roundId });
      setCurrent(Object.fromEntries(ms.map((m) => [m.id, m])));
      const partial = ready.filter((r) => r.missing?.length);
      setMsg(`✅ עודכנו ${ready.length} משחקים${partial.length ? ` · חסר: ${partial.map((r) => `${r.team_a}–${r.team_b}: ${r.missing.join(", ")}`).join(" · ")}` : ""}`);
    } catch (e) { setMsg(`⚠️ השמירה נכשלה: ${e.message}`); }
    setBusy("");
  };

  const done = (pulled?.rows || []).filter((r) => r.eventId && !r.loading).length;
  return (
    <div className="space-y-4" dir="rtl">
      <div className="rounded-2xl p-4" style={box}>
        <h3 className="text-white font-bold mb-1">📥 משיכת יחסים</h3>
        <div className="text-xs text-slate-400 mb-3">תוצאה מדויקת מ-888sport (תוצאה שלא בטבלה = כל תוצאה אחרת, 200). 1X2, שתי הקבוצות מבקיעות וטווח שערים מ-bwin (גיבוי: 888sport, Coral, Ladbrokes). יחס לא עגול מעוגל למעלה ל-0.05. "תצוגה מקדימה" לא שומרת כלום. משחק שכבר התחיל לא נמשך.</div>
        <div className="flex flex-wrap gap-2 items-center">
          <select value={roundId} onChange={(e) => setRoundId(e.target.value)} disabled={!!busy} className="bg-slate-900 border border-white/15 text-white text-sm rounded-md px-2 py-1.5">
            {rounds.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button onClick={pull} disabled={!roundId || !!busy} className="text-sm px-3 py-1.5 rounded-md bg-sky-500/20 border border-sky-400/60 text-white disabled:opacity-50">
            {busy === "pull" ? `מושך… ${done}/${pulled?.total ?? "…"}` : "👁️ תצוגה מקדימה"}
          </button>
          {pulled && !busy && (
            <button onClick={save} disabled={!ready.length} className="text-sm px-3 py-1.5 rounded-md bg-emerald-500/20 border border-emerald-400/60 text-white disabled:opacity-50">
              {`💾 שמור ב-${ready.length} משחקים`}
            </button>
          )}
          {busy === "save" && <span className="text-sm text-slate-300">שומר…</span>}
        </div>
        {credits && (
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            {[["המשיכה הזו", `${spent} בקשות`], ["נוצלו החודש", `${credits.used} / ${credits.used + credits.left}`], ["נשארו", `${credits.left} · ≈${Math.floor(credits.left / 19)} משיכות מחזור`]].map(([l, v]) => (
              <div key={l} className="rounded-lg py-1.5 px-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-[10px] text-slate-500">{l}</div>
                <div className="text-sm text-white font-semibold">{v}</div>
              </div>
            ))}
          </div>
        )}
        <div className="text-[11px] text-slate-500 mt-2">משיכה של מחזור מלא = בערך 19 בקשות (1 למחזור + 1 לכל משחק). המכסה מתחדשת ב-1 לכל חודש.</div>
        {msg && <div className="text-sm mt-3 text-slate-200">{msg}</div>}
      </div>

      {pulled && (
        <div className="space-y-2">
          <div className="text-[11px] text-slate-500 px-1">בכל תא: היחס שנמשך (ירוק = שונה מהקיים), ומתחתיו באפור מה ששמור היום בכרטיס</div>
          {pulled.rows.map((r) => <MatchCard key={r.id} r={r} now={current[r.id]} />)}
        </div>
      )}
    </div>
  );
}

function MatchCard({ r, now }) {
  const [open, setOpen] = useState(false);
  const table = r.values?.score_odds;
  const scores = table ? Object.keys(table).filter((k) => k !== "other").sort(byScore) : [];
  const changed = scores.filter((k) => Number(now?.score_odds?.[k]) !== table[k]).length;
  return (
    <div className="rounded-xl p-3" style={box}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-slate-100 text-sm font-semibold">{r.team_a} – {r.team_b}</span>
        <span className="text-slate-500 text-xs whitespace-nowrap">{fmt(r.match_date)}</span>
      </div>
      {r.sources && (
        <div className="text-slate-400 text-xs">מקור: {Object.entries(r.sources).map(([c, s]) => `${CAT[c]} ${s}`).join(" · ")}</div>
      )}
      {r.skipped && <div className="text-amber-300 text-xs mt-1">{r.skipped}</div>}
      {r.loading && <div className="text-sky-300 text-xs mt-1">מושך…</div>}
      {r.failed && <div className="text-red-300 text-xs mt-1">לא נמשך: {r.failed}</div>}
      {r.missing?.length > 0 && <div className="text-amber-300 text-xs mt-1">חסר: {r.missing.join(", ")}</div>}
      {r.values && (
        <div className="grid grid-cols-8 gap-1 mt-2 text-xs">
          {FIELDS.map(([f, l], i) => {
            const was = now?.[f], next = r.values[f];
            const diff = next != null && Number(was) !== next;
            // a gap between the three groups: 1X2 | both score | goals
            return (
              <div key={f} className={`text-center rounded-md py-1 ${i === 3 || i === 5 ? "ms-1.5" : ""}`} style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-slate-500 text-[10px]">{l}</div>
                <div className={next == null ? "text-slate-600" : diff ? "text-emerald-300 font-semibold" : "text-slate-200"}>{next ?? "—"}</div>
                {was != null && Number(was) > 0 && <div className="text-slate-500 text-[10px]">{Number(was)}</div>}
              </div>
            );
          })}
        </div>
      )}
      {table && (
        <>
          <button onClick={() => setOpen(!open)} className="mt-2 w-full text-right text-xs text-sky-300">
            {open ? "▾" : "◂"} תוצאה מדויקת · {scores.length} תוצאות + כל תוצאה אחרת {table.other}
            {now?.score_odds ? ` · ${changed ? `${changed} שונות מהקיים` : "זהה לקיים"}` : ""}
          </button>
          {open && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 mt-1.5 text-xs">
              {scores.map((k) => {
                const was = now?.score_odds?.[k];
                return (
                  <div key={k} className="flex items-baseline justify-between rounded-md px-1.5 py-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <span className="text-slate-400" dir="ltr">{k}</span>
                    <span className="text-left">
                      <span className={Number(was) !== table[k] ? "text-emerald-300 font-semibold" : "text-slate-200"}>{table[k]}</span>
                      {was != null && Number(was) !== table[k] && <span className="text-slate-500 text-[10px] ms-1">{was}</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
