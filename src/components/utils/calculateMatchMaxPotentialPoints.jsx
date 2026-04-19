export const calculateMatchMaxPotentialPoints = (match) => {
  if (!match || match.actual_score_a === null || match.actual_score_b === null) return 0;
  
  // אם יש score_odds — המקסימום הוא הערך הגבוה ביותר בטבלה
  let exactPoints = 0;
  if (match.score_odds) {
    const oddsValues = Object.entries(match.score_odds)
      .filter(([key]) => key !== 'other')
      .map(([, val]) => parseFloat(val) || 0);
    exactPoints = oddsValues.length > 0 ? Math.max(...oddsValues) : 0;
  } else {
    exactPoints = match.exact_score_points || 0;
  }
  let points = exactPoints;
  
  // Outcome points
  if (match.actual_score_a > match.actual_score_b) points += match.home_win_points || 0;
  else if (match.actual_score_b > match.actual_score_a) points += match.away_win_points || 0;
  else points += match.draw_points || 0;
  
  // BTTS points
  const btts = (match.actual_score_a > 0 && match.actual_score_b > 0);
  if (btts) points += match.btts_yes_points || 0;
  else points += match.btts_no_points || 0;
  
  // Goals range points
  const totalGoals = match.actual_score_a + match.actual_score_b;
  if (totalGoals <= 2) points += match.goals_0_2_points || 0;
  else if (totalGoals <= 4) points += match.goals_3_4_points || 0;
  else points += match.goals_5_plus_points || 0;
  
  return points;
};