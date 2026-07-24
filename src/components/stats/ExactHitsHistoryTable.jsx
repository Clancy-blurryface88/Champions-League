import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { Round } from "@/api/entities";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoaderBar } from "@/components/ui/LoaderBar";
import { FlexibleIcon } from "@/components/ui/FlexibleIcon";
import { motion } from "framer-motion";
import { ShineBorder } from "@/components/magicui/shine-border";

export default function ExactHitsHistoryTable() {
    const [loading, setLoading] = useState(true);
    const [hitsData, setHitsData] = useState({ rounds: [], users: [], hits: {} });
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
                    Prediction.list()
                ]);

                // 3. Sort rounds
                const sortedRounds = roundsData.sort((a, b) => a.order - b.order);

                // 4. Map profiles
                const uniqueProfilesMap = new Map();
                profilesData.forEach(profile => {
                    if (!uniqueProfilesMap.has(profile.user_id)) {
                        uniqueProfilesMap.set(profile.user_id, profile);
                    }
                });
                
                const users = Array.from(uniqueProfilesMap.values()).sort((a, b) => 
                    (a.display_name || "").localeCompare(b.display_name || "")
                );

                // 5. Calculate Exact Hits per Round
                // Structure: hits[roundId][userId] = hitsCount
                const hits = {};

                // Group matches by round
                const matchesByRound = {};
                matchesData.forEach(m => {
                    if (!matchesByRound[m.round_id]) matchesByRound[m.round_id] = [];
                    if (m.is_finished) matchesByRound[m.round_id].push(m);
                });

                // Group predictions by matchId and userId
                const predictionsMap = {}; 
                predictionsData.forEach(p => {
                    if (!predictionsMap[p.match_id]) predictionsMap[p.match_id] = {};
                    predictionsMap[p.match_id][p.user_id] = p;
                });

                sortedRounds.forEach(round => {
                    const roundMatches = matchesByRound[round.id] || [];
                    const roundHits = {};
                    
                    if (roundMatches.length === 0) {
                        hits[round.id] = {}; 
                        return;
                    }

                    users.forEach(userProfile => {
                        let hitCount = 0;

                        roundMatches.forEach(match => {
                            const pred = predictionsMap[match.id]?.[userProfile.user_id];
                            if (pred && (pred.exact_score_points_earned || 0) > 0) {
                                hitCount++;
                            }
                        });

                        roundHits[userProfile.user_id] = hitCount;
                    });

                    hits[round.id] = roundHits;
                });

                setHitsData({
                    rounds: sortedRounds,
                    users: users,
                    hits: hits
                });

            } catch (error) {
                console.error("Error calculating hits table:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="py-8"><LoaderBar text="טוען נתונים..." /></div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 mb-8"
        >
            <Card className="overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)' }}>
                <ShineBorder borderRadius={12} borderWidth={1} duration={10} shineColor={['#38bdf8','#fff','#7dd3fc']} />
                <CardHeader className="text-center pb-4 border-b border-slate-700/50">
                    <CardTitle className="text-white flex items-center justify-center gap-2">
                        <FlexibleIcon
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7ec75a888_target_5987470.png"
                            alt="היסטוריית פגיעות"
                            size="medium"
                        />
                        היסטוריית פגיעות
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
                                    {hitsData.rounds.map(round => (
                                        <TableHead key={round.id} className="text-center text-slate-300 min-w-[60px] px-2">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="whitespace-nowrap text-xs">{round.name.replace(/Group Stage - /i, 'מחזור ')}</span>
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hitsData.users.map((userProfile, index) => {
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
                                            
                                            {hitsData.rounds.map(round => {
                                                const hitCount = hitsData.hits[round.id]?.[userProfile.user_id];
                                                
                                                // Determine color based on hit count
                                                let badgeClass = "text-slate-500"; // 0 or undefined
                                                if (hitCount > 0) badgeClass = "text-green-400 font-bold bg-green-500/10 border border-green-500/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto";
                                                if (hitCount >= 3) badgeClass = "text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/30 rounded-full w-8 h-8 flex items-center justify-center mx-auto shadow-[0_0_10px_rgba(234,179,8,0.2)]";
                                                
                                                return (
                                                    <TableCell key={round.id} className="text-center p-2">
                                                        {hitCount !== undefined ? (
                                                            <div className={badgeClass}>
                                                                {hitCount > 0 ? hitCount : "-"}
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