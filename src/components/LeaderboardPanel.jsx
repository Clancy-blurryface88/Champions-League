import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicProfile } from "@/api/entities";
import { User } from "@/api/entities";
import { UserStats } from "@/api/entities";
import OdometerValue from "./OdometerValue";
import PlayerStatsModal from "./PlayerStatsModal";
import { ShineBorder } from "@/components/magicui/shine-border";

const LEADERBOARD_ICON_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a99a73381_image.png";
const GENERIC_USER_AVATAR_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/314b5002f_WhatsApp2025-07-07000346_91206de8.jpg";

export default function LeaderboardPanel({ onClose, user }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shockwaveActive, setShockwaveActive] = useState(false);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = await User.me();

      // CRITICAL CHANGE: Load data primarily from UserStats
      let userStats = [];
      try {
        userStats = await UserStats.list();
        console.log(`🔄 LeaderboardPanel: Loaded ${userStats.length} user stats records`);
      } catch (error) {
        console.log("Error loading UserStats:", error.message);
      }

      const userIdsWithStats = userStats.map((stat) => stat.user_id);
      let publicProfiles = [];
      try {
        if (userIdsWithStats.length > 0) {
          const allProfiles = await PublicProfile.list();
          publicProfiles = allProfiles.filter(p => userIdsWithStats.includes(p.user_id));
          console.log(`🔄 LeaderboardPanel: Loaded ${publicProfiles.length} profiles for users with stats`);
        }
      } catch (error) {
        console.log("Error loading profiles:", error.message);
      }

      // Create profile map
      const profileMap = {};
      publicProfiles.forEach((profile) => {
        profileMap[profile.user_id] = profile.display_name;
      });

      // Deduplicate UserStats by user_id — keep the record with highest total_points
      const uniqueUserStatsMap = {};
      userStats.forEach(stat => {
        const uid = stat.user_id;
        if (!uniqueUserStatsMap[uid] || (stat.total_points || 0) > (uniqueUserStatsMap[uid].total_points || 0)) {
          uniqueUserStatsMap[uid] = stat;
        }
      });
      const uniqueUserStats = Object.values(uniqueUserStatsMap);

      // NEW LOGIC: Build leaderboard directly from UserStats
      const leaderboardData = [];

      for (const userStat of uniqueUserStats) {
        const displayName = profileMap[userStat.user_id];

        // Only include users who have a proper display name (from PublicProfile)
        // and whose display name doesn't start with 'user_' (which indicates a placeholder)
        if (displayName && !displayName.startsWith('user_')) {
          const participantData = {
            id: userStat.user_id,
            email: userStat.user_id === currentUser.id ? currentUser.email : `user_${userStat.user_id.slice(0, 8)}@unknown.com`,
            full_name: displayName,
            total_points: userStat.total_points || 0,
            is_current_user: userStat.user_id === currentUser.id
          };

          console.log(`👤 LeaderboardPanel: Adding participant ${displayName} with ${participantData.total_points} points`);
          leaderboardData.push(participantData);
        }
      }

      // Sort by total points and add positions
      const sortedData = leaderboardData.
      sort((a, b) => b.total_points - a.total_points) // Changed sort order to descending
      .map((userData, index) => ({
        ...userData,
        position: index + 1
      }));

      console.log(`🏆 LeaderboardPanel: Final leaderboard has ${sortedData.length} participants:`, sortedData.map((p) => `${p.full_name}: ${p.total_points} pts`));
      setParticipants(sortedData);

    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setError("שגיאה בטעינת לוח התוצאות");

      // Fallback to show current user if available
      if (user) {
        setParticipants([{
          id: user.id,
          email: user.email,
          full_name: user.display_name || user.full_name || user.email?.split('@')[0] || 'משתמש',
          total_points: user.total_points || 0,
          is_current_user: true,
          position: 1
        }]);
      } else {
        setParticipants([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  // הפעל cascade glow אחרי שמקום 1 נחשף + ScoreCounter מסיים
  useEffect(() => {
    if (participants.length === 0) return;
    const total = participants.length;
    const rank1AnimDelay = Math.pow(total - 1, 1.6) * 0.38 + 0.6;
    const glowAt = rank1AnimDelay + 1.5 + 0.25 + 0.4;
    const timer = setTimeout(() => setShockwaveActive(true), glowAt * 1000);
    return () => clearTimeout(timer);
  }, [participants]);

  const getRankColor = (position) => {
    if (position === 1) return '#7cadee';
    if (position === 2) return '#C0C0C0';
    if (position === 3) return '#CD7F32';
    return 'rgba(255,255,255,0.5)';
  };

  const getRankBorder = (position, isCurrentUser) => {
    if (position === 1) return '#7cadee';
    if (position === 2) return '#D1D5DB';
    if (position === 3) return '#D97706';
    return isCurrentUser ? '#60A5FA' : '#475569';
  };

  const getRankBg = (position) => {
    if (position === 1) return 'linear-gradient(135deg,rgba(124, 173, 238,0.22),rgba(9, 122, 220,0.22))';
    if (position === 2) return 'linear-gradient(135deg,rgba(209,213,219,0.18),rgba(156,163,175,0.18))';
    if (position === 3) return 'linear-gradient(135deg,rgba(9, 122, 220,0.20),rgba(217,119,6,0.20))';
    return 'rgba(30,41,59,0.60)';
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 z-[45]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }} />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 w-64 z-50"
        style={{ background: 'rgba(5,10,20,0.35)', backdropFilter: 'blur(28px) saturate(1.6)', WebkitBackdropFilter: 'blur(28px) saturate(1.6)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>

        <div className="h-full flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-yellow-400">Leaderboard</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-white/10 bg-transparent transition-all duration-200">

                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {error &&
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            }
            
            {loading ?
            <div className="space-y-2">
                {Array(5).fill(0).map((_, i) =>
              <div key={i} className="h-10 bg-slate-800/50 rounded-xl animate-pulse" />
              )}
              </div> :
            participants.length === 0 ?
            <div className="text-center py-8">
                <p className="text-slate-400 text-lg">אין משתתפים עדיין</p>
              </div> :

            <div className="space-y-1.5">
                {(() => {
                const totalParticipants = participants.length;
                return participants.map((participant, index) => {
                  const position = participant.position;
                  const isCurrentUser = participant.is_current_user;

                  // עיכוב אקספוננציאלי — מקום אחרון מגיע מהר, מקום ראשון מגיע עם דרמה
                  const rank = totalParticipants - 1 - index;
                  const cardAnimationDelay = Math.pow(rank, 1.6) * 0.22 + (position === 1 ? 0.3 : 0);
                  const scoreAnimationDelay = cardAnimationDelay + 0.25;
                  const shockDelay = index * 0.28;

                  return (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: cardAnimationDelay,
                        duration: 0.6,
                        ease: "easeOut"
                      }}>

                        <div className="relative">
                          {/* Cascade glow על כל הקלפים */}
                          {shockwaveActive && (
                            <motion.div
                              key={`glow-${participant.id}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.2, 0] }}
                              transition={{ duration: 0.60, delay: shockDelay, ease: 'easeOut' }}
                              className="absolute inset-0 rounded-2xl pointer-events-none"
                              style={{ background: 'rgba(124, 173, 238,0.22)', zIndex: 5 }}
                            />
                          )}

                        {/* Parallelogram card */}
                        <div
                          onClick={() => handlePlayerClick(participant)}
                          style={{
                            transform: 'skewX(-6deg)',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: 8,
                            border: `2px solid ${getRankBorder(position, isCurrentUser)}`,
                            background: getRankBg(position),
                            cursor: 'pointer',
                            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'skewX(-6deg) scale(1.04)'; e.currentTarget.style.boxShadow = `0 0 18px ${getRankColor(position)}44`; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'skewX(-6deg)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          <ShineBorder
                            borderRadius={8}
                            borderWidth={1}
                            duration={position === 1 ? 6 : position === 2 ? 7 : position === 3 ? 8 : 12}
                            shineColor={
                              position === 1 ? ['#7cadee','#fff','#097adc'] :
                              position === 2 ? ['#C0C0C0','#fff','#94a3b8'] :
                              position === 3 ? ['#CD7F32','#fff','#D97706'] :
                              ['#475569','#64748b','#475569']
                            }
                          />
                          {/* Ghost rank number */}
                          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%) skewX(6deg)', fontSize:38, fontWeight:900, color:getRankColor(position), opacity:0.18, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
                            {position}
                          </span>

                          {/* Content — counter-skewed */}
                          <div style={{ transform:'skewX(6deg)', padding:'5px 13px', textAlign:'center' }}>
                            <p className="truncate" style={{
                              color:'#e2e8f0', fontSize:13, fontWeight:600, marginBottom:1,
                              animation: `lb-blur-focus 1.2s ease-out both`,
                              animationDelay: `${cardAnimationDelay}s`,
                            }}>
                              {participant.full_name}
                            </p>
                            <span style={{ color:'#4ade80', fontSize:12, fontWeight:700 }}>
                              <OdometerValue
                                target={participant.total_points}
                                height={15}
                                width={7.5} />
                              {' '}Pts
                            </span>
                          </div>
                        </div>
                        </div>
                      </motion.div>);

                });
              })()}
              </div>
            }
          </div>
        </div>

        <style>{`
          @keyframes lb-blur-focus {
            from { filter: blur(10px); opacity: 0.2; }
            to   { filter: blur(0px);  opacity: 1;   }
          }
        `}</style>
        <PlayerStatsModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          selectedPlayer={selectedPlayer} 
          allParticipants={participants} 
        />

      </motion.div>
    </>);

}