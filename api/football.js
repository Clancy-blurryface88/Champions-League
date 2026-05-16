// Vercel Serverless Function — proxies football-data.org API
export default async function handler(req, res) {
  const { competition = 'WC', filter = 'LIVE' } = req.query;

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  try {
    let url;
    if (filter === 'TODAY') {
      const today = new Date().toISOString().split('T')[0];
      url = `https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${today}&dateTo=${today}`;
    } else {
      url = `https://api.football-data.org/v4/competitions/${competition}/matches?status=${filter}`;
    }

    const response = await fetch(url, {
      headers: { 'X-Auth-Token': apiKey },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, matches: data.matches || [] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
