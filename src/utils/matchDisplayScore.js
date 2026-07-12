// Informational full-result score for a finished match — separate from
// actual_score_a/b, which stays the manually-entered field used for scoring.
// Falls back to actual_score_a/b when no display score has been fetched yet.
export function getDisplayScore(match) {
  const a = match.display_score_a ?? match.actual_score_a ?? null;
  const b = match.display_score_b ?? match.actual_score_b ?? null;
  const penalties = match.went_to_penalties && match.penalty_score_a != null && match.penalty_score_b != null
    ? `${match.penalty_score_a}-${match.penalty_score_b}`
    : null;
  return { a, b, penalties };
}
