import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Target, TrendingUp, HelpCircle, Star, Medal, Zap, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import { Prediction, Match, UserStats, Round, PublicProfile } from "@/api/entities";
import { LoaderBar } from "@/components/ui/LoaderBar";
import LottieAnimation from "@/components/ui/LottieAnimation";

// Accent color per slide
const PAGE_ACCENT = [
  '#f5c518', // 0 Intro
  '#f59e0b', // 1 Total Points
  '#06b6d4', // 2 Average Points
  '#ef4444', // 3 Exact Hits
  '#f97316', // 4 Hits Leaderboard
  '#10b981', // 5 Hits Per Round
  '#a855f7', // 6 Prediction Frequency
  '#f97316', // 7 Exact Hits Points/Rank
  '#22c55e', // 8 Correct Outcome
  '#eab308', // 9 Points Per Round
  '#6366f1', // 10 Rank Per Round
  '#fb923c', // 11 Best Match
  '#8b5cf6', // 12 Breakdown
  '#3b82f6', // 13 Overall Leaderboard
  '#f5c518', // 14 Outro
];

const cardVariants = {
  enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0, scale: 0.96 }),
};

const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

// Reusable glass panel
const Glass = ({ children, className = '', accent = '#f5c518' }) => (
  <div
    className={`relative rounded-3xl ${className}`}
    style={{
      background: 'rgba(255,255,255,0.06)',
      border: `1px solid ${accent}30`,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`,
    }}
  >
    {children}
  </div>
);

// Gradient text helper
const GradText = ({ children, from = '#f5c518', to = '#fde68a', className = '' }) => (
  <span
    className={className}
    style={{
      background: `linear-gradient(135deg, ${from}, ${to})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  >
    {children}
  </span>
);

// Aurora animated background
const AuroraBackground = ({ accent }) => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    <div className="absolute inset-0" style={{ background: '#060d1e' }} />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: '70vw', height: '70vw',
        top: '-20%', left: '-10%',
        filter: 'blur(120px)',
        background: accent,
        opacity: 0.18,
      }}
      animate={{ x: [0, 30, 0], y: [0, 20, 0], opacity: [0.15, 0.22, 0.15] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: '55vw', height: '55vw',
        bottom: '-15%', right: '-10%',
        filter: 'blur(100px)',
        background: '#3b82f6',
        opacity: 0.14,
      }}
      animate={{ x: [0, -25, 0], y: [0, -15, 0], opacity: [0.10, 0.18, 0.10] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: '40vw', height: '40vw',
        top: '30%', right: '20%',
        filter: 'blur(90px)',
        background: accent,
        opacity: 0.09,
      }}
      animate={{ x: [0, 15, 0], y: [0, -20, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
    />
  </div>
);

// ─── CARD COMPONENTS ───────────────────────────────────────────────────────────

const Card1_Intro = ({ summaryData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-6">
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: '#f5c518', filter: 'blur(48px)', opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a99a73381_image.png"
        alt="Trophy"
        draggable={false}
        className="w-36 h-36 object-contain relative z-10 pointer-events-none"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 32px rgba(245,197,24,0.6))' }}
      />
    </div>

    <div>
      <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-1">World Cup 2026</p>
      <h1 className="text-4xl font-black text-white mb-1">הסיכום שלך</h1>
      <p className="text-white/40 text-sm">החוויה האישית שלך בטורניר</p>
    </div>

    <Glass accent="#f5c518" className="px-8 py-4 w-full max-w-xs">
      <p className="text-white/50 text-xs mb-1">המיקום שלך בטבלה</p>
      <motion.div
        className="text-7xl font-black"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.3 }}
      >
        <GradText from="#f5c518" to="#fde68a">#{summaryData.myOverallRank}</GradText>
      </motion.div>
    </Glass>
  </div>
);

