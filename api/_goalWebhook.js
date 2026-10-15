// Handler (mounted via POST /api/football?source=goal-webhook — Hobby plan caps
// us at 12 functions) — receives GOAL API webhooks and sends OneSignal pushes:
//   goal.scored    → "⚽ גול! …" + how many players currently hold the exact score
//   score.changed  → correction push (goal ruled out by VAR) with the new count
//   match.finished → once the night's last CL match ends, a summary push that
//                    congratulates the exact-score hitters (by name if ≤3),
//                    delivered at 23:59 Israel time.
// Pushes go to every subscriber (no per-user targeting yet). Each push carries
// an idempotency key, so GOAL's retries (and two matches finishing together)
// never send the same push twice.
import crypto from 'crypto';
import { TEAM_BY_GOAL_ID } from '../src/data/goalTeamIds.js';

const GOAL_BASE = 'https://api.goal-api.com/v1';
const CL_LEAGUE = 'cmr77dw3900f5rx06j05wgzv4';
const ONESIGNAL_APP_ID = '9c8b733e-9d73-41bb-b092-ae462aa5cdb1';
const SITE = 'https://champions-league-2026.vercel.app';

const norm = (s) => (s || '').trim().toLowerCase();

export async function goal(path) {
  const r = await fetch(`${GOAL_BASE}${path}`, { headers: { Authorization: `Bearer ${process.env.GOAL_API_KEY}` } });
  const j = await r.json();
  if (!j.success) throw new Error(`GOAL ${path}: ${j.error || j.message || r.status}`);
  return j.data;
}

export async function supa(path) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;
  const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!r.ok) throw new Error(`Supabase ${path}: ${r.status}`);
  return r.json();
}

// Our DB match for a GOAL fixture (same two teams, kickoff within ±6h), with
// a flag telling whether our team_a is GOAL's away side.
export async function findOurMatch(fx) {
  const home = TEAM_BY_GOAL_ID[fx.homeTeamId];
  const away = TEAM_BY_GOAL_ID[fx.awayTeamId];
  if (!home || !away) return null;
  const t = new Date(fx.kickoffUtc).getTime();
  const from = new Date(t - 6 * 3600e3).toISOString();
  const to = new Date(t + 6 * 3600e3).toISOString();
  const rows = await supa(`matches?select=id,team_a,team_b&match_date=gte.${from}&match_date=lte.${to}`);
  for (const m of rows) {
    if (norm(m.team_a) === norm(home) && norm(m.team_b) === norm(away)) return { match: m, swapped: false };
    if (norm(m.team_a) === norm(away) && norm(m.team_b) === norm(home)) return { match: m, swapped: true };
  }
  return null;
}

// user_ids whose prediction for our match is exactly this score.
async function exactHitters(our, homeScore, awayScore) {
  const preds = await supa(`predictions?select=user_id,predicted_score_a,predicted_score_b&match_id=eq.${our.match.id}`);
  const [a, b] = our.swapped ? [awayScore, homeScore] : [homeScore, awayScore];
  return preds.filter((p) => p.predicted_score_a === a && p.predicted_score_b === b).map((p) => p.user_id);
}

async function countExact(our, homeScore, awayScore) {
  return (await exactHitters(our, homeScore, awayScore)).length;
}

// 23:59 Israel time on the Israel date of a moment, as a UTC Date (DST-safe).
function ilEndOfNight(d) {
  const TZ = 'Asia/Jerusalem';
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d);
  const guess = new Date(`${ymd}T23:59:00Z`);
  const shown = Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(guess));
  // Israel is ahead of UTC, so 23:59Z shows as 01:59/02:59 the next day.
  return new Date(guess.getTime() - (shown + 24 - 23) % 24 * 3600e3);
}

// "דני", "דני ויוסי", "דני, יוסי ומיכל"
const joinNames = (names) => (names.length < 2 ? names.join('')
  : `${names.slice(0, -1).join(', ')} ו${names[names.length - 1]}`);

