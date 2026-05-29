// Frontend implementation of getRoundLeaderboard
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { PublicProfile } from "@/api/entities";

export const getRoundLeaderboard = async ({ roundId, currentUserId }) => {
    try {
        console.log(`Frontend getRoundLeaderboard: Starting calculation for round ${roundId}`);

        // Load all data in parallel
        let allPredictions, allMatches, publicProfiles;
        
        try {
            const [predictionsData, matchesData, profilesData] = await Promise.all([
                Prediction.list(),
                Match.list(),
                PublicProfile.list()
            ]);
            
            allPredictions = predictionsData;
            allMatches = matchesData;
            publicProfiles = profilesData;
            
        } catch (error) {
            console.error("Error loading entities:", error);
            return { 
                error: 'Failed to load data from database',
                details: error.message,
                success: false 
            };
        }

        // Find matches for this specific round
        const roundMatches = allMatches.filter(m => m.round_id === roundId);
        if (roundMatches.length === 0) {
            return { 
                error: 'No matches found for this round',
                success: false 
            };
        }

        // Get unique user IDs who have predictions in this round
        const roundPredictions = allPredictions.filter(p => 
            roundMatches.some(m => m.id === p.match_id)
        );
        
        const userIdsInRound = [...new Set(roundPredictions.map(p => p.user_id))];
        console.log(`Frontend getRoundLeaderboard: Found ${userIdsInRound.length} users with predictions in round`);

        if (userIdsInRound.length === 0) {
            return { 
                error: 'No users found with predictions in this round',
                success: false 
            };
        }

        // Calculate scores for each user directly
        const userScores = [];
        
        for (const userId of userIdsInRound) {
            try {
                // Get user predictions for this round
                const userPredictionsInRound = allPredictions.filter(p => 
                    p.user_id === userId && roundMatches.some(m => m.id === p.match_id)
                );

                // Apply deduplication logic (same as calculateScoreByRound)
                const uniquePredictionsMap = {};
                userPredictionsInRound.forEach(prediction => {
                    const key = `${prediction.user_id}_${prediction.match_id}`;
                    if (!uniquePredictionsMap[key] ||
                        new Date(prediction.created_at) > new Date(uniquePredictionsMap[key].created_at)) {
                        uniquePredictionsMap[key] = prediction;
                    }
                });
                
                const uniquePredictions = Object.values(uniquePredictionsMap);

                // Calculate total points for this user in this round
                let totalRoundPoints = 0;
                for (const prediction of uniquePredictions) {
                    // Use points_earned from prediction (already calculated)
                    totalRoundPoints += prediction.points_earned || 0;
                }

                const profile = publicProfiles.find(p => p.user_id === userId);
                const displayName = profile?.display_name || `User ${userId.slice(0, 8)}`;
                
                userScores.push({
                    userId: userId,
                    displayName: displayName,
                    totalPoints: parseFloat(totalRoundPoints.toFixed(2)),
                    isCurrentUser: userId === currentUserId
                });

                console.log(`Frontend getRoundLeaderboard: User ${userId} (${displayName}) - ${totalRoundPoints.toFixed(2)} points`);
                
            } catch (error) {
                console.error(`Error calculating score for user ${userId}:`, error);
                // Continue with other users even if one fails
            }
        }

        if (userScores.length === 0) {
            return { 
                error: 'Could not calculate scores for any users',
                success: false 
            };
        }

        // Sort users by total points (highest first) and assign ranks
        userScores.sort((a, b) => b.totalPoints - a.totalPoints);
        
        let currentRank = 1;
        for (let i = 0; i < userScores.length; i++) {
            if (i > 0 && userScores[i].totalPoints < userScores[i - 1].totalPoints) {
                currentRank = i + 1;
            }
            userScores[i].rank = currentRank;
        }

        // Find current user's position (may be null if user has no predictions this round)
        const currentUserScore = userScores.find(score => score.isCurrentUser) || null;

        console.log(`Frontend getRoundLeaderboard: Calculated scores for ${userScores.length} users. Current user rank: ${currentUserScore?.rank ?? 'N/A'}`);

        return {
            success: true,
            roundId: roundId,
            currentUser: currentUserScore ? {
                rank: currentUserScore.rank,
                totalPoints: currentUserScore.totalPoints,
                displayName: currentUserScore.displayName
            } : null,
            totalParticipants: userScores.length,
            allParticipants: userScores.map(score => ({
                rank: score.rank,
                displayName: score.displayName,
                totalPoints: score.totalPoints,
                userId: score.userId,
                isCurrentUser: score.isCurrentUser
            })),
            top3: userScores.slice(0, 3).map(score => ({
                rank: score.rank,
                displayName: score.displayName,
                totalPoints: score.totalPoints
            }))
        };

    } catch (error) {
        console.error("Error in frontend getRoundLeaderboard:", error);
        return { 
            error: error.message || 'Internal Server Error',
            success: false
        };
    }
};