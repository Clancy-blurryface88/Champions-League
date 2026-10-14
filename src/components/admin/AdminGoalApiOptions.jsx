import React, { useEffect, useState } from "react";

// ── GOAL API (api.goal-api.com) — what it can add to the app, shown live on
// real finished CL matches via /api/football?source=goal (server proxy, CDN-cached). Demo only:
// each card is one candidate feature + a verdict on the data quality. ──────

const CL_LEAGUE = "cmr77dw3900f5rx06j05wgzv4";
const SAMPLE_MATCHES = [
  { id: "cmtyc05lkp5zylc07ygt2bq98", home: "Arsenal", away: "Lille", homeId: "cmr7foowe2kf3rx06u6eu3rhl", awayId: "cmr7oa1go6g16rx06ws7j9hiq", score: "3-0", date: "13/10" },
  { id: "cmtyc05y1p628lc07t60yd4h4", home: "Atl. Madrid", away: "Manchester Utd", homeId: "cmr7fp1we2n8rrx066zdyo70w", awayId: "cmr7fp1wp2n8yrx061vxmb1a5", score: "2-0", date: "13/10" },
];

const VERDICT = {
  good: { label: "✅ אמין — מומלץ", c: "#4ade80" },
  partial: { label: "⚠️ חלקי", c: "#facc15" },
  bad: { label: "❌ נתונים שגויים", c: "#f87171" },
  empty: { label: "⛔ ריק כרגע", c: "#94a3b8" },
  have: { label: "🔁 כבר קיים אצלנו", c: "#38bdf8" },
  paid: { label: "💰 בתשלום", c: "#c084fc" },
};

const goalCache = new Map();
function useGoal(path, enabled = true) {
  const [state, setState] = useState({ loading: !!enabled, data: null, error: null });
  useEffect(() => {
    if (!enabled || !path) return;
    let alive = true;
    if (!goalCache.has(path)) {
      goalCache.set(path, fetch(`/api/football?source=goal&path=${encodeURIComponent(path)}`).then((r) => r.json()));
    }
    setState({ loading: true, data: null, error: null });
    goalCache.get(path)
      .then((j) => alive && setState({ loading: false, data: j.success ? j.data : null, error: j.success ? null : j.error || "שגיאה" }))
      .catch((e) => alive && setState({ loading: false, data: null, error: e.message }));
    return () => { alive = false; };
  }, [path, enabled]);
  return state;
}

function Card({ n, title, desc, verdict, note, children }) {
  const v = VERDICT[verdict];
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center rounded-full text-[11px] font-black flex-shrink-0" style={{ width: 22, height: 22, background: "linear-gradient(135deg,#f5c518,#fde68a)", color: "#000" }}>{n}</span>
            <h3 className="text-white font-bold text-sm">{title}</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
        </div>
        <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap" style={{ background: `${v.c}1f`, color: v.c, border: `1px solid ${v.c}55` }}>{v.label}</span>
      </div>
      {note && <p className="text-[11px] leading-relaxed mb-3 px-3 py-2 rounded-lg" style={{ background: `${v.c}12`, color: v.c }}>{note}</p>}
      {children}
    </div>
  );
}

function Status({ s, empty = "אין נתונים" }) {
  if (s.loading) return <p className="text-slate-500 text-xs">טוען…</p>;
  if (s.error) return <p className="text-red-400 text-xs">שגיאה: {s.error}</p>;
  if (!s.data || (Array.isArray(s.data) && !s.data.length)) return <p className="text-slate-500 text-xs">{empty}</p>;
  return null;
}

