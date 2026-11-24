// The round's score forecast, the pure calculation (no database), shared by the app and the backfill script.
// For every pick and every kind of prediction (outcome, goals range, both teams score, exact score): the pick's
// chance from the odds × its points × the player's skill in that kind. The skill = what they really earned in that
// kind in the past rounds ÷ what the odds said their picks were worth, pulled toward 1 while there is little
// history. The first formula's range is the 20th–80th percentile of simulated rounds; since 25.11 it is a fixed band.

const CATS = ['oc', 'gr', 'bt', 'ex'];
const WIDEN = Number(globalThis.__FC_WIDEN__ || 1.3); // ×1.3, the user's pick (21.11): a tighter band; ×1.6 held 17 of 28 on rounds 1–4
// the range shown around the forecast, points each side (the user's numbers, 25.11): a whole round / one evening
const BAND_ROUND = 12, BAND_EVENING = 7;
const band = (fc, w) => ({ lo: Math.max(0, Math.round(fc) - w), hi: Math.round(fc) + w });
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


// ── the second formula (24.11.2026) ──
// The first one multiplied a pick's chance by its points; the points are the odds, so that came out nearly the
// same for any pick, and only the player's past (their round average) told players apart. Here every match gets
// its own chance for every score — the odds' score table, set to the 1X2 odds, moved by the teams' form this
// season (goals for and against, compared with what the odds expected of them) — and every pick is paid by the
// app's rules on each score. The player's past points are used only for the chance of passing their average.
const FORM_PRIOR = 5; // matches of "as the odds expected" that a team's form is pulled toward
const SCORE_KEY = /^\d+:\d+$/;
const side = (a, b) => (a > b ? 0 : a === b ? 1 : 2);
const range = (t) => (t <= 2 ? 0 : t <= 4 ? 1 : 2);

// the odds' chance of every score in the table: [{ x, y, p }], or null when the match has no table
function scoreTable(m) {
  const L = Object.entries(m.score_odds || {}).filter(([k, v]) => SCORE_KEY.test(k) && n(v) > 0)
    .map(([k, v]) => { const [x, y] = k.split(':').map(Number); return { x, y, p: 1 / n(v) }; });
  const odds = [n(m.home_win_points), n(m.draw_points), n(m.away_win_points)];
  if (L.length < 10 || odds.some((o) => o <= 0)) return null;
  const want = odds.map((o) => 1 / o), sum = want.reduce((q, v) => q + v, 0), have = [0, 0, 0];
  for (const l of L) have[side(l.x, l.y)] += l.p;
  if (have.some((h) => h <= 0)) return null;
  for (const l of L) l.p *= want[side(l.x, l.y)] / sum / have[side(l.x, l.y)];
  return L;
}
const goals = (L) => L.reduce((g, l) => [g[0] + l.p * l.x, g[1] + l.p * l.y], [0, 0]);
const team = (s) => String(s || '').trim();

// how many goals more or less than the odds expected each team scores and concedes, from the matches given
function teamForm(matches) {
  const f = {};
  const add = (t, scored, conceded) => { const o = (f[t] = f[t] || { s: 0, c: 0, n: 0 }); o.s += scored; o.c += conceded; o.n += 1; };
  for (const m of matches) {
    if (!m.is_score_calculated || m.actual_score_a == null || m.actual_score_b == null) continue;
    const L = scoreTable(m);
    if (!L) continue;
    const [h, a] = goals(L), dh = n(m.actual_score_a) - h, da = n(m.actual_score_b) - a;
    add(team(m.team_a), dh, da);
    add(team(m.team_b), da, dh);
  }
  return (t, k) => (f[t] ? f[t][k] / (f[t].n + FORM_PRIOR) : 0);
}

