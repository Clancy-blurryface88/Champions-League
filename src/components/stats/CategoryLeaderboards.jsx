import React, { useState, useEffect } from "react";
import { Prediction } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderBar } from "../ui/LoaderBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function CategoryLeaderboards() {
  const [loading, setLoading] = useState(true);
  const [leaderboards, setLeaderboards] = useState({
    correctOutcome: [],
    btts: [],
    goalsRange: [],
    exactScore: []
  });
  const [activeCategory, setActiveCategory] = useState("correctOutcome");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [userRanks, setUserRanks] = useState({
    correctOutcome: null,
    btts: null,
    goalsRange: null,
    exactScore: null
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [predictions, profiles, me] = await Promise.all([
          Prediction.list(),
          PublicProfile.list(),
          User.me().catch(() => null)
        ]);
        
        setCurrentUser(me);

        const profileMap = {};
        profiles.forEach(p => {
          profileMap[p.user_id] = p.display_name;
        });

        const userPoints = {};

        // Deduplicate predictions per user per match (keep latest)
        const uniquePredictionsMap = {};
        predictions.forEach(p => {
          const key = `${p.user_id}_${p.match_id}`;
          if (!uniquePredictionsMap[key] || new Date(p.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
            uniquePredictionsMap[key] = p;
          }
        });
        
        const uniquePredictions = Object.values(uniquePredictionsMap);

        uniquePredictions.forEach(p => {
          if (!userPoints[p.user_id]) {
            userPoints[p.user_id] = {
              correctOutcome: 0,
              btts: 0,
              goalsRange: 0,
              exactScore: 0
            };
          }
          userPoints[p.user_id].correctOutcome += (p.correct_outcome_points_earned || 0);
          userPoints[p.user_id].btts += (p.both_teams_scored_points_earned || 0);
          userPoints[p.user_id].goalsRange += (p.goals_range_points_earned || 0);
          userPoints[p.user_id].exactScore += (p.exact_score_points_earned || 0);
        });

        const formatLeaderboard = (category) => {
          return Object.entries(userPoints)
            .map(([userId, points]) => ({
              userId,
              name: profileMap[userId] || 'משתמש לא ידוע',
              points: points[category]
            }))
            .filter(u => u.points > 0 && !u.name.startsWith('user_'))
            .sort((a, b) => b.points - a.points);
        };

        const formattedLeaderboards = {
          correctOutcome: formatLeaderboard('correctOutcome'),
          btts: formatLeaderboard('btts'),
          goalsRange: formatLeaderboard('goalsRange'),
          exactScore: formatLeaderboard('exactScore')
        };

        setLeaderboards(formattedLeaderboards);

        const usersList = Object.entries(profileMap)
          .map(([userId, name]) => ({ userId, name }))
          .filter(u => !u.name.startsWith('user_'))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setAllUsers(usersList);

        if (me) {
          setSelectedUser(me.id);
          setUserRanks({
            correctOutcome: formattedLeaderboards.correctOutcome.findIndex(u => u.userId === me.id) + 1 || null,
            btts: formattedLeaderboards.btts.findIndex(u => u.userId === me.id) + 1 || null,
            goalsRange: formattedLeaderboards.goalsRange.findIndex(u => u.userId === me.id) + 1 || null,
            exactScore: formattedLeaderboards.exactScore.findIndex(u => u.userId === me.id) + 1 || null
          });
        }

      } catch (error) {
        console.error("Error fetching category leaderboards:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const categories = [
    { id: "correctOutcome", label: "כיוון בלבד" },
    { id: "btts", label: "שתי קבוצות כובשות" },
    { id: "goalsRange", label: "טווח שערים" },
    { id: "exactScore", label: "תוצאה מדויקת" }
  ];

  if (loading) {
    return <div className="py-12"><LoaderBar text="טוען טבלאות..." /></div>;
  }

  const currentLeaderboard = leaderboards[activeCategory] || [];

  const handleUserChange = (userId) => {
    setSelectedUser(userId);
    setUserRanks({
      correctOutcome: leaderboards.correctOutcome.findIndex(u => u.userId === userId) + 1 || null,
      btts: leaderboards.btts.findIndex(u => u.userId === userId) + 1 || null,
      goalsRange: leaderboards.goalsRange.findIndex(u => u.userId === userId) + 1 || null,
      exactScore: leaderboards.exactScore.findIndex(u => u.userId === userId) + 1 || null
    });
  };

  const getRankColor = (rank) => {
    if (!rank) return "text-white";
    if (rank === 1) return "text-yellow-400"; // Gold
    if (rank === 2) return "text-gray-300";   // Silver
    if (rank === 3) return "text-sky-600";  // Bronze
    return "text-green-300";                  // Others (Light Green)
  };

  return (
    <Card style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)' }}>
      <CardHeader className="text-center">
        <CardTitle className="text-white text-xl">טבלאות לפי קטגוריות ניקוד</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-[250px] bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="בחר קטגוריה" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id} className="focus:bg-slate-700 focus:text-white cursor-pointer">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700/50">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 bg-slate-800/50 text-slate-300 text-sm font-medium border-b border-slate-700/50">
            <div className="w-8 text-center">#</div>
            <div>שם משתמש</div>
            <div className="text-left w-16">נקודות</div>
          </div>
          
          <div className="max-h-[500px] overflow-y-auto">
            {currentLeaderboard.length > 0 ? (
              currentLeaderboard.map((user, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={user.userId}
                  className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 items-center border-b border-slate-700/30 last:border-0 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="w-8 text-center font-bold text-slate-400">
                    {index + 1}
                  </div>
                  <div className="font-medium text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-left w-16 font-bold text-emerald-400">
                    {Number(user.points).toFixed(2)}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                אין נתונים לקטגוריה זו
              </div>
            )}
          </div>
        </div>

        {currentUser && (
          <div className="mt-8">
            <h3 className="text-white font-semibold mb-4 text-center">מיקום לפי קטגוריה</h3>
            
            <div className="flex justify-center mb-6">
              <Select value={selectedUser} onValueChange={handleUserChange}>
                <SelectTrigger className="w-[200px] bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="בחר משתמש" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[300px]">
                  {allUsers.map(user => (
                    <SelectItem key={user.userId} value={user.userId} className="focus:bg-slate-700 focus:text-white cursor-pointer">
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(cat => (
                <div key={`rank-${cat.id}`} className="bg-slate-700/30 rounded-lg p-3 sm:p-4 text-center border border-slate-600/30 flex flex-col justify-between h-full">
                  <div className="flex-grow flex items-center justify-center mb-2">
                    <p className="text-slate-400 text-[11px] sm:text-sm whitespace-nowrap tracking-tight">{cat.label}</p>
                  </div>
                  <div className={`text-2xl font-bold ${getRankColor(userRanks[cat.id])}`}>
                    {userRanks[cat.id] ? `#${userRanks[cat.id]}` : '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}