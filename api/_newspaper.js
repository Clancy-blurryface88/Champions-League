// "מבט לאלופות" (22.11.2026) — the newspaper issue after each match night.
// After a night's matches are all calculated, the reminders trigger (every 5 min) builds the night's facts
// (night winner, the table, exact hits, the goal timeline: which goal gave or took whose exact hit and for how long,
// what a held score would have been worth, the crowd, the weather…) and Claude writes the texts from them, by the
// rules the user set. The issue is saved as a draft; the admin previews it and publishes it (by default the
// morning after, 08:00 Israel). A night that isn't the round's last gets "tonight" (the next night's matches);
// the round's last night is the full round issue (with forecast vs reality).
// GET /api/football?source=newspaper&action=generate&date=YYYY-MM-DD[&rehearsal=1] — admin; builds (again).
import Anthropic from '@anthropic-ai/sdk';
import { supa, push } from './_goalWebhook.js';
import { nightTimeline } from './_replay.js';
import { adminFromToken } from './_adminPush.js';
import { teamHe } from '../src/utils/teamHe.js';
import { computeProfile } from '../src/components/stats/profileMath.js';

const n = (x) => (x == null || x === '' ? 0 : Number(x));
const r2 = (x) => Math.round(x * 100) / 100;
const ilDate = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'Asia/Jerusalem' });
const DAY_HE = { Sunday: 'ראשון', Monday: 'שני', Tuesday: 'שלישי', Wednesday: 'רביעי', Thursday: 'חמישי', Friday: 'שישי', Saturday: 'שבת' };
const dayHe = (date) => DAY_HE[new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })];
const dm = (date) => { const [, m, d] = date.split('-'); return `${Number(d)}.${Number(m)}`; };

