// Shared helper (not a route — Vercel skips files prefixed with "_").
// Pulls real recent-form + standings data for two teams directly from
// UEFA's own backend (uefa-api package, no key required) so the AI brief
// can be grounded in real numbers instead of Claude's general knowledge.
import { getTeams, getMatches, getStandings, getLivescore, getMatch, getMatchEvents, getLineups } from 'uefa-api';

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

function toFootballDataStatus(m) {
  if (m.status === 'LIVE') return m.phase === 'HALF_TIME_BREAK' ? 'PAUSED' : 'IN_PLAY';
  if (m.status === 'FINISHED') return 'FINISHED';
  return 'SCHEDULED';
}

// Reshapes one UEFA match object to look exactly like football-data.org's
// match shape (homeTeam.name/crest, score.fullTime, status, minute, goals[])
// — shared by getUefaLiveMatches and getUefaMatchesByDate so both fallbacks
// hand components the same drop-in shape.
const CARD_AND_SUB_TYPES = ['YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION'];

async function reshapeUefaMatch(m) {
  let goals = [];
  let events = []; // cards + substitutions — goals stay in `goals` above for backward compat
  if (m.status === 'LIVE' || m.status === 'FINISHED') {
    try {
      const rawEvents = await getMatchEvents(m.id);
      goals = rawEvents
        .filter((e) => e.type === 'GOAL')
        .map((e) => ({
          minute: e.time?.minute ?? null,
          injuryTime: e.time?.injuryMinute || undefined,
          team: { id: e.primaryActor?.team?.id },
          scorer: {
            name: e.primaryActor?.person?.internationalName || null,
            shortName: e.primaryActor?.person?.internationalName || null,
          },
        }));
      events = rawEvents
        .filter((e) => CARD_AND_SUB_TYPES.includes(e.type))
        .map((e) => ({
          type: e.type,
          minute: e.time?.minute ?? null,
          injuryTime: e.time?.injuryMinute || undefined,
          team: { id: e.primaryActor?.team?.id },
          player: e.primaryActor?.person?.internationalName || null,
          playerIn: e.secondaryActor?.person?.internationalName || null, // substitutions only
        }));
    } catch {
      // Event feed failing shouldn't hide the score itself.
    }
  }

  return {
    id: m.id,
    utcDate: m.kickOffTime?.dateTime,
    status: toFootballDataStatus(m),
    minute: m.minute?.normal ?? null,
    homeTeam: {
      id: m.homeTeam.id,
      name: m.homeTeam.translations?.displayOfficialName?.EN || m.homeTeam.internationalName,
      shortName: m.homeTeam.internationalName,
      crest: m.homeTeam.logoUrl,
    },
    awayTeam: {
      id: m.awayTeam.id,
      name: m.awayTeam.translations?.displayOfficialName?.EN || m.awayTeam.internationalName,
      shortName: m.awayTeam.internationalName,
      crest: m.awayTeam.logoUrl,
    },
    score: {
      fullTime: {
        home: m.score?.total?.home ?? null,
        away: m.score?.total?.away ?? null,
      },
    },
    goals,
    events,
  };
}

/**
 * Live/near-live UEFA Champions League matches, reshaped to look exactly
 * like football-data.org's match objects so it's a drop-in fallback for
 * /api/football — no changes needed in any component that already consumes
 * that shape.
 *
 * getLivescore() itself covers ALL UEFA competitions and doesn't say which
 * one each match belongs to, so each live match is cross-checked against
 * its full detail (getMatch) and non-Champions-League ones are dropped.
 */
export async function getUefaLiveMatches() {
  const live = await getLivescore();
  if (live.length === 0) return [];

  const full = await Promise.all(live.map((l) => getMatch(l.id).catch(() => null)));
  const clMatches = full.filter((m) => m && String(m.competition?.id) === String(COMPETITION_ID));

  return Promise.all(clMatches.map(reshapeUefaMatch));
}