// past: the player's calculated matches of other rounds [{ match, prediction }]; now: the round's picks
// [{ match, a, b }]; matches: every match of the season (the form is read from the other rounds only)
export function computeForecast2(past, now, matches) {
  const { sims, parts, ...row } = core2(past, now, matches);
  return row;
}
function core2(past, now, matches) {
  const rounds = new Set(now.map((x) => x.match.round_id));
  const form = teamForm(matches.filter((m) => !rounds.has(m.round_id)));
  const byRound = {};
  for (const { match, prediction } of past) byRound[match.round_id] = (byRound[match.round_id] || 0) + n(prediction.points_earned);
  const totals = Object.values(byRound);
  const avg = totals.length ? totals.reduce((q, v) => q + v, 0) / totals.length : null;

  let fc = 0, max = 0, dir = 0, exact = 0;
  const parts = { oc: 0, gr: 0, bt: 0, ex: 0 }; // expected hits by kind
  const cats = { oc: 0, gr: 0, bt: 0, ex: 0 };
  const games = now.map(({ match, a, b }) => {
    const k = pick(match, a, b);
    for (const c of CATS) max += k[c][0];
    const base = scoreTable(match);
    if (!base) { // no score table: each kind on its own chance
      for (const c of CATS) { cats[c] += k[c][0] * k[c][1]; fc += k[c][0] * k[c][1]; }
      dir += k.oc[1]; exact += k.ex[1];
      for (const c of CATS) parts[c] += k[c][1];
      return { k };
    }
    const [h, v] = goals(base), H = team(match.team_a), A = team(match.team_b);
    const h2 = Math.max(0.3, h + form(H, 's') + form(A, 'c')), v2 = Math.max(0.2, v + form(A, 's') + form(H, 'c'));
    const L = base.map((l) => ({ ...l, p: l.p * (h2 / h) ** l.x * (v2 / v) ** l.y }));
    const tot = L.reduce((q, l) => q + l.p, 0);
    for (const l of L) {
      l.p /= tot;
      const hit = { oc: side(l.x, l.y) === side(a, b), gr: range(l.x + l.y) === range(a + b), bt: (l.x > 0 && l.y > 0) === (a > 0 && b > 0), ex: l.x === a && l.y === b };
      l.pts = 0;
      for (const c of CATS) if (hit[c]) { l.pts += k[c][0]; cats[c] += l.p * k[c][0]; parts[c] += l.p; }
      if (hit.oc) dir += l.p;
      if (hit.ex) exact += l.p;
      fc += l.p * l.pts;
    }
    return { L };
  });

  // simulated rounds, drawn from the same tables, for the chance of passing the average
  const rand = rng(Math.round(fc * 1000) + now.length);
  const sims = [];
  for (let s = 0; s < 3000; s++) {
    let t = 0;
    for (const g of games) {
      if (g.k) { for (const c of CATS) if (rand() < g.k[c][1]) t += g.k[c][0]; continue; }
      let z = rand();
      for (const l of g.L) { z -= l.p; if (z <= 0) { t += l.pts; break; } }
    }
    sims.push(Math.max(0, fc + WIDEN * (t - fc)));
  }
  const beat = avg == null ? null : Math.round((100 * sims.filter((t) => t > avg).length) / sims.length);
  const r2 = (x) => +x.toFixed(2);
  return {
    fc: r2(fc), ...band(fc, BAND_ROUND), max: r2(max), avg: avg == null ? null : r2(avg),
    sims, parts,
    // v: which formula made the row; dir / exact: expected correct outcomes and exact scores;
    // beat: the chance (%) of passing the average; n: how many matches were predicted
    cats: { ...Object.fromEntries(CATS.map((c) => [c, r2(cats[c])])), v: 2, dir: r2(dir), exact: r2(exact), beat, n: now.length },
  };
}

// ── the third formula (24.11.2026, the user's weighting) ──
// The chances alone gave everyone nearly the same number, and the past alone gave everyone their own average. So:
// the anchor is half the player's round average and half a usual round, and three signals of THIS round move it —
//   picks  what the odds and the teams' form give this round's picks (the second formula), against a usual round
//   teams  how the player did so far in matches of the teams they now back
//   hits   their own hits a round × points a hit in each kind, against their average
// Each signal is put on its own natural scale and capped, so none of them can run away with the number.
const USUAL = 62; // what the odds give any round of 18 picks
const SWING = 12; // points that the signals, together, can move the anchor by per unit
const WEIGHT = { picks: [0.35, 2], teams: [0.35, 6], hits: [0.3, 4] }; // [share, points that count as one unit]
const mean = (A) => (A.length ? A.reduce((q, v) => q + v, 0) / A.length : 0);
const median = (A) => { const s = [...A].sort((x, y) => x - y), h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };

