import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { supabase } from "@/api/supabase";
import { Match, Prediction } from "@/api/entities";
import { computeForecast, forecastShare } from "@/utils/forecastCalc";

// The live forecast row in the live table tab (21.11.2026, design 106): the compare button on the right
// (red-pink glass, three-people icon), and beside it the round's forecast in play — the points so far
// (finished matches + what the matches in play give right now) filling with water toward the forecast,
// and whether you're ahead of or behind the pace the forecast expected by now. The whole row comes in
// only once the table has settled (`live` arrives from LiveLeaderboard after its pass); until then its
// room is kept, so nothing moves. With no forecast for a round in play: the compare button alone.

const GREEN = "#22c55e", WATER = "#22d3ee", GOLD = "#facc15", NUM = "var(--num-font)";
const H = 40;
const CMP_BG = "linear-gradient(145deg, rgba(244,63,94,.38), rgba(139,92,246,.30) 60%, rgba(30,27,75,.55))";
const n = (x) => (x == null || x === "" ? 0 : Number(x));

function CompareBtn({ onCompare, wide }) {
  return (
    <motion.button type="button" onClick={onCompare} whileTap={{ scale: 0.94 }} className="relative flex items-center justify-center gap-1.5 overflow-hidden"
      style={{ width: wide ? "100%" : 104, height: H, flexShrink: 0, borderRadius: 12, background: CMP_BG, border: "1px solid rgba(253,164,175,.45)", color: "#fff", boxShadow: "inset 0 1px 0 rgba(255,255,255,.25)" }}>
      <motion.span className="absolute pointer-events-none" style={{ top: -10, bottom: -10, width: 18, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)", skewX: -20 }}
        initial={{ left: "-40%" }} animate={{ left: "140%" }} transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 3.2, delay: 1 }} />
      <span className="relative flex items-center gap-1.5"><Users style={{ width: 16, height: 16 }} /><span style={{ fontSize: 12, fontWeight: 900, whiteSpace: "nowrap" }}>{wide ? "השוואת ניחושים בין כולם" : "השוואה"}</span></span>
    </motion.button>
  );
}

// what the row needs for the round in play: the forecast, the points of finished matches, the pace
async function loadRound(userId) {
  const [matches, mine] = await Promise.all([Match.list(), Prediction.filter({ user_id: userId })]);
  const now = Date.now();
  const started = matches.filter((m) => new Date(m.match_date).getTime() <= now).sort((a, b) => new Date(b.match_date) - new Date(a.match_date));
  const roundId = started[0]?.round_id;
  if (!roundId) return null;
  const roundMatches = matches.filter((m) => m.round_id === roundId);
  if (roundMatches.every((m) => m.is_score_calculated)) return null; // the round is over: its result shows on the home screen
  const { data: f } = await supabase.from("round_forecasts").select("fc,cats").eq("user_id", userId).eq("round_id", roundId).maybeSingle();
  if (!f) return null;
  const byId = Object.fromEntries(matches.map((m) => [m.id, m]));
  const ids = new Set(roundMatches.map((m) => m.id));
  const myRound = mine.filter((p) => ids.has(p.match_id));
  // the pace: the same forecast (by the formula its row was made with), over only the matches that have kicked off
  const past = mine.filter((p) => byId[p.match_id]?.is_score_calculated && !ids.has(p.match_id)).map((p) => ({ match: byId[p.match_id], prediction: p }));
  const startedPicks = myRound.filter((p) => new Date(byId[p.match_id].match_date).getTime() <= now).map((p) => ({ match: byId[p.match_id], a: n(p.predicted_score_a), b: n(p.predicted_score_b) }));
  const pace = startedPicks.length ? (f.cats?.v >= 2 ? forecastShare(Number(f.fc), past, startedPicks, myRound.map((p) => ({ match: byId[p.match_id], a: n(p.predicted_score_a), b: n(p.predicted_score_b) })), matches) : computeForecast(past, startedPicks).fc) : 0;
  return { fc: Number(f.fc), pace, done: myRound.filter((p) => byId[p.match_id].is_score_calculated).map((p) => [p.match_id, n(p.points_earned)]) };
}

