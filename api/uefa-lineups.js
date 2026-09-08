// Vercel Serverless Function — official starting lineups for one match,
// resolved by team name (no key needed), for MatchLineups.jsx. Called with
// no query params at all, it instead lists every match with a published
// lineup right now (handy for manual testing — e.g. in Postman — without
// knowing which match already has one out).
import { getLineupsForMatch, getAllPublishedLineups } from './_uefaContext.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  const { homeTeam, awayTeam } = req.query;

  try {
    if (!homeTeam && !awayTeam) {
      const lineups = await getAllPublishedLineups();
      return res.status(200).json({ success: true, count: lineups.length, matches: lineups });
    }
    if (!homeTeam || !awayTeam) {
      return res.status(400).json({ success: false, error: 'Provide both homeTeam and awayTeam, or neither to list every currently published lineup' });
    }
    const lineups = await getLineupsForMatch(homeTeam, awayTeam);
    return res.status(200).json({ success: true, lineups });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
