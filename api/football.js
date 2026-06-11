// Vercel Serverless Function — proxies free-api-live-football-data via RapidAPI v2
export default async function handler(req, res) {
  const { filter = 'LIVE' } = req.query;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing RAPIDAPI_KEY' });
  }

  const HOST  = 'free-api-live-football-data.p.rapidapi.com';
  const today = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD

  try {
    const url = filter === 'LIVE'
      ? `https://${HOST}/football-current-live`
      : `https://${HOST}/football-get-matches-by-date?date=${today}`;

    console.log(`[football API] filter=${filter} url=${url}`);

    const response = await fetch(url, {
      headers: {
        'x-rapidapi-key':  apiKey,
        'x-rapidapi-host': HOST,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[football API] error ${response.status}: ${text}`);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();

    const raw = data.response?.live
      || data.response?.matches
      || data.response
      || data.result
      || data.matches
      || [];

    const rawArray = Array.isArray(raw) ? raw : Object.values(raw);

    const todayUTC = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const allMatches = rawArray
      .map(transformMatch)
      .filter(Boolean)
      // API returns full tournament — keep only today's matches
      .filter(m => m.utcDate && m.utcDate.startsWith(todayUTC));

    let result = allMatches;
    if (filter === 'FINISHED') result = allMatches.filter(m => m.status === 'FINISHED');
    if (filter === 'LIVE')     result = allMatches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');

    console.log(`[football API] returning ${result.length} of ${rawArray.length} total matches`);
    return res.status(200).json({ success: true, matches: result });

  } catch (err) {
    console.error(`[football API] exception: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
}

// Structure: { id, home: { name, score }, away: { name, score }, statusId, status: { utcTime, liveTime } }
function transformMatch(m) {
  if (!m || !m.home || !m.away) return null;

  const homeScore = m.home.score != null ? m.home.score : null;
  const awayScore = m.away.score != null ? m.away.score : null;
  const minute    = m.status?.liveTime?.short
    ? parseInt(m.status.liveTime.short)
    : null;

  return {
    id:      m.id,
    utcDate: m.status?.utcTime || null,
    status:  mapStatusId(m.statusId),
    minute,
    homeTeam: { name: m.home.name || m.home.longName, crest: null },
    awayTeam: { name: m.away.name || m.away.longName, crest: null },
    score: {
      fullTime: { home: homeScore, away: awayScore },
      halfTime: { home: null, away: null },
    },
  };
}

// statusId values from free-api-live-football-data
function mapStatusId(id) {
  switch (id) {
    case 2:  return 'IN_PLAY';  // First half
    case 3:  return 'PAUSED';   // Half time
    case 4:  return 'IN_PLAY';  // Second half
    case 5:  return 'IN_PLAY';  // Extra time
    case 6:  return 'FINISHED'; // Full time
    case 7:  return 'FINISHED'; // AET
    case 8:  return 'FINISHED'; // Penalties
    default: return 'TIMED';    // Not started / other
  }
}
