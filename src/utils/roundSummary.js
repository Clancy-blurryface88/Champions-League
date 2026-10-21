// Round summary numbers for one participant (the same figures the old
// home-screen ticker showed), as plain data for the summary reveal.
import { calculateMatchMaxPotentialPoints } from "@/components/utils/calculateMatchMaxPotentialPoints";

const outcome = (a, b) => (a > b ? 'h' : a < b ? 'a' : 'd');
const latestPer = (preds) => {
  const map = {};
  preds.forEach((p) => {
    const k = `${p.user_id}__${p.match_id}`;
    if (!map[k] || new Date(p.created_at || p.created_date) > new Date(map[k].created_at || map[k].created_date)) map[k] = p;
  });
  return Object.values(map);
};
const isDone = (ms) => ms.length > 0 && ms.every((m) => m.is_finished && m.is_score_calculated);

// The rounds whose matches are all finished and scored, in order.
export function completedRounds(rounds, matches) {
  return [...rounds].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((r) => isDone(matches.filter((m) => m.round_id === r.id)));
}

// roundId: a completed round (default: the last one). null when there's nothing to show.
export function computeRoundSummary(userId, { rounds, matches, predictions, profiles }, roundId) {
  const done = completedRounds(rounds, matches);
  const idx = roundId ? done.findIndex((r) => r.id === roundId) : done.length - 1;
  if (idx < 0) return null;
  const round = done[idx], prevRound = done[idx - 1];
  const rMatches = matches.filter((m) => m.round_id === round.id);
  const byId = Object.fromEntries(rMatches.map((m) => [m.id, m]));
  const preds = latestPer(predictions.filter((p) => byId[p.match_id]));

  const pointsOf = {};
  preds.forEach((p) => { pointsOf[p.user_id] = (pointsOf[p.user_id] || 0) + (p.points_earned || 0); });
  const sorted = Object.entries(pointsOf).sort(([, a], [, b]) => b - a);
  let rank = null;
  sorted.forEach(([uid, pts], i) => { if (uid === userId) rank = sorted.findIndex(([, x]) => Math.abs(x - pts) < 1e-9) + 1; });

  const mine = preds.filter((p) => p.user_id === userId);
  const pts = pointsOf[userId] || 0;
  const exact = mine.filter((p) => p.predicted_score_a === byId[p.match_id].actual_score_a && p.predicted_score_b === byId[p.match_id].actual_score_b).length;
  const dir = mine.filter((p) => { const m = byId[p.match_id]; return outcome(p.predicted_score_a, p.predicted_score_b) === outcome(m.actual_score_a, m.actual_score_b); }).length;
  const maxPts = rMatches.reduce((s, m) => s + calculateMatchMaxPotentialPoints(m), 0);

  let prev = null, change = null;
  if (prevRound) {
    const pm = new Set(matches.filter((m) => m.round_id === prevRound.id).map((m) => m.id));
    prev = latestPer(predictions.filter((p) => p.user_id === userId && pm.has(p.match_id))).reduce((s, p) => s + (p.points_earned || 0), 0);
    change = prev > 0 ? (pts - prev) / prev * 100 : pts > 0 ? 100 : 0;
  }

  const bestPred = [...mine].sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0))[0];
  const bm = bestPred && bestPred.points_earned > 0 ? byId[bestPred.match_id] : null;

  const counts = {}, exactPer = {};
  let allExact = 0, allDir = 0;
  preds.forEach((p) => {
    const m = byId[p.match_id];
    const sk = `${p.predicted_score_a}-${p.predicted_score_b}`; counts[sk] = (counts[sk] || 0) + 1;
    if (p.predicted_score_a === m.actual_score_a && p.predicted_score_b === m.actual_score_b) { allExact++; exactPer[p.user_id] = (exactPer[p.user_id] || 0) + 1; }
    if (outcome(p.predicted_score_a, p.predicted_score_b) === outcome(m.actual_score_a, m.actual_score_b)) allDir++;
  });
  const common = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const king = Object.entries(exactPer).sort((a, b) => b[1] - a[1])[0];
  const nameOf = (uid) => profiles.find((p) => p.user_id === uid || p.id === uid)?.display_name?.trim() || '';
  const roundNo = (round.name.match(/(\d+)\s*$/) || [])[1] || round.order;

  return {
    roundId: round.id, round: round.name, roundNo, me: nameOf(userId), rank, players: sorted.length,
    pts, prev, change, ofMax: maxPts ? pts / maxPts * 100 : 0, avg: mine.length ? pts / mine.length : 0,
    exact, dir, dirOf: mine.length,
    best: bm ? { home: bm.team_a_logo, away: bm.team_b_logo, pts: bestPred.points_earned, label: `${bm.team_a} – ${bm.team_b}` } : null,
    common: common ? { score: common[0], n: common[1] } : null,
    allExact, allDir,
    king: king ? { name: nameOf(king[0]) || '?', n: king[1] } : null,
  };
}
