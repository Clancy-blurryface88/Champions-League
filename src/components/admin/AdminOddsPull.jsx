import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabase";
import { Round, Match } from "@/api/entities";

// Pull a round's odds (api/_odds.js: Coral → Ladbrokes → LeoVegas → …, rounded up
// to 0.05) and write them into the match cards — the same fields as the manual
// edit, which stays available afterwards. "Preview" only shows; nothing is saved
// until "Save". Exact-score odds are not pulled (still from the 888 screenshot).

const box = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" };
const FIELDS = [
  ["home_win_points", "1"], ["draw_points", "X"], ["away_win_points", "2"],
  ["btts_yes_points", "כן"], ["btts_no_points", "לא"],
  ["goals_0_2_points", "0-2"], ["goals_3_4_points", "3-4"], ["goals_5_plus_points", "5+"],
];
const fmt = (iso) => new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const hasOdds = (m) => FIELDS.some(([f]) => m?.[f] != null && Number(m[f]) > 0);

export default function AdminOddsPull() {
  const [rounds, setRounds] = useState([]);
  const [roundId, setRoundId] = useState("");
  const [current, setCurrent] = useState({});
  const [pulled, setPulled] = useState(null);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    Promise.all([Round.list("order"), Match.list()]).then(([rs, ms]) => {
      setRounds(rs);
      // default: the round of the next match to kick off
      const next = ms.filter((m) => new Date(m.match_date) > new Date()).sort((a, b) => new Date(a.match_date) - new Date(b.match_date))[0];
      setRoundId(next?.round_id || rs[rs.length - 1]?.id || "");
    });
  }, []);
  useEffect(() => {
    setPulled(null); setMsg("");
    if (!roundId) return;
    Match.filter({ round_id: roundId }).then((ms) => setCurrent(Object.fromEntries(ms.map((m) => [m.id, m]))));
  }, [roundId]);

  const pull = async () => {
    setBusy("pull"); setMsg(""); setPulled(null);
    try {
      const { data } = await supabase.auth.getSession();
      const r = await fetch(`/api/football?source=odds&round=${roundId}`, { headers: { Authorization: `Bearer ${data.session?.access_token || ""}` } });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || r.status);
      setPulled(j);
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

  return (
    <div className="space-y-4" dir="rtl">
      <div className="rounded-2xl p-4" style={box}>
        <h3 className="text-white font-bold mb-1">📥 משיכת יחסים</h3>
        <div className="text-xs text-slate-400 mb-3">1X2, שתי הקבוצות מבקיעות וטווח שערים מ-Coral (גיבוי: Ladbrokes, LeoVegas, William Hill, LiveScoreBet), מעוגלים למעלה ל-0.05. "תצוגה מקדימה" לא שומרת כלום. תוצאה מדויקת ממשיכה להגיע מהצילום של 888. משחק שכבר התחיל לא נמשך.</div>
        <div className="flex flex-wrap gap-2 items-center">
          <select value={roundId} onChange={(e) => setRoundId(e.target.value)} className="bg-slate-900 border border-white/15 text-white text-sm rounded-md px-2 py-1.5">
            {rounds.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button onClick={pull} disabled={!roundId || !!busy} className="text-sm px-3 py-1.5 rounded-md bg-sky-500/20 border border-sky-400/60 text-white disabled:opacity-50">
            {busy === "pull" ? "מושך…" : "👁️ תצוגה מקדימה"}
          </button>
          {pulled && (
            <button onClick={save} disabled={!ready.length || !!busy} className="text-sm px-3 py-1.5 rounded-md bg-emerald-500/20 border border-emerald-400/60 text-white disabled:opacity-50">
              {busy === "save" ? "שומר…" : `💾 שמור ב-${ready.length} משחקים`}
            </button>
          )}
          {pulled?.creditsLeft != null && <span className="text-xs text-slate-400">קרדיטים שנשארו החודש: {pulled.creditsLeft}</span>}
        </div>
        {msg && <div className="text-sm mt-3 text-slate-200">{msg}</div>}
      </div>

      {pulled && (
        <div className="space-y-2">
          <div className="text-[11px] text-slate-500 px-1">בכל תא: היחס שנמשך (ירוק = שונה מהקיים), ומתחתיו באפור מה ששמור היום בכרטיס</div>
          {pulled.rows.map((r) => (
            <div key={r.id} className="rounded-xl p-3" style={box}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-slate-100 text-sm font-semibold">{r.team_a} – {r.team_b}</span>
                <span className="text-slate-500 text-xs whitespace-nowrap">{fmt(r.match_date)}</span>
              </div>
              {r.sources && Object.values(r.sources).some((s) => s !== "Coral") && (
                <div className="text-slate-400 text-xs">מקור: {Object.entries(r.sources).map(([c, s]) => `${{ h2h: "1X2", btts: "מבקיעות", bands: "שערים" }[c]} ${s}`).join(" · ")}</div>
              )}
              {r.skipped && <div className="text-amber-300 text-xs mt-1">{r.skipped}</div>}
              {r.missing?.length > 0 && <div className="text-amber-300 text-xs mt-1">חסר: {r.missing.join(", ")}</div>}
              {!r.skipped && (
                <div className="grid grid-cols-8 gap-1 mt-2 text-xs">
                  {FIELDS.map(([f, l], i) => {
                    const now = current[r.id]?.[f], next = r.values?.[f];
                    const changed = next != null && Number(now) !== next;
                    // a gap between the three groups: 1X2 | both score | goals
                    return (
                      <div key={f} className={`text-center rounded-md py-1 ${i === 3 || i === 5 ? "ms-1.5" : ""}`} style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div className="text-slate-500 text-[10px]">{l}</div>
                        <div className={next == null ? "text-slate-600" : changed ? "text-emerald-300 font-semibold" : "text-slate-200"}>{next ?? "—"}</div>
                        {now != null && Number(now) > 0 && <div className="text-slate-500 text-[10px]">{Number(now)}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
