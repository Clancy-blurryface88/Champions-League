import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Round, Match, Prediction, PublicProfile } from "@/api/entities";
import { User } from "@/api/entities";

const MEDAL = ['🥇', '🥈', '🥉'];

function GapBadge({ gap, delta }) {
  if (gap === null || gap === undefined) return <span style={{ color: '#1e293b', fontSize: 10 }}>—</span>;

  const isAhead  = gap > 0;
  const isTied   = gap === 0;
  const absGap   = Math.abs(gap);
  const dispGap  = absGap % 1 === 0 ? absGap : absGap.toFixed(1);
  const color    = isTied ? 'rgba(255,255,255,0.2)' : isAhead ? '#4ade80' : '#f87171';
  const prefix   = isTied ? '' : isAhead ? '+' : '-';

  // delta: positive = improving (gap growing in my favor), negative = worsening
  let deltaEl = null;
  if (delta !== null && delta !== undefined && delta !== 0) {
    const dColor = delta > 0 ? '#86efac' : '#fca5a5';
    const dAbs   = Math.abs(delta);
    const dDisp  = dAbs % 1 === 0 ? dAbs : dAbs.toFixed(1);
    deltaEl = (
      <span style={{ fontSize: 7, color: dColor, marginLeft: 2, opacity: 0.8 }}>
        {delta > 0 ? '▲' : '▼'}{dDisp}
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: 10, fontWeight: 700, color }}>{prefix}{dispGap}</span>
      {deltaEl}
    </span>
  );
}

