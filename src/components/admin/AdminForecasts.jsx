import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/api/supabase";
import { Match, Prediction, Round, User, PublicProfile } from "@/api/entities";
import OrbitSpinner from "@/components/OrbitSpinner";
import { pick, computeForecast3, forecastEvenings } from "@/utils/forecastCalc";
import { forecastImage } from "@/utils/forecastImage";
import { calculateScore } from "@/utils/scoring";
import { findDbMatch } from "@/components/LiveLeaderboard";
import { TOURNAMENT_CODE } from "@/config/tournament";

// Everyone's round forecast, for the admin only (round_forecasts' RLS lets only admins read all rows):
// the forecast with its range, beside the player's round average and what was really earned, and how many
// outcomes and exact scores are expected from their picks. Nobody's picks are shown.
// A round still in play is calculated here for everyone by the current formula (some may have sent before it
// changed); a finished round shows what was stored. The round can be read whole or one evening at a time (the
// evenings add up to the round). Three tabs: the forecast; against live — matches in play count by their score right
// now (refreshed every minute, scored like the live table); against actual — calculated matches only, and the final
// comparison once all of them are. In the admin panel, and as a sheet from the header's button (ForecastSheet). "תמונה לשיתוף" makes a table picture of what is shown, for WhatsApp.
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

