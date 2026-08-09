// Shared league-phase standings calculation — Champions League format.
// Tie-break order (practical subset of UEFA Article 18, criteria the app can
// actually compute from match results): Pts → GD → GF → away goals scored →
// wins → away wins → name. No head-to-head, since in a 36-team single league
// phase each team plays only 8 of 35 possible opponents — not every team
// meets every other team, so H2H isn't a valid tiebreaker here.
export function calcStandings(matches) {
  const teams = {};
  const ensure = (name, logo) => {
    if (!teams[name]) {
      teams[name] = { name, logo, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0, awayGF: 0, awayW: 0 };
    }
    return teams[name];
  };
  matches.forEach(m => { ensure(m.team_a, m.team_a_logo); ensure(m.team_b, m.team_b_logo); });
  matches.forEach(m => {
    if (!m.is_finished || m.actual_score_a == null || m.actual_score_b == null) return;
    const a = teams[m.team_a], b = teams[m.team_b];
    const sa = m.actual_score_a, sb = m.actual_score_b;
    a.P++; b.P++;
    a.GF += sa; a.GA += sb; b.GF += sb; b.GA += sa;
    b.awayGF += sb; // team_b is always the away side
    if (sa > sb) { a.W++; a.Pts += 3; b.L++; }
    else if (sa < sb) { b.W++; b.Pts += 3; b.awayW++; a.L++; }
    else { a.D++; a.Pts++; b.D++; b.Pts++; }
  });
  Object.values(teams).forEach(t => { t.GD = t.GF - t.GA; });
  return Object.values(teams).sort((a, b) =>
    (b.Pts - a.Pts) || (b.GD - a.GD) || (b.GF - a.GF) ||
    (b.awayGF - a.awayGF) || (b.W - a.W) || (b.awayW - a.awayW) ||
    a.name.localeCompare(b.name)
  );
}
