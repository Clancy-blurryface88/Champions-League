// Handler (mounted via GET /api/football?source=reminders) — "go predict"
// pushes, to every subscriber:
//   • 12:00 Israel time the day before a round starts (a match day whose
//     previous day had no matches)
//   • 2h15m before the round's first kickoff (19:45 → 17:30), first day only
//   • before each kickoff slot — 19:00 for 19:45, 21:00 for 22:00 —
//     "lineups are out, want to update?" (falls back to "last chance")
// The first two say how many participants still haven't predicted.
//
// Triggered every ~10 min by .github/workflows/reminders.yml (Vercel Hobby
// cron runs only once a day). A reminder is created when the trigger lands
// within 25 min before its time and scheduled with send_after, so it arrives
// on the minute with a near-fresh count. Every reminder has a fixed
// idempotency key, so extra or overlapping triggers can never double-send —
// which is also why this needs no secret.
import { supa, push } from './_goalWebhook.js';
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

// 12:00 Israel time on a given Israel date, as a UTC Date (DST-safe).
function ilNoon(ymd) {
  const guess = new Date(`${ymd}T12:00:00Z`);
  const shown = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(guess);
  return new Date(guess.getTime() - (Number(shown) - 12) * 3600e3);
}

async function missingCount(matchIds, users) {
  if (!matchIds.length) return 0;
  const preds = await supa(`predictions?select=user_id,match_id&match_id=in.(${matchIds.join(',')})`);
  const done = new Map();
  preds.forEach((p) => done.set(p.user_id, (done.get(p.user_id) || 0) + 1));
  return users.filter((u) => (done.get(u.id) || 0) < matchIds.length).length;
}

// Kept short — a phone lock screen shows ~1 line of body text.
const missingLine = (n) => (n === 0
  ? `כולם כבר ניחשו 💪 — אפשר לשנות עד ${PREDICTION_LOCK_MINUTES} דק' לפני כל משחק 👉`
  : `${n === 1 ? 'משתתף אחד עוד לא ניחש' : `${n} משתתפים עוד לא ניחשו`} — כנסו לנחש 👉`);

// All reminders whose time falls on Israel dates [today, today+1].
async function plannedReminders(now) {
  const today = ilDate(now);
  const from = new Date(`${addDays(today, -1)}T00:00:00Z`).toISOString();
  const to = new Date(`${addDays(today, 3)}T00:00:00Z`).toISOString();
  const matches = await supa(`matches?select=id,match_date,team_a,team_b&match_date=gte.${from}&match_date=lt.${to}&order=match_date`);
  const byDay = new Map();
  matches.forEach((m) => {
    const d = ilDate(new Date(m.match_date));
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d).push(m);
  });

  const out = [];
  for (const day of [today, addDays(today, 1), addDays(today, 2)]) {
    const list = byDay.get(day);
    if (!list) continue;
    const ids = list.map((m) => m.id);
    const slots = [...new Set(list.map((m) => new Date(m.match_date).getTime()))].sort((a, b) => a - b);
    const first = new Date(slots[0]);

    // First day of a round (no matches the day before — usually Tuesday):
    // 12:00 the day before + 2h15m before the first kickoff (19:45 → 17:30).
    if (!byDay.has(addDays(day, -1))) {
      out.push({
        key: `rem:daybefore:${day}`, at: ilNoon(addDays(day, -1)), matchIds: ids,
        heading: `📅 מחר מחזור ליגת האלופות! (${ilTime(first)})`,
      });
      out.push({
        key: `rem:first:${day}`, at: new Date(slots[0] - 135 * 60e3), matchIds: ids,
        heading: `⏰ הניחושים ננעלים ב-${ilTime(lockOf(slots[0]))}!`,
      });
    }
    slots.forEach((t, i) => {
      // Everyone has predicted by now — these are about updating, hooked on
      // UEFA publishing the lineups (~1h before kickoff). First slot 45 min
      // before (19:45 → 19:00), later slots 1h before (22:00 → 21:00).
      out.push({
        kind: 'slot', key: `rem:slot:${day}:${t}`, at: new Date(t - (i === 0 ? 45 : 60) * 60e3),
        slotMatches: list.filter((m) => new Date(m.match_date).getTime() === t),
        kickoff: ilTime(new Date(t)), lock: ilTime(lockOf(t)),
      });
    });
  }
  return out;
}

export async function remindersHandler(req, res) {
  // Manual check (keyed): &now=<ISO> to simulate a time, &send=test to
  // deliver due reminders to Test Users only. Without the key: live run.
  const admin = req.headers['x-admin-key'] && req.headers['x-admin-key'] === process.env.GOAL_API_KEY;
  const now = admin && req.query.now ? new Date(req.query.now) : new Date();
  const mode = admin ? (req.query.send === 'test' ? 'test' : 'dry') : 'live';

  try {
    const all = await plannedReminders(now);
    const due = all.filter((r) => now >= new Date(r.at.getTime() - LEAD_MS) && now < new Date(r.at.getTime() + LATE_MS));
    const users = due.length ? await supa('profiles?select=id') : [];
    const results = [];
    for (const r of due) {
      if (r.kind === 'slot') {
        // Lineups out → "lineups published" version. Not yet → wait for the
        // next trigger, until 10 min past the slot time, then send the
        // plain "last chance" version. Same key, so only one ever goes out.
        const checks = await Promise.all(r.slotMatches.map((m) => getLineupsForMatch(m.team_a.trim(), m.team_b.trim())));
        const published = checks.some(Boolean);
        if (!published && now < new Date(r.at.getTime() + 10 * 60e3)) {
          results.push({ key: r.key, waiting: 'lineups not published yet' });
          continue;
        }
        const msg = published
          ? { heading: `📋 ההרכבים למשחקי ${r.kickoff} פורסמו!`, body: `רוצים לעדכן ניחוש? אפשר עד ${r.lock} 👉` }
          : { heading: `⏰ ניחושי משחקי ${r.kickoff} ננעלים ב-${r.lock}`, body: 'הזדמנות אחרונה לעדכן ניחוש 👉' };
        const sent = await push({ ...msg, url: `${SITE}/`, key: r.key, mode, sendAfter: r.at });
        results.push({ key: r.key, at: r.at.toISOString(), lineups: published, sent });
        continue;
      }
      const n = await missingCount(r.matchIds, users);
      const sent = await push({ heading: r.heading, body: missingLine(n), url: `${SITE}/`, key: r.key, mode, sendAfter: r.at });
      results.push({ key: r.key, at: r.at.toISOString(), missing: n, sent });
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