export default function LiveForecastRow({ live, onCompare }) {
  const [d, setD] = React.useState(undefined); // undefined: loading, null: nothing to show
  const liveKey = live ? `${live.live}|${(live.matchIds || []).join(",")}` : "";
  React.useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user?.id;
      const r = uid ? await loadRound(uid).catch(() => null) : null;
      if (alive) setD(r);
    }).catch(() => alive && setD(null));
    return () => { alive = false; };
  }, [liveKey]);
  // kept empty until the table has settled and the round is read
  if (!live || d === undefined) return <div style={{ height: H, marginTop: 12 }} />;
  if (!d) return <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 12 }}><CompareBtn onCompare={onCompare} wide /></motion.div>;

  // finished matches from the database (not the ones the live pass still counts), plus the live points
  const inPlay = new Set(live.matchIds || []);
  const pts = d.done.filter(([id]) => !inPlay.has(id)).reduce((s, [, p]) => s + p, 0) + n(live.live);
  const pct = d.fc > 0 ? Math.min(100, (pts / d.fc) * 100) : 0;
  const ahead = pts - d.pace;
  const fill = ahead >= 0 ? GREEN : WATER;
  return (
    <motion.div dir="rtl" className="flex items-center" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} style={{ gap: 8, marginTop: 12 }}>
      <CompareBtn onCompare={onCompare} />
      <div className="relative overflow-hidden" style={{ flex: 1, height: H, borderRadius: 12, border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.04)", color: "#fff" }}>
        <style>{"@keyframes lfr-wave{from{transform:translateY(0)}to{transform:translateY(-50%)}}@keyframes lfr-ping{75%,100%{transform:scale(2.2);opacity:0}}"}</style>
        {/* the water fills from the left toward the forecast */}
        <motion.div className="absolute inset-y-0 left-0" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3, duration: 1.8, ease: [0.33, 1, 0.68, 1] }} style={{ background: `linear-gradient(90deg, ${fill}33, ${fill}88)` }}>
          <svg viewBox="0 0 12 200" preserveAspectRatio="none" className="absolute top-0" style={{ right: -6, width: 7, height: "200%", animation: "lfr-wave 3s linear infinite" }}><path d="M6 0 Q0 25 6 50 T6 100 T6 150 T6 200 H0 V0Z" fill={`${fill}88`} /></svg>
        </motion.div>
        <div className="relative h-full flex items-center gap-2" style={{ padding: "0 10px" }}>
          <span className="relative flex" style={{ width: 7, height: 7 }}><span className="absolute inset-0 rounded-full" style={{ background: "#ef4444", animation: "lfr-ping 1.2s cubic-bezier(0,0,.2,1) infinite" }} /><span className="relative rounded-full" style={{ width: 7, height: 7, background: "#ef4444" }} /></span>
          <span style={{ fontSize: 11.5, fontWeight: 900, whiteSpace: "nowrap" }}>תחזית בלייב</span>
          <span style={{ flex: 1 }} />
          <span dir="ltr" style={{ fontFamily: NUM, fontWeight: 800, fontSize: 17, whiteSpace: "nowrap", textShadow: "0 1px 4px rgba(0,0,0,.6)" }}>{pts.toFixed(1)}<span style={{ fontSize: 12, color: GOLD }}> / {Math.round(d.fc)}</span></span>
          {d.pace > 0 && <span dir="ltr" title={ahead >= 0 ? "מקדים את הקצב" : "מאחורי הקצב"} style={{ fontFamily: NUM, fontWeight: 800, fontSize: 12, padding: "1px 6px", borderRadius: 6, background: ahead >= 0 ? "rgba(34,197,94,.25)" : "rgba(248,113,113,.25)", color: ahead >= 0 ? "#86efac" : "#fca5a5" }}>{ahead >= 0 ? "▲" : "▼"}{Math.abs(ahead).toFixed(1)}</span>}
        </div>
      </div>
    </motion.div>
  );
}
