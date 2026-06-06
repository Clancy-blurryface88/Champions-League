import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { Round } from "@/api/entities";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderBar } from "@/components/ui/LoaderBar";
import { FlexibleIcon } from "@/components/ui/FlexibleIcon";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ─── Rank color helpers ───────────────────────────────────────────
function getRankColor(rank) {
  if (rank === 1) return '#f5c518';
  if (rank === 2) return '#94a3b8';
  if (rank === 3) return '#c2843a';
  if (rank <= 5) return '#3b82f6';
  return '#475569';
}

function getRankLabel(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

// ─── Trajectory Chart ────────────────────────────────────────────
function RankTrajectoryChart({ rankSeries, totalParticipants }) {
  if (!rankSeries || rankSeries.length === 0) return null;

  const W = 360, H = 160;
  const PAD = { top: 24, right: 20, bottom: 36, left: 28 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  const maxRank = Math.max(totalParticipants || 1, ...rankSeries.map(p => p.rank));
  const n = rankSeries.length;

  const toX = (i) => PAD.left + (n === 1 ? cW / 2 : (i / (n - 1)) * cW);
  const toY = (rank) => PAD.top + ((rank - 1) / Math.max(maxRank - 1, 1)) * cH;

  const pathD = rankSeries
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(p.rank).toFixed(1)}`)
    .join(' ');

  // Area fill path
  const areaD = rankSeries.length > 1
    ? `${pathD} L${toX(n - 1).toFixed(1)},${(PAD.top + cH).toFixed(1)} L${toX(0).toFixed(1)},${(PAD.top + cH).toFixed(1)} Z`
    : '';

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      className="overflow-visible"
      style={{ direction: 'ltr' }}
    >
      <defs>
        <linearGradient id="traj-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f5c518" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="traj-area" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
        <filter id="dot-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Subtle horizontal grid lines for top 3 */}
      {[1, 2, 3].map(rank => {
        if (rank > maxRank) return null;
        const y = toY(rank);
        return (
          <g key={rank}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
              stroke={getRankColor(rank)} strokeWidth={0.5} strokeOpacity={0.2} strokeDasharray="4 4" />
            <text x={PAD.left - 4} y={y + 3.5} textAnchor="end" fontSize={8}
              fill={getRankColor(rank)} fillOpacity={0.6}>{rank}</text>
          </g>
        );
      })}

      {/* Area fill */}
      {areaD && (
        <motion.path
          d={areaD}
          fill="url(#traj-area)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
      )}

      {/* Main line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#traj-line)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
      />

      {/* Dots + labels */}
      {rankSeries.map((p, i) => {
        const x = toX(i);
        const y = toY(p.rank);
        const color = getRankColor(p.rank);
        const shortName = (p.roundName || `מ${i + 1}`)
          .replace('מחזור ', 'מ')
          .substring(0, 4);

        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300, damping: 18 }}
          >
            {/* Outer ring */}
            <circle cx={x} cy={y} r={8} fill={color} fillOpacity={0.15} />
            {/* Dot */}
            <circle cx={x} cy={y} r={4.5} fill={color} filter="url(#dot-glow)" />
            {/* Rank label above */}
            <text x={x} y={y - 12} textAnchor="middle" fontSize={9} fontWeight="700"
              fill={color}>{getRankLabel(p.rank)}</text>
            {/* Round label below */}
            <text x={x} y={H - 6} textAnchor="middle" fontSize={8}
              fill="rgba(255,255,255,0.3)">{shortName}</text>
          </motion.g>
        );
      })}
    </svg>
  );
}

// ─── Trend badge ─────────────────────────────────────────────────
function TrendBadge({ rankSeries }) {
  if (!rankSeries || rankSeries.length < 2) return null;
  const first = rankSeries[0].rank;
  const last = rankSeries[rankSeries.length - 1].rank;
  const diff = first - last; // positive = improved (lower rank number)

  if (diff > 0) return (
    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
      <TrendingUp className="w-3.5 h-3.5" />
      +{diff} מיקומים
    </span>
  );
  if (diff < 0) return (
    <span className="flex items-center gap-1 text-rose-400 text-xs font-bold">
      <TrendingDown className="w-3.5 h-3.5" />
      {diff} מיקומים
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-slate-400 text-xs font-bold">
      <Minus className="w-3.5 h-3.5" />
      ללא שינוי
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────
export default function UserRankingsSummary() {
  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState({ users: [], ranks: {}, rounds: [] });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userRankCounts, setUserRankCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [roundsData, profilesData, matchesData, predictionsData] = await Promise.all([
          Round.list('order'),
          PublicProfile.list(),
          Match.list(),
          Prediction.list()
        ]);

        const sortedRounds = roundsData.sort((a, b) => a.order - b.order);

        const uniqueProfilesMap = new Map();
        profilesData.forEach(profile => {
          if (!uniqueProfilesMap.has(profile.user_id)) {
            uniqueProfilesMap.set(profile.user_id, profile);
          }
        });

        const users = Array.from(uniqueProfilesMap.values()).sort((a, b) =>
          (a.display_name || "").localeCompare(b.display_name || "")
        );

        const ranks = {};

        const matchesByRound = {};
        matchesData.forEach(m => {
          if (!matchesByRound[m.round_id]) matchesByRound[m.round_id] = [];
          if (m.is_finished) matchesByRound[m.round_id].push(m);
        });

        const predictionsMap = {};
        predictionsData.forEach(p => {
          if (!predictionsMap[p.match_id]) predictionsMap[p.match_id] = {};
          predictionsMap[p.match_id][p.user_id] = p;
        });

        sortedRounds.forEach(round => {
          const roundMatches = matchesByRound[round.id] || [];
          if (roundMatches.length === 0) { ranks[round.id] = {}; return; }

          const userPointsInRound = [];
          users.forEach(userProfile => {
            let points = 0;
            roundMatches.forEach(match => {
              const pred = predictionsMap[match.id]?.[userProfile.user_id];
              if (pred) points += (pred.points_earned || 0);
            });
            userPointsInRound.push({ userId: userProfile.user_id, points });
          });

          userPointsInRound.sort((a, b) => b.points - a.points);

          const roundRanks = {};
          for (let i = 0; i < userPointsInRound.length; i++) {
            if (i > 0 && userPointsInRound[i].points === userPointsInRound[i - 1].points) {
              roundRanks[userPointsInRound[i].userId] = roundRanks[userPointsInRound[i - 1].userId];
            } else {
              roundRanks[userPointsInRound[i].userId] = i + 1;
            }
          }
          ranks[round.id] = roundRanks;
        });

        setRankingData({ users, ranks, rounds: sortedRounds });

        const currentUser = await User.me().catch(() => null);
        if (currentUser && users.some(u => u.user_id === currentUser.id)) {
          setSelectedUserId(currentUser.id);
        } else if (users.length > 0) {
          setSelectedUserId(users[0].user_id);
        }
      } catch (error) {
        console.error("Error calculating ranking summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedUserId || !rankingData.ranks) return;
    const counts = {};
    Object.values(rankingData.ranks).forEach(roundRanks => {
      const rank = roundRanks[selectedUserId];
      if (rank) counts[rank] = (counts[rank] || 0) + 1;
    });
    setUserRankCounts(counts);
  }, [selectedUserId, rankingData]);

  if (loading) return <div className="py-8"><LoaderBar text="טוען סיכום מיקומים..." /></div>;

  // Medal grid data
  const ranksToShow = [1, 2, 3];
  let hasAnyData = false;
  Object.keys(userRankCounts).forEach(rank => {
    const r = parseInt(rank);
    if (userRankCounts[r] > 0) hasAnyData = true;
    if (!ranksToShow.includes(r)) ranksToShow.push(r);
  });
  ranksToShow.sort((a, b) => a - b);

  // Trajectory series
  const rankSeries = rankingData.rounds
    .map(round => {
      const rank = rankingData.ranks[round.id]?.[selectedUserId];
      return rank ? { roundName: round.name, rank } : null;
    })
    .filter(Boolean);

  const totalParticipants = rankingData.users.length;

  const getPositionIcon = (position) => {
    switch (position) {
      case 1: return <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/cda304519_gold-medal_7645285.png" alt="1st" className="w-8 h-8 object-contain mb-1" />;
      case 2: return <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2cdb3f3ad_silver-medal_7645682.png" alt="2nd" className="w-6 h-6 object-contain mb-1" />;
      case 3: return <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/5c6258044_bronze-medal_7645706.png" alt="3rd" className="w-6 h-6 object-contain mb-1" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8 mb-8"
    >
      <Card className="overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)' }}>
        <CardHeader className="text-center pb-4 border-b border-slate-700/50">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <FlexibleIcon src="/wc-trophy.png" alt="סיכום מיקומים" size="medium" />
            סיכום מיקומים למשתתף
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Player selector */}
          <div className="max-w-xs mx-auto">
            <label className="block text-sm font-medium text-slate-300 mb-2 text-center">בחר משתתף</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="bg-slate-900/90 border-slate-600 text-white hover:bg-slate-800/90 focus:bg-slate-800/90" dir="rtl">
                <SelectValue placeholder="בחר משתתף..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800/95 text-white border-slate-600" dir="rtl">
                {rankingData.users.map(user => (
                  <SelectItem key={user.user_id} value={user.user_id} className="focus:bg-slate-700 focus:text-blue-300">
                    {user.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!hasAnyData ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3 opacity-50">📭</div>
              <p className="text-slate-300 text-base">אין נתוני מיקומים למשתתף זה</p>
              <p className="text-slate-500 text-xs mt-1">המיקומים יופיעו כאן לאחר סיום מחזורים וחישוב נקודות</p>
            </div>
          ) : (
            <>
              {/* Medal grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3" dir="rtl">
                {ranksToShow.map(rank => {
                  const count = userRankCounts[rank] || 0;
                  let cls = "bg-slate-700/50 border-slate-600 text-slate-300";
                  if (rank === 1) cls = "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
                  else if (rank === 2) cls = "bg-slate-300/20 border-slate-400/50 text-slate-300";
                  else if (rank === 3) cls = "bg-amber-600/20 border-amber-600/50 text-amber-500";
                  else if (rank <= 10) cls = "bg-blue-500/10 border-blue-500/30 text-blue-300";

                  return (
                    <div key={rank} className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border ${cls}`}>
                      {getPositionIcon(rank)}
                      <span className="text-[11px] sm:text-xs opacity-80 mb-0.5">מקום {rank}</span>
                      <span className="text-xl sm:text-2xl font-bold leading-none">{count}</span>
                      <span className="text-[10px] opacity-70 mt-0.5">פעמים</span>
                    </div>
                  );
                })}
              </div>

              {/* Trajectory chart */}
              {rankSeries.length >= 2 && (
                <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 px-3 pt-4 pb-2">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-slate-300 text-xs font-semibold tracking-wide">מסלול דירוג לאורך הטורניר</span>
                    <TrendBadge rankSeries={rankSeries} />
                  </div>
                  <RankTrajectoryChart rankSeries={rankSeries} totalParticipants={totalParticipants} />
                </div>
              )}

              {rankSeries.length === 1 && (
                <p className="text-center text-slate-500 text-xs">הגרף יופיע לאחר לפחות 2 מחזורים</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
