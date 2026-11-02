// Auto-finish pilot (round 4, 3.11.2026) — closes chosen matches by itself.
// Run from the reminders trigger (every 5 min). For each pilot match that
// kicked off over 100 minutes ago and is still open, it reads the final score
// from GOAL and from UEFA; only when BOTH say finished with the SAME score
// does it write the match card like the admin's manual save (finished toggle,
// score, is_score_calculated=false, league-table override cleared). In 'calc'
// mode it then calculates the points — the same rules and writes as the
// admin's "Calculate Scores", for that match only. The admin gets a push on
// every close, and one when the sources disagree or never finish.
import { goal, supa, findOurMatch, push } from './_goalWebhook.js';
import { getUefaMatchesByDate } from './_uefaContext.js';

// matchId → 'score' (close only; the admin calculates) | 'calc' (close + calculate)
const PILOT = {
  'cc38c6a8-d581-4ea1-b5d7-cc9abccf0862': 'score', // Galatasaray – Stuttgart 19:45
  '08e48671-e9eb-42e1-9684-c0131f8cc372': 'score', // Shakhtar Donetsk – Sporting Lisbon 19:45
  'c3bf5871-4120-40e7-a4d0-bb041fd2aaea': 'calc', // Barcelona – Aston villa 22:00
  'a17062ee-4e43-44cf-8848-d9f9ef6c8919': 'calc', // Manchester United – AS Roma 22:00
};
const CL_LEAGUE = 'cmr77dw3900f5rx06j05wgzv4';
const SITE = 'https://champions-league-2026.vercel.app';
const START_AFTER_MS = 100 * 60e3; // no check before 100 min after kickoff
const GIVE_UP_MS = 3.5 * 3600e3; // still not closed 3.5h after kickoff → tell the admin

async function supaWrite(method, path, body) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;
  const r = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(`Supabase ${method} ${path.split('?')[0]}: ${r.status} ${(await r.text()).slice(0, 200)}`);
}
// every row of a table (the REST API returns at most 1000 per call)
async function supaAll(path) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const rows = await supa(`${path}${path.includes('?') ? '&' : '?'}limit=1000&offset=${from}`);
    out.push(...rows);
    if (rows.length < 1000) return out;
  }
}

// UEFA's names carry 3-letter codes ("mun" = Man Utd), so short names must
// match exactly; longer ones by containment or the same first word
// (same rules as the admin's finish check).
const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
function sameTeam(ours, names) {
  const w = norm(ours), wFirst = w.split(/\s+/)[0];
  return names.some((n) => {
    const c = norm(n);
    if (c === w) return true;
    if (c.length <= 4 || w.length <= 4) return false;
    if (c.startsWith(w) || w.startsWith(c) || c.includes(w) || w.includes(c)) return true;
    return wFirst.length >= 4 && wFirst === c.split(/\s+/)[0];
  });
}

// Final score in our team_a/team_b order, or { pending } / null (not found).
export async function goalFinal(m) {
  const day = m.match_date.slice(0, 10);
  const night = await goal(`/fixtures/date/${day}?leagueId=${CL_LEAGUE}&limit=100`);
  for (const f of night) {
    const our = await findOurMatch(f);
    if (our?.match.id !== m.id) continue;
    if (f.matchStatus !== 'FINISHED') return { pending: f.matchStatus };
    const [h, w] = [Number(f.homeTeamScore), Number(f.awayTeamScore)];
    return our.swapped ? { a: w, b: h } : { a: h, b: w };
  }
  return null;
}
export async function uefaFinal(m, uefaDay) {
  const t = new Date(m.match_date).getTime();
  const near = uefaDay.filter((u) => Math.abs(new Date(u.utcDate).getTime() - t) <= 3 * 3600e3);
  const names = (side) => [side.name, side.shortName];
  // the UEFA match where the most sides match (one is enough — "Manchaster City"
  // is a typo of ours); a tie between two matches is no pairing, not a guess
  const scored = near.map((u) => {
    const straight = sameTeam(m.team_a, names(u.homeTeam)) + sameTeam(m.team_b, names(u.awayTeam));
    const swapped = sameTeam(m.team_a, names(u.awayTeam)) + sameTeam(m.team_b, names(u.homeTeam));
    return { u, s: Math.max(straight, swapped), swapped: swapped > straight };
  }).filter((x) => x.s > 0).sort((x, y) => y.s - x.s);
  if (!scored.length || (scored.length > 1 && scored[0].s === scored[1].s)) return null;
  const { u, swapped } = scored[0];
  if (u.status !== 'FINISHED') return { pending: u.status };
  const { home, away } = u.score.fullTime;
  if (home == null || away == null) return { pending: 'no score' };
  return swapped ? { a: away, b: home } : { a: home, b: away };
}

