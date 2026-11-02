// Handler (mounted via GET /api/football?source=odds&round=<id>) — pulls the
// odds of one round's Champions League matches from The Odds API, in the
// shape of the match card's fields (1X2, both teams score, goals 0-2/3-4/5+).
// Read-only: it returns the values and the admin page writes them, like a
// manual edit. Only signed-in admins (Supabase token → profiles.is_admin).
//
// Two steps: ?round=<id> lists the matches and their events (free); ?event=<id>
// pulls one match (region uk, 3 markets = 3 credits; the free plan has
// 500 a month). Each category comes from the first bookmaker in its chain
// that has it. Goals bands from the over/under lines: 0-2 = under 2.5,
// 5+ = over 4.5, 3-4 = what's between them. Every price rounds UP to 0.05.
// Exact-score odds are not here: they still come from the 888 screenshot.
import { supa } from './_goalWebhook.js';
import { adminFromToken } from './_adminPush.js';

const API = 'https://api.the-odds-api.com/v4/sports/soccer_uefa_champs_league';
const CHAIN = {
  h2h: ['coral', 'ladbrokes_uk', 'leovegas', 'williamhill'],
  btts: ['coral', 'ladbrokes_uk', 'leovegas', 'williamhill'],
  bands: ['coral', 'ladbrokes_uk', 'leovegas', 'livescorebet', 'virginbet'],
};
const NAMES = { coral: 'Coral', ladbrokes_uk: 'Ladbrokes', leovegas: 'LeoVegas', williamhill: 'William Hill', livescorebet: 'LiveScoreBet', virginbet: 'Virgin Bet' };

// 2.62 → 2.65, 1.41 → 1.45, 1.70 stays
export const roundUp05 = (x) => Number((Math.ceil(x * 20 - 1e-9) / 20).toFixed(2));

