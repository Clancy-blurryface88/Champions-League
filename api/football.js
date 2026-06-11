// Vercel Serverless Function — proxies football-data.org API
export default async function handler(req, res) {
  const { competition = 'WC', filter = 'LIVE' } = req.query;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing FOOTBALL_DATA_API_KEY' });
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    let url;
    if (filter === 'LIVE') {
      // Free tier doesn't update status in real-time — fetch today and infer live by time
      url = `https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${today}&dateTo=${today}`;
    } else if (filter === 'FINISHED') {
      url = `https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${today}&dateTo=${today}`;
    } else {
      // TODAY
      url = `https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${today}&dateTo=${today}`;
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
    let matches = data.matches || [];

    if (filter === 'LIVE') {
      const now = new Date();
      const MATCH_DURATION_MS = 110 * 60 * 1000;
      matches = matches
        .filter(m => {
          const start = new Date(m.utcDate);
          const isDone = ['FINISHED','AWARDED','CANCELLED','POSTPONED','SUSPENDED'].includes(m.status);
          const hasStarted = now >= start;
          const likelyPlaying = (now - start) < MATCH_DURATION_MS;
          return m.status === 'IN_PLAY' || m.status === 'PAUSED' || (!isDone && hasStarted && likelyPlaying);
        })
        .map(m => {
          if (m.status !== 'IN_PLAY' && m.status !== 'PAUSED') {
            const elapsed = Math.floor((new Date() - new Date(m.utcDate)) / 60000);
            return { ...m, status: 'IN_PLAY', minute: elapsed };
          }
          return m;
        });
    } else if (filter === 'FINISHED') {
      matches = matches.filter(m => m.status === 'FINISHED');
    }

    console.log(`[football API] returning ${matches.length} matches`);
    return res.status(200).json({ success: true, matches });

  } catch (err) {
    console.error(`[football API] exception: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
}
