// "הקבוצות שלי" (22.11.2026): how many points each team's games brought a player.
// A pick backs a team: a home or away win backs the winner, a draw backs both teams (each gets the game's points).
// Only matches whose scores are calculated count. Sorted from the team that brought the most.
const n = (x) => (x == null || x === '' ? 0 : Number(x));

export function teamPoints(predictions, matches) {
  const byId = Object.fromEntries(matches.map((m) => [m.id, m]));
  const teams = {};
  for (const p of predictions) {
    const m = byId[p.match_id];
    if (!m || !m.is_score_calculated) continue;
    const a = n(p.predicted_score_a), b = n(p.predicted_score_b), pts = n(p.points_earned);
    const kind = a === b ? 'draw' : 'win';
    const sides = a > b ? [[m.team_a, m.team_a_logo]] : a < b ? [[m.team_b, m.team_b_logo]] : [[m.team_a, m.team_a_logo], [m.team_b, m.team_b_logo]];
    for (const [name, logo] of sides) {
      const k = String(name || '').trim();
      const t = (teams[k] ||= { team: k, logo, games: 0, pts: 0, win: { n: 0, pts: 0 }, draw: { n: 0, pts: 0 }, list: [] });
      t.games++; t.pts += pts; t[kind].n++; t[kind].pts += pts;
      t.list.push({ match: m, kind, pick: `${a}-${b}`, actual: `${n(m.actual_score_a)}-${n(m.actual_score_b)}`, pts });
    }
  }
  const out = Object.values(teams);
  for (const t of out) t.list.sort((x, y) => new Date(x.match.match_date) - new Date(y.match.match_date));
  return out.sort((x, y) => y.pts - x.pts || x.games - y.games);
}
