import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { User, UserStats, PublicProfile } from "@/api/entities";
import ScoreCounter from "@/components/ScoreCounter";
import LottieAnimation from "@/components/ui/LottieAnimation";

const CONFETTI_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68656264510003eeef16bac3/c1df36a33_Blueconfetti.json";

async function loadFinalLeaderboard(currentUserId) {
  const [userStats, allProfiles] = await Promise.all([
    UserStats.list().catch(() => []),
    PublicProfile.list().catch(() => []),
  ]);

  const profileMap = {};
  allProfiles.forEach((p) => { profileMap[p.user_id] = p.display_name; });

  // Deduplicate by user_id — keep the record with the highest total_points
  const uniqueMap = {};
  userStats.forEach((stat) => {
    const uid = stat.user_id;
    if (!uniqueMap[uid] || (stat.total_points || 0) > (uniqueMap[uid].total_points || 0)) {
      uniqueMap[uid] = stat;
    }
  });

  return Object.values(uniqueMap)
    .map((stat) => ({
      userId: stat.user_id,
      displayName: profileMap[stat.user_id],
      totalPoints: stat.total_points || 0,
    }))
    .filter((e) => e.displayName && !e.displayName.startsWith("user_"))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((e, i) => ({ ...e, rank: i + 1, isCurrentUser: e.userId === currentUserId }));
}

function PodiumStand({ entry, position, baseDelay }) {
  const rankColor = position === 1 ? "#FFD700" : position === 2 ? "#C0C0C0" : "#CD7F32";
  const rankBg = position === 1 ? "rgba(250,204,21,0.12)" : position === 2 ? "rgba(209,213,219,0.09)" : "rgba(217,119,6,0.12)";
  const rankBorder = position === 1 ? "rgba(250,204,21,0.35)" : position === 2 ? "rgba(209,213,219,0.25)" : "rgba(217,119,6,0.3)";
  const rankGlow = position === 1 ? "rgba(250,204,21,0.4)" : position === 2 ? "rgba(209,213,219,0.2)" : "rgba(217,119,6,0.32)";
  const heights = { 1: 76, 2: 52, 3: 38 };

  if (!entry) return <div className="flex-1" />;

  const podiumDelay = baseDelay + (position === 1 ? 0.55 : position === 2 ? 0.25 : 0.05);

  return (
    <motion.div
      className="flex-1 flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: podiumDelay, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
    >
      {position === 1 && <span className="text-2xl -mb-1">👑</span>}
      <span
        className="font-semibold text-center truncate"
        style={{ color: rankColor, fontSize: 13, maxWidth: 84, lineHeight: 1.3 }}
      >
        {entry.displayName}
      </span>
      <span className="font-bold" style={{ color: rankColor, opacity: 0.85, fontSize: 13 }}>
        <ScoreCounter value={entry.totalPoints} duration={1.4} delay={podiumDelay + 0.2} showDecimals />
      </span>
      <div
        className="w-full relative overflow-hidden"
        style={{
          height: heights[position],
          background: rankBg,
          borderTop: `3px solid ${rankColor}`,
          borderLeft: `1px solid ${rankBorder}`,
          borderRight: `1px solid ${rankBorder}`,
          borderRadius: "6px 6px 0 0",
          boxShadow: `0 -6px 20px ${rankGlow}, inset 0 2px 8px rgba(255,255,255,0.05)`,
          ...(entry.isCurrentUser ? { outline: "2px solid rgba(96,165,250,0.5)", outlineOffset: 2 } : {}),
        }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center font-black select-none"
          style={{ fontSize: 40, color: rankColor, opacity: 0.18, lineHeight: 1 }}
        >
          {position}
        </span>
      </div>
    </motion.div>
  );
}

export default function FinalResultsOverlay({ onClose }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const currentUser = await User.me();
        const data = await loadFinalLeaderboard(currentUser.id);
        if (!cancelled) setParticipants(data);
      } catch {
        if (!cancelled) setParticipants([]);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const top3 = [1, 2, 3].map((r) => participants.find((e) => e.rank === r));
  const rest = participants.filter((e) => e.rank > 3);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[57] bg-black/75"
        style={{ backdropFilter: "blur(6px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="fixed inset-0 z-[58] pointer-events-none">
        <LottieAnimation src={CONFETTI_URL} loop={false} autoplay className="w-full h-full object-cover opacity-90" />
      </div>

      <div className="fixed inset-0 z-[59] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          className="relative w-full max-w-md rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(8,18,32,0.97)",
            border: "1px solid rgba(245,197,24,0.4)",
            backdropFilter: "blur(28px)",
            boxShadow: "0 0 60px rgba(245,197,24,0.15), 0 20px 60px rgba(0,0,0,0.7)",
            maxHeight: "85vh",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="overflow-y-auto px-6 pt-8 pb-6">
            <div className="text-center mb-1">
              <span className="text-3xl">🏆</span>
            </div>
            <h2 className="text-center text-2xl font-black text-amber-400 mb-1">הטורניר הסתיים!</h2>
            <p className="text-center text-slate-400 text-sm mb-5">התוצאות הסופיות</p>

            {loading ? (
              <div className="space-y-2 py-6">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : participants.length === 0 ? (
              <p className="text-center text-slate-400 py-8">אין נתונים זמינים</p>
            ) : (
              <>
                <div className="flex items-end justify-center gap-2 px-2 pb-1">
                  <PodiumStand entry={top3[1]} position={2} baseDelay={0.2} />
                  <PodiumStand entry={top3[0]} position={1} baseDelay={0.2} />
                  <PodiumStand entry={top3[2]} position={3} baseDelay={0.2} />
                </div>
                <div className="h-2 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full mx-4 mb-4" />

                {rest.length > 0 && (
                  <div className="space-y-1.5">
                    {rest.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center justify-between text-sm px-3 py-2 rounded-xl ${
                          entry.isCurrentUser
                            ? "bg-blue-600/20 border border-blue-400/30"
                            : "bg-slate-700/40 border border-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white/70">
                            {entry.rank}
                          </span>
                          <span className="text-white font-medium">{entry.displayName}</span>
                        </div>
                        <span className="text-green-400 font-bold tabular-nums">{entry.totalPoints.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
