import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { goalTeamId } from "@/data/goalTeamIds";

// ── Head-to-head block in the match arena: past official meetings of the two
// teams (friendlies always dropped), all competitions with a competition tag,
// plus a toggle to Champions League only. Real data from GOAL API (/h2h via
// /api/football?source=goal, CDN-cached 12h), fetched only when opened. ──

const FRIENDLY_RE = /friendl|international champions cup|club friendlies|emirates cup|audi cup|joan gamper|trofeo|super cup/i;
const isCL = (m) => /uefa champions league/i.test(m.league_name || "");

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
    fetch(`/api/football?source=goal&path=${encodeURIComponent(`/h2h/${goalTeamId(a)}/${goalTeamId(b)}`)}`)
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

function H2HTab({ a, b }) {
  const s = useH2H(a, b);
  const [clOnly, setClOnly] = useState(false);
  useEffect(() => { setClOnly(false); }, [a, b]);

  // team A's own API id, harvested from its recent matches (names vary).
  // GOAL may return the pair in either order, so pick A's recent list by id.
  const aKeys = useMemo(() => {
    const cnt = {};
    const aRecent = s.data?.team1Id === goalTeamId(a) ? s.data?.team1Recent : s.data?.team2Recent;
    (aRecent || []).forEach((x) => [x.match_hometeam_id, x.match_awayteam_id].forEach((id) => { cnt[id] = (cnt[id] || 0) + 1; }));
    const top = Object.entries(cnt).sort((p, q) => q[1] - p[1])[0]?.[0];
    return new Set(top ? [top] : []);
  }, [s.data, a]);

  const all = useMemo(() => (s.data?.directMatches || [])
    .filter((m) => !FRIENDLY_RE.test(m.league_name || ""))
    .sort((p, q) => (q.match_date || "").localeCompare(p.match_date || "")), [s.data]);
  const friendliesDropped = (s.data?.directMatches || []).length - all.length;

  const list = clOnly ? all.filter(isCL) : all;

  if (s.loading) return <p className="text-slate-500 text-xs text-center py-6">טוען…</p>;
  if (s.error) return <p className="text-red-400 text-xs">שגיאה: {s.error}</p>;

  return (
    <div className="space-y-2.5">
      {all.length > 0 && (
        <div className="flex rounded-full p-0.5 mx-auto w-fit" style={{ background: "rgba(255,255,255,0.06)" }}>
          {[[false, "כל המפעלים"], [true, "ליגת האלופות"]].map(([v, l]) => (
            <button key={l} onClick={() => setClOnly(v)} className="text-[11px] px-3 py-1 rounded-full font-semibold" style={{ background: clOnly === v ? "#38bdf8" : "transparent", color: clOnly === v ? "#000" : "#cbd5e1" }}>{l}</button>
          ))}
        </div>
      )}
      {list.length ? (
        <>
          <Summary list={list} a={a} b={b} aKeys={aKeys} />
          {list.map((m) => <MeetingCard key={m.match_id} m={m} showTag aKeys={aKeys} />)}
        </>
      ) : (
        <p className="text-slate-400 text-xs text-center py-6">{clOnly ? "הקבוצות לא נפגשו בליגת האלופות" : "הקבוצות לא נפגשו במשחק רשמי"}</p>
      )}
      {friendliesDropped > 0 && <p className="text-[10px] text-slate-600 text-center">הוסתרו {friendliesDropped} משחקי ידידות</p>}
    </div>
  );
}


export default function HeadToHead({ teamA, teamB }) {
  const [open, setOpen] = useState(false);
  if (!goalTeamId(teamA) || !goalTeamId(teamB)) return null;
  return (
    <div className="rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2"
      >
        <span className="text-[12px] font-bold text-white">⚔️ ראש בראש</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-slate-400 text-[10px]">▼</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-2.5 pb-2.5" dir="rtl">
              <H2HTab a={teamA} b={teamB} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
