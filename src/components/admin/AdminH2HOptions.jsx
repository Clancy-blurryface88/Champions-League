import React, { useEffect, useMemo, useState } from "react";

// ── Head-to-head tab for the match arena — 3 filter approaches, switchable
// from a menu. Real data from GOAL API (/h2h via /api/football?source=goal,
// CDN-cached 12h). Friendlies are always dropped. Demo only. ──────────────

// GOAL API team ids for this season's 36 league-phase teams (from their CL standings).
const TEAMS = {
  "Arsenal": "cmr7foowe2kf3rx06u6eu3rhl", "Aston Villa": "cmr7hvawd3yvgrx06qjdxxr4v", "AEK Athens": "cmrib5shdfmxalb07sx4orfri",
  "Atl. Madrid": "cmr7fp1we2n8rrx066zdyo70w", "Barcelona": "cmr7m55u15efyrx06ndeg0510", "Bayern Munich": "cmr79jab703zerx06eqilba4s",
  "Betis": "cmr7m55uo5eg8rx06hlsjolr6", "Bodo/Glimt": "cmr7qedkz6y2rrx067li8of8c", "Club Brugge": "cmri4ql11dmzulb07v3q9pnmj",
  "Como": "cmr7m6brl5t30rx06i2fz3gmw", "Dortmund": "cmr79jabe03zfrx061s6b1xiw", "FC Porto": "cmr7upbul8vobrx06j8bdlukj",
  "Fenerbahce": "cmri0ey3gb6jzlb07w6sj8iaq", "Feyenoord": "cmr7qeuoo746xrx06gpaowm5g", "Galatasaray": "cmri0ey53b6kulb07e541svio",
  "Inter": "cmr7fp1wj2n8urx061yv6ov5t", "LASK": "cmr7hu9t63l1jrx06d0t9rema", "Lens": "cmr7oa1g86g0srx06rgl26fqf",
  "Lille": "cmr7oa1go6g16rx06ws7j9hiq", "Liverpool": "cmr7hvad33yp7rx06q6tlbmde", "Manchester City": "cmr7fpx0e2ybgrx06dajtxqc1",
  "Manchester Utd": "cmr7fp1wp2n8yrx061vxmb1a5", "Napoli": "cmr7m6br45t2orx06ql4em344", "PSG": "cmr7oa1gr6g19rx06g1miy6jr",
  "PSV": "cmr7qeuox746zrx06n7udaoim", "RB Leipzig": "cmr79jabm03zmrx06phgewkx5", "Real Madrid": "cmr7fp1wf2n8srx06b3wila7x",
  "AS Roma": "cmr7m6brt5t37rx06ixsgl3rc", "Sabah Baku": "cmri0gkbgbr6mlb07s324klf3", "Shakhtar Donetsk": "cmri911gbf1a8lb07eetvoj7d",
  "Slavia Prague": "cmri4pzegddctlb07j7xenzfd", "Slovan Bratislava": "cmri2lbvwcmvmlb07i45ou65m", "Sporting CP": "cmr7upbvc8vorrx06s3awvvn9",
  "Stuttgart": "cmr79jabg03zhrx06z7qf1z8v", "Villarreal": "cmr7m55u85eg1rx06wsvtxyr5", "Viking": "cmr7qedl26y2trx06nvff2rj6",
};
const TEAM_NAMES = Object.keys(TEAMS).sort();

const QUICK_PAIRS = [
  ["Bayern Munich", "Real Madrid"], ["Liverpool", "PSG"], ["Barcelona", "Inter"], ["Arsenal", "Lille"],
];

const FRIENDLY_RE = /friendl|international champions cup|club friendlies|emirates cup|audi cup|joan gamper|trofeo|super cup/i;
const isCL = (m) => /uefa champions league/i.test(m.league_name || "");

const MODES = [
  { id: "cl", label: "א · רק ליגת האלופות", desc: "רק מפגשים בליגת האלופות." },
  { id: "all", label: "ב · כל המפעלים + תג", desc: "כל המפגשים הרשמיים, ולכל משחק תג עם שם המפעל." },
  { id: "toggle", label: "ג · כל המפעלים + מתג", desc: "כמו ב׳, ומתג למעלה שמסנן רק לליגת האלופות." },
];

const HOME_C = "#38bdf8";
const AWAY_C = "#fb7185";

// Short Hebrew label for the competition tag.
function compLabel(name = "") {
  if (/uefa champions league/i.test(name)) return { t: "ליגת האלופות", c: "#38bdf8" };
  if (/europa league/i.test(name)) return { t: "הליגה האירופית", c: "#f97316" };
  if (/conference league/i.test(name)) return { t: "הקונפרנס", c: "#22c55e" };
  if (/cup|copa|coppa|pokal|coupe|beker|kupa/i.test(name)) return { t: name, c: "#c084fc" };
  return { t: name, c: "#94a3b8" };
}

