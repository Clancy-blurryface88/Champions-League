import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { UserStats } from "@/api/entities";
import { SlidingNumber } from "./animate-ui/text/sliding-number";
import UserExactHitsModal from "./stats/UserExactHitsModal";

const EXACT_HITS_ICON_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7ec75a888_target_5987470.png";
const GENERIC_USER_AVATAR_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/314b5002f_WhatsApp2025-07-07000346_91206de8.jpg";

export default function ExactHitsPanel({ onClose, user }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserExactHitsCount, setSelectedUserExactHitsCount] = useState(0);
  const [selectedUserTotalPredictions, setSelectedUserTotalPredictions] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadExactHitsLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = await User.me();

      // CRITICAL CHANGE: Load UserStats as primary source
      const allUserStats = await UserStats.list();
      const usersWithExactHits = allUserStats.filter((stats) => (stats.exact_hits_count || 0) > 0);

      console.log(`ExactHitsPanel: Found ${usersWithExactHits.length} users with exact hits from UserStats`);

      // Load PublicProfiles for users with exact hits
      const userIdsWithHits = usersWithExactHits.map((stats) => stats.user_id);
      let publicProfiles = [];

      if (userIdsWithHits.length > 0) {
        try {
          const allProfiles = await PublicProfile.list();
          publicProfiles = allProfiles.filter(p => userIdsWithHits.includes(p.user_id));
        } catch (error) {
          console.log("Error loading profiles:", error.message);
        }
      }

      // Create profile map
      const profileMap = {};
      publicProfiles.forEach((profile) => {
        profileMap[profile.user_id] = profile.display_name;
      });

      // Deduplicate UserStats by user_id — keep the record with highest exact_hits_count
      const uniqueExactHitsMap = {};
      usersWithExactHits.forEach(stat => {
        const uid = stat.user_id;
        if (!uniqueExactHitsMap[uid] || (stat.exact_hits_count || 0) > (uniqueExactHitsMap[uid].exact_hits_count || 0)) {
          uniqueExactHitsMap[uid] = stat;
        }
      });
      const uniqueUsersWithExactHits = Object.values(uniqueExactHitsMap);

      // NEW LOGIC: Build leaderboard directly from UserStats
      const leaderboardData = [];

      for (const userStats of uniqueUsersWithExactHits) {
        const displayName = profileMap[userStats.user_id];

        // Only include users who have a proper display name (from PublicProfile)
        if (displayName && !displayName.startsWith('user_')) {
          leaderboardData.push({
            id: userStats.user_id,
            email: userStats.user_id === currentUser.id ? currentUser.email : `user_${userStats.user_id.slice(0, 8)}@unknown.com`,
            full_name: displayName,
            exact_hits_count: userStats.exact_hits_count || 0,
            total_predictions_count: userStats.total_predictions_count || 0,
            is_current_user: userStats.user_id === currentUser.id
          });
        }
      }

      // Sort by exact hits count and add positions
      const sortedData = leaderboardData.
      sort((a, b) => b.exact_hits_count - a.exact_hits_count).
      map((userData, index) => ({
        ...userData,
        position: index + 1
      }));

      console.log(`ExactHitsPanel: Final leaderboard has ${sortedData.length} participants with exact hits`);
      setParticipants(sortedData);

    } catch (error) {
      console.error("Error loading exact hits leaderboard:", error);
      setError("שגיאה בטעינת טבלת הפגיעות");
      setParticipants([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExactHitsLeaderboard();
  }, []);

  const getPositionIcon = (position) => {
    switch (position) {
      case 1: return <span className="text-3xl leading-none">🥇</span>;
      case 2: return <span className="text-2xl leading-none">🥈</span>;
      case 3: return <span className="text-2xl leading-none">🥉</span>;
      default: return <span className="w-10 h-10 flex items-center justify-center text-slate-400 font-bold text-xl">{position}</span>;
    }
  };

  const getBorderColor = (position, isCurrentUser) => {
    if (position === 1) return "border-yellow-400";
    if (position === 2) return "border-gray-300";
    if (position === 3) return "border-amber-600";
    return isCurrentUser ? "border-blue-400" : "border-slate-600";
  };

  const getBackgroundColor = (position) => {
    if (position === 1) return "bg-gradient-to-br from-orange-400/20 to-red-500/20";
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
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 w-64 z-50"
        style={{ background: 'rgba(5,10,20,0.35)', backdropFilter: 'blur(28px) saturate(1.6)', WebkitBackdropFilter: 'blur(28px) saturate(1.6)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>

        <div className="h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between">
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-3">
                  <img src={EXACT_HITS_ICON_URL} alt="Exact Hits" className="w-8 h-8 object-contain" />
                  <h2 className="text-xl font-bold text-white">Exact Hits</h2>
                </div>
                <div className="text-sm text-slate-300 mt-2 font-small whitespace-nowrap" dir="rtl">לחץ על משתתף לפרטים נוספים</div>
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
            <div className="text-center py-12">
                <img src={EXACT_HITS_ICON_URL} alt="Target" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400 text-lg">אין פגיעות מדויקות עדיין</p>
                <p className="text-slate-500 text-sm mt-2">
                  המשתתפים יופיעו כאן אחרי שיפגעו בתוצאה מדויקת
                </p>
              </div> :

            <div className="space-y-3">
                {participants.map((participant, index) => {
                const position = participant.position;
                const isCurrentUser = participant.is_current_user;

                return (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 }}>
                    
                      <Card 
                        onClick={() => {
                          setSelectedUserId(participant.id);
                          setSelectedUserName(participant.full_name);
                          setSelectedUserExactHitsCount(participant.exact_hits_count);
                          setSelectedUserTotalPredictions(participant.total_predictions_count);
                          setIsModalOpen(true);
                        }}
                        className={`
                        ${getBackgroundColor(position)} 
                        border-2 ${getBorderColor(position, isCurrentUser)}
                        hover:scale-105 transition-all duration-200 cursor-pointer
                      `}>
                        <CardContent className="bg-white/[0.04] px-4 py-2">
                          <div className="flex items-center gap-4">
                            <div className="w-10 flex-shrink-0 flex items-center justify-center">
                              {getPositionIcon(position)}
                            </div>
                            
                            <div className="flex-1 min-w-0 text-center">
                              <div className="mb-1">
                                <p className="text-slate-200 text-lg font-semibold truncate">
                                  {participant.full_name}
                                </p>
                              </div>
                              <div className="text-green-500 flex items-center justify-center gap-1">
                                <span className="text-base font-bold">
                                  <SlidingNumber 
                                    number={participant.exact_hits_count}
                                    className="text-base font-bold"
                                    duration={0.6}
                                    delay={index * 0.1}
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>);

              })}
              </div>
            }
          </div>
        </div>
      </motion.div>
      
      <UserExactHitsModal 
        userId={selectedUserId}
        userName={selectedUserName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        exactHitsCount={selectedUserExactHitsCount}
        totalPredictions={selectedUserTotalPredictions}
      />
    </>);

}