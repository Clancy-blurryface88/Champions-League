import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, TrendingUp, TrendingDown, Minus, WifiOff } from "lucide-react";
import OdometerValue from "@/components/OdometerValue";
import TeamFlag from "@/components/TeamFlag";
import { teamCode } from "@/utils/teamCodes";
import { Match, Prediction, UserStats, PublicProfile } from "@/api/entities";
import { supabase } from "@/api/supabase";
import { TOURNAMENT_CODE } from "@/config/tournament";

// ── Live leaderboard helpers ──────────────────────────────────────────────────

export function calculateScore(prediction, match) {
  if (match.actual_score_a === null || match.actual_score_b === null) return { totalPoints: 0 };
  const pA = prediction.predicted_score_a, pB = prediction.predicted_score_b;
  const aA = match.actual_score_a,         aB = match.actual_score_b;
  let total = 0;
  if (pA === aA && pB === aB) {
    total += match.score_odds
      ? (match.score_odds[`${aA}:${aB}`] ?? match.score_odds['other'] ?? 0)
      : (match.exact_score_points || 0);
  }
  const pDir = pA > pB ? 'home' : pA < pB ? 'away' : 'draw';
  const aDir = aA > aB ? 'home' : aA < aB ? 'away' : 'draw';
  if (pDir === aDir) total += aDir === 'home' ? (match.home_win_points || 0) : aDir === 'away' ? (match.away_win_points || 0) : (match.draw_points || 0);
  const aBTTS = aA > 0 && aB > 0, pBTTS = pA > 0 && pB > 0;
  if (pBTTS === aBTTS) total += aBTTS ? (match.btts_yes_points || 0) : (match.btts_no_points || 0);
  const aGoals = aA + aB, pGoals = pA + pB;
  const aRange = aGoals <= 2 ? '0-2' : aGoals <= 4 ? '3-4' : '5+';
  const pRange = pGoals <= 2 ? '0-2' : pGoals <= 4 ? '3-4' : '5+';
  if (pRange === aRange) total += aRange === '0-2' ? (match.goals_0_2_points || 0) : aRange === '3-4' ? (match.goals_3_4_points || 0) : (match.goals_5_plus_points || 0);
  return { totalPoints: parseFloat(total.toFixed(2)) };
}

const TEAM_ALIASES = {
  "ctedivoire":        "ivorycoast",
  "caboverde":         "capeverde",
  "republicofireland": "ireland",
  "czechia":           "czechrepublic",
  "unitedstates":      "usa",
  "usmnt":             "usa",
  "dprkorea":          "northkorea",
  "koreadpr":          "northkorea",
  "korearepublic":     "southkorea",
  // "Manchaster City" is how this club's name is spelled throughout the DB
  // (a long-standing typo baked into imported fixtures/logos) — the live API
  // always returns the correct "Manchester City", so without this alias that
  // match silently drops out of every live view that matches by team name.
  "manchastercity":    "manchestercity",
  // DB uses the common English name "Sporting Lisbon"; UEFA's API returns
  // "Sporting CP" / "Sporting Clube de Portugal" — no shared substring, so
  // that match dropped out of every live view without this alias.
  "sportinglisbon":    "sportingcp",
  // Same pattern: DB uses the English "Bayern Munich" / "Slavia Prague",
  // UEFA's API returns the German/Czech "Bayern München" / "Slavia Praha" —
  // no shared substring even after diacritic-folding (munich vs münchen,
  // prague vs praha), found by auditing all 36 teams after the Fenerbahçe fix.
  "bayernmunich":      "bayernmunchen",
  "slaviaprague":      "slaviapraha",
};
function normTeam(n = '') {
  // Fold accented Latin letters (e.g. "ç" -> "c") before stripping — otherwise
  // an accent gets deleted instead of folded, silently breaking the match
  // against a plain-ASCII spelling of the same name (e.g. UEFA's "Fenerbahçe"
  // vs the DB's "Fenerbahce"), the same failure mode the aliases above cover.
  const base = n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9א-ת]/g, '');
  return TEAM_ALIASES[base] ?? base;
}
// An empty name (e.g. a missing shortName) matches nothing — "x".includes("") is
// true, which used to tie every live match to the first DB match.
function teamsMatch(a, b) { const na = normTeam(a), nb = normTeam(b); if (!na || !nb) return false; return na === nb || na.includes(nb) || nb.includes(na); }
function findDbMatch(apiMatch, dbMatches) {
  const h = apiMatch.homeTeam?.name || '', hS = apiMatch.homeTeam?.shortName || '';
  const a = apiMatch.awayTeam?.name || '', aS = apiMatch.awayTeam?.shortName || '';
  return dbMatches.find(m => (teamsMatch(h, m.team_a) || teamsMatch(hS, m.team_a)) && (teamsMatch(a, m.team_b) || teamsMatch(aS, m.team_b))) || null;
}

