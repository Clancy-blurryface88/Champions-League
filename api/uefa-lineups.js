// Vercel Serverless Function — official starting lineups for one match,
// resolved by team name (no key needed), for MatchLineups.jsx.
import { getLineupsForMatch } from './_uefaContext.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate');

  const { homeTeam, awayTeam } = req.query;
  if (!homeTeam || !awayTeam) {
    return res.status(400).json({ success: false, error: 'homeTeam and awayTeam required' });
  }

  try {
    const lineups = await getLineupsForMatch(homeTeam, awayTeam);
    return res.status(200).json({ success: true, lineups });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
