// Vercel Serverless Function — currently-live Champions League matches from
// UEFA (no key needed), for AdminLiveMatchExplorer.jsx's quick-pick list.
import { getUefaLiveMatches } from './_uefaContext.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    const matches = await getUefaLiveMatches();
    return res.status(200).json({ success: true, matches });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