// everyone: all players' calculated predictions of the other rounds, the player's own included [{ match, prediction }]
export function computeForecast3(past, now, matches, everyone) {
  const two = core2(past, now, matches);
  const { sims, ...base } = two;
  if (!past.length || !everyone.length) return computeForecast2(past, now, matches); // no history yet: the odds and form alone
  const look = ({ match, prediction: p }) => ({ match, k: pick(match, n(p.predicted_score_a), n(p.predicted_score_b)), e: earned(p), pts: n(p.points_earned) });
  const mine = past.map(look), all = everyone.map(look);
  const R = new Set(mine.map((x) => x.match.round_id)).size;
  const playerRounds = new Set(everyone.map((x) => `${x.prediction.user_id}|${x.match.round_id}`)).size;
  const perRound = now.length / 18; // a partly sent round is scaled
  const avg = base.avg;

  // hits a round (pulled toward everyone's by one round), tilted by how safe this round's picks are against the
  // player's usual, × points a hit: half their own, half this round's odds against everyone's usual odds
  const cats = {}, count = {};
  let hits = 0;
  for (const c of CATS) {
    const own = mine.filter((x) => x.e[c] > 0), others = all.filter((x) => x.e[c] > 0);
    const gv = mean(others.map((x) => x.e[c])) || 0;
    const usual = mine.reduce((q, x) => q + x.k[c][1], 0) / R, nowP = base.parts[c];
    count[c] = ((own.length + others.length / playerRounds) / (R + 1)) * Math.min(1.5, Math.max(0.6, usual > 0 ? nowP / perRound / usual : 1));
    const ownV = (own.reduce((q, x) => q + x.e[c], 0) + 3 * gv) / (own.length + 3);
    const style = median(now.map((x) => pick(x.match, x.a, x.b)[c][0])) / (median(all.map((x) => x.k[c][0])) || 1);
    cats[c] = count[c] * ((ownV + gv * style) / 2);
    hits += cats[c];
  }

  // the teams: how far above or below their own average a match the player's points were in each team's matches;
  // in this round a team counts in full when the pick backs it
  const perMatch = mean(mine.map((x) => x.pts)), by = {};
  for (const x of mine) for (const t of [x.match.team_a, x.match.team_b]) (by[team(t)] = by[team(t)] || []).push(x.pts - perMatch);
  const feel = (t) => { const A = by[team(t)] || []; return A.reduce((q, v) => q + v, 0) / (A.length + 1); };
  const teams = now.reduce((q, { match, a, b }) => {
    const wa = a >= b ? 1 : 0.4, wb = b >= a ? 1 : 0.4;
    return q + (wa * feel(match.team_a) + wb * feel(match.team_b)) / (wa + wb);
  }, 0);

  const sig = { picks: base.fc / perRound - USUAL, teams: teams / perRound, hits: hits - avg };
  const move = Object.entries(WEIGHT).reduce((q, [k, [w, unit]]) => q + w * Math.max(-2, Math.min(2, sig[k] / unit)), 0);
  const fc = (0.5 * avg + 0.5 * USUAL + SWING * move) * perRound;
  const shift = fc - base.fc, r2 = (x) => +x.toFixed(2);
  const { parts, ...rest } = base;
  return {
    ...rest, fc: r2(fc), ...band(fc, BAND_ROUND),
    cats: {
      ...Object.fromEntries(CATS.map((c) => [c, r2((cats[c] / hits) * fc)])), v: 3, dir: r2(count.oc * perRound), exact: r2(count.ex * perRound),
      beat: Math.round((100 * sims.filter((t) => t + shift > avg * perRound).length) / sims.length), n: now.length,
    },
  };
}

// the live pace: the part of a round's forecast that the matches already kicked off stand for
export function forecastShare(fc, past, started, all, matches) {
  if (!started.length || !all.length) return 0;
  return (fc * core2(past, started, matches).fc) / (core2(past, all, matches).fc || 1);
}

// A round's forecast split between its evenings (they add up to the round): by what the odds and form give each
// evening's picks, tilted by the player's own past evenings — points and correct outcomes a match on that weekday
// against all their matches, pulled toward "no difference" by 9 matches (one evening).
// days: { 'YYYY-MM-DD': the evening's picks }; dayOf(match) gives a match's day in Israel.
// Each evening also gets the player's averages, put on this evening's number of matches:
//   all (any evening) and same (the same weekday; null if they never played on it): { pts, dir, exact }
const EVENING_PRIOR = 9;
const weekday = (day) => new Date(`${day}T12:00:00Z`).getUTCDay();
export function forecastEvenings({ fc, dir }, past, days, matches, dayOf) {
  const keys = Object.keys(days).filter((d) => days[d].length);
  const P = past.map(({ match, prediction }) => ({ wd: weekday(dayOf(match)), pts: n(prediction.points_earned), e: earned(prediction) }));
  const rate = (A) => (A.length ? { pts: mean(A.map((x) => x.pts)), dir: mean(A.map((x) => (x.e.oc > 0 ? 1 : 0))), exact: mean(A.map((x) => (x.e.ex > 0 ? 1 : 0))) } : null);
  const overall = rate(P);
  const parts = keys.map((d) => {
    const same = P.filter((x) => x.wd === weekday(d)), r = rate(same);
    const tilt = (k) => (r && overall[k] > 0 ? (same.length * (r[k] / overall[k]) + EVENING_PRIOR) / (same.length + EVENING_PRIOR) : 1);
    const c = core2(past, days[d], matches), m = days[d].length;
    const on = (x) => x && { pts: +(x.pts * m).toFixed(1), dir: +(x.dir * m).toFixed(1), exact: +(x.exact * m).toFixed(1) };
    return { d, c, pts: c.fc * tilt('pts'), dir: c.parts.oc * tilt('dir'), all: on(overall), same: on(r) };
  });
  const tp = parts.reduce((q, x) => q + x.pts, 0) || 1, td = parts.reduce((q, x) => q + x.dir, 0) || 1;
  return Object.fromEntries(parts.map((x) => {
    const f = (fc * x.pts) / tp;
    return [x.d, { fc: +f.toFixed(2), dir: +((dir * x.dir) / td).toFixed(2), ...band(f, BAND_EVENING), all: x.all, same: x.same }];
  }));
}
