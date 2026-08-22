// Vercel Serverless Function — real Champions League league-phase fixtures
// straight from UEFA (no API key needed), for AdminImportMatches.jsx.
import { getLeaguePhaseFixtures } from './_uefaContext.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  try {
    const fixtures = await getLeaguePhaseFixtures();
    return res.status(200).json({ success: true, fixtures });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
