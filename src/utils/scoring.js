// Points for one prediction against a match result — used by the app (live table,
// night replay) and by the server (personal night summaries), so both count alike.
// Plain JS, no React: the serverless functions import it too.
// `parts` splits the total: exact score, outcome (1X2), both teams score, goals range.
export function calculateScore(prediction, match) {
  const parts = { exact: 0, outcome: 0, btts: 0, range: 0 };
  if (match.actual_score_a === null || match.actual_score_b === null) return { totalPoints: 0, parts };
  const pA = prediction.predicted_score_a, pB = prediction.predicted_score_b;
  const aA = match.actual_score_a,         aB = match.actual_score_b;
  if (pA === aA && pB === aB) {
    parts.exact = match.score_odds
      ? (match.score_odds[`${aA}:${aB}`] ?? match.score_odds['other'] ?? 0)
      : (match.exact_score_points || 0);
  }
  const pDir = pA > pB ? 'home' : pA < pB ? 'away' : 'draw';
  const aDir = aA > aB ? 'home' : aA < aB ? 'away' : 'draw';
  if (pDir === aDir) parts.outcome = aDir === 'home' ? (match.home_win_points || 0) : aDir === 'away' ? (match.away_win_points || 0) : (match.draw_points || 0);
  const aBTTS = aA > 0 && aB > 0, pBTTS = pA > 0 && pB > 0;
  if (pBTTS === aBTTS) parts.btts = aBTTS ? (match.btts_yes_points || 0) : (match.btts_no_points || 0);
  const aGoals = aA + aB, pGoals = pA + pB;
  const aRange = aGoals <= 2 ? '0-2' : aGoals <= 4 ? '3-4' : '5+';
  const pRange = pGoals <= 2 ? '0-2' : pGoals <= 4 ? '3-4' : '5+';
  if (pRange === aRange) parts.range = aRange === '0-2' ? (match.goals_0_2_points || 0) : aRange === '3-4' ? (match.goals_3_4_points || 0) : (match.goals_5_plus_points || 0);
  const total = parts.exact + parts.outcome + parts.btts + parts.range;
  return { totalPoints: parseFloat(total.toFixed(2)), parts };
}
