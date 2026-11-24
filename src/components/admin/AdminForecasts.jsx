import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabase";
import { Match, Prediction, Round, User, PublicProfile } from "@/api/entities";
import OrbitSpinner from "@/components/OrbitSpinner";
import { pick, computeForecast2 } from "@/utils/forecastCalc";
import { forecastImage } from "@/utils/forecastImage";

// Everyone's round forecast, for the admin only (round_forecasts' RLS lets only admins read all rows):
// the forecast with its range, beside the player's round average and what was really earned, and how many
// outcomes and exact scores are expected from their picks. Nobody's picks are shown.
// A round still in play is calculated here for everyone by the current formula (some may have sent before it
// changed); a finished round shows what was stored. "תמונה לשיתוף" makes a table picture of it for WhatsApp.
const NUM = { fontFamily: "var(--num-font)", fontWeight: 800 };
const r0 = (v) => (v == null ? "—" : Math.round(Number(v)));
const sign = (v) => (v > 0 ? `+${v}` : `${v}`);
const gapColor = (v) => (v > 0 ? "#4ade80" : v < 0 ? "#f87171" : "#cbd5e1");

function Cell({ t, children, c = "#fff" }) {
  return (
    <div className="text-center min-w-0">
      <div className="text-[11px] text-slate-400 whitespace-nowrap">{t}</div>
      <div dir="ltr" style={{ ...NUM, fontSize: 19, color: c, lineHeight: 1.2 }}>{children}</div>
    </div>
  );
}

