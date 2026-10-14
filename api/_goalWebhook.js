// Handler (mounted via POST /api/football?source=goal-webhook — Hobby plan caps
// us at 12 functions) — receives GOAL API webhooks and sends OneSignal pushes:
//   goal.scored    → "⚽ גול! …" + how many players currently hold the exact score
//   score.changed  → correction push (goal ruled out by VAR) with the new count
//   match.finished → once the night's last CL match ends, a summary push with
//                    the night's exact-score hits.
// Pushes go to every subscriber (no per-user targeting yet). Each push carries
// an idempotency key, so GOAL's retries (and two matches finishing together)
// never send the same push twice.
import crypto from 'crypto';

const GOAL_BASE = 'https://api.goal-api.com/v1';
const CL_LEAGUE = 'cmr77dw3900f5rx06j05wgzv4';
const ONESIGNAL_APP_ID = '9c8b733e-9d73-41bb-b092-ae462aa5cdb1';
const SITE = 'https://champions-league-2026.vercel.app';

// GOAL team id → our team name (matches.team_a/team_b, compared trimmed +
// lowercased — the DB names carry stray spaces and typos on purpose).
const TEAM_BY_GOAL_ID = {
  cmr7foowe2kf3rx06u6eu3rhl: 'Arsenal', cmr7hvawd3yvgrx06qjdxxr4v: 'Aston villa', cmrib5shdfmxalb07sx4orfri: 'AEK Athens',
  cmr7fp1we2n8rrx066zdyo70w: 'Atletico Madrid', cmr7m55u15efyrx06ndeg0510: 'Barcelona', cmr79jab703zerx06eqilba4s: 'Bayern Munich',
  cmr7m55uo5eg8rx06hlsjolr6: 'Real Betis', cmr7qedkz6y2rrx067li8of8c: 'Bodø/Glimt', cmri4ql11dmzulb07v3q9pnmj: 'Club Brugge',
  cmr7m6brl5t30rx06i2fz3gmw: 'Como', cmr79jabe03zfrx061s6b1xiw: 'Dortmund', cmr7upbul8vobrx06j8bdlukj: 'Porto',
  cmri0ey3gb6jzlb07w6sj8iaq: 'Fenerbahce', cmr7qeuoo746xrx06gpaowm5g: 'Feyenoord', cmri0ey53b6kulb07e541svio: 'Galatasaray',
  cmr7fp1wj2n8urx061yv6ov5t: 'Inter', cmr7hu9t63l1jrx06d0t9rema: 'Lask', cmr7oa1g86g0srx06rgl26fqf: 'RC Lens',
  cmr7oa1go6g16rx06ws7j9hiq: 'LOSC LIlle', cmr7hvad33yp7rx06q6tlbmde: 'Liverpool', cmr7fpx0e2ybgrx06dajtxqc1: 'Manchaster City',
  cmr7fp1wp2n8yrx061vxmb1a5: 'Manchester United', cmr7m6br45t2orx06ql4em344: 'Napoli', cmr7oa1gr6g19rx06g1miy6jr: 'Paris',
  cmr7qeuox746zrx06n7udaoim: 'PSV', cmr79jabm03zmrx06phgewkx5: 'Leipzig', cmr7fp1wf2n8srx06b3wila7x: 'Real Madrid',
  cmr7m6brt5t37rx06ixsgl3rc: 'AS Roma', cmri0gkbgbr6mlb07s324klf3: 'Sabah FC', cmri911gbf1a8lb07eetvoj7d: 'Shakhtar Donetsk',
  cmri4pzegddctlb07j7xenzfd: 'Slavia Prague', cmri2lbvwcmvmlb07i45ou65m: 'Slovan Bratislava', cmr7upbvc8vorrx06s3awvvn9: 'Sporting Lisbon',
  cmr79jabg03zhrx06z7qf1z8v: 'Stuttgart', cmr7m55u85eg1rx06wsvtxyr5: 'Villarreal', cmr7qedl26y2trx06nvff2rj6: 'Viking',
};
const norm = (s) => (s || '').trim().toLowerCase();

async function goal(path) {
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
async function findOurMatch(fx) {
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

async function countExact(our, homeScore, awayScore) {
  const preds = await supa(`predictions?select=predicted_score_a,predicted_score_b&match_id=eq.${our.match.id}`);
  const [a, b] = our.swapped ? [awayScore, homeScore] : [homeScore, awayScore];
  return preds.filter((p) => p.predicted_score_a === a && p.predicted_score_b === b).length;
}

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

  let scorer = data?.scorer || data?.player || null;
  let minute = data?.minute || data?.time || null;
  if (!scorer) {
    const events = await goal(`/fixtures/${fixtureId}/events`).catch(() => []);
    const last = events.filter((e) => e.type === 'GOAL' && e.score?.replace(/\s/g, '') === `${hs}-${as}`).pop();
    if (last) { scorer = last.homeScorer || last.awayScorer; minute = last.time; }
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
  const our = await findOurMatch(fx);
  if (!our) return { skipped: 'match not in our DB' };
  const hits = await countExact(our, hs, as);
  const heading = `❌ השער נפסל — ${teamLabel(fx, 'home')} ${hs}-${as} ${teamLabel(fx, 'away')}`;
  return push({ heading, body: hitsLine(hits), url: `${SITE}/?open=live`, key: `fix:${fixtureId}:${hs}-${as}:${Date.now() - (Date.now() % 600000)}`, mode, sendAfter });
}

async function onFinished(fixtureId, mode, sendAfter) {
  const fx = await goal(`/fixtures/${fixtureId}`);
  const date = fx.matchDate;
  const night = await goal(`/fixtures/date/${date}?leagueId=${CL_LEAGUE}&limit=100`);
  if (night.some((f) => f.matchStatus !== 'FINISHED')) return { skipped: 'night not over yet' };

  let hits = 0;
  for (const f of night) {
    const our = await findOurMatch(f);
    if (our) hits += await countExact(our, Number(f.homeTeamScore), Number(f.awayTeamScore));
  }
  const body = hits === 0
    ? `אף פגיעה מדויקת הערב ב-${night.length} משחקים 😱 — כנסו לראות את הטבלה העדכנית 👉`
    : `🎯 ${hits === 1 ? 'פגיעה מדויקת אחת' : `${hits} פגיעות מדויקות`} הערב ב-${night.length} משחקים — כנסו לראות את הטבלה העדכנית 👉`;
  return push({ heading: '🏁 ערב ליגת האלופות הסתיים!', body, url: `${SITE}/?open=leaderboard`, key: `night:${date}`, mode, sendAfter });
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
  // past fixture; &send=test also delivers it to Test Users only.
  // /api/football?source=goal-webhook&event=goal.scored&fixtureId=…[&send=test]
  if (req.method === 'GET') {
    if (req.headers['x-admin-key'] !== process.env.GOAL_API_KEY) return res.status(401).json({ error: 'unauthorized' });
    const { event, fixtureId } = req.query;
    const mode = req.query.send === 'test' ? 'test' : 'dry';
    // &at=<ISO time> schedules the test push (OneSignal send_after).
    const sendAfter = req.query.at ? new Date(req.query.at) : undefined;
    try {
      const out = event === 'match.finished' ? await onFinished(fixtureId, mode, sendAfter)
        : event === 'score.changed' ? await onScoreChanged(fixtureId, {}, mode, sendAfter)
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
