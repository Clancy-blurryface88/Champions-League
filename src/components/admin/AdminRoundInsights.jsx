import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Round, Match, Prediction, PublicProfile } from "@/api/entities";
import {
  Trophy, Target, TrendingUp, TrendingDown, Zap, BarChart3,
  Users, Star, AlertTriangle, ChevronDown, Flame, Shield,
  Crown, Sparkles, Handshake, Ghost, Swords, Eye, Hash, Crosshair
} from "lucide-react";

const pct = (n, d) => d === 0 ? 0 : Math.round((n / d) * 100);
const avg = arr => arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
const RANK_COLOR = r => r === 1 ? '#7cadee' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : '#94a3b8';
const matchOutcome = (a, b) => a > b ? 'h' : a < b ? 'a' : 'd';

function StatCard({ label, value, sub, color = '#097adc', icon: Icon }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1.5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {Icon && <Icon className="w-4 h-4 mb-0.5" style={{ color }} />}
      <div className="text-2xl font-black tabular-nums" style={{ color }}>{value}</div>
      <div className="text-white/80 text-xs font-semibold">{label}</div>
      {sub && <div className="text-slate-500 text-[10px]">{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex-1 h-px bg-gradient-to-r from-sky-400/30 to-transparent" />
      <span className="text-sky-400/80 text-[11px] font-bold tracking-widest uppercase whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-gradient-to-l from-sky-400/30 to-transparent" />
    </div>
  );
}

function InsightCard({ icon: Icon, title, name, detail, bg, border, iconColor, titleColor }) {
  if (!name) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{ background: bg, border: `1px solid ${border}` }}>
      <Icon className="w-6 h-6 flex-shrink-0" style={{ color: iconColor }} />
      <div className="min-w-0">
        <div className="font-bold text-sm truncate" style={{ color: titleColor }}>{title && <span className="text-[10px] font-normal mr-1 opacity-60">{title}</span>}{name}</div>
        <div className="text-[10px] mt-0.5" style={{ color: iconColor + 'bb' }}>{detail}</div>
      </div>
    </div>
  );
}

