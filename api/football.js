// Vercel Serverless Function — proxies free-api-live-football-data via RapidAPI v2
export default async function handler(req, res) {
  const { filter = 'LIVE' } = req.query;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing RAPIDAPI_KEY' });
  }

  // Debug: log first/last 4 chars of key to verify correct key is loaded
  console.log(`[football API] key=${apiKey.slice(0,4)}...${apiKey.slice(-4)} len=${apiKey.length}`);

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

    // Extract matches array — try different possible response shapes
    const raw = data.response?.live
      || data.response?.matches
      || data.response
      || data.result
      || data.matches
      || [];

    const rawArray = Array.isArray(raw) ? raw : Object.values(raw);

    // Log first match structure to identify field names
    if (rawArray.length > 0) {
      console.log(`[football API] first match keys: ${Object.keys(rawArray[0]).join(', ')}`);
      console.log(`[football API] first match sample: ${JSON.stringify(rawArray[0]).slice(0, 400)}`);
    }

    const matches = rawArray.map(transformMatch).filter(Boolean);

    // Filter for FINISHED tab
    const result = filter === 'FINISHED'
      ? matches.filter(m => m.status === 'FINISHED')
      : matches;

    console.log(`[football API] returning ${result.length} matches`);

    // Include _debug on first call to help identify response shape
    return res.status(200).json({
      success: true,
      matches: result,
      _debug: { keys: Object.keys(data), rawLength: rawArray.length },
    });

  } catch (err) {
    console.error(`[football API] exception: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
}

function transformMatch(m) {
  if (!m) return null;

  // ── Shape A: api-football style (fixture/teams/goals) ──────────────────────
  if (m.fixture) {
    return {
      id:      m.fixture.id,
      utcDate: m.fixture.date,
      status:  mapStatusShort(m.fixture.status?.short),
      minute:  m.fixture.status?.elapsed ?? null,
      homeTeam: { name: m.teams?.home?.name, crest: m.teams?.home?.logo },
      awayTeam: { name: m.teams?.away?.name, crest: m.teams?.away?.logo },
      score: {
        fullTime: { home: m.goals?.home,              away: m.goals?.away },
        halfTime: { home: m.score?.halftime?.home ?? null, away: m.score?.halftime?.away ?? null },
      },
    };
  }

  // ── Shape B: match_hometeam_name style ─────────────────────────────────────
  const homeScore = m.match_hometeam_score !== '' && m.match_hometeam_score != null
    ? parseInt(m.match_hometeam_score) : null;
  const awayScore = m.match_awayteam_score !== '' && m.match_awayteam_score != null
    ? parseInt(m.match_awayteam_score) : null;

  return {
    id:      m.match_id || m.id,
    utcDate: m.match_date ? `${m.match_date}T${m.match_time || '00:00'}:00Z` : null,
    status:  mapStatusString(m.match_status || m.status),
    minute:  /^\d+$/.test(String(m.match_status)) ? parseInt(m.match_status) : (m.match_elapsed ?? null),
    homeTeam: {
      name:  m.match_hometeam_name  || m.homeTeam?.name,
      crest: m.team_home_badge      || m.homeTeam?.logo,
    },
    awayTeam: {
      name:  m.match_awayteam_name  || m.awayTeam?.name,
      crest: m.team_away_badge      || m.awayTeam?.logo,
    },
    score: {
      fullTime: { home: homeScore, away: awayScore },
      halfTime: { home: null,      away: null },
    },
  };
}

function mapStatusShort(s) {
  if (!s) return 'TIMED';
  if (['1H','2H','ET','BT','P','INT','LIVE'].includes(s)) return 'IN_PLAY';
  if (s === 'HT') return 'PAUSED';
  if (['FT','AET','PEN','AWD','WO'].includes(s)) return 'FINISHED';
  return 'TIMED';
}

function mapStatusString(s) {
  if (!s) return 'TIMED';
  const str = String(s).trim();
  if (/^\d+$/.test(str) && parseInt(str) > 0) return 'IN_PLAY';
  if (str === 'HT') return 'PAUSED';
  if (['FT','AET','Finished','FINISHED','FT_PEN'].includes(str)) return 'FINISHED';
  return 'TIMED';
}
