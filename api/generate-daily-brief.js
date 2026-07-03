import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `אתה פרשן ספורט ישראלי שפותח קטע "מה קרה אתמול" בגביע העולם 2026.
הסגנון: סוחף, דעתני, חגיגי — כמו פתיח לקטע היילייטס בשידור ספורט, לא כתבה עיתונאית.

כללים מחייבים:
- עברית ישראלית תקנית ונכונה בלבד — בלי תרגום מכני מאנגלית.
- משפט אחד עד שניים בלבד. לא פסקה, לא רשימה.
- התייחס לפחות לתוצאה בולטת אחת מהרשימה שתקבל (הפתעה, ניצחון גדול, תיקו דרמטי וכו').
- אל תמציא נתונים שלא ניתנו לך.
- אפס Markdown — ללא כוכביות, קווים תחתיים, או כל עיצוב אחר. טקסט רגיל בלבד.
- אל תפתח במילה "אתמול" בכל פעם — תן לזה להישמע כמו קריין אמיתי, גיוון בפתיחים.`;

function buildPrompt(results) {
  const lines = results.map(r => `${r.team_a} ${r.actual_score_a}:${r.actual_score_b} ${r.team_b}`).join('\n');
  return `כתוב משפט פתיחה (עד שני משפטים) לסיכום יום המשחקים הבא בגביע העולם 2026:\n\n${lines}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { recap_date } = req.body || {};
  if (!recap_date) return res.status(400).json({ error: 'Missing recap_date' });

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY,
  );

  // אם הברייף כבר קיים — מחזירים אותו
  const { data: existing } = await supabase
    .from('daily_briefs')
    .select('brief_he, generated_at')
    .eq('recap_date', recap_date)
    .maybeSingle();

  if (existing) return res.status(200).json({ brief: existing, cached: true });

  // שולפים את תוצאות היום (טווח היום המקומי, ±14 שעות לכיסוי אזורי זמן)
  const dayStart = new Date(`${recap_date}T00:00:00`);
  const dayEnd = new Date(`${recap_date}T23:59:59`);
  const { data: matches, error: matchErr } = await supabase
    .from('matches')
    .select('team_a, team_b, actual_score_a, actual_score_b, match_date')
    .eq('is_finished', true)
    .gte('match_date', dayStart.toISOString())
    .lte('match_date', dayEnd.toISOString());

  if (matchErr || !matches || matches.length === 0) {
    return res.status(404).json({ error: 'No finished matches for this date' });
  }

  const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPrompt(matches) }],
  });

  const brief_he = response.content[0].text.trim();
  const generated_at = new Date().toISOString();

  await supabase.from('daily_briefs').upsert(
    { recap_date, brief_he, generated_at },
    { onConflict: 'recap_date' },
  );

  return res.status(200).json({ brief: { brief_he, generated_at }, cached: false });
}
