// Handler (mounted via /api/football?source=goal — Hobby plan caps us at 12
// functions) — proxy to GOAL API (api.goal-api.com, data
// sourced from apifootball). Key stays server-side; only whitelisted read
// paths are forwarded. Free plan = 1,000 requests/day, so responses are
// cached at the CDN to keep the quota safe.
const BASE = 'https://api.goal-api.com/v1';

const ALLOWED = [
  /^\/fixtures\/[a-z0-9]+(\/(events|lineups|statistics|cards|substitutions|commentary))?$/,
  /^\/leagues\/[a-z0-9]+\/(results|fixtures|top-scorers|standings)$/,
  /^\/h2h\/[a-z0-9]+\/[a-z0-9]+$/,
  /^\/teams\/[a-z0-9]+\/(statistics|results)$/,
  /^\/videos\/(match|league)\/[a-z0-9]+$/,
];

export async function goalHandler(req, res) {
  const apiKey = process.env.GOAL_API_KEY;
  if (!apiKey) return res.status(500).json({ success: false, error: 'Missing GOAL_API_KEY' });

  const { path, source: _source, ...rest } = req.query;
  if (!path || !ALLOWED.some((re) => re.test(path))) {
    return res.status(400).json({ success: false, error: 'Path not allowed' });
  }

  const qs = new URLSearchParams(rest).toString();
  try {
    const r = await fetch(`${BASE}${path}${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const body = await r.json();
    res.setHeader('X-Goal-Quota-Remaining', r.headers.get('x-ratelimit-remaining') || '');
    if (r.ok) res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(r.status).json(body);
  } catch (err) {
    return res.status(502).json({ success: false, error: err.message });
  }
}