export default function AdminRoundInsights() {
  const [rounds, setRounds]           = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [loadingRounds, setLoadingRounds] = useState(true);

  useEffect(() => {
    Round.list('order').then(r => {
      const sorted = [...r].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setRounds(sorted);
      if (sorted.length > 0) setSelectedRound(sorted[0].id);
    }).finally(() => setLoadingRounds(false));
  }, []);

  useEffect(() => {
    if (!selectedRound) return;
    setLoading(true);
    setData(null);
    (async () => {
      const [matches, allPreds, profiles] = await Promise.all([
        Match.filter({ round_id: selectedRound }),
        Prediction.list(),
        PublicProfile.list(),
      ]);

      const finishedMatches = matches.filter(m => m.is_finished && m.actual_score_a !== null);
      const matchIds        = new Set(matches.map(m => m.id));
      const finishedIds     = new Set(finishedMatches.map(m => m.id));

      const getName = uid => profiles.find(p => p.user_id === uid)?.display_name || uid?.slice(0, 6) || '?';

      // deduplicate: latest prediction per user+match
      const latestMap = {};
      allPreds.forEach(p => {
        if (!matchIds.has(p.match_id)) return;
        const key = `${p.user_id}__${p.match_id}`;
        if (!latestMap[key] || new Date(p.created_at) > new Date(latestMap[key].created_at))
          latestMap[key] = p;
      });
      const preds         = Object.values(latestMap);
      const finishedPreds = preds.filter(p => finishedIds.has(p.match_id));
      const allParticipants = new Set(preds.map(p => p.user_id));

      // ── per-user stats ────────────────────────────────────────────────
      const userMap = {};
      const ensureUser = uid => {
        if (!userMap[uid]) userMap[uid] = {
          userId: uid, name: getName(uid),
          pts: 0, exact: 0, outcome: 0, btts: 0, range: 0,
          totalGoalsPredicted: 0, predicted: 0
        };
        return userMap[uid];
      };
      allParticipants.forEach(uid => ensureUser(uid));

      finishedPreds.forEach(p => {
        const u = ensureUser(p.user_id);
        u.predicted++;
        u.pts = parseFloat((u.pts + (p.points_earned || 0)).toFixed(2));
        u.exact   += (p.exact_score_points_earned         || 0) > 0 ? 1 : 0;
        u.outcome += (p.correct_outcome_points_earned     || 0) > 0 ? 1 : 0;
        u.btts    += (p.both_teams_scored_points_earned   || 0) > 0 ? 1 : 0;
        u.range   += (p.goals_range_points_earned         || 0) > 0 ? 1 : 0;
        u.totalGoalsPredicted += (p.predicted_score_a || 0) + (p.predicted_score_b || 0);
      });

      const userRows = Object.values(userMap)
        .sort((a, b) => b.pts - a.pts)
        .map((u, i) => ({ ...u, rank: i + 1 }));

      // ── per-match stats ───────────────────────────────────────────────
      const matchStats = finishedMatches.map(m => {
        const mPreds = finishedPreds.filter(p => p.match_id === m.id);
        const total  = mPreds.length;
        const exact  = mPreds.filter(p =>
          p.predicted_score_a === m.actual_score_a && p.predicted_score_b === m.actual_score_b
        ).length;
        const correct = mPreds.filter(p =>
          matchOutcome(p.predicted_score_a, p.predicted_score_b) === matchOutcome(m.actual_score_a, m.actual_score_b)
        ).length;

        const predCount = {};
        mPreds.forEach(p => {
          const k = `${p.predicted_score_a}-${p.predicted_score_b}`;
          predCount[k] = (predCount[k] || 0) + 1;
        });
        const topPredEntry = Object.entries(predCount).sort((a, b) => b[1] - a[1])[0];
        const actualKey    = `${m.actual_score_a}-${m.actual_score_b}`;

        // unique correct: exact hit only 1 person made
        const uniqueExactUsers = mPreds.filter(p =>
          p.predicted_score_a === m.actual_score_a &&
          p.predicted_score_b === m.actual_score_b &&
          predCount[actualKey] === 1
        ).map(p => p.user_id);

        return {
          id: m.id,
          name: `${m.team_a} vs ${m.team_b}`,
          actual: `${m.actual_score_a}–${m.actual_score_b}`,
          total, exact, correct,
          exactPct:   pct(exact, total),
          correctPct: pct(correct, total),
          topPred:       topPredEntry ? topPredEntry[0] : null,
          topPredCount:  topPredEntry ? topPredEntry[1] : 0,
          topPredWasCorrect: topPredEntry ? topPredEntry[0] === actualKey : false,
          uniqueExactUsers,
        };
      });

      // ── aggregate insights ────────────────────────────────────────────
      const totalExacts   = finishedPreds.reduce((s, p) => s + ((p.exact_score_points_earned || 0) > 0 ? 1 : 0), 0);
      const totalOutcomes = finishedPreds.reduce((s, p) => s + ((p.correct_outcome_points_earned || 0) > 0 ? 1 : 0), 0);
      const avgPts        = userRows.length > 0 ? parseFloat(avg(userRows.map(u => u.pts)).toFixed(2)) : 0;

      const sortedByGoals   = [...userRows].sort((a, b) => b.totalGoalsPredicted - a.totalGoalsPredicted);
      const topScorer       = userRows[0];
      const topExact        = [...userRows].sort((a, b) => b.exact - a.exact)[0];
      const topOutcome      = [...userRows].sort((a, b) => b.outcome - a.outcome)[0];
      const topGoals        = sortedByGoals[0];
      const leastGoals      = sortedByGoals[sortedByGoals.length - 1];
      const zeroScorers     = userRows.filter(u => u.pts === 0);

      const hardestMatch    = [...matchStats].sort((a, b) => a.correctPct - b.correctPct)[0];
      const easiestMatch    = [...matchStats].sort((a, b) => b.correctPct - a.correctPct)[0];

      // highest agreement on a single prediction
      const consensusMatch  = [...matchStats].sort((a, b) => {
        const ap = a.total > 0 ? a.topPredCount / a.total : 0;
        const bp = b.total > 0 ? b.topPredCount / b.total : 0;
        return bp - ap;
      })[0];

      // "החטא הגדול" — popular prediction that was wrong + low correct pct
      const sinMatch = [...matchStats]
        .filter(m => !m.topPredWasCorrect && m.correctPct < 50)
        .sort((a, b) => a.correctPct - b.correctPct)[0] || hardestMatch;

      // rare exact hit — only one person got the exact score right
      const rareHits = matchStats.flatMap(m =>
        m.uniqueExactUsers.map(uid => ({ uid, name: getName(uid), matchName: m.name, actual: m.actual }))
      );

      // התוצאה הכי שכיחה שנשלחה — כלל המחזור
      const allScoreCounts = {};
      finishedPreds.forEach(p => {
        const k = `${p.predicted_score_a}-${p.predicted_score_b}`;
        allScoreCounts[k] = (allScoreCounts[k] || 0) + 1;
      });
      const mostCommonPredEntry = Object.entries(allScoreCounts).sort((a, b) => b[1] - a[1])[0];
      const mostCommonPred = mostCommonPredEntry
        ? { score: mostCommonPredEntry[0], count: mostCommonPredEntry[1] }
        : null;

      // המשחק עם הכי הרבה פגיעות מדויקות
      const mostExactHitsMatch = [...matchStats]
        .filter(m => m.exact > 0)
        .sort((a, b) => b.exact - a.exact)[0] || null;

      // match with zero exact hits
      const zeroExactMatch = matchStats
        .filter(m => m.exact === 0 && m.total > 0)
        .sort((a, b) => b.total - a.total)[0];

      // match everyone got direction right
      const perfectMatch = matchStats
        .filter(m => m.correctPct === 100 && m.total > 0)
        .sort((a, b) => b.total - a.total)[0];

      // users who submitted no predictions for finished matches
      const noPredsUsers = Array.from(allParticipants)
        .filter(uid => !finishedPreds.some(p => p.user_id === uid))
        .map(uid => getName(uid));

      setData({
        userRows, matchStats, finishedMatches,
        totalPreds: finishedPreds.length, totalExacts, totalOutcomes,
        avgPts, zeroScorers, allParticipants: allParticipants.size,
        topScorer, topExact, topOutcome, topGoals, leastGoals,
        hardestMatch, easiestMatch, consensusMatch, sinMatch,
        rareHits, zeroExactMatch, perfectMatch, noPredsUsers,
        mostCommonPred, mostExactHitsMatch,
      });
    })().catch(console.error).finally(() => setLoading(false));
  }, [selectedRound]);

  return (
    <div className="space-y-6">
      {/* Header + round selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-sky-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-lg">תובנות מחזור</h2>
          <p className="text-slate-400 text-sm">ניתוח מעמיק לכל המשתתפים</p>
        </div>
        {!loadingRounds && (
          <div className="relative">
            <select
              value={selectedRound || ''}
              onChange={e => setSelectedRound(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2 pr-8 outline-none focus:border-sky-500/50 cursor-pointer">
              {rounds.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
          <span className="text-sm">מנתח נתונים...</span>
        </div>
      )}

      <AnimatePresence mode="wait">
      {data && !loading && (
        <motion.div key={selectedRound} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="space-y-8">

          {/* ── סיכום מחזור ─────────────────────────────────────────────── */}
          <div>
            <SectionTitle>סיכום מחזור</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="משתתפים" value={data.allParticipants} icon={Users} color="#60a5fa" />
              <StatCard label="ממוצע נקודות" value={data.avgPts} sub="לשחקן" icon={TrendingUp} color="#34d399" />
              <StatCard label="פגיעות מדויקות" value={data.totalExacts} sub={`מתוך ${data.totalPreds} ניחושים`} icon={Target} color="#097adc" />
              <StatCard label="כיוונים נכונים" value={data.totalOutcomes} sub={`${pct(data.totalOutcomes, data.totalPreds)}% הצלחה`} icon={Zap} color="#a78bfa" />
            </div>
          </div>

          {/* ── תובנות מעניינות ─────────────────────────────────────────── */}
          <div>
            <SectionTitle>תובנות מעניינות</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <InsightCard
                icon={Trophy} title="מוביל המחזור:"
                name={data.topScorer?.name}
                detail={`${data.topScorer?.pts} נקודות — ${data.topScorer?.exact} פגיעות מדויקות, ${data.topScorer?.outcome} כיוונים`}
                bg="rgba(9, 122, 220,0.08)" border="rgba(9, 122, 220,0.25)"
                iconColor="#097adc" titleColor="#7cadee"
              />

              <InsightCard
                icon={Target} title="מלך הפגיעות:"
                name={data.topExact?.exact > 0 ? data.topExact?.name : null}
                detail={`${data.topExact?.exact} פגיעות מדויקות במחזור`}
                bg="rgba(251,191,36,0.08)" border="rgba(251,191,36,0.22)"
                iconColor="#f59e0b" titleColor="#fcd34d"
              />

              <InsightCard
                icon={Eye} title="קורא כיוונים:"
                name={data.topOutcome?.outcome > 0 ? data.topOutcome?.name : null}
                detail={`ניחש נכון את הכיוון ${data.topOutcome?.outcome} פעמים`}
                bg="rgba(167,139,250,0.08)" border="rgba(167,139,250,0.22)"
                iconColor="#a78bfa" titleColor="#c4b5fd"
              />

              <InsightCard
                icon={Flame} title="מלך הגולים:"
                name={data.topGoals?.totalGoalsPredicted > 0 ? data.topGoals?.name : null}
                detail={`ניחש ${data.topGoals?.totalGoalsPredicted} שערים בסך הכל — האגרסיבי ביותר`}
                bg="rgba(239,68,68,0.08)" border="rgba(239,68,68,0.22)"
                iconColor="#f87171" titleColor="#fca5a5"
              />

              {/* התוצאה הכי שכיחה */}
              {data.mostCommonPred && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <Hash className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-indigo-400/60 mb-0.5">התוצאה הכי שכיחה שנשלחה:</div>
                    <div className="font-black text-xl text-indigo-300 tabular-nums">{data.mostCommonPred.score}</div>
                    <div className="text-[10px] text-indigo-400/70 mt-0.5">נשלחה {data.mostCommonPred.count} פעמים במחזור</div>
                  </div>
                </div>
              )}

              {/* המשחק עם הכי הרבה פגיעות מדויקות */}
              {data.mostExactHitsMatch && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <Crosshair className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-emerald-400/60 mb-0.5">הכי הרבה פגעו מדויק:</div>
                    <div className="font-bold text-sm text-emerald-300 truncate">{data.mostExactHitsMatch.name}</div>
                    <div className="text-[10px] text-emerald-400/70 mt-0.5">
                      {data.mostExactHitsMatch.exact} פגיעות מדויקות · תוצאה: {data.mostExactHitsMatch.actual}
                      {' '}({data.mostExactHitsMatch.exactPct}% מהמשתתפים)
                    </div>
                  </div>
                </div>
              )}

              <InsightCard
                icon={Shield} title="השחקן השמרן:"
                name={data.leastGoals?.name}
                detail={`רק ${data.leastGoals?.totalGoalsPredicted} שערים בסך הכל — הדפנסיבי ביותר`}
                bg="rgba(100,116,139,0.08)" border="rgba(100,116,139,0.22)"
                iconColor="#94a3b8" titleColor="#cbd5e1"
              />

              {/* ניחוש קבוצתי */}
              {data.consensusMatch && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(34,211,238,0.08)', border:'1px solid rgba(34,211,238,0.22)' }}>
                  <Handshake className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-cyan-400/60 mb-0.5">ניחוש קבוצתי:</div>
                    <div className="font-bold text-sm text-cyan-300 truncate">{data.consensusMatch.name}</div>
                    <div className="text-[10px] text-cyan-400/70 mt-0.5">
                      {data.consensusMatch.topPredCount} מ-{data.consensusMatch.total} ניחשו {data.consensusMatch.topPred}
                      {' '}{data.consensusMatch.topPredWasCorrect ? '✅ נכון!' : `❌ טעות! תוצאה: ${data.consensusMatch.actual}`}
                    </div>
                  </div>
                </div>
              )}

              {/* החטא הגדול */}
              {data.sinMatch && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.22)' }}>
                  <Swords className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-red-400/60 mb-0.5">החטא הגדול:</div>
                    <div className="font-bold text-sm text-red-300 truncate">{data.sinMatch.name}</div>
                    <div className="text-[10px] text-red-400/70 mt-0.5">
                      רק {data.sinMatch.correctPct}% ניחשו נכון · תוצאה: {data.sinMatch.actual}
                      {data.sinMatch.topPred && ` · רוב ניחשו: ${data.sinMatch.topPred}`}
                    </div>
                  </div>
                </div>
              )}

              {/* ניחוש נדיר — כל פגיעה ייחודית */}
              {data.rareHits.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.3)' }}>
                  <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-yellow-400/60 mb-0.5">ניחוש נדיר — רק אחד פגע!</div>
                    {data.rareHits.slice(0, 2).map((h, i) => (
                      <div key={i} className="font-bold text-sm text-yellow-300 truncate">{h.name}</div>
                    ))}
                    <div className="text-[10px] text-yellow-400/70 mt-0.5">
                      {data.rareHits[0].matchName} · תוצאה: {data.rareHits[0].actual}
                      {data.rareHits.length > 1 && ` ועוד ${data.rareHits.length - 1}`}
                    </div>
                  </div>
                </div>
              )}

              {/* כולם ניחשו נכון */}
              {data.perfectMatch && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(52,211,153,0.10)', border:'1px solid rgba(52,211,153,0.3)' }}>
                  <Crown className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-emerald-400/60 mb-0.5">פגיעה קבוצתית!</div>
                    <div className="font-bold text-sm text-emerald-300 truncate">{data.perfectMatch.name}</div>
                    <div className="text-[10px] text-emerald-400/70 mt-0.5">כולם ניחשו נכון את הכיוון!</div>
                  </div>
                </div>
              )}

              {/* המשחק שאף אחד לא פגע מדויק */}
              {data.zeroExactMatch && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.18)' }}>
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-red-400/60 mb-0.5">אף אחד לא פגע מדויק:</div>
                    <div className="font-bold text-sm text-red-300 truncate">{data.zeroExactMatch.name}</div>
                    <div className="text-[10px] text-red-400/70 mt-0.5">תוצאה: {data.zeroExactMatch.actual}</div>
                  </div>
                </div>
              )}

              {/* הכי קל לניחוש */}
              {data.easiestMatch && data.easiestMatch.correctPct > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.22)' }}>
                  <Star className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-emerald-400/60 mb-0.5">הכי קל לניחוש:</div>
                    <div className="font-bold text-sm text-emerald-300 truncate">{data.easiestMatch.name}</div>
                    <div className="text-[10px] text-emerald-400/70 mt-0.5">{data.easiestMatch.correctPct}% ניחשו נכון · {data.easiestMatch.actual}</div>
                  </div>
                </div>
              )}

              {/* אפסיים */}
              {data.zeroScorers.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(100,116,139,0.08)', border:'1px solid rgba(100,116,139,0.2)' }}>
                  <TrendingDown className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 mb-0.5">{data.zeroScorers.length} משתתפים עם 0 נקודות:</div>
                    <div className="font-bold text-sm text-slate-300 truncate">
                      {data.zeroScorers.map(u => u.name).join(', ')}
                    </div>
                  </div>
                </div>
              )}

              {/* לא הגישו ניחושים */}
              {data.noPredsUsers.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(100,116,139,0.06)', border:'1px solid rgba(100,116,139,0.15)' }}>
                  <Ghost className="w-6 h-6 text-slate-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 mb-0.5">לא הגישו ניחושים:</div>
                    <div className="font-bold text-sm text-slate-400 truncate">
                      {data.noPredsUsers.join(', ')}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ── פירוט מלא ───────────────────────────────────────────────── */}
          <div>
            <SectionTitle>פירוט מלא</SectionTitle>
            <div className="rounded-2xl overflow-hidden border border-slate-700/60" style={{ background:'rgba(5,10,20,0.7)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/60">
                    <th className="px-4 py-2.5 text-left text-slate-500 text-[11px] font-bold w-8">#</th>
                    <th className="px-4 py-2.5 text-right text-slate-500 text-[11px] font-bold">שם</th>
                    <th className="px-3 py-2.5 text-center text-slate-500 text-[11px] font-bold">נק'</th>
                    <th className="px-3 py-2.5 text-center text-yellow-500/70 text-[11px] font-bold" title="פגיעה מדויקת">🎯</th>
                    <th className="px-3 py-2.5 text-center text-blue-500/70 text-[11px] font-bold" title="כיוון נכון">✅</th>
                    <th className="px-3 py-2.5 text-center text-emerald-500/70 text-[11px] font-bold" title="BTTS">⚽</th>
                    <th className="px-3 py-2.5 text-center text-purple-500/70 text-[11px] font-bold" title="טווח שערים">📊</th>
                    <th className="px-3 py-2.5 text-center text-red-500/70 text-[11px] font-bold" title="שערים שניחש">🔥</th>
                  </tr>
                </thead>
                <tbody>
                  {data.userRows.map(u => (
                    <tr key={u.userId} className="border-b border-slate-800/60 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-2.5">
                        <span className="text-xs font-bold" style={{ color: RANK_COLOR(u.rank) }}>
                          {u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank-1] : u.rank}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-white text-xs font-medium">{u.name}</td>
                      <td className="px-3 py-2.5 text-center font-black text-sm tabular-nums" style={{ color: RANK_COLOR(u.rank) }}>{u.pts}</td>
                      <td className="px-3 py-2.5 text-center text-yellow-400 text-xs tabular-nums">{u.exact || '—'}</td>
                      <td className="px-3 py-2.5 text-center text-blue-400 text-xs tabular-nums">{u.outcome || '—'}</td>
                      <td className="px-3 py-2.5 text-center text-emerald-400 text-xs tabular-nums">{u.btts || '—'}</td>
                      <td className="px-3 py-2.5 text-center text-purple-400 text-xs tabular-nums">{u.range || '—'}</td>
                      <td className="px-3 py-2.5 text-center text-red-400 text-xs tabular-nums">{u.totalGoalsPredicted || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2.5 text-[10px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                <span>🎯 פגיעה מדויקת</span>
                <span>✅ כיוון נכון</span>
                <span>⚽ BTTS</span>
                <span>📊 טווח שערים</span>
                <span>🔥 שערים שניחש (סה״כ)</span>
              </div>
            </div>
          </div>

        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
