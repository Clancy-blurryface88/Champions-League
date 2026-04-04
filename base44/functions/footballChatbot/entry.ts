Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        const { question } = await req.json();

        if (!question || !question.trim()) {
            return new Response(JSON.stringify({ 
                error: 'שאלה חסרה' 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Check if API key exists
        const apiKey = Deno.env.get('OPENAI_API_KEY');
        if (!apiKey) {
            console.error('OPENAI_API_KEY not found in environment');
            return new Response(JSON.stringify({ 
                error: 'מפתח API לא מוגדר' 
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        console.log('API key exists, making request to OpenAI...');
        console.log('API key starts with:', apiKey.substring(0, 10) + '...');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // נשנה זמנית למודל זול יותר לבדיקה
                messages: [
                    {
                        role: 'system',
                        content: `אתה מומחה כדורגל לליגת האלופות. ענה בעברית בצורה קצרה ועניינית.`
                    },
                    {
                        role: 'user',
                        content: question.trim()
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        console.log('OpenAI response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI API Error Details:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            if (response.status === 401) {
                return new Response(JSON.stringify({ 
                    error: 'מפתח API לא תקין או פג תוקף' 
                }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
            
            if (response.status === 403) {
                return new Response(JSON.stringify({ 
                    error: 'אין הרשאה לגישה לשירות - בדוק את חשבון OpenAI שלך (קרדיטים/הרשאות)' 
                }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
            
            return new Response(JSON.stringify({ 
                error: `שגיאה בקריאה לשירות: ${response.status} - ${errorText}` 
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await response.json();
        console.log('OpenAI response received successfully');
        
        const answer = data.choices[0].message.content;

        return new Response(JSON.stringify({ 
            answer: answer,
            success: true
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Detailed error:", error.message, error.stack);
        
        return new Response(JSON.stringify({ 
            error: `שגיאה פנימית: ${error.message}` 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});