import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { X, Home, Plane } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import { calcStandings } from "@/utils/standings";
import { getPredictedEntry } from "@/data/predictedLeagueTable2026";

const OUTCOME_COLOR = { W: "#4ade80", D: "#facc15", L: "#f87171" };

// Shows one team's 8 league-phase fixtures in matchday order — home/away
// marked with a house/plane icon, results colored for finished matches —
// plus current table position and points. Shared between the general-
// predictions onboarding (opened via its own info icon, independent of
// picking a team) and the match prediction card (opened by clicking a
// team's logo directly).
export default function TeamFixturesModal({ team, allMatches, logosByName, onClose }) {
  const fixtures = useMemo(() => {
    return allMatches
      .filter((m) => m.team_a === team.name || m.team_b === team.name)
      .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
      .map((m, i) => {
        const isHome = m.team_a === team.name;
        const opponent = isHome ? m.team_b : m.team_a;
        const finished = m.is_finished && m.actual_score_a != null && m.actual_score_b != null;
        let result = null;
        if (finished) {
          const gf = isHome ? m.actual_score_a : m.actual_score_b;
          const ga = isHome ? m.actual_score_b : m.actual_score_a;
          result = { score: `${m.actual_score_a}:${m.actual_score_b}`, outcome: gf > ga ? "W" : gf < ga ? "L" : "D" };
        }
        return { matchday: i + 1, isHome, opponent, opponentLogo: logosByName[opponent], result };
      });
  }, [team, allMatches, logosByName]);

  const standings = useMemo(() => calcStandings(allMatches), [allMatches]);
  const standingIndex = standings.findIndex((s) => s.name === team.name);
  const standing = standingIndex >= 0 ? standings[standingIndex] : null;
  const predicted = getPredictedEntry(team.name);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm rounded-2xl p-5"
        style={{ background: "rgba(15,20,35,0.97)", border: "1px solid rgba(255,255,255,0.1)" }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TeamFlag logo={team.logo_url} name={team.name} className="w-7 h-7" animate={false} />
            <span className="text-white font-semibold text-sm">{team.name} — לוח שלב הליגה</span>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {predicted && (
          <div
            className="rounded-xl p-3 mb-4"
            style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.25)" }}
          >
            <span className="text-blue-300 text-[10px] font-bold uppercase tracking-wide block mb-2">
              תחזית שלב הליגה
            </span>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-white/40 text-[9px]">מקום צפוי</div>
                <div className="text-white font-bold text-sm">{predicted.position}</div>
              </div>
              <div className="text-center">
                <div className="text-white/40 text-[9px]">נק' צפויות</div>
                <div className="text-white font-bold text-sm">{predicted.points.toFixed(1)}</div>
              </div>
            </div>
          </div>
        )}

        {fixtures.length === 0 ? (
          <p className="text-white/40 text-xs text-center py-6">לוח המשחקים עדיין לא ידוע.</p>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-2">
              {fixtures.map((f) => (
                <div
                  key={f.matchday}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <span className="text-white/40 text-[9px]">מחזור {f.matchday}</span>
                  <TeamFlag logo={f.opponentLogo} name={f.opponent} className="w-6 h-6" animate={false} />
                  <span dir="ltr" className="text-white/80 text-[8px] text-center leading-tight truncate w-full">{f.opponent}</span>
                  {f.isHome ? (
                    <Home className="w-3 h-3 text-green-400" />
                  ) : (
                    <Plane className="w-3 h-3 text-sky-400" />
                  )}
                  {f.result && (
                    <span dir="ltr" className="text-[9px] font-bold" style={{ color: OUTCOME_COLOR[f.result.outcome] }}>
                      {f.result.score}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {standing && (
              <div
                className="flex items-center justify-center gap-4 mt-4 pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="text-center">
                  <div className="text-white/40 text-[9px]">מיקום בטבלה</div>
                  <div className="text-white font-bold text-sm">{standingIndex + 1}</div>
                </div>
                <div className="text-center">
                  <div className="text-white/40 text-[9px]">נקודות</div>
                  <div className="text-white font-bold text-sm">{standing.Pts}</div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
