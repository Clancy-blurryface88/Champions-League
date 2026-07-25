import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Round, Match, Prediction, PublicProfile } from "@/api/entities";
import { ChevronDown } from "lucide-react";

const MEDAL = ['🥇', '🥈', '🥉'];
const COL_COLOR = i => i % 2 === 0 ? '#e2e8f0' : '#60a5fa';

function RankChange({ change }) {
  if (change == null) return null;
  if (change === 0) return <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.18)', lineHeight: 1.2 }}>→</span>;
  if (change > 0) return <span style={{ fontSize: 9, fontWeight: 800, color: '#4ade80', lineHeight: 1.2 }}>↑{change}</span>;
  return <span style={{ fontSize: 9, fontWeight: 800, color: '#f87171', lineHeight: 1.2 }}>↓{Math.abs(change)}</span>;
}

function GapCell({ info }) {
  if (!info) return <span style={{ color: '#334155', fontSize: 10 }}>—</span>;
  if (info.isLeader) return <span style={{ color: '#475569', fontSize: 10 }}>—</span>;

  // first round — no previous data, just show current gap to leader
  if (info.gapDiff === null) {
    return (
      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}>
        -{info.currGap % 1 === 0 ? info.currGap : info.currGap.toFixed(1)}
      </span>
    );
  }

  if (info.gapErased) {
    return <span style={{ color: '#facc15', fontSize: 9, fontWeight: 800, letterSpacing: -0.3 }}>מחקת!</span>;
  }
  if (info.gapDiff > 0) {
    const v = info.gapDiff % 1 === 0 ? info.gapDiff : info.gapDiff.toFixed(1);
    return <span style={{ color: '#4ade80', fontSize: 9, fontWeight: 700 }}>▲{v}</span>;
  }
  if (info.gapDiff < 0) {
    const v = Math.abs(info.gapDiff);
    return <span style={{ color: '#f87171', fontSize: 9, fontWeight: 700 }}>▼{v % 1 === 0 ? v : v.toFixed(1)}</span>;
  }
  return <span style={{ color: '#475569', fontSize: 9 }}>—</span>;
}

