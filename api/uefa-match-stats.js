// Vercel Serverless Function — curated match statistics (shots, corners,
// cards, fouls...) for one match, resolved by team name (no key needed),
// for the "i" info toggle on live match cards.
import { getMatchStatsForMatch } from './_uefaContext.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');

  const { homeTeam, awayTeam } = req.query;
  if (!homeTeam || !awayTeam) {
    return res.status(400).json({ success: false, error: 'homeTeam and awayTeam required' });
  }

  try {
    const stats = await getMatchStatsForMatch(homeTeam, awayTeam);
    return res.status(200).json({ success: true, stats });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
