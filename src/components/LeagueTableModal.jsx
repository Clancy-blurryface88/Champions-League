import React, { useState, useEffect, useRef } from "react";
import { useModalBackButtonOnMount } from "@/hooks/useModalBackButton";
import OrbitSpinner from "@/components/OrbitSpinner";
import { Match } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import { calcStandings } from "@/utils/standings";
import { loadLeagueTableOverride, applyOverride } from "@/utils/standingsOverride";
import { STAGES, DIRECT_R16_CUTOFF, PLAYOFF_CUTOFF } from "@/config/tournament";

export default function LeagueTableModal({ onClose, highlightTeams = {} }) {
  const [matches, setMatches] = useState([]);
  const [override, setOverride] = useState([]);
  const [loading, setLoading] = useState(true);
  const highlightRowRef = useRef(null);

  useModalBackButtonOnMount(onClose);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [data, { override: ovr }] = await Promise.all([
          Match.list('match_date'),
          loadLeagueTableOverride(),
        ]);
        setMatches(data.filter(m => m.stage === STAGES.LEAGUE_PHASE));
        setOverride(ovr || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Scroll the first highlighted team's row into view once the table has data
  useEffect(() => {
    if (!loading && (highlightTeams.home || highlightTeams.away) && highlightRowRef.current) {
      highlightRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading, highlightTeams]);

  const standings = applyOverride(calcStandings(matches), override);
  const hasOverride = override.length > 0;
  let highlightRowAssigned = false;

  const rowClass = (pos) =>
    pos <= DIRECT_R16_CUTOFF ? "bg-green-500/5" : pos <= PLAYOFF_CUTOFF ? "bg-yellow-500/5" : "bg-red-500/5";
  const posClass = (pos) =>
    pos <= DIRECT_R16_CUTOFF ? "text-green-400" : pos <= PLAYOFF_CUTOFF ? "text-yellow-400" : "text-red-400";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-slate-900 border border-slate-700"
        >
          <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-lg">טבלת הליגה</h2>
                {hasOverride && (
                  <span className="text-[10px] bg-orange-400/15 text-orange-400 border border-orange-400/30 px-1.5 py-0.5 rounded-full">
                    סידור ידני
                  </span>
                )}
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <OrbitSpinner size={40} />
              </div>
            ) : (
              <div>
                <p className="text-slate-500 text-[10px] text-center mb-3">
                  מיון לפי נקודות ← הפרש שערים ← שערים ← שערי חוץ ← ניצחונות ← ניצחוני חוץ
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-800 text-slate-400 text-xs">
                        <th className="text-left px-3 py-2">#</th>
                        <th className="text-left px-3 py-2">קבוצה</th>
                        <th className="text-center px-2 py-2">P</th>
                        <th className="text-center px-2 py-2">W</th>
                        <th className="text-center px-2 py-2">D</th>
                        <th className="text-center px-2 py-2">L</th>
                        <th className="text-center px-2 py-2">GD</th>
                        <th className="text-center px-2 py-2 font-bold text-yellow-400">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((team, i) => {
                        const pos = i + 1;
                        const isHome = team.name === highlightTeams.home;
                        const isAway = team.name === highlightTeams.away;
                        const isHighlighted = isHome || isAway;
                        const assignRef = isHighlighted && !highlightRowAssigned;
                        if (assignRef) highlightRowAssigned = true;
                        const highlightColor = isHome ? 'rgba(52,211,153,0.7)' : 'rgba(9,122,220,0.7)';
                        const highlightBg = isHome ? 'rgba(52,211,153,0.10)' : 'rgba(9,122,220,0.10)';
                        return (
                          <tr
                            key={team.name}
                            ref={assignRef ? highlightRowRef : null}
                            className={`border-t border-slate-700/50 ${rowClass(pos)}`}
                            style={isHighlighted ? {
                              boxShadow: `inset 0 0 0 2px ${highlightColor}`,
                              background: highlightBg,
                            } : undefined}
                          >
                            <td className="px-1.5 py-2.5 text-xs">
                              <span className={`font-bold ${posClass(pos)}`}>{pos}</span>
                            </td>
                            <td className="px-1.5 py-2.5">
                              <div className="flex items-center gap-2">
                                <TeamFlag logo={team.logo} name={team.name} className="w-6 h-6" />
                                <span className="text-white text-xs font-medium truncate max-w-[100px]">{team.name}</span>
                              </div>
                            </td>
                            <td className="text-center px-2 py-2.5 text-slate-300">{team.P}</td>
                            <td className="text-center px-2 py-2.5 text-green-400">{team.W}</td>
                            <td className="text-center px-2 py-2.5 text-slate-300">{team.D}</td>
                            <td className="text-center px-2 py-2.5 text-red-400">{team.L}</td>
                            <td className="text-center px-2 py-2.5 text-slate-300">{team.GD > 0 ? `+${team.GD}` : team.GD}</td>
                            <td className="text-center px-2 py-2.5 font-bold text-yellow-400">{team.Pts}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-3 mt-2 px-1 text-[10px] flex-wrap">
                  <span className="text-green-400">🟢 עולה ישירות ל-16 הגמר (1-8)</span>
                  <span className="text-yellow-400">🟡 פלייאוף (9-24)</span>
                  <span className="text-red-400">🔴 מודחת (25-36)</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