function DeltaIcon({ delta }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={delta} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.2 }}>
        {delta > 0
          ? <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold"><TrendingUp className="w-3.5 h-3.5"/>+{delta}</span>
          : delta < 0
          ? <span className="flex items-center gap-1 text-red-400 text-[11px] font-bold"><TrendingDown className="w-3.5 h-3.5"/>{delta}</span>
          : <Minus className="w-3.5 h-3.5 text-slate-600"/>}
      </motion.div>
    </AnimatePresence>
  );
}

// Match cards for the matches in play by the DB alone — kicked off within the
// last 2.5h and not finished — with the score the DB has so far. Used before
// the live API answers (and when it reports nothing live) so the card strip
// already takes its place and the table below doesn't jump. null → none.
const IN_PLAY_MS = 2.5 * 3600e3;
function inPlayCards(matches) {
  const now = Date.now();
  const cards = matches
    .filter(m => !m.is_finished && new Date(m.match_date).getTime() <= now && now - new Date(m.match_date).getTime() < IN_PLAY_MS)
    .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
    .map(m => ({
      home: m.team_a, away: m.team_b,
      homeLogo: m.team_a_logo ?? null, awayLogo: m.team_b_logo ?? null,
      score: m.actual_score_a != null && m.actual_score_b != null ? `${m.actual_score_a}–${m.actual_score_b}` : '–',
      minute: null,
    }));
  return cards.length ? cards : null;
}

