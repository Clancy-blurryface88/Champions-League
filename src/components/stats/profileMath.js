// The forecaster profile: how each participant predicts against what happened, how accurate
// they are against the group's average, and their style. Computed from finished matches only.

const sgn = (a, b) => (a > b ? 'H' : a < b ? 'A' : 'D');
const avg = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
export const pc = (a, b) => (b ? Math.round((100 * a) / b) : 0);

export const isDone = (m) => m.is_finished && m.actual_score_a != null && m.actual_score_b != null;

// matches: the finished matches to count; predictions: everyone's predictions (any match);
// names: user_id -> display name
export function computeProfile(matches, predictions, names) {
  const ids = new Set(matches.map((m) => m.id));
  const M = Object.fromEntries(matches.map((m) => [m.id, m]));
  const preds = predictions.filter((p) => ids.has(p.match_id) && p.predicted_score_a != null && p.predicted_score_b != null);
  const byMatch = {};
  preds.forEach((p) => (byMatch[p.match_id] ??= []).push(p));
  const N = matches.length;
  const real = {
    D: matches.filter((m) => m.actual_score_a === m.actual_score_b).length,
    H: matches.filter((m) => m.actual_score_a > m.actual_score_b).length,
    A: matches.filter((m) => m.actual_score_a < m.actual_score_b).length,
    goals: r2(avg(matches.map((m) => m.actual_score_a + m.actual_score_b))),
    btts: matches.filter((m) => m.actual_score_a > 0 && m.actual_score_b > 0).length,
    margin: r2(avg(matches.map((m) => Math.abs(m.actual_score_a - m.actual_score_b)))),
  };

  const per = {};
  for (const uid of new Set(preds.map((p) => p.user_id))) {
    if (!names[uid]) continue;
    const ps = preds.filter((p) => p.user_id === uid);
    const n = ps.length;
    const o = (p) => sgn(p.predicted_score_a, p.predicted_score_b);
    const counts = {};
    ps.forEach((p) => { const k = `${p.predicted_score_a}-${p.predicted_score_b}`; counts[k] = (counts[k] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    // the outcome most of the others picked for the same match
    const majority = ps.filter((p) => {
      const c = { H: 0, D: 0, A: 0 };
      byMatch[p.match_id].forEach((q) => { if (q.user_id !== uid) c[o(q)]++; });
      return o(p) === Object.entries(c).sort((a, b) => b[1] - a[1])[0][0];
    }).length;
    const unique = ps.filter((p) => !byMatch[p.match_id].some((q) => q.user_id !== uid && q.predicted_score_a === p.predicted_score_a && q.predicted_score_b === p.predicted_score_b));
    const sum = (k) => ps.reduce((s, p) => s + (Number(p[k]) || 0), 0);
    const total = sum('points_earned');
    per[uid] = {
      uid, name: names[uid], n,
      D: ps.filter((p) => o(p) === 'D').length,
      H: ps.filter((p) => o(p) === 'H').length,
      A: ps.filter((p) => o(p) === 'A').length,
      goals: r2(avg(ps.map((p) => p.predicted_score_a + p.predicted_score_b))),
      btts: ps.filter((p) => p.predicted_score_a > 0 && p.predicted_score_b > 0).length,
      margin: r2(avg(ps.map((p) => Math.abs(p.predicted_score_a - p.predicted_score_b)))),
      outcome: ps.filter((p) => o(p) === sgn(M[p.match_id].actual_score_a, M[p.match_id].actual_score_b)).length,
      exact: ps.filter((p) => Number(p.exact_score_points_earned) > 0).length,
      ppm: r2(total / n), total: r2(total),
      majority, unique: unique.length, uniqueHits: unique.filter((p) => Number(p.exact_score_points_earned) > 0).length,
      top: top[0], topN: top[1], distinct: Object.keys(counts).length,
      src: { exact: r1(sum('exact_score_points_earned')), outcome: r1(sum('correct_outcome_points_earned')), range: r1(sum('goals_range_points_earned')), btts: r1(sum('both_teams_scored_points_earned')) },
    };
  }

  const P = Object.values(per);
  const ga = (f) => r2(avg(P.map(f)));
  const src = { exact: 0, outcome: 0, range: 0, btts: 0 };
  P.forEach((p) => Object.keys(src).forEach((k) => (src[k] += p.src[k])));
  const group = {
    D: ga((p) => pc(p.D, p.n)), H: ga((p) => pc(p.H, p.n)), A: ga((p) => pc(p.A, p.n)),
    goals: ga((p) => p.goals), btts: ga((p) => pc(p.btts, p.n)), margin: ga((p) => p.margin),
    outcome: ga((p) => pc(p.outcome, p.n)), exact: ga((p) => p.exact), ppm: ga((p) => p.ppm),
    majority: ga((p) => pc(p.majority, p.n)), unique: ga((p) => p.unique), uniqueHits: ga((p) => p.uniqueHits),
    topShare: ga((p) => pc(p.topN, p.n)), src,
    // the counts behind the group's percentages: all participants' predictions added up
    sum: Object.fromEntries(['n', 'D', 'H', 'A', 'btts', 'outcome', 'majority', 'topN'].map((k) => [k, P.reduce((s, p) => s + p[k], 0)])),
  };
  return { n: N, real, group, per, people: P.length };
}
