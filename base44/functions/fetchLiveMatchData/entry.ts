import { createClient } from 'npm:@base44/sdk@0.1.0';

const base44 = createClient({
    appId: Deno.env.get('BASE44_APP_ID'), 
});

Deno.serve(async (req) => {
    try {
        // בדיקת Authorization בלבד
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ error: 'Invalid token format' }), { 
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        base44.auth.setToken(token);

        // אם רוצים רק לוודא שהטוקן חוקי:
        const currentUser = await base44.auth.me();
        if (!currentUser) {
            return new Response(JSON.stringify({ error: 'Unauthorized user' }), { 
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const { league = 'champions-league' } = await req.json().catch(() => ({}));
        console.log(`Fetching live data for league: ${league}`);

        // Try Football-Data.org first
        const footballDataKey = Deno.env.get('footballdataORG');
        if (footballDataKey) {
            try {
                console.log('Trying Football-Data.org API...');
                
                const footballDataResponse = await fetch(
                    'https://api.football-data.org/v4/competitions/2001/matches?status=IN_PLAY,PAUSED',
                    {
                        method: 'GET',
                        headers: { 'X-Auth-Token': footballDataKey }
                    }
                );

                if (footballDataResponse.ok) {
                    const footballDataResult = await footballDataResponse.json();
                    const processedMatches = processFootballDataMatches(footballDataResult);

                    return new Response(JSON.stringify({ 
                        success: true,
                        source: 'Football-Data.org',
                        league: 'Champions League',
                        matches: processedMatches,
                        raw_data: footballDataResult
                    }), { status: 200, headers: { "Content-Type": "application/json" } });
                }
            } catch (footballDataError) {
                console.error('Football-Data.org error:', footballDataError);
            }
        }

        // Flashscores backup
        const flashscoresKey = Deno.env.get('Flashscores');
        if (flashscoresKey) {
            try {
                console.log('Trying Flashscores API...');
                const flashscoresResponse = await fetch(
                    'https://flashscore4.p.rapidapi.com/api/flashscore/v1/matche/live/1',
                    {
                        method: 'GET',
                        headers: {
                            'X-RapidAPI-Key': flashscoresKey,
                            'X-RapidAPI-Host': 'flashscore4.p.rapidapi.com'
                        }
                    }
                );

                if (flashscoresResponse.ok) {
                    const flashscoresData = await flashscoresResponse.json();
                    const processedMatches = processFlashscoresData(flashscoresData, league);

                    return new Response(JSON.stringify({ 
                        success: true,
                        source: 'Flashscores',
                        league: league,
                        matches: processedMatches,
                        raw_data: flashscoresData
                    }), { status: 200, headers: { "Content-Type": "application/json" } });
                }
            } catch (flashscoresError) {
                console.error('Flashscores error:', flashscoresError);
            }
        }

        // LiveSportRealTime final backup
        const liveSportKey = Deno.env.get('LiveSportRealTime');
        if (liveSportKey) {
            try {
                console.log('Trying LiveSportRealTime API...');
                const liveSportResponse = await fetch(
                    'https://live-sport-real-time1.p.rapidapi.com/football/matches/live',
                    {
                        method: 'GET',
                        headers: {
                            'X-RapidAPI-Key': liveSportKey,
                            'X-RapidAPI-Host': 'live-sport-real-time1.p.rapidapi.com'
                        }
                    }
                );

                if (liveSportResponse.ok) {
                    const liveSportData = await liveSportResponse.json();
                    const processedMatches = processLiveSportData(liveSportData, league);

                    return new Response(JSON.stringify({ 
                        success: true,
                        source: 'LiveSportRealTime',
                        league: league,
                        matches: processedMatches,
                        raw_data: liveSportData
                    }), { status: 200, headers: { "Content-Type": "application/json" } });
                }
            } catch (liveSportError) {
                console.error('LiveSportRealTime error:', liveSportError);
            }
        }

        // אם כולם נכשלו
        return new Response(JSON.stringify({ 
            success: false,
            error: 'No live data available from any source',
            league: league,
            attempted_sources: ['Football-Data.org', 'Flashscores', 'LiveSportRealTime']
        }), { status: 200, headers: { "Content-Type": "application/json" } });

    } catch (error) {
        console.error("Error in fetchLiveMatchData:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});

// --- פונקציות עיבוד נשארות ללא שינוי ---
function processFootballDataMatches(data) {
    const matches = [];
    try {
        const matchesArray = data.matches || [];
        for (const match of matchesArray) {
            matches.push({
                id: match.id,
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                homeScore: match.score.fullTime.home || match.score.halfTime.home || 0,
                awayScore: match.score.fullTime.away || match.score.halfTime.away || 0,
                status: match.status,
                minute: match.minute || null,
                league: 'Champions League',
                startTime: match.utcDate,
                competition: match.competition.name
            });
        }
    } catch (error) {
        console.error('Error processing Football-Data.org matches:', error);
    }
    return matches;
}

function processFlashscoresData(data, targetLeague) {
    const matches = [];
    try {
        const matchesArray = data.data || data.matches || data || [];
        for (const match of matchesArray) {
            if (isTargetLeague(match, targetLeague)) {
                matches.push({
                    id: match.id || match.match_id,
                    homeTeam: match.home_team || match.team_a || match.homeTeam?.name,
                    awayTeam: match.away_team || match.team_b || match.awayTeam?.name,
                    homeScore: match.home_score || match.score_a || 0,
                    awayScore: match.away_score || match.score_b || 0,
                    status: match.status || match.match_status,
                    minute: match.minute || match.current_minute,
                    league: match.league || match.tournament,
                    startTime: match.start_time || match.match_time
                });
            }
        }
    } catch (error) {
        console.error('Error processing Flashscores data:', error);
    }
    return matches;
}

function processLiveSportData(data, targetLeague) {
    const matches = [];
    try {
        const matchesArray = data.data || data.matches || data || [];
        for (const match of matchesArray) {
            if (isTargetLeague(match, targetLeague)) {
                matches.push({
                    id: match.id || match.match_id,
                    homeTeam: match.home_team || match.team_a,
                    awayTeam: match.away_team || match.team_b,
                    homeScore: match.home_score || match.score_a || 0,
                    awayScore: match.away_score || match.score_b || 0,
                    status: match.status,
                    minute: match.minute,
                    league: match.league,
                    startTime: match.start_time
                });
            }
        }
    } catch (error) {
        console.error('Error processing LiveSport data:', error);
    }
    return matches;
}

function isTargetLeague(match, targetLeague) {
    if (!match) return false;
    const leagueNames = [
        match.league,
        match.tournament,
        match.competition,
        match.league_name,
        match.tournament_name
    ].filter(Boolean).map(name => name.toLowerCase());

    if (targetLeague === 'champions-league') {
  const championsLeagueTerms = [
    'champions league',
    'uefa champions league',
    'ucl'
  ];
  return leagueNames.some(league =>
    championsLeagueTerms.some(term => league.includes(term))
  );
}
    return leagueNames.some(league => league.includes(targetLeague.toLowerCase()));
}
