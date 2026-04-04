import { createClient } from 'npm:@base44/sdk@0.1.0';

const base44 = createClient({
    appId: Deno.env.get('BASE44_APP_ID'), 
});

Deno.serve(async (req) => {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response('Unauthorized', { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        base44.auth.setToken(token);
        
        const currentUser = await base44.auth.me();
        if (!currentUser) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { action, eventId, leagueId, teamId, date } = await req.json();

        const freeFootballKey = Deno.env.get('FreeFootballApi');
        if (!freeFootballKey) {
            return new Response(JSON.stringify({ error: 'FreeFootballApi key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const baseUrl = 'https://free-football-api-data.p.rapidapi.com';
        const headers = {
            'X-RapidAPI-Key': freeFootballKey,
            'X-RapidAPI-Host': 'free-football-api-data.p.rapidapi.com'
        };

        let endpoint = '';
        let data = null;

        switch (action) {
            case 'event_statistics':
                if (!eventId) {
                    return new Response(JSON.stringify({ error: 'Event ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/football-event-statistics?eventid=${eventId}`;
                break;
                
            case 'live_events':
                endpoint = '/football-live-events';
                break;
                
            case 'league_matches':
                if (!leagueId) {
                    return new Response(JSON.stringify({ error: 'League ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/football-league-matches?leagueid=${leagueId}`;
                break;
                
            case 'team_matches':
                if (!teamId) {
                    return new Response(JSON.stringify({ error: 'Team ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/football-team-matches?teamid=${teamId}`;
                break;
                
            case 'daily_matches':
                if (!date) {
                    return new Response(JSON.stringify({ error: 'Date required (YYYY-MM-DD format)' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/football-daily-matches?date=${date}`;
                break;
                
            case 'event_details':
                if (!eventId) {
                    return new Response(JSON.stringify({ error: 'Event ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/football-event-details?eventid=${eventId}`;
                break;
                
            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
        }

        console.log(`Making FreeFootballApi request to: ${baseUrl}${endpoint}`);
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('FreeFootballApi Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            return new Response(JSON.stringify({ 
                error: `FreeFootballApi error: ${response.status}`,
                details: errorText
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        data = await response.json();
        
        return new Response(JSON.stringify({ 
            success: true,
            data: data,
            action: action,
            source: 'free_football_api'
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in freeFootballApi:", error);
        return new Response(JSON.stringify({ 
            error: error.message,
            success: false
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});