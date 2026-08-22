import TeamFlag from "@/components/TeamFlag";
import LoadingScreen from "@/components/LoadingScreen";
import CircleLoader from "@/components/CircleLoader";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { User } from "@/api/entities";
import { Round } from "@/api/entities";
import { Match } from "@/api/entities";
import { Prediction } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronUp, ChevronDown, Eye, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LoaderBar } from "../components/ui/LoaderBar";
import LottieAnimation from "@/components/ui/LottieAnimation";
// import { BrkButton } from "../components/ui/BrkButton"; // Removed BrkButton import
import { calculateScoreByRound } from "../components/utils/calculateScoreByRound"; // Import frontend version
import { getRoundLeaderboard } from "../components/utils/getRoundLeaderboard"; // NEW: Import frontend version
import { AnimatedList } from "@/components/magicui/animated-list";
import ScoreAccuracyVisuals from "@/components/predictions/ScoreAccuracyVisuals";
import { calculateMatchMaxPotentialPoints } from "../components/utils/calculateMatchMaxPotentialPoints";
import OdometerValue from "@/components/OdometerValue";


const OUTCOME_COLORS = {
  exact:   { hex: '#34d399', text: 'text-emerald-400', border: 'border-emerald-500/30', divider: 'bg-emerald-400/40' },
  correct: { hex: '#fbbf24', text: 'text-amber-400',  border: 'border-amber-500/30',  divider: 'bg-amber-400/40'  },
  wrong:   { hex: '#f87171', text: 'text-red-400',     border: 'border-red-500/25',     divider: 'bg-red-400/40'     },
  default: { hex: '#34d399', text: 'text-emerald-400', border: 'border-emerald-500/30', divider: 'bg-emerald-400/40' },
};

