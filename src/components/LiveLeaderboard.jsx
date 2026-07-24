import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, TrendingUp, TrendingDown, Minus, WifiOff } from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";
import ScoreCounter from "@/components/ScoreCounter";
import TeamFlag from "@/components/TeamFlag";
import { Match, Prediction, UserStats, PublicProfile } from "@/api/entities";

// ── Live leaderboard helpers ──────────────────────────────────────────────────

function calculateScore(prediction, match) {
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
};
function normTeam(n = '') {
  const base = n.toLowerCase().replace(/[^a-z0-9א-ת]/g, '');
  return TEAM_ALIASES[base] ?? base;
}
function teamsMatch(a, b) { const na = normTeam(a), nb = normTeam(b); return na === nb || na.includes(nb) || nb.includes(na); }
function findDbMatch(apiMatch, dbMatches) {
  const h = apiMatch.homeTeam?.name || '', hS = apiMatch.homeTeam?.shortName || '';
  const a = apiMatch.awayTeam?.name || '', aS = apiMatch.awayTeam?.shortName || '';
  return dbMatches.find(m => (teamsMatch(h, m.team_a) || teamsMatch(hS, m.team_a)) && (teamsMatch(a, m.team_b) || teamsMatch(aS, m.team_b))) || null;
}

const RANK_COLOR  = r => r === 1 ? '#7dd3fc' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : 'rgba(255,255,255,.45)';
const RANK_BORDER = r => r === 1 ? '#7dd3fc' : r === 2 ? '#D1D5DB' : r === 3 ? '#D97706' : '#475569';
const RANK_BG     = r => r === 1 ? 'linear-gradient(135deg,rgba(125,211,252,.22),rgba(56,189,248,.22))'
                       : r === 2 ? 'linear-gradient(135deg,rgba(209,213,219,.18),rgba(156,163,175,.18))'
                       : r === 3 ? 'linear-gradient(135deg,rgba(56,189,248,.20),rgba(217,119,6,.20))'
                       : 'rgba(30,41,59,.60)';

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

