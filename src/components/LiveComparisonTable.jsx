import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, WifiOff } from "lucide-react";
import OrbitSpinner from "@/components/OrbitSpinner";
import TeamFlag from "@/components/TeamFlag";
import { Match, Prediction, PublicProfile } from "@/api/entities";
import { TOURNAMENT_CODE } from "@/config/tournament";

// Same tolerant team-name matching as LiveLeaderboard.jsx — kept local
// rather than shared since it's a small, self-contained cross-reference
// helper (DB team name <-> live API team name), not core domain logic.
const TEAM_ALIASES = {
  "ctedivoire":        "ivorycoast",
  "caboverde":         "capeverde",
  "republicofireland": "ireland",
  "czechia":           "czechrepublic",
  "unitedstates":      "usa",
  "usmnt":             "usa",
  "dprkorea":          "northkorea",
  "koreadpr":          "northkorea",
  "korearepublic":     "southkorea",
  // "Manchaster City" is how this club's name is spelled throughout the DB
  // (a long-standing typo baked into imported fixtures/logos) — the live API
  // always returns the correct "Manchester City", so without this alias that
  // match silently drops out of every live view that matches by team name.
  "manchastercity":    "manchestercity",
};
function normTeam(n = '') {
  const base = n.toLowerCase().replace(/[^a-z0-9א-ת]/g, '');
  return TEAM_ALIASES[base] ?? base;
}
function teamsMatch(a, b) { const na = normTeam(a), nb = normTeam(b); return na === nb || na.includes(nb) || nb.includes(na); }
function findDbMatch(apiMatch, dbMatches) {
  const h = apiMatch.homeTeam?.name || '', hS = apiMatch.homeTeam?.shortName || '';
  const a = apiMatch.awayTeam?.name || '', aS = apiMatch.awayTeam?.shortName || '';
  return dbMatches.find(m => (teamsMatch(h, m.team_a) || teamsMatch(hS, m.team_a)) && (teamsMatch(a, m.team_b) || teamsMatch(aS, m.team_b))) || null;
}

function StatusCell({ cell }) {
  if (!cell) return <span className="text-slate-700 text-xs">–</span>;
  const status = cell.isExact
    ? { icon: '🎯', color: '#34d399', bg: 'rgba(52,211,153,0.12)' }
    : cell.isHit
      ? { icon: '✅', color: '#7cadee', bg: 'rgba(124,173,238,0.10)' }
      : { icon: '✕', color: '#64748b', bg: 'transparent' };
  return (
    <div
      className="flex items-center justify-center gap-1 rounded-lg py-1.5"
      style={{ background: status.bg }}
    >
      <span className="font-mono font-bold text-[13px] tabular-nums" style={{ color: status.color }} dir="ltr">
        {cell.predicted}
      </span>
      <span style={{ fontSize: 10 }}>{status.icon}</span>
    </div>
  );
}

function MatchColumnHeader({ apiMatch }) {
  const homeScore = apiMatch.score?.fullTime?.home ?? apiMatch.score?.halfTime?.home ?? 0;
  const awayScore = apiMatch.score?.fullTime?.away ?? apiMatch.score?.halfTime?.away ?? 0;
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-2" style={{ minWidth: 88 }}>
      <div className="flex items-center gap-1.5" dir="ltr">
        <TeamFlag logo={apiMatch.homeTeam?.crest} name={apiMatch.homeTeam?.shortName} size={18} rounded="sm" />
        <span className="text-white text-xs font-black tabular-nums">{homeScore}-{awayScore}</span>
        <TeamFlag logo={apiMatch.awayTeam?.crest} name={apiMatch.awayTeam?.shortName} size={18} rounded="sm" />
      </div>
      <span className="text-[9px] text-slate-500 truncate max-w-[84px] text-center leading-tight">
        {apiMatch.homeTeam?.shortName} - {apiMatch.awayTeam?.shortName}
      </span>
      {apiMatch.minute != null && (
        <span className="flex items-center gap-1 text-[9px] text-red-400 font-bold">
          <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
          {apiMatch.minute}'
        </span>
      )}
    </div>
  );
}

