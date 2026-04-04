import React, { useState, useEffect } from "react";
import { Match } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin } from "lucide-react";
import moment from "moment";
import TeamFlag from "@/components/TeamFlag";

// FIFA WC 2026 tiebreaker order (group stage):
// 1. Pts  2. H2H Pts  3. H2H GD  4. H2H GF  5. Overall GD  6. Overall GF
function calcStandings(matches) {
  const teams = {};

  const ensure = (name, logo) => {
    if (!teams[name]) teams[name] = { name, logo, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
    return teams[name];
  };

  // Ensure every team appears even with 0 played
  matches.forEach(m => { ensure(m.team_a, m.team_a_logo); ensure(m.team_b, m.team_b_logo); });

  // Accumulate stats
  matches.forEach(m => {
    if (!m.is_finished || m.actual_score_a === null || m.actual_score_b === null) return;
    const a = teams[m.team_a], b = teams[m.team_b];
    const sa = m.actual_score_a, sb = m.actual_score_b;
    a.P++; b.P++;
    a.GF += sa; a.GA += sb;
    b.GF += sb; b.GA += sa;
    if (sa > sb)      { a.W++; a.Pts += 3; b.L++; }
    else if (sa < sb) { b.W++; b.Pts += 3; a.L++; }
    else              { a.D++; a.Pts++;    b.D++; b.Pts++; }
  });
  Object.values(teams).forEach(t => { t.GD = t.GF - t.GA; });

  // H2H stats for a subset of team names
  const h2hStats = (names) => {
    const s = {};
    names.forEach(n => { s[n] = { Pts: 0, GD: 0, GF: 0 }; });
    const set = new Set(names);
    matches.forEach(m => {
      if (!m.is_finished || m.actual_score_a === null || m.actual_score_b === null) return;
      if (!set.has(m.team_a) || !set.has(m.team_b)) return;
      const sa = m.actual_score_a, sb = m.actual_score_b;
      s[m.team_a].GF += sa; s[m.team_a].GD += sa - sb;
      s[m.team_b].GF += sb; s[m.team_b].GD += sb - sa;
      if (sa > sb)      { s[m.team_a].Pts += 3; }
      else if (sa < sb) { s[m.team_b].Pts += 3; }
      else              { s[m.team_a].Pts++;  s[m.team_b].Pts++; }
    });
    return s;
  };

  const list = Object.values(teams);

  // Sort: first by overall Pts, then apply tiebreakers within tied groups
  list.sort((a, b) => b.Pts - a.Pts);

  // Re-sort within groups of equal Pts using H2H then overall criteria
  const result = [];
  let i = 0;
  while (i < list.length) {
    let j = i + 1;
    while (j < list.length && list[j].Pts === list[i].Pts) j++;
    const group = list.slice(i, j);
    if (group.length > 1) {
      const h = h2hStats(group.map(t => t.name));
      group.sort((a, b) =>
        (h[b.name].Pts - h[a.name].Pts) ||
        (h[b.name].GD  - h[a.name].GD)  ||
        (h[b.name].GF  - h[a.name].GF)  ||
        (b.GD - a.GD)                    ||
        (b.GF - a.GF)                    ||
        a.name.localeCompare(b.name)
      );
    }
    result.push(...group);
    i = j;
  }
  return result;
}

const ALL_GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const toLetter = (g) => g.replace('Group ', '').trim();

export default function GroupStandingsModal({ group: initialGroup, onClose }) {
  const [activeGroup, setActiveGroup] = useState(() => toLetter(initialGroup));
  const [allMatches, setAllMatches] = useState({});  // { A: [...], B: [...], ... }
  const [loading, setLoading] = useState(true);

  // Load ALL matches once on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await Match.list('match_date');
        // Group by letter (league = "Group A" → "A")
        const grouped = {};
        data.forEach(m => {
          if (!m.league) return;
          const letter = toLetter(m.league);
          if (!grouped[letter]) grouped[letter] = [];
          grouped[letter].push(m);
        });
        // Sort each group's matches by date
        Object.keys(grouped).forEach(k => {
          grouped[k].sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
        });
        setAllMatches(grouped);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  const matches = allMatches[activeGroup] || [];
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
          <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center justify-between px-5 py-3">
              <h2 className="text-white font-bold text-lg">Group {activeGroup}</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Group selector A–L */}
            <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-hide">
              {ALL_GROUPS.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setActiveGroup(letter)}
                  className={`flex-shrink-0 w-9 h-9 rounded-lg text-sm font-bold transition-all border ${
                    activeGroup === letter
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                      : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-6">
            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Standings Table */}
                <div>
                  <h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-3 text-center">טבלת קבוצות</h3>
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
                        {standings.map((team, i) => (
                          <tr key={team.name} className={`border-t border-slate-700/50 ${
                            i < 2 ? "bg-green-500/5" : i === 2 ? "bg-yellow-500/5" : "bg-red-500/5"
                          }`}>
                            <td className="px-3 py-2.5 text-xs">
                              <span className={`font-bold ${i < 2 ? "text-green-400" : i === 2 ? "text-yellow-400" : "text-red-400"}`}>
                                {i + 1}
                              </span>
                            </td>
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
                  <div className="flex gap-3 mt-2 px-1 text-[10px]">
                    <span className="text-green-400">🟢 עובר אוטומטית</span>
                    <span className="text-yellow-400">🟡 אולי עובר (3rd best)</span>
                    <span className="text-red-400">🔴 יוצא</span>
                  </div>
                </div>

                {/* Matches List */}
                <div>
                  <h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-3 text-center">משחקי הבית</h3>
                  <div className="space-y-2">
                    {matches.map((m) => {
                      const finished = m.is_finished && m.actual_score_a !== null && m.actual_score_b !== null;
                      return (
                        <div key={m.id} className="bg-slate-800/60 rounded-xl border border-slate-700/50 px-4 py-3">
                          {/* Teams + Score */}
                          <div className="flex items-center justify-between gap-2 mb-2">
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

                          {/* Date + Location — below teams */}
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-700/40">
                            <div className="flex items-center gap-1">
                              <span>🗓️</span>
                              <span>{moment(m.match_date).format("DD/MM/YYYY · HH:mm")}</span>
                            </div>
                            {m.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[130px]">{m.location}</span>
                              </div>
                            )}
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