function RankCard({ row, index, total, isInitial }) {
  const delta = row.officialRank - row.liveRank;
  const rankFromBottom = total - 1 - index;
  const cardDelay   = isInitial ? Math.pow(rankFromBottom, 1.4) * 0.13 + (row.liveRank === 1 ? 0.2 : 0) : 0;
  const scoreDur    = isInitial ? 0.7 : 2.8;
  const scoreDelay  = isInitial ? cardDelay + 0.2 : 0;
  return (
    <motion.div layout layoutId={`lb-${row.userId}`}
      initial={isInitial ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ layout: { type: 'spring', stiffness: 9, damping: 20 }, ...(isInitial ? { delay: cardDelay, duration: 0.5, ease: 'easeOut' } : {}) }}
      className="relative mb-1">
      <div style={{ transform: 'skewX(-6deg)', borderRadius: 8, overflow: 'hidden', border: `2px solid ${RANK_BORDER(row.liveRank)}`, background: RANK_BG(row.liveRank), transition: 'border-color .5s ease, background .5s ease', position: 'relative' }}>
        <ShineBorder
          borderRadius={8}
          borderWidth={1}
          duration={row.liveRank === 1 ? 6 : row.liveRank === 2 ? 7 : row.liveRank === 3 ? 8 : 12}
          shineColor={
            row.liveRank === 1 ? ['#7dd3fc','#fff','#38bdf8'] :
            row.liveRank === 2 ? ['#C0C0C0','#fff','#94a3b8'] :
            row.liveRank === 3 ? ['#CD7F32','#fff','#D97706'] :
            ['#475569','#64748b','#475569']
          }
        />
        <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%) skewX(6deg)', fontSize: 32, fontWeight: 900, color: RANK_COLOR(row.liveRank), opacity: 0.15, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', transition: 'color .5s ease' }}>
          {row.liveRank}
        </span>
        <div style={{ transform: 'skewX(6deg)', padding: '13px 14px 13px 32px' }}>
          <div className="flex items-center gap-2.5">
            <p className="flex-1 min-w-0 truncate text-[13px] font-semibold text-slate-200 text-center"
              style={isInitial ? { animation: 'lb-blur-focus 1.0s ease-out both', animationDelay: `${cardDelay}s` } : {}}>
              {row.name}
            </p>
            <span className="text-[12px] font-bold text-emerald-400 tabular-nums flex-shrink-0">
              <ScoreCounter value={row.total} duration={scoreDur} delay={scoreDelay} showDecimals={true} />
            </span>
            <div className="flex-shrink-0 w-8 flex justify-end">
              <DeltaIcon delta={delta} />
            </div>
            {row.matchPredictions && row.matchPredictions.length > 0 ? (
              <div className="flex flex-col gap-0.5 flex-shrink-0 items-end" style={{ minWidth: 38 }}>
                {row.matchPredictions.map((mp, i) => (
                  <div key={i} className="flex items-center gap-0.5 flex-shrink-0">
                    <TeamFlag logo={mp.homeLogo} name={mp.home} size={9} className="flex-shrink-0" rounded="sm" />
                    <span className="text-[11px] font-mono font-bold tabular-nums leading-none"
                      style={{ color: '#7dd3fc' }}>
                      {mp.predicted}
                    </span>
                    <TeamFlag logo={mp.awayLogo} name={mp.away} size={9} className="flex-shrink-0" rounded="sm" />
                    <span style={{ width: 14, marginLeft: 4, display: 'inline-flex', justifyContent: 'center', flexShrink: 0 }}>
                      {mp.isExact ? <span style={{ fontSize: 10, lineHeight: 1 }}>🎯</span> : null}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="flex-shrink-0" style={{ minWidth: 38 }} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveLeaderboard() {
  const [rows, setRows]                   = useState([]);
  const [status, setStatus]               = useState('loading');
  const [liveInfo, setLiveInfo]           = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastUpdate, setLastUpdate]       = useState(null);
  const hasShownInitial  = useRef(false);
  const officialRankMap  = useRef({}); // userId → officialRank, set once from Phase 1
  const dbRef            = useRef(null);

  const getName = useCallback(uid => {
    const profiles = dbRef.current?.profiles || [];
    return profiles.find(p => p.user_id === uid)?.display_name || uid?.slice(0, 6) || '?';
  }, []);

  const load = useCallback(async () => {
    try {
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
        setStatus('done');
        // wait for reveal animation to complete before live update
        const revealWait = Math.pow(Math.max(official.length - 1, 0), 1.4) * 0.13 + 1.2;
        await new Promise(resolve => setTimeout(resolve, revealWait * 1000));
      }

      // ── Phase 2: fetch live API and smoothly reorder ──────────────────────────
      const now2 = new Date();
      const localDate = now2.toLocaleDateString('sv-SE');
      const prevLocalDate = new Date(now2 - 864e5).toLocaleDateString('sv-SE');
      const res  = await fetch(`/api/football?competition=WC&filter=LIVE&dateFrom=${prevLocalDate}&dateTo=${localDate}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      const liveMatches = json.matches || [];
      setLastUpdate(new Date());

      if (liveMatches.length === 0) { setLiveInfo(null); return; }

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

      {/* live match chips — one per concurrent live match */}
      <AnimatePresence>
        {liveInfo && liveInfo.map((info, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ delay: i * 0.08 }}
            className="mb-2 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: 'rgba(52,211,153,.08)', border: '1px solid rgba(52,211,153,.25)' }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <TeamFlag logo={info.homeLogo} name={info.home} className="w-4 h-4 flex-shrink-0" />
            <span className="font-bold text-xs text-emerald-400">{info.home}</span>
            <span className="font-bold text-xs text-white tabular-nums">{info.score}</span>
            <span className="font-bold text-xs text-emerald-400">{info.away}</span>
            <TeamFlag logo={info.awayLogo} name={info.away} className="w-4 h-4 flex-shrink-0" />
            {info.minute && <span className="text-slate-500 text-[10px] mr-1">{info.minute}'</span>}
          </motion.div>
        ))}
      </AnimatePresence>

      <div style={{ maxWidth: 262, margin: '0 auto' }}>
        <AnimatePresence>
          {rows.map((row, idx) => (
            <RankCard key={row.userId} row={row} index={idx} total={rows.length} isInitial={isInitialLoad} />
          ))}
        </AnimatePresence>
      </div>

      {lastUpdate && (
        <p className="text-center text-slate-700 text-[10px] mt-3 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" /> עודכן {lastUpdate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  );
}
