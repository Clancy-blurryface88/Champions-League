import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Round, Match, Prediction, PublicProfile, User } from "@/api/entities";
import { ChevronDown } from "lucide-react";

const MEDAL = ['🥇', '🥈', '🥉'];
const fmtRank = r => r <= 3 ? MEDAL[r - 1] : `#${r}`;
const fmt = v => Math.abs(v) % 1 === 0 ? Math.abs(v) : Math.abs(v).toFixed(1);

export default function GapTrackingTable() {
  const [rounds, setRounds]       = useState([]);
  const [users, setUsers]         = useState([]);
  const [roundScores, setRoundScores] = useState({}); // {uid: {roundId: pts this round}}
  const [cumScores, setCumScores]     = useState({}); // {uid: {roundId: cumulative pts}}
  const [finalRanks, setFinalRanks]   = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      const [allRounds, allMatches, allPreds, profiles, me] = await Promise.all([
        Round.list('order'),
        Match.list(),
        Prediction.list(),
        PublicProfile.list(),
        User.me().catch(() => null),
      ]);

      const sorted = [...allRounds].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const completed = sorted.filter(r =>
        allMatches.some(m => m.round_id === r.id && m.is_finished && m.is_score_calculated)
      );

      // latest pred per user per match
      const latestMap = {};
      allPreds.forEach(p => {
        const k = `${p.user_id}__${p.match_id}`;
        if (!latestMap[k] || new Date(p.created_at) > new Date(latestMap[k].created_at))
          latestMap[k] = p;
      });
      const predsAll = Object.values(latestMap);

      const rScores = {};  // per-round pts
      const cScores = {};  // cumulative pts
      const running = {};

      for (const round of completed) {
        const roundMatchIds = new Set(
          allMatches
            .filter(m => m.round_id === round.id && m.is_finished && m.is_score_calculated)
            .map(m => m.id)
        );
        predsAll.filter(p => roundMatchIds.has(p.match_id)).forEach(p => {
          const pts = p.points_earned || 0;
          if (!rScores[p.user_id]) rScores[p.user_id] = {};
          rScores[p.user_id][round.id] = parseFloat(((rScores[p.user_id][round.id] || 0) + pts).toFixed(2));
          running[p.user_id] = parseFloat(((running[p.user_id] || 0) + pts).toFixed(2));
        });
        Object.entries(running).forEach(([uid, pts]) => {
          if (!cScores[uid]) cScores[uid] = {};
          cScores[uid][round.id] = pts;
        });
      }

      const lastRound = completed[completed.length - 1];
      const sorted2 = Object.entries(cScores)
        .map(([uid, rds]) => ({ userId: uid, pts: rds[lastRound?.id] || 0 }))
        .sort((a, b) => b.pts - a.pts);
      const ranks = {};
      sorted2.forEach((u, i) => { ranks[u.userId] = i + 1; });

      const getName = uid => profiles.find(p => p.user_id === uid)?.display_name || '?';
      const usersList = Object.keys(cScores)
        .map(uid => ({ userId: uid, name: getName(uid) }))
        .sort((a, b) => (ranks[a.userId] || 99) - (ranks[b.userId] || 99));

      const myId = me?.id || null;
      setRounds(completed);
      setUsers(usersList);
      setRoundScores(rScores);
      setCumScores(cScores);
      setFinalRanks(ranks);
      setCurrentUserId(myId);
      setSelectedUser(myId && cScores[myId] ? myId : usersList[0]?.userId ?? null);
    })().catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-14 gap-2.5 text-slate-400 text-sm">
      <div className="w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
      טוען...
    </div>
  );

  if (!selectedUser || rounds.length === 0 || users.length < 2) return null;

  const lastRound = rounds[rounds.length - 1];
  const myTotal   = cumScores[selectedUser]?.[lastRound?.id] ?? 0;
  const myRank    = finalRanks[selectedUser] ?? '—';
  const others    = users.filter(u => u.userId !== selectedUser);

  // per-round: how many more/fewer pts did selected user score vs opponent
  const roundDiff = (oppId, roundId) => {
    const mine   = roundScores[selectedUser]?.[roundId] ?? 0;
    const theirs = roundScores[oppId]?.[roundId] ?? 0;
    return parseFloat((mine - theirs).toFixed(2));
  };

  // cumulative gap
  const cumGap = (oppId) => {
    const mine   = cumScores[selectedUser]?.[lastRound?.id] ?? 0;
    const theirs = cumScores[oppId]?.[lastRound?.id] ?? 0;
    return parseFloat((mine - theirs).toFixed(2));
  };

  return (
    <div className="rounded-[22px] overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(15,20,40,0.95), rgba(10,14,30,0.98))',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04)',
      }}>

      {/* top accent */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)' }} />

      {/* ── header ── */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between gap-4 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(167,139,250,0.18),rgba(96,165,250,0.08))', border: '1px solid rgba(167,139,250,0.3)' }}>
            <span className="text-lg">🏁</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">מעקב פערים — מצטבר</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">הפרש ניקוד לפי מחזור עבור המשתתף הנבחר</p>
          </div>
        </div>

        {/* user dropdown */}
        <div className="relative">
          <select
            value={selectedUser || ''}
            onChange={e => setSelectedUser(e.target.value)}
            className="appearance-none text-white text-sm font-semibold rounded-xl px-4 py-2.5 pr-9 outline-none cursor-pointer"
            style={{
              background: 'rgba(167,139,250,0.12)',
              border: '1px solid rgba(167,139,250,0.35)',
              minWidth: 170,
            }}>
            {users.map(u => (
              <option key={u.userId} value={u.userId} style={{ background: '#1e293b' }}>
                {u.userId === currentUserId ? `★ ${u.name} (אתה)` : u.name}
                {finalRanks[u.userId] ? ` · #${finalRanks[u.userId]}` : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-300 pointer-events-none" />
        </div>
      </div>

      {/* selected user mini-bar */}
      <div className="px-5 py-3 flex items-center gap-6"
        style={{ background: 'rgba(167,139,250,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div className="text-[10px] text-slate-500 mb-0.5">מקום נוכחי</div>
          <div className="text-xl font-black text-white">{fmtRank(myRank)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 mb-0.5">סה"כ נקודות</div>
          <div className="text-xl font-black text-violet-300">{myTotal}</div>
        </div>
        <div className="text-[10px] text-slate-600 leading-relaxed mr-auto max-w-[200px] text-left" dir="rtl">
          ירוק = השגת יותר נקודות ממנו באותו מחזור<br/>
          אדום = השיג יותר נקודות ממך באותו מחזור
        </div>
      </div>

      {/* ── table ── */}
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: Math.max(400, rounds.length * 90 + 180) }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <th style={{
                padding: '10px 20px', textAlign: 'right',
                fontSize: 10, fontWeight: 700, color: '#475569',
                position: 'sticky', left: 0,
                background: 'rgba(10,14,30,0.99)', zIndex: 2,
                minWidth: 130,
              }}>משתתף</th>

              {rounds.map(r => (
                <th key={r.id} style={{
                  padding: '10px 8px', textAlign: 'center',
                  fontSize: 10, fontWeight: 700, color: '#475569',
                  whiteSpace: 'nowrap', minWidth: 80,
                }}>{r.name}</th>
              ))}

              <th style={{
                padding: '10px 16px', textAlign: 'center',
                fontSize: 10, fontWeight: 700, color: '#a78bfa88',
                whiteSpace: 'nowrap',
              }}>פער סופי</th>
            </tr>
          </thead>
          <tbody>
            {others.map((opp, idx) => {
              const gap    = cumGap(opp.userId);
              const oppRnk = finalRanks[opp.userId] ?? 99;
              const isAbove = oppRnk < myRank;

              return (
                <motion.tr key={opp.userId}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  className="hover:bg-white/[0.025] transition-colors">

                  {/* sticky name */}
                  <td style={{
                    padding: '10px 20px', textAlign: 'right',
                    position: 'sticky', left: 0,
                    background: 'rgba(10,14,30,0.97)', zIndex: 1,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{opp.name}</div>
                    <div style={{ fontSize: 9, marginTop: 1, color: isAbove ? '#f87171' : '#4ade80' }}>
                      {fmtRank(oppRnk)} · {isAbove ? 'מעלי' : 'מתחתי'}
                    </div>
                  </td>

                  {/* per-round diff */}
                  {rounds.map(r => {
                    const d = roundDiff(opp.userId, r.id);
                    const color = d > 0 ? '#4ade80' : d < 0 ? '#f87171' : 'rgba(255,255,255,0.18)';
                    const bg    = d > 0 ? 'rgba(74,222,128,0.1)' : d < 0 ? 'rgba(248,113,113,0.1)' : 'transparent';
                    const label = d === 0 ? '—' : `${d > 0 ? '+' : '-'}${fmt(d)}`;
                    return (
                      <td key={r.id} style={{ padding: '8px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: 12, fontWeight: 700,
                          color, background: bg,
                          padding: '3px 10px', borderRadius: 7,
                          minWidth: 44,
                        }}>{label}</span>
                      </td>
                    );
                  })}

                  {/* cumulative gap badge */}
                  <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                    {gap === 0 ? (
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>שווה</span>
                    ) : (
                      <span style={{
                        display: 'inline-block',
                        fontSize: 13, fontWeight: 800,
                        color: gap > 0 ? '#4ade80' : '#f87171',
                        background: gap > 0 ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                        border: `1px solid ${gap > 0 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                        padding: '4px 12px', borderRadius: 8,
                      }}>
                        {gap > 0 ? '+' : '-'}{fmt(gap)}
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