/**
 * UEFA Champions League matches (any status — scheduled/live/finished) whose
 * kickoff falls within an inclusive UTC date range ('YYYY-MM-DD' strings),
 * reshaped like getUefaLiveMatches. This is the same no-key UEFA fallback
 * extended to cover /api/football's TODAY and FINISHED views, not just LIVE
 * — those used to hard-fail with "Missing FOOTBALL_DATA_API_KEY" instead of
 * falling back like the LIVE view already did.
 */
export async function getUefaMatchesByDate(dateFrom, dateTo, filter) {
  const seasonYear = currentSeasonYear();
  const allMatches = await getMatches({ competitionId: COMPETITION_ID, seasonYear }, undefined, 500, 0);
  const inRange = allMatches.filter((m) => {
    const day = (m.kickOffTime?.dateTime || '').slice(0, 10);
    return day >= dateFrom && day <= dateTo;
  });
  const filtered = filter === 'FINISHED' ? inRange.filter((m) => m.status === 'FINISHED') : inRange;
  return Promise.all(filtered.map(reshapeUefaMatch));
}

/**
 * UEFA's official league-phase standings, flattened to one array
 * (no group/round nesting — the league phase is a single 36-team table
 * anyway) for AdminStandingsCheck.jsx to compare against the table this
 * app computes itself from admin-entered results.
 */
export async function getOfficialStandings() {
  const seasonYear = currentSeasonYear();
  const standings = await getStandings({ competitionId: COMPETITION_ID, seasonYear });
  return standings
    .flatMap((s) => s.items || [])
    .map((row) => ({
      name: row.team?.internationalName,
      officialName: row.team?.translations?.displayOfficialName?.EN,
      rank: row.rank,
      points: row.points,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      gf: row.goalsFor,
      ga: row.goalsAgainst,
      gd: row.goalDifference,
    }))
    .sort((a, b) => a.rank - b.rank);
}

/**
 * Official starting lineups for one of our matches, resolved by team name
 * (our `matches` table has no stored UEFA match id) against the current
 * season's full match list, using the same tolerant name matching as
 * resolveTeam/findOfficial elsewhere in this file. Returns null — never
 * throws — when the match can't be resolved, or when UEFA hasn't published
 * the lineup yet (lineupStatus !== 'AVAILABLE', which is normal until
 * roughly 45-60 minutes before kickoff).
 */
export async function getLineupsForMatch(homeTeamName, awayTeamName) {
  try {
    const seasonYear = currentSeasonYear();
    const allMatches = await getMatches({ competitionId: COMPETITION_ID, seasonYear }, undefined, 500, 0);
    const found = allMatches.find(
      (m) => teamNames(m.homeTeam).some((x) => matchesName(homeTeamName, x))
          && teamNames(m.awayTeam).some((x) => matchesName(awayTeamName, x))
    );
    if (!found) return null;

    const lineups = await getLineups(found.id);
    return lineups?.lineupStatus === 'AVAILABLE' ? lineups : null;
  } catch {
    return null;
  }
}

function matchesName(wanted, candidate) {
  const w = wanted.trim().toLowerCase();
  return candidate === w || candidate.startsWith(w) || w.startsWith(candidate) || candidate.includes(w);
}

/**
 * Most recently FINISHED Champions League matches (any phase — qualifying
 * included), newest first — so AdminLiveMatchExplorer.jsx has real match
 * ids to test lineups/events against even when nothing is live right now.
 */
export async function getRecentFinishedMatches(limit = 12) {
  const seasonYear = currentSeasonYear();
  const allMatches = await getMatches({ competitionId: COMPETITION_ID, seasonYear }, undefined, 500, 0);
  return allMatches
    .filter((m) => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.kickOffTime?.dateTime) - new Date(a.kickOffTime?.dateTime))
    .slice(0, limit)
    .map((m) => ({
      id: m.id,
      utcDate: m.kickOffTime?.dateTime,
      homeTeam: m.homeTeam.internationalName,
      awayTeam: m.awayTeam.internationalName,
      score: { home: m.score?.total?.home ?? null, away: m.score?.total?.away ?? null },
    }));
}
