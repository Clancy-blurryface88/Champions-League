import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Match, Prediction, User } from "@/api/entities";
import TeamFlag from "@/components/TeamFlag";

// READ-ONLY dry run of "auto-finish": every 3 minutes (while this tab is
// open) it compares our matches with UEFA's live status and shows what an
// automation WOULD do — mark finished + fill the final score — plus the
// points each participant would get. Nothing is written, no push is sent;
// the real flow (toggle + score + "Calculate Scores") stays manual.

const REFRESH_MS = 3 * 60 * 1000;
const PAIR_WINDOW_MS = 3 * 3600e3; // our kickoff vs UEFA kickoff

const norm = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
// UEFA's names include 3-letter team codes ("mun" = Man Utd), so short names
// must match exactly — a "contains" check paired "Bayern MUNich" with Man Utd.
// Longer names may match by prefix/containment or by the same first word
// ("Bayern Munich" ↔ "Bayern München", "Atletico Madrid" ↔ "Atlético de Madrid").
function sameTeam(ours, names) {
  const w = norm(ours);
  const wFirst = w.split(/\s+/)[0];
  return names.some((n) => {
    const c = norm(n);
    if (c === w) return true;
    if (c.length <= 4 || w.length <= 4) return false;
    if (c.startsWith(w) || w.startsWith(c) || c.includes(w) || w.includes(c)) return true;
    const cFirst = c.split(/\s+/)[0];
    return wFirst.length >= 4 && wFirst === cFirst;
  });
}
// Among UEFA matches kicking off near ours, pick the one where the most sides
// match (both > one). A tie means it's ambiguous → no pairing rather than a guess.
function findUefa(match, uefa) {
  const t = new Date(match.match_date).getTime();
  const scored = uefa
    .filter((u) => Math.abs(new Date(u.utcDate).getTime() - t) <= PAIR_WINDOW_MS)
    .map((u) => ({ u, s: (sameTeam(match.team_a, u.homeNames) ? 1 : 0) + (sameTeam(match.team_b, u.awayNames) ? 1 : 0) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  if (!scored.length) return null;
  if (scored.length > 1 && scored[0].s === scored[1].s) return null;
  return scored[0].u;
}

// Same rules as AdminScoring.calculateScore (copied so the real scoring code
// is not touched by this experiment).
function simPoints(p, m, a, b) {
  const pa = p.predicted_score_a, pb = p.predicted_score_b;
  if (pa == null || pb == null) return 0;
  let total = 0;
  if (pa === a && pb === b) total += m.score_odds ? (m.score_odds[`${a}:${b}`] ?? m.score_odds.other ?? 0) : (m.exact_score_points || 0);
  const o = (x, y) => (x > y ? "home" : x < y ? "away" : "draw");
  if (o(pa, pb) === o(a, b)) total += o(a, b) === "home" ? m.home_win_points || 0 : o(a, b) === "away" ? m.away_win_points || 0 : m.draw_points || 0;
  const bt = (x, y) => x > 0 && y > 0;
  if (bt(pa, pb) === bt(a, b)) total += bt(a, b) ? m.btts_yes_points || 0 : m.btts_no_points || 0;
  const rg = (g) => (g <= 2 ? "0-2" : g <= 4 ? "3-4" : "5+");
  if (rg(pa + pb) === rg(a + b)) total += rg(a + b) === "0-2" ? m.goals_0_2_points || 0 : rg(a + b) === "3-4" ? m.goals_3_4_points || 0 : m.goals_5_plus_points || 0;
  return Math.round(total * 100) / 100;
}

const ilTime = (d) => new Date(d).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

function verdict(m, u) {
  if (!u) return { tone: "slate", text: "לא נמצא באופ\"א" };
  if (u.status !== "FINISHED") return { tone: "sky", text: u.status === "LIVE" ? `⏳ חי${u.minute ? ` · דקה ${u.minute}` : ""}` : "⏳ טרם התחיל" };
  const a = u.score.home, b = u.score.away;
  if (m.is_finished) {
    const same = m.actual_score_a === a && m.actual_score_b === b;
    return same ? { tone: "emerald", text: "✓ כבר עודכן ידנית — תואם" } : { tone: "red", text: `⚠️ אצלנו ${m.actual_score_a}-${m.actual_score_b}, אופ"א ${a}-${b}` };
  }
  return { tone: "yellow", text: `✅ היה מסומן "הסתיים" עם ${a}-${b}` };
}

const TONES = {
  slate: "text-slate-400 bg-white/5 border-white/10",
  sky: "text-sky-300 bg-sky-500/10 border-sky-500/30",
  emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  yellow: "text-yellow-300 bg-yellow-500/10 border-yellow-500/30",
  red: "text-red-300 bg-red-500/10 border-red-500/30",
};

export default function AdminFinishCheck() {
  const [matches, setMatches] = useState([]);
  const [uefa, setUefa] = useState([]);
  const [preds, setPreds] = useState({});
  const [names, setNames] = useState({});
  const [checkedAt, setCheckedAt] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [r, all] = await Promise.all([fetch("/api/uefa-recent-matches?window=1").then((x) => x.json()), Match.list()]);
      if (!r.success) throw new Error(r.error || "UEFA error");
      const now = Date.now();
      const ours = all
        .filter((m) => { const t = new Date(m.match_date).getTime(); return t >= now - 36 * 3600e3 && t <= now + 12 * 3600e3; })
        .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
      setUefa(r.matches);
      setMatches(ours);
      setCheckedAt(new Date());
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    User.list().then((us) => setNames(Object.fromEntries(us.map((u) => [u.id, u.display_name || u.full_name || u.email?.split("@")[0] || "?"])))).catch(() => {});
  }, []);

  const rows = useMemo(() => matches.map((m) => ({ m, u: findUefa(m, uefa) })), [matches, uefa]);

  const loadPreds = async (matchId) => {
    setOpen(open === matchId ? null : matchId);
    if (!preds[matchId]) {
      const list = await Prediction.filter({ match_id: matchId }).catch(() => []);
      setPreds((p) => ({ ...p, [matchId]: list }));
    }
  };

  return (
    <div dir="rtl" className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">🧪 בדיקת סיום משחקים</h2>
        <p className="text-slate-400 text-sm">
          קריאה בלבד: משווה את המשחקים שלנו (36 שעות אחורה עד 12 קדימה) מול אופ"א ומראה מה אוטומציה <b>הייתה</b> עושה. שום דבר לא נשמר ולא נשלחת התראה.
        </p>
        <p className="text-slate-500 text-xs mt-1">
          מתרענן לבד כל 3 דקות כל עוד הטאב פתוח{checkedAt ? ` · נבדק לאחרונה ${checkedAt.toLocaleTimeString("he-IL")}` : ""}
        </p>
        {error && <p className="text-red-400 text-xs mt-1">שגיאה: {error}</p>}
      </div>

      {!rows.length && <p className="text-slate-500 text-sm">אין משחקים בטווח הזמן הזה.</p>}

      <div className="space-y-2">
        {rows.map(({ m, u }) => {
          const v = verdict(m, u);
          const fin = u?.status === "FINISHED";
          const list = preds[m.id];
          return (
            <div key={m.id} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[11px] text-slate-500 w-20">{ilTime(m.match_date)}</span>
                <div className="flex items-center gap-1.5 min-w-0 flex-1" dir="ltr">
                  <TeamFlag logo={m.team_a_logo} name={m.team_a} className="w-5 h-5" />
                  <span className="text-sm text-white truncate">{m.team_a}</span>
                  <span className="text-slate-500 text-xs">vs</span>
                  <span className="text-sm text-white truncate">{m.team_b}</span>
                  <TeamFlag logo={m.team_b_logo} name={m.team_b} className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-slate-400">אצלנו: {m.is_finished ? `הסתיים ${m.actual_score_a}-${m.actual_score_b}` : "לא הסתיים"}</span>
                <span className="text-[11px] text-slate-400">אופ"א: {u ? (u.score.home != null ? `${u.score.home}-${u.score.away}` : "—") : "—"}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${TONES[v.tone]}`}>{v.text}</span>
                {fin && (
                  <button onClick={() => loadPreds(m.id)} className="text-[11px] text-sky-300 hover:text-sky-200 underline">
                    {open === m.id ? "הסתר סימולציית ניקוד" : "סימולציית ניקוד"}
                  </button>
                )}
              </div>
              {u && u.regular.home != null && (u.regular.home !== u.score.home || u.regular.away !== u.score.away) && (
                <p className="text-[11px] text-orange-300 mt-1">שים לב: תוצאת 90 דקות {u.regular.home}-{u.regular.away} שונה מהתוצאה הסופית (הארכה)</p>
              )}
              {open === m.id && fin && (
                <div className="mt-3 border-t border-white/10 pt-2">
                  {!list ? <p className="text-xs text-slate-500">טוען...</p> : !list.length ? <p className="text-xs text-slate-500">אין ניחושים למשחק</p> : (
                    <table className="w-full text-xs">
                      <thead><tr className="text-slate-500"><th className="text-right py-1">משתתף</th><th>ניחוש</th><th>נקודות (סימולציה)</th><th>נקודות שנשמרו</th></tr></thead>
                      <tbody>
                        {list
                          .map((p) => ({ p, pts: simPoints(p, m, u.score.home, u.score.away) }))
                          .sort((x, y) => y.pts - x.pts)
                          .map(({ p, pts }) => {
                            const saved = p.points_earned ?? null;
                            const diff = m.is_finished && saved != null && Math.abs(Number(saved) - pts) > 0.01;
                            return (
                              <tr key={p.id} className="border-t border-white/5">
                                <td className="py-1 text-white">{names[p.user_id] || p.user_id?.slice(0, 6)}</td>
                                <td className="text-center text-slate-300" dir="ltr">{p.predicted_score_a}-{p.predicted_score_b}</td>
                                <td className="text-center text-yellow-300 font-bold">{pts}</td>
                                <td className={`text-center ${diff ? "text-red-400 font-bold" : "text-slate-400"}`}>{saved ?? "—"}{diff ? " ⚠️" : ""}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
