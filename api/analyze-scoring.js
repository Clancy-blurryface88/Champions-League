// Vercel Serverless Function — analyzes scoring table image with Claude Vision
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY' });
  }

  const { imageBase64, mediaType = 'image/jpeg' } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'Missing imageBase64' });
  }

  const prompt = `אתה מנתח טבלת ניקוד של ליגת ניחושים לכדורגל.
בתמונה יש טבלה עם ניחושים אפשריים והניקוד המתאים לכל אחד.

חלץ את הניקוד לכל קטגוריה והחזר JSON בלבד (ללא טקסט נוסף) בפורמט הבא:
{
  "exact_score_points": <מספר - ניחוש תוצאה מדויקת>,
  "home_win_points": <מספר - ניחוש ניצחון קבוצת הבית>,
  "away_win_points": <מספר - ניחוש ניצחון קבוצת האורחים>,
  "draw_points": <מספר - ניחוש תיקו>,
  "btts_yes_points": <מספר - ניחוש שתי הקבוצות ישערו>,
  "btts_no_points": <מספר - ניחוש שלא שתיהן ישערו>,
  "goals_0_2_points": <מספר - ניחוש 0-2 שערים כולל>,
  "goals_3_4_points": <מספר - ניחוש 3-4 שערים כולל>,
  "goals_5_plus_points": <מספר - ניחוש 5+ שערים כולל>,
  "other_points": <מספר - כל תוצאה שאין לה קטגוריה ספציפית>
}

אם קטגוריה לא מופיעה בטבלה — שים 0.
אם יש "אחר" או "other" — שים את הניקוד שלו ב-other_points.
החזר JSON בלבד, ללא markdown, ללא הסברים.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: 'Claude API error', details: err });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(422).json({ error: 'Could not parse JSON from response', raw: text });
    }

    const scoring = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ success: true, scoring });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
