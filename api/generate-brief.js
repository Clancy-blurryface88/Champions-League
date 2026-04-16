import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `אתה אנליסט כדורגל חד שכותב סיכומי טרום משחק לגביע העולם 2026.
הסגנון שלך: סוחף, דעתני, שיחתי — כמו וואטסאפ קבוצתי של חברים שמבינים כדורגל, לא עיתון.

כללים מחייבים:
- כתוב בעברית תקנית ונכונה בלבד.
- אפס Markdown. ללא כוכביות, הדגשות, כותרות, מקפים כרשימה. פרוזה זורמת בלבד.
- היה דעתני — קח עמדה ותמוך בה.
- עד 220 מילה.
- אל תמציא נתונים סטטיסטיים ספציפיים שאינך בטוח בהם. אם אינך בטוח, נסח כהתרשמות כללית.

מבנה הסיכום (פרוזה רציפה, ללא כותרות):
1. פתיחה מסעירה — מה עומד על הכף, מה האווירה סביב המשחק הזה
2. רקע על שתי הנבחרות — כוחות, חולשות, סגנון
3. היסטוריה ראש בראש — אם נפגשו: מתי ומה היה. אם לא: אמור זאת ומה זה אומר
4. שחקן מפתח מכל צד — מי יכול לשנות את התמונה
5. תחזית: אחוזי ניצחון (בית / תיקו / חוץ) + תוצאה משוערת + המלצה אחת חדה`;

function buildPrompt(match) {
  const loc = match.location ? ` | ${match.location}` : '';
  let dateLabel = match.match_date || '';
  try {
    const dt = new Date(match.match_date);
    dateLabel = dt.toLocaleDateString('he-IL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
    }) + ' UTC';
  } catch {}
  return `כתוב סיכום טרום משחק עבור:\n\n${match.team_a} נגד ${match.team_b} | ${match.league || 'שלב הבתים'} | ${dateLabel}${loc}\n\nהשתמש בידע שלך על שתי הנבחרות לפי המבנה שתואר.`;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { match_id } = req.body || {};
  if (!match_id) return res.status(400).json({ error: 'Missing match_id' });

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  );

  // אם הברייף כבר קיים — מחזירים אותו
  const { data: existing } = await supabase
    .from('ai_briefs')
    .select('brief_he, generated_at')
    .eq('match_id', match_id)
    .maybeSingle();

  if (existing) return res.status(200).json({ brief: existing, cached: true });

  // שולפים את פרטי המשחק
  const { data: match, error: matchErr } = await supabase
    .from('matches')
    .select('id, team_a, team_b, match_date, league, location')
    .eq('id', match_id)
    .single();

  if (matchErr || !match) return res.status(404).json({ error: 'Match not found' });

  // מייצרים ברייף עם Claude
  const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPrompt(match) }],
  });

  const brief_he = response.content[0].text.trim();
  const generated_at = new Date().toISOString();

  await supabase.from('ai_briefs').upsert(
    { match_id, brief_he, generated_at },
    { onConflict: 'match_id' },
  );

  return res.status(200).json({ brief: { brief_he, generated_at }, cached: false });
}
