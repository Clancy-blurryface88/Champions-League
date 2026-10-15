// Handler (mounted via GET /api/football?source=replay&date=YYYY-MM-DD — Hobby
// plan caps us at 12 functions) — the goal timeline of one Champions League
// night, for the admin "replay" view. For every CL fixture GOAL lists on that
// date: our DB match id, its kickoff, and each goal in order with the minute,
// half, scorer and the score after it — already turned to our team_a/team_b
// orientation. The client replays the night by scoring predictions against
// the score at each moment. A finished night never changes, so it's cached
// at the CDN for a day (GOAL's free plan is 1,000 requests/day).
import { goal, findOurMatch } from './_goalWebhook.js';

const CL_LEAGUE = 'cmr77dw3900f5rx06j05wgzv4';

function parseScore(s) {
  const m = String(s || '').match(/(\d+)\s*-\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

export async function replayHandler(req, res) {
  const { date } = req.query;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return res.status(400).json({ error: 'date=YYYY-MM-DD required' });
  try {
    const night = await goal(`/fixtures/date/${date}?leagueId=${CL_LEAGUE}&limit=100`);
    const fixtures = [];
    for (const fx of night) {
      const our = await findOurMatch(fx);
      if (!our) continue;
      const events = await goal(`/fixtures/${fx.id}/events`).catch(() => []);
      const goals = events
        .filter((e) => e.type === 'GOAL' && parseScore(e.score))
        .map((e) => {
          const [h, a] = parseScore(e.score);
          const homeSide = !!e.homeScorer;
          return {
            minute: Number(e.timeNum ?? parseInt(e.time, 10)) || 0,
            label: String(e.time || ''),
            secondHalf: /2nd/i.test(e.scoreInfoTime || '') || (Number(e.timeNum) > 45 && !/1st/i.test(e.scoreInfoTime || '')),
            scorer: e.homeScorer || e.awayScorer || '',
            // our orientation: a = matches.team_a
            a: our.swapped ? a : h,
            b: our.swapped ? h : a,
            side: (homeSide !== our.swapped) ? 'a' : 'b',
          };
        })
        .sort((x, y) => x.minute - y.minute || (x.a + x.b) - (y.a + y.b));
      const fh = Number(fx.homeTeamScore), fa = Number(fx.awayTeamScore);
      fixtures.push({
        matchId: our.match.id,
        status: fx.matchStatus,
        final: { a: our.swapped ? fa : fh, b: our.swapped ? fh : fa },
        goals,
      });
    }
    const done = fixtures.length > 0 && fixtures.every((f) => f.status === 'FINISHED');
    res.setHeader('Cache-Control', done ? 's-maxage=86400, stale-while-revalidate=604800' : 'no-store');
    return res.status(200).json({ date, done, fixtures });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
