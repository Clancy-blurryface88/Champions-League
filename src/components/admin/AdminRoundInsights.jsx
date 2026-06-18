import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Round, Match, Prediction, PublicProfile } from "@/api/entities";
import { Trophy, Target, TrendingUp, TrendingDown, Minus, Zap, BarChart3, Users, Star, AlertTriangle, ChevronDown } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────
const pct = (n, d) => d === 0 ? 0 : Math.round((n / d) * 100);
const avg = arr => arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

function StatCard({ label, value, sub, color = '#f5c518', icon: Icon }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1.5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {Icon && <Icon className="w-4 h-4 mb-0.5" style={{ color }} />}
      <div className="text-2xl font-black tabular-nums" style={{ color }}>{value}</div>
      <div className="text-white/80 text-xs font-semibold">{label}</div>
      {sub && <div className="text-slate-500 text-[10px]">{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex-1 h-px bg-gradient-to-r from-amber-400/30 to-transparent" />
      <span className="text-amber-400/80 text-[11px] font-bold tracking-widest uppercase whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-gradient-to-l from-amber-400/30 to-transparent" />
    </div>
  );
}

const RANK_COLOR = r => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : '#94a3b8';

export default function AdminRoundInsights() {
  const [rounds, setRounds]       = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [loadingRounds, setLoadingRounds] = useState(true);

  // load rounds list once
  useEffect(() => {
    Round.list('order').then(r => {
      const sorted = [...r].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setRounds(sorted);
      if (sorted.length > 0) setSelectedRound(sorted[0].id);
    }).finally(() => setLoadingRounds(false));
  }, []);

  // load data when round changes
  useEffect(() => {
    if (!selectedRound) return;
    setLoading(true);
    setData(null);
    (async () => {
      const [matches, allPreds, profiles] = await Promise.all([
        Match.filter({ round_id: selectedRound }),
        Prediction.list(),
        PublicProfile.list(),
      ]);

      const finishedMatches = matches.filter(m => m.is_finished && m.actual_score_a !== null);
      const matchIds = new Set(matches.map(m => m.id));
      const finishedIds = new Set(finishedMatches.map(m => m.id));

      // deduplicate predictions: keep latest per user+match
      const latestMap = {};
      allPreds.forEach(p => {
        if (!matchIds.has(p.match_id)) return;
        const key = `${p.user_id}__${p.match_id}`;
        if (!latestMap[key] || new Date(p.created_at) > new Date(latestMap[key].created_at))
          latestMap[key] = p;
      });
      const preds = Object.values(latestMap);
      const finishedPreds = preds.filter(p => finishedIds.has(p.match_id));

      const getName = uid => profiles.find(p => p.user_id === uid)?.display_name || uid?.slice(0, 6) || '?';

      // ── per-user stats ────────────────────────────────────────────────────
      const userMap = {};
      const ensureUser = uid => {
        if (!userMap[uid]) userMap[uid] = { userId: uid, name: getName(uid), pts: 0, exact: 0, outcome: 0, btts: 0, range: 0, predicted: 0, missed: 0 };
        return userMap[uid];
      };

      // count who submitted predictions for this round
      const allParticipants = new Set(preds.map(p => p.user_id));
      allParticipants.forEach(uid => ensureUser(uid));

      finishedPreds.forEach(p => {
        const u = ensureUser(p.user_id);
        u.predicted++;
        const pts = p.points_earned || 0;
        u.pts = parseFloat((u.pts + pts).toFixed(2));
        u.exact   += (p.exact_score_points_earned    || 0) > 0 ? 1 : 0;
        u.outcome += (p.correct_outcome_points_earned || 0) > 0 ? 1 : 0;
        u.btts    += (p.both_teams_scored_points_earned || 0) > 0 ? 1 : 0;
        u.range   += (p.goals_range_points_earned     || 0) > 0 ? 1 : 0;
      });

      // users who had 0 pts in the round
      Object.values(userMap).forEach(u => {
        u.missed = finishedMatches.length - u.predicted;
      });

      const userRows = Object.values(userMap).sort((a, b) => b.pts - a.pts).map((u, i) => ({ ...u, rank: i + 1 }));

      // ── per-match stats ───────────────────────────────────────────────────
      const matchStats = finishedMatches.map(m => {
        const mPreds = finishedPreds.filter(p => p.match_id === m.id);
        const total  = mPreds.length;
        const exact  = mPreds.filter(p => p.predicted_score_a === m.actual_score_a && p.predicted_score_b === m.actual_score_b).length;
        const correct = mPreds.filter(p => {
          const pDir = p.predicted_score_a > p.predicted_score_b ? 'h' : p.predicted_score_a < p.predicted_score_b ? 'a' : 'd';
          const aDir = m.actual_score_a > m.actual_score_b ? 'h' : m.actual_score_a < m.actual_score_b ? 'a' : 'd';
          return pDir === aDir;
        }).length;

        // most popular prediction
        const predCount = {};
        mPreds.forEach(p => {
          const k = `${p.predicted_score_a}-${p.predicted_score_b}`;
          predCount[k] = (predCount[k] || 0) + 1;
        });
        const topPred = Object.entries(predCount).sort((a, b) => b[1] - a[1])[0];

        return {
          id: m.id,
          name: `${m.team_a} vs ${m.team_b}`,
          actual: `${m.actual_score_a}–${m.actual_score_b}`,
          total,
          exact,
          correct,
          exactPct: pct(exact, total),
          correctPct: pct(correct, total),
          topPred: topPred ? `${topPred[0]} (${topPred[1]})` : '—',
        };
      }).sort((a, b) => a.exactPct - b.exactPct); // hardest first

      // ── fun facts ─────────────────────────────────────────────────────────
      const totalExacts    = finishedPreds.reduce((s, p) => s + ((p.exact_score_points_earned || 0) > 0 ? 1 : 0), 0);
      const totalOutcomes  = finishedPreds.reduce((s, p) => s + ((p.correct_outcome_points_earned || 0) > 0 ? 1 : 0), 0);
      const avgPts         = userRows.length > 0 ? parseFloat(avg(userRows.map(u => u.pts)).toFixed(2)) : 0;
      const zeroScorers    = userRows.filter(u => u.pts === 0).length;
      const perfectMatches = matchStats.filter(m => m.exactPct === 100).length;

      setData({ userRows, matchStats, finishedMatches, totalPreds: finishedPreds.length, totalExacts, totalOutcomes, avgPts, zeroScorers, perfectMatches, allParticipants: allParticipants.size });
    })().catch(console.error).finally(() => setLoading(false));
  }, [selectedRound]);

  const selectedRoundName = rounds.find(r => r.id === selectedRound)?.name || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-lg">תובנות מחזור</h2>
          <p className="text-slate-400 text-sm">ניתוח מעמיק לכל המשתתפים</p>
        </div>

        {/* Round selector */}
        {!loadingRounds && (
          <div className="relative">
            <select
              value={selectedRound || ''}
              onChange={e => setSelectedRound(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2 pr-8 outline-none focus:border-amber-500/50 cursor-pointer"
            >
              {rounds.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          <span className="text-sm">מנתח נתונים...</span>
        </div>
      )}

      <AnimatePresence mode="wait">
      {data && !loading && (
        <motion.div key={selectedRound} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="space-y-8">

          {/* ── Summary numbers ─────────────────────────────────────────── */}
          <div>
            <SectionTitle>סיכום מחזור</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="משתתפים" value={data.allParticipants} icon={Users} color="#60a5fa" />
              <StatCard label="ממוצע נקודות" value={data.avgPts} sub="לשחקן" icon={TrendingUp} color="#34d399" />
              <StatCard label="פגיעות מדויקות" value={data.totalExacts} sub={`מתוך ${data.totalPreds} ניחושים`} icon={Target} color="#fbbf24" />
              <StatCard label="כיוונים נכונים" value={data.totalOutcomes} sub={`${pct(data.totalOutcomes, data.totalPreds)}% הצלחה`} icon={Zap} color="#a78bfa" />
            </div>
          </div>

          {/* ── Leaderboard for this round ─────────────────────────────── */}
          <div>
            <SectionTitle>דירוג המחזור</SectionTitle>
            <div className="space-y-1.5">
              {data.userRows.map((u, i) => (
                <motion.div key={u.userId}
                  initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: u.rank <= 3 ? `${RANK_COLOR(u.rank)}14` : 'rgba(255,255,255,0.03)', border: `1px solid ${u.rank <= 3 ? RANK_COLOR(u.rank) + '44' : 'rgba(255,255,255,0.07)'}` }}>
                  {/* Rank */}
                  <span className="text-sm font-black w-6 text-center" style={{ color: RANK_COLOR(u.rank) }}>
                    {u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank-1] : u.rank}
                  </span>
                  {/* Name */}
                  <span className="text-white text-sm font-medium flex-1 truncate">{u.name}</span>
                  {/* Stats chips */}
                  <div className="hidden md:flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">🎯 {u.exact}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">✅ {u.outcome}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">⚽ {u.btts}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">📊 {u.range}</span>
                  </div>
                  {/* Points */}
                  <span className="font-black text-base tabular-nums ml-2" style={{ color: RANK_COLOR(u.rank) }}>{u.pts}</span>
                  <span className="text-slate-500 text-[10px]">נק'</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Match difficulty ─────────────────────────────────────────── */}
          {data.matchStats.length > 0 && (
            <div>
              <SectionTitle>ניתוח קושי משחקים</SectionTitle>
              <div className="space-y-2">
                {data.matchStats.map((m, i) => (
                  <div key={m.id} className="rounded-xl overflow-hidden"
                    style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-semibold truncate">{m.name}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5">
                          תוצאה: <span className="text-emerald-400 font-bold">{m.actual}</span>
                          {' · '}ניחוש נפוץ: <span className="text-amber-400">{m.topPred}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right flex-shrink-0">
                        <div className="text-center">
                          <div className="text-[10px] text-slate-500">מדויק</div>
                          <div className="font-bold text-sm" style={{ color: m.exactPct === 0 ? '#ef4444' : m.exactPct >= 50 ? '#34d399' : '#fbbf24' }}>
                            {m.exactPct}%
                          </div>
                          <div className="text-[9px] text-slate-600">{m.exact}/{m.total}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-slate-500">כיוון</div>
                          <div className="font-bold text-sm" style={{ color: m.correctPct >= 60 ? '#34d399' : m.correctPct >= 30 ? '#fbbf24' : '#ef4444' }}>
                            {m.correctPct}%
                          </div>
                          <div className="text-[9px] text-slate-600">{m.correct}/{m.total}</div>
                        </div>
                      </div>
                    </div>
                    {/* Difficulty bar */}
                    <div className="h-1 bg-white/5">
                      <div className="h-1 transition-all"
                        style={{
                          width: `${m.correctPct}%`,
                          background: m.correctPct >= 60 ? '#34d399' : m.correctPct >= 30 ? '#fbbf24' : '#ef4444'
                        }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 text-[10px] mt-2 text-center">ממוין לפי קושי — הכי קשה למעלה</p>
            </div>
          )}

          {/* ── Fun facts ───────────────────────────────────────────────── */}
          <div>
            <SectionTitle>עובדות מעניינות</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {/* Top exact scorer */}
              {data.userRows[0] && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(250,204,21,0.08)', border:'1px solid rgba(250,204,21,0.2)' }}>
                  <Trophy className="w-6 h-6 text-amber-400 flex-shrink-0" />
                  <div>
                    <div className="text-amber-300 font-bold text-sm">{data.userRows[0].name}</div>
                    <div className="text-amber-400/60 text-[10px]">מוביל המחזור עם {data.userRows[0].pts} נקודות</div>
                  </div>
                </div>
              )}

              {/* Most exact hits */}
              {(() => {
                const top = [...data.userRows].sort((a,b) => b.exact - a.exact)[0];
                return top && top.exact > 0 ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)' }}>
                    <Target className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <div>
                      <div className="text-yellow-300 font-bold text-sm">{top.name}</div>
                      <div className="text-yellow-400/60 text-[10px]">הכי הרבה פגיעות מדויקות: {top.exact}</div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Best outcome reader */}
              {(() => {
                const top = [...data.userRows].sort((a,b) => b.outcome - a.outcome)[0];
                return top && top.outcome > 0 ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.2)' }}>
                    <Zap className="w-6 h-6 text-violet-400 flex-shrink-0" />
                    <div>
                      <div className="text-violet-300 font-bold text-sm">{top.name}</div>
                      <div className="text-violet-400/60 text-[10px]">קרא כיוון נכון {top.outcome} פעמים</div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Hardest match */}
              {data.matchStats[0] && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div>
                    <div className="text-red-300 font-bold text-sm truncate">{data.matchStats[0].name}</div>
                    <div className="text-red-400/60 text-[10px]">הכי קשה לניחוש — רק {data.matchStats[0].correctPct}% כיוון נכון</div>
                  </div>
                </div>
              )}

              {/* Easiest match */}
              {data.matchStats.length > 1 && (() => {
                const easiest = [...data.matchStats].sort((a,b) => b.correctPct - a.correctPct)[0];
                return (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.2)' }}>
                    <Star className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="text-emerald-300 font-bold text-sm truncate">{easiest.name}</div>
                      <div className="text-emerald-400/60 text-[10px]">הכי קל — {easiest.correctPct}% ניחשו נכון</div>
                    </div>
                  </div>
                );
              })()}

              {/* Zero pointers */}
              {data.zeroScorers > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(100,116,139,0.08)', border:'1px solid rgba(100,116,139,0.2)' }}>
                  <TrendingDown className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  <div>
                    <div className="text-slate-300 font-bold text-sm">{data.zeroScorers} משתתפים</div>
                    <div className="text-slate-400/60 text-[10px]">סיימו המחזור עם 0 נקודות</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Full breakdown table ─────────────────────────────────────── */}
          <div>
            <SectionTitle>פירוט מלא</SectionTitle>
            <div className="rounded-2xl overflow-hidden border border-slate-700/60" style={{ background:'rgba(5,10,20,0.7)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/60">
                    <th className="px-4 py-2.5 text-left text-slate-500 text-[11px] font-bold w-8">#</th>
                    <th className="px-4 py-2.5 text-right text-slate-500 text-[11px] font-bold">שם</th>
                    <th className="px-3 py-2.5 text-center text-slate-500 text-[11px] font-bold">נק'</th>
                    <th className="px-3 py-2.5 text-center text-yellow-500/70 text-[11px] font-bold">🎯</th>
                    <th className="px-3 py-2.5 text-center text-blue-500/70 text-[11px] font-bold">✅</th>
                    <th className="px-3 py-2.5 text-center text-emerald-500/70 text-[11px] font-bold">⚽</th>
                    <th className="px-3 py-2.5 text-center text-purple-500/70 text-[11px] font-bold">📊</th>
                  </tr>
                </thead>
                <tbody>
                  {data.userRows.map((u, i) => (
                    <tr key={u.userId} className="border-b border-slate-800/60 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-2.5">
                        <span className="text-xs font-bold" style={{ color: RANK_COLOR(u.rank) }}>
                          {u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank-1] : u.rank}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-white text-xs font-medium">{u.name}</td>
                      <td className="px-3 py-2.5 text-center font-black text-sm tabular-nums" style={{ color: RANK_COLOR(u.rank) }}>{u.pts}</td>
                      <td className="px-3 py-2.5 text-center text-yellow-400 text-xs tabular-nums">{u.exact || '—'}</td>
                      <td className="px-3 py-2.5 text-center text-blue-400 text-xs tabular-nums">{u.outcome || '—'}</td>
                      <td className="px-3 py-2.5 text-center text-emerald-400 text-xs tabular-nums">{u.btts || '—'}</td>
                      <td className="px-3 py-2.5 text-center text-purple-400 text-xs tabular-nums">{u.range || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2.5 text-[10px] text-slate-600 flex gap-4">
                <span>🎯 פגיעה מדויקת</span>
                <span>✅ כיוון נכון</span>
                <span>⚽ BTTS</span>
                <span>📊 טווח שערים</span>
              </div>
            </div>
          </div>

        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
