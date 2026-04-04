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

        const { action, sportId, leagueId, matchId } = await req.json();

        const liveEventsKey = Deno.env.get('LiveEvents');
        if (!liveEventsKey) {
            return new Response(JSON.stringify({ error: 'LiveEvents API key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const baseUrl = 'https://live-sports-data-events-api.p.rapidapi.com';
        const headers = {
            'X-RapidAPI-Key': liveEventsKey,
            'X-RapidAPI-Host': 'live-sports-data-events-api.p.rapidapi.com',
            'Content-Type': 'application/json'
        };

        let endpoint = '/tracker';
        let requestBody = {};
        let method = 'POST';

        switch (action) {
            case 'get_sports':
                requestBody = { opName: 'GetSports' };
                break;
                
            case 'get_leagues':
                if (!sportId) {
                    return new Response(JSON.stringify({ error: 'Sport ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                requestBody = { 
                    opName: 'GetLeagues',
                    variables: { sportId: sportId }
                };
                break;
                
            case 'get_live_matches':
                requestBody = { 
                    opName: 'GetLiveMatches',
                    variables: { sportId: sportId || 1 } // Default to football
                };
                break;
                
            case 'get_match_details':
                if (!matchId) {
                    return new Response(JSON.stringify({ error: 'Match ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                requestBody = { 
                    opName: 'GetMatchDetails',
                    variables: { matchId: matchId }
                };
                break;
                
            case 'get_league_matches':
                if (!leagueId) {
                    return new Response(JSON.stringify({ error: 'League ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                requestBody = { 
                    opName: 'GetLeagueMatches',
                    variables: { leagueId: leagueId }
                };
                break;
                
            case 'get_match_statistics':
                if (!matchId) {
                    return new Response(JSON.stringify({ error: 'Match ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                requestBody = { 
                    opName: 'GetMatchStatistics',
                    variables: { matchId: matchId }
                };
                break;
                
            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
        }

        console.log(`Making LiveEvents request to: ${baseUrl}${endpoint}`);
        console.log('Request body:', JSON.stringify(requestBody));
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: method,
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('LiveEvents API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            return new Response(JSON.stringify({ 
                error: `LiveEvents API error: ${response.status}`,
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
            source: 'live_events'
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in liveEventsApi:", error);
        return new Response(JSON.stringify({ 
            error: error.message,
            success: false
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});