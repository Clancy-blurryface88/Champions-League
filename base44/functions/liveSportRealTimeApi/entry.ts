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

        const { action, teamId, matchId, leagueId, playerId } = await req.json();

        const liveApiKey = Deno.env.get('LiveSportRealTime');
        if (!liveApiKey) {
            return new Response(JSON.stringify({ error: 'LiveSportRealTime API key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const baseUrl = 'https://livescore-real-time.p.rapidapi.com';
        const headers = {
            'X-RapidAPI-Key': liveApiKey,
            'X-RapidAPI-Host': 'livescore-real-time.p.rapidapi.com'
        };

        let endpoint = '';
        let data = null;

        switch (action) {
            case 'team_squad':
                if (!teamId) {
                    return new Response(JSON.stringify({ error: 'Team ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/teams/get-squad?id=${teamId}`;
                break;
                
            case 'live_matches':
                endpoint = '/matches/get-live';
                break;
                
            case 'match_details':
                if (!matchId) {
                    return new Response(JSON.stringify({ error: 'Match ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/matches/get-details?id=${matchId}`;
                break;
                
            case 'team_matches':
                if (!teamId) {
                    return new Response(JSON.stringify({ error: 'Team ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/teams/get-matches?id=${teamId}`;
                break;
                
            case 'league_matches':
                if (!leagueId) {
                    return new Response(JSON.stringify({ error: 'League ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/leagues/get-matches?id=${leagueId}`;
                break;
                
            case 'league_standings':
                if (!leagueId) {
                    return new Response(JSON.stringify({ error: 'League ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/leagues/get-standings?id=${leagueId}`;
                break;
                
            case 'player_details':
                if (!playerId) {
                    return new Response(JSON.stringify({ error: 'Player ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/players/get-details?id=${playerId}`;
                break;
                
            case 'team_details':
                if (!teamId) {
                    return new Response(JSON.stringify({ error: 'Team ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/teams/get-details?id=${teamId}`;
                break;
                
            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
        }

        console.log(`Making LiveSportRealTime request to: ${baseUrl}${endpoint}`);
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('LiveSportRealTime API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            return new Response(JSON.stringify({ 
                error: `LiveSportRealTime API error: ${response.status}`,
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
            source: 'live_sport_real_time'
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in liveSportRealTimeApi:", error);
        return new Response(JSON.stringify({ 
            error: error.message,
            success: false
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});