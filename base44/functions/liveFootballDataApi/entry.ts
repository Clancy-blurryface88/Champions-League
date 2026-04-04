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

        const { action, search, playerId, teamId, leagueId } = await req.json();

        const liveDataKey = Deno.env.get('LiveFootballDataApi');
        if (!liveDataKey) {
            return new Response(JSON.stringify({ error: 'LiveFootballDataApi key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const baseUrl = 'https://free-api-live-football-data.p.rapidapi.com';
        const headers = {
            'X-RapidAPI-Key': liveDataKey,
            'X-RapidAPI-Host': 'free-api-live-football-data.p.rapidapi.com'
        };

        let endpoint = '';

        switch (action) {
            case 'search_players':
                if (!search) {
                    return new Response(JSON.stringify({ error: 'Search term required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/football-players-search?search=${encodeURIComponent(search)}`;
                break;
                
            case 'player_details':
                if (!playerId) {
                    return new Response(JSON.stringify({ error: 'Player ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/football-player-details?playerId=${playerId}`;
                break;
                
            case 'team_details':
                if (!teamId) {
                    return new Response(JSON.stringify({ error: 'Team ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/football-team-details?teamId=${teamId}`;
                break;
                
            case 'league_standings':
                if (!leagueId) {
                    return new Response(JSON.stringify({ error: 'League ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/football-league-standings?leagueId=${leagueId}`;
                break;
                
            case 'live_matches':
                endpoint = '/football-live-matches';
                break;
                
            case 'top_players':
                endpoint = '/football-top-players';
                break;
                
            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
        }

        console.log(`Making LiveFootballDataApi request to: ${baseUrl}${endpoint}`);
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('LiveFootballDataApi Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            return new Response(JSON.stringify({ 
                error: `LiveFootballDataApi error: ${response.status}`,
                details: errorText
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await response.json();
        
        return new Response(JSON.stringify({ 
            success: true,
            data: data,
            action: action,
            source: 'live_football_data'
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in liveFootballDataApi:", error);
        return new Response(JSON.stringify({ 
            error: error.message,
            success: false
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});