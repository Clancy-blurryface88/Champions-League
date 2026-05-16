export const calculateMatchMaxPotentialPoints = (match) => {
  if (!match || match.actual_score_a === null || match.actual_score_b === null) return 0;
  
  // המקסימום = הניקוד שמקבלים על פגיעה מדויקת בתוצאה הפועלית
  let exactPoints = 0;
  if (match.score_odds) {
    const key = `${match.actual_score_a}:${match.actual_score_b}`;
    exactPoints = parseFloat(match.score_odds[key] ?? match.score_odds['other'] ?? 0);
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