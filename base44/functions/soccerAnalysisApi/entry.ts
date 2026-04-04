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

        const { action, matchId, teamName, oddType = 'yp' } = await req.json();

        const soccerAnalysisKey = Deno.env.get('SoccerAnalysis');
        if (!soccerAnalysisKey) {
            return new Response(JSON.stringify({ error: 'SoccerAnalysis API key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const baseUrl = 'https://soccer-analysis2.p.rapidapi.com/api';
        const headers = {
            'X-RapidAPI-Key': soccerAnalysisKey,
            'X-RapidAPI-Host': 'soccer-analysis2.p.rapidapi.com'
        };

        let endpoint = '';

        switch (action) {
            case 'match_analysis':
                if (!matchId || !teamName) {
                    return new Response(JSON.stringify({ error: 'Match ID and team name required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/ragOfMatch?matchId=${matchId}&teamName=${encodeURIComponent(teamName)}&oddtype=${oddType}`;
                break;
                
            case 'team_performance':
                if (!teamName) {
                    return new Response(JSON.stringify({ error: 'Team name required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/teamPerformance?teamName=${encodeURIComponent(teamName)}`;
                break;
                
            case 'match_odds':
                if (!matchId) {
                    return new Response(JSON.stringify({ error: 'Match ID required' }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                endpoint = `/matchOdds?matchId=${matchId}`;
                break;
                
            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
        }

        console.log(`Making SoccerAnalysis request to: ${baseUrl}${endpoint}`);
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('SoccerAnalysis API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            return new Response(JSON.stringify({ 
                error: `SoccerAnalysis API error: ${response.status}`,
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
            source: 'soccer_analysis'
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in soccerAnalysisApi:", error);
        return new Response(JSON.stringify({ 
            error: error.message,
            success: false
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});