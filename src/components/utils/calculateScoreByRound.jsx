// Frontend implementation of calculateScoreByRound
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities"; 
import { Round } from "@/api/entities";

export const calculateScoreByRound = async ({ userId, roundId, roundName }) => {
    try {
        const targetUserId = userId;

        console.log(`Frontend calculateScoreByRound: Starting calculation for user ${targetUserId}, round ${roundId || roundName}`);

        // Load entities in parallel
        let allMatches, allPredictions, allRounds;
        
        try {
            const [matchesData, predictionsData, roundsData] = await Promise.all([
                Match.list(),
                Prediction.filter({ user_id: targetUserId }), // Only get predictions for this user
                Round.list()
            ]);
            
            allMatches = matchesData;
            allPredictions = predictionsData;
            allRounds = roundsData;
            
        } catch (error) {
            console.error("Error loading entities:", error);
            return { 
                error: 'Failed to load data from database',
                details: error.message,
                success: false 
            };
        }

        // Find the target round
        let targetRound = null;
        if (roundId) {
            targetRound = allRounds.find(r => r.id === roundId);
        } else if (roundName) {
            targetRound = allRounds.find(r => r.name === roundName);
        }

        if (!targetRound) {
            return { 
                error: 'Round not found', 
                success: false
            };
        }

        // Find matches in this round
        const roundMatches = allMatches.filter(m => m.round_id === targetRound.id);
        
        // Find user predictions for matches in this round
        const userPredictionsInRound = allPredictions.filter(p => 
            roundMatches.some(m => m.id === p.match_id)
        );

        // Apply deduplication logic - EXACTLY like backend
        const uniquePredictionsMap = {};
        userPredictionsInRound.forEach(prediction => {
            const key = `${prediction.user_id}_${prediction.match_id}`;
            if (!uniquePredictionsMap[key] || 
                new Date(prediction.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
                uniquePredictionsMap[key] = prediction;
            }
        });
        
        const uniquePredictions = Object.values(uniquePredictionsMap);

        // Calculate stats - EXACTLY like backend
        let totalRoundPoints = 0;
        let exactScoreHits = 0;
        let correctOutcomes = 0;
        let bttsCorrect = 0;
        let goalRangeCorrect = 0;
        const predictionDetails = [];

        for (const prediction of uniquePredictions) {
            const match = roundMatches.find(m => m.id === prediction.match_id);
            if (!match) continue;

            const predictionPoints = prediction.points_earned || 0;
            totalRoundPoints += predictionPoints;

            if (match.is_finished) {
                const isExactScore = prediction.predicted_score_a === match.actual_score_a && 
                                   prediction.predicted_score_b === match.actual_score_b;
                
                const predictedOutcome = prediction.predicted_score_a > prediction.predicted_score_b ? 'home' : 
                                       prediction.predicted_score_a < prediction.predicted_score_b ? 'away' : 'draw';
                const actualOutcome = match.actual_score_a > match.actual_score_b ? 'home' : 
                                    match.actual_score_a < match.actual_score_b ? 'away' : 'draw';
                const isCorrectOutcome = predictedOutcome === actualOutcome;

                const predictedBTTS = prediction.predicted_score_a > 0 && prediction.predicted_score_b > 0;
                const actualBTTS = match.actual_score_a > 0 && match.actual_score_b > 0;
                const isBTTSCorrect = predictedBTTS === actualBTTS;

                const predictedTotalGoals = prediction.predicted_score_a + prediction.predicted_score_b;
                const actualTotalGoals = match.actual_score_a + match.actual_score_b;
                const predictedRange = predictedTotalGoals <= 2 ? '0-2' : predictedTotalGoals <= 4 ? '3-4' : '5+';
                const actualRange = actualTotalGoals <= 2 ? '0-2' : actualTotalGoals <= 4 ? '3-4' : '5+';
                const isGoalRangeCorrect = predictedRange === actualRange;

                if (isExactScore) exactScoreHits++;
                if (isCorrectOutcome) correctOutcomes++;
                if (isBTTSCorrect) bttsCorrect++;
                if (isGoalRangeCorrect) goalRangeCorrect++;

                predictionDetails.push({
                    matchId: match.id,
                    teams: `${match.team_a} vs ${match.team_b}`,
                    prediction: `${prediction.predicted_score_a}-${prediction.predicted_score_b}`,
                    actual: `${match.actual_score_a}-${match.actual_score_b}`,
                    points: predictionPoints,
                    exactScore: isExactScore,
                    correctOutcome: isCorrectOutcome,
                    bttsCorrect: isBTTSCorrect,
                    goalRangeCorrect: isGoalRangeCorrect
                });
            } else {
                predictionDetails.push({
                    matchId: match.id,
                    teams: `${match.team_a} vs ${match.team_b}`,
                    prediction: `${prediction.predicted_score_a}-${prediction.predicted_score_b}`,
                    actual: 'Not finished',
                    points: 0,
                    exactScore: false,
                    correctOutcome: false,
                    bttsCorrect: false,
                    goalRangeCorrect: false
                });
            }
        }

        const result = {
            success: true,
            userId: targetUserId,
            round: {
                id: targetRound.id,
                name: targetRound.name
            },
            summary: {
                totalRoundPoints: parseFloat(totalRoundPoints.toFixed(2)),
                totalPredictions: uniquePredictions.length,
                exactScoreHits,
                correctOutcomes,
                bttsCorrect,
                goalRangeCorrect,
                finishedMatches: predictionDetails.filter(p => p.actual !== 'Not finished').length,
                pendingMatches: predictionDetails.filter(p => p.actual === 'Not finished').length
            },
            predictionDetails: predictionDetails.sort((a, b) => b.points - a.points)
        };

        return result;

    } catch (error) {
        console.error("Error in frontend calculateScoreByRound:", error);
        return { 
            error: error.message || 'Internal Server Error',
            success: false
        };
    }
};