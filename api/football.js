// Vercel Serverless Function — proxies football-data.org API
export default async function handler(req, res) {
  const { competition = 'WC', filter = 'LIVE' } = req.query;

  // Prevent Vercel/CDN from caching live data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  try {
    let url;
    if (filter === 'TODAY') {
      const today = new Date().toISOString().split('T')[0];
      url = `https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${today}&dateTo=${today}`;
    } else if (filter === 'LIVE') {
      // Fetch both IN_PLAY and PAUSED explicitly — free tier sometimes misses the LIVE shorthand
      url = `https://api.football-data.org/v4/competitions/${competition}/matches?status=IN_PLAY,PAUSED`;
    } else {
      url = `https://api.football-data.org/v4/competitions/${competition}/matches?status=${filter}`;
    }

    console.log(`[football API] filter=${filter} url=${url}`);

    const response = await fetch(url, {
      headers: { 'X-Auth-Token': apiKey },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[football API] error ${response.status}: ${text}`);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    console.log(`[football API] returned ${data.matches?.length ?? 0} matches`);
    return res.status(200).json({ success: true, matches: data.matches || [] });
  } catch (err) {
    console.error(`[football API] exception: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
}