// "Atlético Madrid" ~ "Atletico Madrid", "Sabah FK" ~ "Sabah FC", "PSV Eindhoven" ~ "PSV"
const words = (s) => s.toLowerCase().replace(/ø/g, 'o').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z ]/g, ' ').split(' ').filter((w) => w.length >= 3);
const like = (a, b) => { const B = words(b); return words(a).filter((w) => B.some((v) => v.slice(0, 4) === w.slice(0, 4))).length; };

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// credits: { used, left, last } from the response headers (last = this call's cost)
async function oddsApi(path) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(`${API}${path}${path.includes('?') ? '&' : '?'}apiKey=${process.env.ODDS_API_KEY}`);
    const h = (k) => (r.headers.get(k) == null ? null : Number(r.headers.get(k)));
    const credits = { used: h('x-requests-used'), left: h('x-requests-remaining'), last: h('x-requests-last') };
    // "Requests are too frequent" — back off and try again
    if (r.status === 429 && attempt < 3) {
      const body = await r.text();
      if (!/FREQ/.test(body)) throw new Error(`Odds API 429: ${body.slice(0, 200)}`);
      await wait(1500 * (attempt + 1));
      continue;
    }
    if (!r.ok) throw new Error(`Odds API ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return { data: await r.json(), credits };
  }
}

// Our match ↔ the API's event: kickoff within 3h and the team names alike.
// swapped → the API lists our team_a as the away side.
export function findEvent(m, events) {
  const t = new Date(m.match_date).getTime();
  let best = null;
  for (const e of events) {
    if (Math.abs(new Date(e.commence_time).getTime() - t) > 3 * 3600e3) continue;
    const straight = like(m.team_a, e.home_team) + like(m.team_b, e.away_team);
    const swapped = like(m.team_a, e.away_team) + like(m.team_b, e.home_team);
    const score = Math.max(straight, swapped);
    if (score > 0 && (!best || score > best.score)) best = { e, score, swapped: swapped > straight };
  }
  return best;
}

// The card's fields from one event's bookmakers; null where no bookmaker has it.
export function fieldsFrom(event, swapped) {
  const book = (key) => event.bookmakers.find((b) => b.key === key);
  const market = (key, m) => book(key)?.markets.find((x) => x.key === m)?.outcomes;
  const first = (chain, get) => { for (const k of chain) { const v = get(k); if (v) return { v, from: k }; } return null; };

  const h2h = first(CHAIN.h2h, (k) => {
    const o = market(k, 'h2h'); if (!o) return null;
    const p = (n) => o.find((x) => x.name === n)?.price;
    const [home, away] = swapped ? [p(event.away_team), p(event.home_team)] : [p(event.home_team), p(event.away_team)];
    return home && away && p('Draw') ? { home_win_points: home, draw_points: p('Draw'), away_win_points: away } : null;
  });
  const btts = first(CHAIN.btts, (k) => {
    const o = market(k, 'btts'); if (!o) return null;
    const p = (n) => o.find((x) => x.name === n)?.price;
    return p('Yes') && p('No') ? { btts_yes_points: p('Yes'), btts_no_points: p('No') } : null;
  });
  const bands = first(CHAIN.bands, (k) => {
    const o = market(k, 'alternate_totals'); if (!o) return null;
    const p = (n, pt) => o.find((x) => x.name === n && x.point === pt)?.price;
    const [u25, o25, u45, o45] = [p('Under', 2.5), p('Over', 2.5), p('Under', 4.5), p('Over', 4.5)];
    if (!u25 || !o25 || !u45 || !o45) return null;
    // fair chance of 3-4 goals = 1 − P(under 2.5) − P(over 4.5), priced with the 2.5 line's margin
    const m25 = 1 / u25 + 1 / o25, m45 = 1 / u45 + 1 / o45;
    const p34 = 1 - (1 / u25) / m25 - (1 / o45) / m45;
    return { goals_0_2_points: u25, goals_3_4_points: 1 / p34 / m25, goals_5_plus_points: o45 };
  });

  const values = {};
  const sources = {};
  const missing = [];
  for (const [cat, got, label] of [['h2h', h2h, '1X2'], ['btts', btts, 'שתי הקבוצות מבקיעות'], ['bands', bands, 'טווח שערים']]) {
    if (!got) { missing.push(label); continue; }
    Object.entries(got.v).forEach(([f, x]) => { values[f] = roundUp05(x); });
    sources[cat] = NAMES[got.from] || got.from;
  }
  return { values, sources, missing };
}

export async function oddsHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!(await adminFromToken(token))) return res.status(403).json({ error: 'admins only' });
  if (!process.env.ODDS_API_KEY) return res.status(500).json({ error: 'Missing ODDS_API_KEY' });
  const roundId = String(req.query.round || '');
  const eventId = String(req.query.event || '');

  try {
    // Step 2 — one match's odds (3 credits). The page calls this once per match,
    // one after another, so a long round never hits the function time limit or
    // the frequency limit, and a failure loses only that match.
    if (eventId) {
      if (!/^[0-9a-f]{32}$/i.test(eventId)) return res.status(400).json({ error: 'bad event' });
      const r = await oddsApi(`/events/${eventId}/odds?regions=uk&markets=h2h,btts,alternate_totals&oddsFormat=decimal`);
      return res.status(200).json({ ...fieldsFrom(r.data, req.query.swapped === '1'), credits: r.credits });
    }
    // Step 1 — the round's matches and their events (the events list is free)
    if (!/^[0-9a-f-]{36}$/i.test(roundId)) return res.status(400).json({ error: 'round required' });
    const matches = await supa(`matches?select=id,team_a,team_b,match_date,is_finished&round_id=eq.${roundId}&order=match_date`);
    const { data: events, credits } = await oddsApi('/events');
    const rows = matches.map((m) => {
      const row = { id: m.id, team_a: m.team_a.trim(), team_b: m.team_b.trim(), match_date: m.match_date };
      // a match that started keeps its odds — points may already be counted by them
      if (m.is_finished || new Date(m.match_date) <= new Date()) return { ...row, skipped: 'המשחק כבר התחיל' };
      const hit = findEvent(m, events);
      if (!hit) return { ...row, skipped: 'לא נמצא אצל ספק היחסים' };
      return { ...row, eventId: hit.e.id, swapped: hit.swapped, event: `${hit.e.home_team} – ${hit.e.away_team}` };
    });
    return res.status(200).json({ rows, credits });
  } catch (e) {
    console.error('[odds]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
