import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Round, Match, Prediction, PublicProfile } from "@/api/entities";
import { ChevronDown } from "lucide-react";

const RANK_COLOR  = r => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : '#94a3b8';
const RANK_BG     = r => r === 1 ? 'rgba(255,215,0,0.08)' : r === 2 ? 'rgba(192,192,192,0.06)' : r === 3 ? 'rgba(205,127,50,0.06)' : 'transparent';
const RANK_BORDER = r => r === 1 ? 'rgba(255,215,0,0.18)' : r === 2 ? 'rgba(192,192,192,0.12)' : r === 3 ? 'rgba(205,127,50,0.12)' : 'transparent';
const MEDAL = ['🥇', '🥈', '🥉'];

export default function RoundSummaryTable() {
  const [rounds, setRounds]         = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedName, setSelectedName]   = useState('');
  const [rows, setRows]             = useState([]);
  const [loading, setLoading]       = useState(false);
  const [loadingRounds, setLoadingRounds] = useState(true);

  useEffect(() => {
    (async () => {
      const [allRounds, allMatches] = await Promise.all([
        Round.list('order'),
        Match.list(),
      ]);
      const sorted = [...allRounds].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setRounds(sorted);

      // מחזור אחרון שבו כל המשחקים הסתיימו וחושבו
      let defaultId = sorted[0]?.id ?? null;
      for (let i = sorted.length - 1; i >= 0; i--) {
        const rMatches = allMatches.filter(m => m.round_id === sorted[i].id);
        if (rMatches.length > 0 && rMatches.every(m => m.is_finished && m.is_score_calculated)) {
          defaultId = sorted[i].id;
          break;
        }
      }
      setSelectedRound(defaultId);
      setSelectedName(sorted.find(r => r.id === defaultId)?.name ?? '');
    })().finally(() => setLoadingRounds(false));
  }, []);

  useEffect(() => {
    if (!selectedRound) return;
    setLoading(true);
    setRows([]);
    (async () => {
      const [matches, allPreds, profiles] = await Promise.all([
        Match.filter({ round_id: selectedRound }),
        Prediction.list(),
        PublicProfile.list(),
      ]);

      const finishedMatches = matches.filter(m => m.is_finished && m.actual_score_a !== null);
      const matchIds    = new Set(matches.map(m => m.id));
      const finishedIds = new Set(finishedMatches.map(m => m.id));
      const getName = uid => profiles.find(p => p.user_id === uid)?.display_name || '?';

      const latestMap = {};
      allPreds.forEach(p => {
        if (!matchIds.has(p.match_id)) return;
        const key = `${p.user_id}__${p.match_id}`;
        if (!latestMap[key] || new Date(p.created_at) > new Date(latestMap[key].created_at))
          latestMap[key] = p;
      });
      const preds         = Object.values(latestMap);
      const finishedPreds = preds.filter(p => finishedIds.has(p.match_id));

      const userMap = {};
      const ensure  = uid => {
        if (!userMap[uid]) userMap[uid] = { userId: uid, name: getName(uid), pts: 0, exact: 0, outcome: 0, btts: 0, range: 0, goals: 0 };
        return userMap[uid];
      };
      new Set(preds.map(p => p.user_id)).forEach(uid => ensure(uid));

      finishedPreds.forEach(p => {
        const u = ensure(p.user_id);
        u.pts     = parseFloat((u.pts + (p.points_earned || 0)).toFixed(2));
        u.exact   += (p.exact_score_points_earned       || 0) > 0 ? 1 : 0;
        u.outcome += (p.correct_outcome_points_earned   || 0) > 0 ? 1 : 0;
        u.btts    += (p.both_teams_scored_points_earned || 0) > 0 ? 1 : 0;
        u.range   += (p.goals_range_points_earned       || 0) > 0 ? 1 : 0;
        u.goals   += (p.predicted_score_a || 0) + (p.predicted_score_b || 0);
      });

      setRows(
        Object.values(userMap)
          .sort((a, b) => b.pts - a.pts)
          .map((u, i) => ({ ...u, rank: i + 1 }))
      );
    })().catch(console.error).finally(() => setLoading(false));
  }, [selectedRound]);

  const handleRoundChange = (id) => {
    setSelectedRound(id);
    setSelectedName(rounds.find(r => r.id === id)?.name ?? '');
  };

  return (
    <div className="rounded-[22px] overflow-hidden relative"
      style={{
        background: 'linear-gradient(160deg, rgba(15,20,40,0.95) 0%, rgba(10,14,30,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
      }}>

      {/* ── gradient top bar ── */}
      <div className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, #f5c518 0%, #fde68a 40%, #34d399 100%)' }} />

      {/* ── header ── */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between gap-3 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(245,197,24,0.18),rgba(253,230,138,0.08))', border: '1px solid rgba(245,197,24,0.25)' }}>
            <span className="text-lg">📋</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">פירוט מלא למחזור</h3>
            {selectedName && <p className="text-[11px] text-amber-400/60 mt-0.5">{selectedName}</p>}
          </div>
        </div>

        {!loadingRounds && rounds.length > 0 && (
          <div className="relative">
            <select
              value={selectedRound || ''}
              onChange={e => handleRoundChange(e.target.value)}
              className="appearance-none text-white text-xs rounded-xl px-3 py-2 pr-8 outline-none cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
              }}>
              {rounds.map(r => <option key={r.id} value={r.id} style={{ background: '#1e293b' }}>{r.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        )}
      </div>

      {/* ── body ── */}
      <div className="px-4 pb-5 pt-3">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="load"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center py-14 gap-2.5 text-slate-400 text-sm">
              <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              מנתח נתונים...
            </motion.div>
          ) : rows.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-14 text-slate-500 text-sm">
              אין נתונים למחזור זה
            </motion.div>
          ) : (
            <motion.div key={selectedRound}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>

              {/* ── podium top-3 ── */}
              {rows.length >= 3 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[rows[1], rows[0], rows[2]].map((u, i) => {
                    const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
                    return (
                      <motion.div key={u.userId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`rounded-xl p-3 text-center ${actualRank === 1 ? 'order-2' : ''}`}
                        style={{
                          background: RANK_BG(actualRank),
                          border: `1px solid ${RANK_BORDER(actualRank)}`,
                          marginTop: actualRank === 1 ? 0 : 10,
                        }}>
                        <div className="text-xl mb-1">{MEDAL[actualRank - 1]}</div>
                        <div className="text-white text-[11px] font-bold truncate">{u.name}</div>
                        <div className="font-black text-sm tabular-nums mt-0.5"
                          style={{ color: RANK_COLOR(actualRank) }}>{u.pts}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">נק'</div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* ── table ── */}
              <div className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <th className="px-3 py-2.5 text-left   text-slate-600 text-[10px] font-bold w-8">#</th>
                      <th className="px-3 py-2.5 text-right  text-slate-600 text-[10px] font-bold">שם</th>
                      <th className="px-2 py-2.5 text-center text-slate-500 text-[10px] font-bold">נק'</th>
                      <th className="px-2 py-2.5 text-center text-yellow-600/80  text-[10px] font-bold" title="פגיעה מדויקת">🎯</th>
                      <th className="px-2 py-2.5 text-center text-blue-600/80    text-[10px] font-bold" title="כיוון נכון">✅</th>
                      <th className="px-2 py-2.5 text-center text-emerald-600/80 text-[10px] font-bold" title="BTTS">⚽</th>
                      <th className="px-2 py-2.5 text-center text-purple-600/80  text-[10px] font-bold" title="טווח שערים">📊</th>
                      <th className="px-2 py-2.5 text-center text-red-600/80     text-[10px] font-bold" title="שערים שניחש">🔥</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((u, idx) => (
                      <motion.tr key={u.userId}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="transition-colors hover:bg-white/[0.03]"
                        style={{
                          borderBottom: idx < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          background: u.rank <= 3 ? RANK_BG(u.rank) : 'transparent',
                        }}>
                        <td className="px-3 py-2.5">
                          <span className="text-xs font-black" style={{ color: RANK_COLOR(u.rank) }}>
                            {u.rank <= 3 ? MEDAL[u.rank - 1] : u.rank}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <span className="text-xs font-semibold" style={{ color: u.rank <= 3 ? RANK_COLOR(u.rank) : '#e2e8f0' }}>
                            {u.name}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <span className="font-black text-sm tabular-nums" style={{ color: RANK_COLOR(u.rank) }}>{u.pts}</span>
                        </td>
                        <td className="px-2 py-2.5 text-center text-yellow-400  text-xs tabular-nums">{u.exact   || <span className="text-slate-700">—</span>}</td>
                        <td className="px-2 py-2.5 text-center text-blue-400    text-xs tabular-nums">{u.outcome || <span className="text-slate-700">—</span>}</td>
                        <td className="px-2 py-2.5 text-center text-emerald-400 text-xs tabular-nums">{u.btts    || <span className="text-slate-700">—</span>}</td>
                        <td className="px-2 py-2.5 text-center text-purple-400  text-xs tabular-nums">{u.range   || <span className="text-slate-700">—</span>}</td>
                        <td className="px-2 py-2.5 text-center text-red-400     text-xs tabular-nums">{u.goals   || <span className="text-slate-700">—</span>}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* legend */}
              <div className="mt-2.5 px-1 flex flex-wrap gap-x-4 gap-y-0.5">
                {[['🎯','פגיעה מדויקת'],['✅','כיוון נכון'],['⚽','BTTS'],['📊','טווח שערים'],['🔥','שערים שניחש']].map(([e,l]) => (
                  <span key={l} className="text-[9px] text-slate-600">{e} {l}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