function AnimatedDonut({ percentage, size = 64, outcomeType }) {
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    setAnimPct(0);
    const t = setTimeout(() => setAnimPct(percentage), 80);
    return () => clearTimeout(t);
  }, [percentage]);

  // Color by outcome: exact=green, correct=yellow, wrong=red
  const color = (OUTCOME_COLORS[outcomeType] || OUTCOME_COLORS.default).hex;

  // Semicircle geometry: arc from 9 o'clock → 12 o'clock → 3 o'clock (top half)
  const R = 30, cx = 40, cy = 38;
  const fullC = 2 * Math.PI * R;
  const arcLen = Math.PI * R;
  const filledLen = (animPct / 100) * arcLen;

  // Comet head tip position along the arc
  // angle=π at 0% (9 o'clock), angle=0 at 100% (3 o'clock)
  const angle = Math.PI * (1 - animPct / 100);
  const tipX = cx + R * Math.cos(angle);
  const tipY = cy - R * Math.sin(angle);

  const uid = useRef(`sg${Math.random().toString(36).slice(2, 7)}`).current;
  const W = size + 8;
  const H = Math.round(W * 0.68);

  return (
    <div className="relative flex-shrink-0" style={{ width: W, height: H }}>
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}
        viewBox="0 0 80 56"
      >
        <defs>
          {/* Comet gradient: transparent at tail → bright at comet head */}
          <linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={color} stopOpacity="0.02" />
            <stop offset="55%"  stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
          <filter id={`${uid}f`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1e293b" strokeWidth="7"
          strokeDasharray={`${arcLen} ${fullC - arcLen}`}
          style={{ transform: `rotate(180deg)`, transformOrigin: `${cx}px ${cy}px` }} />

        {/* Soft glow halo */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${filledLen} ${fullC - filledLen}`} strokeLinecap="round"
          opacity="0.2" filter={`url(#${uid}f)`}
          style={{
            transform: `rotate(180deg)`, transformOrigin: `${cx}px ${cy}px`,
            transition: 'stroke-dasharray 1.2s cubic-bezier(.23,1,.32,1)',
          }} />

        {/* Comet arc with fade gradient */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={`url(#${uid})`} strokeWidth="7"
          strokeDasharray={`${filledLen} ${fullC - filledLen}`} strokeLinecap="round"
          style={{
            transform: `rotate(180deg)`, transformOrigin: `${cx}px ${cy}px`,
            transition: 'stroke-dasharray 1.2s cubic-bezier(.23,1,.32,1)',
          }} />

        {/* Comet head — bright dot at the arc tip */}
        <circle cx={cx} cy={cy} r="3.8" fill={color}
          style={{
            transform: `translate(${tipX - cx}px, ${tipY - cy}px)`,
            opacity: animPct > 1 ? 1 : 0,
            filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 9px ${color}90)`,
            transition: 'transform 1.2s cubic-bezier(.23,1,.32,1), opacity 0.3s',
          }} />
      </svg>

      {/* Percentage — centered symmetrically in the gauge mouth */}
      <div style={{
        position: 'absolute', bottom: 2, left: 0, right: 0,
        textAlign: 'center', lineHeight: 1,
      }}>
        <span style={{
          fontSize: Math.max(11, Math.round(W * 0.185)),
          fontWeight: 800,
          color,
          textShadow: `0 0 10px ${color}55`,
          transition: 'color 0.5s',
        }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}

const BREAKDOWN_ROWS = [
  { key: 'exact_score_points_earned',         label: 'תוצאה מדויקת', icon: '🎯' },
  { key: 'correct_outcome_points_earned',      label: 'כיוון נכון',    icon: '✅' },
  { key: 'both_teams_scored_points_earned',    label: 'הקבוצות כובשות', suffix: '2', icon: '⚽' },
  { key: 'goals_range_points_earned',          label: 'טווח שערים',   icon: '📊' },
];

function ScoreBreakdownAnimated({ prediction, match, outcomeType }) {
  const [visibleRows, setVisibleRows] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [showDonut, setShowDonut] = useState(false);
  const rowDelay = 700;

  useEffect(() => {
    setVisibleRows(0); setShowTotal(false); setShowDonut(false);
    BREAKDOWN_ROWS.forEach((_, i) => {
      setTimeout(() => setVisibleRows(v => Math.max(v, i + 1)), i * rowDelay);
    });
    setTimeout(() => setShowTotal(true), BREAKDOWN_ROWS.length * rowDelay + 400);
    setTimeout(() => setShowDonut(true), BREAKDOWN_ROWS.length * rowDelay + 900);
  }, [prediction.id]);

  const maxPoints = calculateMatchMaxPotentialPoints(match);
  const percentage = maxPoints > 0
    ? Math.min(100, Math.round((prediction.points_earned || 0) / maxPoints * 100))
    : 0;

  const c = OUTCOME_COLORS[outcomeType] || OUTCOME_COLORS.default;

  return (
    <div className="p-4 space-y-1">
      {BREAKDOWN_ROWS.map((row, i) => {
        const pts = prediction[row.key] || 0;
        return (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, x: -12 }}
            animate={visibleRows > i ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex justify-between items-center py-1.5 px-2 rounded-lg"
          >
            <span className={`text-xs font-bold tabular-nums ${pts > 0 ? c.text : 'text-slate-600'}`}>
              {pts > 0 ? `+${pts.toFixed(2)}` : '+0.00'}
            </span>
            <span className="text-white/70 text-xs inline-flex items-center gap-1">
                <span>{row.label}</span>
                {row.suffix && <span>{row.suffix}</span>}
              </span>
          </motion.div>
        );
      })}

      <AnimatePresence>
        {showTotal && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="mt-1"
          >
            <div className={`h-px mx-2 mb-2 ${c.divider}`} />
            <div className="flex justify-between items-center px-2">
              <span className={`text-sm font-bold tabular-nums ${c.text}`}>
                {(prediction.points_earned || 0).toFixed(2)}
              </span>
              <span className="text-white text-xs font-semibold">סה"כ</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDonut && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center gap-4 pt-3 px-2"
          >
            <motion.div
              className="flex flex-col items-start flex-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="text-white/50 text-xs mb-1">ניקוד שנצבר</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold tabular-nums ${c.text}`}>
                  {(prediction.points_earned || 0).toFixed(2)}
                </span>
                <span className="text-white/30 text-sm font-semibold">/ {maxPoints.toFixed(2)}</span>
              </div>
            </motion.div>
            <AnimatedDonut percentage={percentage} size={72} outcomeType={outcomeType} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FlipBoardPicker({ rounds, value, onChange }) {
  const idx = rounds.findIndex(r => r.id === value);
  const current = rounds[idx];
  const canPrev = idx > 0;
  const canNext = idx < rounds.length - 1;
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex items-center gap-3 w-full justify-center">
        <button onClick={() => canPrev && onChange(rounds[idx - 1].id)} disabled={!canPrev}
          className="w-9 h-9 flex items-center justify-center rounded-full disabled:opacity-20 hover:text-emerald-400 transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px) saturate(140%)', WebkitBackdropFilter: 'blur(16px) saturate(140%)', border: '1px solid rgba(52,211,153,0.28)', color: 'rgba(52,211,153,0.75)' }}>
          <ChevronUp className="w-5 h-5" />
        </button>
        <AnimatePresence mode="wait">
          <motion.div key={current?.id}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="px-8 py-2.5 rounded-xl border border-emerald-400/30 min-w-[180px] text-center"
            style={{ perspective: 600, background: 'linear-gradient(135deg, rgba(16,185,129,0.16) 0%, rgba(5,150,105,0.08) 100%)', backdropFilter: 'blur(16px) saturate(140%)', WebkitBackdropFilter: 'blur(16px) saturate(140%)' }}>
            <span
              className="font-bold text-base tracking-wide"
              style={{
                backgroundImage: 'linear-gradient(135deg, #a7f3d0 0%, #34d399 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
              }}
            >{current?.name}</span>
          </motion.div>
        </AnimatePresence>
        <button onClick={() => canNext && onChange(rounds[idx + 1].id)} disabled={!canNext}
          className="w-9 h-9 flex items-center justify-center rounded-full disabled:opacity-20 hover:text-emerald-400 transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px) saturate(140%)', WebkitBackdropFilter: 'blur(16px) saturate(140%)', border: '1px solid rgba(52,211,153,0.28)', color: 'rgba(52,211,153,0.75)' }}>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-1.5">
        {rounds.map((r, i) => (
          <button key={r.id} onClick={() => onChange(r.id)}
            className={`rounded-full transition-all duration-200 ${i === idx ? 'bg-emerald-400 w-4 h-1.5' : 'bg-slate-700 w-1.5 h-1.5 hover:bg-slate-500'}`} />
        ))}
      </div>
    </div>
  );
}

function IosRoundPicker({ rounds, value, onChange }) {
  const ref = useRef(null);
  const scrollTimer = useRef(null);

  useEffect(() => {
    if (!ref.current || !value) return;
    const idx = rounds.findIndex(r => r.id === value);
    if (idx === -1) return;
    ref.current.scrollTop = idx * ITEM_H;
  }, [value, rounds]);

  const commitScroll = () => {
    if (!ref.current) return;
    const idx = Math.max(0, Math.min(rounds.length - 1, Math.round(ref.current.scrollTop / ITEM_H)));
    ref.current.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
    if (rounds[idx] && rounds[idx].id !== value) onChange(rounds[idx].id);
  };

  const handleScroll = () => {
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(commitScroll, 120);
  };

  return (
    <div className="relative" style={{ height: ITEM_H * 3, width: 160 }}>
      <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: ITEM_H, background: 'linear-gradient(to bottom, rgba(8,15,35,0.95), transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: ITEM_H, background: 'linear-gradient(to top, rgba(8,15,35,0.95), transparent)' }} />
      <div className="absolute inset-x-2 z-10 pointer-events-none rounded-lg"
        style={{ top: ITEM_H, height: ITEM_H, background: 'rgba(9, 122, 220,0.08)', border: '1px solid rgba(9, 122, 220,0.28)' }} />
      <div
        ref={ref}
        onScroll={handleScroll}
        className="overflow-y-scroll scrollbar-hide h-full"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <div style={{ height: ITEM_H }} />
        {rounds.map((round, idx) => {
          const isSelected = round.id === value;
          return (
            <div
              key={round.id}
              style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
              className={`flex items-center justify-center cursor-pointer transition-all duration-200 text-sm font-semibold ${
                isSelected ? 'text-sky-400 scale-105' : 'text-white/35'
              }`}
              onClick={() => {
                onChange(round.id);
                ref.current?.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
              }}
            >
              {round.name}
            </div>
          );
        })}
        <div style={{ height: ITEM_H }} />
      </div>
    </div>
  );
}

export default function PredictionsResults() {
  const [user, setUser] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [selectedRound, setSelectedRound] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [revealComplete, setRevealComplete] = useState(false);
  const [finishedMatches, setFinishedMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: Add view mode state
  const [viewMode, setViewMode] = useState('all_predictions'); // 'all_predictions', 'my_predictions', or 'leaderboard'
  const [myRoundStats, setMyRoundStats] = useState(null);
  const [loadingMyStats, setLoadingMyStats] = useState(false);
  // NEW: Add leaderboard state
  const [roundLeaderboard, setRoundLeaderboard] = useState(null); // Changed to null initially as it's an object now, not an array
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const navigate = useNavigate();

  // Animation variants for dropdown
  const dropdownVariants = {
    visible: {
      clipPath: "inset(0% 0% 0% 0% round 12px)",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3
      }
    },
    hidden: {
      clipPath: "inset(10% 50% 90% 50% round 12px)",
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        type: "spring",
        bounce: 0
      }
    }
  };

  const itemVariants = {
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.2,
        delay: i * 0.05
      }
    }),
    hidden: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(4px)",
      transition: {
        duration: 0.1
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRound && matches.length > 0) {
      const roundMatches = matches.filter((m) =>
      m.round_id === selectedRound &&
      m.is_finished &&
      m.actual_score_a !== null &&
      m.actual_score_b !== null
      );
      setFinishedMatches(roundMatches);
      setCurrentMatchIndex(Math.max(roundMatches.length - 1, 0));
    }
  }, [selectedRound, matches]);

  const loadData = async () => {
    const startTime = Date.now();
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [roundsData, matchesData, predictionsData, profilesData] = await Promise.all([
      Round.list('order'),
      Match.list('order'),
      Prediction.list(),
      PublicProfile.list()]
      );

      setRounds(roundsData);
      setMatches(matchesData);
      setPredictions(predictionsData);
      setPublicProfiles(profilesData);

      // Set first round with finished matches as default
      const roundsWithFinishedMatches = roundsData.filter((round) =>
      matchesData.some((match) =>
      match.round_id === round.id &&
      match.is_finished &&
      match.actual_score_a !== null &&
      match.actual_score_b !== null
      )
      );

      if (roundsWithFinishedMatches.length > 0) {
        setSelectedRound(roundsWithFinishedMatches[roundsWithFinishedMatches.length - 1].id);
      }

    } catch (error) {
      console.error("Error loading data:", error);
    }

    // Ensure minimum 2 seconds loading time for animation
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 2000 - elapsedTime);
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }

    setLoading(false);
  };

  // NEW: Load user's personal stats for the selected round - wrapped with useCallback
  const loadMyRoundStats = useCallback(async (roundId) => {
    if (!user || !roundId) return;

    setLoadingMyStats(true);
    try {
      // CHANGED: Use frontend implementation instead of backend function
      const result = await calculateScoreByRound({
        userId: user.id,
        roundId: roundId
      });

      if (result && result.success !== false) {
        setMyRoundStats(result);
      } else {
        setMyRoundStats(null);
      }
    } catch (error) {
      console.error("Error loading my round stats:", error);
      setMyRoundStats(null);
    }
    setLoadingMyStats(false);
  }, [user]);

  // UPDATED: Load round leaderboard using frontend implementation
  const loadRoundLeaderboard = useCallback(async (roundId) => {
    if (!user || !roundId) return;

    setLoadingLeaderboard(true);
    try {
      // CHANGED: Use frontend implementation instead of backend function
      const result = await getRoundLeaderboard({
        roundId: roundId,
        currentUserId: user.id
      });
      
      if (result && result.success !== false) {
        setRoundLeaderboard(result);
      } else {
        setRoundLeaderboard(null);
      }
    } catch (error) {
      console.error("Error loading round leaderboard:", error);
      setRoundLeaderboard(null);
    }
    setLoadingLeaderboard(false);
  }, [user]); // Fixed: removed unnecessary dependencies

  // Update myRoundStats and roundLeaderboard when selectedRound changes
  useEffect(() => {
    if (selectedRound && user) {
      loadMyRoundStats(selectedRound);
      loadRoundLeaderboard(selectedRound);
    }
  }, [selectedRound, user, loadMyRoundStats, loadRoundLeaderboard]);

  const getUserDisplayName = (userId) => {
    const profile = publicProfiles.find((p) => p.user_id === userId);
    return profile?.display_name || `שחקן ${userId.slice(0, 8)}`;
  };

  const getMatchPredictions = (matchId) => {
    // Apply same deduplication logic as other components
    const matchPredictions = predictions.filter((p) => p.match_id === matchId);

    const uniquePredictionsMap = {};
    matchPredictions.forEach((prediction) => {
      const key = `${prediction.user_id}_${prediction.match_id}`;
      if (!uniquePredictionsMap[key] ||
      new Date(prediction.created_at) > new Date(uniquePredictionsMap[key].created_at)) {
        uniquePredictionsMap[key] = prediction;
      }
    });

    return Object.values(uniquePredictionsMap).
    sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0));
  };

  const handleRoundChange = (roundId) => {
    setSelectedRound(roundId);
    setCurrentMatchIndex(0);
  };

  const matchTrackRef = useRef(null);
  const chipStripRef = useRef(null);
  // Set right before setCurrentMatchIndex from the track's own scroll handler,
  // so the sync effect below doesn't fight an in-progress swipe gesture.
  const skipNextTrackSyncRef = useRef(false);
  // Debounces scroll events so currentMatchIndex updates once the swipe settles,
  // instead of on every tick — updating mid-drag flickered the chip strip/label.
  const scrollSettleTimeoutRef = useRef(null);

  // Cards/chips render newest-first (last match on the left), so the match
  // index and its left-to-right screen position are mirror images of each other.
  // The mapping is its own inverse, which is why one helper covers both directions.
  const displayPos = (i) => finishedMatches.length - 1 - i;

  const goToMatch = (i) => {
    setCurrentMatchIndex(i);
  };

  // Keep the active chip visible as the current match changes (swipe or tap)
  useEffect(() => {
    const chip = chipStripRef.current?.children[displayPos(currentMatchIndex)];
    chip?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [currentMatchIndex]);

  // Keep the swipeable track in sync whenever the active match changes
  // for a reason other than the user's own scroll (chip tap, default-to-last, round change).
  useEffect(() => {
    if (skipNextTrackSyncRef.current) {
      skipNextTrackSyncRef.current = false;
      return;
    }
    const el = matchTrackRef.current;
    if (!el) return;
    const target = displayPos(currentMatchIndex) * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 4) {
      el.scrollTo({ left: target, behavior: 'smooth' });
    }
  }, [currentMatchIndex, finishedMatches.length]);

  const handleMatchTrackScroll = () => {
    if (scrollSettleTimeoutRef.current) clearTimeout(scrollSettleTimeoutRef.current);
    scrollSettleTimeoutRef.current = setTimeout(() => {
      const el = matchTrackRef.current;
      if (!el) return;
      const width = el.clientWidth || 1;
      const pos = Math.round(el.scrollLeft / width);
      const i = displayPos(pos);
      if (i !== currentMatchIndex && i >= 0 && i < finishedMatches.length) {
        skipNextTrackSyncRef.current = true;
        setCurrentMatchIndex(i);
      }
    }, 120);
  };

  const getOutcomeStatus = (prediction, match) => {
    if (!prediction || !match.is_finished) return null;

    const predictedA = prediction.predicted_score_a;
    const predictedB = prediction.predicted_score_b;
    const actualA = match.actual_score_a;
    const actualB = match.actual_score_b;

    const isExactScore = predictedA === actualA && predictedB === actualB;
    const predictedOutcome = predictedA > predictedB ? 'win' : predictedA < predictedB ? 'lose' : 'draw';
    const actualOutcome = actualA > actualB ? 'win' : actualA < actualB ? 'lose' : 'draw';
    const isCorrectOutcome = predictedOutcome === actualOutcome;

    if (isExactScore) {
      return { type: 'exact', icon: '🎯' };
    } else if (isCorrectOutcome) {
      return { type: 'correct', icon: '✅' };
    } else {
      return { type: 'wrong', icon: null };
    }
  };

  // Reset reveal state when switching matches or view mode
  useEffect(() => {
    setRevealComplete(false);
  }, [currentMatchIndex, viewMode]);

  // Guard: if currentMatchIndex is out of bounds after round change, reset it
  useEffect(() => {
    if (finishedMatches.length > 0 && currentMatchIndex >= finishedMatches.length) {
      setCurrentMatchIndex(0);
    }
  }, [finishedMatches, currentMatchIndex]);

  // Determine if the current user has an exact hit for the currently displayed match
  const isCurrentMatchExactHit = (() => {
    if (!user || finishedMatches.length === 0) return false;
    const match = finishedMatches[currentMatchIndex];
    if (!match) return false;
    
    const myMatchPredictions = predictions.filter(p => p.match_id === match.id && p.user_id === user.id);
    if (myMatchPredictions.length === 0) return false;
    
    // Sort to get latest in case of multiple records, though typically deduplicated
    const prediction = myMatchPredictions.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];
    
    return getOutcomeStatus(prediction, match)?.type === 'exact';
  })();

  if (loading) return <LoadingScreen />;

  const availableRounds = rounds.filter((round) =>
  matches.some((match) =>
  match.round_id === round.id &&
  match.is_finished &&
  match.actual_score_a !== null &&
  match.actual_score_b !== null
  )
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-2">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-2">
          <button
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm text-white/70 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-white">ניחושים ותוצאות</h1>
            <p className="text-slate-400">צפה בניחושים ובניקוד של כל המשתתפים</p>
          </div>
        </div>

        {availableRounds.length === 0 ?
        <div className="text-center py-12">
            <Eye className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400 text-lg">אין עדיין מחזורים עם תוצאות סופיות</p>
            <p className="text-slate-500 text-sm mt-2">
              תוצאות יופיעו כאן לאחר סיום משחקים וחישוב נקודות
            </p>
          </div> :

        <>
            {/* Round Selector */}
            <div
              className="mb-6 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(250,204,21,0.25)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-2xl" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)' }} />
              <span className="text-base uppercase tracking-[0.16em] text-emerald-400/80 font-bold">בחר מחזור</span>
              <FlipBoardPicker
                rounds={availableRounds}
                value={selectedRound}
                onChange={handleRoundChange}
              />
            </div>

            {/* Finished Matches / Predictions View */}
            {finishedMatches.length === 0 ?
              <div className="text-center py-8">
                <p className="text-slate-400">אין משחקים שהסתיימו במחזור זה</p>
              </div> :
              <div
                className="rounded-2xl overflow-hidden mt-3 relative"
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(40px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)',
                }}
              >
                {/* Header with View Mode Toggle */}
                <div className="px-4 py-3">
                  {/* Glass tab bar */}
                  <div
                    className="relative flex p-1 mb-2 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(20px) saturate(160%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                      border: '1px solid rgba(34,197,94,0.45)',
                    }}
                  >
                    {[
                      { key: 'all_predictions', label: 'כל הניחושים'  },
                      { key: 'my_predictions',  label: 'הניחושים שלי' },
                      { key: 'leaderboard',     label: 'דירוג המחזור' },
                    ].map((tab, i, arr) => {
                      const active = viewMode === tab.key;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setViewMode(tab.key)}
                          className="relative flex-1 flex items-center justify-center py-1.5 px-1 rounded-xl transition-colors z-10"
                          style={{
                            color: '#fff',
                            borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.14)' : 'none',
                          }}
                        >
                          {active && (
                            <motion.div
                              layoutId="tab-pill"
                              className="absolute inset-0 rounded-xl"
                              style={{
                                background: 'linear-gradient(135deg, #16a34a 0%, #097adc 100%)',
                                boxShadow: '0 2px 12px rgba(22,163,74,0.35)',
                                opacity: 0.88,
                              }}
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                            />
                          )}
                          <span className="relative z-10 text-[11px] font-bold tracking-wide leading-tight text-center whitespace-nowrap">
                            {tab.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {viewMode === 'all_predictions' &&
                    <div className="flex flex-col gap-2">
                      <h3 className="text-white font-semibold text-sm text-center">
                        משחק {currentMatchIndex + 1} מתוך {finishedMatches.length}
                      </h3>

                      {/* Swipeable match card — snaps one match per screen-width */}
                      <div
                        ref={matchTrackRef}
                        onScroll={handleMatchTrackScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                      >
                        {finishedMatches.map((match, i) => i).reverse().map((i) => {
                          const match = finishedMatches[i];
                          return (
                            <div key={match.id} className="flex-none w-full snap-start flex items-center justify-center gap-3 py-1">
                              <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-6 h-6" rounded="md" />
                              <span className="text-white/30 text-xs font-semibold">vs</span>
                              <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-6 h-6" rounded="md" />
                            </div>
                          );
                        })}
                      </div>

                      {/* Chip strip — jump straight to any match, newest first */}
                      {finishedMatches.length > 1 &&
                        <div ref={chipStripRef} className="flex gap-1 overflow-x-auto px-0.5 scrollbar-hide">
                          {finishedMatches.map((match, i) => i).reverse().map((i) => {
                            const match = finishedMatches[i];
                            const active = i === currentMatchIndex;
                            return (
                              <button
                                key={match.id}
                                onClick={() => goToMatch(i)}
                                className="flex-none flex items-center gap-1 px-1.5 py-1 rounded-lg text-[10px] font-bold transition-all"
                                style={active
                                  ? { background: 'linear-gradient(135deg, #16a34a 0%, #097adc 100%)', color: '#04150c' }
                                  : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.55)' }}
                              >
                                <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-2.5 h-2.5" rounded="sm" />
                                <span className="tabular-nums">{match.actual_score_a}-{match.actual_score_b}</span>
                                <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-2.5 h-2.5" rounded="sm" />
                              </button>
                            );
                          })}
                        </div>
                      }
                    </div>
                  }

                  {viewMode === 'my_predictions' &&
                    <div className="text-center">
                      <h3 className="text-white font-semibold mb-2">
                        הניחושים שלי - {rounds.find((r) => r.id === selectedRound)?.name}
                      </h3>
                    </div>
                  }

                  {viewMode === 'leaderboard' &&
                    <div className="text-center">
                      <h3 className="text-white font-semibold mb-2">
                        {rounds.find((r) => r.id === selectedRound)?.name}
                      </h3>
                    </div>
                  }
                </div>

                {/* Gold gradient divider */}
                <div className="h-px mx-0 bg-gradient-to-r from-transparent via-sky-400/35 to-transparent" />

                {/* Content */}
                <div className="p-4">
                  {viewMode === 'all_predictions' &&
                    <PredictionsList
                      match={finishedMatches[currentMatchIndex]}
                      predictions={getMatchPredictions(finishedMatches[currentMatchIndex].id)}
                      getUserDisplayName={getUserDisplayName}
                      getOutcomeStatus={getOutcomeStatus}
                      onAllRevealed={() => setRevealComplete(true)} />
                  }

                  {viewMode === 'my_predictions' &&
                    <MyRoundPredictions
                      user={user}
                      roundStats={myRoundStats}
                      roundLeaderboard={roundLeaderboard}
                      loading={loadingMyStats}
                      loadingLeaderboard={loadingLeaderboard}
                      matches={finishedMatches}
                      getUserDisplayName={getUserDisplayName}
                      getOutcomeStatus={getOutcomeStatus} />
                  }

                  {viewMode === 'leaderboard' &&
                    <LeaderboardView
                      roundLeaderboard={roundLeaderboard}
                      loading={loadingLeaderboard}
                      user={user} />
                  }
                </div>

                {/* Confetti Animation for Exact Hit */}
                {isCurrentMatchExactHit && viewMode === 'all_predictions' && revealComplete && (
                  <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
                    <LottieAnimation
                      key={finishedMatches[currentMatchIndex]?.id}
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68656264510003eeef16bac3/c1df36a33_Blueconfetti.json"
                      loop={false}
                      autoplay={true}
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>
                )}
              </div>
            }
          </>
        }
      </div>
    </div>);

}

