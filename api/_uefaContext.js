// Shared helper (not a route — Vercel skips files prefixed with "_").
// Pulls real recent-form + standings data for two teams directly from
// UEFA's own backend (uefa-api package, no key required) so the AI brief
// can be grounded in real numbers instead of Claude's general knowledge.
import { getTeams, getMatches, getStandings } from 'uefa-api';

export const COMPETITION_ID = 1; // UEFA Champions League

export function currentSeasonYear() {
  // UEFA's own seasonYear labels a season by the year it ENDS in (verified
  // live: seasonYear=2027 returns the in-progress 2026-27 season, not 2026)
  // — the opposite of the "start year" convention used elsewhere.
  const now = new Date();
  const month = now.getUTCMonth() + 1; // 1-12
  return month >= 7 ? now.getUTCFullYear() + 1 : now.getUTCFullYear();
}

function teamNames(team) {
  return [team.internationalName, team.translations?.displayOfficialName?.EN, team.teamCode]
    .filter(Boolean)
    .map((n) => n.toLowerCase());
}

function resolveTeam(teams, name) {
  const n = name.trim().toLowerCase();
  return (
    teams.find((t) => teamNames(t).includes(n)) ||
    teams.find((t) => teamNames(t).some((x) => x.startsWith(n) || n.startsWith(x))) ||
    teams.find((t) => teamNames(t).some((x) => x.includes(n))) ||
    null
  );
}

function recentFormLine(teamName, teamId, allMatches) {
  const played = allMatches
    .filter((m) => m.status === 'FINISHED' && (m.homeTeam?.id === teamId || m.awayTeam?.id === teamId))
    .sort((a, b) => new Date(b.kickOffTime?.dateTime) - new Date(a.kickOffTime?.dateTime))
    .slice(0, 5);

  if (played.length === 0) return `${teamName}: אין עדיין משחקים רשומים בליגת האלופות העונה.`;

  const results = played.map((m) => {
    const isHome = m.homeTeam.id === teamId;
    const gf = isHome ? m.score.total.home : m.score.total.away;
    const ga = isHome ? m.score.total.away : m.score.total.home;
    const opp = isHome ? m.awayTeam.internationalName : m.homeTeam.internationalName;
    const res = gf > ga ? 'W' : gf < ga ? 'L' : 'D';
    return `${res} ${gf}:${ga} מול ${opp}`;
  });

  return `${teamName} — 5 המשחקים האחרונים בליגת האלופות: ${results.join(', ')}.`;
}

function standingsLine(teamName, teamId, standings) {
  const rows = standings.flatMap((s) => s.items || []);
  const row = rows.find((r) => r.team?.id === teamId);
  if (!row) return `${teamName}: אין עדיין נתוני טבלה זמינים העונה.`;
  return `${teamName} — מקום ${row.rank} בטבלה, ${row.points} נק' (${row.played} משחקים, ${row.won} נצחונות, ${row.drawn} תיקו, ${row.lost} הפסדים, הפרש שערים ${row.goalDifference > 0 ? '+' : ''}${row.goalDifference}).`;
}

/**
 * Returns a Hebrew, plain-text block of real UEFA data for both teams,
 * or null if either team can't be resolved / no data is available yet
 * (e.g. the season hasn't started) — callers should fall back to the
 * "use your general knowledge" prompt in that case, never throw.
 */
export async function buildUefaContext(teamAName, teamBName) {
  try {
    const seasonYear = currentSeasonYear();
    const teams = await getTeams({ competitionId: COMPETITION_ID, seasonYear }, 100, 0);
    const teamA = resolveTeam(teams, teamAName);
    const teamB = resolveTeam(teams, teamBName);
    if (!teamA || !teamB) return null;

    const [allMatches, standings] = await Promise.all([
      getMatches({ competitionId: COMPETITION_ID, seasonYear }, undefined, 500, 0),
      getStandings({ competitionId: COMPETITION_ID, seasonYear }).catch(() => []),
    ]);

    const lines = [
      recentFormLine(teamAName, teamA.id, allMatches),
      recentFormLine(teamBName, teamB.id, allMatches),
      standingsLine(teamAName, teamA.id, standings),
      standingsLine(teamBName, teamB.id, standings),
    ];

    return lines.join('\n');
  } catch {
    // UEFA's backend is unofficial/undocumented — any failure here
    // (network, shape change, season not open yet) must never break
    // brief generation, just fall back to general-knowledge mode.
    return null;
  }
}

/**
 * Returns the 144 league-phase fixtures (36 teams x 8 matchdays) for the
 * current season, already shaped for AdminImportMatches.jsx's importer:
 * { MatchNumber, RoundNumber, DateUtc, Location, HomeTeam, AwayTeam }.
 * No logo URLs — team logos are managed manually via AdminLogos.jsx, not
 * pulled from UEFA. Empty array if the draw hasn't been published yet
 * (nothing with matchday.type === 'MATCHDAY' exists).
 */
export async function getLeaguePhaseFixtures() {
  const seasonYear = currentSeasonYear();
  const allMatches = await getMatches({ competitionId: COMPETITION_ID, seasonYear }, undefined, 500, 0);
  const leaguePhase = allMatches.filter((m) => m.matchday?.type === 'MATCHDAY');

  const perMatchday = {};
  return leaguePhase
    .sort((a, b) => new Date(a.kickOffTime?.dateTime) - new Date(b.kickOffTime?.dateTime))
    .map((m) => {
      const roundNumber = parseInt(m.matchday.sequenceNumber, 10);
      perMatchday[roundNumber] = (perMatchday[roundNumber] || 0) + 1;
      return {
        MatchNumber: perMatchday[roundNumber],
        RoundNumber: roundNumber,
        DateUtc: m.kickOffTime?.dateTime,
        Location: m.stadium?.translations?.name?.EN || '',
        HomeTeam: m.homeTeam.internationalName,
        AwayTeam: m.awayTeam.internationalName,
      };
    });
}
