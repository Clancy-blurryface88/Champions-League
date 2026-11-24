import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabase";
import { Match, Round, User, PublicProfile } from "@/api/entities";
import OrbitSpinner from "@/components/OrbitSpinner";
import { pick } from "@/utils/forecastCalc";

// Everyone's round forecast, for the admin only (round_forecasts' RLS lets only admins read all rows):
// the forecast with its range, beside the player's round average and what was really earned, and how many
// outcomes and exact scores the odds expect from their picks. Nobody's picks are shown.
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

export default function AdminForecasts() {
  const [base, setBase] = useState(null); // rounds, matches, users
  const [roundId, setRoundId] = useState(null);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const [rounds, matches, users, profiles] = await Promise.all([Round.list("order"), Match.list(), User.list(), PublicProfile.list()]);
      const withMatches = rounds.filter((r) => r.is_active);
      const names = {};
      users.forEach((u) => { names[u.id] = profiles.find((p) => p.user_id === u.id)?.display_name || u.display_name || u.full_name || "—"; });
      setBase({ rounds: withMatches, matches, users, names });
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
      const [fs, ps] = await Promise.all([
        supabase.from("round_forecasts").select("*").eq("round_id", roundId),
        supabase.from("predictions").select("user_id,match_id,predicted_score_a,predicted_score_b,points_earned").in("match_id", ms.map((m) => m.id)),
      ]);
      if (fs.error || ps.error) throw fs.error || ps.error;
      if (off) return;
      const done = ms.filter((m) => m.is_score_calculated).length;
      const list = base.users.map((u) => {
        const mine = ps.data.filter((p) => p.user_id === u.id);
        const exp = mine.reduce((s, p) => {
          const k = pick(byId[p.match_id], Number(p.predicted_score_a) || 0, Number(p.predicted_score_b) || 0);
          return { dir: s.dir + k.oc[1], ex: s.ex + k.ex[1] };
        }, { dir: 0, ex: 0 });
        return {
          id: u.id, name: base.names[u.id], f: fs.data.find((f) => f.user_id === u.id) || null, sent: mine.length, exp,
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
          <div className="space-y-2">
            {rows.list.map(({ id, name, f, sent, exp, actual }) => {
              const gap = f?.avg == null ? null : Math.round(f.fc) - Math.round(f.avg);
              const diff = actual == null || !f ? null : Math.round(actual) - Math.round(f.fc);
              return (
                <div key={id} className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-white">{name}</span>
                    <span className="text-xs text-slate-400">
                      {!f ? (sent ? "אין תחזית שמורה" : "עוד לא נשלחו ניחושים") : f.backfill ? "חושבה בדיעבד" : `עודכנה ${new Date(f.updated_at).toLocaleString("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}`}
                    </span>
                  </div>
                  {f && (
                    <div className="grid grid-cols-4 gap-x-1 gap-y-2">
                      <Cell t="תחזית" c="#facc15">{r0(f.fc)}</Cell>
                      <Cell t="טווח">{f.lo}–{f.hi}</Cell>
                      <Cell t="ממוצע אישי">{r0(f.avg)}</Cell>
                      <Cell t="תחזית מול ממוצע" c={gap == null ? "#94a3b8" : gapColor(gap)}>{gap == null ? "—" : sign(gap)}</Cell>
                      <Cell t="מקסימום">{r0(f.max)}</Cell>
                      <Cell t="צפי כיוונים">{sent ? exp.dir.toFixed(1) : "—"}</Cell>
                      <Cell t="צפי מדויקות">{sent ? exp.ex.toFixed(1) : "—"}</Cell>
                      <Cell t={over || actual == null ? "בפועל" : "בינתיים"} c={over && diff != null ? gapColor(diff) : "#fff"}>
                        {actual == null ? "—" : <>{r0(actual)}{over && diff != null && <span style={{ fontSize: 12 }}> ({sign(diff)})</span>}</>}
                      </Cell>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
