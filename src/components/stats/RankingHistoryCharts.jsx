import React, { useState, useEffect, useMemo } from "react";
import { User } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { Round } from "@/api/entities";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderBar } from "@/components/ui/LoaderBar";
import { FlexibleIcon } from "@/components/ui/FlexibleIcon";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from
'recharts';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Filter, BarChart2, TrendingUp, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";

export default function RankingHistoryCharts() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [chartType, setChartType] = useState('line'); // 'line' or 'bump'
  const [focusedUser, setFocusedUser] = useState(null); // New state for highlighting a specific user

  // Define colors for lines
  const colors = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#d946ef", "#f97316"];


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch current user
        const user = await User.me().catch(() => null);
        setCurrentUser(user);

        // Fetch data in parallel
        const [roundsData, profilesData, matchesData, predictionsData] = await Promise.all([
        Round.list('order'),
        PublicProfile.list(),
        Match.list(),
        Prediction.list()]
        );

        // Sort rounds
        const sortedRounds = roundsData.sort((a, b) => a.order - b.order);

        // Map profiles
        const uniqueProfilesMap = new Map();
        profilesData.forEach((profile) => {
          if (!uniqueProfilesMap.has(profile.user_id)) {
            uniqueProfilesMap.set(profile.user_id, profile);
          }
        });

        const users = Array.from(uniqueProfilesMap.values()).sort((a, b) =>
        (a.display_name || "").localeCompare(b.display_name || "")
        );
        setAllUsers(users);

        // Set initial visible users (Current User + Top 4 by alphabetical or random for now)
        // Better logic: Show current user and first 4 others
        const initialVisible = new Set();
        if (user) initialVisible.add(user.id);
        users.slice(0, 5).forEach((u) => initialVisible.add(u.user_id));
        setVisibleUsers(Array.from(initialVisible));

        // Process Data for Chart
        // ranks[roundName] = { userId: rank, ... }

        const matchesByRound = {};
        matchesData.forEach((m) => {
          if (!matchesByRound[m.round_id]) matchesByRound[m.round_id] = [];
          if (m.is_finished) matchesByRound[m.round_id].push(m);
        });

        const predictionsMap = {};
        predictionsData.forEach((p) => {
          if (!predictionsMap[p.match_id]) predictionsMap[p.match_id] = {};
          const existing = predictionsMap[p.match_id][p.user_id];
          if (!existing || new Date(p.created_date) > new Date(existing.created_date)) {
            predictionsMap[p.match_id][p.user_id] = p;
          }
        });

        const processedData = [];

        // Map to store cumulative points for each user
        const userCumulativePoints = {};
        users.forEach((u) => userCumulativePoints[u.user_id] = 0);

        sortedRounds.forEach((round) => {
          const roundMatches = matchesByRound[round.id] || [];

          if (roundMatches.length === 0) return;

          const userPointsInRound = [];

          users.forEach((userProfile) => {
            let roundPoints = 0;
            roundMatches.forEach((match) => {
              const pred = predictionsMap[match.id]?.[userProfile.user_id];
              if (pred) {
                roundPoints += pred.points_earned || 0;
              }
            });

            // Update cumulative points
            userCumulativePoints[userProfile.user_id] += roundPoints;

            userPointsInRound.push({
              userId: userProfile.user_id,
              points: userCumulativePoints[userProfile.user_id] // Use cumulative points for ranking
            });
          });

          // Sort by cumulative points descending
          userPointsInRound.sort((a, b) => b.points - a.points);

          const roundData = {
            name: round.name.replace(/Group Stage - /i, 'מחזור '),
            roundId: round.id
          };

          for (let i = 0; i < userPointsInRound.length; i++) {
            if (i > 0 && userPointsInRound[i].points === userPointsInRound[i - 1].points) {
              userPointsInRound[i].rank = userPointsInRound[i - 1].rank;
            } else {
              userPointsInRound[i].rank = i + 1;
            }
            roundData[userPointsInRound[i].userId] = userPointsInRound[i].rank;
          }

          // Only add data point if at least one user has points (round was actually scored)
          const hasAnyPoints = userPointsInRound.some(u => u.points > 0);
          if (hasAnyPoints) processedData.push(roundData);
        });

        setChartData(processedData);

      } catch (error) {
        console.error("Error calculating ranking charts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleUserVisibility = (userId) => {
    setVisibleUsers((prev) => {
      if (prev.includes(userId)) {
        // Don't remove if it's the last one
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== userId);
      } else {
        // Limit to 10 users max to prevent clutter
        if (prev.length >= 10) return prev;
        return [...prev, userId];
      }
    });
  };

  if (loading) {
    return <div className="py-8"><LoaderBar text="טוען גרפים..." /></div>;
  }

  if (chartData.length === 0) {
    return null; // No data to show
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8 mb-8">

            <Card className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-700/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <CardTitle className="text-white flex items-center justify-center gap-2">
                            <FlexibleIcon
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/1cf56a1b1_game-coin_17879858.png"
                alt="גרף מיקומים"
                size="medium" />

                            מגמות דירוג
                        </CardTitle>
                        
                        <div className="flex items-center gap-2">
                            {/* Chart Type Toggle */}
                            <div className="bg-slate-900/50 p-1 rounded-lg flex items-center">
                                <Button
                  variant={chartType === 'line' ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setChartType('line')}
                  className={`h-8 px-3 text-xs ${chartType !== 'line' ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800" : ""}`}>

                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    קווי
                                </Button>
                                <Button
                  variant={chartType === 'bump' ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setChartType('bump')}
                  className={`h-8 px-3 text-xs ${chartType !== 'bump' ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800" : ""}`}>

                                    <BarChart2 className="w-3 h-3 mr-1" />
                                    זרימה
                                </Button>
                            </div>

                            {/* User Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9 border-slate-600 bg-slate-800 text-slate-200">
                                        <Users className="w-4 h-4 mr-2" />
                                        שחקנים
                                        <span className="ml-1 bg-slate-700 px-1.5 py-0.5 rounded-full text-[10px]">
                                            {visibleUsers.length}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-slate-200 max-h-80 overflow-y-auto">
                                    <DropdownMenuLabel>בחר שחקנים להצגה (עד 10)</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-700" />
                                    {allUsers.map((user) =>
                  <DropdownMenuCheckboxItem
                    key={user.user_id}
                    checked={visibleUsers.includes(user.user_id)}
                    onCheckedChange={() => toggleUserVisibility(user.user_id)}
                    className="focus:bg-slate-700 focus:text-slate-100"
                    disabled={!visibleUsers.includes(user.user_id) && visibleUsers.length >= 10}>

                                            <span className={user.user_id === currentUser?.id ? "font-bold text-blue-400" : ""}>
                                                {user.display_name}
                                            </span>
                                        </DropdownMenuCheckboxItem>
                  )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 pb-4 md:p-6">
                    {/* Instructions for mobile */}
                    <div className="py-2 text-center md:hidden bg-slate-900/30 border-b border-slate-700/50 mb-2">
                         <span className="text-[10px] text-slate-400">
                            ↔️ החלק לרוחב | 👆 לחץ על שחקן להדגשה
                        </span>
                    </div>

                    {/* Scrollable Container for Mobile */}
                    <div className="h-[350px] md:h-[400px] w-full overflow-x-auto dir-ltr scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent px-2">
                        {/* Minimum width ensures chart isn't squashed on mobile */}
                        <div className="h-full min-w-[600px] md:min-w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>

                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                                    <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={{ stroke: '#334155' }}
                    interval={0} // Show all ticks
                    height={60}
                    angle={-30}
                    textAnchor="end" />

                                    <YAxis
                    reversed={true}
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={{ stroke: '#334155' }}
                    domain={[1, 'auto']}
                    allowDecimals={false}
                    width={30} />

                                    <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      borderColor: '#475569',
                      color: '#f8fafc',
                      borderRadius: '8px',
                      fontSize: '12px',
                      padding: '8px'
                    }}
                    itemStyle={{ padding: 0 }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}
                    cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    
                                    {visibleUsers.map((userId, index) => {
                    const user = allUsers.find((u) => u.user_id === userId);
                    if (!user) return null;

                    const isCurrentUser = userId === currentUser?.id;

                    // Use consistent colors for specific users if possible, or cycle through
                    // For better UX, maybe hash the userId to pick a color so it stays consistent
                    const color = isCurrentUser ? "#60a5fa" : colors[index % colors.length];

                    // Determine opacity based on focus
                    const isFocused = focusedUser === userId;
                    const isAnyFocused = focusedUser !== null;

                    // If someone is focused, dim others significantly
                    const opacity = isAnyFocused && !isFocused ? 0.1 : 1;
                    const strokeWidth = isFocused ? 4 : isCurrentUser ? 3 : 2;

                    return (
                      <Line
                        key={userId}
                        type={chartType === 'bump' ? "monotone" : "linear"}
                        dataKey={userId}
                        name={user.display_name}
                        stroke={color}
                        strokeOpacity={opacity}
                        strokeWidth={strokeWidth}
                        dot={chartType === 'line' ? { r: isFocused ? 5 : 3, fill: color, strokeWidth: 0, fillOpacity: opacity } : false}
                        activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                        connectNulls={true}
                        // Add click handler to line itself
                        onClick={(e) => {
                          // e is the event payload, we need to toggle focus
                          setFocusedUser(focusedUser === userId ? null : userId);
                        }}
                        style={{ cursor: 'pointer' }} />);


                  })}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Custom Static Legend */}
                    <div className="py-3 px-2 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm sticky bottom-0 z-10">
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                            {visibleUsers.map((userId, index) => {
                                const user = allUsers.find((u) => u.user_id === userId);
                                if (!user) return null;

                                const isCurrentUser = userId === currentUser?.id;
                                const color = isCurrentUser ? "#60a5fa" : colors[index % colors.length];
                                
                                const isFocused = focusedUser === userId;
                                const isAnyFocused = focusedUser !== null;
                                const opacity = isAnyFocused && !isFocused ? 0.4 : 1;

                                return (
                                    <button
                                        key={userId}
                                        onClick={() => setFocusedUser(focusedUser === userId ? null : userId)}
                                        className={`flex items-center gap-1.5 text-xs transition-all duration-200 ${isFocused ? 'scale-105' : 'hover:opacity-80'}`}
                                        style={{ opacity }}
                                    >
                                        <span 
                                            className={`w-3 h-3 rounded-full shadow-sm ${isFocused ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-800' : ''}`} 
                                            style={{ backgroundColor: color }}
                                        />
                                        <span 
                                            className={`${isFocused ? 'font-bold text-white' : 'font-medium text-slate-300'}`}
                                        >
                                            {user.display_name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-2 text-center text-[10px] text-slate-500 px-4">
                        <p className="text-slate-400 font-medium mb-1">* ניתן לבחור שחקנים שונים (עד 5 שחקנים) בלחיצה על כפתור השחקנים למעלה</p>
                        <p className="text-slate-400">* הגרף מציג את הדירוג המצטבר לאורך המחזורים (טבלה כללית)</p>
                        <p className="mt-1 text-slate-400">* ניתן ללחוץ על הגרף על מנת לראות פירוט של המיקום לפי מחזור</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>);

}