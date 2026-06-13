// Vercel Serverless Function — proxies Sofascore via RapidAPI
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing RAPIDAPI_KEY on server' });
  }

  const { action, matchId, tournamentId, seasonId, page } = req.query;

  const BASE = 'https://sofascore.p.rapidapi.com';
  const headers = {
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'sofascore.p.rapidapi.com',
  };

  let url = '';

  switch (action) {
    case 'h2h':
      if (!matchId) return res.status(400).json({ error: 'matchId required' });
      url = `${BASE}/matches/get-h2h?matchId=${matchId}`;
      break;

    case 'h2h_events':
      if (!matchId) return res.status(400).json({ error: 'matchId required' });
      url = `${BASE}/matches/get-h2h-events?matchId=${matchId}`;
      break;

    case 'tournament_matches':
      if (!tournamentId || !seasonId) return res.status(400).json({ error: 'tournamentId and seasonId required' });
      url = `${BASE}/tournaments/get-matches?tournamentId=${tournamentId}&seasonId=${seasonId}${page ? `&page=${page}` : ''}`;
      break;

    case 'tournament_seasons':
      if (!tournamentId) return res.status(400).json({ error: 'tournamentId required' });
      url = `${BASE}/tournaments/get-seasons?tournamentId=${tournamentId}`;
      break;

    default:
      return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({ success: false, status: response.status, error: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
