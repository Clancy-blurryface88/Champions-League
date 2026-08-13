// Picks a plausible exact score for "בחר עבורי" — weighted by the match's own
// score_odds (lower odds = more likely outcome = higher weight), capped at
// maxGoals per side so it can never suggest something like 10-12. Combos not
// explicitly listed in score_odds (e.g. 5-0) fall back to the table's "other"
// odds, so they're still possible but appropriately rarer than the named ones.
export function pickWeightedScore(scoreOdds, maxGoals = 7) {
  const fallbackWeight = scoreOdds?.other ? 1 / scoreOdds.other : 1 / 20;
  const candidates = [];
  for (let h = 0; h <= maxGoals; h++) {
    for (let a = 0; a <= maxGoals; a++) {
      const odds = scoreOdds?.[`${h}:${a}`];
      candidates.push({ h, a, weight: odds ? 1 / odds : fallbackWeight });
    }
  }
  const total = candidates.reduce((sum, c) => sum + c.weight, 0);
  let r = Math.random() * total;
  for (const c of candidates) {
    r -= c.weight;
    if (r <= 0) return { h: c.h, a: c.a };
  }
  const last = candidates[candidates.length - 1];
  return { h: last.h, a: last.a };
}