// Points of one prediction, broken down like AdminScoring.calculateScore.
export function breakdown(p, m) {
  const pa = p.predicted_score_a, pb = p.predicted_score_b, a = m.actual_score_a, b = m.actual_score_b;
  let exact = 0, outcome = 0, btts = 0, range = 0;
  if (pa === a && pb === b) exact = m.score_odds ? (m.score_odds[`${a}:${b}`] ?? m.score_odds.other ?? 0) : (m.exact_score_points || 0);
  const dir = (x, y) => (x > y ? 'home' : x < y ? 'away' : 'draw');
  if (dir(pa, pb) === dir(a, b)) outcome = { home: m.home_win_points, away: m.away_win_points, draw: m.draw_points }[dir(a, b)] || 0;
  const bt = (x, y) => x > 0 && y > 0;
  if (bt(pa, pb) === bt(a, b)) btts = (bt(a, b) ? m.btts_yes_points : m.btts_no_points) || 0;
  const rg = (g) => (g <= 2 ? '0-2' : g <= 4 ? '3-4' : '5+');
  if (rg(pa + pb) === rg(a + b)) range = { '0-2': m.goals_0_2_points, '3-4': m.goals_3_4_points, '5+': m.goals_5_plus_points }[rg(a + b)] || 0;
  const f = (x) => parseFloat(Number(x).toFixed(2));
  return {
    points_earned: f(exact + outcome + btts + range), exact_score_points_earned: f(exact),
    correct_outcome_points_earned: f(outcome), both_teams_scored_points_earned: f(btts), goals_range_points_earned: f(range),
  };
}

// "Calculate Scores" for one match: its predictions' points, the match marked
// calculated, then every participant's user_stats rebuilt from all predictions
// (+ general-prediction points) — the same totals the admin button writes.
async function calculateMatch(matchId) {
  const [m] = await supa(`matches?select=*&id=eq.${matchId}`);
  const preds = await supa(`predictions?select=*&match_id=eq.${matchId}`);
  const latest = {};
  preds.forEach((p) => { if (!latest[p.user_id] || new Date(p.created_at) > new Date(latest[p.user_id].created_at)) latest[p.user_id] = p; });
  for (const p of Object.values(latest)) await supaWrite('PATCH', `predictions?id=eq.${p.id}`, breakdown(p, m));
  await supaWrite('PATCH', `matches?id=eq.${matchId}`, { is_score_calculated: true });

  const [all, matches, users, general] = await Promise.all([
    supaAll('predictions?select=user_id,match_id,created_at,predicted_score_a,predicted_score_b,points_earned,exact_score_points_earned,correct_outcome_points_earned,both_teams_scored_points_earned,goals_range_points_earned'),
    supaAll('matches?select=id,is_finished,actual_score_a,actual_score_b'),
    supaAll('profiles?select=id'),
    supaAll('general_predictions?select=user_id,points_earned'),
  ]);
  const uniq = {};
  all.forEach((p) => { const k = `${p.user_id}_${p.match_id}`; if (!uniq[k] || new Date(p.created_at) > new Date(uniq[k].created_at)) uniq[k] = p; });
  const zero = () => ({ total: 0, hits: 0, count: 0, exact: 0, outcome: 0, btts: 0, range: 0 });
  const s = Object.fromEntries(users.map((u) => [u.id, zero()]));
  const add = (x, y) => parseFloat((x + (Number(y) || 0)).toFixed(2));
  Object.values(uniq).forEach((p) => {
    const u = (s[p.user_id] ||= zero());
    u.count++;
    u.total = add(u.total, p.points_earned); u.exact = add(u.exact, p.exact_score_points_earned);
    u.outcome = add(u.outcome, p.correct_outcome_points_earned); u.btts = add(u.btts, p.both_teams_scored_points_earned);
    u.range = add(u.range, p.goals_range_points_earned);
    const mm = matches.find((x) => x.id === p.match_id);
    if (mm?.is_finished && p.predicted_score_a === mm.actual_score_a && p.predicted_score_b === mm.actual_score_b) u.hits++;
  });
  general.forEach((g) => { if (g.points_earned) { const u = (s[g.user_id] ||= zero()); u.total = add(u.total, g.points_earned); } });
  const now = new Date().toISOString();
  for (const [userId, u] of Object.entries(s)) {
    await supaWrite('DELETE', `user_stats?user_id=eq.${userId}`);
    await supaWrite('POST', 'user_stats', {
      user_id: userId, total_points: u.total, exact_hits_count: u.hits, total_predictions_count: u.count,
      total_exact_score_points: Math.round(u.exact), total_outcome_points: Math.round(u.outcome),
      total_btts_points: Math.round(u.btts), total_goals_range_points: Math.round(u.range), updated_at: now,
    });
  }
  return Object.keys(latest).length;
}

