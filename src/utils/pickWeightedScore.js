// Picks a plausible exact score for "בחר עבורי" — weighted purely by the
// match's own score_odds ratios (lower odds = more likely = higher weight).
// Only scores explicitly listed in score_odds are candidates (the real,
// curated set an odds table actually offers — typically up to ~4 goals each
// way), so this never suggests something outside what the odds themselves
// say is plausible. The "other" catch-all isn't a concrete score, so it's
// excluded rather than used as a fallback weight for made-up combinations.
export function pickWeightedScore(scoreOdds) {
  const candidates = Object.entries(scoreOdds || {})
    // odds <= 0 is invalid data (e.g. an OCR misread from the AI image
    // analysis) — 1/0 is Infinity and would deterministically dominate
    // every other candidate, so treat it as excluded rather than weighted.
    .filter(([key, odds]) => key !== 'other' && /^\d+:\d+$/.test(key) && odds > 0)
    .map(([key, odds]) => {
      const [h, a] = key.split(':').map(Number);
      return { h, a, weight: 1 / odds };
    });

  if (candidates.length === 0) return { h: 0, a: 0 };

  const total = candidates.reduce((sum, c) => sum + c.weight, 0);
  let r = Math.random() * total;
  for (const c of candidates) {
    r -= c.weight;
    if (r <= 0) return { h: c.h, a: c.a };
  }
  const last = candidates[candidates.length - 1];
  return { h: last.h, a: last.a };
}
