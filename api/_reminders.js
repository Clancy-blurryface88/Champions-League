// Handler (mounted via GET /api/football?source=reminders) — "go predict" pushes:
//   • 12:00 Israel time two days before a round starts (a match day whose
//     previous day had no matches) — "new round open for predictions", to
//     every subscriber; names the weekday and date
//   • 12:00 the day before — personal: only to participants still missing
//     predictions for that day ("חסרים לך 3 ניחושים למשחקי מחר"). When there's
//     no two-days announcement (back-to-back rounds), this one is the
//     announcement and goes to everyone.
//   • 2h15m before the round's first kickoff (19:45 → 17:30), first day only
//     — personal, to whoever is still missing that evening's predictions
//   • before each kickoff slot — 19:00 for 19:45, 21:00 for 22:00 — personal,
//     to whoever is missing that slot's predictions; says the lineups are out
//     when they are (falls back to "matches start soon")
// Every reminder opens the predictions page of its round.
//   • 10:00 the morning after the round's last match day — the round-summary
//     push (backup for the match.finished webhook; same key, sent once)
//
// Triggered every 5 min by the Supabase pg_cron job "prediction-reminders"
// (Vercel Hobby cron runs only once a day; .github/workflows/reminders.yml is
// a backup — GitHub delays scheduled runs by hours). A reminder is created when the trigger lands
// within 25 min before its time and scheduled with send_after, so it arrives
// on the minute. Every reminder has a fixed
// idempotency key, so extra or overlapping triggers can never double-send —
// which is also why this needs no secret.
import { supa, push, ilAt, sendRoundSummary } from './_goalWebhook.js';
import { participants, latestPredictions, missingText, sendPersonal } from './_personal.js';
import { PREDICTION_LOCK_MINUTES } from '../src/config/tournament.js';
import { getLineupsForMatch } from './_uefaContext.js';

const SITE = 'https://champions-league-2026.vercel.app';
const TZ = 'Asia/Jerusalem';
const LEAD_MS = 25 * 60e3; // create the push up to 25 min ahead of its time
const LATE_MS = 20 * 60e3; // still send if the trigger arrives up to 20 min late

