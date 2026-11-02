// Handler (mounted via GET /api/football?source=odds) — pulls one round's
// Champions League odds from OddsPapi (oddspapi.io), in the shape of the match
// card's fields: the exact-score table (from 888sport — the site the admin used
// to screenshot), 1X2, both teams score and goals 0-2/3-4/5+ (from bwin, the
// site those were taken from by hand). Read-only: it returns the values and the
// admin page writes them, like a manual edit. Only signed-in admins.
//
// Two steps, each 1 request of the free plan's 250 a month:
//   ?round=<id>  → the round's matches and their OddsPapi fixtures
//   ?event=<id>  → one match's odds (every market of every bookmaker in one call)
// Goals bands come from the over/under lines: 0-2 = under 2.5, 5+ = over 4.5,
// 3-4 = what's between them. Every price rounds UP to 0.05 (23 stays 23).
// A score missing from 888's table counts as "any other score" (200).
import { supa } from './_goalWebhook.js';
import { adminFromToken } from './_adminPush.js';

const API = 'https://api.oddspapi.io/v4';
const UCL = 7; // OddsPapi tournamentId of the UEFA Champions League
const OTHER_SCORE = 200;
const CHAIN = {
  score: ['888sport', '888sport.dk', '888sport.ca'],
  h2h: ['bwin', '888sport', 'coral', 'ladbrokes'],
  btts: ['bwin', '888sport', 'coral', 'ladbrokes'],
  bands: ['bwin', '888sport', 'coral', 'ladbrokes'],
};
const BOOKS = [...new Set(Object.values(CHAIN).flat())];
const NAMES = { '888sport': '888sport', '888sport.dk': '888sport', '888sport.ca': '888sport', bwin: 'bwin', coral: 'Coral', ladbrokes: 'Ladbrokes' };
// OddsPapi market / outcome ids (from /v4/markets)
const M = {
  result: [101, { 1: 101, X: 102, 2: 103 }],
  btts: [104, { yes: 104, no: 105 }],
  ou25: [1010, { over: 1010, under: 1011 }],
  ou45: [1014, { over: 1014, under: 1015 }],
  score: 10336, // outcomes 10336 + home + 8 × away, for 0..7 goals a side
};

// 2.62 → 2.65, 1.41 → 1.45, 1.70 stays
export const roundUp05 = (x) => Number((Math.ceil(x * 20 - 1e-9) / 20).toFixed(2));

