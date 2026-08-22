import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { STAGES, STAGE_LABELS } from '../src/config/tournament.js';
import { buildUefaContext } from './_uefaContext.js';

const SYSTEM_PROMPT = `אתה אנליסט כדורגל ישראלי שכותב סיכומי טרום משחק לליגת האלופות 2026.
הסגנון: סוחף, דעתני, שיחתי — כמו ניתוח בין חברים שמבינים כדורגל, לא כתבה עיתונאית.

כללים מחייבים:
- עברית ישראלית תקנית ונכונה בלבד — בלי תרגום מכני מאנגלית.
- השתמש במונחים כדורגליים עבריים: "שוער" לא "גולקיפר", "בעיטת עונשין" לא "פנדל", "חלוץ", "קו האמצע", "הגנה מצומצמת" וכו'. כשאין מונח עברי מקובל — מותר להשתמש בסלנג ישראלי.
- היה דעתני — קח עמדה ברורה ותמוך בה.
- אל תמציא נתונים סטטיסטיים שאינך בטוח בהם. השתמש בניסוחים כמו "נוטים ל-", "בדרך כלל", "ידועים בזכות".
- אפס Markdown — ללא כוכביות, קווים תחתיים, או כל עיצוב אחר. טקסט רגיל בלבד.

פורמט מחייב — חמישה סקטורים, כל אחד פותח בדיוק בכותרת הבאה (שורה נפרדת):

🌍 רקע ואווירה
[פסקה אחת — מה עומד על הכף, למה המשחק הזה מיוחד]

⚔️ על הקבוצות
[פסקה אחת — סגנון, חוזקות, חולשות של כל קבוצה]

📊 ראש בראש
[פסקה אחת — היסטוריית העימותים ביניהן. אם לא נפגשו — ציין זאת ומה המשמעות]

🎯 תחזית
[שם קבוצת הבית]: X% | תיקו: X% | [שם קבוצת האורחים]: X%
תוצאה משוערת: X:X לטובת [שם הקבוצה המנצחת]
המלצה: [משפט אחד חד וברור]

דוגמה לפורמט תקין (אל תעתיק — רק השתמש במבנה):
ריאל מדריד: 58% | תיקו: 22% | באיירן מינכן: 20%
תוצאה משוערת: 2:1 לטובת ריאל מדריד
המלצה: ריאל מדריד בבית — אין סיבה לחפש הפתעות.

אם תיקו: "תוצאה משוערת: 1:1 תיקו"
חשוב: אין להשתמש במילים "בית" או "חוץ" — תמיד שמות הקבוצות בפועל.`;

function buildPrompt(match, uefaContext) {
  const loc = match.location ? ` | ${match.location}` : '';
  let dateLabel = match.match_date || '';
  try {
    const dt = new Date(match.match_date);
    dateLabel = dt.toLocaleDateString('he-IL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
    }) + ' UTC';
  } catch {}
  const stageLabel = STAGE_LABELS[match.stage] || STAGE_LABELS[STAGES.LEAGUE_PHASE];
  const header = `כתוב סיכום טרום משחק עבור:\n\n${match.team_a} נגד ${match.team_b} | ${stageLabel} | ${dateLabel}${loc}`;

  if (uefaContext) {
    return `${header}\n\nנתונים אמיתיים מ-UEFA לעונה הנוכחית (התבסס עליהם, הם עדיפים על ידע כללי):\n${uefaContext}\n\nהשתמש בנתונים האלה בשילוב הידע הכללי שלך על שתי הקבוצות לפי המבנה שתואר.`;
  }
  return `${header}\n\nהשתמש בידע שלך על שתי הקבוצות לפי המבנה שתואר.`;
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
    .select('id, team_a, team_b, match_date, stage, location')
    .eq('id', match_id)
    .single();

  if (matchErr || !match) return res.status(404).json({ error: 'Match not found' });

  // נתונים אמיתיים מ-UEFA (טופס אחרון + טבלה) — null אם העונה עוד לא פתוחה
  // או שהקבוצות לא זוהו; הפרומפט נופל אז חזרה לניסוח "ידע כללי" הישן.
  const uefaContext = await buildUefaContext(match.team_a, match.team_b);

  // מייצרים ברייף עם Claude
  const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPrompt(match, uefaContext) }],
  });

  const brief_he = response.content[0].text.trim();
  const generated_at = new Date().toISOString();

  await supabase.from('ai_briefs').upsert(
    { match_id, brief_he, generated_at },
    { onConflict: 'match_id' },
  );

  return res.status(200).json({ brief: { brief_he, generated_at }, cached: false });
}
