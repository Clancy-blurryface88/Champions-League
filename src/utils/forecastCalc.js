// The round's score forecast, the pure calculation (no database), shared by the app and the backfill script.
// For every pick and every kind of prediction (outcome, goals range, both teams score, exact score): the pick's
// chance from the odds × its points × the player's skill in that kind. The skill = what they really earned in that
// kind in the past rounds ÷ what the odds said their picks were worth, pulled toward 1 while there is little
// history. The usual range is the 20th–80th percentile of simulated rounds.

const CATS = ['oc', 'gr', 'bt', 'ex'];
const WIDEN = Number(globalThis.__FC_WIDEN__ || 1.3); // ×1.3, the user's pick (21.11): a tighter band; ×1.6 held 17 of 28 on rounds 1–4
const SHRINK = 8; // points of history that count as "average skill"
const n = (x) => (x == null || x === '' ? 0 : Number(x));

// the points of the player's pick in each kind, and the pick's chance from the odds
export function pick(m, a, b) {
  const t = a + b;
  const inv = (arr) => arr.reduce((s, v) => s + (v > 0 ? 1 / v : 0), 0);
  const so = m.score_odds && Object.keys(m.score_odds).length ? m.score_odds : null;
  const exPts = so ? n(so[`${a}:${b}`] ?? so.other ?? 0) : n(m.exact_score_points);
  const soVals = so ? Object.values(so).map(Number).filter((v) => v > 0) : [];
  const oc = a > b ? n(m.home_win_points) : a < b ? n(m.away_win_points) : n(m.draw_points);
  const gr = t <= 2 ? n(m.goals_0_2_points) : t <= 4 ? n(m.goals_3_4_points) : n(m.goals_5_plus_points);
  const bt = a > 0 && b > 0 ? n(m.btts_yes_points) : n(m.btts_no_points);
  const pr = (p, all) => (p > 0 && inv(all) > 0 ? (1 / p) / inv(all) : 0);
  return {
    oc: [oc, pr(oc, [n(m.home_win_points), n(m.draw_points), n(m.away_win_points)])],
    gr: [gr, pr(gr, [n(m.goals_0_2_points), n(m.goals_3_4_points), n(m.goals_5_plus_points)])],
    bt: [bt, pr(bt, [n(m.btts_yes_points), n(m.btts_no_points)])],
    // with no exact-score odds table, a rough chance from its points
    ex: [exPts, so ? pr(exPts, soVals) : exPts > 0 ? Math.min(0.3, 1 / exPts) : 0],
  };
}
export const earned = (p) => ({ oc: n(p.correct_outcome_points_earned), gr: n(p.goals_range_points_earned), bt: n(p.both_teams_scored_points_earned), ex: n(p.exact_score_points_earned) });

// a small seeded random, so the range is the same each time the same picks are sent
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// past: [{ match, prediction }] of calculated matches; now: [{ match, a, b }] of the round's picks
export function computeForecast(past, now) {
  const ev = { oc: 0, gr: 0, bt: 0, ex: 0 }, act = { oc: 0, gr: 0, bt: 0, ex: 0 };
  const byRound = {};
  for (const { match, prediction } of past) {
    const m = pick(match, n(prediction.predicted_score_a), n(prediction.predicted_score_b)), g = earned(prediction);
    for (const c of CATS) { ev[c] += m[c][0] * m[c][1]; act[c] += g[c]; }
    byRound[match.round_id] = (byRound[match.round_id] || 0) + n(prediction.points_earned);
  }
  const skill = Object.fromEntries(CATS.map((c) => [c, (act[c] + SHRINK) / (ev[c] + SHRINK)]));
  const rounds = Object.values(byRound);
  const avg = rounds.length ? rounds.reduce((s, v) => s + v, 0) / rounds.length : null;

  const P = now.map(({ match, a, b }) => pick(match, a, b));
  let max = 0, fc = 0; const cats = { oc: 0, gr: 0, bt: 0, ex: 0 };
  for (const m of P) for (const c of CATS) { max += m[c][0]; const e = m[c][0] * m[c][1] * skill[c]; fc += e; cats[c] += e; }

  // simulated rounds: an exact hit brings every kind; otherwise each kind on its own chance
  const rand = rng(Math.round(fc * 1000) + P.length);
  const sims = [];
  for (let s = 0; s < 3000; s++) {
    let tot = 0;
    for (const m of P) {
      if (rand() < Math.min(0.9, m.ex[1] * skill.ex)) { tot += CATS.reduce((x, c) => x + m[c][0], 0); continue; }
      for (const c of ['oc', 'gr', 'bt']) if (rand() < Math.min(0.95, m[c][1] * skill[c])) tot += m[c][0];
    }
    sims.push(tot);
  }
  sims.sort((x, y) => x - y);
  const q = (p) => sims[Math.floor(p * (sims.length - 1))];
  // real rounds swing more than the simulation (picks are not independent): checked on rounds 1–4, the plain
  // 20–80% band held the actual only 10 times in 28, so its two sides are widened by WIDEN (×1.3: 15 of 28)
  const lo = Math.max(0, fc - WIDEN * (fc - q(0.2))), hi = fc + WIDEN * (q(0.8) - fc);
  return { fc: +fc.toFixed(2), lo: Math.round(lo), hi: Math.round(hi), max: +max.toFixed(2), avg: avg == null ? null : +avg.toFixed(2), cats: Object.fromEntries(CATS.map((c) => [c, +cats[c].toFixed(2)])) };
}

