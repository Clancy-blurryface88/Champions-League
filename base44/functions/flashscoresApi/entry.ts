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

        const { action, page = 1, matchId } = await req.json();

        const flashscoresKey = Deno.env.get('Flashscores');
        if (!flashscoresKey) {
            return new Response(JSON.stringify({ error: 'Flashscores API key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const baseUrl = 'https://flashscore4.p.rapidapi.com/api/flashscore/v1';
        const headers = {
            'X-RapidAPI-Key': flashscoresKey,
            'X-RapidAPI-Host': 'flashscore4.p.rapidapi.com'
        };

        let endpoint = '';
        let data = null;

        switch (action) {
            case 'live_matches':
                endpoint = `/matche/live/${page}`;
                break;
                
            case 'match_details':
                if (!matchId) {
                    return new Response(JSON.stringify({ error: 'Match ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/matche/detail/${matchId}`;
                break;
                
            case 'match_statistics':
                if (!matchId) {
                    return new Response(JSON.stringify({ error: 'Match ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/matche/statistics/${matchId}`;
                break;
                
            case 'today_matches':
                endpoint = '/matche/today';
                break;
                
            case 'yesterday_matches':
                endpoint = '/matche/yesterday';
                break;
                
            case 'tomorrow_matches':
                endpoint = '/matche/tomorrow';
                break;
                
            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
        }

        console.log(`Making Flashscores request to: ${baseUrl}${endpoint}`);
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Flashscores API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            return new Response(JSON.stringify({ 
                error: `Flashscores API error: ${response.status}`,
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
            source: 'flashscores'
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in flashscoresApi:", error);
        return new Response(JSON.stringify({ 
            error: error.message,
            success: false
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});