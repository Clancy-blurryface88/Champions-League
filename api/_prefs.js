// Notification preferences from the bell menu. One notification_prefs row per
// participant: `off` = the push kinds they turned off, `live_from` = the match
// minute from which they get live pushes (0 = from kickoff). No row = everything on.
//
// Rule for every helper below: when in doubt, SEND. A failed lookup, a missing
// minute or an unknown kind never stops a push — the worst case of a bug here is
// a push someone turned off, never no pushes at all.
//
// Personal pushes (external ids) are filtered here against the table. Broadcasts
// go to a segment, so they are filtered in OneSignal by tags that mirror the table
// (off_<kind> = "1", live_from = "60"), set by savePrefs on every change.
import { supa, ONESIGNAL_APP_ID } from './_goalWebhook.js';
import { adminFromToken } from './_adminPush.js';

export const PREF_KEYS = ['lineups', 'final', 'night', 'summary', 'goal', 'hit', 'broke', 'first-place', 'overtaken', 'var'];
export const LIVE_KEYS = new Set(['goal', 'hit', 'broke', 'first-place', 'overtaken', 'var']);

// "67" → 67, "45+2" → 45 (added time belongs to its half), anything else → null.
export function liveMinute(m) {
  const n = parseInt(String(m ?? '').trim(), 10);
  return Number.isFinite(n) && n >= 0 && n <= 130 ? n : null;
}

const allows = (row, pref, minute) => {
  if (!row || !pref) return true;
  if ((row.off || []).includes(pref)) return false;
  if (LIVE_KEYS.has(pref) && minute != null && minute < (row.live_from || 0)) return false;
  return true;
};

// { [userId]: row } for these users, or null when the lookup failed.
async function rowsFor(ids) {
  if (!ids.length) return {};
  try {
    const out = {};
    for (let i = 0; i < ids.length; i += 100) {
      const rows = await supa(`notification_prefs?select=user_id,off,live_from&user_id=in.(${ids.slice(i, i + 100).join(',')})`);
      if (!Array.isArray(rows)) return null;
      rows.forEach((r) => { out[r.user_id] = r; });
    }
    return out;
  } catch (e) {
    console.error('[prefs] lookup failed — sending to everyone', e.message);
    return null;
  }
}

// Splits personal messages ({ userId, pref? }) into the ones to send and the user
// ids that turned this kind off. `pref` is the default kind for messages without one.
export async function splitByPrefs(list, pref, minute) {
  const kinds = list.some((m) => m.pref || pref);
  if (!kinds) return { keep: list, dropped: [] };
  const rows = await rowsFor([...new Set(list.map((m) => m.userId))]);
  if (!rows) return { keep: list, dropped: [] };
  const keep = [], dropped = [];
  list.forEach((m) => (allows(rows[m.userId], m.pref || pref, minute) ? keep : dropped).push(m));
  return { keep, dropped: dropped.map((m) => m.userId) };
}

// OneSignal filters for a broadcast of this kind, or null = send to the whole
// segment as always (nobody turned it off, or the lookup failed).
export async function broadcastFilters(pref, minute) {
  if (!PREF_KEYS.includes(pref)) return null;
  let rows;
  try { rows = await supa('notification_prefs?select=off,live_from'); } catch (e) { return null; }
  if (!Array.isArray(rows)) return null;
  const live = LIVE_KEYS.has(pref) && minute != null;
  if (!rows.some((r) => !allows(r, pref, live ? minute : null))) return null;
  const notOff = { field: 'tag', key: `off_${pref}`, relation: 'not_exists' };
  if (!live) return [notOff];
  // (not off AND no minute set) OR (not off AND minute set below now)
  return [
    notOff, { field: 'tag', key: 'live_from', relation: 'not_exists' },
    { operator: 'OR' },
    notOff, { field: 'tag', key: 'live_from', relation: '<', value: String(minute + 1) },
  ];
}

// Mirrors one user's choices into their OneSignal tags ("" removes a tag).
async function syncTags(userId, off, liveFrom) {
  const tags = Object.fromEntries(PREF_KEYS.map((k) => [`off_${k}`, off.includes(k) ? '1' : '']));
  tags.live_from = liveFrom > 0 ? String(liveFrom) : '';
  const r = await fetch(`https://api.onesignal.com/apps/${ONESIGNAL_APP_ID}/users/by/external_id/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}` },
    body: JSON.stringify({ properties: { tags } }),
  });
  return r.status === 404 ? 'not linked' : r.ok ? 'ok' : `HTTP ${r.status}`;
}

async function userFromToken(token) {
  if (!token) return null;
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;
  const r = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` } });
  if (!r.ok) return null;
  const u = await r.json();
  return u?.id ? u : null;
}

// GET  /api/football?source=notif-prefs → { off, live_from } of the signed-in user
// POST same, body { off, live_from } → saves, syncs the tags, returns what was saved
// GET  &all=1 (admins) → every row, for the admin panel
export async function notifPrefsHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (req.method === 'GET' && req.query.all) {
      if (!(await adminFromToken(token))) return res.status(401).json({ error: 'admins only' });
      return res.status(200).json({ rows: await supa('notification_prefs?select=user_id,off,live_from,updated_at') });
    }
    const user = await userFromToken(token);
    if (!user) return res.status(401).json({ error: 'not signed in' });
    if (req.method === 'GET') {
      const [row] = await supa(`notification_prefs?select=off,live_from&user_id=eq.${user.id}`);
      return res.status(200).json({ off: row?.off || [], live_from: row?.live_from || 0 });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'GET or POST' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const off = [...new Set((body.off || []).filter((k) => PREF_KEYS.includes(k)))];
    const liveFrom = Math.max(0, Math.min(90, parseInt(body.live_from, 10) || 0));
    const base = process.env.VITE_SUPABASE_URL;
    const k = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;
    const w = await fetch(`${base}/rest/v1/notification_prefs?on_conflict=user_id`, {
      method: 'POST',
      headers: { apikey: k, Authorization: `Bearer ${k}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ user_id: user.id, off, live_from: liveFrom, updated_at: new Date().toISOString() }),
    });
    if (!w.ok) return res.status(500).json({ error: `save failed (${w.status})` });
    const tags = await syncTags(user.id, off, liveFrom).catch((e) => e.message);
    return res.status(200).json({ off, live_from: liveFrom, tags });
  } catch (e) {
    console.error('[notif-prefs]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