const K = "skewX(-13.5deg)", UK = "skewX(13.5deg)";
const GOLD_BG = "linear-gradient(135deg,#fde047,#eab308)";
// a slanted plate button (rounds and evenings)
function Plate({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="px-3.5 py-1.5 text-sm font-bold"
      style={{ transform: K, borderRadius: 4, background: on ? GOLD_BG : "rgba(255,255,255,.08)", border: `1px solid ${on ? "transparent" : "rgba(255,255,255,.22)"}`, color: on ? "#1a1405" : "#fff" }}>
      <span style={{ display: "block", transform: UK, whiteSpace: "nowrap" }}>{children}</span>
    </button>
  );
}
const TABS = [["fc", "תחזית", GOLD_BG, "#1a1405"], ["live", "תחזית / לייב", "linear-gradient(135deg,#fb7185,#e11d48)", "#fff"], ["act", "תחזית / בפועל", "linear-gradient(135deg,#4ade80,#0ea5c6)", "#04201d"]];
function Tabs({ mode, onMode, liveOn }) {
  return (
    <div className="grid grid-cols-3" style={{ transform: K, borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,.28)", background: "rgba(255,255,255,.06)", margin: "12px 8px 0" }}>
      {TABS.map(([id, label, bg, ink], i) => (
        <button key={id} type="button" onClick={() => onMode(id)} className="relative font-bold" style={{ height: 42, borderInlineStart: i ? "1px solid rgba(255,255,255,.18)" : 0, color: mode === id ? ink : "rgba(255,255,255,.75)" }}>
          {mode === id && <motion.span layoutId="fc-tab" className="absolute inset-0" style={{ background: bg }} transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
          <span className="relative flex items-center justify-center gap-1.5" style={{ transform: UK, fontSize: 13.5, whiteSpace: "nowrap" }}>
            {id === "live" && liveOn && <span className="animate-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: mode === "live" ? "#fff" : "#f43f5e" }} />}{label}
          </span>
        </button>
      ))}
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
      <button type="button" onClick={make} disabled={busy} className="w-full rounded-xl py-3 font-bold" style={{ background: GOLD_BG, color: "#1a1405" }}>
        {busy ? "יוצר תמונה…" : img ? "↻ ליצור מחדש" : compare ? `🖼️ תמונה לשיתוף: תחזית מול ${compare.live ? "לייב" : "בפועל"}` : "🖼️ תמונה לשיתוף"}
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

export default function AdminForecasts({ sheet = false }) {
  const [base, setBase] = useState(null); // rounds, matches, users
  const [roundId, setRoundId] = useState(null);
  const [rows, setRows] = useState(null);
  const [eve, setEve] = useState(null); // the evening shown (null: the whole round)
  const [mode, setMode] = useState("fc"); // the tab: fc | live | act
  const [live, setLive] = useState({}); // matches not calculated yet: { id: { a, b } }, the score now (or last seen)
  const seen = useRef({});
  const opened = useRef(null); // the round whose opening evening and tab were already chosen
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

  useEffect(() => { setRows(null); setEve(null); setError(""); }, [roundId]);

  // while the round is being played: its matches, points and the live scores, every minute
  useEffect(() => {
    if (!base || !roundId) return undefined;
    let off = false;
    const tick = async () => {
      if (document.hidden) return;
      const now = new Date().toISOString();
      const { data: ms } = await supabase.from("matches").select("*").eq("round_id", roundId);
      const open = (ms || []).filter((m) => !m.is_score_calculated && m.match_date <= now);
      const day = (d) => new Date(d).toLocaleDateString("sv-SE");
      const [ps, feed] = !ms?.length ? [{}, null] : await Promise.all([
        supabase.from("predictions").select("*").in("match_id", ms.map((m) => m.id)),
        open.length ? fetch(`/api/football?competition=${TOURNAMENT_CODE}&filter=LIVE&dateFrom=${day(Date.now() - 864e5)}&dateTo=${day(Date.now())}`).then((r) => r.json()).catch(() => null) : null,
      ]);
      if (off) return;
      for (const lm of feed?.matches || []) {
        const m = findDbMatch(lm, open);
        if (m) seen.current[m.id] = { a: lm.score?.fullTime?.home ?? lm.score?.halfTime?.home ?? 0, b: lm.score?.fullTime?.away ?? lm.score?.halfTime?.away ?? 0 };
      }
      const next = {};
      for (const m of open) {
        if (seen.current[m.id]) next[m.id] = seen.current[m.id];
        else if (m.actual_score_a != null && m.actual_score_b != null) next[m.id] = { a: m.actual_score_a, b: m.actual_score_b };
      }
      setLive(next);
      if (ps.data) setBase((b) => ({ ...b, matches: [...b.matches.filter((m) => m.round_id !== roundId), ...ms], preds: [...b.preds.filter((x) => !ms.some((m) => m.id === x.match_id)), ...ps.data] }));
    };
    const playing = base.matches.some((m) => m.round_id === roundId && !m.is_score_calculated && m.match_date <= new Date().toISOString());
    if (playing) tick().catch(() => {});
    const t = setInterval(() => { if (base.matches.some((m) => m.round_id === roundId && !m.is_score_calculated)) tick().catch(() => {}); }, 60000);
    return () => { off = true; clearInterval(t); };
  }, [!!base, roundId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!base || !roundId) return undefined;
    let off = false;
    (async () => {
      const ms = base.matches.filter((m) => m.round_id === roundId);
      const byId = Object.fromEntries(ms.map((m) => [m.id, m]));
      const all = Object.fromEntries(base.matches.map((m) => [m.id, m]));
      const fs = await supabase.from("round_forecasts").select("*").eq("round_id", roundId);
      if (fs.error) throw fs.error;
      if (off) return;
      const done = ms.filter((m) => m.is_score_calculated).length;
      const started = ms.some((m) => m.match_date <= new Date().toISOString());
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
        // what a pick earned: the points of a calculated match, or (withLive) what the score now would give; else null
        const got = (x, withLive) => {
          if (x.match.is_score_calculated) return { pts: Number(x.p.points_earned) || 0, dir: Number(x.p.correct_outcome_points_earned) > 0, ex: Number(x.p.exact_score_points_earned) > 0 };
          const now = withLive && live[x.match.id];
          if (!now) return null;
          const c = calculateScore(x.p, { ...x.match, actual_score_a: now.a, actual_score_b: now.b });
          return { pts: Number(c.totalPoints) || 0, dir: c.parts.outcome > 0, ex: c.parts.exact > 0 };
        };
        const earnedIn = (L, wl) => { const G = L.map((x) => got(x, wl)).filter(Boolean); return G.length ? G.reduce((s, g) => s + g.pts, 0) : null; };
        const came = (L, wl) => { const G = L.map((x) => got(x, wl)).filter(Boolean); return { dir: G.filter((g) => g.dir).length, ex: G.filter((g) => g.ex).length }; };
        const stored = fs.data.find((x) => x.user_id === u.id) || null;
        const f = done === ms.length || !mine.length || (started && stored?.cats?.v === 3) ? stored : { ...computeForecast3(past, picks, base.matches, everyone), updated_at: stored?.updated_at };
        const exp = odds(picks);
        const onDay = (day) => picks.filter((x) => eveningOf(x.match.match_date) === day);
        const split = !f ? {} : forecastEvenings({ fc: Number(f.fc), dir: f.cats?.v >= 2 ? f.cats.dir : exp.dir }, past, Object.fromEntries(days.map((d) => [d, onDay(d)])), base.matches, (m) => eveningOf(m.match_date));
        const evenings = Object.fromEntries(days.map((day) => {
          const part = onDay(day);
          return [day, { f: split[day] || null, sent: part.length, exp: odds(part), actual: earnedIn(part), came: came(part), liveActual: earnedIn(part, true), liveCame: came(part, true) }];
        }));
        return { id: u.id, name: base.names[u.id], f, sent: mine.length, exp, actual: earnedIn(picks), came: came(picks), liveActual: earnedIn(picks, true), liveCame: came(picks, true), evenings };
      }).sort((a, b) => (Number(b.f?.fc) || -1) - (Number(a.f?.fc) || -1));
      // the exact scores expected from everyone together: half what the group hit a round so far, half what this round's picks expect
      const pastRounds = new Set(everyone.map((x) => x.match.round_id)).size;
      const hit = everyone.filter((x) => Number(x.prediction.exact_score_points_earned) > 0).length / (pastRounds || 1);
      const group = (of, share) => { const now = list.reduce((s, r) => s + (of(r).sent ? of(r).exp.ex : 0), 0); return pastRounds ? (hit * share + now) / 2 : now; };
      const count = (L) => ({ done: L.filter((m) => m.is_score_calculated).length, live: L.filter((m) => !m.is_score_calculated && live[m.id]).length, total: L.length });
      const byDay = Object.fromEntries(days.map((day) => { const L = ms.filter((m) => eveningOf(m.match_date) === day); return [day, { ...count(L), exact: Math.round(group((r) => r.evenings[day], L.length / ms.length)) }]; }));
      // a round opens on tonight's evening, and on the tab that fits what is going on
      if (opened.current !== roundId) {
        opened.current = roundId;
        const today = days.find((d) => d === eveningOf(new Date())) || null, c = today ? byDay[today] : count(ms);
        setEve(today);
        setMode(ms.some((m) => !m.is_score_calculated && m.match_date <= new Date().toISOString() && (!today || eveningOf(m.match_date) === today)) ? "live" : c.done === c.total && c.total ? "act" : "fc");
      }
      setRows({ list, days, byDay, ...count(ms), exact: Math.round(group((r) => r, 1)) });
    })().catch((e) => { if (!off) setError(e.message || String(e)); });
    return () => { off = true; };
  }, [base, roundId, live]);

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
  const isLive = mode === "live", final = mode === "act" && over;
  const compare = !!at && (isLive ? at.live > 0 : mode === "act" && at.done > 0) && list.some((r) => r.f && r.sent); // there is something to set the forecast against
  const results = list.map((r) => (isLive ? { ...r, actual: r.liveActual, came: r.liveCame } : r)).filter((r) => r.f && r.sent && r.actual != null).sort((x, y) => y.actual - x.actual);
  const exactCame = results.reduce((s, r) => s + r.came.ex, 0);
  const resultRows = results.map(({ name, f, exp, actual, came }) => ({ name, fc: f.fc, lo: f.lo, hi: f.hi, dir: dirOf(f, exp), actual, adir: came.dir }));
  const inRange = resultRows.filter((r) => r.lo <= Math.round(r.actual) && Math.round(r.actual) <= r.hi).length;
  const passed = resultRows.filter((r) => Math.round(r.actual) >= Math.round(r.fc)).length;
  const clock = new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  const miss = resultRows.length ? resultRows.reduce((s, r) => s + Math.abs(r.actual - r.fc), 0) / resultRows.length : 0;

  return (
    <div dir="rtl" className="space-y-4 max-w-2xl">
      {!sheet && <div>
        <h2 className="text-xl font-bold text-white">תחזיות הניקוד של כולם</h2>
        <p className="text-sm text-slate-400">לאדמין בלבד, בלי הניחושים עצמם</p>
      </div>}
      <div className="flex flex-wrap gap-2 px-1">
        {base.rounds.map((r) => (
          <Plate key={r.id} on={r.id === roundId} onClick={() => setRoundId(r.id)}>מחזור {r.order}</Plate>
        ))}
      </div>
      {!rows ? <div className="flex justify-center py-10"><OrbitSpinner size={36} /></div> : (
        <>
          {rows.days.length > 1 && (
            <div className="flex flex-wrap gap-2 px-1">
              {[null, ...rows.days].map((day) => (
                <Plate key={day || "all"} on={day === eve} onClick={() => setEve(day)}>{day ? eveningName(day).replace("יום ", "") : "כל המחזור"}</Plate>
              ))}
            </div>
          )}
          <div className="text-sm text-slate-300">
            {at.done === 0 && at.live === 0 ? (eve ? "הערב עוד לא חושב" : "המחזור עוד לא חושב") : over ? (eve ? "הערב הסתיים" : "המחזור הסתיים") : <>חושבו <span dir="ltr" style={NUM}>{at.done}/{at.total}</span> משחקים</>}
            {at.live > 0 && <span className="font-bold" style={{ color: "#f87171" }}> · {at.live} בלייב</span>}
          </div>
          <Tabs mode={mode} onMode={setMode} liveOn={at.live > 0} />
          {mode !== "fc" && !compare && (
            <div className="rounded-xl text-center py-8 text-sm" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", color: "#cbd5e1" }}>
              {isLive ? (over ? "המשחקים הסתיימו, ההשוואה בלשונית תחזית / בפועל" : at.live ? "אין תחזיות להשוואה" : "אין כרגע משחקים בלייב") : at.done ? "אין תחזיות להשוואה" : "עוד אין משחקים שחושבו"}
            </div>
          )}
          {compare ? (<>
            <ShareImage key={`${roundId}-${eve}-${mode}-${final}`} round={order} rows={resultRows} exact={at.exact} evening={eve ? eveningName(eve) : null} compare={{ exact: exactCame, live: isLive ? clock : null, partial: !isLive && !over ? `${at.done} מתוך ${at.total}` : null }} />
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/5 border border-white/10 px-2 py-2.5">
              {final ? <Cell t="בתוך הטווח">{inRange}/{resultRows.length}</Cell> : <Cell t="עברו את התחזית">{passed}/{resultRows.length}</Cell>}
              {final ? <Cell t="פספוס ממוצע">{miss.toFixed(1)}</Cell> : isLive ? <Cell t="עודכן">{clock}</Cell> : <Cell t="משחקים שחושבו">{at.done}/{at.total}</Cell>}
              <Cell t="מדויקות (צפי)">{exactCame}<span style={{ fontSize: 13, color: "#94a3b8" }}> ({at.exact})</span></Cell>
            </div>
            <div className="space-y-2">
              {results.map(({ id, name, f, exp, actual, came }) => {
                const d = Math.round(actual) - Math.round(f.fc), top = Math.max(f.hi, actual, 1) * 1.06, x = (v) => `${Math.min(100, (v / top) * 100)}%`;
                const inside = f.lo <= Math.round(actual) && Math.round(actual) <= f.hi;
                return (
                  <div key={id} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">{name}</span>
                      <span className="text-xs font-bold" style={{ color: !final ? (isLive ? "#f87171" : "#facc15") : inside ? "#4ade80" : "#94a3b8" }}>{!final ? (isLive ? "בלייב" : "עד כה") : inside ? "בתוך הטווח" : actual > f.hi ? "מעל הטווח" : "מתחת לטווח"}</span>
                    </div>
                    {/* the range, the forecast (gold line) and what was earned (dot) */}
                    <div dir="ltr" className="relative mb-3" style={{ height: 18 }}>
                      <div className="absolute inset-x-0" style={{ top: 6, height: 6, borderRadius: 3, background: "rgba(255,255,255,.08)" }} />
                      <div className="absolute" style={{ top: 5, height: 8, left: x(f.lo), width: `calc(${x(f.hi)} - ${x(f.lo)})`, borderRadius: 4, background: "rgba(250,204,21,.35)" }} />
                      <div className="absolute" style={{ top: 0, height: 18, width: 3, marginLeft: -1, left: x(f.fc), borderRadius: 2, background: "#facc15" }} />
                      <div className="absolute" style={{ top: 3, height: 12, width: 12, marginLeft: -6, left: x(actual), borderRadius: "50%", background: final || d >= 0 ? gapColor(d) : "#38bdf8", border: "2px solid #0f172a" }} />
                    </div>
                    <div className="grid grid-cols-5 gap-x-1">
                      <Cell t="תחזית" c="#facc15">{r0(f.fc)}</Cell>
                      <Cell t={isLive ? "עכשיו" : "בפועל"} c={final || d >= 0 ? gapColor(d) : "#fff"}>{r0(actual)}<span style={{ fontSize: 12 }}> ({sign(d)})</span></Cell>
                      <Cell t="צפי כיוונים" c="#facc15">{Math.round(dirOf(f, exp))}</Cell>
                      <Cell t={isLive ? "כיוונים עכשיו" : "כיוונים בפועל"} c="#38bdf8">{came.dir}</Cell>
                      <Cell t="מדויקות">{came.ex}</Cell>
                    </div>
                  </div>
                );
              })}
            </div>
          </>) : mode === "fc" && (<>
          <div className="text-sm text-slate-300">{eve ? "צפי פגיעות מדויקות של כולם בערב: " : "צפי פגיעות מדויקות של כולם: "}<span dir="ltr" style={{ ...NUM, fontSize: 18, color: "#4ade80" }}>{at.exact}</span></div>
          {shareRows.length > 0 && <ShareImage key={`${roundId}-${eve}`} round={order} rows={shareRows} exact={at.exact} evening={eve ? eveningName(eve) : null} />}
          <div className="space-y-2">
            {list.map(({ id, name, f, whole, sent, exp, actual }) => {
              const gap = f?.avg == null ? null : Math.round(f.fc) - Math.round(f.avg);
              const diff = actual == null || !f ? null : Math.round(actual) - Math.round(f.fc);
              return (
                <div key={id} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
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

// the same screen over the app, from the header's button (admins only)
export function ForecastSheet({ onClose }) {
  return (
    <motion.div className="fixed inset-0 z-[70] overflow-y-auto" style={{ background: "linear-gradient(170deg,#12286b,#081230 45%,#040818)", padding: "max(14px, env(safe-area-inset-top)) 14px 40px" }}
      initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 32 }}>
      <div className="mx-auto max-w-2xl">
        <div dir="rtl" className="flex items-center justify-between mb-4">
          <span className="text-xl font-extrabold text-white">תחזיות הניקוד</span>
          <button type="button" onClick={onClose} aria-label="סגירה" className="grid place-items-center text-white text-lg" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)" }}>✕</button>
        </div>
        <AdminForecasts sheet />
      </div>
    </motion.div>
  );
}
