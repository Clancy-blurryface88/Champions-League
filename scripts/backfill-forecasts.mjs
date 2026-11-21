// Backfill the round score forecasts for rounds that ended before the feature (21.11.2026): for every
// player and every finished round, the forecast as it would have been made from the rounds before it.
// Rows are marked backfill (the end-of-round screen never pops up for them) and real rows are kept.
// Usage: node scripts/backfill-forecasts.mjs
import fs from 'fs';
import { computeForecast } from '../src/utils/forecastCalc.js';

const ENV = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const KEY = ENV.match(/^SUPABASE_SERVICE_KEY=(.*)$/m)[1].replace(/["\r]/g, '').trim();
const URL_ = 'https://ystqjbvlrrahzmvelafu.supabase.co/rest/v1/';
const H = { Authorization: `Bearer ${KEY}`, apikey: KEY };
async function all(table, sel = '*') {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const r = await fetch(`${URL_}${table}?select=${sel}&order=id`, { headers: { ...H, Range: `${from}-${from + 999}` } });
    const rows = await r.json(); out.push(...rows); if (rows.length < 1000) break;
  }
  return out;
}
const [rounds, matches, preds] = await Promise.all([all('rounds', 'id,order,name'), all('matches'), all('predictions')]);
const mById = Object.fromEntries(matches.map((m) => [m.id, m]));
const order = Object.fromEntries(rounds.map((r) => [r.id, Number(r.order)]));
const done = rounds.filter((r) => { const ms = matches.filter((m) => m.round_id === r.id); return ms.length && ms.every((m) => m.is_score_calculated); });
const users = [...new Set(preds.map((p) => p.user_id))];
const rows = [];
for (const u of users) {
  const mine = preds.filter((p) => p.user_id === u && mById[p.match_id]);
  for (const r of done) {
    const now = mine.filter((p) => mById[p.match_id].round_id === r.id).map((p) => ({ match: mById[p.match_id], a: Number(p.predicted_score_a), b: Number(p.predicted_score_b) }));
    if (!now.length) continue;
    const past = mine.filter((p) => order[mById[p.match_id].round_id] < order[r.id] && mById[p.match_id].is_score_calculated).map((p) => ({ match: mById[p.match_id], prediction: p }));
    rows.push({ user_id: u, round_id: r.id, ...computeForecast(past, now), backfill: true });
  }
}
// insert only where there is no row yet
const res = await fetch(`${URL_}round_forecasts?on_conflict=user_id,round_id`, { method: 'POST', headers: { ...H, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify(rows) });
console.log('rounds done:', done.map((r) => r.order).join(','), '· rows:', rows.length, '· insert', res.status, res.ok ? '' : await res.text());
