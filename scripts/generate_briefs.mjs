/**
 * generate_briefs.mjs
 * Generates pre-match AI briefs (Hebrew) for WC2026 matches using Claude API.
 *
 * Usage:
 *   node generate_briefs.mjs --all              # All matches without a brief
 *   node generate_briefs.mjs --scheduled        # Matches within 60hrs, no brief yet
 *   node generate_briefs.mjs --refresh          # Regenerate ALL briefs (overwrites)
 *   node generate_briefs.mjs --refresh ID1 ID2  # Regenerate specific match IDs
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ── Load .env ─────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
function loadEnv(path) {
  try {
    const text = readFileSync(path, 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {}
}
loadEnv(join(__dir, '.env'));
loadEnv(join(__dir, '..', '.env'));
loadEnv(join(__dir, '..', '.env.local'));

// ── Clients ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌  Missing SUPABASE_URL / SUPABASE_SERVICE_KEY'); process.exit(1); }
if (!ANTHROPIC_API_KEY) { console.error('❌  Missing ANTHROPIC_API_KEY'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const claude   = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ── CLI args ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const mode = args[0];
if (!['--all', '--scheduled', '--refresh'].includes(mode)) {
  console.error('Usage: node generate_briefs.mjs --all | --scheduled | --refresh [ID1 ID2 ...]');
  process.exit(1);
}
const refreshIds = mode === '--refresh' ? args.slice(1) : [];

// ── Helpers ───────────────────────────────────────────────────────────
async function getBriefedIds() {
  const { data } = await supabase.from('ai_briefs').select('match_id');
  return new Set((data || []).map(r => r.match_id));
}

async function getMatches() {
  const fields = 'id, team_a, team_b, match_date, league, location';

  if (mode === '--refresh') {
    if (refreshIds.length > 0) {
      const { data } = await supabase.from('matches').select(fields).in('id', refreshIds);
      console.log(`Refresh: ${data.length} match(es) by ID`);
      return data;
    }
    const { data } = await supabase.from('matches').select(fields);
    console.log(`Refresh: all ${data.length} matches`);
    return data;
  }

  const briefed = await getBriefedIds();

  if (mode === '--scheduled') {
    const now    = new Date();
    const cutoff = new Date(now.getTime() + 60 * 60 * 60 * 1000);
    const { data } = await supabase.from('matches').select(fields)
      .gte('match_date', now.toISOString())
      .lte('match_date', cutoff.toISOString());
    const filtered = (data || []).filter(m => !briefed.has(m.id));
    console.log(`Scheduled: ${filtered.length} match(es) within 60 hrs need briefs`);
    return filtered;
  }

  if (mode === '--all') {
    const { data } = await supabase.from('matches').select(fields);
    const filtered = (data || []).filter(m => !briefed.has(m.id));
    console.log(`All: ${filtered.length} match(es) missing briefs`);
    return filtered;
  }

  return [];
}

// ── Prompts ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `אתה אנליסט כדורגל ישראלי שכותב סיכומי טרום משחק לגביע העולם 2026.
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

⚔️ על הנבחרות
[פסקה אחת — סגנון, חוזקות, חולשות של כל נבחרת]

📊 ראש בראש
[פסקה אחת — היסטוריית העימותים ביניהן. אם לא נפגשו — ציין זאת ומה המשמעות]

⭐ שחקני מפתח
[פסקה אחת — שחקן אחד מכל צד שיכול לשנות את התמונה]

🎯 תחזית
[שורה ראשונה: "בית: X% | תיקו: X% | חוץ: X%" — שלושתם יחד שווים 100%]
[שורה שנייה: "תוצאה משוערת: X:X"]
[שורה שלישית: "המלצה: משפט אחד חד וברור]`;

function buildPrompt(match) {
  const home  = match.team_a;
  const away  = match.team_b;
  const stage = match.league || 'שלב הבתים';
  const loc   = match.location ? ` | ${match.location}` : '';
  let dateLabel = match.match_date || '';
  try {
    const dt = new Date(match.match_date);
    dateLabel = dt.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
  } catch {}

  return `כתוב סיכום טרום משחק עבור:\n\n${home} נגד ${away} | ${stage} | ${dateLabel}${loc}\n\nהשתמש בידע שלך על שתי הנבחרות לפי המבנה שתואר.`;
}

// ── Generate ──────────────────────────────────────────────────────────
async function generateBrief(match) {
  const resp = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPrompt(match) }],
  });
  return resp.content[0].text.trim();
}

// ── Main ──────────────────────────────────────────────────────────────
const matches = await getMatches();

if (matches.length === 0) {
  console.log('No matches to process. Done!');
  process.exit(0);
}

let success = 0, failed = 0;

for (const match of matches) {
  const label = `${match.team_a} vs ${match.team_b}`;
  process.stdout.write(`⏳  Generating: ${label} …`);
  try {
    const brief = await generateBrief(match);
    await supabase.from('ai_briefs').upsert(
      { match_id: match.id, brief_he: brief, generated_at: new Date().toISOString() },
      { onConflict: 'match_id' }
    );
    console.log(` ✓`);
    success++;
  } catch (e) {
    console.log(` ✗  ${e.message}`);
    failed++;
  }
}

console.log(`\nDone!  ✓ ${success} generated   ✗ ${failed} failed`);