const ilDate = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d); // YYYY-MM-DD
const ilTime = (d) => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(d);
// Predictions lock this long before kickoff (same rule as the app).
const lockOf = (kickoffMs) => new Date(kickoffMs - PREDICTION_LOCK_MINUTES * 60e3);
const addDays = (ymd, n) => { const d = new Date(`${ymd}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
// "יום שלישי (21.10)" — the Israel weekday and day.month of a Date.
const ilDayLabel = (d) => {
  const weekday = new Intl.DateTimeFormat('he-IL', { timeZone: TZ, weekday: 'long' }).format(d);
  const [, m, day] = ilDate(d).split('-');
  return `${weekday} (${Number(day)}.${Number(m)})`;
};

// 12:00 Israel time on a given Israel date, as a UTC Date (DST-safe).
function ilNoon(ymd) {
  const guess = new Date(`${ymd}T12:00:00Z`);
  const shown = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(guess);
  return new Date(guess.getTime() - (Number(shown) - 12) * 3600e3);
}

// All reminders whose time falls on Israel dates [today, today+1].
async function plannedReminders(now) {
  const today = ilDate(now);
  const from = new Date(`${addDays(today, -1)}T00:00:00Z`).toISOString();
  const to = new Date(`${addDays(today, 3)}T00:00:00Z`).toISOString();
  const matches = await supa(`matches?select=id,match_date,team_a,team_b,round_id&match_date=gte.${from}&match_date=lt.${to}&order=match_date`);
  const byDay = new Map();
  matches.forEach((m) => {
    const d = ilDate(new Date(m.match_date));
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d).push(m);
  });

  const out = [];
  // Round summary: 10:00 the morning after the round's last match day. The
  // match.finished webhook schedules it too, but when that webhook is missed
  // (Round 3) nothing else would — same key, so only one ever goes out.
  const yesterday = byDay.get(addDays(today, -1));
  const roundId = yesterday?.[yesterday.length - 1].round_id;
  if (roundId) {
    const rest = await supa(`matches?select=match_date,is_finished,is_score_calculated&round_id=eq.${roundId}`);
    if (!rest.some((m) => ilDate(new Date(m.match_date)) > addDays(today, -1))) {
      out.push({
        kind: 'summary', key: `round-summary:${roundId}`, at: ilAt(now, 0, 10), roundId,
        // scores may still be calculating at 10:00 — keep trying until 22:00
        lateMs: 12 * 3600e3, scored: rest.every((m) => m.is_finished && m.is_score_calculated),
      });
    }
  }
  for (const day of [today, addDays(today, 1), addDays(today, 2)]) {
    const list = byDay.get(day);
    if (!list) continue;
    const slots = [...new Set(list.map((m) => new Date(m.match_date).getTime()))].sort((a, b) => a - b);
    const first = new Date(slots[0]);
    // The round's own predictions page (round of the day's first match).
    const roundUrl = list[0].round_id ? `${SITE}/Predictions?round_id=${list[0].round_id}` : `${SITE}/`;

    // First day of a round (no matches the day before — usually Tuesday):
    // 12:00 two days before (names the weekday and date), 12:00 the day
    // before, and 2h15m before the first kickoff (19:45 → 17:30).
    if (!byDay.has(addDays(day, -1))) {
      // Skipped when two days before is itself a match day — that noon
      // belongs to the previous round.
      const announced = !byDay.has(addDays(day, -2));
      if (announced) {
        out.push({
          key: `rem:twodays:${day}`, at: ilNoon(addDays(day, -2)), url: roundUrl,
          heading: '📅 מחזור חדש פורסם ופתוח לניחוש!',
          body: `המשחקים מתחילים ב${ilDayLabel(first)} ב-${ilTime(first)} — כנסו לנחש 👉`,
        });
      }
      out.push(announced
        ? { kind: 'missing', key: `rem:daybefore:${day}`, at: ilNoon(addDays(day, -1)), url: roundUrl, matches: list,
            heading: '⏰ המחזור מתחיל מחר', personalBody: (n) => `${missingText(n)} למשחקי מחר · מתחילים ב-${ilTime(first)} 👉` }
        : { key: `rem:daybefore:${day}`, at: ilNoon(addDays(day, -1)), url: roundUrl,
            heading: '📅 מחזור חדש פורסם ופתוח לניחוש!', body: `המשחקים מתחילים מחר ב-${ilTime(first)} — כנסו לנחש 👉` });
      out.push({
        kind: 'missing', key: `rem:first:${day}`, at: new Date(slots[0] - 135 * 60e3), url: roundUrl, matches: list,
        heading: '⏰ תזכורת', personalBody: (n) => `${missingText(n)} למשחקי הערב · מתחילים ב-${ilTime(first)} 👉`,
      });
    }
    slots.forEach((t, i) => {
      // Hooked on UEFA publishing the lineups (~1h before kickoff), only to
      // whoever still misses a prediction for this slot. First slot 45 min
      // before (19:45 → 19:00), later slots 1h before (22:00 → 21:00).
      const slotMatches = list.filter((m) => new Date(m.match_date).getTime() === t);
      out.push({
        kind: 'slot', key: `rem:slot:${day}:${t}`, at: new Date(t - (i === 0 ? 45 : 60) * 60e3),
        slotMatches, kickoff: ilTime(new Date(t)), lock: ilTime(lockOf(t)),
        url: slotMatches[0].round_id ? `${SITE}/Predictions?round_id=${slotMatches[0].round_id}` : `${SITE}/`,
      });
    });
  }
  return out;
}

// Participants missing at least one prediction among `matches`, with how many.
async function missingFor(matches) {
  const [people, preds] = await Promise.all([participants(), latestPredictions(matches.map((m) => m.id))]);
  return people.map((p) => ({ ...p, missing: matches.filter((m) => !preds[p.id]?.[m.id]).length })).filter((p) => p.missing > 0);
}
const toPersonal = (list, heading, bodyOf) => list.map((p) => ({ userId: p.id, name: p.name, heading, body: bodyOf(p.missing) }));

export async function remindersHandler(req, res) {
  // Manual check (keyed): &now=<ISO> to simulate a time, &send=test to
  // deliver due reminders to Test Users only. Without the key: live run.
  const admin = req.headers['x-admin-key'] && req.headers['x-admin-key'] === process.env.GOAL_API_KEY;
  const now = admin && req.query.now ? new Date(req.query.now) : new Date();
  const mode = admin ? (req.query.send === 'test' ? 'test' : 'dry') : 'live';

  try {
    const all = await plannedReminders(now);
    const due = all.filter((r) => now >= new Date(r.at.getTime() - LEAD_MS) && now < new Date(r.at.getTime() + (r.lateMs ?? LATE_MS)));
    const results = [];
    for (const r of due) {
      if (r.kind === 'summary') {
        // The summary is built from the stored scores — wait until they're in.
        if (!r.scored) { results.push({ key: r.key, waiting: 'round scores not calculated yet' }); continue; }
        const sent = await sendRoundSummary(r.roundId, mode, r.at);
        results.push({ key: r.key, at: r.at.toISOString(), sent });
        continue;
      }
      if (r.kind === 'slot') {
        // Always sent. Lineups out → "lineups published" version. Not yet →
        // wait for the next trigger, until 10 min past the slot time, then
        // send the "matches start soon" version. Same key, so only one goes out.
        const checks = await Promise.all(r.slotMatches.map((m) => getLineupsForMatch(m.team_a.trim(), m.team_b.trim())));
        const published = checks.some(Boolean);
        if (!published && now < new Date(r.at.getTime() + 10 * 60e3)) {
          results.push({ key: r.key, waiting: 'lineups not published yet' });
          continue;
        }
        const heading = published ? `📋 ההרכבים למשחקי ${r.kickoff} פורסמו!` : `⏰ משחקי ${r.kickoff} מתחילים בקרוב`;
        const missing = await missingFor(r.slotMatches);
        const sent = await sendPersonal(toPersonal(missing, heading, (n) => `${missingText(n)} למשחקי ${r.kickoff} · אפשר עד ${r.lock} 👉`), { url: r.url, key: r.key, mode, sendAfter: r.at });
        results.push({ key: r.key, at: r.at.toISOString(), lineups: published, sent });
        continue;
      }
      if (r.kind === 'missing') {
        const missing = await missingFor(r.matches);
        const sent = await sendPersonal(toPersonal(missing, r.heading, r.personalBody), { url: r.url, key: r.key, mode, sendAfter: r.at });
        results.push({ key: r.key, at: r.at.toISOString(), sent });
        continue;
      }
      const sent = await push({ heading: r.heading, body: r.body, url: r.url, key: r.key, mode, sendAfter: r.at });
      results.push({ key: r.key, at: r.at.toISOString(), sent });
    }
    return res.status(200).json({
      now: now.toISOString(),
      planned: admin ? all.map((r) => ({ key: r.key, at: r.at.toISOString(), atIsrael: `${ilDate(r.at)} ${ilTime(r.at)}` })) : undefined,
      results,
    });
  } catch (e) {
    console.error('[reminders]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
