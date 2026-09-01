// Vercel Serverless Function — analyzes an outright-winner odds screenshot
// (team name + decimal odds per row) with Claude Vision. Sibling of
// analyze-scoring.js, but extracts {team_name: odds} instead of {"h:a": odds}
// — used for general (pre-tournament) prediction questions like "who wins
// the tournament", not per-match correct-score odds.
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

  const prompt = `אתה מנתח טבלת יחסי הימורים (odds) לזכייה בטורניר כדורגל.
בתמונה יש רשימה של קבוצות, ולכל קבוצה יש מספר (יחס עשרוני).

חלץ את כל הזוגות קבוצה:יחס והחזר JSON בלבד בפורמט הבא:
{
  "Paris Saint-Germain": 6.00,
  "FC Barcelona": 6.50,
  "Bayern Munich": 7.00
}

חוקים:
- המפתח הוא שם הקבוצה בדיוק כפי שהוא מופיע בתמונה (באנגלית, אל תתרגם ואל תנרמל)
- הערך הוא המספר (יחס) שמופיע ליד הקבוצה
- כלול את כל הקבוצות שמופיעות בתמונה
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
        max_tokens: 2048,
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

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(422).json({ error: 'Could not parse JSON from response', raw: text });
    }

    const odds = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ success: true, odds });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
