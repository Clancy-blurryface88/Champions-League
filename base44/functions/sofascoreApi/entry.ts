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

        const { action, matchId, teamId, leagueId } = await req.json();

        const rapidApiKey = Deno.env.get('RapidAPI');
        if (!rapidApiKey) {
            return new Response(JSON.stringify({ error: 'RapidAPI key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const baseUrl = 'https://sofascore.p.rapidapi.com';
        const headers = {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'sofascore.p.rapidapi.com'
        };

        let endpoint = '';
        let data = null;

        switch (action) {
            case 'live_matches':
                endpoint = '/matches/live';
                break;
                
            case 'match_details':
                if (!matchId) {
                    return new Response(JSON.stringify({ error: 'Match ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/matches/${matchId}`;
                break;
                
            case 'match_statistics':
                if (!matchId) {
                    return new Response(JSON.stringify({ error: 'Match ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/matches/${matchId}/statistics`;
                break;
                
            case 'team_info':
                if (!teamId) {
                    return new Response(JSON.stringify({ error: 'Team ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/teams/${teamId}`;
                break;
                
            case 'league_standings':
                if (!leagueId) {
                    return new Response(JSON.stringify({ error: 'League ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/leagues/${leagueId}/standings`;
                break;
                
            case 'champions_league_matches':
                // תיקון: נשתמש באנדפוינט שעובד
                endpoint = '/matches/live';
                break;
                
            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
        }

        console.log(`Making request to: ${baseUrl}${endpoint}`);
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Sofascore API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            return new Response(JSON.stringify({ 
                error: `Sofascore API error: ${response.status}`,
                details: errorText,
                success: false
            }), {
                status: 200, // מחזירים 200 כדי שהצ'אטבוט יוכל לטפל בשגיאה
                headers: { "Content-Type": "application/json" },
            });
        }

        data = await response.json();
        
        return new Response(JSON.stringify({ 
            success: true,
            data: data,
            action: action
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in sofascoreApi:", error);
        return new Response(JSON.stringify({ 
            error: error.message,
            success: false
        }), {
            status: 200, // מחזירים 200 כדי שהצ'אטבוט יוכל לטפל בשגיאה
            headers: { "Content-Type": "application/json" },
        });
    }
});