import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabase";
import { Match, Prediction, Round, User, PublicProfile } from "@/api/entities";
import OrbitSpinner from "@/components/OrbitSpinner";
import { pick, computeForecast3, forecastEvenings } from "@/utils/forecastCalc";
import { forecastImage } from "@/utils/forecastImage";

// Everyone's round forecast, for the admin only (round_forecasts' RLS lets only admins read all rows):
// the forecast with its range, beside the player's round average and what was really earned, and how many
// outcomes and exact scores are expected from their picks. Nobody's picks are shown.
// A round still in play is calculated here for everyone by the current formula (some may have sent before it
// changed); a finished round shows what was stored. The round can be read whole or one evening at a time (the
// evenings add up to the round). Once everything shown is calculated, it can be switched to the forecast against
// what was really earned. "תמונה לשיתוף" makes a table picture of what is shown, for WhatsApp.
const NUM = { fontFamily: "var(--num-font)", fontWeight: 800 };
const r0 = (v) => (v == null ? "—" : Math.round(Number(v)));
const sign = (v) => (v > 0 ? `+${v}` : `${v}`);
const eveningOf = (d) => new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Jerusalem" });
const eveningName = (key) => { const d = new Date(`${key}T12:00:00Z`); return `${d.toLocaleDateString("he-IL", { weekday: "long", timeZone: "UTC" })} ${d.getUTCDate()}.${d.getUTCMonth() + 1}`; };
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
function ShareImage({ round, rows, exact, evening, compare }) {
  const [img, setImg] = useState(null); // { url, file }
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => () => { if (img) URL.revokeObjectURL(img.url); }, [img]);
  const make = async () => {
    setBusy(true); setMsg("");
    try {
      const blob = await forecastImage({ round, rows, exact, evening, compare });
      setImg({ url: URL.createObjectURL(blob), file: new File([blob], `forecast-round-${round}${evening ? "-evening" : ""}${compare ? "-result" : ""}.png`, { type: "image/png" }) });
    } catch (e) { setMsg(`שגיאה: ${e.message || e}`); }
    setBusy(false);
  };
  const canShare = img && typeof navigator.canShare === "function" && navigator.canShare({ files: [img.file] });
  const share = () => navigator.share({ files: [img.file] }).catch((e) => { if (e.name !== "AbortError") setMsg("השיתוף לא עבד, אפשר לשמור את התמונה"); });
  return (
    <div className="space-y-2">
      <button type="button" onClick={make} disabled={busy} className="w-full rounded-xl py-3 font-bold" style={{ background: "linear-gradient(135deg,#fde047,#eab308)", color: "#1a1405" }}>
        {busy ? "יוצר תמונה…" : img ? "↻ ליצור מחדש" : compare ? "🖼️ תמונה לשיתוף: תחזית מול בפועל" : "🖼️ תמונה לשיתוף"}
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
  const [eve, setEve] = useState(null); // the evening shown (null: the whole round)
  const [cmp, setCmp] = useState(false); // forecast against actual (only once everything shown is calculated)
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
    setEve(null);
    setError("");
    (async () => {
      const ms = base.matches.filter((m) => m.round_id === roundId);
      const byId = Object.fromEntries(ms.map((m) => [m.id, m]));
      const all = Object.fromEntries(base.matches.map((m) => [m.id, m]));
      const fs = await supabase.from("round_forecasts").select("*").eq("round_id", roundId);
      if (fs.error) throw fs.error;
      if (off) return;
      const done = ms.filter((m) => m.is_score_calculated).length;
      const start = ms.reduce((d, m) => (m.match_date < d ? m.match_date : d), ms[0]?.match_date || "");
      const before = (p) => all[p.match_id]?.is_score_calculated && !byId[p.match_id] && all[p.match_id].match_date < start;
      const everyone = base.preds.filter(before).map((p) => ({ match: all[p.match_id], prediction: p }));
      const days = [...new Set(ms.map((m) => eveningOf(m.match_date)))].sort();
      const list = base.users.map((u) => {
        const theirs = base.preds.filter((p) => p.user_id === u.id && all[p.match_id]);
        const mine = theirs.filter((p) => byId[p.match_id]);
        const past = theirs.filter(before).map((p) => ({ match: all[p.match_id], prediction: p }));
        const picks = mine.map((p) => ({ match: byId[p.match_id], a: Number(p.predicted_score_a) || 0, b: Number(p.predicted_score_b) || 0, p }));
        const odds = (L) => L.reduce((s, x) => { const k = pick(x.match, x.a, x.b); return { dir: s.dir + k.oc[1], ex: s.ex + k.ex[1] }; }, { dir: 0, ex: 0 });
        const came = (L) => ({ dir: L.filter((x) => Number(x.p.correct_outcome_points_earned) > 0).length, ex: L.filter((x) => Number(x.p.exact_score_points_earned) > 0).length });
        const earnedIn = (L) => (L.some((x) => x.match.is_score_calculated) ? L.reduce((s, x) => s + (x.match.is_score_calculated ? Number(x.p.points_earned) || 0 : 0), 0) : null);
        const stored = fs.data.find((x) => x.user_id === u.id) || null;
        const f = done === ms.length || !mine.length || (done > 0 && stored?.cats?.v === 3) ? stored : { ...computeForecast3(past, picks, base.matches, everyone), updated_at: stored?.updated_at };
        const exp = odds(picks);
        const onDay = (day) => picks.filter((x) => eveningOf(x.match.match_date) === day);
        const split = !f ? {} : forecastEvenings({ fc: Number(f.fc), dir: f.cats?.v >= 2 ? f.cats.dir : exp.dir }, past, Object.fromEntries(days.map((d) => [d, onDay(d)])), base.matches, (m) => eveningOf(m.match_date));
        const evenings = Object.fromEntries(days.map((day) => {
          const part = onDay(day);
          return [day, { f: split[day] || null, sent: part.length, exp: odds(part), actual: earnedIn(part), came: came(part) }];
        }));
        return { id: u.id, name: base.names[u.id], f, sent: mine.length, exp, actual: earnedIn(picks), came: came(picks), evenings };
      }).sort((a, b) => (Number(b.f?.fc) || -1) - (Number(a.f?.fc) || -1));
      // the exact scores expected from everyone together: half what the group hit a round so far, half what this round's picks expect
      const pastRounds = new Set(everyone.map((x) => x.match.round_id)).size;
      const hit = everyone.filter((x) => Number(x.prediction.exact_score_points_earned) > 0).length / (pastRounds || 1);
      const group = (of, share) => { const now = list.reduce((s, r) => s + (of(r).sent ? of(r).exp.ex : 0), 0); return pastRounds ? (hit * share + now) / 2 : now; };
      const count = (L) => ({ done: L.filter((m) => m.is_score_calculated).length, total: L.length });
      const byDay = Object.fromEntries(days.map((day) => { const L = ms.filter((m) => eveningOf(m.match_date) === day); return [day, { ...count(L), exact: Math.round(group((r) => r.evenings[day], L.length / ms.length)) }]; }));
      setRows({ list, days, byDay, ...count(ms), exact: Math.round(group((r) => r, 1)) });
    })().catch((e) => { if (!off) setError(e.message || String(e)); });
    return () => { off = true; };
  }, [base, roundId]);

  if (error) return <div dir="rtl" className="text-red-400 text-sm">שגיאה: {error}</div>;
  if (!base) return <div className="flex justify-center py-12"><OrbitSpinner size={40} /></div>;
  // what is shown: the whole round, or one evening of it
  const at = rows && eve ? rows.byDay[eve] : rows;
  const list = !rows ? [] : !eve ? rows.list : rows.list.map((r) => ({ ...r, ...r.evenings[eve], whole: r.f })).sort((x, y) => (Number(y.f?.fc) || -1) - (Number(x.f?.fc) || -1));
  const over = at && at.done === at.total;
  const order = base.rounds.find((r) => r.id === roundId)?.order;
  // a stored row from the first formula has no expected hits, so they come from the odds
  const dirOf = (f, exp) => (eve ? f.dir : f.cats?.v >= 2 ? f.cats.dir : exp.dir);
  const shareRows = list.filter((r) => r.f).map(({ name, f, exp }) => ({ name, fc: f.fc, lo: f.lo, hi: f.hi, dir: dirOf(f, exp) }));
  const compare = over && cmp;
  const results = list.filter((r) => r.f && r.sent && r.actual != null).sort((x, y) => y.actual - x.actual);
  const exactCame = results.reduce((s, r) => s + r.came.ex, 0);
  const resultRows = results.map(({ name, f, exp, actual, came }) => ({ name, fc: f.fc, lo: f.lo, hi: f.hi, dir: dirOf(f, exp), actual, adir: came.dir }));
  const inRange = resultRows.filter((r) => r.lo <= Math.round(r.actual) && Math.round(r.actual) <= r.hi).length;
  const miss = resultRows.length ? resultRows.reduce((s, r) => s + Math.abs(r.actual - r.fc), 0) / resultRows.length : 0;
  const chip = (on) => ({ background: on ? "#facc15" : "rgba(255,255,255,.08)", color: on ? "#1a1405" : "#fff" });

  return (
    <div dir="rtl" className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-white">תחזיות הניקוד של כולם</h2>
        <p className="text-sm text-slate-400">לאדמין בלבד, בלי הניחושים עצמם</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {base.rounds.map((r) => (
          <button key={r.id} type="button" onClick={() => setRoundId(r.id)} className="rounded-lg px-3 py-1.5 text-sm font-bold"
            style={chip(r.id === roundId)}>
            מחזור {r.order}
          </button>
        ))}
      </div>
      {!rows ? <div className="flex justify-center py-10"><OrbitSpinner size={36} /></div> : (
        <>
          {rows.days.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {[null, ...rows.days].map((day) => (
                <button key={day || "all"} type="button" onClick={() => setEve(day)} className="rounded-lg px-3 py-1.5 text-sm font-bold" style={chip(day === eve)}>
                  {day ? eveningName(day) : "כל המחזור"}
                </button>
              ))}
            </div>
          )}
          <div className="text-sm text-slate-300">
            {at.done === 0 ? (eve ? "הערב עוד לא חושב" : "המחזור עוד לא חושב") : over ? (eve ? "הערב הסתיים" : "המחזור הסתיים") : <>חושבו <span dir="ltr" style={NUM}>{at.done}/{at.total}</span> משחקים</>}
          </div>
          {over && results.length > 0 && (
            <div className="flex gap-2">
              {[[false, "תחזית"], [true, "תחזית מול בפועל"]].map(([v, t]) => (
                <button key={t} type="button" onClick={() => setCmp(v)} className="flex-1 rounded-lg py-2 text-sm font-bold" style={chip(v === cmp)}>{t}</button>
              ))}
            </div>
          )}
          {compare ? (<>
            <ShareImage key={`${roundId}-${eve}-cmp`} round={order} rows={resultRows} exact={at.exact} evening={eve ? eveningName(eve) : null} compare={{ exact: exactCame }} />
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-800 border border-slate-700 px-2 py-2.5">
              <Cell t="בתוך הטווח">{inRange}/{resultRows.length}</Cell>
              <Cell t="פספוס ממוצע">{miss.toFixed(1)}</Cell>
              <Cell t="מדויקות (צפי)">{exactCame}<span style={{ fontSize: 13, color: "#94a3b8" }}> ({at.exact})</span></Cell>
            </div>
            <div className="space-y-2">
              {results.map(({ id, name, f, exp, actual, came }) => {
                const d = Math.round(actual) - Math.round(f.fc), top = Math.max(f.hi, actual, 1) * 1.06, x = (v) => `${Math.min(100, (v / top) * 100)}%`;
                const inside = f.lo <= Math.round(actual) && Math.round(actual) <= f.hi;
                return (
                  <div key={id} className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">{name}</span>
                      <span className="text-xs font-bold" style={{ color: inside ? "#4ade80" : "#94a3b8" }}>{inside ? "בתוך הטווח" : actual > f.hi ? "מעל הטווח" : "מתחת לטווח"}</span>
                    </div>
                    {/* the range, the forecast (gold line) and what was earned (dot) */}
                    <div dir="ltr" className="relative mb-3" style={{ height: 18 }}>
                      <div className="absolute inset-x-0" style={{ top: 6, height: 6, borderRadius: 3, background: "rgba(255,255,255,.08)" }} />
                      <div className="absolute" style={{ top: 5, height: 8, left: x(f.lo), width: `calc(${x(f.hi)} - ${x(f.lo)})`, borderRadius: 4, background: "rgba(250,204,21,.35)" }} />
                      <div className="absolute" style={{ top: 0, height: 18, width: 3, marginLeft: -1, left: x(f.fc), borderRadius: 2, background: "#facc15" }} />
                      <div className="absolute" style={{ top: 3, height: 12, width: 12, marginLeft: -6, left: x(actual), borderRadius: "50%", background: gapColor(d), border: "2px solid #0f172a" }} />
                    </div>
                    <div className="grid grid-cols-4 gap-x-1">
                      <Cell t="תחזית" c="#facc15">{r0(f.fc)}</Cell>
                      <Cell t="בפועל" c={gapColor(d)}>{r0(actual)}<span style={{ fontSize: 12 }}> ({sign(d)})</span></Cell>
                      <Cell t="כיוונים (צפי)">{came.dir}<span style={{ fontSize: 13, color: "#94a3b8" }}> ({Math.round(dirOf(f, exp))})</span></Cell>
                      <Cell t="מדויקות">{came.ex}</Cell>
                    </div>
                  </div>
                );
              })}
            </div>
          </>) : (<>
          <div className="text-sm text-slate-300">{eve ? "צפי פגיעות מדויקות של כולם בערב: " : "צפי פגיעות מדויקות של כולם: "}<span dir="ltr" style={{ ...NUM, fontSize: 18, color: "#4ade80" }}>{at.exact}</span></div>
          {shareRows.length > 0 && <ShareImage key={`${roundId}-${eve}`} round={order} rows={shareRows} exact={at.exact} evening={eve ? eveningName(eve) : null} />}
          <div className="space-y-2">
            {list.map(({ id, name, f, whole, sent, exp, actual }) => {
              const gap = f?.avg == null ? null : Math.round(f.fc) - Math.round(f.avg);
              const diff = actual == null || !f ? null : Math.round(actual) - Math.round(f.fc);
              return (
                <div key={id} className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-white">{name}</span>
                    <span className="text-xs text-slate-400">
                      {!f ? (sent ? "אין תחזית שמורה" : "עוד לא נשלחו ניחושים") : eve ? `מתוך ${r0(whole?.fc)} למחזור` : f.backfill ? "חושבה בדיעבד" : f.updated_at && `נשלח ${new Date(f.updated_at).toLocaleString("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}`}
                    </span>
                  </div>
                  {f && eve && (
                    <div className="grid grid-cols-4 gap-x-1 gap-y-2">
                      <Cell t="תחזית לערב" c="#facc15">{r0(f.fc)}</Cell>
                      <Cell t="טווח">{f.lo}–{f.hi}</Cell>
                      <Cell t="צפי כיוונים">{f.dir.toFixed(1)}</Cell>
                      <Cell t={over || actual == null ? "בפועל" : "בינתיים"} c={over && diff != null ? gapColor(diff) : "#fff"}>
                        {actual == null ? "—" : <>{r0(actual)}{over && diff != null && <span style={{ fontSize: 12 }}> ({sign(diff)})</span>}</>}
                      </Cell>
                      {f.all && <>
                        <Cell t="ממוצע לערב">{r0(f.all.pts)}</Cell>
                        <Cell t={`ממוצע ב${eveningName(eve).split(" ")[1]}`}>{f.same ? r0(f.same.pts) : "—"}</Cell>
                        <Cell t="כיוונים לערב">{f.all.dir.toFixed(1)}</Cell>
                        <Cell t="מדויקות לערב">{f.all.exact.toFixed(1)}</Cell>
                      </>}
                    </div>
                  )}
                  {f && !eve && (
                    <div className="grid grid-cols-4 gap-x-1 gap-y-2">
                      <Cell t="תחזית" c="#facc15">{r0(f.fc)}</Cell>
                      <Cell t="טווח">{f.lo}–{f.hi}</Cell>
                      <Cell t="ממוצע אישי">{r0(f.avg)}</Cell>
                      <Cell t="תחזית מול ממוצע" c={gap == null ? "#94a3b8" : gapColor(gap)}>{gap == null ? "—" : sign(gap)}</Cell>
                      <Cell t="מקסימום">{r0(f.max)}</Cell>
                      <Cell t="צפי כיוונים">{f.cats?.v >= 2 ? f.cats.dir.toFixed(1) : sent ? exp.dir.toFixed(1) : "—"}</Cell>
                      <Cell t="צפי מדויקות">{f.cats?.v >= 2 ? f.cats.exact.toFixed(1) : sent ? exp.ex.toFixed(1) : "—"}</Cell>
                      <Cell t={over || actual == null ? "בפועל" : "בינתיים"} c={over && diff != null ? gapColor(diff) : "#fff"}>
                        {actual == null ? "—" : <>{r0(actual)}{over && diff != null && <span style={{ fontSize: 12 }}> ({sign(diff)})</span>}</>}
                      </Cell>
                    </div>
                  )}
                  {!eve && f?.cats?.beat != null && <div className="text-xs text-slate-300 text-center mt-2">הסיכוי לעבור את הממוצע: <span dir="ltr" style={NUM}>{f.cats.beat}%</span></div>}
                </div>
              );
            })}
          </div>
          </>)}
        </>
      )}
    </div>
  );
}
