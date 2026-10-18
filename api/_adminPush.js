// Handler (mounted via POST /api/football?source=admin-push — Hobby plan caps
// us at 12 functions) — a push the admin writes by hand in the admin panel.
// The caller must be a signed-in admin: the Supabase access token is checked
// against Supabase Auth and profiles.is_admin. The OneSignal key never leaves
// the server. target 'test' → only Test Users devices, 'all' → everyone,
// 'user' + userId → one participant's devices, 'onesignal' + onesignalId →
// one OneSignal user (from the OneSignal dashboard; works before linking).
import { push, supa, ONESIGNAL_APP_ID } from './_goalWebhook.js';

const SITE = 'https://champions-league-2026.vercel.app';
const LINKS = { home: '/', live: '/?open=live', leaderboard: '/?open=leaderboard' };

async function adminFromToken(token) {
  if (!token) return null;
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;
  const r = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` } });
  if (!r.ok) return null;
  const user = await r.json();
  if (!user?.id) return null;
  const rows = await supa(`profiles?select=is_admin&id=eq.${user.id}`);
  return rows[0]?.is_admin ? user : null;
}

// One user's OneSignal subscriptions, looked up by external_id (= Supabase
// user id, set by OneSignal.login in AuthContext). null → not linked yet
// (the user hasn't opened the app since login was added, or never allowed push).
async function oneSignalUser(userId) {
  const r = await fetch(`https://api.onesignal.com/apps/${ONESIGNAL_APP_ID}/users/by/external_id/${userId}`, {
    headers: { Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}` },
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`OneSignal user ${userId}: ${r.status}`);
  const j = await r.json();
  return (j.subscriptions || [])
    .filter((s) => /push/i.test(s.type || ''))
    .map((s) => ({
      id: s.id,
      type: s.type,
      // notification_types > 0 → permission granted and not unsubscribed
      enabled: s.enabled !== false && (s.notification_types ?? 1) > 0,
      device: [s.device_model, s.device_os].filter(Boolean).join(' '),
      lastActive: s.last_active ? new Date(s.last_active * 1000).toISOString() : null,
    }));
}

// GET /api/football?source=admin-subscribers — every profile with its push
// subscriptions, for the admin panel. Admins only.
export async function adminSubscribersHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!(await adminFromToken(token))) return res.status(401).json({ error: 'admins only' });

    const profiles = await supa('profiles?select=id,display_name,email&order=display_name');
    const users = [];
    // Small batches — OneSignal rate-limits per app.
    for (let i = 0; i < profiles.length; i += 10) {
      const batch = profiles.slice(i, i + 10);
      const subs = await Promise.all(batch.map((p) => oneSignalUser(p.id).catch((e) => ({ error: e.message }))));
      batch.forEach((p, k) => {
        const s = subs[k];
        users.push({
          id: p.id, name: p.display_name || p.email, email: p.email,
          error: s?.error, linked: Array.isArray(s), subscriptions: Array.isArray(s) ? s : [],
        });
      });
    }
    return res.status(200).json({ users });
  } catch (e) {
    console.error('[admin-subscribers]', e.message);
    return res.status(500).json({ error: e.message });
  }
}

export async function adminPushHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const admin = await adminFromToken(token);
    if (!admin) return res.status(401).json({ error: 'admins only' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const heading = String(body.heading || '').trim().slice(0, 120);
    const text = String(body.body || '').trim().slice(0, 300);
    if (!heading || !text) return res.status(400).json({ error: 'heading and body are required' });
    const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const userId = body.target === 'user' ? String(body.userId || '').trim() : null;
    const onesignalId = body.target === 'onesignal' ? String(body.onesignalId || '').trim() : null;
    if (userId !== null && !UUID.test(userId)) return res.status(400).json({ error: 'userId is required' });
    if (onesignalId !== null && !UUID.test(onesignalId)) return res.status(400).json({ error: 'מזהה OneSignal לא תקין' });
    const single = userId || onesignalId;
    const mode = body.target === 'all' || single ? 'live' : 'test';
    const url = `${SITE}${LINKS[body.link] || LINKS.home}`;

    // Unique key per send: a manual push is always intentional, never deduped.
    const sent = await push({
      heading, body: text, url, key: `manual:${admin.id}:${Date.now()}`, mode,
      externalIds: userId ? [userId] : undefined,
      onesignalIds: onesignalId ? [onesignalId] : undefined,
    });
    // OneSignal answers 200 with no id when nobody matched (user not linked).
    const delivered = sent.status === 200 && !!sent.body?.id;
    console.log('[admin-push]', single ? `${body.target} ${single}` : mode, heading, sent.status);
    return res.status(200).json({ ok: delivered, target: single ? body.target : mode === 'live' ? 'all' : 'test', sent });
  } catch (e) {
    console.error('[admin-push]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