const toAdmins = async (heading, body, key) => {
  const admins = await supa('profiles?select=id&is_admin=eq.true');
  return push({ heading, body, url: `${SITE}/`, key, mode: 'live', externalIds: admins.map((a) => a.id) });
};

// mode 'live' writes and pushes; anything else only reports what it would do.
export async function autoFinishSweep(now = new Date(), mode = 'live') {
  const ids = Object.keys(PILOT);
  const rows = await supa(`matches?select=id,team_a,team_b,match_date,is_finished,stage&id=in.(${ids.join(',')})`);
  const due = rows.filter((m) => !m.is_finished && now - new Date(m.match_date) >= START_AFTER_MS);
  if (!due.length) return [];
  const days = [...new Set(due.map((m) => m.match_date.slice(0, 10)))];
  const uefa = (await Promise.all(days.map((d) => getUefaMatchesByDate(d, d)))).flat();
  const out = [];
  for (const m of due) {
    const name = `${m.team_a.trim()}–${m.team_b.trim()}`;
    const [g, u] = await Promise.all([goalFinal(m).catch((e) => ({ error: e.message })), uefaFinal(m, uefa).catch((e) => ({ error: e.message }))]);
    const ok = g && u && g.a != null && u.a != null;
    if (!ok || g.a !== u.a || g.b !== u.b) {
      const late = now - new Date(m.match_date) >= GIVE_UP_MS;
      const why = ok ? `GOAL ${g.a}-${g.b}, UEFA ${u.a}-${u.b}` : `GOAL ${g?.pending || g?.error || 'לא נמצא'}, UEFA ${u?.pending || u?.error || 'לא נמצא'}`;
      // sources disagree on a final score → stop and tell; not final yet → wait (tell only when it's late)
      if (mode === 'live' && (ok || late)) await toAdmins(`⚠️ לא סגרתי: ${name}`, `${why} · סגור ידנית`, `auto:${m.id}:stuck`);
      out.push({ match: name, waiting: why });
      continue;
    }
    const [a, b] = [g.a, g.b];
    if (mode !== 'live') { out.push({ match: name, wouldClose: `${a}-${b}`, calc: PILOT[m.id] === 'calc' }); continue; }
    await supaWrite('PATCH', `matches?id=eq.${m.id}&is_finished=eq.false`, { is_finished: true, actual_score_a: a, actual_score_b: b, is_score_calculated: false });
    // like the manual save: a finished league-phase match clears the manual table order
    if (m.stage === 'league_phase') await supaWrite('PATCH', 'app_settings?league_table_override=not.is.null', { league_table_override: null, updated_at: new Date().toISOString() });
    const score = `${m.team_a.trim()} ${a}-${b} ${m.team_b.trim()}`;
    if (PILOT[m.id] === 'calc') {
      try {
        const n = await calculateMatch(m.id);
        await toAdmins('✅ סגרתי וחישבתי', `${score} · ${n} ניחושים חושבו, הטבלה עודכנה`, `auto:${m.id}:closed`);
        out.push({ match: name, closed: `${a}-${b}`, calculated: n });
      } catch (e) {
        await toAdmins('⚠️ סגרתי, החישוב נכשל', `${score} · לחץ על חישוב ניקוד`, `auto:${m.id}:closed`);
        out.push({ match: name, closed: `${a}-${b}`, calcError: e.message });
      }
    } else {
      await toAdmins('✅ סגרתי משחק', `${score} · בדוק ולחץ על חישוב ניקוד`, `auto:${m.id}:closed`);
      out.push({ match: name, closed: `${a}-${b}` });
    }
  }
  return out;
}