function useH2H(a, b) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  useEffect(() => {
    let alive = true;
    setState({ loading: true, data: null, error: null });
    fetch(`/api/football?source=goal&path=${encodeURIComponent(`/h2h/${TEAMS[a]}/${TEAMS[b]}`)}`)
      .then((r) => r.json())
      .then((j) => alive && setState({ loading: false, data: j.success ? j.data : null, error: j.success ? null : j.error }))
      .catch((e) => alive && setState({ loading: false, data: null, error: e.message }));
    return () => { alive = false; };
  }, [a, b]);
  return state;
}

// Which side of the meeting is "team A" — GOAL's names differ slightly from
// ours ("Bayern München" vs "Bayern Munich"), so match on the badge-less
// home/away ids the meeting carries against team1's recent games.
function sideOfA(match, aKeys) {
  return aKeys.has(match.match_hometeam_id) ? "home" : aKeys.has(match.match_awayteam_id) ? "away" : null;
}

function Summary({ list, a, b, aKeys }) {
  let wa = 0, wb = 0, d = 0, ga = 0, gb = 0;
  list.forEach((m) => {
    const hs = +m.match_hometeam_score, as = +m.match_awayteam_score;
    const aHome = sideOfA(m, aKeys) === "home";
    const sa = aHome ? hs : as, sb = aHome ? as : hs;
    ga += sa; gb += sb;
    if (sa > sb) wa++; else if (sb > sa) wb++; else d++;
  });
  const n = list.length || 1;
  return (
    <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-end justify-between mb-2">
        <div className="text-center flex-1"><p className="text-2xl font-black" style={{ color: HOME_C }}>{wa}</p><p className="text-[10px] text-slate-400 truncate">{a}</p></div>
        <div className="text-center flex-1"><p className="text-2xl font-black text-slate-300">{d}</p><p className="text-[10px] text-slate-400">תיקו</p></div>
        <div className="text-center flex-1"><p className="text-2xl font-black" style={{ color: AWAY_C }}>{wb}</p><p className="text-[10px] text-slate-400 truncate">{b}</p></div>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5" dir="rtl">
        <div style={{ width: `${(wa / n) * 100}%`, background: HOME_C }} />
        <div style={{ width: `${(d / n) * 100}%`, background: "#64748b" }} />
        <div style={{ width: `${(wb / n) * 100}%`, background: AWAY_C }} />
      </div>
      <p className="text-center text-[10px] text-slate-500 mt-2">{list.length} מפגשים · שערים {ga}–{gb}</p>
    </div>
  );
}