// 1 — full match statistics, per half
function StatsDemo({ m }) {
  const s = useGoal(`/fixtures/${m.id}/statistics`);
  const [half, setHalf] = useState("fullTime");
  const rows = s.data?.match?.[half] || [];
  const seen = new Set();
  const uniq = rows.filter((r) => !seen.has(r.type) && seen.add(r.type));
  return (
    <>
      <Status s={s} />
      {s.data && (
        <>
          <div className="flex gap-1 mb-3">
            {[["fullTime", "כל המשחק"], ["firstHalf", "מחצית 1"], ["secondHalf", "מחצית 2"]].map(([k, l]) => (
              <button key={k} onClick={() => setHalf(k)} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: half === k ? "#38bdf8" : "rgba(255,255,255,0.06)", color: half === k ? "#000" : "#cbd5e1" }}>{l}</button>
            ))}
          </div>
          {!uniq.length && <p className="text-slate-500 text-xs">אין נתונים למחצית הזו</p>}
          <div className="space-y-1.5">
            {uniq.map((r) => {
              const h = parseFloat(r.home) || 0, a = parseFloat(r.away) || 0, t = h + a || 1;
              return (
                <div key={r.type}>
                  <div className="flex justify-between text-[11px] text-slate-300"><span className="font-bold">{r.home}</span><span className="text-slate-500">{r.type}</span><span className="font-bold">{r.away}</span></div>
                  <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5" dir="ltr">
                    <div style={{ width: `${(h / t) * 100}%`, background: "#38bdf8" }} />
                    <div style={{ width: `${(a / t) * 100}%`, background: "#fb7185" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

// 2 — timeline: goals + assists, cards, substitutions
function TimelineDemo({ m }) {
  const ev = useGoal(`/fixtures/${m.id}/events`);
  const cards = useGoal(`/fixtures/${m.id}/cards`);
  const subs = useGoal(`/fixtures/${m.id}/substitutions`);
  if (ev.loading || cards.loading || subs.loading) return <p className="text-slate-500 text-xs">טוען…</p>;
  const items = [
    ...(ev.data || []).filter((e) => e.type === "GOAL").map((e) => ({ t: e.timeNum, home: !!e.homeScorer, icon: "⚽", main: e.homeScorer || e.awayScorer, sub: (e.homeAssist || e.awayAssist) ? `בישול: ${e.homeAssist || e.awayAssist}` : null, extra: e.score })),
    ...(cards.data || []).map((c) => ({ t: c.timeNum, home: !!c.homeFault, icon: c.card?.includes("red") ? "🟥" : "🟨", main: c.homeFault || c.awayFault })),
    ...(subs.data || []).map((x) => { const [out, inn] = (x.substitution || "").split(" | "); return { t: x.timeNum, home: x.team === "home", icon: "🔁", main: inn, sub: `יצא: ${out}` }; }),
  ].sort((a, b) => a.t - b.t);
  if (!items.length) return <p className="text-slate-500 text-xs">אין אירועים</p>;
  return (
    <div className="space-y-1 max-h-72 overflow-y-auto pl-1">
      {items.map((it, i) => (
        <div key={i} className={`flex items-center gap-2 text-xs ${it.home ? "" : "flex-row-reverse text-left"}`}>
          <span className="w-8 text-center text-slate-500 font-mono">{it.t}'</span>
          <span>{it.icon}</span>
          <div className="flex-1 min-w-0">
            <span className="text-white font-semibold">{it.main}</span>
            {it.sub && <span className="text-slate-500"> · {it.sub}</span>}
            {it.extra && <span className="text-sky-300 font-bold"> ({it.extra})</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// 3 — minute-by-minute commentary
function CommentaryDemo({ m }) {
  const s = useGoal(`/fixtures/${m.id}/commentary`);
  const [onlyKey, setOnlyKey] = useState(false);
  const KEY = /goal|card|substitution|shot|half/i;
  const list = (s.data || []).filter((c) => !onlyKey || KEY.test(c.text)).sort((a, b) => b.time.localeCompare(a.time, undefined, { numeric: true }));
  return (
    <>
      <Status s={s} />
      {s.data?.length > 0 && (
        <>
          <label className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
            <input type="checkbox" checked={onlyKey} onChange={(e) => setOnlyKey(e.target.checked)} /> רק רגעים חשובים ({s.data.length} שורות סה"כ)
          </label>
          <div className="space-y-1 max-h-64 overflow-y-auto text-xs" dir="ltr">
            {list.map((c) => (
              <div key={c.id} className="flex gap-2"><span className="text-slate-500 font-mono w-12">{c.time}</span><span className="text-slate-200">{c.text}</span><span className="text-amber-300/80">{c.state}</span></div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

// 4 — lineups with player photos + formation
function LineupsDemo({ m }) {
  const s = useGoal(`/fixtures/${m.id}/lineups`);
  const fx = useGoal(`/fixtures/${m.id}`);
  const side = (k, label, sys) => {
    const t = s.data?.[k];
    if (!t) return null;
    return (
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-bold mb-1">{label} <span className="text-slate-500">{sys}</span></p>
        {t.startingLineups.map((p) => (
          <div key={p.id} className="flex items-center gap-1.5 text-[11px] text-slate-300 py-0.5">
            {p.playerImage ? <img src={p.playerImage} alt="" className="w-5 h-5 rounded-full object-cover" /> : <span className="w-5 h-5 rounded-full bg-white/10" />}
            <span className="text-slate-500 w-4">{p.lineupNumber}</span>
            <span className="truncate">{p.lineupPlayer}</span>
          </div>
        ))}
        <p className="text-[10px] text-slate-500 mt-1">ספסל: {t.substitutes.length} · חסרים/פצועים: {t.missingPlayers.length} · מאמן: {t.coach.length ? t.coach.map((c) => c.lineupPlayer).join(", ") : "—"}</p>
      </div>
    );
  };
  return (
    <>
      <Status s={s} />
      {s.data && <div className="flex gap-4">{side("home", m.home, fx.data?.homeTeamSystem)}{side("away", m.away, fx.data?.awayTeamSystem)}</div>}
    </>
  );
}

// 5 — H2H + recent form across all competitions
const RES_C = { W: "#4ade80", D: "#facc15", L: "#f87171" };
function resultFor(match, teamName) {
  const hs = +match.match_hometeam_score, as = +match.match_awayteam_score;
  const isHome = match.match_hometeam_name === teamName;
  const my = isHome ? hs : as, opp = isHome ? as : hs;
  return my > opp ? "W" : my < opp ? "L" : "D";
}
function H2HDemo({ m }) {
  const s = useGoal(`/h2h/${m.homeId}/${m.awayId}`);
  const d = s.data;
  // Names in the recent list differ from team1Name ("Arsenal" vs "Arsenal FC"),
  // so the team is the name that shows up in the most matches.
  const selfName = (list) => {
    const cnt = {};
    (list || []).forEach((x) => [x.match_hometeam_name, x.match_awayteam_name].forEach((n) => { cnt[n] = (cnt[n] || 0) + 1; }));
    return Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0];
  };
  const recent = (list, name) => (
    <div className="flex-1 min-w-0">
      <p className="text-white text-xs font-bold mb-1">{name} — 10 אחרונים</p>
      {(list || []).slice(0, 10).map((x) => {
        const r = resultFor(x, selfName(list));
        return (
          <div key={x.match_id} className="flex items-center gap-1.5 text-[11px] py-0.5">
            <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-black" style={{ background: RES_C[r] }}>{r}</span>
            <span className="text-slate-300 truncate flex-1" dir="ltr">{x.match_hometeam_name} {x.match_hometeam_score}-{x.match_awayteam_score} {x.match_awayteam_name}</span>
            <span className="text-slate-500 text-[10px] truncate max-w-[70px]">{x.league_name}</span>
          </div>
        );
      })}
    </div>
  );
  return (
    <>
      <Status s={s} />
      {d && (
        <>
          <p className="text-xs text-slate-300 mb-2">מפגשים ישירים: <b className="text-white">{d.directMatches.length}</b>{!d.directMatches.length && " (לא נפגשו / אין נתונים)"}</p>
          {d.directMatches.slice(0, 5).map((x) => (
            <p key={x.match_id} className="text-[11px] text-slate-300" dir="ltr">{x.match_date} · {x.match_hometeam_name} {x.match_hometeam_score}-{x.match_awayteam_score} {x.match_awayteam_name} <span className="text-slate-500">({x.league_name})</span></p>
          ))}
          <div className="flex gap-4 mt-3">{recent(d.team1Recent, d.team1Name)}{recent(d.team2Recent, d.team2Name)}</div>
        </>
      )}
    </>
  );
}

// 6 — team long-run statistics (5 years, all competitions)
function TeamStatsDemo({ m }) {
  const a = useGoal(`/teams/${m.homeId}/statistics`);
  const b = useGoal(`/teams/${m.awayId}/statistics`);
  const [view, setView] = useState("overall");
  const row = (label, f) => (
    <tr key={label} className="border-t border-white/5">
      <td className="py-1 text-white font-bold text-center">{a.data ? f(a.data[view]) : "…"}</td>
      <td className="py-1 text-slate-500 text-center text-[11px]">{label}</td>
      <td className="py-1 text-white font-bold text-center">{b.data ? f(b.data[view]) : "…"}</td>
    </tr>
  );
  return (
    <>
      <div className="flex gap-1 mb-2">
        {[["overall", "כללי"], ["home", "בית"], ["away", "חוץ"]].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: view === k ? "#38bdf8" : "rgba(255,255,255,0.06)", color: view === k ? "#000" : "#cbd5e1" }}>{l}</button>
        ))}
      </div>
      <table className="w-full text-xs">
        <thead><tr><th className="text-sky-300">{m.home}</th><th /><th className="text-rose-300">{m.away}</th></tr></thead>
        <tbody>
          {row("משחקים", (x) => x.played)}
          {row("% ניצחונות", (x) => `${x.winPercentage}%`)}
          {row("% תיקו", (x) => `${x.drawPercentage}%`)}
          {row("שערים למשחק", (x) => x.avgGoalsScored)}
          {row("ספיגות למשחק", (x) => x.avgGoalsConceded)}
          {row("נקודות למשחק", (x) => x.pointsPerGame)}
        </tbody>
      </table>
      <p className="text-[10px] text-slate-500 mt-2">פורמה: <span dir="ltr">{a.data?.form || "…"}</span> / <span dir="ltr">{b.data?.form || "…"}</span></p>
    </>
  );
}

// 7 — top scorers
function ScorersDemo() {
  const s = useGoal(`/leagues/${CL_LEAGUE}/top-scorers`);
  return (
    <>
      <Status s={s} />
      {s.data?.length > 0 && (
        <table className="w-full text-xs">
          <thead><tr className="text-slate-500 text-[11px]"><th className="text-right">#</th><th className="text-right">שחקן</th><th className="text-right">קבוצה</th><th>שערים</th><th>בישולים</th></tr></thead>
          <tbody>
            {s.data.slice(0, 10).map((p) => (
              <tr key={p.id} className="border-t border-white/5 text-slate-300">
                <td className="py-1">{p.playerPlace}</td><td className="text-white font-semibold">{p.playerName}</td><td>{p.teamName}</td><td className="text-center font-bold">{p.goals}</td><td className="text-center">{p.assists}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

// 8 — official standings (compare against our own calc)
function StandingsDemo() {
  const s = useGoal(`/leagues/${CL_LEAGUE}/standings`);
  const rows = (s.data || []).slice().sort((a, b) => +a.overallLeaguePosition - +b.overallLeaguePosition);
  return (
    <>
      <Status s={s} />
      {rows.length > 0 && (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-slate-500 text-[11px]"><th className="text-right">#</th><th className="text-right">קבוצה</th><th>מ'</th><th>שערים</th><th>נק'</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-white/5 text-slate-300">
                  <td className="py-1">{r.overallLeaguePosition}</td>
                  <td className="text-white"><span className="inline-flex items-center gap-1.5">{r.team?.badge && <img src={r.team.badge} alt="" className="w-4 h-4 object-contain" />}{r.teamName}</span></td>
                  <td className="text-center">{r.overallLeaguePlayed}</td>
                  <td className="text-center" dir="ltr">{r.overallLeagueGF}:{r.overallLeagueGA}</td>
                  <td className="text-center font-bold text-white">{r.overallLeaguePTS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// 9 — video highlights
function VideosDemo({ m }) {
  const s = useGoal(`/videos/match/${m.id}`);
  const league = useGoal(`/videos/league/${CL_LEAGUE}`);
  return (
    <>
      <p className="text-xs text-slate-300 mb-1">תקצירים למשחק הנבחר: <b className="text-white">{s.loading ? "…" : (s.data || []).length}</b></p>
      {(s.data || []).map((v) => <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="block text-sky-300 text-xs underline">{v.titleFull}</a>)}
      <p className="text-xs text-slate-300 mt-2 mb-1">התקצירים האחרונים של ליגת האלופות במאגר:</p>
      {(league.data || []).slice(0, 5).map((v) => (
        <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="block text-[11px] text-slate-400 hover:text-sky-300">{v.fixture?.matchDate} · {v.fixture?.homeTeamName} {v.fixture?.homeTeamScore}-{v.fixture?.awayTeamScore} {v.fixture?.awayTeamName}</a>
      ))}
    </>
  );
}

export default function AdminGoalApiOptions() {
  const [mi, setMi] = useState(0);
  const m = SAMPLE_MATCHES[mi];

  return (
    <div className="space-y-5" dir="rtl">
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg,rgba(56,189,248,0.10),rgba(245,197,24,0.06))", border: "1px solid rgba(56,189,248,0.25)" }}>
        <h2 className="text-white font-black text-lg mb-1">🔌 GOAL API — מה אפשר להוסיף</h2>
        <p className="text-slate-300 text-xs leading-relaxed">כל כרטיס הוא פיצ'ר אפשרי, מוצג על נתונים אמיתיים מה-API (מסלול חינמי: 1,000 בקשות ביום, נשמר ב-cache לשעה). הסימון בפינה הוא ההערכה שלי לאמינות הנתונים — כדאי לבדוק בעצמך מול מה שקרה במשחק.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {SAMPLE_MATCHES.map((x, i) => (
            <button key={x.id} onClick={() => setMi(i)} className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: mi === i ? "#f5c518" : "rgba(255,255,255,0.06)", color: mi === i ? "#000" : "#cbd5e1" }}>
              {x.date} · {x.home} {x.score} {x.away}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card n={1} title="סטטיסטיקת משחק מלאה" desc="החזקה, בעיטות (בתוך/מחוץ לרחבה, חסומות), מסירות + דיוק, הצלות, התקפות מסוכנות, קרנות — גם לפי מחצית." verdict="good" note="עשיר יותר ממה שיש לנו היום מאופ״א (7 נתונים בכפתור ה-i).">
          <StatsDemo m={m} key={m.id} />
        </Card>
        <Card n={2} title="ציר זמן: שערים + מבשלים, כרטיסים, חילופים" desc="כל אירועי המשחק עם דקה, כולל מי בישל ומי נכנס/יצא." verdict="good" note="מבשלים וחילופים — חדש. שערים וכרטיסים כבר מגיעים אצלנו מאופ״א.">
          <TimelineDemo m={m} key={m.id} />
        </Card>
        <Card n={3} title="פרשנות דקה-אחר-דקה" desc="פיד טקסט חי (באנגלית) — אפשר לסנן רק לרגעים חשובים." verdict="bad" note="בארסנל-ליל מופיעים בפרשנות שחקנים שלא שיחקו במשחק (E. Konsa, B. Guimaraes), והטקסט מכני מאוד. בדוק בעצמך.">
          <CommentaryDemo m={m} key={m.id} />
        </Card>
        <Card n={4} title="הרכבים עם תמונות שחקנים" desc="11 פותחים + ספסל + מערך, עם תמונת פנים לכל שחקן." verdict="have" note="ההרכב עצמו כבר קיים אצלנו (גרפיקת מגרש מאופ״א). החדש היחיד: תמונות שחקנים. מאמן ופצועים — ריקים.">
          <LineupsDemo m={m} key={m.id} />
        </Card>
        <Card n={5} title="ראש בראש + פורמה מכל המפעלים" desc="מפגשים ישירים בעבר + 10 המשחקים האחרונים של כל קבוצה בכל המפעלים (ליגה, גביע, אירופה)." verdict="partial" note="הפורמה מכל המפעלים — חדש ונראה תקין. מפגשים ישירים — בשני המשחקים לדוגמה אין, אז לא אומת.">
          <H2HDemo m={m} key={m.id} />
        </Card>
        <Card n={6} title="סטטיסטיקת קבוצה ארוכת טווח" desc="5 שנים אחרונות בכל המפעלים: אחוזי ניצחון, ממוצע שערים/ספיגות, בית/חוץ." verdict="good" note="מתאים לזירת המשחק / חלון הקבוצה. שים לב: זה לא רק ליגת האלופות אלא כל המשחקים.">
          <TeamStatsDemo m={m} key={m.id} />
        </Card>
        <Card n={7} title="מלך שערים" desc="דירוג כובשי ליגת האלופות + בישולים." verdict="bad" note="אמבפה עם 9 שערים אחרי 2 מחזורים, וכל הבישולים 0 — כנראה מעורבב עם מוקדמות/עונה קודמת. לא אמין כרגע.">
          <ScorersDemo />
        </Card>
        <Card n={8} title="טבלה רשמית" desc="טבלת 36 הקבוצות כפי שהספק מחשב אותה (כולל בית/חוץ ואזורי עלייה)." verdict="have" note="כבר מחושב אצלנו מה-DB. יכול לשמש לכל היותר כבדיקת אימות נוספת.">
          <StandingsDemo />
        </Card>
        <Card n={9} title="תקצירי וידאו" desc="קישור לתקציר וידאו לכל משחק שהסתיים." verdict="empty" note="אין אף תקציר מהעונה הנוכחית — האחרון במאגר מאפריל 2025.">
          <VideosDemo m={m} key={m.id} />
        </Card>
        <Card n={10} title="התראות אוטומטיות (Webhooks)" desc="הספק שולח לשרת שלנו אירוע ברגע ששער נכבש / משחק מתחיל / נגמר → אנחנו שולחים Push ב-OneSignal: ״⚽ גול! ארסנל 1-0 ליל״." verdict="partial" note="אי אפשר להדגים על משחק שהסתיים — צריך לבנות endpoint ולבדוק במשחק חי. במסלול החינמי: webhook אחד, וכל משלוח נספר במכסה היומית.">
          <p className="text-xs text-slate-400">לבדיקה בערב משחקים (נדרש לבנות קודם את ה-endpoint שמקבל את האירועים).</p>
        </Card>
      </div>

      <div className="rounded-2xl p-5" style={{ background: "rgba(192,132,252,0.06)", border: "1px solid rgba(192,132,252,0.25)" }}>
        <h3 className="text-white font-bold text-sm mb-2">💰 לא זמין במסלול החינמי — לשיחה</h3>
        <ul className="text-xs text-slate-300 space-y-1 list-disc pr-4">
          <li><b>יחסי הימורים לפני משחק + יחסים חיים</b> (מתעדכנים כל 2 דקות) — PRO, $19 לחודש</li>
          <li><b>תחזיות</b> לכל משחק — PRO, $19 לחודש</li>
          <li><b>חדשות</b> לפי קבוצה/משחק — ULTRA, $29 לחודש</li>
        </ul>
      </div>
    </div>
  );
}