// Deterministic UUID from a string — OneSignal's idempotency_key must be a UUID.
function uuidFrom(str) {
  const h = crypto.createHash('sha1').update(str).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

// mode: 'live' → every subscriber · 'test' → only devices marked as Test
// Users in OneSignal (never deduped, so a test can be re-sent) · 'dry' →
// build the payload, send nothing. sendAfter (Date) schedules delivery.
export async function push({ heading, body, url, key, mode = 'live', sendAfter }) {
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    target_channel: 'push',
    included_segments: [mode === 'test' ? 'Test Users' : 'Total Subscriptions'],
    headings: { en: heading, he: heading },
    contents: { en: body, he: body },
    url,
    idempotency_key: uuidFrom(mode === 'test' ? `test:${key}:${Date.now()}` : key),
    // Own topic per push: web push replaces a shown notification that shares
    // a topic, so without this a goal push wiped out the reminder above it.
    web_push_topic: uuidFrom(`topic:${key}:${mode === 'test' ? Date.now() : ''}`),
  };
  if (sendAfter && sendAfter > new Date()) payload.send_after = sendAfter.toISOString();
  if (mode === 'dry') return { dryRun: true, payload };
  const r = await fetch('https://api.onesignal.com/notifications?c=push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}` },
    body: JSON.stringify(payload),
  });
  return { status: r.status, body: await r.json().catch(() => null) };
}

