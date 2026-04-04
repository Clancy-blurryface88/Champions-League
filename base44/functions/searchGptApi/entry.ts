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

        const { action, query, question, model = 'gpt-4o' } = await req.json();

        const searchGptKey = Deno.env.get('SearchGpt');
        if (!searchGptKey) {
            return new Response(JSON.stringify({ error: 'SearchGpt API key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const baseUrl = 'https://search-gpt.p.rapidapi.com/';
        const headers = {
            'X-RapidAPI-Key': searchGptKey,
            'X-RapidAPI-Host': 'search-gpt.p.rapidapi.com',
            'Content-Type': 'application/json'
        };

        let requestBody = {};
        let userContent = '';

        switch (action) {
            case 'search_football':
                userContent = `חפש מידע עדכני על כדורגל: ${query || question}. אנא תן תשובה מפורטת בעברית עם נתונים מעודכנים.`;
                break;
                
            case 'live_search': 
                userContent = `מה קורה עכשיו בכדורגל? ${query || question}. תן לי עדכון מהיר ומדויק בעברית.`;
                break;
                
            case 'analyze_match':
                userContent = `נתח את המשחק/קבוצה: ${query || question}. אני רוצה אנליזה מקצועית מפורטת בעברית.`;
                break;
                
            case 'player_insights':
                userContent = `תן לי מידע מפורט על השחקן: ${query || question}. כלול סטטיסטיקות, פורמה, חדשות ועדכונים בעברית.`;
                break;
                
            case 'team_analysis':
                userContent = `נתח את הקבוצה: ${query || question}. אני רוצה מידע על ביצועים, הרכב, פורמה אחרונה ועדכונים בעברית.`;
                break;
                
            case 'prediction_analysis':
                userContent = `תן לי תחזית מקצועית למשחק: ${query || question}. כלול אנליזה, סיכויים והמלצות בעברית.`;
                break;
                
            case 'champions_league_update':
                userContent = `מה החדשות בליגת האלופות? ${query || question}. תן לי עדכון מקיף ומעודכן בעברית.`;
                break;
                
            case 'transfer_news':
                userContent = `מה החדשות על העברות בכדורגל? ${query || question}. תן לי עדכון על השמועות והעסקאות בעברית.`;
                break;
                
            default:
                userContent = `${query || question} - אנא תן תשובה מפורטת ומעודכנת בעברית על נושא הכדורגל.`;
                break;
        }

        requestBody = {
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'אתה מומחה כדורגל מקצועי עם גישה למידע עדכני מהאינטרנט. ענה תמיד בעברית בצורה מדויקת ומפורטת. השתמש במידע העדכני ביותר שאתה יכול למצוא.'
                },
                {
                    role: 'user',
                    content: userContent
                }
            ]
        };

        console.log(`Making SearchGPT request with query: ${userContent}`);
        
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('SearchGPT API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            return new Response(JSON.stringify({ 
                error: `SearchGPT API error: ${response.status}`,
                details: errorText
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await response.json();
        
        // הוצא את התוכן מהתשובה
        let content = '';
        if (data.choices && data.choices[0] && data.choices[0].message) {
            content = data.choices[0].message.content;
        } else if (data.content) {
            content = data.content;
        } else {
            content = JSON.stringify(data);
        }
        
        return new Response(JSON.stringify({ 
            success: true,
            data: {
                content: content,
                raw_response: data,
                source: 'search_gpt',
                action: action
            },
            action: action,
            source: 'search_gpt'
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in searchGptApi:", error);
        return new Response(JSON.stringify({ 
            error: error.message,
            success: false
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});