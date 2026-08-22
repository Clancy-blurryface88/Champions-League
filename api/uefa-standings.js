// Vercel Serverless Function — UEFA's official league-phase standings
// (no API key needed), for AdminStandingsCheck.jsx.
import { getOfficialStandings } from './_uefaContext.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  try {
    const standings = await getOfficialStandings();
    return res.status(200).json({ success: true, standings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