function PodiumStand({ entry, position, isCurrentUser, baseDelay = 0 }) {
  const rankColor  = position === 1 ? '#facc15' : position === 2 ? '#cbd5e1' : '#e3a869';
  const rankBg     = position === 1 ? 'rgba(250,204,21,0.1)'   : position === 2 ? 'rgba(203,213,225,0.08)' : 'rgba(227,168,105,0.1)';
  const rankBorder = position === 1 ? 'rgba(250,204,21,0.35)'  : position === 2 ? 'rgba(203,213,225,0.25)' : 'rgba(227,168,105,0.3)';
  const rankGlow   = position === 1 ? 'rgba(250,204,21,0.4)'   : position === 2 ? 'rgba(203,213,225,0.2)'  : 'rgba(227,168,105,0.3)';
  const heights    = { 1: 56, 2: 38, 3: 28 };
  const [revealed, setRevealed] = useState(false);

  if (!entry) return <div className="flex-1" />;

  const podiumDelay = baseDelay + (position === 1 ? 0.7 : position === 2 ? 0.35 : 0.1);

  return (
    <motion.div
      className="flex-1 flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: podiumDelay, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
      onAnimationComplete={() => setRevealed(true)}
    >
      {/* Name — rank color */}
      <span style={{ color: rankColor, fontSize: 11, fontWeight: 800, textAlign: 'center',
        maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        display: 'block', lineHeight: 1.3 }}>
        {entry.displayName}
      </span>
      {/* Points — rank color, slightly dimmer */}
      <span style={{ color: rankColor, opacity: 0.72, fontSize: 11, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
        <OdometerValue target={entry.totalPoints} height={14} width={7} trigger={revealed} />
      </span>
      {/* Olympic Classic platform */}
      <div style={{
        width: '100%',
        height: heights[position],
        position: 'relative',
        overflow: 'hidden',
        background: rankBg,
        borderTop: `3px solid ${rankColor}`,
        borderLeft: `1px solid ${rankBorder}`,
        borderRight: `1px solid ${rankBorder}`,
        borderRadius: '4px 4px 0 0',
        boxShadow: `0 -4px 16px ${rankGlow}, inset 0 2px 8px rgba(255,255,255,0.04)`,
        ...(isCurrentUser ? { outline: '2px solid rgba(96,165,250,0.45)', outlineOffset: 2 } : {}),
      }}>
        {/* Ghost rank number */}
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, fontWeight: 900,
          color: rankColor, opacity: 0.15,
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}>
          {position}
        </span>
      </div>
    </motion.div>
  );
}

function LeaderboardView({ roundLeaderboard, loading, user }) {
  const [revealedRanks, setRevealedRanks] = useState(() => new Set());
  useEffect(() => { setRevealedRanks(new Set()); }, [roundLeaderboard]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <CircleLoader size={60} />
      </div>
    );
  }

  if (!roundLeaderboard || !roundLeaderboard.allParticipants || roundLeaderboard.allParticipants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">אין נתונים זמינים עבור מחזור זה</p>
      </div>
    );
  }

  const REVEAL_DELAY = 0.35;

  const participants = roundLeaderboard.allParticipants;
  const top3 = [1, 2, 3].map(r => participants.find(e => e.rank === r));
  const rest  = participants.filter(e => e.rank > 3).sort((a, b) => a.rank - b.rank);

  // הפודיום מופיע אחרי כל השורות
  const podiumBaseDelay = rest.length * REVEAL_DELAY + 0.3;

  return (
    <div className="space-y-4">
      {/* Podium — מופיע אחרון */}
      <div className="pt-2 pb-1">
        <div className="flex items-end justify-center gap-2 px-4">
          <PodiumStand entry={top3[1]} position={2} isCurrentUser={top3[1]?.isCurrentUser} baseDelay={podiumBaseDelay} />
          <PodiumStand entry={top3[0]} position={1} isCurrentUser={top3[0]?.isCurrentUser} baseDelay={podiumBaseDelay} />
          <PodiumStand entry={top3[2]} position={3} isCurrentUser={top3[2]?.isCurrentUser} baseDelay={podiumBaseDelay} />
        </div>
        <div className="h-2 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full mx-4" />
      </div>

      {/* שאר המשתתפים — נחשפים מהאחרון לראשון */}
      {rest.length > 0 && (
        <div className="space-y-1.5">
          {rest.map((entry, i) => {
            // אינדקס הפוך: האחרון (i = rest.length-1) מקבל delay=0, מקום 4 (i=0) מקבל delay הכי גדול
            const delay = (rest.length - 1 - i) * REVEAL_DELAY;
            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.35, ease: 'easeOut' }}
                onAnimationComplete={() => setRevealedRanks(prev => prev.has(entry.rank) ? prev : new Set(prev).add(entry.rank))}
                className={`flex items-center justify-between text-sm px-3 py-2 rounded-xl ${
                  entry.isCurrentUser
                    ? 'bg-blue-600/20 border border-blue-400/30'
                    : 'bg-slate-700/40 border border-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white/70">
                    {entry.rank}
                  </span>
                  <span className="text-white font-medium">{entry.displayName}</span>
                </div>
                <span className="text-green-400 font-bold tabular-nums">
                  <OdometerValue target={entry.totalPoints} height={17} width={9} trigger={revealedRanks.has(entry.rank)} />
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// NEW: Updated MyRoundPredictions WITHOUT leaderboard section
function MyRoundPredictions({ user, roundStats, loading, loadingLeaderboard, roundLeaderboard, matches, getUserDisplayName, getOutcomeStatus }) {
  // חייב להיות לפני כל return מוקדם (כלל Hooks)

  if (loading || loadingLeaderboard) {
    return (
      <div className="flex justify-center py-8">
        <CircleLoader size={60} />
      </div>
    );
  }

  const hasMyStats = roundStats && roundStats.predictionDetails && roundStats.predictionDetails.length > 0;
  const hasLeaderboard = roundLeaderboard && roundLeaderboard.success && roundLeaderboard.currentUser && roundLeaderboard.currentUser.rank && roundLeaderboard.totalParticipants;

  if (!hasMyStats) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">אין נתונים זמינים עבור מחזור זה</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* My Round Summary with Ranking */}
      {hasMyStats && (() => {
        const earned  = roundStats.summary?.totalRoundPoints || 0;
        const maxPts  = matches.reduce((acc, m) => acc + calculateMatchMaxPotentialPoints(m), 0);
        const pct     = maxPts > 0 ? Math.round((earned / maxPts) * 100) : 0;
        const pctColor = pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-sky-400' : 'text-red-400';

        return (
          <div
            className="rounded-2xl p-5 mb-4 flex flex-col items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-xs uppercase tracking-[0.18em] text-white/60 font-semibold">סיכום ניחושים שלי</span>

            {/* Big score */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-5xl font-black tabular-nums leading-none text-white">
                {earned.toFixed(2)}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-white/65 text-sm">מתוך {maxPts.toFixed(2)} נקודות</span>
                <span className={`text-sm font-bold tabular-nums ${pctColor}`}>({pct}%)</span>
              </div>
              {roundStats.predictionDetails.length > 0 && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-white/40 text-xs">ממוצע למשחק</span>
                  <span className="text-white/70 text-xs font-bold tabular-nums">
                    {(earned / roundStats.predictionDetails.length).toFixed(2)} pts
                  </span>
                </div>
              )}
            </div>

            {/* Rank */}
            {hasLeaderboard && (
              <div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
              >
                <span className="text-blue-300 text-xs font-semibold">מקום</span>
                <span className="text-white font-bold text-sm">{roundLeaderboard.currentUser.rank}</span>
                <span className="text-blue-300/50 text-xs">מתוך {roundLeaderboard.totalParticipants}</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Individual Match Predictions (My Predictions) */}
      {hasMyStats &&
      <>
          <h4 className="text-white font-semibold mb-3 text-center">הניחושים שלי למשחקי המחזור</h4>
          <div className="space-y-3">
            {roundStats.predictionDetails.map((detail, index) => {
              const match = matches.find((m) => m.id === detail.matchId);
              if (!match) return null;

              const isFinished = detail.actual !== 'Not finished';
              const verdictBorder =
                !isFinished              ? 'border-white/10' :
                detail.exactScore        ? 'border-emerald-500/40' :
                detail.correctOutcome    ? 'border-sky-500/35' :
                                           'border-red-500/30';
              const verdictGlow =
                !isFinished              ? '' :
                detail.exactScore        ? 'shadow-[0_0_16px_rgba(16,185,129,0.15)]' :
                detail.correctOutcome    ? 'shadow-[0_0_16px_rgba(245,158,11,0.12)]' :
                                           'shadow-[0_0_16px_rgba(239,68,68,0.10)]';
              const accentBg  = !isFinished ? 'rgba(100,116,139,0.18)' : detail.exactScore ? 'rgba(16,185,129,0.18)' : detail.correctOutcome ? 'rgba(245,158,11,0.18)' : 'rgba(239,68,68,0.14)';
              const accentFg  = !isFinished ? '#64748b' : detail.exactScore ? '#10b981' : detail.correctOutcome ? '#f59e0b' : '#ef4444';
              const matchMax  = calculateMatchMaxPotentialPoints(match);
              const matchPct  = matchMax > 0 ? Math.round((detail.points / matchMax) * 100) : 0;

              return (
                <motion.div
                  key={detail.matchId}
                  initial={{ opacity: 0, rotateX: 80, y: -30 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  transition={{ delay: index * 0.18, duration: 0.5, ease: 'easeOut' }}
                  className="rounded-2xl p-3 flex gap-3"
                  style={{ background: '#12181f', border: `1px solid ${accentFg}33` }}
                >
                  {/* Left — team names */}
                  <div className="flex flex-col justify-center gap-1 w-[90px] shrink-0">
                    <div className="flex items-center gap-1.5">
                      <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-4 h-4 shrink-0" rounded="sm" />
                      <span className="text-white/75 text-[11px] font-semibold leading-tight break-words">{match.team_a}</span>
                    </div>
                    <span className="text-white/25 text-[9px] font-bold px-1">vs</span>
                    <div className="flex items-center gap-1.5">
                      <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-4 h-4 shrink-0" rounded="sm" />
                      <span className="text-white/75 text-[11px] font-semibold leading-tight break-words">{match.team_b}</span>
                    </div>
                  </div>

                  {/* Middle — prediction / result grid */}
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div className="rounded-xl flex flex-col items-center justify-center py-2.5" style={{ background: 'rgba(59,130,246,0.12)' }}>
                      <span className="text-[8px] text-blue-400 font-bold uppercase tracking-wider mb-1">ניחוש שלך</span>
                      <span className="text-white font-black text-lg tabular-nums leading-none">{detail.prediction}</span>
                    </div>
                    <div className="rounded-xl flex flex-col items-center justify-center py-2.5" style={{ background: accentBg }}>
                      <span className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color: accentFg }}>תוצאה</span>
                      <span className="text-white font-black text-lg tabular-nums leading-none">{isFinished ? detail.actual : '–'}</span>
                    </div>
                  </div>

                  {/* Right — badge */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    {isFinished ? (
                      <div className="flex items-center rounded-xl overflow-hidden" style={{ border: `1px solid ${accentFg}55`, background: `${accentFg}10` }}>
                        <span className="px-2 py-1.5 text-[10px] font-black tabular-nums leading-none" style={{ color: accentFg }}>
                          {detail.points.toFixed(2)} PTS
                        </span>
                        <div className="flex items-center justify-center w-6 self-stretch" style={{ background: `${accentFg}28` }}>
                          {(detail.exactScore || detail.correctOutcome)
                            ? <Check size={11} strokeWidth={3} style={{ color: accentFg }} />
                            : <X size={11} strokeWidth={3} style={{ color: accentFg }} />
                          }
                        </div>
                      </div>
                    ) : (
                      <span className="text-base leading-none">⏳</span>
                    )}
                  </div>
                </motion.div>
              );
          })}
          </div>
        </>
      }
    </div>);

}

// רכיב נפרד לרשימת הניחושים עם פירוט הניקוד מתוקן
function PredictionsList({ match, predictions, getUserDisplayName, getOutcomeStatus, onAllRevealed }) {
  const [expandedPrediction, setExpandedPrediction] = useState(null);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  // Tracks which rows have actually finished their own opacity/blur reveal —
  // see OdometerValue.jsx for why this (not IntersectionObserver) is what
  // must gate the points-pill roll animation.
  const [revealedIds, setRevealedIds] = useState(() => new Set());

  const REVEAL_DELAY = 0.45; // שניות בין חשיפת כל שחקן

  // מיין מהגבוה לנמוך — הגבוה בראש, הנמוך בתחתית ומופיע ראשון
  const sortedPredictions = [...predictions].sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0));

  const bottomRef = useRef(null);

  useEffect(() => {
    setShockwaveActive(false);
    setRevealedIds(new Set());
    if (sortedPredictions.length === 0) { onAllRevealed?.(); return; }
    // גלול לתחתית כך שהמשתמש רואה את החשיפה הראשונה (הנמוך) ומעלה למנצח
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
    const lastRevealTime = (sortedPredictions.length - 1) * REVEAL_DELAY + 0.5;
    // הפעל shockwave 300ms אחרי שהמוביל נחשף
    const shockTimer = setTimeout(() => setShockwaveActive(true), lastRevealTime * 1000 + 300);
    const timer = setTimeout(() => onAllRevealed?.(), lastRevealTime * 1000);
    return () => { clearTimeout(timer); clearTimeout(shockTimer); };
  }, [match?.id]);

  if (predictions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">אין ניחושים למשחק זה</p>
      </div>);
  }

  return (
    <div className="space-y-1.5">
      {sortedPredictions.map((prediction, index) => {
        const outcomeStatus = getOutcomeStatus(prediction, match);
        const isExpanded = expandedPrediction === prediction.id;
        // מקום N (תחתית) מופיע ראשון (delay=0), מקום 1 (ראש) מופיע אחרון
        const revealDelay = (sortedPredictions.length - 1 - index) * REVEAL_DELAY;

        const verdictStyle =
          outcomeStatus?.type === 'exact'   ? { background:'rgba(16,185,129,0.07)', backdropFilter:'blur(20px)', border:'1px solid rgba(52,211,153,0.28)', boxShadow:'0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(52,211,153,0.12)' } :
          outcomeStatus?.type === 'correct' ? { background:'rgba(245,158,11,0.07)',  backdropFilter:'blur(20px)', border:'1px solid rgba(251,191,36,0.28)',  boxShadow:'0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(251,191,36,0.12)'  } :
          outcomeStatus?.type === 'wrong'   ? { background:'rgba(239,68,68,0.07)',   backdropFilter:'blur(20px)', border:'1px solid rgba(248,113,113,0.25)', boxShadow:'0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(248,113,113,0.08)' } :
                                              { background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.09)', boxShadow:'0 4px 24px rgba(0,0,0,0.3),  inset 0 1px 0 rgba(255,255,255,0.06)'  };

        const rankStyle =
          outcomeStatus?.type === 'exact'   ? { background:'transparent', border:'1.5px solid rgba(52,211,153,0.6)',  color:'#6ee7b7' } :
          outcomeStatus?.type === 'correct' ? { background:'transparent', border:'1.5px solid rgba(251,191,36,0.6)',  color:'#fde68a' } :
          outcomeStatus?.type === 'wrong'   ? { background:'transparent', border:'1.5px solid rgba(248,113,113,0.6)', color:'#fca5a5' } :
                                              { background:'transparent', border:'1.5px solid rgba(255,255,255,0.2)', color:'#94a3b8' };

        const ptsBadgeStyle =
          outcomeStatus?.type === 'exact'   ? { background:'rgba(16,185,129,0.15)',  border:'1px solid rgba(52,211,153,0.35)',  color:'#6ee7b7' } :
          outcomeStatus?.type === 'correct' ? { background:'rgba(245,158,11,0.15)',  border:'1px solid rgba(251,191,36,0.35)',  color:'#fde68a' } :
          outcomeStatus?.type === 'wrong'   ? { background:'rgba(239,68,68,0.15)',   border:'1px solid rgba(248,113,113,0.3)', color:'#fca5a5' } :
                                              { background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'#94a3b8' };

        // shockwave מהמוביל כלפי מטה — כל קלף מקבל delay לפי מיקומו
        const shockDelay = index * 0.12;

        return (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, filter: 'blur(16px)', scale: 0.85 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            transition={{ delay: revealDelay, duration: 0.45, ease: 'easeOut' }}
            onAnimationComplete={() => setRevealedIds(prev => prev.has(prediction.id) ? prev : new Set(prev).add(prediction.id))}
            className="relative rounded-xl overflow-hidden"
            style={verdictStyle}>

            {/* Shockwave ring — רק על המוביל */}
            {index === 0 && shockwaveActive && (
              <>
                <motion.div
                  key="ring1"
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 2.2 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{ border: '2px solid rgba(9, 122, 220,0.7)', zIndex: 10 }}
                />
                <motion.div
                  key="ring2"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{ border: '2px solid rgba(9, 122, 220,0.4)', zIndex: 10 }}
                />
              </>
            )}

            {/* Cascade glow על כל הקלפים מתחת */}
            {shockwaveActive && (
              <motion.div
                key={`glow-${prediction.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.18, 0] }}
                transition={{ duration: 0.5, delay: shockDelay, ease: 'easeOut' }}
                className="absolute inset-0 pointer-events-none rounded-lg"
                style={{ background: 'rgba(9, 122, 220,0.25)', zIndex: 5 }}
              />
            )}

            {/* פרטי הניחוש הבסיסיים */}
            <div className="py-2 px-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedPrediction(isExpanded ? null : prediction.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-opacity hover:opacity-70 flex-shrink-0"
                    style={rankStyle}>
                    {index + 1}
                  </button>

                  <div className="flex-1 flex flex-col items-center">
                    <button
                      onClick={() => setExpandedPrediction(isExpanded ? null : prediction.id)}
                      className="text-white font-medium text-sm hover:text-blue-300 transition-colors text-center mb-0.5">
                      {getUserDisplayName(prediction.user_id)}
                    </button>
                    <div className="text-slate-400 text-base flex items-center gap-1">
                      <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-5 h-5" rounded="sm" />
                      <span className="text-slate-50 pr-2 pl-2 text-sm font-medium">{prediction.predicted_score_a} - {prediction.predicted_score_b}</span>
                      <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-5 h-5" rounded="sm" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-bold tabular-nums px-2.5 py-1 rounded-lg"
                    style={ptsBadgeStyle}>
                    <OdometerValue target={prediction.points_earned || 0} trigger={revealedIds.has(prediction.id)} /> PTS
                  </span>
                  {outcomeStatus?.type === 'exact'   && <span className="text-base">🎯</span>}
                  {outcomeStatus?.type === 'correct' && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg"
                      style={{ background:'rgba(251,191,36,0.15)', border:'1px solid rgba(251,191,36,0.35)' }}>
                      <Check className="w-3.5 h-3.5 text-amber-400" strokeWidth={3} />
                    </span>
                  )}
                  {outcomeStatus?.type === 'wrong' && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-sm"
                      style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(248,113,113,0.3)', color:'rgba(248,113,113,0.9)' }}>✕</span>
                  )}
                </div>
              </div>
            </div>

            {/* פירוט הניקוד - נפתח בלחיצה */}
            <AnimatePresence>
              {isExpanded &&
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`border-t bg-black/20 ${
                  outcomeStatus?.type === 'exact'   ? 'border-emerald-400/35' :
                  outcomeStatus?.type === 'correct' ? 'border-sky-400/35' :
                  outcomeStatus?.type === 'wrong'   ? 'border-red-400/30' :
                  'border-white/8'
                }`}>
                  <ScoreBreakdownAnimated prediction={prediction} match={match} outcomeType={outcomeStatus?.type} />
              </motion.div>}
            </AnimatePresence>
          </motion.div>);

      })}
      <div ref={bottomRef} />
    </div>);

}