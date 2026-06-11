// Vercel Serverless Function — proxies api-football.com via RapidAPI
export default async function handler(req, res) {
  const { filter = 'LIVE' } = req.query;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing RAPIDAPI_KEY' });
  }

  const HOST   = 'api-football-v1.p.rapidapi.com';
  const LEAGUE = 1;     // FIFA World Cup
  const SEASON = 2026;
  const today  = new Date().toISOString().split('T')[0];

  try {
    let url;
    if (filter === 'LIVE') {
      url = `https://${HOST}/v3/fixtures?live=all&league=${LEAGUE}&season=${SEASON}`;
    } else if (filter === 'FINISHED') {
      url = `https://${HOST}/v3/fixtures?date=${today}&league=${LEAGUE}&season=${SEASON}&status=FT-AET-PEN`;
    } else {
      // TODAY — all matches for today
      url = `https://${HOST}/v3/fixtures?date=${today}&league=${LEAGUE}&season=${SEASON}`;
    }

    console.log(`[football API] filter=${filter} url=${url}`);

    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': HOST,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[football API] error ${response.status}: ${text}`);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();

    // Transform api-football response → our internal format
    const matches = (data.response || []).map(item => ({
      id:      item.fixture.id,
      utcDate: item.fixture.date,
      status:  mapStatus(item.fixture.status.short),
      minute:  item.fixture.status.elapsed,
      homeTeam: {
        name:  item.teams.home.name,
        crest: item.teams.home.logo,
      },
      awayTeam: {
        name:  item.teams.away.name,
        crest: item.teams.away.logo,
      },
      score: {
        fullTime: {
          home: item.goals.home,
          away: item.goals.away,
        },
        halfTime: {
          home: item.score?.halftime?.home ?? null,
          away: item.score?.halftime?.away ?? null,
        },
      },
    }));

    console.log(`[football API] returned ${matches.length} matches`);
    return res.status(200).json({ success: true, matches });

  } catch (err) {
    console.error(`[football API] exception: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
}

function mapStatus(short) {
  if (['1H', '2H', 'ET', 'BT', 'P', 'INT', 'LIVE'].includes(short)) return 'IN_PLAY';
  if (short === 'HT') return 'PAUSED';
  if (['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(short)) return 'FINISHED';
  return 'TIMED';
}