function MeetingCard({ m, showTag, aKeys }) {
  const hs = +m.match_hometeam_score, as = +m.match_awayteam_score;
  const aSide = sideOfA(m, aKeys);
  const winner = hs > as ? "home" : as > hs ? "away" : null;
  const tag = compLabel(m.league_name);
  const sideColor = (s) => (s === aSide ? HOME_C : AWAY_C);
  const team = (s) => (
    <div className={`flex items-center gap-1.5 flex-1 min-w-0 ${s === "away" ? "flex-row-reverse" : ""}`}>
      <img src={s === "home" ? m.team_home_badge : m.team_away_badge} alt="" className="w-6 h-6 object-contain flex-shrink-0" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
      <span className={`text-xs truncate ${winner === s ? "text-white font-bold" : "text-slate-400"}`}>{s === "home" ? m.match_hometeam_name : m.match_awayteam_name}</span>
    </div>
  );
  const [y, mo, d] = (m.match_date || "").split("-");
  return (
    <div className="rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-slate-500 tabular-nums">{d}/{mo}/{y}</span>
        {showTag && <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[60%]" style={{ background: `${tag.c}1f`, color: tag.c }}>{tag.t}</span>}
      </div>
      <div className="flex items-center gap-2" dir="ltr">
        {team("home")}
        <div className="flex items-center gap-1 font-black tabular-nums text-sm flex-shrink-0">
          <span style={{ color: winner === "home" ? sideColor("home") : "#cbd5e1" }}>{hs}</span>
          <span className="text-slate-600">–</span>
          <span style={{ color: winner === "away" ? sideColor("away") : "#cbd5e1" }}>{as}</span>
        </div>
        {team("away")}
      </div>
    </div>
  );
}

function H2HTab({ a, b, mode }) {
  const s = useH2H(a, b);
  const [clOnly, setClOnly] = useState(false);
  useEffect(() => { setClOnly(false); }, [a, b, mode]);

  // team A's own API id, harvested from its recent matches (names vary).
  // GOAL may return the pair in either order, so pick A's recent list by id.
  const aKeys = useMemo(() => {
    const cnt = {};
    const aRecent = s.data?.team1Id === TEAMS[a] ? s.data?.team1Recent : s.data?.team2Recent;
    (aRecent || []).forEach((x) => [x.match_hometeam_id, x.match_awayteam_id].forEach((id) => { cnt[id] = (cnt[id] || 0) + 1; }));
    const top = Object.entries(cnt).sort((p, q) => q[1] - p[1])[0]?.[0];
    return new Set(top ? [top] : []);
  }, [s.data, a]);

  const all = useMemo(() => (s.data?.directMatches || [])
    .filter((m) => !FRIENDLY_RE.test(m.league_name || ""))
    .sort((p, q) => (q.match_date || "").localeCompare(p.match_date || "")), [s.data]);
  const friendliesDropped = (s.data?.directMatches || []).length - all.length;

  const list = mode === "cl" || (mode === "toggle" && clOnly) ? all.filter(isCL) : all;

  if (s.loading) return <p className="text-slate-500 text-xs text-center py-6">טוען…</p>;
  if (s.error) return <p className="text-red-400 text-xs">שגיאה: {s.error}</p>;

  return (
    <div className="space-y-2.5">
      {mode === "toggle" && (
        <div className="flex rounded-full p-0.5 mx-auto w-fit" style={{ background: "rgba(255,255,255,0.06)" }}>
          {[[false, "כל המפעלים"], [true, "ליגת האלופות"]].map(([v, l]) => (
            <button key={l} onClick={() => setClOnly(v)} className="text-[11px] px-3 py-1 rounded-full font-semibold" style={{ background: clOnly === v ? "#38bdf8" : "transparent", color: clOnly === v ? "#000" : "#cbd5e1" }}>{l}</button>
          ))}
        </div>
      )}
      {list.length ? (
        <>
          <Summary list={list} a={a} b={b} aKeys={aKeys} />
          {list.map((m) => <MeetingCard key={m.match_id} m={m} showTag={mode !== "cl"} aKeys={aKeys} />)}
        </>
      ) : (
        <p className="text-slate-400 text-xs text-center py-6">{mode === "cl" || clOnly ? "הקבוצות לא נפגשו בליגת האלופות" : "הקבוצות לא נפגשו במשחק רשמי"}</p>
      )}
      {friendliesDropped > 0 && <p className="text-[10px] text-slate-600 text-center">הוסתרו {friendliesDropped} משחקי ידידות</p>}
    </div>
  );
}

export default function AdminH2HOptions() {
  const [mode, setMode] = useState("cl");
  const [a, setA] = useState("Bayern Munich");
  const [b, setB] = useState("Real Madrid");
  const sel = "text-xs rounded-lg px-2 py-1.5 bg-slate-900 text-white border border-white/10 flex-1 min-w-0";

  return (
    <div className="space-y-5" dir="rtl">
      <div className="rounded-2xl p-5" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.25)" }}>
        <h2 className="text-white font-black text-lg mb-1">⚔️ ראש בראש — 3 אפשרויות</h2>
        <p className="text-slate-300 text-xs leading-relaxed">טאב חדש לזירת המשחק. נתונים אמיתיים מ-GOAL API, משחקי ידידות מוסתרים תמיד. ⚠️ שים לב: המאגר שלהם חלקי — למשל ליברפול-פ.ס.ז׳ חסר משחק הגומלין ממרץ 2025, וברצלונה-אינטר חסר חצי הגמר ממאי 2025.</p>

        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          {MODES.map((x) => (
            <button key={x.id} onClick={() => setMode(x.id)} className="text-right rounded-xl px-3 py-2 flex-1" style={{ background: mode === x.id ? "rgba(245,197,24,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${mode === x.id ? "#f5c518" : "rgba(255,255,255,0.08)"}` }}>
              <p className="text-xs font-bold" style={{ color: mode === x.id ? "#f5c518" : "#fff" }}>{x.label}</p>
              <p className="text-[10px] text-slate-400">{x.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-3 items-center">
          <select value={a} onChange={(e) => setA(e.target.value)} className={sel}>{TEAM_NAMES.map((n) => <option key={n}>{n}</option>)}</select>
          <span className="text-slate-500 text-xs">נגד</span>
          <select value={b} onChange={(e) => setB(e.target.value)} className={sel}>{TEAM_NAMES.map((n) => <option key={n}>{n}</option>)}</select>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_PAIRS.map(([x, y]) => (
            <button key={x + y} onClick={() => { setA(x); setB(y); }} className="text-[10px] px-2 py-1 rounded-full text-slate-300" style={{ background: "rgba(255,255,255,0.06)" }}>{x} – {y}</button>
          ))}
        </div>
      </div>

      {/* Phone-width preview of the tab */}
      <div className="mx-auto rounded-3xl p-3" style={{ maxWidth: 390, background: "#0b1730", border: "1px solid rgba(56,189,248,0.25)" }}>
        <p className="text-center text-[10px] text-slate-500 mb-2">תצוגה ברוחב טלפון</p>
        {a === b ? <p className="text-slate-400 text-xs text-center py-6">בחר שתי קבוצות שונות</p> : <H2HTab a={a} b={b} mode={mode} />}
      </div>
    </div>
  );
}
