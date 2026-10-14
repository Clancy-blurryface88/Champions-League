// Vercel Serverless Function — recently finished Champions League matches
// (no key needed), so AdminLiveMatchExplorer.jsx has real match ids to
// test against when nothing is live right now.
// ?window=1 → status + score of every match around now, for the read-only
// admin "בדיקת סיום משחקים" tab.
import { getRecentFinishedMatches, getMatchStatusWindow } from './_uefaContext.js';

export default async function handler(req, res) {
  try {
    if (req.query.window === '1') {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=60');
      const matches = await getMatchStatusWindow();
      return res.status(200).json({ success: true, matches });
    }
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    const matches = await getRecentFinishedMatches();
    return res.status(200).json({ success: true, matches });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
