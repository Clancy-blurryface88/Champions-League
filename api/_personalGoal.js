// Personal pushes around a goal and a final whistle (the user's rules, 2026-11-02).
// One message per person per goal, the table first:
//   reached first place      → 🏆 עלית לפסגה!
//   dropped from places 1–3  → ⚔️ עקפו אותך
//   the goal makes their hit → 🔥 2-1!
//   the goal broke their hit → 😱 השער הרס לך את הפגיעה
// Everyone else gets the regular goal push (only when the goal touches an exact score).
// Final whistle: whoever hit the exact score → 🎯 (points of that match).
import { goal, supa, findOurMatch } from './_goalWebhook.js';
import { participants, latestPredictions } from './_personal.js';
import { calculateScore } from '../src/utils/scoring.js';

const CL_LEAGUE = 'cmr77dw3900f5rx06j05wgzv4';
const pts = (n) => (Math.round(n * 100) / 100).toFixed(2);
const PRED = 'user_id,match_id,created_at,predicted_score_a,predicted_score_b,points_earned';

// places with ties sharing a place: { userId: place }
function places(totals) {
  const sorted = Object.entries(totals).sort((x, y) => y[1] - x[1]);
  const at = {};
  sorted.forEach(([id, t], i) => { at[id] = i > 0 && Math.abs(t - sorted[i - 1][1]) < 1e-9 ? at[sorted[i - 1][0]] : i + 1; });
  return at;
}

// Live totals: stored totals plus tonight's not-yet-calculated matches at their
// current scores; `override` sets one match's score (ours, before/after the goal).
async function liveTotals(fx, override) {
  const night = await goal(`/fixtures/date/${fx.matchDate}?leagueId=${CL_LEAGUE}&limit=100`);
  const games = [];
  for (const f of night) {
    if (f.matchStatus === 'SCHEDULED' && f.id !== fx.id) continue;
    const our = await findOurMatch(f);
    if (!our) continue;
    const [h, w] = [Number(f.homeTeamScore) || 0, Number(f.awayTeamScore) || 0];
    games.push({ id: our.match.id, a: our.swapped ? w : h, b: our.swapped ? h : w });
  }
  const rows = games.length ? await supa(`matches?select=*&id=in.(${games.map((g) => g.id).join(',')})`) : [];
  const people = await participants();
  const preds = await latestPredictions(games.map((g) => g.id), PRED);
  const total = (score) => Object.fromEntries(people.map((p) => {
    let t = p.total;
    games.forEach((g) => {
      const m = rows.find((r) => r.id === g.id);
      const pr = preds[p.id]?.[g.id];
      if (!m || !pr || m.is_score_calculated) return; // calculated matches are inside the stored total
      const s = g.id === score.id ? score : g;
      t += calculateScore(pr, { ...m, actual_score_a: s.a, actual_score_b: s.b }).totalPoints;
    });
    return [p.id, t];
  }));
  return { people, preds, total };
}

// Returns { personal: [{ userId, name, heading, body }], rest: [userIds] } for a goal
// that took our match from `before` to `after` (both in GOAL's home-away order).
// `game` = { match: "Home 2-1 Away", scorer: "⚽ Name 67'" (or '') }.
export async function personalForGoal(fx, our, before, after, scorerTeam, game = { match: '', scorer: '' }) {
  const gameLine = [game.match, game.scorer].filter(Boolean).join(' · ');
  const withGame = (body) => (gameLine ? `${gameLine}\n${body}` : body);
  const toOurs = ([h, w]) => ({ id: our.match.id, a: our.swapped ? w : h, b: our.swapped ? h : w });
  const { people, preds, total } = await liveTotals(fx);
  const was = places(total(toOurs(before))), now = places(total(toOurs(after)));
  const afterTotals = total(toOurs(after));
  const nameOf = (id) => people.find((p) => p.id === id)?.name || '';
  const shown = (pr) => (our.swapped ? `${pr.predicted_score_b}-${pr.predicted_score_a}` : `${pr.predicted_score_a}-${pr.predicted_score_b}`);
  const sameAs = (pr, [h, w]) => pr && shown(pr) === `${h}-${w}`;

  const personal = [];
  for (const p of people) {
    const pr = preds[p.id]?.[our.match.id];
    const hitNow = sameAs(pr, after), lost = sameAs(pr, before);
    let msg = null;
    if (now[p.id] === 1 && was[p.id] > 1) {
      msg = { heading: '🏆 עלית לפסגה!', body: withGame(`בזכות השער של ${scorerTeam}, אתה במקום הראשון!`) };
    } else if (was[p.id] <= 3 && now[p.id] > was[p.id]) {
      // the one now directly above who used to be below
      const passer = people.find((o) => o.id !== p.id && now[o.id] < now[p.id] && was[o.id] > was[p.id]);
      msg = passer
        ? { heading: '⚔️ עקפו אותך', body: withGame(`${nameOf(passer.id)} עקף אותך ב-${pts(afterTotals[passer.id] - afterTotals[p.id])} נק׳ 😤`) }
        : { heading: '⚔️ עקפו אותך', body: withGame(`ירדת למקום ${now[p.id]} בטבלה 😤`) };
    } else if (hitNow) {
      // the scorer on its own line under the match line (the heading), like the other pushes
      msg = { heading: `🔥 ${game.match || `${after[0]}-${after[1]}!`}`, body: `${game.scorer ? `${game.scorer}\n` : ''}כרגע זאת פגיעה מדויקת. תחזיק אצבעות 🤞` };
    } else if (lost) {
      msg = { heading: '😱 השער הרס לך את הפגיעה', body: `${gameLine ? `${gameLine} · ` : ''}הגול הרס לך את ה-${shown(pr)} 💔` };
    }
    if (msg) personal.push({ userId: p.id, name: p.name, ...msg });
  }
  const got = new Set(personal.map((m) => m.userId));
  return { personal, rest: people.filter((p) => !got.has(p.id)).map((p) => p.id) };
}

// Final whistle of one match: everyone who hit the exact score, with that match's points.
export async function personalForFinish(fx, our) {
  const [h, w] = [Number(fx.homeTeamScore), Number(fx.awayTeamScore)];
  const [a, b] = our.swapped ? [w, h] : [h, w];
  const [m] = await supa(`matches?select=*&id=eq.${our.match.id}`);
  if (!m) return [];
  const people = await participants();
  const preds = await latestPredictions([our.match.id], PRED);
  const home = fx.homeTeamName.trim(), away = fx.awayTeamName.trim();
  const draw = h === w;
  return people.flatMap((p) => {
    const pr = preds[p.id]?.[our.match.id];
    if (!pr || pr.predicted_score_a !== a || pr.predicted_score_b !== b) return [];
    const got = calculateScore(pr, { ...m, actual_score_a: a, actual_score_b: b }).totalPoints;
    return [{
      userId: p.id, name: p.name, heading: '🎯',
      body: `פגעת ${draw ? 'בתיקו ' : 'ב-'}${h}-${w} של ${home}–${away}, צברת ${pts(got)} נק׳`,
    }];
  });
}
