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

  const prompt = `אתה מנתח טבלת אודס/ניקוד של ליגת ניחושים לכדורגל.
בתמונה יש טבלה עם תוצאות ספציפיות (למשל 1:0, 2:1, 0:0 וכו') ולכל תוצאה יש מספר (אודס/נקודות).
עמודה "1" = ניצחון קבוצת הבית, עמודה "X" = תיקו, עמודה "2" = ניצחון קבוצת האורחים.

חלץ את כל הזוגות תוצאה:ניקוד והחזר JSON בלבד בפורמט הבא:
{
  "1:0": 18.5,
  "2:0": 23.0,
  "0:0": 21.0,
  "other": 8.5
}

חוקים:
- המפתח הוא תמיד "home:away" (קבוצת בית נגד קבוצת חוץ)
- הערך הוא המספר (אודס/נקודות) שמופיע ליד התוצאה
- "Any other score" או "אחר" → מפתח "other"
- החזר JSON בלבד, ללא markdown, ללא הסברים.`;

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
