import React, { useState, useEffect } from "react";
import { Round, Match, Prediction, PublicProfile } from "@/api/entities";
import { ChevronDown } from "lucide-react";

const RANK_COLOR = r => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : '#94a3b8';
const pct = (n, d) => d === 0 ? 0 : Math.round((n / d) * 100);

export default function RoundSummaryTable() {
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRounds, setLoadingRounds] = useState(true);

  useEffect(() => {
    Round.list('order').then(r => {
      const sorted = [...r].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setRounds(sorted);
      // ברירת מחדל — המחזור האחרון שהסתיים
      const finished = sorted.filter(round => round.is_finished ?? true);
      setSelectedRound((finished.length > 0 ? finished[finished.length - 1] : sorted[sorted.length - 1])?.id ?? sorted[0]?.id ?? null);
    }).finally(() => setLoadingRounds(false));
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

      // dedup: latest prediction per user+match
      const latestMap = {};
      allPreds.forEach(p => {
        if (!matchIds.has(p.match_id)) return;
        const key = `${p.user_id}__${p.match_id}`;
        if (!latestMap[key] || new Date(p.created_at) > new Date(latestMap[key].created_at))
          latestMap[key] = p;
      });
      const preds = Object.values(latestMap);
      const finishedPreds = preds.filter(p => finishedIds.has(p.match_id));

      const userMap = {};
      const ensure = uid => {
        if (!userMap[uid]) userMap[uid] = { userId: uid, name: getName(uid), pts: 0, exact: 0, outcome: 0, btts: 0, range: 0, goals: 0, predicted: 0 };
        return userMap[uid];
      };

      new Set(preds.map(p => p.user_id)).forEach(uid => ensure(uid));

      finishedPreds.forEach(p => {
        const u = ensure(p.user_id);
        u.predicted++;
        u.pts     = parseFloat((u.pts + (p.points_earned || 0)).toFixed(2));
        u.exact   += (p.exact_score_points_earned       || 0) > 0 ? 1 : 0;
        u.outcome += (p.correct_outcome_points_earned   || 0) > 0 ? 1 : 0;
        u.btts    += (p.both_teams_scored_points_earned || 0) > 0 ? 1 : 0;
        u.range   += (p.goals_range_points_earned       || 0) > 0 ? 1 : 0;
        u.goals   += (p.predicted_score_a || 0) + (p.predicted_score_b || 0);
      });

      const sorted = Object.values(userMap)
        .sort((a, b) => b.pts - a.pts)
        .map((u, i) => ({ ...u, rank: i + 1 }));

      setRows(sorted);
    })().catch(console.error).finally(() => setLoading(false));
  }, [selectedRound]);

  return (
    <div className="rounded-[20px] relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(40px) saturate(140%)',
        WebkitBackdropFilter: 'blur(40px) saturate(140%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.30)',
      }}>

      {/* header */}
      <div className="relative px-5 pt-5 pb-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="font-bold text-base text-white">פירוט מלא למחזור</h3>
        </div>

        {!loadingRounds && rounds.length > 0 && (
          <div className="relative">
            <select
              value={selectedRound || ''}
              onChange={e => setSelectedRound(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 pr-7 outline-none focus:border-amber-500/50 cursor-pointer">
              {rounds.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        )}
      </div>

      {/* table */}
      <div className="relative px-3 pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-slate-400 text-sm">
            <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            טוען...
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">אין נתונים למחזור זה</div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-slate-700/50"
            style={{ background: 'rgba(5,10,20,0.6)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/60">
                  <th className="px-3 py-2 text-left text-slate-500 text-[10px] font-bold w-7">#</th>
                  <th className="px-3 py-2 text-right text-slate-500 text-[10px] font-bold">שם</th>
                  <th className="px-2 py-2 text-center text-slate-500 text-[10px] font-bold">נק'</th>
                  <th className="px-2 py-2 text-center text-yellow-500/70 text-[10px] font-bold" title="פגיעה מדויקת">🎯</th>
                  <th className="px-2 py-2 text-center text-blue-500/70  text-[10px] font-bold" title="כיוון נכון">✅</th>
                  <th className="px-2 py-2 text-center text-emerald-500/70 text-[10px] font-bold" title="BTTS">⚽</th>
                  <th className="px-2 py-2 text-center text-purple-500/70 text-[10px] font-bold" title="טווח שערים">📊</th>
                  <th className="px-2 py-2 text-center text-red-500/70 text-[10px] font-bold" title="שערים שניחש">🔥</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(u => (
                  <tr key={u.userId} className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2.5">
                      <span className="text-xs font-bold" style={{ color: RANK_COLOR(u.rank) }}>
                        {u.rank <= 3 ? ['🥇', '🥈', '🥉'][u.rank - 1] : u.rank}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-white text-xs font-medium">{u.name}</td>
                    <td className="px-2 py-2.5 text-center font-black text-sm tabular-nums" style={{ color: RANK_COLOR(u.rank) }}>{u.pts}</td>
                    <td className="px-2 py-2.5 text-center text-yellow-400  text-xs tabular-nums">{u.exact    || '—'}</td>
                    <td className="px-2 py-2.5 text-center text-blue-400    text-xs tabular-nums">{u.outcome  || '—'}</td>
                    <td className="px-2 py-2.5 text-center text-emerald-400 text-xs tabular-nums">{u.btts     || '—'}</td>
                    <td className="px-2 py-2.5 text-center text-purple-400  text-xs tabular-nums">{u.range    || '—'}</td>
                    <td className="px-2 py-2.5 text-center text-red-400     text-xs tabular-nums">{u.goals    || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-3 py-2 text-[9px] text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5">
              <span>🎯 פגיעה מדויקת</span>
              <span>✅ כיוון נכון</span>
              <span>⚽ BTTS</span>
              <span>📊 טווח שערים</span>
              <span>🔥 שערים שניחש</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
