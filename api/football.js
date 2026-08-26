// Vercel Serverless Function — proxies football-data.org API
import { TOURNAMENT_CODE } from '../src/config/tournament.js';
import { getUefaLiveMatches, getUefaMatchesByDate } from './_uefaContext.js';

export default async function handler(req, res) {
  const { competition = TOURNAMENT_CODE, filter = 'LIVE', type } = req.query;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  const { date: clientDate, dateFrom: clientDateFrom, dateTo: clientDateTo } = req.query;
  const fallbackDate = clientDate || new Date().toISOString().split('T')[0];
  const dateFrom = clientDateFrom || fallbackDate;
  const dateTo   = clientDateTo   || fallbackDate;

  // The plain matches endpoint (LIVE/TODAY/FINISHED) is the one place a
  // broken/missing football-data.org key shouldn't just fail outright —
  // UEFA's own feed (no key needed) covers it, reshaped to match
  // football-data.org's response so nothing on the client needs to change.
  // The `type` sub-endpoints (standings/scorers/teams/match-by-id) below
  // still need a real key — no UEFA equivalent wired up for those yet.
  if (!type && !apiKey) {
    try {
      const matches = filter === 'LIVE'
        ? await getUefaLiveMatches()
        : await getUefaMatchesByDate(dateFrom, dateTo, filter);
      return res.status(200).json({ success: true, matches, source: 'uefa' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing FOOTBALL_DATA_API_KEY' });
  }

  try {
    // ── Non-match endpoints ───────────────────────────────────────────────────
    if (type === 'standings') {
      const url = `https://api.football-data.org/v4/competitions/${competition}/standings`;
      console.log(`[football API] standings url=${url}`);
      const r = await fetch(url, { headers: { 'X-Auth-Token': apiKey, 'X-Api-Version': 'v4.1' } });
      const d = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: d.message || JSON.stringify(d) });
      return res.status(200).json({ success: true, standings: d.standings || [], competition: d.competition });
    }

    if (type === 'scorers') {
      const { limit = 20 } = req.query;
      const url = `https://api.football-data.org/v4/competitions/${competition}/scorers?limit=${limit}`;
      console.log(`[football API] scorers url=${url}`);
      const r = await fetch(url, { headers: { 'X-Auth-Token': apiKey, 'X-Api-Version': 'v4.1' } });
      const d = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: d.message || JSON.stringify(d) });
      return res.status(200).json({ success: true, scorers: d.scorers || [] });
    }

    if (type === 'teams') {
      const url = `https://api.football-data.org/v4/competitions/${competition}/teams`;
      console.log(`[football API] teams url=${url}`);
      const r = await fetch(url, { headers: { 'X-Auth-Token': apiKey, 'X-Api-Version': 'v4.1' } });
      const d = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: d.message || JSON.stringify(d) });
      return res.status(200).json({ success: true, teams: d.teams || [] });
    }

    if (type === 'match') {
      const { matchId } = req.query;
      if (!matchId) return res.status(400).json({ error: 'matchId required' });
      const url = `https://api.football-data.org/v4/matches/${matchId}`;
      console.log(`[football API] match url=${url}`);
      const r = await fetch(url, { headers: { 'X-Auth-Token': apiKey, 'X-Api-Version': 'v4.1' } });
      const d = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: d.message || JSON.stringify(d) });
      return res.status(200).json({ success: true, match: d });
    }

    // ── Matches endpoint ──────────────────────────────────────────────────────
    const url = `https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    console.log(`[football API] filter=${filter} url=${url}`);

    const response = await fetch(url, { headers: { 'X-Auth-Token': apiKey, 'X-Api-Version': 'v4.1' } });

    if (!response.ok) {
      // football-data.org itself failing (rate limit, outage, etc.) — same
      // UEFA fallback as the missing-key case, but only for the LIVE view.
      if (filter === 'LIVE') {
        try {
          const matches = await getUefaLiveMatches();
          return res.status(200).json({ success: true, matches, source: 'uefa' });
        } catch {
          // fall through to reporting the original football-data.org error
        }
      }
      const text = await response.text();
      console.error(`[football API] error ${response.status}: ${text}`);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    let matches = data.matches || [];

    if (filter === 'LIVE') {
      const now = new Date();
      const MATCH_DURATION_MS = 110 * 60 * 1000;
      matches = matches
        .filter(m => {
          const start = new Date(m.utcDate);
          const isDone = ['FINISHED','AWARDED','CANCELLED','POSTPONED','SUSPENDED'].includes(m.status);
          const hasStarted = now >= start;
          const likelyPlaying = (now - start) < MATCH_DURATION_MS;
          return m.status === 'IN_PLAY' || m.status === 'PAUSED' || (!isDone && hasStarted && likelyPlaying);
        })
        .map(m => {
          // football-data.org doesn't reliably expose a live "minute" field even
          // when it correctly flags a match IN_PLAY/PAUSED, so always compute a
          // sensible one ourselves from kickoff time — otherwise the minute-based
          // progress ring in the UI never has anything to show.
          const elapsed = Math.max(0, Math.floor((now - new Date(m.utcDate)) / 60000));
          if (m.status !== 'IN_PLAY' && m.status !== 'PAUSED') {
            return { ...m, status: 'IN_PLAY', minute: elapsed };
          }
          return { ...m, minute: m.minute ?? elapsed };
        });

      // football-data.org came back OK but genuinely has nothing live right
      // now doesn't necessarily mean UEFA agrees — only fall back when
      // football-data.org found zero, so a real (non-empty) answer from it
      // is never second-guessed.
      if (matches.length === 0) {
        try {
          const uefaMatches = await getUefaLiveMatches();
          if (uefaMatches.length > 0) {
            return res.status(200).json({ success: true, matches: uefaMatches, source: 'uefa' });
          }
        } catch {
          // no UEFA data either — just return the empty football-data.org result below
        }
      }
    } else if (filter === 'FINISHED') {
      matches = matches.filter(m => m.status === 'FINISHED');
    }

    console.log(`[football API] returning ${matches.length} matches`);
    return res.status(200).json({ success: true, matches });

  } catch (err) {
    console.error(`[football API] exception: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
}