// "Atlético Madrid" ~ "Atletico Madrid", "Sabah FC" ~ "Sabah Masazir", "Bodø" ~ "Bodoe"
const words = (s) => s.toLowerCase().replace(/ø/g, 'o').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z ]/g, ' ').split(' ').filter((w) => w.length >= 3);
const like = (a, b) => { const B = words(b); return words(a).filter((w) => B.some((v) => v.slice(0, 4) === w.slice(0, 4))).length; };

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function papi(path) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(`${API}${path}${path.includes('?') ? '&' : '?'}apiKey=${process.env.ODDS_PAPI_KEY}`);
    if (r.status === 429 && attempt < 3) {
      const body = await r.text();
      if (/REQUEST_LIMIT_EXCEEDED/.test(body)) throw new Error('נגמרו הבקשות של החודש');
      await wait(1500 * (attempt + 1)); // per-endpoint cooldown — back off and retry
      continue;
    }
    if (!r.ok) throw new Error(`OddsPapi ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return r.json();
  }
}
// the month's usage — /v4/account is not counted
async function usage() {
  try {
    const a = await papi('/account');
    const s = a.subscriptions?.find((x) => x.is_active) || a.subscriptions?.[0];
    return s ? { used: s.request_count, left: s.request_limit - s.request_count, last: 1 } : null;
  } catch { return null; }
}

// Our match ↔ an OddsPapi fixture: kickoff within 3h and the team names alike.
// swapped → the fixture lists our team_a second.
export function findEvent(m, fixtures) {
  const t = new Date(m.match_date).getTime();
  let best = null;
  for (const f of fixtures) {
    if (Math.abs(new Date(f.startTime).getTime() - t) > 3 * 3600e3) continue;
    const straight = like(m.team_a, f.participant1Name) + like(m.team_b, f.participant2Name);
    const swapped = like(m.team_a, f.participant2Name) + like(m.team_b, f.participant1Name);
    const score = Math.max(straight, swapped);
    if (score > 0 && (!best || score > best.score)) best = { f, score, swapped: swapped > straight };
  }
  return best;
}

// The card's fields from one fixture's odds; a category no bookmaker has is listed in `missing`.
export function fieldsFrom(fx, swapped) {
  const price = (book, market, outcome) => {
    const p = fx.bookmakerOdds?.[book]?.markets?.[market]?.outcomes?.[outcome]?.players?.['0'];
    return p?.active !== false && p?.price > 1 ? p.price : null;
  };
  const first = (chain, get) => { for (const k of chain) { const v = get(k); if (v) return { v, from: k }; } return null; };

  const score = first(CHAIN.score, (b) => {
    const table = {};
    for (let h = 0; h <= 7; h++) for (let a = 0; a <= 7; a++) {
      const p = price(b, M.score, M.score + h + 8 * a);
      if (p) table[swapped ? `${a}:${h}` : `${h}:${a}`] = roundUp05(p);
    }
    return Object.keys(table).length ? { score_odds: { ...table, other: OTHER_SCORE } } : null;
  });
  const h2h = first(CHAIN.h2h, (b) => {
    const [id, o] = M.result;
    const [p1, x, p2] = [price(b, id, o[1]), price(b, id, o.X), price(b, id, o[2])];
    if (!p1 || !x || !p2) return null;
    return { home_win_points: swapped ? p2 : p1, draw_points: x, away_win_points: swapped ? p1 : p2 };
  });
  const btts = first(CHAIN.btts, (b) => {
    const [id, o] = M.btts;
    const [yes, no] = [price(b, id, o.yes), price(b, id, o.no)];
    return yes && no ? { btts_yes_points: yes, btts_no_points: no } : null;
  });
  const bands = first(CHAIN.bands, (b) => {
    const [u25, o25] = [price(b, M.ou25[0], M.ou25[1].under), price(b, M.ou25[0], M.ou25[1].over)];
    const [u45, o45] = [price(b, M.ou45[0], M.ou45[1].under), price(b, M.ou45[0], M.ou45[1].over)];
    if (!u25 || !o25 || !u45 || !o45) return null;
    // fair chance of 3-4 goals = 1 − P(under 2.5) − P(over 4.5), priced with the 2.5 line's margin
    const m25 = 1 / u25 + 1 / o25, m45 = 1 / u45 + 1 / o45;
    const p34 = 1 - (1 / u25) / m25 - (1 / o45) / m45;
    return { goals_0_2_points: u25, goals_3_4_points: 1 / p34 / m25, goals_5_plus_points: o45 };
  });

  const values = {};
  const sources = {};
  const missing = [];
  for (const [cat, got, label] of [['score', score, 'תוצאה מדויקת'], ['h2h', h2h, '1X2'], ['btts', btts, 'שתי הקבוצות מבקיעות'], ['bands', bands, 'טווח שערים']]) {
    if (!got) { missing.push(label); continue; }
    Object.entries(got.v).forEach(([f, x]) => { values[f] = typeof x === 'number' ? roundUp05(x) : x; });
    sources[cat] = NAMES[got.from] || got.from;
  }
  return { values, sources, missing };
}

export async function oddsHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!(await adminFromToken(token))) return res.status(403).json({ error: 'admins only' });
  if (!process.env.ODDS_PAPI_KEY) return res.status(500).json({ error: 'Missing ODDS_PAPI_KEY' });
  const roundId = String(req.query.round || '');
  const eventId = String(req.query.event || '');

  try {
    // the month's usage only (free) — shown when the page opens
    if (req.query.usage) return res.status(200).json({ credits: await usage() });
    // Step 2 — one match. The page calls this once per match, one after another,
    // so a long round never hits the function time limit, and a failure loses
    // only that match.
    if (eventId) {
      if (!/^id\d+$/.test(eventId)) return res.status(400).json({ error: 'bad event' });
      const fx = await papi(`/odds?fixtureId=${eventId}&bookmakers=${BOOKS.join(',')}&oddsFormat=decimal`);
      return res.status(200).json({ ...fieldsFrom(fx, req.query.swapped === '1'), credits: await usage() });
    }
    // Step 1 — the round's matches and their fixtures
    if (!/^[0-9a-f-]{36}$/i.test(roundId)) return res.status(400).json({ error: 'round required' });
    const matches = await supa(`matches?select=id,team_a,team_b,match_date,is_finished&round_id=eq.${roundId}&order=match_date`);
    const upcoming = matches.filter((m) => !m.is_finished && new Date(m.match_date) > new Date());
    // no request when nothing is left to pull (a past round)
    const fixtures = upcoming.length ? await papi(`/fixtures?tournamentId=${UCL}&statusId=0`) : [];
    const rows = matches.map((m) => {
      const row = { id: m.id, team_a: m.team_a.trim(), team_b: m.team_b.trim(), match_date: m.match_date };
      // a match that started keeps its odds — points may already be counted by them
      if (!upcoming.includes(m)) return { ...row, skipped: 'המשחק כבר התחיל' };
      const hit = findEvent(m, fixtures);
      if (!hit || !hit.f.hasOdds) return { ...row, skipped: 'עוד אין יחסים אצל ספק היחסים' };
      return { ...row, eventId: hit.f.fixtureId, swapped: hit.swapped, event: `${hit.f.participant1Name} – ${hit.f.participant2Name}` };
    });
    return res.status(200).json({ rows, credits: await usage() });
  } catch (e) {
    console.error('[odds]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