export default function LiveComparisonTable({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([]);       // [{ dbMatch, apiMatch }]
  const [rows, setRows] = useState([]);              // [{ userId, name, cells: { [matchId]: cell } }]

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [matches, profiles, predictions] = await Promise.all([
          Match.list(), PublicProfile.list(), Prediction.list(),
        ]);
        const now = new Date();
        const localDate = now.toLocaleDateString('sv-SE');
        const prevLocalDate = new Date(now - 864e5).toLocaleDateString('sv-SE');
        const res = await fetch(`/api/football?competition=${TOURNAMENT_CODE}&filter=LIVE&dateFrom=${prevLocalDate}&dateTo=${localDate}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'שגיאה');
        const liveMatches = json.matches || [];
        if (cancelled) return;

        const unfinished = matches.filter(m => !m.is_finished);
        const cols = [];
        for (const lm of liveMatches) {
          const f = findDbMatch(lm, unfinished);
          if (f) cols.push({ dbMatch: f, apiMatch: lm });
        }

        const getName = uid => profiles.find(p => p.user_id === uid)?.display_name || uid?.slice(0, 6) || '?';
        const byUser = {};
        for (const { dbMatch, apiMatch } of cols) {
          const homeScore = apiMatch.score?.fullTime?.home ?? apiMatch.score?.halfTime?.home ?? 0;
          const awayScore = apiMatch.score?.fullTime?.away ?? apiMatch.score?.halfTime?.away ?? 0;
          const matchPreds = predictions.filter(p => p.match_id === dbMatch.id);
          const latestMap = {};
          matchPreds.forEach(p => {
            if (!latestMap[p.user_id] || new Date(p.created_at) > new Date(latestMap[p.user_id].created_at))
              latestMap[p.user_id] = p;
          });
          for (const [userId, pred] of Object.entries(latestMap)) {
            const pA = pred.predicted_score_a, pB = pred.predicted_score_b;
            const pDir = pA > pB ? 'home' : pA < pB ? 'away' : 'draw';
            const aDir = homeScore > awayScore ? 'home' : homeScore < awayScore ? 'away' : 'draw';
            if (!byUser[userId]) byUser[userId] = { userId, name: getName(userId), cells: {} };
            byUser[userId].cells[dbMatch.id] = {
              predicted: `${pA}-${pB}`,
              isExact: pA === homeScore && pB === awayScore,
              isHit: pDir === aDir,
            };
          }
        }

        const built = Object.values(byUser).sort((a, b) => a.name.localeCompare(b.name, 'he'));
        if (!cancelled) {
          setColumns(cols);
          setRows(built);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) { setError(e.message); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <motion.div
          initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-2xl max-h-[85vh] overflow-hidden rounded-t-2xl sm:rounded-2xl flex flex-col"
          style={{ background: '#0b1a2e', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <h2 className="text-white font-bold text-base">השוואת ניחושים חיה</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-auto flex-1">
            {loading ? (
              <div className="py-20 flex items-center justify-center">
                <OrbitSpinner size={36} />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <WifiOff className="w-8 h-8 text-red-400/40" />
                <p className="text-slate-500 text-sm">{error}</p>
              </div>
            ) : columns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <span className="text-4xl">⚽</span>
                <p className="text-slate-400 text-sm font-medium">אין משחקים חיים כרגע</p>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th
                      className="sticky right-0 z-10 text-right px-3 py-2 text-slate-400 text-xs font-semibold"
                      style={{ background: '#0f1f38', minWidth: 96 }}
                    >
                      משתתף
                    </th>
                    {columns.map(({ dbMatch, apiMatch }) => (
                      <th key={dbMatch.id} className="px-1" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                        <MatchColumnHeader apiMatch={apiMatch} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.userId}
                      style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <td
                        className="sticky right-0 z-10 px-3 py-2 text-white text-[13px] font-semibold truncate"
                        style={{ background: i % 2 === 0 ? '#0b1a2e' : '#0d1d33', maxWidth: 110 }}
                      >
                        {row.name}
                      </td>
                      {columns.map(({ dbMatch }) => (
                        <td key={dbMatch.id} className="px-2 py-1 text-center" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                          <StatusCell cell={row.cells[dbMatch.id]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
