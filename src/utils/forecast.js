import { supabase } from '@/api/supabase';
import { Match, Prediction, Round } from '@/api/entities';

// The round's score forecast (21.11.2026): the database side — stored on every send, read at the round's end.
// The calculation itself is in forecastCalc.js.
import { computeForecast2, earned } from './forecastCalc';
const CATS = ['oc', 'gr', 'bt', 'ex'];
const n = (x) => (x == null || x === '' ? 0 : Number(x));

// everything from the database for one player and one round, then the forecast, stored for the round's end
export async function forecastAndSave(userId, roundId, picks) {
  const [mine, matches] = await Promise.all([Prediction.filter({ user_id: userId }), Match.list()]);
  const byId = Object.fromEntries(matches.map((m) => [m.id, m]));
  const past = mine.filter((p) => byId[p.match_id]?.is_score_calculated && byId[p.match_id].round_id !== roundId).map((p) => ({ match: byId[p.match_id], prediction: p }));
  const now = picks.filter((x) => byId[x.match_id]).map((x) => ({ match: byId[x.match_id], a: n(x.a), b: n(x.b) }));
  if (!now.length) return null;
  const f = computeForecast2(past, now, matches);
  try {
    await supabase.from('round_forecasts').upsert({ user_id: userId, round_id: roundId, ...f, updated_at: new Date().toISOString() }, { onConflict: 'user_id,round_id' });
  } catch (e) { console.warn('forecast not saved', e); }
  return f;
}

// the stored forecast for a round, and what was really earned (per kind too)
export async function forecastResult(userId, roundId) {
  const { data: f } = await supabase.from('round_forecasts').select('*').eq('user_id', userId).eq('round_id', roundId).maybeSingle();
  if (!f) return null;
  const [mine, matches] = await Promise.all([Prediction.filter({ user_id: userId }), Match.filter({ round_id: roundId })]);
  const ids = new Set(matches.map((m) => m.id));
  const act = { oc: 0, gr: 0, bt: 0, ex: 0 }; let total = 0;
  for (const p of mine) if (ids.has(p.match_id)) { const g = earned(p); for (const c of CATS) act[c] += g[c]; total += n(p.points_earned); }
  return { forecast: f, actual: +total.toFixed(2), actCats: act, done: matches.length > 0 && matches.every((m) => m.is_score_calculated) };
}

// every finished round with a forecast (real or backfilled): its forecast and what was really earned
export async function forecastHistory(userId) {
  const { data: fs } = await supabase.from('round_forecasts').select('round_id,fc,lo,hi').eq('user_id', userId);
  if (!fs?.length) return [];
  const [mine, matches, rounds] = await Promise.all([Prediction.filter({ user_id: userId }), Match.list(), Round.list('order')]);
  const out = [];
  for (const f of fs) {
    const ms = matches.filter((m) => m.round_id === f.round_id);
    if (!ms.length || !ms.every((m) => m.is_score_calculated)) continue;
    const ids = new Set(ms.map((m) => m.id));
    const actual = mine.filter((p) => ids.has(p.match_id)).reduce((s, p) => s + n(p.points_earned), 0);
    out.push({ round_id: f.round_id, order: Number(rounds.find((r) => r.id === f.round_id)?.order) || 0, fc: Number(f.fc), actual: +actual.toFixed(2) });
  }
  return out.sort((a, b) => a.order - b.order);
}