const Card2_TotalPoints = ({ summaryData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-6">
    <div className="w-52 h-52" style={{ filter: 'hue-rotate(-165deg) saturate(2) brightness(1.2)' }}>
      <LottieAnimation src="https://media.base44.com/files/public/68656264510003eeef16bac3/46691d85b_coinsblue.json" loop={false} />
    </div>
    <h2 className="text-2xl font-bold text-white">נקודות שצברת עד כה</h2>
    <Glass accent="#f59e0b" className="px-10 py-5 w-full max-w-xs">
      <motion.div
        className="text-8xl font-black"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
      >
        <GradText from="#f59e0b" to="#fde68a">{summaryData.totalPoints}</GradText>
      </motion.div>
      <p className="text-white/40 text-sm mt-1">נקודות</p>
    </Glass>
  </div>
);

const Card2b_AveragePoints = ({ summaryData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-5">
    <div className="relative">
      <div className="absolute inset-0 rounded-full" style={{ background: '#06b6d4', filter: 'blur(40px)', opacity: 0.3 }} />
      <TrendingUp className="w-20 h-20 text-cyan-400 relative z-10" style={{ filter: 'drop-shadow(0 0 16px rgba(6,182,212,0.5))' }} />
    </div>
    <h2 className="text-2xl font-bold text-white">ממוצע נקודות</h2>
    <div className="flex gap-4 w-full max-w-xs">
      <Glass accent="#06b6d4" className="flex-1 py-4">
        <div className="text-4xl font-black"><GradText from="#06b6d4" to="#67e8f9">{summaryData.averagePoints}</GradText></div>
        <p className="text-white/40 text-xs mt-1">למשחק</p>
      </Glass>
      <Glass accent="#10b981" className="flex-1 py-4">
        <div className="text-4xl font-black"><GradText from="#10b981" to="#6ee7b7">{summaryData.averagePointsPerRound}</GradText></div>
        <p className="text-white/40 text-xs mt-1">למחזור</p>
      </Glass>
    </div>
  </div>
);

const Card3_ExactHits = ({ summaryData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-5">
    <div className="relative">
      <div className="absolute inset-0 rounded-full" style={{ background: '#ef4444', filter: 'blur(40px)', opacity: 0.3 }} />
      <Target className="w-20 h-20 text-red-400 relative z-10" style={{ filter: 'drop-shadow(0 0 16px rgba(239,68,68,0.5))' }} />
    </div>
    <h2 className="text-2xl font-bold text-white">פגעת בתוצאה המדויקת</h2>
    <Glass accent="#ef4444" className="px-10 py-5 w-full max-w-xs">
      <motion.div
        className="text-8xl font-black"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
      >
        <GradText from="#ef4444" to="#fca5a5">{summaryData.exactHitsCount}</GradText>
      </motion.div>
      <p className="text-white/40 text-sm mt-1">פגיעות מדויקות</p>
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <span className="text-red-400 font-bold text-lg">
          {summaryData.totalPredictionsCount > 0
            ? (summaryData.exactHitsCount / summaryData.totalPredictionsCount * 100).toFixed(1)
            : 0}%
        </span>
        <span className="text-white/40 text-sm"> מכלל הניחושים</span>
      </div>
    </Glass>
  </div>
);

const Card_HitsLeaderboard = ({ summaryData }) => (
  <div className="flex flex-col items-center h-full text-center px-4 pt-6 gap-4 w-full">
    <Target className="w-12 h-12 text-orange-400" style={{ filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.5))' }} />
    <h2 className="text-xl font-bold text-white">טבלת פגיעות מדויקות</h2>
    <Glass accent="#f97316" className="w-full max-w-md overflow-hidden flex-1 min-h-0 flex flex-col">
      <div className="overflow-y-auto p-2 space-y-1.5 flex-1">
        {summaryData.hitsLeaderboard.map((player, idx) => {
          const medalColors = ['#f5c518', '#94a3b8', '#fb923c'];
          return (
            <div
              key={idx}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{
                background: player.isMe ? 'rgba(249,115,22,0.18)' : 'rgba(255,255,255,0.04)',
                border: player.isMe ? '1px solid rgba(249,115,22,0.4)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="font-black text-lg" style={{ color: medalColors[idx] || '#94a3b8', minWidth: 28 }}>
                {idx < 3 ? ['🥇','🥈','🥉'][idx] : `#${player.rank}`}
              </span>
              <span className={`flex-1 text-right text-sm font-medium ${player.isMe ? 'text-orange-300' : 'text-white'}`}>
                {player.name}{player.isMe && ' (אני)'}
              </span>
              <span className="font-black text-orange-400 text-base ml-3">{player.count}</span>
            </div>
          );
        })}
      </div>
    </Glass>
  </div>
);

const Card_HitsPerRound = ({ summaryData }) => {
  const max = Math.max(...summaryData.hitsPerRound.map(r => r.count), 1);
  return (
    <div className="flex flex-col items-center h-full text-center px-4 pt-6 gap-4 w-full">
      <h2 className="text-xl font-bold text-white">פגיעות לפי מחזור</h2>
      <Glass accent="#10b981" className="w-full max-w-md p-4 overflow-y-auto flex-1 min-h-0">
        <div className="space-y-2.5">
          {summaryData.hitsPerRound.map((round, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs text-white/40 w-16 text-right shrink-0">{round.name}</span>
              <div className="flex-1 rounded-full h-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(round.count / max) * 100}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #10b981, #6ee7b7)' }}
                />
              </div>
              <span className="text-sm font-bold text-emerald-400 w-5 shrink-0">{round.count}</span>
            </div>
          ))}
        </div>
      </Glass>
    </div>
  );
};

const Card2c_PredictionFrequency = ({ summaryData }) => (
  <div className="flex flex-col items-center h-full text-center px-4 pt-6 gap-4 w-full">
    <HelpCircle className="w-12 h-12 text-purple-400" style={{ filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.5))' }} />
    <h2 className="text-xl font-bold text-white">התוצאות הנפוצות שלך</h2>
    <Glass accent="#a855f7" className="w-full max-w-md overflow-hidden flex-1 min-h-0 flex flex-col">
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-sm">
          <thead className="sticky top-0" style={{ background: 'rgba(10,10,30,0.85)', backdropFilter: 'blur(12px)' }}>
            <tr>
              <th className="p-3 text-center text-white/40 font-medium">תוצאה</th>
              <th className="p-3 text-center text-white/40 font-medium">כמות</th>
              <th className="p-3 text-center text-white/40 font-medium">פגיעות</th>
              <th className="p-3 text-center text-white/40 font-medium">%</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.predictionFrequency.map((item, idx) => (
              <tr key={idx} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <td className="p-3 text-center font-black text-white text-base">{item.score}</td>
                <td className="p-3 text-center font-bold text-purple-300">{item.count}</td>
                <td className="p-3 text-center font-bold text-blue-300">{item.hitCount}</td>
                <td className="p-3 text-center text-white/40 text-xs">{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Glass>
  </div>
);

const Card4_ExactHitsPointsRank = ({ summaryData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-5">
    <div className="relative">
      <div className="absolute inset-0 rounded-full" style={{ background: '#f97316', filter: 'blur(40px)', opacity: 0.3 }} />
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68656264510003eeef16bac3/777e305ab_focus_18224750.png"
        alt="Target"
        draggable={false}
        className="w-20 h-20 object-contain relative z-10 pointer-events-none"
        style={{ filter: 'drop-shadow(0 0 16px rgba(249,115,22,0.6))' }}
      />
    </div>
    <h2 className="text-xl font-bold text-white">נקודות מניחושים מדויקים</h2>
    <Glass accent="#f97316" className="w-full max-w-xs py-5 px-8">
      <div className="text-7xl font-black"><GradText from="#f97316" to="#fde68a">{summaryData.exactHitsPoints}</GradText></div>
      <p className="text-white/40 text-sm mt-1">נקודות</p>
    </Glass>
    <Glass accent="#f97316" className="w-full max-w-xs py-3 px-6">
      <p className="text-white/40 text-xs mb-1">המיקום בטבלת הפגיעות</p>
      <span className="text-3xl font-black text-white">מקום #{summaryData.myExactHitsRank}</span>
    </Glass>
  </div>
);

const Card5_CorrectOutcome = ({ summaryData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-5">
    <div className="relative">
      <div className="absolute inset-0 rounded-full" style={{ background: '#22c55e', filter: 'blur(40px)', opacity: 0.3 }} />
      <TrendingUp className="w-20 h-20 text-green-400 relative z-10" style={{ filter: 'drop-shadow(0 0 16px rgba(34,197,94,0.5))' }} />
    </div>
    <h2 className="text-xl font-bold text-white">נקודות מניחוש כיוון נכון</h2>
    <Glass accent="#22c55e" className="w-full max-w-xs py-5 px-8">
      <div className="text-7xl font-black">
        <GradText from="#22c55e" to="#86efac">{Number(summaryData.correctOutcomePoints).toFixed(0)}</GradText>
      </div>
      <p className="text-white/40 text-sm mt-1">נקודות</p>
    </Glass>
    <div className="flex gap-3 w-full max-w-xs">
      <Glass accent="#22c55e" className="flex-1 py-3">
        <p className="text-2xl font-black text-white">{summaryData.correctOutcomeCount}</p>
        <p className="text-white/40 text-xs">פגיעות</p>
      </Glass>
      <Glass accent="#22c55e" className="flex-1 py-3">
        <p className="text-2xl font-black text-white">
          {summaryData.totalPredictionsCount > 0
            ? (summaryData.correctOutcomeCount / summaryData.totalPredictionsCount * 100).toFixed(0)
            : 0}%
        </p>
        <p className="text-white/40 text-xs">דיוק</p>
      </Glass>
    </div>
  </div>
);

const Card6_PointsPerRound = ({ summaryData }) => (
  <div className="flex flex-col items-center h-full text-center px-4 pt-6 gap-4 w-full">
    <h2 className="text-xl font-bold text-white">נקודות לפי מחזור</h2>
    <Glass accent="#eab308" className="w-full max-w-md p-4 overflow-y-auto flex-1 min-h-0">
      <div className="space-y-2.5">
        {summaryData.pointsPerRound.map((round, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-16 text-right shrink-0 leading-tight">{round.name}</span>
            <div className="flex-1 rounded-full h-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(round.points / summaryData.maxPointsInRound) * 100}%` }}
                transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #eab308, #fde68a)' }}
              />
            </div>
            <span className="text-xs font-bold text-yellow-400 w-10 text-left shrink-0">
              {Number(round.points).toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </Glass>
  </div>
);

const Card6b_RankPerRound = ({ summaryData }) => (
  <div className="flex flex-col items-center h-full text-center px-4 pt-6 gap-4 w-full">
    <h2 className="text-xl font-bold text-white">מיקום לפי מחזור</h2>
    <Glass accent="#6366f1" className="w-full max-w-md p-3 overflow-y-auto flex-1 min-h-0">
      <div className="space-y-2">
        {summaryData.ranksPerRound.map((round, idx) => {
          const isTop3 = round.rank <= 3 && round.rank !== '-';
          return (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl"
              style={{
                background: isTop3 ? 'rgba(234,179,8,0.12)' : 'rgba(255,255,255,0.04)',
                border: isTop3 ? '1px solid rgba(234,179,8,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="text-white/60 text-sm">{round.name}</span>
              <span className={`text-lg font-black ${isTop3 ? 'text-yellow-400' : 'text-indigo-300'}`}>
                {round.rank !== '-' ? `#${round.rank}` : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </Glass>
  </div>
);

const Card7_BestMatch = ({ summaryData }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-5">
    <div className="relative">
      <div className="absolute inset-0 rounded-full" style={{ background: '#fb923c', filter: 'blur(40px)', opacity: 0.3 }} />
      <Medal className="w-20 h-20 text-orange-400 relative z-10" style={{ filter: 'drop-shadow(0 0 16px rgba(251,146,60,0.6))' }} />
    </div>
    <h2 className="text-xl font-bold text-white">המשחק הכי רווחי שלך</h2>
    {summaryData.highestPointsPrediction ? (
      <Glass accent="#fb923c" className="w-full max-w-xs p-5">
        <p className="text-white/50 text-sm mb-3">
          {summaryData.highestPointsPrediction.match.team_a}
          <span className="text-white/30 mx-2">vs</span>
          {summaryData.highestPointsPrediction.match.team_b}
        </p>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="pt-3">
          <div className="text-6xl font-black">
            <GradText from="#fb923c" to="#fde68a">{summaryData.highestPointsPrediction.points_earned}</GradText>
          </div>
          <p className="text-white/40 text-sm mt-1">נקודות</p>
        </div>
      </Glass>
    ) : (
      <p className="text-white/40">אין נתונים עדיין</p>
    )}
  </div>
);

const Card8_Breakdown = ({ summaryData }) => {
  const total = summaryData.totalPoints || 1;
  const rows = [
    { label: 'פגיעה בתוצאה', value: summaryData.pointsFromExactScore, color: '#ef4444' },
    { label: 'תוצאה נכונה', value: summaryData.correctOutcomePoints, color: '#22c55e' },
    { label: 'טווח שערים', value: summaryData.pointsFromGoalRange, color: '#a855f7' },
    { label: 'שתי קבוצות כובשות', value: summaryData.pointsFromBTTS, color: '#3b82f6' },
  ];
  const max = Math.max(...rows.map(r => Number(r.value)), 1);
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-5 w-full">
      <h2 className="text-2xl font-bold text-white">התפלגות נקודות</h2>
      <div className="space-y-3 w-full max-w-sm">
        {rows.map((row, i) => (
          <Glass key={i} accent={row.color} className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">{row.label}</span>
              <div className="text-right">
                <span className="font-black text-white text-lg">{Number(row.value).toFixed(0)}</span>
                <span className="text-white/30 text-xs ml-1">({(Number(row.value)/total*100).toFixed(0)}%)</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(Number(row.value)/max)*100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                style={{ background: row.color }}
              />
            </div>
          </Glass>
        ))}
      </div>
    </div>
  );
};

const OverallLeaderboardCard = ({ summaryData, leaderboardRefId, setLeaderboardRefId }) => {
  const refUser = leaderboardRefId
    ? summaryData.overallLeaderboard.find(u => u.user_id === leaderboardRefId)
    : summaryData.overallLeaderboard[0];
  const refPoints = refUser?.points || 0;

  return (
    <div className="flex flex-col items-center h-full text-center px-4 pt-6 gap-4 w-full">
      <Trophy className="w-12 h-12 text-blue-400" style={{ filter: 'drop-shadow(0 0 12px rgba(59,130,246,0.5))' }} />
      <div>
        <h2 className="text-xl font-bold text-white">הטבלה הכללית</h2>
        <p className="text-white/40 text-xs mt-0.5">לחץ על משתתף לבדיקת פער הנקודות</p>
      </div>
      <Glass accent="#3b82f6" className="w-full max-w-md overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="overflow-y-auto p-2 space-y-1.5 flex-1">
          {summaryData.overallLeaderboard.map((player, idx) => {
            const diff = refPoints - player.points;
            const isRef = player.user_id === refUser?.user_id;
            const gapColor = diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-white/30';
            return (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => setLeaderboardRefId(player.user_id)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: player.isMe ? 'rgba(59,130,246,0.18)' : isRef ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
                  border: player.isMe ? '1px solid rgba(59,130,246,0.5)' : isRef ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-base w-7 text-center">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : <span className="text-white/40 text-sm">#{player.rank}</span>}
                  </span>
                  <span className={`text-sm font-medium ${player.isMe ? 'text-blue-300' : 'text-white'}`}>
                    {player.name}{player.isMe && <span className="text-white/40 text-xs ml-1">(אני)</span>}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`font-black text-base ${idx < 3 ? 'text-yellow-400' : 'text-blue-300'}`}>{player.points}</span>
                  {!isRef && <span className={`text-[10px] font-bold ${gapColor}`}>{diff > 0 ? '+' : ''}{diff.toFixed(1)}</span>}
                  {isRef && <span className="text-[10px] text-white/30">נבחר</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Glass>
    </div>
  );
};

const Card9_Outro = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-8">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
    >
      <Star className="w-24 h-24 text-yellow-400 fill-yellow-400" style={{ filter: 'drop-shadow(0 0 24px rgba(245,197,24,0.7))' }} />
    </motion.div>
    <div>
      <h2 className="text-4xl font-black text-white mb-2">בהצלחה בהמשך!</h2>
      <p className="text-white/40 text-sm">World Cup 2026</p>
    </div>
    <button
      onClick={onClose}
      className="px-10 py-4 rounded-2xl font-bold text-black text-lg transition-transform hover:scale-105"
      style={{
        background: 'linear-gradient(90deg, #f5c518, #fde68a)',
        boxShadow: '0 4px 24px rgba(245,197,24,0.45)',
      }}
    >
      סיימתי
    </button>
  </div>
);

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export default function YearlySummaryPanel({ onClose, user }) {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [leaderboardRefId, setLeaderboardRefId] = useState(null);

  const paginate = (newDirection) => {
    const nextPage = page + newDirection;
    if (nextPage >= 0) {
      setPage(nextPage);
      setDirection(newDirection);
    }
  };

  useEffect(() => {
    const fetchAndCalculateSummary = async () => {
      setLoading(true);
      try {
        const allPredictionsFull = await Prediction.list();
        const myPredictions = allPredictionsFull.filter(p => p.user_id === user.id);
        const allMatches = await Match.list();
        const allUserStats = await UserStats.list();
        const allRounds = await Round.list('order');
        const allProfiles = await PublicProfile.list();

        const currentUserStats = allUserStats.find(s => s.user_id === user.id) || { total_points: 0, exact_hits_count: 0, total_predictions_count: 0 };
        const profileMap = new Map(allProfiles.map(p => [p.user_id, p]));
        const getUserName = uid => profileMap.get(uid)?.display_name || 'User';

        const sortedByPoints = [...allUserStats].sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
        const myOverallRank = sortedByPoints.findIndex(s => s.user_id === user.id) + 1;
        const sortedByExactHits = [...allUserStats].sort((a, b) => (b.exact_hits_count || 0) - (a.exact_hits_count || 0));
        const myExactHitsRank = sortedByExactHits.findIndex(s => s.user_id === user.id) + 1;

        const validUsers = list => list.filter(s => { const n = profileMap.get(s.user_id)?.display_name; return n && n !== 'User'; });
        const matchesMap = new Map(allMatches.map(m => [m.id, m]));

        let totalCorrectOutcome = 0, highestPointsPrediction = null;
        let pointsFromExactScore = 0, pointsFromGoalRange = 0, pointsFromBTTS = 0, pointsFromCorrectOutcome = 0;
        const teamPointsContributions = {};
        const predictionCounts = {}, predictionHitCounts = {};

        for (const prediction of myPredictions) {
          const match = matchesMap.get(prediction.match_id);
          if (!match) continue;

          pointsFromExactScore += prediction.exact_score_points_earned || 0;
          pointsFromGoalRange += prediction.goals_range_points_earned || 0;
          pointsFromBTTS += prediction.both_teams_scored_points_earned || 0;
          pointsFromCorrectOutcome += prediction.correct_outcome_points_earned || 0;

          if (prediction.correct_outcome_points_earned > 0) totalCorrectOutcome++;
          if (!highestPointsPrediction || prediction.points_earned > highestPointsPrediction.points_earned) {
            highestPointsPrediction = { ...prediction, match };
          }
          if (match.team_a && match.team_b && prediction.points_earned > 0) {
            teamPointsContributions[match.team_a] = (teamPointsContributions[match.team_a] || 0) + prediction.points_earned;
            teamPointsContributions[match.team_b] = (teamPointsContributions[match.team_b] || 0) + prediction.points_earned;
          }

          const scoreKey = `${prediction.predicted_score_a}-${prediction.predicted_score_b}`;
          predictionCounts[scoreKey] = (predictionCounts[scoreKey] || 0) + 1;
          if (prediction.exact_score_points_earned > 0) predictionHitCounts[scoreKey] = (predictionHitCounts[scoreKey] || 0) + 1;
        }

        const predictionFrequency = Object.entries(predictionCounts)
          .map(([score, count]) => ({ score, count, hitCount: predictionHitCounts[score] || 0, percentage: (count / myPredictions.length * 100).toFixed(1) }))
          .sort((a, b) => b.count - a.count);

        const finishedMatchIds = new Set(allMatches.filter(m => m.is_finished).map(m => m.id));
        const myFinishedPredictions = myPredictions.filter(p => finishedMatchIds.has(p.match_id));
        const averagePoints = myFinishedPredictions.length > 0 ? (currentUserStats.total_points / myFinishedPredictions.length).toFixed(2) : 0;
        const finishedRoundIds = new Set(myFinishedPredictions.map(p => matchesMap.get(p.match_id)?.round_id).filter(Boolean));
        const roundsParticipated = finishedRoundIds.size;
        const averagePointsPerRound = roundsParticipated > 0 ? (currentUserStats.total_points / roundsParticipated).toFixed(2) : 0;

        const hitsPerRoundMap = {}, pointsPerRoundMap = {};
        allRounds.forEach(r => {
          hitsPerRoundMap[r.id] = { name: r.name, count: 0, order: r.order, id: r.id };
          pointsPerRoundMap[r.id] = { name: r.name, points: 0, order: r.order, id: r.id };
        });
        for (const prediction of myPredictions) {
          const match = matchesMap.get(prediction.match_id);
          if (match) {
            if (prediction.exact_score_points_earned > 0 && hitsPerRoundMap[match.round_id]) hitsPerRoundMap[match.round_id].count++;
            if (prediction.points_earned > 0 && pointsPerRoundMap[match.round_id]) pointsPerRoundMap[match.round_id].points += prediction.points_earned;
          }
        }
        const hitsPerRound = Object.values(hitsPerRoundMap).sort((a, b) => a.order - b.order);
        const pointsPerRound = Object.values(pointsPerRoundMap).sort((a, b) => a.order - b.order);
        const maxPointsInRound = Math.max(...pointsPerRound.map(r => r.points), 5);

        const matchesByRound = {};
        allMatches.forEach(m => { if (!matchesByRound[m.round_id]) matchesByRound[m.round_id] = []; if (m.is_finished) matchesByRound[m.round_id].push(m); });
        const predictionsMap = {};
        allPredictionsFull.forEach(p => { if (!predictionsMap[p.match_id]) predictionsMap[p.match_id] = {}; predictionsMap[p.match_id][p.user_id] = p; });

        const ranksPerRound = allRounds.map(round => {
          const roundMatches = matchesByRound[round.id] || [];
          if (roundMatches.length === 0) return { name: round.name, rank: '-', order: round.order };
          const uniqueUserIds = new Set([...allProfiles.map(p => p.user_id), user.id]);
          const userPointsInRound = [];
          uniqueUserIds.forEach(userId => {
            let points = 0;
            roundMatches.forEach(match => { const pred = predictionsMap[match.id]?.[userId]; if (pred) points += pred.points_earned || 0; });
            userPointsInRound.push({ userId, points });
          });
          userPointsInRound.sort((a, b) => b.points - a.points);
          let myRank = '-', currentRank = 1;
          for (let i = 0; i < userPointsInRound.length; i++) {
            if (i > 0 && userPointsInRound[i].points < userPointsInRound[i - 1].points) currentRank = i + 1;
            if (userPointsInRound[i].userId === user.id) { myRank = currentRank; break; }
          }
          return { name: round.name, rank: myRank, order: round.order };
        }).sort((a, b) => a.order - b.order);

        const hitsLeaderboard = validUsers(sortedByExactHits).slice(0, 10).map((stats, index) => ({ rank: index + 1, name: getUserName(stats.user_id), count: stats.exact_hits_count, isMe: stats.user_id === user.id }));
        const overallLeaderboard = validUsers(sortedByPoints).slice(0, 10).map((stats, index) => ({ rank: index + 1, name: getUserName(stats.user_id), points: stats.total_points, isMe: stats.user_id === user.id, user_id: stats.user_id }));

        setSummaryData({
          hitsPerRound, hitsLeaderboard, overallLeaderboard, myOverallRank, myExactHitsRank,
          totalPoints: currentUserStats.total_points, exactHitsCount: currentUserStats.exact_hits_count,
          totalPredictionsCount: currentUserStats.total_predictions_count,
          exactHitsPoints: pointsFromExactScore, correctOutcomeCount: totalCorrectOutcome,
          correctOutcomePoints: pointsFromCorrectOutcome, highestPointsPrediction,
          pointsFromExactScore, pointsFromGoalRange, pointsFromBTTS,
          pointsPerRound, maxPointsInRound, ranksPerRound, predictionFrequency, averagePoints, averagePointsPerRound,
        });
      } catch (error) {
        console.error('Error fetching yearly summary:', error);
        setSummaryData(null);
      }
      setLoading(false);
    };
    if (user) fetchAndCalculateSummary();
  }, [user]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#060d1e', backdropFilter: 'blur(20px)' }}>
        <LoaderBar text="LOADING" />
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#060d1e' }}>
        <div className="text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
          <p className="text-white/50">שגיאה בטעינת הנתונים</p>
        </div>
      </div>
    );
  }

  const pages = [
    <Card1_Intro key="1" summaryData={summaryData} />,
    <Card2_TotalPoints key="2" summaryData={summaryData} />,
    <Card2b_AveragePoints key="2b" summaryData={summaryData} />,
    <Card3_ExactHits key="3" summaryData={summaryData} />,
    <Card_HitsLeaderboard key="hits-lb" summaryData={summaryData} />,
    <Card_HitsPerRound key="hits-round" summaryData={summaryData} />,
    <Card2c_PredictionFrequency key="2c" summaryData={summaryData} />,
    <Card4_ExactHitsPointsRank key="4" summaryData={summaryData} />,
    <Card5_CorrectOutcome key="5" summaryData={summaryData} />,
    <Card6_PointsPerRound key="6" summaryData={summaryData} />,
    <Card6b_RankPerRound key="6b" summaryData={summaryData} />,
    <Card7_BestMatch key="7" summaryData={summaryData} />,
    <Card8_Breakdown key="8" summaryData={summaryData} />,
    <OverallLeaderboardCard key="overall-lb" summaryData={summaryData} leaderboardRefId={leaderboardRefId} setLeaderboardRefId={setLeaderboardRefId} />,
    <Card9_Outro key="9" onClose={onClose} />,
  ];

  const accent = PAGE_ACCENT[page] || '#f5c518';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 text-white flex flex-col"
      style={{ background: '#060d1e' }}
    >
      {/* Aurora background */}
      <AnimatePresence mode="wait">
        <AuroraBackground key={page} accent={accent} />
      </AnimatePresence>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <X className="w-4 h-4 text-white/60" />
      </button>

      {/* Gold progress bar */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-40">
        {pages.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
            {idx <= page && (
              <motion.div
                className="h-full w-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #f5c518, #fde68a)' }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Page counter */}
      <div className="absolute top-4 left-4 z-50 text-white/30 text-xs font-medium">
        {page + 1} / {pages.length}
      </div>

      {/* Slide content */}
      <div className="flex-grow flex items-center justify-center relative overflow-hidden z-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 320, damping: 32 }, opacity: { duration: 0.15 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -8000 && page < pages.length - 1) paginate(1);
              else if (swipe > 8000 && page > 0) paginate(-1);
            }}
            className="absolute w-full h-full flex items-center justify-center px-4"
          >
            {pages[page]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="relative z-40 flex justify-between items-center px-6 pt-4 pb-10">
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-0"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
        >
          <ChevronRight className="w-4 h-4" />
          הקודם
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setDirection(idx > page ? 1 : -1); setPage(idx); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === page ? 20 : 6,
                height: 6,
                background: idx === page ? accent : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {page < pages.length - 1 ? (
          <button
            onClick={() => paginate(1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{ background: `${accent}22`, border: `1px solid ${accent}50`, color: accent }}
          >
            הבא
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-20" />
        )}
      </div>
    </motion.div>
  );
}
