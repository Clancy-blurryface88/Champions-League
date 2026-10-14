// Handler (mounted via POST /api/football?source=admin-push — Hobby plan caps
// us at 12 functions) — a push the admin writes by hand in the admin panel.
// The caller must be a signed-in admin: the Supabase access token is checked
// against Supabase Auth and profiles.is_admin. The OneSignal key never leaves
// the server. target 'test' → only Test Users devices, 'all' → everyone.
import { push, supa } from './_goalWebhook.js';

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
    const mode = body.target === 'all' ? 'live' : 'test';
    const url = `${SITE}${LINKS[body.link] || LINKS.home}`;

    // Unique key per send: a manual push is always intentional, never deduped.
    const sent = await push({ heading, body: text, url, key: `manual:${admin.id}:${Date.now()}`, mode });
    console.log('[admin-push]', mode, heading, sent.status);
    return res.status(200).json({ ok: sent.status === 200, target: mode === 'live' ? 'all' : 'test', sent });
  } catch (e) {
    console.error('[admin-push]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
