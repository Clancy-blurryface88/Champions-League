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

        const { action, date, league, market } = await req.json();

        const predictionKey = Deno.env.get('FootballPrediction');
        if (!predictionKey) {
            return new Response(JSON.stringify({ error: 'FootballPrediction API key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const baseUrl = 'https://football-prediction-api.p.rapidapi.com';
        const headers = {
            'X-RapidAPI-Key': predictionKey,
            'X-RapidAPI-Host': 'football-prediction-api.p.rapidapi.com'
        };

        let endpoint = '';

        switch (action) {
            case 'get_predictions':
                endpoint = '/predictions';
                if (date) endpoint += `?date=${date}`;
                break;
                
            case 'get_predictions_by_league':
                if (!league) {
                    return new Response(JSON.stringify({ error: 'League required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/predictions?league=${encodeURIComponent(league)}`;
                break;
                
            case 'get_predictions_by_market':
                if (!market) {
                    return new Response(JSON.stringify({ error: 'Market type required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/predictions?market=${market}`;
                break;
                
            case 'get_today_predictions':
                const today = new Date().toISOString().split('T')[0];
                endpoint = `/predictions?date=${today}`;
                break;
                
            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
        }

        console.log(`Making FootballPrediction request to: ${baseUrl}${endpoint}`);
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('FootballPrediction API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            return new Response(JSON.stringify({ 
                error: `FootballPrediction API error: ${response.status}`,
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
            source: 'football_prediction'
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in footballPredictionApi:", error);
        return new Response(JSON.stringify({ 
            error: error.message,
            success: false
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});