export default function RoundSummaryTable() {
  const [rounds, setRounds]         = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedName, setSelectedName]   = useState('');
  const [rows, setRows]             = useState([]);
  const [rankInfo, setRankInfo]     = useState({});
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
    if (!selectedRound || rounds.length === 0) return;
    setLoading(true);
    setRows([]);
    setRankInfo({});

    (async () => {
      const [matches, allPreds, profiles, allMatches] = await Promise.all([
        Match.filter({ round_id: selectedRound }),
        Prediction.list(),
        PublicProfile.list(),
        Match.list(),
      ]);

      const finishedMatches = matches.filter(m => m.is_finished && m.actual_score_a !== null);
      const matchIds    = new Set(matches.map(m => m.id));
      const finishedIds = new Set(finishedMatches.map(m => m.id));
      const getName = uid => profiles.find(p => p.user_id === uid)?.display_name || '?';

      // latest prediction per user per match (across ALL rounds)
      const fullLatestMap = {};
      allPreds.forEach(p => {
        const key = `${p.user_id}__${p.match_id}`;
        if (!fullLatestMap[key] || new Date(p.created_at) > new Date(fullLatestMap[key].created_at))
          fullLatestMap[key] = p;
      });
      const allPredsLatest = Object.values(fullLatestMap);

      // per-round stats (existing logic, same as before)
      const preds         = allPredsLatest.filter(p => matchIds.has(p.match_id));
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

      // ── cumulative standings for rank-change + gap ──────────────────
      const selectedIdx    = rounds.findIndex(r => r.id === selectedRound);
      const roundIdsCurrent = rounds.slice(0, selectedIdx + 1).map(r => r.id);
      const roundIdsPrev    = rounds.slice(0, selectedIdx).map(r => r.id);
      const hasPrev         = roundIdsPrev.length > 0;

      const calcCum = (roundIds) => {
        const cumMatchIds = new Set(
          allMatches
            .filter(m => roundIds.includes(m.round_id) && m.is_finished && m.is_score_calculated)
            .map(m => m.id)
        );
        const umap = {};
        allPredsLatest.filter(p => cumMatchIds.has(p.match_id)).forEach(p => {
          if (!umap[p.user_id]) umap[p.user_id] = { userId: p.user_id, pts: 0 };
          umap[p.user_id].pts = parseFloat((umap[p.user_id].pts + (p.points_earned || 0)).toFixed(2));
        });
        return Object.values(umap)
          .sort((a, b) => b.pts - a.pts)
          .map((u, i) => ({ ...u, rank: i + 1 }));
      };

      const cumCurrent = calcCum(roundIdsCurrent);
      const cumPrev    = hasPrev ? calcCum(roundIdsPrev) : [];

      const leader     = cumCurrent[0];
      const prevLeader = cumPrev[0];

      const info = {};
      cumCurrent.forEach(u => {
        const prev     = cumPrev.find(p => p.userId === u.userId);
        const isLeader = leader?.userId === u.userId;
        const currGap  = isLeader ? 0 : parseFloat(Math.max(0, (leader?.pts || 0) - u.pts).toFixed(2));
        const prevGap  = hasPrev && prev
          ? (prevLeader?.userId === u.userId ? 0 : parseFloat(Math.max(0, (prevLeader?.pts || 0) - (prev.pts || 0)).toFixed(2)))
          : null;
        const rankChange = hasPrev && prev ? prev.rank - u.rank : null;
        const gapDiff    = prevGap !== null ? parseFloat((prevGap - currGap).toFixed(2)) : null;
        const gapErased  = prevGap !== null && prevGap > 0 && currGap === 0 && !isLeader;

        info[u.userId] = { cumRank: u.rank, rankChange, currGap, gapDiff, isLeader, gapErased };
      });
      setRankInfo(info);

    })().catch(console.error).finally(() => setLoading(false));
  }, [selectedRound, rounds]);

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

      {/* gradient top bar */}
      <div className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, #097adc 0%, #7cadee 40%, #34d399 100%)' }} />

      {/* header */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between gap-3 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(9, 122, 220,0.18),rgba(253,230,138,0.08))', border: '1px solid rgba(9, 122, 220,0.25)' }}>
            <span className="text-lg">📋</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">פירוט מלא למחזור</h3>
            {selectedName && <p className="text-[11px] text-sky-400/60 mt-0.5">{selectedName}</p>}
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

      {/* body */}
      <div className="px-4 pb-5 pt-3">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="load"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center py-14 gap-2.5 text-slate-400 text-sm">
              <div className="w-4 h-4 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
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

              <div className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <th className="px-3 py-2.5 text-left text-slate-600 text-[10px] font-bold w-10">#</th>
                      <th className="px-3 py-2.5 text-right text-slate-600 text-[10px] font-bold">שם</th>
                      {['נק\'','🎯','✅','⚽','📊','🔥'].map((h, i) => (
                        <th key={h} className="px-2 py-2.5 text-center text-[10px] font-bold"
                          style={{ color: COL_COLOR(i) + 'aa' }}
                          title={['נקודות','פגיעה מדויקת','כיוון נכון','BTTS','טווח שערים','שערים שניחש'][i]}>
                          {h}
                        </th>
                      ))}
                      <th
                        className="px-2 py-2.5 text-center text-[10px] font-bold"
                        style={{ color: 'rgba(255,255,255,0.18)' }}
                        title="צמצום/הרחבת פער ממקום 1 (מצטבר)">
                        פער
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((u, idx) => {
                      const ri = rankInfo[u.userId];
                      return (
                        <motion.tr key={u.userId}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="transition-colors hover:bg-white/[0.03]"
                          style={{ borderBottom: idx < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>

                          {/* rank + rank-change indicator */}
                          <td className="px-3 py-2">
                            <div className="flex flex-col items-start" style={{ gap: 1 }}>
                              <span className="text-xs font-black text-slate-400">
                                {u.rank <= 3 ? MEDAL[u.rank - 1] : u.rank}
                              </span>
                              <RankChange change={ri?.rankChange} />
                            </div>
                          </td>

                          <td className="px-3 py-2.5 text-right text-white text-xs font-semibold">{u.name}</td>

                          {[u.pts, u.exact, u.outcome, u.btts, u.range, u.goals].map((val, i) => (
                            <td key={i} className="px-2 py-2.5 text-center text-xs tabular-nums"
                              style={{ color: val ? COL_COLOR(i) : '#334155', fontWeight: i === 0 ? 900 : 400, fontSize: i === 0 ? '0.8rem' : '0.75rem' }}>
                              {val || '—'}
                            </td>
                          ))}

                          {/* gap cell */}
                          <td className="px-2 py-2.5 text-center">
                            <GapCell info={ri} />
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* legend */}
              <div className="mt-2.5 px-1 flex flex-wrap gap-x-4 gap-y-0.5">
                {[
                  ['🎯','פגיעה מדויקת'],['✅','כיוון נכון'],['⚽','BTTS'],
                  ['📊','טווח שערים'],['🔥','שערים שניחש'],
                  ['↑↓','שינוי דירוג מצטבר'],['פער','צמצום/הרחבת פער ממקום 1'],
                ].map(([e,l]) => (
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
