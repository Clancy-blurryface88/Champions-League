import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicProfile } from "@/api/entities";
import { User } from "@/api/entities";
import { UserStats } from "@/api/entities";
import ScoreCounter from "./ScoreCounter";
import PlayerStatsModal from "./PlayerStatsModal";

const LEADERBOARD_ICON_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a99a73381_image.png";
const FIRST_PLACE_MEDAL_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3525e4c19_pngwingcom.png";
const SECOND_PLACE_MEDAL_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/1945c1a34_pngwingcom1.png";
const THIRD_PLACE_MEDAL_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b290e6e06_pngwingcom2.png";
const GENERIC_USER_AVATAR_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/314b5002f_WhatsApp2025-07-07000346_91206de8.jpg";

export default function LeaderboardPanel({ onClose, user }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:return <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/cda304519_gold-medal_7645285.png" alt="1st" className="w-10 h-10 object-contain" />;
      case 2:return <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2cdb3f3ad_silver-medal_7645682.png" alt="2nd" className="w-8 h-8 object-contain" />;
      case 3:return <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/5c6258044_bronze-medal_7645706.png" alt="3rd" className="w-8 h-8 object-contain" />;
      default:return <span className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold text-lg">{position}</span>;
    }
  };

  const getBorderColor = (position, isCurrentUser) => {
    if (position === 1) return "border-yellow-400";
    if (position === 2) return "border-gray-300";
    if (position === 3) return "border-amber-600";
    return isCurrentUser ? "border-blue-400" : "border-slate-600";
  };

  const getBackgroundColor = (position) => {
    if (position === 1) return "bg-gradient-to-br from-yellow-400/20 to-amber-500/20";
    if (position === 2) return "bg-gradient-to-br from-gray-300/20 to-gray-400/20";
    if (position === 3) return "bg-gradient-to-br from-amber-500/20 to-amber-600/20";
    return "bg-slate-800/60";
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
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-yellow-400">Leaderboard</h2>
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

          <div className="flex-1 overflow-y-auto p-4">
            {error &&
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            }
            
            {loading ?
            <div className="space-y-3">
                {Array(5).fill(0).map((_, i) =>
              <div key={i} className="h-16 bg-slate-800/50 rounded-2xl animate-pulse" />
              )}
              </div> :
            participants.length === 0 ?
            <div className="text-center py-8">
                <p className="text-slate-400 text-lg">אין משתתפים עדיין</p>
              </div> :

            <div className="space-y-3">
                {(() => {
                const totalParticipants = participants.length;
                return participants.map((participant, index) => {
                  const position = participant.position;
                  const isCurrentUser = participant.is_current_user;

                  // עיכוב אקספוננציאלי — מקום אחרון מגיע מהר, מקום ראשון מגיע עם דרמה
                  const rank = totalParticipants - 1 - index;
                  const cardAnimationDelay = Math.pow(rank, 1.6) * 0.38 + (position === 1 ? 0.6 : 0);
                  const scoreAnimationDelay = cardAnimationDelay + 0.25;
                  const isWinner = position === 1;

                  return (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, y: isWinner ? 40 : 20, scale: isWinner ? 0.88 : 1 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: cardAnimationDelay,
                        duration: isWinner ? 0.9 : 0.6,
                        ease: isWinner ? [0.34, 1.56, 0.64, 1] : "easeOut"
                      }}>

<Card
                          onClick={() => handlePlayerClick(participant)}
                          className={`
                          ${getBackgroundColor(position)}
                          border-2 ${getBorderColor(position, isCurrentUser)}
                          hover:scale-105 transition-all duration-200 cursor-pointer
                          ${isWinner ? 'relative overflow-hidden' : ''}
                        `}>
                          {isWinner && (
                            <motion.div
                              className="absolute inset-0 rounded-lg"
                              animate={{ boxShadow: ['0 0 0px rgba(245,197,24,0)', '0 0 30px rgba(245,197,24,0.5)', '0 0 0px rgba(245,197,24,0)'] }}
                              transition={{ delay: cardAnimationDelay + 0.7, duration: 1.2, repeat: 2 }}
                            />
                          )}
                          <CardContent className="bg-white/[0.04] px-4 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 flex-shrink-0 flex items-center justify-center">
                                {getPositionIcon(position)}
                              </div>
                              
                              <div className="flex-1 min-w-0 text-center">
                                <div className="mb-1">
                                  <p className="text-slate-200 text-base font-semibold truncate">
                                    {participant.full_name}
                                  </p>
                                </div>
                                <div className="flex items-center justify-center gap-1 text-green-400">
                                  <span className="text-sm font-bold">
                                    <ScoreCounter 
                                    value={participant.total_points}
                                    duration={1.5}
                                    delay={scoreAnimationDelay}
                                    showDecimals={true} />
                                    {' '}Pts 
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>);

                });
              })()}
              </div>
            }
          </div>
        </div>

        {/* הוספת סטיילים לאפקט Shiny עם צבע זהב */}
        <PlayerStatsModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          selectedPlayer={selectedPlayer} 
          allParticipants={participants} 
        />

      </motion.div>
    </>);

}