// GOAL sometimes delivers the same goal.scored twice ~30s apart (seen live:
// Feyenoord 1-1 at 17:07:00 and 17:07:30), and the idempotency key can differ
// between the two because the scorer/minute lookup may not be ready the first
// time. So before a goal push, look at this match's newest push from the last
// 10 minutes: if it already announced this exact score, skip. A VAR "goal
// ruled out" push in between makes the newest one different, so a re-scored
// goal at the same score still goes out. If OneSignal can't be read, send.
async function alreadyAnnounced(home, away, scoreText) {
  try {
    const r = await fetch(`https://api.onesignal.com/notifications?app_id=${ONESIGNAL_APP_ID}&limit=20&kind=1`, {
      headers: { Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}` },
    });
    if (!r.ok) return false;
    const { notifications = [] } = await r.json();
    const since = Date.now() / 1000 - 600;
    const forMatch = notifications
      .filter((n) => (n.queued_at || 0) >= since)
      .map((n) => ({ at: n.queued_at, h: n.headings?.he || n.headings?.en || '' }))
      .filter((n) => n.h.includes(home) && n.h.includes(away))
      .sort((a, b) => b.at - a.at);
    const newest = forMatch[0];
    return !!newest && newest.h.startsWith('⚽') && newest.h.includes(scoreText);
  } catch {
    return false;
  }
}

// GOAL's short display names ("Lille", "Atl. Madrid") — our DB names carry typos.
const teamLabel = (fx, side) => (side === 'home' ? fx.homeTeamName : fx.awayTeamName).trim();

function hitsLine(n) {
  if (n === 0) return '😱 אף אחד לא פוגע כרגע בתוצאה המדויקת — כנסו לטבלת הלייב 👉';
  if (n === 1) return '🎯 משתתף אחד פוגע כרגע בתוצאה המדויקת — כנסו לגלות מי בטבלת הלייב 👉';
  return `🎯 ${n} משתתפים פוגעים כרגע בתוצאה המדויקת — כנסו לגלות מי בטבלת הלייב 👉`;
}

async function onGoal(fixtureId, data, mode, sendAfter) {
  const fx = await goal(`/fixtures/${fixtureId}`);
  // The payload's score wins when present — the fixture row can lag a few seconds.
  const hs = Number(data?.homeScore ?? data?.score?.home ?? fx.homeTeamScore);
  const as = Number(data?.awayScore ?? data?.score?.away ?? fx.awayTeamScore);
  const our = await findOurMatch(fx);
  if (!our) return { skipped: 'match not in our DB' };
  const hits = await countExact(our, hs, as);
  // Only goals that leave someone on the exact score are worth a push.
  if (hits === 0) return { skipped: 'nobody hits the new score' };

  let scorer = data?.scorer || data?.player || null;
  let minute = data?.minute || data?.time || null;
  if (!scorer) {
    const events = await goal(`/fixtures/${fixtureId}/events`).catch(() => []);
    const last = events.filter((e) => e.type === 'GOAL' && e.score?.replace(/\s/g, '') === `${hs}-${as}`).pop();
    if (last) { scorer = last.homeScorer || last.awayScorer; minute = last.time; }
  }

  if (mode === 'live' && await alreadyAnnounced(teamLabel(fx, 'home'), teamLabel(fx, 'away'), ` ${hs}-${as} `)) {
    return { skipped: 'duplicate — this score was already announced' };
  }

  const heading = `⚽ גול! ${teamLabel(fx, 'home')} ${hs}-${as} ${teamLabel(fx, 'away')}${scorer ? ` (${scorer}${minute ? ` ${minute}'` : ''})` : ''}`;
  return push({ heading, body: hitsLine(hits), url: `${SITE}/?open=live`, // Minute in the key: a goal ruled out by VAR and then re-scored at the same
  // score is a new goal and must not be deduped against the cancelled one.
  key: `goal:${fixtureId}:${hs}-${as}:${minute || ''}`, mode, sendAfter });
}

// score.changed = the score moved WITHOUT going up — in practice a goal ruled
// out (VAR). Tells everyone the corrected score and who's hitting it now.
async function onScoreChanged(fixtureId, data, mode, sendAfter) {
  const fx = await goal(`/fixtures/${fixtureId}`);
  const hs = Number(data?.homeScore ?? data?.score?.home ?? fx.homeTeamScore);
  const as = Number(data?.awayScore ?? data?.score?.away ?? fx.awayTeamScore);
  // GOAL also fires score.changed at kickoff (SCHEDULED → LIVE, 0-0 → 0-0) —
  // that sent a false "goal ruled out" push for Shakhtar–AEK. Only a real
  // drop in the score is a cancelled goal: the payload must carry the previous
  // score and it must have had more goals on one side.
  const prev = data?.previousScore;
  if (!prev || prev.home == null || prev.away == null) return { skipped: 'no previous score — not a cancellation' };
  const ph = Number(prev.home), pa = Number(prev.away);
  if (!(ph > hs || pa > as) || ph < hs || pa < as) return { skipped: `score did not drop (${ph}-${pa} → ${hs}-${as})` };

  // GOAL can blip the score down for a moment while it rebuilds a match's
  // data (Aston Villa–Fenerbahçe 2-0: both goals re-written at once, a false
  // "goal ruled out" went out). So on a live webhook, wait 45s and re-check:
  // the score must still be below the previous one, and the cut goal must be
  // gone from the events (or marked as cancelled).
  if (mode === 'live') {
    await new Promise((r) => setTimeout(r, 45e3));
    const again = await goal(`/fixtures/${fixtureId}`);
    const nh = Number(again.homeTeamScore), na = Number(again.awayTeamScore);
    if (nh >= ph && na >= pa) return { skipped: `score back to ${nh}-${na} after 45s — data blip, not VAR` };
    const events = await goal(`/fixtures/${fixtureId}/events`).catch(() => []);
    const stillThere = events.some((e) => e.type === 'GOAL'
      && e.score?.replace(/\s/g, '') === `${ph}-${pa}`
      && !/var|cancel|disallow/i.test(e.info || ''));
    if (stillThere) return { skipped: `goal ${ph}-${pa} still in the events after 45s — not VAR` };
  }

  const our = await findOurMatch(fx);
  if (!our) return { skipped: 'match not in our DB' };
  const hits = await countExact(our, hs, as);
  // Goal pushes only go out when someone hits the new score, so only correct
  // a goal that was announced: someone hit the score before it was cut.
  const announced = (await countExact(our, ph, pa)) > 0;
  if (!announced) return { skipped: 'cancelled goal was never announced' };
  const heading = `🖥️❌ השער נפסל — ${teamLabel(fx, 'home')} ${hs}-${as} ${teamLabel(fx, 'away')}`;
  return push({ heading, body: hitsLine(hits), url: `${SITE}/?open=live`, key: `fix:${fixtureId}:${hs}-${as}:${Date.now() - (Date.now() % 600000)}`, mode, sendAfter });
}

// late=true: a manual re-send the day after ("אתמול" instead of "הערב").
async function onFinished(fixtureId, mode, sendAfter, late = false) {
  const fx = await goal(`/fixtures/${fixtureId}`);
  const date = fx.matchDate;
  const night = await goal(`/fixtures/date/${date}?leagueId=${CL_LEAGUE}&limit=100`);
  if (night.some((f) => f.matchStatus !== 'FINISHED')) return { skipped: 'night not over yet' };

  let hits = 0;
  const hitters = new Set();
  for (const f of night) {
    const our = await findOurMatch(f);
    if (!our) continue;
    const ids = await exactHitters(our, Number(f.homeTeamScore), Number(f.awayTeamScore));
    hits += ids.length;
    ids.forEach((id) => hitters.add(id));
  }
  // Up to 3 hitters → congratulate them by name; more → a general cheer
  // with the night's exact-hit count.
  let body;
  if (hits === 0) {
    body = `אף פגיעה מדויקת ${late ? 'אתמול' : 'הערב'} 😟 — כנסו לראות את הטבלה העדכנית 👉`;
  } else if (hitters.size <= 3) {
    const profiles = await supa(`profiles?select=id,display_name&id=in.(${[...hitters].join(',')})`);
    const names = [...hitters].map((id) => profiles.find((p) => p.id === id)?.display_name?.trim()).filter(Boolean);
    body = names.length
      ? `👏 כל הכבוד ל${joinNames(names)} על 🎯 כנסו לטבלה העדכנית 👉`
      : `👏 כל הכבוד לפוגעים, ${hits === 1 ? 'פגיעה מדויקת אחת' : `${hits} פגיעות מדויקות`} 🎯, כנסו לטבלה העדכנית 👉`;
  } else {
    body = `👏 כל הכבוד לפוגעים, ${hits} פגיעות מדויקות 🎯, כנסו לטבלה העדכנית 👉`;
  }
  // Delivered at 23:59 Israel time of the match night (OneSignal send_after);
  // if the night runs past that, push() sends right away. A manual &at= or a
  // test/late re-send keeps its own timing.
  if (!sendAfter && !late && mode !== 'test') {
    const lastKickoff = new Date(Math.max(...night.map((f) => new Date(f.kickoffUtc).getTime())));
    sendAfter = ilEndOfNight(lastKickoff);
  }
  return push({ heading: late ? '🏁 סיכום ערב ליגת האלופות של אתמול' : '🏁 ערב ליגת האלופות הסתיים!', body, url: `${SITE}/?open=leaderboard`, key: `night:${date}`, mode, sendAfter });
}

async function readRaw(req) {
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  // Body already consumed by the runtime's parser — re-serialise (GOAL sends compact JSON).
  return raw || (req.body ? JSON.stringify(req.body) : '');
}

function verify(raw, header) {
  const secret = process.env.GOAL_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')));
  if (!parts.t || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${parts.t}.${raw}`).digest('hex');
  const a = Buffer.from(parts.v1, 'hex');
  const b = Buffer.from(expected, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function goalWebhookHandler(req, res) {
  // Manual run (GET, keyed with our GOAL API key) — builds the push for any
  // past fixture; &send=test delivers it to Test Users only, &send=live to
  // everyone (only when the owner explicitly asks for a broadcast).
  // /api/football?source=goal-webhook&event=goal.scored&fixtureId=…[&send=test]
  if (req.method === 'GET') {
    if (req.headers['x-admin-key'] !== process.env.GOAL_API_KEY) return res.status(401).json({ error: 'unauthorized' });
    const { event, fixtureId } = req.query;
    const mode = ['test', 'live'].includes(req.query.send) ? req.query.send : 'dry';
    // &at=<ISO time> schedules the test push (OneSignal send_after).
    const sendAfter = req.query.at ? new Date(req.query.at) : undefined;
    try {
      const out = event === 'match.finished' ? await onFinished(fixtureId, mode, sendAfter, req.query.late === '1')
        : event === 'score.changed' ? await onScoreChanged(fixtureId, req.query.prevHome != null ? { previousScore: { home: req.query.prevHome, away: req.query.prevAway } } : {}, mode, sendAfter)
        : await onGoal(fixtureId, {}, mode, sendAfter);
      return res.status(200).json(out);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
  if (req.method !== 'POST') return res.status(405).end();

  const raw = await readRaw(req);
  if (!verify(raw, req.headers['x-goal-signature'])) {
    console.warn('[goal-webhook] bad signature');
    return res.status(401).end();
  }

  let event;
  try { event = JSON.parse(raw); } catch { return res.status(400).end(); }
  const data = event.data || {};
  const fixtureId = data.fixtureId || data.fixture?.id || data.matchId || data.id;
  console.log('[goal-webhook]', event.event, JSON.stringify(data).slice(0, 800));

  // Always answer 200 once the signature checks out — every GOAL retry costs
  // quota, and a failure here won't succeed on a retry anyway.
  try {
    if (!fixtureId) return res.status(200).json({ skipped: 'no fixture id' });
    let out = { ignored: event.event };
    if (event.event === 'goal.scored') out = await onGoal(fixtureId, data, 'live');
    else if (event.event === 'score.changed') out = await onScoreChanged(fixtureId, data, 'live');
    else if (event.event === 'match.finished') out = await onFinished(fixtureId, 'live');
    console.log('[goal-webhook] result', JSON.stringify(out).slice(0, 500));
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[goal-webhook] error', e.message);
    return res.status(200).json({ ok: false });
  }
}
