// Personal pushes: one message per participant, delivered to that user's own
// devices (OneSignal external_id = Supabase user id, linked by OneSignal.login
// in the app). Users who never linked a device simply don't receive these.
import { supa, push } from './_goalWebhook.js';

// Every participant (a user_stats row), with display names.
export async function participants() {
  const stats = await supa('user_stats?select=user_id,total_points');
  const ids = stats.map((s) => s.user_id);
  const profiles = ids.length ? await supa(`profiles?select=id,display_name&id=in.(${ids.join(',')})`) : [];
  return stats.map((s) => ({ id: s.user_id, total: Number(s.total_points) || 0, name: profiles.find((p) => p.id === s.user_id)?.display_name?.trim() || '' }));
}

// Latest prediction per user per match: { [userId]: { [matchId]: prediction } }.
export async function latestPredictions(matchIds, fields = 'user_id,match_id,created_at') {
  if (!matchIds.length) return {};
  const rows = await supa(`predictions?select=${fields}&match_id=in.(${matchIds.join(',')})`);
  const out = {};
  rows.forEach((p) => {
    const u = (out[p.user_id] ||= {});
    if (!u[p.match_id] || new Date(p.created_at) > new Date(u[p.match_id].created_at)) u[p.match_id] = p;
  });
  return out;
}

// "חסר לך ניחוש אחד" / "חסרים לך 3 ניחושים"
export const missingText = (n) => (n === 1 ? 'חסר לך ניחוש אחד' : `חסרים לך ${n} ניחושים`);

// Send each { userId, name, heading, body } to that user. Keys are per user, so a
// retry never double-sends. mode 'dry' → payloads only; 'test' → the first two
// messages go to the Test Users segment instead (labelled with whose they are),
// so a test never reaches the real participants.
export async function sendPersonal(list, { url, key, mode = 'live', sendAfter }) {
  const out = [];
  const batch = mode === 'test' ? list.slice(0, 2) : list;
  for (const m of batch) {
    const r = mode === 'test'
      ? await push({ heading: `[בדיקה · ${m.name || m.userId.slice(0, 6)}] ${m.heading}`, body: m.body, url, key: `${key}:${m.userId}`, mode: 'test', sendAfter })
      : await push({ heading: m.heading, body: m.body, url, key: `${key}:${m.userId}`, mode, sendAfter, externalIds: [m.userId] });
    out.push({ userId: m.userId, name: m.name, body: m.body, status: r.status ?? (r.dryRun ? 'dry' : undefined) });
  }
  return { personal: true, count: list.length, sent: out };
}
