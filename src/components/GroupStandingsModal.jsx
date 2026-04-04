import React, { useState, useEffect } from "react";
import { Match } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin } from "lucide-react";
import moment from "moment";
import TeamFlag from "@/components/TeamFlag";
import { LoaderBar } from "@/components/ui/LoaderBar";

function calcStandings(matches) {
  const teams = {};

  const getTeam = (name, logo) => {
    if (!teams[name]) {
      teams[name] = { name, logo, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
    }
    return teams[name];
  };

  matches.forEach((m) => {
    if (!m.is_finished || m.actual_score_a === null || m.actual_score_b === null) return;
    const a = getTeam(m.team_a, m.team_a_logo);
    const b = getTeam(m.team_b, m.team_b_logo);
    const sa = m.actual_score_a, sb = m.actual_score_b;

    a.P++; b.P++;
    a.GF += sa; a.GA += sb; a.GD = a.GF - a.GA;
    b.GF += sb; b.GA += sa; b.GD = b.GF - b.GA;

    if (sa > sb)      { a.W++; a.Pts += 3; b.L++; }
    else if (sa < sb) { b.W++; b.Pts += 3; a.L++; }
    else              { a.D++; a.Pts++; b.D++; b.Pts++; }
  });

  // ensure all teams appear even with 0 games
  matches.forEach((m) => {
    getTeam(m.team_a, m.team_a_logo);
    getTeam(m.team_b, m.team_b_logo);
  });

  return Object.values(teams).sort((a, b) =>
    b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.name.localeCompare(b.name)
  );
}

export default function GroupStandingsModal({ group, onClose }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await Match.filter({ league: group });
        setMatches(data.sort((a, b) => new Date(a.match_date) - new Date(b.match_date)));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [group]);

  const standings = calcStandings(matches);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Panel */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-slate-900 border border-slate-700"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-700">
            <h2 className="text-white font-bold text-lg">{group}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {loading ? (
              <div className="py-16">
                <LoaderBar />
              </div>
            ) : (
              <>
                {/* Standings Table */}
                <div>
                  <h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-3">טבלת קבוצות</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-800 text-slate-400 text-xs">
                          <th className="text-left px-3 py-2">#</th>
                          <th className="text-left px-3 py-2">קבוצה</th>
                          <th className="text-center px-2 py-2">מ'</th>
                          <th className="text-center px-2 py-2">נ</th>
                          <th className="text-center px-2 py-2">ת</th>
                          <th className="text-center px-2 py-2">ה</th>
                          <th className="text-center px-2 py-2">+/-</th>
                          <th className="text-center px-2 py-2 font-bold text-yellow-400">נק'</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((team, i) => (
                          <tr key={team.name} className={`border-t border-slate-700/50 ${i < 2 ? "bg-green-500/5" : ""}`}>
                            <td className="px-3 py-2.5 text-slate-400 text-xs">{i + 1}</td>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                <TeamFlag logo={team.logo} name={team.name} className="w-5 h-5" />
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-slate-600 text-[10px] mt-1.5 px-1">🟢 עוברות לשלב הנוקאאוט</p>
                </div>

                {/* Matches List */}
                <div>
                  <h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-3">משחקי הבית</h3>
                  <div className="space-y-2">
                    {matches.map((m) => {
                      const finished = m.is_finished && m.actual_score_a !== null && m.actual_score_b !== null;
                      return (
                        <div key={m.id} className="bg-slate-800/60 rounded-xl border border-slate-700/50 px-4 py-3">
                          {/* Date + Location */}
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{moment(m.match_date).format("DD/MM/YYYY HH:mm")}</span>
                            </div>
                            {m.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[130px]">{m.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Teams + Score */}
                          <div className="flex items-center justify-between gap-2">
                            {/* Team A */}
                            <div className="flex items-center gap-2 flex-1">
                              <TeamFlag logo={m.team_a_logo} name={m.team_a} className="w-7 h-7" />
                              <span className="text-white text-xs font-medium truncate">{m.team_a}</span>
                            </div>

                            {/* Score / VS */}
                            <div className="flex-shrink-0 text-center min-w-[52px]">
                              {finished ? (
                                <span className="text-white font-bold text-base">
                                  {m.actual_score_a} – {m.actual_score_b}
                                </span>
                              ) : (
                                <span className="text-slate-500 text-sm font-medium">vs</span>
                              )}
                            </div>

                            {/* Team B */}
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <span className="text-white text-xs font-medium truncate text-right">{m.team_b}</span>
                              <TeamFlag logo={m.team_b_logo} name={m.team_b} className="w-7 h-7" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
