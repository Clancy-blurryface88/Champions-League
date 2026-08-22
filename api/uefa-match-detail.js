// Vercel Serverless Function — raw lineups/events for one UEFA match id,
// for AdminLiveMatchExplorer.jsx. Passthrough, no reshaping — this is an
// exploration tool, not a user-facing feed.
import { getLineups, getMatchEvents } from 'uefa-api';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const { matchId, type } = req.query;
  if (!matchId) return res.status(400).json({ success: false, error: 'matchId required' });

  try {
    if (type === 'lineups') {
      const lineups = await getLineups(matchId);
      return res.status(200).json({ success: true, lineups });
    }
    if (type === 'events') {
      const events = await getMatchEvents(matchId);
      return res.status(200).json({ success: true, events });
    }
    return res.status(400).json({ success: false, error: 'type must be "lineups" or "events"' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
