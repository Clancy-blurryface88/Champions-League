// Vercel Serverless Function — recently finished Champions League matches
// (no key needed), so AdminLiveMatchExplorer.jsx has real match ids to
// test against when nothing is live right now.
import { getRecentFinishedMatches } from './_uefaContext.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  try {
    const matches = await getRecentFinishedMatches();
    return res.status(200).json({ success: true, matches });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