// ── Scoreboard strip (broadcast style) ───────────────────────────────────────
// All live matches in one row of narrow cells, like a stadium scoreboard:
// home code + goals on top, away below. A cell whose score just changed lights
// up gold for a few seconds. Up to 7 cells per row; more wrap to a second row.
const GOAL_FLASH_MS = 3500;
function ScoreboardStrip({ cards }) {
  const prev = useRef({});
  const [flash, setFlash] = useState({});
  useEffect(() => {
    const changed = {};
    cards.forEach((c) => {
      const k = `${c.home}|${c.away}`;
      if (prev.current[k] != null && prev.current[k] !== c.score) changed[k] = Date.now();
      prev.current[k] = c.score;
    });
    if (!Object.keys(changed).length) return;
    setFlash((f) => ({ ...f, ...changed }));
    const t = setTimeout(() => setFlash((f) => Object.fromEntries(Object.entries(f).filter(([, at]) => Date.now() - at < GOAL_FLASH_MS))), GOAL_FLASH_MS + 50);
    return () => clearTimeout(t);
  }, [cards]);

  const cols = cards.length <= 7 ? cards.length : Math.ceil(cards.length / 2);
  return (
    <div className="mb-3 grid gap-[3px]" dir="ltr" style={{ gridTemplateColumns: `repeat(${Math.max(cols, 1)}, minmax(0, 1fr))`, maxWidth: cols <= 3 ? 240 : undefined, marginInline: 'auto' }}>
      {cards.map((c) => {
        const [ga, gb] = String(c.score).split(/[–-]/).map((s) => s.trim());
        const lit = flash[`${c.home}|${c.away}`] != null;
        const line = (logo, name, goals, first) => (
          <div className="flex items-center justify-between gap-1 px-1" style={{ height: 20, borderTop: first ? 'none' : '1px solid rgba(255,255,255,.07)' }}>
            <span style={{ font: "700 11px 'Outfit', sans-serif", letterSpacing: '.2px', color: '#dbe2ff' }}>{teamCode(name)}</span>
            <span className="tabular-nums" style={{ fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 16, lineHeight: 1, color: lit ? '#e8c46a' : '#fff' }}>{goals ?? '–'}</span>
          </div>
        );
        return (
          <motion.div key={`${c.home}|${c.away}`} layout
            animate={lit ? { boxShadow: ['0 0 0 rgba(232,196,106,0)', '0 0 14px rgba(232,196,106,.55)', '0 0 0 rgba(232,196,106,0)'] } : { boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            transition={lit ? { duration: 1.4, repeat: 1 } : { duration: 0.3 }}
            style={{ background: lit ? 'rgba(232,196,106,.12)' : '#0a1235', border: '1px solid rgba(255,255,255,.1)', borderTop: `2px solid ${lit ? '#e8c46a' : '#e11d48'}`, transition: 'background .4s, border-color .4s' }}>
            {line(c.homeLogo, c.home, ga, true)}
            {line(c.awayLogo, c.away, gb, false)}
          </motion.div>
        );
      })}
    </div>
  );
}

function RankCard({ row, index, total, isInitial, isMe, onOpen }) {
  const delta = row.officialRank - row.liveRank;
  const rankFromBottom = total - 1 - index;
  const cardDelay   = isInitial ? Math.pow(rankFromBottom, 1.4) * 0.13 + (row.liveRank === 1 ? 0.2 : 0) : 0;
  // Odometer trigger — same pattern as LeaderboardPanel's "regular" table:
  // wait for the card's own entrance animation before rolling the digits so
  // the roll doesn't finish before a late-staggered card is even visible;
  // cards that mount after the initial reveal (isInitial already false) have
  // no entrance to wait for, so they roll immediately.
  const [revealed, setRevealed] = useState(!isInitial);
  // gold flash when this participant climbs
  const lastRank = useRef(row.liveRank);
  const [climbed, setClimbed] = useState(false);
  useEffect(() => {
    if (row.liveRank < lastRank.current) {
      setClimbed(true);
      const t = setTimeout(() => setClimbed(false), 1800);
      lastRank.current = row.liveRank;
      return () => clearTimeout(t);
    }
    lastRank.current = row.liveRank;
  }, [row.liveRank]);

  // Broadcast look: white rank plate · name plate (gold for you) · points plate,
  // all slanted like a TV graphic. Per live match: gold = exact, green = right
  // direction, grey = not (now).
  const SK = 'skewX(-12deg)', UN = 'skewX(12deg)';
  const marks = (row.matchPredictions || []).map((mp, i) => (
    <span key={i} style={{ width: 8, height: 8, borderRadius: 2, flexShrink: 0,
      background: mp.isExact ? '#e8c46a' : mp.isHit ? '#34d399' : 'rgba(255,255,255,.14)',
      boxShadow: mp.isExact ? '0 0 6px rgba(232,196,106,.7)' : 'none' }} />
  ));
  return (
    <motion.div layout layoutId={`lb-${row.userId}`}
      initial={isInitial ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      onAnimationComplete={() => setRevealed(true)}
      transition={{ layout: { type: 'spring', stiffness: 9, damping: 20 }, ...(isInitial ? { delay: cardDelay, duration: 0.5, ease: 'easeOut' } : {}) }}
      onClick={() => onOpen?.()}
      className="relative cursor-pointer select-none flex"
      style={{ height: 40, marginBottom: 5, zIndex: climbed ? 2 : 1 }}>
      <div style={{ width: 38, display: 'grid', placeItems: 'center', background: '#fff', color: '#0a1235', transform: SK, flexShrink: 0 }}>
        <span style={{ transform: UN, fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 26, lineHeight: 1 }}>{row.liveRank}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', marginInlineStart: 3, transform: SK,
        background: isMe ? 'linear-gradient(90deg,#8a6a12,#3b2b06)' : 'linear-gradient(90deg,#1a2a78,#0e1850)',
        boxShadow: climbed ? '0 0 0 2px rgba(232,196,106,.9), 0 0 24px rgba(232,196,106,.45)' : 'none', transition: 'box-shadow .5s ease' }}>
        <span className="truncate" style={{ transform: UN, fontWeight: 800, fontSize: 14, color: '#fff', minWidth: 0,
          ...(isInitial ? { animation: 'lb-blur-focus 1.0s ease-out both', animationDelay: `${cardDelay}s` } : {}) }}>{row.name}</span>
        {marks.length > 0 && <span style={{ transform: UN, display: 'flex', gap: 2, flexShrink: 0 }}>{marks}</span>}
        <span style={{ transform: UN, marginInlineStart: 'auto', flexShrink: 0 }}><DeltaIcon delta={delta} /></span>
      </div>
      <div style={{ width: 76, display: 'grid', placeItems: 'center', marginInlineStart: 3, transform: SK, flexShrink: 0, background: '#0a1235', border: '1px solid rgba(255,255,255,.12)' }}>
        <span className="tabular-nums" style={{ transform: UN, fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 21, lineHeight: 1, color: '#fff' }}>
          <OdometerValue target={row.total} height={20} width={9} decimals={2} trigger={revealed} />
        </span>
      </div>
    </motion.div>
  );
}

export default function LiveLeaderboard() {
  const [rows, setRows]                   = useState([]);
  // the signed-in participant's row is drawn in gold
  const [myId, setMyId]                   = useState(null);
  useEffect(() => { supabase.auth.getSession().then(({ data }) => setMyId(data.session?.user?.id ?? null)).catch(() => {}); }, []);
  const [status, setStatus]               = useState('loading');
  const [liveInfo, setLiveInfo]           = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastUpdate, setLastUpdate]       = useState(null);
  const [openPlayer, setOpenPlayer]       = useState(null);
  const hasShownInitial  = useRef(false);
  const officialRankMap  = useRef({}); // userId → officialRank, set once from Phase 1
  const dbRef            = useRef(null);

  const getName = useCallback(uid => {
    const profiles = dbRef.current?.profiles || [];
    return profiles.find(p => p.user_id === uid)?.display_name || uid?.slice(0, 6) || '?';
  }, []);

  const load = useCallback(async () => {
    try {
      // Kicked off immediately, in parallel with the Supabase load and the
      // reveal-wait below — it doesn't depend on either, so on first load
      // its round trip overlaps with them instead of only starting once
      // both are done (which used to stack all three delays in sequence).
      const now2 = new Date();
      const localDate = now2.toLocaleDateString('sv-SE');
      const prevLocalDate = new Date(now2 - 864e5).toLocaleDateString('sv-SE');
      const liveFetchPromise = fetch(`/api/football?competition=${TOURNAMENT_CODE}&filter=LIVE&dateFrom=${prevLocalDate}&dateTo=${localDate}`);

      // ── Phase 1: load Supabase once, show official scores with reveal animation ──
      if (!dbRef.current) {
        const [matches, profiles, userStats, predictions] = await Promise.all([
          Match.list(), PublicProfile.list(), UserStats.list(), Prediction.list(),
        ]);
        dbRef.current = { matches, profiles, userStats, predictions };
      }
      const data = dbRef.current;

      if (!hasShownInitial.current) {
        const official = data.userStats.map(s => ({
          userId: s.user_id,
          name: getName(s.user_id),
          confirmed: parseFloat((s.total_points || 0).toFixed(2)),
          liveBonus: 0,
          total: parseFloat((s.total_points || 0).toFixed(2)),
        }));
        official.sort((a, b) => b.total - a.total);
        official.forEach((r, i) => {
          r.liveRank = i + 1;
          r.officialRank = i + 1;
          officialRankMap.current[r.userId] = i + 1;
        });
        hasShownInitial.current = true;
        setIsInitialLoad(true);   // reveal animation
        setRows(official);
        // The live match cards normally arrive only in phase 2 and then push the
        // table down — show the ones already known to be in play right away.
        const known = inPlayCards(data.matches);
        if (known) setLiveInfo(known);
        setStatus('done');
        // wait for reveal animation to complete before live update
        const revealWait = Math.pow(Math.max(official.length - 1, 0), 1.4) * 0.13 + 1.2;
        await new Promise(resolve => setTimeout(resolve, revealWait * 1000));
      }

      // ── Phase 2: use the live API result kicked off above, and reorder ────────
      const res  = await liveFetchPromise;
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      const liveMatches = json.matches || [];
      setLastUpdate(new Date());

      // Nothing live per the API (e.g. half-time, or a slow feed): keep the cards
      // of matches still within their playing window so the table doesn't jump.
      if (liveMatches.length === 0) { setLiveInfo(inPlayCards(data.matches)); return; }

      // Collect ALL live DB matches (not just the first one)
      const unfinished = data.matches.filter(m => !m.is_finished);
      const liveDbMatches = [];
      for (const lm of liveMatches) {
        const f = findDbMatch(lm, unfinished);
        if (f) liveDbMatches.push({ dbMatch: f, apiMatch: lm });
      }
      if (liveDbMatches.length === 0) return;

      const confirmedMap = {};
      data.userStats.forEach(s => { confirmedMap[s.user_id] = s.total_points || 0; });

      // Sum live bonus across ALL concurrent live matches per user
      const liveBonusMap = {};
      for (const { dbMatch, apiMatch } of liveDbMatches) {
        const homeScore = apiMatch.score?.fullTime?.home ?? apiMatch.score?.halfTime?.home ?? 0;
        const awayScore = apiMatch.score?.fullTime?.away ?? apiMatch.score?.halfTime?.away ?? 0;
        const liveMatch = { ...dbMatch, actual_score_a: homeScore, actual_score_b: awayScore };

        const matchPreds = data.predictions.filter(p => p.match_id === dbMatch.id);
        const latestMap  = {};
        matchPreds.forEach(p => {
          if (!latestMap[p.user_id] || new Date(p.created_at) > new Date(latestMap[p.user_id].created_at))
            latestMap[p.user_id] = p;
        });
        for (const [userId, pred] of Object.entries(latestMap)) {
          const b  = calculateScore(pred, liveMatch);
          const pA = pred.predicted_score_a, pB = pred.predicted_score_b;
          const pDir = pA > pB ? 'home' : pA < pB ? 'away' : 'draw';
          const aDir = homeScore > awayScore ? 'home' : homeScore < awayScore ? 'away' : 'draw';
          const isExact = pA === homeScore && pB === awayScore;
          const isHit   = pDir === aDir;
          if (!liveBonusMap[userId]) liveBonusMap[userId] = { liveBonus: 0, matchPredictions: [] };
          liveBonusMap[userId].liveBonus += b.totalPoints;
          liveBonusMap[userId].matchPredictions.push({
            predicted: `${pA}-${pB}`,
            homeLogo: dbMatch.team_a_logo ?? null, home: dbMatch.team_a,
            awayLogo: dbMatch.team_b_logo ?? null, away: dbMatch.team_b,
            isExact, isHit,
          });
        }
      }

      const allUserIds = new Set([...Object.keys(liveBonusMap), ...data.userStats.map(s => s.user_id)]);
      const built = [];
      for (const userId of allUserIds) {
        const confirmed        = confirmedMap[userId] || 0;
        const liveBonus        = liveBonusMap[userId]?.liveBonus        || 0;
        const matchPredictions = liveBonusMap[userId]?.matchPredictions || [];
        built.push({ userId, name: getName(userId), confirmed: parseFloat(confirmed.toFixed(2)), liveBonus: parseFloat(liveBonus.toFixed(2)), total: parseFloat((confirmed + liveBonus).toFixed(2)), matchPredictions });
      }
      built.sort((a, b) => b.total - a.total);
      built.forEach((r, i) => { r.liveRank = i + 1; });
      built.forEach(r => { r.officialRank = officialRankMap.current[r.userId] ?? r.liveRank; });

      setIsInitialLoad(false);  // smooth reorder only, no re-reveal
      setRows(built);
      setLiveInfo(liveDbMatches.map(({ dbMatch, apiMatch }) => ({
        home: dbMatch.team_a, away: dbMatch.team_b,
        homeLogo: dbMatch.team_a_logo ?? null, awayLogo: dbMatch.team_b_logo ?? null,
        score: `${apiMatch.score?.fullTime?.home ?? apiMatch.score?.halfTime?.home ?? 0}–${apiMatch.score?.fullTime?.away ?? apiMatch.score?.halfTime?.away ?? 0}`,
        minute: apiMatch.minute ?? null,
      })));
    } catch (e) {
      console.error('[LiveLeaderboard]', e);
      if (!hasShownInitial.current) setStatus('error');
    }
  }, [getName]);

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [load]);

  if (status === 'loading') return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
      <span className="text-slate-500 text-xs">טוען טבלה...</span>
    </div>
  );
  if (status === 'error') return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <WifiOff className="w-8 h-8 text-red-400/40" />
      <p className="text-slate-500 text-sm">לא ניתן לטעון את הטבלה</p>
    </div>
  );

  return (
    <div>
      <style>{`@keyframes lb-blur-focus { from { filter: blur(6px); opacity: 0; } to { filter: blur(0); opacity: 1; } }`}</style>

      {/* live matches: one-row scoreboard */}
      {liveInfo && liveInfo.length > 0 && <ScoreboardStrip cards={liveInfo} />}

      <div style={{ maxWidth: 380, margin: '0 auto' }}>
        <AnimatePresence>
          {rows.map((row, idx) => (
            <RankCard key={row.userId} row={row} index={idx} total={rows.length} isInitial={isInitialLoad}
              isMe={row.userId === myId}
              onOpen={() => setOpenPlayer(row.userId)} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {openPlayer && (() => {
          const player = rows.find(r => r.userId === openPlayer);
          if (!player) return null;
          return (
            <motion.div key="prediction-modal" className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.6)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenPlayer(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="rounded-2xl p-5 w-full max-w-xs" style={{ background: '#0b1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 className="text-white font-bold text-sm text-center mb-3">הניחושים של {player.name}</h4>
                <div className="space-y-2">
                  {(!player.matchPredictions || player.matchPredictions.length === 0) ? (
                    <p className="text-slate-500 text-xs text-center py-4">אין ניחושים למשחקים החיים כרגע</p>
                  ) : player.matchPredictions.map((mp, i) => {
                    const status = mp.isExact ? { icon: '🎯', color: '#34d399' }
                                 : mp.isHit   ? { icon: '✅', color: '#7cadee' }
                                 :              { icon: '✕',  color: '#64748b' };
                    return (
                      <div key={i} className="flex items-center justify-between gap-2 text-[12px]">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <TeamFlag logo={mp.homeLogo} name={mp.home} size={14} rounded="sm" />
                          <span className="text-slate-400 truncate">{mp.home} - {mp.away}</span>
                          <TeamFlag logo={mp.awayLogo} name={mp.away} size={14} rounded="sm" />
                        </div>
                        <span className="font-mono font-bold flex-shrink-0" style={{ color: status.color }}>{status.icon} {mp.predicted}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => setOpenPlayer(null)}
                  className="w-full mt-4 py-2 rounded-lg text-slate-300 text-xs font-semibold"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  סגור
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {lastUpdate && (
        <p className="text-center text-slate-700 text-[10px] mt-3 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" /> עודכן {lastUpdate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  );
}