async function supaAll(path) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const rows = await supa(`${path}${path.includes('?') ? '&' : '?'}limit=1000&offset=${from}`);
    out.push(...rows);
    if (rows.length < 1000) return out;
  }
}
async function supaWrite(method, path, body) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;
  const r = await fetch(`${url}/rest/v1/${path}`, {
    method, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(`Supabase ${method} ${path.split('?')[0]}: ${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.status === 204 ? null : r.json();
}

// what a prediction a-b would have earned had the match ended a-b (the four kinds, all hit)
function worth(m, a, b) {
  const t = a + b;
  const so = m.score_odds && Object.keys(m.score_odds).length ? m.score_odds : null;
  const ex = so ? n(so[`${a}:${b}`] ?? so.other) : n(m.exact_score_points);
  const oc = a > b ? n(m.home_win_points) : a < b ? n(m.away_win_points) : n(m.draw_points);
  const gr = t <= 2 ? n(m.goals_0_2_points) : t <= 4 ? n(m.goals_3_4_points) : n(m.goals_5_plus_points);
  const bt = a > 0 && b > 0 ? n(m.btts_yes_points) : n(m.btts_no_points);
  return r2(oc + gr + bt + ex);
}
const sign = (a, b) => Math.sign(a - b);

// 08:00 Israel time on the day after `date`
function morningAfter(date) {
  for (const h of [5, 6]) { const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); d.setUTCHours(h); if (new Date(d).toLocaleTimeString('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit' }).startsWith('08')) return d.toISOString(); }
  const d = new Date(`${date}T06:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString();
}

// ── the facts of one night ──
export async function buildFacts(date) {
  const [matches, preds, profiles] = await Promise.all([supaAll('matches?select=*'), supaAll('predictions?select=match_id,user_id,predicted_score_a,predicted_score_b,points_earned,exact_score_points_earned,correct_outcome_points_earned,goals_range_points_earned,both_teams_scored_points_earned'), supaAll('public_profiles?select=user_id,display_name')]);
  const name = Object.fromEntries(profiles.map((p) => [p.user_id, (p.display_name || '').trim()]));
  const night = matches.filter((m) => ilDate(m.match_date) === date).sort((a, b) => new Date(a.match_date) - new Date(b.match_date) || (a.order ?? 0) - (b.order ?? 0));
  if (!night.length) throw new Error(`no matches on ${date}`);
  if (!night.every((m) => m.is_score_calculated)) throw new Error(`the night of ${date} is not fully calculated`);
  const roundId = night[0].round_id;
  const [round] = await supa(`rounds?select=id,name,order&id=eq.${roundId}`);
  const roundMatches = matches.filter((m) => m.round_id === roundId);
  const nights = [...new Set(roundMatches.map((m) => ilDate(m.match_date)))].sort();
  const nightNo = nights.indexOf(date) + 1;
  const kind = nightNo === nights.length ? 'round' : 'night';
  const nightEnd = Math.max(...night.map((m) => new Date(m.match_date).getTime()));
  const nightIds = new Set(night.map((m) => m.id));
  const players = [...new Set(preds.filter((p) => roundMatches.some((m) => m.id === p.match_id)).map((p) => p.user_id))].filter((u) => name[u]);
  const byMatch = (id) => preds.filter((p) => p.match_id === id && players.includes(p.user_id));
  const team = (m, side) => ({ en: (side === 'a' ? m.team_a : m.team_b).trim(), he: teamHe(side === 'a' ? m.team_a : m.team_b), logo: side === 'a' ? m.team_a_logo : m.team_b_logo });
  const mInfo = (m) => ({ id: m.id, a: team(m, 'a'), b: team(m, 'b'), score: `${n(m.actual_score_a)}-${n(m.actual_score_b)}`, kickoff: m.match_date });

  // points: the night, the round so far, the overall table before this night and after it
  const calc = matches.filter((m) => m.is_score_calculated);
  const sumFor = (u, ms) => r2(preds.filter((p) => p.user_id === u && ms.has(p.match_id)).reduce((s, p) => s + n(p.points_earned), 0));
  const before = new Set(calc.filter((m) => new Date(m.match_date).getTime() < new Date(night[0].match_date).getTime() - 3600e3 && !nightIds.has(m.id)).map((m) => m.id));
  const after = new Set(calc.filter((m) => new Date(m.match_date).getTime() <= nightEnd).map((m) => m.id));
  const roundSoFar = new Set(roundMatches.filter((m) => m.is_score_calculated && new Date(m.match_date).getTime() <= nightEnd).map((m) => m.id));
  const rows = players.map((u) => ({ u, name: name[u], night: sumFor(u, nightIds), round: sumFor(u, roundSoFar), before: sumFor(u, before), after: sumFor(u, after) }));
  const rank = (key) => { const s = [...rows].sort((x, y) => y[key] - x[key]); return Object.fromEntries(s.map((r, i) => [r.u, i + 1])); };
  const rb = rank('before'), ra = rank('after');
  const table = [...rows].sort((x, y) => y.after - x.after).map((r) => ({ name: r.name, total: r.after, rank: ra[r.u], move: rb[r.u] - ra[r.u] }));
  const nightRank = [...rows].sort((x, y) => y.night - x.night).map((r) => ({ name: r.name, pts: r.night }));
  const roundRank = [...rows].sort((x, y) => y.round - x.round).map((r) => ({ name: r.name, pts: r.round }));
  const leader = table[0], second = table[1];
  const gapBefore = (() => { const s = [...rows].sort((x, y) => y.before - x.before); return s.length > 1 ? r2(s[0].before - s[1].before) : 0; })();

  // exact hits and directions on the night
  const exact = [], dirRight = { n: 0, of: 0 };
  for (const m of night) for (const p of byMatch(m.id)) {
    dirRight.of++;
    if (sign(p.predicted_score_a, p.predicted_score_b) === sign(n(m.actual_score_a), n(m.actual_score_b))) dirRight.n++;
    if (p.predicted_score_a === n(m.actual_score_a) && p.predicted_score_b === n(m.actual_score_b)) exact.push({ name: name[p.user_id], match: m.id, pts: r2(n(p.points_earned)) });
  }

  // the goal timeline: per match, which goal gave or took whose exact hit, and for how long
  let tl = { fixtures: [] };
  try { tl = await nightTimeline(date); } catch (e) { console.error('[newspaper] timeline', e.message); }
  const perMatch = night.map((m) => {
    const fx = tl.fixtures.find((f) => f.matchId === m.id);
    const ps = byMatch(m.id);
    const pick = (p) => `${p.predicted_score_a}-${p.predicted_score_b}`;
    const states = [{ score: '0-0', minute: 0 }, ...(fx?.goals || []).map((g) => ({ score: `${g.a}-${g.b}`, minute: g.minute, scorer: g.scorer, side: g.side }))];
    const goals = [], holds = [];
    for (let i = 1; i < states.length; i++) {
      const prev = states[i - 1].score, cur = states[i].score;
      const took = ps.filter((p) => pick(p) === prev).map((p) => name[p.user_id]);
      const gave = ps.filter((p) => pick(p) === cur).map((p) => name[p.user_id]);
      const heldFrom = took.length ? states[i - 1].minute : null;
      goals.push({ minute: states[i].minute, scorer: states[i].scorer, score: cur, side: states[i].side, gave, took, held: heldFrom != null ? states[i].minute - heldFrom : null });
    }
    // every stretch someone's pick was the score on the pitch (the opening 0-0 counts once a goal ends it)
    for (let i = 0; i < states.length; i++) {
      const holders = ps.filter((p) => pick(p) === states[i].score);
      const until = i + 1 < states.length ? states[i + 1].minute : 90;
      if (holders.length && (i > 0 || states.length > 1)) holds.push({ score: states[i].score, from: states[i].minute, to: until, survived: i === states.length - 1, names: holders.map((p) => name[p.user_id]), worth: worth(m, ...states[i].score.split('-').map(Number)), got: holders.map((p) => ({ name: name[p.user_id], pts: r2(n(p.points_earned)) })) });
    }
    const born = holds.filter((h) => h.from > 0 || h.score !== '0-0').reduce((s, h) => s + h.names.length, 0);
    const survived = exact.filter((e) => e.match === m.id).length;
    const turns = states.slice(1).reduce((s, st, i) => { const [a, b] = st.score.split('-').map(Number); const [pa, pb] = states[i].score.split('-').map(Number); return s + (sign(a, b) !== sign(pa, pb) ? 1 : 0); }, 0);
    const right = ps.filter((p) => sign(p.predicted_score_a, p.predicted_score_b) === sign(n(m.actual_score_a), n(m.actual_score_b))).map((p) => ({ name: name[p.user_id], pick: pick(p) }));
    const near = ps.filter((p) => Math.abs(p.predicted_score_a - n(m.actual_score_a)) + Math.abs(p.predicted_score_b - n(m.actual_score_b)) === 1).map((p) => ({ name: name[p.user_id], pick: pick(p) }));
    return { ...mInfo(m), hasTimeline: !!fx, picks: ps.map((p) => ({ name: name[p.user_id], pick: pick(p), pts: r2(n(p.points_earned)) })), states: states.map((s) => ({ score: s.score, minute: s.minute })), goals, holds, born, survived, turns, groupPts: r2(ps.reduce((s, p) => s + n(p.points_earned), 0)), right, near, goalsTotal: n(m.actual_score_a) + n(m.actual_score_b), margin: Math.abs(n(m.actual_score_a) - n(m.actual_score_b)) };
  });
  const bornTotal = perMatch.reduce((s, m) => s + m.born, 0);
  const dramas = perMatch.filter((m) => m.hasTimeline && m.born - m.survived >= 2).sort((a, b) => (b.born - b.survived) - (a.born - a.survived)).slice(0, 2).map((m) => m.id);
  const biggest = [...perMatch].sort((a, b) => b.margin - a.margin || b.goalsTotal - a.goalsTotal)[0];
  const flips = [...perMatch].filter((m) => m.hasTimeline).sort((a, b) => b.turns - a.turns || b.goalsTotal - a.goalsTotal)[0];
  const exactGoals = perMatch.flatMap((m) => m.goals.filter((g, i) => g.gave.length && i === m.goals.length - 1 && m.survived).map((g) => ({ match: m.id, minute: g.minute, scorer: g.scorer, score: g.score, names: g.gave, pts: exact.find((e) => e.match === m.id)?.pts })));
  const popular = (() => { const c = {}; perMatch.forEach((m) => m.picks.forEach((p) => { c[p.pick] = (c[p.pick] || 0) + 1; })); const [score, times] = Object.entries(c).sort((a, b) => b[1] - a[1])[0] || []; return score ? { score, times, hits: exact.filter((e) => perMatch.find((m) => m.id === e.match)?.score === score).length } : null; })();
  const crowd = { allRight: perMatch.filter((m) => m.right.length === players.length).map((m) => m.id), oneRight: perMatch.filter((m) => m.right.length === 1).map((m) => ({ match: m.id, ...m.right[0] })), noneRight: perMatch.filter((m) => m.right.length === 0).map((m) => m.id), best: [...perMatch].sort((a, b) => b.groupPts - a.groupPts)[0]?.id, worst: [...perMatch].sort((a, b) => a.groupPts - b.groupPts)[0]?.id, nearest: [...perMatch].sort((a, b) => b.near.length - a.near.length)[0] };
  const withoutExact = players.filter((u) => !exact.some((e) => e.name === name[u])).map((u) => name[u]);
  const weather = exact.length >= Math.max(6, players.length) ? 'showers' : bornTotal >= 12 && exact.length <= bornTotal * 0.3 ? 'storm' : exact.length <= Math.ceil(players.length / 2) ? 'heat' : 'partly';

  // the round's forecast against reality (the round's last night only)
  let forecast = null;
  if (kind === 'round') {
    const fc = await supa(`round_forecasts?select=user_id,fc&round_id=eq.${roundId}`).catch(() => []);
    forecast = rows.map((r) => ({ name: r.name, pts: r.round, fc: r2(n(fc.find((f) => f.user_id === r.u)?.fc)) })).filter((x) => x.fc > 0).sort((a, b) => b.pts - a.pts);
  }
  // the group as forecasters (the round's last night): the round against the season so far, and who stands out
  let groupProfile = null;
  if (kind === 'round') {
    const done = (ms) => ms.filter((m) => m.is_finished && m.actual_score_a != null && m.actual_score_b != null && new Date(m.match_date).getTime() <= nightEnd);
    const pr = computeProfile(done(roundMatches), preds, name), se = computeProfile(done(matches), preds, name);
    const pick = (P) => ({ real: P.real, group: P.group, n: P.n });
    const people = Object.values(pr.per);
    const most = (k) => [...people].sort((a, b) => b[k] - a[k])[0];
    const least = (k) => [...people].sort((a, b) => a[k] - b[k])[0];
    groupProfile = { round: pick(pr), season: pick(se), standouts: { mostGoals: { name: most('goals').name, goals: most('goals').goals }, fewestGoals: { name: least('goals').name, goals: least('goals').goals }, mostDraws: { name: most('D').name, draws: most('D').D }, mostUnique: { name: most('unique').name, unique: most('unique').unique, hits: most('unique').uniqueHits }, mostMajority: { name: most('majority').name, majority: most('majority').majority, of: most('majority').n } } };
  }
  // the next night of the round ("tonight"), for a night that isn't the round's last
  const nextDate = nights[nightNo];
  const tonight = kind === 'night' && nextDate ? { date: nextDate, day: dayHe(nextDate), matches: roundMatches.filter((m) => ilDate(m.match_date) === nextDate).map(mInfo) } : null;

  return {
    date, day: dayHe(date), dm: dm(date), kind, nightNo, nightsInRound: nights.length, round: { id: roundId, name: round?.name, no: n(round?.order) },
    players: players.length, nightRank, roundRank, table, leader: leader?.name, gapNow: second ? r2(leader.total - second.total) : 0, gapBefore,
    exact, exactCount: exact.length, dir: dirRight, bornTotal, matches: perMatch, dramas, biggest: biggest?.id, flips: flips?.id, exactGoals, popular, crowd, withoutExact, weather, forecast, tonight, groupProfile,
  };
}

// ── the texts, by Claude ──
const RULES = `אתה העורך והכתב של "מבט לאלופות" — עיתון יומי מצחיק, חכם ועשיר, שיוצא בבוקר שאחרי כל ערב משחקים של ליגת האלופות, לקבוצה קטנה של חברים שמנחשים תוצאות.
הקוראים הם המשתתפים עצמם. כתוב עליהם בשמם הפרטי, כמו עיתונאי ספורט שמכיר אותם.

כללי כתיבה מחייבים:
- עברית ישראלית טבעית ועשירה, כמו בעיתונות אמיתית. משפטים מלאים וברורים שנקראים כסיפור, לא רשימות.
- כל מספר מוסבר במשפט ("כל שבעת המשתתפים צברו בו ביחד 38.95 נקודות", "אילו המשחק היה נגמר בתוצאה שלו"). אין מספר בלי הקשר.
- המונחים: "פגיעה מדויקת" / "פגיעה בתוצאה מדויקת" — לעולם לא "מדויקת" לבד. "כיוון" = ניצחון/תיקו/הפסד נכון.
- רק עובדות מתוך הנתונים שקיבלת. אסור להמציא שחקן, דקה, תוצאה, ניחוש או נקודה. שמות שחקנים — תעתיק עברי מקובל של השם שבנתונים.
- תוצאה כתובה כמו בנתונים: הקבוצה הראשונה היא קבוצת הבית (team a), והמספר הראשון שלה. "0-3 לאינטר בפיינורד" ולא "3-0".
- שמות קבוצות בעברית מקובלת (אפשר להיעזר בשדה he). שמות שחקנים: תעתיק עברי מקובל ומדויק (Lamine Yamal = לאמין ימאל, Raphinha = רפיניה); כשאינך בטוח — שם המשפחה בלבד, בתעתיק פשוט.
- על משתתפים כתוב בניסוח שלא תלוי במגדר כשאפשר ("דימה, עם 227.2 נקודות, עדיין בתמונה"), כי אינך יודע את המגדר של כל אחד.
- המונחים בטבלאות: "ניקוד אפשרי" ו"ניקוד בפועל"; "פגיעה במהלך המשחק" (ולא "פגיעה בדרך"); "המנחש המיוחד" הוא מי שניחש הכי הרבה תוצאות שאף אחד אחר לא ניחש.
- אחוזים — מספר שלם (22%, לא 22.14%). נקודות — עד שתי ספרות אחרי הנקודה.
- האורך חשוב: כל עמוד בעיתון הוא מסך טלפון אחד. היצמד למגבלות המילים בכל שדה.
- הומור ברור, חם ומבוסס עובדות, בלי בדיחות שצריך להסביר. דוגמה שהקוראים אהבו: "להשכרה: המקום הראשון. תפוס עד הודעה חדשה — יוסי."
- בלי Markdown, בלי אימוג'י בתוך הטקסטים.
התשובה: JSON תקין בלבד, בלי שום טקסט לפניו או אחריו.`;

const SHAPE = `החזר JSON בצורה הזו (כל השדות בעברית):
{
 "kicker": "מילה-שתיים מעל הכותרת (למשל: הצמרת)",
 "headline": "כותרת ראשית קצרה וחזקה, 2-4 מילים",
 "subhead": "עד 30 מילים, שתי שורות עשירות: מי ניצח את הערב, עם כמה פגיעות מדויקות ונקודות, ומה קרה לפער מהמקום השני בטבלה",
 "photoCaption": "כיתוב לתמונת המשחק המרכזי של הכתבה הראשית: השער והדקה ולמי הוא העניק פגיעה",
 "photoMatch": "id של המשחק לתמונה",
 "lead": "פסקת פתיחה של הכתבה הראשית, עד 65 מילים, שנקראת כסיפור (ההמשך הולך ל-leadMore)",
 "leadMore": ["1-2 פסקאות המשך לכתבה הראשית, בעמוד 2, ביחד עד 140 מילים"],
 "leadHitsIntro": "משפט שמציג את הפגיעות המדויקות של הערב (הן יוצגו כרשימה אחריו)",
 "rent": {"head": "כותרת מודעה קטנה בפינת השער (למשל: להשכרה)", "body": "טקסט מצחיק על המוביל"},
 "dramaTitle": "כותרת לעמוד הפגיעות שנעלמו (למשל: 22 פגיעות במהלך המשחקים, רק 4 בסיום)",
 "dramaIntro": "עד 60 מילים: פסקה שמסבירה בבהירות מה זו פגיעה במהלך המשחק: התוצאה על המגרש התאימה לניחוש מדויק של משתתף, עד השער הבא; וכמה נשארו בסיום",
 "matches": [ לכל משחק ב-dramas, לפי הסדר: {"id": "...", "kicker": "למשל: שובר הלבבות", "title": "כותרת ברורה", "blog": [{"minute": 0, "text": "עד 28 מילים, משפט עיתונאי מלא לכל שער: מי כבש, התוצאה, ולמי השער נתן או לקח פגיעה מדויקת ואחרי כמה דקות"}], "closing": "משפט סיכום של המשחק", "costIntro": "משפט שמציג את טבלת 'מה זה עלה להם': ניקוד אפשרי (מה שהיה מקבל אילו המשחק נגמר בתוצאה שלו) מול ניקוד בפועל"} ],
 "bigScore": {"title": "", "text": "2 משפטים על התוצאה הגדולה של הערב"},
 "flips": {"title": "", "text": "2 משפטים על המשחק עם הכי הרבה מהפכים"},
 "crowd": {"lead": "חוכמת ההמונים: באילו משחקים כולם צדקו בכיוון ובאילו רק אחד (מי ומה ניחש)", "more": "המשחק שהכי השתלם לכולם יחד והכי פחות (עם הסבר), ואיפה היו הכי הרבה 'כמעט' — במרחק שער מפגיעה מדויקת"},
 "ads": [6 מודעות קטנות {"head": "דרושה/אבדה/למכירה/תנחומים/שיעורים פרטיים/נמצא...", "body": "טקסט מצחיק וברור, מבוסס על עובדה מהנתונים"}],
 "weather": {"title": "מזג האוויר במשפט קצר, לפי השדה weather (heat=שרבי, partly=בהיר חלקית, showers=ממטרי פגיעות, storm=סוער)", "text": "משפט שמסביר את זה במספרים", "forecast": "תחזית מבודחת לערב/למחזור הבא"},
 "tonight": {"title": "", "text": "רק אם יש tonight: מה עומד הערב על הכף — המשחקים והמרדף בטבלה"},
 "scorers": {"השם באנגלית כפי שמופיע בנתונים": "תעתיק עברי מקובל" — לכל כובש שמופיע ב-goals של כל המשחקים},
 "forecastNote": "רק אם יש forecast: משפט על תחזית מול מציאות — מי עבר את התחזית",
 "groupProfile": {"title": "רק אם יש groupProfile: כותרת לעמוד הקבוצה כמנחשת", "text": "3-4 משפטים עשירים: איך הקבוצה כולה ניחשה במחזור לעומת מה שקרה במגרש ולעומת העונה עד כה — כמות שערים, תיקו, ניצחונות בית, שתיהן כובשות, ההליכה אחרי הרוב — ומי בלט (הכי אופטימי בשערים, הכי הרבה תיקו, הכי הרבה ניחושים ייחודיים). כל מספר עם הסבר."}
}`;

async function writeTexts(facts) {
  const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // Hebrew is long in tokens: a generous ceiling, streamed (a long answer can't be cut off or time out)
  const body = (model) => claude.messages.stream({
    model, max_tokens: 24000, system: RULES,
    messages: [{ role: 'user', content: `${SHAPE}\n\nהנתונים של ${facts.kind === 'round' ? `הערב האחרון של ${facts.round.name} (גיליון סיכום המחזור)` : `ערב ${facts.day} (ערב ${facts.nightNo} של ${facts.round.name})`}:\n${JSON.stringify(facts)}` }],
  }).finalMessage();
  let res;
  try { res = await body('claude-sonnet-5-5'); } catch (e) { console.error('[newspaper] sonnet-5-5', e.message); res = await body('claude-sonnet-4-6'); }
  const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  const j = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  try { return JSON.parse(j); } catch (e) { throw new Error(`the writing came back unreadable (${res.model}, stop: ${res.stop_reason}, ${text.length} chars): ${text.slice(0, 160)}`); }
}

// build (or build again) the issue of a night
export async function generateIssue(date, { rehearsal = false } = {}) {
  const old = await supa(`newspaper_issues?select=id&night_date=eq.${date}`);
  const base = { night_date: date, status: 'generating', rehearsal, error: null, updated_at: new Date().toISOString() };
  const [row] = old.length ? await supaWrite('PATCH', `newspaper_issues?id=eq.${old[0].id}`, base) : await supaWrite('POST', 'newspaper_issues', base);
  try {
    const facts = await buildFacts(date);
    const texts = await writeTexts(facts);
    const [done] = await supaWrite('PATCH', `newspaper_issues?id=eq.${row.id}`, { round_id: facts.round.id, kind: facts.kind, facts, texts, status: 'draft', publish_at: morningAfter(date), updated_at: new Date().toISOString() });
    return done;
  } catch (e) {
    await supaWrite('PATCH', `newspaper_issues?id=eq.${row.id}`, { status: 'error', error: String(e.message).slice(0, 500) });
    throw e;
  }
}

// from the reminders trigger: a night that is all calculated and has no issue yet → its draft, and a push to the admin
export async function newspaperSweep(now = new Date()) {
  const since = new Date(now.getTime() - 2 * 86400e3).toISOString();
  const recent = await supa(`matches?select=id,match_date,is_score_calculated&match_date=gte.${since}&match_date=lte.${now.toISOString()}`);
  const dates = [...new Set(recent.map((m) => ilDate(m.match_date)))];
  const out = [];
  for (const date of dates) {
    const all = await supa(`matches?select=id,match_date,is_score_calculated&match_date=gte.${new Date(new Date(`${date}T00:00:00Z`).getTime() - 3 * 3600e3).toISOString()}&match_date=lte.${new Date(new Date(`${date}T23:59:59Z`).getTime()).toISOString()}`);
    const ofDate = all.filter((m) => ilDate(m.match_date) === date);
    if (!ofDate.length || !ofDate.every((m) => m.is_score_calculated)) continue;
    const has = await supa(`newspaper_issues?select=id,status&night_date=eq.${date}`);
    if (has.length) continue;
    try {
      await generateIssue(date);
      // to the admins only (externalIds) — never to everyone
      const admins = await supa('profiles?select=id&is_admin=eq.true');
      if (admins.length) await push({ heading: '📰 מבט לאלופות — הגיליון מוכן', body: `הגיליון של ערב ${dayHe(date)} מחכה לבדיקה ולאישור באדמין`, url: 'https://champions-league-2026.vercel.app/Admin', key: `newspaper-${date}`, mode: 'live', externalIds: admins.map((a) => a.id) }).catch(() => {});
      out.push({ date, generated: true });
    } catch (e) { out.push({ date, error: e.message }); }
  }
  return out;
}

export async function newspaperHandler(req, res) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!(await adminFromToken(token))) return res.status(403).json({ error: 'admins only' });
  const { action, date, rehearsal } = req.query;
  try {
    if (action === 'generate') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return res.status(400).json({ error: 'date=YYYY-MM-DD required' });
      const row = await generateIssue(date, { rehearsal: rehearsal === '1' });
      return res.status(200).json({ ok: true, id: row.id });
    }
    if (action === 'facts') return res.status(200).json(await buildFacts(date));
    return res.status(400).json({ error: 'unknown action' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