export default function GapTrackingTable() {
  const [rounds, setRounds]       = useState([]);   // completed rounds sorted
  const [users, setUsers]         = useState([]);   // [{userId, name}]
  const [cumScores, setCumScores] = useState({});   // {userId: {roundId: cumPts}}
  const [finalRanks, setFinalRanks] = useState({}); // {userId: rank}
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

      const sortedRounds = [...allRounds].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // Only include rounds where at least one match is finished+calculated
      const completedRounds = sortedRounds.filter(r =>
        allMatches.some(m => m.round_id === r.id && m.is_finished && m.is_score_calculated)
      );

      // Latest prediction per user per match
      const latestMap = {};
      allPreds.forEach(p => {
        const key = `${p.user_id}__${p.match_id}`;
        if (!latestMap[key] || new Date(p.created_at) > new Date(latestMap[key].created_at))
          latestMap[key] = p;
      });
      const predsAll = Object.values(latestMap);

      // Compute cumulative scores per user per round (running totals)
      const running = {};   // {userId: pts}
      const cum = {};       // {userId: {roundId: pts}}

      for (const round of completedRounds) {
        const roundMatchIds = new Set(
          allMatches
            .filter(m => m.round_id === round.id && m.is_finished && m.is_score_calculated)
            .map(m => m.id)
        );

        predsAll.filter(p => roundMatchIds.has(p.match_id)).forEach(p => {
          running[p.user_id] = parseFloat(((running[p.user_id] || 0) + (p.points_earned || 0)).toFixed(2));
        });

        // snapshot after this round
        Object.entries(running).forEach(([uid, pts]) => {
          if (!cum[uid]) cum[uid] = {};
          cum[uid][round.id] = pts;
        });
      }

      // Final ranks (after last completed round)
      const lastRound = completedRounds[completedRounds.length - 1];
      const finalScores = lastRound
        ? Object.entries(cum)
            .map(([uid, rds]) => ({ userId: uid, pts: rds[lastRound.id] || 0 }))
            .sort((a, b) => b.pts - a.pts)
        : [];
      const ranks = {};
      finalScores.forEach((u, i) => { ranks[u.userId] = i + 1; });

      // Users list (anyone who ever had a prediction)
      const getName = uid => profiles.find(p => p.user_id === uid)?.display_name || '?';
      const usersList = Object.keys(cum)
        .map(uid => ({ userId: uid, name: getName(uid) }))
        .sort((a, b) => (ranks[a.userId] || 99) - (ranks[b.userId] || 99));

      const myId = me?.id || null;

      setRounds(completedRounds);
      setUsers(usersList);
      setCumScores(cum);
      setFinalRanks(ranks);
      setCurrentUserId(myId);
      setSelectedUser(myId && cum[myId] ? myId : usersList[0]?.userId ?? null);
    })().catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2.5 text-slate-400 text-sm">
        <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        טוען נתוני פערים...
      </div>
    );
  }

  if (rounds.length === 0 || users.length === 0) {
    return <div className="text-center py-12 text-slate-500 text-sm">אין נתונים עדיין</div>;
  }

  const myScores  = cumScores[selectedUser] || {};
  const myPts     = myScores[rounds[rounds.length - 1]?.id] ?? 0;
  const myRank    = finalRanks[selectedUser] ?? '—';
  const selUser   = users.find(u => u.userId === selectedUser);
  const otherUsers = users.filter(u => u.userId !== selectedUser);

  // gap of selectedUser vs opponent at round R
  const getGap = (oppId, roundId) => {
    const mine   = cumScores[selectedUser]?.[roundId];
    const theirs = cumScores[oppId]?.[roundId];
    if (mine === undefined && theirs === undefined) return null;
    return parseFloat(((mine || 0) - (theirs || 0)).toFixed(2));
  };

  // delta = gap change vs previous round
  const getDelta = (oppId, rIdx) => {
    if (rIdx === 0) return null;
    const curr = getGap(oppId, rounds[rIdx].id);
    const prev = getGap(oppId, rounds[rIdx - 1].id);
    if (curr === null || prev === null) return null;
    return parseFloat((curr - prev).toFixed(2));
  };

  return (
    <div className="rounded-[22px] overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(15,20,40,0.95) 0%, rgba(10,14,30,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
      }}>

      {/* top bar */}
      <div className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)' }} />

      {/* header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(167,139,250,0.18),rgba(96,165,250,0.08))', border: '1px solid rgba(167,139,250,0.25)' }}>
            <span className="text-lg">🏁</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">מעקב פערים — מצטבר</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">בחר משתתף לראות את הפער שלו לעומת כולם לאורך המחזורים</p>
          </div>
        </div>

        {/* user selector chips */}
        <div className="flex flex-wrap gap-1.5">
          {users.map(u => {
            const isMe = u.userId === currentUserId;
            const isSelected = u.userId === selectedUser;
            return (
              <button
                key={u.userId}
                onClick={() => setSelectedUser(u.userId)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: isSelected ? '#a78bfa' : 'rgba(255,255,255,0.05)',
                  border: isSelected ? '1px solid rgba(167,139,250,0.6)' : '1px solid rgba(255,255,255,0.08)',
                  color: isSelected ? '#fff' : isMe ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                  boxShadow: isSelected ? '0 2px 10px rgba(167,139,250,0.3)' : 'none',
                }}>
                {isMe ? `${u.name} (אתה)` : u.name}
                {finalRanks[u.userId] && (
                  <span style={{ marginLeft: 4, fontSize: 9, opacity: 0.7 }}>
                    #{finalRanks[u.userId]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* selected user summary */}
      <AnimatePresence mode="wait">
        {selectedUser && (
          <motion.div key={selectedUser}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

            {/* mini stat bar */}
            <div className="px-5 py-3 flex items-center gap-6 flex-wrap"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(167,139,250,0.04)' }}>
              <div>
                <div className="text-[10px] text-slate-500 mb-0.5">מקום נוכחי</div>
                <div className="text-xl font-black text-white">
                  {myRank <= 3 ? MEDAL[myRank - 1] : `#${myRank}`}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 mb-0.5">נקודות מצטבר</div>
                <div className="text-xl font-black text-violet-300">{myPts}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 mb-0.5">פער מ-#1</div>
                <div className="text-xl font-black" style={{ color: myRank === 1 ? '#facc15' : '#f87171' }}>
                  {myRank === 1 ? '—' : (() => {
                    const leader = users.find(u => finalRanks[u.userId] === 1);
                    if (!leader) return '—';
                    const leaderPts = cumScores[leader.userId]?.[rounds[rounds.length-1]?.id] || 0;
                    const diff = leaderPts - myPts;
                    return `-${diff % 1 === 0 ? diff : diff.toFixed(1)}`;
                  })()}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div className="text-[10px] text-slate-500 mb-0.5">מחזורים שהושלמו</div>
                <div className="text-xl font-black text-slate-300">{rounds.length}</div>
              </div>
            </div>

            {/* scrollable table */}
            <div className="overflow-x-auto px-4 py-4">
              <table className="text-sm" style={{ minWidth: rounds.length > 3 ? rounds.length * 80 + 160 : '100%', width: '100%' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th className="py-2 text-right text-[10px] font-bold text-slate-500 whitespace-nowrap pr-4" style={{ minWidth: 100 }}>
                      משתתף
                    </th>
                    {rounds.map(r => (
                      <th key={r.id} className="py-2 px-2 text-center text-[10px] font-bold text-slate-500 whitespace-nowrap">
                        {r.name}
                      </th>
                    ))}
                    <th className="py-2 px-2 text-center text-[10px] font-bold whitespace-nowrap" style={{ color: '#a78bfa88' }}>
                      עכשיו
                    </th>
                    <th className="py-2 px-2 text-center text-[10px] font-bold whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.15)' }}>
                      מגמה
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {otherUsers.map((opp, oidx) => {
                    const gapsPerRound = rounds.map((r, ri) => ({
                      roundId: r.id,
                      gap: getGap(opp.userId, r.id),
                      delta: getDelta(opp.userId, ri),
                    }));
                    const finalGap  = gapsPerRound[gapsPerRound.length - 1]?.gap ?? null;
                    const firstGap  = gapsPerRound[0]?.gap ?? null;
                    const trend     = firstGap !== null && finalGap !== null ? finalGap - firstGap : null;
                    const oppRank   = finalRanks[opp.userId];
                    const isAboveMe = oppRank < myRank;

                    return (
                      <motion.tr key={opp.userId}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: oidx * 0.03 }}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        className="hover:bg-white/[0.02] transition-colors">

                        {/* name + rank */}
                        <td className="py-2.5 pr-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <div className="flex flex-col items-end">
                              <span className="text-xs font-semibold text-white">{opp.name}</span>
                              <span className="text-[9px]" style={{ color: isAboveMe ? '#f87171' : '#4ade80' }}>
                                {isAboveMe ? '▲ מעלי' : '▼ מתחתי'}
                              </span>
                            </div>
                            <span className="text-xs font-black text-slate-400 w-5 text-left">
                              {oppRank <= 3 ? MEDAL[oppRank - 1] : oppRank}
                            </span>
                          </div>
                        </td>

                        {/* gap per round */}
                        {gapsPerRound.map(({ roundId, gap, delta }) => (
                          <td key={roundId} className="py-2.5 px-2 text-center">
                            <GapBadge gap={gap} delta={delta} />
                          </td>
                        ))}

                        {/* current gap (final) */}
                        <td className="py-2.5 px-2 text-center">
                          {finalGap !== null ? (
                            <span style={{
                              fontSize: 11, fontWeight: 800,
                              color: finalGap > 0 ? '#4ade80' : finalGap < 0 ? '#f87171' : 'rgba(255,255,255,0.3)',
                              padding: '2px 6px',
                              borderRadius: 6,
                              background: finalGap > 0 ? 'rgba(74,222,128,0.1)' : finalGap < 0 ? 'rgba(248,113,113,0.1)' : 'transparent',
                            }}>
                              {finalGap > 0 ? '+' : ''}{finalGap % 1 === 0 ? finalGap : finalGap.toFixed(1)}
                            </span>
                          ) : <span style={{ color: '#334155', fontSize: 10 }}>—</span>}
                        </td>

                        {/* trend arrow */}
                        <td className="py-2.5 px-2 text-center">
                          {trend === null ? (
                            <span style={{ color: '#334155', fontSize: 10 }}>—</span>
                          ) : trend > 0 ? (
                            <span style={{ fontSize: 13, color: '#4ade80' }}>↑</span>
                          ) : trend < 0 ? (
                            <span style={{ fontSize: 13, color: '#f87171' }}>↓</span>
                          ) : (
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>→</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* legend */}
            <div className="px-5 pb-4 flex flex-wrap gap-x-5 gap-y-1">
              {[
                [<span style={{color:'#4ade80'}}>+מספר</span>, 'אתה מקדים'],
                [<span style={{color:'#f87171'}}>-מספר</span>, 'אתה מפגר'],
                [<span style={{color:'#86efac',fontSize:9}}>▲</span>, 'שיפור במחזור זה'],
                [<span style={{color:'#fca5a5',fontSize:9}}>▼</span>, 'ירידה במחזור זה'],
                ['↑↓', 'מגמה כוללת לאורך כל המחזורים'],
              ].map(([sym,txt], i) => (
                <span key={i} className="flex items-center gap-1 text-[9px] text-slate-600">
                  <span>{sym}</span><span>{txt}</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
