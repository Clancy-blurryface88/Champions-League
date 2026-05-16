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

export default function UserRankingsSummary() {
    const [loading, setLoading] = useState(true);
    const [rankingData, setRankingData] = useState({ users: [], ranks: {} });
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
                    
                    if (roundMatches.length === 0) {
                        ranks[round.id] = {};
                        return;
                    }

                    const userPointsInRound = [];

                    users.forEach(userProfile => {
                        let points = 0;
                        roundMatches.forEach(match => {
                            const pred = predictionsMap[match.id]?.[userProfile.user_id];
                            if (pred) {
                                points += (pred.points_earned || 0);
                            }
                        });

                        userPointsInRound.push({
                            userId: userProfile.user_id,
                            points: points
                        });
                    });

                    userPointsInRound.sort((a, b) => b.points - a.points);

                    const roundRanks = {};
                    for (let i = 0; i < userPointsInRound.length; i++) {
                        if (i > 0 && userPointsInRound[i].points === userPointsInRound[i-1].points) {
                            roundRanks[userPointsInRound[i].userId] = roundRanks[userPointsInRound[i-1].userId];
                        } else {
                            roundRanks[userPointsInRound[i].userId] = i + 1;
                        }
                    }

                    ranks[round.id] = roundRanks;
                });

                setRankingData({
                    users: users,
                    ranks: ranks
                });

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
            if (rank) {
                counts[rank] = (counts[rank] || 0) + 1;
            }
        });

        setUserRankCounts(counts);
    }, [selectedUserId, rankingData]);

    if (loading) {
        return <div className="py-8"><LoaderBar text="טוען סיכום מיקומים..." /></div>;
    }

    const ranksToShow = [1, 2, 3];
    let hasAnyData = false;
    Object.keys(userRankCounts).forEach(rank => {
        const r = parseInt(rank);
        if (userRankCounts[r] > 0) hasAnyData = true;
        if (!ranksToShow.includes(r)) {
            ranksToShow.push(r);
        }
    });
    ranksToShow.sort((a, b) => a - b);

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
            <Card className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm overflow-hidden">
                <CardHeader className="text-center pb-4 border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center justify-center gap-2">
                        <FlexibleIcon
                            src="/wc-trophy.png"
                            alt="סיכום מיקומים"
                            size="medium"
                        />
                        סיכום מיקומים למשתתף
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="max-w-xs mx-auto mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2 text-center">
                            בחר משתתף
                        </label>
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
                            <p className="text-slate-500 text-xs mt-1">
                                המיקומים יופיעו כאן לאחר סיום מחזורים וחישוב נקודות
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3" dir="rtl">
                            {ranksToShow.map(rank => {
                                const count = userRankCounts[rank] || 0;
                                let rankBadgeClass = "bg-slate-700/50 border-slate-600 text-slate-300";
                                if (rank === 1) rankBadgeClass = "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
                                else if (rank === 2) rankBadgeClass = "bg-slate-300/20 border-slate-400/50 text-slate-300";
                                else if (rank === 3) rankBadgeClass = "bg-amber-600/20 border-amber-600/50 text-amber-500";
                                else if (rank <= 10) rankBadgeClass = "bg-blue-500/10 border-blue-500/30 text-blue-300";

                                return (
                                    <div key={rank} className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border ${rankBadgeClass}`}>
                                        {getPositionIcon(rank)}
                                        <span className="text-[11px] sm:text-xs opacity-80 mb-0.5">מקום {rank}</span>
                                        <span className="text-xl sm:text-2xl font-bold leading-none">{count}</span>
                                        <span className="text-[10px] opacity-70 mt-0.5">פעמים</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}