// the picture, made on demand: shown first, then shared (the phone's share sheet) or saved
function ShareImage({ round, rows }) {
  const [img, setImg] = useState(null); // { url, file }
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => () => { if (img) URL.revokeObjectURL(img.url); }, [img]);
  const make = async () => {
    setBusy(true); setMsg("");
    try {
      const blob = await forecastImage({ round, rows });
      setImg({ url: URL.createObjectURL(blob), file: new File([blob], `forecast-round-${round}.png`, { type: "image/png" }) });
    } catch (e) { setMsg(`שגיאה: ${e.message || e}`); }
    setBusy(false);
  };
  const canShare = img && typeof navigator.canShare === "function" && navigator.canShare({ files: [img.file] });
  const share = () => navigator.share({ files: [img.file] }).catch((e) => { if (e.name !== "AbortError") setMsg("השיתוף לא עבד, אפשר לשמור את התמונה"); });
  return (
    <div className="space-y-2">
      <button type="button" onClick={make} disabled={busy} className="w-full rounded-xl py-3 font-bold" style={{ background: "linear-gradient(135deg,#fde047,#eab308)", color: "#1a1405" }}>
        {busy ? "יוצר תמונה…" : img ? "↻ ליצור מחדש" : "🖼️ תמונה לשיתוף"}
      </button>
      {msg && <div className="text-sm text-red-400">{msg}</div>}
      {img && (
        <>
          <img src={img.url} alt="תחזית המחזור" className="w-full rounded-xl border border-slate-700" />
          <div className="flex gap-2">
            {canShare && <button type="button" onClick={share} className="flex-1 rounded-xl py-3 font-bold text-white" style={{ background: "#16a34a" }}>שיתוף</button>}
            <a href={img.url} download={img.file.name} className="flex-1 rounded-xl py-3 font-bold text-white text-center bg-slate-700">שמירה</a>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminForecasts() {
  const [base, setBase] = useState(null); // rounds, matches, users
  const [roundId, setRoundId] = useState(null);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const [rounds, matches, users, profiles, preds] = await Promise.all([Round.list("order"), Match.list(), User.list(), PublicProfile.list(), Prediction.list()]);
      const withMatches = rounds.filter((r) => r.is_active);
      const names = {};
      users.forEach((u) => { names[u.id] = profiles.find((p) => p.user_id === u.id)?.display_name || u.display_name || u.full_name || "—"; });
      setBase({ rounds: withMatches, matches, users, names, preds });
      setRoundId(withMatches[withMatches.length - 1]?.id || null);
    })().catch((e) => setError(e.message || String(e)));
  }, []);

  useEffect(() => {
    if (!base || !roundId) return undefined;
    let off = false;
    setRows(null);
    setError("");
    (async () => {
      const ms = base.matches.filter((m) => m.round_id === roundId);
      const byId = Object.fromEntries(ms.map((m) => [m.id, m]));
      const all = Object.fromEntries(base.matches.map((m) => [m.id, m]));
      const fs = await supabase.from("round_forecasts").select("*").eq("round_id", roundId);
      if (fs.error) throw fs.error;
      if (off) return;
      const done = ms.filter((m) => m.is_score_calculated).length;
      const list = base.users.map((u) => {
        const theirs = base.preds.filter((p) => p.user_id === u.id && all[p.match_id]);
        const mine = theirs.filter((p) => byId[p.match_id]);
        const exp = mine.reduce((s, p) => {
          const k = pick(byId[p.match_id], Number(p.predicted_score_a) || 0, Number(p.predicted_score_b) || 0);
          return { dir: s.dir + k.oc[1], ex: s.ex + k.ex[1] };
        }, { dir: 0, ex: 0 });
        const stored = fs.data.find((x) => x.user_id === u.id) || null;
        const f = done === ms.length || !mine.length ? stored : {
          ...computeForecast2(
            theirs.filter((p) => !byId[p.match_id] && all[p.match_id].is_score_calculated).map((p) => ({ match: all[p.match_id], prediction: p })),
            mine.map((p) => ({ match: byId[p.match_id], a: Number(p.predicted_score_a) || 0, b: Number(p.predicted_score_b) || 0 })), base.matches),
          updated_at: stored?.updated_at,
        };
        return {
          id: u.id, name: base.names[u.id], f, sent: mine.length, exp,
          actual: done ? mine.reduce((s, p) => s + (byId[p.match_id].is_score_calculated ? Number(p.points_earned) || 0 : 0), 0) : null,
        };
      }).sort((a, b) => (Number(b.f?.fc) || -1) - (Number(a.f?.fc) || -1));
      setRows({ list, done, total: ms.length });
    })().catch((e) => { if (!off) setError(e.message || String(e)); });
    return () => { off = true; };
  }, [base, roundId]);

  if (error) return <div dir="rtl" className="text-red-400 text-sm">שגיאה: {error}</div>;
  if (!base) return <div className="flex justify-center py-12"><OrbitSpinner size={40} /></div>;
  const over = rows && rows.done === rows.total;
  const order = base.rounds.find((r) => r.id === roundId)?.order;
  // everyone's numbers for the picture; a stored row from the first formula has no expected hits, so they come from the odds
  const shareRows = (rows?.list || []).filter((r) => r.f).map(({ name, f, exp }) => ({
    name, fc: f.fc, lo: f.lo, hi: f.hi, dir: f.cats?.v === 2 ? f.cats.dir : exp.dir, beat: f.cats?.beat ?? null,
  }));

  return (
    <div dir="rtl" className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-white">תחזיות הניקוד של כולם</h2>
        <p className="text-sm text-slate-400">לאדמין בלבד, בלי הניחושים עצמם</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {base.rounds.map((r) => (
          <button key={r.id} type="button" onClick={() => setRoundId(r.id)} className="rounded-lg px-3 py-1.5 text-sm font-bold"
            style={{ background: r.id === roundId ? "#facc15" : "rgba(255,255,255,.08)", color: r.id === roundId ? "#1a1405" : "#fff" }}>
            מחזור {r.order}
          </button>
        ))}
      </div>
      {!rows ? <div className="flex justify-center py-10"><OrbitSpinner size={36} /></div> : (
        <>
          <div className="text-sm text-slate-300">
            {rows.done === 0 ? "המחזור עוד לא חושב" : over ? "המחזור הסתיים" : <>חושבו <span dir="ltr" style={NUM}>{rows.done}/{rows.total}</span> משחקים</>}
          </div>
          {shareRows.length > 0 && <ShareImage key={roundId} round={order} rows={shareRows} />}
          <div className="space-y-2">
            {rows.list.map(({ id, name, f, sent, exp, actual }) => {
              const gap = f?.avg == null ? null : Math.round(f.fc) - Math.round(f.avg);
              const diff = actual == null || !f ? null : Math.round(actual) - Math.round(f.fc);
              return (
                <div key={id} className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-white">{name}</span>
                    <span className="text-xs text-slate-400">
                      {!f ? (sent ? "אין תחזית שמורה" : "עוד לא נשלחו ניחושים") : f.backfill ? "חושבה בדיעבד" : f.updated_at && `נשלח ${new Date(f.updated_at).toLocaleString("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}`}
                    </span>
                  </div>
                  {f && (
                    <div className="grid grid-cols-4 gap-x-1 gap-y-2">
                      <Cell t="תחזית" c="#facc15">{r0(f.fc)}</Cell>
                      <Cell t="טווח">{f.lo}–{f.hi}</Cell>
                      <Cell t="ממוצע אישי">{r0(f.avg)}</Cell>
                      <Cell t="תחזית מול ממוצע" c={gap == null ? "#94a3b8" : gapColor(gap)}>{gap == null ? "—" : sign(gap)}</Cell>
                      <Cell t="מקסימום">{r0(f.max)}</Cell>
                      <Cell t="צפי כיוונים">{f.cats?.v === 2 ? f.cats.dir.toFixed(1) : sent ? exp.dir.toFixed(1) : "—"}</Cell>
                      <Cell t="צפי מדויקות">{f.cats?.v === 2 ? f.cats.exact.toFixed(1) : sent ? exp.ex.toFixed(1) : "—"}</Cell>
                      <Cell t={over || actual == null ? "בפועל" : "בינתיים"} c={over && diff != null ? gapColor(diff) : "#fff"}>
                        {actual == null ? "—" : <>{r0(actual)}{over && diff != null && <span style={{ fontSize: 12 }}> ({sign(diff)})</span>}</>}
                      </Cell>
                    </div>
                  )}
                  {f?.cats?.beat != null && <div className="text-xs text-slate-300 text-center mt-2">הסיכוי לעבור את הממוצע: <span dir="ltr" style={NUM}>{f.cats.beat}%</span></div>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
