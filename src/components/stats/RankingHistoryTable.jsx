import React, { useState, useEffect } from "react";
import { User } from "@/api/entities"; // Using User entity to get user list if PublicProfile misses some, but PublicProfile is better for display names
import { PublicProfile } from "@/api/entities";
import { Round } from "@/api/entities";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoaderBar } from "@/components/ui/LoaderBar";
import { FlexibleIcon } from "@/components/ui/FlexibleIcon";
import { motion } from "framer-motion";

export default function RankingHistoryTable() {
    const [loading, setLoading] = useState(true);
    const [rankingData, setRankingData] = useState({ rounds: [], users: [], ranks: {} });
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch current user to highlight them
                const user = await User.me().catch(() => null);
                setCurrentUser(user);

                // 2. Fetch all necessary data in parallel
                const [roundsData, profilesData, matchesData, predictionsData] = await Promise.all([
                    Round.list('order'),
                    PublicProfile.list(),
                    Match.list(),
                    Prediction.list() // This might be heavy, but necessary for full table calculation
                ]);

                // 3. Filter active rounds or all rounds? User said "all rounds".
                // We'll keep all rounds but sort them by order
                const sortedRounds = roundsData.sort((a, b) => a.order - b.order);

                // 4. Map profiles for easy access
                // Filter out admins or test users if needed, similar to MyStats logic
                // Using a map for unique profiles
                const uniqueProfilesMap = new Map();
                profilesData.forEach(profile => {
                    if (!uniqueProfilesMap.has(profile.user_id)) {
                        uniqueProfilesMap.set(profile.user_id, profile);
                    }
                });
                
                // Convert to array and sort alphabetically
                const users = Array.from(uniqueProfilesMap.values()).sort((a, b) => 
                    (a.display_name || "").localeCompare(b.display_name || "")
                );

                // 5. Calculate Ranks per Round
                // Structure: ranks[roundId][userId] = rankNumber
                const ranks = {};

                // Optimization: Group matches by round first
                const matchesByRound = {};
                matchesData.forEach(m => {
                    if (!matchesByRound[m.round_id]) matchesByRound[m.round_id] = [];
                    if (m.is_finished) matchesByRound[m.round_id].push(m);
                });

                // Optimization: Group predictions by matchId for faster lookup or by round directly?
                // Better: Group predictions by user to easily sum up.
                // Wait, we need points per round.
                // Let's iterate rounds, then users.
                
                // Pre-process predictions: keep most recent per user per match
                const predictionsMap = {};
                predictionsData.forEach(p => {
                    if (!predictionsMap[p.match_id]) predictionsMap[p.match_id] = {};
                    const existing = predictionsMap[p.match_id][p.user_id];
                    if (!existing || new Date(p.created_date) > new Date(existing.created_date)) {
                        predictionsMap[p.match_id][p.user_id] = p;
                    }
                });

                sortedRounds.forEach(round => {
                    const roundMatches = matchesByRound[round.id] || [];
                    
                    if (roundMatches.length === 0) {
                        ranks[round.id] = {}; // No finished matches, no ranks
                        return;
                    }

                    // Calculate points for each user in this round
                    const userPointsInRound = [];

                    users.forEach(userProfile => {
                        let points = 0;
                        let hasPredictions = false;

                        roundMatches.forEach(match => {
                            const pred = predictionsMap[match.id]?.[userProfile.user_id];
                            if (pred) {
                                points += (pred.points_earned || 0);
                                hasPredictions = true;
                            }
                        });

                        // Only rank users who have participated (or should we rank everyone with 0?)
                        // "Standard" leaderboard usually ranks everyone. Let's rank everyone.
                        userPointsInRound.push({
                            userId: userProfile.user_id,
                            points: points
                        });
                    });

                    // Sort users by points descending
                    userPointsInRound.sort((a, b) => b.points - a.points);

                    // Assign ranks (handle ties)
                    const roundRanks = {};
                    let currentRank = 1;
                    
                    for (let i = 0; i < userPointsInRound.length; i++) {
                        // If not the first user, check if points are same as previous
                        if (i > 0 && userPointsInRound[i].points === userPointsInRound[i-1].points) {
                            // Same rank as previous
                            roundRanks[userPointsInRound[i].userId] = roundRanks[userPointsInRound[i-1].userId];
                        } else {
                            // New rank (actual position)
                            roundRanks[userPointsInRound[i].userId] = i + 1;
                        }
                    }

                    ranks[round.id] = roundRanks;
                });

                setRankingData({
                    rounds: sortedRounds,
                    users: users,
                    ranks: ranks
                });

            } catch (error) {
                console.error("Error calculating ranking table:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="py-8"><LoaderBar text="טוען דירוגים..." /></div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 mb-8"
        >
            <Card className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm overflow-hidden">
                <CardHeader className="text-center pb-4 border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center justify-center gap-2">
                        <FlexibleIcon
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a99a73381_image.png"
                            alt="היסטוריית מיקום"
                            size="medium"
                        />
                        היסטוריית מיקום
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table dir="ltr">
                            <TableHeader className="bg-slate-900/50">
                                <TableRow className="border-slate-700 hover:bg-transparent">
                                    <TableHead className="text-left text-slate-300 font-bold min-w-[120px] sticky left-0 bg-slate-900/95 z-10 border-r border-slate-700">
                                        משתתף
                                    </TableHead>
                                    {rankingData.rounds.map(round => (
                                        <TableHead key={round.id} className="text-center text-slate-300 min-w-[60px] px-2">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="whitespace-nowrap text-xs">{round.name.replace(/Group Stage - /i, 'מחזור ')}</span>
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rankingData.users.map((userProfile, index) => {
                                    const isCurrentUser = currentUser?.id === userProfile.user_id;
                                    
                                    return (
                                        <TableRow 
                                            key={userProfile.user_id} 
                                            className={`border-slate-700/50 transition-colors ${isCurrentUser ? 'bg-blue-900/20 hover:bg-blue-900/30' : 'hover:bg-slate-700/30'}`}
                                        >
                                            <TableCell className={`font-medium text-left sticky left-0 z-10 border-r border-slate-700 ${isCurrentUser ? 'bg-slate-800 text-blue-300' : 'bg-slate-800 text-slate-300'}`}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500 w-4">{index + 1}</span>
                                                    <span className="truncate max-w-[120px]" title={userProfile.display_name}>
                                                        {userProfile.display_name}
                                                    </span>
                                                    {isCurrentUser && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                                                </div>
                                            </TableCell>
                                            
                                            {rankingData.rounds.map(round => {
                                                const rank = rankingData.ranks[round.id]?.[userProfile.user_id];
                                                
                                                // Determine color based on rank
                                                let rankBadgeClass = "bg-slate-700/50 text-slate-400"; // Default
                                                if (rank === 1) rankBadgeClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
                                                else if (rank === 2) rankBadgeClass = "bg-slate-300/20 text-slate-300 border-slate-400/30";
                                                else if (rank === 3) rankBadgeClass = "bg-amber-600/20 text-amber-500 border-amber-600/30";
                                                else if (rank <= 10) rankBadgeClass = "bg-blue-500/10 text-blue-300 border-blue-500/20";
                                                
                                                return (
                                                    <TableCell key={round.id} className="text-center p-2">
                                                        {rank ? (
                                                            <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-bold border ${rankBadgeClass}`}>
                                                                {rank}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-600">-</span>
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}