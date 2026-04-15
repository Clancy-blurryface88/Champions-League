
import React, { useState } from "react";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { User } from "@/api/entities";
import { UserStats } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AdminScoring({ onUpdateComplete }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const calculateScore = (prediction, match) => {
    if (!match.is_finished || match.actual_score_a === null || match.actual_score_b === null) {
      console.log(`Calculating score for prediction ${prediction.id} on match ${match.id}: Match not finished or actual score missing. Returning 0 points.`);
      return {
        totalPoints: 0,
        exactScorePoints: 0,
        outcomePoints: 0,
        bttsPoints: 0,
        goalRangePoints: 0
      };
    }

    const predictedA = prediction.predicted_score_a;
    const predictedB = prediction.predicted_score_b;
    const actualA = match.actual_score_a;
    const actualB = match.actual_score_b;

    let totalPoints = 0;
    let exactScorePoints = 0;
    let outcomePoints = 0;
    let bttsPoints = 0;
    let goalRangePoints = 0;

    console.log(`Calculating score for prediction ${prediction.id} (User: ${prediction.user_id}) on match ${match.id} (${match.team_a} vs ${match.team_b}):`);
    console.log(`  Predicted: ${predictedA}-${predictedB}, Actual: ${actualA}-${actualB}`);

    // 1. בדיקת תוצאה מדויקת (Exact Score)
    if (predictedA === actualA && predictedB === actualB) {
      if (match.score_odds) {
        // חיפוש בטבלת האודס הספציפית
        const key = `${actualA}:${actualB}`;
        exactScorePoints = match.score_odds[key] ?? match.score_odds['other'] ?? 0;
      } else {
        exactScorePoints = match.exact_score_points || 0;
      }
      totalPoints += exactScorePoints;
      console.log(`  Exact score match! Adding ${exactScorePoints} points. Total: ${totalPoints}`);
    }

    // 2. בדיקת כיוון נכון (Correct Outcome) - תמיד מחושב
    const predictedOutcome = predictedA > predictedB ? 'home' : predictedA < predictedB ? 'away' : 'draw';
    const actualOutcome = actualA > actualB ? 'home' : actualA < actualB ? 'away' : 'draw';
    
    if (predictedOutcome === actualOutcome) {
      if (actualOutcome === 'home') {
        outcomePoints = match.home_win_points || 0;
      } else if (actualOutcome === 'away') {
        outcomePoints = match.away_win_points || 0;
      } else {
        outcomePoints = match.draw_points || 0;
      }
      totalPoints += outcomePoints;
      console.log(`  Correct outcome (${actualOutcome})! Adding ${outcomePoints} points. Total: ${totalPoints}`);
    }

    // 3. בדיקת BTTS (Both Teams To Score)
    const predictedBTTS = predictedA > 0 && predictedB > 0;
    const actualBTTS = actualA > 0 && actualB > 0;
    
    if (predictedBTTS === actualBTTS) {
      if (actualBTTS) {
        bttsPoints = match.btts_yes_points || 0;
      } else {
        bttsPoints = match.btts_no_points || 0;
      }
      totalPoints += bttsPoints;
      console.log(`  BTTS correct (${actualBTTS ? 'Yes' : 'No'})! Adding ${bttsPoints} points. Total: ${totalPoints}`);
    }

    // 4. בדיקת טווח שערים (Goals Range) - FIXED LOGIC
    const predictedTotalGoals = predictedA + predictedB;
    const actualTotalGoals = actualA + actualB;
    
    let predictedRange = '';
    if (predictedTotalGoals >= 0 && predictedTotalGoals <= 2) {
      predictedRange = '0-2';
    } else if (predictedTotalGoals >= 3 && predictedTotalGoals <= 4) {
      predictedRange = '3-4';
    } else if (predictedTotalGoals >= 5) {
      predictedRange = '5+';
    }
    
    let actualRange = '';
    if (actualTotalGoals >= 0 && actualTotalGoals <= 2) {
      actualRange = '0-2';
    } else if (actualTotalGoals >= 3 && actualTotalGoals <= 4) {
      actualRange = '3-4';
    } else if (actualTotalGoals >= 5) {
      actualRange = '5+';
    }
    
    console.log(`  Goals range calculation: Predicted total ${predictedTotalGoals} (${predictedRange}), Actual total ${actualTotalGoals} (${actualRange})`);
    
    if (predictedRange === actualRange) {
      if (actualRange === '0-2') {
        goalRangePoints = match.goals_0_2_points || 0;
      } else if (actualRange === '3-4') {
        goalRangePoints = match.goals_3_4_points || 0;
      } else if (actualRange === '5+') {
        goalRangePoints = match.goals_5_plus_points || 0;
      }
      
      if (goalRangePoints > 0) {
        totalPoints += goalRangePoints;
        console.log(`  Goals range correct (${actualRange})! Adding ${goalRangePoints} points. Total: ${totalPoints}`);
      } else {
        console.log(`  Goals range correct (${actualRange}) but no points configured for this range in match settings`);
      }
    } else {
      console.log(`  Goals range incorrect: predicted ${predictedRange}, actual ${actualRange}`);
    }

    console.log(`Final score for prediction ${prediction.id}: ${totalPoints} (Exact: ${exactScorePoints}, Outcome: ${outcomePoints}, BTTS: ${bttsPoints}, Range: ${goalRangePoints})`);
    
    return {
      totalPoints: parseFloat(totalPoints.toFixed(2)),
      exactScorePoints: parseFloat(exactScorePoints.toFixed(2)),
      outcomePoints: parseFloat(outcomePoints.toFixed(2)),
      bttsPoints: parseFloat(bttsPoints.toFixed(2)),
      goalRangePoints: parseFloat(goalRangePoints.toFixed(2))
    };
  };

  const handleFullScoreCalculation = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const [allMatches, initialPredictions, allUsers] = await Promise.all([
        Match.list(),
        Prediction.list(), // Renamed to initialPredictions as we will refresh them later
        User.list()
      ]);

      // **חישוב מצטבר: מחפשים רק משחקים שהסתיימו אבל טרם חושבו**
      const unprocessedFinishedMatches = allMatches.filter(m => 
        m.is_finished && 
        m.actual_score_a !== null && 
        m.actual_score_b !== null &&
        !m.is_score_calculated  // **השדה החדש - רק משחקים שלא חושבו**
      );
      
      if (unprocessedFinishedMatches.length === 0) {
        setStatus({ type: 'info', message: 'All finished matches have already been calculated. No new calculations needed.' });
        setLoading(false);
        return;
      }

      console.log(`Found ${unprocessedFinishedMatches.length} unprocessed finished matches with actual scores.`);

      // **סינון ניחושים רק למשחקים החדשים**
      const matchIdsToProcess = unprocessedFinishedMatches.map(m => m.id);
      const predictionsToProcess = initialPredictions.filter(p => // Use initialPredictions here
        matchIdsToProcess.includes(p.match_id)
      );

      const uniquePredictionsMap = {};
      
      predictionsToProcess.forEach(prediction => {
        const key = `${prediction.user_id}_${prediction.match_id}`;
        
        if (!uniquePredictionsMap[key] || 
            new Date(prediction.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
          uniquePredictionsMap[key] = prediction;
        }
      });
      
      const uniquePredictions = Object.values(uniquePredictionsMap);
      console.log(`After filtering duplicates: ${uniquePredictions.length} unique predictions to process (was ${predictionsToProcess.length})`);

      let updatedPredictionsCount = 0;

      console.log("Starting to calculate scores for NEW matches only...");

      // **עיבוד רק הניחושים החדשים**
      for (const prediction of uniquePredictions) {
        const match = unprocessedFinishedMatches.find(m => m.id === prediction.match_id);
        
        if (match) {
          const scoreBreakdown = calculateScore(prediction, match);
          
          // עדכון ניחוש עם פירוט נקודות בDatabase
          await Prediction.update(prediction.id, {
            points_earned: scoreBreakdown.totalPoints,
            exact_score_points_earned: scoreBreakdown.exactScorePoints,
            correct_outcome_points_earned: scoreBreakdown.outcomePoints,
            both_teams_scored_points_earned: scoreBreakdown.bttsPoints,
            goals_range_points_earned: scoreBreakdown.goalRangePoints
          });
          
          updatedPredictionsCount++;
          console.log(`  Processed prediction ${prediction.id} with detailed breakdown: Total=${scoreBreakdown.totalPoints}, Exact=${scoreBreakdown.exactScorePoints}, Outcome=${scoreBreakdown.outcomePoints}, BTTS=${scoreBreakdown.bttsPoints}, Range=${scoreBreakdown.goalRangePoints}`);
        }
      }

      // **סימון המשחקים החדשים כמחושבים**
      for (const match of unprocessedFinishedMatches) {
        await Match.update(match.id, { is_score_calculated: true });
        console.log(`  Marked match ${match.id} (${match.team_a} vs ${match.team_b}) as calculated`);
      }

      console.log("Finished calculating scores for new matches. Now updating user stats...");

      // **עדכון UserStats - מחשבים מחדש סכום כללי מכל הניחושים (כולל הישנים והחדשים)**
      // קודם נטען מחדש את כל הניחושים (כולל העדכונים החדשים)
      const refreshedPredictions = await Prediction.list();
      
      const userTotalPoints = {};
      const userExactHits = {};
      const userTotalPredictions = {};
      const userExactScorePoints = {};
      const userOutcomePoints = {};
      const userBttsPoints = {};
      const userGoalsRangePoints = {};

      // Initialize user counters
      allUsers.forEach(user => {
        userTotalPoints[user.id] = 0;
        userExactHits[user.id] = 0;
        userTotalPredictions[user.id] = 0;
        userExactScorePoints[user.id] = 0;
        userOutcomePoints[user.id] = 0;
        userBttsPoints[user.id] = 0;
        userGoalsRangePoints[user.id] = 0;
      });

      // **חישוב סיכום כללי מכל הניחושים המעודכנים**
      const uniqueAllPredictionsMap = {};

      refreshedPredictions.forEach(prediction => {
        const key = `${prediction.user_id}_${prediction.match_id}`;

        if (!uniqueAllPredictionsMap[key] ||
            new Date(prediction.created_date) > new Date(uniqueAllPredictionsMap[key].created_date)) {
          uniqueAllPredictionsMap[key] = prediction;
        }
      });

      const allUniquePredictions = Object.values(uniqueAllPredictionsMap);

      // Count total predictions per user and sum their points + category breakdown
      allUniquePredictions.forEach(prediction => {
        const uid = prediction.user_id;
        if (!userTotalPredictions.hasOwnProperty(uid)) {
          userTotalPredictions[uid] = 0;
          userTotalPoints[uid] = 0;
          userExactHits[uid] = 0;
          userExactScorePoints[uid] = 0;
          userOutcomePoints[uid] = 0;
          userBttsPoints[uid] = 0;
          userGoalsRangePoints[uid] = 0;
        }

        userTotalPredictions[uid]++;
        userTotalPoints[uid] = parseFloat((userTotalPoints[uid] + (prediction.points_earned || 0)).toFixed(2));
        userExactScorePoints[uid] = parseFloat((userExactScorePoints[uid] + (prediction.exact_score_points_earned || 0)).toFixed(2));
        userOutcomePoints[uid] = parseFloat((userOutcomePoints[uid] + (prediction.correct_outcome_points_earned || 0)).toFixed(2));
        userBttsPoints[uid] = parseFloat((userBttsPoints[uid] + (prediction.both_teams_scored_points_earned || 0)).toFixed(2));
        userGoalsRangePoints[uid] = parseFloat((userGoalsRangePoints[uid] + (prediction.goals_range_points_earned || 0)).toFixed(2));

        const match = allMatches.find(m => m.id === prediction.match_id);
        if (match && match.is_finished &&
            prediction.predicted_score_a === match.actual_score_a &&
            prediction.predicted_score_b === match.actual_score_b) {
          userExactHits[uid]++;
        }
      });

      console.log("Aggregated all user totals (including existing + new):", userTotalPoints);

      // Update user stats using UserStats entity directly
      let updatedUsersCount = 0;
      for (const [userId, totalPoints] of Object.entries(userTotalPoints)) {
        try {
          // Check if UserStats already exists for this user
          const existingStats = await UserStats.filter({ user_id: userId });

          const statsData = {
            user_id: userId,
            total_points: totalPoints,
            exact_hits_count: userExactHits[userId] || 0,
            total_predictions_count: userTotalPredictions[userId] || 0,
            total_exact_score_points: userExactScorePoints[userId] || 0,
            total_outcome_points: userOutcomePoints[userId] || 0,
            total_btts_points: userBttsPoints[userId] || 0,
            total_goals_range_points: userGoalsRangePoints[userId] || 0,
          };

          if (existingStats.length > 0) {
            // Update existing stats
            await UserStats.update(existingStats[0].id, statsData);
            console.log(`  UPDATED UserStats for user ${userId}: Total points ${totalPoints}, Exact hits ${userExactHits[userId] || 0}, Total predictions ${userTotalPredictions[userId] || 0}.`);
          } else {
            // Create new stats record
            await UserStats.create(statsData);
            console.log(`  CREATED UserStats for user ${userId}: Total points ${totalPoints}, Exact hits ${userExactHits[userId] || 0}, Total predictions ${userTotalPredictions[userId] || 0}.`);
          }

          updatedUsersCount++;
        } catch (error) {
          console.error(`  Failed to update UserStats for user ${userId}:`, error);
        }
      }

      setStatus({ 
        type: 'success', 
        message: `INCREMENTAL calculation completed! Processed ${updatedPredictionsCount} new predictions from ${unprocessedFinishedMatches.length} new matches and updated UserStats for ${updatedUsersCount} users.` 
      });
      
      if (onUpdateComplete) onUpdateComplete();

    } catch (error) {
      console.error("Error during score calculation:", error);
      setStatus({ type: 'error', message: 'An error occurred during score calculation. Check console for details.' });
    }

    setLoading(false);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-green-400" />
          Calculate Scores (Incremental)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-slate-300">
            Calculate points ONLY for newly finished matches that haven't been processed yet.
          </p>
          <div className="bg-slate-700/50 rounded-lg p-3 text-sm text-slate-300">
            <p className="font-semibold mb-2">🚀 INCREMENTAL CALCULATION - Enhanced Performance:</p>
            <ul className="space-y-1 text-xs">
              <li>⚡ <strong>Smart Processing:</strong> Only calculates scores for matches that finished since last calculation</li>
              <li>🎯 <strong>Exact Score:</strong> Full points if prediction matches exactly</li>
              <li>🏆 <strong>Correct Outcome:</strong> Points for correct win/loss/draw (always calculated)</li>
              <li>⚽ <strong>Both Teams To Score (BTTS):</strong> Points for correctly predicting if both teams score</li>
              <li>📊 <strong>Goals Range:</strong> Points for correct total goals range (0-2, 3-4, 5+) - FIXED LOGIC ✅</li>
            </ul>
          </div>
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 text-sm text-green-200">
            <p className="font-semibold mb-1">✅ Incremental Benefits:</p>
            <p className="text-xs">System processes only NEW finished matches, dramatically improving performance for large tournaments. Previously calculated matches are preserved and ignored.</p>
          </div>
        </div>
        
        {status.message && (
          <Alert variant={status.type === 'error' ? 'destructive' : 'default'} className={
            status.type === 'success' ? 'bg-green-900/50 border-green-700' : 
            status.type === 'info' ? 'bg-blue-900/50 border-blue-700' : ''
          }>
            {status.type === 'success' && <CheckCircle className="h-4 w-4" />}
            {status.type === 'error' && <XCircle className="h-4 w-4" />}
            <AlertDescription className={
              status.type === 'success' ? 'text-green-300' : 
              status.type === 'error' ? 'text-red-300' : 'text-blue-300'
            }>
              {status.message}
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleFullScoreCalculation}
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white w-full"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Calculator className="w-4 h-4 mr-2" />
          )}
          Run Incremental Score Calculation
        </Button>
      </CardContent>
    </Card>
  );
}
